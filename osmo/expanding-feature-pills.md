# Osmo Island — Expanding Feature Pills

Source: https://www.osmo.supply/resource/expanding-feature-pills
**Island rule:** keep `feature-pills__*` + `data-feature-pills-*`. Don't touch JS. Locked accordion: one open at a time; close via X button or Escape.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
```
GSAP 3.15 core only (no plugins). Respects prefers-reduced-motion.

## Required custom property
`--content-item-expanded` on `[data-feature-pills-init]` — def `25em`; ≤991px `calc(50% - 0.5em)`; ≤767px `100%`.

## Attribute contract
- `[data-feature-pills-init]` root; `data-feature-pills-active` (close-btn visibility), `data-edit-mode="true"` (authoring view).
- `[data-feature-pills-collection]` / `[data-feature-pills-list]` (ul) / `[data-feature-pills-item]` + `data-active` / `[data-feature-pills-button]` (button) / `[data-feature-pills-content]` / `[data-feature-pills-inner]` (height reference).
- `[data-feature-pills-visual]` (index-matched slides) / `[data-feature-pills-cover]` (default) / `[data-feature-pills-close]`.
- Visuals count must equal pills count (index-matched) or console warns.

## HTML (one item shown; repeat 6)
```html
<div data-feature-pills-active="false" aria-label="product features" data-feature-pills-init="" data-edit-mode="false" class="feature-pills__wrap">
  <div class="feature-pills__layout">
    <div class="feature-pills__col">
      <div data-feature-pills-collection="" class="feature-pills__info-collection">
        <ul role="list" data-feature-pills-list="" class="feature-pills__info-list">
          <li data-feature-pills-item="" data-active="false" class="feature-pills__info-item">
            <div class="feature-pills__item-bg"></div>
            <button data-feature-pills-button="" aria-expanded="false" class="feature-pills__item-button">
              <span class="feature-pills__item-label">Effortless movement</span>
              <span class="feature-pills__item-icon"><span class="feature-pills__item-icon-bar"></span><span class="feature-pills__item-icon-bar is--horizontal"></span></span>
            </button>
            <div aria-hidden="true" data-feature-pills-content="" class="feature-pills__item-content">
              <div class="feature-pills__item-mask">
                <div data-feature-pills-inner="" class="feature-pills__item-inner">
                  <p class="feature-pills__item-body">Effortless movement.<br><br><span class="feature-pills__item-body-span">Four-way stretch…</span></p>
                </div>
              </div>
            </div>
          </li>
          <!-- repeat 5 more items -->
        </ul>
      </div>
    </div>
    <div class="feature-pills__col is--visual">
      <div class="feature-pills__visual-collection">
        <div class="feature-pills__visual-list">
          <div aria-hidden="true" data-feature-pills-visual="" class="feature-pills__visual-item"><img src="...avif" class="feature-pills__visual-img"></div>
          <!-- repeat 5 more visuals (index-matched to pills) -->
        </div>
      </div>
      <div data-feature-pills-cover="" class="feature-pills__visual-cover"><img src="...placeholder.avif" class="feature-pills__visual-cover-img"></div>
    </div>
  </div>
  <div class="feature-pills__close">
    <button data-feature-pills-close="" aria-hidden="true" class="feature-pills__close-button"><span class="feature-pills__item-icon-bar"></span><span class="feature-pills__item-icon-bar is--horizontal"></span></button>
  </div>
</div>
```

## CSS
```css
.feature-pills__wrap { color: #f2f2f2; background-color: #272a2a; border: 2px solid #ffffff26; border-radius: 1.25em; width: 100%; max-width: 75em; height: 45em; position: relative; overflow: clip; }
.feature-pills__layout { justify-content: flex-start; align-items: stretch; width: 100%; height: 100%; display: flex; position: relative; }
.feature-pills__col { width: 50%; position: relative; }
.feature-pills__visual-collection { z-index: 0; width: 100%; height: 100%; position: relative; }
.feature-pills__visual-item { opacity: 0; width: 100%; height: 100%; position: absolute; inset: 0%; }
.feature-pills__visual-list { width: 100%; height: 100%; position: relative; overflow: hidden; }
.feature-pills__visual-img { object-fit: cover; width: 100%; height: 100%; }
.feature-pills__info-collection { flex-flow: column; justify-content: center; align-items: flex-start; width: 100%; height: 100%; padding-left: 1.25em; padding-right: 1.25em; display: flex; }
.feature-pills__info-list { grid-column-gap: 1em; grid-row-gap: 1em; max-width: var(--content-item-expanded); flex-flow: column; flex: none; justify-content: center; align-items: flex-start; width: 100%; margin-bottom: 0; margin-left: auto; margin-right: auto; padding: 0; list-style: none; display: flex; }
.feature-pills__info-item { padding: 0; position: relative; }
.feature-pills__item-bg { z-index: 0; background-color: #ffffff14; border-radius: 2em; width: 100%; height: 100%; position: absolute; inset: 0%; }
.feature-pills__item-button { z-index: 1; grid-column-gap: .625em; grid-row-gap: .625em; background-color: #0000; border: 1px #000; flex-flow: row; justify-content: flex-start; align-items: center; padding: .75em 1.25em; display: flex; position: relative; }
.feature-pills__item-label { letter-spacing: -.015em; white-space: nowrap; flex: none; font-size: 1.25em; font-weight: 500; }
.feature-pills__item-icon { aspect-ratio: 1; background-color: #fff3; border-radius: 100em; flex: none; justify-content: center; align-items: center; width: 1.25em; padding: 0; display: flex; position: relative; }
.feature-pills__item-icon-bar { background-color: #fff; flex: none; width: 1px; height: 50%; padding: 0; position: absolute; }
.feature-pills__item-icon-bar.is--horizontal { width: 50%; height: 1px; }
.feature-pills__visual-cover { z-index: 1; width: 100%; height: 100%; position: absolute; inset: 0%; }
.feature-pills__visual-cover-img { object-fit: cover; width: 100%; height: 100%; }
.feature-pills__item-content { z-index: 2; pointer-events: none; position: absolute; inset: 0%; }
.feature-pills__item-mask { width: 100%; height: 100%; overflow: hidden; }
.feature-pills__item-inner { max-width: var(--content-item-expanded); flex-flow: column; justify-content: flex-start; align-items: flex-start; width: max-content; padding: 1.5em 1.5em 2em; display: flex; }
.feature-pills__item-body { margin-bottom: 0; font-size: 1.25em; font-weight: 500; }
.feature-pills__item-body-span { opacity: .5; }
.feature-pills__close { z-index: 2; position: absolute; top: 1em; right: 1em; }
.feature-pills__close-button { aspect-ratio: 1; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); background-color: #ffffff14; border: 0 #000; border-radius: 10em; justify-content: center; align-items: center; width: 2em; padding: 8px; display: flex; position: relative; }
@media screen and (max-width: 991px) {
  .feature-pills__wrap { background-color: #0000; border-style: none; border-radius: 0; height: auto; }
  .feature-pills__layout { flex-flow: column; }
  .feature-pills__col { width: 100%; }
  .feature-pills__col.is--visual { aspect-ratio: 1; border-radius: 1.25em; order: -9999; overflow: hidden; }
  .feature-pills__info-collection { padding: 2.5em 0 4em; }
  .feature-pills__info-list { flex-flow: wrap; justify-content: flex-start; align-items: flex-start; max-width: none; }
  .feature-pills__info-item { width: var(--content-item-expanded); }
  .feature-pills__item-button { justify-content: space-between; align-items: center; width: 100%; }
  .feature-pills__item-inner { max-width: 100%; }
}
[data-feature-pills-init] { --content-item-expanded: 25em; }
@media screen and (max-width: 991px){ [data-feature-pills-init] { --content-item-expanded: calc(50% - 0.5em); } }
@media screen and (max-width: 767px){ [data-feature-pills-init] { --content-item-expanded: 100%; } }
[data-feature-pills-button] { opacity: 1; transition: opacity 400ms ease-in-out 300ms; }
[data-feature-pills-inner] { opacity: 0; transition: opacity 300ms ease-in-out 0ms; }
[data-feature-pills-visual] { opacity: 0; transition: opacity 350ms ease-in-out; }
[data-feature-pills-cover] { opacity: 1; transition: opacity 350ms ease-in-out; }
[data-feature-pills-item][data-active="true"] [data-feature-pills-button] { opacity: 0; transition: opacity 50ms ease-in-out 0ms; }
[data-feature-pills-item][data-active="true"] [data-feature-pills-inner] { opacity: 1; }
[data-feature-pills-visual][data-active="true"] { opacity: 1; }
[data-feature-pills-cover][data-active="false"] { opacity: 0; }
[data-feature-pills-close] { transform: scale(0) rotate(135deg); opacity: 0; pointer-events: none; transition: all 500ms cubic-bezier(.7, 0, .3, 1); }
[data-feature-pills-active="true"] [data-feature-pills-close] { transform: scale(1) rotate(45deg); opacity: 1; pointer-events: auto; }
[data-feature-pills-init][data-edit-mode="true"] [data-feature-pills-collection] { overflow: auto; justify-content: start; }
[data-feature-pills-init][data-edit-mode="true"] [data-feature-pills-button] { display: none; }
[data-feature-pills-init][data-edit-mode="true"] [data-feature-pills-content] { position: relative; pointer-events: auto; }
[data-feature-pills-init][data-edit-mode="true"] [data-feature-pills-inner] { opacity: 1; transform: translate(0px, 0em); }
```

## JavaScript
Full `initExpandingFeaturePills()` — GSAP width/height tween, `ease = "back.out(2)"`, `animationDuration = 0.5`, debounced resize, a11y wiring. Verbatim body in Osmo "Copy context" output (in chat log). Self-inits on DOMContentLoaded.
