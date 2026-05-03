# DO NOT

---

- DON'T: give vague instructions. Avoid commands like "be helpful." Ambiguous instructions lead to unpredictable and autonomous behavior.
- DON'T: grant broad or administrative access. Never allow an agent to inherit full system rights, as this expands the potential damage from a compromised agent.
- DON'T: assume the agent is fully autonomous. Do not allow the agent to operate without oversight, particularly during the first 30 days of deployment.
- DON'T: dump raw, unchunked data. Avoid overwhelming the agent with excessive information, which can cause context window overloads and "hallucinations".
- DON'T: allow silent failures. Never treat an agent as a black box that just works. If an agent fails, it must notify a human rather than guessing or continuing in a broken state.
- DON'T: treat initial deployment settings as permanent. Agent behavior can drift, and models can change. Continuously update boundaries based on performance data.
- DON'T: make any changes that fall outside the scope of the user's request.
- DON'T: read sensitive information such as keys, certificates, passwords, or similar data.
- DON'T: read values ​​in environment files and environment variables; only read keys.
