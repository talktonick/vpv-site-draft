/* ============================================================
   V+V Video — three modes (loop · sound · hover). Native <video> in the
   mockup; in production the dev swaps in the Vimeo player but keeps the modes.
   Minimal markup: <div class="vid" data-vid-mode="loop"><video class="vid__video" src=…></video></div>
   (hover mode: add a poster <img class="vid__video"> + data-vid-src on .vid)
   Controls (play/pause, +unmute for sound, hover hint) are injected if absent.
   ============================================================ */
const VID_ICONS = {
  play:  '<svg class="vid__icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg class="vid__icon-pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  vol:   '<svg class="vid__icon-mute" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4Z"/></svg>',
  muted: '<svg class="vid__icon-unmute" viewBox="0 0 24 24" fill="currentColor"><path d="M4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.3 4.3L19 21 4.3 3Z"/></svg>',
};

function vidBuildControls(vid, mode) {
  if (vid.querySelector('.vid__controls')) return;            // explicit markup present
  if (mode === 'hover' && !vid.querySelector('.vid__hint')) {
    const hint = document.createElement('span');
    hint.className = 'vid__hint'; hint.textContent = 'Hover to play';
    vid.appendChild(hint);
  }
  const controls = document.createElement('div');
  controls.className = 'vid__controls';
  if (mode === 'sound') {
    const mute = document.createElement('button');
    mute.className = 'vid__mute'; mute.setAttribute('data-vid-mute', ''); mute.setAttribute('aria-label', 'Mute');
    mute.innerHTML = VID_ICONS.vol + VID_ICONS.muted;
    controls.appendChild(mute);
  }
  const btn = document.createElement('button');
  btn.className = 'vid__btn'; btn.setAttribute('data-vid-toggle', ''); btn.setAttribute('aria-label', 'Play/pause');
  btn.innerHTML = VID_ICONS.play + VID_ICONS.pause;
  controls.appendChild(btn);
  vid.appendChild(controls);
}

function initVideos() {
  document.querySelectorAll('[data-vid-mode]').forEach(vid => {
    const mode = vid.getAttribute('data-vid-mode');
    vidBuildControls(vid, mode);
    const video = vid.querySelector('video');
    if (!video) return;
    const src = vid.getAttribute('data-vid-src');
    const toggle = vid.querySelector('[data-vid-toggle]');
    const muteBtn = vid.querySelector('[data-vid-mute]');

    video.muted = true; video.loop = true; video.playsInline = true;
    vid.setAttribute('data-vid-muted', 'true');
    vid.setAttribute('data-vid-playing', 'false');

    const setPlaying = p => vid.setAttribute('data-vid-playing', p ? 'true' : 'false');
    const ensureSrc = () => { if (src && !video.getAttribute('src')) video.setAttribute('src', src); };
    const play = () => { ensureSrc(); const p = video.play(); if (p) p.then(() => setPlaying(true)).catch(() => {}); };
    const pause = () => { video.pause(); setPlaying(false); };

    video.addEventListener('play', () => setPlaying(true));
    video.addEventListener('pause', () => setPlaying(false));

    if (mode === 'loop' || mode === 'sound') {
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { if (video.paused && vid.dataset.vidUserPaused !== 'true') play(); }
        else pause();
      }), { threshold: 0.25 });
      io.observe(vid);
    }
    if (mode === 'hover') {
      vid.addEventListener('mouseenter', () => play());
      vid.addEventListener('mouseleave', () => { pause(); video.currentTime = 0; });
    }

    if (toggle) toggle.addEventListener('click', () => {
      if (video.paused) { vid.dataset.vidUserPaused = 'false'; play(); }
      else { vid.dataset.vidUserPaused = 'true'; pause(); }
    });
    if (muteBtn) muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      vid.setAttribute('data-vid-muted', video.muted ? 'true' : 'false');
      if (!video.muted && video.paused) play();
    });
  });
}
if (document.readyState !== 'loading') initVideos();
else document.addEventListener('DOMContentLoaded', initVideos);
