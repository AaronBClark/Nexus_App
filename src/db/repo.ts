import { db } from "./index.js";
import { extractOutgoingLinks } from "./linker.js";

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
    `).run(
      packet.id,
      packet.type,
      packet.schema_version,
      packet.packet_version,
      packet.scope.level,
      packet.publish.visibility,
      packet.scope.element_id,
      packet.created_at,
      packet.updated_at,
      JSON.stringify(packet)
    );
  } else {
    db.prepare(`
      INSERT INTO objects (id, type, schema_version, packet_version, scope_level, visibility, element_id, created_at, updated_at, content_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      packet.id,
      packet.type,
      packet.schema_version,
      packet.packet_version,
      packet.scope.level,
      packet.publish.visibility,
      packet.scope.element_id,
      packet.created_at,
      packet.updated_at,
      JSON.stringify(packet)
    );
  }

  // ✅ Graph indexing step (always)
  const links = extractOutgoingLinks(packet);
  replaceOutgoingLinks(packet.id, links, packet.created_at);
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

export function listOutgoingLinks(fromId: string) {
  return db.prepare(
    `SELECT rel, to_id FROM object_links WHERE from_id = ? ORDER BY rel, to_id`
  ).all(fromId);
}

export function listIncomingLinks(toId: string) {
  return db.prepare(
    `SELECT rel, from_id FROM object_links WHERE to_id = ? ORDER BY rel, from_id`
  ).all(toId);
}

export function getObjectsByIds(ids: string[]) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  return db.prepare(
    `SELECT id, type, created_at, updated_at, content_json
     FROM objects
     WHERE id IN (${placeholders})`
  ).all(...ids);
}

export function replaceOutgoingLinks(fromId: string, links: { rel: string; to_id: string }[], createdAt: string) {
  const del = db.prepare(`DELETE FROM object_links WHERE from_id = ?`);
  const ins = db.prepare(`
    INSERT OR REPLACE INTO object_links (from_id, rel, to_id, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    del.run(fromId);
    for (const l of links) ins.run(fromId, l.rel, l.to_id, createdAt);
  });

  tx();
}

export function rebuildAllLinks() {
  db.prepare(`DELETE FROM object_links`).run();

  const rows = db.prepare(`SELECT content_json FROM objects`).all() as any[];
  for (const r of rows) {
    const packet = JSON.parse(r.content_json);
    const links = extractOutgoingLinks(packet);
    replaceOutgoingLinks(packet.id, links, packet.created_at);
  }
}

export function deletePacketById(id: string) {
  const tx = db.transaction((objectId: string) => {
    db.prepare(`DELETE FROM object_links WHERE from_id = ? OR to_id = ?`).run(objectId, objectId);
    db.prepare(`DELETE FROM discord_refs WHERE object_id = ?`).run(objectId);
    const res = db.prepare(`DELETE FROM objects WHERE id = ?`).run(objectId);
    return res.changes; // 0 or 1
  });

  return tx(id);
}