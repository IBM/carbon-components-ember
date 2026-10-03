import { a as expect, d as mapPresentArray, f as unwrap, i as exhausted, n as asPresentArray, o as getFirst, r as dict, s as getLast, u as isPresentArray } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { t as setLocalDebugType } from "./debug-brand-B1TWjOCH-CWncGHWi.js";
import { a as assert, t as assign } from "./object-utils-AijlD-JH-xdA72BiZ.js";
import { t as opcodes } from "./opcodes-DDajoGhq-DNWK19V4.js";
import { t as assertNever } from "./util-j8TMoaH1.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/well-known-_EVO9RaV.js
var WellKnownAttrNames = {
	class: 0,
	id: 1,
	value: 2,
	name: 3,
	type: 4,
	style: 5,
	href: 6
};
var WellKnownTagNames = {
	div: 0,
	span: 1,
	p: 2,
	a: 3
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/compiler-Wt5SWcrF.js
var Char = {
	NBSP: 160,
	QUOT: 34,
	LT: 60,
	GT: 62,
	AMP: 38
};
var ATTR_VALUE_REGEX_TEST = /["\x26\xa0]/u;
var ATTR_VALUE_REGEX_REPLACE = new RegExp(ATTR_VALUE_REGEX_TEST.source, "gu");
var TEXT_REGEX_TEST = /[&<>\xa0]/u;
var TEXT_REGEX_REPLACE = new RegExp(TEXT_REGEX_TEST.source, "gu");
function attrValueReplacer(char) {
	switch (char.charCodeAt(0)) {
		case Char.NBSP: return "&nbsp;";
		case Char.QUOT: return "&quot;";
		case Char.AMP: return "&amp;";
		default: return char;
	}
}
function textReplacer(char) {
	switch (char.charCodeAt(0)) {
		case Char.NBSP: return "&nbsp;";
		case Char.AMP: return "&amp;";
		case Char.LT: return "&lt;";
		case Char.GT: return "&gt;";
		default: return char;
	}
}
function escapeAttrValue(attrValue) {
	if (ATTR_VALUE_REGEX_TEST.test(attrValue)) return attrValue.replace(ATTR_VALUE_REGEX_REPLACE, attrValueReplacer);
	return attrValue;
}
function escapeText(text) {
	if (TEXT_REGEX_TEST.test(text)) return text.replace(TEXT_REGEX_REPLACE, textReplacer);
	return text;
}
function sortByLoc(a, b) {
	if (a.loc.isInvisible || b.loc.isInvisible) return 0;
	if (a.loc.startPosition.line < b.loc.startPosition.line) return -1;
	if (a.loc.startPosition.line === b.loc.startPosition.line && a.loc.startPosition.column < b.loc.startPosition.column) return -1;
	if (a.loc.startPosition.line === b.loc.startPosition.line && a.loc.startPosition.column === b.loc.startPosition.column) return 0;
	return 1;
}
var voidMap = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
var NON_WHITESPACE = /^\S/u;
/**
* Examples when true:
*  - link
*  - liNK
*
* Examples when false:
*  - Link (component)
*/
function isVoidTag(tag) {
	return voidMap.has(tag.toLowerCase()) && tag[0]?.toLowerCase() === tag[0];
}
var Printer = class {
	buffer = "";
	options;
	constructor(options) {
		this.options = options;
	}
	handledByOverride(node, ensureLeadingWhitespace = false) {
		if (this.options.override !== void 0) {
			let result = this.options.override(node, this.options);
			if (typeof result === "string") {
				if (ensureLeadingWhitespace && NON_WHITESPACE.test(result)) result = ` ${result}`;
				this.buffer += result;
				return true;
			}
		}
		return false;
	}
	Node(node) {
		switch (node.type) {
			case "MustacheStatement":
			case "BlockStatement":
			case "MustacheCommentStatement":
			case "CommentStatement":
			case "TextNode":
			case "ElementNode":
			case "AttrNode":
			case "Block":
			case "Template": return this.TopLevelStatement(node);
			case "StringLiteral":
			case "BooleanLiteral":
			case "NumberLiteral":
			case "UndefinedLiteral":
			case "NullLiteral":
			case "PathExpression":
			case "SubExpression": return this.Expression(node);
			case "ConcatStatement": return this.ConcatStatement(node);
			case "Hash": return this.Hash(node);
			case "HashPair": return this.HashPair(node);
			case "ElementModifierStatement": return this.ElementModifierStatement(node);
		}
	}
	Expression(expression) {
		switch (expression.type) {
			case "StringLiteral":
			case "BooleanLiteral":
			case "NumberLiteral":
			case "UndefinedLiteral":
			case "NullLiteral": return this.Literal(expression);
			case "PathExpression": return this.PathExpression(expression);
			case "SubExpression": return this.SubExpression(expression);
		}
	}
	Literal(literal) {
		switch (literal.type) {
			case "StringLiteral": return this.StringLiteral(literal);
			case "BooleanLiteral": return this.BooleanLiteral(literal);
			case "NumberLiteral": return this.NumberLiteral(literal);
			case "UndefinedLiteral": return this.UndefinedLiteral(literal);
			case "NullLiteral": return this.NullLiteral(literal);
		}
	}
	TopLevelStatement(statement) {
		switch (statement.type) {
			case "MustacheStatement": return this.MustacheStatement(statement);
			case "BlockStatement": return this.BlockStatement(statement);
			case "MustacheCommentStatement": return this.MustacheCommentStatement(statement);
			case "CommentStatement": return this.CommentStatement(statement);
			case "TextNode": return this.TextNode(statement);
			case "ElementNode": return this.ElementNode(statement);
			case "Block": return this.Block(statement);
			case "Template": return this.Template(statement);
			case "AttrNode": return this.AttrNode(statement);
		}
	}
	Template(template) {
		this.TopLevelStatements(template.body);
	}
	Block(block) {
		if (block.chained) {
			let firstChild = block.body[0];
			firstChild.chained = true;
		}
		if (this.handledByOverride(block)) return;
		this.TopLevelStatements(block.body);
	}
	TopLevelStatements(statements) {
		statements.forEach((statement) => this.TopLevelStatement(statement));
	}
	ElementNode(el) {
		if (this.handledByOverride(el)) return;
		this.OpenElementNode(el);
		this.TopLevelStatements(el.children);
		this.CloseElementNode(el);
	}
	OpenElementNode(el) {
		this.buffer += `<${el.tag}`;
		const parts = [
			...el.attributes,
			...el.modifiers,
			...el.comments
		].sort(sortByLoc);
		for (const part of parts) {
			this.buffer += " ";
			switch (part.type) {
				case "AttrNode":
					this.AttrNode(part);
					break;
				case "ElementModifierStatement":
					this.ElementModifierStatement(part);
					break;
				case "MustacheCommentStatement": this.MustacheCommentStatement(part);
			}
		}
		if (el.blockParams.length) this.BlockParams(el.blockParams);
		if (el.selfClosing) this.buffer += " /";
		this.buffer += ">";
	}
	CloseElementNode(el) {
		if (el.selfClosing || isVoidTag(el.tag)) return;
		this.buffer += `</${el.tag}>`;
	}
	AttrNode(attr) {
		if (this.handledByOverride(attr)) return;
		let { name, value } = attr;
		this.buffer += name;
		if (!(!name.startsWith("@") && value.type == "TextNode" && value.chars.length === 0)) {
			this.buffer += "=";
			this.AttrNodeValue(value);
		}
	}
	AttrNodeValue(value) {
		if (value.type === "TextNode") {
			let quote = "\"";
			if (this.options.entityEncoding === "raw") {
				if (value.chars.includes("\"") && !value.chars.includes("'")) quote = "'";
			}
			this.buffer += quote;
			this.TextNode(value, quote);
			this.buffer += quote;
		} else this.Node(value);
	}
	TextNode(text, isInAttr) {
		if (this.handledByOverride(text)) return;
		if (this.options.entityEncoding === "raw") {
			if (isInAttr && text.chars.includes(isInAttr)) this.buffer += escapeAttrValue(text.chars);
			else this.buffer += text.chars;
		} else if (isInAttr) this.buffer += escapeAttrValue(text.chars);
		else this.buffer += escapeText(text.chars);
	}
	MustacheStatement(mustache) {
		if (this.handledByOverride(mustache)) return;
		this.buffer += mustache.trusting ? "{{{" : "{{";
		if (mustache.strip.open) this.buffer += "~";
		this.Expression(mustache.path);
		this.Params(mustache.params);
		this.Hash(mustache.hash);
		if (mustache.strip.close) this.buffer += "~";
		this.buffer += mustache.trusting ? "}}}" : "}}";
	}
	BlockStatement(block) {
		if (this.handledByOverride(block)) return;
		if (block.chained) {
			this.buffer += block.inverseStrip.open ? "{{~" : "{{";
			this.buffer += "else ";
		} else this.buffer += block.openStrip.open ? "{{~#" : "{{#";
		this.Expression(block.path);
		this.Params(block.params);
		this.Hash(block.hash);
		if (block.program.blockParams.length) this.BlockParams(block.program.blockParams);
		if (block.chained) this.buffer += block.inverseStrip.close ? "~}}" : "}}";
		else this.buffer += block.openStrip.close ? "~}}" : "}}";
		this.Block(block.program);
		if (block.inverse) {
			if (!block.inverse.chained) {
				this.buffer += block.inverseStrip.open ? "{{~" : "{{";
				this.buffer += "else";
				this.buffer += block.inverseStrip.close ? "~}}" : "}}";
			}
			this.Block(block.inverse);
		}
		if (!block.chained) {
			this.buffer += block.closeStrip.open ? "{{~/" : "{{/";
			this.Expression(block.path);
			this.buffer += block.closeStrip.close ? "~}}" : "}}";
		}
	}
	BlockParams(blockParams) {
		this.buffer += ` as |${blockParams.join(" ")}|`;
	}
	ConcatStatement(concat) {
		if (this.handledByOverride(concat)) return;
		this.buffer += "\"";
		concat.parts.forEach((part) => {
			if (part.type === "TextNode") this.TextNode(part, "\"");
			else this.Node(part);
		});
		this.buffer += "\"";
	}
	MustacheCommentStatement(comment) {
		if (this.handledByOverride(comment)) return;
		this.buffer += `{{!--${comment.value}--}}`;
	}
	ElementModifierStatement(mod) {
		if (this.handledByOverride(mod)) return;
		this.buffer += "{{";
		this.Expression(mod.path);
		this.Params(mod.params);
		this.Hash(mod.hash);
		this.buffer += "}}";
	}
	CommentStatement(comment) {
		if (this.handledByOverride(comment)) return;
		this.buffer += `<!--${comment.value}-->`;
	}
	PathExpression(path) {
		if (this.handledByOverride(path)) return;
		this.buffer += path.original;
	}
	SubExpression(sexp) {
		if (this.handledByOverride(sexp)) return;
		this.buffer += "(";
		this.Expression(sexp.path);
		this.Params(sexp.params);
		this.Hash(sexp.hash);
		this.buffer += ")";
	}
	Params(params) {
		if (params.length) params.forEach((param) => {
			this.buffer += " ";
			this.Expression(param);
		});
	}
	Hash(hash) {
		if (this.handledByOverride(hash, true)) return;
		hash.pairs.forEach((pair) => {
			this.buffer += " ";
			this.HashPair(pair);
		});
	}
	HashPair(pair) {
		if (this.handledByOverride(pair)) return;
		this.buffer += pair.key;
		this.buffer += "=";
		this.Node(pair.value);
	}
	StringLiteral(str) {
		if (this.handledByOverride(str)) return;
		this.buffer += JSON.stringify(str.value);
	}
	BooleanLiteral(bool) {
		if (this.handledByOverride(bool)) return;
		this.buffer += String(bool.value);
	}
	NumberLiteral(number) {
		if (this.handledByOverride(number)) return;
		this.buffer += String(number.value);
	}
	UndefinedLiteral(node) {
		if (this.handledByOverride(node)) return;
		this.buffer += "undefined";
	}
	NullLiteral(node) {
		if (this.handledByOverride(node)) return;
		this.buffer += "null";
	}
	print(node) {
		let { options } = this;
		if (options.override) {
			let result = options.override(node, options);
			if (result !== void 0) return result;
		}
		this.buffer = "";
		this.Node(node);
		return this.buffer;
	}
};
function build(ast, options = { entityEncoding: "transformed" }) {
	if (!ast) return "";
	return new Printer(options).print(ast);
}
var UNKNOWN_POSITION = Object.freeze({
	line: 1,
	column: 0
});
var SYNTHETIC_LOCATION = Object.freeze({
	source: "(synthetic)",
	start: UNKNOWN_POSITION,
	end: UNKNOWN_POSITION
});
var NON_EXISTENT_LOCATION = Object.freeze({
	source: "(nonexistent)",
	start: UNKNOWN_POSITION,
	end: UNKNOWN_POSITION
});
var BROKEN_LOCATION = Object.freeze({
	source: "(broken)",
	start: UNKNOWN_POSITION,
	end: UNKNOWN_POSITION
});
/**
* We have already computed the character position of this offset or span.
*/
var CHAR_OFFSET_KIND = "CharPosition";
/**
* This offset or span was instantiated with a Handlebars SourcePosition or SourceLocation. Its
* character position will be computed on demand.
*/
var HBS_POSITION_KIND = "HbsPosition";
/**
* for (rare) situations where a node is created but there was no source location (e.g. the name
* "default" in default blocks when the word "default" never appeared in source). This is used
* by the internals when there is a legitimate reason for the internals to synthesize a node
* with no location.
*/
var INTERNAL_SYNTHETIC_KIND = "InternalsSynthetic";
/**
* For situations where a node represents zero parts of the source (for example, empty arguments).
* In general, we attempt to assign these nodes *some* position (empty arguments can be
* positioned immediately after the callee), but it's not always possible
*/
var NON_EXISTENT_KIND = "NonExistent";
/**
* For situations where a source location was expected, but it didn't correspond to the node in
* the source. This happens if a plugin creates broken locations.
*/
var BROKEN_KIND = "Broken";
/**
* These kinds  describe spans that don't have a concrete location in the original source.
*/
function isInvisible(kind) {
	return kind !== CHAR_OFFSET_KIND && kind !== HBS_POSITION_KIND;
}
/**
* This file implements the DSL used by span and offset in places where they need to exhaustively
* consider all combinations of states (Handlebars offsets, character offsets and invisible/broken
* offsets).
*
* It's probably overkill, but it makes the code that uses it clear. It could be refactored or
* removed.
*/
var MatchAny = "MATCH_ANY";
var IsInvisible = "IS_INVISIBLE";
var WhenList = class {
	_whens;
	constructor(whens) {
		this._whens = whens;
	}
	first(kind) {
		for (const when of this._whens) {
			const value = when.match(kind);
			if (isPresentArray(value)) return value[0];
		}
		return null;
	}
};
var When = class {
	_map = /* @__PURE__ */ new Map();
	get(pattern, or) {
		let value = this._map.get(pattern);
		if (value) return value;
		value = or();
		this._map.set(pattern, value);
		return value;
	}
	add(pattern, out) {
		this._map.set(pattern, out);
	}
	match(kind) {
		const pattern = patternFor(kind);
		const out = [];
		const exact = this._map.get(pattern);
		const fallback = this._map.get(MatchAny);
		if (exact) out.push(exact);
		if (fallback) out.push(fallback);
		return out;
	}
};
function match(callback) {
	return callback(new Matcher()).validate();
}
var Matcher = class {
	_whens = new When();
	/**
	* You didn't exhaustively match all possibilities.
	*/
	validate() {
		return (left, right) => this.matchFor(left.kind, right.kind)(left, right);
	}
	matchFor(left, right) {
		const nesteds = this._whens.match(left);
		assert(isPresentArray(nesteds));
		return new WhenList(nesteds).first(right);
	}
	when(left, right, callback) {
		this._whens.get(left, () => new When()).add(right, callback);
		return this;
	}
};
function patternFor(kind) {
	switch (kind) {
		case BROKEN_KIND:
		case INTERNAL_SYNTHETIC_KIND:
		case NON_EXISTENT_KIND: return IsInvisible;
		default: return kind;
	}
}
var SourceSlice = class SourceSlice {
	static synthetic(chars) {
		let offsets = SourceSpan.synthetic(chars);
		return new SourceSlice({
			loc: offsets,
			chars
		});
	}
	static load(source, slice) {
		return new SourceSlice({
			loc: SourceSpan.load(source, slice[1]),
			chars: slice[0]
		});
	}
	chars;
	loc;
	constructor(options) {
		this.loc = options.loc;
		this.chars = options.chars;
	}
	getString() {
		return this.chars;
	}
	serialize() {
		return [this.chars, this.loc.serialize()];
	}
};
/**
* All spans have these details in common.
*/
/**
* A `SourceSpan` object represents a span of characters inside of a template source.
*
* There are three kinds of `SourceSpan` objects:
*
* - `ConcreteSourceSpan`, which contains byte offsets
* - `LazySourceSpan`, which contains `SourceLocation`s from the Handlebars AST, which can be
*   converted to byte offsets on demand.
* - `InvisibleSourceSpan`, which represent source strings that aren't present in the source,
*   because:
*     - they were created synthetically
*     - their location is nonsensical (the span is broken)
*     - they represent nothing in the source (this currently happens only when a bug in the
*       upstream Handlebars parser fails to assign a location to empty blocks)
*
* At a high level, all `SourceSpan` objects provide:
*
* - byte offsets
* - source in column and line format
*
* And you can do these operations on `SourceSpan`s:
*
* - collapse it to a `SourceSpan` representing its starting or ending position
* - slice out some characters, optionally skipping some characters at the beginning or end
* - create a new `SourceSpan` with a different starting or ending offset
*
* All SourceSpan objects implement `SourceLocation`, for compatibility. All SourceSpan
* objects have a `toJSON` that emits `SourceLocation`, also for compatibility.
*
* For compatibility, subclasses of `AbstractSourceSpan` must implement `locDidUpdate`, which
* happens when an AST plugin attempts to modify the `start` or `end` of a span directly.
*
* The goal is to avoid creating any problems for use-cases like AST Explorer.
*/
var SourceSpan = class SourceSpan {
	static get NON_EXISTENT() {
		return new InvisibleSpan(NON_EXISTENT_KIND, NON_EXISTENT_LOCATION).wrap();
	}
	static load(source, serialized) {
		if (typeof serialized === "number") return SourceSpan.forCharPositions(source, serialized, serialized);
		else if (typeof serialized === "string") return SourceSpan.synthetic(serialized);
		else if (Array.isArray(serialized)) return SourceSpan.forCharPositions(source, serialized[0], serialized[1]);
		else if (serialized === NON_EXISTENT_KIND) return SourceSpan.NON_EXISTENT;
		else if (serialized === BROKEN_KIND) return SourceSpan.broken(BROKEN_LOCATION);
		assertNever(serialized);
	}
	static forHbsLoc(source, loc) {
		return new HbsSpan(source, {
			start: new HbsPosition(source, loc.start),
			end: new HbsPosition(source, loc.end)
		}, loc).wrap();
	}
	static forCharPositions(source, startPos, endPos) {
		return new CharPositionSpan(source, {
			start: new CharPosition(source, startPos),
			end: new CharPosition(source, endPos)
		}).wrap();
	}
	static synthetic(chars) {
		return new InvisibleSpan(INTERNAL_SYNTHETIC_KIND, NON_EXISTENT_LOCATION, chars).wrap();
	}
	static broken(pos = BROKEN_LOCATION) {
		return new InvisibleSpan(BROKEN_KIND, pos).wrap();
	}
	isInvisible;
	constructor(data) {
		this.data = data;
		this.isInvisible = isInvisible(data.kind);
	}
	getStart() {
		return this.data.getStart().wrap();
	}
	getEnd() {
		return this.data.getEnd().wrap();
	}
	get loc() {
		const span = this.data.toHbsSpan();
		return span === null ? BROKEN_LOCATION : span.toHbsLoc();
	}
	get module() {
		return this.data.getModule();
	}
	/**
	* Get the starting `SourcePosition` for this `SourceSpan`, lazily computing it if needed.
	*/
	get startPosition() {
		return this.loc.start;
	}
	/**
	* Get the ending `SourcePosition` for this `SourceSpan`, lazily computing it if needed.
	*/
	get endPosition() {
		return this.loc.end;
	}
	/**
	* Support converting ASTv1 nodes into a serialized format using JSON.stringify.
	*/
	toJSON() {
		return this.loc;
	}
	/**
	* Create a new span with the current span's end and a new beginning.
	*/
	withStart(other) {
		return span(other.data, this.data.getEnd());
	}
	/**
	* Create a new span with the current span's beginning and a new ending.
	*/
	withEnd(other) {
		return span(this.data.getStart(), other.data);
	}
	asString() {
		return this.data.asString();
	}
	/**
	* Convert this `SourceSpan` into a `SourceSlice`.
	*/
	toSlice(expected) {
		const chars = this.data.asString();
		assert(expected === void 0 || expected === chars, `unexpectedly found ${JSON.stringify(chars)} when slicing source, but expected ${JSON.stringify(expected)}`);
		return new SourceSlice({
			loc: this,
			chars: expected || chars
		});
	}
	/**
	* For compatibility with SourceLocation in AST plugins
	*
	* @deprecated use startPosition instead
	*/
	get start() {
		return this.loc.start;
	}
	/**
	* For compatibility with SourceLocation in AST plugins
	*
	* @deprecated use withStart instead
	*/
	set start(position) {
		this.data.locDidUpdate({ start: position });
	}
	/**
	* For compatibility with SourceLocation in AST plugins
	*
	* @deprecated use endPosition instead
	*/
	get end() {
		return this.loc.end;
	}
	/**
	* For compatibility with SourceLocation in AST plugins
	*
	* @deprecated use withEnd instead
	*/
	set end(position) {
		this.data.locDidUpdate({ end: position });
	}
	/**
	* For compatibility with SourceLocation in AST plugins
	*
	* @deprecated use module instead
	*/
	get source() {
		return this.module;
	}
	collapse(where) {
		switch (where) {
			case "start": return this.getStart().collapsed();
			case "end": return this.getEnd().collapsed();
		}
	}
	extend(other) {
		return span(this.data.getStart(), other.data.getEnd());
	}
	serialize() {
		return this.data.serialize();
	}
	slice({ skipStart = 0, skipEnd = 0 }) {
		return span(this.getStart().move(skipStart).data, this.getEnd().move(-skipEnd).data);
	}
	sliceStartChars({ skipStart = 0, chars }) {
		return span(this.getStart().move(skipStart).data, this.getStart().move(skipStart + chars).data);
	}
	sliceEndChars({ skipEnd = 0, chars }) {
		return span(this.getEnd().move(skipEnd - chars).data, this.getStart().move(-skipEnd).data);
	}
};
var CharPositionSpan = class {
	kind = CHAR_OFFSET_KIND;
	#locPosSpan = null;
	constructor(source, charPositions) {
		this.source = source;
		this.charPositions = charPositions;
	}
	wrap() {
		return new SourceSpan(this);
	}
	asString() {
		return this.source.slice(this.charPositions.start.charPos, this.charPositions.end.charPos);
	}
	getModule() {
		return this.source.module;
	}
	getStart() {
		return this.charPositions.start;
	}
	getEnd() {
		return this.charPositions.end;
	}
	locDidUpdate() {}
	toHbsSpan() {
		let locPosSpan = this.#locPosSpan;
		if (locPosSpan === null) {
			const start = this.charPositions.start.toHbsPos();
			const end = this.charPositions.end.toHbsPos();
			if (start === null || end === null) locPosSpan = this.#locPosSpan = BROKEN;
			else locPosSpan = this.#locPosSpan = new HbsSpan(this.source, {
				start,
				end
			});
		}
		return locPosSpan === BROKEN ? null : locPosSpan;
	}
	serialize() {
		const { start: { charPos: start }, end: { charPos: end } } = this.charPositions;
		if (start === end) return start;
		else return [start, end];
	}
	toCharPosSpan() {
		return this;
	}
};
var HbsSpan = class {
	kind = HBS_POSITION_KIND;
	#charPosSpan = null;
	#providedHbsLoc;
	constructor(source, hbsPositions, providedHbsLoc = null) {
		this.source = source;
		this.hbsPositions = hbsPositions;
		this.#providedHbsLoc = providedHbsLoc;
	}
	serialize() {
		const charPos = this.toCharPosSpan();
		return charPos === null ? BROKEN_KIND : charPos.wrap().serialize();
	}
	wrap() {
		return new SourceSpan(this);
	}
	updateProvided(pos, edge) {
		if (this.#providedHbsLoc) this.#providedHbsLoc[edge] = pos;
		this.#charPosSpan = null;
		this.#providedHbsLoc = {
			start: pos,
			end: pos
		};
	}
	locDidUpdate({ start, end }) {
		if (start !== void 0) {
			this.updateProvided(start, "start");
			this.hbsPositions.start = new HbsPosition(this.source, start, null);
		}
		if (end !== void 0) {
			this.updateProvided(end, "end");
			this.hbsPositions.end = new HbsPosition(this.source, end, null);
		}
	}
	asString() {
		const span = this.toCharPosSpan();
		return span === null ? "" : span.asString();
	}
	getModule() {
		return this.source.module;
	}
	getStart() {
		return this.hbsPositions.start;
	}
	getEnd() {
		return this.hbsPositions.end;
	}
	toHbsLoc() {
		return {
			start: this.hbsPositions.start.hbsPos,
			end: this.hbsPositions.end.hbsPos
		};
	}
	toHbsSpan() {
		return this;
	}
	toCharPosSpan() {
		let charPosSpan = this.#charPosSpan;
		if (charPosSpan === null) {
			const start = this.hbsPositions.start.toCharPos();
			const end = this.hbsPositions.end.toCharPos();
			if (start && end) charPosSpan = this.#charPosSpan = new CharPositionSpan(this.source, {
				start,
				end
			});
			else {
				charPosSpan = this.#charPosSpan = BROKEN;
				return null;
			}
		}
		return charPosSpan === BROKEN ? null : charPosSpan;
	}
};
var InvisibleSpan = class {
	constructor(kind, loc, string = null) {
		this.kind = kind;
		this.loc = loc;
		this.string = string;
	}
	serialize() {
		switch (this.kind) {
			case BROKEN_KIND:
			case NON_EXISTENT_KIND: return this.kind;
			case INTERNAL_SYNTHETIC_KIND: return this.string || "";
		}
	}
	wrap() {
		return new SourceSpan(this);
	}
	asString() {
		return this.string || "";
	}
	locDidUpdate({ start, end }) {
		if (start !== void 0) this.loc.start = start;
		if (end !== void 0) this.loc.end = end;
	}
	getModule() {
		return "an unknown module";
	}
	getStart() {
		return new InvisiblePosition(this.kind, this.loc.start);
	}
	getEnd() {
		return new InvisiblePosition(this.kind, this.loc.end);
	}
	toCharPosSpan() {
		return this;
	}
	toHbsSpan() {
		return null;
	}
	toHbsLoc() {
		return BROKEN_LOCATION;
	}
};
var span = match((m) => m.when(HBS_POSITION_KIND, HBS_POSITION_KIND, (left, right) => new HbsSpan(left.source, {
	start: left,
	end: right
}).wrap()).when(CHAR_OFFSET_KIND, CHAR_OFFSET_KIND, (left, right) => new CharPositionSpan(left.source, {
	start: left,
	end: right
}).wrap()).when(CHAR_OFFSET_KIND, HBS_POSITION_KIND, (left, right) => {
	const rightCharPos = right.toCharPos();
	if (rightCharPos === null) return new InvisibleSpan(BROKEN_KIND, BROKEN_LOCATION).wrap();
	else return span(left, rightCharPos);
}).when(HBS_POSITION_KIND, CHAR_OFFSET_KIND, (left, right) => {
	const leftCharPos = left.toCharPos();
	if (leftCharPos === null) return new InvisibleSpan(BROKEN_KIND, BROKEN_LOCATION).wrap();
	else return span(leftCharPos, right);
}).when(IsInvisible, MatchAny, (left) => new InvisibleSpan(left.kind, BROKEN_LOCATION).wrap()).when(MatchAny, IsInvisible, (_, right) => new InvisibleSpan(right.kind, BROKEN_LOCATION).wrap()));
/**
* All positions have these details in common. Most notably, all three kinds of positions can
* must be able to attempt to convert themselves into {@see CharPosition}.
*/
/**
* Used to indicate that an attempt to convert a `SourcePosition` to a character offset failed. It
* is separate from `null` so that `null` can be used to indicate that the computation wasn't yet
* attempted (and therefore to cache the failure)
*/
var BROKEN = "BROKEN";
/**
* A `SourceOffset` represents a single position in the source.
*
* There are three kinds of backing data for `SourceOffset` objects:
*
* - `CharPosition`, which contains a character offset into the raw source string
* - `HbsPosition`, which contains a `SourcePosition` from the Handlebars AST, which can be
*   converted to a `CharPosition` on demand.
* - `InvisiblePosition`, which represents a position not in source (@see {InvisiblePosition})
*/
var SourceOffset = class SourceOffset {
	/**
	* Create a `SourceOffset` from a Handlebars `SourcePosition`. It's stored as-is, and converted
	* into a character offset on demand, which avoids unnecessarily computing the offset of every
	* `SourceLocation`, but also means that broken `SourcePosition`s are not always detected.
	*/
	static forHbsPos(source, pos) {
		return new HbsPosition(source, pos, null).wrap();
	}
	/**
	* Create a `SourceOffset` that corresponds to a broken `SourcePosition`. This means that the
	* calling code determined (or knows) that the `SourceLocation` doesn't correspond correctly to
	* any part of the source.
	*/
	static broken(pos = UNKNOWN_POSITION) {
		return new InvisiblePosition(BROKEN_KIND, pos).wrap();
	}
	constructor(data) {
		this.data = data;
	}
	/**
	* Get the character offset for this `SourceOffset`, if possible.
	*/
	get offset() {
		const charPos = this.data.toCharPos();
		return charPos === null ? null : charPos.offset;
	}
	/**
	* Compare this offset with another one.
	*
	* If both offsets are `HbsPosition`s, they're equivalent as long as their lines and columns are
	* the same. This avoids computing offsets unnecessarily.
	*
	* Otherwise, two `SourceOffset`s are equivalent if their successfully computed character offsets
	* are the same.
	*/
	eql(right) {
		return eql(this.data, right.data);
	}
	/**
	* Create a span that starts from this source offset and ends with another source offset. Avoid
	* computing character offsets if both `SourceOffset`s are still lazy.
	*/
	until(other) {
		return span(this.data, other.data);
	}
	/**
	* Create a `SourceOffset` by moving the character position represented by this source offset
	* forward or backward (if `by` is negative), if possible.
	*
	* If this `SourceOffset` can't compute a valid character offset, `move` returns a broken offset.
	*
	* If the resulting character offset is less than 0 or greater than the size of the source, `move`
	* returns a broken offset.
	*/
	move(by) {
		const charPos = this.data.toCharPos();
		if (charPos === null) return SourceOffset.broken();
		else {
			const result = charPos.offset + by;
			if (charPos.source.validate(result)) return new CharPosition(charPos.source, result).wrap();
			else return SourceOffset.broken();
		}
	}
	/**
	* Create a new `SourceSpan` that represents a collapsed range at this source offset. Avoid
	* computing the character offset if it has not already been computed.
	*/
	collapsed() {
		return span(this.data, this.data);
	}
	/**
	* Convert this `SourceOffset` into a Handlebars {@see SourcePosition} for compatibility with
	* existing plugins.
	*/
	toJSON() {
		return this.data.toJSON();
	}
};
var CharPosition = class {
	kind = CHAR_OFFSET_KIND;
	/** Computed from char offset */
	_locPos = null;
	constructor(source, charPos) {
		this.source = source;
		this.charPos = charPos;
	}
	/**
	* This is already a `CharPosition`.
	*
	* {@see HbsPosition} for the alternative.
	*/
	toCharPos() {
		return this;
	}
	/**
	* Produce a Handlebars {@see SourcePosition} for this `CharPosition`. If this `CharPosition` was
	* computed using {@see SourceOffset#move}, this will compute the `SourcePosition` for the offset.
	*/
	toJSON() {
		const hbs = this.toHbsPos();
		return hbs === null ? UNKNOWN_POSITION : hbs.toJSON();
	}
	wrap() {
		return new SourceOffset(this);
	}
	/**
	* A `CharPosition` always has an offset it can produce without any additional computation.
	*/
	get offset() {
		return this.charPos;
	}
	/**
	* Convert the current character offset to an `HbsPosition`, if it was not already computed. Once
	* a `CharPosition` has computed its `HbsPosition`, it will not need to do compute it again, and
	* the same `CharPosition` is retained when used as one of the ends of a `SourceSpan`, so
	* computing the `HbsPosition` should be a one-time operation.
	*/
	toHbsPos() {
		let locPos = this._locPos;
		if (locPos === null) {
			const hbsPos = this.source.hbsPosFor(this.charPos);
			if (hbsPos === null) this._locPos = locPos = BROKEN;
			else this._locPos = locPos = new HbsPosition(this.source, hbsPos, this.charPos);
		}
		return locPos === BROKEN ? null : locPos;
	}
};
var HbsPosition = class {
	kind = HBS_POSITION_KIND;
	_charPos;
	constructor(source, hbsPos, charPos = null) {
		this.source = source;
		this.hbsPos = hbsPos;
		this._charPos = charPos === null ? null : new CharPosition(source, charPos);
	}
	/**
	* Lazily compute the character offset from the {@see SourcePosition}. Once an `HbsPosition` has
	* computed its `CharPosition`, it will not need to do compute it again, and the same
	* `HbsPosition` is retained when used as one of the ends of a `SourceSpan`, so computing the
	* `CharPosition` should be a one-time operation.
	*/
	toCharPos() {
		let charPos = this._charPos;
		if (charPos === null) {
			const charPosNumber = this.source.charPosFor(this.hbsPos);
			if (charPosNumber === null) this._charPos = charPos = BROKEN;
			else this._charPos = charPos = new CharPosition(this.source, charPosNumber);
		}
		return charPos === BROKEN ? null : charPos;
	}
	/**
	* Return the {@see SourcePosition} that this `HbsPosition` was instantiated with. This operation
	* does not need to compute anything.
	*/
	toJSON() {
		return this.hbsPos;
	}
	wrap() {
		return new SourceOffset(this);
	}
	/**
	* This is already an `HbsPosition`.
	*
	* {@see CharPosition} for the alternative.
	*/
	toHbsPos() {
		return this;
	}
};
var InvisiblePosition = class {
	constructor(kind, pos) {
		this.kind = kind;
		this.pos = pos;
	}
	/**
	* A broken position cannot be turned into a {@see CharacterPosition}.
	*/
	toCharPos() {
		return null;
	}
	/**
	* The serialization of an `InvisiblePosition is whatever Handlebars {@see SourcePosition} was
	* originally identified as broken, non-existent or synthetic.
	*
	* If an `InvisiblePosition` never had an source offset at all, this method returns
	* {@see UNKNOWN_POSITION} for compatibility.
	*/
	toJSON() {
		return this.pos;
	}
	wrap() {
		return new SourceOffset(this);
	}
	get offset() {
		return null;
	}
};
/**
* Compare two {@see AnyPosition} and determine whether they are equal.
*
* @see {SourceOffset#eql}
*/
var eql = match((m) => m.when(HBS_POSITION_KIND, HBS_POSITION_KIND, ({ hbsPos: left }, { hbsPos: right }) => left.column === right.column && left.line === right.line).when(CHAR_OFFSET_KIND, CHAR_OFFSET_KIND, ({ charPos: left }, { charPos: right }) => left === right).when(CHAR_OFFSET_KIND, HBS_POSITION_KIND, ({ offset: left }, right) => left === right.toCharPos()?.offset).when(HBS_POSITION_KIND, CHAR_OFFSET_KIND, (left, { offset: right }) => left.toCharPos()?.offset === right).when(MatchAny, MatchAny, () => false));
var Source = class Source {
	static from(source, options = {}) {
		return new Source(source, options.meta?.moduleName);
	}
	/** Char offset of each `\n` in the source. */
	#newlineOffsets;
	constructor(source, module = "an unknown module") {
		this.source = source;
		this.module = module;
		setLocalDebugType("syntax:source", this);
		this.#newlineOffsets = computeNewlineOffsets(source);
	}
	/**
	* Validate that the character offset represents a position in the source string.
	*/
	validate(offset) {
		return offset >= 0 && offset <= this.source.length;
	}
	slice(start, end) {
		return this.source.slice(start, end);
	}
	offsetFor(line, column) {
		return SourceOffset.forHbsPos(this, {
			line,
			column
		});
	}
	spanFor({ start, end }) {
		return SourceSpan.forHbsLoc(this, {
			start: {
				line: start.line,
				column: start.column
			},
			end: {
				line: end.line,
				column: end.column
			}
		});
	}
	hbsPosFor(offset) {
		if (offset < 0 || offset > this.source.length) return null;
		const lineIdx = lowerBound(this.#newlineOffsets, offset);
		return {
			line: lineIdx + 1,
			column: offset - this.#lineStartFor(lineIdx)
		};
	}
	charPosFor({ line, column }) {
		const lineIdx = line - 1;
		if (lineIdx < 0 || lineIdx > this.#newlineOffsets.length || column < 0) return null;
		const lineStart = lineIdx === 0 ? 0 : this.#newlineOffsets[lineIdx - 1] + 1;
		const lineEnd = this.#newlineOffsets[lineIdx] ?? this.source.length;
		const target = lineStart + column;
		if (target <= lineEnd) return target;
		return lineEnd;
	}
	#lineStartFor(lineIdx) {
		if (lineIdx === 0) return 0;
		const prevNl = this.#newlineOffsets[lineIdx - 1];
		return prevNl === void 0 ? 0 : prevNl + 1;
	}
};
function computeNewlineOffsets(source) {
	const offsets = [];
	for (let i = source.indexOf("\n"); i !== -1; i = source.indexOf("\n", i + 1)) offsets.push(i);
	return offsets;
}
/** Lower-bound binary search: smallest i with arr[i] >= target, else arr.length. */
function lowerBound(arr, target) {
	let lo = 0;
	let hi = arr.length;
	while (lo < hi) {
		const mid = lo + hi >>> 1;
		if (arr[mid] < target) lo = mid + 1;
		else hi = mid;
	}
	return lo;
}
var SpanList = class SpanList {
	static range(span, fallback = SourceSpan.NON_EXISTENT) {
		return new SpanList(span.map(loc)).getRangeOffset(fallback);
	}
	_span;
	constructor(span = []) {
		this._span = span;
	}
	add(offset) {
		this._span.push(offset);
	}
	getRangeOffset(fallback) {
		if (isPresentArray(this._span)) {
			let first = getFirst(this._span);
			let last = getLast(this._span);
			return first.extend(last);
		} else return fallback;
	}
};
function loc(span) {
	if (Array.isArray(span)) {
		let first = getFirst(span);
		let last = getLast(span);
		return loc(first).extend(loc(last));
	} else if (span instanceof SourceSpan) return span;
	else return span.loc;
}
function hasSpan(span) {
	if (Array.isArray(span) && span.length === 0) return false;
	return true;
}
function maybeLoc(location, fallback) {
	if (hasSpan(location)) return loc(location);
	else return fallback;
}
var errorProps = [
	"description",
	"fileName",
	"lineNumber",
	"endLineNumber",
	"message",
	"name",
	"number",
	"stack"
];
function Exception(message, node) {
	let loc = node && node.loc, line, endLineNumber, column, endColumn;
	if (loc) {
		line = loc.start.line;
		endLineNumber = loc.end.line;
		column = loc.start.column;
		endColumn = loc.end.column;
		message += " - " + line + ":" + column;
	}
	let tmp = Error.prototype.constructor.call(this, message);
	for (let idx = 0; idx < errorProps.length; idx++) this[errorProps[idx]] = tmp[errorProps[idx]];
	/* istanbul ignore else */
	if (Error.captureStackTrace) Error.captureStackTrace(this, Exception);
	try {
		if (loc) {
			this.lineNumber = line;
			this.endLineNumber = endLineNumber;
			/* istanbul ignore next */
			if (Object.defineProperty) {
				Object.defineProperty(this, "column", {
					value: column,
					enumerable: true
				});
				Object.defineProperty(this, "endColumn", {
					value: endColumn,
					enumerable: true
				});
			} else {
				this.column = column;
				this.endColumn = endColumn;
			}
		}
	} catch (nop) {}
}
Exception.prototype = /* @__PURE__ */ new Error();
function Visitor() {
	this.parents = [];
}
Visitor.prototype = {
	constructor: Visitor,
	mutating: false,
	acceptKey: function(node, name) {
		let value = this.accept(node[name]);
		if (this.mutating) {
			if (value && !Visitor.prototype[value.type]) throw new Exception("Unexpected node type \"" + value.type + "\" found when accepting " + name + " on " + node.type);
			node[name] = value;
		}
	},
	acceptRequired: function(node, name) {
		this.acceptKey(node, name);
		if (!node[name]) throw new Exception(node.type + " requires " + name);
	},
	acceptArray: function(array) {
		for (let i = 0, l = array.length; i < l; i++) {
			this.acceptKey(array, i);
			if (!array[i]) {
				array.splice(i, 1);
				i--;
				l--;
			}
		}
	},
	accept: function(object) {
		if (!object) return;
		/* istanbul ignore next: Sanity code */
		if (!this[object.type]) throw new Exception("Unknown type: " + object.type, object);
		if (this.current) this.parents.unshift(this.current);
		this.current = object;
		let ret = this[object.type](object);
		this.current = this.parents.shift();
		if (!this.mutating || ret) return ret;
		else if (ret !== false) return object;
	},
	Program: function(program) {
		this.acceptArray(program.body);
	},
	MustacheStatement: visitSubExpression,
	Decorator: visitSubExpression,
	BlockStatement: visitBlock,
	DecoratorBlock: visitBlock,
	PartialStatement: visitPartial,
	PartialBlockStatement: function(partial) {
		visitPartial.call(this, partial);
		this.acceptKey(partial, "program");
	},
	ContentStatement: function() {},
	CommentStatement: function() {},
	SubExpression: visitSubExpression,
	PathExpression: function() {},
	StringLiteral: function() {},
	NumberLiteral: function() {},
	BooleanLiteral: function() {},
	UndefinedLiteral: function() {},
	NullLiteral: function() {},
	Hash: function(hash) {
		this.acceptArray(hash.pairs);
	},
	HashPair: function(pair) {
		this.acceptRequired(pair, "value");
	}
};
function visitSubExpression(mustache) {
	this.acceptRequired(mustache, "path");
	this.acceptArray(mustache.params);
	this.acceptKey(mustache, "hash");
}
function visitBlock(block) {
	visitSubExpression.call(this, block);
	this.acceptKey(block, "program");
	this.acceptKey(block, "inverse");
}
function visitPartial(partial) {
	this.acceptRequired(partial, "name");
	this.acceptArray(partial.params);
	this.acceptKey(partial, "hash");
}
function WhitespaceControl(options = {}) {
	this.options = options;
}
WhitespaceControl.prototype = new Visitor();
WhitespaceControl.prototype.Program = function(program) {
	const doStandalone = !this.options.ignoreStandalone;
	let isRoot = !this.isRootSeen;
	this.isRootSeen = true;
	let body = program.body;
	for (let i = 0, l = body.length; i < l; i++) {
		let current = body[i], strip = this.accept(current);
		if (!strip) continue;
		let _isPrevWhitespace = isPrevWhitespace(body, i, isRoot), _isNextWhitespace = isNextWhitespace(body, i, isRoot), openStandalone = strip.openStandalone && _isPrevWhitespace, closeStandalone = strip.closeStandalone && _isNextWhitespace, inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
		if (strip.close) omitRight(body, i, true);
		if (strip.open) omitLeft(body, i, true);
		if (doStandalone && inlineStandalone) {
			omitRight(body, i);
			if (omitLeft(body, i)) {
				if (current.type === "PartialStatement") current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
			}
		}
		if (doStandalone && openStandalone) {
			omitRight((current.program || current.inverse).body);
			omitLeft(body, i);
		}
		if (doStandalone && closeStandalone) {
			omitRight(body, i);
			omitLeft((current.inverse || current.program).body);
		}
	}
	return program;
};
WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function(block) {
	this.accept(block.program);
	this.accept(block.inverse);
	let program = block.program || block.inverse, inverse = block.program && block.inverse, firstInverse = inverse, lastInverse = inverse;
	if (inverse && inverse.chained) {
		firstInverse = inverse.body[0].program;
		while (lastInverse.chained) lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
	}
	let strip = {
		open: block.openStrip.open,
		close: block.closeStrip.close,
		openStandalone: isNextWhitespace(program.body),
		closeStandalone: isPrevWhitespace((firstInverse || program).body)
	};
	if (block.openStrip.close) omitRight(program.body, null, true);
	if (inverse) {
		let inverseStrip = block.inverseStrip;
		if (inverseStrip.open) omitLeft(program.body, null, true);
		if (inverseStrip.close) omitRight(firstInverse.body, null, true);
		if (block.closeStrip.open) omitLeft(lastInverse.body, null, true);
		if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
			omitLeft(program.body);
			omitRight(firstInverse.body);
		}
	} else if (block.closeStrip.open) omitLeft(program.body, null, true);
	return strip;
};
WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function(mustache) {
	return mustache.strip;
};
WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function(node) {
	/* istanbul ignore next */
	let strip = node.strip || {};
	return {
		inlineStandalone: true,
		open: strip.open,
		close: strip.close
	};
};
function isPrevWhitespace(body, i, isRoot) {
	if (i === void 0) i = body.length;
	let prev = body[i - 1], sibling = body[i - 2];
	if (!prev) return isRoot;
	if (prev.type === "ContentStatement") return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
}
function isNextWhitespace(body, i, isRoot) {
	if (i === void 0) i = -1;
	let next = body[i + 1], sibling = body[i + 2];
	if (!next) return isRoot;
	if (next.type === "ContentStatement") return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
}
function omitRight(body, i, multiple) {
	let current = body[i == null ? 0 : i + 1];
	if (!current || current.type !== "ContentStatement" || !multiple && current.rightStripped) return;
	let original = current.value;
	current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, "");
	current.rightStripped = current.value !== original;
}
function omitLeft(body, i, multiple) {
	let current = body[i == null ? body.length - 1 : i - 1];
	if (!current || current.type !== "ContentStatement" || !multiple && current.leftStripped) return;
	let original = current.value;
	current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, "");
	current.leftStripped = current.value !== original;
	return current.leftStripped;
}
var parser = function() {
	var o = function(k, v, o, l) {
		for (o = o || {}, l = k.length; l--; o[k[l]] = v);
		return o;
	}, $V0 = [2, 52], $V1 = [1, 20], $V2 = [
		5,
		14,
		15,
		19,
		29,
		34,
		39,
		44,
		47,
		48,
		53,
		57,
		61
	], $V3 = [1, 44], $V4 = [1, 40], $V5 = [1, 43], $V6 = [1, 33], $V7 = [1, 34], $V8 = [1, 35], $V9 = [1, 36], $Va = [1, 37], $Vb = [1, 42], $Vc = [1, 46], $Vd = [
		14,
		15,
		19,
		29,
		34,
		39,
		44,
		47,
		48,
		53,
		57,
		61
	], $Ve = [
		14,
		15,
		19,
		29,
		34,
		44,
		47,
		48,
		53,
		57,
		61
	], $Vf = [15, 18], $Vg = [
		14,
		15,
		19,
		29,
		34,
		47,
		48,
		53,
		57,
		61
	], $Vh = [
		33,
		67,
		73,
		75,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vi = [
		23,
		33,
		56,
		67,
		68,
		73,
		75,
		77,
		79,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vj = [1, 62], $Vk = [1, 63], $Vl = [
		23,
		33,
		56,
		68,
		73,
		79
	], $Vm = [
		23,
		33,
		56,
		67,
		68,
		73,
		75,
		77,
		79,
		84,
		85,
		86,
		87,
		88,
		89,
		92,
		93
	], $Vn = [2, 51], $Vo = [1, 64], $Vp = [
		67,
		73,
		75,
		77,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vq = [
		56,
		67,
		73,
		75,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vr = [1, 75], $Vs = [1, 76], $Vt = [1, 83], $Vu = [
		33,
		67,
		73,
		75,
		79,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vv = [
		23,
		67,
		73,
		75,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vw = [
		67,
		68,
		73,
		75,
		84,
		85,
		86,
		87,
		88,
		89
	], $Vx = [33, 79], $Vy = [1, 134], $Vz = [73, 81];
	var parser = {
		trace: function trace() {},
		yy: {},
		symbols_: {
			error: 2,
			root: 3,
			program: 4,
			EOF: 5,
			program_repetition0: 6,
			statement: 7,
			mustache: 8,
			block: 9,
			rawBlock: 10,
			partial: 11,
			partialBlock: 12,
			content: 13,
			COMMENT: 14,
			CONTENT: 15,
			openRawBlock: 16,
			rawBlock_repetition0: 17,
			END_RAW_BLOCK: 18,
			OPEN_RAW_BLOCK: 19,
			helperName: 20,
			openRawBlock_repetition0: 21,
			openRawBlock_option0: 22,
			CLOSE_RAW_BLOCK: 23,
			openBlock: 24,
			block_option0: 25,
			closeBlock: 26,
			openInverse: 27,
			block_option1: 28,
			OPEN_BLOCK: 29,
			openBlock_repetition0: 30,
			openBlock_option0: 31,
			openBlock_option1: 32,
			CLOSE: 33,
			OPEN_INVERSE: 34,
			openInverse_repetition0: 35,
			openInverse_option0: 36,
			openInverse_option1: 37,
			openInverseChain: 38,
			OPEN_INVERSE_CHAIN: 39,
			openInverseChain_repetition0: 40,
			openInverseChain_option0: 41,
			openInverseChain_option1: 42,
			inverseAndProgram: 43,
			INVERSE: 44,
			inverseChain: 45,
			inverseChain_option0: 46,
			OPEN_ENDBLOCK: 47,
			OPEN: 48,
			hash: 49,
			expr: 50,
			mustache_repetition0: 51,
			mustache_option0: 52,
			OPEN_UNESCAPED: 53,
			mustache_repetition1: 54,
			mustache_option1: 55,
			CLOSE_UNESCAPED: 56,
			OPEN_PARTIAL: 57,
			partial_repetition0: 58,
			partial_option0: 59,
			openPartialBlock: 60,
			OPEN_PARTIAL_BLOCK: 61,
			openPartialBlock_repetition0: 62,
			openPartialBlock_option0: 63,
			exprHead: 64,
			arrayLiteral: 65,
			sexpr: 66,
			OPEN_SEXPR: 67,
			CLOSE_SEXPR: 68,
			sexpr_repetition0: 69,
			sexpr_option0: 70,
			hash_repetition_plus0: 71,
			hashSegment: 72,
			ID: 73,
			EQUALS: 74,
			OPEN_ARRAY: 75,
			arrayLiteral_repetition0: 76,
			CLOSE_ARRAY: 77,
			blockParams: 78,
			OPEN_BLOCK_PARAMS: 79,
			blockParams_repetition_plus0: 80,
			CLOSE_BLOCK_PARAMS: 81,
			path: 82,
			dataName: 83,
			STRING: 84,
			NUMBER: 85,
			BOOLEAN: 86,
			UNDEFINED: 87,
			NULL: 88,
			DATA: 89,
			pathSegments: 90,
			sep: 91,
			SEP: 92,
			PRIVATE_SEP: 93,
			$accept: 0,
			$end: 1
		},
		terminals_: {
			2: "error",
			5: "EOF",
			14: "COMMENT",
			15: "CONTENT",
			18: "END_RAW_BLOCK",
			19: "OPEN_RAW_BLOCK",
			23: "CLOSE_RAW_BLOCK",
			29: "OPEN_BLOCK",
			33: "CLOSE",
			34: "OPEN_INVERSE",
			39: "OPEN_INVERSE_CHAIN",
			44: "INVERSE",
			47: "OPEN_ENDBLOCK",
			48: "OPEN",
			53: "OPEN_UNESCAPED",
			56: "CLOSE_UNESCAPED",
			57: "OPEN_PARTIAL",
			61: "OPEN_PARTIAL_BLOCK",
			67: "OPEN_SEXPR",
			68: "CLOSE_SEXPR",
			73: "ID",
			74: "EQUALS",
			75: "OPEN_ARRAY",
			77: "CLOSE_ARRAY",
			79: "OPEN_BLOCK_PARAMS",
			81: "CLOSE_BLOCK_PARAMS",
			84: "STRING",
			85: "NUMBER",
			86: "BOOLEAN",
			87: "UNDEFINED",
			88: "NULL",
			89: "DATA",
			92: "SEP",
			93: "PRIVATE_SEP"
		},
		productions_: [
			0,
			[3, 2],
			[4, 1],
			[7, 1],
			[7, 1],
			[7, 1],
			[7, 1],
			[7, 1],
			[7, 1],
			[7, 1],
			[13, 1],
			[10, 3],
			[16, 5],
			[9, 4],
			[9, 4],
			[24, 6],
			[27, 6],
			[38, 6],
			[43, 2],
			[45, 3],
			[45, 1],
			[26, 3],
			[8, 3],
			[8, 5],
			[8, 5],
			[11, 5],
			[12, 3],
			[60, 5],
			[50, 1],
			[50, 1],
			[64, 1],
			[64, 1],
			[66, 3],
			[66, 5],
			[49, 1],
			[72, 3],
			[65, 3],
			[78, 3],
			[20, 1],
			[20, 1],
			[20, 1],
			[20, 1],
			[20, 1],
			[20, 1],
			[20, 1],
			[83, 2],
			[91, 1],
			[91, 1],
			[82, 3],
			[82, 1],
			[90, 3],
			[90, 1],
			[6, 0],
			[6, 2],
			[17, 0],
			[17, 2],
			[21, 0],
			[21, 2],
			[22, 0],
			[22, 1],
			[25, 0],
			[25, 1],
			[28, 0],
			[28, 1],
			[30, 0],
			[30, 2],
			[31, 0],
			[31, 1],
			[32, 0],
			[32, 1],
			[35, 0],
			[35, 2],
			[36, 0],
			[36, 1],
			[37, 0],
			[37, 1],
			[40, 0],
			[40, 2],
			[41, 0],
			[41, 1],
			[42, 0],
			[42, 1],
			[46, 0],
			[46, 1],
			[51, 0],
			[51, 2],
			[52, 0],
			[52, 1],
			[54, 0],
			[54, 2],
			[55, 0],
			[55, 1],
			[58, 0],
			[58, 2],
			[59, 0],
			[59, 1],
			[62, 0],
			[62, 2],
			[63, 0],
			[63, 1],
			[69, 0],
			[69, 2],
			[70, 0],
			[70, 1],
			[71, 1],
			[71, 2],
			[76, 0],
			[76, 2],
			[80, 1],
			[80, 2]
		],
		performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
			var $0 = $$.length - 1;
			switch (yystate) {
				case 1: return $$[$0 - 1];
				case 2:
					this.$ = yy.prepareProgram($$[$0]);
					break;
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 20:
				case 28:
				case 29:
				case 30:
				case 31:
				case 38:
				case 39:
				case 46:
				case 47:
					this.$ = $$[$0];
					break;
				case 9:
					this.$ = {
						type: "CommentStatement",
						value: yy.stripComment($$[$0]),
						strip: yy.stripFlags($$[$0], $$[$0]),
						loc: yy.locInfo(this._$)
					};
					break;
				case 10:
					this.$ = {
						type: "ContentStatement",
						original: $$[$0],
						value: $$[$0],
						loc: yy.locInfo(this._$)
					};
					break;
				case 11:
					this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
					break;
				case 12:
					this.$ = {
						path: $$[$0 - 3],
						params: $$[$0 - 2],
						hash: $$[$0 - 1]
					};
					break;
				case 13:
					this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
					break;
				case 14:
					this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
					break;
				case 15:
					this.$ = {
						open: $$[$0 - 5],
						path: $$[$0 - 4],
						params: $$[$0 - 3],
						hash: $$[$0 - 2],
						blockParams: $$[$0 - 1],
						strip: yy.stripFlags($$[$0 - 5], $$[$0])
					};
					break;
				case 16:
				case 17:
					this.$ = {
						path: $$[$0 - 4],
						params: $$[$0 - 3],
						hash: $$[$0 - 2],
						blockParams: $$[$0 - 1],
						strip: yy.stripFlags($$[$0 - 5], $$[$0])
					};
					break;
				case 18:
					this.$ = {
						strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]),
						program: $$[$0]
					};
					break;
				case 19:
					var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$), program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
					program.chained = true;
					this.$ = {
						strip: $$[$0 - 2].strip,
						program,
						chain: true
					};
					break;
				case 21:
					this.$ = {
						path: $$[$0 - 1],
						strip: yy.stripFlags($$[$0 - 2], $$[$0])
					};
					break;
				case 22:
					this.$ = yy.prepareMustache(yy.syntax.hash($$[$0 - 1], yy.locInfo(this._$), {
						yy,
						syntax: "expr"
					}), [], void 0, $$[$0 - 2], yy.stripFlags($$[$0 - 2], $$[$0]), this._$);
					break;
				case 23:
				case 24:
					this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
					break;
				case 25:
					this.$ = {
						type: "PartialStatement",
						name: $$[$0 - 3],
						params: $$[$0 - 2],
						hash: $$[$0 - 1],
						indent: "",
						strip: yy.stripFlags($$[$0 - 4], $$[$0]),
						loc: yy.locInfo(this._$)
					};
					break;
				case 26:
					this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
					break;
				case 27:
					this.$ = {
						path: $$[$0 - 3],
						params: $$[$0 - 2],
						hash: $$[$0 - 1],
						strip: yy.stripFlags($$[$0 - 4], $$[$0])
					};
					break;
				case 32:
					this.$ = yy.syntax.hash($$[$0 - 1], yy.locInfo(this._$), {
						yy,
						syntax: "expr"
					});
					break;
				case 33:
					this.$ = {
						type: "SubExpression",
						path: $$[$0 - 3],
						params: $$[$0 - 2],
						hash: $$[$0 - 1],
						loc: yy.locInfo(this._$)
					};
					break;
				case 34:
					this.$ = {
						type: "Hash",
						pairs: $$[$0],
						loc: yy.locInfo(this._$)
					};
					break;
				case 35:
					this.$ = {
						type: "HashPair",
						key: yy.id($$[$0 - 2]),
						value: $$[$0],
						loc: yy.locInfo(this._$)
					};
					break;
				case 36:
					this.$ = yy.syntax.square($$[$0 - 1], yy.locInfo(this._$), {
						yy,
						syntax: "expr"
					});
					break;
				case 37:
					this.$ = yy.id($$[$0 - 1]);
					break;
				case 40:
					this.$ = {
						type: "StringLiteral",
						value: $$[$0],
						original: $$[$0],
						loc: yy.locInfo(this._$)
					};
					break;
				case 41:
					this.$ = {
						type: "NumberLiteral",
						value: Number($$[$0]),
						original: Number($$[$0]),
						loc: yy.locInfo(this._$)
					};
					break;
				case 42:
					this.$ = {
						type: "BooleanLiteral",
						value: $$[$0] === "true",
						original: $$[$0] === "true",
						loc: yy.locInfo(this._$)
					};
					break;
				case 43:
					this.$ = {
						type: "UndefinedLiteral",
						original: void 0,
						value: void 0,
						loc: yy.locInfo(this._$)
					};
					break;
				case 44:
					this.$ = {
						type: "NullLiteral",
						original: null,
						value: null,
						loc: yy.locInfo(this._$)
					};
					break;
				case 45:
					this.$ = yy.preparePath(true, false, $$[$0], this._$);
					break;
				case 48:
					this.$ = yy.preparePath(false, $$[$0 - 2], $$[$0], this._$);
					break;
				case 49:
					this.$ = yy.preparePath(false, false, $$[$0], this._$);
					break;
				case 50:
					$$[$0 - 2].push({
						part: yy.id($$[$0]),
						original: $$[$0],
						separator: $$[$0 - 1]
					});
					this.$ = $$[$0 - 2];
					break;
				case 51:
					this.$ = [{
						part: yy.id($$[$0]),
						original: $$[$0]
					}];
					break;
				case 52:
				case 54:
				case 56:
				case 64:
				case 70:
				case 76:
				case 84:
				case 88:
				case 92:
				case 96:
				case 100:
				case 106:
					this.$ = [];
					break;
				case 53:
				case 55:
				case 57:
				case 65:
				case 71:
				case 77:
				case 85:
				case 89:
				case 93:
				case 97:
				case 101:
				case 105:
				case 107:
				case 109:
					$$[$0 - 1].push($$[$0]);
					break;
				case 104:
				case 108: this.$ = [$$[$0]];
			}
		},
		table: [
			o([
				5,
				14,
				15,
				19,
				29,
				34,
				48,
				53,
				57,
				61
			], $V0, {
				3: 1,
				4: 2,
				6: 3
			}),
			{ 1: [3] },
			{ 5: [1, 4] },
			o([
				5,
				39,
				44,
				47
			], [2, 2], {
				7: 5,
				8: 6,
				9: 7,
				10: 8,
				11: 9,
				12: 10,
				13: 11,
				24: 15,
				27: 16,
				16: 17,
				60: 19,
				14: [1, 12],
				15: $V1,
				19: [1, 23],
				29: [1, 21],
				34: [1, 22],
				48: [1, 13],
				53: [1, 14],
				57: [1, 18],
				61: [1, 24]
			}),
			{ 1: [2, 1] },
			o($V2, [2, 53]),
			o($V2, [2, 3]),
			o($V2, [2, 4]),
			o($V2, [2, 5]),
			o($V2, [2, 6]),
			o($V2, [2, 7]),
			o($V2, [2, 8]),
			o($V2, [2, 9]),
			{
				20: 28,
				49: 25,
				50: 26,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{
				20: 28,
				50: 45,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($Vd, $V0, {
				6: 3,
				4: 47
			}),
			o($Ve, $V0, {
				6: 3,
				4: 48
			}),
			o($Vf, [2, 54], { 17: 49 }),
			{
				20: 28,
				50: 50,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($Vg, $V0, {
				6: 3,
				4: 51
			}),
			o([
				5,
				14,
				15,
				18,
				19,
				29,
				34,
				39,
				44,
				47,
				48,
				53,
				57,
				61
			], [2, 10]),
			{
				20: 52,
				64: 53,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{
				20: 54,
				64: 53,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{
				20: 55,
				64: 53,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{
				20: 28,
				50: 56,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{ 33: [1, 57] },
			o($Vh, [2, 84], { 51: 58 }),
			o([
				23,
				33,
				56,
				68,
				79
			], [2, 34], {
				72: 59,
				73: [1, 60]
			}),
			o($Vi, [2, 28]),
			o($Vi, [2, 29], {
				91: 61,
				92: $Vj,
				93: $Vk
			}),
			o($Vl, [2, 104]),
			o($Vi, [2, 38]),
			o($Vi, [2, 39]),
			o($Vi, [2, 40]),
			o($Vi, [2, 41]),
			o($Vi, [2, 42]),
			o($Vi, [2, 43]),
			o($Vi, [2, 44]),
			o($Vm, [2, 30]),
			o($Vm, [2, 31]),
			o([
				23,
				33,
				56,
				67,
				68,
				73,
				75,
				79,
				84,
				85,
				86,
				87,
				88,
				89,
				92,
				93
			], $Vn, { 74: $Vo }),
			o($Vi, [2, 49], {
				91: 65,
				92: $Vj,
				93: $Vk
			}),
			{
				73: $Vc,
				90: 66
			},
			o($Vp, [2, 106], { 76: 67 }),
			{
				20: 28,
				49: 68,
				50: 69,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($Vq, [2, 88], { 54: 70 }),
			o($Vm, $Vn),
			{
				25: 71,
				38: 73,
				39: $Vr,
				43: 74,
				44: $Vs,
				45: 72,
				47: [2, 60]
			},
			{
				28: 77,
				43: 78,
				44: $Vs,
				47: [2, 62]
			},
			{
				13: 80,
				15: $V1,
				18: [1, 79]
			},
			o($Vh, [2, 92], { 58: 81 }),
			{
				26: 82,
				47: $Vt
			},
			o($Vu, [2, 64], { 30: 84 }),
			{
				91: 61,
				92: $Vj,
				93: $Vk
			},
			o($Vu, [2, 70], { 35: 85 }),
			o($Vv, [2, 56], { 21: 86 }),
			o($Vh, [2, 96], { 62: 87 }),
			o($V2, [2, 22]),
			{
				20: 28,
				33: [2, 86],
				49: 90,
				50: 89,
				52: 88,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($Vl, [2, 105]),
			{ 74: $Vo },
			{
				73: $Vc,
				90: 91
			},
			{ 73: [2, 46] },
			{ 73: [2, 47] },
			{
				20: 28,
				50: 92,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{ 73: [1, 93] },
			o($Vi, [2, 45], {
				91: 65,
				92: $Vj,
				93: $Vk
			}),
			{
				20: 28,
				50: 95,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				77: [1, 94],
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{ 68: [1, 96] },
			o($Vw, [2, 100], { 69: 97 }),
			{
				20: 28,
				49: 100,
				50: 99,
				55: 98,
				56: [2, 90],
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{
				26: 101,
				47: $Vt
			},
			{ 47: [2, 61] },
			o($Vd, $V0, {
				6: 3,
				4: 102
			}),
			{ 47: [2, 20] },
			{
				20: 103,
				64: 53,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($Vg, $V0, {
				6: 3,
				4: 104
			}),
			{
				26: 105,
				47: $Vt
			},
			{ 47: [2, 63] },
			o($V2, [2, 11]),
			o($Vf, [2, 55]),
			{
				20: 28,
				33: [2, 94],
				49: 108,
				50: 107,
				59: 106,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($V2, [2, 26]),
			{
				20: 109,
				64: 53,
				65: 38,
				66: 39,
				67: $V3,
				73: $Vc,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			o($Vx, [2, 66], {
				71: 27,
				20: 28,
				64: 29,
				72: 30,
				82: 31,
				83: 32,
				65: 38,
				66: 39,
				90: 41,
				31: 110,
				50: 111,
				49: 112,
				67: $V3,
				73: $V4,
				75: $V5,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb
			}),
			o($Vx, [2, 72], {
				71: 27,
				20: 28,
				64: 29,
				72: 30,
				82: 31,
				83: 32,
				65: 38,
				66: 39,
				90: 41,
				36: 113,
				50: 114,
				49: 115,
				67: $V3,
				73: $V4,
				75: $V5,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb
			}),
			{
				20: 28,
				22: 116,
				23: [2, 58],
				49: 118,
				50: 117,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{
				20: 28,
				33: [2, 98],
				49: 121,
				50: 120,
				63: 119,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{ 33: [1, 122] },
			o($Vh, [2, 85]),
			{ 33: [2, 87] },
			o($Vi, [2, 48], {
				91: 65,
				92: $Vj,
				93: $Vk
			}),
			o($Vl, [2, 35]),
			o($Vm, [2, 50]),
			o($Vm, [2, 36]),
			o($Vp, [2, 107]),
			o($Vm, [2, 32]),
			{
				20: 28,
				49: 125,
				50: 124,
				64: 29,
				65: 38,
				66: 39,
				67: $V3,
				68: [2, 102],
				70: 123,
				71: 27,
				72: 30,
				73: $V4,
				75: $V5,
				82: 31,
				83: 32,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb,
				90: 41
			},
			{ 56: [1, 126] },
			o($Vq, [2, 89]),
			{ 56: [2, 91] },
			o($V2, [2, 13]),
			{
				38: 73,
				39: $Vr,
				43: 74,
				44: $Vs,
				45: 128,
				46: 127,
				47: [2, 82]
			},
			o($Vu, [2, 76], { 40: 129 }),
			{ 47: [2, 18] },
			o($V2, [2, 14]),
			{ 33: [1, 130] },
			o($Vh, [2, 93]),
			{ 33: [2, 95] },
			{ 33: [1, 131] },
			{
				32: 132,
				33: [2, 68],
				78: 133,
				79: $Vy
			},
			o($Vu, [2, 65]),
			o($Vx, [2, 67]),
			{
				33: [2, 74],
				37: 135,
				78: 136,
				79: $Vy
			},
			o($Vu, [2, 71]),
			o($Vx, [2, 73]),
			{ 23: [1, 137] },
			o($Vv, [2, 57]),
			{ 23: [2, 59] },
			{ 33: [1, 138] },
			o($Vh, [2, 97]),
			{ 33: [2, 99] },
			o($V2, [2, 23]),
			{ 68: [1, 139] },
			o($Vw, [2, 101]),
			{ 68: [2, 103] },
			o($V2, [2, 24]),
			{ 47: [2, 19] },
			{ 47: [2, 83] },
			o($Vx, [2, 78], {
				71: 27,
				20: 28,
				64: 29,
				72: 30,
				82: 31,
				83: 32,
				65: 38,
				66: 39,
				90: 41,
				41: 140,
				50: 141,
				49: 142,
				67: $V3,
				73: $V4,
				75: $V5,
				84: $V6,
				85: $V7,
				86: $V8,
				87: $V9,
				88: $Va,
				89: $Vb
			}),
			o($V2, [2, 25]),
			o($V2, [2, 21]),
			{ 33: [1, 143] },
			{ 33: [2, 69] },
			{
				73: [1, 145],
				80: 144
			},
			{ 33: [1, 146] },
			{ 33: [2, 75] },
			o($Vf, [2, 12]),
			o($Vg, [2, 27]),
			o($Vm, [2, 33]),
			{
				33: [2, 80],
				42: 147,
				78: 148,
				79: $Vy
			},
			o($Vu, [2, 77]),
			o($Vx, [2, 79]),
			o($Vd, [2, 15]),
			{
				73: [1, 150],
				81: [1, 149]
			},
			o($Vz, [2, 108]),
			o($Ve, [2, 16]),
			{ 33: [1, 151] },
			{ 33: [2, 81] },
			{ 33: [2, 37] },
			o($Vz, [2, 109]),
			o($Vd, [2, 17])
		],
		defaultActions: {
			4: [2, 1],
			62: [2, 46],
			63: [2, 47],
			72: [2, 61],
			74: [2, 20],
			78: [2, 63],
			90: [2, 87],
			100: [2, 91],
			104: [2, 18],
			108: [2, 95],
			118: [2, 59],
			121: [2, 99],
			125: [2, 103],
			127: [2, 19],
			128: [2, 83],
			133: [2, 69],
			136: [2, 75],
			148: [2, 81],
			149: [2, 37]
		},
		parseError: function parseError(str, hash) {
			if (hash.recoverable) this.trace(str);
			else {
				var error = new Error(str);
				error.hash = hash;
				throw error;
			}
		},
		parse: function parse(input) {
			var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
			var args = lstack.slice.call(arguments, 1);
			var lexer = Object.create(this.lexer);
			var sharedState = { yy: {} };
			for (var k in this.yy) if (Object.prototype.hasOwnProperty.call(this.yy, k)) sharedState.yy[k] = this.yy[k];
			lexer.setInput(input, sharedState.yy);
			sharedState.yy.lexer = lexer;
			sharedState.yy.parser = this;
			if (typeof lexer.yylloc == "undefined") lexer.yylloc = {};
			var yyloc = lexer.yylloc;
			lstack.push(yyloc);
			var ranges = lexer.options && lexer.options.ranges;
			if (typeof sharedState.yy.parseError === "function") this.parseError = sharedState.yy.parseError;
			else this.parseError = Object.getPrototypeOf(this).parseError;
			var lex = function() {
				var token = lexer.lex() || EOF;
				if (typeof token !== "number") token = self.symbols_[token] || token;
				return token;
			};
			var symbol, state, action, r, yyval = {}, p, len, newState, expected;
			while (true) {
				state = stack[stack.length - 1];
				if (this.defaultActions[state]) action = this.defaultActions[state];
				else {
					if (symbol === null || typeof symbol == "undefined") symbol = lex();
					action = table[state] && table[state][symbol];
				}
				if (typeof action === "undefined" || !action.length || !action[0]) {
					var errStr = "";
					expected = [];
					for (p in table[state]) if (this.terminals_[p] && p > TERROR) expected.push("'" + this.terminals_[p] + "'");
					if (lexer.showPosition) errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
					else errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
					this.parseError(errStr, {
						text: lexer.match,
						token: this.terminals_[symbol] || symbol,
						line: lexer.yylineno,
						loc: yyloc,
						expected
					});
				}
				if (action[0] instanceof Array && action.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
				switch (action[0]) {
					case 1:
						stack.push(symbol);
						vstack.push(lexer.yytext);
						lstack.push(lexer.yylloc);
						stack.push(action[1]);
						symbol = null;
						yyleng = lexer.yyleng;
						yytext = lexer.yytext;
						yylineno = lexer.yylineno;
						yyloc = lexer.yylloc;
						break;
					case 2:
						len = this.productions_[action[1]][1];
						yyval.$ = vstack[vstack.length - len];
						yyval._$ = {
							first_line: lstack[lstack.length - (len || 1)].first_line,
							last_line: lstack[lstack.length - 1].last_line,
							first_column: lstack[lstack.length - (len || 1)].first_column,
							last_column: lstack[lstack.length - 1].last_column
						};
						if (ranges) yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
						r = this.performAction.apply(yyval, [
							yytext,
							yyleng,
							yylineno,
							sharedState.yy,
							action[1],
							vstack,
							lstack
						].concat(args));
						if (typeof r !== "undefined") return r;
						if (len) {
							stack = stack.slice(0, -1 * len * 2);
							vstack = vstack.slice(0, -1 * len);
							lstack = lstack.slice(0, -1 * len);
						}
						stack.push(this.productions_[action[1]][0]);
						vstack.push(yyval.$);
						lstack.push(yyval._$);
						newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
						stack.push(newState);
						break;
					case 3: return true;
				}
			}
			return true;
		}
	};
	parser.lexer = function() {
		return {
			EOF: 1,
			parseError: function parseError(str, hash) {
				if (this.yy.parser) this.yy.parser.parseError(str, hash);
				else throw new Error(str);
			},
			setInput: function(input, yy) {
				this.yy = yy || this.yy || {};
				this._input = input;
				this._more = this._backtrack = this.done = false;
				this.yylineno = this.yyleng = 0;
				this.yytext = this.matched = this.match = "";
				this.conditionStack = ["INITIAL"];
				this.yylloc = {
					first_line: 1,
					first_column: 0,
					last_line: 1,
					last_column: 0
				};
				if (this.options.ranges) this.yylloc.range = [0, 0];
				this.offset = 0;
				return this;
			},
			input: function() {
				var ch = this._input[0];
				this.yytext += ch;
				this.yyleng++;
				this.offset++;
				this.match += ch;
				this.matched += ch;
				if (ch.match(/(?:\r\n?|\n).*/g)) {
					this.yylineno++;
					this.yylloc.last_line++;
				} else this.yylloc.last_column++;
				if (this.options.ranges) this.yylloc.range[1]++;
				this._input = this._input.slice(1);
				return ch;
			},
			unput: function(ch) {
				var len = ch.length;
				var lines = ch.split(/(?:\r\n?|\n)/g);
				this._input = ch + this._input;
				this.yytext = this.yytext.substr(0, this.yytext.length - len);
				this.offset -= len;
				var oldLines = this.match.split(/(?:\r\n?|\n)/g);
				this.match = this.match.substr(0, this.match.length - 1);
				this.matched = this.matched.substr(0, this.matched.length - 1);
				if (lines.length - 1) this.yylineno -= lines.length - 1;
				var r = this.yylloc.range;
				this.yylloc = {
					first_line: this.yylloc.first_line,
					last_line: this.yylineno + 1,
					first_column: this.yylloc.first_column,
					last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
				};
				if (this.options.ranges) this.yylloc.range = [r[0], r[0] + this.yyleng - len];
				this.yyleng = this.yytext.length;
				return this;
			},
			more: function() {
				this._more = true;
				return this;
			},
			reject: function() {
				if (this.options.backtrack_lexer) this._backtrack = true;
				else return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
					text: "",
					token: null,
					line: this.yylineno
				});
				return this;
			},
			less: function(n) {
				this.unput(this.match.slice(n));
			},
			pastInput: function() {
				var past = this.matched.substr(0, this.matched.length - this.match.length);
				return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
			},
			upcomingInput: function() {
				var next = this.match;
				if (next.length < 20) next += this._input.substr(0, 20 - next.length);
				return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
			},
			showPosition: function() {
				var pre = this.pastInput();
				var c = new Array(pre.length + 1).join("-");
				return pre + this.upcomingInput() + "\n" + c + "^";
			},
			test_match: function(match, indexed_rule) {
				var token, lines, backup;
				if (this.options.backtrack_lexer) {
					backup = {
						yylineno: this.yylineno,
						yylloc: {
							first_line: this.yylloc.first_line,
							last_line: this.last_line,
							first_column: this.yylloc.first_column,
							last_column: this.yylloc.last_column
						},
						yytext: this.yytext,
						match: this.match,
						matches: this.matches,
						matched: this.matched,
						yyleng: this.yyleng,
						offset: this.offset,
						_more: this._more,
						_input: this._input,
						yy: this.yy,
						conditionStack: this.conditionStack.slice(0),
						done: this.done
					};
					if (this.options.ranges) backup.yylloc.range = this.yylloc.range.slice(0);
				}
				lines = match[0].match(/(?:\r\n?|\n).*/g);
				if (lines) this.yylineno += lines.length;
				this.yylloc = {
					first_line: this.yylloc.last_line,
					last_line: this.yylineno + 1,
					first_column: this.yylloc.last_column,
					last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
				};
				this.yytext += match[0];
				this.match += match[0];
				this.matches = match;
				this.yyleng = this.yytext.length;
				if (this.options.ranges) this.yylloc.range = [this.offset, this.offset += this.yyleng];
				this._more = false;
				this._backtrack = false;
				this._input = this._input.slice(match[0].length);
				this.matched += match[0];
				token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
				if (this.done && this._input) this.done = false;
				if (token) return token;
				else if (this._backtrack) {
					for (var k in backup) this[k] = backup[k];
					return false;
				}
				return false;
			},
			next: function() {
				if (this.done) return this.EOF;
				if (!this._input) this.done = true;
				var token, match, tempMatch, index;
				if (!this._more) {
					this.yytext = "";
					this.match = "";
				}
				var rules = this._currentRules();
				for (var i = 0; i < rules.length; i++) {
					tempMatch = this._input.match(this.rules[rules[i]]);
					if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
						match = tempMatch;
						index = i;
						if (this.options.backtrack_lexer) {
							token = this.test_match(tempMatch, rules[i]);
							if (token !== false) return token;
							else if (this._backtrack) {
								match = false;
								continue;
							} else return false;
						} else if (!this.options.flex) break;
					}
				}
				if (match) {
					token = this.test_match(match, rules[index]);
					if (token !== false) return token;
					return false;
				}
				if (this._input === "") return this.EOF;
				else return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
					text: "",
					token: null,
					line: this.yylineno
				});
			},
			lex: function lex() {
				var r = this.next();
				if (r) return r;
				else return this.lex();
			},
			begin: function begin(condition) {
				this.conditionStack.push(condition);
			},
			popState: function popState() {
				if (this.conditionStack.length - 1 > 0) return this.conditionStack.pop();
				else return this.conditionStack[0];
			},
			_currentRules: function _currentRules() {
				if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
				else return this.conditions["INITIAL"].rules;
			},
			topState: function topState(n) {
				n = this.conditionStack.length - 1 - Math.abs(n || 0);
				if (n >= 0) return this.conditionStack[n];
				else return "INITIAL";
			},
			pushState: function pushState(condition) {
				this.begin(condition);
			},
			stateStackSize: function stateStackSize() {
				return this.conditionStack.length;
			},
			options: {},
			performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
				function strip(start, end) {
					return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
				}
				switch ($avoiding_name_collisions) {
					case 0:
						if (yy_.yytext.slice(-2) === "\\\\") {
							strip(0, 1);
							this.begin("mu");
						} else if (yy_.yytext.slice(-1) === "\\") {
							strip(0, 1);
							this.begin("emu");
						} else this.begin("mu");
						if (yy_.yytext) return 15;
						break;
					case 1: return 15;
					case 2:
						this.popState();
						return 15;
					case 3:
						this.begin("raw");
						return 15;
					case 4:
						this.popState();
						if (this.conditionStack[this.conditionStack.length - 1] === "raw") return 15;
						else {
							strip(5, 9);
							return 18;
						}
					case 5: return 15;
					case 6:
						this.popState();
						return 14;
					case 7: return 67;
					case 8: return 68;
					case 9:
						if (yy.syntax.square === "string") {
							this.unput(yy_.yytext);
							this.begin("escl");
						} else return 75;
						break;
					case 10: return 77;
					case 11: return 19;
					case 12:
						this.popState();
						this.begin("raw");
						return 23;
					case 13: return 57;
					case 14: return 61;
					case 15: return 29;
					case 16: return 47;
					case 17:
						this.popState();
						return 44;
					case 18:
						this.popState();
						return 44;
					case 19: return 34;
					case 20: return 39;
					case 21: return 53;
					case 22: return 48;
					case 23:
						this.unput(yy_.yytext);
						this.popState();
						this.begin("com");
						break;
					case 24:
						this.popState();
						return 14;
					case 25: return 48;
					case 26: return 74;
					case 27: return 73;
					case 28: return 73;
					case 29: return 93;
					case 30: return 92;
					case 31: break;
					case 32:
						this.popState();
						return 56;
					case 33:
						this.popState();
						return 33;
					case 34:
						yy_.yytext = strip(1, 2).replace(/\\"/g, "\"");
						return 84;
					case 35:
						yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
						return 84;
					case 36: return 89;
					case 37: return 86;
					case 38: return 86;
					case 39: return 87;
					case 40: return 88;
					case 41: return 85;
					case 42: return 79;
					case 43: return 81;
					case 44: return 73;
					case 45:
						yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, "$1");
						this.popState();
						return 73;
					case 46: return "INVALID";
					case 47: return 5;
				}
			},
			rules: [
				/^(?:[^\x00]*?(?=(\{\{)))/,
				/^(?:[^\x00]+)/,
				/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,
				/^(?:\{\{\{\{(?=[^/]))/,
				/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,
				/^(?:[^\x00]+?(?=(\{\{\{\{)))/,
				/^(?:[\s\S]*?--(~)?\}\})/,
				/^(?:\()/,
				/^(?:\))/,
				/^(?:\[)/,
				/^(?:\])/,
				/^(?:\{\{\{\{)/,
				/^(?:\}\}\}\})/,
				/^(?:\{\{(~)?>)/,
				/^(?:\{\{(~)?#>)/,
				/^(?:\{\{(~)?#\*?)/,
				/^(?:\{\{(~)?\/)/,
				/^(?:\{\{(~)?\^\s*(~)?\}\})/,
				/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,
				/^(?:\{\{(~)?\^)/,
				/^(?:\{\{(~)?\s*else\b)/,
				/^(?:\{\{(~)?\{)/,
				/^(?:\{\{(~)?&)/,
				/^(?:\{\{(~)?!--)/,
				/^(?:\{\{(~)?![\s\S]*?\}\})/,
				/^(?:\{\{(~)?\*?)/,
				/^(?:=)/,
				/^(?:\.\.)/,
				/^(?:\.(?=([=~}\s\/.)\]|])))/,
				/^(?:\.#)/,
				/^(?:[\/.])/,
				/^(?:\s+)/,
				/^(?:\}(~)?\}\})/,
				/^(?:(~)?\}\})/,
				/^(?:"(\\["]|[^"])*")/,
				/^(?:'(\\[']|[^'])*')/,
				/^(?:@)/,
				/^(?:true(?=([~}\s)\]])))/,
				/^(?:false(?=([~}\s)\]])))/,
				/^(?:undefined(?=([~}\s)\]])))/,
				/^(?:null(?=([~}\s)\]])))/,
				/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)\]])))/,
				/^(?:as\s+\|)/,
				/^(?:\|)/,
				/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)\]|]))))/,
				/^(?:\[(\\\]|[^\]])*\])/,
				/^(?:.)/,
				/^(?:$)/
			],
			conditions: {
				mu: {
					rules: [
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
						23,
						24,
						25,
						26,
						27,
						28,
						29,
						30,
						31,
						32,
						33,
						34,
						35,
						36,
						37,
						38,
						39,
						40,
						41,
						42,
						43,
						44,
						46,
						47
					],
					inclusive: false
				},
				emu: {
					rules: [2],
					inclusive: false
				},
				com: {
					rules: [6],
					inclusive: false
				},
				raw: {
					rules: [
						3,
						4,
						5
					],
					inclusive: false
				},
				escl: {
					rules: [45],
					inclusive: false
				},
				INITIAL: {
					rules: [
						0,
						1,
						47
					],
					inclusive: true
				}
			}
		};
	}();
	function Parser() {
		this.yy = {};
	}
	Parser.prototype = parser;
	parser.Parser = Parser;
	return new Parser();
}();
function PrintVisitor() {
	this.padding = 0;
}
PrintVisitor.prototype = new Visitor();
PrintVisitor.prototype.pad = function(string) {
	let out = "";
	for (let i = 0, l = this.padding; i < l; i++) out += "  ";
	out += string + "\n";
	return out;
};
PrintVisitor.prototype.Program = function(program) {
	let out = "", body = program.body, i, l;
	if (program.blockParams) {
		let blockParams = "BLOCK PARAMS: [";
		for (i = 0, l = program.blockParams.length; i < l; i++) blockParams += " " + program.blockParams[i];
		blockParams += " ]";
		out += this.pad(blockParams);
	}
	for (i = 0, l = body.length; i < l; i++) out += this.accept(body[i]);
	this.padding--;
	return out;
};
PrintVisitor.prototype.MustacheStatement = function(mustache) {
	if (mustache.params.length > 0 || mustache.hash) return this.pad("{{ " + this.callBody(mustache) + " }}");
	else return this.pad("{{ " + this.accept(mustache.path) + " }}");
};
PrintVisitor.prototype.Decorator = function(mustache) {
	return this.pad("{{ DIRECTIVE " + this.callBody(mustache) + " }}");
};
PrintVisitor.prototype.BlockStatement = PrintVisitor.prototype.DecoratorBlock = function(block) {
	let out = "";
	out += this.pad((block.type === "DecoratorBlock" ? "DIRECTIVE " : "") + "BLOCK:");
	this.padding++;
	out += this.pad(this.callBody(block));
	if (block.program) {
		out += this.pad("PROGRAM:");
		this.padding++;
		out += this.accept(block.program);
		this.padding--;
	}
	if (block.inverse) {
		if (block.program) this.padding++;
		out += this.pad("{{^}}");
		this.padding++;
		out += this.accept(block.inverse);
		this.padding--;
		if (block.program) this.padding--;
	}
	this.padding--;
	return out;
};
PrintVisitor.prototype.PartialStatement = function(partial) {
	let content = "PARTIAL:" + partial.name.original;
	if (partial.params[0]) content += " " + this.accept(partial.params[0]);
	if (partial.hash) content += " " + this.accept(partial.hash);
	return this.pad("{{> " + content + " }}");
};
PrintVisitor.prototype.PartialBlockStatement = function(partial) {
	let content = "PARTIAL BLOCK:" + partial.name.original;
	if (partial.params[0]) content += " " + this.accept(partial.params[0]);
	if (partial.hash) content += " " + this.accept(partial.hash);
	content += " " + this.pad("PROGRAM:");
	this.padding++;
	content += this.accept(partial.program);
	this.padding--;
	return this.pad("{{> " + content + " }}");
};
PrintVisitor.prototype.ContentStatement = function(content) {
	return this.pad("CONTENT[ '" + content.value + "' ]");
};
PrintVisitor.prototype.CommentStatement = function(comment) {
	return this.pad("{{! '" + comment.value + "' }}");
};
PrintVisitor.prototype.SubExpression = function(sexpr) {
	return `(${this.callBody(sexpr)})`;
};
PrintVisitor.prototype.callBody = function(callExpr) {
	let params = callExpr.params, paramStrings = [], hash;
	for (let i = 0, l = params.length; i < l; i++) paramStrings.push(this.accept(params[i]));
	params = paramStrings.length === 0 ? "" : " [" + paramStrings.join(", ") + "]";
	hash = callExpr.hash ? " " + this.accept(callExpr.hash) : "";
	return this.accept(callExpr.path) + params + hash;
};
PrintVisitor.prototype.PathExpression = function(id) {
	let path = [typeof id.head === "string" ? id.head : `[${this.accept(id.head)}]`, ...id.tail].join("/");
	return "p%" + prefix(id) + path;
};
function prefix(path) {
	if (path.data) return "@";
	else if (path.this) return "this.";
	else return "";
}
PrintVisitor.prototype.StringLiteral = function(string) {
	return "\"" + string.value + "\"";
};
PrintVisitor.prototype.NumberLiteral = function(number) {
	return "n%" + number.value;
};
PrintVisitor.prototype.BooleanLiteral = function(bool) {
	return "b%" + bool.value;
};
PrintVisitor.prototype.UndefinedLiteral = function() {
	return "UNDEFINED";
};
PrintVisitor.prototype.NullLiteral = function() {
	return "NULL";
};
PrintVisitor.prototype.ArrayLiteral = function(array) {
	return `Array[${array.items.map((item) => this.accept(item)).join(", ")}]`;
};
PrintVisitor.prototype.HashLiteral = function(hash) {
	return `Hash{${this.hashPairs(hash)}}`;
};
PrintVisitor.prototype.Hash = function(hash) {
	return `HASH{${this.hashPairs(hash)}}`;
};
PrintVisitor.prototype.hashPairs = function(hash) {
	let pairs = hash.pairs, joinedPairs = [];
	for (let i = 0, l = pairs.length; i < l; i++) joinedPairs.push(this.HashPair(pairs[i]));
	return joinedPairs.join(" ");
};
PrintVisitor.prototype.HashPair = function(pair) {
	return pair.key + "=" + this.accept(pair.value);
};
function validateClose(open, close) {
	close = close.path ? close.path.original : close;
	if (open.path.original !== close) {
		let errorNode = { loc: open.path.loc };
		throw new Exception(open.path.original + " doesn't match " + close, errorNode);
	}
}
function SourceLocation(source, locInfo) {
	this.source = source;
	this.start = {
		line: locInfo.first_line,
		column: locInfo.first_column
	};
	this.end = {
		line: locInfo.last_line,
		column: locInfo.last_column
	};
}
function id(token) {
	if (/^\[.*\]$/.test(token)) return token.substring(1, token.length - 1);
	else return token;
}
function stripFlags(open, close) {
	return {
		open: open.charAt(2) === "~",
		close: close.charAt(close.length - 3) === "~"
	};
}
function stripComment(comment) {
	return comment.replace(/^\{\{~?!-?-?/, "").replace(/-?-?~?\}\}$/, "");
}
function preparePath(data, sexpr, parts, loc) {
	loc = this.locInfo(loc);
	let original;
	if (data) original = "@";
	else if (sexpr) original = sexpr.original + ".";
	else original = "";
	let tail = [];
	let depth = 0;
	for (let i = 0, l = parts.length; i < l; i++) {
		let part = parts[i].part;
		let isLiteral = parts[i].original !== part;
		let separator = parts[i].separator;
		let partPrefix = separator === ".#" ? "#" : "";
		original += (separator || "") + part;
		if (!isLiteral && (part === ".." || part === "." || part === "this")) {
			if (tail.length > 0) throw new Exception("Invalid path: " + original, { loc });
			else if (part === "..") depth++;
		} else tail.push(`${partPrefix}${part}`);
	}
	let head = sexpr || tail.shift();
	return {
		type: "PathExpression",
		this: original.startsWith("this."),
		data,
		depth,
		head,
		tail,
		parts: head ? [head, ...tail] : tail,
		original,
		loc
	};
}
function prepareMustache(path, params, hash, open, strip, locInfo) {
	let escapeFlag = open.charAt(3) || open.charAt(2), escaped = escapeFlag !== "{" && escapeFlag !== "&";
	return {
		type: /\*/.test(open) ? "Decorator" : "MustacheStatement",
		path,
		params,
		hash,
		escaped,
		strip,
		loc: this.locInfo(locInfo)
	};
}
function prepareRawBlock(openRawBlock, contents, close, locInfo) {
	validateClose(openRawBlock, close);
	locInfo = this.locInfo(locInfo);
	let program = {
		type: "Program",
		body: contents,
		strip: {},
		loc: locInfo
	};
	return {
		type: "BlockStatement",
		path: openRawBlock.path,
		params: openRawBlock.params,
		hash: openRawBlock.hash,
		program,
		openStrip: {},
		inverseStrip: {},
		closeStrip: {},
		loc: locInfo
	};
}
function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
	if (close && close.path) validateClose(openBlock, close);
	let decorator = /\*/.test(openBlock.open);
	program.blockParams = openBlock.blockParams;
	let inverse, inverseStrip;
	if (inverseAndProgram) {
		if (decorator) throw new Exception("Unexpected inverse block on decorator", inverseAndProgram);
		if (inverseAndProgram.chain) inverseAndProgram.program.body[0].closeStrip = close.strip;
		inverseStrip = inverseAndProgram.strip;
		inverse = inverseAndProgram.program;
	}
	if (inverted) {
		inverted = inverse;
		inverse = program;
		program = inverted;
	}
	return {
		type: decorator ? "DecoratorBlock" : "BlockStatement",
		path: openBlock.path,
		params: openBlock.params,
		hash: openBlock.hash,
		program,
		inverse,
		openStrip: openBlock.strip,
		inverseStrip,
		closeStrip: close && close.strip,
		loc: this.locInfo(locInfo)
	};
}
function prepareProgram(statements, loc) {
	if (!loc && statements.length) {
		const firstLoc = statements[0].loc, lastLoc = statements[statements.length - 1].loc;
		/* istanbul ignore else */
		if (firstLoc && lastLoc) loc = {
			source: firstLoc.source,
			start: {
				line: firstLoc.start.line,
				column: firstLoc.start.column
			},
			end: {
				line: lastLoc.end.line,
				column: lastLoc.end.column
			}
		};
	}
	return {
		type: "Program",
		body: statements,
		strip: {},
		loc
	};
}
function preparePartialBlock(open, program, close, locInfo) {
	validateClose(open, close);
	return {
		type: "PartialBlockStatement",
		name: open.path,
		params: open.params,
		hash: open.hash,
		program,
		openStrip: open.strip,
		closeStrip: close && close.strip,
		loc: this.locInfo(locInfo)
	};
}
var Helpers = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ Object.defineProperty({
	__proto__: null,
	SourceLocation,
	id,
	prepareBlock,
	prepareMustache,
	preparePartialBlock,
	preparePath,
	prepareProgram,
	prepareRawBlock,
	stripComment,
	stripFlags
}, Symbol.toStringTag, { value: "Module" }));
var baseHelpers = {};
for (let helper in Helpers) if (Object.prototype.hasOwnProperty.call(Helpers, helper)) baseHelpers[helper] = Helpers[helper];
function parseWithoutProcessing(input, options) {
	if (input.type === "Program") return input;
	parser.yy = baseHelpers;
	parser.yy.locInfo = function(locInfo) {
		return new SourceLocation(options && options.srcName, locInfo);
	};
	let squareSyntax;
	if (typeof options?.syntax?.square === "function") squareSyntax = options.syntax.square;
	else if (options?.syntax?.square === "node") squareSyntax = arrayLiteralNode;
	else squareSyntax = "string";
	let hashSyntax;
	if (typeof options?.syntax?.hash === "function") hashSyntax = options.syntax.hash;
	else hashSyntax = hashLiteralNode;
	parser.yy.syntax = {
		square: squareSyntax,
		hash: hashSyntax
	};
	return parser.parse(input);
}
function arrayLiteralNode(array, loc) {
	return {
		type: "ArrayLiteral",
		items: array,
		loc
	};
}
function hashLiteralNode(hash, loc) {
	return {
		type: "HashLiteral",
		pairs: hash.pairs,
		loc
	};
}
function parse(input, options) {
	let ast = parseWithoutProcessing(input, options);
	return new WhitespaceControl(options).accept(ast);
}
/**
* generated from https://raw.githubusercontent.com/w3c/html/26b5126f96f736f796b9e29718138919dd513744/entities.json
* do not edit
*/
var namedCharRefs = {
	Aacute: "Á",
	aacute: "á",
	Abreve: "Ă",
	abreve: "ă",
	ac: "∾",
	acd: "∿",
	acE: "∾̳",
	Acirc: "Â",
	acirc: "â",
	acute: "´",
	Acy: "А",
	acy: "а",
	AElig: "Æ",
	aelig: "æ",
	af: "⁡",
	Afr: "𝔄",
	afr: "𝔞",
	Agrave: "À",
	agrave: "à",
	alefsym: "ℵ",
	aleph: "ℵ",
	Alpha: "Α",
	alpha: "α",
	Amacr: "Ā",
	amacr: "ā",
	amalg: "⨿",
	amp: "&",
	AMP: "&",
	andand: "⩕",
	And: "⩓",
	and: "∧",
	andd: "⩜",
	andslope: "⩘",
	andv: "⩚",
	ang: "∠",
	ange: "⦤",
	angle: "∠",
	angmsdaa: "⦨",
	angmsdab: "⦩",
	angmsdac: "⦪",
	angmsdad: "⦫",
	angmsdae: "⦬",
	angmsdaf: "⦭",
	angmsdag: "⦮",
	angmsdah: "⦯",
	angmsd: "∡",
	angrt: "∟",
	angrtvb: "⊾",
	angrtvbd: "⦝",
	angsph: "∢",
	angst: "Å",
	angzarr: "⍼",
	Aogon: "Ą",
	aogon: "ą",
	Aopf: "𝔸",
	aopf: "𝕒",
	apacir: "⩯",
	ap: "≈",
	apE: "⩰",
	ape: "≊",
	apid: "≋",
	apos: "'",
	ApplyFunction: "⁡",
	approx: "≈",
	approxeq: "≊",
	Aring: "Å",
	aring: "å",
	Ascr: "𝒜",
	ascr: "𝒶",
	Assign: "≔",
	ast: "*",
	asymp: "≈",
	asympeq: "≍",
	Atilde: "Ã",
	atilde: "ã",
	Auml: "Ä",
	auml: "ä",
	awconint: "∳",
	awint: "⨑",
	backcong: "≌",
	backepsilon: "϶",
	backprime: "‵",
	backsim: "∽",
	backsimeq: "⋍",
	Backslash: "∖",
	Barv: "⫧",
	barvee: "⊽",
	barwed: "⌅",
	Barwed: "⌆",
	barwedge: "⌅",
	bbrk: "⎵",
	bbrktbrk: "⎶",
	bcong: "≌",
	Bcy: "Б",
	bcy: "б",
	bdquo: "„",
	becaus: "∵",
	because: "∵",
	Because: "∵",
	bemptyv: "⦰",
	bepsi: "϶",
	bernou: "ℬ",
	Bernoullis: "ℬ",
	Beta: "Β",
	beta: "β",
	beth: "ℶ",
	between: "≬",
	Bfr: "𝔅",
	bfr: "𝔟",
	bigcap: "⋂",
	bigcirc: "◯",
	bigcup: "⋃",
	bigodot: "⨀",
	bigoplus: "⨁",
	bigotimes: "⨂",
	bigsqcup: "⨆",
	bigstar: "★",
	bigtriangledown: "▽",
	bigtriangleup: "△",
	biguplus: "⨄",
	bigvee: "⋁",
	bigwedge: "⋀",
	bkarow: "⤍",
	blacklozenge: "⧫",
	blacksquare: "▪",
	blacktriangle: "▴",
	blacktriangledown: "▾",
	blacktriangleleft: "◂",
	blacktriangleright: "▸",
	blank: "␣",
	blk12: "▒",
	blk14: "░",
	blk34: "▓",
	block: "█",
	bne: "=⃥",
	bnequiv: "≡⃥",
	bNot: "⫭",
	bnot: "⌐",
	Bopf: "𝔹",
	bopf: "𝕓",
	bot: "⊥",
	bottom: "⊥",
	bowtie: "⋈",
	boxbox: "⧉",
	boxdl: "┐",
	boxdL: "╕",
	boxDl: "╖",
	boxDL: "╗",
	boxdr: "┌",
	boxdR: "╒",
	boxDr: "╓",
	boxDR: "╔",
	boxh: "─",
	boxH: "═",
	boxhd: "┬",
	boxHd: "╤",
	boxhD: "╥",
	boxHD: "╦",
	boxhu: "┴",
	boxHu: "╧",
	boxhU: "╨",
	boxHU: "╩",
	boxminus: "⊟",
	boxplus: "⊞",
	boxtimes: "⊠",
	boxul: "┘",
	boxuL: "╛",
	boxUl: "╜",
	boxUL: "╝",
	boxur: "└",
	boxuR: "╘",
	boxUr: "╙",
	boxUR: "╚",
	boxv: "│",
	boxV: "║",
	boxvh: "┼",
	boxvH: "╪",
	boxVh: "╫",
	boxVH: "╬",
	boxvl: "┤",
	boxvL: "╡",
	boxVl: "╢",
	boxVL: "╣",
	boxvr: "├",
	boxvR: "╞",
	boxVr: "╟",
	boxVR: "╠",
	bprime: "‵",
	breve: "˘",
	Breve: "˘",
	brvbar: "¦",
	bscr: "𝒷",
	Bscr: "ℬ",
	bsemi: "⁏",
	bsim: "∽",
	bsime: "⋍",
	bsolb: "⧅",
	bsol: "\\",
	bsolhsub: "⟈",
	bull: "•",
	bullet: "•",
	bump: "≎",
	bumpE: "⪮",
	bumpe: "≏",
	Bumpeq: "≎",
	bumpeq: "≏",
	Cacute: "Ć",
	cacute: "ć",
	capand: "⩄",
	capbrcup: "⩉",
	capcap: "⩋",
	cap: "∩",
	Cap: "⋒",
	capcup: "⩇",
	capdot: "⩀",
	CapitalDifferentialD: "ⅅ",
	caps: "∩︀",
	caret: "⁁",
	caron: "ˇ",
	Cayleys: "ℭ",
	ccaps: "⩍",
	Ccaron: "Č",
	ccaron: "č",
	Ccedil: "Ç",
	ccedil: "ç",
	Ccirc: "Ĉ",
	ccirc: "ĉ",
	Cconint: "∰",
	ccups: "⩌",
	ccupssm: "⩐",
	Cdot: "Ċ",
	cdot: "ċ",
	cedil: "¸",
	Cedilla: "¸",
	cemptyv: "⦲",
	cent: "¢",
	centerdot: "·",
	CenterDot: "·",
	cfr: "𝔠",
	Cfr: "ℭ",
	CHcy: "Ч",
	chcy: "ч",
	check: "✓",
	checkmark: "✓",
	Chi: "Χ",
	chi: "χ",
	circ: "ˆ",
	circeq: "≗",
	circlearrowleft: "↺",
	circlearrowright: "↻",
	circledast: "⊛",
	circledcirc: "⊚",
	circleddash: "⊝",
	CircleDot: "⊙",
	circledR: "®",
	circledS: "Ⓢ",
	CircleMinus: "⊖",
	CirclePlus: "⊕",
	CircleTimes: "⊗",
	cir: "○",
	cirE: "⧃",
	cire: "≗",
	cirfnint: "⨐",
	cirmid: "⫯",
	cirscir: "⧂",
	ClockwiseContourIntegral: "∲",
	CloseCurlyDoubleQuote: "”",
	CloseCurlyQuote: "’",
	clubs: "♣",
	clubsuit: "♣",
	colon: ":",
	Colon: "∷",
	Colone: "⩴",
	colone: "≔",
	coloneq: "≔",
	comma: ",",
	commat: "@",
	comp: "∁",
	compfn: "∘",
	complement: "∁",
	complexes: "ℂ",
	cong: "≅",
	congdot: "⩭",
	Congruent: "≡",
	conint: "∮",
	Conint: "∯",
	ContourIntegral: "∮",
	copf: "𝕔",
	Copf: "ℂ",
	coprod: "∐",
	Coproduct: "∐",
	copy: "©",
	COPY: "©",
	copysr: "℗",
	CounterClockwiseContourIntegral: "∳",
	crarr: "↵",
	cross: "✗",
	Cross: "⨯",
	Cscr: "𝒞",
	cscr: "𝒸",
	csub: "⫏",
	csube: "⫑",
	csup: "⫐",
	csupe: "⫒",
	ctdot: "⋯",
	cudarrl: "⤸",
	cudarrr: "⤵",
	cuepr: "⋞",
	cuesc: "⋟",
	cularr: "↶",
	cularrp: "⤽",
	cupbrcap: "⩈",
	cupcap: "⩆",
	CupCap: "≍",
	cup: "∪",
	Cup: "⋓",
	cupcup: "⩊",
	cupdot: "⊍",
	cupor: "⩅",
	cups: "∪︀",
	curarr: "↷",
	curarrm: "⤼",
	curlyeqprec: "⋞",
	curlyeqsucc: "⋟",
	curlyvee: "⋎",
	curlywedge: "⋏",
	curren: "¤",
	curvearrowleft: "↶",
	curvearrowright: "↷",
	cuvee: "⋎",
	cuwed: "⋏",
	cwconint: "∲",
	cwint: "∱",
	cylcty: "⌭",
	dagger: "†",
	Dagger: "‡",
	daleth: "ℸ",
	darr: "↓",
	Darr: "↡",
	dArr: "⇓",
	dash: "‐",
	Dashv: "⫤",
	dashv: "⊣",
	dbkarow: "⤏",
	dblac: "˝",
	Dcaron: "Ď",
	dcaron: "ď",
	Dcy: "Д",
	dcy: "д",
	ddagger: "‡",
	ddarr: "⇊",
	DD: "ⅅ",
	dd: "ⅆ",
	DDotrahd: "⤑",
	ddotseq: "⩷",
	deg: "°",
	Del: "∇",
	Delta: "Δ",
	delta: "δ",
	demptyv: "⦱",
	dfisht: "⥿",
	Dfr: "𝔇",
	dfr: "𝔡",
	dHar: "⥥",
	dharl: "⇃",
	dharr: "⇂",
	DiacriticalAcute: "´",
	DiacriticalDot: "˙",
	DiacriticalDoubleAcute: "˝",
	DiacriticalGrave: "`",
	DiacriticalTilde: "˜",
	diam: "⋄",
	diamond: "⋄",
	Diamond: "⋄",
	diamondsuit: "♦",
	diams: "♦",
	die: "¨",
	DifferentialD: "ⅆ",
	digamma: "ϝ",
	disin: "⋲",
	div: "÷",
	divide: "÷",
	divideontimes: "⋇",
	divonx: "⋇",
	DJcy: "Ђ",
	djcy: "ђ",
	dlcorn: "⌞",
	dlcrop: "⌍",
	dollar: "$",
	Dopf: "𝔻",
	dopf: "𝕕",
	Dot: "¨",
	dot: "˙",
	DotDot: "⃜",
	doteq: "≐",
	doteqdot: "≑",
	DotEqual: "≐",
	dotminus: "∸",
	dotplus: "∔",
	dotsquare: "⊡",
	doublebarwedge: "⌆",
	DoubleContourIntegral: "∯",
	DoubleDot: "¨",
	DoubleDownArrow: "⇓",
	DoubleLeftArrow: "⇐",
	DoubleLeftRightArrow: "⇔",
	DoubleLeftTee: "⫤",
	DoubleLongLeftArrow: "⟸",
	DoubleLongLeftRightArrow: "⟺",
	DoubleLongRightArrow: "⟹",
	DoubleRightArrow: "⇒",
	DoubleRightTee: "⊨",
	DoubleUpArrow: "⇑",
	DoubleUpDownArrow: "⇕",
	DoubleVerticalBar: "∥",
	DownArrowBar: "⤓",
	downarrow: "↓",
	DownArrow: "↓",
	Downarrow: "⇓",
	DownArrowUpArrow: "⇵",
	DownBreve: "̑",
	downdownarrows: "⇊",
	downharpoonleft: "⇃",
	downharpoonright: "⇂",
	DownLeftRightVector: "⥐",
	DownLeftTeeVector: "⥞",
	DownLeftVectorBar: "⥖",
	DownLeftVector: "↽",
	DownRightTeeVector: "⥟",
	DownRightVectorBar: "⥗",
	DownRightVector: "⇁",
	DownTeeArrow: "↧",
	DownTee: "⊤",
	drbkarow: "⤐",
	drcorn: "⌟",
	drcrop: "⌌",
	Dscr: "𝒟",
	dscr: "𝒹",
	DScy: "Ѕ",
	dscy: "ѕ",
	dsol: "⧶",
	Dstrok: "Đ",
	dstrok: "đ",
	dtdot: "⋱",
	dtri: "▿",
	dtrif: "▾",
	duarr: "⇵",
	duhar: "⥯",
	dwangle: "⦦",
	DZcy: "Џ",
	dzcy: "џ",
	dzigrarr: "⟿",
	Eacute: "É",
	eacute: "é",
	easter: "⩮",
	Ecaron: "Ě",
	ecaron: "ě",
	Ecirc: "Ê",
	ecirc: "ê",
	ecir: "≖",
	ecolon: "≕",
	Ecy: "Э",
	ecy: "э",
	eDDot: "⩷",
	Edot: "Ė",
	edot: "ė",
	eDot: "≑",
	ee: "ⅇ",
	efDot: "≒",
	Efr: "𝔈",
	efr: "𝔢",
	eg: "⪚",
	Egrave: "È",
	egrave: "è",
	egs: "⪖",
	egsdot: "⪘",
	el: "⪙",
	Element: "∈",
	elinters: "⏧",
	ell: "ℓ",
	els: "⪕",
	elsdot: "⪗",
	Emacr: "Ē",
	emacr: "ē",
	empty: "∅",
	emptyset: "∅",
	EmptySmallSquare: "◻",
	emptyv: "∅",
	EmptyVerySmallSquare: "▫",
	emsp13: " ",
	emsp14: " ",
	emsp: " ",
	ENG: "Ŋ",
	eng: "ŋ",
	ensp: " ",
	Eogon: "Ę",
	eogon: "ę",
	Eopf: "𝔼",
	eopf: "𝕖",
	epar: "⋕",
	eparsl: "⧣",
	eplus: "⩱",
	epsi: "ε",
	Epsilon: "Ε",
	epsilon: "ε",
	epsiv: "ϵ",
	eqcirc: "≖",
	eqcolon: "≕",
	eqsim: "≂",
	eqslantgtr: "⪖",
	eqslantless: "⪕",
	Equal: "⩵",
	equals: "=",
	EqualTilde: "≂",
	equest: "≟",
	Equilibrium: "⇌",
	equiv: "≡",
	equivDD: "⩸",
	eqvparsl: "⧥",
	erarr: "⥱",
	erDot: "≓",
	escr: "ℯ",
	Escr: "ℰ",
	esdot: "≐",
	Esim: "⩳",
	esim: "≂",
	Eta: "Η",
	eta: "η",
	ETH: "Ð",
	eth: "ð",
	Euml: "Ë",
	euml: "ë",
	euro: "€",
	excl: "!",
	exist: "∃",
	Exists: "∃",
	expectation: "ℰ",
	exponentiale: "ⅇ",
	ExponentialE: "ⅇ",
	fallingdotseq: "≒",
	Fcy: "Ф",
	fcy: "ф",
	female: "♀",
	ffilig: "ﬃ",
	fflig: "ﬀ",
	ffllig: "ﬄ",
	Ffr: "𝔉",
	ffr: "𝔣",
	filig: "ﬁ",
	FilledSmallSquare: "◼",
	FilledVerySmallSquare: "▪",
	fjlig: "fj",
	flat: "♭",
	fllig: "ﬂ",
	fltns: "▱",
	fnof: "ƒ",
	Fopf: "𝔽",
	fopf: "𝕗",
	forall: "∀",
	ForAll: "∀",
	fork: "⋔",
	forkv: "⫙",
	Fouriertrf: "ℱ",
	fpartint: "⨍",
	frac12: "½",
	frac13: "⅓",
	frac14: "¼",
	frac15: "⅕",
	frac16: "⅙",
	frac18: "⅛",
	frac23: "⅔",
	frac25: "⅖",
	frac34: "¾",
	frac35: "⅗",
	frac38: "⅜",
	frac45: "⅘",
	frac56: "⅚",
	frac58: "⅝",
	frac78: "⅞",
	frasl: "⁄",
	frown: "⌢",
	fscr: "𝒻",
	Fscr: "ℱ",
	gacute: "ǵ",
	Gamma: "Γ",
	gamma: "γ",
	Gammad: "Ϝ",
	gammad: "ϝ",
	gap: "⪆",
	Gbreve: "Ğ",
	gbreve: "ğ",
	Gcedil: "Ģ",
	Gcirc: "Ĝ",
	gcirc: "ĝ",
	Gcy: "Г",
	gcy: "г",
	Gdot: "Ġ",
	gdot: "ġ",
	ge: "≥",
	gE: "≧",
	gEl: "⪌",
	gel: "⋛",
	geq: "≥",
	geqq: "≧",
	geqslant: "⩾",
	gescc: "⪩",
	ges: "⩾",
	gesdot: "⪀",
	gesdoto: "⪂",
	gesdotol: "⪄",
	gesl: "⋛︀",
	gesles: "⪔",
	Gfr: "𝔊",
	gfr: "𝔤",
	gg: "≫",
	Gg: "⋙",
	ggg: "⋙",
	gimel: "ℷ",
	GJcy: "Ѓ",
	gjcy: "ѓ",
	gla: "⪥",
	gl: "≷",
	glE: "⪒",
	glj: "⪤",
	gnap: "⪊",
	gnapprox: "⪊",
	gne: "⪈",
	gnE: "≩",
	gneq: "⪈",
	gneqq: "≩",
	gnsim: "⋧",
	Gopf: "𝔾",
	gopf: "𝕘",
	grave: "`",
	GreaterEqual: "≥",
	GreaterEqualLess: "⋛",
	GreaterFullEqual: "≧",
	GreaterGreater: "⪢",
	GreaterLess: "≷",
	GreaterSlantEqual: "⩾",
	GreaterTilde: "≳",
	Gscr: "𝒢",
	gscr: "ℊ",
	gsim: "≳",
	gsime: "⪎",
	gsiml: "⪐",
	gtcc: "⪧",
	gtcir: "⩺",
	gt: ">",
	GT: ">",
	Gt: "≫",
	gtdot: "⋗",
	gtlPar: "⦕",
	gtquest: "⩼",
	gtrapprox: "⪆",
	gtrarr: "⥸",
	gtrdot: "⋗",
	gtreqless: "⋛",
	gtreqqless: "⪌",
	gtrless: "≷",
	gtrsim: "≳",
	gvertneqq: "≩︀",
	gvnE: "≩︀",
	Hacek: "ˇ",
	hairsp: " ",
	half: "½",
	hamilt: "ℋ",
	HARDcy: "Ъ",
	hardcy: "ъ",
	harrcir: "⥈",
	harr: "↔",
	hArr: "⇔",
	harrw: "↭",
	Hat: "^",
	hbar: "ℏ",
	Hcirc: "Ĥ",
	hcirc: "ĥ",
	hearts: "♥",
	heartsuit: "♥",
	hellip: "…",
	hercon: "⊹",
	hfr: "𝔥",
	Hfr: "ℌ",
	HilbertSpace: "ℋ",
	hksearow: "⤥",
	hkswarow: "⤦",
	hoarr: "⇿",
	homtht: "∻",
	hookleftarrow: "↩",
	hookrightarrow: "↪",
	hopf: "𝕙",
	Hopf: "ℍ",
	horbar: "―",
	HorizontalLine: "─",
	hscr: "𝒽",
	Hscr: "ℋ",
	hslash: "ℏ",
	Hstrok: "Ħ",
	hstrok: "ħ",
	HumpDownHump: "≎",
	HumpEqual: "≏",
	hybull: "⁃",
	hyphen: "‐",
	Iacute: "Í",
	iacute: "í",
	ic: "⁣",
	Icirc: "Î",
	icirc: "î",
	Icy: "И",
	icy: "и",
	Idot: "İ",
	IEcy: "Е",
	iecy: "е",
	iexcl: "¡",
	iff: "⇔",
	ifr: "𝔦",
	Ifr: "ℑ",
	Igrave: "Ì",
	igrave: "ì",
	ii: "ⅈ",
	iiiint: "⨌",
	iiint: "∭",
	iinfin: "⧜",
	iiota: "℩",
	IJlig: "Ĳ",
	ijlig: "ĳ",
	Imacr: "Ī",
	imacr: "ī",
	image: "ℑ",
	ImaginaryI: "ⅈ",
	imagline: "ℐ",
	imagpart: "ℑ",
	imath: "ı",
	Im: "ℑ",
	imof: "⊷",
	imped: "Ƶ",
	Implies: "⇒",
	incare: "℅",
	in: "∈",
	infin: "∞",
	infintie: "⧝",
	inodot: "ı",
	intcal: "⊺",
	int: "∫",
	Int: "∬",
	integers: "ℤ",
	Integral: "∫",
	intercal: "⊺",
	Intersection: "⋂",
	intlarhk: "⨗",
	intprod: "⨼",
	InvisibleComma: "⁣",
	InvisibleTimes: "⁢",
	IOcy: "Ё",
	iocy: "ё",
	Iogon: "Į",
	iogon: "į",
	Iopf: "𝕀",
	iopf: "𝕚",
	Iota: "Ι",
	iota: "ι",
	iprod: "⨼",
	iquest: "¿",
	iscr: "𝒾",
	Iscr: "ℐ",
	isin: "∈",
	isindot: "⋵",
	isinE: "⋹",
	isins: "⋴",
	isinsv: "⋳",
	isinv: "∈",
	it: "⁢",
	Itilde: "Ĩ",
	itilde: "ĩ",
	Iukcy: "І",
	iukcy: "і",
	Iuml: "Ï",
	iuml: "ï",
	Jcirc: "Ĵ",
	jcirc: "ĵ",
	Jcy: "Й",
	jcy: "й",
	Jfr: "𝔍",
	jfr: "𝔧",
	jmath: "ȷ",
	Jopf: "𝕁",
	jopf: "𝕛",
	Jscr: "𝒥",
	jscr: "𝒿",
	Jsercy: "Ј",
	jsercy: "ј",
	Jukcy: "Є",
	jukcy: "є",
	Kappa: "Κ",
	kappa: "κ",
	kappav: "ϰ",
	Kcedil: "Ķ",
	kcedil: "ķ",
	Kcy: "К",
	kcy: "к",
	Kfr: "𝔎",
	kfr: "𝔨",
	kgreen: "ĸ",
	KHcy: "Х",
	khcy: "х",
	KJcy: "Ќ",
	kjcy: "ќ",
	Kopf: "𝕂",
	kopf: "𝕜",
	Kscr: "𝒦",
	kscr: "𝓀",
	lAarr: "⇚",
	Lacute: "Ĺ",
	lacute: "ĺ",
	laemptyv: "⦴",
	lagran: "ℒ",
	Lambda: "Λ",
	lambda: "λ",
	lang: "⟨",
	Lang: "⟪",
	langd: "⦑",
	langle: "⟨",
	lap: "⪅",
	Laplacetrf: "ℒ",
	laquo: "«",
	larrb: "⇤",
	larrbfs: "⤟",
	larr: "←",
	Larr: "↞",
	lArr: "⇐",
	larrfs: "⤝",
	larrhk: "↩",
	larrlp: "↫",
	larrpl: "⤹",
	larrsim: "⥳",
	larrtl: "↢",
	latail: "⤙",
	lAtail: "⤛",
	lat: "⪫",
	late: "⪭",
	lates: "⪭︀",
	lbarr: "⤌",
	lBarr: "⤎",
	lbbrk: "❲",
	lbrace: "{",
	lbrack: "[",
	lbrke: "⦋",
	lbrksld: "⦏",
	lbrkslu: "⦍",
	Lcaron: "Ľ",
	lcaron: "ľ",
	Lcedil: "Ļ",
	lcedil: "ļ",
	lceil: "⌈",
	lcub: "{",
	Lcy: "Л",
	lcy: "л",
	ldca: "⤶",
	ldquo: "“",
	ldquor: "„",
	ldrdhar: "⥧",
	ldrushar: "⥋",
	ldsh: "↲",
	le: "≤",
	lE: "≦",
	LeftAngleBracket: "⟨",
	LeftArrowBar: "⇤",
	leftarrow: "←",
	LeftArrow: "←",
	Leftarrow: "⇐",
	LeftArrowRightArrow: "⇆",
	leftarrowtail: "↢",
	LeftCeiling: "⌈",
	LeftDoubleBracket: "⟦",
	LeftDownTeeVector: "⥡",
	LeftDownVectorBar: "⥙",
	LeftDownVector: "⇃",
	LeftFloor: "⌊",
	leftharpoondown: "↽",
	leftharpoonup: "↼",
	leftleftarrows: "⇇",
	leftrightarrow: "↔",
	LeftRightArrow: "↔",
	Leftrightarrow: "⇔",
	leftrightarrows: "⇆",
	leftrightharpoons: "⇋",
	leftrightsquigarrow: "↭",
	LeftRightVector: "⥎",
	LeftTeeArrow: "↤",
	LeftTee: "⊣",
	LeftTeeVector: "⥚",
	leftthreetimes: "⋋",
	LeftTriangleBar: "⧏",
	LeftTriangle: "⊲",
	LeftTriangleEqual: "⊴",
	LeftUpDownVector: "⥑",
	LeftUpTeeVector: "⥠",
	LeftUpVectorBar: "⥘",
	LeftUpVector: "↿",
	LeftVectorBar: "⥒",
	LeftVector: "↼",
	lEg: "⪋",
	leg: "⋚",
	leq: "≤",
	leqq: "≦",
	leqslant: "⩽",
	lescc: "⪨",
	les: "⩽",
	lesdot: "⩿",
	lesdoto: "⪁",
	lesdotor: "⪃",
	lesg: "⋚︀",
	lesges: "⪓",
	lessapprox: "⪅",
	lessdot: "⋖",
	lesseqgtr: "⋚",
	lesseqqgtr: "⪋",
	LessEqualGreater: "⋚",
	LessFullEqual: "≦",
	LessGreater: "≶",
	lessgtr: "≶",
	LessLess: "⪡",
	lesssim: "≲",
	LessSlantEqual: "⩽",
	LessTilde: "≲",
	lfisht: "⥼",
	lfloor: "⌊",
	Lfr: "𝔏",
	lfr: "𝔩",
	lg: "≶",
	lgE: "⪑",
	lHar: "⥢",
	lhard: "↽",
	lharu: "↼",
	lharul: "⥪",
	lhblk: "▄",
	LJcy: "Љ",
	ljcy: "љ",
	llarr: "⇇",
	ll: "≪",
	Ll: "⋘",
	llcorner: "⌞",
	Lleftarrow: "⇚",
	llhard: "⥫",
	lltri: "◺",
	Lmidot: "Ŀ",
	lmidot: "ŀ",
	lmoustache: "⎰",
	lmoust: "⎰",
	lnap: "⪉",
	lnapprox: "⪉",
	lne: "⪇",
	lnE: "≨",
	lneq: "⪇",
	lneqq: "≨",
	lnsim: "⋦",
	loang: "⟬",
	loarr: "⇽",
	lobrk: "⟦",
	longleftarrow: "⟵",
	LongLeftArrow: "⟵",
	Longleftarrow: "⟸",
	longleftrightarrow: "⟷",
	LongLeftRightArrow: "⟷",
	Longleftrightarrow: "⟺",
	longmapsto: "⟼",
	longrightarrow: "⟶",
	LongRightArrow: "⟶",
	Longrightarrow: "⟹",
	looparrowleft: "↫",
	looparrowright: "↬",
	lopar: "⦅",
	Lopf: "𝕃",
	lopf: "𝕝",
	loplus: "⨭",
	lotimes: "⨴",
	lowast: "∗",
	lowbar: "_",
	LowerLeftArrow: "↙",
	LowerRightArrow: "↘",
	loz: "◊",
	lozenge: "◊",
	lozf: "⧫",
	lpar: "(",
	lparlt: "⦓",
	lrarr: "⇆",
	lrcorner: "⌟",
	lrhar: "⇋",
	lrhard: "⥭",
	lrm: "‎",
	lrtri: "⊿",
	lsaquo: "‹",
	lscr: "𝓁",
	Lscr: "ℒ",
	lsh: "↰",
	Lsh: "↰",
	lsim: "≲",
	lsime: "⪍",
	lsimg: "⪏",
	lsqb: "[",
	lsquo: "‘",
	lsquor: "‚",
	Lstrok: "Ł",
	lstrok: "ł",
	ltcc: "⪦",
	ltcir: "⩹",
	lt: "<",
	LT: "<",
	Lt: "≪",
	ltdot: "⋖",
	lthree: "⋋",
	ltimes: "⋉",
	ltlarr: "⥶",
	ltquest: "⩻",
	ltri: "◃",
	ltrie: "⊴",
	ltrif: "◂",
	ltrPar: "⦖",
	lurdshar: "⥊",
	luruhar: "⥦",
	lvertneqq: "≨︀",
	lvnE: "≨︀",
	macr: "¯",
	male: "♂",
	malt: "✠",
	maltese: "✠",
	Map: "⤅",
	map: "↦",
	mapsto: "↦",
	mapstodown: "↧",
	mapstoleft: "↤",
	mapstoup: "↥",
	marker: "▮",
	mcomma: "⨩",
	Mcy: "М",
	mcy: "м",
	mdash: "—",
	mDDot: "∺",
	measuredangle: "∡",
	MediumSpace: " ",
	Mellintrf: "ℳ",
	Mfr: "𝔐",
	mfr: "𝔪",
	mho: "℧",
	micro: "µ",
	midast: "*",
	midcir: "⫰",
	mid: "∣",
	middot: "·",
	minusb: "⊟",
	minus: "−",
	minusd: "∸",
	minusdu: "⨪",
	MinusPlus: "∓",
	mlcp: "⫛",
	mldr: "…",
	mnplus: "∓",
	models: "⊧",
	Mopf: "𝕄",
	mopf: "𝕞",
	mp: "∓",
	mscr: "𝓂",
	Mscr: "ℳ",
	mstpos: "∾",
	Mu: "Μ",
	mu: "μ",
	multimap: "⊸",
	mumap: "⊸",
	nabla: "∇",
	Nacute: "Ń",
	nacute: "ń",
	nang: "∠⃒",
	nap: "≉",
	napE: "⩰̸",
	napid: "≋̸",
	napos: "ŉ",
	napprox: "≉",
	natural: "♮",
	naturals: "ℕ",
	natur: "♮",
	nbsp: "\xA0",
	nbump: "≎̸",
	nbumpe: "≏̸",
	ncap: "⩃",
	Ncaron: "Ň",
	ncaron: "ň",
	Ncedil: "Ņ",
	ncedil: "ņ",
	ncong: "≇",
	ncongdot: "⩭̸",
	ncup: "⩂",
	Ncy: "Н",
	ncy: "н",
	ndash: "–",
	nearhk: "⤤",
	nearr: "↗",
	neArr: "⇗",
	nearrow: "↗",
	ne: "≠",
	nedot: "≐̸",
	NegativeMediumSpace: "​",
	NegativeThickSpace: "​",
	NegativeThinSpace: "​",
	NegativeVeryThinSpace: "​",
	nequiv: "≢",
	nesear: "⤨",
	nesim: "≂̸",
	NestedGreaterGreater: "≫",
	NestedLessLess: "≪",
	NewLine: "\n",
	nexist: "∄",
	nexists: "∄",
	Nfr: "𝔑",
	nfr: "𝔫",
	ngE: "≧̸",
	nge: "≱",
	ngeq: "≱",
	ngeqq: "≧̸",
	ngeqslant: "⩾̸",
	nges: "⩾̸",
	nGg: "⋙̸",
	ngsim: "≵",
	nGt: "≫⃒",
	ngt: "≯",
	ngtr: "≯",
	nGtv: "≫̸",
	nharr: "↮",
	nhArr: "⇎",
	nhpar: "⫲",
	ni: "∋",
	nis: "⋼",
	nisd: "⋺",
	niv: "∋",
	NJcy: "Њ",
	njcy: "њ",
	nlarr: "↚",
	nlArr: "⇍",
	nldr: "‥",
	nlE: "≦̸",
	nle: "≰",
	nleftarrow: "↚",
	nLeftarrow: "⇍",
	nleftrightarrow: "↮",
	nLeftrightarrow: "⇎",
	nleq: "≰",
	nleqq: "≦̸",
	nleqslant: "⩽̸",
	nles: "⩽̸",
	nless: "≮",
	nLl: "⋘̸",
	nlsim: "≴",
	nLt: "≪⃒",
	nlt: "≮",
	nltri: "⋪",
	nltrie: "⋬",
	nLtv: "≪̸",
	nmid: "∤",
	NoBreak: "⁠",
	NonBreakingSpace: "\xA0",
	nopf: "𝕟",
	Nopf: "ℕ",
	Not: "⫬",
	not: "¬",
	NotCongruent: "≢",
	NotCupCap: "≭",
	NotDoubleVerticalBar: "∦",
	NotElement: "∉",
	NotEqual: "≠",
	NotEqualTilde: "≂̸",
	NotExists: "∄",
	NotGreater: "≯",
	NotGreaterEqual: "≱",
	NotGreaterFullEqual: "≧̸",
	NotGreaterGreater: "≫̸",
	NotGreaterLess: "≹",
	NotGreaterSlantEqual: "⩾̸",
	NotGreaterTilde: "≵",
	NotHumpDownHump: "≎̸",
	NotHumpEqual: "≏̸",
	notin: "∉",
	notindot: "⋵̸",
	notinE: "⋹̸",
	notinva: "∉",
	notinvb: "⋷",
	notinvc: "⋶",
	NotLeftTriangleBar: "⧏̸",
	NotLeftTriangle: "⋪",
	NotLeftTriangleEqual: "⋬",
	NotLess: "≮",
	NotLessEqual: "≰",
	NotLessGreater: "≸",
	NotLessLess: "≪̸",
	NotLessSlantEqual: "⩽̸",
	NotLessTilde: "≴",
	NotNestedGreaterGreater: "⪢̸",
	NotNestedLessLess: "⪡̸",
	notni: "∌",
	notniva: "∌",
	notnivb: "⋾",
	notnivc: "⋽",
	NotPrecedes: "⊀",
	NotPrecedesEqual: "⪯̸",
	NotPrecedesSlantEqual: "⋠",
	NotReverseElement: "∌",
	NotRightTriangleBar: "⧐̸",
	NotRightTriangle: "⋫",
	NotRightTriangleEqual: "⋭",
	NotSquareSubset: "⊏̸",
	NotSquareSubsetEqual: "⋢",
	NotSquareSuperset: "⊐̸",
	NotSquareSupersetEqual: "⋣",
	NotSubset: "⊂⃒",
	NotSubsetEqual: "⊈",
	NotSucceeds: "⊁",
	NotSucceedsEqual: "⪰̸",
	NotSucceedsSlantEqual: "⋡",
	NotSucceedsTilde: "≿̸",
	NotSuperset: "⊃⃒",
	NotSupersetEqual: "⊉",
	NotTilde: "≁",
	NotTildeEqual: "≄",
	NotTildeFullEqual: "≇",
	NotTildeTilde: "≉",
	NotVerticalBar: "∤",
	nparallel: "∦",
	npar: "∦",
	nparsl: "⫽⃥",
	npart: "∂̸",
	npolint: "⨔",
	npr: "⊀",
	nprcue: "⋠",
	nprec: "⊀",
	npreceq: "⪯̸",
	npre: "⪯̸",
	nrarrc: "⤳̸",
	nrarr: "↛",
	nrArr: "⇏",
	nrarrw: "↝̸",
	nrightarrow: "↛",
	nRightarrow: "⇏",
	nrtri: "⋫",
	nrtrie: "⋭",
	nsc: "⊁",
	nsccue: "⋡",
	nsce: "⪰̸",
	Nscr: "𝒩",
	nscr: "𝓃",
	nshortmid: "∤",
	nshortparallel: "∦",
	nsim: "≁",
	nsime: "≄",
	nsimeq: "≄",
	nsmid: "∤",
	nspar: "∦",
	nsqsube: "⋢",
	nsqsupe: "⋣",
	nsub: "⊄",
	nsubE: "⫅̸",
	nsube: "⊈",
	nsubset: "⊂⃒",
	nsubseteq: "⊈",
	nsubseteqq: "⫅̸",
	nsucc: "⊁",
	nsucceq: "⪰̸",
	nsup: "⊅",
	nsupE: "⫆̸",
	nsupe: "⊉",
	nsupset: "⊃⃒",
	nsupseteq: "⊉",
	nsupseteqq: "⫆̸",
	ntgl: "≹",
	Ntilde: "Ñ",
	ntilde: "ñ",
	ntlg: "≸",
	ntriangleleft: "⋪",
	ntrianglelefteq: "⋬",
	ntriangleright: "⋫",
	ntrianglerighteq: "⋭",
	Nu: "Ν",
	nu: "ν",
	num: "#",
	numero: "№",
	numsp: " ",
	nvap: "≍⃒",
	nvdash: "⊬",
	nvDash: "⊭",
	nVdash: "⊮",
	nVDash: "⊯",
	nvge: "≥⃒",
	nvgt: ">⃒",
	nvHarr: "⤄",
	nvinfin: "⧞",
	nvlArr: "⤂",
	nvle: "≤⃒",
	nvlt: "<⃒",
	nvltrie: "⊴⃒",
	nvrArr: "⤃",
	nvrtrie: "⊵⃒",
	nvsim: "∼⃒",
	nwarhk: "⤣",
	nwarr: "↖",
	nwArr: "⇖",
	nwarrow: "↖",
	nwnear: "⤧",
	Oacute: "Ó",
	oacute: "ó",
	oast: "⊛",
	Ocirc: "Ô",
	ocirc: "ô",
	ocir: "⊚",
	Ocy: "О",
	ocy: "о",
	odash: "⊝",
	Odblac: "Ő",
	odblac: "ő",
	odiv: "⨸",
	odot: "⊙",
	odsold: "⦼",
	OElig: "Œ",
	oelig: "œ",
	ofcir: "⦿",
	Ofr: "𝔒",
	ofr: "𝔬",
	ogon: "˛",
	Ograve: "Ò",
	ograve: "ò",
	ogt: "⧁",
	ohbar: "⦵",
	ohm: "Ω",
	oint: "∮",
	olarr: "↺",
	olcir: "⦾",
	olcross: "⦻",
	oline: "‾",
	olt: "⧀",
	Omacr: "Ō",
	omacr: "ō",
	Omega: "Ω",
	omega: "ω",
	Omicron: "Ο",
	omicron: "ο",
	omid: "⦶",
	ominus: "⊖",
	Oopf: "𝕆",
	oopf: "𝕠",
	opar: "⦷",
	OpenCurlyDoubleQuote: "“",
	OpenCurlyQuote: "‘",
	operp: "⦹",
	oplus: "⊕",
	orarr: "↻",
	Or: "⩔",
	or: "∨",
	ord: "⩝",
	order: "ℴ",
	orderof: "ℴ",
	ordf: "ª",
	ordm: "º",
	origof: "⊶",
	oror: "⩖",
	orslope: "⩗",
	orv: "⩛",
	oS: "Ⓢ",
	Oscr: "𝒪",
	oscr: "ℴ",
	Oslash: "Ø",
	oslash: "ø",
	osol: "⊘",
	Otilde: "Õ",
	otilde: "õ",
	otimesas: "⨶",
	Otimes: "⨷",
	otimes: "⊗",
	Ouml: "Ö",
	ouml: "ö",
	ovbar: "⌽",
	OverBar: "‾",
	OverBrace: "⏞",
	OverBracket: "⎴",
	OverParenthesis: "⏜",
	para: "¶",
	parallel: "∥",
	par: "∥",
	parsim: "⫳",
	parsl: "⫽",
	part: "∂",
	PartialD: "∂",
	Pcy: "П",
	pcy: "п",
	percnt: "%",
	period: ".",
	permil: "‰",
	perp: "⊥",
	pertenk: "‱",
	Pfr: "𝔓",
	pfr: "𝔭",
	Phi: "Φ",
	phi: "φ",
	phiv: "ϕ",
	phmmat: "ℳ",
	phone: "☎",
	Pi: "Π",
	pi: "π",
	pitchfork: "⋔",
	piv: "ϖ",
	planck: "ℏ",
	planckh: "ℎ",
	plankv: "ℏ",
	plusacir: "⨣",
	plusb: "⊞",
	pluscir: "⨢",
	plus: "+",
	plusdo: "∔",
	plusdu: "⨥",
	pluse: "⩲",
	PlusMinus: "±",
	plusmn: "±",
	plussim: "⨦",
	plustwo: "⨧",
	pm: "±",
	Poincareplane: "ℌ",
	pointint: "⨕",
	popf: "𝕡",
	Popf: "ℙ",
	pound: "£",
	prap: "⪷",
	Pr: "⪻",
	pr: "≺",
	prcue: "≼",
	precapprox: "⪷",
	prec: "≺",
	preccurlyeq: "≼",
	Precedes: "≺",
	PrecedesEqual: "⪯",
	PrecedesSlantEqual: "≼",
	PrecedesTilde: "≾",
	preceq: "⪯",
	precnapprox: "⪹",
	precneqq: "⪵",
	precnsim: "⋨",
	pre: "⪯",
	prE: "⪳",
	precsim: "≾",
	prime: "′",
	Prime: "″",
	primes: "ℙ",
	prnap: "⪹",
	prnE: "⪵",
	prnsim: "⋨",
	prod: "∏",
	Product: "∏",
	profalar: "⌮",
	profline: "⌒",
	profsurf: "⌓",
	prop: "∝",
	Proportional: "∝",
	Proportion: "∷",
	propto: "∝",
	prsim: "≾",
	prurel: "⊰",
	Pscr: "𝒫",
	pscr: "𝓅",
	Psi: "Ψ",
	psi: "ψ",
	puncsp: " ",
	Qfr: "𝔔",
	qfr: "𝔮",
	qint: "⨌",
	qopf: "𝕢",
	Qopf: "ℚ",
	qprime: "⁗",
	Qscr: "𝒬",
	qscr: "𝓆",
	quaternions: "ℍ",
	quatint: "⨖",
	quest: "?",
	questeq: "≟",
	quot: "\"",
	QUOT: "\"",
	rAarr: "⇛",
	race: "∽̱",
	Racute: "Ŕ",
	racute: "ŕ",
	radic: "√",
	raemptyv: "⦳",
	rang: "⟩",
	Rang: "⟫",
	rangd: "⦒",
	range: "⦥",
	rangle: "⟩",
	raquo: "»",
	rarrap: "⥵",
	rarrb: "⇥",
	rarrbfs: "⤠",
	rarrc: "⤳",
	rarr: "→",
	Rarr: "↠",
	rArr: "⇒",
	rarrfs: "⤞",
	rarrhk: "↪",
	rarrlp: "↬",
	rarrpl: "⥅",
	rarrsim: "⥴",
	Rarrtl: "⤖",
	rarrtl: "↣",
	rarrw: "↝",
	ratail: "⤚",
	rAtail: "⤜",
	ratio: "∶",
	rationals: "ℚ",
	rbarr: "⤍",
	rBarr: "⤏",
	RBarr: "⤐",
	rbbrk: "❳",
	rbrace: "}",
	rbrack: "]",
	rbrke: "⦌",
	rbrksld: "⦎",
	rbrkslu: "⦐",
	Rcaron: "Ř",
	rcaron: "ř",
	Rcedil: "Ŗ",
	rcedil: "ŗ",
	rceil: "⌉",
	rcub: "}",
	Rcy: "Р",
	rcy: "р",
	rdca: "⤷",
	rdldhar: "⥩",
	rdquo: "”",
	rdquor: "”",
	rdsh: "↳",
	real: "ℜ",
	realine: "ℛ",
	realpart: "ℜ",
	reals: "ℝ",
	Re: "ℜ",
	rect: "▭",
	reg: "®",
	REG: "®",
	ReverseElement: "∋",
	ReverseEquilibrium: "⇋",
	ReverseUpEquilibrium: "⥯",
	rfisht: "⥽",
	rfloor: "⌋",
	rfr: "𝔯",
	Rfr: "ℜ",
	rHar: "⥤",
	rhard: "⇁",
	rharu: "⇀",
	rharul: "⥬",
	Rho: "Ρ",
	rho: "ρ",
	rhov: "ϱ",
	RightAngleBracket: "⟩",
	RightArrowBar: "⇥",
	rightarrow: "→",
	RightArrow: "→",
	Rightarrow: "⇒",
	RightArrowLeftArrow: "⇄",
	rightarrowtail: "↣",
	RightCeiling: "⌉",
	RightDoubleBracket: "⟧",
	RightDownTeeVector: "⥝",
	RightDownVectorBar: "⥕",
	RightDownVector: "⇂",
	RightFloor: "⌋",
	rightharpoondown: "⇁",
	rightharpoonup: "⇀",
	rightleftarrows: "⇄",
	rightleftharpoons: "⇌",
	rightrightarrows: "⇉",
	rightsquigarrow: "↝",
	RightTeeArrow: "↦",
	RightTee: "⊢",
	RightTeeVector: "⥛",
	rightthreetimes: "⋌",
	RightTriangleBar: "⧐",
	RightTriangle: "⊳",
	RightTriangleEqual: "⊵",
	RightUpDownVector: "⥏",
	RightUpTeeVector: "⥜",
	RightUpVectorBar: "⥔",
	RightUpVector: "↾",
	RightVectorBar: "⥓",
	RightVector: "⇀",
	ring: "˚",
	risingdotseq: "≓",
	rlarr: "⇄",
	rlhar: "⇌",
	rlm: "‏",
	rmoustache: "⎱",
	rmoust: "⎱",
	rnmid: "⫮",
	roang: "⟭",
	roarr: "⇾",
	robrk: "⟧",
	ropar: "⦆",
	ropf: "𝕣",
	Ropf: "ℝ",
	roplus: "⨮",
	rotimes: "⨵",
	RoundImplies: "⥰",
	rpar: ")",
	rpargt: "⦔",
	rppolint: "⨒",
	rrarr: "⇉",
	Rrightarrow: "⇛",
	rsaquo: "›",
	rscr: "𝓇",
	Rscr: "ℛ",
	rsh: "↱",
	Rsh: "↱",
	rsqb: "]",
	rsquo: "’",
	rsquor: "’",
	rthree: "⋌",
	rtimes: "⋊",
	rtri: "▹",
	rtrie: "⊵",
	rtrif: "▸",
	rtriltri: "⧎",
	RuleDelayed: "⧴",
	ruluhar: "⥨",
	rx: "℞",
	Sacute: "Ś",
	sacute: "ś",
	sbquo: "‚",
	scap: "⪸",
	Scaron: "Š",
	scaron: "š",
	Sc: "⪼",
	sc: "≻",
	sccue: "≽",
	sce: "⪰",
	scE: "⪴",
	Scedil: "Ş",
	scedil: "ş",
	Scirc: "Ŝ",
	scirc: "ŝ",
	scnap: "⪺",
	scnE: "⪶",
	scnsim: "⋩",
	scpolint: "⨓",
	scsim: "≿",
	Scy: "С",
	scy: "с",
	sdotb: "⊡",
	sdot: "⋅",
	sdote: "⩦",
	searhk: "⤥",
	searr: "↘",
	seArr: "⇘",
	searrow: "↘",
	sect: "§",
	semi: ";",
	seswar: "⤩",
	setminus: "∖",
	setmn: "∖",
	sext: "✶",
	Sfr: "𝔖",
	sfr: "𝔰",
	sfrown: "⌢",
	sharp: "♯",
	SHCHcy: "Щ",
	shchcy: "щ",
	SHcy: "Ш",
	shcy: "ш",
	ShortDownArrow: "↓",
	ShortLeftArrow: "←",
	shortmid: "∣",
	shortparallel: "∥",
	ShortRightArrow: "→",
	ShortUpArrow: "↑",
	shy: "­",
	Sigma: "Σ",
	sigma: "σ",
	sigmaf: "ς",
	sigmav: "ς",
	sim: "∼",
	simdot: "⩪",
	sime: "≃",
	simeq: "≃",
	simg: "⪞",
	simgE: "⪠",
	siml: "⪝",
	simlE: "⪟",
	simne: "≆",
	simplus: "⨤",
	simrarr: "⥲",
	slarr: "←",
	SmallCircle: "∘",
	smallsetminus: "∖",
	smashp: "⨳",
	smeparsl: "⧤",
	smid: "∣",
	smile: "⌣",
	smt: "⪪",
	smte: "⪬",
	smtes: "⪬︀",
	SOFTcy: "Ь",
	softcy: "ь",
	solbar: "⌿",
	solb: "⧄",
	sol: "/",
	Sopf: "𝕊",
	sopf: "𝕤",
	spades: "♠",
	spadesuit: "♠",
	spar: "∥",
	sqcap: "⊓",
	sqcaps: "⊓︀",
	sqcup: "⊔",
	sqcups: "⊔︀",
	Sqrt: "√",
	sqsub: "⊏",
	sqsube: "⊑",
	sqsubset: "⊏",
	sqsubseteq: "⊑",
	sqsup: "⊐",
	sqsupe: "⊒",
	sqsupset: "⊐",
	sqsupseteq: "⊒",
	square: "□",
	Square: "□",
	SquareIntersection: "⊓",
	SquareSubset: "⊏",
	SquareSubsetEqual: "⊑",
	SquareSuperset: "⊐",
	SquareSupersetEqual: "⊒",
	SquareUnion: "⊔",
	squarf: "▪",
	squ: "□",
	squf: "▪",
	srarr: "→",
	Sscr: "𝒮",
	sscr: "𝓈",
	ssetmn: "∖",
	ssmile: "⌣",
	sstarf: "⋆",
	Star: "⋆",
	star: "☆",
	starf: "★",
	straightepsilon: "ϵ",
	straightphi: "ϕ",
	strns: "¯",
	sub: "⊂",
	Sub: "⋐",
	subdot: "⪽",
	subE: "⫅",
	sube: "⊆",
	subedot: "⫃",
	submult: "⫁",
	subnE: "⫋",
	subne: "⊊",
	subplus: "⪿",
	subrarr: "⥹",
	subset: "⊂",
	Subset: "⋐",
	subseteq: "⊆",
	subseteqq: "⫅",
	SubsetEqual: "⊆",
	subsetneq: "⊊",
	subsetneqq: "⫋",
	subsim: "⫇",
	subsub: "⫕",
	subsup: "⫓",
	succapprox: "⪸",
	succ: "≻",
	succcurlyeq: "≽",
	Succeeds: "≻",
	SucceedsEqual: "⪰",
	SucceedsSlantEqual: "≽",
	SucceedsTilde: "≿",
	succeq: "⪰",
	succnapprox: "⪺",
	succneqq: "⪶",
	succnsim: "⋩",
	succsim: "≿",
	SuchThat: "∋",
	sum: "∑",
	Sum: "∑",
	sung: "♪",
	sup1: "¹",
	sup2: "²",
	sup3: "³",
	sup: "⊃",
	Sup: "⋑",
	supdot: "⪾",
	supdsub: "⫘",
	supE: "⫆",
	supe: "⊇",
	supedot: "⫄",
	Superset: "⊃",
	SupersetEqual: "⊇",
	suphsol: "⟉",
	suphsub: "⫗",
	suplarr: "⥻",
	supmult: "⫂",
	supnE: "⫌",
	supne: "⊋",
	supplus: "⫀",
	supset: "⊃",
	Supset: "⋑",
	supseteq: "⊇",
	supseteqq: "⫆",
	supsetneq: "⊋",
	supsetneqq: "⫌",
	supsim: "⫈",
	supsub: "⫔",
	supsup: "⫖",
	swarhk: "⤦",
	swarr: "↙",
	swArr: "⇙",
	swarrow: "↙",
	swnwar: "⤪",
	szlig: "ß",
	Tab: "	",
	target: "⌖",
	Tau: "Τ",
	tau: "τ",
	tbrk: "⎴",
	Tcaron: "Ť",
	tcaron: "ť",
	Tcedil: "Ţ",
	tcedil: "ţ",
	Tcy: "Т",
	tcy: "т",
	tdot: "⃛",
	telrec: "⌕",
	Tfr: "𝔗",
	tfr: "𝔱",
	there4: "∴",
	therefore: "∴",
	Therefore: "∴",
	Theta: "Θ",
	theta: "θ",
	thetasym: "ϑ",
	thetav: "ϑ",
	thickapprox: "≈",
	thicksim: "∼",
	ThickSpace: "  ",
	ThinSpace: " ",
	thinsp: " ",
	thkap: "≈",
	thksim: "∼",
	THORN: "Þ",
	thorn: "þ",
	tilde: "˜",
	Tilde: "∼",
	TildeEqual: "≃",
	TildeFullEqual: "≅",
	TildeTilde: "≈",
	timesbar: "⨱",
	timesb: "⊠",
	times: "×",
	timesd: "⨰",
	tint: "∭",
	toea: "⤨",
	topbot: "⌶",
	topcir: "⫱",
	top: "⊤",
	Topf: "𝕋",
	topf: "𝕥",
	topfork: "⫚",
	tosa: "⤩",
	tprime: "‴",
	trade: "™",
	TRADE: "™",
	triangle: "▵",
	triangledown: "▿",
	triangleleft: "◃",
	trianglelefteq: "⊴",
	triangleq: "≜",
	triangleright: "▹",
	trianglerighteq: "⊵",
	tridot: "◬",
	trie: "≜",
	triminus: "⨺",
	TripleDot: "⃛",
	triplus: "⨹",
	trisb: "⧍",
	tritime: "⨻",
	trpezium: "⏢",
	Tscr: "𝒯",
	tscr: "𝓉",
	TScy: "Ц",
	tscy: "ц",
	TSHcy: "Ћ",
	tshcy: "ћ",
	Tstrok: "Ŧ",
	tstrok: "ŧ",
	twixt: "≬",
	twoheadleftarrow: "↞",
	twoheadrightarrow: "↠",
	Uacute: "Ú",
	uacute: "ú",
	uarr: "↑",
	Uarr: "↟",
	uArr: "⇑",
	Uarrocir: "⥉",
	Ubrcy: "Ў",
	ubrcy: "ў",
	Ubreve: "Ŭ",
	ubreve: "ŭ",
	Ucirc: "Û",
	ucirc: "û",
	Ucy: "У",
	ucy: "у",
	udarr: "⇅",
	Udblac: "Ű",
	udblac: "ű",
	udhar: "⥮",
	ufisht: "⥾",
	Ufr: "𝔘",
	ufr: "𝔲",
	Ugrave: "Ù",
	ugrave: "ù",
	uHar: "⥣",
	uharl: "↿",
	uharr: "↾",
	uhblk: "▀",
	ulcorn: "⌜",
	ulcorner: "⌜",
	ulcrop: "⌏",
	ultri: "◸",
	Umacr: "Ū",
	umacr: "ū",
	uml: "¨",
	UnderBar: "_",
	UnderBrace: "⏟",
	UnderBracket: "⎵",
	UnderParenthesis: "⏝",
	Union: "⋃",
	UnionPlus: "⊎",
	Uogon: "Ų",
	uogon: "ų",
	Uopf: "𝕌",
	uopf: "𝕦",
	UpArrowBar: "⤒",
	uparrow: "↑",
	UpArrow: "↑",
	Uparrow: "⇑",
	UpArrowDownArrow: "⇅",
	updownarrow: "↕",
	UpDownArrow: "↕",
	Updownarrow: "⇕",
	UpEquilibrium: "⥮",
	upharpoonleft: "↿",
	upharpoonright: "↾",
	uplus: "⊎",
	UpperLeftArrow: "↖",
	UpperRightArrow: "↗",
	upsi: "υ",
	Upsi: "ϒ",
	upsih: "ϒ",
	Upsilon: "Υ",
	upsilon: "υ",
	UpTeeArrow: "↥",
	UpTee: "⊥",
	upuparrows: "⇈",
	urcorn: "⌝",
	urcorner: "⌝",
	urcrop: "⌎",
	Uring: "Ů",
	uring: "ů",
	urtri: "◹",
	Uscr: "𝒰",
	uscr: "𝓊",
	utdot: "⋰",
	Utilde: "Ũ",
	utilde: "ũ",
	utri: "▵",
	utrif: "▴",
	uuarr: "⇈",
	Uuml: "Ü",
	uuml: "ü",
	uwangle: "⦧",
	vangrt: "⦜",
	varepsilon: "ϵ",
	varkappa: "ϰ",
	varnothing: "∅",
	varphi: "ϕ",
	varpi: "ϖ",
	varpropto: "∝",
	varr: "↕",
	vArr: "⇕",
	varrho: "ϱ",
	varsigma: "ς",
	varsubsetneq: "⊊︀",
	varsubsetneqq: "⫋︀",
	varsupsetneq: "⊋︀",
	varsupsetneqq: "⫌︀",
	vartheta: "ϑ",
	vartriangleleft: "⊲",
	vartriangleright: "⊳",
	vBar: "⫨",
	Vbar: "⫫",
	vBarv: "⫩",
	Vcy: "В",
	vcy: "в",
	vdash: "⊢",
	vDash: "⊨",
	Vdash: "⊩",
	VDash: "⊫",
	Vdashl: "⫦",
	veebar: "⊻",
	vee: "∨",
	Vee: "⋁",
	veeeq: "≚",
	vellip: "⋮",
	verbar: "|",
	Verbar: "‖",
	vert: "|",
	Vert: "‖",
	VerticalBar: "∣",
	VerticalLine: "|",
	VerticalSeparator: "❘",
	VerticalTilde: "≀",
	VeryThinSpace: " ",
	Vfr: "𝔙",
	vfr: "𝔳",
	vltri: "⊲",
	vnsub: "⊂⃒",
	vnsup: "⊃⃒",
	Vopf: "𝕍",
	vopf: "𝕧",
	vprop: "∝",
	vrtri: "⊳",
	Vscr: "𝒱",
	vscr: "𝓋",
	vsubnE: "⫋︀",
	vsubne: "⊊︀",
	vsupnE: "⫌︀",
	vsupne: "⊋︀",
	Vvdash: "⊪",
	vzigzag: "⦚",
	Wcirc: "Ŵ",
	wcirc: "ŵ",
	wedbar: "⩟",
	wedge: "∧",
	Wedge: "⋀",
	wedgeq: "≙",
	weierp: "℘",
	Wfr: "𝔚",
	wfr: "𝔴",
	Wopf: "𝕎",
	wopf: "𝕨",
	wp: "℘",
	wr: "≀",
	wreath: "≀",
	Wscr: "𝒲",
	wscr: "𝓌",
	xcap: "⋂",
	xcirc: "◯",
	xcup: "⋃",
	xdtri: "▽",
	Xfr: "𝔛",
	xfr: "𝔵",
	xharr: "⟷",
	xhArr: "⟺",
	Xi: "Ξ",
	xi: "ξ",
	xlarr: "⟵",
	xlArr: "⟸",
	xmap: "⟼",
	xnis: "⋻",
	xodot: "⨀",
	Xopf: "𝕏",
	xopf: "𝕩",
	xoplus: "⨁",
	xotime: "⨂",
	xrarr: "⟶",
	xrArr: "⟹",
	Xscr: "𝒳",
	xscr: "𝓍",
	xsqcup: "⨆",
	xuplus: "⨄",
	xutri: "△",
	xvee: "⋁",
	xwedge: "⋀",
	Yacute: "Ý",
	yacute: "ý",
	YAcy: "Я",
	yacy: "я",
	Ycirc: "Ŷ",
	ycirc: "ŷ",
	Ycy: "Ы",
	ycy: "ы",
	yen: "¥",
	Yfr: "𝔜",
	yfr: "𝔶",
	YIcy: "Ї",
	yicy: "ї",
	Yopf: "𝕐",
	yopf: "𝕪",
	Yscr: "𝒴",
	yscr: "𝓎",
	YUcy: "Ю",
	yucy: "ю",
	yuml: "ÿ",
	Yuml: "Ÿ",
	Zacute: "Ź",
	zacute: "ź",
	Zcaron: "Ž",
	zcaron: "ž",
	Zcy: "З",
	zcy: "з",
	Zdot: "Ż",
	zdot: "ż",
	zeetrf: "ℨ",
	ZeroWidthSpace: "​",
	Zeta: "Ζ",
	zeta: "ζ",
	zfr: "𝔷",
	Zfr: "ℨ",
	ZHcy: "Ж",
	zhcy: "ж",
	zigrarr: "⇝",
	zopf: "𝕫",
	Zopf: "ℤ",
	Zscr: "𝒵",
	zscr: "𝓏",
	zwj: "‍",
	zwnj: "‌"
};
var HEXCHARCODE = /^#[xX]([A-Fa-f0-9]+)$/;
var CHARCODE = /^#([0-9]+)$/;
var NAMED = /^([A-Za-z0-9]+)$/;
var EntityParser = function() {
	function EntityParser(named) {
		this.named = named;
	}
	EntityParser.prototype.parse = function(entity) {
		if (!entity) return;
		var matches = entity.match(HEXCHARCODE);
		if (matches) return String.fromCharCode(parseInt(matches[1], 16));
		matches = entity.match(CHARCODE);
		if (matches) return String.fromCharCode(parseInt(matches[1], 10));
		matches = entity.match(NAMED);
		if (matches) return this.named[matches[1]];
	};
	return EntityParser;
}();
var WSP = /[\t\n\f ]/;
var ALPHA = /[A-Za-z]/;
var CRLF = /\r\n?/g;
function isSpace$1(char) {
	return WSP.test(char);
}
function isAlpha(char) {
	return ALPHA.test(char);
}
function preprocessInput(input) {
	return input.replace(CRLF, "\n");
}
var EventedTokenizer = function() {
	function EventedTokenizer(delegate, entityParser, mode) {
		if (mode === void 0) mode = "precompile";
		this.delegate = delegate;
		this.entityParser = entityParser;
		this.mode = mode;
		this.state = "beforeData";
		this.line = -1;
		this.column = -1;
		this.input = "";
		this.index = -1;
		this.tagNameBuffer = "";
		this.states = {
			beforeData: function() {
				var char = this.peek();
				if (char === "<" && !this.isIgnoredEndTag()) {
					this.transitionTo("tagOpen");
					this.markTagStart();
					this.consume();
				} else {
					if (this.mode === "precompile" && char === "\n") {
						var tag = this.tagNameBuffer.toLowerCase();
						if (tag === "pre" || tag === "textarea") this.consume();
					}
					this.transitionTo("data");
					this.delegate.beginData();
				}
			},
			data: function() {
				var char = this.peek();
				var tag = this.tagNameBuffer;
				if (char === "<" && !this.isIgnoredEndTag()) {
					this.delegate.finishData();
					this.transitionTo("tagOpen");
					this.markTagStart();
					this.consume();
				} else if (char === "&" && tag !== "script" && tag !== "style") {
					this.consume();
					this.delegate.appendToData(this.consumeCharRef() || "&");
				} else {
					this.consume();
					this.delegate.appendToData(char);
				}
			},
			tagOpen: function() {
				var char = this.consume();
				if (char === "!") this.transitionTo("markupDeclarationOpen");
				else if (char === "/") this.transitionTo("endTagOpen");
				else if (char === "@" || char === ":" || isAlpha(char)) {
					this.transitionTo("tagName");
					this.tagNameBuffer = "";
					this.delegate.beginStartTag();
					this.appendToTagName(char);
				}
			},
			markupDeclarationOpen: function() {
				var char = this.consume();
				if (char === "-" && this.peek() === "-") {
					this.consume();
					this.transitionTo("commentStart");
					this.delegate.beginComment();
				} else if (char.toUpperCase() + this.input.substring(this.index, this.index + 6).toUpperCase() === "DOCTYPE") {
					this.consume();
					this.consume();
					this.consume();
					this.consume();
					this.consume();
					this.consume();
					this.transitionTo("doctype");
					if (this.delegate.beginDoctype) this.delegate.beginDoctype();
				}
			},
			doctype: function() {
				if (isSpace$1(this.consume())) this.transitionTo("beforeDoctypeName");
			},
			beforeDoctypeName: function() {
				var char = this.consume();
				if (isSpace$1(char)) return;
				else {
					this.transitionTo("doctypeName");
					if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
				}
			},
			doctypeName: function() {
				var char = this.consume();
				if (isSpace$1(char)) this.transitionTo("afterDoctypeName");
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
			},
			afterDoctypeName: function() {
				var char = this.consume();
				if (isSpace$1(char)) return;
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else {
					var nextSixChars = char.toUpperCase() + this.input.substring(this.index, this.index + 5).toUpperCase();
					var isPublic = nextSixChars.toUpperCase() === "PUBLIC";
					var isSystem = nextSixChars.toUpperCase() === "SYSTEM";
					if (isPublic || isSystem) {
						this.consume();
						this.consume();
						this.consume();
						this.consume();
						this.consume();
						this.consume();
					}
					if (isPublic) this.transitionTo("afterDoctypePublicKeyword");
					else if (isSystem) this.transitionTo("afterDoctypeSystemKeyword");
				}
			},
			afterDoctypePublicKeyword: function() {
				var char = this.peek();
				if (isSpace$1(char)) {
					this.transitionTo("beforeDoctypePublicIdentifier");
					this.consume();
				} else if (char === "\"") {
					this.transitionTo("doctypePublicIdentifierDoubleQuoted");
					this.consume();
				} else if (char === "'") {
					this.transitionTo("doctypePublicIdentifierSingleQuoted");
					this.consume();
				} else if (char === ">") {
					this.consume();
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				}
			},
			doctypePublicIdentifierDoubleQuoted: function() {
				var char = this.consume();
				if (char === "\"") this.transitionTo("afterDoctypePublicIdentifier");
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
			},
			doctypePublicIdentifierSingleQuoted: function() {
				var char = this.consume();
				if (char === "'") this.transitionTo("afterDoctypePublicIdentifier");
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
			},
			afterDoctypePublicIdentifier: function() {
				var char = this.consume();
				if (isSpace$1(char)) this.transitionTo("betweenDoctypePublicAndSystemIdentifiers");
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (char === "\"") this.transitionTo("doctypeSystemIdentifierDoubleQuoted");
				else if (char === "'") this.transitionTo("doctypeSystemIdentifierSingleQuoted");
			},
			betweenDoctypePublicAndSystemIdentifiers: function() {
				var char = this.consume();
				if (isSpace$1(char)) return;
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (char === "\"") this.transitionTo("doctypeSystemIdentifierDoubleQuoted");
				else if (char === "'") this.transitionTo("doctypeSystemIdentifierSingleQuoted");
			},
			doctypeSystemIdentifierDoubleQuoted: function() {
				var char = this.consume();
				if (char === "\"") this.transitionTo("afterDoctypeSystemIdentifier");
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
			},
			doctypeSystemIdentifierSingleQuoted: function() {
				var char = this.consume();
				if (char === "'") this.transitionTo("afterDoctypeSystemIdentifier");
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				} else if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
			},
			afterDoctypeSystemIdentifier: function() {
				var char = this.consume();
				if (isSpace$1(char)) return;
				else if (char === ">") {
					if (this.delegate.endDoctype) this.delegate.endDoctype();
					this.transitionTo("beforeData");
				}
			},
			commentStart: function() {
				var char = this.consume();
				if (char === "-") this.transitionTo("commentStartDash");
				else if (char === ">") {
					this.delegate.finishComment();
					this.transitionTo("beforeData");
				} else {
					this.delegate.appendToCommentData(char);
					this.transitionTo("comment");
				}
			},
			commentStartDash: function() {
				var char = this.consume();
				if (char === "-") this.transitionTo("commentEnd");
				else if (char === ">") {
					this.delegate.finishComment();
					this.transitionTo("beforeData");
				} else {
					this.delegate.appendToCommentData("-");
					this.transitionTo("comment");
				}
			},
			comment: function() {
				var char = this.consume();
				if (char === "-") this.transitionTo("commentEndDash");
				else this.delegate.appendToCommentData(char);
			},
			commentEndDash: function() {
				var char = this.consume();
				if (char === "-") this.transitionTo("commentEnd");
				else {
					this.delegate.appendToCommentData("-" + char);
					this.transitionTo("comment");
				}
			},
			commentEnd: function() {
				var char = this.consume();
				if (char === ">") {
					this.delegate.finishComment();
					this.transitionTo("beforeData");
				} else {
					this.delegate.appendToCommentData("--" + char);
					this.transitionTo("comment");
				}
			},
			tagName: function() {
				var char = this.consume();
				if (isSpace$1(char)) this.transitionTo("beforeAttributeName");
				else if (char === "/") this.transitionTo("selfClosingStartTag");
				else if (char === ">") {
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else this.appendToTagName(char);
			},
			endTagName: function() {
				var char = this.consume();
				if (isSpace$1(char)) {
					this.transitionTo("beforeAttributeName");
					this.tagNameBuffer = "";
				} else if (char === "/") {
					this.transitionTo("selfClosingStartTag");
					this.tagNameBuffer = "";
				} else if (char === ">") {
					this.delegate.finishTag();
					this.transitionTo("beforeData");
					this.tagNameBuffer = "";
				} else this.appendToTagName(char);
			},
			beforeAttributeName: function() {
				var char = this.peek();
				if (isSpace$1(char)) {
					this.consume();
					return;
				} else if (char === "/") {
					this.transitionTo("selfClosingStartTag");
					this.consume();
				} else if (char === ">") {
					this.consume();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else if (char === "=") {
					this.delegate.reportSyntaxError("attribute name cannot start with equals sign");
					this.transitionTo("attributeName");
					this.delegate.beginAttribute();
					this.consume();
					this.delegate.appendToAttributeName(char);
				} else {
					this.transitionTo("attributeName");
					this.delegate.beginAttribute();
				}
			},
			attributeName: function() {
				var char = this.peek();
				if (isSpace$1(char)) {
					this.transitionTo("afterAttributeName");
					this.consume();
				} else if (char === "/") {
					this.delegate.beginAttributeValue(false);
					this.delegate.finishAttributeValue();
					this.consume();
					this.transitionTo("selfClosingStartTag");
				} else if (char === "=") {
					this.transitionTo("beforeAttributeValue");
					this.consume();
				} else if (char === ">") {
					this.delegate.beginAttributeValue(false);
					this.delegate.finishAttributeValue();
					this.consume();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else if (char === "\"" || char === "'" || char === "<") {
					this.delegate.reportSyntaxError(char + " is not a valid character within attribute names");
					this.consume();
					this.delegate.appendToAttributeName(char);
				} else {
					this.consume();
					this.delegate.appendToAttributeName(char);
				}
			},
			afterAttributeName: function() {
				var char = this.peek();
				if (isSpace$1(char)) {
					this.consume();
					return;
				} else if (char === "/") {
					this.delegate.beginAttributeValue(false);
					this.delegate.finishAttributeValue();
					this.consume();
					this.transitionTo("selfClosingStartTag");
				} else if (char === "=") {
					this.consume();
					this.transitionTo("beforeAttributeValue");
				} else if (char === ">") {
					this.delegate.beginAttributeValue(false);
					this.delegate.finishAttributeValue();
					this.consume();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else {
					this.delegate.beginAttributeValue(false);
					this.delegate.finishAttributeValue();
					this.transitionTo("attributeName");
					this.delegate.beginAttribute();
					this.consume();
					this.delegate.appendToAttributeName(char);
				}
			},
			beforeAttributeValue: function() {
				var char = this.peek();
				if (isSpace$1(char)) this.consume();
				else if (char === "\"") {
					this.transitionTo("attributeValueDoubleQuoted");
					this.delegate.beginAttributeValue(true);
					this.consume();
				} else if (char === "'") {
					this.transitionTo("attributeValueSingleQuoted");
					this.delegate.beginAttributeValue(true);
					this.consume();
				} else if (char === ">") {
					this.delegate.beginAttributeValue(false);
					this.delegate.finishAttributeValue();
					this.consume();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else {
					this.transitionTo("attributeValueUnquoted");
					this.delegate.beginAttributeValue(false);
					this.consume();
					this.delegate.appendToAttributeValue(char);
				}
			},
			attributeValueDoubleQuoted: function() {
				var char = this.consume();
				if (char === "\"") {
					this.delegate.finishAttributeValue();
					this.transitionTo("afterAttributeValueQuoted");
				} else if (char === "&") this.delegate.appendToAttributeValue(this.consumeCharRef() || "&");
				else this.delegate.appendToAttributeValue(char);
			},
			attributeValueSingleQuoted: function() {
				var char = this.consume();
				if (char === "'") {
					this.delegate.finishAttributeValue();
					this.transitionTo("afterAttributeValueQuoted");
				} else if (char === "&") this.delegate.appendToAttributeValue(this.consumeCharRef() || "&");
				else this.delegate.appendToAttributeValue(char);
			},
			attributeValueUnquoted: function() {
				var char = this.peek();
				if (isSpace$1(char)) {
					this.delegate.finishAttributeValue();
					this.consume();
					this.transitionTo("beforeAttributeName");
				} else if (char === "/") {
					this.delegate.finishAttributeValue();
					this.consume();
					this.transitionTo("selfClosingStartTag");
				} else if (char === "&") {
					this.consume();
					this.delegate.appendToAttributeValue(this.consumeCharRef() || "&");
				} else if (char === ">") {
					this.delegate.finishAttributeValue();
					this.consume();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else {
					this.consume();
					this.delegate.appendToAttributeValue(char);
				}
			},
			afterAttributeValueQuoted: function() {
				var char = this.peek();
				if (isSpace$1(char)) {
					this.consume();
					this.transitionTo("beforeAttributeName");
				} else if (char === "/") {
					this.consume();
					this.transitionTo("selfClosingStartTag");
				} else if (char === ">") {
					this.consume();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else this.transitionTo("beforeAttributeName");
			},
			selfClosingStartTag: function() {
				if (this.peek() === ">") {
					this.consume();
					this.delegate.markTagAsSelfClosing();
					this.delegate.finishTag();
					this.transitionTo("beforeData");
				} else this.transitionTo("beforeAttributeName");
			},
			endTagOpen: function() {
				var char = this.consume();
				if (char === "@" || char === ":" || isAlpha(char)) {
					this.transitionTo("endTagName");
					this.tagNameBuffer = "";
					this.delegate.beginEndTag();
					this.appendToTagName(char);
				}
			}
		};
		this.reset();
	}
	EventedTokenizer.prototype.reset = function() {
		this.transitionTo("beforeData");
		this.input = "";
		this.tagNameBuffer = "";
		this.index = 0;
		this.line = 1;
		this.column = 0;
		this.delegate.reset();
	};
	EventedTokenizer.prototype.transitionTo = function(state) {
		this.state = state;
	};
	EventedTokenizer.prototype.tokenize = function(input) {
		this.reset();
		this.tokenizePart(input);
		this.tokenizeEOF();
	};
	EventedTokenizer.prototype.tokenizePart = function(input) {
		this.input += preprocessInput(input);
		while (this.index < this.input.length) {
			var handler = this.states[this.state];
			if (handler !== void 0) handler.call(this);
			else throw new Error("unhandled state " + this.state);
		}
	};
	EventedTokenizer.prototype.tokenizeEOF = function() {
		this.flushData();
	};
	EventedTokenizer.prototype.flushData = function() {
		if (this.state === "data") {
			this.delegate.finishData();
			this.transitionTo("beforeData");
		}
	};
	EventedTokenizer.prototype.peek = function() {
		return this.input.charAt(this.index);
	};
	EventedTokenizer.prototype.consume = function() {
		var char = this.peek();
		this.index++;
		if (char === "\n") {
			this.line++;
			this.column = 0;
		} else this.column++;
		return char;
	};
	EventedTokenizer.prototype.consumeCharRef = function() {
		var endIndex = this.input.indexOf(";", this.index);
		if (endIndex === -1) return;
		var entity = this.input.slice(this.index, endIndex);
		var chars = this.entityParser.parse(entity);
		if (chars) {
			var count = entity.length;
			while (count) {
				this.consume();
				count--;
			}
			this.consume();
			return chars;
		}
	};
	EventedTokenizer.prototype.markTagStart = function() {
		this.delegate.tagOpen();
	};
	EventedTokenizer.prototype.appendToTagName = function(char) {
		this.tagNameBuffer += char;
		this.delegate.appendToTagName(char);
	};
	EventedTokenizer.prototype.isIgnoredEndTag = function() {
		var tag = this.tagNameBuffer;
		return tag === "title" && this.input.substring(this.index, this.index + 8) !== "</title>" || tag === "style" && this.input.substring(this.index, this.index + 8) !== "</style>" || tag === "script" && this.input.substring(this.index, this.index + 9) !== "<\/script>";
	};
	return EventedTokenizer;
}();
function generateSyntaxError(message, location) {
	let { module, loc } = location;
	let { line, column } = loc.start;
	let code = location.asString();
	let quotedCode = code ? `\n\n|\n|  ${code.split("\n").join("\n|  ")}\n|\n\n` : "";
	let error = /* @__PURE__ */ new Error(`${message}: ${quotedCode}(error occurred in '${module}' @ line ${line} : column ${column})`);
	error.name = "SyntaxError";
	error.location = location;
	error.code = code;
	return error;
}
var visitorKeys = {
	Template: ["body"],
	Block: ["body"],
	MustacheStatement: [
		"path",
		"params",
		"hash"
	],
	BlockStatement: [
		"path",
		"params",
		"hash",
		"program",
		"inverse"
	],
	ElementModifierStatement: [
		"path",
		"params",
		"hash"
	],
	CommentStatement: [],
	MustacheCommentStatement: [],
	ElementNode: [
		"attributes",
		"modifiers",
		"children",
		"comments"
	],
	AttrNode: ["value"],
	TextNode: [],
	ConcatStatement: ["parts"],
	SubExpression: [
		"path",
		"params",
		"hash"
	],
	PathExpression: [],
	StringLiteral: [],
	BooleanLiteral: [],
	NumberLiteral: [],
	NullLiteral: [],
	UndefinedLiteral: [],
	Hash: ["pairs"],
	HashPair: ["value"]
};
var TraversalError = function() {
	TraversalError.prototype = Object.create(Error.prototype);
	TraversalError.prototype.constructor = TraversalError;
	function TraversalError(message, node, parent, key) {
		let error = Error.call(this, message);
		this.key = key;
		this.message = message;
		this.node = node;
		this.parent = parent;
		if (error.stack) this.stack = error.stack;
	}
	return TraversalError;
}();
function cannotRemoveNode(node, parent, key) {
	return new TraversalError("Cannot remove a node unless it is part of an array", node, parent, key);
}
function cannotReplaceNode(node, parent, key) {
	return new TraversalError("Cannot replace a node with multiple nodes unless it is part of an array", node, parent, key);
}
function cannotReplaceOrRemoveInKeyHandlerYet(node, key) {
	return new TraversalError("Replacing and removing in key handlers is not yet supported.", node, null, key);
}
var WalkerPath = class {
	node;
	parent;
	parentKey;
	constructor(node, parent = null, parentKey = null) {
		this.node = node;
		this.parent = parent;
		this.parentKey = parentKey;
	}
	get parentNode() {
		return this.parent ? this.parent.node : null;
	}
	parents() {
		return { [Symbol.iterator]: () => {
			return new PathParentsIterator(this);
		} };
	}
};
var PathParentsIterator = class {
	path;
	constructor(path) {
		this.path = path;
	}
	next() {
		if (this.path.parent) {
			this.path = this.path.parent;
			return {
				done: false,
				value: this.path
			};
		} else return {
			done: true,
			value: null
		};
	}
};
function getEnterFunction(handler) {
	if (typeof handler === "function") return handler;
	else return handler.enter;
}
function getExitFunction(handler) {
	if (typeof handler === "function") return;
	else return handler.exit;
}
function getKeyHandler(handler, key) {
	let keyVisitor = typeof handler !== "function" ? handler.keys : void 0;
	if (keyVisitor === void 0) return;
	let keyHandler = keyVisitor[key];
	if (keyHandler !== void 0) return keyHandler;
	return keyVisitor.All;
}
function getNodeHandler(visitor, nodeType) {
	if (visitor.Program) {
		if (nodeType === "Template" && !visitor.Template || nodeType === "Block" && !visitor.Block) return visitor.Program;
	}
	let handler = visitor[nodeType];
	if (handler !== void 0) return handler;
	return visitor.All;
}
function visitNode(visitor, path) {
	let { node, parent, parentKey } = path;
	let handler = getNodeHandler(visitor, node.type);
	let enter;
	let exit;
	if (handler !== void 0) {
		enter = getEnterFunction(handler);
		exit = getExitFunction(handler);
	}
	let result;
	if (enter !== void 0) result = enter(node, path);
	if (result !== void 0 && result !== null) {
		if (JSON.stringify(node) === JSON.stringify(result)) result = void 0;
		else if (Array.isArray(result)) {
			visitArray(visitor, result, parent, parentKey);
			return result;
		} else return visitNode(visitor, new WalkerPath(result, parent, parentKey)) || result;
	}
	if (result === void 0) {
		let keys = visitorKeys[node.type];
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			visitKey(visitor, handler, path, key);
		}
		if (exit !== void 0) result = exit(node, path);
	}
	return result;
}
function get(node, key) {
	return node[key];
}
function set(node, key, value) {
	node[key] = value;
}
function visitKey(visitor, handler, path, key) {
	let { node } = path;
	let value = get(node, key);
	if (!value) return;
	let keyEnter;
	let keyExit;
	if (handler !== void 0) {
		let keyHandler = getKeyHandler(handler, key);
		if (keyHandler !== void 0) {
			keyEnter = getEnterFunction(keyHandler);
			keyExit = getExitFunction(keyHandler);
		}
	}
	if (keyEnter !== void 0) {
		if (keyEnter(node, key) !== void 0) throw cannotReplaceOrRemoveInKeyHandlerYet(node, key);
	}
	if (Array.isArray(value)) visitArray(visitor, value, path, key);
	else {
		let result = visitNode(visitor, new WalkerPath(value, path, key));
		if (result !== void 0) assignKey(node, key, value, result);
	}
	if (keyExit !== void 0) {
		if (keyExit(node, key) !== void 0) throw cannotReplaceOrRemoveInKeyHandlerYet(node, key);
	}
}
function visitArray(visitor, array, parent, parentKey) {
	for (let i = 0; i < array.length; i++) {
		let result = visitNode(visitor, new WalkerPath(unwrap(array[i]), parent, parentKey));
		if (result !== void 0) i += spliceArray(array, i, result) - 1;
	}
}
function assignKey(node, key, value, result) {
	if (result === null) throw cannotRemoveNode(value, node, key);
	else if (Array.isArray(result)) {
		if (result.length === 1) set(node, key, result[0]);
		else if (result.length === 0) throw cannotRemoveNode(value, node, key);
		else throw cannotReplaceNode(value, node, key);
	} else set(node, key, result);
}
function spliceArray(array, index, result) {
	if (result === null) {
		array.splice(index, 1);
		return 0;
	} else if (Array.isArray(result)) {
		array.splice(index, 1, ...result);
		return result.length;
	} else {
		array.splice(index, 1, result);
		return 1;
	}
}
function traverse(node, visitor) {
	visitNode(visitor, new WalkerPath(node));
}
var Walker = class {
	stack = [];
	constructor(order) {
		this.order = order;
	}
	visit(node, visitor) {
		if (!node) return;
		this.stack.push(node);
		if (this.order === "post") {
			this.children(node, visitor);
			visitor(node, this);
		} else {
			visitor(node, this);
			this.children(node, visitor);
		}
		this.stack.pop();
	}
	children(node, callback) {
		switch (node.type) {
			case "Block":
			case "Template":
				walkBody(this, node.body, callback);
				return;
			case "ElementNode":
				walkBody(this, node.children, callback);
				return;
			case "BlockStatement":
				this.visit(node.program, callback);
				this.visit(node.inverse || null, callback);
				return;
			default: return;
		}
	}
};
function walkBody(walker, body, callback) {
	for (const child of body) walker.visit(child, callback);
}
function childrenFor(node) {
	switch (node.type) {
		case "Block":
		case "Template": return node.body;
		case "ElementNode": return node.children;
	}
}
function appendChild(parent, node) {
	childrenFor(parent).push(node);
}
function isHBSLiteral(path) {
	return path.type === "StringLiteral" || path.type === "BooleanLiteral" || path.type === "NumberLiteral" || path.type === "NullLiteral" || path.type === "UndefinedLiteral";
}
function printLiteral(literal) {
	if (literal.type === "UndefinedLiteral") return "undefined";
	else return JSON.stringify(literal.value);
}
function isUpperCase(tag) {
	return tag[0] === tag[0]?.toUpperCase() && tag[0] !== tag[0]?.toLowerCase();
}
function isLowerCase(tag) {
	return tag[0] === tag[0]?.toLowerCase() && tag[0] !== tag[0]?.toUpperCase();
}
var _SOURCE;
function SOURCE() {
	if (!_SOURCE) _SOURCE = new Source("", "(synthetic)");
	return _SOURCE;
}
function buildMustache(path, params = [], hash = buildHash([]), trusting = false, loc, strip) {
	return b.mustache({
		path: buildPath(path),
		params,
		hash,
		trusting,
		strip,
		loc: buildLoc(loc || null)
	});
}
function buildBlock(path, params, hash, _defaultBlock, _elseBlock = null, loc, openStrip, inverseStrip, closeStrip) {
	let defaultBlock;
	let elseBlock = null;
	if (_defaultBlock.type === "Template") defaultBlock = b.blockItself({
		params: buildBlockParams(_defaultBlock.blockParams),
		body: _defaultBlock.body,
		loc: _defaultBlock.loc
	});
	else defaultBlock = _defaultBlock;
	if (_elseBlock?.type === "Template") {
		assert(_elseBlock.blockParams.length === 0);
		elseBlock = b.blockItself({
			params: [],
			body: _elseBlock.body,
			loc: _elseBlock.loc
		});
	} else elseBlock = _elseBlock;
	return b.block({
		path: buildPath(path),
		params: params || [],
		hash: hash || buildHash([]),
		defaultBlock,
		elseBlock,
		loc: buildLoc(loc || null),
		openStrip,
		inverseStrip,
		closeStrip
	});
}
function buildElementModifier(path, params, hash, loc) {
	return b.elementModifier({
		path: buildPath(path),
		params: params || [],
		hash: hash || buildHash([]),
		loc: buildLoc(loc || null)
	});
}
function buildComment(value, loc) {
	return b.comment({
		value,
		loc: buildLoc(loc || null)
	});
}
function buildMustacheComment(value, loc) {
	return b.mustacheComment({
		value,
		loc: buildLoc(loc || null)
	});
}
function buildConcat(parts, loc) {
	if (!isPresentArray(parts)) throw new Error(`b.concat requires at least one part`);
	return b.concat({
		parts,
		loc: buildLoc(loc || null)
	});
}
function buildElement(tag, options = {}) {
	let { attrs, blockParams, modifiers, comments, children, openTag, closeTag: _closeTag, loc } = options;
	let path;
	let selfClosing;
	if (typeof tag === "string") {
		if (tag.endsWith("/")) {
			path = buildPath(tag.slice(0, -1));
			selfClosing = true;
		} else path = buildPath(tag);
	} else if ("type" in tag) {
		assert(tag.type === "PathExpression", `Invalid tag type ${tag.type}`);
		path = tag;
	} else if ("path" in tag) {
		assert(tag.path.type === "PathExpression", `Invalid tag type ${tag.path.type}`);
		path = tag.path;
		selfClosing = tag.selfClosing;
	} else {
		path = buildPath(tag.name);
		selfClosing = tag.selfClosing;
	}
	let params = blockParams?.map((param) => {
		if (typeof param === "string") return buildVar(param);
		else return param;
	});
	let closeTag = null;
	if (_closeTag) closeTag = buildLoc(_closeTag);
	else if (_closeTag === void 0) closeTag = selfClosing || isVoidTag(path.original) ? null : buildLoc(null);
	return b.element({
		path,
		selfClosing: selfClosing || false,
		attributes: attrs || [],
		params: params || [],
		modifiers: modifiers || [],
		comments: comments || [],
		children: children || [],
		openTag: buildLoc(openTag || null),
		closeTag,
		loc: buildLoc(loc || null)
	});
}
function buildAttr(name, value, loc) {
	return b.attr({
		name,
		value,
		loc: buildLoc(loc || null)
	});
}
function buildText(chars = "", loc) {
	return b.text({
		chars,
		loc: buildLoc(loc || null)
	});
}
function buildSexpr(path, params = [], hash = buildHash([]), loc) {
	return b.sexpr({
		path: buildPath(path),
		params,
		hash,
		loc: buildLoc(loc || null)
	});
}
function buildHead(original, loc) {
	let [head, ...tail] = asPresentArray(original.split("."));
	let headNode = b.head({
		original: head,
		loc: buildLoc(loc || null)
	});
	return b.path({
		head: headNode,
		tail,
		loc: buildLoc(loc || null)
	});
}
function buildThis(loc) {
	return b.this({ loc: buildLoc(loc || null) });
}
function buildAtName(name, loc) {
	return b.atName({
		name,
		loc: buildLoc(loc || null)
	});
}
function buildVar(name, loc) {
	return b.var({
		name,
		loc: buildLoc(loc || null)
	});
}
function buildHeadFromString(original, loc) {
	return b.head({
		original,
		loc: buildLoc(loc || null)
	});
}
function buildCleanPath(head, tail = [], loc) {
	return b.path({
		head,
		tail,
		loc: buildLoc(loc || null)
	});
}
function buildPath(path, loc) {
	let span = buildLoc(loc || null);
	if (typeof path !== "string") {
		if ("type" in path) return path;
		else {
			assert(path.head.indexOf(".") === -1);
			let { head, tail } = path;
			return b.path({
				head: b.head({
					original: head,
					loc: span.sliceStartChars({ chars: head.length })
				}),
				tail,
				loc: buildLoc(loc || null)
			});
		}
	}
	let { head, tail } = buildHead(path, span);
	return b.path({
		head,
		tail,
		loc: span
	});
}
function buildLiteral(type, value, loc) {
	return b.literal({
		type,
		value,
		loc: buildLoc(loc || null)
	});
}
function buildHash(pairs = [], loc) {
	return b.hash({
		pairs,
		loc: buildLoc(loc || null)
	});
}
function buildPair(key, value, loc) {
	return b.pair({
		key,
		value,
		loc: buildLoc(loc || null)
	});
}
function buildProgram(body, blockParams, loc) {
	if (blockParams && blockParams.length) return buildBlockItself(body, blockParams, false, loc);
	else return buildTemplate(body, [], loc);
}
function buildBlockParams(params) {
	return params.map((p) => typeof p === "string" ? b.var({
		name: p,
		loc: SourceSpan.synthetic(p)
	}) : p);
}
function buildBlockItself(body = [], params = [], chained = false, loc) {
	return b.blockItself({
		body,
		params: buildBlockParams(params),
		chained,
		loc: buildLoc(loc || null)
	});
}
function buildTemplate(body = [], blockParams = [], loc) {
	return b.template({
		body,
		blockParams,
		loc: buildLoc(loc || null)
	});
}
function buildPosition(line, column) {
	return b.pos({
		line,
		column
	});
}
function buildLoc(...args) {
	if (args.length === 1) {
		let loc = args[0];
		if (loc && typeof loc === "object") return SourceSpan.forHbsLoc(SOURCE(), loc);
		else return SourceSpan.forHbsLoc(SOURCE(), SYNTHETIC_LOCATION);
	} else {
		let [startLine, startColumn, endLine, endColumn, _source] = args;
		let source = _source ? new Source("", _source) : SOURCE();
		return SourceSpan.forHbsLoc(source, {
			start: {
				line: startLine,
				column: startColumn
			},
			end: {
				line: endLine || startLine,
				column: endColumn || startColumn
			}
		});
	}
}
var publicBuilder = {
	mustache: buildMustache,
	block: buildBlock,
	comment: buildComment,
	mustacheComment: buildMustacheComment,
	element: buildElement,
	elementModifier: buildElementModifier,
	attr: buildAttr,
	text: buildText,
	sexpr: buildSexpr,
	concat: buildConcat,
	hash: buildHash,
	pair: buildPair,
	literal: buildLiteral,
	program: buildProgram,
	blockItself: buildBlockItself,
	template: buildTemplate,
	loc: buildLoc,
	pos: buildPosition,
	path: buildPath,
	fullPath: buildCleanPath,
	head: buildHeadFromString,
	at: buildAtName,
	var: buildVar,
	this: buildThis,
	string: literal("StringLiteral"),
	boolean: literal("BooleanLiteral"),
	number: literal("NumberLiteral"),
	undefined() {
		return buildLiteral("UndefinedLiteral", void 0);
	},
	null() {
		return buildLiteral("NullLiteral", null);
	}
};
function literal(type) {
	return function(value, loc) {
		return buildLiteral(type, value, loc);
	};
}
function buildLegacyMustache({ path, params, hash, trusting, strip, loc }) {
	const node = {
		type: "MustacheStatement",
		path,
		params,
		hash,
		trusting,
		strip,
		loc
	};
	Object.defineProperty(node, "escaped", {
		enumerable: false,
		get() {
			return !this.trusting;
		},
		set(value) {
			this.trusting = !value;
		}
	});
	return node;
}
function buildLegacyPath({ head, tail, loc }) {
	const node = {
		type: "PathExpression",
		head,
		tail,
		get original() {
			const head = this.head.original;
			return this.tail.length === 0 ? head : `${head}.${this.tail.join(".")}`;
		},
		set original(value) {
			let [head, ...tail] = asPresentArray(value.split("."));
			this.head = publicBuilder.head(head, this.head.loc);
			this.tail = tail;
		},
		loc
	};
	Object.defineProperty(node, "parts", {
		enumerable: false,
		get() {
			let parts = asPresentArray(this.original.split("."));
			if (parts[0] === "this") parts.shift();
			else if (parts[0].startsWith("@")) parts[0] = parts[0].slice(1);
			return Object.freeze(parts);
		},
		set(values) {
			let parts = [...values];
			if (parts[0] !== "this" && !parts[0]?.startsWith("@")) {
				if (this.head.type === "ThisHead") parts.unshift("this");
				else if (this.head.type === "AtHead") parts[0] = `@${parts[0]}`;
			}
			this.original = parts.join(".");
		}
	});
	Object.defineProperty(node, "this", {
		enumerable: false,
		get() {
			return this.head.type === "ThisHead";
		}
	});
	Object.defineProperty(node, "data", {
		enumerable: false,
		get() {
			return this.head.type === "AtHead";
		}
	});
	return node;
}
function buildLegacyLiteral({ type, value, loc }) {
	const node = {
		type,
		value,
		loc
	};
	Object.defineProperty(node, "original", {
		enumerable: false,
		get() {
			return this.value;
		},
		set(value) {
			this.value = value;
		}
	});
	return node;
}
var DEFAULT_STRIP = {
	close: false,
	open: false
};
/**
* The Parser Builder differentiates from the public builder API by:
*
* 1. Offering fewer different ways to instantiate nodes
* 2. Mandating source locations
*/
var Builders = class {
	pos({ line, column }) {
		return {
			line,
			column
		};
	}
	blockItself({ body, params, chained = false, loc }) {
		return {
			type: "Block",
			body,
			params,
			get blockParams() {
				return this.params.map((p) => p.name);
			},
			set blockParams(params) {
				this.params = params.map((name) => {
					return b.var({
						name,
						loc: SourceSpan.synthetic(name)
					});
				});
			},
			chained,
			loc
		};
	}
	template({ body, blockParams, loc }) {
		return {
			type: "Template",
			body,
			blockParams,
			loc
		};
	}
	mustache({ path, params, hash, trusting, loc, strip = DEFAULT_STRIP }) {
		return buildLegacyMustache({
			path,
			params,
			hash,
			trusting,
			strip,
			loc
		});
	}
	block({ path, params, hash, defaultBlock, elseBlock = null, loc, openStrip = DEFAULT_STRIP, inverseStrip = DEFAULT_STRIP, closeStrip = DEFAULT_STRIP }) {
		return {
			type: "BlockStatement",
			path,
			params,
			hash,
			program: defaultBlock,
			inverse: elseBlock,
			loc,
			openStrip,
			inverseStrip,
			closeStrip
		};
	}
	comment({ value, loc }) {
		return {
			type: "CommentStatement",
			value,
			loc
		};
	}
	mustacheComment({ value, loc }) {
		return {
			type: "MustacheCommentStatement",
			value,
			loc
		};
	}
	concat({ parts, loc }) {
		return {
			type: "ConcatStatement",
			parts,
			loc
		};
	}
	element({ path, selfClosing, attributes, modifiers, params, comments, children, openTag, closeTag, loc }) {
		let _selfClosing = selfClosing;
		return {
			type: "ElementNode",
			path,
			attributes,
			modifiers,
			params,
			comments,
			children,
			openTag,
			closeTag,
			loc,
			get tag() {
				return this.path.original;
			},
			set tag(name) {
				this.path.original = name;
			},
			get blockParams() {
				return this.params.map((p) => p.name);
			},
			set blockParams(params) {
				this.params = params.map((name) => {
					return b.var({
						name,
						loc: SourceSpan.synthetic(name)
					});
				});
			},
			get selfClosing() {
				return _selfClosing;
			},
			set selfClosing(selfClosing) {
				_selfClosing = selfClosing;
				if (selfClosing) this.closeTag = null;
				else this.closeTag = SourceSpan.synthetic(`</${this.tag}>`);
			}
		};
	}
	elementModifier({ path, params, hash, loc }) {
		return {
			type: "ElementModifierStatement",
			path,
			params,
			hash,
			loc
		};
	}
	attr({ name, value, loc }) {
		return {
			type: "AttrNode",
			name,
			value,
			loc
		};
	}
	text({ chars, loc }) {
		return {
			type: "TextNode",
			chars,
			loc
		};
	}
	sexpr({ path, params, hash, loc }) {
		return {
			type: "SubExpression",
			path,
			params,
			hash,
			loc
		};
	}
	path({ head, tail, loc }) {
		return buildLegacyPath({
			head,
			tail,
			loc
		});
	}
	head({ original, loc }) {
		if (original === "this") return this.this({ loc });
		if (original[0] === "@") return this.atName({
			name: original,
			loc
		});
		else return this.var({
			name: original,
			loc
		});
	}
	this({ loc }) {
		return {
			type: "ThisHead",
			get original() {
				return "this";
			},
			loc
		};
	}
	atName({ name, loc }) {
		let _name = "";
		const node = {
			type: "AtHead",
			get name() {
				return _name;
			},
			set name(value) {
				assert(value[0] === "@");
				assert(value.indexOf(".") === -1);
				_name = value;
			},
			get original() {
				return this.name;
			},
			set original(value) {
				this.name = value;
			},
			loc
		};
		node.name = name;
		return node;
	}
	var({ name, loc }) {
		let _name = "";
		const node = {
			type: "VarHead",
			get name() {
				return _name;
			},
			set name(value) {
				assert(value[0] !== "@");
				assert(value.indexOf(".") === -1);
				_name = value;
			},
			get original() {
				return this.name;
			},
			set original(value) {
				this.name = value;
			},
			loc
		};
		node.name = name;
		return node;
	}
	hash({ pairs, loc }) {
		return {
			type: "Hash",
			pairs,
			loc
		};
	}
	pair({ key, value, loc }) {
		return {
			type: "HashPair",
			key,
			value,
			loc
		};
	}
	literal({ type, value, loc }) {
		return buildLegacyLiteral({
			type,
			value,
			loc
		});
	}
};
var b = new Builders();
var Parser = class {
	elementStack = [];
	lines;
	source;
	currentAttribute = null;
	currentNode = null;
	tokenizer;
	constructor(source, entityParser = new EntityParser(namedCharRefs), mode = "precompile") {
		this.source = source;
		this.lines = source.source.split(/\r\n?|\n/u);
		this.tokenizer = new EventedTokenizer(this, entityParser, mode);
	}
	offset() {
		let { line, column } = this.tokenizer;
		return this.source.offsetFor(line, column);
	}
	pos({ line, column }) {
		return this.source.offsetFor(line, column);
	}
	finish(node) {
		return assign({}, node, { loc: node.start.until(this.offset()) });
	}
	get currentAttr() {
		return expect(this.currentAttribute);
	}
	get currentTag() {
		let node = this.currentNode;
		assert(node && (node.type === "StartTag" || node.type === "EndTag"));
		return node;
	}
	get currentStartTag() {
		let node = this.currentNode;
		assert(node && node.type === "StartTag");
		return node;
	}
	get currentEndTag() {
		let node = this.currentNode;
		assert(node && node.type === "EndTag");
		return node;
	}
	get currentComment() {
		let node = this.currentNode;
		assert(node && node.type === "CommentStatement");
		return node;
	}
	get currentData() {
		let node = this.currentNode;
		assert(node && node.type === "TextNode");
		return node;
	}
	acceptNode(node) {
		return this[node.type](node);
	}
	currentElement() {
		return getLast(asPresentArray(this.elementStack));
	}
	sourceForNode(node, endNode) {
		let firstLine = node.loc.start.line - 1;
		let currentLine = firstLine - 1;
		let firstColumn = node.loc.start.column;
		let string = [];
		let line;
		let lastLine;
		let lastColumn;
		if (endNode) {
			lastLine = endNode.loc.end.line - 1;
			lastColumn = endNode.loc.end.column;
		} else {
			lastLine = node.loc.end.line - 1;
			lastColumn = node.loc.end.column;
		}
		while (currentLine < lastLine) {
			currentLine++;
			line = unwrap(this.lines[currentLine]);
			if (currentLine === firstLine) {
				if (firstLine === lastLine) string.push(line.slice(firstColumn, lastColumn));
				else string.push(line.slice(firstColumn));
			} else if (currentLine === lastLine) string.push(line.slice(0, lastColumn));
			else string.push(line);
		}
		return string.join("\n");
	}
};
var BEFORE_ATTRIBUTE_NAME = "beforeAttributeName";
var ATTRIBUTE_VALUE_UNQUOTED = "attributeValueUnquoted";
var HandlebarsNodeVisitors = class extends Parser {
	pendingError = null;
	parse(program, blockParams) {
		assert(program.loc);
		let node = b.template({
			body: [],
			blockParams,
			loc: this.source.spanFor(program.loc)
		});
		let template = this.parseProgram(node, program);
		this.pendingError?.eof(template.loc.getEnd());
		return template;
	}
	Program(program, blockParams) {
		assert(program.loc);
		let node = b.blockItself({
			body: [],
			params: blockParams,
			chained: program.chained,
			loc: this.source.spanFor(program.loc)
		});
		return this.parseProgram(node, program);
	}
	parseProgram(node, program) {
		if (program.body.length === 0) return node;
		let poppedNode;
		try {
			this.elementStack.push(node);
			for (let child of program.body) this.acceptNode(child);
		} finally {
			poppedNode = this.elementStack.pop();
		}
		if (node !== poppedNode) {
			if (poppedNode?.type === "ElementNode") throw generateSyntaxError(`Unclosed element \`${poppedNode.tag}\``, poppedNode.loc);
			else assert(false, `[BUG] mismatched parser elementStack node: ${node.type}`);
		}
		return node;
	}
	BlockStatement(block) {
		if (this.tokenizer.state === "comment") {
			assert(block.loc);
			this.appendToCommentData(this.sourceForNode(block));
			return;
		}
		if (this.tokenizer.state !== "data" && this.tokenizer.state !== "beforeData") throw generateSyntaxError("A block may only be used inside an HTML element or another block.", this.source.spanFor(block.loc));
		const { path, params, hash } = acceptCallNodes(this, block);
		const loc = this.source.spanFor(block.loc);
		let blockParams = [];
		let repairedBlock;
		if (block.program.blockParams?.length) {
			let span = hash.loc.collapse("end");
			if (block.program.loc) span = span.withEnd(this.source.spanFor(block.program.loc).getStart());
			else if (block.program.body[0]) span = span.withEnd(this.source.spanFor(block.program.body[0].loc).getStart());
			else span = span.withEnd(loc.getEnd());
			repairedBlock = repairBlock(this.source, block, span);
			const content = span.asString();
			let skipStart = content.indexOf("|") + 1;
			const limit = content.indexOf("|", skipStart);
			for (const name of block.program.blockParams) {
				let nameStart;
				let loc;
				if (skipStart >= limit) nameStart = -1;
				else nameStart = content.indexOf(name, skipStart);
				if (nameStart === -1 || nameStart + name.length > limit) {
					skipStart = limit;
					loc = this.source.spanFor(NON_EXISTENT_LOCATION);
				} else {
					skipStart = nameStart;
					loc = span.sliceStartChars({
						skipStart,
						chars: name.length
					});
					skipStart += name.length;
				}
				blockParams.push(b.var({
					name,
					loc
				}));
			}
		} else repairedBlock = repairBlock(this.source, block, loc);
		const program = this.Program(repairedBlock.program, blockParams);
		const inverse = repairedBlock.inverse ? this.Program(repairedBlock.inverse, []) : null;
		const node = b.block({
			path,
			params,
			hash,
			defaultBlock: program,
			elseBlock: inverse,
			loc: this.source.spanFor(block.loc),
			openStrip: block.openStrip,
			inverseStrip: block.inverseStrip,
			closeStrip: block.closeStrip
		});
		appendChild(this.currentElement(), node);
	}
	MustacheStatement(rawMustache) {
		this.pendingError?.mustache(this.source.spanFor(rawMustache.loc));
		const { tokenizer } = this;
		if (tokenizer.state === "comment") {
			this.appendToCommentData(this.sourceForNode(rawMustache));
			return;
		}
		let mustache;
		const { escaped, loc, strip } = rawMustache;
		if ("original" in rawMustache.path && rawMustache.path.original === "...attributes") throw generateSyntaxError("Illegal use of ...attributes", this.source.spanFor(rawMustache.loc));
		if (isHBSLiteral(rawMustache.path)) mustache = b.mustache({
			path: this.acceptNode(rawMustache.path),
			params: [],
			hash: b.hash({
				pairs: [],
				loc: this.source.spanFor(rawMustache.path.loc).collapse("end")
			}),
			trusting: !escaped,
			loc: this.source.spanFor(loc),
			strip
		});
		else {
			const { path, params, hash } = acceptCallNodes(this, rawMustache);
			mustache = b.mustache({
				path,
				params,
				hash,
				trusting: !escaped,
				loc: this.source.spanFor(loc),
				strip
			});
		}
		switch (tokenizer.state) {
			case "tagOpen":
			case "tagName": throw generateSyntaxError(`Cannot use mustaches in an elements tagname`, mustache.loc);
			case "beforeAttributeName":
				addElementModifier(this.currentStartTag, mustache);
				break;
			case "attributeName":
			case "afterAttributeName":
				this.beginAttributeValue(false);
				this.finishAttributeValue();
				addElementModifier(this.currentStartTag, mustache);
				tokenizer.transitionTo(BEFORE_ATTRIBUTE_NAME);
				break;
			case "afterAttributeValueQuoted":
				addElementModifier(this.currentStartTag, mustache);
				tokenizer.transitionTo(BEFORE_ATTRIBUTE_NAME);
				break;
			case "beforeAttributeValue":
				this.beginAttributeValue(false);
				this.appendDynamicAttributeValuePart(mustache);
				tokenizer.transitionTo(ATTRIBUTE_VALUE_UNQUOTED);
				break;
			case "attributeValueDoubleQuoted":
			case "attributeValueSingleQuoted":
			case "attributeValueUnquoted":
				this.appendDynamicAttributeValuePart(mustache);
				break;
			default: appendChild(this.currentElement(), mustache);
		}
		return mustache;
	}
	appendDynamicAttributeValuePart(part) {
		this.finalizeTextPart();
		const attr = this.currentAttr;
		attr.isDynamic = true;
		attr.parts.push(part);
	}
	finalizeTextPart() {
		const text = this.currentAttr.currentPart;
		if (text !== null) {
			this.currentAttr.parts.push(text);
			this.startTextPart();
		}
	}
	startTextPart() {
		this.currentAttr.currentPart = null;
	}
	ContentStatement(content) {
		updateTokenizerLocation(this.tokenizer, content);
		this.tokenizer.tokenizePart(content.value);
		this.tokenizer.flushData();
	}
	CommentStatement(rawComment) {
		const { tokenizer } = this;
		if (tokenizer.state === "comment") {
			this.appendToCommentData(this.sourceForNode(rawComment));
			return null;
		}
		const { value, loc } = rawComment;
		const comment = b.mustacheComment({
			value,
			loc: this.source.spanFor(loc)
		});
		switch (tokenizer.state) {
			case "beforeAttributeName":
			case "afterAttributeName":
				this.currentStartTag.comments.push(comment);
				break;
			case "beforeData":
			case "data":
				appendChild(this.currentElement(), comment);
				break;
			default: throw generateSyntaxError(`Using a Handlebars comment when in the \`${tokenizer["state"]}\` state is not supported`, this.source.spanFor(rawComment.loc));
		}
		return comment;
	}
	PartialStatement(partial) {
		throw generateSyntaxError(`Handlebars partials are not supported`, this.source.spanFor(partial.loc));
	}
	PartialBlockStatement(partialBlock) {
		throw generateSyntaxError(`Handlebars partial blocks are not supported`, this.source.spanFor(partialBlock.loc));
	}
	Decorator(decorator) {
		throw generateSyntaxError(`Handlebars decorators are not supported`, this.source.spanFor(decorator.loc));
	}
	DecoratorBlock(decoratorBlock) {
		throw generateSyntaxError(`Handlebars decorator blocks are not supported`, this.source.spanFor(decoratorBlock.loc));
	}
	SubExpression(sexpr) {
		const { path, params, hash } = acceptCallNodes(this, sexpr);
		return b.sexpr({
			path,
			params,
			hash,
			loc: this.source.spanFor(sexpr.loc)
		});
	}
	PathExpression(path) {
		const { original } = path;
		let parts;
		if (original.indexOf("/") !== -1) {
			if (original.slice(0, 2) === "./") throw generateSyntaxError(`Using "./" is not supported in Glimmer and unnecessary`, this.source.spanFor(path.loc));
			if (original.slice(0, 3) === "../") throw generateSyntaxError(`Changing context using "../" is not supported in Glimmer`, this.source.spanFor(path.loc));
			if (original.indexOf(".") !== -1) throw generateSyntaxError(`Mixing '.' and '/' in paths is not supported in Glimmer; use only '.' to separate property paths`, this.source.spanFor(path.loc));
			parts = [path.parts.join("/")];
		} else if (original === ".") throw generateSyntaxError(`'.' is not a supported path in Glimmer; check for a path with a trailing '.'`, this.source.spanFor(path.loc));
		else parts = path.parts;
		let thisHead = false;
		if (/^this(?:\..+)?$/u.test(original)) thisHead = true;
		let pathHead;
		if (thisHead) pathHead = b.this({ loc: this.source.spanFor({
			start: path.loc.start,
			end: {
				line: path.loc.start.line,
				column: path.loc.start.column + 4
			}
		}) });
		else if (path.data) {
			const head = parts.shift();
			if (head === void 0) throw generateSyntaxError(`Attempted to parse a path expression, but it was not valid. Paths beginning with @ must start with a-z.`, this.source.spanFor(path.loc));
			pathHead = b.atName({
				name: `@${head}`,
				loc: this.source.spanFor({
					start: path.loc.start,
					end: {
						line: path.loc.start.line,
						column: path.loc.start.column + head.length + 1
					}
				})
			});
		} else {
			const head = parts.shift();
			if (head === void 0) throw generateSyntaxError(`Attempted to parse a path expression, but it was not valid. Paths must start with a-z or A-Z.`, this.source.spanFor(path.loc));
			pathHead = b.var({
				name: head,
				loc: this.source.spanFor({
					start: path.loc.start,
					end: {
						line: path.loc.start.line,
						column: path.loc.start.column + head.length
					}
				})
			});
		}
		return b.path({
			head: pathHead,
			tail: parts,
			loc: this.source.spanFor(path.loc)
		});
	}
	Hash(hash) {
		const pairs = hash.pairs.map((pair) => b.pair({
			key: pair.key,
			value: this.acceptNode(pair.value),
			loc: this.source.spanFor(pair.loc)
		}));
		return b.hash({
			pairs,
			loc: this.source.spanFor(hash.loc)
		});
	}
	StringLiteral(string) {
		return b.literal({
			type: "StringLiteral",
			value: string.value,
			loc: this.source.spanFor(string.loc)
		});
	}
	BooleanLiteral(boolean) {
		return b.literal({
			type: "BooleanLiteral",
			value: boolean.value,
			loc: this.source.spanFor(boolean.loc)
		});
	}
	NumberLiteral(number) {
		return b.literal({
			type: "NumberLiteral",
			value: number.value,
			loc: this.source.spanFor(number.loc)
		});
	}
	UndefinedLiteral(undef) {
		return b.literal({
			type: "UndefinedLiteral",
			value: void 0,
			loc: this.source.spanFor(undef.loc)
		});
	}
	NullLiteral(nul) {
		return b.literal({
			type: "NullLiteral",
			value: null,
			loc: this.source.spanFor(nul.loc)
		});
	}
};
function calculateRightStrippedOffsets(original, value) {
	if (value === "") return {
		lines: original.split("\n").length - 1,
		columns: 0
	};
	const [difference] = original.split(value);
	const lines = difference.split(/\n/u);
	const lineCount = lines.length - 1;
	return {
		lines: lineCount,
		columns: unwrap(lines[lineCount]).length
	};
}
function updateTokenizerLocation(tokenizer, content) {
	let line = content.loc.start.line;
	let column = content.loc.start.column;
	const offsets = calculateRightStrippedOffsets(content.original, content.value);
	line = line + offsets.lines;
	if (offsets.lines) column = offsets.columns;
	else column = column + offsets.columns;
	tokenizer.line = line;
	tokenizer.column = column;
}
function acceptCallNodes(compiler, node) {
	let path;
	switch (node.path.type) {
		case "PathExpression":
			path = compiler.PathExpression(node.path);
			break;
		case "SubExpression":
			path = compiler.SubExpression(node.path);
			break;
		case "StringLiteral":
		case "UndefinedLiteral":
		case "NullLiteral":
		case "NumberLiteral":
		case "BooleanLiteral": {
			let value;
			if (node.path.type === "BooleanLiteral") value = node.path.original.toString();
			else if (node.path.type === "StringLiteral") value = `"${node.path.original}"`;
			else if (node.path.type === "NullLiteral") value = "null";
			else if (node.path.type === "NumberLiteral") value = node.path.value.toString();
			else value = "undefined";
			throw generateSyntaxError(`${node.path.type} "${node.path.type === "StringLiteral" ? node.path.original : value}" cannot be called as a sub-expression, replace (${value}) with ${value}`, compiler.source.spanFor(node.path.loc));
		}
	}
	const params = node.params.map((e) => compiler.acceptNode(e));
	const end = isPresentArray(params) ? getLast(params).loc : path.loc;
	const hash = node.hash ? compiler.Hash(node.hash) : b.hash({
		pairs: [],
		loc: compiler.source.spanFor(end).collapse("end")
	});
	return {
		path,
		params,
		hash
	};
}
function addElementModifier(element, mustache) {
	const { path, params, hash, loc } = mustache;
	if (isHBSLiteral(path)) {
		const modifier = `{{${printLiteral(path)}}}`;
		throw generateSyntaxError(`In ${`<${element.name} ... ${modifier} ...`}, ${modifier} is not a valid modifier`, mustache.loc);
	}
	const modifier = b.elementModifier({
		path,
		params,
		hash,
		loc
	});
	element.modifiers.push(modifier);
}
function repairBlock(source, block, fallbackStart) {
	if (!block.program.loc) {
		const start = block.program.body.at(0);
		const end = block.program.body.at(-1);
		if (start && end) block.program.loc = {
			...start.loc,
			end: end.loc.end
		};
		else {
			const loc = source.spanFor(block.loc);
			block.program.loc = fallbackStart.withEnd(loc.getEnd());
		}
	}
	let endProgram = source.spanFor(block.program.loc).getEnd();
	if (block.inverse && !block.inverse.loc) block.inverse.loc = endProgram.collapsed();
	return block;
}
function isSpace(char) {
	return /[\t\n\f ]/u.test(char);
}
var TokenizerEventHandlers = class extends HandlebarsNodeVisitors {
	tagOpenLine = 0;
	tagOpenColumn = 0;
	reset() {
		this.currentNode = null;
	}
	beginComment() {
		this.currentNode = {
			type: "CommentStatement",
			value: "",
			start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
		};
	}
	appendToCommentData(char) {
		this.currentComment.value += char;
	}
	finishComment() {
		appendChild(this.currentElement(), b.comment(this.finish(this.currentComment)));
	}
	beginData() {
		this.currentNode = {
			type: "TextNode",
			chars: "",
			start: this.offset()
		};
	}
	appendToData(char) {
		this.currentData.chars += char;
	}
	finishData() {
		appendChild(this.currentElement(), b.text(this.finish(this.currentData)));
	}
	tagOpen() {
		this.tagOpenLine = this.tokenizer.line;
		this.tagOpenColumn = this.tokenizer.column;
	}
	beginStartTag() {
		this.currentNode = {
			type: "StartTag",
			name: "",
			nameStart: null,
			nameEnd: null,
			attributes: [],
			modifiers: [],
			comments: [],
			params: [],
			selfClosing: false,
			start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
		};
	}
	beginEndTag() {
		this.currentNode = {
			type: "EndTag",
			name: "",
			start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
		};
	}
	finishTag() {
		let tag = this.finish(this.currentTag);
		if (tag.type === "StartTag") {
			this.finishStartTag();
			if (tag.name === ":") throw generateSyntaxError("Invalid named block named detected, you may have created a named block without a name, or you may have began your name with a number. Named blocks must have names that are at least one character long, and begin with a lower case letter", this.source.spanFor({
				start: this.currentTag.start.toJSON(),
				end: this.offset().toJSON()
			}));
			if (voidMap.has(tag.name) || tag.selfClosing) this.finishEndTag(true);
		} else {
			assert(tag.type === "EndTag", `Invalid tag type ${tag.type}`);
			this.finishEndTag(false);
		}
	}
	finishStartTag() {
		let { name, nameStart, nameEnd } = this.currentStartTag;
		let nameLoc = nameStart.until(nameEnd);
		let [head, ...tail] = asPresentArray(name.split("."));
		let path = b.path({
			head: b.head({
				original: head,
				loc: nameLoc.sliceStartChars({ chars: head.length })
			}),
			tail,
			loc: nameLoc
		});
		let { attributes, modifiers, comments, params, selfClosing, loc } = this.finish(this.currentStartTag);
		let element = b.element({
			path,
			selfClosing,
			attributes,
			modifiers,
			comments,
			params,
			children: [],
			openTag: loc,
			closeTag: selfClosing ? null : SourceSpan.broken(),
			loc
		});
		this.elementStack.push(element);
	}
	finishEndTag(isVoid) {
		let { start: closeTagStart } = this.currentTag;
		let tag = this.finish(this.currentTag);
		let element = this.elementStack.pop();
		this.validateEndTag(tag, element, isVoid);
		let parent = this.currentElement();
		if (isVoid) element.closeTag = null;
		else if (element.selfClosing) assert(element.closeTag === null);
		else element.closeTag = closeTagStart.until(this.offset());
		element.loc = element.loc.withEnd(this.offset());
		appendChild(parent, b.element(element));
	}
	markTagAsSelfClosing() {
		let tag = this.currentTag;
		if (tag.type === "StartTag") tag.selfClosing = true;
		else throw generateSyntaxError(`Invalid end tag: closing tag must not be self-closing`, this.source.spanFor({
			start: tag.start.toJSON(),
			end: this.offset().toJSON()
		}));
	}
	appendToTagName(char) {
		let tag = this.currentTag;
		tag.name += char;
		if (tag.type === "StartTag") {
			let offset = this.offset();
			if (tag.nameStart === null) {
				assert(tag.nameEnd === null);
				tag.nameStart = offset.move(-1);
			}
			tag.nameEnd = offset;
		}
	}
	beginAttribute() {
		let offset = this.offset();
		this.currentAttribute = {
			name: "",
			parts: [],
			currentPart: null,
			isQuoted: false,
			isDynamic: false,
			start: offset,
			valueSpan: offset.collapsed()
		};
	}
	appendToAttributeName(char) {
		this.currentAttr.name += char;
		if (this.currentAttr.name === "as") this.parsePossibleBlockParams();
	}
	beginAttributeValue(isQuoted) {
		this.currentAttr.isQuoted = isQuoted;
		this.startTextPart();
		this.currentAttr.valueSpan = this.offset().collapsed();
	}
	appendToAttributeValue(char) {
		let parts = this.currentAttr.parts;
		let lastPart = parts[parts.length - 1];
		let current = this.currentAttr.currentPart;
		if (current) {
			current.chars += char;
			current.loc = current.loc.withEnd(this.offset());
		} else {
			let loc = this.offset();
			if (char === "\n") loc = lastPart ? lastPart.loc.getEnd() : this.currentAttr.valueSpan.getStart();
			else loc = loc.move(-1);
			this.currentAttr.currentPart = b.text({
				chars: char,
				loc: loc.collapsed()
			});
		}
	}
	finishAttributeValue() {
		this.finalizeTextPart();
		let tag = this.currentTag;
		let tokenizerPos = this.offset();
		if (tag.type === "EndTag") throw generateSyntaxError(`Invalid end tag: closing tag must not have attributes`, this.source.spanFor({
			start: tag.start.toJSON(),
			end: tokenizerPos.toJSON()
		}));
		let { name, parts, start, isQuoted, isDynamic, valueSpan } = this.currentAttr;
		if (name.startsWith("|") && parts.length === 0 && !isQuoted && !isDynamic) throw generateSyntaxError("Invalid block parameters syntax: block parameters must be preceded by the `as` keyword", start.until(start.move(name.length)));
		let value = this.assembleAttributeValue(parts, isQuoted, isDynamic, start.until(tokenizerPos));
		value.loc = valueSpan.withEnd(tokenizerPos);
		let attribute = b.attr({
			name,
			value,
			loc: start.until(tokenizerPos)
		});
		this.currentStartTag.attributes.push(attribute);
	}
	parsePossibleBlockParams() {
		const BEFORE_ATTRIBUTE_NAME = "beforeAttributeName";
		const ATTRIBUTE_NAME = "attributeName";
		const AFTER_ATTRIBUTE_NAME = "afterAttributeName";
		const ID_INVERSE_PATTERN = /[!"#%&'()*+./;<=>@[\\\]^`{|}~]/u;
		assert(this.tokenizer.state === ATTRIBUTE_NAME);
		const element = this.currentStartTag;
		const as = this.currentAttr;
		let state = { state: "PossibleAs" };
		const handlers = {
			PossibleAs: (next) => {
				assert(state.state === "PossibleAs");
				if (isSpace(next)) {
					state = { state: "BeforeStartPipe" };
					this.tokenizer.transitionTo(AFTER_ATTRIBUTE_NAME);
					this.tokenizer.consume();
				} else if (next === "|") throw generateSyntaxError(`Invalid block parameters syntax: expecting at least one space character between "as" and "|"`, as.start.until(this.offset().move(1)));
				else state = { state: "Done" };
			},
			BeforeStartPipe: (next) => {
				assert(state.state === "BeforeStartPipe");
				if (isSpace(next)) this.tokenizer.consume();
				else if (next === "|") {
					state = { state: "BeforeBlockParamName" };
					this.tokenizer.transitionTo(BEFORE_ATTRIBUTE_NAME);
					this.tokenizer.consume();
				} else state = { state: "Done" };
			},
			BeforeBlockParamName: (next) => {
				assert(state.state === "BeforeBlockParamName");
				if (isSpace(next)) this.tokenizer.consume();
				else if (next === "") {
					state = { state: "Done" };
					this.pendingError = {
						mustache(loc) {
							throw generateSyntaxError(`Invalid block parameters syntax: mustaches cannot be used inside parameters list`, loc);
						},
						eof(loc) {
							throw generateSyntaxError(`Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list`, as.start.until(loc));
						}
					};
				} else if (next === "|") {
					if (element.params.length === 0) throw generateSyntaxError(`Invalid block parameters syntax: empty parameters list, expecting at least one identifier`, as.start.until(this.offset().move(1)));
					else {
						state = { state: "AfterEndPipe" };
						this.tokenizer.consume();
					}
				} else if (next === ">" || next === "/") throw generateSyntaxError(`Invalid block parameters syntax: incomplete parameters list, expecting "|" but the tag was closed prematurely`, as.start.until(this.offset().move(1)));
				else {
					state = {
						state: "BlockParamName",
						name: next,
						start: this.offset()
					};
					this.tokenizer.consume();
				}
			},
			BlockParamName: (next) => {
				assert(state.state === "BlockParamName");
				if (next === "") {
					state = { state: "Done" };
					this.pendingError = {
						mustache(loc) {
							throw generateSyntaxError(`Invalid block parameters syntax: mustaches cannot be used inside parameters list`, loc);
						},
						eof(loc) {
							throw generateSyntaxError(`Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list`, as.start.until(loc));
						}
					};
				} else if (next === "|" || isSpace(next)) {
					let loc = state.start.until(this.offset());
					if (state.name === "this" || ID_INVERSE_PATTERN.test(state.name)) throw generateSyntaxError(`Invalid block parameters syntax: invalid identifier name \`${state.name}\``, loc);
					element.params.push(b.var({
						name: state.name,
						loc
					}));
					state = next === "|" ? { state: "AfterEndPipe" } : { state: "BeforeBlockParamName" };
					this.tokenizer.consume();
				} else if (next === ">" || next === "/") throw generateSyntaxError(`Invalid block parameters syntax: expecting "|" but the tag was closed prematurely`, as.start.until(this.offset().move(1)));
				else {
					state.name += next;
					this.tokenizer.consume();
				}
			},
			AfterEndPipe: (next) => {
				assert(state.state === "AfterEndPipe");
				if (isSpace(next)) this.tokenizer.consume();
				else if (next === "") {
					state = { state: "Done" };
					this.pendingError = {
						mustache(loc) {
							throw generateSyntaxError(`Invalid block parameters syntax: modifiers cannot follow parameters list`, loc);
						},
						eof(loc) {
							throw generateSyntaxError(`Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list`, as.start.until(loc));
						}
					};
				} else if (next === ">" || next === "/") state = { state: "Done" };
				else {
					state = {
						state: "Error",
						message: "Invalid block parameters syntax: expecting the tag to be closed with \">\" or \"/>\" after parameters list",
						start: this.offset()
					};
					this.tokenizer.consume();
				}
			},
			Error: (next) => {
				assert(state.state === "Error");
				if (next === "" || next === "/" || next === ">" || isSpace(next)) throw generateSyntaxError(state.message, state.start.until(this.offset()));
				else this.tokenizer.consume();
			},
			Done: () => {}
		};
		let next;
		do {
			next = this.tokenizer.peek();
			handlers[state.state](next);
		} while (state.state !== "Done" && next !== "");
		assert(state.state === "Done");
	}
	reportSyntaxError(message) {
		throw generateSyntaxError(message, this.offset().collapsed());
	}
	assembleConcatenatedValue(parts) {
		let first = getFirst(parts);
		let last = getLast(parts);
		return b.concat({
			parts,
			loc: this.source.spanFor(first.loc).extend(this.source.spanFor(last.loc))
		});
	}
	validateEndTag(tag, element, selfClosing) {
		if (voidMap.has(tag.name) && !selfClosing) throw generateSyntaxError(`<${tag.name}> elements do not need end tags. You should remove it`, tag.loc);
		else if (element.type !== "ElementNode") throw generateSyntaxError(`Closing tag </${tag.name}> without an open tag`, tag.loc);
		else if (element.tag !== tag.name) throw generateSyntaxError(`Closing tag </${tag.name}> did not match last open tag <${element.tag}> (on line ${element.loc.startPosition.line})`, tag.loc);
	}
	assembleAttributeValue(parts, isQuoted, isDynamic, span) {
		if (isDynamic) {
			if (isQuoted) return this.assembleConcatenatedValue(parts);
			else {
				const [head, a] = parts;
				if (a === void 0 || a.type === "TextNode" && a.chars === "/") return head;
				else throw generateSyntaxError("An unquoted attribute value must be a string or a mustache, preceded by whitespace or a '=' character, and followed by whitespace, a '>' character, or '/>'", span);
			}
		} else if (isPresentArray(parts)) return parts[0];
		else return b.text({
			chars: "",
			loc: span
		});
	}
};
/**
ASTPlugins can make changes to the Glimmer template AST before
compilation begins.
*/
var syntax = {
	parse: preprocess,
	builders: publicBuilder,
	print: build,
	traverse,
	Walker
};
var CodemodEntityParser = class extends EntityParser {
	constructor() {
		super({});
	}
	parse() {}
};
function preprocess(input, options = {}) {
	let mode = options.mode || "precompile";
	let source;
	let ast;
	if (typeof input === "string") {
		source = new Source(input, options.meta?.moduleName);
		if (mode === "codemod") ast = parseWithoutProcessing(input, options.parseOptions);
		else ast = parse(input, options.parseOptions);
	} else if (input instanceof Source) {
		source = input;
		if (mode === "codemod") ast = parseWithoutProcessing(input.source, options.parseOptions);
		else ast = parse(input.source, options.parseOptions);
	} else {
		source = new Source("", options.meta?.moduleName);
		ast = input;
	}
	let entityParser = void 0;
	if (mode === "codemod") entityParser = new CodemodEntityParser();
	let offsets = SourceSpan.forCharPositions(source, 0, source.source.length);
	ast.loc = {
		source: "(program)",
		start: offsets.startPosition,
		end: offsets.endPosition
	};
	let template = new TokenizerEventHandlers(source, entityParser, mode).parse(ast, options.locals ?? []);
	if (options.plugins?.ast) for (const transform of options.plugins.ast) traverse(template, transform(assign({}, options, { syntax }, { plugins: void 0 })).visitor);
	return template;
}
/**
* This is a convenience function for creating ASTv2 nodes, with an optional name and the node's
* options.
*
* ```ts
* export class HtmlText extends node('HtmlText').fields<{ chars: string }>() {}
* ```
*
* This creates a new ASTv2 node with the name `'HtmlText'` and one field `chars: string` (in
* addition to a `loc: SourceOffsets` field, which all nodes have).
*
* ```ts
* export class Args extends node().fields<{
*  positional: PositionalArguments;
*  named: NamedArguments
* }>() {}
* ```
*
* This creates a new un-named ASTv2 node with two fields (`positional: Positional` and `named:
* Named`, in addition to the generic `loc: SourceOffsets` field).
*
* Once you create a node using `node`, it is instantiated with all of its fields (including `loc`):
*
* ```ts
* new HtmlText({ loc: offsets, chars: someString });
* ```
*/
function node(name) {
	if (name !== void 0) {
		const type = name;
		return { fields() {
			return class {
				type;
				constructor(fields) {
					this.type = type;
					assign(this, fields);
					setLocalDebugType("syntax:mir:node", this);
				}
			};
		} };
	} else return { fields() {
		return class {
			constructor(fields) {
				assign(this, fields);
			}
		};
	} };
}
/**
* Corresponds to syntaxes with positional and named arguments:
*
* - SubExpression
* - Invoking Append
* - Invoking attributes
* - InvokeBlock
*
* If `Args` is empty, the `SourceOffsets` for this node should be the collapsed position
* immediately after the parent call node's `callee`.
*/
var Args$1 = class Args extends node().fields() {
	static empty(loc) {
		return new Args({
			loc,
			positional: PositionalArguments.empty(loc),
			named: NamedArguments$1.empty(loc)
		});
	}
	static named(named) {
		return new Args({
			loc: named.loc,
			positional: PositionalArguments.empty(named.loc.collapse("end")),
			named
		});
	}
	nth(offset) {
		return this.positional.nth(offset);
	}
	get(name) {
		return this.named.get(name);
	}
	isEmpty() {
		return this.positional.isEmpty() && this.named.isEmpty();
	}
};
/**
* Corresponds to positional arguments.
*
* If `PositionalArguments` is empty, the `SourceOffsets` for this node should be the collapsed
* position immediately after the parent call node's `callee`.
*/
var PositionalArguments = class PositionalArguments extends node().fields() {
	static empty(loc) {
		return new PositionalArguments({
			loc,
			exprs: []
		});
	}
	get size() {
		return this.exprs.length;
	}
	nth(offset) {
		return this.exprs[offset] || null;
	}
	isEmpty() {
		return this.exprs.length === 0;
	}
};
/**
* Corresponds to named arguments.
*
* If `PositionalArguments` and `NamedArguments` are empty, the `SourceOffsets` for this node should
* be the same as the `Args` node that contains this node.
*
* If `PositionalArguments` is not empty but `NamedArguments` is empty, the `SourceOffsets` for this
* node should be the collapsed position immediately after the last positional argument.
*/
var NamedArguments$1 = class NamedArguments extends node().fields() {
	static empty(loc) {
		return new NamedArguments({
			loc,
			entries: []
		});
	}
	get size() {
		return this.entries.length;
	}
	get(name) {
		let entry = this.entries.filter((e) => e.name.chars === name)[0];
		return entry ? entry.value : null;
	}
	isEmpty() {
		return this.entries.length === 0;
	}
};
/**
* Corresponds to a single named argument.
*
* ```hbs
* x=<expr>
* ```
*/
var NamedArgument$1 = class NamedArgument {
	loc;
	name;
	value;
	constructor(options) {
		this.loc = options.name.loc.extend(options.value.loc);
		this.name = options.name;
		this.value = options.value;
	}
};
/**
* Attr nodes look like HTML attributes, but are classified as:
*
* 1. `HtmlAttr`, which means a regular HTML attribute in Glimmer
* 2. `SplatAttr`, which means `...attributes`
* 3. `ComponentArg`, which means an attribute whose name begins with `@`, and it is therefore a
*    component argument.
*/
/**
* `HtmlAttr` and `SplatAttr` are grouped together because the order of the `SplatAttr` node,
* relative to other attributes, matters.
*/
/**
* "Attr Block" nodes are allowed inside an open element tag in templates. They interact with the
* element (or component).
*/
/**
* `HtmlAttr` nodes are valid HTML attributes, with or without a value.
*
* Exceptions:
*
* - `...attributes` is `SplatAttr`
* - `@x=<value>` is `ComponentArg`
*/
var HtmlAttr = class extends node("HtmlAttr").fields() {};
var SplatAttr$1 = class SplatAttr extends node("SplatAttr").fields() {};
/**
* Corresponds to an argument passed by a component (`@x=<value>`)
*/
var ComponentArg = class extends node().fields() {
	/**
	* Convert the component argument into a named argument node
	*/
	toNamedArgument() {
		return new NamedArgument$1({
			name: this.name,
			value: this.value
		});
	}
};
/**
* An `ElementModifier` is just a normal call node in modifier position.
*/
var ElementModifier = class extends node("ElementModifier").fields() {};
/**
* Content Nodes are allowed in content positions in templates. They correspond to behavior in the
* [Data][data] tokenization state in HTML.
*
* [data]: https://html.spec.whatwg.org/multipage/parsing.html#data-state
*/
var GlimmerComment = class extends node("GlimmerComment").fields() {};
var HtmlText = class extends node("HtmlText").fields() {};
var HtmlComment = class extends node("HtmlComment").fields() {};
var AppendContent = class extends node("AppendContent").fields() {
	get callee() {
		if (this.value.type === "Call") return this.value.callee;
		else return this.value;
	}
	get args() {
		if (this.value.type === "Call") return this.value.args;
		else return Args$1.empty(this.value.loc.collapse("end"));
	}
};
var InvokeBlock$1 = class InvokeBlock extends node("InvokeBlock").fields() {};
/**
* Corresponds to a component invocation. When the content of a component invocation contains no
* named blocks, `blocks` contains a single named block named `"default"`. When a component
* invocation is self-closing, `blocks` is empty.
*/
var InvokeComponent$1 = class InvokeComponent extends node("InvokeComponent").fields() {
	get args() {
		let entries = this.componentArgs.map((a) => a.toNamedArgument());
		return Args$1.named(new NamedArguments$1({
			loc: SpanList.range(entries, this.callee.loc.collapse("end")),
			entries
		}));
	}
};
/**
* Corresponds to a simple HTML element. The AST allows component arguments and modifiers to support
* future extensions.
*/
var SimpleElement$1 = class SimpleElement extends node("SimpleElement").fields() {
	get args() {
		let entries = this.componentArgs.map((a) => a.toNamedArgument());
		return Args$1.named(new NamedArguments$1({
			loc: SpanList.range(entries, this.tag.loc.collapse("end")),
			entries
		}));
	}
};
/**
* A Handlebars literal.
*
* {@link https://handlebarsjs.com/guide/expressions.html#literal-segments}
*/
/**
* Corresponds to a Handlebars literal.
*
* @see {LiteralValue}
*/
var LiteralExpression = class extends node("Literal").fields() {
	toSlice() {
		return new SourceSlice({
			loc: this.loc,
			chars: this.value
		});
	}
};
/**
* Returns true if an input {@see ExpressionNode} is a literal.
*/
function isLiteral$1(node, kind) {
	if (node.type === "Literal") return typeof node.value === kind;
	else return false;
}
/**
* Corresponds to a path in expression position.
*
* ```hbs
* this
* this.x
* @x
* @x.y
* x
* x.y
* ```
*/
var PathExpression$1 = class PathExpression extends node("Path").fields() {};
/**
* Corresponds to a known strict-mode keyword. It behaves similarly to a
* PathExpression with a FreeVarReference, but implies StrictResolution and
* is guaranteed to not have a tail, since `{{outlet.foo}}` would have been
* illegal.
*/
var KeywordExpression = class extends node("Keyword").fields() {};
/**
* Corresponds to a parenthesized call expression.
*
* ```hbs
* (x)
* (x.y)
* (x y)
* (x.y z)
* ```
*/
var CallExpression$1 = class CallExpression extends node("Call").fields() {};
/**
* Corresponds to an interpolation in attribute value position.
*
* ```hbs
* <a href="{{url}}.html"
* ```
*/
var InterpolateExpression$1 = class InterpolateExpression extends node("Interpolate").fields() {};
/**
* Corresponds to an entire template.
*/
var Template$1 = class Template extends node().fields() {};
/**
* Represents a block. In principle this could be merged with `NamedBlock`, because all cases
* involving blocks have at least a notional name.
*/
var Block = class extends node().fields() {};
/**
* Corresponds to a collection of named blocks.
*/
var NamedBlocks$1 = class NamedBlocks extends node().fields() {
	/**
	* Get the `NamedBlock` for a given name.
	*/
	get(name) {
		return this.blocks.filter((block) => block.name.chars === name)[0] || null;
	}
};
/**
* Corresponds to a single named block. This is used for anonymous named blocks (`default` and
* `else`).
*/
var NamedBlock$1 = class NamedBlock extends node().fields() {
	get args() {
		let entries = this.componentArgs.map((a) => a.toNamedArgument());
		return Args$1.named(new NamedArguments$1({
			loc: SpanList.range(entries, this.name.loc.collapse("end")),
			entries
		}));
	}
};
/**
* Corresponds to `this` at the head of an expression.
*/
var ThisReference = class extends node("This").fields() {};
/**
* Corresponds to `@<ident>` at the beginning of an expression.
*/
var ArgReference = class extends node("Arg").fields() {};
/**
* Corresponds to `<ident>` at the beginning of an expression, when `<ident>` is in the current
* block's scope.
*/
var LocalVarReference = class extends node("Local").fields() {};
/**
* Corresponds to `<ident>` at the beginning of an expression, when `<ident>` is *not* in the
* current block's scope.
*
* The `resolution: FreeVarResolution` field describes how to resolve the free variable.
*
* Note: In strict mode, it must always be a variable that is in a concrete JavaScript scope that
* the template will be installed into.
*/
var FreeVarReference = class extends node("Free").fields() {};
var HELPER_VAR_NS = "Helper";
var MODIFIER_VAR_NS = "Modifier";
var COMPONENT_VAR_NS = "Component";
/**
* A free variable is resolved according to a resolution rule:
*
* 1. Strict resolution
* 2. Namespaced resolution
*/
/**
* Strict resolution is used:
*
* 1. in a strict mode template
* 2. in an local variable invocation with dot paths
*/
var STRICT_RESOLUTION = {
	resolution: () => opcodes.GetStrictKeyword,
	serialize: () => "Strict",
	isAngleBracket: false
};
({ ...STRICT_RESOLUTION });
/**
* A `LooseModeResolution` includes one or more namespaces to resolve the variable in
*
* In practice, there are a limited number of possible combinations of these degrees of freedom,
* and they are captured by the `Namespaces` union below.
*/
var LooseModeResolution = class LooseModeResolution {
	/**
	* Namespaced resolution is used in an unambiguous syntax position:
	*
	* 1. `(sexp)` (namespace: `Helper`)
	* 2. `{{#block}}` (namespace: `Component`)
	* 3. `<a {{modifier}}>` (namespace: `Modifier`)
	* 4. `<Component />` (namespace: `Component`)
	*/
	static namespaced(namespace, isAngleBracket = false) {
		return new LooseModeResolution([namespace], isAngleBracket);
	}
	/**
	* Append resolution is used when the variable should be resolved in both the `component` and
	* `helper` namespaces.
	*
	* ```hbs
	* {{x}}
	* ```
	*
	* ```hbs
	* {{x y}}
	* ```
	*
	* ^ In either case, `x` should be resolved in the `component` and `helper` namespaces.
	*/
	static append() {
		return new LooseModeResolution([COMPONENT_VAR_NS, HELPER_VAR_NS]);
	}
	/**
	* Trusting append resolution is used when the variable should be resolved only in the
	* `helper` namespaces.
	*
	* ```hbs
	* {{{x}}}
	* ```
	*
	* ```hbs
	* {{{x y}}}
	* ```
	*
	* ^ In either case, `x` should be resolved in the `helper` namespace.
	*/
	static trustingAppend() {
		return this.namespaced(HELPER_VAR_NS);
	}
	constructor(namespaces, isAngleBracket = false) {
		this.namespaces = namespaces;
		this.isAngleBracket = isAngleBracket;
	}
	resolution() {
		if (this.namespaces.length === 1) switch (this.namespaces[0]) {
			case HELPER_VAR_NS: return opcodes.GetFreeAsHelperHead;
			case MODIFIER_VAR_NS: return opcodes.GetFreeAsModifierHead;
			case COMPONENT_VAR_NS: return opcodes.GetFreeAsComponentHead;
		}
		else return opcodes.GetFreeAsComponentOrHelperHead;
	}
	serialize() {
		if (this.namespaces.length === 1) return this.namespaces[0];
		else return "ComponentOrHelper";
	}
};
var HELPER_NAMESPACE = HELPER_VAR_NS;
var MODIFIER_NAMESPACE = MODIFIER_VAR_NS;
var COMPONENT_NAMESPACE = COMPONENT_VAR_NS;
var SymbolTable = class {
	static top(locals, keywords, options) {
		return new ProgramSymbolTable(locals, keywords, options);
	}
	child(locals) {
		let symbols = locals.map((name) => this.allocate(name));
		return new BlockSymbolTable(this, locals, symbols);
	}
};
var ProgramSymbolTable = class extends SymbolTable {
	constructor(templateLocals, keywords, options) {
		super();
		this.templateLocals = templateLocals;
		this.keywords = keywords;
		this.options = options;
		setLocalDebugType("syntax:symbol-table:program", this, { debug: () => ({
			templateLocals: this.templateLocals,
			keywords: this.keywords,
			symbols: this.symbols,
			upvars: this.upvars,
			named: this.named,
			blocks: this.blocks
		}) });
	}
	symbols = [];
	upvars = [];
	size = 1;
	named = dict();
	blocks = dict();
	usedTemplateLocals = [];
	root() {
		return this;
	}
	hasLexical(name) {
		return this.options.lexicalScope(name);
	}
	hasKeyword(name) {
		return this.keywords.includes(name);
	}
	getKeyword(name) {
		return this.allocateFree(name, STRICT_RESOLUTION);
	}
	getUsedTemplateLocals() {
		return this.usedTemplateLocals;
	}
	has(name) {
		return this.templateLocals.includes(name);
	}
	get(name) {
		let index = this.usedTemplateLocals.indexOf(name);
		if (index !== -1) return [index, true];
		index = this.usedTemplateLocals.length;
		this.usedTemplateLocals.push(name);
		return [index, true];
	}
	getLocalsMap() {
		return dict();
	}
	getDebugInfo() {
		return [this.getLocalsMap(), this.named];
	}
	allocateFree(name, resolution) {
		if (resolution.resolution() === opcodes.GetFreeAsComponentHead && resolution.isAngleBracket) name = this.options.customizeComponentName(name);
		let index = this.upvars.indexOf(name);
		if (index !== -1) return index;
		index = this.upvars.length;
		this.upvars.push(name);
		return index;
	}
	allocateNamed(name) {
		let named = this.named[name];
		if (!named) named = this.named[name] = this.allocate(name);
		return named;
	}
	allocateBlock(name) {
		if (name === "inverse") name = "else";
		let block = this.blocks[name];
		if (!block) block = this.blocks[name] = this.allocate(`&${name}`);
		return block;
	}
	allocate(identifier) {
		this.symbols.push(identifier);
		return this.size++;
	}
};
var BlockSymbolTable = class extends SymbolTable {
	constructor(parent, symbols, slots) {
		super();
		this.parent = parent;
		this.symbols = symbols;
		this.slots = slots;
	}
	root() {
		return this.parent.root();
	}
	get locals() {
		return this.symbols;
	}
	hasLexical(name) {
		return this.parent.hasLexical(name);
	}
	getKeyword(name) {
		return this.parent.getKeyword(name);
	}
	hasKeyword(name) {
		return this.parent.hasKeyword(name);
	}
	has(name) {
		return this.symbols.indexOf(name) !== -1 || this.parent.has(name);
	}
	get(name) {
		let local = this.#get(name);
		return local ? [local, false] : this.parent.get(name);
	}
	#get(name) {
		let slot = this.symbols.indexOf(name);
		return slot === -1 ? null : unwrap(this.slots[slot]);
	}
	getLocalsMap() {
		let dict = this.parent.getLocalsMap();
		this.symbols.forEach((symbol) => dict[symbol] = this.get(symbol)[0]);
		return dict;
	}
	getDebugInfo() {
		const locals = this.getLocalsMap();
		const root = this.root();
		const named = root.named;
		return [{
			...locals,
			...named
		}, Object.fromEntries(root.upvars.map((s, i) => [s, i]))];
	}
	allocateFree(name, resolution) {
		return this.parent.allocateFree(name, resolution);
	}
	allocateNamed(name) {
		return this.parent.allocateNamed(name);
	}
	allocateBlock(name) {
		return this.parent.allocateBlock(name);
	}
	allocate(identifier) {
		return this.parent.allocate(identifier);
	}
};
var Builder = class {
	template(symbols, body, loc) {
		return new Template$1({
			table: symbols,
			body,
			loc
		});
	}
	block(symbols, body, loc) {
		return new Block({
			scope: symbols,
			body,
			loc
		});
	}
	namedBlock(name, block, loc) {
		return new NamedBlock$1({
			name,
			block,
			attrs: [],
			componentArgs: [],
			modifiers: [],
			loc
		});
	}
	simpleNamedBlock(name, block, loc) {
		return new BuildElement({
			selfClosing: false,
			attrs: [],
			componentArgs: [],
			modifiers: [],
			comments: []
		}).named(name, block, loc);
	}
	slice(chars, loc) {
		return new SourceSlice({
			loc,
			chars
		});
	}
	args(positional, named, loc) {
		return new Args$1({
			loc,
			positional,
			named
		});
	}
	positional(exprs, loc) {
		return new PositionalArguments({
			loc,
			exprs
		});
	}
	namedArgument(key, value) {
		return new NamedArgument$1({
			name: key,
			value
		});
	}
	named(entries, loc) {
		return new NamedArguments$1({
			loc,
			entries
		});
	}
	attr({ name, value, trusting }, loc) {
		return new HtmlAttr({
			loc,
			name,
			value,
			trusting
		});
	}
	splatAttr(symbol, loc) {
		return new SplatAttr$1({
			symbol,
			loc
		});
	}
	arg({ name, value, trusting }, loc) {
		return new ComponentArg({
			name,
			value,
			trusting,
			loc
		});
	}
	path(head, tail, loc) {
		return new PathExpression$1({
			loc,
			ref: head,
			tail
		});
	}
	keyword(name, symbol, loc) {
		return new KeywordExpression({
			loc,
			name,
			symbol
		});
	}
	self(loc) {
		return new ThisReference({ loc });
	}
	at(name, symbol, loc) {
		assert(name[0] === "@");
		return new ArgReference({
			loc,
			name: new SourceSlice({
				loc,
				chars: name
			}),
			symbol
		});
	}
	freeVar({ name, context, symbol, loc }) {
		assert(name[0] !== "@");
		return new FreeVarReference({
			name,
			resolution: context,
			symbol,
			loc
		});
	}
	localVar(name, symbol, isTemplateLocal, loc) {
		assert(name[0] !== "@");
		return new LocalVarReference({
			loc,
			name,
			isTemplateLocal,
			symbol
		});
	}
	sexp(parts, loc) {
		return new CallExpression$1({
			loc,
			callee: parts.callee,
			args: parts.args
		});
	}
	interpolate(parts, loc) {
		return new InterpolateExpression$1({
			loc,
			parts
		});
	}
	literal(value, loc) {
		return new LiteralExpression({
			loc,
			value
		});
	}
	append({ table, trusting, value }, loc) {
		return new AppendContent({
			table,
			trusting,
			value,
			loc
		});
	}
	modifier({ callee, args }, loc) {
		return new ElementModifier({
			loc,
			callee,
			args
		});
	}
	namedBlocks(blocks, loc) {
		return new NamedBlocks$1({
			loc,
			blocks
		});
	}
	blockStatement({ program, inverse = null, ...call }, loc) {
		let blocksLoc = program.loc;
		let blocks = [this.namedBlock(SourceSlice.synthetic("default"), program, program.loc)];
		if (inverse) {
			blocksLoc = blocksLoc.extend(inverse.loc);
			blocks.push(this.namedBlock(SourceSlice.synthetic("else"), inverse, inverse.loc));
		}
		return new InvokeBlock$1({
			loc,
			blocks: this.namedBlocks(blocks, blocksLoc),
			callee: call.callee,
			args: call.args
		});
	}
	element(options) {
		return new BuildElement(options);
	}
};
var BuildElement = class {
	builder;
	constructor(base) {
		this.base = base;
		this.builder = new Builder();
	}
	simple(tag, body, loc) {
		return new SimpleElement$1(assign({
			tag,
			body,
			componentArgs: [],
			loc
		}, this.base));
	}
	named(name, block, loc) {
		return new NamedBlock$1(assign({
			name,
			block,
			componentArgs: [],
			loc
		}, this.base));
	}
	selfClosingComponent(callee, loc) {
		return new InvokeComponent$1(assign({
			loc,
			callee,
			blocks: new NamedBlocks$1({
				blocks: [],
				loc: loc.sliceEndChars({
					skipEnd: 1,
					chars: 1
				})
			})
		}, this.base));
	}
	componentWithDefaultBlock(callee, children, symbols, loc) {
		let block = this.builder.block(symbols, children, loc);
		let namedBlock = this.builder.namedBlock(SourceSlice.synthetic("default"), block, loc);
		return new InvokeComponent$1(assign({
			loc,
			callee,
			blocks: this.builder.namedBlocks([namedBlock], namedBlock.loc)
		}, this.base));
	}
	componentWithNamedBlocks(callee, blocks, loc) {
		return new InvokeComponent$1(assign({
			loc,
			callee,
			blocks: this.builder.namedBlocks(blocks, SpanList.range(blocks))
		}, this.base));
	}
};
function SexpSyntaxContext(node) {
	if (isSimpleCallee(node)) return LooseModeResolution.namespaced(HELPER_NAMESPACE);
	else return null;
}
function ModifierSyntaxContext(node) {
	if (isSimpleCallee(node)) return LooseModeResolution.namespaced(MODIFIER_NAMESPACE);
	else return null;
}
function BlockSyntaxContext(node) {
	if (isSimpleCallee(node)) return LooseModeResolution.namespaced(COMPONENT_NAMESPACE);
	else return null;
}
function ComponentSyntaxContext(node) {
	if (isSimplePath(node)) return LooseModeResolution.namespaced(COMPONENT_NAMESPACE, true);
	else return null;
}
/**
* This corresponds to attribute curlies (<Foo bar={{...}}>).
* In strict mode, this also corresponds to arg curlies.
*/
function AttrValueSyntaxContext(node) {
	if (isSimpleCallee(node)) return LooseModeResolution.namespaced(HELPER_NAMESPACE);
	else return null;
}
/**
* This corresponds to append positions text curlies.
*/
function AppendSyntaxContext(node) {
	let isSimple = isSimpleCallee(node);
	let trusting = node.trusting;
	if (isSimple) return trusting ? LooseModeResolution.trustingAppend() : LooseModeResolution.append();
	else return null;
}
/**
* A call node has a simple callee if its head is:
*
* - a `PathExpression`
* - the `PathExpression`'s head is a `VarHead`
* - it has no tail
*
* Simple heads:
*
* ```
* {{x}}
* {{x y}}
* ```
*
* Not simple heads:
*
* ```
* {{x.y}}
* {{x.y z}}
* {{@x}}
* {{@x a}}
* {{this}}
* {{this a}}
* ```
*/
function isSimpleCallee(node) {
	return isSimplePath(node.path);
}
function isSimplePath(node) {
	if (node.type === "PathExpression" && node.head.type === "VarHead") return node.tail.length === 0;
	else return false;
}
function normalize$1(source, options = { lexicalScope: () => false }) {
	let ast = preprocess(source, options);
	let normalizeOptions = {
		strictMode: false,
		...options,
		locals: ast.blockParams,
		keywords: options.keywords ?? []
	};
	let top = SymbolTable.top(normalizeOptions.locals, normalizeOptions.keywords, {
		customizeComponentName: options.customizeComponentName ?? ((name) => name),
		lexicalScope: options.lexicalScope
	});
	let block = new BlockContext(source, normalizeOptions, top);
	let normalizer = new StatementNormalizer(block);
	return [new TemplateChildren(block.loc(ast.loc), ast.body.map((b) => normalizer.normalize(b)), block).assertTemplate(top), top.getUsedTemplateLocals()];
}
/**
* A `BlockContext` represents the block that a particular AST node is contained inside of.
*
* `BlockContext` is aware of template-wide options (such as strict mode), as well as the bindings
* that are in-scope within that block.
*
* Concretely, it has the `PrecompileOptions` and current `SymbolTable`, and provides
* facilities for working with those options.
*
* `BlockContext` is stateless.
*/
var BlockContext = class BlockContext {
	builder;
	constructor(source, options, table) {
		this.source = source;
		this.options = options;
		this.table = table;
		this.builder = new Builder();
	}
	get strict() {
		return this.options.strictMode || false;
	}
	loc(loc) {
		return this.source.spanFor(loc);
	}
	resolutionFor(node, resolution) {
		if (this.strict) return { result: STRICT_RESOLUTION };
		if (this.isFreeVar(node)) {
			let r = resolution(node);
			if (r === null) return {
				result: "error",
				path: printPath(node),
				head: printHead(node)
			};
			return { result: r };
		} else return { result: STRICT_RESOLUTION };
	}
	isLexicalVar(variable) {
		return this.table.hasLexical(variable);
	}
	isKeyword(name) {
		return this.strict && !this.table.hasLexical(name) && this.table.hasKeyword(name);
	}
	isFreeVar(callee) {
		if (callee.type === "PathExpression") {
			if (callee.head.type !== "VarHead") return false;
			return !this.table.has(callee.head.name);
		} else if (callee.path.type === "PathExpression") return this.isFreeVar(callee.path);
		else return false;
	}
	hasBinding(name) {
		return this.table.has(name) || this.table.hasLexical(name);
	}
	child(blockParams) {
		return new BlockContext(this.source, this.options, this.table.child(blockParams));
	}
	customizeComponentName(input) {
		if (this.options.customizeComponentName) return this.options.customizeComponentName(input);
		else return input;
	}
};
/**
* An `ExpressionNormalizer` normalizes expressions within a block.
*
* `ExpressionNormalizer` is stateless.
*/
var ExpressionNormalizer = class {
	constructor(block) {
		this.block = block;
	}
	/**
	* The `normalize` method takes an arbitrary expression and its original syntax context and
	* normalizes it to an ASTv2 expression.
	*
	* @see {SyntaxContext}
	*/
	normalize(expr, resolution) {
		switch (expr.type) {
			case "NullLiteral":
			case "BooleanLiteral":
			case "NumberLiteral":
			case "StringLiteral":
			case "UndefinedLiteral": return this.block.builder.literal(expr.value, this.block.loc(expr.loc));
			case "PathExpression": return this.path(expr, resolution);
			case "SubExpression": {
				if (isLiteral(expr.path)) assertIllegalLiteral(expr.path, expr.loc);
				let resolution = this.block.resolutionFor(expr, SexpSyntaxContext);
				if (resolution.result === "error") throw generateSyntaxError(`You attempted to invoke a path (\`${resolution.path}\`) but ${resolution.head} was not in scope`, expr.loc);
				return this.block.builder.sexp(this.callParts(expr, resolution.result), this.block.loc(expr.loc));
			}
		}
	}
	path(expr, resolution) {
		let loc = this.block.loc(expr.loc);
		if (expr.head.type === "VarHead" && expr.tail.length === 0 && this.block.isKeyword(expr.head.name)) return this.block.builder.keyword(expr.head.name, this.block.table.getKeyword(expr.head.name), loc);
		let headOffsets = this.block.loc(expr.head.loc);
		let tail = [];
		let offset = headOffsets;
		for (let part of expr.tail) {
			offset = offset.sliceStartChars({
				chars: part.length,
				skipStart: 1
			});
			tail.push(new SourceSlice({
				loc: offset,
				chars: part
			}));
		}
		return this.block.builder.path(this.ref(expr.head, resolution), tail, loc);
	}
	/**
	* The `callParts` method takes ASTv1.CallParts as well as a syntax context and normalizes
	* it to an ASTv2 CallParts.
	*/
	callParts(parts, context) {
		let { path, params, hash, loc } = parts;
		let callee = this.normalize(path, context);
		let paramList = params.map((p) => this.normalize(p, STRICT_RESOLUTION));
		let paramLoc = SpanList.range(paramList, callee.loc.collapse("end"));
		let namedLoc = this.block.loc(hash.loc);
		let argsLoc = SpanList.range([paramLoc, namedLoc]);
		let positional = this.block.builder.positional(paramList, paramLoc);
		let named = this.block.builder.named(hash.pairs.map((p) => this.namedArgument(p)), this.block.loc(hash.loc));
		switch (callee.type) {
			case "Literal": throw generateSyntaxError(`Invalid invocation of a literal value (\`${callee.value}\`)`, loc);
			case "Interpolate": throw generateSyntaxError(`Invalid invocation of a interpolated string`, loc);
		}
		return {
			callee,
			args: this.block.builder.args(positional, named, argsLoc)
		};
	}
	namedArgument(pair) {
		let keyOffsets = this.block.loc(pair.loc).sliceStartChars({ chars: pair.key.length });
		return this.block.builder.namedArgument(new SourceSlice({
			chars: pair.key,
			loc: keyOffsets
		}), this.normalize(pair.value, STRICT_RESOLUTION));
	}
	/**
	* The `ref` method normalizes an `ASTv1.PathHead` into an `ASTv2.VariableReference`.
	* This method is extremely important, because it is responsible for normalizing free
	* variables into an an ASTv2.PathHead *with appropriate context*.
	*
	* The syntax context is originally determined by the syntactic position that this `PathHead`
	* came from, and is ultimately attached to the `ASTv2.VariableReference` here. In ASTv2,
	* the `VariableReference` node bears full responsibility for loose mode rules that control
	* the behavior of free variables.
	*/
	ref(head, resolution) {
		let { block } = this;
		let { builder, table } = block;
		let offsets = block.loc(head.loc);
		switch (head.type) {
			case "ThisHead":
				if (block.hasBinding("this")) {
					let [symbol, isRoot] = table.get("this");
					return block.builder.localVar("this", symbol, isRoot, offsets);
				}
				return builder.self(offsets);
			case "AtHead": {
				let symbol = table.allocateNamed(head.name);
				return builder.at(head.name, symbol, offsets);
			}
			case "VarHead": if (block.hasBinding(head.name)) {
				let [symbol, isRoot] = table.get(head.name);
				return block.builder.localVar(head.name, symbol, isRoot, offsets);
			} else {
				let context = block.strict ? STRICT_RESOLUTION : resolution;
				let symbol = block.table.allocateFree(head.name, context);
				return block.builder.freeVar({
					name: head.name,
					context,
					symbol,
					loc: offsets
				});
			}
		}
	}
};
/**
* `TemplateNormalizer` normalizes top-level ASTv1 statements to ASTv2.
*/
var StatementNormalizer = class StatementNormalizer {
	constructor(block) {
		this.block = block;
	}
	normalize(node) {
		switch (node.type) {
			case "BlockStatement": return this.BlockStatement(node);
			case "ElementNode": return new ElementNormalizer(this.block).ElementNode(node);
			case "MustacheStatement": return this.MustacheStatement(node);
			case "MustacheCommentStatement": return this.MustacheCommentStatement(node);
			case "CommentStatement": {
				let loc = this.block.loc(node.loc);
				return new HtmlComment({
					loc,
					text: loc.slice({
						skipStart: 4,
						skipEnd: 3
					}).toSlice(node.value)
				});
			}
			case "TextNode": return new HtmlText({
				loc: this.block.loc(node.loc),
				chars: node.chars
			});
		}
	}
	MustacheCommentStatement(node) {
		let loc = this.block.loc(node.loc);
		if (node.value === "") return new GlimmerComment({
			loc,
			text: SourceSlice.synthetic("")
		});
		let source = loc.asString();
		let span = loc;
		if (node.value.startsWith("-")) span = span.sliceStartChars({
			skipStart: source.startsWith("{{~") ? 6 : 5,
			chars: node.value.length
		});
		else if (node.value.endsWith("-")) {
			const skipEnd = source.endsWith("~}}") ? 5 : 4;
			const skipStart = source.length - node.value.length - skipEnd;
			span = span.slice({
				skipStart,
				skipEnd
			});
		} else span = span.sliceStartChars({
			skipStart: source.lastIndexOf(node.value),
			chars: node.value.length
		});
		return new GlimmerComment({
			loc,
			text: span.toSlice(node.value)
		});
	}
	/**
	* Normalizes an ASTv1.MustacheStatement to an ASTv2.AppendStatement
	*/
	MustacheStatement(mustache) {
		let { path, params, hash, trusting } = mustache;
		let loc = this.block.loc(mustache.loc);
		let value;
		if (isLiteral(path)) {
			if (params.length === 0 && hash.pairs.length === 0) value = this.expr.normalize(path);
			else assertIllegalLiteral(path, loc);
		} else {
			let resolution = this.block.resolutionFor(mustache, AppendSyntaxContext);
			if (resolution.result === "error") throw generateSyntaxError(`You attempted to render a path (\`{{${resolution.path}}}\`), but ${resolution.head} was not in scope`, loc);
			let callParts = this.expr.callParts({
				path,
				params,
				hash,
				loc
			}, resolution.result);
			value = callParts.args.isEmpty() ? callParts.callee : this.block.builder.sexp(callParts, loc);
		}
		return this.block.builder.append({
			table: this.block.table,
			trusting,
			value
		}, loc);
	}
	/**
	* Normalizes a ASTv1.BlockStatement to an ASTv2.BlockStatement
	*/
	BlockStatement(block) {
		let { program, inverse } = block;
		let loc = this.block.loc(block.loc);
		if (isLiteral(block.path)) assertIllegalLiteral(block.path, loc);
		let resolution = this.block.resolutionFor(block, BlockSyntaxContext);
		if (resolution.result === "error") throw generateSyntaxError(`You attempted to invoke a path (\`{{#${resolution.path}}}\`) but ${resolution.head} was not in scope`, loc);
		let callParts = this.expr.callParts(block, resolution.result);
		return this.block.builder.blockStatement(assign({
			symbols: this.block.table,
			program: this.Block(program),
			inverse: inverse ? this.Block(inverse) : null
		}, callParts), loc);
	}
	Block({ body, loc, blockParams }) {
		let child = this.block.child(blockParams);
		let normalizer = new StatementNormalizer(child);
		return new BlockChildren(this.block.loc(loc), body.map((b) => normalizer.normalize(b)), this.block).assertBlock(child.table);
	}
	get expr() {
		return new ExpressionNormalizer(this.block);
	}
};
var ElementNormalizer = class {
	constructor(ctx) {
		this.ctx = ctx;
	}
	/**
	* Normalizes an ASTv1.ElementNode to:
	*
	* - ASTv2.NamedBlock if the tag name begins with `:`
	* - ASTv2.Component if the tag name matches the component heuristics
	* - ASTv2.SimpleElement if the tag name doesn't match the component heuristics
	*
	* A tag name represents a component if:
	*
	* - it begins with `@`
	* - it is exactly `this` or begins with `this.`
	* - the part before the first `.` is a reference to an in-scope variable binding
	* - it begins with an uppercase character
	*/
	ElementNode(element) {
		let { tag, selfClosing, comments } = element;
		let loc = this.ctx.loc(element.loc);
		let [tagHead, ...rest] = asPresentArray(tag.split("."));
		let path = this.classifyTag(tagHead, rest, element.loc);
		let attrs = element.attributes.filter((a) => a.name[0] !== "@").map((a) => this.attr(a));
		let args = element.attributes.filter((a) => a.name[0] === "@").map((a) => this.arg(a));
		let modifiers = element.modifiers.map((m) => this.modifier(m));
		let child = this.ctx.child(element.blockParams);
		let normalizer = new StatementNormalizer(child);
		let childNodes = element.children.map((s) => normalizer.normalize(s));
		let el = this.ctx.builder.element({
			selfClosing,
			attrs,
			componentArgs: args,
			modifiers,
			comments: comments.map((c) => new StatementNormalizer(this.ctx).MustacheCommentStatement(c))
		});
		let children = new ElementChildren(el, loc, childNodes, this.ctx);
		let tagOffsets = this.ctx.loc(element.loc).sliceStartChars({
			chars: tag.length,
			skipStart: 1
		});
		if (path === "ElementHead") {
			if (tag[0] === ":") return children.assertNamedBlock(tagOffsets.slice({ skipStart: 1 }).toSlice(tag.slice(1)), child.table);
			else return children.assertElement(tagOffsets.toSlice(tag), element.blockParams.length > 0);
		}
		if (element.selfClosing) return el.selfClosingComponent(path, loc);
		else {
			let blocks = children.assertComponent(tag, child.table, element.blockParams.length > 0);
			return el.componentWithNamedBlocks(path, blocks, loc);
		}
	}
	modifier(m) {
		if (isLiteral(m.path)) assertIllegalLiteral(m.path, m.loc);
		let resolution = this.ctx.resolutionFor(m, ModifierSyntaxContext);
		if (resolution.result === "error") throw generateSyntaxError(`You attempted to invoke a path (\`{{${resolution.path}}}\`) as a modifier, but ${resolution.head} was not in scope`, m.loc);
		let callParts = this.expr.callParts(m, resolution.result);
		return this.ctx.builder.modifier(callParts, this.ctx.loc(m.loc));
	}
	/**
	* This method handles attribute values that are curlies, as well as curlies nested inside of
	* interpolations:
	*
	* ```hbs
	* <a href={{url}} />
	* <a href="{{url}}.html" />
	* ```
	*/
	mustacheAttr(mustache) {
		let { path, params, hash, loc } = mustache;
		if (isLiteral(path)) {
			if (params.length === 0 && hash.pairs.length === 0) return this.expr.normalize(path);
			else assertIllegalLiteral(path, loc);
		}
		let resolution = this.ctx.resolutionFor(mustache, AttrValueSyntaxContext);
		if (resolution.result === "error") throw generateSyntaxError(`You attempted to render a path (\`{{${resolution.path}}}\`), but ${resolution.head} was not in scope`, mustache.loc);
		let sexp = this.ctx.builder.sexp(this.expr.callParts(mustache, resolution.result), this.ctx.loc(mustache.loc));
		if (sexp.args.isEmpty()) return sexp.callee;
		else return sexp;
	}
	/**
	* attrPart is the narrowed down list of valid attribute values that are also
	* allowed as a concat part (you can't nest concats).
	*/
	attrPart(part) {
		switch (part.type) {
			case "MustacheStatement": return {
				expr: this.mustacheAttr(part),
				trusting: part.trusting
			};
			case "TextNode": return {
				expr: this.ctx.builder.literal(part.chars, this.ctx.loc(part.loc)),
				trusting: true
			};
		}
	}
	attrValue(part) {
		switch (part.type) {
			case "ConcatStatement": {
				let parts = part.parts.map((p) => this.attrPart(p).expr);
				return {
					expr: this.ctx.builder.interpolate(parts, this.ctx.loc(part.loc)),
					trusting: false
				};
			}
			default: return this.attrPart(part);
		}
	}
	attr(m) {
		assert(m.name[0] !== "@");
		if (m.name === "...attributes") return this.ctx.builder.splatAttr(this.ctx.table.allocateBlock("attrs"), this.ctx.loc(m.loc));
		let offsets = this.ctx.loc(m.loc);
		let nameSlice = offsets.sliceStartChars({ chars: m.name.length }).toSlice(m.name);
		let value = this.attrValue(m.value);
		return this.ctx.builder.attr({
			name: nameSlice,
			value: value.expr,
			trusting: value.trusting
		}, offsets);
	}
	checkArgCall(arg) {
		let { value } = arg;
		if (value.type !== "MustacheStatement") return;
		if (value.params.length !== 0 || value.hash.pairs.length !== 0) return;
		let { path } = value;
		if (path.type !== "PathExpression") return;
		if (path.tail.length > 0) return;
		let resolution = this.ctx.resolutionFor(path, () => {
			return null;
		});
		if (resolution.result === "error" && resolution.path !== "has-block") throw generateSyntaxError(`You attempted to pass a path as argument (\`${arg.name}={{${resolution.path}}}\`) but ${resolution.head} was not in scope. Try:\n* \`${arg.name}={{this.${resolution.path}}}\` if this is meant to be a property lookup, or\n* \`${arg.name}={{(${resolution.path})}}\` if this is meant to invoke the resolved helper, or\n* \`${arg.name}={{helper "${resolution.path}"}}\` if this is meant to pass the resolved helper by value`, arg.loc);
	}
	arg(arg) {
		assert(arg.name[0] === "@");
		this.checkArgCall(arg);
		let offsets = this.ctx.loc(arg.loc);
		let nameSlice = offsets.sliceStartChars({ chars: arg.name.length }).toSlice(arg.name);
		let value = this.attrValue(arg.value);
		return this.ctx.builder.arg({
			name: nameSlice,
			value: value.expr,
			trusting: value.trusting
		}, offsets);
	}
	/**
	* This function classifies the head of an ASTv1.Element into an ASTv2.PathHead (if the
	* element is a component) or `'ElementHead'` (if the element is a simple element).
	*
	* Rules:
	*
	* 1. If the variable is an `@arg`, return an `AtHead`
	* 2. If the variable is `this`, return a `ThisHead`
	* 3. If the variable is in the current scope:
	*   a. If the scope is the root scope, then return a Free `LocalVarHead`
	*   b. Else, return a standard `LocalVarHead`
	* 4. If the tag name is a path and the variable is not in the current scope, Syntax Error
	* 5. If the variable is uppercase return a FreeVar(ResolveAsComponentHead)
	* 6. Otherwise, return `'ElementHead'`
	*/
	classifyTag(variable, tail, loc) {
		let uppercase = isUpperCase(variable);
		let inScope = variable[0] === "@" || variable === "this" || this.ctx.hasBinding(variable);
		if (this.ctx.strict && !inScope) {
			if (uppercase) throw generateSyntaxError(`Attempted to invoke a component that was not in scope in a strict mode template, \`<${variable}>\`. If you wanted to create an element with that name, convert it to lowercase - \`<${variable.toLowerCase()}>\``, loc);
			return "ElementHead";
		}
		let isComponent = inScope || uppercase;
		let variableLoc = loc.sliceStartChars({
			skipStart: 1,
			chars: variable.length
		});
		let tailLength = tail.reduce((accum, part) => accum + 1 + part.length, 0);
		let pathEnd = variableLoc.getEnd().move(tailLength);
		let pathLoc = variableLoc.withEnd(pathEnd);
		if (isComponent) {
			let path = b.path({
				head: b.head({
					original: variable,
					loc: variableLoc
				}),
				tail,
				loc: pathLoc
			});
			let resolution = this.ctx.isLexicalVar(variable) ? { result: STRICT_RESOLUTION } : this.ctx.resolutionFor(path, ComponentSyntaxContext);
			if (resolution.result === "error") throw generateSyntaxError(`You attempted to invoke a path (\`<${resolution.path}>\`) but ${resolution.head} was not in scope`, loc);
			return new ExpressionNormalizer(this.ctx).normalize(path, resolution.result);
		} else this.ctx.table.allocateFree(variable, STRICT_RESOLUTION);
		if (tail.length > 0) throw generateSyntaxError(`You used ${variable}.${tail.join(".")} as a tag name, but ${variable} is not in scope`, loc);
		return "ElementHead";
	}
	get expr() {
		return new ExpressionNormalizer(this.ctx);
	}
};
var Children = class {
	namedBlocks;
	hasSemanticContent;
	nonBlockChildren;
	constructor(loc, children, block) {
		this.loc = loc;
		this.children = children;
		this.block = block;
		this.namedBlocks = children.filter((c) => c instanceof NamedBlock$1);
		this.hasSemanticContent = Boolean(children.filter((c) => {
			if (c instanceof NamedBlock$1) return false;
			switch (c.type) {
				case "GlimmerComment":
				case "HtmlComment": return false;
				case "HtmlText": return !/^\s*$/u.test(c.chars);
				default: return true;
			}
		}).length);
		this.nonBlockChildren = children.filter((c) => !(c instanceof NamedBlock$1));
	}
};
var TemplateChildren = class extends Children {
	assertTemplate(table) {
		if (isPresentArray(this.namedBlocks)) throw generateSyntaxError(`Unexpected named block at the top-level of a template`, this.loc);
		return this.block.builder.template(table, this.nonBlockChildren, this.block.loc(this.loc));
	}
};
var BlockChildren = class extends Children {
	assertBlock(table) {
		if (isPresentArray(this.namedBlocks)) throw generateSyntaxError(`Unexpected named block nested in a normal block`, this.loc);
		return this.block.builder.block(table, this.nonBlockChildren, this.loc);
	}
};
var ElementChildren = class extends Children {
	constructor(el, loc, children, block) {
		super(loc, children, block);
		this.el = el;
	}
	assertNamedBlock(name, table) {
		if (this.el.base.selfClosing) throw generateSyntaxError(`<:${name.chars}/> is not a valid named block: named blocks cannot be self-closing`, this.loc);
		if (isPresentArray(this.namedBlocks)) throw generateSyntaxError(`Unexpected named block inside <:${name.chars}> named block: named blocks cannot contain nested named blocks`, this.loc);
		if (!isLowerCase(name.chars)) throw generateSyntaxError(`<:${name.chars}> is not a valid named block, and named blocks must begin with a lowercase letter`, this.loc);
		if (this.el.base.attrs.length > 0 || this.el.base.componentArgs.length > 0 || this.el.base.modifiers.length > 0) throw generateSyntaxError(`named block <:${name.chars}> cannot have attributes, arguments, or modifiers`, this.loc);
		let offsets = SpanList.range(this.nonBlockChildren, this.loc);
		return this.block.builder.namedBlock(name, this.block.builder.block(table, this.nonBlockChildren, offsets), this.loc);
	}
	assertElement(name, hasBlockParams) {
		if (hasBlockParams) throw generateSyntaxError(`Unexpected block params in <${name.chars}>: simple elements cannot have block params`, this.loc);
		if (isPresentArray(this.namedBlocks)) {
			let names = this.namedBlocks.map((b) => b.name);
			if (names.length === 1) throw generateSyntaxError(`Unexpected named block <:foo> inside <${name.chars}> HTML element`, this.loc);
			else {
				let printedNames = names.map((n) => `<:${n.chars}>`).join(", ");
				throw generateSyntaxError(`Unexpected named blocks inside <${name.chars}> HTML element (${printedNames})`, this.loc);
			}
		}
		return this.el.simple(name, this.nonBlockChildren, this.loc);
	}
	assertComponent(name, table, hasBlockParams) {
		if (isPresentArray(this.namedBlocks) && this.hasSemanticContent) throw generateSyntaxError(`Unexpected content inside <${name}> component invocation: when using named blocks, the tag cannot contain other content`, this.loc);
		if (isPresentArray(this.namedBlocks)) {
			if (hasBlockParams) throw generateSyntaxError(`Unexpected block params list on <${name}> component invocation: when passing named blocks, the invocation tag cannot take block params`, this.loc);
			let seenNames = /* @__PURE__ */ new Set();
			for (let block of this.namedBlocks) {
				let name = block.name.chars;
				if (seenNames.has(name)) throw generateSyntaxError(`Component had two named blocks with the same name, \`<:${name}>\`. Only one block with a given name may be passed`, this.loc);
				if (name === "inverse" && seenNames.has("else") || name === "else" && seenNames.has("inverse")) throw generateSyntaxError(`Component has both <:else> and <:inverse> block. <:inverse> is an alias for <:else>`, this.loc);
				seenNames.add(name);
			}
			return this.namedBlocks;
		} else return [this.block.builder.namedBlock(SourceSlice.synthetic("default"), this.block.builder.block(table, this.nonBlockChildren, this.loc), this.loc)];
	}
};
function isLiteral(node) {
	switch (node.type) {
		case "StringLiteral":
		case "BooleanLiteral":
		case "NumberLiteral":
		case "UndefinedLiteral":
		case "NullLiteral": return true;
		default: return false;
	}
}
function assertIllegalLiteral(node, loc) {
	throw generateSyntaxError(`Unexpected literal \`${node.type === "StringLiteral" ? JSON.stringify(node.value) : String(node.value)}\``, loc);
}
function printPath(node) {
	if (node.type !== "PathExpression" && node.path.type === "PathExpression") return printPath(node.path);
	else return new Printer({ entityEncoding: "raw" }).print(node);
}
function printHead(node) {
	if (node.type === "PathExpression") return node.head.original;
	else if (node.path.type === "PathExpression") return printHead(node.path);
	else return new Printer({ entityEncoding: "raw" }).print(node);
}
var Template = class extends node("Template").fields() {};
var InElement = class extends node("InElement").fields() {};
var Not = class extends node("Not").fields() {};
var If = class extends node("If").fields() {};
var IfInline = class extends node("IfInline").fields() {};
var Each = class extends node("Each").fields() {};
var Let = class extends node("Let").fields() {};
var WithDynamicVars = class extends node("WithDynamicVars").fields() {};
var GetDynamicVar = class extends node("GetDynamicVar").fields() {};
var Log = class extends node("Log").fields() {};
var InvokeComponent = class extends node("InvokeComponent").fields() {};
var NamedBlocks = class extends node("NamedBlocks").fields() {};
var NamedBlock = class extends node("NamedBlock").fields() {};
var AppendTrustedHTML = class extends node("AppendTrustedHTML").fields() {};
var AppendTextNode = class extends node("AppendTextNode").fields() {};
var AppendComment = class extends node("AppendComment").fields() {};
var Component = class extends node("Component").fields() {};
var StaticAttr = class extends node("StaticAttr").fields() {};
var DynamicAttr = class extends node("DynamicAttr").fields() {};
var SimpleElement = class extends node("SimpleElement").fields() {};
var ElementParameters = class extends node("ElementParameters").fields() {};
var Yield = class extends node("Yield").fields() {};
var Debugger = class extends node("Debugger").fields() {};
var CallExpression = class extends node("CallExpression").fields() {};
var Modifier = class extends node("Modifier").fields() {};
var InvokeBlock = class extends node("InvokeBlock").fields() {};
var SplatAttr = class extends node("SplatAttr").fields() {};
var PathExpression = class extends node("PathExpression").fields() {};
var Missing = class extends node("Missing").fields() {};
var InterpolateExpression = class extends node("InterpolateExpression").fields() {};
var HasBlock = class extends node("HasBlock").fields() {};
var HasBlockParams = class extends node("HasBlockParams").fields() {};
var Curry = class extends node("Curry").fields() {};
var Positional = class extends node("Positional").fields() {};
var NamedArguments = class extends node("NamedArguments").fields() {};
var NamedArgument = class extends node("NamedArgument").fields() {};
var Args = class extends node("Args").fields() {};
var Tail = class extends node("Tail").fields() {};
var PresentList = class PresentList {
	constructor(list) {
		this.list = list;
	}
	toArray() {
		return this.list;
	}
	map(callback) {
		let result = mapPresentArray(this.list, callback);
		return new PresentList(result);
	}
	filter(predicate) {
		let out = [];
		for (let item of this.list) if (predicate(item)) out.push(item);
		return OptionalList(out);
	}
	toPresentArray() {
		return this.list;
	}
	into({ ifPresent }) {
		return ifPresent(this);
	}
};
var EmptyList = class EmptyList {
	list = [];
	map(_callback) {
		return new EmptyList();
	}
	filter(_predicate) {
		return new EmptyList();
	}
	toArray() {
		return this.list;
	}
	toPresentArray() {
		return null;
	}
	into({ ifEmpty }) {
		return ifEmpty();
	}
};
function OptionalList(value) {
	if (isPresentArray(value)) return new PresentList(value);
	else return new EmptyList();
}
var ResultImpl = class {
	static all(...results) {
		let out = [];
		for (let result of results) if (result.isErr) return result.cast();
		else out.push(result.value);
		return Ok(out);
	}
};
var Result = ResultImpl;
var OkImpl = class extends ResultImpl {
	isOk = true;
	isErr = false;
	constructor(value) {
		super();
		this.value = value;
	}
	expect(_message) {
		return this.value;
	}
	ifOk(callback) {
		callback(this.value);
		return this;
	}
	andThen(callback) {
		return callback(this.value);
	}
	mapOk(callback) {
		return Ok(callback(this.value));
	}
	ifErr(_callback) {
		return this;
	}
	mapErr(_callback) {
		return this;
	}
};
var ErrImpl = class extends ResultImpl {
	isOk = false;
	isErr = true;
	constructor(reason) {
		super();
		this.reason = reason;
	}
	expect(message) {
		throw new Error(message || "expected an Ok, got Err");
	}
	andThen(_callback) {
		return this.cast();
	}
	mapOk(_callback) {
		return this.cast();
	}
	ifOk(_callback) {
		return this;
	}
	mapErr(callback) {
		return Err(callback(this.reason));
	}
	ifErr(callback) {
		callback(this.reason);
		return this;
	}
	cast() {
		return this;
	}
};
function Ok(value) {
	return new OkImpl(value);
}
function Err(reason) {
	return new ErrImpl(reason);
}
var ResultArray = class {
	constructor(items = []) {
		this.items = items;
	}
	add(item) {
		this.items.push(item);
	}
	toArray() {
		let err = this.items.filter((item) => item instanceof ErrImpl)[0];
		if (err !== void 0) return err.cast();
		else return Ok(this.items.map((item) => item.value));
	}
	toOptionalList() {
		return this.toArray().mapOk((arr) => OptionalList(arr));
	}
};
function isKeyword(word, type) {
	if (word in KEYWORDS_TYPES) return true;
	else return false;
}
/**
* This includes the full list of keywords currently in use in the template
* language, and where their valid usages are.
*/
var KEYWORDS_TYPES = {
	action: ["Call", "Modifier"],
	component: [
		"Call",
		"Append",
		"Block"
	],
	debugger: ["Append"],
	"each-in": ["Block"],
	each: ["Block"],
	"has-block-params": ["Call", "Append"],
	"has-block": ["Call", "Append"],
	helper: ["Call", "Append"],
	if: [
		"Call",
		"Append",
		"Block"
	],
	"in-element": ["Block"],
	let: ["Block"],
	log: ["Call", "Append"],
	modifier: ["Call", "Modifier"],
	mount: ["Append"],
	mut: ["Call", "Append"],
	outlet: ["Append"],
	readonly: ["Call", "Append"],
	unbound: ["Call", "Append"],
	unless: [
		"Call",
		"Append",
		"Block"
	],
	yield: ["Append"]
};
var NormalizeExpressions = class {
	visit(node, state) {
		switch (node.type) {
			case "Literal": return Ok(this.Literal(node));
			case "Keyword": return Ok(this.Keyword(node));
			case "Interpolate": return this.Interpolate(node, state);
			case "Path": return this.PathExpression(node);
			case "Call": {
				let translated = CALL_KEYWORDS.translate(node, state);
				if (translated !== null) return translated;
				return this.CallExpression(node, state);
			}
		}
	}
	visitList(nodes, state) {
		return new ResultArray(nodes.map((e) => VISIT_EXPRS.visit(e, state))).toOptionalList();
	}
	/**
	* Normalize paths into `hir.Path` or a `hir.Expr` that corresponds to the ref.
	*
	* TODO since keywords don't support tails anyway, distinguish PathExpression from
	* VariableReference in ASTv2.
	*/
	PathExpression(path) {
		let ref = this.VariableReference(path.ref);
		let { tail } = path;
		if (isPresentArray(tail)) {
			let tailLoc = tail[0].loc.extend(getLast(tail).loc);
			return Ok(new PathExpression({
				loc: path.loc,
				head: ref,
				tail: new Tail({
					loc: tailLoc,
					members: tail
				})
			}));
		} else return Ok(ref);
	}
	VariableReference(ref) {
		return ref;
	}
	Literal(literal) {
		return literal;
	}
	Keyword(keyword) {
		return keyword;
	}
	Interpolate(expr, state) {
		let parts = expr.parts.map(convertPathToCallIfKeyword);
		return VISIT_EXPRS.visitList(parts, state).mapOk((parts) => new InterpolateExpression({
			loc: expr.loc,
			parts
		}));
	}
	CallExpression(expr, state) {
		if (expr.callee.type === "Call") throw new Error(`unimplemented: subexpression at the head of a subexpression`);
		else return Result.all(VISIT_EXPRS.visit(expr.callee, state), VISIT_EXPRS.Args(expr.args, state)).mapOk(([callee, args]) => new CallExpression({
			loc: expr.loc,
			callee,
			args
		}));
	}
	Args({ positional, named, loc }, state) {
		return Result.all(this.Positional(positional, state), this.NamedArguments(named, state)).mapOk(([positional, named]) => new Args({
			loc,
			positional,
			named
		}));
	}
	Positional(positional, state) {
		return VISIT_EXPRS.visitList(positional.exprs, state).mapOk((list) => new Positional({
			loc: positional.loc,
			list
		}));
	}
	NamedArguments(named, state) {
		return new ResultArray(named.entries.map((arg) => {
			let value = convertPathToCallIfKeyword(arg.value);
			return VISIT_EXPRS.visit(value, state).mapOk((value) => new NamedArgument({
				loc: arg.loc,
				key: arg.name,
				value
			}));
		})).toOptionalList().mapOk((pairs) => new NamedArguments({
			loc: named.loc,
			entries: pairs
		}));
	}
};
function convertPathToCallIfKeyword(path) {
	if (path.type === "Path" && path.ref.type === "Free" && path.ref.name in KEYWORDS_TYPES) return new CallExpression$1({
		callee: path,
		args: Args$1.empty(path.loc),
		loc: path.loc
	});
	return path;
}
var VISIT_EXPRS = new NormalizeExpressions();
var KeywordImpl = class {
	types;
	constructor(keyword, type, delegate) {
		this.keyword = keyword;
		this.delegate = delegate;
		let nodes = /* @__PURE__ */ new Set();
		for (let nodeType of KEYWORD_NODES[type]) nodes.add(nodeType);
		this.types = nodes;
	}
	match(node) {
		if (!this.types.has(node.type)) return false;
		let path = getCalleeExpression(node);
		if (path !== null && path.type === "Path" && path.ref.type === "Free") return path.ref.name === this.keyword;
		else return false;
	}
	translate(node, state) {
		if (this.match(node)) {
			let path = getCalleeExpression(node);
			if (path !== null && path.type === "Path" && path.tail.length > 0) return Err(generateSyntaxError(`The \`${this.keyword}\` keyword was used incorrectly. It was used as \`${path.loc.asString()}\`, but it cannot be used with additional path segments. \n\nError caused by`, node.loc));
			return this.delegate.assert(node, state).andThen((param) => this.delegate.translate({
				node,
				state
			}, param));
		} else return null;
	}
};
var KEYWORD_NODES = {
	Call: ["Call"],
	Block: ["InvokeBlock"],
	Append: ["AppendContent"],
	Modifier: ["ElementModifier"]
};
/**
* A "generic" keyword is something like `has-block`, which makes sense in the context
* of sub-expression or append
*/
function getCalleeExpression(node) {
	switch (node.type) {
		case "Path": return node;
		case "AppendContent": return getCalleeExpression(node.value);
		case "Call":
		case "InvokeBlock":
		case "ElementModifier": return node.callee;
		default: return null;
	}
}
var Keywords = class {
	_keywords = [];
	_type;
	constructor(type) {
		this._type = type;
	}
	kw(name, delegate) {
		this._keywords.push(new KeywordImpl(name, this._type, delegate));
		return this;
	}
	translate(node, state) {
		for (let keyword of this._keywords) {
			let result = keyword.translate(node, state);
			if (result !== null) return result;
		}
		let path = getCalleeExpression(node);
		if (path && path.type === "Path" && path.ref.type === "Free" && isKeyword(path.ref.name)) {
			let { name } = path.ref;
			let usedType = this._type;
			let validTypes = KEYWORDS_TYPES[name];
			if (!validTypes.includes(usedType)) return Err(generateSyntaxError(`The \`${name}\` keyword was used incorrectly. It was used as ${typesToReadableName[usedType]}, but its valid usages are:\n\n${generateTypesMessage(name, validTypes)}\n\nError caused by`, node.loc));
		}
		return null;
	}
};
var typesToReadableName = {
	Append: "an append statement",
	Block: "a block statement",
	Call: "a call expression",
	Modifier: "a modifier"
};
function generateTypesMessage(name, types) {
	return types.map((type) => {
		switch (type) {
			case "Append": return `- As an append statement, as in: {{${name}}}`;
			case "Block": return `- As a block statement, as in: {{#${name}}}{{/${name}}}`;
			case "Call": return `- As an expression, as in: (${name})`;
			case "Modifier": return `- As a modifier, as in: <div {{${name}}}></div>`;
			default: return exhausted();
		}
	}).join("\n\n");
}
/**
* This function builds keyword definitions for a particular type of AST node (`KeywordType`).
*
* You can build keyword definitions for:
*
* - `Expr`: A `SubExpression` or `PathExpression`
* - `Block`: A `BlockStatement`
*   - A `BlockStatement` is a keyword candidate if its head is a
*     `PathExpression`
* - `Append`: An `AppendStatement`
*
* A node is a keyword candidate if:
*
* - A `PathExpression` is a keyword candidate if it has no tail, and its
*   head expression is a `LocalVarHead` or `FreeVarHead` whose name is
*   the keyword's name.
* - A `SubExpression`, `AppendStatement`, or `BlockStatement` is a keyword
*   candidate if its head is a keyword candidate.
*
* The keyword infrastructure guarantees that:
*
* - If a node is not a keyword candidate, it is never passed to any keyword's
*   `assert` method.
* - If a node is not the `KeywordType` for a particular keyword, it will not
*   be passed to the keyword's `assert` method.
*
* `Expr` keywords are used in expression positions and should return HIR
* expressions. `Block` and `Append` keywords are used in statement
* positions and should return HIR statements.
*
* A keyword definition has two parts:
*
* - `match`, which determines whether an AST node matches the keyword, and can
*   optionally return some information extracted from the AST node.
* - `translate`, which takes a matching AST node as well as the extracted
*   information and returns an appropriate HIR instruction.
*
* # Example
*
* This keyword:
*
* - turns `(hello)` into `"hello"`
*   - as long as `hello` is not in scope
* - makes it an error to pass any arguments (such as `(hello world)`)
*
* ```ts
* keywords('SubExpr').kw('hello', {
*   assert(node: ExprKeywordNode): Result<void> | false {
*     // we don't want to transform `hello` as a `PathExpression`
*     if (node.type !== 'SubExpression') {
*       return false;
*     }
*
*     // node.head would be `LocalVarHead` if `hello` was in scope
*     if (node.head.type !== 'FreeVarHead') {
*       return false;
*     }
*
*     if (node.params.length || node.hash) {
*       return Err(generateSyntaxError(`(hello) does not take any arguments`), node.loc);
*     } else {
*       return Ok();
*     }
*   },
*
*   translate(node: ASTv2.SubExpression): hir.Expression {
*     return ASTv2.builders.literal("hello", node.loc)
*   }
* })
* ```
*
* The keyword infrastructure checks to make sure that the node is the right
* type before calling `assert`, so you only need to consider `SubExpression`
* and `PathExpression` here. It also checks to make sure that the node passed
* to `assert` has the keyword name in the right place.
*
* Note the important difference between returning `false` from `assert`,
* which just means that the node didn't match, and returning `Err`, which
* means that the node matched, but there was a keyword-specific syntax
* error.
*/
function keywords(type) {
	return new Keywords(type);
}
function toAppend({ assert, translate }) {
	return {
		assert,
		translate({ node, state }, value) {
			return translate({
				node,
				state
			}, value).mapOk((text) => new AppendTextNode({
				text,
				loc: node.loc
			}));
		}
	};
}
var CurriedTypeToReadableType = {
	[0]: "component",
	[1]: "helper",
	[2]: "modifier"
};
function assertCurryKeyword(curriedType) {
	return (node, state) => {
		let readableType = CurriedTypeToReadableType[curriedType];
		let stringsAllowed = curriedType === 0;
		let { args } = node;
		let definition = args.nth(0);
		if (definition === null) return Err(generateSyntaxError(`(${readableType}) requires a ${readableType} definition or identifier as its first positional parameter, did not receive any parameters.`, args.loc));
		if (definition.type === "Literal") {
			if (stringsAllowed && state.isStrict) return Err(generateSyntaxError(`(${readableType}) cannot resolve string values in strict mode templates`, node.loc));
			else if (!stringsAllowed) return Err(generateSyntaxError(`(${readableType}) cannot resolve string values, you must pass a ${readableType} definition directly`, node.loc));
		}
		args = new Args$1({
			positional: new PositionalArguments({
				exprs: args.positional.exprs.slice(1),
				loc: args.positional.loc
			}),
			named: args.named,
			loc: args.loc
		});
		return Ok({
			definition,
			args
		});
	};
}
function translateCurryKeyword(curriedType) {
	return ({ node, state }, { definition, args }) => {
		let definitionResult = VISIT_EXPRS.visit(definition, state);
		let argsResult = VISIT_EXPRS.Args(args, state);
		return Result.all(definitionResult, argsResult).mapOk(([definition, args]) => new Curry({
			loc: node.loc,
			curriedType,
			definition,
			args
		}));
	};
}
function curryKeyword(curriedType) {
	return {
		assert: assertCurryKeyword(curriedType),
		translate: translateCurryKeyword(curriedType)
	};
}
function assertGetDynamicVarKeyword(node) {
	let call = node.type === "AppendContent" ? node.value : node;
	let named = call.type === "Call" ? call.args.named : null;
	let positionals = call.type === "Call" ? call.args.positional : null;
	if (named && !named.isEmpty()) return Err(generateSyntaxError(`(-get-dynamic-vars) does not take any named arguments`, node.loc));
	let varName = positionals?.nth(0);
	if (!varName) return Err(generateSyntaxError(`(-get-dynamic-vars) requires a var name to get`, node.loc));
	if (positionals && positionals.size > 1) return Err(generateSyntaxError(`(-get-dynamic-vars) only receives one positional arg`, node.loc));
	return Ok(varName);
}
function translateGetDynamicVarKeyword({ node, state }, name) {
	return VISIT_EXPRS.visit(name, state).mapOk((name) => new GetDynamicVar({
		name,
		loc: node.loc
	}));
}
var getDynamicVarKeyword = {
	assert: assertGetDynamicVarKeyword,
	translate: translateGetDynamicVarKeyword
};
function assertHasBlockKeyword(type) {
	return (node) => {
		let call = node.type === "AppendContent" ? node.value : node;
		let named = call.type === "Call" ? call.args.named : null;
		let positionals = call.type === "Call" ? call.args.positional : null;
		if (named && !named.isEmpty()) return Err(generateSyntaxError(`(${type}) does not take any named arguments`, call.loc));
		if (!positionals || positionals.isEmpty()) return Ok(SourceSlice.synthetic("default"));
		else if (positionals.exprs.length === 1) {
			let positional = positionals.exprs[0];
			if (isLiteral$1(positional, "string")) return Ok(positional.toSlice());
			else return Err(generateSyntaxError(`(${type}) can only receive a string literal as its first argument`, call.loc));
		} else return Err(generateSyntaxError(`(${type}) only takes a single positional argument`, call.loc));
	};
}
function translateHasBlockKeyword(type) {
	return ({ node, state: { scope } }, target) => {
		return Ok(type === "has-block" ? new HasBlock({
			loc: node.loc,
			target,
			symbol: scope.allocateBlock(target.chars)
		}) : new HasBlockParams({
			loc: node.loc,
			target,
			symbol: scope.allocateBlock(target.chars)
		}));
	};
}
function hasBlockKeyword(type) {
	return {
		assert: assertHasBlockKeyword(type),
		translate: translateHasBlockKeyword(type)
	};
}
function assertIfUnlessInlineKeyword(type) {
	return (originalNode) => {
		let inverted = type === "unless";
		let node = originalNode.type === "AppendContent" ? originalNode.value : originalNode;
		let named = node.type === "Call" ? node.args.named : null;
		let positional = node.type === "Call" ? node.args.positional : null;
		if (named && !named.isEmpty()) return Err(generateSyntaxError(`(${type}) cannot receive named parameters, received ${named.entries.map((e) => e.name.chars).join(", ")}`, originalNode.loc));
		let condition = positional?.nth(0);
		if (!positional || !condition) return Err(generateSyntaxError(`When used inline, (${type}) requires at least two parameters 1. the condition that determines the state of the (${type}), and 2. the value to return if the condition is ${inverted ? "false" : "true"}. Did not receive any parameters`, originalNode.loc));
		let truthy = positional.nth(1);
		let falsy = positional.nth(2);
		if (truthy === null) return Err(generateSyntaxError(`When used inline, (${type}) requires at least two parameters 1. the condition that determines the state of the (${type}), and 2. the value to return if the condition is ${inverted ? "false" : "true"}. Received only one parameter, the condition`, originalNode.loc));
		if (positional.size > 3) return Err(generateSyntaxError(`When used inline, (${type}) can receive a maximum of three positional parameters 1. the condition that determines the state of the (${type}), 2. the value to return if the condition is ${inverted ? "false" : "true"}, and 3. the value to return if the condition is ${inverted ? "true" : "false"}. Received ${positional.size} parameters`, originalNode.loc));
		return Ok({
			condition,
			truthy,
			falsy
		});
	};
}
function translateIfUnlessInlineKeyword(type) {
	let inverted = type === "unless";
	return ({ node, state }, { condition, truthy, falsy }) => {
		let conditionResult = VISIT_EXPRS.visit(condition, state);
		let truthyResult = VISIT_EXPRS.visit(truthy, state);
		let falsyResult = falsy ? VISIT_EXPRS.visit(falsy, state) : Ok(null);
		return Result.all(conditionResult, truthyResult, falsyResult).mapOk(([condition, truthy, falsy]) => {
			if (inverted) condition = new Not({
				value: condition,
				loc: node.loc
			});
			return new IfInline({
				loc: node.loc,
				condition,
				truthy,
				falsy
			});
		});
	};
}
function ifUnlessInlineKeyword(type) {
	return {
		assert: assertIfUnlessInlineKeyword(type),
		translate: translateIfUnlessInlineKeyword(type)
	};
}
function assertLogKeyword(node) {
	let { args: { named, positional } } = node;
	if (named.isEmpty()) return Ok(positional);
	else return Err(generateSyntaxError(`(log) does not take any named arguments`, node.loc));
}
function translateLogKeyword({ node, state }, positional) {
	return VISIT_EXPRS.Positional(positional, state).mapOk((positional) => new Log({
		positional,
		loc: node.loc
	}));
}
var logKeyword = {
	assert: assertLogKeyword,
	translate: translateLogKeyword
};
var APPEND_KEYWORDS = keywords("Append").kw("has-block", toAppend(hasBlockKeyword("has-block"))).kw("has-block-params", toAppend(hasBlockKeyword("has-block-params"))).kw("-get-dynamic-var", toAppend(getDynamicVarKeyword)).kw("log", toAppend(logKeyword)).kw("if", toAppend(ifUnlessInlineKeyword("if"))).kw("unless", toAppend(ifUnlessInlineKeyword("unless"))).kw("yield", {
	assert(node) {
		let { args } = node;
		if (args.named.isEmpty()) return Ok({
			target: SourceSpan.synthetic("default").toSlice(),
			positional: args.positional
		});
		else {
			let target = args.named.get("to");
			if (args.named.size > 1 || target === null) return Err(generateSyntaxError(`yield only takes a single named argument: 'to'`, args.named.loc));
			if (isLiteral$1(target, "string")) return Ok({
				target: target.toSlice(),
				positional: args.positional
			});
			else return Err(generateSyntaxError(`you can only yield to a literal string value`, target.loc));
		}
	},
	translate({ node, state }, { target, positional }) {
		return VISIT_EXPRS.Positional(positional, state).mapOk((positional) => new Yield({
			loc: node.loc,
			target,
			to: state.scope.allocateBlock(target.chars),
			positional
		}));
	}
}).kw("debugger", {
	assert(node) {
		let { args } = node;
		let { positional } = args;
		if (args.isEmpty()) return Ok(void 0);
		else if (positional.isEmpty()) return Err(generateSyntaxError(`debugger does not take any named arguments`, node.loc));
		else return Err(generateSyntaxError(`debugger does not take any positional arguments`, node.loc));
	},
	translate({ node, state: { scope } }) {
		return Ok(new Debugger({
			loc: node.loc,
			scope
		}));
	}
}).kw("component", {
	assert: assertCurryKeyword(0),
	translate({ node, state }, { definition, args }) {
		let definitionResult = VISIT_EXPRS.visit(definition, state);
		let argsResult = VISIT_EXPRS.Args(args, state);
		return Result.all(definitionResult, argsResult).mapOk(([definition, args]) => new InvokeComponent({
			loc: node.loc,
			definition,
			args,
			blocks: null
		}));
	}
}).kw("helper", {
	assert: assertCurryKeyword(1),
	translate({ node, state }, { definition, args }) {
		let definitionResult = VISIT_EXPRS.visit(definition, state);
		let argsResult = VISIT_EXPRS.Args(args, state);
		return Result.all(definitionResult, argsResult).mapOk(([definition, args]) => {
			let text = new CallExpression({
				callee: definition,
				args,
				loc: node.loc
			});
			return new AppendTextNode({
				loc: node.loc,
				text
			});
		});
	}
});
var BLOCK_KEYWORDS = keywords("Block").kw("in-element", {
	assert(node) {
		let { args } = node;
		let guid = args.get("guid");
		if (guid) return Err(generateSyntaxError(`Cannot pass \`guid\` to \`{{#in-element}}\``, guid.loc));
		let insertBefore = args.get("insertBefore");
		let destination = args.nth(0);
		if (destination === null) return Err(generateSyntaxError(`{{#in-element}} requires a target element as its first positional parameter`, args.loc));
		return Ok({
			insertBefore,
			destination
		});
	},
	translate({ node, state }, { insertBefore, destination }) {
		let named = node.blocks.get("default");
		let body = VISIT_STMTS.NamedBlock(named, state);
		let destinationResult = VISIT_EXPRS.visit(destination, state);
		return Result.all(body, destinationResult).andThen(([body, destination]) => {
			if (insertBefore) return VISIT_EXPRS.visit(insertBefore, state).mapOk((insertBefore) => ({
				body,
				destination,
				insertBefore
			}));
			else return Ok({
				body,
				destination,
				insertBefore: new Missing({ loc: node.callee.loc.collapse("end") })
			});
		}).mapOk(({ body, destination, insertBefore }) => new InElement({
			loc: node.loc,
			block: body,
			insertBefore,
			guid: state.generateUniqueCursor(),
			destination
		}));
	}
}).kw("if", {
	assert(node) {
		let { args } = node;
		if (!args.named.isEmpty()) return Err(generateSyntaxError(`{{#if}} cannot receive named parameters, received ${args.named.entries.map((e) => e.name.chars).join(", ")}`, node.loc));
		if (args.positional.size > 1) return Err(generateSyntaxError(`{{#if}} can only receive one positional parameter in block form, the conditional value. Received ${args.positional.size} parameters`, node.loc));
		let condition = args.nth(0);
		if (condition === null) return Err(generateSyntaxError(`{{#if}} requires a condition as its first positional parameter, did not receive any parameters`, node.loc));
		return Ok({ condition });
	},
	translate({ node, state }, { condition }) {
		let block = node.blocks.get("default");
		let inverse = node.blocks.get("else");
		let conditionResult = VISIT_EXPRS.visit(condition, state);
		let blockResult = VISIT_STMTS.NamedBlock(block, state);
		let inverseResult = inverse ? VISIT_STMTS.NamedBlock(inverse, state) : Ok(null);
		return Result.all(conditionResult, blockResult, inverseResult).mapOk(([condition, block, inverse]) => new If({
			loc: node.loc,
			condition,
			block,
			inverse
		}));
	}
}).kw("unless", {
	assert(node) {
		let { args } = node;
		if (!args.named.isEmpty()) return Err(generateSyntaxError(`{{#unless}} cannot receive named parameters, received ${args.named.entries.map((e) => e.name.chars).join(", ")}`, node.loc));
		if (args.positional.size > 1) return Err(generateSyntaxError(`{{#unless}} can only receive one positional parameter in block form, the conditional value. Received ${args.positional.size} parameters`, node.loc));
		let condition = args.nth(0);
		if (condition === null) return Err(generateSyntaxError(`{{#unless}} requires a condition as its first positional parameter, did not receive any parameters`, node.loc));
		return Ok({ condition });
	},
	translate({ node, state }, { condition }) {
		let block = node.blocks.get("default");
		let inverse = node.blocks.get("else");
		let conditionResult = VISIT_EXPRS.visit(condition, state);
		let blockResult = VISIT_STMTS.NamedBlock(block, state);
		let inverseResult = inverse ? VISIT_STMTS.NamedBlock(inverse, state) : Ok(null);
		return Result.all(conditionResult, blockResult, inverseResult).mapOk(([condition, block, inverse]) => new If({
			loc: node.loc,
			condition: new Not({
				value: condition,
				loc: node.loc
			}),
			block,
			inverse
		}));
	}
}).kw("each", {
	assert(node) {
		let { args } = node;
		if (!args.named.entries.every((e) => e.name.chars === "key")) return Err(generateSyntaxError(`{{#each}} can only receive the 'key' named parameter, received ${args.named.entries.filter((e) => e.name.chars !== "key").map((e) => e.name.chars).join(", ")}`, args.named.loc));
		if (args.positional.size > 1) return Err(generateSyntaxError(`{{#each}} can only receive one positional parameter, the collection being iterated. Received ${args.positional.size} parameters`, args.positional.loc));
		let value = args.nth(0);
		let key = args.get("key");
		if (value === null) return Err(generateSyntaxError(`{{#each}} requires an iterable value to be passed as its first positional parameter, did not receive any parameters`, args.loc));
		return Ok({
			value,
			key
		});
	},
	translate({ node, state }, { value, key }) {
		let block = node.blocks.get("default");
		let inverse = node.blocks.get("else");
		let valueResult = VISIT_EXPRS.visit(value, state);
		let keyResult = key ? VISIT_EXPRS.visit(key, state) : Ok(null);
		let blockResult = VISIT_STMTS.NamedBlock(block, state);
		let inverseResult = inverse ? VISIT_STMTS.NamedBlock(inverse, state) : Ok(null);
		return Result.all(valueResult, keyResult, blockResult, inverseResult).mapOk(([value, key, block, inverse]) => new Each({
			loc: node.loc,
			value,
			key,
			block,
			inverse
		}));
	}
}).kw("let", {
	assert(node) {
		let { args } = node;
		if (!args.named.isEmpty()) return Err(generateSyntaxError(`{{#let}} cannot receive named parameters, received ${args.named.entries.map((e) => e.name.chars).join(", ")}`, args.named.loc));
		if (args.positional.size === 0) return Err(generateSyntaxError(`{{#let}} requires at least one value as its first positional parameter, did not receive any parameters`, args.positional.loc));
		if (node.blocks.get("else")) return Err(generateSyntaxError(`{{#let}} cannot receive an {{else}} block`, args.positional.loc));
		return Ok({ positional: args.positional });
	},
	translate({ node, state }, { positional }) {
		let block = node.blocks.get("default");
		let positionalResult = VISIT_EXPRS.Positional(positional, state);
		let blockResult = VISIT_STMTS.NamedBlock(block, state);
		return Result.all(positionalResult, blockResult).mapOk(([positional, block]) => new Let({
			loc: node.loc,
			positional,
			block
		}));
	}
}).kw("-with-dynamic-vars", {
	assert(node) {
		return Ok({ named: node.args.named });
	},
	translate({ node, state }, { named }) {
		let block = node.blocks.get("default");
		let namedResult = VISIT_EXPRS.NamedArguments(named, state);
		let blockResult = VISIT_STMTS.NamedBlock(block, state);
		return Result.all(namedResult, blockResult).mapOk(([named, block]) => new WithDynamicVars({
			loc: node.loc,
			named,
			block
		}));
	}
}).kw("component", {
	assert: assertCurryKeyword(0),
	translate({ node, state }, { definition, args }) {
		let definitionResult = VISIT_EXPRS.visit(definition, state);
		let argsResult = VISIT_EXPRS.Args(args, state);
		let blocksResult = VISIT_STMTS.NamedBlocks(node.blocks, state);
		return Result.all(definitionResult, argsResult, blocksResult).mapOk(([definition, args, blocks]) => new InvokeComponent({
			loc: node.loc,
			definition,
			args,
			blocks
		}));
	}
});
var CALL_KEYWORDS = keywords("Call").kw("has-block", hasBlockKeyword("has-block")).kw("has-block-params", hasBlockKeyword("has-block-params")).kw("-get-dynamic-var", getDynamicVarKeyword).kw("log", logKeyword).kw("if", ifUnlessInlineKeyword("if")).kw("unless", ifUnlessInlineKeyword("unless")).kw("component", curryKeyword(0)).kw("helper", curryKeyword(1)).kw("modifier", curryKeyword(2));
var MODIFIER_KEYWORDS = keywords("Modifier");
var XLINK = "http://www.w3.org/1999/xlink";
var XML = "http://www.w3.org/XML/1998/namespace";
var XMLNS = "http://www.w3.org/2000/xmlns/";
var WHITELIST = {
	"xlink:actuate": XLINK,
	"xlink:arcrole": XLINK,
	"xlink:href": XLINK,
	"xlink:role": XLINK,
	"xlink:show": XLINK,
	"xlink:title": XLINK,
	"xlink:type": XLINK,
	"xml:base": XML,
	"xml:lang": XML,
	"xml:space": XML,
	xmlns: XMLNS,
	"xmlns:xlink": XMLNS
};
function getAttrNamespace(attrName) {
	return WHITELIST[attrName];
}
var DEFLATE_TAG_TABLE = {
	div: WellKnownTagNames.div,
	span: WellKnownTagNames.span,
	p: WellKnownTagNames.p,
	a: WellKnownTagNames.a
};
function deflateTagName(tagName) {
	return DEFLATE_TAG_TABLE[tagName] ?? tagName;
}
var DEFLATE_ATTR_TABLE = {
	class: WellKnownAttrNames.class,
	id: WellKnownAttrNames.id,
	value: WellKnownAttrNames.value,
	name: WellKnownAttrNames.name,
	type: WellKnownAttrNames.type,
	style: WellKnownAttrNames.style,
	href: WellKnownAttrNames.href
};
function deflateAttrName(attrName) {
	return DEFLATE_ATTR_TABLE[attrName] ?? attrName;
}
var ClassifiedElement = class {
	delegate;
	constructor(element, delegate, state) {
		this.element = element;
		this.state = state;
		this.delegate = delegate;
	}
	toStatement() {
		return this.prepare().andThen((prepared) => this.delegate.toStatement(this, prepared));
	}
	attr(attr) {
		let name = attr.name;
		let rawValue = attr.value;
		let namespace = getAttrNamespace(name.chars) || void 0;
		if (isLiteral$1(rawValue, "string")) return Ok(new StaticAttr({
			loc: attr.loc,
			name,
			value: rawValue.toSlice(),
			namespace,
			kind: { component: this.delegate.dynamicFeatures }
		}));
		return VISIT_EXPRS.visit(convertPathToCallIfKeyword(rawValue), this.state).mapOk((value) => {
			let isTrusting = attr.trusting;
			return new DynamicAttr({
				loc: attr.loc,
				name,
				value,
				namespace,
				kind: {
					trusting: isTrusting,
					component: this.delegate.dynamicFeatures
				}
			});
		});
	}
	modifier(modifier) {
		let translated = MODIFIER_KEYWORDS.translate(modifier, this.state);
		if (translated !== null) return translated;
		let head = VISIT_EXPRS.visit(modifier.callee, this.state);
		let args = VISIT_EXPRS.Args(modifier.args, this.state);
		return Result.all(head, args).mapOk(([head, args]) => new Modifier({
			loc: modifier.loc,
			callee: head,
			args
		}));
	}
	attrs() {
		let attrs = new ResultArray();
		let args = new ResultArray();
		let typeAttr = null;
		let simple = this.element.attrs.filter((attr) => attr.type === "SplatAttr").length === 0;
		for (let attr of this.element.attrs) if (attr.type === "SplatAttr") attrs.add(Ok(new SplatAttr({
			loc: attr.loc,
			symbol: this.state.scope.allocateBlock("attrs")
		})));
		else if (attr.name.chars === "type" && simple) typeAttr = attr;
		else attrs.add(this.attr(attr));
		for (let arg of this.element.componentArgs) args.add(this.delegate.arg(arg, this));
		if (typeAttr) attrs.add(this.attr(typeAttr));
		return Result.all(args.toArray(), attrs.toArray()).mapOk(([args, attrs]) => ({
			attrs,
			args: new NamedArguments({
				loc: maybeLoc(args, SourceSpan.NON_EXISTENT),
				entries: OptionalList(args)
			})
		}));
	}
	prepare() {
		let attrs = this.attrs();
		let modifiers = new ResultArray(this.element.modifiers.map((m) => this.modifier(m))).toArray();
		return Result.all(attrs, modifiers).mapOk(([result, modifiers]) => {
			let { attrs, args } = result;
			let elementParams = [...attrs, ...modifiers];
			return {
				args,
				params: new ElementParameters({
					loc: maybeLoc(elementParams, SourceSpan.NON_EXISTENT),
					body: OptionalList(elementParams)
				})
			};
		});
	}
};
function hasDynamicFeatures({ attrs, modifiers }) {
	if (modifiers.length > 0) return true;
	return !!attrs.filter((attr) => attr.type === "SplatAttr")[0];
}
var ClassifiedComponent = class {
	dynamicFeatures = true;
	constructor(tag, element) {
		this.tag = tag;
		this.element = element;
	}
	arg(attr, { state }) {
		let name = attr.name;
		return VISIT_EXPRS.visit(convertPathToCallIfKeyword(attr.value), state).mapOk((value) => new NamedArgument({
			loc: attr.loc,
			key: name,
			value
		}));
	}
	toStatement(component, { args, params }) {
		let { element, state } = component;
		return this.blocks(state).mapOk((blocks) => new Component({
			loc: element.loc,
			tag: this.tag,
			params,
			args,
			blocks
		}));
	}
	blocks(state) {
		return VISIT_STMTS.NamedBlocks(this.element.blocks, state);
	}
};
var ClassifiedSimpleElement = class {
	constructor(tag, element, dynamicFeatures) {
		this.tag = tag;
		this.element = element;
		this.dynamicFeatures = dynamicFeatures;
	}
	isComponent = false;
	arg(attr) {
		return Err(generateSyntaxError(`${attr.name.chars} is not a valid attribute name. @arguments are only allowed on components, but the tag for this element (\`${this.tag.chars}\`) is a regular, non-component HTML element.`, attr.loc));
	}
	toStatement(classified, { params }) {
		let { state, element } = classified;
		return VISIT_STMTS.visitList(this.element.body, state).mapOk((body) => new SimpleElement({
			loc: element.loc,
			tag: this.tag,
			params,
			body: body.toArray(),
			dynamicFeatures: this.dynamicFeatures
		}));
	}
};
var NormalizationStatements = class {
	visitList(nodes, state) {
		return new ResultArray(nodes.map((e) => VISIT_STMTS.visit(e, state))).toOptionalList().mapOk((list) => list.filter((s) => s !== null));
	}
	visit(node, state) {
		switch (node.type) {
			case "GlimmerComment": return Ok(null);
			case "AppendContent": return this.AppendContent(node, state);
			case "HtmlText": return Ok(this.TextNode(node));
			case "HtmlComment": return Ok(this.HtmlComment(node));
			case "InvokeBlock": return this.InvokeBlock(node, state);
			case "InvokeComponent": return this.Component(node, state);
			case "SimpleElement": return this.SimpleElement(node, state);
		}
	}
	InvokeBlock(node, state) {
		let translated = BLOCK_KEYWORDS.translate(node, state);
		if (translated !== null) return translated;
		let head = VISIT_EXPRS.visit(node.callee, state);
		let args = VISIT_EXPRS.Args(node.args, state);
		return Result.all(head, args).andThen(([head, args]) => this.NamedBlocks(node.blocks, state).mapOk((blocks) => new InvokeBlock({
			loc: node.loc,
			head,
			args,
			blocks
		})));
	}
	NamedBlocks(blocks, state) {
		return new ResultArray(blocks.blocks.map((b) => this.NamedBlock(b, state))).toArray().mapOk((list) => new NamedBlocks({
			loc: blocks.loc,
			blocks: OptionalList(list)
		}));
	}
	NamedBlock(named, state) {
		return state.visitBlock(named.block).mapOk((body) => {
			return new NamedBlock({
				loc: named.loc,
				name: named.name,
				body: body.toArray(),
				scope: named.block.scope
			});
		});
	}
	SimpleElement(element, state) {
		return new ClassifiedElement(element, new ClassifiedSimpleElement(element.tag, element, hasDynamicFeatures(element)), state).toStatement();
	}
	Component(component, state) {
		return VISIT_EXPRS.visit(component.callee, state).andThen((callee) => new ClassifiedElement(component, new ClassifiedComponent(callee, component), state).toStatement());
	}
	AppendContent(append, state) {
		let translated = APPEND_KEYWORDS.translate(append, state);
		if (translated !== null) return translated;
		return VISIT_EXPRS.visit(append.value, state).mapOk((value) => {
			if (append.trusting) return new AppendTrustedHTML({
				loc: append.loc,
				html: value
			});
			else return new AppendTextNode({
				loc: append.loc,
				text: value
			});
		});
	}
	TextNode(text) {
		return new AppendTextNode({
			loc: text.loc,
			text: new LiteralExpression({
				loc: text.loc,
				value: text.chars
			})
		});
	}
	HtmlComment(comment) {
		return new AppendComment({
			loc: comment.loc,
			value: comment.text
		});
	}
};
var VISIT_STMTS = new NormalizationStatements();
/**
* This is the mutable state for this compiler pass.
*/
var NormalizationState = class {
	_currentScope;
	_cursorCount = 0;
	constructor(block, isStrict) {
		this.isStrict = isStrict;
		this._currentScope = block;
	}
	generateUniqueCursor() {
		return `%cursor:${this._cursorCount++}%`;
	}
	get scope() {
		return this._currentScope;
	}
	visitBlock(block) {
		let oldBlock = this._currentScope;
		this._currentScope = block.scope;
		try {
			return VISIT_STMTS.visitList(block.body, this);
		} finally {
			this._currentScope = oldBlock;
		}
	}
};
var VALUE_RESOLUTION = "value";
var COMPONENT_RESOLUTION = "component";
var HELPER_RESOLUTION = "helper";
var MODIFIER_RESOLUTION = "modifier";
var COMPONENT_OR_HELPER_RESOLUTION = "component or helper";
var StrictModeValidationPass = class {
	static validate(template) {
		return new this(template).validate();
	}
	constructor(template) {
		this.template = template;
	}
	validate() {
		return this.Statements(this.template.body).mapOk(() => this.template);
	}
	Statements(statements) {
		let result = Ok(null);
		for (let statement of statements) result = result.andThen(() => this.Statement(statement));
		return result;
	}
	NamedBlocks({ blocks }) {
		let result = Ok(null);
		for (let block of blocks.toArray()) result = result.andThen(() => this.NamedBlock(block));
		return result;
	}
	NamedBlock(block) {
		return this.Statements(block.body);
	}
	Statement(statement) {
		switch (statement.type) {
			case "InElement": return this.InElement(statement);
			case "Debugger": return Ok(null);
			case "Yield": return this.Yield(statement);
			case "AppendTrustedHTML": return this.AppendTrustedHTML(statement);
			case "AppendTextNode": return this.AppendTextNode(statement);
			case "Component": return this.Component(statement);
			case "SimpleElement": return this.SimpleElement(statement);
			case "InvokeBlock": return this.InvokeBlock(statement);
			case "AppendComment": return Ok(null);
			case "If": return this.If(statement);
			case "Each": return this.Each(statement);
			case "Let": return this.Let(statement);
			case "WithDynamicVars": return this.WithDynamicVars(statement);
			case "InvokeComponent": return this.InvokeComponent(statement);
		}
	}
	Expressions(expressions) {
		let result = Ok(null);
		for (let expression of expressions) result = result.andThen(() => this.Expression(expression));
		return result;
	}
	Expression(expression, span = expression, resolution) {
		switch (expression.type) {
			case "Literal":
			case "Keyword":
			case "Missing":
			case "This":
			case "Arg":
			case "Local":
			case "HasBlock":
			case "HasBlockParams":
			case "GetDynamicVar": return Ok(null);
			case "PathExpression": return this.Expression(expression.head, span, resolution);
			case "Free": return this.errorFor(expression.name, span, resolution);
			case "InterpolateExpression": return this.InterpolateExpression(expression, span, resolution);
			case "CallExpression": return this.CallExpression(expression, span, resolution ?? HELPER_RESOLUTION);
			case "Not": return this.Expression(expression.value, span, resolution);
			case "IfInline": return this.IfInline(expression);
			case "Curry": return this.Curry(expression);
			case "Log": return this.Log(expression);
		}
	}
	Args(args) {
		return this.Positional(args.positional).andThen(() => this.NamedArguments(args.named));
	}
	Positional(positional, span) {
		let result = Ok(null);
		let expressions = positional.list.toArray();
		if (expressions.length === 1) result = this.Expression(expressions[0], span);
		else result = this.Expressions(expressions);
		return result;
	}
	NamedArguments({ entries }) {
		let result = Ok(null);
		for (let arg of entries.toArray()) result = result.andThen(() => this.NamedArgument(arg));
		return result;
	}
	NamedArgument(arg) {
		if (arg.value.type === "CallExpression") return this.Expression(arg.value, arg, HELPER_RESOLUTION);
		else return this.Expression(arg.value, arg);
	}
	ElementParameters({ body }) {
		let result = Ok(null);
		for (let param of body.toArray()) result = result.andThen(() => this.ElementParameter(param));
		return result;
	}
	ElementParameter(param) {
		switch (param.type) {
			case "StaticAttr": return Ok(null);
			case "DynamicAttr": return this.DynamicAttr(param);
			case "Modifier": return this.Modifier(param);
			case "SplatAttr": return Ok(null);
		}
	}
	DynamicAttr(attr) {
		if (attr.value.type === "CallExpression") return this.Expression(attr.value, attr, HELPER_RESOLUTION);
		else return this.Expression(attr.value, attr);
	}
	Modifier(modifier) {
		return this.Expression(modifier.callee, modifier, MODIFIER_RESOLUTION).andThen(() => this.Args(modifier.args));
	}
	InElement(inElement) {
		return this.Expression(inElement.destination).andThen(() => this.Expression(inElement.insertBefore)).andThen(() => this.NamedBlock(inElement.block));
	}
	Yield(statement) {
		return this.Positional(statement.positional, statement);
	}
	AppendTrustedHTML(statement) {
		return this.Expression(statement.html, statement);
	}
	AppendTextNode(statement) {
		if (statement.text.type === "CallExpression") return this.Expression(statement.text, statement, COMPONENT_OR_HELPER_RESOLUTION);
		else return this.Expression(statement.text, statement);
	}
	Component(statement) {
		return this.Expression(statement.tag, statement, COMPONENT_RESOLUTION).andThen(() => this.ElementParameters(statement.params)).andThen(() => this.NamedArguments(statement.args)).andThen(() => this.NamedBlocks(statement.blocks));
	}
	SimpleElement(statement) {
		return this.ElementParameters(statement.params).andThen(() => this.Statements(statement.body));
	}
	InvokeBlock(statement) {
		return this.Expression(statement.head, statement.head, COMPONENT_RESOLUTION).andThen(() => this.Args(statement.args)).andThen(() => this.NamedBlocks(statement.blocks));
	}
	If(statement) {
		return this.Expression(statement.condition, statement).andThen(() => this.NamedBlock(statement.block)).andThen(() => {
			if (statement.inverse) return this.NamedBlock(statement.inverse);
			else return Ok(null);
		});
	}
	Each(statement) {
		return this.Expression(statement.value, statement).andThen(() => {
			if (statement.key) return this.Expression(statement.key, statement);
			else return Ok(null);
		}).andThen(() => this.NamedBlock(statement.block)).andThen(() => {
			if (statement.inverse) return this.NamedBlock(statement.inverse);
			else return Ok(null);
		});
	}
	Let(statement) {
		return this.Positional(statement.positional).andThen(() => this.NamedBlock(statement.block));
	}
	WithDynamicVars(statement) {
		return this.NamedArguments(statement.named).andThen(() => this.NamedBlock(statement.block));
	}
	InvokeComponent(statement) {
		return this.Expression(statement.definition, statement, COMPONENT_RESOLUTION).andThen(() => this.Args(statement.args)).andThen(() => {
			if (statement.blocks) return this.NamedBlocks(statement.blocks);
			else return Ok(null);
		});
	}
	InterpolateExpression(expression, span, resolution) {
		let expressions = expression.parts.toArray();
		if (expressions.length === 1) return this.Expression(expressions[0], span, resolution);
		else return this.Expressions(expressions);
	}
	CallExpression(expression, span, resolution) {
		return this.Expression(expression.callee, span, resolution).andThen(() => this.Args(expression.args));
	}
	IfInline(expression) {
		return this.Expression(expression.condition).andThen(() => this.Expression(expression.truthy)).andThen(() => {
			if (expression.falsy) return this.Expression(expression.falsy);
			else return Ok(null);
		});
	}
	Curry(expression) {
		let resolution;
		if (expression.curriedType === 0) resolution = COMPONENT_RESOLUTION;
		else if (expression.curriedType === 1) resolution = HELPER_RESOLUTION;
		else resolution = MODIFIER_RESOLUTION;
		return this.Expression(expression.definition, expression, resolution).andThen(() => this.Args(expression.args));
	}
	Log(expression) {
		return this.Positional(expression.positional, expression);
	}
	errorFor(name, span, type = VALUE_RESOLUTION) {
		return Err(generateSyntaxError(`Attempted to resolve a ${type} in a strict mode template, but that value was not in scope: ${name}`, loc(span)));
	}
};
/**
* Normalize the AST from @glimmer/syntax into the HIR. The HIR has special
* instructions for keywords like `{{yield}}`, `(has-block)` and
* `{{#in-element}}`.
*
* Most importantly, it also classifies HTML element syntax into:
*
* 1. simple HTML element (with optional splattributes)
* 2. component invocation
*
* Because the @glimmer/syntax AST gives us a string for an element's tag,
* this pass also normalizes that string into an expression.
*
* ```
* // normalized into a path expression whose head is `this` and tail is
* // `["x"]`
* <this.x />
*
* {{#let expr as |t|}}
*   // `"t"` is normalized into a variable lookup.
*   <t />
*
*   // normalized into a path expression whose head is the variable lookup
*   // `t` and tail is `["input"]`.
*   <t.input />
* {{/let}}
*
* // normalized into a free variable lookup for `SomeComponent` (with the
* // context `ComponentHead`).
* <SomeComponent />
*
* // normalized into a path expression whose head is the free variable
* // `notInScope` (with the context `Expression`), and whose tail is
* // `["SomeComponent"]`. In resolver mode, this path will be rejected later,
* // since it cannot serve as an input to the resolver.
* <notInScope.SomeComponent />
* ```
*/
function normalize(source, root, isStrict) {
	let state = new NormalizationState(root.table, isStrict);
	let template = VISIT_STMTS.visitList(root.body, state).mapOk((body) => new Template({
		loc: root.loc,
		scope: root.table,
		body: body.toArray()
	}));
	if (isStrict) template = template.andThen((template) => StrictModeValidationPass.validate(template));
	return template;
}
var ExpressionEncoder = class {
	expr(expr) {
		switch (expr.type) {
			case "Missing": return;
			case "Literal": return this.Literal(expr);
			case "Keyword": return this.Keyword(expr);
			case "CallExpression": return this.CallExpression(expr);
			case "PathExpression": return this.PathExpression(expr);
			case "Arg": return [opcodes.GetSymbol, expr.symbol];
			case "Local": return this.Local(expr);
			case "This": return [opcodes.GetSymbol, 0];
			case "Free": return [expr.resolution.resolution(), expr.symbol];
			case "HasBlock": return this.HasBlock(expr);
			case "HasBlockParams": return this.HasBlockParams(expr);
			case "Curry": return this.Curry(expr);
			case "Not": return this.Not(expr);
			case "IfInline": return this.IfInline(expr);
			case "InterpolateExpression": return this.InterpolateExpression(expr);
			case "GetDynamicVar": return this.GetDynamicVar(expr);
			case "Log": return this.Log(expr);
		}
	}
	Literal({ value }) {
		if (value === void 0) return [opcodes.Undefined];
		else return value;
	}
	Missing() {}
	HasBlock({ symbol }) {
		return [opcodes.HasBlock, [opcodes.GetSymbol, symbol]];
	}
	HasBlockParams({ symbol }) {
		return [opcodes.HasBlockParams, [opcodes.GetSymbol, symbol]];
	}
	Curry({ definition, curriedType, args }) {
		return [
			opcodes.Curry,
			EXPR.expr(definition),
			curriedType,
			EXPR.Positional(args.positional),
			EXPR.NamedArguments(args.named)
		];
	}
	Local({ isTemplateLocal, symbol }) {
		return [isTemplateLocal ? opcodes.GetLexicalSymbol : opcodes.GetSymbol, symbol];
	}
	Keyword({ symbol }) {
		return [opcodes.GetStrictKeyword, symbol];
	}
	PathExpression({ head, tail }) {
		let getOp = EXPR.expr(head);
		assert(getOp[0] !== opcodes.GetStrictKeyword);
		return [...getOp, EXPR.Tail(tail)];
	}
	InterpolateExpression({ parts }) {
		return [opcodes.Concat, parts.map((e) => EXPR.expr(e)).toArray()];
	}
	CallExpression({ callee, args }) {
		return [
			opcodes.Call,
			EXPR.expr(callee),
			...EXPR.Args(args)
		];
	}
	Tail({ members }) {
		return mapPresentArray(members, (member) => member.chars);
	}
	Args({ positional, named }) {
		return [this.Positional(positional), this.NamedArguments(named)];
	}
	Positional({ list }) {
		return list.map((l) => EXPR.expr(l)).toPresentArray();
	}
	NamedArgument({ key, value }) {
		return [key.chars, EXPR.expr(value)];
	}
	NamedArguments({ entries: pairs }) {
		let list = pairs.toArray();
		if (isPresentArray(list)) {
			let names = [];
			let values = [];
			for (let pair of list) {
				let [name, value] = EXPR.NamedArgument(pair);
				names.push(name);
				values.push(value);
			}
			return [names, values];
		} else return null;
	}
	Not({ value }) {
		return [opcodes.Not, EXPR.expr(value)];
	}
	IfInline({ condition, truthy, falsy }) {
		let expr = [
			opcodes.IfInline,
			EXPR.expr(condition),
			EXPR.expr(truthy)
		];
		if (falsy) expr.push(EXPR.expr(falsy));
		return expr;
	}
	GetDynamicVar({ name }) {
		return [opcodes.GetDynamicVar, EXPR.expr(name)];
	}
	Log({ positional }) {
		return [opcodes.Log, this.Positional(positional)];
	}
};
var EXPR = new ExpressionEncoder();
var WireStatements = class {
	constructor(statements) {
		this.statements = statements;
	}
	toArray() {
		return this.statements;
	}
};
var ContentEncoder = class {
	list(statements) {
		let out = [];
		for (let statement of statements) {
			let result = CONTENT.content(statement);
			if (result instanceof WireStatements) out.push(...result.toArray());
			else out.push(result);
		}
		return out;
	}
	content(stmt) {
		return this.visitContent(stmt);
	}
	visitContent(stmt) {
		switch (stmt.type) {
			case "Debugger": return [
				opcodes.Debugger,
				...stmt.scope.getDebugInfo(),
				{}
			];
			case "AppendComment": return this.AppendComment(stmt);
			case "AppendTextNode": return this.AppendTextNode(stmt);
			case "AppendTrustedHTML": return this.AppendTrustedHTML(stmt);
			case "Yield": return this.Yield(stmt);
			case "Component": return this.Component(stmt);
			case "SimpleElement": return this.SimpleElement(stmt);
			case "InElement": return this.InElement(stmt);
			case "InvokeBlock": return this.InvokeBlock(stmt);
			case "If": return this.If(stmt);
			case "Each": return this.Each(stmt);
			case "Let": return this.Let(stmt);
			case "WithDynamicVars": return this.WithDynamicVars(stmt);
			case "InvokeComponent": return this.InvokeComponent(stmt);
			default: return exhausted();
		}
	}
	Yield({ to, positional }) {
		return [
			opcodes.Yield,
			to,
			EXPR.Positional(positional)
		];
	}
	InElement({ guid, insertBefore, destination, block }) {
		let wireBlock = CONTENT.NamedBlock(block)[1];
		let wireDestination = EXPR.expr(destination);
		let wireInsertBefore = EXPR.expr(insertBefore);
		if (wireInsertBefore === void 0) return [
			opcodes.InElement,
			wireBlock,
			guid,
			wireDestination
		];
		else return [
			opcodes.InElement,
			wireBlock,
			guid,
			wireDestination,
			wireInsertBefore
		];
	}
	InvokeBlock({ head, args, blocks }) {
		return [
			opcodes.Block,
			EXPR.expr(head),
			...EXPR.Args(args),
			CONTENT.NamedBlocks(blocks)
		];
	}
	AppendTrustedHTML({ html }) {
		return [opcodes.TrustingAppend, EXPR.expr(html)];
	}
	AppendTextNode({ text }) {
		return [opcodes.Append, EXPR.expr(text)];
	}
	AppendComment({ value }) {
		return [opcodes.Comment, value.chars];
	}
	SimpleElement({ tag, params, body, dynamicFeatures }) {
		return new WireStatements([
			[dynamicFeatures ? opcodes.OpenElementWithSplat : opcodes.OpenElement, deflateTagName(tag.chars)],
			...CONTENT.ElementParameters(params).toArray(),
			[opcodes.FlushElement],
			...CONTENT.list(body),
			[opcodes.CloseElement]
		]);
	}
	Component({ tag, params, args, blocks }) {
		let wireTag = EXPR.expr(tag);
		let wirePositional = CONTENT.ElementParameters(params);
		let wireNamed = EXPR.NamedArguments(args);
		let wireNamedBlocks = CONTENT.NamedBlocks(blocks);
		return [
			opcodes.Component,
			wireTag,
			wirePositional.toPresentArray(),
			wireNamed,
			wireNamedBlocks
		];
	}
	ElementParameters({ body }) {
		return body.map((p) => CONTENT.ElementParameter(p));
	}
	ElementParameter(param) {
		switch (param.type) {
			case "SplatAttr": return [opcodes.AttrSplat, param.symbol];
			case "DynamicAttr": return [dynamicAttrOp(param.kind), ...dynamicAttr(param)];
			case "StaticAttr": return [staticAttrOp(param.kind), ...staticAttr(param)];
			case "Modifier": return [
				opcodes.Modifier,
				EXPR.expr(param.callee),
				...EXPR.Args(param.args)
			];
		}
	}
	NamedBlocks({ blocks }) {
		let names = [];
		let serializedBlocks = [];
		for (let block of blocks.toArray()) {
			let [name, serializedBlock] = CONTENT.NamedBlock(block);
			names.push(name);
			serializedBlocks.push(serializedBlock);
		}
		return names.length > 0 ? [names, serializedBlocks] : null;
	}
	NamedBlock({ name, body, scope }) {
		let nameChars = name.chars;
		if (nameChars === "inverse") nameChars = "else";
		return [nameChars, [CONTENT.list(body), scope.slots]];
	}
	If({ condition, block, inverse }) {
		return [
			opcodes.If,
			EXPR.expr(condition),
			CONTENT.NamedBlock(block)[1],
			inverse ? CONTENT.NamedBlock(inverse)[1] : null
		];
	}
	Each({ value, key, block, inverse }) {
		return [
			opcodes.Each,
			EXPR.expr(value),
			key ? EXPR.expr(key) : null,
			CONTENT.NamedBlock(block)[1],
			inverse ? CONTENT.NamedBlock(inverse)[1] : null
		];
	}
	Let({ positional, block }) {
		return [
			opcodes.Let,
			EXPR.Positional(positional),
			CONTENT.NamedBlock(block)[1]
		];
	}
	WithDynamicVars({ named, block }) {
		return [
			opcodes.WithDynamicVars,
			EXPR.NamedArguments(named),
			CONTENT.NamedBlock(block)[1]
		];
	}
	InvokeComponent({ definition, args, blocks }) {
		return [
			opcodes.InvokeComponent,
			EXPR.expr(definition),
			EXPR.Positional(args.positional),
			EXPR.NamedArguments(args.named),
			blocks ? CONTENT.NamedBlocks(blocks) : null
		];
	}
};
var CONTENT = new ContentEncoder();
function staticAttr({ name, value, namespace }) {
	let out = [deflateAttrName(name.chars), value.chars];
	if (namespace) out.push(namespace);
	return out;
}
function dynamicAttr({ name, value, namespace }) {
	let out = [deflateAttrName(name.chars), EXPR.expr(value)];
	if (namespace) out.push(namespace);
	return out;
}
function staticAttrOp(kind) {
	if (kind.component) return opcodes.StaticComponentAttr;
	else return opcodes.StaticAttr;
}
function dynamicAttrOp(kind) {
	if (kind.component) return kind.trusting ? opcodes.TrustingComponentAttr : opcodes.ComponentAttr;
	else return kind.trusting ? opcodes.TrustingDynamicAttr : opcodes.DynamicAttr;
}
function visit(template) {
	let statements = CONTENT.list(template.body);
	let scope = template.scope;
	return [
		statements,
		scope.symbols,
		scope.upvars
	];
}
var defaultId = (() => {
	const req = typeof module === "object" && typeof module.require === "function" ? module.require : globalThis.require;
	if (req) try {
		const crypto = req("crypto");
		const idFn = (src) => {
			const hash = crypto.createHash("sha1");
			hash.update(src, "utf8");
			return hash.digest("base64").substring(0, 8);
		};
		idFn("test");
		return idFn;
	} catch {}
	return function idFn() {
		return null;
	};
})();
var defaultOptions = { id: defaultId };
function precompileJSON(string, options = defaultOptions) {
	const source = new Source(string ?? "", options.meta?.moduleName);
	const [ast, locals] = normalize$1(source, {
		lexicalScope: () => false,
		...options
	});
	const block = normalize(source, ast, options.strictMode ?? false).mapOk((pass2In) => {
		return visit(pass2In);
	});
	if (block.isOk) return [block.value, locals];
	else throw block.reason;
}
var SCOPE_PLACEHOLDER = "796d24e6-2450-4fb0-8cdf-b65638b5ef70";
function precompile(source, options = defaultOptions) {
	const [block, usedLocals] = precompileJSON(source, options);
	const moduleName = options.meta?.moduleName;
	const idFn = options.id || defaultId;
	const blockJSON = JSON.stringify(block);
	const templateJSONObject = {
		id: idFn(JSON.stringify(options.meta) + blockJSON),
		block: blockJSON,
		moduleName: moduleName ?? "(unknown template module)",
		scope: SCOPE_PLACEHOLDER,
		isStrictMode: options.strictMode ?? false
	};
	if (usedLocals.length === 0) delete templateJSONObject.scope;
	let stringified = JSON.stringify(templateJSONObject);
	if (usedLocals.length > 0) {
		const scopeFn = `()=>({${usedLocals.map((name) => {
			if (name === "this") return `"this":this`;
			return name;
		}).join(",")}})`;
		stringified = stringified.replace(`"${SCOPE_PLACEHOLDER}"`, scopeFn);
	}
	return stringified;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/utils.js
function isPath(node) {
	return node.type === "PathExpression";
}
function isStringLiteral(node) {
	return node.type === "StringLiteral";
}
function inScope(env, name) {
	return Boolean(env.lexicalScope?.(name));
}
function getLocalName(node) {
	if (typeof node === "string") return node;
	else return node.original;
}
function trackLocals(env) {
	let locals = /* @__PURE__ */ new Map();
	let node = {
		enter(node) {
			let params = "params" in node ? node.params : node.blockParams;
			for (let param of params) {
				let name = getLocalName(param);
				let value = locals.get(param) || 0;
				locals.set(name, value + 1);
			}
		},
		exit(node) {
			let params = "params" in node ? node.params : node.blockParams;
			for (let param of params) {
				let name = getLocalName(param);
				let value = locals.get(name) - 1;
				if (value === 0) locals.delete(name);
				else locals.set(name, value);
			}
		}
	};
	return {
		hasLocal: (key) => locals.has(key) || inScope(env, key),
		node,
		visitor: {
			Template: node,
			ElementNode: node,
			Block: node
		}
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/assert-against-attrs.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that asserts against

```handlebars
{{attrs.foo.bar}}
```

...as well as `{{#if attrs.foo}}`, `{{deeply (nested attrs.foobar.baz)}}`.

@private
@class AssertAgainstAttrs
*/
function assertAgainstAttrs(env) {
	let { builders: b } = env.syntax;
	env.meta?.moduleName;
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "assert-against-attrs",
		visitor: {
			...visitor,
			PathExpression(node) {
				if (isAttrs(node, hasLocal));
				else if (isThisDotAttrs(node)) return b.path(`@${node.original.slice(11)}`, node.loc);
			}
		}
	};
}
function isAttrs(node, hasLocal) {
	return node.head.type === "VarHead" && node.head.name === "attrs" && !hasLocal(node.head.name);
}
function isThisDotAttrs(node) {
	return node.head.type === "ThisHead" && node.tail[0] === "attrs";
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/system/calculate-location-display.js
function calculateLocationDisplay(moduleName, loc) {
	let moduleInfo = "";
	if (moduleName) moduleInfo += `'${moduleName}' `;
	if (loc) {
		let { column, line } = loc.start || {
			line: void 0,
			column: void 0
		};
		if (line !== void 0 && column !== void 0) {
			if (moduleName) moduleInfo += "@ ";
			moduleInfo += `L${line}:C${column}`;
		}
	}
	if (moduleInfo) moduleInfo = `(${moduleInfo}) `;
	return moduleInfo;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/assert-against-named-outlets.js
/**
@module ember
*/
/**
Prevents usage of named outlets, a legacy concept in Ember removed in 4.0.

@private
@class AssertAgainstNamedOutlets
*/
function assertAgainstNamedOutlets(env) {
	let moduleName = env.meta?.moduleName;
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "assert-against-named-outlets",
		visitor: {
			...visitor,
			MustacheStatement(node) {
				if (node.path.type === "PathExpression" && node.path.original === "outlet" && node.params[0] && !hasLocal("outlet")) calculateLocationDisplay(moduleName, node.loc);
			}
		}
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/assert-input-helper-without-block.js
function errorOnInputWithContent(env) {
	env.meta?.moduleName;
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "assert-input-helper-without-block",
		visitor: {
			...visitor,
			BlockStatement(node) {
				if (hasLocal("input")) return;
				if (isPath(node.path) && node.path.original === "input");
			}
		}
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/assert-reserved-named-arguments.js
function assertReservedNamedArguments(env) {
	env.meta?.moduleName;
	return {
		name: "assert-reserved-named-arguments",
		visitor: {
			AttrNode({ name, loc }) {},
			HashPair({ key, loc }) {},
			PathExpression({ original, loc }) {
				if (isReserved(original));
			}
		}
	};
}
var RESERVED = [
	"@arguments",
	"@args",
	"@block",
	"@else"
];
function isReserved(name) {
	return RESERVED.indexOf(name) !== -1 || Boolean(name.match(/^@[^a-z]/));
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-action-syntax.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that replaces all instances of

```handlebars
<button {{action 'foo'}}>
<button onblur={{action 'foo'}}>
<button onblur={{action (action 'foo') 'bar'}}>
```

with

```handlebars
<button {{action this 'foo'}}>
<button onblur={{action this 'foo'}}>
<button onblur={{action this (action this 'foo') 'bar'}}>
```

@private
@class TransformActionSyntax
*/
function transformActionSyntax(env) {
	let { builders: b } = env.syntax;
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "transform-action-syntax",
		visitor: {
			...visitor,
			ElementModifierStatement(node) {
				if (isAction(node, hasLocal)) insertThisAsFirstParam(node, b);
			},
			MustacheStatement(node) {
				if (isAction(node, hasLocal)) insertThisAsFirstParam(node, b);
			},
			SubExpression(node) {
				if (isAction(node, hasLocal)) insertThisAsFirstParam(node, b);
			}
		}
	};
}
function isAction(node, hasLocal) {
	return isPath(node.path) && node.path.original === "action" && !hasLocal("action");
}
function insertThisAsFirstParam(node, builders) {
	node.params.unshift(builders.path("this"));
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-each-in-into-each.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that replaces all instances of

```handlebars
{{#each-in iterableThing as |key value|}}
```

with

```handlebars
{{#each (-each-in iterableThing) as |value key|}}
```

@private
@class TransformHasBlockSyntax
*/
function transformEachInIntoEach(env) {
	let { builders: b } = env.syntax;
	return {
		name: "transform-each-in-into-each",
		visitor: { BlockStatement(node) {
			if (isPath(node.path) && node.path.original === "each-in") {
				node.params[0] = b.sexpr(b.path("-each-in"), [node.params[0]]);
				let blockParams = node.program.blockParams;
				if (!blockParams || blockParams.length === 0);
				else if (blockParams.length === 1) blockParams = ["( unused value )", blockParams[0]];
				else {
					let key = blockParams.shift();
					blockParams = [
						blockParams.shift(),
						key,
						...blockParams
					];
				}
				node.program.blockParams = blockParams;
				return b.block(b.path("each"), node.params, node.hash, node.program, node.inverse, node.loc);
			}
		} }
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-each-track-array.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that replaces all instances of

```handlebars
{{#each iterableThing as |key value|}}
```

with

```handlebars
{{#each (-track-array iterableThing) as |key value|}}
```

@private
@class TransformHasBlockSyntax
*/
function transformEachTrackArray(env) {
	let { builders: b } = env.syntax;
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "transform-each-track-array",
		visitor: {
			...visitor,
			BlockStatement(node) {
				if (isPath(node.path) && node.path.original === "each" && !hasLocal("each")) {
					let firstParam = node.params[0];
					if (firstParam.type === "SubExpression" && firstParam.path.type === "PathExpression" && firstParam.path.original === "-each-in") return;
					node.params[0] = b.sexpr(b.path("-track-array"), [firstParam]);
					return b.block(b.path("each"), node.params, node.hash, node.program, node.inverse, node.loc);
				}
			}
		}
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-in-element.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that handles the public `{{in-element}}` as per RFC287.

Issues a build time assertion for:

```handlebars
{{#in-element someElement insertBefore="some-none-null-value"}}
{{modal-display text=text}}
{{/in-element}}
```

@private
@class TransformInElement
*/
function transformInElement(env) {
	let { builders: b } = env.syntax;
	return {
		name: "transform-in-element",
		visitor: { BlockStatement(node) {
			if (!isPath(node.path)) return;
			if (node.path.original === "in-element") {
				let originalValue = node.params[0];
				if (originalValue && !env.isProduction) {
					let subExpr = b.sexpr("-in-el-null", [originalValue]);
					node.params.shift();
					node.params.unshift(subExpr);
				}
				node.hash.pairs.forEach((pair) => {
					if (pair.key === "insertBefore");
				});
			}
		} }
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-quoted-bindings-into-just-bindings.js
function transformQuotedBindingsIntoJustBindings() {
	return {
		name: "transform-quoted-bindings-into-just-bindings",
		visitor: { ElementNode(node) {
			let styleAttr = getStyleAttr(node);
			if (!validStyleAttr(styleAttr)) return;
			styleAttr.value = styleAttr.value.parts[0];
		} }
	};
}
function validStyleAttr(attr) {
	if (!attr) return false;
	let value = attr.value;
	if (!value || value.type !== "ConcatStatement" || value.parts.length !== 1) return false;
	return value.parts[0].type === "MustacheStatement";
}
function getStyleAttr(node) {
	let attributes = node.attributes;
	for (let attribute of attributes) if (attribute.name === "style") return attribute;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-resolutions.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that replaces all instances of

```handlebars
{{helper "..." ...}}
```

with

```handlebars
{{helper (-resolve "helper:...") ...}}
```

and

```handlebars
{{helper ... ...}}
```

with

```handlebars
{{helper (-disallow-dynamic-resolution ...) ...}}
```

and

```handlebars
{{modifier "..." ...}}
```

with

```handlebars
{{modifier (-resolve "modifier:...") ...}}
```
and

```handlebars
{{modifier ... ...}}
```

with

```handlebars
{{modifier (-disallow-dynamic-resolution ...) ...}}
```

@private
@class TransformResolutions
*/
var TARGETS = Object.freeze(["helper", "modifier"]);
function transformResolutions(env) {
	let { builders: b } = env.syntax;
	let moduleName = env.meta?.moduleName;
	let { hasLocal, node: tracker } = trackLocals(env);
	let seen;
	return {
		name: "transform-resolutions",
		visitor: {
			Template: {
				enter() {
					seen = /* @__PURE__ */ new Set();
				},
				exit() {
					seen = void 0;
				}
			},
			Block: tracker,
			ElementNode: { keys: { children: tracker } },
			MustacheStatement(node) {
				if (seen.has(node)) return;
				if (isPath(node.path) && !isLocalVariable(node.path, hasLocal) && TARGETS.indexOf(node.path.original) !== -1) {
					let result = b.mustache(node.path, transformParams(b, node.params, node.path.original, moduleName, node.loc), node.hash, node.trusting, node.loc, node.strip);
					seen.add(result);
					return result;
				}
			},
			SubExpression(node) {
				if (seen.has(node)) return;
				if (isPath(node.path) && !isLocalVariable(node.path, hasLocal) && TARGETS.indexOf(node.path.original) !== -1) {
					let result = b.sexpr(node.path, transformParams(b, node.params, node.path.original, moduleName, node.loc), node.hash, node.loc);
					seen.add(result);
					return result;
				}
			}
		}
	};
}
function isLocalVariable(node, hasLocal) {
	return !(node.head.type === "ThisHead") && node.tail.length === 1 && hasLocal(node.head.original);
}
function transformParams(b, params, type, moduleName, loc) {
	let [first, ...rest] = params;
	if (isStringLiteral(first)) return [b.sexpr(b.path("-resolve", first.loc), [b.string(`${type}:${first.value}`)], void 0, first.loc), ...rest];
	else return params;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/transform-wrap-mount-and-outlet.js
/**
@module ember
*/
/**
A Glimmer2 AST transformation that replaces all instances of

```handlebars
{{mount "engine" model=this.model}}
```

with

```handlebars
{{component (-mount "engine" model=this.model)}}
```

and

```handlebars
{{outlet}}
```

with

```handlebars
{{component (-outlet)}}
```

@private
@class TransformHasBlockSyntax
*/
function transformWrapMountAndOutlet(env) {
	let { builders: b } = env.syntax;
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "transform-wrap-mount-and-outlet",
		visitor: {
			...visitor,
			MustacheStatement(node) {
				if (isPath(node.path) && (node.path.original === "mount" || node.path.original === "outlet") && !hasLocal(node.path.original)) {
					let subexpression = b.sexpr(b.path(`-${node.path.original}`), node.params, node.hash, node.loc);
					return b.mustache(b.path("component"), [subexpression], b.hash(), void 0, node.loc);
				}
			}
		}
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/auto-import-builtins.js
/**
@module ember
*/
var keywordNames = /* @__PURE__ */ new Set([
	"array",
	"eq",
	"element",
	"and",
	"fn",
	"hash",
	"neq",
	"gt",
	"gte",
	"lt",
	"lte",
	"not",
	"on",
	"or"
]);
var importSource = { on: "@ember/modifier" };
/**
A Glimmer2 AST transformation that makes importable keywords work

@private
@class TransformActionSyntax
*/
function autoImportBuiltins(env) {
	let { hasLocal, visitor } = trackLocals(env);
	return {
		name: "auto-import-built-ins",
		visitor: {
			...visitor,
			PathExpression(node) {
				if (!keywordNames.has(node.original)) return;
				if (hasLocal(node.original)) return;
				rewriteKeyword(env, node, node.original, importSource[node.original] || "@ember/helper");
			}
		}
	};
}
function rewriteKeyword(env, node, name, moduleSpecifier) {
	if (env.meta?.jsutils) node.original = env.meta.jsutils.bindImport(moduleSpecifier, name, node, { nameHint: `__keyword__${name}` });
	else if (env.meta?.emberRuntime) node.original = env.meta.emberRuntime.lookupKeyword(name);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compiler/lib/plugins/index.js
var RESOLUTION_MODE_TRANSFORMS = Object.freeze([
	transformQuotedBindingsIntoJustBindings,
	assertReservedNamedArguments,
	transformActionSyntax,
	assertAgainstAttrs,
	transformEachInIntoEach,
	errorOnInputWithContent,
	transformInElement,
	transformEachTrackArray,
	assertAgainstNamedOutlets,
	transformWrapMountAndOutlet,
	transformResolutions
]);
var STRICT_MODE_TRANSFORMS = Object.freeze([
	autoImportBuiltins,
	transformQuotedBindingsIntoJustBindings,
	assertReservedNamedArguments,
	transformActionSyntax,
	transformEachInIntoEach,
	transformInElement,
	transformEachTrackArray,
	assertAgainstNamedOutlets,
	transformWrapMountAndOutlet
]);
var STRICT_MODE_KEYWORDS = Object.freeze([
	"action",
	"mut",
	"readonly",
	"unbound",
	"-each-in",
	"-in-el-null",
	"-track-array",
	"-mount",
	"-outlet"
]);
//#endregion
export { precompile as a, build as i, STRICT_MODE_KEYWORDS as n, preprocess as o, STRICT_MODE_TRANSFORMS as r, RESOLUTION_MODE_TRANSFORMS as t };
