# V+V Interactive Site — Project Brief

## What this chat is for

I'm rebuilding the Verbal+Visual (V+V) website. It's a commerce agency specializing in Shopify. The site needs to communicate the value of long-term client partnerships organized around interconnected programs, products, case studies, and growth features.

I have two existing artifacts that I'm combining here:

1. **`vv-sandbox.html`** (attached) — the V+V design system. Tokens, components, page layout rules. This is the **source of truth for visual language**. Treat it as a system reference you can pull from. Don't modify it.

2. **The wireframe** (I'll paste below) — a separate prototype that locked in the interactive architecture: node graph landing, program detail views, Verbal/Visual global mode toggle, product/case study/growth feature browse views, filter bars. This is the **structural reference for what to build**. The styling in it is placeholder — replace it with the sandbox's design language.

## What I want you to do

Rebuild the wireframe's architecture using the sandbox's design language. Same interactivity, same data model, but skinned with the V+V components, tokens, and rules.

**Do not one-shot this.** Build it view by view, starting with the landing. Get one view right, then propagate the patterns outward. The sandbox is the visual standard; if a wireframe pattern doesn't match the sandbox, ask before reskinning it.

Before writing any code on the first view, give me back a short plan:
- Which sandbox components map to which wireframe views
- What's missing from the sandbox that we'll need to invent (likely: node graph rendering, SVG bezier connection curves, filter bar with fade-and-shrink, breadcrumb nav)
- What order to build the views in

Then build the landing first.

---

## The data model (already locked in)

### Programs (7 total, across 2 arcs)

**Transformation arc** (foundation-resetting, less frequent):
- 01. Flagship Reimagination
- 02. Experience Revitalization
- 03. Architecture Migration

**Growth arc** (compounding, layered, ongoing):
- 04. LTV Enhancement
- 05. Conversion Optimization
- 06. Channel Expansion
- 07. Preventative Care

Program coverage is uneven — LTV Enhancement has 8 products, Architecture Migration has 1. The visual treatment needs to handle asymmetric product counts gracefully (size nodes by count, but normalized so the asymmetry doesn't break the composition).

### Products (~28–34)

Belong to one or more programs (some products are shared across multiple). Five products have no program assignment ("orphan products") — they're real products that live outside the program structure. Show them in browse views; figure out program assignment later.

Cross-cutting filter dimensions for products:
- **Engagement type**: Always-on / One-time setup / Strategic guidance
- **Areas of interest**: Redesign, Migration, Subscription, AI Enablement, Product Data, Retention, Conversion (these cut across programs and case studies too)

### Case studies

Three real clients: Halfdays, Faherty, Marion Parke. Each links to programs, products, and growth features. Case studies are hubs that point back up the graph, not leaf nodes.

Case study filter dimensions: Program, Industry, Area of Interest.

For multi-year clients, a case study can have a secondary view: an **engagement timeline** showing the arc of work across years. Already exists as a component in the sandbox (`.engagement-timeline`).

### Growth features

Scoped add-ons distinct from core product deliverables. ~15 currently invented for the wireframe. Three tiers: Large, Medium, Small. Filter dimensions: Program, Tier, Area of Interest.

**Critical visual distinction:** Growth features inside a case study must be visually distinguished from core scope (dashed-border treatment, separate "additional growth features" grouping). A prospect reading a case study should never confuse a growth feature add-on with what's included in the core product.

### Retainer cluster

Four products work together as a system: Site Care, Experimentation Engine, Ecommerce Roadmap, Growth Features. The retainer cluster should read visually as a denser group than four arbitrary products would — connected to each other, not just floating.

---

## Architectural decisions (already locked in)

### Landing state

V+V wordmark top-center. Below it, the 7 program nodes arranged in two zones: Transformation (3 nodes) and Growth (4 nodes). Nodes sized roughly by product count. Faint arc divider between Transformation and Growth, but the arc names appear as **sublabels** on each program node, not as top-level headings.

No center anchor. The programs themselves are the landing.

Right-side panel persists across views with an Index back to top level + contextual content (program details when a program is selected, etc.).

### Verbal/Visual global mode toggle

This is a **presentation mode switch**, not a content fork. Same underlying data renders differently:
- **Visual mode**: node graph, image-led cards, organic layouts
- **Verbal mode**: lists, tables with hover-to-connect SVG bezier curves from program to product anchor dots

Persists across all views. Affects every screen.

### Click behavior

Click a program → it promotes to focal position, products fan out around it, unrelated programs dim, related products (in 2+ programs) get a connector line + "shared" indicator. Right panel updates with that program's detail.

Click a product → detail page (real CSV copy, phases, growth features as dashed-border add-on cards, case study cards with real imagery, cross-reference navigation). Already built in the wireframe — use Optimized Storefront System as the canonical example.

Click a case study → case study page (hero image, metrics strip, challenge/approach/outcome, gallery, cross-references). Faherty also has an engagement timeline secondary view accessible from the case study.

### Browse views

Three separate browse views (not one combined view):
- **All Products** — 28 product cards/rows
- **All Growth Features** — ~15 feature cards
- **All Case Studies** — 3 case study cards

Each has its own top filter bar with the filters that actually apply to that content type. Filters use **fade-and-shrink** behavior (non-matches stay on screen but dim and compress). Filters live in the top bar; the right panel retains contextual index/connection info.

Filters are single-select per category currently. Multi-select within a category is a real product question for later.

### Foundation/Expansion/Optimization

This is a CSV-level product categorization that we've decided NOT to expose in main navigation. It might come back as a filter context inside the All Products view, but it's not a primary organizing principle. Don't add it back to the landing.

---

## What's in the sandbox you can use

### Tokens
- 6-color brand palette: Purple `#3012E4`, White, Cream, Silver, Navy, Midnight. Variations from opacity, not new colors.
- 10-step type scale (`--t-micro` 11px through `--t-display` 88px), two families (Neue Haas Display, Victor Serif). Victor Serif rules: bylines, italic emphasis in headlines, editorial display headlines, pull quotes. Not body italic, not UI.
- 4px-base spacing scale (`--s-1` 4px through `--s-10` 128px)
- Motion: `--dur-fast` 150ms, `--dur-base` 250ms, `--dur-slow` 400ms

### Page layout rules
- Outer page padding: `var(--s-6)` horizontal (32px), reduces on mobile
- Three column widths: `--col-narrow` 608px, `--col-medium` 832px, `--col-wide` 1152px
- Top-level child stacking: `var(--s-10)` margin between sections via `> * + *`
- **Important:** never use `margin: 0 auto` on section-level containers — it overrides the parent's stacking margin. Use `margin-inline: auto` instead.

### Canonical components
- `.button` with variants `--primary`, `--secondary`, `--ghost`, `--accent`, `--full`. Pill shape.
- `.voice-pill` — compact audio player. **Block placement only**, never inline inside paragraphs.
- `.engagement-timeline` — vertical milestone list, 3 statuses (completed, current, upcoming)
- `.chapter-player` — video player with named chapters, floating rail
- `.video-loop` — silent autoplay loop, controls bottom-right
- `.video-walkthrough` — audio video, controls bottom-right, starts muted
- `.expand-trigger` — inline card opening modal, 3 variants (read/see/hear icons)
- `.cta-block` — page-level call-to-action card, single or multi-button
- `.toc-sticky` — sticky sidebar table of contents, wrapped in `.article-layout`
- `.article-pullquote` — editorial pull quote
- `.article-body-prose` — reading column inside two-column layout
- `.contact-form` — soft-fill inputs with eyebrow labels

### Active state convention
Use `aria-current="true"` on any "this is the current item" state. Don't use `.active` class or `data-active="true"`.

---

## What's NOT in the sandbox and needs inventing

These are wireframe-specific patterns we'll need to build in the V+V visual language:

- **Node graph rendering** (the 7-program landing). SVG-based, hand-placed or art-directed coordinates. Hover/click behavior, related-node highlighting, shared-product connectors.
- **SVG bezier connection curves** for Verbal mode hover-to-connect
- **Breadcrumb nav** (top bar element, updates per view)
- **Filter bar** with chip-based controls and fade-and-shrink result behavior
- **Right-side panel** that persists across views with Index + contextual content
- **Product card** (typographic, service-oriented — never imply visual deliverables)
- **Growth feature card** (visually distinguished from product cards, dashed border or similar)
- **Case study card** (real hero image, metrics, eyebrow tag)

---

## Don't do this

- Don't one-shot the rebuild. Build view by view.
- Don't connect dots across projects unless I draw the connection.
- Don't bring personal context into work drafts unless I ask.
- Don't use `margin: 0 auto` on section-level containers.
- Don't make voice pills inline inside paragraphs — always block placement above or below.
- Don't reintroduce the inline ToC pattern (we deleted it from the system).
- Don't add the Foundation/Expansion/Optimization category split to the landing.
- Don't fake screenshot imagery for product cards — they're services, not visual artifacts. Typographic cards only.
- Don't drift from the sandbox's design language. If you want to invent something not in the sandbox, ask first.

---

## How I write & expect drafts

Direct, conversational, plain. No corporate hedging. No "I hope this helps." No "great question." If something's bad or unclear, say so.

Show me the shape of the work before asking me to commit energy to it.

Default to neutral, editable drafts. Don't try to perform my voice.

---

## What to do first

1. Wait for me to attach both files (sandbox + wireframe HTML).
2. Read both. Don't skim.
3. Give me back the short plan: component mapping, what to invent, build order. No code yet.
4. After I confirm the plan, build the landing first.
