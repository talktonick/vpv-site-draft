# Webflow Variables — Build Sheet

What to create in the Webflow Variables panel for the V+V foundation. Organized into MAST's
five collections. Variable names use MAST's Title-Case-with-spaces convention. Tints and the
TOC active style are NOT here — they live in `global-css.css` (color-mix can't be authored in
the Variables panel). Decisions: tints→Global CSS, headings→fluid clamp, breakpoints→991/767.

---

## Collection: Color (raw brand swatches)
| Variable | Value |
|---|---|
| Purple | `#3012E4` |
| White | `#FFFFFF` |
| Cream | `#FDFCFA` |
| Silver | `#F4F4F4` |
| Navy | `#2D2B3A` |
| Midnight | `#1B1828` |

Replace MAST's demo palette (`#d14424` etc.) entirely — do not keep MAST defaults.

## Collection: Theme (modes — applied at `page-wrapper`)
**Base mode** (default):
| Variable | Bound to |
|---|---|
| Background | Cream |
| Background Elevated | White |
| Background Muted | Silver |
| Text | Midnight |
| Accent | Purple |

**Invert mode** (for dark sections):
| Variable | Bound to |
|---|---|
| Background | Midnight |
| Text | Cream |

(Muted/subtle/rule border tints are NOT theme variables — see global-css.css.)

## Collection: Typography
**Families**
| Variable | Value |
|---|---|
| Font Sans | `'Neue Haas Display', -apple-system, sans-serif` |
| Font Serif | `'Victor Serif', 'Times New Roman', serif` |

**Weights:** Light 300 · Regular 400 · Medium 500 · Bold 700

**Sizes — fixed (reading/UI; no clamp):**
| Variable | Value | px |
|---|---|---|
| Size Micro | 0.6875rem | 11 |
| Size Small | 0.8125rem | 13 |
| Size UI | 0.9375rem | 15 |
| Size Body | 1.0625rem | 17 |
| Size Lead | 1.25rem | 20 |

**Sizes — DECISION (phase 1): keep MAST's default fluid sizing.** We are NOT retuning sizes/
clamp/line-heights now — only the font changes (Primary Font → Neue Haas) and optionally heading
weights. The MAST clone already builds sizes as `clamp(Min rem, …, Max rem)` from per-heading
Min/Max variables, so when we DO retune we just edit those numbers (no clamp strings). V+V
target maxes for later: H1 3.5 (56) · H2 2.5 (40) · H3 1.875 (30) · H4 1.5 (24) · Body 1.0625
(17). The 88px serif Display stays hero-only via `--size-display` in global-css.css. See
`variable-overwrite-checklist.md §3`.

**Line heights:** Display 0.95 · Tight 1.1 · Snug 1.25 · Body 1.55
**Letter spacing:** Display -0.025em · Heading -0.015em · Body 0 · UI 0.005em · Eyebrow 0.08em

## Collection: Layout
| Variable | Value | px |
|---|---|---|
| Space 1 | 0.25rem | 4 |
| Space 2 | 0.5rem | 8 |
| Space 3 | 0.75rem | 12 |
| Space 4 | 1rem | 16 |
| Space 5 | 1.5rem | 24 |
| Space 6 | 2rem | 32 |
| Space 7 | 3rem | 48 |
| Space 8 | 4rem | 64 |
| Space 9 | 6rem | 96 |
| Space 10 | 8rem | 128 |
| Col Narrow | 38rem | 608 |
| Col Medium | 52rem | 832 |
| Col Wide | 72rem | 1152 |

Set MAST's `section`/`container` padding + grid gap from these. Reading column for Insights
= Col Medium (832px).

## Collection: Components
| Variable | Value |
|---|---|
| Radius S | 4px |
| Radius M | 8px |
| Radius L | 16px |
| Radius XL | 24px |
| Radius Pill | 999px |
| Button Radius | → Radius Pill |
| Card Radius | → Radius L |

**Motion** (use in interactions / transitions): Ease `cubic-bezier(0.4,0,0.2,1)` · Ease Out
`cubic-bezier(0,0,0.2,1)` · Dur Fast 150ms · Dur Base 250ms · Dur Slow 400ms.

---

### Fonts
Upload to Webflow Asset Manager (Neue Haas Display 300/400/400-italic/500/700; Victor Serif
300/300-italic) — these match the `assets/fonts/` TTFs in the existing site.
