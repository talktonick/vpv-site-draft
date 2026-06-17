/* ============================================================
   V+V layout — drawer ("read more / see more") + live margin tuner.
   Drawer is a V+V component (not an Osmo island): clean, Designer-friendly.
   ============================================================ */

/* Live margin tuner: ?m=24 / ?m=40 / ?m=64 sets --margin for quick A/B. */
(function () {
  const m = new URLSearchParams(location.search).get('m');
  if (m && /^\d+$/.test(m)) document.documentElement.style.setProperty('--margin', m + 'px');
})();

/* Drawer: one panel per page, swappable named items, like the modal. */
function initDrawer() {
  const drawer = document.querySelector('[data-drawer]');
  if (!drawer) return;
  const items = drawer.querySelectorAll('[data-drawer-name]');
  function open(name) {
    items.forEach(i => i.setAttribute('data-drawer-status', i.getAttribute('data-drawer-name') === name ? 'active' : ''));
    drawer.setAttribute('data-drawer-status', 'open');
  }
  function close() { drawer.setAttribute('data-drawer-status', 'closed'); }
  document.querySelectorAll('[data-drawer-target]').forEach(t =>
    t.addEventListener('click', e => { e.preventDefault(); open(t.getAttribute('data-drawer-target')); })
  );
  drawer.querySelectorAll('[data-drawer-close]').forEach(c => c.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

if (document.readyState !== 'loading') initDrawer();
else document.addEventListener('DOMContentLoaded', initDrawer);
