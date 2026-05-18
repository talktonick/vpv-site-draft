import { programs, productsForProgram } from '../data.js';
import { setState, subscribe } from '../state.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

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

function radiusFor(count) {
  return 12 + Math.min(count, 8) * 1.5;
}

export function renderVisualLanding() {
  const nodesG = document.getElementById('ng-nodes');
  const connectorsG = document.getElementById('ng-connectors');
  const dividerG = document.getElementById('ng-divider');
  nodesG.innerHTML = '';
  if (connectorsG) connectorsG.innerHTML = '';
  if (dividerG) dividerG.removeAttribute('visibility');

  for (const p of programs) {
    const count = productsForProgram(p.id).length;
    const r = radiusFor(count);

    const group = s('g', {
      class: 'node-group',
      'data-program': p.id,
      transform: `translate(${p.x}, ${p.y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': `${p.name} — ${count} products`,
      onclick: () => setState({ activeProgram: p.id, view: 'program' }),
      onmouseenter: () => setState({ hoverProgram: p.id }),
      onmouseleave: () => setState({ hoverProgram: null }),
      onkeydown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setState({ activeProgram: p.id, view: 'program' });
        }
      },
    });

    // Background pill for the program label — invisible by default, becomes a
    // purple pill when the node is hovered/active. Sized after the text
    // measures so the pill hugs the name.
    const labelY = -r - 12;
    const bg = s('rect', {
      class: 'node-label-bg',
      x: -60, y: labelY - 14,
      width: 120, height: 22,
      rx: 11, ry: 11,
    });
    const label = s('text', { class: 'node-label', x: 0, y: labelY }, p.name);

    group.append(bg, label,
      s('circle', { class: 'node-circle', r }),
      s('text', { class: 'node-sublabel node-sublabel--count', x: 0, y: r + 24 },
        `${count} ${count === 1 ? 'product' : 'products'}`),
    );

    nodesG.append(group);

    // Once mounted, size the bg pill to match the actual rendered label width.
    requestAnimationFrame(() => {
      try {
        const box = label.getBBox();
        const padX = 12, padY = 5;
        bg.setAttribute('x', box.x - padX);
        bg.setAttribute('y', box.y - padY);
        bg.setAttribute('width',  box.width  + padX * 2);
        bg.setAttribute('height', box.height + padY * 2);
        const r = (box.height + padY * 2) / 2;
        bg.setAttribute('rx', r);
        bg.setAttribute('ry', r);
      } catch (e) {}
    });
  }
}

// Subscribe once at module load — apply hover/active state to whatever
// node-group elements currently exist (landing nodes).
subscribe((next) => {
  if (next.view !== 'landing') return;
  const graph = document.getElementById('node-graph');
  const nodesG = document.getElementById('ng-nodes');
  if (!graph || !nodesG) return;
  graph.setAttribute('data-hover-active', next.hoverProgram ? 'true' : 'false');
  for (const g of nodesG.querySelectorAll('.node-group')) {
    const id = g.getAttribute('data-program');
    if (next.hoverProgram && id === next.hoverProgram) g.setAttribute('data-state', 'linked');
    else g.removeAttribute('data-state');
    if (next.activeProgram === id) g.setAttribute('aria-current', 'true');
    else g.removeAttribute('aria-current');
  }
});
