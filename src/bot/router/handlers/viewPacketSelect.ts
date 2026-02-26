import type { StringSelectMenuInteraction } from "discord.js";
import { getPacketById } from "../../../db/repo.js";
import { renderAndEdit } from "../shared/renderAndEdit.js";

export async function handleViewPacketSelect(ix: StringSelectMenuInteraction) {
  const selectedId = ix.values[0];
  const packet = await getPacketById(selectedId);

  if (!packet) {
    return ix.editReply({ content: `Packet not found: ${selectedId}`, embeds: [], components: [] });
  }

  return renderAndEdit(ix, packet);
}