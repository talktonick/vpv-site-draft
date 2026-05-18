// Case study — Standard view.
// Renders into #case-standard inside the shared #view-case stage.

import { getCase, getProgram, getProduct } from '../data.js';
import { setState } from '../state.js';

const root = document.getElementById('case-standard');

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

function img(src, alt = '') {
  return el('img', { src, alt, loading: 'lazy' });
}

function hero(cs) {
  const eyebrow = [cs.year, cs.industry].filter(Boolean).join(' · ');
  return el('header', { class: 'case-hero case-study-section' },
    eyebrow ? el('p', { class: 'case-hero__eyebrow' }, eyebrow) : null,
    el('h1', { class: 'case-hero__headline' }, cs.name),
    cs.summary ? el('p', { class: 'case-hero__lead' }, cs.summary) : null,
    cs.hero ? el('div', { class: 'case-hero__image' }, img(cs.hero, `${cs.name} hero`)) : null,
  );
}

function metrics(cs) {
  if (!cs.metrics || !cs.metrics.length) return null;
  return el('section', { class: 'case-metrics case-study-section' },
    ...cs.metrics.map(m => el('div', { class: 'case-metric' },
      el('div', { class: 'case-metric__number' }, m.value),
      el('div', { class: 'case-metric__label' }, m.label),
    )),
  );
}

function prose(eyebrow, headline, body) {
  if (!body) return null;
  return el('section', { class: 'case-section case-study-section case-study-section--reading' },
    el('p', { class: 'case-section__eyebrow' }, eyebrow),
    el('h2', { class: 'case-section__heading' }, headline),
    el('div', { class: 'case-section__body' }, el('p', {}, body)),
  );
}

function gallery(cs) {
  if (!cs.gallery || !cs.gallery.length) return null;
  return el('section', { class: 'case-gallery case-study-section' },
    el('p', { class: 'case-section__eyebrow' }, 'Selected work'),
    el('div', { class: 'case-gallery__grid' },
      ...cs.gallery.map(src => el('figure', { class: 'case-gallery__item' }, img(src, ''))),
    ),
  );
}

function growthFeatures(cs) {
  if (!cs.growthFeatures || !cs.growthFeatures.length) return null;
  return el('section', { class: 'case-section case-study-section' },
    el('p', { class: 'case-section__eyebrow' }, 'Growth features delivered'),
    el('ul', { class: 'growth-feature-list' },
      ...cs.growthFeatures.map(gf => el('li', { class: 'growth-feature-card' },
        el('h3', { class: 'growth-feature-card__name' }, gf.name),
        gf.desc ? el('p', { class: 'growth-feature-card__desc' }, gf.desc) : null,
      )),
    ),
  );
}

function programs(cs) {
  const items = (cs.programs || []).map(getProgram).filter(Boolean);
  if (!items.length) return null;
  return el('section', { class: 'case-section case-study-section' },
    el('p', { class: 'case-section__eyebrow' }, 'Programs'),
    el('ul', { class: 'case-related-list' },
      ...items.map(prog => el('li', {},
        el('a', {
          class: 'case-related-list__link',
          role: 'button',
          tabindex: '0',
          onclick: () => setState({ activeProgram: prog.id, view: 'program', activeProduct: null, activeCase: null }),
        },
          el('span', { class: 'case-related-list__code' }, prog.code),
          el('span', { class: 'case-related-list__name' }, prog.name),
          el('span', { class: 'case-related-list__meta' }, prog.arc),
        ),
      )),
    ),
  );
}

function products(cs) {
  const items = (cs.products || []).map(getProduct).filter(Boolean);
  if (!items.length) return null;
  return el('section', { class: 'case-section case-study-section' },
    el('p', { class: 'case-section__eyebrow' }, 'Products'),
    el('ul', { class: 'case-related-list' },
      ...items.map(prod => el('li', {},
        el('a', {
          class: 'case-related-list__link case-related-list__link--simple',
          role: 'button',
          tabindex: '0',
          onclick: () => setState({ activeProduct: prod.id, view: 'product', activeCase: null }),
        },
          el('span', { class: 'case-related-list__name' }, prod.name),
        ),
      )),
    ),
  );
}

export function renderCaseStandard(caseId) {
  const cs = getCase(caseId);
  if (!cs) { root.innerHTML = ''; return; }
  root.innerHTML = '';
  root.append(
    hero(cs),
    metrics(cs),
    prose('The challenge', 'What stood in the way.', cs.challenge),
    gallery(cs),
    prose('The approach', 'How we worked.', cs.approach),
    growthFeatures(cs),
    prose('The outcome', 'Where it landed.', cs.outcome),
    programs(cs),
    products(cs),
  );
}
