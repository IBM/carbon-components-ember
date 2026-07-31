import Route from '@ember/routing/route';
import { getOwner, setOwner } from '@ember/owner';
import type Owner from '@ember/owner';

import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { setupTabster } from 'ember-primitives/tabster';
import { setupKolay } from 'kolay/setup';
import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';

import { Callout } from '@universal-ember/docs-support';

import { APIDocs, ComponentSignature, ModifierSignature } from './api-docs';
import ThemeSupport from 'docs-app/docs-support/theme-support';
import ThemeSwitcher from 'docs-app/docs-support/theme-switcher';
import {
  Bookmark,
  Task,
  Information,
  ErrorFilled,
  InformationSquareFilled,
  CheckmarkFilled,
  Notification,
  UserAvatar,
  Folder,
  Document,
  Checkbox as CheckboxIcon,
  Settings,
} from 'carbon-components-ember/icons';
// @ts-expect-error ignore
import { Bookmark32 } from '@carbon/icons/es/index.js';
import { trackedObject } from '@ember/reactive/collections';
import * as Components from 'carbon-components-ember/components/index';

ComponentSignature.name = 'ComponentSignature';
APIDocs.name = 'APIDocs';

const CarbonComponents = trackedObject(Components);
if (import.meta.hot) {

}

export default class Application extends Route {

  beforeModel() {
    document.querySelector('.lds-ripple')?.remove();
  }

  async model() {
    const highlighter = await getHighlighterCore({
      themes: [import('shiki/themes/github-dark.mjs'), import('shiki/themes/github-light.mjs')],
      langs: [
        import('shiki/langs/javascript.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/css.mjs'),
        import('shiki/langs/diff.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/glimmer-js.mjs'),
        import('shiki/langs/glimmer-ts.mjs'),
        import('shiki/langs/handlebars.mjs'),
        import('shiki/langs/jsonc.mjs'),
        import('shiki/langs/markdown.mjs'),
      ],
      loadWasm: getWasm,
    });

    const [manifest] = await Promise.all([
      setupTabster(this),
      setupKolay(this, {
        topLevelScope: {
          Callout,
          APIDocs,
          ComponentSignature,
          ModifierSignature,
          ThemeSwitcher,
        },
        modules: {
          '@carbon/icons/es/index.js': () =>
            Promise.resolve({
              Bookmark32,
            }),
          'carbon-components-ember/icons': () =>
            Promise.resolve({
              Bookmark,
              Task,
              Information,
              ErrorFilled,
              InformationSquareFilled,
              CheckmarkFilled,
              Notification,
              UserAvatar,
              Folder,
              Document,
              Checkbox: CheckboxIcon,
              Settings,
            }),
          'docs-support': () =>
            Promise.resolve({
              ThemeSupport,
              ThemeSwitcher,
              didInsert,
              setOwner: (ctx: object) => setOwner(ctx, getOwner(this) as Owner),
            }),
          'ember-primitives': () => import('ember-primitives'),
          '@ember/reactive/collections': () => import('@ember/reactive/collections'),
          '@ember/string': () => import('@ember/string'),
          '@ember/helper': () => import('@ember/helper'),
          'ember-truth-helpers': () => import('ember-truth-helpers'),
          'carbon-components-ember/components': () => Promise.resolve(CarbonComponents),
          'carbon-components-ember/helpers': () => import('carbon-components-ember/helpers/index'),
          'carbon-components-ember/components/icon': () => import('carbon-components-ember/components/icon'),
          'ember-primitives/floating-ui': () => import('ember-primitives/floating-ui'),
          'ember-primitives/on-resize': () => import('ember-primitives/on-resize'),
          'ember-primitives/color-scheme': () => import('ember-primitives/color-scheme'),
          'ember-primitives/components/form': () => import('ember-primitives/components/form'),

          // community libraries
          'ember-resources': () => import('ember-resources'),
          'reactiveweb/remote-data': () => import('reactiveweb/remote-data'),
          'ember-focus-trap/modifiers/focus-trap': () => import('ember-focus-trap/modifiers/focus-trap'),
          'ember-focus-trap': () => import('ember-focus-trap'),

          // utility
          'lorem-ipsum': () => import('lorem-ipsum'),
          'form-data-utils': () => import('form-data-utils'),
          kolay: () => import('kolay'),
        },
        rehypePlugins: [
          [
            rehypeShikiFromHighlighter,
            highlighter,
            {
              // Theme chosen by CSS variables in app/css/site/shiki.css
              defaultColor: false,
              themes: {
                light: 'github-light',
                dark: 'github-dark',
              },
            },
          ],
        ],
      }),
    ]);

    return { manifest };
  }
}
