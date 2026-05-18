// Product Sizing Guide Simulator.
// Sliders + selects feed a simple recommendation model. Recommendation
// updates live as inputs shift, with confidence and adjacent-size hints.

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

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function sizeIndexFromInputs({ heightIn, weightLb, build, fit }) {
  // Crude BMI-ish base, mapped to a 0..5 scale, then nudged by build and fit.
  const bmi = (weightLb * 703) / (heightIn * heightIn);
  let base = (bmi - 19) * 0.55;          // BMI 19 ≈ XS, every 1.8 BMI is roughly one size
  if (build === 'slim')     base -= 0.6;
  if (build === 'athletic') base += 0.4;
  if (build === 'broad')    base += 1.0;
  if (fit === 'snug')       base -= 0.6;
  if (fit === 'relaxed')    base += 0.6;
  return Math.max(0, Math.min(SIZES.length - 1, base));
}

function pickSizes(indexF) {
  const primary = SIZES[Math.round(indexF)];
  const distance = Math.abs(indexF - Math.round(indexF));     // 0..0.5
  const confidence = Math.round((1 - distance * 2) * 100);    // ~50..100
  let alternates = [];
  if (distance > 0.18) {
    const direction = indexF > Math.round(indexF) ? 1 : -1;
    const alt = SIZES[Math.round(indexF) + direction];
    if (alt) alternates.push(alt);
  }
  return { primary, alternates, confidence };
}

export function renderSizingGuide(container) {
  const inputs = { heightIn: 70, weightLb: 175, build: 'average', fit: 'true' };

  const recommendation = el('div', { class: 'sg-recommendation' });
  const updateRec = () => {
    const idx = sizeIndexFromInputs(inputs);
    const { primary, alternates, confidence } = pickSizes(idx);
    recommendation.innerHTML = '';
    recommendation.append(
      el('p', { class: 'sg-recommendation__eyebrow' }, 'Recommendation'),
      el('p', { class: 'sg-recommendation__size' }, primary),
      el('p', { class: 'sg-recommendation__confidence' }, `${confidence}% confident`),
      alternates.length
        ? el('p', { class: 'sg-recommendation__alt' }, `Or try ${alternates.join(' / ')}`)
        : el('p', { class: 'sg-recommendation__alt' }, 'Strong fit signal — alternates unlikely to be better.'),
    );
  };

  function slider({ label, key, min, max, step, suffix }) {
    const value = el('span', { class: 'sg-control__value' }, `${inputs[key]}${suffix}`);
    const input = el('input', {
      type: 'range', min, max, step,
      value: inputs[key],
      class: 'sg-control__range',
      oninput: (e) => {
        inputs[key] = Number(e.target.value);
        value.textContent = `${inputs[key]}${suffix}`;
        updateRec();
      },
    });
    return el('label', { class: 'sg-control' },
      el('span', { class: 'sg-control__label' }, label, ' ', value),
      input,
      el('div', { class: 'sg-control__bounds' },
        el('span', {}, `${min}${suffix}`), el('span', {}, `${max}${suffix}`),
      ),
    );
  }

  function radioGroup({ label, key, options }) {
    const group = el('div', { class: 'sg-control sg-control--radio' },
      el('span', { class: 'sg-control__label' }, label),
      el('div', { class: 'sg-control__radio-set', role: 'radiogroup' },
        ...options.map(opt => {
          const button = el('button', {
            type: 'button',
            class: 'sg-radio',
            'aria-pressed': inputs[key] === opt.value ? 'true' : 'false',
            onclick: () => {
              inputs[key] = opt.value;
              [...group.querySelectorAll('.sg-radio')].forEach(b => {
                b.setAttribute('aria-pressed', b.dataset.value === opt.value ? 'true' : 'false');
              });
              updateRec();
            },
            'data-value': opt.value,
          }, opt.label);
          return button;
        }),
      ),
    );
    return group;
  }

  const controls = el('div', { class: 'sg-controls' },
    slider({ label: 'Height',  key: 'heightIn', min: 58, max: 80, step: 1, suffix: '"' }),
    slider({ label: 'Weight',  key: 'weightLb', min: 90, max: 320, step: 5, suffix: ' lb' }),
    radioGroup({ label: 'Build', key: 'build', options: [
      { value: 'slim',     label: 'Slim' },
      { value: 'average',  label: 'Average' },
      { value: 'athletic', label: 'Athletic' },
      { value: 'broad',    label: 'Broad' },
    ]}),
    radioGroup({ label: 'Fit preference', key: 'fit', options: [
      { value: 'snug',    label: 'Snug' },
      { value: 'true',    label: 'True to size' },
      { value: 'relaxed', label: 'Relaxed' },
    ]}),
  );

  const intro = el('div', { class: 'sg-intro' },
    el('p', { class: 'article-section__body' },
      'Drag the inputs. Watch how the recommendation moves. This is a toy version of the kind of fit logic that powers the Fit Finder growth feature — adapted per brand to its real returns data, but the shape of the math is similar.'),
  );

  container.innerHTML = '';
  container.append(
    intro,
    el('div', { class: 'sg-grid' }, controls, recommendation),
    el('p', { class: 'sg-note' },
      'Real Fit Finder deployments tune coefficients per brand and category. This demo uses a generic apparel baseline.'),
  );

  updateRec();
}
