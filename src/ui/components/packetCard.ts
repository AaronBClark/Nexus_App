import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";
import { basePacketEmbed } from "./packetEmbed.js";
import type { Packet, PacketType } from "../../packets/types.js";

/**
 * Safely encode packet IDs for customId usage
 */
function encodeId(id: string): string {
  return Buffer.from(id).toString("base64url");
}
function decodeId(id: string): string {
  return Buffer.from(id, "base64url").toString("utf8");
}

/**
 * Find the "main section" of a packet dynamically
 * (mission, module, program, etc.)
 */
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

/**
 * Add generic fields to embed (no hardcoding)
 */
function addFieldsFromSection(embed: any, section: Record<string, any>) {
  for (const [key, value] of Object.entries(section)) {
    if (value === null || value === undefined) continue;

    // Skip noisy / large objects for now
    if (typeof value === "object") continue;

    embed.addFields({
      name: key,
      value: String(value).slice(0, 1024),
      inline: true,
    });
  }
}

/**
 * Extract relationship IDs dynamically
 */
function collectRelations(packet: Packet): string[] {
  const rels = new Set<string>();
  const section = getPrimarySection(packet);
  if (!section) return [];

  for (const [key, value] of Object.entries(section)) {
    if (!value) continue;

    if (typeof value === "string" && key.endsWith("_id")) {
      rels.add(value);
    }

    if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === "string") rels.add(v);
      }
    }
  }

  return [...rels];
}

/**
 * Primary relation buttons (important ones only)
 */
function buildPrimaryButtons(packet: Packet) {
  const section = getPrimarySection(packet);
  if (!section) return null;

  const keys = [
    "parent_id",
    "template_id",
    "initiative_id",
    "program_id",
    "campaign_id",
  ];

  const row = new ActionRowBuilder<ButtonBuilder>();

  for (const key of keys) {
    const val = (section as any)[key];
    if (!val) continue;

    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`nx:view_packet_btn|${encodeId(val)}`)
        .setLabel(key.replace("_id", ""))
        .setStyle(ButtonStyle.Secondary)
    );
  }

  return row.components.length ? row : null;
}

/**
 * Dropdown for all related packets
 */
function buildRelationSelect(packet: Packet) {
  const relations = collectRelations(packet);
  const nonce = Date.now().toString(36);

  if (!relations.length) return null;

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    
    new StringSelectMenuBuilder()
      .setCustomId(`nx:view_packet_select|${encodeId(packet.id)}|${nonce}`)
      .setPlaceholder("Open related packet...")
      .addOptions(
        relations.slice(0, 25).map((id) => ({
          label: id.split(":").pop() || id,
          value: id,
        }))
      )
  );
}

/**
 * MAIN RENDER FUNCTION
 */
export function renderPacketCard(packet: Packet) {
  const embed = basePacketEmbed(packet);

  const section = getPrimarySection(packet);
  if (section) {
    addFieldsFromSection(embed, section);
  }

  const components = [];

  const buttons = buildPrimaryButtons(packet);
  if (buttons) components.push(buttons);

  const select = buildRelationSelect(packet);
  if (select) components.push(select);

  return {
    embeds: [embed],
    components,
  };
}

/**
 * Expose decoder for interaction handlers
 */
export const packetIdCodec = {
  encode: encodeId,
  decode: decodeId,
};