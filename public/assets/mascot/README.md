# Mascot artwork

`mascot.jpg` is the event character rendered by
`components/atoms/Mascot.tsx`. Swapping the artwork is dropping a new file
here under the same name - no code change.

## Current file: PROVISIONAL, resolve the license before shipping

| | |
|---|---|
| File | `mascot.jpg` |
| Source | `https://i.pinimg.com/236x/92/34/e2/9234e2d816edeea0b4b3817c231b7f01.jpg` |
| Retrieved | 2026-09-10 |
| Source size | 236x481 px, cropped square to 236x236 around the head |
| Subject | Red-crested cardinal (*Paroaria coronata*), native to Paraguay |
| License | **UNKNOWN** |

The subject fits: the cardinal is a regional bird and its red crest lands on
the same red as `--color-national-red-on-dark`, so it sits inside the palette
rather than beside it.

Two things are still open:

1. **License.** It is a wildlife photograph reposted to Pinterest with no
   author credit and no license grant. Publishing it on the event site needs
   permission from the copyright holder, or a replacement from a stock
   library with a commercial license.
2. **Form and resolution.** It is a 236px photograph, not an illustrated
   character. The Community Day family uses a drawn mascot with transparency,
   which composites cleanly over a page corner; a rectangular photo does not,
   which is why the component frames it in a circle. Transparent artwork can
   drop the frame by passing `rounded-none ring-0` to `<Mascot />`.

Commissioned artwork of this same bird - drawn, transparent, and licensed -
removes both problems and keeps the identity this file establishes.
