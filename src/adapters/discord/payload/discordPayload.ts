export function normalizeMessagePayload(view: any) {
  const embeds = (view.embeds ?? [])
    .flat(Infinity)
    .filter(Boolean)
    .map((e: any) => (e?.toJSON ? e.toJSON() : e));

  const components = (view.components ?? [])
    .flat(Infinity)
    .filter(Boolean)
    .map((c: any) => (c?.toJSON ? c.toJSON() : c));

  // Keep other fields (content, etc.) intact
  return { ...view, embeds, components };
}