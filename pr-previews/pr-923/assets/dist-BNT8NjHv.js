import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { i as initializeDeferredDecorator, n as decorateFieldV2 } from "./runtime--fcdnjmJ-C97hxBku.js";
import { c as isDestroying, s as isDestroyed } from "./destroyable-BW6N5j2P.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { n as tracked } from "./tracked-DvOpYI0o-BARN4wIl.js";
import { t as Component } from "./dist-DnJA6M4U.js";
import { d as hash } from "./helper-DTHs5pWM.js";
import { n as modifier } from "./dist-RcuypXjO.js";
import { t as esCompat } from "./es-compat2-D1cSJc1a.js";
import { a as trackedWeakMap, i as trackedSet, n as trackedMap, o as trackedWeakSet, t as trackedArray } from "./collections-Ce02tfk0.js";
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/components/scroller.js
var Scroller = class extends Component {
	ref = modifier((el) => {
		this.withinElement = el;
	});
	#frame;
	scrollToBottom = () => {
		if (this.#frame) cancelAnimationFrame(this.#frame);
		this.#frame = requestAnimationFrame(() => {
			if (isDestroyed(this) || isDestroying(this)) return;
			this.withinElement.scrollTo({
				top: this.withinElement.scrollHeight,
				behavior: "auto"
			});
		});
	};
	scrollToTop = () => {
		if (this.#frame) cancelAnimationFrame(this.#frame);
		this.#frame = requestAnimationFrame(() => {
			if (isDestroyed(this) || isDestroying(this)) return;
			this.withinElement.scrollTo({
				top: 0,
				behavior: "auto"
			});
		});
	};
	scrollToLeft = () => {
		if (this.#frame) cancelAnimationFrame(this.#frame);
		this.#frame = requestAnimationFrame(() => {
			if (isDestroyed(this) || isDestroying(this)) return;
			this.withinElement.scrollTo({
				left: 0,
				behavior: "auto"
			});
		});
	};
	scrollToRight = () => {
		if (this.#frame) cancelAnimationFrame(this.#frame);
		this.#frame = requestAnimationFrame(() => {
			if (isDestroyed(this) || isDestroying(this)) return;
			this.withinElement.scrollTo({
				left: this.withinElement.scrollWidth,
				behavior: "auto"
			});
		});
	};
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[11,0],[24,\"tabindex\",\"0\"],[17,1],[4,[30,0,[\"ref\"]],null,null],[12],[1,\"\\n  \"],[18,2,[[28,[32,0],null,[[\"scrollToBottom\",\"scrollToTop\",\"scrollToLeft\",\"scrollToRight\"],[[30,0,[\"scrollToBottom\"]],[30,0,[\"scrollToTop\"]],[30,0,[\"scrollToLeft\"]],[30,0,[\"scrollToRight\"]]]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({ hash }),
			"isStrictMode": true
		}), this);
	}
};
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/new/map.js
var map_exports = /* @__PURE__ */ __exportAll({
	TrackedMap: () => TrackedMap$1,
	TrackedWeakMap: () => TrackedWeakMap$1
});
var mapConfig = {
	equals: () => false,
	description: "TrackedMap from tracked-built-ins"
};
var weakMapConfig = {
	equals: () => false,
	description: "TrackedWeakMap from tracked-built-ins"
};
var TrackedMap$1 = class TrackedMap$1 {
	constructor(existing) {
		const reactive = trackedMap(existing, mapConfig);
		return new Proxy(reactive, {
			get(target, prop) {
				const value = Reflect.get(target, prop, target);
				if (typeof value === "function") return value.bind(target);
				return value;
			},
			getPrototypeOf() {
				return TrackedMap$1.prototype;
			}
		});
	}
};
var TrackedWeakMap$1 = class TrackedWeakMap$1 {
	constructor(values) {
		const reactive = trackedWeakMap(values, weakMapConfig);
		return new Proxy(reactive, {
			get(target, prop) {
				const value = Reflect.get(target, prop, target);
				if (typeof value === "function") return value.bind(target);
				return value;
			},
			getPrototypeOf() {
				return TrackedWeakMap$1.prototype;
			}
		});
	}
};
Object.setPrototypeOf(TrackedMap$1.prototype, Map.prototype);
Object.setPrototypeOf(TrackedWeakMap$1.prototype, WeakMap.prototype);
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/map.js
var TrackedMap;
/**
* https://rfcs.emberjs.com/id/1068-tracked-collections
*/
{
	const module = esCompat(map_exports);
	TrackedMap = module.TrackedMap;
	module.TrackedWeakMap;
}
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/new/set.js
var set_exports = /* @__PURE__ */ __exportAll({
	TrackedSet: () => TrackedSet$1,
	TrackedWeakSet: () => TrackedWeakSet$1
});
var setConfig = {
	equals: () => false,
	description: "TrackedSet from tracked-built-ins"
};
var weakSetConfig = {
	equals: () => false,
	description: "TrackedWeakSet from tracked-built-ins"
};
var TrackedSet$1 = class TrackedSet$1 {
	constructor(existing) {
		const reactive = trackedSet(existing, setConfig);
		return new Proxy(reactive, {
			get(target, prop) {
				const value = Reflect.get(target, prop, target);
				if (typeof value === "function") return value.bind(target);
				return value;
			},
			getPrototypeOf() {
				return TrackedSet$1.prototype;
			}
		});
	}
};
var TrackedWeakSet$1 = class TrackedWeakSet$1 {
	constructor(values) {
		const reactive = trackedWeakSet(values, weakSetConfig);
		return new Proxy(reactive, {
			get(target, prop) {
				const value = Reflect.get(target, prop, target);
				if (typeof value === "function") return value.bind(target);
				return value;
			},
			getPrototypeOf() {
				return TrackedWeakSet$1.prototype;
			}
		});
	}
};
Object.setPrototypeOf(TrackedSet$1.prototype, Set.prototype);
Object.setPrototypeOf(TrackedWeakSet$1.prototype, WeakSet.prototype);
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/set.js
var TrackedSet;
/**
* https://rfcs.emberjs.com/id/1068-tracked-collections
*/
{
	const module = esCompat(set_exports);
	TrackedSet = module.TrackedSet;
	module.TrackedWeakSet;
}
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/new/array.js
var array_exports = /* @__PURE__ */ __exportAll({ TrackedArray: () => TrackedArray$1 });
var config = {
	equals: () => false,
	description: "TrackedArray from tracked-built-ins"
};
var TrackedArray$1 = class TrackedArray$1 {
	static from(iterable, mapfn, thisArg) {
		return mapfn ? new TrackedArray$1(Array.from(iterable, mapfn, thisArg)) : new TrackedArray$1(Array.from(iterable));
	}
	static of(...arr) {
		return new TrackedArray$1(arr);
	}
	constructor(arr = []) {
		const reactive = trackedArray(arr, config);
		return new Proxy(reactive, { getPrototypeOf() {
			return TrackedArray$1.prototype;
		} });
	}
};
Object.setPrototypeOf(TrackedArray$1.prototype, Array.prototype);
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/array.js
var TrackedArray = esCompat(array_exports).TrackedArray;
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/tracked-storage.js
var TrackedStorageImpl = class {
	static {
		decorateFieldV2(this.prototype, "_value", [tracked]);
	}
	#_value = (initializeDeferredDecorator(this, "_value"), void 0);
	_lastValue;
	_isEqual;
	constructor(initialValue, isEqual) {
		this._value = this._lastValue = initialValue;
		this._isEqual = isEqual;
	}
};
function tripleEq(a, b) {
	return a === b;
}
function createStorage(initialValue, isEqual = tripleEq) {
	return new TrackedStorageImpl(initialValue, isEqual);
}
function getValue(storage) {
	return storage._value;
}
function setValue(storage, value) {
	const { _isEqual: isEqual, _lastValue: lastValue } = storage;
	if (!isEqual(value, lastValue)) storage._value = storage._lastValue = value;
}
//#endregion
//#region ../node_modules/.pnpm/tracked-built-ins@4.1.2_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/tracked-built-ins/dist/-private/old/object.js
var object_exports = /* @__PURE__ */ __exportAll({
	TrackedObject: () => TrackedObject$1,
	default: () => TrackedObject$1
});
var TrackedObject$1 = class TrackedObjectImplementation {
	static fromEntries(entries) {
		return new TrackedObject$1(Object.fromEntries(entries));
	}
	constructor(obj = {}) {
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
				getValue(self.#collection);
				return Reflect.ownKeys(target);
			},
			set(target, prop, value) {
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
				return TrackedObjectImplementation.prototype;
			}
		});
	}
	#storages = /* @__PURE__ */ new Map();
	#collection = createStorage(null, () => false);
	#readStorageFor(key) {
		let storage = this.#storages.get(key);
		if (storage === void 0) {
			storage = createStorage(null, () => false);
			this.#storages.set(key, storage);
		}
		getValue(storage);
	}
	#dirtyStorageFor(key) {
		const storage = this.#storages.get(key);
		if (storage) setValue(storage, null);
	}
	#dirtyCollection() {
		setValue(this.#collection, null);
	}
};
esCompat(object_exports).default;
//#endregion
export { Scroller as i, TrackedSet as n, TrackedMap as r, TrackedArray as t };
