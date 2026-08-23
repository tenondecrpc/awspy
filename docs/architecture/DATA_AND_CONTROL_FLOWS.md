# Data and control flows

## Page generation

```mermaid
sequenceDiagram
    participant N as Next.js route
    participant L as Local content
    participant R as Sessionize adapter
    participant H as Typed fetch
    participant S as Sessionize
    N->>L: Read edition files
    L-->>N: Zod-parsed content
    N->>R: Request public data with event ID
    R->>H: Fetch with cache, timeout, and schema
    H->>S: HTTPS GET
    alt valid response
        S-->>H: JSON
        H-->>R: Parsed DTOs
    else transport, status, JSON, or schema failure
        H-->>R: Explicit fallback for tolerant reads
    end
    R-->>N: Normalized data or empty collection
    N-->>N: Compose server-rendered page and safe metadata
```

## Trust boundaries and failure paths

- Repository content crosses a filesystem-to-schema boundary.
- Sessionize crosses an Internet-to-schema boundary and is always untrusted.
- Environment variables cross a process-to-configuration boundary.
- JSON-LD crosses a data-to-HTML execution boundary and requires safe serialization.
- External registration/CFP/sponsor links cross a browser navigation boundary.

Sessionize failures intentionally degrade to explicit empty states for the current read path. No automatic retry is added without quota and latency evidence. Static local content is independent of external availability.
