import { setupApplicationTest as upstreamSetupApplicationTest, setupRenderingTest as upstreamSetupRenderingTest, setupTest as upstreamSetupTest, } from 'ember-qunit';

// This file exists to provide wrappers around ember-qunit's / ember-mocha's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);

  // Additional setup for application tests can be done here.
  //
  // For example, if you need an authenticated session for each
  // application test, you could do:
  //
  // hooks.beforeEach(async function () {
  //   await authenticateSession(); // ember-simple-auth
  // });
  //
  // This is also a good place to call test setup functions coming
  // from other addons:
  //
  // setupIntl(hooks); // ember-intl
  // setupMirage(hooks); // ember-cli-mirage
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);

  // Additional setup for rendering tests can be done here.
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, options);

  // Additional setup for unit tests can be done here.
}

function styleSheetToObject(sheet: CSSStyleDeclaration): Record<string, string> {
  return Object.fromEntries(Object.keys(sheet).map(key => [key, sheet.getPropertyValue(key)])) as Record<string, string>
}

let currentElementIndex = 0;
function getAllElementComputedStyles(element: HTMLElement) {
  if (element.parentElement?.dataset.index === undefined) {
    currentElementIndex = 0;
  }
  element.dataset.index = currentElementIndex.toString();
  currentElementIndex += 1;
  const styles = [{
    element,
    pseudo: '',
    styles: styleSheetToObject(window.getComputedStyle(element))
  }];
  styles.push({
    element,
    pseudo: ':before',
    styles: styleSheetToObject(window.getComputedStyle(element, ':before'))
  });
  styles.push({
    element,
    pseudo: ':after',
    styles: styleSheetToObject(window.getComputedStyle(element, ':after'))
  });
  // @ts-expect-error ignore
  for (const child of element.children as HTMLElement[]) {
    getAllElementComputedStyles(child).forEach((style) => styles.push(style));
  }
  return styles;
}

function getChangedStyles(elementStyles1: Record<string, string>, elementStyles2: Record<string, string>) {
  const changed = {};
  for (const [key, value] of Object.entries(elementStyles1)) {
    if (elementStyles2[key] !== value) {
      changed[key] = elementStyles2[key];
      if (key === 'height') {
        console.log('diff height', elementStyles2[key], value);
      }
    }
  }
  return changed;
}

function elementRepresentation(element: HTMLElement, pseudo='') {
  let rep = '<'  + element.tagName.toLowerCase() + pseudo;
  // @ts-expect-error ignore
  for (const attribute of element.attributes as Attr[]) {
    const v = attribute.value.replace(/-ember[0-9]+/, '-ember123')
    rep += ` ${attribute.name}="${v}"`;
  }
  rep += '>';
  rep += '</' + element.tagName.toLowerCase() + pseudo + '>';
  return rep;
}

function getStylesDiff(styles: {pseudo: string; element: HTMLElement; styles: Record<string, string>}[], withCarbonStyles: {element: HTMLElement; styles: Record<string, string>}[]) {
  const stylesDiff: [string, Record<string, string>][] = [];
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const withCarbonStyle = withCarbonStyles[i];
    const diff = getChangedStyles(style.styles, withCarbonStyle.styles);
    if (Object.keys(diff).length > 0) {
      stylesDiff.push([elementRepresentation(style.element, style.pseudo), diff]);
    }
  }
  return stylesDiff;
}

export async function waitForAnimationFrame() {
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(true);
    });
  });
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(true);
    });
  });
  await new Promise((resolve) => {
    setTimeout(resolve, 150);
  });
}

export { setupApplicationTest, setupRenderingTest, setupTest, getAllElementComputedStyles, getChangedStyles, elementRepresentation, getStylesDiff };
