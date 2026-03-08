// src/bot/handlers/buttons/viewPacketPage.ts
import type { ButtonInteraction } from "discord.js";
import { renderPacketCard } from "../../../adapters/discord/views/renderPacketCard.js";
import { toDiscordLinkOptions } from "../../../adapters/discord/views/linkOptions.js";
import { getPacketById } from "../../../db/repo.js";
import { getPacketLinks } from "../../../core/graph/getPacketLinks.js";

export async function handleViewPacketPageButton(interaction: ButtonInteraction) {
  const parts = interaction.customId.split("|");
  const dir = parts[1];
  const packetId = Buffer.from(parts[2], "base64url").toString("utf8");
  const curPage = Number(parts[3] ?? "0");

  if (dir === "noop") {
    await interaction.deferUpdate();
    return;
  }

  const nextPage = dir === "next" ? curPage + 1 : Math.max(0, curPage - 1);

  const packet = getPacketById(packetId);
  if (!packet) {
    await interaction.reply({
      content: `Packet not found: \`${packetId}\``,
      ephemeral: true,
    });
    return;
  }

  const links = getPacketLinks(packetId);

  const view = renderPacketCard(
    packet,
    {
      outgoing: toDiscordLinkOptions(links.outgoing),
      incoming: toDiscordLinkOptions(links.incoming),
    },
    { page: nextPage }
  );

  await interaction.editReply(view);
}