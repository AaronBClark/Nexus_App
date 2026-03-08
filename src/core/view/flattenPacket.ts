// src/core/view/flattenPacket.ts
export type FlattenLine = {
  path: string;   // e.g. "mission_report.snapshot.date" or "labels.tags[0]"
  depth: number;  // relative to display root; top-level domain keys are depth 0
  value: string;  // rendered primitive
};

const META_KEYS = new Set(["created_at", "updated_at"]);

/** True if value is a plain object (not array, not null). */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function isPrimitive(v: unknown): v is string | number | boolean | null {
  return v === null || ["string", "number", "boolean"].includes(typeof v);
}

function renderPrimitive(v: string | number | boolean | null): string {
  if (v === null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NaN";
  return v;
}

/**
 * Flatten a packet into lines of primitive values.
 *
 * Rules:
 * - metadata keys (id/type/created_at/updated_at) are returned separately as headerLines
 * - depth starts at 0 for remaining top-level keys
 * - arrays of primitives become one line per item with [i] in the path
 * - arrays of objects: we do NOT emit an object "value" line, but we DO traverse children with [i] paths
 * - objects: traverse children
 */
export function flattenPacket(packet: Record<string, unknown>): {
  headerLines: FlattenLine[];
  bodyLines: FlattenLine[];
} {
  const headerLines: FlattenLine[] = [];
  const bodyLines: FlattenLine[] = [];

  // Include metadata primitives in header (still “included”, but not part of tree depth)
  for (const k of Array.from(META_KEYS)) {
    const v = packet[k];
    if (isPrimitive(v)) {
      headerLines.push({ path: k, depth: 0, value: renderPrimitive(v) });
    } else if (v !== undefined) {
      // Non-primitive metadata (rare): stringify safely
      headerLines.push({ path: k, depth: 0, value: JSON.stringify(v) });
    }
  }

  const rootKeys = Object.keys(packet)
    .filter((k) => !META_KEYS.has(k))
    .sort((a, b) => a.localeCompare(b));

  for (const rootKey of rootKeys) {
    walk(packet[rootKey], rootKey, /*depth=*/0, bodyLines);
  }

  return { headerLines, bodyLines };
}

function walk(
  value: unknown,
  path: string,
  depth: number,
  out: FlattenLine[]
) {
  if (isPrimitive(value)) {
    out.push({ path, depth, value: renderPrimitive(value) });
    return;
  }

  if (Array.isArray(value)) {
    // One line per primitive item, indexed
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const itemPath = `${path}[${i}]`;
      if (isPrimitive(item)) {
        out.push({ path: itemPath, depth: depth + 1, value: renderPrimitive(item) });
      } else {
        // Traverse object/array children
        walk(item, itemPath, depth + 1, out);
      }
    }
    return;
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    for (const k of keys) {
      walk(value[k], `${path}.${k}`, depth + 1, out);
    }
    return;
  }

  // Fallback for unsupported types (e.g. bigint, symbol, function)
  out.push({ path, depth, value: String(value) });
}