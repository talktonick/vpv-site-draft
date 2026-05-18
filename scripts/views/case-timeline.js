// Case study — Timeline view.
// Renders a sticky SVG bar with three node sizes (major / ongoing / feature)
// above the scrolling sections. Click a node → smooth-scroll to its section.

import { getCase } from '../data.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 1200;
const VIEW_H = 100;
const BAR_Y = 50;
const PAD_X = 80;

const heroRoot = document.getElementById('case-timeline-hero');
const svgRoot = document.getElementById('engagement-graph');
const legendRoot = document.getElementById('engagement-legend');
const sectionsRoot = document.getElementById('engagement-sections');

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

function s(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.setAttribute('class', v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

const NODE_SIZE = { major: 10, ongoing: 7, feature: 5 };

function renderHero(cs) {
  heroRoot.innerHTML = '';
  const eyebrow = [cs.year, cs.industry].filter(Boolean).join(' · ');
  heroRoot.append(
    eyebrow ? el('p', { class: 'case-hero__eyebrow' }, eyebrow) : null,
    el('h1', { class: 'case-hero__headline' }, cs.name),
    cs.summary ? el('p', { class: 'case-hero__lead' }, cs.summary) : null,
  );
}

function renderSvg(timeline) {
  svgRoot.innerHTML = '';
  svgRoot.setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);

  // Spine
  svgRoot.append(s('line', {
    class: 'engagement-graph__spine',
    x1: PAD_X, y1: BAR_Y, x2: VIEW_W - PAD_X, y2: BAR_Y,
  }));

  const n = timeline.length;
  timeline.forEach((evt, i) => {
    const x = PAD_X + (i / (n - 1)) * (VIEW_W - PAD_X * 2);
    const r = NODE_SIZE[evt.type] ?? 5;

    const group = s('g', {
      class: `engagement-graph__node engagement-graph__node--${evt.type}`,
      transform: `translate(${x}, ${BAR_Y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': `${evt.dateLabel}: ${evt.title}`,
      onclick: () => scrollToSection(i),
      onkeydown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToSection(i); }
      },
    });

    // Invisible hit target — bigger than the visible dot
    group.append(s('circle', { class: 'engagement-graph__hit', r: r + 14 }));
    group.append(s('circle', { class: 'engagement-graph__dot', r }));
    group.append(s('text', {
      class: 'engagement-graph__date',
      x: 0, y: -r - 14, 'text-anchor': 'middle',
    }, evt.dateLabel));

    svgRoot.append(group);
  });
}

function renderLegend() {
  legendRoot.innerHTML = '';
  const items = [
    ['major',    'Flagship moment'],
    ['ongoing',  'Continuous engagement'],
    ['feature',  'Growth feature'],
  ];
  legendRoot.append(...items.map(([type, label]) => el('div', { class: 'engagement-legend__item' },
    el('span', { class: `engagement-legend__dot engagement-legend__dot--${type}` }),
    el('span', { class: 'engagement-legend__label' }, label),
  )));
}

function renderSections(cs) {
  sectionsRoot.innerHTML = '';
  cs.timeline.forEach((evt, i) => {
    const section = el('section', {
      class: 'tl-section',
      id: `tl-section-${i}`,
      'data-type': evt.type,
    },
      el('div', { class: 'tl-section__meta' },
        el('p', { class: 'tl-section__year' }, evt.year),
        el('p', { class: 'tl-section__date' }, evt.dateLabel),
        el('p', { class: `tl-section__type tl-section__type--${evt.type}` },
          evt.type === 'major' ? 'Flagship moment'
            : evt.type === 'ongoing' ? 'Continuous engagement'
            : 'Growth feature'
        ),
      ),
      el('div', { class: 'tl-section__body' },
        el('h2', { class: 'tl-section__title' }, evt.title),
        evt.product ? el('p', { class: 'tl-section__product' }, evt.product) : null,
        evt.body ? el('p', { class: 'tl-section__prose' }, evt.body) : null,
        evt.image ? el('figure', { class: 'tl-section__media' }, el('img', { src: evt.image, alt: '', loading: 'lazy' })) : null,
      ),
    );
    sectionsRoot.append(section);
  });
}

function scrollToSection(i) {
  const section = document.getElementById(`tl-section-${i}`);
  if (!section) return;
  // Scroll the stage container directly. scrollIntoView's smooth behavior is
  // unreliable when invoked from synthetic click events.
  const stage = document.querySelector('.shell__stage');
  if (!stage) return;
  const stageRect = stage.getBoundingClientRect();
  const sectRect = section.getBoundingClientRect();
  const target = stage.scrollTop + (sectRect.top - stageRect.top) - 8;
  stage.scrollTo({ top: target, behavior: 'smooth' });
}

export function renderCaseTimeline(caseId) {
  const cs = getCase(caseId);
  if (!cs || !cs.hasTimeline) {
    heroRoot.innerHTML = ''; svgRoot.innerHTML = ''; legendRoot.innerHTML = ''; sectionsRoot.innerHTML = '';
    return;
  }
  renderHero(cs);
  renderSvg(cs.timeline);
  renderLegend();
  renderSections(cs);
}

// Toggle between case sub-views (Standard / Timeline)
const standardRoot = document.getElementById('case-standard');
const timelineRoot = document.getElementById('case-timeline');

export function showCaseSubview(sub) {
  standardRoot.dataset.substate = (sub === 'standard') ? 'active' : '';
  timelineRoot.dataset.substate = (sub === 'timeline') ? 'active' : '';
}
