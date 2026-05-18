// Pill-with-sliding-indicator toggle. Reusable for Verbal/Visual on the shell
// and Standard/Timeline on the Faherty case study.
//
// Markup contract:
//   <div class="mode-pill" role="tablist">
//     <span class="mode-pill__indicator"></span>
//     <button class="mode-pill__option" data-mode="visual" aria-pressed="true">…</button>
//     <button class="mode-pill__option" data-mode="verbal" aria-pressed="false">…</button>
//   </div>

export function initModePill(root, { initial, onChange }) {
  const indicator = root.querySelector('.mode-pill__indicator');
  const options = [...root.querySelectorAll('.mode-pill__option')];

  function setActive(mode, { fire = true } = {}) {
    for (const opt of options) {
      const on = opt.dataset.mode === mode;
      opt.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) positionIndicator(opt);
    }
    if (fire && onChange) onChange(mode);
  }

  function positionIndicator(opt) {
    const rRoot = root.getBoundingClientRect();
    const rOpt = opt.getBoundingClientRect();
    indicator.style.width = `${rOpt.width}px`;
    indicator.style.transform = `translateX(${rOpt.left - rRoot.left - 3}px)`;
  }

  for (const opt of options) {
    opt.addEventListener('click', () => setActive(opt.dataset.mode));
  }

  // Reposition on resize (the topbar is fluid).
  const ro = new ResizeObserver(() => {
    const current = options.find(o => o.getAttribute('aria-pressed') === 'true');
    if (current) positionIndicator(current);
  });
  ro.observe(root);

  // Wait for fonts so initial measurement is correct.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setActive(initial, { fire: false }));
  }
  setActive(initial, { fire: false });

  return { setMode: m => setActive(m) };
}
