import { programs, products, productsForProgram } from '../data.js';
import { setState, subscribe, state } from '../state.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

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

const sortedProducts = () => [...products].sort((a, b) => a.name.localeCompare(b.name));

const programRefs = new Map();   // programId -> row
const productRefs = new Map();   // productId -> row
let resizeBound = false;

export function renderVerbalLanding() {
  const programsCol = document.getElementById('verbal-col-programs');
  const productsCol = document.getElementById('verbal-col-products');

  programsCol.querySelectorAll('.verbal-row').forEach(n => n.remove());
  productsCol.querySelectorAll('.verbal-row').forEach(n => n.remove());
  programRefs.clear();
  productRefs.clear();

  let leaveTimer = null;
  const cancelLeave = () => { if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; } };
  const scheduleClear = () => {
    cancelLeave();
    leaveTimer = setTimeout(() => { setState({ hoverProgram: null }); leaveTimer = null; }, 220);
  };

  for (const p of programs) {
    const row = el('div', {
      class: 'verbal-row verbal-row--program',
      'data-program': p.id,
      onclick: () => setState({ activeProgram: p.id, view: 'program' }),
      onmouseenter: () => { cancelLeave(); setState({ hoverProgram: p.id }); },
      onmouseleave: scheduleClear,
    },
      el('div', {},
        el('span', { class: 'verbal-row__code' }, p.code),
        el('span', { class: 'verbal-row__name' }, p.name),
      ),
      el('span', { class: 'verbal-row__arc' }, p.arc),
      el('span', { class: 'verbal-anchor', 'aria-hidden': 'true' }),
    );
    programsCol.append(row);
    programRefs.set(p.id, row);
  }

  for (const prod of sortedProducts()) {
    const row = el('div', {
      class: 'verbal-row verbal-row--product',
      'data-product': prod.id,
      onclick: () => setState({ activeProduct: prod.id, view: 'product' }),
      // Hovering a linked product keeps the highlight alive (mega-nav behavior).
      onmouseenter: cancelLeave,
    },
      el('div', {},
        el('span', { class: 'verbal-row__name' }, prod.name),
        el('span', { class: 'verbal-row__meta' }, ` · ${prod.engagement || ''}`),
      ),
      el('span', { class: 'verbal-anchor', 'aria-hidden': 'true' }),
    );
    productsCol.append(row);
    productRefs.set(prod.id, row);
  }

  // Clear immediately if the cursor leaves the grid entirely.
  const grid = document.getElementById('verbal-grid');
  if (grid && !grid.dataset.hoverBridge) {
    grid.addEventListener('mouseleave', () => {
      cancelLeave();
      setState({ hoverProgram: null });
    });
    grid.dataset.hoverBridge = 'true';
  }

  if (!resizeBound) {
    window.addEventListener('resize', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    resizeBound = true;
  }
  requestAnimationFrame(refresh);
}

function clearHighlight() {
  animatingProgramId = null;
  for (const row of programRefs.values()) row.removeAttribute('data-state');
  for (const row of productRefs.values()) row.removeAttribute('data-state');
  const canvas = document.getElementById('verbal-canvas');
  if (canvas) canvas.innerHTML = '';
}

function anchorCenter(row, canvasRect) {
  const a = row.querySelector('.verbal-anchor').getBoundingClientRect();
  return {
    x: a.left + a.width / 2 - canvasRect.left,
    y: a.top  + a.height / 2 - canvasRect.top,
  };
}

let animatingProgramId = null;
let animEndTime = 0;

function paintConnections(programId) {
  const programRow = programRefs.get(programId);
  if (!programRow) return;
  const linked = new Set(productsForProgram(programId).map(p => p.id));
  const canvas = document.getElementById('verbal-canvas');
  canvas.innerHTML = '';
  const canvasRect = canvas.getBoundingClientRect();
  const from = anchorCenter(programRow, canvasRect);
  for (const prodId of linked) {
    const row = productRefs.get(prodId);
    if (!row) continue;
    const to = anchorCenter(row, canvasRect);
    const midX = (from.x + to.x) / 2;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`);
    canvas.append(path);
  }
}

function followLayout() {
  if (animatingProgramId == null) return;
  paintConnections(animatingProgramId);
  if (performance.now() < animEndTime) requestAnimationFrame(followLayout);
}

function drawConnections(programId, { collapseOthers = false } = {}) {
  const programRow = programRefs.get(programId);
  if (!programRow) return;

  const linked = new Set(productsForProgram(programId).map(p => p.id));
  // Programs column: in landing view, stays fully visible. In program view
  // (a program is committed-active), other programs collapse like products do.
  for (const [pid, row] of programRefs) {
    if (pid === programId) row.setAttribute('data-state', 'linked');
    else if (collapseOthers) row.setAttribute('data-state', 'dimmed');
    else row.removeAttribute('data-state');
  }
  for (const [prodId, row] of productRefs) {
    row.setAttribute('data-state', linked.has(prodId) ? 'linked' : 'dimmed');
  }

  // Track layout for the duration of the fade-and-shrink CSS transition.
  animatingProgramId = programId;
  animEndTime = performance.now() + 320; // a hair longer than --dur-base
  requestAnimationFrame(followLayout);
}

function refresh() {
  const id = state.hoverProgram ?? state.activeProgram ?? null;
  if (id) drawConnections(id, { collapseOthers: state.view === 'program' });
}

function effective(s) { return s.hoverProgram ?? s.activeProgram ?? null; }

subscribe((next) => {
  const id = effective(next);
  if (id) drawConnections(id, { collapseOthers: next.view === 'program' });
  else clearHighlight();
});
