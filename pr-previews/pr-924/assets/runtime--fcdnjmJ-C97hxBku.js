//#region ../node_modules/.pnpm/decorator-transforms@2.4.0_@babel+core@7.29.7_supports-color@8.1.1_/node_modules/decorator-transforms/dist/runtime--fcdnjmJ.js
var deferred = /* @__PURE__ */ new WeakMap();
function deferDecorator(proto, prop, desc) {
	let map = deferred.get(proto);
	if (!map) {
		map = /* @__PURE__ */ new Map();
		deferred.set(proto, map);
	}
	map.set(prop, desc);
}
function findDeferredDecorator(target, prop) {
	var _a;
	let cursor = target.prototype;
	while (cursor) {
		let desc = (_a = deferred.get(cursor)) == null ? void 0 : _a.get(prop);
		if (desc) return desc;
		cursor = Object.getPrototypeOf(cursor);
	}
}
function decorateFieldV1(target, prop, decorators, initializer) {
	return decorateFieldV2(target.prototype, prop, decorators, initializer);
}
function decorateFieldV2(prototype, prop, decorators, initializer) {
	let desc = {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	};
	if (initializer) desc.initializer = initializer;
	for (let decorator of decorators) desc = decorator(prototype, prop, desc) || desc;
	if (desc.initializer === void 0) Object.defineProperty(prototype, prop, desc);
	else deferDecorator(prototype, prop, desc);
}
function decorateMethodV1({ prototype }, prop, decorators) {
	return decorateMethodV2(prototype, prop, decorators);
}
function decorateMethodV2(prototype, prop, decorators) {
	let desc = { ...Object.getOwnPropertyDescriptor(prototype, prop) };
	for (let decorator of decorators) desc = decorator(prototype, prop, desc) || desc;
	if (desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(prototype) : void 0;
		desc.initializer = void 0;
	}
	Object.defineProperty(prototype, prop, desc);
}
function initializeDeferredDecorator(target, prop) {
	let desc = findDeferredDecorator(target.constructor, prop);
	if (desc) Object.defineProperty(target, prop, {
		enumerable: desc.enumerable,
		configurable: desc.configurable,
		writable: desc.writable,
		value: desc.initializer ? desc.initializer.call(target) : void 0
	});
}
function decorateClass(target, decorators) {
	return decorators.reduce((accum, decorator) => decorator(accum) || accum, target);
}
function decoratePOJO(pojo, decorated) {
	for (let [type, prop, decorators] of decorated) if (type === "field") decoratePojoField(pojo, prop, decorators);
	else decorateMethodV2(pojo, prop, decorators);
	return pojo;
}
function decoratePojoField(pojo, prop, decorators) {
	let desc = {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: () => {
			var _a;
			return (_a = Object.getOwnPropertyDescriptor(pojo, prop)) == null ? void 0 : _a.value;
		}
	};
	for (let decorator of decorators) desc = decorator(pojo, prop, desc) || desc;
	if (desc.initializer) {
		desc.value = desc.initializer.call(pojo);
		delete desc.initializer;
	}
	Object.defineProperty(pojo, prop, desc);
}
var runtime = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
	__proto__: null,
	c: decorateClass,
	f: decorateFieldV1,
	g: decorateFieldV2,
	i: initializeDeferredDecorator,
	m: decorateMethodV1,
	n: decorateMethodV2,
	p: decoratePOJO
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { runtime as a, initializeDeferredDecorator as i, decorateFieldV2 as n, decorateMethodV2 as r, decorateClass as t };
