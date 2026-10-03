import { s as setPath, t as getPath } from "./global-context-D1MXNkcp.js";
import { c as isDict } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { S as valueForRef, c as UNDEFINED_REFERENCE, d as createComputeRef, f as createConstRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { b as reifyPositional } from "./arguments-Carzx7C4-snfB_1Hj.js";
import { a as internalHelper, t as internalHelper$1 } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/get-ZhOO_1qS.js
var isEmpty = (value) => {
	return value === null || value === void 0 || typeof value.toString !== "function";
};
var normalizeTextValue = (value) => {
	if (isEmpty(value)) return "";
	return String(value);
};
var concat = internalHelper(({ positional }) => {
	return createComputeRef(() => reifyPositional(positional).map(normalizeTextValue).join(""), null, "concat");
});
var get = internalHelper(({ positional }) => {
	let sourceRef = positional[0] ?? UNDEFINED_REFERENCE;
	let pathRef = positional[1] ?? UNDEFINED_REFERENCE;
	return createComputeRef(() => {
		let source = valueForRef(sourceRef);
		if (isDict(source)) return getPath(source, String(valueForRef(pathRef)));
	}, (value) => {
		let source = valueForRef(sourceRef);
		if (isDict(source)) return setPath(source, String(valueForRef(pathRef)), value);
	}, "get");
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/unique-id-BJb1p8EG.js
var uniqueId = internalHelper$1(() => {
	return createConstRef(uniqueId$1());
});
function uniqueId$1() {
	return "30000000-1000-4000-2000-100000000000".replace(/[0-3]/g, (a) => (a * 4 ^ Math.random() * 16 >> (a & 2)).toString(16));
}
//#endregion
export { get as i, uniqueId$1 as n, concat as r, uniqueId as t };
