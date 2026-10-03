import { a as peekMeta, i as meta } from "./meta-B7F2ReUu.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/decorator-9ikVwsjY.js
function isElementDescriptor(args) {
	let [maybeTarget, maybeKey, maybeDesc] = args;
	return args.length === 3 && (typeof maybeTarget === "function" || typeof maybeTarget === "object" && maybeTarget !== null) && typeof maybeKey === "string" && (typeof maybeDesc === "object" && maybeDesc !== null || maybeDesc === void 0);
}
function nativeDescDecorator(propertyDesc) {
	let decorator = function() {
		return propertyDesc;
	};
	setClassicDecorator(decorator);
	return decorator;
}
/**
Objects of this type can implement an interface to respond to requests to
get and set. The default implementation handles simple properties.

@class Descriptor
@private
*/
var ComputedDescriptor = class {
	enumerable = true;
	configurable = true;
	_dependentKeys = void 0;
	_meta = void 0;
	setup(_obj, keyName, _propertyDesc, meta) {
		meta.writeDescriptors(keyName, this);
	}
	teardown(_obj, keyName, meta) {
		meta.removeDescriptors(keyName);
	}
};
function DESCRIPTOR_GETTER_FUNCTION(name, descriptor) {
	function getter() {
		return descriptor.get(this, name);
	}
	return getter;
}
function DESCRIPTOR_SETTER_FUNCTION(name, descriptor) {
	let set = function CPSETTER_FUNCTION(value) {
		return descriptor.set(this, name, value);
	};
	COMPUTED_SETTERS.add(set);
	return set;
}
var COMPUTED_SETTERS = /* @__PURE__ */ new WeakSet();
function makeComputedDecorator(desc, DecoratorClass) {
	let decorator = function COMPUTED_DECORATOR(target, key, propertyDesc, maybeMeta, isClassicDecorator) {
		let meta$1 = arguments.length === 3 ? meta(target) : maybeMeta;
		desc.setup(target, key, propertyDesc, meta$1);
		return {
			enumerable: desc.enumerable,
			configurable: desc.configurable,
			get: DESCRIPTOR_GETTER_FUNCTION(key, desc),
			set: DESCRIPTOR_SETTER_FUNCTION(key, desc)
		};
	};
	setClassicDecorator(decorator, desc);
	Object.setPrototypeOf(decorator, DecoratorClass.prototype);
	return decorator;
}
var DECORATOR_DESCRIPTOR_MAP = /* @__PURE__ */ new WeakMap();
/**
Returns the CP descriptor associated with `obj` and `keyName`, if any.

@method descriptorForProperty
@param {Object} obj the object to check
@param {String} keyName the key to check
@return {Descriptor}
@private
*/
function descriptorForProperty(obj, keyName, _meta) {
	let meta = _meta === void 0 ? peekMeta(obj) : _meta;
	if (meta !== null) return meta.peekDescriptors(keyName);
}
function descriptorForDecorator(dec) {
	return DECORATOR_DESCRIPTOR_MAP.get(dec);
}
/**
Check whether a value is a decorator

@method isClassicDecorator
@param {any} possibleDesc the value to check
@return {boolean}
@private
*/
function isClassicDecorator(dec) {
	return typeof dec === "function" && DECORATOR_DESCRIPTOR_MAP.has(dec);
}
/**
Set a value as a decorator

@method setClassicDecorator
@param {function} decorator the value to mark as a decorator
@private
*/
function setClassicDecorator(dec, value = true) {
	DECORATOR_DESCRIPTOR_MAP.set(dec, value);
}
//#endregion
export { isClassicDecorator as a, nativeDescDecorator as c, descriptorForProperty as i, setClassicDecorator as l, ComputedDescriptor as n, isElementDescriptor as o, descriptorForDecorator as r, makeComputedDecorator as s, COMPUTED_SETTERS as t };
