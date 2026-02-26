import dotenv from "dotenv";
import { client } from "./bot/client.js";
import { routeComponentInteractions } from "./bot/router/componentRouter.js";
import { routeCommandInteractions } from "./bot/router.commands.js";

dotenv.config();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  // Component interactions first (buttons/selects/modals)
  await routeComponentInteractions(interaction);
  // Then command + autocomplete
  await routeCommandInteractions(interaction);
});

client.on("error", (err) => {
  console.error("Discord client error:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

client.login(process.env.DISCORD_TOKEN);