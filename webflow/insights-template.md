# Webflow Build — Insights Template (Phase 1: scaffold + ToC island)

Manual build spec for the Insights page. Phase 1 = page scaffold (MAST structure), the
editorial hero, the two-column reading layout, and the Osmo Table-of-Contents island wired in.
Per-section media pills (See/Read/Hear islands) and the rest of the article components come in
a later phase.

**Packaging (per conventions §4b):** the **Hero is a Webflow Component** with text properties;
the **reading body is a Component with a slot** so each post composes its own sections inside it.
The ToC sidebar + layout is a Component too (the "Insights Layout" shell). This is what makes
the page reusable without CMS — a new post = drop the shell, fill the hero props, fill the body
slot.

Decisions applied: reading column = **Col Medium (832px)**; ToC reconciliation = **take the
Osmo sidebar + JS, MAST/V+V owns the layout + reading column** (we do NOT use Osmo's
`.toc-layout`/`.toc-article` reading styles); active link via `[data-toc-status="active"]`
(island contract), authored nav uses `aria-current`.

---

## DOM structure (MAST scaffold + ToC island)

```html
page-wrapper                                    (Theme: Base mode)
  nav  …MAST global nav, V+V-skinned…
  page-main  (<main>)                           ← must NOT be display:flex / overflow:hidden
    section                                      (MAST section padding)
      container                                  (max Col Wide 1152 — room for 2 cols)

        <!-- ToC island wrapper: wraps BOTH the sidebar nav and the content -->
        <div data-toc-wrap data-toc-levels="h2,h3" data-toc-offset="96" class="insights-layout">

          <aside class="toc-sidebar">           ← Osmo island classes (kept)
            <p class="toc-hero__label">On this page</p>
            <nav data-toc-list class="toc-list">
              <!-- single template link, cloned per heading then removed -->
              <a data-toc-link data-toc-item href="#" class="toc-link">
                <span data-toc-text></span>
              </a>
            </nav>
          </aside>

          <div class="insights-column">          ← MAST/V+V owns this column (max Col Medium)

            <header class="article-hero">        ← NOT inside [data-toc-content], so it's not scanned
              <p class="article-hero__eyebrow">Thought Leadership</p>
              <h1 class="article-hero__headline">Headline goes here</h1>
              <p class="article-hero__deck">Standfirst / deck sentence.</p>
              <p class="article-hero__byline">By <em>Author Name</em><span class="article-hero__byline-divider"> · Role</span></p>
            </header>

            <div data-toc-content class="insights-body">   ← TOC scans this for h2/h3
              <section class="insights-section">
                <h2>Section heading</h2>
                <p>Body paragraph…</p>
                <p>Body paragraph…</p>
                <!-- [media-pill island slot — Phase 2] -->
              </section>
              <section class="insights-section">
                <h2>Next section</h2>
                <h3>Sub-section</h3>
                <p>…</p>
              </section>
              <!-- {skip} in a heading or [data-toc-ignore] omits it from the ToC -->
            </div>

          </div>
        </div>

      <!-- /container -->
    <!-- /section -->
  footer  …section cc-footer…
```

Notes:
- `[data-toc-wrap]` sits on `.insights-layout` (the grid), wrapping sidebar + column — required
  by the island JS.
- `[data-toc-content]` is the body div (a plain div with hand-built `<section>`s, so we can drop
  per-section media pills in Phase 2; the island scans descendants for `h2,h3`, nesting is fine).
- `data-toc-offset="96"` clears a sticky nav ~96px tall — tune to the actual V+V nav height.
- Hero `<h1>` lives outside `[data-toc-content]` so it never lands in the ToC.

---

## Component packaging (build these as Webflow Components)

Three components for Phase 1. Build them as static blocks first, confirm the ToC works, THEN
"Create Component" and add properties — easier to wire properties once the structure is final.

**1. `C/ Insights Hero`** — wraps `header.article-hero`. Properties:
| Property | Type | Bound to |
|---|---|---|
| Eyebrow | Text | `.article-hero__eyebrow` text |
| Headline | Text | `.article-hero__headline` text |
| Deck | Text | `.article-hero__deck` text |
| Author | Text | `.article-hero__byline em` text |
| Role | Text | `.article-hero__byline-divider` text |
| Show deck / Show byline | Visibility (optional) | deck / byline elements |

**2. `C/ Insights Body`** — wraps `div.insights-body[data-toc-content]`. Expose its inner area
as a **Slot** so each post drops in its own `section.insights-section` blocks (and, Phase 2,
media-pill components). The `[data-toc-content]` attribute stays on the component root so the
ToC island scans whatever the slot contains.

**3. `C/ Insights Layout`** (optional shell) — wraps `div.insights-layout[data-toc-wrap]`
including the ToC sidebar + the two slots above. Lets a new post start from one drop-in. The
`data-toc-*` attributes live on this component root.

Notes:
- Put `[data-toc-wrap]`/`[data-toc-content]` **on the component roots**, not on slotted content,
  so the island contract survives re-composition.
- The ToC sidebar's single `a.toc-link[data-toc-link]` template stays inside the component as-is
  (the JS clones it) — no property needed.
- Phase 2 media-pill islands become their own components (See/Hear/Read) dropped into the body slot.

## Component CSS (per-component Custom Code embed for this template)

Brand tints / hero-display / ToC-active rules already live in `global-css.css`. This block is
the Insights *layout* + the V+V recolor of the Osmo sidebar classes.

```css
/* Two-column layout (MAST owns this; replaces Osmo's .toc-layout) */
.insights-layout {
  display: grid;
  grid-template-columns: 14rem 1fr;
  gap: 3rem;                      /* Space 7 */
  align-items: start;
  position: relative;
}
@media screen and (max-width: 991px) {        /* snap point */
  .insights-layout { grid-template-columns: 1fr; gap: 1.5rem; }
}

.insights-column { min-width: 0; max-width: 52rem; }   /* Col Medium 832px */

/* Hero */
.article-hero { margin-bottom: 6rem; }                 /* Space 9 */
.article-hero__eyebrow {
  font-weight: 500; font-size: 0.6875rem; line-height: 1.25;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--color-text-muted); margin-bottom: 1rem;
}
/* .article-hero__headline (serif-display exception) is styled in global-css.css */
.article-hero__deck {
  font-size: 1.25rem; line-height: 1.55; color: var(--color-text-muted);
  max-width: 55ch; margin: 1.5rem 0 1.5rem;
}
.article-hero__byline {
  font-family: var(--font-serif, 'Victor Serif', serif);
  font-style: italic; font-weight: 300; font-size: 1.25rem; color: var(--midnight);
}
.article-hero__byline em { font-family: var(--font-serif, 'Victor Serif', serif); font-style: italic; }
.article-hero__byline-divider {
  font-family: var(--font-sans, 'Neue Haas Display', sans-serif);
  font-style: normal; font-size: 0.8125rem; color: var(--color-text-muted);
}

/* Reading body */
.insights-body { display: flex; flex-direction: column; gap: 6rem; }   /* Space 9 between sections */
.insights-section { position: relative; scroll-margin-top: 1.5rem; }
.insights-section h2 {
  font-weight: 300; font-size: var(--size-h2); line-height: 1.1;
  letter-spacing: -0.015em; margin-bottom: 1.5rem; max-width: 22ch;
}
.insights-section h3 {
  font-weight: 400; font-size: var(--size-h3); line-height: 1.25;
  letter-spacing: -0.015em; margin: 2.5rem 0 0.75rem;
}
.insights-section p {
  font-weight: 400; font-size: 1.0625rem; line-height: 1.55;
  color: var(--midnight); max-width: 60ch; margin-bottom: 1.5rem;
}

/* ToC sidebar — Osmo island classes, recolored to V+V (theming, not refactor) */
.toc-sidebar { position: sticky; top: 1.5rem; align-self: start; width: 14rem;
  display: flex; flex-direction: column; gap: 1rem; }
.toc-hero__label {
  font-weight: 500; font-size: 0.6875rem; line-height: 1.25;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted);
}
.toc-list { display: flex; flex-direction: column; width: 100%;
  border-left: 1px solid var(--color-rule); }
.toc-link {
  display: block; padding: 0.4rem 0.5rem 0.4rem 1rem; margin-left: -1px;
  font-size: 0.9375rem; color: var(--color-text-muted); text-decoration: none;
  border-left: 1px solid transparent; transition: color .25s, border-color .25s;
}
.toc-link:hover { color: var(--midnight); }
/* active rule (.toc-link[data-toc-status="active"]) is in global-css.css */
@media screen and (max-width: 991px) {
  .toc-sidebar { position: relative; top: 0; width: 100%; }
}
```

---

## Scripts (per conventions.md §5)
- Global footer load (once): GSAP 3.15 + ScrollTrigger. (SplitText/Flip only if those islands
  appear on the page.)
- TOC island init: paste `initTableOfContents()` (from `osmo/table-of-contents.md`) into the
  page's Before-`</body>` or a component JS embed. It self-runs on DOMContentLoaded; if injected
  late, wrap with the readyState guard from conventions.md §5.

## Designer build steps
1. Create `page-wrapper` → set Theme = Base. Add `nav`, `page-main` (set tag `<main>`), `footer`.
2. Inside `page-main`: `section` → `container`.
3. Add a Div `insights-layout` inside container; add attributes `data-toc-wrap`,
   `data-toc-levels="h2,h3"`, `data-toc-offset="96"`.
4. Inside: `aside.toc-sidebar` (sticky) with the eyebrow + `nav[data-toc-list]` holding ONE
   `a.toc-link[data-toc-link][data-toc-item]` containing `span[data-toc-text]`.
5. Sibling `div.insights-column`: add `header.article-hero` (eyebrow/h1/deck/byline), then
   `div.insights-body[data-toc-content]` containing `section.insights-section` blocks with h2/h3 + p.
6. Paste the component CSS into this template's embed; confirm `global-css.css` is in the
   Global Canvas CSS component.
7. Publish/preview: ToC auto-generates from the h2/h3 in `insights-body`, active link tracks on
   scroll, click scrolls with the 96px offset.
8. **Once verified, convert to Components** (see "Component packaging" above): select
   `header.article-hero` → Create Component → add the 5 text properties; select `insights-body`
   → Create Component → make its inner region a Slot; optionally wrap the whole layout as
   `C/ Insights Layout`. Test by dropping a second instance and editing only its props.

## Phase 2 (next, after review)
Per-section media pills (See→vimeo-lightbox-advanced, Read→basic-modal, Hear→audio-player-howler
or `.voice-pill`), pull quotes, CTA block, and any inline islands (highlight-text, etc.).
