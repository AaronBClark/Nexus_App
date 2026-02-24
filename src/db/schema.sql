-- src/db/schema.sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS objects (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  packet_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  scope_level TEXT NOT NULL,
  element_id TEXT NOT NULL,
  visibility TEXT NOT NULL,
  content_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_objects_type_created
  ON objects(type, created_at);

CREATE TABLE IF NOT EXISTS object_links (
  from_id TEXT NOT NULL,
  rel TEXT NOT NULL,          -- e.g. "uses_template", "has_report"
  to_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (from_id, rel, to_id)
);

CREATE INDEX IF NOT EXISTS idx_links_to
  ON object_links(to_id, rel);

CREATE TABLE IF NOT EXISTS discord_refs (
  object_id TEXT NOT NULL,
  role TEXT NOT NULL,         -- "mirror", "canonical", "feed", "comms"
  guild_id TEXT,
  channel_id TEXT,
  thread_id TEXT,
  message_id TEXT,
  url TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (object_id, role)
);