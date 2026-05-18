// Ported from vv-sandbox.html lines 2978-3017: the three expand-trigger glyphs.
// Stroke uses currentColor so containers control color via CSS.

const NS = 'http://www.w3.org/2000/svg';

function svg(viewBox, paths) {
  const node = document.createElementNS(NS, 'svg');
  node.setAttribute('viewBox', viewBox);
  node.setAttribute('fill', 'none');
  node.setAttribute('stroke', 'currentColor');
  node.setAttribute('stroke-width', '2');
  node.setAttribute('stroke-linecap', 'round');
  node.setAttribute('stroke-linejoin', 'round');
  node.setAttribute('aria-hidden', 'true');
  for (const p of paths) {
    const [tag, attrs] = p;
    const child = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) child.setAttribute(k, v);
    node.append(child);
  }
  return node;
}

export function iconRead() {
  return svg('0 0 24 24', [
    ['path', { d: 'M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z' }],
    ['path', { d: 'M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z' }],
  ]);
}
export function iconSee() {
  return svg('0 0 24 24', [
    ['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
    ['circle', { cx: 8.5, cy: 9, r: 1.5 }],
    ['path', { d: 'M21 15l-5-5L5 21' }],
  ]);
}
export function iconHear() {
  return svg('0 0 24 24', [
    ['path', { d: 'M11 5L6 9H2v6h4l5 4z' }],
    ['path', { d: 'M15.54 8.46a5 5 0 0 1 0 7.07' }],
    ['path', { d: 'M19.07 4.93a10 10 0 0 1 0 14.14' }],
  ]);
}
export function iconClose() {
  return svg('0 0 24 24', [
    ['line', { x1: 6, y1: 6, x2: 18, y2: 18 }],
    ['line', { x1: 18, y1: 6, x2: 6, y2: 18 }],
  ]);
}

export const iconByKind = { read: iconRead, see: iconSee, hear: iconHear };
