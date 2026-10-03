//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/has-dom-DdQORPzI.js
var hasDOM = typeof self === "object" && self !== null && self.Object === Object && typeof Window !== "undefined" && self.constructor === Window && typeof document === "object" && document !== null && self.document === document && typeof location === "object" && location !== null && self.location === location && typeof history === "object" && history !== null && self.history === history && typeof navigator === "object" && navigator !== null && self.navigator === navigator && typeof navigator.userAgent === "string";
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/props-fiqxqhAH.js
function normalizeProperty(element, slotName) {
	let type, normalized;
	if (slotName in element) {
		normalized = slotName;
		type = "prop";
	} else {
		let lower = slotName.toLowerCase();
		if (lower in element) {
			type = "prop";
			normalized = lower;
		} else {
			type = "attr";
			normalized = slotName;
		}
	}
	if (type === "prop" && (normalized.toLowerCase() === "style" || preferAttr(element.tagName, normalized))) type = "attr";
	return {
		normalized,
		type
	};
}
var ATTR_OVERRIDES = {
	INPUT: {
		form: true,
		autocorrect: true,
		list: true
	},
	SELECT: { form: true },
	OPTION: { form: true },
	TEXTAREA: { form: true },
	LABEL: { form: true },
	FIELDSET: { form: true },
	LEGEND: { form: true },
	OBJECT: { form: true },
	OUTPUT: { form: true },
	BUTTON: { form: true }
};
function preferAttr(tagName, propName) {
	let tag = ATTR_OVERRIDES[tagName.toUpperCase()];
	return !!(tag && tag[propName.toLowerCase()]);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/curly-brand-B_F79Dep.js
/**
* The brand for the curly component manager lives in its own module so that
* code which only needs to *detect* the curly manager (e.g. the resolver)
* does not have to import the manager itself (and with it the classic
* component machinery).
*/
var CURLY_MANAGER_BRAND = Symbol("CURLY_MANAGER_BRAND");
function isCurlyManager(manager) {
	return manager[CURLY_MANAGER_BRAND] === true;
}
//#endregion
export { hasDOM as i, isCurlyManager as n, normalizeProperty as r, CURLY_MANAGER_BRAND as t };
