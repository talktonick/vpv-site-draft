# Osmo Island — Audio Player (Howler.js)

Source: https://www.osmo.supply/resource/audio-player-howler
**Island rule:** keep `howler-player__*` classes + `data-howler-*` contract. Candidate for the Insights media-pill "Hear" feature. Note V+V's own `.voice-pill` exists — decide at build whether to use this island or the existing system component.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js"></script>
```
Howler 2.2.4. No GSAP. Multiple players supported (auto-pause others on play).

## Attribute contract
- `[data-howler]` root + `data-howler-src="<url>"` (audio source) + `data-howler-status` (`not-playing`/`playing`, drives play/pause icon visibility).
- `[data-howler-control="toggle-play"]`, `="timeline"` (container), `="progress"` (fill bar).
- `[data-howler-info="duration"]`, `="progress"` (elapsed time).

## HTML
```html
<div data-howler="" data-howler-src="https://osmo.b-cdn.net/resource-media/taka.mp3" data-howler-status="not-playing" class="howler-player">
  <div class="howler-player__top">
    <div class="howler-player__cover"><img src="...avif" loading="eager" alt="" class="howler-player__cover-img"></div>
    <div class="howler-player__title">
      <h2 class="howler-player__title-h2">Osmo Weekly #003</h2>
      <p class="howler-player__title-p">The Osmo Podcast</p>
    </div>
    <button data-howler-control="toggle-play" aria-label="Play Audio" aria-pressed="false" role="button" class="howler-player__btn">
      <div class="howler-player__btn-play"><span class="howler-player__btn-span">Play</span><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 42 42" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4027 10.7448C11.4468 10.3954 11.5777 10.0605 11.785 9.76668C11.9922 9.47288 12.27 9.22833 12.5963 9.05251C12.9226 8.87669 13.2884 8.77446 13.6645 8.75396C14.0405 8.73346 14.4165 8.79526 14.7625 8.93444C16.5116 9.63275 20.4314 11.2924 25.4052 13.9733C30.3807 16.6558 33.8804 18.9984 35.4006 20.0612C36.6985 20.9703 36.7018 22.773 35.4024 23.6851C33.8969 24.7417 30.44 27.0536 25.4052 29.7699C20.3655 32.4862 16.4918 34.1259 14.7592 34.815C13.2671 35.4102 11.597 34.5072 11.4027 33.0046C11.1754 31.2481 10.7505 27.2597 10.7505 21.8731C10.7505 16.4897 11.1738 12.5029 11.4027 10.7448Z" fill="currentColor"></path></svg></div>
      <div class="howler-player__btn-pause"><span class="howler-player__btn-span">Pause</span><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none"><path d="M6 5.58333C6 5.26117 6.29848 5 6.66667 5H9.33333C9.70147 5 10 5.26117 10 5.58333V18.4167C10 18.7388 9.70147 19 9.33333 19H6.66667C6.29848 19 6 18.7388 6 18.4167V5.58333Z" fill="currentColor"></path><path d="M14 5.58333C14 5.26117 14.2985 5 14.6667 5H17.3333C17.7015 5 18 5.26117 18 5.58333V18.4167C18 18.7388 17.7015 19 17.3333 19H14.6667C14.2985 19 14 18.7388 14 18.4167V5.58333Z" fill="currentColor"></path></svg></div>
    </button>
  </div>
  <div class="howler-player__bottom">
    <span data-howler-info="progress" aria-live="polite" class="howler-player__time">0:00</span>
    <div data-hover="" data-howler-control="timeline" role="progressbar" aria-label="Audio Progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" class="howler-player__timeline">
      <div class="howler-player__timeline-back"></div>
      <div data-howler-control="progress" class="howler-player__timeline-progress"></div>
    </div>
    <span data-howler-info="duration" aria-hidden="true" class="howler-player__time">0:00</span>
  </div>
</div>
```

## CSS
```css
.howler-player { grid-column-gap: 1.5em; grid-row-gap: 1.5em; background-color: #efeeec; border-radius: 1.5em; flex-flow: column; flex-grow: 1; max-width: 28em; padding: 1.75em; display: flex; position: relative; }
.howler-player__top { grid-column-gap: 1.25em; grid-row-gap: 1.25em; align-items: center; display: flex; }
.howler-player__bottom { grid-column-gap: .5em; grid-row-gap: .5em; align-items: center; display: flex; }
.howler-player__btn { outline-offset: 0px; pointer-events: auto; font: inherit; color: inherit; border: 0 solid #0000; border-radius: 50%; outline: 0 #0000; flex-shrink: 0; justify-content: center; align-items: center; width: 2.75em; height: 2.75em; display: flex; position: relative; }
.howler-player__btn-play { color: #efeeec; background-color: #f04b23; border-radius: 50%; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 20% 25%; position: absolute; }
.howler-player__btn-pause { color: #efeeec; background-color: #131313; border-radius: 50%; justify-content: center; align-items: center; width: 100%; height: 100%; padding-left: 25%; padding-right: 25%; display: flex; position: absolute; }
[data-howler-status="not-playing"] .howler-player__btn-play, [data-howler-status="playing"] .howler-player__btn-pause { display: flex; }
[data-howler-status="playing"] .howler-player__btn-play, [data-howler-status="not-playing"] .howler-player__btn-pause { display: none; }
.howler-player__btn-span { opacity: 0; pointer-events: none; -webkit-user-select: none; user-select: none; position: absolute; }
.howler-player__time { opacity: .75; text-align: center; width: 3em; display: block; }
.howler-player__timeline { cursor: pointer; flex-grow: 1; justify-content: flex-start; align-items: center; height: 1em; display: flex; position: relative; }
.howler-player__timeline-progress { background-color: #f04b23; border-radius: 1em; width: 0%; height: .25em; transition: width .1s linear; position: relative; }
.howler-player__timeline-back { background-color: #d0cfcd; border-radius: 1em; width: 100%; height: .25em; position: absolute; }
.howler-player__cover { border-radius: .5em; flex-shrink: 0; width: 3.25em; height: 3.25em; position: relative; overflow: hidden; }
.howler-player__cover-img { width: 100%; height: 100%; }
.howler-player__title { grid-column-gap: .125em; grid-row-gap: .125em; flex-flow: column; flex-grow: 1; justify-content: center; display: flex; }
.howler-player__title-h2 { margin-top: 0; margin-bottom: 0; font-size: 1.375em; font-weight: 500; line-height: 1.2; }
.howler-player__title-p { opacity: .5; margin-bottom: 0; line-height: 1.2; }
```

## JavaScript
```js
function initHowlerJSAudioPlayer() {
  const howlerElements = document.querySelectorAll('[data-howler]');
  const soundInstances = {};
  howlerElements.forEach((element, index) => {
    const uniqueId = `howler-${index}`;
    element.id = uniqueId;
    element.setAttribute('data-howler-status', 'not-playing');
    const audioSrc = element.getAttribute('data-howler-src');
    const durationElement = element.querySelector('[data-howler-info="duration"]');
    const progressTextElement = element.querySelector('[data-howler-info="progress"]');
    const timelineContainer = element.querySelector('[data-howler-control="timeline"]');
    const timelineBar = element.querySelector('[data-howler-control="progress"]');
    const toggleButton = element.querySelector('[data-howler-control="toggle-play"]');
    const sound = new Howl({
      src: [audioSrc], html5: true,
      onload: () => {
        if (durationElement) durationElement.textContent = formatTime(sound.duration());
        const audioNode = sound._sounds?.[0]?._node;
        if (audioNode) {
          audioNode.addEventListener('pause', () => { if (sound.playing()) sound.pause(); });
          audioNode.addEventListener('play', () => { if (!sound.playing()) sound.play(); });
        }
      },
      onplay: () => { pauseAllExcept(uniqueId); element.setAttribute('data-howler-status', 'playing'); requestAnimationFrame(updateProgress); },
      onpause: () => element.setAttribute('data-howler-status', 'not-playing'),
      onstop: () => element.setAttribute('data-howler-status', 'not-playing'),
      onend: resetUI,
    });
    soundInstances[uniqueId] = sound;
    function updateProgress() { if (!sound.playing()) return; updateUI(); requestAnimationFrame(updateProgress); }
    function updateUI() {
      const currentTime = sound.seek() || 0;
      const duration = sound.duration() || 1;
      if (progressTextElement) progressTextElement.textContent = formatTime(currentTime);
      if (timelineBar) timelineBar.style.width = `${(currentTime / duration) * 100}%`;
      timelineContainer?.setAttribute('aria-valuenow', Math.round((currentTime / duration) * 100));
    }
    function resetUI() { if (timelineBar) timelineBar.style.width = '100%'; element.setAttribute('data-howler-status', 'not-playing'); }
    function seekToPosition(event) {
      const rect = timelineContainer.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      sound.seek(sound.duration() * percentage);
      if (!sound.playing()) { pauseAllExcept(uniqueId); sound.play(); element.setAttribute('data-howler-status', 'playing'); }
      updateUI();
    }
    function togglePlay() {
      const isPlaying = sound.playing();
      sound.playing() ? sound.pause() : (pauseAllExcept(uniqueId), sound.play());
      toggleButton?.setAttribute('aria-pressed', !isPlaying);
    }
    function pauseAllExcept(id) {
      Object.keys(soundInstances).forEach(otherId => {
        if (otherId !== id && soundInstances[otherId].playing()) {
          soundInstances[otherId].pause();
          document.getElementById(otherId)?.setAttribute('data-howler-status', 'not-playing');
        }
      });
    }
    function formatTime(seconds) { const minutes = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${minutes}:${secs.toString().padStart(2, '0')}`; }
    toggleButton?.addEventListener('click', togglePlay);
    timelineContainer?.addEventListener('click', seekToPosition);
    sound.on('seek', updateUI);
    sound.on('play', updateUI);
  });
  return soundInstances;
}

document.addEventListener('DOMContentLoaded', function() { initHowlerJSAudioPlayer(); });
```
