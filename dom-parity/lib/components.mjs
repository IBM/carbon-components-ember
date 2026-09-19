/**
 * Registry of components covered by the DOM-parity fixtures. Each entry
 * describes how to render the upstream `@carbon/react` component; the
 * matching Ember invocation lives alongside the comparison test in
 * test-app/tests/components/dom-parity-test.gts and is kept in
 * sync with these props by hand - there is no codegen linking the two.
 *
 * To add a component: add an entry here, run `pnpm generate` in this
 * package to (re)write its fixture, then add a matching Ember render case
 * to the QUnit test.
 */
export const COMPONENTS = [
  {
    name: 'Button',
    createElement: (React, Carbon) => React.createElement(Carbon.Button, { kind: 'primary', size: 'lg' }, 'Button'),
  },
  {
    name: 'Tag',
    createElement: (React, Carbon) => React.createElement(Carbon.Tag, { type: 'gray' }, 'Tag content'),
  },
  {
    name: 'Loading',
    createElement: (React, Carbon) =>
      React.createElement(Carbon.Loading, { description: 'Active loading indicator', withOverlay: false }),
  },
];
