import { n as registerDestructor } from "./destroyable-Cwxqj0yK.js";
import { t as ClassBasedModifier } from "./dist-RcuypXjO.js";
import { n as findOwner, t as createStore } from "./store-Bk3Ws1qU.js";
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/resize-observer.js
/**
* Creates or returns the ResizeObserverManager.
*
* Only one of these will exist per owner.
*
* Has only two methods:
* - observe(element, callback: (resizeObserverEntry) => void)
* - unobserve(element, callback: (resizeObserverEntry) => void)
*
* Like with the underlying ResizeObserver API (and all event listeners),
* the callback passed to unobserved must be the same reference as the one
* passed to observe.
*/
function resizeObserver(context) {
	const owner = findOwner(context);
	return createStore(owner, ResizeObserverManager);
}
var ResizeObserverManager = class {
	#callbacks = /* @__PURE__ */ new WeakMap();
	#handleResize = (entries) => {
		for (const entry of entries) {
			const callbacks = this.#callbacks.get(entry.target);
			if (callbacks) for (const callback of callbacks) callback(entry);
		}
	};
	#observer = new ResizeObserver(this.#handleResize);
	constructor() {
		ignoreROError();
		registerDestructor(this, () => {
			this.#observer?.disconnect();
		});
	}
	/**
	* Initiate the observing of the `element` or add an additional `callback`
	* if the `element` is already observed.
	*
	* @param {object} element
	* @param {function} callback The `callback` is called whenever the size of
	*    the `element` changes. It is called with `ResizeObserverEntry` object
	*    for the particular `element`.
	*/
	observe(element, callback) {
		const callbacks = this.#callbacks.get(element);
		if (callbacks) callbacks.add(callback);
		else {
			this.#callbacks.set(element, /* @__PURE__ */ new Set([callback]));
			this.#observer.observe(element);
		}
	}
	/**
	* End the observing of the `element` or just remove the provided `callback`.
	*
	* It will unobserve the `element` if the `callback` is not provided
	* or there are no more callbacks left for this `element`.
	*
	* @param {object} element
	* @param {function?} callback - The `callback` to remove from the listeners
	*   of the `element` size changes.
	*/
	unobserve(element, callback) {
		const callbacks = this.#callbacks.get(element);
		if (!callbacks) return;
		callbacks.delete(callback);
		if (!callback || !callbacks.size) {
			this.#callbacks.delete(element);
			this.#observer.unobserve(element);
		}
	}
};
var errorMessages = ["ResizeObserver loop limit exceeded", "ResizeObserver loop completed with undelivered notifications."];
/**
* Ignores "ResizeObserver loop limit exceeded" error in Ember tests.
*
* This "error" is safe to ignore as it is just a warning message,
* telling that the "looping" observation will be skipped in the current frame,
* and will be delivered in the next one.
*
* For some reason, it is fired as an `error` event at `window` failing Ember
* tests and exploding Sentry with errors that must be ignored.
*/
function ignoreROError() {
	if (typeof window.onerror !== "function") return;
	const onError = window.onerror;
	window.onerror = (...args) => {
		const [message] = args;
		if (typeof message === "string") {
			if (errorMessages.includes(message)) return true;
		}
		onError(...args);
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/on-resize.js
var OnResize = class extends ClassBasedModifier {
	#callback = null;
	#element = null;
	#resizeObserver = resizeObserver(this);
	constructor(owner, args) {
		super(owner, args);
		registerDestructor(this, () => {
			if (this.#element && this.#callback) this.#resizeObserver.unobserve(this.#element, this.#callback);
		});
	}
	modify(element, [callback]) {
		if (this.#element && this.#callback) this.#resizeObserver.unobserve(this.#element, this.#callback);
		this.#resizeObserver.observe(element, callback);
		this.#callback = callback;
		this.#element = element;
	}
};
var onResize = OnResize;
//#endregion
export { ignoreROError as n, onResize as t };
