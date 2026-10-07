import * as carbonStyles from '@carbon/styles/css/styles.css?inline';

const ID = 'carbon-styles';

function carbonStyleElement() {
  const element = document.getElementById(ID);
  if (!(element instanceof HTMLStyleElement)) {
    throw new Error(
      'Carbon styles are not installed; see tests/test-helper.ts',
    );
  }
  return element;
}

/**
 * Loads `@carbon/styles` once for the whole suite. It goes first in `<head>`,
 * ahead of the addon's own stylesheet, the order an app loads them in.
 */
export function installCarbonStyles() {
  const style = document.createElement('style');
  style.id = ID;
  style.textContent = carbonStyles.default;
  document.head.prepend(style);
}

/**
 * Turns Carbon's styles off, so a style snapshot can record its unstyled
 * baseline. Call `enableCarbonStyles()` once the baseline is captured, then
 * `waitForAnimationFrame()` to let Carbon's transitions finish. A global
 * hook turns them back on after every test, so a failing test can't leave
 * them off.
 */
export function disableCarbonStyles() {
  carbonStyleElement().disabled = true;
}

export function enableCarbonStyles() {
  carbonStyleElement().disabled = false;
}
