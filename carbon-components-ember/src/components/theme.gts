import Component from '@glimmer/component';
import { service } from '@ember/service';
import { isDarkTheme, themeClass } from '../utils/theme.ts';

import type ThemeService from '../services/theme.ts';
import type { CarbonTheme } from '../utils/theme.ts';

export type { CarbonTheme } from '../utils/theme.ts';

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
 * the selected theme's tokens. Without `@theme` it keeps the theme around it.
 *
 * The block receives `theme` and `isDark`, the Ember analog of React's
 * `useTheme` hook; without `@theme`, they are the app's, from the
 * `carbon.theme` service.
 */
export default class Theme extends Component<ThemeSignature> {
  @service('carbon.theme') declare globalTheme: ThemeService;

  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get theme(): CarbonTheme {
    return this.args.theme ?? this.globalTheme.theme;
  }

  get isDark() {
    return isDarkTheme(this.theme);
  }

  get classes() {
    return this.args.theme
      ? `${themeClass(this.args.theme)} cds--layer-one`
      : 'cds--layer-one';
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield (hash theme=this.theme isDark=this.isDark)}}
      </Tag>
    {{/let}}
  </template>
}
