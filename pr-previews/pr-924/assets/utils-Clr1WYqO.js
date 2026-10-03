//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/utils.js
/**
* @param {string} message
* @param {unknown} test
* @returns {asserts test}
*/
function assert(message, test) {
	if (!test) throw new Error(message);
}
var i = 0;
function nextId() {
	i += 1;
	return `repl_${i}`;
}
var fakeDomain = "repl.sdk";
var tgzPrefix = "file:///tgz.repl.sdk/";
var unzippedPrefix = "file:///tgz.repl.sdk/unzipped";
/**
* @param {string} url
*/
function prefix_tgz(url) {
	return `${tgzPrefix}${url}`;
}
/**
* @param {unknown} x
* @returns {x is Record<string, unknown>}
*/
function isRecord(x) {
	return typeof x === "object" && x !== null && !Array.isArray(x);
}
/**
* Builds the most useful human-readable message from a thrown error.
*
* SWC (via content-tag) throws Errors whose `message` is only
* "Parse Error at <file>:<line>:<column>" — the explanation of what's
* wrong and the code-frame live on a non-standard `source_code` property
* (and `stack` is nothing but wasm frames).
*
* @param {unknown} error
* @returns {string}
*/
function errorMessage(error) {
	if (!isRecord(error)) return String(error);
	const parts = [];
	if ("message" in error && error.message) parts.push(String(error.message));
	if ("source_code" in error && error.source_code) parts.push(String(error.source_code));
	if (parts.length === 0) return String(error);
	return parts.join("\n\n");
}
//#endregion
export { nextId as a, unzippedPrefix as c, isRecord as i, errorMessage as n, prefix_tgz as o, fakeDomain as r, tgzPrefix as s, assert as t };
