---
title: Glossary
sidebar_label: Glossary
sidebar_position: 14
slug: /glossary
description: Core Zenon / Network of Momentum terms in one place.
---

# Glossary

Core terms used across the commons. New to Zenon? Start with the [Concepts](/concepts/the-empty-quadrant) section, then keep this page open as a reference.

---

### Network of Momentum (NoM)

Zenon's overall architecture — a dual-ledger system combining a chain of **momentums** with a DAG of **account-chains**.

### Momentum

A sequential unit produced by the consensus layer, containing snapshots of recent account blocks and signed by Pillars. Momentums give the network a shared, ordered heartbeat. See [Momentum Data Fields](/architecture/momentum-data-fields) and [Momentum Header Verification](/architecture/momentum-header-verification).

### Account-chain (block-lattice)

Each address has its own mini-blockchain of blocks. These account-chains are anchored into momentums, forming a DAG rather than a single global chain. See [Account-Chain Commitments](/architecture/account-chain-commitments).

### Pillar

A consensus node that produces and signs momentums. Pillars are the top of the [node hierarchy](/architecture/node-architecture).

### Sentinel

A proof-serving node that sits below Pillars, supplying the compact proofs light clients need. See the [Sentinels](/architecture/sentinels/) section.

### Sentry

An execution-tier node responsible for running application logic and producing the commitments/proofs submitted on-chain.

### Light client

A resource-constrained verifier that checks proofs rather than replaying full execution — including browser-native clients. See [Light Clients](/light-clients/overview).

### ACI (Application Contract Interface)

A deterministic, schema-defined contract interface. Zenon is **not** a VM: execution happens off-chain, with proofs/commitments submitted on-chain.

### zApp

An application built on Zenon's verification-first execution model. See [zApps & Execution](/zapps-execution/zapps).

### Bounded verification

Verifying a claim using a strictly bounded amount of data/work (e.g., header-only checks or minimal state frontiers) instead of full-chain replay. The central research program — see [Bounded Verification](/research/bounded-verification/).

### Dynamic Plasma

Zenon's resource/throughput model governing how work is metered. See [Dynamic Plasma](/zapps-execution/dynamic-plasma).

### SPV (Simplified Payment Verification)

Verifying facts about another chain (notably Bitcoin) from compact proofs. Zenon's thesis: **verify Bitcoin, don't bridge it**. See the [Bitcoin & SPV](/bitcoin-spv/research-blueprint) section.

### Genesis anchoring (GALV)

Genesis-Anchored Lineage Verification — establishing trust roots from genesis so verifiers can validate lineage offline. See [Genesis Anchoring](/research/genesis-anchoring/verification-context).

### Hostile review

An independent, adversarial review of a specification whose explicit goal is to break it. Most specs in the commons ship with one.
