# Osmo Island — Play Video on Hover (Lazy)

Source: https://www.osmo.supply/resource/play-video-on-hover
**Island rule:** keep `video-card*` + `data-video-*`. Don't touch JS. Lazy: video src only fetched on first hover. Good fit for card thumbnails in browse views.

## Dependencies
None — vanilla JS.

## Attribute contract
- Wrapper `[data-video-on-hover="not-active"]` + `data-video-src="<mp4>"`. Toggles `active`/`not-active`.
- Inner `<video muted loop playsinline webkit-playsinline>` (CSS sets it `opacity:0`; `[data-video-on-hover="active"] video` → opacity 1).

## HTML
```html
<div data-video-on-hover="not-active" data-video-src="https://osmo.b-cdn.net/resource-video/whatsapp-modal-1440x900.mp4" class="video-card">
  <div class="video-card-visual">
    <img src="...avif" class="video-card-visual__img">
    <video muted loop webkit-playsinline playsinline src="" class="video-card-visual__video"></video>
  </div>
  <span class="video-card-title">WhatsApp Modal</span>
</div>
```

## CSS
```css
.video-card { gap: 1em; background-color: #f0f0f0; border-radius: .75em; flex-flow: column; width: 22em; padding: .75em .75em 1.125em; transition: background-color .2s; display: flex; }
.video-card:hover { background-color: #fff; }
.video-card-visual { aspect-ratio: 1.6; border-radius: .5em; width: 100%; position: relative; overflow: hidden; }
.video-card-visual__img { object-fit: cover; width: 100%; height: 100%; }
.video-card-visual__video { opacity: 0; width: 100%; height: 100%; padding: 0; transition: opacity .2s; position: absolute; inset: 0%; }
.video-card-title { padding-left: 0.75em; }
[data-video-on-hover="active"] video { opacity: 1; }
```

## JavaScript
```js
function initPlayVideoHover() {
  const wrappers = document.querySelectorAll('[data-video-on-hover]');
  wrappers.forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const src = wrapper.getAttribute('data-video-src') || '';
    if (!video || !src) return;
    wrapper.addEventListener('mouseenter', () => {
      if (!video.getAttribute('src')) video.setAttribute('src', src);
      wrapper.dataset.videoOnHover = 'active';
      video.play().catch(err => { console.warn('play on hover is blocked:', err); });
    });
    wrapper.addEventListener('mouseleave', () => {
      wrapper.dataset.videoOnHover = 'not-active';
      setTimeout(() => { video.pause(); video.currentTime = 0; }, 200);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => { initPlayVideoHover(); });
```
