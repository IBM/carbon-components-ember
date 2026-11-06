/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

/** Which of its themes an app shows: the light one, the dark one, or the system's. */
export type ThemePreference = 'light' | 'dark' | 'system';

export const THEMES: readonly CarbonTheme[] = ['white', 'g10', 'g90', 'g100'];

export const isDarkTheme = (theme?: CarbonTheme) =>
  theme === 'g90' || theme === 'g100';

/** The class Carbon defines a theme's tokens under. */
export const themeClass = (theme: CarbonTheme) => `cds--${theme}`;

/** An app's light and dark themes, and its preference until the user picks one. */
export const THEME_DEFAULTS = {
  light: 'white',
  dark: 'g100',
  preference: 'system',
} as const satisfies {
  light: CarbonTheme;
  dark: CarbonTheme;
  preference: ThemePreference;
};

/** Where the `carbon.theme` service saves the app's themes and preference. */
export const THEME_STORAGE_KEY = 'cds-theme';

/**
 * Puts the saved theme's class on `<html>` before the page first paints, so
 * a dark theme doesn't flash light while the app loads. Apps inline it in
 * `index.html`'s `<head>`, as the README shows; the `carbon.theme` service
 * starts with the class it sets.
 */
export const themeScript = `try {
  const { light = '${THEME_DEFAULTS.light}', dark = '${THEME_DEFAULTS.dark}', preference = '${THEME_DEFAULTS.preference}' } =
    JSON.parse(localStorage.getItem('${THEME_STORAGE_KEY}')) ?? {};
  const isDark = preference === 'dark' ||
    (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = isDark ? dark : light;
  if ([${THEMES.map((theme) => `'${theme}'`).join(', ')}].includes(theme)) {
    const { classList } = document.documentElement;
    classList.remove(${THEMES.map((theme) => `'${themeClass(theme)}'`).join(', ')});
    classList.add('cds--' + theme);
  }
} catch {}`;
