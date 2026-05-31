# Bitcoin SPV Engineering Roadmap — Documentation

This folder contains the complete documentation for implementing Bitcoin SPV verification within Zenon's ledger architecture, organized by the 6-phase engineering roadmap.

---

## Overview

This documentation specifies a phased approach to Bitcoin SPV that prioritizes cryptographic correctness, deterministic verification, and local resource isolation over global consensus changes. By decoupling verification from execution, externally verified Bitcoin facts (transaction inclusion and depth) can be imported into Zenon using a trust-minimized, optimistic checkpointing model.

---

## Folder Structure

```
spv-roadmap/
├── phase-0-foundation/           # Reference model & threat formalization
├── phase-1-account-integration/  # Account-level verification
├── phase-2-networking/           # Header networking & data ingestion
├── phase-3-optimistic-layer/     # Optimistic checkpointing
├── phase-4-incentives/           # Incentive mechanisms
├── phase-5-protocol-integration/ # Protocol-level integration
└── integration/                  # Cross-cutting architecture
```

---

## Reading Order

### Phase 0 — Foundation
1. [Bitcoin SPV Verifier Specification](phase-0-foundation/bitcoin-spv-verifier-spec.md)
2. [Bitcoin SPV Threat Model](phase-0-foundation/bitcoin-spv-threat-model.md)
3. [Bitcoin SPV Test Vectors](phase-0-foundation/bitcoin-spv-test-vectors.md)

### Phase 1 — Account Integration
4. [VerifyBitcoinSPV ACI Specification](phase-1-account-integration/verify-bitcoin-spv-aci.md)
5. [Bitcoin Fact Storage](phase-1-account-integration/bitcoin-fact-storage.md)

### Phase 2 — Networking
6. [Bitcoin Header Relay Protocol](phase-2-networking/bitcoin-header-relay-protocol.md)
7. [Bitcoin Header Data Availability](phase-2-networking/bitcoin-header-availability.md)

### Phase 3 — Optimistic Layer
8. [Optimistic Bitcoin Fact Checkpointing](phase-3-optimistic-layer/optimistic-btc-checkpointing.md)
9. [Bitcoin SPV Fraud Proof Specification](phase-3-optimistic-layer/bitcoin-spv-fraud-proofs.md)

### Phase 4 — Incentives
10. [Bonded Relayer Model](phase-4-incentives/bonded-relayer-model.md)
11. [SPV Service Credits](phase-4-incentives/spv-service-credits.md)

### Phase 5 — Protocol Integration
12. [Protocol-Level SPV Integration Assessment](phase-5-protocol-integration/protocol-level-spv-assessment.md)

### Integration
13. [Bitcoin SPV Integration Map](/bitcoin-spv/roadmap/integration-map)

---

## Guiding Principles

The engineering path adheres to four binding constraints:

- **Verification ≠ Execution**: Zenon verifies cryptographic facts (Merkle inclusion, PoW headers) but does not execute foreign state machines or scripts

- **Local Cost Priority**: Computationally expensive verification is borne by the specific account requesting it, not the global consensus layer

- **Determinism First**: Correctness and reproducibility must be established before any economic or incentive mechanisms are considered

- **Optionality Before Consensus Coupling**: No feature becomes consensus-critical until its safety properties are validated in isolation

---

## Relationship to Existing Research

This documentation builds upon:

- [Engineering Roadmap — Bitcoin SPV on Zenon](/bitcoin-spv/engineering-roadmap) — The source roadmap
- [Bitcoin SPV Feasibility](/bitcoin-spv/interoperability/feasibility) — Cryptographic feasibility proof
- [State Proof Bundles](/light-clients/state-proof-bundles) — Verification primitive for cross-chain
- [Taxonomy: Deterministic Fact Acceptance](/research/taxonomy-deterministic-fact-acceptance) — Architectural model
- [Bounded Verification Series](/research/bounded-verification/) — Verification techniques

---

## Status

This documentation is exploratory research. It does not represent an official Zenon roadmap, implementation plan, or commitment.
