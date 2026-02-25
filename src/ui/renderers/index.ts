import type { Packet } from "../../packets/types.js";
import { renderPacketCard } from "../components/packetCard.js";

export function renderPacket(packet: Packet) {
  return renderPacketCard(packet);
}