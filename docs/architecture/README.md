# Architecture Documentation

This folder contains structured documents describing the technical architecture of Zenon — The Network of Momentum (NoM).

Topics that will live here include:

- High-level architecture overview
- Node types (Pillars, Sentries, Delegators, Light Clients)
- Momentum and account-based models
- Deterministic contract interfaces (ACIs)
- Plasma, QSR, and Fusion mechanics
- Proof generation and proof serving
- Networking layers and transport considerations

This section aims to make Zenon’s architecture easier for developers to explore and understand.

## High-Level System Flow

The diagram below shows how a browser-based light client interacts with
Zenon’s network roles, and how verification is separated from execution.

flowchart LR
  subgraph TX["Transaction path"]
    direction LR
    A[User Wallet<br/>in Browser] -->|sign tx| SE[Sentry]
    SE -->|relay| SN[Sentinel]
    SN -->|admission| P[Pillars]
    P -->|finalize| M[Momentum Header]
  end

  subgraph V["Verification path"]
    direction LR
    M -->|header sync| LC[Light Client]
    LC -->|request proof| PS[Proof/Bundle Server]
    PS -->|proof| LC
    LC -->|verify vs root in header| M
  end
