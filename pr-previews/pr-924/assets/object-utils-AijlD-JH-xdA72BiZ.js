//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/array-utils-CZQxrdD3.js
var EMPTY_ARRAY = Object.freeze([]);
function emptyArray() {
	return EMPTY_ARRAY;
}
var EMPTY_STRING_ARRAY = emptyArray();
var EMPTY_NUMBER_ARRAY = emptyArray();
/**
* This function returns `true` if the input array is the special empty array sentinel,
* which is sometimes used for optimizations.
*/
function isEmptyArray(input) {
	return input === EMPTY_ARRAY;
}
function* reverse(input) {
	for (let i = input.length - 1; i >= 0; i--) yield input[i];
}
function* enumerate(input) {
	let i = 0;
	for (const item of input) yield [i++, item];
}
/**
* Zip two tuples with the same type and number of elements.
*/
function* zipTuples(left, right) {
	for (let i = 0; i < left.length; i++) yield [
		i,
		left[i],
		right[i]
	];
}
function* zipArrays(left, right) {
	for (let i = 0; i < left.length; i++) yield [
		i < right.length ? "retain" : "pop",
		i,
		left[i],
		right[i]
	];
	for (let i = left.length; i < right.length; i++) yield [
		"push",
		i,
		void 0,
		right[i]
	];
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/assert-Zqc4wiAV.js
function assert(test, msg) {}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/object-utils-AijlD-JH.js
var assign = Object.assign;
function values(obj) {
	return Object.values(obj);
}
function entries(dict) {
	return Object.entries(dict);
}
function keys(obj) {
	return Object.keys(obj);
}
//#endregion
export { assert as a, EMPTY_STRING_ARRAY as c, isEmptyArray as d, reverse as f, values as i, emptyArray as l, zipTuples as m, entries as n, EMPTY_ARRAY as o, zipArrays as p, keys as r, EMPTY_NUMBER_ARRAY as s, assign as t, enumerate as u };
