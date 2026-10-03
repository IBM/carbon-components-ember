import { r as associateDestroyableChild } from "./destroyable-BW6N5j2P.js";
import { c as UNDEFINED_REFERENCE, d as createComputeRef, f as createConstRef, t as argsProxyFor } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { t as buildCapabilities } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/api-DlJKfm_f.js
function helperCapabilities(managerAPI, options = {}) {
	return buildCapabilities({
		hasValue: Boolean(options.hasValue),
		hasDestroyable: Boolean(options.hasDestroyable),
		hasScheduledEffect: Boolean(options.hasScheduledEffect)
	});
}
function hasValue(manager) {
	return manager.capabilities.hasValue;
}
function hasDestroyable(manager) {
	return manager.capabilities.hasDestroyable;
}
var CustomHelperManager = class {
	constructor(factory) {
		this.factory = factory;
	}
	helperManagerDelegates = /* @__PURE__ */ new WeakMap();
	undefinedDelegate = null;
	getDelegateForOwner(owner) {
		let delegate = this.helperManagerDelegates.get(owner);
		if (delegate === void 0) {
			let { factory } = this;
			delegate = factory(owner);
			this.helperManagerDelegates.set(owner, delegate);
		}
		return delegate;
	}
	getDelegateFor(owner) {
		if (owner === void 0) {
			let { undefinedDelegate } = this;
			if (undefinedDelegate === null) {
				let { factory } = this;
				this.undefinedDelegate = undefinedDelegate = factory(void 0);
			}
			return undefinedDelegate;
		} else return this.getDelegateForOwner(owner);
	}
	getHelper(definition) {
		return (capturedArgs, owner) => {
			let manager = this.getDelegateFor(owner);
			const args = argsProxyFor(capturedArgs);
			const bucket = manager.createHelper(definition, args);
			if (hasValue(manager)) {
				let cache = createComputeRef(() => manager.getValue(bucket), null, false);
				if (hasDestroyable(manager)) associateDestroyableChild(cache, manager.getDestroyable(bucket));
				return cache;
			} else if (hasDestroyable(manager)) {
				let ref = createConstRef(void 0);
				associateDestroyableChild(ref, manager.getDestroyable(bucket));
				return ref;
			} else return UNDEFINED_REFERENCE;
		};
	}
};
var FunctionHelperManager = class {
	capabilities = buildCapabilities({
		hasValue: true,
		hasDestroyable: false,
		hasScheduledEffect: false
	});
	createHelper(fn, args) {
		return {
			fn,
			args
		};
	}
	getValue({ fn, args }) {
		if (Object.keys(args.named).length > 0) return fn(...[...args.positional, args.named]);
		return fn(...args.positional);
	}
	getDebugName(fn) {
		if (fn.name) return `(helper function ${fn.name})`;
		return "(anonymous helper function)";
	}
};
var COMPONENT_MANAGERS = /* @__PURE__ */ new WeakMap();
var MODIFIER_MANAGERS = /* @__PURE__ */ new WeakMap();
var HELPER_MANAGERS = /* @__PURE__ */ new WeakMap();
/**
* There is also Reflect.getPrototypeOf,
* which errors when non-objects are passed.
*
* Since our conditional for figuring out whether to render primitives or not
* may contain non-object values, we don't want to throw errors when we call this.
*/
var getPrototypeOf = Object.getPrototypeOf;
function setManager(map, manager, obj) {
	map.set(obj, manager);
	return obj;
}
function getManager(map, obj) {
	let pointer = obj;
	while (pointer !== null) {
		const manager = map.get(pointer);
		if (manager !== void 0) return manager;
		pointer = getPrototypeOf(pointer);
	}
}
function setInternalModifierManager(manager, definition) {
	return setManager(MODIFIER_MANAGERS, manager, definition);
}
function getInternalModifierManager(definition, isOptional) {
	const manager = getManager(MODIFIER_MANAGERS, definition);
	if (manager === void 0) return null;
	return manager;
}
function setInternalHelperManager(manager, definition) {
	return setManager(HELPER_MANAGERS, manager, definition);
}
var DEFAULT_MANAGER = new CustomHelperManager(() => new FunctionHelperManager());
function getInternalHelperManager(definition, isOptional) {
	let manager = getManager(HELPER_MANAGERS, definition);
	if (manager === void 0 && typeof definition === "function") manager = DEFAULT_MANAGER;
	if (manager) return manager;
	else if (isOptional === true) return null;
	return null;
}
function setInternalComponentManager(factory, obj) {
	return setManager(COMPONENT_MANAGERS, factory, obj);
}
function getInternalComponentManager(definition, isOptional) {
	const manager = getManager(COMPONENT_MANAGERS, definition);
	if (manager === void 0) return null;
	return manager;
}
function hasInternalComponentManager(definition) {
	return getManager(COMPONENT_MANAGERS, definition) !== void 0;
}
function hasInternalHelperManager(definition) {
	return hasDefaultHelperManager(definition) || getManager(HELPER_MANAGERS, definition) !== void 0;
}
function hasInternalModifierManager(definition) {
	return getManager(MODIFIER_MANAGERS, definition) !== void 0;
}
function hasDefaultHelperManager(definition) {
	return typeof definition === "function";
}
//#endregion
export { hasDestroyable as a, hasInternalModifierManager as c, setInternalComponentManager as d, setInternalHelperManager as f, getInternalModifierManager as i, hasValue as l, getInternalComponentManager as n, hasInternalComponentManager as o, setInternalModifierManager as p, getInternalHelperManager as r, hasInternalHelperManager as s, CustomHelperManager as t, helperCapabilities as u };
