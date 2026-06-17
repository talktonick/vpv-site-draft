# Osmo Island — Table of Contents for Article

Source: https://www.osmo.supply/resource/table-of-contents-for-article
Captured via Osmo "Copy context for AI → HTML/CSS/JS".
**Island rule:** do not refactor internal classes (`toc-*`) or the JS. MAST-ify only the wrapper around it.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
```
GSAP 3.15 + ScrollTrigger. Lenis optional (script uses `lenis.scrollTo` if a global `lenis` exists, else `window.scrollTo`). Uses the default window scroller — fine for the normal-scroll Webflow rebuild.

## Attribute contract
- `[data-toc-wrap]` — wraps BOTH the nav and the article content. Carries config: `data-toc-levels` (default `h2,h3`), `data-toc-offset` (default 50px, set to clear a sticky nav).
- `[data-toc-content]` — the rich-text element holding the headings (`.w-richtext`).
- `[data-toc-list]` — nav container; generated links appended here.
- `[data-toc-link]` — one template anchor inside the list; cloned per heading then removed.
- `[data-toc-text]` — child of the template that receives heading text.
- Per-link output: `[data-toc-item]`, `[data-toc-depth="2|3"]`, and active state `[data-toc-status="active"]`.
- Heading opt-outs: `[data-toc-ignore]` attr, or `{skip}` text marker (stripped from visible heading).

## HTML
```html
<div data-toc-offset="80" data-toc-wrap data-toc-levels="h2,h3" class="toc-layout">
  <aside class="toc-sidebar">
    <p class="toc-hero__label">on this page</p>
    <nav data-toc-list class="toc-list">
      <a data-toc-link data-toc-item data-toc-status="active" href="#" class="toc-link"><span data-toc-text="">Why Motion Matters</span></a>
      <a data-toc-link data-toc-item data-toc-depth="3" href="#" class="toc-link"><span data-toc-text="">The Cost of Afterthought</span></a>
    </nav>
  </aside>
  <div data-toc-content class="toc-article w-richtext">
    <!-- rich text: h2/h3 headings + body. {skip} marker and [data-toc-ignore] supported. -->
  </div>
</div>
```

## CSS
```css
.toc-layout {
  grid-column-gap: 4em;
  grid-row-gap: 4em;
  flex-flow: row;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 60em;
  margin-left: auto;
  margin-right: auto;
  padding-left: 4em;
  padding-right: 4em;
  display: flex;
  position: relative;
}
.toc-article { flex: 1; max-width: 40em; }
.toc-article h2 { letter-spacing: -.01em; margin-top: 2em; margin-bottom: .75em; font-size: 2em; font-weight: 500; line-height: 1.2; }
.toc-article p { margin-bottom: 1.5em; font-size: .9375em; line-height: 1.5; }
.toc-article h3 { margin-top: 2em; margin-bottom: .75em; font-size: 1.25em; font-weight: 500; }
.toc-article blockquote { color: #30557a; border-left-width: 2px; border-left-color: #6961fe; font-size: 1.125em; font-weight: 400; line-height: 1.4; }
.toc-article code { background-color: #dae3ee; border-radius: .25em; padding: .1em .4em .15em; font-family: Haffer Mono, Arial, sans-serif; font-size: .9em; display: inline-block; }
.toc-article ul { margin-bottom: 0; padding-left: 2em; }
.toc-article li { margin-bottom: 1em; font-size: .9375em; line-height: 1.5; }
.toc-sidebar { grid-column-gap: 1em; grid-row-gap: 1em; flex-flow: column; justify-content: flex-start; align-items: flex-start; width: 13.75em; display: flex; position: sticky; top: 2.5em; }
.toc-list { flex-flow: column; justify-content: flex-start; align-items: flex-start; width: 100%; display: flex; }
.toc-link { color: #8898aa; border-left: 1px solid #e3e8ee; padding: .4rem .5em .4rem 1em; font-size: .875em; text-decoration: none; transition: all .25s; }
@media screen and (max-width: 767px) {
  .toc-hero { padding-left: 2em; padding-right: 2em; }
  .toc-layout { flex-flow: column; padding-left: 2em; padding-right: 2em; }
  .toc-sidebar { width: 100%; position: relative; top: 0; }
}
```
Note: no styled rule shown for `[data-toc-status="active"]` — add the active-link treatment (V+V purple left-border) yourself; it's keyed off `data-toc-status`, not `.active`/`aria-current`.

## JavaScript
```js
function initTableOfContents() {
  document.querySelectorAll('[data-toc-wrap]').forEach(root => {
    const contentEl = root.querySelector('[data-toc-content]');
    const listEl = root.querySelector('[data-toc-list]');
    const templateLink = listEl?.querySelector('[data-toc-link]');
    if (!contentEl || !listEl || !templateLink) return;

    const levels = (root.getAttribute('data-toc-levels') || 'h2,h3').split(',').map(l => l.trim().toLowerCase()).filter(l => /^h[1-6]$/.test(l));
    const levelSelector = levels.join(', ');
    if (!levelSelector) return;

    const offset = parseInt(root.getAttribute('data-toc-offset')) || 50;
    const marker = '{skip}';

    const slugCounts = new Map();

    function slugify(text) {
      let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!slug) slug = 'section';
      const count = slugCounts.get(slug) || 0;
      slugCounts.set(slug, count + 1);
      return count === 0 ? slug : slug + '-' + (count + 1);
    }

    function stripMarker(el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.includes(marker)) {
          node.textContent = node.textContent.replace(marker, '').trim();
        }
      }
    }

    const allHeadings = Array.from(contentEl.querySelectorAll(levelSelector));
    const headings = [];

    allHeadings.forEach(heading => {
      if (heading.hasAttribute('data-toc-ignore')) return;
      if (heading.textContent.includes(marker)) {
        stripMarker(heading);
        return;
      }
      const text = heading.textContent.trim();
      if (!text) return;
      headings.push(heading);
    });

    if (!headings.length) return;

    headings.forEach(heading => {
      if (!heading.id) {
        heading.id = slugify(heading.textContent.trim());
      }
    });

    const tocLinks = [];

    headings.forEach(heading => {
      const clone = templateLink.cloneNode(true);
      const textTarget = clone.querySelector('[data-toc-text]') || clone;
      textTarget.textContent = heading.textContent.trim();

      clone.href = '#' + heading.id;
      clone.removeAttribute('data-toc-link');
      clone.setAttribute('data-toc-item', '');

      const level = heading.tagName.charAt(1);
      clone.setAttribute('data-toc-depth', level);

      listEl.appendChild(clone);
      tocLinks.push(clone);
    });

    listEl.querySelectorAll('[data-toc-link]').forEach(el => el.remove());

    // Active state tracking via ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      function setActive(index) {
        tocLinks.forEach(link => link.setAttribute('data-toc-status', ''));
        if (tocLinks[index]) tocLinks[index].setAttribute('data-toc-status', 'active');
      }

      headings.forEach((heading, i) => {
        const nextHeading = headings[i + 1];

        ScrollTrigger.create({
          trigger: heading,
          start: 'top ' + (offset + 1) + 'px',
          endTrigger: nextHeading || contentEl,
          end: nextHeading ? 'top ' + (offset + 1) + 'px' : 'bottom top',
          onToggle: self => {
            if (self.isActive) setActive(i);
          }
        });
      });

      if (window.scrollY <= headings[0].getBoundingClientRect().top + window.scrollY - offset) {
        setActive(0);
      }
    }

    // Click handler with smooth scroll
    listEl.addEventListener('click', e => {
      const link = e.target.closest('[data-toc-item]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();

      const id = link.getAttribute('href')?.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      if (typeof lenis !== 'undefined' && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(target, { offset: -offset });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTableOfContents();
});
```
