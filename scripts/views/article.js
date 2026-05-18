// Article view. Renders an article from data/articles.json with a sticky
// left ToC, a body, and media pills anchored to sections in the left margin.

import { getArticle } from '../data.js';
import { openModal, closeModal } from '../lib/media-modal.js';
import { createVideoPlayer } from '../lib/video-player.js';
import { createAudioPlayer } from '../lib/audio-player.js';
import { iconByKind } from '../lib/icons.js';
import { renderSizingGuide } from '../play/sizing-guide.js';
import { renderPdpPlayground } from '../play/pdp-playground.js';

const INTERACTIVES = {
  'sizing-guide':   renderSizingGuide,
  'pdp-playground': renderPdpPlayground,
};

const root = document.getElementById('article-page');

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

const PILL_LABELS = {
  see:  { label: 'See',  aria: 'Open video' },
  hear: { label: 'Hear', aria: 'Open audio' },
  read: { label: 'Read', aria: 'Open extended reading' },
};

function buildModalContent(item, speaker) {
  if (item.kind === 'see') {
    return createVideoPlayer({ src: item.src, caption: item.caption || '' });
  }
  if (item.kind === 'hear') {
    return createAudioPlayer({ src: item.src || '', speaker, title: item.title, transcript: item.transcript || item.body || '' });
  }
  // read
  const wrap = el('div', { class: 'media-read' });
  if (item.title) wrap.append(el('h3', { class: 'media-read__title' }, item.title));
  if (speaker?.name) wrap.append(el('p', { class: 'media-read__byline' },
    el('span', { class: 'media-read__name' }, speaker.name),
    speaker.role ? el('span', { class: 'media-read__role' }, ` · ${speaker.role}`) : null,
  ));
  if (item.body) {
    String(item.body).split(/\n\n+/).forEach(p => {
      wrap.append(el('p', { class: 'media-read__body' }, p));
    });
  }
  return wrap;
}

function buildPill(media) {
  if (!media || media.kind !== 'pill' || !Array.isArray(media.items) || !media.items.length) return null;

  const items = media.items.filter(item => PILL_LABELS[item.kind]);
  if (!items.length) return null;

  const pill = el('aside', { class: 'media-pill', 'aria-label': 'Supplementary media' });

  if (media.speaker?.name) {
    pill.append(el('div', { class: 'media-pill__speaker' },
      el('span', { class: 'media-pill__avatar', 'aria-hidden': 'true' },
        media.speaker.name.charAt(0).toUpperCase()),
    ));
  }

  pill.append(el('div', { class: 'media-pill__icons' },
    ...items.map(item => {
      const meta = PILL_LABELS[item.kind];
      const iconBuilder = iconByKind[item.kind];
      const btn = el('button', {
        type: 'button',
        class: `media-pill__icon media-pill__icon--${item.kind}`,
        'aria-label': `${meta.aria}: ${item.title || meta.label}`,
        title: item.title || meta.label,
        onclick: () => openModal(buildModalContent(item, media.speaker)),
      });
      if (iconBuilder) {
        const icon = iconBuilder();
        icon.classList.add('media-pill__glyph');
        btn.append(icon);
      }
      btn.append(el('span', { class: 'media-pill__icon-label' }, meta.label));
      return btn;
    }),
  ));

  return pill;
}

function buildToc(sections) {
  return el('nav', { class: 'toc-sticky', 'aria-label': 'On this page' },
    el('h3', {}, 'On this page'),
    el('ol', {},
      ...sections.map(sec => el('li', {},
        el('a', {
          href: `#${sec.id}`,
          class: 'toc-label',
          onclick: (e) => {
            e.preventDefault();
            const target = document.getElementById(`section-${sec.id}`);
            if (!target) return;
            const stage = document.querySelector('.shell__stage');
            const rect = target.getBoundingClientRect();
            stage.scrollTo({ top: stage.scrollTop + rect.top - 24, behavior: 'smooth' });
          },
        }, sec.heading),
      )),
    ),
  );
}

function buildHero(article) {
  return el('header', { class: 'article-hero' },
    el('p', { class: 'article-hero__eyebrow' }, article.kicker || 'Thought Leadership'),
    el('h1', { class: 'article-hero__headline' }, article.title),
    article.deck ? el('p', { class: 'article-hero__deck' }, article.deck) : null,
    article.byline ? el('p', { class: 'article-hero__byline' },
      'By ', el('em', {}, article.byline.name),
      article.byline.role ? el('span', { class: 'article-hero__byline-divider' }, ` · ${article.byline.role}`) : null,
    ) : null,
  );
}

function buildSection(sec) {
  const pill = buildPill(sec.media);
  const sectionEl = el('section', {
    id: `section-${sec.id}`,
    class: 'article-section',
  },
    el('h2', { class: 'article-section__heading' }, sec.heading),
    ...sec.body.map(p => el('p', { class: 'article-section__body' }, p)),
  );
  if (pill) sectionEl.prepend(pill);
  return sectionEl;
}

let scrollSpyUnsub = null;

function setupScrollSpy(sections) {
  if (scrollSpyUnsub) scrollSpyUnsub();
  const links = root.querySelectorAll('.toc-sticky a');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = entry.target.id.replace(/^section-/, '');
      links.forEach(a => a.removeAttribute('aria-current'));
      const match = [...links].find(a => a.getAttribute('href') === `#${id}`);
      if (match) match.setAttribute('aria-current', 'true');
    }
  }, {
    root: document.querySelector('.shell__stage'),
    rootMargin: '0px 0px -70% 0px',
    threshold: 0,
  });
  sections.forEach(sec => {
    const node = document.getElementById(`section-${sec.id}`);
    if (node) observer.observe(node);
  });
  scrollSpyUnsub = () => observer.disconnect();
}

export function renderArticle(articleId) {
  const article = getArticle(articleId);
  if (!article) { root.innerHTML = ''; return; }
  root.innerHTML = '';
  closeModal(); // reset any open modal from previous view

  const hero = buildHero(article);

  // Interactive articles (Play) render a custom body, no ToC.
  if (article.interactive && INTERACTIVES[article.interactive]) {
    const body = el('div', { class: 'article-body-prose article-body-prose--interactive' });
    const layout = el('div', { class: 'article-layout article-layout--no-toc' },
      el('div', { class: 'article-column' }, hero, body),
    );
    root.append(layout);
    INTERACTIVES[article.interactive](body);
    return;
  }

  const sections = article.sections || [];
  if (sections.length === 0) {
    const empty = el('p', { class: 'article-section__body' }, 'Article content coming soon.');
    const layout = el('div', { class: 'article-layout article-layout--no-toc' },
      el('div', { class: 'article-column' }, hero, empty),
    );
    root.append(layout);
    return;
  }

  const toc = buildToc(sections);
  const body = el('div', { class: 'article-body-prose' },
    ...sections.map(buildSection),
  );
  const layout = el('div', { class: 'article-layout' }, toc, el('div', { class: 'article-column' }, hero, body));
  root.append(layout);

  setupScrollSpy(sections);
}
