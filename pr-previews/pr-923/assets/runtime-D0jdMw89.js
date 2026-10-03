import { t as Cache } from "./cache-qDyqAcpg-C6oeU-4r.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { i as hash, n as array, r as fn } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { t as on } from "./on-CkzM3EZT.js";
import { a as lt, c as not, i as gte, l as or, n as eq, o as lte, r as gt, s as neq, t as and } from "./not-DOTpWiG3-B7e-Fzd-.js";
import { t as element } from "./element-BmBjPjkQ-BAO3lLtw.js";
import { t as templateOnly } from "./template-only-CiCtiipS.js";
import { a as precompile, n as STRICT_MODE_KEYWORDS, r as STRICT_MODE_TRANSFORMS, t as RESOLUTION_MODE_TRANSFORMS } from "./plugins-Df7XMXFE.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/allowed-globals.js
/**
* @private
*
* RFC: https://github.com/emberjs/rfcs/pull/1070
*
* Criteria for inclusion in this list:
*
*   Any of:
*     - begins with an uppercase letter
*     - guaranteed to never be added to glimmer as a keyword (e.g.: globalThis)
*
*   And:
*     - must not need new to invoke
*     - must not require lifetime management (e.g.: setTimeout)
*     - must not be a single-word lower-case API, because of potential collision with future new HTML elements
*     - if the API is a function, the return value should not be a promise
*     - must be one one of these lists:
*        - https://tc39.es/ecma262/#sec-global-object
*        - https://tc39.es/ecma262/#sec-function-properties-of-the-global-object
*        - https://html.spec.whatwg.org/multipage/nav-history-apis.html#window
*        - https://html.spec.whatwg.org/multipage/indices.html#all-interfaces
*        - https://html.spec.whatwg.org/multipage/webappapis.html
*/
var ALLOWED_GLOBALS = /* @__PURE__ */ new Set([
	"globalThis",
	"Atomics",
	"JSON",
	"Math",
	"Reflect",
	"localStorage",
	"sessionStorage",
	"URL",
	"isNaN",
	"isFinite",
	"parseInt",
	"parseFloat",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"postMessage",
	"structuredClone",
	"Array",
	"BigInt",
	"Boolean",
	"Date",
	"Number",
	"Object",
	"String",
	"Infinity",
	"NaN",
	"isSecureContext"
]);
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/dasherize-component-name.js
var SIMPLE_DASHERIZE_REGEXP = /[A-Z]|::/g;
var ALPHA = /[A-Za-z0-9]/;
var COMPONENT_NAME_SIMPLE_DASHERIZE_CACHE = new Cache(1e3, (key) => key.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
	if (char === "::") return "/";
	if (index === 0 || !ALPHA.test(key[index - 1])) return char.toLowerCase();
	return `-${char.toLowerCase()}`;
}));
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/compile-options.js
var USER_PLUGINS = [];
/**
* The variable name used to inject the keywords object into the
* template's evaluation scope. auto-import-builtins rewrites bare
* keyword references (e.g. `on`) to property accesses on this
* variable (e.g. `__ember_keywords__.on`).
*/
var RUNTIME_KEYWORDS_NAME = "__ember_keywords__";
var keywords = {
	array,
	eq,
	element,
	and,
	fn,
	hash,
	neq,
	gt,
	gte,
	lt,
	lte,
	not,
	on,
	or
};
function buildCompileOptions(_options) {
	let moduleName = _options.moduleName;
	let options = {
		isProduction: false,
		plugins: { ast: [] },
		..._options,
		moduleName,
		customizeComponentName(tagname) {
			return COMPONENT_NAME_SIMPLE_DASHERIZE_CACHE.get(tagname);
		}
	};
	options.meta ||= {};
	options.meta.emberRuntime ||= { lookupKeyword(name) {
		return `${RUNTIME_KEYWORDS_NAME}.${name}`;
	} };
	if ("eval" in options && options.eval) {
		const localScopeEvaluator = options.eval;
		const globalScopeEvaluator = (value) => new Function(`return ${value};`)();
		options.lexicalScope = (variable) => {
			if (variable === "__ember_keywords__") return true;
			if (ALLOWED_GLOBALS.has(variable)) return variable in globalThis;
			if (inScope(variable, localScopeEvaluator)) return !inScope(variable, globalScopeEvaluator);
			return false;
		};
		delete options.eval;
	}
	if ("scope" in options) {
		const scope = options.scope();
		options.lexicalScope = (variable) => variable in scope || variable === "__ember_keywords__";
		delete options.scope;
	}
	if (!options.lexicalScope) options.lexicalScope = (variable) => variable === RUNTIME_KEYWORDS_NAME;
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
		options.plugins.ast = [...options.plugins.ast, ...pluginsToAdd];
	}
	return options;
}
var IDENT = /^[\p{ID_Start}$_][\p{ID_Continue}$_\u200C\u200D]*$/u;
function inScope(variable, evaluator) {
	if (!IDENT.exec(variable)) return false;
	try {
		return evaluator(`typeof ${variable} !== "undefined"`) === true;
	} catch (e) {
		if (e && e instanceof SyntaxError) return false;
		throw e;
	}
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/template.js
/**
* All possible options passed to `template()` may specify a `moduleName`.
*/
/**
* When using `template` in a class, you call it in a `static` block and pass
* the class as the `component` option.
*
* ```ts
* class MyComponent extends Component {
*   static {
*     template('{{this.greeting}}, {{@place}}!',
*       { component: this },
*       // explicit or implicit option goes here
*     );
*   }
* }
* ```
*
* For the full explicit form, see {@linkcode ExplicitClassOptions}. For the
* full implicit form, see {@linkcode ImplicitClassOptions}.
*/
/**
* When using `template` outside of a class (i.e. a "template-only component"), you can pass
* a `scope` option that explicitly provides the lexical scope for the template.
*
* This is called the "explicit form".
*
* ```ts
* const greeting = 'Hello';
* const HelloWorld = template('{{greeting}} World!', { scope: () => ({ greeting }) });
* ```
*/
/**
* When using `template` *inside* a class (see
* {@linkcode BaseClassTemplateOptions}), you can pass a `scope` option that
* explicitly provides the lexical scope for the template, just like a template-only
* component (see {@linkcode ExplicitTemplateOnlyOptions}).
*
* ```ts
* class MyComponent extends Component {
*   static {
*     template('{{this.greeting}}, {{@place}}!',
*       { component: this },
*       // explicit or implicit option goes here
*     );
*   }
* }
* ```
*
* ## The Scope Function's `instance` Parameter
*
* However, the explicit `scope` function in a *class* also takes an `instance` option
* that provides access to the component's instance.
*
* Once it's supported in Handlebars, this will make it possible to represent private
* fields when using the explicit form.
*
* ```ts
* class MyComponent extends Component {
*   static {
*     template('{{this.#greeting}}, {{@place}}!',
*       { component: this },
*       scope: (instance) => ({ '#greeting': instance.#greeting }),
*     );
*   }
* }
* ```
*/
/**
* The *implicit* form of the `template` function takes an `eval` option that
* allows the runtime compiler to evaluate local template variables without
* needing to maintain an explicit list of the local variables used in the
* template scope.
*
* The eval options *must* be passed in the following form:
*
* ```ts
* {
*   eval() { return eval(arguments[0]) }
* }
* ```
*
* ## Requirements of the `eval` Option
*
* **The syntactic form presented above is the only form you should use when
* passing an `eval` option.**
*
* This is _required_ if you want your code to be compatible with the
* compile-time implementation of `@ember/template-compiler`. While the runtime
* compiler offers a tiny bit of additional wiggle room, you still need to follow
* very strict rules.
*
* We don't recommend trying to memorize the rules. Instead, we recommend using
* the snippet presented above and supported by the compile-time implementation.
*
* ### The Technical Requirements of the `eval` Option
*
* The `eval` function is passed a single parameter that is a JavaScript
* identifier. This will be extended in the future to support private fields.
*
* Since keywords in JavaScript are contextual (e.g. `await` and `yield`), the
* parameter might be a keyword. The `@ember/template-compiler/runtime` expects
* the function to throw a `SyntaxError` if the identifier name is not valid in
* the current scope. (The direct `eval` function takes care of this out of the
* box.)
*
* Requirements:
*
* 1. The `eval` method must receive its parameter as `arguments[0]`, which
*    ensures that the variable name passed to `eval()` is not shadowed by the
*    function's parameter name.
* 2. The `eval` option must be a function or concise method, and not an arrow.
*    This is because arrows do not have their own `arguments`, which breaks
*    (1).
* 3. The `eval` method must call "*direct* `eval`", and not an alias of `eval`.
*    Direct `eval` evaluates the code in the scope it was called from, while
*    aliased versions of `eval` (including `new Function`) evaluate the code in
*    the global scope.
* 4. The `eval` method must return the result of calling "direct `eval`".
*
* The easiest way to achieve these requirements is to use the exact syntax
* presented above. This is *also* the only way to be compatible
*
* ## Rationale
*
* This is useful for two reasons:
*
* 1. This form is a useful _intermediate_ form for the compile-time toolchain.
*    It allows the content-tag preprocessor to convert the `<template>` syntax
*    into valid JavaScript without needing to involve full-fledged lexical
*    analysis.
* 2. This form is a convenient form for manual prototyping when using the
*    runtime compiler directly. While it requires some extra typing relative to
*    `<template>`, it's a mechanical 1:1 transformation of the syntax.
*
* In practice, implementations that use a runtime compiler (for example, a
* playground running completely in the browser) should probably use the
* `content-tag` preprocessor to convert the template into the implicit form,
* and then rely on `@ember/template-compiler/runtime` to evaluate the template.
*/
/**
* When using `template` outside of a class (i.e. a "template-only component"), you can pass
* an `eval` option that _implicitly_ provides the lexical scope for the template.
*
* This is called the "implicit form".
*
* ```ts
* const greeting = 'Hello';
* const HelloWorld = template('{{greeting}} World!', {
*   eval() { return arguments[0] }
* });
* ```
*
* For more details on the requirements of the `eval` option, see {@linkcode ImplicitEvalOption}.
*/
/**
* When using `template` inside of a class, you can pass an `eval` option that
* _implicitly_ provides the lexical scope for the template, just as you can
* with a {@linkcode ImplicitTemplateOnlyOptions | template-only component}.
*
* This is called the "implicit form".
*
* ```ts
* class MyComponent extends Component {
*   static {
*     template('{{this.greeting}}, {{@place}}!',
*       { component: this },
*       eval() { return arguments[0] }
*     );
*   }
* }
* ```
*
* ## Note  on Private Fields
*
* The current implementation of `@ember/template-compiler` does not support
* private fields, but once the Handlebars parser adds support for private field
* syntax and it's implemented in the Glimmer compiler, the implicit form should
* be able to support them.
*/
function template(templateString, providedOptions) {
	const options = {
		strictMode: true,
		...providedOptions
	};
	const evaluate = buildEvaluator(options);
	const normalizedOptions = compileOptions(options);
	const component = normalizedOptions.component ?? templateOnly();
	const wire = evaluate(`(${precompile(templateString, normalizedOptions)})`);
	const template = templateFactory(wire);
	setComponentTemplate(template, component);
	return component;
}
/**
* Builds the source wireformat JSON block
*
* @param options
* @returns
*/
function buildEvaluator(options) {
	if (options.eval) {
		const userEval = options.eval;
		return (source) => {
			return userEval(`(function(${RUNTIME_KEYWORDS_NAME}){ return (${source}); })`)(keywords);
		};
	} else {
		let scope = options.scope?.();
		if (!scope) return (source) => {
			return new Function(RUNTIME_KEYWORDS_NAME, `return (${source})`)(keywords);
		};
		scope = Object.assign({ [RUNTIME_KEYWORDS_NAME]: keywords }, scope);
		return (source) => {
			let hasThis = Object.prototype.hasOwnProperty.call(scope, "this");
			let thisValue = hasThis ? scope.this : void 0;
			let argNames = [];
			let argValues = [];
			for (let [name, value] of Object.entries(scope)) {
				if (name === "this") continue;
				argNames.push(name);
				argValues.push(value);
			}
			let fn = new Function(...argNames, `return (${source})`);
			return hasThis ? fn.call(thisValue, ...argValues) : fn(...argValues);
		};
	}
}
//#endregion
export { template };
