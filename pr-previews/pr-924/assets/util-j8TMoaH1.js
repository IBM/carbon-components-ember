import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { c as isDict, l as isIndexable, o as getFirst, r as dict, s as getLast, t as StackImpl, u as isPresentArray } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { c as EMPTY_STRING_ARRAY, d as isEmptyArray, f as reverse, i as values, l as emptyArray, m as zipTuples, n as entries, o as EMPTY_ARRAY, p as zipArrays, r as keys, s as EMPTY_NUMBER_ARRAY, t as assign, u as enumerate } from "./object-utils-AijlD-JH-xdA72BiZ.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/util/index.js
var util_exports = /* @__PURE__ */ __exportAll({
	EMPTY_ARRAY: () => EMPTY_ARRAY,
	EMPTY_NUMBER_ARRAY: () => EMPTY_NUMBER_ARRAY,
	EMPTY_STRING_ARRAY: () => EMPTY_STRING_ARRAY,
	LOCAL_LOGGER: () => LOCAL_LOGGER,
	LOGGER: () => LOGGER,
	SERIALIZATION_FIRST_NODE_STRING: () => SERIALIZATION_FIRST_NODE_STRING,
	Stack: () => StackImpl,
	assertNever: () => assertNever,
	assign: () => assign,
	beginTestSteps: () => beginTestSteps,
	clearElement: () => clearElement,
	dict: () => dict,
	emptyArray: () => emptyArray,
	endTestSteps: () => endTestSteps,
	entries: () => entries,
	enumerate: () => enumerate,
	intern: () => intern,
	isDict: () => isDict,
	isEmptyArray: () => isEmptyArray,
	isIndexable: () => isIndexable,
	isSerializationFirstNode: () => isSerializationFirstNode,
	keys: () => keys,
	logStep: () => logStep,
	reverse: () => reverse,
	strip: () => strip,
	values: () => values,
	verifySteps: () => verifySteps,
	zipArrays: () => zipArrays,
	zipTuples: () => zipTuples
});
/**
* This constant exists to make it easier to differentiate normal logs from
* errant console.logs. LOCAL_LOGGER should only be used inside a
* LOCAL_TRACE_LOGGING check.
*
* It does not alleviate the need to check LOCAL_TRACE_LOGGING, which is used
* for stripping.
*/
var LOCAL_LOGGER = console;
/**
* This constant exists to make it easier to differentiate normal logs from
* errant console.logs. LOGGER can be used outside of LOCAL_TRACE_LOGGING checks,
* and is meant to be used in the rare situation where a console.* call is
* actually appropriate.
*/
var LOGGER = console;
var beginTestSteps;
var endTestSteps;
var verifySteps;
var logStep;
function clearElement(parent) {
	let current = parent.firstChild;
	while (current) {
		let next = current.nextSibling;
		parent.removeChild(current);
		current = next;
	}
}
/**
Strongly hint runtimes to intern the provided string.

When do I need to use this function?

For the most part, never. Pre-mature optimization is bad, and often the
runtime does exactly what you need it to, and more often the trade-off isn't
worth it.

Why?

Runtimes store strings in at least 2 different representations:
Ropes and Symbols (interned strings). The Rope provides a memory efficient
data-structure for strings created from concatenation or some other string
manipulation like splitting.

Unfortunately checking equality of different ropes can be quite costly as
runtimes must resort to clever string comparison algorithms. These
algorithms typically cost in proportion to the length of the string.
Luckily, this is where the Symbols (interned strings) shine. As Symbols are
unique by their string content, equality checks can be done by pointer
comparison.

How do I know if my string is a rope or symbol?

Typically (warning general sweeping statement, but truthy in runtimes at
present) static strings created as part of the JS source are interned.
Strings often used for comparisons can be interned at runtime if some
criteria are met.  One of these criteria can be the size of the entire rope.
For example, in chrome 38 a rope longer then 12 characters will not
intern, nor will segments of that rope.

Some numbers: http://jsperf.com/eval-vs-keys/8

Known Trick™

@private
@return {String} interned version of the provided string
*/
function intern(str) {
	let obj = {};
	obj[str] = 1;
	for (let key in obj) if (key === str) return key;
	return str;
}
var SERIALIZATION_FIRST_NODE_STRING = "%+b:0%";
function isSerializationFirstNode(node) {
	return node.nodeValue === SERIALIZATION_FIRST_NODE_STRING;
}
function strip(strings, ...args) {
	let out = "";
	for (const [i, string] of enumerate(strings)) {
		let dynamic = args[i] !== void 0 ? String(args[i]) : "";
		out += `${string}${dynamic}`;
	}
	let lines = out.split("\n");
	while (isPresentArray(lines) && /^\s*$/u.test(getFirst(lines))) lines.shift();
	while (isPresentArray(lines) && /^\s*$/u.test(getLast(lines))) lines.pop();
	let min = Infinity;
	for (let line of lines) {
		let leading = /^\s*/u.exec(line)[0].length;
		min = Math.min(min, leading);
	}
	let stripped = [];
	for (let line of lines) stripped.push(line.slice(min));
	return stripped.join("\n");
}
function assertNever(value, desc = "unexpected unreachable branch") {
	LOGGER.log("unreachable", value);
	LOGGER.log(`${desc} :: ${JSON.stringify(value)} (${value})`);
	throw new Error(`code reached unreachable`);
}
//#endregion
export { util_exports as n, assertNever as t };
