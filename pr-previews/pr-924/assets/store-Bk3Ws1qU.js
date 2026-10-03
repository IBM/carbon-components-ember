import { t as getOwner$1 } from "./owner-DvxyMhs3.js";
import { r as associateDestroyableChild } from "./destroyable-BW6N5j2P.js";
import { n as application_exports } from "./application-DHX-EgR7.js";
import { t as esCompat } from "./es-compat2-D1cSJc1a.js";
//#region ../node_modules/.pnpm/reactiveweb@1.9.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-waiters@4.1.2_su_ca7151678d0c917948ab096fa3757468/node_modules/reactiveweb/dist/-private/ember-compat.js
var compatOwner = { linkOwner(toHaveOwner, alreadyHasOwner) {
	const owner = compatOwner.getOwner(alreadyHasOwner);
	if (owner) compatOwner.setOwner(toHaveOwner, owner);
} };
compatOwner.getOwner = esCompat(application_exports).getOwner;
compatOwner.setOwner = esCompat(application_exports).setOwner;
//#endregion
//#region ../node_modules/.pnpm/reactiveweb@1.9.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-waiters@4.1.2_su_ca7151678d0c917948ab096fa3757468/node_modules/reactiveweb/dist/link.js
var getOwner = compatOwner.getOwner;
var setOwner = compatOwner.setOwner;
/**
* A util to abstract away the boilerplate of linking of "things" with an owner
* and making them destroyable.
*
* ```js
* import Component from '@glimmer/component';
* import { link } from 'reactiveweb/link';
*
* class MyClass {  ... }
*
* export default class Demo extends Component {
*   @link(MyClass) myInstance;
* }
* ```
*/
/**
* A util to abstract away the boilerplate of linking of "things" with an owner
* and making them destroyable.
*
* ```js
* import Component from '@glimmer/component';
* import { cached } from '@glimmer/tracking';
* import { link } from 'reactiveweb/link';
*
* export default class Demo extends Component {
*   @cached
*   get myFunction() {
*     let instance = new MyClass(this.args.foo);
*
*     return link(instance, this);
*   }
* }
* ```
*
* NOTE: If args change, as in this example, memory pressure will increase,
*       as the linked instance will be held on to until the host object is destroyed.
*/
/**
* A util to abstract away the boilerplate of linking of "things" with an owner
* and making them destroyable.
*
* ```js
* import Component from '@glimmer/component';
* import { link } from 'reactiveweb/link';
*
* class MyClass {  ... }
*
* export default class Demo extends Component {
*   @link myInstance = new MyClass();
* }
* ```
*
* NOTE: reactive args may not be passed to `MyClass` directly if you wish updates to be observed.
*   A way to use reactive args is this:
*
* ```js
* import Component from '@glimmer/component';
* import { tracked } from '@glimmer/tracking';
* import { link } from 'reactiveweb/link';
*
* class MyClass {  ... }
*
* export default class Demo extends Component {
*   @tracked foo = 'bar';
*
*   @link myInstance = new MyClass({
*      foo: () => this.args.foo,
*      bar: () => this.bar,
*   });
* }
* ```
*
* This way, whenever foo() or bar() is invoked within `MyClass`,
* only the thing that does that invocation will become entangled with the tracked data
* referenced within those functions.
*/
function link(...args) {
	if (args.length === 3)
 /**
	* Uses initializer to get the child
	*/
	return linkDecorator(...args);
	if (args.length === 1) return linkDecoratorFactory(...args);
	return directLink(...args);
}
function directLink(child, parent) {
	associateDestroyableChild(parent, child);
	const owner = getOwner(parent);
	if (owner) setOwner(child, owner);
	else if (parent && "lookup" in parent && typeof parent.lookup === "function") setOwner(child, parent);
	return child;
}
function linkDecoratorFactory(child) {
	return function decoratorPrep(...args) {
		return linkDecorator(...args, child);
	};
}
function linkDecorator(_prototype, key, descriptor, explicitChild) {
	const { initializer } = descriptor;
	const caches = /* @__PURE__ */ new WeakMap();
	return { get() {
		let child = caches.get(this);
		if (!child) {
			if (initializer) child = initializer.call(this);
			if (explicitChild) child = new explicitChild();
			associateDestroyableChild(this, child);
			const owner = getOwner(this);
			setOwner(child, owner);
			caches.set(this, child);
		}
		return child;
	} };
}
//#endregion
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/utils.js
function uniqueId() {
	return "30000000-1000-4000-2000-100000000000".replace(/[0-3]/g, (a) => (a * 4 ^ Math.random() * 16 >> (a & 2)).toString(16));
}
function isNewable(x) {
	return x.prototype?.constructor === x;
}
/**
* Loose check for an "ownerish" API.
* only the ".lookup" method is required.
*
* The requirements for what an "owner" is are sort of undefined,
* as the actual owner in ember applications has too much on it,
* and the long term purpose of the owner will be questioned once we
* eliminate the need to have a registry (what lookup looks in to),
* but we'll still need "Something" to represent the lifetime of the application.
*
* Technically, the owner could be any object, including `{}`
*/
function isOwner(x) {
	if (!isNonNullableObject(x)) return false;
	return "lookup" in x && typeof x.lookup === "function";
}
function isNonNullableObject(x) {
	if (typeof x !== "object") return false;
	if (x === null) return false;
	return true;
}
/**
* Can receive the class instance or the owner itself, and will always return return the owner.
*
* undefined will be returned if the Owner does not exist on the passed object
*
* Can be useful when combined with `createStore` to then create "services",
* which don't require string lookup.
*/
function findOwner(contextOrOwner) {
	if (isOwner(contextOrOwner)) return contextOrOwner;
	if (!isNonNullableObject(contextOrOwner)) return;
	const maybeOwner = getOwner$1(contextOrOwner);
	if (isOwner(maybeOwner)) return maybeOwner;
	if ("owner" in contextOrOwner) {
		const maybeOwner = contextOrOwner.owner;
		if (isOwner(maybeOwner)) return maybeOwner;
	}
}
//#endregion
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/store.js
/**
* context => { class => instance }
*/
var contextCache = /* @__PURE__ */ new WeakMap();
/**
* Creates a singleton for the given context and links the lifetime of the created class to the passed context
*
* Note that this function is _not_ lazy. Calling `createStore` will create an instance of the passed class.
* When combined with a getter though, creation becomes lazy.
*
* In this example, `MyState` is created once per instance of the component.
* repeat accesses to `this.foo` return a stable reference _as if_ `@cached` were used.
* ```js
* class MyState {}
*
* class Demo extends Component {
*   // this is a stable reference
*   get foo() {
*     return createStore(this, MyState);
*   }
*
*   // or
*   bar = createStore(this, MyState);
*
*  // or
*  three = createStore(this, () => new MyState(1, 2));
* }
* ```
*
* If arguments need to be configured during construction, the second argument may also be a function
* ```js
* class MyState {}
*
* class Demo extends Component {
*   // this is a stable reference
*   get foo() {
*     return createStore(this, MyState);
*   }
* }
* ```
*/
function createStore(context, theClass) {
	let cache = contextCache.get(context);
	if (!cache) {
		cache = /* @__PURE__ */ new Map();
		contextCache.set(context, cache);
	}
	let existing = cache.get(theClass);
	if (!existing) {
		const instance = isNewable(theClass) ? new theClass() : theClass();
		link(instance, context);
		cache.set(theClass, instance);
		existing = instance;
	}
	return existing;
}
//#endregion
export { findOwner as n, uniqueId as r, createStore as t };
