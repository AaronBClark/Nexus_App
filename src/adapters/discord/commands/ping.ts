import { SlashCommandBuilder } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is alive"),

  async execute(interaction: any) {
    await interaction.reply("🏓 Pong!");
  },
};