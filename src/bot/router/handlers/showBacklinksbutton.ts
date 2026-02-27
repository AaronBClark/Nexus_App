import { ActionRowBuilder, StringSelectMenuBuilder, type ButtonInteraction } from "discord.js";
import { getPacketById, listIncomingLinks } from "../../../db/repo.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import { renderPacket } from "../../../ui/renderers/index.js";
import { buildSelectOptionsFromLinks } from "../shared/options.js";
import { getCustomIdSafe } from "../parseCustomId.js";


function stripMenuByPrefix(components: any[] | undefined, prefix: string) {
  if (!components?.length) return components ?? [];
  return components.filter((row: any) => {
    const c0 = row?.components?.[0];
    const id = c0?.custom_id ?? c0?.data?.custom_id; // covers raw vs builders
    return !(typeof id === "string" && id.startsWith(prefix));
  });
}

export async function handleShowBacklinksButton(ix: ButtonInteraction, payloadRaw: string) {
  const targetId = getCustomIdSafe(ix);
  const target = await getPacketById(targetId);

  if (!target) {
    return ix.editReply({ content: `Not found: ${targetId}`, embeds: [], components: [] });
  }

  const incoming:any = listIncomingLinks(targetId); // [{ rel, from_id }]
  const options = buildSelectOptionsFromLinks(incoming, "incoming");
  const view = renderPacket(target);

  // ✅ remove old backlinks menu before adding a new one (prevents stacking)
  view.components = stripMenuByPrefix(view.components, "nx:view_packet_select|backlinks|");

  // ✅ empty state (no more “button does nothing”)
  if (!options.length) {
    const payload = normalizeMessagePayload(view);
    return ix.editReply(normalizeMessagePayload({
        content: `Viewing: \`${target.id}\``,
        ...payload
        }));
  }

  const nonce = Date.now().toString(36);
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`nx:view_packet_select|backlinks|${nonce}`)
    .setPlaceholder(`Referenced by (${options.length})…`)
    .addOptions(options);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
  view.components = [...(view.components ?? []), row];

  const payload = normalizeMessagePayload(view);
  return ix.editReply(payload);
}