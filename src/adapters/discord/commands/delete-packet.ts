import { SlashCommandBuilder } from "discord.js";
import { deletePacketById, getPacketById } from "../../../db/repo.js";

export const deletePacketCommand = {
  data: new SlashCommandBuilder()
    .setName("delete-packet")
    .setDescription("Delete a packet/object by id (and its links/refs)")
    .addStringOption((opt) =>
      opt
        .setName("id")
        .setDescription("Packet id, e.g. nx:el/aaron_clark")
        .setRequired(true)
    )
    .addBooleanOption((opt) =>
      opt
        .setName("confirm")
        .setDescription("Required safety toggle")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    const id = interaction.options.getString("id", true);
    const confirm = interaction.options.getBoolean("confirm", true);

    if (!confirm) {
      return interaction.reply({
        content: "Refusing to delete without confirm=true.",
        ephemeral: true,
      });
    }

    const existing = getPacketById(id);
    if (!existing) {
      return interaction.reply({ content: `Not found: \`${id}\``, ephemeral: true });
    }

    const changes = deletePacketById(id);

    return interaction.reply({
      content: changes
        ? `🗑️ Deleted \`${id}\` (plus links/refs).`
        : `Nothing deleted for \`${id}\` (already gone).`,
      ephemeral: true,
    });
  },
};