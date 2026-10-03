import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { E as getFactoryFor, L as expandProperties, M as computed, P as defineProperty, U as get, t as CoreObject, z as notifyPropertyChange } from "./core-D-L0f59Y.js";
import { C as ENV, x as setObservers } from "./observers-BmobpXAF-CkVUhhE-.js";
import { n as set, r as trySet } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { l as setClassicDecorator, o as isElementDescriptor } from "./decorator-9ikVwsjY-DzA4qI2N.js";
import { i as getProperties, r as setProperties, t as Observable } from "./observable-BDMGT456.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/index.js
var object_exports = /* @__PURE__ */ __exportAll({
	action: () => action,
	computed: () => computed,
	default: () => EmberObject,
	defineProperty: () => defineProperty,
	get: () => get,
	getProperties: () => getProperties,
	notifyPropertyChange: () => notifyPropertyChange,
	observer: () => observer,
	set: () => set,
	setProperties: () => setProperties,
	trySet: () => trySet
});
/**
@module @ember/object
*/
/**
`EmberObject` is the main base class for all Ember objects. It is a subclass
of `CoreObject` with the `Observable` mixin applied. For details,
see the documentation for each of these.

@class EmberObject
@extends CoreObject
@uses Observable
@public
*/
var EmberObject = class extends CoreObject.extend(Observable) {
	get _debugContainerKey() {
		let factory = getFactoryFor(this);
		return factory !== void 0 && factory.fullName;
	}
};
/**
Decorator that turns the target function into an Action which can be accessed
directly by reference.

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Tooltip extends Component {
@tracked isShowing = false;

@action
toggleShowing() {
this.isShowing = !this.isShowing;
}

<template>
<button {{on "click" this.toggleShowing}}>Show tooltip</button>

{{#if isShowing}}
<div class="tooltip">
I'm a tooltip!
</div>
{{/if}}
</template>
}
```

It also binds the function directly to the instance, so it can be used in any
context and will correctly refer to the class it came from:

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Tooltip extends Component {
constructor() {
super(...arguments);

// this.toggleShowing is still bound correctly when added to
// the event listener
document.addEventListener('click', this.toggleShowing);
}

@tracked isShowing = false;

@action
toggleShowing() {
this.isShowing = !this.isShowing;
}

<template>
{{!-- ...--}}
</template>
}
```

@public
@method action
@for @ember/object
@static
@param {Function|undefined} callback The function to turn into an action,
when used in classic classes
@return {PropertyDecorator} property decorator instance
*/
var BINDINGS_MAP = /* @__PURE__ */ new WeakMap();
function hasProto(obj) {
	return obj != null && obj.constructor !== void 0 && typeof obj.constructor.proto === "function";
}
function setupAction(target, key, actionFn) {
	if (hasProto(target)) target.constructor.proto();
	if (!Object.prototype.hasOwnProperty.call(target, "actions")) {
		let parentActions = target.actions;
		target.actions = parentActions ? Object.assign({}, parentActions) : {};
	}
	target.actions[key] = actionFn;
	return { get() {
		let bindings = BINDINGS_MAP.get(this);
		if (bindings === void 0) {
			bindings = /* @__PURE__ */ new Map();
			BINDINGS_MAP.set(this, bindings);
		}
		let fn = bindings.get(actionFn);
		if (fn === void 0) {
			fn = actionFn.bind(this);
			bindings.set(actionFn, fn);
		}
		return fn;
	} };
}
function action(...args) {
	let actionFn;
	if (!isElementDescriptor(args)) {
		actionFn = args[0];
		let decorator = function(target, key, _desc, _meta, isClassicDecorator) {
			return setupAction(target, key, actionFn);
		};
		setClassicDecorator(decorator);
		return decorator;
	}
	let [target, key, desc] = args;
	actionFn = desc?.value;
	return setupAction(target, key, actionFn);
}
setClassicDecorator(action);
/**
Specify a method that observes property changes.

```javascript
import EmberObject from '@ember/object';
import { observer } from '@ember/object';

export default EmberObject.extend({
valueObserver: observer('value', function() {
// Executes whenever the "value" property changes
})
});
```

While observers are still supported, there are [plans to deprecate them](https://github.com/emberjs/rfcs/pull/1115)
See the [in-progress deprecation guide](https://github.com/ember-learn/deprecation-app/pull/1407) 
for guidance on how to avoid using observers.

@method observer
@for @ember/object
@param {String} propertyNames*
@param {Function} func
@return func
@public
@static
*/
function observer(...args) {
	let funcOrDef = args.pop();
	let func;
	let dependentKeys;
	let sync;
	if (typeof funcOrDef === "function") {
		func = funcOrDef;
		dependentKeys = args;
		sync = !ENV._DEFAULT_ASYNC_OBSERVERS;
	} else {
		func = funcOrDef.fn;
		dependentKeys = funcOrDef.dependentKeys;
		sync = funcOrDef.sync;
	}
	let paths = [];
	for (let dependentKey of dependentKeys) expandProperties(dependentKey, (path) => paths.push(path));
	setObservers(func, {
		paths,
		sync
	});
	return func;
}
//#endregion
export { observer as i, action as n, object_exports as r, EmberObject as t };
