# The Wrong Layer: The Strange Node
## If Zenon Wants Programmability, What Survives Elimination?

---

## Preface: While Everyone Else Was Discovering Modularity

On February 1, 2022, Kaine wrote a single sentence into the Zenon community chat:

*"Another external VM can be integrated in order to facilitate user based smart contracts. I recommend WASM. Also don't forget unikernels."*

No elaboration. No whitepaper section. Just a recommendation, stated as though the reasoning was obvious to anyone paying attention.

Three weeks later, someone asked directly: why not EVM?

*"For example someone wants to integrate EVM (I'm not a fan and don't recommend it) in order to support Solidity smart contracts. Others can integrate a WASM runtime for smart contracts (I recommend this) like Polkadot/Cosmos. We didn't want to impose a specific VM/runtime, the community should embrace a de-facto for smart contracts (hopefully WebAssembly)."*

At the time, Ethereum was the dominant smart contract platform and EVM compatibility was treated as a near-universal shortcut to developer adoption. Much of the alt-L1 thesis was built on it. Avalanche, BSC, Fantom, Polygon. The prevailing wisdom was that EVM compatibility was table stakes. Kaine was dismissing it, on the record, in a community chat.

December 2022. A community member raises the idea of integrating a heavy VM. Kaine:

*"From an architectural point of view, one of the best decisions so far was avoiding the implementation of a heavy VM at L1/on-chain. Do you know why?"*

Then, that same month: *"Networks that implemented a heavy VM (EVM/WASM) at L1 will always be plagued by scalability issues in the long run."* And: *"EVM at L1 is a deal breaker."* And: *"A simple and robust L1 with minimal features will always outperform over-engineered and complex designs that try to accomplish too many things at once."* And: *"ZK-proof rollups are part of the strategy to keep the L1 minimal and robust. The state of the rollup will be posted and verified on-chain."*

Celestia (the project that would formalize data availability as a distinct architectural layer) launched its mainnet in October 2023. At the time Kaine was writing those messages, Celestia was still in testnet. The broader modular blockchain research narrative was forming but had not yet crystallized into the framework most of the industry now uses.

March 2023. Kaine quotes external research: *"Traditional (monolithic) systems store all transaction data on the machine running consensus."* Then adds: *"That's why we have a dual-ledger, block-lattice structure with independent account-chains to store transactions data."* Then, immediately after: *"You can re-read the whitepaper and see that our design choices ~4 years ago are still valid today (on par with state-of-the-art architectures)."*

He was noticing the convergence himself.

May 2023. Extension chains become the focus. *"Extension chains are the fastest way for smart contracts at the moment. Extension chains can have their own consensus protocols, VMs, implementations, etc. EVM, WASM, AMMs, etc will be available on the extension chains."* On security: *"Pillars can validate extension chains in a shared security model. New approaches like Eigenlayer's restaking mechanism can be implemented via embedded contracts."*

EigenLayer launched in mid-2023. Kaine was already sketching the shared security model.

The picture that emerges is not a project following the industry toward modular architecture. It is a project that was working through the same underlying problems (where does execution belong, how do you keep consensus minimal, what is the relationship between settlement and computation) from first principles, roughly in parallel with the research the broader industry was formalizing under different names.

The language the broader industry eventually settled on (rollups, data availability, modular execution, shared security, restaking) arrived later. The underlying separations were already there.

---

**Thesis:** If Zenon wants programmability, the process of elimination converges on WASM extension chains: execution outside L1, data and proof infrastructure supported by Sentinels, validation under a shared-security model involving Pillars, commitments anchored in Momentum, and settlement finalized through account chains. This essay argues for a direction, not a complete specification. But it advances one stronger claim alongside that direction: the architectural decisions that determined this destination were largely made years ago, before the industry had developed vocabulary to describe what they were. What remains is less an architecture question than a specification and implementation problem. Those are very different problems.

---

## On What Elimination Means Here

Before working through each candidate, a clarification about what "elimination" is doing in this argument.

Elimination here means: *this option is architecturally incompatible with Zenon's existing design properties, or fails against requirements the architecture itself implies.* It does not always mean the option is impossible in some absolute sense. It means the option forces tradeoffs that undercut properties Zenon already has, and that those tradeoffs are not worth making.

Some of what follows is stronger elimination: the candidate fails categorically. Some is softer: the candidate is deprioritized because a better-fitting alternative already exists within the architecture. Where the distinction matters, it will be flagged.

The goal is to narrow the design space. Not to close every question, but to show that many of them are already constrained by decisions that have been made.

---

## The Elimination Table

| Candidate | Why It Gets Narrowed or Eliminated |
|---|---|
| EVM | Architecturally incompatible with account-chain state model |
| Monolithic smart contracts | Violates the dual-ledger's core separation principle |
| Custom VM | Wrong engineering tradeoff: a solved problem with maintenance overhead |
| Execution inside Momentum | Collapses the separation the dual-ledger was built to maintain |
| Execution inside account chains | Settlement and computation are different problems |
| Separate external DA network | Zenon possesses a native infrastructure layer that may cover this function |
| Immediate base-layer settlement | Fraud proofs must precede settlement effects |
| Immediate ZK validity proofs | Not yet practical for production WASM execution at scale |

---

## Elimination 1: The EVM

Kaine said it plainly in December 2022: *"EVM at L1 is a deal breaker."*

The reason is architectural, not aesthetic.

The EVM is not a bytecode format you can drop into any environment. It is the execution component of a globally ordered state machine. Its storage model assumes synchronous access to shared global state. Its gas model assumes execution happens directly inside consensus. Its call semantics assume contracts can synchronously invoke one another within the same state transition.

Zenon does not share those properties. Account chains localize state per account. There is no globally shared memory pool for contracts to reach into synchronously. Momentum does not simulate every program. It verifies commitments and orders events.

When you put the EVM on top of account chains, the mismatch is immediate: you inherit all of Ethereum's complexity while discarding the architectural conditions that made that complexity coherent. The compatibility surface evaporates. The baggage remains.

The EVM survives exactly one use case: Ethereum compatibility. If the goal is architecture, eliminate it.

---

## Elimination 2: Monolithic Smart Contracts

Not EVM specifically, but execution inside consensus generally.

This is the model almost every blockchain uses. Execution, verification, and settlement collapse into a single environment. Every validator executes every contract. The shared state machine is the protocol.

Kaine named the failure mode in March 2023 by quoting external research directly: *"Traditional (monolithic) systems store all transaction data on the machine running consensus."* His response: *"That's why we have a dual-ledger, block-lattice structure with independent account-chains to store transactions data."*

The dual-ledger was not a performance optimization. It was the answer to a specific problem: if you collapse execution and consensus into one layer, every validator must recompute everything, and the throughput ceiling is set by the slowest participant willing to remain decentralized. You can raise the ceiling by requiring more powerful hardware, but that reduces the validator set and trades decentralization for throughput.

The dual-ledger's core property, November 2022: *"separate consensus from other business logic."*

Execution scales computational demand. Verification scales trust. Settlement scales value. These are different problems with different resource profiles. The monolithic architecture forces them to share the same bottleneck. Eliminate it.

---

## Elimination 3: A Custom Virtual Machine

In February 2021, Kaine did not propose a custom VM. He recommended WASM: an existing, battle-tested, formally specified execution format. By April 2022: *"The community should pick a runtime that is suitable and a team should implement it via AZ. I suggested WASM, indeed."*

A custom VM requires custom compilers, custom debuggers, custom formal verification frameworks, custom auditor expertise, and perpetual maintenance as the protocol evolves. All of this runs in parallel, forever, with every other engineering priority.

The execution layer needs one fundamental property: determinism. Given identical inputs and identical state, independent nodes must arrive at identical outputs. That requirement does not need a custom solution. It needs a well-specified existing runtime with appropriate constraints.

A custom VM solves a problem that does not exist. Eliminate it.

---

## Elimination 4: Execution Inside Momentum

WASM is the surviving execution format. The next question is where it runs.

The temptation is to run it inside Momentum. Reject it.

Momentum's strongest property is that it is minimal. The moment WASM execution enters Momentum, every contract becomes a consensus concern. Every validator must run arbitrary computation submitted by untrusted parties. Validator requirements grow with every application deployed. The distinction between "verify that this happened" and "compute this from scratch" collapses.

The system recreates the monolithic architecture that was just eliminated, with WASM instead of EVM but the same structural failure.

December 2022: *"Networks that implemented a heavy VM (EVM/WASM) at L1 will always be plagued by scalability issues in the long run."*

The VM changed. The structural problem is the same. Momentum doing less is a feature. Do not sacrifice it.

---

## Elimination 5: Execution Inside Account Chains

Account chains own state. They track balances, token holdings, ownership records. Execution there would mean contracts run locally, per-account.

This conflates settlement and computation.

Account chains are settlement infrastructure. Their security model is scoped to ownership and balance verification. Baking contract execution into account chains expands that security model to cover arbitrary computation, a fundamentally different and harder problem.

The coordination issue compounds it. Contracts need to interact with state outside their own account chain. An inter-account call becomes a cross-chain operation. The synchrony assumptions that smart contract patterns rely on break immediately.

Kaine's framing: *"The block-lattice is just for mapping accounts. The ultimate decision is still 'made' by the consensus protocol."* Account chains record. They do not compute.

Settlement and computation require different guarantees. Keeping them separate is the property to preserve.

---

## Narrowing 6: A Separate External DA Network

Once execution moves off Momentum and off account chains, data availability becomes acute.

A node executes contracts and posts state roots to Momentum. Momentum verifies the commitment. Everything looks valid on the surface. Now that node posts a correct-looking state root but withholds the underlying execution data. Nobody can verify whether execution was actually correct. The data withholding attack succeeds silently.

The reflex is to import an external DA layer. Celestia, EigenDA, something equivalent.

This is the softest section in the elimination argument, and it is worth being explicit about why. The case against an external DA network is not that it is architecturally incompatible. It is that Zenon may already possess a native infrastructure layer capable of hosting DA functions, which means importing an external solution adds coordination complexity and external trust assumptions before exhausting what already exists.

*"Sentinels won't need to compute PoW. Just process and relay information."* December 2022. *"Sentinels can also serve as protocol level oracles."* December 2022.

The Sentinel layer was positioned as service infrastructure from the beginning: nodes outside the critical consensus path, capable of relaying, serving, and observing. Whether that positioning is sufficient to satisfy DA requirements depends on open design questions: how Sentinel availability is enforced, what the sampling or attestation mechanism looks like, what the failure modes are under adversarial conditions.

Those questions are not answered here. The elimination is narrowing, not closing: before importing external infrastructure, the case for native DA through the Sentinel layer should be developed seriously. If that case cannot be made, external DA remains on the table. But the Sentinel layer's architectural position suggests it should be attempted first.

---

## Elimination 7: Immediate Base-Layer Settlement

The architecture is taking shape. WASM execution outside consensus. Data availability through native infrastructure. Commitments recorded in Momentum. Settlement on account chains.

The temptation: connect all of this immediately. Route real ZNN and ZTS through it.

This is how systems get exploited.

Base-layer settlement before fraud proofs means trusting that executing nodes never post incorrect state roots. That is a trust assumption, not a security guarantee.

Some mechanism for detecting and challenging incorrect state roots must exist before settlement effects propagate to account chains. An incorrect state root must be challengeable within a defined window. If a challenge succeeds, the state root is rejected. If no challenge succeeds within the window, the state root is accepted and settlement proceeds.

The precise challenge game (proof format, incentive structure, slashing mechanics) is an implementation question that follows from the separation. The architectural claim is the necessity of that mechanism, not its complete specification.

Until fraud detection is live and adversarially tested, real value should not move through the execution layer.

---

## Elimination 8: Immediate ZK Validity Proofs

The cleanest endgame is ZK validity proofs: instant cryptographic proof that execution was correct, no challenge window, finality backed by mathematics.

Kaine in December 2022: *"Community members that are interested should dive deep into zk-rollups and understand the crypto behind and how they (perfectly) fit into NoM."*

Eliminate it for now anyway.

ZK proving systems capable of generating proofs for general WASM execution at practical cost are not production-ready. Proof generation time, prover hardware requirements, and verification costs for arbitrary WASM programs remain impractical at scale. RISC Zero, SP1, and related zkVM projects are making real progress, but moving fast and production-ready are different claims.

Start optimistic. Build fraud proofs. When ZK provers mature to practical cost for WASM at this scale, replace the challenge window with validity proofs. The architecture supports this transition cleanly because the layers were already correctly separated.

---

## What Remains

The elimination process terminates. The architectural direction it identifies is specific.

```
Extension Chains  (WASM execution: operators, runtimes, external environments)
  ↓
Sentinel Infrastructure  (data availability + proof serving + relay)
  ↓
Proof Bundles / State Roots
  ↓
Pillars  (shared-security validation of compact commitments and proofs)
  ↓
Momentum  (anchoring + ordering of accepted outputs)
  ↓
Account Chains  (settlement + ownership + value)
```

Pillars validate compact extension-chain outputs; Momentum anchors accepted outputs. Neither layer replays extension-chain execution.

**Account chains** own value. ZNN, ZTS, balance state: settled here, secured here, unchanged by the execution layer above them.

**Momentum** anchors and orders outputs that have satisfied the extension-chain acceptance rules. It does not execute workloads or recompute contract state. Its job is to provide the canonical ordering surface once compact validation has occurred.

**Extension chains** host execution. WASM runtimes, operators, and external execution environments run here, outside the critical consensus path. Pillars provide shared-security validation over compact extension-chain outputs before those outputs are accepted into the canonical Momentum record. They do not execute extension-chain workloads; they validate commitments, proofs, and acceptance conditions. State roots, fraud proofs, ZK proofs, bundle commitments: compact outputs, not replayed computation.

**Sentinel infrastructure** supports the execution layer by serving data, relaying information, and constructing or hosting proofs. The exact form this takes (whether Sentinels are generalist nodes or differentiated into specialized classes for DA, relay, and proving) is an open design question. The architectural claim is about position: these functions belong in the service layer outside consensus, and Zenon already has a node class designed for exactly that position.


---

## The Strange Node

This is where the deeper observation lives, and it requires stepping back from the elimination process to ask a different question.

Every major infrastructure function that the broader blockchain industry has needed since 2020 had to be built as a separate network.

Ethereum needed execution scaled: rollup networks were created. Rollups needed data made available: Celestia and EigenDA were created. Proof generation was too expensive to run on commodity hardware: dedicated proving networks were created. Economic security needed to extend beyond the base layer: EigenLayer was created, and the AVS ecosystem followed. Oracles needed to be trustworthy: Chainlink and its competitors exist as separate networks. Bridges needed to be secured: yet more networks.

Each of these is a separate token, a separate validator set, a separate trust assumption, a separate coordination surface. The modularity was real: the correct architectural insight that these are different problems. But the execution was additive. Every time a new infrastructure need emerged, the response was to build another network on top of the existing stack.

Now consider what Zenon did.

Sentinels were described as a first-class protocol primitive from the beginning. They were not validators. They were not sequencers. They were not storage nodes. They were not oracle networks. They were not rollups. They were not bridges.

They were something the blockchain space did not yet have a word for: a native infrastructure layer, baked into the protocol itself, positioned outside the critical consensus path, and deliberately left general enough to host whatever service functions the network would eventually need.

*"Sentinels won't need to compute PoW. Just process and relay information."*

That sentence, written in December 2022, reads differently once you have watched the broader industry spend four years creating separate infrastructure networks for every function that sentence describes.

The point is not that Sentinels replace everything. The architecture that emerges from elimination assigns each layer a single primary responsibility: extension chains execute, Sentinels serve data and support proof infrastructure, Pillars validate commitment correctness under shared security, Momentum anchors ordering, account chains settle value. Each layer does what it is structurally suited for. None of them is doing another layer's job.

What makes the Sentinel position historically unusual is not that it does all of these things. It is that it was reserved as a protocol-level slot for service infrastructure before the industry had recognized that such a slot was needed. The industry's response to each new infrastructure requirement has been to build another network. Zenon's design started with a layer for that.

Whether Sentinels ultimately prove capable of hosting all the functions now distributed across separate networks is an open question, and an honest one. The Sentinel architecture is not fully specified. The trust model for Sentinel DA is not proven. The economics of Sentinel proof construction have not been designed. These are real unknowns.

But the architectural intuition (that infrastructure deserves its own protocol-level primitive rather than being patched in reactively) may be the most original thing in Zenon's design. Not the account chains. Not the dual-ledger. The strange node that never fit any existing category.

---

## The Architecture Question Has Narrowed

This is the claim that the elimination process, taken seriously, actually supports, and it is stronger than it might first appear.

Most discussions about Zenon's programmability future proceed as though the architecture has not yet been chosen. The community debates options. External observers wonder what direction the project will take. The framing assumes an open question.

The elimination process suggests the opposite.

The broad architecture question may already be narrower than it appears.

Account chains own settlement. That was decided when the dual-ledger was designed.

Momentum owns consensus and stays minimal. That was decided when Kaine wrote that a heavy VM at L1 was a deal breaker.

Sentinels exist outside the critical consensus path as a native infrastructure layer. That was decided when the node class was introduced.

WASM was the direction explicitly recommended as early as February 2021.

Execution is external to consensus. That was implied the moment the dual-ledger's separation principle was established.

Shared security was already sketched as the natural validation model for extension chains, before EigenLayer launched.

None of these are provisional positions waiting for community consensus. They are structural properties of the system as it already exists. The elimination process does not select them. It reveals that they were already selected, and that the selection was coherent.

What remains is less an architecture question than a specification and implementation problem.

The fraud proof mechanism needs to be designed and built. The challenge protocol needs to be specified. The incentive model for Sentinel proof construction needs to be worked out. The exact form of Sentinel specialization (generalist nodes or dedicated classes) needs to be decided. These are genuinely hard engineering problems.

But hard engineering problems and open architecture questions are different categories of difficulty.

An open architecture question means the fundamental structure of the system is still negotiable. A hard engineering problem means the structure is settled and the work is figuring out how to build it correctly.

Zenon appears to be closer to the second situation than the first, and may have been for some time. The community has been treating an engineering problem as though it were still an architecture question. That mismatch may be part of why progress has felt slower than the underlying design deserves.

---

## What the Industry Independently Confirmed

The architectural direction identified here has a familiar shape to anyone who has followed modular blockchain research. Execution externalized. DA specialized. Verification minimal. Settlement isolated. Infrastructure layered.

Ethereum arrived at these separations reactively. Rollups were a retrofit. DA was discovered as a problem after rollups were live. Shared security was assembled after the need became apparent. Each correct insight arrived in response to a gap that the previous solution exposed.

Zenon's design did not arrive at these separations reactively. The dual-ledger separated consensus from business logic as a foundational property. Momentum was kept minimal by design. Sentinels were positioned as a native infrastructure layer from the beginning. ZK-rollups were identified as the throughput mechanism for a minimal L1 before Celestia launched. Extension chains were the programmability proposal before restaking existed as a vocabulary.

In March 2023, looking at state-of-the-art consensus research, Kaine observed: *"You can re-read the whitepaper and see that our design choices ~4 years ago are still valid today (on par with state-of-the-art architectures)."*

That is the precise claim. Not that Zenon invented modular architecture. Not that the industry copied Zenon. But that the design choices made years earlier, which looked unconventional at the time, turned out to be on the same trajectory the industry was independently traveling, and that this convergence was visible from inside the architecture before the external frameworks arrived to name it.

The broader industry's convergence on similar separations is not instruction to follow. It is confirmation of a direction that was already set.

---

## The Sequence Is the Architecture

The modular system described here must be built in a specific order. The sequence is not a roadmap preference. It is the security model.

**Deterministic execution first.** Prove that WASM execution on extension chains produces identical results across independent nodes. If execution is not deterministic, proofs are meaningless and fraud detection is impossible.

**Data availability second.** Prove that execution data is being published and is retrievable by independent observers who did not participate in execution. Not assumed available: demonstrated available.

**Fraud detection third.** Build the challenge mechanism. Incorrect state roots must be detectable, challengeable within a defined window, and rejectable. Optimistic settlement becomes possible only when this is live.

**Slashing fourth.** Fraud proofs without consequences are theater. Nodes posting invalid state roots must lose stake. The economic disincentive has to be credible before the system is adversarially robust.

**Base-layer settlement fifth.** Only after the four stages above are working in production (not specced, not in testnet, actually adversarially tested) should real ZNN or ZTS value move through the execution layer.

**Validity proofs last.** When ZK proving for WASM reaches practical cost and latency, replace the optimistic model. The challenge window disappears. Finality becomes immediate. The architecture supports this upgrade cleanly because the layers were already correctly separated.

Each stage justifies the next. The system earns trust rather than declaring it.

---

## Conclusion: Finishing What Was Already Implied

The Zenon community spent years discussing things that looked disconnected from the broader industry: how to keep L1 minimal, why EVM at L1 was a deal breaker, what Sentinels were actually for, how extension chains related to the base layer, why ZK-rollups fit NoM specifically, why WASM was the right direction.

Meanwhile, the broader industry was independently discovering (through the pressure of systems that broke under load) that execution, verification, data availability, and settlement are different problems that benefit from different environments. And that infrastructure itself is a distinct concern, one that keeps generating new networks every time a new need is recognized.

Zenon's response to the infrastructure problem was different. Not to build another network when the need emerged, but to reserve architectural space for infrastructure as a first-class primitive. The Sentinels, with their strange middle-layer positioning that never fit any existing blockchain category, now look less like an unfinished feature and more like the correct answer to a question the industry spent years asking in the wrong way.

The open questions are real. The proof layer is unspecified. The Sentinel architecture is not closed. The fraud proof mechanics, the challenge protocol, the exact form Sentinel specialization should take: these are hard problems that require serious engineering work to get right.

But they are implementation questions. The architecture that frames them was largely settled when Zenon decided that account chains own settlement, Momentum anchors and orders accepted commitments, Pillars provide shared-security validation, and Sentinels occupy the service-infrastructure layer around execution.

That architectural direction was implied years ago, before the industry had finished developing the vocabulary to describe what it meant.

What remains is not discovering an architecture.

It is finishing one that was already implied.
