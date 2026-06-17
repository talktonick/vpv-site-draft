# Osmo Island — WhatsApp Modal (QR Code)

Source: https://www.osmo.supply/resource/whatsapp-modal
**Island rule:** keep `whatsapp-modal*` + `data-whatsapp-modal*`. Don't touch JS. Generates a QR (via kjua) for a WhatsApp URL; on touch devices opens the link directly. Likely NOT relevant to V+V — saved for completeness.

## Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/kjua@0.10.0/dist/kjua.min.js"></script>
```
kjua 0.10.0 (QR generator). No GSAP.

## Attribute contract
- `[data-whatsapp-modal="<wa-url>"]` on the modal wrapper (URL → QR). `[data-whatsapp-modal-status]` toggles `active`/`not-active`.
- `[data-whatsapp-modal-qr-canvas]` (QR mount), `[data-whatsapp-modal-link]` (href set to URL), `[data-whatsapp-modal-toggle]` (open/close), `[data-whatsapp-modal-trigger]` (external button; toggles link vs toggle child on touch).

## HTML (structure)
```html
<div data-whatsapp-modal-status="not-active" data-whatsapp-modal="https://wa.me/31612345678" class="whatsapp-modal">
  <div data-whatsapp-modal-toggle="" class="whatsapp-modal__dark"></div>
  <div class="whatsapp-modal__card">
    <div data-whatsapp-modal-qr-canvas="" class="whatsapp-modal__qr-canvas"></div>
    <div class="whatsapp-modal__text"><h2 class="whatsapp-modal__h2">WhatsApp us</h2><p class="whatsapp-modal__p">Scan the QR Code…</p></div>
    <a data-whatsapp-modal-link="" href="#" class="whatsapp-modal__btn"><span class="whatsapp-modal__btn-span">or chat via desktop</span></a>
    <div data-hover="" data-whatsapp-modal-toggle="" class="whatsapp-modal__close"><div class="whatsapp-modal__close-bar"></div><div class="whatsapp-modal__close-bar is--duplicate"></div></div>
  </div>
</div>
<div data-whatsapp-modal-trigger="" class="whatsapp-modal__btn is--large">
  <svg class="whatsapp-modal__icon-svg" ...></svg>
  <span class="whatsapp-modal__btn-span">WhatsApp us</span>
  <a data-whatsapp-modal-link="" href="#" class="whatsapp-modal__overlay-link"></a>
  <div data-hover="" data-whatsapp-modal-toggle="" class="whatsapp-modal__overlay-toggle"></div>
</div>
```

## CSS / JavaScript
Full CSS + `initWhatsAppModal()` (kjua SVG generation, link wiring, toggle, Escape-close) in chat log / Osmo source. Self-inits on DOMContentLoaded.
