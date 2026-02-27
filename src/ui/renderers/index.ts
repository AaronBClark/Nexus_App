import { renderPacketCard } from "../components/packetCard.js";

export function renderPacket(packet: any, links?: any) {
  return renderPacketCard(packet, links);
}