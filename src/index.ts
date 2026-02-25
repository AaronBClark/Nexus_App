import dotenv from "dotenv";
import { client } from "./bot/client.js";
import { pingCommand } from "./commands/ping.js";
import { listPacketsCommand } from "./commands/list-packets.js";
import { seedCommand } from "./commands/seed.js";
import { CUSTOM_ID } from "./bot/customIds.js";
import { packetIdCodec } from "./ui/components/packetCard.js";
import { renderPacket } from "./ui/renderers/index.js";
import { getPacketById } from "./db/repo.js";

dotenv.config();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
const customId =
  interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()
    ? interaction.customId
    : "";

console.log("[ix]", interaction.type, customId);
  // ✅ Handle autocomplete first
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "seed") {
      return seedCommand.autocomplete(interaction);
    }
    return;
  }

  
  if (interaction.isButton()) {
    const [action, encoded] = interaction.customId.split("|");

    if (action === "nx:view_packet_btn") {
      const packetId = packetIdCodec.decode(encoded);

      const packet = await getPacketById(packetId);
      if (!packet) return interaction.reply({ content: "Not found", ephemeral: true });

      return interaction.update(renderPacket(packet));
    }
  }

  function parseAction(customId: string) {
    // supports both:
    // nx:view_packet_select:MissionTemplate
    // nx:view_packet_select|<payload>
    const left = customId.split("|", 1)[0];
    const parts = left.split(":");
    // action is "nx:<actionName>"
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : left;
  }

  function parseSuffix(customId: string) {
    const left = customId.split("|", 1)[0];
    const parts = left.split(":");
    return parts.length >= 3 ? parts.slice(2).join(":") : "";
  }

  if (interaction.isStringSelectMenu()) {
    const [action, encodedOrigin] = interaction.customId.split("|");
    console.log("[ix select]", action, "customId=", interaction.customId, "values=", interaction.values);

    if (action === "nx:view_packet_select") {
      await interaction.deferUpdate();

      const selectedId = interaction.values[0]; // e.g. 'nx:el/uprising_underground'
      const packet = await getPacketById(selectedId);

      if (!packet) {
        return interaction.editReply({
          content: `Packet not found: ${selectedId}`,
          components: [],
          embeds: [],
        });
      }

      return interaction.editReply(renderPacket(packet));
    }
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