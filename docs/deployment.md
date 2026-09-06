# Deployment

The application follows the standard Next.js 16 App Router runtime contract,
but hosting support must be verified per provider. A generic claim of Next.js
support is not sufficient for ISR, image optimization, and route behavior.

The conditional target is **AWS Amplify Hosting**. Current AWS documentation
lists Next.js support through version 15, so Next.js 16.3.2 requires the preview
qualification tracked by AWS-002 before production release.

## Production coordinates

| Setting | Value |
|---|---|
| AWS region | `us-east-1` |
| Amplify app ID | `d2dgeqbarexvjr` |
| Production branch | `main` |
| Framework mode | Next.js SSR (`WEB_COMPUTE`) |
| Public domain | `https://awscommunitydayparaguay.com` |
| Amplify fallback domain | `https://main.d2dgeqbarexvjr.amplifyapp.com` |

The fallback domain isolates application failures from custom domain or DNS
failures. If it responds but the public domain does not resolve, investigate
Route 53 and domain registration status before changing application code.

## Portable build/start contract

Every deploy target must provide Node.js 24.15.0 or a newer 24.x patch and run
the same three steps:

```sh
npm ci            # install with locked versions
npm run build     # produces .next/ (static + server output)
npm run start     # starts the Next.js server, defaults to port 3000
```

For static-only hosts such as S3 and CloudFront without a compute adapter, this
site cannot preserve scheduled ISR and Next.js image behavior. Use a qualified
Next.js compute platform to retain current behavior.

## Required environment variables

| Name | Required | Default | Notes |
|---|---|---|---|
| `CURRENT_EDITION` | yes | `2026` | Year served at the bare URL (e.g. `/`, `/speakers`). Past editions are always available under `/editions/{year}`. |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | `http://localhost:3000` | Public origin used for canonical URLs, sitemap, OG image, and JSON-LD. Production value: `https://awscommunitydayparaguay.com`. |
| `NEXT_PUBLIC_SESSIONIZE_BASE_URL` | no | `https://sessionize.com/api/v2` | Override for offline tests or staging. |

No secrets are read by this app. Sessionize is consumed through its public API
without authentication. Eventbrite is the attendee registration provider. The
2026 edition links to its official public event page without loading an
Eventbrite widget or calling its API.

## AWS Amplify Hosting (primary target)

1. **Create the app**: AWS Amplify Console -> Host web app -> Connect GitHub repo -> select branch (e.g. `main`).
2. **Framework qualification**: use a non-production preview branch. The committed `amplify.yml` installs Node.js 24.15.0 and runs the repository verification gate, but repository configuration does not prove service support.
3. **Environment variables**: in App settings -> Environment variables, add `CURRENT_EDITION` and `NEXT_PUBLIC_SITE_URL` for each branch. `scripts/write-amplify-env.ts` writes only these allowlisted public values and the optional Sessionize base URL to `.env.production`; it never copies the full environment.
4. **Build**: Amplify builds with the values from `amplify.yml`. The compute split (static vs SSR/ISR) is read from `.next/required-server-files.json`.
5. **Custom domain**: App settings -> Domain management -> add `awscommunitydayparaguay.com`. Amplify provisions an ACM certificate via DNS validation. Verify both the apex domain and `www`, then confirm the configured redirect.
6. **Preview branches**: enable preview deploys for non-main branches. The deploy URL is what `BASE_URL` should point at when running `e2e/deploy-smoke.spec.ts` against a preview.

Environment variables prefixed with `NEXT_PUBLIC_` are embedded during the
Next.js build. Trigger a new deployment after changing
`NEXT_PUBLIC_SITE_URL`.

### Route 53 registrant email verification

Domain registration contact verification is separate from the hosted zone,
the Amplify domain association, and the ACM certificate. Route 53 can report
the Amplify domain as `AVAILABLE` while the registry has suspended public DNS
with `clientHold`.

Verify the registrant email within 15 days of registering the domain or
changing its contact email. The verification message is sent by
`noreply@domainnameverification.net` or `noreply@registrar.amazon`.

Check the verification state:

```sh
aws route53domains get-contact-reachability-status \
  --domain-name awscommunitydayparaguay.com \
  --region us-east-1 \
  --profile <profile>
```

The healthy value is `DONE`. `PENDING` or `EXPIRED`, combined with
`clientHold`, means the email link still needs to be opened. Resend it with:

```sh
aws route53domains resend-contact-reachability-email \
  --domain-name awscommunitydayparaguay.com \
  --region us-east-1 \
  --profile <profile>
```

Inspect registry status without printing contact information:

```sh
aws route53domains get-domain-detail \
  --domain-name awscommunitydayparaguay.com \
  --region us-east-1 \
  --profile <profile> \
  --query '{StatusList:StatusList,Nameservers:Nameservers,ExpirationDate:ExpirationDate,AutoRenew:AutoRenew}'
```

`clientTransferProhibited` is the normal transfer lock. `clientHold` is the
blocking status that removes the domain from public DNS. Do not recreate the
hosted zone or change otherwise-correct Amplify records to work around a
registrant verification hold.

After verification, confirm public DNS and HTTPS:

```sh
dig +short NS awscommunitydayparaguay.com
dig +short A awscommunitydayparaguay.com
dig +short CNAME www.awscommunitydayparaguay.com
curl -sSIL https://awscommunitydayparaguay.com
curl -sSIL https://www.awscommunitydayparaguay.com
```

### Lighthouse on the preview

The following is a planned external validation command and was not executed in
the local audit environment:

```sh
npx lighthouse https://<branch>.<app>.amplifyapp.com --view
```

Target thresholds (per FR-032): Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 on a desktop run.

### Logs and observability

On AWS Amplify Hosting:
- Build logs: Amplify Console -> branch -> Deployments.
- Runtime logs and metrics: use the Amplify monitoring integration and
  CloudWatch resources visible to the authorized AWS owner; exact external
  names and retention are `NOT VERIFIED`.
- External DNS, TLS, and route monitoring: required by
  `docs/aws/AWS_OPERATIONS.md` and not yet configured.

## Vercel (alternative)

1. Vercel Dashboard -> Add New -> Project -> import GitHub repo.
2. Framework: Next.js (auto-detected). No build overrides needed; Vercel does not read `amplify.yml`.
3. Environment variables: `CURRENT_EDITION`, `NEXT_PUBLIC_SITE_URL`.
4. Custom domain: Domain Settings -> add the intended public domain.

## OpenNext on raw AWS (contingency)

OpenNext is considered only if Amplify qualification fails. It would add a
runtime adapter, one IaC framework, CloudFront, object storage, compute, IAM,
logging, and rollback ownership. Select and validate that stack in a separate
ADR and proof of concept before adding dependencies.

Reference: <https://open-next.js.org/>.

## Self-hosted Node.js (alternative)

```sh
npm ci
npm run build
PORT=3000 NODE_ENV=production npm run start
```

Behind any reverse proxy (nginx, Caddy, ALB) that terminates TLS and forwards `Host`/`X-Forwarded-*` headers correctly. ISR and `revalidateTag` work without further configuration.

## Smoke testing a deployed preview

```sh
BASE_URL=https://<preview-url> npm run e2e -- --project=chromium e2e/deploy-smoke.spec.ts
```

This planned POSIX-shell command validates that every public route returns 200
and renders its primary heading on the deployed origin. It was not executed
against an authorized preview during this local audit.
