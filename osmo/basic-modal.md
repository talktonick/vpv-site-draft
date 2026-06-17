# Osmo Island — Basic Modal Setup

Source: https://www.osmo.supply/resource/basic-modal-setup
**Island rule:** keep `modal__*` classes + `data-modal-*` contract. No external deps. Candidate for the Insights media-pill "Read" modal.

## Dependencies
None — vanilla JS.

## Attribute contract
- Group: `[data-modal-group-status="not-active"]` (→`active` when any modal open; styles the dark bg layer).
- Modal panel: `[data-modal-name="modal-a"]` + `[data-modal-status]`.
- Trigger: `[data-modal-target="modal-a"]` (value matches a `data-modal-name`) + `[data-modal-status]`.
- Close: `[data-modal-close]` on any element inside the group. Escape key also closes.

## HTML
```html
<div data-modal-group-status="not-active" class="modal">
  <div data-modal-close="" class="modal__dark"></div>
  <div data-modal-name="modal-a" data-modal-status="not-active" class="modal__card">
    <div class="modal__scroll">
      <div class="modal__content">
        <h2 class="modal__h2">Modal A</h2>
        <p class="modal__p">Lorem ipsum…</p>
      </div>
    </div>
    <div data-modal-close="" class="modal__btn-close"><div class="modal__btn-close-bar"></div><div class="modal__btn-close-bar is--second"></div></div>
  </div>
  <div data-modal-name="modal-b" data-modal-status="not-active" class="modal__card">
    <div class="modal__scroll"><div class="modal__content"><h2 class="modal__h2">Modal B</h2><p class="modal__p">Lorem ipsum…</p></div></div>
    <div data-modal-close="" class="modal__btn-close"><div class="modal__btn-close-bar"></div><div class="modal__btn-close-bar is--second"></div></div>
  </div>
</div>

<div data-modal-target="modal-a" data-modal-status="not-active" class="demo-btn"><p class="demo-btn__p">Modal A</p></div>
<div data-modal-target="modal-b" data-modal-status="not-active" class="demo-btn"><p class="demo-btn__p">Modal B</p></div>
```

## CSS
```css
.modal { z-index: 100; opacity: 0; pointer-events: none; visibility: hidden; justify-content: center; align-items: center; padding: 2em 1em; display: flex; position: fixed; inset: 0; overflow: hidden; transition: all 0.2s linear; }
.modal[data-modal-group-status="active"] { opacity: 1; visibility: visible; }
.modal__dark { opacity: .5; pointer-events: auto; cursor: pointer; background-color: #131313; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
.modal__card { pointer-events: auto; background-color: #efeeec; border-radius: 2em; width: 100%; max-width: 54em; max-height: 100%; padding: .75em; display: none; position: relative; }
.modal__card[data-modal-status="active"] { display: flex; }
.modal__scroll { grid-column-gap: 1.5em; grid-row-gap: 1.5em; background-color: #e2e1df; border-radius: 1.25em; flex-flow: column; width: 100%; max-height: 100%; display: flex; position: relative; overflow: scroll; }
.modal__content { grid-column-gap: 1.5em; grid-row-gap: 1.5em; flex-flow: column; padding: 2em; display: flex; }
.modal__h2 { margin-top: 0; margin-bottom: 0; font-size: 2.5em; font-weight: 500; line-height: 1.175; }
.modal__p { margin-bottom: 0; font-size: 1em; line-height: 1.5; }
.modal__btn-close { background-color: #efeeec; border-radius: 50%; justify-content: center; align-items: center; width: 3.5em; height: 3.5em; display: flex; position: absolute; top: 2.5em; right: 2.5em; }
.modal__btn-close-bar { background-color: currentColor; width: .125em; height: 40%; position: absolute; transform: rotate(45deg); }
.modal__btn-close-bar.is--second { transform: rotate(-45deg); }
.demo-btn { background-color: #efeeec; border-radius: 50em; justify-content: center; align-items: center; display: flex; position: relative; }
.demo-btn__p { margin-bottom: 0; padding: .65em 1.25em; font-size: 1em; }
```

## JavaScript
```js
function initModalBasic() {
  const modalGroup = document.querySelector('[data-modal-group-status]');
  const modals = document.querySelectorAll('[data-modal-name]');
  const modalTargets = document.querySelectorAll('[data-modal-target]');

  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener('click', function () {
      const modalTargetName = this.getAttribute('data-modal-target');
      modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
      modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));
      document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
      document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
      if (modalGroup) modalGroup.setAttribute('data-modal-group-status', 'active');
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', closeAllModals);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAllModals();
  });
  function closeAllModals() {
    modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
    if (modalGroup) modalGroup.setAttribute('data-modal-group-status', 'not-active');
  }
}

document.addEventListener('DOMContentLoaded', () => { initModalBasic(); });
```
