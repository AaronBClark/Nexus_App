import type { StringSelectMenuInteraction } from "discord.js";
import { getPacketById } from "../../../db/repo.js";
import { renderAndEdit } from "../shared/renderAndEdit.js";
import { decodeLinkOptionValue } from "../../../adapters/discord/views/linkOptions.js";

function extractSelectedPacketId(raw: string): string {
  // Link menu values are encoded as direction|rel|id
  if (raw.includes("|")) {
    return decodeLinkOptionValue(raw).id;
  }
  // Packet list menu values are plain packet ids
  return raw;
}

export async function handleViewPacketSelect(ix: StringSelectMenuInteraction) {
  const raw = ix.values[0];
  if (!raw || raw === "__none__") return;

  const selectedId = extractSelectedPacketId(raw);
  const packet = getPacketById(selectedId);

  if (!packet) {
    return ix.editReply({
      content: `Packet not found: ${selectedId}`,
      embeds: [],
      components: [],
    });
  }

  return renderAndEdit(ix, packet);
}