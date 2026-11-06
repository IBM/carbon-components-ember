/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Service from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';
import { mediaQuery } from '../utils/media-query.ts';
import {
  THEMES,
  THEME_DEFAULTS,
  THEME_STORAGE_KEY,
  isDarkTheme,
  themeClass,
} from '../utils/theme.ts';

import type Owner from '@ember/owner';
import type { CarbonTheme, ThemePreference } from '../utils/theme.ts';

export type { CarbonTheme, ThemePreference } from '../utils/theme.ts';

export interface ThemeOptions {
  /** The theme in light mode. Defaults to `white`. */
  light?: CarbonTheme;
  /** The theme in dark mode. Defaults to `g100`. */
  dark?: CarbonTheme;
  /** The preference until the user picks one. Defaults to `system`. */
  preference?: ThemePreference;
}

interface Preferences {
  light: CarbonTheme;
  dark: CarbonTheme;
  preference: ThemePreference;
  // Whether the user picked the preference, rather than the app.
  chosen: boolean;
}

const PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];
const THEME_CLASSES = THEMES.map(themeClass);

function saved(): Partial<Preferences> | undefined {
  try {
    const value = JSON.parse(
      localStorage.getItem(THEME_STORAGE_KEY) ?? 'null',
    ) as Partial<Preferences> | null;
    return value ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * The app's theme: Carbon React's `GlobalTheme`, and what `useTheme` reads
 * outside a `Theme`. Carbon defines its tokens only under a theme's class,
 * which the service puts on `<html>`. `configure` it when the app starts:
 * it follows a light or dark preference, or the system's, and saves the
 * one the user picks. An app with one theme sets `theme` instead.
 */
export default class ThemeService extends Service {
  #preferences = tracked<Preferences | undefined>(undefined);
  #chosen = tracked<CarbonTheme | undefined>(undefined);
  #pageTheme: CarbonTheme | undefined;
  // What was on `<html>` before the service first set its class, and the
  // class it set, so it puts back only its own.
  #pageClasses: string[] = [];
  #applied: string | undefined;

  #darkScheme = mediaQuery(this, '(prefers-color-scheme: dark)', {
    onChange: () => {
      if (this.#preferences.value?.preference === 'system') this.#apply();
    },
  });

  constructor(owner: Owner) {
    super(owner);
    if (typeof document === 'undefined') return;

    const { classList } = document.documentElement;
    this.#pageTheme = THEMES.find((theme) =>
      classList.contains(themeClass(theme)),
    );
    registerDestructor(this, () => {
      const applied = this.#applied;
      if (!applied || !classList.contains(applied)) return;
      classList.remove(applied);
      classList.add(...this.#pageClasses);
    });
  }

  /**
   * The app's theme: the one for its preference, else the one set, else
   * the page's (`index.html`'s, or the head script's), else `white`.
   */
  get theme(): CarbonTheme {
    const preferences = this.#preferences.value;
    if (preferences) {
      const { light, dark, preference } = preferences;
      const isDark =
        preference === 'dark' ||
        (preference === 'system' && this.prefersDarkScheme);
      return isDark ? dark : light;
    }
    return this.#chosen.value ?? this.#pageTheme ?? 'white';
  }

  /** Sets one theme, which the service doesn't save, instead of a preference. */
  set theme(theme: CarbonTheme) {
    this.#preferences.value = undefined;
    this.#chosen.value = theme;
    this.#apply();
  }

  get isDark() {
    return isDarkTheme(this.theme);
  }

  /** Whether the system prefers a dark colour scheme: `usePrefersDarkScheme`. */
  get prefersDarkScheme() {
    return this.#darkScheme.matches;
  }

  /** The preference the theme follows, once configured. */
  get preference(): ThemePreference | undefined {
    return this.#preferences.value?.preference;
  }

  /** The user's pick, from a theme switcher. The service saves it. */
  set preference(preference: ThemePreference) {
    this.#preferences.value = {
      ...THEME_DEFAULTS,
      ...this.#preferences.value,
      preference,
      chosen: true,
    };
    this.#save();
    this.#apply();
  }

  /**
   * Sets the app's light and dark themes and its preference, and restores
   * the one the user picked before. Saves them for the head script.
   */
  configure({
    light = THEME_DEFAULTS.light,
    dark = THEME_DEFAULTS.dark,
    preference = THEME_DEFAULTS.preference,
  }: ThemeOptions = {}) {
    const previous = saved();
    const picked =
      previous?.chosen &&
      previous.preference &&
      PREFERENCES.includes(previous.preference)
        ? previous.preference
        : undefined;
    this.#preferences.value = {
      light,
      dark,
      preference: picked ?? preference,
      chosen: picked !== undefined,
    };
    this.#save();
    this.#apply();
  }

  #save() {
    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify(this.#preferences.value),
      );
    } catch {
      // Storage is off or full, or there's none (server-side rendering).
    }
  }

  #apply() {
    if (typeof document === 'undefined') return;
    const { classList } = document.documentElement;
    if (this.#applied === undefined) {
      this.#pageClasses = THEME_CLASSES.filter((name) =>
        classList.contains(name),
      );
    }
    this.#applied = themeClass(this.theme);
    classList.remove(...THEME_CLASSES);
    classList.add(this.#applied);
  }
}
