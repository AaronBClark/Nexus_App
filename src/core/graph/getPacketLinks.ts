// src/core/graph/getPacketLinks.ts
import {
  listOutgoingLinks,
  listIncomingLinks,
  getObjectsByIds,
} from "../../db/repo.js";

export type PacketLinkRecord = {
  rel: string;
  id: string;
  direction: "outgoing" | "incoming";
  type?: string;
  title?: string;
};

type HydratedObjectRow = {
  id: string;
  type: string;
  created_at: string;
  updated_at: string;
  content_json: string;
};

function getPacketTitle(row: HydratedObjectRow): string {
  try {
    const packet = JSON.parse(row.content_json);
    return packet?.labels?.title ?? row.id;
  } catch {
    return row.id;
  }
}

export function getPacketLinks(packetId: string): {
  outgoing: PacketLinkRecord[];
  incoming: PacketLinkRecord[];
} {
  const outgoingRows = listOutgoingLinks(packetId) as { rel: string; to_id: string }[];
  const incomingRows = listIncomingLinks(packetId) as { rel: string; from_id: string }[];

  const outgoingIds = [...new Set(outgoingRows.map((r) => r.to_id))];
  const incomingIds = [...new Set(incomingRows.map((r) => r.from_id))];

  const outgoingObjects = getObjectsByIds(outgoingIds) as HydratedObjectRow[];
  const incomingObjects = getObjectsByIds(incomingIds) as HydratedObjectRow[];

  const outgoingById = new Map(outgoingObjects.map((o) => [o.id, o]));
  const incomingById = new Map(incomingObjects.map((o) => [o.id, o]));

  const outgoing: PacketLinkRecord[] = outgoingRows.map((r) => {
    const obj = outgoingById.get(r.to_id);
    return {
      rel: r.rel,
      id: r.to_id,
      direction: "outgoing",
      type: obj?.type,
      title: obj ? getPacketTitle(obj) : r.to_id,
    };
  });

  const incoming: PacketLinkRecord[] = incomingRows.map((r) => {
    const obj = incomingById.get(r.from_id);
    return {
      rel: r.rel,
      id: r.from_id,
      direction: "incoming",
      type: obj?.type,
      title: obj ? getPacketTitle(obj) : r.from_id,
    };
  });

  return { outgoing, incoming };
}