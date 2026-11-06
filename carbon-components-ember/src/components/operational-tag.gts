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
import TagLabelTooltip from './-private/tag-label-tooltip.gts';
import { tagClasses } from './-private/tag-classes.ts';
import { observeTruncation } from '../utils/truncation.ts';

import type { IconComponent } from './icon.gts';
import type { TagSignature } from './tag.gts';

export interface OperationalTagSignature {
  Args: {
    /**
     * Specify if the `OperationalTag` is disabled.
     */
    disabled?: boolean;
    /**
     * Specify the id for the tag.
     */
    id?: string;
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
     * Specify the type of the tag. Defaults to `gray`.
     */
    type?: Exclude<TagSignature['Args']['type'], 'high-contrast' | 'outline'>;
  };
  Element: HTMLButtonElement;
}

/**
 * A tag that is a button, such as one that opens a popover listing more
 * tags. Its click handler goes on it with `{{on "click"}}`.
 */
export default class OperationalTag extends Component<OperationalTagSignature> {
  guid = guidFor(this);

  // While the text is cut off, it shows whole in a tooltip.
  @tracked truncated = false;

  get id() {
    return this.args.id ?? `tag-${this.guid}`;
  }

  get classes() {
    return tagClasses(
      { ...this.args, type: this.args.type ?? 'gray' },
      'cds--tag--operational',
    );
  }

  get showIcon() {
    return Boolean(this.args.renderIcon) && this.args.size !== 'sm';
  }

  watchTruncation = modifier((label: HTMLElement) =>
    observeTruncation(label, (truncated) => {
      if (this.truncated !== truncated) this.truncated = truncated;
    }),
  );

  <template>
    <TagLabelTooltip
      @closeOnActivation={{true}}
      @label={{@text}}
      @show={{this.truncated}}
    ><button
        class={{this.classes}}
        disabled={{@disabled}}
        id={{this.id}}
        type="button"
        ...attributes
      >
        {{~#if this.showIcon~}}
          <div class="cds--tag__custom-icon"><@renderIcon /></div>
        {{~/if~}}
        <span title="" dir="auto"><span
            class="cds--tag__label"
            title={{@text}}
            dir="auto"
            {{this.watchTruncation}}
          >{{@text}}</span></span>
      </button></TagLabelTooltip>
  </template>
}
