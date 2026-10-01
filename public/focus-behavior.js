// Escape dismisses mouse-opened UI without switching to keyboard focus styling.
// Keep actual focus in place so the next Tab continues from the same control.
(() => {
  let keyboardNavigation = false;
  const root = document.documentElement;
  const clear = () => root.removeAttribute('data-pointer-dismiss');
  document.addEventListener('pointerdown', () => {
    keyboardNavigation = false;
    clear();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!keyboardNavigation) root.setAttribute('data-pointer-dismiss', '');
      return;
    }
    if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      keyboardNavigation = true;
      clear();
    }
  }, true);
})();
