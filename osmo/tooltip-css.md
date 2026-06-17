# Osmo Island — Tooltip (CSS only)

Source: https://www.osmo.supply/resource/tooltip-css
**Island rule:** keep `css-tooltip*` + `data-css-tooltip-*`. No JS, no deps. Pure CSS hover tooltip with positioning + icon-type variants. Useful for inline term definitions in article body.

## Dependencies
None.

## Attribute contract
- `[data-css-tooltip-hover]` on the hover trigger (wrapper or icon).
- `[data-css-tooltip-icon="info|question|alert"]` toggles which SVG paths show.
- `[data-css-tooltip-x="center|left|right]` + `[data-css-tooltip-y="top|bottom"]` position the box.

## HTML
```html
<div data-css-tooltip-hover="" class="css-tooltip">
  <span>You can hover me</span>
  <div data-css-tooltip-icon="info" class="css-tooltip__icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none"><!-- multi-path icon set --></svg>
    <div data-css-tooltip-x="center" data-css-tooltip-y="top" class="css-tooltip__box">
      <div class="css-tooltip__box-inner">
        <div class="css-tooltip__card">
          <div class="css-tooltip__card-title"><h3 class="css-tooltip__card-h">CSS Only Tooltip</h3></div>
          <div class="css-tooltip__card-text"><p class="css-tooltip__card-p">Lorem ipsum…</p></div>
        </div>
        <div class="css-tootlip__tip"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 124 30" fill="none"><path d="M103.284 3L121 3C122.657 3 124 1.65685 124 0L0 0C0 1.65685 1.34315 3 3 3L20.7157 3C26.0201 3 31.1071 5.10713 34.8579 8.85786L51.3934 25.3934C57.2513 31.2513 66.7487 31.2513 72.6066 25.3934L89.1421 8.85786C92.8929 5.10714 97.9799 3 103.284 3Z" fill="currentColor"></path></svg></div>
      </div>
    </div>
  </div>
</div>
```
(Full multi-path icon SVG in chat log; tip arrow SVG above.)

## CSS
```css
.css-tooltip { margin: 0; }
.css-tooltip__icon { vertical-align: sub; cursor: pointer; width: 1em; height: 1em; margin-left: .125em; display: inline-block; }
.css-tooltip__box { flex-flow: column; align-items: center; padding-top: .5em; padding-bottom: .5em; display: flex; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); transition: all 0.4s cubic-bezier(0.625,0.05,0,1); opacity: 0; visibility: hidden; }
[data-css-tooltip-hover]:hover .css-tooltip__box { opacity: 1; visibility: visible; }
.css-tooltip__box-inner { flex-flow: column; align-items: center; display: flex; position: relative; transition: transform 0.4s cubic-bezier(0.625,0.05,0,1); transform: translateY(1em) scale(0.9) rotate(0.001deg); }
[data-css-tooltip-hover]:hover .css-tooltip__box-inner { transform: translateY(0em) scale(1) rotate(0.001deg); }
.css-tooltip__card { grid-column-gap: .5em; grid-row-gap: .5em; color: #f4f4f4; background-color: #201d1d; border-radius: .75em; flex-flow: column; width: 21em; max-width: calc(100vw - 1em); margin-left: .5em; margin-right: .5em; padding: 1.5em; display: flex; }
.css-tootlip__tip { width: 2.5em; margin: -.0625em 1.25em; display: flex; position: relative; }
.css-tooltip__card-text { opacity: .75; }
.css-tooltip__card-h { font-size: 1.25em; font-weight: 500; line-height: inherit; margin: 0; }
.css-tooltip__card-p { margin: 0; }
[data-css-tooltip-icon] > svg path:not(:first-child) { display: none; }
[data-css-tooltip-icon="question"] > svg path:nth-child(2), [data-css-tooltip-icon="question"] > svg path:nth-child(3) { display: block; }
[data-css-tooltip-icon="alert"] > svg path:nth-child(4), [data-css-tooltip-icon="alert"] > svg path:nth-child(5) { display: block; }
[data-css-tooltip-icon="info"] > svg path:nth-child(6), [data-css-tooltip-icon="info"] > svg path:nth-child(7), [data-css-tooltip-icon="info"] > svg path:nth-child(8), [data-css-tooltip-icon="info"] > svg path:nth-child(9) { display: block; }
[data-css-tooltip-hover] { position: relative; cursor: pointer; }
[data-css-tooltip-y="bottom"] { top: 100%; bottom: unset; }
[data-css-tooltip-y="bottom"] .css-tooltip__card { order: 2; }
[data-css-tooltip-y="bottom"] .css-tootlip__tip { transform: scaleY(-1); }
[data-css-tooltip-y="bottom"] .css-tooltip__box-inner { transform: translateY(-1em) scale(0.9) rotate(0.001deg); }
[data-css-tooltip-x="left"] { align-items: flex-start; left: -2em; transform: translateX(0%); }
[data-css-tooltip-x="left"] .css-tooltip__box-inner { align-items: flex-start; }
[data-css-tooltip-x="right"] { align-items: flex-end; left: unset; right: -2em; transform: translateX(0%); }
[data-css-tooltip-x="right"] .css-tooltip__box-inner { align-items: flex-end; }
```

## JavaScript
None.
