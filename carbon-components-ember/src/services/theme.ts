/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Service from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';
import { THEMES, isDarkTheme, themeClass } from '../utils/theme.ts';

import type Owner from '@ember/owner';
import type { CarbonTheme } from '../utils/theme.ts';

/** The themes to follow the system's colour scheme with. */
export interface SystemThemes {
  light: CarbonTheme;
  dark: CarbonTheme;
}

/**
 * The app's theme: Carbon React's `GlobalTheme`, and what `useTheme` reads
 * outside a `Theme`. Carbon defines its tokens only under a theme's class,
 * so setting the theme puts that class on `<html>`; a page that already has
 * one starts with its theme.
 */
export default class ThemeService extends Service {
  #prefersDarkScheme = tracked(false);
  #chosen = tracked<CarbonTheme | undefined>(undefined);
  #system = tracked<SystemThemes | undefined>(undefined);
  #pageTheme: CarbonTheme | undefined;
  // The page's own theme classes, put back when the service goes.
  #pageClasses: string[] = [];
  #applied = false;

  constructor(owner: Owner) {
    super(owner);
    if (typeof window === 'undefined') return;

    const { classList } = document.documentElement;
    this.#pageClasses = THEMES.map(themeClass).filter((name) =>
      classList.contains(name),
    );
    this.#pageTheme = THEMES.find((theme) =>
      classList.contains(themeClass(theme)),
    );

    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.#prefersDarkScheme.value = scheme.matches;
    const update = (event: MediaQueryListEvent) => {
      this.#prefersDarkScheme.value = event.matches;
      if (this.#system.value) this.#apply();
    };
    scheme.addEventListener('change', update);
    registerDestructor(this, () => {
      scheme.removeEventListener('change', update);
      if (this.#applied) {
        classList.remove(...THEMES.map(themeClass));
        classList.add(...this.#pageClasses);
      }
    });
  }

  /**
   * The app's theme: while following the system's colour scheme, the theme
   * for it; else the one set, else the page's, else `white`.
   */
  get theme(): CarbonTheme {
    const system = this.#system.value;
    if (system) return this.prefersDarkScheme ? system.dark : system.light;
    return this.#chosen.value ?? this.#pageTheme ?? 'white';
  }

  set theme(theme: CarbonTheme) {
    this.#system.value = undefined;
    this.#chosen.value = theme;
    this.#apply();
  }

  get isDark() {
    return isDarkTheme(this.theme);
  }

  /** Whether the system prefers a dark colour scheme: `usePrefersDarkScheme`. */
  get prefersDarkScheme() {
    return this.#prefersDarkScheme.value;
  }

  /**
   * Follows the system's colour scheme with a theme for each, until a
   * theme is set.
   */
  followSystemScheme(themes: SystemThemes) {
    this.#system.value = themes;
    this.#apply();
  }

  #apply() {
    const { classList } = document.documentElement;
    classList.remove(...THEMES.map(themeClass));
    classList.add(themeClass(this.theme));
    this.#applied = true;
  }
}
