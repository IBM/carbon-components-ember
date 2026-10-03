//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/runtime-CYyqkz5q-BOdRhmsS.js
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
//#endregion
export { decorateMethodV2 as n, initializeDeferredDecorator as r, decorateFieldV2 as t };
