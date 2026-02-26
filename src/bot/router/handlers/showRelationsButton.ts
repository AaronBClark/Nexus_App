import { ActionRowBuilder, StringSelectMenuBuilder, type ButtonInteraction } from "discord.js";
import { packetIdCodec } from "../../../ui/components/packetCard.js";
import { getPacketById, listOutgoingLinks } from "../../../db/repo.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import { renderPacket } from "../../../ui/renderers/index.js";
import { buildSelectOptionsByIds, toStringIds } from "../shared/optionsFromIds.js";

export async function handleShowRelationsButton(ix: ButtonInteraction, payloadRaw: string) {
  const targetId = packetIdCodec.decode(payloadRaw);
  const target = await getPacketById(targetId);

  if (!target) {
    return ix.editReply({ content: `Not found: ${targetId}`, embeds: [], components: [] });
  }

  const outgoing = listOutgoingLinks(targetId); // [{ rel, to_id }]
  const toIds = toStringIds(outgoing.map((x: any) => x.to_id), 25);
  const options = buildSelectOptionsByIds(toIds);

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

  return ix.editReply(normalizeMessagePayload(view));
}