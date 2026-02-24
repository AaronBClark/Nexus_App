import dotenv from "dotenv";
import { client } from "./bot/client.js";
import { pingCommand } from "./commands/ping.js";
import { listPacketsCommand } from "./commands/list-packets.js";
import { seedTemplateCommand } from "./commands/seed-template.js";

dotenv.config();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await pingCommand.execute(interaction);
  }

  if (interaction.commandName === "seed-template") {
    await seedTemplateCommand.execute(interaction);
  }

  if (interaction.commandName === "list-packets") {
    await listPacketsCommand.execute(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);