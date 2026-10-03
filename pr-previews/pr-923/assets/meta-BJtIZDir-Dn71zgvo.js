import { b as createUpdatableTag, s as DIRTY_TAG } from "./cache-CofLhaS4-CWmaBWeq.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/meta-BJtIZDir.js
var TRACKED_TAGS = /* @__PURE__ */ new WeakMap();
function dirtyTagFor(obj, key, meta) {
	let tags = meta === void 0 ? TRACKED_TAGS.get(obj) : meta;
	if (tags === void 0) return;
	let propertyTag = tags.get(key);
	if (propertyTag !== void 0) DIRTY_TAG(propertyTag, true);
}
function tagMetaFor(obj) {
	let tags = TRACKED_TAGS.get(obj);
	if (tags === void 0) {
		tags = /* @__PURE__ */ new Map();
		TRACKED_TAGS.set(obj, tags);
	}
	return tags;
}
function tagFor(obj, key, meta) {
	let tags = meta === void 0 ? tagMetaFor(obj) : meta;
	let tag = tags.get(key);
	if (tag === void 0) {
		tag = createUpdatableTag();
		tags.set(key, tag);
	}
	return tag;
}
//#endregion
export { tagFor as n, tagMetaFor as r, dirtyTagFor as t };
