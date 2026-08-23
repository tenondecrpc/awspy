# Security standards

- Never commit, print, or log credentials, tokens, private keys, connection strings, session data, or private customer data.
- Validate external payloads, URLs, identifiers, configuration, and request bodies at trust boundaries.
- Allow only explicitly required URL schemes and hosts. Keep external navigation separate from image-source policy.
- Escape structured data before embedding it in HTML script elements.
- Use bounded network operations, TLS, typed errors, and sanitized operational logging.
- Do not confuse input validation with authorization. This frontend currently has no authentication boundary.
- Review dependencies, workflows, generated artifacts, and examples for supply-chain and secret exposure.
- Scope every suppression, document its rationale and review condition, and associate it with a tracked work item.
- Do not rotate credentials or mutate AWS/GitHub security configuration without explicit authorization.
