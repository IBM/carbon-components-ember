import { n as getOwner } from "./owner-In3G7kPJ.js";
import { r as associateDestroyableChild } from "./destroyable-BW6N5j2P.js";
import { C as getValue, v as createCache } from "./cache-CofLhaS4-CWmaBWeq.js";
import { a as hasDestroyable, l as hasValue, r as getInternalHelperManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { c as EMPTY_POSITIONAL, o as EMPTY_ARGS, s as EMPTY_NAMED } from "./arguments-Carzx7C4-snfB_1Hj.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/invoke-B-r9UQVH.js
function getArgs(proxy) {
	return getValue(proxy.argsCache);
}
var SimpleArgsProxy = class {
	argsCache;
	constructor(context, computeArgs = () => EMPTY_ARGS) {
		let argsCache = createCache(() => computeArgs(context));
		this.argsCache = argsCache;
	}
	get named() {
		return getArgs(this).named || EMPTY_NAMED;
	}
	get positional() {
		return getArgs(this).positional || EMPTY_POSITIONAL;
	}
};
function invokeHelper(context, definition, computeArgs) {
	const owner = getOwner(context);
	const manager = getInternalHelperManager(definition).getDelegateFor(owner);
	let args = new SimpleArgsProxy(context, computeArgs);
	let bucket = manager.createHelper(definition, args);
	let cache;
	if (hasValue(manager)) {
		cache = createCache(() => {
			return manager.getValue(bucket);
		});
		associateDestroyableChild(context, cache);
	} else throw new Error("TODO: unreachable, to be implemented with hasScheduledEffect");
	if (hasDestroyable(manager)) {
		let destroyable = manager.getDestroyable(bucket);
		associateDestroyableChild(cache, destroyable);
	}
	return cache;
}
//#endregion
export { invokeHelper as t };
