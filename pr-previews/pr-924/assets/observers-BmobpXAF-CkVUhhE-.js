import { a as peekMeta, i as meta } from "./meta-B7F2ReUu.js";
import { l as registerDestructor } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, a as CURRENT_TAG, j as valueForTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { r as tagMetaFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { i as getChainTagsForKey } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/env-DXxsTFkM.js
/**
The hash of environment variables used to control various configuration
settings. To specify your own or override default settings, add the
desired properties to a global hash named `EmberENV` (or `ENV` for
backwards compatibility with earlier versions of Ember). The `EmberENV`
hash must be created before loading Ember.

@class EmberENV
@type Object
@public
*/
var ENV = {
	ENABLE_OPTIONAL_FEATURES: false,
	/**
	Determines whether Ember should add to `Array`
	native object prototypes, a few extra methods in order to provide a more
	friendly API.
	The behavior from setting this option to `true` was deprecated in Ember 5.10.
	@property EXTEND_PROTOTYPES
	@type Boolean
	@default true
	@for EmberENV
	@private
	@deprecated in v5.10
	*/
	EXTEND_PROTOTYPES: { Array: false },
	/**
	The `LOG_STACKTRACE_ON_DEPRECATION` property, when true, tells Ember to log
	a full stack trace during deprecation warnings.
	@property LOG_STACKTRACE_ON_DEPRECATION
	@type Boolean
	@default true
	@for EmberENV
	@public
	*/
	LOG_STACKTRACE_ON_DEPRECATION: true,
	/**
	The `LOG_VERSION` property, when true, tells Ember to log versions of all
	dependent libraries in use.
	@property LOG_VERSION
	@type Boolean
	@default true
	@for EmberENV
	@public
	*/
	LOG_VERSION: true,
	/**
	The `LOG_INSPECTOR_HINT` property, when true, tells Ember to log a hint
	suggesting the Ember Inspector browser extension when it is not detected.
	@property LOG_INSPECTOR_HINT
	@type Boolean
	@default true
	@for EmberENV
	@public
	*/
	LOG_INSPECTOR_HINT: true,
	RAISE_ON_DEPRECATION: false,
	STRUCTURED_PROFILE: false,
	/**
	Whether to perform extra bookkeeping needed to make the `captureRenderTree`
	API work.
	This has to be set before the ember JavaScript code is evaluated. This is
	usually done by setting `window.EmberENV = { _DEBUG_RENDER_TREE: true };`
	before the "vendor" `<script>` tag in `index.html`.
	Setting the flag after Ember is already loaded will not work correctly. It
	may appear to work somewhat, but fundamentally broken.
	This is not intended to be set directly. Ember Inspector will enable the
	flag on behalf of the user as needed.
	This flag is always on in development mode.
	The flag is off by default in production mode, due to the cost associated
	with the the bookkeeping work.
	The expected flow is that Ember Inspector will ask the user to refresh the
	page after enabling the feature. It could also offer a feature where the
	user add some domains to the "always on" list. In either case, Ember
	Inspector will inject the code on the page to set the flag if needed.
	@property _DEBUG_RENDER_TREE
	@for EmberENV
	@type Boolean
	@default false
	@private
	*/
	_DEBUG_RENDER_TREE: false,
	/**
	Whether to force all deprecations to be enabled. This is used internally by
	Ember to enable deprecations in tests. It is not intended to be set in
	projects.
	@property _ALL_DEPRECATIONS_ENABLED
	@for EmberENV
	@type Boolean
	@default false
	@private
	*/
	_ALL_DEPRECATIONS_ENABLED: false,
	/**
	Override the version of ember-source used to determine when deprecations "break".
	This is used internally by Ember to test with deprecated features "removed".
	This is never intended to be set by projects.
	@property _OVERRIDE_DEPRECATION_VERSION
	@for EmberENV
	@type string | null
	@default null
	@private
	*/
	_OVERRIDE_DEPRECATION_VERSION: null,
	/**
	Whether the app defaults to using async observers.
	This is not intended to be set directly, as the implementation may change in
	the future. Use `@ember/optional-features` instead.
	@property _DEFAULT_ASYNC_OBSERVERS
	@for EmberENV
	@type Boolean
	@default false
	@private
	*/
	_DEFAULT_ASYNC_OBSERVERS: false,
	/**
	Controls the maximum number of scheduled rerenders without "settling". In general,
	applications should not need to modify this environment variable, but please
	open an issue so that we can determine if a better default value is needed.
	@property _RERENDER_LOOP_LIMIT
	@for EmberENV
	@type number
	@default 1000
	@private
	*/
	_RERENDER_LOOP_LIMIT: 1e3,
	FEATURES: {}
};
var EmberENV = globalThis.EmberENV;
if (typeof EmberENV === "object" && EmberENV !== null) {
	for (let flag in EmberENV) {
		if (!Object.prototype.hasOwnProperty.call(EmberENV, flag) || flag === "EXTEND_PROTOTYPES" || flag === "EMBER_LOAD_HOOKS") continue;
		let defaultValue = ENV[flag];
		if (defaultValue === true) ENV[flag] = EmberENV[flag] !== false;
		else if (defaultValue === false) ENV[flag] = EmberENV[flag] === true;
		else ENV[flag] = EmberENV[flag];
	}
	let { FEATURES } = EmberENV;
	if (typeof FEATURES === "object" && FEATURES !== null) for (let feature in FEATURES) {
		if (!Object.prototype.hasOwnProperty.call(FEATURES, feature)) continue;
		ENV.FEATURES[feature] = FEATURES[feature] === true;
	}
}
function getENV() {
	return ENV;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/super-BBBjgF69.js
var HAS_SUPER_PATTERN = /\.(_super|call\(this|apply\(this)/;
var fnToString = Function.prototype.toString;
var checkHasSuper = (() => {
	if (fnToString.call(function() {
		return this;
	}).indexOf("return this") > -1) return function checkHasSuper(func) {
		return HAS_SUPER_PATTERN.test(fnToString.call(func));
	};
	return function checkHasSuper() {
		return true;
	};
})();
var HAS_SUPER_MAP = /* @__PURE__ */ new WeakMap();
var ROOT = Object.freeze(function() {});
HAS_SUPER_MAP.set(ROOT, false);
function hasSuper(func) {
	let hasSuper = HAS_SUPER_MAP.get(func);
	if (hasSuper === void 0) {
		hasSuper = checkHasSuper(func);
		HAS_SUPER_MAP.set(func, hasSuper);
	}
	return hasSuper;
}
var ObserverListenerMeta = class {
	listeners = void 0;
	observers = void 0;
};
var OBSERVERS_LISTENERS_MAP = /* @__PURE__ */ new WeakMap();
function createObserverListenerMetaFor(fn) {
	let meta = OBSERVERS_LISTENERS_MAP.get(fn);
	if (meta === void 0) {
		meta = new ObserverListenerMeta();
		OBSERVERS_LISTENERS_MAP.set(fn, meta);
	}
	return meta;
}
function observerListenerMetaFor(fn) {
	return OBSERVERS_LISTENERS_MAP.get(fn);
}
function setObservers(func, observers) {
	let meta = createObserverListenerMetaFor(func);
	meta.observers = observers;
}
function setListeners(func, listeners) {
	let meta = createObserverListenerMetaFor(func);
	meta.listeners = listeners;
}
var IS_WRAPPED_FUNCTION_SET = /* @__PURE__ */ new WeakSet();
/**
Wraps the passed function so that `this._super` will point to the superFunc
when the function is invoked. This is the primitive we use to implement
calls to super.

@private
@method wrap
@for Ember
@param {Function} func The function to call
@param {Function} superFunc The super function.
@return {Function} wrapped function.
*/
function wrap(func, superFunc) {
	if (!hasSuper(func)) return func;
	if (!IS_WRAPPED_FUNCTION_SET.has(superFunc) && hasSuper(superFunc)) return _wrap(func, _wrap(superFunc, ROOT));
	return _wrap(func, superFunc);
}
function _wrap(func, superFunc) {
	function superWrapper() {
		let orig = this._super;
		this._super = superFunc;
		let ret = func.apply(this, arguments);
		this._super = orig;
		return ret;
	}
	IS_WRAPPED_FUNCTION_SET.add(superWrapper);
	let meta = OBSERVERS_LISTENERS_MAP.get(func);
	if (meta !== void 0) OBSERVERS_LISTENERS_MAP.set(superWrapper, meta);
	return superWrapper;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/events-DYrYz3V8.js
/**
@module @ember/object
*/
/**
Add an event listener

@method addListener
@static
@for @ember/object/events
@param obj
@param {String} eventName
@param {Object|Function} target A target object or a function
@param {Function|String} method A function or the name of a function to be called on `target`
@param {Boolean} once A flag whether a function should only be called once
@public
*/
function addListener(obj, eventName, target, method, once, sync = true) {
	if (!method && "function" === typeof target) {
		method = target;
		target = null;
	}
	meta(obj).addToListeners(eventName, target, method, once === true, sync);
}
/**
Remove an event listener

Arguments should match those passed to `addListener`.

@method removeListener
@static
@for @ember/object/events
@param obj
@param {String} eventName
@param {Object|Function} target A target object or a function
@param {Function|String} method A function or the name of a function to be called on `target`
@public
*/
function removeListener(obj, eventName, targetOrFunction, functionOrName) {
	let target, method;
	if (typeof targetOrFunction === "object") {
		target = targetOrFunction;
		method = functionOrName;
	} else {
		target = null;
		method = targetOrFunction;
	}
	meta(obj).removeFromListeners(eventName, target, method);
}
/**
Send an event. The execution of suspended listeners
is skipped, and once listeners are removed. A listener without
a target is executed on the passed object. If an array of actions
is not passed, the actions stored on the passed object are invoked.

@method sendEvent
@static
@for @ember/object/events
@param obj
@param {String} eventName
@param {Array} params Optional parameters for each listener.
@return {Boolean} if the event was delivered to one or more actions
@public
*/
function sendEvent(obj, eventName, params, actions, _meta) {
	if (actions === void 0) {
		let meta = _meta === void 0 ? peekMeta(obj) : _meta;
		actions = meta !== null ? meta.matchingListeners(eventName) : void 0;
	}
	if (actions === void 0 || actions.length === 0) return false;
	for (let i = actions.length - 3; i >= 0; i -= 3) {
		let target = actions[i];
		let method = actions[i + 1];
		let once = actions[i + 2];
		if (!method) continue;
		if (once) removeListener(obj, eventName, target, method);
		if (!target) target = obj;
		let type = typeof method;
		if (type === "string" || type === "symbol") method = target[method];
		method.apply(target, params);
	}
	return true;
}
/**
@public
@method hasListeners
@static
@for @ember/object/events
@param obj
@param {String} eventName
@return {Boolean} if `obj` has listeners for event `eventName`
*/
function hasListeners(obj, eventName) {
	let meta = peekMeta(obj);
	if (meta === null) return false;
	let matched = meta.matchingListeners(eventName);
	return matched !== void 0 && matched.length > 0;
}
/**
Define a property as a function that should be executed when
a specified event or events are triggered.

``` javascript
import EmberObject from '@ember/object';
import { on } from '@ember/object/evented';
import { sendEvent } from '@ember/object/events';

let Job = EmberObject.extend({
logCompleted: on('completed', function() {
console.log('Job completed!');
})
});

let job = Job.create();

sendEvent(job, 'completed'); // Logs 'Job completed!'
```

@method on
@static
@for @ember/object/evented
@param {String} eventNames*
@param {Function} func
@return {Function} the listener function, passed as last argument to on(...)
@public
*/
function on(...args) {
	let func = args.pop();
	setListeners(func, args);
	return func;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/observers-BmobpXAF.js
var AFTER_OBSERVERS = ":change";
function changeEvent(keyName) {
	return keyName + AFTER_OBSERVERS;
}
var SYNC_DEFAULT = !ENV._DEFAULT_ASYNC_OBSERVERS;
var SYNC_OBSERVERS = /* @__PURE__ */ new Map();
var ASYNC_OBSERVERS = /* @__PURE__ */ new Map();
/**
@module @ember/object
*/
/**
@method addObserver
@static
@for @ember/object/observers
@param obj
@param {String} path
@param {Object|Function} target
@param {Function|String} [method]
@public
*/
function addObserver(obj, path, target, method, sync = SYNC_DEFAULT) {
	let eventName = changeEvent(path);
	addListener(obj, eventName, target, method, false, sync);
	let meta = peekMeta(obj);
	if (meta === null || !(meta.isPrototypeMeta(obj) || meta.isInitializing())) activateObserver(obj, eventName, sync);
}
/**
@method removeObserver
@static
@for @ember/object/observers
@param obj
@param {String} path
@param {Object|Function} target
@param {Function|String} [method]
@public
*/
function removeObserver(obj, path, target, method, sync = SYNC_DEFAULT) {
	let eventName = changeEvent(path);
	let meta = peekMeta(obj);
	if (meta === null || !(meta.isPrototypeMeta(obj) || meta.isInitializing())) deactivateObserver(obj, eventName, sync);
	removeListener(obj, eventName, target, method);
}
function getOrCreateActiveObserversFor(target, sync) {
	let observerMap = sync === true ? SYNC_OBSERVERS : ASYNC_OBSERVERS;
	if (!observerMap.has(target)) {
		observerMap.set(target, /* @__PURE__ */ new Map());
		registerDestructor(target, () => destroyObservers(target), true);
	}
	return observerMap.get(target);
}
function activateObserver(target, eventName, sync = false) {
	let activeObservers = getOrCreateActiveObserversFor(target, sync);
	if (activeObservers.has(eventName)) activeObservers.get(eventName).count++;
	else {
		let path = eventName.substring(0, eventName.lastIndexOf(":"));
		let tag = getChainTagsForKey(target, path, tagMetaFor(target), peekMeta(target));
		activeObservers.set(eventName, {
			count: 1,
			path,
			tag,
			lastRevision: valueForTag(tag),
			suspended: false
		});
	}
}
var DEACTIVATE_SUSPENDED = false;
var SCHEDULED_DEACTIVATE = [];
function deactivateObserver(target, eventName, sync = false) {
	if (DEACTIVATE_SUSPENDED === true) {
		SCHEDULED_DEACTIVATE.push([
			target,
			eventName,
			sync
		]);
		return;
	}
	let observerMap = sync === true ? SYNC_OBSERVERS : ASYNC_OBSERVERS;
	let activeObservers = observerMap.get(target);
	if (activeObservers !== void 0) {
		let observer = activeObservers.get(eventName);
		observer.count--;
		if (observer.count === 0) {
			activeObservers.delete(eventName);
			if (activeObservers.size === 0) observerMap.delete(target);
		}
	}
}
function suspendedObserverDeactivation() {
	DEACTIVATE_SUSPENDED = true;
}
function resumeObserverDeactivation() {
	DEACTIVATE_SUSPENDED = false;
	for (let [target, eventName, sync] of SCHEDULED_DEACTIVATE) deactivateObserver(target, eventName, sync);
	SCHEDULED_DEACTIVATE = [];
}
/**
* Primarily used for cases where we are redefining a class, e.g. mixins/reopen
* being applied later. Revalidates all the observers, resetting their tags.
*
* @private
* @param target
*/
function revalidateObservers(target) {
	if (ASYNC_OBSERVERS.has(target)) ASYNC_OBSERVERS.get(target).forEach((observer) => {
		observer.tag = getChainTagsForKey(target, observer.path, tagMetaFor(target), peekMeta(target));
		observer.lastRevision = valueForTag(observer.tag);
	});
	if (SYNC_OBSERVERS.has(target)) SYNC_OBSERVERS.get(target).forEach((observer) => {
		observer.tag = getChainTagsForKey(target, observer.path, tagMetaFor(target), peekMeta(target));
		observer.lastRevision = valueForTag(observer.tag);
	});
}
var lastKnownRevision = 0;
function flushAsyncObservers(_schedule) {
	let currentRevision = valueForTag(CURRENT_TAG);
	if (lastKnownRevision === currentRevision) return;
	lastKnownRevision = currentRevision;
	ASYNC_OBSERVERS.forEach((activeObservers, target) => {
		let meta = peekMeta(target);
		activeObservers.forEach((observer, eventName) => {
			if (!validateTag(observer.tag, observer.lastRevision)) {
				let sendObserver = () => {
					try {
						sendEvent(target, eventName, [target, observer.path], void 0, meta);
					} finally {
						observer.tag = getChainTagsForKey(target, observer.path, tagMetaFor(target), peekMeta(target));
						observer.lastRevision = valueForTag(observer.tag);
					}
				};
				if (_schedule) _schedule("actions", sendObserver);
				else sendObserver();
			}
		});
	});
}
function flushSyncObservers() {
	SYNC_OBSERVERS.forEach((activeObservers, target) => {
		let meta = peekMeta(target);
		activeObservers.forEach((observer, eventName) => {
			if (!observer.suspended && !validateTag(observer.tag, observer.lastRevision)) try {
				observer.suspended = true;
				sendEvent(target, eventName, [target, observer.path], void 0, meta);
			} finally {
				observer.tag = getChainTagsForKey(target, observer.path, tagMetaFor(target), peekMeta(target));
				observer.lastRevision = valueForTag(observer.tag);
				observer.suspended = false;
			}
		});
	});
}
function setObserverSuspended(target, property, suspended) {
	let activeObservers = SYNC_OBSERVERS.get(target);
	if (!activeObservers) return;
	let observer = activeObservers.get(changeEvent(property));
	if (observer) observer.suspended = suspended;
}
function destroyObservers(target) {
	if (SYNC_OBSERVERS.size > 0) SYNC_OBSERVERS.delete(target);
	if (ASYNC_OBSERVERS.size > 0) ASYNC_OBSERVERS.delete(target);
}
//#endregion
export { ENV as C, wrap as S, ROOT as _, flushAsyncObservers as a, setListeners as b, resumeObserverDeactivation as c, suspendedObserverDeactivation as d, addListener as f, sendEvent as g, removeListener as h, addObserver as i, revalidateObservers as l, on as m, SYNC_OBSERVERS as n, flushSyncObservers as o, hasListeners as p, activateObserver as r, removeObserver as s, ASYNC_OBSERVERS as t, setObserverSuspended as u, checkHasSuper as v, getENV as w, setObservers as x, observerListenerMetaFor as y };
