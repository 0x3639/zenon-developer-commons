Bitcoin Interoperability Research

This folder contains research documents exploring how Zenon composes with Bitcoin at the verification layer, not at the execution or scripting layer.

The focus is verification, lineage, and trust composition, rather than generalized smart-contract emulation or asset wrapping.

⸻

Scope

The documents in this folder study how Zenon can:

	•	Verify Bitcoin facts (events, commitments, state) without re-execution
	•	Compose Bitcoin SPV, Schnorr signatures, and Taproot commitments into higher-level verification primitives
	•	Enable trust-minimized bridges, oracles, and escrow logic without relying on external oracle networks
	•	Preserve browser- and edge-verifiable guarantees under bounded resources

This work is verification-centric, not VM-centric.

⸻

Relationship to the Genesis Series

This research assumes the results established in the Zenon Genesis Series:

	•	Genesis-Anchored Lineage Verification
	•	Bitcoin-anchored initial state and time-ordering
	•	Deterministic trust roots independent of Zenon operator intent

Those results are not restated here.

Bitcoin Interop research begins after genesis trust has been established, and explores what additional verification guarantees become possible once that anchor exists.

⸻

What This Is Not

This folder does not attempt to:

	•	Recreate Ethereum-style smart contracts on Bitcoin
	•	Replace existing oracle networks
	•	Compete on raw execution throughput
	•	Emulate Bitcoin Script or covenant proposals

Instead, it asks a narrower question:

What can be proven, by whom, and at what cost — once Bitcoin is treated as a trust anchor rather than an execution environment?

⸻

Research Themes

Current and future documents in this folder examine:

	•	Bitcoin SPV as a composable verification primitive
	•	Schnorr-based aggregation and proof compression
	•	Taproot commitments as cross-chain signaling mechanisms
	•	Trustless oracle patterns derived from verifiable events
	•	Escrow and bridge constructions based on proof-of-fact, not trusted relayers
	•	Comparison to Ethereum rollups, Babylon, Chainlink, and traditional oracle models

⸻

Intended Audience

This research is written for:

	•	Protocol designers
	•	Cryptography and verification researchers
	•	Developers interested in light-client and edge-verification models
	•	Readers familiar with Bitcoin SPV, BFT systems, and state commitment schemes

It is not intended as end-user documentation.

⸻

Reading Order

Readers unfamiliar with the underlying trust model should begin with the Genesis Series before engaging with this folder.

This folder should be read as a second layer in the overall research arc:

Genesis → Verification → Edge / Light Clients

⸻

Status

These documents are research artifacts.
They are exploratory, falsifiable, and intentionally narrow in scope.

No claims of production readiness or completeness are made.
