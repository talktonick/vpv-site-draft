# Conventions — MAST + Osmo Reconciliation Rules

Governs the manual Webflow rebuild of the Insights template. Read alongside
`design-system.md`. The build is a reusable component library (no CMS): each post is
assembled on a fresh page by dropping in components.

Sources: MAST docs (https://www.nocodesupply.co/mast/docs), the 12 Osmo resource pages
listed at the end. Note: the `/osmo` folder referenced in the brief does **not exist** on
this machine — these rules are derived from the live Osmo resource pages, not local copies.
When the actual component code is available, re-verify the class names / data-attribute
contracts below.

---

## 0. The governing rule

> **MAST owns structure and naming. Osmo components enter as self-contained islands.**

- **MAST-land** = page scaffold, sections, grid, spacing, typography, color, global nav/
  footer, and every *container* you build by hand. Use MAST classes and nomenclature.
- **Osmo island** = a vendored block (its own wrapper class, internal classes, data
  attributes, and JS). **Do not refactor an island's internal classes or JS.** You only
  MAST-ify the *container around* it.

Everything below is the operational detail of that one rule.

---

## 1. Naming systems side by side

| | MAST | V+V existing site | Osmo islands |
|---|---|---|---|
| Base/structural | `section`, `container`, `row`, `col`, `btn` | n/a (custom CSS) | n/a |
| Utility | `u-` (`u-mb-md`, `u-text-center`, `u-bg-white`) | token vars | n/a |
| Combo/variant | `cc-` (`cc-narrow`, `cc-footer`) | `block--modifier` | `block--mod` (internal) |
| Custom component | `blog-card`, `footer-social_link` (`-` within level, `_` between levels) | `block__element` BEM | `toc-*`, `feature-pills__*`, `vimeo-player__*` etc. |
| Breakpoint | infix `-lg- -md- -sm- -xs-` | media queries | n/a |
| Variables | Title Case w/ spaces (Theme, Typography…) | `--kebab-prefixed` | mostly none; a few `--custom-props` |

**Rule:** New containers and layout you author → MAST nomenclature. Don't rename anything
inside an Osmo island to match MAST. The island keeps its `toc-*` / `__` / `--` classes.

---

## 2. Foundation: how V+V tokens become MAST/Webflow variables

MAST tokens live in five Webflow Variable collections: **Theme, Typography, Components,
Layout, Color**. Map the V+V design system onto them:

- **Color collection** — author the 6 brand hexes (`Purple #3012E4`, White, Cream, Silver,
  Navy, Midnight). MAST's default demo palette (`#d14424` primary etc.) gets **replaced**
  with V+V values, not extended.
- **Theme collection** — Base mode: bg = Cream, text = Midnight, accent = Purple, border =
  midnight @ 8%. Invert mode: bg = Midnight, text = Cream. Apply at `page-wrapper`.
- **Typography collection** — replace MAST's General Sans defaults with Neue Haas Display
  (body/headings) + Victor Serif (serif role). Reproduce the 10-step scale (§Typography in
  design-system.md). MAST uses fluid `clamp()`; V+V uses fixed rem — decide per §6.
- **Layout collection** — set grid gap and fluid spacing to the 4px scale (`--s-*`).
- **Components collection** — section/container padding from `--s-*`; button radius =
  `--radius-pill`; card radius `--radius-l`.

### The `color-mix` problem (flag)
V+V's muted/subtle/rule colors are `color-mix(in oklab, midnight N%, transparent)`. Webflow
Variables can't author `color-mix`. Two options:
1. **Pre-compute** flat rgba equivalents and store as Variables (loses the oklab nuance).
2. Keep them as **Global CSS** custom properties in MAST's *Global Canvas CSS* embed and
   reference them in component CSS embeds (preserves exact values, but they live outside the
   Variables panel so non-devs can't see them in the Designer).

**RESOLVED (Nick):** option 2 — keep all the color-mix tints (`--color-text-muted`,
`-subtle`, `--color-rule`, `-strong`) as exact custom properties in the Global Canvas CSS
embed. They preserve the oklab nuance and are dev-controlled (not in the Variables panel).
See `webflow/global-css.css`.

---

## 3. The Insights page scaffold (MAST structure)

```
page-wrapper
  nav                              (MAST global nav, V+V-skinned)
  page-main  (<main>)
    section
      container  (cc-narrow or custom → ~col-medium 832px reading width)
        row
          col   (ToC col — desktop only)            → [Osmo ToC island]
          col   (article column)
            article-hero            (custom block, MAST nomenclature)
            rich-text / sections    (MAST `rich-text` or custom `article-section`)
              ↳ [Osmo islands dropped in here: vimeo player, audio, modal trigger, etc.]
  footer                           (section cc-footer)
```

- Reading column width comes from V+V `--col-medium` (832px), not MAST's default container
  max-width — set via a `cc-` combo or custom container class.
- Section vertical rhythm: MAST `section` padding, V+V `--s-9/--s-10` between sections.
- Hero headline is the **serif-display exception** — needs a custom class with the Victor
  Serif display role, since MAST `h1` won't carry that.

---

## 4. Osmo island integration protocol

For every island:
1. **Wrap it** in a MAST `col` / `container` / custom block. Style the wrapper (spacing,
   max-width, bg) with MAST classes only.
2. **Paste the island's HTML verbatim** (its wrapper class + children) inside that wrapper.
   Do not rename its classes.
3. **Island CSS** goes in a per-component Custom Code embed (so it renders in canvas), or
   the Global CSS embed if shared. Keep it namespaced under the island's own classes.
4. **Island JS** — see §5 loading strategy. Honor the island's data-attribute contract;
   don't rewire it.
5. **Island custom properties** (e.g. Vimeo `--timeline-*`, sticky-tabs `--nav-height`) →
   set them on the island wrapper, optionally feeding V+V brand values in (e.g. set Vimeo's
   `--timeline-dot-color` / `--progress-fill-bg` to `--purple` instead of Osmo's `#FF4C24`).
   This is *theming via the island's own API*, not refactoring — allowed.

### `.active` vs `aria-current` (a real conflict — resolved)
V+V's system rule is `aria-current="true"`, never `.active`. The Osmo **Tab System** and
**Vimeo** islands use `.active` / state data-attributes internally.
**Resolution under the island rule:** leave the island's internal `.active` alone — it's
island-private. Only *your* hand-built MAST elements (nav, ToC links you author, breadcrumb)
use `aria-current`. If you use the Osmo ToC island, its active state is driven by
`[data-toc-status]`, not `.active` or `aria-current` — accept the island's contract rather
than forcing the V+V convention onto it.

---

## 4b. Packaging — Webflow Components + dynamic-data embeds

Recurring, post-to-post pieces are built as **real Webflow Components** (properties / slots /
variants), not static class blocks you hand-edit each time. One-off page chrome stays as plain
MAST structure. This is what makes a *no-CMS* library genuinely reusable.

Rules:
- Expose editable text/image/link/visibility as **component properties**; expose composable
  regions as **slots** (e.g. the article body, so each post composes its own sections).
- **Osmo islands → components:** wrap the island's HTML markup in a Component and expose its
  authoring-relevant **data-attributes as text properties**, bound into the embed via **dynamic
  data in custom code embeds**. The island's `init*()` JS stays in the global/footer load
  (embeds don't execute JS in the canvas), so one global init serves every instance.
- Only expose the authoring-relevant attributes (video ID, audio src, offset…), never the
  island's internal structure. Internal classes/JS stay untouched (island rule §4 still holds).
- Component CSS → the component's own CSS embed (renders in canvas); shared CSS → Global Canvas CSS.

Island → Component property map (Phase 1 + 2 targets):
| Component | Exposed properties (→ bound to) | Body |
|---|---|---|
| Hero | Eyebrow, Headline, Deck, Author, Role (text) | — |
| Insights Body | — | **slot** (sections/media composed per post) |
| See (Vimeo lightbox trigger) | Vimeo ID → `data-vimeo-lightbox-id`; Poster (image) | — |
| Hear (Howler) | Audio URL → `data-howler-src`; Title, Cover (image) | — |
| Read (basic modal) | Modal name → `data-modal-name`/`-target` | **slot** (modal body) |
| CTA block | Heading, Button label, Button link, Variant | — |

The single Vimeo-lightbox / modal-group *overlay* containers stay one-per-page (page-level),
not per-instance — only the **triggers** are components.

**Verify on your Webflow plan:** component property count limits, which property types are
available, and that dynamic-data-in-embeds supports **component properties** on static
(non-CMS) pages (not just CMS Collection fields). DevLink (React export) is out of scope.

## 5. JavaScript dependencies & site-wide loading

### Per-component dependency matrix
| Osmo component | External libs | GSAP plugins | CSS vars | Data-attr driven |
|---|---|---|---|---|
| Table of Contents | GSAP + **ScrollTrigger** | ScrollTrigger | — | `data-toc-*` |
| Interactive Globe | **Mapbox GL JS v3.20.0** (+ token) | — | `--globe-info-width` | `data-globe-*` |
| Expanding Feature Pills | GSAP core | — | `--content-item-expanded` | `data-feature-pills-*` |
| Horizontal Scrolling | GSAP + **ScrollTrigger** | ScrollTrigger (matchMedia) | — | `data-horizontal-scroll-*` |
| Highlight Text on Scroll | GSAP + **ScrollTrigger** + **SplitText** | ScrollTrigger, SplitText | — | `data-highlight-*` |
| Vimeo Lightbox (advanced) | **Vimeo Player SDK** | — | `--timeline-*` `--progress-*` | `data-vimeo-lightbox-*` |
| Audio Player | **Howler.js v2.2.4** | — | — | `data-howler-*` |
| Sticky Section Tabs | **none (pure CSS)** | — | `--nav-height` | none |
| Basic Modal | **none (vanilla JS)** | — | — | `data-modal-*` |
| Tab System + Autoplay | GSAP core | — | — | `data-tabs-*` |
| Vimeo Player (basic) | **Vimeo Player SDK** | — | — | `data-vimeo-*` |
| Vimeo Player (advanced) | **Vimeo Player SDK** | — | `--timeline-*` `--progress-*` | `data-vimeo-*` |

**Lenis:** none of these *require* Lenis. The Osmo ToC optionally integrates with Lenis if
present. Add Lenis only if you want site-wide smooth scroll — it is not a dependency.

### GSAP version (confirmed from captured source)
All GSAP-based islands now pin the **same version: GSAP 3.15** (ToC, Feature Pills,
Horizontal Scroll, Highlight Text — Tab System TBD). GSAP registers a single `window.gsap`,
so still **load ONE GSAP 3.15 site-wide** plus the plugins any island needs
(`ScrollTrigger`, `SplitText`); never let an island ship its own `<script src=gsap>` tag.
Note: Highlight Text calls `gsap.registerPlugin(ScrollTrigger, SplitText)` itself — fine as
long as both plugins are loaded globally before it runs.

### Site-wide loading plan (Webflow)
Put shared libraries in **Project Settings → Custom Code → Footer (Before `</body>`)** (MAST
convention: load external libs before `</body>`):
```html
<!-- Load once, site-wide, in order -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/Flip.min.js"></script>  <!-- only if Magnetic Cursor is used -->
```
GSAP plugin needs by island: **ScrollTrigger** → TOC, Horizontal Scroll, Highlight Text;
**SplitText** → Highlight Text; **Flip** → Magnetic Cursor. (Feature Pills + Tab System =
GSAP core only.)

Load **page-scoped** (Page Settings → Before `</body>`) only where used:
- Vimeo SDK `https://player.vimeo.com/api/player.js` — Vimeo player/lightbox pages.
- Howler `https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js` — audio pages.
- Mapbox GL JS v3.20.0 (JS + its CSS `<link>`) + access token — globe pages only (heavy).
- kjua `https://cdn.jsdelivr.net/npm/kjua@0.10.0/dist/kjua.min.js` — WhatsApp modal only.

**No-JS / no-dep islands** (CSS only or vanilla): Sticky Section Tabs, Basic Modal, Multi
Filter, Directional List Hover, Download Button, Play Video on Hover, Tooltip — these need
nothing in the global load.

Each island's own `init*()` script goes in a **per-component Custom Code embed** (or
component JS hosted on a CDN per MAST's custom-code guidance), placed after the libs.

### Webflow DOMContentLoaded gotcha
Every Osmo island self-inits on `DOMContentLoaded`. If an island's script is injected late
(e.g. inside a Webflow component embed that renders after the event already fired), the
listener never runs. **Mitigation:** wrap each init so it runs immediately if the DOM is
already ready, e.g. `if (document.readyState !== 'loading') initX(); else
document.addEventListener('DOMContentLoaded', initX);`. Apply this without altering the
island's internal logic — it's a load-timing wrapper, not a refactor.

---

## 6. Foreseeable conflicts & resolutions

1. **Type scale: fixed rem (V+V) vs fluid clamp (MAST). — RESOLVED (phase 1: defer to MAST).**
   Nick's call: **keep MAST's default fluid sizing as-is for now** (don't retune sizes/clamp/
   line-heights). Only the **font** changes (Primary Font → Neue Haas) and, optionally, heading
   **weights** (→ 300 Light for the V+V look). Consequence: headings render larger than the
   existing V+V site (MAST H1 max 88px = V+V Display) and scale fluidly — evaluate live, retune
   maxes later if desired. V+V target sizes preserved in `variable-overwrite-checklist.md §3`
   for whenever we revisit. (MAST's clamp model already matches the hybrid-fluid approach we'd
   have built anyway, so deferring loses nothing.)

2. **Breakpoints: V+V's 1100/1000/800px vs MAST's 992/767/478. — RESOLVED.**
   Snap to Webflow native: article/ToC collapse at **Tablet ≤991**, 800px collapses at
   **Mobile Landscape ≤767**. No custom-code breakpoints.

3. **Naming collision (BEM `__` vs MAST `_`/`-`).**
   V+V existing CSS is `block__element`; MAST custom components use `-` within a level and
   `_` between levels. → For **new hand-built** V+V blocks in Webflow, adopt **MAST
   nomenclature** (this is a fresh build, MAST owns naming). Osmo islands keep their own.
   Don't port the old `__` classes verbatim.

4. **`color-mix` tints unsupported in Webflow Variables.** → §2 resolution.

5. **`.active` vs `aria-current`.** → §4 resolution (island-private `.active` allowed;
   authored elements use `aria-current`).

6. **Two Vimeo players (basic + advanced) share the `.vimeo-player` block.** Embedding both
   on one page collides classes/attrs. → **Pick one variant per page.**

7. **MAST default demo palette / fonts bleed-through.** MAST ships with its own colors
   (`#d14424`) and General Sans. → Overwrite all MAST color/type Variables with V+V values
   during foundation setup so no MAST default ships.

8. **Globe weight.** Mapbox GL JS is large and needs a token. → Page-scoped load only; never
   global. Likely not needed for Insights at all — confirm scope.

---

## 7. Build order (after foundation approval)

1. Foundation: Webflow Variables (Color/Theme/Typography/Layout/Components) from
   design-system.md + fonts uploaded + Global CSS embed for tint vars.
2. Page scaffold: `page-wrapper → nav → page-main → section/container/row/col → footer`.
3. Article shell: hero (serif-display exception), reading column, section rhythm.
4. ToC island (Osmo TOC) wired into the left col.
5. Media islands as needed per post: Vimeo player/lightbox, Howler audio, modal.
6. Remaining islands per content needs (sticky tabs, tabs+autoplay, feature pills,
   horizontal scroll, highlight-text, globe).

---

## Appendix — Osmo resource URLs
- TOC: https://www.osmo.supply/resource/table-of-contents-for-article
- Globe: https://www.osmo.supply/resource/interactive-globe-mapbox
- Feature pills: https://www.osmo.supply/resource/expanding-feature-pills
- Horizontal scroll: https://www.osmo.supply/resource/horizontal-scrolling-sections
- Highlight text: https://www.osmo.supply/resource/highlight-text-on-scroll
- Vimeo lightbox (adv): https://www.osmo.supply/resource/custom-vimeo-lightbox-advanced
- Audio (Howler): https://www.osmo.supply/resource/audio-player-howler
- Sticky tabs: https://www.osmo.supply/resource/sticky-section-tabs-css
- Basic modal: https://www.osmo.supply/resource/basic-modal-setup
- Tabs + autoplay: https://www.osmo.supply/resource/tab-system-with-autoplay-option
- Vimeo basic: https://www.osmo.supply/resource/custom-vimeo-player-basic
- Vimeo advanced: https://www.osmo.supply/resource/custom-vimeo-player-advanced
