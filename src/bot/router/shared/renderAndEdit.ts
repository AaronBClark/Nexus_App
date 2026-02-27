import type { InteractionReplyOptions } from "discord.js";
import type { Interaction } from "discord.js";
import { renderPacket } from "../../../ui/renderers/index.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import { listIncomingLinks, listOutgoingLinks } from "../../../db/repo.js";

function uniqLimit(ids: string[], limit: number) {
  return [...new Set(ids)].slice(0, limit);
}

export async function renderAndEdit(ix: any, packet: any) {
  const outgoing = listOutgoingLinks(packet.id);
  const incoming = listIncomingLinks(packet.id);

  const outgoingIds = uniqLimit(outgoing.map((x: any) => String(x.to_id)), 25);
  const incomingIds = uniqLimit(incoming.map((x: any) => String(x.from_id)), 25);

  const view = renderPacket(packet, { outgoingIds, incomingIds });

  // Optional: update message content too
  (view as any).content = `Viewing: \`${packet.id}\``;

  return ix.editReply(normalizeMessagePayload(view));
}