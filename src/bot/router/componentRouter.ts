import type { Interaction } from "discord.js";
import { getCustomIdSafe, parseAction, splitPipe } from "./parseCustomId.js";
import { handleViewPacketButton } from "./handlers/viewPacketButton.js";
import { handleShowBacklinksButton } from "./handlers/showBacklinksbutton.js";
import { handleShowRelationsButton } from "./handlers/showRelationsButton.js";
import { handleViewPacketSelect } from "./handlers/viewPacketSelect.js";
import { handleViewPacketPageButton } from "./handlers/viewPacketPage.js";

export async function routeComponentInteractions(interaction: Interaction) {
  const customId = getCustomIdSafe(interaction);
  if (!customId) return;

  console.log("[ix]", interaction.type, customId);

  // Buttons
  if (interaction.isButton()) {
    const { actionRaw, payloadRaw } = splitPipe(customId);
    const action = parseAction(actionRaw);

    await interaction.deferUpdate();

    if (action === "nx:view_packet_btn") return handleViewPacketButton(interaction, payloadRaw);
    if (action === "nx:show_backlinks") return handleShowBacklinksButton(interaction, payloadRaw);
    if (action === "nx:show_relations") return handleShowRelationsButton(interaction, payloadRaw);
    if (action === "nx:view_packet_page") return handleViewPacketPageButton(interaction);
    return;
  }

  // Selects
  if (interaction.isStringSelectMenu()) {
    const { actionRaw } = splitPipe(customId);
    const action = parseAction(actionRaw);

    console.log("[ix select]", action, "customId=", customId, "values=", interaction.values);

    await interaction.deferUpdate();

    if (action === "nx:view_packet_select") return handleViewPacketSelect(interaction);

    return;
  }
}