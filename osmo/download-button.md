# Osmo Island — Download Button

Source: https://www.osmo.supply/resource/download-button
**Island rule:** keep `download-btn*` + `data-download-*`. Don't touch JS. Fetches file as blob → triggers download, with animated state machine + CORS fallback. Could serve PDF/asset downloads in articles.

## Dependencies
None — vanilla JS (fetch + blob).

## Attribute contract
- `[data-download-src="<url>"]` on the button (click target). Optional `[data-download-name]` (custom filename).
- State `[data-download-state]` auto: `idle|downloading|ready|fallback`. Label `[data-download-label]`, optional `[data-download-success]` text. Icon parts `[data-download-arrow]`, `[data-download-base]`, `[data-download-success]`, `[data-download-icon-wrap]`.

## HTML
```html
<button data-download-src="https://…/file" data-download-name="osmo-logo.jpg" class="download-btn">
  <span data-download-icon-wrap="" class="download-btn__icon-hold">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 16" fill="none" data-download-icon="" class="download-btn__icon">
      <g clip-path="url(#clip0_1363_5581)">
        <path d="M8.74902 10.7734L12.4688 7.05371L13.5293 8.11426L7.99902 13.6445L2.46875 8.11426L3.5293 7.05371L7.24902 10.7734V0.0830078H8.74902V10.7734Z" fill="currentColor" data-download-arrow=""></path>
        <path d="M15.5 14.75V16.25H0.5V14.75H15.5Z" fill="currentColor" data-download-base=""></path>
      </g>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 20" fill="none" data-download-success="" class="download-btn__icon is--success"><path d="M2 9.5L8 15.5L19 4.5" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10" stroke-dasharray="25" stroke-dashoffset="25"></path></svg>
  </span>
  <span data-download-label="" class="download-btn__label">Download</span>
</button>
```

## CSS
```css
.download-btn { grid-column-gap: .625em; grid-row-gap: .625em; color: #f2f2f2; background-color: #0065e1; border-radius: .5em; justify-content: center; align-items: center; padding: .75em 1.5em .75em 1em; display: flex; }
.download-btn__label { font-size: 1.5em; font-weight: 500; line-height: 1.2; }
.download-btn__icon-hold { background-color: #fff3; border-radius: 100em; flex: none; justify-content: center; align-items: center; width: 2.5em; height: 2.5em; padding: 0; display: flex; }
.download-btn__icon { justify-content: center; align-items: center; width: 1em; height: 1em; display: flex; overflow: visible !important; }
.download-btn__icon.is--success { position: absolute; }
[data-download-arrow], [data-download-base] { transition: 0.5s transform cubic-bezier(0.625,0.05,0,1); }
[data-download-icon-wrap] { clip-path: inset(0em round 100em); transition: 0.5s clip-path cubic-bezier(0.625,0.05,0,1); }
[data-download-success] path { transition: 0.4s stroke-dashoffset cubic-bezier(0.625,0.05,0,1); }
[data-download-base] { transform-origin: center center; }
[data-download-src][data-download-state="downloading"] { pointer-events: none; }
[data-download-src][data-download-state="ready"] [data-download-icon-wrap] { transition-delay: 0.15s; clip-path: inset(0.35em round 100em); }
[data-download-src][data-download-state="ready"] [data-download-arrow] { transform: translate(0px, 200%); }
[data-download-src][data-download-state="ready"] [data-download-base] { transition-delay: 0.1s; transform: scale(0, 1); }
[data-download-src][data-download-state="ready"] [data-download-success] path { transition-delay: 0.25s; stroke-dashoffset: 0; }
@media (hover: hover) and (pointer: fine){
  [data-download-src]:hover { background-color: #0a75f8; }
  [data-download-src][data-download-state="idle"]:hover [data-download-arrow] { transform: translate(0px, -30%); }
  [data-download-src][data-download-state="idle"]:hover [data-download-base] { transform: scale(1.2, 1); }
}
```
(`#0065e1` → V+V at build.)

## JavaScript
Full `initDownloadButtons()` — fetches `data-download-src` as blob, derives filename, animates state `idle→downloading→ready`, CORS `fallback` to direct link, success-label reset after 3s. Verbatim body in chat log. Self-inits on DOMContentLoaded.
