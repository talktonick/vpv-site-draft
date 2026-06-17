/* ============================================================
   V+V mockup — Osmo island init functions, vendored VERBATIM.
   (Internal logic untouched per the island rule; only loaded here.)
   Requires: GSAP 3.15 + ScrollTrigger + Vimeo SDK (loaded in the page).
   ============================================================ */
if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* ---------- Table of Contents ---------- */
function initTableOfContents() {
  document.querySelectorAll('[data-toc-wrap]').forEach(root => {
    const contentEl = root.querySelector('[data-toc-content]');
    const listEl = root.querySelector('[data-toc-list]');
    const templateLink = listEl?.querySelector('[data-toc-link]');
    if (!contentEl || !listEl || !templateLink) return;
    const levels = (root.getAttribute('data-toc-levels') || 'h2,h3').split(',').map(l => l.trim().toLowerCase()).filter(l => /^h[1-6]$/.test(l));
    const levelSelector = levels.join(', ');
    if (!levelSelector) return;
    const offset = parseInt(root.getAttribute('data-toc-offset')) || 50;
    const marker = '{skip}';
    const slugCounts = new Map();
    function slugify(text) {
      let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!slug) slug = 'section';
      const count = slugCounts.get(slug) || 0;
      slugCounts.set(slug, count + 1);
      return count === 0 ? slug : slug + '-' + (count + 1);
    }
    function stripMarker(el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.includes(marker)) node.textContent = node.textContent.replace(marker, '').trim();
      }
    }
    const allHeadings = Array.from(contentEl.querySelectorAll(levelSelector));
    const headings = [];
    allHeadings.forEach(heading => {
      if (heading.hasAttribute('data-toc-ignore')) return;
      if (heading.textContent.includes(marker)) { stripMarker(heading); return; }
      const text = heading.textContent.trim();
      if (!text) return;
      headings.push(heading);
    });
    if (!headings.length) return;
    headings.forEach(heading => { if (!heading.id) heading.id = slugify(heading.textContent.trim()); });
    const tocLinks = [];
    headings.forEach(heading => {
      const clone = templateLink.cloneNode(true);
      const textTarget = clone.querySelector('[data-toc-text]') || clone;
      textTarget.textContent = heading.textContent.trim();
      clone.href = '#' + heading.id;
      clone.removeAttribute('data-toc-link');
      clone.setAttribute('data-toc-item', '');
      clone.setAttribute('data-toc-depth', heading.tagName.charAt(1));
      listEl.appendChild(clone);
      tocLinks.push(clone);
    });
    listEl.querySelectorAll('[data-toc-link]').forEach(el => el.remove());
    if (typeof ScrollTrigger !== 'undefined') {
      function setActive(index) {
        tocLinks.forEach(link => link.setAttribute('data-toc-status', ''));
        if (tocLinks[index]) tocLinks[index].setAttribute('data-toc-status', 'active');
      }
      headings.forEach((heading, i) => {
        const nextHeading = headings[i + 1];
        ScrollTrigger.create({
          trigger: heading, start: 'top ' + (offset + 1) + 'px',
          endTrigger: nextHeading || contentEl, end: nextHeading ? 'top ' + (offset + 1) + 'px' : 'bottom top',
          onToggle: self => { if (self.isActive) setActive(i); }
        });
      });
      if (window.scrollY <= headings[0].getBoundingClientRect().top + window.scrollY - offset) setActive(0);
    }
    listEl.addEventListener('click', e => {
      const link = e.target.closest('[data-toc-item]');
      if (!link) return;
      e.preventDefault(); e.stopPropagation();
      const id = link.getAttribute('href')?.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      if (typeof lenis !== 'undefined' && typeof lenis.scrollTo === 'function') { lenis.scrollTo(target, { offset: -offset }); }
      else { const y = target.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top: y, behavior: 'smooth' }); }
    });
  });
}

/* ---------- Vimeo Player (advanced) ---------- */
function initVimeoPlayer() {
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-player-init]');
  vimeoPlayers.forEach(function(vimeoElement, index) {
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;
    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=0&muted=1`;
    vimeoElement.querySelector('iframe').setAttribute('src', vimeoVideoURL);
    const videoIndexID = 'vimeo-player-advanced-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);
    const iframeID = vimeoElement.id;
    const player = new Vimeo.Player(iframeID);
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
      player.getVideoWidth().then(function(width) {
        player.getVideoHeight().then(function(height) {
          const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
          if (beforeEl) beforeEl.style.paddingTop = (height / width) * 100 + '%';
        });
      });
    }
    let videoAspectRatio;
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'cover') {
      player.getVideoWidth().then(function(width) {
        player.getVideoHeight().then(function(height) {
          videoAspectRatio = height / width;
          const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
          if (beforeEl) beforeEl.style.paddingTop = '0%';
          adjustVideoSizing();
        });
      });
    }
    function adjustVideoSizing() {
      const containerRatio = vimeoElement.offsetHeight / vimeoElement.offsetWidth;
      const iframeWrapper = vimeoElement.querySelector('.vimeo-player__iframe');
      if (iframeWrapper && videoAspectRatio) {
        if (containerRatio > videoAspectRatio) { iframeWrapper.style.width = (containerRatio / videoAspectRatio) * 100 + '%'; iframeWrapper.style.height = '100%'; }
        else { iframeWrapper.style.height = (videoAspectRatio / containerRatio) * 100 + '%'; iframeWrapper.style.width = '100%'; }
      }
    }
    if (vimeoElement.getAttribute('data-vimeo-update-size') === 'cover') window.addEventListener('resize', adjustVideoSizing);
    player.on('play', function() { vimeoElement.setAttribute('data-vimeo-loaded', 'true'); vimeoElement.setAttribute('data-vimeo-playing', 'true'); });
    if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'false') { player.setVolume(1); player.pause(); }
    else {
      player.setVolume(0); vimeoElement.setAttribute('data-vimeo-muted', 'true');
      if (vimeoElement.getAttribute('data-vimeo-paused-by-user') === 'false') {
        function checkVisibility() {
          const rect = vimeoElement.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          inView ? vimeoPlayerPlay() : vimeoPlayerPause();
        }
        checkVisibility(); window.addEventListener('scroll', checkVisibility);
      }
    }
    function vimeoPlayerPlay() { vimeoElement.setAttribute('data-vimeo-activated', 'true'); vimeoElement.setAttribute('data-vimeo-playing', 'true'); player.play(); }
    function vimeoPlayerPause() { player.pause(); }
    player.on('pause', function() { vimeoElement.setAttribute('data-vimeo-playing', 'false'); });
    const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
    if (playBtn) playBtn.addEventListener('click', function() {
      player.setVolume(0); vimeoPlayerPlay();
      if (vimeoElement.getAttribute('data-vimeo-muted') === 'true') player.setVolume(0); else player.setVolume(1);
    });
    const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
    if (pauseBtn) pauseBtn.addEventListener('click', function() {
      vimeoPlayerPause();
      if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'true') vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
    });
    const muteBtn = vimeoElement.querySelector('[data-vimeo-control="mute"]');
    if (muteBtn) muteBtn.addEventListener('click', function() {
      if (vimeoElement.getAttribute('data-vimeo-muted') === 'false') { player.setVolume(0); vimeoElement.setAttribute('data-vimeo-muted', 'true'); }
      else { player.setVolume(1); vimeoElement.setAttribute('data-vimeo-muted', 'false'); }
    });
    const fullscreenSupported = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
    const fullscreenBtn = vimeoElement.querySelector('[data-vimeo-control="fullscreen"]');
    if (!fullscreenSupported && fullscreenBtn) fullscreenBtn.style.display = 'none';
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => {
      const fullscreenElement = document.getElementById(iframeID);
      if (!fullscreenElement) return;
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (isFullscreen) { vimeoElement.setAttribute('data-vimeo-fullscreen', 'false'); (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen).call(document); }
      else { vimeoElement.setAttribute('data-vimeo-fullscreen', 'true'); (fullscreenElement.requestFullscreen || fullscreenElement.webkitRequestFullscreen || fullscreenElement.mozRequestFullScreen || fullscreenElement.msRequestFullscreen).call(fullscreenElement); }
    });
    ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','msfullscreenchange'].forEach(event => {
      document.addEventListener(event, () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        vimeoElement.setAttribute('data-vimeo-fullscreen', isFullscreen ? 'true' : 'false');
      });
    });
    function secondsTimeSpanToHMS(s) { let h = Math.floor(s/3600); s -= h*3600; let m = Math.floor(s/60); s -= m*60; return m + ":" + (s < 10 ? '0'+s : s); }
    const vimeoDuration = vimeoElement.querySelector('[data-vimeo-duration]');
    player.getDuration().then(function(duration) {
      if (vimeoDuration) vimeoDuration.textContent = secondsTimeSpanToHMS(duration);
      vimeoElement.querySelectorAll('[data-vimeo-control="timeline"], progress').forEach((el) => el.setAttribute('max', duration));
    });
    const timelineElem = vimeoElement.querySelector('[data-vimeo-control="timeline"]');
    const progressElem = vimeoElement.querySelector('progress');
    function updateTimelineValue() { player.getDuration().then(function() { const timeVal = timelineElem.value; player.setCurrentTime(timeVal); if (progressElem) progressElem.value = timeVal; }); }
    if (timelineElem) ['input','change'].forEach((evt) => timelineElem.addEventListener(evt, updateTimelineValue));
    player.on('timeupdate', function(data) {
      if (timelineElem) timelineElem.value = data.seconds;
      if (progressElem) progressElem.value = data.seconds;
      if (vimeoDuration) vimeoDuration.textContent = secondsTimeSpanToHMS(Math.trunc(data.seconds));
    });
    let vimeoHoverTimer;
    vimeoElement.addEventListener('mousemove', function() {
      if (vimeoElement.getAttribute('data-vimeo-hover') === 'false') vimeoElement.setAttribute('data-vimeo-hover', 'true');
      clearTimeout(vimeoHoverTimer);
      vimeoHoverTimer = setTimeout(function(){ vimeoElement.setAttribute('data-vimeo-hover', 'false'); }, 3000);
    });
    function vimeoOnEnd() {
      if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'false') { vimeoElement.setAttribute('data-vimeo-activated', 'false'); vimeoElement.setAttribute('data-vimeo-playing', 'false'); player.unload(); }
      else player.play();
    }
    player.on('ended', vimeoOnEnd);
  });
}

/* ---------- Expanding Feature Pills ---------- */
function initExpandingFeaturePills() {
  const wraps = document.querySelectorAll("[data-feature-pills-init]");
  if (!wraps.length) return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  wraps.forEach((wrap, wrapIdx) => {
    const items = Array.from(wrap.querySelectorAll("[data-feature-pills-item]"));
    const visuals = Array.from(wrap.querySelectorAll("[data-feature-pills-visual]"));
    const cover = wrap.querySelector("[data-feature-pills-cover]");
    const closeBtn = wrap.querySelector("[data-feature-pills-close]");
    if (!items.length) return;
    const uidBase = `feature-pills-${wrapIdx}`;
    const ease = "back.out(2)";
    const animationDuration = 0.5;
    const getExpandedWidth = () => getComputedStyle(wrap).getPropertyValue("--content-item-expanded").trim() || "";
    const getActiveIndex = () => { const active = items.find((it) => it.getAttribute("data-active") === "true"); return active ? Number(active.getAttribute("data-feature-pills-index")) : null; };
    const setWrapActive = (isActive) => {
      wrap.setAttribute("data-feature-pills-active", isActive ? "true" : "false");
      if (closeBtn) closeBtn.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (cover) { cover.setAttribute("data-active", isActive ? "false" : "true"); cover.setAttribute("aria-hidden", isActive ? "true" : "false"); }
    };
    const setVisualActive = (indexOrNull) => {
      if (!visuals.length) return;
      visuals.forEach((v) => { const idx = Number(v.getAttribute("data-feature-pills-index")); const isActive = indexOrNull !== null && idx === indexOrNull; v.setAttribute("data-active", isActive ? "true" : "false"); v.setAttribute("aria-hidden", isActive ? "false" : "true"); });
    };
    const setItemA11y = (item, isOpen) => { const btn = item.querySelector("[data-feature-pills-button]"); const content = item.querySelector("[data-feature-pills-content]"); if (!btn || !content) return; btn.setAttribute("aria-expanded", isOpen ? "true" : "false"); content.setAttribute("aria-hidden", isOpen ? "false" : "true"); };
    const measureButtonH = (item) => { const btn = item.querySelector("[data-feature-pills-button]"); return btn ? Math.ceil(btn.getBoundingClientRect().height) : 0; };
    const measureInnerH = (item, expandedW) => {
      const inner = item.querySelector("[data-feature-pills-inner]");
      if (!inner) return 0;
      const mask = item.querySelector(".feature-pills__item-mask");
      const prevMaskOverflow = mask ? mask.style.overflow : null;
      if (mask) mask.style.overflow = "visible";
      const prevMaxW = inner.style.maxWidth;
      if (expandedW) inner.style.maxWidth = expandedW;
      const h = Math.ceil(inner.getBoundingClientRect().height);
      if (expandedW) inner.style.maxWidth = prevMaxW || "";
      if (mask) mask.style.overflow = prevMaskOverflow || "";
      return h;
    };
    const getHeights = (item, expandedW) => { const buttonH = measureButtonH(item); const innerH = measureInnerH(item, expandedW); return { buttonH, openH: Math.max(buttonH, innerH) }; };
    const collapsedWidthPx = new Map();
    const captureCollapsedWidths = () => { items.forEach((item) => { const prev = item.style.width; item.style.width = ""; collapsedWidthPx.set(item, Math.ceil(item.getBoundingClientRect().width)); item.style.width = prev; }); };
    const animateBox = (el, vars) => {
      gsap.killTweensOf(el);
      if (prefersReducedMotion) { if (vars.height != null) el.style.height = `${vars.height}px`; if (vars.width != null) el.style.width = typeof vars.width === "number" ? `${vars.width}px` : vars.width; return; }
      gsap.to(el, { ...vars, duration: animationDuration, ease, overwrite: true });
    };
    const openItem = (item) => {
      const expandedW = getExpandedWidth();
      const { openH } = getHeights(item, expandedW);
      item.setAttribute("data-active", "true"); setItemA11y(item, true); setWrapActive(true);
      const targetW = expandedW || `${collapsedWidthPx.get(item) || Math.ceil(item.getBoundingClientRect().width)}px`;
      animateBox(item, { height: openH, width: targetW });
    };
    const closeItem = (item) => {
      const expandedW = getExpandedWidth();
      const { buttonH } = getHeights(item, expandedW);
      item.setAttribute("data-active", "false"); setItemA11y(item, false);
      const targetW = collapsedWidthPx.get(item) || Math.ceil(item.getBoundingClientRect().width);
      animateBox(item, { height: buttonH, width: targetW });
    };
    const switchTo = (nextIndex) => {
      const current = getActiveIndex();
      if (current === nextIndex) return;
      const nextItem = items[nextIndex];
      if (!nextItem) return;
      if (current !== null) closeItem(items[current]);
      openItem(nextItem);
      setVisualActive(nextIndex);
    };
    const closeAll = () => { const current = getActiveIndex(); if (current === null) return; closeItem(items[current]); setVisualActive(null); setWrapActive(false); };
    items.forEach((item, i) => {
      item.setAttribute("data-feature-pills-index", String(i));
      if (!item.hasAttribute("data-active")) item.setAttribute("data-active", "false");
      const btn = item.querySelector("[data-feature-pills-button]");
      const content = item.querySelector("[data-feature-pills-content]");
      if (btn) { btn.setAttribute("data-feature-pills-index", String(i)); btn.type = "button"; if (!btn.id) btn.id = `${uidBase}-trigger-${i}`; }
      if (content && btn) {
        content.setAttribute("data-feature-pills-index", String(i));
        if (!content.id) content.id = `${uidBase}-panel-${i}`;
        btn.setAttribute("aria-controls", content.id); content.setAttribute("role", "region"); content.setAttribute("aria-labelledby", btn.id);
        if (!content.hasAttribute("aria-hidden")) content.setAttribute("aria-hidden", "true");
        if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
      }
    });
    visuals.forEach((v, i) => v.setAttribute("data-feature-pills-index", String(i)));
    if (closeBtn) { closeBtn.type = "button"; if (!closeBtn.hasAttribute("aria-hidden")) closeBtn.setAttribute("aria-hidden", "true"); closeBtn.addEventListener("click", closeAll); }
    items.forEach((item) => { const h = measureButtonH(item); item.style.height = `${h}px`; });
    setWrapActive(false); setVisualActive(null);
    items.forEach((item, i) => { const btn = item.querySelector("[data-feature-pills-button]"); if (!btn) return; btn.addEventListener("click", () => switchTo(i)); });
    wrap.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
    const debounce = (fn, wait = 150) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; };
    const handleResize = () => {
      const current = getActiveIndex();
      items.forEach((item) => { if (item.getAttribute("data-active") !== "true") item.style.width = ""; });
      captureCollapsedWidths();
      if (current !== null) {
        const item = items[current]; const expandedW = getExpandedWidth(); const { openH } = getHeights(item, expandedW); const targetW = expandedW || "";
        if (prefersReducedMotion) { item.style.height = `${openH}px`; if (targetW) item.style.width = targetW; }
        else { const fallbackW = `${Math.ceil(item.getBoundingClientRect().width)}px`; gsap.set(item, { height: openH, width: targetW || fallbackW }); if (targetW) item.style.width = targetW; }
      } else { items.forEach((item) => { const h = measureButtonH(item); item.style.height = `${h}px`; }); }
    };
    captureCollapsedWidths();
    window.addEventListener("resize", debounce(handleResize, 200), { passive: true });
  });
}

/* ---------- Horizontal Scrolling Sections ---------- */
function initHorizontalScrolling() {
  const mm = gsap.matchMedia();
  mm.add({ isMobile: "(max-width:479px)", isMobileLandscape: "(max-width:767px)", isTablet: "(max-width:991px)", isDesktop: "(min-width:992px)" }, (context) => {
    const { isMobile, isMobileLandscape, isTablet } = context.conditions;
    const ctx = gsap.context(() => {
      const wrappers = document.querySelectorAll("[data-horizontal-scroll-wrap]");
      if (!wrappers.length) return;
      wrappers.forEach((wrap) => {
        const disable = wrap.getAttribute("data-horizontal-scroll-disable");
        if ((disable === "mobile" && isMobile) || (disable === "mobileLandscape" && isMobileLandscape) || (disable === "tablet" && isTablet)) return;
        const panels = gsap.utils.toArray("[data-horizontal-scroll-panel]", wrap);
        if (panels.length < 2) return;
        gsap.to(panels, { x: () => -(wrap.scrollWidth - window.innerWidth), ease: "none", scrollTrigger: { trigger: wrap, start: "top top", end: () => "+=" + (wrap.scrollWidth - window.innerWidth), scrub: true, pin: true, invalidateOnRefresh: true } });
      });
    });
    return () => ctx.revert();
  });
}

/* ---------- boot (run now if DOM ready, else on DOMContentLoaded) ---------- */
function vvInitIslands() {
  try { initTableOfContents(); } catch (e) { console.warn('TOC init', e); }
  try { if (window.Vimeo) initVimeoPlayer(); } catch (e) { console.warn('Vimeo init', e); }
  try { initExpandingFeaturePills(); } catch (e) { console.warn('FeaturePills init', e); }
  try { initHorizontalScrolling(); } catch (e) { console.warn('Horizontal init', e); }
}
if (document.readyState !== 'loading') vvInitIslands();
else document.addEventListener('DOMContentLoaded', vvInitIslands);
