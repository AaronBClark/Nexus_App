import dotenv from "dotenv";
import { client } from "./bot/client.js";
import { pingCommand } from "./commands/ping.js";
import { listPacketsCommand } from "./commands/list-packets.js";
import { seedCommand } from "./commands/seed.js";

dotenv.config();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  // ✅ Handle autocomplete first
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "seed") {
      return seedCommand.autocomplete(interaction);
    }
    return;
  }

  // ✅ Then handle slash commands
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return pingCommand.execute(interaction);
  }

  if (interaction.commandName === "seed") {
    return seedCommand.execute(interaction);
  }

  if (interaction.commandName === "list-packets") {
    return listPacketsCommand.execute(interaction);
  }
});

client.on("error", (err) => {
  console.error("Discord client error:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

client.login(process.env.DISCORD_TOKEN);