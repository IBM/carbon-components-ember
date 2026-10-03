import { l as toBool } from "./global-context-D1MXNkcp.js";
import { i as destroy, l as registerDestructor, r as associateDestroyableChild } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, _ as consumeTag, a as CURRENT_TAG, i as CONSTANT_TAG, j as valueForTag, p as beginTrackFrame, x as endTrackFrame } from "./cache-CofLhaS4-CWmaBWeq.js";
import { a as expect, f as unwrap, l as isIndexable$1, r as dict, t as StackImpl } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { S as valueForRef, a as NULL_REFERENCE, c as UNDEFINED_REFERENCE, d as createComputeRef, f as createConstRef, h as createPrimitiveRef, i as FALSE_REFERENCE, o as REFERENCE, s as TRUE_REFERENCE, v as isConstRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { a as InternalComponentCapabilities, i as managerHasCapability } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
import { i as getInternalModifierManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { n as decodeHandle, o as isHandle, r as decodeImmediate } from "./syscall-ops-CkPT1Kfx-C_CJ523J.js";
import { t as setLocalDebugType } from "./debug-brand-B1TWjOCH-CWncGHWi.js";
import { a as assert, c as EMPTY_STRING_ARRAY, l as emptyArray, t as assign, u as enumerate } from "./object-utils-AijlD-JH-xdA72BiZ.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/template-BRrQR6KS.js
function unwrapHandle(handle) {
	if (typeof handle === "number") return handle;
	else {
		let error = handle.errors[0];
		throw new Error(`Compile Error: ${error.problem} @ ${error.span.start}..${error.span.end}`);
	}
}
function unwrapTemplate(template) {
	if (template.result === "error") throw new Error(`Compile Error: ${template.problem} @ ${template.span.start}..${template.span.end}`);
	return template;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/normalize-C_IStty9.js
var CursorImpl = class {
	constructor(element, nextSibling) {
		this.element = element;
		this.nextSibling = nextSibling;
		setLocalDebugType("cursor", this);
	}
};
var ConcreteBounds = class {
	constructor(parentNode, first, last) {
		this.parentNode = parentNode;
		this.first = first;
		this.last = last;
	}
	parentElement() {
		return this.parentNode;
	}
	firstNode() {
		return this.first;
	}
	lastNode() {
		return this.last;
	}
};
function move(bounds, reference) {
	let parent = bounds.parentElement();
	let first = bounds.firstNode();
	let last = bounds.lastNode();
	let current = first;
	while (true) {
		let next = current.nextSibling;
		parent.insertBefore(current, reference);
		if (current === last) return next;
		current = expect(next);
	}
}
function clear(bounds) {
	let parent = bounds.parentElement();
	let first = bounds.firstNode();
	let last = bounds.lastNode();
	let current = first;
	while (true) {
		let next = current.nextSibling;
		parent.removeChild(current);
		if (current === last) return next;
		current = expect(next);
	}
}
function normalizeStringValue(value) {
	if (isEmpty(value)) return "";
	return String(value);
}
function shouldCoerce(value) {
	return isString(value) || isEmpty(value) || typeof value === "boolean" || typeof value === "number";
}
function isEmpty(value) {
	return value === null || value === void 0 || typeof value.toString !== "function";
}
function isIndexable(value) {
	return value !== null && typeof value === "object";
}
function isSafeString(value) {
	return isIndexable(value) && typeof value["toHTML"] === "function";
}
function isNode(value) {
	return isIndexable(value) && typeof value["nodeType"] === "number";
}
function isFragment(value) {
	return isIndexable(value) && value["nodeType"] === 11;
}
function isString(value) {
	return typeof value === "string";
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/arguments-Carzx7C4.js
var CheckRegister = new class {
	validate(value) {
		switch (value) {
			case 4:
			case 5:
			case 3:
			case 2:
			case 1:
			case 0:
			case 6:
			case 7:
			case 8: return true;
			default: return false;
		}
	}
	expected() {
		return `Register`;
	}
}();
/*@__NO_SIDE_EFFECTS__*/
function check(value, checker, message) {
	return value;
}
/** @internal */
function hasCustomDebugRenderTreeLifecycle(manager) {
	return "getDebugCustomRenderTree" in manager;
}
function resolveComponent(resolver, constants, name, owner) {
	let definition = resolver?.lookupComponent?.(name, expect(owner)) ?? null;
	return constants.resolvedComponent(definition, name);
}
var TYPE = Symbol("TYPE");
var INNER = Symbol("INNER");
var OWNER = Symbol("OWNER");
var ARGS = Symbol("ARGS");
var RESOLVED = Symbol("RESOLVED");
var CURRIED_VALUES = /* @__PURE__ */ new WeakSet();
function isCurriedValue(value) {
	return CURRIED_VALUES.has(value);
}
function isCurriedType(value, type) {
	return isCurriedValue(value) && value[TYPE] === type;
}
var CurriedValue = class {
	[TYPE];
	[INNER];
	[OWNER];
	[ARGS];
	[RESOLVED];
	/** @internal */
	constructor(type, inner, owner, args, resolved = false) {
		CURRIED_VALUES.add(this);
		this[TYPE] = type;
		this[INNER] = inner;
		this[OWNER] = owner;
		this[ARGS] = args;
		this[RESOLVED] = resolved;
	}
};
function resolveCurriedValue(curriedValue) {
	let currentWrapper = curriedValue;
	let positional;
	let named;
	let definition, owner, resolved;
	while (true) {
		let { [ARGS]: curriedArgs, [INNER]: inner } = currentWrapper;
		if (curriedArgs !== null) {
			let { named: curriedNamed, positional: curriedPositional } = curriedArgs;
			if (curriedPositional.length > 0) positional = positional === void 0 ? curriedPositional : curriedPositional.concat(positional);
			if (named === void 0) named = [];
			named.unshift(curriedNamed);
		}
		if (!isCurriedValue(inner)) {
			definition = inner;
			owner = currentWrapper[OWNER];
			resolved = currentWrapper[RESOLVED];
			break;
		}
		currentWrapper = inner;
	}
	return {
		definition,
		owner,
		resolved,
		positional,
		named
	};
}
function curry(type, spec, owner, args, resolved = false) {
	return new CurriedValue(type, spec, owner, args, resolved);
}
var GUID = 0;
var Ref = class {
	id = GUID++;
	value;
	constructor(value) {
		this.value = value;
	}
	get() {
		return this.value;
	}
	release() {
		this.value = null;
	}
	toString() {
		let label = `Ref ${this.id}`;
		if (this.value === null) return `${label} (released)`;
		else try {
			return `${label}: ${this.value}`;
		} catch {
			return label;
		}
	}
};
var DebugRenderTreeImpl = class {
	stack = new StackImpl();
	refs = /* @__PURE__ */ new WeakMap();
	roots = /* @__PURE__ */ new Set();
	nodes = /* @__PURE__ */ new WeakMap();
	begin() {
		this.reset();
	}
	create(state, node) {
		let internalNode = assign({}, node, {
			bounds: null,
			refs: /* @__PURE__ */ new Set()
		});
		this.nodes.set(state, internalNode);
		this.appendChild(internalNode, state);
		this.enter(state);
	}
	update(state) {
		this.enter(state);
	}
	didRender(state, bounds) {
		this.nodeFor(state).bounds = bounds;
		this.exit();
	}
	willDestroy(state) {
		expect(this.refs.get(state)).release();
	}
	commit() {
		this.reset();
	}
	capture() {
		return this.captureRefs(this.roots);
	}
	reset() {
		if (this.stack.size !== 0) {
			let root = expect(this.stack.toArray()[0]);
			let ref = this.refs.get(root);
			if (ref !== void 0) this.roots.delete(ref);
			while (!this.stack.isEmpty()) this.stack.pop();
		}
	}
	enter(state) {
		this.stack.push(state);
	}
	exit() {
		this.stack.pop();
	}
	nodeFor(state) {
		return expect(this.nodes.get(state));
	}
	appendChild(node, state) {
		let parent = this.stack.current;
		let ref = new Ref(state);
		this.refs.set(state, ref);
		if (parent) {
			let parentNode = this.nodeFor(parent);
			parentNode.refs.add(ref);
			node.parent = parentNode;
		} else this.roots.add(ref);
	}
	captureRefs(refs) {
		let captured = [];
		refs.forEach((ref) => {
			let state = ref.get();
			if (state) captured.push(this.captureNode(`render-node:${ref.id}`, state));
			else refs.delete(ref);
		});
		return captured;
	}
	captureNode(id, state) {
		let node = this.nodeFor(state);
		let { type, name, args, instance, refs } = node;
		let bounds = this.captureBounds(node);
		let children = this.captureRefs(refs);
		return {
			id,
			type,
			name,
			args: reifyArgsDebug(args),
			instance,
			bounds,
			children
		};
	}
	captureBounds(node) {
		let bounds = expect(node.bounds);
		return {
			parentElement: bounds.parentElement(),
			firstNode: bounds.firstNode(),
			lastNode: bounds.lastNode()
		};
	}
};
function getDebugName(definition, manager = definition.manager) {
	return definition.resolvedName ?? definition.debugName ?? manager.getDebugName(definition.state);
}
var AppendOpcodes = class {
	evaluateOpcode = new Array(113).fill(null);
	constructor() {}
	add(name, evaluate, kind = "syscall") {
		this.evaluateOpcode[name] = {
			syscall: kind !== "machine",
			evaluate
		};
	}
	evaluate(vm, opcode, type) {
		let operation = unwrap(this.evaluateOpcode[type]);
		if (operation.syscall) {
			assert(!opcode.isMachine, `BUG: Mismatch between operation.syscall (${operation.syscall}) and opcode.isMachine (${opcode.isMachine}) for ${opcode.type}`);
			operation.evaluate(vm, opcode);
		} else {
			assert(opcode.isMachine, `BUG: Mismatch between operation.syscall (${operation.syscall}) and opcode.isMachine (${opcode.isMachine}) for ${opcode.type}`);
			operation.evaluate(vm.lowlevel, opcode);
		}
	}
};
function externs(vm) {}
var APPEND_OPCODES = new AppendOpcodes();
function createClassListRef(list) {
	return createComputeRef(() => {
		let ret = [];
		for (const ref of list) {
			let value = normalizeStringValue(typeof ref === "string" ? ref : valueForRef(ref));
			if (value) ret.push(value);
		}
		return ret.length === 0 ? null : ret.join(" ");
	});
}
APPEND_OPCODES.add(39, (vm) => vm.pushChildScope());
APPEND_OPCODES.add(40, (vm) => vm.popScope());
APPEND_OPCODES.add(59, (vm) => vm.pushDynamicScope());
APPEND_OPCODES.add(60, (vm) => vm.popDynamicScope());
APPEND_OPCODES.add(28, (vm, { op1: other }) => {
	vm.stack.push(vm.constants.getValue(decodeHandle(other)));
});
APPEND_OPCODES.add(29, (vm, { op1: other }) => {
	vm.stack.push(createConstRef(vm.constants.getValue(decodeHandle(other))));
});
APPEND_OPCODES.add(30, (vm, { op1: primitive }) => {
	let stack = vm.stack;
	if (isHandle(primitive)) {
		let value = vm.constants.getValue(decodeHandle(primitive));
		stack.push(value);
	} else stack.push(decodeImmediate(primitive));
});
APPEND_OPCODES.add(31, (vm) => {
	let stack = vm.stack;
	let value = /* @__PURE__ */ check(stack.pop());
	let ref;
	if (value === void 0) ref = UNDEFINED_REFERENCE;
	else if (value === null) ref = NULL_REFERENCE;
	else if (value === true) ref = TRUE_REFERENCE;
	else if (value === false) ref = FALSE_REFERENCE;
	else ref = createPrimitiveRef(value);
	stack.push(ref);
});
APPEND_OPCODES.add(33, (vm, { op1: register, op2: offset }) => {
	let position = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister))) - offset;
	vm.stack.dup(position);
});
APPEND_OPCODES.add(34, (vm, { op1: count }) => {
	vm.stack.pop(count);
});
APPEND_OPCODES.add(35, (vm, { op1: register }) => {
	vm.load(/* @__PURE__ */ check(register));
});
APPEND_OPCODES.add(36, (vm, { op1: register }) => {
	vm.fetch(/* @__PURE__ */ check(register));
});
APPEND_OPCODES.add(58, (vm, { op1: _names }) => {
	let names = vm.constants.getArray(_names);
	vm.bindDynamicScope(names);
});
APPEND_OPCODES.add(69, (vm, { op1: args }) => {
	vm.enter(args);
});
APPEND_OPCODES.add(70, (vm) => {
	vm.exit();
});
APPEND_OPCODES.add(63, (vm, { op1: _table }) => {
	vm.stack.push(vm.constants.getValue(_table));
});
APPEND_OPCODES.add(62, (vm) => {
	vm.stack.push(vm.scope());
});
APPEND_OPCODES.add(61, (vm) => {
	let stack = vm.stack;
	let block = stack.pop();
	if (block) stack.push(vm.compile(block));
	else stack.push(null);
});
APPEND_OPCODES.add(64, (vm) => {
	let { stack } = vm;
	let handle = /* @__PURE__ */ check(stack.pop());
	let scope = /* @__PURE__ */ check(stack.pop());
	let table = /* @__PURE__ */ check(stack.pop());
	let args = /* @__PURE__ */ check(stack.pop());
	if (table === null || handle === null) {
		vm.lowlevel.pushFrame();
		vm.pushScope(scope ?? vm.scope());
		return;
	}
	let invokingScope = expect(scope);
	{
		let locals = table.parameters;
		let localsCount = locals.length;
		if (localsCount > 0) {
			invokingScope = invokingScope.child();
			for (let i = 0; i < localsCount; i++) invokingScope.bindSymbol(unwrap(locals[i]), args.at(i));
		}
	}
	vm.lowlevel.pushFrame();
	vm.pushScope(invokingScope);
	vm.call(handle);
});
APPEND_OPCODES.add(66, (vm, { op1: target }) => {
	let reference = /* @__PURE__ */ check(vm.stack.pop());
	let value = Boolean(valueForRef(reference));
	if (isConstRef(reference)) {
		if (!value) vm.lowlevel.goto(target);
	} else {
		if (!value) vm.lowlevel.goto(target);
		vm.updateWith(new Assert(reference));
	}
});
APPEND_OPCODES.add(67, (vm, { op1: target, op2: comparison }) => {
	if (/* @__PURE__ */ check(vm.stack.peek()) === comparison) vm.lowlevel.goto(target);
});
APPEND_OPCODES.add(68, (vm) => {
	let reference = /* @__PURE__ */ check(vm.stack.peek());
	if (!isConstRef(reference)) vm.updateWith(new Assert(reference));
});
APPEND_OPCODES.add(71, (vm) => {
	let { stack } = vm;
	let valueRef = /* @__PURE__ */ check(stack.pop());
	stack.push(createComputeRef(() => toBool(valueForRef(valueRef))));
});
var Assert = class {
	last;
	constructor(ref) {
		this.ref = ref;
		this.last = valueForRef(ref);
	}
	evaluate(vm) {
		let { last, ref } = this;
		if (last !== valueForRef(ref)) vm.throw();
	}
};
var AssertFilter = class {
	last;
	constructor(ref, filter) {
		this.ref = ref;
		this.filter = filter;
		this.last = filter(valueForRef(ref));
	}
	evaluate(vm) {
		let { last, ref, filter } = this;
		if (last !== filter(valueForRef(ref))) vm.throw();
	}
};
var JumpIfNotModifiedOpcode = class {
	tag = CONSTANT_TAG;
	lastRevision = 1;
	target;
	finalize(tag, target) {
		this.target = target;
		this.didModify(tag);
	}
	evaluate(vm) {
		let { tag, target, lastRevision } = this;
		if (!vm.alwaysRevalidate && validateTag(tag, lastRevision)) {
			consumeTag(tag);
			vm.goto(expect(target));
		}
	}
	didModify(tag) {
		this.tag = tag;
		this.lastRevision = valueForTag(this.tag);
		consumeTag(tag);
	}
};
var BeginTrackFrameOpcode = class {
	constructor(debugLabel) {
		this.debugLabel = debugLabel;
	}
	evaluate() {
		beginTrackFrame(this.debugLabel);
	}
};
var EndTrackFrameOpcode = class {
	constructor(target) {
		this.target = target;
	}
	evaluate() {
		let tag = endTrackFrame();
		this.target.didModify(tag);
	}
};
APPEND_OPCODES.add(41, (vm, { op1: text }) => {
	vm.tree().appendText(vm.constants.getValue(text));
});
APPEND_OPCODES.add(42, (vm, { op1: text }) => {
	vm.tree().appendComment(vm.constants.getValue(text));
});
APPEND_OPCODES.add(48, (vm, { op1: tag }) => {
	vm.tree().openElement(vm.constants.getValue(tag));
});
APPEND_OPCODES.add(49, (vm) => {
	let tagName = /* @__PURE__ */ check(valueForRef(/* @__PURE__ */ check(vm.stack.pop(), CheckReference)));
	vm.tree().openElement(tagName);
});
APPEND_OPCODES.add(50, (vm) => {
	let elementRef = /* @__PURE__ */ check(vm.stack.pop());
	let insertBeforeRef = /* @__PURE__ */ check(vm.stack.pop());
	let guidRef = /* @__PURE__ */ check(vm.stack.pop());
	let element = /* @__PURE__ */ check(valueForRef(elementRef));
	let insertBefore = /* @__PURE__ */ check(valueForRef(insertBeforeRef));
	let guid = valueForRef(guidRef);
	if (!isConstRef(elementRef)) vm.updateWith(new Assert(elementRef));
	if (insertBefore !== void 0 && !isConstRef(insertBeforeRef)) vm.updateWith(new Assert(insertBeforeRef));
	let block = vm.tree().pushRemoteElement(element, guid, insertBefore);
	vm.associateDestroyable(block);
	if (vm.env.debugRenderTree !== void 0) {
		let args = createCapturedArgs(insertBefore === void 0 ? {} : { insertBefore: insertBeforeRef }, [elementRef]);
		vm.env.debugRenderTree.create(block, {
			type: "keyword",
			name: "in-element",
			args,
			instance: null
		});
		registerDestructor(block, () => {
			vm.env.debugRenderTree?.willDestroy(block);
		});
	}
});
APPEND_OPCODES.add(56, (vm) => {
	let bounds = vm.tree().popRemoteElement();
	if (vm.env.debugRenderTree !== void 0) vm.env.debugRenderTree.didRender(bounds, bounds);
});
APPEND_OPCODES.add(54, (vm) => {
	let operations = /* @__PURE__ */ check(vm.fetchValue(6));
	let modifiers = null;
	if (operations) {
		modifiers = operations.flush(vm);
		vm.loadValue(6, null);
	}
	vm.tree().flushElement(modifiers);
});
APPEND_OPCODES.add(55, (vm) => {
	let modifiers = vm.tree().closeElement();
	if (modifiers !== null) modifiers.forEach((modifier) => {
		vm.env.scheduleInstallModifier(modifier);
		const d = modifier.manager.getDestroyable(modifier.state);
		if (d !== null) vm.associateDestroyable(d);
	});
});
APPEND_OPCODES.add(57, (vm, { op1: handle }) => {
	let args = /* @__PURE__ */ check(vm.stack.pop());
	if (!vm.env.isInteractive) return;
	let owner = vm.getOwner();
	let definition = vm.constants.getValue(handle);
	let { manager } = definition;
	let { constructing } = vm.tree();
	let capturedArgs = args.capture();
	let state = manager.create(owner, expect(constructing), definition.state, capturedArgs);
	let instance = {
		manager,
		state,
		definition
	};
	expect(/* @__PURE__ */ check(vm.fetchValue(6))).addModifier(vm, instance, capturedArgs);
	let tag = manager.getTag(state);
	if (tag !== null) {
		consumeTag(tag);
		return vm.updateWith(new UpdateModifierOpcode(tag, instance));
	}
});
APPEND_OPCODES.add(108, (vm) => {
	let { stack } = vm;
	let ref = /* @__PURE__ */ check(stack.pop());
	let args = /* @__PURE__ */ check(stack.pop());
	if (!vm.env.isInteractive) return;
	let capturedArgs = args.capture();
	let { positional: outerPositional, named: outerNamed } = capturedArgs;
	let { constructing } = vm.tree();
	let initialOwner = vm.getOwner();
	let instanceRef = createComputeRef(() => {
		let value = valueForRef(ref);
		let owner;
		if (!isIndexable$1(value)) return;
		let hostDefinition;
		if (isCurriedType(value, 2)) {
			let { definition: resolvedDefinition, owner: curriedOwner, positional, named } = resolveCurriedValue(value);
			hostDefinition = resolvedDefinition;
			owner = curriedOwner;
			if (positional !== void 0) capturedArgs.positional = positional.concat(outerPositional);
			if (named !== void 0) capturedArgs.named = Object.assign({}, ...named, outerNamed);
		} else {
			hostDefinition = value;
			owner = initialOwner;
		}
		let manager = getInternalModifierManager(hostDefinition);
		if (manager === null) throw new Error("BUG: modifier manager expected");
		let definition = {
			resolvedName: null,
			manager,
			state: hostDefinition
		};
		return {
			manager,
			state: manager.create(owner, expect(constructing), definition.state, capturedArgs),
			definition
		};
	});
	let instance = valueForRef(instanceRef);
	let tag = null;
	if (instance !== void 0) {
		expect(/* @__PURE__ */ check(vm.fetchValue(6))).addModifier(vm, instance, capturedArgs);
		tag = instance.manager.getTag(instance.state);
		if (tag !== null) consumeTag(tag);
	}
	if (!isConstRef(ref) || tag) {
		let updateOpcode = new UpdateDynamicModifierOpcode(tag, instance, instanceRef);
		vm.associateDestroyable(updateOpcode);
		return vm.updateWith(updateOpcode);
	}
});
var UpdateModifierOpcode = class {
	lastUpdated;
	constructor(tag, modifier) {
		this.tag = tag;
		this.modifier = modifier;
		this.lastUpdated = valueForTag(tag);
	}
	evaluate(vm) {
		let { modifier, tag, lastUpdated } = this;
		consumeTag(tag);
		if (!validateTag(tag, lastUpdated)) {
			vm.env.scheduleUpdateModifier(modifier);
			this.lastUpdated = valueForTag(tag);
		}
	}
};
var UpdateDynamicModifierOpcode = class {
	lastUpdated;
	constructor(tag, instance, instanceRef) {
		this.tag = tag;
		this.instance = instance;
		this.instanceRef = instanceRef;
		this.lastUpdated = valueForTag(tag ?? CURRENT_TAG);
	}
	evaluate(vm) {
		let { tag, lastUpdated, instance, instanceRef } = this;
		let newInstance = valueForRef(instanceRef);
		if (newInstance !== instance) {
			if (instance !== void 0) {
				let destroyable = instance.manager.getDestroyable(instance.state);
				if (destroyable !== null) destroy(destroyable);
			}
			if (newInstance !== void 0) {
				let { manager, state } = newInstance;
				let destroyable = manager.getDestroyable(state);
				if (destroyable !== null) associateDestroyableChild(this, destroyable);
				tag = manager.getTag(state);
				if (tag !== null) this.lastUpdated = valueForTag(tag);
				this.tag = tag;
				vm.env.scheduleInstallModifier(newInstance);
			}
			this.instance = newInstance;
		} else if (tag !== null && !validateTag(tag, lastUpdated)) {
			vm.env.scheduleUpdateModifier(instance);
			this.lastUpdated = valueForTag(tag);
		}
		if (tag !== null) consumeTag(tag);
	}
};
APPEND_OPCODES.add(51, (vm, { op1: _name, op2: _value, op3: _namespace }) => {
	let name = vm.constants.getValue(_name);
	let value = vm.constants.getValue(_value);
	let namespace = _namespace ? vm.constants.getValue(_namespace) : null;
	vm.tree().setStaticAttribute(name, value, namespace);
});
APPEND_OPCODES.add(52, (vm, { op1: _name, op2: _trusting, op3: _namespace }) => {
	let name = vm.constants.getValue(_name);
	let trusting = vm.constants.getValue(_trusting);
	let reference = /* @__PURE__ */ check(vm.stack.pop());
	let value = valueForRef(reference);
	let namespace = _namespace ? vm.constants.getValue(_namespace) : null;
	let attribute = vm.tree().setDynamicAttribute(name, value, trusting, namespace);
	if (!isConstRef(reference)) vm.updateWith(new UpdateDynamicAttributeOpcode(reference, attribute, vm.env));
});
var UpdateDynamicAttributeOpcode = class {
	updateRef;
	constructor(reference, attribute, env) {
		let initialized = false;
		this.updateRef = createComputeRef(() => {
			let value = valueForRef(reference);
			if (initialized) attribute.update(value, env);
			else initialized = true;
		});
		valueForRef(this.updateRef);
	}
	evaluate() {
		valueForRef(this.updateRef);
	}
};
/**
* The VM creates a new ComponentInstance data structure for every component
* invocation it encounters.
*
* Similar to how a ComponentDefinition contains state about all components of a
* particular type, a ComponentInstance contains state specific to a particular
* instance of a component type. It also contains a pointer back to its
* component type's ComponentDefinition.
*/
APPEND_OPCODES.add(78, (vm, { op1: handle }) => {
	let definition = vm.constants.getValue(handle);
	let { manager, capabilities } = definition;
	let instance = {
		definition,
		manager,
		capabilities,
		state: null,
		handle: null,
		table: null,
		lookup: null
	};
	vm.stack.push(instance);
});
APPEND_OPCODES.add(80, (vm, { op1: _isStrict }) => {
	let stack = vm.stack;
	let ref = /* @__PURE__ */ check(stack.pop());
	let component = /* @__PURE__ */ check(valueForRef(ref));
	let constants = vm.constants;
	let owner = vm.getOwner();
	constants.getValue(_isStrict);
	vm.loadValue(7, null);
	let definition;
	if (typeof component === "string") {
		let resolvedDefinition = resolveComponent(vm.context.resolver, constants, component, owner);
		definition = expect(resolvedDefinition);
	} else if (isCurriedValue(component)) definition = component;
	else definition = constants.component(component, owner);
	stack.push(definition);
});
APPEND_OPCODES.add(81, (vm) => {
	let stack = vm.stack;
	let ref = /* @__PURE__ */ check(stack.pop());
	let value = valueForRef(ref);
	let constants = vm.constants;
	let definition;
	if (isCurriedValue(value)) definition = value;
	else definition = constants.component(value, vm.getOwner(), true);
	stack.push(definition);
});
APPEND_OPCODES.add(79, (vm) => {
	let { stack } = vm;
	let definition = stack.pop();
	let capabilities, manager;
	if (isCurriedValue(definition)) manager = capabilities = null;
	else {
		manager = definition.manager;
		capabilities = definition.capabilities;
	}
	stack.push({
		definition,
		capabilities,
		manager,
		state: null,
		handle: null,
		table: null
	});
});
APPEND_OPCODES.add(82, (vm, { op1: _names, op2: _blockNames, op3: flags }) => {
	let stack = vm.stack;
	let names = vm.constants.getArray(_names);
	let positionalCount = flags >> 4;
	let atNames = flags & 8;
	let blockNames = flags & 7 ? vm.constants.getArray(_blockNames) : EMPTY_STRING_ARRAY;
	vm.args.setup(stack, names, blockNames, positionalCount, !!atNames);
	stack.push(vm.args);
});
APPEND_OPCODES.add(83, (vm) => {
	let { stack } = vm;
	stack.push(vm.args.empty(stack));
});
APPEND_OPCODES.add(86, (vm) => {
	let stack = vm.stack;
	let capturedArgs = (/* @__PURE__ */ check(stack.pop())).capture();
	stack.push(capturedArgs);
});
APPEND_OPCODES.add(85, (vm, { op1: register }) => {
	let stack = vm.stack;
	let instance = vm.fetchValue(/* @__PURE__ */ check(register));
	let args = /* @__PURE__ */ check(stack.pop());
	let { definition } = instance;
	if (isCurriedType(definition, 0)) {
		assert(!definition.manager);
		let constants = vm.constants;
		let { definition: resolvedDefinition, owner, resolved, positional, named } = resolveCurriedValue(definition);
		if (resolved) definition = resolvedDefinition;
		else if (typeof resolvedDefinition === "string") {
			let resolvedValue = vm.context.resolver?.lookupComponent?.(resolvedDefinition, owner) ?? null;
			definition = constants.resolvedComponent(expect(resolvedValue), resolvedDefinition);
		} else definition = constants.component(resolvedDefinition, owner);
		if (named !== void 0) args.named.merge(assign({}, ...named));
		if (positional !== void 0) {
			args.realloc(positional.length);
			args.positional.prepend(positional);
		}
		let { manager } = definition;
		instance.definition = definition;
		instance.manager = manager;
		instance.capabilities = definition.capabilities;
		vm.loadValue(7, owner);
	}
	let { manager, state } = definition;
	let capabilities = instance.capabilities;
	if (!managerHasCapability(manager, capabilities, InternalComponentCapabilities.prepareArgs)) {
		stack.push(args);
		return;
	}
	let blocks = args.blocks.values;
	let blockNames = args.blocks.names;
	let preparedArgs = manager.prepareArgs(state, args);
	if (preparedArgs) {
		args.clear();
		for (let i = 0; i < blocks.length; i++) stack.push(blocks[i]);
		let { positional, named } = preparedArgs;
		let positionalCount = positional.length;
		for (let i = 0; i < positionalCount; i++) stack.push(positional[i]);
		let names = Object.keys(named);
		for (let i = 0; i < names.length; i++) stack.push(named[unwrap(names[i])]);
		args.setup(stack, names, blockNames, positionalCount, false);
	}
	stack.push(args);
});
APPEND_OPCODES.add(87, (vm, { op1: flags }) => {
	let instance = /* @__PURE__ */ check(vm.fetchValue(4));
	let { definition, manager, capabilities } = instance;
	if (!managerHasCapability(manager, capabilities, InternalComponentCapabilities.createInstance)) return;
	let dynamicScope = null;
	if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.dynamicScope)) dynamicScope = vm.dynamicScope();
	let hasDefaultBlock = flags & 1;
	let args = null;
	if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.createArgs)) args = /* @__PURE__ */ check(vm.stack.peek());
	let self = null;
	if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.createCaller)) self = vm.getSelf();
	let state = manager.create(vm.getOwner(), definition.state, args, vm.env, dynamicScope, self, !!hasDefaultBlock);
	instance.state = state;
	if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.updateHook)) vm.updateWith(new UpdateComponentOpcode(state, manager, dynamicScope));
});
APPEND_OPCODES.add(88, (vm, { op1: register }) => {
	let { manager, state, capabilities } = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let d = manager.getDestroyable(state);
	if (d) vm.associateDestroyable(d);
});
APPEND_OPCODES.add(97, (vm, { op1: register }) => {
	let name;
	vm.beginCacheGroup(name);
	vm.tree().pushAppendingBlock();
});
APPEND_OPCODES.add(89, (vm) => {
	vm.loadValue(6, new ComponentElementOperations());
});
APPEND_OPCODES.add(53, (vm, { op1: _name, op2: _trusting, op3: _namespace }) => {
	let name = vm.constants.getValue(_name);
	let trusting = vm.constants.getValue(_trusting);
	let reference = /* @__PURE__ */ check(vm.stack.pop());
	let namespace = _namespace ? vm.constants.getValue(_namespace) : null;
	(/* @__PURE__ */ check(vm.fetchValue(6), void 0)).setAttribute(name, reference, trusting, namespace);
});
APPEND_OPCODES.add(105, (vm, { op1: _name, op2: _value, op3: _namespace }) => {
	let name = vm.constants.getValue(_name);
	let value = vm.constants.getValue(_value);
	let namespace = _namespace ? vm.constants.getValue(_namespace) : null;
	(/* @__PURE__ */ check(vm.fetchValue(6), void 0)).setStaticAttribute(name, value, namespace);
});
var ComponentElementOperations = class {
	attributes = dict();
	classes = [];
	modifiers = [];
	setAttribute(name, value, trusting, namespace) {
		let deferred = {
			value,
			namespace,
			trusting
		};
		if (name === "class") this.classes.push(value);
		this.attributes[name] = deferred;
	}
	setStaticAttribute(name, value, namespace) {
		let deferred = {
			value,
			namespace
		};
		if (name === "class") this.classes.push(value);
		this.attributes[name] = deferred;
	}
	addModifier(vm, modifier, capturedArgs) {
		this.modifiers.push(modifier);
		if (vm.env.debugRenderTree !== void 0) {
			const { manager, definition, state } = modifier;
			if (state === null || typeof state !== "object" && typeof state !== "function") return;
			let { element, constructing } = vm.tree();
			let name = definition.resolvedName ?? manager.getDebugName(definition.state);
			let instance = manager.getDebugInstance(state);
			let bounds = new ConcreteBounds(element, constructing, constructing);
			vm.env.debugRenderTree.create(state, {
				type: "modifier",
				name,
				args: capturedArgs,
				instance
			});
			vm.env.debugRenderTree.didRender(state, bounds);
			vm.associateDestroyable(state);
			vm.updateWith(new DebugRenderTreeUpdateOpcode(state));
			vm.updateWith(new DebugRenderTreeDidRenderOpcode(state, bounds));
			registerDestructor(state, () => {
				vm.env.debugRenderTree?.willDestroy(state);
			});
		}
	}
	flush(vm) {
		let type;
		let attributes = this.attributes;
		for (let name in this.attributes) {
			if (name === "type") {
				type = attributes[name];
				continue;
			}
			let attr = unwrap(this.attributes[name]);
			if (name === "class") setDeferredAttr(vm, "class", mergeClasses(this.classes), attr.namespace, attr.trusting);
			else setDeferredAttr(vm, name, attr.value, attr.namespace, attr.trusting);
		}
		if (type !== void 0) setDeferredAttr(vm, "type", type.value, type.namespace, type.trusting);
		return this.modifiers;
	}
};
function mergeClasses(classes) {
	if (classes.length === 0) return "";
	if (classes.length === 1) return unwrap(classes[0]);
	if (allStringClasses(classes)) return classes.join(" ");
	return createClassListRef(classes);
}
function allStringClasses(classes) {
	return classes.every((c) => typeof c === "string");
}
function setDeferredAttr(vm, name, value, namespace, trusting = false) {
	if (typeof value === "string") vm.tree().setStaticAttribute(name, value, namespace);
	else {
		let attribute = vm.tree().setDynamicAttribute(name, valueForRef(value), trusting, namespace);
		if (!isConstRef(value)) vm.updateWith(new UpdateDynamicAttributeOpcode(value, attribute, vm.env));
	}
}
APPEND_OPCODES.add(99, (vm, { op1: register }) => {
	let { definition, state } = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let { manager } = definition;
	let operations = /* @__PURE__ */ check(vm.fetchValue(6));
	manager.didCreateElement(state, expect(vm.tree().constructing), operations);
});
APPEND_OPCODES.add(90, (vm, { op1: register, op2: _names }) => {
	let { definition, state } = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let { manager } = definition;
	let selfRef = manager.getSelf(state);
	if (vm.env.debugRenderTree !== void 0) {
		let instance = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
		let { definition, manager } = instance;
		let args;
		if (vm.stack.peek() === vm.args) args = vm.args.capture();
		else {
			let names = vm.constants.getArray(_names);
			vm.args.setup(vm.stack, names, [], 0, true);
			args = vm.args.capture();
		}
		let compilable = definition.compilable;
		if (compilable === null) {
			assert(managerHasCapability(manager, instance.capabilities, InternalComponentCapabilities.dynamicLayout));
			let resolver = vm.context.resolver;
			compilable = resolver === null ? null : manager.getDynamicLayout(state, resolver);
		}
		vm.associateDestroyable(instance);
		if (hasCustomDebugRenderTreeLifecycle(manager)) manager.getDebugCustomRenderTree(instance.definition.state, instance.state, args).forEach((node) => {
			let { bucket } = node;
			vm.env.debugRenderTree.create(bucket, node);
			registerDestructor(instance, () => {
				vm.env.debugRenderTree?.willDestroy(bucket);
			});
			vm.updateWith(new DebugRenderTreeUpdateOpcode(bucket));
		});
		else {
			let name = getDebugName(definition, manager);
			vm.env.debugRenderTree.create(instance, {
				type: "component",
				name,
				args,
				instance: valueForRef(selfRef)
			});
			registerDestructor(instance, () => {
				vm.env.debugRenderTree?.willDestroy(instance);
			});
			vm.updateWith(new DebugRenderTreeUpdateOpcode(instance));
		}
	}
	vm.stack.push(selfRef);
});
APPEND_OPCODES.add(91, (vm, { op1: register }) => {
	let { definition, state } = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let { manager } = definition;
	let tagName = manager.getTagName(state);
	vm.stack.push(tagName);
});
APPEND_OPCODES.add(92, (vm, { op1: register }) => {
	let instance = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let { manager, definition } = instance;
	let { stack } = vm;
	let { compilable } = definition;
	if (compilable === null) {
		let { capabilities } = instance;
		assert(managerHasCapability(manager, capabilities, InternalComponentCapabilities.dynamicLayout));
		let resolver = vm.context.resolver;
		compilable = resolver === null ? null : manager.getDynamicLayout(instance.state, resolver);
		if (compilable === null) {
			if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.wrapped)) compilable = unwrapTemplate(vm.constants.defaultTemplate).asWrappedLayout();
			else compilable = unwrapTemplate(vm.constants.defaultTemplate).asLayout();
		}
	}
	let handle = compilable.compile(vm.context);
	stack.push(compilable.symbolTable);
	stack.push(handle);
});
APPEND_OPCODES.add(75, (vm, { op1: register }) => {
	let definition = /* @__PURE__ */ check(vm.stack.pop());
	let invocation = /* @__PURE__ */ check(vm.stack.pop());
	let { manager, capabilities } = definition;
	let state = {
		definition,
		manager,
		capabilities,
		state: null,
		handle: invocation.handle,
		table: invocation.symbolTable,
		lookup: null
	};
	vm.loadValue(/* @__PURE__ */ check(register), state);
});
APPEND_OPCODES.add(95, (vm, { op1: register }) => {
	let { stack } = vm;
	let handle = /* @__PURE__ */ check(stack.pop());
	let table = /* @__PURE__ */ check(stack.pop());
	let state = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	state.handle = handle;
	state.table = table;
});
APPEND_OPCODES.add(38, (vm, { op1: register }) => {
	let { table, manager, capabilities, state } = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let owner;
	if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.hasSubOwner)) {
		owner = manager.getOwner(state);
		vm.loadValue(7, null);
	} else {
		owner = vm.fetchValue(7);
		if (owner === null) owner = vm.getOwner();
		else vm.loadValue(7, null);
	}
	vm.pushRootScope(table.symbols.length + 1, owner);
});
APPEND_OPCODES.add(17, (vm, { op1: register }) => {
	let state = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let scope = vm.scope();
	let args = /* @__PURE__ */ check(vm.stack.peek());
	let callerNames = args.named.atNames;
	for (let i = callerNames.length - 1; i >= 0; i--) {
		let atName = unwrap(callerNames[i]);
		let symbol = state.table.symbols.indexOf(atName);
		let value = args.named.get(atName, true);
		if (symbol !== -1) scope.bindSymbol(symbol + 1, value);
		if (state.lookup) state.lookup[atName] = value;
	}
});
function bindBlock(symbolName, blockName, state, blocks, vm) {
	let symbol = state.table.symbols.indexOf(symbolName);
	let block = blocks.get(blockName);
	if (symbol !== -1) vm.scope().bindBlock(symbol + 1, block);
	if (state.lookup) state.lookup[symbolName] = block;
}
APPEND_OPCODES.add(18, (vm, { op1: register }) => {
	let state = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let { blocks } = /* @__PURE__ */ check(vm.stack.peek());
	for (const [i] of enumerate(blocks.names)) bindBlock(unwrap(blocks.symbolNames[i]), unwrap(blocks.names[i]), state, blocks, vm);
});
APPEND_OPCODES.add(96, (vm, { op1: register }) => {
	let state = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	vm.call(state.handle);
});
APPEND_OPCODES.add(100, (vm, { op1: register }) => {
	let instance = /* @__PURE__ */ check(vm.fetchValue(/* @__PURE__ */ check(register, CheckRegister)));
	let { manager, state, capabilities } = instance;
	let bounds = vm.tree().popBlock();
	if (vm.env.debugRenderTree !== void 0) {
		if (hasCustomDebugRenderTreeLifecycle(manager)) manager.getDebugCustomRenderTree(instance.definition.state, state, EMPTY_ARGS).reverse().forEach((node) => {
			let { bucket } = node;
			vm.env.debugRenderTree.didRender(bucket, bounds);
			vm.updateWith(new DebugRenderTreeDidRenderOpcode(bucket, bounds));
		});
		else {
			vm.env.debugRenderTree.didRender(instance, bounds);
			vm.updateWith(new DebugRenderTreeDidRenderOpcode(instance, bounds));
		}
	}
	if (managerHasCapability(manager, capabilities, InternalComponentCapabilities.createInstance)) {
		(/* @__PURE__ */ check(manager)).didRenderLayout(state, bounds);
		vm.env.didCreate(instance);
		vm.updateWith(new DidUpdateLayoutOpcode(instance, bounds));
	}
});
APPEND_OPCODES.add(98, (vm) => {
	vm.commitCacheGroup();
});
var UpdateComponentOpcode = class {
	constructor(component, manager, dynamicScope) {
		this.component = component;
		this.manager = manager;
		this.dynamicScope = dynamicScope;
	}
	evaluate(_vm) {
		let { component, manager, dynamicScope } = this;
		manager.update(component, dynamicScope);
	}
};
var DidUpdateLayoutOpcode = class {
	constructor(component, bounds) {
		this.component = component;
		this.bounds = bounds;
	}
	evaluate(vm) {
		let { component, bounds } = this;
		let { manager, state } = component;
		manager.didUpdateLayout(state, bounds);
		vm.env.didUpdate(component);
	}
};
var DebugRenderTreeUpdateOpcode = class {
	constructor(bucket) {
		this.bucket = bucket;
	}
	evaluate(vm) {
		vm.env.debugRenderTree?.update(this.bucket);
	}
};
var DebugRenderTreeDidRenderOpcode = class {
	constructor(bucket, bounds) {
		this.bucket = bucket;
		this.bounds = bounds;
	}
	evaluate(vm) {
		vm.env.debugRenderTree?.didRender(this.bucket, this.bounds);
	}
};
var ReferenceChecker = class {
	validate(value) {
		return typeof value === "object" && value !== null && REFERENCE in value;
	}
	expected() {
		return `Reference`;
	}
};
var CheckReference = new ReferenceChecker();
var VMArgumentsImpl = class {
	stack = null;
	positional = new PositionalArgumentsImpl();
	named = new NamedArgumentsImpl();
	blocks = new BlockArgumentsImpl();
	constructor() {
		setLocalDebugType("args", this);
	}
	empty(stack) {
		let base = stack.registers[3] + 1;
		this.named.empty(stack, base);
		this.positional.empty(stack, base);
		this.blocks.empty(stack, base);
		return this;
	}
	setup(stack, names, blockNames, positionalCount, atNames) {
		this.stack = stack;
		let named = this.named;
		let namedCount = names.length;
		let namedBase = stack.registers[3] - namedCount + 1;
		named.setup(stack, namedBase, namedCount, names, atNames);
		let positional = this.positional;
		let positionalBase = namedBase - positionalCount;
		positional.setup(stack, positionalBase, positionalCount);
		let blocks = this.blocks;
		let blocksCount = blockNames.length;
		let blocksBase = positionalBase - blocksCount * 3;
		blocks.setup(stack, blocksBase, blocksCount, blockNames);
	}
	get base() {
		return this.blocks.base;
	}
	get length() {
		return this.positional.length + this.named.length + this.blocks.length * 3;
	}
	at(pos) {
		return this.positional.at(pos);
	}
	realloc(offset) {
		let { stack } = this;
		if (offset > 0 && stack !== null) {
			let { positional, named } = this;
			let newBase = positional.base + offset;
			let length = positional.length + named.length;
			for (let i = length - 1; i >= 0; i--) stack.copy(i + positional.base, i + newBase);
			positional.base += offset;
			named.base += offset;
			stack.registers[3] += offset;
		}
	}
	capture() {
		let positional = this.positional.length === 0 ? EMPTY_POSITIONAL : this.positional.capture();
		return {
			named: this.named.length === 0 ? EMPTY_NAMED : this.named.capture(),
			positional
		};
	}
	clear() {
		let { stack, length } = this;
		if (length > 0 && stack !== null) stack.pop(length);
	}
};
var EMPTY_REFERENCES = emptyArray();
var PositionalArgumentsImpl = class {
	base = 0;
	length = 0;
	stack = null;
	_references = null;
	constructor() {
		setLocalDebugType("args:positional", this);
	}
	empty(stack, base) {
		this.stack = stack;
		this.base = base;
		this.length = 0;
		this._references = EMPTY_REFERENCES;
	}
	setup(stack, base, length) {
		this.stack = stack;
		this.base = base;
		this.length = length;
		if (length === 0) this._references = EMPTY_REFERENCES;
		else this._references = null;
	}
	at(position) {
		let { base, length, stack } = this;
		if (position < 0 || position >= length) return UNDEFINED_REFERENCE;
		return /* @__PURE__ */ check(stack.get(position, base));
	}
	capture() {
		return this.references;
	}
	prepend(other) {
		let additions = other.length;
		if (additions > 0) {
			let { base, length, stack } = this;
			this.base = base = base - additions;
			this.length = length + additions;
			for (let i = 0; i < additions; i++) stack.set(other[i], i, base);
			this._references = null;
		}
	}
	get references() {
		let references = this._references;
		if (!references) {
			let { stack, base, length } = this;
			references = this._references = stack.slice(base, base + length);
		}
		return references;
	}
};
var NamedArgumentsImpl = class {
	base = 0;
	length = 0;
	_references = null;
	_names = EMPTY_STRING_ARRAY;
	_atNames = EMPTY_STRING_ARRAY;
	constructor() {
		setLocalDebugType("args:named", this);
	}
	empty(stack, base) {
		this.stack = stack;
		this.base = base;
		this.length = 0;
		this._references = EMPTY_REFERENCES;
		this._names = EMPTY_STRING_ARRAY;
		this._atNames = EMPTY_STRING_ARRAY;
	}
	setup(stack, base, length, names, atNames) {
		this.stack = stack;
		this.base = base;
		this.length = length;
		if (length === 0) {
			this._references = EMPTY_REFERENCES;
			this._names = EMPTY_STRING_ARRAY;
			this._atNames = EMPTY_STRING_ARRAY;
		} else {
			this._references = null;
			if (atNames) {
				this._names = null;
				this._atNames = names;
			} else {
				this._names = names;
				this._atNames = null;
			}
		}
	}
	get names() {
		let names = this._names;
		if (!names) names = this._names = this._atNames.map(this.toSyntheticName);
		return names;
	}
	get atNames() {
		let atNames = this._atNames;
		if (!atNames) atNames = this._atNames = this._names.map(this.toAtName);
		return atNames;
	}
	has(name) {
		return this.names.indexOf(name) !== -1;
	}
	get(name, atNames = false) {
		let { base, stack } = this;
		let idx = (atNames ? this.atNames : this.names).indexOf(name);
		if (idx === -1) return UNDEFINED_REFERENCE;
		return stack.get(idx, base);
	}
	capture() {
		let { names, references } = this;
		let map = dict();
		for (const [i, name] of enumerate(names)) map[name] = unwrap(references[i]);
		return map;
	}
	merge(other) {
		let keys = Object.keys(other);
		if (keys.length > 0) {
			let { names, length, stack } = this;
			let newNames = names.slice();
			for (const name of keys) if (newNames.indexOf(name) === -1) {
				length = newNames.push(name);
				stack.push(other[name]);
			}
			this.length = length;
			this._references = null;
			this._names = newNames;
			this._atNames = null;
		}
	}
	get references() {
		let references = this._references;
		if (!references) {
			let { base, length, stack } = this;
			references = this._references = stack.slice(base, base + length);
		}
		return references;
	}
	toSyntheticName(name) {
		return name.slice(1);
	}
	toAtName(name) {
		return `@${name}`;
	}
};
function toSymbolName(name) {
	return `&${name}`;
}
var EMPTY_BLOCK_VALUES = emptyArray();
var BlockArgumentsImpl = class {
	internalValues = null;
	_symbolNames = null;
	internalTag = null;
	names = EMPTY_STRING_ARRAY;
	length = 0;
	base = 0;
	constructor() {
		setLocalDebugType("args:blocks", this);
	}
	empty(stack, base) {
		this.stack = stack;
		this.names = EMPTY_STRING_ARRAY;
		this.base = base;
		this.length = 0;
		this._symbolNames = null;
		this.internalTag = CONSTANT_TAG;
		this.internalValues = EMPTY_BLOCK_VALUES;
	}
	setup(stack, base, length, names) {
		this.stack = stack;
		this.names = names;
		this.base = base;
		this.length = length;
		this._symbolNames = null;
		if (length === 0) {
			this.internalTag = CONSTANT_TAG;
			this.internalValues = EMPTY_BLOCK_VALUES;
		} else {
			this.internalTag = null;
			this.internalValues = null;
		}
	}
	get values() {
		let values = this.internalValues;
		if (!values) {
			let { base, length, stack } = this;
			values = this.internalValues = stack.slice(base, base + length * 3);
		}
		return values;
	}
	has(name) {
		return this.names.indexOf(name) !== -1;
	}
	get(name) {
		let idx = this.names.indexOf(name);
		if (idx === -1) return null;
		let { base, stack } = this;
		let table = /* @__PURE__ */ check(stack.get(idx * 3, base));
		let scope = /* @__PURE__ */ check(stack.get(idx * 3 + 1, base));
		let handle = /* @__PURE__ */ check(stack.get(idx * 3 + 2, base));
		return handle === null ? null : [
			handle,
			scope,
			table
		];
	}
	capture() {
		return new CapturedBlockArgumentsImpl(this.names, this.values);
	}
	get symbolNames() {
		let symbolNames = this._symbolNames;
		if (symbolNames === null) symbolNames = this._symbolNames = this.names.map(toSymbolName);
		return symbolNames;
	}
};
var CapturedBlockArgumentsImpl = class {
	length;
	constructor(names, values) {
		this.names = names;
		this.values = values;
		this.length = names.length;
	}
	has(name) {
		return this.names.indexOf(name) !== -1;
	}
	get(name) {
		let idx = this.names.indexOf(name);
		if (idx === -1) return null;
		return [
			this.values[idx * 3 + 2],
			this.values[idx * 3 + 1],
			this.values[idx * 3]
		];
	}
};
function createCapturedArgs(named, positional) {
	return {
		named,
		positional
	};
}
function reifyNamed(named) {
	let reified = dict();
	for (const [key, value] of Object.entries(named)) reified[key] = valueForRef(value);
	return reified;
}
function reifyPositional(positional) {
	return positional.map(valueForRef);
}
function reifyArgs(args) {
	return {
		named: reifyNamed(args.named),
		positional: reifyPositional(args.positional)
	};
}
var ARGUMENT_ERROR = Symbol("ARGUMENT_ERROR");
function isArgumentError(arg) {
	return arg !== null && typeof arg === "object" && arg[ARGUMENT_ERROR];
}
function ArgumentErrorImpl(error) {
	return {
		[ARGUMENT_ERROR]: true,
		error
	};
}
function reifyNamedDebug(named) {
	let reified = dict();
	for (const [key, value] of Object.entries(named)) try {
		reified[key] = valueForRef(value);
	} catch (e) {
		reified[key] = ArgumentErrorImpl(e);
	}
	return reified;
}
function reifyPositionalDebug(positional) {
	return positional.map((p) => {
		try {
			return valueForRef(p);
		} catch (e) {
			return ArgumentErrorImpl(e);
		}
	});
}
function reifyArgsDebug(args) {
	return {
		named: reifyNamedDebug(args.named),
		positional: reifyPositionalDebug(args.positional)
	};
}
var EMPTY_NAMED = Object.freeze(Object.create(null));
var EMPTY_POSITIONAL = EMPTY_REFERENCES;
var EMPTY_ARGS = createCapturedArgs(EMPTY_NAMED, EMPTY_POSITIONAL);
//#endregion
export { move as A, CursorImpl as C, isNode as D, isFragment as E, shouldCoerce as M, unwrapHandle as N, isSafeString as O, unwrapTemplate as P, ConcreteBounds as S, isEmpty as T, isCurriedType as _, DebugRenderTreeImpl as a, reifyPositional as b, EMPTY_POSITIONAL as c, VMArgumentsImpl as d, check as f, isArgumentError as g, externs as h, CurriedValue as i, normalizeStringValue as j, isString as k, EndTrackFrameOpcode as l, curry as m, AssertFilter as n, EMPTY_ARGS as o, createCapturedArgs as p, BeginTrackFrameOpcode as r, EMPTY_NAMED as s, APPEND_OPCODES as t, JumpIfNotModifiedOpcode as u, reifyArgs as v, clear as w, resolveCurriedValue as x, reifyNamed as y };
