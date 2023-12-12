import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import Icon from 'carbon-components-ember/components/icon';
import eq from 'ember-truth-helpers/helpers/eq';
import { htmlSafe } from '@ember/template';
import { concat } from '@ember/helper';
import { default as d } from '@ascua/maths/helpers/div';

type Args = {
  status?: 'active'|'finished'|'error'|'indeterminate';
  size?: 'small'|'big';
  type?: 'default'|'inline'|'indented';
  value?: number;
  max?: number;
  label?: string;
  helperText?: string;
}

export interface ProgressBarInterface {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
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
    return Object.assign({}, {
      status: 'active',
      value: undefined,
      max: 100,
      size: undefined,
      type: 'default',
      helperText: '',
      label: '',
    }, this.args)
  }

  <template>
    <div
      class='cds--progress-bar cds--progress-bar--{{this.defaultArgs.size}}
        cds--progress-bar--{{this.defaultArgs.type}}
        cds--progress-bar--{{this.defaultArgs.status}}'
    >
      <div class='cds--progress-bar__label' id='progress-bar-{{this.guid}}'>
        <span class='cds--progress-bar__label-text'>
          {{this.defaultArgs.label}}
        </span>
        {{#if (eq this.defaultArgs.status 'finished')}}
          <Icon
            @icon='checkmark--filled'
            @fill='currentColor'
            @svgClass='cds--progress-bar__status-icon'
          />
        {{/if}}
        {{#if (eq this.defaultArgs.status 'error')}}
          <Icon
            @icon='error--filled'
            @fill='currentColor'
            @svgClass='cds--progress-bar__status-icon'
          />
        {{/if}}
      </div>
      <div
        class='cds--progress-bar__track'
        role='progressbar'
        aria-busy='false'
        aria-labelledby='progress-bar-{{this.guid}}'
        aria-valuemin='0'
        aria-valuemax='{{this.defaultArgs.max}}'
        aria-valuenow='{{@value}}'
      >
        <div
          class='cds--progress-bar__bar'
          style={{if
            @value
            (htmlSafe
              (concat 'transform: scaleX(' (d @value this.defaultArgs.max) ');')
            )
          }}
        ></div>
      </div>
      <div class='cds--progress-bar__helper-text'>
        {{@helperText}}
        <div
          class='cds--visually-hidden'
          aria-live='polite'
          id='progress-bar-helper-{{this.guid}}'
        >
          Done
        </div>
      </div>
    </div>
  </template>
}



