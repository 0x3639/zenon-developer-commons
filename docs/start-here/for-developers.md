---
title: For Developers
sidebar_label: For Developers
sidebar_position: 2
slug: /for-developers
description: An implementation-oriented path through Zenon's architecture, specs, and roadmaps.
---

# For Developers

A path from "how does this work?" to "how would I build on it?" — architecture first, then the specifications and roadmaps that pin down the details.

---

## 1. Orient yourself

- [Architecture Overview](/architecture/overview) — the system in one read: dual ledger, account-chains, momentums, ACIs, verification model.
- [Bounded Verification Boundaries](/architecture/bounded-verification-boundaries) — what the verification-first model can and cannot do.
- Skim the [Concepts & Philosophy](/concepts/the-empty-quadrant) section if you want the "why" behind the design.

---

## 2. The building blocks

- [Account-Chain Commitments](/architecture/data-structures/account-chain-commitments) and [Momentum Data Fields](/architecture/data-structures/momentum-data-fields)
- [Node Architecture](/architecture/node-architecture) — Pillars, Sentinels, Sentries, light clients (incl. the Sentinel middle and finalization layers).
- [State Proof Bundles](/light-clients/state-proof-bundles) and the [Execution Model](/zapps-execution).

---

## 3. Light clients & verification

- [Browser Light Client — Overview](/light-clients/overview)
- [Browser Light Client — Architecture](/light-clients/browser-light-client/architecture)
- [SPV-style Light Verification](/light-clients/spv-light-verification)

---

## 4. Pick your build target

- **Applications** → [zApps & Execution](/zapps-execution/zapps), the [Dynamic Plasma](/zapps-execution/dynamic-plasma) resource model.
- **Bitcoin integration** → start at the [SPV Overview](/bitcoin-spv/research-blueprint), then the [SPV Roadmap, phases 0–5](/bitcoin-spv/roadmap/).
- **Networking** → the [Phase 1 libp2p specs](/networking/phase-1/).

---

## 5. Reference specifications

- [Minimum Verifier Spec](/specifications/minimum-verifier-spec)
- [Threat Model](/specifications/threat-model)
- The [core papers](/specifications/core-papers/greenpaper) (Greenpaper, Whitepaper, …)
- Worked example: the [Interstellar OS example stack](/specifications/interstellar-os/).

---

## Where to go next

- Want the formal proofs and hostile reviews? → **[For Researchers](/for-researchers)**
- Want the motivating story? → **[Learn the Basics](/learn)**
- Every paper as a downloadable PDF → the [Papers catalog](/papers).
