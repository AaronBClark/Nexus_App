import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  type Interaction,
} from "discord.js";
import { packetIdCodec } from "../ui/components/packetCard.js";
import { renderPacket } from "../ui/renderers/index.js";
import { getPacketById, listIncomingLinks, getObjectsByIds } from "../db/repo.js";
import { normalizeMessagePayload } from "../ui/discordPayload.js";
import { listOutgoingLinks } from "../db/repo.js";

function getCustomIdSafe(ix: Interaction): string {
  if (ix.isButton() || ix.isAnySelectMenu() || ix.isModalSubmit()) return ix.customId;
  return "";
}

/**
 * Prefer: action|payload|nonce...
 * But tolerate older: nx:action:Suffix
 */
function parseAction(customId: string): string {
  const left = customId.split("|", 1)[0];
  const parts = left.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : left;
}

export async function routeComponentInteractions(interaction: Interaction) {
  const customId = getCustomIdSafe(interaction);
  if (!customId) return;

  // Log once here (keeps index clean)
  console.log("[ix]", interaction.type, customId);

  // ---------- Buttons ----------
  if (interaction.isButton()) {
    // Standard pipe form: action|payload
    const [actionRaw, payloadRaw = ""] = interaction.customId.split("|");
    const action = parseAction(actionRaw);

    // Always ACK fast for buttons
    await interaction.deferUpdate();

    if (action === "nx:view_packet_btn") {
      // payload should be base64url encoded packet id
      const packetId = packetIdCodec.decode(payloadRaw);
      const packet = await getPacketById(packetId);

      if (!packet) {
        return interaction.editReply({ content: `Not found: ${packetId}`, embeds: [], components: [] });
      }

      const view = renderPacket(packet);
      return interaction.editReply(normalizeMessagePayload(view));
    }

    if (action === "nx:show_backlinks") {
      const targetId = packetIdCodec.decode(payloadRaw);
      const target = await getPacketById(targetId);

      if (!target) {
        return interaction.editReply({ content: `Not found: ${targetId}`, embeds: [], components: [] });
      }

      const incoming = listIncomingLinks(targetId); // [{ rel, from_id }]
      const fromIds = [...new Set(incoming.map((x: any) => x.from_id))].slice(0, 25);

      const objs = getObjectsByIds(fromIds);
      const byId = new Map(objs.map((o: any) => [o.id, o]));

      const options = fromIds.map((id) => {
        const o: any = byId.get(id);
        let title = id;
        try {
          const json = o?.content_json ? JSON.parse(o.content_json) : null;
          title = (json?.labels?.title ?? json?.title ?? id).toString();
        } catch {}
        return {
          label: title.slice(0, 100),
          description: (o?.type ?? "Object").slice(0, 100),
          value: id,
        };
      });

      const view = renderPacket(target);

      if (options.length) {
        const nonce = Date.now().toString(36);
        const menu = new StringSelectMenuBuilder()
          .setCustomId(`nx:view_packet_select|backlinks|${nonce}`)
          .setPlaceholder("Referenced by...")
          .addOptions(options);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
        view.components = [...(view.components ?? []), row];
      }

      return interaction.editReply(normalizeMessagePayload(view));
    }
    if (action === "nx:show_relations") {
        await interaction.deferUpdate();

        const targetId = packetIdCodec.decode(payloadRaw);
        const target = await getPacketById(targetId);
        if (!target) return interaction.editReply({ content: `Not found: ${targetId}`, embeds: [], components: [] });

        const outgoing = listOutgoingLinks(targetId); // [{ rel, to_id }]
        const toIds = [...new Set(outgoing.map((x: any) => x.to_id))].slice(0, 25);

        const objs = getObjectsByIds(toIds);
        const byId = new Map(objs.map((o: any) => [o.id, o]));

        const options = toIds.map((id) => {
            const o: any = byId.get(id);
            let title = id;
            try {
            const json = o?.content_json ? JSON.parse(o.content_json) : null;
            title = (json?.labels?.title ?? json?.title ?? id).toString();
            } catch {}
            return { label: title.slice(0, 100), description: (o?.type ?? "Object").slice(0, 100), value: id };
        });

  const view = renderPacket(target);

  if (options.length) {
    const nonce = Date.now().toString(36);
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`nx:view_packet_select|relations|${nonce}`)
      .setPlaceholder("Outgoing relations...")
      .addOptions(options);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
    view.components = [...(view.components ?? []), row];
  }

  return interaction.editReply(normalizeMessagePayload(view));
}

    // Unknown button action, no-op (already deferred)
    return;
  }

  // ---------- Select Menus ----------
  if (interaction.isStringSelectMenu()) {
    const [actionRaw] = interaction.customId.split("|");
    const action = parseAction(actionRaw);

    console.log("[ix select]", action, "customId=", interaction.customId, "values=", interaction.values);

    if (action === "nx:view_packet_select") {
      await interaction.deferUpdate();

      const selectedId = interaction.values[0];
      const packet = await getPacketById(selectedId);

      if (!packet) {
        return interaction.editReply({ content: `Packet not found: ${selectedId}`, embeds: [], components: [] });
      }

      const view = renderPacket(packet);

      return interaction.editReply(normalizeMessagePayload(view));
    }

    return interaction.deferUpdate();
  }
}