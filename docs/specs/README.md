# Specifications

This folder contains structured, reviewable documents that turn research notes into auditable claims.

These documents are **not** implementation claims. They define:
- what can be verified today from on-chain commitments,
- what requires protocol changes,
- and what remains open research.

## Legend

Each section may be tagged:

- **Observed** — directly confirmed in go-zenon or on-chain behavior
- **Inferred** — implied by existing commitments/rules, but not explicitly specified
- **Proposed** — requires consensus changes / new commitment formats
- **Speculative** — requires new cryptography, incentives, or major networking upgrades

## Reading Order (recommended)

1. Threat Model
2. Commitments & Proofs
3. Minimal Light Client Protocol (MVP)
4. State Proof Bundle Spec
5. Committee / Pillar Proof Strategy
6. Data Availability Model
7. go-zenon Compatibility Matrix
8. Known Open Problems
