import { n as __exportAll, r as __toESM, t as __commonJSMin } from "./rolldown-runtime-DC62tzP2.js";
import { a as nextId } from "./utils-Clr1WYqO.js";
import { n as visitParents, r as convert, t as visit } from "./lib-DMOxHVHU.js";
import { t as kebabCase } from "./dist-CFfuNyTO.js";
import { a as stringify, c as html$2, d as normalize$1, f as htmlVoidElements, i as parse$2, l as svg, n as parse$1, o as ccount, r as stringify$1, s as zwitch, t as toHtml, u as find } from "./lib-TsAjK6QO.js";
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/remark-escape-components.js
/**
* A unique placeholder that replaces `<` in PascalCase component tags
* inside inline code and non-live code fences. It survives the unified
* pipeline without being entity-encoded, and is converted to `&#x3C;`
* in the final post-processing step inside `parseMarkdown()`.
*/
var REPL_LT = "__REPL_LT__";
/**
* Remark plugin: escape PascalCase component tags in `inlineCode` and
* non-live `code` (code fence) nodes by replacing `<` with a placeholder.
*/
function remarkEscapeComponents() {
	/** @param {import('mdast').Root} tree */
	return (tree) => {
		visit(tree, (node) => {
			if (node.type === "inlineCode") node.value = node.value.replace(/<([A-Z][a-zA-Z0-9]*(?:\s[^<]*)?)>/g, REPL_LT + "$1>").replace(/<\/([A-Z][a-zA-Z0-9]*)>/g, REPL_LT + "/$1>");
			if (node.type === "code") {
				if (!/\blive\b/.test(node.meta || "")) node.value = node.value.replace(/<([A-Z][a-zA-Z0-9]*(?:\s[^<]*)?)>/g, REPL_LT + "$1>").replace(/<\/([A-Z][a-zA-Z0-9]*)>/g, REPL_LT + "/$1>");
			}
		});
	};
}
//#endregion
//#region ../node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/deserialize.js
var env = typeof self === "object" ? self : globalThis;
var guard = (name, init) => {
	switch (name) {
		case "Function":
		case "SharedWorker":
		case "Worker":
		case "eval":
		case "setInterval":
		case "setTimeout": throw new TypeError("unable to deserialize " + name);
	}
	return new env[name](init);
};
var deserializer = ($, _) => {
	const as = (out, index) => {
		$.set(index, out);
		return out;
	};
	const unpair = (index) => {
		if ($.has(index)) return $.get(index);
		const [type, value] = _[index];
		switch (type) {
			case 0:
			case -1: return as(value, index);
			case 1: {
				const arr = as([], index);
				for (const index of value) arr.push(unpair(index));
				return arr;
			}
			case 2: {
				const object = as({}, index);
				for (const [key, index] of value) object[unpair(key)] = unpair(index);
				return object;
			}
			case 3: return as(new Date(value), index);
			case 4: {
				const { source, flags } = value;
				return as(new RegExp(source, flags), index);
			}
			case 5: {
				const map = as(/* @__PURE__ */ new Map(), index);
				for (const [key, index] of value) map.set(unpair(key), unpair(index));
				return map;
			}
			case 6: {
				const set = as(/* @__PURE__ */ new Set(), index);
				for (const index of value) set.add(unpair(index));
				return set;
			}
			case 7: {
				const { name, message } = value;
				return as(guard(name, message), index);
			}
			case 8: return as(BigInt(value), index);
			case "BigInt": return as(Object(BigInt(value)), index);
			case "ArrayBuffer": return as(new Uint8Array(value).buffer, value);
			case "DataView": {
				const { buffer } = new Uint8Array(value);
				return as(new DataView(buffer), value);
			}
		}
		return as(guard(type, value), index);
	};
	return unpair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns a deserialized value from a serialized array of Records.
* @param {Record[]} serialized a previously serialized value.
* @returns {any}
*/
var deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);
//#endregion
//#region ../node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/serialize.js
var EMPTY = "";
var { toString: toString$1 } = {};
var { keys } = Object;
var typeOf = (value) => {
	const type = typeof value;
	if (type !== "object" || !value) return [0, type];
	const asString = toString$1.call(value).slice(8, -1);
	switch (asString) {
		case "Array": return [1, EMPTY];
		case "Object": return [2, EMPTY];
		case "Date": return [3, EMPTY];
		case "RegExp": return [4, EMPTY];
		case "Map": return [5, EMPTY];
		case "Set": return [6, EMPTY];
		case "DataView": return [1, asString];
	}
	if (asString.includes("Array")) return [1, asString];
	if (asString.includes("Error")) return [7, asString];
	return [2, asString];
};
var shouldSkip = ([TYPE, type]) => TYPE === 0 && (type === "function" || type === "symbol");
var serializer = (strict, json, $, _) => {
	const as = (out, value) => {
		const index = _.push(out) - 1;
		$.set(value, index);
		return index;
	};
	const pair = (value) => {
		if ($.has(value)) return $.get(value);
		let [TYPE, type] = typeOf(value);
		switch (TYPE) {
			case 0: {
				let entry = value;
				switch (type) {
					case "bigint":
						TYPE = 8;
						entry = value.toString();
						break;
					case "function":
					case "symbol":
						if (strict) throw new TypeError("unable to serialize " + type);
						entry = null;
						break;
					case "undefined": return as([-1], value);
				}
				return as([TYPE, entry], value);
			}
			case 1: {
				if (type) {
					let spread = value;
					if (type === "DataView") spread = new Uint8Array(value.buffer);
					else if (type === "ArrayBuffer") spread = new Uint8Array(value);
					return as([type, [...spread]], value);
				}
				const arr = [];
				const index = as([TYPE, arr], value);
				for (const entry of value) arr.push(pair(entry));
				return index;
			}
			case 2: {
				if (type) switch (type) {
					case "BigInt": return as([type, value.toString()], value);
					case "Boolean":
					case "Number":
					case "String": return as([type, value.valueOf()], value);
				}
				if (json && "toJSON" in value) return pair(value.toJSON());
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const key of keys(value)) if (strict || !shouldSkip(typeOf(value[key]))) entries.push([pair(key), pair(value[key])]);
				return index;
			}
			case 3: return as([TYPE, value.toISOString()], value);
			case 4: {
				const { source, flags } = value;
				return as([TYPE, {
					source,
					flags
				}], value);
			}
			case 5: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const [key, entry] of value) if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry)))) entries.push([pair(key), pair(entry)]);
				return index;
			}
			case 6: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const entry of value) if (strict || !shouldSkip(typeOf(entry))) entries.push(pair(entry));
				return index;
			}
		}
		const { message } = value;
		return as([TYPE, {
			name: type,
			message
		}], value);
	};
	return pair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} value a serializable value.
* @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
*  if `true`, will not throw errors on incompatible types, and behave more
*  like JSON stringify would behave. Symbol and Function will be discarded.
* @returns {Record[]}
*/
var serialize$1 = (value, { json, lossy } = {}) => {
	const _ = [];
	return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
};
//#endregion
//#region ../node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/index.js
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} any a serializable value.
* @param {{transfer?: any[], json?: boolean, lossy?: boolean}?} options an object with
* a transfer option (ignored when polyfilled) and/or non standard fields that
* fallback to the polyfill if present.
* @returns {Record[]}
*/
var esm_default = typeof structuredClone === "function" ? (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize$1(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize$1(any, options));
//#endregion
//#region ../node_modules/.pnpm/hast-util-parse-selector@4.0.0/node_modules/hast-util-parse-selector/lib/index.js
/**
* @typedef {import('hast').Element} Element
* @typedef {import('hast').Properties} Properties
*/
/**
* @template {string} SimpleSelector
*   Selector type.
* @template {string} DefaultTagName
*   Default tag name.
* @typedef {(
*   SimpleSelector extends ''
*     ? DefaultTagName
*     : SimpleSelector extends `${infer TagName}.${infer Rest}`
*     ? ExtractTagName<TagName, DefaultTagName>
*     : SimpleSelector extends `${infer TagName}#${infer Rest}`
*     ? ExtractTagName<TagName, DefaultTagName>
*     : SimpleSelector extends string
*     ? SimpleSelector
*     : DefaultTagName
* )} ExtractTagName
*   Extract tag name from a simple selector.
*/
var search$1 = /[#.]/g;
/**
* Create a hast element from a simple CSS selector.
*
* @template {string} Selector
*   Type of selector.
* @template {string} [DefaultTagName='div']
*   Type of default tag name (default: `'div'`).
* @param {Selector | null | undefined} [selector]
*   Simple CSS selector (optional).
*
*   Can contain a tag name (`foo`), classes (`.bar`), and an ID (`#baz`).
*   Multiple classes are allowed.
*   Uses the last ID if multiple IDs are found.
* @param {DefaultTagName | null | undefined} [defaultTagName='div']
*   Tag name to use if `selector` does not specify one (default: `'div'`).
* @returns {Element & {tagName: ExtractTagName<Selector, DefaultTagName>}}
*   Built element.
*/
function parseSelector(selector, defaultTagName) {
	const value = selector || "";
	/** @type {Properties} */
	const props = {};
	let start = 0;
	/** @type {string | undefined} */
	let previous;
	/** @type {string | undefined} */
	let tagName;
	while (start < value.length) {
		search$1.lastIndex = start;
		const match = search$1.exec(value);
		const subvalue = value.slice(start, match ? match.index : value.length);
		if (subvalue) {
			if (!previous) tagName = subvalue;
			else if (previous === "#") props.id = subvalue;
			else if (Array.isArray(props.className)) props.className.push(subvalue);
			else props.className = [subvalue];
			start += subvalue.length;
		}
		if (match) {
			previous = match[0];
			start++;
		}
	}
	return {
		type: "element",
		tagName: tagName || defaultTagName || "div",
		properties: props,
		children: []
	};
}
//#endregion
//#region ../node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/create-h.js
/**
* @import {Element, Nodes, RootContent, Root} from 'hast'
* @import {Info, Schema} from 'property-information'
*/
/**
* @typedef {Array<Nodes | PrimitiveChild>} ArrayChildNested
*   List of children (deep).
*/
/**
* @typedef {Array<ArrayChildNested | Nodes | PrimitiveChild>} ArrayChild
*   List of children.
*/
/**
* @typedef {Array<number | string>} ArrayValue
*   List of property values for space- or comma separated values (such as `className`).
*/
/**
* @typedef {ArrayChild | Nodes | PrimitiveChild} Child
*   Acceptable child value.
*/
/**
* @typedef {number | string | null | undefined} PrimitiveChild
*   Primitive children, either ignored (nullish), or turned into text nodes.
*/
/**
* @typedef {boolean | number | string | null | undefined} PrimitiveValue
*   Primitive property value.
*/
/**
* @typedef {Record<string, PropertyValue | Style>} Properties
*   Acceptable value for element properties.
*/
/**
* @typedef {ArrayValue | PrimitiveValue} PropertyValue
*   Primitive value or list value.
*/
/**
* @typedef {Element | Root} Result
*   Result from a `h` (or `s`) call.
*/
/**
* @typedef {number | string} StyleValue
*   Value for a CSS style field.
*/
/**
* @typedef {Record<string, StyleValue>} Style
*   Supported value of a `style` prop.
*/
/**
* @param {Schema} schema
*   Schema to use.
* @param {string} defaultTagName
*   Default tag name.
* @param {ReadonlyArray<string> | undefined} [caseSensitive]
*   Case-sensitive tag names (default: `undefined`).
* @returns
*   `h`.
*/
function createH(schema, defaultTagName, caseSensitive) {
	const adjust = caseSensitive ? createAdjustMap(caseSensitive) : void 0;
	/**
	* Hyperscript compatible DSL for creating virtual hast trees.
	*
	* @overload
	* @param {null | undefined} [selector]
	* @param {...Child} children
	* @returns {Root}
	*
	* @overload
	* @param {string} selector
	* @param {Properties} properties
	* @param {...Child} children
	* @returns {Element}
	*
	* @overload
	* @param {string} selector
	* @param {...Child} children
	* @returns {Element}
	*
	* @param {string | null | undefined} [selector]
	*   Selector.
	* @param {Child | Properties | null | undefined} [properties]
	*   Properties (or first child) (default: `undefined`).
	* @param {...Child} children
	*   Children.
	* @returns {Result}
	*   Result.
	*/
	function h(selector, properties, ...children) {
		/** @type {Result} */
		let node;
		if (selector === null || selector === void 0) {
			node = {
				type: "root",
				children: []
			};
			const child = properties;
			children.unshift(child);
		} else {
			node = parseSelector(selector, defaultTagName);
			const lower = node.tagName.toLowerCase();
			const adjusted = adjust ? adjust.get(lower) : void 0;
			node.tagName = adjusted || lower;
			if (isChild(properties)) children.unshift(properties);
			else for (const [key, value] of Object.entries(properties)) addProperty(schema, node.properties, key, value);
		}
		for (const child of children) addChild(node.children, child);
		if (node.type === "element" && node.tagName === "template") {
			node.content = {
				type: "root",
				children: node.children
			};
			node.children = [];
		}
		return node;
	}
	return h;
}
/**
* Check if something is properties or a child.
*
* @param {Child | Properties} value
*   Value to check.
* @returns {value is Child}
*   Whether `value` is definitely a child.
*/
function isChild(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return true;
	if (typeof value.type !== "string") return false;
	const record = value;
	const keys = Object.keys(value);
	for (const key of keys) {
		const value = record[key];
		if (value && typeof value === "object") {
			if (!Array.isArray(value)) return true;
			const list = value;
			for (const item of list) if (typeof item !== "number" && typeof item !== "string") return true;
		}
	}
	if ("children" in value && Array.isArray(value.children)) return true;
	return false;
}
/**
* @param {Schema} schema
*   Schema.
* @param {Properties} properties
*   Properties object.
* @param {string} key
*   Property name.
* @param {PropertyValue | Style} value
*   Property value.
* @returns {undefined}
*   Nothing.
*/
function addProperty(schema, properties, key, value) {
	const info = find(schema, key);
	/** @type {PropertyValue} */
	let result;
	if (value === null || value === void 0) return;
	if (typeof value === "number") {
		if (Number.isNaN(value)) return;
		result = value;
	} else if (typeof value === "boolean") result = value;
	else if (typeof value === "string") {
		if (info.spaceSeparated) result = parse$1(value);
		else if (info.commaSeparated) result = parse$2(value);
		else if (info.commaOrSpaceSeparated) result = parse$1(parse$2(value).join(" "));
		else result = parsePrimitive(info, info.property, value);
	} else if (Array.isArray(value)) result = [...value];
	else result = info.property === "style" ? style(value) : String(value);
	if (Array.isArray(result)) {
		/** @type {Array<number | string>} */
		const finalResult = [];
		for (const item of result) finalResult.push(parsePrimitive(info, info.property, item));
		result = finalResult;
	}
	if (info.property === "className" && Array.isArray(properties.className)) result = properties.className.concat(
		/** @type {Array<number | string> | number | string} */
		result
	);
	properties[info.property] = result;
}
/**
* @param {Array<RootContent>} nodes
*   Children.
* @param {Child} value
*   Child.
* @returns {undefined}
*   Nothing.
*/
function addChild(nodes, value) {
	if (value === null || value === void 0) {} else if (typeof value === "number" || typeof value === "string") nodes.push({
		type: "text",
		value: String(value)
	});
	else if (Array.isArray(value)) for (const child of value) addChild(nodes, child);
	else if (typeof value === "object" && "type" in value) {
		if (value.type === "root") addChild(nodes, value.children);
		else nodes.push(value);
	} else throw new Error("Expected node, nodes, or string, got `" + value + "`");
}
/**
* Parse a single primitives.
*
* @param {Info} info
*   Property information.
* @param {string} name
*   Property name.
* @param {PrimitiveValue} value
*   Property value.
* @returns {PrimitiveValue}
*   Property value.
*/
function parsePrimitive(info, name, value) {
	if (typeof value === "string") {
		if (info.number && value && !Number.isNaN(Number(value))) return Number(value);
		if ((info.boolean || info.overloadedBoolean) && (value === "" || normalize$1(value) === normalize$1(name))) return true;
	}
	return value;
}
/**
* Serialize a `style` object as a string.
*
* @param {Style} styles
*   Style object.
* @returns {string}
*   CSS string.
*/
function style(styles) {
	/** @type {Array<string>} */
	const result = [];
	for (const [key, value] of Object.entries(styles)) result.push([key, value].join(": "));
	return result.join("; ");
}
/**
* Create a map to adjust casing.
*
* @param {ReadonlyArray<string>} values
*   List of properly cased keys.
* @returns {Map<string, string>}
*   Map of lowercase keys to uppercase keys.
*/
function createAdjustMap(values) {
	/** @type {Map<string, string>} */
	const result = /* @__PURE__ */ new Map();
	for (const value of values) result.set(value.toLowerCase(), value);
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
/**
* List of case-sensitive SVG tag names.
*
* @type {ReadonlyArray<string>}
*/
var svgCaseSensitiveTagNames = [
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"solidColor",
	"textArea",
	"textPath"
];
//#endregion
//#region ../node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/index.js
/**
* @typedef {import('./jsx-classic.js').Element} h.JSX.Element
* @typedef {import('./jsx-classic.js').ElementChildrenAttribute} h.JSX.ElementChildrenAttribute
* @typedef {import('./jsx-classic.js').IntrinsicAttributes} h.JSX.IntrinsicAttributes
* @typedef {import('./jsx-classic.js').IntrinsicElements} h.JSX.IntrinsicElements
*/
/**
* @typedef {import('./jsx-classic.js').Element} s.JSX.Element
* @typedef {import('./jsx-classic.js').ElementChildrenAttribute} s.JSX.ElementChildrenAttribute
* @typedef {import('./jsx-classic.js').IntrinsicAttributes} s.JSX.IntrinsicAttributes
* @typedef {import('./jsx-classic.js').IntrinsicElements} s.JSX.IntrinsicElements
*/
/** @type {ReturnType<createH>} */
var h = createH(html$2, "div");
/** @type {ReturnType<createH>} */
var s = createH(svg, "g", svgCaseSensitiveTagNames);
//#endregion
//#region ../node_modules/.pnpm/vfile-location@5.0.3/node_modules/vfile-location/lib/index.js
/**
* @import {VFile, Value} from 'vfile'
* @import {Location} from 'vfile-location'
*/
/**
* Create an index of the given document to translate between line/column and
* offset based positional info.
*
* Also implemented in Rust in [`wooorm/markdown-rs`][markdown-rs].
*
* [markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs
*
* @param {VFile | Value} file
*   File to index.
* @returns {Location}
*   Accessors for index.
*/
function location(file) {
	const value = String(file);
	/**
	* List, where each index is a line number (0-based), and each value is the
	* byte index *after* where the line ends.
	*
	* @type {Array<number>}
	*/
	const indices = [];
	return {
		toOffset,
		toPoint
	};
	/** @type {Location['toPoint']} */
	function toPoint(offset) {
		if (typeof offset === "number" && offset > -1 && offset <= value.length) {
			let index = 0;
			while (true) {
				let end = indices[index];
				if (end === void 0) {
					const eol = next(value, indices[index - 1]);
					end = eol === -1 ? value.length + 1 : eol + 1;
					indices[index] = end;
				}
				if (end > offset) return {
					line: index + 1,
					column: offset - (index > 0 ? indices[index - 1] : 0) + 1,
					offset
				};
				index++;
			}
		}
	}
	/** @type {Location['toOffset']} */
	function toOffset(point) {
		if (point && typeof point.line === "number" && typeof point.column === "number" && !Number.isNaN(point.line) && !Number.isNaN(point.column)) {
			while (indices.length < point.line) {
				const from = indices[indices.length - 1];
				const eol = next(value, from);
				const end = eol === -1 ? value.length + 1 : eol + 1;
				if (from === end) break;
				indices.push(end);
			}
			const offset = (point.line > 1 ? indices[point.line - 2] : 0) + point.column - 1;
			if (offset < indices[point.line - 1]) return offset;
		}
	}
}
/**
* @param {string} value
* @param {number} from
*/
function next(value, from) {
	const cr = value.indexOf("\r", from);
	const lf = value.indexOf("\n", from);
	if (lf === -1) return cr;
	if (cr === -1 || cr + 1 === lf) return lf;
	return cr < lf ? cr : lf;
}
//#endregion
//#region ../node_modules/.pnpm/web-namespaces@2.0.1/node_modules/web-namespaces/index.js
/**
* Map of web namespaces.
*
* @type {Record<string, string>}
*/
var webNamespaces = {
	html: "http://www.w3.org/1999/xhtml",
	mathml: "http://www.w3.org/1998/Math/MathML",
	svg: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region ../node_modules/.pnpm/hast-util-from-parse5@8.0.3/node_modules/hast-util-from-parse5/lib/index.js
/**
* @import {ElementData, Element, Nodes, RootContent, Root} from 'hast'
* @import {DefaultTreeAdapterMap, Token} from 'parse5'
* @import {Schema} from 'property-information'
* @import {Point, Position} from 'unist'
* @import {VFile} from 'vfile'
* @import {Options} from 'hast-util-from-parse5'
*/
/**
* @typedef State
*   Info passed around about the current state.
* @property {VFile | undefined} file
*   Corresponding file.
* @property {boolean} location
*   Whether location info was found.
* @property {Schema} schema
*   Current schema.
* @property {boolean | undefined} verbose
*   Add extra positional info.
*/
var own$4 = {}.hasOwnProperty;
/** @type {unknown} */
var proto = Object.prototype;
/**
* Transform a `parse5` AST to hast.
*
* @param {DefaultTreeAdapterMap['node']} tree
*   `parse5` tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Nodes}
*   hast tree.
*/
function fromParse5(tree, options) {
	const settings = options || {};
	return one$2({
		file: settings.file || void 0,
		location: false,
		schema: settings.space === "svg" ? svg : html$2,
		verbose: settings.verbose || false
	}, tree);
}
/**
* Transform a node.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['node']} node
*   p5 node.
* @returns {Nodes}
*   hast node.
*/
function one$2(state, node) {
	/** @type {Nodes} */
	let result;
	switch (node.nodeName) {
		case "#comment": {
			const reference = node;
			result = {
				type: "comment",
				value: reference.data
			};
			patch$2(state, reference, result);
			return result;
		}
		case "#document":
		case "#document-fragment": {
			const reference = node;
			const quirksMode = "mode" in reference ? reference.mode === "quirks" || reference.mode === "limited-quirks" : false;
			result = {
				type: "root",
				children: all$3(state, node.childNodes),
				data: { quirksMode }
			};
			if (state.file && state.location) {
				const document = String(state.file);
				const loc = location(document);
				const start = loc.toPoint(0);
				const end = loc.toPoint(document.length);
				result.position = {
					start,
					end
				};
			}
			return result;
		}
		case "#documentType": {
			const reference = node;
			result = { type: "doctype" };
			patch$2(state, reference, result);
			return result;
		}
		case "#text": {
			const reference = node;
			result = {
				type: "text",
				value: reference.value
			};
			patch$2(state, reference, result);
			return result;
		}
		default:
			result = element$3(state, node);
			return result;
	}
}
/**
* Transform children.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Array<DefaultTreeAdapterMap['node']>} nodes
*   Nodes.
* @returns {Array<RootContent>}
*   hast nodes.
*/
function all$3(state, nodes) {
	let index = -1;
	/** @type {Array<RootContent>} */
	const results = [];
	while (++index < nodes.length) {
		const result = one$2(state, nodes[index]);
		results.push(result);
	}
	return results;
}
/**
* Transform an element.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['element']} node
*   `parse5` node to transform.
* @returns {Element}
*   hast node.
*/
function element$3(state, node) {
	const schema = state.schema;
	state.schema = node.namespaceURI === webNamespaces.svg ? svg : html$2;
	let index = -1;
	/** @type {Record<string, string>} */
	const properties = {};
	while (++index < node.attrs.length) {
		const attribute = node.attrs[index];
		const name = (attribute.prefix ? attribute.prefix + ":" : "") + attribute.name;
		if (!own$4.call(proto, name)) properties[name] = attribute.value;
	}
	const result = (state.schema.space === "svg" ? s : h)(node.tagName, properties, all$3(state, node.childNodes));
	patch$2(state, node, result);
	if (result.tagName === "template") {
		const reference = node;
		const pos = reference.sourceCodeLocation;
		const startTag = pos && pos.startTag && position$2(pos.startTag);
		const endTag = pos && pos.endTag && position$2(pos.endTag);
		const content = one$2(state, reference.content);
		if (startTag && endTag && state.file) content.position = {
			start: startTag.end,
			end: endTag.start
		};
		result.content = content;
	}
	state.schema = schema;
	return result;
}
/**
* Patch positional info from `from` onto `to`.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['node']} from
*   p5 node.
* @param {Nodes} to
*   hast node.
* @returns {undefined}
*   Nothing.
*/
function patch$2(state, from, to) {
	if ("sourceCodeLocation" in from && from.sourceCodeLocation && state.file) {
		const position = createLocation(state, to, from.sourceCodeLocation);
		if (position) {
			state.location = true;
			to.position = position;
		}
	}
}
/**
* Create clean positional information.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Nodes} node
*   hast node.
* @param {Token.ElementLocation} location
*   p5 location info.
* @returns {Position | undefined}
*   Position, or nothing.
*/
function createLocation(state, node, location) {
	const result = position$2(location);
	if (node.type === "element") {
		const tail = node.children[node.children.length - 1];
		if (result && !location.endTag && tail && tail.position && tail.position.end) result.end = Object.assign({}, tail.position.end);
		if (state.verbose) {
			/** @type {Record<string, Position | undefined>} */
			const properties = {};
			/** @type {string} */
			let key;
			if (location.attrs) {
				for (key in location.attrs) if (own$4.call(location.attrs, key)) properties[find(state.schema, key).property] = position$2(location.attrs[key]);
			}
			location.startTag;
			const opening = position$2(location.startTag);
			const closing = location.endTag ? position$2(location.endTag) : void 0;
			/** @type {ElementData['position']} */
			const data = { opening };
			if (closing) data.closing = closing;
			data.properties = properties;
			node.data = { position: data };
		}
	}
	return result;
}
/**
* Turn a p5 location into a position.
*
* @param {Token.Location} loc
*   Location.
* @returns {Position | undefined}
*   Position or nothing.
*/
function position$2(loc) {
	const start = point$3({
		line: loc.startLine,
		column: loc.startCol,
		offset: loc.startOffset
	});
	const end = point$3({
		line: loc.endLine,
		column: loc.endCol,
		offset: loc.endOffset
	});
	return start || end ? {
		start,
		end
	} : void 0;
}
/**
* Filter out invalid points.
*
* @param {Point} point
*   Point with potentially `undefined` values.
* @returns {Point | undefined}
*   Point or nothing.
*/
function point$3(point) {
	return point.line && point.column ? point : void 0;
}
//#endregion
//#region ../node_modules/.pnpm/hast-util-to-parse5@8.0.1/node_modules/hast-util-to-parse5/lib/index.js
/**
* @import {Comment, Doctype, Element, Nodes, RootContent, Root, Text} from 'hast'
* @import {DefaultTreeAdapterMap, Token} from 'parse5'
* @import {Schema} from 'property-information'
*/
/**
* @typedef {DefaultTreeAdapterMap['document']} Parse5Document
* @typedef {DefaultTreeAdapterMap['documentFragment']} Parse5Fragment
* @typedef {DefaultTreeAdapterMap['element']} Parse5Element
* @typedef {DefaultTreeAdapterMap['node']} Parse5Nodes
* @typedef {DefaultTreeAdapterMap['documentType']} Parse5Doctype
* @typedef {DefaultTreeAdapterMap['commentNode']} Parse5Comment
* @typedef {DefaultTreeAdapterMap['textNode']} Parse5Text
* @typedef {DefaultTreeAdapterMap['parentNode']} Parse5Parent
* @typedef {Token.Attribute} Parse5Attribute
*
* @typedef Options
*   Configuration.
* @property {Space | null | undefined} [space='html']
*   Which space the document is in (default: `'html'`).
*
*   When an `<svg>` element is found in the HTML space, this package already
*   automatically switches to and from the SVG space when entering and exiting
*   it.
*
* @typedef {Exclude<Parse5Nodes, Parse5Document | Parse5Fragment>} Parse5Content
*
* @typedef {'html' | 'svg'} Space
*/
/** @type {Options} */
var emptyOptions$3 = {};
var own$3 = {}.hasOwnProperty;
var one$1 = zwitch("type", { handlers: {
	root: root$3,
	element: element$2,
	text: text$6,
	comment: comment$1,
	doctype: doctype$1
} });
/**
* Transform a hast tree to a `parse5` AST.
*
* @param {Nodes} tree
*   Tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Parse5Nodes}
*   `parse5` node.
*/
function toParse5(tree, options) {
	const space = (options || emptyOptions$3).space;
	return one$1(tree, space === "svg" ? svg : html$2);
}
/**
* @param {Root} node
*   Node (hast) to transform.
* @param {Schema} schema
*   Current schema.
* @returns {Parse5Document}
*   Parse5 node.
*/
function root$3(node, schema) {
	/** @type {Parse5Document} */
	const result = {
		nodeName: "#document",
		mode: (node.data || {}).quirksMode ? "quirks" : "no-quirks",
		childNodes: []
	};
	result.childNodes = all$2(node.children, result, schema);
	patch$1(node, result);
	return result;
}
/**
* @param {Root} node
*   Node (hast) to transform.
* @param {Schema} schema
*   Current schema.
* @returns {Parse5Fragment}
*   Parse5 node.
*/
function fragment(node, schema) {
	/** @type {Parse5Fragment} */
	const result = {
		nodeName: "#document-fragment",
		childNodes: []
	};
	result.childNodes = all$2(node.children, result, schema);
	patch$1(node, result);
	return result;
}
/**
* @param {Doctype} node
*   Node (hast) to transform.
* @returns {Parse5Doctype}
*   Parse5 node.
*/
function doctype$1(node) {
	/** @type {Parse5Doctype} */
	const result = {
		nodeName: "#documentType",
		name: "html",
		publicId: "",
		systemId: "",
		parentNode: null
	};
	patch$1(node, result);
	return result;
}
/**
* @param {Text} node
*   Node (hast) to transform.
* @returns {Parse5Text}
*   Parse5 node.
*/
function text$6(node) {
	/** @type {Parse5Text} */
	const result = {
		nodeName: "#text",
		value: node.value,
		parentNode: null
	};
	patch$1(node, result);
	return result;
}
/**
* @param {Comment} node
*   Node (hast) to transform.
* @returns {Parse5Comment}
*   Parse5 node.
*/
function comment$1(node) {
	/** @type {Parse5Comment} */
	const result = {
		nodeName: "#comment",
		data: node.value,
		parentNode: null
	};
	patch$1(node, result);
	return result;
}
/**
* @param {Element} node
*   Node (hast) to transform.
* @param {Schema} schema
*   Current schema.
* @returns {Parse5Element}
*   Parse5 node.
*/
function element$2(node, schema) {
	const parentSchema = schema;
	let currentSchema = parentSchema;
	if (node.type === "element" && node.tagName.toLowerCase() === "svg" && parentSchema.space === "html") currentSchema = svg;
	/** @type {Array<Parse5Attribute>} */
	const attrs = [];
	/** @type {string} */
	let prop;
	if (node.properties) {
		for (prop in node.properties) if (prop !== "children" && own$3.call(node.properties, prop)) {
			const result = createProperty(currentSchema, prop, node.properties[prop]);
			if (result) attrs.push(result);
		}
	}
	const space = currentSchema.space;
	/** @type {Parse5Element} */
	const result = {
		nodeName: node.tagName,
		tagName: node.tagName,
		attrs,
		namespaceURI: webNamespaces[space],
		childNodes: [],
		parentNode: null
	};
	result.childNodes = all$2(node.children, result, currentSchema);
	patch$1(node, result);
	if (node.tagName === "template" && node.content) result.content = fragment(node.content, currentSchema);
	return result;
}
/**
* Handle a property.
*
* @param {Schema} schema
*   Current schema.
* @param {string} prop
*   Key.
* @param {Array<number | string> | boolean | number | string | null | undefined} value
*   hast property value.
* @returns {Parse5Attribute | undefined}
*   Field for runtime, optional.
*/
function createProperty(schema, prop, value) {
	const info = find(schema, prop);
	if (value === false || value === null || value === void 0 || typeof value === "number" && Number.isNaN(value) || !value && info.boolean) return;
	if (Array.isArray(value)) value = info.commaSeparated ? stringify(value) : stringify$1(value);
	/** @type {Parse5Attribute} */
	const attribute = {
		name: info.attribute,
		value: value === true ? "" : String(value)
	};
	if (info.space && info.space !== "html" && info.space !== "svg") {
		const index = attribute.name.indexOf(":");
		if (index < 0) attribute.prefix = "";
		else {
			attribute.name = attribute.name.slice(index + 1);
			attribute.prefix = info.attribute.slice(0, index);
		}
		attribute.namespace = webNamespaces[info.space];
	}
	return attribute;
}
/**
* Transform all hast nodes.
*
* @param {Array<RootContent>} children
*   List of children.
* @param {Parse5Parent} parentNode
*   `parse5` parent node.
* @param {Schema} schema
*   Current schema.
* @returns {Array<Parse5Content>}
*   Transformed children.
*/
function all$2(children, parentNode, schema) {
	let index = -1;
	/** @type {Array<Parse5Content>} */
	const results = [];
	if (children) while (++index < children.length) {
		/** @type {Parse5Content} */
		const child = one$1(children[index], schema);
		child.parentNode = parentNode;
		results.push(child);
	}
	return results;
}
/**
* Add position info from `from` to `to`.
*
* @param {Nodes} from
*   hast node.
* @param {Parse5Nodes} to
*   `parse5` node.
* @returns {undefined}
*   Nothing.
*/
function patch$1(from, to) {
	const position = from.position;
	if (position && position.start && position.end) {
		position.start.offset;
		position.end.offset;
		to.sourceCodeLocation = {
			startLine: position.start.line,
			startCol: position.start.column,
			startOffset: position.start.offset,
			endLine: position.end.line,
			endCol: position.end.column,
			endOffset: position.end.offset
		};
	}
}
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/unicode.js
var UNDEFINED_CODE_POINTS = /* @__PURE__ */ new Set([
	65534,
	65535,
	131070,
	131071,
	196606,
	196607,
	262142,
	262143,
	327678,
	327679,
	393214,
	393215,
	458750,
	458751,
	524286,
	524287,
	589822,
	589823,
	655358,
	655359,
	720894,
	720895,
	786430,
	786431,
	851966,
	851967,
	917502,
	917503,
	983038,
	983039,
	1048574,
	1048575,
	1114110,
	1114111
]);
var CODE_POINTS;
(function(CODE_POINTS) {
	CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
	CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
	CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
	CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
	CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
	CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
	CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
	CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
	CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
	CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
	CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
	CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
	CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
	CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
	CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
	CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
	CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
	CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
	CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
	CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
	CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
	CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
	CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
	CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
	CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
	CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));
var SEQUENCES = {
	DASH_DASH: "--",
	CDATA_START: "[CDATA[",
	DOCTYPE: "doctype",
	SCRIPT: "script",
	PUBLIC: "public",
	SYSTEM: "system"
};
function isSurrogate(cp) {
	return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
	return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
	return (cp1 - 55296) * 1024 + 9216 + cp2;
}
function isControlCodePoint(cp) {
	return cp !== 32 && cp !== 10 && cp !== 13 && cp !== 9 && cp !== 12 && cp >= 1 && cp <= 31 || cp >= 127 && cp <= 159;
}
function isUndefinedCodePoint(cp) {
	return cp >= 64976 && cp <= 65007 || UNDEFINED_CODE_POINTS.has(cp);
}
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/error-codes.js
var ERR;
(function(ERR) {
	ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
	ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
	ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
	ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
	ERR["endTagWithAttributes"] = "end-tag-with-attributes";
	ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
	ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
	ERR["unexpectedNullCharacter"] = "unexpected-null-character";
	ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
	ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
	ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
	ERR["missingEndTagName"] = "missing-end-tag-name";
	ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
	ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
	ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
	ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
	ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
	ERR["eofBeforeTagName"] = "eof-before-tag-name";
	ERR["eofInTag"] = "eof-in-tag";
	ERR["missingAttributeValue"] = "missing-attribute-value";
	ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
	ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
	ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
	ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
	ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
	ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
	ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
	ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
	ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
	ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
	ERR["cdataInHtmlContent"] = "cdata-in-html-content";
	ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
	ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
	ERR["eofInDoctype"] = "eof-in-doctype";
	ERR["nestedComment"] = "nested-comment";
	ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
	ERR["eofInComment"] = "eof-in-comment";
	ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
	ERR["eofInCdata"] = "eof-in-cdata";
	ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
	ERR["nullCharacterReference"] = "null-character-reference";
	ERR["surrogateCharacterReference"] = "surrogate-character-reference";
	ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
	ERR["controlCharacterReference"] = "control-character-reference";
	ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
	ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
	ERR["missingDoctypeName"] = "missing-doctype-name";
	ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
	ERR["duplicateAttribute"] = "duplicate-attribute";
	ERR["nonConformingDoctype"] = "non-conforming-doctype";
	ERR["missingDoctype"] = "missing-doctype";
	ERR["misplacedDoctype"] = "misplaced-doctype";
	ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
	ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
	ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
	ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
	ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
	ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
	ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
	ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tokenizer/preprocessor.js
var DEFAULT_BUFFER_WATERLINE = 65536;
var Preprocessor = class {
	constructor(handler) {
		this.handler = handler;
		this.html = "";
		this.pos = -1;
		this.lastGapPos = -2;
		this.gapStack = [];
		this.skipNextNewLine = false;
		this.lastChunkWritten = false;
		this.endOfChunkHit = false;
		this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
		this.isEol = false;
		this.lineStartPos = 0;
		this.droppedBufferSize = 0;
		this.line = 1;
		this.lastErrOffset = -1;
	}
	/** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */
	get col() {
		return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
	}
	get offset() {
		return this.droppedBufferSize + this.pos;
	}
	getError(code, cpOffset) {
		const { line, col, offset } = this;
		const startCol = col + cpOffset;
		const startOffset = offset + cpOffset;
		return {
			code,
			startLine: line,
			endLine: line,
			startCol,
			endCol: startCol,
			startOffset,
			endOffset: startOffset
		};
	}
	_err(code) {
		if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
			this.lastErrOffset = this.offset;
			this.handler.onParseError(this.getError(code, 0));
		}
	}
	_addGap() {
		this.gapStack.push(this.lastGapPos);
		this.lastGapPos = this.pos;
	}
	_processSurrogate(cp) {
		if (this.pos !== this.html.length - 1) {
			const nextCp = this.html.charCodeAt(this.pos + 1);
			if (isSurrogatePair(nextCp)) {
				this.pos++;
				this._addGap();
				return getSurrogatePairCodePoint(cp, nextCp);
			}
		} else if (!this.lastChunkWritten) {
			this.endOfChunkHit = true;
			return CODE_POINTS.EOF;
		}
		this._err(ERR.surrogateInInputStream);
		return cp;
	}
	willDropParsedChunk() {
		return this.pos > this.bufferWaterline;
	}
	dropParsedChunk() {
		if (this.willDropParsedChunk()) {
			this.html = this.html.substring(this.pos);
			this.lineStartPos -= this.pos;
			this.droppedBufferSize += this.pos;
			this.pos = 0;
			this.lastGapPos = -2;
			this.gapStack.length = 0;
		}
	}
	write(chunk, isLastChunk) {
		if (this.html.length > 0) this.html += chunk;
		else this.html = chunk;
		this.endOfChunkHit = false;
		this.lastChunkWritten = isLastChunk;
	}
	insertHtmlAtCurrentPos(chunk) {
		this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
		this.endOfChunkHit = false;
	}
	startsWith(pattern, caseSensitive) {
		if (this.pos + pattern.length > this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return false;
		}
		if (caseSensitive) return this.html.startsWith(pattern, this.pos);
		for (let i = 0; i < pattern.length; i++) if ((this.html.charCodeAt(this.pos + i) | 32) !== pattern.charCodeAt(i)) return false;
		return true;
	}
	peek(offset) {
		const pos = this.pos + offset;
		if (pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		const code = this.html.charCodeAt(pos);
		return code === CODE_POINTS.CARRIAGE_RETURN ? CODE_POINTS.LINE_FEED : code;
	}
	advance() {
		this.pos++;
		if (this.isEol) {
			this.isEol = false;
			this.line++;
			this.lineStartPos = this.pos;
		}
		if (this.pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		let cp = this.html.charCodeAt(this.pos);
		if (cp === CODE_POINTS.CARRIAGE_RETURN) {
			this.isEol = true;
			this.skipNextNewLine = true;
			return CODE_POINTS.LINE_FEED;
		}
		if (cp === CODE_POINTS.LINE_FEED) {
			this.isEol = true;
			if (this.skipNextNewLine) {
				this.line--;
				this.skipNextNewLine = false;
				this._addGap();
				return this.advance();
			}
		}
		this.skipNextNewLine = false;
		if (isSurrogate(cp)) cp = this._processSurrogate(cp);
		if (!(this.handler.onParseError === null || cp > 31 && cp < 127 || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.CARRIAGE_RETURN || cp > 159 && cp < 64976)) this._checkForProblematicCharacters(cp);
		return cp;
	}
	_checkForProblematicCharacters(cp) {
		if (isControlCodePoint(cp)) this._err(ERR.controlCharacterInInputStream);
		else if (isUndefinedCodePoint(cp)) this._err(ERR.noncharacterInInputStream);
	}
	retreat(count) {
		this.pos -= count;
		while (this.pos < this.lastGapPos) {
			this.lastGapPos = this.gapStack.pop();
			this.pos--;
		}
		this.isEol = false;
	}
};
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/token.js
var TokenType;
(function(TokenType) {
	TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
	TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
	TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
	TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
	TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
	TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
	TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
	TokenType[TokenType["EOF"] = 7] = "EOF";
	TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
function getTokenAttr(token, attrName) {
	for (let i = token.attrs.length - 1; i >= 0; i--) if (token.attrs[i].name === attrName) return token.attrs[i].value;
	return null;
}
//#endregion
//#region ../node_modules/.pnpm/entities@6.0.1/node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* #__PURE__ */ new Uint16Array(/* #__PURE__ */ "ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((c) => c.charCodeAt(0)));
var decodeMap = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
String.fromCodePoint;
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
*/
function replaceCodePoint(codePoint) {
	var _a;
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
//#endregion
//#region ../node_modules/.pnpm/entities@6.0.1/node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes) {
	CharCodes[CharCodes["NUM"] = 35] = "NUM";
	CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
	CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
	CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
	CharCodes[CharCodes["NINE"] = 57] = "NINE";
	CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
	CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
	CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
	CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
	CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
	CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
	CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */
var TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags) {
	BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
	BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
	BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
	return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric$1(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
*/
function isEntityInAttributeInvalidEnd(code) {
	return code === CharCodes.EQUALS || isAsciiAlphaNumeric$1(code);
}
var EntityDecoderState;
(function(EntityDecoderState) {
	EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
	EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
	EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
	EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
	EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode) {
	/** Entities in text nodes that can end with any character. */
	DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
	/** Only allow entities terminated with a semicolon. */
	DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
	/** Entities in attributes have limitations on ending characters. */
	DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
/**
* Token decoder with support of writing partial entities.
*/
var EntityDecoder = class {
	constructor(decodeTree, emitCodePoint, errors) {
		this.decodeTree = decodeTree;
		this.emitCodePoint = emitCodePoint;
		this.errors = errors;
		/** The current state of the decoder. */
		this.state = EntityDecoderState.EntityStart;
		/** Characters that were consumed while parsing an entity. */
		this.consumed = 1;
		/**
		* The result of the entity.
		*
		* Either the result index of a numeric entity, or the codepoint of a
		* numeric entity.
		*/
		this.result = 0;
		/** The current index in the decode tree. */
		this.treeIndex = 0;
		/** The number of characters that were consumed in excess. */
		this.excess = 1;
		/** The mode in which the decoder is operating. */
		this.decodeMode = DecodingMode.Strict;
	}
	/** Resets the instance to make it reusable. */
	startEntity(decodeMode) {
		this.decodeMode = decodeMode;
		this.state = EntityDecoderState.EntityStart;
		this.result = 0;
		this.treeIndex = 0;
		this.excess = 1;
		this.consumed = 1;
	}
	/**
	* Write an entity to the decoder. This can be called multiple times with partial entities.
	* If the entity is incomplete, the decoder will return -1.
	*
	* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
	* entity is incomplete, and resume when the next string is written.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	write(input, offset) {
		switch (this.state) {
			case EntityDecoderState.EntityStart:
				if (input.charCodeAt(offset) === CharCodes.NUM) {
					this.state = EntityDecoderState.NumericStart;
					this.consumed += 1;
					return this.stateNumericStart(input, offset + 1);
				}
				this.state = EntityDecoderState.NamedEntity;
				return this.stateNamedEntity(input, offset);
			case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
			case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
			case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
			case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
		}
	}
	/**
	* Switches between the numeric decimal and hexadecimal states.
	*
	* Equivalent to the `Numeric character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericStart(input, offset) {
		if (offset >= input.length) return -1;
		if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
			this.state = EntityDecoderState.NumericHex;
			this.consumed += 1;
			return this.stateNumericHex(input, offset + 1);
		}
		this.state = EntityDecoderState.NumericDecimal;
		return this.stateNumericDecimal(input, offset);
	}
	addToNumericResult(input, start, end, base) {
		if (start !== end) {
			const digitCount = end - start;
			this.result = this.result * Math.pow(base, digitCount) + Number.parseInt(input.substr(start, digitCount), base);
			this.consumed += digitCount;
		}
	}
	/**
	* Parses a hexadecimal numeric entity.
	*
	* Equivalent to the `Hexademical character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericHex(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 16);
				return this.emitNumericEntity(char, 3);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 16);
		return -1;
	}
	/**
	* Parses a decimal numeric entity.
	*
	* Equivalent to the `Decimal character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericDecimal(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 10);
				return this.emitNumericEntity(char, 2);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 10);
		return -1;
	}
	/**
	* Validate and emit a numeric entity.
	*
	* Implements the logic from the `Hexademical character reference start
	* state` and `Numeric character reference end state` in the HTML spec.
	*
	* @param lastCp The last code point of the entity. Used to see if the
	*               entity was terminated with a semicolon.
	* @param expectedLength The minimum number of characters that should be
	*                       consumed. Used to validate that at least one digit
	*                       was consumed.
	* @returns The number of characters that were consumed.
	*/
	emitNumericEntity(lastCp, expectedLength) {
		var _a;
		if (this.consumed <= expectedLength) {
			(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
			return 0;
		}
		if (lastCp === CharCodes.SEMI) this.consumed += 1;
		else if (this.decodeMode === DecodingMode.Strict) return 0;
		this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
		if (this.errors) {
			if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
			this.errors.validateNumericCharacterReference(this.result);
		}
		return this.consumed;
	}
	/**
	* Parses a named entity.
	*
	* Equivalent to the `Named character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNamedEntity(input, offset) {
		const { decodeTree } = this;
		let current = decodeTree[this.treeIndex];
		let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
		for (; offset < input.length; offset++, this.excess++) {
			const char = input.charCodeAt(offset);
			this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
			if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
			current = decodeTree[this.treeIndex];
			valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			if (valueLength !== 0) {
				if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				if (this.decodeMode !== DecodingMode.Strict) {
					this.result = this.treeIndex;
					this.consumed += this.excess;
					this.excess = 0;
				}
			}
		}
		return -1;
	}
	/**
	* Emit a named entity that was not terminated with a semicolon.
	*
	* @returns The number of characters consumed.
	*/
	emitNotTerminatedNamedEntity() {
		var _a;
		const { result, decodeTree } = this;
		const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
		this.emitNamedEntityData(result, valueLength, this.consumed);
		(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
		return this.consumed;
	}
	/**
	* Emit a named entity.
	*
	* @param result The index of the entity in the decode tree.
	* @param valueLength The number of bytes in the entity.
	* @param consumed The number of characters consumed.
	*
	* @returns The number of characters consumed.
	*/
	emitNamedEntityData(result, valueLength, consumed) {
		const { decodeTree } = this;
		this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
		if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
		return consumed;
	}
	/**
	* Signal to the parser that the end of the input was reached.
	*
	* Remaining data will be emitted and relevant errors will be produced.
	*
	* @returns The number of characters consumed.
	*/
	end() {
		var _a;
		switch (this.state) {
			case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
			case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
			case EntityDecoderState.NumericStart:
				(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			case EntityDecoderState.EntityStart: return 0;
		}
	}
};
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
*
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIdx The index right after the current node and its value.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	let lo = nodeIndex;
	let hi = lo + branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midValue = decodeTree[mid];
		if (midValue < char) lo = mid + 1;
		else if (midValue > char) hi = mid - 1;
		else return decodeTree[mid + branchCount];
	}
	return -1;
}
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/html.js
/** All valid namespaces in HTML. */
var NS;
(function(NS) {
	NS["HTML"] = "http://www.w3.org/1999/xhtml";
	NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
	NS["SVG"] = "http://www.w3.org/2000/svg";
	NS["XLINK"] = "http://www.w3.org/1999/xlink";
	NS["XML"] = "http://www.w3.org/XML/1998/namespace";
	NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function(ATTRS) {
	ATTRS["TYPE"] = "type";
	ATTRS["ACTION"] = "action";
	ATTRS["ENCODING"] = "encoding";
	ATTRS["PROMPT"] = "prompt";
	ATTRS["NAME"] = "name";
	ATTRS["COLOR"] = "color";
	ATTRS["FACE"] = "face";
	ATTRS["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
/**
* The mode of the document.
*
* @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
*/
var DOCUMENT_MODE;
(function(DOCUMENT_MODE) {
	DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
	DOCUMENT_MODE["QUIRKS"] = "quirks";
	DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES) {
	TAG_NAMES["A"] = "a";
	TAG_NAMES["ADDRESS"] = "address";
	TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
	TAG_NAMES["APPLET"] = "applet";
	TAG_NAMES["AREA"] = "area";
	TAG_NAMES["ARTICLE"] = "article";
	TAG_NAMES["ASIDE"] = "aside";
	TAG_NAMES["B"] = "b";
	TAG_NAMES["BASE"] = "base";
	TAG_NAMES["BASEFONT"] = "basefont";
	TAG_NAMES["BGSOUND"] = "bgsound";
	TAG_NAMES["BIG"] = "big";
	TAG_NAMES["BLOCKQUOTE"] = "blockquote";
	TAG_NAMES["BODY"] = "body";
	TAG_NAMES["BR"] = "br";
	TAG_NAMES["BUTTON"] = "button";
	TAG_NAMES["CAPTION"] = "caption";
	TAG_NAMES["CENTER"] = "center";
	TAG_NAMES["CODE"] = "code";
	TAG_NAMES["COL"] = "col";
	TAG_NAMES["COLGROUP"] = "colgroup";
	TAG_NAMES["DD"] = "dd";
	TAG_NAMES["DESC"] = "desc";
	TAG_NAMES["DETAILS"] = "details";
	TAG_NAMES["DIALOG"] = "dialog";
	TAG_NAMES["DIR"] = "dir";
	TAG_NAMES["DIV"] = "div";
	TAG_NAMES["DL"] = "dl";
	TAG_NAMES["DT"] = "dt";
	TAG_NAMES["EM"] = "em";
	TAG_NAMES["EMBED"] = "embed";
	TAG_NAMES["FIELDSET"] = "fieldset";
	TAG_NAMES["FIGCAPTION"] = "figcaption";
	TAG_NAMES["FIGURE"] = "figure";
	TAG_NAMES["FONT"] = "font";
	TAG_NAMES["FOOTER"] = "footer";
	TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
	TAG_NAMES["FORM"] = "form";
	TAG_NAMES["FRAME"] = "frame";
	TAG_NAMES["FRAMESET"] = "frameset";
	TAG_NAMES["H1"] = "h1";
	TAG_NAMES["H2"] = "h2";
	TAG_NAMES["H3"] = "h3";
	TAG_NAMES["H4"] = "h4";
	TAG_NAMES["H5"] = "h5";
	TAG_NAMES["H6"] = "h6";
	TAG_NAMES["HEAD"] = "head";
	TAG_NAMES["HEADER"] = "header";
	TAG_NAMES["HGROUP"] = "hgroup";
	TAG_NAMES["HR"] = "hr";
	TAG_NAMES["HTML"] = "html";
	TAG_NAMES["I"] = "i";
	TAG_NAMES["IMG"] = "img";
	TAG_NAMES["IMAGE"] = "image";
	TAG_NAMES["INPUT"] = "input";
	TAG_NAMES["IFRAME"] = "iframe";
	TAG_NAMES["KEYGEN"] = "keygen";
	TAG_NAMES["LABEL"] = "label";
	TAG_NAMES["LI"] = "li";
	TAG_NAMES["LINK"] = "link";
	TAG_NAMES["LISTING"] = "listing";
	TAG_NAMES["MAIN"] = "main";
	TAG_NAMES["MALIGNMARK"] = "malignmark";
	TAG_NAMES["MARQUEE"] = "marquee";
	TAG_NAMES["MATH"] = "math";
	TAG_NAMES["MENU"] = "menu";
	TAG_NAMES["META"] = "meta";
	TAG_NAMES["MGLYPH"] = "mglyph";
	TAG_NAMES["MI"] = "mi";
	TAG_NAMES["MO"] = "mo";
	TAG_NAMES["MN"] = "mn";
	TAG_NAMES["MS"] = "ms";
	TAG_NAMES["MTEXT"] = "mtext";
	TAG_NAMES["NAV"] = "nav";
	TAG_NAMES["NOBR"] = "nobr";
	TAG_NAMES["NOFRAMES"] = "noframes";
	TAG_NAMES["NOEMBED"] = "noembed";
	TAG_NAMES["NOSCRIPT"] = "noscript";
	TAG_NAMES["OBJECT"] = "object";
	TAG_NAMES["OL"] = "ol";
	TAG_NAMES["OPTGROUP"] = "optgroup";
	TAG_NAMES["OPTION"] = "option";
	TAG_NAMES["P"] = "p";
	TAG_NAMES["PARAM"] = "param";
	TAG_NAMES["PLAINTEXT"] = "plaintext";
	TAG_NAMES["PRE"] = "pre";
	TAG_NAMES["RB"] = "rb";
	TAG_NAMES["RP"] = "rp";
	TAG_NAMES["RT"] = "rt";
	TAG_NAMES["RTC"] = "rtc";
	TAG_NAMES["RUBY"] = "ruby";
	TAG_NAMES["S"] = "s";
	TAG_NAMES["SCRIPT"] = "script";
	TAG_NAMES["SEARCH"] = "search";
	TAG_NAMES["SECTION"] = "section";
	TAG_NAMES["SELECT"] = "select";
	TAG_NAMES["SOURCE"] = "source";
	TAG_NAMES["SMALL"] = "small";
	TAG_NAMES["SPAN"] = "span";
	TAG_NAMES["STRIKE"] = "strike";
	TAG_NAMES["STRONG"] = "strong";
	TAG_NAMES["STYLE"] = "style";
	TAG_NAMES["SUB"] = "sub";
	TAG_NAMES["SUMMARY"] = "summary";
	TAG_NAMES["SUP"] = "sup";
	TAG_NAMES["TABLE"] = "table";
	TAG_NAMES["TBODY"] = "tbody";
	TAG_NAMES["TEMPLATE"] = "template";
	TAG_NAMES["TEXTAREA"] = "textarea";
	TAG_NAMES["TFOOT"] = "tfoot";
	TAG_NAMES["TD"] = "td";
	TAG_NAMES["TH"] = "th";
	TAG_NAMES["THEAD"] = "thead";
	TAG_NAMES["TITLE"] = "title";
	TAG_NAMES["TR"] = "tr";
	TAG_NAMES["TRACK"] = "track";
	TAG_NAMES["TT"] = "tt";
	TAG_NAMES["U"] = "u";
	TAG_NAMES["UL"] = "ul";
	TAG_NAMES["SVG"] = "svg";
	TAG_NAMES["VAR"] = "var";
	TAG_NAMES["WBR"] = "wbr";
	TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
/**
* Tag IDs are numeric IDs for known tag names.
*
* We use tag IDs to improve the performance of tag name comparisons.
*/
var TAG_ID;
(function(TAG_ID) {
	TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
	TAG_ID[TAG_ID["A"] = 1] = "A";
	TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
	TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
	TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
	TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
	TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
	TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
	TAG_ID[TAG_ID["B"] = 8] = "B";
	TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
	TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
	TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
	TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
	TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
	TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
	TAG_ID[TAG_ID["BR"] = 15] = "BR";
	TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
	TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
	TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
	TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
	TAG_ID[TAG_ID["COL"] = 20] = "COL";
	TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
	TAG_ID[TAG_ID["DD"] = 22] = "DD";
	TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
	TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
	TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
	TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
	TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
	TAG_ID[TAG_ID["DL"] = 28] = "DL";
	TAG_ID[TAG_ID["DT"] = 29] = "DT";
	TAG_ID[TAG_ID["EM"] = 30] = "EM";
	TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
	TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
	TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
	TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
	TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
	TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
	TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
	TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
	TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
	TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
	TAG_ID[TAG_ID["H1"] = 41] = "H1";
	TAG_ID[TAG_ID["H2"] = 42] = "H2";
	TAG_ID[TAG_ID["H3"] = 43] = "H3";
	TAG_ID[TAG_ID["H4"] = 44] = "H4";
	TAG_ID[TAG_ID["H5"] = 45] = "H5";
	TAG_ID[TAG_ID["H6"] = 46] = "H6";
	TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
	TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
	TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
	TAG_ID[TAG_ID["HR"] = 50] = "HR";
	TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
	TAG_ID[TAG_ID["I"] = 52] = "I";
	TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
	TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
	TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
	TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
	TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
	TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
	TAG_ID[TAG_ID["LI"] = 59] = "LI";
	TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
	TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
	TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
	TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
	TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
	TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
	TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
	TAG_ID[TAG_ID["META"] = 67] = "META";
	TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
	TAG_ID[TAG_ID["MI"] = 69] = "MI";
	TAG_ID[TAG_ID["MO"] = 70] = "MO";
	TAG_ID[TAG_ID["MN"] = 71] = "MN";
	TAG_ID[TAG_ID["MS"] = 72] = "MS";
	TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
	TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
	TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
	TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
	TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
	TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
	TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
	TAG_ID[TAG_ID["OL"] = 80] = "OL";
	TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
	TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
	TAG_ID[TAG_ID["P"] = 83] = "P";
	TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
	TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
	TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
	TAG_ID[TAG_ID["RB"] = 87] = "RB";
	TAG_ID[TAG_ID["RP"] = 88] = "RP";
	TAG_ID[TAG_ID["RT"] = 89] = "RT";
	TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
	TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
	TAG_ID[TAG_ID["S"] = 92] = "S";
	TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
	TAG_ID[TAG_ID["SEARCH"] = 94] = "SEARCH";
	TAG_ID[TAG_ID["SECTION"] = 95] = "SECTION";
	TAG_ID[TAG_ID["SELECT"] = 96] = "SELECT";
	TAG_ID[TAG_ID["SOURCE"] = 97] = "SOURCE";
	TAG_ID[TAG_ID["SMALL"] = 98] = "SMALL";
	TAG_ID[TAG_ID["SPAN"] = 99] = "SPAN";
	TAG_ID[TAG_ID["STRIKE"] = 100] = "STRIKE";
	TAG_ID[TAG_ID["STRONG"] = 101] = "STRONG";
	TAG_ID[TAG_ID["STYLE"] = 102] = "STYLE";
	TAG_ID[TAG_ID["SUB"] = 103] = "SUB";
	TAG_ID[TAG_ID["SUMMARY"] = 104] = "SUMMARY";
	TAG_ID[TAG_ID["SUP"] = 105] = "SUP";
	TAG_ID[TAG_ID["TABLE"] = 106] = "TABLE";
	TAG_ID[TAG_ID["TBODY"] = 107] = "TBODY";
	TAG_ID[TAG_ID["TEMPLATE"] = 108] = "TEMPLATE";
	TAG_ID[TAG_ID["TEXTAREA"] = 109] = "TEXTAREA";
	TAG_ID[TAG_ID["TFOOT"] = 110] = "TFOOT";
	TAG_ID[TAG_ID["TD"] = 111] = "TD";
	TAG_ID[TAG_ID["TH"] = 112] = "TH";
	TAG_ID[TAG_ID["THEAD"] = 113] = "THEAD";
	TAG_ID[TAG_ID["TITLE"] = 114] = "TITLE";
	TAG_ID[TAG_ID["TR"] = 115] = "TR";
	TAG_ID[TAG_ID["TRACK"] = 116] = "TRACK";
	TAG_ID[TAG_ID["TT"] = 117] = "TT";
	TAG_ID[TAG_ID["U"] = 118] = "U";
	TAG_ID[TAG_ID["UL"] = 119] = "UL";
	TAG_ID[TAG_ID["SVG"] = 120] = "SVG";
	TAG_ID[TAG_ID["VAR"] = 121] = "VAR";
	TAG_ID[TAG_ID["WBR"] = 122] = "WBR";
	TAG_ID[TAG_ID["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
var TAG_NAME_TO_ID = /* @__PURE__ */ new Map([
	[TAG_NAMES.A, TAG_ID.A],
	[TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
	[TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
	[TAG_NAMES.APPLET, TAG_ID.APPLET],
	[TAG_NAMES.AREA, TAG_ID.AREA],
	[TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
	[TAG_NAMES.ASIDE, TAG_ID.ASIDE],
	[TAG_NAMES.B, TAG_ID.B],
	[TAG_NAMES.BASE, TAG_ID.BASE],
	[TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
	[TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
	[TAG_NAMES.BIG, TAG_ID.BIG],
	[TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
	[TAG_NAMES.BODY, TAG_ID.BODY],
	[TAG_NAMES.BR, TAG_ID.BR],
	[TAG_NAMES.BUTTON, TAG_ID.BUTTON],
	[TAG_NAMES.CAPTION, TAG_ID.CAPTION],
	[TAG_NAMES.CENTER, TAG_ID.CENTER],
	[TAG_NAMES.CODE, TAG_ID.CODE],
	[TAG_NAMES.COL, TAG_ID.COL],
	[TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
	[TAG_NAMES.DD, TAG_ID.DD],
	[TAG_NAMES.DESC, TAG_ID.DESC],
	[TAG_NAMES.DETAILS, TAG_ID.DETAILS],
	[TAG_NAMES.DIALOG, TAG_ID.DIALOG],
	[TAG_NAMES.DIR, TAG_ID.DIR],
	[TAG_NAMES.DIV, TAG_ID.DIV],
	[TAG_NAMES.DL, TAG_ID.DL],
	[TAG_NAMES.DT, TAG_ID.DT],
	[TAG_NAMES.EM, TAG_ID.EM],
	[TAG_NAMES.EMBED, TAG_ID.EMBED],
	[TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
	[TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
	[TAG_NAMES.FIGURE, TAG_ID.FIGURE],
	[TAG_NAMES.FONT, TAG_ID.FONT],
	[TAG_NAMES.FOOTER, TAG_ID.FOOTER],
	[TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
	[TAG_NAMES.FORM, TAG_ID.FORM],
	[TAG_NAMES.FRAME, TAG_ID.FRAME],
	[TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
	[TAG_NAMES.H1, TAG_ID.H1],
	[TAG_NAMES.H2, TAG_ID.H2],
	[TAG_NAMES.H3, TAG_ID.H3],
	[TAG_NAMES.H4, TAG_ID.H4],
	[TAG_NAMES.H5, TAG_ID.H5],
	[TAG_NAMES.H6, TAG_ID.H6],
	[TAG_NAMES.HEAD, TAG_ID.HEAD],
	[TAG_NAMES.HEADER, TAG_ID.HEADER],
	[TAG_NAMES.HGROUP, TAG_ID.HGROUP],
	[TAG_NAMES.HR, TAG_ID.HR],
	[TAG_NAMES.HTML, TAG_ID.HTML],
	[TAG_NAMES.I, TAG_ID.I],
	[TAG_NAMES.IMG, TAG_ID.IMG],
	[TAG_NAMES.IMAGE, TAG_ID.IMAGE],
	[TAG_NAMES.INPUT, TAG_ID.INPUT],
	[TAG_NAMES.IFRAME, TAG_ID.IFRAME],
	[TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
	[TAG_NAMES.LABEL, TAG_ID.LABEL],
	[TAG_NAMES.LI, TAG_ID.LI],
	[TAG_NAMES.LINK, TAG_ID.LINK],
	[TAG_NAMES.LISTING, TAG_ID.LISTING],
	[TAG_NAMES.MAIN, TAG_ID.MAIN],
	[TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
	[TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
	[TAG_NAMES.MATH, TAG_ID.MATH],
	[TAG_NAMES.MENU, TAG_ID.MENU],
	[TAG_NAMES.META, TAG_ID.META],
	[TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
	[TAG_NAMES.MI, TAG_ID.MI],
	[TAG_NAMES.MO, TAG_ID.MO],
	[TAG_NAMES.MN, TAG_ID.MN],
	[TAG_NAMES.MS, TAG_ID.MS],
	[TAG_NAMES.MTEXT, TAG_ID.MTEXT],
	[TAG_NAMES.NAV, TAG_ID.NAV],
	[TAG_NAMES.NOBR, TAG_ID.NOBR],
	[TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
	[TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
	[TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
	[TAG_NAMES.OBJECT, TAG_ID.OBJECT],
	[TAG_NAMES.OL, TAG_ID.OL],
	[TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
	[TAG_NAMES.OPTION, TAG_ID.OPTION],
	[TAG_NAMES.P, TAG_ID.P],
	[TAG_NAMES.PARAM, TAG_ID.PARAM],
	[TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
	[TAG_NAMES.PRE, TAG_ID.PRE],
	[TAG_NAMES.RB, TAG_ID.RB],
	[TAG_NAMES.RP, TAG_ID.RP],
	[TAG_NAMES.RT, TAG_ID.RT],
	[TAG_NAMES.RTC, TAG_ID.RTC],
	[TAG_NAMES.RUBY, TAG_ID.RUBY],
	[TAG_NAMES.S, TAG_ID.S],
	[TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
	[TAG_NAMES.SEARCH, TAG_ID.SEARCH],
	[TAG_NAMES.SECTION, TAG_ID.SECTION],
	[TAG_NAMES.SELECT, TAG_ID.SELECT],
	[TAG_NAMES.SOURCE, TAG_ID.SOURCE],
	[TAG_NAMES.SMALL, TAG_ID.SMALL],
	[TAG_NAMES.SPAN, TAG_ID.SPAN],
	[TAG_NAMES.STRIKE, TAG_ID.STRIKE],
	[TAG_NAMES.STRONG, TAG_ID.STRONG],
	[TAG_NAMES.STYLE, TAG_ID.STYLE],
	[TAG_NAMES.SUB, TAG_ID.SUB],
	[TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
	[TAG_NAMES.SUP, TAG_ID.SUP],
	[TAG_NAMES.TABLE, TAG_ID.TABLE],
	[TAG_NAMES.TBODY, TAG_ID.TBODY],
	[TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
	[TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
	[TAG_NAMES.TFOOT, TAG_ID.TFOOT],
	[TAG_NAMES.TD, TAG_ID.TD],
	[TAG_NAMES.TH, TAG_ID.TH],
	[TAG_NAMES.THEAD, TAG_ID.THEAD],
	[TAG_NAMES.TITLE, TAG_ID.TITLE],
	[TAG_NAMES.TR, TAG_ID.TR],
	[TAG_NAMES.TRACK, TAG_ID.TRACK],
	[TAG_NAMES.TT, TAG_ID.TT],
	[TAG_NAMES.U, TAG_ID.U],
	[TAG_NAMES.UL, TAG_ID.UL],
	[TAG_NAMES.SVG, TAG_ID.SVG],
	[TAG_NAMES.VAR, TAG_ID.VAR],
	[TAG_NAMES.WBR, TAG_ID.WBR],
	[TAG_NAMES.XMP, TAG_ID.XMP]
]);
function getTagID(tagName) {
	var _a;
	return (_a = TAG_NAME_TO_ID.get(tagName)) !== null && _a !== void 0 ? _a : TAG_ID.UNKNOWN;
}
var $ = TAG_ID;
var SPECIAL_ELEMENTS = {
	[NS.HTML]: /* @__PURE__ */ new Set([
		$.ADDRESS,
		$.APPLET,
		$.AREA,
		$.ARTICLE,
		$.ASIDE,
		$.BASE,
		$.BASEFONT,
		$.BGSOUND,
		$.BLOCKQUOTE,
		$.BODY,
		$.BR,
		$.BUTTON,
		$.CAPTION,
		$.CENTER,
		$.COL,
		$.COLGROUP,
		$.DD,
		$.DETAILS,
		$.DIR,
		$.DIV,
		$.DL,
		$.DT,
		$.EMBED,
		$.FIELDSET,
		$.FIGCAPTION,
		$.FIGURE,
		$.FOOTER,
		$.FORM,
		$.FRAME,
		$.FRAMESET,
		$.H1,
		$.H2,
		$.H3,
		$.H4,
		$.H5,
		$.H6,
		$.HEAD,
		$.HEADER,
		$.HGROUP,
		$.HR,
		$.HTML,
		$.IFRAME,
		$.IMG,
		$.INPUT,
		$.LI,
		$.LINK,
		$.LISTING,
		$.MAIN,
		$.MARQUEE,
		$.MENU,
		$.META,
		$.NAV,
		$.NOEMBED,
		$.NOFRAMES,
		$.NOSCRIPT,
		$.OBJECT,
		$.OL,
		$.P,
		$.PARAM,
		$.PLAINTEXT,
		$.PRE,
		$.SCRIPT,
		$.SECTION,
		$.SELECT,
		$.SOURCE,
		$.STYLE,
		$.SUMMARY,
		$.TABLE,
		$.TBODY,
		$.TD,
		$.TEMPLATE,
		$.TEXTAREA,
		$.TFOOT,
		$.TH,
		$.THEAD,
		$.TITLE,
		$.TR,
		$.TRACK,
		$.UL,
		$.WBR,
		$.XMP
	]),
	[NS.MATHML]: /* @__PURE__ */ new Set([
		$.MI,
		$.MO,
		$.MN,
		$.MS,
		$.MTEXT,
		$.ANNOTATION_XML
	]),
	[NS.SVG]: /* @__PURE__ */ new Set([
		$.TITLE,
		$.FOREIGN_OBJECT,
		$.DESC
	]),
	[NS.XLINK]: /* @__PURE__ */ new Set(),
	[NS.XML]: /* @__PURE__ */ new Set(),
	[NS.XMLNS]: /* @__PURE__ */ new Set()
};
var NUMBERED_HEADERS = /* @__PURE__ */ new Set([
	$.H1,
	$.H2,
	$.H3,
	$.H4,
	$.H5,
	$.H6
]);
TAG_NAMES.STYLE, TAG_NAMES.SCRIPT, TAG_NAMES.XMP, TAG_NAMES.IFRAME, TAG_NAMES.NOEMBED, TAG_NAMES.NOFRAMES, TAG_NAMES.PLAINTEXT;
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tokenizer/index.js
var State;
(function(State) {
	State[State["DATA"] = 0] = "DATA";
	State[State["RCDATA"] = 1] = "RCDATA";
	State[State["RAWTEXT"] = 2] = "RAWTEXT";
	State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
	State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
	State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
	State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
	State[State["TAG_NAME"] = 7] = "TAG_NAME";
	State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
	State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
	State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
	State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
	State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
	State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
	State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
	State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
	State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
	State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
	State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
	State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
	State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
	State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
	State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
	State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
	State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
	State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
	State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
	State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
	State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
	State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
	State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
	State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
	State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
	State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
	State[State["COMMENT_START"] = 42] = "COMMENT_START";
	State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
	State[State["COMMENT"] = 44] = "COMMENT";
	State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
	State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
	State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
	State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
	State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
	State[State["COMMENT_END"] = 50] = "COMMENT_END";
	State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
	State[State["DOCTYPE"] = 52] = "DOCTYPE";
	State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
	State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
	State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
	State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
	State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
	State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
	State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
	State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
	State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
	State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
	State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
	State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
	State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
	State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
	State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
	State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
	State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
	State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
	State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
	State[State["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
var TokenizerMode = {
	DATA: State.DATA,
	RCDATA: State.RCDATA,
	RAWTEXT: State.RAWTEXT,
	SCRIPT_DATA: State.SCRIPT_DATA,
	PLAINTEXT: State.PLAINTEXT,
	CDATA_SECTION: State.CDATA_SECTION
};
function isAsciiDigit(cp) {
	return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
}
function isAsciiUpper(cp) {
	return cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z;
}
function isAsciiLower(cp) {
	return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
}
function isAsciiLetter(cp) {
	return isAsciiLower(cp) || isAsciiUpper(cp);
}
function isAsciiAlphaNumeric(cp) {
	return isAsciiLetter(cp) || isAsciiDigit(cp);
}
function toAsciiLower(cp) {
	return cp + 32;
}
function isWhitespace(cp) {
	return cp === CODE_POINTS.SPACE || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.TABULATION || cp === CODE_POINTS.FORM_FEED;
}
function isScriptDataDoubleEscapeSequenceEnd(cp) {
	return isWhitespace(cp) || cp === CODE_POINTS.SOLIDUS || cp === CODE_POINTS.GREATER_THAN_SIGN;
}
function getErrorForNumericCharacterReference(code) {
	if (code === CODE_POINTS.NULL) return ERR.nullCharacterReference;
	else if (code > 1114111) return ERR.characterReferenceOutsideUnicodeRange;
	else if (isSurrogate(code)) return ERR.surrogateCharacterReference;
	else if (isUndefinedCodePoint(code)) return ERR.noncharacterCharacterReference;
	else if (isControlCodePoint(code) || code === CODE_POINTS.CARRIAGE_RETURN) return ERR.controlCharacterReference;
	return null;
}
var Tokenizer = class {
	constructor(options, handler) {
		this.options = options;
		this.handler = handler;
		this.paused = false;
		/** Ensures that the parsing loop isn't run multiple times at once. */
		this.inLoop = false;
		/**
		* Indicates that the current adjusted node exists, is not an element in the HTML namespace,
		* and that it is not an integration point for either MathML or HTML.
		*
		* @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
		*/
		this.inForeignNode = false;
		this.lastStartTagName = "";
		this.active = false;
		this.state = State.DATA;
		this.returnState = State.DATA;
		this.entityStartPos = 0;
		this.consumedAfterSnapshot = -1;
		this.currentCharacterToken = null;
		this.currentToken = null;
		this.currentAttr = {
			name: "",
			value: ""
		};
		this.preprocessor = new Preprocessor(handler);
		this.currentLocation = this.getCurrentLocation(-1);
		this.entityDecoder = new EntityDecoder(htmlDecodeTree, (cp, consumed) => {
			this.preprocessor.pos = this.entityStartPos + consumed - 1;
			this._flushCodePointConsumedAsCharacterReference(cp);
		}, handler.onParseError ? {
			missingSemicolonAfterCharacterReference: () => {
				this._err(ERR.missingSemicolonAfterCharacterReference, 1);
			},
			absenceOfDigitsInNumericCharacterReference: (consumed) => {
				this._err(ERR.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + consumed);
			},
			validateNumericCharacterReference: (code) => {
				const error = getErrorForNumericCharacterReference(code);
				if (error) this._err(error, 1);
			}
		} : void 0);
	}
	_err(code, cpOffset = 0) {
		var _a, _b;
		(_b = (_a = this.handler).onParseError) === null || _b === void 0 || _b.call(_a, this.preprocessor.getError(code, cpOffset));
	}
	getCurrentLocation(offset) {
		if (!this.options.sourceCodeLocationInfo) return null;
		return {
			startLine: this.preprocessor.line,
			startCol: this.preprocessor.col - offset,
			startOffset: this.preprocessor.offset - offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
	}
	_runParsingLoop() {
		if (this.inLoop) return;
		this.inLoop = true;
		while (this.active && !this.paused) {
			this.consumedAfterSnapshot = 0;
			const cp = this._consume();
			if (!this._ensureHibernation()) this._callState(cp);
		}
		this.inLoop = false;
	}
	pause() {
		this.paused = true;
	}
	resume(writeCallback) {
		if (!this.paused) throw new Error("Parser was already resumed");
		this.paused = false;
		if (this.inLoop) return;
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	write(chunk, isLastChunk, writeCallback) {
		this.active = true;
		this.preprocessor.write(chunk, isLastChunk);
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	insertHtmlAtCurrentPos(chunk) {
		this.active = true;
		this.preprocessor.insertHtmlAtCurrentPos(chunk);
		this._runParsingLoop();
	}
	_ensureHibernation() {
		if (this.preprocessor.endOfChunkHit) {
			this.preprocessor.retreat(this.consumedAfterSnapshot);
			this.consumedAfterSnapshot = 0;
			this.active = false;
			return true;
		}
		return false;
	}
	_consume() {
		this.consumedAfterSnapshot++;
		return this.preprocessor.advance();
	}
	_advanceBy(count) {
		this.consumedAfterSnapshot += count;
		for (let i = 0; i < count; i++) this.preprocessor.advance();
	}
	_consumeSequenceIfMatch(pattern, caseSensitive) {
		if (this.preprocessor.startsWith(pattern, caseSensitive)) {
			this._advanceBy(pattern.length - 1);
			return true;
		}
		return false;
	}
	_createStartTagToken() {
		this.currentToken = {
			type: TokenType.START_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(1)
		};
	}
	_createEndTagToken() {
		this.currentToken = {
			type: TokenType.END_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(2)
		};
	}
	_createCommentToken(offset) {
		this.currentToken = {
			type: TokenType.COMMENT,
			data: "",
			location: this.getCurrentLocation(offset)
		};
	}
	_createDoctypeToken(initialName) {
		this.currentToken = {
			type: TokenType.DOCTYPE,
			name: initialName,
			forceQuirks: false,
			publicId: null,
			systemId: null,
			location: this.currentLocation
		};
	}
	_createCharacterToken(type, chars) {
		this.currentCharacterToken = {
			type,
			chars,
			location: this.currentLocation
		};
	}
	_createAttr(attrNameFirstCh) {
		this.currentAttr = {
			name: attrNameFirstCh,
			value: ""
		};
		this.currentLocation = this.getCurrentLocation(0);
	}
	_leaveAttrName() {
		var _a;
		var _b;
		const token = this.currentToken;
		if (getTokenAttr(token, this.currentAttr.name) === null) {
			token.attrs.push(this.currentAttr);
			if (token.location && this.currentLocation) {
				const attrLocations = (_a = (_b = token.location).attrs) !== null && _a !== void 0 ? _a : _b.attrs = Object.create(null);
				attrLocations[this.currentAttr.name] = this.currentLocation;
				this._leaveAttrValue();
			}
		} else this._err(ERR.duplicateAttribute);
	}
	_leaveAttrValue() {
		if (this.currentLocation) {
			this.currentLocation.endLine = this.preprocessor.line;
			this.currentLocation.endCol = this.preprocessor.col;
			this.currentLocation.endOffset = this.preprocessor.offset;
		}
	}
	prepareToken(ct) {
		this._emitCurrentCharacterToken(ct.location);
		this.currentToken = null;
		if (ct.location) {
			ct.location.endLine = this.preprocessor.line;
			ct.location.endCol = this.preprocessor.col + 1;
			ct.location.endOffset = this.preprocessor.offset + 1;
		}
		this.currentLocation = this.getCurrentLocation(-1);
	}
	emitCurrentTagToken() {
		const ct = this.currentToken;
		this.prepareToken(ct);
		ct.tagID = getTagID(ct.tagName);
		if (ct.type === TokenType.START_TAG) {
			this.lastStartTagName = ct.tagName;
			this.handler.onStartTag(ct);
		} else {
			if (ct.attrs.length > 0) this._err(ERR.endTagWithAttributes);
			if (ct.selfClosing) this._err(ERR.endTagWithTrailingSolidus);
			this.handler.onEndTag(ct);
		}
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentComment(ct) {
		this.prepareToken(ct);
		this.handler.onComment(ct);
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentDoctype(ct) {
		this.prepareToken(ct);
		this.handler.onDoctype(ct);
		this.preprocessor.dropParsedChunk();
	}
	_emitCurrentCharacterToken(nextLocation) {
		if (this.currentCharacterToken) {
			if (nextLocation && this.currentCharacterToken.location) {
				this.currentCharacterToken.location.endLine = nextLocation.startLine;
				this.currentCharacterToken.location.endCol = nextLocation.startCol;
				this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
			}
			switch (this.currentCharacterToken.type) {
				case TokenType.CHARACTER:
					this.handler.onCharacter(this.currentCharacterToken);
					break;
				case TokenType.NULL_CHARACTER:
					this.handler.onNullCharacter(this.currentCharacterToken);
					break;
				case TokenType.WHITESPACE_CHARACTER: this.handler.onWhitespaceCharacter(this.currentCharacterToken);
			}
			this.currentCharacterToken = null;
		}
	}
	_emitEOFToken() {
		const location = this.getCurrentLocation(0);
		if (location) {
			location.endLine = location.startLine;
			location.endCol = location.startCol;
			location.endOffset = location.startOffset;
		}
		this._emitCurrentCharacterToken(location);
		this.handler.onEof({
			type: TokenType.EOF,
			location
		});
		this.active = false;
	}
	_appendCharToCurrentCharacterToken(type, ch) {
		if (this.currentCharacterToken) {
			if (this.currentCharacterToken.type === type) {
				this.currentCharacterToken.chars += ch;
				return;
			} else {
				this.currentLocation = this.getCurrentLocation(0);
				this._emitCurrentCharacterToken(this.currentLocation);
				this.preprocessor.dropParsedChunk();
			}
		}
		this._createCharacterToken(type, ch);
	}
	_emitCodePoint(cp) {
		const type = isWhitespace(cp) ? TokenType.WHITESPACE_CHARACTER : cp === CODE_POINTS.NULL ? TokenType.NULL_CHARACTER : TokenType.CHARACTER;
		this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
	}
	_emitChars(ch) {
		this._appendCharToCurrentCharacterToken(TokenType.CHARACTER, ch);
	}
	_startCharacterReference() {
		this.returnState = this.state;
		this.state = State.CHARACTER_REFERENCE;
		this.entityStartPos = this.preprocessor.pos;
		this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? DecodingMode.Attribute : DecodingMode.Legacy);
	}
	_isCharacterReferenceInAttribute() {
		return this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED;
	}
	_flushCodePointConsumedAsCharacterReference(cp) {
		if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += String.fromCodePoint(cp);
		else this._emitCodePoint(cp);
	}
	_callState(cp) {
		switch (this.state) {
			case State.DATA:
				this._stateData(cp);
				break;
			case State.RCDATA:
				this._stateRcdata(cp);
				break;
			case State.RAWTEXT:
				this._stateRawtext(cp);
				break;
			case State.SCRIPT_DATA:
				this._stateScriptData(cp);
				break;
			case State.PLAINTEXT:
				this._statePlaintext(cp);
				break;
			case State.TAG_OPEN:
				this._stateTagOpen(cp);
				break;
			case State.END_TAG_OPEN:
				this._stateEndTagOpen(cp);
				break;
			case State.TAG_NAME:
				this._stateTagName(cp);
				break;
			case State.RCDATA_LESS_THAN_SIGN:
				this._stateRcdataLessThanSign(cp);
				break;
			case State.RCDATA_END_TAG_OPEN:
				this._stateRcdataEndTagOpen(cp);
				break;
			case State.RCDATA_END_TAG_NAME:
				this._stateRcdataEndTagName(cp);
				break;
			case State.RAWTEXT_LESS_THAN_SIGN:
				this._stateRawtextLessThanSign(cp);
				break;
			case State.RAWTEXT_END_TAG_OPEN:
				this._stateRawtextEndTagOpen(cp);
				break;
			case State.RAWTEXT_END_TAG_NAME:
				this._stateRawtextEndTagName(cp);
				break;
			case State.SCRIPT_DATA_LESS_THAN_SIGN:
				this._stateScriptDataLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_OPEN:
				this._stateScriptDataEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_NAME:
				this._stateScriptDataEndTagName(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START:
				this._stateScriptDataEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START_DASH:
				this._stateScriptDataEscapeStartDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED:
				this._stateScriptDataEscaped(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH:
				this._stateScriptDataEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH_DASH:
				this._stateScriptDataEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
				this._stateScriptDataEscapedEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
				this._stateScriptDataEscapedEndTagName(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_START:
				this._stateScriptDataDoubleEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED:
				this._stateScriptDataDoubleEscaped(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
				this._stateScriptDataDoubleEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
				this._stateScriptDataDoubleEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataDoubleEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_END:
				this._stateScriptDataDoubleEscapeEnd(cp);
				break;
			case State.BEFORE_ATTRIBUTE_NAME:
				this._stateBeforeAttributeName(cp);
				break;
			case State.ATTRIBUTE_NAME:
				this._stateAttributeName(cp);
				break;
			case State.AFTER_ATTRIBUTE_NAME:
				this._stateAfterAttributeName(cp);
				break;
			case State.BEFORE_ATTRIBUTE_VALUE:
				this._stateBeforeAttributeValue(cp);
				break;
			case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
				this._stateAttributeValueDoubleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_SINGLE_QUOTED:
				this._stateAttributeValueSingleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_UNQUOTED:
				this._stateAttributeValueUnquoted(cp);
				break;
			case State.AFTER_ATTRIBUTE_VALUE_QUOTED:
				this._stateAfterAttributeValueQuoted(cp);
				break;
			case State.SELF_CLOSING_START_TAG:
				this._stateSelfClosingStartTag(cp);
				break;
			case State.BOGUS_COMMENT:
				this._stateBogusComment(cp);
				break;
			case State.MARKUP_DECLARATION_OPEN:
				this._stateMarkupDeclarationOpen(cp);
				break;
			case State.COMMENT_START:
				this._stateCommentStart(cp);
				break;
			case State.COMMENT_START_DASH:
				this._stateCommentStartDash(cp);
				break;
			case State.COMMENT:
				this._stateComment(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN:
				this._stateCommentLessThanSign(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG:
				this._stateCommentLessThanSignBang(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH:
				this._stateCommentLessThanSignBangDash(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
				this._stateCommentLessThanSignBangDashDash(cp);
				break;
			case State.COMMENT_END_DASH:
				this._stateCommentEndDash(cp);
				break;
			case State.COMMENT_END:
				this._stateCommentEnd(cp);
				break;
			case State.COMMENT_END_BANG:
				this._stateCommentEndBang(cp);
				break;
			case State.DOCTYPE:
				this._stateDoctype(cp);
				break;
			case State.BEFORE_DOCTYPE_NAME:
				this._stateBeforeDoctypeName(cp);
				break;
			case State.DOCTYPE_NAME:
				this._stateDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_NAME:
				this._stateAfterDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_KEYWORD:
				this._stateAfterDoctypePublicKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateBeforeDoctypePublicIdentifier(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypePublicIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypePublicIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateAfterDoctypePublicIdentifier(cp);
				break;
			case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
				this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_KEYWORD:
				this._stateAfterDoctypeSystemKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateBeforeDoctypeSystemIdentifier(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypeSystemIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypeSystemIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateAfterDoctypeSystemIdentifier(cp);
				break;
			case State.BOGUS_DOCTYPE:
				this._stateBogusDoctype(cp);
				break;
			case State.CDATA_SECTION:
				this._stateCdataSection(cp);
				break;
			case State.CDATA_SECTION_BRACKET:
				this._stateCdataSectionBracket(cp);
				break;
			case State.CDATA_SECTION_END:
				this._stateCdataSectionEnd(cp);
				break;
			case State.CHARACTER_REFERENCE:
				this._stateCharacterReference();
				break;
			case State.AMBIGUOUS_AMPERSAND:
				this._stateAmbiguousAmpersand(cp);
				break;
			default: throw new Error("Unknown state");
		}
	}
	_stateData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.TAG_OPEN;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRcdata(cp) {
		switch (cp) {
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RCDATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRawtext(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RAWTEXT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_statePlaintext(cp) {
		switch (cp) {
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createStartTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.MARKUP_DECLARATION_OPEN;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.END_TAG_OPEN;
				break;
			case CODE_POINTS.QUESTION_MARK:
				this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
				this._createCommentToken(1);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("<");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._emitChars("<");
				this.state = State.DATA;
				this._stateData(cp);
		}
	}
	_stateEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createEndTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingEndTagName);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("</");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._createCommentToken(2);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
		}
	}
	_stateTagName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.tagName += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateRcdataLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RCDATA_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRcdataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RCDATA_END_TAG_NAME;
			this._stateRcdataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	handleSpecialEndTag(_cp) {
		if (!this.preprocessor.startsWith(this.lastStartTagName, false)) return !this._ensureHibernation();
		this._createEndTagToken();
		const token = this.currentToken;
		token.tagName = this.lastStartTagName;
		switch (this.preprocessor.peek(this.lastStartTagName.length)) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				return false;
			case CODE_POINTS.SOLIDUS:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.SELF_CLOSING_START_TAG;
				return false;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._advanceBy(this.lastStartTagName.length);
				this.emitCurrentTagToken();
				this.state = State.DATA;
				return false;
			default: return !this._ensureHibernation();
		}
	}
	_stateRcdataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRawtextLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RAWTEXT_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RAWTEXT_END_TAG_NAME;
			this._stateRawtextEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateScriptDataLessThanSign(cp) {
		switch (cp) {
			case CODE_POINTS.SOLIDUS:
				this.state = State.SCRIPT_DATA_END_TAG_OPEN;
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.SCRIPT_DATA_ESCAPE_START;
				this._emitChars("<!");
				break;
			default:
				this._emitChars("<");
				this.state = State.SCRIPT_DATA;
				this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_END_TAG_NAME;
			this._stateScriptDataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStart(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStartDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
		else if (isAsciiLetter(cp)) {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;
			this._stateScriptDataDoubleEscapeStart(cp);
		} else {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;
			this._stateScriptDataEscapedEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeStart(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;
			this._emitChars("/");
		} else {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeEnd(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateBeforeAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
				this._createAttr("=");
				this.state = State.ATTRIBUTE_NAME;
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this._leaveAttrName();
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._leaveAttrName();
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
				this._err(ERR.unexpectedCharacterInAttributeName);
				this.currentAttr.name += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.name += "�";
				break;
			default: this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateBeforeAttributeValue(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingAttributeValue);
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			default:
				this.state = State.ATTRIBUTE_VALUE_UNQUOTED;
				this._stateAttributeValueUnquoted(cp);
		}
	}
	_stateAttributeValueDoubleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueSingleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueUnquoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
			case CODE_POINTS.EQUALS_SIGN:
			case CODE_POINTS.GRAVE_ACCENT:
				this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
				this.currentAttr.value += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAfterAttributeValueQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this._leaveAttrValue();
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingWhitespaceBetweenAttributes);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateSelfClosingStartTag(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN: {
				const token = this.currentToken;
				token.selfClosing = true;
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			}
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedSolidusInTag);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateBogusComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += "�";
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateMarkupDeclarationOpen(cp) {
		if (this._consumeSequenceIfMatch(SEQUENCES.DASH_DASH, true)) {
			this._createCommentToken(SEQUENCES.DASH_DASH.length + 1);
			this.state = State.COMMENT_START;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.DOCTYPE, false)) {
			this.currentLocation = this.getCurrentLocation(SEQUENCES.DOCTYPE.length + 1);
			this.state = State.DOCTYPE;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.CDATA_START, true)) {
			if (this.inForeignNode) this.state = State.CDATA_SECTION;
			else {
				this._err(ERR.cdataInHtmlContent);
				this._createCommentToken(SEQUENCES.CDATA_START.length + 1);
				this.currentToken.data = "[CDATA[";
				this.state = State.BOGUS_COMMENT;
			}
		} else if (!this._ensureHibernation()) {
			this._err(ERR.incorrectlyOpenedComment);
			this._createCommentToken(2);
			this.state = State.BOGUS_COMMENT;
			this._stateBogusComment(cp);
		}
	}
	_stateCommentStart(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_START_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				const token = this.currentToken;
				this.emitCurrentComment(token);
				break;
			}
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentStartDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				this.state = State.COMMENT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateCommentLessThanSign(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				token.data += "!";
				this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				break;
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBang(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
		else {
			this.state = State.COMMENT;
			this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBangDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
		else {
			this.state = State.COMMENT_END_DASH;
			this._stateCommentEndDash(cp);
		}
	}
	_stateCommentLessThanSignBangDashDash(cp) {
		if (cp !== CODE_POINTS.GREATER_THAN_SIGN && cp !== CODE_POINTS.EOF) this._err(ERR.nestedComment);
		this.state = State.COMMENT_END;
		this._stateCommentEnd(cp);
	}
	_stateCommentEndDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEnd(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.COMMENT_END_BANG;
				break;
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "-";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEndBang(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "--!";
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.incorrectlyClosedComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--!";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateDoctype(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
				break;
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._err(ERR.missingWhitespaceBeforeDoctypeName);
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
		}
	}
	_stateBeforeDoctypeName(cp) {
		if (isAsciiUpper(cp)) {
			this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));
			this.state = State.DOCTYPE_NAME;
		} else switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._createDoctypeToken("�");
				this.state = State.DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.missingDoctypeName);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			}
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._createDoctypeToken(String.fromCodePoint(cp));
				this.state = State.DOCTYPE_NAME;
		}
	}
	_stateDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.AFTER_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.name += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: if (this._consumeSequenceIfMatch(SEQUENCES.PUBLIC, false)) this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
			else if (this._consumeSequenceIfMatch(SEQUENCES.SYSTEM, false)) this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
			else if (!this._ensureHibernation()) {
				this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
			}
		}
	}
	_stateAfterDoctypePublicKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypePublicIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypePublicIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateAfterDoctypeSystemKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypeSystemIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypeSystemIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBogusDoctype(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
		}
	}
	_stateCdataSection(cp) {
		switch (cp) {
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this.state = State.CDATA_SECTION_BRACKET;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInCdata);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateCdataSectionBracket(cp) {
		if (cp === CODE_POINTS.RIGHT_SQUARE_BRACKET) this.state = State.CDATA_SECTION_END;
		else {
			this._emitChars("]");
			this.state = State.CDATA_SECTION;
			this._stateCdataSection(cp);
		}
	}
	_stateCdataSectionEnd(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				break;
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this._emitChars("]");
				break;
			default:
				this._emitChars("]]");
				this.state = State.CDATA_SECTION;
				this._stateCdataSection(cp);
		}
	}
	_stateCharacterReference() {
		let length = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
		if (length < 0) {
			if (this.preprocessor.lastChunkWritten) length = this.entityDecoder.end();
			else {
				this.active = false;
				this.preprocessor.pos = this.preprocessor.html.length - 1;
				this.consumedAfterSnapshot = 0;
				this.preprocessor.endOfChunkHit = true;
				return;
			}
		}
		if (length === 0) {
			this.preprocessor.pos = this.entityStartPos;
			this._flushCodePointConsumedAsCharacterReference(CODE_POINTS.AMPERSAND);
			this.state = !this._isCharacterReferenceInAttribute() && isAsciiAlphaNumeric(this.preprocessor.peek(1)) ? State.AMBIGUOUS_AMPERSAND : this.returnState;
		} else this.state = this.returnState;
	}
	_stateAmbiguousAmpersand(cp) {
		if (isAsciiAlphaNumeric(cp)) this._flushCodePointConsumedAsCharacterReference(cp);
		else {
			if (cp === CODE_POINTS.SEMICOLON) this._err(ERR.unknownNamedCharacterReference);
			this.state = this.returnState;
			this._callState(cp);
		}
	}
};
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/open-element-stack.js
var IMPLICIT_END_TAG_REQUIRED = /* @__PURE__ */ new Set([
	TAG_ID.DD,
	TAG_ID.DT,
	TAG_ID.LI,
	TAG_ID.OPTGROUP,
	TAG_ID.OPTION,
	TAG_ID.P,
	TAG_ID.RB,
	TAG_ID.RP,
	TAG_ID.RT,
	TAG_ID.RTC
]);
var IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = /* @__PURE__ */ new Set([
	...IMPLICIT_END_TAG_REQUIRED,
	TAG_ID.CAPTION,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
var SCOPING_ELEMENTS_HTML = /* @__PURE__ */ new Set([
	TAG_ID.APPLET,
	TAG_ID.CAPTION,
	TAG_ID.HTML,
	TAG_ID.MARQUEE,
	TAG_ID.OBJECT,
	TAG_ID.TABLE,
	TAG_ID.TD,
	TAG_ID.TEMPLATE,
	TAG_ID.TH
]);
var SCOPING_ELEMENTS_HTML_LIST = /* @__PURE__ */ new Set([
	...SCOPING_ELEMENTS_HTML,
	TAG_ID.OL,
	TAG_ID.UL
]);
var SCOPING_ELEMENTS_HTML_BUTTON = /* @__PURE__ */ new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.BUTTON]);
var SCOPING_ELEMENTS_MATHML = /* @__PURE__ */ new Set([
	TAG_ID.ANNOTATION_XML,
	TAG_ID.MI,
	TAG_ID.MN,
	TAG_ID.MO,
	TAG_ID.MS,
	TAG_ID.MTEXT
]);
var SCOPING_ELEMENTS_SVG = /* @__PURE__ */ new Set([
	TAG_ID.DESC,
	TAG_ID.FOREIGN_OBJECT,
	TAG_ID.TITLE
]);
var TABLE_ROW_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TR,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_BODY_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TABLE,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_CELLS = /* @__PURE__ */ new Set([TAG_ID.TD, TAG_ID.TH]);
var OpenElementStack = class {
	get currentTmplContentOrNode() {
		return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
	}
	constructor(document, treeAdapter, handler) {
		this.treeAdapter = treeAdapter;
		this.handler = handler;
		this.items = [];
		this.tagIDs = [];
		this.stackTop = -1;
		this.tmplCount = 0;
		this.currentTagId = TAG_ID.UNKNOWN;
		this.current = document;
	}
	_indexOf(element) {
		return this.items.lastIndexOf(element, this.stackTop);
	}
	_isInTemplate() {
		return this.currentTagId === TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS.HTML;
	}
	_updateCurrentElement() {
		this.current = this.items[this.stackTop];
		this.currentTagId = this.tagIDs[this.stackTop];
	}
	push(element, tagID) {
		this.stackTop++;
		this.items[this.stackTop] = element;
		this.current = element;
		this.tagIDs[this.stackTop] = tagID;
		this.currentTagId = tagID;
		if (this._isInTemplate()) this.tmplCount++;
		this.handler.onItemPush(element, tagID, true);
	}
	pop() {
		const popped = this.current;
		if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount--;
		this.stackTop--;
		this._updateCurrentElement();
		this.handler.onItemPop(popped, true);
	}
	replace(oldElement, newElement) {
		const idx = this._indexOf(oldElement);
		this.items[idx] = newElement;
		if (idx === this.stackTop) this.current = newElement;
	}
	insertAfter(referenceElement, newElement, newElementID) {
		const insertionIdx = this._indexOf(referenceElement) + 1;
		this.items.splice(insertionIdx, 0, newElement);
		this.tagIDs.splice(insertionIdx, 0, newElementID);
		this.stackTop++;
		if (insertionIdx === this.stackTop) this._updateCurrentElement();
		if (this.current && this.currentTagId !== void 0) this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
	}
	popUntilTagNamePopped(tagName) {
		let targetIdx = this.stackTop + 1;
		do
			targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
		while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== NS.HTML);
		this.shortenToLength(Math.max(targetIdx, 0));
	}
	shortenToLength(idx) {
		while (this.stackTop >= idx) {
			const popped = this.current;
			if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount -= 1;
			this.stackTop--;
			this._updateCurrentElement();
			this.handler.onItemPop(popped, this.stackTop < idx);
		}
	}
	popUntilElementPopped(element) {
		const idx = this._indexOf(element);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilPopped(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilNumberedHeaderPopped() {
		this.popUntilPopped(NUMBERED_HEADERS, NS.HTML);
	}
	popUntilTableCellPopped() {
		this.popUntilPopped(TABLE_CELLS, NS.HTML);
	}
	popAllUpToHtmlElement() {
		this.tmplCount = 0;
		this.shortenToLength(1);
	}
	_indexOfTagNames(tagNames, namespace) {
		for (let i = this.stackTop; i >= 0; i--) if (tagNames.has(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) return i;
		return -1;
	}
	clearBackTo(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(idx + 1);
	}
	clearBackToTableContext() {
		this.clearBackTo(TABLE_CONTEXT, NS.HTML);
	}
	clearBackToTableBodyContext() {
		this.clearBackTo(TABLE_BODY_CONTEXT, NS.HTML);
	}
	clearBackToTableRowContext() {
		this.clearBackTo(TABLE_ROW_CONTEXT, NS.HTML);
	}
	remove(element) {
		const idx = this._indexOf(element);
		if (idx >= 0) {
			if (idx === this.stackTop) this.pop();
			else {
				this.items.splice(idx, 1);
				this.tagIDs.splice(idx, 1);
				this.stackTop--;
				this._updateCurrentElement();
				this.handler.onItemPop(element, false);
			}
		}
	}
	tryPeekProperlyNestedBodyElement() {
		return this.stackTop >= 1 && this.tagIDs[1] === TAG_ID.BODY ? this.items[1] : null;
	}
	contains(element) {
		return this._indexOf(element) > -1;
	}
	getCommonAncestor(element) {
		const elementIdx = this._indexOf(element) - 1;
		return elementIdx >= 0 ? this.items[elementIdx] : null;
	}
	isRootHtmlElementCurrent() {
		return this.stackTop === 0 && this.tagIDs[0] === TAG_ID.HTML;
	}
	hasInDynamicScope(tagName, htmlScope) {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS.HTML:
					if (tn === tagName) return true;
					if (htmlScope.has(tn)) return false;
					break;
				case NS.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS.MATHML: if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
			}
		}
		return true;
	}
	hasInScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML);
	}
	hasInListItemScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_LIST);
	}
	hasInButtonScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_BUTTON);
	}
	hasNumberedHeaderInScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS.HTML:
					if (NUMBERED_HEADERS.has(tn)) return true;
					if (SCOPING_ELEMENTS_HTML.has(tn)) return false;
					break;
				case NS.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS.MATHML: if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
			}
		}
		return true;
	}
	hasInTableScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasTableBodyContextInTableScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case TAG_ID.TBODY:
				case TAG_ID.THEAD:
				case TAG_ID.TFOOT: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasInSelectScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.OPTION:
				case TAG_ID.OPTGROUP: break;
				default: return false;
			}
		}
		return true;
	}
	generateImpliedEndTags() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsThoroughly() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsWithExclusion(exclusionId) {
		while (this.currentTagId !== void 0 && this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
};
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/formatting-element-list.js
var NOAH_ARK_CAPACITY = 3;
var EntryType;
(function(EntryType) {
	EntryType[EntryType["Marker"] = 0] = "Marker";
	EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
var MARKER = { type: EntryType.Marker };
var FormattingElementList = class {
	constructor(treeAdapter) {
		this.treeAdapter = treeAdapter;
		this.entries = [];
		this.bookmark = null;
	}
	_getNoahArkConditionCandidates(newElement, neAttrs) {
		const candidates = [];
		const neAttrsLength = neAttrs.length;
		const neTagName = this.treeAdapter.getTagName(newElement);
		const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
		for (let i = 0; i < this.entries.length; i++) {
			const entry = this.entries[i];
			if (entry.type === EntryType.Marker) break;
			const { element } = entry;
			if (this.treeAdapter.getTagName(element) === neTagName && this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
				const elementAttrs = this.treeAdapter.getAttrList(element);
				if (elementAttrs.length === neAttrsLength) candidates.push({
					idx: i,
					attrs: elementAttrs
				});
			}
		}
		return candidates;
	}
	_ensureNoahArkCondition(newElement) {
		if (this.entries.length < NOAH_ARK_CAPACITY) return;
		const neAttrs = this.treeAdapter.getAttrList(newElement);
		const candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
		if (candidates.length < NOAH_ARK_CAPACITY) return;
		const neAttrsMap = new Map(neAttrs.map((neAttr) => [neAttr.name, neAttr.value]));
		let validCandidates = 0;
		for (let i = 0; i < candidates.length; i++) {
			const candidate = candidates[i];
			if (candidate.attrs.every((cAttr) => neAttrsMap.get(cAttr.name) === cAttr.value)) {
				validCandidates += 1;
				if (validCandidates >= NOAH_ARK_CAPACITY) this.entries.splice(candidate.idx, 1);
			}
		}
	}
	insertMarker() {
		this.entries.unshift(MARKER);
	}
	pushElement(element, token) {
		this._ensureNoahArkCondition(element);
		this.entries.unshift({
			type: EntryType.Element,
			element,
			token
		});
	}
	insertElementAfterBookmark(element, token) {
		const bookmarkIdx = this.entries.indexOf(this.bookmark);
		this.entries.splice(bookmarkIdx, 0, {
			type: EntryType.Element,
			element,
			token
		});
	}
	removeEntry(entry) {
		const entryIndex = this.entries.indexOf(entry);
		if (entryIndex !== -1) this.entries.splice(entryIndex, 1);
	}
	/**
	* Clears the list of formatting elements up to the last marker.
	*
	* @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
	*/
	clearToLastMarker() {
		const markerIdx = this.entries.indexOf(MARKER);
		if (markerIdx === -1) this.entries.length = 0;
		else this.entries.splice(0, markerIdx + 1);
	}
	getElementEntryInScopeWithTagName(tagName) {
		const entry = this.entries.find((entry) => entry.type === EntryType.Marker || this.treeAdapter.getTagName(entry.element) === tagName);
		return entry && entry.type === EntryType.Element ? entry : null;
	}
	getElementEntry(element) {
		return this.entries.find((entry) => entry.type === EntryType.Element && entry.element === element);
	}
};
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tree-adapters/default.js
var defaultTreeAdapter = {
	createDocument() {
		return {
			nodeName: "#document",
			mode: DOCUMENT_MODE.NO_QUIRKS,
			childNodes: []
		};
	},
	createDocumentFragment() {
		return {
			nodeName: "#document-fragment",
			childNodes: []
		};
	},
	createElement(tagName, namespaceURI, attrs) {
		return {
			nodeName: tagName,
			tagName,
			attrs,
			namespaceURI,
			childNodes: [],
			parentNode: null
		};
	},
	createCommentNode(data) {
		return {
			nodeName: "#comment",
			data,
			parentNode: null
		};
	},
	createTextNode(value) {
		return {
			nodeName: "#text",
			value,
			parentNode: null
		};
	},
	appendChild(parentNode, newNode) {
		parentNode.childNodes.push(newNode);
		newNode.parentNode = parentNode;
	},
	insertBefore(parentNode, newNode, referenceNode) {
		const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
		parentNode.childNodes.splice(insertionIdx, 0, newNode);
		newNode.parentNode = parentNode;
	},
	setTemplateContent(templateElement, contentElement) {
		templateElement.content = contentElement;
	},
	getTemplateContent(templateElement) {
		return templateElement.content;
	},
	setDocumentType(document, name, publicId, systemId) {
		const doctypeNode = document.childNodes.find((node) => node.nodeName === "#documentType");
		if (doctypeNode) {
			doctypeNode.name = name;
			doctypeNode.publicId = publicId;
			doctypeNode.systemId = systemId;
		} else {
			const node = {
				nodeName: "#documentType",
				name,
				publicId,
				systemId,
				parentNode: null
			};
			defaultTreeAdapter.appendChild(document, node);
		}
	},
	setDocumentMode(document, mode) {
		document.mode = mode;
	},
	getDocumentMode(document) {
		return document.mode;
	},
	detachNode(node) {
		if (node.parentNode) {
			const idx = node.parentNode.childNodes.indexOf(node);
			node.parentNode.childNodes.splice(idx, 1);
			node.parentNode = null;
		}
	},
	insertText(parentNode, text) {
		if (parentNode.childNodes.length > 0) {
			const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
			if (defaultTreeAdapter.isTextNode(prevNode)) {
				prevNode.value += text;
				return;
			}
		}
		defaultTreeAdapter.appendChild(parentNode, defaultTreeAdapter.createTextNode(text));
	},
	insertTextBefore(parentNode, text, referenceNode) {
		const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
		if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) prevNode.value += text;
		else defaultTreeAdapter.insertBefore(parentNode, defaultTreeAdapter.createTextNode(text), referenceNode);
	},
	adoptAttributes(recipient, attrs) {
		const recipientAttrsMap = new Set(recipient.attrs.map((attr) => attr.name));
		for (let j = 0; j < attrs.length; j++) if (!recipientAttrsMap.has(attrs[j].name)) recipient.attrs.push(attrs[j]);
	},
	getFirstChild(node) {
		return node.childNodes[0];
	},
	getChildNodes(node) {
		return node.childNodes;
	},
	getParentNode(node) {
		return node.parentNode;
	},
	getAttrList(element) {
		return element.attrs;
	},
	getTagName(element) {
		return element.tagName;
	},
	getNamespaceURI(element) {
		return element.namespaceURI;
	},
	getTextNodeContent(textNode) {
		return textNode.value;
	},
	getCommentNodeContent(commentNode) {
		return commentNode.data;
	},
	getDocumentTypeNodeName(doctypeNode) {
		return doctypeNode.name;
	},
	getDocumentTypeNodePublicId(doctypeNode) {
		return doctypeNode.publicId;
	},
	getDocumentTypeNodeSystemId(doctypeNode) {
		return doctypeNode.systemId;
	},
	isTextNode(node) {
		return node.nodeName === "#text";
	},
	isCommentNode(node) {
		return node.nodeName === "#comment";
	},
	isDocumentTypeNode(node) {
		return node.nodeName === "#documentType";
	},
	isElementNode(node) {
		return Object.prototype.hasOwnProperty.call(node, "tagName");
	},
	setNodeSourceCodeLocation(node, location) {
		node.sourceCodeLocation = location;
	},
	getNodeSourceCodeLocation(node) {
		return node.sourceCodeLocation;
	},
	updateNodeSourceCodeLocation(node, endLocation) {
		node.sourceCodeLocation = {
			...node.sourceCodeLocation,
			...endLocation
		};
	}
};
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/doctype.js
var VALID_DOCTYPE_NAME = "html";
var VALID_SYSTEM_ID = "about:legacy-compat";
var QUIRKS_MODE_SYSTEM_ID = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd";
var QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
	"+//silmaril//dtd html pro v0r11 19970101//",
	"-//as//dtd html 3.0 aswedit + extensions//",
	"-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
	"-//ietf//dtd html 2.0 level 1//",
	"-//ietf//dtd html 2.0 level 2//",
	"-//ietf//dtd html 2.0 strict level 1//",
	"-//ietf//dtd html 2.0 strict level 2//",
	"-//ietf//dtd html 2.0 strict//",
	"-//ietf//dtd html 2.0//",
	"-//ietf//dtd html 2.1e//",
	"-//ietf//dtd html 3.0//",
	"-//ietf//dtd html 3.2 final//",
	"-//ietf//dtd html 3.2//",
	"-//ietf//dtd html 3//",
	"-//ietf//dtd html level 0//",
	"-//ietf//dtd html level 1//",
	"-//ietf//dtd html level 2//",
	"-//ietf//dtd html level 3//",
	"-//ietf//dtd html strict level 0//",
	"-//ietf//dtd html strict level 1//",
	"-//ietf//dtd html strict level 2//",
	"-//ietf//dtd html strict level 3//",
	"-//ietf//dtd html strict//",
	"-//ietf//dtd html//",
	"-//metrius//dtd metrius presentational//",
	"-//microsoft//dtd internet explorer 2.0 html strict//",
	"-//microsoft//dtd internet explorer 2.0 html//",
	"-//microsoft//dtd internet explorer 2.0 tables//",
	"-//microsoft//dtd internet explorer 3.0 html strict//",
	"-//microsoft//dtd internet explorer 3.0 html//",
	"-//microsoft//dtd internet explorer 3.0 tables//",
	"-//netscape comm. corp.//dtd html//",
	"-//netscape comm. corp.//dtd strict html//",
	"-//o'reilly and associates//dtd html 2.0//",
	"-//o'reilly and associates//dtd html extended 1.0//",
	"-//o'reilly and associates//dtd html extended relaxed 1.0//",
	"-//sq//dtd html 2.0 hotmetal + extensions//",
	"-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
	"-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
	"-//spyglass//dtd html 2.0 extended//",
	"-//sun microsystems corp.//dtd hotjava html//",
	"-//sun microsystems corp.//dtd hotjava strict html//",
	"-//w3c//dtd html 3 1995-03-24//",
	"-//w3c//dtd html 3.2 draft//",
	"-//w3c//dtd html 3.2 final//",
	"-//w3c//dtd html 3.2//",
	"-//w3c//dtd html 3.2s draft//",
	"-//w3c//dtd html 4.0 frameset//",
	"-//w3c//dtd html 4.0 transitional//",
	"-//w3c//dtd html experimental 19960712//",
	"-//w3c//dtd html experimental 970421//",
	"-//w3c//dtd w3 html//",
	"-//w3o//dtd w3 html 3.0//",
	"-//webtechs//dtd mozilla html 2.0//",
	"-//webtechs//dtd mozilla html//"
];
var QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
var QUIRKS_MODE_PUBLIC_IDS = /* @__PURE__ */ new Set([
	"-//w3o//dtd w3 html strict 3.0//en//",
	"-/w3c/dtd html 4.0 transitional/en",
	"html"
]);
var LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"];
var LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
function hasPrefix(publicId, prefixes) {
	return prefixes.some((prefix) => publicId.startsWith(prefix));
}
function isConforming(token) {
	return token.name === VALID_DOCTYPE_NAME && token.publicId === null && (token.systemId === null || token.systemId === VALID_SYSTEM_ID);
}
function getDocumentMode(token) {
	if (token.name !== VALID_DOCTYPE_NAME) return DOCUMENT_MODE.QUIRKS;
	const { systemId } = token;
	if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) return DOCUMENT_MODE.QUIRKS;
	let { publicId } = token;
	if (publicId !== null) {
		publicId = publicId.toLowerCase();
		if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) return DOCUMENT_MODE.QUIRKS;
		let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.QUIRKS;
		prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.LIMITED_QUIRKS;
	}
	return DOCUMENT_MODE.NO_QUIRKS;
}
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/foreign-content.js
var MIME_TYPES = {
	TEXT_HTML: "text/html",
	APPLICATION_XML: "application/xhtml+xml"
};
var DEFINITION_URL_ATTR = "definitionurl";
var ADJUSTED_DEFINITION_URL_ATTR = "definitionURL";
var SVG_ATTRS_ADJUSTMENT_MAP = new Map([
	"attributeName",
	"attributeType",
	"baseFrequency",
	"baseProfile",
	"calcMode",
	"clipPathUnits",
	"diffuseConstant",
	"edgeMode",
	"filterUnits",
	"glyphRef",
	"gradientTransform",
	"gradientUnits",
	"kernelMatrix",
	"kernelUnitLength",
	"keyPoints",
	"keySplines",
	"keyTimes",
	"lengthAdjust",
	"limitingConeAngle",
	"markerHeight",
	"markerUnits",
	"markerWidth",
	"maskContentUnits",
	"maskUnits",
	"numOctaves",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"preserveAlpha",
	"preserveAspectRatio",
	"primitiveUnits",
	"refX",
	"refY",
	"repeatCount",
	"repeatDur",
	"requiredExtensions",
	"requiredFeatures",
	"specularConstant",
	"specularExponent",
	"spreadMethod",
	"startOffset",
	"stdDeviation",
	"stitchTiles",
	"surfaceScale",
	"systemLanguage",
	"tableValues",
	"targetX",
	"targetY",
	"textLength",
	"viewBox",
	"viewTarget",
	"xChannelSelector",
	"yChannelSelector",
	"zoomAndPan"
].map((attr) => [attr.toLowerCase(), attr]));
var XML_ATTRS_ADJUSTMENT_MAP = /* @__PURE__ */ new Map([
	["xlink:actuate", {
		prefix: "xlink",
		name: "actuate",
		namespace: NS.XLINK
	}],
	["xlink:arcrole", {
		prefix: "xlink",
		name: "arcrole",
		namespace: NS.XLINK
	}],
	["xlink:href", {
		prefix: "xlink",
		name: "href",
		namespace: NS.XLINK
	}],
	["xlink:role", {
		prefix: "xlink",
		name: "role",
		namespace: NS.XLINK
	}],
	["xlink:show", {
		prefix: "xlink",
		name: "show",
		namespace: NS.XLINK
	}],
	["xlink:title", {
		prefix: "xlink",
		name: "title",
		namespace: NS.XLINK
	}],
	["xlink:type", {
		prefix: "xlink",
		name: "type",
		namespace: NS.XLINK
	}],
	["xml:lang", {
		prefix: "xml",
		name: "lang",
		namespace: NS.XML
	}],
	["xml:space", {
		prefix: "xml",
		name: "space",
		namespace: NS.XML
	}],
	["xmlns", {
		prefix: "",
		name: "xmlns",
		namespace: NS.XMLNS
	}],
	["xmlns:xlink", {
		prefix: "xmlns",
		name: "xlink",
		namespace: NS.XMLNS
	}]
]);
var SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"textPath"
].map((tn) => [tn.toLowerCase(), tn]));
var EXITS_FOREIGN_CONTENT = /* @__PURE__ */ new Set([
	TAG_ID.B,
	TAG_ID.BIG,
	TAG_ID.BLOCKQUOTE,
	TAG_ID.BODY,
	TAG_ID.BR,
	TAG_ID.CENTER,
	TAG_ID.CODE,
	TAG_ID.DD,
	TAG_ID.DIV,
	TAG_ID.DL,
	TAG_ID.DT,
	TAG_ID.EM,
	TAG_ID.EMBED,
	TAG_ID.H1,
	TAG_ID.H2,
	TAG_ID.H3,
	TAG_ID.H4,
	TAG_ID.H5,
	TAG_ID.H6,
	TAG_ID.HEAD,
	TAG_ID.HR,
	TAG_ID.I,
	TAG_ID.IMG,
	TAG_ID.LI,
	TAG_ID.LISTING,
	TAG_ID.MENU,
	TAG_ID.META,
	TAG_ID.NOBR,
	TAG_ID.OL,
	TAG_ID.P,
	TAG_ID.PRE,
	TAG_ID.RUBY,
	TAG_ID.S,
	TAG_ID.SMALL,
	TAG_ID.SPAN,
	TAG_ID.STRONG,
	TAG_ID.STRIKE,
	TAG_ID.SUB,
	TAG_ID.SUP,
	TAG_ID.TABLE,
	TAG_ID.TT,
	TAG_ID.U,
	TAG_ID.UL,
	TAG_ID.VAR
]);
function causesExit(startTagToken) {
	const tn = startTagToken.tagID;
	return tn === TAG_ID.FONT && startTagToken.attrs.some(({ name }) => name === ATTRS.COLOR || name === ATTRS.SIZE || name === ATTRS.FACE) || EXITS_FOREIGN_CONTENT.has(tn);
}
function adjustTokenMathMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) if (token.attrs[i].name === DEFINITION_URL_ATTR) {
		token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
		break;
	}
}
function adjustTokenSVGAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrName != null) token.attrs[i].name = adjustedAttrName;
	}
}
function adjustTokenXMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrEntry) {
			token.attrs[i].prefix = adjustedAttrEntry.prefix;
			token.attrs[i].name = adjustedAttrEntry.name;
			token.attrs[i].namespace = adjustedAttrEntry.namespace;
		}
	}
}
function adjustTokenSVGTagName(token) {
	const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);
	if (adjustedTagName != null) {
		token.tagName = adjustedTagName;
		token.tagID = getTagID(token.tagName);
	}
}
function isMathMLTextIntegrationPoint(tn, ns) {
	return ns === NS.MATHML && (tn === TAG_ID.MI || tn === TAG_ID.MO || tn === TAG_ID.MN || tn === TAG_ID.MS || tn === TAG_ID.MTEXT);
}
function isHtmlIntegrationPoint(tn, ns, attrs) {
	if (ns === NS.MATHML && tn === TAG_ID.ANNOTATION_XML) {
		for (let i = 0; i < attrs.length; i++) if (attrs[i].name === ATTRS.ENCODING) {
			const value = attrs[i].value.toLowerCase();
			return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
		}
	}
	return ns === NS.SVG && (tn === TAG_ID.FOREIGN_OBJECT || tn === TAG_ID.DESC || tn === TAG_ID.TITLE);
}
function isIntegrationPoint(tn, ns, attrs, foreignNS) {
	return (!foreignNS || foreignNS === NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs) || (!foreignNS || foreignNS === NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns);
}
//#endregion
//#region ../node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/index.js
var HIDDEN_INPUT_TYPE = "hidden";
var AA_OUTER_LOOP_ITER = 8;
var AA_INNER_LOOP_ITER = 3;
var InsertionMode;
(function(InsertionMode) {
	InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
	InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
	InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
	InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
	InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
	InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
	InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
	InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
	InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
	InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
	InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
	InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
	InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
	InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
	InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
	InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
	InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
	InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
	InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
	InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
	InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
	InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
	InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
var BASE_LOC = {
	startLine: -1,
	startCol: -1,
	startOffset: -1,
	endLine: -1,
	endCol: -1,
	endOffset: -1
};
var TABLE_STRUCTURE_TAGS = /* @__PURE__ */ new Set([
	TAG_ID.TABLE,
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
var defaultParserOptions = {
	scriptingEnabled: true,
	sourceCodeLocationInfo: false,
	treeAdapter: defaultTreeAdapter,
	onParseError: null
};
var Parser = class {
	constructor(options, document, fragmentContext = null, scriptHandler = null) {
		this.fragmentContext = fragmentContext;
		this.scriptHandler = scriptHandler;
		this.currentToken = null;
		this.stopped = false;
		/** @internal */
		this.insertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.originalInsertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.headElement = null;
		/** @internal */
		this.formElement = null;
		/** Indicates that the current node is not an element in the HTML namespace */
		this.currentNotInHTML = false;
		/**
		* The template insertion mode stack is maintained from the left.
		* Ie. the topmost element will always have index 0.
		*
		* @internal
		*/
		this.tmplInsertionModeStack = [];
		/** @internal */
		this.pendingCharacterTokens = [];
		/** @internal */
		this.hasNonWhitespacePendingCharacterToken = false;
		/** @internal */
		this.framesetOk = true;
		/** @internal */
		this.skipNextNewLine = false;
		/** @internal */
		this.fosterParentingEnabled = false;
		this.options = {
			...defaultParserOptions,
			...options
		};
		this.treeAdapter = this.options.treeAdapter;
		this.onParseError = this.options.onParseError;
		if (this.onParseError) this.options.sourceCodeLocationInfo = true;
		this.document = document !== null && document !== void 0 ? document : this.treeAdapter.createDocument();
		this.tokenizer = new Tokenizer(this.options, this);
		this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
		this.fragmentContextID = fragmentContext ? getTagID(this.treeAdapter.getTagName(fragmentContext)) : TAG_ID.UNKNOWN;
		this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);
		this.openElements = new OpenElementStack(this.document, this.treeAdapter, this);
	}
	static parse(html, options) {
		const parser = new this(options);
		parser.tokenizer.write(html, true);
		return parser.document;
	}
	static getFragmentParser(fragmentContext, options) {
		const opts = {
			...defaultParserOptions,
			...options
		};
		fragmentContext !== null && fragmentContext !== void 0 || (fragmentContext = opts.treeAdapter.createElement(TAG_NAMES.TEMPLATE, NS.HTML, []));
		const documentMock = opts.treeAdapter.createElement("documentmock", NS.HTML, []);
		const parser = new this(opts, documentMock, fragmentContext);
		if (parser.fragmentContextID === TAG_ID.TEMPLATE) parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
		parser._initTokenizerForFragmentParsing();
		parser._insertFakeRootElement();
		parser._resetInsertionMode();
		parser._findFormInFragmentContext();
		return parser;
	}
	getFragment() {
		const rootElement = this.treeAdapter.getFirstChild(this.document);
		const fragment = this.treeAdapter.createDocumentFragment();
		this._adoptNodes(rootElement, fragment);
		return fragment;
	}
	/** @internal */
	_err(token, code, beforeToken) {
		var _a;
		if (!this.onParseError) return;
		const loc = (_a = token.location) !== null && _a !== void 0 ? _a : BASE_LOC;
		const err = {
			code,
			startLine: loc.startLine,
			startCol: loc.startCol,
			startOffset: loc.startOffset,
			endLine: beforeToken ? loc.startLine : loc.endLine,
			endCol: beforeToken ? loc.startCol : loc.endCol,
			endOffset: beforeToken ? loc.startOffset : loc.endOffset
		};
		this.onParseError(err);
	}
	/** @internal */
	onItemPush(node, tid, isTop) {
		var _a, _b;
		(_b = (_a = this.treeAdapter).onItemPush) === null || _b === void 0 || _b.call(_a, node);
		if (isTop && this.openElements.stackTop > 0) this._setContextModes(node, tid);
	}
	/** @internal */
	onItemPop(node, isTop) {
		var _a, _b;
		if (this.options.sourceCodeLocationInfo) this._setEndLocation(node, this.currentToken);
		(_b = (_a = this.treeAdapter).onItemPop) === null || _b === void 0 || _b.call(_a, node, this.openElements.current);
		if (isTop) {
			let current;
			let currentTagId;
			if (this.openElements.stackTop === 0 && this.fragmentContext) {
				current = this.fragmentContext;
				currentTagId = this.fragmentContextID;
			} else ({current, currentTagId} = this.openElements);
			this._setContextModes(current, currentTagId);
		}
	}
	_setContextModes(current, tid) {
		const isHTML = current === this.document || current && this.treeAdapter.getNamespaceURI(current) === NS.HTML;
		this.currentNotInHTML = !isHTML;
		this.tokenizer.inForeignNode = !isHTML && current !== void 0 && tid !== void 0 && !this._isIntegrationPoint(tid, current);
	}
	/** @protected */
	_switchToTextParsing(currentToken, nextTokenizerState) {
		this._insertElement(currentToken, NS.HTML);
		this.tokenizer.state = nextTokenizerState;
		this.originalInsertionMode = this.insertionMode;
		this.insertionMode = InsertionMode.TEXT;
	}
	switchToPlaintextParsing() {
		this.insertionMode = InsertionMode.TEXT;
		this.originalInsertionMode = InsertionMode.IN_BODY;
		this.tokenizer.state = TokenizerMode.PLAINTEXT;
	}
	/** @protected */
	_getAdjustedCurrentElement() {
		return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
	}
	/** @protected */
	_findFormInFragmentContext() {
		let node = this.fragmentContext;
		while (node) {
			if (this.treeAdapter.getTagName(node) === TAG_NAMES.FORM) {
				this.formElement = node;
				break;
			}
			node = this.treeAdapter.getParentNode(node);
		}
	}
	_initTokenizerForFragmentParsing() {
		if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== NS.HTML) return;
		switch (this.fragmentContextID) {
			case TAG_ID.TITLE:
			case TAG_ID.TEXTAREA:
				this.tokenizer.state = TokenizerMode.RCDATA;
				break;
			case TAG_ID.STYLE:
			case TAG_ID.XMP:
			case TAG_ID.IFRAME:
			case TAG_ID.NOEMBED:
			case TAG_ID.NOFRAMES:
			case TAG_ID.NOSCRIPT:
				this.tokenizer.state = TokenizerMode.RAWTEXT;
				break;
			case TAG_ID.SCRIPT:
				this.tokenizer.state = TokenizerMode.SCRIPT_DATA;
				break;
			case TAG_ID.PLAINTEXT: this.tokenizer.state = TokenizerMode.PLAINTEXT;
		}
	}
	/** @protected */
	_setDocumentType(token) {
		const name = token.name || "";
		const publicId = token.publicId || "";
		const systemId = token.systemId || "";
		this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
		if (token.location) {
			const docTypeNode = this.treeAdapter.getChildNodes(this.document).find((node) => this.treeAdapter.isDocumentTypeNode(node));
			if (docTypeNode) this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
		}
	}
	/** @protected */
	_attachElementToTree(element, location) {
		if (this.options.sourceCodeLocationInfo) {
			const loc = location && {
				...location,
				startTag: location
			};
			this.treeAdapter.setNodeSourceCodeLocation(element, loc);
		}
		if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(element);
		else {
			const parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.appendChild(parent !== null && parent !== void 0 ? parent : this.document, element);
		}
	}
	/**
	* For self-closing tags. Add an element to the tree, but skip adding it
	* to the stack.
	*/
	/** @protected */
	_appendElement(token, namespaceURI) {
		const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element, token.location);
	}
	/** @protected */
	_insertElement(token, namespaceURI) {
		const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element, token.location);
		this.openElements.push(element, token.tagID);
	}
	/** @protected */
	_insertFakeElement(tagName, tagID) {
		const element = this.treeAdapter.createElement(tagName, NS.HTML, []);
		this._attachElementToTree(element, null);
		this.openElements.push(element, tagID);
	}
	/** @protected */
	_insertTemplate(token) {
		const tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
		const content = this.treeAdapter.createDocumentFragment();
		this.treeAdapter.setTemplateContent(tmpl, content);
		this._attachElementToTree(tmpl, token.location);
		this.openElements.push(tmpl, token.tagID);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(content, null);
	}
	/** @protected */
	_insertFakeRootElement() {
		const element = this.treeAdapter.createElement(TAG_NAMES.HTML, NS.HTML, []);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(element, null);
		this.treeAdapter.appendChild(this.openElements.current, element);
		this.openElements.push(element, TAG_ID.HTML);
	}
	/** @protected */
	_appendCommentNode(token, parent) {
		const commentNode = this.treeAdapter.createCommentNode(token.data);
		this.treeAdapter.appendChild(parent, commentNode);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
	}
	/** @protected */
	_insertCharacters(token) {
		let parent;
		let beforeElement;
		if (this._shouldFosterParentOnInsertion()) {
			({parent, beforeElement} = this._findFosterParentingLocation());
			if (beforeElement) this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
			else this.treeAdapter.insertText(parent, token.chars);
		} else {
			parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.insertText(parent, token.chars);
		}
		if (!token.location) return;
		const siblings = this.treeAdapter.getChildNodes(parent);
		const textNode = siblings[(beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length) - 1];
		if (this.treeAdapter.getNodeSourceCodeLocation(textNode)) {
			const { endLine, endCol, endOffset } = token.location;
			this.treeAdapter.updateNodeSourceCodeLocation(textNode, {
				endLine,
				endCol,
				endOffset
			});
		} else if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
	}
	/** @protected */
	_adoptNodes(donor, recipient) {
		for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
			this.treeAdapter.detachNode(child);
			this.treeAdapter.appendChild(recipient, child);
		}
	}
	/** @protected */
	_setEndLocation(element, closingToken) {
		if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
			const ctLoc = closingToken.location;
			const tn = this.treeAdapter.getTagName(element);
			const endLoc = closingToken.type === TokenType.END_TAG && tn === closingToken.tagName ? {
				endTag: { ...ctLoc },
				endLine: ctLoc.endLine,
				endCol: ctLoc.endCol,
				endOffset: ctLoc.endOffset
			} : {
				endLine: ctLoc.startLine,
				endCol: ctLoc.startCol,
				endOffset: ctLoc.startOffset
			};
			this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
		}
	}
	shouldProcessStartTagTokenInForeignContent(token) {
		if (!this.currentNotInHTML) return false;
		let current;
		let currentTagId;
		if (this.openElements.stackTop === 0 && this.fragmentContext) {
			current = this.fragmentContext;
			currentTagId = this.fragmentContextID;
		} else ({current, currentTagId} = this.openElements);
		if (token.tagID === TAG_ID.SVG && this.treeAdapter.getTagName(current) === TAG_NAMES.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(current) === NS.MATHML) return false;
		return this.tokenizer.inForeignNode || (token.tagID === TAG_ID.MGLYPH || token.tagID === TAG_ID.MALIGNMARK) && currentTagId !== void 0 && !this._isIntegrationPoint(currentTagId, current, NS.HTML);
	}
	/** @protected */
	_processToken(token) {
		switch (token.type) {
			case TokenType.CHARACTER:
				this.onCharacter(token);
				break;
			case TokenType.NULL_CHARACTER:
				this.onNullCharacter(token);
				break;
			case TokenType.COMMENT:
				this.onComment(token);
				break;
			case TokenType.DOCTYPE:
				this.onDoctype(token);
				break;
			case TokenType.START_TAG:
				this._processStartTag(token);
				break;
			case TokenType.END_TAG:
				this.onEndTag(token);
				break;
			case TokenType.EOF:
				this.onEof(token);
				break;
			case TokenType.WHITESPACE_CHARACTER: this.onWhitespaceCharacter(token);
		}
	}
	/** @protected */
	_isIntegrationPoint(tid, element, foreignNS) {
		return isIntegrationPoint(tid, this.treeAdapter.getNamespaceURI(element), this.treeAdapter.getAttrList(element), foreignNS);
	}
	/** @protected */
	_reconstructActiveFormattingElements() {
		const listLength = this.activeFormattingElements.entries.length;
		if (listLength) {
			const endIndex = this.activeFormattingElements.entries.findIndex((entry) => entry.type === EntryType.Marker || this.openElements.contains(entry.element));
			const unopenIdx = endIndex === -1 ? listLength - 1 : endIndex - 1;
			for (let i = unopenIdx; i >= 0; i--) {
				const entry = this.activeFormattingElements.entries[i];
				this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
				entry.element = this.openElements.current;
			}
		}
	}
	/** @protected */
	_closeTableCell() {
		this.openElements.generateImpliedEndTags();
		this.openElements.popUntilTableCellPopped();
		this.activeFormattingElements.clearToLastMarker();
		this.insertionMode = InsertionMode.IN_ROW;
	}
	/** @protected */
	_closePElement() {
		this.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.P);
		this.openElements.popUntilTagNamePopped(TAG_ID.P);
	}
	/** @protected */
	_resetInsertionMode() {
		for (let i = this.openElements.stackTop; i >= 0; i--) switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
			case TAG_ID.TR:
				this.insertionMode = InsertionMode.IN_ROW;
				return;
			case TAG_ID.TBODY:
			case TAG_ID.THEAD:
			case TAG_ID.TFOOT:
				this.insertionMode = InsertionMode.IN_TABLE_BODY;
				return;
			case TAG_ID.CAPTION:
				this.insertionMode = InsertionMode.IN_CAPTION;
				return;
			case TAG_ID.COLGROUP:
				this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
				return;
			case TAG_ID.TABLE:
				this.insertionMode = InsertionMode.IN_TABLE;
				return;
			case TAG_ID.BODY:
				this.insertionMode = InsertionMode.IN_BODY;
				return;
			case TAG_ID.FRAMESET:
				this.insertionMode = InsertionMode.IN_FRAMESET;
				return;
			case TAG_ID.SELECT:
				this._resetInsertionModeForSelect(i);
				return;
			case TAG_ID.TEMPLATE:
				this.insertionMode = this.tmplInsertionModeStack[0];
				return;
			case TAG_ID.HTML:
				this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
				return;
			case TAG_ID.TD:
			case TAG_ID.TH:
				if (i > 0) {
					this.insertionMode = InsertionMode.IN_CELL;
					return;
				}
				break;
			case TAG_ID.HEAD: if (i > 0) {
				this.insertionMode = InsertionMode.IN_HEAD;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_BODY;
	}
	/** @protected */
	_resetInsertionModeForSelect(selectIdx) {
		if (selectIdx > 0) for (let i = selectIdx - 1; i > 0; i--) {
			const tn = this.openElements.tagIDs[i];
			if (tn === TAG_ID.TEMPLATE) break;
			else if (tn === TAG_ID.TABLE) {
				this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_SELECT;
	}
	/** @protected */
	_isElementCausesFosterParenting(tn) {
		return TABLE_STRUCTURE_TAGS.has(tn);
	}
	/** @protected */
	_shouldFosterParentOnInsertion() {
		return this.fosterParentingEnabled && this.openElements.currentTagId !== void 0 && this._isElementCausesFosterParenting(this.openElements.currentTagId);
	}
	/** @protected */
	_findFosterParentingLocation() {
		for (let i = this.openElements.stackTop; i >= 0; i--) {
			const openElement = this.openElements.items[i];
			switch (this.openElements.tagIDs[i]) {
				case TAG_ID.TEMPLATE:
					if (this.treeAdapter.getNamespaceURI(openElement) === NS.HTML) return {
						parent: this.treeAdapter.getTemplateContent(openElement),
						beforeElement: null
					};
					break;
				case TAG_ID.TABLE: {
					const parent = this.treeAdapter.getParentNode(openElement);
					if (parent) return {
						parent,
						beforeElement: openElement
					};
					return {
						parent: this.openElements.items[i - 1],
						beforeElement: null
					};
				}
			}
		}
		return {
			parent: this.openElements.items[0],
			beforeElement: null
		};
	}
	/** @protected */
	_fosterParentElement(element) {
		const location = this._findFosterParentingLocation();
		if (location.beforeElement) this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
		else this.treeAdapter.appendChild(location.parent, element);
	}
	/** @protected */
	_isSpecialElement(element, id) {
		return SPECIAL_ELEMENTS[this.treeAdapter.getNamespaceURI(element)].has(id);
	}
	/** @internal */
	onCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			characterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
				characterInBody(this, token);
				break;
			case InsertionMode.TEXT:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				characterInTableText(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onNullCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			nullCharacterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.TEXT:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onComment(token) {
		this.skipNextNewLine = false;
		if (this.currentNotInHTML) {
			appendComment(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
			case InsertionMode.BEFORE_HTML:
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				appendComment(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				appendCommentToRootHtmlElement(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET: appendCommentToDocument(this, token);
		}
	}
	/** @internal */
	onDoctype(token) {
		this.skipNextNewLine = false;
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				doctypeInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
				this._err(token, ERR.misplacedDoctype);
				break;
			case InsertionMode.IN_TABLE_TEXT: tokenInTableText(this, token);
		}
	}
	/** @internal */
	onStartTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		this._processStartTag(token);
		if (token.selfClosing && !token.ackSelfClosing) this._err(token, ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
	}
	/**
	* Processes a given start tag.
	*
	* `onStartTag` checks if a self-closing tag was recognized. When a token
	* is moved inbetween multiple insertion modes, this check for self-closing
	* could lead to false positives. To avoid this, `_processStartTag` is used
	* for nested calls.
	*
	* @param token The token to process.
	* @protected
	*/
	_processStartTag(token) {
		if (this.shouldProcessStartTagTokenInForeignContent(token)) startTagInForeignContent(this, token);
		else this._startTagOutsideForeignContent(token);
	}
	/** @protected */
	_startTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				startTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				startTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				startTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				startTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				startTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				startTagInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
				startTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				startTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				startTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				startTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				startTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				startTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				startTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				startTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				startTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				startTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				startTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				startTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				startTagAfterAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_FRAMESET: startTagAfterAfterFrameset(this, token);
		}
	}
	/** @internal */
	onEndTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		if (this.currentNotInHTML) endTagInForeignContent(this, token);
		else this._endTagOutsideForeignContent(token);
	}
	/** @protected */
	_endTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				endTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				endTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				endTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				endTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				endTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				endTagInBody(this, token);
				break;
			case InsertionMode.TEXT:
				endTagInText(this, token);
				break;
			case InsertionMode.IN_TABLE:
				endTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				endTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				endTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				endTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				endTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				endTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				endTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				endTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				endTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				endTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				endTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				endTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onEof(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				eofInBody(this, token);
				break;
			case InsertionMode.TEXT:
				eofInText(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				eofInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET: stopParsing(this, token);
		}
	}
	/** @internal */
	onWhitespaceCharacter(token) {
		if (this.skipNextNewLine) {
			this.skipNextNewLine = false;
			if (token.chars.charCodeAt(0) === CODE_POINTS.LINE_FEED) {
				if (token.chars.length === 1) return;
				token.chars = token.chars.substr(1);
			}
		}
		if (this.tokenizer.inForeignNode) {
			this._insertCharacters(token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.TEXT:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.AFTER_BODY:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET:
				whitespaceCharacterInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT: whitespaceCharacterInTableText(this, token);
		}
	}
};
function aaObtainFormattingElementEntry(p, token) {
	let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
	if (formattingElementEntry) {
		if (!p.openElements.contains(formattingElementEntry.element)) {
			p.activeFormattingElements.removeEntry(formattingElementEntry);
			formattingElementEntry = null;
		} else if (!p.openElements.hasInScope(token.tagID)) formattingElementEntry = null;
	} else genericEndTagInBody(p, token);
	return formattingElementEntry;
}
function aaObtainFurthestBlock(p, formattingElementEntry) {
	let furthestBlock = null;
	let idx = p.openElements.stackTop;
	for (; idx >= 0; idx--) {
		const element = p.openElements.items[idx];
		if (element === formattingElementEntry.element) break;
		if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) furthestBlock = element;
	}
	if (!furthestBlock) {
		p.openElements.shortenToLength(Math.max(idx, 0));
		p.activeFormattingElements.removeEntry(formattingElementEntry);
	}
	return furthestBlock;
}
function aaInnerLoop(p, furthestBlock, formattingElement) {
	let lastElement = furthestBlock;
	let nextElement = p.openElements.getCommonAncestor(furthestBlock);
	for (let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
		nextElement = p.openElements.getCommonAncestor(element);
		const elementEntry = p.activeFormattingElements.getElementEntry(element);
		const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
		if (!elementEntry || counterOverflow) {
			if (counterOverflow) p.activeFormattingElements.removeEntry(elementEntry);
			p.openElements.remove(element);
		} else {
			element = aaRecreateElementFromEntry(p, elementEntry);
			if (lastElement === furthestBlock) p.activeFormattingElements.bookmark = elementEntry;
			p.treeAdapter.detachNode(lastElement);
			p.treeAdapter.appendChild(element, lastElement);
			lastElement = element;
		}
	}
	return lastElement;
}
function aaRecreateElementFromEntry(p, elementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
	const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
	p.openElements.replace(elementEntry.element, newElement);
	elementEntry.element = newElement;
	return newElement;
}
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
	const tid = getTagID(p.treeAdapter.getTagName(commonAncestor));
	if (p._isElementCausesFosterParenting(tid)) p._fosterParentElement(lastElement);
	else {
		const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
		if (tid === TAG_ID.TEMPLATE && ns === NS.HTML) commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
		p.treeAdapter.appendChild(commonAncestor, lastElement);
	}
}
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
	const { token } = formattingElementEntry;
	const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
	p._adoptNodes(furthestBlock, newElement);
	p.treeAdapter.appendChild(furthestBlock, newElement);
	p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
	p.activeFormattingElements.removeEntry(formattingElementEntry);
	p.openElements.remove(formattingElementEntry.element);
	p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
function callAdoptionAgency(p, token) {
	for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
		const formattingElementEntry = aaObtainFormattingElementEntry(p, token);
		if (!formattingElementEntry) break;
		const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
		if (!furthestBlock) break;
		p.activeFormattingElements.bookmark = formattingElementEntry;
		const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
		const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
		p.treeAdapter.detachNode(lastElement);
		if (commonAncestor) aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
		aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
	}
}
function appendComment(p, token) {
	p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
	p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
	p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
	p.stopped = true;
	if (token.location) {
		const target = p.fragmentContext ? 0 : 2;
		for (let i = p.openElements.stackTop; i >= target; i--) p._setEndLocation(p.openElements.items[i], token);
		if (!p.fragmentContext && p.openElements.stackTop >= 0) {
			const htmlElement = p.openElements.items[0];
			const htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
			if (htmlLocation && !htmlLocation.endTag) {
				p._setEndLocation(htmlElement, token);
				if (p.openElements.stackTop >= 1) {
					const bodyElement = p.openElements.items[1];
					const bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
					if (bodyLocation && !bodyLocation.endTag) p._setEndLocation(bodyElement, token);
				}
			}
		}
	}
}
function doctypeInInitialMode(p, token) {
	p._setDocumentType(token);
	const mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : getDocumentMode(token);
	if (!isConforming(token)) p._err(token, ERR.nonConformingDoctype);
	p.treeAdapter.setDocumentMode(p.document, mode);
	p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
	p._err(token, ERR.missingDoctype, true);
	p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
	p.insertionMode = InsertionMode.BEFORE_HTML;
	p._processToken(token);
}
function startTagBeforeHtml(p, token) {
	if (token.tagID === TAG_ID.HTML) {
		p._insertElement(token, NS.HTML);
		p.insertionMode = InsertionMode.BEFORE_HEAD;
	} else tokenBeforeHtml(p, token);
}
function endTagBeforeHtml(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HTML || tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.BR) tokenBeforeHtml(p, token);
}
function tokenBeforeHtml(p, token) {
	p._insertFakeRootElement();
	p.insertionMode = InsertionMode.BEFORE_HEAD;
	p._processToken(token);
}
function startTagBeforeHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.HEAD:
			p._insertElement(token, NS.HTML);
			p.headElement = p.openElements.current;
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		default: tokenBeforeHead(p, token);
	}
}
function endTagBeforeHead(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.HTML || tn === TAG_ID.BR) tokenBeforeHead(p, token);
	else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenBeforeHead(p, token) {
	p._insertFakeElement(TAG_NAMES.HEAD, TAG_ID.HEAD);
	p.headElement = p.openElements.current;
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TITLE:
			p._switchToTextParsing(token, TokenizerMode.RCDATA);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			else {
				p._insertElement(token, NS.HTML);
				p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
			}
			break;
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			break;
		case TAG_ID.SCRIPT:
			p._switchToTextParsing(token, TokenizerMode.SCRIPT_DATA);
			break;
		case TAG_ID.TEMPLATE:
			p._insertTemplate(token);
			p.activeFormattingElements.insertMarker();
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_TEMPLATE;
			p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenInHead(p, token);
	}
}
function endTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HEAD:
			p.openElements.pop();
			p.insertionMode = InsertionMode.AFTER_HEAD;
			break;
		case TAG_ID.BODY:
		case TAG_ID.BR:
		case TAG_ID.HTML:
			tokenInHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function templateEndTagInHead(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.generateImpliedEndTagsThoroughly();
		if (p.openElements.currentTagId !== TAG_ID.TEMPLATE) p._err(token, ERR.closingOfElementWithOpenChildElements);
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
	} else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenInHead(p, token) {
	p.openElements.pop();
	p.insertionMode = InsertionMode.AFTER_HEAD;
	p._processToken(token);
}
function startTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.HEAD:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			p._err(token, ERR.nestedNoscriptInHead);
			break;
		default: tokenInHeadNoScript(p, token);
	}
}
function endTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.NOSCRIPT:
			p.openElements.pop();
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		case TAG_ID.BR:
			tokenInHeadNoScript(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenInHeadNoScript(p, token) {
	const errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
	p._err(token, errCode);
	p.openElements.pop();
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BODY:
			p._insertElement(token, NS.HTML);
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_BODY;
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_FRAMESET;
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			p._err(token, ERR.abandonedHeadElementChild);
			p.openElements.push(p.headElement, TAG_ID.HEAD);
			startTagInHead(p, token);
			p.openElements.remove(p.headElement);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenAfterHead(p, token);
	}
}
function endTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.BODY:
		case TAG_ID.HTML:
		case TAG_ID.BR:
			tokenAfterHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenAfterHead(p, token) {
	p._insertFakeElement(TAG_NAMES.BODY, TAG_ID.BODY);
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function modeInBody(p, token) {
	switch (token.type) {
		case TokenType.CHARACTER:
			characterInBody(p, token);
			break;
		case TokenType.WHITESPACE_CHARACTER:
			whitespaceCharacterInBody(p, token);
			break;
		case TokenType.COMMENT:
			appendComment(p, token);
			break;
		case TokenType.START_TAG:
			startTagInBody(p, token);
			break;
		case TokenType.END_TAG:
			endTagInBody(p, token);
			break;
		case TokenType.EOF: eofInBody(p, token);
	}
}
function whitespaceCharacterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
}
function characterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
	p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
	if (p.openElements.tmplCount === 0) p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
}
function bodyStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (bodyElement && p.openElements.tmplCount === 0) {
		p.framesetOk = false;
		p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
	}
}
function framesetStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (p.framesetOk && bodyElement) {
		p.treeAdapter.detachNode(bodyElement);
		p.openElements.popAllUpToHtmlElement();
		p._insertElement(token, NS.HTML);
		p.insertionMode = InsertionMode.IN_FRAMESET;
	}
}
function addressStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	if (p.openElements.currentTagId !== void 0 && NUMBERED_HEADERS.has(p.openElements.currentTagId)) p.openElements.pop();
	p._insertElement(token, NS.HTML);
}
function preStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.skipNextNewLine = true;
	p.framesetOk = false;
}
function formStartTagInBody(p, token) {
	const inTemplate = p.openElements.tmplCount > 0;
	if (!p.formElement || inTemplate) {
		if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
		p._insertElement(token, NS.HTML);
		if (!inTemplate) p.formElement = p.openElements.current;
	}
}
function listItemStartTagInBody(p, token) {
	p.framesetOk = false;
	const tn = token.tagID;
	for (let i = p.openElements.stackTop; i >= 0; i--) {
		const elementId = p.openElements.tagIDs[i];
		if (tn === TAG_ID.LI && elementId === TAG_ID.LI || (tn === TAG_ID.DD || tn === TAG_ID.DT) && (elementId === TAG_ID.DD || elementId === TAG_ID.DT)) {
			p.openElements.generateImpliedEndTagsWithExclusion(elementId);
			p.openElements.popUntilTagNamePopped(elementId);
			break;
		}
		if (elementId !== TAG_ID.ADDRESS && elementId !== TAG_ID.DIV && elementId !== TAG_ID.P && p._isSpecialElement(p.openElements.items[i], elementId)) break;
	}
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
}
function plaintextStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BUTTON)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(TAG_ID.BUTTON);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
}
function aStartTagInBody(p, token) {
	const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TAG_NAMES.A);
	if (activeElementEntry) {
		callAdoptionAgency(p, token);
		p.openElements.remove(activeElementEntry.element);
		p.activeFormattingElements.removeEntry(activeElementEntry);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	if (p.openElements.hasInScope(TAG_ID.NOBR)) {
		callAdoptionAgency(p, token);
		p._reconstructActiveFormattingElements();
	}
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.insertMarker();
	p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
	if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
	p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function isHiddenInput(token) {
	const inputType = getTokenAttr(token, ATTRS.TYPE);
	return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS.HTML);
	if (!isHiddenInput(token)) p.framesetOk = false;
	token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
	p._appendElement(token, NS.HTML);
	token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._appendElement(token, NS.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
	token.tagName = TAG_NAMES.IMG;
	token.tagID = TAG_ID.IMG;
	areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
	p._insertElement(token, NS.HTML);
	p.skipNextNewLine = true;
	p.tokenizer.state = TokenizerMode.RCDATA;
	p.originalInsertionMode = p.insertionMode;
	p.framesetOk = false;
	p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._reconstructActiveFormattingElements();
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function rawTextStartTagInBody(p, token) {
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
	p.insertionMode = p.insertionMode === InsertionMode.IN_TABLE || p.insertionMode === InsertionMode.IN_CAPTION || p.insertionMode === InsertionMode.IN_TABLE_BODY || p.insertionMode === InsertionMode.IN_ROW || p.insertionMode === InsertionMode.IN_CELL ? InsertionMode.IN_SELECT_IN_TABLE : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
	if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
}
function rbStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTags();
	p._insertElement(token, NS.HTML);
}
function rtStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.RTC);
	p._insertElement(token, NS.HTML);
}
function mathStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenMathMLAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS.MATHML);
	else p._insertElement(token, NS.MATHML);
	token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenSVGAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS.SVG);
	else p._insertElement(token, NS.SVG);
	token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
}
function startTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.B:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			bStartTagInBody(p, token);
			break;
		case TAG_ID.A:
			aStartTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderStartTagInBody(p, token);
			break;
		case TAG_ID.P:
		case TAG_ID.DL:
		case TAG_ID.OL:
		case TAG_ID.UL:
		case TAG_ID.DIV:
		case TAG_ID.DIR:
		case TAG_ID.NAV:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.DETAILS:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressStartTagInBody(p, token);
			break;
		case TAG_ID.LI:
		case TAG_ID.DD:
		case TAG_ID.DT:
			listItemStartTagInBody(p, token);
			break;
		case TAG_ID.BR:
		case TAG_ID.IMG:
		case TAG_ID.WBR:
		case TAG_ID.AREA:
		case TAG_ID.EMBED:
		case TAG_ID.KEYGEN:
			areaStartTagInBody(p, token);
			break;
		case TAG_ID.HR:
			hrStartTagInBody(p, token);
			break;
		case TAG_ID.RB:
		case TAG_ID.RTC:
			rbStartTagInBody(p, token);
			break;
		case TAG_ID.RT:
		case TAG_ID.RP:
			rtStartTagInBody(p, token);
			break;
		case TAG_ID.PRE:
		case TAG_ID.LISTING:
			preStartTagInBody(p, token);
			break;
		case TAG_ID.XMP:
			xmpStartTagInBody(p, token);
			break;
		case TAG_ID.SVG:
			svgStartTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlStartTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.STYLE:
		case TAG_ID.TITLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.BGSOUND:
		case TAG_ID.BASEFONT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.BODY:
			bodyStartTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInBody(p, token);
			break;
		case TAG_ID.NOBR:
			nobrStartTagInBody(p, token);
			break;
		case TAG_ID.MATH:
			mathStartTagInBody(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInBody(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInBody(p, token);
			break;
		case TAG_ID.PARAM:
		case TAG_ID.TRACK:
		case TAG_ID.SOURCE:
			paramStartTagInBody(p, token);
			break;
		case TAG_ID.IMAGE:
			imageStartTagInBody(p, token);
			break;
		case TAG_ID.BUTTON:
			buttonStartTagInBody(p, token);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletStartTagInBody(p, token);
			break;
		case TAG_ID.IFRAME:
			iframeStartTagInBody(p, token);
			break;
		case TAG_ID.SELECT:
			selectStartTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
		case TAG_ID.OPTGROUP:
			optgroupStartTagInBody(p, token);
			break;
		case TAG_ID.NOEMBED:
		case TAG_ID.NOFRAMES:
			rawTextStartTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			framesetStartTagInBody(p, token);
			break;
		case TAG_ID.TEXTAREA:
			textareaStartTagInBody(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) rawTextStartTagInBody(p, token);
			else genericStartTagInBody(p, token);
			break;
		case TAG_ID.PLAINTEXT:
			plaintextStartTagInBody(p, token);
			break;
		case TAG_ID.COL:
		case TAG_ID.TH:
		case TAG_ID.TD:
		case TAG_ID.TR:
		case TAG_ID.HEAD:
		case TAG_ID.FRAME:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP: break;
		default: genericStartTagInBody(p, token);
	}
}
function bodyEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		if (p.options.sourceCodeLocationInfo) {
			const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
			if (bodyElement) p._setEndLocation(bodyElement, token);
		}
	}
}
function htmlEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		endTagAfterBody(p, token);
	}
}
function addressEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function formEndTagInBody(p) {
	const inTemplate = p.openElements.tmplCount > 0;
	const { formElement } = p;
	if (!inTemplate) p.formElement = null;
	if ((formElement || inTemplate) && p.openElements.hasInScope(TAG_ID.FORM)) {
		p.openElements.generateImpliedEndTags();
		if (inTemplate) p.openElements.popUntilTagNamePopped(TAG_ID.FORM);
		else if (formElement) p.openElements.remove(formElement);
	}
}
function pEndTagInBody(p) {
	if (!p.openElements.hasInButtonScope(TAG_ID.P)) p._insertFakeElement(TAG_NAMES.P, TAG_ID.P);
	p._closePElement();
}
function liEndTagInBody(p) {
	if (p.openElements.hasInListItemScope(TAG_ID.LI)) {
		p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.LI);
		p.openElements.popUntilTagNamePopped(TAG_ID.LI);
	}
}
function ddEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTagsWithExclusion(tn);
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function numberedHeaderEndTagInBody(p) {
	if (p.openElements.hasNumberedHeaderInScope()) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilNumberedHeaderPopped();
	}
}
function appletEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
		p.activeFormattingElements.clearToLastMarker();
	}
}
function brEndTagInBody(p) {
	p._reconstructActiveFormattingElements();
	p._insertFakeElement(TAG_NAMES.BR, TAG_ID.BR);
	p.openElements.pop();
	p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
	const tn = token.tagName;
	const tid = token.tagID;
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element = p.openElements.items[i];
		const elementId = p.openElements.tagIDs[i];
		if (tid === elementId && (tid !== TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
			p.openElements.generateImpliedEndTagsWithExclusion(tid);
			if (p.openElements.stackTop >= i) p.openElements.shortenToLength(i);
			break;
		}
		if (p._isSpecialElement(element, elementId)) break;
	}
}
function endTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.A:
		case TAG_ID.B:
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.NOBR:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			callAdoptionAgency(p, token);
			break;
		case TAG_ID.P:
			pEndTagInBody(p);
			break;
		case TAG_ID.DL:
		case TAG_ID.UL:
		case TAG_ID.OL:
		case TAG_ID.DIR:
		case TAG_ID.DIV:
		case TAG_ID.NAV:
		case TAG_ID.PRE:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.BUTTON:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.DETAILS:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.LISTING:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressEndTagInBody(p, token);
			break;
		case TAG_ID.LI:
			liEndTagInBody(p);
			break;
		case TAG_ID.DD:
		case TAG_ID.DT:
			ddEndTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderEndTagInBody(p);
			break;
		case TAG_ID.BR:
			brEndTagInBody(p);
			break;
		case TAG_ID.BODY:
			bodyEndTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlEndTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formEndTagInBody(p);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletEndTagInBody(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: genericEndTagInBody(p, token);
	}
}
function eofInBody(p, token) {
	if (p.tmplInsertionModeStack.length > 0) eofInTemplate(p, token);
	else stopParsing(p, token);
}
function endTagInText(p, token) {
	var _a;
	if (token.tagID === TAG_ID.SCRIPT) (_a = p.scriptHandler) === null || _a === void 0 || _a.call(p, p.openElements.current);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
	p._err(token, ERR.eofInElementThatCanContainOnlyText);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
	p.onEof(token);
}
function characterInTable(p, token) {
	if (p.openElements.currentTagId !== void 0 && TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
		p.pendingCharacterTokens.length = 0;
		p.hasNonWhitespacePendingCharacterToken = false;
		p.originalInsertionMode = p.insertionMode;
		p.insertionMode = InsertionMode.IN_TABLE_TEXT;
		switch (token.type) {
			case TokenType.CHARACTER:
				characterInTableText(p, token);
				break;
			case TokenType.WHITESPACE_CHARACTER: whitespaceCharacterInTableText(p, token);
		}
	} else tokenInTable(p, token);
}
function captionStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p.activeFormattingElements.insertMarker();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.COLGROUP, TAG_ID.COLGROUP);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
	startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.TBODY, TAG_ID.TBODY);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
	startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
	if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
		p._resetInsertionMode();
		p._processStartTag(token);
	}
}
function inputStartTagInTable(p, token) {
	if (isHiddenInput(token)) p._appendElement(token, NS.HTML);
	else tokenInTable(p, token);
	token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
	if (!p.formElement && p.openElements.tmplCount === 0) {
		p._insertElement(token, NS.HTML);
		p.formElement = p.openElements.current;
		p.openElements.pop();
	}
}
function startTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR:
			tdStartTagInTable(p, token);
			break;
		case TAG_ID.STYLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.COL:
			colStartTagInTable(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInTable(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInTable(p, token);
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			tbodyStartTagInTable(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInTable(p, token);
			break;
		case TAG_ID.CAPTION:
			captionStartTagInTable(p, token);
			break;
		case TAG_ID.COLGROUP:
			colgroupStartTagInTable(p, token);
			break;
		default: tokenInTable(p, token);
	}
}
function endTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: tokenInTable(p, token);
	}
}
function tokenInTable(p, token) {
	const savedFosterParentingState = p.fosterParentingEnabled;
	p.fosterParentingEnabled = true;
	modeInBody(p, token);
	p.fosterParentingEnabled = savedFosterParentingState;
}
function whitespaceCharacterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
	p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
	let i = 0;
	if (p.hasNonWhitespacePendingCharacterToken) for (; i < p.pendingCharacterTokens.length; i++) tokenInTable(p, p.pendingCharacterTokens[i]);
	else for (; i < p.pendingCharacterTokens.length; i++) p._insertCharacters(p.pendingCharacterTokens[i]);
	p.insertionMode = p.originalInsertionMode;
	p._processToken(token);
}
var TABLE_VOID_ELEMENTS = /* @__PURE__ */ new Set([
	TAG_ID.CAPTION,
	TAG_ID.COL,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
function startTagInCaption(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
			p.openElements.generateImpliedEndTags();
			p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
			p.activeFormattingElements.clearToLastMarker();
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCaption(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.CAPTION:
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_TABLE;
				if (tn === TAG_ID.TABLE) endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: endTagInBody(p, token);
	}
}
function startTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.COL:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		default: tokenInColumnGroup(p, token);
	}
}
function endTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.COLGROUP:
			if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.COL: break;
		default: tokenInColumnGroup(p, token);
	}
}
function tokenInColumnGroup(p, token) {
	if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
		p.openElements.pop();
		p.insertionMode = InsertionMode.IN_TABLE;
		p._processToken(token);
	}
}
function startTagInTableBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			p.openElements.clearBackToTableBodyContext();
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_ROW;
			break;
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableBodyContext();
			p._insertFakeElement(TAG_NAMES.TR, TAG_ID.TR);
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				startTagInTable(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInTableBody(p, token) {
	const tn = token.tagID;
	switch (token.tagID) {
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR: break;
		default: endTagInTable(p, token);
	}
}
function startTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableRowContext();
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_CELL;
			p.activeFormattingElements.insertMarker();
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				startTagInTableBody(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH: break;
		default: endTagInTable(p, token);
	}
}
function startTagInCell(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.TD) || p.openElements.hasInTableScope(TAG_ID.TH)) {
			p._closeTableCell();
			startTagInRow(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCell(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.TD:
		case TAG_ID.TH:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(tn);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_ROW;
			}
			break;
		case TAG_ID.TABLE:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(tn)) {
				p._closeTableCell();
				endTagInRow(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML: break;
		default: endTagInBody(p, token);
	}
}
function startTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.OPTGROUP:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.HR:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.INPUT:
		case TAG_ID.KEYGEN:
		case TAG_ID.TEXTAREA:
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
				if (token.tagID !== TAG_ID.SELECT) p._processStartTag(token);
			}
			break;
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE: startTagInHead(p, token);
	}
}
function endTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.OPTGROUP:
			if (p.openElements.stackTop > 0 && p.openElements.currentTagId === TAG_ID.OPTION && p.openElements.tagIDs[p.openElements.stackTop - 1] === TAG_ID.OPTGROUP) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			break;
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE: templateEndTagInHead(p, token);
	}
}
function startTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
		p._resetInsertionMode();
		p._processStartTag(token);
	} else startTagInSelect(p, token);
}
function endTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		if (p.openElements.hasInTableScope(tn)) {
			p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
			p._resetInsertionMode();
			p.onEndTag(token);
		}
	} else endTagInSelect(p, token);
}
function startTagInTemplate(p, token) {
	switch (token.tagID) {
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
			break;
		case TAG_ID.COL:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
			p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
			startTagInColumnGroup(p, token);
			break;
		case TAG_ID.TR:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
			p.insertionMode = InsertionMode.IN_TABLE_BODY;
			startTagInTableBody(p, token);
			break;
		case TAG_ID.TD:
		case TAG_ID.TH:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		default:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
			p.insertionMode = InsertionMode.IN_BODY;
			startTagInBody(p, token);
	}
}
function endTagInTemplate(p, token) {
	if (token.tagID === TAG_ID.TEMPLATE) templateEndTagInHead(p, token);
}
function eofInTemplate(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
		p.onEof(token);
	} else stopParsing(p, token);
}
function startTagAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterBody(p, token);
}
function endTagAfterBody(p, token) {
	var _a;
	if (token.tagID === TAG_ID.HTML) {
		if (!p.fragmentContext) p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
		if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === TAG_ID.HTML) {
			p._setEndLocation(p.openElements.items[0], token);
			const bodyElement = p.openElements.items[1];
			if (bodyElement && !((_a = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a === void 0 ? void 0 : _a.endTag)) p._setEndLocation(bodyElement, token);
		}
	} else tokenAfterBody(p, token);
}
function tokenAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagInFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.FRAME:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function endTagInFrameset(p, token) {
	if (token.tagID === TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
		p.openElements.pop();
		if (!p.fragmentContext && p.openElements.currentTagId !== TAG_ID.FRAMESET) p.insertionMode = InsertionMode.AFTER_FRAMESET;
	}
}
function startTagAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function endTagAfterFrameset(p, token) {
	if (token.tagID === TAG_ID.HTML) p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
}
function startTagAfterAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterAfterBody(p, token);
}
function tokenAfterAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagAfterAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function nullCharacterInForeignContent(p, token) {
	token.chars = "�";
	p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
	p._insertCharacters(token);
	p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
	while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML && p.openElements.currentTagId !== void 0 && !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) p.openElements.pop();
}
function startTagInForeignContent(p, token) {
	if (causesExit(token)) {
		popUntilHtmlOrIntegrationPoint(p);
		p._startTagOutsideForeignContent(token);
	} else {
		const current = p._getAdjustedCurrentElement();
		const currentNs = p.treeAdapter.getNamespaceURI(current);
		if (currentNs === NS.MATHML) adjustTokenMathMLAttrs(token);
		else if (currentNs === NS.SVG) {
			adjustTokenSVGTagName(token);
			adjustTokenSVGAttrs(token);
		}
		adjustTokenXMLAttrs(token);
		if (token.selfClosing) p._appendElement(token, currentNs);
		else p._insertElement(token, currentNs);
		token.ackSelfClosing = true;
	}
}
function endTagInForeignContent(p, token) {
	if (token.tagID === TAG_ID.P || token.tagID === TAG_ID.BR) {
		popUntilHtmlOrIntegrationPoint(p);
		p._endTagOutsideForeignContent(token);
		return;
	}
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element = p.openElements.items[i];
		if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
			p._endTagOutsideForeignContent(token);
			break;
		}
		const tagName = p.treeAdapter.getTagName(element);
		if (tagName.toLowerCase() === token.tagName) {
			token.tagName = tagName;
			p.openElements.shortenToLength(i);
			break;
		}
	}
}
TAG_NAMES.AREA, TAG_NAMES.BASE, TAG_NAMES.BASEFONT, TAG_NAMES.BGSOUND, TAG_NAMES.BR, TAG_NAMES.COL, TAG_NAMES.EMBED, TAG_NAMES.FRAME, TAG_NAMES.HR, TAG_NAMES.IMG, TAG_NAMES.INPUT, TAG_NAMES.KEYGEN, TAG_NAMES.LINK, TAG_NAMES.META, TAG_NAMES.PARAM, TAG_NAMES.SOURCE, TAG_NAMES.TRACK, TAG_NAMES.WBR;
//#endregion
//#region ../node_modules/.pnpm/unist-util-position@5.0.0/node_modules/unist-util-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*/
/**
* Get the ending point of `node`.
*
* @param node
*   Node.
* @returns
*   Point.
*/
var pointEnd = point$2("end");
/**
* Get the starting point of `node`.
*
* @param node
*   Node.
* @returns
*   Point.
*/
var pointStart = point$2("start");
/**
* Get the positional info of `node`.
*
* @param {'end' | 'start'} type
*   Side.
* @returns
*   Getter.
*/
function point$2(type) {
	return point;
	/**
	* Get the point info of `node` at a bound side.
	*
	* @param {Node | NodeLike | null | undefined} [node]
	* @returns {Point | undefined}
	*/
	function point(node) {
		const point = node && node.position && node.position[type] || {};
		if (typeof point.line === "number" && point.line > 0 && typeof point.column === "number" && point.column > 0) return {
			line: point.line,
			column: point.column,
			offset: typeof point.offset === "number" && point.offset > -1 ? point.offset : void 0
		};
	}
}
/**
* Get the positional info of `node`.
*
* @param {Node | NodeLike | null | undefined} [node]
*   Node.
* @returns {Position | undefined}
*   Position.
*/
function position$1(node) {
	const start = pointStart(node);
	const end = pointEnd(node);
	if (start && end) return {
		start,
		end
	};
}
//#endregion
//#region ../node_modules/.pnpm/hast-util-raw@9.1.0/node_modules/hast-util-raw/lib/index.js
/**
* @import {Options} from 'hast-util-raw'
* @import {Comment, Doctype, Element, Nodes, RootContent, Root, Text} from 'hast'
* @import {Raw} from 'mdast-util-to-hast'
* @import {DefaultTreeAdapterMap, ParserOptions} from 'parse5'
* @import {Point} from 'unist'
*/
/**
* @typedef State
*   Info passed around about the current state.
* @property {(node: Nodes) => undefined} handle
*   Add a hast node to the parser.
* @property {Options} options
*   User configuration.
* @property {Parser<DefaultTreeAdapterMap>} parser
*   Current parser.
* @property {boolean} stitches
*   Whether there are stitches.
*/
/**
* @typedef Stitch
*   Custom comment-like value we pass through parse5, which contains a
*   replacement node that we’ll swap back in afterwards.
* @property {'comment'} type
*   Node type.
* @property {{stitch: Nodes}} value
*   Replacement value.
*/
var gfmTagfilterExpression = /<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi;
var knownMdxNames = /* @__PURE__ */ new Set([
	"mdxFlowExpression",
	"mdxJsxFlowElement",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"mdxjsEsm"
]);
/** @type {ParserOptions<DefaultTreeAdapterMap>} */
var parseOptions = {
	sourceCodeLocationInfo: true,
	scriptingEnabled: false
};
/**
* Pass a hast tree through an HTML parser, which will fix nesting, and turn
* raw nodes into actual nodes.
*
* @param {Nodes} tree
*   Original hast tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Nodes}
*   Parsed again tree.
*/
function raw(tree, options) {
	const document = documentMode(tree);
	/** @type {(node: Nodes, state: State) => undefined} */
	const one = zwitch("type", {
		handlers: {
			root: root$2,
			element: element$1,
			text: text$5,
			comment,
			doctype,
			raw: handleRaw
		},
		unknown
	});
	/** @type {State} */
	const state = {
		parser: document ? new Parser(parseOptions) : Parser.getFragmentParser(void 0, parseOptions),
		handle(node) {
			one(node, state);
		},
		stitches: false,
		options: options || {}
	};
	one(tree, state);
	resetTokenizer(state, pointStart());
	const result = fromParse5(document ? state.parser.document : state.parser.getFragment(), { file: state.options.file });
	if (state.stitches) visit(result, "comment", function(node, index, parent) {
		const stitch = node;
		if (stitch.value.stitch && parent && index !== void 0) {
			/** @type {Array<RootContent>} */
			const siblings = parent.children;
			siblings[index] = stitch.value.stitch;
			return index;
		}
	});
	if (result.type === "root" && result.children.length === 1 && result.children[0].type === tree.type) return result.children[0];
	return result;
}
/**
* Transform all nodes
*
* @param {Array<RootContent>} nodes
*   hast content.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function all$1(nodes, state) {
	let index = -1;
	/* istanbul ignore else - invalid nodes, see rehypejs/rehype-raw#7. */
	if (nodes) while (++index < nodes.length) state.handle(nodes[index]);
}
/**
* Transform a root.
*
* @param {Root} node
*   hast root node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function root$2(node, state) {
	all$1(node.children, state);
}
/**
* Transform an element.
*
* @param {Element} node
*   hast element node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function element$1(node, state) {
	startTag(node, state);
	all$1(node.children, state);
	endTag(node, state);
}
/**
* Transform a text.
*
* @param {Text} node
*   hast text node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function text$5(node, state) {
	if (state.parser.tokenizer.state > 4) state.parser.tokenizer.state = 0;
	/** @type {Token.CharacterToken} */
	const token = {
		type: TokenType.CHARACTER,
		chars: node.value,
		location: createParse5Location(node)
	};
	resetTokenizer(state, pointStart(node));
	state.parser.currentToken = token;
	state.parser._processToken(state.parser.currentToken);
}
/**
* Transform a doctype.
*
* @param {Doctype} node
*   hast doctype node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function doctype(node, state) {
	/** @type {Token.DoctypeToken} */
	const token = {
		type: TokenType.DOCTYPE,
		name: "html",
		forceQuirks: false,
		publicId: "",
		systemId: "",
		location: createParse5Location(node)
	};
	resetTokenizer(state, pointStart(node));
	state.parser.currentToken = token;
	state.parser._processToken(state.parser.currentToken);
}
/**
* Transform a stitch.
*
* @param {Nodes} node
*   unknown node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function stitch(node, state) {
	state.stitches = true;
	/** @type {Nodes} */
	const clone = cloneWithoutChildren(node);
	if ("children" in node && "children" in clone) clone.children = raw({
		type: "root",
		children: node.children
	}, state.options).children;
	comment({
		type: "comment",
		value: { stitch: clone }
	}, state);
}
/**
* Transform a comment (or stitch).
*
* @param {Comment | Stitch} node
*   hast comment node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function comment(node, state) {
	/** @type {string} */
	const data = node.value;
	/** @type {Token.CommentToken} */
	const token = {
		type: TokenType.COMMENT,
		data,
		location: createParse5Location(node)
	};
	resetTokenizer(state, pointStart(node));
	state.parser.currentToken = token;
	state.parser._processToken(state.parser.currentToken);
}
/**
* Transform a raw node.
*
* @param {Raw} node
*   hast raw node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function handleRaw(node, state) {
	state.parser.tokenizer.preprocessor.html = "";
	state.parser.tokenizer.preprocessor.pos = -1;
	state.parser.tokenizer.preprocessor.lastGapPos = -2;
	state.parser.tokenizer.preprocessor.gapStack = [];
	state.parser.tokenizer.preprocessor.skipNextNewLine = false;
	state.parser.tokenizer.preprocessor.lastChunkWritten = false;
	state.parser.tokenizer.preprocessor.endOfChunkHit = false;
	state.parser.tokenizer.preprocessor.isEol = false;
	setPoint(state, pointStart(node));
	state.parser.tokenizer.write(state.options.tagfilter ? node.value.replace(gfmTagfilterExpression, "&lt;$1$2") : node.value, false);
	state.parser.tokenizer._runParsingLoop();
	/* c8 ignore next 12 -- removed in <https://github.com/inikulin/parse5/pull/897> */
	if (state.parser.tokenizer.state === 72 || state.parser.tokenizer.state === 78) {
		state.parser.tokenizer.preprocessor.lastChunkWritten = true;
		/** @type {number} */
		const cp = state.parser.tokenizer._consume();
		state.parser.tokenizer._callState(cp);
	}
}
/**
* Crash on an unknown node.
*
* @param {unknown} node_
*   unknown node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Never.
*/
function unknown(node_, state) {
	const node = node_;
	if (state.options.passThrough && state.options.passThrough.includes(node.type)) stitch(node, state);
	else {
		let extra = "";
		if (knownMdxNames.has(node.type)) extra = ". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax";
		throw new Error("Cannot compile `" + node.type + "` node" + extra);
	}
}
/**
* Reset the tokenizer of a parser.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Point | undefined} point
*   Point.
* @returns {undefined}
*   Nothing.
*/
function resetTokenizer(state, point) {
	setPoint(state, point);
	/** @type {Token.CharacterToken} */
	const token = state.parser.tokenizer.currentCharacterToken;
	if (token && token.location) {
		token.location.endLine = state.parser.tokenizer.preprocessor.line;
		token.location.endCol = state.parser.tokenizer.preprocessor.col + 1;
		token.location.endOffset = state.parser.tokenizer.preprocessor.offset + 1;
		state.parser.currentToken = token;
		state.parser._processToken(state.parser.currentToken);
	}
	state.parser.tokenizer.paused = false;
	state.parser.tokenizer.inLoop = false;
	state.parser.tokenizer.active = false;
	state.parser.tokenizer.returnState = TokenizerMode.DATA;
	state.parser.tokenizer.charRefCode = -1;
	state.parser.tokenizer.consumedAfterSnapshot = -1;
	state.parser.tokenizer.currentLocation = null;
	state.parser.tokenizer.currentCharacterToken = null;
	state.parser.tokenizer.currentToken = null;
	state.parser.tokenizer.currentAttr = {
		name: "",
		value: ""
	};
}
/**
* Set current location.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Point | undefined} point
*   Point.
* @returns {undefined}
*   Nothing.
*/
function setPoint(state, point) {
	if (point && point.offset !== void 0) {
		/** @type {Token.Location} */
		const location = {
			startLine: point.line,
			startCol: point.column,
			startOffset: point.offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
		state.parser.tokenizer.preprocessor.lineStartPos = -point.column + 1;
		state.parser.tokenizer.preprocessor.droppedBufferSize = point.offset;
		state.parser.tokenizer.preprocessor.line = point.line;
		state.parser.tokenizer.currentLocation = location;
	}
}
/**
* Emit a start tag.
*
* @param {Element} node
*   Element.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function startTag(node, state) {
	const tagName = node.tagName.toLowerCase();
	if (state.parser.tokenizer.state === TokenizerMode.PLAINTEXT) return;
	resetTokenizer(state, pointStart(node));
	const current = state.parser.openElements.current;
	let ns = "namespaceURI" in current ? current.namespaceURI : webNamespaces.html;
	if (ns === webNamespaces.html && tagName === "svg") ns = webNamespaces.svg;
	const result = toParse5({
		...node,
		children: []
	}, { space: ns === webNamespaces.svg ? "svg" : "html" });
	/** @type {Token.TagToken} */
	const tag = {
		type: TokenType.START_TAG,
		tagName,
		tagID: getTagID(tagName),
		selfClosing: false,
		ackSelfClosing: false,
		/* c8 ignore next */
		attrs: "attrs" in result ? result.attrs : [],
		location: createParse5Location(node)
	};
	state.parser.currentToken = tag;
	state.parser._processToken(state.parser.currentToken);
	state.parser.tokenizer.lastStartTagName = tagName;
}
/**
* Emit an end tag.
*
* @param {Element} node
*   Element.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function endTag(node, state) {
	const tagName = node.tagName.toLowerCase();
	if (!state.parser.tokenizer.inForeignNode && htmlVoidElements.includes(tagName)) return;
	if (state.parser.tokenizer.state === TokenizerMode.PLAINTEXT) return;
	resetTokenizer(state, pointEnd(node));
	/** @type {Token.TagToken} */
	const tag = {
		type: TokenType.END_TAG,
		tagName,
		tagID: getTagID(tagName),
		selfClosing: false,
		ackSelfClosing: false,
		attrs: [],
		location: createParse5Location(node)
	};
	state.parser.currentToken = tag;
	state.parser._processToken(state.parser.currentToken);
	if (tagName === state.parser.tokenizer.lastStartTagName && (state.parser.tokenizer.state === TokenizerMode.RCDATA || state.parser.tokenizer.state === TokenizerMode.RAWTEXT || state.parser.tokenizer.state === TokenizerMode.SCRIPT_DATA)) state.parser.tokenizer.state = TokenizerMode.DATA;
}
/**
* Check if `node` represents a whole document or a fragment.
*
* @param {Nodes} node
*   hast node.
* @returns {boolean}
*   Whether this represents a whole document or a fragment.
*/
function documentMode(node) {
	const head = node.type === "root" ? node.children[0] : node;
	return Boolean(head && (head.type === "doctype" || head.type === "element" && head.tagName.toLowerCase() === "html"));
}
/**
* Get a `parse5` location from a node.
*
* @param {Nodes | Stitch} node
*   hast node.
* @returns {Token.Location}
*   `parse5` location.
*/
function createParse5Location(node) {
	const start = pointStart(node) || {
		line: void 0,
		column: void 0,
		offset: void 0
	};
	const end = pointEnd(node) || {
		line: void 0,
		column: void 0,
		offset: void 0
	};
	return {
		startLine: start.line,
		startCol: start.column,
		startOffset: start.offset,
		endLine: end.line,
		endCol: end.column,
		endOffset: end.offset
	};
}
/**
* @template {Nodes} NodeType
*   Node type.
* @param {NodeType} node
*   Node to clone.
* @returns {NodeType}
*   Cloned node, without children.
*/
function cloneWithoutChildren(node) {
	return "children" in node ? esm_default({
		...node,
		children: []
	}) : esm_default(node);
}
//#endregion
//#region ../node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/lib/index.js
/**
* @typedef {import('hast').Root} Root
* @typedef {import('hast-util-raw').Options} RawOptions
* @typedef {import('vfile').VFile} VFile
*/
/**
* @typedef {Omit<RawOptions, 'file'>} Options
*   Configuration.
*/
/**
* Parse the tree (and raw nodes) again, keeping positional info okay.
*
* @param {Options | null | undefined}  [options]
*   Configuration (optional).
* @returns
*   Transform.
*/
function rehypeRaw(options) {
	/**
	* @param {Root} tree
	*   Tree.
	* @param {VFile} file
	*   File.
	* @returns {Root}
	*   New tree.
	*/
	return function(tree, file) {
		return raw(tree, {
			...options,
			file
		});
	};
}
//#endregion
//#region ../node_modules/.pnpm/rehype-stringify@10.0.1/node_modules/rehype-stringify/lib/index.js
/**
* @import {Root} from 'hast'
* @import {Options} from 'hast-util-to-html'
* @import {Compiler, Processor} from 'unified'
*/
/**
* Plugin to add support for serializing as HTML.
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function rehypeStringify(options) {
	/** @type {Processor<undefined, undefined, undefined, Root, string>} */
	const self = this;
	const settings = {
		...self.data("settings"),
		...options
	};
	self.compiler = compiler;
	/**
	* @type {Compiler<Root, string>}
	*/
	function compiler(tree) {
		return toHtml(tree, settings);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-character@2.1.1/node_modules/micromark-util-character/index.js
/**
* @import {Code} from 'micromark-util-types'
*/
/**
* Check whether the character code represents an ASCII alpha (`a` through `z`,
* case insensitive).
*
* An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
*
* An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
* to U+005A (`Z`).
*
* An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
* to U+007A (`z`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiAlpha = regexCheck(/[A-Za-z]/);
/**
* Check whether the character code represents an ASCII alphanumeric (`a`
* through `z`, case insensitive, or `0` through `9`).
*
* An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
* (see `asciiAlpha`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
/**
* Check whether the character code represents an ASCII atext.
*
* atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
* the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
* U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
* SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
* CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
* (`{`) to U+007E TILDE (`~`).
*
* See:
* **\[RFC5322]**:
* [Internet Message Format](https://tools.ietf.org/html/rfc5322).
* P. Resnick.
* IETF.
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
/**
* Check whether a character code is an ASCII control character.
*
* An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
* to U+001F (US), or U+007F (DEL).
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function asciiControl(code) {
	return code !== null && (code < 32 || code === 127);
}
/**
* Check whether the character code represents an ASCII digit (`0` through `9`).
*
* An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
* U+0039 (`9`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiDigit = regexCheck(/\d/);
/**
* Check whether the character code represents an ASCII hex digit (`a` through
* `f`, case insensitive, or `0` through `9`).
*
* An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
* digit, or an ASCII lower hex digit.
*
* An **ASCII upper hex digit** is a character in the inclusive range U+0041
* (`A`) to U+0046 (`F`).
*
* An **ASCII lower hex digit** is a character in the inclusive range U+0061
* (`a`) to U+0066 (`f`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
/**
* Check whether the character code represents ASCII punctuation.
*
* An **ASCII punctuation** is a character in the inclusive ranges U+0021
* EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
* SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
* (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
/**
* Check whether a character code is a markdown line ending.
*
* A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
* LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
*
* In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
* RETURN (CR) are replaced by these virtual characters depending on whether
* they occurred together.
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownLineEnding(code) {
	return code !== null && code < -2;
}
/**
* Check whether a character code is a markdown line ending (see
* `markdownLineEnding`) or markdown space (see `markdownSpace`).
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownLineEndingOrSpace(code) {
	return code !== null && (code < 0 || code === 32);
}
/**
* Check whether a character code is a markdown space.
*
* A **markdown space** is the concrete character U+0020 SPACE (SP) and the
* virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
*
* In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
* replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
* SPACE (VS) characters, depending on the column at which the tab occurred.
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownSpace(code) {
	return code === -2 || code === -1 || code === 32;
}
/**
* Check whether the character code represents Unicode punctuation.
*
* A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
* Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
* (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
* (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
* punctuation (see `asciiPunctuation`).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
var unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
/**
* Check whether the character code represents Unicode whitespace.
*
* Note that this does handle micromark specific markdown whitespace characters.
* See `markdownLineEndingOrSpace` to check that.
*
* A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
* Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
* U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
var unicodeWhitespace = regexCheck(/\s/);
/**
* Create a code check from a regex.
*
* @param {RegExp} regex
*   Expression.
* @returns {(code: Code) => boolean}
*   Check.
*/
function regexCheck(regex) {
	return check;
	/**
	* Check whether a code matches the bound regex.
	*
	* @param {Code} code
	*   Character code.
	* @returns {boolean}
	*   Whether the character code matches the bound regex.
	*/
	function check(code) {
		return code !== null && code > -1 && regex.test(String.fromCharCode(code));
	}
}
//#endregion
//#region ../node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string) {
	if (typeof string !== "string") throw new TypeError("Expected a string");
	return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-find-and-replace@3.0.2/node_modules/mdast-util-find-and-replace/lib/index.js
/**
* @import {Nodes, Parents, PhrasingContent, Root, Text} from 'mdast'
* @import {BuildVisitor, Test, VisitorResult} from 'unist-util-visit-parents'
*/
/**
* @typedef RegExpMatchObject
*   Info on the match.
* @property {number} index
*   The index of the search at which the result was found.
* @property {string} input
*   A copy of the search string in the text node.
* @property {[...Array<Parents>, Text]} stack
*   All ancestors of the text node, where the last node is the text itself.
*
* @typedef {RegExp | string} Find
*   Pattern to find.
*
*   Strings are escaped and then turned into global expressions.
*
* @typedef {Array<FindAndReplaceTuple>} FindAndReplaceList
*   Several find and replaces, in array form.
*
* @typedef {[Find, Replace?]} FindAndReplaceTuple
*   Find and replace in tuple form.
*
* @typedef {ReplaceFunction | string | null | undefined} Replace
*   Thing to replace with.
*
* @callback ReplaceFunction
*   Callback called when a search matches.
* @param {...any} parameters
*   The parameters are the result of corresponding search expression:
*
*   * `value` (`string`) — whole match
*   * `...capture` (`Array<string>`) — matches from regex capture groups
*   * `match` (`RegExpMatchObject`) — info on the match
* @returns {Array<PhrasingContent> | PhrasingContent | string | false | null | undefined}
*   Thing to replace with.
*
*   * when `null`, `undefined`, `''`, remove the match
*   * …or when `false`, do not replace at all
*   * …or when `string`, replace with a text node of that value
*   * …or when `Node` or `Array<Node>`, replace with those nodes
*
* @typedef {[RegExp, ReplaceFunction]} Pair
*   Normalized find and replace.
*
* @typedef {Array<Pair>} Pairs
*   All find and replaced.
*
* @typedef Options
*   Configuration.
* @property {Test | null | undefined} [ignore]
*   Test for which nodes to ignore (optional).
*/
/**
* Find patterns in a tree and replace them.
*
* The algorithm searches the tree in *preorder* for complete values in `Text`
* nodes.
* Partial matches are not supported.
*
* @param {Nodes} tree
*   Tree to change.
* @param {FindAndReplaceList | FindAndReplaceTuple} list
*   Patterns to find.
* @param {Options | null | undefined} [options]
*   Configuration (when `find` is not `Find`).
* @returns {undefined}
*   Nothing.
*/
function findAndReplace(tree, list, options) {
	const ignored = convert((options || {}).ignore || []);
	const pairs = toPairs(list);
	let pairIndex = -1;
	while (++pairIndex < pairs.length) visitParents(tree, "text", visitor);
	/** @type {BuildVisitor<Root, 'text'>} */
	function visitor(node, parents) {
		let index = -1;
		/** @type {Parents | undefined} */
		let grandparent;
		while (++index < parents.length) {
			const parent = parents[index];
			/** @type {Array<Nodes> | undefined} */
			const siblings = grandparent ? grandparent.children : void 0;
			if (ignored(parent, siblings ? siblings.indexOf(parent) : void 0, grandparent)) return;
			grandparent = parent;
		}
		if (grandparent) return handler(node, parents);
	}
	/**
	* Handle a text node which is not in an ignored parent.
	*
	* @param {Text} node
	*   Text node.
	* @param {Array<Parents>} parents
	*   Parents.
	* @returns {VisitorResult}
	*   Result.
	*/
	function handler(node, parents) {
		const parent = parents[parents.length - 1];
		const find = pairs[pairIndex][0];
		const replace = pairs[pairIndex][1];
		let start = 0;
		const index = parent.children.indexOf(node);
		let change = false;
		/** @type {Array<PhrasingContent>} */
		let nodes = [];
		find.lastIndex = 0;
		let match = find.exec(node.value);
		while (match) {
			const position = match.index;
			/** @type {RegExpMatchObject} */
			const matchObject = {
				index: match.index,
				input: match.input,
				stack: [...parents, node]
			};
			let value = replace(...match, matchObject);
			if (typeof value === "string") value = value.length > 0 ? {
				type: "text",
				value
			} : void 0;
			if (value === false) find.lastIndex = position + 1;
			else {
				if (start !== position) nodes.push({
					type: "text",
					value: node.value.slice(start, position)
				});
				if (Array.isArray(value)) nodes.push(...value);
				else if (value) nodes.push(value);
				start = position + match[0].length;
				change = true;
			}
			if (!find.global) break;
			match = find.exec(node.value);
		}
		if (change) {
			if (start < node.value.length) nodes.push({
				type: "text",
				value: node.value.slice(start)
			});
			parent.children.splice(index, 1, ...nodes);
		} else nodes = [node];
		return index + nodes.length;
	}
}
/**
* Turn a tuple or a list of tuples into pairs.
*
* @param {FindAndReplaceList | FindAndReplaceTuple} tupleOrList
*   Schema.
* @returns {Pairs}
*   Clean pairs.
*/
function toPairs(tupleOrList) {
	/** @type {Pairs} */
	const result = [];
	if (!Array.isArray(tupleOrList)) throw new TypeError("Expected find and replace tuple or list of tuples");
	/** @type {FindAndReplaceList} */
	const list = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [tupleOrList];
	let index = -1;
	while (++index < list.length) {
		const tuple = list[index];
		result.push([toExpression(tuple[0]), toFunction(tuple[1])]);
	}
	return result;
}
/**
* Turn a find into an expression.
*
* @param {Find} find
*   Find.
* @returns {RegExp}
*   Expression.
*/
function toExpression(find) {
	return typeof find === "string" ? new RegExp(escapeStringRegexp(find), "g") : find;
}
/**
* Turn a replace into a function.
*
* @param {Replace} replace
*   Replace.
* @returns {ReplaceFunction}
*   Function.
*/
function toFunction(replace) {
	return typeof replace === "function" ? replace : function() {
		return replace;
	};
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-gfm-autolink-literal@2.0.1/node_modules/mdast-util-gfm-autolink-literal/lib/index.js
/**
* @import {RegExpMatchObject, ReplaceFunction} from 'mdast-util-find-and-replace'
* @import {CompileContext, Extension as FromMarkdownExtension, Handle as FromMarkdownHandle, Transform as FromMarkdownTransform} from 'mdast-util-from-markdown'
* @import {ConstructName, Options as ToMarkdownExtension} from 'mdast-util-to-markdown'
* @import {Link, PhrasingContent} from 'mdast'
*/
/** @type {ConstructName} */
var inConstruct = "phrasing";
/** @type {Array<ConstructName>} */
var notInConstruct = [
	"autolink",
	"link",
	"image",
	"label"
];
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM autolink
* literals in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
*/
function gfmAutolinkLiteralFromMarkdown() {
	return {
		transforms: [transformGfmAutolinkLiterals],
		enter: {
			literalAutolink: enterLiteralAutolink,
			literalAutolinkEmail: enterLiteralAutolinkValue,
			literalAutolinkHttp: enterLiteralAutolinkValue,
			literalAutolinkWww: enterLiteralAutolinkValue
		},
		exit: {
			literalAutolink: exitLiteralAutolink,
			literalAutolinkEmail: exitLiteralAutolinkEmail,
			literalAutolinkHttp: exitLiteralAutolinkHttp,
			literalAutolinkWww: exitLiteralAutolinkWww
		}
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM autolink
* literals in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
*/
function gfmAutolinkLiteralToMarkdown() {
	return { unsafe: [
		{
			character: "@",
			before: "[+\\-.\\w]",
			after: "[\\-.\\w]",
			inConstruct,
			notInConstruct
		},
		{
			character: ".",
			before: "[Ww]",
			after: "[\\-.\\w]",
			inConstruct,
			notInConstruct
		},
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct,
			notInConstruct
		}
	] };
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterLiteralAutolink(token) {
	this.enter({
		type: "link",
		title: null,
		url: "",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterLiteralAutolinkValue(token) {
	this.config.enter.autolinkProtocol.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkHttp(token) {
	this.config.exit.autolinkProtocol.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkWww(token) {
	this.config.exit.data.call(this, token);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.url = "http://" + this.sliceSerialize(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkEmail(token) {
	this.config.exit.autolinkEmail.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolink(token) {
	this.exit(token);
}
/** @type {FromMarkdownTransform} */
function transformGfmAutolinkLiterals(tree) {
	findAndReplace(tree, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, findEmail]], { ignore: ["link", "linkReference"] });
}
/**
* @type {ReplaceFunction}
* @param {string} _
* @param {string} protocol
* @param {string} domain
* @param {string} path
* @param {RegExpMatchObject} match
* @returns {Array<PhrasingContent> | Link | false}
*/
function findUrl(_, protocol, domain, path, match) {
	let prefix = "";
	if (!previous$1(match)) return false;
	if (/^w/i.test(protocol)) {
		domain = protocol + domain;
		protocol = "";
		prefix = "http://";
	}
	if (!isCorrectDomain(domain)) return false;
	const parts = splitUrl(domain + path);
	if (!parts[0]) return false;
	/** @type {Link} */
	const result = {
		type: "link",
		title: null,
		url: prefix + protocol + parts[0],
		children: [{
			type: "text",
			value: protocol + parts[0]
		}]
	};
	if (parts[1]) return [result, {
		type: "text",
		value: parts[1]
	}];
	return result;
}
/**
* @type {ReplaceFunction}
* @param {string} _
* @param {string} atext
* @param {string} label
* @param {RegExpMatchObject} match
* @returns {Link | false}
*/
function findEmail(_, atext, label, match) {
	if (!previous$1(match, true) || /[-\d_]$/.test(label)) return false;
	return {
		type: "link",
		title: null,
		url: "mailto:" + atext + "@" + label,
		children: [{
			type: "text",
			value: atext + "@" + label
		}]
	};
}
/**
* @param {string} domain
* @returns {boolean}
*/
function isCorrectDomain(domain) {
	const parts = domain.split(".");
	if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) return false;
	return true;
}
/**
* @param {string} url
* @returns {[string, string | undefined]}
*/
function splitUrl(url) {
	const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
	if (!trailExec) return [url, void 0];
	url = url.slice(0, trailExec.index);
	let trail = trailExec[0];
	let closingParenIndex = trail.indexOf(")");
	const openingParens = ccount(url, "(");
	let closingParens = ccount(url, ")");
	while (closingParenIndex !== -1 && openingParens > closingParens) {
		url += trail.slice(0, closingParenIndex + 1);
		trail = trail.slice(closingParenIndex + 1);
		closingParenIndex = trail.indexOf(")");
		closingParens++;
	}
	return [url, trail];
}
/**
* @param {RegExpMatchObject} match
* @param {boolean | null | undefined} [email=false]
* @returns {boolean}
*/
function previous$1(match, email) {
	const code = match.input.charCodeAt(match.index - 1);
	return (match.index === 0 || unicodeWhitespace(code) || unicodePunctuation(code)) && (!email || code !== 47);
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-normalize-identifier@2.0.1/node_modules/micromark-util-normalize-identifier/index.js
/**
* Normalize an identifier (as found in references, definitions).
*
* Collapses markdown whitespace, trim, and then lower- and uppercase.
*
* Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
* lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
* uppercase character (U+0398 (`Θ`)).
* So, to get a canonical form, we perform both lower- and uppercase.
*
* Using uppercase last makes sure keys will never interact with default
* prototypal values (such as `constructor`): nothing in the prototype of
* `Object` is uppercase.
*
* @param {string} value
*   Identifier to normalize.
* @returns {string}
*   Normalized identifier.
*/
function normalizeIdentifier(value) {
	return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-gfm-footnote@2.1.0_supports-color@8.1.1/node_modules/mdast-util-gfm-footnote/lib/index.js
/**
* @import {
*   CompileContext,
*   Extension as FromMarkdownExtension,
*   Handle as FromMarkdownHandle
* } from 'mdast-util-from-markdown'
* @import {ToMarkdownOptions} from 'mdast-util-gfm-footnote'
* @import {
*   Handle as ToMarkdownHandle,
*   Map,
*   Options as ToMarkdownExtension
* } from 'mdast-util-to-markdown'
* @import {FootnoteDefinition, FootnoteReference} from 'mdast'
*/
footnoteReference$1.peek = footnoteReferencePeek;
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteCallString() {
	this.buffer();
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteCall(token) {
	this.enter({
		type: "footnoteReference",
		identifier: "",
		label: ""
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteDefinitionLabelString() {
	this.buffer();
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteDefinition(token) {
	this.enter({
		type: "footnoteDefinition",
		identifier: "",
		label: "",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteCallString(token) {
	const label = this.resume();
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	node.label = label;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteCall(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteDefinitionLabelString(token) {
	const label = this.resume();
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	node.label = label;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteDefinition(token) {
	this.exit(token);
}
/** @type {ToMarkdownHandle} */
function footnoteReferencePeek() {
	return "[";
}
/**
* @type {ToMarkdownHandle}
* @param {FootnoteReference} node
*/
function footnoteReference$1(node, _, state, info) {
	const tracker = state.createTracker(info);
	let value = tracker.move("[^");
	const exit = state.enter("footnoteReference");
	const subexit = state.enter("reference");
	value += tracker.move(state.safe(state.associationId(node), {
		after: "]",
		before: value
	}));
	subexit();
	exit();
	value += tracker.move("]");
	return value;
}
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM footnotes
* in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown`.
*/
function gfmFootnoteFromMarkdown() {
	return {
		enter: {
			gfmFootnoteCallString: enterFootnoteCallString,
			gfmFootnoteCall: enterFootnoteCall,
			gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
			gfmFootnoteDefinition: enterFootnoteDefinition
		},
		exit: {
			gfmFootnoteCallString: exitFootnoteCallString,
			gfmFootnoteCall: exitFootnoteCall,
			gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
			gfmFootnoteDefinition: exitFootnoteDefinition
		}
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM footnotes
* in markdown.
*
* @param {ToMarkdownOptions | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown`.
*/
function gfmFootnoteToMarkdown(options) {
	let firstLineBlank = false;
	if (options && options.firstLineBlank) firstLineBlank = true;
	return {
		handlers: {
			footnoteDefinition,
			footnoteReference: footnoteReference$1
		},
		unsafe: [{
			character: "[",
			inConstruct: [
				"label",
				"phrasing",
				"reference"
			]
		}]
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {FootnoteDefinition} node
	*/
	function footnoteDefinition(node, _, state, info) {
		const tracker = state.createTracker(info);
		let value = tracker.move("[^");
		const exit = state.enter("footnoteDefinition");
		const subexit = state.enter("label");
		value += tracker.move(state.safe(state.associationId(node), {
			before: value,
			after: "]"
		}));
		subexit();
		value += tracker.move("]:");
		if (node.children && node.children.length > 0) {
			tracker.shift(4);
			value += tracker.move((firstLineBlank ? "\n" : " ") + state.indentLines(state.containerFlow(node, tracker.current()), firstLineBlank ? mapAll : mapExceptFirst));
		}
		exit();
		return value;
	}
}
/** @type {Map} */
function mapExceptFirst(line, index, blank) {
	return index === 0 ? line : mapAll(line, index, blank);
}
/** @type {Map} */
function mapAll(line, index, blank) {
	return (blank ? "" : "    ") + line;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-gfm-strikethrough@2.0.0_supports-color@8.1.1/node_modules/mdast-util-gfm-strikethrough/lib/index.js
/**
* @typedef {import('mdast').Delete} Delete
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
*/
/**
* List of constructs that occur in phrasing (paragraphs, headings), but cannot
* contain strikethrough.
* So they sort of cancel each other out.
* Note: could use a better name.
*
* Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
*
* @type {Array<ConstructName>}
*/
var constructsWithoutStrikethrough = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
handleDelete.peek = peekDelete;
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM
* strikethrough in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM strikethrough.
*/
function gfmStrikethroughFromMarkdown() {
	return {
		canContainEols: ["delete"],
		enter: { strikethrough: enterStrikethrough },
		exit: { strikethrough: exitStrikethrough }
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM
* strikethrough in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM strikethrough.
*/
function gfmStrikethroughToMarkdown() {
	return {
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: constructsWithoutStrikethrough
		}],
		handlers: { delete: handleDelete }
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterStrikethrough(token) {
	this.enter({
		type: "delete",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitStrikethrough(token) {
	this.exit(token);
}
/**
* @type {ToMarkdownHandle}
* @param {Delete} node
*/
function handleDelete(node, _, state, info) {
	const tracker = state.createTracker(info);
	const exit = state.enter("strikethrough");
	let value = tracker.move("~~");
	value += state.containerPhrasing(node, {
		...tracker.current(),
		before: value,
		after: "~"
	});
	value += tracker.move("~~");
	exit();
	return value;
}
/** @type {ToMarkdownHandle} */
function peekDelete() {
	return "~";
}
//#endregion
//#region ../node_modules/.pnpm/markdown-table@3.0.4/node_modules/markdown-table/index.js
/**
* @typedef {Options} MarkdownTableOptions
*   Configuration.
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [alignDelimiters=true]
*   Whether to align the delimiters (default: `true`);
*   they are aligned by default:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   Pass `false` to make them staggered:
*
*   ```markdown
*   | Alpha | B |
*   | - | - |
*   | C | Delta |
*   ```
* @property {ReadonlyArray<string | null | undefined> | string | null | undefined} [align]
*   How to align columns (default: `''`);
*   one style for all columns or styles for their respective columns;
*   each style is either `'l'` (left), `'r'` (right), or `'c'` (center);
*   other values are treated as `''`, which doesn’t place the colon in the
*   alignment row but does align left;
*   *only the lowercased first character is used, so `Right` is fine.*
* @property {boolean | null | undefined} [delimiterEnd=true]
*   Whether to end each row with the delimiter (default: `true`).
*
*   > 👉 **Note**: please don’t use this: it could create fragile structures
*   > that aren’t understandable to some markdown parsers.
*
*   When `true`, there are ending delimiters:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there are no ending delimiters:
*
*   ```markdown
*   | Alpha | B
*   | ----- | -----
*   | C     | Delta
*   ```
* @property {boolean | null | undefined} [delimiterStart=true]
*   Whether to begin each row with the delimiter (default: `true`).
*
*   > 👉 **Note**: please don’t use this: it could create fragile structures
*   > that aren’t understandable to some markdown parsers.
*
*   When `true`, there are starting delimiters:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there are no starting delimiters:
*
*   ```markdown
*   Alpha | B     |
*   ----- | ----- |
*   C     | Delta |
*   ```
* @property {boolean | null | undefined} [padding=true]
*   Whether to add a space of padding between delimiters and cells
*   (default: `true`).
*
*   When `true`, there is padding:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there is no padding:
*
*   ```markdown
*   |Alpha|B    |
*   |-----|-----|
*   |C    |Delta|
*   ```
* @property {((value: string) => number) | null | undefined} [stringLength]
*   Function to detect the length of table cell content (optional);
*   this is used when aligning the delimiters (`|`) between table cells;
*   full-width characters and emoji mess up delimiter alignment when viewing
*   the markdown source;
*   to fix this, you can pass this function,
*   which receives the cell content and returns its “visible” size;
*   note that what is and isn’t visible depends on where the text is displayed.
*
*   Without such a function, the following:
*
*   ```js
*   markdownTable([
*     ['Alpha', 'Bravo'],
*     ['中文', 'Charlie'],
*     ['👩‍❤️‍👩', 'Delta']
*   ])
*   ```
*
*   Yields:
*
*   ```markdown
*   | Alpha | Bravo |
*   | - | - |
*   | 中文 | Charlie |
*   | 👩‍❤️‍👩 | Delta |
*   ```
*
*   With [`string-width`](https://github.com/sindresorhus/string-width):
*
*   ```js
*   import stringWidth from 'string-width'
*
*   markdownTable(
*     [
*       ['Alpha', 'Bravo'],
*       ['中文', 'Charlie'],
*       ['👩‍❤️‍👩', 'Delta']
*     ],
*     {stringLength: stringWidth}
*   )
*   ```
*
*   Yields:
*
*   ```markdown
*   | Alpha | Bravo   |
*   | ----- | ------- |
*   | 中文  | Charlie |
*   | 👩‍❤️‍👩    | Delta   |
*   ```
*/
/**
* @param {string} value
*   Cell value.
* @returns {number}
*   Cell size.
*/
function defaultStringLength(value) {
	return value.length;
}
/**
* Generate a markdown
* ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables))
* table.
*
* @param {ReadonlyArray<ReadonlyArray<string | null | undefined>>} table
*   Table data (matrix of strings).
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Result.
*/
function markdownTable(table, options) {
	const settings = options || {};
	const align = (settings.align || []).concat();
	const stringLength = settings.stringLength || defaultStringLength;
	/** @type {Array<number>} Character codes as symbols for alignment per column. */
	const alignments = [];
	/** @type {Array<Array<string>>} Cells per row. */
	const cellMatrix = [];
	/** @type {Array<Array<number>>} Sizes of each cell per row. */
	const sizeMatrix = [];
	/** @type {Array<number>} */
	const longestCellByColumn = [];
	let mostCellsPerRow = 0;
	let rowIndex = -1;
	while (++rowIndex < table.length) {
		/** @type {Array<string>} */
		const row = [];
		/** @type {Array<number>} */
		const sizes = [];
		let columnIndex = -1;
		if (table[rowIndex].length > mostCellsPerRow) mostCellsPerRow = table[rowIndex].length;
		while (++columnIndex < table[rowIndex].length) {
			const cell = serialize(table[rowIndex][columnIndex]);
			if (settings.alignDelimiters !== false) {
				const size = stringLength(cell);
				sizes[columnIndex] = size;
				if (longestCellByColumn[columnIndex] === void 0 || size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
			}
			row.push(cell);
		}
		cellMatrix[rowIndex] = row;
		sizeMatrix[rowIndex] = sizes;
	}
	let columnIndex = -1;
	if (typeof align === "object" && "length" in align) while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = toAlignment(align[columnIndex]);
	else {
		const code = toAlignment(align);
		while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = code;
	}
	columnIndex = -1;
	/** @type {Array<string>} */
	const row = [];
	/** @type {Array<number>} */
	const sizes = [];
	while (++columnIndex < mostCellsPerRow) {
		const code = alignments[columnIndex];
		let before = "";
		let after = "";
		if (code === 99) {
			before = ":";
			after = ":";
		} else if (code === 108) before = ":";
		else if (code === 114) after = ":";
		let size = settings.alignDelimiters === false ? 1 : Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length);
		const cell = before + "-".repeat(size) + after;
		if (settings.alignDelimiters !== false) {
			size = before.length + size + after.length;
			if (size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
			sizes[columnIndex] = size;
		}
		row[columnIndex] = cell;
	}
	cellMatrix.splice(1, 0, row);
	sizeMatrix.splice(1, 0, sizes);
	rowIndex = -1;
	/** @type {Array<string>} */
	const lines = [];
	while (++rowIndex < cellMatrix.length) {
		const row = cellMatrix[rowIndex];
		const sizes = sizeMatrix[rowIndex];
		columnIndex = -1;
		/** @type {Array<string>} */
		const line = [];
		while (++columnIndex < mostCellsPerRow) {
			const cell = row[columnIndex] || "";
			let before = "";
			let after = "";
			if (settings.alignDelimiters !== false) {
				const size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
				const code = alignments[columnIndex];
				if (code === 114) before = " ".repeat(size);
				else if (code === 99) {
					if (size % 2) {
						before = " ".repeat(size / 2 + .5);
						after = " ".repeat(size / 2 - .5);
					} else {
						before = " ".repeat(size / 2);
						after = before;
					}
				} else after = " ".repeat(size);
			}
			if (settings.delimiterStart !== false && !columnIndex) line.push("|");
			if (settings.padding !== false && !(settings.alignDelimiters === false && cell === "") && (settings.delimiterStart !== false || columnIndex)) line.push(" ");
			if (settings.alignDelimiters !== false) line.push(before);
			line.push(cell);
			if (settings.alignDelimiters !== false) line.push(after);
			if (settings.padding !== false) line.push(" ");
			if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) line.push("|");
		}
		lines.push(settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join(""));
	}
	return lines.join("\n");
}
/**
* @param {string | null | undefined} [value]
*   Value to serialize.
* @returns {string}
*   Result.
*/
function serialize(value) {
	return value === null || value === void 0 ? "" : String(value);
}
/**
* @param {string | null | undefined} value
*   Value.
* @returns {number}
*   Alignment.
*/
function toAlignment(value) {
	const code = typeof value === "string" ? value.codePointAt(0) : 0;
	return code === 67 || code === 99 ? 99 : code === 76 || code === 108 ? 108 : code === 82 || code === 114 ? 114 : 0;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
/**
* @import {Blockquote, Parents} from 'mdast'
* @import {Info, Map, State} from 'mdast-util-to-markdown'
*/
/**
* @param {Blockquote} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function blockquote$1(node, _, state, info) {
	const exit = state.enter("blockquote");
	const tracker = state.createTracker(info);
	tracker.move("> ");
	tracker.shift(2);
	const value = state.indentLines(state.containerFlow(node, tracker.current()), map$1);
	exit();
	return value;
}
/** @type {Map} */
function map$1(line, _, blank) {
	return ">" + (blank ? "" : " ") + line;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
/**
* @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
*/
/**
* @param {Array<ConstructName>} stack
* @param {Unsafe} pattern
* @returns {boolean}
*/
function patternInScope(stack, pattern) {
	return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}
/**
* @param {Array<ConstructName>} stack
* @param {Unsafe['inConstruct']} list
* @param {boolean} none
* @returns {boolean}
*/
function listInScope(stack, list, none) {
	if (typeof list === "string") list = [list];
	if (!list || list.length === 0) return none;
	let index = -1;
	while (++index < list.length) if (stack.includes(list[index])) return true;
	return false;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/break.js
/**
* @import {Break, Parents} from 'mdast'
* @import {Info, State} from 'mdast-util-to-markdown'
*/
/**
* @param {Break} _
* @param {Parents | undefined} _1
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function hardBreak$1(_, _1, state, info) {
	let index = -1;
	while (++index < state.unsafe.length) if (state.unsafe[index].character === "\n" && patternInScope(state.stack, state.unsafe[index])) return /[ \t]/.test(info.before) ? "" : " ";
	return "\\\n";
}
//#endregion
//#region ../node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js
/**
* Get the count of the longest repeating streak of `substring` in `value`.
*
* @param {string} value
*   Content to search in.
* @param {string} substring
*   Substring to look for, typically one character.
* @returns {number}
*   Count of most frequent adjacent `substring`s in `value`.
*/
function longestStreak(value, substring) {
	const source = String(value);
	let index = source.indexOf(substring);
	let expected = index;
	let count = 0;
	let max = 0;
	if (typeof substring !== "string") throw new TypeError("Expected substring");
	while (index !== -1) {
		if (index === expected) {
			if (++count > max) max = count;
		} else count = 1;
		expected = index + substring.length;
		index = source.indexOf(substring, expected);
	}
	return max;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Code} from 'mdast'
*/
/**
* @param {Code} node
* @param {State} state
* @returns {boolean}
*/
function formatCodeAsIndented(node, state) {
	return Boolean(state.options.fences === false && node.value && !node.lang && /[^ \r\n]/.test(node.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value));
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-fence.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['fence'], null | undefined>}
*/
function checkFence(state) {
	const marker = state.options.fence || "`";
	if (marker !== "`" && marker !== "~") throw new Error("Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/code.js
/**
* @import {Info, Map, State} from 'mdast-util-to-markdown'
* @import {Code, Parents} from 'mdast'
*/
/**
* @param {Code} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function code$2(node, _, state, info) {
	const marker = checkFence(state);
	const raw = node.value || "";
	const suffix = marker === "`" ? "GraveAccent" : "Tilde";
	if (formatCodeAsIndented(node, state)) {
		const exit = state.enter("codeIndented");
		const value = state.indentLines(raw, map);
		exit();
		return value;
	}
	const tracker = state.createTracker(info);
	const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
	const exit = state.enter("codeFenced");
	let value = tracker.move(sequence);
	if (node.lang) {
		const subexit = state.enter(`codeFencedLang${suffix}`);
		value += tracker.move(state.safe(node.lang, {
			before: value,
			after: " ",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	if (node.lang && node.meta) {
		const subexit = state.enter(`codeFencedMeta${suffix}`);
		value += tracker.move(" ");
		value += tracker.move(state.safe(node.meta, {
			before: value,
			after: "\n",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	value += tracker.move("\n");
	if (raw) value += tracker.move(raw + "\n");
	value += tracker.move(sequence);
	exit();
	return value;
}
/** @type {Map} */
function map(line, _, blank) {
	return (blank ? "" : "    ") + line;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['quote'], null | undefined>}
*/
function checkQuote(state) {
	const marker = state.options.quote || "\"";
	if (marker !== "\"" && marker !== "'") throw new Error("Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/definition.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Definition, Parents} from 'mdast'
*/
/**
* @param {Definition} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function definition$1(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit = state.enter("definition");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	value += tracker.move(state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("]: ");
	subexit();
	if (!node.url || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : "\n",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	exit();
	return value;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['emphasis'], null | undefined>}
*/
function checkEmphasis(state) {
	const marker = state.options.emphasis || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
/**
* Encode a code point as a character reference.
*
* @param {number} code
*   Code point to encode.
* @returns {string}
*   Encoded character reference.
*/
function encodeCharacterReference(code) {
	return "&#x" + code.toString(16).toUpperCase() + ";";
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-classify-character@2.0.1/node_modules/micromark-util-classify-character/index.js
/**
* @import {Code} from 'micromark-util-types'
*/
/**
* Classify whether a code represents whitespace, punctuation, or something
* else.
*
* Used for attention (emphasis, strong), whose sequences can open or close
* based on the class of surrounding characters.
*
* > 👉 **Note**: eof (`null`) is seen as whitespace.
*
* @param {Code} code
*   Code.
* @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
*   Group.
*/
function classifyCharacter(code) {
	if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return 1;
	if (unicodePunctuation(code)) return 2;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-info.js
/**
* @import {EncodeSides} from '../types.js'
*/
/**
* Check whether to encode (as a character reference) the characters
* surrounding an attention run.
*
* Which characters are around an attention run influence whether it works or
* not.
*
* See <https://github.com/orgs/syntax-tree/discussions/60> for more info.
* See this markdown in a particular renderer to see what works:
*
* ```markdown
* |                         | A (letter inside) | B (punctuation inside) | C (whitespace inside) | D (nothing inside) |
* | ----------------------- | ----------------- | ---------------------- | --------------------- | ------------------ |
* | 1 (letter outside)      | x*y*z             | x*.*z                  | x* *z                 | x**z               |
* | 2 (punctuation outside) | .*y*.             | .*.*.                  | .* *.                 | .**.               |
* | 3 (whitespace outside)  | x *y* z           | x *.* z                | x * * z               | x ** z             |
* | 4 (nothing outside)     | *x*               | *.*                    | * *                   | **                 |
* ```
*
* @param {number} outside
*   Code point on the outer side of the run.
* @param {number} inside
*   Code point on the inner side of the run.
* @param {'*' | '_'} marker
*   Marker of the run.
*   Underscores are handled more strictly (they form less often) than
*   asterisks.
* @returns {EncodeSides}
*   Whether to encode characters.
*/
function encodeInfo(outside, inside, marker) {
	const outsideKind = classifyCharacter(outside);
	const insideKind = classifyCharacter(inside);
	if (outsideKind === void 0) return insideKind === void 0 ? marker === "_" ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	} : insideKind === 1 ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: true
	};
	if (outsideKind === 1) return insideKind === void 0 ? {
		inside: false,
		outside: false
	} : insideKind === 1 ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	};
	return insideKind === void 0 ? {
		inside: false,
		outside: false
	} : insideKind === 1 ? {
		inside: true,
		outside: false
	} : {
		inside: false,
		outside: false
	};
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Emphasis, Parents} from 'mdast'
*/
emphasis$1.peek = emphasisPeek;
/**
* @param {Emphasis} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function emphasis$1(node, _, state, info) {
	const marker = checkEmphasis(state);
	const exit = state.enter("emphasis");
	const tracker = state.createTracker(info);
	const before = tracker.move(marker);
	let between = tracker.move(state.containerPhrasing(node, {
		after: marker,
		before,
		...tracker.current()
	}));
	const betweenHead = between.charCodeAt(0);
	const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
	if (open.inside) between = encodeCharacterReference(betweenHead) + between.slice(1);
	const betweenTail = between.charCodeAt(between.length - 1);
	const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
	if (close.inside) between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
	const after = tracker.move(marker);
	exit();
	state.attentionEncodeSurroundingInfo = {
		after: close.outside,
		before: open.outside
	};
	return before + between + after;
}
/**
* @param {Emphasis} _
* @param {Parents | undefined} _1
* @param {State} state
* @returns {string}
*/
function emphasisPeek(_, _1, state) {
	return state.options.emphasis || "*";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js
/**
* @typedef {import('mdast').Nodes} Nodes
*
* @typedef Options
*   Configuration (optional).
* @property {boolean | null | undefined} [includeImageAlt=true]
*   Whether to use `alt` for `image`s (default: `true`).
* @property {boolean | null | undefined} [includeHtml=true]
*   Whether to use `value` of HTML (default: `true`).
*/
/** @type {Options} */
var emptyOptions$2 = {};
/**
* Get the text content of a node or list of nodes.
*
* Prefers the node’s plain-text fields, otherwise serializes its children,
* and if the given value is an array, serialize the nodes in it.
*
* @param {unknown} [value]
*   Thing to serialize, typically `Node`.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Serialized `value`.
*/
function toString(value, options) {
	const settings = options || emptyOptions$2;
	return one(value, typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true, typeof settings.includeHtml === "boolean" ? settings.includeHtml : true);
}
/**
* One node or several nodes.
*
* @param {unknown} value
*   Thing to serialize.
* @param {boolean} includeImageAlt
*   Include image `alt`s.
* @param {boolean} includeHtml
*   Include HTML.
* @returns {string}
*   Serialized node.
*/
function one(value, includeImageAlt, includeHtml) {
	if (node(value)) {
		if ("value" in value) return value.type === "html" && !includeHtml ? "" : value.value;
		if (includeImageAlt && "alt" in value && value.alt) return value.alt;
		if ("children" in value) return all(value.children, includeImageAlt, includeHtml);
	}
	if (Array.isArray(value)) return all(value, includeImageAlt, includeHtml);
	return "";
}
/**
* Serialize a list of nodes.
*
* @param {Array<unknown>} values
*   Thing to serialize.
* @param {boolean} includeImageAlt
*   Include image `alt`s.
* @param {boolean} includeHtml
*   Include HTML.
* @returns {string}
*   Serialized nodes.
*/
function all(values, includeImageAlt, includeHtml) {
	/** @type {Array<string>} */
	const result = [];
	let index = -1;
	while (++index < values.length) result[index] = one(values[index], includeImageAlt, includeHtml);
	return result.join("");
}
/**
* Check if `value` looks like a node.
*
* @param {unknown} value
*   Thing.
* @returns {value is Nodes}
*   Whether `value` is a node.
*/
function node(value) {
	return Boolean(value && typeof value === "object");
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Heading} from 'mdast'
*/
/**
* @param {Heading} node
* @param {State} state
* @returns {boolean}
*/
function formatHeadingAsSetext(node, state) {
	let literalWithBreak = false;
	visit(node, function(node) {
		if ("value" in node && /\r?\n|\r/.test(node.value) || node.type === "break") {
			literalWithBreak = true;
			return false;
		}
	});
	return Boolean((!node.depth || node.depth < 3) && toString(node) && (state.options.setext || literalWithBreak));
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/heading.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Heading, Parents} from 'mdast'
*/
/**
* @param {Heading} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function heading$1(node, _, state, info) {
	const rank = Math.max(Math.min(6, node.depth || 1), 1);
	const tracker = state.createTracker(info);
	if (formatHeadingAsSetext(node, state)) {
		const exit = state.enter("headingSetext");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node, {
			...tracker.current(),
			before: "\n",
			after: "\n"
		});
		subexit();
		exit();
		return value + "\n" + (rank === 1 ? "=" : "-").repeat(value.length - (Math.max(value.lastIndexOf("\r"), value.lastIndexOf("\n")) + 1));
	}
	const sequence = "#".repeat(rank);
	const exit = state.enter("headingAtx");
	const subexit = state.enter("phrasing");
	tracker.move(sequence + " ");
	let value = state.containerPhrasing(node, {
		before: "# ",
		after: "\n",
		...tracker.current()
	});
	if (/^[\t ]/.test(value)) value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
	value = value ? sequence + " " + value : sequence;
	if (state.options.closeAtx) value += " " + sequence;
	subexit();
	exit();
	return value;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/html.js
/**
* @import {Html} from 'mdast'
*/
html$1.peek = htmlPeek;
/**
* @param {Html} node
* @returns {string}
*/
function html$1(node) {
	return node.value || "";
}
/**
* @returns {string}
*/
function htmlPeek() {
	return "<";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Image, Parents} from 'mdast'
*/
image$1.peek = imagePeek;
/**
* @param {Image} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function image$1(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit = state.enter("image");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	value += tracker.move(state.safe(node.alt, {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit();
	return value;
}
/**
* @returns {string}
*/
function imagePeek() {
	return "!";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {ImageReference, Parents} from 'mdast'
*/
imageReference$1.peek = imageReferencePeek;
/**
* @param {ImageReference} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function imageReference$1(node, _, state, info) {
	const type = node.referenceType;
	const exit = state.enter("imageReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	const alt = state.safe(node.alt, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(alt + "][");
	subexit();
	const stack = state.stack;
	state.stack = [];
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit();
	if (type === "full" || !alt || alt !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* @returns {string}
*/
function imageReferencePeek() {
	return "!";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {InlineCode, Parents} from 'mdast'
*/
inlineCode$1.peek = inlineCodePeek;
/**
* @param {InlineCode} node
* @param {Parents | undefined} _
* @param {State} state
* @returns {string}
*/
function inlineCode$1(node, _, state) {
	let value = node.value || "";
	let sequence = "`";
	let index = -1;
	while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) sequence += "`";
	if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) value = " " + value + " ";
	while (++index < state.unsafe.length) {
		const pattern = state.unsafe[index];
		const expression = state.compilePattern(pattern);
		/** @type {RegExpExecArray | null} */
		let match;
		if (!pattern.atBreak) continue;
		while (match = expression.exec(value)) {
			let position = match.index;
			if (value.charCodeAt(position) === 10 && value.charCodeAt(position - 1) === 13) position--;
			value = value.slice(0, position) + " " + value.slice(match.index + 1);
		}
	}
	return sequence + value + sequence;
}
/**
* @returns {string}
*/
function inlineCodePeek() {
	return "`";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Link} from 'mdast'
*/
/**
* @param {Link} node
* @param {State} state
* @returns {boolean}
*/
function formatLinkAsAutolink(node, state) {
	const raw = toString(node);
	return Boolean(!state.options.resourceLink && node.url && !node.title && node.children && node.children.length === 1 && node.children[0].type === "text" && (raw === node.url || "mailto:" + raw === node.url) && /^[a-z][a-z+.-]+:/i.test(node.url) && !/[\0- <>\u007F]/.test(node.url));
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Link, Parents} from 'mdast'
* @import {Exit} from '../types.js'
*/
link$1.peek = linkPeek;
/**
* @param {Link} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function link$1(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const tracker = state.createTracker(info);
	/** @type {Exit} */
	let exit;
	/** @type {Exit} */
	let subexit;
	if (formatLinkAsAutolink(node, state)) {
		const stack = state.stack;
		state.stack = [];
		exit = state.enter("autolink");
		let value = tracker.move("<");
		value += tracker.move(state.containerPhrasing(node, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
		exit();
		state.stack = stack;
		return value;
	}
	exit = state.enter("link");
	subexit = state.enter("label");
	let value = tracker.move("[");
	value += tracker.move(state.containerPhrasing(node, {
		before: value,
		after: "](",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit();
	return value;
}
/**
* @param {Link} node
* @param {Parents | undefined} _
* @param {State} state
* @returns {string}
*/
function linkPeek(node, _, state) {
	return formatLinkAsAutolink(node, state) ? "<" : "[";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {LinkReference, Parents} from 'mdast'
*/
linkReference$1.peek = linkReferencePeek;
/**
* @param {LinkReference} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function linkReference$1(node, _, state, info) {
	const type = node.referenceType;
	const exit = state.enter("linkReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	const text = state.containerPhrasing(node, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(text + "][");
	subexit();
	const stack = state.stack;
	state.stack = [];
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit();
	if (type === "full" || !text || text !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* @returns {string}
*/
function linkReferencePeek() {
	return "[";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['bullet'], null | undefined>}
*/
function checkBullet(state) {
	const marker = state.options.bullet || "*";
	if (marker !== "*" && marker !== "+" && marker !== "-") throw new Error("Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['bullet'], null | undefined>}
*/
function checkBulletOther(state) {
	const bullet = checkBullet(state);
	const bulletOther = state.options.bulletOther;
	if (!bulletOther) return bullet === "*" ? "-" : "*";
	if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") throw new Error("Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
	if (bulletOther === bullet) throw new Error("Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different");
	return bulletOther;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['bulletOrdered'], null | undefined>}
*/
function checkBulletOrdered(state) {
	const marker = state.options.bulletOrdered || ".";
	if (marker !== "." && marker !== ")") throw new Error("Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['rule'], null | undefined>}
*/
function checkRule(state) {
	const marker = state.options.rule || "*";
	if (marker !== "*" && marker !== "-" && marker !== "_") throw new Error("Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {List, Parents} from 'mdast'
*/
/**
* @param {List} node
* @param {Parents | undefined} parent
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function list$2(node, parent, state, info) {
	const exit = state.enter("list");
	const bulletCurrent = state.bulletCurrent;
	/** @type {string} */
	let bullet = node.ordered ? checkBulletOrdered(state) : checkBullet(state);
	/** @type {string} */
	const bulletOther = node.ordered ? bullet === "." ? ")" : "." : checkBulletOther(state);
	let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
	if (!node.ordered) {
		const firstListItem = node.children ? node.children[0] : void 0;
		if ((bullet === "*" || bullet === "-") && firstListItem && (!firstListItem.children || !firstListItem.children[0]) && state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) useDifferentMarker = true;
		if (checkRule(state) === bullet && firstListItem) {
			let index = -1;
			while (++index < node.children.length) {
				const item = node.children[index];
				if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
					useDifferentMarker = true;
					break;
				}
			}
		}
	}
	if (useDifferentMarker) bullet = bulletOther;
	state.bulletCurrent = bullet;
	const value = state.containerFlow(node, info);
	state.bulletLastUsed = bullet;
	state.bulletCurrent = bulletCurrent;
	exit();
	return value;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['listItemIndent'], null | undefined>}
*/
function checkListItemIndent(state) {
	const style = state.options.listItemIndent || "one";
	if (style !== "tab" && style !== "one" && style !== "mixed") throw new Error("Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
	return style;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list-item.js
/**
* @import {Info, Map, State} from 'mdast-util-to-markdown'
* @import {ListItem, Parents} from 'mdast'
*/
/**
* @param {ListItem} node
* @param {Parents | undefined} parent
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function listItem$1(node, parent, state, info) {
	const listItemIndent = checkListItemIndent(state);
	let bullet = state.bulletCurrent || checkBullet(state);
	if (parent && parent.type === "list" && parent.ordered) bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node)) + bullet;
	let size = bullet.length + 1;
	if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node.spread)) size = Math.ceil(size / 4) * 4;
	const tracker = state.createTracker(info);
	tracker.move(bullet + " ".repeat(size - bullet.length));
	tracker.shift(size);
	const exit = state.enter("listItem");
	const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
	exit();
	return value;
	/** @type {Map} */
	function map(line, index, blank) {
		if (index) return (blank ? "" : " ".repeat(size)) + line;
		return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
	}
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Paragraph, Parents} from 'mdast'
*/
/**
* @param {Paragraph} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function paragraph$1(node, _, state, info) {
	const exit = state.enter("paragraph");
	const subexit = state.enter("phrasing");
	const value = state.containerPhrasing(node, info);
	subexit();
	exit();
	return value;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-phrasing@4.1.0/node_modules/mdast-util-phrasing/lib/index.js
/**
* @typedef {import('mdast').Html} Html
* @typedef {import('mdast').PhrasingContent} PhrasingContent
*/
/**
* Check if the given value is *phrasing content*.
*
* > 👉 **Note**: Excludes `html`, which can be both phrasing or flow.
*
* @param node
*   Thing to check, typically `Node`.
* @returns
*   Whether `value` is phrasing content.
*/
var phrasing = convert([
	"break",
	"delete",
	"emphasis",
	"footnote",
	"footnoteReference",
	"image",
	"imageReference",
	"inlineCode",
	"inlineMath",
	"link",
	"linkReference",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"strong",
	"text",
	"textDirective"
]);
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/root.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Root} from 'mdast'
*/
/**
* @param {Root} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function root$1(node, _, state, info) {
	return (node.children.some(function(d) {
		return phrasing(d);
	}) ? state.containerPhrasing : state.containerFlow).call(state, node, info);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-strong.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['strong'], null | undefined>}
*/
function checkStrong(state) {
	const marker = state.options.strong || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`");
	return marker;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/strong.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Strong} from 'mdast'
*/
strong$1.peek = strongPeek;
/**
* @param {Strong} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function strong$1(node, _, state, info) {
	const marker = checkStrong(state);
	const exit = state.enter("strong");
	const tracker = state.createTracker(info);
	const before = tracker.move(marker + marker);
	let between = tracker.move(state.containerPhrasing(node, {
		after: marker,
		before,
		...tracker.current()
	}));
	const betweenHead = between.charCodeAt(0);
	const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
	if (open.inside) between = encodeCharacterReference(betweenHead) + between.slice(1);
	const betweenTail = between.charCodeAt(between.length - 1);
	const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
	if (close.inside) between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
	const after = tracker.move(marker + marker);
	exit();
	state.attentionEncodeSurroundingInfo = {
		after: close.outside,
		before: open.outside
	};
	return before + between + after;
}
/**
* @param {Strong} _
* @param {Parents | undefined} _1
* @param {State} state
* @returns {string}
*/
function strongPeek(_, _1, state) {
	return state.options.strong || "*";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/text.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Text} from 'mdast'
*/
/**
* @param {Text} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function text$4(node, _, state, info) {
	return state.safe(node.value, info);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['ruleRepetition'], null | undefined>}
*/
function checkRuleRepetition(state) {
	const repetition = state.options.ruleRepetition || 3;
	if (repetition < 3) throw new Error("Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more");
	return repetition;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Parents, ThematicBreak} from 'mdast'
*/
/**
* @param {ThematicBreak} _
* @param {Parents | undefined} _1
* @param {State} state
* @returns {string}
*/
function thematicBreak$2(_, _1, state) {
	const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
	return state.options.ruleSpaces ? value.slice(0, -1) : value;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js
/**
* Default (CommonMark) handlers.
*/
var handle = {
	blockquote: blockquote$1,
	break: hardBreak$1,
	code: code$2,
	definition: definition$1,
	emphasis: emphasis$1,
	hardBreak: hardBreak$1,
	heading: heading$1,
	html: html$1,
	image: image$1,
	imageReference: imageReference$1,
	inlineCode: inlineCode$1,
	link: link$1,
	linkReference: linkReference$1,
	list: list$2,
	listItem: listItem$1,
	paragraph: paragraph$1,
	root: root$1,
	strong: strong$1,
	text: text$4,
	thematicBreak: thematicBreak$2
};
//#endregion
//#region ../node_modules/.pnpm/decode-named-character-reference@1.3.0/node_modules/decode-named-character-reference/index.dom.js
var element = document.createElement("i");
/**
* @param {string} value
* @returns {string | false}
*/
function decodeNamedCharacterReference(value) {
	const characterReference = "&" + value + ";";
	element.innerHTML = characterReference;
	const character = element.textContent;
	if (character.charCodeAt(character.length - 1) === 59 && value !== "semi") return false;
	return character === characterReference ? false : character;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-decode-numeric-character-reference@2.0.2/node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
* Turn the number (in string form as either hexa- or plain decimal) coming from
* a numeric character reference into a character.
*
* Sort of like `String.fromCodePoint(Number.parseInt(value, base))`, but makes
* non-characters and control characters safe.
*
* @param {string} value
*   Value to decode.
* @param {number} base
*   Numeric base.
* @returns {string}
*   Character.
*/
function decodeNumericCharacterReference(value, base) {
	const code = Number.parseInt(value, base);
	if (code < 9 || code === 11 || code > 13 && code < 32 || code > 126 && code < 160 || code > 55295 && code < 57344 || code > 64975 && code < 65008 || (code & 65535) === 65535 || (code & 65535) === 65534 || code > 1114111) return "�";
	return String.fromCodePoint(code);
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-decode-string@2.0.1/node_modules/micromark-util-decode-string/index.js
var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
/**
* Decode markdown strings (which occur in places such as fenced code info
* strings, destinations, labels, and titles).
*
* The “string” content type allows character escapes and -references.
* This decodes those.
*
* @param {string} value
*   Value to decode.
* @returns {string}
*   Decoded value.
*/
function decodeString(value) {
	return value.replace(characterEscapeOrReference, decode);
}
/**
* @param {string} $0
*   Match.
* @param {string} $1
*   Character escape.
* @param {string} $2
*   Character reference.
* @returns {string}
*   Decoded value
*/
function decode($0, $1, $2) {
	if ($1) return $1;
	if ($2.charCodeAt(0) === 35) {
		const head = $2.charCodeAt(1);
		const hex = head === 120 || head === 88;
		return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
	}
	return decodeNamedCharacterReference($2) || $0;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-gfm-table@2.0.0_supports-color@8.1.1/node_modules/mdast-util-gfm-table/lib/index.js
/**
* @typedef {import('mdast').InlineCode} InlineCode
* @typedef {import('mdast').Table} Table
* @typedef {import('mdast').TableCell} TableCell
* @typedef {import('mdast').TableRow} TableRow
*
* @typedef {import('markdown-table').Options} MarkdownTableOptions
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').State} State
* @typedef {import('mdast-util-to-markdown').Info} Info
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [tableCellPadding=true]
*   Whether to add a space of padding between delimiters and cells (default:
*   `true`).
* @property {boolean | null | undefined} [tablePipeAlign=true]
*   Whether to align the delimiters (default: `true`).
* @property {MarkdownTableOptions['stringLength'] | null | undefined} [stringLength]
*   Function to detect the length of table cell content, used when aligning
*   the delimiters between cells (optional).
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM tables in
* markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM tables.
*/
function gfmTableFromMarkdown() {
	return {
		enter: {
			table: enterTable,
			tableData: enterCell,
			tableHeader: enterCell,
			tableRow: enterRow
		},
		exit: {
			codeText: exitCodeText,
			table: exitTable,
			tableData: exit$1,
			tableHeader: exit$1,
			tableRow: exit$1
		}
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterTable(token) {
	const align = token._align;
	this.enter({
		type: "table",
		align: align.map(function(d) {
			return d === "none" ? null : d;
		}),
		children: []
	}, token);
	this.data.inTable = true;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitTable(token) {
	this.exit(token);
	this.data.inTable = void 0;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterRow(token) {
	this.enter({
		type: "tableRow",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exit$1(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterCell(token) {
	this.enter({
		type: "tableCell",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCodeText(token) {
	let value = this.resume();
	if (this.data.inTable) value = value.replace(/\\([\\|])/g, replace);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.value = value;
	this.exit(token);
}
/**
* @param {string} $0
* @param {string} $1
* @returns {string}
*/
function replace($0, $1) {
	return $1 === "|" ? $1 : $0;
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM tables in
* markdown.
*
* @param {Options | null | undefined} [options]
*   Configuration.
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM tables.
*/
function gfmTableToMarkdown(options) {
	const settings = options || {};
	const padding = settings.tableCellPadding;
	const alignDelimiters = settings.tablePipeAlign;
	const stringLength = settings.stringLength;
	const around = padding ? " " : "|";
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "tableCell"
			},
			{
				character: "\n",
				inConstruct: "tableCell"
			},
			{
				atBreak: true,
				character: "|",
				after: "[	 :-]"
			},
			{
				character: "|",
				inConstruct: "tableCell"
			},
			{
				atBreak: true,
				character: ":",
				after: "-"
			},
			{
				atBreak: true,
				character: "-",
				after: "[:|-]"
			}
		],
		handlers: {
			inlineCode: inlineCodeWithTable,
			table: handleTable,
			tableCell: handleTableCell,
			tableRow: handleTableRow
		}
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {Table} node
	*/
	function handleTable(node, _, state, info) {
		return serializeData(handleTableAsData(node, state, info), node.align);
	}
	/**
	* This function isn’t really used normally, because we handle rows at the
	* table level.
	* But, if someone passes in a table row, this ensures we make somewhat sense.
	*
	* @type {ToMarkdownHandle}
	* @param {TableRow} node
	*/
	function handleTableRow(node, _, state, info) {
		const value = serializeData([handleTableRowAsData(node, state, info)]);
		return value.slice(0, value.indexOf("\n"));
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {TableCell} node
	*/
	function handleTableCell(node, _, state, info) {
		const exit = state.enter("tableCell");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node, {
			...info,
			before: around,
			after: around
		});
		subexit();
		exit();
		return value;
	}
	/**
	* @param {Array<Array<string>>} matrix
	* @param {Array<string | null | undefined> | null | undefined} [align]
	*/
	function serializeData(matrix, align) {
		return markdownTable(matrix, {
			align,
			alignDelimiters,
			padding,
			stringLength
		});
	}
	/**
	* @param {Table} node
	* @param {State} state
	* @param {Info} info
	*/
	function handleTableAsData(node, state, info) {
		const children = node.children;
		let index = -1;
		/** @type {Array<Array<string>>} */
		const result = [];
		const subexit = state.enter("table");
		while (++index < children.length) result[index] = handleTableRowAsData(children[index], state, info);
		subexit();
		return result;
	}
	/**
	* @param {TableRow} node
	* @param {State} state
	* @param {Info} info
	*/
	function handleTableRowAsData(node, state, info) {
		const children = node.children;
		let index = -1;
		/** @type {Array<string>} */
		const result = [];
		const subexit = state.enter("tableRow");
		while (++index < children.length) result[index] = handleTableCell(children[index], node, state, info);
		subexit();
		return result;
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {InlineCode} node
	*/
	function inlineCodeWithTable(node, parent, state) {
		let value = handle.inlineCode(node, parent, state);
		if (state.stack.includes("tableCell")) value = value.replace(/\|/g, "\\$&");
		return value;
	}
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-gfm-task-list-item@2.0.0_supports-color@8.1.1/node_modules/mdast-util-gfm-task-list-item/lib/index.js
/**
* @typedef {import('mdast').ListItem} ListItem
* @typedef {import('mdast').Paragraph} Paragraph
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM task
* list items in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM task list items.
*/
function gfmTaskListItemFromMarkdown() {
	return { exit: {
		taskListCheckValueChecked: exitCheck,
		taskListCheckValueUnchecked: exitCheck,
		paragraph: exitParagraphWithTaskListItem
	} };
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM task list
* items in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM task list items.
*/
function gfmTaskListItemToMarkdown() {
	return {
		unsafe: [{
			atBreak: true,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: listItemWithTaskListItem }
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCheck(token) {
	const node = this.stack[this.stack.length - 2];
	node.type;
	node.checked = token.type === "taskListCheckValueChecked";
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitParagraphWithTaskListItem(token) {
	const parent = this.stack[this.stack.length - 2];
	if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
		const node = this.stack[this.stack.length - 1];
		node.type;
		const head = node.children[0];
		if (head && head.type === "text") {
			const siblings = parent.children;
			let index = -1;
			/** @type {Paragraph | undefined} */
			let firstParaghraph;
			while (++index < siblings.length) {
				const sibling = siblings[index];
				if (sibling.type === "paragraph") {
					firstParaghraph = sibling;
					break;
				}
			}
			if (firstParaghraph === node) {
				head.value = head.value.slice(1);
				if (head.value.length === 0) node.children.shift();
				else if (node.position && head.position && typeof head.position.start.offset === "number") {
					head.position.start.column++;
					head.position.start.offset++;
					node.position.start = Object.assign({}, head.position.start);
				}
			}
		}
	}
	this.exit(token);
}
/**
* @type {ToMarkdownHandle}
* @param {ListItem} node
*/
function listItemWithTaskListItem(node, parent, state, info) {
	const head = node.children[0];
	const checkable = typeof node.checked === "boolean" && head && head.type === "paragraph";
	const checkbox = "[" + (node.checked ? "x" : " ") + "] ";
	const tracker = state.createTracker(info);
	if (checkable) tracker.move(checkbox);
	let value = handle.listItem(node, parent, state, {
		...info,
		...tracker.current()
	});
	if (checkable) value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
	return value;
	/**
	* @param {string} $0
	* @returns {string}
	*/
	function check($0) {
		return $0 + checkbox;
	}
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-gfm@3.1.0_supports-color@8.1.1/node_modules/mdast-util-gfm/lib/index.js
/**
* @import {Extension as FromMarkdownExtension} from 'mdast-util-from-markdown'
* @import {Options} from 'mdast-util-gfm'
* @import {Options as ToMarkdownExtension} from 'mdast-util-to-markdown'
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM (autolink
* literals, footnotes, strikethrough, tables, tasklists).
*
* @returns {Array<FromMarkdownExtension>}
*   Extension for `mdast-util-from-markdown` to enable GFM (autolink literals,
*   footnotes, strikethrough, tables, tasklists).
*/
function gfmFromMarkdown() {
	return [
		gfmAutolinkLiteralFromMarkdown(),
		gfmFootnoteFromMarkdown(),
		gfmStrikethroughFromMarkdown(),
		gfmTableFromMarkdown(),
		gfmTaskListItemFromMarkdown()
	];
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM (autolink
* literals, footnotes, strikethrough, tables, tasklists).
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM (autolink literals,
*   footnotes, strikethrough, tables, tasklists).
*/
function gfmToMarkdown(options) {
	return { extensions: [
		gfmAutolinkLiteralToMarkdown(),
		gfmFootnoteToMarkdown(options),
		gfmStrikethroughToMarkdown(),
		gfmTableToMarkdown(options),
		gfmTaskListItemToMarkdown()
	] };
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-chunked@2.0.1/node_modules/micromark-util-chunked/index.js
/**
* Like `Array#splice`, but smarter for giant arrays.
*
* `Array#splice` takes all items to be inserted as individual argument which
* causes a stack overflow in V8 when trying to insert 100k items for instance.
*
* Otherwise, this does not return the removed items, and takes `items` as an
* array instead of rest parameters.
*
* @template {unknown} T
*   Item type.
* @param {Array<T>} list
*   List to operate on.
* @param {number} start
*   Index to remove/insert at (can be negative).
* @param {number} remove
*   Number of items to remove.
* @param {Array<T>} items
*   Items to inject into `list`.
* @returns {undefined}
*   Nothing.
*/
function splice(list, start, remove, items) {
	const end = list.length;
	let chunkStart = 0;
	/** @type {Array<unknown>} */
	let parameters;
	if (start < 0) start = -start > end ? 0 : end + start;
	else start = start > end ? end : start;
	remove = remove > 0 ? remove : 0;
	if (items.length < 1e4) {
		parameters = Array.from(items);
		parameters.unshift(start, remove);
		list.splice(...parameters);
	} else {
		if (remove) list.splice(start, remove);
		while (chunkStart < items.length) {
			parameters = items.slice(chunkStart, chunkStart + 1e4);
			parameters.unshift(start, 0);
			list.splice(...parameters);
			chunkStart += 1e4;
			start += 1e4;
		}
	}
}
/**
* Append `items` (an array) at the end of `list` (another array).
* When `list` was empty, returns `items` instead.
*
* This prevents a potentially expensive operation when `list` is empty,
* and adds items in batches to prevent V8 from hanging.
*
* @template {unknown} T
*   Item type.
* @param {Array<T>} list
*   List to operate on.
* @param {Array<T>} items
*   Items to add to `list`.
* @returns {Array<T>}
*   Either `list` or `items`.
*/
function push(list, items) {
	if (list.length > 0) {
		splice(list, list.length, 0, items);
		return list;
	}
	return items;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-combine-extensions@2.0.1/node_modules/micromark-util-combine-extensions/index.js
/**
* @import {
*   Extension,
*   Handles,
*   HtmlExtension,
*   NormalizedExtension
* } from 'micromark-util-types'
*/
var hasOwnProperty = {}.hasOwnProperty;
/**
* Combine multiple syntax extensions into one.
*
* @param {ReadonlyArray<Extension>} extensions
*   List of syntax extensions.
* @returns {NormalizedExtension}
*   A single combined extension.
*/
function combineExtensions(extensions) {
	/** @type {NormalizedExtension} */
	const all = {};
	let index = -1;
	while (++index < extensions.length) syntaxExtension(all, extensions[index]);
	return all;
}
/**
* Merge `extension` into `all`.
*
* @param {NormalizedExtension} all
*   Extension to merge into.
* @param {Extension} extension
*   Extension to merge.
* @returns {undefined}
*   Nothing.
*/
function syntaxExtension(all, extension) {
	/** @type {keyof Extension} */
	let hook;
	for (hook in extension) {
		/** @type {Record<string, unknown>} */
		const left = (hasOwnProperty.call(all, hook) ? all[hook] : void 0) || (all[hook] = {});
		/** @type {Record<string, unknown> | undefined} */
		const right = extension[hook];
		/** @type {string} */
		let code;
		if (right) for (code in right) {
			if (!hasOwnProperty.call(left, code)) left[code] = [];
			const value = right[code];
			constructs(left[code], Array.isArray(value) ? value : value ? [value] : []);
		}
	}
}
/**
* Merge `list` into `existing` (both lists of constructs).
* Mutates `existing`.
*
* @param {Array<unknown>} existing
*   List of constructs to merge into.
* @param {Array<unknown>} list
*   List of constructs to merge.
* @returns {undefined}
*   Nothing.
*/
function constructs(existing, list) {
	let index = -1;
	/** @type {Array<unknown>} */
	const before = [];
	while (++index < list.length) (list[index].add === "after" ? existing : before).push(list[index]);
	splice(existing, 0, 0, before);
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-autolink-literal@2.1.0/node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
/**
* @import {Code, ConstructRecord, Event, Extension, Previous, State, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
var wwwPrefix = {
	tokenize: tokenizeWwwPrefix,
	partial: true
};
var domain = {
	tokenize: tokenizeDomain,
	partial: true
};
var path = {
	tokenize: tokenizePath,
	partial: true
};
var trail = {
	tokenize: tokenizeTrail,
	partial: true
};
var emailDomainDotTrail = {
	tokenize: tokenizeEmailDomainDotTrail,
	partial: true
};
var wwwAutolink = {
	name: "wwwAutolink",
	tokenize: tokenizeWwwAutolink,
	previous: previousWww
};
var protocolAutolink = {
	name: "protocolAutolink",
	tokenize: tokenizeProtocolAutolink,
	previous: previousProtocol
};
var emailAutolink = {
	name: "emailAutolink",
	tokenize: tokenizeEmailAutolink,
	previous: previousEmail
};
/** @type {ConstructRecord} */
var text$3 = {};
/**
* Create an extension for `micromark` to support GitHub autolink literal
* syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   autolink literal syntax.
*/
function gfmAutolinkLiteral() {
	return { text: text$3 };
}
/** @type {Code} */
var code$1 = 48;
while (code$1 < 123) {
	text$3[code$1] = emailAutolink;
	code$1++;
	if (code$1 === 58) code$1 = 65;
	else if (code$1 === 91) code$1 = 97;
}
text$3[43] = emailAutolink;
text$3[45] = emailAutolink;
text$3[46] = emailAutolink;
text$3[95] = emailAutolink;
text$3[72] = [emailAutolink, protocolAutolink];
text$3[104] = [emailAutolink, protocolAutolink];
text$3[87] = [emailAutolink, wwwAutolink];
text$3[119] = [emailAutolink, wwwAutolink];
/**
* Email autolink literal.
*
* ```markdown
* > | a contact@example.org b
*       ^^^^^^^^^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeEmailAutolink(effects, ok, nok) {
	const self = this;
	/** @type {boolean | undefined} */
	let dot;
	/** @type {boolean} */
	let data;
	return start;
	/**
	* Start of email autolink literal.
	*
	* ```markdown
	* > | a contact@example.org b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		if (!gfmAtext(code) || !previousEmail.call(self, self.previous) || previousUnbalanced(self.events)) return nok(code);
		effects.enter("literalAutolink");
		effects.enter("literalAutolinkEmail");
		return atext(code);
	}
	/**
	* In email atext.
	*
	* ```markdown
	* > | a contact@example.org b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function atext(code) {
		if (gfmAtext(code)) {
			effects.consume(code);
			return atext;
		}
		if (code === 64) {
			effects.consume(code);
			return emailDomain;
		}
		return nok(code);
	}
	/**
	* In email domain.
	*
	* The reference code is a bit overly complex as it handles the `@`, of which
	* there may be just one.
	* Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L318>
	*
	* ```markdown
	* > | a contact@example.org b
	*               ^
	* ```
	*
	* @type {State}
	*/
	function emailDomain(code) {
		if (code === 46) return effects.check(emailDomainDotTrail, emailDomainAfter, emailDomainDot)(code);
		if (code === 45 || code === 95 || asciiAlphanumeric(code)) {
			data = true;
			effects.consume(code);
			return emailDomain;
		}
		return emailDomainAfter(code);
	}
	/**
	* In email domain, on dot that is not a trail.
	*
	* ```markdown
	* > | a contact@example.org b
	*                      ^
	* ```
	*
	* @type {State}
	*/
	function emailDomainDot(code) {
		effects.consume(code);
		dot = true;
		return emailDomain;
	}
	/**
	* After email domain.
	*
	* ```markdown
	* > | a contact@example.org b
	*                          ^
	* ```
	*
	* @type {State}
	*/
	function emailDomainAfter(code) {
		if (data && dot && asciiAlpha(self.previous)) {
			effects.exit("literalAutolinkEmail");
			effects.exit("literalAutolink");
			return ok(code);
		}
		return nok(code);
	}
}
/**
* `www` autolink literal.
*
* ```markdown
* > | a www.example.org b
*       ^^^^^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeWwwAutolink(effects, ok, nok) {
	const self = this;
	return wwwStart;
	/**
	* Start of www autolink literal.
	*
	* ```markdown
	* > | www.example.com/a?b#c
	*     ^
	* ```
	*
	* @type {State}
	*/
	function wwwStart(code) {
		if (code !== 87 && code !== 119 || !previousWww.call(self, self.previous) || previousUnbalanced(self.events)) return nok(code);
		effects.enter("literalAutolink");
		effects.enter("literalAutolinkWww");
		return effects.check(wwwPrefix, effects.attempt(domain, effects.attempt(path, wwwAfter), nok), nok)(code);
	}
	/**
	* After a www autolink literal.
	*
	* ```markdown
	* > | www.example.com/a?b#c
	*                          ^
	* ```
	*
	* @type {State}
	*/
	function wwwAfter(code) {
		effects.exit("literalAutolinkWww");
		effects.exit("literalAutolink");
		return ok(code);
	}
}
/**
* Protocol autolink literal.
*
* ```markdown
* > | a https://example.org b
*       ^^^^^^^^^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeProtocolAutolink(effects, ok, nok) {
	const self = this;
	let buffer = "";
	let seen = false;
	return protocolStart;
	/**
	* Start of protocol autolink literal.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*     ^
	* ```
	*
	* @type {State}
	*/
	function protocolStart(code) {
		if ((code === 72 || code === 104) && previousProtocol.call(self, self.previous) && !previousUnbalanced(self.events)) {
			effects.enter("literalAutolink");
			effects.enter("literalAutolinkHttp");
			buffer += String.fromCodePoint(code);
			effects.consume(code);
			return protocolPrefixInside;
		}
		return nok(code);
	}
	/**
	* In protocol.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*     ^^^^^
	* ```
	*
	* @type {State}
	*/
	function protocolPrefixInside(code) {
		if (asciiAlpha(code) && buffer.length < 5) {
			buffer += String.fromCodePoint(code);
			effects.consume(code);
			return protocolPrefixInside;
		}
		if (code === 58) {
			const protocol = buffer.toLowerCase();
			if (protocol === "http" || protocol === "https") {
				effects.consume(code);
				return protocolSlashesInside;
			}
		}
		return nok(code);
	}
	/**
	* In slashes.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*           ^^
	* ```
	*
	* @type {State}
	*/
	function protocolSlashesInside(code) {
		if (code === 47) {
			effects.consume(code);
			if (seen) return afterProtocol;
			seen = true;
			return protocolSlashesInside;
		}
		return nok(code);
	}
	/**
	* After protocol, before domain.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*             ^
	* ```
	*
	* @type {State}
	*/
	function afterProtocol(code) {
		return code === null || asciiControl(code) || markdownLineEndingOrSpace(code) || unicodeWhitespace(code) || unicodePunctuation(code) ? nok(code) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code);
	}
	/**
	* After a protocol autolink literal.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*                              ^
	* ```
	*
	* @type {State}
	*/
	function protocolAfter(code) {
		effects.exit("literalAutolinkHttp");
		effects.exit("literalAutolink");
		return ok(code);
	}
}
/**
* `www` prefix.
*
* ```markdown
* > | a www.example.org b
*       ^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeWwwPrefix(effects, ok, nok) {
	let size = 0;
	return wwwPrefixInside;
	/**
	* In www prefix.
	*
	* ```markdown
	* > | www.example.com
	*     ^^^^
	* ```
	*
	* @type {State}
	*/
	function wwwPrefixInside(code) {
		if ((code === 87 || code === 119) && size < 3) {
			size++;
			effects.consume(code);
			return wwwPrefixInside;
		}
		if (code === 46 && size === 3) {
			effects.consume(code);
			return wwwPrefixAfter;
		}
		return nok(code);
	}
	/**
	* After www prefix.
	*
	* ```markdown
	* > | www.example.com
	*         ^
	* ```
	*
	* @type {State}
	*/
	function wwwPrefixAfter(code) {
		return code === null ? nok(code) : ok(code);
	}
}
/**
* Domain.
*
* ```markdown
* > | a https://example.org b
*               ^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeDomain(effects, ok, nok) {
	/** @type {boolean | undefined} */
	let underscoreInLastSegment;
	/** @type {boolean | undefined} */
	let underscoreInLastLastSegment;
	/** @type {boolean | undefined} */
	let seen;
	return domainInside;
	/**
	* In domain.
	*
	* ```markdown
	* > | https://example.com/a
	*             ^^^^^^^^^^^
	* ```
	*
	* @type {State}
	*/
	function domainInside(code) {
		if (code === 46 || code === 95) return effects.check(trail, domainAfter, domainAtPunctuation)(code);
		if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code) || code !== 45 && unicodePunctuation(code)) return domainAfter(code);
		seen = true;
		effects.consume(code);
		return domainInside;
	}
	/**
	* In domain, at potential trailing punctuation, that was not trailing.
	*
	* ```markdown
	* > | https://example.com
	*                    ^
	* ```
	*
	* @type {State}
	*/
	function domainAtPunctuation(code) {
		if (code === 95) underscoreInLastSegment = true;
		else {
			underscoreInLastLastSegment = underscoreInLastSegment;
			underscoreInLastSegment = void 0;
		}
		effects.consume(code);
		return domainInside;
	}
	/**
	* After domain.
	*
	* ```markdown
	* > | https://example.com/a
	*                        ^
	* ```
	*
	* @type {State} */
	function domainAfter(code) {
		if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) return nok(code);
		return ok(code);
	}
}
/**
* Path.
*
* ```markdown
* > | a https://example.org/stuff b
*                          ^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizePath(effects, ok) {
	let sizeOpen = 0;
	let sizeClose = 0;
	return pathInside;
	/**
	* In path.
	*
	* ```markdown
	* > | https://example.com/a
	*                        ^^
	* ```
	*
	* @type {State}
	*/
	function pathInside(code) {
		if (code === 40) {
			sizeOpen++;
			effects.consume(code);
			return pathInside;
		}
		if (code === 41 && sizeClose < sizeOpen) return pathAtPunctuation(code);
		if (code === 33 || code === 34 || code === 38 || code === 39 || code === 41 || code === 42 || code === 44 || code === 46 || code === 58 || code === 59 || code === 60 || code === 63 || code === 93 || code === 95 || code === 126) return effects.check(trail, ok, pathAtPunctuation)(code);
		if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return ok(code);
		effects.consume(code);
		return pathInside;
	}
	/**
	* In path, at potential trailing punctuation, that was not trailing.
	*
	* ```markdown
	* > | https://example.com/a"b
	*                          ^
	* ```
	*
	* @type {State}
	*/
	function pathAtPunctuation(code) {
		if (code === 41) sizeClose++;
		effects.consume(code);
		return pathInside;
	}
}
/**
* Trail.
*
* This calls `ok` if this *is* the trail, followed by an end, which means
* the entire trail is not part of the link.
* It calls `nok` if this *is* part of the link.
*
* ```markdown
* > | https://example.com").
*                        ^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTrail(effects, ok, nok) {
	return trail;
	/**
	* In trail of domain or path.
	*
	* ```markdown
	* > | https://example.com").
	*                        ^
	* ```
	*
	* @type {State}
	*/
	function trail(code) {
		if (code === 33 || code === 34 || code === 39 || code === 41 || code === 42 || code === 44 || code === 46 || code === 58 || code === 59 || code === 63 || code === 95 || code === 126) {
			effects.consume(code);
			return trail;
		}
		if (code === 38) {
			effects.consume(code);
			return trailCharacterReferenceStart;
		}
		if (code === 93) {
			effects.consume(code);
			return trailBracketAfter;
		}
		if (code === 60 || code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return ok(code);
		return nok(code);
	}
	/**
	* In trail, after `]`.
	*
	* > 👉 **Note**: this deviates from `cmark-gfm` to fix a bug.
	* > See end of <https://github.com/github/cmark-gfm/issues/278> for more.
	*
	* ```markdown
	* > | https://example.com](
	*                         ^
	* ```
	*
	* @type {State}
	*/
	function trailBracketAfter(code) {
		if (code === null || code === 40 || code === 91 || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return ok(code);
		return trail(code);
	}
	/**
	* In character-reference like trail, after `&`.
	*
	* ```markdown
	* > | https://example.com&amp;).
	*                         ^
	* ```
	*
	* @type {State}
	*/
	function trailCharacterReferenceStart(code) {
		return asciiAlpha(code) ? trailCharacterReferenceInside(code) : nok(code);
	}
	/**
	* In character-reference like trail.
	*
	* ```markdown
	* > | https://example.com&amp;).
	*                         ^
	* ```
	*
	* @type {State}
	*/
	function trailCharacterReferenceInside(code) {
		if (code === 59) {
			effects.consume(code);
			return trail;
		}
		if (asciiAlpha(code)) {
			effects.consume(code);
			return trailCharacterReferenceInside;
		}
		return nok(code);
	}
}
/**
* Dot in email domain trail.
*
* This calls `ok` if this *is* the trail, followed by an end, which means
* the trail is not part of the link.
* It calls `nok` if this *is* part of the link.
*
* ```markdown
* > | contact@example.org.
*                        ^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeEmailDomainDotTrail(effects, ok, nok) {
	return start;
	/**
	* Dot.
	*
	* ```markdown
	* > | contact@example.org.
	*                    ^   ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.consume(code);
		return after;
	}
	/**
	* After dot.
	*
	* ```markdown
	* > | contact@example.org.
	*                     ^   ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		return asciiAlphanumeric(code) ? nok(code) : ok(code);
	}
}
/**
* See:
* <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L156>.
*
* @type {Previous}
*/
function previousWww(code) {
	return code === null || code === 40 || code === 42 || code === 95 || code === 91 || code === 93 || code === 126 || markdownLineEndingOrSpace(code);
}
/**
* See:
* <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L214>.
*
* @type {Previous}
*/
function previousProtocol(code) {
	return !asciiAlpha(code);
}
/**
* @this {TokenizeContext}
* @type {Previous}
*/
function previousEmail(code) {
	return !(code === 47 || gfmAtext(code));
}
/**
* @param {Code} code
* @returns {boolean}
*/
function gfmAtext(code) {
	return code === 43 || code === 45 || code === 46 || code === 95 || asciiAlphanumeric(code);
}
/**
* @param {Array<Event>} events
* @returns {boolean}
*/
function previousUnbalanced(events) {
	let index = events.length;
	let result = false;
	while (index--) {
		const token = events[index][1];
		if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
			result = true;
			break;
		}
		if (token._gfmAutolinkLiteralWalkedInto) {
			result = false;
			break;
		}
	}
	if (events.length > 0 && !result) events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-sanitize-uri@2.0.1/node_modules/micromark-util-sanitize-uri/index.js
/**
* Normalize a URL.
*
* Encode unsafe characters with percent-encoding, skipping already encoded
* sequences.
*
* @param {string} value
*   URI to normalize.
* @returns {string}
*   Normalized URI.
*/
function normalizeUri(value) {
	/** @type {Array<string>} */
	const result = [];
	let index = -1;
	let start = 0;
	let skip = 0;
	while (++index < value.length) {
		const code = value.charCodeAt(index);
		/** @type {string} */
		let replace = "";
		if (code === 37 && asciiAlphanumeric(value.charCodeAt(index + 1)) && asciiAlphanumeric(value.charCodeAt(index + 2))) skip = 2;
		else if (code < 128) {
			if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) replace = String.fromCharCode(code);
		} else if (code > 55295 && code < 57344) {
			const next = value.charCodeAt(index + 1);
			if (code < 56320 && next > 56319 && next < 57344) {
				replace = String.fromCharCode(code, next);
				skip = 1;
			} else replace = "�";
		} else replace = String.fromCharCode(code);
		if (replace) {
			result.push(value.slice(start, index), encodeURIComponent(replace));
			start = index + skip + 1;
			replace = "";
		}
		if (skip) {
			index += skip;
			skip = 0;
		}
	}
	return result.join("") + value.slice(start);
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-resolve-all@2.0.1/node_modules/micromark-util-resolve-all/index.js
/**
* @import {Event, Resolver, TokenizeContext} from 'micromark-util-types'
*/
/**
* Call all `resolveAll`s.
*
* @param {ReadonlyArray<{resolveAll?: Resolver | undefined}>} constructs
*   List of constructs, optionally with `resolveAll`s.
* @param {Array<Event>} events
*   List of events.
* @param {TokenizeContext} context
*   Context used by `tokenize`.
* @returns {Array<Event>}
*   Changed events.
*/
function resolveAll(constructs, events, context) {
	/** @type {Array<Resolver>} */
	const called = [];
	let index = -1;
	while (++index < constructs.length) {
		const resolve = constructs[index].resolveAll;
		if (resolve && !called.includes(resolve)) {
			events = resolve(events, context);
			called.push(resolve);
		}
	}
	return events;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/attention.js
/**
* @import {
*   Code,
*   Construct,
*   Event,
*   Point,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer,
*   Token
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var attention = {
	name: "attention",
	resolveAll: resolveAllAttention,
	tokenize: tokenizeAttention
};
/**
* Take all events and resolve attention to emphasis or strong.
*
* @type {Resolver}
*/
function resolveAllAttention(events, context) {
	let index = -1;
	/** @type {number} */
	let open;
	/** @type {Token} */
	let group;
	/** @type {Token} */
	let text;
	/** @type {Token} */
	let openingSequence;
	/** @type {Token} */
	let closingSequence;
	/** @type {number} */
	let use;
	/** @type {Array<Event>} */
	let nextEvents;
	/** @type {number} */
	let offset;
	while (++index < events.length) if (events[index][0] === "enter" && events[index][1].type === "attentionSequence" && events[index][1]._close) {
		open = index;
		while (open--) if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
			if ((events[open][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) continue;
			use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
			const start = { ...events[open][1].end };
			const end = { ...events[index][1].start };
			movePoint(start, -use);
			movePoint(end, use);
			openingSequence = {
				type: use > 1 ? "strongSequence" : "emphasisSequence",
				start,
				end: { ...events[open][1].end }
			};
			closingSequence = {
				type: use > 1 ? "strongSequence" : "emphasisSequence",
				start: { ...events[index][1].start },
				end
			};
			text = {
				type: use > 1 ? "strongText" : "emphasisText",
				start: { ...events[open][1].end },
				end: { ...events[index][1].start }
			};
			group = {
				type: use > 1 ? "strong" : "emphasis",
				start: { ...openingSequence.start },
				end: { ...closingSequence.end }
			};
			events[open][1].end = { ...openingSequence.start };
			events[index][1].start = { ...closingSequence.end };
			nextEvents = [];
			if (events[open][1].end.offset - events[open][1].start.offset) nextEvents = push(nextEvents, [[
				"enter",
				events[open][1],
				context
			], [
				"exit",
				events[open][1],
				context
			]]);
			nextEvents = push(nextEvents, [
				[
					"enter",
					group,
					context
				],
				[
					"enter",
					openingSequence,
					context
				],
				[
					"exit",
					openingSequence,
					context
				],
				[
					"enter",
					text,
					context
				]
			]);
			nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context));
			nextEvents = push(nextEvents, [
				[
					"exit",
					text,
					context
				],
				[
					"enter",
					closingSequence,
					context
				],
				[
					"exit",
					closingSequence,
					context
				],
				[
					"exit",
					group,
					context
				]
			]);
			if (events[index][1].end.offset - events[index][1].start.offset) {
				offset = 2;
				nextEvents = push(nextEvents, [[
					"enter",
					events[index][1],
					context
				], [
					"exit",
					events[index][1],
					context
				]]);
			} else offset = 0;
			splice(events, open - 1, index - open + 3, nextEvents);
			index = open + nextEvents.length - offset - 2;
			break;
		}
	}
	index = -1;
	while (++index < events.length) if (events[index][1].type === "attentionSequence") events[index][1].type = "data";
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeAttention(effects, ok) {
	const attentionMarkers = this.parser.constructs.attentionMarkers.null;
	const previous = this.previous;
	const before = classifyCharacter(previous);
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Before a sequence.
	*
	* ```markdown
	* > | **
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		marker = code;
		effects.enter("attentionSequence");
		return inside(code);
	}
	/**
	* In a sequence.
	*
	* ```markdown
	* > | **
	*     ^^
	* ```
	*
	* @type {State}
	*/
	function inside(code) {
		if (code === marker) {
			effects.consume(code);
			return inside;
		}
		const token = effects.exit("attentionSequence");
		const after = classifyCharacter(code);
		const open = !after || after === 2 && before || attentionMarkers.includes(code);
		const close = !before || before === 2 && after || attentionMarkers.includes(previous);
		token._open = Boolean(marker === 42 ? open : open && (before || !close));
		token._close = Boolean(marker === 42 ? close : close && (after || !open));
		return ok(code);
	}
}
/**
* Move a point a bit.
*
* Note: `move` only works inside lines! It’s not possible to move past other
* chunks (replacement characters, tabs, or line endings).
*
* @param {Point} point
*   Point.
* @param {number} offset
*   Amount to move.
* @returns {undefined}
*   Nothing.
*/
function movePoint(point, offset) {
	point.column += offset;
	point.offset += offset;
	point._bufferIndex += offset;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/autolink.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var autolink = {
	name: "autolink",
	tokenize: tokenizeAutolink
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeAutolink(effects, ok, nok) {
	let size = 0;
	return start;
	/**
	* Start of an autolink.
	*
	* ```markdown
	* > | a<https://example.com>b
	*      ^
	* > | a<user@example.com>b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("autolink");
		effects.enter("autolinkMarker");
		effects.consume(code);
		effects.exit("autolinkMarker");
		effects.enter("autolinkProtocol");
		return open;
	}
	/**
	* After `<`, at protocol or atext.
	*
	* ```markdown
	* > | a<https://example.com>b
	*       ^
	* > | a<user@example.com>b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function open(code) {
		if (asciiAlpha(code)) {
			effects.consume(code);
			return schemeOrEmailAtext;
		}
		if (code === 64) return nok(code);
		return emailAtext(code);
	}
	/**
	* At second byte of protocol or atext.
	*
	* ```markdown
	* > | a<https://example.com>b
	*        ^
	* > | a<user@example.com>b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function schemeOrEmailAtext(code) {
		if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
			size = 1;
			return schemeInsideOrEmailAtext(code);
		}
		return emailAtext(code);
	}
	/**
	* In ambiguous protocol or atext.
	*
	* ```markdown
	* > | a<https://example.com>b
	*        ^
	* > | a<user@example.com>b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function schemeInsideOrEmailAtext(code) {
		if (code === 58) {
			effects.consume(code);
			size = 0;
			return urlInside;
		}
		if ((code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32) {
			effects.consume(code);
			return schemeInsideOrEmailAtext;
		}
		size = 0;
		return emailAtext(code);
	}
	/**
	* After protocol, in URL.
	*
	* ```markdown
	* > | a<https://example.com>b
	*             ^
	* ```
	*
	* @type {State}
	*/
	function urlInside(code) {
		if (code === 62) {
			effects.exit("autolinkProtocol");
			effects.enter("autolinkMarker");
			effects.consume(code);
			effects.exit("autolinkMarker");
			effects.exit("autolink");
			return ok;
		}
		if (code === null || code === 32 || code === 60 || asciiControl(code)) return nok(code);
		effects.consume(code);
		return urlInside;
	}
	/**
	* In email atext.
	*
	* ```markdown
	* > | a<user.name@example.com>b
	*              ^
	* ```
	*
	* @type {State}
	*/
	function emailAtext(code) {
		if (code === 64) {
			effects.consume(code);
			return emailAtSignOrDot;
		}
		if (asciiAtext(code)) {
			effects.consume(code);
			return emailAtext;
		}
		return nok(code);
	}
	/**
	* In label, after at-sign or dot.
	*
	* ```markdown
	* > | a<user.name@example.com>b
	*                 ^       ^
	* ```
	*
	* @type {State}
	*/
	function emailAtSignOrDot(code) {
		return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
	}
	/**
	* In label, where `.` and `>` are allowed.
	*
	* ```markdown
	* > | a<user.name@example.com>b
	*                   ^
	* ```
	*
	* @type {State}
	*/
	function emailLabel(code) {
		if (code === 46) {
			effects.consume(code);
			size = 0;
			return emailAtSignOrDot;
		}
		if (code === 62) {
			effects.exit("autolinkProtocol").type = "autolinkEmail";
			effects.enter("autolinkMarker");
			effects.consume(code);
			effects.exit("autolinkMarker");
			effects.exit("autolink");
			return ok;
		}
		return emailValue(code);
	}
	/**
	* In label, where `.` and `>` are *not* allowed.
	*
	* Though, this is also used in `emailLabel` to parse other values.
	*
	* ```markdown
	* > | a<user.name@ex-ample.com>b
	*                    ^
	* ```
	*
	* @type {State}
	*/
	function emailValue(code) {
		if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
			const next = code === 45 ? emailValue : emailLabel;
			effects.consume(code);
			return next;
		}
		return nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-factory-space@2.0.1/node_modules/micromark-factory-space/index.js
/**
* @import {Effects, State, TokenType} from 'micromark-util-types'
*/
/**
* Parse spaces and tabs.
*
* There is no `nok` parameter:
*
* *   spaces in markdown are often optional, in which case this factory can be
*     used and `ok` will be switched to whether spaces were found or not
* *   one line ending or space can be detected with `markdownSpace(code)` right
*     before using `factorySpace`
*
* ###### Examples
*
* Where `␉` represents a tab (plus how much it expands) and `␠` represents a
* single space.
*
* ```markdown
* ␉
* ␠␠␠␠
* ␉␠
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {TokenType} type
*   Type (`' \t'`).
* @param {number | undefined} [max=Infinity]
*   Max (exclusive).
* @returns {State}
*   Start state.
*/
function factorySpace(effects, ok, type, max) {
	const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
	let size = 0;
	return start;
	/** @type {State} */
	function start(code) {
		if (markdownSpace(code)) {
			effects.enter(type);
			return prefix(code);
		}
		return ok(code);
	}
	/** @type {State} */
	function prefix(code) {
		if (markdownSpace(code) && size++ < limit) {
			effects.consume(code);
			return prefix;
		}
		effects.exit(type);
		return ok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/blank-line.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var blankLine = {
	partial: true,
	tokenize: tokenizeBlankLine
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlankLine(effects, ok, nok) {
	return start;
	/**
	* Start of blank line.
	*
	* > 👉 **Note**: `␠` represents a space character.
	*
	* ```markdown
	* > | ␠␠␊
	*     ^
	* > | ␊
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		return markdownSpace(code) ? factorySpace(effects, after, "linePrefix")(code) : after(code);
	}
	/**
	* At eof/eol, after optional whitespace.
	*
	* > 👉 **Note**: `␠` represents a space character.
	*
	* ```markdown
	* > | ␠␠␊
	*       ^
	* > | ␊
	*     ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/block-quote.js
/**
* @import {
*   Construct,
*   Exiter,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var blockQuote = {
	continuation: { tokenize: tokenizeBlockQuoteContinuation },
	exit,
	name: "blockQuote",
	tokenize: tokenizeBlockQuoteStart
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlockQuoteStart(effects, ok, nok) {
	const self = this;
	return start;
	/**
	* Start of block quote.
	*
	* ```markdown
	* > | > a
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		if (code === 62) {
			const state = self.containerState;
			if (!state.open) {
				effects.enter("blockQuote", { _container: true });
				state.open = true;
			}
			effects.enter("blockQuotePrefix");
			effects.enter("blockQuoteMarker");
			effects.consume(code);
			effects.exit("blockQuoteMarker");
			return after;
		}
		return nok(code);
	}
	/**
	* After `>`, before optional whitespace.
	*
	* ```markdown
	* > | > a
	*      ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		if (markdownSpace(code)) {
			effects.enter("blockQuotePrefixWhitespace");
			effects.consume(code);
			effects.exit("blockQuotePrefixWhitespace");
			effects.exit("blockQuotePrefix");
			return ok;
		}
		effects.exit("blockQuotePrefix");
		return ok(code);
	}
}
/**
* Start of block quote continuation.
*
* ```markdown
*   | > a
* > | > b
*     ^
* ```
*
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
	const self = this;
	return contStart;
	/**
	* Start of block quote continuation.
	*
	* Also used to parse the first block quote opening.
	*
	* ```markdown
	*   | > a
	* > | > b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function contStart(code) {
		if (markdownSpace(code)) return factorySpace(effects, contBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
		return contBefore(code);
	}
	/**
	* At `>`, after optional whitespace.
	*
	* Also used to parse the first block quote opening.
	*
	* ```markdown
	*   | > a
	* > | > b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function contBefore(code) {
		return effects.attempt(blockQuote, ok, nok)(code);
	}
}
/** @type {Exiter} */
function exit(effects) {
	effects.exit("blockQuote");
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/character-escape.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var characterEscape = {
	name: "characterEscape",
	tokenize: tokenizeCharacterEscape
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCharacterEscape(effects, ok, nok) {
	return start;
	/**
	* Start of character escape.
	*
	* ```markdown
	* > | a\*b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("characterEscape");
		effects.enter("escapeMarker");
		effects.consume(code);
		effects.exit("escapeMarker");
		return inside;
	}
	/**
	* After `\`, at punctuation.
	*
	* ```markdown
	* > | a\*b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function inside(code) {
		if (asciiPunctuation(code)) {
			effects.enter("characterEscapeValue");
			effects.consume(code);
			effects.exit("characterEscapeValue");
			effects.exit("characterEscape");
			return ok;
		}
		return nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/character-reference.js
/**
* @import {
*   Code,
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var characterReference = {
	name: "characterReference",
	tokenize: tokenizeCharacterReference
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCharacterReference(effects, ok, nok) {
	const self = this;
	let size = 0;
	/** @type {number} */
	let max;
	/** @type {(code: Code) => boolean} */
	let test;
	return start;
	/**
	* Start of character reference.
	*
	* ```markdown
	* > | a&amp;b
	*      ^
	* > | a&#123;b
	*      ^
	* > | a&#x9;b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("characterReference");
		effects.enter("characterReferenceMarker");
		effects.consume(code);
		effects.exit("characterReferenceMarker");
		return open;
	}
	/**
	* After `&`, at `#` for numeric references or alphanumeric for named
	* references.
	*
	* ```markdown
	* > | a&amp;b
	*       ^
	* > | a&#123;b
	*       ^
	* > | a&#x9;b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function open(code) {
		if (code === 35) {
			effects.enter("characterReferenceMarkerNumeric");
			effects.consume(code);
			effects.exit("characterReferenceMarkerNumeric");
			return numeric;
		}
		effects.enter("characterReferenceValue");
		max = 31;
		test = asciiAlphanumeric;
		return value(code);
	}
	/**
	* After `#`, at `x` for hexadecimals or digit for decimals.
	*
	* ```markdown
	* > | a&#123;b
	*        ^
	* > | a&#x9;b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function numeric(code) {
		if (code === 88 || code === 120) {
			effects.enter("characterReferenceMarkerHexadecimal");
			effects.consume(code);
			effects.exit("characterReferenceMarkerHexadecimal");
			effects.enter("characterReferenceValue");
			max = 6;
			test = asciiHexDigit;
			return value;
		}
		effects.enter("characterReferenceValue");
		max = 7;
		test = asciiDigit;
		return value(code);
	}
	/**
	* After markers (`&#x`, `&#`, or `&`), in value, before `;`.
	*
	* The character reference kind defines what and how many characters are
	* allowed.
	*
	* ```markdown
	* > | a&amp;b
	*       ^^^
	* > | a&#123;b
	*        ^^^
	* > | a&#x9;b
	*         ^
	* ```
	*
	* @type {State}
	*/
	function value(code) {
		if (code === 59 && size) {
			const token = effects.exit("characterReferenceValue");
			if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token))) return nok(code);
			effects.enter("characterReferenceMarker");
			effects.consume(code);
			effects.exit("characterReferenceMarker");
			effects.exit("characterReference");
			return ok;
		}
		if (test(code) && size++ < max) {
			effects.consume(code);
			return value;
		}
		return nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-fenced.js
/**
* @import {
*   Code,
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var nonLazyContinuation = {
	partial: true,
	tokenize: tokenizeNonLazyContinuation
};
/** @type {Construct} */
var codeFenced = {
	concrete: true,
	name: "codeFenced",
	tokenize: tokenizeCodeFenced
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCodeFenced(effects, ok, nok) {
	const self = this;
	/** @type {Construct} */
	const closeStart = {
		partial: true,
		tokenize: tokenizeCloseStart
	};
	let initialPrefix = 0;
	let sizeOpen = 0;
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Start of code.
	*
	* ```markdown
	* > | ~~~js
	*     ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		return beforeSequenceOpen(code);
	}
	/**
	* In opening fence, after prefix, at sequence.
	*
	* ```markdown
	* > | ~~~js
	*     ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function beforeSequenceOpen(code) {
		const tail = self.events[self.events.length - 1];
		initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
		marker = code;
		effects.enter("codeFenced");
		effects.enter("codeFencedFence");
		effects.enter("codeFencedFenceSequence");
		return sequenceOpen(code);
	}
	/**
	* In opening fence sequence.
	*
	* ```markdown
	* > | ~~~js
	*      ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code) {
		if (code === marker) {
			sizeOpen++;
			effects.consume(code);
			return sequenceOpen;
		}
		if (sizeOpen < 3) return nok(code);
		effects.exit("codeFencedFenceSequence");
		return markdownSpace(code) ? factorySpace(effects, infoBefore, "whitespace")(code) : infoBefore(code);
	}
	/**
	* In opening fence, after the sequence (and optional whitespace), before info.
	*
	* ```markdown
	* > | ~~~js
	*        ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function infoBefore(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("codeFencedFence");
			return self.interrupt ? ok(code) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
		}
		effects.enter("codeFencedFenceInfo");
		effects.enter("chunkString", { contentType: "string" });
		return info(code);
	}
	/**
	* In info.
	*
	* ```markdown
	* > | ~~~js
	*        ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function info(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("chunkString");
			effects.exit("codeFencedFenceInfo");
			return infoBefore(code);
		}
		if (markdownSpace(code)) {
			effects.exit("chunkString");
			effects.exit("codeFencedFenceInfo");
			return factorySpace(effects, metaBefore, "whitespace")(code);
		}
		if (code === 96 && code === marker) return nok(code);
		effects.consume(code);
		return info;
	}
	/**
	* In opening fence, after info and whitespace, before meta.
	*
	* ```markdown
	* > | ~~~js eval
	*           ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function metaBefore(code) {
		if (code === null || markdownLineEnding(code)) return infoBefore(code);
		effects.enter("codeFencedFenceMeta");
		effects.enter("chunkString", { contentType: "string" });
		return meta(code);
	}
	/**
	* In meta.
	*
	* ```markdown
	* > | ~~~js eval
	*           ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function meta(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("chunkString");
			effects.exit("codeFencedFenceMeta");
			return infoBefore(code);
		}
		if (code === 96 && code === marker) return nok(code);
		effects.consume(code);
		return meta;
	}
	/**
	* At eol/eof in code, before a non-lazy closing fence or content.
	*
	* ```markdown
	* > | ~~~js
	*          ^
	* > | alert(1)
	*             ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function atNonLazyBreak(code) {
		return effects.attempt(closeStart, after, contentBefore)(code);
	}
	/**
	* Before code content, not a closing fence, at eol.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*             ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function contentBefore(code) {
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return contentStart;
	}
	/**
	* Before code content, not a closing fence.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*     ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function contentStart(code) {
		return initialPrefix > 0 && markdownSpace(code) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code) : beforeContentChunk(code);
	}
	/**
	* Before code content, after optional prefix.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*     ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function beforeContentChunk(code) {
		if (code === null || markdownLineEnding(code)) return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
		effects.enter("codeFlowValue");
		return contentChunk(code);
	}
	/**
	* In code content.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*     ^^^^^^^^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function contentChunk(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("codeFlowValue");
			return beforeContentChunk(code);
		}
		effects.consume(code);
		return contentChunk;
	}
	/**
	* After code.
	*
	* ```markdown
	*   | ~~~js
	*   | alert(1)
	* > | ~~~
	*        ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		effects.exit("codeFenced");
		return ok(code);
	}
	/**
	* @this {TokenizeContext}
	*   Context.
	* @type {Tokenizer}
	*/
	function tokenizeCloseStart(effects, ok, nok) {
		let size = 0;
		return startBefore;
		/**
		*
		*
		* @type {State}
		*/
		function startBefore(code) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return start;
		}
		/**
		* Before closing fence, at optional whitespace.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*     ^
		* ```
		*
		* @type {State}
		*/
		function start(code) {
			effects.enter("codeFencedFence");
			return markdownSpace(code) ? factorySpace(effects, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : beforeSequenceClose(code);
		}
		/**
		* In closing fence, after optional whitespace, at sequence.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*     ^
		* ```
		*
		* @type {State}
		*/
		function beforeSequenceClose(code) {
			if (code === marker) {
				effects.enter("codeFencedFenceSequence");
				return sequenceClose(code);
			}
			return nok(code);
		}
		/**
		* In closing fence sequence.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*     ^
		* ```
		*
		* @type {State}
		*/
		function sequenceClose(code) {
			if (code === marker) {
				size++;
				effects.consume(code);
				return sequenceClose;
			}
			if (size >= sizeOpen) {
				effects.exit("codeFencedFenceSequence");
				return markdownSpace(code) ? factorySpace(effects, sequenceCloseAfter, "whitespace")(code) : sequenceCloseAfter(code);
			}
			return nok(code);
		}
		/**
		* After closing fence sequence, after optional whitespace.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*        ^
		* ```
		*
		* @type {State}
		*/
		function sequenceCloseAfter(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("codeFencedFence");
				return ok(code);
			}
			return nok(code);
		}
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeNonLazyContinuation(effects, ok, nok) {
	const self = this;
	return start;
	/**
	*
	*
	* @type {State}
	*/
	function start(code) {
		if (code === null) return nok(code);
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return lineStart;
	}
	/**
	*
	*
	* @type {State}
	*/
	function lineStart(code) {
		return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-indented.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var codeIndented = {
	name: "codeIndented",
	tokenize: tokenizeCodeIndented
};
/** @type {Construct} */
var furtherStart = {
	partial: true,
	tokenize: tokenizeFurtherStart
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCodeIndented(effects, ok, nok) {
	const self = this;
	return start;
	/**
	* Start of code (indented).
	*
	* > **Parsing note**: it is not needed to check if this first line is a
	* > filled line (that it has a non-whitespace character), because blank lines
	* > are parsed already, so we never run into that.
	*
	* ```markdown
	* > |     aaa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("codeIndented");
		return factorySpace(effects, afterPrefix, "linePrefix", 5)(code);
	}
	/**
	* At start, after 1 or 4 spaces.
	*
	* ```markdown
	* > |     aaa
	*         ^
	* ```
	*
	* @type {State}
	*/
	function afterPrefix(code) {
		const tail = self.events[self.events.length - 1];
		return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code) : nok(code);
	}
	/**
	* At a break.
	*
	* ```markdown
	* > |     aaa
	*         ^  ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code) {
		if (code === null) return after(code);
		if (markdownLineEnding(code)) return effects.attempt(furtherStart, atBreak, after)(code);
		effects.enter("codeFlowValue");
		return inside(code);
	}
	/**
	* In code content.
	*
	* ```markdown
	* > |     aaa
	*         ^^^^
	* ```
	*
	* @type {State}
	*/
	function inside(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("codeFlowValue");
			return atBreak(code);
		}
		effects.consume(code);
		return inside;
	}
	/** @type {State} */
	function after(code) {
		effects.exit("codeIndented");
		return ok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeFurtherStart(effects, ok, nok) {
	const self = this;
	return furtherStart;
	/**
	* At eol, trying to parse another indent.
	*
	* ```markdown
	* > |     aaa
	*            ^
	*   |     bbb
	* ```
	*
	* @type {State}
	*/
	function furtherStart(code) {
		if (self.parser.lazy[self.now().line]) return nok(code);
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return furtherStart;
		}
		return factorySpace(effects, afterPrefix, "linePrefix", 5)(code);
	}
	/**
	* At start, after 1 or 4 spaces.
	*
	* ```markdown
	* > |     aaa
	*         ^
	* ```
	*
	* @type {State}
	*/
	function afterPrefix(code) {
		const tail = self.events[self.events.length - 1];
		return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok(code) : markdownLineEnding(code) ? furtherStart(code) : nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-text.js
/**
* @import {
*   Construct,
*   Previous,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer,
*   Token
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var codeText = {
	name: "codeText",
	previous,
	resolve: resolveCodeText,
	tokenize: tokenizeCodeText
};
/** @type {Resolver} */
function resolveCodeText(events) {
	let tailExitIndex = events.length - 4;
	let headEnterIndex = 3;
	/** @type {number} */
	let index;
	/** @type {number | undefined} */
	let enter;
	if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
		index = headEnterIndex;
		while (++index < tailExitIndex) if (events[index][1].type === "codeTextData") {
			events[headEnterIndex][1].type = "codeTextPadding";
			events[tailExitIndex][1].type = "codeTextPadding";
			headEnterIndex += 2;
			tailExitIndex -= 2;
			break;
		}
	}
	index = headEnterIndex - 1;
	tailExitIndex++;
	while (++index <= tailExitIndex) if (enter === void 0) {
		if (index !== tailExitIndex && events[index][1].type !== "lineEnding") enter = index;
	} else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
		events[enter][1].type = "codeTextData";
		if (index !== enter + 2) {
			events[enter][1].end = events[index - 1][1].end;
			events.splice(enter + 2, index - enter - 2);
			tailExitIndex -= index - enter - 2;
			index = enter + 2;
		}
		enter = void 0;
	}
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Previous}
*/
function previous(code) {
	return code !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCodeText(effects, ok, nok) {
	let sizeOpen = 0;
	/** @type {number} */
	let size;
	/** @type {Token} */
	let token;
	return start;
	/**
	* Start of code (text).
	*
	* ```markdown
	* > | `a`
	*     ^
	* > | \`a`
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("codeText");
		effects.enter("codeTextSequence");
		return sequenceOpen(code);
	}
	/**
	* In opening sequence.
	*
	* ```markdown
	* > | `a`
	*     ^
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code) {
		if (code === 96) {
			effects.consume(code);
			sizeOpen++;
			return sequenceOpen;
		}
		effects.exit("codeTextSequence");
		return between(code);
	}
	/**
	* Between something and something else.
	*
	* ```markdown
	* > | `a`
	*      ^^
	* ```
	*
	* @type {State}
	*/
	function between(code) {
		if (code === null) return nok(code);
		if (code === 32) {
			effects.enter("space");
			effects.consume(code);
			effects.exit("space");
			return between;
		}
		if (code === 96) {
			token = effects.enter("codeTextSequence");
			size = 0;
			return sequenceClose(code);
		}
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return between;
		}
		effects.enter("codeTextData");
		return data(code);
	}
	/**
	* In data.
	*
	* ```markdown
	* > | `a`
	*      ^
	* ```
	*
	* @type {State}
	*/
	function data(code) {
		if (code === null || code === 32 || code === 96 || markdownLineEnding(code)) {
			effects.exit("codeTextData");
			return between(code);
		}
		effects.consume(code);
		return data;
	}
	/**
	* In closing sequence.
	*
	* ```markdown
	* > | `a`
	*       ^
	* ```
	*
	* @type {State}
	*/
	function sequenceClose(code) {
		if (code === 96) {
			effects.consume(code);
			size++;
			return sequenceClose;
		}
		if (size === sizeOpen) {
			effects.exit("codeTextSequence");
			effects.exit("codeText");
			return ok(code);
		}
		token.type = "codeTextData";
		return data(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-subtokenize@2.1.0/node_modules/micromark-util-subtokenize/lib/splice-buffer.js
/**
* Some of the internal operations of micromark do lots of editing
* operations on very large arrays. This runs into problems with two
* properties of most circa-2020 JavaScript interpreters:
*
*  - Array-length modifications at the high end of an array (push/pop) are
*    expected to be common and are implemented in (amortized) time
*    proportional to the number of elements added or removed, whereas
*    other operations (shift/unshift and splice) are much less efficient.
*  - Function arguments are passed on the stack, so adding tens of thousands
*    of elements to an array with `arr.push(...newElements)` will frequently
*    cause stack overflows. (see <https://stackoverflow.com/questions/22123769/rangeerror-maximum-call-stack-size-exceeded-why>)
*
* SpliceBuffers are an implementation of gap buffers, which are a
* generalization of the "queue made of two stacks" idea. The splice buffer
* maintains a cursor, and moving the cursor has cost proportional to the
* distance the cursor moves, but inserting, deleting, or splicing in
* new information at the cursor is as efficient as the push/pop operation.
* This allows for an efficient sequence of splices (or pushes, pops, shifts,
* or unshifts) as long such edits happen at the same part of the array or
* generally sweep through the array from the beginning to the end.
*
* The interface for splice buffers also supports large numbers of inputs by
* passing a single array argument rather passing multiple arguments on the
* function call stack.
*
* @template T
*   Item type.
*/
var SpliceBuffer = class {
	/**
	* @param {ReadonlyArray<T> | null | undefined} [initial]
	*   Initial items (optional).
	* @returns
	*   Splice buffer.
	*/
	constructor(initial) {
		/** @type {Array<T>} */
		this.left = initial ? [...initial] : [];
		/** @type {Array<T>} */
		this.right = [];
	}
	/**
	* Array access;
	* does not move the cursor.
	*
	* @param {number} index
	*   Index.
	* @return {T}
	*   Item.
	*/
	get(index) {
		if (index < 0 || index >= this.left.length + this.right.length) throw new RangeError("Cannot access index `" + index + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
		if (index < this.left.length) return this.left[index];
		return this.right[this.right.length - index + this.left.length - 1];
	}
	/**
	* The length of the splice buffer, one greater than the largest index in the
	* array.
	*/
	get length() {
		return this.left.length + this.right.length;
	}
	/**
	* Remove and return `list[0]`;
	* moves the cursor to `0`.
	*
	* @returns {T | undefined}
	*   Item, optional.
	*/
	shift() {
		this.setCursor(0);
		return this.right.pop();
	}
	/**
	* Slice the buffer to get an array;
	* does not move the cursor.
	*
	* @param {number} start
	*   Start.
	* @param {number | null | undefined} [end]
	*   End (optional).
	* @returns {Array<T>}
	*   Array of items.
	*/
	slice(start, end) {
		/** @type {number} */
		const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
		if (stop < this.left.length) return this.left.slice(start, stop);
		if (start > this.left.length) return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
		return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
	}
	/**
	* Mimics the behavior of Array.prototype.splice() except for the change of
	* interface necessary to avoid segfaults when patching in very large arrays.
	*
	* This operation moves cursor is moved to `start` and results in the cursor
	* placed after any inserted items.
	*
	* @param {number} start
	*   Start;
	*   zero-based index at which to start changing the array;
	*   negative numbers count backwards from the end of the array and values
	*   that are out-of bounds are clamped to the appropriate end of the array.
	* @param {number | null | undefined} [deleteCount=0]
	*   Delete count (default: `0`);
	*   maximum number of elements to delete, starting from start.
	* @param {Array<T> | null | undefined} [items=[]]
	*   Items to include in place of the deleted items (default: `[]`).
	* @return {Array<T>}
	*   Any removed items.
	*/
	splice(start, deleteCount, items) {
		/** @type {number} */
		const count = deleteCount || 0;
		this.setCursor(Math.trunc(start));
		const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
		if (items) chunkedPush(this.left, items);
		return removed.reverse();
	}
	/**
	* Remove and return the highest-numbered item in the array, so
	* `list[list.length - 1]`;
	* Moves the cursor to `length`.
	*
	* @returns {T | undefined}
	*   Item, optional.
	*/
	pop() {
		this.setCursor(Number.POSITIVE_INFINITY);
		return this.left.pop();
	}
	/**
	* Inserts a single item to the high-numbered side of the array;
	* moves the cursor to `length`.
	*
	* @param {T} item
	*   Item.
	* @returns {undefined}
	*   Nothing.
	*/
	push(item) {
		this.setCursor(Number.POSITIVE_INFINITY);
		this.left.push(item);
	}
	/**
	* Inserts many items to the high-numbered side of the array.
	* Moves the cursor to `length`.
	*
	* @param {Array<T>} items
	*   Items.
	* @returns {undefined}
	*   Nothing.
	*/
	pushMany(items) {
		this.setCursor(Number.POSITIVE_INFINITY);
		chunkedPush(this.left, items);
	}
	/**
	* Inserts a single item to the low-numbered side of the array;
	* Moves the cursor to `0`.
	*
	* @param {T} item
	*   Item.
	* @returns {undefined}
	*   Nothing.
	*/
	unshift(item) {
		this.setCursor(0);
		this.right.push(item);
	}
	/**
	* Inserts many items to the low-numbered side of the array;
	* moves the cursor to `0`.
	*
	* @param {Array<T>} items
	*   Items.
	* @returns {undefined}
	*   Nothing.
	*/
	unshiftMany(items) {
		this.setCursor(0);
		chunkedPush(this.right, items.reverse());
	}
	/**
	* Move the cursor to a specific position in the array. Requires
	* time proportional to the distance moved.
	*
	* If `n < 0`, the cursor will end up at the beginning.
	* If `n > length`, the cursor will end up at the end.
	*
	* @param {number} n
	*   Position.
	* @return {undefined}
	*   Nothing.
	*/
	setCursor(n) {
		if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
		if (n < this.left.length) {
			const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
			chunkedPush(this.right, removed.reverse());
		} else {
			const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
			chunkedPush(this.left, removed.reverse());
		}
	}
};
/**
* Avoid stack overflow by pushing items onto the stack in segments
*
* @template T
*   Item type.
* @param {Array<T>} list
*   List to inject into.
* @param {ReadonlyArray<T>} right
*   Items to inject.
* @return {undefined}
*   Nothing.
*/
function chunkedPush(list, right) {
	/** @type {number} */
	let chunkStart = 0;
	if (right.length < 1e4) list.push(...right);
	else while (chunkStart < right.length) {
		list.push(...right.slice(chunkStart, chunkStart + 1e4));
		chunkStart += 1e4;
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-subtokenize@2.1.0/node_modules/micromark-util-subtokenize/index.js
/**
* @import {Chunk, Event, Token} from 'micromark-util-types'
*/
/**
* Tokenize subcontent.
*
* @param {Array<Event>} eventsArray
*   List of events.
* @returns {boolean}
*   Whether subtokens were found.
*/
function subtokenize(eventsArray) {
	/** @type {Record<string, number>} */
	const jumps = {};
	let index = -1;
	/** @type {Event} */
	let event;
	/** @type {number | undefined} */
	let lineIndex;
	/** @type {number} */
	let otherIndex;
	/** @type {Event} */
	let otherEvent;
	/** @type {Array<Event>} */
	let parameters;
	/** @type {Array<Event>} */
	let subevents;
	/** @type {boolean | undefined} */
	let more;
	const events = new SpliceBuffer(eventsArray);
	while (++index < events.length) {
		while (index in jumps) index = jumps[index];
		event = events.get(index);
		if (index && event[1].type === "chunkFlow" && events.get(index - 1)[1].type === "listItemPrefix") {
			subevents = event[1]._tokenizer.events;
			otherIndex = 0;
			if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") otherIndex += 2;
			if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") while (++otherIndex < subevents.length) {
				if (subevents[otherIndex][1].type === "content") break;
				if (subevents[otherIndex][1].type === "chunkText") {
					subevents[otherIndex][1]._isInFirstContentOfListItem = true;
					otherIndex++;
				}
			}
		}
		if (event[0] === "enter") {
			if (event[1].contentType) {
				Object.assign(jumps, subcontent(events, index));
				index = jumps[index];
				more = true;
			}
		} else if (event[1]._container) {
			otherIndex = index;
			lineIndex = void 0;
			while (otherIndex--) {
				otherEvent = events.get(otherIndex);
				if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
					if (otherEvent[0] === "enter") {
						if (lineIndex) events.get(lineIndex)[1].type = "lineEndingBlank";
						otherEvent[1].type = "lineEnding";
						lineIndex = otherIndex;
					}
				} else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {} else break;
			}
			if (lineIndex) {
				event[1].end = { ...events.get(lineIndex)[1].start };
				parameters = events.slice(lineIndex, index);
				parameters.unshift(event);
				events.splice(lineIndex, index - lineIndex + 1, parameters);
			}
		}
	}
	splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
	return !more;
}
/**
* Tokenize embedded tokens.
*
* @param {SpliceBuffer<Event>} events
*   Events.
* @param {number} eventIndex
*   Index.
* @returns {Record<string, number>}
*   Gaps.
*/
function subcontent(events, eventIndex) {
	const token = events.get(eventIndex)[1];
	const context = events.get(eventIndex)[2];
	let startPosition = eventIndex - 1;
	/** @type {Array<number>} */
	const startPositions = [];
	let tokenizer = token._tokenizer;
	if (!tokenizer) {
		tokenizer = context.parser[token.contentType](token.start);
		if (token._contentTypeTextTrailing) tokenizer._contentTypeTextTrailing = true;
	}
	const childEvents = tokenizer.events;
	/** @type {Array<[number, number]>} */
	const jumps = [];
	/** @type {Record<string, number>} */
	const gaps = {};
	/** @type {Array<Chunk>} */
	let stream;
	/** @type {Token | undefined} */
	let previous;
	let index = -1;
	/** @type {Token | undefined} */
	let current = token;
	let adjust = 0;
	let start = 0;
	const breaks = [start];
	while (current) {
		while (events.get(++startPosition)[1] !== current);
		startPositions.push(startPosition);
		if (!current._tokenizer) {
			stream = context.sliceStream(current);
			if (!current.next) stream.push(null);
			if (previous) tokenizer.defineSkip(current.start);
			if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = true;
			tokenizer.write(stream);
			if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = void 0;
		}
		previous = current;
		current = current.next;
	}
	current = token;
	while (++index < childEvents.length) if (childEvents[index][0] === "exit" && childEvents[index - 1][0] === "enter" && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line) {
		start = index + 1;
		breaks.push(start);
		current._tokenizer = void 0;
		current.previous = void 0;
		current = current.next;
	}
	tokenizer.events = [];
	if (current) {
		current._tokenizer = void 0;
		current.previous = void 0;
	} else breaks.pop();
	index = breaks.length;
	while (index--) {
		const slice = childEvents.slice(breaks[index], breaks[index + 1]);
		const start = startPositions.pop();
		jumps.push([start, start + slice.length - 1]);
		events.splice(start, 2, slice);
	}
	jumps.reverse();
	index = -1;
	while (++index < jumps.length) {
		gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
		adjust += jumps[index][1] - jumps[index][0] - 1;
	}
	return gaps;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/content.js
/**
* @import {
*   Construct,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer,
*   Token
* } from 'micromark-util-types'
*/
/**
* No name because it must not be turned off.
* @type {Construct}
*/
var content$1 = {
	resolve: resolveContent,
	tokenize: tokenizeContent
};
/** @type {Construct} */
var continuationConstruct = {
	partial: true,
	tokenize: tokenizeContinuation
};
/**
* Content is transparent: it’s parsed right now. That way, definitions are also
* parsed right now: before text in paragraphs (specifically, media) are parsed.
*
* @type {Resolver}
*/
function resolveContent(events) {
	subtokenize(events);
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeContent(effects, ok) {
	/** @type {Token | undefined} */
	let previous;
	return chunkStart;
	/**
	* Before a content chunk.
	*
	* ```markdown
	* > | abc
	*     ^
	* ```
	*
	* @type {State}
	*/
	function chunkStart(code) {
		effects.enter("content");
		previous = effects.enter("chunkContent", { contentType: "content" });
		return chunkInside(code);
	}
	/**
	* In a content chunk.
	*
	* ```markdown
	* > | abc
	*     ^^^
	* ```
	*
	* @type {State}
	*/
	function chunkInside(code) {
		if (code === null) return contentEnd(code);
		if (markdownLineEnding(code)) return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
		effects.consume(code);
		return chunkInside;
	}
	/**
	*
	*
	* @type {State}
	*/
	function contentEnd(code) {
		effects.exit("chunkContent");
		effects.exit("content");
		return ok(code);
	}
	/**
	*
	*
	* @type {State}
	*/
	function contentContinue(code) {
		effects.consume(code);
		effects.exit("chunkContent");
		previous.next = effects.enter("chunkContent", {
			contentType: "content",
			previous
		});
		previous = previous.next;
		return chunkInside;
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeContinuation(effects, ok, nok) {
	const self = this;
	return startLookahead;
	/**
	*
	*
	* @type {State}
	*/
	function startLookahead(code) {
		effects.exit("chunkContent");
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return factorySpace(effects, prefixed, "linePrefix");
	}
	/**
	*
	*
	* @type {State}
	*/
	function prefixed(code) {
		if (code === null || markdownLineEnding(code)) return nok(code);
		const tail = self.events[self.events.length - 1];
		if (!self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) return ok(code);
		return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-factory-destination@2.0.1/node_modules/micromark-factory-destination/index.js
/**
* @import {Effects, State, TokenType} from 'micromark-util-types'
*/
/**
* Parse destinations.
*
* ###### Examples
*
* ```markdown
* <a>
* <a\>b>
* <a b>
* <a)>
* a
* a\)b
* a(b)c
* a(b)
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {State} nok
*   State switched to when unsuccessful.
* @param {TokenType} type
*   Type for whole (`<a>` or `b`).
* @param {TokenType} literalType
*   Type when enclosed (`<a>`).
* @param {TokenType} literalMarkerType
*   Type for enclosing (`<` and `>`).
* @param {TokenType} rawType
*   Type when not enclosed (`b`).
* @param {TokenType} stringType
*   Type for the value (`a` or `b`).
* @param {number | undefined} [max=Infinity]
*   Depth of nested parens (inclusive).
* @returns {State}
*   Start state.
*/
function factoryDestination(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
	const limit = max || Number.POSITIVE_INFINITY;
	let balance = 0;
	return start;
	/**
	* Start of destination.
	*
	* ```markdown
	* > | <aa>
	*     ^
	* > | aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		if (code === 60) {
			effects.enter(type);
			effects.enter(literalType);
			effects.enter(literalMarkerType);
			effects.consume(code);
			effects.exit(literalMarkerType);
			return enclosedBefore;
		}
		if (code === null || code === 32 || code === 41 || asciiControl(code)) return nok(code);
		effects.enter(type);
		effects.enter(rawType);
		effects.enter(stringType);
		effects.enter("chunkString", { contentType: "string" });
		return raw(code);
	}
	/**
	* After `<`, at an enclosed destination.
	*
	* ```markdown
	* > | <aa>
	*      ^
	* ```
	*
	* @type {State}
	*/
	function enclosedBefore(code) {
		if (code === 62) {
			effects.enter(literalMarkerType);
			effects.consume(code);
			effects.exit(literalMarkerType);
			effects.exit(literalType);
			effects.exit(type);
			return ok;
		}
		effects.enter(stringType);
		effects.enter("chunkString", { contentType: "string" });
		return enclosed(code);
	}
	/**
	* In enclosed destination.
	*
	* ```markdown
	* > | <aa>
	*      ^
	* ```
	*
	* @type {State}
	*/
	function enclosed(code) {
		if (code === 62) {
			effects.exit("chunkString");
			effects.exit(stringType);
			return enclosedBefore(code);
		}
		if (code === null || code === 60 || markdownLineEnding(code)) return nok(code);
		effects.consume(code);
		return code === 92 ? enclosedEscape : enclosed;
	}
	/**
	* After `\`, at a special character.
	*
	* ```markdown
	* > | <a\*a>
	*        ^
	* ```
	*
	* @type {State}
	*/
	function enclosedEscape(code) {
		if (code === 60 || code === 62 || code === 92) {
			effects.consume(code);
			return enclosed;
		}
		return enclosed(code);
	}
	/**
	* In raw destination.
	*
	* ```markdown
	* > | aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function raw(code) {
		if (!balance && (code === null || code === 41 || markdownLineEndingOrSpace(code))) {
			effects.exit("chunkString");
			effects.exit(stringType);
			effects.exit(rawType);
			effects.exit(type);
			return ok(code);
		}
		if (balance < limit && code === 40) {
			effects.consume(code);
			balance++;
			return raw;
		}
		if (code === 41) {
			effects.consume(code);
			balance--;
			return raw;
		}
		if (code === null || code === 32 || code === 40 || asciiControl(code)) return nok(code);
		effects.consume(code);
		return code === 92 ? rawEscape : raw;
	}
	/**
	* After `\`, at special character.
	*
	* ```markdown
	* > | a\*a
	*       ^
	* ```
	*
	* @type {State}
	*/
	function rawEscape(code) {
		if (code === 40 || code === 41 || code === 92) {
			effects.consume(code);
			return raw;
		}
		return raw(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-factory-label@2.0.1/node_modules/micromark-factory-label/index.js
/**
* @import {
*   Effects,
*   State,
*   TokenizeContext,
*   TokenType
* } from 'micromark-util-types'
*/
/**
* Parse labels.
*
* > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
*
* ###### Examples
*
* ```markdown
* [a]
* [a
* b]
* [a\]b]
* ```
*
* @this {TokenizeContext}
*   Tokenize context.
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {State} nok
*   State switched to when unsuccessful.
* @param {TokenType} type
*   Type of the whole label (`[a]`).
* @param {TokenType} markerType
*   Type for the markers (`[` and `]`).
* @param {TokenType} stringType
*   Type for the identifier (`a`).
* @returns {State}
*   Start state.
*/
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
	const self = this;
	let size = 0;
	/** @type {boolean} */
	let seen;
	return start;
	/**
	* Start of label.
	*
	* ```markdown
	* > | [a]
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter(type);
		effects.enter(markerType);
		effects.consume(code);
		effects.exit(markerType);
		effects.enter(stringType);
		return atBreak;
	}
	/**
	* In label, at something, before something else.
	*
	* ```markdown
	* > | [a]
	*      ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code) {
		if (size > 999 || code === null || code === 91 || code === 93 && !seen || 
		/* c8 ignore next 3 */
		code === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs) return nok(code);
		if (code === 93) {
			effects.exit(stringType);
			effects.enter(markerType);
			effects.consume(code);
			effects.exit(markerType);
			effects.exit(type);
			return ok;
		}
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return atBreak;
		}
		effects.enter("chunkString", { contentType: "string" });
		return labelInside(code);
	}
	/**
	* In label, in text.
	*
	* ```markdown
	* > | [a]
	*      ^
	* ```
	*
	* @type {State}
	*/
	function labelInside(code) {
		if (code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999) {
			effects.exit("chunkString");
			return atBreak(code);
		}
		effects.consume(code);
		if (!seen) seen = !markdownSpace(code);
		return code === 92 ? labelEscape : labelInside;
	}
	/**
	* After `\`, at a special character.
	*
	* ```markdown
	* > | [a\*a]
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelEscape(code) {
		if (code === 91 || code === 92 || code === 93) {
			effects.consume(code);
			size++;
			return labelInside;
		}
		return labelInside(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-factory-title@2.0.1/node_modules/micromark-factory-title/index.js
/**
* @import {
*   Code,
*   Effects,
*   State,
*   TokenType
* } from 'micromark-util-types'
*/
/**
* Parse titles.
*
* ###### Examples
*
* ```markdown
* "a"
* 'b'
* (c)
* "a
* b"
* 'a
*     b'
* (a\)b)
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {State} nok
*   State switched to when unsuccessful.
* @param {TokenType} type
*   Type of the whole title (`"a"`, `'b'`, `(c)`).
* @param {TokenType} markerType
*   Type for the markers (`"`, `'`, `(`, and `)`).
* @param {TokenType} stringType
*   Type for the value (`a`).
* @returns {State}
*   Start state.
*/
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Start of title.
	*
	* ```markdown
	* > | "a"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		if (code === 34 || code === 39 || code === 40) {
			effects.enter(type);
			effects.enter(markerType);
			effects.consume(code);
			effects.exit(markerType);
			marker = code === 40 ? 41 : code;
			return begin;
		}
		return nok(code);
	}
	/**
	* After opening marker.
	*
	* This is also used at the closing marker.
	*
	* ```markdown
	* > | "a"
	*      ^
	* ```
	*
	* @type {State}
	*/
	function begin(code) {
		if (code === marker) {
			effects.enter(markerType);
			effects.consume(code);
			effects.exit(markerType);
			effects.exit(type);
			return ok;
		}
		effects.enter(stringType);
		return atBreak(code);
	}
	/**
	* At something, before something else.
	*
	* ```markdown
	* > | "a"
	*      ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code) {
		if (code === marker) {
			effects.exit(stringType);
			return begin(marker);
		}
		if (code === null) return nok(code);
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return factorySpace(effects, atBreak, "linePrefix");
		}
		effects.enter("chunkString", { contentType: "string" });
		return inside(code);
	}
	/**
	*
	*
	* @type {State}
	*/
	function inside(code) {
		if (code === marker || code === null || markdownLineEnding(code)) {
			effects.exit("chunkString");
			return atBreak(code);
		}
		effects.consume(code);
		return code === 92 ? escape : inside;
	}
	/**
	* After `\`, at a special character.
	*
	* ```markdown
	* > | "a\*b"
	*      ^
	* ```
	*
	* @type {State}
	*/
	function escape(code) {
		if (code === marker || code === 92) {
			effects.consume(code);
			return inside;
		}
		return inside(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-factory-whitespace@2.0.1/node_modules/micromark-factory-whitespace/index.js
/**
* @import {Effects, State} from 'micromark-util-types'
*/
/**
* Parse spaces and tabs.
*
* There is no `nok` parameter:
*
* *   line endings or spaces in markdown are often optional, in which case this
*     factory can be used and `ok` will be switched to whether spaces were found
*     or not
* *   one line ending or space can be detected with
*     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @returns {State}
*   Start state.
*/
function factoryWhitespace(effects, ok) {
	/** @type {boolean} */
	let seen;
	return start;
	/** @type {State} */
	function start(code) {
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			seen = true;
			return start;
		}
		if (markdownSpace(code)) return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code);
		return ok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/definition.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var definition = {
	name: "definition",
	tokenize: tokenizeDefinition
};
/** @type {Construct} */
var titleBefore = {
	partial: true,
	tokenize: tokenizeTitleBefore
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeDefinition(effects, ok, nok) {
	const self = this;
	/** @type {string} */
	let identifier;
	return start;
	/**
	* At start of a definition.
	*
	* ```markdown
	* > | [a]: b "c"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("definition");
		return before(code);
	}
	/**
	* After optional whitespace, at `[`.
	*
	* ```markdown
	* > | [a]: b "c"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code) {
		return factoryLabel.call(self, effects, labelAfter, nok, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(code);
	}
	/**
	* After label.
	*
	* ```markdown
	* > | [a]: b "c"
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelAfter(code) {
		identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
		if (code === 58) {
			effects.enter("definitionMarker");
			effects.consume(code);
			effects.exit("definitionMarker");
			return markerAfter;
		}
		return nok(code);
	}
	/**
	* After marker.
	*
	* ```markdown
	* > | [a]: b "c"
	*         ^
	* ```
	*
	* @type {State}
	*/
	function markerAfter(code) {
		return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, destinationBefore)(code) : destinationBefore(code);
	}
	/**
	* Before destination.
	*
	* ```markdown
	* > | [a]: b "c"
	*          ^
	* ```
	*
	* @type {State}
	*/
	function destinationBefore(code) {
		return factoryDestination(effects, destinationAfter, nok, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(code);
	}
	/**
	* After destination.
	*
	* ```markdown
	* > | [a]: b "c"
	*           ^
	* ```
	*
	* @type {State}
	*/
	function destinationAfter(code) {
		return effects.attempt(titleBefore, after, after)(code);
	}
	/**
	* After definition.
	*
	* ```markdown
	* > | [a]: b
	*           ^
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		return markdownSpace(code) ? factorySpace(effects, afterWhitespace, "whitespace")(code) : afterWhitespace(code);
	}
	/**
	* After definition, after optional whitespace.
	*
	* ```markdown
	* > | [a]: b
	*           ^
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function afterWhitespace(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("definition");
			self.parser.defined.push(identifier);
			return ok(code);
		}
		return nok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeTitleBefore(effects, ok, nok) {
	return titleBefore;
	/**
	* After destination, at whitespace.
	*
	* ```markdown
	* > | [a]: b
	*           ^
	* > | [a]: b "c"
	*           ^
	* ```
	*
	* @type {State}
	*/
	function titleBefore(code) {
		return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, beforeMarker)(code) : nok(code);
	}
	/**
	* At title.
	*
	* ```markdown
	*   | [a]: b
	* > | "c"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function beforeMarker(code) {
		return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code);
	}
	/**
	* After title.
	*
	* ```markdown
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function titleAfter(code) {
		return markdownSpace(code) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code) : titleAfterOptionalWhitespace(code);
	}
	/**
	* After title, after optional whitespace.
	*
	* ```markdown
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function titleAfterOptionalWhitespace(code) {
		return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/hard-break-escape.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var hardBreakEscape = {
	name: "hardBreakEscape",
	tokenize: tokenizeHardBreakEscape
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHardBreakEscape(effects, ok, nok) {
	return start;
	/**
	* Start of a hard break (escape).
	*
	* ```markdown
	* > | a\
	*      ^
	*   | b
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("hardBreakEscape");
		effects.consume(code);
		return after;
	}
	/**
	* After `\`, at eol.
	*
	* ```markdown
	* > | a\
	*       ^
	*   | b
	* ```
	*
	*  @type {State}
	*/
	function after(code) {
		if (markdownLineEnding(code)) {
			effects.exit("hardBreakEscape");
			return ok(code);
		}
		return nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/heading-atx.js
/**
* @import {
*   Construct,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer,
*   Token
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var headingAtx = {
	name: "headingAtx",
	resolve: resolveHeadingAtx,
	tokenize: tokenizeHeadingAtx
};
/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
	let contentEnd = events.length - 2;
	let contentStart = 3;
	/** @type {Token} */
	let content;
	/** @type {Token} */
	let text;
	if (events[contentStart][1].type === "whitespace") contentStart += 2;
	if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") contentEnd -= 2;
	if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
	if (contentEnd > contentStart) {
		content = {
			type: "atxHeadingText",
			start: events[contentStart][1].start,
			end: events[contentEnd][1].end
		};
		text = {
			type: "chunkText",
			start: events[contentStart][1].start,
			end: events[contentEnd][1].end,
			contentType: "text"
		};
		splice(events, contentStart, contentEnd - contentStart + 1, [
			[
				"enter",
				content,
				context
			],
			[
				"enter",
				text,
				context
			],
			[
				"exit",
				text,
				context
			],
			[
				"exit",
				content,
				context
			]
		]);
	}
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHeadingAtx(effects, ok, nok) {
	let size = 0;
	return start;
	/**
	* Start of a heading (atx).
	*
	* ```markdown
	* > | ## aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("atxHeading");
		return before(code);
	}
	/**
	* After optional whitespace, at `#`.
	*
	* ```markdown
	* > | ## aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code) {
		effects.enter("atxHeadingSequence");
		return sequenceOpen(code);
	}
	/**
	* In opening sequence.
	*
	* ```markdown
	* > | ## aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code) {
		if (code === 35 && size++ < 6) {
			effects.consume(code);
			return sequenceOpen;
		}
		if (code === null || markdownLineEndingOrSpace(code)) {
			effects.exit("atxHeadingSequence");
			return atBreak(code);
		}
		return nok(code);
	}
	/**
	* After something, before something else.
	*
	* ```markdown
	* > | ## aa
	*       ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code) {
		if (code === 35) {
			effects.enter("atxHeadingSequence");
			return sequenceFurther(code);
		}
		if (code === null || markdownLineEnding(code)) {
			effects.exit("atxHeading");
			return ok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, atBreak, "whitespace")(code);
		effects.enter("atxHeadingText");
		return data(code);
	}
	/**
	* In further sequence (after whitespace).
	*
	* Could be normal “visible” hashes in the heading or a final sequence.
	*
	* ```markdown
	* > | ## aa ##
	*           ^
	* ```
	*
	* @type {State}
	*/
	function sequenceFurther(code) {
		if (code === 35) {
			effects.consume(code);
			return sequenceFurther;
		}
		effects.exit("atxHeadingSequence");
		return atBreak(code);
	}
	/**
	* In text.
	*
	* ```markdown
	* > | ## aa
	*        ^
	* ```
	*
	* @type {State}
	*/
	function data(code) {
		if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
			effects.exit("atxHeadingText");
			return atBreak(code);
		}
		effects.consume(code);
		return data;
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-util-html-tag-name@2.0.1/node_modules/micromark-util-html-tag-name/index.js
/**
* List of lowercase HTML “block” tag names.
*
* The list, when parsing HTML (flow), results in more relaxed rules (condition
* 6).
* Because they are known blocks, the HTML-like syntax doesn’t have to be
* strictly parsed.
* For tag names not in this list, a more strict algorithm (condition 7) is used
* to detect whether the HTML-like syntax is seen as HTML (flow) or not.
*
* This is copied from:
* <https://spec.commonmark.org/0.30/#html-blocks>.
*
* > 👉 **Note**: `search` was added in `CommonMark@0.31`.
*/
var htmlBlockNames = [
	"address",
	"article",
	"aside",
	"base",
	"basefont",
	"blockquote",
	"body",
	"caption",
	"center",
	"col",
	"colgroup",
	"dd",
	"details",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hr",
	"html",
	"iframe",
	"legend",
	"li",
	"link",
	"main",
	"menu",
	"menuitem",
	"nav",
	"noframes",
	"ol",
	"optgroup",
	"option",
	"p",
	"param",
	"search",
	"section",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"title",
	"tr",
	"track",
	"ul"
];
/**
* List of lowercase HTML “raw” tag names.
*
* The list, when parsing HTML (flow), results in HTML that can include lines
* without exiting, until a closing tag also in this list is found (condition
* 1).
*
* This module is copied from:
* <https://spec.commonmark.org/0.30/#html-blocks>.
*
* > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
*/
var htmlRawNames = [
	"pre",
	"script",
	"style",
	"textarea"
];
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/html-flow.js
/**
* @import {
*   Code,
*   Construct,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var htmlFlow = {
	concrete: true,
	name: "htmlFlow",
	resolveTo: resolveToHtmlFlow,
	tokenize: tokenizeHtmlFlow
};
/** @type {Construct} */
var blankLineBefore = {
	partial: true,
	tokenize: tokenizeBlankLineBefore
};
var nonLazyContinuationStart = {
	partial: true,
	tokenize: tokenizeNonLazyContinuationStart
};
/** @type {Resolver} */
function resolveToHtmlFlow(events) {
	let index = events.length;
	while (index--) if (events[index][0] === "enter" && events[index][1].type === "htmlFlow") break;
	if (index > 1 && events[index - 2][1].type === "linePrefix") {
		events[index][1].start = events[index - 2][1].start;
		events[index + 1][1].start = events[index - 2][1].start;
		events.splice(index - 2, 2);
	}
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHtmlFlow(effects, ok, nok) {
	const self = this;
	/** @type {number} */
	let marker;
	/** @type {boolean} */
	let closingTag;
	/** @type {string} */
	let buffer;
	/** @type {number} */
	let index;
	/** @type {Code} */
	let markerB;
	return start;
	/**
	* Start of HTML (flow).
	*
	* ```markdown
	* > | <x />
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		return before(code);
	}
	/**
	* At `<`, after optional whitespace.
	*
	* ```markdown
	* > | <x />
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code) {
		effects.enter("htmlFlow");
		effects.enter("htmlFlowData");
		effects.consume(code);
		return open;
	}
	/**
	* After `<`, at tag name or other stuff.
	*
	* ```markdown
	* > | <x />
	*      ^
	* > | <!doctype>
	*      ^
	* > | <!--xxx-->
	*      ^
	* ```
	*
	* @type {State}
	*/
	function open(code) {
		if (code === 33) {
			effects.consume(code);
			return declarationOpen;
		}
		if (code === 47) {
			effects.consume(code);
			closingTag = true;
			return tagCloseStart;
		}
		if (code === 63) {
			effects.consume(code);
			marker = 3;
			return self.interrupt ? ok : continuationDeclarationInside;
		}
		if (asciiAlpha(code)) {
			effects.consume(code);
			buffer = String.fromCharCode(code);
			return tagName;
		}
		return nok(code);
	}
	/**
	* After `<!`, at declaration, comment, or CDATA.
	*
	* ```markdown
	* > | <!doctype>
	*       ^
	* > | <!--xxx-->
	*       ^
	* > | <![CDATA[>&<]]>
	*       ^
	* ```
	*
	* @type {State}
	*/
	function declarationOpen(code) {
		if (code === 45) {
			effects.consume(code);
			marker = 2;
			return commentOpenInside;
		}
		if (code === 91) {
			effects.consume(code);
			marker = 5;
			index = 0;
			return cdataOpenInside;
		}
		if (asciiAlpha(code)) {
			effects.consume(code);
			marker = 4;
			return self.interrupt ? ok : continuationDeclarationInside;
		}
		return nok(code);
	}
	/**
	* After `<!-`, inside a comment, at another `-`.
	*
	* ```markdown
	* > | <!--xxx-->
	*        ^
	* ```
	*
	* @type {State}
	*/
	function commentOpenInside(code) {
		if (code === 45) {
			effects.consume(code);
			return self.interrupt ? ok : continuationDeclarationInside;
		}
		return nok(code);
	}
	/**
	* After `<![`, inside CDATA, expecting `CDATA[`.
	*
	* ```markdown
	* > | <![CDATA[>&<]]>
	*        ^^^^^^
	* ```
	*
	* @type {State}
	*/
	function cdataOpenInside(code) {
		if (code === "CDATA[".charCodeAt(index++)) {
			effects.consume(code);
			if (index === 6) return self.interrupt ? ok : continuation;
			return cdataOpenInside;
		}
		return nok(code);
	}
	/**
	* After `</`, in closing tag, at tag name.
	*
	* ```markdown
	* > | </x>
	*       ^
	* ```
	*
	* @type {State}
	*/
	function tagCloseStart(code) {
		if (asciiAlpha(code)) {
			effects.consume(code);
			buffer = String.fromCharCode(code);
			return tagName;
		}
		return nok(code);
	}
	/**
	* In tag name.
	*
	* ```markdown
	* > | <ab>
	*      ^^
	* > | </ab>
	*       ^^
	* ```
	*
	* @type {State}
	*/
	function tagName(code) {
		if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
			const slash = code === 47;
			const name = buffer.toLowerCase();
			if (!slash && !closingTag && htmlRawNames.includes(name)) {
				marker = 1;
				return self.interrupt ? ok(code) : continuation(code);
			}
			if (htmlBlockNames.includes(buffer.toLowerCase())) {
				marker = 6;
				if (slash) {
					effects.consume(code);
					return basicSelfClosing;
				}
				return self.interrupt ? ok(code) : continuation(code);
			}
			marker = 7;
			return self.interrupt && !self.parser.lazy[self.now().line] ? nok(code) : closingTag ? completeClosingTagAfter(code) : completeAttributeNameBefore(code);
		}
		if (code === 45 || asciiAlphanumeric(code)) {
			effects.consume(code);
			buffer += String.fromCharCode(code);
			return tagName;
		}
		return nok(code);
	}
	/**
	* After closing slash of a basic tag name.
	*
	* ```markdown
	* > | <div/>
	*          ^
	* ```
	*
	* @type {State}
	*/
	function basicSelfClosing(code) {
		if (code === 62) {
			effects.consume(code);
			return self.interrupt ? ok : continuation;
		}
		return nok(code);
	}
	/**
	* After closing slash of a complete tag name.
	*
	* ```markdown
	* > | <x/>
	*        ^
	* ```
	*
	* @type {State}
	*/
	function completeClosingTagAfter(code) {
		if (markdownSpace(code)) {
			effects.consume(code);
			return completeClosingTagAfter;
		}
		return completeEnd(code);
	}
	/**
	* At an attribute name.
	*
	* At first, this state is used after a complete tag name, after whitespace,
	* where it expects optional attributes or the end of the tag.
	* It is also reused after attributes, when expecting more optional
	* attributes.
	*
	* ```markdown
	* > | <a />
	*        ^
	* > | <a :b>
	*        ^
	* > | <a _b>
	*        ^
	* > | <a b>
	*        ^
	* > | <a >
	*        ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeNameBefore(code) {
		if (code === 47) {
			effects.consume(code);
			return completeEnd;
		}
		if (code === 58 || code === 95 || asciiAlpha(code)) {
			effects.consume(code);
			return completeAttributeName;
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return completeAttributeNameBefore;
		}
		return completeEnd(code);
	}
	/**
	* In attribute name.
	*
	* ```markdown
	* > | <a :b>
	*         ^
	* > | <a _b>
	*         ^
	* > | <a b>
	*         ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeName(code) {
		if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
			effects.consume(code);
			return completeAttributeName;
		}
		return completeAttributeNameAfter(code);
	}
	/**
	* After attribute name, at an optional initializer, the end of the tag, or
	* whitespace.
	*
	* ```markdown
	* > | <a b>
	*         ^
	* > | <a b=c>
	*         ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeNameAfter(code) {
		if (code === 61) {
			effects.consume(code);
			return completeAttributeValueBefore;
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return completeAttributeNameAfter;
		}
		return completeAttributeNameBefore(code);
	}
	/**
	* Before unquoted, double quoted, or single quoted attribute value, allowing
	* whitespace.
	*
	* ```markdown
	* > | <a b=c>
	*          ^
	* > | <a b="c">
	*          ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueBefore(code) {
		if (code === null || code === 60 || code === 61 || code === 62 || code === 96) return nok(code);
		if (code === 34 || code === 39) {
			effects.consume(code);
			markerB = code;
			return completeAttributeValueQuoted;
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return completeAttributeValueBefore;
		}
		return completeAttributeValueUnquoted(code);
	}
	/**
	* In double or single quoted attribute value.
	*
	* ```markdown
	* > | <a b="c">
	*           ^
	* > | <a b='c'>
	*           ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueQuoted(code) {
		if (code === markerB) {
			effects.consume(code);
			markerB = null;
			return completeAttributeValueQuotedAfter;
		}
		if (code === null || markdownLineEnding(code)) return nok(code);
		effects.consume(code);
		return completeAttributeValueQuoted;
	}
	/**
	* In unquoted attribute value.
	*
	* ```markdown
	* > | <a b=c>
	*          ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueUnquoted(code) {
		if (code === null || code === 34 || code === 39 || code === 47 || code === 60 || code === 61 || code === 62 || code === 96 || markdownLineEndingOrSpace(code)) return completeAttributeNameAfter(code);
		effects.consume(code);
		return completeAttributeValueUnquoted;
	}
	/**
	* After double or single quoted attribute value, before whitespace or the
	* end of the tag.
	*
	* ```markdown
	* > | <a b="c">
	*            ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueQuotedAfter(code) {
		if (code === 47 || code === 62 || markdownSpace(code)) return completeAttributeNameBefore(code);
		return nok(code);
	}
	/**
	* In certain circumstances of a complete tag where only an `>` is allowed.
	*
	* ```markdown
	* > | <a b="c">
	*             ^
	* ```
	*
	* @type {State}
	*/
	function completeEnd(code) {
		if (code === 62) {
			effects.consume(code);
			return completeAfter;
		}
		return nok(code);
	}
	/**
	* After `>` in a complete tag.
	*
	* ```markdown
	* > | <x>
	*        ^
	* ```
	*
	* @type {State}
	*/
	function completeAfter(code) {
		if (code === null || markdownLineEnding(code)) return continuation(code);
		if (markdownSpace(code)) {
			effects.consume(code);
			return completeAfter;
		}
		return nok(code);
	}
	/**
	* In continuation of any HTML kind.
	*
	* ```markdown
	* > | <!--xxx-->
	*          ^
	* ```
	*
	* @type {State}
	*/
	function continuation(code) {
		if (code === 45 && marker === 2) {
			effects.consume(code);
			return continuationCommentInside;
		}
		if (code === 60 && marker === 1) {
			effects.consume(code);
			return continuationRawTagOpen;
		}
		if (code === 62 && marker === 4) {
			effects.consume(code);
			return continuationClose;
		}
		if (code === 63 && marker === 3) {
			effects.consume(code);
			return continuationDeclarationInside;
		}
		if (code === 93 && marker === 5) {
			effects.consume(code);
			return continuationCdataInside;
		}
		if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
			effects.exit("htmlFlowData");
			return effects.check(blankLineBefore, continuationAfter, continuationStart)(code);
		}
		if (code === null || markdownLineEnding(code)) {
			effects.exit("htmlFlowData");
			return continuationStart(code);
		}
		effects.consume(code);
		return continuation;
	}
	/**
	* In continuation, at eol.
	*
	* ```markdown
	* > | <x>
	*        ^
	*   | asd
	* ```
	*
	* @type {State}
	*/
	function continuationStart(code) {
		return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code);
	}
	/**
	* In continuation, at eol, before non-lazy content.
	*
	* ```markdown
	* > | <x>
	*        ^
	*   | asd
	* ```
	*
	* @type {State}
	*/
	function continuationStartNonLazy(code) {
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return continuationBefore;
	}
	/**
	* In continuation, before non-lazy content.
	*
	* ```markdown
	*   | <x>
	* > | asd
	*     ^
	* ```
	*
	* @type {State}
	*/
	function continuationBefore(code) {
		if (code === null || markdownLineEnding(code)) return continuationStart(code);
		effects.enter("htmlFlowData");
		return continuation(code);
	}
	/**
	* In comment continuation, after one `-`, expecting another.
	*
	* ```markdown
	* > | <!--xxx-->
	*             ^
	* ```
	*
	* @type {State}
	*/
	function continuationCommentInside(code) {
		if (code === 45) {
			effects.consume(code);
			return continuationDeclarationInside;
		}
		return continuation(code);
	}
	/**
	* In raw continuation, after `<`, at `/`.
	*
	* ```markdown
	* > | <script>console.log(1)<\/script>
	*                            ^
	* ```
	*
	* @type {State}
	*/
	function continuationRawTagOpen(code) {
		if (code === 47) {
			effects.consume(code);
			buffer = "";
			return continuationRawEndTag;
		}
		return continuation(code);
	}
	/**
	* In raw continuation, after `</`, in a raw tag name.
	*
	* ```markdown
	* > | <script>console.log(1)<\/script>
	*                             ^^^^^^
	* ```
	*
	* @type {State}
	*/
	function continuationRawEndTag(code) {
		if (code === 62) {
			const name = buffer.toLowerCase();
			if (htmlRawNames.includes(name)) {
				effects.consume(code);
				return continuationClose;
			}
			return continuation(code);
		}
		if (asciiAlpha(code) && buffer.length < 8) {
			effects.consume(code);
			buffer += String.fromCharCode(code);
			return continuationRawEndTag;
		}
		return continuation(code);
	}
	/**
	* In cdata continuation, after `]`, expecting `]>`.
	*
	* ```markdown
	* > | <![CDATA[>&<]]>
	*                  ^
	* ```
	*
	* @type {State}
	*/
	function continuationCdataInside(code) {
		if (code === 93) {
			effects.consume(code);
			return continuationDeclarationInside;
		}
		return continuation(code);
	}
	/**
	* In declaration or instruction continuation, at `>`.
	*
	* ```markdown
	* > | <!-->
	*         ^
	* > | <?>
	*       ^
	* > | <!q>
	*        ^
	* > | <!--ab-->
	*             ^
	* > | <![CDATA[>&<]]>
	*                   ^
	* ```
	*
	* @type {State}
	*/
	function continuationDeclarationInside(code) {
		if (code === 62) {
			effects.consume(code);
			return continuationClose;
		}
		if (code === 45 && marker === 2) {
			effects.consume(code);
			return continuationDeclarationInside;
		}
		return continuation(code);
	}
	/**
	* In closed continuation: everything we get until the eol/eof is part of it.
	*
	* ```markdown
	* > | <!doctype>
	*               ^
	* ```
	*
	* @type {State}
	*/
	function continuationClose(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("htmlFlowData");
			return continuationAfter(code);
		}
		effects.consume(code);
		return continuationClose;
	}
	/**
	* Done.
	*
	* ```markdown
	* > | <!doctype>
	*               ^
	* ```
	*
	* @type {State}
	*/
	function continuationAfter(code) {
		effects.exit("htmlFlow");
		return ok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
	const self = this;
	return start;
	/**
	* At eol, before continuation.
	*
	* ```markdown
	* > | * ```js
	*            ^
	*   | b
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return after;
		}
		return nok(code);
	}
	/**
	* A continuation.
	*
	* ```markdown
	*   | * ```js
	* > | b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlankLineBefore(effects, ok, nok) {
	return start;
	/**
	* Before eol, expecting blank line.
	*
	* ```markdown
	* > | <div>
	*          ^
	*   |
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return effects.attempt(blankLine, ok, nok);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/html-text.js
/**
* @import {
*   Code,
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var htmlText = {
	name: "htmlText",
	tokenize: tokenizeHtmlText
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHtmlText(effects, ok, nok) {
	const self = this;
	/** @type {NonNullable<Code> | undefined} */
	let marker;
	/** @type {number} */
	let index;
	/** @type {State} */
	let returnState;
	return start;
	/**
	* Start of HTML (text).
	*
	* ```markdown
	* > | a <b> c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("htmlText");
		effects.enter("htmlTextData");
		effects.consume(code);
		return open;
	}
	/**
	* After `<`, at tag name or other stuff.
	*
	* ```markdown
	* > | a <b> c
	*        ^
	* > | a <!doctype> c
	*        ^
	* > | a <!--b--> c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function open(code) {
		if (code === 33) {
			effects.consume(code);
			return declarationOpen;
		}
		if (code === 47) {
			effects.consume(code);
			return tagCloseStart;
		}
		if (code === 63) {
			effects.consume(code);
			return instruction;
		}
		if (asciiAlpha(code)) {
			effects.consume(code);
			return tagOpen;
		}
		return nok(code);
	}
	/**
	* After `<!`, at declaration, comment, or CDATA.
	*
	* ```markdown
	* > | a <!doctype> c
	*         ^
	* > | a <!--b--> c
	*         ^
	* > | a <![CDATA[>&<]]> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function declarationOpen(code) {
		if (code === 45) {
			effects.consume(code);
			return commentOpenInside;
		}
		if (code === 91) {
			effects.consume(code);
			index = 0;
			return cdataOpenInside;
		}
		if (asciiAlpha(code)) {
			effects.consume(code);
			return declaration;
		}
		return nok(code);
	}
	/**
	* In a comment, after `<!-`, at another `-`.
	*
	* ```markdown
	* > | a <!--b--> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function commentOpenInside(code) {
		if (code === 45) {
			effects.consume(code);
			return commentEnd;
		}
		return nok(code);
	}
	/**
	* In comment.
	*
	* ```markdown
	* > | a <!--b--> c
	*           ^
	* ```
	*
	* @type {State}
	*/
	function comment(code) {
		if (code === null) return nok(code);
		if (code === 45) {
			effects.consume(code);
			return commentClose;
		}
		if (markdownLineEnding(code)) {
			returnState = comment;
			return lineEndingBefore(code);
		}
		effects.consume(code);
		return comment;
	}
	/**
	* In comment, after `-`.
	*
	* ```markdown
	* > | a <!--b--> c
	*             ^
	* ```
	*
	* @type {State}
	*/
	function commentClose(code) {
		if (code === 45) {
			effects.consume(code);
			return commentEnd;
		}
		return comment(code);
	}
	/**
	* In comment, after `--`.
	*
	* ```markdown
	* > | a <!--b--> c
	*              ^
	* ```
	*
	* @type {State}
	*/
	function commentEnd(code) {
		return code === 62 ? end(code) : code === 45 ? commentClose(code) : comment(code);
	}
	/**
	* After `<![`, in CDATA, expecting `CDATA[`.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*          ^^^^^^
	* ```
	*
	* @type {State}
	*/
	function cdataOpenInside(code) {
		if (code === "CDATA[".charCodeAt(index++)) {
			effects.consume(code);
			return index === 6 ? cdata : cdataOpenInside;
		}
		return nok(code);
	}
	/**
	* In CDATA.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*                ^^^
	* ```
	*
	* @type {State}
	*/
	function cdata(code) {
		if (code === null) return nok(code);
		if (code === 93) {
			effects.consume(code);
			return cdataClose;
		}
		if (markdownLineEnding(code)) {
			returnState = cdata;
			return lineEndingBefore(code);
		}
		effects.consume(code);
		return cdata;
	}
	/**
	* In CDATA, after `]`, at another `]`.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*                    ^
	* ```
	*
	* @type {State}
	*/
	function cdataClose(code) {
		if (code === 93) {
			effects.consume(code);
			return cdataEnd;
		}
		return cdata(code);
	}
	/**
	* In CDATA, after `]]`, at `>`.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*                     ^
	* ```
	*
	* @type {State}
	*/
	function cdataEnd(code) {
		if (code === 62) return end(code);
		if (code === 93) {
			effects.consume(code);
			return cdataEnd;
		}
		return cdata(code);
	}
	/**
	* In declaration.
	*
	* ```markdown
	* > | a <!b> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function declaration(code) {
		if (code === null || code === 62) return end(code);
		if (markdownLineEnding(code)) {
			returnState = declaration;
			return lineEndingBefore(code);
		}
		effects.consume(code);
		return declaration;
	}
	/**
	* In instruction.
	*
	* ```markdown
	* > | a <?b?> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function instruction(code) {
		if (code === null) return nok(code);
		if (code === 63) {
			effects.consume(code);
			return instructionClose;
		}
		if (markdownLineEnding(code)) {
			returnState = instruction;
			return lineEndingBefore(code);
		}
		effects.consume(code);
		return instruction;
	}
	/**
	* In instruction, after `?`, at `>`.
	*
	* ```markdown
	* > | a <?b?> c
	*           ^
	* ```
	*
	* @type {State}
	*/
	function instructionClose(code) {
		return code === 62 ? end(code) : instruction(code);
	}
	/**
	* After `</`, in closing tag, at tag name.
	*
	* ```markdown
	* > | a </b> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function tagCloseStart(code) {
		if (asciiAlpha(code)) {
			effects.consume(code);
			return tagClose;
		}
		return nok(code);
	}
	/**
	* After `</x`, in a tag name.
	*
	* ```markdown
	* > | a </b> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function tagClose(code) {
		if (code === 45 || asciiAlphanumeric(code)) {
			effects.consume(code);
			return tagClose;
		}
		return tagCloseBetween(code);
	}
	/**
	* In closing tag, after tag name.
	*
	* ```markdown
	* > | a </b> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function tagCloseBetween(code) {
		if (markdownLineEnding(code)) {
			returnState = tagCloseBetween;
			return lineEndingBefore(code);
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return tagCloseBetween;
		}
		return end(code);
	}
	/**
	* After `<x`, in opening tag name.
	*
	* ```markdown
	* > | a <b> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function tagOpen(code) {
		if (code === 45 || asciiAlphanumeric(code)) {
			effects.consume(code);
			return tagOpen;
		}
		if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
		return nok(code);
	}
	/**
	* In opening tag, after tag name.
	*
	* ```markdown
	* > | a <b> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenBetween(code) {
		if (code === 47) {
			effects.consume(code);
			return end;
		}
		if (code === 58 || code === 95 || asciiAlpha(code)) {
			effects.consume(code);
			return tagOpenAttributeName;
		}
		if (markdownLineEnding(code)) {
			returnState = tagOpenBetween;
			return lineEndingBefore(code);
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return tagOpenBetween;
		}
		return end(code);
	}
	/**
	* In attribute name.
	*
	* ```markdown
	* > | a <b c> d
	*          ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeName(code) {
		if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
			effects.consume(code);
			return tagOpenAttributeName;
		}
		return tagOpenAttributeNameAfter(code);
	}
	/**
	* After attribute name, before initializer, the end of the tag, or
	* whitespace.
	*
	* ```markdown
	* > | a <b c> d
	*           ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeNameAfter(code) {
		if (code === 61) {
			effects.consume(code);
			return tagOpenAttributeValueBefore;
		}
		if (markdownLineEnding(code)) {
			returnState = tagOpenAttributeNameAfter;
			return lineEndingBefore(code);
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return tagOpenAttributeNameAfter;
		}
		return tagOpenBetween(code);
	}
	/**
	* Before unquoted, double quoted, or single quoted attribute value, allowing
	* whitespace.
	*
	* ```markdown
	* > | a <b c=d> e
	*            ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueBefore(code) {
		if (code === null || code === 60 || code === 61 || code === 62 || code === 96) return nok(code);
		if (code === 34 || code === 39) {
			effects.consume(code);
			marker = code;
			return tagOpenAttributeValueQuoted;
		}
		if (markdownLineEnding(code)) {
			returnState = tagOpenAttributeValueBefore;
			return lineEndingBefore(code);
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return tagOpenAttributeValueBefore;
		}
		effects.consume(code);
		return tagOpenAttributeValueUnquoted;
	}
	/**
	* In double or single quoted attribute value.
	*
	* ```markdown
	* > | a <b c="d"> e
	*             ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueQuoted(code) {
		if (code === marker) {
			effects.consume(code);
			marker = void 0;
			return tagOpenAttributeValueQuotedAfter;
		}
		if (code === null) return nok(code);
		if (markdownLineEnding(code)) {
			returnState = tagOpenAttributeValueQuoted;
			return lineEndingBefore(code);
		}
		effects.consume(code);
		return tagOpenAttributeValueQuoted;
	}
	/**
	* In unquoted attribute value.
	*
	* ```markdown
	* > | a <b c=d> e
	*            ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueUnquoted(code) {
		if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96) return nok(code);
		if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
		effects.consume(code);
		return tagOpenAttributeValueUnquoted;
	}
	/**
	* After double or single quoted attribute value, before whitespace or the end
	* of the tag.
	*
	* ```markdown
	* > | a <b c="d"> e
	*               ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueQuotedAfter(code) {
		if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
		return nok(code);
	}
	/**
	* In certain circumstances of a tag where only an `>` is allowed.
	*
	* ```markdown
	* > | a <b c="d"> e
	*               ^
	* ```
	*
	* @type {State}
	*/
	function end(code) {
		if (code === 62) {
			effects.consume(code);
			effects.exit("htmlTextData");
			effects.exit("htmlText");
			return ok;
		}
		return nok(code);
	}
	/**
	* At eol.
	*
	* > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
	* > empty tokens.
	*
	* ```markdown
	* > | a <!--a
	*            ^
	*   | b-->
	* ```
	*
	* @type {State}
	*/
	function lineEndingBefore(code) {
		effects.exit("htmlTextData");
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return lineEndingAfter;
	}
	/**
	* After eol, at optional whitespace.
	*
	* > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
	* > empty tokens.
	*
	* ```markdown
	*   | a <!--a
	* > | b-->
	*     ^
	* ```
	*
	* @type {State}
	*/
	function lineEndingAfter(code) {
		return markdownSpace(code) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : lineEndingAfterPrefix(code);
	}
	/**
	* After eol, after optional whitespace.
	*
	* > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
	* > empty tokens.
	*
	* ```markdown
	*   | a <!--a
	* > | b-->
	*     ^
	* ```
	*
	* @type {State}
	*/
	function lineEndingAfterPrefix(code) {
		effects.enter("htmlTextData");
		return returnState(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-end.js
/**
* @import {
*   Construct,
*   Event,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer,
*   Token
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var labelEnd = {
	name: "labelEnd",
	resolveAll: resolveAllLabelEnd,
	resolveTo: resolveToLabelEnd,
	tokenize: tokenizeLabelEnd
};
/** @type {Construct} */
var resourceConstruct = { tokenize: tokenizeResource };
/** @type {Construct} */
var referenceFullConstruct = { tokenize: tokenizeReferenceFull };
/** @type {Construct} */
var referenceCollapsedConstruct = { tokenize: tokenizeReferenceCollapsed };
/** @type {Resolver} */
function resolveAllLabelEnd(events) {
	let index = -1;
	/** @type {Array<Event>} */
	const newEvents = [];
	while (++index < events.length) {
		const token = events[index][1];
		newEvents.push(events[index]);
		if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
			const offset = token.type === "labelImage" ? 4 : 2;
			token.type = "data";
			index += offset;
		}
	}
	if (events.length !== newEvents.length) splice(events, 0, events.length, newEvents);
	return events;
}
/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
	let index = events.length;
	let offset = 0;
	/** @type {Token} */
	let token;
	/** @type {number | undefined} */
	let open;
	/** @type {number | undefined} */
	let close;
	/** @type {Array<Event>} */
	let media;
	while (index--) {
		token = events[index][1];
		if (open) {
			if (token.type === "link" || token.type === "labelLink" && token._inactive) break;
			if (events[index][0] === "enter" && token.type === "labelLink") token._inactive = true;
		} else if (close) {
			if (events[index][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
				open = index;
				if (token.type !== "labelLink") {
					offset = 2;
					break;
				}
			}
		} else if (token.type === "labelEnd") close = index;
	}
	const group = {
		type: events[open][1].type === "labelLink" ? "link" : "image",
		start: { ...events[open][1].start },
		end: { ...events[events.length - 1][1].end }
	};
	const label = {
		type: "label",
		start: { ...events[open][1].start },
		end: { ...events[close][1].end }
	};
	const text = {
		type: "labelText",
		start: { ...events[open + offset + 2][1].end },
		end: { ...events[close - 2][1].start }
	};
	media = [[
		"enter",
		group,
		context
	], [
		"enter",
		label,
		context
	]];
	media = push(media, events.slice(open + 1, open + offset + 3));
	media = push(media, [[
		"enter",
		text,
		context
	]]);
	media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
	media = push(media, [
		[
			"exit",
			text,
			context
		],
		events[close - 2],
		events[close - 1],
		[
			"exit",
			label,
			context
		]
	]);
	media = push(media, events.slice(close + 1));
	media = push(media, [[
		"exit",
		group,
		context
	]]);
	splice(events, open, events.length, media);
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLabelEnd(effects, ok, nok) {
	const self = this;
	let index = self.events.length;
	/** @type {Token} */
	let labelStart;
	/** @type {boolean} */
	let defined;
	while (index--) if ((self.events[index][1].type === "labelImage" || self.events[index][1].type === "labelLink") && !self.events[index][1]._balanced) {
		labelStart = self.events[index][1];
		break;
	}
	return start;
	/**
	* Start of label end.
	*
	* ```markdown
	* > | [a](b) c
	*       ^
	* > | [a][b] c
	*       ^
	* > | [a][] b
	*       ^
	* > | [a] b
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		if (!labelStart) return nok(code);
		if (labelStart._inactive) return labelEndNok(code);
		defined = self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize({
			start: labelStart.end,
			end: self.now()
		})));
		effects.enter("labelEnd");
		effects.enter("labelMarker");
		effects.consume(code);
		effects.exit("labelMarker");
		effects.exit("labelEnd");
		return after;
	}
	/**
	* After `]`.
	*
	* ```markdown
	* > | [a](b) c
	*       ^
	* > | [a][b] c
	*       ^
	* > | [a][] b
	*       ^
	* > | [a] b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		if (code === 40) return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code);
		if (code === 91) return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code);
		return defined ? labelEndOk(code) : labelEndNok(code);
	}
	/**
	* After `]`, at `[`, but not at a full reference.
	*
	* > 👉 **Note**: we only get here if the label is defined.
	*
	* ```markdown
	* > | [a][] b
	*        ^
	* > | [a] b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceNotFull(code) {
		return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code);
	}
	/**
	* Done, we found something.
	*
	* ```markdown
	* > | [a](b) c
	*           ^
	* > | [a][b] c
	*           ^
	* > | [a][] b
	*          ^
	* > | [a] b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelEndOk(code) {
		return ok(code);
	}
	/**
	* Done, it’s nothing.
	*
	* There was an okay opening, but we didn’t match anything.
	*
	* ```markdown
	* > | [a](b c
	*        ^
	* > | [a][b c
	*        ^
	* > | [a] b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelEndNok(code) {
		labelStart._balanced = true;
		return nok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeResource(effects, ok, nok) {
	return resourceStart;
	/**
	* At a resource.
	*
	* ```markdown
	* > | [a](b) c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function resourceStart(code) {
		effects.enter("resource");
		effects.enter("resourceMarker");
		effects.consume(code);
		effects.exit("resourceMarker");
		return resourceBefore;
	}
	/**
	* In resource, after `(`, at optional whitespace.
	*
	* ```markdown
	* > | [a](b) c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function resourceBefore(code) {
		return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceOpen)(code) : resourceOpen(code);
	}
	/**
	* In resource, after optional whitespace, at `)` or a destination.
	*
	* ```markdown
	* > | [a](b) c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function resourceOpen(code) {
		if (code === 41) return resourceEnd(code);
		return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code);
	}
	/**
	* In resource, after destination, at optional whitespace.
	*
	* ```markdown
	* > | [a](b) c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function resourceDestinationAfter(code) {
		return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceBetween)(code) : resourceEnd(code);
	}
	/**
	* At invalid destination.
	*
	* ```markdown
	* > | [a](<<) b
	*         ^
	* ```
	*
	* @type {State}
	*/
	function resourceDestinationMissing(code) {
		return nok(code);
	}
	/**
	* In resource, after destination and whitespace, at `(` or title.
	*
	* ```markdown
	* > | [a](b ) c
	*           ^
	* ```
	*
	* @type {State}
	*/
	function resourceBetween(code) {
		if (code === 34 || code === 39 || code === 40) return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code);
		return resourceEnd(code);
	}
	/**
	* In resource, after title, at optional whitespace.
	*
	* ```markdown
	* > | [a](b "c") d
	*              ^
	* ```
	*
	* @type {State}
	*/
	function resourceTitleAfter(code) {
		return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceEnd)(code) : resourceEnd(code);
	}
	/**
	* In resource, at `)`.
	*
	* ```markdown
	* > | [a](b) d
	*          ^
	* ```
	*
	* @type {State}
	*/
	function resourceEnd(code) {
		if (code === 41) {
			effects.enter("resourceMarker");
			effects.consume(code);
			effects.exit("resourceMarker");
			effects.exit("resource");
			return ok;
		}
		return nok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeReferenceFull(effects, ok, nok) {
	const self = this;
	return referenceFull;
	/**
	* In a reference (full), at the `[`.
	*
	* ```markdown
	* > | [a][b] d
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceFull(code) {
		return factoryLabel.call(self, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code);
	}
	/**
	* In a reference (full), after `]`.
	*
	* ```markdown
	* > | [a][b] d
	*          ^
	* ```
	*
	* @type {State}
	*/
	function referenceFullAfter(code) {
		return self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) ? ok(code) : nok(code);
	}
	/**
	* In reference (full) that was missing.
	*
	* ```markdown
	* > | [a][b d
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceFullMissing(code) {
		return nok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeReferenceCollapsed(effects, ok, nok) {
	return referenceCollapsedStart;
	/**
	* In reference (collapsed), at `[`.
	*
	* > 👉 **Note**: we only get here if the label is defined.
	*
	* ```markdown
	* > | [a][] d
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceCollapsedStart(code) {
		effects.enter("reference");
		effects.enter("referenceMarker");
		effects.consume(code);
		effects.exit("referenceMarker");
		return referenceCollapsedOpen;
	}
	/**
	* In reference (collapsed), at `]`.
	*
	* > 👉 **Note**: we only get here if the label is defined.
	*
	* ```markdown
	* > | [a][] d
	*         ^
	* ```
	*
	*  @type {State}
	*/
	function referenceCollapsedOpen(code) {
		if (code === 93) {
			effects.enter("referenceMarker");
			effects.consume(code);
			effects.exit("referenceMarker");
			effects.exit("reference");
			return ok;
		}
		return nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-start-image.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var labelStartImage = {
	name: "labelStartImage",
	resolveAll: labelEnd.resolveAll,
	tokenize: tokenizeLabelStartImage
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLabelStartImage(effects, ok, nok) {
	const self = this;
	return start;
	/**
	* Start of label (image) start.
	*
	* ```markdown
	* > | a ![b] c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("labelImage");
		effects.enter("labelImageMarker");
		effects.consume(code);
		effects.exit("labelImageMarker");
		return open;
	}
	/**
	* After `!`, at `[`.
	*
	* ```markdown
	* > | a ![b] c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function open(code) {
		if (code === 91) {
			effects.enter("labelMarker");
			effects.consume(code);
			effects.exit("labelMarker");
			effects.exit("labelImage");
			return after;
		}
		return nok(code);
	}
	/**
	* After `![`.
	*
	* ```markdown
	* > | a ![b] c
	*         ^
	* ```
	*
	* This is needed in because, when GFM footnotes are enabled, images never
	* form when started with a `^`.
	* Instead, links form:
	*
	* ```markdown
	* ![^a](b)
	*
	* ![^a][b]
	*
	* [b]: c
	* ```
	*
	* ```html
	* <p>!<a href=\"b\">^a</a></p>
	* <p>!<a href=\"c\">^a</a></p>
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		/* c8 ignore next 3 */
		return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : ok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-start-link.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var labelStartLink = {
	name: "labelStartLink",
	resolveAll: labelEnd.resolveAll,
	tokenize: tokenizeLabelStartLink
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLabelStartLink(effects, ok, nok) {
	const self = this;
	return start;
	/**
	* Start of label (link) start.
	*
	* ```markdown
	* > | a [b] c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("labelLink");
		effects.enter("labelMarker");
		effects.consume(code);
		effects.exit("labelMarker");
		effects.exit("labelLink");
		return after;
	}
	/** @type {State} */
	function after(code) {
		/* c8 ignore next 3 */
		return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : ok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/line-ending.js
/**
* @import {
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var lineEnding = {
	name: "lineEnding",
	tokenize: tokenizeLineEnding
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLineEnding(effects, ok) {
	return start;
	/** @type {State} */
	function start(code) {
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return factorySpace(effects, ok, "linePrefix");
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/thematic-break.js
/**
* @import {
*   Code,
*   Construct,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var thematicBreak$1 = {
	name: "thematicBreak",
	tokenize: tokenizeThematicBreak
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeThematicBreak(effects, ok, nok) {
	let size = 0;
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Start of thematic break.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("thematicBreak");
		return before(code);
	}
	/**
	* After optional whitespace, at marker.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code) {
		marker = code;
		return atBreak(code);
	}
	/**
	* After something, before something else.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code) {
		if (code === marker) {
			effects.enter("thematicBreakSequence");
			return sequence(code);
		}
		if (size >= 3 && (code === null || markdownLineEnding(code))) {
			effects.exit("thematicBreak");
			return ok(code);
		}
		return nok(code);
	}
	/**
	* In sequence.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function sequence(code) {
		if (code === marker) {
			effects.consume(code);
			size++;
			return sequence;
		}
		effects.exit("thematicBreakSequence");
		return markdownSpace(code) ? factorySpace(effects, atBreak, "whitespace")(code) : atBreak(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/list.js
/**
* @import {
*   Code,
*   Construct,
*   Exiter,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var list$1 = {
	continuation: { tokenize: tokenizeListContinuation },
	exit: tokenizeListEnd,
	name: "list",
	tokenize: tokenizeListStart
};
/** @type {Construct} */
var listItemPrefixWhitespaceConstruct = {
	partial: true,
	tokenize: tokenizeListItemPrefixWhitespace
};
/** @type {Construct} */
var indentConstruct = {
	partial: true,
	tokenize: tokenizeIndent$1
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeListStart(effects, ok, nok) {
	const self = this;
	const tail = self.events[self.events.length - 1];
	let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
	let size = 0;
	return start;
	/** @type {State} */
	function start(code) {
		const kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? "listUnordered" : "listOrdered");
		if (kind === "listUnordered" ? !self.containerState.marker || code === self.containerState.marker : asciiDigit(code)) {
			if (!self.containerState.type) {
				self.containerState.type = kind;
				effects.enter(kind, { _container: true });
			}
			if (kind === "listUnordered") {
				effects.enter("listItemPrefix");
				return code === 42 || code === 45 ? effects.check(thematicBreak$1, nok, atMarker)(code) : atMarker(code);
			}
			if (!self.interrupt || code === 49) {
				effects.enter("listItemPrefix");
				effects.enter("listItemValue");
				return inside(code);
			}
		}
		return nok(code);
	}
	/** @type {State} */
	function inside(code) {
		if (asciiDigit(code) && ++size < 10) {
			effects.consume(code);
			return inside;
		}
		if ((!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46)) {
			effects.exit("listItemValue");
			return atMarker(code);
		}
		return nok(code);
	}
	/**
	* @type {State}
	**/
	function atMarker(code) {
		effects.enter("listItemMarker");
		effects.consume(code);
		effects.exit("listItemMarker");
		self.containerState.marker = self.containerState.marker || code;
		return effects.check(blankLine, self.interrupt ? nok : onBlank, effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
	}
	/** @type {State} */
	function onBlank(code) {
		self.containerState.initialBlankLine = true;
		initialSize++;
		return endOfPrefix(code);
	}
	/** @type {State} */
	function otherPrefix(code) {
		if (markdownSpace(code)) {
			effects.enter("listItemPrefixWhitespace");
			effects.consume(code);
			effects.exit("listItemPrefixWhitespace");
			return endOfPrefix;
		}
		return nok(code);
	}
	/** @type {State} */
	function endOfPrefix(code) {
		self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
		return ok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeListContinuation(effects, ok, nok) {
	const self = this;
	self.containerState._closeFlow = void 0;
	return effects.check(blankLine, onBlank, notBlank);
	/** @type {State} */
	function onBlank(code) {
		self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
		return factorySpace(effects, ok, "listItemIndent", self.containerState.size + 1)(code);
	}
	/** @type {State} */
	function notBlank(code) {
		if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
			self.containerState.furtherBlankLines = void 0;
			self.containerState.initialBlankLine = void 0;
			return notInCurrentItem(code);
		}
		self.containerState.furtherBlankLines = void 0;
		self.containerState.initialBlankLine = void 0;
		return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
	}
	/** @type {State} */
	function notInCurrentItem(code) {
		self.containerState._closeFlow = true;
		self.interrupt = void 0;
		return factorySpace(effects, effects.attempt(list$1, ok, nok), "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeIndent$1(effects, ok, nok) {
	const self = this;
	return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);
	/** @type {State} */
	function afterPrefix(code) {
		const tail = self.events[self.events.length - 1];
		return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self.containerState.size ? ok(code) : nok(code);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Exiter}
*/
function tokenizeListEnd(effects) {
	effects.exit(this.containerState.type);
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
	const self = this;
	return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
	/** @type {State} */
	function afterPrefix(code) {
		const tail = self.events[self.events.length - 1];
		return !markdownSpace(code) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok(code) : nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/setext-underline.js
/**
* @import {
*   Code,
*   Construct,
*   Resolver,
*   State,
*   TokenizeContext,
*   Tokenizer
* } from 'micromark-util-types'
*/
/** @type {Construct} */
var setextUnderline = {
	name: "setextUnderline",
	resolveTo: resolveToSetextUnderline,
	tokenize: tokenizeSetextUnderline
};
/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
	let index = events.length;
	/** @type {number | undefined} */
	let content;
	/** @type {number | undefined} */
	let text;
	/** @type {number | undefined} */
	let definition;
	while (index--) if (events[index][0] === "enter") {
		if (events[index][1].type === "content") {
			content = index;
			break;
		}
		if (events[index][1].type === "paragraph") text = index;
	} else {
		if (events[index][1].type === "content") events.splice(index, 1);
		if (!definition && events[index][1].type === "definition") definition = index;
	}
	const heading = {
		type: "setextHeading",
		start: { ...events[content][1].start },
		end: { ...events[events.length - 1][1].end }
	};
	events[text][1].type = "setextHeadingText";
	if (definition) {
		events.splice(text, 0, [
			"enter",
			heading,
			context
		]);
		events.splice(definition + 1, 0, [
			"exit",
			events[content][1],
			context
		]);
		events[content][1].end = { ...events[definition][1].end };
	} else events[content][1] = heading;
	events.push([
		"exit",
		heading,
		context
	]);
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeSetextUnderline(effects, ok, nok) {
	const self = this;
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* At start of heading (setext) underline.
	*
	* ```markdown
	*   | aa
	* > | ==
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		let index = self.events.length;
		/** @type {boolean | undefined} */
		let paragraph;
		while (index--) if (self.events[index][1].type !== "lineEnding" && self.events[index][1].type !== "linePrefix" && self.events[index][1].type !== "content") {
			paragraph = self.events[index][1].type === "paragraph";
			break;
		}
		if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
			effects.enter("setextHeadingLine");
			marker = code;
			return before(code);
		}
		return nok(code);
	}
	/**
	* After optional whitespace, at `-` or `=`.
	*
	* ```markdown
	*   | aa
	* > | ==
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code) {
		effects.enter("setextHeadingLineSequence");
		return inside(code);
	}
	/**
	* In sequence.
	*
	* ```markdown
	*   | aa
	* > | ==
	*     ^
	* ```
	*
	* @type {State}
	*/
	function inside(code) {
		if (code === marker) {
			effects.consume(code);
			return inside;
		}
		effects.exit("setextHeadingLineSequence");
		return markdownSpace(code) ? factorySpace(effects, after, "lineSuffix")(code) : after(code);
	}
	/**
	* After sequence, after optional whitespace.
	*
	* ```markdown
	*   | aa
	* > | ==
	*       ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("setextHeadingLine");
			return ok(code);
		}
		return nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-footnote@2.1.0/node_modules/micromark-extension-gfm-footnote/lib/syntax.js
/**
* @import {Event, Exiter, Extension, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
var indent = {
	tokenize: tokenizeIndent,
	partial: true
};
/**
* Create an extension for `micromark` to enable GFM footnote syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to
*   enable GFM footnote syntax.
*/
function gfmFootnote() {
	/** @type {Extension} */
	return {
		document: { [91]: {
			name: "gfmFootnoteDefinition",
			tokenize: tokenizeDefinitionStart,
			continuation: { tokenize: tokenizeDefinitionContinuation },
			exit: gfmFootnoteDefinitionEnd
		} },
		text: {
			[91]: {
				name: "gfmFootnoteCall",
				tokenize: tokenizeGfmFootnoteCall
			},
			[93]: {
				name: "gfmPotentialFootnoteCall",
				add: "after",
				tokenize: tokenizePotentialGfmFootnoteCall,
				resolveTo: resolveToPotentialGfmFootnoteCall
			}
		}
	};
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizePotentialGfmFootnoteCall(effects, ok, nok) {
	const self = this;
	let index = self.events.length;
	const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
	/** @type {Token} */
	let labelStart;
	while (index--) {
		const token = self.events[index][1];
		if (token.type === "labelImage") {
			labelStart = token;
			break;
		}
		if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") break;
	}
	return start;
	/**
	* @type {State}
	*/
	function start(code) {
		if (!labelStart || !labelStart._balanced) return nok(code);
		const id = normalizeIdentifier(self.sliceSerialize({
			start: labelStart.end,
			end: self.now()
		}));
		if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) return nok(code);
		effects.enter("gfmFootnoteCallLabelMarker");
		effects.consume(code);
		effects.exit("gfmFootnoteCallLabelMarker");
		return ok(code);
	}
}
/** @type {Resolver} */
function resolveToPotentialGfmFootnoteCall(events, context) {
	let index = events.length;
	while (index--) if (events[index][1].type === "labelImage" && events[index][0] === "enter") {
		events[index][1];
		break;
	}
	events[index + 1][1].type = "data";
	events[index + 3][1].type = "gfmFootnoteCallLabelMarker";
	/** @type {Token} */
	const call = {
		type: "gfmFootnoteCall",
		start: Object.assign({}, events[index + 3][1].start),
		end: Object.assign({}, events[events.length - 1][1].end)
	};
	/** @type {Token} */
	const marker = {
		type: "gfmFootnoteCallMarker",
		start: Object.assign({}, events[index + 3][1].end),
		end: Object.assign({}, events[index + 3][1].end)
	};
	marker.end.column++;
	marker.end.offset++;
	marker.end._bufferIndex++;
	/** @type {Token} */
	const string = {
		type: "gfmFootnoteCallString",
		start: Object.assign({}, marker.end),
		end: Object.assign({}, events[events.length - 1][1].start)
	};
	/** @type {Token} */
	const chunk = {
		type: "chunkString",
		contentType: "string",
		start: Object.assign({}, string.start),
		end: Object.assign({}, string.end)
	};
	/** @type {Array<Event>} */
	const replacement = [
		events[index + 1],
		events[index + 2],
		[
			"enter",
			call,
			context
		],
		events[index + 3],
		events[index + 4],
		[
			"enter",
			marker,
			context
		],
		[
			"exit",
			marker,
			context
		],
		[
			"enter",
			string,
			context
		],
		[
			"enter",
			chunk,
			context
		],
		[
			"exit",
			chunk,
			context
		],
		[
			"exit",
			string,
			context
		],
		events[events.length - 2],
		events[events.length - 1],
		[
			"exit",
			call,
			context
		]
	];
	events.splice(index, events.length - index + 1, ...replacement);
	return events;
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeGfmFootnoteCall(effects, ok, nok) {
	const self = this;
	const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
	let size = 0;
	/** @type {boolean} */
	let data;
	return start;
	/**
	* Start of footnote label.
	*
	* ```markdown
	* > | a [^b] c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("gfmFootnoteCall");
		effects.enter("gfmFootnoteCallLabelMarker");
		effects.consume(code);
		effects.exit("gfmFootnoteCallLabelMarker");
		return callStart;
	}
	/**
	* After `[`, at `^`.
	*
	* ```markdown
	* > | a [^b] c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function callStart(code) {
		if (code !== 94) return nok(code);
		effects.enter("gfmFootnoteCallMarker");
		effects.consume(code);
		effects.exit("gfmFootnoteCallMarker");
		effects.enter("gfmFootnoteCallString");
		effects.enter("chunkString").contentType = "string";
		return callData;
	}
	/**
	* In label.
	*
	* ```markdown
	* > | a [^b] c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function callData(code) {
		if (size > 999 || code === 93 && !data || code === null || code === 91 || markdownLineEndingOrSpace(code)) return nok(code);
		if (code === 93) {
			effects.exit("chunkString");
			const token = effects.exit("gfmFootnoteCallString");
			if (!defined.includes(normalizeIdentifier(self.sliceSerialize(token)))) return nok(code);
			effects.enter("gfmFootnoteCallLabelMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteCallLabelMarker");
			effects.exit("gfmFootnoteCall");
			return ok;
		}
		if (!markdownLineEndingOrSpace(code)) data = true;
		size++;
		effects.consume(code);
		return code === 92 ? callEscape : callData;
	}
	/**
	* On character after escape.
	*
	* ```markdown
	* > | a [^b\c] d
	*           ^
	* ```
	*
	* @type {State}
	*/
	function callEscape(code) {
		if (code === 91 || code === 92 || code === 93) {
			effects.consume(code);
			size++;
			return callData;
		}
		return callData(code);
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeDefinitionStart(effects, ok, nok) {
	const self = this;
	const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
	/** @type {string} */
	let identifier;
	let size = 0;
	/** @type {boolean | undefined} */
	let data;
	return start;
	/**
	* Start of GFM footnote definition.
	*
	* ```markdown
	* > | [^a]: b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("gfmFootnoteDefinition")._container = true;
		effects.enter("gfmFootnoteDefinitionLabel");
		effects.enter("gfmFootnoteDefinitionLabelMarker");
		effects.consume(code);
		effects.exit("gfmFootnoteDefinitionLabelMarker");
		return labelAtMarker;
	}
	/**
	* In label, at caret.
	*
	* ```markdown
	* > | [^a]: b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function labelAtMarker(code) {
		if (code === 94) {
			effects.enter("gfmFootnoteDefinitionMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteDefinitionMarker");
			effects.enter("gfmFootnoteDefinitionLabelString");
			effects.enter("chunkString").contentType = "string";
			return labelInside;
		}
		return nok(code);
	}
	/**
	* In label.
	*
	* > 👉 **Note**: `cmark-gfm` prevents whitespace from occurring in footnote
	* > definition labels.
	*
	* ```markdown
	* > | [^a]: b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function labelInside(code) {
		if (size > 999 || code === 93 && !data || code === null || code === 91 || markdownLineEndingOrSpace(code)) return nok(code);
		if (code === 93) {
			effects.exit("chunkString");
			const token = effects.exit("gfmFootnoteDefinitionLabelString");
			identifier = normalizeIdentifier(self.sliceSerialize(token));
			effects.enter("gfmFootnoteDefinitionLabelMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteDefinitionLabelMarker");
			effects.exit("gfmFootnoteDefinitionLabel");
			return labelAfter;
		}
		if (!markdownLineEndingOrSpace(code)) data = true;
		size++;
		effects.consume(code);
		return code === 92 ? labelEscape : labelInside;
	}
	/**
	* After `\`, at a special character.
	*
	* > 👉 **Note**: `cmark-gfm` currently does not support escaped brackets:
	* > <https://github.com/github/cmark-gfm/issues/240>
	*
	* ```markdown
	* > | [^a\*b]: c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function labelEscape(code) {
		if (code === 91 || code === 92 || code === 93) {
			effects.consume(code);
			size++;
			return labelInside;
		}
		return labelInside(code);
	}
	/**
	* After definition label.
	*
	* ```markdown
	* > | [^a]: b
	*         ^
	* ```
	*
	* @type {State}
	*/
	function labelAfter(code) {
		if (code === 58) {
			effects.enter("definitionMarker");
			effects.consume(code);
			effects.exit("definitionMarker");
			if (!defined.includes(identifier)) defined.push(identifier);
			return factorySpace(effects, whitespaceAfter, "gfmFootnoteDefinitionWhitespace");
		}
		return nok(code);
	}
	/**
	* After definition prefix.
	*
	* ```markdown
	* > | [^a]: b
	*           ^
	* ```
	*
	* @type {State}
	*/
	function whitespaceAfter(code) {
		return ok(code);
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeDefinitionContinuation(effects, ok, nok) {
	return effects.check(blankLine, ok, effects.attempt(indent, ok, nok));
}
/** @type {Exiter} */
function gfmFootnoteDefinitionEnd(effects) {
	effects.exit("gfmFootnoteDefinition");
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeIndent(effects, ok, nok) {
	const self = this;
	return factorySpace(effects, afterPrefix, "gfmFootnoteDefinitionIndent", 5);
	/**
	* @type {State}
	*/
	function afterPrefix(code) {
		const tail = self.events[self.events.length - 1];
		return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok(code) : nok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-strikethrough@2.1.0/node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
/**
* @import {Options} from 'micromark-extension-gfm-strikethrough'
* @import {Event, Extension, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
/**
* Create an extension for `micromark` to enable GFM strikethrough syntax.
*
* @param {Options | null | undefined} [options={}]
*   Configuration.
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions`, to
*   enable GFM strikethrough syntax.
*/
function gfmStrikethrough(options) {
	let single = (options || {}).singleTilde;
	const tokenizer = {
		name: "strikethrough",
		tokenize: tokenizeStrikethrough,
		resolveAll: resolveAllStrikethrough
	};
	if (single === null || single === void 0) single = true;
	return {
		text: { [126]: tokenizer },
		insideSpan: { null: [tokenizer] },
		attentionMarkers: { null: [126] }
	};
	/**
	* Take events and resolve strikethrough.
	*
	* @type {Resolver}
	*/
	function resolveAllStrikethrough(events, context) {
		let index = -1;
		while (++index < events.length) if (events[index][0] === "enter" && events[index][1].type === "strikethroughSequenceTemporary" && events[index][1]._close) {
			let open = index;
			while (open--) if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && events[index][1].end.offset - events[index][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
				events[index][1].type = "strikethroughSequence";
				events[open][1].type = "strikethroughSequence";
				/** @type {Token} */
				const strikethrough = {
					type: "strikethrough",
					start: Object.assign({}, events[open][1].start),
					end: Object.assign({}, events[index][1].end)
				};
				/** @type {Token} */
				const text = {
					type: "strikethroughText",
					start: Object.assign({}, events[open][1].end),
					end: Object.assign({}, events[index][1].start)
				};
				/** @type {Array<Event>} */
				const nextEvents = [
					[
						"enter",
						strikethrough,
						context
					],
					[
						"enter",
						events[open][1],
						context
					],
					[
						"exit",
						events[open][1],
						context
					],
					[
						"enter",
						text,
						context
					]
				];
				const insideSpan = context.parser.constructs.insideSpan.null;
				if (insideSpan) splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan, events.slice(open + 1, index), context));
				splice(nextEvents, nextEvents.length, 0, [
					[
						"exit",
						text,
						context
					],
					[
						"enter",
						events[index][1],
						context
					],
					[
						"exit",
						events[index][1],
						context
					],
					[
						"exit",
						strikethrough,
						context
					]
				]);
				splice(events, open - 1, index - open + 3, nextEvents);
				index = open + nextEvents.length - 2;
				break;
			}
		}
		index = -1;
		while (++index < events.length) if (events[index][1].type === "strikethroughSequenceTemporary") events[index][1].type = "data";
		return events;
	}
	/**
	* @this {TokenizeContext}
	* @type {Tokenizer}
	*/
	function tokenizeStrikethrough(effects, ok, nok) {
		const previous = this.previous;
		const events = this.events;
		let size = 0;
		return start;
		/** @type {State} */
		function start(code) {
			if (previous === 126 && events[events.length - 1][1].type !== "characterEscape") return nok(code);
			effects.enter("strikethroughSequenceTemporary");
			return more(code);
		}
		/** @type {State} */
		function more(code) {
			const before = classifyCharacter(previous);
			if (code === 126) {
				if (size > 1) return nok(code);
				effects.consume(code);
				size++;
				return more;
			}
			if (size < 2 && !single) return nok(code);
			const token = effects.exit("strikethroughSequenceTemporary");
			const after = classifyCharacter(code);
			token._open = !after || after === 2 && Boolean(before);
			token._close = !before || before === 2 && Boolean(after);
			return ok(code);
		}
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-table@2.1.1/node_modules/micromark-extension-gfm-table/lib/edit-map.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, Array<Event>]} Change
* @typedef {[number, number, number]} Jump
*/
/**
* Tracks a bunch of edits.
*/
var EditMap = class {
	/**
	* Create a new edit map.
	*/
	constructor() {
		/**
		* Record of changes.
		*
		* @type {Array<Change>}
		*/
		this.map = [];
	}
	/**
	* Create an edit: a remove and/or add at a certain place.
	*
	* @param {number} index
	* @param {number} remove
	* @param {Array<Event>} add
	* @returns {undefined}
	*/
	add(index, remove, add) {
		addImplementation(this, index, remove, add);
	}
	/**
	* Done, change the events.
	*
	* @param {Array<Event>} events
	* @returns {undefined}
	*/
	consume(events) {
		this.map.sort(function(a, b) {
			return a[0] - b[0];
		});
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.length === 0) return;
		let index = this.map.length;
		/** @type {Array<Array<Event>>} */
		const vecs = [];
		while (index > 0) {
			index -= 1;
			vecs.push(events.slice(this.map[index][0] + this.map[index][1]), this.map[index][2]);
			events.length = this.map[index][0];
		}
		vecs.push(events.slice());
		events.length = 0;
		let slice = vecs.pop();
		while (slice) {
			for (const element of slice) events.push(element);
			slice = vecs.pop();
		}
		this.map.length = 0;
	}
};
/**
* Create an edit.
*
* @param {EditMap} editMap
* @param {number} at
* @param {number} remove
* @param {Array<Event>} add
* @returns {undefined}
*/
function addImplementation(editMap, at, remove, add) {
	let index = 0;
	/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
	if (remove === 0 && add.length === 0) return;
	while (index < editMap.map.length) {
		if (editMap.map[index][0] === at) {
			editMap.map[index][1] += remove;
			editMap.map[index][2].push(...add);
			return;
		}
		index += 1;
	}
	editMap.map.push([
		at,
		remove,
		add
	]);
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-table@2.1.1/node_modules/micromark-extension-gfm-table/lib/infer.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {'center' | 'left' | 'none' | 'right'} Align
*/
/**
* Figure out the alignment of a GFM table.
*
* @param {Readonly<Array<Event>>} events
*   List of events.
* @param {number} index
*   Table enter event.
* @returns {Array<Align>}
*   List of aligns.
*/
function gfmTableAlign(events, index) {
	let inDelimiterRow = false;
	/** @type {Array<Align>} */
	const align = [];
	while (index < events.length) {
		const event = events[index];
		if (inDelimiterRow) {
			if (event[0] === "enter") {
				if (event[1].type === "tableContent") align.push(events[index + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			} else if (event[1].type === "tableContent") {
				if (events[index - 1][1].type === "tableDelimiterMarker") {
					const alignIndex = align.length - 1;
					align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
				}
			} else if (event[1].type === "tableDelimiterRow") break;
		} else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") inDelimiterRow = true;
		index += 1;
	}
	return align;
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-table@2.1.1/node_modules/micromark-extension-gfm-table/lib/syntax.js
/**
* @import {Event, Extension, Point, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, number, number]} Range
*   Cell info.
*
* @typedef {0 | 1 | 2 | 3} RowKind
*   Where we are: `1` for head row, `2` for delimiter row, `3` for body row.
*/
/**
* Create an HTML extension for `micromark` to support GitHub tables syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   table syntax.
*/
function gfmTable() {
	return { flow: { null: {
		name: "table",
		tokenize: tokenizeTable,
		resolveAll: resolveTable
	} } };
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTable(effects, ok, nok) {
	const self = this;
	let size = 0;
	let sizeB = 0;
	/** @type {boolean | undefined} */
	let seen;
	return start;
	/**
	* Start of a GFM table.
	*
	* If there is a valid table row or table head before, then we try to parse
	* another row.
	* Otherwise, we try to parse a head.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	* > | | b |
	*     ^
	* ```
	* @type {State}
	*/
	function start(code) {
		let index = self.events.length - 1;
		while (index > -1) {
			const type = self.events[index][1].type;
			if (type === "lineEnding" || type === "linePrefix") index--;
			else break;
		}
		const tail = index > -1 ? self.events[index][1].type : null;
		const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
		if (next === bodyRowStart && self.parser.lazy[self.now().line]) return nok(code);
		return next(code);
	}
	/**
	* Before table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBefore(code) {
		effects.enter("tableHead");
		effects.enter("tableRow");
		return headRowStart(code);
	}
	/**
	* Before table head row, after whitespace.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowStart(code) {
		if (code === 124) return headRowBreak(code);
		seen = true;
		sizeB += 1;
		return headRowBreak(code);
	}
	/**
	* At break in table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*       ^
	*         ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBreak(code) {
		if (code === null) return nok(code);
		if (markdownLineEnding(code)) {
			if (sizeB > 1) {
				sizeB = 0;
				self.interrupt = true;
				effects.exit("tableRow");
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return headDelimiterStart;
			}
			return nok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, headRowBreak, "whitespace")(code);
		sizeB += 1;
		if (seen) {
			seen = false;
			size += 1;
		}
		if (code === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			seen = true;
			return headRowBreak;
		}
		effects.enter("data");
		return headRowData(code);
	}
	/**
	* In table head row data.
	*
	* ```markdown
	* > | | a |
	*       ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowData(code) {
		if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
			effects.exit("data");
			return headRowBreak(code);
		}
		effects.consume(code);
		return code === 92 ? headRowEscape : headRowData;
	}
	/**
	* In table head row escape.
	*
	* ```markdown
	* > | | a\-b |
	*         ^
	*   | | ---- |
	*   | | c    |
	* ```
	*
	* @type {State}
	*/
	function headRowEscape(code) {
		if (code === 92 || code === 124) {
			effects.consume(code);
			return headRowData;
		}
		return headRowData(code);
	}
	/**
	* Before delimiter row.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterStart(code) {
		self.interrupt = false;
		if (self.parser.lazy[self.now().line]) return nok(code);
		effects.enter("tableDelimiterRow");
		seen = false;
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
		return headDelimiterBefore(code);
	}
	/**
	* Before delimiter row, after optional whitespace.
	*
	* Reused when a `|` is found later, to parse another cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterBefore(code) {
		if (code === 45 || code === 58) return headDelimiterValueBefore(code);
		if (code === 124) {
			seen = true;
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			return headDelimiterCellBefore;
		}
		return headDelimiterNok(code);
	}
	/**
	* After `|`, before delimiter cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*      ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellBefore(code) {
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code);
		return headDelimiterValueBefore(code);
	}
	/**
	* Before delimiter cell value.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterValueBefore(code) {
		if (code === 58) {
			sizeB += 1;
			seen = true;
			effects.enter("tableDelimiterMarker");
			effects.consume(code);
			effects.exit("tableDelimiterMarker");
			return headDelimiterLeftAlignmentAfter;
		}
		if (code === 45) {
			sizeB += 1;
			return headDelimiterLeftAlignmentAfter(code);
		}
		if (code === null || markdownLineEnding(code)) return headDelimiterCellAfter(code);
		return headDelimiterNok(code);
	}
	/**
	* After delimiter cell left alignment marker.
	*
	* ```markdown
	*   | | a  |
	* > | | :- |
	*        ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterLeftAlignmentAfter(code) {
		if (code === 45) {
			effects.enter("tableDelimiterFiller");
			return headDelimiterFiller(code);
		}
		return headDelimiterNok(code);
	}
	/**
	* In delimiter cell filler.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterFiller(code) {
		if (code === 45) {
			effects.consume(code);
			return headDelimiterFiller;
		}
		if (code === 58) {
			seen = true;
			effects.exit("tableDelimiterFiller");
			effects.enter("tableDelimiterMarker");
			effects.consume(code);
			effects.exit("tableDelimiterMarker");
			return headDelimiterRightAlignmentAfter;
		}
		effects.exit("tableDelimiterFiller");
		return headDelimiterRightAlignmentAfter(code);
	}
	/**
	* After delimiter cell right alignment marker.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterRightAlignmentAfter(code) {
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code);
		return headDelimiterCellAfter(code);
	}
	/**
	* After delimiter cell.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*          ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellAfter(code) {
		if (code === 124) return headDelimiterBefore(code);
		if (code === null || markdownLineEnding(code)) {
			if (!seen || size !== sizeB) return headDelimiterNok(code);
			effects.exit("tableDelimiterRow");
			effects.exit("tableHead");
			return ok(code);
		}
		return headDelimiterNok(code);
	}
	/**
	* In delimiter row, at a disallowed byte.
	*
	* ```markdown
	*   | | a |
	* > | | x |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterNok(code) {
		return nok(code);
	}
	/**
	* Before table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowStart(code) {
		effects.enter("tableRow");
		return bodyRowBreak(code);
	}
	/**
	* At break in table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	*       ^
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowBreak(code) {
		if (code === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			return bodyRowBreak;
		}
		if (code === null || markdownLineEnding(code)) {
			effects.exit("tableRow");
			return ok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, bodyRowBreak, "whitespace")(code);
		effects.enter("data");
		return bodyRowData(code);
	}
	/**
	* In table body row data.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowData(code) {
		if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
			effects.exit("data");
			return bodyRowBreak(code);
		}
		effects.consume(code);
		return code === 92 ? bodyRowEscape : bodyRowData;
	}
	/**
	* In table body row escape.
	*
	* ```markdown
	*   | | a    |
	*   | | ---- |
	* > | | b\-c |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowEscape(code) {
		if (code === 92 || code === 124) {
			effects.consume(code);
			return bodyRowData;
		}
		return bodyRowData(code);
	}
}
/** @type {Resolver} */
function resolveTable(events, context) {
	let index = -1;
	let inFirstCellAwaitingPipe = true;
	/** @type {RowKind} */
	let rowKind = 0;
	/** @type {Range} */
	let lastCell = [
		0,
		0,
		0,
		0
	];
	/** @type {Range} */
	let cell = [
		0,
		0,
		0,
		0
	];
	let afterHeadAwaitingFirstBodyRow = false;
	let lastTableEnd = 0;
	/** @type {Token | undefined} */
	let currentTable;
	/** @type {Token | undefined} */
	let currentBody;
	/** @type {Token | undefined} */
	let currentCell;
	const map = new EditMap();
	while (++index < events.length) {
		const event = events[index];
		const token = event[1];
		if (event[0] === "enter") {
			if (token.type === "tableHead") {
				afterHeadAwaitingFirstBodyRow = false;
				if (lastTableEnd !== 0) {
					flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
					currentBody = void 0;
					lastTableEnd = 0;
				}
				currentTable = {
					type: "table",
					start: Object.assign({}, token.start),
					end: Object.assign({}, token.end)
				};
				map.add(index, 0, [[
					"enter",
					currentTable,
					context
				]]);
			} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
				inFirstCellAwaitingPipe = true;
				currentCell = void 0;
				lastCell = [
					0,
					0,
					0,
					0
				];
				cell = [
					0,
					index + 1,
					0,
					0
				];
				if (afterHeadAwaitingFirstBodyRow) {
					afterHeadAwaitingFirstBodyRow = false;
					currentBody = {
						type: "tableBody",
						start: Object.assign({}, token.start),
						end: Object.assign({}, token.end)
					};
					map.add(index, 0, [[
						"enter",
						currentBody,
						context
					]]);
				}
				rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
			} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
				inFirstCellAwaitingPipe = false;
				if (cell[2] === 0) {
					if (lastCell[1] !== 0) {
						cell[0] = cell[1];
						currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
						lastCell = [
							0,
							0,
							0,
							0
						];
					}
					cell[2] = index;
				}
			} else if (token.type === "tableCellDivider") {
				if (inFirstCellAwaitingPipe) inFirstCellAwaitingPipe = false;
				else {
					if (lastCell[1] !== 0) {
						cell[0] = cell[1];
						currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
					}
					lastCell = cell;
					cell = [
						lastCell[1],
						index,
						0,
						0
					];
				}
			}
		} else if (token.type === "tableHead") {
			afterHeadAwaitingFirstBodyRow = true;
			lastTableEnd = index;
		} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
			lastTableEnd = index;
			if (lastCell[1] !== 0) {
				cell[0] = cell[1];
				currentCell = flushCell(map, context, lastCell, rowKind, index, currentCell);
			} else if (cell[1] !== 0) currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
			rowKind = 0;
		} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) cell[3] = index;
	}
	if (lastTableEnd !== 0) flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
	map.consume(context.events);
	index = -1;
	while (++index < context.events.length) {
		const event = context.events[index];
		if (event[0] === "enter" && event[1].type === "table") event[1]._align = gfmTableAlign(context.events, index);
	}
	return events;
}
/**
* Generate a cell.
*
* @param {EditMap} map
* @param {Readonly<TokenizeContext>} context
* @param {Readonly<Range>} range
* @param {RowKind} rowKind
* @param {number | undefined} rowEnd
* @param {Token | undefined} previousCell
* @returns {Token | undefined}
*/
function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
	const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
	const valueName = "tableContent";
	if (range[0] !== 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
		map.add(range[0], 0, [[
			"exit",
			previousCell,
			context
		]]);
	}
	const now = getPoint(context.events, range[1]);
	previousCell = {
		type: groupName,
		start: Object.assign({}, now),
		end: Object.assign({}, now)
	};
	map.add(range[1], 0, [[
		"enter",
		previousCell,
		context
	]]);
	if (range[2] !== 0) {
		const relatedStart = getPoint(context.events, range[2]);
		const relatedEnd = getPoint(context.events, range[3]);
		/** @type {Token} */
		const valueToken = {
			type: valueName,
			start: Object.assign({}, relatedStart),
			end: Object.assign({}, relatedEnd)
		};
		map.add(range[2], 0, [[
			"enter",
			valueToken,
			context
		]]);
		if (rowKind !== 2) {
			const start = context.events[range[2]];
			const end = context.events[range[3]];
			start[1].end = Object.assign({}, end[1].end);
			start[1].type = "chunkText";
			start[1].contentType = "text";
			if (range[3] > range[2] + 1) {
				const a = range[2] + 1;
				const b = range[3] - range[2] - 1;
				map.add(a, b, []);
			}
		}
		map.add(range[3] + 1, 0, [[
			"exit",
			valueToken,
			context
		]]);
	}
	if (rowEnd !== void 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
		map.add(rowEnd, 0, [[
			"exit",
			previousCell,
			context
		]]);
		previousCell = void 0;
	}
	return previousCell;
}
/**
* Generate table end (and table body end).
*
* @param {Readonly<EditMap>} map
* @param {Readonly<TokenizeContext>} context
* @param {number} index
* @param {Token} table
* @param {Token | undefined} tableBody
*/
function flushTableEnd(map, context, index, table, tableBody) {
	/** @type {Array<Event>} */
	const exits = [];
	const related = getPoint(context.events, index);
	if (tableBody) {
		tableBody.end = Object.assign({}, related);
		exits.push([
			"exit",
			tableBody,
			context
		]);
	}
	table.end = Object.assign({}, related);
	exits.push([
		"exit",
		table,
		context
	]);
	map.add(index + 1, 0, exits);
}
/**
* @param {Readonly<Array<Event>>} events
* @param {number} index
* @returns {Readonly<Point>}
*/
function getPoint(events, index) {
	const event = events[index];
	const side = event[0] === "enter" ? "start" : "end";
	return event[1][side];
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm-task-list-item@2.1.0/node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
/**
* @import {Extension, State, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
var tasklistCheck = {
	name: "tasklistCheck",
	tokenize: tokenizeTasklistCheck
};
/**
* Create an HTML extension for `micromark` to support GFM task list items
* syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `htmlExtensions` to
*   support GFM task list items when serializing to HTML.
*/
function gfmTaskListItem() {
	return { text: { [91]: tasklistCheck } };
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTasklistCheck(effects, ok, nok) {
	const self = this;
	return open;
	/**
	* At start of task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*       ^
	* ```
	*
	* @type {State}
	*/
	function open(code) {
		if (self.previous !== null || !self._gfmTasklistFirstContentOfListItem) return nok(code);
		effects.enter("taskListCheck");
		effects.enter("taskListCheckMarker");
		effects.consume(code);
		effects.exit("taskListCheckMarker");
		return inside;
	}
	/**
	* In task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*        ^
	* ```
	*
	* @type {State}
	*/
	function inside(code) {
		if (markdownLineEndingOrSpace(code)) {
			effects.enter("taskListCheckValueUnchecked");
			effects.consume(code);
			effects.exit("taskListCheckValueUnchecked");
			return close;
		}
		if (code === 88 || code === 120) {
			effects.enter("taskListCheckValueChecked");
			effects.consume(code);
			effects.exit("taskListCheckValueChecked");
			return close;
		}
		return nok(code);
	}
	/**
	* At close of task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*         ^
	* ```
	*
	* @type {State}
	*/
	function close(code) {
		if (code === 93) {
			effects.enter("taskListCheckMarker");
			effects.consume(code);
			effects.exit("taskListCheckMarker");
			effects.exit("taskListCheck");
			return after;
		}
		return nok(code);
	}
	/**
	* @type {State}
	*/
	function after(code) {
		if (markdownLineEnding(code)) return ok(code);
		if (markdownSpace(code)) return effects.check({ tokenize: spaceThenNonSpace }, ok, nok)(code);
		return nok(code);
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function spaceThenNonSpace(effects, ok, nok) {
	return factorySpace(effects, after, "whitespace");
	/**
	* After whitespace, after task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*           ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		return code === null ? nok(code) : ok(code);
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark-extension-gfm@3.0.0/node_modules/micromark-extension-gfm/index.js
/**
* @typedef {import('micromark-extension-gfm-footnote').HtmlOptions} HtmlOptions
* @typedef {import('micromark-extension-gfm-strikethrough').Options} Options
* @typedef {import('micromark-util-types').Extension} Extension
* @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
*/
/**
* Create an extension for `micromark` to enable GFM syntax.
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
*
*   Passed to `micromark-extens-gfm-strikethrough`.
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   syntax.
*/
function gfm(options) {
	return combineExtensions([
		gfmAutolinkLiteral(),
		gfmFootnote(),
		gfmStrikethrough(options),
		gfmTable(),
		gfmTaskListItem()
	]);
}
//#endregion
//#region ../node_modules/.pnpm/remark-gfm@4.0.1_supports-color@8.1.1/node_modules/remark-gfm/lib/index.js
/**
* @import {Root} from 'mdast'
* @import {Options} from 'remark-gfm'
* @import {} from 'remark-parse'
* @import {} from 'remark-stringify'
* @import {Processor} from 'unified'
*/
/** @type {Options} */
var emptyOptions$1 = {};
/**
* Add support GFM (autolink literals, footnotes, strikethrough, tables,
* tasklists).
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function remarkGfm(options) {
	const self = this;
	const settings = options || emptyOptions$1;
	const data = self.data();
	const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
	const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
	const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
	micromarkExtensions.push(gfm(settings));
	fromMarkdownExtensions.push(gfmFromMarkdown());
	toMarkdownExtensions.push(gfmToMarkdown(settings));
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/initialize/content.js
/**
* @import {
*   InitialConstruct,
*   Initializer,
*   State,
*   TokenizeContext,
*   Token
* } from 'micromark-util-types'
*/
/** @type {InitialConstruct} */
var content = { tokenize: initializeContent };
/**
* @this {TokenizeContext}
*   Context.
* @type {Initializer}
*   Content.
*/
function initializeContent(effects) {
	const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
	/** @type {Token} */
	let previous;
	return contentStart;
	/** @type {State} */
	function afterContentStartConstruct(code) {
		if (code === null) {
			effects.consume(code);
			return;
		}
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return factorySpace(effects, contentStart, "linePrefix");
	}
	/** @type {State} */
	function paragraphInitial(code) {
		effects.enter("paragraph");
		return lineStart(code);
	}
	/** @type {State} */
	function lineStart(code) {
		const token = effects.enter("chunkText", {
			contentType: "text",
			previous
		});
		if (previous) previous.next = token;
		previous = token;
		return data(code);
	}
	/** @type {State} */
	function data(code) {
		if (code === null) {
			effects.exit("chunkText");
			effects.exit("paragraph");
			effects.consume(code);
			return;
		}
		if (markdownLineEnding(code)) {
			effects.consume(code);
			effects.exit("chunkText");
			return lineStart;
		}
		effects.consume(code);
		return data;
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/initialize/document.js
/**
* @import {
*   Construct,
*   ContainerState,
*   InitialConstruct,
*   Initializer,
*   Point,
*   State,
*   TokenizeContext,
*   Tokenizer,
*   Token
* } from 'micromark-util-types'
*/
/**
* @typedef {[Construct, ContainerState]} StackItem
*   Construct and its state.
*/
/** @type {InitialConstruct} */
var document$2 = { tokenize: initializeDocument };
/** @type {Construct} */
var containerConstruct = { tokenize: tokenizeContainer };
/**
* @this {TokenizeContext}
*   Self.
* @type {Initializer}
*   Initializer.
*/
function initializeDocument(effects) {
	const self = this;
	/** @type {Array<StackItem>} */
	const stack = [];
	let continued = 0;
	/** @type {TokenizeContext | undefined} */
	let childFlow;
	/** @type {Token | undefined} */
	let childToken;
	/** @type {number} */
	let lineStartOffset;
	return start;
	/** @type {State} */
	function start(code) {
		if (continued < stack.length) {
			const item = stack[continued];
			self.containerState = item[1];
			return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
		}
		return checkNewContainers(code);
	}
	/** @type {State} */
	function documentContinue(code) {
		continued++;
		if (self.containerState._closeFlow) {
			self.containerState._closeFlow = void 0;
			if (childFlow) closeFlow();
			const indexBeforeExits = self.events.length;
			let indexBeforeFlow = indexBeforeExits;
			/** @type {Point | undefined} */
			let point;
			while (indexBeforeFlow--) if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
				point = self.events[indexBeforeFlow][1].end;
				break;
			}
			exitContainers(continued);
			let index = indexBeforeExits;
			while (index < self.events.length) {
				self.events[index][1].end = { ...point };
				index++;
			}
			splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
			self.events.length = index;
			return checkNewContainers(code);
		}
		return start(code);
	}
	/** @type {State} */
	function checkNewContainers(code) {
		if (continued === stack.length) {
			if (!childFlow) return documentContinued(code);
			if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) return flowStart(code);
			self.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
		}
		self.containerState = {};
		return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
	}
	/** @type {State} */
	function thereIsANewContainer(code) {
		if (childFlow) closeFlow();
		exitContainers(continued);
		return documentContinued(code);
	}
	/** @type {State} */
	function thereIsNoNewContainer(code) {
		self.parser.lazy[self.now().line] = continued !== stack.length;
		lineStartOffset = self.now().offset;
		return flowStart(code);
	}
	/** @type {State} */
	function documentContinued(code) {
		self.containerState = {};
		return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
	}
	/** @type {State} */
	function containerContinue(code) {
		continued++;
		stack.push([self.currentConstruct, self.containerState]);
		return documentContinued(code);
	}
	/** @type {State} */
	function flowStart(code) {
		if (code === null) {
			if (childFlow) closeFlow();
			exitContainers(0);
			effects.consume(code);
			return;
		}
		childFlow = childFlow || self.parser.flow(self.now());
		effects.enter("chunkFlow", {
			_tokenizer: childFlow,
			contentType: "flow",
			previous: childToken
		});
		return flowContinue(code);
	}
	/** @type {State} */
	function flowContinue(code) {
		if (code === null) {
			writeToChild(effects.exit("chunkFlow"), true);
			exitContainers(0);
			effects.consume(code);
			return;
		}
		if (markdownLineEnding(code)) {
			effects.consume(code);
			writeToChild(effects.exit("chunkFlow"));
			continued = 0;
			self.interrupt = void 0;
			return start;
		}
		effects.consume(code);
		return flowContinue;
	}
	/**
	* @param {Token} token
	*   Token.
	* @param {boolean | undefined} [endOfFile]
	*   Whether the token is at the end of the file (default: `false`).
	* @returns {undefined}
	*   Nothing.
	*/
	function writeToChild(token, endOfFile) {
		const stream = self.sliceStream(token);
		if (endOfFile) stream.push(null);
		token.previous = childToken;
		if (childToken) childToken.next = token;
		childToken = token;
		childFlow.defineSkip(token.start);
		childFlow.write(stream);
		if (self.parser.lazy[token.start.line]) {
			let index = childFlow.events.length;
			while (index--) if (childFlow.events[index][1].start.offset < lineStartOffset && (!childFlow.events[index][1].end || childFlow.events[index][1].end.offset > lineStartOffset)) return;
			const indexBeforeExits = self.events.length;
			let indexBeforeFlow = indexBeforeExits;
			/** @type {boolean | undefined} */
			let seen;
			/** @type {Point | undefined} */
			let point;
			while (indexBeforeFlow--) if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
				if (seen) {
					point = self.events[indexBeforeFlow][1].end;
					break;
				}
				seen = true;
			}
			exitContainers(continued);
			index = indexBeforeExits;
			while (index < self.events.length) {
				self.events[index][1].end = { ...point };
				index++;
			}
			splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
			self.events.length = index;
		}
	}
	/**
	* @param {number} size
	*   Size.
	* @returns {undefined}
	*   Nothing.
	*/
	function exitContainers(size) {
		let index = stack.length;
		while (index-- > size) {
			const entry = stack[index];
			self.containerState = entry[1];
			entry[0].exit.call(self, effects);
		}
		stack.length = size;
	}
	function closeFlow() {
		childFlow.write([null]);
		childToken = void 0;
		childFlow = void 0;
		self.containerState._closeFlow = void 0;
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*   Tokenizer.
*/
function tokenizeContainer(effects, ok, nok) {
	return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/initialize/flow.js
/**
* @import {
*   InitialConstruct,
*   Initializer,
*   State,
*   TokenizeContext
* } from 'micromark-util-types'
*/
/** @type {InitialConstruct} */
var flow$1 = { tokenize: initializeFlow };
/**
* @this {TokenizeContext}
*   Self.
* @type {Initializer}
*   Initializer.
*/
function initializeFlow(effects) {
	const self = this;
	const initial = effects.attempt(blankLine, atBlankEnding, effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content$1, afterConstruct)), "linePrefix")));
	return initial;
	/** @type {State} */
	function atBlankEnding(code) {
		if (code === null) {
			effects.consume(code);
			return;
		}
		effects.enter("lineEndingBlank");
		effects.consume(code);
		effects.exit("lineEndingBlank");
		self.currentConstruct = void 0;
		return initial;
	}
	/** @type {State} */
	function afterConstruct(code) {
		if (code === null) {
			effects.consume(code);
			return;
		}
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		self.currentConstruct = void 0;
		return initial;
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/initialize/text.js
/**
* @import {
*   Code,
*   InitialConstruct,
*   Initializer,
*   Resolver,
*   State,
*   TokenizeContext
* } from 'micromark-util-types'
*/
var resolver = { resolveAll: createResolver() };
var string$1 = initializeFactory("string");
var text$2 = initializeFactory("text");
/**
* @param {'string' | 'text'} field
*   Field.
* @returns {InitialConstruct}
*   Construct.
*/
function initializeFactory(field) {
	return {
		resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
		tokenize: initializeText
	};
	/**
	* @this {TokenizeContext}
	*   Context.
	* @type {Initializer}
	*/
	function initializeText(effects) {
		const self = this;
		const constructs = this.parser.constructs[field];
		const text = effects.attempt(constructs, start, notText);
		return start;
		/** @type {State} */
		function start(code) {
			return atBreak(code) ? text(code) : notText(code);
		}
		/** @type {State} */
		function notText(code) {
			if (code === null) {
				effects.consume(code);
				return;
			}
			effects.enter("data");
			effects.consume(code);
			return data;
		}
		/** @type {State} */
		function data(code) {
			if (atBreak(code)) {
				effects.exit("data");
				return text(code);
			}
			effects.consume(code);
			return data;
		}
		/**
		* @param {Code} code
		*   Code.
		* @returns {boolean}
		*   Whether the code is a break.
		*/
		function atBreak(code) {
			if (code === null) return true;
			const list = constructs[code];
			let index = -1;
			if (list) while (++index < list.length) {
				const item = list[index];
				if (!item.previous || item.previous.call(self, self.previous)) return true;
			}
			return false;
		}
	}
}
/**
* @param {Resolver | undefined} [extraResolver]
*   Resolver.
* @returns {Resolver}
*   Resolver.
*/
function createResolver(extraResolver) {
	return resolveAllText;
	/** @type {Resolver} */
	function resolveAllText(events, context) {
		let index = -1;
		/** @type {number | undefined} */
		let enter;
		while (++index <= events.length) if (enter === void 0) {
			if (events[index] && events[index][1].type === "data") {
				enter = index;
				index++;
			}
		} else if (!events[index] || events[index][1].type !== "data") {
			if (index !== enter + 2) {
				events[enter][1].end = events[index - 1][1].end;
				events.splice(enter + 2, index - enter - 2);
				index = enter + 2;
			}
			enter = void 0;
		}
		return extraResolver ? extraResolver(events, context) : events;
	}
}
/**
* A rather ugly set of instructions which again looks at chunks in the input
* stream.
* The reason to do this here is that it is *much* faster to parse in reverse.
* And that we can’t hook into `null` to split the line suffix before an EOF.
* To do: figure out if we can make this into a clean utility, or even in core.
* As it will be useful for GFMs literal autolink extension (and maybe even
* tables?)
*
* @type {Resolver}
*/
function resolveAllLineSuffixes(events, context) {
	let eventIndex = 0;
	while (++eventIndex <= events.length) if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
		const data = events[eventIndex - 1][1];
		const chunks = context.sliceStream(data);
		let index = chunks.length;
		let bufferIndex = -1;
		let size = 0;
		/** @type {boolean | undefined} */
		let tabs;
		while (index--) {
			const chunk = chunks[index];
			if (typeof chunk === "string") {
				bufferIndex = chunk.length;
				while (chunk.charCodeAt(bufferIndex - 1) === 32) {
					size++;
					bufferIndex--;
				}
				if (bufferIndex) break;
				bufferIndex = -1;
			} else if (chunk === -2) {
				tabs = true;
				size++;
			} else if (chunk === -1) {} else {
				index++;
				break;
			}
		}
		if (context._contentTypeTextTrailing && eventIndex === events.length) size = 0;
		if (size) {
			const token = {
				type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
				start: {
					_bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex,
					_index: data.start._index + index,
					line: data.end.line,
					column: data.end.column - size,
					offset: data.end.offset - size
				},
				end: { ...data.end }
			};
			data.end = { ...token.start };
			if (data.start.offset === data.end.offset) Object.assign(data, token);
			else {
				events.splice(eventIndex, 0, [
					"enter",
					token,
					context
				], [
					"exit",
					token,
					context
				]);
				eventIndex += 2;
			}
		}
		eventIndex++;
	}
	return events;
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/constructs.js
/**
* @import {Extension} from 'micromark-util-types'
*/
var constructs_exports = /* @__PURE__ */ __exportAll({
	attentionMarkers: () => attentionMarkers,
	contentInitial: () => contentInitial,
	disable: () => disable,
	document: () => document$1,
	flow: () => flow,
	flowInitial: () => flowInitial,
	insideSpan: () => insideSpan,
	string: () => string,
	text: () => text$1
});
/** @satisfies {Extension['document']} */
var document$1 = {
	[42]: list$1,
	[43]: list$1,
	[45]: list$1,
	[48]: list$1,
	[49]: list$1,
	[50]: list$1,
	[51]: list$1,
	[52]: list$1,
	[53]: list$1,
	[54]: list$1,
	[55]: list$1,
	[56]: list$1,
	[57]: list$1,
	[62]: blockQuote
};
/** @satisfies {Extension['contentInitial']} */
var contentInitial = { [91]: definition };
/** @satisfies {Extension['flowInitial']} */
var flowInitial = {
	[-2]: codeIndented,
	[-1]: codeIndented,
	[32]: codeIndented
};
/** @satisfies {Extension['flow']} */
var flow = {
	[35]: headingAtx,
	[42]: thematicBreak$1,
	[45]: [setextUnderline, thematicBreak$1],
	[60]: htmlFlow,
	[61]: setextUnderline,
	[95]: thematicBreak$1,
	[96]: codeFenced,
	[126]: codeFenced
};
/** @satisfies {Extension['string']} */
var string = {
	[38]: characterReference,
	[92]: characterEscape
};
/** @satisfies {Extension['text']} */
var text$1 = {
	[-5]: lineEnding,
	[-4]: lineEnding,
	[-3]: lineEnding,
	[33]: labelStartImage,
	[38]: characterReference,
	[42]: attention,
	[60]: [autolink, htmlText],
	[91]: labelStartLink,
	[92]: [hardBreakEscape, characterEscape],
	[93]: labelEnd,
	[95]: attention,
	[96]: codeText
};
/** @satisfies {Extension['insideSpan']} */
var insideSpan = { null: [attention, resolver] };
/** @satisfies {Extension['attentionMarkers']} */
var attentionMarkers = { null: [42, 95] };
/** @satisfies {Extension['disable']} */
var disable = { null: [] };
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/create-tokenizer.js
/**
* @import {
*   Chunk,
*   Code,
*   ConstructRecord,
*   Construct,
*   Effects,
*   InitialConstruct,
*   ParseContext,
*   Point,
*   State,
*   TokenizeContext,
*   Token
* } from 'micromark-util-types'
*/
/**
* @callback Restore
*   Restore the state.
* @returns {undefined}
*   Nothing.
*
* @typedef Info
*   Info.
* @property {Restore} restore
*   Restore.
* @property {number} from
*   From.
*
* @callback ReturnHandle
*   Handle a successful run.
* @param {Construct} construct
*   Construct.
* @param {Info} info
*   Info.
* @returns {undefined}
*   Nothing.
*/
/**
* Create a tokenizer.
* Tokenizers deal with one type of data (e.g., containers, flow, text).
* The parser is the object dealing with it all.
* `initialize` works like other constructs, except that only its `tokenize`
* function is used, in which case it doesn’t receive an `ok` or `nok`.
* `from` can be given to set the point before the first character, although
* when further lines are indented, they must be set with `defineSkip`.
*
* @param {ParseContext} parser
*   Parser.
* @param {InitialConstruct} initialize
*   Construct.
* @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
*   Point (optional).
* @returns {TokenizeContext}
*   Context.
*/
function createTokenizer(parser, initialize, from) {
	/** @type {Point} */
	let point = {
		_bufferIndex: -1,
		_index: 0,
		line: from && from.line || 1,
		column: from && from.column || 1,
		offset: from && from.offset || 0
	};
	/** @type {Record<string, number>} */
	const columnStart = {};
	/** @type {Array<Construct>} */
	const resolveAllConstructs = [];
	/** @type {Array<Chunk>} */
	let chunks = [];
	/** @type {Array<Token>} */
	let stack = [];
	/**
	* Tools used for tokenizing.
	*
	* @type {Effects}
	*/
	const effects = {
		attempt: constructFactory(onsuccessfulconstruct),
		check: constructFactory(onsuccessfulcheck),
		consume,
		enter,
		exit,
		interrupt: constructFactory(onsuccessfulcheck, { interrupt: true })
	};
	/**
	* State and tools for resolving and serializing.
	*
	* @type {TokenizeContext}
	*/
	const context = {
		code: null,
		containerState: {},
		defineSkip,
		events: [],
		now,
		parser,
		previous: null,
		sliceSerialize,
		sliceStream,
		write
	};
	/**
	* The state function.
	*
	* @type {State | undefined}
	*/
	let state = initialize.tokenize.call(context, effects);
	if (initialize.resolveAll) resolveAllConstructs.push(initialize);
	return context;
	/** @type {TokenizeContext['write']} */
	function write(slice) {
		chunks = push(chunks, slice);
		main();
		if (chunks[chunks.length - 1] !== null) return [];
		addResult(initialize, 0);
		context.events = resolveAll(resolveAllConstructs, context.events, context);
		return context.events;
	}
	/** @type {TokenizeContext['sliceSerialize']} */
	function sliceSerialize(token, expandTabs) {
		return serializeChunks(sliceStream(token), expandTabs);
	}
	/** @type {TokenizeContext['sliceStream']} */
	function sliceStream(token) {
		return sliceChunks(chunks, token);
	}
	/** @type {TokenizeContext['now']} */
	function now() {
		const { _bufferIndex, _index, line, column, offset } = point;
		return {
			_bufferIndex,
			_index,
			line,
			column,
			offset
		};
	}
	/** @type {TokenizeContext['defineSkip']} */
	function defineSkip(value) {
		columnStart[value.line] = value.column;
		accountForPotentialSkip();
	}
	/**
	* Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
	* `consume`).
	* Here is where we walk through the chunks, which either include strings of
	* several characters, or numerical character codes.
	* The reason to do this in a loop instead of a call is so the stack can
	* drain.
	*
	* @returns {undefined}
	*   Nothing.
	*/
	function main() {
		/** @type {number} */
		let chunkIndex;
		while (point._index < chunks.length) {
			const chunk = chunks[point._index];
			if (typeof chunk === "string") {
				chunkIndex = point._index;
				if (point._bufferIndex < 0) point._bufferIndex = 0;
				while (point._index === chunkIndex && point._bufferIndex < chunk.length) go(chunk.charCodeAt(point._bufferIndex));
			} else go(chunk);
		}
	}
	/**
	* Deal with one code.
	*
	* @param {Code} code
	*   Code.
	* @returns {undefined}
	*   Nothing.
	*/
	function go(code) {
		state = state(code);
	}
	/** @type {Effects['consume']} */
	function consume(code) {
		if (markdownLineEnding(code)) {
			point.line++;
			point.column = 1;
			point.offset += code === -3 ? 2 : 1;
			accountForPotentialSkip();
		} else if (code !== -1) {
			point.column++;
			point.offset++;
		}
		if (point._bufferIndex < 0) point._index++;
		else {
			point._bufferIndex++;
			if (point._bufferIndex === chunks[point._index].length) {
				point._bufferIndex = -1;
				point._index++;
			}
		}
		context.previous = code;
	}
	/** @type {Effects['enter']} */
	function enter(type, fields) {
		/** @type {Token} */
		const token = fields || {};
		token.type = type;
		token.start = now();
		context.events.push([
			"enter",
			token,
			context
		]);
		stack.push(token);
		return token;
	}
	/** @type {Effects['exit']} */
	function exit(type) {
		const token = stack.pop();
		token.end = now();
		context.events.push([
			"exit",
			token,
			context
		]);
		return token;
	}
	/**
	* Use results.
	*
	* @type {ReturnHandle}
	*/
	function onsuccessfulconstruct(construct, info) {
		addResult(construct, info.from);
	}
	/**
	* Discard results.
	*
	* @type {ReturnHandle}
	*/
	function onsuccessfulcheck(_, info) {
		info.restore();
	}
	/**
	* Factory to attempt/check/interrupt.
	*
	* @param {ReturnHandle} onreturn
	*   Callback.
	* @param {{interrupt?: boolean | undefined} | undefined} [fields]
	*   Fields.
	*/
	function constructFactory(onreturn, fields) {
		return hook;
		/**
		* Handle either an object mapping codes to constructs, a list of
		* constructs, or a single construct.
		*
		* @param {Array<Construct> | ConstructRecord | Construct} constructs
		*   Constructs.
		* @param {State} returnState
		*   State.
		* @param {State | undefined} [bogusState]
		*   State.
		* @returns {State}
		*   State.
		*/
		function hook(constructs, returnState, bogusState) {
			/** @type {ReadonlyArray<Construct>} */
			let listOfConstructs;
			/** @type {number} */
			let constructIndex;
			/** @type {Construct} */
			let currentConstruct;
			/** @type {Info} */
			let info;
			return Array.isArray(constructs) ? handleListOfConstructs(constructs) : "tokenize" in constructs ? handleListOfConstructs([constructs]) : handleMapOfConstructs(constructs);
			/**
			* Handle a list of construct.
			*
			* @param {ConstructRecord} map
			*   Constructs.
			* @returns {State}
			*   State.
			*/
			function handleMapOfConstructs(map) {
				return start;
				/** @type {State} */
				function start(code) {
					const left = code !== null && map[code];
					const all = code !== null && map.null;
					return handleListOfConstructs([...Array.isArray(left) ? left : left ? [left] : [], ...Array.isArray(all) ? all : all ? [all] : []])(code);
				}
			}
			/**
			* Handle a list of construct.
			*
			* @param {ReadonlyArray<Construct>} list
			*   Constructs.
			* @returns {State}
			*   State.
			*/
			function handleListOfConstructs(list) {
				listOfConstructs = list;
				constructIndex = 0;
				if (list.length === 0) return bogusState;
				return handleConstruct(list[constructIndex]);
			}
			/**
			* Handle a single construct.
			*
			* @param {Construct} construct
			*   Construct.
			* @returns {State}
			*   State.
			*/
			function handleConstruct(construct) {
				return start;
				/** @type {State} */
				function start(code) {
					info = store();
					currentConstruct = construct;
					if (!construct.partial) context.currentConstruct = construct;
					if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) return nok(code);
					return construct.tokenize.call(fields ? Object.assign(Object.create(context), fields) : context, effects, ok, nok)(code);
				}
			}
			/** @type {State} */
			function ok(code) {
				onreturn(currentConstruct, info);
				return returnState;
			}
			/** @type {State} */
			function nok(code) {
				info.restore();
				if (++constructIndex < listOfConstructs.length) return handleConstruct(listOfConstructs[constructIndex]);
				return bogusState;
			}
		}
	}
	/**
	* @param {Construct} construct
	*   Construct.
	* @param {number} from
	*   From.
	* @returns {undefined}
	*   Nothing.
	*/
	function addResult(construct, from) {
		if (construct.resolveAll && !resolveAllConstructs.includes(construct)) resolveAllConstructs.push(construct);
		if (construct.resolve) splice(context.events, from, context.events.length - from, construct.resolve(context.events.slice(from), context));
		if (construct.resolveTo) context.events = construct.resolveTo(context.events, context);
	}
	/**
	* Store state.
	*
	* @returns {Info}
	*   Info.
	*/
	function store() {
		const startPoint = now();
		const startPrevious = context.previous;
		const startCurrentConstruct = context.currentConstruct;
		const startEventsIndex = context.events.length;
		const startStack = Array.from(stack);
		return {
			from: startEventsIndex,
			restore
		};
		/**
		* Restore state.
		*
		* @returns {undefined}
		*   Nothing.
		*/
		function restore() {
			point = startPoint;
			context.previous = startPrevious;
			context.currentConstruct = startCurrentConstruct;
			context.events.length = startEventsIndex;
			stack = startStack;
			accountForPotentialSkip();
		}
	}
	/**
	* Move the current point a bit forward in the line when it’s on a column
	* skip.
	*
	* @returns {undefined}
	*   Nothing.
	*/
	function accountForPotentialSkip() {
		if (point.line in columnStart && point.column < 2) {
			point.column = columnStart[point.line];
			point.offset += columnStart[point.line] - 1;
		}
	}
}
/**
* Get the chunks from a slice of chunks in the range of a token.
*
* @param {ReadonlyArray<Chunk>} chunks
*   Chunks.
* @param {Pick<Token, 'end' | 'start'>} token
*   Token.
* @returns {Array<Chunk>}
*   Chunks.
*/
function sliceChunks(chunks, token) {
	const startIndex = token.start._index;
	const startBufferIndex = token.start._bufferIndex;
	const endIndex = token.end._index;
	const endBufferIndex = token.end._bufferIndex;
	/** @type {Array<Chunk>} */
	let view;
	if (startIndex === endIndex) view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
	else {
		view = chunks.slice(startIndex, endIndex);
		if (startBufferIndex > -1) {
			const head = view[0];
			if (typeof head === "string") view[0] = head.slice(startBufferIndex);
			else view.shift();
		}
		if (endBufferIndex > 0) view.push(chunks[endIndex].slice(0, endBufferIndex));
	}
	return view;
}
/**
* Get the string value of a slice of chunks.
*
* @param {ReadonlyArray<Chunk>} chunks
*   Chunks.
* @param {boolean | undefined} [expandTabs=false]
*   Whether to expand tabs (default: `false`).
* @returns {string}
*   Result.
*/
function serializeChunks(chunks, expandTabs) {
	let index = -1;
	/** @type {Array<string>} */
	const result = [];
	/** @type {boolean | undefined} */
	let atTab;
	while (++index < chunks.length) {
		const chunk = chunks[index];
		/** @type {string} */
		let value;
		if (typeof chunk === "string") value = chunk;
		else switch (chunk) {
			case -5:
				value = "\r";
				break;
			case -4:
				value = "\n";
				break;
			case -3:
				value = "\r\n";
				break;
			case -2:
				value = expandTabs ? " " : "	";
				break;
			case -1:
				if (!expandTabs && atTab) continue;
				value = " ";
				break;
			default: value = String.fromCharCode(chunk);
		}
		atTab = chunk === -2;
		result.push(value);
	}
	return result.join("");
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/parse.js
/**
* @import {
*   Create,
*   FullNormalizedExtension,
*   InitialConstruct,
*   ParseContext,
*   ParseOptions
* } from 'micromark-util-types'
*/
/**
* @param {ParseOptions | null | undefined} [options]
*   Configuration (optional).
* @returns {ParseContext}
*   Parser.
*/
function parse(options) {
	/** @type {ParseContext} */
	const parser = {
		constructs: combineExtensions([constructs_exports, ...(options || {}).extensions || []]),
		content: create(content),
		defined: [],
		document: create(document$2),
		flow: create(flow$1),
		lazy: {},
		string: create(string$1),
		text: create(text$2)
	};
	return parser;
	/**
	* @param {InitialConstruct} initial
	*   Construct to start with.
	* @returns {Create}
	*   Create a tokenizer.
	*/
	function create(initial) {
		return creator;
		/** @type {Create} */
		function creator(from) {
			return createTokenizer(parser, initial, from);
		}
	}
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/postprocess.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @param {Array<Event>} events
*   Events.
* @returns {Array<Event>}
*   Events.
*/
function postprocess(events) {
	while (!subtokenize(events));
	return events;
}
//#endregion
//#region ../node_modules/.pnpm/micromark@4.0.2_supports-color@8.1.1/node_modules/micromark/lib/preprocess.js
/**
* @import {Chunk, Code, Encoding, Value} from 'micromark-util-types'
*/
/**
* @callback Preprocessor
*   Preprocess a value.
* @param {Value} value
*   Value.
* @param {Encoding | null | undefined} [encoding]
*   Encoding when `value` is a typed array (optional).
* @param {boolean | null | undefined} [end=false]
*   Whether this is the last chunk (default: `false`).
* @returns {Array<Chunk>}
*   Chunks.
*/
var search = /[\0\t\n\r]/g;
/**
* @returns {Preprocessor}
*   Preprocess a value.
*/
function preprocess() {
	let column = 1;
	let buffer = "";
	/** @type {boolean | undefined} */
	let start = true;
	/** @type {boolean | undefined} */
	let atCarriageReturn;
	return preprocessor;
	/** @type {Preprocessor} */
	function preprocessor(value, encoding, end) {
		/** @type {Array<Chunk>} */
		const chunks = [];
		/** @type {RegExpMatchArray | null} */
		let match;
		/** @type {number} */
		let next;
		/** @type {number} */
		let startPosition;
		/** @type {number} */
		let endPosition;
		/** @type {Code} */
		let code;
		value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
		startPosition = 0;
		buffer = "";
		if (start) {
			if (value.charCodeAt(0) === 65279) startPosition++;
			start = void 0;
		}
		while (startPosition < value.length) {
			search.lastIndex = startPosition;
			match = search.exec(value);
			endPosition = match && match.index !== void 0 ? match.index : value.length;
			code = value.charCodeAt(endPosition);
			if (!match) {
				buffer = value.slice(startPosition);
				break;
			}
			if (code === 10 && startPosition === endPosition && atCarriageReturn) {
				chunks.push(-3);
				atCarriageReturn = void 0;
			} else {
				if (atCarriageReturn) {
					chunks.push(-5);
					atCarriageReturn = void 0;
				}
				if (startPosition < endPosition) {
					chunks.push(value.slice(startPosition, endPosition));
					column += endPosition - startPosition;
				}
				switch (code) {
					case 0:
						chunks.push(65533);
						column++;
						break;
					case 9:
						next = Math.ceil(column / 4) * 4;
						chunks.push(-2);
						while (column++ < next) chunks.push(-1);
						break;
					case 10:
						chunks.push(-4);
						column = 1;
						break;
					default:
						atCarriageReturn = true;
						column = 1;
				}
			}
			startPosition = endPosition + 1;
		}
		if (end) {
			if (atCarriageReturn) chunks.push(-5);
			if (buffer) chunks.push(buffer);
			chunks.push(null);
		}
		return chunks;
	}
}
//#endregion
//#region ../node_modules/.pnpm/unist-util-stringify-position@4.0.0/node_modules/unist-util-stringify-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*/
/**
* Serialize the positional info of a point, position (start and end points),
* or node.
*
* @param {Node | NodeLike | Point | PointLike | Position | PositionLike | null | undefined} [value]
*   Node, position, or point.
* @returns {string}
*   Pretty printed positional info of a node (`string`).
*
*   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
*   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
*   column, `s` for `start`, and `e` for end.
*   An empty string (`''`) is returned if the given value is neither `node`,
*   `position`, nor `point`.
*/
function stringifyPosition(value) {
	if (!value || typeof value !== "object") return "";
	if ("position" in value || "type" in value) return position(value.position);
	if ("start" in value || "end" in value) return position(value);
	if ("line" in value || "column" in value) return point$1(value);
	return "";
}
/**
* @param {Point | PointLike | null | undefined} point
* @returns {string}
*/
function point$1(point) {
	return index(point && point.line) + ":" + index(point && point.column);
}
/**
* @param {Position | PositionLike | null | undefined} pos
* @returns {string}
*/
function position(pos) {
	return point$1(pos && pos.start) + "-" + point$1(pos && pos.end);
}
/**
* @param {number | null | undefined} value
* @returns {number}
*/
function index(value) {
	return value && typeof value === "number" ? value : 1;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-from-markdown@2.0.3_supports-color@8.1.1/node_modules/mdast-util-from-markdown/lib/index.js
/**
* @import {
*   Break,
*   Blockquote,
*   Code,
*   Definition,
*   Emphasis,
*   Heading,
*   Html,
*   Image,
*   InlineCode,
*   Link,
*   ListItem,
*   List,
*   Nodes,
*   Paragraph,
*   PhrasingContent,
*   ReferenceType,
*   Root,
*   Strong,
*   Text,
*   ThematicBreak
* } from 'mdast'
* @import {
*   Encoding,
*   Event,
*   Token,
*   Value
* } from 'micromark-util-types'
* @import {Point} from 'unist'
* @import {
*   CompileContext,
*   CompileData,
*   Config,
*   Extension,
*   Handle,
*   OnEnterError,
*   Options
* } from './types.js'
*/
var own$2 = {}.hasOwnProperty;
/**
* Turn markdown into a syntax tree.
*
* @overload
* @param {Value} value
* @param {Encoding | null | undefined} [encoding]
* @param {Options | null | undefined} [options]
* @returns {Root}
*
* @overload
* @param {Value} value
* @param {Options | null | undefined} [options]
* @returns {Root}
*
* @param {Value} value
*   Markdown to parse.
* @param {Encoding | Options | null | undefined} [encoding]
*   Character encoding for when `value` is `Buffer`.
* @param {Options | null | undefined} [options]
*   Configuration.
* @returns {Root}
*   mdast tree.
*/
function fromMarkdown(value, encoding, options) {
	if (encoding && typeof encoding === "object") {
		options = encoding;
		encoding = void 0;
	}
	return compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, true))));
}
/**
* Note this compiler only understand complete buffering, not streaming.
*
* @param {Options | null | undefined} [options]
*/
function compiler(options) {
	/** @type {Config} */
	const config = {
		transforms: [],
		canContainEols: [
			"emphasis",
			"fragment",
			"heading",
			"paragraph",
			"strong"
		],
		enter: {
			autolink: opener(link),
			autolinkProtocol: onenterdata,
			autolinkEmail: onenterdata,
			atxHeading: opener(heading),
			blockQuote: opener(blockQuote),
			characterEscape: onenterdata,
			characterReference: onenterdata,
			codeFenced: opener(codeFlow),
			codeFencedFenceInfo: buffer,
			codeFencedFenceMeta: buffer,
			codeIndented: opener(codeFlow, buffer),
			codeText: opener(codeText, buffer),
			codeTextData: onenterdata,
			data: onenterdata,
			codeFlowValue: onenterdata,
			definition: opener(definition),
			definitionDestinationString: buffer,
			definitionLabelString: buffer,
			definitionTitleString: buffer,
			emphasis: opener(emphasis),
			hardBreakEscape: opener(hardBreak),
			hardBreakTrailing: opener(hardBreak),
			htmlFlow: opener(html, buffer),
			htmlFlowData: onenterdata,
			htmlText: opener(html, buffer),
			htmlTextData: onenterdata,
			image: opener(image),
			label: buffer,
			link: opener(link),
			listItem: opener(listItem),
			listItemValue: onenterlistitemvalue,
			listOrdered: opener(list, onenterlistordered),
			listUnordered: opener(list),
			paragraph: opener(paragraph),
			reference: onenterreference,
			referenceString: buffer,
			resourceDestinationString: buffer,
			resourceTitleString: buffer,
			setextHeading: opener(heading),
			strong: opener(strong),
			thematicBreak: opener(thematicBreak)
		},
		exit: {
			atxHeading: closer(),
			atxHeadingSequence: onexitatxheadingsequence,
			autolink: closer(),
			autolinkEmail: onexitautolinkemail,
			autolinkProtocol: onexitautolinkprotocol,
			blockQuote: closer(),
			characterEscapeValue: onexitdata,
			characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
			characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
			characterReferenceValue: onexitcharacterreferencevalue,
			characterReference: onexitcharacterreference,
			codeFenced: closer(onexitcodefenced),
			codeFencedFence: onexitcodefencedfence,
			codeFencedFenceInfo: onexitcodefencedfenceinfo,
			codeFencedFenceMeta: onexitcodefencedfencemeta,
			codeFlowValue: onexitdata,
			codeIndented: closer(onexitcodeindented),
			codeText: closer(onexitcodetext),
			codeTextData: onexitdata,
			data: onexitdata,
			definition: closer(),
			definitionDestinationString: onexitdefinitiondestinationstring,
			definitionLabelString: onexitdefinitionlabelstring,
			definitionTitleString: onexitdefinitiontitlestring,
			emphasis: closer(),
			hardBreakEscape: closer(onexithardbreak),
			hardBreakTrailing: closer(onexithardbreak),
			htmlFlow: closer(onexithtmlflow),
			htmlFlowData: onexitdata,
			htmlText: closer(onexithtmltext),
			htmlTextData: onexitdata,
			image: closer(onexitimage),
			label: onexitlabel,
			labelText: onexitlabeltext,
			lineEnding: onexitlineending,
			link: closer(onexitlink),
			listItem: closer(),
			listOrdered: closer(),
			listUnordered: closer(),
			paragraph: closer(),
			referenceString: onexitreferencestring,
			resourceDestinationString: onexitresourcedestinationstring,
			resourceTitleString: onexitresourcetitlestring,
			resource: onexitresource,
			setextHeading: closer(onexitsetextheading),
			setextHeadingLineSequence: onexitsetextheadinglinesequence,
			setextHeadingText: onexitsetextheadingtext,
			strong: closer(),
			thematicBreak: closer()
		}
	};
	configure(config, (options || {}).mdastExtensions || []);
	/** @type {CompileData} */
	const data = {};
	return compile;
	/**
	* Turn micromark events into an mdast tree.
	*
	* @param {Array<Event>} events
	*   Events.
	* @returns {Root}
	*   mdast tree.
	*/
	function compile(events) {
		/** @type {Root} */
		let tree = {
			type: "root",
			children: []
		};
		/** @type {Omit<CompileContext, 'sliceSerialize'>} */
		const context = {
			stack: [tree],
			tokenStack: [],
			config,
			enter,
			exit,
			buffer,
			resume,
			data
		};
		/** @type {Array<number>} */
		const listStack = [];
		let index = -1;
		while (++index < events.length) if (events[index][1].type === "listOrdered" || events[index][1].type === "listUnordered") {
			if (events[index][0] === "enter") listStack.push(index);
			else index = prepareList(events, listStack.pop(), index);
		}
		index = -1;
		while (++index < events.length) {
			const handler = config[events[index][0]];
			if (own$2.call(handler, events[index][1].type)) handler[events[index][1].type].call(Object.assign({ sliceSerialize: events[index][2].sliceSerialize }, context), events[index][1]);
		}
		if (context.tokenStack.length > 0) {
			const tail = context.tokenStack[context.tokenStack.length - 1];
			(tail[1] || defaultOnError).call(context, void 0, tail[0]);
		}
		tree.position = {
			start: point(events.length > 0 ? events[0][1].start : {
				line: 1,
				column: 1,
				offset: 0
			}),
			end: point(events.length > 0 ? events[events.length - 2][1].end : {
				line: 1,
				column: 1,
				offset: 0
			})
		};
		index = -1;
		while (++index < config.transforms.length) tree = config.transforms[index](tree) || tree;
		return tree;
	}
	/**
	* @param {Array<Event>} events
	* @param {number} start
	* @param {number} length
	* @returns {number}
	*/
	function prepareList(events, start, length) {
		let index = start - 1;
		let containerBalance = -1;
		let listSpread = false;
		/** @type {Token | undefined} */
		let listItem;
		/** @type {number | undefined} */
		let lineIndex;
		/** @type {number | undefined} */
		let firstBlankLineIndex;
		/** @type {boolean | undefined} */
		let atMarker;
		while (++index <= length) {
			const event = events[index];
			switch (event[1].type) {
				case "listUnordered":
				case "listOrdered":
				case "blockQuote":
					if (event[0] === "enter") containerBalance++;
					else containerBalance--;
					atMarker = void 0;
					break;
				case "lineEndingBlank":
					if (event[0] === "enter") {
						if (listItem && !atMarker && !containerBalance && !firstBlankLineIndex) firstBlankLineIndex = index;
						atMarker = void 0;
					}
					break;
				case "linePrefix":
				case "listItemValue":
				case "listItemMarker":
				case "listItemPrefix":
				case "listItemPrefixWhitespace": break;
				default: atMarker = void 0;
			}
			if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
				if (listItem) {
					let tailIndex = index;
					lineIndex = void 0;
					while (tailIndex--) {
						const tailEvent = events[tailIndex];
						if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
							if (tailEvent[0] === "exit") continue;
							if (lineIndex) {
								events[lineIndex][1].type = "lineEndingBlank";
								listSpread = true;
							}
							tailEvent[1].type = "lineEnding";
							lineIndex = tailIndex;
						} else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {} else break;
					}
					if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) listItem._spread = true;
					listItem.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
					events.splice(lineIndex || index, 0, [
						"exit",
						listItem,
						event[2]
					]);
					index++;
					length++;
				}
				if (event[1].type === "listItemPrefix") {
					/** @type {Token} */
					const item = {
						type: "listItem",
						_spread: false,
						start: Object.assign({}, event[1].start),
						end: void 0
					};
					listItem = item;
					events.splice(index, 0, [
						"enter",
						item,
						event[2]
					]);
					index++;
					length++;
					firstBlankLineIndex = void 0;
					atMarker = true;
				}
			}
		}
		events[start][1]._spread = listSpread;
		return length;
	}
	/**
	* Create an opener handle.
	*
	* @param {(token: Token) => Nodes} create
	*   Create a node.
	* @param {Handle | undefined} [and]
	*   Optional function to also run.
	* @returns {Handle}
	*   Handle.
	*/
	function opener(create, and) {
		return open;
		/**
		* @this {CompileContext}
		* @param {Token} token
		* @returns {undefined}
		*/
		function open(token) {
			enter.call(this, create(token), token);
			if (and) and.call(this, token);
		}
	}
	/**
	* @type {CompileContext['buffer']}
	*/
	function buffer() {
		this.stack.push({
			type: "fragment",
			children: []
		});
	}
	/**
	* @type {CompileContext['enter']}
	*/
	function enter(node, token, errorHandler) {
		this.stack[this.stack.length - 1].children.push(node);
		this.stack.push(node);
		this.tokenStack.push([token, errorHandler || void 0]);
		node.position = {
			start: point(token.start),
			end: void 0
		};
	}
	/**
	* Create a closer handle.
	*
	* @param {Handle | undefined} [and]
	*   Optional function to also run.
	* @returns {Handle}
	*   Handle.
	*/
	function closer(and) {
		return close;
		/**
		* @this {CompileContext}
		* @param {Token} token
		* @returns {undefined}
		*/
		function close(token) {
			if (and) and.call(this, token);
			exit.call(this, token);
		}
	}
	/**
	* @type {CompileContext['exit']}
	*/
	function exit(token, onExitError) {
		const node = this.stack.pop();
		const open = this.tokenStack.pop();
		if (!open) throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
			start: token.start,
			end: token.end
		}) + "): it’s not open");
		else if (open[0].type !== token.type) {
			if (onExitError) onExitError.call(this, token, open[0]);
			else (open[1] || defaultOnError).call(this, token, open[0]);
		}
		node.position.end = point(token.end);
	}
	/**
	* @type {CompileContext['resume']}
	*/
	function resume() {
		return toString(this.stack.pop());
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterlistordered() {
		this.data.expectingFirstListItemValue = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterlistitemvalue(token) {
		if (this.data.expectingFirstListItemValue) {
			const ancestor = this.stack[this.stack.length - 2];
			ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
			this.data.expectingFirstListItemValue = void 0;
		}
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefencedfenceinfo() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.lang = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefencedfencemeta() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.meta = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefencedfence() {
		if (this.data.flowCodeInside) return;
		this.buffer();
		this.data.flowCodeInside = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefenced() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
		this.data.flowCodeInside = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodeindented() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.value = data.replace(/(\r?\n|\r)$/g, "");
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdefinitionlabelstring(token) {
		const label = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.label = label;
		node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdefinitiontitlestring() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.title = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdefinitiondestinationstring() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.url = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitatxheadingsequence(token) {
		const node = this.stack[this.stack.length - 1];
		if (!node.depth) node.depth = this.sliceSerialize(token).length;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitsetextheadingtext() {
		this.data.setextHeadingSlurpLineEnding = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitsetextheadinglinesequence(token) {
		const node = this.stack[this.stack.length - 1];
		node.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitsetextheading() {
		this.data.setextHeadingSlurpLineEnding = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterdata(token) {
		/** @type {Array<Nodes>} */
		const siblings = this.stack[this.stack.length - 1].children;
		let tail = siblings[siblings.length - 1];
		if (!tail || tail.type !== "text") {
			tail = text();
			tail.position = {
				start: point(token.start),
				end: void 0
			};
			siblings.push(tail);
		}
		this.stack.push(tail);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdata(token) {
		const tail = this.stack.pop();
		tail.value += this.sliceSerialize(token);
		tail.position.end = point(token.end);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlineending(token) {
		const context = this.stack[this.stack.length - 1];
		if (this.data.atHardBreak) {
			const tail = context.children[context.children.length - 1];
			tail.position.end = point(token.end);
			this.data.atHardBreak = void 0;
			return;
		}
		if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
			onenterdata.call(this, token);
			onexitdata.call(this, token);
		}
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexithardbreak() {
		this.data.atHardBreak = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexithtmlflow() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.value = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexithtmltext() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.value = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodetext() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.value = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlink() {
		const node = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			/** @type {ReferenceType} */
			const referenceType = this.data.referenceType || "shortcut";
			node.type += "Reference";
			node.referenceType = referenceType;
			delete node.url;
			delete node.title;
		} else {
			delete node.identifier;
			delete node.label;
		}
		this.data.referenceType = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitimage() {
		const node = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			/** @type {ReferenceType} */
			const referenceType = this.data.referenceType || "shortcut";
			node.type += "Reference";
			node.referenceType = referenceType;
			delete node.url;
			delete node.title;
		} else {
			delete node.identifier;
			delete node.label;
		}
		this.data.referenceType = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlabeltext(token) {
		const string = this.sliceSerialize(token);
		const ancestor = this.stack[this.stack.length - 2];
		ancestor.label = decodeString(string);
		ancestor.identifier = normalizeIdentifier(string).toLowerCase();
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlabel() {
		const fragment = this.stack[this.stack.length - 1];
		const value = this.resume();
		const node = this.stack[this.stack.length - 1];
		this.data.inReference = true;
		if (node.type === "link") node.children = fragment.children;
		else node.alt = value;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitresourcedestinationstring() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.url = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitresourcetitlestring() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.title = data;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitresource() {
		this.data.inReference = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterreference() {
		this.data.referenceType = "collapsed";
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitreferencestring(token) {
		const label = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.label = label;
		node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
		this.data.referenceType = "full";
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcharacterreferencemarker(token) {
		this.data.characterReferenceType = token.type;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcharacterreferencevalue(token) {
		const data = this.sliceSerialize(token);
		const type = this.data.characterReferenceType;
		/** @type {string} */
		let value;
		if (type) {
			value = decodeNumericCharacterReference(data, type === "characterReferenceMarkerNumeric" ? 10 : 16);
			this.data.characterReferenceType = void 0;
		} else value = decodeNamedCharacterReference(data);
		const tail = this.stack[this.stack.length - 1];
		tail.value += value;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcharacterreference(token) {
		const tail = this.stack.pop();
		tail.position.end = point(token.end);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitautolinkprotocol(token) {
		onexitdata.call(this, token);
		const node = this.stack[this.stack.length - 1];
		node.url = this.sliceSerialize(token);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitautolinkemail(token) {
		onexitdata.call(this, token);
		const node = this.stack[this.stack.length - 1];
		node.url = "mailto:" + this.sliceSerialize(token);
	}
	/** @returns {Blockquote} */
	function blockQuote() {
		return {
			type: "blockquote",
			children: []
		};
	}
	/** @returns {Code} */
	function codeFlow() {
		return {
			type: "code",
			lang: null,
			meta: null,
			value: ""
		};
	}
	/** @returns {InlineCode} */
	function codeText() {
		return {
			type: "inlineCode",
			value: ""
		};
	}
	/** @returns {Definition} */
	function definition() {
		return {
			type: "definition",
			identifier: "",
			label: null,
			title: null,
			url: ""
		};
	}
	/** @returns {Emphasis} */
	function emphasis() {
		return {
			type: "emphasis",
			children: []
		};
	}
	/** @returns {Heading} */
	function heading() {
		return {
			type: "heading",
			depth: 0,
			children: []
		};
	}
	/** @returns {Break} */
	function hardBreak() {
		return { type: "break" };
	}
	/** @returns {Html} */
	function html() {
		return {
			type: "html",
			value: ""
		};
	}
	/** @returns {Image} */
	function image() {
		return {
			type: "image",
			title: null,
			url: "",
			alt: null
		};
	}
	/** @returns {Link} */
	function link() {
		return {
			type: "link",
			title: null,
			url: "",
			children: []
		};
	}
	/**
	* @param {Token} token
	* @returns {List}
	*/
	function list(token) {
		return {
			type: "list",
			ordered: token.type === "listOrdered",
			start: null,
			spread: token._spread,
			children: []
		};
	}
	/**
	* @param {Token} token
	* @returns {ListItem}
	*/
	function listItem(token) {
		return {
			type: "listItem",
			spread: token._spread,
			checked: null,
			children: []
		};
	}
	/** @returns {Paragraph} */
	function paragraph() {
		return {
			type: "paragraph",
			children: []
		};
	}
	/** @returns {Strong} */
	function strong() {
		return {
			type: "strong",
			children: []
		};
	}
	/** @returns {Text} */
	function text() {
		return {
			type: "text",
			value: ""
		};
	}
	/** @returns {ThematicBreak} */
	function thematicBreak() {
		return { type: "thematicBreak" };
	}
}
/**
* Copy a point-like value.
*
* @param {Point} d
*   Point-like value.
* @returns {Point}
*   unist point.
*/
function point(d) {
	return {
		line: d.line,
		column: d.column,
		offset: d.offset
	};
}
/**
* @param {Config} combined
* @param {Array<Array<Extension> | Extension>} extensions
* @returns {undefined}
*/
function configure(combined, extensions) {
	let index = -1;
	while (++index < extensions.length) {
		const value = extensions[index];
		if (Array.isArray(value)) configure(combined, value);
		else extension(combined, value);
	}
}
/**
* @param {Config} combined
* @param {Extension} extension
* @returns {undefined}
*/
function extension(combined, extension) {
	/** @type {keyof Extension} */
	let key;
	for (key in extension) if (own$2.call(extension, key)) switch (key) {
		case "canContainEols": {
			const right = extension[key];
			if (right) combined[key].push(...right);
			break;
		}
		case "transforms": {
			const right = extension[key];
			if (right) combined[key].push(...right);
			break;
		}
		case "enter":
		case "exit": {
			const right = extension[key];
			if (right) Object.assign(combined[key], right);
			break;
		}
	}
}
/** @type {OnEnterError} */
function defaultOnError(left, right) {
	if (left) throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
		start: left.start,
		end: left.end
	}) + "): a different token (`" + right.type + "`, " + stringifyPosition({
		start: right.start,
		end: right.end
	}) + ") is open");
	else throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
		start: right.start,
		end: right.end
	}) + ") is still open");
}
//#endregion
//#region ../node_modules/.pnpm/remark-parse@11.0.0_supports-color@8.1.1/node_modules/remark-parse/lib/index.js
/**
* @typedef {import('mdast').Root} Root
* @typedef {import('mdast-util-from-markdown').Options} FromMarkdownOptions
* @typedef {import('unified').Parser<Root>} Parser
* @typedef {import('unified').Processor<Root>} Processor
*/
/**
* @typedef {Omit<FromMarkdownOptions, 'extensions' | 'mdastExtensions'>} Options
*/
/**
* Aadd support for parsing from markdown.
*
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function remarkParse(options) {
	/** @type {Processor} */
	const self = this;
	self.parser = parser;
	/**
	* @type {Parser}
	*/
	function parser(doc) {
		return fromMarkdown(doc, {
			...self.data("settings"),
			...options,
			extensions: self.data("micromarkExtensions") || [],
			mdastExtensions: self.data("fromMarkdownExtensions") || []
		});
	}
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
/**
* @import {Element} from 'hast'
* @import {Blockquote} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `blockquote` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Blockquote} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function blockquote(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "blockquote",
		properties: {},
		children: state.wrap(state.all(node), true)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/break.js
/**
* @import {Element, Text} from 'hast'
* @import {Break} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `break` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Break} node
*   mdast node.
* @returns {Array<Element | Text>}
*   hast element content.
*/
function hardBreak(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "br",
		properties: {},
		children: []
	};
	state.patch(node, result);
	return [state.applyData(node, result), {
		type: "text",
		value: "\n"
	}];
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/code.js
/**
* @import {Element, Properties} from 'hast'
* @import {Code} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `code` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Code} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function code(state, node) {
	const value = node.value ? node.value + "\n" : "";
	/** @type {Properties} */
	const properties = {};
	const language = node.lang ? node.lang.split(/\s+/) : [];
	if (language.length > 0) properties.className = ["language-" + language[0]];
	/** @type {Element} */
	let result = {
		type: "element",
		tagName: "code",
		properties,
		children: [{
			type: "text",
			value
		}]
	};
	if (node.meta) result.data = { meta: node.meta };
	state.patch(node, result);
	result = state.applyData(node, result);
	result = {
		type: "element",
		tagName: "pre",
		properties: {},
		children: [result]
	};
	state.patch(node, result);
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/delete.js
/**
* @import {Element} from 'hast'
* @import {Delete} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `delete` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Delete} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function strikethrough(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "del",
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
/**
* @import {Element} from 'hast'
* @import {Emphasis} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `emphasis` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Emphasis} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function emphasis(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "em",
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
/**
* @import {Element} from 'hast'
* @import {FootnoteReference} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `footnoteReference` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {FootnoteReference} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function footnoteReference(state, node) {
	const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
	const id = String(node.identifier).toUpperCase();
	const safeId = normalizeUri(id.toLowerCase());
	const index = state.footnoteOrder.indexOf(id);
	/** @type {number} */
	let counter;
	let reuseCounter = state.footnoteCounts.get(id);
	if (reuseCounter === void 0) {
		reuseCounter = 0;
		state.footnoteOrder.push(id);
		counter = state.footnoteOrder.length;
	} else counter = index + 1;
	reuseCounter += 1;
	state.footnoteCounts.set(id, reuseCounter);
	/** @type {Element} */
	const link = {
		type: "element",
		tagName: "a",
		properties: {
			href: "#" + clobberPrefix + "fn-" + safeId,
			id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
			dataFootnoteRef: true,
			ariaDescribedBy: ["footnote-label"]
		},
		children: [{
			type: "text",
			value: String(counter)
		}]
	};
	state.patch(node, link);
	/** @type {Element} */
	const sup = {
		type: "element",
		tagName: "sup",
		properties: {},
		children: [link]
	};
	state.patch(node, sup);
	return state.applyData(node, sup);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/heading.js
/**
* @import {Element} from 'hast'
* @import {Heading} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `heading` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Heading} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function heading(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "h" + node.depth,
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/html.js
/**
* @import {Element} from 'hast'
* @import {Html} from 'mdast'
* @import {State} from '../state.js'
* @import {Raw} from '../../index.js'
*/
/**
* Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
* nothing).
*
* @param {State} state
*   Info passed around.
* @param {Html} node
*   mdast node.
* @returns {Element | Raw | undefined}
*   hast node.
*/
function html(state, node) {
	if (state.options.allowDangerousHtml) {
		/** @type {Raw} */
		const result = {
			type: "raw",
			value: node.value
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/revert.js
/**
* @import {ElementContent} from 'hast'
* @import {Reference, Nodes} from 'mdast'
* @import {State} from './state.js'
*/
/**
* Return the content of a reference without definition as plain text.
*
* @param {State} state
*   Info passed around.
* @param {Extract<Nodes, Reference>} node
*   Reference node (image, link).
* @returns {Array<ElementContent>}
*   hast content.
*/
function revert(state, node) {
	const subtype = node.referenceType;
	let suffix = "]";
	if (subtype === "collapsed") suffix += "[]";
	else if (subtype === "full") suffix += "[" + (node.label || node.identifier) + "]";
	if (node.type === "imageReference") return [{
		type: "text",
		value: "![" + node.alt + suffix
	}];
	const contents = state.all(node);
	const head = contents[0];
	if (head && head.type === "text") head.value = "[" + head.value;
	else contents.unshift({
		type: "text",
		value: "["
	});
	const tail = contents[contents.length - 1];
	if (tail && tail.type === "text") tail.value += suffix;
	else contents.push({
		type: "text",
		value: suffix
	});
	return contents;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
/**
* @import {ElementContent, Element, Properties} from 'hast'
* @import {ImageReference} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `imageReference` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {ImageReference} node
*   mdast node.
* @returns {Array<ElementContent> | ElementContent}
*   hast node.
*/
function imageReference(state, node) {
	const id = String(node.identifier).toUpperCase();
	const definition = state.definitionById.get(id);
	if (!definition) return revert(state, node);
	/** @type {Properties} */
	const properties = {
		src: normalizeUri(definition.url || ""),
		alt: node.alt
	};
	if (definition.title !== null && definition.title !== void 0) properties.title = definition.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "img",
		properties,
		children: []
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/image.js
/**
* @import {Element, Properties} from 'hast'
* @import {Image} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `image` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Image} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function image(state, node) {
	/** @type {Properties} */
	const properties = { src: normalizeUri(node.url) };
	if (node.alt !== null && node.alt !== void 0) properties.alt = node.alt;
	if (node.title !== null && node.title !== void 0) properties.title = node.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "img",
		properties,
		children: []
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
/**
* @import {Element, Text} from 'hast'
* @import {InlineCode} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `inlineCode` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {InlineCode} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function inlineCode(state, node) {
	/** @type {Text} */
	const text = {
		type: "text",
		value: node.value.replace(/\r?\n|\r/g, " ")
	};
	state.patch(node, text);
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "code",
		properties: {},
		children: [text]
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
/**
* @import {ElementContent, Element, Properties} from 'hast'
* @import {LinkReference} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `linkReference` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {LinkReference} node
*   mdast node.
* @returns {Array<ElementContent> | ElementContent}
*   hast node.
*/
function linkReference(state, node) {
	const id = String(node.identifier).toUpperCase();
	const definition = state.definitionById.get(id);
	if (!definition) return revert(state, node);
	/** @type {Properties} */
	const properties = { href: normalizeUri(definition.url || "") };
	if (definition.title !== null && definition.title !== void 0) properties.title = definition.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "a",
		properties,
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/link.js
/**
* @import {Element, Properties} from 'hast'
* @import {Link} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `link` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Link} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function link(state, node) {
	/** @type {Properties} */
	const properties = { href: normalizeUri(node.url) };
	if (node.title !== null && node.title !== void 0) properties.title = node.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "a",
		properties,
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/list-item.js
/**
* @import {ElementContent, Element, Properties} from 'hast'
* @import {ListItem, Parents} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `listItem` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {ListItem} node
*   mdast node.
* @param {Parents | undefined} parent
*   Parent of `node`.
* @returns {Element}
*   hast node.
*/
function listItem(state, node, parent) {
	const results = state.all(node);
	const loose = parent ? listLoose(parent) : listItemLoose(node);
	/** @type {Properties} */
	const properties = {};
	/** @type {Array<ElementContent>} */
	const children = [];
	if (typeof node.checked === "boolean") {
		const head = results[0];
		/** @type {Element} */
		let paragraph;
		if (head && head.type === "element" && head.tagName === "p") paragraph = head;
		else {
			paragraph = {
				type: "element",
				tagName: "p",
				properties: {},
				children: []
			};
			results.unshift(paragraph);
		}
		if (paragraph.children.length > 0) paragraph.children.unshift({
			type: "text",
			value: " "
		});
		paragraph.children.unshift({
			type: "element",
			tagName: "input",
			properties: {
				type: "checkbox",
				checked: node.checked,
				disabled: true
			},
			children: []
		});
		properties.className = ["task-list-item"];
	}
	let index = -1;
	while (++index < results.length) {
		const child = results[index];
		if (loose || index !== 0 || child.type !== "element" || child.tagName !== "p") children.push({
			type: "text",
			value: "\n"
		});
		if (child.type === "element" && child.tagName === "p" && !loose) children.push(...child.children);
		else children.push(child);
	}
	const tail = results[results.length - 1];
	if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) children.push({
		type: "text",
		value: "\n"
	});
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "li",
		properties,
		children
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
/**
* @param {Parents} node
* @return {Boolean}
*/
function listLoose(node) {
	let loose = false;
	if (node.type === "list") {
		loose = node.spread || false;
		const children = node.children;
		let index = -1;
		while (!loose && ++index < children.length) loose = listItemLoose(children[index]);
	}
	return loose;
}
/**
* @param {ListItem} node
* @return {Boolean}
*/
function listItemLoose(node) {
	const spread = node.spread;
	return spread === null || spread === void 0 ? node.children.length > 1 : spread;
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/list.js
/**
* @import {Element, Properties} from 'hast'
* @import {List} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `list` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {List} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function list(state, node) {
	/** @type {Properties} */
	const properties = {};
	const results = state.all(node);
	let index = -1;
	if (typeof node.start === "number" && node.start !== 1) properties.start = node.start;
	while (++index < results.length) {
		const child = results[index];
		if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
			properties.className = ["contains-task-list"];
			break;
		}
	}
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: node.ordered ? "ol" : "ul",
		properties,
		children: state.wrap(results, true)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
/**
* @import {Element} from 'hast'
* @import {Paragraph} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `paragraph` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Paragraph} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function paragraph(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "p",
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/root.js
/**
* @import {Parents as HastParents, Root as HastRoot} from 'hast'
* @import {Root as MdastRoot} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `root` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {MdastRoot} node
*   mdast node.
* @returns {HastParents}
*   hast node.
*/
function root(state, node) {
	/** @type {HastRoot} */
	const result = {
		type: "root",
		children: state.wrap(state.all(node))
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/strong.js
/**
* @import {Element} from 'hast'
* @import {Strong} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `strong` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Strong} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function strong(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "strong",
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table.js
/**
* @import {Table} from 'mdast'
* @import {Element} from 'hast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `table` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Table} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function table(state, node) {
	const rows = state.all(node);
	const firstRow = rows.shift();
	/** @type {Array<Element>} */
	const tableContent = [];
	if (firstRow) {
		/** @type {Element} */
		const head = {
			type: "element",
			tagName: "thead",
			properties: {},
			children: state.wrap([firstRow], true)
		};
		state.patch(node.children[0], head);
		tableContent.push(head);
	}
	if (rows.length > 0) {
		/** @type {Element} */
		const body = {
			type: "element",
			tagName: "tbody",
			properties: {},
			children: state.wrap(rows, true)
		};
		const start = pointStart(node.children[1]);
		const end = pointEnd(node.children[node.children.length - 1]);
		if (start && end) body.position = {
			start,
			end
		};
		tableContent.push(body);
	}
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "table",
		properties: {},
		children: state.wrap(tableContent, true)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table-row.js
/**
* @import {Element, ElementContent, Properties} from 'hast'
* @import {Parents, TableRow} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `tableRow` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {TableRow} node
*   mdast node.
* @param {Parents | undefined} parent
*   Parent of `node`.
* @returns {Element}
*   hast node.
*/
function tableRow(state, node, parent) {
	const siblings = parent ? parent.children : void 0;
	const tagName = (siblings ? siblings.indexOf(node) : 1) === 0 ? "th" : "td";
	const align = parent && parent.type === "table" ? parent.align : void 0;
	const length = align ? align.length : node.children.length;
	let cellIndex = -1;
	/** @type {Array<ElementContent>} */
	const cells = [];
	while (++cellIndex < length) {
		const cell = node.children[cellIndex];
		/** @type {Properties} */
		const properties = {};
		const alignValue = align ? align[cellIndex] : void 0;
		if (alignValue) properties.align = alignValue;
		/** @type {Element} */
		let result = {
			type: "element",
			tagName,
			properties,
			children: []
		};
		if (cell) {
			result.children = state.all(cell);
			state.patch(cell, result);
			result = state.applyData(cell, result);
		}
		cells.push(result);
	}
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "tr",
		properties: {},
		children: state.wrap(cells, true)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
/**
* @import {Element} from 'hast'
* @import {TableCell} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `tableCell` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {TableCell} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function tableCell(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "td",
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/trim-lines@3.0.1/node_modules/trim-lines/index.js
var tab = 9;
var space = 32;
/**
* Remove initial and final spaces and tabs at the line breaks in `value`.
* Does not trim initial and final spaces and tabs of the value itself.
*
* @param {string} value
*   Value to trim.
* @returns {string}
*   Trimmed value.
*/
function trimLines(value) {
	const source = String(value);
	const search = /\r?\n|\r/g;
	let match = search.exec(source);
	let last = 0;
	/** @type {Array<string>} */
	const lines = [];
	while (match) {
		lines.push(trimLine(source.slice(last, match.index), last > 0, true), match[0]);
		last = match.index + match[0].length;
		match = search.exec(source);
	}
	lines.push(trimLine(source.slice(last), last > 0, false));
	return lines.join("");
}
/**
* @param {string} value
*   Line to trim.
* @param {boolean} start
*   Whether to trim the start of the line.
* @param {boolean} end
*   Whether to trim the end of the line.
* @returns {string}
*   Trimmed line.
*/
function trimLine(value, start, end) {
	let startIndex = 0;
	let endIndex = value.length;
	if (start) {
		let code = value.codePointAt(startIndex);
		while (code === tab || code === space) {
			startIndex++;
			code = value.codePointAt(startIndex);
		}
	}
	if (end) {
		let code = value.codePointAt(endIndex - 1);
		while (code === tab || code === space) {
			endIndex--;
			code = value.codePointAt(endIndex - 1);
		}
	}
	return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/text.js
/**
* @import {Element as HastElement, Text as HastText} from 'hast'
* @import {Text as MdastText} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `text` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {MdastText} node
*   mdast node.
* @returns {HastElement | HastText}
*   hast node.
*/
function text(state, node) {
	/** @type {HastText} */
	const result = {
		type: "text",
		value: trimLines(String(node.value))
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
/**
* @import {Element} from 'hast'
* @import {ThematicBreak} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `thematicBreak` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {ThematicBreak} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function thematicBreak(state, node) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "hr",
		properties: {},
		children: []
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/index.js
/**
* @import {Handlers} from '../state.js'
*/
/**
* Default handlers for nodes.
*
* @satisfies {Handlers}
*/
var handlers = {
	blockquote,
	break: hardBreak,
	code,
	delete: strikethrough,
	emphasis,
	footnoteReference,
	heading,
	html,
	imageReference,
	image,
	inlineCode,
	linkReference,
	link,
	listItem,
	list,
	paragraph,
	root,
	strong,
	table,
	tableCell,
	tableRow,
	text,
	thematicBreak,
	toml: ignore,
	yaml: ignore,
	definition: ignore,
	footnoteDefinition: ignore
};
function ignore() {}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/footer.js
/**
* @import {ElementContent, Element} from 'hast'
* @import {State} from './state.js'
*/
/**
* @callback FootnoteBackContentTemplate
*   Generate content for the backreference dynamically.
*
*   For the following markdown:
*
*   ```markdown
*   Alpha[^micromark], bravo[^micromark], and charlie[^remark].
*
*   [^remark]: things about remark
*   [^micromark]: things about micromark
*   ```
*
*   This function will be called with:
*
*   *  `0` and `0` for the backreference from `things about micromark` to
*      `alpha`, as it is the first used definition, and the first call to it
*   *  `0` and `1` for the backreference from `things about micromark` to
*      `bravo`, as it is the first used definition, and the second call to it
*   *  `1` and `0` for the backreference from `things about remark` to
*      `charlie`, as it is the second used definition
* @param {number} referenceIndex
*   Index of the definition in the order that they are first referenced,
*   0-indexed.
* @param {number} rereferenceIndex
*   Index of calls to the same definition, 0-indexed.
* @returns {Array<ElementContent> | ElementContent | string}
*   Content for the backreference when linking back from definitions to their
*   reference.
*
* @callback FootnoteBackLabelTemplate
*   Generate a back label dynamically.
*
*   For the following markdown:
*
*   ```markdown
*   Alpha[^micromark], bravo[^micromark], and charlie[^remark].
*
*   [^remark]: things about remark
*   [^micromark]: things about micromark
*   ```
*
*   This function will be called with:
*
*   *  `0` and `0` for the backreference from `things about micromark` to
*      `alpha`, as it is the first used definition, and the first call to it
*   *  `0` and `1` for the backreference from `things about micromark` to
*      `bravo`, as it is the first used definition, and the second call to it
*   *  `1` and `0` for the backreference from `things about remark` to
*      `charlie`, as it is the second used definition
* @param {number} referenceIndex
*   Index of the definition in the order that they are first referenced,
*   0-indexed.
* @param {number} rereferenceIndex
*   Index of calls to the same definition, 0-indexed.
* @returns {string}
*   Back label to use when linking back from definitions to their reference.
*/
/**
* Generate the default content that GitHub uses on backreferences.
*
* @param {number} _
*   Index of the definition in the order that they are first referenced,
*   0-indexed.
* @param {number} rereferenceIndex
*   Index of calls to the same definition, 0-indexed.
* @returns {Array<ElementContent>}
*   Content.
*/
function defaultFootnoteBackContent(_, rereferenceIndex) {
	/** @type {Array<ElementContent>} */
	const result = [{
		type: "text",
		value: "↩"
	}];
	if (rereferenceIndex > 1) result.push({
		type: "element",
		tagName: "sup",
		properties: {},
		children: [{
			type: "text",
			value: String(rereferenceIndex)
		}]
	});
	return result;
}
/**
* Generate the default label that GitHub uses on backreferences.
*
* @param {number} referenceIndex
*   Index of the definition in the order that they are first referenced,
*   0-indexed.
* @param {number} rereferenceIndex
*   Index of calls to the same definition, 0-indexed.
* @returns {string}
*   Label.
*/
function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
	return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
}
/**
* Generate a hast footer for called footnote definitions.
*
* @param {State} state
*   Info passed around.
* @returns {Element | undefined}
*   `section` element or `undefined`.
*/
function footer(state) {
	const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
	const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
	const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
	const footnoteLabel = state.options.footnoteLabel || "Footnotes";
	const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
	const footnoteLabelProperties = state.options.footnoteLabelProperties || { className: ["sr-only"] };
	/** @type {Array<ElementContent>} */
	const listItems = [];
	let referenceIndex = -1;
	while (++referenceIndex < state.footnoteOrder.length) {
		const definition = state.footnoteById.get(state.footnoteOrder[referenceIndex]);
		if (!definition) continue;
		const content = state.all(definition);
		const id = String(definition.identifier).toUpperCase();
		const safeId = normalizeUri(id.toLowerCase());
		let rereferenceIndex = 0;
		/** @type {Array<ElementContent>} */
		const backReferences = [];
		const counts = state.footnoteCounts.get(id);
		while (counts !== void 0 && ++rereferenceIndex <= counts) {
			if (backReferences.length > 0) backReferences.push({
				type: "text",
				value: " "
			});
			let children = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
			if (typeof children === "string") children = {
				type: "text",
				value: children
			};
			backReferences.push({
				type: "element",
				tagName: "a",
				properties: {
					href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
					dataFootnoteBackref: "",
					ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
					className: ["data-footnote-backref"]
				},
				children: Array.isArray(children) ? children : [children]
			});
		}
		const tail = content[content.length - 1];
		if (tail && tail.type === "element" && tail.tagName === "p") {
			const tailTail = tail.children[tail.children.length - 1];
			if (tailTail && tailTail.type === "text") tailTail.value += " ";
			else tail.children.push({
				type: "text",
				value: " "
			});
			tail.children.push(...backReferences);
		} else content.push(...backReferences);
		/** @type {Element} */
		const listItem = {
			type: "element",
			tagName: "li",
			properties: { id: clobberPrefix + "fn-" + safeId },
			children: state.wrap(content, true)
		};
		state.patch(definition, listItem);
		listItems.push(listItem);
	}
	if (listItems.length === 0) return;
	return {
		type: "element",
		tagName: "section",
		properties: {
			dataFootnotes: true,
			className: ["footnotes"]
		},
		children: [
			{
				type: "element",
				tagName: footnoteLabelTagName,
				properties: {
					...esm_default(footnoteLabelProperties),
					id: "footnote-label"
				},
				children: [{
					type: "text",
					value: footnoteLabel
				}]
			},
			{
				type: "text",
				value: "\n"
			},
			{
				type: "element",
				tagName: "ol",
				properties: {},
				children: state.wrap(listItems, true)
			},
			{
				type: "text",
				value: "\n"
			}
		]
	};
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/state.js
/**
* @import {
*   ElementContent as HastElementContent,
*   Element as HastElement,
*   Nodes as HastNodes,
*   Properties as HastProperties,
*   RootContent as HastRootContent,
*   Text as HastText
* } from 'hast'
* @import {
*   Definition as MdastDefinition,
*   FootnoteDefinition as MdastFootnoteDefinition,
*   Nodes as MdastNodes,
*   Parents as MdastParents
* } from 'mdast'
* @import {VFile} from 'vfile'
* @import {
*   FootnoteBackContentTemplate,
*   FootnoteBackLabelTemplate
* } from './footer.js'
*/
/**
* @callback Handler
*   Handle a node.
* @param {State} state
*   Info passed around.
* @param {any} node
*   mdast node to handle.
* @param {MdastParents | undefined} parent
*   Parent of `node`.
* @returns {Array<HastElementContent> | HastElementContent | undefined}
*   hast node.
*
* @typedef {Partial<Record<MdastNodes['type'], Handler>>} Handlers
*   Handle nodes.
*
* @typedef Options
*   Configuration (optional).
* @property {boolean | null | undefined} [allowDangerousHtml=false]
*   Whether to persist raw HTML in markdown in the hast tree (default:
*   `false`).
* @property {string | null | undefined} [clobberPrefix='user-content-']
*   Prefix to use before the `id` property on footnotes to prevent them from
*   *clobbering* (default: `'user-content-'`).
*
*   Pass `''` for trusted markdown and when you are careful with
*   polyfilling.
*   You could pass a different prefix.
*
*   DOM clobbering is this:
*
*   ```html
*   <p id="x"></p>
*   <script>alert(x) // `x` now refers to the `p#x` DOM element<\/script>
*   ```
*
*   The above example shows that elements are made available by browsers, by
*   their ID, on the `window` object.
*   This is a security risk because you might be expecting some other variable
*   at that place.
*   It can also break polyfills.
*   Using a prefix solves these problems.
* @property {VFile | null | undefined} [file]
*   Corresponding virtual file representing the input document (optional).
* @property {FootnoteBackContentTemplate | string | null | undefined} [footnoteBackContent]
*   Content of the backreference back to references (default: `defaultFootnoteBackContent`).
*
*   The default value is:
*
*   ```js
*   function defaultFootnoteBackContent(_, rereferenceIndex) {
*     const result = [{type: 'text', value: '↩'}]
*
*     if (rereferenceIndex > 1) {
*       result.push({
*         type: 'element',
*         tagName: 'sup',
*         properties: {},
*         children: [{type: 'text', value: String(rereferenceIndex)}]
*       })
*     }
*
*     return result
*   }
*   ```
*
*   This content is used in the `a` element of each backreference (the `↩`
*   links).
* @property {FootnoteBackLabelTemplate | string | null | undefined} [footnoteBackLabel]
*   Label to describe the backreference back to references (default:
*   `defaultFootnoteBackLabel`).
*
*   The default value is:
*
*   ```js
*   function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
*    return (
*      'Back to reference ' +
*      (referenceIndex + 1) +
*      (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
*    )
*   }
*   ```
*
*   Change it when the markdown is not in English.
*
*   This label is used in the `ariaLabel` property on each backreference
*   (the `↩` links).
*   It affects users of assistive technology.
* @property {string | null | undefined} [footnoteLabel='Footnotes']
*   Textual label to use for the footnotes section (default: `'Footnotes'`).
*
*   Change it when the markdown is not in English.
*
*   This label is typically hidden visually (assuming a `sr-only` CSS class
*   is defined that does that) and so affects screen readers only.
*   If you do have such a class, but want to show this section to everyone,
*   pass different properties with the `footnoteLabelProperties` option.
* @property {HastProperties | null | undefined} [footnoteLabelProperties={className: ['sr-only']}]
*   Properties to use on the footnote label (default: `{className:
*   ['sr-only']}`).
*
*   Change it to show the label and add other properties.
*
*   This label is typically hidden visually (assuming an `sr-only` CSS class
*   is defined that does that) and so affects screen readers only.
*   If you do have such a class, but want to show this section to everyone,
*   pass an empty string.
*   You can also add different properties.
*
*   > **Note**: `id: 'footnote-label'` is always added, because footnote
*   > calls use it with `aria-describedby` to provide an accessible label.
* @property {string | null | undefined} [footnoteLabelTagName='h2']
*   HTML tag name to use for the footnote label element (default: `'h2'`).
*
*   Change it to match your document structure.
*
*   This label is typically hidden visually (assuming a `sr-only` CSS class
*   is defined that does that) and so affects screen readers only.
*   If you do have such a class, but want to show this section to everyone,
*   pass different properties with the `footnoteLabelProperties` option.
* @property {Handlers | null | undefined} [handlers]
*   Extra handlers for nodes (optional).
* @property {Array<MdastNodes['type']> | null | undefined} [passThrough]
*   List of custom mdast node types to pass through (keep) in hast (note that
*   the node itself is passed, but eventual children are transformed)
*   (optional).
* @property {Handler | null | undefined} [unknownHandler]
*   Handler for all unknown nodes (optional).
*
* @typedef State
*   Info passed around.
* @property {(node: MdastNodes) => Array<HastElementContent>} all
*   Transform the children of an mdast parent to hast.
* @property {<Type extends HastNodes>(from: MdastNodes, to: Type) => HastElement | Type} applyData
*   Honor the `data` of `from`, and generate an element instead of `node`.
* @property {Map<string, MdastDefinition>} definitionById
*   Definitions by their identifier.
* @property {Map<string, MdastFootnoteDefinition>} footnoteById
*   Footnote definitions by their identifier.
* @property {Map<string, number>} footnoteCounts
*   Counts for how often the same footnote was called.
* @property {Array<string>} footnoteOrder
*   Identifiers of order when footnote calls first appear in tree order.
* @property {Handlers} handlers
*   Applied handlers.
* @property {(node: MdastNodes, parent: MdastParents | undefined) => Array<HastElementContent> | HastElementContent | undefined} one
*   Transform an mdast node to hast.
* @property {Options} options
*   Configuration.
* @property {(from: MdastNodes, node: HastNodes) => undefined} patch
*   Copy a node’s positional info.
* @property {<Type extends HastRootContent>(nodes: Array<Type>, loose?: boolean | undefined) => Array<HastText | Type>} wrap
*   Wrap `nodes` with line endings between each node, adds initial/final line endings when `loose`.
*/
var own$1 = {}.hasOwnProperty;
/** @type {Options} */
var emptyOptions = {};
/**
* Create `state` from an mdast tree.
*
* @param {MdastNodes} tree
*   mdast node to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {State}
*   `state` function.
*/
function createState(tree, options) {
	const settings = options || emptyOptions;
	/** @type {Map<string, MdastDefinition>} */
	const definitionById = /* @__PURE__ */ new Map();
	/** @type {Map<string, MdastFootnoteDefinition>} */
	const footnoteById = /* @__PURE__ */ new Map();
	/** @type {State} */
	const state = {
		all,
		applyData,
		definitionById,
		footnoteById,
		footnoteCounts: /* @__PURE__ */ new Map(),
		footnoteOrder: [],
		handlers: {
			...handlers,
			...settings.handlers
		},
		one,
		options: settings,
		patch,
		wrap: wrap$1
	};
	visit(tree, function(node) {
		if (node.type === "definition" || node.type === "footnoteDefinition") {
			const map = node.type === "definition" ? definitionById : footnoteById;
			const id = String(node.identifier).toUpperCase();
			if (!map.has(id)) map.set(id, node);
		}
	});
	return state;
	/**
	* Transform an mdast node into a hast node.
	*
	* @param {MdastNodes} node
	*   mdast node.
	* @param {MdastParents | undefined} [parent]
	*   Parent of `node`.
	* @returns {Array<HastElementContent> | HastElementContent | undefined}
	*   Resulting hast node.
	*/
	function one(node, parent) {
		const type = node.type;
		const handle = state.handlers[type];
		if (own$1.call(state.handlers, type) && handle) return handle(state, node, parent);
		if (state.options.passThrough && state.options.passThrough.includes(type)) {
			if ("children" in node) {
				const { children, ...shallow } = node;
				const result = esm_default(shallow);
				result.children = state.all(node);
				return result;
			}
			return esm_default(node);
		}
		return (state.options.unknownHandler || defaultUnknownHandler)(state, node, parent);
	}
	/**
	* Transform the children of an mdast node into hast nodes.
	*
	* @param {MdastNodes} parent
	*   mdast node to compile
	* @returns {Array<HastElementContent>}
	*   Resulting hast nodes.
	*/
	function all(parent) {
		/** @type {Array<HastElementContent>} */
		const values = [];
		if ("children" in parent) {
			const nodes = parent.children;
			let index = -1;
			while (++index < nodes.length) {
				const result = state.one(nodes[index], parent);
				if (result) {
					if (index && nodes[index - 1].type === "break") {
						if (!Array.isArray(result) && result.type === "text") result.value = trimMarkdownSpaceStart(result.value);
						if (!Array.isArray(result) && result.type === "element") {
							const head = result.children[0];
							if (head && head.type === "text") head.value = trimMarkdownSpaceStart(head.value);
						}
					}
					if (Array.isArray(result)) values.push(...result);
					else values.push(result);
				}
			}
		}
		return values;
	}
}
/**
* Copy a node’s positional info.
*
* @param {MdastNodes} from
*   mdast node to copy from.
* @param {HastNodes} to
*   hast node to copy into.
* @returns {undefined}
*   Nothing.
*/
function patch(from, to) {
	if (from.position) to.position = position$1(from);
}
/**
* Honor the `data` of `from` and maybe generate an element instead of `to`.
*
* @template {HastNodes} Type
*   Node type.
* @param {MdastNodes} from
*   mdast node to use data from.
* @param {Type} to
*   hast node to change.
* @returns {HastElement | Type}
*   Nothing.
*/
function applyData(from, to) {
	/** @type {HastElement | Type} */
	let result = to;
	if (from && from.data) {
		const hName = from.data.hName;
		const hChildren = from.data.hChildren;
		const hProperties = from.data.hProperties;
		if (typeof hName === "string") {
			if (result.type === "element") result.tagName = hName;
			else result = {
				type: "element",
				tagName: hName,
				properties: {},
				children: "children" in result ? result.children : [result]
			};
		}
		if (result.type === "element" && hProperties) Object.assign(result.properties, esm_default(hProperties));
		if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) result.children = hChildren;
	}
	return result;
}
/**
* Transform an unknown node.
*
* @param {State} state
*   Info passed around.
* @param {MdastNodes} node
*   Unknown mdast node.
* @returns {HastElement | HastText}
*   Resulting hast node.
*/
function defaultUnknownHandler(state, node) {
	const data = node.data || {};
	/** @type {HastElement | HastText} */
	const result = "value" in node && !(own$1.call(data, "hProperties") || own$1.call(data, "hChildren")) ? {
		type: "text",
		value: node.value
	} : {
		type: "element",
		tagName: "div",
		properties: {},
		children: state.all(node)
	};
	state.patch(node, result);
	return state.applyData(node, result);
}
/**
* Wrap `nodes` with line endings between each node.
*
* @template {HastRootContent} Type
*   Node type.
* @param {Array<Type>} nodes
*   List of nodes to wrap.
* @param {boolean | undefined} [loose=false]
*   Whether to add line endings at start and end (default: `false`).
* @returns {Array<HastText | Type>}
*   Wrapped nodes.
*/
function wrap$1(nodes, loose) {
	/** @type {Array<HastText | Type>} */
	const result = [];
	let index = -1;
	if (loose) result.push({
		type: "text",
		value: "\n"
	});
	while (++index < nodes.length) {
		if (index) result.push({
			type: "text",
			value: "\n"
		});
		result.push(nodes[index]);
	}
	if (loose && nodes.length > 0) result.push({
		type: "text",
		value: "\n"
	});
	return result;
}
/**
* Trim spaces and tabs at the start of `value`.
*
* @param {string} value
*   Value to trim.
* @returns {string}
*   Result.
*/
function trimMarkdownSpaceStart(value) {
	let index = 0;
	let code = value.charCodeAt(index);
	while (code === 9 || code === 32) {
		index++;
		code = value.charCodeAt(index);
	}
	return value.slice(index);
}
//#endregion
//#region ../node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/index.js
/**
* @import {Nodes as HastNodes} from 'hast'
* @import {Nodes as MdastNodes} from 'mdast'
* @import {Options} from './state.js'
*/
/**
* Transform mdast to hast.
*
* ##### Notes
*
* ###### HTML
*
* Raw HTML is available in mdast as `html` nodes and can be embedded in hast
* as semistandard `raw` nodes.
* Most utilities ignore `raw` nodes but two notable ones don’t:
*
* *   `hast-util-to-html` also has an option `allowDangerousHtml` which will
*     output the raw HTML.
*     This is typically discouraged as noted by the option name but is useful
*     if you completely trust authors
* *   `hast-util-raw` can handle the raw embedded HTML strings by parsing them
*     into standard hast nodes (`element`, `text`, etc).
*     This is a heavy task as it needs a full HTML parser, but it is the only
*     way to support untrusted content
*
* ###### Footnotes
*
* Many options supported here relate to footnotes.
* Footnotes are not specified by CommonMark, which we follow by default.
* They are supported by GitHub, so footnotes can be enabled in markdown with
* `mdast-util-gfm`.
*
* The options `footnoteBackLabel` and `footnoteLabel` define natural language
* that explains footnotes, which is hidden for sighted users but shown to
* assistive technology.
* When your page is not in English, you must define translated values.
*
* Back references use ARIA attributes, but the section label itself uses a
* heading that is hidden with an `sr-only` class.
* To show it to sighted users, define different attributes in
* `footnoteLabelProperties`.
*
* ###### Clobbering
*
* Footnotes introduces a problem, as it links footnote calls to footnote
* definitions on the page through `id` attributes generated from user content,
* which results in DOM clobbering.
*
* DOM clobbering is this:
*
* ```html
* <p id=x></p>
* <script>alert(x) // `x` now refers to the DOM `p#x` element<\/script>
* ```
*
* Elements by their ID are made available by browsers on the `window` object,
* which is a security risk.
* Using a prefix solves this problem.
*
* More information on how to handle clobbering and the prefix is explained in
* Example: headings (DOM clobbering) in `rehype-sanitize`.
*
* ###### Unknown nodes
*
* Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
* The default behavior for unknown nodes is:
*
* *   when the node has a `value` (and doesn’t have `data.hName`,
*     `data.hProperties`, or `data.hChildren`, see later), create a hast `text`
*     node
* *   otherwise, create a `<div>` element (which could be changed with
*     `data.hName`), with its children mapped from mdast to hast as well
*
* This behavior can be changed by passing an `unknownHandler`.
*
* @param {MdastNodes} tree
*   mdast tree.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {HastNodes}
*   hast tree.
*/
function toHast(tree, options) {
	const state = createState(tree, options);
	const node = state.one(tree, void 0);
	const foot = footer(state);
	/** @type {HastNodes} */
	const result = Array.isArray(node) ? {
		type: "root",
		children: node
	} : node || {
		type: "root",
		children: []
	};
	if (foot) {
		"children" in result;
		result.children.push({
			type: "text",
			value: "\n"
		}, foot);
	}
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/remark-rehype@11.1.2/node_modules/remark-rehype/lib/index.js
/**
* @import {Root as HastRoot} from 'hast'
* @import {Root as MdastRoot} from 'mdast'
* @import {Options as ToHastOptions} from 'mdast-util-to-hast'
* @import {Processor} from 'unified'
* @import {VFile} from 'vfile'
*/
/**
* @typedef {Omit<ToHastOptions, 'file'>} Options
*
* @callback TransformBridge
*   Bridge-mode.
*
*   Runs the destination with the new hast tree.
*   Discards result.
* @param {MdastRoot} tree
*   Tree.
* @param {VFile} file
*   File.
* @returns {Promise<undefined>}
*   Nothing.
*
* @callback TransformMutate
*  Mutate-mode.
*
*  Further transformers run on the hast tree.
* @param {MdastRoot} tree
*   Tree.
* @param {VFile} file
*   File.
* @returns {HastRoot}
*   Tree (hast).
*/
/**
* Turn markdown into HTML.
*
* ##### Notes
*
* ###### Signature
*
* * if a processor is given,
*   runs the (rehype) plugins used on it with a hast tree,
*   then discards the result (*bridge mode*)
* * otherwise,
*   returns a hast tree,
*   the plugins used after `remarkRehype` are rehype plugins (*mutate mode*)
*
* > 👉 **Note**:
* > It’s highly unlikely that you want to pass a `processor`.
*
* ###### HTML
*
* Raw HTML is available in mdast as `html` nodes and can be embedded in hast
* as semistandard `raw` nodes.
* Most plugins ignore `raw` nodes but two notable ones don’t:
*
* * `rehype-stringify` also has an option `allowDangerousHtml` which will
*   output the raw HTML.
*   This is typically discouraged as noted by the option name but is useful if
*   you completely trust authors
* * `rehype-raw` can handle the raw embedded HTML strings by parsing them
*   into standard hast nodes (`element`, `text`, etc);
*   this is a heavy task as it needs a full HTML parser,
*   but it is the only way to support untrusted content
*
* ###### Footnotes
*
* Many options supported here relate to footnotes.
* Footnotes are not specified by CommonMark,
* which we follow by default.
* They are supported by GitHub,
* so footnotes can be enabled in markdown with `remark-gfm`.
*
* The options `footnoteBackLabel` and `footnoteLabel` define natural language
* that explains footnotes,
* which is hidden for sighted users but shown to assistive technology.
* When your page is not in English,
* you must define translated values.
*
* Back references use ARIA attributes,
* but the section label itself uses a heading that is hidden with an
* `sr-only` class.
* To show it to sighted users,
* define different attributes in `footnoteLabelProperties`.
*
* ###### Clobbering
*
* Footnotes introduces a problem,
* as it links footnote calls to footnote definitions on the page through `id`
* attributes generated from user content,
* which results in DOM clobbering.
*
* DOM clobbering is this:
*
* ```html
* <p id=x></p>
* <script>alert(x) // `x` now refers to the DOM `p#x` element<\/script>
* ```
*
* Elements by their ID are made available by browsers on the `window` object,
* which is a security risk.
* Using a prefix solves this problem.
*
* More information on how to handle clobbering and the prefix is explained in
* *Example: headings (DOM clobbering)* in `rehype-sanitize`.
*
* ###### Unknown nodes
*
* Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
* The default behavior for unknown nodes is:
*
* * when the node has a `value`
*   (and doesn’t have `data.hName`, `data.hProperties`, or `data.hChildren`,
*   see later),
*   create a hast `text` node
* * otherwise,
*   create a `<div>` element (which could be changed with `data.hName`),
*   with its children mapped from mdast to hast as well
*
* This behavior can be changed by passing an `unknownHandler`.
*
* @overload
* @param {Processor} processor
* @param {Readonly<Options> | null | undefined} [options]
* @returns {TransformBridge}
*
* @overload
* @param {Readonly<Options> | null | undefined} [options]
* @returns {TransformMutate}
*
* @overload
* @param {Readonly<Options> | Processor | null | undefined} [destination]
* @param {Readonly<Options> | null | undefined} [options]
* @returns {TransformBridge | TransformMutate}
*
* @param {Readonly<Options> | Processor | null | undefined} [destination]
*   Processor or configuration (optional).
* @param {Readonly<Options> | null | undefined} [options]
*   When a processor was given,
*   configuration (optional).
* @returns {TransformBridge | TransformMutate}
*   Transform.
*/
function remarkRehype(destination, options) {
	if (destination && "run" in destination)
 /**
	* @type {TransformBridge}
	*/
	return async function(tree, file) {
		const hastTree = toHast(tree, {
			file,
			...options
		});
		await destination.run(hastTree, file);
	};
	/**
	* @type {TransformMutate}
	*/
	return function(tree, file) {
		return toHast(tree, {
			file,
			...destination || options
		});
	};
}
//#endregion
//#region ../node_modules/.pnpm/bail@2.0.2/node_modules/bail/index.js
/**
* Throw a given error.
*
* @param {Error|null|undefined} [error]
*   Maybe error.
* @returns {asserts error is null|undefined}
*/
function bail(error) {
	if (error) throw error;
}
//#endregion
//#region ../node_modules/.pnpm/extend@3.0.2/node_modules/extend/index.js
var require_extend = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var defineProperty = Object.defineProperty;
	var gOPD = Object.getOwnPropertyDescriptor;
	var isArray = function isArray(arr) {
		if (typeof Array.isArray === "function") return Array.isArray(arr);
		return toStr.call(arr) === "[object Array]";
	};
	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== "[object Object]") return false;
		var hasOwnConstructor = hasOwn.call(obj, "constructor");
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) return false;
		var key;
		for (key in obj);
		return typeof key === "undefined" || hasOwn.call(obj, key);
	};
	var setProperty = function setProperty(target, options) {
		if (defineProperty && options.name === "__proto__") defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
		else target[options.name] = options.newValue;
	};
	var getProperty = function getProperty(obj, name) {
		if (name === "__proto__") {
			if (!hasOwn.call(obj, name)) return;
			else if (gOPD) return gOPD(obj, name).value;
		}
		return obj[name];
	};
	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone;
		var target = arguments[0];
		var i = 1;
		var length = arguments.length;
		var deep = false;
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if (target == null || typeof target !== "object" && typeof target !== "function") target = {};
		for (; i < length; ++i) {
			options = arguments[i];
			if (options != null) for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);
				if (target !== copy) {
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else clone = src && isPlainObject(src) ? src : {};
						setProperty(target, {
							name,
							newValue: extend(deep, clone, copy)
						});
					} else if (typeof copy !== "undefined") setProperty(target, {
						name,
						newValue: copy
					});
				}
			}
		}
		return target;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/is-plain-obj@4.1.0/node_modules/is-plain-obj/index.js
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
//#endregion
//#region ../node_modules/.pnpm/trough@2.2.0/node_modules/trough/lib/index.js
/**
* @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback
*   Callback.
*
* @typedef {(...input: Array<any>) => any} Middleware
*   Ware.
*
* @typedef Pipeline
*   Pipeline.
* @property {Run} run
*   Run the pipeline.
* @property {Use} use
*   Add middleware.
*
* @typedef {(...input: Array<any>) => void} Run
*   Call all middleware.
*
*   Calls `done` on completion with either an error or the output of the
*   last middleware.
*
*   > 👉 **Note**: as the length of input defines whether async functions get a
*   > `next` function,
*   > it’s recommended to keep `input` at one value normally.

*
* @typedef {(fn: Middleware) => Pipeline} Use
*   Add middleware.
*/
/**
* Create new middleware.
*
* @returns {Pipeline}
*   Pipeline.
*/
function trough() {
	/** @type {Array<Middleware>} */
	const fns = [];
	/** @type {Pipeline} */
	const pipeline = {
		run,
		use
	};
	return pipeline;
	/** @type {Run} */
	function run(...values) {
		let middlewareIndex = -1;
		/** @type {Callback} */
		const callback = values.pop();
		if (typeof callback !== "function") throw new TypeError("Expected function as last argument, not " + callback);
		next(null, ...values);
		/**
		* Run the next `fn`, or we’re done.
		*
		* @param {Error | null | undefined} error
		* @param {Array<any>} output
		*/
		function next(error, ...output) {
			const fn = fns[++middlewareIndex];
			let index = -1;
			if (error) {
				callback(error);
				return;
			}
			while (++index < values.length) if (output[index] === null || output[index] === void 0) output[index] = values[index];
			values = output;
			if (fn) wrap(fn, next)(...output);
			else callback(null, ...output);
		}
	}
	/** @type {Use} */
	function use(middelware) {
		if (typeof middelware !== "function") throw new TypeError("Expected `middelware` to be a function, not " + middelware);
		fns.push(middelware);
		return pipeline;
	}
}
/**
* Wrap `middleware` into a uniform interface.
*
* You can pass all input to the resulting function.
* `callback` is then called with the output of `middleware`.
*
* If `middleware` accepts more arguments than the later given in input,
* an extra `done` function is passed to it after that input,
* which must be called by `middleware`.
*
* The first value in `input` is the main input value.
* All other input values are the rest input values.
* The values given to `callback` are the input values,
* merged with every non-nullish output value.
*
* * if `middleware` throws an error,
*   returns a promise that is rejected,
*   or calls the given `done` function with an error,
*   `callback` is called with that error
* * if `middleware` returns a value or returns a promise that is resolved,
*   that value is the main output value
* * if `middleware` calls `done`,
*   all non-nullish values except for the first one (the error) overwrite the
*   output values
*
* @param {Middleware} middleware
*   Function to wrap.
* @param {Callback} callback
*   Callback called with the output of `middleware`.
* @returns {Run}
*   Wrapped middleware.
*/
function wrap(middleware, callback) {
	/** @type {boolean} */
	let called;
	return wrapped;
	/**
	* Call `middleware`.
	* @this {any}
	* @param {Array<any>} parameters
	* @returns {void}
	*/
	function wrapped(...parameters) {
		const fnExpectsCallback = middleware.length > parameters.length;
		/** @type {any} */
		let result;
		if (fnExpectsCallback) parameters.push(done);
		try {
			result = middleware.apply(this, parameters);
		} catch (error) {
			const exception = error;
			if (fnExpectsCallback && called) throw exception;
			return done(exception);
		}
		if (!fnExpectsCallback) {
			if (result && result.then && typeof result.then === "function") result.then(then, done);
			else if (result instanceof Error) done(result);
			else then(result);
		}
	}
	/**
	* Call `callback`, only once.
	*
	* @type {Callback}
	*/
	function done(error, ...output) {
		if (!called) {
			called = true;
			callback(error, ...output);
		}
	}
	/**
	* Call `done` with one value.
	*
	* @param {any} [value]
	*/
	function then(value) {
		done(null, value);
	}
}
//#endregion
//#region ../node_modules/.pnpm/vfile-message@4.0.3/node_modules/vfile-message/lib/index.js
/**
* @import {Node, Point, Position} from 'unist'
*/
/**
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*
* @typedef Options
*   Configuration.
* @property {Array<Node> | null | undefined} [ancestors]
*   Stack of (inclusive) ancestor nodes surrounding the message (optional).
* @property {Error | null | undefined} [cause]
*   Original error cause of the message (optional).
* @property {Point | Position | null | undefined} [place]
*   Place of message (optional).
* @property {string | null | undefined} [ruleId]
*   Category of message (optional, example: `'my-rule'`).
* @property {string | null | undefined} [source]
*   Namespace of who sent the message (optional, example: `'my-package'`).
*/
/**
* Message.
*/
var VFileMessage = class extends Error {
	/**
	* Create a message for `reason`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {Options | null | undefined} [options]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns
	*   Instance of `VFileMessage`.
	*/
	constructor(causeOrReason, optionsOrParentOrPlace, origin) {
		super();
		if (typeof optionsOrParentOrPlace === "string") {
			origin = optionsOrParentOrPlace;
			optionsOrParentOrPlace = void 0;
		}
		/** @type {string} */
		let reason = "";
		/** @type {Options} */
		let options = {};
		let legacyCause = false;
		if (optionsOrParentOrPlace) {
			if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
			else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
			else if ("type" in optionsOrParentOrPlace) options = {
				ancestors: [optionsOrParentOrPlace],
				place: optionsOrParentOrPlace.position
			};
			else options = { ...optionsOrParentOrPlace };
		}
		if (typeof causeOrReason === "string") reason = causeOrReason;
		else if (!options.cause && causeOrReason) {
			legacyCause = true;
			reason = causeOrReason.message;
			options.cause = causeOrReason;
		}
		if (!options.ruleId && !options.source && typeof origin === "string") {
			const index = origin.indexOf(":");
			if (index === -1) options.ruleId = origin;
			else {
				options.source = origin.slice(0, index);
				options.ruleId = origin.slice(index + 1);
			}
		}
		if (!options.place && options.ancestors && options.ancestors) {
			const parent = options.ancestors[options.ancestors.length - 1];
			if (parent) options.place = parent.position;
		}
		const start = options.place && "start" in options.place ? options.place.start : options.place;
		/**
		* Stack of ancestor nodes surrounding the message.
		*
		* @type {Array<Node> | undefined}
		*/
		this.ancestors = options.ancestors || void 0;
		/**
		* Original error cause of the message.
		*
		* @type {Error | undefined}
		*/
		this.cause = options.cause || void 0;
		/**
		* Starting column of message.
		*
		* @type {number | undefined}
		*/
		this.column = start ? start.column : void 0;
		/**
		* State of problem.
		*
		* * `true` — error, file not usable
		* * `false` — warning, change may be needed
		* * `undefined` — change likely not needed
		*
		* @type {boolean | null | undefined}
		*/
		this.fatal = void 0;
		/**
		* Path of a file (used throughout the `VFile` ecosystem).
		*
		* @type {string | undefined}
		*/
		this.file = "";
		/**
		* Reason for message.
		*
		* @type {string}
		*/
		this.message = reason;
		/**
		* Starting line of error.
		*
		* @type {number | undefined}
		*/
		this.line = start ? start.line : void 0;
		/**
		* Serialized positional info of message.
		*
		* On normal errors, this would be something like `ParseError`, buit in
		* `VFile` messages we use this space to show where an error happened.
		*/
		this.name = stringifyPosition(options.place) || "1:1";
		/**
		* Place of message.
		*
		* @type {Point | Position | undefined}
		*/
		this.place = options.place || void 0;
		/**
		* Reason for message, should use markdown.
		*
		* @type {string}
		*/
		this.reason = this.message;
		/**
		* Category of message (example: `'my-rule'`).
		*
		* @type {string | undefined}
		*/
		this.ruleId = options.ruleId || void 0;
		/**
		* Namespace of message (example: `'my-package'`).
		*
		* @type {string | undefined}
		*/
		this.source = options.source || void 0;
		/**
		* Stack of message.
		*
		* This is used by normal errors to show where something happened in
		* programming code, irrelevant for `VFile` messages,
		*
		* @type {string}
		*/
		this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
		/**
		* Specify the source value that’s being reported, which is deemed
		* incorrect.
		*
		* @type {string | undefined}
		*/
		this.actual = void 0;
		/**
		* Suggest acceptable values that can be used instead of `actual`.
		*
		* @type {Array<string> | undefined}
		*/
		this.expected = void 0;
		/**
		* Long form description of the message (you should use markdown).
		*
		* @type {string | undefined}
		*/
		this.note = void 0;
		/**
		* Link to docs for the message.
		*
		* > 👉 **Note**: this must be an absolute URL that can be passed as `x`
		* > to `new URL(x)`.
		*
		* @type {string | undefined}
		*/
		this.url = void 0;
	}
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;
//#endregion
//#region ../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minpath.browser.js
var minpath = {
	basename,
	dirname,
	extname,
	join,
	sep: "/"
};
/**
* Get the basename from a path.
*
* @param {string} path
*   File path.
* @param {string | null | undefined} [extname]
*   Extension to strip.
* @returns {string}
*   Stem or basename.
*/
function basename(path, extname) {
	if (extname !== void 0 && typeof extname !== "string") throw new TypeError("\"ext\" argument must be a string");
	assertPath$1(path);
	let start = 0;
	let end = -1;
	let index = path.length;
	/** @type {boolean | undefined} */
	let seenNonSlash;
	if (extname === void 0 || extname.length === 0 || extname.length > path.length) {
		while (index--) if (path.codePointAt(index) === 47) {
			if (seenNonSlash) {
				start = index + 1;
				break;
			}
		} else if (end < 0) {
			seenNonSlash = true;
			end = index + 1;
		}
		return end < 0 ? "" : path.slice(start, end);
	}
	if (extname === path) return "";
	let firstNonSlashEnd = -1;
	let extnameIndex = extname.length - 1;
	while (index--) if (path.codePointAt(index) === 47) {
		if (seenNonSlash) {
			start = index + 1;
			break;
		}
	} else {
		if (firstNonSlashEnd < 0) {
			seenNonSlash = true;
			firstNonSlashEnd = index + 1;
		}
		if (extnameIndex > -1) {
			if (path.codePointAt(index) === extname.codePointAt(extnameIndex--)) {
				if (extnameIndex < 0) end = index;
			} else {
				extnameIndex = -1;
				end = firstNonSlashEnd;
			}
		}
	}
	if (start === end) end = firstNonSlashEnd;
	else if (end < 0) end = path.length;
	return path.slice(start, end);
}
/**
* Get the dirname from a path.
*
* @param {string} path
*   File path.
* @returns {string}
*   File path.
*/
function dirname(path) {
	assertPath$1(path);
	if (path.length === 0) return ".";
	let end = -1;
	let index = path.length;
	/** @type {boolean | undefined} */
	let unmatchedSlash;
	while (--index) if (path.codePointAt(index) === 47) {
		if (unmatchedSlash) {
			end = index;
			break;
		}
	} else if (!unmatchedSlash) unmatchedSlash = true;
	return end < 0 ? path.codePointAt(0) === 47 ? "/" : "." : end === 1 && path.codePointAt(0) === 47 ? "//" : path.slice(0, end);
}
/**
* Get an extname from a path.
*
* @param {string} path
*   File path.
* @returns {string}
*   Extname.
*/
function extname(path) {
	assertPath$1(path);
	let index = path.length;
	let end = -1;
	let startPart = 0;
	let startDot = -1;
	let preDotState = 0;
	/** @type {boolean | undefined} */
	let unmatchedSlash;
	while (index--) {
		const code = path.codePointAt(index);
		if (code === 47) {
			if (unmatchedSlash) {
				startPart = index + 1;
				break;
			}
			continue;
		}
		if (end < 0) {
			unmatchedSlash = true;
			end = index + 1;
		}
		if (code === 46) {
			if (startDot < 0) startDot = index;
			else if (preDotState !== 1) preDotState = 1;
		} else if (startDot > -1) preDotState = -1;
	}
	if (startDot < 0 || end < 0 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) return "";
	return path.slice(startDot, end);
}
/**
* Join segments from a path.
*
* @param {Array<string>} segments
*   Path segments.
* @returns {string}
*   File path.
*/
function join(...segments) {
	let index = -1;
	/** @type {string | undefined} */
	let joined;
	while (++index < segments.length) {
		assertPath$1(segments[index]);
		if (segments[index]) joined = joined === void 0 ? segments[index] : joined + "/" + segments[index];
	}
	return joined === void 0 ? "." : normalize(joined);
}
/**
* Normalize a basic file path.
*
* @param {string} path
*   File path.
* @returns {string}
*   File path.
*/
function normalize(path) {
	assertPath$1(path);
	const absolute = path.codePointAt(0) === 47;
	let value = normalizeString(path, !absolute);
	if (value.length === 0 && !absolute) value = ".";
	if (value.length > 0 && path.codePointAt(path.length - 1) === 47) value += "/";
	return absolute ? "/" + value : value;
}
/**
* Resolve `.` and `..` elements in a path with directory names.
*
* @param {string} path
*   File path.
* @param {boolean} allowAboveRoot
*   Whether `..` can move above root.
* @returns {string}
*   File path.
*/
function normalizeString(path, allowAboveRoot) {
	let result = "";
	let lastSegmentLength = 0;
	let lastSlash = -1;
	let dots = 0;
	let index = -1;
	/** @type {number | undefined} */
	let code;
	/** @type {number} */
	let lastSlashIndex;
	while (++index <= path.length) {
		if (index < path.length) code = path.codePointAt(index);
		else if (code === 47) break;
		else code = 47;
		if (code === 47) {
			if (lastSlash === index - 1 || dots === 1) {} else if (lastSlash !== index - 1 && dots === 2) {
				if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
					if (result.length > 2) {
						lastSlashIndex = result.lastIndexOf("/");
						if (lastSlashIndex !== result.length - 1) {
							if (lastSlashIndex < 0) {
								result = "";
								lastSegmentLength = 0;
							} else {
								result = result.slice(0, lastSlashIndex);
								lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
							}
							lastSlash = index;
							dots = 0;
							continue;
						}
					} else if (result.length > 0) {
						result = "";
						lastSegmentLength = 0;
						lastSlash = index;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					result = result.length > 0 ? result + "/.." : "..";
					lastSegmentLength = 2;
				}
			} else {
				if (result.length > 0) result += "/" + path.slice(lastSlash + 1, index);
				else result = path.slice(lastSlash + 1, index);
				lastSegmentLength = index - lastSlash - 1;
			}
			lastSlash = index;
			dots = 0;
		} else if (code === 46 && dots > -1) dots++;
		else dots = -1;
	}
	return result;
}
/**
* Make sure `path` is a string.
*
* @param {string} path
*   File path.
* @returns {asserts path is string}
*   Nothing.
*/
function assertPath$1(path) {
	if (typeof path !== "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
}
//#endregion
//#region ../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minproc.browser.js
var minproc = { cwd };
function cwd() {
	return "/";
}
//#endregion
//#region ../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minurl.shared.js
/**
* Checks if a value has the shape of a WHATWG URL object.
*
* Using a symbol or instanceof would not be able to recognize URL objects
* coming from other implementations (e.g. in Electron), so instead we are
* checking some well known properties for a lack of a better test.
*
* We use `href` and `protocol` as they are the only properties that are
* easy to retrieve and calculate due to the lazy nature of the getters.
*
* We check for auth attribute to distinguish legacy url instance with
* WHATWG URL instance.
*
* @param {unknown} fileUrlOrPath
*   File path or URL.
* @returns {fileUrlOrPath is URL}
*   Whether it’s a URL.
*/
function isUrl(fileUrlOrPath) {
	return Boolean(fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && fileUrlOrPath.auth === void 0);
}
//#endregion
//#region ../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minurl.browser.js
/**
* @param {URL | string} path
*   File URL.
* @returns {string}
*   File URL.
*/
function urlToPath(path) {
	if (typeof path === "string") path = new URL(path);
	else if (!isUrl(path)) {
		/** @type {NodeJS.ErrnoException} */
		const error = /* @__PURE__ */ new TypeError("The \"path\" argument must be of type string or an instance of URL. Received `" + path + "`");
		error.code = "ERR_INVALID_ARG_TYPE";
		throw error;
	}
	if (path.protocol !== "file:") {
		/** @type {NodeJS.ErrnoException} */
		const error = /* @__PURE__ */ new TypeError("The URL must be of scheme file");
		error.code = "ERR_INVALID_URL_SCHEME";
		throw error;
	}
	return getPathFromURLPosix(path);
}
/**
* Get a path from a POSIX URL.
*
* @param {URL} url
*   URL.
* @returns {string}
*   File path.
*/
function getPathFromURLPosix(url) {
	if (url.hostname !== "") {
		/** @type {NodeJS.ErrnoException} */
		const error = /* @__PURE__ */ new TypeError("File URL host must be \"localhost\" or empty on darwin");
		error.code = "ERR_INVALID_FILE_URL_HOST";
		throw error;
	}
	const pathname = url.pathname;
	let index = -1;
	while (++index < pathname.length) if (pathname.codePointAt(index) === 37 && pathname.codePointAt(index + 1) === 50) {
		const third = pathname.codePointAt(index + 2);
		if (third === 70 || third === 102) {
			/** @type {NodeJS.ErrnoException} */
			const error = /* @__PURE__ */ new TypeError("File URL path must not include encoded / characters");
			error.code = "ERR_INVALID_FILE_URL_PATH";
			throw error;
		}
	}
	return decodeURIComponent(pathname);
}
//#endregion
//#region ../node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/index.js
/**
* @import {Node, Point, Position} from 'unist'
* @import {Options as MessageOptions} from 'vfile-message'
* @import {Compatible, Data, Map, Options, Value} from 'vfile'
*/
/**
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*/
/**
* Order of setting (least specific to most), we need this because otherwise
* `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
* stem can be set.
*/
var order = [
	"history",
	"path",
	"basename",
	"stem",
	"extname",
	"dirname"
];
var VFile = class {
	/**
	* Create a new virtual file.
	*
	* `options` is treated as:
	*
	* *   `string` or `Uint8Array` — `{value: options}`
	* *   `URL` — `{path: options}`
	* *   `VFile` — shallow copies its data over to the new file
	* *   `object` — all fields are shallow copied over to the new file
	*
	* Path related fields are set in the following order (least specific to
	* most specific): `history`, `path`, `basename`, `stem`, `extname`,
	* `dirname`.
	*
	* You cannot set `dirname` or `extname` without setting either `history`,
	* `path`, `basename`, or `stem` too.
	*
	* @param {Compatible | null | undefined} [value]
	*   File value.
	* @returns
	*   New instance.
	*/
	constructor(value) {
		/** @type {Options | VFile} */
		let options;
		if (!value) options = {};
		else if (isUrl(value)) options = { path: value };
		else if (typeof value === "string" || isUint8Array$1(value)) options = { value };
		else options = value;
		/**
		* Base of `path` (default: `process.cwd()` or `'/'` in browsers).
		*
		* @type {string}
		*/
		this.cwd = "cwd" in options ? "" : minproc.cwd();
		/**
		* Place to store custom info (default: `{}`).
		*
		* It’s OK to store custom data directly on the file but moving it to
		* `data` is recommended.
		*
		* @type {Data}
		*/
		this.data = {};
		/**
		* List of file paths the file moved between.
		*
		* The first is the original path and the last is the current path.
		*
		* @type {Array<string>}
		*/
		this.history = [];
		/**
		* List of messages associated with the file.
		*
		* @type {Array<VFileMessage>}
		*/
		this.messages = [];
		/**
		* Raw value.
		*
		* @type {Value}
		*/
		this.value;
		/**
		* Source map.
		*
		* This type is equivalent to the `RawSourceMap` type from the `source-map`
		* module.
		*
		* @type {Map | null | undefined}
		*/
		this.map;
		/**
		* Custom, non-string, compiled, representation.
		*
		* This is used by unified to store non-string results.
		* One example is when turning markdown into React nodes.
		*
		* @type {unknown}
		*/
		this.result;
		/**
		* Whether a file was saved to disk.
		*
		* This is used by vfile reporters.
		*
		* @type {boolean}
		*/
		this.stored;
		let index = -1;
		while (++index < order.length) {
			const field = order[index];
			if (field in options && options[field] !== void 0 && options[field] !== null) this[field] = field === "history" ? [...options[field]] : options[field];
		}
		/** @type {string} */
		let field;
		for (field in options) if (!order.includes(field)) this[field] = options[field];
	}
	/**
	* Get the basename (including extname) (example: `'index.min.js'`).
	*
	* @returns {string | undefined}
	*   Basename.
	*/
	get basename() {
		return typeof this.path === "string" ? minpath.basename(this.path) : void 0;
	}
	/**
	* Set basename (including extname) (`'index.min.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*
	* @param {string} basename
	*   Basename.
	* @returns {undefined}
	*   Nothing.
	*/
	set basename(basename) {
		assertNonEmpty(basename, "basename");
		assertPart(basename, "basename");
		this.path = minpath.join(this.dirname || "", basename);
	}
	/**
	* Get the parent path (example: `'~'`).
	*
	* @returns {string | undefined}
	*   Dirname.
	*/
	get dirname() {
		return typeof this.path === "string" ? minpath.dirname(this.path) : void 0;
	}
	/**
	* Set the parent path (example: `'~'`).
	*
	* Cannot be set if there’s no `path` yet.
	*
	* @param {string | undefined} dirname
	*   Dirname.
	* @returns {undefined}
	*   Nothing.
	*/
	set dirname(dirname) {
		assertPath(this.basename, "dirname");
		this.path = minpath.join(dirname || "", this.basename);
	}
	/**
	* Get the extname (including dot) (example: `'.js'`).
	*
	* @returns {string | undefined}
	*   Extname.
	*/
	get extname() {
		return typeof this.path === "string" ? minpath.extname(this.path) : void 0;
	}
	/**
	* Set the extname (including dot) (example: `'.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be set if there’s no `path` yet.
	*
	* @param {string | undefined} extname
	*   Extname.
	* @returns {undefined}
	*   Nothing.
	*/
	set extname(extname) {
		assertPart(extname, "extname");
		assertPath(this.dirname, "extname");
		if (extname) {
			if (extname.codePointAt(0) !== 46) throw new Error("`extname` must start with `.`");
			if (extname.includes(".", 1)) throw new Error("`extname` cannot contain multiple dots");
		}
		this.path = minpath.join(this.dirname, this.stem + (extname || ""));
	}
	/**
	* Get the full path (example: `'~/index.min.js'`).
	*
	* @returns {string}
	*   Path.
	*/
	get path() {
		return this.history[this.history.length - 1];
	}
	/**
	* Set the full path (example: `'~/index.min.js'`).
	*
	* Cannot be nullified.
	* You can set a file URL (a `URL` object with a `file:` protocol) which will
	* be turned into a path with `url.fileURLToPath`.
	*
	* @param {URL | string} path
	*   Path.
	* @returns {undefined}
	*   Nothing.
	*/
	set path(path) {
		if (isUrl(path)) path = urlToPath(path);
		assertNonEmpty(path, "path");
		if (this.path !== path) this.history.push(path);
	}
	/**
	* Get the stem (basename w/o extname) (example: `'index.min'`).
	*
	* @returns {string | undefined}
	*   Stem.
	*/
	get stem() {
		return typeof this.path === "string" ? minpath.basename(this.path, this.extname) : void 0;
	}
	/**
	* Set the stem (basename w/o extname) (example: `'index.min'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*
	* @param {string} stem
	*   Stem.
	* @returns {undefined}
	*   Nothing.
	*/
	set stem(stem) {
		assertNonEmpty(stem, "stem");
		assertPart(stem, "stem");
		this.path = minpath.join(this.dirname || "", stem + (this.extname || ""));
	}
	/**
	* Create a fatal message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `true` (error; file not usable)
	* and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {never}
	*   Never.
	* @throws {VFileMessage}
	*   Message.
	*/
	fail(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
		message.fatal = true;
		throw message;
	}
	/**
	* Create an info message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `undefined` (info; change
	* likely not needed) and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	info(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
		message.fatal = void 0;
		return message;
	}
	/**
	* Create a message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `false` (warning; change may be
	* needed) and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	message(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = new VFileMessage(causeOrReason, optionsOrParentOrPlace, origin);
		if (this.path) {
			message.name = this.path + ":" + message.name;
			message.file = this.path;
		}
		message.fatal = false;
		this.messages.push(message);
		return message;
	}
	/**
	* Serialize the file.
	*
	* > **Note**: which encodings are supported depends on the engine.
	* > For info on Node.js, see:
	* > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
	*
	* @param {string | null | undefined} [encoding='utf8']
	*   Character encoding to understand `value` as when it’s a `Uint8Array`
	*   (default: `'utf-8'`).
	* @returns {string}
	*   Serialized file.
	*/
	toString(encoding) {
		if (this.value === void 0) return "";
		if (typeof this.value === "string") return this.value;
		return new TextDecoder(encoding || void 0).decode(this.value);
	}
};
/**
* Assert that `part` is not a path (as in, does not contain `path.sep`).
*
* @param {string | null | undefined} part
*   File path part.
* @param {string} name
*   Part name.
* @returns {undefined}
*   Nothing.
*/
function assertPart(part, name) {
	if (part && part.includes(minpath.sep)) throw new Error("`" + name + "` cannot be a path: did not expect `" + minpath.sep + "`");
}
/**
* Assert that `part` is not empty.
*
* @param {string | undefined} part
*   Thing.
* @param {string} name
*   Part name.
* @returns {asserts part is string}
*   Nothing.
*/
function assertNonEmpty(part, name) {
	if (!part) throw new Error("`" + name + "` cannot be empty");
}
/**
* Assert `path` exists.
*
* @param {string | undefined} path
*   Path.
* @param {string} name
*   Dependency name.
* @returns {asserts path is string}
*   Nothing.
*/
function assertPath(path, name) {
	if (!path) throw new Error("Setting `" + name + "` requires `path` to be set too");
}
/**
* Assert `value` is an `Uint8Array`.
*
* @param {unknown} value
*   thing.
* @returns {value is Uint8Array}
*   Whether `value` is an `Uint8Array`.
*/
function isUint8Array$1(value) {
	return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}
//#endregion
//#region ../node_modules/.pnpm/unified@11.0.5/node_modules/unified/lib/callable-instance.js
var CallableInstance = function(property) {
	const proto = this.constructor.prototype;
	const value = proto[property];
	/** @type {(...parameters: Array<unknown>) => unknown} */
	const apply = function() {
		return value.apply(apply, arguments);
	};
	Object.setPrototypeOf(apply, proto);
	return apply;
};
//#endregion
//#region ../node_modules/.pnpm/unified@11.0.5/node_modules/unified/lib/index.js
/**
* @typedef {import('trough').Pipeline} Pipeline
*
* @typedef {import('unist').Node} Node
*
* @typedef {import('vfile').Compatible} Compatible
* @typedef {import('vfile').Value} Value
*
* @typedef {import('../index.js').CompileResultMap} CompileResultMap
* @typedef {import('../index.js').Data} Data
* @typedef {import('../index.js').Settings} Settings
*/
/**
* @typedef {CompileResultMap[keyof CompileResultMap]} CompileResults
*   Acceptable results from compilers.
*
*   To register custom results, add them to
*   {@linkcode CompileResultMap}.
*/
/**
* @template {Node} [Tree=Node]
*   The node that the compiler receives (default: `Node`).
* @template {CompileResults} [Result=CompileResults]
*   The thing that the compiler yields (default: `CompileResults`).
* @callback Compiler
*   A **compiler** handles the compiling of a syntax tree to something else
*   (in most cases, text) (TypeScript type).
*
*   It is used in the stringify phase and called with a {@linkcode Node}
*   and {@linkcode VFile} representation of the document to compile.
*   It should return the textual representation of the given tree (typically
*   `string`).
*
*   > **Note**: unified typically compiles by serializing: most compilers
*   > return `string` (or `Uint8Array`).
*   > Some compilers, such as the one configured with
*   > [`rehype-react`][rehype-react], return other values (in this case, a
*   > React tree).
*   > If you’re using a compiler that doesn’t serialize, expect different
*   > result values.
*   >
*   > To register custom results in TypeScript, add them to
*   > {@linkcode CompileResultMap}.
*
*   [rehype-react]: https://github.com/rehypejs/rehype-react
* @param {Tree} tree
*   Tree to compile.
* @param {VFile} file
*   File associated with `tree`.
* @returns {Result}
*   New content: compiled text (`string` or `Uint8Array`, for `file.value`) or
*   something else (for `file.result`).
*/
/**
* @template {Node} [Tree=Node]
*   The node that the parser yields (default: `Node`)
* @callback Parser
*   A **parser** handles the parsing of text to a syntax tree.
*
*   It is used in the parse phase and is called with a `string` and
*   {@linkcode VFile} of the document to parse.
*   It must return the syntax tree representation of the given file
*   ({@linkcode Node}).
* @param {string} document
*   Document to parse.
* @param {VFile} file
*   File associated with `document`.
* @returns {Tree}
*   Node representing the given file.
*/
/**
* @typedef {(
*   Plugin<Array<any>, any, any> |
*   PluginTuple<Array<any>, any, any> |
*   Preset
* )} Pluggable
*   Union of the different ways to add plugins and settings.
*/
/**
* @typedef {Array<Pluggable>} PluggableList
*   List of plugins and presets.
*/
/**
* @template {Array<unknown>} [PluginParameters=[]]
*   Arguments passed to the plugin (default: `[]`, the empty tuple).
* @template {Node | string | undefined} [Input=Node]
*   Value that is expected as input (default: `Node`).
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node it expects.
*   *   If the plugin sets a {@linkcode Parser}, this should be
*       `string`.
*   *   If the plugin sets a {@linkcode Compiler}, this should be the
*       node it expects.
* @template [Output=Input]
*   Value that is yielded as output (default: `Input`).
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node that that yields.
*   *   If the plugin sets a {@linkcode Parser}, this should be the
*       node that it yields.
*   *   If the plugin sets a {@linkcode Compiler}, this should be
*       result it yields.
* @typedef {(
*   (this: Processor, ...parameters: PluginParameters) =>
*     Input extends string ? // Parser.
*        Output extends Node | undefined ? undefined | void : never :
*     Output extends CompileResults ? // Compiler.
*        Input extends Node | undefined ? undefined | void : never :
*     Transformer<
*       Input extends Node ? Input : Node,
*       Output extends Node ? Output : Node
*     > | undefined | void
* )} Plugin
*   Single plugin.
*
*   Plugins configure the processors they are applied on in the following
*   ways:
*
*   *   they change the processor, such as the parser, the compiler, or by
*       configuring data
*   *   they specify how to handle trees and files
*
*   In practice, they are functions that can receive options and configure the
*   processor (`this`).
*
*   > **Note**: plugins are called when the processor is *frozen*, not when
*   > they are applied.
*/
/**
* Tuple of a plugin and its configuration.
*
* The first item is a plugin, the rest are its parameters.
*
* @template {Array<unknown>} [TupleParameters=[]]
*   Arguments passed to the plugin (default: `[]`, the empty tuple).
* @template {Node | string | undefined} [Input=undefined]
*   Value that is expected as input (optional).
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node it expects.
*   *   If the plugin sets a {@linkcode Parser}, this should be
*       `string`.
*   *   If the plugin sets a {@linkcode Compiler}, this should be the
*       node it expects.
* @template [Output=undefined] (optional).
*   Value that is yielded as output.
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node that that yields.
*   *   If the plugin sets a {@linkcode Parser}, this should be the
*       node that it yields.
*   *   If the plugin sets a {@linkcode Compiler}, this should be
*       result it yields.
* @typedef {(
*   [
*     plugin: Plugin<TupleParameters, Input, Output>,
*     ...parameters: TupleParameters
*   ]
* )} PluginTuple
*/
/**
* @typedef Preset
*   Sharable configuration.
*
*   They can contain plugins and settings.
* @property {PluggableList | undefined} [plugins]
*   List of plugins and presets (optional).
* @property {Settings | undefined} [settings]
*   Shared settings for parsers and compilers (optional).
*/
/**
* @template {VFile} [File=VFile]
*   The file that the callback receives (default: `VFile`).
* @callback ProcessCallback
*   Callback called when the process is done.
*
*   Called with either an error or a result.
* @param {Error | undefined} [error]
*   Fatal error (optional).
* @param {File | undefined} [file]
*   Processed file (optional).
* @returns {undefined}
*   Nothing.
*/
/**
* @template {Node} [Tree=Node]
*   The tree that the callback receives (default: `Node`).
* @callback RunCallback
*   Callback called when transformers are done.
*
*   Called with either an error or results.
* @param {Error | undefined} [error]
*   Fatal error (optional).
* @param {Tree | undefined} [tree]
*   Transformed tree (optional).
* @param {VFile | undefined} [file]
*   File (optional).
* @returns {undefined}
*   Nothing.
*/
/**
* @template {Node} [Output=Node]
*   Node type that the transformer yields (default: `Node`).
* @callback TransformCallback
*   Callback passed to transforms.
*
*   If the signature of a `transformer` accepts a third argument, the
*   transformer may perform asynchronous operations, and must call it.
* @param {Error | undefined} [error]
*   Fatal error to stop the process (optional).
* @param {Output | undefined} [tree]
*   New, changed, tree (optional).
* @param {VFile | undefined} [file]
*   New, changed, file (optional).
* @returns {undefined}
*   Nothing.
*/
/**
* @template {Node} [Input=Node]
*   Node type that the transformer expects (default: `Node`).
* @template {Node} [Output=Input]
*   Node type that the transformer yields (default: `Input`).
* @callback Transformer
*   Transformers handle syntax trees and files.
*
*   They are functions that are called each time a syntax tree and file are
*   passed through the run phase.
*   When an error occurs in them (either because it’s thrown, returned,
*   rejected, or passed to `next`), the process stops.
*
*   The run phase is handled by [`trough`][trough], see its documentation for
*   the exact semantics of these functions.
*
*   > **Note**: you should likely ignore `next`: don’t accept it.
*   > it supports callback-style async work.
*   > But promises are likely easier to reason about.
*
*   [trough]: https://github.com/wooorm/trough#function-fninput-next
* @param {Input} tree
*   Tree to handle.
* @param {VFile} file
*   File to handle.
* @param {TransformCallback<Output>} next
*   Callback.
* @returns {(
*   Promise<Output | undefined | void> |
*   Promise<never> | // For some reason this is needed separately.
*   Output |
*   Error |
*   undefined |
*   void
* )}
*   If you accept `next`, nothing.
*   Otherwise:
*
*   *   `Error` — fatal error to stop the process
*   *   `Promise<undefined>` or `undefined` — the next transformer keeps using
*       same tree
*   *   `Promise<Node>` or `Node` — new, changed, tree
*/
/**
* @template {Node | undefined} ParseTree
*   Output of `parse`.
* @template {Node | undefined} HeadTree
*   Input for `run`.
* @template {Node | undefined} TailTree
*   Output for `run`.
* @template {Node | undefined} CompileTree
*   Input of `stringify`.
* @template {CompileResults | undefined} CompileResult
*   Output of `stringify`.
* @template {Node | string | undefined} Input
*   Input of plugin.
* @template Output
*   Output of plugin (optional).
* @typedef {(
*   Input extends string
*     ? Output extends Node | undefined
*       ? // Parser.
*         Processor<
*           Output extends undefined ? ParseTree : Output,
*           HeadTree,
*           TailTree,
*           CompileTree,
*           CompileResult
*         >
*       : // Unknown.
*         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
*     : Output extends CompileResults
*     ? Input extends Node | undefined
*       ? // Compiler.
*         Processor<
*           ParseTree,
*           HeadTree,
*           TailTree,
*           Input extends undefined ? CompileTree : Input,
*           Output extends undefined ? CompileResult : Output
*         >
*       : // Unknown.
*         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
*     : Input extends Node | undefined
*     ? Output extends Node | undefined
*       ? // Transform.
*         Processor<
*           ParseTree,
*           HeadTree extends undefined ? Input : HeadTree,
*           Output extends undefined ? TailTree : Output,
*           CompileTree,
*           CompileResult
*         >
*       : // Unknown.
*         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
*     : // Unknown.
*       Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
* )} UsePlugin
*   Create a processor based on the input/output of a {@link Plugin plugin}.
*/
/**
* @template {CompileResults | undefined} Result
*   Node type that the transformer yields.
* @typedef {(
*   Result extends Value | undefined ?
*     VFile :
*     VFile & {result: Result}
*   )} VFileWithOutput
*   Type to generate a {@linkcode VFile} corresponding to a compiler result.
*
*   If a result that is not acceptable on a `VFile` is used, that will
*   be stored on the `result` field of {@linkcode VFile}.
*/
var import_extend = /* @__PURE__ */ __toESM(require_extend(), 1);
var own = {}.hasOwnProperty;
/**
* Create a new processor.
*
* @example
*   This example shows how a new processor can be created (from `remark`) and linked
*   to **stdin**(4) and **stdout**(4).
*
*   ```js
*   import process from 'node:process'
*   import concatStream from 'concat-stream'
*   import {remark} from 'remark'
*
*   process.stdin.pipe(
*     concatStream(function (buf) {
*       process.stdout.write(String(remark().processSync(buf)))
*     })
*   )
*   ```
*
* @returns
*   New *unfrozen* processor (`processor`).
*
*   This processor is configured to work the same as its ancestor.
*   When the descendant processor is configured in the future it does not
*   affect the ancestral processor.
*/
var unified = new class Processor extends CallableInstance {
	/**
	* Create a processor.
	*/
	constructor() {
		super("copy");
		/**
		* Compiler to use (deprecated).
		*
		* @deprecated
		*   Use `compiler` instead.
		* @type {(
		*   Compiler<
		*     CompileTree extends undefined ? Node : CompileTree,
		*     CompileResult extends undefined ? CompileResults : CompileResult
		*   > |
		*   undefined
		* )}
		*/
		this.Compiler = void 0;
		/**
		* Parser to use (deprecated).
		*
		* @deprecated
		*   Use `parser` instead.
		* @type {(
		*   Parser<ParseTree extends undefined ? Node : ParseTree> |
		*   undefined
		* )}
		*/
		this.Parser = void 0;
		/**
		* Internal list of configured plugins.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Array<PluginTuple<Array<unknown>>>}
		*/
		this.attachers = [];
		/**
		* Compiler to use.
		*
		* @type {(
		*   Compiler<
		*     CompileTree extends undefined ? Node : CompileTree,
		*     CompileResult extends undefined ? CompileResults : CompileResult
		*   > |
		*   undefined
		* )}
		*/
		this.compiler = void 0;
		/**
		* Internal state to track where we are while freezing.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {number}
		*/
		this.freezeIndex = -1;
		/**
		* Internal state to track whether we’re frozen.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {boolean | undefined}
		*/
		this.frozen = void 0;
		/**
		* Internal state.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Data}
		*/
		this.namespace = {};
		/**
		* Parser to use.
		*
		* @type {(
		*   Parser<ParseTree extends undefined ? Node : ParseTree> |
		*   undefined
		* )}
		*/
		this.parser = void 0;
		/**
		* Internal list of configured transformers.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Pipeline}
		*/
		this.transformers = trough();
	}
	/**
	* Copy a processor.
	*
	* @deprecated
	*   This is a private internal method and should not be used.
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   New *unfrozen* processor ({@linkcode Processor}) that is
	*   configured to work the same as its ancestor.
	*   When the descendant processor is configured in the future it does not
	*   affect the ancestral processor.
	*/
	copy() {
		const destination = new Processor();
		let index = -1;
		while (++index < this.attachers.length) {
			const attacher = this.attachers[index];
			destination.use(...attacher);
		}
		destination.data((0, import_extend.default)(true, {}, this.namespace));
		return destination;
	}
	/**
	* Configure the processor with info available to all plugins.
	* Information is stored in an object.
	*
	* Typically, options can be given to a specific plugin, but sometimes it
	* makes sense to have information shared with several plugins.
	* For example, a list of HTML elements that are self-closing, which is
	* needed during all phases.
	*
	* > **Note**: setting information cannot occur on *frozen* processors.
	* > Call the processor first to create a new unfrozen processor.
	*
	* > **Note**: to register custom data in TypeScript, augment the
	* > {@linkcode Data} interface.
	*
	* @example
	*   This example show how to get and set info:
	*
	*   ```js
	*   import {unified} from 'unified'
	*
	*   const processor = unified().data('alpha', 'bravo')
	*
	*   processor.data('alpha') // => 'bravo'
	*
	*   processor.data() // => {alpha: 'bravo'}
	*
	*   processor.data({charlie: 'delta'})
	*
	*   processor.data() // => {charlie: 'delta'}
	*   ```
	*
	* @template {keyof Data} Key
	*
	* @overload
	* @returns {Data}
	*
	* @overload
	* @param {Data} dataset
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {Key} key
	* @returns {Data[Key]}
	*
	* @overload
	* @param {Key} key
	* @param {Data[Key]} value
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @param {Data | Key} [key]
	*   Key to get or set, or entire dataset to set, or nothing to get the
	*   entire dataset (optional).
	* @param {Data[Key]} [value]
	*   Value to set (optional).
	* @returns {unknown}
	*   The current processor when setting, the value at `key` when getting, or
	*   the entire dataset when getting without key.
	*/
	data(key, value) {
		if (typeof key === "string") {
			if (arguments.length === 2) {
				assertUnfrozen("data", this.frozen);
				this.namespace[key] = value;
				return this;
			}
			return own.call(this.namespace, key) && this.namespace[key] || void 0;
		}
		if (key) {
			assertUnfrozen("data", this.frozen);
			this.namespace = key;
			return this;
		}
		return this.namespace;
	}
	/**
	* Freeze a processor.
	*
	* Frozen processors are meant to be extended and not to be configured
	* directly.
	*
	* When a processor is frozen it cannot be unfrozen.
	* New processors working the same way can be created by calling the
	* processor.
	*
	* It’s possible to freeze processors explicitly by calling `.freeze()`.
	* Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
	* `.stringify()`, `.process()`, or `.processSync()` are called.
	*
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   The current processor.
	*/
	freeze() {
		if (this.frozen) return this;
		const self = this;
		while (++this.freezeIndex < this.attachers.length) {
			const [attacher, ...options] = this.attachers[this.freezeIndex];
			if (options[0] === false) continue;
			if (options[0] === true) options[0] = void 0;
			const transformer = attacher.call(self, ...options);
			if (typeof transformer === "function") this.transformers.use(transformer);
		}
		this.frozen = true;
		this.freezeIndex = Number.POSITIVE_INFINITY;
		return this;
	}
	/**
	* Parse text to a syntax tree.
	*
	* > **Note**: `parse` freezes the processor if not already *frozen*.
	*
	* > **Note**: `parse` performs the parse phase, not the run phase or other
	* > phases.
	*
	* @param {Compatible | undefined} [file]
	*   file to parse (optional); typically `string` or `VFile`; any value
	*   accepted as `x` in `new VFile(x)`.
	* @returns {ParseTree extends undefined ? Node : ParseTree}
	*   Syntax tree representing `file`.
	*/
	parse(file) {
		this.freeze();
		const realFile = vfile(file);
		const parser = this.parser || this.Parser;
		assertParser("parse", parser);
		return parser(String(realFile), realFile);
	}
	/**
	* Process the given file as configured on the processor.
	*
	* > **Note**: `process` freezes the processor if not already *frozen*.
	*
	* > **Note**: `process` performs the parse, run, and stringify phases.
	*
	* @overload
	* @param {Compatible | undefined} file
	* @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
	* @returns {undefined}
	*
	* @overload
	* @param {Compatible | undefined} [file]
	* @returns {Promise<VFileWithOutput<CompileResult>>}
	*
	* @param {Compatible | undefined} [file]
	*   File (optional); typically `string` or `VFile`]; any value accepted as
	*   `x` in `new VFile(x)`.
	* @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
	*   Callback (optional).
	* @returns {Promise<VFile> | undefined}
	*   Nothing if `done` is given.
	*   Otherwise a promise, rejected with a fatal error or resolved with the
	*   processed file.
	*
	*   The parsed, transformed, and compiled value is available at
	*   `file.value` (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most
	*   > compilers return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	process(file, done) {
		const self = this;
		this.freeze();
		assertParser("process", this.parser || this.Parser);
		assertCompiler("process", this.compiler || this.Compiler);
		return done ? executor(void 0, done) : new Promise(executor);
		/**
		* @param {((file: VFileWithOutput<CompileResult>) => undefined | void) | undefined} resolve
		* @param {(error: Error | undefined) => undefined | void} reject
		* @returns {undefined}
		*/
		function executor(resolve, reject) {
			const realFile = vfile(file);
			const parseTree = self.parse(realFile);
			self.run(parseTree, realFile, function(error, tree, file) {
				if (error || !tree || !file) return realDone(error);
				const compileTree = tree;
				const compileResult = self.stringify(compileTree, file);
				if (looksLikeAValue(compileResult)) file.value = compileResult;
				else file.result = compileResult;
				realDone(
					error,
					/** @type {VFileWithOutput<CompileResult>} */
					file
				);
			});
			/**
			* @param {Error | undefined} error
			* @param {VFileWithOutput<CompileResult> | undefined} [file]
			* @returns {undefined}
			*/
			function realDone(error, file) {
				if (error || !file) reject(error);
				else if (resolve) resolve(file);
				else done(void 0, file);
			}
		}
	}
	/**
	* Process the given file as configured on the processor.
	*
	* An error is thrown if asynchronous transforms are configured.
	*
	* > **Note**: `processSync` freezes the processor if not already *frozen*.
	*
	* > **Note**: `processSync` performs the parse, run, and stringify phases.
	*
	* @param {Compatible | undefined} [file]
	*   File (optional); typically `string` or `VFile`; any value accepted as
	*   `x` in `new VFile(x)`.
	* @returns {VFileWithOutput<CompileResult>}
	*   The processed file.
	*
	*   The parsed, transformed, and compiled value is available at
	*   `file.value` (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most
	*   > compilers return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	processSync(file) {
		/** @type {boolean} */
		let complete = false;
		/** @type {VFileWithOutput<CompileResult> | undefined} */
		let result;
		this.freeze();
		assertParser("processSync", this.parser || this.Parser);
		assertCompiler("processSync", this.compiler || this.Compiler);
		this.process(file, realDone);
		assertDone("processSync", "process", complete);
		return result;
		/**
		* @type {ProcessCallback<VFileWithOutput<CompileResult>>}
		*/
		function realDone(error, file) {
			complete = true;
			bail(error);
			result = file;
		}
	}
	/**
	* Run *transformers* on a syntax tree.
	*
	* > **Note**: `run` freezes the processor if not already *frozen*.
	*
	* > **Note**: `run` performs the run phase, not other phases.
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
	* @returns {undefined}
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {Compatible | undefined} file
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
	* @returns {undefined}
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {Compatible | undefined} [file]
	* @returns {Promise<TailTree extends undefined ? Node : TailTree>}
	*
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	*   Tree to transform and inspect.
	* @param {(
	*   RunCallback<TailTree extends undefined ? Node : TailTree> |
	*   Compatible
	* )} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
	*   Callback (optional).
	* @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
	*   Nothing if `done` is given.
	*   Otherwise, a promise rejected with a fatal error or resolved with the
	*   transformed tree.
	*/
	run(tree, file, done) {
		assertNode(tree);
		this.freeze();
		const transformers = this.transformers;
		if (!done && typeof file === "function") {
			done = file;
			file = void 0;
		}
		return done ? executor(void 0, done) : new Promise(executor);
		/**
		* @param {(
		*   ((tree: TailTree extends undefined ? Node : TailTree) => undefined | void) |
		*   undefined
		* )} resolve
		* @param {(error: Error) => undefined | void} reject
		* @returns {undefined}
		*/
		function executor(resolve, reject) {
			const realFile = vfile(file);
			transformers.run(tree, realFile, realDone);
			/**
			* @param {Error | undefined} error
			* @param {Node} outputTree
			* @param {VFile} file
			* @returns {undefined}
			*/
			function realDone(error, outputTree, file) {
				const resultingTree = outputTree || tree;
				if (error) reject(error);
				else if (resolve) resolve(resultingTree);
				else done(void 0, resultingTree, file);
			}
		}
	}
	/**
	* Run *transformers* on a syntax tree.
	*
	* An error is thrown if asynchronous transforms are configured.
	*
	* > **Note**: `runSync` freezes the processor if not already *frozen*.
	*
	* > **Note**: `runSync` performs the run phase, not other phases.
	*
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	*   Tree to transform and inspect.
	* @param {Compatible | undefined} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @returns {TailTree extends undefined ? Node : TailTree}
	*   Transformed tree.
	*/
	runSync(tree, file) {
		/** @type {boolean} */
		let complete = false;
		/** @type {(TailTree extends undefined ? Node : TailTree) | undefined} */
		let result;
		this.run(tree, file, realDone);
		assertDone("runSync", "run", complete);
		return result;
		/**
		* @type {RunCallback<TailTree extends undefined ? Node : TailTree>}
		*/
		function realDone(error, tree) {
			bail(error);
			result = tree;
			complete = true;
		}
	}
	/**
	* Compile a syntax tree.
	*
	* > **Note**: `stringify` freezes the processor if not already *frozen*.
	*
	* > **Note**: `stringify` performs the stringify phase, not the run phase
	* > or other phases.
	*
	* @param {CompileTree extends undefined ? Node : CompileTree} tree
	*   Tree to compile.
	* @param {Compatible | undefined} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @returns {CompileResult extends undefined ? Value : CompileResult}
	*   Textual representation of the tree (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most compilers
	*   > return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	stringify(tree, file) {
		this.freeze();
		const realFile = vfile(file);
		const compiler = this.compiler || this.Compiler;
		assertCompiler("stringify", compiler);
		assertNode(tree);
		return compiler(tree, realFile);
	}
	/**
	* Configure the processor to use a plugin, a list of usable values, or a
	* preset.
	*
	* If the processor is already using a plugin, the previous plugin
	* configuration is changed based on the options that are passed in.
	* In other words, the plugin is not added a second time.
	*
	* > **Note**: `use` cannot be called on *frozen* processors.
	* > Call the processor first to create a new unfrozen processor.
	*
	* @example
	*   There are many ways to pass plugins to `.use()`.
	*   This example gives an overview:
	*
	*   ```js
	*   import {unified} from 'unified'
	*
	*   unified()
	*     // Plugin with options:
	*     .use(pluginA, {x: true, y: true})
	*     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
	*     .use(pluginA, {y: false, z: true})
	*     // Plugins:
	*     .use([pluginB, pluginC])
	*     // Two plugins, the second with options:
	*     .use([pluginD, [pluginE, {}]])
	*     // Preset with plugins and settings:
	*     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
	*     // Settings only:
	*     .use({settings: {position: false}})
	*   ```
	*
	* @template {Array<unknown>} [Parameters=[]]
	* @template {Node | string | undefined} [Input=undefined]
	* @template [Output=Input]
	*
	* @overload
	* @param {Preset | null | undefined} [preset]
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {PluggableList} list
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {Plugin<Parameters, Input, Output>} plugin
	* @param {...(Parameters | [boolean])} parameters
	* @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
	*
	* @param {PluggableList | Plugin | Preset | null | undefined} value
	*   Usable value.
	* @param {...unknown} parameters
	*   Parameters, when a plugin is given as a usable value.
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   Current processor.
	*/
	use(value, ...parameters) {
		const attachers = this.attachers;
		const namespace = this.namespace;
		assertUnfrozen("use", this.frozen);
		if (value === null || value === void 0) {} else if (typeof value === "function") addPlugin(value, parameters);
		else if (typeof value === "object") {
			if (Array.isArray(value)) addList(value);
			else addPreset(value);
		} else throw new TypeError("Expected usable value, not `" + value + "`");
		return this;
		/**
		* @param {Pluggable} value
		* @returns {undefined}
		*/
		function add(value) {
			if (typeof value === "function") addPlugin(value, []);
			else if (typeof value === "object") {
				if (Array.isArray(value)) {
					const [plugin, ...parameters] = value;
					addPlugin(plugin, parameters);
				} else addPreset(value);
			} else throw new TypeError("Expected usable value, not `" + value + "`");
		}
		/**
		* @param {Preset} result
		* @returns {undefined}
		*/
		function addPreset(result) {
			if (!("plugins" in result) && !("settings" in result)) throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
			addList(result.plugins);
			if (result.settings) namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
		}
		/**
		* @param {PluggableList | null | undefined} plugins
		* @returns {undefined}
		*/
		function addList(plugins) {
			let index = -1;
			if (plugins === null || plugins === void 0) {} else if (Array.isArray(plugins)) while (++index < plugins.length) {
				const thing = plugins[index];
				add(thing);
			}
			else throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
		}
		/**
		* @param {Plugin} plugin
		* @param {Array<unknown>} parameters
		* @returns {undefined}
		*/
		function addPlugin(plugin, parameters) {
			let index = -1;
			let entryIndex = -1;
			while (++index < attachers.length) if (attachers[index][0] === plugin) {
				entryIndex = index;
				break;
			}
			if (entryIndex === -1) attachers.push([plugin, ...parameters]);
			else if (parameters.length > 0) {
				let [primary, ...rest] = parameters;
				const currentPrimary = attachers[entryIndex][1];
				if (isPlainObject(currentPrimary) && isPlainObject(primary)) primary = (0, import_extend.default)(true, currentPrimary, primary);
				attachers[entryIndex] = [
					plugin,
					primary,
					...rest
				];
			}
		}
	}
}().freeze();
/**
* Assert a parser is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Parser}
*/
function assertParser(name, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name + "` without `parser`");
}
/**
* Assert a compiler is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Compiler}
*/
function assertCompiler(name, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name + "` without `compiler`");
}
/**
* Assert the processor is not frozen.
*
* @param {string} name
* @param {unknown} frozen
* @returns {asserts frozen is false}
*/
function assertUnfrozen(name, frozen) {
	if (frozen) throw new Error("Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
/**
* Assert `node` is a unist node.
*
* @param {unknown} node
* @returns {asserts node is Node}
*/
function assertNode(node) {
	if (!isPlainObject(node) || typeof node.type !== "string") throw new TypeError("Expected node, got `" + node + "`");
}
/**
* Assert that `complete` is `true`.
*
* @param {string} name
* @param {string} asyncName
* @param {unknown} complete
* @returns {asserts complete is true}
*/
function assertDone(name, asyncName, complete) {
	if (!complete) throw new Error("`" + name + "` finished async. Use `" + asyncName + "` instead");
}
/**
* @param {Compatible | undefined} [value]
* @returns {VFile}
*/
function vfile(value) {
	return looksLikeAVFile(value) ? value : new VFile(value);
}
/**
* @param {Compatible | undefined} [value]
* @returns {value is VFile}
*/
function looksLikeAVFile(value) {
	return Boolean(value && typeof value === "object" && "message" in value && "messages" in value);
}
/**
* @param {unknown} [value]
* @returns {value is Value}
*/
function looksLikeAValue(value) {
	return typeof value === "string" || isUint8Array(value);
}
/**
* Assert `value` is an `Uint8Array`.
*
* @param {unknown} value
*   thing.
* @returns {value is Uint8Array}
*   Whether `value` is an `Uint8Array`.
*/
function isUint8Array(value) {
	return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/const.js
var GLIMDOWN_PREVIEW = Symbol("__GLIMDOWN_PREVIEW__");
var GLIMDOWN_RENDER = Symbol("__GLIMDOWN_RENDER__");
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/heading-id.js
/**
* @param {import('mdast').PhrasingContent[]} children
* @return {string}
*/
function getDefaultId(children) {
	return formatDefaultId(extractText(children));
}
/**
* @param {import('mdast').PhrasingContent[]} children
* @return {string}
*/
function extractText(children) {
	return children.map(
		/**
		* @param {any} child
		*/
		(child) => {
			if (!!child.value?.trim()) return child.value;
			else if (child.children && child.children.length > 0) return extractText(child.children);
			else return "";
		}
	).join(" ");
}
/**
* @param {string} value
*/
function formatDefaultId(value) {
	return kebabCase(value.replaceAll(/\\s+/g, " ").trim());
}
/**
* @param {import('mdast').Heading} node
* @param {string} id
*/
function setNodeId(node, id) {
	if (!node.data) node.data = {};
	if (!node.data.hProperties) node.data.hProperties = {};
	/** @type {any} */
	node.data.id = node.data.hProperties.id = id;
}
function headingId(options = { defaults: false }) {
	/**
	* @param {import('mdast').Root} node
	*/
	return function(node) {
		visit(node, "heading", (node) => {
			const lastChild = node.children[node.children.length - 1];
			if (lastChild && lastChild.type === "text") {
				if (lastChild.value.replace(/ +$/, "").match(/ {#([^]+?)}$/)) return;
			}
			setNodeId(node, getDefaultId(node.children));
		});
	};
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/live-code-extraction.js
/**
* Swaps live codeblocks with placeholders that the compiler can then
* use to insert compiled-from-other-sources' code into those placeholders.
*
* @type {import('unified').Plugin<[
*   {
*     demo: {
*       classList: string[]
*     },
*     code: {
*       classList: string[]
*     },
*     isLive: (meta: string, lang: string) => boolean,
*     ALLOWED_FORMATS: string[],
*     isPreview: (meta: string) => boolean,
*     isBelow: (meta: string) => boolean,
*     needsLive: (lang: string) => boolean
*     getFlavorFromMeta: (meta: string, lang: string) => string | undefined
*   },
* ], import('mdast').Root>}
*/
function liveCodeExtraction(options) {
	const { code, demo, isLive, ALLOWED_FORMATS, isPreview, isBelow, needsLive, getFlavorFromMeta } = options;
	let { classList: snippetClasses } = code || {};
	let { classList: demoClasses } = demo || {};
	snippetClasses ??= [];
	demoClasses ??= [];
	/**
	* @param {import('mdast').Code} node
	*/
	function isRelevantCode(node) {
		if (node.type !== "code") return false;
		let { meta, lang } = node;
		if (!lang) return false;
		meta = meta?.trim() ?? "";
		if (!isLive(meta, lang)) return false;
		if (!ALLOWED_FORMATS.includes(lang)) return false;
		return true;
	}
	/**
	* @param {import('mdast').Code} code
	* @param {string[]} [classes]
	*/
	function enhance(code, classes = []) {
		code.data ??= {};
		code.data["hProperties"] ??= {};
		code.data["hProperties"][GLIMDOWN_PREVIEW] = true;
		return {
			data: { hProperties: {
				className: classes,
				"data-repl-output": true
			} },
			type: "div",
			hProperties: { className: classes },
			children: [code]
		};
	}
	/**
	* @template T
	* @param {T[]} array
	* @param {number} index
	* @param {T[]} replacement
	*/
	function flatReplaceAt(array, index, replacement) {
		array.splice(index, 1, ...replacement);
	}
	const seen = /* @__PURE__ */ new Set();
	return function transformer(tree, file) {
		visit(tree, ["code"], function(node, index, parent) {
			if (parent === null || parent === void 0) return;
			if (index === null || index === void 0) return;
			if (node.type !== "code") return;
			/** @type {import('mdast').Code} */
			const codeNode = node;
			if (!isRelevantCode(codeNode)) {
				const enhanced = enhance(codeNode, snippetClasses);
				/** @type {unknown[]} */
				parent.children[index] = enhanced;
				return "skip";
			}
			if (seen.has(codeNode)) return "skip";
			seen.add(codeNode);
			const { meta, lang, value } = codeNode;
			if (!lang) return "skip";
			/**
			* Sometimes, meta is not required,
			* like with the `mermaid` language
			*
			* NOTE: that if a flavor is required, meta is present
			*       if the flavor is provided
			*/
			if (!meta) {
				if (needsLive(lang)) return "skip";
			}
			file.data.liveCode ??= [];
			const code = value.trim();
			const id = nextId();
			const invokeNode = (/** @type {import('mdast').Html} */ {
				type: "html",
				data: { hProperties: { [GLIMDOWN_RENDER]: true } },
				value: `<div id="${id}" class="${demoClasses}"></div>`
			});
			const wrapper = enhance(codeNode, snippetClasses);
			/** @type {unknown[]} */
			file.data.liveCode.push({
				format: lang,
				flavor: getFlavorFromMeta(meta ?? "", lang),
				code,
				placeholderId: id,
				meta
			});
			const live = isLive(meta || "", lang);
			const preview = isPreview(meta || "");
			const below = isBelow(meta || "");
			if (live && preview && below) {
				flatReplaceAt(
					/** @type {unknown[]} */
					parent.children,
					index,
					[wrapper, invokeNode]
				);
				return "skip";
			}
			if (live && preview) {
				flatReplaceAt(
					/** @type {unknown[]} */
					parent.children,
					index,
					[invokeNode, wrapper]
				);
				return "skip";
			}
			if (live) {
				/** @type {unknown[]} */ parent.children[index] = invokeNode;
				return "skip";
			}
			/** @type {unknown[]} */
			parent.children[index] = wrapper;
		});
	};
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/sanitize-for-glimmer.js
/**
* @type {import('unified').Plugin<[], import('hast').Root>}
*/
function sanitizeForGlimmer() {
	return function transformer(tree) {
		visit(tree, "element", function visitor(node) {
			if (node.type === "element" && "tagName" in node) {
				const element = node;
				if (!["pre", "code"].includes(element.tagName)) return;
				visit(node, "text", function textVisitor(textNode) {
					if (textNode.type === "text") {
						const text = textNode;
						text.value = text.value.replace(/{{/g, "\\{{");
					}
				});
				return "skip";
			}
		});
	};
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/build-compiler.js
/**
* @typedef {import('unified').Plugin} UPlugin
*/
/**
* @param {import('./types').InternalOptions} options
*
* @returns {import('unified').Processor<import('hast').Root>}
*/
function buildCompiler(options) {
	let compiler = unified().use(remarkParse).use(remarkGfm, { singleTilde: true }).use(headingId);
	/**
	* If this were "use"d after `remarkRehype`,
	* remark is gone, and folks would need to work with rehype trees
	*/
	if (options.remarkPlugins) options.remarkPlugins.forEach((plugin) => {
		if (Array.isArray(plugin)) compiler = compiler.use(plugin[0], ...plugin.slice(1));
		else compiler = compiler.use(plugin);
	});
	compiler = compiler.use(() => (tree) => {
		visit(tree, "html", function(node) {
			if (typeof node.value === "string" && node.value.match(/^<\/?[A-Z][a-zA-Z0-9]/)) {
				if (!node.data) node.data = {};
				node.data.isPascalCaseComponent = true;
			}
		});
		visit(tree, "paragraph", (paragraph) => {
			if (paragraph.children) for (let i = 0; i < paragraph.children.length; i++) {
				const child = paragraph.children[i];
				if (child.type === "html" && typeof child.value === "string" && child.value.match(/^<\/?[A-Z][a-zA-Z0-9]/)) {
					if (!child.data) child.data = {};
					child.data.isPascalCaseComponent = true;
				}
			}
		});
	});
	compiler = compiler.use(liveCodeExtraction, {
		code: {
			classList: ["repl-sdk__snippet"],
			...options.code
		},
		demo: {
			classList: ["repl-sdk__demo"],
			...options.code
		},
		isLive: options.isLive,
		isPreview: options.isPreview,
		isBelow: options.isBelow,
		needsLive: options.needsLive,
		ALLOWED_FORMATS: options.ALLOWED_FORMATS,
		getFlavorFromMeta: options.getFlavorFromMeta
	});
	compiler = compiler.use(remarkRehype, { allowDangerousHtml: true });
	compiler = compiler.use(() => (tree) => {
		visit(
			/** @type {import('hast').Root} */
			tree,
			function(node) {
				const nodeObj = node;
				const properties = typeof node === "object" && node !== null && "properties" in node ? node.properties : {};
				if (properties?.[GLIMDOWN_PREVIEW]) return "skip";
				const tagName = nodeObj.tagName;
				if (tagName && /^[A-Z]/.test(tagName)) {
					nodeObj.type = "glimmer_raw";
					return "skip";
				}
				if (nodeObj.type === "element" || "tagName" in nodeObj && nodeObj.tagName === "code") {
					if (properties?.[GLIMDOWN_RENDER]) {
						nodeObj.type = "glimmer_raw";
						return;
					}
					return "skip";
				}
				if ("value" in nodeObj && typeof nodeObj.value === "string") {
					if ((typeof node === "object" && node !== null && "data" in node ? node.data : void 0)?.isPascalCaseComponent) {
						nodeObj.type = "glimmer_raw";
						return "skip";
					}
					if ((nodeObj.type === "text" || nodeObj.type === "raw" || nodeObj.type === "html") && nodeObj.value.match(/<\/?[A-Z][a-zA-Z0-9]*(\s|>|@)/)) {
						nodeObj.type = "glimmer_raw";
						return "skip";
					}
					return;
				}
			}
		);
	});
	if (options.rehypePlugins) options.rehypePlugins.forEach((plugin) => {
		if (Array.isArray(plugin)) compiler = compiler.use(plugin[0], ...plugin.slice(1));
		else compiler = compiler.use(plugin);
	});
	compiler = compiler.use(rehypeRaw, { passThrough: ["glimmer_raw", "raw"] }).use(() => (tree) => {
		visit(
			/** @type {import('hast').Root} */
			tree,
			"glimmer_raw",
			(node) => {
				/** @type {Record<string, unknown>} */ node.type = "raw";
			}
		);
	});
	compiler = compiler.use(sanitizeForGlimmer);
	compiler = compiler.use(rehypeStringify, {
		collapseEmptyAttributes: true,
		closeSelfClosing: true,
		allowParseErrors: true,
		allowDangerousCharacters: true,
		allowDangerousHtml: true
	});
	return compiler;
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/parse.js
/**
* @typedef {object} CodeBlock
* @property {string} lang
* @property {string} format
* @property {string} code
* @property {string} name
*/
/**
* @typedef {object} ParseResult
* @property {string} text
* @property {CodeBlock[]} codeBlocks
*/
/**
* @param {string} input
* @param {import('./types').InternalOptions} options
* @returns {Promise<ParseResult>}
*/
async function parseMarkdown(input, options) {
	const processed = await (options?.compiler ?? buildCompiler({
		...options,
		remarkPlugins: [...options?.remarkPlugins || [], remarkEscapeComponents]
	})).process(input);
	const liveCode = processed.data.liveCode || [];
	let templateOnly = processed.toString();
	templateOnly = templateOnly.replaceAll(REPL_LT, "&#x3C;");
	templateOnly = unescapeComponentsOutsideCode(templateOnly);
	return {
		text: templateOnly,
		codeBlocks: liveCode
	};
}
/**
* Undo HTML-escaping of PascalCase component tags that appear outside
* `<code>` and `<pre>` blocks so Glimmer can invoke them.
*
* @param {string} html
* @returns {string}
*/
function unescapeComponentsOutsideCode(html) {
	const parts = html.split(/(<pre[\s\S]*?<\/pre>)/gi);
	for (let i = 0; i < parts.length; i++) if (i % 2 === 0) {
		const codeParts = (parts[i] ?? "").split(/(<code[^>]*>[\s\S]*?<\/code>)/gi);
		for (let j = 0; j < codeParts.length; j++) {
			const segment = codeParts[j];
			if (j % 2 === 0 && segment) codeParts[j] = segment.replace(/&#x3C;([A-Z][a-zA-Z0-9]*\s[^<]*?)>/g, (_m, content) => content.includes("@") ? `<${content}>` : _m).replace(/&#x3C;\/([A-Z][a-zA-Z0-9]*)>/g, "</$1>");
		}
		parts[i] = codeParts.join("");
	}
	return parts.join("");
}
//#endregion
export { parseMarkdown };
