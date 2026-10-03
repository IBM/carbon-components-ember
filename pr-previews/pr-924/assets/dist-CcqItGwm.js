import { t as isArray$1 } from "./is-array-DKkHuyBq.js";
import { t as Helper } from "./helper-D1xNZ1iZ.js";
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/utils/truth-convert.js
function truthConvert(result) {
	if (typeof result === "object" && result && "isTruthy" in result && typeof result.isTruthy === "boolean") return result.isTruthy;
	if (isArray$1(result)) return result.length !== 0;
	else return !!result;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/or.js
var OrHelper = class extends Helper {
	compute(params) {
		for (let i = 0, len = params.length; i < len; i++) if (truthConvert(params[i]) === true) return params[i];
		return params[params.length - 1];
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/eq.js
function eq(left, right) {
	return left === right;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/and.js
var AndHelper = class extends Helper {
	compute(params) {
		for (let i = 0, len = params.length; i < len; i++) if (truthConvert(params[i]) === false) return params[i];
		return params[params.length - 1];
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/gt.js
function gt(left, right, options) {
	if (options?.forceNumber) {
		if (typeof left !== "number") left = Number(left);
		if (typeof right !== "number") right = Number(right);
	}
	return left > right;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/gte.js
function gte(left, right, options) {
	if (options?.forceNumber) {
		if (typeof left !== "number") left = Number(left);
		if (typeof right !== "number") right = Number(right);
	}
	return left >= right;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/is-array.js
function isArray(...params) {
	return params.every(isArray$1);
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/lt.js
function lt(left, right, options) {
	if (options?.forceNumber) {
		if (typeof left !== "number") left = Number(left);
		if (typeof right !== "number") right = Number(right);
	}
	return left < right;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/lte.js
function lte(left, right, options) {
	if (options?.forceNumber) {
		if (typeof left !== "number") left = Number(left);
		if (typeof right !== "number") right = Number(right);
	}
	return left <= right;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/not-eq.js
function notEq(left, right) {
	return left !== right;
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/not.js
function not(...params) {
	return params.every((param) => !truthConvert(param));
}
//#endregion
//#region ../node_modules/.pnpm/ember-truth-helpers@5.0.0_supports-color@8.1.1/node_modules/ember-truth-helpers/dist/helpers/xor.js
function xor(left, right) {
	return truthConvert(left) !== truthConvert(right);
}
//#endregion
export { lt as a, gt as c, OrHelper as d, lte as i, AndHelper as l, not as n, isArray as o, notEq as r, gte as s, xor as t, eq as u };
