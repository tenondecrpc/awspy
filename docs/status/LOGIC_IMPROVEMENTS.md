# Logic improvements

These proposals are not authorization to change attendee behavior.

## LOGIC-003 - Reconcile status and configured CTA URLs

- Classification: Behavioral product decision
- Current behavior: Registration and CFP state can say closed or unavailable while a URL remains configured, producing contradictory presentation.
- Proposed behavior: Derive one effective state from status and URL.
- Evidence: Content schema validates each field independently.
- Expected benefit: Consistent calls to action.
- Compatibility risk: Medium; business rules and Spanish copy have multiple plausible interpretations.
- Migration impact: Edition content and E2E expectations may change.
- Tests required: Full status/URL matrix.
- Affected public contracts: Registration and CFP attendee flows.
- Priority: P1
- Dependencies: Product owner decision.
- Recommendation: Later.

## LOGIC-006 - Preserve dynamic speaker routes after generation-time outage

- Classification: Likely defect requiring integration proof
- Current behavior: Archived detail routes use `dynamicParams = false`; an empty build-time Sessionize result can permanently omit otherwise valid paths from that deployment.
- Proposed behavior: Permit on-demand generation or retain a committed route manifest.
- Evidence: `generateStaticParams` depends on tolerant external data.
- Expected benefit: Recovery after transient provider failure.
- Compatibility risk: Medium; changes runtime request behavior and hosting requirements.
- Migration impact: Amplify ISR validation is required.
- Tests required: Build with empty data, then runtime request with restored fixture.
- Affected public contracts: Archived speaker URLs.
- Priority: P0
- Dependencies: AWS-002 and a deterministic server test harness.
- Recommendation: Later, before production release.

## LOGIC-007 - Stabilize countdown hydration time

- Classification: Likely defect requiring reproduction
- Current behavior: Client and server can calculate countdown boundaries from different `Date.now()` values.
- Proposed behavior: Provide a stable initial instant and update only after hydration.
- Evidence: Time is read during render.
- Expected benefit: Remove intermittent hydration mismatch at second boundaries.
- Compatibility risk: Low.
- Migration impact: None expected.
- Tests required: Server/client boundary reproduction with a controlled clock.
- Affected public contracts: Countdown display timing.
- Priority: P2
- Dependencies: Reproduction.
- Recommendation: Later.

## LOGIC-009 - Resolve plenary duplication semantics

- Classification: Behavioral product decision
- Current behavior: Provider plenary rows may be repeated across rooms depending on Sessionize payload semantics.
- Proposed behavior: Normalize one plenary event across the grid.
- Evidence: Current fixtures do not prove provider behavior.
- Expected benefit: Clearer schedule.
- Compatibility risk: Medium.
- Migration impact: Schedule rendering contract.
- Tests required: Verified multi-room plenary fixture.
- Affected public contracts: Schedule presentation.
- Priority: P2
- Dependencies: Provider evidence.
- Recommendation: Later.

## LOGIC-010 - Define stable speaker slug history

- Classification: Behavioral product decision
- Current behavior: Name-derived slugs can change when names or collision sets change.
- Proposed behavior: Persist explicit edition-scoped slugs or redirects.
- Evidence: Slugs are recomputed from current provider data.
- Expected benefit: Stable public links.
- Compatibility risk: High without redirect ownership.
- Migration impact: Sitemap and external links.
- Tests required: Rename and collision migration cases.
- Affected public contracts: Speaker URLs.
- Priority: P2
- Dependencies: Content ownership decision.
- Recommendation: Later.

## LOGIC-011 - Automate event lifecycle state

- Classification: Behavioral product decision
- Current behavior: Status is version-controlled rather than derived from dates.
- Proposed behavior: Optionally derive lifecycle state with an explicit override.
- Evidence: Manual status can drift from dates.
- Expected benefit: Reduced stale copy.
- Compatibility risk: High around timezone and business cutoffs.
- Migration impact: Edition content schema and attendee messaging.
- Tests required: Asuncion timezone and boundary matrix.
- Affected public contracts: Registration, schedule, and home copy.
- Priority: P3
- Dependencies: Product owner decision.
- Recommendation: Later.

## LOGIC-012 - Remove expected 404 framework error noise

- Classification: Likely defect requiring framework reproduction
- Current behavior: Production E2E passes for unknown archived editions, but Next.js logs an internal `NoFallbackError` while returning the expected 404.
- Proposed behavior: Preserve the 404 contract without emitting an error-level framework log.
- Evidence: Both production browser projects emitted the internal message for `/editions/9999` while all 84 tests passed.
- Expected benefit: Cleaner operational signal and fewer false alarms.
- Compatibility risk: Low if corrected by a framework patch; medium if route-generation semantics must change.
- Migration impact: Potential Next.js patch update or route configuration adjustment.
- Tests required: Controlled production-server request, server log assertion, and existing 404 E2E.
- Affected public contracts: None; the HTTP 404 response must remain unchanged.
- Priority: P2
- Dependencies: Next.js patch evaluation and AWS-002.
- Recommendation: Later, after reproducing against a newer compatible Next.js patch.
