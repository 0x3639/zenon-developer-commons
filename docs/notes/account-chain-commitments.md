Account-Chain Commitments & ChangesHash (Draft Notes)

These notes clarify how account-chain transitions are committed inside Momentum blocks, how ChangesHash functions in practice, and why this structure is sufficient for lightweight verification without Merkle inclusion proofs.

This is not a full specification.
It is an architectural description intended for researchers exploring SPV, browser-native execution, and potential cross-chain extensions.

⸻

1. Why This Matters

In Bitcoin, SPV depends on Merkle proofs because each transaction is an independent leaf inside a block.

Zenon does not work this way.

Zenon’s dual-ledger structure means:
	•	user activity forms an account-chain
	•	Momentum blocks finalize references to those chains
	•	global consensus never re-executes account logic
	•	the system commits to state transitions, not transactions

Understanding this difference removes many perceived “roadblocks” around SPV and light verification.

⸻

2. What a Momentum Actually Commits To

A Momentum includes:
	•	the ordered list of account-block headers
	•	the resulting state modifications after applying all included account blocks
	•	a single cryptographic commitment to these changes (ChangesHash)
	•	metadata such as timestamp, producer, version, and optional future Data field

Crucially:

ChangesHash is a commitment to the aggregate effect of all included account-chain transitions.

It does not need to expose:
	•	Merkle roots
	•	per-block inclusion proofs
	•	contract execution details
	•	global state snapshots

The Momentum only needs to prove that:
	1.	The producer was eligible.
	2.	The included account-block headers are valid.
	3.	The resulting state change is correct and reproducible.

This is a much lighter model than Bitcoin-style SPV.

⸻

3. Why No Merkle Tree Is Required

Because Zenon’s execution model is local-first:
	•	each account-chain is internally ordered and self-verifying
	•	a new account-block implicitly validates the previous one
	•	Momentum commits to the frontier state after applying all included blocks

So instead of verifying:

“Was this transaction included inside the block?”

The verifier checks:

“Does this Momentum commit to the correct frontier of this account-chain?”

This is why SPV for Zenon is fundamentally simpler:
	•	proving inclusion of account-chain block N automatically proves inclusion of block N-1, N-2, …
	•	no Merkle branches are required
	•	the Momentum header and account-chain frontier hash become the proof object

⸻

4. How ChangesHash Fits Into This Model

ChangesHash represents the cryptographic digest of:
	•	balance updates
	•	account-chain header updates
	•	confirmation heights
	•	mailbox changes
	•	sequencer queue updates
	•	embedded contract state changes
	•	staking / fusion metadata
	•	token definitions
	•	any other deterministic part of the state machine

It is the global commitment object.

A verifier does not need to recompute these values to trust the chain.
They only need to:
	1.	Verify the Momentum header signature.
	2.	Verify chain continuity.
	3.	Verify the referenced account-chain block.

This is the core of header-first SPV for Zenon.

⸻

5. Account-Chain Frontier Verification (The Lightest Possible Model)

A minimal browser/sentry verifier only needs:
	1.	The Momentum header (signed, weighted, ordered).
	2.	The account-chain frontier header referenced in that Momentum.
	3.	The parent account-block hash.

From this it can check:
	•	the chain of account-blocks is valid
	•	the Momentum references the correct frontier
	•	the Momentum originates from a valid Pillar
	•	cumulative weight is correct
	•	timestamps and eligibility rules match

Nothing else is required.

This is why SPV is viable without Merkle roots.

⸻

6. Why This Enables SPV, zApps, and Cross-Chain Work

The commitment model aligns naturally with:

SPV

Because a verifier only needs header-level consensus + account-chain frontier verification.

zApps

Because application logic is executed locally and only the result is anchored as an account-chain transition.

Cross-chain integrations

Because Momentum blocks can eventually include:
	•	Merkle roots from external chains
	•	succinct proof commitments
	•	state roots
	•	interoperability signals

The reserved Data field is structurally suited for this.

⸻

7. Open Questions

These areas require further exploration:
	•	What minimal subset of ChangesHash is exposed or standardized for light clients?
	•	How should the account-chain frontier be packaged for verifiers?
	•	Should Momentum Data become a commitment extension field?
	•	What batching or proof systems best support browser-native verification?
	•	How to formalize a light-client spec without altering existing consensus?

These will be addressed in future drafts.
