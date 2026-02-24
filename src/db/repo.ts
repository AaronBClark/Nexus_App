import { db } from "./index.js";

type PacketHeaderLike = {
  id: string;
  type: string;
  schema_version: string;
  packet_version: string;
  created_at: string;
  updated_at: string
  scope: { level: string; element_id: string };
  publish: { visibility: string };
};

export function savePacket(packet: any, opts?: { overwrite?: boolean }) {
  const overwrite = opts?.overwrite ?? false;

  if (overwrite) {
    db.prepare(`
      INSERT OR REPLACE INTO objects (id, type, schema_version, packet_version, scope_level, visibility, element_id, created_at, updated_at, content_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(packet.id, packet.type, packet.schema_version, packet.packet_version, packet.scope.level, packet.publish.visibility, packet.scope.element_id, packet.created_at, packet.updated_at, JSON.stringify(packet));
  } else {
    // Strict insert: fail if exists
    db.prepare(`
      INSERT INTO objects (id, type, schema_version, packet_version, scope_level, visibility, element_id, created_at, updated_at, content_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(packet.id, packet.type, packet.schema_version, packet.packet_version, packet.scope.level, packet.publish.visibility, packet.scope.element_id,packet.created_at, packet.updated_at, JSON.stringify(packet));
  }
}

type ObjectRow = { content_json: string };

export function getPacketById(id: string) {
  const row = db.prepare("SELECT content_json FROM objects WHERE id = ?").get(id) as any;
  if (!row) return null;
  return JSON.parse(row.content_json);
}

export function listPacketsByType(type: string, limit = 50) {
  const rows = db
    .prepare<[string, number], ObjectRow>(`
      SELECT content_json FROM objects
      WHERE type = ?
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .all(type, limit);

  return rows.map((r) => JSON.parse(r.content_json));
}