import { SlashCommandBuilder } from "discord.js";
import { listPacketsByType } from "../db/repo.js";

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
    ),

  async execute(interaction: any) {
    const type = interaction.options.getString("type");
    const limit = interaction.options.getInteger("limit") ?? 10;

    const items = listPacketsByType(type, limit);

    if (items.length === 0) {
      return interaction.reply(`(empty) No packets of type \`${type}\``);
    }

    const lines = items.map((p: any) => `• \`${p.id}\` (${p.created_at})`);
    await interaction.reply(`📦 ${type} (latest ${items.length}):\n${lines.join("\n")}`);
  },
};