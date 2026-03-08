// src/adapters/discord/views/renderPacketCard.ts
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  type SelectMenuComponentOptionData,
} from "discord.js";
import { basePacketEmbed } from "./packetEmbed.js";
import type { Packet } from "../../../core/packets/types.js";
import { flattenPacket } from "../../../core/view/flattenPacket.js";

function encodeId(id: string): string {
  return Buffer.from(id).toString("base64url");
}

type LinkOptions = {
  outgoing?: SelectMenuComponentOptionData[];
  incoming?: SelectMenuComponentOptionData[];
};

function buildLinksSelectRow(opts: {
  kind: "outgoing" | "incoming";
  packetId: string;
  options: SelectMenuComponentOptionData[];
  emptyPlaceholder: string;
  nonEmptyPlaceholder: string;
}) {
  const nonce = Date.now().toString(36);
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`nx:view_packet_select|${opts.kind}|${encodeId(opts.packetId)}|${nonce}`)
    .setPlaceholder(opts.options.length ? opts.nonEmptyPlaceholder : opts.emptyPlaceholder)
    .setDisabled(opts.options.length === 0);

  if (opts.options.length) {
    menu.addOptions(opts.options.slice(0, 25));
  } else {
    menu.addOptions([{ label: "—", value: "__none__" }]);
  }

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}


function formatPath(path: string): string {
  // Convert dot paths into breadcrumbs, keep [i] indexes
  // mission_report.snapshot.date => mission_report › snapshot › date
  return path.replace(/\./g, " › ");
}

function formatPathParts(path: string): { ancestry: string; leaf: string } {
  const parts = path.split(".");
  const leaf = parts.pop() ?? path;
  const ancestry = parts.join(" › ");
  return { ancestry, leaf };
}

function formatLine(path: string, _depth: number, value: string): string {
  const { ancestry, leaf } = formatPathParts(path);
  const safeValue = value.length > 400 ? value.slice(0, 399) + "…" : value;

  if (!ancestry) {
    return `**${leaf}**: ${safeValue}`;
  }

  return `${ancestry} › **${leaf}**: ${safeValue}`;
}

function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const p = Math.min(Math.max(page, 0), totalPages - 1);
  const start = p * perPage;
  return {
    page: p,
    totalPages,
    slice: items.slice(start, start + perPage),
  };
}

function buildPagerRow(packetId: string, page: number, totalPages: number) {
  const nonce = Date.now().toString(36);

  const prev = new ButtonBuilder()
    .setCustomId(`nx:view_packet_page|prev|${encodeId(packetId)}|${page}|${nonce}`)
    .setLabel("Prev")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page <= 0);

  const next = new ButtonBuilder()
    .setCustomId(`nx:view_packet_page|next|${encodeId(packetId)}|${page}|${nonce}`)
    .setLabel("Next")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page >= totalPages - 1);

  const indicator = new ButtonBuilder()
    .setCustomId(`nx:view_packet_page|noop|${encodeId(packetId)}|${page}|${nonce}`)
    .setLabel(`Page ${page + 1}/${totalPages}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(prev, indicator, next);
}

export function renderPacketCard(
  packet: Packet,
  links?: LinkOptions,
  opts?: { page?: number; perPage?: number }
) {
  const page = opts?.page ?? 0;
  const perPage = opts?.perPage ?? 40; // tune later

  const { headerLines, bodyLines } = flattenPacket(packet as any);

  const headerText = headerLines.length
    ? headerLines.map((l) => `**${l.path}:** \`${l.value}\``).join("\n")
    : "";

  const { page: p, totalPages, slice } = paginate(bodyLines, page, perPage);

  const bodyText = slice.map((l) => formatLine(l.path, l.depth, l.value)).join("\n");
  const descriptionParts = [];
  if (headerText) descriptionParts.push(headerText);
  descriptionParts.push("**Data:**");
  descriptionParts.push(bodyText || "_(no data lines)_");

  const embed = basePacketEmbed(packet, descriptionParts.join("\n\n"));

  const outgoing = links?.outgoing ?? [];
  const incoming = links?.incoming ?? [];

  const components = [
    buildPagerRow(packet.id, p, totalPages),
    buildLinksSelectRow({
      kind: "outgoing",
      packetId: packet.id,
      options: outgoing,
      emptyPlaceholder: "No outgoing links",
      nonEmptyPlaceholder: `Outgoing links (${outgoing.length})…`,
    }),
    buildLinksSelectRow({
      kind: "incoming",
      packetId: packet.id,
      options: incoming,
      emptyPlaceholder: "No incoming links",
      nonEmptyPlaceholder: `Incoming links (${incoming.length})…`,
    }),
  ];

  return { embeds: [embed], components };
}