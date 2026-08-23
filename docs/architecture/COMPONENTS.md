# Components

| Boundary | Responsibility | May depend on | Must not own |
| --- | --- | --- | --- |
| `app/` pages | Route metadata, content/resource loading, composition | `lib/`, templates | Persistent state, raw provider contracts in UI |
| Templates | Page-level presentation | Organisms, molecules, atoms, validated types | External fetches |
| Organisms | Section-level composition and limited interaction | Organisms, molecules, atoms | Page data loading |
| Molecules | Small reusable compositions | Molecules, atoms | Organisms or templates |
| Atoms | Reusable primitives | Atoms and framework primitives | Higher tiers |
| `lib/api/` | HTTP, provider schemas, error mapping | native `fetch`, Zod, pure utilities | UI rendering |
| `lib/content/` | Filesystem reads and content validation | Node filesystem, Zod | Provider calls |
| `lib/utils/` | Pure normalization and serialization helpers | Standard library/types | Environment side effects except explicit configuration helpers |

Sessionize DTOs are boundary models, not trusted domain entities. Components receive only parsed and normalized data.
