# AGENTS.md

> **Note:** This file is for local use only. Do not commit this file to the repository.

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Repository Purpose

This is a **documentation-only research repository** for exploring the technical architecture of Zenon — The Network of Momentum (NoM). There is no source code, build system, or tests. The repository consists entirely of Markdown documentation files.

## Repository Structure

```
docs/
├── architecture/   # Deep dives into NoM internals (momentums, ACIs, node types)
├── research/       # Exploratory analysis and open questions
├── proposals/      # Structured improvement ideas
└── notes/          # Raw thoughts, drafts, and reference materials
```

## Key Concepts to Understand

When working with this documentation:

- **Momentums**: Sequential units containing snapshots of recent account blocks, signed by Pillars (consensus nodes)
- **Account-chain DAG**: Block-lattice structure where each address has its own mini-blockchain, anchored into momentums
- **ACIs (Application Contract Interfaces)**: Deterministic, schema-defined contract interfaces (not a VM) — execution happens off-chain with proofs/commitments submitted on-chain
- **Node hierarchy**: Pillars (consensus) → Sentinels (proof-serving) → Sentries (execution) → Light clients (verification)
- **Browser light client**: Core research focus — trustless browser-native verification using WebRTC/libp2p and compact proof bundles

## Working with Documentation

- All documentation uses Markdown format
- Key entry points:
  - `docs/architecture/architecture-overview.md` — System design overview
  - `docs/research/browser-light-client-overview.md` — Featured research topic
  - `docs/research/open-research-questions.md` — Unanswered technical questions
  - `docs/notes/browser-light-client-architecture.md` — Detailed architecture draft

## Local Testing

This repository uses [HonKit](https://github.com/honkit/honkit) (a GitBook fork) for local preview:

```bash
cd docs
honkit serve
```

This starts a local server at http://localhost:4000 with live reload.

## Contribution Guidelines

- Keep contributions technical, calm, and curiosity-driven
- Add documents under `/docs` in the appropriate subfolder
- This is exploratory research, not official documentation or governance

## Documentation Formatting Standards

All markdown documents must follow consistent formatting:

### Headings
- Use `#` for the document title (H1) — one per document
- Use `##` for major sections (H2)
- Use `###` for subsections (H3)
- Never use plain text for headings — always use markdown `#` syntax

### Lists
- Use `-` prefix for unordered list items
- Never use plain text on separate lines as list items
- Ensure proper spacing (blank line before list)

### Section Separators
- Use `---` (horizontal rule) between major sections for visual clarity

### Example Structure
```markdown
# Document Title

Brief introduction paragraph.

---

## Section One

Content here.

- List item one
- List item two

### Subsection 1.1

More content.

---

## Section Two

Additional content.
```

### GitBook Compatibility
- PDFs cannot be linked directly in SUMMARY.md navigation — create wrapper markdown pages
- All navigation entries in SUMMARY.md must point to .md files
- Subdirectory README.md files must be listed in SUMMARY.md to be rendered

## Git Commit Rules

- Do not include any reference to Codex, AI, or automated generation in commit messages
- Do not add "Co-Authored-By" lines mentioning Codex or Anthropic
- Keep commit messages focused on what changed, not how it was produced
