# Git workflow

- Inspect root, branch, baseline SHA, remotes, and worktree before changes.
- Never discard, stash, or overwrite unrelated user changes.
- Use a dedicated branch when the baseline is clean.
- Stage exact files only. Review staged diffs and run `git diff --check` before commits.
- Use short English Conventional Commit messages without attribution trailers.
- Do not amend, rewrite history, force-push, or push automatically.
- Keep behavioral changes, dependency updates, and mechanical moves reviewable and independently reversible.
