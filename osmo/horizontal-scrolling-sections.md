# Osmo Island — Horizontal Scrolling Sections

Source: https://www.osmo.supply/resource/horizontal-scrolling-sections
**Island rule:** keep `horizontal__*` + `data-horizontal-scroll-*`. Don't touch JS.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
```
GSAP 3.15 + ScrollTrigger (uses `gsap.matchMedia`).

## CONSTRAINT (important)
The parent of `[data-horizontal-scroll-wrap]` must NOT use `display: flex` or `overflow: hidden` — it breaks the pin. For most setups that's `<body>`/`<main>`. **Conflicts with MAST:** MAST's `page-main`/`section` nesting may apply overflow/flex — verify the direct parent at build.

## Attribute contract
- `[data-horizontal-scroll-wrap]` on the section (pinned). `[data-horizontal-scroll-panel]` on each child (≥2 required; `flex: none`).
- Optional `[data-horizontal-scroll-disable]`: `"mobile"` (<480), `"mobileLandscape"` (<768), `"tablet"` (<992).

## HTML
```html
<section class="horizontal__wrap" data-horizontal-scroll-wrap data-horizontal-scroll-disable="mobileLandscape">
  <div data-horizontal-scroll-panel class="horizontal__panel">
    <div class="horizontal__panel-inner">
      <div class="demo-card">
        <div class="demo-card__bg"><img src="...avif" class="demo-card__bg-img"></div>
        <div class="demo-card__inner"><h2 class="demo-header__h1">Dolomites</h2></div>
      </div>
    </div>
  </div>
  <!-- repeat panels (Patagonia, Yosemite, Pyrenees) -->
</section>
```

## CSS
```css
.demo-header__h1 { letter-spacing: -.04em; margin-top: 0; margin-bottom: 0; font-size: 4em; font-weight: 500; line-height: .95; }
.horizontal__wrap { flex-flow: row; min-height: 100dvh; display: flex; overflow: hidden; }
.horizontal__panel { flex: none; width: 100%; }
.horizontal__panel-inner { width: 100%; height: 100%; padding: 1.25em; }
.demo-card { border-radius: 1.25em; flex-flow: column; justify-content: flex-end; align-items: flex-start; width: 100%; height: 100%; padding: 3em; display: flex; position: relative; overflow: hidden; }
.demo-card__bg { z-index: 0; position: absolute; inset: 0%; }
.demo-card__inner { z-index: 1; position: relative; }
.demo-card__bg-img { object-fit: cover; width: 100%; height: 100%; }
@media screen and (max-width: 767px) {
  .demo-header__h1 { font-size: 2.5em; }
  .horizontal__wrap { flex-flow: column; }
  .horizontal__panel { height: 30em; }
  .demo-card { padding: 1.25em; }
}
```

## JavaScript
```js
function initHorizontalScrolling() {
  const mm = gsap.matchMedia();
  mm.add(
    { isMobile: "(max-width:479px)", isMobileLandscape: "(max-width:767px)", isTablet: "(max-width:991px)", isDesktop: "(min-width:992px)" },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions;
      const ctx = gsap.context(() => {
        const wrappers = document.querySelectorAll("[data-horizontal-scroll-wrap]");
        if (!wrappers.length) return;
        wrappers.forEach((wrap) => {
          const disable = wrap.getAttribute("data-horizontal-scroll-disable");
          if ((disable === "mobile" && isMobile) || (disable === "mobileLandscape" && isMobileLandscape) || (disable === "tablet" && isTablet)) return;
          const panels = gsap.utils.toArray("[data-horizontal-scroll-panel]", wrap);
          if (panels.length < 2) return;
          gsap.to(panels, {
            x: () => -(wrap.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top top", end: () => "+=" + (wrap.scrollWidth - window.innerWidth), scrub: true, pin: true, invalidateOnRefresh: true },
          });
        });
      });
      return () => ctx.revert();
    }
  );
}

document.addEventListener("DOMContentLoaded", () => { initHorizontalScrolling(); });
```
Nested ScrollTriggers inside the wrapper must use GSAP `containerAnimation` tied to the horizontal tween (see Osmo docs).
