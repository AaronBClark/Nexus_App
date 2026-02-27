import { renderPacketCard } from "../components/packetCard.js";
import type { Packet } from "../../packets/types.js";

export function renderPacket(packet: Packet, links?: { outgoingIds?: string[]; incomingIds?: string[] }) {
  return renderPacketCard(packet, links);
}