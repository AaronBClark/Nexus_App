import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { basePacketEmbed } from "./packetEmbed.js";
import type { Packet } from "../../packets/types.js";

/**
 * Safely encode packet IDs for customId usage
 */
function encodeId(id: string): string {
  return Buffer.from(id).toString("base64url");
}
function decodeId(id: string): string {
  return Buffer.from(id, "base64url").toString("utf8");
}

function getPrimarySection(packet: Packet): Record<string, any> | null {
  const keys = Object.keys(packet).filter(
    (k) => !["id", "type", "created_at", "updated_at"].includes(k)
  );

  for (const key of keys) {
    const val = (packet as any)[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return val;
    }
  }
  return null;
}

function addFieldsFromSection(embed: any, section: Record<string, any>) {
  for (const [key, value] of Object.entries(section)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "object") continue;

    embed.addFields({
      name: key,
      value: String(value).slice(0, 1024),
      inline: true,
    });
  }
}

type LinkState = {
  outgoingIds?: string[];
  incomingIds?: string[];
};

function buildLinksSelectRow(opts: {
  kind: "outgoing" | "incoming";
  packetId: string;
  ids: string[];
  placeholderWhenEmpty: string;
  placeholderWhenHas: string;
}) {
  const { kind, packetId, ids, placeholderWhenEmpty, placeholderWhenHas } = opts;
  const nonce = Date.now().toString(36);

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`nx:view_packet_select|${kind}|${encodeId(packetId)}|${nonce}`)
    .setPlaceholder(ids.length ? placeholderWhenHas : placeholderWhenEmpty)
    .setDisabled(ids.length === 0);

  if (ids.length) {
    menu.addOptions(
      ids.slice(0, 25).map((id) => ({
        label: id.split(":").pop() || id,
        value: id,
      }))
    );
  } else {
    // Discord requires at least 1 option unless disabled? If disabled, it's okay,
    // but some clients still behave weirdly. This safe dummy keeps it stable.
    menu.addOptions([{ label: "—", value: "__none__" }]);
  }

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

/**
 * MAIN RENDER FUNCTION
 */
export function renderPacketCard(packet: Packet, links?: LinkState) {
  const embed = basePacketEmbed(packet);

  const section = getPrimarySection(packet);
  if (section) addFieldsFromSection(embed, section);

  const outgoingIds = links?.outgoingIds ?? [];
  const incomingIds = links?.incomingIds ?? [];

  const components = [
    buildLinksSelectRow({
      kind: "outgoing",
      packetId: packet.id,
      ids: outgoingIds,
      placeholderWhenEmpty: "No outgoing links",
      placeholderWhenHas: "Outgoing links…",
    }),
    buildLinksSelectRow({
      kind: "incoming",
      packetId: packet.id,
      ids: incomingIds,
      placeholderWhenEmpty: "No incoming links",
      placeholderWhenHas: "Incoming links…",
    }),
  ];

  return { embeds: [embed], components };
}

export const packetIdCodec = { encode: encodeId, decode: decodeId };