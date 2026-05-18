// Single source of truth for runtime state.
// Mutations go through the setters so subscribers can react.

const listeners = new Set();

export const state = {
  mode: 'visual',
  view: 'home',
  activeProgram: null,
  activeProduct: null,
  activeCase: null,
  caseView: 'standard',
  activeBrowse: null,       // 'products' | 'cases' | null
  browseFilters: {},        // { [filterKey: string]: string } single-select per category
  activeArticle: null,      // article id (e.g. 'art-pfi')
  activeSystemPage: null,   // 'editorial-system' | 'components-lab' | null
  hoverProgram: null,
};

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setState(patch) {
  Object.assign(state, patch);
  for (const fn of listeners) fn(state);
}
