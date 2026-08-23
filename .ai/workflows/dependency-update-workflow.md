# Dependency update workflow

1. Verify current locked, compatible, vulnerable, license, and maintenance state.
2. Separate removals, patches, minors, and majors by risk.
3. Update one coherent group and keep package/browser/runtime versions aligned.
4. Run a clean install, audit, dependency tree, repository verification, and relevant E2E tests.
5. Record unresolved legal or maintenance facts as `NOT VERIFIED`.
6. Keep the lockfile and rollback commit reviewable.
