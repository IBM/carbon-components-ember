/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import Popover from '../popover.gts';
import type { PopoverAlignment } from '../popover.gts';
import type { PopoverSignature } from '../popover.gts';

export interface DefinitionTooltipSignature {
  Element: PopoverSignature['Element'];
  Args: {
    /**
     * How the tooltip is aligned relative to its trigger.
     */
    align?: PopoverAlignment;
    /**
     * Keep the tooltip within the viewport, moving it to another side when it
     * would overflow.
     */
    autoAlign?: boolean;
    /**
     * The text shown in the tooltip, unless the `definition` block is given.
     */
    definition?: string;
    /**
     * Open the tooltip on hover, not only on focus/click.
     */
    openOnHover?: boolean;
    /**
     * Extra class for the trigger `<button>`.
     */
    triggerClassName?: string;
  };
  Blocks: {
    default: [];
    /** What the tooltip shows, in place of `@definition`. */
    definition: [];
  };
}

/**
 * Port of `@carbon/react`'s `DefinitionTooltip`, used by `IconIndicator` and
 * `ShapeIndicator` in compact mode, and by `Tag` for a cut-off label.
 *
 * The panel spans are written out here instead of using `PopoverContent`.
 * Upstream's `PopoverContent` puts `id` (and every other prop) on the outer
 * `.cds--popover` span and only `className` on the inner
 * `.cds--popover-content` span. This addon's `PopoverContent` spreads
 * `...attributes` onto the inner span, and callers such as `Tooltip` rely on
 * `class` landing there, so changing it isn't an option.
 */
export default class DefinitionTooltip extends Component<DefinitionTooltipSignature> {
  @tracked isOpen = false;

  tooltipId = `${guidFor(this)}-definition-tooltip`;

  get align() {
    return this.args.align ?? 'bottom';
  }

  open = () => {
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };

  onMouseEnter = () => {
    if (this.args.openOnHover) {
      this.isOpen = true;
    }
  };

  onMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      this.isOpen = !this.isOpen;
    }
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isOpen = !this.isOpen;
    } else if (this.isOpen && event.key === 'Escape') {
      event.stopPropagation();
      this.isOpen = false;
    }
  };

  <template>
    <Popover
      @align={{this.align}}
      @autoAlign={{@autoAlign}}
      @dropShadow={{false}}
      @highContrast={{true}}
      @open={{this.isOpen}}
      {{on "mouseenter" this.onMouseEnter}}
      {{on "mouseleave" this.close}}
      {{on "focusin" this.open}}
      ...attributes
      as |_PopoverContent trigger|
    >
      <button
        type="button"
        class="cds--definition-term {{@triggerClassName}}"
        {{trigger}}
        aria-controls={{this.tooltipId}}
        aria-describedby={{this.tooltipId}}
        aria-expanded={{if this.isOpen "true" "false"}}
        {{on "blur" this.close}}
        {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding }}
        {{on "mousedown" this.onMouseDown}}
        {{on "keydown" this.onKeyDown}}
      >
        {{yield}}
      </button>
      <span class="cds--popover" id={{this.tooltipId}}>
        <span class="cds--popover-content cds--definition-tooltip">
          {{#if (has-block "definition")}}
            {{yield to="definition"}}
          {{else}}
            {{@definition}}
          {{/if}}
          {{#if @autoAlign}}
            <span class="cds--popover-caret cds--popover--auto-align"></span>
          {{/if}}
        </span>
        {{#unless @autoAlign}}
          <span class="cds--popover-caret"></span>
        {{/unless}}
      </span>
    </Popover>
  </template>
}
