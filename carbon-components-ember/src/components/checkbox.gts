import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../utils/decorators.ts';
import AILabel from './ai-label.gts';
import type { WithBoundArgs } from '@glint/template';

export interface CheckboxSignature {
  Args: {
    name?: string;
    readonly?: boolean;
    indeterminate?: boolean;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    state?: object;
    label?: string;
    /** Visually hide the label, keeping it as the checkbox's accessible name (as Carbon React's `hideLabel`). */
    hideLabel?: boolean;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the label.
     * Yields an `AILabel` already set up for it;
     * with `@kind="inline"`, also pass `@size="md"`.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

export default class Checkbox extends Component<CheckboxSignature> {
  @tracked isFocus = false;

  args: CheckboxSignature['Args'] = defaultArgs(this, {
    disabled: false,
    onChange: () => null,
    state: undefined,
  });

  @cached
  get guid() {
    return guidFor(this);
  }

  onCheckChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).checked;
    if (this.args.onChange) this.args.onChange(value);
  };

  setFocus = (val: boolean) => {
    this.isFocus = val;
  };

  <template>
    <div
      class="cds--checkbox-wrapper
        {{if (has-block 'decorator') 'cds--checkbox-wrapper--decorator'}}"
      ...attributes
    >
      <label
        tabindex="0"
        {{on "focus" (fn this.setFocus true)}}
        {{on "blur" (fn this.setFocus false)}}
        for="checkbox-{{this.guid}}"
        class="cds--checkbox-label
          {{if this.isFocus 'cds--checkbox-label__focus'}}"
        data-contained-checkbox-disabled="{{if @disabled 'true' 'false'}}"
        data-contained-checkbox-state="{{if @indeterminate 'mixed' @checked}}"
      >
        <input
          disabled={{if @disabled true false}}
          id="checkbox-{{this.guid}}"
          readonly={{@readonly}}
          class="cds--checkbox"
          type="checkbox"
          name="{{@name}}"
          checked={{if @indeterminate true @checked}}
          {{on "change" this.onCheckChange}}
        />

        <span
          class="cds--checkbox-label-text
            {{if @hideLabel 'cds--visually-hidden'}}"
        >
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@label}}
          {{/if}}
        </span>
      </label>
      {{#if (has-block "decorator")}}
        <div class="cds--checkbox-wrapper-inner--decorator">
          {{yield (component AILabel size="mini") to="decorator"}}
        </div>
      {{/if}}
    </div>
  </template>
}
