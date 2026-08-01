const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/parse-DFOPp2I3.js","assets/main-BY7NGDZf.js","assets/main-CDAc8LpV.css","assets/_commonjsHelpers-B85MJLTf.js"])))=>i.map(i=>d[i]);
import { V as buildCodeFenceMetaUtils, R as __vitePreload, U as isRecord, W as assert } from './main-BY7NGDZf.js';

let elementId = 0;

/**
 * @param {unknown} [ options ]
 * @returns {{
 *   scope: Record<string, unknown>,
 *   remarkPlugins: Plugin[],
 *   rehypePlugins: Plugin[],
 *   ShadowComponent: string | boolean | undefined,
 *   CopyComponent: string | undefined
 *   owner?: unknown | undefined
 *   }}
 */
function filterOptions(options) {
  if (!isRecord(options)) {
    return {
      scope: {},
      remarkPlugins: [],
      rehypePlugins: [],
      ShadowComponent: undefined,
      CopyComponent: undefined
    };
  }
  return {
    owner: options?.owner,
    scope: (/** @type {Record<string, unknown>}*/options?.scope || {}),
    remarkPlugins: (/** @type {Plugin[]}*/options?.remarkPlugins || []),
    rehypePlugins: (/** @type {Plugin[]}*/options?.rehypePlugins || []),
    // Historically this was a component *name* to be resolved and used to
    // wrap each live demo's invocation before it was ever rendered. Now that
    // live demos are compiled+rendered independently and grafted into a
    // placeholder element (see the `render` loop below), there's no longer a
    // component-invocation step to wrap - so any truthy value (boolean or
    // the legacy string) just turns on native shadow-DOM wrapping instead.
    ShadowComponent: (/** @type {string | boolean}*/options?.ShadowComponent),
    CopyComponent: (/** @type {string}*/options?.CopyComponent)
  };
}

/**
 * Mirrors ember-primitives' `<Shadowed includeStyles>` component: attaches
 * an open shadow root to `target` and re-imports every stylesheet `<link>`
 * currently in the document so the shadow-rendered demo still picks up the
 * app's (carbon + docs-support) styles despite being style-isolated from it.
 *
 * @param {Element} target
 * @returns {ShadowRoot}
 */
function attachStyledShadowRoot(target) {
  const shadowRoot = target.attachShadow({
    mode: 'open'
  });
  const style = document.createElement('style');
  style.textContent = [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => `@import "${ /** @type {HTMLLinkElement} */link.href}";`).join('\n');
  shadowRoot.appendChild(style);
  return shadowRoot;
}

/**
 * @type {import('../../types.ts').CompilerConfig['compiler']}
 */
async function compiler(config, api) {
  const userOptions = filterOptions(/** @type {Record<string, unknown>} */config.userOptions?.gmd || config);
  const {
    isLive,
    isPreview,
    needsLive,
    allowedFormats,
    getFlavorFromMeta,
    isBelow
  } = buildCodeFenceMetaUtils(api);
  const {
    parseMarkdown
  } = await __vitePreload(async () => { const {
    parseMarkdown
  } = await import('./parse-DFOPp2I3.js');return {
    parseMarkdown
  }},true              ?__vite__mapDeps([0,1,2,3]):void 0);

  /**
   * @type {import('../../types.ts').Compiler}
   */
  const gmdCompiler = {
    compile: async (text, options) => {
      const compileOptions = filterOptions(options);
      const result = await parseMarkdown(text, {
        remarkPlugins: [...userOptions.remarkPlugins, ...compileOptions.remarkPlugins],
        rehypePlugins: [...userOptions.rehypePlugins, ...compileOptions.rehypePlugins],
        isLive,
        isPreview,
        isBelow,
        needsLive,
        ALLOWED_FORMATS: allowedFormats,
        getFlavorFromMeta
      });
      const {
        template
      } = await api.tryResolve('@ember/template-compiler/runtime');
      const scope = {
        ...filterOptions(userOptions).scope,
        ...filterOptions(options).scope
      };
      const component = template(result.text, {
        scope: () => ({
          ...scope
          // TODO: compile all the components from "result" and add them to scope here
          //       would this be better than the markdown style multiple islands
        })
      });
      return {
        compiled: component,
        ...result,
        scope
      };
    },
    render: async (element, compiled, extra, compiler) => {
      /**
       *
       * TODO: These will make things easier:
       *    https://github.com/emberjs/rfcs/pull/1099
       *    https://github.com/ember-cli/ember-addon-blueprint/blob/main/files/tests/test-helper.js
       */
      const attribute = `data-repl-sdk-ember-gmd-${elementId++}`;
      element.setAttribute(attribute, '');
      const {
        renderComponent
      } = await compiler.tryResolve('@ember/renderer');
      const args = /** @type {Record<string, unknown> | undefined} */
      extra && typeof extra === 'object' && 'args' in extra ? /** @type {Record<string, unknown>} */extra.args : undefined;
      const result = renderComponent(compiled, {
        into: element,
        owner: userOptions.owner,
        ...(args ? {
          args
        } : {})
      });
      const destroy = () => result.destroy();

      /**
       * @type {(() => void)[]}
       */
      const destroyables = [];
      await Promise.all(/** @type {unknown[]} */extra.codeBlocks.map(async (/** @type {unknown} */info) => {
        /** @type {Record<string, unknown>} */
        const infoObj = /** @type {Record<string, unknown>} */info;
        if (!api.canCompile(/** @type {string} */infoObj.format, /** @type {string} */infoObj.flavor)) {
          return;
        }
        const flavor = /** @type {string} */infoObj.flavor;
        const hasScope = flavor === 'ember' || infoObj.format === 'gjs' || infoObj.format === 'hbs';
        const subRender = await compiler.compile(/** @type {string} */infoObj.format, /** @type {string} */infoObj.code, {
          ...compiler.optionsFor(/** @type {string} */infoObj.format, flavor),
          flavor: flavor,
          // @ts-ignore
          ...(hasScope ? {
            scope: extra.scope
          } : {})
        });
        const selector = `#${(/** @type {string} */infoObj.placeholderId)}`;
        const target = element.querySelector(selector);
        assert(`Could not find placeholder / target element (using selector: \`${selector}\`). ` + `Could not render ${(/** @type {string} */infoObj.format)} block.`, target);
        destroyables.push(subRender.destroy);
        const meta = /** @type {string | undefined} */infoObj.meta;
        const optedOut = Boolean(meta && meta.includes('no-shadow'));
        if (userOptions.ShadowComponent && !optedOut) {
          const shadowRoot = attachStyledShadowRoot(target);
          shadowRoot.appendChild(subRender.element);
        } else {
          target.appendChild(subRender.element);
        }
      }));
      return () => {
        for (const subDestroy of destroyables) {
          subDestroy();
        }
        destroy();
      };
    }
  };
  return gmdCompiler;
}

export { compiler, filterOptions };
