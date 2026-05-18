import { state, subscribe, setState } from './state.js';
import { renderLandingPanel, renderProgramPanel, renderProductPanel, renderCasePanel, renderBrowsePanel, renderArticlePanel, renderSystemPanel } from './panel.js';
import { getProgram, getProduct, getCase, getArticle } from './data.js';
import { renderProgramVisual, clearProgramVisual } from './views/program-visual.js';
import { renderVisualLanding } from './views/landing-visual.js';
import { renderProductVisual } from './views/product-visual.js';
import { renderProductVerbal } from './views/product-verbal.js';
import { renderCaseStandard } from './views/case-study.js';
import { renderCaseTimeline, showCaseSubview } from './views/case-timeline.js';
import { renderBrowse, refreshBrowseFilters } from './views/browse.js';
import { renderArticle } from './views/article.js';
import { renderHome, teardownHome } from './views/home.js';

const views = {
  'landing-visual':  document.getElementById('view-landing-visual'),
  'landing-verbal':  document.getElementById('view-landing-verbal'),
  'product-visual':  document.getElementById('view-product-visual'),
  'product-verbal':  document.getElementById('view-product-verbal'),
  'case':            document.getElementById('view-case'),
  'browse':          document.getElementById('view-browse'),
  'article':         document.getElementById('view-article'),
  'system':          document.getElementById('view-system'),
  'home':            document.getElementById('view-home'),
};

const systemFrame = document.getElementById('system-frame');

const verbalEyebrow = document.getElementById('verbal-eyebrow');
const verbalTitle = document.getElementById('verbal-title');
const verbalDesc = document.getElementById('verbal-desc');

// Path-aware breadcrumb: Programs › [Program (if set)] › [Product (if set)]
function makeCrumb(label, onClick, isCurrent) {
  if (isCurrent) {
    const span = document.createElement('span');
    span.setAttribute('aria-current', 'page');
    span.textContent = label;
    return span;
  }
  const a = document.createElement('a');
  a.setAttribute('role', 'button');
  a.setAttribute('tabindex', '0');
  a.textContent = label;
  a.addEventListener('click', onClick);
  return a;
}
function sep() {
  const el = document.createElement('span');
  el.className = 'shell__breadcrumb-sep';
  el.textContent = '›';
  return el;
}
function updateBreadcrumb(s) {
  const bc = document.getElementById('breadcrumb');
  const sn = document.getElementById('site-nav');
  bc.innerHTML = '';

  // Homepage: hide breadcrumb, show site nav.
  if (s.view === 'home') {
    bc.hidden = true;
    sn.hidden = false;
    return;
  }
  bc.hidden = false;
  sn.hidden = true;

  if (s.view === 'system' && s.activeSystemPage) {
    const labels = { 'editorial-system': 'Editorial System', 'components-lab': 'Components Lab' };
    bc.append(makeCrumb('Programs', () => setState({
      view: 'landing', activeProgram: null, activeProduct: null, activeCase: null, activeBrowse: null, activeArticle: null, activeSystemPage: null, hoverProgram: null,
    }), false));
    bc.append(sep());
    bc.append(makeCrumb('System', null, false));
    bc.append(sep());
    bc.append(makeCrumb(labels[s.activeSystemPage] || s.activeSystemPage, null, true));
    return;
  }

  // Article view renders as a sibling to "Programs" too
  if (s.view === 'article' && s.activeArticle) {
    const article = getArticle(s.activeArticle);
    bc.append(makeCrumb('Programs', () => setState({
      view: 'landing', activeProgram: null, activeProduct: null, activeCase: null, activeBrowse: null, activeArticle: null, hoverProgram: null,
    }), false));
    bc.append(sep());
    bc.append(makeCrumb('Insights', null, false));
    if (article) {
      bc.append(sep());
      bc.append(makeCrumb(article.title, null, true));
    }
    return;
  }

  // Browse views render as top-level siblings to "Programs" rather than nested.
  if (s.view === 'browse' && s.activeBrowse) {
    const labels = { products: 'All Products', cases: 'Case Studies', insights: 'Insights', features: 'Growth Features' };
    bc.append(makeCrumb('Programs', () => setState({
      view: 'landing', activeProgram: null, activeProduct: null, activeCase: null, activeBrowse: null, hoverProgram: null,
    }), false));
    bc.append(sep());
    bc.append(makeCrumb(labels[s.activeBrowse] || 'Browse', null, true));
    return;
  }

  const onLeaf = !!s.activeProgram || !!s.activeProduct || !!s.activeCase;

  bc.append(makeCrumb('Programs', () => setState({
    view: 'landing', activeProgram: null, activeProduct: null, activeCase: null, activeBrowse: null, hoverProgram: null,
  }), !onLeaf));

  if (s.activeProgram) {
    const program = getProgram(s.activeProgram);
    if (program) {
      bc.append(sep());
      bc.append(makeCrumb(program.name, () => setState({
        view: 'program', activeProduct: null, activeCase: null,
      }), !s.activeProduct && !s.activeCase));
    }
  }

  if (s.activeProduct) {
    const product = getProduct(s.activeProduct);
    if (product) {
      bc.append(sep());
      bc.append(makeCrumb(product.name, () => setState({
        view: 'product', activeCase: null,
      }), !s.activeCase));
    }
  }

  if (s.activeCase) {
    const cs = getCase(s.activeCase);
    if (cs) {
      bc.append(sep());
      bc.append(makeCrumb(cs.name, null, true));
    }
  }
}

// The verbal landing/program-list stage doubles as the "verbal product" stage
// for landing+program views. The product view uses its own dedicated stage.
function updateVerbalLandingHeader(s) {
  if (s.view === 'program' && s.activeProgram) {
    const program = getProgram(s.activeProgram);
    verbalEyebrow.textContent = `${program.code} · ${program.arc}`;
    verbalTitle.innerHTML = program.name.replace(/^(\w+)/, '<em>$1</em>');
    verbalDesc.textContent = program.desc;
    verbalDesc.hidden = false;
  } else {
    verbalEyebrow.textContent = 'Commerce+';
    verbalTitle.innerHTML = 'Seven <em>programs</em>, two arcs.';
    verbalDesc.textContent = '';
    verbalDesc.hidden = true;
  }
}

function showStage(view, mode) {
  let key;
  if (view === 'home')         key = 'home';
  else if (view === 'case')    key = 'case';
  else if (view === 'browse')  key = 'browse';
  else if (view === 'article') key = 'article';
  else if (view === 'system')  key = 'system';
  else if (view === 'product') key = `product-${mode}`;
  else                         key = `landing-${mode}`;
  // Mark the shell so we can hide the panel + mode pill on home
  document.querySelector('.shell')?.setAttribute('data-view', view);
  for (const [k, node] of Object.entries(views)) {
    if (!node) continue;
    node.dataset.state = (k === key) ? 'active' : '';
  }
}

function applyView(s) {
  showStage(s.view, s.mode);
  updateBreadcrumb(s);
  updateVerbalLandingHeader(s);

  if (s.view !== 'home') teardownHome();

  if (s.view === 'home') {
    renderHome();
    return;
  }

  if (s.view === 'browse' && s.activeBrowse) {
    renderBrowsePanel(s.activeBrowse);
    renderBrowse();
    return;
  }

  if (s.view === 'article' && s.activeArticle) {
    renderArticlePanel(s.activeArticle);
    renderArticle(s.activeArticle);
    return;
  }

  if (s.view === 'system' && s.activeSystemPage) {
    renderSystemPanel(s.activeSystemPage);
    const target = `vv-sandbox.html#${s.activeSystemPage}`;
    if (systemFrame.getAttribute('data-page') !== s.activeSystemPage) {
      systemFrame.src = target;
      systemFrame.setAttribute('data-page', s.activeSystemPage);
    }
    return;
  }

  if (s.view === 'case' && s.activeCase) {
    renderCasePanel(s.activeCase, s.activeProgram, s.activeProduct, s.caseView);
    renderCaseStandard(s.activeCase);
    renderCaseTimeline(s.activeCase);
    showCaseSubview(s.caseView);
    return;
  }

  if (s.view === 'product' && s.activeProduct) {
    renderProductPanel(s.activeProduct, s.activeProgram);
    renderProductVisual(s.activeProduct);
    renderProductVerbal(s.activeProduct);
    return;
  }

  if (s.view === 'program' && s.activeProgram) {
    renderProgramPanel(s.activeProgram);
    renderProgramVisual(s.activeProgram);
    return;
  }

  // Landing
  renderLandingPanel();
  clearProgramVisual();
  renderVisualLanding();
}

export function initRouter() {
  applyView(state);
  let last = snapshot(state);

  subscribe((next) => {
    const focusChanged =
      next.view !== last.view ||
      next.activeProgram !== last.activeProgram ||
      next.activeProduct !== last.activeProduct ||
      next.activeCase !== last.activeCase ||
      next.activeBrowse !== last.activeBrowse ||
      next.activeArticle !== last.activeArticle ||
      next.activeSystemPage !== last.activeSystemPage;
    const modeChanged = next.mode !== last.mode;
    const caseViewChanged = next.caseView !== last.caseView && next.view === 'case';
    const filtersChanged = next.browseFilters !== last.browseFilters && next.view === 'browse';

    if (focusChanged) applyView(next);
    else if (caseViewChanged) {
      showCaseSubview(next.caseView);
      renderCasePanel(next.activeCase, next.activeProgram, next.activeProduct, next.caseView);
    }
    else if (filtersChanged) refreshBrowseFilters();
    else if (modeChanged) {
      showStage(next.view, next.mode);
      // In browse view, mode also swaps row vs card rendering.
      if (next.view === 'browse') renderBrowse();
    }

    last = snapshot(next);
  });
}

function snapshot(s) {
  return {
    view: s.view,
    activeProgram: s.activeProgram,
    activeProduct: s.activeProduct,
    activeCase: s.activeCase,
    activeBrowse: s.activeBrowse,
    activeArticle: s.activeArticle,
    activeSystemPage: s.activeSystemPage,
    caseView: s.caseView,
    browseFilters: s.browseFilters,
    mode: s.mode,
  };
}
