# Design status and roadmap

## Implemented in the PR 29 reconciliation

| Area | Current design |
| --- | --- |
| Foundations | Warm paper, navy and flag colors, Young Serif, Atkinson Hyperlegible Next, fluid type, square corners |
| Motif | Original `Lace`, tricolor `FlagRule`, and Kiro with motion and masked shader |
| Shell | Sticky header, mobile drawer, full muted-paper footer and privacy notice |
| Home | Photo hero, live countdown, seven projected figures, pillars, real agenda preview, speakers, venue, FAQ, team, sponsor slots, three actions |
| Agenda | Room and time rails, published sessions, accepted-talk fallback, workshop notice |
| Speakers | Sessionize profiles, full bios, talks, and detail pages |
| Sponsors | Logo plates, available slots, package ladder and comparison table |
| Pages | Registration, CFP, venue, team, volunteers, FAQ, code of conduct, editions, privacy, 404 and error routes |
| Themes | Light default and explicit dark toggle; both use semantic tokens |

## Follow-up

1. Replace low-resolution organizer photos when larger originals become
   available; add any venue transport and accessibility facts only after the
   organizers supply them.
2. Obtain the programme brand kit and confirm the logo, naming, and use of
   Amazon Orange. See [brand-alignment.md](brand-alignment.md).
3. Have organizers review public copy and representative people test the
   desktop, phone, keyboard, and screen-reader flows.
4. Consider removing now-unused components and selectors in a separate,
   behavior-preserving cleanup.

The repository gates are `npm run verify` and the production Playwright suite.
The visual review should cover 320px and 390px phones, desktop, 200% zoom,
both themes, horizontal overflow, and accessibility violations.
