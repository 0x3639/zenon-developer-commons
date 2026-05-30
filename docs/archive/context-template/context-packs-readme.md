---
type: context-pack-index
purpose: AI context / RAG material for Zenon topics
status: active
---

# Context Packs

This directory holds **topic-scoped knowledge packs** written to be fed into another
AI — as context-window injection or through a retrieval (RAG) system. Each pack is
self-contained markdown, chunked for clean retrieval, and every substantive claim is
tagged with its provenance so a consuming model does not present inference or
speculation as protocol fact.

This is not official Zenon documentation. It is a curated, provenance-tagged
distillation of material that already lives in this repository.

---

## How to use a pack

- Point your retrieval system at a topic folder (e.g. `context/sentinels/`), or paste
  the files into a model's context window.
- Each file opens with YAML frontmatter (`topic`, `summary`, `status`, `sources`) to
  aid chunking and ranking.
- Always carry the **provenance tags** through to the consuming model. They are the
  reason this pack is safe to train on.

---

## Provenance tagging convention

Every substantive claim carries one inline tag:

- `[DOC]` — **Documented.** Grounded in a Zenon primary source (whitepaper, lightpaper,
  greenpaper, etc.). The backing source is listed in that pack's `sources.md`.
- `[INF]` — **Inferred.** An architectural inference drawn from this repository's
  research notes. Reasonable, but not stated by a primary source.
- `[OPEN]` — **Open.** An unresolved question or a fact that is not established in the
  available corpus.

A critical subtlety: **`[DOC]` claims can still conflict with each other** when
different primary sources disagree. When that happens the pack tags each account
`[DOC]` *with its specific source* and adds an explicit "Conflicting accounts" callout
rather than silently picking a winner. Never collapse a genuine disagreement into a
single clean narrative.

---

## Layout

```
context/
├── README.md          # this file — convention + how to consume
├── TEMPLATE/          # copy this to start a new topic pack
│   ├── README.md
│   └── _topic-template.md
└── sentinels/         # first topic pack
    ├── README.md
    ├── 01-purpose-and-architecture.md
    ├── 02-economics-and-open-questions.md
    └── sources.md
```

---

## Adding a new topic

Copy `TEMPLATE/` to `context/<topic>/`, then fill it in following the same tagging
discipline. See `TEMPLATE/README.md` for the step-by-step.

Good candidates that already have raw material in this repo: Pillars, Sentries,
light clients / browser verification, momentums, account-chain DAG, ACIs, plasma.
