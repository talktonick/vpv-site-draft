/* ============================================================
   V+V mockup — Osmo island init functions, Batch B (vendored verbatim).
   All vanilla (no external libs). Tooltip = pure CSS (no JS).
   ============================================================ */

/* ---------- Play Video on Hover ---------- */
function initPlayVideoHover() {
  document.querySelectorAll('[data-video-on-hover]').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const src = wrapper.getAttribute('data-video-src') || '';
    if (!video || !src) return;
    wrapper.addEventListener('mouseenter', () => {
      if (!video.getAttribute('src')) video.setAttribute('src', src);
      wrapper.dataset.videoOnHover = 'active';
      video.play().catch(err => console.warn('play on hover blocked:', err));
    });
    wrapper.addEventListener('mouseleave', () => {
      wrapper.dataset.videoOnHover = 'not-active';
      setTimeout(() => { video.pause(); video.currentTime = 0; }, 200);
    });
  });
}

/* ---------- Directional List Hover ---------- */
function initDirectionalListHover() {
  const directionMap = { top: 'translateY(-100%)', bottom: 'translateY(100%)', left: 'translateX(-100%)', right: 'translateX(100%)' };
  document.querySelectorAll('[data-directional-hover]').forEach(container => {
    const type = container.getAttribute('data-type') || 'all';
    container.querySelectorAll('[data-directional-hover-item]').forEach(item => {
      const tile = item.querySelector('[data-directional-hover-tile]');
      if (!tile) return;
      item.addEventListener('mouseenter', e => {
        const dir = getDirection(e, item, type);
        tile.style.transition = 'none';
        tile.style.transform = directionMap[dir] || 'translate(0, 0)';
        void tile.offsetHeight;
        tile.style.transition = '';
        tile.style.transform = 'translate(0%, 0%)';
        item.setAttribute('data-status', `enter-${dir}`);
      });
      item.addEventListener('mouseleave', e => {
        const dir = getDirection(e, item, type);
        item.setAttribute('data-status', `leave-${dir}`);
        tile.style.transform = directionMap[dir] || 'translate(0, 0)';
      });
    });
    function getDirection(event, el, type) {
      const { left, top, width: w, height: h } = el.getBoundingClientRect();
      const x = event.clientX - left, y = event.clientY - top;
      if (type === 'y') return y < h / 2 ? 'top' : 'bottom';
      if (type === 'x') return x < w / 2 ? 'left' : 'right';
      const distances = { top: y, right: w - x, bottom: h - y, left: x };
      return Object.entries(distances).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
    }
  });
}

/* ---------- Download Button ---------- */
function initDownloadButtons() {
  const setState = (el, state) => { el.dataset.downloadState = state; };
  const triggerDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url; if (filename) a.download = filename; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  document.querySelectorAll('[data-download-src]').forEach(el => {
    setState(el, 'idle');
    const labelEl = el.querySelector('[data-download-label]');
    if (labelEl && !labelEl.dataset.downloadOriginalLabel) labelEl.dataset.downloadOriginalLabel = labelEl.textContent;
    const showSuccessAndReset = () => {
      if (labelEl) { const s = labelEl.getAttribute('data-download-success'); if (s) labelEl.textContent = s; }
      if (el._downloadResetTimeout) clearTimeout(el._downloadResetTimeout);
      el._downloadResetTimeout = setTimeout(() => { setState(el, 'idle'); if (labelEl) { const o = labelEl.dataset.downloadOriginalLabel; if (o != null) labelEl.textContent = o; } }, 3000);
    };
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      if (el.dataset.downloadState === 'downloading') return;
      const src = el.getAttribute('data-download-src'); if (!src) return;
      const customName = el.getAttribute('data-download-name');
      const urlObj = new URL(src, window.location.href);
      const fileName = customName || (urlObj.pathname.split('/').pop() || 'download');
      el.blur();
      try {
        setState(el, 'downloading');
        const res = await fetch(src, { mode: 'cors', credentials: 'omit' });
        if (!res.ok) throw new Error('bad status');
        const blob = await res.blob(); const objectUrl = URL.createObjectURL(blob);
        setState(el, 'ready'); triggerDownload(objectUrl, fileName); showSuccessAndReset();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      } catch (err) { setState(el, 'fallback'); triggerDownload(src, fileName); showSuccessAndReset(); }
    });
  });
}

/* ---------- boot ---------- */
function vvInitIslands3() {
  try { initPlayVideoHover(); } catch (e) { console.warn('PlayHover init', e); }
  try { initDirectionalListHover(); } catch (e) { console.warn('Directional init', e); }
  try { initDownloadButtons(); } catch (e) { console.warn('Download init', e); }
}
if (document.readyState !== 'loading') vvInitIslands3();
else document.addEventListener('DOMContentLoaded', vvInitIslands3);
