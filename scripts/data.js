// Loads data from /data/*.json. Initialized once at boot via initData().

export let programs = [];
export let products = [];
export let caseStudies = [];
export let articles = [];
export let growthFeatures = [];

let programIndex = new Map();
let productIndex = new Map();
let caseIndex = new Map();
let articleIndex = new Map();
let growthIndex = new Map();

export async function initData() {
  const [p, prod, cs, art, gf] = await Promise.all([
    fetch('data/programs.json').then(r => r.json()),
    fetch('data/products.json').then(r => r.json()),
    fetch('data/case-studies.json').then(r => r.ok ? r.json() : []).catch(() => []),
    fetch('data/articles.json').then(r => r.ok ? r.json() : []).catch(() => []),
    fetch('data/growth-features.json').then(r => r.ok ? r.json() : []).catch(() => []),
  ]);
  programs = p;
  products = prod;
  caseStudies = cs;
  articles = art;
  growthFeatures = gf;
  programIndex = new Map(programs.map(x => [x.id, x]));
  productIndex = new Map(products.map(x => [x.id, x]));
  caseIndex    = new Map(caseStudies.map(x => [x.id, x]));
  articleIndex = new Map(articles.map(x => [x.id, x]));
  growthIndex  = new Map(growthFeatures.map(x => [x.id, x]));
}

export function getProgram(id) { return programIndex.get(id); }
export function getProduct(id) { return productIndex.get(id); }
export function getCase(id)    { return caseIndex.get(id); }
export function getArticle(id) { return articleIndex.get(id); }
export function getGrowthFeature(id) { return growthIndex.get(id); }

export function productsForProgram(id) {
  return products.filter(p => (p.programs || []).includes(id));
}
export function programsForProduct(id) {
  const product = productIndex.get(id);
  if (!product) return [];
  return (product.programs || []).map(getProgram).filter(Boolean);
}

// Product.caseStudies (from CSV) is an array of case study NAMES.
// Resolve to full case study records when possible.
export function caseStudiesForProduct(id) {
  const product = productIndex.get(id);
  if (!product || !product.caseStudies) return [];
  return product.caseStudies
    .map(name => caseStudies.find(cs => cs.name === name) || { name, id: null })
    .filter(Boolean);
}

export function caseStudiesForProgram(id) {
  return caseStudies.filter(cs => (cs.programs || []).includes(id));
}
