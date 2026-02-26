import type { Interaction } from "discord.js";

export function getCustomIdSafe(ix: Interaction): string {
  if (ix.isButton() || ix.isAnySelectMenu() || ix.isModalSubmit()) return ix.customId;
  return "";
}

/**
 * Prefer: action|payload|nonce...
 * But tolerate older: nx:action:Suffix
 */
export function parseAction(customId: string): string {
  const left = customId.split("|", 1)[0];
  const parts = left.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : left;
}

export function splitPipe(customId: string): {
  actionRaw: string;
  payloadRaw: string;
  rest: string[];
} {
  const [actionRaw, payloadRaw = "", ...rest] = customId.split("|");
  return { actionRaw, payloadRaw, rest };
}