/* ============================================================
   V+V mockup — Osmo island init functions, Batch A (vendored verbatim).
   Requires (loaded in page): GSAP + ScrollTrigger + SplitText (highlight),
   Vimeo SDK (lightbox), Howler (audio). Tab/modal/sticky = vanilla/CSS.
   ============================================================ */

/* ---------- Highlight Text on Scroll ---------- */
function initHighlightText(){
  if (!(window.gsap && window.SplitText)) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.querySelectorAll("[data-highlight-text]").forEach((heading) => {
    const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%";
    const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%";
    const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2;
    const staggerValue = heading.getAttribute("data-highlight-stagger") || 0.1;
    new SplitText(heading, {
      type: "words, chars", autoSplit: true,
      onSplit(self) {
        let ctx = gsap.context(() => {
          let tl = gsap.timeline({ scrollTrigger: { scrub: true, trigger: heading, start: scrollStart, end: scrollEnd } });
          tl.from(self.chars, { autoAlpha: fadedValue, stagger: staggerValue, ease: "linear" });
        });
        return ctx;
      }
    });
  });
}

/* ---------- Vimeo Lightbox (advanced) ---------- */
function initVimeoLightboxAdvanced() {
  const lightbox = document.querySelector('[data-vimeo-lightbox-init]');
  if (!lightbox) return;
  const openButtons = document.querySelectorAll('[data-vimeo-lightbox-control="open"]');
  const closeButtons = document.querySelectorAll('[data-vimeo-lightbox-control="close"]');
  let iframe = lightbox.querySelector('iframe');
  const placeholder = lightbox.querySelector('.vimeo-lightbox__placeholder');
  const calcEl = lightbox.querySelector('.vimeo-lightbox__calc');
  const wrapEl = lightbox.querySelector('.vimeo-lightbox__calc-wrap');
  const playerContainer = lightbox.querySelector('[data-vimeo-lightbox-player]');
  let player = null, currentVideoID = null, videoAspectRatio = null;
  let globalMuted = lightbox.getAttribute('data-vimeo-muted') === 'true';
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const playedOnce = new Set();
  function formatTime(s) { const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
  function clampWrapSize(ar) { const w = calcEl.offsetWidth; const h = calcEl.offsetHeight; wrapEl.style.maxWidth = Math.min(w, h/ar) + 'px'; }
  function adjustCoverSizing() {
    if (!videoAspectRatio) return;
    const cH = playerContainer.offsetHeight, cW = playerContainer.offsetWidth, r = cH/cW;
    const wEl = lightbox.querySelector('.vimeo-lightbox__iframe');
    if (r > videoAspectRatio) { wEl.style.width = (r/videoAspectRatio*100)+'%'; wEl.style.height = '100%'; }
    else { wEl.style.height = (videoAspectRatio/r*100)+'%'; wEl.style.width = '100%'; }
  }
  function closeLightbox() { lightbox.setAttribute('data-vimeo-activated','false'); if (player) { player.pause(); lightbox.setAttribute('data-vimeo-playing','false'); } }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  closeButtons.forEach(btn => btn.addEventListener('click', closeLightbox));
  function setupPlayerEvents() {
    player.on('play', () => { lightbox.setAttribute('data-vimeo-loaded','true'); lightbox.setAttribute('data-vimeo-playing','true'); });
    player.on('ended', closeLightbox);
    player.on('pause', () => lightbox.setAttribute('data-vimeo-playing','false'));
    const durEl = lightbox.querySelector('[data-vimeo-duration]');
    player.getDuration().then(d => { if (durEl) durEl.textContent = formatTime(d); lightbox.querySelectorAll('[data-vimeo-control="timeline"],progress').forEach(el => el.max = d); });
    const tl = lightbox.querySelector('[data-vimeo-control="timeline"]'); const pr = lightbox.querySelector('progress');
    player.on('timeupdate', data => { if (tl) tl.value = data.seconds; if (pr) pr.value = data.seconds; if (durEl) durEl.textContent = formatTime(Math.trunc(data.seconds)); });
    if (tl) ['input','change'].forEach(evt => tl.addEventListener(evt, e => { const v = e.target.value; player.setCurrentTime(v); if (pr) pr.value = v; }));
    let hoverTimer;
    playerContainer.addEventListener('mousemove', () => { lightbox.setAttribute('data-vimeo-hover','true'); clearTimeout(hoverTimer); hoverTimer = setTimeout(() => lightbox.setAttribute('data-vimeo-hover','false'), 3000); });
    const fsBtn = lightbox.querySelector('[data-vimeo-control="fullscreen"]');
    if (fsBtn) {
      const isFS = () => document.fullscreenElement || document.webkitFullscreenElement;
      if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) fsBtn.style.display = 'none';
      fsBtn.addEventListener('click', () => {
        if (isFS()) { lightbox.setAttribute('data-vimeo-fullscreen','false'); (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
        else { lightbox.setAttribute('data-vimeo-fullscreen','true'); (playerContainer.requestFullscreen || playerContainer.webkitRequestFullscreen).call(playerContainer); }
      });
      ['fullscreenchange','webkitfullscreenchange'].forEach(evt => document.addEventListener(evt, () => lightbox.setAttribute('data-vimeo-fullscreen', isFS() ? 'true' : 'false')));
    }
  }
  async function runSizing() {
    const mode = lightbox.getAttribute('data-vimeo-update-size');
    const w = await player.getVideoWidth(); const h = await player.getVideoHeight(); const ar = h/w;
    const bef = lightbox.querySelector('.vimeo-lightbox__before');
    if (mode === 'true') { if (bef) bef.style.paddingTop = (ar*100)+'%'; clampWrapSize(ar); }
    else if (mode === 'cover') { videoAspectRatio = ar; if (bef) bef.style.paddingTop = '0%'; adjustCoverSizing(); }
    else clampWrapSize(ar);
  }
  window.addEventListener('resize', () => { if (player) runSizing(); });
  async function openLightbox(id, placeholderBtn) {
    lightbox.setAttribute('data-vimeo-activated','loading'); lightbox.setAttribute('data-vimeo-loaded','false');
    if (player && id !== currentVideoID) {
      await player.pause(); await player.unload();
      const oldIframe = iframe; const newIframe = document.createElement('iframe');
      newIframe.className = oldIframe.className; newIframe.setAttribute('frameborder','0'); newIframe.setAttribute('allowfullscreen','true'); newIframe.setAttribute('allow','autoplay; encrypted-media');
      oldIframe.parentNode.replaceChild(newIframe, oldIframe);
      iframe = newIframe; player = null; currentVideoID = null; lightbox.setAttribute('data-vimeo-playing','false');
    }
    if (placeholderBtn) ['src','srcset','sizes','alt','width'].forEach(attr => { const val = placeholderBtn.getAttribute(attr); if (val != null) placeholder.setAttribute(attr, val); });
    if (!player) {
      iframe.src = `https://player.vimeo.com/video/${id}?api=1&background=1&autoplay=0&loop=0&muted=0`;
      player = new Vimeo.Player(iframe); setupPlayerEvents(); currentVideoID = id; await runSizing();
    }
    lightbox.setAttribute('data-vimeo-activated','true');
    if (!isTouch) { player.setVolume(globalMuted ? 0 : 1).then(() => { lightbox.setAttribute('data-vimeo-playing','true'); setTimeout(() => player.play(), 50); }); }
    else if (playedOnce.has(currentVideoID)) { player.setVolume(globalMuted ? 0 : 1).then(() => { lightbox.setAttribute('data-vimeo-playing','true'); player.play(); }); }
  }
  lightbox.querySelector('[data-vimeo-control="play"]').addEventListener('click', () => {
    if (isTouch) {
      if (!playedOnce.has(currentVideoID)) { player.setVolume(0).then(() => { lightbox.setAttribute('data-vimeo-playing','true'); player.play(); if (!globalMuted) setTimeout(() => { player.setVolume(1); lightbox.setAttribute('data-vimeo-muted','false'); }, 100); playedOnce.add(currentVideoID); }); }
      else player.setVolume(globalMuted ? 0 : 1).then(() => { lightbox.setAttribute('data-vimeo-playing','true'); player.play(); });
    } else player.setVolume(globalMuted ? 0 : 1).then(() => { lightbox.setAttribute('data-vimeo-playing','true'); setTimeout(() => player.play(), 50); });
  });
  lightbox.querySelector('[data-vimeo-control="pause"]').addEventListener('click', () => player.pause());
  lightbox.querySelector('[data-vimeo-control="mute"]').addEventListener('click', () => { globalMuted = !globalMuted; player.setVolume(globalMuted ? 0 : 1).then(() => lightbox.setAttribute('data-vimeo-muted', globalMuted ? 'true' : 'false')); });
  openButtons.forEach(btn => btn.addEventListener('click', () => { const vid = btn.getAttribute('data-vimeo-lightbox-id'); const img = btn.querySelector('[data-vimeo-lightbox-placeholder]'); openLightbox(vid, img); }));
}

/* ---------- Audio Player (Howler) ---------- */
function initHowlerJSAudioPlayer() {
  if (!window.Howl) return;
  const howlerElements = document.querySelectorAll('[data-howler]');
  const soundInstances = {};
  howlerElements.forEach((element, index) => {
    const uniqueId = `howler-${index}`;
    element.id = uniqueId; element.setAttribute('data-howler-status','not-playing');
    const audioSrc = element.getAttribute('data-howler-src');
    const durationElement = element.querySelector('[data-howler-info="duration"]');
    const progressTextElement = element.querySelector('[data-howler-info="progress"]');
    const timelineContainer = element.querySelector('[data-howler-control="timeline"]');
    const timelineBar = element.querySelector('[data-howler-control="progress"]');
    const toggleButton = element.querySelector('[data-howler-control="toggle-play"]');
    const sound = new Howl({
      src: [audioSrc], html5: true,
      onload: () => { if (durationElement) durationElement.textContent = formatTime(sound.duration()); },
      onplay: () => { pauseAllExcept(uniqueId); element.setAttribute('data-howler-status','playing'); requestAnimationFrame(updateProgress); },
      onpause: () => element.setAttribute('data-howler-status','not-playing'),
      onstop: () => element.setAttribute('data-howler-status','not-playing'),
      onend: resetUI,
    });
    soundInstances[uniqueId] = sound;
    function updateProgress() { if (!sound.playing()) return; updateUI(); requestAnimationFrame(updateProgress); }
    function updateUI() { const currentTime = sound.seek() || 0; const duration = sound.duration() || 1; if (progressTextElement) progressTextElement.textContent = formatTime(currentTime); if (timelineBar) timelineBar.style.width = `${(currentTime/duration)*100}%`; timelineContainer?.setAttribute('aria-valuenow', Math.round((currentTime/duration)*100)); }
    function resetUI() { if (timelineBar) timelineBar.style.width = '100%'; element.setAttribute('data-howler-status','not-playing'); }
    function seekToPosition(event) { const rect = timelineContainer.getBoundingClientRect(); const percentage = (event.clientX - rect.left)/rect.width; sound.seek(sound.duration()*percentage); if (!sound.playing()) { pauseAllExcept(uniqueId); sound.play(); element.setAttribute('data-howler-status','playing'); } updateUI(); }
    function togglePlay() { const isPlaying = sound.playing(); sound.playing() ? sound.pause() : (pauseAllExcept(uniqueId), sound.play()); toggleButton?.setAttribute('aria-pressed', !isPlaying); }
    function pauseAllExcept(id) { Object.keys(soundInstances).forEach(otherId => { if (otherId !== id && soundInstances[otherId].playing()) { soundInstances[otherId].pause(); document.getElementById(otherId)?.setAttribute('data-howler-status','not-playing'); } }); }
    function formatTime(seconds) { const minutes = Math.floor(seconds/60); const secs = Math.floor(seconds%60); return `${minutes}:${secs.toString().padStart(2,'0')}`; }
    toggleButton?.addEventListener('click', togglePlay);
    timelineContainer?.addEventListener('click', seekToPosition);
    sound.on('seek', updateUI); sound.on('play', updateUI);
  });
  return soundInstances;
}

/* ---------- Basic Modal ---------- */
function initModalBasic() {
  const modalGroup = document.querySelector('[data-modal-group-status]');
  const modals = document.querySelectorAll('[data-modal-name]');
  const modalTargets = document.querySelectorAll('[data-modal-target]');
  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener('click', function () {
      const modalTargetName = this.getAttribute('data-modal-target');
      modalTargets.forEach((target) => target.setAttribute('data-modal-status','not-active'));
      modals.forEach((modal) => modal.setAttribute('data-modal-status','not-active'));
      document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status','active');
      document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status','active');
      if (modalGroup) modalGroup.setAttribute('data-modal-group-status','active');
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => closeBtn.addEventListener('click', closeAllModals));
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeAllModals(); });
  function closeAllModals() { modalTargets.forEach((target) => target.setAttribute('data-modal-status','not-active')); if (modalGroup) modalGroup.setAttribute('data-modal-group-status','not-active'); }
}

/* ---------- Tab System with Autoplay ---------- */
function initTabSystem() {
  document.querySelectorAll('[data-tabs="wrapper"]').forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
    let activeContent = null, activeVisual = null, isAnimating = false, progressBarTween = null;
    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
      if (!bar) return;
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, { scaleX: 1, duration: autoplayDuration/1000, ease: "power1.inOut", onComplete: () => { if (!isAnimating) switchTab((index+1)%contentItems.length); } });
    }
    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;
      isAnimating = true; if (progressBarTween) progressBarTween.kill();
      const outgoingContent = activeContent, outgoingVisual = activeVisual;
      const outgoingBar = outgoingContent?.querySelector('[data-tabs="item-progress"]');
      const incomingContent = contentItems[index], incomingVisual = visualItems[index];
      const incomingBar = incomingContent.querySelector('[data-tabs="item-progress"]');
      outgoingContent?.classList.remove("active"); outgoingVisual?.classList.remove("active");
      incomingContent.classList.add("active"); incomingVisual.classList.add("active");
      const tl = gsap.timeline({ defaults: { duration: 0.65, ease: "power3" }, onComplete: () => { activeContent = incomingContent; activeVisual = incomingVisual; isAnimating = false; if (autoplay) startProgressBar(index); } });
      if (outgoingContent) {
        outgoingContent.classList.remove("active"); outgoingVisual?.classList.remove("active");
        tl.set(outgoingBar, { transformOrigin: "right center" }).to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0).to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0).to(outgoingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, 0);
      }
      incomingContent.classList.add("active"); incomingVisual.classList.add("active");
      tl.fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, 0.3).fromTo(incomingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, { height: "auto" }, 0).set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }
    switchTab(0);
    contentItems.forEach((item, i) => item.addEventListener("click", () => { if (item === activeContent) return; switchTab(i); }));
  });
}

/* ---------- boot ---------- */
function vvInitIslands2() {
  try { initHighlightText(); } catch (e) { console.warn('Highlight init', e); }
  try { if (window.Vimeo) initVimeoLightboxAdvanced(); } catch (e) { console.warn('Lightbox init', e); }
  try { initHowlerJSAudioPlayer(); } catch (e) { console.warn('Howler init', e); }
  try { initModalBasic(); } catch (e) { console.warn('Modal init', e); }
  try { if (window.gsap) initTabSystem(); } catch (e) { console.warn('Tabs init', e); }
}
if (document.readyState !== 'loading') vvInitIslands2();
else document.addEventListener('DOMContentLoaded', vvInitIslands2);
