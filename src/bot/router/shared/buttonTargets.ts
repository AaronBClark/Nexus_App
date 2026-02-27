export function getButtonTargets(packet: any): Set<string> {
  const r = packet?.relations ?? {};
  return new Set(
    [r.parent_id, r.template_id, r.initiative_id, r.program_id, r.campaign_id]
      .filter(Boolean)
      .map(String)
  );
}