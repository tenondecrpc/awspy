# Mobile patterns

Use 320px as the narrowest supported viewport and review common widths such
as 375px and 390px. These patterns describe the current implementation.

## Home

The event photograph sits above the navy hero panel on phones. The panel
keeps the event subtitle, labeled date, hours, venue and free-entry facts,
countdown, and two actions. The hero can grow beyond one screen when zoomed.
All projected figures remain visible in a responsive grid. Agenda, speakers,
sponsors, and the three ways to participate flow vertically without
height-based hiding.

## Schedule

The room and time rails scroll horizontally inside their own bounds and stay
below the sticky header (`top-[var(--header-h)]`). Room chips include a text
name as well as a color dot. Sessions group by day and time; details hold long
descriptions. When Sessionize has accepted talks but no grid, show those talks
and explain that times and rooms are pending. When both are empty, show the
agenda empty state. Workshop capacity and check-in instructions remain below
the programme.

## Sponsors and registration

Sponsor logos stay on white plates; available tiers show "Tu logo aquí" slots.
The package ladder wraps and the comparison table uses a bounded horizontal
scroll area. The Eventbrite action fills its card width at desktop and phone
sizes, with its helper text centered beneath it. The form itself remains on
Eventbrite. CFP uses the configured deadline and Sessionize action.

## Navigation, footer, and Kiro

The menu and theme controls have 44px touch targets. The mobile drawer closes
by button, Escape, or backdrop. Footer columns wrap with headings and retain
all links, contact details, free-entry note, and privacy notice. Kiro sits
after the footer on phones; its shader remains clipped to the mascot and its
chat controls remain keyboard accessible.

## Acceptance

- No horizontal page scroll at 320px, 375px, 390px, or 414px.
- No content or function disappears at 200% zoom or in a short viewport.
- Light and dark modes have readable text and visible keyboard focus.
- Interactive controls are reachable by keyboard and screen reader.
- `prefers-reduced-motion` is respected.
