import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { element } from 'ember-element-helper';

export type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

export interface ThemeSignature {
  Element: HTMLElement;
  Args: {
    /** Specify the element type to render, defaults to `div` */
    as?: keyof HTMLElementTagNameMap;
    /** Specify the theme to apply to the contained content */
    theme?: CarbonTheme;
  };
  Blocks: {
    default: [{ theme: CarbonTheme; isDark: boolean }];
  };
}

/**
 * Applies one of the Carbon themes (`white`, `g10`, `g90`, `g100`) to a
 * section of the page. Carbon emits the theme's CSS custom properties for
 * the `cds--<theme>` zone classes, so everything rendered inside picks up
 * the selected theme's tokens.
 *
 * The block receives `theme` and `isDark`, the Ember analog of React's
 * `useTheme` hook.
 */
export default class Theme extends Component<ThemeSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get theme(): CarbonTheme {
    return this.args.theme ?? 'white';
  }

  get isDark() {
    return this.theme === 'g90' || this.theme === 'g100';
  }

  get classes() {
    return `cds--${this.theme} cds--layer-one`;
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield (hash theme=this.theme isDark=this.isDark)}}
      </Tag>
    {{/let}}
  </template>
}
