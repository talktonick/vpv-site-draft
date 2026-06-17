# Osmo Island — Interactive Globe (Mapbox)

Source: https://www.osmo.supply/resource/interactive-globe-mapbox
**Island rule:** don't refactor `globe-*` classes or the JS. MAST-ify only the wrapper. Likely NOT needed for Insights — heavy (Mapbox), page-scoped load only.

## Dependencies
```html
<link href="https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.js"></script>
```
Requires a free Mapbox access token pasted into `cfg.mapboxToken`. Custom prop `--globe-info-width` (theme: set on `[data-globe-init]`). No GSAP.

## Attribute contract
- `[data-globe-init]` wrapper (gets `="initialized"` after load; `data-collapsed` toggled by panel). Config attrs `data-rotate-speed`, `data-auto-rotate`.
- `[data-globe-map]` map canvas. `[data-globe-list]` + `[data-globe-item]` (with `data-globe-lat/-lng/-id`, content `data-globe-item-name/-city/-image/-link`).
- Controls: `[data-globe-close]`, `[data-globe-reopen]`, `[data-globe-prev]`, `[data-globe-next]`, `[data-globe-counter]`. Marker: `[data-globe-marker-template]`, active `[data-active="true"]`.
- Webflow CMS-ready: `.globe-info__collection`→Collection List Wrapper, `.globe-info__list`→Collection List, `.globe-info__list-item`→Collection Item.

## HTML
```html
<div class="globe-container">
  <div data-rotate-speed="120" data-globe-init="" data-auto-rotate="true" class="globe-wrap">
    <div data-globe-map="" class="globe-map"></div>
    <div data-globe-info="" class="globe-info">
      <div class="globe-info__collection">
        <div data-globe-list="" class="globe-info__list">
          <div data-globe-lng="-122.4194" data-globe-item="" data-globe-id="sf" data-globe-lat="37.7749" class="globe-info__list-item">
            <div class="globe-info__list-item-visual"><img src="...sf.avif" data-globe-item-image="" class="globe-info__list-item-img"></div>
            <div class="globe-info__list-item-text">
              <p data-globe-item-city="" class="globe-info__list-item-label">San Fransisco, CA</p>
              <h3 data-globe-item-name="" class="globe-info__list-item-h">San Francisco Office</h3>
            </div>
            <a data-globe-item-link="" href="#" class="globe-info__list-item-link">Visit website -&gt;</a>
          </div>
          <!-- repeat .globe-info__list-item per location (london, tokyo, sydney, dubai, nyc) -->
        </div>
      </div>
      <div class="globe-close">
        <button data-globe-close="" aria-label="close locations panel" class="globe-close__button">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 12 12" fill="none" class="globe-close__icon"><path d="M10.75 0.75L0.75 10.75" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M0.75 0.75L10.75 10.75" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"></path></svg>
        </button>
      </div>
    </div>
    <nav data-globe-nav="" aria-label="location navigation" class="globe-nav">
      <button data-globe-prev="" aria-label="previous location" class="globe-nav__button"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 12 11" fill="none" class="globe-nav__button-icon"><path d="M5.19685 11L6.14173 10.0634L1.24724 4.96196V6.03804L6.16063 0.936594L5.21575 0L0 5.5L5.19685 11ZM12 6.21739V4.78261H1.11496V6.21739H12Z" fill="currentColor"></path></svg></button>
      <span data-globe-counter="" class="globe-nav__counter">1/6</span>
      <button data-globe-next="" aria-label="next location" class="globe-nav__button"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 12 11" fill="none" class="globe-nav__button-icon"><path d="M6.80315 11L5.85827 10.0634L10.7528 4.96196V6.03804L5.83937 0.936594L6.78425 0L12 5.5L6.80315 11ZM0 6.21739V4.78261H10.885V6.21739H0Z" fill="currentColor"></path></svg></button>
    </nav>
    <button data-globe-reopen="" aria-label="show locations panel" class="globe-reopen"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none" class="globe-reopen__icon"><path d="M9 19L15.2929 12.7071C15.6834 12.3166 15.6834 11.6834 15.2929 11.2929L9 5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"></path></svg></button>
    <div data-globe-marker-template="" class="globe-marker"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none" class="globe-marker__icon"><path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5"></path><path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5"></path></svg></div>
  </div>
</div>
```

## CSS (full)
```css
.globe-wrap { width: 100%; height: min(100vh, 100rem); position: relative; overflow: clip; }
.globe-container { width: 100%; margin-left: auto; margin-right: auto; position: relative; }
.globe-map { z-index: 0; width: 100%; height: 100%; position: absolute; inset: 0; }
.globe-info { z-index: 10; color: #f2f2f2; width: var(--globe-info-width); background-color: #2a2727; border: 1px solid #ffffff1a; border-radius: 1em; position: absolute; top: 1em; bottom: 1em; right: 1em; box-shadow: 0 0 12px #0000001a; }
[data-globe-info] { opacity: 1; visibility: visible; transform: translate(0em, 0px); transition: all 0.65s cubic-bezier(0.625, 0.05, 0, 1); }
[data-globe-init][data-collapsed="true"] [data-globe-info] { opacity: 0; visibility: hidden; transform: translate(4em, 0px); }
.globe-info__collection { width: 100%; height: 100%; }
.globe-info__list { scroll-snap-type: y mandatory; scroll-behavior: smooth; position: absolute; inset: 0%; overflow: hidden auto; }
.globe-info__list-item { grid-column-gap: 2em; grid-row-gap: 2em; scroll-snap-align: start; flex-flow: column; justify-content: flex-start; align-items: flex-start; width: 100%; min-height: 100%; padding: 2em; display: flex; }
.globe-info__list-item-visual { aspect-ratio: 3 / 2; border-radius: .75em; width: 100%; overflow: hidden; }
.globe-info__list-item-img { object-fit: cover; width: 100%; height: 100%; }
.globe-info__list-item-text { grid-column-gap: .5em; grid-row-gap: .5em; flex-flow: column; justify-content: flex-start; align-items: flex-start; margin-bottom: 1em; display: flex; }
.globe-info__list-item-label { opacity: .6; text-transform: uppercase; margin-bottom: 0; font-family: Haffer Mono, Arial, sans-serif; font-size: .75em; }
.globe-info__list-item-h { margin-top: 0; margin-bottom: 0; font-family: Haffer XH, Arial, sans-serif; font-size: 2em; font-weight: 400; line-height: 1.2; }
.globe-info__list-item-link { color: inherit; text-decoration: none; }
.globe-close { z-index: 11; position: absolute; top: 1em; right: 1em; }
.globe-close__button { color: #201d1d; background-color: #f2f2f2; border-radius: 100em; width: 2.5em; height: 2.5em; padding: 0; }
.globe-close__icon { width: .625em; }
.globe-nav { z-index: 10; grid-column-gap: 1em; grid-row-gap: 1em; color: #f2f2f2; bottom: 1em; right: calc(var(--globe-info-width) + 2em); background-color: #2a2727; border: 1px solid #ffffff1a; border-radius: 100em; justify-content: center; align-items: center; padding: .25em; display: flex; position: absolute; }
[data-globe-nav] { transition: all 0.65s cubic-bezier(0.625, 0.05, 0, 1); }
[data-globe-init][data-collapsed="true"] [data-globe-nav] { right: 1em; }
.globe-nav__button { background-color: #0000; border-radius: 100em; justify-content: center; align-items: center; width: 2em; height: 2em; padding: 0; display: flex; }
.globe-nav__button-icon { width: .75em; }
.globe-nav__counter { text-transform: uppercase; margin-bottom: 0; font-family: Haffer Mono, Arial, sans-serif; font-size: .875em; }
.globe-reopen { z-index: 12; color: #f2f2f2; background-color: #2a2727; border: 1px solid #ffffff26; border-right-style: none; border-top-left-radius: .5em; border-bottom-left-radius: .5em; height: 3em; padding: 0 .5em; position: absolute; top: 50%; right: 0; transform: translate(0, -50%); }
.globe-reopen__icon { width: 1em; }
[data-globe-reopen] { opacity: 0; visibility: hidden; transform: translate(2em, 0px); transition: all 0.4s cubic-bezier(0.625, 0.05, 0, 1); }
[data-globe-init][data-collapsed="true"] [data-globe-reopen] { opacity: 1; visibility: visible; transform: translate(0em, 0px); }
.globe-marker { color: #201d1d; background-color: #ffe19e; border-radius: 100em; justify-content: center; align-items: center; width: 2.5em; height: 2.5em; padding: .625em; display: flex; position: relative; }
.globe-marker__icon { width: 100%; }
[data-globe-marker][data-active="true"] { outline: 1px solid #FFF; outline-offset: .5em; }
[data-globe-init="initialized"] [data-globe-marker-template] { display: none; }
.mapboxgl-ctrl-group button { background: #2a2727 !important; }
.mapboxgl-ctrl button .mapboxgl-ctrl-icon { filter: invert(1); }
.mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
.mapboxgl-ctrl-group button+button { border-top: 1px solid #ffffff1a; }
@media screen and (max-width: 991px) {
  .globe-wrap { flex-flow: column; height: auto; display: flex; }
  .globe-map { aspect-ratio: 1; flex: none; height: auto; position: relative; inset: auto; }
  .globe-info { z-index: auto; box-shadow: none; border-style: solid none none; border-radius: 0; width: 100%; position: relative; inset: auto; }
  .globe-info__list { scroll-snap-type: x mandatory; display: flex; position: relative; inset: auto; overflow: auto hidden; }
  .globe-info__list-item { scroll-snap-align: center; border-right: 1px solid #ffffff1a; flex: 0 0 80%; min-width: 80%; padding: 1.5em 1.5em 2em; }
  .globe-info__list-item-text { margin-bottom: 0; }
  .globe-info__list-item-h { font-size: 1.5em; }
  .globe-close { display: none; }
  .globe-nav { border-left-style: none; border-right-style: none; border-radius: 0; justify-content: space-between; align-items: center; padding: 1em 1.5em; position: relative; inset: auto; }
  .globe-reopen { display: none; }
}
@media screen and (max-width: 479px) {
  .globe-info__list-item { grid-column-gap: 1em; grid-row-gap: 1em; padding-top: 1em; padding-left: 1em; padding-right: 1em; }
  .globe-info__list-item-visual { border-radius: .5em; }
}
```

## JavaScript
Full `initInteractiveGlobeMapbox()` — see Osmo source. Key config object (paste token):
```js
const cfg = {
  mapboxToken: /* add token here */,
  mapStyle: "mapbox://styles/osmo-supply/cmmw1zil7003e01s84w3h740n",
  center: [0, 20], zoom: 3, projection: "globe",
  autoRotate: true, secondsPerRevolution: 120, maxSpinZoom: 5, slowSpinZoom: 3,
  flyToDuration: 2000, flyToZoom: 5, globeOffsetX: -0.2, globeOffsetY: 0.25,
  mobile: { zoom: 2, flyToZoom: 2.5, globeOffsetX: 0, globeOffsetY: 0.5 },
};
```
Self-inits on DOMContentLoaded; guards via `data-globe-init="initialized"`; requires global `mapboxgl` + token or it returns early. Optional `cfg.markers` array clones the first `[data-globe-item]` as a template. Full body in Osmo "Copy context" output (saved verbatim in chat log).
