# Translation → Webflow: Horizontal Scrolling Sections (#18)

A part-native, part-script "island." Target render: `webflow-parity/sandbox-horizontal.html`
(serve at `http://localhost:8765/webflow-parity/sandbox-horizontal.html` and scroll). Build on
the playground page.

**Two pieces:** (A) a native Webflow **frame** with `data-` attributes, (B) a **code embed**
that runs the GSAP scroll + connects to his Lenis. You drop `image-cs-txt-grid` (image) /
`video-cs-article` (video) into each slot.

> **Lenis:** his site already runs Lenis (smooth scroll) + GSAP. The embed below adds
> ScrollTrigger and *hooks into his existing Lenis* — it does **not** create a second Lenis or
> raf loop (that would double-drive the scroll). If the scroll is jittery, the hook didn't
> reach his Lenis → ask him to add `window.lenis = lenis;` to his Lenis init (one line).

---

## Phase A — The frame (native Webflow)

### A1. The wrap (pinned, sideways row)
> **CRITICAL — wrap it in a plain block Div first.** The pinned section must NOT be a direct
> child of the flex `page-wrap`. ScrollTrigger's pin-spacer (which reserves the scroll
> distance) becomes a flex item there and the flex layout zeroes its reserved height → the
> next section overlaps the pinned panels. So: add a **Div Block** inside `page-wrap` (call it
> `h-scroll-block`, no styling needed — it stretches on its own), and build the section
> *inside* it. *(Already built it? Select the section → right-click → **Wrap in Div**.)*

1. Inside that block div, add a **Section** → new class **`horizontal__wrap`**:
   - Layout → Display **Flex**, Direction **Horizontal**, Align **Center** (Y/cross), Gap **`1.5rem`**
   - Size → Min height **`100vh`**, Overflow **Hidden**
   - Spacing → Padding **`2.5rem`** left **and** right *(edge gutters live here — NOT on panels,
     or slides end up different heights)*
2. Settings tab → **Custom attributes** → add two:
   - `data-horizontal-scroll-wrap` = (leave value blank or `true`)
   - `data-horizontal-scroll-disable` = `mobileLandscape`

### A2. A panel (the sized slot) — repeat per slide
3. Inside the wrap, add a **Div Block** → new class **`horizontal__panel`**:
   - Flex child → **Don't grow, Don't shrink**
   - Size → Width **`60vw`**, **Max width `40rem`** *(Webflow can't type `min()`; width + max-width
     does the same)*
   - Settings → Custom attribute: `data-horizontal-scroll-panel` = (blank)

### A3. The slide (the relative box that holds media + future label)
4. Inside the panel, add a **Div Block** → new class **`h-slide`**:
   - Position → **Relative**; Size → Overflow **Hidden**
   - Size → Width **100%**, **Ratio `4:3`** *(the aspect-ratio control)*
   - Border → Radius **`1.25rem`**; Background → Color **silver-to-navy** *(shows while media loads)*

### A4. Duplicate
5. Select `horizontal__panel` → copy/paste to make **4–6 panels** (need ≥2 for the script to run).

## Phase B — Drop in media
6. Into each `.h-slide`, add your media so it **fills** the slot:
   - **Image** → an Image element → class **`image-cs-txt-grid`** (fills 100%/100%, cover).
   - **Video** → his video block → class **`video-cs-article`** (fills 100%/100%, cover) — reuses
     his page-level video embed automatically.
   *(Both already do `width:100% height:100% object-fit:cover`, so they fill the aspect-ratio slot.)*

## Phase C — The script (the "functionality")
7. Page **Settings → Custom code → Before `</body>`** (or an **Embed** at the page bottom), paste:

```html
<!-- ScrollTrigger (his page already loads GSAP + Lenis) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
(function () {
  function init() {
    if (!window.gsap || !window.ScrollTrigger) return setTimeout(init, 50);
    gsap.registerPlugin(ScrollTrigger);

    // Connect ScrollTrigger to his EXISTING Lenis (keeps pin + scrub smooth).
    // Do NOT create a Lenis or a raf loop here — his page already runs both.
    (function hook(tries) {
      var l = window.lenis;
      if (!l) { try { l = lenis; } catch (e) { l = null; } }
      if (l && typeof l.on === "function") { l.on("scroll", ScrollTrigger.update); return; }
      if (tries > 0) setTimeout(function () { hook(tries - 1); }, 100);
    })(30);

    var mm = gsap.matchMedia();
    mm.add({ isMobile: "(max-width:479px)", isMobileLandscape: "(max-width:767px)", isTablet: "(max-width:991px)", isDesktop: "(min-width:992px)" }, function (ctx) {
      var c = ctx.conditions;
      var g = gsap.context(function () {
        document.querySelectorAll("[data-horizontal-scroll-wrap]").forEach(function (wrap) {
          var d = wrap.getAttribute("data-horizontal-scroll-disable");
          if ((d === "mobile" && c.isMobile) || (d === "mobileLandscape" && c.isMobileLandscape) || (d === "tablet" && c.isTablet)) return;
          var panels = gsap.utils.toArray("[data-horizontal-scroll-panel]", wrap);
          if (panels.length < 2) return;
          gsap.to(panels, { x: function () { return -(wrap.scrollWidth - window.innerWidth); }, ease: "none", scrollTrigger: { trigger: wrap, start: "top top", end: function () { return "+=" + (wrap.scrollWidth - window.innerWidth); }, scrub: true, pin: true, invalidateOnRefresh: true } });
        });
      });
      return function () { g.revert(); };
    });
  }
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
})();
</script>
```

> This won't animate inside the Webflow **Designer** (no GSAP there) — **publish to staging**
> to test, then scroll.

## Phase D — Responsive (≤767 stacks vertically)
The script already disables itself at ≤767 (the `data-horizontal-scroll-disable` value). Make
the CSS stack to match — at the **Mobile Landscape (≤767)** breakpoint, on `horizontal__wrap`:
Direction **Vertical**, Min height **Auto**, Overflow **Visible**; and `horizontal__panel`
Width **100%**. (Gap + slides carry over.)

---

## Friction Log
| Step | What was confusing | Fix / clarification |
|---|---|---|
| A1 | Edge gutters via panel padding made the last/first slide a different height. | `aspect-ratio` ties height to width, so padding (which narrows the content box) shrinks height. Put edge gutters on the **wrap** (padding) + **gap**; panels stay uniform width → uniform height. |
| A1 | On staging the section pinned but kept **vertically scrolling** — the CTA above + footer below **overlapped** the panels and it got cut off. | The pinned section was a **direct child of the flex `page-wrap`**. ScrollTrigger's pin-spacer becomes a flex item → its reserved scroll height collapses → siblings overlap. **Fix:** wrap the section in a plain **block Div** (`h-scroll-block`). Confirmed in sandbox: flex parent → `overlapping: true`; block wrapper → `overlapping: false`. *Ruled out first: Lenis driving (separate raf vs gsap.ticker) and body `overflow-x: hidden` — neither broke the pin.* |
| C | Which field? Page settings "Before </body>" was empty + several `</>` embeds in the Navigator. | Use **Page Settings → Custom Code → "Before </body> tag"** (the page-level field). NOT the Navigator embeds (those are component-specific). The field is empty because GSAP/Lenis/jQuery load **site-wide** (Project Settings → Footer) — which is why our script can still find his Lenis. |
| C | Nothing moves in the Designer. | GSAP doesn't run in the Designer canvas — **publish to staging** and scroll there. |
| C | Scroll is jittery. | The Lenis hook didn't reach his instance → dev adds `window.lenis = lenis;` to his Lenis init (one line). |
