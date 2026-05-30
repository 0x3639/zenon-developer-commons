---
type: context-pack-template-guide
purpose: how to author a new topic context pack
status: active
---

# Topic Pack Template

This folder is the reusable pattern for building a new context pack. Copy it, rename,
and fill it in.

---

## Steps

1. **Copy the folder.** `cp -r context/TEMPLATE context/<topic>` (use a short,
   lowercase, hyphenated topic name, e.g. `pillars`, `light-clients`).
2. **Gather raw material.** Search the repo for the topic before writing:
   `grep -rli "<topic>" --include="*.md" . | grep -v _book`. The `training/` directory
   and the Zenon primary papers (whitepaper, lightpaper, greenpaper) are the richest
   veins.
3. **Separate fact from inference as you read.** For each claim, decide its tag before
   you write it down: `[DOC]`, `[INF]`, or `[OPEN]` (see `../README.md`).
4. **Write the content files** from `_topic-template.md`. Keep files topically
   coherent and self-contained so each retrieves cleanly on its own. Fewer, larger
   files beat many tiny fragments.
5. **Cite every `[DOC]` claim** in `sources.md` with the file and, where possible, a
   line or section reference.
6. **Surface conflicts, don't resolve them.** If two primary sources disagree, tag each
   account `[DOC]` with its source and add a "Conflicting accounts" callout.

---

## What every pack must contain

- A pack `README.md` — a map of the pack plus a tight, honest answer to the lead
  question ("what is X / what is the purpose of X").
- One or more numbered content files (`01-...md`, `02-...md`).
- A `sources.md` — the provenance map backing every `[DOC]` tag.

---

## Authoring rules

- Lead with the honest answer, even when the honest answer is "the sources disagree" or
  "this is under-specified."
- Prefer primary Zenon papers for `[DOC]`; use repo research notes for `[INF]`.
- Do not import claims from outside this repository. If a fact is widely believed but
  not present in the corpus, tag it `[OPEN]` and say so.
- Follow the repo formatting standards in `CLAUDE.md` (markdown headings, `-` lists,
  `---` between major sections).
