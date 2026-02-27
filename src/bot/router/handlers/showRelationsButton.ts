import { ActionRowBuilder, StringSelectMenuBuilder, type ButtonInteraction } from "discord.js";
import { getPacketById, listOutgoingLinks } from "../../../db/repo.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import { renderPacket } from "../../../ui/renderers/index.js";
import { buildSelectOptionsFromLinks } from "../shared/options.js";
import { getCustomIdSafe } from "../parseCustomId.js";

function stripMenuByPrefix(components: any[] | undefined, prefix: string) {
  if (!components?.length) return components ?? [];
  return components.filter((row: any) => {
    const c0 = row?.components?.[0];
    const id = c0?.custom_id ?? c0?.data?.custom_id;
    return !(typeof id === "string" && id.startsWith(prefix));
  });
}

export async function handleShowRelationsButton(ix: ButtonInteraction, payloadRaw: string) {
  const targetId = getCustomIdSafe(ix);
  const target = await getPacketById(targetId);

  if (!target) {
    return ix.editReply({ content: `Not found: ${targetId}`, embeds: [], components: [] });
  }

  const outgoing:any = listOutgoingLinks(targetId); // [{ rel, to_id }]
  const options = buildSelectOptionsFromLinks(outgoing, "outgoing");

  const view = renderPacket(target);

  // ✅ remove old relations menu before adding new
  view.components = stripMenuByPrefix(view.components, "nx:view_packet_select|relations|");

  if (!options.length) {
        return ix.editReply(normalizeMessagePayload({
        content: `Viewing: \`${target.id}\``,
        ...view
        }));
  }

  const nonce = Date.now().toString(36);
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`nx:view_packet_select|relations|${nonce}`)
    .setPlaceholder(`Outgoing links (${options.length})…`)
    .addOptions(options);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
  view.components = [...(view.components ?? []), row];

  return ix.editReply(normalizeMessagePayload(view));
}