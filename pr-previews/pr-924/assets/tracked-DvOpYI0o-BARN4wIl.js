import { i as meta } from "./meta-B7F2ReUu.js";
import { _ as consumeTag, k as untrack } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, t as dirtyTagFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { n as SELF_TAG, t as CHAIN_PASS_THROUGH } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
import { t as isEmberArray } from "./-internals-CsfECqDC.js";
import { l as setClassicDecorator, o as isElementDescriptor, t as COMPUTED_SETTERS } from "./decorator-9ikVwsjY-DzA4qI2N.js";
import { n as trackedData, r as trackedValue } from "./tracked-value-CR6kx-73-B8kSd-H1.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/tracked-DvOpYI0o.js
/**
@decorator
@private

Marks a property as tracked.

By default, a component's properties are expected to be static,
meaning you are not able to update them and have the template update accordingly.
Marking a property as tracked means that when that property changes,
a rerender of the component is scheduled so the template is kept up to date.

There are two usages for the `@tracked` decorator, shown below.

@example No dependencies

If you don't pass an argument to `@tracked`, only changes to that property
will be tracked:

```typescript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class MyComponent extends Component {
@tracked
remainingApples = 10
}
```

When something changes the component's `remainingApples` property, the rerender
will be scheduled.

@example Dependents

In the case that you have a computed property that depends other
properties, you want to track both so that when one of the
dependents change, a rerender is scheduled.

In the following example we have two properties,
`eatenApples`, and `remainingApples`.

```typescript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const totalApples = 100;

export default class MyComponent extends Component {
@tracked
eatenApples = 0

get remainingApples() {
return totalApples - this.eatenApples;
}

increment() {
this.eatenApples = this.eatenApples + 1;
}
}
```

@param dependencies Optional dependents to be tracked.
*/
/**
* Reactivity options for the standalone `tracked(value, options)` form.
*
* - `equals` decides whether writing a value notifies consumers; it defaults to
*   `Object.is`.
* - `description` is used in development for debugging.
*
* `equals` is a function-typed property (rather than method syntax) on purpose:
* this keeps its parameters checked strictly, so passing an `equals` typed for
* the wrong value type is a type error instead of being silently accepted.
*/
/**
* Options for `tracked` used as a decorator, or as a field on a *classic* class
* (`EmberObject.extend({ foo: tracked({ value }) })`).
*
* All properties are optional because this single shape backs several usages:
* classic-field defaults (`tracked({ value })` / `tracked({ initializer })`) and
* options-only native decorators (`@tracked({ equals })`). The mutually
* exclusive combinations (e.g. both `value` and `initializer`) and the
* classic-only restriction on `value`/`initializer` are enforced at runtime via
* assertions rather than in the type, matching the runtime `isDecoratorOptions`
* check that accepts any object composed of these keys.
*
* - `value` / `initializer` supply a default value and are only valid on classic
*   classes; native classes use class field initializers instead.
* - `equals` / `description` configure reactivity, mirroring
*   {@link TrackedValueOptions}.
*/
/**
* `tracked` as a decorator factory: `@tracked({ equals })`, or on classic
* classes `tracked({ value })` / `tracked({ initializer })`.
*/
/**
* `tracked` as a bare decorator: `@tracked foo = 1`.
*/
/**
* `tracked` as a standalone reactive value, usable outside of classes:
* `const count = tracked(0)`.
*/
function tracked(...args) {
	if (isElementDescriptor(args)) return descriptorForField(args);
	if (args.length === 0 || args.length === 1 && isDecoratorOptions(args[0])) return makeTrackedDecorator(args[0]);
	let [initialValue, options] = args;
	return trackedValue(initialValue, options);
}
var DECORATOR_OPTION_KEYS = [
	"value",
	"initializer",
	"equals",
	"description"
];
function isDecoratorOptions(value) {
	if (typeof value !== "object" || value === null) return false;
	let proto = Object.getPrototypeOf(value);
	if (proto !== Object.prototype && proto !== null) return false;
	return Object.keys(value).every((key) => DECORATOR_OPTION_KEYS.includes(key));
}
function makeTrackedDecorator(propertyDesc) {
	let initializer = propertyDesc ? propertyDesc.initializer : void 0;
	let value = propertyDesc ? propertyDesc.value : void 0;
	let options = {
		equals: propertyDesc?.equals,
		description: propertyDesc?.description
	};
	let decorator = function(target, key, desc, _meta, isClassicDecorator) {
		return descriptorForField([
			target,
			key,
			isClassicDecorator ? { initializer: initializer || (() => value) } : desc
		], options);
	};
	setClassicDecorator(decorator);
	return decorator;
}
function descriptorForField([target, key, desc], options) {
	let { getter, setter } = trackedData(key, desc ? desc.initializer : void 0);
	let equals = options?.equals;
	function get() {
		let value = getter(this);
		if (Array.isArray(value) || isEmberArray(value)) consumeTag(tagFor(value, "[]"));
		return value;
	}
	function set(newValue) {
		if (equals !== void 0 && equals(untrack(() => getter(this)), newValue)) return;
		setter(this, newValue);
		dirtyTagFor(this, SELF_TAG);
	}
	let newDesc = {
		enumerable: true,
		configurable: true,
		isTracked: true,
		get,
		set
	};
	COMPUTED_SETTERS.add(set);
	meta(target).writeDescriptors(key, new TrackedDescriptor(get, set));
	return newDesc;
}
var TrackedDescriptor = class {
	constructor(_get, _set) {
		this._get = _get;
		this._set = _set;
		CHAIN_PASS_THROUGH.add(this);
	}
	get(obj) {
		return this._get.call(obj);
	}
	set(obj, _key, value) {
		this._set.call(obj, value);
	}
};
//#endregion
export { tracked as n, TrackedDescriptor as t };
