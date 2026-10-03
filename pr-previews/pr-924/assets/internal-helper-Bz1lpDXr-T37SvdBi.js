import { d as createComputeRef, x as updateRef, y as isInvokableRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { f as setInternalHelperManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { b as reifyPositional, f as check, y as reifyNamed } from "./arguments-Carzx7C4-snfB_1Hj.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/hash-b373B4IL.js
function buildUntouchableThis(source) {
	return null;
}
function internalHelper$1(helper) {
	return setInternalHelperManager(helper, {});
}
var array = internalHelper$1(({ positional }) => {
	return createComputeRef(() => reifyPositional(positional), null, "array");
});
var context = buildUntouchableThis();
var fn = internalHelper$1(({ positional }) => {
	let callbackRef = check(positional[0]);
	return createComputeRef(() => {
		return (...invocationArgs) => {
			let [fn, ...args] = reifyPositional(positional);
			if (isInvokableRef(callbackRef)) {
				let value = args.length > 0 ? args[0] : invocationArgs[0];
				updateRef(callbackRef, value);
				return;
			} else return fn.call(context, ...args, ...invocationArgs);
		};
	}, null, "fn");
});
var hash = internalHelper$1(({ named }) => {
	let ref = createComputeRef(() => {
		return reifyNamed(named);
	}, null, "hash");
	let children = /* @__PURE__ */ new Map();
	for (let name in named) children.set(name, named[name]);
	ref.children = children;
	return ref;
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/internal-helper-Bz1lpDXr.js
function internalHelper(helper) {
	return setInternalHelperManager(helper, {});
}
//#endregion
export { internalHelper$1 as a, hash as i, array as n, fn as r, internalHelper as t };
