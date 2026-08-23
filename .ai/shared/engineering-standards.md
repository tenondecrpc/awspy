# Engineering standards

- Write repository artifacts in English and attendee-facing UI copy in Spanish.
- Use ASCII punctuation in code and technical prose.
- Prefer focused, behavior-preserving changes. Record speculative behavior in `docs/status/LOGIC_IMPROVEMENTS.md`.
- Preserve React Server Components unless interactivity requires a Client Component.
- Keep page-level data fetching out of atoms, molecules, and organisms.
- Use explicit image dimensions and `sizes` with `next/image`; use `next/font` for fonts.
- Read the relevant guide under `node_modules/next/dist/docs/` before changing Next.js APIs or conventions. The installed documentation is the version authority.
- Update feature specs when implementation changes their assumptions.
- Avoid premature abstraction, broad rewrites, unsafe mechanical moves, and unrelated cleanup.
- Use `docs/status/WORK_ITEMS.md` for scoped follow-up work and stable identifiers.
