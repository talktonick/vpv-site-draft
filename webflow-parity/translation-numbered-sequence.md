# Translation → Webflow: Numbered Sequence (#05)

How the sandbox module (`sandbox.html`) becomes a native Webflow build. **This is also our
test case for documenting the translation process** — as you build, note what's confusing in
the Friction Log at the bottom and we'll refine these steps into a reusable playbook.

> Build this on a **duplicate / playground page**, not the live master template. (Right-click
> the master page in Webflow → Duplicate.)

Keep `sandbox.html` open in a browser tab as your "target" — compare after each phase.

---

## Webflow basics (the 5 things this build repeats)

1. **Add an element** — click **+** (top-left) or press **A**, then drag a *Section*, *Div
   Block*, *Heading*, or *Text Block* onto the canvas (or into the Navigator tree on the left).
2. **Apply an existing class** — select the element, type the class name in the **Selector
   field** (top of the right-hand Style panel). If it appears in **blue / "Existing"**, just
   press Enter to apply — **don't change its settings** (that would edit it everywhere).
   - **The "N on this page" tell:** under the selector it says e.g. "8 on this page" (reused
     his real class ✅) vs "1 on this page" (you just made a new one). Watch this.
   - **⚠️ Number-named classes drop the leading underscore in the Designer.** His CSS shows
     `._1-5`, `._3` — but Webflow can't start a class with a digit, so that `_` is an *export*
     artifact only. In the Designer they're **`1-5`** and **`3`** (named by gap size: `1-5` =
     1.5rem, `3` = 3rem). Type `1-5` (no underscore) and pick it from **Existing Combo
     Classes** — ignore any "Create `_1-5`" option.
3. **Make a combo class** (for our tweaks) — with the base class showing, type a *second* name
   after it → Webflow makes `base + yourcombo`. Style only lands on the combo.
   - When you type the name, a popup appears. **"Global Combo Classes"** (bottom) = an
     **existing** combo — click it to reuse (e.g. `_1-5`). **"Create … / New Combo Class"**
     (top, highlighted by default) = a **new** one — only for names with no existing match
     (`num-card__title`, `num-item__label`, `num-item__body`, `num-seq__eyebrow`).
   - ⚠️ Don't just press Enter for existing combos — Enter triggers "Create." **Click** the
     Global Combo Class entry. Verify by checking the relevant style already has a value
     (e.g. `_1-5` should show Gap `1.5rem`, not `0`).
4. **Set a color** — click the color swatch → pick the **named color** from the list. **Never
   type a hex** (that breaks dark mode).
5. **Set a unit** — after typing a number (e.g. padding), click the unit label (`PX`) and
   switch to **REM** where noted.

> Webflow's exact wording may differ slightly from below — tell me what you actually see and
> I'll correct the step.

---

## Phase 1 — Section + eyebrow

1. Add a **Section**. Selector field → type `section-new` (existing, blue) → Enter. *(It now
   carries his spacing + side padding automatically.)*
2. Add a **Text Block** inside it. Type `Engagement`.
3. Select it → apply existing `p1` → then add combo `num-seq__eyebrow`.
4. Style `num-seq__eyebrow`:
   - Typography → Transform → **All Caps**
   - Typography → Letter spacing → **1.5px**
   - Typography → Color → **navy-40-to-white-40** (named color)
   - Opacity → **100%**

✅ Target: small grey letter-spaced "ENGAGEMENT".

## Phase 2 — Card shell

5. Below the eyebrow, add a **Div Block** → apply existing `flex`, then type **`1-5`** (NO
   underscore — see basics #2) and pick it under **Existing Combo Classes**, *not* "Create."
   Confirm it reads **`flex` `1-5`**, says **"N on this page"** (N>1 = his real class), and that
   Direction is **Vertical** with Gap `1.5rem` (both come from his class). *(This is the stack
   that holds both cards.)*
6. Inside `flex _1-5`, add a **Div Block** → new class `num-card`.
7. Style `num-card`:
   - Layout → Display **Flex**, Direction **Horizontal**, Align **Start (top)**
   - Layout → **Gap** `2.5rem`
   - Spacing → Padding (all sides) `3rem`
   - Background → Color → **silver-to-navy**
   - Border → Radius `1.25rem`
   - **Size → Width `100%`** — ⚠️ make sure the unit is **`%`**, not REM/PX. (His `1-5` parent
     left-aligns children, so the card needs an explicit full width; `100%` fills the section.
     A stray **REM** here = a giant fixed width that overflows — see Friction Log #7.)

✅ Target: a full-width grey rounded rectangle. **It's *meant* to be full-width** (= section
width minus the 2.5rem side padding); it'll look like a big empty bar until the items go in at
Phase 5 — that's expected, not overflow. Sanity check: its right edge sits the same distance
from the page edge as the left inset (symmetric). Heroes/media go edge-to-edge; body sections
like this sit inside the padding.

## Phase 3 — The numeral

8. Inside `num-card`, add a **Text Block**, type `01` → new class `num-card__num`.
9. Style `num-card__num`:
   - Typography → Size `4rem`, Weight **Extralight / Thin (200)**, Line height `1`
   - Typography → Color → **purple-to-white**
   - Size → Width `5.5rem`; Flex child → **Don't shrink**

✅ Target: large purple "01" in a left gutter.

## Phase 4 — Content column + title

10. Inside `num-card` (after the numeral), add a **Div Block** → new class `num-card__body`.
11. Style: Display **Flex**, Direction **Vertical**, **Gap** `2rem`; Flex child → **Grow**.
12. Inside `num-card__body`, add a **Heading**, set level **H3**, type
    `Brand + Digital Assessment` → apply existing `h3-sans-new`, then combo `num-card__title`.
13. Style `num-card__title`: Weight **Semibold (600)**; Size → Max width **None**.

✅ Target: bold title to the right of the numeral.

## Phase 5 — The items

14. Inside `num-card__body` (below title), add a **Div Block** → new class `num-card__items`.
    Style: Display **Flex**, Vertical, **Gap** `1.5rem`.
15. Inside it, add a **Div Block** → new class `num-item`. Style: Display **Flex**, Vertical,
    **Gap** `0.25rem`.
16. Inside `num-item`, add a **Text Block** = label, type `Stakeholder Interview Analysis` →
    apply existing `p1`, then combo `num-item__label`. Style `num-item__label`: Weight
    **Semibold (600)**, Opacity **100%**, Color → **navy-to-white**.
17. Below the label, add a **Text Block** = body, type the paragraph → apply existing `p2`,
    then combo `num-item__body`. Style `num-item__body`: Size → Max width `620px`.
18. **Duplicate `num-item` twice** (select in Navigator → Ctrl/Cmd-C, Ctrl/Cmd-V), edit text to
    *Digital Experience Audit* and *Industry Benchmarking Analysis*.

✅ Target: bold dark labels with grey body paragraphs.

## Phase 6 — Second card

19. Select the whole `num-card` in the Navigator → copy → paste (now two cards). Edit the copy:
    numeral `02`, title `Strategy Blueprint`, and its two items. *(Styling carries over — same
    classes.)*

## Phase 7 — Responsive

The card's numeral-gutter layout gets cramped before a media grid does, so it stacks at
**≤767**, not 479. Verified in sandbox: 820px horizontal = clean, 600px stacked = clean.

- **Tablet (≤991): no change** — horizontal stays comfortable (verified at 820px).
- **Mobile Landscape (≤767):** select `num-card` → Layout Direction **Vertical**, Gap **1rem**,
  Padding (all) **2rem**. Select `num-card__num` → Size Width **Auto**, Typography Size **3rem**.
  *(This breakpoint cascades down to portrait too.)*
- **Mobile Portrait (≤479):** `num-card` Padding (all) **1.5rem**; `num-card__num` Size **2.5rem**.

*(His section padding + the `p1`/`p2` text resize on their own — no action.)*

## Phase 8 — Make it reusable (optional)

22. Select `num-card` in the Navigator → right-click → **Create Component**. Drop copies
    anywhere; edit text per instance.

---

## Friction Log (fill in as you build)

| Step | What happened / what was confusing | Fix or clarification |
|---|---|---|
| 5 | Typing `_1-5` showed a popup: "Create _1-5" vs "Global Combo Classes → _1-5" — unclear which reuses the existing one. | Pick the entry under **Global Combo Classes** = existing (reuse). "Create" = new/empty. Webflow highlights "Create" by default, so **click** the global one, don't press Enter. Added a general rule to "Webflow basics #3." |
| 7 | "Width 100%" was ambiguous — "width" appears under both **Size** and **Borders**. | Use **Size → Width**. Borders → Width is the border-line thickness (unused here). Every style step is prefixed with its panel section for exactly this reason. |
| 5 | Typed `_1-5` (per an earlier instruction); the popup's *existing* class showed as **`1-5`** (no underscore), so selecting it "dropped" the underscore — and a first attempt created a junk new combo ("1 on this page", Horizontal). | His number-named classes (`1-5`, `3`) display **without** the leading `_` in the Designer — the `_` is an *export* artifact (CSS can't start with a digit). Type **`1-5`**, pick **Existing Combo Classes** (confirm "N on this page" > 1). Ignore "Create `_1-5`." |
| 7 | Grey card stretched **past the right edge** with horizontal page scroll. | **Cause:** card Width was set to **`100 REM`** (≈1600px) — the unit slipped from the intended `%`. **Fix:** change the unit to **`%`** so it reads `100%`. **Lesson:** watch the unit dropdown; full-width child = `100%` (or Auto + stretch), never a fixed rem/px. |
| 16–17 | Two text blocks both set to `navy-to-silver` rendered different darkness — looked like a color bug. | It's **opacity**, not color. His `.p2`/`.p1`/`.p3` bake in **`opacity: .65`** (his muting technique for secondary text); full-strength text = 100%. Same color + different opacity = different darkness, **by design**. Check Style → **Effects → Opacity**. The card body (muted) is correct; the bold label is the 100% one. |

> When done, we distill the corrected steps + this log into a general `translation-playbook.md`.
