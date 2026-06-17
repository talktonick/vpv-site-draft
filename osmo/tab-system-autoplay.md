# Osmo Island — Tab System with Autoplay Option

Source: https://www.osmo.supply/resource/tab-system-with-autoplay-option
**Island rule:** keep `tab-*`/`content-item__*` classes + `data-tabs` contract. Don't touch JS. Uses `.active` class internally (island-private — fine; authored elements still use `aria-current`).

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
```
GSAP 3.15 core only (no plugins).

## Attribute contract
- `[data-tabs="wrapper"]` root + `data-tabs-autoplay="true"` + `data-tabs-autoplay-duration="5000"` (ms).
- `[data-tabs="content-item"]` (the `<a role="tab">` nav links), `[data-tabs="item-details"]` (height-animated detail), `[data-tabs="item-progress"]` (scaleX progress bar), `[data-tabs="visual-item"]` (panels, index-matched). Active = `.active` class.

## HTML (abridged — 3 tabs)
```html
<div data-tabs-autoplay-duration="5000" data-tabs="wrapper" data-tabs-autoplay="true" class="tab-layout__wrap">
  <div class="tab-layout__col">
    <div class="tab-content__wrap"><div class="tab-content__inner">
      <div class="tab-content__top"><h1 class="tab-heading">Explore the perks of being a member</h1></div>
      <div role="tablist" class="tab-content__bottom">
        <a role="tab" data-tabs="content-item" href="#" class="tab-content__item">
          <div class="tab-content__item-main"><div class="content-item__nr"><div>01</div></div><h2 class="content-item__heading">Explore the vault</h2></div>
          <div data-tabs="item-details" class="tab-content__item-detail"><div class="tab-description__spacer"></div><p class="tab-description">…</p><div class="tab-description__spacer"></div></div>
          <div class="tab-content__item-bottom"><div data-tabs="item-progress" class="tab-progress"></div></div>
        </a>
        <!-- repeat content-item 02, 03 -->
      </div>
    </div></div>
  </div>
  <div class="tab-layout__col">
    <div aria-live="polite" role="region" class="tab-visual__wrap">
      <div id="tab1" data-tabs="visual-item" role="tabpanel" class="tab-visual__item active"><div class="tab-visual__inner"><img src="...avif" loading="lazy" alt="" class="tab-image"></div></div>
      <!-- repeat visual-item tab2, tab3 (index-matched to content-items) -->
    </div>
  </div>
</div>
```

## CSS
Full styles in chat log / Osmo source. Key behavioral rules:
```css
.tab-visual__item { visibility: hidden; ... position: absolute; }
.tab-visual__item.active { visibility: visible; }
.tab-content__item-detail { width: 100%; height: 0; padding-left: 4em; overflow: hidden; }
.tab-progress { transform-origin: 0%; background-color: #ff4c24; width: 100%; height: 1px; transform: scale3d(0,1,1); }
```
(`#ff4c24` progress → swap to `--purple` at build.)

## JavaScript
```js
function initTabSystem() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
    let activeContent = null, activeVisual = null, isAnimating = false, progressBarTween = null;

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
      if (!bar) return;
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, {
        scaleX: 1, duration: autoplayDuration / 1000, ease: "power1.inOut",
        onComplete: () => { if (!isAnimating) { const nextIndex = (index + 1) % contentItems.length; switchTab(nextIndex); } },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;
      isAnimating = true;
      if (progressBarTween) progressBarTween.kill();
      const outgoingContent = activeContent, outgoingVisual = activeVisual;
      const outgoingBar = outgoingContent?.querySelector('[data-tabs="item-progress"]');
      const incomingContent = contentItems[index], incomingVisual = visualItems[index];
      const incomingBar = incomingContent.querySelector('[data-tabs="item-progress"]');
      outgoingContent?.classList.remove("active"); outgoingVisual?.classList.remove("active");
      incomingContent.classList.add("active"); incomingVisual.classList.add("active");
      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power3" },
        onComplete: () => { activeContent = incomingContent; activeVisual = incomingVisual; isAnimating = false; if (autoplay) startProgressBar(index); },
      });
      if (outgoingContent) {
        outgoingContent.classList.remove("active"); outgoingVisual?.classList.remove("active");
        tl.set(outgoingBar, { transformOrigin: "right center" })
          .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
          .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
          .to(outgoingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, 0);
      }
      incomingContent.classList.add("active"); incomingVisual.classList.add("active");
      tl.fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, 0.3)
        .fromTo(incomingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, { height: "auto" }, 0)
        .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }

    switchTab(0);
    contentItems.forEach((item, i) => item.addEventListener("click", () => { if (item === activeContent) return; switchTab(i); }));
  });
}

document.addEventListener('DOMContentLoaded', () => { initTabSystem(); });
```
