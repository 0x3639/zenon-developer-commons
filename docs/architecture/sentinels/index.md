---
topic: Zenon Sentinels
summary: Index and lead answer for the Sentinel context pack.
status: active
---

# Sentinel Context Pack

AI-context material on the **purpose of Sentinel nodes** in Zenon's Network of Momentum.
Provenance-tagged for safe ingestion (see `../README.md` for the `[DOC]`/`[INF]`/`[OPEN]`
convention).

---

## Lead answer

A **Sentinel** is a **staked, non-Pillar service node** in Zenon. `[DOC]` Its *purpose*
is described three different — and partly conflicting — ways across Zenon's own primary
documents:

- **Whitepaper:** a trustless **observer** that builds fee-weighted **PoW links** for user
  transactions, acts as a user **representative**, and defends the network against spam
  and eclipse attacks — explicitly **not** a consensus participant. `[DOC]`
- **Lightpaper:** a sharding-aware **sentry variant** that **does** participate in global
  consensus by validating shard integrity. `[DOC]`
- **Greenpaper:** an on-chain, rewarded node that improves **relay availability for light
  clients.** `[DOC]`

In deployed NoM the role is **under-specified and largely vestigial**, and the
whitepaper's fee-based mechanism is **not reconciled** with modern feeless NoM. A faithful
model should present the conflict rather than pick one answer. `[OPEN]`

---

## Files

- `01-purpose-and-architecture.md` — the three documented framings, PoW links, the
  representative system, node-hierarchy position, and the repo's inferred middle-layer
  reading.
- `02-economics-and-open-questions.md` — staking, incentives, the fee-vs-feeless tension,
  security properties, and open questions.
- `sources.md` — provenance map backing every `[DOC]` claim.

---

## How to use

Feed the whole folder into a retrieval system or context window. Carry the provenance
tags through to the consuming model — they are what keep it from stating Zenon's
inconsistent Sentinel lore as settled protocol fact.
