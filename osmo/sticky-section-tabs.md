# Osmo Island — Sticky Section Tabs (CSS only)

Source: https://www.osmo.supply/resource/sticky-section-tabs-css
**Island rule:** mandatory elements are only `.sticky-tab-group` + children. No JS, no external deps. The `.demo-*` nav/header/footer are demo-only; the `.container` is Osmo's own (collides conceptually with MAST `container` — rename Osmo's or scope it at build).

## Dependencies
None. Pure CSS (`position: sticky`).

## Required custom property
`--nav-height` (demo `6em`) — set to your fixed nav height, or `0` if no fixed nav. Sticky offset = `calc(var(--nav-height) - 1px)`.

## Structure (mandatory part only)
```html
<div class="sticky-tab-group">
  <div class="sticky-tab-group__nav-bg"></div>
  <section class="sticky-tab">
    <div class="sticky-tab__sticky">
      <div class="sticky-tab__inner">
        <div class="container">
          <div class="sticky-tab__content"><h2 class="sticky-tab__title">Step 1: Concept</h2></div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="sticky-tab__placeholder-content"><!-- content --></div>
    </div>
  </section>
  <!-- repeat <section class="sticky-tab"> per step -->
</div>
```

## CSS (mandatory part — drop the demo nav/header/footer/icon rules)
```css
:root { --nav-height: 6em; }
.container { max-width: 90em; margin-left: auto; margin-right: auto; padding-left: 2em; padding-right: 2em; }
.sticky-tab-group { overflow: clip; }
.sticky-tab-group__nav-bg { z-index: 2; height: var(--nav-height); background-color: #000; border-bottom: 1px solid #ffffff26; width: 100%; position: sticky; top: 0; left: 0; }
.sticky-tab { background-color: #131313; position: relative; overflow: clip; }
.sticky-tab__sticky { z-index: 1; top: calc(var(--nav-height) - 1px); flex-flow: column; margin-top: -1px; display: flex; position: sticky; box-shadow: 0 .25em .5em 0 #00000040; }
.sticky-tab__inner { background-color: #000; border-top: 1px solid #ffffff26; border-bottom: 1px solid #ffffff26; justify-content: space-between; align-items: center; padding-top: 2em; padding-bottom: 2em; }
.sticky-tab__content { justify-content: space-between; align-items: center; display: flex; }
.sticky-tab__title { margin-top: 0; margin-bottom: 0; font-size: 2.25em; font-weight: 500; line-height: 1; }
.sticky-tab__placeholder-content { justify-content: center; align-items: center; height: 66vh; display: flex; }
.sticky-tab__before-bg { height: calc(var(--nav-height) + 2px); background-color: #000; width: 100%; position: absolute; bottom: 100%; }
@media screen and (max-width: 767px) { .sticky-tab__title { font-size: 2em; } }
@media screen and (max-width: 479px) { .container { padding-left: 1em; padding-right: 1em; } }
```

## JavaScript
None.

⚠ Build note: Osmo's `.container` (max 90em) is NOT the same as MAST's `container`. Namespace or remove Osmo's to avoid clobbering the MAST base class.
