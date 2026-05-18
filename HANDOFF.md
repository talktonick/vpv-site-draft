# V+V Commerce+ Site — Handoff to Claude Code

## What this is

A handoff document for continuing the V+V Commerce+ interactive site build in Claude Code, picking up from where the artifact-based work left off. The build had to move out of Claude.ai artifacts because the two source HTML files (~5,800 lines combined) plus accumulated conversation made context too tight to keep iterating cleanly.

Two source files live in the project root:

- `vv-sandbox.html` — the **visual design system source of truth**. Tokens, typography, components, motion. Built out over many sessions. Don't redesign it; use it.
- `vpv-wireframe.html` — the **structural/interactive source of truth**. Site architecture, the 7-program graph, Verbal/Visual toggle, browse views, case study and timeline patterns. Visually rough, but the IA is locked in.

The job is to rebuild the wireframe's architecture using the sandbox's visual language, split into a real multi-file project structure.

---

## What's already decided

These are not up for re-litigation. They were worked through in prior chats and signed off.

### Conflict resolution

When the wireframe and sandbox disagree on something **structural** (layout, interaction model), default to the **wireframe's interactive intent** and translate it into the sandbox's visual language. Invent new components in sandbox-consistent terms where needed; don't reach outside the sandbox's design language without flagging it first.

The known structural conflict is the **persistent right-side panel** (wireframe) vs the **sticky-ToC article body** (sandbox case study / thought leadership pages). The wireframe's panel wins on the main interactive shell; the sandbox's article layout stays for case study and thought leadership content pages. Flag any additional conflicts before resolving them.

### Mode toggle (Verbal/Visual)

A pill-style toggle with an inner sliding pill, ~`var(--dur-base)` with `var(--ease)`. Muted-silver container, cream active pill by default; purple-tinted active state on dark backgrounds. The pill primitive is **also** used for the case study Standard/Timeline toggle on Faherty. Filter chips do **not** use this pattern — they stay closer to `.tag-pill` since they're multi-select-shaped.

The toggle is a presentation-mode switch on the same underlying data, not a content fork.

### Build order

Landing first, in both modes, with the toggle working. Then program detail, product detail, case study, timeline, browse views. Wire one canonical example per view type fully before propagating. The wireframe's structure is already working — this is a styling/component-swap pass with file-structure cleanup, not a rebuild.

The previous chat had locked the landing scope and was mid-build when it hit the context wall. Plan for the in-progress landing build:

> Visual mode + Verbal mode landing, the `.explorer` shell (topbar + stage + right panel), the new pill mode toggle, breadcrumb, panel with index + accordion. No program focus, no product detail, no browse yet — just the landing in both modes, with the toggle working.

Start there.

---

## Data architecture (locked in)

**7 Commerce+ Programs**, two arcs:

- *Transformation:* Flagship Reimagination, Experience Revitalization, Architecture Migration
- *Growth:* LTV Enhancement, Conversion Optimization, Channel Expansion, Preventative Care

Arc labels appear as **sublabels on program nodes**, not top-level headings.

**~28–34 Products** with cross-cutting filter tags:

- Engagement type: Always-on / One-time setup / Strategic guidance
- Areas of interest: Redesign, Migration, Subscription, AI Enablement, Product Data, Retention, Conversion

Five orphan products (no program assignment yet) preserved for future assignment; visible in All Products browse.

**Case Studies** linked to programs and products. Halfdays, Faherty, Marion Parke have real copy, hero images, gallery imagery.

**Growth Features** are scoped add-ons, architecturally and visually distinct from core product deliverables. Dashed-border or otherwise visually differentiated treatment. Never collapsed into core product scope.

The Foundation/Expansion/Optimization CSV categories were removed from main nav and deferred to filter contexts only. Don't reintroduce them.

---

## What's in the sandbox you can use

(Verify against `vv-sandbox.html` directly — this is a pointer list, not the canonical inventory.)

- Design tokens: type scale (`--t-micro` through `--t-display`), 6-color palette, 4px-base spacing scale, motion tokens (`--ease`, `--dur-fast/base/slow`), radius tokens including `--radius-pill`, shadow tokens including `--shadow-soft`
- Typography rules including Victor Serif usage and the editorial-display exception
- Buttons (`.button` + variants)
- Voice pill (compact, block placement — never inline inside paragraphs)
- Video players (controls bottom-right)
- Engagement timeline
- Chapter player
- Expand triggers
- CTA block
- Contact form fields
- Editorial System view (the README-style documentation of the system itself)
- Components Lab view
- Thought leadership article layout (sticky ToC, article-body-prose)

Don't use `.active` class or `data-active="true"` — the sandbox uses a different active-state convention; mirror what's there.

---

## What's not in the sandbox and needs inventing

These are wireframe-specific patterns to build in the V+V visual language:

- **Node graph rendering** (the 7-program landing). SVG-based, hand-placed coordinates. Hover/click behavior, related-node highlighting, shared-product connectors. Faint Transformation/Growth arc divider.
- **SVG bezier connection curves** for Verbal mode hover-to-connect (program-to-product anchor dots)
- **Breadcrumb nav** in the topbar, updates per view
- **Filter bar** with chip-based controls and **fade-and-shrink** result behavior (items dim and compress rather than disappear)
- **Right-side panel** that persists across views with Index + contextual content / accordion
- **Product card** — typographic, service-oriented. Products are services, never visual artifacts. No fake screenshots, no implied visual deliverables.
- **Growth feature card** — visually distinguished from product cards (dashed border or similar add-on treatment)
- **Case study card** — real hero image, metrics, eyebrow tag
- **Engagement timeline view** (the Faherty case study has a Standard / Timeline toggle): sticky SVG timeline bar, three node sizes (major / ongoing / feature), smooth-scroll on node click

---

## Proposed file structure for the local repo

This is a suggestion, not a mandate — Claude Code should propose adjustments if there's a cleaner shape. The principle: split so no single file exceeds what's comfortable to read end-to-end in one pass, and so changes to one view don't require touching unrelated files.

```
/
├── index.html                    # Landing (Visual mode default)
├── styles/
│   ├── tokens.css                # All design tokens from sandbox
│   ├── base.css                  # Reset, typography, body
│   ├── components.css            # Buttons, pills, cards, form fields
│   ├── layout.css                # Explorer shell, topbar, panel, stage
│   └── views.css                 # View-specific (node graph, timeline, etc.)
├── scripts/
│   ├── mode-toggle.js            # Verbal/Visual presentation switch
│   ├── node-graph.js             # SVG node graph + bezier connectors
│   ├── filter-bar.js             # Filter chip behavior + fade-and-shrink
│   ├── panel.js                  # Right-panel accordion + index
│   └── timeline.js               # Engagement timeline interactions
├── views/
│   ├── landing.html              # If multi-page; otherwise sections in index
│   ├── program-detail.html
│   ├── product-detail.html
│   ├── case-study.html
│   ├── timeline.html
│   └── browse.html               # Or split into browse-products / browse-case-studies / browse-growth
├── data/
│   ├── programs.json
│   ├── products.json
│   ├── case-studies.json
│   └── growth-features.json
├── assets/
│   ├── fonts/
│   └── images/                   # Real client imagery (Halfdays, Faherty, Marion Parke)
└── HANDOFF.md                    # This file
```

Whether this is a static multi-page site, a single-page app with view-state switching, or something in between is a decision for the rebuild. The wireframe used view-state switching inside one HTML file. A real multi-page split is probably cleaner now.

---

## How Nick works (rules that override default behavior)

These are pulled from the user preferences and prior conversation patterns. They apply to all drafting, planning, and code commentary.

- **Show the shape of the work before asking for energy.** Before any multi-step process or series of questions, lay out what it is and what the steps are. Don't fire questions blind.
- **Default to neutral, editable drafts.** Don't perform Nick's voice. He'd rather get a clean draft and edit to taste.
- **Don't soften or hedge.** If something's bad, say it's bad. If a request is unclear, say it's unclear.
- **Don't manage feelings.** No "great question," no apologies for being direct, no emotional cushioning.
- **Don't connect dots across projects unless he draws the connection.** A specific project name in conversation is *that conversation's context*, not a permanent fact.
- **Don't promote a one-time mention to a recurring concern.**
- **When in doubt about which bucket something belongs to, ask.** Don't guess.

### Banned phrases

"delve / delve into," "leverage" (verb), "in today's fast-paced world," "synergy," "ideate," "circle back," "touch base," "world-class," "industry-leading," "best-in-class," "I'm passionate about…," "that's a great question," "what a fascinating idea," "I hope this helps," "let me know if you have any questions."

---

## Known gotchas

- **`margin: 0 auto` overrides parent stacking margins.** This bug was hit twice in the artifact work. Don't use `margin: 0 auto` on section-level containers.
- **Voice pills are block placement only**, above or below paragraphs. Never inline inside text.
- **The inline ToC pattern was deleted from the system.** Don't reintroduce it.
- **Product cards must not imply visual deliverables.** Typographic / service-oriented layouts only.
- **Growth features must be visually distinct from core product scope** in every view they appear.

---

## What to do first in Claude Code

1. Read `vv-sandbox.html` and `vpv-wireframe.html` end to end. Don't skim.
2. Propose a file structure (use the one above as a starting point; deviate with rationale).
3. Extract tokens from the sandbox into `styles/tokens.css` as the foundation.
4. Build the **landing** in both Visual and Verbal modes, with the Explorer shell (topbar + stage + right panel), the pill mode toggle, breadcrumb, and panel with index + accordion. No program focus, no product detail, no browse yet. Just the landing in both modes, with the toggle working.
5. Stop and check in before propagating to the next view.

Component mapping, what to invent, and build order should be the first response — no code yet. Sign-off before building.
