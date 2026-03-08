import { SlashCommandBuilder } from "discord.js";
import { getSeed, listSeeds, seedRegistry } from "../../../core/seeds/index.js";
import { savePacket, getPacketById, rebuildAllLinks } from "../../../db/repo.js";

type SeedKind =
  | "template"
  | "plan"
  | "report"
  | "module"
  | "policy"
  | "element"
  | "initiative"
  | "program";

const allKinds: SeedKind[] = [
  "element",
  "initiative",
  "program",
  "module",
  "policy",
  "template",
  "plan",
  "report",
];

export const seedCommand = {
  data: new SlashCommandBuilder()
    .setName("seed")
    .setDescription("Seed Nexus packets")
    .addStringOption((opt) =>
      opt
        .setName("kind")
        .setDescription("Seed group (omit = all)")
        .setRequired(false)
        .addChoices(
          { name: "template", value: "template" },
          { name: "plan", value: "plan" },
          { name: "report", value: "report" },
          { name: "module", value: "module" },
          { name: "policy", value: "policy" },
          { name: "element", value: "element" },
          { name: "initiative", value: "initiative" },
          { name: "program", value: "program" }
        )
    )
    .addStringOption((opt) =>
      opt
        .setName("which")
        .setDescription("Which seed (omit = all)")
        .setRequired(false)
        .setAutocomplete(true)
    )
    .addBooleanOption((opt) =>
      opt
        .setName("overwrite")
        .setDescription("Overwrite existing packets with same id (default: false)")
        .setRequired(false)
    ),

  async autocomplete(interaction: any) {
    try {
      const kind = interaction.options.getString("kind") as SeedKind | null;
      const focused = (interaction.options.getFocused() ?? "").toLowerCase();

      if (!kind) {
        // Can't autocomplete which without kind; keep it fast.
        return interaction.respond([{ name: "Choose kind first", value: "" }]);
      }

      const seeds = listSeeds(kind);
      const filtered = seeds
        .filter((s) => s.toLowerCase().includes(focused))
        .slice(0, 24);

      // Include "all" as a convenient top option
      const choices = [{ name: "all", value: "" }, ...filtered.map((s) => ({ name: s, value: s }))].slice(0, 25);

      return interaction.respond(choices);
    } catch {
      try { return interaction.respond([]); } catch {}
    }
  },

  async execute(interaction: any) {
    const kindRaw = interaction.options.getString("kind") as SeedKind | null;
    const whichRaw = interaction.options.getString("which"); // may be null or "" (all)
    const overwrite = interaction.options.getBoolean("overwrite") ?? false;

    // null/"" => all behavior
    const kindList: SeedKind[] = kindRaw ? [kindRaw] : allKinds;

    const seeded: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    for (const k of kindList) {
      const whichList = (whichRaw && whichRaw.length > 0)
        ? [whichRaw]
        : listSeeds(k);

      for (const w of whichList) {
        try {
          const packet = getSeed(k as any, w, interaction.user.id);

          // ✅ id-collision behavior
          const existing = getPacketById(packet.id);
          if (existing && !overwrite) {
            skipped.push(packet.id);
            continue;
          }

          savePacket(packet, { overwrite }); // see repo notes below
          seeded.push(packet.id);
        } catch (e: any) {
          failed.push(`${k}/${w}: ${e.message ?? e}`);
        }
      }
    }
    
    if (seeded.length && overwrite) {
      // optional: ensures links are consistent across all packets after overwrite seeding
      rebuildAllLinks();
    }

    // Compact response
    const lines: string[] = [];
    if (seeded.length) lines.push(`✅ Seeded (${seeded.length}): ${seeded.slice(0, 10).map(id => `\`${id}\``).join(", ")}${seeded.length > 10 ? " …" : ""}`);
    if (skipped.length) lines.push(`↩️ Skipped existing (${skipped.length})${overwrite ? "" : " (use overwrite=true)"}: ${skipped.slice(0, 10).map(id => `\`${id}\``).join(", ")}${skipped.length > 10 ? " …" : ""}`);
    if (failed.length) lines.push(`❌ Failed (${failed.length}):\n• ${failed.slice(0, 5).join("\n• ")}${failed.length > 5 ? "\n• …" : ""}`);

    return interaction.reply({
      content: lines.length ? lines.join("\n") : "Nothing to do.",
      ephemeral: failed.length > 0, // keep failures quieter by default
    });
  },
};