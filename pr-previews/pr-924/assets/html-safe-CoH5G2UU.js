import { r as htmlSafe$1 } from "./index-D-xTBV4B-DG7EnZE6.js";
import { n as helper$1 } from "./helper-D1xNZ1iZ.js";
//#region ../carbon-components-ember/dist/helpers/or.js
function orHelper([ ...args]) {
	return args.find((a) => !!a);
}
var helper = helper$1(orHelper);
//#endregion
//#region ../carbon-components-ember/dist/helpers/html-safe.js
function htmlSafeHelper([str]) {
	return htmlSafe$1(str);
}
var htmlSafe = helper$1(htmlSafeHelper);
//#endregion
export { helper as n, htmlSafe as t };
