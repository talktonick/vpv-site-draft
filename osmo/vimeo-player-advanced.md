# Osmo Island — Custom Vimeo Player (Advanced)

Source: https://www.osmo.supply/resource/custom-vimeo-player-advanced
**Island rule:** keep `vimeo-player__*` + `data-vimeo-*`. Don't touch JS. Inline player with full interface (timeline, mute, fullscreen, scroll-autoplay). Shares `.vimeo-player` block with Basic — one variant per page only.

## Dependencies
```html
<script src="https://player.vimeo.com/api/player.js"></script>
```
Vimeo Player SDK. No GSAP.

## Required custom properties (theme target → swap to V+V purple)
```css
.vimeo-player {
  --timeline-rounded-corners: 1.5em;
  --timeline-dot-height: 0.75em;
  --timeline-dot-color: #FF4C24;   /* → --purple at build */
  --progress-bg: rgba(239, 238, 236, 0.2);
  --progress-fill-bg: #FF4C24;     /* → --purple at build */
  --progress-height: 0.2em;
}
```

## Attribute contract
- Root: `[data-vimeo-player-init]` + `data-vimeo-video-id` + `data-vimeo-autoplay` (true→muted loop, scroll-triggered) + `data-vimeo-update-size="true|cover|false"` + `data-vimeo-muted` + `data-vimeo-paused-by-user`.
- Controls: `[data-vimeo-control="play|pause|mute|timeline|fullscreen"]`. Duration: `[data-vimeo-duration]`. State: `data-vimeo-playing|activated|fullscreen|hover|loaded`.

## HTML
```html
<div class="vimeo-player" data-vimeo-player-init="" data-vimeo-video-id="1019191082" data-vimeo-autoplay="false" data-vimeo-update-size="true" data-vimeo-playing="false" data-vimeo-activated="false" data-vimeo-fullscreen="false" data-vimeo-paused-by-user="false" data-vimeo-hover="false" data-vimeo-loaded="false" data-vimeo-muted="false">
  <div class="vimeo-player__before"></div>
  <iframe src="" width="640" height="360" frameborder="0" allowfullscreen="true" allow="autoplay; encrypted-media" class="vimeo-player__iframe"></iframe>
  <img src="...placeholder.avif" loading="eager" alt="" class="vimeo-player__placeholder">
  <div class="vimeo-player__dark"></div>
  <div class="vimeo-player__play" data-vimeo-control="play"><div class="vimeo-player__btn"><svg class="vimeo-player__btn-play-svg" ...></svg></div></div>
  <div class="vimeo-player__pause" data-vimeo-control="pause"><div class="vimeo-player__btn"><svg class="vimeo-player__btn-pause-svg" ...></svg></div></div>
  <div class="vimeo-player__interface">
    <div class="vimeo-player__interface-bottom">
      <div class="vimeo-player__duration"><span class="vimeo-player__duration-span" data-vimeo-duration="">0:00</span></div>
      <div class="vimeo-player__timeline">
        <progress class="vimeo-player__timeline-progress" min="0" max="100" value="0"></progress>
        <input class="vimeo-player__timeline-input" type="range" min="0" max="100" step="0.01" data-vimeo-control="timeline" value="0">
      </div>
      <div class="vimeo-player__mute" data-vimeo-control="mute"><svg class="vimeo-player__volume-up-svg" ...></svg><svg class="vimeo-player__volume-mute-svg" ...></svg></div>
      <div class="vimeo-player__fullscreen" data-vimeo-control="fullscreen"><svg class="vimeo-player__fullscreen-scale-svg" ...></svg><svg class="vimeo-player__fullscreen-shrink-svg" ...></svg></div>
    </div>
  </div>
  <div class="vimeo-player__loading"><svg class="vimeo-player__loading-svg" ...></svg></div>
</div>
```
(SVG paths identical to those in the resource; full markup in chat log / Osmo source.)

## CSS
Base `.vimeo-player` rules are **identical to [vimeo-player-basic.md](vimeo-player-basic.md)** (`__btn` is `6em` here vs `9em` in basic; loading color `#ff4c24`). Plus the interface/timeline rules:
```css
.vimeo-player .vimeo-player__interface { opacity: 0; }
.vimeo-player[data-vimeo-activated="false"][data-vimeo-playing="false"] .vimeo-player__interface { opacity: 1; }
.vimeo-player .vimeo-player__interface * { pointer-events: all; }
.vimeo-player[data-vimeo-activated="true"][data-vimeo-playing="false"] .vimeo-player__interface,
.vimeo-player[data-vimeo-activated="true"][data-vimeo-hover="true"]:hover .vimeo-player__interface { opacity: 1; }
@media (hover: none) and (pointer: coarse) { .vimeo-player[data-vimeo-activated="true"][data-vimeo-playing="true"] .vimeo-player__interface { opacity: 0 !important; } }
.vimeo-player__interface { pointer-events: none; flex-flow: column; justify-content: flex-end; align-items: stretch; width: 100%; height: 100%; padding: min(2em, 4vw); transition-property: opacity; transition-duration: .3s; transition-timing-function: linear; display: flex; position: absolute; }
.vimeo-player__interface-bottom { grid-column-gap: 1em; grid-row-gap: 1em; justify-content: flex-start; align-items: center; display: flex; }
.vimeo-player__timeline { flex-grow: 1; justify-content: center; align-items: center; height: 1.5em; display: flex; position: relative; }
.vimeo-player__timeline-input { pointer-events: auto; cursor: pointer; -webkit-appearance: none; appearance: none; background-color: #0000; width: 100%; height: 100%; display: block; position: relative; }
.vimeo-player__timeline-progress { vertical-align: top; appearance: none; height: var(--progress-height); border-radius: var(--timeline-rounded-corners); color: var(--progress-fill-bg); background-color: #0000; border: none; width: 100%; margin: 0; padding: 0; position: absolute; left: 0; overflow: hidden; }
.vimeo-player progress::-webkit-progress-bar { border-radius: var(--timeline-rounded-corners); background-color: var(--progress-bg); }
.vimeo-player progress::-webkit-progress-value { background: var(--progress-fill-bg); }
.vimeo-player progress::-moz-progress-bar { border-radius: var(--timeline-rounded-corners); background: var(--progress-fill-bg); }
.vimeo-player [type="range"]::-webkit-slider-thumb { box-shadow: 0; height: var(--timeline-dot-height); width: var(--timeline-dot-height); border-radius: var(--timeline-rounded-corners); background-color: var(--timeline-dot-color); cursor: pointer; -webkit-appearance: none; margin-top: calc((var(--progress-height) / 2) - (var(--timeline-dot-height) / 2)); }
.vimeo-player [type="range"]::-moz-range-thumb { border: 0; height: var(--timeline-dot-height); width: var(--timeline-dot-height); border-radius: var(--timeline-rounded-corners); background: var(--timeline-dot-color); cursor: pointer; }
/* mute/fullscreen icon swap + duration — full set in chat log / Osmo source */
.vimeo-player__mute, .vimeo-player__fullscreen { cursor: pointer; flex-shrink: 0; justify-content: center; align-items: center; width: 1.5em; height: 1.5em; display: flex; position: relative; }
.vimeo-player .vimeo-player__mute svg:nth-child(2), .vimeo-player[data-vimeo-muted="true"] .vimeo-player__mute svg:nth-child(1) { display: none; }
.vimeo-player .vimeo-player__mute svg:nth-child(1), .vimeo-player[data-vimeo-muted="true"] .vimeo-player__mute svg:nth-child(2) { display: block; }
.vimeo-player .vimeo-player__fullscreen svg:nth-child(2), .vimeo-player[data-vimeo-fullscreen="true"] .vimeo-player__fullscreen svg:nth-child(1) { display: none; }
.vimeo-player .vimeo-player__fullscreen svg:nth-child(1), .vimeo-player[data-vimeo-fullscreen="true"] .vimeo-player__fullscreen svg:nth-child(2) { display: block; }
.vimeo-player__duration { flex-shrink: 0; width: 2.25em; }
.vimeo-player__duration-span { text-align: center; white-space: nowrap; user-select: none; width: 100%; display: block; }
```

## JavaScript
Full `initVimeoPlayer()` (advanced) — sets iframe src, aspect/cover sizing, scroll-based autoplay when `data-vimeo-autoplay="true"`, play/pause/mute/fullscreen wiring, timeline `<input range>` + `<progress>` sync via `timeupdate`, hover-hide after 3s. Verbatim body in Osmo "Copy context" output (in chat log). Self-inits on DOMContentLoaded.
> Known quirk (leave as-is per island rule): the pause handler references `checkVisibility` which is scoped inside the autoplay branch — harmless unless autoplay path differs.
