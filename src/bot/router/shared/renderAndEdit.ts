import { renderPacket } from "../../../ui/renderers/index.js";
import { normalizeMessagePayload } from "../../../ui/discordPayload.js";
import type {
  ButtonInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

type EditableInteraction = ButtonInteraction | StringSelectMenuInteraction;

export async function renderAndEdit(
  interaction: EditableInteraction,
  packet: any
) {
  const view = renderPacket(packet);
  return interaction.editReply(normalizeMessagePayload(view));
}