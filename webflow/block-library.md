# V+V Block Library — Articles & Case Studies (build roadmap)

The Insights/case-study pages are assembled from **drop-in blocks**, not a fixed template.
Each block is a **Webflow Component**; a page's body is a **slot** you fill with blocks in any
order (per conventions §4b). Inspiration: AREA 17 + Mouthwash case studies — heavy mixed media
(video + stills, varied aspect ratios), content modals ("Read More +"), rich top headers. We
keep MAST for structure/layout and Osmo for the interactive appliances.

Source key: **MAST** = compose from MAST elements/utilities (native, responsive) · **Osmo** =
vendored island (in `osmo/`) · **Compose** = MAST grid/utilities wrapping an Osmo island ·
**New** = design from scratch in V+V language.

---

## 1. Top headers (the "above the body" section)  — mostly NEW
| Block | Source | Notes |
|---|---|---|
| **Article Header** | New (MAST elements) | eyebrow/kicker, H1 title, deck, byline (author + role), date, category tags, optional hero media. Component props: Title, Deck, Author, Role, Date, Category. |
| **Case Study Header** | New (MAST elements) | client name, timeframe/year, role/scope, one-liner, hero media. Optional **metrics strip** (AREA17-style) + **scope columns** (Brand / Experience / Technology lists). |
| Category / tag pills | MAST | reuse MAST pill / `tag-pill` styling, recolored. |

## 2. Text blocks
| Block | Source | Notes |
|---|---|---|
| **Info Paragraph** | MAST rich-text | the workhorse — headings/paragraphs/lists/quote all MAST-styled (proven on the Insights test page). |
| **Pull Quote** | MAST | MAST blockquote (already styled) or a V+V editorial pull-quote variant. |
| Section label / eyebrow | MAST | `eyebrow` class. |

## 3. Media blocks (the flexible AREA17/Mouthwash layouts) — DEFINED

**All video = Vimeo.** Four base components; **variants/properties** do the combinations (no
30-component sprawl). MAST `row`/`col` + aspect utilities do the layout; Vimeo islands do video.

### Shared dimensions (apply across the media blocks)
- **Width / placement:** `Contained` (reading column) · `Wide` (full container) · `Full-bleed`
  (edge-to-edge viewport).
- **Aspect ratio:** MAST ships `16:9` · `4:3` · `1:1`. **Added** (custom `u-aspect-*` utilities,
  in Head Code `<style>`): `3:4` · `4:5` · `2:3` · `9:16` (portrait) and `3:2` (landscape photo).
  **Single** defaults to `16:9`; **Pair** defaults to a **portrait** ratio (`3:4`) — landscape
  pairs read squat; portrait pairs sit cohesively next to a full-width landscape single.
- **Caption:** NOT built into media blocks. It's a separate drop-in (§7 Caption block) added
  under a media block only when a specific image/video needs one.
- **Corner rounding:** media frames get a **subtle radius** (AREA17/ElevenLabs feel) — default a
  V+V radius token (~`--radius-l` 16px or `--radius-m` 8px, confirm exact). Rule: Contained/Wide
  = rounded; Full-bleed = square. Drive from one variable so it's globally tweakable.

### Video modes (which Vimeo island each wraps)
- **Ambient loop** — autoplay, muted, loops (moving texture) → `vimeo-player-advanced` (autoplay=true).
- **Click-to-play inline** — controls in place → `vimeo-player-basic` (simple) or `-advanced` (full timeline/mute/fullscreen).
- **Popup / lightbox** — poster thumbnail → fullscreen player → `vimeo-lightbox-advanced` (one overlay per page, many triggers).
- Vimeo ID supplied per instance via a component **text property** bound into the embed (dynamic-data embed, conventions §4b).

### The 4 base components
| Block | Source | Variants / props |
|---|---|---|
| **Media — Single** | Compose | content: Image / Vimeo-inline / Vimeo-lightbox · width: Contained/Wide/Full-bleed · ratio · caption. |
| **Media — Pair (two-up)** | Compose | split: 50/50 · 60/40 · 40/60; each side image or Vimeo w/ its own ratio; stacks on mobile; optional captions. |
| **Media — Text split** | Compose | media beside a **content bubble** (NOT plain text — a rounded card in the V+V **CTA palette**, Midnight/Cream via Theme **Invert** mode, NOT white). Variations (show/hide + combos): heading on/off · description-only · heading + description + **"+" CTA** (→ modal, parked) · media side left/right · media width 1/2·1/3·2/3 · image/video. Stacks on mobile. **Variant: Sticky-text / scrolling tall media** (AVEX/quip) — content bubble is `position: sticky` (`u-position-sticky`), pinned while a tall image scrolls past. Pure CSS. |

### ⭐ "Media + Content" family (cohesion decision)
**Media — Text split** and **Expanding Feature Pills** are ONE visual family: a media side + a
content bubble, with variations. They **share primitives** (the content bubble, the media frame
`media-single__frame`, the MAST 2-col layout, type) but are **separate components** — Feature
Pills carries its own Osmo JS + `feature-pills__*` structure for expand/sync, the text card has
no JS. Cohesion = both styled from the same primitives; the island is **re-skinned via CSS
values** (theming, not refactoring) to match the bubble/frame/type. Build the shared **content
bubble** primitive with Media — Text split; reuse/re-theme it onto Feature Pills later.
| **Media — Gallery** | Compose | 2 / 3 / 4 across; mixed ratios; responsive stack. |
> MAST's `u-aspect-*` + 12-col grid do the layout — composition, not new islands. Only new CSS
> needed: the 3:2 and 9:16 aspect utilities.

## 4. Interactive popups (Osmo appliances, V+V-skinned)
| Block | Source | Notes / modifications |
|---|---|---|
| **"Read More" content modal** | Osmo `basic-modal` | Mouthwash pattern: pill trigger "Read More +" → centered card (text + image) over blurred backdrop. Modal body = a **slot**. Restyle card to V+V; add the pill trigger. |
| **"See" video lightbox** | Osmo `vimeo-lightbox-advanced` | one overlay per page, many triggers; recolor to purple (global-css). |
| **"Hear" audio** | Osmo `audio-player-howler` | inline block or inside a modal; or V+V `voice-pill`. |
| (alt) inline tabs / sticky tabs | Osmo `tab-system-autoplay` / `sticky-section-tabs` | for multi-panel sections if a case study wants them. |
| **Expanding Feature Pills** | Osmo `expanding-feature-pills` | feature showcase: pills on one side, synced visual on the other. **Mod:** visual side supports **still image OR Vimeo** (ambient loop), index-matched per pill — swap the `<img>` in `feature-pills__visual-item` for a Vimeo player; no JS change. Perf: cap # of video visuals per instance. GSAP (global). |
| **Horizontal Scrolling Sections** | Osmo `horizontal-scrolling-sections` | section-level: panels scroll sideways while pinned; each panel holds media/text. **Constraint:** its parent (`page-main`) must NOT be `display:flex`/`overflow:hidden` (see osmo file). GSAP + ScrollTrigger (global). |

## 5. Navigation / structure
| Block | Source | Notes |
|---|---|---|
| **Table of Contents** | Osmo `table-of-contents` | long-form articles; reads the body's H2/H3. Optional per page (case studies may skip). |
| **Up Next / Related** | Compose | MAST cards + `play-video-on-hover` for video thumbnails (AREA17 "Up next"). |
| **Highlight-on-scroll heading** | Osmo `highlight-text-on-scroll` | optional editorial accent for big statements. |

## 6. Closers
| Block | Source | Notes |
|---|---|---|
| **CTA block** | MAST / New | "Let's explore how we can help" + button (AREA17 closer). |
| **Credits / scope columns** | MAST | multi-column lists (client, role, links). |

## 7. Editorial utility blocks (small, reusable)
| Block | Source | Notes |
|---|---|---|
| **Caption / credit line** | MAST | small muted text; pairs under any media block. |
| **Stat / Metric** | New | big number + label; cluster into a case-study **metrics strip** (AREA17/Halfdays-style). |
| **Multi-column scope list** | MAST | the "Brand / Experience / Technology" lists (AREA17). |
| **"Visit site ↗" link** | MAST | inline external link w/ arrow (ysl.com ↗). |
| **Divider / section break** | MAST | hairline rule (`--color-rule`) between sections. |

---

## Build order (locked)
1. **Media blocks** — Single → Single Video → Two-up → Text-split (incl. sticky-text variant) →
   Gallery. Backbone of the AREA17/Mouthwash feel; mostly MAST composition + the Vimeo islands.
2. **Article Header + Case Study Header** — top sections (author/categories/client/metrics/scope).
3. **Editorial utilities** — Caption, Stat/Metric, Multi-column scope list, Visit-site link,
   Divider, Pull quote.
4. **Up Next / Related cards** + **CTA / credits closers**.
5. **Rich interactive sections** — Expanding Feature Pills, Horizontal Scrolling Sections.
6. **Table of Contents** — wire once headers/body blocks exist (it reads them).
7. Optional accents: highlight-on-scroll, tabs, sticky tabs per page needs.

**MOCKUP SCOPE (Nick): build ALL islands as modules except multi-filter browse.** They can live
on insight / case-study / landing pages. Mockup batches:
- Phase 2 done: TOC, Vimeo player, Feature Pills, Horizontal Scroll.
- Batch A: Vimeo Lightbox (See), Audio/Howler (Hear), Basic Modal (Read More), Tab System,
  Sticky Tabs, Highlight-text-on-scroll.
- Batch B: Play-video-on-hover, Directional List Hover, Download Button, Tooltip, Magnetic
  Cursor, Interactive Globe (needs Nick's Mapbox token → wire ready, flag).
- EXCLUDED from mockup: Multi-filter (browse views, separate). WhatsApp modal = build if Nick
  wants a contact module; flagged niche.

## How each block stays "MAST-legal"
- Built inside MAST structure (`section`/`container`/`row`/`col`), styled with V+V variables,
  responsive at MAST's breakpoints (≤991 / ≤767).
- Osmo internals untouched; only the MAST wrapper + V+V recolor (global-css.css) applied.
- Each block = a Webflow Component with properties (text/image/link) + slots where content varies.
