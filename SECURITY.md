# Security policy

## Supported code

Security fixes target the current `main` branch. This public frontend has no login, database, or private application API; deployment and DNS controls remain external AWS concerns.

## Reporting a vulnerability

Do not open a public issue containing exploit details, credentials, tokens, private keys, customer data, or sensitive infrastructure information. Use GitHub private vulnerability reporting for `tenondecrpc/awspy` when available, or contact the repository owner through an established private channel.

Include the affected route/file, impact, reproduction with redacted data, and a suggested remediation. Do not test against production in a way that affects availability or other users.

## Secret response

If a credential is suspected, do not paste its value into an issue or log. Record only its category and approximate location. The authorized owner must revoke or rotate it outside this repository and then audit relevant access logs.

Current findings and remediation status are tracked in `docs/status/SECURITY_FINDINGS.md`.
