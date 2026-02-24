import { db } from "./index.js";

type PacketHeaderLike = {
  id: string;
  type: string;
  schema_version: string;
  packet_version: string;
  created_at: string;
  updated_at: string;
  scope: { level: string; element_id: string };
  publish: { visibility: string };
};

export function savePacket(packet: PacketHeaderLike & Record<string, unknown>) {
  const stmt = db.prepare(`
    INSERT INTO objects (
      id, type, schema_version, packet_version,
      created_at, updated_at,
      scope_level, element_id,
      visibility, content_json
    ) VALUES (
      @id, @type, @schema_version, @packet_version,
      @created_at, @updated_at,
      @scope_level, @element_id,
      @visibility, @content_json
    )
    ON CONFLICT(id) DO UPDATE SET
      updated_at=excluded.updated_at,
      visibility=excluded.visibility,
      content_json=excluded.content_json
  `);

  stmt.run({
    id: packet.id,
    type: packet.type,
    schema_version: packet.schema_version,
    packet_version: packet.packet_version,
    created_at: packet.created_at,
    updated_at: packet.updated_at,
    scope_level: packet.scope.level,
    element_id: packet.scope.element_id,
    visibility: packet.publish.visibility,
    content_json: JSON.stringify(packet),
  });
}

type ObjectRow = { content_json: string };

export function getPacketById(id: string) {
  const row = db
    .prepare<[string], ObjectRow>(`SELECT content_json FROM objects WHERE id = ?`)
    .get(id);

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