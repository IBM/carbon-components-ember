//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/array/-internals.js
var EMBER_ARRAYS = /* @__PURE__ */ new WeakSet();
function setEmberArray(obj) {
	EMBER_ARRAYS.add(obj);
}
function isEmberArray(obj) {
	return EMBER_ARRAYS.has(obj);
}
//#endregion
export { setEmberArray as n, isEmberArray as t };
