/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

export const THEMES: readonly CarbonTheme[] = ['white', 'g10', 'g90', 'g100'];

export const isDarkTheme = (theme?: CarbonTheme) =>
  theme === 'g90' || theme === 'g100';

/** The class Carbon defines a theme's tokens under. */
export const themeClass = (theme: CarbonTheme) => `cds--${theme}`;
