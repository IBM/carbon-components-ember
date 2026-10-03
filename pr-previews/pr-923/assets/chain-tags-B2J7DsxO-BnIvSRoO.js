import { a as peekMeta, i as meta } from "./meta-B7F2ReUu.js";
import { A as validateTag, b as createUpdatableTag, g as combine, i as CONSTANT_TAG, l as UPDATE_TAG } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, r as tagMetaFor, t as dirtyTagFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { n as getCustomTagFor } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/spec-BXl1reqK.js
/**
Returns whether Type(value) is Object.

Useful for checking whether a value is a valid WeakMap key.

Refs: https://tc39.github.io/ecma262/#sec-typeof-operator-runtime-semantics-evaluation
https://tc39.github.io/ecma262/#sec-weakmap.prototype.set

@private
@function isObject
*/
function isObject(value) {
	return value !== null && (typeof value === "object" || typeof value === "function");
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/chain-tags-B2J7DsxO.js
function objectAt(array, index) {
	if (Array.isArray(array)) return array[index];
	else return array.objectAt(index);
}
var SELF_TAG = Symbol("SELF_TAG");
function tagForProperty(obj, propertyKey, addMandatorySetter = false, meta) {
	let customTagFor = getCustomTagFor(obj);
	if (customTagFor !== void 0) return customTagFor(obj, propertyKey, addMandatorySetter);
	return tagFor(obj, propertyKey, meta);
}
function tagForObject(obj) {
	if (isObject(obj)) return tagFor(obj, SELF_TAG);
	return CONSTANT_TAG;
}
function markObjectAsDirty(obj, propertyKey) {
	dirtyTagFor(obj, propertyKey);
	dirtyTagFor(obj, SELF_TAG);
}
var CHAIN_PASS_THROUGH = /* @__PURE__ */ new WeakSet();
function finishLazyChains(meta, key, value) {
	let lazyTags = meta.readableLazyChainsFor(key);
	if (lazyTags === void 0) return;
	if (isObject(value)) for (let [tag, deps] of lazyTags) UPDATE_TAG(tag, getChainTagsForKey(value, deps, tagMetaFor(value), peekMeta(value)));
	lazyTags.length = 0;
}
function getChainTagsForKeys(obj, keys, tagMeta, meta) {
	let tags = [];
	for (let key of keys) getChainTags(tags, obj, key, tagMeta, meta);
	return combine(tags);
}
function getChainTagsForKey(obj, key, tagMeta, meta) {
	return combine(getChainTags([], obj, key, tagMeta, meta));
}
function getChainTags(chainTags, obj, path, tagMeta, meta$1) {
	let current = obj;
	let currentTagMeta = tagMeta;
	let currentMeta = meta$1;
	let pathLength = path.length;
	let segmentEnd = -1;
	let segment, descriptor;
	while (true) {
		let lastSegmentEnd = segmentEnd + 1;
		segmentEnd = path.indexOf(".", lastSegmentEnd);
		if (segmentEnd === -1) segmentEnd = pathLength;
		segment = path.slice(lastSegmentEnd, segmentEnd);
		if (segment === "@each" && segmentEnd !== pathLength) {
			lastSegmentEnd = segmentEnd + 1;
			segmentEnd = path.indexOf(".", lastSegmentEnd);
			let arrLength = current.length;
			if (typeof arrLength !== "number" || !(Array.isArray(current) || "objectAt" in current)) break;
			else if (arrLength === 0) {
				chainTags.push(tagForProperty(current, "[]"));
				break;
			}
			if (segmentEnd === -1) segment = path.slice(lastSegmentEnd);
			else segment = path.slice(lastSegmentEnd, segmentEnd);
			for (let i = 0; i < arrLength; i++) {
				let item = objectAt(current, i);
				if (item) {
					chainTags.push(tagForProperty(item, segment, true));
					currentMeta = peekMeta(item);
					descriptor = currentMeta !== null ? currentMeta.peekDescriptors(segment) : void 0;
					if (descriptor !== void 0 && typeof descriptor.altKey === "string") item[segment];
				}
			}
			chainTags.push(tagForProperty(current, "[]", true, currentTagMeta));
			break;
		}
		let propertyTag = tagForProperty(current, segment, true, currentTagMeta);
		descriptor = currentMeta !== null ? currentMeta.peekDescriptors(segment) : void 0;
		chainTags.push(propertyTag);
		if (segmentEnd === pathLength) {
			if (CHAIN_PASS_THROUGH.has(descriptor)) current[segment];
			break;
		}
		if (descriptor === void 0) {
			if (!(segment in current) && typeof current.unknownProperty === "function") current = current.unknownProperty(segment);
			else current = current[segment];
		} else if (CHAIN_PASS_THROUGH.has(descriptor)) current = current[segment];
		else {
			let instanceMeta = currentMeta.source === current ? currentMeta : meta(current);
			let lastRevision = instanceMeta.revisionFor(segment);
			if (lastRevision !== void 0 && validateTag(propertyTag, lastRevision)) current = instanceMeta.valueFor(segment);
			else {
				let lazyChains = instanceMeta.writableLazyChainsFor(segment);
				let rest = path.substring(segmentEnd + 1);
				let placeholderTag = createUpdatableTag();
				lazyChains.push([placeholderTag, rest]);
				chainTags.push(placeholderTag);
				break;
			}
		}
		if (!isObject(current)) break;
		currentTagMeta = tagMetaFor(current);
		currentMeta = peekMeta(current);
	}
	return chainTags;
}
//#endregion
export { getChainTagsForKeys as a, tagForObject as c, getChainTagsForKey as i, tagForProperty as l, SELF_TAG as n, markObjectAsDirty as o, finishLazyChains as r, objectAt as s, CHAIN_PASS_THROUGH as t, isObject as u };
