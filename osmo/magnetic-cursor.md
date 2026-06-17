# Osmo Island — Magnetic Cursor

Source: https://www.osmo.supply/resource/magnetic-cursor
**Island rule:** keep `cursor`/`magnetic-link__*` + `data-magnetic-cursor-*`. Don't touch JS.
**New dependency:** GSAP **Flip** plugin — first island to need it. If used site-wide, add Flip to the global GSAP load.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/Flip.min.js"></script>
```
Calls `gsap.registerPlugin(Flip)` inside init.

## Attribute contract
- Global follower: `.cursor` > `.cursor-bg` (one per page).
- Targets: `[data-magnetic-cursor-target]`; inside each, a `[data-magnetic-cursor-bg]` drop-zone where `.cursor-bg` is Flip-animated on hover.

## HTML
```html
<div class="cursor"><div class="cursor-bg"></div></div>
<a data-magnetic-cursor-target href="#" class="magnetic-link">
  <div class="magnetic-link__inner">
    <span class="magnetic-link__label">Here's a link</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 14 32" fill="none" class="magnetic-link__icon"><path d="M3 24L11 16L3 8" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"></path></svg>
  </div>
  <div data-magnetic-cursor-bg class="magnetic-link__bg"></div>
</a>
```

## CSS
```css
.magnetic-link { color: inherit; padding: .5em .875em; text-decoration: none; position: relative; }
.magnetic-link__inner { z-index: 1; grid-column-gap: .35em; grid-row-gap: .35em; justify-content: center; align-items: center; display: flex; position: relative; }
.magnetic-link__icon { justify-content: center; align-items: center; width: .4em; margin-bottom: -.125em; display: flex; }
.magnetic-link__bg { z-index: 0; border-radius: .25em; position: absolute; inset: 0%; }
.cursor { aspect-ratio: 1; border-radius: 100em; width: .75em; position: fixed; inset: 0% auto auto 0%; }
.cursor-bg { border-radius: inherit; background-color: #fff; width: 100%; height: 100%; }
.magnetic-link .cursor-bg { opacity: 0.1; }
```

## JavaScript
```js
function initMagneticCursor() {
  gsap.registerPlugin(Flip);
  const cursor = document.querySelector(".cursor");
  if(!cursor) return;
  const cursorBg = cursor.querySelector(".cursor-bg");
  gsap.set(".cursor", {xPercent:-50, yPercent: -50});
  let xTo = gsap.quickTo(".cursor", "x", {duration: 0.6, ease: "power3"});
  let yTo = gsap.quickTo(".cursor", "y", {duration: 0.6, ease: "power3"});
  window.addEventListener("mousemove", e => { xTo(e.clientX); yTo(e.clientY); });
  const hoverTargets = document.querySelectorAll("[data-magnetic-cursor-target]");
  if(!hoverTargets.length) return;
  hoverTargets.forEach((target) => {
    const bgHolder = target.querySelector("[data-magnetic-cursor-bg]");
    target.addEventListener("mouseenter", () =>{
      const state = Flip.getState(cursorBg);
      bgHolder.appendChild(cursorBg);
      Flip.from(state,{ ease:"back.out(1)", duration: 0.3 });
    });
    target.addEventListener("mouseleave", () =>{
      const state = Flip.getState(cursorBg,{ props:"opacity" });
      cursor.appendChild(cursorBg);
      Flip.from(state,{ ease:"power4.out", duration: 0.5 });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => { initMagneticCursor(); });
```
