// src/packets/types.ts
import { z } from "zod";
import {
  PacketHeaderSchema,
  PacketType as PacketTypeEnum,
} from "./base.js"; 

export type PacketType = z.infer<typeof PacketTypeEnum>;
export type PacketHeader = z.infer<typeof PacketHeaderSchema>;

// Generic “packet” shape: header + body
export type Packet<TBody extends object = Record<string, unknown>> =
  PacketHeader & TBody;

// Until you make per-type body schemas, this is your “any packet”
export type PacketAny = Packet<Record<string, unknown>>;