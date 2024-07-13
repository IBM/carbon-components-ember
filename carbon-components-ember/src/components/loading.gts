import Component from '@glimmer/component';
import { defaultArgs } from '../utils/decorators.ts';

type Args = {
  active?: boolean;
  small?: boolean;
  overlay?: boolean;
  title?: boolean;
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
    overlay: false,
    title: undefined,
    inline: false,
    classNames: '',
  });

  get defaultArgs() {
    return this.args;
  }

  <template>
    {{#if this.defaultArgs.active}}
      {{#if this.defaultArgs.overlay}}
        <div class='cds--loading-overlay' style='height: 100%'>
          <div
            data-loading
            class='cds--loading
              {{if this.defaultArgs.small "cds--loading--small"}}
              {{@classNames}}'
            ...attributes
          >
            <svg class='cds--loading__svg' viewBox='-75 -75 150 150'>
              <title>
                Loading
              </title>
              {{#if @small}}
                <circle
                  class='cds--loading__background'
                  cx='0'
                  cy='0'
                  r='37.5'
                />
              {{/if}}
              <circle class='cds--loading__stroke' cx='0' cy='0' r='37.5' />
            </svg>
          </div>
        </div>
      {{else if @inline}}
        <div
          class='cds--inline-loading {{@classNames}}'
          aria-live='assertive'
          style='margin-left: 1rem; width: initial; display: inline-block;'
          ...attributes
        >
          <div class='cds--inline-loading__animation'>
            <div
              aria-label='Active loading indicator'
              aria-live='assertive'
              class='cds--loading cds--loading--small'
            >
              <svg class='cds--loading__svg' viewBox='-75 -75 150 150'>
                <title>
                  Active loading indicator
                </title>
                <circle
                  class='cds--loading__background'
                  cx='0'
                  cy='0'
                  r='37.5'
                ></circle>
                <circle class='cds--loading__stroke' cx='0' cy='0' r='37.5'>
                </circle>
              </svg>
            </div>
          </div>
          <div class='cds--inline-loading__text'>
            {{this.defaultArgs.title}}
          </div>
        </div>
      {{else}}
        <div data-loading class='{{@classNames}}' ...attributes>
          <svg
            class='cds--loading
              {{if this.defaultArgs.small "cds--loading--small"}}
              cds--loading__svg'
            viewBox='-75 -75 150 150'
          >
            <title>
              Loading
            </title>
            {{#if this.defaultArgs.small}}
              <circle class='cds--loading__background' cx='0' cy='0' r='37.5' />
            {{/if}}
            <circle class='cds--loading__stroke' cx='0' cy='0' r='37.5' />
          </svg>
        </div>
      {{/if}}
    {{/if}}
  </template>
}
