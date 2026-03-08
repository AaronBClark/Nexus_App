import type { InteractionReplyOptions } from "discord.js";
import { normalizeMessagePayload } from "../../../payload/discordPayload.js";
import { getPacketLinks } from "../../../../../core/graph/getPacketLinks.js";
import { toDiscordLinkOptions } from "../../../views/linkOptions.js";
import { renderPacketCard } from "../../../views/renderPacketCard.js";

export async function renderAndEdit(ix: any, packet: any, opts?: { page?: number }) {
  const links = getPacketLinks(packet.id);

  const view = renderPacketCard(
    packet,
    {
      outgoing: toDiscordLinkOptions(links.outgoing),
      incoming: toDiscordLinkOptions(links.incoming),
    },
    { page: opts?.page ?? 0 }
  );

  return ix.editReply(
    normalizeMessagePayload({
    content: `Viewing: \`${packet.id}\``,      ...view,
    }) as InteractionReplyOptions
  );
}