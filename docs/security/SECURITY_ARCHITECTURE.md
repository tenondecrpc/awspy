# Security architecture

Security controls follow the data path:

1. Zod validates files, environment-derived identifiers, and external payloads.
2. The typed fetch client maps transport, HTTP, JSON, and schema failures without exposing secrets.
3. URL schemas allow only required web navigation schemes.
4. React escapes visible text; JSON-LD uses a dedicated serializer before entering a script element.
5. Browser headers add low-risk defense in depth. CSP and HSTS remain staged until production hosts are validated.
6. npm lock integrity, audit, signatures, Secretlint, Gitleaks, and immutable Action SHAs protect the build path.
7. AWS operations use human-approved access, IAM roles/OIDC, least privilege, and no repository credentials.

Security findings and review conditions live in `docs/status/SECURITY_FINDINGS.md`. Credential rotation is not required because no credential was confirmed during the audit.
