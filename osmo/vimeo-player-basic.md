# Osmo Island — Custom Vimeo Player (Basic)

Source: https://www.osmo.supply/resource/custom-vimeo-player-basic
**Island rule:** keep `vimeo-player__*` + `data-vimeo-*`. Don't touch JS. Inline player (not a lightbox). Candidate for embedded article video. NOTE: shares the `.vimeo-player` block with the Advanced player — use only ONE of basic/advanced per page.

## Dependencies
```html
<script src="https://player.vimeo.com/api/player.js"></script>
```
Vimeo Player SDK. No GSAP.

## Attribute contract
- `[data-vimeo-player-init]` root + `data-vimeo-video-id="<numeric>"` + `data-vimeo-update-size="true|cover|false"` + `data-vimeo-muted`.
- Controls `[data-vimeo-control="play|pause"]`. State attrs `data-vimeo-playing|activated|loaded` driven by JS.

## HTML
```html
<div class="vimeo-player" data-vimeo-player-init="" data-vimeo-video-id="1019191082" data-vimeo-update-size="true" data-vimeo-playing="false" data-vimeo-activated="false" data-vimeo-loaded="false" data-vimeo-muted="false">
  <div class="vimeo-player__before"></div>
  <iframe src="" width="640" height="360" frameborder="0" allowfullscreen="true" allow="autoplay; encrypted-media" class="vimeo-player__iframe"></iframe>
  <img src="...placeholder.avif" loading="eager" alt="" class="vimeo-player__placeholder">
  <div class="vimeo-player__dark"></div>
  <div class="vimeo-player__play" data-vimeo-control="play"><div class="vimeo-player__btn"><svg class="vimeo-player__btn-play-svg" xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.38178 6.13982C6.40762 5.94017 6.48425 5.74878 6.60555 5.58089C6.72686 5.413 6.88949 5.27326 7.08049 5.17279C7.2715 5.07232 7.48559 5.01391 7.70574 5.00219C7.92587 4.99048 8.14597 5.02579 8.3485 5.10532C9.37235 5.50436 11.6669 6.45272 14.5784 7.98469C17.4908 9.51754 19.5395 10.8562 20.4294 11.4635C21.1891 11.9829 21.191 13.013 20.4304 13.5342C19.5491 14.1381 17.5256 15.4591 14.5784 17.0113C11.6283 18.5635 9.36078 19.5005 8.34657 19.8942C7.47311 20.2343 6.49554 19.7183 6.38178 18.8597C6.24873 17.856 6 15.5769 6 12.4989C6 9.42262 6.24777 7.14443 6.38178 6.13982Z" fill="currentColor"></path></svg></div></div>
  <div class="vimeo-player__pause" data-vimeo-control="pause"><div class="vimeo-player__btn"><svg class="vimeo-player__btn-pause-svg" xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none"><path d="M8 6.5C8 6.22386 8.22386 6 8.5 6H10.5C10.7761 6 11 6.22386 11 6.5V17.5C11 17.7761 10.7761 18 10.5 18H8.5C8.22386 18 8 17.7761 8 17.5V6.5Z" fill="currentColor"></path><path d="M14 6.5C14 6.22386 14.2239 6 14.5 6H16.5C16.7761 6 17 6.22386 17 6.5V17.5C17 17.7761 16.7761 18 16.5 18H14.5C14.2239 18 14 17.7761 14 17.5V6.5Z" fill="currentColor"></path></svg></div></div>
  <div class="vimeo-player__loading"><svg class="vimeo-player__loading-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewbox="0 0 100 100" width="100%"><path fill="currentColor" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"></path><animatetransform attributename="transform" attributetype="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatcount="indefinite"></animatetransform></svg></div>
</div>
```

## CSS
```css
.vimeo-player { pointer-events: auto; color: #efeeec; isolation: isolate; background-color: #131313; border-radius: 1em; justify-content: center; align-items: center; width: min(60em, 100vw - 1.5em); display: flex; position: relative; overflow: hidden; transform: translateX(0); }
.vimeo-player[data-vimeo-update-size="cover"] { width: 100%; min-width: 100%; max-width: 100%; height: 100%; min-height: 100%; max-height: 100%; }
.vimeo-player__iframe { pointer-events: none; width: 100%; height: 100%; position: absolute; }
.vimeo-player__before { padding-top: 62.5%; }
.vimeo-player__placeholder { object-fit: cover; width: 100%; height: 100%; transition: opacity .3s linear; display: block; position: absolute; }
.vimeo-player[data-vimeo-activated="true"][data-vimeo-loaded="true"] .vimeo-player__placeholder { opacity: 0; }
.vimeo-player__dark { opacity: .5; pointer-events: none; background-color: #131313; width: 100%; height: 100%; transition: opacity .3s linear; position: absolute; }
.vimeo-player[data-vimeo-playing="false"] .vimeo-player__dark { opacity: 0.33; }
.vimeo-player[data-vimeo-activated="false"][data-vimeo-playing="false"] .vimeo-player__dark { opacity: 0; }
.vimeo-player[data-vimeo-activated="true"][data-vimeo-loaded="true"] .vimeo-player__dark { opacity: 0; }
@media (hover: hover) and (pointer: fine) { .vimeo-player:hover .vimeo-player__dark { opacity: 0.33 !important; } }
.vimeo-player__play, .vimeo-player__pause { cursor: pointer; justify-content: center; align-items: center; width: 100%; height: 100%; display: flex; position: absolute; }
.vimeo-player__btn { -webkit-backdrop-filter: blur(1em); backdrop-filter: blur(1em); background-color: #64646433; border-radius: 50%; justify-content: center; align-items: center; width: 9em; height: 9em; transition: opacity .3s linear; display: flex; position: relative; }
.vimeo-player__btn-play-svg { width: 40%; }
.vimeo-player__btn-pause-svg { width: 50%; }
.vimeo-player .vimeo-player__pause { display: none; }
.vimeo-player[data-vimeo-playing="true"] .vimeo-player__pause { display: flex; }
.vimeo-player .vimeo-player__pause .vimeo-player__btn { opacity: 0; }
.vimeo-player[data-vimeo-activated="true"][data-vimeo-playing="false"] .vimeo-player__pause .vimeo-player__btn,
.vimeo-player[data-vimeo-activated="true"][data-vimeo-playing="true"]:hover .vimeo-player__pause .vimeo-player__btn { opacity: 1; }
@media (hover: none) and (pointer: coarse) { .vimeo-player[data-vimeo-activated="true"][data-vimeo-playing="true"] .vimeo-player__pause .vimeo-player__btn { opacity: 0 !important; } }
.vimeo-player[data-vimeo-playing="true"] .vimeo-player__play { opacity: 0; }
.vimeo-player__loading-svg { width: 9em; }
.vimeo-player__loading { pointer-events: none; color: #00ADEF; justify-content: center; align-items: center; width: 100%; height: 100%; transition: opacity .3s linear; display: flex; position: absolute; opacity: 0; }
.vimeo-player[data-vimeo-playing="true"] .vimeo-player__loading { opacity: 1; }
.vimeo-player[data-vimeo-playing="true"][data-vimeo-loaded="true"] .vimeo-player__loading { opacity: 0; }
```

## JavaScript
```js
function initVimeoPlayer() {
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-player-init]');
  vimeoPlayers.forEach(function(vimeoElement, index) {
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;
    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=0&muted=1`;
    vimeoElement.querySelector('iframe').setAttribute('src', vimeoVideoURL);
    const videoIndexID = 'vimeo-player-basic-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);
    const iframeID = vimeoElement.id;
    const player = new Vimeo.Player(iframeID);
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
      player.getVideoWidth().then(function(width) {
        player.getVideoHeight().then(function(height) {
          const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
          if (beforeEl) beforeEl.style.paddingTop = (height / width) * 100 + '%';
        });
      });
    }
    let videoAspectRatio;
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'cover') {
      player.getVideoWidth().then(function(width) {
        player.getVideoHeight().then(function(height) {
          videoAspectRatio = height / width;
          const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
          if (beforeEl) beforeEl.style.paddingTop = '0%';
          adjustVideoSizing();
        });
      });
    }
    function adjustVideoSizing() {
      const containerRatio = vimeoElement.offsetHeight / vimeoElement.offsetWidth;
      const iframeWrapper = vimeoElement.querySelector('.vimeo-player__iframe');
      if (iframeWrapper && videoAspectRatio) {
        if (containerRatio > videoAspectRatio) { iframeWrapper.style.width = (containerRatio / videoAspectRatio) * 100 + '%'; iframeWrapper.style.height = '100%'; }
        else { iframeWrapper.style.height = (videoAspectRatio / containerRatio) * 100 + '%'; iframeWrapper.style.width = '100%'; }
      }
    }
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'cover') window.addEventListener('resize', adjustVideoSizing);
    player.on('play', function() { vimeoElement.setAttribute('data-vimeo-loaded', 'true'); vimeoElement.setAttribute('data-vimeo-playing', 'true'); });
    function vimeoPlayerPlay() { vimeoElement.setAttribute('data-vimeo-activated', 'true'); vimeoElement.setAttribute('data-vimeo-playing', 'true'); player.play(); }
    function vimeoPlayerPause() { player.pause(); }
    player.on('pause', function() { vimeoElement.setAttribute('data-vimeo-playing', 'false'); });
    const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
    if (playBtn) playBtn.addEventListener('click', function() {
      player.setVolume(0); vimeoPlayerPlay();
      if (vimeoElement.getAttribute('data-vimeo-muted') === 'true') player.setVolume(0); else player.setVolume(1);
    });
    const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
    if (pauseBtn) pauseBtn.addEventListener('click', function() { vimeoPlayerPause(); });
    player.on('pause', function() { vimeoElement.setAttribute('data-vimeo-playing', 'false'); });
    function vimeoOnEnd() { vimeoElement.setAttribute('data-vimeo-activated', 'false'); vimeoElement.setAttribute('data-vimeo-playing', 'false'); player.unload(); }
    player.on('ended', vimeoOnEnd);
  });
}

document.addEventListener('DOMContentLoaded', function() { initVimeoPlayer(); });
```
