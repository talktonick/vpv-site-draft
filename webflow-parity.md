# Webflow Parity — Convention Map

**Purpose:** the single source of truth for how the live Webflow site is built, so new
modules prototyped in Claude Code can be handed back to Webflow as near-mechanical Designer
steps (copy, not translate). This mirrors the *developer's actual conventions*, not the
draft's `design-system.md`. Where they differ, **this file wins for anything destined for
Webflow.**

**Source of truth:** the developer's export. Current snapshot lives at
`/Users/suzukisaint/Sites/vpv-webflow/` — export folder `vpvstaging.webflow 6:19:26/`,
page `master-landing-page-template.html`, foundation CSS `css/vpvstaging.webflow.css`.
Walkthrough notes: `Webflow summary conversation.md` + the long transcript. **Refresh this
doc from each new export.** Direction of truth: *Webflow owns the foundation; the gallery
owns new module structure.*

> Status: foundation frozen ~2026-06-19. CMS not yet wired to headers (manual text is fine
> in the interim).

---

## Plain-language summary (for non-developers)

**What this is:** a rulebook describing how the developer builds the Webflow site. Its job is
to let Claude prototype new sections that drop into Webflow cleanly. **You don't need to
understand the technical sections (2–7) — those are for Claude to follow.** Here's the part
that affects *you* when you're clicking around in Webflow:

- **Sections** — every section is a `section-new` block with spacing already built in. Add the
  `is-top` option to the **first** section and `is-base` to the **last** for breathing room;
  remove them if you want sections to sit flush.
- **Image grids** — you can freely drag/reposition *individual* images in a grid. **Don't add
  or remove rows/columns** on the grid itself — that breaks every grid that shares it.
- **Videos** — to add one, drop a video block and just change the source link; the rest is
  automatic. Don't switch on the audio button for a silent video.
- **Colors** — never type a color value; always pick a *named* color, so light/dark mode keeps
  working by itself.
- **Claude-built tools** — these go in a full-width "feature embed." Heads-up: the site's
  smooth-scroll effect fights *scrollable* embeds on desktop, so keep embeds non-scrolling.
- **Content drawers** (the pop-out panels) are CMS-driven — the "page target" must match the
  page or the drawer won't open.

The rest of the doc is the precise version of the above, plus §8's plain list of which modules
are built vs. still to do.

---

## 1. Foundation stack — two layers

The site = **Client-First (Finsweet) utilities + a custom editorial layer on top.**

| Layer | Examples | Use it for |
|---|---|---|
| **Client-First (stock)** | `.margin-*`, `.padding-section-*`, `.max-width-*`, `.container-*`, `.text-size-*`, `.heading-style-h*`, `.text-weight-*`, `.text-color-*` | Utility tweaks, generic page chrome, anything already conventional in Client-First |
| **Editorial layer (custom) — CANONICAL** | `.section-new`, `.flex`+gap modifiers, `.media-grid`, `.media-text-grid`, `.media-wrap`, `.p1/.p2/.p3`, `.h1/.h2/.h3-sans-new`, `.h*-serif-new`, `.feature-embed`, `.audio-embed-container`, `.content-drawer` | **All new content modules.** This is the going-forward system. |

The developer **deliberately abandoned the old verbose padding utilities** (`.padding-170-60`
etc.) in favor of `.section-new` with a built-in gap: *"section new where I've added a gap…
none of those weird padding values anymore."* **Build new modules on the editorial layer.**

---

## 2. The fluid root + unit-by-role rules

**Everything hangs on the fluid root:**
```css
html { font-size: calc(0.333rem + 0.741vw); } /* capped at 1440px */
@media (max-width: 992px) { html { font-size: 1rem; } } /* frozen at 16px */
```
→ **Above 992px, every `rem` scales with the viewport** (~16px @1440 up to ~19–20px on large
monitors). **Below 992px, `1rem` = 16px fixed.** This is why `rem` spacing scales fluidly on
desktop with zero media queries, then goes predictable on tablet/mobile.

**Choose units by role, not habit:**

| Sizing | Unit | Why |
|---|---|---|
| Section padding, gaps, vertical rhythm | **`rem`** | rides the fluid root |
| Hero / display headlines | **`vw`**, pinned to **`px`** at 479 | fluid, but capped so it doesn't collapse on mobile |
| Sub-headings (contained) | **`rem`** | |
| Body / labels / eyebrow / UI | **`px`** | fixed; mute via `opacity: .65`, not a separate color |
| Any color | **paired variable** (§4) | never a hex — a hardcoded hex breaks dark mode |

Utility spacing classes are **named by px intent but valued in rem** (`.padding-20` = `1.25rem`).

---

## 3. Color + dark mode

Six-swatch palette; all variation via opacity, never new hues.

| Swatch | Hex | Role |
|---|---|---|
| `--swatch--purple` | `#3012e4` | single accent |
| `--swatch--midnight` | `#1b1828` | text / inverse bg |
| `--swatch--navy` | `#2d2b3a` | text base |
| `--swatch--cream` | `#fdfcfa` | page bg |
| `--swatch--silver` | `#f4f4f4` | muted surface |
| `--swatch--white` | `#ffffff` | elevated surface |

Opacity variants exist as swatches too: `navy-10/40`, `white-10/20/40`, `midnight-10`,
plus `cream-v2 #f9f7f3` / `midnight-v2 #070316`.

**Dark mode is automatic via paired variables.** Always style with the `--color--x-to-y`
token (light value → dark value); a toggle script (`tr-color-vars`) swaps them to `--dark--*`.

| Paired token | Use for |
|---|---|
| `--color--navy-to-white` | primary text |
| `--color--navy-to-silver` | muted body text (base of `.p1/.p2`) |
| `--color--white-to-navy` | elevated surface |
| `--color--silver-to-navy` | muted surface / **grey card** |
| `--color--cream-to-midnight` | page background |
| `--color--purple-to-white` | accent (becomes white in dark) |
| `--color--navy-10-to-white-20` | subtle fills (pills) |
| `--color--navy-40-to-white-40` | subtle text (eyebrows) |

**Rule: never type a hex in a module. Pick the paired variable.**

### Muting = opacity, not a different color
Text hierarchy comes from **one color + opacity**, not separate dark/light color tokens.
Secondary / body text = the color at **`opacity: .65`** (baked into `.p1` / `.p2` / `.p3`);
primary text (headings, labels, emphasis) = **100%**. So two elements on the *same* color
variable can render different darkness — **if they don't match, check opacity, not color.**
(In Webflow: Style panel → **Effects → Opacity**.) Bonus: opacity-muting flips correctly in
dark mode for free. Example: a numbered-card's bold label = `navy-to-white` @100%; its body
paragraph = `.p2` (`navy-to-silver` @65%) — same family, different opacity = the hierarchy.

---

## 4. Typography

Two families: `--sans` = **NeueHaasDisplay** (Thin 200 / Light 300 / Roman 400 / Medium 500 /
Black), `--serif` = **Victorseriftrial** (the "+", italics, editorial display).

| Class | Size | Weight / LH | Notes |
|---|---|---|---|
| `.h1-sans-new` / `.h1-serif-new` | `8vw` → `46px` @479 | 200 / 100, lh .9, max 65vw | hero display |
| `.h2-sans-new` / `.h2-serif-new` | `3rem` → 2.6rem @991 → 1.75rem @479 | 400, lh 1.3, max 85vw | section headline |
| `.h3-sans-new` / `.h3-serif-new` | `2rem` | 400, lh 1.2, max 85vw | sub-headline |
| `.h3-sub` | `21px` → 1.125rem @479 | 500, lh 1.6 | small subheader |
| `.p2` | `18px` | 500, lh 1.4, **opacity .65**, navy-to-silver, max 400px | body / deck |
| `.p1` | `14px` | opacity .65, navy-to-silver, max 400px | captions / tags / eyebrow base |
| `.p3` | `16px` | opacity .65, max 400px | small body |
| `.p1.main-tag` | (p1) | uppercase, letter-spacing 1.5px, bg `navy-10-to-white-20`, radius 32px, pad 6/12px | eyebrow **pill** |

Weight combos: `.text-weight-medium` on `.p1`/`.p2` = **600**. Serif italics for bylines,
the "+", and emphasis inside sans headlines.

---

## 5. Canonical layout system

```
.page-wrap                      flex column, gap 9rem (→6rem @991)   ← stacks sections
└ .section-new                  flex column, gap 4rem, pad-x 2.5rem  ← the all-in-one wrapper
  ├ .is-top   (combo)           margin-top 12rem (→9rem @991)        ← first section on page
  ├ .is-base  (combo)           margin-bottom 12rem                  ← last section on page
  ├ .media    (combo)           pad-x 0                              ← full-bleed media
  └ .content-drawer (combo)     pad-y 6rem                           ← drawer context
```

`.section-new` responsive pad-x: `2.5 → 2rem @991 → 1.25rem @767 → .9375rem @479`.
Remove `is-top`/`is-base` for a section that should butt up with no extra space.

**Flex (the content primitive)** — column by default:

| Class | Behavior |
|---|---|
| `.flex` | flex column |
| `.flex._3` | column, gap `3rem` (→2rem @991) — main text stack |
| `.flex._1-5` | column, gap `1.5rem` |
| `.flex.horizontal` | row, gap `1rem`, align center |
| `.flex.tags` | row wrap, gap `.6rem`, max 500px |
| `.flex.article-content-inner` / `-outer` | the article column (rich text + media live here) |

**Grids** — real CSS Grid, gap `1rem` (→.6rem mobile):

| Class | Layout |
|---|---|
| `.media-grid` | 2 cols (`1fr 1fr`) |
| `.media-grid._3-col` | 3 cols → 2 cols at 767 → 1 col at 479 |
| `.media-text-grid._2-col` | 2 cols, rows `26.5625rem` ×2 |
| `.media-text-grid._3-col` | 3 cols, rows `20rem` ×2 (text centered between two media) |
| `.media-text-grid._3-col._2-up` | 3-col variant |

> **Grid rule (critical):** you may freely reposition *individual items* (per-item
> `grid-column` / `grid-row` start/end) without affecting others. **Never add/remove rows or
> columns on the grid class itself** — it breaks every instance of that class.

### When to add a grouping wrapper inside `section-new`
Add an intermediate flex/grid wrapper (e.g. `.flex._1-5`) only when a module has **multiple
repeating items** that need shared spacing tighter/different than the section's own 4rem gap
(e.g. the Numbered Sequence's two cards → wrapped in `flex 1-5` at 1.5rem). A **single
element** (e.g. the CTA's one `.cta-panel`) goes **directly** in `section-new` — it's its own
flex container for its content, so no wrapper. Rule of thumb: *wrapper = you're corralling more
than one sibling; one element needs no corral.*

---

## 6. Component recipes

### Video (one embed targets all)
- The page carries **one custom video code embed** (at the top). Any video then works just by
  adding a `.media-wrap` containing a `<video>` — **change only the `<source>` `data-src`.**
- Modes via the video class: `.Verbal-visual` (autoplay, no lazy), `.Verbal-visual-lazy`
  (lazy, plays on scroll-into-view), `.Verbal-visual-lazy-hover` (hover-to-play). Controls:
  `.video-controls-wrap` › `.video-pause` / `.video-audio` (each holds an `.icon-embed`).
- Behaviors: **pause off-screen**; on mobile hover-to-play falls back to an always-visible
  control; only enable the audio toggle if the video actually has audio.
- **Set the video to `display: block`** (it's inline by default → causes a ~10px bottom gap).
  Apply to article/landscape videos; grid videos keep their aspect handling.
- Host video on **bunny.net** (replaced Vimeo). `.mp4` and `.mov` both work. Compress.

### Audio ("Hear")
- `.audio-embed-container` (flex column, centered, gap 1.5rem). Timestamped player; on mobile
  the progress bar hides for a simpler control. Lives in the article flex by default; drop it
  into a bare `.section-new` to span full width.

### Content Drawer (CMS)
- CMS collection **Content Drawers**: fields = name, image and/or video URL, rich text,
  "video has audio" toggle, **page-target slug**.
- Add to a page: drag the CMS component in, **filter by drawer name, limit to 1**.
- A code embed rewrites the URL to `page-target` + `drawer-open`, so **the page-target slug
  must match the page** or the drawer won't open. Drawers are URL-shareable, full-width on
  mobile, and reuse the same rich-text styling as articles.

### Full-width HTML embed (for Claude-built tools)
- Put a `.feature-embed` (width 100%) inside a `.section-new` with **padding zeroed**, placed
  **outside** the article-content flex → spans page width + page padding.
- **Caveats:** (1) **Lenis** scroll-jacking runs on desktop (off on mobile) — internal
  scrollable iframes fight it; avoid internal scroll or request an override. (2) Embed images
  must use **Webflow CDN URLs** (Asset → ⋯ → Copy link). (3) Don't stack many heavy embeds on
  one page (load cost).

---

## 7. Breakpoints

Webflow's native four only — **no custom breakpoints:**
- **Base** ≥992 (fluid root active) · **991** tablet · **767** mobile landscape · **479** mobile portrait.

Spacing steps down at each (e.g. `section-new` pad-x `2.5→2→1.25→.9375rem`; `page-wrap`
gap `9→6rem`; display type pins to px at 479). Reused classes carry their own overrides — so
new modules built from `.section-new`, `.p1/.p2`, `.h*-new` inherit responsiveness for free.

---

## 8. Module coverage (vs. the mockup gallery)

| Built in the template ✓ | Not yet built (prototype candidates) |
|---|---|
| Top-section heroes (#15–18) | **#05 Numbered Sequence** |
| #03 Prose / Info Paragraph | #18 Horizontal Scroll *(explicitly deferred)* |
| #04 Pull Quote | #12 Scope Columns + Visit Link |
| #06 Media Single | #13 Up Next / Related |
| #07 Video (4 modes) | #14 CTA Block |
| #08 / #09 Media Pair / Gallery | #17 Expanding Feature Pills |
| #10 Media + Text | #19 Highlight Text on Scroll |
| #21 Audio Player | #27 Download Button |
| #22 Drawer (CMS) | #28 Tooltip → info popup grid |
| Full-width `feature-embed` | |

~12 built, ~9 to go. (Article/Case-Study headers #01/#02 exist site-wide; the landing
template uses the Top-Section heroes instead.)

---

## 9. The round-trip workflow

1. **Prototype** a new module in the parity sandbox (the developer's real CSS + classes) so it
   renders as it will in Webflow.
2. **Hand off** as exact Designer steps: *apply existing class X; add combo Y for tweaks.*
   Most classes already exist in the project, so steps are mostly "apply existing class."
3. **Refresh** this doc + the foundation snapshot from each new export.
4. Webflow owns the foundation; the gallery owns new module structure — one-directional, so
   nothing drifts.

> Worked example (Numbered Sequence #05): structure = `.section-new` › `.flex._1-5` (eyebrow
> + cards) › card `div` (grey via `--color--silver-to-navy`, radius `1.25rem`) › `.flex.horizontal`
> (numeral + `.flex._1-5`). Title now reuses **`.h3-sans-new`** (2rem). Body = `.p2`; label =
> `.p1` + `.text-weight-medium` (de-muted). Only genuinely new piece: the gutter numeral
> (accent `--color--purple-to-white`) and a plain eyebrow combo on `.p1`.
