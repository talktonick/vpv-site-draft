# V+V Design System — Webflow Foundation Reference

Extracted from the existing HTML site (`styles/tokens.css`, `typography.css`, `base.css`,
`components.css`, `shell.css`, `views.css`) plus `vv-site-brief.md`. This is the stable
source of truth for building the Webflow foundation (Variables + base styles) before any
component translation. Values are verbatim from the codebase.

---

## 1. Color

Six-color brand palette. **All variation comes from opacity / color-mix, never new hues.**

| Token | Hex | Role |
|---|---|---|
| `--purple` | `#3012E4` | Accent (single brand accent) |
| `--white` | `#FFFFFF` | Elevated surfaces |
| `--cream` | `#FDFCFA` | Page background |
| `--silver` | `#F4F4F4` | Muted surfaces |
| `--navy` | `#2D2B3A` | (reserved, rarely used directly) |
| `--midnight` | `#1B1828` | Text + inverse background |

### Semantic tier (build Webflow variables off these, not the raw hexes)
| Token | Value |
|---|---|
| `--color-bg` | `--cream` |
| `--color-bg-elevated` | `--white` |
| `--color-bg-inverse` | `--midnight` |
| `--color-bg-muted` | `--silver` |
| `--color-text` | `--midnight` |
| `--color-text-inverse` | `--cream` |
| `--color-text-muted` | `midnight @ 65%` (`color-mix in oklab ... 65%, transparent`) |
| `--color-text-subtle` | `midnight @ 40%` |
| `--color-accent` | `--purple` |
| `--color-rule` | `midnight @ 8%` (hairline dividers) |
| `--color-rule-strong` | `midnight @ 20%` (borders, ghost buttons) |

Notes:
- `::selection` = purple bg / cream text.
- `--color-text` is intentionally bound to `--midnight` (a kept sandbox decision).
- Opacity tints use `color-mix(in oklab, <color> N%, transparent)`. Webflow can't author
  `color-mix` in the Variables panel — see conventions.md for how to reproduce these
  (pre-computed rgba values or a Global CSS embed).

---

## 2. Typography

Two families:
- `--sans`: **'Neue Haas Display'**, -apple-system, sans-serif
- `--serif`: **'Victor Serif'**, 'Times New Roman', serif

Font files in `assets/fonts/` (TTF). Weights loaded:
- Neue Haas Display: 300, 400 (+ 400 italic), 500, 700
- Victor Serif: 300, 300 italic

### Weights
| Token | Value |
|---|---|
| `--fw-light` | 300 |
| `--fw-regular` | 400 |
| `--fw-medium` | 500 |
| `--fw-bold` | 700 |

### Modular type scale (10 steps)
| Token | rem | px |
|---|---|---|
| `--t-micro` | 0.6875 | 11 |
| `--t-small` | 0.8125 | 13 |
| `--t-ui` | 0.9375 | 15 |
| `--t-body` | 1.0625 | 17 |
| `--t-lead` | 1.25 | 20 |
| `--t-h4` | 1.5 | 24 |
| `--t-h3` | 1.875 | 30 |
| `--t-h2` | 2.5 | 40 |
| `--t-h1` | 3.5 | 56 |
| `--t-display` | 5.5 | 88 |

### Line heights
`--lh-display` 0.95 · `--lh-tight` 1.1 · `--lh-snug` 1.25 · `--lh-body` 1.55

### Letter spacing
`--tr-display` -0.025em · `--tr-h` -0.015em · `--tr-body` 0 · `--tr-ui` 0.005em · `--tr-eyebrow` 0.08em

### Composite type roles (font shorthand: weight size/lh family)
| Role | Definition |
|---|---|
| `--type-display` | light 88px / 0.95 sans |
| `--type-h1` | light 56px / 1.1 sans |
| `--type-h2` | light 40px / 1.1 sans |
| `--type-h3` | regular 30px / 1.25 sans |
| `--type-h4` | regular 24px / 1.25 sans |
| `--type-lead` | regular 20px / 1.55 sans |
| `--type-body` | regular 17px / 1.55 sans |
| `--type-ui` | regular 15px / 1.25 sans |
| `--type-eyebrow` | medium 11px / 1.25 sans (uppercase + 0.08em) |
| `--type-serif-display` | regular 88px / 0.95 serif |
| `--type-serif-h2` | regular 40px / 1.1 serif |

### Type utility classes (existing)
`.t-display .t-h1 .t-h2 .t-h3 .t-h4 .t-lead .t-body .t-ui .t-eyebrow .t-small .t-micro`
plus color helpers `.t-muted .t-subtle` and `.t-byline`.

### Italic discipline (important editorial rule)
- **Neue Haas italic** → body emphasis, UI italics, captions.
- **Victor Serif italic** → bylines/attribution, italic emphasis *inside* Neue Haas
  headlines (`.t-h1 em`, `.t-h2 em`, `.t-display em` all swap to serif light italic),
  pull quotes, the wordmark "+", editorial long-form display.
- **Article hero headline is the one explicit exception**: Victor Serif at *display* size
  is allowed there (`--type-serif-display`).
- Never: serif for body italic or UI.

---

## 3. Spacing — 4px base scale

| Token | rem | px |
|---|---|---|
| `--s-1` | 0.25 | 4 |
| `--s-2` | 0.5 | 8 |
| `--s-3` | 0.75 | 12 |
| `--s-4` | 1 | 16 |
| `--s-5` | 1.5 | 24 |
| `--s-6` | 2 | 32 |
| `--s-7` | 3 | 48 |
| `--s-8` | 4 | 64 |
| `--s-9` | 6 | 96 |
| `--s-10` | 8 | 128 |

Layout rules from the brief:
- Outer page padding: `--s-6` (32px) horizontal, reduces on mobile.
- Top-level section stacking: `--s-10` between sections via `> * + *`.
- **Never `margin: 0 auto` on section-level containers** (it overrides parent stacking
  margin). Use `margin-inline: auto`.

---

## 4. Layout widths

| Token | rem | px |
|---|---|---|
| `--col-narrow` | 38 | 608 |
| `--col-medium` | 52 | 832 |
| `--col-wide` | 72 | 1152 |

---

## 5. Radius / Shadow / Motion

Radius: `--radius-s` 4px · `--radius-m` 8px · `--radius-l` 16px · `--radius-xl` 24px · `--radius-pill` 999px

Shadow: `--shadow-none` none · `--shadow-soft` (two-layer soft midnight shadow at 5%/4%)

Motion:
- Easing: `--ease` `cubic-bezier(0.4,0,0.2,1)` · `--ease-out` `cubic-bezier(0,0,0.2,1)`
- Duration: `--dur-fast` 150ms · `--dur-base` 250ms · `--dur-slow` 400ms

---

## 6. Breakpoints (as authored)

The existing site is component-specific rather than systematic. Observed `max-width` queries:
- **1100px** — article layout collapses (ToC drops above body; media pill goes inline)
- **1000px** — pdp playground single-column
- **900px** — shell panel collapses below stage
- **800px** — browse/grid views

For the Webflow rebuild, map these onto MAST's four breakpoints (Desktop <992 / Tablet
≤991 / Mobile Landscape ≤767 / Mobile Portrait ≤478). Closest fits:
- 1100/1000px article+playground collapse → handle at **Tablet** (≤991) or a custom rule;
  there is no native Webflow breakpoint at 1100, so either move the collapse to 991 or add
  a Global CSS media query. Flag for Nick.
- 900px → **Tablet** (≤991).
- 800px → **Mobile Landscape** (≤767) is the nearest native; 800 has no native equivalent.

---

## 7. Shell tokens (app chrome — likely NOT needed for the static Insights template)

`--shell-topbar-h` 56px · `--shell-panel-w` 420px. The existing site is a locked-scroll
SPA "Explorer shell" (topbar + stage + persistent right panel, page scroll locked at
html/body). **The Webflow Insights rebuild is a normal scrolling page**, so the shell model
does not carry over — but the topbar height / brand treatment may inform the Webflow nav.

---

## 8. The Insights (article) template — anatomy

The Insights page = the existing `article` view. Source: `scripts/views/article.js` +
`views.css` (lines ~493–687). Structure to reproduce in Webflow:

```
.article-page            max-width col-wide, margin-inline auto, padding s-8 s-7 s-10
  .article-layout        grid: 14rem 1fr, gap s-7   (collapses to 1fr ≤1100px)
    .toc-sticky          sticky left ToC, top s-4, left rule border
      h3 "On this page"  eyebrow style
      ol > li > a.toc-label   aria-current="true" on active (purple left border)
    .article-column
      .article-hero                margin-bottom s-9
        .article-hero__eyebrow     eyebrow, kicker
        .article-hero__headline    SERIF DISPLAY (the editorial exception)
        .article-hero__deck        lead, muted, max 55ch
        .article-hero__byline      serif italic light; "By <em>name</em> · role"
      .article-body-prose          flex column, gap s-9
        .article-section           position relative, scroll-margin-top s-5
          .media-pill              absolute, left -7rem (margin rail); see below
          .article-section__heading   h2, max 22ch
          .article-section__body       body, max 60ch
```

### Active-state convention (system-wide)
Use **`aria-current="true"`** for "this is the current item" (ToC active link, nav, etc.).
**Do not** use `.active` or `data-active="true"`. (Note: some Osmo islands use `.active`
internally — that's allowed inside the island per the island rule; see conventions.md.)

### ToC behavior
- Sticky left column, 14rem wide.
- Scroll-spy via IntersectionObserver (root = scroll container, rootMargin
  `0 0 -70% 0`) sets `aria-current="true"` on the matching link.
- In Webflow this maps cleanly to the **Osmo "Table of Contents for Article"** island
  (attribute-driven, GSAP ScrollTrigger). See conventions.md.

### Media pill (left margin rail)
`.media-pill` floats in the left margin (`left: -7rem`), a rounded vertical chip with an
optional speaker avatar + See/Hear/Read icon buttons that open a modal (video / audio /
extended reading). Collapses inline (`position: static`, row) ≤1100px. Candidate islands:
Osmo modal + Vimeo player + Howler audio player.

---

## 9. Canonical components from the sandbox (per brief §"What's in the sandbox")

Buttons, tag pills, accordion already exist in `components.css`:
- `.button` + `--primary --secondary --ghost --accent --full` (pill shape, `--type-ui` medium)
- `.tag-pill` (informational chip, NOT a filter) + `--filled --accent`
- `.accordion` / `__item __header __body __list` (aria-expanded driven; toggle rotates 45°)

Brief also references (live elsewhere in the system): `.voice-pill` (block-only audio
player — never inline in paragraphs), `.engagement-timeline`, `.chapter-player`,
`.video-loop`, `.video-walkthrough`, `.expand-trigger`, `.cta-block`, `.toc-sticky`,
`.article-pullquote`, `.article-body-prose`, `.contact-form`.

---

## 10. Naming pattern observed (for reconciliation)

The existing site uses **BEM-ish**: `block__element` + `block--modifier`
(`.media-pill__icon`, `.button--primary`, `.article-hero__headline`). Tokens are CSS custom
properties with terse prefixes (`--t-`, `--s-`, `--fw-`, `--tr-`, `--lh-`, `--color-`,
`--type-`, `--radius-`, `--dur-`). MAST uses a different scheme (base / `u-` / `cc-` /
custom with `_` context separators) — the reconciliation rules in conventions.md govern
which wins where.
