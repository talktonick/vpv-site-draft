# Webflow — Variable Overwrite Checklist (MAST clone → V+V)

**Corrected against the actual MAST clone structure ("VPV Draft Site").** You overwrite MAST's
values in place. Two structural facts confirmed from the live Variables panel:

1. **Typography is already fluid the way we wanted.** Each heading's `Font Size` =
   `clamp(<Min rem>, …, <Max rem>)` built from separate **Font Size Min (rem)** and **Font Size
   Max (rem)** number variables. → You only edit the Min/Max numbers. **Do not paste clamp()
   strings.** (This supersedes the raw clamp values in variables.md.)
2. **Theme colors use `light-dark()` referencing the Color collection swatches.** → Overwrite
   the **Color swatches**; Theme cascades. The dark half of each `light-dark()` pair becomes the
   V+V **Invert / dark-section** treatment automatically.

Legend: ✏️ overwrite · ➕ add · ⏭️ leave

---

## 1. Color collection (exact swatches confirmed from the clone)
| MAST swatch (group / name) | Current | Action | V+V value |
|---|---|---|---|
| Primary / **Orange** | `#d14424` | ✏️ | Purple `#3012E4` (optional: rename → "Purple") |
| Primary / **Dark Orange** | `#9c331b` | ✏️ | `#2A12C9` (purple darkened ~15%) |
| Secondary / **Blue** | `#0073e6` | ⏭️ | leave unused |
| Secondary / **Yellow** | `#f8d47a` | ⏭️ | leave unused |
| Neutral / **White** | `white` | ⏭️ keep | pure White `#FFFFFF` (elevated surfaces / `u-bg-white`) |
| (add) **Cream** | — | ➕ | `#FDFCFA` (page background — repointed in Theme) |
| Neutral / **Light Gray** | `#f0eee6` | ✏️ | Silver `#F4F4F4` |
| Neutral / **Mid Gray 1** | `#cccabf` | ✏️ | hairline rule `#E2E1E4` (Theme/Border points here) |
| Neutral / **Mid Gray 2** | `#474641` | ✏️ | `#2D2B3A` Navy (strong rule / muted) — or leave |
| Neutral / **Dark Gray** | `#292825` | ✏️ | `#232130` (dark step) — or leave |
| Neutral / **Black** | `#1d1c1a` | ✏️ | Midnight `#1B1828` |

> Why keep White pure AND add Cream: V+V bg = Cream, elevated surfaces = White. If you turned
> the White swatch into Cream you'd lose pure white for cards. So add a Cream swatch and only
> repoint the Theme background to it (next section). Mid Gray 2 / Dark Gray barely appear in the
> Insights template — only retune them if the style-guide page shows them somewhere visible.

## 2. Theme collection (modes: Base / Accent — edit the row references)
| Theme row | Action |
|---|---|
| Background | ✏️ repoint the **light** value from Neutral/White → **Cream**. Leave dark = Neutral/Black (now Midnight). Result: Base = Cream bg, dark mode = Midnight bg (= your Invert sections). |
| Text | ⏭️ already light-dark(Black, White) → now resolves Midnight / Cream. ✓ |
| Border | ✏️ → Neutral/Mid Gray (now the ~`#E2E1E4` rule color). |
| Accent | ✏️ → Purple (already references Primary/Orange → now Purple). ✓ if it points at Primary. |
| Accent Dark | ✏️ → `#2A12C9`. |
| Accent **mode** Background | ✏️ optional: set the accent-section bg to Silver, or a purple-tinted surface to taste. |

## 3. Typography collection — DECISION: keep MAST's sizing, change only font (+ optional weight)

**Decided (Nick):** leave MAST's fluid sizing machinery at defaults for now — Font Size, Min,
Max, clamp, Line Height, Letter Spacing, Bottom Margin all **untouched**. Revisit later in
preview. The only changes now:

- [ ] **Primary Font:** General Sans → ✏️ `Neue Haas Display`. Cascades to all headings +
      paragraph automatically (they reference Primary Font) — don't touch individual heading rows.
- [ ] **Heading weight (optional):** MAST default 500 → V+V uses **300 (Light)** for H1/H2 — a
      signature V+V look, one number per heading. Fine to leave 500 and decide live.
- [ ] **Serif:** no variable needed now — `.article-hero__headline` + byline use Victor Serif via
      `global-css.css`. Add a "Serif Font" variable later only if you want it pickable in the Designer.

⚠️ **Consequence to expect:** MAST defaults render headings **bigger** than the existing V+V site
(MAST H1 max = 88px = your *Display* size; your real H1 = 56px) and they scale fluidly. Not a bug.

**V+V target sizes — for WHEN you decide to retune (not now):**
| Heading | Min rem | Max rem (=V+V px) | Weight | LH | Tracking |
|---|---|---|---|---|---|
| H1 | (leave/your call) | 3.5 (56) | 300 | 1.1 | -0.015em |
| H2 | | 2.5 (40) | 300 | 1.1 | -0.015em |
| H3 | | 1.875 (30) | 400 | 1.25 | -0.015em |
| H4 | | 1.5 (24) | 400 | 1.25 | -0.015em |
| Body | | 1.0625 (17) | 400 | 1.55 | 0 |
Recommended approach when you retune: change **maxes only**, leave MAST's mins (gentle fluidity),
then nudge by eye in preview. The 88px serif Display stays hero-only via global-css.css.

## 4. Components collection
| Group / var | Action | V+V value |
|---|---|---|
| Section / Padding Min, Max (rem) | ✏️ | 3 / 6 (ok) — or Max 8 for V+V's roomier section rhythm |
| Container / Max (the calc input) | ✏️ | 72 (→ Col Wide 72rem). Gutter 6vw ⏭️ ok |
| Card / Border Radius | ✏️ | `1rem` (V+V Radius L = 16px; MAST default 0.5rem) |
| Card / Padding Min, Max | ⏭️ | 1 / 1.5 ok |
| Button / Border Radius | ✏️ | `999px` (V+V pill; MAST default 0.5rem) |
| Button / Font Weight | ✏️ | 500 (Medium) |
| Button / Font Size | ✏️ | 0.9375rem (UI) |
| Button / Letter Spacing | ✏️ | 0.005em |

## 5. Layout collection (confirmed — mostly leave as-is)
- [ ] Grid / **Columns** 12 ⏭️ (matches our grid)
- [ ] Grid / **Gap Main** 40px → optional ✏️ `48px` (V+V Space 7); **Gap MD** 24px ⏭️ (=Space 5),
      **Gap SM** 8px ⏭️ (=Space 2), **Gap Button** 16px ⏭️ (=Space 4)
- [ ] Spacing / **Margin XS/SM/MD/LG** (0.5/1/2/3 em) ⏭️ — these are MAST's em-relative margin
      utilities; leave them, they're idiomatic.
- [ ] Fluid / **Max 90**, **Min 20** ⏭️ — **do NOT change.** These are the viewport bounds
      (20rem→90rem ≈ 320→1440px) that drive every clamp() AND the container max width
      (`calc(Fluid/Max * 1rem)` = 90rem). Changing Max also moves where headings hit full size.
      The Insights reading column is set explicitly (52rem) so we don't need to narrow this.

## 6. Fonts — upload your existing TTFs

Yes: upload the **exact same `.ttf` files** from `assets/fonts/`. Webflow accepts ttf/otf/
woff/woff2 (woff2 is lighter but ttf is fine).

**Where:** Designer → top-left site menu → **Settings → Fonts → Custom fonts → Upload font**.
(Or from the Dashboard: your site → **Settings → Fonts**.) Drag in the files, then for each
file set **Family name**, **Weight**, and **Style**:

| File (`assets/fonts/`) | Family name | Weight | Style |
|---|---|---|---|
| neue-haas-light.ttf | Neue Haas Display | 300 | Normal |
| neue-haas-regular.ttf | Neue Haas Display | 400 | Normal |
| neue-haas-italic.ttf | Neue Haas Display | 400 | Italic |
| neue-haas-medium.ttf | Neue Haas Display | 500 | Normal |
| neue-haas-bold.ttf | Neue Haas Display | 700 | Normal |
| victor-serif-light.ttf | Victor Serif | 300 | Normal |
| victor-serif-light-italic.ttf | Victor Serif | 300 | Italic |

Tag each file with the right weight/style so the variable font-weights (300/400/500) resolve to
the real cut instead of a faux-bold/synthetic italic. After upload, set the **Typography →
Primary Font** variable to `Neue Haas Display` and add **Secondary/Serif Font** = `Victor Serif`.

> Licensing: these are licensed faces — self-hosting in Webflow is fine only if your license
> covers web/self-hosting. You already ship them on the existing site, so likely OK; just be aware.

## 7. Global CSS + cleanup
- [ ] Paste `webflow/global-css.css` into the Global Canvas CSS component.
- [ ] Strip MAST demo pages → `page-wrapper → nav → page-main → footer`.
- [ ] `page-wrapper` on Theme = Base.

## 8. Smoke test
- [ ] h1 + p + button on a blank page → Neue Haas, Midnight on Cream, **purple** accent, pill
      button, h1 scales smoothly on resize. Screenshot it.
