// Homepage view — full-bleed video hero with cycling client names, plus a
// pitch section below with two CTAs.

import { setState } from '../state.js';
import { createBackgroundVideo } from '../lib/video-player.js';

const root = document.getElementById('home');

// Featured clients to cycle through. The case-study id is used to route
// "View all clients" cleanly; per-client routing happens on click.
const FEATURED = [
  { name: 'Halfdays',       caseId: 'cs-halfdays' },
  { name: 'Faherty',        caseId: 'cs-faherty' },
  { name: 'Truewerk',       caseId: null },
  { name: 'Jonathan Adler', caseId: null },
];

const TOP_HEADLINE = 'We partner with the world\'s most ambitious brands to build commerce experiences they remember.';
const HERO_HEADLINE = 'We partner with';
const PITCH = 'We design the parts of commerce people remember.';
const PITCH_LEAD = 'Strategy, design, and technology for the brands setting the standard. Every program in our practice ships into someone\'s storefront.';
const VIDEO_SRC = 'assets/video/home-reel.mp4';

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

let cycleTimer = null;
let cycleIndex = 0;
let cyclePaused = false;

function buildHero() {
  const { video, controls } = createBackgroundVideo({ src: VIDEO_SRC });

  // Headline + client list overlay
  const clientList = el('ul', { class: 'home-hero__clients', 'aria-label': 'Featured clients' },
    ...FEATURED.map((c, i) => el('li', {
      class: 'home-hero__client',
      'data-state': i === 0 ? 'active' : '',
      'data-index': i,
      onclick: () => {
        cyclePaused = true;
        setActive(i);
        if (c.caseId) setState({ view: 'case', activeCase: c.caseId, caseView: 'standard' });
      },
    }, c.name)),
  );

  const headline = el('h1', { class: 'home-hero__headline' },
    el('span', { class: 'home-hero__headline-static' }, HERO_HEADLINE),
    clientList,
  );

  const viewAll = el('a', {
    class: 'home-hero__cta',
    role: 'button', tabindex: '0',
    onclick: () => setState({ view: 'browse', activeBrowse: 'cases', browseFilters: {} }),
  }, 'View all clients');

  return el('section', { class: 'home-hero' },
    el('div', { class: 'home-hero__media' },
      video,
      el('div', { class: 'home-hero__scrim', 'aria-hidden': 'true' }),
      controls,
    ),
    el('div', { class: 'home-hero__overlay' },
      headline,
      viewAll,
    ),
  );
}

function setActive(idx) {
  cycleIndex = idx;
  const items = root.querySelectorAll('.home-hero__client');
  items.forEach((li, i) => {
    li.dataset.state = i === idx ? 'active' : '';
  });
}

function startCycle() {
  stopCycle();
  cycleTimer = setInterval(() => {
    if (cyclePaused) return;
    cycleIndex = (cycleIndex + 1) % FEATURED.length;
    setActive(cycleIndex);
  }, 2800);
}

function stopCycle() {
  if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
}

function buildPitch() {
  return el('section', { class: 'home-pitch' },
    el('h2', { class: 'home-pitch__headline' }, PITCH),
    el('p', { class: 'home-pitch__lead' }, PITCH_LEAD),
    el('div', { class: 'home-pitch__ctas' },
      el('a', {
        class: 'button button--primary',
        role: 'button', tabindex: '0',
        href: 'mailto:hello@verbalvisual.com',
      }, 'Talk to us'),
      el('a', {
        class: 'button button--ghost',
        role: 'button', tabindex: '0',
        onclick: () => setState({ view: 'landing' }),
      }, "Don't talk to us"),
    ),
  );
}

function buildTopHeadline() {
  return el('section', { class: 'home-intro' },
    el('h1', { class: 'home-intro__headline' }, TOP_HEADLINE),
  );
}

export function renderHome() {
  root.innerHTML = '';
  root.append(buildTopHeadline(), buildHero(), buildPitch());
  cycleIndex = 0;
  cyclePaused = false;
  setActive(0);
  startCycle();
}

export function teardownHome() {
  stopCycle();
}
