import { programs, products, caseStudies, articles, growthFeatures, getProgram, getProduct, getCase, getArticle, productsForProgram, caseStudiesForProduct, caseStudiesForProgram } from './data.js';
import { setState, state } from './state.js';

const panel = document.getElementById('panel');

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, '');
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
}

function accordionItem({ title, open = false, rightSlot = null }, listItems) {
  const header = el(
    'button',
    {
      class: 'accordion__header',
      type: 'button',
      'aria-expanded': open ? 'true' : 'false',
      onclick: () => {
        const next = header.getAttribute('aria-expanded') !== 'true';
        header.setAttribute('aria-expanded', next ? 'true' : 'false');
      },
    },
    el('span', { class: 'accordion__title' }, title),
    rightSlot,
    el('span', { class: 'accordion__toggle', 'aria-hidden': 'true' }, '+'),
  );
  const body = el('div', { class: 'accordion__body' },
    el('ul', { class: 'accordion__list' }, ...listItems)
  );
  return el('div', { class: 'accordion__item' }, header, body);
}

export function renderLandingPanel() {
  panel.innerHTML = '';

  const intro = el('section', { class: 'panel-section' },
    el('p', { class: 'panel-section__eyebrow' }, 'Commerce+'),
    el('h2', { class: 'panel-section__title' }, 'Index'),
    el('p', { class: 'panel-section__desc' },
      'Seven programs across two arcs — Transformation and Growth. Hover or click any program to see its products and case studies.'
    ),
  );

  const programItem = (p) => el('li', {},
    el('a', {
      role: 'button',
      tabindex: '0',
      onclick: () => setState({ activeProgram: p.id, view: 'program' }),
      onmouseenter: () => setState({ hoverProgram: p.id }),
      onmouseleave: () => setState({ hoverProgram: null }),
    },
      el('span', { class: 'accordion__code' }, p.code),
      el('span', { class: 'accordion__name' }, p.name),
      el('span', { class: 'accordion__arc' }, p.arc),
    )
  );

  const productItem = (prod) => el('li', {},
    el('a', {
      role: 'button',
      tabindex: '0',
      onclick: () => setState({ activeProduct: prod.id, view: 'product' }),
    },
      el('span', { class: 'accordion__name' }, prod.name),
    )
  );

  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

  const browseLink = (which, label) => el('a', {
    class: 'panel__browse-all',
    role: 'button',
    tabindex: '0',
    onclick: (e) => { e.stopPropagation(); setState({ view: 'browse', activeBrowse: which, browseFilters: {} }); },
  }, label);

  const catalog = el('section', { class: 'panel-section' },
    el('div', { class: 'accordion' },
      accordionItem({ title: 'Programs', open: true }, programs.map(programItem)),
      accordionItem({ title: 'Products', open: false, rightSlot: browseLink('products', 'Browse all') }, sortedProducts.map(productItem)),
      accordionItem({ title: 'Case Studies', open: false, rightSlot: browseLink('cases', 'Browse all') }, [
        el('li', { class: 'accordion__empty' }, 'Open Browse all to explore case studies.'),
      ]),
      accordionItem({ title: 'Growth Features', open: false, rightSlot: browseLink('features', 'Browse all') }, [
        el('li', { class: 'accordion__empty' }, 'Open Browse all to explore the growth feature catalog.'),
      ]),
      accordionItem({ title: 'Insights', open: false, rightSlot: browseLink('insights', 'Browse all') }, articles.length
        ? articles.map(a => el('li', {},
            el('a', {
              role: 'button', tabindex: '0',
              onclick: () => setState({ view: 'article', activeArticle: a.id }),
            },
              el('span', { class: 'accordion__name' }, a.title),
              el('span', { class: 'accordion__arc' }, a.kicker || ''),
            ),
          ))
        : [el('li', { class: 'accordion__empty' }, 'No published insights yet.')],
      ),
    )
  );

  panel.append(intro, catalog);
}

export function renderProgramPanel(programId) {
  const program = getProgram(programId);
  if (!program) return;
  panel.innerHTML = '';

  const back = el('a', {
    class: 'panel__back',
    role: 'button',
    tabindex: '0',
    onclick: () => setState({ activeProgram: null, view: 'landing', hoverProgram: null }),
  }, '← Index');

  const intro = el('section', { class: 'panel-section' },
    el('p', { class: 'panel-section__eyebrow' }, `${program.code} · ${program.arc}`),
    el('h2', { class: 'panel-section__title' }, program.name),
    el('p', { class: 'panel-section__desc' }, program.desc),
  );

  const productList = productsForProgram(programId);
  const productItems = productList.length
    ? productList.map(prod => el('li', {},
        el('a', {
          role: 'button',
          tabindex: '0',
          onclick: () => setState({ activeProduct: prod.id, view: 'product' }),
        },
          el('span', { class: 'accordion__name' }, prod.name),
        ),
      ))
    : [el('li', { class: 'accordion__empty' }, 'No products yet.')];

  const cases = caseStudiesForProgram(programId);
  const caseItems = cases.length
    ? cases.map(cs => el('li', {},
        el('a', {
          role: 'button',
          tabindex: '0',
          onclick: () => cs.id && setState({ activeCase: cs.id, view: 'case' }),
        },
          el('span', { class: 'accordion__name' }, cs.name),
          el('span', { class: 'accordion__arc' }, cs.industry || ''),
        ),
      ))
    : [el('li', { class: 'accordion__empty' }, 'No published case studies yet.')];

  const catalog = el('section', { class: 'panel-section' },
    el('div', { class: 'accordion' },
      accordionItem({ title: `Products (${productList.length})`, open: true }, productItems),
      accordionItem({ title: `Case Studies (${cases.length})`, open: false }, caseItems),
    )
  );

  panel.append(back, intro, catalog);
}

export function renderProductPanel(productId, fromProgramId) {
  const product = getProduct(productId);
  if (!product) return;
  panel.innerHTML = '';

  const backTarget = fromProgramId
    ? { label: '← Back to Program', state: { activeProduct: null, view: 'program' } }
    : { label: '← Index', state: { activeProduct: null, activeProgram: null, view: 'landing', hoverProgram: null } };

  const back = el('a', {
    class: 'panel__back',
    role: 'button',
    tabindex: '0',
    onclick: () => setState(backTarget.state),
  }, backTarget.label);

  const eyebrowParts = [product.code, product.category].filter(Boolean).join(' · ');

  const intro = el('section', { class: 'panel-section' },
    eyebrowParts ? el('p', { class: 'panel-section__eyebrow' }, eyebrowParts) : null,
    el('h2', { class: 'panel-section__title' }, product.name),
    product.description ? el('p', { class: 'panel-section__desc' }, product.description) : null,
  );

  const programList = (product.programs || []).map(getProgram).filter(Boolean);
  const programItems = programList.length
    ? programList.map(prog => el('li', {},
        el('a', {
          role: 'button',
          tabindex: '0',
          onclick: () => setState({ activeProgram: prog.id, view: 'program', activeProduct: null }),
        },
          el('span', { class: 'accordion__code' }, prog.code),
          el('span', { class: 'accordion__name' }, prog.name),
          el('span', { class: 'accordion__arc' }, prog.arc),
        ),
      ))
    : [el('li', { class: 'accordion__empty' }, 'No program assignment yet.')];

  const cases = caseStudiesForProduct(productId);
  const caseItems = cases.length
    ? cases.map(cs => el('li', {},
        el('a', {
          role: 'button',
          tabindex: '0',
          onclick: () => cs.id && setState({ activeCase: cs.id, view: 'case' }),
        },
          el('span', { class: 'accordion__name' }, cs.name),
          el('span', { class: 'accordion__arc' }, cs.industry || ''),
        ),
      ))
    : [el('li', { class: 'accordion__empty' }, 'No published case studies yet.')];

  const catalog = el('section', { class: 'panel-section' },
    el('div', { class: 'accordion' },
      accordionItem({ title: `In Programs (${programList.length})`, open: true }, programItems),
      accordionItem({ title: `Case Studies (${cases.length})`, open: cases.length > 0 }, caseItems),
    )
  );

  panel.append(back, intro, catalog);
}

export function renderCasePanel(caseId, fromProgramId, fromProductId, caseView) {
  const cs = getCase(caseId);
  if (!cs) return;
  panel.innerHTML = '';

  const backTarget = fromProductId
    ? { label: '← Back to Product', state: { activeCase: null, view: 'product' } }
    : fromProgramId
      ? { label: '← Back to Program', state: { activeCase: null, view: 'program', activeProduct: null } }
      : { label: '← Index', state: { activeCase: null, activeProduct: null, activeProgram: null, view: 'landing', hoverProgram: null } };

  const back = el('a', {
    class: 'panel__back',
    role: 'button',
    tabindex: '0',
    onclick: () => setState(backTarget.state),
  }, backTarget.label);

  const eyebrow = [cs.year, cs.industry].filter(Boolean).join(' · ');
  const intro = el('section', { class: 'panel-section' },
    eyebrow ? el('p', { class: 'panel-section__eyebrow' }, eyebrow) : null,
    el('h2', { class: 'panel-section__title' }, cs.name),
    cs.summary ? el('p', { class: 'panel-section__desc' }, cs.summary) : null,
  );

  // Standard / Timeline toggle (only when this case has a timeline)
  let toggle = null;
  if (cs.hasTimeline) {
    const opt = (sub, label) => el('button', {
      type: 'button',
      class: 'mode-pill__option',
      'aria-pressed': caseView === sub ? 'true' : 'false',
      onclick: () => setState({ caseView: sub }),
    }, label);
    toggle = el('section', { class: 'panel-section panel-section--toggle' },
      el('p', { class: 'panel-section__eyebrow' }, 'View'),
      el('div', { class: 'mode-pill mode-pill--inline' },
        el('span', { class: 'mode-pill__indicator', 'aria-hidden': 'true' }),
        opt('standard', 'Standard'),
        opt('timeline', 'Timeline'),
      ),
    );
  }

  const progItems = (cs.programs || []).map(getProgram).filter(Boolean).map(prog => el('li', {},
    el('a', {
      role: 'button', tabindex: '0',
      onclick: () => setState({ activeProgram: prog.id, view: 'program', activeCase: null, activeProduct: null }),
    },
      el('span', { class: 'accordion__code' }, prog.code),
      el('span', { class: 'accordion__name' }, prog.name),
      el('span', { class: 'accordion__arc' }, prog.arc),
    ),
  ));
  const prodItems = (cs.products || []).map(getProduct).filter(Boolean).map(prod => el('li', {},
    el('a', {
      role: 'button', tabindex: '0',
      onclick: () => setState({ activeProduct: prod.id, view: 'product', activeCase: null }),
    },
      el('span', { class: 'accordion__name' }, prod.name),
    ),
  ));
  const gfItems = (cs.growthFeatures || []).map(gf => el('li', { class: 'accordion__growth-feature' },
    el('span', { class: 'accordion__name' }, gf.name),
    gf.desc ? el('span', { class: 'accordion__growth-desc' }, gf.desc) : null,
  ));

  const catalog = el('section', { class: 'panel-section' },
    el('div', { class: 'accordion' },
      accordionItem({ title: `Programs (${progItems.length})`, open: true },
        progItems.length ? progItems : [el('li', { class: 'accordion__empty' }, 'No programs listed.')]),
      accordionItem({ title: `Products (${prodItems.length})`, open: false },
        prodItems.length ? prodItems : [el('li', { class: 'accordion__empty' }, 'No products listed.')]),
      accordionItem({ title: `Growth Features (${gfItems.length})`, open: false },
        gfItems.length ? gfItems : [el('li', { class: 'accordion__empty' }, 'No growth features listed.')]),
    )
  );

  panel.append(back, intro, toggle, catalog);

  if (toggle) {
    requestAnimationFrame(() => positionInlinePill(toggle.querySelector('.mode-pill')));
  }
}

export function renderArticlePanel(articleId) {
  const article = getArticle(articleId);
  if (!article) return;
  panel.innerHTML = '';

  const back = el('a', {
    class: 'panel__back',
    role: 'button', tabindex: '0',
    onclick: () => setState({ view: 'landing', activeArticle: null, hoverProgram: null }),
  }, '← Index');

  const intro = el('section', { class: 'panel-section' },
    el('p', { class: 'panel-section__eyebrow' }, article.kicker || 'Thought Leadership'),
    el('h2', { class: 'panel-section__title' }, article.title),
    article.deck ? el('p', { class: 'panel-section__desc' }, article.deck) : null,
    article.byline ? el('p', { class: 'panel-section__byline' },
      'By ', el('em', {}, article.byline.name),
      article.byline.role ? ` · ${article.byline.role}` : '',
    ) : null,
  );

  const relatedProducts = (article.relatedProducts || []).map(getProduct).filter(Boolean);
  const relatedPrograms = (article.relatedPrograms || []).map(getProgram).filter(Boolean);

  const programItems = relatedPrograms.length
    ? relatedPrograms.map(prog => el('li', {},
        el('a', {
          role: 'button', tabindex: '0',
          onclick: () => setState({ activeProgram: prog.id, view: 'program', activeArticle: null }),
        },
          el('span', { class: 'accordion__code' }, prog.code),
          el('span', { class: 'accordion__name' }, prog.name),
          el('span', { class: 'accordion__arc' }, prog.arc),
        ),
      ))
    : null;

  const productItems = relatedProducts.length
    ? relatedProducts.map(prod => el('li', {},
        el('a', {
          role: 'button', tabindex: '0',
          onclick: () => setState({ activeProduct: prod.id, view: 'product', activeArticle: null }),
        },
          el('span', { class: 'accordion__name' }, prod.name),
        ),
      ))
    : null;

  const sections = [
    programItems ? accordionItem({ title: `Related Programs (${programItems.length})`, open: false }, programItems) : null,
    productItems ? accordionItem({ title: `Related Products (${productItems.length})`, open: true }, productItems) : null,
  ].filter(Boolean);

  const catalog = sections.length
    ? el('section', { class: 'panel-section' }, el('div', { class: 'accordion' }, ...sections))
    : null;

  panel.append(back, intro, catalog);
}

export function renderBrowsePanel(which) {
  panel.innerHTML = '';

  const back = el('a', {
    class: 'panel__back',
    role: 'button', tabindex: '0',
    onclick: () => setState({ view: 'landing', activeBrowse: null, browseFilters: {} }),
  }, '← Index');

  const titles = {
    products: { title: 'All Products',    eyebrow: 'Catalog',          desc: 'Filter the full catalog by program, engagement type, or category. Click a product to open its detail.' },
    cases:    { title: 'Case Studies',    eyebrow: 'Selected work',    desc: 'Filter case studies by program or industry. Click a card to open the case.' },
    insights: { title: 'Insights',        eyebrow: 'Catalog',          desc: 'Tools, thought leadership, news, work, and play. Filter by artifact, program, or product.' },
    features: { title: 'Growth Features', eyebrow: 'Catalog',          desc: 'Add-on features layered on top of core products. Filter by tier, program, product, or area.' },
  };
  const t = titles[which] || { title: 'Browse', eyebrow: '', desc: '' };

  const intro = el('section', { class: 'panel-section' },
    t.eyebrow ? el('p', { class: 'panel-section__eyebrow' }, t.eyebrow) : null,
    el('h2', { class: 'panel-section__title' }, t.title),
    el('p', { class: 'panel-section__desc' }, t.desc),
  );

  const browseLink = (target, label, desc) => el('li', {},
    el('a', {
      role: 'button', tabindex: '0',
      onclick: () => setState({ view: 'browse', activeBrowse: target, browseFilters: {} }),
    },
      el('span', { class: 'accordion__name' }, label),
      desc ? el('span', { class: 'accordion__arc' }, desc) : null,
    ),
  );

  const otherItems = [
    which !== 'products' ? browseLink('products', 'All Products',    `${products.length}`) : null,
    which !== 'cases'    ? browseLink('cases',    'Case Studies',    `${caseStudies.length}`) : null,
    which !== 'insights' ? browseLink('insights', 'Insights',        `${articles.length}`) : null,
    which !== 'features' ? browseLink('features', 'Growth Features', `${growthFeatures.length}`) : null,
  ].filter(Boolean);

  const otherCatalogs = el('section', { class: 'panel-section' },
    el('div', { class: 'accordion' },
      accordionItem({ title: 'Other catalogs', open: true }, otherItems),
    )
  );

  panel.append(back, intro, otherCatalogs);
}

export function renderSystemPanel(page) {
  panel.innerHTML = '';
  const back = el('a', {
    class: 'panel__back',
    role: 'button', tabindex: '0',
    onclick: () => setState({ view: 'landing', activeSystemPage: null, hoverProgram: null }),
  }, '← Index');

  const labels = {
    'editorial-system': { title: 'Editorial System', eyebrow: 'System reference', desc: 'Tokens, type scale, color, spacing, motion, and the rules that govern the design system. Edit components in the sandbox and they update here.' },
    'components-lab':   { title: 'Components Lab',   eyebrow: 'System reference', desc: 'Every component and its variants, in one place. Use this page to spot drift between the system and a deployed view.' },
  };
  const t = labels[page] || { title: 'System', eyebrow: '', desc: '' };

  const intro = el('section', { class: 'panel-section' },
    el('p', { class: 'panel-section__eyebrow' }, t.eyebrow),
    el('h2', { class: 'panel-section__title' }, t.title),
    el('p', { class: 'panel-section__desc' }, t.desc),
  );

  const otherTarget = page === 'editorial-system' ? 'components-lab' : 'editorial-system';
  const otherLabel  = page === 'editorial-system' ? 'Components Lab' : 'Editorial System';

  const switcher = el('section', { class: 'panel-section' },
    el('div', { class: 'accordion' },
      accordionItem({ title: 'Switch view', open: true }, [
        el('li', {},
          el('a', { role: 'button', tabindex: '0',
            onclick: () => setState({ view: 'system', activeSystemPage: otherTarget }) },
            el('span', { class: 'accordion__name' }, otherLabel),
          )),
      ]),
    )
  );

  panel.append(back, intro, switcher);
}

function positionInlinePill(root) {
  if (!root) return;
  const indicator = root.querySelector('.mode-pill__indicator');
  const active = root.querySelector('.mode-pill__option[aria-pressed="true"]');
  if (!indicator || !active) return;
  const rRoot = root.getBoundingClientRect();
  const rOpt = active.getBoundingClientRect();
  indicator.style.width = `${rOpt.width}px`;
  indicator.style.transform = `translateX(${rOpt.left - rRoot.left - 3}px)`;
}
