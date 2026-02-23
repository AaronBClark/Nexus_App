import { SlashCommandBuilder } from "discord.js";
export const pingCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check if the bot is alive"),
    async execute(interaction) {
        await interaction.reply("🏓 Pong!");
    },
};
