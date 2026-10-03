import { _ as consumeTag, b as createUpdatableTag, s as DIRTY_TAG } from "./cache-CofLhaS4-CWmaBWeq.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/reactive/collections.js
var ARRAY_GETTER_METHODS = /* @__PURE__ */ new Set([
	Symbol.iterator,
	"concat",
	"entries",
	"every",
	"filter",
	"find",
	"findIndex",
	"flat",
	"flatMap",
	"forEach",
	"includes",
	"indexOf",
	"join",
	"keys",
	"lastIndexOf",
	"map",
	"reduce",
	"reduceRight",
	"slice",
	"some",
	"values"
]);
var ARRAY_WRITE_THEN_READ_METHODS = /* @__PURE__ */ new Set([
	"fill",
	"push",
	"unshift"
]);
function convertToInt(prop) {
	if (typeof prop === "symbol") return null;
	const num = Number(prop);
	if (isNaN(num)) return null;
	return num % 1 === 0 ? num : null;
}
var TrackedArray = class TrackedArray {
	#options;
	constructor(arr, options) {
		this.#options = options;
		const clone = arr.slice();
		const self = this;
		const boundFns = /* @__PURE__ */ new Map();
		/**
		Flag to track whether we have *just* intercepted a call to `.push()` or
		`.unshift()`, since in those cases (and only those cases!) the `Array`
		itself checks `.length` to return from the function call.
		*/
		let nativelyAccessingLengthFromWriteMethod = false;
		return new Proxy(clone, {
			get(target, prop) {
				const index = convertToInt(prop);
				if (index !== null) {
					self.#readStorageFor(index);
					consumeTag(self.#collection);
					return target[index];
				}
				if (prop === "length") {
					if (nativelyAccessingLengthFromWriteMethod) nativelyAccessingLengthFromWriteMethod = false;
					else consumeTag(self.#collection);
					return target[prop];
				}
				if (ARRAY_WRITE_THEN_READ_METHODS.has(prop)) nativelyAccessingLengthFromWriteMethod = true;
				if (ARRAY_GETTER_METHODS.has(prop)) {
					let fn = boundFns.get(prop);
					if (fn === void 0) {
						fn = (...args) => {
							consumeTag(self.#collection);
							return target[prop](...args);
						};
						boundFns.set(prop, fn);
					}
					return fn;
				}
				return target[prop];
			},
			set(target, prop, value) {
				if (self.#options.equals(target[prop], value)) return true;
				target[prop] = value;
				const index = convertToInt(prop);
				if (index !== null) {
					self.#dirtyStorageFor(index);
					self.#dirtyCollection();
				} else if (prop === "length") self.#dirtyCollection();
				return true;
			},
			getPrototypeOf() {
				return TrackedArray.prototype;
			}
		});
	}
	#collection = createUpdatableTag();
	#storages = /* @__PURE__ */ new Map();
	#readStorageFor(index) {
		let storage = this.#storages.get(index);
		if (storage === void 0) {
			storage = createUpdatableTag();
			this.#storages.set(index, storage);
		}
		consumeTag(storage);
	}
	#dirtyStorageFor(index) {
		const storage = this.#storages.get(index);
		if (storage) DIRTY_TAG(storage);
	}
	#dirtyCollection() {
		DIRTY_TAG(this.#collection);
		this.#storages.clear();
	}
};
Object.setPrototypeOf(TrackedArray.prototype, Array.prototype);
function trackedArray(data, options) {
	return new TrackedArray(data ?? [], {
		equals: options?.equals ?? Object.is,
		description: options?.description
	});
}
var TrackedObject = class TrackedObject {
	#options;
	#storages = /* @__PURE__ */ new Map();
	#collection = createUpdatableTag();
	#readStorageFor(key) {
		let storage = this.#storages.get(key);
		if (storage === void 0) {
			storage = createUpdatableTag();
			this.#storages.set(key, storage);
		}
		consumeTag(storage);
	}
	#dirtyStorageFor(key) {
		const storage = this.#storages.get(key);
		if (storage) DIRTY_TAG(storage);
	}
	#dirtyCollection() {
		DIRTY_TAG(this.#collection);
	}
	/**
	* This implementation of trackedObject is far too dynamic for TS to be happy with
	*/
	constructor(obj, options) {
		this.#options = options;
		const proto = Object.getPrototypeOf(obj);
		const descs = Object.getOwnPropertyDescriptors(obj);
		const clone = Object.create(proto);
		for (const prop in descs) Object.defineProperty(clone, prop, descs[prop]);
		const self = this;
		return new Proxy(clone, {
			get(target, prop) {
				self.#readStorageFor(prop);
				return target[prop];
			},
			has(target, prop) {
				self.#readStorageFor(prop);
				return prop in target;
			},
			ownKeys(target) {
				consumeTag(self.#collection);
				return Reflect.ownKeys(target);
			},
			set(target, prop, value) {
				if (self.#options.equals(target[prop], value)) return true;
				target[prop] = value;
				self.#dirtyStorageFor(prop);
				self.#dirtyCollection();
				return true;
			},
			deleteProperty(target, prop) {
				if (prop in target) {
					delete target[prop];
					self.#dirtyStorageFor(prop);
					self.#storages.delete(prop);
					self.#dirtyCollection();
				}
				return true;
			},
			getPrototypeOf() {
				return TrackedObject.prototype;
			}
		});
	}
};
function trackedObject(data, options) {
	return new TrackedObject(data ?? {}, {
		equals: options?.equals ?? Object.is,
		description: options?.description
	});
}
function trackedSet(data, options) {
	const equals = options?.equals ?? Object.is;
	const target = new Set(data ?? []);
	const collection = createUpdatableTag();
	const storages = /* @__PURE__ */ new Map();
	function storageFor(key) {
		let storage = storages.get(key);
		if (storage === void 0) {
			storage = createUpdatableTag();
			storages.set(key, storage);
		}
		return storage;
	}
	function dirtyStorageFor(key) {
		const storage = storages.get(key);
		if (storage) DIRTY_TAG(storage);
	}
	const proxy = new Proxy(target, { get(target, prop, receiver) {
		if (prop === "add") return function(value) {
			if (target.has(value)) {
				if (equals(value, value)) return proxy;
			} else DIRTY_TAG(collection);
			dirtyStorageFor(value);
			target.add(value);
			return proxy;
		};
		if (prop === "delete") return function(value) {
			if (!target.has(value)) return false;
			dirtyStorageFor(value);
			DIRTY_TAG(collection);
			storages.delete(value);
			return target.delete(value);
		};
		if (prop === "clear") return function() {
			if (target.size === 0) return;
			storages.forEach((s) => DIRTY_TAG(s));
			DIRTY_TAG(collection);
			storages.clear();
			target.clear();
		};
		if (prop === "has") return function(value) {
			consumeTag(storageFor(value));
			return target.has(value);
		};
		if (prop === "size") {
			consumeTag(collection);
			return target.size;
		}
		const value = Reflect.get(target, prop, receiver);
		if (typeof value === "function") return function(...args) {
			consumeTag(collection);
			return value.apply(target, args);
		};
		return value;
	} });
	return proxy;
}
/**
* NOTE: we cannot pass a WeakSet because WeakSets are not iterable
*/
/**
* Creates an instanceof WeakSet from an optional list of entries
*
*/
function trackedWeakSet(data, options) {
	const equals = options?.equals ?? Object.is;
	const target = new WeakSet(data ?? []);
	const storages = /* @__PURE__ */ new WeakMap();
	function storageFor(key) {
		let storage = storages.get(key);
		if (storage === void 0) {
			storage = createUpdatableTag();
			storages.set(key, storage);
		}
		return storage;
	}
	function dirtyStorageFor(key) {
		const storage = storages.get(key);
		if (storage) DIRTY_TAG(storage);
	}
	const proxy = new Proxy(target, { get(target, prop, receiver) {
		if (prop === "add") return function(value) {
			/**
			* In a WeakSet, there is no `.get()`, but if there was,
			* we could assume it's the same value as what we passed.
			*
			* So for a WeakSet, if we try to add something that already exists
			* we no-op.
			*
			* WeakSet already does this internally for us,
			* but we want the ability for the reactive behavior to reflect the same behavior.
			*
			* i.e.: doing weakSet.add(value) should never dirty with the defaults
			*       if the `value` is already in the weakSet
			*/
			if (target.has(value)) {
				if (equals(value, value)) return proxy;
			}
			target.add(value);
			dirtyStorageFor(value);
			return proxy;
		};
		if (prop === "delete") return function(value) {
			if (!target.has(value)) return false;
			dirtyStorageFor(value);
			storages.delete(value);
			return target.delete(value);
		};
		if (prop === "has") return function(value) {
			consumeTag(storageFor(value));
			return target.has(value);
		};
		const value = Reflect.get(target, prop, receiver);
		if (typeof value === "function") return value.bind(target);
		return value;
	} });
	return proxy;
}
function trackedMap(data, options) {
	const equals = options?.equals ?? Object.is;
	const target = data instanceof Map ? new Map(data.entries()) : new Map(data ?? []);
	const collection = createUpdatableTag();
	const storages = /* @__PURE__ */ new Map();
	function storageFor(key) {
		let storage = storages.get(key);
		if (storage === void 0) {
			storage = createUpdatableTag();
			storages.set(key, storage);
		}
		return storage;
	}
	function dirtyStorageFor(key) {
		const storage = storages.get(key);
		if (storage) DIRTY_TAG(storage);
	}
	const proxy = new Proxy(target, { get(target, prop, receiver) {
		if (prop === "set") return function(key, value) {
			if (target.has(key)) {
				if (equals(target.get(key), value)) return proxy;
			}
			dirtyStorageFor(key);
			DIRTY_TAG(collection);
			target.set(key, value);
			return proxy;
		};
		if (prop === "delete") return function(key) {
			if (!target.has(key)) return false;
			dirtyStorageFor(key);
			DIRTY_TAG(collection);
			storages.delete(key);
			return target.delete(key);
		};
		if (prop === "clear") return function() {
			if (target.size === 0) return;
			storages.forEach((s) => DIRTY_TAG(s));
			storages.clear();
			DIRTY_TAG(collection);
			target.clear();
		};
		if (prop === "get") return function(key) {
			consumeTag(storageFor(key));
			return target.get(key);
		};
		if (prop === "has") return function(key) {
			consumeTag(storageFor(key));
			return target.has(key);
		};
		if (prop === "size") {
			consumeTag(collection);
			return target.size;
		}
		const value = Reflect.get(target, prop, receiver);
		if (typeof value === "function") return function(...args) {
			consumeTag(collection);
			return value.apply(target, args);
		};
		return value;
	} });
	return proxy;
}
function trackedWeakMap(data, options) {
	const equals = options?.equals ?? Object.is;
	const existing = data ?? [];
	/**
	* SAFETY: note that when passing in an existing weak map, we can't
	*         clone it as it is not iterable and not a supported type of structuredClone
	*/
	const target = existing instanceof WeakMap ? existing : new WeakMap(existing);
	const storages = /* @__PURE__ */ new WeakMap();
	function storageFor(key) {
		let storage = storages.get(key);
		if (storage === void 0) {
			storage = createUpdatableTag();
			storages.set(key, storage);
		}
		return storage;
	}
	function dirtyStorageFor(key) {
		const storage = storages.get(key);
		if (storage) DIRTY_TAG(storage);
	}
	const proxy = new Proxy(target, { get(target, prop, receiver) {
		if (prop === "set") return function(key, value) {
			if (target.has(key)) {
				if (equals(target.get(key), value)) return proxy;
			}
			dirtyStorageFor(key);
			target.set(key, value);
			return proxy;
		};
		if (prop === "delete") return function(key) {
			if (!target.has(key)) return false;
			dirtyStorageFor(key);
			storages.delete(key);
			return target.delete(key);
		};
		if (prop === "get") return function(key) {
			consumeTag(storageFor(key));
			return target.get(key);
		};
		if (prop === "has") return function(key) {
			consumeTag(storageFor(key));
			return target.has(key);
		};
		const value = Reflect.get(target, prop, receiver);
		if (typeof value === "function") return value.bind(target);
		return value;
	} });
	return proxy;
}
//#endregion
export { trackedWeakMap as a, trackedSet as i, trackedMap as n, trackedWeakSet as o, trackedObject as r, trackedArray as t };
