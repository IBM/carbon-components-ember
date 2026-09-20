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
 * Tile family is covered in part (see below); CodeSnippet and Breadcrumb
 * remain out of scope:
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
 *
 * Tile family (`Tile`/`RadioTile`/`TileGroup`/`ClickableTile` below): a
 * single Ember `tile.gts` conflates React's separate `Tile`/`ClickableTile`/
 * `ExpandableTile`/`SelectableTile` behind `@selectable`/`@clickable`/
 * `@expandable`, so each branch needed its own comparison against the
 * matching upstream component rather than one shared fixture:
 *
 * - `Tile` (no args) and `ClickableTile` (`@clickable`) are covered.
 *   `ClickableTile`'s only variant passes `href: '#'` to the upstream side
 *   to match what Ember's clickable branch always renders (it hardcodes
 *   `href='#'` and has no `@href` arg at all) - with `href` set, upstream's
 *   `tabIndex = !href && !disabled ? 0 : undefined` resolves to absent on
 *   both sides, same as Ember's. `light`/`slug`/`decorator` are
 *   experimental/deprecated upstream props Ember never ported - out of
 *   scope per this file's own "args both sides implement" rule.
 * - `RadioTile` and `TileGroup` are covered. `RadioTile` is exercised both
 *   standalone (matching `tile-group-test.gts`'s own standalone usage) and
 *   nested inside a `TileGroup`.
 * - `SelectableTile` (`@selectable`) is now covered (see the `selectableTile`
 *   variant below) - todo #845 reworked Ember's `@selectable` branch to drop
 *   its native `<label>`/`<input type="checkbox">` in favor of upstream's
 *   own DOM shape: a `<div role="checkbox" aria-checked ...>` with keyboard
 *   handling (Enter/Space toggle, matching upstream's `handleKeyDown`) and a
 *   persistent `Checkbox`/`CheckboxCheckedFilled` icon pair swapped by
 *   selection state, wrapping a `<label>` (only rendered with a real
 *   `for`/`id` pair when a new `@id` arg is passed, matching upstream's own
 *   `id` prop defaulting to unset). `@tabindex` now defaults to `'0'`
 *   (matching upstream's `tabIndex = 0` default) since the root is now the
 *   only focusable element - previously the native `<input>` was
 *   independently tabbable regardless of any `@tabindex` value. See
 *   tile.gts's own inline comment for the two a11y lint rules
 *   (`no-nested-interactive`/`require-presentational-children`) suppressed
 *   on this branch - the nested icon/label are upstream's own real ARIA
 *   pattern for a custom checkbox widget, not a regression.
 * - `ExpandableTile` (`@expandable`) is now covered too (see the
 *   `expandableTile` variant below) - reworked to match upstream's
 *   *interactive* branch specifically, not its non-interactive one. Verified
 *   directly with a throwaway jsdom + `act()` script (a 3-line
 *   `ResizeObserver` stub, same shape as `generate.mjs`'s existing
 *   `globalThis.HTMLElement` shim, was all that was needed) that upstream
 *   picks its branch via `getInteractiveContent`/`getRoleContent` scanning
 *   the actual above/below-the-fold DOM: plain-text/div children get the
 *   non-interactive branch (a root `<button>` wrapping arbitrary children),
 *   while real interactive content (e.g. a `<button>`) gets the interactive
 *   branch (a root `<div>` with a separate, always-present chevron
 *   `<button>` carrying `aria-expanded`/`aria-controls` on itself). The
 *   non-interactive branch's root-button shape is unsafe to port as-is:
 *   Ember has no way to inspect yielded block content ahead of render the
 *   way upstream's effect-based DOM scan does, so a caller putting a real
 *   button/link in `<:above>`/`<:below>` would produce invalid nested
 *   interactive markup (button-in-button) if Ember always rendered a root
 *   `<button>`. Ember's expandable branch already resembled upstream's
 *   *interactive* branch structurally (a root wrapping an inner chevron
 *   `<button>`, safe for any content), so the rework targets that branch
 *   and the `expandableTile` fixture forces it by rendering a real
 *   `<button>` as the "above" content - the same case that matters for
 *   safety. Two real structural gaps this closes: (1) the below-the-fold
 *   `<div>` is now always rendered (clipped via CSS classes, matching
 *   upstream) rather than only once `@expanded` is true; (2) the outer
 *   `<div style="height: fit-content">` wrapper is gone - the tile div
 *   itself is now the root, matching upstream's interactive-branch root.
 *   One disclosed gap remains, `known-differences.json`-listed under the
 *   `default` (collapsed) variant only, and it's a harness artifact, not a
 *   missing-behavior gap: both sides now clip the collapsed tile via a
 *   real, measured inline `max-height` style - upstream measures
 *   `aboveTheFold.current.scrollHeight` in an effect, and Ember's own
 *   `clipExpandableTile` modifier (in `tile.gts`) does the equivalent,
 *   mirroring that same mechanism. But this fixture is generated in
 *   jsdom, where `scrollHeight` is always `0`, so upstream's captured
 *   `max-height` here is a deterministic jsdom artifact (`"0px"`), not a
 *   real measurement - Ember's own real-Chromium test (`tile-test.gts`)
 *   asserts the real, non-zero clipping behavior directly instead. The
 *   `expanded` variant has no such gap: upstream clears its inline
 *   `max-height` entirely once expanded, so both sides render no `style`
 *   attribute there.
 *
 * Both covered branches are feature-flag dependent the same way Grid's
 * entry below is - at this pinned `@carbon/react` version (`generate`
 * prints "... is available but not enabled" for both), `ClickableTile`
 * renders with `enable-v12-tile-default-icons` off (no default
 * `ArrowRight`/`Error` icon Ember's `ClickableTile` has no counterpart
 * for) and `RadioTile` renders with `enable-v12-tile-radio-icons` off
 * (`CheckmarkFilled`, matching Ember's hardcoded icon, rather than the
 * flagged `RadioButton`/`RadioButtonChecked` pair). Unlike Grid there's no
 * non-flagged equivalent component to route around the flag with, so
 * nothing needs to change in either fixture today - but a future
 * `@carbon/react` bump that flips either v12 default will silently change
 * what these fixtures assert, the same risk Grid's entry already calls
 * out.
 *
 * One more RadioTile/TileGroup interaction worth flagging rather than
 * silently leaving unexercised: a `RadioTile` inside a `@disabled` `TileGroup`
 * (no variant added for it here). Upstream's own `getRadioTilesWithWrappers`
 * only ever passes `required`/`name`/`key`/`value`/`onChange`/`checked` to
 * each child - never `disabled` - so upstream's `<input>` keeps
 * `tabIndex="0"` there and relies entirely on the surrounding
 * `<fieldset disabled>` to actually disable it. Ember's `RadioTile#disabled`
 * getter falls back to `this.args.group?.args.disabled`, so a grouped input
 * gets both a `disabled` attribute *and* (per the `tabindex` fix above) no
 * `tabindex` - a real, pre-existing divergence (`tile-group-test.gts`
 * already asserts `isDisabled()` on grouped inputs), just one this fix
 * extends from the `disabled` attribute to `tabindex` too. Functionally
 * identical either way, since `fieldset[disabled]` already makes every
 * descendant control unfocusable regardless of its own `tabindex` - not
 * worth its own variant.
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
 * Coverage inventory (todo #854, 2026-09-20; recounted and corrected in a
 * review follow-up the same day - the first pass undercounted the total
 * and omitted ~20 real exports from every bucket below): this file covers
 * 15 of the ~98 non-ai-chat components exported from
 * `src/components/index.ts` (18 fixture entries above, since the Tile
 * family's `Tile`/`ClickableTile`/`RadioTile`/`TileGroup`/`SelectableTile`/
 * `ExpandableTile` all map to just two real exports, `Tile` and
 * `TileGroup`/`RadioTile`) - the remaining ~83 are not a silent gap, they
 * were never scheduled. The ~98 total is every `default as` export from
 * `index.ts` outside `./ai-chat/`, plus the three real secondary component
 * exports on a shared line (`FlexGrid`, `LayoutConstraint`,
 * `PopoverContent`); it excludes `registerIcon` (a function) and the five
 * enum/constant exports (`IconIndicatorKinds`/`IconIndicatorAlignments`/
 * `ShapeIndicatorKinds`/`TooltipAlignments`) - re-run
 * `grep -E '^export' src/components/index.ts | grep -v "'\./ai-chat/"` to
 * recheck this count if it drifts. The `ai-chat/dom-parity-test.gts` live
 * path (see the README's "second, live path" section) is even further
 * behind: 2 of ~28 shipped `@carbon/ai-chat-components` widgets
 * (`Processing`, `ReasoningSteps`). Follow-up todos scheduled to close
 * this, in dependency order:
 *
 * 1. A gate decision this file's own CodeSnippet comment above already
 *    flags but that doesn't exist yet - the harness's approach to
 *    interaction/floating-ui-dependent DOM (open state? closed-only?
 *    skip entirely?). Blocks Modal, Popover/PopoverContent, Tooltip,
 *    Toggletip(+ToggletipActions/ToggletipButton/ToggletipContent/
 *    ToggletipLabel), OverflowMenu(+Item), Select(+SelectItem/
 *    SelectItemGroup), Dropdown, the Menu family, DatePicker(+Input),
 *    TimePicker(+Select), CopyButton, CodeSnippet, ConfirmDialog (wraps
 *    Modal), and FileUploaderItem (embeds a Tooltip around its filename) -
 *    don't start any of those until this lands.
 * 2. Skeletons (SkeletonIcon/SkeletonPlaceholder/SkeletonText/
 *    TextAreaSkeleton/SliderSkeleton/FileUploaderSkeleton) - static
 *    markup, no gate dependency.
 * 3. Static form controls (Checkbox, RadioButton(+Group), Toggle,
 *    TextInput, TextArea, PasswordInput, NumberInput, FluidTextInput,
 *    Search, FileUploader(+FileUploaderButton+FileUploaderDropContainer -
 *    the drop-target/trigger pieces, not FileUploaderItem, which is
 *    gate-blocked above)).
 * 4. Layout/scaffolding wrappers (FormGroup, FormItem, FormLabel, FormInput,
 *    Stack, Layer, Theme, Text, Layout(+LayoutConstraint), LayoutDirection,
 *    TextDirection).
 * 5. Indicators (ProgressBar, ProgressIndicator, IconIndicator,
 *    ShapeIndicator, Slider).
 * 6. Structural content, split into four (each large/distinct enough to
 *    warrant its own review): Accordion+Tabs/TabContent+StructuredList;
 *    TreeView+Pagination+List (Pagination's item-per-page control may
 *    depend on the gate above via Select, and List yields its own bound
 *    Pagination/Search the same way); DataTable gets its own todo given
 *    its size; UIShell likewise.
 * 7. Three `ai-chat/dom-parity-test.gts` batches, picked by how much of
 *    each upstream shadow template is its own markup vs. caller-supplied
 *    `<slot>` content (per the README's warning) rather than
 *    alphabetically: (a) Card+CardFooter+CardSteps+TruncatedText+
 *    ChatButton+ChatButtonSkeleton; (b) Toolbar+Table+Feedback+
 *    FeedbackButtons+ChainOfThought+ChainOfThoughtToggle+
 *    ReasoningStepsToggle; (c) FileUploads+FileUploadItem. Chat-shell,
 *    workspace-shell, prompt-line-shell, audio-player, and video-player
 *    are flagged as weak/low-value candidates (slot- or native-element-
 *    dominated) rather than skipped outright - revisit case by case.
 *
 * The rest of the ~98 aren't scheduled above because they're explicit
 * non-goals for this harness, each verified against source rather than
 * assumed, matching the Breadcrumb/CodeSnippet reasoning earlier in this
 * comment:
 *
 * - `BarChart`/`LineChart`/`PieChart` wrap `@carbon/charts`
 *   (`SimpleBarChart` etc., see `charts/bar.gts`'s own import), not
 *   `@carbon/react` - there's no upstream React DOM for this harness to
 *   diff against at all.
 * - `Icon`/`registerIcon` have no real upstream counterpart to compare
 *   against: `@carbon/react`'s own top-level `Icon` export is only
 *   `Icon.Skeleton` (confirmed by reading its `index.d.ts`, which is
 *   `export * from './Icon.Skeleton'` and nothing else) - real icons come
 *   from the separate `@carbon/icons-react` package, one component per
 *   icon, with no shared wrapper shaped like Ember's `Icon`.
 * - `Resizer` has no `@carbon/react` export at all (confirmed by listing
 *   its `es/components` directory) - Ember's `cds--resizer`-based
 *   component has no upstream React counterpart to diff against.
 * - `Portal` and `GridSettings` both have a real `@carbon/react`
 *   counterpart, but neither renders any DOM of its own: `Portal` only
 *   relocates its own yielded content (see `portal.gts`), and
 *   `GridSettings` only yields `Grid`/`Column`/`Row`/`ColumnHang`
 *   pre-configured with a mode (see `grid/settings.gts`) - there's no
 *   wrapper markup for this harness to diff either way. `GridSettings` is
 *   the natural vehicle for this file's already-flagged css-grid-mode
 *   follow-up (see the Grid entry above) once that's picked up, rather
 *   than its own separate todo.
 * - `FlexGrid` is already effectively covered, not scheduled: Ember's
 *   `FlexGrid` is just `Grid` with its `mode` getter hardcoded to
 *   `'flexbox'` (see `grid.gts`), identical output to what the existing
 *   Grid fixture already renders, since that fixture already targets
 *   `Carbon.FlexGrid` directly for the same reason (see the Grid entry
 *   above).
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

const tile = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) => React.createElement(Carbon.Tile, props, 'Tile content'),
});

const clickableTile = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(Carbon.ClickableTile, props, 'Clickable tile content'),
});

const radioTile = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(Carbon.RadioTile, props, 'Radio tile content'),
});

// Renders two real `RadioTile` children, matching upstream's own
// `getRadioTilesWithWrappers` (which only special-cases actual `RadioTile`
// elements) and this addon's own `tile-group-test.gts` usage.
const tileGroup = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(
      Carbon.TileGroup,
      props,
      React.createElement(Carbon.RadioTile, { key: 'a', value: 'a' }, 'Option A'),
      React.createElement(Carbon.RadioTile, { key: 'b', value: 'b' }, 'Option B'),
    ),
});

const selectableTile = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(Carbon.SelectableTile, props, 'Selectable tile content'),
});

// Renders a real `<button>` as the "above" content so upstream's own
// interactive-content scan (`getInteractiveContent`/`getRoleContent`, see
// this file's top comment) deterministically picks its *interactive*
// branch - the branch Ember's `@expandable` is reworked to match. A plain
// string/div child would instead exercise upstream's non-interactive
// (root `<button>`) branch, which isn't the one being ported.
const expandableTile = (name, props) => ({
  name,
  props,
  createElement: (React, Carbon) =>
    React.createElement(
      Carbon.ExpandableTile,
      props,
      React.createElement('button', { key: 'above', type: 'button' }, 'Above content'),
      'Below content',
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
  {
    name: 'Tile',
    variants: [tile('default', {})],
  },
  {
    name: 'ClickableTile',
    variants: [clickableTile('default', { href: '#' })],
  },
  {
    name: 'RadioTile',
    variants: [
      radioTile('default', { value: 'a' }),
      radioTile('checked', { value: 'a', checked: true }),
      radioTile('disabled', { value: 'a', disabled: true }),
    ],
  },
  {
    name: 'TileGroup',
    variants: [
      tileGroup('default', { name: 'tiles', legend: 'Choose one', defaultSelected: 'a' }),
    ],
  },
  {
    name: 'SelectableTile',
    variants: [selectableTile('default', {})],
  },
  {
    name: 'ExpandableTile',
    variants: [
      expandableTile('default', {}),
      expandableTile('expanded', { expanded: true }),
    ],
  },
];
