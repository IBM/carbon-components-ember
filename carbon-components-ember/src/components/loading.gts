import Component from '@glimmer/component';
import { defaultArgs } from '../utils/decorators.ts';

export type Args = {
  active?: boolean;
  small?: boolean;
  withOverlay?: boolean;
  description?: string;
  inline?: boolean;
  classNames?: string;
};

export interface LoadingComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class LoadingComponent extends Component<LoadingComponentSignature> {
  args: Args = defaultArgs(this, {
    active: true,
    small: false,
    withOverlay: true,
    description: 'loading',
    inline: false,
    classNames: '',
  });

  get defaultArgs() {
    return this.args;
  }

  <template>
    {{#if this.defaultArgs.inline}}
      {{#if this.defaultArgs.active}}
        <div
          class='cds--inline-loading {{this.defaultArgs.classNames}}'
          aria-live='assertive'
          style='margin-left: 1rem; width: initial; display: inline-flex; align-items: center;'
          ...attributes
        >
          <div class='cds--inline-loading__animation'>
            <div
              aria-label='Active loading indicator'
              aria-live='assertive'
              class='cds--loading cds--loading--small'
            >
              <svg
                class='cds--loading__svg'
                viewBox='0 0 100 100'
                role='img'
                aria-label={{this.defaultArgs.description}}
              >
                <title>{{this.defaultArgs.description}}</title>
                <circle
                  class='cds--loading__background'
                  cx='50%'
                  cy='50%'
                  r='42'
                />
                <circle class='cds--loading__stroke' cx='50%' cy='50%' r='42' />
              </svg>
            </div>
          </div>
          <div class='cds--inline-loading__text'>
            {{@description}}
          </div>
        </div>
      {{/if}}
    {{else if this.defaultArgs.withOverlay}}
      <div
        class='cds--loading-overlay
          {{unless this.defaultArgs.active "cds--loading-overlay--stop"}}'
      >
        <div
          aria-atomic='true'
          aria-live={{if this.defaultArgs.active 'assertive' 'off'}}
          class='cds--loading
            {{if this.defaultArgs.small "cds--loading--small"}}
            {{unless this.defaultArgs.active "cds--loading--stop"}}
            {{this.defaultArgs.classNames}}'
          ...attributes
        >
          <svg
            class='cds--loading__svg'
            viewBox='0 0 100 100'
            role='img'
            aria-label={{this.defaultArgs.description}}
          >
            <title>{{this.defaultArgs.description}}</title>
            {{#if this.defaultArgs.small}}
              <circle
                class='cds--loading__background'
                cx='50%'
                cy='50%'
                r='42'
              />
            {{/if}}
            <circle
              class='cds--loading__stroke'
              cx='50%'
              cy='50%'
              r={{if this.defaultArgs.small '42' '44'}}
            />
          </svg>
        </div>
      </div>
    {{else}}
      <div
        aria-atomic='true'
        aria-live={{if this.defaultArgs.active 'assertive' 'off'}}
        class='cds--loading
          {{if this.defaultArgs.small "cds--loading--small"}}
          {{unless this.defaultArgs.active "cds--loading--stop"}}
          {{this.defaultArgs.classNames}}'
        ...attributes
      >
        <svg
          class='cds--loading__svg'
          viewBox='0 0 100 100'
          role='img'
          aria-label={{this.defaultArgs.description}}
        >
          <title>{{this.defaultArgs.description}}</title>
          {{#if this.defaultArgs.small}}
            <circle class='cds--loading__background' cx='50%' cy='50%' r='42' />
          {{/if}}
          <circle
            class='cds--loading__stroke'
            cx='50%'
            cy='50%'
            r={{if this.defaultArgs.small '42' '44'}}
          />
        </svg>
      </div>
    {{/if}}
  </template>
}
