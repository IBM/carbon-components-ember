import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { S as guidFor } from "./core-D-L0f59Y.js";
import { a as peekMeta } from "./meta-B7F2ReUu.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/computed_cache-DmYKevAP.js
function getCachedValueFor(obj, key) {
	let meta = peekMeta(obj);
	if (meta) return meta.valueFor(key);
	else return;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/internals.js
var internals_exports = /* @__PURE__ */ __exportAll({
	cacheFor: () => getCachedValueFor,
	guidFor: () => guidFor
});
//#endregion
export { getCachedValueFor as n, internals_exports as t };
