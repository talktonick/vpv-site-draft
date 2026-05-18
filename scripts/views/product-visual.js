// Visual product detail: header summary at top, then a three-column connection
// diagram — programs on the left, the product node in the center, case studies
// on the right, joined by purple bezier curves.

import { getProduct, getProgram, caseStudiesForProduct } from '../data.js';
import { setState } from '../state.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 1200;
const VIEW_H = 420;
const CENTER_X = 600;
const CENTER_Y = 210;
const COL_LEFT_X = 220;
const COL_RIGHT_X = 980;

const root = document.getElementById('product-detail-visual');
const nodesG = document.getElementById('pg-nodes');
const connG = document.getElementById('pg-connectors');

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

function s(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.setAttribute('class', v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

function renderHeader(product) {
  root.innerHTML = '';
  const eyebrow = [];
  if (product.code) eyebrow.push(product.code);
  if (product.category) eyebrow.push(product.category);

  root.append(
    el('header', { class: 'product-header product-header--visual' },
      eyebrow.length ? el('p', { class: 'product-header__eyebrow' }, eyebrow.join(' · ')) : null,
      el('h1', { class: 'product-header__title' }, product.name),
      product.description ? el('p', { class: 'product-header__tagline' }, product.description) : null,
    ),
  );
}

function columnLabel(x, y, label) {
  return s('text', {
    class: 'product-graph__col-label',
    x, y,
    'text-anchor': 'middle',
  }, label);
}

function bezier(x1, y1, x2, y2) {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

function distributeY(count, top = 70, bottom = 360) {
  if (count <= 1) return [(top + bottom) / 2];
  const step = (bottom - top) / (count - 1);
  return Array.from({ length: count }, (_, i) => top + step * i);
}

function renderGraph(product) {
  nodesG.innerHTML = '';
  connG.innerHTML = '';

  const programs = (product.programs || []).map(getProgram).filter(Boolean);
  const cases = caseStudiesForProduct(product.id);

  // Column labels — bold treatment to clearly mark the two columns
  if (programs.length) nodesG.append(columnLabel(COL_LEFT_X, 36, 'In programs'));
  if (cases.length)    nodesG.append(columnLabel(COL_RIGHT_X, 36, 'Featured in case studies'));

  // Center product node
  const centerR = 32;
  const centerNode = s('g', {
    class: 'product-graph__center',
    transform: `translate(${CENTER_X}, ${CENTER_Y})`,
    'aria-current': 'true',
    'aria-label': product.name,
  },
    s('circle', { class: 'product-graph__center-circle', r: centerR }),
    s('text', { class: 'product-graph__center-label', x: 0, y: centerR + 22 }, product.name),
  );
  nodesG.append(centerNode);

  // Programs on the left
  const programYs = distributeY(programs.length);
  programs.forEach((prog, i) => {
    const x = COL_LEFT_X;
    const y = programYs[i];
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'product-graph__connector');
    path.setAttribute('d', bezier(x, y, CENTER_X, CENTER_Y));
    connG.append(path);

    nodesG.append(s('g', {
      class: 'product-graph__node product-graph__node--program',
      transform: `translate(${x}, ${y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': prog.name,
      onclick: () => setState({ activeProgram: prog.id, view: 'program', activeProduct: null }),
    },
      s('circle', { class: 'product-graph__node-dot', r: 8 }),
      s('text', {
        class: 'product-graph__node-label',
        x: -16, y: 4,
        'text-anchor': 'end',
      }, prog.name),
      s('text', {
        class: 'product-graph__node-sublabel',
        x: -16, y: 22,
        'text-anchor': 'end',
      }, `${prog.code} · ${prog.arc}`),
    ));
  });

  // Case studies on the right
  const caseYs = distributeY(cases.length);
  cases.forEach((cs, i) => {
    const x = COL_RIGHT_X;
    const y = caseYs[i];
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'product-graph__connector');
    path.setAttribute('d', bezier(CENTER_X, CENTER_Y, x, y));
    connG.append(path);

    nodesG.append(s('g', {
      class: 'product-graph__node product-graph__node--case',
      transform: `translate(${x}, ${y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': cs.name,
      onclick: () => cs.id && setState({ activeCase: cs.id, view: 'case' }),
    },
      s('circle', { class: 'product-graph__node-dot', r: 8 }),
      s('text', {
        class: 'product-graph__node-label',
        x: 16, y: 4,
        'text-anchor': 'start',
      }, cs.name),
      cs.industry ? s('text', {
        class: 'product-graph__node-sublabel',
        x: 16, y: 22,
        'text-anchor': 'start',
      }, cs.industry) : null,
    ));
  });
}

export function renderProductVisual(productId) {
  const product = getProduct(productId);
  if (!product) { root.innerHTML = ''; nodesG.innerHTML = ''; connG.innerHTML = ''; return; }
  renderHeader(product);
  renderGraph(product);
}
