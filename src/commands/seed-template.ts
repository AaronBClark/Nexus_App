import { SlashCommandBuilder } from "discord.js";
import { MissionTemplateSchema } from "../packets/missionTemplate.js";
import { savePacket } from "../db/repo.js";

export const seedTemplateCommand = {
  data: new SlashCommandBuilder()
    .setName("seed-template")
    .setDescription("Create and store a sample MissionTemplate packet"),

  async execute(interaction: any) {
    const now = new Date().toISOString();

    const packet = {
      id: "nx:mtpl/trash-pickup-v1",
      type: "MissionTemplate",
      schema_version: "1.0",
      packet_version: "1.0.0",
      created_at: now,
      updated_at: now,
      scope: { level: "MultiScope", element_id: "nx:el/uprising_underground" },
      publish: { visibility: "public", allow_mirroring: true },
      authorship: { platform: "discord", user_id: interaction.user.id, attributed_element_id: "nx:el/uprising_underground" },
      integrity: { content_hash: null, sig: null },
      relations: { parent_id: null, template_id: null, related_ids: [] },

      mission_template: {
        name: "Trash Pickup",
        summary: "Pick up litter in a defined area and document results.",
        tags: ["cleanup", "environment"],
        supported_scopes: ["Solo", "Team", "Node", "MultiScope"],
        objectives: [
          { id: "obj_01", text: "Remove litter from a defined outdoor area" },
          { id: "obj_02", text: "Safely dispose of collected litter" }
        ],
        fields: {
          location: { label: "Location", type: "string", required: true },
          date: { label: "Date", type: "date", required: true }
        }
      }
    };

    const parsed = MissionTemplateSchema.safeParse(packet);
    if (!parsed.success) {
      return interaction.reply({
        content: "❌ Template packet failed validation:\n```json\n" +
          JSON.stringify(parsed.error.format(), null, 2) +
          "\n```",
        ephemeral: true,
      });
    }

    savePacket(parsed.data as any);
    await interaction.reply(`✅ Stored MissionTemplate: \`${packet.id}\``);
  },
};