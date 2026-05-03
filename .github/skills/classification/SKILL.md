---
name: classification
description: Intent classification logic for the Root Agent. Use when a user prompt arrives to determine whether the request is a feature (or refactor), a chore, or a bug before any delegation occurs. Chores route to the Root Agent's direct-execution fast-path; features and bugs route through the planning pipeline.
---

## Purpose

Used by the **Root Agent** to classify every incoming user prompt before any execution occurs. Classification determines whether the work goes through the planning pipeline (feature/bug) or is executed directly by the Root Agent (chore).

---

## Classification Rules

### Feature

Classify as `feature` when the prompt describes:

- New functionality to be added
- Agent skill additions or modifications that add new capabilities
- An existing behaviour to be refactored or improved
- A performance improvement with no broken behaviour involved
- A non-breaking change that adds value or enhances the user experience
- A change that is explicitly framed as a "feature" by the user

**Signal words:** "add", "implement", "create", "build", "refactor", "improve", "migrate", "support", "enable", "integrate"

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

## Decision Template

```
From: Root Agent
To: Root Agent (self)
Title: Classification — {short title of the user prompt}
Description: {one sentence stating the classification and primary reason}

---

## Input

- User prompt: {paste the full original user prompt verbatim}

## Classification Result

- Type: feature | refactor | chore | bug
- Rationale: {one or two sentences explaining why this classification was chosen}

## Ambiguity Notes

- {List any signals that pointed toward a different classification}
- {List any assumptions made to resolve ambiguity}
- Leave empty if classification was unambiguous.

## Next Step

- [ ] Delegate to planner.agent.md using `delegation-prompt` (feature | refactor, Feature Planning Prompt section)
- [ ] Delegate to debugger.agent.md using `delegation-prompt` (bug, Bug Planning Prompt section)
- [ ] Root Agent executes directly — no delegation (chore — see AGENT_WORKFLOW.md Step 2)
```

---

## Ambiguous Cases

If the prompt contains signals for more than one of `feature`, `chore`, or `bug`, or if any field cannot be filled with confidence:

> **Rule: ALWAYS ask the user. Never assume.**

Stop and ask the user a direct, specific question before proceeding. Do not guess, infer, or proceed with a best-effort classification.

**Ask template:**

```
I need clarification before I can proceed:

1. {specific question — e.g. "Is this describing a broken existing behaviour, or a new capability you want added?"}
2. {additional question if needed}

Please answer so I can route this correctly.
```

Only proceed to delegation once every ambiguity is resolved by the user.

---

## Usage Notes

- Classification is always the **first action** of the Root Agent. No execution or delegation happens before it.
- **ALWAYS ask the user when anything is unclear** — intent, scope, affected area, expected behaviour. There are no acceptable assumptions.
- For `feature` and `bug`, the classification result feeds directly into the delegation prompt (`From`, `Title`, `Classification` fields).
- For `chore`, classification feeds into the scope-confirmation message the Root Agent shows the user before direct execution (no delegation).
- A prompt that cannot be classified without guessing must be treated as blocked until the user clarifies.
