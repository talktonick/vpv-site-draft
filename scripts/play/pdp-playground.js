// PDP Playground — controls on the left, live product page preview on the right.
// Same content, dramatically different design depending on parameter selections.

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

// Real product content; tone-neutral so the design parameters do the work.
const PRODUCT = {
  brand: 'V+V',
  title: 'Top in cotton blend',
  tagline: 'Top in lightweight cotton blend featuring a striped pattern and scalloped detailing.',
  price: '$590',
  color: 'White / Yellow',
  details: [
    'Slim fit, regular length',
    'Pointelle stitch',
    'Scoop neck',
    'Anagram metal embellishment at the back',
  ],
  meta: [
    { label: 'Material', value: 'Cotton / polyamide' },
    { label: 'Weight',   value: '0.15 kg' },
    { label: 'Made in',  value: 'Italy' },
  ],
  variants: [
    { label: 'White / Yellow', swatch: '#F5EFB6', selected: true },
    { label: 'Navy',           swatch: '#1B2545' },
    { label: 'Stone',          swatch: '#D9CDB3' },
  ],
  shipping: 'Free returns within 14 days. Ships from Italy in 2–7 business days.',
  packaging: 'Shipped in a cotton cover bag, placed inside a seasonal box with festive tags.',
  images: [
    'assets/images/pdp-playground/01-fullbody.jpg',
    'assets/images/pdp-playground/02-front.jpg',
    'assets/images/pdp-playground/03-back.jpg',
    'assets/images/pdp-playground/04-detail.jpg',
    'assets/images/pdp-playground/05-product.jpg',
  ],
};

const PARAMS = {
  layout:    'image-left',     // image-left | image-right | image-top | fullbleed
  headline:  'sans-display',   // sans-display | serif-editorial | stacked-bold
  density:   'balanced',       // minimal | balanced | dense
  cta:       'pill',           // pill | bar | outline
  bg:        'cream',          // cream | silver | dark | accent
  imageMode: 'single',         // single | gallery | strip
  variants:  true,
  trust:     true,
};

const CONTROLS = [
  { key: 'layout',    label: 'Layout',          options: [
    { value: 'image-left',  label: 'Image left'  },
    { value: 'image-right', label: 'Image right' },
    { value: 'image-top',   label: 'Image top'   },
    { value: 'fullbleed',   label: 'Full bleed'  },
  ]},
  { key: 'headline',  label: 'Headline',        options: [
    { value: 'sans-display',     label: 'Sans'           },
    { value: 'serif-editorial',  label: 'Serif'          },
    { value: 'stacked-bold',     label: 'Stacked bold'   },
  ]},
  { key: 'density',   label: 'Density',         options: [
    { value: 'minimal',  label: 'Minimal'  },
    { value: 'balanced', label: 'Balanced' },
    { value: 'dense',    label: 'Dense'    },
  ]},
  { key: 'cta',       label: 'CTA style',       options: [
    { value: 'pill',    label: 'Pill'    },
    { value: 'bar',     label: 'Bar'     },
    { value: 'outline', label: 'Outline' },
  ]},
  { key: 'bg',        label: 'Background',      options: [
    { value: 'cream',  label: 'Cream'  },
    { value: 'silver', label: 'Silver' },
    { value: 'dark',   label: 'Dark'   },
    { value: 'accent', label: 'Accent' },
  ]},
  { key: 'imageMode', label: 'Image',           options: [
    { value: 'single',  label: 'Single'   },
    { value: 'gallery', label: 'Gallery'  },
    { value: 'strip',   label: 'Strip'    },
  ]},
];

let renderPreview = null;

function imageEl(src) {
  const wrap = el('div', { class: 'pdp-image' });
  const img = new Image();
  img.src = src;
  img.alt = '';
  img.loading = 'lazy';
  img.addEventListener('error', () => { wrap.classList.add('pdp-image--placeholder'); img.remove(); });
  wrap.append(img);
  return wrap;
}

function renderImages() {
  const wrap = el('div', { class: `pdp-images pdp-images--${PARAMS.imageMode}` });
  if (PARAMS.imageMode === 'single') {
    wrap.append(imageEl(PRODUCT.images[0]));
  } else if (PARAMS.imageMode === 'gallery') {
    wrap.append(...PRODUCT.images.slice(0, 4).map(imageEl));
  } else { // strip
    wrap.append(...PRODUCT.images.map(imageEl));
  }
  return wrap;
}

function renderHeadline() {
  const cls = `pdp-headline pdp-headline--${PARAMS.headline}`;
  if (PARAMS.headline === 'stacked-bold') {
    return el('h1', { class: cls },
      el('span', { class: 'pdp-headline__line' }, 'Top in'),
      el('span', { class: 'pdp-headline__line' }, 'cotton'),
      el('span', { class: 'pdp-headline__line' }, 'blend'),
    );
  }
  if (PARAMS.headline === 'serif-editorial') {
    return el('h1', { class: cls }, el('em', {}, PRODUCT.title));
  }
  return el('h1', { class: cls }, PRODUCT.title);
}

function renderCTA() {
  return el('button', {
    type: 'button',
    class: `pdp-cta pdp-cta--${PARAMS.cta}`,
    onclick: (e) => { e.preventDefault(); },
  },
    el('span', {}, 'Add to bag'),
    el('span', { class: 'pdp-cta__price' }, PRODUCT.price),
  );
}

function renderVariants() {
  if (!PARAMS.variants) return null;
  return el('div', { class: 'pdp-variants' },
    el('p', { class: 'pdp-variants__label' }, 'Color: ', el('strong', {}, PRODUCT.color)),
    el('div', { class: 'pdp-variants__swatches' },
      ...PRODUCT.variants.map(v => el('button', {
        type: 'button',
        class: 'pdp-swatch',
        'aria-label': v.label,
        'aria-pressed': v.selected ? 'true' : 'false',
        style: `--swatch: ${v.swatch}`,
      })),
    ),
  );
}

function renderDetails() {
  if (PARAMS.density === 'minimal') return null;
  return el('ul', { class: 'pdp-details' },
    ...PRODUCT.details.map(d => el('li', {}, d)),
  );
}

function renderMeta() {
  if (PARAMS.density !== 'dense') return null;
  return el('dl', { class: 'pdp-meta' },
    ...PRODUCT.meta.flatMap(m => [
      el('dt', {}, m.label),
      el('dd', {}, m.value),
    ]),
  );
}

function renderTrust() {
  if (!PARAMS.trust) return null;
  return el('div', { class: 'pdp-trust' },
    el('p', {}, PRODUCT.shipping),
    PARAMS.density === 'dense' ? el('p', {}, PRODUCT.packaging) : null,
  );
}

function renderInfoColumn() {
  const items = [];
  items.push(el('p', { class: 'pdp-eyebrow' }, PRODUCT.brand));
  items.push(renderHeadline());
  items.push(el('p', { class: 'pdp-tagline' }, PRODUCT.tagline));
  if (PARAMS.density !== 'minimal') items.push(renderDetails());
  items.push(renderVariants());
  items.push(renderCTA());
  if (PARAMS.trust) items.push(renderTrust());
  if (PARAMS.density === 'dense') items.push(renderMeta());
  return el('div', { class: 'pdp-info' }, ...items.filter(Boolean));
}

function renderPDP() {
  const cls = `pdp pdp--layout-${PARAMS.layout} pdp--bg-${PARAMS.bg}`;
  const node = el('article', { class: cls, 'data-bg': PARAMS.bg },
    renderImages(),
    renderInfoColumn(),
  );
  return node;
}

function renderControls() {
  const wrap = el('div', { class: 'pdp-controls' },
    el('h2', { class: 'pdp-controls__title' }, 'PDP Playground'),
    el('p', { class: 'pdp-controls__desc' },
      'One product. Every parameter. Watch the same content read as a different brand depending on the choices below.'),
  );

  for (const ctrl of CONTROLS) {
    const group = el('div', { class: 'pdp-control' },
      el('span', { class: 'pdp-control__label' }, ctrl.label),
      el('div', { class: 'pdp-control__opts' },
        ...ctrl.options.map(opt => el('button', {
          type: 'button',
          class: 'pdp-control__opt',
          'aria-pressed': PARAMS[ctrl.key] === opt.value ? 'true' : 'false',
          'data-key': ctrl.key,
          'data-value': opt.value,
          onclick: () => {
            PARAMS[ctrl.key] = opt.value;
            updateAriaForGroup(group, opt.value);
            renderPreview();
          },
        }, opt.label)),
      ),
    );
    wrap.append(group);
  }

  // Toggles
  const toggleGroup = el('div', { class: 'pdp-control' },
    el('span', { class: 'pdp-control__label' }, 'Modules'),
    el('div', { class: 'pdp-control__opts' },
      ...[['variants', 'Variants'], ['trust', 'Trust']].map(([key, label]) =>
        el('button', {
          type: 'button',
          class: 'pdp-control__opt',
          'aria-pressed': PARAMS[key] ? 'true' : 'false',
          onclick: (e) => {
            PARAMS[key] = !PARAMS[key];
            e.target.setAttribute('aria-pressed', PARAMS[key] ? 'true' : 'false');
            renderPreview();
          },
        }, label),
      ),
    ),
  );
  wrap.append(toggleGroup);

  return wrap;
}

function updateAriaForGroup(group, value) {
  group.querySelectorAll('.pdp-control__opt').forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.value === value ? 'true' : 'false');
  });
}

export function renderPdpPlayground(container) {
  container.innerHTML = '';

  const controls = renderControls();
  const previewWrap = el('div', { class: 'pdp-preview-wrap' });
  const previewInner = el('div', { class: 'pdp-preview' });
  previewWrap.append(previewInner);

  renderPreview = () => {
    previewInner.innerHTML = '';
    previewInner.append(renderPDP());
  };
  renderPreview();

  container.append(el('div', { class: 'pdp-playground' }, controls, previewWrap));
}
