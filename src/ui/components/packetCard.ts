import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  type SelectMenuComponentOptionData,
} from "discord.js";
import { basePacketEmbed } from "./packetEmbed.js";
import type { Packet } from "../../packets/types.js";

function encodeId(id: string): string {
  return Buffer.from(id).toString("base64url");
}

function getPrimarySection(packet: Packet): Record<string, any> | null {
  const keys = Object.keys(packet).filter(
    (k) => !["id", "type", "created_at", "updated_at"].includes(k)
  );
  for (const key of keys) {
    const val = (packet as any)[key];
    if (val && typeof val === "object" && !Array.isArray(val)) return val;
  }
  return null;
}

function addFieldsFromSection(embed: any, section: Record<string, any>) {
  for (const [key, value] of Object.entries(section)) {
    if (value == null) continue;
    if (typeof value === "object") continue;
    embed.addFields({ name: key, value: String(value).slice(0, 1024), inline: true });
  }
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

export function renderPacketCard(packet: Packet, links?: LinkOptions) {
  const embed = basePacketEmbed(packet);
  const section = getPrimarySection(packet);
  if (section) addFieldsFromSection(embed, section);

  const outgoing = links?.outgoing ?? [];
  const incoming = links?.incoming ?? [];

  const components = [
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