import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import CheckmarkFilled from '../components/icons/checkmark-filled.ts';
import ErrorFilled from '../components/icons/error-filled.ts';
import { htmlSafe } from '@ember/template';
import { concat } from '@ember/helper';
import type { WithRequired } from '../utils/type-helpers.ts';

export type Args = {
  status?: 'active' | 'finished' | 'error' | 'indeterminate';
  size?: 'small' | 'big';
  type?: 'default' | 'inline' | 'indented';
  value?: number;
  max?: number;
  label?: string;
  helperText?: string;
  /**
   * Whether the label should be visually hidden.
   */
  hideLabel?: boolean;
};

export interface ProgressBarInterface {
  Args: Args;
  Element: HTMLDivElement;
}

/**
 The Carbon ProgressBar

 ```handlebars

 <Carbon::ProgressBar />
 ```
 @class CarbonButton
 @public
 **/
export default class ProgressBar extends Component<ProgressBarInterface> {
  get guid() {
    return guidFor(this);
  }

  get defaultArgs(): WithRequired<Args, 'max'> {
    return Object.assign(
      {},
      {
        status: 'active',
        value: undefined,
        max: 100,
        size: 'big',
        type: 'default',
        helperText: '',
        label: '',
      },
      this.args,
    );
  }

  get isFinished() {
    return this.defaultArgs.status === 'finished';
  }

  get isError() {
    return this.defaultArgs.status === 'error';
  }

  /**
   * Matches `@carbon/react`: a bar is indeterminate whenever it has no value
   * and isn't finished/errored. The explicit `'indeterminate'` status is
   * this addon's own way of asking for the same thing.
   */
  get indeterminate() {
    if (this.isFinished || this.isError) return false;
    return (
      this.defaultArgs.status === 'indeterminate' ||
      this.defaultArgs.value === undefined ||
      this.defaultArgs.value === null
    );
  }

  /**
   * The value clamped to `[0, max]`, forced to `0` on error and to `max` once
   * finished - the value reported via `aria-valuenow`.
   */
  get cappedValue() {
    const { max } = this.defaultArgs;
    if (this.isError) return 0;
    if (this.isFinished) return max;
    const value = this.defaultArgs.value;
    if (value === undefined || value === null) return undefined;
    return Math.min(Math.max(value, 0), max);
  }

  get classes() {
    const classes = [
      'cds--progress-bar',
      `cds--progress-bar--${this.defaultArgs.size}`,
      `cds--progress-bar--${this.defaultArgs.type}`,
    ];
    if (this.indeterminate) classes.push('cds--progress-bar--indeterminate');
    if (this.isFinished) classes.push('cds--progress-bar--finished');
    if (this.isError) classes.push('cds--progress-bar--error');
    return classes.join(' ');
  }

  get barStyle() {
    // An indeterminate bar is driven purely by its CSS animation - an
    // explicit @status='indeterminate' alongside a @value must not also
    // paint a partial fill underneath it.
    if (
      this.isFinished ||
      this.isError ||
      this.indeterminate ||
      this.cappedValue === undefined
    ) {
      return undefined;
    }
    return htmlSafe(
      `transform: scaleX(${this.cappedValue / this.defaultArgs.max});`,
    );
  }

  <template>
    <div class={{this.classes}}>
      <div
        class="cds--progress-bar__label
          {{if @hideLabel 'cds--visually-hidden'}}"
        id="progress-bar-{{this.guid}}"
      >
        <span class="cds--progress-bar__label-text">
          {{this.defaultArgs.label}}
        </span>
        {{#if this.isFinished}}
          <CheckmarkFilled
            @size={{16}}
            @fill="currentColor"
            @svgClass="cds--progress-bar__status-icon"
          />
        {{/if}}
        {{#if this.isError}}
          <ErrorFilled
            @size={{16}}
            @fill="currentColor"
            @svgClass="cds--progress-bar__status-icon"
          />
        {{/if}}
      </div>
      {{! @carbon/react sets aria-invalid on the progressbar itself, even though ARIA doesn't list it for this role }}
      {{! eslint-disable-next-line ember/template-no-unsupported-role-attributes }}
      <div
        class="cds--progress-bar__track"
        role="progressbar"
        aria-busy={{if this.isFinished "false" "true"}}
        aria-invalid={{if this.isError "true" "false"}}
        aria-labelledby="progress-bar-{{this.guid}}"
        aria-describedby={{if
          @helperText
          (concat "progress-bar-helper-text-" this.guid)
        }}
        aria-valuemin={{unless this.indeterminate "0"}}
        aria-valuemax={{unless this.indeterminate this.defaultArgs.max}}
        aria-valuenow={{unless this.indeterminate this.cappedValue}}
      >
        <div class="cds--progress-bar__bar" style={{this.barStyle}}></div>
      </div>
      {{#if @helperText}}
        <div
          class="cds--progress-bar__helper-text"
          id="progress-bar-helper-text-{{this.guid}}"
        >
          {{@helperText}}
          <div
            class="cds--visually-hidden"
            aria-live="polite"
            id="progress-bar-helper-{{this.guid}}"
          >
            {{if this.isFinished "Done" "Loading"}}
          </div>
        </div>
      {{/if}}
    </div>
  </template>
}
