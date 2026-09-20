import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { modifier as eModifier } from 'ember-modifier';
import { Checkbox, CheckboxCheckedFilled, ChevronDown } from '../icons.ts';

// Matches @carbon/react's ExpandableTile: while collapsed, the tile's own
// max-height is clamped to the above-the-fold content's real height (plus
// the tile's own vertical padding) so the always-rendered below-the-fold
// content is actually clipped, not just visually hidden - `overflow:
// hidden`/opacity CSS alone (@carbon/styles' own _tile.scss) has nothing to
// clip against, since the below-the-fold block is still in normal flow and
// contributes to the tile's content-derived height. `expanded` is a
// declared positional arg (not read off `this` inside the body) so this
// re-measures synchronously - no flash of unclipped content - on every
// @expanded toggle, matching upstream's own layout-effect timing.
const clipExpandableTile = eModifier<{
  Element: HTMLElement;
  Args: { Positional: [expanded: boolean] };
}>((aboveFoldElement, [expanded]) => {
  const tile = aboveFoldElement.closest<HTMLElement>('.cds--tile--expandable');
  if (!tile) return;

  const applyHeight = () => {
    if (expanded) {
      tile.style.maxHeight = '';
      return;
    }
    const computed = window.getComputedStyle(tile);
    const paddingTop = parseInt(computed.paddingTop, 10) || 0;
    const paddingBottom = parseInt(computed.paddingBottom, 10) || 0;
    tile.style.maxHeight = `${aboveFoldElement.scrollHeight + paddingTop + paddingBottom}px`;
  };

  applyHeight();

  // Re-measure if the above-the-fold content's own size changes later (e.g.
  // async content, a window resize reflowing text) - deferred to the next
  // frame, matching this addon's established fix for the "ResizeObserver
  // loop completed with undelivered notifications" class of bug (see
  // Toolbar/WorkspaceShellFooter in AGENTS.md).
  let frame = 0;
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(applyHeight);
  });
  resizeObserver.observe(aboveFoldElement);

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
  };
});

export type Args = {
  selectable?: boolean;
  clickable?: boolean;
  expandable?: boolean;
  onClick?: () => null;
  onSelect?: () => null;
  /**
   * Only applies to `@selectable` tiles - matches @carbon/react's
   * `SelectableTile#tabIndex`, defaulting to `'0'`. `@expandable` tiles
   * ignore this arg entirely: upstream's own `ExpandableTile` destructures
   * its `tabIndex` prop out before spreading `...rest` onto its interactive
   * (root `<div>`) branch's DOM node, so the prop has no effect there
   * either - it's only ever applied on the non-interactive (root `<button>`)
   * branch this port doesn't render. Passing `@tabindex` to an `@expandable`
   * tile is a silent no-op, matching upstream's own behavior rather than a
   * port gap.
   */
  tabindex?: string;
  /**
   * The id of the `@selectable` tile's root element, also used as the
   * `for` target of its content `<label>`. Matches @carbon/react's
   * `SelectableTile#id` - undefined by default, in which case neither
   * attribute is rendered (upstream leaves both unset too).
   */
  id?: string;
};

export interface TileComponentSignature {
  Args: Args;
  Blocks: {
    above: [];
    content: [];
    below: [];
  };
}

export default class TileComponent extends Component<TileComponentSignature> {
  @tracked selected = false;
  @tracked expanded: boolean = false;

  @cached
  get guid() {
    return guidFor(this);
  }

  get default() {
    return (
      !this.args.selectable && !this.args.expandable && !this.args.clickable
    );
  }

  // Matches @carbon/react's SelectableTile: tabIndex defaults to 0 (a
  // native `<input>` was always in the tab order by default before this
  // branch dropped it in favor of upstream's ARIA-role approach - defaulting
  // here keeps that default behavior rather than silently regressing it).
  get tabindex() {
    return this.args.tabindex ?? '0';
  }

  @action
  onClick(event: any) {
    event.preventDefault();
    this.args.onClick?.();
  }

  @action
  onSelectableClick(event: Event) {
    event.preventDefault();
    this.selected = !this.selected;
    this.args.onSelect?.();
  }

  @action
  onSelectableKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selected = !this.selected;
      this.args.onSelect?.();
    }
  }

  @action
  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  <template>
    {{#if @selectable}}
      {{! Matches @carbon/react's SelectableTile: a role=checkbox div
        with keyboard handling and a persistent Checkbox/CheckboxCheckedFilled
        icon pair, not a native input type=checkbox - see the tile.gts
        module comment in dom-parity/lib/components.mjs for the DOM-shape
        history here. The nested icon/label are decorative/labeling
        content for this custom widget, not independently interactive, so
        the two a11y lint rules flagging "semantic descendants of
        role=checkbox" are suppressed - this is upstream's own real ARIA
        pattern, not an accessibility regression. The literal title='title'
        below matches upstream's own default title prop value verbatim (a
        real, if unusual, upstream default) - previously this sat on the
        now-removed, visually-hidden <input>, so hovering a selectable tile
        now shows a native "title" tooltip where it didn't before; that's
        expected, not a bug introduced here. }}
      {{! template-lint-disable no-nested-interactive }}
      {{! template-lint-disable require-presentational-children }}
      <div
        id={{@id}}
        class='cds--tile cds--tile--selectable
          {{if this.selected "cds--tile--is-selected"}}'
        role='checkbox'
        aria-checked={{if this.selected "true" "false"}}
        tabindex={{this.tabindex}}
        title='title'
        {{on 'click' this.onSelectableClick}}
        {{on 'keydown' this.onSelectableKeyDown}}
      >
        <span class='cds--tile__checkmark cds--tile__checkmark--persistent'>
          {{#if this.selected}}
            <CheckboxCheckedFilled @size="16" @svgClass='cds--tile__checkmark-icon' />
          {{else}}
            <Checkbox @size="16" @svgClass='cds--tile__checkmark-icon' />
          {{/if}}
        </span>
        <label for={{@id}} class='cds--tile-content' dir='auto'>
          {{yield to='content'}}
        </label>
      </div>
    {{/if}}
    {{#if @expandable}}
      {{! Matches @carbon/react's ExpandableTile's interactive branch (a
        root div with a separate, always-focusable chevron button
        carrying aria-expanded/aria-controls on itself) rather than its
        non-interactive branch (a root button wrapping arbitrary yielded
        content, which would produce invalid nested-interactive markup for
        any caller putting a real button/link in the above/below blocks) -
        see the tile.gts module comment in dom-parity/lib/components.mjs.
        The below-the-fold content is now always rendered - clipped via a
        real measured max-height (see clipExpandableTile above), matching
        upstream, not just CSS alone - rather than only once @expanded is
        true. }}
      <div
        class='cds--tile cds--tile--expandable cds--tile--expandable--interactive
          {{if this.expanded "cds--tile--is-expanded"}}'
      >
        <div>
          <div class='cds--tile-content' {{clipExpandableTile this.expanded}}>
            {{yield to='above'}}
          </div>
          <button
            type='button'
            aria-expanded={{if this.expanded "true" "false"}}
            aria-controls='tile-below-{{this.guid}}'
            aria-label={{if
              this.expanded
              'Interact to collapse Tile'
              'Interact to expand Tile'
            }}
            class='cds--tile__chevron cds--tile__chevron--interactive'
            {{on 'click' this.toggleExpanded}}
          >
            <ChevronDown @size="16" @svgClass='cds--tile__chevron-icon' />
          </button>
          <div class='cds--tile-content' id='tile-below-{{this.guid}}'>
            <span class='cds--tile-content__below-the-fold'>
              {{yield to='below'}}
            </span>
          </div>
        </div>
      </div>
    {{/if}}
    {{#if this.default}}
      <div class='cds--tile'>
        {{yield to='content'}}
      </div>
    {{/if}}
    {{#if @clickable}}
      {{! @carbon/react's Link never sets role='button' on a real <a href> (only role='link' when disabled) - a real <a href> already conveys link semantics on its own }}
      <a
        class='cds--link cds--tile cds--tile--clickable'
        href='#'
        {{on 'click' this.onClick}}
      >
        {{yield to='content'}}
      </a>
    {{/if}}
  </template>
}
