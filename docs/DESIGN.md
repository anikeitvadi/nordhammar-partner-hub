# Nordhammar Partner Hub: the design language ("ink")

One page, so every screen is built against the same rules. Derived from Ani's sources:
- `craft.md`, design slop indicators: "whitespace instead of borders, states instead of decoration"
- the type system "Serif reads, Sans operates, Mono IDs"
- the Stageshow `craft.md` and `motion.md` ideas, as adapted in `app-motion-plan.md` (used as inspiration, not as limits)
- the Home direction agreed on 2026-11-03: crisp black and white

## 1. Ground and ink
- **Ground:** the page is white everywhere. No gray canvas and no tinted panels.
- **Five inks:**
  - `--ink` #111113: text, rules on hover, primary actions
  - `--ink-2` #4a4a4f: body text
  - `--ink-3` #8a8a90: meta
  - `--rule` (ink at 10%): the one line colour
  - `--wash` #f4f4f5: the one fill, for selected and hover states and secondary controls
- **No accent colour.** The primary action is ink: a black fill with white text.
- **Status colours mean status and nothing else:** done (green `#1f7a4a`), waiting on someone (amber `#9a6400`), stopped or declined (red `#b3261e`). Each status is shown as its word in that colour, never as colour alone and never as a pill.

## 2. Type: serif reads, sans operates, mono identifies
| Role | Face | Size / weight | Used for |
|---|---|---|---|
| Statement | Geist Serif | 56 / 400 | Home's one line only |
| Page title | Geist Serif | 34 / 400 | One per page, said once |
| Section | Geist Serif | 22 / 400 | Section headings inside a page |
| Body | Geist Sans | 15 / 400, 500 for emphasis | Everything people read and operate |
| Meta | Geist Sans | 13 / 400, `--ink-3` | Captions, column headers, timestamps, helper text |
| Identifier | Geist Mono | 13 / 400 | Request IDs, ERP numbers, tax IDs, and numbers that must align |

- Sentence case everywhere. Buttons are Title Case and name their action ("Submit Request").
- Hierarchy comes from size, space and one weight step, never from uppercase tracked labels.
- No negative letter-spacing on the serif, and no italics.
- The real ellipsis "…".

## 3. Structure: compose objects, not an inventory of cards
- **No cards, tiles, or bordered containers.** A page is a title, one line of purpose, then its content. Whitespace groups things.
- **Say it once.** The top bar never repeats the page title. A count appears in one place.
- **Tables:**
  - no header fill; the header row is meta text
  - one hairline between rows
  - identifiers in mono; numbers right-aligned with tabular figures
  - status as a coloured word
  - rows hug their content (12 px padding)
- **One number gets to be big per surface.** Everything else is a line.
- **Filters are words you can press.** A row of plain text options with counts ("All 42 · BR 18 · EU 12 · On hold 3"); the selected one is ink with the wash behind it. No tile grids.

## 4. Controls
- **Buttons:**
  - Primary: an ink fill, white text, 36 px high, radius 6.
  - Secondary: the wash fill, ink text.
  - Text action: ink, underlined on hover.
  - One primary per screen.
- **Fields:** white, a 1 px `--rule` border, radius 6, 40 px high; the border turns ink on focus. Labels sit above the field and help text below it.
- **Focus:** a 2 px ink outline, offset 2 px, on every interactive element.

## 5. Navigation
- **Sidebar:** white, with one hairline on its right edge.
  - The wordmark is "Nordhammar" in the serif, with "Partner Hub" in meta under it.
  - Items are sans 14 with one icon set, Phosphor Regular at 18 px, one stroke weight throughout.
  - The selected item is ink text at 500 on the wash. Others are `--ink-2`.
  - The person sits at the bottom as plain text (name, role, region) with Sign Out as a text action.
- **Top bar:** search on the left and the one primary action (New Request) on the right, in ink. No page name.

## 6. Motion (the Stageshow rules, applied)
- **Two curves:**
  - travel `cubic-bezier(.45,0,.1,1)` for anything that moves place
  - arrival `cubic-bezier(.25,.8,.25,1)` for anything that appears
- **Feedback is quick:** 120 ms for a press or focus, 200 ms for a colour change. Only storytelling slows down: 360 ms to travel, 800 to 1000 ms to arrive.
- **Change only what changed.** Nothing pops; things arrive whole, rising 8 px and fading in. A new row opens its space with its neighbours.
- **Holding a result means stop**, on working screens: lists, forms and results don't loop or pulse.
- **The Home globe is the exception, on purpose.** It's the hub's one piece of ambient motion: it arrives facing the person's own partners, draws its arcs, then keeps turning slowly (one turn a minute), with a dot travelling each arc and this month's events ringing at their cities. Dragging turns it; it picks up again after a moment.
- **Lists stagger** 40 to 60 ms in reading order, only when their content changes.
- **Reduced motion** shows the final frame, never a mid-change one.

## 7. Never
- Pills or badges as decoration, tags everywhere, tinted boxes, dividers between sections that whitespace can separate.
- Gradients, glows, shadows on content, decorative diagrams, or a sparkle or purple for AI.
- Mono or uppercase for labels, a second accent colour, or a hand-drawn icon.
