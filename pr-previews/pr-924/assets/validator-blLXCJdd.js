import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { A as validateTag, C as getValue, D as resetTracking, E as isTracking, O as track, S as endUntrackFrame, T as isConstTag, _ as consumeTag, a as CURRENT_TAG, b as createUpdatableTag, d as VOLATILE_TAG, f as VolatileTag, g as combine, h as bump, i as CONSTANT_TAG, j as valueForTag, k as untrack, l as UPDATE_TAG, m as beginUntrackFrame, n as COMPUTE, o as CurrentTag, p as beginTrackFrame, s as DIRTY_TAG, t as ALLOW_CYCLES, u as VOLATILE, v as createCache, w as isConst, x as endTrackFrame, y as createTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, r as tagMetaFor, t as dirtyTagFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { n as trackedData, r as trackedValue, t as TrackedValue } from "./tracked-value-CR6kx-73-B8kSd-H1.js";
import { a as trackedWeakMap, i as trackedSet, n as trackedMap, o as trackedWeakSet, r as trackedObject, t as trackedArray } from "./collections-Ce02tfk0.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/validator/index.js
var validator_exports = /* @__PURE__ */ __exportAll({
	ALLOW_CYCLES: () => ALLOW_CYCLES,
	COMPUTE: () => COMPUTE,
	CONSTANT: () => 0,
	CONSTANT_TAG: () => CONSTANT_TAG,
	CURRENT_TAG: () => CURRENT_TAG,
	CurrentTag: () => CurrentTag,
	INITIAL: () => 1,
	TrackedValue: () => TrackedValue,
	VOLATILE: () => VOLATILE,
	VOLATILE_TAG: () => VOLATILE_TAG,
	VolatileTag: () => VolatileTag,
	beginTrackFrame: () => beginTrackFrame,
	beginUntrackFrame: () => beginUntrackFrame,
	bump: () => bump,
	combine: () => combine,
	consumeTag: () => consumeTag,
	createCache: () => createCache,
	createTag: () => createTag,
	createUpdatableTag: () => createUpdatableTag,
	debug: () => debug,
	dirtyTag: () => DIRTY_TAG,
	dirtyTagFor: () => dirtyTagFor,
	endTrackFrame: () => endTrackFrame,
	endUntrackFrame: () => endUntrackFrame,
	getValue: () => getValue,
	isConst: () => isConst,
	isConstTag: () => isConstTag,
	isTracking: () => isTracking,
	resetTracking: () => resetTracking,
	tagFor: () => tagFor,
	tagMetaFor: () => tagMetaFor,
	track: () => track,
	trackedArray: () => trackedArray,
	trackedData: () => trackedData,
	trackedMap: () => trackedMap,
	trackedObject: () => trackedObject,
	trackedSet: () => trackedSet,
	trackedValue: () => trackedValue,
	trackedWeakMap: () => trackedWeakMap,
	trackedWeakSet: () => trackedWeakSet,
	untrack: () => untrack,
	updateTag: () => UPDATE_TAG,
	validateTag: () => validateTag,
	valueForTag: () => valueForTag
});
var debug = {};
var GLIMMER_VALIDATOR_REGISTRATION = Symbol("GLIMMER_VALIDATOR_REGISTRATION");
if (Reflect.has(globalThis, GLIMMER_VALIDATOR_REGISTRATION)) throw new Error("The `@glimmer/validator` library has been included twice in this application. It could be different versions of the package, or the same version included twice by mistake. `@glimmer/validator` depends on having a single copy of the package in use at any time in an application, even if they are the same version. You must dedupe your build to remove the duplicate packages in order to prevent this error.");
Reflect.set(globalThis, GLIMMER_VALIDATOR_REGISTRATION, true);
//#endregion
export { validator_exports as n, debug as t };
