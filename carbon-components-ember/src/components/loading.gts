import Component from '@glimmer/component';
import { defaultArgs } from '../utils/decorators.ts';

export interface LoadingSignature {
  Args: {
    active?: boolean;
    small?: boolean;
    withOverlay?: boolean;
    description?: string;
  };
  Element: HTMLDivElement;
}

export default class Loading extends Component<LoadingSignature> {
  args: LoadingSignature['Args'] = defaultArgs(this, {
    active: true,
    small: false,
    withOverlay: true,
    description: 'loading',
  });

  get defaultArgs() {
    return this.args;
  }

  <template>
    {{#if this.defaultArgs.withOverlay}}
      <div
        class="cds--loading-overlay
          {{unless this.defaultArgs.active 'cds--loading-overlay--stop'}}"
      >
        <div
          aria-atomic="true"
          aria-live={{if this.defaultArgs.active "assertive" "off"}}
          class="cds--loading
            {{if this.defaultArgs.small 'cds--loading--small'}}
            {{unless this.defaultArgs.active 'cds--loading--stop'}}"
          ...attributes
        >
          <svg
            class="cds--loading__svg"
            viewBox="0 0 100 100"
            role="img"
            aria-label={{this.defaultArgs.description}}
          >
            <title>{{this.defaultArgs.description}}</title>
            {{#if this.defaultArgs.small}}
              <circle
                class="cds--loading__background"
                cx="50%"
                cy="50%"
                r="42"
              />
            {{/if}}
            <circle
              class="cds--loading__stroke"
              cx="50%"
              cy="50%"
              r={{if this.defaultArgs.small "42" "44"}}
            />
          </svg>
        </div>
      </div>
    {{else}}
      <div
        aria-atomic="true"
        aria-live={{if this.defaultArgs.active "assertive" "off"}}
        class="cds--loading
          {{if this.defaultArgs.small 'cds--loading--small'}}
          {{unless this.defaultArgs.active 'cds--loading--stop'}}"
        ...attributes
      >
        <svg
          class="cds--loading__svg"
          viewBox="0 0 100 100"
          role="img"
          aria-label={{this.defaultArgs.description}}
        >
          <title>{{this.defaultArgs.description}}</title>
          {{#if this.defaultArgs.small}}
            <circle class="cds--loading__background" cx="50%" cy="50%" r="42" />
          {{/if}}
          <circle
            class="cds--loading__stroke"
            cx="50%"
            cy="50%"
            r={{if this.defaultArgs.small "42" "44"}}
          />
        </svg>
      </div>
    {{/if}}
  </template>
}
