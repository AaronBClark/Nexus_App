// src/adapters/discord/views/packetEmbed.ts
import { EmbedBuilder } from "discord.js";

export function basePacketEmbed(packet: any, description?: string) {
  const title = packet.labels?.title ?? packet.id;
  const type = packet.type ?? "Packet";

  const base = `**Type:** ${type}\n**ID:** \`${packet.id}\``;
  const desc = description ? `${base}\n\n${description}` : base;

  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(desc)
    .setFooter({ text: "Nexus" });
}