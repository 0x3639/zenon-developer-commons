# Architect Evaluation Questions: Privacy & Design Review

Research Note — Evaluation Framework

This document contains questions for evaluating the Zenon architecture from privacy and security perspectives. These questions are designed to probe assumptions, identify gaps, and ensure the design is robust.

---

## Part 1: Privacy Principles Questions

### Network-Level Privacy

1. **What privacy does a user have against their Sentry operator?**
   - In multi-user Sentry deployments, the Sentry sees all account-chains it serves. What prevents correlation of user activity across accounts?

2. **What information do Sentinels learn about transaction senders?**
   - Sentinels validate and relay transactions. Can they build a map of IP to account relationships?

3. **How does the system protect against network-level traffic analysis?**
   - Is there any consideration for Tor/VPN integration, or is IP-level privacy explicitly out of scope?

### On-Chain Privacy

4. **Are transaction amounts visible on-chain, and is this by design?**
   - The documentation doesn't mention confidential transactions. Is amount transparency a deliberate trade-off?

5. **What prevents chain analysis across account-chains?**
   - Since each address has a sequential chain, linking addresses seems straightforward. Is there any mixing or unlinkability consideration?

6. **Can a user have multiple unlinkable identities?**
   - Or does the account-chain model inherently tie all activity to a single persistent identity per address?

### Light Client Privacy

7. **What do proof-serving nodes (Supervisors, bundle servers) learn about users?**
   - When a browser requests proofs for specific accounts, does this reveal which accounts the user cares about?

8. **Is there a way to request proofs privately (e.g., PIR, oblivious transfer)?**
   - Or is the threat model that proof servers are semi-trusted for privacy?

9. **What is the privacy trade-off between running a personal Sentry vs. using a shared one?**
   - The docs mention this trade-off exists but don't quantify it.

### Cross-Layer Privacy

10. **If the Momentum Data field is activated for cross-chain commitments, what privacy implications arise?**
    - Could external chain data reveal information about Zenon users?

---

## Part 2: Design & Math Challenge Questions

### ChangesHash & Commitments

1. **How is ChangesHash computed, and why isn't it decomposable?**
   - Without Merkle decomposition, how can a light client verify partial state efficiently? The docs flag this as a gap.

2. **What happens if two nodes compute different ChangesHash values for the same Momentum?**
   - Is there a formal proof that deterministic execution guarantees identical hashes?

3. **Can you provide a formal specification of what ChangesHash commits to?**
   - The list (balances, mailboxes, staking, etc.) is informal. What's the canonical ordering and encoding?

### Security Model Assumptions

4. **What is the formal fault tolerance bound for Pillar consensus?**
   - The docs mention "honest validator supermajority" but don't specify 2/3, 1/2, or weighted thresholds.

5. **What game-theoretic analysis supports the assumption that Pillars remain honest?**
   - What prevents a cartel of top stakers from colluding? What's the cost of attack vs. reward?

6. **How does confirmation depth translate to security in a non-PoW system?**
   - The Bitcoin formula P ≈ (q/p)^z assumes PoW. Does the same exponential security hold for Pillar-based consensus?

### Verification Boundaries

7. **Can a light client detect censorship?**
   - The docs explicitly say "NG3 — Censorship Detection: Cannot detect withheld transactions." Is this fundamental or addressable?

8. **Can two honest light clients arrive at mutually inconsistent states?**
   - "NG4 — Cross-Verifier Agreement" suggests yes. What's the reconciliation mechanism?

9. **What is the retention window k, and how was it chosen?**
   - The docs reference k but don't specify its value or the analysis behind it.

### Eclipse & Network Attacks

10. **How many peers must a browser connect to for eclipse resistance?**
    - The threat model acknowledges eclipse attacks but doesn't quantify resistance.

11. **What prevents a malicious bootstrap server from eclipsing new clients?**
    - First-contact problem: how does a fresh browser find honest peers?

12. **Can WebRTC relay infrastructure be exploited for targeted DoS?**
    - The docs flag this as an open question.

### Account-Chain Model

13. **How do ACIs handle atomic multi-party coordination?**
    - If execution is local to each account-chain, how are atomic swaps or multi-sig transactions guaranteed?

14. **What prevents state divergence between heterogeneous client implementations?**
    - The docs assume "deterministic execution" but don't specify a reference implementation or conformance tests.

15. **Can an account-chain be "frozen" by a malicious Pillar refusing to include blocks?**
    - Is there liveness guarantee for individual accounts, or only for the system as a whole?

### Proof System Gaps

16. **What is the formal committee proof scheme for verifying Pillar eligibility?**
    - The docs mark this as "Partial" — what's the plan to complete it?

17. **How are state proof bundles canonicalized?**
    - Can two different bundles produce equivalent proofs? How is equivalence verified?

18. **What cryptographic primitives are used for signatures and hashes?**
    - The docs mention ECDSA and SHA256 but don't specify curves or parameters.

---

## Summary: Top 10 Questions to Prioritize

### Privacy (Top 5)

1. What information do Sentinels/Supervisors learn about users, and is this acceptable?
2. Are transaction amounts and recipients publicly visible by design?
3. How does a user achieve unlinkability across multiple addresses?
4. What's the formal privacy model for light clients requesting proofs?
5. Is network-level privacy (IP anonymization) in scope or explicitly excluded?

### Design/Math (Top 5)

1. What's the formal specification of ChangesHash computation and determinism guarantee?
2. What game-theoretic analysis supports the honest Pillar supermajority assumption?
3. How does confirmation depth provide security without PoW?
4. What's the committee proof scheme for verifying Pillar eligibility?
5. How do light clients achieve eclipse resistance with quantifiable bounds?
