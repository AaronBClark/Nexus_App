import type { Client, Interaction } from "discord.js";
import { pingCommand } from "../commands/ping.js";
import { listPacketsCommand } from "../commands/list-packets.js";
import { seedCommand } from "../commands/seed.js";

export async function routeCommandInteractions(interaction: Interaction) {
  // Autocomplete first
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "seed") {
      return seedCommand.autocomplete(interaction);
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "ping":
      return pingCommand.execute(interaction);
    case "seed":
      return seedCommand.execute(interaction);
    case "list-packets":
      return listPacketsCommand.execute(interaction);
    default:
      return;
  }
}