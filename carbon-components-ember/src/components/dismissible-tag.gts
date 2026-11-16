/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import AILabel from './ai-label.gts';
import Tooltip from './tooltip.gts';
import Close from './icons/close.ts';
import { tagClasses } from './-private/tag-classes.ts';
import { observeTruncation } from '../utils/truncation.ts';

import type { IconComponent } from './icon.gts';
import type { PopoverAlignment } from './popover.gts';
import type { TagSignature } from './tag.gts';
import type { WithBoundArgs } from '@glint/template';

export interface DismissibleTagSignature {
  Args: {
    /**
     * Specify if the `DismissibleTag` is disabled.
     */
    disabled?: boolean;
    /**
     * Specify the tooltip alignment for the dismiss button. Defaults to
     * `bottom`.
     */
    dismissTooltipAlignment?: PopoverAlignment;
    /**
     * The dismiss button's label while the tag's text is cut off. Defaults to
     * `Dismiss tag`.
     */
    dismissTooltipLabel?: string;
    /**
     * Specify the id for the tag.
     */
    id?: string;
    /**
     * Called with the click when the dismiss button is pressed.
     */
    onClose?: (event: MouseEvent) => void;
    /**
     * A component used to render an icon.
     */
    renderIcon?: IconComponent;
    size?: TagSignature['Args']['size'];
    /**
     * Provide text to be rendered inside of the tag.
     */
    text?: string;
    /**
     * Provide a custom `title` for the tag's text. Defaults to the text.
     */
    tagTitle?: string;
    /**
     * The dismiss button's label. Defaults to `Dismiss`.
     */
    title?: string;
    type?: TagSignature['Args']['type'];
  };
  Element: HTMLDivElement;
  Blocks: {
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the
     * tag's text. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size' | 'kind'>];
  };
}

/**
 * A tag with a button that dismisses it, such as an applied filter. The tag
 * stays until `@onClose` removes it.
 */
export default class DismissibleTag extends Component<DismissibleTagSignature> {
  guid = guidFor(this);

  // While the text is cut off, the button's label is `@dismissTooltipLabel`.
  @tracked truncated = false;

  get id() {
    return this.args.id ?? `tag-${this.guid}`;
  }

  get classes() {
    return tagClasses(this.args, 'cds--tag--filter');
  }

  get showIcon() {
    return Boolean(this.args.renderIcon) && this.args.size !== 'sm';
  }

  get dismissLabel() {
    return this.truncated
      ? (this.args.dismissTooltipLabel ?? 'Dismiss tag')
      : (this.args.title ?? 'Dismiss');
  }

  close = (event: MouseEvent) => {
    if (!this.args.onClose) return;
    event.stopPropagation();
    this.args.onClose(event);
  };

  watchTruncation = modifier((label: HTMLElement) =>
    observeTruncation(label, (truncated) => {
      if (this.truncated !== truncated) this.truncated = truncated;
    }),
  );

  <template>
    <div
      class={{this.classes}}
      id={{this.id}}
      {{! @glint-expect-error: matches @carbon/react, which renders disabled on the tag's div }}
      disabled={{if @disabled true}}
      ...attributes
    >
      {{~#if this.showIcon~}}
        <div class="cds--tag__custom-icon"><@renderIcon /></div>
      {{~/if~}}
      <span title="" dir="auto"><div
          class="cds--interactive--tag-children"
        ><span
            class="cds--tag__label"
            title={{if @tagTitle @tagTitle @text}}
            dir="auto"
            {{this.watchTruncation}}
          >{{@text}}</span>
          {{~#if (has-block "decorator")~}}
            <div class="cds--tag__decorator">
              {{~yield
                (component AILabel size="sm" kind="inline")
                to="decorator"
              ~}}
            </div>
          {{~/if~}}
          <Tooltip
            class="cds--icon-tooltip cds--tag-label-tooltip"
            @align={{if
              @dismissTooltipAlignment
              @dismissTooltipAlignment
              "bottom"
            }}
            @closeOnActivation={{true}}
            @label={{this.dismissLabel}}
            @leaveDelayMs={{0}}
          ><button
              aria-label={{this.dismissLabel}}
              class="cds--tag__close-icon"
              disabled={{@disabled}}
              type="button"
              {{on "click" this.close}}
            ><Close /></button></Tooltip></div></span></div>
  </template>
}
