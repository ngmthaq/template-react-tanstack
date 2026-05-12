---
name: classification
description: Intent classification logic for the Root Agent. Use when a user prompt arrives to determine whether the request is a feature (or refactor), a chore, or a bug before any delegation occurs. Chores route to the Root Agent's direct-execution fast-path; features and bugs route through the planning pipeline.
user-invocable: false
---

## Purpose

Used by the **Root Agent** to classify every incoming user prompt before any execution occurs. Classification determines whether the work goes through the planning pipeline (feature/bug) or is executed directly by the Root Agent (chore).

---

## Classification Rules

### Chore

Classify as `chore` when the prompt describes a small, low-risk operation that does **not** touch business logic:

- Dependency update or version bump
- Config change (e.g. `package.json`, `tsconfig`, lint config)
- Tooling setup (formatter, linter, hook installation)
- Lint-driven cleanup (formatting, unused imports, naming-only changes)
- Documentation-only edits in plain prose
- Give feedback on something without asking for a change to be made
- A change that is explicitly framed as a "chore" by the user

**Signal words:** "bump", "upgrade dependency", "format", "lint", "rename file", "update config", "install", "set up", "tweak", "cleanup"

> If a "chore" turns out to touch business logic mid-execution, the Root Agent must stop and re-classify as `feature` or `bug`.

### Feature

Classify as `feature` when the prompt describes:

- New functionality to be added
- Agent skill additions or modifications that add new capabilities
- An existing behaviour to be refactored or improved
- A performance improvement with no broken behaviour involved
- A non-breaking change that adds value or enhances the user experience
- A change that is explicitly framed as a "feature" by the user

**Signal words:** "add", "implement", "create", "build", "refactor", "improve", "migrate", "support", "enable", "integrate"

### Bug

Classify as `bug` when the prompt describes:

- Something that was working and is now broken
- Unexpected or incorrect behaviour
- A crash, error, or exception
- A regression introduced by a recent change
- Output that does not match the specification
- A change that is explicitly framed as a "bug" by the user

**Signal words:** "broken", "not working", "fails", "error", "crash", "wrong", "incorrect", "regression", "unexpected", "should be", "used to work"

---

## Ambiguous Cases

**Rule: ALWAYS ask the user. Never assume.**

If the prompt contains signals for more than one of `feature`, `chore`, or `bug`, or if any field cannot be filled with confidence. Stop and ask the user a direct, specific question before proceeding. Do not guess, infer, or proceed with a best-effort classification. Only proceed to delegation once every ambiguity is resolved by the user.

---

## Usage Notes

- Classification is always the **first action** of the Root Agent. No execution or delegation happens before it.
- **ALWAYS ask the user when anything is unclear** — intent, scope, affected area, expected behaviour. There are no acceptable assumptions.
- For `chore`, classification feeds into the scope-confirmation message the Root Agent shows the user before direct execution (no delegation).
- For `feature`, spawn a sub-agent loaded with the [planner](../planner/SKILL.md) role using [delegation-prompt](../delegation-prompt/) (Feature Planning Prompt section)
- For `bug`, spawn a sub-agent loaded with the [debugger](../debugger/SKILL.md) role using [delegation-prompt](../delegation-prompt/) (Bug Planning Prompt section)
- A prompt that cannot be classified without guessing must be treated as blocked until the user clarifies.
