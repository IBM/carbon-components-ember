import { i as initializeDeferredDecorator, n as decorateFieldV2 } from "./runtime--fcdnjmJ-C97hxBku.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { n as tracked } from "./tracked-DvOpYI0o-BARN4wIl.js";
import { t as Component } from "./component-DaFSbo98.js";
import { t as Component$1 } from "./dist-DnJA6M4U.js";
import { t as cached } from "./tracking-C-5Pptoz.js";
import { t as Helper } from "./helper-D1xNZ1iZ.js";
import { u as runInDebug } from "./debug-BySZ7lXL.js";
import { n as decorateMethodV2, r as initializeDeferredDecorator$1, t as decorateFieldV2$1 } from "./runtime-CYyqkz5q-DsZnSQsN.js";
import { t as templateOnly } from "./template-only-CiCtiipS.js";
import { d as waitForPromise } from "./dist-D7Wa23G2.js";
import { t as createStore } from "./store-Bk3Ws1qU.js";
//#region ../node_modules/.pnpm/ember-element-helper@0.8.8_supports-color@8.1.1/node_modules/ember-element-helper/dist/helpers/element.js
function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPrimitive(input, hint) {
	if (typeof input !== "object" || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== void 0) {
		var res = prim.call(input, hint || "default");
		if (typeof res !== "object") return res;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
	var key = _toPrimitive(arg, "string");
	return typeof key === "symbol" ? key : String(key);
}
function UNINITIALIZED() {}
var ElementHelper = class extends Helper {
	constructor(...args) {
		super(...args);
		_defineProperty(this, "tagName", UNINITIALIZED);
		_defineProperty(this, "componentClass", void 0);
	}
	compute(params, hash) {
		let tagName = params[0];
		if (tagName !== this.tagName) {
			this.tagName = tagName;
			if (typeof tagName === "string") this.componentClass = class DynamicElement extends Component {
				constructor(...args) {
					super(...args);
					_defineProperty(this, "tagName", tagName);
				}
			};
			else {
				this.componentClass = void 0;
				runInDebug(() => {
					let message = "The argument passed to the `element` helper must be a string";
					try {
						message += ` (you passed \`${tagName}\`)`;
					} catch (e) {}
				});
			}
		}
		return this.componentClass;
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/narrowing.js
function isElement(x) {
	return x instanceof Element;
}
//#endregion
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/dom-context.js
var LOOKUP = /* @__PURE__ */ new WeakMap();
var Provide = class extends Component$1 {
	get data() {
		/**
		* This covers both classes and functions
		*/
		if (typeof this.args.data === "function") return createStore(this, this.args.data);
		/**
		* Non-instantiable value
		*/
		return this.args.data;
	}
	element;
	constructor(owner, args) {
		super(owner, args);
		if (this.useElementProvider) {
			this.element = document.createElement(this.args.element || "div");
			this.element.style.display = "contents";
		} else this.element = document.createTextNode("");
		const key = this.args.key ?? this.args.data;
		LOOKUP.set(this.element, [key, () => this.data]);
	}
	get useElementProvider() {
		return this.args.element !== false;
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[41,[28,[32,0],[[30,0,[\"element\"]]],null],[[[1,\"  \"],[1,[30,0,[\"element\"]]],[1,\"\\n\\n\"],[40,[[[1,\"    \"],[18,1,null],[1,\"\\n\"]],[]],\"%cursor:0%\",[28,[31,2],[[30,0,[\"element\"]]],null]],[1,\"\\n\"]],[]],[[[1,\"\\n  \"],[1,[30,0,[\"element\"]]],[1,\"\\n  \"],[18,1,null],[1,\"\\n\\n\"]],[]]]],[\"&default\"],[\"if\",\"in-element\",\"-in-el-null\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({ isElement }),
			"isStrictMode": true
		}), this);
	}
};
/**
* How this works:
* - starting at some deep node (Text, Element, whatever),
*   start crawling up the ancenstry graph (of DOM Nodes).
*
* - This algo "tops out" (since we traverse upwards (otherwise this would be "bottoming out")) at the HTMLDocument (parent of the HTML Tag)
*
*/
function findForKey(startElement, key) {
	let parent = startElement;
	while (parent) {
		let target = parent;
		while (target) {
			if (!(target instanceof Element) && !(target instanceof Text)) {
				target = target?.previousSibling;
				continue;
			}
			const maybe = LOOKUP.get(target);
			target = target?.previousSibling;
			if (!maybe) continue;
			if (maybe[0] === key) return maybe[1];
		}
		parent = parent.parentElement;
	}
}
var Consume = class extends Component$1 {
	static {
		decorateFieldV2$1(this.prototype, "getData", [tracked]);
	}
	#getData = (initializeDeferredDecorator$1(this, "getData"), void 0);
	element;
	constructor(owner, args) {
		super(owner, args);
		this.element = document.createTextNode("");
	}
	get context() {
		const self = this;
		return { get data() {
			return findForKey(self.element, self.args.key)();
		} };
	}
	static {
		decorateMethodV2(this.prototype, "context", [cached]);
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[1,[30,0,[\"element\"]]],[1,\"\\n\\n\"],[18,1,[[30,0,[\"context\"]]]]],[\"&default\"],[\"yield\"]]",
			"moduleName": "(unknown template module)",
			"isStrictMode": true
		}), this);
	}
};
//#endregion
//#region ../node_modules/.pnpm/reactiveweb@1.9.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-waiters@4.1.2_su_ca7151678d0c917948ab096fa3757468/node_modules/reactiveweb/dist/get-promise-state.js
var promiseCache = /* @__PURE__ */ new WeakMap();
var REASON_FUNCTION_EXCEPTION = `Passed function threw an exception`;
var REASON_PROMISE_REJECTION = `Promise rejected while waiting to resolve`;
var StateImpl = class {
	static {
		decorateFieldV2(this.prototype, "_isLoading", [tracked]);
	}
	#_isLoading = (initializeDeferredDecorator(this, "_isLoading"), void 0);
	/**
	* @private
	*/
	static {
		decorateFieldV2(this.prototype, "_error", [tracked]);
	}
	#_error = (initializeDeferredDecorator(this, "_error"), void 0);
	/**
	* @private
	*/
	static {
		decorateFieldV2(this.prototype, "_resolved", [tracked]);
	}
	#_resolved = (initializeDeferredDecorator(this, "_resolved"), void 0);
	/**
	* @private
	*/
	#initial;
	constructor(fn, initial) {
		this.#initial = initial;
		try {
			var maybePromise = isThennable(fn) ? fn : isFunction(fn) ? fn() : fn;
		} catch (e) {
			this.#initial = {
				isLoading: false,
				error: {
					reason: REASON_FUNCTION_EXCEPTION,
					original: e
				}
			};
			return;
		}
		if (typeof maybePromise === "object" && maybePromise !== null && "then" in maybePromise) {
			waitForPromise(maybePromise.then((value) => this._resolved = value).catch((error) => this._error = {
				reason: REASON_PROMISE_REJECTION,
				original: error
			}).finally(() => this._isLoading = false));
			return;
		}
		this.#initial = {
			isLoading: false,
			error: null,
			resolved: maybePromise
		};
	}
	get isLoading() {
		return this._isLoading ?? this.#initial?.isLoading ?? false;
	}
	get error() {
		return this._error ?? this.#initial?.error ?? null;
	}
	get resolved() {
		return this._resolved ?? this.#initial?.resolved;
	}
	toJSON() {
		return {
			isLoading: this.isLoading,
			error: this.error,
			resolved: this.resolved
		};
	}
};
/**
* Returns a reactive state for a given value, function, promise, or function that returns a promise.
*
* Also caches the result for the given value, so `getPromiseState` will become synchronous if the passed value
* has already been resolved.
*
* Normally when trying to derive async state, you'll first need to invoke a function to get the promise from that function's return value.
* With `getPromiseState`, a passed function will be invoked for you, so you can skip that step.
*
* @example
* We can use `getPromiseState` to dynamically load and render a component
*
* ```gjs
* import { getPromiseState } from 'reactiveweb/get-promise-state';
*
* let state = getPromiseState(() => import('./some-module/component'));
*
* <template>
*   {{#if state.isLoading}}
*     ... pending ...
*   {{else if state.error}}
*     oh no!
*   {{else if state.resolved}}
*     <state.resolved />
*   {{/if}}
* </template>
* ```
*
* @example
* `getPromiseState` can also be used in a class without `@cached`, because it maintains its own cache.
* ```gjs
* import Component from '@glimmer/component';
* import { getPromiseState } from 'reactiveweb/get-promise-state';
*
* async function readFromSomewhere() { // implementation omitted for brevity
* }
*
* export default class Demo extends Component {
*   // doesn't matter how many times state is accessed, you get a stable state
*   get state() {
*     return getPromiseState(readFromSomewhere);
*   }
*
*   <template>
*     {{#if this.state.resolved}}
*        ...
*     {{/if}}
*   </template>
* }
* ```
*
* @example
* A reactively constructed function will also be used and have its result cached between uses
*
* ```gjs
* import Component from '@glimmer/component';
* import { getPromiseState } from 'reactiveweb/get-promise-state';
*
* async function readFromSomewhere() { // implementation omitted for brevity
* }
*
* export default class Demo extends Component {
*   // Note: the @cached is important here because we don't want repeat accesses
*   //       to cause doAsync to be called again unless @id changes
*   @cached
*   get promise() {
*     return this.doAsync(this.args.id);
*   }
*
*   get state() {
*     return getPromiseState(this.promise);
*   }
*
*   <template>
*     {{#if this.state.resolved}}
*        ...
*     {{/if}}
*   </template>
* }
* ```
*
* NOTE: This `getPromiseState` is not a replacement for [WarpDrive](https://docs.warp-drive.io/)'s [getRequestState](https://www.npmjs.com/package/@warp-drive/ember#getrequeststate)
*       namely, the `getPromiseState` in this library (reactiveweb) does not support futures, cancellation, or anything else specific to warp-drive.
*
*
* --------------

_comparison of pure capability_

| . | reactiveweb | @warpdrive/ember |
| - | ----------- | ---------------- |
| use in module state[^module-state] | ✅ | ✅ |
| use in a getter[^cached-getter] | ✅ | ✅ |
| usable in template | ✅ | ✅  |
| immediate has resolved value for resolved promise | ✅  | ✅  |
| test waiter integration | ✅ | ✅ |
| allows non-promises (forgiving inputs) | ✅ | ❌ |
| can be used without build | ✅ | ❌[^warp-drive-no-build] |
| allows prepopulation of result cache by 3rd party | ❌ | ✅ |
| discriminated states (helpful for TS) | ❌[^needs-work] | ✅ |
| align with [allSettled's return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#return_value) | ❌[^needs-work] | ✅ |

[^warp-drive-no-build]: the warp-drive team is interested in this work, and wants to make REPLs and CDNs easier as well


All in all, they are very similar. The primary use case I had for creating my own is that I wanted dynamic module loading (with import) to be one line (shown in the first example).

reactiveweb's `getPromiseState` is made primarily for my needs in my own projects, and I don't intend to say anything negative about `@warp-drive`s `getPromiseState` -- I actually took a lot of code from it! it's a good tool.

These projects of slightly different goals, so some additional information:

_from the perspective of reactiveweb's_ set of goals:

| . | reactiveweb | @warpdrive/ember |
| - | ----------- | ---------------- |
| invokes a passed function automatically | ✅ | ❌ |
| simple state return[^state-compare] | ⚠️[^needs-work] | ⚠️ [^warp-drive-pending-deprecations] |

[^warp-drive-pending-deprecations]: has pending deprecations, otherwise ✅
[^needs-work]: This is fixable, and probably with little effort, just needs doing

_from the perspective of @warp-drive/core's set of goals_

| . | reactiveweb | @warpdrive/core |
| - | ----------- | ---------------- |
| has a simple API surface | ❌ [^invokes-functions] | ✅ |
| no dependencies | ❌ [^ember-resources] | ⚠️[^warp-drive-no-dependencies] |


[^invokes-functions]: `@warp-drive/core` strives for API simplicity, which means few (if any) overloads on its utilities.
[^warp-drive-no-dependencies]: Does not directly depend on any dependencies, but requires an integration into reactivity (which is technically true for `reactiveweb` as well)


[^module-state]: `getPromiseState(promise);`
[^cached-getter]: requires a stable reference to a promise. getter itself does not need to be cached.
[^no-dependencies]: warp-drive requires a macros config that isn't compatible with "non-config" projects (it's mostly how they generate macros to not gracefully have some behavior if you don't set up their required babel config -- which affects REPL environments (this is solveable via pushing the responsibility to configure babel to the REPLer)). Also, the warp-drive team says this is on their radar, and the'll address it eventually / soon.
[^ember-resources]: reactiveweb (as a whole) does depend on on ember-resources, but ember-resources itself has no dependencies (for real), and is a very tiny use of a helper manager. Additionally, `getPromiseState` does not depend on `ember-resources`.
[^wd-aliases]: warp-drive provides _many_ aliases for states, as well as support some extended promise behavior which is not built in to the platform (Futures, etc). This is still good for convenience and compatibility.
[^state-compare]: in reactiveweb: [State](https://reactive.nullvoxpopuli.com/interfaces/get-promise-state.State.html), and then in `@warp-drive/*`: the [`PromiseState`](https://warp-drive.io/api/@warp-drive/ember/type-aliases/PromiseState) is made of 3 sub types: [PendingPromise](https://warp-drive.io/api/@warp-drive/core/reactive/interfaces/PendingPromise), [ResolvedPromise](https://warp-drive.io/api/@warp-drive/core/reactive/interfaces/ResolvedPromise), and [RejectedPromise](https://warp-drive.io/api/@warp-drive/core/reactive/interfaces/RejectedPromise). Over time, these will align slightly with [allSettled's return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#return_value).
*
*/
function getPromiseState(fn) {
	if (typeof fn !== "function" && !isThennable(fn)) return {
		isLoading: false,
		error: null,
		resolved: fn,
		toJSON() {
			return {
				isLoading: false,
				error: null,
				resolved: fn
			};
		}
	};
	const existing = promiseCache.get(fn);
	if (existing) return existing;
	const state = new StateImpl(fn, { isLoading: true });
	promiseCache.set(fn, state);
	return state;
}
function isThennable(x) {
	if (typeof x !== "object") return false;
	if (!x) return false;
	return "then" in x;
}
/**
* This exists because when you guard with typeof x === function normally in TS,
* you just get `& Function` added to your type, which isn't exactly the narrowing I want.
*
* This can result in "Value & Function" has no call signatures....
* which is kinda ridiculous.
*/
function isFunction(x) {
	return typeof x === "function";
}
//#endregion
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/components/external-link.js
var ExternalLink = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[11,3],[24,\"target\",\"_blank\"],[24,\"rel\",\"noreferrer noopener\"],[24,6,\"##missing##\"],[17,1],[12],[1,\"\\n  \"],[18,2,null],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
	"moduleName": "(unknown template module)",
	"isStrictMode": true
}), templateOnly(void 0, "external-link:ExternalLink"));
//#endregion
export { isElement as a, Provide as i, getPromiseState as n, ElementHelper as o, Consume as r, ExternalLink as t };
