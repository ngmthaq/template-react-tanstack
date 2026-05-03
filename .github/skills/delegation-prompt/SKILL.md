---
name: delegation-prompt
description: Delegation prompt templates for Root Agent handoffs to planner.agent.md, debugger.agent.md, developer.agent.md, tester.agent.md, and reviewer.agent.md. Use when composing feature planning, bug planning, implementation, testing, or review delegations.
---

## Purpose

Shared delegation prompt skill used by the **Root Agent** when routing work to planning, implementation, testing, and review sub-agents.

Use the section that matches the target agent and request type:

- `Feature Planning Prompt` for `planner.agent.md` on `feature` or `refactor`
- `Bug Planning Prompt` for `debugger.agent.md` on `bug`
- `Developer Delegation Prompt` for `developer.agent.md`
- `Tester Delegation Prompt` for `tester.agent.md`
- `Reviewer Delegation Prompt` for `reviewer.agent.md`

---

## Feature Planning Prompt

Use when delegating a feature or refactor request to `planner.agent.md` for implementation planning.

### Template

```
From: Root Agent
To: planner.agent.md
Title: Feature Planning Request — {short title of the feature}
Description: {one sentence describing what this feature/refactor achieves}

Skill references:
- {list all relevant skill files scanned from the skills/ directory that planner should apply}

---

## Original User Prompt

{paste the full original user prompt verbatim}

## Classification

- Type: feature | refactor
- Rationale: {why this was classified as such}

## Codebase Context

- Affected modules / files: {list known files or modules relevant to this feature}
- Architecture notes: {any patterns, conventions, or constraints the planner must respect}
- Dependencies: {external libraries, services, or internal modules involved}

## Requirements

{Expand the user prompt into clear, unambiguous requirements. Use bullet points. Each item must be testable.}

## Constraints

- {Performance, security, backward-compatibility, or scope constraints}

## Open Questions

> **Rule: ALWAYS ask the user. Never assume.**
> If any requirement, constraint, or context field cannot be filled with certainty from the user prompt, list it here and STOP. Do not delegate to planner.agent.md until the user has answered every open question.

**Ask template:**
```

Before I can create the implementation plan, I need clarification:

1. {specific question}
2. {specific question}

Please answer so the plan is accurate.

```

- {List anything unclear — scope, affected files, constraints, expected behaviour, definition of done}
```

### Usage Notes

- Root Agent must fill every section before delegating. Do not send partial prompts.
- **ALWAYS ask the user when any section cannot be filled with confidence** — do not infer, guess, or proceed with placeholders.
- `Skill references` must be populated by scanning the `skills/` directory and selecting all files relevant to the feature domain.
- Planner must respond using `agent-response-template` skill (`Plan Response Template` section).

---

## Bug Planning Prompt

Use when delegating a bug report to `debugger.agent.md` for fix planning.

### Template

```
From: Root Agent
To: debugger.agent.md
Title: Bug Fix Planning Request — {short title of the bug}
Description: {one sentence describing the broken behavior and its impact}

Skill references:
- {list all relevant skill files scanned from the skills/ directory that debugger should apply}

---

## Original User Prompt

{paste the full original user prompt verbatim}

## Classification

- Type: bug
- Rationale: {why this was classified as a bug — unexpected behavior, regression, failure, etc.}

## Observed Behavior

{Describe exactly what is happening. Include error messages, stack traces, or logs if available.}

## Expected Behavior

{Describe what should happen instead.}

## Reproduction Steps

1. {Step one}
2. {Step two}
3. {Add more as needed}

## Environment

- Runtime / platform: {e.g. Node 20, Python 3.12, browser, OS}
- Version / branch: {affected version or branch}
- Affected files (if known): {list known files or modules}

## Constraints

- {Must not break existing behavior in X, must remain backward-compatible, performance budget, etc.}

## Open Questions

> **Rule: ALWAYS ask the user. Never assume.**
> If observed behavior, reproduction steps, environment, or expected behavior cannot be filled with certainty from the user prompt, list them here and STOP. Do not delegate to debugger.agent.md until the user has answered every open question.

**Ask template:**
```

Before I can create the fix plan, I need clarification:

1. {specific question — e.g. "What is the exact error message you're seeing?"}
2. {specific question — e.g. "Which version or branch is affected?"}

Please answer so the debugger can produce an accurate fix plan.

```

- {List anything unclear — reproduction steps, environment, observed vs expected behavior, affected scope}
```

### Usage Notes

- Root Agent must fill every section before delegating. Do not send partial prompts.
- **ALWAYS ask the user when any section cannot be filled with confidence** — do not infer, guess, or fabricate details.
- If reproduction steps are unknown, ask the user — do not state "unknown" and proceed.
- `Skill references` must be populated by scanning the `skills/` directory and selecting all files relevant to the bug domain.
- Debugger must respond using `agent-response-template` skill (`Plan Response Template` section).

---

## Developer Delegation Prompt

Use when assigning implementation tasks derived from an approved plan to `developer.agent.md`.

### Template

```
From: Root Agent
To: developer.agent.md
Title: Implementation Task — {short title matching the plan title}
Description: {one sentence describing what must be implemented in this delegation}

Skill references:
- {list all relevant skill files scanned from the skills/ directory that developer should apply}

---

## Context

- Original request type: feature | refactor | bug fix
- Plan reference: {title of the plan from agent-response-template / Plan Response Template}
- Iteration: {current loop count, e.g. "Iteration 1 of 3"}

## Tasks Assigned

{Extract only the developer tasks from the plan's Task List. Do not include tester tasks.}

| # | Task | Dependencies | Acceptance Criteria |
|---|------|--------------|---------------------|
| 1 | {task description} | {none or task #} | {what done looks like} |
| … | … | … | … |

## Files in Scope

- Create: {list files to create}
- Modify: {list files to modify}
- Delete: {list files to delete, if any}

## Architecture & Conventions

- {Patterns to follow: naming conventions, folder structure, design patterns}
- {Frameworks, libraries, or internal utilities to use}
- {Anything explicitly NOT allowed}

## Constraints

- {Performance, security, backward-compatibility, or scope constraints}
- {Must not break: list critical existing behaviors}

## Reviewer Feedback (if re-delegation)

{If this is a re-delegation triggered by a reviewer block, paste the reviewer's feedback here. Leave empty on first delegation.}

## Expected Output

Return your result using `agent-response-template` skill (`Sub-Agent Result Template` section).
```

### Usage Notes

- Root Agent must scan `skills/` and assign all relevant skill files to `Skill references` before delegating.
- On re-delegation, always include the reviewer feedback section — developer must address each point explicitly.
- `Acceptance Criteria` per task is mandatory — vague tasks produce vague results.
- Developer must respond using `agent-response-template` skill (`Sub-Agent Result Template` section).

---

## Tester Delegation Prompt

Use when assigning testing tasks after developer implementation is complete to `tester.agent.md`.

### Template

```
From: Root Agent
To: tester.agent.md
Title: Testing Task — {short title matching the plan title}
Description: {one sentence describing what must be tested in this delegation}

Skill references:
- {list all relevant skill files scanned from the skills/ directory that tester should apply}

---

## Context

- Original request type: feature | refactor | bug fix
- Plan reference: {title of the plan from agent-response-template / Plan Response Template}
- Iteration: {current loop count, e.g. "Iteration 1 of 3"}

## Implementation Summary

{Brief description of what the developer implemented — what changed and why, so tester understands scope.}

## Files Changed by Developer

- {list all files created or modified by developer.agent.md}

## Tasks Assigned

{Extract only the tester tasks from the plan's Task List.}

| # | Task | Test Type | Acceptance Criteria |
|---|------|-----------|---------------------|
| 1 | {what to test} | unit | integration | e2e | {what passing looks like} |
| … | … | … | … |

## Test Scenarios Required

- Happy path: {describe the expected successful flow}
- Edge cases: {list edge cases to cover}
- Failure cases: {list failure / error scenarios to validate}

## Constraints

- {Test framework or tooling to use}
- {Coverage threshold if applicable}
- {Must not modify production code}

## Reviewer Feedback (if re-delegation)

{If this is a re-delegation triggered by a reviewer block, paste the reviewer's test-related feedback here. Leave empty on first delegation.}

## Expected Output

Return your result using `agent-response-template` skill (`Sub-Agent Result Template` section).
```

### Usage Notes

- Root Agent must scan `skills/` and assign all relevant skill files to `Skill references` before delegating.
- Tester must not modify production code — only test files.
- If developer output is incomplete, tester should flag this in the result rather than testing partial work.
- Tester must respond using `agent-response-template` skill (`Sub-Agent Result Template` section).

---

## Reviewer Delegation Prompt

Use when submitting completed developer and tester output for quality review to `reviewer.agent.md`.

### Template

```
From: Root Agent
To: reviewer.agent.md
Title: Review Request — {short title matching the original task title}
Description: {one sentence describing what was built or fixed and what the reviewer must assess}

Skill references:
- {list all relevant skill files scanned from the skills/ directory that reviewer should apply}

---

## Context

- Original request type: feature | refactor | bug fix
- Review iteration: {e.g. "Review 1 of 2"}
- Plan reference: {title of the plan from agent-response-template / Plan Response Template}

## Original User Requirement

{Paste the original user prompt verbatim. Reviewer must validate against this, not assumptions.}

## Work Completed

### Developer Output

{Summary of what developer.agent.md implemented — reference files and key changes.}

### Tester Output

{Summary of what tester.agent.md produced — reference test files and results.}

## Files Changed

| File | Action | Changed By |
|------|--------|------------|
| {path/to/file} | created | modified | deleted | developer | tester |
| … | … | … |

## Previous Review Feedback (if re-review)

{If this is a second review after a block, summarise what was blocked and what was done to address it. Leave empty on first review.}

## Review Checklist

Reviewer must assess all of the following:

- [ ] Output satisfies the original user requirement
- [ ] Code follows project conventions and skill references
- [ ] No unintended side effects or regressions
- [ ] Tests cover the required scenarios and pass
- [ ] No obvious security, performance, or maintainability issues

## Expected Output

Return your result using `agent-response-template` skill (`Reviewer Response Template` section).
```

### Usage Notes

- Root Agent must scan `skills/` and assign all relevant skill files to `Skill references` — reviewer enforces them.
- On re-review, always include the `Previous Review Feedback` section so reviewer can confirm issues were resolved.
- Reviewer must not modify code — only assess and report.
- Reviewer must respond using `agent-response-template` skill (`Reviewer Response Template` section).
