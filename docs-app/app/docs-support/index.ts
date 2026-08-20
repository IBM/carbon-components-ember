// Real ES module backing the `docs-support` bare specifier that live demo
// fences import from. Runtime `.md` docs resolve that specifier through
// setupKolay's dynamic `modules` map (see routes/application.ts); build-time
// `.gjs.md` docs go through real imports instead, resolved via the
// `resolve.alias` entry in vite.config.mjs pointing at this file.
export { default as ThemeSupport } from './theme-support';
export { default as ThemeSwitcher } from './theme-switcher';
export { default as didInsert } from '@ember/render-modifiers/modifiers/did-insert';
