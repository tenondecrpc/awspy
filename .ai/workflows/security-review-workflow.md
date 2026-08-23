# Security review workflow

1. Identify assets, actors, entrypoints, trust boundaries, and failure modes.
2. Review validation, encoding, network, secrets, logging, supply chain, and deployment controls.
3. Record evidence and severity without exposing sensitive values.
4. Fix Critical and High findings when safe and testable; track the rest.
5. Add negative tests and rerun security and quality gates.
6. Record any external rotation or infrastructure action as a blocker.
