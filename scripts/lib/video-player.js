// Custom HTML5 video player. Returns a DOM node ready to insert into the modal.

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

function formatTime(t) {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function createVideoPlayer({ src, caption = '', poster = '' }) {
  const video = el('video', { class: 'media-video__el', src, playsinline: '', preload: 'metadata', poster: poster || false });

  const playBtn = el('button', {
    type: 'button',
    class: 'media-video__play',
    'aria-label': 'Play',
    onclick: () => { if (video.paused) video.play(); else video.pause(); },
  }, '▶');

  const muteBtn = el('button', {
    type: 'button',
    class: 'media-video__mute',
    'aria-label': 'Mute',
    onclick: () => { video.muted = !video.muted; },
  }, '♪');

  const time = el('span', { class: 'media-video__time' }, '0:00 / 0:00');

  const fill = el('div', { class: 'media-video__fill' });
  const scrub = el('div', { class: 'media-video__scrub', role: 'slider', tabindex: '0' }, fill);

  let scrubbing = false;
  function seekFromEvent(e) {
    const rect = scrub.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : (e.touches?.[0]?.clientX ?? 0)) - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    if (isFinite(video.duration)) video.currentTime = ratio * video.duration;
  }
  scrub.addEventListener('mousedown', (e) => { scrubbing = true; seekFromEvent(e); });
  document.addEventListener('mousemove', (e) => { if (scrubbing) seekFromEvent(e); });
  document.addEventListener('mouseup', () => { scrubbing = false; });
  scrub.addEventListener('click', seekFromEvent);

  video.addEventListener('play',  () => { playBtn.textContent = '❚❚'; playBtn.setAttribute('aria-label', 'Pause'); });
  video.addEventListener('pause', () => { playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'Play'); });
  video.addEventListener('volumechange', () => {
    muteBtn.textContent = video.muted ? '♪̸' : '♪';
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  });
  video.addEventListener('timeupdate', () => {
    if (!isFinite(video.duration)) return;
    fill.style.width = `${(video.currentTime / video.duration) * 100}%`;
    time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });
  video.addEventListener('loadedmetadata', () => {
    time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });
  video.addEventListener('error', () => {
    captionNode.textContent = 'Video failed to load. The source may be expired or unavailable.';
  });

  const controls = el('div', { class: 'media-video__controls' },
    playBtn,
    scrub,
    time,
    muteBtn,
  );

  const captionNode = caption ? el('p', { class: 'media-video__caption' }, caption) : null;

  return el('div', { class: 'media-video' },
    el('div', { class: 'media-video__frame' }, video),
    controls,
    captionNode,
  );
}

// Background video for the homepage hero. Autoplay + loop + muted by default.
// Pause / mute controls match the modal player's glyphs.
export function createBackgroundVideo({ src, poster = '' }) {
  const video = el('video', {
    class: 'bg-video__el',
    src,
    autoplay: '', loop: '', muted: '', playsinline: '',
    preload: 'auto',
    poster: poster || false,
  });
  video.muted = true;

  const playBtn = el('button', {
    type: 'button',
    class: 'bg-video__btn bg-video__btn--play',
    'aria-label': 'Pause',
    onclick: () => { if (video.paused) video.play(); else video.pause(); },
  }, '❚❚');

  const muteBtn = el('button', {
    type: 'button',
    class: 'bg-video__btn bg-video__btn--mute',
    'aria-label': 'Unmute',
    onclick: () => { video.muted = !video.muted; },
  }, '♪̸');

  video.addEventListener('play',  () => { playBtn.textContent = '❚❚'; playBtn.setAttribute('aria-label', 'Pause'); });
  video.addEventListener('pause', () => { playBtn.textContent = '▶';  playBtn.setAttribute('aria-label', 'Play'); });
  video.addEventListener('volumechange', () => {
    muteBtn.textContent = video.muted ? '♪̸' : '♪';
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  });

  // Belt-and-suspenders: kick the play() once metadata is ready in case
  // autoplay was deferred. Swallow errors — the button still lets users start.
  video.addEventListener('loadedmetadata', () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, { once: true });

  return {
    video,
    controls: el('div', { class: 'bg-video__controls' }, muteBtn, playBtn),
  };
}
