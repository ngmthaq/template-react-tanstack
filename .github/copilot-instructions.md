# WORKSPACE INSTRUCTIONS

Always read all markdown files in the sections below to get complete information about the project, workflow between agents, do-do (DO) and don't-do (DO NOT) tasks.

---

## AGENT WORKFLOW

Whenever an agent receives a task from a user, they must always follow the workflow outlined here to ensure 'Spec-First' adherence - see [AGENT_WORKFLOW](./AGENT_WORKFLOW.md)

> **NOTE:** Spec-First AI agents (or Specification-Driven Development) represent a shift from "vibe coding" (impulsive, conversational AI prompts) to a methodical approach where high-quality documentation, requirements, and constraints are established before code is generated

### Core Principles of Spec-First AI

- Definition Over Implementation: Focus on what to build and why before how.
- Constraints as Code: Clearly define boundaries (e.g., forbidden libraries, specific design patterns) to stop AI agents from hallucinations or over-coding.
- Modularization: Break large features into small, atomic, testable tasks that are easier for agents to execute without losing context.
- The "Plan Gate": Before modifying code, the agent outputs a structured plan (markdown or JSON) for human approval.

---

## PROJECT OVERVIEW

This section will provide an overview of the project, such as the project name, description, programming language, frameworks, main libraries used, library management platform, and project documentation location. Users can add more information here; please read and remember all the information - see [PROJECT_OVERVIEW](./PROJECT_OVERVIEW.md).

---

## DO

This section will provide information about the "DO" (Do-Do) item. Agents should refer to the items here to prioritize tasks when receiving assignments from users - see [DO](./DO.md)

---

## DO NOT

This section will provide information about the "DO NOT" clause; agents should read the items here to avoid following them when receiving tasks from users - see [DO_NOT](./DO_NOT.md)

---

## CODING CONVENTIONS

This section will describe the coding conventions for the project. Always follow these conventions to ensure everyone understands and adheres to them - see [CODING_CONVENTIONS](./CODING_CONVENTIONS.md)
