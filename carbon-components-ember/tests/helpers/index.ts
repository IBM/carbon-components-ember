export {
  setupApplicationTest,
  setupRenderingTest,
  setupTest,
} from 'ember-qunit';

function styleSheetToObject(
  sheet: CSSStyleDeclaration,
): Record<string, string> {
  return Object.fromEntries(
    Object.keys(sheet).map((key) => [key, sheet.getPropertyValue(key)]),
  );
}

let currentElementIndex = 0;
function getAllElementComputedStyles(el: Element) {
  const element = el as HTMLElement;
  if (element.parentElement?.dataset.index === undefined) {
    currentElementIndex = 0;
  }
  element.dataset.index = currentElementIndex.toString();
  currentElementIndex += 1;
  const styles = [
    {
      element,
      pseudo: '',
      styles: styleSheetToObject(window.getComputedStyle(element)),
    },
  ];
  styles.push({
    element,
    pseudo: ':before',
    styles: styleSheetToObject(window.getComputedStyle(element, ':before')),
  });
  styles.push({
    element,
    pseudo: ':after',
    styles: styleSheetToObject(window.getComputedStyle(element, ':after')),
  });
  for (const child of element.children) {
    getAllElementComputedStyles(child).forEach((style) => styles.push(style));
  }
  return styles;
}

function getChangedStyles(
  elementStyles1: Record<string, string>,
  elementStyles2: Record<string, string>,
) {
  const changed: Record<string, string | undefined> = {};
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

function elementRepresentation(element: Element, pseudo = '') {
  let rep = '<' + element.tagName.toLowerCase() + pseudo;
  for (const attribute of element.attributes) {
    const v = attribute.value.replace(/-ember[0-9]+/, '-ember123');
    rep += ` ${attribute.name}="${v}"`;
  }
  rep += '>';
  rep += '</' + element.tagName.toLowerCase() + pseudo + '>';
  return rep;
}

function getStylesDiff(
  styles: {
    pseudo: string;
    element: HTMLElement;
    styles: Record<string, string>;
  }[],
  withCarbonStyles: { element: HTMLElement; styles: Record<string, string> }[],
) {
  const stylesDiff: [string, Record<string, string | undefined>][] = [];
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i]!;
    const withCarbonStyle = withCarbonStyles[i]!;
    const diff = getChangedStyles(style.styles, withCarbonStyle.styles);
    if (Object.keys(diff).length > 0) {
      stylesDiff.push([
        elementRepresentation(style.element, style.pseudo),
        diff,
      ]);
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

export {
  getAllElementComputedStyles,
  getChangedStyles,
  elementRepresentation,
  getStylesDiff,
};
