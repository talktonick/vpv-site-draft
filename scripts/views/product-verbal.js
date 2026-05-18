import { getProduct, getProgram, caseStudiesForProduct } from '../data.js';
import { setState } from '../state.js';

const root = document.getElementById('product-detail-verbal');

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

function metaStrip(product) {
  const items = [];
  if (product.duration) items.push(product.duration);
  if (product.subcategory) items.push(product.subcategory);
  if (!items.length) return null;
  return el('div', { class: 'product-meta' },
    ...items.map((t, i) => el('span', { class: 'product-meta__item' }, t)),
  );
}

function renderHeader(product) {
  const eyebrow = [];
  if (product.code) eyebrow.push(product.code);
  if (product.category) eyebrow.push(product.category);

  return el('header', { class: 'product-header' },
    eyebrow.length ? el('p', { class: 'product-header__eyebrow' }, eyebrow.join(' · ')) : null,
    el('h1', { class: 'product-header__title' }, product.name),
    product.description ? el('p', { class: 'product-header__tagline' }, product.description) : null,
    metaStrip(product),
  );
}

function renderOutput(product) {
  if (!product.output) return null;
  return el('section', { class: 'product-section' },
    el('h2', { class: 'product-section__heading' }, 'Output'),
    el('p', { class: 'product-section__body' }, product.output),
  );
}

function renderPhases(product) {
  if (!product.phases || product.phases.length === 0) return null;
  return el('section', { class: 'product-section product-section--phases' },
    el('h2', { class: 'product-section__heading' }, 'Engagement'),
    el('ol', { class: 'product-phases' },
      ...product.phases.map((phase, i) => el('li', { class: 'product-phase' },
        el('span', { class: 'product-phase__num' }, String(i + 1).padStart(2, '0')),
        el('div', { class: 'product-phase__body' },
          el('h3', { class: 'product-phase__name' }, phase.name),
          el('ul', { class: 'product-phase__items' },
            ...phase.items.map(item => el('li', { class: 'product-phase__item' },
              el('h4', { class: 'product-phase__item-title' }, item.title),
              item.body ? el('p', { class: 'product-phase__item-body' }, item.body) : null,
            ))
          ),
        ),
      )),
    ),
  );
}

function renderPrograms(product) {
  const ids = product.programs || [];
  if (!ids.length) return null;
  const programs = ids.map(getProgram).filter(Boolean);
  if (!programs.length) return null;

  return el('section', { class: 'product-section' },
    el('h2', { class: 'product-section__heading' }, 'In Programs'),
    el('ul', { class: 'product-related' },
      ...programs.map(prog => el('li', {},
        el('a', {
          class: 'product-related__link',
          role: 'button',
          tabindex: '0',
          onclick: () => setState({ activeProgram: prog.id, view: 'program', activeProduct: null }),
        },
          el('span', { class: 'product-related__code' }, prog.code),
          el('span', { class: 'product-related__name' }, prog.name),
          el('span', { class: 'product-related__meta' }, prog.arc),
        )
      )),
    ),
  );
}

function renderCaseStudies(product) {
  const cases = caseStudiesForProduct(product.id);
  if (!cases.length) return null;

  return el('section', { class: 'product-section' },
    el('h2', { class: 'product-section__heading' }, 'Featured In'),
    el('ul', { class: 'product-related' },
      ...cases.map(cs => el('li', {},
        el('a', {
          class: 'product-related__link',
          role: 'button',
          tabindex: '0',
          onclick: () => cs.id && setState({ activeCase: cs.id, view: 'case' }),
        },
          el('span', { class: 'product-related__name' }, cs.name),
          el('span', { class: 'product-related__meta' }, cs.industry || ''),
        )
      )),
    ),
  );
}

export function renderProductVerbal(productId) {
  const product = getProduct(productId);
  if (!product) { root.innerHTML = ''; return; }
  root.innerHTML = '';
  root.append(
    renderHeader(product),
    renderOutput(product),
    renderPhases(product),
    renderPrograms(product),
    renderCaseStudies(product),
  );
}
