import { basePacketEmbed } from "../components/packetEmbed.js";

export function renderMissionTemplate(packet: any) {
  const e = basePacketEmbed(packet);

  const mt = packet.mission_template ?? {};
  if (mt.summary) e.addFields({ name: "Summary", value: mt.summary });

  if (mt.supported_scopes?.length) {
    e.addFields({ name: "Scopes", value: mt.supported_scopes.join(", ") });
  }

  if (mt.objectives?.length) {
    const list = mt.objectives.slice(0, 10).map((o: any, i: number) => `${i + 1}. ${o.text}`).join("\n");
    e.addFields({ name: "Objectives", value: list });
  }

  return { embeds: [e], ephemeral: true };
}