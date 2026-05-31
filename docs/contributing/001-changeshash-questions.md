# 001: ChangesHash Questions

Research Questions — Commitments & Verification

This Issue collects open questions about the ChangesHash commitment mechanism and its implications for light client verification.

---

## Background

ChangesHash is described as a cryptographic commitment to the aggregate state delta produced by a Momentum block. According to [Account-Chain Commitments](/architecture/data-structures/account-chain-commitments), it represents the digest of:

- Balance updates
- Account-chain header updates
- Confirmation heights
- Mailbox changes
- Sequencer queue updates
- Embedded contract state changes
- Staking and fusion metadata
- Token definitions

The commitment is computed by Pillars during Momentum production (see [Pillars](/architecture/node-architecture/pillars), step 5).

---

## Question 1: How is ChangesHash computed, and why isn't it decomposable?

### Context

The [Commitments & Proofs](/specifications/commitments-and-proofs) specification explicitly flags this as a gap:

> **Verify partial state delta (per-account slice)** — Required commitment: decomposable delta commitment — **Exists today? No** — Upgrade needed: Merkle/vector commitment

The same document notes:

> **State delta proof:** Proves a state change occurred as part of a committed delta:
> - easy if the commitment is decomposable (Merkle/vector)
> - **hard if commitment is a flat hash over an opaque dump**

### Questions for the Architect

1. What is the exact algorithm for computing ChangesHash?
   - Is it `H(canonical_serialize(all_deltas))`?
   - What serialization format is used?
   - What hash function?

2. Why was a flat hash chosen over a Merkle root?
   - Was this a deliberate simplicity trade-off?
   - Were there performance concerns with Merkle construction?

3. What is the upgrade path to decomposable commitments?
   - The spec lists this as "Phase 2" — is there a design proposal?
   - Would this require a consensus-breaking change?

---

## Question 2: What happens if two nodes compute different ChangesHash values?

### Context

The [Pillars](/architecture/node-architecture/pillars) document raises determinism as an open question:

> What guarantees determinism across implementations?

The [Account-Chain Commitments](/architecture/data-structures/account-chain-commitments) document assumes deterministic execution:

> ChangesHash is a commitment to the aggregate effect of all included account-chain transitions.

But no formal proof or specification ensures all implementations produce identical hashes.

### Questions for the Architect

1. Is there a reference implementation that defines canonical ChangesHash computation?

2. What happens if a Pillar produces a Momentum with a ChangesHash that other Pillars reject?
   - Is there a slashing mechanism?
   - Does the Momentum get orphaned?

3. How do heterogeneous client implementations ensure hash equivalence?
   - Are there conformance tests?
   - Is there a formal specification of the state transition function?

4. Has there been any observed divergence in production?

---

## Question 3: Can you provide a formal specification of what ChangesHash commits to?

### Context

The [Account-Chain Commitments](/architecture/data-structures/account-chain-commitments) document provides an informal list:

> ChangesHash represents the cryptographic digest of:
> - balance updates
> - account-chain header updates
> - confirmation heights
> - mailbox changes
> - sequencer queue updates
> - embedded contract state changes
> - staking and fusion metadata
> - token definitions
> - any deterministic component of the state machine

This raises several ambiguities.

### Questions for the Architect

1. What is the canonical ordering of these components?
   - Are they sorted by account address?
   - By type of change?
   - By inclusion order in the Momentum?

2. What is the encoding format?
   - Protobuf? RLP? Custom binary?
   - Is there a schema definition?

3. What constitutes "any deterministic component of the state machine"?
   - Is this an exhaustive list or are there other components?
   - How would a new component be added (protocol upgrade)?

4. Are null/empty changes included or omitted?
   - If an account has no changes, is it represented as empty or absent?

---

## Related Documentation

| Document | Relevance |
|----------|-----------|
| [Account-Chain Commitments](/architecture/data-structures/account-chain-commitments) | Defines ChangesHash role and contents |
| [Commitments & Proofs](/specifications/commitments-and-proofs) | Audit of what is provable; flags decomposability gap |
| [Pillars](/architecture/node-architecture/pillars) | Describes ChangesHash computation in consensus flow |
| [State Proof Bundles](/light-clients/state-proof-bundles) | References ChangesHash as Momentum commitment |
| [Open Research Questions](/research/open-questions) | Lists related open questions |

---

## Status

**Open** — Awaiting architect response.
