import dotenv from "dotenv";
import { client } from "./bot/client.js";
import { pingCommand } from "./commands/ping.js";
dotenv.config();
client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === "ping") {
        await pingCommand.execute(interaction);
    }
});
client.login(process.env.DISCORD_TOKEN);
