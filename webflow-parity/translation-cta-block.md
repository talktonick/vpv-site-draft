# Translation → Webflow: Button (`.btn`) + CTA Block (#14)

Builds the reusable **`.btn`** component (gallery design, his tokens) and the **CTA Block** that
uses it. Target render: `webflow-parity/sandbox-cta.html` (serve at
`http://localhost:8765/webflow-parity/sandbox-cta.html`). Keep it open to compare.

> Build on the **playground/duplicate** page, not the live master.
> **Naming flag:** the base is `.btn`; since buttons are shared foundation, confirm with the dev
> whether he wants `.btn` or to fold it into his `.button-*` family. Not a blocker.

Webflow basics are in `translation-numbered-sequence.md` (combo popup, number-class underscore,
unit dropdown, panel-section prefixes). **New basics for this build:**
- **Link Block vs Button:** use a **Link Block** for `.btn` (Webflow's *Button* element can't hold
  a child icon; a Link Block can hold text + an icon).
- **Hover state:** styled via the **state selector** at the top of the Style panel (switch "None"
  → "Hover"). The *transition* is set on the base state; the radius change goes on Hover.
- **Custom SVG:** an **Embed** element (HTML embed) holds the icon `<svg>`; use `currentColor` so
  the icon matches the button text.

---

## Phase A — The base button `.btn`

1. Inside a flex container (e.g. a temporary section), add a **Link Block**.
2. Add a **Text Block** inside it → type `Talk to our team`.
3. Select the **Link Block** → new class **`btn`**. Style it:
   - Layout → Display **Flex**, Align **Center** (both axes), **Gap `.5rem`**.
   - Spacing → Padding `.875rem` (top/bottom) `1.75rem` (left/right).
   - Typography → Size `16px`, Weight **Medium (500)**, Line height `1.2`, Color → **white-to-navy**.
   - Background → Color → **navy-to-white**.
   - Border → Radius `100px` (full pill).
   - Typography → **Decor → None** (the **X**). A Link Block is an `<a>` and inherits the
     project's link underline — this strips it. (If it lingers, set Decor → None on the inner
     Text Block too.)

✅ Dark pill, white text, sized to its label.

## Phase B — The hover (radius morph)

4. With `.btn` selected, in the **base** state: Style panel → **Transitions** → add one →
   property **Border Radius**, duration **300ms**, easing **ease**.
5. Switch the **state selector** (top of Style panel) from **None → Hover**.
6. Now set Border → Radius **`12px`**.
7. **Switch the state back to None.** Hover the button on canvas — it morphs pill → squircle.

## Phase C — The CTA block (uses the base button)

8. Add a **Section** → class **`section-new`** (existing).
9. Inside, add a **Div Block** → new class **`cta-panel`**:
   - Background → Color → **silver-to-navy**; Border → Radius `1.25rem`.
   - Layout → Display **Flex**, Direction **Vertical**, Align **Center**, **Gap `1.5rem`**.
   - Spacing → Padding `6rem` (top/bottom) `2rem` (left/right).
   - Typography → Align **Center**.
10. Inside `cta-panel`, add a **Heading** (H2) → `Let's talk.` → apply existing **`h2-sans-new`**,
    then combo **`cta-title`** (Size → Max width **None**, so it centers cleanly).
11. Add a **Text Block** → the subtext → apply existing **`p2`**, then combo **`cta-sub`**
    (Size → Max width `32rem`).
12. Add a **Link Block** → apply existing **`btn`** → Text Block inside = `Talk to our team`.
    *(It already carries the full button styling + hover.)*

✅ Centered grey panel: headline + muted subtext + dark pill — matches the sandbox.

## Phase D — Variants (`.white`, `.accent`)

13. Duplicate the button somewhere to test. Add a combo on `.btn`:
    - **`.white`** → Background **`--swatch--white`** (white), Typography Color **`--swatch--midnight`**.
    - **`.accent`** → Background **`--swatch--purple`**, Typography Color **`--swatch--white`**.
    *(Both are fixed swatches so the accent stays purple and the white stays white in dark mode —
    matching his `.button-small.white`.)*

## Phase E — Icon slot

14. Inside a `.btn`, after the Text Block, add a **Div** → class **`icon-embed`** (existing, 16px).
15. Inside `icon-embed`, add an **Embed** element → paste the arrow SVG:
    ```html
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    ```
    → "Read more →". (Download uses the same idea with a download SVG inside a small
    `.btn__icon-circle` wrapper — bg `navy-10-to-white-20`, radius `999px`, ~`1.75rem`.)

## Phase F — Make it reusable (optional)

16. Select `.btn` → right-click → **Create Component**, with the label (and link) as editable
    properties. Drop it anywhere; variants via the `.white`/`.accent` combos still apply.

## Responsive
Buttons need no breakpoint changes. CTA panel: at **≤767**, reduce `cta-panel` Padding to
`3rem 1.5rem` (optional, if it feels too tall on phones). His type + section padding resize on
their own.

---

## Phase G — CTA + Form variant (Option A: centered, stacked)
Prototype: `sandbox-cta-form.html` (Option A). **Extend the CTA, don't rebuild** — duplicate the
CTA `section-new`, add combo **`.cta-panel.is-form`** (optional; panel is otherwise unchanged),
delete the lone button, and drop a native **Form Block** in (it's on the page, not the drawer, so
it binds/submits normally).
- **`.cta-form`** (the `<form>`): Flex Vertical, Align Center, Gap `.75rem`, Max-width `30rem`.
- **`.cta-input`** ×3 — set each input's **Name** to the Mailchimp field (placeholders are the human
  labels; delete default labels): **`EMAIL`** ("Email address", required) / **`FNAME`** ("Full name") /
  **`MMERGE2`** ("Company"). Style: Width 100%, Padding `.9rem 1.25rem`, **Font NeueHaasDisplay**, 16px,
  Color navy-to-white, BG white-to-midnight, Border 1px navy-10-to-white-20, Radius `.625rem`.
- **Consent:** Checkbox + label = real consent copy; label 14px, navy-to-silver, opacity 65%, left-aligned.
- **Submit:** apply `.btn` + Width 100%.
- ⚠️ **Set the inputs' Font to NeueHaasDisplay** — form fields don't inherit the body font, which is
  why they looked "slightly off" in the local preview. In Webflow (hosted fonts) this then matches the panel.
- **Mailchimp + tag:** wired **natively** (no Zapier, no API) — see **Mailchimp wiring** below.

## Mailchimp wiring (native — no Zapier, no API)
Confirmed from the generated embed (`Downloads/div id=mc_embed_shell (1).md`): Mailchimp's classic
embed now carries the **tag** as a hidden field, so our styled Webflow form can POST straight to
Mailchimp with the per-form tag. We **keep our form** and only transplant Mailchimp's plumbing onto
it. (These values are public — they appear in any live embedded form's page source — not API keys.)

**Plumbing:**
| Piece | Value |
|---|---|
| Form **Action** (`POST`) | `https://vpv.us1.list-manage.com/subscribe/post?u=31af38acb3ccc7d40489d873f&id=f50d12f9f6&f_id=006439e5f0` |
| Email | input **Name** `EMAIL` (required) |
| Full Name | input **Name** `FNAME` |
| Company | input **Name** `MMERGE2` |
| **Tag** (hidden) | `tags` = `6340706` ← "SCAYLE Landing Page (Webflow)" |
| Anti-bot honeypot (hidden) | `b_31af38acb3ccc7d40489d873f_f50d12f9f6` = empty |

**Steps:**
1. Select the **Form Block** (`<form>`) → Settings → **Action** = the URL above, **Method** `POST`.
2. Each `.cta-input` → Settings → **Name** = `EMAIL` / `FNAME` / `MMERGE2` (Email + the others Required).
3. Inside the form add an **Embed** with the hidden tag + honeypot:
   ```html
   <input type="hidden" name="tags" value="6340706">
   <div style="position:absolute; left:-5000px;" aria-hidden="true">
     <input type="text" name="b_31af38acb3ccc7d40489d873f_f50d12f9f6" tabindex="-1" value="">
   </div>
   ```
4. **Consent checkbox = Required.** Real copy (from the Leadpages form):
   > By checking this box, you agree to be contacted by Verbal+Visual regarding our products and
   > services. You also consent to allow Verbal+Visual to store and process the personal information
   > submitted in this form for the purpose of contacting you.

   Checkbox label **"Yes, I consent to receiving marketing emails"** + a Privacy Policy link.
5. **Submit** = the `.btn` (+ Width 100%).
6. **Success — better than expected (VERIFIED 2026-06-25):** Webflow's new **"Send to" custom endpoint**
   (Form Block → Send to → the Mailchimp URL + `POST`) posts to Mailchimp **and** shows Webflow's
   **native success state on-page** — no redirect, no JSONP, no `target="_blank"`. Test confirmed: the
   contact + `tags` landed in Master List and the page stayed put showing "Thank you!". So just **style
   the Success message** (Form Block → Settings → **State** → **Success**; style the `.w-form-done` box +
   its text). Leave **Redirect = None**.
7. **Notification:** Webflow does NOT store the submission or send its own email when posting to a custom
   endpoint, so for the admin@vpv.co "new lead" ping (Leadpages' Lead Notifications), enable **Mailchimp's
   own new-subscriber notification** in the audience settings.

## Scaling to N landing pages (the 10-forms question)
The **only** value that changes per landing page is the hidden **`tags`** number — action URL (→ Master
List), field names, and honeypot are identical everywhere. So:
- **Make the form a Webflow Component** and expose the hidden `tags` value as a per-instance **property**
  → drop it on each page, type that page's tag ID, done. One source of truth for styling.
- Or, once landing pages are a **CMS collection**, bind the hidden `tags` value to a "Mailchimp tag ID"
  CMS field — one form on the template, every page pulls its own tag.
- Each new tag's numeric ID comes from generating its embed once in Mailchimp (exactly like
  SCAYLE = `6340706`). **Never re-style, never re-embed the whole form.**

## Behavior (later, not styling)
Same `.btn`, different action: **link** = `href`; **drawer** = content-drawer trigger (like the
plus); **download** = `href` to file + `download` attribute. Appearance ≠ behavior.

---

## Friction Log
| Step | What was confusing | Fix / clarification |
|---|---|---|
| B (hover) | "State dropdown" not obvious; user was in the **Interactions** panel (Events/Interactions = Webflow's animation engine). | We want the **Style** tab's **hover STATE**, not an Interaction. State selector is at the **top of the Style panel** by the `btn` chip, defaults to **"None"** (above "Variable modes"). Transitions go on base state, radius change on Hover, then switch back to None. |
| A3 / 7 | Button text had a link underline. | `.btn` is a Link Block (`<a>`) → inherits the project's global link underline. **Fix:** `.btn` → Typography → **Decor → None** (the X). If it persists, set it on the inner Text Block too. (Sandbox hid it because its CSS had `text-decoration: none`; the Webflow steps had omitted it.) |
