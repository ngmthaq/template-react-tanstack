---
name: agent-response-template
description: Response templates for planner.agent.md, debugger.agent.md, developer.agent.md, tester.agent.md, and reviewer.agent.md. Use when returning a plan, a sub-agent work result, or a reviewer decision back to Root Agent.
---

## Purpose

Shared response template skill used by sub-agents when sending structured output back to the **Root Agent**.

Use the section that matches the response type:

- `Plan Response Template` for `planner.agent.md` and `debugger.agent.md`
- `Sub-Agent Result Template` for `developer.agent.md` and `tester.agent.md`
- `Reviewer Response Template` for `reviewer.agent.md`

---

## Plan Response Template

Use when `planner.agent.md` or `debugger.agent.md` is returning a structured implementation or fix plan.

### Template

```
From: planner.agent.md | debugger.agent.md
To: Root Agent
Title: Plan Response — {short title matching the original request title}
Description: {one sentence summarising the proposed approach}

---

## Approach Summary

{2–4 sentences explaining the overall implementation or fix strategy. Why this approach was chosen.}

## Task List

{Ordered list of atomic tasks. Each task must map to a specific sub-agent.}

| # | Task | Assigned Agent | Dependencies |
|---|------|----------------|--------------|
| 1 | {task description} | developer.agent.md | none |
| 2 | {task description} | tester.agent.md | task 1 |
| … | … | … | … |

## Files in Scope

- {List all files expected to be created, modified, or deleted}

## Sub-Agents Required

- [ ] developer.agent.md — {reason}
- [ ] tester.agent.md — {reason}

## Risks & Assumptions

- {List any assumptions made during planning}
- {List any risks the root agent should be aware of}

## Open Questions / Blockers

> **Rule: ALWAYS surface unclear items to the Root Agent. Never assume.**
> If any task, requirement, or design decision cannot be resolved during planning, list it explicitly. The Root Agent will ask the user before execution begins.

- {List unresolved questions that require user clarification before execution}
- {List any blockers that prevent a specific task from being planned accurately}
- Leave empty if none.

## Status

- [ ] Ready to execute
- [ ] Blocked — requires user input on: {describe each blocker clearly}
```

### Usage Notes

- Every task in the Task List must have a clear owner (developer or tester).
- **ALWAYS set Status to `Blocked` and list every open question** when anything is unclear — do not plan around gaps or make assumptions.
- If Status is `Blocked`, the Root Agent must ask the user before proceeding to Step 4. Execution must not begin with unresolved blockers.
- Root Agent uses this response to populate delegation prompts for `developer.agent.md` and `tester.agent.md`.

---

## Sub-Agent Result Template

Use when `developer.agent.md` or `tester.agent.md` is returning work results after execution.

### Template

```
From: developer.agent.md | tester.agent.md
To: Root Agent
Title: Result — {short title matching the original delegation title}
Description: {one sentence summarising what was completed or why it is incomplete}

---

## Status

- [ ] complete
- [ ] incomplete — reason: {brief reason}

## Work Summary

{2–4 sentences describing what was done. Be specific — reference function names, file paths, test names.}

## Files Changed

| File | Action | Notes |
|------|--------|-------|
| {path/to/file} | created | modified | deleted | {brief note on what changed} |
| … | … | … |

## Tasks Completed

| # | Task | Outcome |
|---|------|---------|
| 1 | {task description} | done | skipped | blocked |
| … | … | … |

## Test Results (tester.agent.md only)

| Test | Type | Result |
|------|------|--------|
| {test name} | unit | integration | e2e | pass | fail | skipped |
| … | … | … |

## Blockers / Missing Requirements

{List anything that prevented full completion. Be precise — vague blockers cause unnecessary re-planning loops.}

- Leave empty if status is complete.

## Notes for Root Agent

{Optional: any observations, risks, or follow-up recommendations the root agent should know about.}
```

### Usage Notes

- Status must be set explicitly — `complete` or `incomplete`. No ambiguous states.
- If `incomplete`, the `Blockers` section is mandatory. Root Agent uses this to build the re-planning context.
- `Files Changed` table must be complete and accurate — Reviewer and Root Agent rely on it.
- Do not mark `complete` if any assigned task was skipped without explicit justification.

---

## Reviewer Response Template

Use when `reviewer.agent.md` is returning a final review decision.

### Template

```
From: reviewer.agent.md
To: Root Agent
Title: Review Response — {short title matching the review request title}
Description: {one sentence stating the decision and the primary reason}

---

## Decision

- [ ] accepted — output meets all requirements and quality standards
- [ ] blocked — issues must be resolved before acceptance

## Summary

{2–4 sentences explaining the overall quality of the output and the basis for the decision.}

## Checklist Results

| Item | Result | Notes |
|------|--------|-------|
| Satisfies original user requirement | pass | fail | partial | {notes} |
| Follows project conventions and skill references | pass | fail | partial | {notes} |
| No unintended side effects or regressions | pass | fail | partial | {notes} |
| Tests cover required scenarios and pass | pass | fail | partial | {notes} |
| No security, performance, or maintainability issues | pass | fail | partial | {notes} |

## Issues Found (if blocked)

{List each issue clearly. Each issue must include enough detail for the responsible sub-agent to act on it without further clarification.}

| # | Severity | File | Description | Assigned To |
|---|----------|------|-------------|-------------|
| 1 | critical | high | medium | low | {path/to/file} | {clear description of the issue} | developer.agent.md | tester.agent.md |
| … | … | … | … | … |

- Leave empty if decision is `accepted`.

## Recommendations (non-blocking)

{Optional: suggestions for improvement that are not blockers but worth noting for future iterations.}

- Leave empty if none.
```

### Usage Notes

- Decision must be binary: `accepted` or `blocked`. No partial acceptance.
- Every issue in the Issues table must have an assigned agent — Root Agent uses this to route re-delegation.
- `critical` or `high` severity issues always result in `blocked`. `medium` or `low` may be accepted at reviewer discretion.
- Reviewer must not silently pass work that partially meets requirements — use `partial` in checklist and block if needed.
