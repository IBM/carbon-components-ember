import { t as Cache } from "./cache-qDyqAcpg-C6oeU-4r.js";
import { a as precompile$1, i as build, n as STRICT_MODE_KEYWORDS, o as preprocess, r as STRICT_MODE_TRANSFORMS, t as RESOLUTION_MODE_TRANSFORMS } from "./plugins-Df7XMXFE.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/ember-template-compiler/index.js
var SIMPLE_DASHERIZE_REGEXP = /[A-Z]|::/g;
var ALPHA = /[A-Za-z0-9]/;
var COMPONENT_NAME_SIMPLE_DASHERIZE_CACHE = new Cache(1e3, (key) => key.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
	if (char === "::") return "/";
	if (index === 0 || !ALPHA.test(key[index - 1])) return char.toLowerCase();
	return `-${char.toLowerCase()}`;
}));
var USER_PLUGINS = [];
function buildCompileOptions(_options) {
	let moduleName = _options.moduleName;
	let options = Object.assign({
		meta: {},
		isProduction: false,
		plugins: { ast: [] }
	}, _options, {
		moduleName,
		customizeComponentName(tagname) {
			return COMPONENT_NAME_SIMPLE_DASHERIZE_CACHE.get(tagname);
		}
	});
	if ("locals" in options && !options.locals) delete options.locals;
	if (options.moduleName) {
		let meta = options.meta;
		meta.moduleName = options.moduleName;
	}
	if (options.strictMode) options.keywords = STRICT_MODE_KEYWORDS;
	return options;
}
function transformsFor(options) {
	return options.strictMode ? STRICT_MODE_TRANSFORMS : RESOLUTION_MODE_TRANSFORMS;
}
function compileOptions(_options = {}) {
	let options = buildCompileOptions(_options);
	let builtInPlugins = transformsFor(options);
	if (!_options.plugins) options.plugins = { ast: [...USER_PLUGINS, ...builtInPlugins] };
	else {
		let pluginsToAdd = [...USER_PLUGINS, ...builtInPlugins].filter((plugin) => {
			return options.plugins.ast.indexOf(plugin) === -1;
		});
		options.plugins.ast = options.plugins.ast.concat(pluginsToAdd);
	}
	return options;
}
/**
@module ember
*/
/**
Uses HTMLBars `compile` function to process a string into a compiled template string.
The returned string must be passed through `Ember.HTMLBars.template`.

This is not present in production builds.

@private
@method precompile
@param {String} templateString This is the string to be compiled by HTMLBars.
*/
function precompile(templateString, options = {}) {
	return precompile$1(templateString, compileOptions(options));
}
//#endregion
export { buildCompileOptions as _buildCompileOptions, preprocess as _preprocess, build as _print, precompile };
