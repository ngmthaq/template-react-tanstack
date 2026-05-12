---
name: agent-response-template
description: Response templates for the planner, debugger, developer, tester, and reviewer role skills. Use when returning a plan, a sub-agent work result, or a reviewer decision back to the Root Agent.
user-invocable: false
---

## Purpose

Shared response template skill used by sub-agents when sending structured output back to the **Root Agent**.

Use the section that matches the response type:

- `Plan Response Template` for the [planner](../planner/SKILL.md) and [debugger](../debugger/SKILL.md) roles
- `Sub-Agent Result Template` for the [developer](../developer/SKILL.md) and [tester](../tester/SKILL.md) roles
- `Reviewer Response Template` for the [reviewer](../reviewer/SKILL.md) role

---

## Plan Response Template

Use when a sub-agent loaded with the [planner](../planner/SKILL.md) or [debugger](../debugger/SKILL.md) role is returning a structured implementation or fix plan.
Load the template from this reference: [plan-response-template](./references/plan-response-template.md).

---

## Sub-Agent Result Template

Use when a sub-agent loaded with the [developer](../developer/SKILL.md) or [tester](../tester/SKILL.md) role is returning work results after execution.
Load the template from this reference: [sub-agent-result-template](./references/sub-agent-result-template.md).

---

## Reviewer Response Template

Use when a sub-agent loaded with the [reviewer](../reviewer/SKILL.md) role is returning a final review decision.
Load the template from this reference: [reviewer-response-template](./references/reviewer-response-template.md).
