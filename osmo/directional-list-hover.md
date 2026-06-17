# Osmo Island — Directional List Hover

Source: https://www.osmo.supply/resource/directional-list-hover
**Island rule:** keep `directional-list*` + `data-directional-hover*`. Don't touch JS. Tile slides in from the edge the cursor enters. Fits an award/index list (could suit a related-posts or case-study list).

## Dependencies
None — vanilla JS (CSS transitions).

## Attribute contract
- Container `[data-directional-hover]` + `data-type="x|y|all"` (direction detection; default `all`).
- Items `[data-directional-hover-item]` (gets `data-status="enter-<dir>"`/`leave-<dir>`). Tile `[data-directional-hover-tile]`.

## HTML (one row shown)
```html
<div data-directional-hover="" data-type="y" class="directional-list">
  <div class="directional-list__info">
    <div class="directional-list__col-award"><p class="direcitonal-list__eyebrow">Award</p></div>
    <div class="directional-list__col-client"><p class="direcitonal-list__eyebrow">Client</p></div>
    <div class="directional-list__col-year"><p class="direcitonal-list__eyebrow">Year</p></div>
  </div>
  <div class="directional-list__collection"><div class="directional-list__list">
    <a data-directional-hover-item="" href="#" target="_blank" class="directional-list__item">
      <div data-directional-hover-tile="" class="directional-list__hover-tile"></div>
      <div class="directional-list__border is--item"></div>
      <div class="directional-list__col-award"><p class="direcitonal-list__p">Site of the Day</p></div>
      <div class="directional-list__col-client"><p class="direcitonal-list__p">FlowFest</p></div>
      <div class="directional-list__col-year"><p class="direcitonal-list__p">2025</p></div>
    </a>
    <!-- repeat .directional-list__item rows -->
  </div></div>
  <div class="directional-list__border"></div>
</div>
```

## CSS
```css
.directional-list { color: #ffecde; flex-flow: column; width: 100%; max-width: 50em; display: flex; position: relative; }
.directional-list__info { grid-column-gap: 1em; grid-row-gap: 1em; justify-content: space-between; align-items: center; width: 100%; padding-bottom: 1.5em; padding-left: 1.5em; padding-right: 1.5em; display: flex; position: relative; }
.direcitonal-list__eyebrow { color: #c96d4d; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 0; font-size: .75em; line-height: 1; }
.directional-list__item { grid-column-gap: 1em; grid-row-gap: 1em; color: inherit; justify-content: space-between; align-items: center; margin-top: -1px; padding: 2.25em 1.5em; text-decoration: none; display: flex; position: relative; overflow: hidden; }
.directional-list__col-award { min-width: 30%; position: relative; }
.directional-list__col-client { flex: 1; position: relative; }
.directional-list__col-year { flex: none; min-width: 3em; position: relative; }
.direcitonal-list__p { margin-bottom: 0; font-size: 1em; line-height: 1; }
.directional-list__border { z-index: 2; opacity: .3; background-color: currentColor; width: 100%; height: 1px; position: absolute; bottom: 0; left: 0; }
.directional-list__border.is--item { top: 0; bottom: auto; }
.directional-list__hover-tile { background-color: #ab4e2d; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
[data-directional-hover-tile] { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); transform: translateY(-100%); will-change: transform; }
```
(Colors `#ffecde`/`#c96d4d`/`#ab4e2d` → V+V palette at build.)

## JavaScript
```js
function initDirectionalListHover() {
  const directionMap = { top: 'translateY(-100%)', bottom: 'translateY(100%)', left: 'translateX(-100%)', right: 'translateX(100%)' };
  document.querySelectorAll('[data-directional-hover]').forEach(container => {
    const type = container.getAttribute('data-type') || 'all';
    container.querySelectorAll('[data-directional-hover-item]').forEach(item => {
      const tile = item.querySelector('[data-directional-hover-tile]');
      if (!tile) return;
      item.addEventListener('mouseenter', e => {
        const dir = getDirection(e, item, type);
        tile.style.transition = 'none';
        tile.style.transform = directionMap[dir] || 'translate(0, 0)';
        void tile.offsetHeight;
        tile.style.transition = '';
        tile.style.transform = 'translate(0%, 0%)';
        item.setAttribute('data-status', `enter-${dir}`);
      });
      item.addEventListener('mouseleave', e => {
        const dir = getDirection(e, item, type);
        item.setAttribute('data-status', `leave-${dir}`);
        tile.style.transform = directionMap[dir] || 'translate(0, 0)';
      });
    });
    function getDirection(event, el, type) {
      const { left, top, width: w, height: h } = el.getBoundingClientRect();
      const x = event.clientX - left, y = event.clientY - top;
      if (type === 'y') return y < h / 2 ? 'top' : 'bottom';
      if (type === 'x') return x < w / 2 ? 'left' : 'right';
      const distances = { top: y, right: w - x, bottom: h - y, left: x };
      return Object.entries(distances).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => { initDirectionalListHover(); });
```
