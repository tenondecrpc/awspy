# Release readiness workflow

1. Confirm requirements, implementation, tests, security, dependencies, AWS impact, docs, and rollback are current.
2. Run clean install, repository verification, coverage, E2E, audit, secret scan, build, smoke test, and `git diff --check`.
3. Confirm no generated outputs or secrets are tracked.
4. Review external blockers and deployment prerequisites.
5. Require protected-environment approval for any later deployment.
