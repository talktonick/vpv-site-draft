# Vimeo Setup — ambient-loop video for media blocks

One-time site setup + the per-video config for the **Media — Single (video)** option (and any
other Vimeo block). Uses the Osmo **Vimeo Player (Advanced)** island (autoplay mode) — full
code in `osmo/vimeo-player-advanced.md` / your Osmo "Copy context".

## A. One-time site setup

### A1 — Footer scripts (Project Settings → Custom Code → Footer, before `</body>`)
```html
<!-- Vimeo SDK -->
<script src="https://player.vimeo.com/api/player.js"></script>
<!-- Advanced player init (paste initVimeoPlayer() from osmo/vimeo-player-advanced.md) -->
<script> /* initVimeoPlayer() { … } + DOMContentLoaded call */ </script>
```

### A2 — Player CSS (into the Global Canvas CSS embed)
1. Paste the full **Vimeo Player (Advanced) CSS** (from the Osmo resource).
2. The V+V recolor (timeline/dot → purple) is already in `global-css.css`.
3. Add these **ambient tweaks**:
```css
/* AREA17 touch: darken the play/pause button when hovering the button itself */
.vimeo-player__btn { transition: background-color .2s linear; }
.vimeo-player__btn:hover { background-color: #64646466; }   /* darker than default #64646433 */

/* Ambient loop: hide the bottom control bar (timeline/mute/fullscreen); keep hover pause */
.vimeo-player[data-vimeo-autoplay="true"] .vimeo-player__interface { display: none; }

/* Fill our rounded frame edge-to-edge (cover mode) + drop the player's own radius (frame clips it) */
.media-single__frame .vimeo-player { border-radius: 0; }
```

## B. Per-video: place the player inside a media frame

Build/duplicate a `media-single` block. Inside `media-single__frame` (which already has
`u-aspect-16x9` + 12px radius + overflow hidden + position relative), **remove the image** and
add an **HTML Embed** containing the Advanced player markup, with the **root element** attributes
set for ambient + cover:

```
data-vimeo-player-init        (keep)
data-vimeo-video-id="VIMEO_ID"   ← the numeric Vimeo ID
data-vimeo-autoplay="true"       ← autoplay + loop, muted
data-vimeo-update-size="cover"   ← fill the frame (frame is position:relative ✓)
data-vimeo-muted="true"
data-vimeo-playing="false" data-vimeo-activated="false" data-vimeo-loaded="false"
data-vimeo-fullscreen="false" data-vimeo-hover="false" data-vimeo-paused-by-user="false"
```
(The rest of the markup — iframe, play/pause, interface, loading SVG — stays as-is from the
Osmo resource. Don't change its internal classes.)

## C. Check
- **Publish** (Vimeo won't render in the Designer canvas — embeds don't run JS there).
- Expect: muted video autoplays + loops, filling the rounded 16:9 frame; a semi-transparent
  pause button fades in on hover and darkens when you hover it; no bottom control bar.
- Scroll it out of view → it pauses; back into view → resumes (advanced player's scroll autoplay).

## Notes / later
- **Component property for the ID:** once this works, the `data-vimeo-video-id` becomes a
  component **property** fed via a dynamic-data embed (conventions §4b) so each instance just
  sets an ID — no editing raw markup.
- Pause button is centered (Osmo default); reposition to bottom-right later if you want AREA17's
  exact placement.
- Perf: ambient autoplay is fine for 1–2 per page; don't stack many.
