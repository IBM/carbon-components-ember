//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/helper-brand-C9_8vvOf.js
/**
* The brand for classic (class-based) helpers lives in its own module so that
* code which only needs to *detect* classic helpers (e.g. the resolver) does
* not have to import the classic `Helper` base class (and with it the classic
* object model: `EmberObject`, `Mixin`, meta, etc.).
*/
var IS_CLASSIC_HELPER = Symbol("IS_CLASSIC_HELPER");
function isClassicHelper(obj) {
	return obj[IS_CLASSIC_HELPER] === true;
}
//#endregion
export { isClassicHelper as n, IS_CLASSIC_HELPER as t };
