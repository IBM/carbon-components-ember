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
 * Notification, CodeSnippet, Breadcrumb, and the Tile family were all
 * considered for the batch that added Link/UnorderedList/OrderedList/
 * ListItem and deliberately left out - see todo #836 for the follow-up
 * investigation of each. Notification is now covered (see below); the
 * other three remain out of scope:
 *
 * - CodeSnippet: all three variants (default/multiline/inline) embed
 *   `CopyButton`, which uses `Popover` for its tooltip - blocked on this
 *   harness's approach to interaction/floating-ui-dependent DOM being
 *   figured out separately, same bucket as the existing Modal/ComboBox/
 *   Dropdown/DatePicker exclusion. Revisit once that's decided, not before.
 * - Breadcrumb: Ember's `Breadcrumbs` has a structurally different API and
 *   DOM shape than Carbon React's `Breadcrumb`/`BreadcrumbItem`/
 *   `BreadcrumbLink` (a `<nav>` wrapping `crumbs: string[]` with href='#'
 *   placeholders, vs. React's `<div>` of real `BreadcrumbItem`/`Link`
 *   children). Explicit non-goal for this harness until Breadcrumbs itself
 *   is reworked to accept real link/item children - a fixture comparison
 *   against the current API would mostly be diffing two unrelated shapes,
 *   not catching real regressions.
 * - Tile (`Tile`/`RadioTile`/`TileGroup`): a single Ember `Tile` conflates
 *   React's separate `Tile`/`ClickableTile`/`ExpandableTile`/`SelectableTile`
 *   via `@selectable`/`@clickable`/`@expandable`, each needing its own
 *   branch-by-branch comparison against the matching upstream component;
 *   large enough to need its own todo rather than a tail end of this one.
 *
 * Grid (Grid/GridColumn/GridRow/GridColumnHang) is covered below. The
 * naive comparison target, `@carbon/react`'s `Grid`, is feature-flag
 * dependent - at this pinned version it renders CSS Grid by default
 * (`enable-css-grid` defaults on), not the flexbox grid Ember's `Grid`
 * defaults to. Rather than depend on that flag's default (which could flip
 * again on a future @carbon/react bump and silently change what this
 * fixture asserts) or change Ember's own default, every variant below
 * renders against `Carbon.FlexGrid`/`Carbon.Row`/`Carbon.Column`/
 * `Carbon.ColumnHang` directly - the same components `Grid` delegates to
 * internally once the flag resolves to flexbox mode, but reachable without
 * going through the flag at all. `css-grid` mode is out of scope here for
 * the same reason Breadcrumb/Tile are: it's a real, separate comparison
 * (`Carbon.CSSGrid`, not directly exported - only reachable through the
 * flag) that deserves its own pass. Each component is exercised with a
 * plain-text child (not nested Grid components) so the `ember-view`/
 * auto-id artifact already documented for Link (Grid/GridColumn/GridRow/
 * GridColumnHang all render their root tag via the `element` helper too)
 * shows up once per fixture instead of once per nesting depth.
 *
 * Notification is a single Ember component that conflates three upstream
 * ones behind `@display` - `toast`/`inline`/`actionable` map to
 * `Carbon.ToastNotification`/`InlineNotification`/`ActionableNotification`
 * respectively, the same "one Ember component, several upstream ones"
 * shape as Loading's `@inline`. Only `toast` and `inline` are covered
 * here: `actionable` additionally renders a `focus-wrapper`/
 * `button-wrapper` structure and (unless a feature flag is on - another
 * flag-dependent shape, like Grid's) two hidden focus-sentinel `<span>`s
 * that Ember's actionable branch has no counterpart for at all, which
 * would need a real structural addition to Ember's template, not just
 * known-differences entries, to compare meaningfully; left for a
 * follow-up. Variants are named by `kind` (which both the container class
 * and the icon key off, in both frameworks) rather than by the `low-
 * contrast`/`hideCloseButton`/custom-`role` props React also supports,
 * since Ember's `NotificationOptions` never exposes those - out of scope
 * per this file's own "args both sides implement" rule. React's
 * `subtitle` is Ember's `@text` - same content slot, different arg name -
 * so `props.subtitle` in the generated fixture is what the matching test
 * passes as `@text`. `title`/`text`/
 * `caption` are always given non-empty values in every variant, since
 * React only renders each of those wrapper elements when its value is
 * truthy while Ember always renders the wrapper regardless of value - a
 * real, separate gap from the `kind`-class one this batch fixes, but
 * deliberately not exercised (and so not fixed) by any variant here;
 * worth its own follow-up.
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

// See this file's top-of-file comment for why these render against
// `Carbon.FlexGrid`/`Carbon.Row`/`Carbon.Column`/`Carbon.ColumnHang`
// directly rather than `Carbon.Grid`.
const grid = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(Carbon.FlexGrid, props, 'Grid content'),
});

const gridRow = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) => React.createElement(Carbon.Row, props, 'Row content'),
});

const gridColumn = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(Carbon.Column, props, 'Column content'),
});

// `caption` is ToastNotification-only - InlineNotification doesn't
// destructure it at all, so passing it there would just spread it onto
// the root <div> as a stray, non-Carbon HTML attribute via its `...rest`,
// not exercise any real InlineNotification behavior.
const TOAST_CONTENT = {
  title: 'Notification title',
  subtitle: 'Notification subtitle',
  caption: 'Notification caption',
};
const INLINE_CONTENT = {
  title: 'Notification title',
  subtitle: 'Notification subtitle',
};

const toastNotification = (name, kind) => ({
  name,
  props: { kind, ...TOAST_CONTENT },
  createElement: (React, Carbon) =>
    React.createElement(Carbon.ToastNotification, { kind, ...TOAST_CONTENT }),
});

const inlineNotification = (name, kind) => ({
  name,
  props: { kind, ...INLINE_CONTENT },
  createElement: (React, Carbon) =>
    React.createElement(Carbon.InlineNotification, { kind, ...INLINE_CONTENT }),
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
  {
    name: 'Grid',
    variants: [
      grid('default', {}),
      grid('condensed', { condensed: true }),
      grid('narrow', { narrow: true }),
      grid('full-width', { fullWidth: true }),
      grid('with-row-gap', { withRowGap: true }),
    ],
  },
  {
    name: 'GridRow',
    variants: [
      gridRow('default', {}),
      gridRow('condensed', { condensed: true }),
      gridRow('narrow', { narrow: true }),
    ],
  },
  {
    name: 'GridColumn',
    variants: [
      gridColumn('default', {}),
      gridColumn('sm', { sm: 2 }),
      gridColumn('multi-breakpoint', { sm: 4, md: 4, lg: 8 }),
      gridColumn('auto', { lg: true }),
      gridColumn('offset', { lg: { span: 4, offset: 2 } }),
    ],
  },
  {
    name: 'GridColumnHang',
    variants: [
      {
        name: 'default',
        props: {},
        createElement: (React, Carbon) =>
          React.createElement(Carbon.ColumnHang, {}, 'Hang content'),
      },
    ],
  },
  {
    name: 'Notification',
    variants: [
      toastNotification('toast-error', 'error'),
      toastNotification('toast-info', 'info'),
      toastNotification('toast-info-square', 'info-square'),
      toastNotification('toast-success', 'success'),
      toastNotification('toast-warning', 'warning'),
      toastNotification('toast-warning-alt', 'warning-alt'),
      inlineNotification('inline-error', 'error'),
      inlineNotification('inline-info', 'info'),
      inlineNotification('inline-info-square', 'info-square'),
      inlineNotification('inline-success', 'success'),
      inlineNotification('inline-warning', 'warning'),
      inlineNotification('inline-warning-alt', 'warning-alt'),
    ],
  },
];
