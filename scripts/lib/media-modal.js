// Media modal — full-overlay dialog with moving gradient backdrop.
// Used by the side-margin .media-pill components in the article view.

import { iconClose } from './icons.js';

const modal = document.getElementById('media-modal');
const body  = document.getElementById('media-modal-body');

let lastFocused = null;
let onCloseFn = null;

function bindClose() {
  const closeBtn = modal.querySelector('.media-modal__close');
  if (closeBtn) {
    closeBtn.textContent = '';
    const ic = iconClose();
    ic.setAttribute('width', '18');
    ic.setAttribute('height', '18');
    closeBtn.append(ic);
  }
  modal.querySelectorAll('[data-modal-close]').forEach(node => {
    node.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}
bindClose();

export function openModal(contentNode, { onClose } = {}) {
  body.innerHTML = '';
  if (contentNode) body.append(contentNode);
  lastFocused = document.activeElement;
  onCloseFn = onClose || null;
  modal.hidden = false;
  modal.classList.add('is-open');
  // Focus the close button after the modal becomes interactive.
  requestAnimationFrame(() => {
    modal.querySelector('.media-modal__close')?.focus();
  });
}

export function closeModal() {
  if (modal.hidden) return;
  modal.classList.remove('is-open');
  modal.hidden = true;
  body.innerHTML = '';
  if (onCloseFn) try { onCloseFn(); } catch (e) {}
  onCloseFn = null;
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}
