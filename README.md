# V+V Commerce+ — Interactive Site Draft

A working draft of the V+V Commerce+ public site. Static HTML / CSS / vanilla JS — no build step, no backend.

## Run locally

```bash
python3 scripts/lib/serve.py 8765
```

Then open `http://localhost:8765/`. The server sends no-cache headers so edits show on reload.

## Structure

- `index.html` — single entry, hosts every view
- `styles/` — design tokens (`tokens.css`), base reset, typography, the shell, components, and view-specific CSS
- `scripts/` — ES modules; `main.js` boots, `router.js` dispatches views, `state.js` holds runtime state, `data.js` loads JSON
- `scripts/views/` — one module per view (home, landing visual, landing verbal, program detail, product detail, case study, browse, article, system)
- `scripts/play/` — interactive tools (sizing guide, PDP playground)
- `scripts/lib/` — shared helpers (modal, video / audio players, icons, dev server, CSV-to-JSON build)
- `data/` — programs, products, case studies, growth features, articles
- `assets/` — fonts (extracted from the sandbox), images, video, audio
- `vv-sandbox.html` — the editorial system + components lab, embedded via iframe under the System footer link
- `HANDOFF.md` — the original handoff brief that scoped the build

## Rebuild product data from CSV

If you update the Notion Commerce+ Master Database and re-export, regenerate `data/products.json`:

```bash
python3 scripts/lib/build-products.py
```

By default it reads CSVs from `~/Downloads/Private & Shared 7/`. Pass `--csv-dir` to override.

## Deploy

Pushed to `main` and served by GitHub Pages. Any change pushed to `main` deploys automatically (give it 1–2 minutes after push).
