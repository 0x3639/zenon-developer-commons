# The Wrong Layer

## Block-Lattice Solved Payments. Vite Put Execution on the Wrong Layer. The Question Is What the Right Layers Look Like.

-----

## Preface: The Thesis, Stated Early

This paper defends a specific architectural thesis. It is stated upfront so the reader knows what is being argued and can evaluate the evidence accordingly.

**The thesis:**

- Do not put contracts on account chains. Account chains are for settlement. They are not coordination surfaces.
- Do not put execution on the commitment chain. The commitment chain is a verification surface, not an execution environment.
- Use account chains for feeless asynchronous payment settlement.
- Use the commitment chain for state anchoring and proof registration.
- Use the Sentinel layer, or specialized services emerging from it, for state serving, proof distribution, and data availability.
- Use off-chain execution for programmability, with results returned to the settlement layer via proof-carrying transactions.

This is not a description of any fully deployed system. It is a description of an architecture structurally implied by the decisions Zenon has already made – one that resolves the problems that eliminated prior attempts to extend block-lattice beyond payments. Whether Zenon is building toward this architecture deliberately or arriving at it through independent decisions that happen to compose correctly is a question about intent. The structural argument does not depend on the answer.

-----

## I. What Block-Lattice Actually Solved

Every blockchain that existed before Nano had the same fundamental problem: a single line.

Every transaction in the world had to wait its turn in that line. The line could only move as fast as the network could agree on its order. That agreement took time – sometimes seconds, sometimes minutes. Fees existed largely to decide who got to cut the line. And no matter how fast you made the computers, the line itself was the ceiling.

These are not engineering problems you can optimize away. They are consequences of the architecture. The line is the bottleneck. To remove the bottleneck, you have to remove the line.

In 2018, Colin LeMahieu published the Nano whitepaper and did exactly that. The insight was deceptively simple: most transactions have nothing to do with each other. When you send money to a friend, your transaction doesn’t need to be ordered relative to a transaction between two strangers on the other side of the world. The global sequence is unnecessary – it just happens to be how everyone had built things.

Nano’s block-lattice architecture gives every account its own chain. You only write to your chain. Your recipient writes to theirs. A transfer creates two entries – a send on your chain, a receive on theirs – linked together by a hash reference. No global ordering exists or is required. Two transactions on completely different accounts can confirm at the same time, independently, because they genuinely are independent.

The result was remarkable. Confirmation times dropped to under a second. Fees disappeared – because fees existed to ration a bottleneck that no longer existed. The throughput ceiling was lifted because there was no longer a single sequence everyone was competing to extend.

This was not an incremental improvement on Bitcoin or Ethereum. It was a fundamentally different answer to the question of how a payment network should work. Nano proved that the global ledger – the single shared sequence that every blockchain before it had taken for granted – was not a necessary feature of a sound payment system. It was a design choice, and it was the wrong one for payments.

Block-lattice’s answer to “did this transfer occur and is this balance correct?” is exceptionally efficient. But the scope of that answer is precise, and it matters. Account chains work because accounts do not share state in real time. That independence is the source of the efficiency. It is also the boundary of what the primitive can do natively.

When you try to push past that boundary – when you try to build programmable contracts on top of account chains – something breaks. Understanding what breaks, and why, is what the rest of this paper is about.

-----

## II. The Verification Gap: The Problem That Precedes Composability

Before getting to smart contracts, there is a structural problem that most analyses of block-lattice skip over entirely. It is worth understanding clearly, because every more complex function depends on it.

Think about what it means to verify a bank balance. In a traditional database, there is a current state – a number – and you can look it up. In Bitcoin or Ethereum, there is a global chain, and any participant can replay that chain from the beginning and arrive at the same current state. Verification is built into the architecture. It is free.

Block-lattice removed the global chain to remove the bottleneck. But in doing so, it also removed the free verification mechanism.

Consider what a new participant faces when joining a block-lattice network. There is no single global sequence to replay. Instead, there are millions of individual account chains, each recording the history of one account. To verify the current balance of any account, you need the history of that account’s chain. To verify the full state of the network, you would need all of them.

This creates a category of problem called the **verification gap**: the system can efficiently settle payments, but it cannot efficiently prove its own state to someone who wasn’t watching the whole time. A participant can ask the network “what is this balance?” and receive a trustworthy answer – but that answer is inseparable from the live network interaction. It cannot be packaged into a compact, self-verifying artifact and handed to a third party.

In practical terms, this gap has several downstream consequences:

**Pruning.** Account chains grow indefinitely. Without a way to take a cryptographic snapshot of the full balance set at a point in time, no node can safely discard old history. Every node must keep everything.

**New node synchronization.** When a new node joins, how does it know it has the right state? It can download all the account chains, but without a trusted reference point, it has to trust whoever gave it the data.

**Light clients.** Mobile phones and browsers cannot store the full history of millions of account chains. Without a compact proof they can check, they have to trust an intermediary for their balance information. In an adversarial setting, that trust is a vulnerability.

**Compensation for infrastructure.** Nodes that serve state and historical data bear significantly higher costs than nodes that just vote on consensus. Without a way to compensate them, they depend on volunteers who may eventually stop volunteering.

These problems exist even in a system that never attempts smart contracts. They arise directly from the removal of global ordering – the same removal that created block-lattice’s efficiency. The commitment chain exists, in the first instance, to solve this problem: to provide periodic cryptographic snapshots of the full state that any participant can check. Not to run contracts.

-----

## III. Vite Put Execution on the Wrong Layer

After Nano demonstrated block-lattice’s power for payments, the obvious question was: can you build a general smart contract platform on the same foundation?

Vite tried. Its answer was elegant in principle: give each smart contract its own account chain, just like each user account. Contract interactions become asynchronous messages passed between chains. The global bottleneck stays eliminated.

The problem is that smart contracts derive most of their value from a property called **composability** – the ability for contracts to call each other and have the results be consistent. Consider a decentralized exchange. When you swap tokens, the exchange contract needs to read the current price (which depends on the current reserve balances), calculate how many tokens you get, subtract the tokens you’re paying in, add the tokens you’re receiving, and transfer both atomically. Every step depends on the step before it. If the reserve balances change between when the price was read and when the transfer completes, the trade is wrong.

In Ethereum, this is handled by making all of it happen in a single atomic transaction: either everything succeeds, or everything reverts. The global order guarantees that nothing can change in between.

In Vite’s asynchronous model, a “send” and a “receive” are separate events that happen at different times. Between them, any other message could have arrived and changed the contract’s state. What looks like a single logical operation is actually a multi-step interaction with observable intermediate states. There is no rollback guarantee. Atomicity – the “all or nothing” property – disappears.

This is not slow composability. It is the structural absence of composability for the interactions that matter most. You cannot build a reliable AMM, a lending protocol, or a derivatives platform on a foundation where the state can change between the steps of a single logical operation.

It is worth being precise about what this means for Vite’s commercial fate. Vite faced many challenges beyond architecture: thin ecosystems, limited tooling, poor market timing, insufficient liquidity. Architecture was probably not the only reason it did not achieve widespread adoption. But the composability problem is real and demonstrable independently of the commercial outcome. An identical architecture with better marketing would still not have solved it. The two questions are separate.

The deeper point is this: Vite was not trying to solve an impossible problem. It was trying to solve a real problem – adding programmability to block-lattice – on the wrong layer. On-chain asynchronous execution is fundamentally mismatched to the coordination requirements of composable contracts. Not because execution is impossible on account chains, but because the independence of account chains – the very property that makes them efficient for payments – is incompatible with the shared-state consistency that composable contracts require.

The right place for execution that requires coordination is not on the settlement layer. It is somewhere else entirely. Understanding where is what the architecture in this paper is built around.

-----

## IV. Proof-Carrying Execution

The core insight of this section can be stated simply: if you need the execution environment to be expressive and composable, build it somewhere that is not constrained by account-chain independence. Then use a proof to bring the result back to the settlement layer trustlessly.

Think of it like a court proceeding. The judge does not perform the forensic analysis themselves – they receive a report from an expert and verify its credentials. The work happened somewhere else. What arrives in the courtroom is a certified summary plus the documentation to verify it. The verdict depends on the verification, not on re-running the analysis.

Proof-carrying execution works similarly. A smart contract executes in an off-chain environment – a separate virtual machine, unconstrained by account-chain independence – that can maintain whatever shared state composability requires. The execution produces a result and a mathematical proof that the result followed the rules correctly. That proof is anchored to the commitment chain. Any token movements the execution requires are settled on account chains.

This cleanly separates three concerns that on-chain execution conflates:

- **Correctness:** did the execution follow the rules? Answered by the proof.
- **Settlement:** did the token transfer actually occur? Answered by the account chains.
- **Anchoring:** is this result part of the canonical record? Answered by the commitment chain.

The composability problem that defeated Vite simply does not arise here. The off-chain executor is not constrained by account-chain independence. It can read and write shared mutable state, enforce atomicity, and roll back failed operations – because it is not operating on the settlement layer at all. It has its own environment, designed for exactly this kind of coordination.

**The proof mechanism is a spectrum, not a single technology.** There are a few different ways to produce a trustworthy proof:

- *ZK validity proofs* are the cleanest long-term option. A zero-knowledge proof is a mathematical object that certifies an execution was correct without requiring anyone to re-run it. Verification is instant and requires no trust assumptions. This is the endgame.
- *Fraud proofs with challenge windows* are a practical intermediate option. The executor posts a result; any participant can challenge it within a fixed time window. If no valid challenge arrives, the result stands. This requires more infrastructure – a bonded executor, defined dispute rules, penalty logic – but it is achievable with current technology.
- *Attestation-based proofs* are the weakest form: a quorum of trusted nodes attest that an execution was correct. Security depends on the honesty of the attestors rather than mathematics.

The architecture accommodates all three, with ZK as the long-term target. An important practical note: ZK proof generation for complex contract execution currently takes seconds to minutes, not milliseconds. Sub-second ZK proofs for production-scale contracts are a technology target, not today’s reality. This is a constraint on ZK as an immediate implementation choice, not on the architecture – fraud proofs and attestation can serve as stepping stones while ZK technology matures.

-----

## V. The Commitment Chain as Verification Surface

The commitment chain is not an execution environment. It is a verification surface.

This distinction is the load-bearing claim of the architecture, and it is worth sitting with. The temptation when building on top of block-lattice is to treat the commitment chain as the “smart layer” – the place where complex logic runs, where programs execute, where gas is consumed. That temptation should be resisted.

Here is why. If the commitment chain runs contracts, it must handle everything that contract execution requires: the throughput of every contract call, the latency of every execution, the state of every contract. It becomes the bottleneck again – a global sequence that everything competes to be included in. The efficiency gains of block-lattice settlement are largely surrendered.

If, instead, the commitment chain is treated as a verification surface – a place where state is cryptographically anchored and execution proofs are registered – its load is proportional to the rate of proof submission, not the rate of contract execution. Proofs are submitted occasionally, after batches of execution are complete. Contract execution might happen thousands of times per second; proof submissions might happen dozens of times. That difference is orders of magnitude.

**What a verification surface must actually do:**

- Periodically commit a cryptographic snapshot of the full account-chain balance set, so any participant can verify any balance without replaying the full history.
- Accept and anchor execution proof submissions, providing a canonical record of which proofs arrived in which order.
- Maintain the ordering of these commitments and anchors, so downstream verification has an unambiguous reference point.
- Compensate the operators who produce these commitments.

Zenon’s momentum chain currently does part of this: each momentum block records which account-chain transactions were confirmed during that window. This is useful – it is a receipt index that proves specific transactions occurred. But it is not yet a commitment to the full balance set. There is no Merkle root or equivalent snapshot against which a new participant can verify balances without replaying history. That gap – between a receipt index and a true state commitment – is the specific upgrade that closes the verification gap and enables the proof-carrying execution model.

What form that state commitment should take is a genuine open question. A Merkle tree over all account balances is the most familiar option and well-understood. But other structures – frontier commitments, proof bundles, statement-level verification – may fit better with Zenon’s direction, be more efficient for specific verification patterns, or compose more cleanly with ZK circuits. The choice matters and deserves dedicated analysis. It is where the architecture’s research frontier actually sits.

-----

## VI. The Data Availability Problem

There is a subtle dependency in proof-carrying execution that is easy to overlook.

A proof certifies that an execution was correct. But it does not guarantee that anyone can see the inputs that went into that execution. If the entity that ran the computation holds all the raw data and disappears, the proof anchor exists in the commitment chain but is unverifiable – because the data you would need to actually check the proof against is gone.

This is called the data availability problem, and it is distinct from both the correctness problem (which proofs solve) and the snapshot problem (which state commitments solve). It requires its own answer.

In a conventional blockchain, data availability is a free byproduct: every node that processes the chain has the data, because processing the chain means processing the data. In an off-chain execution model, the computation happens somewhere else. The commitment chain has the proof anchor. But who has the underlying data? Who is required to store it? How long must they keep it? What happens if they disappear?

The strength of the available guarantees exists on a spectrum:

- *Weak:* nodes store execution data voluntarily. Retrieval depends entirely on their goodwill and continued participation. No guarantee.
- *Medium:* nodes are economically rewarded for storing and serving data, and penalized for withholding it. Reliable under honest majority assumptions, but still not a mathematical guarantee.
- *Strong:* erasure coding and data availability sampling allow any client to verify that data is available without downloading all of it, and without relying on any single node to hold everything. This is the approach taken by dedicated data availability layers and represents the strongest achievable guarantee.

Sentinels – the service nodes in Zenon’s architecture – are the most natural place for data availability infrastructure to emerge. They have economic stake in the protocol, they are designed to serve data to lighter clients, and the gap between their current function and a medium-strength data availability guarantee is smaller than for any other component. But this is positioning, not implementation. The data availability guarantee model for Zenon’s execution layer has not been formally specified, and claiming otherwise would be inaccurate.

Before the proof-carrying execution model can be deployed without trust assumptions, specific questions must be answered: What data must accompany a proof submission? Who must store it, for how long, under what economic conditions? What can a client expect in terms of retrieval guarantees? What is the recovery path if data is unavailable? These are the next layer of specification required.

-----

## VII. The Three-Layer Architecture

The analysis above maps onto three layers with distinct responsibilities. The architecture is not complicated once stated plainly:

```
Layer 1: Account Chains (Settlement)
  Purpose:   Feeless asynchronous payment settlement
  Mechanism: ORV consensus on independent account chains
  Finality:  Low-latency under ORV
  Property:  No global ordering required; no throughput ceiling

Layer 2: Commitment Chain (Momentum)
  Purpose:   State anchoring and proof registration
  Mechanism: Globally ordered consensus at commitment granularity
  Finality:  Inter-momentum interval
  Property:  Canonical record of balance commitments and proof anchors
             -- not an execution environment

Layer 3: Service Layer (Sentinel or equivalent)
  Purpose:   State serving, proof distribution, data availability,
             execution relay -- or some subset, distributed across
             specialized subclasses
  Mechanism: Economically incentivized service nodes with stake;
             exact role subdivision is a design question
  Finality:  Depends on proof mechanism (immediate for ZK,
             windowed for fraud proofs)
  Property:  Natural coordination point for infrastructure that
             the absence of base-chain global consensus requires
```

The organizing principle is simple: each layer handles what it is structurally suited for, and nothing else. Payments need no coordination, so they go to Layer 1. Canonical ordering of state snapshots and proof registrations requires consensus, so that goes to Layer 2. Everything that requires data storage, proof generation, and active serving of clients goes to Layer 3.

No layer does another layer’s job. The commitment chain does not execute contracts. Account chains do not produce state snapshots. Sentinels do not determine consensus. The separation is the design.

**The verification hierarchy.** This architecture creates a natural spectrum of participation for different kinds of clients:

- *Full nodes* maintain complete account-chain history and participate in ORV consensus. Strongest guarantees, highest resource requirements.
- *Sentinels*, in the proposed model, maintain committed state and serve proofs. They are the infrastructure layer that makes the system usable for lighter participants.
- *SPV clients* verify individual balances and transaction inclusion against committed state snapshots using compact proofs. No full history required; trust only the commitment chain consensus, not any individual server.

The end state this points toward is a browser or phone that can trustlessly verify its own balance against a momentum-committed state snapshot, using a compact proof served by a Sentinel, without running a full node. That has not been built yet. But the path to it is structurally clear.

-----

## VIII. The Sentinel Layer as Natural Proof Infrastructure

To understand why a service layer is necessary, it helps to understand what block-lattice’s efficiency actually costs.

In a globally-ordered blockchain, any participant can query the current state directly and get a trustworthy answer. There is a canonical sequence. Replaying it gets you the correct current state. An application that needs to know your balance before processing a contract interaction can look it up and trust what it finds.

Block-lattice has no equivalent mechanism. Consensus is local – it operates on individual account chains, not global state. There is no canonical global state query. An off-chain executor that needs current account balances before running a contract has three options: ask a full node directly (which requires trusting that node), wait for a momentum-committed state snapshot (correct but not live), or query a service layer that maintains committed state and can answer with a verifiable proof.

The third option is not a preference – it is what fills the structural gap that removing global consensus creates. This is the argument for a service layer: not that Sentinels are a convenient add-on, but that the architecture that makes account-chain settlement efficient necessarily creates a state-query problem that only a service layer can solve without introducing new trust assumptions.

Sentinels are the natural candidate. Consider what proof-serving infrastructure actually requires: nodes that maintain enough state history to generate and serve proofs on request; computational resources adequate for proof generation under load; economic incentives to perform these functions reliably rather than as a volunteer service; a discovery mechanism so constrained clients can find proof servers; and a verification path so clients can confirm state without running a full node.

Sentinels, as currently understood, are positioned to address several of these: they are designed to serve data to lighter clients, they participate in network discovery, and they have economic stake in the protocol. The distance between “Sentinels as network health probers” and “Sentinels as proof infrastructure” is a specification and engineering gap, not a conceptual one.

Whether every Sentinel performs every role or specialized subclasses emerge – some focused on proof generation, others on data availability, others on execution relay – is a design question the architecture does not need to foreclose. The Sentinel layer is the natural coordination point. How that coordination is subdivided is an implementation detail.

**The claim, stated precisely.** The Sentinel layer is the most natural place for proof-serving infrastructure, data availability guarantees, and execution relay to emerge in Zenon’s architecture. That is different from saying Sentinels currently implement those functions or are specified to do so. The gap between structural positioning and implementation is real and should not be minimized.

-----

## IX. Why This Architecture Is Different

Three comparisons help locate this architecture in the design space.

**It is not Ethereum on block-lattice.** Ethereum requires global ordering because execution happens on-chain – every contract call must be sequenced relative to every other one. This architecture moves execution off-chain and uses the commitment layer only to anchor the results. The commitment chain never processes individual contract calls. Its load is proportional to proof submissions, not executions – a difference of orders of magnitude.

**It is not Vite.** Vite placed execution on-chain, on account chains, and tried to fake coordination through asynchronous message passing. The composability problem followed directly from that choice. This architecture places execution off-chain, where coordination is a design choice rather than an architectural constraint. The composability problem does not arise because execution is not constrained by the account-chain model.

**It is structurally distinct from standard ZK rollups.** ZK rollups sit on top of globally-ordered base layers (typically Ethereum) that provide data availability and sequencer ordering. This architecture’s base layer is block-lattice settlement, which is not globally ordered in the rollup sense. The commitment chain provides ordering at a coarser granularity. The relationship between execution proofs, data availability, and account-chain settlement is a design space that has not been fully resolved, and should not be described as solved.

The closest structural analogues are proof-based settlement systems that separate execution from settlement – but none sit on top of a block-lattice payment layer with independent account chains. The specific combination of feeless async settlement, commitment-anchored proof registration, and service-layer proof serving is not a description of any existing deployed system.

-----

## X. The Elimination Matrix

|Approach                         |Composability|State Commitment|Light Clients|Proof Serving|Data Availability|Node Incentives|Complexity|
|---------------------------------|-------------|----------------|-------------|-------------|-----------------|---------------|----------|
|Pure block-lattice               |–            |–               |–            |–            |–                |–              |Low       |
|On-chain async (Vite)            |–            |–               |–            |–            |~                |–              |Med       |
|On-chain sync execution          |+            |~               |~            |–            |~                |–              |Very High |
|Off-chain, trusted executor      |+            |–               |–            |–            |–                |–              |Med       |
|Off-chain, fraud proofs          |+            |+               |+            |~            |~                |~              |High      |
|Off-chain, ZK proofs             |+            |+               |+            |+            |~                |~              |Very High |
|Zenon current (Z)                |–            |~               |~            |–            |~                |~              |High      |
|Zenon + state commitment (Z+)    |–            |+               |+            |~            |~                |~              |High      |
|Zenon + proof-carrying exec (Z++)|+            |+               |+            |+            |~                |+              |Very High |
|Zenon + DA specification (Z+++)  |+            |+               |+            |+            |+                |+              |Extreme   |

*+ = structural address. ~ = partial or conditional. – = not addressed.*

**Reading the matrix.** The progression from Z to Z+++ is a sequence of engineering and specification tasks on an existing architecture, not a research program. Z is where things stand now: receipt indexing, partial synchronization, basic incentives. Z+ adds a true state commitment. Z++ adds proof-carrying execution. Z+++ adds a formal data availability specification. Each step depends on the prior one.

Off-chain fraud proofs score comparably to ZK proofs on most criteria and are achievable with current technology. ZK proofs score better on finality speed and trust assumptions. The architecture supports both; the choice is a tradeoff between what can be built now and what is strongest in the long run.

-----

## XI. What Is Proven, What Is Plausible, What Is Speculative

**Proven or strongly demonstrated:**

- Block-lattice removes the global ordering bottleneck for payments.
- Asynchronous on-chain contract execution eliminates atomic composability for stateful cross-contract interactions.
- Vite did not achieve Ethereum-like composability with its async execution model.
- Shared mutable state introduces coordination requirements that account-chain independence does not satisfy natively.
- Verification, pruning, and light-client design are structurally harder without global state commitments.
- Proof mechanisms (fraud proofs, validity proofs, ZK proofs) enable trustless verification of off-chain computation.
- Data availability is a distinct problem from correctness and requires its own guarantee model.

**Plausible but not proven:**

- Off-chain proof-carrying execution is the most structurally coherent path to combining block-lattice payments with general programmability.
- The commitment chain is more useful as a verification surface than as an execution environment.
- The Sentinel layer is the most natural place for proof-serving and data availability infrastructure to emerge.
- The architecture described in this paper is structurally consistent with Zenon’s design direction.
- The upgrade path from Z to Z+++ is an engineering task sequence rather than a research program.

**Speculative:**

- That Zenon intends off-chain proof-carrying execution as its smart contract model.
- That the Sentinel layer will implement proof serving and data availability guarantees at scale.
- That ZK proof generation will reach sub-second latency for complex contract execution within a relevant timeframe.
- That the three-layer model described here represents a novel architectural combination without close equivalent.

-----

## XII. Open Questions

**The state commitment form.** What structure should carry the state commitment in each momentum block? A Merkle balance trie, frontier commitments, proof bundles, and statement-level verification structures each have different proof size, update cost, ZK circuit compatibility, and SPV trust model characteristics. The choice propagates through every downstream verification and proof-serving function. It deserves dedicated technical analysis before implementation.

**The data availability specification.** What data must accompany a proof submission to the commitment chain? Who stores it, under what economic conditions, for how long? What is the retrieval guarantee? What is the recovery path if data is unavailable? These questions must be answered before the proof-carrying execution model can be deployed without trust assumptions.

**The execution environment.** If off-chain execution is the design direction, what is the execution environment? What virtual machine, what language, how does contract state interact with account-chain token balances? How are the economics of proof generation compensated? None of this is currently specified.

**The Sentinel specification gap.** What would Sentinels need to do, specifically, to implement proof serving and execution relay? What is the delta between current specification and that function? This is an engineering scoping question with a concrete answer.

**The proof mechanism progression.** What is the natural progression from attestation-based proofs to fraud proofs to ZK validity proofs? Can the architecture support multiple proof mechanisms simultaneously, or does it require a single canonical mechanism? How does finality stratification work across mechanisms?

**The sequencing question.** Off-chain execution anchored to the momentum chain uses momentum ordering as a sequencer substitute. What are the liveness and censorship-resistance properties of this arrangement? Under what conditions can the momentum chain be used to censor proof submissions, and what are the mitigations?

-----

## XIII. Conclusion

Block-lattice is a genuine architectural discovery. Colin LeMahieu’s insight – that the global ledger is not a necessary feature of a sound payment system – is one of the cleaner ideas in the history of distributed systems. It removed a bottleneck that most people had accepted as permanent. Nano demonstrated the result: near-instant confirmation, no fees, no throughput ceiling.

That discovery has a precise scope. Account chains work because accounts do not share state. Everything that requires sharing state – composable contract execution, global balance verification, proof anchoring – requires a different layer.

Vite extended the primitive in the wrong direction. On-chain asynchronous execution tried to fake coordination through message passing on account chains. The result lacked the property it was designed to provide. The failure was not that the problem is unsolvable. It was that the solution was attempted on the wrong layer.

The right architecture distributes responsibility cleanly:

- Account chains settle.
- The commitment chain anchors state and proofs.
- Sentinels, or specialized services emerging from them, serve state, distribute proofs, and hold execution data.
- Off-chain executors run contract logic.
- Proof mechanisms – fraud proofs now, ZK proofs as the technology matures – make execution results trustlessly verifiable.

The commitment chain is not an execution environment. It is a verification surface. That distinction is the load-bearing claim of this architecture, and it should be stated in those terms wherever the architecture is described.

This architecture appears structurally consistent with the problems it aims to solve. That is a more precise claim than “the architecture is sound” – and it survives scrutiny that the stronger formulation does not. The gaps are real: state commitment is not yet implemented, data availability is not yet specified, the execution environment has not been designed, and ZK proof generation has not reached the required latency targets. These are large gaps with a clear shape, which is a better position than gaps whose shape is unknown.

Nano proved the payment primitive. Vite proved that on-chain async execution was the wrong layer. The architecture described here is an attempt to name the right layers and specify what each one must do.

Whether Zenon builds toward it is an empirical question. That the architecture is the most coherent one to build toward, among the currently visible options, is the claim this paper has defended.

-----

*The strongest architectural differentiation is not “this system can run contracts.” It is “this system has identified which layer each problem belongs on, and refuses to solve one layer’s problem on another layer’s infrastructure.”*

-----

## References

[1] C. LeMahieu, “Nano: A Feeless Distributed Cryptocurrency Network,” 2018.
<https://content.nano.org/whitepaper/Nano_Whitepaper_en.pdf>

[2] Nano Documentation, “Protocol Design – ORV Consensus.”
<https://docs.nano.org/protocol-design/orv-consensus/>

[3] Nano Documentation, “What is Nano – Overview.”
<https://docs.nano.org/what-is-nano/overview/>

[4] Nano Documentation, “Running a Node – Overview.”
<https://docs.nano.org/running-a-node/overview/>

[5] Nano Documentation, “Protocol Design – Ledger.”
<https://docs.nano.org/protocol-design/ledger/>

[6] Vite Labs, “Vite: A DAG-Based Asynchronous Smart Contracts Platform,” 2018.
<https://www.vite.org/whitepaper/vite_en.pdf>

[7] Nano Documentation, “Protocol Design – Spam, Work, and Prioritization.”
<https://docs.nano.org/protocol-design/spam-work-and-prioritization/>

[8] Senatus, “The Bucketing System: Prioritizing Transactions through Time and Balance,” December 2022.
<https://senatus.substack.com/p/the-bucketing-system-prioritizing>

[9] Medium / Computation Frontier, “zkVMs Progress: zkVMs Are Continuously Improving,” November 2025.
<https://medium.com/@CFrontier_Labs/zkvms-progress-zkvms-are-continuously-improving-9e0aed20c495>

[10] PANews, “From Real-Time Proofs to Native Rollups: The Final Stage of Ethereum Scaling Driven by ZK,” August 2025.
<https://www.panewslab.com/en/articles/4f8ad2cd-fbc7-48d7-b9de-81f5a2569c7a>

[11] Ahmadvand et al., “push0: Scalable and Fault-Tolerant Orchestration for Zero-Knowledge Proof Generation,” 2025.
<https://arxiv.org/pdf/2602.16338>

[12] Celestia Documentation, “Data Availability Layer.”
<https://docs.celestia.org/learn/celestia-101/data-availability/>

[13] Al-Bassam et al., “Fraud and Data Availability Proofs: Maximising Light Client Security and Scaling Blockchains with Dishonest Majorities,” 2019.
<https://arxiv.org/abs/1809.09044>