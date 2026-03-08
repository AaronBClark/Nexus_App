import type { SeedFactory, SeedKind } from "./types.js";
import { seedTrashPickupTemplate } from "./templates/trashPickup.js";
import { seedUprisingUndergroundElement } from "./elements/uprisingUnderground.js";
import { seedAaronElement } from "./elements/aaron.js";
import { seedKeepingEarthBeautifulInitiative } from "./initiatives/keepingEarthBeautiful.js";
import { seedCommunityWalkaboutProgram } from "./programs/communityWalkabout.js";
import { seedTrashPickupDemoPlan } from "./plans/trashPickupDemoPlan.js";
import { seedTrashPickupDemoReport } from "./reports/trashPickupDemoReport.js";
import { seedSafetyProtocolModule } from "./modules/safetyProtocol.js";
import { seedCommunicationsModule } from "./modules/communications.js";
import { seedSupplyChecklistModule } from "./modules/supplyChecklist.js";
import { seedBaselineSafetyPolicy } from "./policies/baselineSafety.js";

export const seedRegistry: Record<SeedKind, Record<string, SeedFactory>> = {
  template: {
    trash_pickup: seedTrashPickupTemplate,
  },
  plan: {
    trash_pickup_demo_plan: seedTrashPickupDemoPlan,
    },
  report: {
    trash_pickup_demo_report: seedTrashPickupDemoReport,
    },
  element: {
    uprising_underground: seedUprisingUndergroundElement,
    aaron: seedAaronElement,
  },
  initiative: {
    keeping_earth_beautiful: seedKeepingEarthBeautifulInitiative,
  },
  program: {
    community_walkabout: seedCommunityWalkaboutProgram,
  },
  module: {
    safety_protocol: seedSafetyProtocolModule,
    communications: seedCommunicationsModule,
    supply_checklist: seedSupplyChecklistModule,
    },
  policy: {
    baseline_safety: seedBaselineSafetyPolicy,
    },
};

export function getSeed(kind: SeedKind, which: string, authorUserId: string) {
  const group = seedRegistry[kind];
  const fn = group?.[which];
  if (!fn) throw new Error(`Unknown seed: kind=${kind} which=${which}`);
  return fn(authorUserId);
}

export function listSeeds(kind: SeedKind): string[] {
  return Object.keys(seedRegistry[kind] ?? {});
}