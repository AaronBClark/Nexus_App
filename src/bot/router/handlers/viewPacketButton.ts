import type { ButtonInteraction } from "discord.js";
import { packetIdCodec } from "../../../ui/components/packetCard.js";
import { getPacketById } from "../../../db/repo.js";
import { renderAndEdit } from "../shared/renderAndEdit.js";

export async function handleViewPacketButton(ix: ButtonInteraction, payloadRaw: string) {
  const packetId = packetIdCodec.decode(payloadRaw);
  const packet = await getPacketById(packetId);

  if (!packet) {
    return ix.editReply({ content: `Not found: ${packetId}`, embeds: [], components: [] });
  }

  return renderAndEdit(ix, packet);
}