//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/template-Dc_cBOoX.js
var TEMPLATES = /* @__PURE__ */ new WeakMap();
var getPrototypeOf = Reflect.getPrototypeOf;
function setComponentTemplate(factory, obj) {
	TEMPLATES.set(obj, factory);
	return obj;
}
function getComponentTemplate(obj) {
	let pointer = obj;
	while (pointer !== null) {
		let template = TEMPLATES.get(pointer);
		if (template !== void 0) return template;
		pointer = getPrototypeOf(pointer);
	}
}
//#endregion
export { setComponentTemplate as n, getComponentTemplate as t };
