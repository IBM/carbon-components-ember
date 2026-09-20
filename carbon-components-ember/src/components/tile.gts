import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { Checkbox, CheckboxCheckedFilled, ChevronDown } from '../icons.ts';

export type Args = {
  selectable?: boolean;
  clickable?: boolean;
  expandable?: boolean;
  onClick?: () => null;
  onSelect?: () => null;
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
        pattern, not an accessibility regression. }}
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
        The below-the-fold content is now always rendered (clipped via CSS,
        matching upstream) rather than only once @expanded is true. }}
      <div
        class='cds--tile cds--tile--expandable cds--tile--expandable--interactive
          {{if this.expanded "cds--tile--is-expanded"}}'
      >
        <div>
          <div class='cds--tile-content'>
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
