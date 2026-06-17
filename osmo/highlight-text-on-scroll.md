# Osmo Island — Highlight Text on Scroll

Source: https://www.osmo.supply/resource/highlight-text-on-scroll
**Island rule:** attribute-driven, no wrapper class. Don't touch the JS.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js"></script>
```
GSAP 3.15 + ScrollTrigger + SplitText (SplitText free in 3.13+). Calls `gsap.registerPlugin(ScrollTrigger, SplitText)` at top of the script.

## Attribute contract
- `[data-highlight-text]` on any text element (target).
- Optional: `data-highlight-scroll-start` (def `top 90%`), `data-highlight-scroll-end` (def `center 40%`), `data-highlight-fade` (def `0.2`, pre-highlight opacity), `data-highlight-stagger` (def `0.1`).

## HTML
```html
<h1 data-highlight-text>Add your heading here</h1>
```

## CSS
None required.

## JavaScript
```js
gsap.registerPlugin(ScrollTrigger, SplitText)

function initHighlightText(){
  let splitHeadingTargets = document.querySelectorAll("[data-highlight-text]")
  splitHeadingTargets.forEach((heading) => {
    const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%"
    const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%"
    const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2
    const staggerValue =  heading.getAttribute("data-highlight-stagger") || 0.1
    new SplitText(heading, {
      type: "words, chars",
      autoSplit: true,
      onSplit(self) {
        let ctx = gsap.context(() => {
          let tl = gsap.timeline({ scrollTrigger: { scrub: true, trigger: heading, start: scrollStart, end: scrollEnd } })
          tl.from(self.chars,{ autoAlpha: fadedValue, stagger: staggerValue, ease: "linear" })
        });
        return ctx;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () =>{ initHighlightText(); });
```
