#!/usr/bin/env node
/**
 * Renders every variant of every component in lib/components.mjs with the
 * pinned `@carbon/react` release (mounted via `react-dom/client` + `act()`,
 * not `renderToStaticMarkup` - Carbon React components rely on `useId`/
 * layout effects, so only a real client-side mount matches the post-effect
 * DOM that Ember's `render()` + `settled()` produces) and writes one
 * fixture per component to ./fixtures/<Name>.json, keyed by variant name.
 *
 * This is an offline step: fixtures are committed, and the QUnit suite in
 * test-app only ever reads them - it never runs this script itself. Rerun
 * manually (`pnpm generate`) after bumping the pinned @carbon/react version
 * in package.json, or after adding/changing an entry in lib/components.mjs.
 *
 * There is currently no scheduled CI job that reruns this and diffs the
 * result, so fixture drift against a newer @carbon/react release is only
 * caught the next time someone runs this manually - see the follow-up todo
 * for wiring that into CI.
 */
import { JSDOM } from 'jsdom';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
// Some @carbon/react components (e.g. Notification's
// useNoInteractiveChildren) reference DOM constructors like `HTMLElement`
// as bare globals rather than off `window`.
globalThis.HTMLElement = dom.window.HTMLElement;
// Node has its own read-only global `navigator` getter; jsdom's must
// replace it via defineProperty rather than plain assignment.
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = (await import('react')).default;
const { act } = React;
const { createRoot } = await import('react-dom/client');
const Carbon = await import('@carbon/react');
const { COMPONENTS } = await import('./lib/components.mjs');
const { normalizeElement } = await import('./lib/normalize-dom.mjs');

const carbonReactVersion = JSON.parse(
  readFileSync(join(__dirname, 'node_modules/@carbon/react/package.json'), 'utf8'),
).version;
const reactVersion = JSON.parse(
  readFileSync(join(__dirname, 'node_modules/react/package.json'), 'utf8'),
).version;

for (const component of COMPONENTS) {
  const variants = {};

  for (const variant of component.variants) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(variant.createElement(React, Carbon));
    });

    if (container.children.length !== 1) {
      throw new Error(
        `${component.name}/${variant.name}: expected exactly one rendered root element, got ${container.children.length}`,
      );
    }

    variants[variant.name] = {
      props: variant.props,
      dom: normalizeElement(container.firstElementChild),
    };

    act(() => {
      root.unmount();
    });
    container.remove();
  }

  const fixture = {
    component: component.name,
    generatedAt: new Date().toISOString(),
    carbonReactVersion,
    reactVersion,
    variants,
  };

  writeFileSync(
    join(__dirname, 'fixtures', `${component.name}.json`),
    JSON.stringify(fixture, null, 2) + '\n',
  );

  console.log(
    `Wrote fixtures/${component.name}.json (${Object.keys(variants).length} variant(s), ` +
      `@carbon/react@${carbonReactVersion})`,
  );
}
