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
function collectRelations(packet: any): string[] {
  const rels = new Set<string>();

  // 1) Header graph edges (authoritative in your schema)
  const r = packet.relations;
  if (r) {
    if (r.parent_id) rels.add(r.parent_id);
    if (r.template_id) rels.add(r.template_id);
    if (r.initiative_id) rels.add(r.initiative_id);
    if (r.program_id) rels.add(r.program_id);
    if (r.campaign_id) rels.add(r.campaign_id);
    for (const id of r.related_ids ?? []) rels.add(id);
  }

  // 2) Dependencies graph edges
  for (const d of packet.deps ?? []) {
    if (d?.ref) rels.add(d.ref);
  }

  // 3) Optional: also scan body for legacy/extra refs (keep your old behavior)
  const section = getPrimarySection(packet);
  if (section) {
    for (const [key, value] of Object.entries(section)) {
      if (!value) continue;
      if (typeof value === "string" && key.endsWith("_id")) rels.add(value);
      if (Array.isArray(value)) for (const v of value) if (typeof v === "string") rels.add(v);
    }
  }

  // Don’t include self
  rels.delete(packet.id);

  return [...rels];
}

/**
 * Primary relation buttons (important ones only)
 */
function buildPrimaryButtons(packet: any) {
  const r = packet.relations;
  if (!r) return null;

  const seenTargets = new Set<string>();
  const rows: ActionRowBuilder<ButtonBuilder>[] = [new ActionRowBuilder<ButtonBuilder>()];

  const addButton = (btn: ButtonBuilder) => {
    let row = rows[rows.length - 1];
    if (row.components.length >= 5) {
      row = new ActionRowBuilder<ButtonBuilder>();
      rows.push(row);
    }
    row.addComponents(btn);
  };

  const mapping: Array<[keyof typeof r, string]> = [
    ["parent_id", "parent"],
    ["template_id", "template"],
    ["initiative_id", "initiative"],
    ["program_id", "program"],
    ["campaign_id", "campaign"],
  ];

  for (const [key, label] of mapping) {
    const val = r[key] as string | null | undefined;
    if (!val) continue;
    if (seenTargets.has(val)) continue;
    seenTargets.add(val);

    addButton(
      new ButtonBuilder()
        .setCustomId(`nx:view_packet_btn|${encodeId(val)}`)
        .setLabel(label)
        .setStyle(ButtonStyle.Secondary)
    );
  }

  // Add "referenced by" ONCE
  addButton(
    new ButtonBuilder()
      .setCustomId(`nx:show_backlinks|${encodeId(packet.id)}`)
      .setLabel("referenced by")
      .setStyle(ButtonStyle.Secondary)
  );

  // (Optional) Add "show relations" ONCE
  addButton(
    new ButtonBuilder()
      .setCustomId(`nx:show_relations|${encodeId(packet.id)}`)
      .setLabel("relations")
      .setStyle(ButtonStyle.Secondary)
  );

  const nonEmpty = rows.filter((row) => row.components.length > 0);
  return nonEmpty.length ? nonEmpty : null;
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
  if (section) addFieldsFromSection(embed, section);

  const components: any[] = [];

  const buttons = buildPrimaryButtons(packet);
  if (Array.isArray(buttons)) components.push(...buttons);
  else if (buttons) components.push(buttons);

  const select = buildRelationSelect(packet);
  if (select) components.push(select);

  return {
    content: `📦 Viewing: \`${packet.id}\``,
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