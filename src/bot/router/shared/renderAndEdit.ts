import type { InteractionReplyOptions } from "discord.js";
import { listIncomingLinks, listOutgoingLinks } from "../../../db/repo.js";
import { renderPacket } from "../../../ui/renderers/index.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import { buildSelectOptionsFromLinks } from "./options.js"; // adjust path

export async function renderAndEdit(ix: any, packet: any) {
  const outgoing:any = listOutgoingLinks(packet.id);   // [{ rel, to_id }]
  const incoming:any = listIncomingLinks(packet.id);   // [{ rel, from_id }]

  const outgoingOpts = buildSelectOptionsFromLinks(outgoing, "outgoing");
  const incomingOpts = buildSelectOptionsFromLinks(incoming, "incoming");

  const view = renderPacket(packet, {
    outgoing: outgoingOpts,
    incoming: incomingOpts,
  });

  return ix.editReply(normalizeMessagePayload(view) as InteractionReplyOptions);
}