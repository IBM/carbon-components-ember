//#region ../node_modules/.pnpm/@ember+test-waiters@4.1.2_supports-color@8.1.1/node_modules/@ember/test-waiters/dist/index.js
var WAITERS = function() {
	const HAS_SYMBOL = typeof Symbol !== "undefined";
	const symbolName = "TEST_WAITERS";
	const symbol = HAS_SYMBOL ? Symbol.for(symbolName) : symbolName;
	const global = getGlobal();
	let waiters = global[symbol];
	if (waiters === void 0) waiters = global[symbol] = /* @__PURE__ */ new Map();
	return waiters;
}();
function indexable(input) {
	return input;
}
function getGlobal() {
	if (typeof globalThis !== "undefined") return indexable(globalThis);
	if (typeof self !== "undefined") return indexable(self);
	if (typeof window !== "undefined") return indexable(window);
	throw new Error("unable to locate global object");
}
/**
* Registers a waiter.
*
* @public
* @param waiter {Waiter} A test waiter instance
*/
function register(waiter) {
	WAITERS.set(waiter.name, waiter);
}
/**
* Un-registers a waiter.
*
* @public
* @param waiter {Waiter} A test waiter instance
*/
function unregister(waiter) {
	WAITERS.delete(waiter.name);
}
/**
* Gets an array of all waiters current registered.
*
* @public
* @returns {Waiter[]}
*/
function getWaiters() {
	const result = [];
	WAITERS.forEach((value) => {
		result.push(value);
	});
	return result;
}
/**
* Clears all waiters.
*
* @private
*/
function _reset() {
	for (const waiter of getWaiters()) waiter.isRegistered = false;
	WAITERS.clear();
}
/**
* Gets the current state of all waiters. Any waiters whose
* `waitUntil` method returns false will be considered `pending`.
*
* @returns {PendingWaiterState} An object containing a count of all waiters
* pending and a `waiters` object containing the name of all pending waiters
* and their debug info.
*/
function getPendingWaiterState() {
	const result = {
		pending: 0,
		waiters: {}
	};
	WAITERS.forEach((waiter) => {
		if (!waiter.waitUntil()) {
			result.pending++;
			const debugInfo = waiter.debugInfo();
			result.waiters[waiter.name] = debugInfo || true;
		}
	});
	return result;
}
/**
* Determines if there are any pending waiters.
*
* @returns {boolean} `true` if there are pending waiters, otherwise `false`.
*/
function hasPendingWaiters() {
	return getPendingWaiterState().pending > 0;
}
function _resetWaiterNames() {}
var NoopTestWaiter = class {
	name;
	constructor(name) {
		this.name = name;
	}
	beginAsync() {
		return this;
	}
	endAsync() {}
	waitUntil() {
		return true;
	}
	debugInfo() {
		return [];
	}
	reset() {}
};
/**
* Builds and returns a test waiter. The type of the
* returned waiter is dependent on whether the app or
* addon is in `isDevelopingApp()` mode or not.
*
* @public
*
* @param name {string} The name of the test waiter
* @returns {TestWaiter}
*
* @example
*
* import Component from '@ember/component';
* import { buildWaiter } from '@ember/test-waiters';
*
* if (macroCondition(isDevelopingApp())) {
*   let waiter = buildWaiter('friend-waiter');
* }
*
* export default class Friendz extends Component {
*   didInsertElement() {
*     let token = waiter.beginAsync(this);
*
*     someAsyncWork().then(() => {
*       waiter.endAsync(token);
*     });
*   }
* }
*/
function buildWaiter(name) {
	return new NoopTestWaiter(name);
}
buildWaiter("@ember/test-waiters:promise-waiter");
/**
* A convenient utility function to simplify waiting for a promise.
*
* @public
* @param promise {Promise<T> | RSVP.Promise<T>} The promise to track async operations for
* @param label {string} An optional string to identify the promise
*
* @example
*
* import Component from '@ember/component';
* import { waitForPromise } from '@ember/test-waiters';
*
* export default class Friendz extends Component {
*   didInsertElement() {
*     waitForPromise(new Promise(resolve => {
*       doSomeWork();
*       resolve();
*     }));
*   }
* }
*/
function waitForPromise(promise, label) {
	return promise;
}
/**
* A convenient utility function to simplify waiting for async. Can be used
* in both decorator and function form. When applied to an async function, it
* will cause tests to wait until the returned promise has resolves. When
* applied to a generator function, it will cause tests to wait until the
* returned iterator has run to completion, which is useful for wrapping
* ember-concurrency task functions.
*
*
* @public
* @param promise {Function} An async function or a generator function
* @param label {string} An optional string to identify the promise
*
* @example
*
* import Component from '@ember/component';
* import { waitFor } from '@ember/test-waiters';
*
* export default Component.extend({
*   doAsyncStuff: waitFor(async function doAsyncStuff() {
*     await somethingAsync();
*   }
* });
*
* @example
*
* import Component from '@ember/component';
* import { waitFor } from '@ember/test-waiters';
*
* export default class Friendz extends Component {
*   @waitFor
*   async doAsyncStuff() {
*     await somethingAsync();
*   }
* }
*
*/
function waitFor(...args) {
	if (args.length < 3) {
		const [fn, label] = args;
		return wrapFunction(fn, label);
	} else {
		const [, , descriptor, label] = args;
		return descriptor;
	}
}
function wrapFunction(fn, label) {
	return fn;
}
buildWaiter("@ember/test-waiters:generator-waiter");
var props = [
	"body",
	"bodyUsed",
	"headers",
	"ok",
	"redirected",
	"status",
	"statusText",
	"type",
	"url"
];
function isResponseProperty(maybeProp) {
	return props.some((prop) => maybeProp === prop);
}
var fns = [
	"arrayBuffer",
	"blob",
	"bytes",
	"clone",
	"formData",
	"json",
	"text"
];
function isResponseFn(maybeFn) {
	return fns.some((fn) => maybeFn === fn);
}
/**
* Wraps the fetch promise in a test waiter, and also wraps the returned promises' async functions (like json()) in a
* test waiter.
*/
async function waitForFetch(fetchPromise) {
	const response = await waitForPromise(fetchPromise);
	return new Proxy(response, { get(target, prop, receiver) {
		if (typeof prop === "string" && isResponseProperty(prop)) return target[prop];
		const original = Reflect.get(target, prop, receiver);
		if (typeof prop === "string" && isResponseFn(prop)) {
			if (prop === "clone") return (...args) => {
				return original.call(target, ...args);
			};
			return (...args) => {
				return waitForPromise(original.call(target, ...args));
			};
		}
		return original;
	} });
}
//#endregion
export { getWaiters as a, unregister as c, waitForPromise as d, getPendingWaiterState as i, waitFor as l, _resetWaiterNames as n, hasPendingWaiters as o, buildWaiter as r, register as s, _reset as t, waitForFetch as u };
