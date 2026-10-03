import { U as get } from "./core-D-L0f59Y.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { n as helper$5 } from "./helper-D1xNZ1iZ.js";
//#region ../carbon-components-ember/dist/helpers/default-to.js
function _default([something, otherwise]) {
	return something !== void 0 ? something : otherwise;
}
var helper$4 = helper$5(_default);
//#endregion
//#region ../carbon-components-ember/dist/helpers/set.js
function setHelper([obj, key, path]) {
	return function(val) {
		set(obj, key, path ? get(val, path) : val);
	};
}
var helper$3 = helper$5(setHelper);
//#endregion
//#region ../carbon-components-ember/dist/helpers/new-obj.js
function newObj(arr, named = {}) {
	return Object.assign({}, named);
}
var helper$2 = helper$5(newObj);
//#endregion
//#region ../carbon-components-ember/dist/helpers/has.js
function has([set, item]) {
	return set?.has(item);
}
var helper$1 = helper$5(has);
//#endregion
//#region ../carbon-components-ember/dist/helpers/get-fn.js
function getFn([obj, prop]) {
	const fn = obj[prop];
	return fn && fn.bind(obj);
}
var helper = helper$5(getFn);
//#endregion
export { helper$4 as a, helper$3 as i, helper$1 as n, helper$2 as r, helper as t };
