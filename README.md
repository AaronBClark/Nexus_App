# Nexus
## A Decentralized Action Network

**Nexus is an open-source, antifragile coordination system for turning shared perception into collective decision-making and real-world action.**

---

## Why Nexus Exists

Human history is entering a decisive era.

Technology now allows two opposite futures:
- unprecedented surveillance, manipulation, and concentration of power
- unprecedented coordination, transparency, and peaceful cooperation at scale

Most existing platforms centralize authority and fail poorly under pressure. Nexus explores a different approach: coordination as portable, inspectable data that can survive outages, partitions, censorship, and low bandwidth.

Nexus is not a movement, party, or command structure. It is open-source infrastructure that communities and initiatives of many kinds can reuse, fork, and adapt according to local needs.

At the core is a simple question: can people align without ideological uniformity and coordinate without centralized control?

Nexus is an experiment in **fractal alignment**: small, local coordination patterns that can compose into larger systems without surrendering autonomy. It aims to support distributed decision-making and governance, including direct or participatory approaches, without requiring a central authority.

---

## Overview

Nexus is an experimental system for organizing human coordination using **portable data packets** instead of centralized platforms.

Rather than relying on servers, leaders, or fixed structures, Nexus treats every piece of coordination as a **self-contained, inspectable unit** that can be shared, merged, and understood anywhere.

Nexus is designed to work:
- online or offline
- individually or collectively
- locally or globally
- under ideal conditions and degraded conditions (outages, partitions, low bandwidth)

**Nexus is not a platform.**  
It treats **data as the system** and **interfaces as adapters**.

---

## The Core Idea

> Mental model: Think of Nexus as Git + a knowledge graph + mission coordination, applied to real-world action.

### Everything is a packet

A **packet** is a portable unit of coordination: a proposal, mission, report, policy, module, identity element, and so on.

Packets are designed to be:
- **portable** → easy to export, import, and share
- **composable** → packets connect into larger structures
- **inspectable** → readable without hidden context
- **extensible** → new packet types and relationships can emerge over time

### Packets form a living graph

Packets link to other packets. Those links become a **living graph**:
- **Outgoing links**: what this packet references
- **Incoming links**: what references this packet

**The system is not the packets themselves, but the evolving graph they form together.**

The graph becomes a navigable, evolving structure for discovery, trust, governance, and coordination without hardcoded hierarchies.

---

## Sense → Think → Act

Nexus is built around a simple civilizational loop:

1) **SENSE (Perception)**  
   Distributed reporting and multi-perspective validation (human and/or technical).

2) **THINK (Coordination)**  
   Proposals, discussion, iteration, and governance mechanics (planned).

3) **ACT (Execution)**  
   Missions in the real world, online collaboration, and after-action learning.

Nexus makes these layers **legible, portable, and syncable as packets**.

---

## Architecture

### Core (engine)

The core is the portable logic layer with no UI assumptions:

- packet schema validation
- graph construction (relationships between packets)
- link resolution (incoming/outgoing)
- bundle import/export (planned)
- merge logic (planned)
- cryptographic identity + signatures (planned)
- trust and governance mechanics (planned)

The core should be:
- platform-agnostic
- UI-agnostic
- re-implementable across environments

### Adapters (interfaces)

Adapters are platform-specific layers on top of the core:
- Discord bot (current)
- Web app (planned)
- Mobile app (planned)
- CLI tools (planned)
- Mesh / embedded nodes (planned)

Adapters:
- render packets
- accept user input
- translate actions → core operations

**Adapters do not own system logic.** They orchestrate and display. They should not introduce dependencies that compromise portability or decentralization.

---

## Nodes, bundles, and offline-first networking

### Node (local-first)

Each instance of Nexus acts as a **local node**:
- stores packets locally
- builds a local graph
- operates offline
- syncs when it can

There is no required central server.

### Bundles (planned)

A **bundle** is a portable collection of packets used for distribution and sync:
- local sharing
- peer-to-peer sharing
- hosted mirrors
- archival snapshots

Nodes can import bundles, merge packets, and rebuild/update their graph.

### Bandwidth tiers (design goal)

Nexus is designed to function across multiple “network realities”:

- **High bandwidth**: interactive, near real-time sync (adapter-dependent)
- **Low bandwidth**: compressed bundles, delayed sync windows
- **Intermittent**: store-and-forward behavior, retry when links exist
- **Offline-first**: full local operation with later reconciliation
- **Mesh-capable**: transport-agnostic routing across local relays (Wi-Fi, LoRa-class links, etc.)
- **Sneakernet**: bundle exchange via file transfer (USB, SD card, manual handoff)

**Coordination should not fail when connectivity does.**

The point is **graceful degradation**: coordination should not collapse when the internet gets weird.

---

## Packet Types (current schema)

Nexus defines packet headers plus several packet bodies (TypeScript + Zod):

**Identity / participation**
- **Element**: person, org, node, service (identity anchor; trust hooks planned)

**Direction**
- **Initiative**: umbrella direction
- **Program**: repeatable effort inside an initiative
- **Campaign**: timeboxed push inside an initiative/program

**Execution lifecycle**
- **MissionTemplate**: reusable mission blueprint (objectives, default modules/policies)
- **MissionPlan**: instantiated mission (logistics, modules, policies)
- **MissionReport**: after-action report (outcomes, notes, improvements)

**Constraints / building blocks**
- **Module**: capability block (safety, comms, supply, reporting, coordination)
- **Policy**: human-readable constraints/rules (validators planned)

---

## Trust & Verification (preview)

Nexus treats trust as local, inspectable, and composable. Planned mechanisms include:
- cryptographic identities (keypairs)
- signed packets and verification
- relationship proofs (planned)
- trust signals derived from the graph (who references what, reuse/forks, attestations)
- local filtering and policy-based validation (instead of global enforcement)

Nexus does not require a single global governance model. Governance can be packetized and adapted, including approaches that resemble distributed direct or participatory decision-making.

---

## Current Implementation (prototype)

**Discord adapter works today:**
- local node storage using SQLite
- packet persistence and retrieval
- outgoing link extraction + link indexing
- incoming/outgoing link browsing in Discord UI
- `/seed` to generate sample packets
- `/list-packets` to browse by type and preview packets
- `/delete-packet` to remove packets
- `/ping` sanity check

**Explicitly “future”:**
- cryptographic identity (keypairs)
- signed packets and verification
- trust graph scoring
- governance mechanics + voting layers (including SBMS experiments)
- bundle exchange + merge conflict strategy
- full browser-style UI (Discord and web)

---

## Getting Started (Discord bot)

### Prereqs
- Node.js 18+ recommended
- A Discord application + bot token
- A Discord server (guild) to install the bot into

### Environment
Create a `.env` file:

```bash
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_discord_application_client_id
GUILD_ID=your_test_guild_id
DB_PATH=./data/nexus.sqlite
```

### Install + run (example)

```bash
npm install
npx tsx src/deploy-commands.ts
npx tsx src/index.ts
```

### First use in Discord

- Run `/seed` to generate initial packets
- Run `/list-packets type:MissionTemplate` (or any type) to browse
- Open a packet and traverse the graph using incoming/outgoing links

---

## Project Principles

- **Decentralized by default**
- **Offline-first**
- **Data over platform**
- **Alignment over enforcement**
- **Local autonomy with shared, inspectable context**
- **Extensible schemas, not rigid hierarchies**
- **Antifragile networking and distribution**

---

## Roadmap

### Near term

- graph utility layer (`graph.ts`)
- cleaner separation between core logic and Discord adapter
- better browsing UX (navigation-first, not command-first)
- search, filter, sorting

### Mid term

- bundles (import/export) as first-class objects
- merge strategy + conflict handling
- cloning/forking packets
- packetized communications (comments, signals)

### Long term

- cryptographic identity, signing, verification
- trust graph and reputation signals
- governance mechanics + voting layers (including SBMS experiments)
- mesh-first transports and embedded nodes
- resilient synchronization under real-world constraints

---

## Community

If you want to follow development, discuss design, or help build:

**Join the Discord:** https://discord.gg/QJyDcKAuPZ

---

## License

TBD
