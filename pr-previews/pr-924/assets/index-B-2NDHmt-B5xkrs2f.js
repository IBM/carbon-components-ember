import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { n as isFactory } from "./owner-Bxxa-eff.js";
import { H as _getProp, K as isProxy, M as computed, P as defineProperty, U as get, i as Mixin, q as setProxy } from "./core-D-L0f59Y.js";
import { C as ENV } from "./observers-BmobpXAF-CkVUhhE-.js";
import { i as hasDOM, n as isCurlyManager, r as normalizeProperty } from "./curly-brand-B_F79Dep-Cbz0KMC_.js";
import { r as _getCurrentRunLoop, t as _backburner, v as schedule } from "./runloop-Dk0Nzu3h.js";
import { i as meta } from "./meta-B7F2ReUu.js";
import { l as toBool$1, o as setGlobalContext, t as getPath, u as toIterator$1 } from "./global-context-D1MXNkcp.js";
import { a as destroyChildren, c as isDestroying, i as destroy, l as registerDestructor, r as associateDestroyableChild, s as isDestroyed, t as _hasDestroyableChildren } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, E as isTracking, O as track, _ as consumeTag, a as CURRENT_TAG, g as combine, j as valueForTag, l as UPDATE_TAG, p as beginTrackFrame, s as DIRTY_TAG, x as endTrackFrame, y as createTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, r as tagMetaFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { c as tagForObject, l as tagForProperty, s as objectAt, u as isObject } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
import { a as expect, f as unwrap, l as isIndexable$1, t as StackImpl } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { S as valueForRef, _ as createUnboundRef, a as NULL_REFERENCE, b as isUpdatableRef, c as UNDEFINED_REFERENCE, d as createComputeRef, f as createConstRef, g as createReadOnlyRef, h as createPrimitiveRef, i as FALSE_REFERENCE, l as childRefFor, m as createInvokableRef, o as REFERENCE, p as createDebugAliasRef, r as setCustomTagFor, s as TRUE_REFERENCE, u as childRefFromParts, v as isConstRef, x as updateRef, y as isInvokableRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { t as isEmberArray } from "./-internals-CsfECqDC.js";
import { n as set, t as _setProp } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { n as dasherize } from "./string-BUAsQ27l.js";
import { t as isArray } from "./is-array-DKkHuyBq.js";
import { a as InternalComponentCapabilities, i as managerHasCapability, n as capabilityFlagsFrom, o as MACHINE_MASK } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
import { f as setInternalHelperManager, i as getInternalModifierManager, n as getInternalComponentManager, o as hasInternalComponentManager, r as getInternalHelperManager, s as hasInternalHelperManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { c as isLowLevelRegister, n as decodeHandle, t as constants } from "./syscall-ops-CkPT1Kfx-C_CJ523J.js";
import { t as setLocalDebugType } from "./debug-brand-B1TWjOCH-CWncGHWi.js";
import { a as assert, f as reverse, o as EMPTY_ARRAY, t as assign, u as enumerate } from "./object-utils-AijlD-JH-xdA72BiZ.js";
import { A as move, C as CursorImpl, D as isNode, E as isFragment, M as shouldCoerce, N as unwrapHandle, O as isSafeString, P as unwrapTemplate, S as ConcreteBounds, T as isEmpty, _ as isCurriedType, a as DebugRenderTreeImpl, b as reifyPositional, d as VMArgumentsImpl, f as check, g as isArgumentError, h as externs, j as normalizeStringValue, k as isString, l as EndTrackFrameOpcode, m as curry, n as AssertFilter, r as BeginTrackFrameOpcode, t as APPEND_OPCODES, u as JumpIfNotModifiedOpcode, w as clear, x as resolveCurriedValue } from "./arguments-Carzx7C4-snfB_1Hj.js";
import { t as castToBrowser } from "./simple-cast-DCvJLSin-HQ2D6hQ-.js";
import { a as encodeOp, c as templateFactory, i as SwitchCases, l as ContentType, n as EncoderImpl, o as invokePreparedComponent, r as InvokeBareComponent, t as CallDynamic } from "./index-kwuZeaNz-Cy7yDahE.js";
import { t as _instrumentStart } from "./instrumentation-l8O8qirj.js";
import { t as opcodes } from "./opcodes-DDajoGhq-DNWK19V4.js";
import { i as hash, n as array, r as fn, t as internalHelper } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
import { i as get$1, r as concat, t as uniqueId } from "./unique-id-BJb1p8EG-CAigDLyj.js";
import { t as on } from "./on-B-5KCq9L-Cm8Anmha.js";
import { i as templateOnlyComponent, t as TEMPLATE_ONLY_COMPONENT_MANAGER } from "./template-only-DKNcKM5b-AnYZzp1D.js";
import { t as getComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { i as isHTMLSafe } from "./index-D-xTBV4B-DG7EnZE6.js";
import { n as isClassicHelper } from "./helper-brand-C9_8vvOf-C_B2ufRK.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/program-BAh__OXZ.js
var RuntimeOpImpl = class {
	offset = 0;
	constructor(heap) {
		this.heap = heap;
	}
	get size() {
		return ((this.heap.getbyaddr(this.offset) & 768) >> 8) + 1;
	}
	get isMachine() {
		return this.heap.getbyaddr(this.offset) & 1024 ? 1 : 0;
	}
	get type() {
		return this.heap.getbyaddr(this.offset) & 255;
	}
	get op1() {
		return this.heap.getbyaddr(this.offset + 1);
	}
	get op2() {
		return this.heap.getbyaddr(this.offset + 2);
	}
	get op3() {
		return this.heap.getbyaddr(this.offset + 3);
	}
};
var ALLOCATED = 0;
var FREED = 1;
var PURGED = 2;
var POINTER = 3;
var PAGE_SIZE = 1048576;
/**
* The Program Heap is responsible for dynamically allocating
* memory in which we read/write the VM's instructions
* from/to. When we malloc we pass out a VMHandle, which
* is used as an indirect way of accessing the memory during
* execution of the VM. Internally we track the different
* regions of the memory in an int array known as the table.
*
* The table 32-bit aligned and has the following layout:
*
* | ... | hp (u32) |       info (u32)   | size (u32) |
* | ... |  Handle  | Scope Size | State | Size       |
* | ... | 32bits   | 30bits     | 2bits | 32bit      |
*
* With this information we effectively have the ability to
* control when we want to free memory. That being said you
* can not free during execution as raw address are only
* valid during the execution. This means you cannot close
* over them as you will have a bad memory access exception.
*/
var ProgramHeapImpl = class {
	offset = 0;
	heap;
	handleTable;
	handleState;
	constructor() {
		this.heap = new Int32Array(PAGE_SIZE);
		this.handleTable = [];
		this.handleState = [];
	}
	entries() {
		return this.offset;
	}
	pushRaw(value) {
		this.sizeCheck();
		this.heap[this.offset++] = value;
	}
	pushOp(item) {
		this.pushRaw(item);
	}
	pushMachine(item) {
		this.pushRaw(item | MACHINE_MASK);
	}
	sizeCheck() {
		let { heap } = this;
		if (this.offset === this.heap.length) {
			let newHeap = new Int32Array(heap.length + PAGE_SIZE);
			newHeap.set(heap, 0);
			this.heap = newHeap;
		}
	}
	getbyaddr(address) {
		return unwrap(this.heap[address]);
	}
	setbyaddr(address, value) {
		this.heap[address] = value;
	}
	malloc() {
		this.handleTable.push(this.offset);
		return this.handleTable.length - 1;
	}
	finishMalloc(handle) {}
	size() {
		return this.offset;
	}
	getaddr(handle) {
		return unwrap(this.handleTable[handle]);
	}
	sizeof(handle) {
		return sizeof(this.handleTable);
	}
	free(handle) {
		this.handleState[handle] = FREED;
	}
	/**
	* The heap uses the [Mark-Compact Algorithm](https://en.wikipedia.org/wiki/Mark-compact_algorithm) to shift
	* reachable memory to the bottom of the heap and freeable
	* memory to the top of the heap. When we have shifted all
	* the reachable memory to the top of the heap, we move the
	* offset to the next free position.
	*/
	compact() {
		let compactedSize = 0;
		let { handleTable, handleState, heap } = this;
		for (let i = 0; i < length; i++) {
			let offset = unwrap(handleTable[i]);
			let size = unwrap(handleTable[i + 1]) - unwrap(offset);
			let state = handleState[i];
			if (state === PURGED) continue;
			else if (state === FREED) {
				handleState[i] = PURGED;
				compactedSize += size;
			} else if (state === ALLOCATED) {
				for (let j = offset; j <= i + size; j++) heap[j - compactedSize] = unwrap(heap[j]);
				handleTable[i] = offset - compactedSize;
			} else if (state === POINTER) handleTable[i] = offset - compactedSize;
		}
		this.offset = this.offset - compactedSize;
	}
};
var ProgramImpl = class {
	_opcode;
	constructor(constants, heap) {
		this.constants = constants;
		this.heap = heap;
		this._opcode = new RuntimeOpImpl(this.heap);
	}
	opcode(offset) {
		this._opcode.offset = offset;
		return this._opcode;
	}
};
function sizeof(table, handle) {
	return -1;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/api-DzOa0Acr.js
var NS_MATHML = "http://www.w3.org/1998/Math/MathML";
var NS_SVG = "http://www.w3.org/2000/svg";
var INSERT_BEFORE_BEGIN = "beforebegin";
var INSERT_BEFORE_END = "beforeend";
var badProtocols = ["javascript:", "vbscript:"];
var badTags = [
	"A",
	"AREA",
	"BODY",
	"LINK",
	"IMG",
	"IFRAME",
	"BASE",
	"FORM",
	"BUTTON",
	"INPUT"
];
var badTagsForDataURI = ["EMBED"];
var badTagsForDataProtocol = ["IFRAME", "OBJECT"];
var badAttributes = [
	"href",
	"src",
	"background",
	"action",
	"formaction",
	"xlink:href"
];
var badAttributesForDataURI = ["src"];
var badAttributesForDataProtocol = ["src", "data"];
function has(array, item) {
	return array.indexOf(item) !== -1;
}
function checkURI(tagName, attribute) {
	return (tagName === null || has(badTags, tagName.toUpperCase())) && has(badAttributes, attribute.toLowerCase());
}
function checkDataURI(tagName, attribute) {
	if (tagName === null) return false;
	return has(badTagsForDataURI, tagName.toUpperCase()) && has(badAttributesForDataURI, attribute.toLowerCase());
}
function checkDataProtocol(tagName, attribute) {
	if (tagName === null) return false;
	return has(badTagsForDataProtocol, tagName.toUpperCase()) && has(badAttributesForDataProtocol, attribute.toLowerCase());
}
function requiresSanitization(tagName, attribute) {
	return checkURI(tagName, attribute) || checkDataURI(tagName, attribute) || checkDataProtocol(tagName, attribute);
}
function findProtocolForURL() {
	const weirdURL = URL;
	if (typeof weirdURL === "object" && weirdURL !== null && typeof weirdURL.parse === "function") {
		let nodeURL = weirdURL;
		return (url) => {
			let protocol = null;
			if (typeof url === "string") protocol = nodeURL.parse(url.replace(/[\t\n\r]/gu, "")).protocol;
			return protocol === null ? ":" : protocol;
		};
	} else if (typeof weirdURL === "function") return (_url) => {
		try {
			return new weirdURL(_url).protocol;
		} catch {
			return ":";
		}
	};
	else throw new Error(`@glimmer/runtime needs a valid "globalThis.URL"`);
}
var _protocolForUrlImplementation;
function protocolForUrl(url) {
	if (!_protocolForUrlImplementation) _protocolForUrlImplementation = findProtocolForURL();
	return _protocolForUrlImplementation(url);
}
function sanitizeAttributeValue(element, attribute, value) {
	if (value === null || value === void 0) return value;
	if (isSafeString(value)) return value.toHTML();
	const tagName = element.tagName;
	let str = normalizeStringValue(value);
	if (checkURI(tagName, attribute)) {
		if (has(badProtocols, protocolForUrl(str))) return `unsafe:${str}`;
	}
	if (checkDataProtocol(tagName, attribute)) {
		let protocol = protocolForUrl(str);
		if (protocol === "data:" || has(badProtocols, protocol)) return `unsafe:${str}`;
	}
	if (checkDataURI(tagName, attribute)) return `unsafe:${str}`;
	return str;
}
function dynamicAttribute(element, attr, namespace, isTrusting = false) {
	const { tagName, namespaceURI } = element;
	const attribute = {
		element,
		name: attr,
		namespace
	};
	if (namespaceURI === "http://www.w3.org/2000/svg") return buildDynamicAttribute(tagName, attr, attribute);
	const { type, normalized } = normalizeProperty(element, attr);
	if (type === "attr") return buildDynamicAttribute(tagName, normalized, attribute);
	else return buildDynamicProperty(tagName, normalized, attribute);
}
function buildDynamicAttribute(tagName, name, attribute) {
	if (requiresSanitization(tagName, name)) return new SafeDynamicAttribute(attribute);
	else return new SimpleDynamicAttribute(attribute);
}
function buildDynamicProperty(tagName, name, attribute) {
	if (requiresSanitization(tagName, name)) return new SafeDynamicProperty(name, attribute);
	if (isUserInputValue(tagName, name)) return new InputValueDynamicAttribute(name, attribute);
	if (isOptionSelected(tagName, name)) return new OptionSelectedDynamicAttribute(name, attribute);
	return new DefaultDynamicProperty(name, attribute);
}
var DynamicAttribute = class {
	constructor(attribute) {
		this.attribute = attribute;
	}
};
var SimpleDynamicAttribute = class extends DynamicAttribute {
	set(dom, value, _env) {
		const normalizedValue = normalizeValue(value);
		if (normalizedValue !== null) {
			const { name, namespace } = this.attribute;
			dom.__setAttribute(name, normalizedValue, namespace);
		}
	}
	update(value, _env) {
		const normalizedValue = normalizeValue(value);
		const { element, name } = this.attribute;
		if (normalizedValue === null) element.removeAttribute(name);
		else element.setAttribute(name, normalizedValue);
	}
};
var DefaultDynamicProperty = class extends DynamicAttribute {
	constructor(normalizedName, attribute) {
		super(attribute);
		this.normalizedName = normalizedName;
	}
	value;
	set(dom, value, _env) {
		if (value !== null && value !== void 0) {
			this.value = value;
			dom.__setProperty(this.normalizedName, value);
		}
	}
	update(value, _env) {
		const { element } = this.attribute;
		if (this.value !== value) {
			element[this.normalizedName] = this.value = value;
			if (value === null || value === void 0) this.removeAttribute();
		}
	}
	removeAttribute() {
		const { element, namespace } = this.attribute;
		if (namespace) element.removeAttributeNS(namespace, this.normalizedName);
		else element.removeAttribute(this.normalizedName);
	}
};
var SafeDynamicProperty = class extends DefaultDynamicProperty {
	set(dom, value, env) {
		const { element, name } = this.attribute;
		const sanitized = sanitizeAttributeValue(element, name, value);
		super.set(dom, sanitized, env);
	}
	update(value, env) {
		const { element, name } = this.attribute;
		const sanitized = sanitizeAttributeValue(element, name, value);
		super.update(sanitized, env);
	}
};
var SafeDynamicAttribute = class extends SimpleDynamicAttribute {
	set(dom, value, env) {
		const { element, name } = this.attribute;
		const sanitized = sanitizeAttributeValue(element, name, value);
		super.set(dom, sanitized, env);
	}
	update(value, env) {
		const { element, name } = this.attribute;
		const sanitized = sanitizeAttributeValue(element, name, value);
		super.update(sanitized, env);
	}
};
var InputValueDynamicAttribute = class extends DefaultDynamicProperty {
	set(dom, value) {
		const normalized = normalizeStringValue(value);
		dom.__setProperty("value", normalized);
		if (value === "" && this.attribute.element.tagName === "INPUT") dom.__setAttribute("value", "", null);
	}
	update(value) {
		const input = castToBrowser(this.attribute.element);
		const currentValue = input.value;
		const normalizedValue = normalizeStringValue(value);
		if (currentValue !== normalizedValue) input.value = normalizedValue;
	}
};
var OptionSelectedDynamicAttribute = class extends DefaultDynamicProperty {
	set(dom, value) {
		if (value !== null && value !== void 0 && value !== false) dom.__setProperty("selected", true);
	}
	update(value) {
		const option = castToBrowser(this.attribute.element);
		if (value) option.selected = true;
		else option.selected = false;
	}
};
function isOptionSelected(tagName, attribute) {
	return tagName === "OPTION" && attribute === "selected";
}
function isUserInputValue(tagName, attribute) {
	return (tagName === "INPUT" || tagName === "TEXTAREA") && attribute === "value";
}
function normalizeValue(value) {
	if (value === false || value === void 0 || value === null || typeof value.toString === "undefined") return null;
	if (value === true) return "";
	if (typeof value === "function") return null;
	return String(value);
}
var First = class {
	constructor(node) {
		this.node = node;
	}
	firstNode() {
		return this.node;
	}
};
var Last = class {
	constructor(node) {
		this.node = node;
	}
	lastNode() {
		return this.node;
	}
};
var NewTreeBuilder = class {
	dom;
	updateOperations;
	constructing = null;
	operations = null;
	env;
	cursors = new StackImpl();
	modifierStack = new StackImpl();
	blockStack = new StackImpl();
	static forInitialRender(env, cursor) {
		return new this(env, cursor.element, cursor.nextSibling).initialize();
	}
	static resume(env, block) {
		let parentNode = block.parentElement();
		let nextSibling = block.reset(env);
		let stack = new this(env, parentNode, nextSibling).initialize();
		stack.pushBlock(block);
		return stack;
	}
	constructor(env, parentNode, nextSibling) {
		this.pushElement(parentNode, nextSibling);
		this.env = env;
		this.dom = env.getAppendOperations();
		this.updateOperations = env.getDOM();
	}
	initialize() {
		this.pushAppendingBlock();
		return this;
	}
	debugBlocks() {
		return this.blockStack.toArray();
	}
	get element() {
		return this.cursors.current.element;
	}
	get nextSibling() {
		return this.cursors.current.nextSibling;
	}
	get hasBlocks() {
		return this.blockStack.size > 0;
	}
	block() {
		return expect(this.blockStack.current);
	}
	popElement() {
		this.cursors.pop();
		expect(this.cursors.current);
	}
	pushAppendingBlock() {
		return this.pushBlock(new AppendingBlockImpl(this.element));
	}
	pushResettableBlock() {
		return this.pushBlock(new ResettableBlockImpl(this.element));
	}
	pushBlockList(list) {
		return this.pushBlock(new AppendingBlockList(this.element, list));
	}
	pushBlock(block, isRemote = false) {
		let current = this.blockStack.current;
		if (current !== null) {
			if (!isRemote) current.didAppendBounds(block);
		}
		this.__openBlock();
		this.blockStack.push(block);
		return block;
	}
	popBlock() {
		this.block().finalize(this);
		this.__closeBlock();
		return expect(this.blockStack.pop());
	}
	__openBlock() {}
	__closeBlock() {}
	openElement(tag) {
		let element = this.__openElement(tag);
		this.constructing = element;
		return element;
	}
	__openElement(tag) {
		return this.dom.createElement(tag, this.element);
	}
	flushElement(modifiers) {
		let parent = this.element;
		let element = expect(this.constructing);
		this.__flushElement(parent, element);
		this.constructing = null;
		this.operations = null;
		this.pushModifiers(modifiers);
		this.pushElement(element, null);
		this.didOpenElement(element);
	}
	__flushElement(parent, constructing) {
		this.dom.insertBefore(parent, constructing, this.nextSibling);
	}
	closeElement() {
		this.willCloseElement();
		this.popElement();
		return this.popModifiers();
	}
	pushRemoteElement(element, guid, insertBefore) {
		return this.__pushRemoteElement(element, guid, insertBefore);
	}
	__pushRemoteElement(element, _guid, insertBefore) {
		this.pushElement(element, insertBefore);
		if (insertBefore === void 0) while (element.lastChild) element.removeChild(element.lastChild);
		let block = new RemoteBlock(element);
		return this.pushBlock(block, true);
	}
	popRemoteElement() {
		const block = this.popBlock();
		this.popElement();
		return block;
	}
	pushElement(element, nextSibling = null) {
		this.cursors.push(new CursorImpl(element, nextSibling));
	}
	pushModifiers(modifiers) {
		this.modifierStack.push(modifiers);
	}
	popModifiers() {
		return this.modifierStack.pop();
	}
	didAppendBounds(bounds) {
		this.block().didAppendBounds(bounds);
		return bounds;
	}
	didAppendNode(node) {
		this.block().didAppendNode(node);
		return node;
	}
	didOpenElement(element) {
		this.block().openElement(element);
		return element;
	}
	willCloseElement() {
		this.block().closeElement();
	}
	appendText(string) {
		return this.didAppendNode(this.__appendText(string));
	}
	__appendText(text) {
		let { dom, element, nextSibling } = this;
		let node = dom.createTextNode(text);
		dom.insertBefore(element, node, nextSibling);
		return node;
	}
	__appendNode(node) {
		this.dom.insertBefore(this.element, node, this.nextSibling);
		return node;
	}
	__appendFragment(fragment) {
		let first = fragment.firstChild;
		if (first) {
			let ret = new ConcreteBounds(this.element, first, fragment.lastChild);
			this.dom.insertBefore(this.element, fragment, this.nextSibling);
			return ret;
		} else {
			const comment = this.__appendComment("");
			return new ConcreteBounds(this.element, comment, comment);
		}
	}
	__appendHTML(html) {
		return this.dom.insertHTMLBefore(this.element, this.nextSibling, html);
	}
	appendDynamicHTML(value) {
		let bounds = this.trustedContent(value);
		this.didAppendBounds(bounds);
	}
	appendDynamicText(value) {
		let node = this.untrustedContent(value);
		this.didAppendNode(node);
		return node;
	}
	appendDynamicFragment(value) {
		let bounds = this.__appendFragment(value);
		this.didAppendBounds(bounds);
	}
	appendDynamicNode(value) {
		let node = this.__appendNode(value);
		let bounds = new ConcreteBounds(this.element, node, node);
		this.didAppendBounds(bounds);
	}
	trustedContent(value) {
		return this.__appendHTML(value);
	}
	untrustedContent(value) {
		return this.__appendText(value);
	}
	appendComment(string) {
		return this.didAppendNode(this.__appendComment(string));
	}
	__appendComment(string) {
		let { dom, element, nextSibling } = this;
		let node = dom.createComment(string);
		dom.insertBefore(element, node, nextSibling);
		return node;
	}
	__setAttribute(name, value, namespace) {
		this.dom.setAttribute(this.constructing, name, value, namespace);
	}
	__setProperty(name, value) {
		this.constructing[name] = value;
	}
	setStaticAttribute(name, value, namespace) {
		this.__setAttribute(name, value, namespace);
	}
	setDynamicAttribute(name, value, trusting, namespace) {
		let element = this.constructing;
		let attribute = dynamicAttribute(element, name, namespace, trusting);
		attribute.set(this, value, this.env);
		return attribute;
	}
};
var AppendingBlockImpl = class {
	first = null;
	last = null;
	nesting = 0;
	constructor(parent) {
		this.parent = parent;
		setLocalDebugType("block:simple", this);
	}
	parentElement() {
		return this.parent;
	}
	firstNode() {
		return expect(this.first).firstNode();
	}
	lastNode() {
		return expect(this.last).lastNode();
	}
	openElement(element) {
		this.didAppendNode(element);
		this.nesting++;
	}
	closeElement() {
		this.nesting--;
	}
	didAppendNode(node) {
		if (this.nesting !== 0) return;
		if (!this.first) this.first = new First(node);
		this.last = new Last(node);
	}
	didAppendBounds(bounds) {
		if (this.nesting !== 0) return;
		if (!this.first) this.first = bounds;
		this.last = bounds;
	}
	finalize(stack) {
		if (this.first === null) stack.appendComment("");
	}
};
var RemoteBlock = class extends AppendingBlockImpl {
	constructor(parent) {
		super(parent);
		setLocalDebugType("block:remote", this);
		registerDestructor(this, () => {
			if (this.parentElement() === this.firstNode().parentNode) clear(this);
		});
	}
};
var ResettableBlockImpl = class extends AppendingBlockImpl {
	constructor(parent) {
		super(parent);
		setLocalDebugType("block:resettable", this);
	}
	reset() {
		destroy(this);
		let nextSibling = clear(this);
		this.first = null;
		this.last = null;
		this.nesting = 0;
		return nextSibling;
	}
};
var AppendingBlockList = class {
	constructor(parent, boundList) {
		this.parent = parent;
		this.boundList = boundList;
		this.parent = parent;
		this.boundList = boundList;
	}
	parentElement() {
		return this.parent;
	}
	firstNode() {
		return expect(this.boundList[0]).firstNode();
	}
	lastNode() {
		let boundList = this.boundList;
		return expect(boundList[boundList.length - 1]).lastNode();
	}
	openElement(_element) {}
	closeElement() {}
	didAppendNode(_node) {}
	didAppendBounds(_bounds) {}
	finalize(_stack) {
		assert(this.boundList.length > 0);
	}
};
function clientBuilder(env, cursor) {
	return NewTreeBuilder.forInitialRender(env, cursor);
}
var SVG_INTEGRATION_POINTS = {
	foreignObject: 1,
	desc: 1,
	title: 1
};
var BLACKLIST_TABLE = Object.create(null);
var DOMOperations = class {
	constructor(document) {
		this.document = document;
		this.setupUselessElement();
	}
	setupUselessElement() {
		this.uselessElement = this.document.createElement("div");
	}
	createElement(tag, context) {
		let isElementInSVGNamespace, isHTMLIntegrationPoint, isElementInMathMlNamespace, ns;
		if (context) {
			isElementInSVGNamespace = context.namespaceURI === "http://www.w3.org/2000/svg" || tag === "svg";
			isElementInMathMlNamespace = context.namespaceURI === NS_MATHML || tag === "math";
			isHTMLIntegrationPoint = !!SVG_INTEGRATION_POINTS[context.tagName];
		} else {
			isElementInSVGNamespace = tag === "svg";
			isElementInMathMlNamespace = tag === "math";
			isHTMLIntegrationPoint = false;
		}
		if ((isElementInMathMlNamespace || isElementInSVGNamespace) && !isHTMLIntegrationPoint) {
			if (BLACKLIST_TABLE[tag]) throw new Error(`Cannot create a ${tag} inside an SVG context`);
			if (isElementInMathMlNamespace) ns = NS_MATHML;
			else ns = NS_SVG;
			return this.document.createElementNS(ns, tag);
		} else return this.document.createElement(tag);
	}
	insertBefore(parent, node, reference) {
		parent.insertBefore(node, reference);
	}
	insertHTMLBefore(parent, nextSibling, html) {
		if (html === "") {
			const comment = this.createComment("");
			parent.insertBefore(comment, nextSibling);
			return new ConcreteBounds(parent, comment, comment);
		}
		const prev = nextSibling ? nextSibling.previousSibling : parent.lastChild;
		let last;
		if (nextSibling === null) {
			parent.insertAdjacentHTML(INSERT_BEFORE_END, html);
			last = expect(parent.lastChild);
		} else if (nextSibling instanceof HTMLElement) {
			nextSibling.insertAdjacentHTML("beforebegin", html);
			last = expect(nextSibling.previousSibling);
		} else {
			const { uselessElement } = this;
			parent.insertBefore(uselessElement, nextSibling);
			uselessElement.insertAdjacentHTML(INSERT_BEFORE_BEGIN, html);
			last = expect(uselessElement.previousSibling);
			parent.removeChild(uselessElement);
		}
		const first = expect(prev ? prev.nextSibling : parent.firstChild);
		return new ConcreteBounds(parent, first, last);
	}
	createTextNode(text) {
		return this.document.createTextNode(text);
	}
	createComment(data) {
		return this.document.createComment(data);
	}
};
var TreeConstruction = class extends DOMOperations {
	createElementNS(namespace, tag) {
		return this.document.createElementNS(namespace, tag);
	}
	setAttribute(element, name, value, namespace = null) {
		if (namespace) element.setAttributeNS(namespace, name, value);
		else element.setAttribute(name, value);
	}
};
var DOMTreeConstruction = TreeConstruction;
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/reference/index.js
var reference_exports = /* @__PURE__ */ __exportAll({
	FALSE_REFERENCE: () => FALSE_REFERENCE,
	NULL_REFERENCE: () => NULL_REFERENCE,
	REFERENCE: () => REFERENCE,
	TRUE_REFERENCE: () => TRUE_REFERENCE,
	UNDEFINED_REFERENCE: () => UNDEFINED_REFERENCE,
	childRefFor: () => childRefFor,
	childRefFromParts: () => childRefFromParts,
	createComputeRef: () => createComputeRef,
	createConstRef: () => createConstRef,
	createDebugAliasRef: () => createDebugAliasRef,
	createInvokableRef: () => createInvokableRef,
	createIteratorItemRef: () => createIteratorItemRef,
	createIteratorRef: () => createIteratorRef,
	createPrimitiveRef: () => createPrimitiveRef,
	createReadOnlyRef: () => createReadOnlyRef,
	createUnboundRef: () => createUnboundRef,
	isConstRef: () => isConstRef,
	isInvokableRef: () => isInvokableRef,
	isUpdatableRef: () => isUpdatableRef,
	updateRef: () => updateRef,
	valueForRef: () => valueForRef
});
var NULL_IDENTITY = {};
var KEY = (_, index) => index;
var INDEX = (_, index) => String(index);
var IDENTITY = (item) => {
	if (item === null) return NULL_IDENTITY;
	return item;
};
function keyForPath(path) {
	return uniqueKeyFor((item) => {
		if (item === null || item === void 0) return item;
		return getPath(item, path);
	});
}
function makeKeyFor(key) {
	switch (key) {
		case "@key": return uniqueKeyFor(KEY);
		case "@index": return uniqueKeyFor(INDEX);
		case "@identity": return uniqueKeyFor(IDENTITY);
		default: return keyForPath(key);
	}
}
var WeakMapWithPrimitives = class {
	_weakMap;
	_primitiveMap;
	get weakMap() {
		if (this._weakMap === void 0) this._weakMap = /* @__PURE__ */ new WeakMap();
		return this._weakMap;
	}
	get primitiveMap() {
		if (this._primitiveMap === void 0) this._primitiveMap = /* @__PURE__ */ new Map();
		return this._primitiveMap;
	}
	set(key, value) {
		if (isIndexable$1(key)) this.weakMap.set(key, value);
		else this.primitiveMap.set(key, value);
	}
	get(key) {
		if (isIndexable$1(key)) return this.weakMap.get(key);
		else return this.primitiveMap.get(key);
	}
};
var IDENTITIES = new WeakMapWithPrimitives();
function identityForNthOccurence(value, count) {
	let identities = IDENTITIES.get(value);
	if (identities === void 0) {
		identities = [];
		IDENTITIES.set(value, identities);
	}
	let identity = identities[count];
	if (identity === void 0) {
		identity = {
			value,
			count
		};
		identities[count] = identity;
	}
	return identity;
}
/**
* When iterating over a list, it's possible that an item with the same unique
* key could be encountered twice:
*
* ```js
* let arr = ['same', 'different', 'same', 'same'];
* ```
*
* In general, we want to treat these items as _unique within the list_. To do
* this, we track the occurences of every item as we iterate the list, and when
* an item occurs more than once, we generate a new unique key just for that
* item, and that occurence within the list. The next time we iterate the list,
* and encounter an item for the nth time, we can get the _same_ key, and let
* Glimmer know that it should reuse the DOM for the previous nth occurence.
*/
function uniqueKeyFor(keyFor) {
	let seen = new WeakMapWithPrimitives();
	return (value, memo) => {
		let key = keyFor(value, memo);
		let count = seen.get(key) || 0;
		seen.set(key, count + 1);
		if (count === 0) return key;
		return identityForNthOccurence(key, count);
	};
}
function createIteratorRef(listRef, key) {
	return createComputeRef(() => {
		let iterable = valueForRef(listRef);
		let keyFor = makeKeyFor(key);
		if (Array.isArray(iterable)) return new ArrayIterator$1(iterable, keyFor);
		let maybeIterator = toIterator$1(iterable);
		if (maybeIterator === null) return new ArrayIterator$1(EMPTY_ARRAY, () => null);
		return new IteratorWrapper(maybeIterator, keyFor);
	});
}
function createIteratorItemRef(_value) {
	let value = _value;
	let tag = createTag();
	return createComputeRef(() => {
		consumeTag(tag);
		return value;
	}, (newValue) => {
		if (value !== newValue) {
			value = newValue;
			DIRTY_TAG(tag);
		}
	});
}
var IteratorWrapper = class {
	constructor(inner, keyFor) {
		this.inner = inner;
		this.keyFor = keyFor;
	}
	isEmpty() {
		return this.inner.isEmpty();
	}
	next() {
		let nextValue = this.inner.next();
		if (nextValue !== null) nextValue.key = this.keyFor(nextValue.value, nextValue.memo);
		return nextValue;
	}
};
var ArrayIterator$1 = class {
	current;
	pos = 0;
	constructor(iterator, keyFor) {
		this.iterator = iterator;
		this.keyFor = keyFor;
		if (iterator.length === 0) this.current = { kind: "empty" };
		else this.current = {
			kind: "first",
			value: iterator[this.pos]
		};
	}
	isEmpty() {
		return this.current.kind === "empty";
	}
	next() {
		let value;
		let current = this.current;
		if (current.kind === "first") {
			this.current = { kind: "progress" };
			value = current.value;
		} else if (this.pos >= this.iterator.length - 1) return null;
		else value = this.iterator[++this.pos];
		let { keyFor } = this;
		let key = keyFor(value, this.pos);
		let memo = this.pos;
		return {
			key,
			value,
			memo
		};
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/render-OqKpH1Pf.js
var DynamicScopeImpl = class DynamicScopeImpl {
	bucket;
	constructor(bucket) {
		if (bucket) this.bucket = assign({}, bucket);
		else this.bucket = {};
	}
	get(key) {
		return unwrap(this.bucket[key]);
	}
	set(key, reference) {
		return this.bucket[key] = reference;
	}
	child() {
		return new DynamicScopeImpl(this.bucket);
	}
};
var ScopeImpl = class ScopeImpl {
	static root(owner, { self, size = 0 }) {
		let refs = new Array(size + 1).fill(UNDEFINED_REFERENCE);
		return new ScopeImpl(owner, refs, null).init({ self });
	}
	static sized(owner, size = 0) {
		let refs = new Array(size + 1).fill(UNDEFINED_REFERENCE);
		return new ScopeImpl(owner, refs, null);
	}
	owner;
	slots;
	callerScope;
	constructor(owner, slots, callerScope) {
		this.owner = owner;
		this.slots = slots;
		this.callerScope = callerScope;
	}
	init({ self }) {
		this.slots[0] = self;
		return this;
	}
	/**
	* @debug
	*/
	snapshot() {
		return this.slots.slice();
	}
	getSelf() {
		return this.get(0);
	}
	getSymbol(symbol) {
		return this.get(symbol);
	}
	getBlock(symbol) {
		let block = this.get(symbol);
		return block === UNDEFINED_REFERENCE ? null : block;
	}
	bind(symbol, value) {
		this.set(symbol, value);
	}
	bindSelf(self) {
		this.set(0, self);
	}
	bindSymbol(symbol, value) {
		this.set(symbol, value);
	}
	bindBlock(symbol, value) {
		this.set(symbol, value);
	}
	bindCallerScope(scope) {
		this.callerScope = scope;
	}
	getCallerScope() {
		return this.callerScope;
	}
	child() {
		return new ScopeImpl(this.owner, this.slots.slice(), this.callerScope);
	}
	get(index) {
		if (index >= this.slots.length) throw new RangeError(`BUG: cannot get $${index} from scope; length=${this.slots.length}`);
		return this.slots[index];
	}
	set(index, value) {
		if (index >= this.slots.length) throw new RangeError(`BUG: cannot get $${index} from scope; length=${this.slots.length}`);
		this.slots[index] = value;
	}
};
[
	"b",
	"big",
	"blockquote",
	"body",
	"br",
	"center",
	"code",
	"dd",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"hr",
	"i",
	"img",
	"li",
	"listing",
	"main",
	"meta",
	"nobr",
	"ol",
	"p",
	"pre",
	"ruby",
	"s",
	"small",
	"span",
	"strong",
	"strike",
	"sub",
	"sup",
	"table",
	"tt",
	"u",
	"ul",
	"var"
].forEach((tag) => BLACKLIST_TABLE[tag] = 1);
var WHITESPACE = /[\t\n\v\f\r \xa0\u{1680}\u{180e}\u{2000}-\u{200a}\u{2028}\u{2029}\u{202f}\u{205f}\u{3000}\u{feff}]/u;
function isWhitespace(string) {
	return WHITESPACE.test(string);
}
var DOMChangesImpl = class extends DOMOperations {
	namespace;
	constructor(document) {
		super(document);
		this.document = document;
		this.namespace = null;
	}
	setAttribute(element, name, value) {
		element.setAttribute(name, value);
	}
	removeAttribute(element, name) {
		element.removeAttribute(name);
	}
	insertAfter(element, node, reference) {
		this.insertBefore(element, node, reference.nextSibling);
	}
};
var DOMChanges = DOMChangesImpl;
var TRANSACTION = Symbol("TRANSACTION");
var TransactionImpl = class {
	scheduledInstallModifiers = [];
	scheduledUpdateModifiers = [];
	createdComponents = [];
	updatedComponents = [];
	didCreate(component) {
		this.createdComponents.push(component);
	}
	didUpdate(component) {
		this.updatedComponents.push(component);
	}
	scheduleInstallModifier(modifier) {
		this.scheduledInstallModifiers.push(modifier);
	}
	scheduleUpdateModifier(modifier) {
		this.scheduledUpdateModifiers.push(modifier);
	}
	commit() {
		let { createdComponents, updatedComponents } = this;
		for (const { manager, state } of createdComponents) manager.didCreate(state);
		for (const { manager, state } of updatedComponents) manager.didUpdate(state);
		let { scheduledInstallModifiers, scheduledUpdateModifiers } = this;
		for (const { manager, state, definition } of scheduledInstallModifiers) {
			let modifierTag = manager.getTag(state);
			if (modifierTag !== null) {
				let tag = track(() => manager.install(state));
				UPDATE_TAG(modifierTag, tag);
			} else manager.install(state);
		}
		for (const { manager, state, definition } of scheduledUpdateModifiers) {
			let modifierTag = manager.getTag(state);
			if (modifierTag !== null) {
				let tag = track(() => manager.update(state));
				UPDATE_TAG(modifierTag, tag);
			} else manager.update(state);
		}
	}
};
var EnvironmentImpl = class {
	[TRANSACTION] = null;
	updateOperations;
	isInteractive;
	isArgumentCaptureError;
	debugRenderTree;
	constructor(options, delegate) {
		this.delegate = delegate;
		this.isInteractive = delegate.isInteractive;
		this.debugRenderTree = this.delegate.enableDebugTooling ? new DebugRenderTreeImpl() : void 0;
		this.isArgumentCaptureError = this.delegate.enableDebugTooling ? isArgumentError : void 0;
		if (options.appendOperations) {
			this.appendOperations = options.appendOperations;
			this.updateOperations = options.updateOperations;
		} else if (options.document) {
			this.appendOperations = new DOMTreeConstruction(options.document);
			this.updateOperations = new DOMChangesImpl(options.document);
		}
	}
	getAppendOperations() {
		return this.appendOperations;
	}
	getDOM() {
		return expect(this.updateOperations);
	}
	begin() {
		assert(!this[TRANSACTION]);
		this.debugRenderTree?.begin();
		this[TRANSACTION] = new TransactionImpl();
	}
	get transaction() {
		return expect(this[TRANSACTION]);
	}
	didCreate(component) {
		this.transaction.didCreate(component);
	}
	didUpdate(component) {
		this.transaction.didUpdate(component);
	}
	scheduleInstallModifier(modifier) {
		if (this.isInteractive) this.transaction.scheduleInstallModifier(modifier);
	}
	scheduleUpdateModifier(modifier) {
		if (this.isInteractive) this.transaction.scheduleUpdateModifier(modifier);
	}
	commit() {
		let transaction = this.transaction;
		this[TRANSACTION] = null;
		transaction.commit();
		this.debugRenderTree?.commit();
		this.delegate.onTransactionCommit();
	}
};
function runtimeOptions(options, delegate, artifacts, resolver) {
	return {
		env: new EnvironmentImpl(options, delegate),
		program: new ProgramImpl(artifacts.constants, artifacts.heap),
		resolver
	};
}
function inTransaction(env, block) {
	if (!env[TRANSACTION]) {
		env.begin();
		try {
			block();
		} finally {
			env.commit();
		}
	} else block();
}
function createCurryRef(type, inner, owner, args, resolver, isStrict) {
	let lastValue, curriedDefinition;
	return createComputeRef(() => {
		let value = valueForRef(inner);
		if (value === lastValue) return curriedDefinition;
		if (isCurriedType(value, type)) curriedDefinition = args ? curry(type, value, owner, args) : args;
		else if (type === 0 && typeof value === "string" && value) curriedDefinition = curry(type, value, owner, args);
		else if (isIndexable$1(value)) curriedDefinition = curry(type, value, owner, args);
		else curriedDefinition = null;
		lastValue = value;
		return curriedDefinition;
	});
}
function createConcatRef(partsRefs) {
	return createComputeRef(() => {
		const parts = [];
		for (const ref of partsRefs) {
			const value = valueForRef(ref);
			if (value !== null && value !== void 0) parts.push(castToString(value));
		}
		if (parts.length > 0) return parts.join("");
		return null;
	});
}
function castToString(value) {
	if (typeof value === "string") return value;
	else if (typeof value.toString !== "function") return "";
	return String(value);
}
APPEND_OPCODES.add(77, (vm, { op1: type, op2: _isStrict }) => {
	let stack = vm.stack;
	let definition = check(stack.pop());
	let capturedArgs = check(stack.pop());
	let owner = vm.getOwner();
	vm.context.resolver;
	vm.loadValue(8, createCurryRef(type, definition, owner, capturedArgs));
});
APPEND_OPCODES.add(107, (vm) => {
	let stack = vm.stack;
	let ref = check(stack.pop());
	let args = check(stack.pop()).capture();
	let helperRef;
	let initialOwner = vm.getOwner();
	let helperInstanceRef = createComputeRef(() => {
		if (helperRef !== void 0) destroy(helperRef);
		let definition = valueForRef(ref);
		if (isCurriedType(definition, 1)) {
			let { definition: resolvedDef, owner, positional, named } = resolveCurriedValue(definition);
			let helper = resolveHelper(resolvedDef);
			if (named !== void 0) args.named = assign({}, ...named, args.named);
			if (positional !== void 0) args.positional = positional.concat(args.positional);
			helperRef = helper(args, owner);
			associateDestroyableChild(helperInstanceRef, helperRef);
		} else if (isIndexable$1(definition)) {
			helperRef = resolveHelper(definition)(args, initialOwner);
			if (_hasDestroyableChildren(helperRef)) associateDestroyableChild(helperInstanceRef, helperRef);
		} else helperRef = UNDEFINED_REFERENCE;
	});
	let helperValueRef = createComputeRef(() => {
		valueForRef(helperInstanceRef);
		return valueForRef(helperRef);
	});
	vm.associateDestroyable(helperInstanceRef);
	vm.loadValue(8, helperValueRef);
});
function resolveHelper(definition, ref) {
	let managerOrHelper = getInternalHelperManager(definition, true);
	let helper;
	if (managerOrHelper === null) helper = null;
	else helper = typeof managerOrHelper === "function" ? managerOrHelper : managerOrHelper.getHelper(definition);
	return helper;
}
APPEND_OPCODES.add(16, (vm, { op1: handle }) => {
	let stack = vm.stack;
	let value = check(vm.constants.getValue(handle))(check(stack.pop()).capture(), vm.getOwner(), vm.dynamicScope());
	if (_hasDestroyableChildren(value)) vm.associateDestroyable(value);
	vm.loadValue(8, value);
});
APPEND_OPCODES.add(21, (vm, { op1: symbol }) => {
	let expr = vm.referenceForSymbol(symbol);
	vm.stack.push(expr);
});
APPEND_OPCODES.add(19, (vm, { op1: symbol }) => {
	let expr = check(vm.stack.pop());
	vm.scope().bindSymbol(symbol, expr);
});
APPEND_OPCODES.add(20, (vm, { op1: symbol }) => {
	let handle = check(vm.stack.pop());
	let scope = check(vm.stack.pop());
	let table = check(vm.stack.pop());
	vm.scope().bindBlock(symbol, [
		handle,
		scope,
		table
	]);
});
APPEND_OPCODES.add(37, (vm, { op1: size }) => {
	vm.pushRootScope(size, vm.getOwner());
});
APPEND_OPCODES.add(22, (vm, { op1: _key }) => {
	let key = vm.constants.getValue(_key);
	let expr = check(vm.stack.pop());
	vm.stack.push(childRefFor(expr, key));
});
APPEND_OPCODES.add(23, (vm, { op1: _block }) => {
	let { stack } = vm;
	let block = vm.scope().getBlock(_block);
	stack.push(block);
});
APPEND_OPCODES.add(24, (vm) => {
	let { stack } = vm;
	let block = check(stack.pop());
	if (block && !isUndefinedReference(block)) {
		let [handleOrCompilable, scope, table] = block;
		stack.push(table);
		stack.push(scope);
		stack.push(handleOrCompilable);
	} else {
		stack.push(null);
		stack.push(null);
		stack.push(null);
	}
});
function isUndefinedReference(input) {
	return input === UNDEFINED_REFERENCE;
}
APPEND_OPCODES.add(25, (vm) => {
	let { stack } = vm;
	let block = check(stack.pop());
	if (block && !isUndefinedReference(block)) stack.push(TRUE_REFERENCE);
	else stack.push(FALSE_REFERENCE);
});
APPEND_OPCODES.add(26, (vm) => {
	vm.stack.pop();
	vm.stack.pop();
	let table = check(vm.stack.pop());
	let hasBlockParams = table && table.parameters.length;
	vm.stack.push(hasBlockParams ? TRUE_REFERENCE : FALSE_REFERENCE);
});
APPEND_OPCODES.add(27, (vm, { op1: count }) => {
	let out = new Array(count);
	for (let i = count; i > 0; i--) {
		let offset = i - 1;
		out[offset] = check(vm.stack.pop());
	}
	vm.stack.push(createConcatRef(out));
});
APPEND_OPCODES.add(109, (vm) => {
	let condition = check(vm.stack.pop());
	let truthy = check(vm.stack.pop());
	let falsy = check(vm.stack.pop());
	vm.stack.push(createComputeRef(() => {
		if (toBool$1(valueForRef(condition))) return valueForRef(truthy);
		else return valueForRef(falsy);
	}));
});
APPEND_OPCODES.add(110, (vm) => {
	let ref = check(vm.stack.pop());
	vm.stack.push(createComputeRef(() => {
		return !toBool$1(valueForRef(ref));
	}));
});
APPEND_OPCODES.add(111, (vm) => {
	let scope = vm.dynamicScope();
	let stack = vm.stack;
	let nameRef = check(stack.pop());
	stack.push(createComputeRef(() => {
		let name = String(valueForRef(nameRef));
		return valueForRef(scope.get(name));
	}));
});
APPEND_OPCODES.add(112, (vm) => {
	let { positional } = check(vm.stack.pop()).capture();
	vm.loadValue(8, createComputeRef(() => {
		console.log(...reifyPositional(positional));
	}));
});
var DynamicTextContent = class {
	constructor(node, reference, lastValue) {
		this.node = node;
		this.reference = reference;
		this.lastValue = lastValue;
	}
	evaluate() {
		let value = valueForRef(this.reference);
		let { lastValue } = this;
		if (value === lastValue) return;
		let normalized;
		if (isEmpty(value)) normalized = "";
		else if (isString(value)) normalized = value;
		else normalized = String(value);
		if (normalized !== lastValue) {
			let textNode = this.node;
			textNode.nodeValue = this.lastValue = normalized;
		}
	}
};
function toContentType(value) {
	if (shouldCoerce(value)) return ContentType.String;
	else if (isCurriedType(value, 0) || hasInternalComponentManager(value)) return ContentType.Component;
	else if (isCurriedType(value, 1) || hasInternalHelperManager(value)) return ContentType.Helper;
	else if (isSafeString(value)) return ContentType.SafeString;
	else if (isFragment(value)) return ContentType.Fragment;
	else if (isNode(value)) return ContentType.Node;
	else return ContentType.String;
}
function toDynamicContentType(value) {
	if (!isIndexable$1(value)) return ContentType.String;
	if (isCurriedType(value, 0) || hasInternalComponentManager(value)) return ContentType.Component;
	else return ContentType.Helper;
}
APPEND_OPCODES.add(76, (vm) => {
	let reference = check(vm.stack.peek());
	vm.stack.push(toContentType(valueForRef(reference)));
	if (!isConstRef(reference)) vm.updateWith(new AssertFilter(reference, toContentType));
});
APPEND_OPCODES.add(106, (vm) => {
	let reference = check(vm.stack.peek());
	vm.stack.push(toDynamicContentType(valueForRef(reference)));
	if (!isConstRef(reference)) vm.updateWith(new AssertFilter(reference, toDynamicContentType));
});
APPEND_OPCODES.add(43, (vm) => {
	let reference = check(vm.stack.pop());
	let rawValue = valueForRef(reference);
	let value = isEmpty(rawValue) ? "" : String(rawValue);
	vm.tree().appendDynamicHTML(value);
});
APPEND_OPCODES.add(44, (vm) => {
	let reference = check(vm.stack.pop());
	let rawValue = check(valueForRef(reference)).toHTML();
	let value = isEmpty(rawValue) ? "" : check(rawValue);
	vm.tree().appendDynamicHTML(value);
});
APPEND_OPCODES.add(47, (vm) => {
	let reference = check(vm.stack.pop());
	let rawValue = valueForRef(reference);
	let value = isEmpty(rawValue) ? "" : String(rawValue);
	let node = vm.tree().appendDynamicText(value);
	if (!isConstRef(reference)) vm.updateWith(new DynamicTextContent(node, reference, value));
});
APPEND_OPCODES.add(45, (vm) => {
	let reference = check(vm.stack.pop());
	let value = check(valueForRef(reference));
	vm.tree().appendDynamicFragment(value);
});
APPEND_OPCODES.add(46, (vm) => {
	let reference = check(vm.stack.pop());
	let value = check(valueForRef(reference));
	vm.tree().appendDynamicNode(value);
});
function debugCallback(context, get) {
	if (context !== null && context !== void 0) {
		console.info("Use `context`, and `get(<path>)` to debug this template. For named arguments, use `get('@argName')`.");
		get("this");
	} else console.info("Use `get(<path>)` to debug this template. For named arguments, use `get('@argName')`.");
	debugger;
}
var callback = debugCallback;
function setDebuggerCallback(cb) {
	callback = cb;
}
function resetDebuggerCallback() {
	callback = debugCallback;
}
var ScopeInspector = class {
	#symbols;
	constructor(scope, symbols) {
		this.scope = scope;
		this.#symbols = symbols;
	}
	get(path) {
		let { scope } = this;
		let symbols = this.#symbols;
		let parts = path.split(".");
		let [head, ...tail] = path.split(".");
		let ref;
		if (head === "this") ref = scope.getSelf();
		else if (symbols.locals[head]) ref = unwrap(scope.getSymbol(symbols.locals[head]));
		else {
			ref = this.scope.getSelf();
			tail = parts;
		}
		return tail.reduce((r, part) => childRefFor(r, part), ref);
	}
};
APPEND_OPCODES.add(103, (vm, { op1: _debugInfo }) => {
	let debuggerInfo = vm.constants.getValue(decodeHandle(_debugInfo));
	let inspector = new ScopeInspector(vm.scope(), debuggerInfo);
	callback(valueForRef(vm.getSelf()), (path) => valueForRef(inspector.get(path)));
});
APPEND_OPCODES.add(72, (vm, { op1: relativeStart, op2: elseTarget }) => {
	let stack = vm.stack;
	let listRef = check(stack.pop());
	let keyRef = check(stack.pop());
	let keyValue = valueForRef(keyRef);
	let iteratorRef = createIteratorRef(listRef, keyValue === null ? "@identity" : String(keyValue));
	let iterator = valueForRef(iteratorRef);
	vm.updateWith(new AssertFilter(iteratorRef, (iterator) => iterator.isEmpty()));
	if (iterator.isEmpty()) vm.lowlevel.goto(elseTarget + 1);
	else {
		vm.enterList(iteratorRef, relativeStart);
		vm.stack.push(iterator);
	}
});
APPEND_OPCODES.add(73, (vm) => {
	vm.exitList();
});
APPEND_OPCODES.add(74, (vm, { op1: breaks }) => {
	let stack = vm.stack;
	let item = check(stack.peek()).next();
	if (item !== null) vm.registerItem(vm.enterItem(item));
	else vm.lowlevel.goto(breaks);
});
function initializeRegistersWithSP(sp) {
	return [
		0,
		-1,
		sp,
		0
	];
}
var LowLevelVM = class {
	currentOpSize = 0;
	registers;
	context;
	constructor(stack, context, externs, registers) {
		this.stack = stack;
		this.externs = externs;
		this.context = context;
		this.registers = registers;
	}
	fetchRegister(register) {
		return this.registers[register];
	}
	loadRegister(register, value) {
		this.registers[register] = value;
	}
	setPc(pc) {
		this.registers[0] = pc;
	}
	pushFrame() {
		this.stack.push(this.registers[1]);
		this.stack.push(this.registers[2]);
		this.registers[2] = this.registers[3] - 1;
	}
	popFrame() {
		this.registers[3] = this.registers[2] - 1;
		this.registers[1] = this.stack.get(0);
		this.registers[2] = this.stack.get(1);
	}
	pushSmallFrame() {
		this.stack.push(this.registers[1]);
	}
	popSmallFrame() {
		this.registers[1] = this.stack.pop();
	}
	goto(offset) {
		this.setPc(this.target(offset));
	}
	target(offset) {
		return this.registers[0] + offset - this.currentOpSize;
	}
	call(handle) {
		this.registers[1] = this.registers[0];
		this.setPc(this.context.program.heap.getaddr(handle));
	}
	returnTo(offset) {
		this.registers[1] = this.target(offset);
	}
	return() {
		this.setPc(this.registers[1]);
	}
	nextStatement() {
		let { registers, context } = this;
		let pc = registers[0];
		if (pc === -1) return null;
		let opcode = context.program.opcode(pc);
		let operationSize = this.currentOpSize = opcode.size;
		this.registers[0] += operationSize;
		return opcode;
	}
	evaluateOuter(opcode, vm) {
		this.evaluateInner(opcode, vm);
	}
	evaluateInner(opcode, vm) {
		if (opcode.isMachine) this.evaluateMachine(opcode, vm);
		else this.evaluateSyscall(opcode, vm);
	}
	evaluateMachine(opcode, vm) {
		switch (opcode.type) {
			case 0:
				this.pushFrame();
				return;
			case 1:
				this.popFrame();
				return;
			case 3:
				this.call(opcode.op1);
				return;
			case 2:
				vm.call(this.stack.pop());
				return;
			case 4:
				this.goto(opcode.op1);
				return;
			case 5:
				vm.return();
				return;
			case 6:
				this.returnTo(opcode.op1);
				return;
		}
	}
	evaluateSyscall(opcode, vm) {
		APPEND_OPCODES.evaluate(vm, opcode, opcode.type);
	}
};
var UpdatingVM = class {
	env;
	dom;
	alwaysRevalidate;
	frameStack = new StackImpl();
	constructor(env, { alwaysRevalidate = false }) {
		this.env = env;
		this.dom = env.getDOM();
		this.alwaysRevalidate = alwaysRevalidate;
	}
	execute(opcodes, handler) {
		this._execute(opcodes, handler);
	}
	_execute(opcodes, handler) {
		let { frameStack } = this;
		this.try(opcodes, handler);
		while (!frameStack.isEmpty()) {
			let opcode = this.frame.nextStatement();
			if (opcode === void 0) {
				frameStack.pop();
				continue;
			}
			opcode.evaluate(this);
		}
	}
	get frame() {
		return expect(this.frameStack.current);
	}
	goto(index) {
		this.frame.goto(index);
	}
	try(ops, handler) {
		this.frameStack.push(new UpdatingVMFrame(ops, handler));
	}
	throw() {
		this.frame.handleException();
		this.frameStack.pop();
	}
};
var BlockOpcode = class {
	children;
	bounds;
	constructor(state, context, bounds, children) {
		this.state = state;
		this.context = context;
		this.children = children;
		this.bounds = bounds;
	}
	parentElement() {
		return this.bounds.parentElement();
	}
	firstNode() {
		return this.bounds.firstNode();
	}
	lastNode() {
		return this.bounds.lastNode();
	}
	evaluate(vm) {
		vm.try(this.children, null);
	}
};
var TryOpcode = class extends BlockOpcode {
	type = "try";
	evaluate(vm) {
		vm.try(this.children, this);
	}
	handleException() {
		let { state, bounds, context: { env } } = this;
		destroyChildren(this);
		let tree = NewTreeBuilder.resume(env, bounds);
		let vm = state.evaluate(tree);
		let children = this.children = [];
		let result = vm.execute((vm) => {
			vm.updateWith(this);
			vm.pushUpdating(children);
		});
		associateDestroyableChild(this, result.drop);
	}
};
var ListItemOpcode = class extends TryOpcode {
	retained = false;
	index = -1;
	constructor(state, context, bounds, key, memo, value) {
		super(state, context, bounds, []);
		this.key = key;
		this.memo = memo;
		this.value = value;
	}
	shouldRemove() {
		return !this.retained;
	}
	reset() {
		this.retained = false;
	}
};
var ListBlockOpcode = class extends BlockOpcode {
	type = "list-block";
	opcodeMap = /* @__PURE__ */ new Map();
	marker = null;
	lastIterator;
	constructor(state, context, bounds, children, iterableRef) {
		super(state, context, bounds, children);
		this.iterableRef = iterableRef;
		this.lastIterator = valueForRef(iterableRef);
	}
	initializeChild(opcode) {
		opcode.index = this.children.length - 1;
		this.opcodeMap.set(opcode.key, opcode);
	}
	evaluate(vm) {
		let iterator = valueForRef(this.iterableRef);
		if (this.lastIterator !== iterator) {
			let { bounds } = this;
			let { dom } = vm;
			let marker = this.marker = dom.createComment("");
			dom.insertAfter(bounds.parentElement(), marker, expect(bounds.lastNode()));
			this.sync(iterator);
			this.parentElement().removeChild(marker);
			this.marker = null;
			this.lastIterator = iterator;
		}
		super.evaluate(vm);
	}
	sync(iterator) {
		let { opcodeMap: itemMap, children } = this;
		let currentOpcodeIndex = 0;
		let seenIndex = 0;
		this.children = this.bounds.boundList = [];
		while (true) {
			let item = iterator.next();
			if (item === null) break;
			let opcode = children[currentOpcodeIndex];
			let { key } = item;
			while (opcode !== void 0 && opcode.retained) opcode = children[++currentOpcodeIndex];
			if (opcode !== void 0 && opcode.key === key) {
				this.retainItem(opcode, item);
				currentOpcodeIndex++;
			} else if (itemMap.has(key)) {
				let itemOpcode = itemMap.get(key);
				if (itemOpcode.index < seenIndex) this.moveItem(itemOpcode, item, opcode);
				else {
					seenIndex = itemOpcode.index;
					let seenUnretained = false;
					for (let i = currentOpcodeIndex + 1; i < seenIndex; i++) if (!unwrap(children[i]).retained) {
						seenUnretained = true;
						break;
					}
					if (!seenUnretained) {
						this.retainItem(itemOpcode, item);
						currentOpcodeIndex = seenIndex + 1;
					} else {
						this.moveItem(itemOpcode, item, opcode);
						currentOpcodeIndex++;
					}
				}
			} else this.insertItem(item, opcode);
		}
		for (const opcode of children) if (!opcode.retained) this.deleteItem(opcode);
		else opcode.reset();
	}
	retainItem(opcode, item) {
		let { children } = this;
		updateRef(opcode.memo, item.memo);
		updateRef(opcode.value, item.value);
		opcode.retained = true;
		opcode.index = children.length;
		children.push(opcode);
	}
	insertItem(item, before) {
		let { opcodeMap, bounds, state, children, context: { env } } = this;
		let { key } = item;
		let nextSibling = before === void 0 ? this.marker : before.firstNode();
		let elementStack = NewTreeBuilder.forInitialRender(env, {
			element: bounds.parentElement(),
			nextSibling
		});
		state.evaluate(elementStack).execute((vm) => {
			let opcode = vm.enterItem(item);
			opcode.index = children.length;
			children.push(opcode);
			opcodeMap.set(key, opcode);
			associateDestroyableChild(this, opcode);
		});
	}
	moveItem(opcode, item, before) {
		let { children } = this;
		updateRef(opcode.memo, item.memo);
		updateRef(opcode.value, item.value);
		opcode.retained = true;
		let currentSibling, nextSibling;
		if (before === void 0) move(opcode, this.marker);
		else {
			currentSibling = opcode.lastNode().nextSibling;
			nextSibling = before.firstNode();
			if (currentSibling !== nextSibling) move(opcode, nextSibling);
		}
		opcode.index = children.length;
		children.push(opcode);
	}
	deleteItem(opcode) {
		destroy(opcode);
		clear(opcode);
		this.opcodeMap.delete(opcode.key);
	}
};
var UpdatingVMFrame = class {
	current = 0;
	constructor(ops, exceptionHandler) {
		this.ops = ops;
		this.exceptionHandler = exceptionHandler;
	}
	goto(index) {
		this.current = index;
	}
	nextStatement() {
		return this.ops[this.current++];
	}
	handleException() {
		if (this.exceptionHandler) this.exceptionHandler.handleException();
	}
};
var RenderResultImpl = class {
	constructor(env, updating, bounds, drop) {
		this.env = env;
		this.updating = updating;
		this.bounds = bounds;
		this.drop = drop;
		associateDestroyableChild(this, drop);
		registerDestructor(this, () => clear(this.bounds));
	}
	rerender({ alwaysRevalidate = false } = { alwaysRevalidate: false }) {
		let { env, updating } = this;
		new UpdatingVM(env, { alwaysRevalidate }).execute(updating, this);
	}
	parentElement() {
		return this.bounds.parentElement();
	}
	firstNode() {
		return this.bounds.firstNode();
	}
	lastNode() {
		return this.bounds.lastNode();
	}
	handleException() {}
};
var EvaluationStackImpl = class {
	static restore(snapshot, pc) {
		const stack = new this(snapshot.slice(), initializeRegistersWithSP(snapshot.length - 1));
		stack.registers[0] = pc;
		stack.registers[3] = snapshot.length - 1;
		stack.registers[2] = -1;
		return stack;
	}
	registers;
	constructor(stack = [], registers) {
		this.stack = stack;
		this.registers = registers;
	}
	push(value) {
		this.stack[++this.registers[3]] = value;
	}
	dup(position = this.registers[3]) {
		this.stack[++this.registers[3]] = this.stack[position];
	}
	copy(from, to) {
		this.stack[to] = this.stack[from];
	}
	pop(n = 1) {
		let top = this.stack[this.registers[3]];
		this.registers[3] -= n;
		return top;
	}
	peek(offset = 0) {
		return this.stack[this.registers[3] - offset];
	}
	get(offset, base = this.registers[2]) {
		return this.stack[base + offset];
	}
	set(value, offset, base = this.registers[2]) {
		this.stack[base + offset] = value;
	}
	slice(start, end) {
		return this.stack.slice(start, end);
	}
	capture(items) {
		let end = this.registers[3] + 1;
		let start = end - items;
		return this.stack.slice(start, end);
	}
	reset() {
		this.stack.length = 0;
	}
	static {}
};
var Stacks = class {
	drop = {};
	scope = new StackImpl();
	dynamicScope = new StackImpl();
	updating = new StackImpl();
	cache = new StackImpl();
	list = new StackImpl();
	destroyable = new StackImpl();
	constructor(scope, dynamicScope) {
		this.scope.push(scope);
		this.dynamicScope.push(dynamicScope);
		this.destroyable.push(this.drop);
	}
};
var VM = class VM {
	#stacks;
	args;
	lowlevel;
	debug;
	trace;
	get stack() {
		return this.lowlevel.stack;
	}
	get pc() {
		return this.lowlevel.fetchRegister(0);
	}
	#registers = [
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null
	];
	/**
	* Fetch a value from a syscall register onto the stack.
	*
	* ## Opcodes
	*
	* - Append: `Fetch`
	*
	* ## State changes
	*
	* [!] push Eval Stack <- $register
	*/
	fetch(register) {
		let value = this.fetchValue(register);
		this.stack.push(value);
	}
	/**
	* Load a value from the stack into a syscall register.
	*
	* ## Opcodes
	*
	* - Append: `Load`
	*
	* ## State changes
	*
	* [!] pop Eval Stack -> `value`
	* [$] $register <- `value`
	*/
	load(register) {
		let value = this.stack.pop();
		this.loadValue(register, value);
	}
	/**
	* Load a value into a syscall register.
	*
	* ## State changes
	*
	* [$] $register <- `value`
	*
	* @utility
	*/
	loadValue(register, value) {
		this.#registers[register] = value;
	}
	/**
	* Fetch a value from a register (machine or syscall).
	*
	* ## State changes
	*
	* [ ] get $register
	*
	* @utility
	*/
	fetchValue(register) {
		if (isLowLevelRegister(register)) return this.lowlevel.fetchRegister(register);
		return this.#registers[register];
	}
	call(handle) {
		if (handle !== null) this.lowlevel.call(handle);
	}
	return() {
		this.lowlevel.return();
	}
	#tree;
	context;
	constructor({ scope, dynamicScope, stack, pc }, context, tree) {
		let evalStack = EvaluationStackImpl.restore(stack, pc);
		this.#tree = tree;
		this.context = context;
		this.#stacks = new Stacks(scope, dynamicScope);
		this.args = new VMArgumentsImpl();
		this.lowlevel = new LowLevelVM(evalStack, context, externs(), evalStack.registers);
		this.pushUpdating();
	}
	static initial(context, options) {
		let scope = ScopeImpl.root(options.owner, options.scope ?? {
			self: UNDEFINED_REFERENCE,
			size: 0
		});
		const state = closureState(context.program.heap.getaddr(options.handle), scope, options.dynamicScope);
		return new VM(state, context, options.tree);
	}
	compile(block) {
		return unwrapHandle(block.compile(this.context));
	}
	get constants() {
		return this.context.program.constants;
	}
	get program() {
		return this.context.program;
	}
	get env() {
		return this.context.env;
	}
	captureClosure(args, pc = this.lowlevel.fetchRegister(0)) {
		return {
			pc,
			scope: this.scope(),
			dynamicScope: this.dynamicScope(),
			stack: this.stack.capture(args)
		};
	}
	capture(args, pc = this.lowlevel.fetchRegister(0)) {
		return new Closure(this.captureClosure(args, pc), this.context);
	}
	/**
	* ## Opcodes
	*
	* - Append: `BeginComponentTransaction`
	*
	* ## State Changes
	*
	* [ ] create `guard` (`JumpIfNotModifiedOpcode`)
	* [ ] create `tracker` (`BeginTrackFrameOpcode`)
	* [!] push Updating Stack <- `guard`
	* [!] push Updating Stack <- `tracker`
	* [!] push Cache Stack <- `guard`
	* [!] push Tracking Stack
	*/
	beginCacheGroup(name) {
		let opcodes = this.updating();
		let guard = new JumpIfNotModifiedOpcode();
		opcodes.push(guard);
		opcodes.push(new BeginTrackFrameOpcode(name));
		this.#stacks.cache.push(guard);
		beginTrackFrame();
	}
	/**
	* ## Opcodes
	*
	* - Append: `CommitComponentTransaction`
	*
	* ## State Changes
	*
	* Create a new `EndTrackFrameOpcode` (`end`)
	*
	* [!] pop CacheStack -> `guard`
	* [!] pop Tracking Stack -> `tag`
	* [ ] create `end` (`EndTrackFrameOpcode`) with `guard`
	* [-] consume `tag`
	*/
	commitCacheGroup() {
		let opcodes = this.updating();
		let guard = expect(this.#stacks.cache.pop());
		let tag = endTrackFrame();
		opcodes.push(new EndTrackFrameOpcode(guard));
		guard.finalize(tag, opcodes.length);
	}
	/**
	* ## Opcodes
	*
	* - Append: `Enter`
	*
	* ## State changes
	*
	* [!] push Element Stack as `block`
	* [ ] create `try` (`TryOpcode`) with `block`, capturing `args` from the Eval Stack
	*
	* Did Enter (`try`):
	* [-] associate destroyable `try`
	* [!] push Destroyable Stack <- `try`
	* [!] push Updating List <- `try`
	* [!] push Updating Stack <- `try.children`
	*/
	enter(args) {
		let updating = [];
		let state = this.capture(args);
		let block = this.tree().pushResettableBlock();
		let tryOpcode = new TryOpcode(state, this.context, block, updating);
		this.didEnter(tryOpcode);
	}
	/**
	* ## Opcodes
	*
	* - Append: `Iterate`
	* - Update: `ListBlock`
	*
	* ## State changes
	*
	* Create a new ref for the iterator item (`value`).
	* Create a new ref for the iterator key (`key`).
	*
	* [ ] create `valueRef` (`Reference`) from `value`
	* [ ] create `keyRef` (`Reference`) from `key`
	* [!] push Eval Stack <- `valueRef`
	* [!] push Eval Stack <- `keyRef`
	* [!] push Element Stack <- `UpdatableBlock` as `block`
	* [ ] capture `closure` with *2* items from the Eval Stack
	* [ ] create `iteration` (`ListItemOpcode`) with `closure`, `block`, `key`, `keyRef` and `valueRef`
	*
	* Did Enter (`iteration`):
	* [-] associate destroyable `iteration`
	* [!] push Destroyable Stack <- `iteration`
	* [!] push Updating List <- `iteration`
	* [!] push Updating Stack <- `iteration.children`
	*/
	enterItem({ key, value, memo }) {
		let { stack } = this;
		let valueRef = createIteratorItemRef(value);
		let memoRef = createIteratorItemRef(memo);
		stack.push(valueRef);
		stack.push(memoRef);
		let state = this.capture(2);
		let block = this.tree().pushResettableBlock();
		let opcode = new ListItemOpcode(state, this.context, block, key, memoRef, valueRef);
		this.didEnter(opcode);
		return opcode;
	}
	registerItem(opcode) {
		this.listBlock().initializeChild(opcode);
	}
	/**
	* ## Opcodes
	*
	* - Append: `EnterList`
	*
	* ## State changes
	*
	* [ ] capture `closure` with *0* items from the Eval Stack, and `$pc` from `offset`
	* [ ] create `updating` (empty `Array`)
	* [!] push Element Stack <- `list` (`BlockList`) with `updating`
	* [ ] create `list` (`ListBlockOpcode`) with `closure`, `list`, `updating` and `iterableRef`
	* [!] push List Stack <- `list`
	*
	* Did Enter (`list`):
	* [-] associate destroyable `list`
	* [!] push Destroyable Stack <- `list`
	* [!] push Updating List <- `list`
	* [!] push Updating Stack <- `list.children`
	*/
	enterList(iterableRef, offset) {
		let updating = [];
		let addr = this.lowlevel.target(offset);
		let state = this.capture(0, addr);
		let list = this.tree().pushBlockList(updating);
		let opcode = new ListBlockOpcode(state, this.context, list, updating, iterableRef);
		this.#stacks.list.push(opcode);
		this.didEnter(opcode);
	}
	/**
	* ## Opcodes
	*
	* - Append: `Enter`
	* - Append: `Iterate`
	* - Append: `EnterList`
	* - Update: `ListBlock`
	*
	* ## State changes
	*
	* [-] associate destroyable `opcode`
	* [!] push Destroyable Stack <- `opcode`
	* [!] push Updating List <- `opcode`
	* [!] push Updating Stack <- `opcode.children`
	*
	*/
	didEnter(opcode) {
		this.associateDestroyable(opcode);
		this.#stacks.destroyable.push(opcode);
		this.updateWith(opcode);
		this.pushUpdating(opcode.children);
	}
	/**
	* ## Opcodes
	*
	* - Append: `Exit`
	* - Append: `ExitList`
	*
	* ## State changes
	*
	* [!] pop Destroyable Stack
	* [!] pop Element Stack
	* [!] pop Updating Stack
	*/
	exit() {
		this.#stacks.destroyable.pop();
		this.#tree.popBlock();
		this.popUpdating();
	}
	/**
	* ## Opcodes
	*
	* - Append: `ExitList`
	*
	* ## State changes
	*
	* Pop List:
	* [!] pop Destroyable Stack
	* [!] pop Element Stack
	* [!] pop Updating Stack
	*
	* [!] pop List Stack
	*/
	exitList() {
		this.exit();
		this.#stacks.list.pop();
	}
	/**
	* ## Opcodes
	*
	* - Append: `RootScope`
	* - Append: `VirtualRootScope`
	*
	* ## State changes
	*
	* [!] push Scope Stack
	*/
	pushRootScope(size, owner) {
		let scope = ScopeImpl.sized(owner, size);
		this.#stacks.scope.push(scope);
		return scope;
	}
	/**
	* ## Opcodes
	*
	* - Append: `ChildScope`
	*
	* ## State changes
	*
	* [!] push Scope Stack <- `child` of current Scope
	*/
	pushChildScope() {
		this.#stacks.scope.push(this.scope().child());
	}
	/**
	* ## Opcodes
	*
	* - Append: `Yield`
	*
	* ## State changes
	*
	* [!] push Scope Stack <- `scope`
	*/
	pushScope(scope) {
		this.#stacks.scope.push(scope);
	}
	/**
	* ## Opcodes
	*
	* - Append: `PopScope`
	*
	* ## State changes
	*
	* [!] pop Scope Stack
	*/
	popScope() {
		this.#stacks.scope.pop();
	}
	/**
	* ## Opcodes
	*
	* - Append: `PushDynamicScope`
	*
	* ## State changes:
	*
	* [!] push Dynamic Scope Stack <- child of current Dynamic Scope
	*/
	pushDynamicScope() {
		let child = this.dynamicScope().child();
		this.#stacks.dynamicScope.push(child);
		return child;
	}
	/**
	* ## Opcodes
	*
	* - Append: `BindDynamicScope`
	*
	* ## State changes:
	*
	* [!] pop Dynamic Scope Stack `names.length` times
	*/
	bindDynamicScope(names) {
		let scope = this.dynamicScope();
		for (const name of reverse(names)) scope.set(name, this.stack.pop());
	}
	/**
	* ## State changes
	*
	* - [!] push Updating Stack
	*
	* @utility
	*/
	pushUpdating(list = []) {
		this.#stacks.updating.push(list);
	}
	/**
	* ## State changes
	*
	* [!] pop Updating Stack
	*
	* @utility
	*/
	popUpdating() {
		return expect(this.#stacks.updating.pop());
	}
	/**
	* ## State changes
	*
	* [!] push Updating List
	*
	* @utility
	*/
	updateWith(opcode) {
		this.updating().push(opcode);
	}
	listBlock() {
		return expect(this.#stacks.list.current);
	}
	/**
	* ## State changes
	*
	* [-] associate destroyable `child`
	*
	* @utility
	*/
	associateDestroyable(child) {
		let parent = expect(this.#stacks.destroyable.current);
		associateDestroyableChild(parent, child);
	}
	updating() {
		return expect(this.#stacks.updating.current);
	}
	/**
	* Get Tree Builder
	*/
	tree() {
		return this.#tree;
	}
	/**
	* Get current Scope
	*/
	scope() {
		return expect(this.#stacks.scope.current);
	}
	/**
	* Get current Dynamic Scope
	*/
	dynamicScope() {
		return expect(this.#stacks.dynamicScope.current);
	}
	popDynamicScope() {
		this.#stacks.dynamicScope.pop();
	}
	getOwner() {
		return this.scope().owner;
	}
	getSelf() {
		return this.scope().getSelf();
	}
	referenceForSymbol(symbol) {
		return this.scope().getSymbol(symbol);
	}
	execute(initialize) {
		return this._execute(initialize);
	}
	_execute(initialize) {
		if (initialize) initialize(this);
		let result;
		do
			result = this.next();
		while (!result.done);
		return result.value;
	}
	next() {
		let { env } = this;
		let opcode = this.lowlevel.nextStatement();
		let result;
		if (opcode !== null) {
			this.lowlevel.evaluateOuter(opcode, this);
			result = {
				done: false,
				value: null
			};
		} else {
			this.stack.reset();
			result = {
				done: true,
				value: new RenderResultImpl(env, this.popUpdating(), this.#tree.popBlock(), this.#stacks.drop)
			};
		}
		return result;
	}
};
function closureState(pc, scope, dynamicScope) {
	return {
		pc,
		scope,
		dynamicScope,
		stack: []
	};
}
/**
* A closure captures the state of the VM for a particular block of code that is necessary to
* re-invoke the block in the future.
*
* In practice, this allows us to clear the previous render and "replay" the block's execution,
* rendering content in the same position as the first render.
*/
var Closure = class {
	state;
	context;
	constructor(state, context) {
		this.state = state;
		this.context = context;
	}
	evaluate(tree) {
		return new VM(this.state, this.context, tree);
	}
};
var TemplateIteratorImpl = class {
	constructor(vm) {
		this.vm = vm;
	}
	next() {
		return this.vm.next();
	}
	sync() {
		return this.vm.execute();
	}
};
function renderSync(env, iterator) {
	let result;
	inTransaction(env, () => result = iterator.sync());
	return result;
}
function renderMain(context, owner, self, tree, layout, dynamicScope = new DynamicScopeImpl()) {
	let handle = unwrapHandle(layout.compile(context));
	let numSymbols = layout.symbolTable.symbols.length;
	return new TemplateIteratorImpl(VM.initial(context, {
		scope: {
			self,
			size: numSymbols
		},
		dynamicScope,
		tree,
		handle,
		owner
	}));
}
function renderInvocation(vm, context, owner, definition, args) {
	const argList = Object.keys(args).map((key) => [key, args[key]]);
	const blockNames = [
		"main",
		"else",
		"attrs"
	];
	const argNames = argList.map(([name]) => `@${name}`);
	let reified = vm.constants.component(definition, owner, void 0, "{ROOT}");
	vm.lowlevel.pushFrame();
	for (let i = 0; i < 3 * blockNames.length; i++) vm.stack.push(null);
	vm.stack.push(null);
	argList.forEach(([, reference]) => {
		vm.stack.push(reference);
	});
	vm.args.setup(vm.stack, argNames, blockNames, 0, true);
	const compilable = expect(reified.compilable);
	const invocation = {
		handle: unwrapHandle(compilable.compile(context)),
		symbolTable: compilable.symbolTable
	};
	vm.stack.push(vm.args);
	vm.stack.push(invocation);
	vm.stack.push(reified);
	return new TemplateIteratorImpl(vm);
}
function renderComponent$1(context, tree, owner, definition, args = {}, dynamicScope = new DynamicScopeImpl()) {
	return renderInvocation(VM.initial(context, {
		tree,
		handle: context.stdlib.main,
		dynamicScope,
		owner
	}), context, owner, definition, recordToReference(args));
}
function recordToReference(record) {
	const root = createConstRef(record);
	return Object.keys(record).reduce((acc, key) => {
		acc[key] = childRefFor(root, key);
		return acc;
	}, {});
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/program/index.js
/**
* Default component template, which is a plain yield
*/
var DEFAULT_TEMPLATE_BLOCK = [
	[[
		opcodes.Yield,
		1,
		null
	]],
	["&default"],
	[]
];
var DEFAULT_TEMPLATE = {
	id: "1b32f5c2-7623-43d6-a0ad-9672898920a1",
	moduleName: "__default__.hbs",
	block: JSON.stringify(DEFAULT_TEMPLATE_BLOCK),
	scope: null,
	isStrictMode: true
};
var WELL_KNOWN_EMPTY_ARRAY = Object.freeze([]);
var STARTER_CONSTANTS = constants(WELL_KNOWN_EMPTY_ARRAY);
var WELL_KNOWN_EMPTY_ARRAY_POSITION = STARTER_CONSTANTS.indexOf(WELL_KNOWN_EMPTY_ARRAY);
var ConstantsImpl = class {
	reifiedArrs = { [WELL_KNOWN_EMPTY_ARRAY_POSITION]: WELL_KNOWN_EMPTY_ARRAY };
	defaultTemplate = templateFactory(DEFAULT_TEMPLATE)();
	helperDefinitionCount = 0;
	modifierDefinitionCount = 0;
	componentDefinitionCount = 0;
	values = STARTER_CONSTANTS.slice();
	indexMap = new Map(this.values.map((value, index) => [value, index]));
	helperDefinitionCache = /* @__PURE__ */ new WeakMap();
	modifierDefinitionCache = /* @__PURE__ */ new WeakMap();
	componentDefinitionCache = /* @__PURE__ */ new WeakMap();
	value(value) {
		let indexMap = this.indexMap;
		let index = indexMap.get(value);
		if (index === void 0) {
			index = this.values.push(value) - 1;
			indexMap.set(value, index);
		}
		return index;
	}
	array(values) {
		if (values.length === 0) return WELL_KNOWN_EMPTY_ARRAY_POSITION;
		let handles = new Array(values.length);
		for (let i = 0; i < values.length; i++) handles[i] = this.value(values[i]);
		return this.value(handles);
	}
	toPool() {
		return this.values;
	}
	hasHandle(handle) {
		return this.values.length > handle;
	}
	helper(definitionState, _resolvedName = null, isOptional) {
		let handle = this.helperDefinitionCache.get(definitionState);
		if (handle === void 0) {
			let managerOrHelper = getInternalHelperManager(definitionState, isOptional);
			if (managerOrHelper === null) {
				this.helperDefinitionCache.set(definitionState, null);
				return null;
			}
			let helper = typeof managerOrHelper === "function" ? managerOrHelper : managerOrHelper.getHelper(definitionState);
			handle = this.value(helper);
			this.helperDefinitionCache.set(definitionState, handle);
			this.helperDefinitionCount++;
		}
		return handle;
	}
	modifier(definitionState, resolvedName = null, isOptional) {
		let handle = this.modifierDefinitionCache.get(definitionState);
		if (handle === void 0) {
			let manager = getInternalModifierManager(definitionState);
			if (manager === null) {
				this.modifierDefinitionCache.set(definitionState, null);
				return null;
			}
			let definition = {
				resolvedName,
				manager,
				state: definitionState
			};
			handle = this.value(definition);
			this.modifierDefinitionCache.set(definitionState, handle);
			this.modifierDefinitionCount++;
		}
		return handle;
	}
	component(definitionState, owner, isOptional, debugName) {
		let definition = this.componentDefinitionCache.get(definitionState);
		if (definition === void 0) {
			let manager = getInternalComponentManager(definitionState);
			if (manager === null) {
				this.componentDefinitionCache.set(definitionState, null);
				return null;
			}
			let capabilities = capabilityFlagsFrom(manager.getCapabilities(definitionState));
			let templateFactory = getComponentTemplate(definitionState);
			let compilable = null;
			let template;
			if (!managerHasCapability(manager, capabilities, InternalComponentCapabilities.dynamicLayout)) template = templateFactory?.(owner) ?? this.defaultTemplate;
			else template = templateFactory?.(owner);
			if (template !== void 0) {
				template = unwrapTemplate(template);
				compilable = managerHasCapability(manager, capabilities, InternalComponentCapabilities.wrapped) ? template.asWrappedLayout() : template.asLayout();
			}
			definition = {
				resolvedName: null,
				handle: -1,
				manager,
				capabilities,
				state: definitionState,
				compilable
			};
			definition.handle = this.value(definition);
			if (debugName) definition.debugName = debugName;
			this.componentDefinitionCache.set(definitionState, definition);
			this.componentDefinitionCount++;
		}
		return definition;
	}
	resolvedComponent(resolvedDefinition, resolvedName) {
		let definition = this.componentDefinitionCache.get(resolvedDefinition);
		if (definition === void 0) {
			let { manager, state, template } = resolvedDefinition;
			let capabilities = capabilityFlagsFrom(manager.getCapabilities(resolvedDefinition));
			let compilable = null;
			if (!managerHasCapability(manager, capabilities, InternalComponentCapabilities.dynamicLayout)) template = template ?? this.defaultTemplate;
			if (template !== null) {
				template = unwrapTemplate(template);
				compilable = managerHasCapability(manager, capabilities, InternalComponentCapabilities.wrapped) ? template.asWrappedLayout() : template.asLayout();
			}
			definition = {
				resolvedName,
				handle: -1,
				manager,
				capabilities,
				state,
				compilable
			};
			definition.handle = this.value(definition);
			this.componentDefinitionCache.set(resolvedDefinition, definition);
			this.componentDefinitionCount++;
		}
		return expect(definition);
	}
	getValue(index) {
		return this.values[index];
	}
	getArray(index) {
		let reifiedArrs = this.reifiedArrs;
		let reified = reifiedArrs[index];
		if (reified === void 0) {
			let names = this.getValue(index);
			reified = new Array(names.length);
			for (const [i, name] of enumerate(names)) reified[i] = this.getValue(name);
			reifiedArrs[index] = reified;
		}
		return reified;
	}
};
function artifacts() {
	return {
		constants: new ConstantsImpl(),
		heap: new ProgramHeapImpl()
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/runtime/lib/mixins/-proxy.js
/**
@module ember
*/
function contentFor(proxy) {
	let content = get(proxy, "content");
	UPDATE_TAG(tagForObject(proxy), tagForObject(content));
	return content;
}
function customTagForProxy(proxy, key, addMandatorySetter) {
	let meta = tagMetaFor(proxy);
	let tag = tagFor(proxy, key, meta);
	if (key in proxy) return tag;
	else {
		let tags = [tag, tagFor(proxy, "content", meta)];
		let content = contentFor(proxy);
		if (isObject(content)) tags.push(tagForProperty(content, key, addMandatorySetter));
		return combine(tags);
	}
}
/**
`ProxyMixin` forwards all properties not defined by the proxy itself
to a proxied `content` object.  See ObjectProxy for more details.

@class ProxyMixin
@namespace Ember
@private
*/
var ProxyMixin = /*@__PURE__*/ Mixin.create({
	/**
	The object whose properties will be forwarded.
	@property content
	@type {unknown}
	@default null
	@public
	*/
	content: null,
	init() {
		this._super(...arguments);
		setProxy(this);
		tagForObject(this);
		setCustomTagFor(this, customTagForProxy);
	},
	willDestroy() {
		this.set("content", null);
		this._super(...arguments);
	},
	isTruthy: computed("content", function() {
		return Boolean(get(this, "content"));
	}),
	unknownProperty(key) {
		let content = contentFor(this);
		return content ? get(content, key) : void 0;
	},
	setUnknownProperty(key, value) {
		let m = meta(this);
		if (m.isInitializing() || m.isPrototypeMeta(this)) {
			defineProperty(this, key, null, value);
			return value;
		}
		let content = contentFor(this);
		return set(content, key, value);
	}
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/program-context-WVlzpPdi.js
var StdLib = class {
	constructor(main, trustingGuardedAppend, cautiousGuardedAppend, trustingNonDynamicAppend, cautiousNonDynamicAppend) {
		this.main = main;
		this.trustingGuardedAppend = trustingGuardedAppend;
		this.cautiousGuardedAppend = cautiousGuardedAppend;
		this.trustingNonDynamicAppend = trustingNonDynamicAppend;
		this.cautiousNonDynamicAppend = cautiousNonDynamicAppend;
	}
	get "trusting-append"() {
		return this.trustingGuardedAppend;
	}
	get "cautious-append"() {
		return this.cautiousGuardedAppend;
	}
	get "trusting-non-dynamic-append"() {
		return this.trustingNonDynamicAppend;
	}
	get "cautious-non-dynamic-append"() {
		return this.cautiousNonDynamicAppend;
	}
	getAppend(trusting) {
		return trusting ? this.trustingGuardedAppend : this.cautiousGuardedAppend;
	}
};
function main(op) {
	op(75, 4);
	invokePreparedComponent(op, false, false, true);
}
/**
* Append content to the DOM. This standard function triages content and does the
* right thing based upon whether it's a string, safe string, component, fragment
* or node.
*
* @param trusting whether to interpolate a string as raw HTML (corresponds to
* triple curlies)
*/
function StdAppend(op, trusting, nonDynamicAppend) {
	SwitchCases(op, () => op(76), (when) => {
		when(ContentType.String, () => {
			if (trusting) {
				op(68);
				op(43);
			} else op(47);
		});
		if (typeof nonDynamicAppend === "number") {
			when(ContentType.Component, () => {
				op(68);
				op(81);
				op(79);
				InvokeBareComponent(op);
			});
			when(ContentType.Helper, () => {
				CallDynamic(op, null, null, () => {
					op(3, nonDynamicAppend);
				});
			});
		} else {
			when(ContentType.Component, () => {
				op(47);
			});
			when(ContentType.Helper, () => {
				op(47);
			});
		}
		when(ContentType.SafeString, () => {
			op(68);
			op(44);
		});
		when(ContentType.Fragment, () => {
			op(68);
			op(45);
		});
		when(ContentType.Node, () => {
			op(68);
			op(46);
		});
	});
}
function compileStd(context) {
	let mainHandle = build(context, (op) => main(op));
	let trustingGuardedNonDynamicAppend = build(context, (op) => StdAppend(op, true, null));
	let cautiousGuardedNonDynamicAppend = build(context, (op) => StdAppend(op, false, null));
	return new StdLib(mainHandle, build(context, (op) => StdAppend(op, true, trustingGuardedNonDynamicAppend)), build(context, (op) => StdAppend(op, false, cautiousGuardedNonDynamicAppend)), trustingGuardedNonDynamicAppend, cautiousGuardedNonDynamicAppend);
}
var STDLIB_META = {
	symbols: {
		locals: null,
		upvars: null
	},
	moduleName: "stdlib",
	scopeValues: null,
	isStrictMode: true,
	owner: null,
	size: 0
};
function build(evaluation, builder) {
	let encoder = new EncoderImpl(evaluation.program.heap, STDLIB_META);
	function pushOp(...op) {
		encodeOp(encoder, evaluation, STDLIB_META, op);
	}
	builder(pushOp);
	let result = encoder.commit(0);
	if (typeof result !== "number") throw new Error(`Unexpected errors compiling std`);
	else return result;
}
var EvaluationContextImpl = class {
	constants;
	heap;
	resolver;
	stdlib;
	createOp;
	env;
	program;
	constructor({ constants, heap }, createOp, runtime) {
		this.constants = constants;
		this.heap = heap;
		this.resolver = runtime.resolver;
		this.createOp = createOp;
		this.env = runtime.env;
		this.program = runtime.program;
		this.stdlib = compileStd(this);
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/index-B-2NDHmt.js
/**
@module ember
*/
var disallowDynamicResolution = internalHelper(({ positional, named }) => {
	const nameOrValueRef = positional[0];
	let typeRef = named["type"];
	let locRef = named["loc"];
	let originalRef = named["original"];
	valueForRef(typeRef);
	valueForRef(locRef);
	valueForRef(originalRef);
	return createComputeRef(() => {
		return valueForRef(nameOrValueRef);
	});
});
var helper = (args) => {
	return args.positional[0];
};
var inElementNullCheckHelper = internalHelper(helper);
var normalizeClassHelper = internalHelper(({ positional }) => {
	return createComputeRef(() => {
		let classNameArg = positional[0];
		let valueArg = positional[1];
		let classNameParts = valueForRef(classNameArg).split(".");
		let className = classNameParts[classNameParts.length - 1];
		let value = valueForRef(valueArg);
		if (value === true) return dasherize(className);
		else if (!value && value !== 0) return "";
		else return String(value);
	});
});
/**
@module ember
*/
var resolve = internalHelper(({ positional }, owner) => {
	let fullNameRef = positional[0];
	let fullName = valueForRef(fullNameRef);
	return createConstRef(owner.factoryFor(fullName)?.class);
});
/**
@module ember
*/
/**
This reference is used to get the `[]` tag of iterables, so we can trigger
updates to `{{each}}` when it changes. It is put into place by a template
transform at build time, similar to the (-each-in) helper
*/
var trackArray = internalHelper(({ positional }) => {
	const inner = positional[0];
	return createComputeRef(() => {
		let iterable = valueForRef(inner);
		if (isObject(iterable)) consumeTag(tagForProperty(iterable, "[]"));
		return iterable;
	});
});
/**
@module @ember/helper
*/
/**
The `{{#each}}` keyword loops over elements in a collection. It is an extension
of the base Handlebars `{{#each}}` helper.

The default behavior of `{{#each}}` is to yield its inner block once for every
item in an array passing the item as the first block parameter.

```gjs {data-filename="app/components/developer-list.gjs"}
import Component from '@glimmer/component';

export default class DeveloperList extends Component {
developers = [
{ name: 'Yehuda' },
{ name: 'Tom' },
{ name: 'Paul' },
];

<template>
<ul>
{{#each this.developers as |person|}}
<li>Hello, {{person.name}}!</li>
{{/each}}
</ul>
</template>
}
```

The same rules apply to arrays of primitives:

```gjs {data-filename="app/components/developer-names.gjs"}
import Component from '@glimmer/component';

export default class DeveloperNames extends Component {
developerNames = ['Yehuda', 'Tom', 'Paul'];

<template>
<ul>
{{#each this.developerNames as |name|}}
<li>Hello, {{name}}!</li>
{{/each}}
</ul>
</template>
}
```

`{{#each}}` also supports native JavaScript [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
values and other iterables:

```gjs {data-filename="app/components/developer-set.gjs"}
import Component from '@glimmer/component';

export default class DeveloperSet extends Component {
developers = new Set([
{ name: 'Yehuda' },
{ name: 'Tom' },
{ name: 'Paul' },
]);

<template>
<ul>
{{#each this.developers as |person|}}
<li>Hello, {{person.name}}!</li>
{{/each}}
</ul>
</template>
}
```

During iteration, the index of each item in the array is provided as a second
block parameter:

```gjs {data-filename="app/components/developer-list-with-index.gjs"}
import Component from '@glimmer/component';

export default class DeveloperListWithIndex extends Component {
developers = [
{ name: 'Yehuda' },
{ name: 'Tom' },
{ name: 'Paul' },
];

<template>
<ul>
{{#each this.developers as |person index|}}
<li>Hello, {{person.name}}! You're number {{index}} in line</li>
{{/each}}
</ul>
</template>
}
```

`#each` is a keyword and does not need to be imported.

### Specifying Keys

In order to improve rendering speed, Ember will try to reuse the DOM elements
where possible. Specifically, if the same item is present in the array both
before and after the change, its DOM output will be reused.

The `key` option is used to tell Ember how to determine if the items in the
array being iterated over with `{{#each}}` has changed between renders. By
default the item's object identity is used.

This is usually sufficient, so in most cases, the `key` option is simply not
needed. However, in some rare cases, the objects' identities may change even
though they represent the same underlying data.

For example, mapping over `people` produces a new array of new objects on each
render. Use `key` so Ember can match items across those renders:

```gjs {data-filename="app/components/mapped-developers.gjs"}
import Component from '@glimmer/component';

export default class MappedDevelopers extends Component {
people = [
{ name: 'Yehuda' },
{ name: 'Tom' },
{ name: 'Paul' },
];

get developers() {
return this.people.map((person) => {
return { ...person, type: 'developer' };
});
}

<template>
<ul>
{{#each this.developers key="name" as |person|}}
<li>Hello, {{person.name}}!</li>
{{/each}}
</ul>
</template>
}
```

By doing so, Ember will use the value of the property specified (`person.name`
in the example) to find a "match" from the previous render. That is, if Ember
has previously seen an object from the `developers` array with a matching
name, its DOM elements will be re-used.

There are two special values for `key`:

* `@index` - The index of the item in the array.
* `@identity` - The item in the array itself.

### {{else}} condition

`{{#each}}` can have a matching `{{else}}`. The contents of this block will render
if the collection is empty.

```gjs {data-filename="app/components/available-developers.gjs"}
import Component from '@glimmer/component';

export default class AvailableDevelopers extends Component {
developers = [];

<template>
<ul>
{{#each this.developers as |person|}}
<li>{{person.name}} is available!</li>
{{else}}
<li>Sorry, nobody is available for this task.</li>
{{/each}}
</ul>
</template>
}
```

@method each
@for Keywords
@static
@noimport
@public
*/
/**
The `{{#each-in}}` keyword loops over properties on an object, or entries in a
native JavaScript [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

For example, given this component definition:

```gjs {data-filename="app/components/developer-details.gjs"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class DeveloperDetails extends Component {
@tracked developer = {
name: 'Shelly Sails',
age: 42,
};

<template>
<ul>
{{#each-in this.developer as |key value|}}
<li>{{key}}: {{value}}</li>
{{/each-in}}
</ul>
</template>
}
```

This template would display all properties on the `developer`
object in a list, outputting their name and age:

```html
<ul>
<li>name: Shelly Sails</li>
<li>age: 42</li>
</ul>
```

The same pattern works with a `Map`:

```gjs {data-filename="app/components/developer-map.gjs"}
import Component from '@glimmer/component';

export default class DeveloperMap extends Component {
map = new Map([
['name', 'Shelly Sails'],
['age', 42],
]);

<template>
<ul>
{{#each-in this.map as |key value|}}
<li>{{key}}: {{value}}</li>
{{/each-in}}
</ul>
</template>
}
```

When a `Map` uses object keys, you can pass `key="@identity"` to explicitly
track entries across re-renders using the JavaScript identity of each key:

```gjs {data-filename="app/components/object-keyed-map.gjs"}
import Component from '@glimmer/component';

export default class ObjectKeyedMap extends Component {
map = new Map([
[{ name: 'one' }, 'foo'],
[{ name: 'two' }, 'bar'],
]);

<template>
<ul>
{{#each-in this.map key="@identity" as |key value|}}
<li>{{key.name}}: {{value}}</li>
{{/each-in}}
</ul>
</template>
}
```

`#each-in` is a keyword and does not need to be imported.

@method each-in
@static
@noimport
@for Keywords
@public
@since 2.1.0
*/
var EachInWrapper = class {
	constructor(inner) {
		this.inner = inner;
	}
};
var eachIn = internalHelper(({ positional }) => {
	const inner = positional[0];
	return createComputeRef(() => {
		let iterable = valueForRef(inner);
		consumeTag(tagForObject(iterable));
		if (isProxy(iterable)) iterable = contentFor(iterable);
		return new EachInWrapper(iterable);
	});
});
/**
@module @ember/helper
*/
/**
The `mut` helper is a shortcut for updating for args.

However, defining update functions on your backing class is preferable to using `mut`.

More directly: Don't use `mut`. 

The `mut` helper, when used with `fn`, will return a function that
sets the value passed to `mut` to its first argument. As an example, we can create a
button that increments a value passing the value directly to the `fn`:

```handlebars
<MyChild @childClickCount={{this.totalClicks}} @clickCountChange={{fn (mut this.totalClicks)}} />
```

The child `Component` would invoke the function with the new click count:

```gjs {data-filename="app/components/my-child.gjs"}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MyChild extends Component {
@action
update() {
this.args.clickCountChange(this.args.childClickCount + 1);
}

<template>
<button {{on "click" this.update}}>
Click me!
</button>
</template>
}
```

The `mut` helper changes the `totalClicks` value to what was provided as the `fn` argument.

@method mut
@param {Object} [attr] the "two-way" attribute that can be modified.
@static
@for Keywords
@public
*/
var mut = internalHelper(({ positional }) => {
	let ref = positional[0];
	return createInvokableRef(ref);
});
/**
@module @ember/helper
*/
/**
The `readonly` helper let's you specify that a binding is one-way only,
instead of two-way.

This is a vestigial helper from the days of `@ember/component` and does not apply to
components extending from `@glimmer/component`.

When you pass a `readonly` binding from an outer context (e.g. parent component),
to to an inner context (e.g. child component), you are saying that changing that
property in the inner context does not change the value in the outer context.

To specify that a binding is read-only, when invoking the child `Component`:

```app/components/my-parent.js
export default class MyParent extends Component {
totalClicks = 3;
}
```

Now, when you update `childClickCount`:

```app/components/my-child.js
export default class MyChild extends Component {
click() {
this.incrementProperty('childClickCount');
}
}
```

The value updates in the child component, but not the parent component:

```app/templates/components/my-child.hbs
{{log childClickCount}} //-> 4
```

```app/templates/components/my-parent.hbs
{{log totalClicks}} //-> 3
<MyChild @childClickCount={{readonly totalClicks}} />
```
or
```app/templates/components/my-parent.hbs
{{log totalClicks}} //-> 3
{{my-child childClickCount=(readonly totalClicks)}}
```

### Objects and Arrays

When passing a property that is a complex object (e.g. object, array) instead of a primitive object (e.g. number, string),
only the reference to the object is protected using the readonly helper.
This means that you can change properties of the object both on the parent component, as well as the child component.
The `readonly` binding behaves similar to the `const` keyword in JavaScript.

Let's look at an example:

First let's set up the parent component:

```app/components/my-parent.js
import Component from '@ember/component';

export default class MyParent extends Component {
clicks: null,

init() {
this._super(...arguments);
this.set('clicks', { total: 3 });
}
}
```

```app/templates/components/my-parent.hbs
{{log clicks.total}} //-> 3
<MyChild @childClicks={{readonly clicks}} />
```
```app/templates/components/my-parent.hbs
{{log clicks.total}} //-> 3
{{my-child childClicks=(readonly clicks)}}
```

Now, if you update the `total` property of `childClicks`:

```app/components/my-child.js
import Component from '@ember/component';

export default class MyChild extends Component {
click() {
this.get('clicks').incrementProperty('total');
}
}
```

You will see the following happen:

```app/templates/components/my-parent.hbs
{{log clicks.total}} //-> 4
<MyChild @childClicks={{readonly clicks}} />
```
or
```app/templates/components/my-parent.hbs
{{log clicks.total}} //-> 4
{{my-child childClicks=(readonly clicks)}}
```

```app/templates/components/my-child.hbs
{{log childClicks.total}} //-> 4
```

@method readonly
@param {Object} [attr] the read-only attribute.
@for Keywords
@noimport
@static
@private
*/
var readonly = internalHelper(({ positional }) => {
	let firstArg = positional[0];
	return createReadOnlyRef(firstArg);
});
/**
@module @ember/helper
*/
/**
The `{{unbound}}` helper disconnects the one-way binding of a property,
essentially freezing its value at the moment of rendering. For example,
in this example the display of the variable `name` will not change even
if it is set with a new value:

```handlebars
{{unbound this.name}}
```

Like any helper, the `unbound` helper can accept a nested helper expression.
This allows for custom helpers to be rendered unbound:

```handlebars
{{unbound (some-custom-helper)}}
{{unbound (capitalize this.name)}}
{{! You can use any helper, including unbound, in a nested expression }}
{{capitalize (unbound this.name)}}
```

The `unbound` helper only accepts a single argument, and it return an
unbound value.

`unbound` is a template keyword and does not need to be imported.

@method unbound
@static
@noimport
@for Keywords
@public
*/
var unbound = internalHelper(({ positional, named }) => {
	return createUnboundRef(valueForRef(positional[0]));
});
function instrumentationPayload(name) {
	return { object: `component:${name}` };
}
function componentFor(name, owner) {
	let fullName = `component:${name}`;
	return owner.factoryFor(fullName) || null;
}
function lookupComponentPair(owner, name) {
	let component = componentFor(name, owner);
	if (isFactory(component) && component.class) {
		let layout = getComponentTemplate(component.class);
		if (layout !== void 0) return {
			component,
			layout
		};
	}
	if (component === null) return null;
	else return {
		component,
		layout: null
	};
}
var BUILTIN_KEYWORD_HELPERS = {
	mut,
	readonly,
	unbound,
	"-hash": hash,
	"-each-in": eachIn,
	"-normalize-class": normalizeClassHelper,
	"-resolve": resolve,
	"-track-array": trackArray,
	"-in-el-null": inElementNullCheckHelper
};
var BUILTIN_HELPERS = {
	...BUILTIN_KEYWORD_HELPERS,
	array,
	concat,
	fn,
	get: get$1,
	hash,
	"unique-id": uniqueId,
	"-disallow-dynamic-resolution": disallowDynamicResolution
};
var BUILTIN_KEYWORD_MODIFIERS = {};
var BUILTIN_MODIFIERS = {
	...BUILTIN_KEYWORD_MODIFIERS,
	on
};
var ResolverImpl = class {
	componentDefinitionCache = /* @__PURE__ */ new Map();
	lookupPartial() {
		return null;
	}
	lookupHelper(name, owner) {
		let helper = BUILTIN_HELPERS[name];
		if (helper !== void 0) return helper;
		let factory = owner.factoryFor(`helper:${name}`);
		if (factory === void 0) return null;
		let definition = factory.class;
		if (definition === void 0) return null;
		if (typeof definition === "function" && isClassicHelper(definition)) {
			let manager = getInternalHelperManager(definition);
			setInternalHelperManager(manager, factory);
			return factory;
		}
		return definition;
	}
	lookupBuiltInHelper(name) {
		return BUILTIN_KEYWORD_HELPERS[name] ?? null;
	}
	lookupModifier(name, owner) {
		let builtin = BUILTIN_MODIFIERS[name];
		if (builtin !== void 0) return builtin;
		let modifier = owner.factoryFor(`modifier:${name}`);
		if (modifier === void 0) return null;
		return modifier.class || null;
	}
	lookupBuiltInModifier(name) {
		return BUILTIN_KEYWORD_MODIFIERS[name] ?? null;
	}
	lookupComponent(name, owner) {
		let pair = lookupComponentPair(owner, name);
		if (pair === null) return null;
		let template = null;
		let key;
		if (pair.component === null) key = template = pair.layout(owner);
		else key = pair.component;
		let cachedComponentDefinition = this.componentDefinitionCache.get(key);
		if (cachedComponentDefinition !== void 0) return cachedComponentDefinition;
		if (template === null && pair.layout !== null) template = pair.layout(owner);
		let finalizer = _instrumentStart("render.getComponentDefinition", instrumentationPayload, name);
		let definition = null;
		if (pair.component === null) definition = {
			state: templateOnlyComponent(void 0, name),
			manager: TEMPLATE_ONLY_COMPONENT_MANAGER,
			template
		};
		else {
			let factory = pair.component;
			let ComponentClass = factory.class;
			let manager = getInternalComponentManager(ComponentClass);
			definition = {
				state: isCurlyManager(manager) ? factory : ComponentClass,
				manager,
				template
			};
		}
		finalizer();
		this.componentDefinitionCache.set(key, definition);
		return definition;
	}
};
function toIterator(iterable) {
	if (iterable instanceof EachInWrapper) return toEachInIterator(iterable.inner);
	else return toEachIterator(iterable);
}
function toEachInIterator(iterable) {
	if (!isIndexable(iterable)) return null;
	if (Array.isArray(iterable) || isEmberArray(iterable)) return ObjectIterator.fromIndexable(iterable);
	else if (isNativeIterable(iterable)) return MapLikeNativeIterator.from(iterable);
	else if (hasForEach(iterable)) return ObjectIterator.fromForEachable(iterable);
	else return ObjectIterator.fromIndexable(iterable);
}
function toEachIterator(iterable) {
	if (!isObject(iterable)) return null;
	if (Array.isArray(iterable)) return ArrayIterator.from(iterable);
	else if (isEmberArray(iterable)) return EmberArrayIterator.from(iterable);
	else if (isNativeIterable(iterable)) return ArrayLikeNativeIterator.from(iterable);
	else if (hasForEach(iterable)) return ArrayIterator.fromForEachable(iterable);
	else return null;
}
var BoundedIterator = class {
	position = 0;
	constructor(length) {
		this.length = length;
	}
	isEmpty() {
		return false;
	}
	memoFor(position) {
		return position;
	}
	next() {
		let { length, position } = this;
		if (position >= length) return null;
		let value = this.valueFor(position);
		let memo = this.memoFor(position);
		this.position++;
		return {
			value,
			memo
		};
	}
};
var ArrayIterator = class extends BoundedIterator {
	static from(iterable) {
		return iterable.length > 0 ? new this(iterable) : null;
	}
	static fromForEachable(object) {
		let array = [];
		object.forEach((item) => array.push(item));
		return this.from(array);
	}
	constructor(array) {
		super(array.length);
		this.array = array;
	}
	valueFor(position) {
		return this.array[position];
	}
};
var EmberArrayIterator = class extends BoundedIterator {
	static from(iterable) {
		return iterable.length > 0 ? new this(iterable) : null;
	}
	constructor(array) {
		super(array.length);
		this.array = array;
	}
	valueFor(position) {
		return objectAt(this.array, position);
	}
};
var ObjectIterator = class extends BoundedIterator {
	static fromIndexable(obj) {
		let keys = Object.keys(obj);
		if (keys.length === 0) return null;
		else {
			let values = [];
			for (let key of keys) {
				let value;
				value = obj[key];
				if (isTracking()) {
					consumeTag(tagFor(obj, key));
					if (Array.isArray(value)) consumeTag(tagFor(value, "[]"));
				}
				values.push(value);
			}
			return new this(keys, values);
		}
	}
	static fromForEachable(obj) {
		let keys = [];
		let values = [];
		let length = 0;
		let isMapLike = false;
		obj.forEach(function(value, key) {
			isMapLike = isMapLike || arguments.length >= 2;
			if (isMapLike) keys.push(key);
			values.push(value);
			length++;
		});
		if (length === 0) return null;
		else if (isMapLike) return new this(keys, values);
		else return new ArrayIterator(values);
	}
	constructor(keys, values) {
		super(values.length);
		this.keys = keys;
		this.values = values;
	}
	valueFor(position) {
		return this.values[position];
	}
	memoFor(position) {
		return this.keys[position];
	}
};
var NativeIterator = class {
	static from(iterable) {
		let iterator = iterable[Symbol.iterator]();
		let result = iterator.next();
		let { done } = result;
		if (done) return null;
		else return new this(iterator, result);
	}
	position = 0;
	constructor(iterable, result) {
		this.iterable = iterable;
		this.result = result;
	}
	isEmpty() {
		return false;
	}
	next() {
		let { iterable, result, position } = this;
		if (result.done) return null;
		let value = this.valueFor(result, position);
		let memo = this.memoFor(result, position);
		this.position++;
		this.result = iterable.next();
		return {
			value,
			memo
		};
	}
};
var ArrayLikeNativeIterator = class extends NativeIterator {
	valueFor(result) {
		return result.value;
	}
	memoFor(_result, position) {
		return position;
	}
};
var MapLikeNativeIterator = class extends NativeIterator {
	valueFor(result) {
		return result.value[1];
	}
	memoFor(result) {
		return result.value[0];
	}
};
function hasForEach(value) {
	return value != null && typeof value["forEach"] === "function";
}
function isNativeIterable(value) {
	return value != null && typeof value[Symbol.iterator] === "function";
}
function isIndexable(value) {
	return value !== null && (typeof value === "object" || typeof value === "function");
}
function toBool(predicate) {
	if (isProxy(predicate)) {
		consumeTag(tagForProperty(predicate, "content"));
		return Boolean(get(predicate, "isTruthy"));
	} else if (isArray(predicate)) {
		consumeTag(tagForProperty(predicate, "[]"));
		return predicate.length !== 0;
	} else if (isHTMLSafe(predicate)) return Boolean(predicate.toString());
	else return Boolean(predicate);
}
setGlobalContext({
	scheduleRevalidate() {
		_backburner.ensureInstance();
	},
	toBool,
	toIterator,
	getProp: _getProp,
	setProp: _setProp,
	getPath: get,
	setPath: set,
	scheduleDestroy(destroyable, destructor) {
		schedule("actions", null, destructor, destroyable);
	},
	scheduleDestroyed(finalizeDestructor) {
		schedule("destroy", null, finalizeDestructor);
	},
	warnIfStyleNotTrusted(value) {},
	assert(test, msg, options) {},
	deprecate(msg, test, options) {}
});
var EmberEnvironmentDelegate = class {
	enableDebugTooling = ENV._DEBUG_RENDER_TREE;
	constructor(owner, isInteractive) {
		this.owner = owner;
		this.isInteractive = isInteractive;
	}
	onTransactionCommit() {}
};
var NO_OP = () => {};
function errorLoopTransaction(fn) {
	return fn;
}
/**
* The interface the `RendererState` needs from a render root. The base
* renderer only ever creates `ComponentRootState`s; the classic renderer
* (`./renderer`) adds `ClassicRootState` for outlet/classic-component roots.
*/
var ComponentRootState = class {
	type = "component";
	#result;
	#render;
	constructor(state, definition, options) {
		this.#render = errorLoopTransaction(() => {
			let iterator = renderComponent$1(state.context, state.builder(state.env, options.into), state.owner, definition, options?.args);
			let result = this.#result = iterator.sync();
			associateDestroyableChild(this, this.#result);
			this.#render = errorLoopTransaction(() => {
				if (isDestroying(result) || isDestroyed(result)) return;
				return result.rerender({ alwaysRevalidate: false });
			});
		});
	}
	isFor(_possibleRoot) {
		return false;
	}
	render() {
		this.#render();
	}
	destroy() {
		destroy(this);
	}
	get destroyed() {
		return isDestroyed(this);
	}
	get result() {
		return this.#result;
	}
};
var renderers = [];
function _resetRenderers() {
	renderers.length = 0;
}
function register(renderer) {
	renderers.push(renderer);
}
function deregister(renderer) {
	let index = renderers.indexOf(renderer);
	renderers.splice(index, 1);
}
function loopBegin() {
	for (let renderer of renderers) renderer.rerender();
}
var renderSettledDeferred = null;
function renderSettled() {
	if (renderSettledDeferred === null) {
		let resolve;
		renderSettledDeferred = {
			promise: new Promise((r) => resolve = r),
			resolve
		};
		if (!_getCurrentRunLoop()) _backburner.schedule("actions", null, NO_OP);
	}
	return renderSettledDeferred.promise;
}
function resolveRenderPromise() {
	if (renderSettledDeferred !== null) {
		let resolve = renderSettledDeferred.resolve;
		renderSettledDeferred = null;
		_backburner.join(null, resolve);
	}
}
var loops = 0;
function loopEnd() {
	for (let renderer of renderers) if (!renderer.isValid()) {
		if (loops > ENV._RERENDER_LOOP_LIMIT) {
			loops = 0;
			renderer.destroy();
			throw new Error("infinite rendering invalidation detected");
		}
		loops++;
		return _backburner.join(null, NO_OP);
	}
	loops = 0;
	resolveRenderPromise();
}
_backburner.on("begin", loopBegin);
_backburner.on("end", loopEnd);
var RendererState = class RendererState {
	static create(data, renderer) {
		const state = new RendererState(data, renderer);
		associateDestroyableChild(renderer, state);
		return state;
	}
	#data;
	#lastRevision = -1;
	#inRenderTransaction = false;
	#destroyed = false;
	#roots = [];
	#removedRoots = [];
	constructor(data, renderer) {
		this.#data = data;
		registerDestructor(this, () => {
			this.clearAllRoots(renderer);
		});
	}
	get debug() {
		return {
			roots: this.#roots,
			inRenderTransaction: this.#inRenderTransaction,
			isInteractive: this.isInteractive
		};
	}
	get roots() {
		return this.#roots;
	}
	get owner() {
		return this.#data.owner;
	}
	get builder() {
		return this.#data.builder;
	}
	get context() {
		return this.#data.context;
	}
	get env() {
		return this.context.env;
	}
	get isInteractive() {
		return this.#data.context.env.isInteractive;
	}
	renderRoot(root, renderer) {
		let roots = this.#roots;
		roots.push(root);
		associateDestroyableChild(this, root);
		if (roots.length === 1) register(renderer);
		this.#renderRootsTransaction(renderer);
		return root;
	}
	#renderRootsTransaction(renderer) {
		if (this.#inRenderTransaction) return;
		this.#inRenderTransaction = true;
		let completedWithoutError = false;
		try {
			this.renderRoots(renderer);
			completedWithoutError = true;
		} finally {
			if (!completedWithoutError) this.#lastRevision = valueForTag(CURRENT_TAG);
			this.#inRenderTransaction = false;
		}
	}
	renderRoots(renderer) {
		let roots = this.#roots;
		let removedRoots = this.#removedRoots;
		let initialRootsLength;
		do {
			initialRootsLength = roots.length;
			inTransaction(this.context.env, () => {
				for (let i = 0; i < roots.length; i++) {
					let root = roots[i];
					if (root.destroyed) {
						removedRoots.push(root);
						continue;
					}
					if (i >= initialRootsLength) continue;
					root.render();
				}
				this.#lastRevision = valueForTag(CURRENT_TAG);
			});
		} while (roots.length > initialRootsLength);
		while (removedRoots.length) {
			let root = removedRoots.pop();
			let rootIndex = roots.indexOf(root);
			roots.splice(rootIndex, 1);
		}
		if (this.#roots.length === 0) deregister(renderer);
	}
	scheduleRevalidate(renderer) {
		_backburner.scheduleOnce("render", this, this.revalidate, renderer);
	}
	isValid() {
		return this.#destroyed || this.#roots.length === 0 || validateTag(CURRENT_TAG, this.#lastRevision);
	}
	revalidate(renderer) {
		if (this.isValid()) return;
		this.#renderRootsTransaction(renderer);
	}
	clearAllRoots(renderer) {
		let roots = this.#roots;
		for (let root of roots) destroy(root);
		this.#removedRoots.length = 0;
		this.#roots = [];
		if (roots.length) deregister(renderer);
	}
};
/**
* The returned object from `renderComponent`
* @public
* @module @ember/renderer
*/
function intoTarget(into) {
	if ("element" in into) return into;
	else return {
		element: into,
		nextSibling: null
	};
}
/**
* Render a component into a DOM element.
*
* @method renderComponent
* @static
* @for @ember/renderer
* @param {Object} component The component to render.
* @param {Object} options
* @param {Element} options.into Where to render the component in to.
* @param {Object} [options.owner] Optionally specify the owner to use. This will be used for injections, and overall cleanup.
* @param {Object} [options.env] Optional renderer configuration
* @param {Object} [options.args] Optionally pass args in to the component. These may be reactive as long as it is an object or object-like
* @public
*/
function renderComponent(component, { owner = {}, env, into, args }) {
	/**
	* SAFETY: we should figure out what we need out of a `document` and narrow the API.
	*         this exercise should also end up beginning to define what we need for CLI rendering (or to other outputs)
	*/
	let document = env && "document" in env ? env?.["document"] : globalThis.document;
	let renderer = RENDERER_CACHE.get(owner);
	if (!renderer) {
		renderer = BaseRenderer.strict(owner, document, {
			...env,
			isInteractive: env?.isInteractive ?? true,
			hasDOM: env && "hasDOM" in env ? Boolean(env?.["hasDOM"]) : true
		});
		RENDERER_CACHE.set(owner, renderer);
	}
	/**
	* Replace all contents, if we've rendered multiple times.
	*
	* https://github.com/emberjs/rfcs/pull/1099/files#diff-2b962105b9083ca84579cdc957f27f49407440f3c5078083fa369ec18cc46da8R365
	*
	* We could later add an option to not do this behavior
	*
	* NOTE: destruction is async
	*/
	let existing = RENDER_CACHE.get(into);
	existing?.result.destroy();
	/**
	* We can only replace the inner HTML the first time.
	* Because destruction is async, it won't be safe to
	* do this again, and we'll have to rely on the above destroy.
	*/
	if (!existing && into instanceof Element) into.innerHTML = "";
	/**
	* If there's an existing render result with valid bounds, use its
	* firstNode as the nextSibling so that new content is inserted at
	* the same DOM position. This ensures stable ordering when multiple
	* renderComponent calls target the same element and one is re-invoked
	* (e.g., due to tracked dependency changes).
	*
	* The old content's DOM nodes are still present (destruction is async),
	* so firstNode() is a valid position reference. The new content is placed
	* BEFORE the old content. When the old content is eventually destroyed
	* (async clear of bounds), the new content remains in the correct position.
	*/
	let renderTarget = into;
	if (existing?.glimmerResult) renderTarget = {
		element: into instanceof Element ? into : into.element,
		nextSibling: existing.glimmerResult.firstNode()
	};
	let innerResult = renderer.render(component, {
		into: renderTarget,
		args
	}).result;
	if (innerResult) associateDestroyableChild(owner, innerResult);
	let result = { destroy() {
		if (innerResult) destroy(innerResult);
	} };
	RENDER_CACHE.set(into, {
		result,
		glimmerResult: innerResult
	});
	return result;
}
var RENDER_CACHE = /* @__PURE__ */ new WeakMap();
var RENDERER_CACHE = /* @__PURE__ */ new WeakMap();
var BaseRenderer = class BaseRenderer {
	static strict(owner, document, options) {
		return new BaseRenderer(owner, {
			hasDOM,
			...options
		}, document, new ResolverImpl(), clientBuilder);
	}
	state;
	constructor(owner, envOptions, document, resolver, builder) {
		let sharedArtifacts = artifacts();
		/**
		* SAFETY: are there consequences for being looser with *this* owner?
		*         the public API for `owner` is kinda `Partial<InternalOwner>`
		*         aka: implement only what you need.
		*         But for actual ember apps, you *need* to implement everything
		*         an app needs (which will actually change and become less over time)
		*/
		let env = new EmberEnvironmentDelegate(owner, envOptions.isInteractive);
		let context = new EvaluationContextImpl(sharedArtifacts, (heap) => new RuntimeOpImpl(heap), runtimeOptions({ document }, env, sharedArtifacts, resolver));
		this.state = RendererState.create({
			owner,
			context,
			builder
		}, this);
	}
	get debugRenderTree() {
		let { debugRenderTree } = this.state.env;
		return debugRenderTree;
	}
	isValid() {
		return this.state.isValid();
	}
	destroy() {
		destroy(this);
	}
	render(component, options) {
		const root = new ComponentRootState(this.state, component, {
			args: options.args,
			into: intoTarget(options.into)
		});
		return this.state.renderRoot(root, this);
	}
	rerender() {
		this.state.scheduleRevalidate(this);
	}
};
//#endregion
export { ResettableBlockImpl as A, setDebuggerCallback as C, NS_SVG as D, DynamicAttribute as E, clientBuilder as M, dynamicAttribute as N, NewTreeBuilder as O, runtimeOptions as S, DOMTreeConstruction as T, isWhitespace as _, renderComponent as a, renderSync as b, contentFor as c, DynamicScopeImpl as d, EnvironmentImpl as f, inTransaction as g, UpdatingVM as h, errorLoopTransaction as i, SimpleDynamicAttribute as j, RemoteBlock as k, DOMChanges as l, ScopeImpl as m, ResolverImpl as n, renderSettled as o, LowLevelVM as p, _resetRenderers as r, ProxyMixin as s, BaseRenderer as t, DOMChangesImpl as u, renderComponent$1 as v, reference_exports as w, resetDebuggerCallback as x, renderMain as y };
