import { EmbedBuilder } from "discord.js";

export function basePacketEmbed(packet: any) {
  const title = packet.labels?.title ?? packet.id;
  const type = packet.type ?? "Packet";

  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(`**Type:** ${type}\n**ID:** \`${packet.id}\``)
    .setFooter({ text: "Nexus" });
}