import { t as makeOwner } from "./owner-1H-HTYNq.js";
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/ember/gjs.js
var elementId = 0;
var buildDependencies = [
	"@babel/standalone",
	"decorator-transforms",
	"babel-plugin-ember-template-compilation",
	"ember-source/ember-template-compiler/index.js",
	"content-tag",
	"babel-plugin-debug-macros"
];
/**
* @type {import('../../types.ts').CompilerConfig['compiler']}
*/
async function compiler(config, api) {
	const [_babel, _decoratorTransforms, _emberTemplateCompilation, compiler, contentTag, { default: DebugMacros }] = await api.tryResolveAll(buildDependencies);
	const decoratorTransforms = "default" in _decoratorTransforms ? _decoratorTransforms.default : _decoratorTransforms;
	const emberTemplateCompilation = "default" in _emberTemplateCompilation ? _emberTemplateCompilation.default : _emberTemplateCompilation;
	const babel = "availablePlugins" in _babel ? _babel : _babel.default;
	/**
	* @param {string} text
	*/
	async function transform(text) {
		return babel.transformAsync(text, {
			filename: `dynamic-repl.js`,
			plugins: [
				[emberTemplateCompilation, {
					compiler,
					transforms: [],
					targetFormat: "wire"
				}],
				[decoratorTransforms, { runtime: { import: "decorator-transforms/runtime-esm" } }],
				[
					DebugMacros,
					{
						flags: [{
							source: "@glimmer/env",
							flags: {
								DEBUG: true,
								CI: false
							}
						}],
						debugTools: {
							isDebug: true,
							source: "@ember/debug",
							assertPredicateIndex: 1
						},
						externalizeHelpers: { module: "@ember/debug" }
					},
					"@ember/debug stripping"
				],
				[
					DebugMacros,
					{
						externalizeHelpers: { module: "@ember/application/deprecations" },
						debugTools: {
							isDebug: true,
							source: "@ember/application/deprecations",
							assertPredicateIndex: 1
						}
					},
					"@ember/application/deprecations stripping"
				]
			],
			presets: []
		});
	}
	const preprocessor = new contentTag.Preprocessor();
	/**
	* @type {import('../../types.ts').Compiler}
	*/
	const gjsCompiler = {
		compile: async (text, options) => {
			const { code: preprocessed } = preprocessor.process(text, { filename: "dynamic-repl.js" });
			return (await transform(preprocessed)).code;
		},
		render: async (element, compiled, extra, compiler) => {
			/**
			*
			* TODO: These will make things easier:
			*    https://github.com/emberjs/rfcs/pull/1099
			*    https://github.com/ember-cli/ember-addon-blueprint/blob/main/files/tests/test-helper.js
			*/
			const attribute = `data-repl-sdk-ember-gjs-${elementId++}`;
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
		},
		handlers: {
			js: async (text) => {
				return gjsCompiler.compile(text, {});
			},
			mjs: async (text) => {
				return gjsCompiler.compile(text, {});
			}
		}
	};
	return gjsCompiler;
}
//#endregion
export { compiler };
