import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { listPacketsByType } from "../../../db/repo.js";
import { CUSTOM_ID } from "../app/customIds.js";

export const listPacketsCommand = {
  data: new SlashCommandBuilder()
    .setName("list-packets")
    .setDescription("List stored packets by type")
    .addStringOption((opt: any) =>
      opt.setName("type")
        .setDescription("Packet type")
        .setRequired(true)
        .addChoices(
          { name: "MissionTemplate", value: "MissionTemplate" },
          { name: "MissionPlan", value: "MissionPlan" },
          { name: "MissionReport", value: "MissionReport" },
          { name: "Module", value: "Module" },
          { name: "Policy", value: "Policy" },
          { name: "Element", value: "Element" },
          { name: "Initiative", value: "Initiative" },
          { name: "Program", value: "Program" },
          { name: "Campaign", value: "Campaign" },
        )
    )
    .addIntegerOption((opt: any) =>
      opt.setName("limit").setDescription("Max results").setRequired(false)
    )
    .addBooleanOption(opt =>
      opt.setName("public")
        .setDescription("Post publicly (default: ephemeral)")
        .setRequired(false)
    ),

  async execute(interaction: any) {
    const type = interaction.options.getString("type");
    const limit = interaction.options.getInteger("limit") ?? 10;
    const isPublic = interaction.options.getBoolean("public") ?? false;


    const items = listPacketsByType(type, limit);

    if (!items || items.length === 0) {
      return interaction.reply({ content: `(empty) No packets of type \`${type}\``, ephemeral: true });
    }

    const lines = items.map((p: any) => `• \`${p.id}\` (${p.created_at})`);

    // Dropdown options (max 25)
    const options = items.slice(0, 25).map((p: any) => ({
      label: (p.labels?.title ?? p.id).slice(0, 100),
      description: p.id.slice(0, 100),
      value: p.id, // we'll fetch by id when selected
    }));

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`${CUSTOM_ID.VIEW_PACKET_SELECT}|${type}`)
      .setPlaceholder("Select a packet to preview")
      .addOptions(options);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    return interaction.reply({
      content: `📦 ${type} (latest ${items.length}):\n${lines.join("\n")}`,
      components: [row],
      ephemeral: !isPublic,
    });
  },
};