import { _ as consumeTag, b as createUpdatableTag, s as DIRTY_TAG } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, t as dirtyTagFor } from "./meta-BJtIZDir-Dn71zgvo.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/tracked-value-CR6kx-73.js
function trackedData(key, initializer) {
	let values = /* @__PURE__ */ new WeakMap();
	let hasInitializer = typeof initializer === "function";
	function getter(self) {
		consumeTag(tagFor(self, key));
		let value;
		if (hasInitializer && !values.has(self)) {
			value = initializer.call(self);
			values.set(self, value);
		} else value = values.get(self);
		return value;
	}
	function setter(self, value) {
		dirtyTagFor(self, key);
		values.set(self, value);
	}
	return {
		getter,
		setter
	};
}
/**
* A mutable reactive value.
*
* Reading `value` consumes the underlying tag (entangling with any active
* tracking frame), and writing `value` dirties it.
*/
/**
* A reactive value that can only be read.
*/
var TrackedValue = class {
	#isFrozen = false;
	#value;
	#options;
	#tag;
	constructor(value, options) {
		this.#value = value;
		this.#options = options;
		this.#tag = createUpdatableTag();
	}
	/**
	* The underlying value.
	*
	* Reading entangles with the current tracking frame, and writing notifies
	* consumers (unless the configured `equals` deems the new value equal to
	* the current one).
	*/
	get value() {
		consumeTag(this.#tag);
		return this.#value;
	}
	set value(value) {
		this.set(value);
	}
	/**
	* Function short-hand for reading `value`.
	*/
	get = () => {
		return this.value;
	};
	/**
	* Function short-hand for assigning `value`.
	*
	* Returns `true` if the value changed (and consumers were notified),
	* `false` if the new value was equal to the current one.
	*/
	set = (value) => {
		if (this.#isFrozen) throw new Error(`Cannot update a frozen TrackedValue${this.#options.description ? ` (\`${this.#options.description}\`)` : ""}`);
		if (this.#options.equals(this.#value, value)) return false;
		this.#value = value;
		DIRTY_TAG(this.#tag);
		return true;
	};
	/**
	* Update the value based on the current value, without consuming it.
	*/
	update = (updater) => {
		this.set(updater(this.#value));
	};
	/**
	* Prevents further updates, making the TrackedValue behave as a
	* ReadOnlyReactive.
	*/
	freeze = () => {
		this.#isFrozen = true;
	};
};
function trackedValue(value, options) {
	return new TrackedValue(value, {
		equals: options?.equals ?? Object.is,
		description: options?.description
	});
}
//#endregion
export { trackedData as n, trackedValue as r, TrackedValue as t };
