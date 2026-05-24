# Deployment

The site is cloud-agnostic. The runtime contract is the standard Next.js 16 App Router runtime: any host that supports Next.js as documented at <https://nextjs.org/docs/app/getting-started/deploying> can serve it without code changes.

Primary target for the first edition is **AWS Amplify Hosting**. Vercel, OpenNext on raw AWS (Lambda + CloudFront), Netlify, and self-hosted Node.js are all viable alternatives.

## Portable build/start contract

Every deploy target must run the same three steps:

```sh
npm ci            # install with locked versions
npm run build     # produces .next/ (static + server output)
npm run start     # starts the Next.js server, defaults to port 3000
```

For static-only hosts (S3 + CloudFront without a Lambda layer), this site cannot be deployed as fully static because some routes use `generateStaticParams` and dynamic JSON-LD. Use Amplify, Vercel, OpenNext, or self-hosted Node to keep all features available.

## Required environment variables

| Name | Required | Default | Notes |
|---|---|---|---|
| `CURRENT_EDITION` | yes | `2026` | Year served at the bare URL (e.g. `/`, `/speakers`). Past editions are always available under `/editions/{year}`. |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | `http://localhost:3000` | Public origin used for canonical URLs, sitemap, OG image, JSON-LD. |
| `NEXT_PUBLIC_SESSIONIZE_BASE_URL` | no | `https://sessionize.com/api/v2` | Override for offline tests or staging. |

No secrets are read by this app. Eventbrite registration is handled by the public widget script (no API key); Sessionize is consumed via its public API (no auth).

## AWS Amplify Hosting (primary target)

1. **Create the app**: AWS Amplify Console -> Host web app -> Connect GitHub repo -> select branch (e.g. `main`).
2. **Framework detection**: Amplify auto-detects Next.js 16 App Router. The committed `amplify.yml` overrides defaults to also run lint, typecheck, and unit tests as build gates.
3. **Environment variables**: in App settings -> Environment variables, add `CURRENT_EDITION` and `NEXT_PUBLIC_SITE_URL` for each branch. Amplify exposes these to both the build and the runtime.
4. **Build**: Amplify builds with the values from `amplify.yml`. The compute split (static vs SSR/ISR) is read from `.next/required-server-files.json`.
5. **Custom domain**: App settings -> Domain management -> add `awspy.com`. Amplify provisions an ACM certificate via DNS validation. Update DNS once Amplify shows the validation records, then verify HTTPS and `https://www.` redirects.
6. **Preview branches**: enable preview deploys for non-main branches. The deploy URL is what `BASE_URL` should point at when running `e2e/deploy-smoke.spec.ts` against a preview.

### Lighthouse on the preview

```sh
npx lighthouse https://<branch>.<app>.amplifyapp.com --view
```

Target thresholds (per FR-032): Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 on a desktop run.

### Logs and observability

Per FR-038, observability is delegated to the hosting platform. On AWS Amplify Hosting:
- Build logs: Amplify Console -> branch -> Deployments.
- Runtime logs (SSR functions): AWS CloudWatch under `/aws/lambda/amplify-<app-id>-...`.
- Custom monitoring: not added in v1.

## Vercel (alternative)

1. Vercel Dashboard -> Add New -> Project -> import GitHub repo.
2. Framework: Next.js (auto-detected). No build overrides needed; Vercel does not read `amplify.yml`.
3. Environment variables: `CURRENT_EDITION`, `NEXT_PUBLIC_SITE_URL`.
4. Custom domain: Domain Settings -> add `awspy.com`.

## OpenNext on raw AWS (alternative)

If a future iteration wants tighter control over AWS resources (e.g. CloudFront cache rules, KMS for env vars):

1. `npm install --save-dev open-next`
2. `npx open-next build`
3. Deploy `out/` artifacts to S3 (static) + Lambda@Edge / CloudFront Functions (SSR) using SST, AWS CDK, or the OpenNext CDK construct.
4. The `next.config.ts` `images.remotePatterns` allowlist already covers `sessionize.com`, `img.evbuc.com`, `cdn.evbuc.com`.

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
BASE_URL=https://<preview-url> npx playwright test --project=chromium e2e/deploy-smoke.spec.ts
```

This validates that every public route returns 200 and renders its primary heading on the deployed origin.
