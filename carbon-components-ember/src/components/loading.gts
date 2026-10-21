import Component from '@glimmer/component';

export interface LoadingSignature {
  Args: {
    /** Whether the spinner spins. Defaults to `true`. */
    active?: boolean;
    small?: boolean;
    /** Whether it covers the page with an overlay. Defaults to `true`. */
    withOverlay?: boolean;
    /** Its accessible name. Defaults to `'loading'`. */
    description?: string;
  };
  Element: HTMLDivElement;
}

export default class Loading extends Component<LoadingSignature> {
  get active() {
    return this.args.active ?? true;
  }

  get withOverlay() {
    return this.args.withOverlay ?? true;
  }

  get description() {
    return this.args.description ?? 'loading';
  }

  <template>
    {{#if this.withOverlay}}
      <div
        class="cds--loading-overlay
          {{unless this.active 'cds--loading-overlay--stop'}}"
      >
        <div
          aria-atomic="true"
          aria-live={{if this.active "assertive" "off"}}
          class="cds--loading
            {{if @small 'cds--loading--small'}}
            {{unless this.active 'cds--loading--stop'}}"
          ...attributes
        >
          <svg
            class="cds--loading__svg"
            viewBox="0 0 100 100"
            role="img"
            aria-label={{this.description}}
          >
            <title>{{this.description}}</title>
            {{#if @small}}
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
              r={{if @small "42" "44"}}
            />
          </svg>
        </div>
      </div>
    {{else}}
      <div
        aria-atomic="true"
        aria-live={{if this.active "assertive" "off"}}
        class="cds--loading
          {{if @small 'cds--loading--small'}}
          {{unless this.active 'cds--loading--stop'}}"
        ...attributes
      >
        <svg
          class="cds--loading__svg"
          viewBox="0 0 100 100"
          role="img"
          aria-label={{this.description}}
        >
          <title>{{this.description}}</title>
          {{#if @small}}
            <circle class="cds--loading__background" cx="50%" cy="50%" r="42" />
          {{/if}}
          <circle
            class="cds--loading__stroke"
            cx="50%"
            cy="50%"
            r={{if @small "42" "44"}}
          />
        </svg>
      </div>
    {{/if}}
  </template>
}
