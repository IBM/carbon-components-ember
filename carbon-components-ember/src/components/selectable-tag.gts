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

export interface SelectableTagSignature {
  Args: {
    /**
     * Whether the tag starts selected, when `@selected` isn't passed.
     */
    defaultSelected?: boolean;
    /**
     * Specify if the `SelectableTag` is disabled.
     */
    disabled?: boolean;
    /**
     * Specify the id for the tag.
     */
    id?: string;
    /**
     * Called with whether the tag is selected after a press.
     */
    onChange?: (selected: boolean) => void;
    /**
     * A component used to render an icon.
     */
    renderIcon?: IconComponent;
    /**
     * Whether the tag is selected. Wins over its own state whenever it's
     * passed.
     */
    selected?: boolean;
    size?: TagSignature['Args']['size'];
    /**
     * Provide text to be rendered inside of the tag.
     */
    text?: string;
  };
  Element: HTMLButtonElement;
}

/**
 * A tag that toggles on a press, such as one of a group of filters.
 */
export default class SelectableTag extends Component<SelectableTagSignature> {
  guid = guidFor(this);

  @tracked ownSelected = this.args.defaultSelected ?? false;

  // While the text is cut off, it shows whole in a tooltip.
  @tracked truncated = false;

  get id() {
    return this.args.id ?? `tag-${this.guid}`;
  }

  get selected() {
    return this.args.selected ?? this.ownSelected;
  }

  get classes() {
    return tagClasses(
      { disabled: this.args.disabled, size: this.args.size },
      'cds--tag--selectable',
      ...(this.selected ? ['cds--tag--selectable-selected'] : []),
    );
  }

  get showIcon() {
    return Boolean(this.args.renderIcon) && this.args.size !== 'sm';
  }

  toggle = () => {
    const selected = !this.selected;
    if (this.args.selected === undefined) this.ownSelected = selected;
    this.args.onChange?.(selected);
  };

  watchTruncation = modifier((label: HTMLElement) =>
    observeTruncation(label, (truncated) => {
      if (this.truncated !== truncated) this.truncated = truncated;
    }),
  );

  <template>
    <TagLabelTooltip @label={{@text}} @show={{this.truncated}}><button
        aria-pressed={{if this.selected "true" "false"}}
        class={{this.classes}}
        disabled={{@disabled}}
        id={{this.id}}
        type="button"
        ...attributes
        {{on "click" this.toggle}}
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
