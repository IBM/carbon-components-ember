import { l as toBool } from "./global-context-D1MXNkcp.js";
import { S as valueForRef, d as createComputeRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { a as internalHelper } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/not-DOTpWiG3.js
/**
* Performs a strict equality comparison.
*
* left === right
*/
function eq(left, right) {
	return left === right;
}
/**
* Performs a strict inequality comparison.
*
* left !== right
*/
function neq(left, right) {
	return left !== right;
}
/**
* Performs a greater than comparison.
*
* left > right
*/
function gt(left, right) {
	return left > right;
}
/**
* Performs a greater than or equal comparison.
*
* left >= right
*/
function gte(left, right) {
	return left >= right;
}
/**
* Performs a less than comparison.
*
* left < right
*/
function lt(left, right) {
	return left < right;
}
/**
* Performs a less than or equal comparison.
*
* left <= right
*/
function lte(left, right) {
	return left <= right;
}
var and = internalHelper(({ positional }) => {
	return createComputeRef(() => {
		let last;
		for (let i = 0; i < positional.length; i++) {
			let arg = positional[i];
			last = arg ? valueForRef(arg) : arg;
			if (!toBool(last)) return last;
		}
		return last;
	}, null, "and");
});
var or = internalHelper(({ positional }) => {
	return createComputeRef(() => {
		let last;
		for (let i = 0; i < positional.length; i++) {
			let arg = positional[i];
			last = arg ? valueForRef(arg) : arg;
			if (toBool(last)) return last;
		}
		return last;
	}, null, "or");
});
var not = (...args) => {
	return !toBool(args[0]);
};
//#endregion
export { lt as a, not as c, gte as i, or as l, eq as n, lte as o, gt as r, neq as s, and as t };
