# Osmo Island — Custom Vimeo Lightbox (Advanced)

Source: https://www.osmo.supply/resource/custom-vimeo-lightbox-advanced
**Island rule:** keep `vimeo-lightbox__*` + `data-vimeo-*`. Don't touch JS. Fullscreen-overlay video lightbox triggered from any button — strong fit for the Insights media-pill "See" feature (single shared lightbox, many open triggers).

## Dependencies
```html
<script src="https://player.vimeo.com/api/player.js"></script>
```
Vimeo Player SDK. No GSAP.

## Required custom properties (on `.vimeo-lightbox` — swap to V+V purple)
```css
.vimeo-lightbox {
  --timeline-rounded-corners: 1.5em;
  --timeline-dot-height: 0.75em;
  --timeline-dot-color: #FF4C24;   /* → --purple */
  --progress-bg: rgba(239, 238, 236, 0.2);
  --progress-fill-bg: #FF4C24;     /* → --purple */
  --progress-height: 0.2em;
}
```

## Attribute contract
- One lightbox container `[data-vimeo-lightbox-init]` per page (the overlay).
- Open triggers (anywhere): `[data-vimeo-lightbox-control="open"]` + `[data-vimeo-lightbox-id="<numeric>"]`; optional child `<img [data-vimeo-lightbox-placeholder]>` supplies the poster.
- Close: `[data-vimeo-lightbox-control="close"]` (also Escape).
- Sizing `[data-vimeo-update-size="true|cover"]`, `[data-vimeo-muted]`. Internal controls `[data-vimeo-control="play|pause|mute|timeline|fullscreen"]`, `[data-vimeo-duration]`.
- Runtime state: `data-vimeo-activated="false|loading|true"`, `data-vimeo-playing|loaded|fullscreen|hover`.

Open trigger example:
```html
<button data-vimeo-lightbox-control="open" data-vimeo-lightbox-id="1019191082">
  <img data-vimeo-lightbox-placeholder="" src="image.jpg" alt="">
  <span>Open Video</span>
</button>
```

## HTML (the overlay container — place once per page)
Full markup is the `.vimeo-lightbox` block: `__bg` (loading svg) → `__calc > __calc-wrap > [data-vimeo-lightbox-player] > __before, iframe, __placeholder, __dark, __play, __pause, __interface(__interface-bottom: __duration, __timeline[progress + range], __mute, __fullscreen), __loading` → `__close`. Verbatim markup in Osmo "Copy context" output (in chat log).

## CSS
Full styles in chat log / Osmo source. Key behavioral selectors:
```css
.vimeo-lightbox { z-index: 300; pointer-events: none; justify-content: center; align-items: center; padding: 5vw; display: flex; position: fixed; inset: 0; overflow: hidden; }
.vimeo-lightbox__player { ... opacity: 0; visibility: hidden; transform: scale(0.9) rotate(0.001deg); transition: all 0.3s cubic-bezier(0.625,0.05,0,1); }
.vimeo-lightbox[data-vimeo-activated="true"] .vimeo-lightbox__player { opacity: 1; visibility: visible; transform: scale(1); }
.vimeo-lightbox__bg { ... opacity: 0; visibility: hidden; }
.vimeo-lightbox[data-vimeo-activated="loading"] .vimeo-lightbox__bg,
.vimeo-lightbox[data-vimeo-activated="true"] .vimeo-lightbox__bg { opacity: 1; visibility: visible; }
.vimeo-lightbox__before { padding-top: 62.5%; }
/* timeline/progress/range styling identical to vimeo-player-advanced, using the --timeline/--progress vars */
```

## JavaScript
Full `initVimeoLightboxAdvanced()` — single container, queries all `[data-vimeo-lightbox-control="open"]`, builds iframe src per clicked `data-vimeo-lightbox-id`, full reset (swap iframe) when switching videos, aspect/cover sizing, timeline + duration + mute + fullscreen + hover wiring, Escape/close. Verbatim body in Osmo "Copy context" output (in chat log). Self-inits on DOMContentLoaded.
