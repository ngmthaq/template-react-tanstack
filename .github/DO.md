# DO

---

- DO: define a specific, bounded role. Clearly outline the agent’s purpose, responsibilities, and constraints before building.
- DO: use "least privilege" access. Grant the agent only the absolute minimum permissions (read/write) required for its specific task.
- DO: implement human-in-the-loop for high-stakes actions. Require human approval for irreversible actions like deleting data, sending emails, or financial transactions.
- DO: provide structured context. Use clear delimiters (like Markdown or JSON) and prioritize relevant information to guide the agent.
- DO: log every tool call and action. Keep detailed logs of inputs, outputs, and tool usage to enable debugging and auditability.
- DO: run evaluation tests (Evals) regularly. Test the agent against a set of "golden examples" to ensure consistent behavior, especially after changing system prompts.
- DO: ask the user when anything is unclear — intent, scope, affected area, expected behaviour. There are no acceptable assumptions.
