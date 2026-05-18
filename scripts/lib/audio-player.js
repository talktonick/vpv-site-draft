// Audio player based on the sandbox .voice-pill chrome.
// Real <audio> playback with a circular outline progress trace.
// If src is empty or load fails, renders a graceful "audio coming soon" state.

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

export function createAudioPlayer({ src, speaker = {}, title = '', transcript = '' }) {
  const hasSrc = !!src;
  const audio = hasSrc
    ? el('audio', { src, preload: 'metadata' })
    : null;

  const button = el('button', {
    type: 'button',
    class: 'voice-pill__button',
    'aria-label': hasSrc ? 'Play' : 'Audio unavailable',
    disabled: hasSrc ? false : true,
    onclick: () => { if (!audio) return; if (audio.paused) audio.play(); else audio.pause(); },
  }, '▶');

  const name = speaker.name ? el('p', { class: 'voice-pill__name' }, speaker.name) : null;
  const role = speaker.role ? el('p', { class: 'voice-pill__role' }, speaker.role) : null;
  const titleNode = title ? el('p', { class: 'voice-pill__title' }, title) : null;

  // SVG progress track — outlines the pill perimeter
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'voice-pill__track');
  svg.setAttribute('viewBox', '0 0 100 28');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('class', 'voice-pill__progress');
  rect.setAttribute('x', '0.75'); rect.setAttribute('y', '0.75');
  rect.setAttribute('width', '98.5'); rect.setAttribute('height', '26.5');
  rect.setAttribute('rx', '13.25'); rect.setAttribute('ry', '13.25');
  rect.setAttribute('pathLength', '100');
  rect.setAttribute('stroke-dasharray', '0 100');
  svg.append(rect);

  if (audio) {
    audio.addEventListener('play',  () => { button.textContent = '❚❚'; button.setAttribute('aria-label', 'Pause'); });
    audio.addEventListener('pause', () => { button.textContent = '▶'; button.setAttribute('aria-label', 'Play'); });
    audio.addEventListener('timeupdate', () => {
      if (!isFinite(audio.duration)) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      rect.setAttribute('stroke-dasharray', `${pct} ${100 - pct}`);
    });
    audio.addEventListener('error', () => {
      button.disabled = true;
      button.setAttribute('aria-label', 'Audio failed to load');
      button.textContent = '!';
    });
  }

  const pill = el('div', { class: 'voice-pill' + (hasSrc ? '' : ' voice-pill--unavailable'), 'data-state': 'idle' },
    svg,
    button,
    el('div', { class: 'voice-pill__meta' }, name, role, titleNode),
    audio,
  );

  if (!hasSrc) {
    pill.append(el('p', { class: 'voice-pill__notice' }, 'Audio recording coming soon. Transcript available below.'));
  }
  if (transcript) {
    pill.append(el('details', { class: 'voice-pill__transcript' },
      el('summary', {}, 'Transcript'),
      el('p', {}, transcript),
    ));
  }

  return pill;
}
