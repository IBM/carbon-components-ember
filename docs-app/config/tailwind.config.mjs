import { join } from "node:path";

import defaultTheme from "tailwindcss/defaultTheme.js";

const appRoot = join(import.meta.dirname, "../");
const files = "**/*.{js,ts,hbs,gjs,gts,html,md}";
const sourceEntries = "{app,src,public}";

/**
 * @universal-ember/docs-support >= 0.8 ships its own pre-built CSS
 * (imported as a side effect of its components) instead of Tailwind
 * utility classes, so this config only needs to scan docs-app's own
 * source for Tailwind classes.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [`${appRoot}/${sourceEntries}/${files}`],
  darkMode: "selector",
  theme: {
    extend: {
      maxWidth: {
        "8xl": "88rem",
      },
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
        display: ["Helvetica, Arial, sans-serif"],
      },
    },
  },
};
