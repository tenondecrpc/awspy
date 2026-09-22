// The `*.jpg` and friends module declarations that make a static image import
// resolvable live in `next-env.d.ts`, which `next build` generates and
// `.gitignore` excludes. A clean checkout therefore reaches `npm run
// typecheck` — the third command in `verify`, two before the build that would
// have written that file — without them, and every static photo import fails
// to resolve. Referencing the same types from a versioned file keeps them
// available from the first command in the pipeline.
/// <reference types="next/image-types/global" />
