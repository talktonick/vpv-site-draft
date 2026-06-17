# Osmo Island — Multi Filter Setup (Multi Match)

Source: https://www.osmo.supply/resource/multi-filter-setup-multi-match
**Island rule:** keep `filter-*`/`demo-card__*` + `data-filter-*`. Don't touch JS.
**Relevance:** maps to the brief's "filter bar with fade-and-shrink result behavior" (SPA browse views — All Products / Growth Features / Case Studies). Single-select today via `data-filter-target-match`; multi-select is a real option here. NOT for the Insights template itself.

## Dependencies
None — vanilla JS.

## Attribute contract
- `[data-filter-group]` root + `data-filter-target-match="single|multi"` (one tag vs combine tags) + `data-filter-name-match="single|multi"` (item must contain ALL selected = `single`/AND, vs ANY = `multi`/OR).
- Buttons `[data-filter-target="<tag>"]` + `data-filter-status`. Special: `data-filter-target="all"` and `data-filter-target="reset"`.
- Items `[data-filter-name]` (space-separated multi tags) + `data-filter-status` (`active`/`not-active`/`transition-out`). Webflow CMS: children `[data-filter-name-collect="<tag>"]` auto-build the parent's `data-filter-name`.
- Transition timing: `transitionDelay = 300` (ms) constant in JS. **This IS the fade-and-shrink** — `transition-out` scales to 0.9 + opacity 0 before hiding.

## HTML (structure; 12 demo cards omitted)
```html
<div data-filter-group="" data-filter-target-match="multi" data-filter-name-match="single" role="group" class="filter-group">
  <div class="filter-buttons">
    <button data-filter-target="all" data-filter-status="active" aria-pressed="false" aria-controls="filter-list" class="filter-btn">All</button>
    <button data-filter-target="orange" data-filter-status="not-active" aria-pressed="false" aria-controls="filter-list" class="filter-btn">Orange</button>
    <!-- blue, green, brown … -->
    <button data-filter-target="reset" data-filter-status="not-active" aria-pressed="false" aria-controls="filter-list" class="reset-btn">Reset</button>
  </div>
  <div aria-live="polite" role="list" class="filter-list">
    <div role="listitem" data-filter-name="" data-filter-status="active" class="filter-list__item">
      <div class="demo-card">
        <div class="demo-card__top">
          <div class="demo-card__visual"><div class="demo-card__visual-before"></div><span class="demo-card__emoji">🐸</span></div>
          <div class="demo-card__tags-collection"><div class="demo-card__tags-list">
            <div data-filter-name-collect="green" class="demo-card__tags-item"><p class="demo-card__tags-item-p">Green</p></div>
          </div></div>
        </div>
        <div class="demo-card__bottom"><h3 class="demo-card__h3">Frog</h3></div>
      </div>
    </div>
    <!-- repeat .filter-list__item per card; multi-tag cards have multiple [data-filter-name-collect] -->
  </div>
</div>
```

## CSS (fade-and-shrink states are the key part)
```css
.filter-list { flex-flow: wrap; width: 100%; display: flex; }
.filter-list__item { width: 25%; padding: .75em; }
.filter-list__item[data-filter-status="active"] { transition: opacity 0.6s cubic-bezier(0.625,0.05,0,1), transform 0.6s cubic-bezier(0.625,0.05,0,1); transform: scale(1) rotate(0.001deg); opacity: 1; visibility: visible; position: relative; }
.filter-list__item[data-filter-status="transition-out"] { transition: opacity 0.45s cubic-bezier(0.625,0.05,0,1), transform 0.45s cubic-bezier(0.625,0.05,0,1); transform: scale(0.9) rotate(0.001deg); opacity: 0; visibility: visible; }
.filter-list__item[data-filter-status="not-active"] { transform: scale(0.9) rotate(0.001deg); opacity: 0; visibility: hidden; position: absolute; }
.filter-btn[data-filter-status="active"] { background-color: #131313; color: #EFEEEC; }
.reset-btn { opacity: 0; visibility: hidden; } .reset-btn[data-filter-status="active"] { opacity: 1; visibility: visible; }
@media (max-width:991px){ .filter-list__item { width: 50%; } } @media (max-width:767px){ .filter-list__item { width: 100%; } }
```
NOTE: brief wants non-matches to "stay on screen but dim and compress." Osmo's `not-active` uses `position:absolute; visibility:hidden` (removes from flow), and `transition-out` is only the exit animation. To match the brief's *stay-and-dim* behavior, this needs adapting at build — flag.

## JavaScript
Full `initMutliFilterSetupMultiMatch()` — token collection from `[data-filter-name-collect]`, single/multi target + AND/OR name matching, `transitionDelay` (300ms) staged hide via `transition-out`, all/reset buttons. Verbatim body in chat log. Self-inits on DOMContentLoaded.
