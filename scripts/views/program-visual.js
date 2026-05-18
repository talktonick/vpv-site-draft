// Radial program-focus view, drawn into the same #node-graph SVG used by
// the landing. Center node = program, surrounding dots = its products, with
// bezier connectors. Product labels are placed on the outside of the ring.

import { getProgram, productsForProgram } from '../data.js';
import { setState } from '../state.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CENTER_X = 600;
const CENTER_Y = 400;
const RADIUS = 260;

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

export function renderProgramVisual(programId) {
  const program = getProgram(programId);
  if (!program) return;
  const products = productsForProgram(programId);
  const count = products.length;

  const nodesG = document.getElementById('ng-nodes');
  const connectorsG = document.getElementById('ng-connectors');
  const dividerG = document.getElementById('ng-divider');
  nodesG.innerHTML = '';
  connectorsG.innerHTML = '';
  if (dividerG) dividerG.setAttribute('visibility', 'hidden');

  // Center program node
  const centerR = 36;
  const centerNode = s('g', {
    class: 'node-group',
    'data-program': program.id,
    transform: `translate(${CENTER_X}, ${CENTER_Y})`,
    'aria-current': 'true',
    role: 'img',
    'aria-label': program.name,
  },
    s('text', { class: 'node-label', x: 0, y: -centerR - 14 }, program.name),
    s('circle', { class: 'node-circle', r: centerR }),
    s('text', { class: 'node-sublabel node-sublabel--count', x: 0, y: centerR + 22 },
      `${count} ${count === 1 ? 'product' : 'products'}`),
  );
  nodesG.append(centerNode);

  // Distribute products around the ring, starting from straight-up.
  // Top half: short labels; ensure no overlap by spacing evenly.
  const angleStart = -Math.PI / 2;
  for (let i = 0; i < count; i++) {
    const prod = products[i];
    const theta = angleStart + (i / count) * Math.PI * 2;
    const x = CENTER_X + RADIUS * Math.cos(theta);
    const y = CENTER_Y + RADIUS * Math.sin(theta);

    // Bezier connector from center to product anchor
    const midX = (CENTER_X + x) / 2;
    const midY = (CENTER_Y + y) / 2;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'radial-connector');
    path.setAttribute('d',
      `M ${CENTER_X} ${CENTER_Y} C ${midX} ${CENTER_Y}, ${midX} ${y}, ${x} ${y}`);
    connectorsG.append(path);

    // Label anchor: right of dot when on right half, left when on left half
    const onRight = Math.cos(theta) >= 0;
    const labelX = onRight ? 16 : -16;
    const anchor = onRight ? 'start' : 'end';

    const group = s('g', {
      class: 'radial-product',
      transform: `translate(${x}, ${y})`,
      role: 'button',
      tabindex: '0',
      'aria-label': prod.name,
      onclick: () => setState({ activeProduct: prod.id, view: 'product' }),
    });

    const dot = s('circle', { class: 'radial-product__dot', r: 6 });
    const label = s('text', {
      class: 'radial-product__label',
      x: labelX, y: 4,
      'text-anchor': anchor,
    }, prod.name);

    // Invisible hit target spanning dot + label so the whole row is clickable.
    const hit = s('rect', { class: 'radial-product__hit' });
    group.append(hit, dot, label);
    nodesG.append(group);

    // Size the hit rect after the label measures.
    requestAnimationFrame(() => {
      try {
        const lb = label.getBBox();
        const padX = 6, padY = 6;
        const left  = onRight ? -10 : lb.x - padX;
        const width = onRight ? (lb.x + lb.width + padX + 10) : (-lb.x + padX + 10);
        hit.setAttribute('x', left);
        hit.setAttribute('y', -10);
        hit.setAttribute('width', width);
        hit.setAttribute('height', 20);
      } catch (e) {}
    });
  }
}

export function clearProgramVisual() {
  const dividerG = document.getElementById('ng-divider');
  if (dividerG) dividerG.removeAttribute('visibility');
  document.getElementById('ng-connectors').innerHTML = '';
  document.getElementById('ng-nodes').innerHTML = '';
}
