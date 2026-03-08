// src/adapters/discord/views/linkOptions.ts
import type { SelectMenuComponentOptionData } from "discord.js";
import type { PacketLinkRecord } from "../../../core/graph/getPacketLinks.js";

function clamp(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function buildDescription(link: PacketLinkRecord): string {
  const pieces = [link.rel];
  if (link.type) pieces.push(link.type);
  pieces.push(link.id);
  return clamp(pieces.join(" • "), 100);
}

function encodeOptionValue(link: PacketLinkRecord): string {
  return `${link.direction}|${link.rel}|${link.id}`;
}

export function decodeLinkOptionValue(value: string): {
  direction?: string;
  rel?: string;
  id: string;
} {
  if (!value.includes("|")) {
    return { id: value };
  }

  const [direction, rel, ...rest] = value.split("|");
  return {
    direction,
    rel,
    id: rest.join("|"),
  };
}

export function toDiscordLinkOptions(
  links: PacketLinkRecord[]
): SelectMenuComponentOptionData[] {
  return links.map((link) => ({
    label: clamp(link.title ?? link.id, 100),
    value: encodeOptionValue(link),
    description: buildDescription(link),
  }));
}