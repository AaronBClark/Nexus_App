import type { ButtonInteraction } from "discord.js";
import { getPacketById } from "../../../../../db/repo.js";
import { renderAndEdit } from "../shared/renderAndEdit.js";
import { getCustomIdSafe } from "../parseCustomId.js";


export async function handleViewPacketButton(ix: ButtonInteraction, payloadRaw: string) {
  const packetId = getCustomIdSafe(ix);
  const packet = await getPacketById(packetId);

  if (!packet) {
    return ix.editReply({ content: `Not found: ${packetId}`, embeds: [], components: [] });
  }

  return renderAndEdit(ix, packet);
}