import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { U as get } from "./core-D-L0f59Y.js";
import { C as setOnerror, S as getOnerror, g as run, t as _backburner, v as schedule } from "./runloop-Dk0Nzu3h.js";
import { i as destroy } from "./destroyable-BW6N5j2P.js";
import { t as VERSION } from "./version-dVdMCUiN.js";
import { A as Registry } from "./route-CA9vvjYs.js";
import { i as ContainerProxyMixin, r as RegistryProxyMixin, t as ApplicationInstance } from "./instance-VyeWfvnG.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { i as getProperties, r as setProperties } from "./observable-BDMGT456.js";
import { t as EmberObject } from "./object-X4rDdm09.js";
import { a as OutletView, c as setupApplicationRegistry, f as isSerializationFirstNode, g as EventDispatcher, i as setOwner, l as setupEngineRegistry, o as Renderer, s as RootTemplate, t as Application } from "./application-DHX-EgR7.js";
import { n as setTesting, t as isTesting } from "./testing-Chw1oEEI.js";
import { n as getInternalComponentManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { S as ConcreteBounds } from "./arguments-Carzx7C4-snfB_1Hj.js";
import { T as DOMTreeConstruction, a as renderComponent$2, l as DOMChanges, o as renderSettled$2, r as _resetRenderers } from "./index-B-2NDHmt-B5xkrs2f.js";
import { c as templateFactory, s as templateCacheCounters } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as Textarea, t as Input } from "./textarea-B-sssXGa-CtPv2q76.js";
import { n as uniqueId$1 } from "./unique-id-BJb1p8EG-CAigDLyj.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { a as isTrustedHTML, i as isHTMLSafe, n as TrustedHTML, o as trustHTML, r as htmlSafe, t as SafeString } from "./index-D-xTBV4B-DG7EnZE6.js";
import { t as LinkTo } from "./routing-DTahssKR.js";
import { r as setComponentManager, t as Component } from "./component-DaFSbo98.js";
import { i as modifierCapabilities, r as componentCapabilities } from "./api-B_poQGXS-T6hxwnfy.js";
import { n as helper, t as Helper } from "./helper-D1xNZ1iZ.js";
import { t as element } from "./element-BmBjPjkQ-BAO3lLtw.js";
import { h as registerHandler, m as registerHandler$1 } from "./debug-BySZ7lXL.js";
import { t as esCompat } from "./es-compat2-D1cSJc1a.js";
import { i as getPendingWaiterState, o as hasPendingWaiters } from "./dist-D7Wa23G2.js";
import { n as registerTestImplementation } from "./test-Dv-JT5be.js";
import { t as renderer_exports } from "./renderer-CUrUrf6U.js";
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/resolver.js
var __resolver__;
/**
Stores the provided resolver instance so that tests being ran can resolve
objects in the same way as a normal application.

Used by `setupContext` and `setupRenderingContext` as a fallback when `setApplication` was _not_ used.

@public
@param {Ember.Resolver} resolver the resolver to be used for testing
*/
function setResolver(resolver) {
	__resolver__ = resolver;
}
/**
Retrieve the resolver instance stored by `setResolver`.

@public
@returns {Ember.Resolver} the previously stored resolver
*/
function getResolver() {
	return __resolver__;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/application.js
var __application__;
/**
Stores the provided application instance so that tests being ran will be aware of the application under test.

- Required by `setupApplicationContext` method.
- Used by `setupContext` and `setupRenderingContext` when present.

@public
@param {Ember.Application} application the application that will be tested
*/
function setApplication(application) {
	__application__ = application;
	if (!getResolver()) setResolver(application.Resolver.create({ namespace: application }));
}
/**
Retrieve the application instance stored by `setApplication`.

@public
@returns {Ember.Application} the previously stored application instance under test
*/
function getApplication() {
	return __application__;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/has-ember-version.js
/**
Checks if the currently running Ember version is greater than or equal to the
specified major and minor version numbers.

@private
@param {number} major the major version number to compare
@param {number} minor the minor version number to compare
@returns {boolean} true if the Ember version is >= MAJOR.MINOR specified, false otherwise
*/
function hasEmberVersion(major, minor) {
	const numbers = VERSION.split("-")[0]?.split(".");
	if (!numbers || !numbers[0] || !numbers[1]) throw new Error("`Ember.VERSION` is not set.");
	const actualMajor = parseInt(numbers[0], 10);
	const actualMinor = parseInt(numbers[1], 10);
	return actualMajor > major || actualMajor === major && actualMinor >= minor;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/build-registry.js
/**
* Adds methods that are normally only on registry to the container. This is largely to support the legacy APIs
* that are not using `owner` (but are still using `this.container`).
*
* @private
* @param {Object} container  the container to modify
*/
function exposeRegistryMethodsWithoutDeprecations(container) {
	const methods = [
		"register",
		"unregister",
		"resolve",
		"normalize",
		"typeInjection",
		"injection",
		"factoryInjection",
		"factoryTypeInjection",
		"has",
		"options",
		"optionsForType"
	];
	for (let i = 0, l = methods.length; i < l; i++) {
		const methodName = methods[i];
		if (methodName && methodName in container) {
			const knownMethod = methodName;
			container[knownMethod] = function(...args) {
				return container._registry[knownMethod](...args);
			};
		}
	}
}
var Owner = class extends EmberObject.extend(RegistryProxyMixin, ContainerProxyMixin) {
	_emberTestHelpersMockOwner = true;
	/**
	* Unregister a factory and its instance.
	*
	* Overrides `RegistryProxy#unregister` in order to clear any cached instances
	* of the unregistered factory.
	*
	* @param {string} fullName Name of the factory to unregister.
	*
	* @see {@link https://github.com/emberjs/ember.js/pull/12680}
	* @see {@link https://github.com/emberjs/ember.js/blob/v4.5.0-alpha.5/packages/%40ember/engine/instance.ts#L152-L167}
	*/
	unregister(fullName) {
		this["__container__"].reset(fullName);
		this["__registry__"].unregister(fullName);
	}
};
/**
* @private
* @param {Object} resolver the resolver to use with the registry
* @returns {Object} owner, container, registry
*/
function buildRegistry(resolver) {
	const namespace = new Application();
	namespace.Resolver = { create() {
		return resolver;
	} };
	const fallbackRegistry = Application.buildRegistry(namespace);
	const registry = new Registry({ fallback: fallbackRegistry });
	ApplicationInstance.setupRegistry(registry);
	registry.normalizeFullName = fallbackRegistry.normalizeFullName;
	registry.makeToString = fallbackRegistry.makeToString;
	registry.describe = fallbackRegistry.describe;
	const owner = Owner.create({
		__registry__: registry,
		__container__: null
	});
	const container = registry.container({ owner });
	owner.__container__ = container;
	exposeRegistryMethodsWithoutDeprecations(container);
	return {
		registry,
		container,
		owner
	};
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/build-owner.js
/**
Creates an "owner" (an object that either _is_ or duck-types like an
`Ember.ApplicationInstance`) from the provided options.

If `options.application` is present (e.g. setup by an earlier call to
`setApplication`) an `Ember.ApplicationInstance` is built via
`application.buildInstance()`.

If `options.application` is not present, we fall back to using
`options.resolver` instead (setup via `setResolver`). This creates a mock
"owner" by using a custom created combination of `Ember.Registry`,
`Ember.Container`, `Ember._ContainerProxyMixin`, and
`Ember._RegistryProxyMixin`.

@private
@param {Ember.Application} [application] the Ember.Application to build an instance from
@param {Ember.Resolver} [resolver] the resolver to use to back a "mock owner"
@returns {Promise<Ember.ApplicationInstance>} a promise resolving to the generated "owner"
*/
function buildOwner(application, resolver) {
	if (application) return application.boot().then((app) => app.buildInstance().boot());
	if (!resolver) throw new Error("You must set up the ember-test-helpers environment with either `setResolver` or `setApplication` before running any tests.");
	const { owner } = buildRegistry(resolver);
	return Promise.resolve(owner);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/ember-testing/lib/test/waiters.js
/**
@module @ember/test
*/
var contexts = [];
var callbacks = [];
/**
This allows ember-testing to play nicely with other asynchronous
events, such as an application that is waiting for a CSS3
transition or an IndexDB transaction. The waiter runs periodically
after each async helper (i.e. `click`, `andThen`, `visit`, etc) has executed,
until the returning result is truthy. After the waiters finish, the next async helper
is executed and the process repeats.

For example:

```javascript
import { registerWaiter } from '@ember/test';

registerWaiter(function() {
return myPendingTransactions() === 0;
});
```
The `context` argument allows you to optionally specify the `this`
with which your callback will be invoked.

For example:

```javascript
import { registerWaiter } from '@ember/test';

registerWaiter(MyDB, MyDB.hasPendingTransactions);
```

@public
@for @ember/test
@static
@method registerWaiter
@param {Object} context (optional)
@param {Function} callback
@since 1.2.0
*/
function registerWaiter(...args) {
	let checkedCallback;
	let checkedContext;
	if (args.length === 1) {
		checkedContext = null;
		checkedCallback = args[0];
	} else {
		checkedContext = args[0];
		checkedCallback = args[1];
	}
	if (indexOf(checkedContext, checkedCallback) > -1) return;
	contexts.push(checkedContext);
	callbacks.push(checkedCallback);
}
/**
`unregisterWaiter` is used to unregister a callback that was
registered with `registerWaiter`.

@public
@for @ember/test
@static
@method unregisterWaiter
@param {Object} context (optional)
@param {Function} callback
@since 1.2.0
*/
function unregisterWaiter(context, callback) {
	if (!callbacks.length) return;
	if (arguments.length === 1) {
		callback = context;
		context = null;
	}
	let i = indexOf(context, callback);
	if (i === -1) return;
	contexts.splice(i, 1);
	callbacks.splice(i, 1);
}
/**
Iterates through each registered test waiter, and invokes
its callback. If any waiter returns false, this method will return
true indicating that the waiters have not settled yet.

This is generally used internally from the acceptance/integration test
infrastructure.

@public
@for @ember/test
@static
@method checkWaiters
*/
function checkWaiters$1() {
	if (!callbacks.length) return false;
	for (let i = 0; i < callbacks.length; i++) {
		let context = contexts[i];
		if (!callbacks[i].call(context)) return true;
	}
	return false;
}
function indexOf(context, callback) {
	for (let i = 0; i < callbacks.length; i++) if (callbacks[i] === callback && contexts[i] === context) return i;
	return -1;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/ember-testing/lib/test.js
/**
@module ember
*/
/**
This is a container for an assortment of testing related functionality:

* Choose your default test adapter (for your framework of choice).
* Register/Unregister additional test helpers.
* Setup callbacks to be fired when the test helpers are injected into
your application.

@class Test
@namespace Ember
@public
*/
var Test = {
	registerWaiter,
	unregisterWaiter,
	checkWaiters: checkWaiters$1
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/ember-testing/lib/adapters/adapter.js
/**
@module @ember/test
*/
/**
The primary purpose of this class is to create hooks that can be implemented
by an adapter for various test frameworks.

@class TestAdapter
@public
*/
var Adapter = EmberObject.extend({
	/**
	This callback will be called whenever an async operation is about to start.
	Override this to call your framework's methods that handle async
	operations.
	@public
	@method asyncStart
	*/
	asyncStart() {},
	/**
	This callback will be called whenever an async operation has completed.
	@public
	@method asyncEnd
	*/
	asyncEnd() {},
	/**
	Override this method with your testing framework's false assertion.
	This function is called whenever an exception occurs causing the testing
	promise to fail.
	QUnit example:
	```javascript
	exception: function(error) {
	ok(false, error);
	};
	```
	@public
	@method exception
	@param {String} error The exception to be raised.
	*/
	exception(error) {
		throw error;
	}
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/ember-testing/index.js
registerTestImplementation(/* @__PURE__ */ Object.freeze(/*#__PURE__*/ Object.defineProperty({
	__proto__: null,
	Adapter,
	Test
}, Symbol.toStringTag, { value: "Module" })));
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-target.js
function isElement(target) {
	return target !== null && typeof target === "object" && Reflect.get(target, "nodeType") === Node.ELEMENT_NODE;
}
function isWindow(target) {
	return target instanceof Window;
}
function isDocument(target) {
	return target !== null && typeof target === "object" && Reflect.get(target, "nodeType") === Node.DOCUMENT_NODE;
}
function isContentEditable(element) {
	return "isContentEditable" in element && element.isContentEditable;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-is-form-control.js
var FORM_CONTROL_TAGS = [
	"INPUT",
	"BUTTON",
	"SELECT",
	"TEXTAREA"
];
/**
@private
@param {Element} element the element to check
@returns {boolean} `true` when the element is a form control, `false` otherwise
*/
function isFormControl(element) {
	return !isWindow(element) && !isDocument(element) && FORM_CONTROL_TAGS.indexOf(element.tagName) > -1 && element.type !== "hidden";
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-utils.js
var nextTick = (cb) => Promise.resolve().then(cb);
var futureTick = setTimeout;
/**
Returns whether the passed in string consists only of numeric characters.

@private
@param {string} n input string
@returns {boolean} whether the input string consists only of numeric characters
*/
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(Number(n));
}
/**
Checks if an element is considered visible by the focus area spec.

@private
@param {Element} element the element to check
@returns {boolean} `true` when the element is visible, `false` otherwise
*/
function isVisible(element) {
	const styles = window.getComputedStyle(element);
	return styles.display !== "none" && styles.visibility !== "hidden";
}
/**
Checks if an element is disabled.

@private
@param {Element} element the element to check
@returns {boolean} `true` when the element is disabled, `false` otherwise
*/
function isDisabled(element) {
	if (isFormControl(element)) return element.disabled;
	return false;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/wait-until.js
var TIMEOUTS = [
	0,
	1,
	2,
	5,
	7
];
var MAX_TIMEOUT = 10;
/**
Wait for the provided callback to return a truthy value.

This does not leverage `settled()`, and as such can be used to manage async
while _not_ settled (e.g. "loading" or "pending" states).

@public
@param {Function} callback the callback to use for testing when waiting should stop
@param {Object} [options] options used to override defaults
@param {number} [options.timeout=1000] the maximum amount of time to wait
@param {string} [options.timeoutMessage='waitUntil timed out'] the message to use in the reject on timeout
@returns {Promise} resolves with the callback value when it returns a truthy value

@example
<caption>
Waiting until a selected element displays text:
</caption>
await waitUntil(function() {
return find('.my-selector').textContent.includes('something')
}, { timeout: 2000 })
*/
function waitUntil(callback, options = {}) {
	const timeout = "timeout" in options ? options.timeout : 1e3;
	const timeoutMessage = "timeoutMessage" in options ? options.timeoutMessage : "waitUntil timed out";
	const waitUntilTimedOut = new Error(timeoutMessage);
	return new Promise(function(resolve, reject) {
		let time = 0;
		function scheduleCheck(timeoutsIndex) {
			const knownTimeout = TIMEOUTS[timeoutsIndex];
			const interval = knownTimeout === void 0 ? MAX_TIMEOUT : knownTimeout;
			futureTick(function() {
				time += interval;
				let value;
				try {
					value = callback();
				} catch (error) {
					reject(error);
					return;
				}
				if (value) resolve(value);
				else if (time < timeout) scheduleCheck(timeoutsIndex + 1);
				else {
					reject(waitUntilTimedOut);
					return;
				}
			}, interval);
		}
		scheduleCheck(0);
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/global.js
var global$1 = (() => {
	if (typeof self !== "undefined") return self;
	else if (typeof window !== "undefined") return window;
	else if (typeof global !== "undefined") return global;
	else return Function("return this")();
})();
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/test-metadata.js
var TestMetadata = class {
	testName;
	setupTypes;
	usedHelpers;
	constructor() {
		this.setupTypes = [];
		this.usedHelpers = [];
	}
	get isRendering() {
		return this.setupTypes.indexOf("setupRenderingContext") > -1 && this.usedHelpers.indexOf("render") > -1;
	}
	get isApplication() {
		return this.setupTypes.indexOf("setupApplicationContext") > -1;
	}
};
var TEST_METADATA = /* @__PURE__ */ new WeakMap();
/**
* Gets the test metadata associated with the provided test context. Will create
* a new test metadata object if one does not exist.
*
* @param {BaseContext} context the context to use
* @returns {TestMetadata} the test metadata for the provided context
*/
function getTestMetadata(context) {
	if (!TEST_METADATA.has(context)) TEST_METADATA.set(context, new TestMetadata());
	return TEST_METADATA.get(context);
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/is-promise.js
/**
*
* detect if a value appears to be a promise
*
* @private
* @param {any} [maybePromise] the value being considered to be a promise
* @return {boolean} true if the value appears to be a promise, or false otherwise
*/
function isPromise(maybePromise) {
	return maybePromise !== null && (typeof maybePromise === "object" || typeof maybePromise === "function") && typeof maybePromise.then === "function";
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/deprecations.js
var DEPRECATIONS = /* @__PURE__ */ new WeakMap();
/**
*
* Provides the list of deprecation failures associated with a given base context;
*
* @private
* @param {BaseContext} [context] the test context
* @return {Array<DeprecationFailure>} the Deprecation Failures associated with the corresponding BaseContext;
*/
function getDeprecationsForContext(context) {
	if (!context) throw new TypeError(`[@ember/test-helpers] could not get deprecations for an invalid test context: '${context}'`);
	let deprecations = DEPRECATIONS.get(context);
	if (!Array.isArray(deprecations)) {
		deprecations = [];
		DEPRECATIONS.set(context, deprecations);
	}
	return deprecations;
}
/**
*
* Provides the list of deprecation failures associated with a given base
* context which occur while a callback is executed. This callback can be
* synchronous, or it can be an async function.
*
* @private
* @param {BaseContext} [context] the test context
* @param {Function} [callback] The callback that when executed will have its DeprecationFailure recorded
* @return {Array<DeprecationFailure>} The Deprecation Failures associated with the corresponding baseContext which occurred while the CallbackFunction was executed
*/
function getDeprecationsDuringCallbackForContext(context, callback) {
	if (!context) throw new TypeError(`[@ember/test-helpers] could not get deprecations for an invalid test context: '${context}'`);
	const deprecations = getDeprecationsForContext(context);
	const previousLength = deprecations.length;
	const result = callback();
	if (isPromise(result)) return Promise.resolve(result).then(() => {
		return deprecations.slice(previousLength);
	});
	else return deprecations.slice(previousLength);
}
if (typeof URLSearchParams !== "undefined") {
	const queryParams = new URLSearchParams(document.location.search.substring(1));
	const disabledDeprecations = queryParams.get("disabledDeprecations");
	const debugDeprecations = queryParams.get("debugDeprecations");
	if (disabledDeprecations) registerHandler((message, options, next) => {
		if (!options || !disabledDeprecations.includes(options.id)) next.apply(null, [message, options]);
	});
	if (debugDeprecations) registerHandler((message, options, next) => {
		if (options && debugDeprecations.includes(options.id)) debugger;
		next.apply(null, [message, options]);
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/warnings.js
var WARNINGS = /* @__PURE__ */ new WeakMap();
/**
*
* Provides the list of warnings associated with a given base context;
*
* @private
* @param {BaseContext} [context] the test context
* @return {Array<Warning>} the warnings associated with the corresponding BaseContext;
*/
function getWarningsForContext(context) {
	if (!context) throw new TypeError(`[@ember/test-helpers] could not get warnings for an invalid test context: '${context}'`);
	let warnings = WARNINGS.get(context);
	if (!Array.isArray(warnings)) {
		warnings = [];
		WARNINGS.set(context, warnings);
	}
	return warnings;
}
/**
*
* Provides the list of warnings associated with a given test context which
* occurred only while a the provided callback is executed. This callback can be
* synchronous, or it can be an async function.
*
* @private
* @param {BaseContext} [context] the test context
* @param {Function} [callback] The callback that when executed will have its warnings recorded
* @return {Array<Warning>} The warnings associated with the corresponding baseContext which occurred while the CallbackFunction was executed
*/
function getWarningsDuringCallbackForContext(context, callback) {
	if (!context) throw new TypeError(`[@ember/test-helpers] could not get warnings for an invalid test context: '${context}'`);
	const warnings = getWarningsForContext(context);
	const previousLength = warnings.length;
	const result = callback();
	if (isPromise(result)) return Promise.resolve(result).then(() => {
		return warnings.slice(previousLength);
	});
	else return warnings.slice(previousLength);
}
if (typeof URLSearchParams !== "undefined") {
	const queryParams = new URLSearchParams(document.location.search.substring(1));
	const disabledWarnings = queryParams.get("disabledWarnings");
	const debugWarnings = queryParams.get("debugWarnings");
	if (disabledWarnings) registerHandler$1((message, options, next) => {
		if (!options || !disabledWarnings.includes(options.id)) next.apply(null, [message, options]);
	});
	if (debugWarnings) registerHandler$1((message, options, next) => {
		if (options && debugWarnings.includes(options.id)) debugger;
		next.apply(null, [message, options]);
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/helper-hooks.js
var registeredHooks = /* @__PURE__ */ new Map();
/**
* @private
* @param {string} helperName The name of the test helper in which to run the hook.
* @param {string} label A label to help identify the hook.
* @returns {string} The compound key for the helper.
*/
function getHelperKey(helperName, label) {
	return `${helperName}:${label}`;
}
/**
* Registers a function to be run during the invocation of a test helper.
*
* @param {string} helperName The name of the test helper in which to run the hook.
*                            Test helper names include `blur`, `click`, `doubleClick`, `fillIn`,
*                            `fireEvent`, `focus`, `render`, `scrollTo`, `select`, `tab`, `tap`, `triggerEvent`,
*                            `triggerKeyEvent`, `typeIn`, and `visit`.
* @param {string} label A label to help identify the hook. Built-in labels include `start`, `end`,
*                       and `targetFound`, the former designating either the start or end of
*                       the helper invocation.
* @param {Function} hook The hook function to run when the test helper is invoked.
* @returns {HookUnregister} An object containing an `unregister` function that unregisters
*                           the specific hook initially registered to the helper.
* @example
* <caption>
*   Registering a hook for the `end` point of the `click` test helper invocation
* </caption>
*
* const hook = registerHook('click', 'end', () => {
*   console.log('Running `click:end` test helper hook');
* });
*
* // Unregister the hook at some later point in time
* hook.unregister();
*/
function registerHook(helperName, label, hook) {
	const helperKey = getHelperKey(helperName, label);
	let hooksForHelper = registeredHooks.get(helperKey);
	if (hooksForHelper === void 0) {
		hooksForHelper = /* @__PURE__ */ new Set();
		registeredHooks.set(helperKey, hooksForHelper);
	}
	hooksForHelper.add(hook);
	return { unregister() {
		hooksForHelper.delete(hook);
	} };
}
/**
* Runs all hooks registered for a specific test helper.
*
* @param {string} helperName The name of the test helper in which to run the hook.
*                            Test helper names include `blur`, `click`, `doubleClick`, `fillIn`,
*                            `fireEvent`, `focus`, `render`, `scrollTo`, `select`, `tab`, `tap`, `triggerEvent`,
*                            `triggerKeyEvent`, `typeIn`, and `visit`.
* @param {string} label A label to help identify the hook. Built-in labels include `start`, `end`,
*                       and `targetFound`, the former designating either the start or end of
*                       the helper invocation.
* @param {unknown[]} args Any arguments originally passed to the test helper.
* @returns {Promise<void>} A promise representing the serial invocation of the hooks.
*/
function runHooks(helperName, label, ...args) {
	const hooks = registeredHooks.get(getHelperKey(helperName, label)) || /* @__PURE__ */ new Set();
	const promises = [];
	hooks.forEach((hook) => {
		const hookResult = hook(...args);
		promises.push(hookResult);
	});
	return Promise.all(promises).then(() => {});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/debug-info-helpers.js
var debugInfoHelpers = /* @__PURE__ */ new Set();
/**
* Registers a custom debug info helper to augment the output for test isolation validation.
*
* @public
* @param {DebugInfoHelper} debugHelper a custom debug info helper
* @example
*
* import { registerDebugInfoHelper } from '@ember/test-helpers';
*
* registerDebugInfoHelper({
*   name: 'Date override detection',
*   log() {
*     if (dateIsOverridden()) {
*       console.log(this.name);
*       console.log('The date object has been overridden');
*     }
*   }
* })
*/
function registerDebugInfoHelper(debugHelper) {
	debugInfoHelpers.add(debugHelper);
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/debug-info.js
var PENDING_AJAX_REQUESTS = "Pending AJAX requests";
var PENDING_TEST_WAITERS = "Pending test waiters";
var SCHEDULED_ASYNC = "Scheduled async";
var SCHEDULED_AUTORUN = "Scheduled autorun";
/**
* The base functionality which may be present on the `SettledState` interface
* in the `settled` module (**not** the one in this module).
*/
/**
* Determines if the `getDebugInfo` method is available in the
* running verison of backburner.
*
* @returns {boolean} True if `getDebugInfo` is present in backburner, otherwise false.
*/
function backburnerDebugInfoAvailable() {
	return typeof _backburner.getDebugInfo === "function";
}
/**
* Retrieves debug information from backburner's current deferred actions queue (runloop instance).
* If the `getDebugInfo` method isn't available, it returns `null`.
*
* @public
* @returns {MaybeDebugInfo | null} Backburner debugInfo or, if the getDebugInfo method is not present, null
*/
function getDebugInfo() {
	return _backburner.DEBUG === true && backburnerDebugInfoAvailable() ? _backburner.getDebugInfo() : null;
}
/**
* Encapsulates debug information for an individual test. Aggregates information
* from:
* - info provided by getSettledState
*    - hasPendingTimers
*    - hasRunLoop
*    - hasPendingWaiters
*    - hasPendingRequests
* - info provided by backburner's getDebugInfo method (timers, schedules, and stack trace info)
*
*/
var TestDebugInfo = class {
	_settledState;
	_debugInfo;
	_summaryInfo = void 0;
	constructor(settledState, debugInfo = getDebugInfo()) {
		this._settledState = settledState;
		this._debugInfo = debugInfo;
	}
	get summary() {
		if (!this._summaryInfo) {
			this._summaryInfo = { ...this._settledState };
			if (this._debugInfo) {
				this._summaryInfo.autorunStackTrace = this._debugInfo.autorun && this._debugInfo.autorun.stack;
				this._summaryInfo.pendingTimersCount = this._debugInfo.timers.length;
				this._summaryInfo.hasPendingTimers = this._settledState.hasPendingTimers && this._summaryInfo.pendingTimersCount > 0;
				this._summaryInfo.pendingTimersStackTraces = this._debugInfo.timers.map((timer) => timer.stack);
				this._summaryInfo.pendingScheduledQueueItemCount = this._debugInfo.instanceStack.filter(isNotNullable).reduce((total, item) => {
					Object.values(item).forEach((queueItems) => {
						total += queueItems?.length ?? 0;
					});
					return total;
				}, 0);
				this._summaryInfo.pendingScheduledQueueItemStackTraces = this._debugInfo.instanceStack.filter(isNotNullable).reduce((stacks, deferredActionQueues) => {
					Object.values(deferredActionQueues).forEach((queueItems) => {
						queueItems?.forEach((queueItem) => queueItem.stack && stacks.push(queueItem.stack));
					});
					return stacks;
				}, []);
			}
			if (this._summaryInfo.hasPendingTestWaiters) this._summaryInfo.pendingTestWaiterInfo = getPendingWaiterState();
		}
		return this._summaryInfo;
	}
	toConsole(_console = console) {
		const summary = this.summary;
		if (summary.hasPendingRequests) _console.log(PENDING_AJAX_REQUESTS);
		if (summary.hasPendingLegacyWaiters) _console.log(PENDING_TEST_WAITERS);
		if (summary.hasPendingTestWaiters) {
			if (!summary.hasPendingLegacyWaiters) _console.log(PENDING_TEST_WAITERS);
			Object.keys(summary.pendingTestWaiterInfo.waiters).forEach((waiterName) => {
				const waiterDebugInfo = summary.pendingTestWaiterInfo.waiters[waiterName];
				if (Array.isArray(waiterDebugInfo)) {
					_console.group(waiterName);
					waiterDebugInfo.forEach((debugInfo) => {
						_console.log(`${debugInfo.label ? debugInfo.label : "stack"}: ${debugInfo.stack}`);
					});
					_console.groupEnd();
				} else _console.log(waiterName);
			});
		}
		if (summary.hasPendingTimers || summary.pendingScheduledQueueItemCount > 0) {
			_console.group(SCHEDULED_ASYNC);
			summary.pendingTimersStackTraces.forEach((timerStack) => {
				_console.log(timerStack);
			});
			summary.pendingScheduledQueueItemStackTraces.forEach((scheduleQueueItemStack) => {
				_console.log(scheduleQueueItemStack);
			});
			_console.groupEnd();
		}
		if (summary.hasRunLoop && summary.pendingTimersCount === 0 && summary.pendingScheduledQueueItemCount === 0) {
			_console.log(SCHEDULED_AUTORUN);
			if (summary.autorunStackTrace) _console.log(summary.autorunStackTrace);
		}
		debugInfoHelpers.forEach((helper) => {
			helper.log();
		});
	}
	_formatCount(title, count) {
		return `${title}: ${count}`;
	}
};
function isNotNullable(value) {
	return value != null;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/setup-context-DegmztrF.js
var CAN_USE_ROUTER_EVENTS = hasEmberVersion(3, 6);
var routerTransitionsPending = null;
var ROUTER = /* @__PURE__ */ new WeakMap();
var HAS_SETUP_ROUTER = /* @__PURE__ */ new WeakMap();
function isApplicationTestContext(context) {
	return isTestContext(context);
}
/**
Determines if we have any pending router transitions (used to determine `settled` state)

@public
@returns {(boolean|null)} if there are pending transitions
*/
function hasPendingTransitions() {
	if (CAN_USE_ROUTER_EVENTS) return routerTransitionsPending;
	const context = getContext();
	if (context === void 0) return null;
	const router = ROUTER.get(context);
	if (router === void 0) return null;
	const routerMicrolib = router._routerMicrolib || router.router;
	if (routerMicrolib === void 0) return null;
	return !!routerMicrolib.activeTransition;
}
/**
Setup the current router instance with settledness tracking. Generally speaking this
is done automatically (during a `visit('/some-url')` invocation), but under some
circumstances (e.g. a non-application test where you manually call `this.owner.setupRouter()`)
you may want to call it yourself.

@public
*/
function setupRouterSettlednessTracking() {
	const context = getContext();
	if (context === void 0 || !isTestContext(context)) throw new Error("Cannot setupRouterSettlednessTracking outside of a test context");
	if (HAS_SETUP_ROUTER.get(context)) return;
	HAS_SETUP_ROUTER.set(context, true);
	const { owner } = context;
	let router;
	if (CAN_USE_ROUTER_EVENTS) {
		router = owner.lookup("service:router");
		router.on("routeWillChange", () => routerTransitionsPending = true);
		router.on("routeDidChange", () => routerTransitionsPending = false);
	} else {
		router = owner.lookup("router:main");
		ROUTER.set(context, router);
	}
	const ORIGINAL_WILL_DESTROY = router.willDestroy;
	router.willDestroy = function() {
		routerTransitionsPending = null;
		return ORIGINAL_WILL_DESTROY.call(this);
	};
}
/**
Navigate the application to the provided URL.

@public
@param {string} url The URL to visit (e.g. `/posts`)
@param {object} options app boot options
@returns {Promise<void>} resolves when settled

@example
<caption>
Visiting the route for post 1.
</caption>
await visit('/posts/1');

@example
<caption>
Visiting the route for post 1 while also providing the `rootElement` app boot option.
</caption>
await visit('/', { rootElement: '#container' });
*/
function visit(url, options) {
	const context = getContext();
	if (!context || !isApplicationTestContext(context)) throw new Error("Cannot call `visit` without having first called `setupApplicationContext`.");
	const { owner } = context;
	getTestMetadata(context).usedHelpers.push("visit");
	return Promise.resolve().then(() => {
		return runHooks("visit", "start", url, options);
	}).then(() => {
		const visitResult = owner.visit(url, options);
		setupRouterSettlednessTracking();
		return visitResult;
	}).then(() => {
		context.element = document.querySelector("#ember-testing");
	}).then(settled).then(() => {
		return runHooks("visit", "end", url, options);
	});
}
/**
@public
@returns {string} the currently active route name
*/
function currentRouteName() {
	const context = getContext();
	if (!context || !isApplicationTestContext(context)) throw new Error("Cannot call `currentRouteName` without having first called `setupApplicationContext`.");
	return context.owner.lookup("router:main").currentRouteName;
}
var HAS_CURRENT_URL_ON_ROUTER = hasEmberVersion(2, 13);
/**
@public
@returns {string} the applications current url
*/
function currentURL() {
	const context = getContext();
	if (!context || !isApplicationTestContext(context)) throw new Error("Cannot call `currentURL` without having first called `setupApplicationContext`.");
	const router = context.owner.lookup("router:main");
	if (HAS_CURRENT_URL_ON_ROUTER) {
		const routerCurrentURL = router.currentURL;
		if (routerCurrentURL === null) return routerCurrentURL;
		return routerCurrentURL;
	} else return router.location.getURL();
}
/**
Used by test framework addons to setup the provided context for working with
an application (e.g. routing).

`setupContext` must have been run on the provided context prior to calling
`setupApplicationContext`.

Sets up the basic framework used by application tests.

@public
@param {Object} context the context to setup
@returns {Promise<void>} resolves when the context is set up
*/
function setupApplicationContext(context) {
	getTestMetadata(context).setupTypes.push("setupApplicationContext");
	return Promise.resolve();
}
var requests;
var checkWaiters = Test.checkWaiters;
/**
@private
@returns {number} the count of pending requests
*/
function pendingRequests() {
	return requests !== void 0 ? requests.length : 0;
}
/**
@private
@param {Event} event (unused)
@param {XMLHTTPRequest} xhr the XHR that has initiated a request
*/
function incrementAjaxPendingRequests(event, xhr) {
	requests.push(xhr);
}
/**
@private
@param {Event} event (unused)
@param {XMLHTTPRequest} xhr the XHR that has initiated a request
*/
function decrementAjaxPendingRequests(event, xhr) {
	nextTick(() => {
		for (let i = 0; i < requests.length; i++) if (xhr === requests[i]) requests.splice(i, 1);
	});
}
/**
Clears listeners that were previously setup for `ajaxSend` and `ajaxComplete`.

@private
*/
function _teardownAJAXHooks() {
	requests = [];
	if (typeof globalThis.jQuery === "undefined") return;
	globalThis.jQuery(document).off("ajaxSend", incrementAjaxPendingRequests);
	globalThis.jQuery(document).off("ajaxComplete", decrementAjaxPendingRequests);
}
/**
Sets up listeners for `ajaxSend` and `ajaxComplete`.

@private
*/
function _setupAJAXHooks() {
	requests = [];
	if (typeof globalThis.jQuery === "undefined") return;
	globalThis.jQuery(document).on("ajaxSend", incrementAjaxPendingRequests);
	globalThis.jQuery(document).on("ajaxComplete", decrementAjaxPendingRequests);
}
/**
Check various settledness metrics, and return an object with the following properties:

- `hasRunLoop` - Checks if a run-loop has been started. If it has, this will
be `true` otherwise it will be `false`.
- `hasPendingTimers` - Checks if there are scheduled timers in the run-loop.
These pending timers are primarily registered by `Ember.run.schedule`. If
there are pending timers, this will be `true`, otherwise `false`.
- `hasPendingWaiters` - Checks if any registered test waiters are still
pending (e.g. the waiter returns `true`). If there are pending waiters,
this will be `true`, otherwise `false`.
- `hasPendingRequests` - Checks if there are pending AJAX requests (based on
`ajaxSend` / `ajaxComplete` events triggered by `jQuery.ajax`). If there
are pending requests, this will be `true`, otherwise `false`.
- `hasPendingTransitions` - Checks if there are pending route transitions. If the
router has not been instantiated / setup for the test yet this will return `null`,
if there are pending transitions, this will be `true`, otherwise `false`.
- `pendingRequestCount` - The count of pending AJAX requests.
- `debugInfo` - Debug information that's combined with info return from backburner's
getDebugInfo method.
- `isRenderPending` - Checks if there are any pending render operations. This will be true as long
as there are tracked values in the template that have not been rerendered yet.

@public
@returns {Object} object with properties for each of the metrics used to determine settledness
*/
function getSettledState() {
	const hasPendingTimers = _backburner.hasTimers();
	const hasRunLoop = Boolean(_backburner.currentInstance);
	const hasPendingLegacyWaiters = checkWaiters();
	const hasPendingTestWaiters = hasPendingWaiters();
	const pendingRequestCount = pendingRequests();
	const hasPendingRequests = pendingRequestCount > 0;
	const isRenderPending = !!hasRunLoop;
	return {
		hasPendingTimers,
		hasRunLoop,
		hasPendingWaiters: hasPendingLegacyWaiters || hasPendingTestWaiters,
		hasPendingRequests,
		hasPendingTransitions: hasPendingTransitions(),
		isRenderPending,
		pendingRequestCount,
		debugInfo: new TestDebugInfo({
			hasPendingTimers,
			hasRunLoop,
			hasPendingLegacyWaiters,
			hasPendingTestWaiters,
			hasPendingRequests,
			isRenderPending
		})
	};
}
/**
Checks various settledness metrics (via `getSettledState()`) to determine if things are settled or not.

Settled generally means that there are no pending timers, no pending waiters,
no pending AJAX requests, and no current run loop. However, new settledness
metrics may be added and used as they become available.

@public
@returns {boolean} `true` if settled, `false` otherwise
*/
function isSettled() {
	const { hasPendingTimers, hasRunLoop, hasPendingRequests, hasPendingWaiters, hasPendingTransitions, isRenderPending } = getSettledState();
	if (hasPendingTimers || hasRunLoop || hasPendingRequests || hasPendingWaiters || hasPendingTransitions || isRenderPending) return false;
	return true;
}
/**
Returns a promise that resolves when in a settled state (see `isSettled` for
a definition of "settled state").

@public
@returns {Promise<void>} resolves when settled
*/
function settled() {
	return waitUntil(isSettled, { timeout: Infinity }).then(() => {});
}
var cachedOnerror = /* @__PURE__ */ new Map();
/**
* Sets the `Ember.onerror` function for tests. This value is intended to be reset after
* each test to ensure correct test isolation. To reset, you should simply call `setupOnerror`
* without an `onError` argument.
*
* @public
* @param {Function} onError the onError function to be set on Ember.onerror
*
* @example <caption>Example implementation for `ember-qunit` or `ember-mocha`</caption>
*
* import { setupOnerror } from '@ember/test-helpers';
*
* test('Ember.onerror is stubbed properly', function(assert) {
*   setupOnerror(function(err) {
*     assert.ok(err);
*   });
* });
*/
function setupOnerror(onError) {
	const context = getContext();
	if (!context) throw new Error("Must setup test context before calling setupOnerror");
	if (!cachedOnerror.has(context)) throw new Error("_cacheOriginalOnerror must be called before setupOnerror. Normally, this will happen as part of your test harness.");
	if (typeof onError !== "function") onError = cachedOnerror.get(context);
	setOnerror(onError);
}
/**
* Resets `Ember.onerror` to the value it originally was at the start of the test run.
* If there is no context or cached value this is a no-op.
*
* @public
*
* @example
*
* import { resetOnerror } from '@ember/test-helpers';
*
* QUnit.testDone(function() {
*   resetOnerror();
* })
*/
function resetOnerror() {
	const context = getContext();
	if (context && cachedOnerror.has(context)) setOnerror(cachedOnerror.get(context));
}
/**
* Caches the current value of Ember.onerror. When `setupOnerror` is called without a value
* or when `resetOnerror` is called the value will be set to what was cached here.
*
* @private
* @param {BaseContext} context the text context
*/
function _prepareOnerror(context) {
	if (cachedOnerror.has(context)) throw new Error("_prepareOnerror should only be called once per-context");
	cachedOnerror.set(context, getOnerror());
}
/**
* Removes the cached value of Ember.onerror.
*
* @private
* @param {BaseContext} context the text context
*/
function _cleanupOnerror(context) {
	resetOnerror();
	cachedOnerror.delete(context);
}
registerHandler((message, options, next) => {
	const context = getContext();
	if (context === void 0) {
		next.apply(null, [message, options]);
		return;
	}
	getDeprecationsForContext(context).push({
		message,
		options
	});
	next.apply(null, [message, options]);
});
registerHandler$1((message, options, next) => {
	const context = getContext();
	if (context === void 0) {
		next.apply(null, [message, options]);
		return;
	}
	getWarningsForContext(context).push({
		message,
		options
	});
	next.apply(null, [message, options]);
});
/**
* The public API for the test context, which test authors can depend on being
* available.
*
* Note: this is *not* user-constructible; it becomes available by calling
* `setupContext()` with a base context object.
*/
function isTestContext(context) {
	const maybeContext = context;
	return typeof maybeContext["pauseTest"] === "function" && typeof maybeContext["resumeTest"] === "function";
}
/**
@private
@param {Object} it the global object to test
@returns {Boolean} it exists
*/
function check(it) {
	return it && it.Math === Math && it;
}
var globalObject = check(typeof globalThis == "object" && globalThis) || check(typeof window === "object" && window) || check(typeof self === "object" && self) || check(typeof global$1 === "object" && global$1);
/**
Stores the provided context as the "global testing context".

Generally setup automatically by `setupContext`.

@public
@param {Object} context the context to use
*/
function setContext(context) {
	globalObject.__test_context__ = context;
}
/**
Retrieve the "global testing context" as stored by `setContext`.

@public
@returns {Object} the previously stored testing context
*/
function getContext() {
	return globalObject.__test_context__;
}
/**
Clear the "global testing context".

Generally invoked from `teardownContext`.

@public
*/
function unsetContext() {
	globalObject.__test_context__ = void 0;
}
/**
* Returns a promise to be used to pauses the current test (due to being
* returned from the test itself).  This is useful for debugging while testing
* or for test-driving.  It allows you to inspect the state of your application
* at any point.
*
* The test framework wrapper (e.g. `ember-qunit` or `ember-mocha`) should
* ensure that when `pauseTest()` is used, any framework specific test timeouts
* are disabled.
*
* @public
* @returns {Promise<void>} resolves _only_ when `resumeTest()` is invoked
* @example <caption>Usage via ember-qunit</caption>
*
* import { setupRenderingTest } from 'ember-qunit';
* import { render, click, pauseTest } from '@ember/test-helpers';
*
*
* module('awesome-sauce', function(hooks) {
*   setupRenderingTest(hooks);
*
*   test('does something awesome', async function(assert) {
*     await render(hbs`{{awesome-sauce}}`);
*
*     // added here to visualize / interact with the DOM prior
*     // to the interaction below
*     await pauseTest();
*
*     click('.some-selector');
*
*     assert.equal(this.element.textContent, 'this sauce is awesome!');
*   });
* });
*/
function pauseTest() {
	const context = getContext();
	if (!context || !isTestContext(context)) throw new Error("Cannot call `pauseTest` without having first called `setupTest` or `setupRenderingTest`.");
	return context.pauseTest();
}
/**
Resumes a test previously paused by `await pauseTest()`.

@public
*/
function resumeTest() {
	const context = getContext();
	if (!context || !isTestContext(context)) throw new Error("Cannot call `resumeTest` without having first called `setupTest` or `setupRenderingTest`.");
	context.resumeTest();
}
/**
* Returns deprecations which have occurred so far for a the current test context
*
* @public
* @returns {Array<DeprecationFailure>} An array of deprecation messages
* @example <caption>Usage via ember-qunit</caption>
*
* import { getDeprecations } from '@ember/test-helpers';
*
* module('awesome-sauce', function(hooks) {
*   setupRenderingTest(hooks);
*
*   test('does something awesome', function(assert) {
const deprecations = getDeprecations() // => returns deprecations which have occurred so far in this test
*   });
* });
*/
function getDeprecations() {
	const context = getContext();
	if (!context) throw new Error("[@ember/test-helpers] could not get deprecations if no test context is currently active");
	return getDeprecationsForContext(context);
}
/**
* Returns deprecations which have occurred so far for a the current test context
*
* @public
* @param {Function} [callback] The callback that when executed will have its DeprecationFailure recorded
* @returns {Array<DeprecationFailure> | Promise<Array<DeprecationFailure>>} An array of deprecation messages
* @example <caption>Usage via ember-qunit</caption>
*
* import { getDeprecationsDuringCallback } from '@ember/test-helpers';
*
* module('awesome-sauce', function(hooks) {
*   setupRenderingTest(hooks);
*
*   test('does something awesome', function(assert) {
*     const deprecations = getDeprecationsDuringCallback(() => {
*       // code that might emit some deprecations
*
*     }); // => returns deprecations which occurred while the callback was invoked
*   });
*
*
*   test('does something awesome', async function(assert) {
*     const deprecations = await getDeprecationsDuringCallback(async () => {
*       // awaited code that might emit some deprecations
*     }); // => returns deprecations which occurred while the callback was invoked
*   });
* });
*/
function getDeprecationsDuringCallback(callback) {
	const context = getContext();
	if (!context) throw new Error("[@ember/test-helpers] could not get deprecations if no test context is currently active");
	return getDeprecationsDuringCallbackForContext(context, callback);
}
/**
* Returns warnings which have occurred so far for a the current test context
*
* @public
* @returns {Array<Warning>} An array of warnings
* @example <caption>Usage via ember-qunit</caption>
*
* import { getWarnings } from '@ember/test-helpers';
*
* module('awesome-sauce', function(hooks) {
*   setupRenderingTest(hooks);
*
*   test('does something awesome', function(assert) {
const warnings = getWarnings() // => returns warnings which have occurred so far in this test
*   });
* });
*/
function getWarnings() {
	const context = getContext();
	if (!context) throw new Error("[@ember/test-helpers] could not get warnings if no test context is currently active");
	return getWarningsForContext(context);
}
/**
* Returns warnings which have occurred so far for a the current test context
*
* @public
* @param {Function} [callback] The callback that when executed will have its warnings recorded
* @returns {Array<Warning> | Promise<Array<Warning>>} An array of warnings information
* @example <caption>Usage via ember-qunit</caption>
*
* import { getWarningsDuringCallback } from '@ember/test-helpers';
* import { warn } from '@ember/debug';
*
* module('awesome-sauce', function(hooks) {
*   setupRenderingTest(hooks);
*
*   test('does something awesome', function(assert) {
*     const warnings = getWarningsDuringCallback(() => {
*     warn('some warning');
*
*     }); // => returns warnings which occurred while the callback was invoked
*   });
*
*   test('does something awesome', async function(assert) {
*     warn('some warning');
*
*     const warnings = await getWarningsDuringCallback(async () => {
*       warn('some other warning');
*     }); // => returns warnings which occurred while the callback was invoked
*   });
* });
*/
function getWarningsDuringCallback(callback) {
	const context = getContext();
	if (!context) throw new Error("[@ember/test-helpers] could not get warnings if no test context is currently active");
	return getWarningsDuringCallbackForContext(context, callback);
}
/**
Used by test framework addons to setup the provided context for testing.

Responsible for:

- sets the "global testing context" to the provided context (`setContext`)
- create an owner object and set it on the provided context (e.g. `this.owner`)
- setup `this.set`, `this.setProperties`, `this.get`, and `this.getProperties` to the provided context
- setting up AJAX listeners
- setting up `pauseTest` (also available as `this.pauseTest()`) and `resumeTest` helpers

@public
@param {Object} base the context to setup
@param {Object} [options] options used to override defaults
@param {Resolver} [options.resolver] a resolver to use for customizing normal resolution
@returns {Promise<Object>} resolves with the context that was setup
*/
function setupContext(base, options = {}) {
	const context = base;
	setTesting(true);
	setContext(context);
	getTestMetadata(context).setupTypes.push("setupContext");
	_backburner.DEBUG = true;
	_prepareOnerror(context);
	return Promise.resolve().then(() => {
		const application = getApplication();
		if (application) return application.boot().then(() => {});
	}).then(() => {
		const { resolver } = options;
		if (resolver) return buildOwner(null, resolver);
		return buildOwner(getApplication(), getResolver());
	}).then((owner) => {
		Object.defineProperty(context, "owner", {
			configurable: true,
			enumerable: true,
			value: owner,
			writable: false
		});
		setOwner(context, owner);
		Object.defineProperty(context, "set", {
			configurable: true,
			enumerable: true,
			value(key, value) {
				return run(function() {
					return set(context, key, value);
				});
			},
			writable: false
		});
		Object.defineProperty(context, "setProperties", {
			configurable: true,
			enumerable: true,
			value(hash) {
				return run(function() {
					return setProperties(context, hash);
				});
			},
			writable: false
		});
		Object.defineProperty(context, "get", {
			configurable: true,
			enumerable: true,
			value(key) {
				return get(context, key);
			},
			writable: false
		});
		Object.defineProperty(context, "getProperties", {
			configurable: true,
			enumerable: true,
			value(...args) {
				return getProperties(context, args);
			},
			writable: false
		});
		let resume;
		context["resumeTest"] = function resumeTest() {
			resume();
			global$1.resumeTest = resume = void 0;
		};
		context["pauseTest"] = function pauseTest() {
			console.info("Testing paused. Use `resumeTest()` to continue.");
			return new Promise((resolve) => {
				resume = resolve;
				global$1.resumeTest = resumeTest;
			});
		};
		_setupAJAXHooks();
		return context;
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/teardown-context.js
/**
Used by test framework addons to tear down the provided context after testing is completed.

Responsible for:

- un-setting the "global testing context" (`unsetContext`)
- destroy the contexts owner object
- remove AJAX listeners

@public
@param {Object} context the context to setup
@param {Object} [options] options used to override defaults
@param {boolean} [options.waitForSettled=true] should the teardown wait for `settled()`ness
@returns {Promise<void>} resolves when settled
*/
function teardownContext(context, { waitForSettled = true } = {}) {
	return Promise.resolve().then(() => {
		_cleanupOnerror(context);
		_teardownAJAXHooks();
		setTesting(false);
		unsetContext();
		destroy(context.owner);
	}).finally(() => {
		if (waitForSettled) return settled();
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/get-root-element.js
/**
Get the root element of the application under test (usually `#ember-testing`)

@public
@returns {Element} the root element

@example
<caption>
Getting the root element of the application and checking that it is equal
to the element with id 'ember-testing'.
</caption>
assert.equal(getRootElement(), document.querySelector('#ember-testing'));
*/
function getRootElement() {
	const context = getContext();
	if (!context || !isTestContext(context) || !context.owner) throw new Error("Must setup rendering context before attempting to interact with elements.");
	const owner = context.owner;
	let rootElement;
	if (owner && owner._emberTestHelpersMockOwner === void 0) rootElement = owner.rootElement;
	else rootElement = "#ember-testing";
	if (rootElement instanceof Window) rootElement = rootElement.document;
	if (isElement(rootElement) || isDocument(rootElement)) return rootElement;
	else if (typeof rootElement === "string") {
		const _rootElement = document.querySelector(rootElement);
		if (_rootElement) return _rootElement;
		throw new Error(`Application.rootElement (${rootElement}) not found`);
	} else throw new Error("Application.rootElement must be an element or a selector string");
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-internal/is-component.js
/**
* We should ultimately get a new API from @glimmer/runtime that provides this functionality
* (see https://github.com/emberjs/rfcs/pull/785 for more info).
* @private
* @param {Object} maybeComponent The thing you think might be a component
* @returns {boolean} True if it's a component, false if not
*/
function isComponent(maybeComponent) {
	return !!getInternalComponentManager(maybeComponent, true);
}
var renderComponent$1 = esCompat(renderer_exports).renderComponent;
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/setup-rendering-context.js
var OUTLET_TEMPLATE = templateFactory({
	"id": null,
	"block": "[[[46,[28,[37,1],null,null],null,null,null]],[],[\"component\",\"-outlet\"]]",
	"moduleName": "(unknown template module)",
	"isStrictMode": false
});
var EMPTY_TEMPLATE = templateFactory({
	"id": null,
	"block": "[[],[],[]]",
	"moduleName": "(unknown template module)",
	"isStrictMode": false
});
var INVOKE_PROVIDED_COMPONENT = templateFactory({
	"id": null,
	"block": "[[[8,[30,0,[\"ProvidedComponent\"]],null,null,null]],[],[]]",
	"moduleName": "(unknown template module)",
	"isStrictMode": false
});
var hasCalledSetupRenderingContext = Symbol();
function prepare(context) {
	context[hasCalledSetupRenderingContext] = true;
	return context;
}
function isRenderingTestContext(context) {
	return isTestContext(context) && hasCalledSetupRenderingContext in context;
}
function supportsRenderRootComponent(owner) {
	return typeof owner.renderRootComponent === "function";
}
/**
@private
@param {Ember.ApplicationInstance} owner the current owner instance
@param {string} templateFullName the fill template name
@returns {Template} the template representing `templateFullName`
*/
function lookupTemplate(owner, templateFullName) {
	const template = owner.lookup(templateFullName);
	if (typeof template === "function") return template(owner);
	return template;
}
/**
@private
@param {Ember.ApplicationInstance} owner the current owner instance
@returns {Template} a template representing {{outlet}}
*/
function lookupOutletTemplate(owner) {
	let OutletTemplate = lookupTemplate(owner, "template:-outlet");
	if (!OutletTemplate) {
		owner.register("template:-outlet", OUTLET_TEMPLATE);
		OutletTemplate = lookupTemplate(owner, "template:-outlet");
	}
	return OutletTemplate;
}
var templateId = 0;
var renderContextManager = {
	capabilities: componentCapabilities("3.13", {
		destructor: false,
		asyncLifecycleCallbacks: false
	}),
	createComponent(definition) {
		return definition.context;
	},
	getContext(context) {
		return context;
	}
};
function contextComponentFor(templateFactoryOrComponent, context) {
	const definition = { context };
	setComponentManager(() => renderContextManager, definition);
	setComponentTemplate(templateFactoryOrComponent, definition);
	return definition;
}
/**
Render `component` into the testing root element using the `renderComponent`
*/
function renderViaRenderComponent(owner, context, templateFactoryOrComponent, options) {
	let component;
	if (isComponent(templateFactoryOrComponent)) component = templateFactoryOrComponent;
	else component = contextComponentFor(templateFactoryOrComponent, context);
	const ownerToRenderFrom = options?.owner || owner;
	if (ownerToRenderFrom === owner && typeof owner.renderRootComponent === "function") schedule("render", () => owner.renderRootComponent(component));
	else schedule("render", () => renderComponent$1(component, {
		into: getRootElement(),
		owner: ownerToRenderFrom
	}));
}
/**
Renders using the private, legacy `view:-outlet`
*/
function renderLegacyOutlet(owner, context, templateFactoryOrComponent, options) {
	const toplevelView = owner.lookup("-top-level-view:main");
	const OutletTemplate = lookupOutletTemplate(owner);
	const ownerToRenderFrom = options?.owner || owner;
	let renderContext = context;
	let toRender = templateFactoryOrComponent;
	if (isComponent(toRender)) {
		renderContext = { ProvidedComponent: toRender };
		toRender = INVOKE_PROVIDED_COMPONENT;
	}
	templateId += 1;
	const templateFullName = `template:-undertest-${templateId}`;
	ownerToRenderFrom.register(templateFullName, toRender);
	const template = lookupTemplate(ownerToRenderFrom, templateFullName);
	const outletState = {
		render: {
			owner,
			into: void 0,
			outlet: "main",
			name: "application",
			controller: void 0,
			ViewClass: void 0,
			template: OutletTemplate
		},
		outlets: { main: {
			render: {
				owner: ownerToRenderFrom,
				into: void 0,
				outlet: "main",
				name: "index",
				controller: renderContext,
				ViewClass: void 0,
				template,
				outlets: {}
			},
			outlets: {}
		} }
	};
	toplevelView.setOutletState(outletState);
}
/**
Renders the provided template and appends it to the DOM.

@public
@param {Template|Component} templateFactoryOrComponent the component (or template) to render
@param {RenderOptions} options options hash containing engine owner ({ owner: engineOwner })
@returns {Promise<void>} resolves when settled

@example
<caption>
Render a div element with the class 'container'.
</caption>
await render(hbs`<div class="container"></div>`);
*/
function render(templateFactoryOrComponent, options) {
	const context = getContext();
	if (!templateFactoryOrComponent) throw new Error("you must pass a template to `render()`");
	return Promise.resolve().then(() => runHooks("render", "start")).then(() => {
		if (!context || !isRenderingTestContext(context)) throw new Error("Cannot call `render` without having first called `setupRenderingContext`.");
		const { owner } = context;
		getTestMetadata(context).usedHelpers.push("render");
		if (renderComponent$1) renderViaRenderComponent(owner, context, templateFactoryOrComponent, options);
		else renderLegacyOutlet(owner, context, templateFactoryOrComponent, options);
		return settled();
	}).then(() => runHooks("render", "end"));
}
/**
Clears any templates previously rendered. This is commonly used for
confirming behavior that is triggered by teardown (e.g.
`willDestroyElement`).

@public
@returns {Promise<void>} resolves when settled
*/
function clearRender() {
	const context = getContext();
	if (!context || !isRenderingTestContext(context)) throw new Error("Cannot call `clearRender` without having first called `setupRenderingContext`.");
	return render(EMPTY_TEMPLATE);
}
/**
Used by test framework addons to setup the provided context for rendering.

`setupContext` must have been ran on the provided context
prior to calling `setupRenderingContext`.

Responsible for:

- Setup the basic framework used for rendering by the
`render` helper.
- Ensuring the event dispatcher is properly setup.
- Setting `this.element` to the root element of the testing
container (things rendered via `render` will go _into_ this
element).

@public
@param {TestContext} context the context to setup for rendering
@returns {Promise<RenderingTestContext>} resolves with the context that was setup

@example
<caption>
Rendering out a paragraph element containing the content 'hello', and then clearing that content via clearRender.
</caption>

await render(hbs`<p>Hello!</p>`);
assert.equal(this.element.textContent, 'Hello!', 'has rendered content');
await clearRender();
assert.equal(this.element.textContent, '', 'has rendered content');
*/
function setupRenderingContext(context) {
	getTestMetadata(context).setupTypes.push("setupRenderingContext");
	const renderingContext = prepare(context);
	return Promise.resolve().then(() => {
		const { owner } = renderingContext;
		if (owner._emberTestHelpersMockOwner) (owner.lookup("event_dispatcher:main") || EventDispatcher.create()).setup({}, "#ember-testing");
		if (renderComponent$1) {
			if (supportsRenderRootComponent(owner)) owner.rootElement = getRootElement();
			return render(EMPTY_TEMPLATE);
		}
		const OutletView = owner.factoryFor ? owner.factoryFor("view:-outlet") : owner._lookupFactory("view:-outlet");
		const environment = owner.lookup("-environment:main");
		const template = owner.lookup("template:-outlet");
		const toplevelView = OutletView.create({
			template,
			environment
		});
		owner.register("-top-level-view:main", { create() {
			return toplevelView;
		} });
		return render(EMPTY_TEMPLATE).then(() => {
			run(toplevelView, "appendTo", getRootElement());
			return settled();
		});
	}).then(() => {
		Object.defineProperty(renderingContext, "element", {
			configurable: true,
			enumerable: true,
			value: getRootElement(),
			writable: false
		});
		return renderingContext;
	});
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@simple-dom/document/index.js
var EMPTY_ATTRS = [];
function indexOfAttribute(attributes, namespaceURI, localName) {
	for (let i = 0; i < attributes.length; i++) {
		const attr = attributes[i];
		if (attr.namespaceURI === namespaceURI && attr.localName === localName) return i;
	}
	return -1;
}
function adjustAttrName(namespaceURI, localName) {
	return namespaceURI === "http://www.w3.org/1999/xhtml" ? localName.toLowerCase() : localName;
}
function getAttribute(attributes, namespaceURI, localName) {
	const index = indexOfAttribute(attributes, namespaceURI, localName);
	return index === -1 ? null : attributes[index].value;
}
function removeAttribute(attributes, namespaceURI, localName) {
	const index = indexOfAttribute(attributes, namespaceURI, localName);
	if (index !== -1) attributes.splice(index, 1);
}
function setAttribute(element, namespaceURI, prefix, localName, value) {
	if (typeof value !== "string") value = "" + value;
	let { attributes } = element;
	if (attributes === EMPTY_ATTRS) attributes = element.attributes = [];
	else {
		const index = indexOfAttribute(attributes, namespaceURI, localName);
		if (index !== -1) {
			attributes[index].value = value;
			return;
		}
	}
	attributes.push({
		localName,
		name: prefix === null ? localName : prefix + ":" + localName,
		namespaceURI,
		prefix,
		specified: true,
		value
	});
}
var ChildNodes = class {
	constructor(node) {
		this.node = node;
		this.stale = true;
		this._length = 0;
	}
	get length() {
		if (this.stale) {
			this.stale = false;
			let len = 0;
			let child = this.node.firstChild;
			for (; child !== null; len++) {
				this[len] = child;
				child = child.nextSibling;
			}
			const oldLen = this._length;
			this._length = len;
			for (; len < oldLen; len++) delete this[len];
		}
		return this._length;
	}
	item(index) {
		return index < this.length ? this[index] : null;
	}
};
function cloneNode(node, deep) {
	const clone = nodeFrom(node);
	if (deep) {
		let child = node.firstChild;
		let nextChild = child;
		while (child !== null) {
			nextChild = child.nextSibling;
			clone.appendChild(child.cloneNode(true));
			child = nextChild;
		}
	}
	return clone;
}
function nodeFrom(node) {
	let namespaceURI;
	if (node.nodeType === 1) namespaceURI = node.namespaceURI;
	const clone = new SimpleNodeImpl(node.ownerDocument, node.nodeType, node.nodeName, node.nodeValue, namespaceURI);
	if (node.nodeType === 1) clone.attributes = copyAttrs(node.attributes);
	return clone;
}
function copyAttrs(attrs) {
	if (attrs === EMPTY_ATTRS) return EMPTY_ATTRS;
	const copy = [];
	for (let i = 0; i < attrs.length; i++) {
		const attr = attrs[i];
		copy.push({
			localName: attr.localName,
			name: attr.name,
			namespaceURI: attr.namespaceURI,
			prefix: attr.prefix,
			specified: true,
			value: attr.value
		});
	}
	return copy;
}
function insertBefore(parentNode, newChild, refChild) {
	invalidate(parentNode);
	insertBetween(parentNode, newChild, refChild === null ? parentNode.lastChild : refChild.previousSibling, refChild);
}
function removeChild(parentNode, oldChild) {
	invalidate(parentNode);
	removeBetween(parentNode, oldChild, oldChild.previousSibling, oldChild.nextSibling);
}
function invalidate(parentNode) {
	const childNodes = parentNode._childNodes;
	if (childNodes !== void 0) childNodes.stale = true;
}
function insertBetween(parentNode, newChild, previousSibling, nextSibling) {
	if (newChild.nodeType === 11) {
		insertFragment(newChild, parentNode, previousSibling, nextSibling);
		return;
	}
	if (newChild.parentNode !== null) removeChild(newChild.parentNode, newChild);
	newChild.parentNode = parentNode;
	newChild.previousSibling = previousSibling;
	newChild.nextSibling = nextSibling;
	if (previousSibling === null) parentNode.firstChild = newChild;
	else previousSibling.nextSibling = newChild;
	if (nextSibling === null) parentNode.lastChild = newChild;
	else nextSibling.previousSibling = newChild;
}
function removeBetween(parentNode, oldChild, previousSibling, nextSibling) {
	oldChild.parentNode = null;
	oldChild.previousSibling = null;
	oldChild.nextSibling = null;
	if (previousSibling === null) parentNode.firstChild = nextSibling;
	else previousSibling.nextSibling = nextSibling;
	if (nextSibling === null) parentNode.lastChild = previousSibling;
	else nextSibling.previousSibling = previousSibling;
}
function insertFragment(fragment, parentNode, previousSibling, nextSibling) {
	const firstChild = fragment.firstChild;
	if (firstChild === null) return;
	fragment.firstChild = null;
	fragment.lastChild = null;
	let lastChild = firstChild;
	let newChild = firstChild;
	firstChild.previousSibling = previousSibling;
	if (previousSibling === null) parentNode.firstChild = firstChild;
	else previousSibling.nextSibling = firstChild;
	while (newChild !== null) {
		newChild.parentNode = parentNode;
		lastChild = newChild;
		newChild = newChild.nextSibling;
	}
	lastChild.nextSibling = nextSibling;
	if (nextSibling === null) parentNode.lastChild = lastChild;
	else nextSibling.previousSibling = lastChild;
}
function parseQualifiedName(qualifiedName) {
	let localName = qualifiedName;
	let prefix = null;
	const i = qualifiedName.indexOf(":");
	if (i !== -1) {
		prefix = qualifiedName.slice(0, i);
		localName = qualifiedName.slice(i + 1);
	}
	return [prefix, localName];
}
var SimpleNodeImpl = class SimpleNodeImpl {
	constructor(ownerDocument, nodeType, nodeName, nodeValue, namespaceURI) {
		this.ownerDocument = ownerDocument;
		this.nodeType = nodeType;
		this.nodeName = nodeName;
		this.nodeValue = nodeValue;
		this.namespaceURI = namespaceURI;
		this.parentNode = null;
		this.previousSibling = null;
		this.nextSibling = null;
		this.firstChild = null;
		this.lastChild = null;
		this.attributes = EMPTY_ATTRS;
		/**
		* @internal
		*/
		this._childNodes = void 0;
	}
	get tagName() {
		return this.nodeName;
	}
	get childNodes() {
		let children = this._childNodes;
		if (children === void 0) children = this._childNodes = new ChildNodes(this);
		return children;
	}
	cloneNode(deep) {
		return cloneNode(this, deep === true);
	}
	appendChild(newChild) {
		insertBefore(this, newChild, null);
		return newChild;
	}
	insertBefore(newChild, refChild) {
		insertBefore(this, newChild, refChild);
		return newChild;
	}
	removeChild(oldChild) {
		removeChild(this, oldChild);
		return oldChild;
	}
	insertAdjacentHTML(position, html) {
		const raw = new SimpleNodeImpl(this.ownerDocument, -1, "#raw", html, void 0);
		let parentNode;
		let nextSibling;
		switch (position) {
			case "beforebegin":
				parentNode = this.parentNode;
				nextSibling = this;
				break;
			case "afterbegin":
				parentNode = this;
				nextSibling = this.firstChild;
				break;
			case "beforeend":
				parentNode = this;
				nextSibling = null;
				break;
			case "afterend":
				parentNode = this.parentNode;
				nextSibling = this.nextSibling;
				break;
			default: throw new Error("invalid position");
		}
		if (parentNode === null) throw new Error(`${position} requires a parentNode`);
		insertBefore(parentNode, raw, nextSibling);
	}
	getAttribute(name) {
		const localName = adjustAttrName(this.namespaceURI, name);
		return getAttribute(this.attributes, null, localName);
	}
	getAttributeNS(namespaceURI, localName) {
		return getAttribute(this.attributes, namespaceURI, localName);
	}
	setAttribute(name, value) {
		const localName = adjustAttrName(this.namespaceURI, name);
		setAttribute(this, null, null, localName, value);
	}
	setAttributeNS(namespaceURI, qualifiedName, value) {
		const [prefix, localName] = parseQualifiedName(qualifiedName);
		setAttribute(this, namespaceURI, prefix, localName, value);
	}
	removeAttribute(name) {
		const localName = adjustAttrName(this.namespaceURI, name);
		removeAttribute(this.attributes, null, localName);
	}
	removeAttributeNS(namespaceURI, localName) {
		removeAttribute(this.attributes, namespaceURI, localName);
	}
	get doctype() {
		return this.firstChild;
	}
	get documentElement() {
		return this.lastChild;
	}
	get head() {
		return this.documentElement.firstChild;
	}
	get body() {
		return this.documentElement.lastChild;
	}
	createElement(name) {
		return new SimpleNodeImpl(this, 1, name.toUpperCase(), null, "http://www.w3.org/1999/xhtml");
	}
	createElementNS(namespace, qualifiedName) {
		const nodeName = namespace === "http://www.w3.org/1999/xhtml" ? qualifiedName.toUpperCase() : qualifiedName;
		return new SimpleNodeImpl(this, 1, nodeName, null, namespace);
	}
	createTextNode(text) {
		return new SimpleNodeImpl(this, 3, "#text", text, void 0);
	}
	createComment(text) {
		return new SimpleNodeImpl(this, 8, "#comment", text, void 0);
	}
	/**
	* Backwards compat
	* @deprecated
	*/
	createRawHTMLSection(text) {
		return new SimpleNodeImpl(this, -1, "#raw", text, void 0);
	}
	createDocumentFragment() {
		return new SimpleNodeImpl(this, 11, "#document-fragment", null, void 0);
	}
};
function createHTMLDocument() {
	const document = new SimpleNodeImpl(null, 9, "#document", null, "http://www.w3.org/1999/xhtml");
	const doctype = new SimpleNodeImpl(document, 10, "html", null, "http://www.w3.org/1999/xhtml");
	const html = new SimpleNodeImpl(document, 1, "HTML", null, "http://www.w3.org/1999/xhtml");
	const head = new SimpleNodeImpl(document, 1, "HEAD", null, "http://www.w3.org/1999/xhtml");
	const body = new SimpleNodeImpl(document, 1, "BODY", null, "http://www.w3.org/1999/xhtml");
	html.appendChild(head);
	html.appendChild(body);
	document.appendChild(doctype);
	document.appendChild(html);
	return document;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/node/index.js
var NodeDOMTreeConstruction = class extends DOMTreeConstruction {
	constructor(doc) {
		super(doc || createHTMLDocument());
	}
	setupUselessElement() {}
	insertHTMLBefore(parent, reference, html) {
		let raw = this.document.createRawHTMLSection(html);
		parent.insertBefore(raw, reference);
		return new ConcreteBounds(parent, raw, raw);
	}
	createElement(tag) {
		return this.document.createElement(tag);
	}
	setAttribute(element, name, value) {
		element.setAttribute(name, value);
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/glimmer/index.js
var glimmer_exports = /* @__PURE__ */ __exportAll({
	Component: () => Component,
	DOMChanges: () => DOMChanges,
	DOMTreeConstruction: () => DOMTreeConstruction,
	Helper: () => Helper,
	Input: () => Input,
	LinkTo: () => LinkTo,
	NodeDOMTreeConstruction: () => NodeDOMTreeConstruction,
	OutletView: () => OutletView,
	Renderer: () => Renderer,
	RootTemplate: () => RootTemplate,
	SafeString: () => SafeString,
	Textarea: () => Textarea,
	TrustedHTML: () => TrustedHTML,
	_resetRenderers: () => _resetRenderers,
	componentCapabilities: () => componentCapabilities,
	element: () => element,
	getTemplate: () => getTemplate,
	getTemplates: () => getTemplates,
	hasTemplate: () => hasTemplate,
	helper: () => helper,
	htmlSafe: () => htmlSafe,
	isHTMLSafe: () => isHTMLSafe,
	isSerializationFirstNode: () => isSerializationFirstNode,
	isTrustedHTML: () => isTrustedHTML,
	modifierCapabilities: () => modifierCapabilities,
	renderComponent: () => renderComponent$2,
	renderSettled: () => renderSettled$2,
	setComponentManager: () => setComponentManager,
	setTemplate: () => setTemplate,
	setTemplates: () => setTemplates,
	setupApplicationRegistry: () => setupApplicationRegistry,
	setupEngineRegistry: () => setupEngineRegistry,
	template: () => templateFactory,
	templateCacheCounters: () => templateCacheCounters,
	trustHTML: () => trustHTML,
	uniqueId: () => uniqueId$1
});
var TEMPLATES = {};
function setTemplates(templates) {
	TEMPLATES = templates;
}
function getTemplates() {
	return TEMPLATES;
}
function getTemplate(name) {
	if (Object.prototype.hasOwnProperty.call(TEMPLATES, name)) return TEMPLATES[name];
}
function hasTemplate(name) {
	return Object.prototype.hasOwnProperty.call(TEMPLATES, name);
}
function setTemplate(name, template) {
	return TEMPLATES[name] = template;
}
var renderSettled$1 = esCompat(glimmer_exports).renderSettled;
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/rerender.js
/**
Returns a promise which will resolve when rendering has completed. In
this context, rendering is completed when all auto-tracked state that is
consumed in the template (including any tracked state in models, services,
etc.  that are then used in a template) has been updated in the DOM.

For example, in a test you might want to update some tracked state and
then run some assertions after rendering has completed. You _could_ use
`await settled()` in that location, but in some contexts you don't want to
wait for full settledness (which includes test waiters, pending AJAX/fetch,
run loops, etc) but instead only want to know when that updated value has
been rendered in the DOM. **THAT** is what `await rerender()` is _perfect_
for.
@public
@returns {Promise<void>} a promise which fulfills when rendering has completed
*/
function rerender() {
	return renderSettled$1();
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/validate-error-handler.js
var VALID = Object.freeze({
	isValid: true,
	message: null
});
var INVALID = Object.freeze({
	isValid: false,
	message: "error handler should have re-thrown the provided error"
});
/**
* Validate the provided error handler to confirm that it properly re-throws
* errors when `Ember.testing` is true.
*
* This is intended to be used by test framework hosts (or other libraries) to
* ensure that `Ember.onerror` is properly configured. Without a check like
* this, `Ember.onerror` could _easily_ swallow all errors and make it _seem_
* like everything is just fine (and have green tests) when in reality
* everything is on fire...
*
* @public
* @param {Function} [callback=Ember.onerror] the callback to validate
* @returns {Object} object with `isValid` and `message`
*
* @example <caption>Example implementation for `ember-qunit`</caption>
*
* import { validateErrorHandler } from '@ember/test-helpers';
*
* test('Ember.onerror is functioning properly', function(assert) {
*   let result = validateErrorHandler();
*   assert.ok(result.isValid, result.message);
* });
*/
function validateErrorHandler(callback = getOnerror()) {
	if (callback === void 0 || callback === null) return VALID;
	const error = /* @__PURE__ */ new Error("Error handler validation error!");
	const originalEmberTesting = isTesting();
	setTesting(true);
	try {
		callback(error);
	} catch (e) {
		if (e === error) return VALID;
	} finally {
		setTesting(originalEmberTesting);
	}
	return INVALID;
}
/**
* Determine if the argument is an {@link IDOMElementDescriptor}.
*
* This does not check if the argument is registered, just that it's type is
* {@link IDOMElementDescriptor}.
*/
function isDescriptor(target) {
	return Boolean(typeof target === "object" && target && "__dom_element_descriptor_is_descriptor__" in target);
}
/**
* Get the registry instance.
*
* We store it on the window to ensure that if some dependency/hoisting horkage
* results in the presence of multiple copies of this library, they are all
* using the same registry.
*
* @returns the registry
*/
function getRegistry() {
	const win = window;
	win.domElementDescriptorsRegistry = win.domElementDescriptorsRegistry || /* @__PURE__ */ new WeakMap();
	return win.domElementDescriptorsRegistry;
}
/**
* Look up registered descriptor data
*
* @param descriptor the descriptor
* @returns the descriptor's data, or null if none is set
*/
function lookupDescriptorData(descriptor) {
	return getRegistry().get(descriptor) || null;
}
/**
* Given a descriptor or descriptor data, get the single/first element it would
* match.
*
* This is analogous to `querySelector()`, and is meant to be used by DOM helper
* libraries to resolve the targets of single-element operations.
*
* @param target the descriptor or descriptor data
* @returns the resolved DOM element, or null if no element matched
*/
function resolveDOMElement(target) {
	let data = isDescriptor(target) ? lookupDescriptorData(target) : target;
	if (!data) return null;
	if (data.element !== void 0) return data.element;
	else {
		for (let element of data.elements || []) return element;
		return null;
	}
}
/**
* Given a descriptor or descriptor data, get the elements it would match.
*
* This is analogous to `querySelectorAll()`, and is meant to be used by DOM
* helper libraries to resolve the targets of multi-element operations.
*
* @param target the descriptor or descriptor data
* @returns the resolved DOM elements (possibly none)
*/
function resolveDOMElements(target) {
	let data = isDescriptor(target) ? lookupDescriptorData(target) : target;
	if (!data) return [];
	if (data.elements) return Array.from(data.elements);
	else {
		let element = data.element;
		return element ? [element] : [];
	}
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-get-element.js
/**
Used internally by the DOM interaction helpers to find one element.

@private
@param {string|Element} target the element or selector to retrieve
@returns {Element} the target or selector
*/
function getElement(target) {
	if (typeof target === "string") return getRootElement().querySelector(target);
	else if (isElement(target) || isDocument(target)) return target;
	else if (target instanceof Window) return target.document;
	else {
		const descriptorData = lookupDescriptorData(target);
		if (descriptorData) return resolveDOMElement(descriptorData);
		else throw new Error("Must use an element, selector string, or DOM element descriptor");
	}
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-get-window-or-element.js
/**
Used internally by the DOM interaction helpers to find either window or an element.

@private
@param {string|Element} target the window, an element or selector to retrieve
@returns {Element|Window} the target or selector
*/
function getWindowOrElement(target) {
	if (isWindow(target)) return target;
	return getElement(target);
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/-tuple.js
function tuple(...args) {
	return args;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-logging.js
/**
* Logs a debug message to the console if the `testHelperLogging` query
* parameter is set.
*
* @private
* @param {string} helperName Name of the helper
* @param {string|Element} target The target element or selector
*/
function log(helperName, target, ...args) {
	if (loggingEnabled()) console.log(`${helperName}(${[elementToString(target), ...args.filter(Boolean)].join(", ")})`);
}
/**
* Returns whether the test helper logging is enabled or not via the
* `testHelperLogging` query parameter.
*
* @private
* @returns {boolean} true if enabled
*/
function loggingEnabled() {
	return typeof location !== "undefined" && location.search.indexOf("testHelperLogging") !== -1;
}
/**
* This generates a human-readable description to a DOM element.
*
* @private
* @param {*} el The element that should be described
* @returns {string} A human-readable description
*/
function elementToString(el) {
	let desc;
	if (el instanceof NodeList) {
		if (el.length === 0) return "empty NodeList";
		desc = Array.prototype.slice.call(el, 0, 5).map(elementToString).join(", ");
		return el.length > 5 ? `${desc}... (+${el.length - 5} more)` : desc;
	}
	if (!(el instanceof HTMLElement || el instanceof SVGElement)) return String(el);
	desc = el.tagName.toLowerCase();
	if (el.id) desc += `#${el.id}`;
	if (el.className && !(el.className instanceof SVGAnimatedString)) desc += `.${String(el.className).replace(/\s+/g, ".")}`;
	Array.prototype.forEach.call(el.attributes, function(attr) {
		if (attr.name !== "class" && attr.name !== "id") desc += `[${attr.name}${attr.value ? `="${attr.value}"]` : "]"}`;
	});
	return desc;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/fire-event.js
registerHook("fireEvent", "start", (target) => {
	log("fireEvent", target);
});
var MOUSE_EVENT_CONSTRUCTOR = (() => {
	try {
		new MouseEvent("test");
		return true;
	} catch {
		return false;
	}
})();
var DEFAULT_EVENT_OPTIONS = {
	bubbles: true,
	cancelable: true
};
var KEYBOARD_EVENT_TYPES = tuple("keydown", "keypress", "keyup");
function isKeyboardEventType(eventType) {
	return KEYBOARD_EVENT_TYPES.indexOf(eventType) > -1;
}
var MOUSE_EVENT_TYPES = tuple("click", "mousedown", "mouseup", "dblclick", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover");
function isMouseEventType(eventType) {
	return MOUSE_EVENT_TYPES.indexOf(eventType) > -1;
}
var FILE_SELECTION_EVENT_TYPES = tuple("change");
function isFileSelectionEventType(eventType) {
	return FILE_SELECTION_EVENT_TYPES.indexOf(eventType) > -1;
}
function isFileSelectionInput(element) {
	return element.files;
}
/**
Internal helper used to build and dispatch events throughout the other DOM helpers.

@private
@param {Element} element the element to dispatch the event to
@param {string} eventType the type of event
@param {Object} [options] additional properties to be set on the event
@returns {Event} the event that was dispatched
*/
function fireEvent(element, eventType, options = {}) {
	return Promise.resolve().then(() => runHooks("fireEvent", "start", element)).then(() => runHooks(`fireEvent:${eventType}`, "start", element)).then(() => {
		if (!element) throw new Error("Must pass an element to `fireEvent`");
		let event;
		if (isKeyboardEventType(eventType)) event = _buildKeyboardEvent(eventType, options);
		else if (isMouseEventType(eventType)) {
			let rect;
			if (element instanceof Window && element.document.documentElement) rect = element.document.documentElement.getBoundingClientRect();
			else if (isDocument(element)) rect = element.documentElement.getBoundingClientRect();
			else if (isElement(element)) rect = element.getBoundingClientRect();
			else return;
			const x = rect.left + 1;
			const y = rect.top + 1;
			event = buildMouseEvent(eventType, {
				screenX: x + 5,
				screenY: y + 95,
				clientX: x,
				clientY: y,
				...options
			});
		} else if (isFileSelectionEventType(eventType) && isFileSelectionInput(element)) event = buildFileEvent(eventType, element, options);
		else event = buildBasicEvent(eventType, options);
		element.dispatchEvent(event);
		return event;
	}).then((event) => runHooks(`fireEvent:${eventType}`, "end", element).then(() => event)).then((event) => runHooks("fireEvent", "end", element).then(() => event));
}
function buildBasicEvent(type, options = {}) {
	const event = document.createEvent("Events");
	const bubbles = options.bubbles !== void 0 ? options.bubbles : true;
	const cancelable = options.cancelable !== void 0 ? options.cancelable : true;
	delete options.bubbles;
	delete options.cancelable;
	event.initEvent(type, bubbles, cancelable);
	for (const prop in options) event[prop] = options[prop];
	return event;
}
function buildMouseEvent(type, options = {}) {
	let event;
	const eventOpts = {
		view: window,
		...DEFAULT_EVENT_OPTIONS,
		...options
	};
	if (MOUSE_EVENT_CONSTRUCTOR) event = new MouseEvent(type, eventOpts);
	else try {
		event = document.createEvent("MouseEvents");
		event.initMouseEvent(type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
	} catch {
		event = buildBasicEvent(type, options);
	}
	return event;
}
function _buildKeyboardEvent(type, options = {}) {
	const eventOpts = {
		...DEFAULT_EVENT_OPTIONS,
		...options
	};
	let event;
	let eventMethodName;
	try {
		event = new KeyboardEvent(type, eventOpts);
		Object.defineProperty(event, "keyCode", { get() {
			return parseInt(eventOpts.keyCode);
		} });
		Object.defineProperty(event, "which", { get() {
			return parseInt(eventOpts.which);
		} });
		return event;
	} catch {}
	try {
		event = document.createEvent("KeyboardEvents");
		eventMethodName = "initKeyboardEvent";
	} catch {}
	if (!event) try {
		event = document.createEvent("KeyEvents");
		eventMethodName = "initKeyEvent";
	} catch {}
	if (event && eventMethodName) event[eventMethodName](type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
	else event = buildBasicEvent(type, options);
	return event;
}
function buildFileEvent(type, element, options = {}) {
	const event = buildBasicEvent(type);
	const files = options.files;
	if (Array.isArray(options)) throw new Error("Please pass an object with a files array to `triggerEvent` instead of passing the `options` param as an array to.");
	if (Array.isArray(files)) {
		Object.defineProperty(files, "item", {
			value(index) {
				return typeof index === "number" ? this[index] : null;
			},
			configurable: true
		});
		Object.defineProperty(element, "files", {
			value: files,
			configurable: true
		});
		const elementProto = Object.getPrototypeOf(element);
		const valueProp = Object.getOwnPropertyDescriptor(elementProto, "value");
		Object.defineProperty(element, "value", {
			configurable: true,
			get() {
				return valueProp.get.call(element);
			},
			set(value) {
				valueProp.set.call(element, value);
				Object.defineProperty(element, "files", {
					configurable: true,
					value: []
				});
			}
		});
	}
	Object.defineProperty(event, "target", { value: element });
	return event;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-is-focusable.js
var FOCUSABLE_TAGS = ["A", "SUMMARY"];
function isFocusableElement(element) {
	return FOCUSABLE_TAGS.indexOf(element.tagName) > -1;
}
/**
@private
@param {Element} element the element to check
@returns {boolean} `true` when the element is focusable, `false` otherwise
*/
function isFocusable(element) {
	if (isWindow(element)) return false;
	if (isDocument(element)) return false;
	if (isFormControl(element)) return !element.disabled;
	if (isContentEditable(element) || isFocusableElement(element)) return true;
	return element.hasAttribute("tabindex");
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-get-description.js
/**
Used internally by the DOM interaction helpers to get a description of a
target for debug/error messaging.

@private
@param {Target} target the target
@returns {string} a description of the target
*/
function getDescription(target) {
	const data = isDescriptor(target) ? lookupDescriptorData(target) : null;
	if (data) return data.description || "<unknown descriptor>";
	else return `${target}`;
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/blur.js
registerHook("blur", "start", (target) => {
	log("blur", target);
});
/**
@private
@param {Element} element the element to trigger events on
@param {Element} relatedTarget the element that is focused after blur
@return {Promise<Event | void>} resolves when settled
*/
function __blur__(element, relatedTarget = null) {
	if (!isFocusable(element)) throw new Error(`${element} is not focusable`);
	const browserIsNotFocused = document.hasFocus && !document.hasFocus();
	const needsCustomEventOptions = relatedTarget !== null;
	if (!needsCustomEventOptions) element.blur();
	const options = { relatedTarget };
	return browserIsNotFocused || needsCustomEventOptions ? Promise.resolve().then(() => fireEvent(element, "blur", {
		bubbles: false,
		...options
	})).then(() => fireEvent(element, "focusout", options)) : Promise.resolve();
}
/**
Unfocus the specified target.

Sends a number of events intending to simulate a "real" user unfocusing an
element.

The following events are triggered (in order):

- `blur`
- `focusout`

The exact listing of events that are triggered may change over time as needed
to continue to emulate how actual browsers handle unfocusing a given element.

@public
@param {string|Element|IDOMElementDescriptor} [target=document.activeElement] the element, selector, or descriptor to unfocus
@return {Promise<void>} resolves when settled

@example
<caption>
Emulating blurring an input using `blur`
</caption>

blur('input');
*/
function blur(target = document.activeElement) {
	return Promise.resolve().then(() => runHooks("blur", "start", target)).then(() => {
		const element = getElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`blur('${description}')\`.`);
		}
		return __blur__(element).then(() => settled());
	}).then(() => runHooks("blur", "end", target));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/focus.js
registerHook("focus", "start", (target) => {
	log("focus", target);
});
/**
Get the closest focusable ancestor of a given element (or the element itself
if it's focusable)

@private
@param {Element} element the element to trigger events on
@returns {HTMLElement|SVGElement|null} the focusable element/ancestor or null
if there is none
*/
function getClosestFocusable(element) {
	if (isDocument(element)) return null;
	let maybeFocusable = element;
	while (maybeFocusable && !isFocusable(maybeFocusable)) maybeFocusable = maybeFocusable.parentElement;
	return maybeFocusable;
}
/**
@private
@param {Element} element the element to trigger events on
@return {Promise<FocusRecord | Event | void>} resolves when settled
*/
function __focus__(element) {
	return Promise.resolve().then(() => {
		const focusTarget = getClosestFocusable(element);
		const previousFocusedElement = document.activeElement && document.activeElement !== focusTarget && isFocusable(document.activeElement) ? document.activeElement : null;
		return !focusTarget && previousFocusedElement ? __blur__(previousFocusedElement, null).then(() => Promise.resolve({
			focusTarget,
			previousFocusedElement
		})) : Promise.resolve({
			focusTarget,
			previousFocusedElement
		});
	}).then(({ focusTarget, previousFocusedElement }) => {
		if (!focusTarget) throw new Error("There was a previously focused element");
		const browserIsNotFocused = !document?.hasFocus();
		return previousFocusedElement && browserIsNotFocused ? __blur__(previousFocusedElement, focusTarget).then(() => Promise.resolve({ focusTarget })) : Promise.resolve({ focusTarget });
	}).then(({ focusTarget }) => {
		focusTarget.focus();
		return document?.hasFocus() ? Promise.resolve() : Promise.resolve().then(() => fireEvent(focusTarget, "focus", { bubbles: false })).then(() => fireEvent(focusTarget, "focusin")).then(() => settled());
	}).catch(() => {});
}
/**
Focus the specified target.

Sends a number of events intending to simulate a "real" user focusing an
element.

The following events are triggered (in order):

- `focus`
- `focusin`

The exact listing of events that are triggered may change over time as needed
to continue to emulate how actual browsers handle focusing a given element.

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to focus
@return {Promise<void>} resolves when the application is settled

@example
<caption>
Emulating focusing an input using `focus`
</caption>

focus('input');
*/
function focus(target) {
	return Promise.resolve().then(() => runHooks("focus", "start", target)).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `focus`.");
		const element = getElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`focus('${description}')\`.`);
		}
		if (!isFocusable(element)) throw new Error(`${element} is not focusable`);
		return __focus__(element).then(settled);
	}).then(() => runHooks("focus", "end", target));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/click.js
var PRIMARY_BUTTON = 1;
var MAIN_BUTTON_PRESSED = 0;
registerHook("click", "start", (target) => {
	log("click", target);
});
/**
* Represent a particular mouse button being clicked.
* See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons for available options.
*/
var DEFAULT_CLICK_OPTIONS = {
	buttons: PRIMARY_BUTTON,
	button: MAIN_BUTTON_PRESSED
};
/**
@private
@param {Element} element the element to click on
@param {MouseEventInit} options the options to be merged into the mouse events
@return {Promise<Event | void>} resolves when settled
*/
function __click__(element, options) {
	return Promise.resolve().then(() => fireEvent(element, "mousedown", options)).then((mouseDownEvent) => !isWindow(element) && !mouseDownEvent?.defaultPrevented ? __focus__(element) : Promise.resolve()).then(() => fireEvent(element, "mouseup", options)).then(() => fireEvent(element, "click", options));
}
/**
Clicks on the specified target.

Sends a number of events intending to simulate a "real" user clicking on an
element.

For non-focusable elements the following events are triggered (in order):

- `mousedown`
- `mouseup`
- `click`

For focusable (e.g. form control) elements the following events are triggered
(in order):

- `mousedown`
- `focus`
- `focusin`
- `mouseup`
- `click`

The exact listing of events that are triggered may change over time as needed
to continue to emulate how actual browsers handle clicking a given element.

Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).
You can use this to specify modifier keys as well.

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to click on
@param {MouseEventInit} _options the options to be merged into the mouse events.
@return {Promise<void>} resolves when settled

@example
<caption>
Emulating clicking a button using `click`
</caption>
click('button');

@example
<caption>
Emulating clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
</caption>

click('button', { shiftKey: true });
*/
function click(target, _options = {}) {
	const options = {
		...DEFAULT_CLICK_OPTIONS,
		..._options
	};
	return Promise.resolve().then(() => runHooks("click", "start", target, _options)).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `click`.");
		const element = getWindowOrElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`click('${description}')\`.`);
		}
		if (isFormControl(element) && element.disabled) throw new Error(`Can not \`click\` disabled ${element}`);
		return __click__(element, options).then(settled);
	}).then(() => runHooks("click", "end", target, _options));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/double-click.js
registerHook("doubleClick", "start", (target) => {
	log("doubleClick", target);
});
/**
@private
@param {Element} element the element to double-click on
@param {MouseEventInit} options the options to be merged into the mouse events
@returns {Promise<Event | void>} resolves when settled
*/
function __doubleClick__(element, options) {
	return Promise.resolve().then(() => fireEvent(element, "mousedown", options)).then((mouseDownEvent) => {
		return !isWindow(element) && !mouseDownEvent?.defaultPrevented ? __focus__(element) : Promise.resolve();
	}).then(() => fireEvent(element, "mouseup", options)).then(() => fireEvent(element, "click", options)).then(() => fireEvent(element, "mousedown", options)).then(() => fireEvent(element, "mouseup", options)).then(() => fireEvent(element, "click", options)).then(() => fireEvent(element, "dblclick", options));
}
/**
Double-clicks on the specified target.

Sends a number of events intending to simulate a "real" user clicking on an
element.

For non-focusable elements the following events are triggered (in order):

- `mousedown`
- `mouseup`
- `click`
- `mousedown`
- `mouseup`
- `click`
- `dblclick`

For focusable (e.g. form control) elements the following events are triggered
(in order):

- `mousedown`
- `focus`
- `focusin`
- `mouseup`
- `click`
- `mousedown`
- `mouseup`
- `click`
- `dblclick`

The exact listing of events that are triggered may change over time as needed
to continue to emulate how actual browsers handle clicking a given element.

Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to double-click on
@param {MouseEventInit} _options the options to be merged into the mouse events
@return {Promise<void>} resolves when settled

@example
<caption>
Emulating double clicking a button using `doubleClick`
</caption>

doubleClick('button');

@example
<caption>
Emulating double clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
</caption>

doubleClick('button', { shiftKey: true });
*/
function doubleClick(target, _options = {}) {
	const options = {
		...DEFAULT_CLICK_OPTIONS,
		..._options
	};
	return Promise.resolve().then(() => runHooks("doubleClick", "start", target, _options)).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `doubleClick`.");
		const element = getWindowOrElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`doubleClick('${description}')\`.`);
		}
		if (isFormControl(element) && element.disabled) throw new Error(`Can not \`doubleClick\` disabled ${element}`);
		return __doubleClick__(element, options).then(settled);
	}).then(() => runHooks("doubleClick", "end", target, _options));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/tab.js
var SUPPORTS_INERT = "inert" in Element.prototype;
var FALLBACK_ELEMENTS = [
	"CANVAS",
	"VIDEO",
	"PICTURE"
];
registerHook("tab", "start", (target) => {
	log("tab", target);
});
/**
Gets the active element of a document. IE11 may return null instead of the body as
other user-agents does when there isn’t an active element.
@private
@param {Document} ownerDocument the element to check
@returns {HTMLElement} the active element of the document
*/
function getActiveElement(ownerDocument) {
	return ownerDocument.activeElement || ownerDocument.body;
}
/**
Compiles a list of nodes that can be focused. Walks the tree, discards hidden elements and a few edge cases. To calculate the right.
@private
@param {Element} root the root element to start traversing on
@returns {Array} list of focusable nodes
*/
function compileFocusAreas(root = document.body) {
	const { ownerDocument } = root;
	if (!ownerDocument) throw new Error("Element must be in the DOM");
	const activeElement = getActiveElement(ownerDocument);
	const treeWalker = ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		if (node.tagName !== "AREA" && isVisible(node) === false) return NodeFilter.FILTER_REJECT;
		const parentNode = node.parentNode;
		if (parentNode && FALLBACK_ELEMENTS.indexOf(parentNode.tagName) !== -1) return NodeFilter.FILTER_REJECT;
		if (SUPPORTS_INERT && node.inert) return NodeFilter.FILTER_REJECT;
		if (isDisabled(node)) return NodeFilter.FILTER_REJECT;
		if (node === activeElement) return NodeFilter.FILTER_ACCEPT;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	let node;
	const elements = [];
	while (node = treeWalker.nextNode()) elements.push(node);
	return elements;
}
/**
Sort elements by their tab indices.
As older browsers doesn't necessarily implement stabile sort, we'll have to
manually compare with the index in the original array.
@private
@param {Array<HTMLElement>} elements to sort
@returns {Array<HTMLElement>} list of sorted focusable nodes by their tab index
*/
function sortElementsByTabIndices(elements) {
	return elements.map((element, index) => {
		return {
			index,
			element
		};
	}).sort((a, b) => {
		if (a.element.tabIndex === b.element.tabIndex) return a.index - b.index;
		else if (a.element.tabIndex === 0 || b.element.tabIndex === 0) return b.element.tabIndex - a.element.tabIndex;
		return a.element.tabIndex - b.element.tabIndex;
	}).map((entity) => entity.element);
}
/**
@private
@param {Element} root The root element or node to start traversing on.
@param {HTMLElement} activeElement The element to find the next and previous focus areas of
@returns {object} The next and previous focus areas of the active element
*/
function findNextResponders(root, activeElement) {
	const focusAreas = compileFocusAreas(root);
	const sortedFocusAreas = sortElementsByTabIndices(focusAreas);
	const elements = activeElement.tabIndex === -1 ? focusAreas : sortedFocusAreas;
	const index = elements.indexOf(activeElement);
	if (index === -1) return {
		next: sortedFocusAreas[0],
		previous: sortedFocusAreas[sortedFocusAreas.length - 1]
	};
	return {
		next: elements[index + 1],
		previous: elements[index - 1]
	};
}
/**
Emulates the user pressing the tab button.

Sends a number of events intending to simulate a "real" user pressing tab on their
keyboard.

@public
@param {Object} [options] optional tab behaviors
@param {boolean} [options.backwards=false] indicates if the the user navigates backwards
@param {boolean} [options.unRestrainTabIndex=false] indicates if tabbing should throw an error when tabindex is greater than 0
@return {Promise<void>} resolves when settled

@example
<caption>
Emulating pressing the `TAB` key
</caption>
tab();

@example
<caption>
Emulating pressing the `SHIFT`+`TAB` key combination
</caption>
tab({ backwards: true });
*/
function triggerTab({ backwards = false, unRestrainTabIndex = false } = {}) {
	return Promise.resolve().then(() => {
		return triggerResponderChange(backwards, unRestrainTabIndex);
	}).then(() => {
		return settled();
	});
}
/**
@private
@param {boolean} backwards when `true` it selects the previous focus area
@param {boolean} unRestrainTabIndex when `true`, will not throw an error if tabindex > 0 is encountered
@returns {Promise<void>} resolves when all events are fired
*/
function triggerResponderChange(backwards, unRestrainTabIndex) {
	const root = getRootElement();
	let ownerDocument;
	let rootElement;
	if (isDocument(root)) {
		rootElement = root.body;
		ownerDocument = root;
	} else {
		rootElement = root;
		ownerDocument = root.ownerDocument;
	}
	const keyboardEventOptions = {
		keyCode: 9,
		which: 9,
		key: "Tab",
		code: "Tab",
		shiftKey: backwards
	};
	const debugData = {
		keyboardEventOptions,
		ownerDocument,
		rootElement
	};
	return Promise.resolve().then(() => runHooks("tab", "start", debugData)).then(() => getActiveElement(ownerDocument)).then((activeElement) => runHooks("tab", "targetFound", activeElement).then(() => activeElement)).then((activeElement) => {
		const event = _buildKeyboardEvent("keydown", keyboardEventOptions);
		if (activeElement.dispatchEvent(event)) {
			activeElement = getActiveElement(ownerDocument);
			const target = findNextResponders(rootElement, activeElement);
			if (target) {
				if (backwards && target.previous) return __focus__(target.previous);
				else if (!backwards && target.next) return __focus__(target.next);
				else return __blur__(activeElement);
			}
		}
		return Promise.resolve();
	}).then(() => {
		const activeElement = getActiveElement(ownerDocument);
		return fireEvent(activeElement, "keyup", keyboardEventOptions).then(() => activeElement);
	}).then((activeElement) => {
		if (!unRestrainTabIndex && activeElement.tabIndex > 0) throw new Error(`tabindex of greater than 0 is not allowed. Found tabindex=${activeElement.tabIndex}`);
	}).then(() => runHooks("tab", "end", debugData));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/tap.js
registerHook("tap", "start", (target) => {
	log("tap", target);
});
/**
Taps on the specified target.

Sends a number of events intending to simulate a "real" user tapping on an
element.

For non-focusable elements the following events are triggered (in order):

- `touchstart`
- `touchend`
- `mousedown`
- `mouseup`
- `click`

For focusable (e.g. form control) elements the following events are triggered
(in order):

- `touchstart`
- `touchend`
- `mousedown`
- `focus`
- `focusin`
- `mouseup`
- `click`

The exact listing of events that are triggered may change over time as needed
to continue to emulate how actual browsers handle tapping on a given element.

Use the `options` hash to change the parameters of the tap events.

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to tap on
@param {Object} options the options to be merged into the touch events
@return {Promise<void>} resolves when settled

@example
<caption>
Emulating tapping a button using `tap`
</caption>

tap('button');
*/
function tap(target, options = {}) {
	return Promise.resolve().then(() => {
		return runHooks("tap", "start", target, options);
	}).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `tap`.");
		const element = getElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`tap('${description}')\`.`);
		}
		if (isFormControl(element) && element.disabled) throw new Error(`Can not \`tap\` disabled ${element}`);
		return fireEvent(element, "touchstart", options).then((touchstartEv) => fireEvent(element, "touchend", options).then((touchendEv) => [touchstartEv, touchendEv])).then(([touchstartEv, touchendEv]) => !touchstartEv.defaultPrevented && !touchendEv.defaultPrevented ? __click__(element, options) : Promise.resolve()).then(settled);
	}).then(() => {
		return runHooks("tap", "end", target, options);
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/trigger-event.js
registerHook("triggerEvent", "start", (target, eventType) => {
	log("triggerEvent", target, eventType);
});
/**
* Triggers an event on the specified target.
*
* @public
* @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to trigger the event on
* @param {string} eventType the type of event to trigger
* @param {Object} options additional properties to be set on the event
* @param {boolean} force if true, will bypass availability checks (false by default)
* @return {Promise<void>} resolves when the application is settled
*
* @example
* <caption>
* Using `triggerEvent` to upload a file
*
* When using `triggerEvent` to upload a file the `eventType` must be `change` and you must pass the
* `options` param as an object with a key `files` containing an array of
* [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
* </caption>
*
* triggerEvent(
*   'input.fileUpload',
*   'change',
*   { files: [new Blob(['Ember Rules!'])] }
* );
*
*
* @example
* <caption>
* Using `triggerEvent` to upload a dropped file
*
* When using `triggerEvent` to handle a dropped (via drag-and-drop) file, the `eventType` must be `drop`. Assuming your `drop` event handler uses the [DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer),
* you must pass the `options` param as an object with a key of `dataTransfer`. The `options.dataTransfer`     object should have a `files` key, containing an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
* </caption>
*
* triggerEvent(
*   '[data-test-drop-zone]',
*   'drop',
*   {
*     dataTransfer: {
*       files: [new File(['Ember Rules!'], 'ember-rules.txt')]
*     }
*   }
* )
*/
function triggerEvent(target, eventType, options, force = false) {
	return Promise.resolve().then(() => {
		return runHooks("triggerEvent", "start", target, eventType, options);
	}).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `triggerEvent`.");
		if (!eventType) throw new Error(`Must provide an \`eventType\` to \`triggerEvent\``);
		const element = getWindowOrElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`triggerEvent('${description}', ...)\`.`);
		}
		if (!force && isFormControl(element) && element.disabled) throw new Error(`Can not \`triggerEvent\` on disabled ${element}`);
		return fireEvent(element, eventType, options).then(settled);
	}).then(() => {
		return runHooks("triggerEvent", "end", target, eventType, options);
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/trigger-key-event.js
registerHook("triggerKeyEvent", "start", (target, eventType, key) => {
	log("triggerKeyEvent", target, eventType, key);
});
var DEFAULT_MODIFIERS = Object.freeze({
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false
});
var keyFromKeyCode = {
	8: "Backspace",
	9: "Tab",
	13: "Enter",
	16: "Shift",
	17: "Control",
	18: "Alt",
	20: "CapsLock",
	27: "Escape",
	32: " ",
	37: "ArrowLeft",
	38: "ArrowUp",
	39: "ArrowRight",
	40: "ArrowDown",
	48: "0",
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	65: "a",
	66: "b",
	67: "c",
	68: "d",
	69: "e",
	70: "f",
	71: "g",
	72: "h",
	73: "i",
	74: "j",
	75: "k",
	76: "l",
	77: "m",
	78: "n",
	79: "o",
	80: "p",
	81: "q",
	82: "r",
	83: "s",
	84: "t",
	85: "u",
	86: "v",
	87: "w",
	88: "x",
	89: "y",
	90: "z",
	91: "Meta",
	93: "Meta",
	186: ";",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
};
var keyFromKeyCodeWithShift = {
	48: ")",
	49: "!",
	50: "@",
	51: "#",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	186: ":",
	187: "+",
	188: "<",
	189: "_",
	190: ">",
	191: "?",
	219: "{",
	220: "|",
	221: "}",
	222: "\""
};
/**
Calculates the value of KeyboardEvent#key given a keycode and the modifiers.
Note that this works if the key is pressed in combination with the shift key, but it cannot
detect if caps lock is enabled.
@param {number} keycode The keycode of the event.
@param {object} modifiers The modifiers of the event.
@returns {string} The key string for the event.
*/
function keyFromKeyCodeAndModifiers(keycode, modifiers) {
	if (keycode > 64 && keycode < 91) {
		if (modifiers.shiftKey) return String.fromCharCode(keycode);
		else return String.fromCharCode(keycode).toLocaleLowerCase();
	}
	return modifiers.shiftKey && keyFromKeyCodeWithShift[keycode] || keyFromKeyCode[keycode];
}
/**
* Infers the keycode from the given key
* @param {string} key The KeyboardEvent#key string
* @returns {number} The keycode for the given key
*/
function keyCodeFromKey(key) {
	const keys = Object.keys(keyFromKeyCode);
	const keyCode = keys.find((keyCode) => keyFromKeyCode[Number(keyCode)] === key) || keys.find((keyCode) => keyFromKeyCode[Number(keyCode)] === key.toLowerCase());
	return keyCode !== void 0 ? parseInt(keyCode) : void 0;
}
/**
@private
@param {Element | Document} element the element to trigger the key event on
@param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
@param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
@param {Object} [modifiers] the state of various modifier keys
@return {Promise<Event>} resolves when settled
*/
function __triggerKeyEvent__(element, eventType, key, modifiers = DEFAULT_MODIFIERS) {
	return Promise.resolve().then(() => {
		let props;
		if (typeof key === "number") props = {
			keyCode: key,
			which: key,
			key: keyFromKeyCodeAndModifiers(key, modifiers),
			...modifiers
		};
		else if (typeof key === "string" && key.length !== 0) {
			const firstCharacter = key[0];
			if (!firstCharacter || firstCharacter !== firstCharacter.toUpperCase()) throw new Error(`Must provide a \`key\` to \`triggerKeyEvent\` that starts with an uppercase character but you passed \`${key}\`.`);
			if (isNumeric(key) && key.length > 1) throw new Error(`Must provide a numeric \`keyCode\` to \`triggerKeyEvent\` but you passed \`${key}\` as a string.`);
			const keyCode = keyCodeFromKey(key);
			props = {
				keyCode,
				which: keyCode,
				key,
				...modifiers
			};
		} else throw new Error(`Must provide a \`key\` or \`keyCode\` to \`triggerKeyEvent\``);
		return fireEvent(element, eventType, props);
	});
}
/**
Triggers a keyboard event of given type in the target element.
It also requires the developer to provide either a string with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
or the numeric [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) of the pressed key.
Optionally the user can also provide a POJO with extra modifiers for the event.

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to trigger the event on
@param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
@param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
@param {Object} [modifiers] the state of various modifier keys
@param {boolean} [modifiers.ctrlKey=false] if true the generated event will indicate the control key was pressed during the key event
@param {boolean} [modifiers.altKey=false] if true the generated event will indicate the alt key was pressed during the key event
@param {boolean} [modifiers.shiftKey=false] if true the generated event will indicate the shift key was pressed during the key event
@param {boolean} [modifiers.metaKey=false] if true the generated event will indicate the meta key was pressed during the key event
@return {Promise<void>} resolves when the application is settled unless awaitSettled is false

@example
<caption>
Emulating pressing the `ENTER` key on a button using `triggerKeyEvent`
</caption>
triggerKeyEvent('button', 'keydown', 'Enter');
*/
function triggerKeyEvent(target, eventType, key, modifiers = DEFAULT_MODIFIERS) {
	return Promise.resolve().then(() => {
		return runHooks("triggerKeyEvent", "start", target, eventType, key);
	}).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `triggerKeyEvent`.");
		const element = getElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`triggerKeyEvent('${description}')\`.`);
		}
		if (!eventType) throw new Error(`Must provide an \`eventType\` to \`triggerKeyEvent\``);
		if (!isKeyboardEventType(eventType)) {
			const validEventTypes = KEYBOARD_EVENT_TYPES.join(", ");
			throw new Error(`Must provide an \`eventType\` of ${validEventTypes} to \`triggerKeyEvent\` but you passed \`${eventType}\`.`);
		}
		if (isFormControl(element) && element.disabled) throw new Error(`Can not \`triggerKeyEvent\` on disabled ${element}`);
		return __triggerKeyEvent__(element, eventType, key, modifiers).then(settled);
	}).then(() => runHooks("triggerKeyEvent", "end", target, eventType, key));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-guard-for-maxlength.js
var constrainedInputTypes = [
	"text",
	"search",
	"url",
	"tel",
	"email",
	"password"
];
/**
@private
@param {Element} element - the element to check
@returns {boolean} `true` when the element should constrain input by the maxlength attribute, `false` otherwise
*/
function isMaxLengthConstrained(element) {
	return !!Number(element.getAttribute("maxlength")) && (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement && constrainedInputTypes.indexOf(element.type) > -1);
}
/**
* @private
* @param {Element} element - the element to check
* @param {string} text - the text being added to element
* @param {string} testHelper - the test helper context the guard is called from (for Error message)
* @throws if `element` has `maxlength` & `value` exceeds `maxlength`
*/
function guardForMaxlength(element, text, testHelper) {
	const maxlength = element.getAttribute("maxlength");
	if (isMaxLengthConstrained(element) && maxlength && text && text.length > Number(maxlength)) throw new Error(`Can not \`${testHelper}\` with text: '${text}' that exceeds maxlength: '${maxlength}'.`);
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/fill-in.js
registerHook("fillIn", "start", (target, text) => {
	log("fillIn", target, text);
});
/**
Fill the provided text into the `value` property (or set `.innerHTML` when
the target is a content editable element) then trigger `change` and `input`
events on the specified target.

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to enter text into
@param {string} text the text to fill into the target element
@return {Promise<void>} resolves when the application is settled

@example
<caption>
Emulating filling an input with text using `fillIn`
</caption>

fillIn('input', 'hello world');
*/
function fillIn(target, text) {
	return Promise.resolve().then(() => runHooks("fillIn", "start", target, text)).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `fillIn`.");
		const element = getElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`fillIn('${description}')\`.`);
		}
		if (typeof text === "undefined" || text === null) throw new Error("Must provide `text` when calling `fillIn`.");
		if (isFormControl(element)) {
			if (element.disabled) throw new Error(`Can not \`fillIn\` disabled '${getDescription(target)}'.`);
			if ("readOnly" in element && element.readOnly) throw new Error(`Can not \`fillIn\` readonly '${getDescription(target)}'.`);
			guardForMaxlength(element, text, "fillIn");
			return __focus__(element).then(() => {
				element.value = text;
				return element;
			});
		} else if (isContentEditable(element)) return __focus__(element).then(() => {
			element.innerHTML = text;
			return element;
		});
		else throw new Error("`fillIn` is only usable on form controls or contenteditable elements.");
	}).then((element) => fireEvent(element, "input").then(() => fireEvent(element, "change")).then(settled)).then(() => runHooks("fillIn", "end", target, text));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-is-select-element.js
/**
@private
@param {Element} element the element to check
@returns {boolean} `true` when the element is a select element, `false` otherwise
*/
function isSelectElement(element) {
	return !isDocument(element) && element.tagName === "SELECT";
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/select.js
function errorMessage$1(message, target) {
	return `${message} when calling \`select('${getDescription(target)}')\`.`;
}
/**
Set the `selected` property true for the provided option the target is a
select element (or set the select property true for multiple options if the
multiple attribute is set true on the HTMLSelectElement) then trigger
`change` and `input` events on the specified target.

@public
@param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor for the select element
@param {string|string[]} options the value/values of the items to select
@param {boolean} keepPreviouslySelected a flag keep any existing selections
@return {Promise<void>} resolves when the application is settled

@example
<caption>
Emulating selecting an option or multiple options using `select`
</caption>

select('select', 'apple');

select('select', ['apple', 'orange']);

select('select', ['apple', 'orange'], true);
*/
function select(target, options, keepPreviouslySelected = false) {
	return Promise.resolve().then(() => runHooks("select", "start", target, options, keepPreviouslySelected)).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `select`.");
		if (typeof options === "undefined" || options === null) throw new Error("Must provide an `option` or `options` to select when calling `select`.");
		const element = getElement(target);
		if (!element) throw new Error(errorMessage$1("Element not found", target));
		if (!isSelectElement(element)) throw new Error(errorMessage$1("Element is not a HTMLSelectElement", target));
		if (element.disabled) throw new Error(errorMessage$1("Element is disabled", target));
		options = Array.isArray(options) ? options : [options];
		if (!element.multiple && options.length > 1) throw new Error(errorMessage$1("HTMLSelectElement `multiple` attribute is set to `false` but multiple options were passed", target));
		return __focus__(element).then(() => element);
	}).then((element) => {
		for (let i = 0; i < element.options.length; i++) {
			const elementOption = element.options.item(i);
			if (elementOption) {
				if (options.indexOf(elementOption.value) > -1) elementOption.selected = true;
				else if (!keepPreviouslySelected) elementOption.selected = false;
			}
		}
		return fireEvent(element, "input").then(() => fireEvent(element, "change")).then(settled);
	}).then(() => runHooks("select", "end", target, options, keepPreviouslySelected));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/-get-elements.js
/**
Used internally by the DOM interaction helpers to find multiple elements.

@private
@param {string} target the selector to retrieve
@returns {NodeList} the matched elements
*/
function getElements(target) {
	if (typeof target === "string") return getRootElement().querySelectorAll(target);
	else {
		const descriptorData = lookupDescriptorData(target);
		if (descriptorData) return resolveDOMElements(descriptorData);
		else throw new Error("Must use a selector string or DOM element descriptor");
	}
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/wait-for.js
/**
Used to wait for a particular selector to appear in the DOM. Due to the fact
that it does not wait for general settledness, this is quite useful for testing
interim DOM states (e.g. loading states, pending promises, etc).

@param {string|IDOMElementDescriptor} target the selector or DOM element descriptor to wait for
@param {Object} [options] the options to be used
@param {number} [options.timeout=1000] the time to wait (in ms) for a match
@param {number} [options.count=null] the number of elements that should match the provided selector (null means one or more)
@return {Promise<Element|Element[]>} resolves when the element(s) appear on the page

@example
<caption>
Waiting until a selector is rendered:
</caption>
await waitFor('.my-selector', { timeout: 2000 })
*/
function waitFor(target, options = {}) {
	return Promise.resolve().then(() => {
		if (typeof target !== "string" && !lookupDescriptorData(target)) throw new Error("Must pass a selector or DOM element descriptor to `waitFor`.");
		const { timeout = 1e3, count = null } = options;
		let { timeoutMessage } = options;
		if (!timeoutMessage) timeoutMessage = `waitFor timed out waiting for selector "${getDescription(target)}"`;
		let callback;
		if (count !== null) callback = () => {
			const elements = Array.from(getElements(target));
			if (elements.length === count) return elements;
		};
		else callback = () => getElement(target);
		return waitUntil(callback, {
			timeout,
			timeoutMessage
		});
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/find.js
/**
Find the first element matched by the given selector. Equivalent to calling
`querySelector()` on the test root element.

@public
@param {string} selector the selector to search for
@return {Element | null} matched element or null

@example
<caption>
Finding the first element with id 'foo'
</caption>
find('#foo');
*/
function find(selector) {
	if (!selector) throw new Error("Must pass a selector to `find`.");
	if (arguments.length > 1) throw new Error("The `find` test helper only takes a single argument.");
	return getElement(selector);
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/find-all.js
/**
Find all elements matched by the given selector. Similar to calling
`querySelectorAll()` on the test root element, but returns an array instead
of a `NodeList`.

@public
@param {string} selector the selector to search for
@return {Array} array of matched elements

@example
<caption>
Find all of the elements matching '.my-selector'.
</caption>
findAll('.my-selector');
*/
function findAll(selector) {
	if (!selector) throw new Error("Must pass a selector to `findAll`.");
	if (arguments.length > 1) throw new Error("The `findAll` test helper only takes a single argument.");
	return Array.from(getElements(selector));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/type-in.js
registerHook("typeIn", "start", (target, text) => {
	log("typeIn", target, text);
});
/**
* Mimics character by character entry into the target `input` or `textarea` element.
*
* Allows for simulation of slow entry by passing an optional millisecond delay
* between key events.

* The major difference between `typeIn` and `fillIn` is that `typeIn` triggers
* keyboard events as well as `input` and `change`.
* Typically this looks like `focus` -> `focusin` -> `keydown` -> `keypress` -> `keyup` -> `input` -> `change`
* per character of the passed text (this may vary on some browsers).
*
* @public
* @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to enter text into
* @param {string} text the test to fill the element with
* @param {Object} options {delay: x} (default 50) number of milliseconds to wait per keypress
* @return {Promise<void>} resolves when the application is settled
*
* @example
* <caption>
*   Emulating typing in an input using `typeIn`
* </caption>
*
* typeIn('input', 'hello world');
*/
function typeIn(target, text, options = {}) {
	return Promise.resolve().then(() => {
		return runHooks("typeIn", "start", target, text, options);
	}).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `typeIn`.");
		const element = getElement(target);
		if (!element) {
			const description = getDescription(target);
			throw new Error(`Element not found when calling \`typeIn('${description}')\``);
		}
		if (isDocument(element) || !isFormControl(element) && !isContentEditable(element)) throw new Error("`typeIn` is only usable on form controls or contenteditable elements.");
		if (typeof text === "undefined" || text === null) throw new Error("Must provide `text` when calling `typeIn`.");
		if (isFormControl(element)) {
			if (element.disabled) throw new Error(`Can not \`typeIn\` disabled '${getDescription(target)}'.`);
			if ("readOnly" in element && element.readOnly) throw new Error(`Can not \`typeIn\` readonly '${getDescription(target)}'.`);
		}
		const { delay = 50 } = options;
		return __focus__(element).then(() => fillOut(element, text, delay)).then(() => fireEvent(element, "change")).then(settled).then(() => runHooks("typeIn", "end", target, text, options));
	});
}
function fillOut(element, text, delay) {
	return text.split("").map((character) => keyEntry(element, character)).reduce((currentPromise, func) => {
		return currentPromise.then(() => delayedExecute(delay)).then(func);
	}, Promise.resolve());
}
function keyEntry(element, character) {
	const options = { shiftKey: character === character.toUpperCase() && character !== character.toLowerCase() };
	const characterKey = character.toUpperCase();
	return function() {
		return Promise.resolve().then(() => __triggerKeyEvent__(element, "keydown", characterKey, options)).then(() => __triggerKeyEvent__(element, "keypress", characterKey, options)).then(() => {
			if (isFormControl(element)) {
				const newValue = element.value + character;
				guardForMaxlength(element, newValue, "typeIn");
				element.value = newValue;
			} else element.innerHTML = element.innerHTML + character;
			return fireEvent(element, "input");
		}).then(() => __triggerKeyEvent__(element, "keyup", characterKey, options));
	};
}
function delayedExecute(delay) {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/scroll-to.js
function errorMessage(message, target) {
	return `${message} when calling \`scrollTo('${getDescription(target)}')\`.`;
}
/**
Scrolls DOM element, selector, or descriptor to the given coordinates.
@public
@param {string|HTMLElement|IDOMElementDescriptor} target the element, selector, or descriptor to trigger scroll on
@param {Number} x x-coordinate
@param {Number} y y-coordinate
@return {Promise<void>} resolves when settled

@example
<caption>
Scroll DOM element to specific coordinates
</caption>

scrollTo('#my-long-div', 0, 0); // scroll to top
scrollTo('#my-long-div', 0, 100); // scroll down
*/
function scrollTo(target, x, y) {
	return Promise.resolve().then(() => runHooks("scrollTo", "start", target)).then(() => {
		if (!target) throw new Error("Must pass an element, selector, or descriptor to `scrollTo`.");
		if (x === void 0 || y === void 0) throw new Error("Must pass both x and y coordinates to `scrollTo`.");
		const element = getElement(target);
		if (!element) throw new Error(errorMessage("Element not found", target));
		if (!isElement(element)) {
			let nodeType;
			if (isDocument(element)) nodeType = "Document";
			else nodeType = element.nodeType;
			throw new Error(errorMessage(`"target" must be an element, but was a ${nodeType}`, target));
		}
		element.scrollTop = y;
		element.scrollLeft = x;
		return fireEvent(element, "scroll").then(settled);
	}).then(() => runHooks("scrollTo", "end", target));
}
//#endregion
//#region ../node_modules/.pnpm/@ember+test-helpers@5.5.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/@ember/test-helpers/dist/dom/wait-for-focus.js
/**
Used to wait for a particular selector to receive focus. Useful for verifying
keyboard navigation handling and default focus behaviour, without having to
think about timing issues.

@param {string|IDOMElementDescriptor} target the selector or DOM element descriptor to wait receiving focus
@param {Object} [options] the options to be used
@param {number} [options.timeout=1000] the time to wait (in ms) for a match
@param {string} [options.timeoutMessage='waitForFocus timed out waiting for selector'] the message to use in the reject on timeout
@return {Promise<Element>} resolves when the element received focus

@example
<caption>
Waiting until a selector receive focus:
</caption>
await waitForFocus('.my-selector', { timeout: 2000 })
*/
function waitForFocus(target, options = {}) {
	return Promise.resolve().then(() => {
		if (typeof target !== "string" && !lookupDescriptorData(target)) throw new Error("Must pass a selector or DOM element descriptor to `waitFor`.");
		const { timeout = 1e3 } = options;
		let { timeoutMessage } = options;
		if (!timeoutMessage) timeoutMessage = `waitForFocus timed out waiting for selector "${getDescription(target)}"`;
		return waitUntil(() => {
			const element = getElement(target);
			if (element && element === document.activeElement) return document.activeElement;
		}, {
			timeout,
			timeoutMessage
		});
	});
}
//#endregion
export { blur, clearRender, click, currentRouteName, currentURL, doubleClick, fillIn, find, findAll, focus, getApplication, getContext, getDebugInfo, getDeprecations, getDeprecationsDuringCallback, getResolver, getRootElement, getSettledState, getTestMetadata, getWarnings, getWarningsDuringCallback, hasEmberVersion, isSettled, pauseTest, registerDebugInfoHelper, registerHook, render, rerender, resetOnerror, resumeTest, runHooks, scrollTo, select, setApplication, setContext, setResolver, settled, setupApplicationContext, setupContext, setupOnerror, setupRenderingContext, triggerTab as tab, tap, teardownContext, triggerEvent, triggerKeyEvent, typeIn, unsetContext, validateErrorHandler, visit, waitFor, waitForFocus, waitUntil };
