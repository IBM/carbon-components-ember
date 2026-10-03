import { c as setProp, n as getProp } from "./global-context-D1MXNkcp.js";
import { A as validateTag, O as track, _ as consumeTag, i as CONSTANT_TAG, j as valueForTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { a as expect, c as isDict } from "./collections-GpG8lT2g-C7dMd8aS.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/reference-CG0yPgLy.js
var REFERENCE = Symbol("REFERENCE");
var CONSTANT = 0;
var COMPUTE = 1;
var UNBOUND = 2;
var INVOKABLE = 3;
var ReferenceImpl = class {
	[REFERENCE];
	tag = null;
	lastRevision = 1;
	lastValue;
	children = null;
	compute = null;
	update = null;
	debugLabel;
	constructor(type) {
		this[REFERENCE] = type;
	}
};
function createPrimitiveRef(value) {
	const ref = new ReferenceImpl(UNBOUND);
	ref.tag = CONSTANT_TAG;
	ref.lastValue = value;
	return ref;
}
var UNDEFINED_REFERENCE = createPrimitiveRef(void 0);
var NULL_REFERENCE = createPrimitiveRef(null);
var TRUE_REFERENCE = createPrimitiveRef(true);
var FALSE_REFERENCE = createPrimitiveRef(false);
function createConstRef(value, debugLabel) {
	const ref = new ReferenceImpl(CONSTANT);
	ref.lastValue = value;
	ref.tag = CONSTANT_TAG;
	return ref;
}
function createUnboundRef(value, debugLabel) {
	const ref = new ReferenceImpl(UNBOUND);
	ref.lastValue = value;
	ref.tag = CONSTANT_TAG;
	return ref;
}
function createComputeRef(compute, update = null, debugLabel = "unknown") {
	const ref = new ReferenceImpl(COMPUTE);
	ref.compute = compute;
	ref.update = update;
	return ref;
}
function createReadOnlyRef(ref) {
	if (!isUpdatableRef(ref)) return ref;
	return createComputeRef(() => valueForRef(ref), null, ref.debugLabel);
}
function isInvokableRef(ref) {
	return ref[REFERENCE] === INVOKABLE;
}
function createInvokableRef(inner) {
	const ref = createComputeRef(() => valueForRef(inner), (value) => updateRef(inner, value));
	ref.debugLabel = inner.debugLabel;
	ref[REFERENCE] = INVOKABLE;
	return ref;
}
function isConstRef(_ref) {
	return _ref.tag === CONSTANT_TAG;
}
function isUpdatableRef(_ref) {
	return _ref.update !== null;
}
function valueForRef(_ref) {
	const ref = _ref;
	let { tag } = ref;
	if (tag === CONSTANT_TAG) return ref.lastValue;
	const { lastRevision } = ref;
	let lastValue;
	if (tag === null || !validateTag(tag, lastRevision)) {
		const { compute } = ref;
		const newTag = track(() => {
			lastValue = ref.lastValue = compute();
		});
		tag = ref.tag = newTag;
		ref.lastRevision = valueForTag(newTag);
	} else lastValue = ref.lastValue;
	consumeTag(tag);
	return lastValue;
}
function updateRef(_ref, value) {
	expect(_ref.update)(value);
}
function childRefFor(_parentRef, path) {
	const parentRef = _parentRef;
	const type = parentRef[REFERENCE];
	let children = parentRef.children;
	let child;
	if (children === null) children = parentRef.children = /* @__PURE__ */ new Map();
	else {
		const next = children.get(path);
		if (next) return next;
	}
	if (type === UNBOUND) {
		const parent = valueForRef(parentRef);
		if (isDict(parent)) child = createUnboundRef(parent[path]);
		else child = UNDEFINED_REFERENCE;
	} else child = createComputeRef(() => {
		const parent = valueForRef(parentRef);
		if (isDict(parent)) return getProp(parent, path);
	}, (val) => {
		const parent = valueForRef(parentRef);
		if (isDict(parent)) return setProp(parent, path, val);
	});
	children.set(path, child);
	return child;
}
function childRefFromParts(root, parts) {
	let reference = root;
	for (const part of parts) reference = childRefFor(reference, part);
	return reference;
}
var createDebugAliasRef;
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/args-proxy-CCoFtYLS.js
var CUSTOM_TAG_FOR = /* @__PURE__ */ new WeakMap();
function getCustomTagFor(obj) {
	return CUSTOM_TAG_FOR.get(obj);
}
function setCustomTagFor(obj, customTagFn) {
	CUSTOM_TAG_FOR.set(obj, customTagFn);
}
function convertToInt(prop) {
	if (typeof prop === "symbol") return null;
	const num = Number(prop);
	if (isNaN(num)) return null;
	return num % 1 === 0 ? num : null;
}
function tagForNamedArg(namedArgs, key) {
	return track(() => {
		if (key in namedArgs) valueForRef(namedArgs[key]);
	});
}
function tagForPositionalArg(positionalArgs, key) {
	return track(() => {
		if (key === "[]") positionalArgs.forEach(valueForRef);
		const parsed = convertToInt(key);
		if (parsed !== null && parsed >= 0 && parsed < positionalArgs.length) valueForRef(positionalArgs[parsed]);
	});
}
var NamedArgsProxy = class {
	constructor(named) {
		this.named = named;
	}
	get(_target, prop) {
		const ref = this.named[prop];
		if (ref !== void 0) return valueForRef(ref);
	}
	has(_target, prop) {
		return prop in this.named;
	}
	ownKeys() {
		return Object.keys(this.named);
	}
	isExtensible() {
		return false;
	}
	getOwnPropertyDescriptor(_target, prop) {
		return {
			enumerable: true,
			configurable: true
		};
	}
};
var PositionalArgsProxy = class {
	constructor(positional) {
		this.positional = positional;
	}
	get(target, prop) {
		let { positional } = this;
		if (prop === "length") return positional.length;
		const parsed = convertToInt(prop);
		if (parsed !== null && parsed >= 0 && parsed < positional.length) return valueForRef(positional[parsed]);
		return target[prop];
	}
	isExtensible() {
		return false;
	}
	has(_target, prop) {
		const parsed = convertToInt(prop);
		return parsed !== null && parsed >= 0 && parsed < this.positional.length;
	}
};
var argsProxyFor = (capturedArgs, type) => {
	const { named, positional } = capturedArgs;
	let getNamedTag = (_obj, key) => tagForNamedArg(named, key);
	let getPositionalTag = (_obj, key) => tagForPositionalArg(positional, key);
	const namedHandler = new NamedArgsProxy(named);
	const positionalHandler = new PositionalArgsProxy(positional);
	const namedTarget = Object.create(null);
	const positionalTarget = [];
	const namedProxy = new Proxy(namedTarget, namedHandler);
	const positionalProxy = new Proxy(positionalTarget, positionalHandler);
	setCustomTagFor(namedProxy, getNamedTag);
	setCustomTagFor(positionalProxy, getPositionalTag);
	return {
		named: namedProxy,
		positional: positionalProxy
	};
};
//#endregion
export { valueForRef as S, createUnboundRef as _, NULL_REFERENCE as a, isUpdatableRef as b, UNDEFINED_REFERENCE as c, createComputeRef as d, createConstRef as f, createReadOnlyRef as g, createPrimitiveRef as h, FALSE_REFERENCE as i, childRefFor as l, createInvokableRef as m, getCustomTagFor as n, REFERENCE as o, createDebugAliasRef as p, setCustomTagFor as r, TRUE_REFERENCE as s, argsProxyFor as t, childRefFromParts as u, isConstRef as v, updateRef as x, isInvokableRef as y };
