import { setState, state } from './state.js';
import { initData } from './data.js';
import { initModePill } from './mode-toggle.js';
import { initRouter } from './router.js';
import { renderVerbalLanding } from './views/landing-verbal.js';
import './views/landing-visual.js'; // registers subscriber for landing hover state

await initData();

const pillEl = document.querySelector('.shell__topbar .mode-pill');
initModePill(pillEl, {
  initial: state.mode,
  onChange: (mode) => setState({ mode }),
});

document.getElementById('shell-brand').addEventListener('click', () => {
  setState({
    view: 'home',
    activeProgram: null,
    activeProduct: null,
    activeCase: null,
    activeBrowse: null,
    activeArticle: null,
    activeSystemPage: null,
    hoverProgram: null,
  });
});

document.querySelectorAll('.shell__sitenav-link[data-nav]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const nav = a.dataset.nav;
    if (nav === 'programs')      setState({ view: 'landing', activeProgram: null, activeProduct: null, activeCase: null, activeBrowse: null, activeArticle: null, hoverProgram: null });
    else if (nav === 'cases')    setState({ view: 'browse', activeBrowse: 'cases',    browseFilters: {} });
    else if (nav === 'insights') setState({ view: 'browse', activeBrowse: 'insights', browseFilters: {} });
    else if (nav === 'capabilities') setState({ view: 'browse', activeBrowse: 'products', browseFilters: {} });
  });
});

document.querySelectorAll('.shell__footer-link[data-system]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    setState({ view: 'system', activeSystemPage: a.dataset.system });
  });
});

renderVerbalLanding();
initRouter();
