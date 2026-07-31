import { x as enumerate, y as isPresentArray, z as getFirst, A as getLast, E as EMPTY_ARRAY, B as EMPTY_NUMBER_ARRAY, C as EMPTY_STRING_ARRAY, S as StackImpl, D as assign, F as dict, G as emptyArray, I as entries, J as isDict, K as isEmptyArray, L as isIndexable, M as keys, N as reverse, O as values, P as zipArrays, Q as zipTuples } from './main-BmN1enVY.js';

/**
 * This constant exists to make it easier to differentiate normal logs from
 * errant console.logs. LOCAL_LOGGER should only be used inside a
 * LOCAL_TRACE_LOGGING check.
 *
 * It does not alleviate the need to check LOCAL_TRACE_LOGGING, which is used
 * for stripping.
 */
const LOCAL_LOGGER = console;

/**
 * This constant exists to make it easier to differentiate normal logs from
 * errant console.logs. LOGGER can be used outside of LOCAL_TRACE_LOGGING checks,
 * and is meant to be used in the rare situation where a console.* call is
 * actually appropriate.
 */
const LOGGER = console;

/// <reference types="qunit" />

let beginTestSteps;
let endTestSteps;
let verifySteps;
let logStep;
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
  for (let key in obj) {
    if (key === str) {
      return key;
    }
  }
  return str;
}
const SERIALIZATION_FIRST_NODE_STRING = '%+b:0%';
function isSerializationFirstNode(node) {
  return node.nodeValue === SERIALIZATION_FIRST_NODE_STRING;
}
function strip(strings, ...args) {
  let out = '';
  for (const [i, string] of enumerate(strings)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- @fixme
    let dynamic = args[i] !== undefined ? String(args[i]) : '';
    out += `${string}${dynamic}`;
  }
  let lines = out.split('\n');
  while (isPresentArray(lines) && /^\s*$/u.test(getFirst(lines))) {
    lines.shift();
  }
  while (isPresentArray(lines) && /^\s*$/u.test(getLast(lines))) {
    lines.pop();
  }
  let min = Infinity;
  for (let line of lines) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- @fixme
    let leading = /^\s*/u.exec(line)[0].length;
    min = Math.min(min, leading);
  }
  let stripped = [];
  for (let line of lines) {
    stripped.push(line.slice(min));
  }
  return stripped.join('\n');
}
function assertNever(value, desc = 'unexpected unreachable branch') {
  LOGGER.log('unreachable', value);
  LOGGER.log(`${desc} :: ${JSON.stringify(value)} (${value})`);
  throw new Error(`code reached unreachable`);
}

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  EMPTY_ARRAY,
  EMPTY_NUMBER_ARRAY,
  EMPTY_STRING_ARRAY,
  LOCAL_LOGGER,
  LOGGER,
  SERIALIZATION_FIRST_NODE_STRING,
  Stack: StackImpl,
  assertNever,
  assign,
  beginTestSteps,
  clearElement,
  dict,
  emptyArray,
  endTestSteps,
  entries,
  enumerate,
  intern,
  isDict,
  isEmptyArray,
  isIndexable,
  isSerializationFirstNode,
  keys,
  logStep,
  reverse,
  strip,
  values,
  verifySteps,
  zipArrays,
  zipTuples
}, Symbol.toStringTag, { value: 'Module' }));

export { assertNever as a, index as i };
