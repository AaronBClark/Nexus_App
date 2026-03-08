// parseCustomId.ts
import type { Interaction } from "discord.js";

export function getCustomIdSafe(ix: Interaction): string {
  if (ix.isButton() || ix.isAnySelectMenu() || ix.isModalSubmit()) return ix.customId;
  return "";
}

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

export function encodeId(id: string): string {
  return Buffer.from(id).toString("base64url");
}
export function decodeId(encoded: string): string {
  return Buffer.from(encoded, "base64url").toString("utf8");
}

export function trunc(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}