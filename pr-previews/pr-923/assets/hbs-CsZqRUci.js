import { i as isRecord } from "./utils-Clr1WYqO.js";
import { t as makeOwner } from "./owner-1H-HTYNq.js";
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/ember/hbs.js
var elementId = 0;
/**
* @param {unknown} [ options ]
* @returns {{ scope: Record<string, unknown> }}
*/
function filterOptions(options) {
	if (!isRecord(options)) return { scope: {} };
	return { scope: /** @type {Record<string, unknown>}*/ options?.scope || {} };
}
/**
* @type {import('../../types.ts').CompilerConfig['compiler']}
*/
async function compiler(config, api) {
	return {
		compile: async (text, options) => {
			const { template } = await api.tryResolve("@ember/template-compiler/runtime");
			const component = template(text, { scope: () => ({
				...filterOptions(config).scope,
				...filterOptions(options).scope
			}) });
			/**
			* Some versions of ember implement the runtime template compiler incorrectly (albeit, correct enough for the constraints at the time).
			* So we need to wait longer than a microtask queue request could take.
			*
			* To make sure that the template is compiled, and "component"
			* has a value.
			*
			* See:
			* - https://github.com/emberjs/ember.js/issues/20913
			* - https://github.com/emberjs/ember.js/issues/20914
			*/
			await new Promise(requestAnimationFrame);
			/**
			* Is this allowed here? or do I just return text,
			* and do the above in 'render'
			*/
			return component;
		},
		render: async (element, compiled, extra, compiler) => {
			/**
			*
			* TODO: These will make things easier:
			*    https://github.com/emberjs/rfcs/pull/1099
			*    https://github.com/ember-cli/ember-addon-blueprint/blob/main/files/tests/test-helper.js
			*/
			const attribute = `data-repl-sdk-ember-hbs-${elementId++}`;
			element.setAttribute(attribute, "");
			const { renderComponent } = await compiler.tryResolve("@ember/renderer");
			const owner = makeOwner(config.owner);
			const args = extra && typeof extra === "object" && "args" in extra ? extra.args : void 0;
			const result = renderComponent(compiled, {
				into: element,
				owner,
				...args ? { args } : {}
			});
			compiler.announce("info", "Ember Island Rendered");
			return () => result.destroy();
		}
	};
}
//#endregion
export { compiler };
