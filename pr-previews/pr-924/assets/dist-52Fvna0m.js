import { n as owner_exports } from "./owner-DvxyMhs3.js";
import { i as destroy, r as associateDestroyableChild } from "./destroyable-BW6N5j2P.js";
import { C as getValue, v as createCache } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tracked } from "./tracked-DvOpYI0o-BARN4wIl.js";
import { n as registerDestructor } from "./destroyable-Cwxqj0yK.js";
import { f as invokeHelper, r as capabilities, v as setHelperManager } from "./helper-DTHs5pWM.js";
import { t as esCompat } from "./es-compat2-D1cSJc1a.js";
import { n as validator_exports } from "./validator-blLXCJdd.js";
//#region ../node_modules/.pnpm/ember-resources@7.1.0_@glimmer+component@2.1.1_supports-color@8.1.1__@glint+template@1.9.0_supports-color@8.1.1/node_modules/ember-resources/dist/index.js
var INTERMEDIATE_VALUE = "__Intermediate_Value__";
var INTERNAL = "__INTERNAL__";
var CURRENT = Symbol("ember-resources::CURRENT");
var __defProp = Object.defineProperty;
var __decorateClass = (decorators, target, key, kind) => {
	var result = void 0;
	for (var i = decorators.length - 1, decorator; i >= 0; i--) if (decorator = decorators[i]) result = decorator(target, key, result) || result;
	if (result) __defProp(target, key, result);
	return result;
};
var ReadonlyCell = class {
	#getter;
	constructor(getter) {
		this.#getter = getter;
	}
	toHTML() {}
	get [CURRENT]() {
		return this.current;
	}
	get current() {
		return this.#getter();
	}
};
var Cell = class {
	get [CURRENT]() {
		return this.current;
	}
	toHTML() {}
	constructor(initialValue) {
		if (initialValue !== void 0) this.current = initialValue;
	}
	/**
	* Toggles the value of `current` only if
	* `current` is a boolean -- errors otherwise
	*/
	toggle = () => {
		this.current = !this.current;
	};
	/**
	* Updates the value of `current`
	* by calling a function that receives the previous value.
	*/
	update = (updater) => {
		this.current = updater(this.current);
	};
	/**
	* Updates the value of `current`
	*/
	set = (nextValue) => {
		this.current = nextValue;
	};
	/**
	* Returns the current value.
	*/
	read = () => this.current;
};
__decorateClass([tracked], Cell.prototype, "current");
function cell(initialValue) {
	if (initialValue !== void 0) return new Cell(initialValue);
	return new Cell();
}
var CellManager = class {
	capabilities = capabilities("3.23", { hasValue: true });
	createHelper(cell2) {
		return cell2;
	}
	getValue(cell2) {
		return cell2.current;
	}
};
var cellEvaluator = new CellManager();
setHelperManager(() => cellEvaluator, Cell.prototype);
setHelperManager(() => cellEvaluator, ReadonlyCell.prototype);
var compatOwner = {};
compatOwner.getOwner = esCompat(owner_exports).getOwner;
compatOwner.setOwner = esCompat(owner_exports).setOwner;
var setOwner$1 = compatOwner.setOwner;
var ResourceInvokerManager = class {
	constructor(owner) {
		this.owner = owner;
	}
	capabilities = capabilities("3.23", {
		hasValue: true,
		hasDestroyable: true
	});
	createHelper(fn, args) {
		let previous;
		const cache = createCache(() => {
			let resource2 = fn(...[...args.positional, args.named]);
			setOwner$1(resource2, this.owner);
			let result = invokeHelper(cache, resource2);
			if (previous) destroy(previous);
			previous = result;
			return result;
		});
		setOwner$1(cache, this.owner);
		return { cache };
	}
	/**
	* getValue is re-called when args change
	*/
	getValue({ cache }) {
		let resource2 = getValue(cache);
		associateDestroyableChild(cache, resource2);
		return getValue(resource2);
	}
	getDestroyable({ cache }) {
		return cache;
	}
};
function resourceFactory(wrapperFn) {
	setHelperManager(ResourceInvokerFactory, wrapperFn);
	return wrapperFn;
}
var ResourceInvokerFactory = (owner) => {
	return new ResourceInvokerManager(owner);
};
var setOwner = compatOwner.setOwner;
var TrackedValue = esCompat(validator_exports).TrackedValue;
var FunctionResourceManager = class {
	constructor(owner) {
		this.owner = owner;
	}
	capabilities = capabilities("3.23", {
		hasValue: true,
		hasDestroyable: true
	});
	/**
	* Resources do not take args.
	* However, they can access tracked data
	*/
	createHelper(config) {
		let { definition: fn } = config;
		let thisFn = fn.bind(null);
		let previousFn;
		let usableCache = /* @__PURE__ */ new WeakMap();
		let owner = this.owner;
		let cache = createCache(() => {
			if (previousFn) destroy(previousFn);
			let currentFn = thisFn.bind(null);
			associateDestroyableChild(thisFn, currentFn);
			previousFn = currentFn;
			return currentFn({
				on: { cleanup: (destroyer) => {
					registerDestructor(currentFn, destroyer);
				} },
				use: (usable) => {
					let previousCache = usableCache.get(usable);
					if (previousCache) destroy(previousCache);
					let nestedCache = invokeHelper(cache, usable);
					associateDestroyableChild(currentFn, nestedCache);
					usableCache.set(usable, nestedCache);
					return new ReadonlyCell(() => {
						let cache2 = usableCache.get(usable);
						return getValue(cache2);
					});
				},
				owner: this.owner
			});
		});
		setOwner(cache, owner);
		return {
			fn: thisFn,
			cache
		};
	}
	getValue({ cache }) {
		let maybeValue = getValue(cache);
		if (typeof maybeValue === "function") return maybeValue();
		if (isReactive(maybeValue)) return maybeValue[CURRENT];
		if (TrackedValue && maybeValue instanceof TrackedValue) return maybeValue.value;
		return maybeValue;
	}
	getDestroyable({ fn }) {
		return fn;
	}
};
function isReactive(maybe) {
	return typeof maybe === "object" && maybe !== null && CURRENT in maybe;
}
var ResourceManagerFactory = (owner) => {
	return new FunctionResourceManager(owner);
};
function use(...args) {
	if (args.length === 3) return initializerDecorator(...args);
	if (args.length === 2) {
		if (typeof args[1] !== "string" && typeof args[1] !== "symbol") return classContextLink(args[0], args[1]);
	}
	if (args.length === 1) return argumentToDecorator(args[0]);
}
function getCurrentValue(value) {
	if (typeof value === "object" && value !== null && "current" in value) return value.current;
	return value;
}
function classContextLink(context, definition) {
	let cache;
	return new ReadonlyCell(() => {
		if (!cache) {
			cache = invokeHelper(context, definition);
			associateDestroyableChild(context, cache);
		}
		return getCurrentValue(getValue(cache));
	});
}
function argumentToDecorator(definition) {
	return (_prototype, key, descriptor) => {
		if (!descriptor) return;
		return descriptorGetter(definition);
	};
}
var USABLES = /* @__PURE__ */ new Map();
function registerUsable(type, useFn) {
	USABLES.set(type, useFn);
}
function descriptorGetter(initializer) {
	let caches = /* @__PURE__ */ new WeakMap();
	return { get() {
		let cache = caches.get(this);
		if (!cache) {
			let config = typeof initializer === "function" ? initializer.call(this) : initializer;
			cache = USABLES.get(config.type)(this, config);
			caches.set(this, cache);
			associateDestroyableChild(this, cache);
		}
		return getCurrentValue(getValue(cache));
	} };
}
function initializerDecorator(_prototype, key, descriptor) {
	if (!descriptor) return;
	let { initializer } = descriptor;
	return descriptorGetter(initializer);
}
function wrapForPlainUsage(context, setup) {
	let cache;
	return new Proxy({ get [INTERMEDIATE_VALUE]() {
		if (!cache) cache = invokeHelper(context, setup);
		return getValue(cache);
	} }, {
		get(target2, key) {
			const state = target2[INTERMEDIATE_VALUE];
			return Reflect.get(state, key, state);
		},
		ownKeys(target2) {
			const value = target2[INTERMEDIATE_VALUE];
			return Reflect.ownKeys(value);
		},
		getOwnPropertyDescriptor(target2, key) {
			const value = target2[INTERMEDIATE_VALUE];
			return Reflect.getOwnPropertyDescriptor(value, key);
		}
	});
}
var TYPE = "function-based";
registerUsable(TYPE, (context, config) => {
	return invokeHelper(context, config);
});
function resource(context, setup) {
	if (!setup) {
		let internalConfig2 = {
			definition: context,
			type: "function-based",
			name: "Resource",
			[INTERNAL]: true
		};
		setHelperManager(ResourceManagerFactory, internalConfig2);
		return internalConfig2;
	}
	let internalConfig = {
		definition: setup,
		type: TYPE,
		name: getDebugName(setup),
		[INTERNAL]: true
	};
	setHelperManager(ResourceManagerFactory, internalConfig);
	return wrapForPlainUsage(context, internalConfig);
}
function getDebugName(obj) {
	if ("name" in obj) return `Resource Function: ${obj.name}`;
	return `Resource Function`;
}
//#endregion
export { use as a, resourceFactory as i, registerUsable as n, resource as r, cell as t };
