const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/parse-CoyB29YC.js","assets/rolldown-runtime-DC62tzP2.js","assets/utils-Clr1WYqO.js","assets/lib-DMOxHVHU.js","assets/dist-CFfuNyTO.js","assets/lib-TsAjK6QO.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./preload-helper-59eyuSrX.js";
import { i as isRecord, t as assert } from "./utils-Clr1WYqO.js";
import { t as buildCodeFenceMetaUtils } from "./utils-C33Y2U-y.js";
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/ember/gmd.js
/**
* @typedef {import('unified').Plugin} Plugin
*/
var elementId = 0;
/**
* @param {unknown} [ options ]
* @returns {{
*   scope: Record<string, unknown>,
*   remarkPlugins: Plugin[],
*   rehypePlugins: Plugin[],
*   ShadowComponent: string | undefined,
*   CopyComponent: string | undefined
*   owner?: unknown | undefined
*   }}
*/
function filterOptions(options) {
	if (!isRecord(options)) return {
		scope: {},
		remarkPlugins: [],
		rehypePlugins: [],
		ShadowComponent: void 0,
		CopyComponent: void 0
	};
	return {
		owner: options?.owner,
		scope: /** @type {Record<string, unknown>}*/ options?.scope || {},
		remarkPlugins: /** @type {Plugin[]}*/ options?.remarkPlugins || [],
		rehypePlugins: /** @type {Plugin[]}*/ options?.rehypePlugins || [],
		ShadowComponent: /** @type {string}*/ options?.ShadowComponent,
		CopyComponent: /** @type {string}*/ options?.CopyComponent
	};
}
/**
* @type {import('../../types.ts').CompilerConfig['compiler']}
*/
async function compiler(config, api) {
	const userOptions = filterOptions(
		/** @type {Record<string, unknown>} */
		config.userOptions?.gmd || config
	);
	const { isLive, isPreview, needsLive, allowedFormats, getFlavorFromMeta, isBelow } = buildCodeFenceMetaUtils(api);
	const { parseMarkdown } = await __vitePreload(async () => {
		const { parseMarkdown } = await import("./parse-CoyB29YC.js");
		return { parseMarkdown };
	}, __vite__mapDeps([0,1,2,3,4,5]));
	return {
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
			const { template } = await api.tryResolve("@ember/template-compiler/runtime");
			const scope = {
				...filterOptions(userOptions).scope,
				...filterOptions(options).scope
			};
			return {
				compiled: template(result.text, { scope: () => ({ ...scope }) }),
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
			element.setAttribute(attribute, "");
			const { renderComponent } = await compiler.tryResolve("@ember/renderer");
			const args = extra && typeof extra === "object" && "args" in extra ? extra.args : void 0;
			const result = renderComponent(compiled, {
				into: element,
				owner: userOptions.owner,
				...args ? { args } : {}
			});
			const destroy = () => result.destroy();
			/**
			* @type {(() => void)[]}
			*/
			const destroyables = [];
			await Promise.all(
				/** @type {unknown[]} */
				extra.codeBlocks.map(async (info) => {
					/** @type {Record<string, unknown>} */
					const infoObj = info;
					if (!api.canCompile(
						/** @type {string} */
						infoObj.format,
						/** @type {string} */
						infoObj.flavor
					)) return;
					const flavor = infoObj.flavor;
					const hasScope = flavor === "ember" || infoObj.format === "gjs" || infoObj.format === "hbs";
					const subRender = await compiler.compile(
						/** @type {string} */
						infoObj.format,
						/** @type {string} */
						infoObj.code,
						{
							...compiler.optionsFor(
								/** @type {string} */
								infoObj.format,
								flavor
							),
							flavor,
							...hasScope ? { scope: extra.scope } : {}
						}
					);
					const selector = `#${/** @type {string} */ infoObj.placeholderId}`;
					const target = element.querySelector(selector);
					assert(`Could not find placeholder / target element (using selector: \`${selector}\`). Could not render ${/** @type {string} */ infoObj.format} block.`, target);
					destroyables.push(subRender.destroy);
					target.appendChild(subRender.element);
				})
			);
			return () => {
				for (const subDestroy of destroyables) subDestroy();
				destroy();
			};
		}
	};
}
//#endregion
export { compiler, filterOptions };
