/**
 * Registry of components (and per-component variants) covered by the
 * DOM-parity fixtures. Each variant describes how to render the upstream
 * `@carbon/react` component for one combination of args; the matching Ember
 * invocation lives alongside the comparison test in
 * test-app/tests/components/dom-parity-test.gts and is kept in sync with
 * these props by hand - there is no codegen linking the two. `props` is
 * recorded verbatim into the generated fixture purely so a reviewer can
 * check the Ember invocation against it without re-reading this file.
 *
 * Variant coverage is scoped to args that both sides actually implement and
 * that produce comparable DOM: Ember-only args with no React counterpart
 * (Button's `loading`, `confirmDialog`, `bubbles`, `onClick`) and
 * React-only props Ember never ported (`href`, `isExpressive`,
 * `tooltip*`, the `danger--*` compound kinds, sizes Ember doesn't support)
 * are out of scope for this harness - see AGENTS.md's parity-check script
 * for tracking those instead. `hasIconOnly` is also skipped for Button: in
 * @carbon/react it swaps in an entirely different component (`IconButton`,
 * wrapped in a tooltip) rather than toggling a class on the same root
 * element, so it isn't a fair "variation of args" comparison here.
 *
 * Link's `renderIcon` is skipped for the same reason `hasIconOnly` is
 * skipped for Button: the icon markup itself comes from each side's own,
 * unrelated icon component, so a `renderIcon` variant would mostly be
 * comparing two different icon implementations rather than Link's own
 * wrapping markup. `onClick` is Ember-only DOM-invisible behavior, out of
 * scope like Button's.
 *
 * Tile, Notification/ToastNotification/InlineNotification, CodeSnippet,
 * Breadcrumb, and the Grid family (Grid/Row/Column) were all considered for
 * this same batch and deliberately left out - see todo #836 for why each
 * needs its own, separate pass instead: a real conflated-type bug in
 * Notification (its `inline` display hardcodes
 * `cds--inline-notification--error` regardless of `@type`), a
 * feature-flag-dependent default in Grid (@carbon/react's `Grid` renders
 * CSS Grid by default at this pinned version, not the flexbox grid Ember's
 * `Grid` defaults to - needs its own investigation before either side is
 * "fixed"; also expect the same `element`-helper `ember-view`/auto-id
 * artifact recorded in known-differences.json for Link, since Grid/
 * GridColumn/GridRow all render their root tag via `element` too), a
 * structurally different root element/API in Breadcrumb (a `<nav>` of
 * plain strings vs. React's `<div>` of `BreadcrumbItem`/`Link` children),
 * and Popover-dependent interactive state in CodeSnippet (its `CopyButton`
 * tooltip), matching this file's existing Modal/ComboBox/Dropdown/
 * DatePicker exclusion.
 *
 * To add a component or variant: add/extend an entry here, run
 * `pnpm generate` in this package to (re)write its fixture, then add a
 * matching Ember render case to the QUnit test.
 */

const button = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) => React.createElement(Carbon.Button, props, 'Button'),
});

const tag = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) => React.createElement(Carbon.Tag, props, 'Tag content'),
});

const link = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) => React.createElement(Carbon.Link, props, 'Link text'),
});

// Both list factories render two `ListItem`s so a regression in the
// `cds--list__item` class the parent list stamps onto its children (see
// ordered-list.gts's `addItemClass` modifier) would show up here too, not
// just in ListItem's own standalone fixture below.
const unorderedList = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(
      Carbon.UnorderedList,
      props,
      React.createElement(Carbon.ListItem, { key: '1' }, 'Item 1'),
      React.createElement(Carbon.ListItem, { key: '2' }, 'Item 2'),
    ),
});

const orderedList = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(
      Carbon.OrderedList,
      props,
      React.createElement(Carbon.ListItem, { key: '1' }, 'Item 1'),
      React.createElement(Carbon.ListItem, { key: '2' }, 'Item 2'),
    ),
});

export const COMPONENTS = [
  {
    name: 'Button',
    variants: [
      button('primary-lg', { kind: 'primary', size: 'lg' }),
      button('secondary', { kind: 'secondary', size: 'md' }),
      button('danger', { kind: 'danger', size: 'md' }),
      button('tertiary', { kind: 'tertiary', size: 'md' }),
      button('ghost', { kind: 'ghost', size: 'md' }),
      button('size-sm', { kind: 'primary', size: 'sm' }),
      button('size-md', { kind: 'primary', size: 'md' }),
      button('size-xl', { kind: 'primary', size: 'xl' }),
      button('disabled', { kind: 'primary', size: 'md', disabled: true }),
    ],
  },
  {
    name: 'Tag',
    variants: [
      tag('red', { type: 'red' }),
      tag('magenta', { type: 'magenta' }),
      tag('purple', { type: 'purple' }),
      tag('blue', { type: 'blue' }),
      tag('cyan', { type: 'cyan' }),
      tag('teal', { type: 'teal' }),
      tag('green', { type: 'green' }),
      tag('gray', { type: 'gray' }),
      tag('cool-gray', { type: 'cool-gray' }),
      tag('warm-gray', { type: 'warm-gray' }),
      tag('high-contrast', { type: 'high-contrast' }),
      tag('outline', { type: 'outline' }),
      tag('disabled', { type: 'gray', disabled: true }),
      tag('size-sm', { type: 'gray', size: 'sm' }),
      tag('size-lg', { type: 'gray', size: 'lg' }),
    ],
  },
  {
    name: 'Loading',
    variants: [
      // Ember's Loading conflates three upstream shapes (overlay / plain /
      // inline) behind one component via @withOverlay/@inline - see
      // loading.gts. The overlay and plain branches both come from
      // @carbon/react's own `Loading`; the inline branch is a genuinely
      // different upstream component, `InlineLoading` (see the `inline`
      // variant below), not `Loading` with some extra prop.
      {
        name: 'overlay-active',
        props: { withOverlay: true, active: true, description: 'Active loading indicator' },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: true,
            active: true,
            description: 'Active loading indicator',
          }),
      },
      {
        name: 'overlay-active-small',
        props: {
          withOverlay: true,
          active: true,
          small: true,
          description: 'Active loading indicator',
        },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: true,
            active: true,
            small: true,
            description: 'Active loading indicator',
          }),
      },
      {
        name: 'overlay-inactive',
        props: { withOverlay: true, active: false, description: 'Stopped loading indicator' },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: true,
            active: false,
            description: 'Stopped loading indicator',
          }),
      },
      {
        name: 'overlay-inactive-small',
        props: {
          withOverlay: true,
          active: false,
          small: true,
          description: 'Stopped loading indicator',
        },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: true,
            active: false,
            small: true,
            description: 'Stopped loading indicator',
          }),
      },
      {
        name: 'plain-active',
        props: { withOverlay: false, active: true, description: 'Active loading indicator' },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: false,
            active: true,
            description: 'Active loading indicator',
          }),
      },
      {
        name: 'plain-active-small',
        props: {
          withOverlay: false,
          active: true,
          small: true,
          description: 'Active loading indicator',
        },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: false,
            active: true,
            small: true,
            description: 'Active loading indicator',
          }),
      },
      {
        name: 'plain-inactive',
        props: { withOverlay: false, active: false, description: 'Stopped loading indicator' },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: false,
            active: false,
            description: 'Stopped loading indicator',
          }),
      },
      {
        name: 'plain-inactive-small',
        props: {
          withOverlay: false,
          active: false,
          small: true,
          description: 'Stopped loading indicator',
        },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.Loading, {
            withOverlay: false,
            active: false,
            small: true,
            description: 'Stopped loading indicator',
          }),
      },
      {
        // Ember's @inline={{true}} @active={{false}} renders nothing at
        // all (see loading.gts), so there's no non-degenerate "inactive"
        // inline variant to generate a fixture for.
        name: 'inline',
        props: { status: 'active', description: 'Active loading indicator' },
        createElement: (React, Carbon) =>
          React.createElement(Carbon.InlineLoading, {
            status: 'active',
            description: 'Active loading indicator',
          }),
      },
    ],
  },
  {
    name: 'Link',
    variants: [
      link('default', { href: '/about' }),
      link('disabled', { href: '/about', disabled: true }),
      link('inline', { href: '/about', inline: true }),
      link('visited', { href: '/about', visited: true }),
      link('size-sm', { href: '/about', size: 'sm' }),
      link('size-lg', { href: '/about', size: 'lg' }),
      link('target-blank', { href: '/about', target: '_blank' }),
      link('as-button', { as: 'button', href: '/about' }),
    ],
  },
  {
    name: 'UnorderedList',
    variants: [
      unorderedList('default', {}),
      unorderedList('nested', { nested: true }),
      unorderedList('expressive', { isExpressive: true }),
    ],
  },
  {
    name: 'OrderedList',
    variants: [
      orderedList('default', {}),
      orderedList('nested', { nested: true }),
      orderedList('expressive', { isExpressive: true }),
      orderedList('native', { native: true }),
    ],
  },
  {
    // Covered on its own (in addition to as a child of the two list
    // fixtures above) since it's a separately exported component
    // (`ListItem`) with its own DOM shape (`Text`'s `dir='auto'`, see
    // list-item.gts) that a consumer can render outside of a list.
    name: 'ListItem',
    variants: [
      {
        name: 'default',
        props: {},
        createElement: (React, Carbon) => React.createElement(Carbon.ListItem, {}, 'Item content'),
      },
    ],
  },
];
