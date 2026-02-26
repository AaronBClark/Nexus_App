import { ActionRowBuilder, StringSelectMenuBuilder, type ButtonInteraction } from "discord.js";
import { packetIdCodec } from "../../../ui/components/packetCard.js";
import { getPacketById, listIncomingLinks } from "../../../db/repo.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import { renderPacket } from "../../../ui/renderers/index.js";
import { buildSelectOptionsByIds, toStringIds } from "../shared/optionsFromIds.js";

export async function handleShowBacklinksButton(ix: ButtonInteraction, payloadRaw: string) {
  const targetId = packetIdCodec.decode(payloadRaw);
  const target = await getPacketById(targetId);

  if (!target) {
    return ix.editReply({ content: `Not found: ${targetId}`, embeds: [], components: [] });
  }

  const incoming = listIncomingLinks(targetId); // [{ rel, from_id }]
  const fromIds = toStringIds(incoming.map((x: any) => x.from_id), 25);
  const options = buildSelectOptionsByIds(fromIds);

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
  console.log("rows before:", view.components?.length);
  const payload = normalizeMessagePayload(view);
  console.log("rows after:", payload.components?.length);
  return ix.editReply(payload);
}