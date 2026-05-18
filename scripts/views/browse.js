// Browse view — All Products / All Case Studies.
// Same layout pattern for both: header + filter chip bar + content
// (verbal = data-dense rows, visual = typographic card grid).

import { programs, products, caseStudies, articles, growthFeatures, getProgram, getProduct, getCase } from '../data.js';
import { setState, state } from '../state.js';

const ARTIFACT_LABELS = {
  'thought-leadership': 'Thought Leadership',
  'tools':              'Tools',
  'news':               'News',
  'work':               'Work',
  'play':               'Play',
};

const header = document.getElementById('browse-header');
const filterBar = document.getElementById('filter-bar');
const content = document.getElementById('browse-content');

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

// ---- Catalog definitions: filters and projection per browse type ----

function uniqueValues(items, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const v = keyFn(item);
    if (Array.isArray(v)) v.forEach(x => { if (!seen.has(x)) { seen.add(x); out.push(x); } });
    else if (v != null && !seen.has(v)) { seen.add(v); out.push(v); }
  }
  return out;
}

function getCatalog(which) {
  if (which === 'products') {
    return {
      title: 'All Products',
      eyebrow: 'Catalog',
      desc: 'Every service in the Commerce+ catalog. Filter by program, engagement type, or area of interest.',
      items: products,
      filters: [
        { key: 'program',    label: 'Program',    values: programs.map(p => ({ id: p.id, label: p.name })) },
        { key: 'engagement', label: 'Engagement', values: uniqueValues(products, p => p.engagement || (p.subcategory ? null : null)).filter(Boolean).map(v => ({ id: v, label: v })) },
        { key: 'category',   label: 'Category',   values: uniqueValues(products, p => p.category).filter(Boolean).map(v => ({ id: v, label: v })) },
      ],
      matches(item, filters) {
        if (filters.program    && !(item.programs || []).includes(filters.program)) return false;
        if (filters.engagement && item.engagement !== filters.engagement) return false;
        if (filters.category   && item.category   !== filters.category) return false;
        return true;
      },
      onClick: (item) => setState({ activeProduct: item.id, view: 'product', activeBrowse: null }),
    };
  }
  if (which === 'cases') {
    return {
      title: 'Case Studies',
      eyebrow: 'Selected work',
      desc: 'Client engagements across programs and industries. Filter by program or industry to explore the catalog.',
      items: caseStudies,
      filters: [
        { key: 'program',  label: 'Program',  values: programs.map(p => ({ id: p.id, label: p.name })) },
        { key: 'industry', label: 'Industry', values: uniqueValues(caseStudies, cs => cs.industry).filter(Boolean).map(v => ({ id: v, label: v })) },
      ],
      matches(item, filters) {
        if (filters.program  && !(item.programs || []).includes(filters.program)) return false;
        if (filters.industry && item.industry !== filters.industry) return false;
        return true;
      },
      onClick: (item) => item.id && setState({ activeCase: item.id, view: 'case', activeBrowse: null, caseView: 'standard' }),
    };
  }
  if (which === 'insights') {
    return {
      title: 'Insights',
      eyebrow: 'Catalog',
      desc: 'Tools, thought leadership, news, work, and play. Filter by artifact, program, or product.',
      items: articles,
      filters: [
        { key: 'kind',    label: 'Artifact', values: uniqueValues(articles, a => a.kind).filter(Boolean).map(k => ({ id: k, label: ARTIFACT_LABELS[k] || k })) },
        { key: 'program', label: 'Program',  values: programs
            .filter(p => articles.some(a => (a.relatedPrograms || []).includes(p.id)))
            .map(p => ({ id: p.id, label: p.name })) },
        { key: 'product', label: 'Product',  values: products
            .filter(p => articles.some(a => (a.relatedProducts || []).includes(p.id)))
            .map(p => ({ id: p.id, label: p.name })) },
      ],
      matches(item, filters) {
        if (filters.kind    && item.kind !== filters.kind) return false;
        if (filters.program && !(item.relatedPrograms || []).includes(filters.program)) return false;
        if (filters.product && !(item.relatedProducts || []).includes(filters.product)) return false;
        return true;
      },
      onClick: (item) => setState({ activeArticle: item.id, view: 'article', activeBrowse: null }),
    };
  }
  if (which === 'features') {
    return {
      title: 'Growth Features',
      eyebrow: 'Catalog',
      desc: 'Add-on features built on top of the core products, often shipped through case study engagements.',
      items: growthFeatures,
      filters: [
        { key: 'tier',    label: 'Tier',     values: uniqueValues(growthFeatures, g => g.tier).filter(Boolean).map(v => ({ id: v, label: v })) },
        { key: 'program', label: 'Program',  values: programs
            .filter(p => growthFeatures.some(g => (g.programs || []).includes(p.id)))
            .map(p => ({ id: p.id, label: p.name })) },
        { key: 'product', label: 'Product',  values: products
            .filter(p => growthFeatures.some(g => (g.products || []).includes(p.id)))
            .map(p => ({ id: p.id, label: p.name })) },
        { key: 'area',    label: 'Area',     values: uniqueValues(growthFeatures, g => g.areas || []).map(v => ({ id: v, label: v })) },
      ],
      matches(item, filters) {
        if (filters.tier    && item.tier !== filters.tier) return false;
        if (filters.program && !(item.programs || []).includes(filters.program)) return false;
        if (filters.product && !(item.products || []).includes(filters.product)) return false;
        if (filters.area    && !(item.areas    || []).includes(filters.area)) return false;
        return true;
      },
      onClick: (item) => {
        const firstCase = (item.cases || [])[0];
        if (firstCase) setState({ activeCase: firstCase, view: 'case', activeBrowse: null, caseView: 'standard' });
      },
    };
  }
  return null;
}

// ---- Rendering ----

function renderHeader(catalog, total, visible) {
  header.innerHTML = '';
  header.append(
    el('p', { class: 'browse-header__eyebrow' }, catalog.eyebrow),
    el('h1', { class: 'browse-header__title' }, catalog.title),
    el('p', { class: 'browse-header__desc' }, catalog.desc),
    el('p', { class: 'browse-header__count' }, `${visible} of ${total}`),
  );
}

function renderFilterBar(catalog) {
  filterBar.innerHTML = '';

  for (const filter of catalog.filters) {
    if (!filter.values.length) continue;
    const group = el('div', { class: 'filter-group', role: 'group', 'aria-label': filter.label },
      el('span', { class: 'filter-group__label' }, filter.label),
      el('div', { class: 'filter-group__chips' },
        ...filter.values.map(v => {
          const pressed = state.browseFilters[filter.key] === v.id;
          return el('button', {
            type: 'button',
            class: 'filter-chip',
            'aria-pressed': pressed ? 'true' : 'false',
            onclick: () => {
              const next = { ...state.browseFilters };
              if (next[filter.key] === v.id) delete next[filter.key];
              else next[filter.key] = v.id;
              setState({ browseFilters: next });
            },
          }, v.label);
        }),
      ),
    );
    filterBar.append(group);
  }

  const hasAny = Object.keys(state.browseFilters).length > 0;
  if (hasAny) {
    filterBar.append(el('button', {
      type: 'button',
      class: 'filter-reset',
      onclick: () => setState({ browseFilters: {} }),
    }, 'Reset'));
  }
}

// Product card — typographic, never visual artifact
function productCard(p) {
  return el('article', {
    class: 'browse-card browse-card--product',
    role: 'button',
    tabindex: '0',
    onclick: () => setState({ activeProduct: p.id, view: 'product', activeBrowse: null }),
  },
    el('div', { class: 'browse-card__head' },
      p.code ? el('span', { class: 'browse-card__code' }, p.code) : null,
      p.category ? el('span', { class: 'browse-card__category' }, p.category) : null,
    ),
    el('h2', { class: 'browse-card__name' }, p.name),
    p.description ? el('p', { class: 'browse-card__desc' }, p.description) : null,
    el('div', { class: 'browse-card__meta' },
      p.duration ? el('span', { class: 'browse-card__pill' }, p.duration) : null,
      p.subcategory ? el('span', { class: 'browse-card__pill' }, p.subcategory) : null,
    ),
  );
}

function productRow(p) {
  return el('div', {
    class: 'browse-row browse-row--product',
    role: 'button',
    tabindex: '0',
    onclick: () => setState({ activeProduct: p.id, view: 'product', activeBrowse: null }),
  },
    el('span', { class: 'browse-row__code' }, p.code || ''),
    el('span', { class: 'browse-row__name' }, p.name),
    el('span', { class: 'browse-row__category' }, p.category || ''),
    el('span', { class: 'browse-row__duration' }, p.duration || ''),
    el('span', { class: 'browse-row__programs' },
      (p.programs || []).map(getProgram).filter(Boolean).map(p => p.code).join(' · ')),
  );
}

function caseCard(cs) {
  return el('article', {
    class: 'browse-card browse-card--case',
    role: 'button',
    tabindex: '0',
    onclick: () => cs.id && setState({ activeCase: cs.id, view: 'case', activeBrowse: null, caseView: 'standard' }),
  },
    cs.hero
      ? el('div', { class: 'browse-card__hero' },
          el('img', { src: cs.hero, alt: '', loading: 'lazy' }))
      : el('div', { class: 'browse-card__hero browse-card__hero--placeholder' }),
    el('div', { class: 'browse-card__body' },
      el('div', { class: 'browse-card__head' },
        cs.industry ? el('span', { class: 'browse-card__category' }, cs.industry) : null,
        cs.year ? el('span', { class: 'browse-card__code' }, cs.year) : null,
      ),
      el('h2', { class: 'browse-card__name' }, cs.name),
      cs.summary ? el('p', { class: 'browse-card__desc' }, cs.summary) : null,
    ),
  );
}

function caseRow(cs) {
  return el('div', {
    class: 'browse-row browse-row--case',
    role: 'button',
    tabindex: '0',
    onclick: () => cs.id && setState({ activeCase: cs.id, view: 'case', activeBrowse: null, caseView: 'standard' }),
  },
    el('span', { class: 'browse-row__name' }, cs.name),
    el('span', { class: 'browse-row__category' }, cs.industry || ''),
    el('span', { class: 'browse-row__duration' }, cs.year || ''),
    el('span', { class: 'browse-row__programs' },
      (cs.programs || []).map(getProgram).filter(Boolean).map(p => p.code).join(' · ')),
  );
}

function insightCard(a) {
  return el('article', {
    class: `browse-card browse-card--insight browse-card--insight-${a.kind || 'other'}`,
    role: 'button', tabindex: '0',
    onclick: () => setState({ activeArticle: a.id, view: 'article', activeBrowse: null }),
  },
    el('div', { class: 'browse-card__head' },
      el('span', { class: 'browse-card__category' }, ARTIFACT_LABELS[a.kind] || a.kicker || 'Insight'),
      a.date ? el('span', { class: 'browse-card__code' }, a.date) : null,
    ),
    el('h2', { class: 'browse-card__name' }, a.title),
    a.deck ? el('p', { class: 'browse-card__desc' }, a.deck) : null,
    a.byline?.name ? el('div', { class: 'browse-card__meta' },
      el('span', { class: 'browse-card__pill' }, `By ${a.byline.name}`),
    ) : null,
  );
}
function insightRow(a) {
  return el('div', {
    class: 'browse-row browse-row--insight',
    role: 'button', tabindex: '0',
    onclick: () => setState({ activeArticle: a.id, view: 'article', activeBrowse: null }),
  },
    el('span', { class: 'browse-row__name' }, a.title),
    el('span', { class: 'browse-row__category' }, ARTIFACT_LABELS[a.kind] || ''),
    el('span', { class: 'browse-row__duration' }, a.date || ''),
    el('span', { class: 'browse-row__programs' },
      (a.relatedPrograms || []).map(getProgram).filter(Boolean).map(p => p.code).join(' · ')),
  );
}

function featureCard(g) {
  const linkedCase = (g.cases || [])[0];
  return el('article', {
    class: 'browse-card browse-card--feature',
    role: 'button', tabindex: '0',
    onclick: () => linkedCase && setState({ activeCase: linkedCase, view: 'case', activeBrowse: null, caseView: 'standard' }),
  },
    el('div', { class: 'browse-card__head' },
      el('span', { class: 'browse-card__category' }, 'Growth Feature'),
      g.tier ? el('span', { class: 'browse-card__code' }, `Tier · ${g.tier}`) : null,
    ),
    el('h2', { class: 'browse-card__name' }, g.name),
    g.desc ? el('p', { class: 'browse-card__desc' }, g.desc) : null,
    el('div', { class: 'browse-card__meta' },
      ...(g.areas || []).slice(0, 3).map(a => el('span', { class: 'browse-card__pill' }, a)),
    ),
  );
}
function featureRow(g) {
  const linkedCase = (g.cases || [])[0];
  return el('div', {
    class: 'browse-row browse-row--feature',
    role: 'button', tabindex: '0',
    onclick: () => linkedCase && setState({ activeCase: linkedCase, view: 'case', activeBrowse: null, caseView: 'standard' }),
  },
    el('span', { class: 'browse-row__name' }, g.name),
    el('span', { class: 'browse-row__category' }, g.tier || ''),
    el('span', { class: 'browse-row__duration' }, (g.areas || [])[0] || ''),
    el('span', { class: 'browse-row__programs' },
      (g.programs || []).map(getProgram).filter(Boolean).map(p => p.code).join(' · ')),
  );
}

function renderContent(catalog, which, mode) {
  content.innerHTML = '';
  const container = (mode === 'visual')
    ? el('div', { class: `browse-grid browse-grid--${which}` })
    : el('div', { class: `browse-list browse-list--${which}` });

  for (const item of catalog.items) {
    let node;
    if (which === 'products')      node = mode === 'visual' ? productCard(item) : productRow(item);
    else if (which === 'cases')    node = mode === 'visual' ? caseCard(item)    : caseRow(item);
    else if (which === 'insights') node = mode === 'visual' ? insightCard(item) : insightRow(item);
    else if (which === 'features') node = mode === 'visual' ? featureCard(item) : featureRow(item);
    if (node) container.append(node);
  }
  content.append(container);
}

// Reapply filter state to existing nodes (fade-and-shrink rather than re-render).
function applyFilters(catalog) {
  const filters = state.browseFilters;
  let visible = 0;
  const nodes = content.querySelectorAll('.browse-row, .browse-card');
  catalog.items.forEach((item, i) => {
    const node = nodes[i];
    if (!node) return;
    const match = catalog.matches(item, filters);
    node.dataset.state = match ? '' : 'dimmed';
    if (match) visible++;
  });
  return { visible, total: catalog.items.length };
}

export function renderBrowse() {
  const which = state.activeBrowse;
  if (!which) return;
  const catalog = getCatalog(which);
  renderFilterBar(catalog);
  renderContent(catalog, which, state.mode);
  const { visible, total } = applyFilters(catalog);
  renderHeader(catalog, total, visible);
}

// React to filter changes without re-rendering items (preserves fade-and-shrink).
export function refreshBrowseFilters() {
  if (!state.activeBrowse) return;
  const catalog = getCatalog(state.activeBrowse);
  renderFilterBar(catalog);
  const { visible, total } = applyFilters(catalog);
  renderHeader(catalog, total, visible);
}
