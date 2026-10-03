import { O as track, _ as consumeTag, l as UPDATE_TAG } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { l as setClassicDecorator, o as isElementDescriptor } from "./decorator-9ikVwsjY-DzA4qI2N.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/compat.js
var wrapGetterSetter = function(target, key, desc) {
	let { get: originalGet } = desc;
	if (originalGet !== void 0) desc.get = function() {
		let propertyTag = tagFor(this, key);
		let ret;
		let tag = track(() => {
			ret = originalGet.call(this);
		});
		UPDATE_TAG(propertyTag, tag);
		consumeTag(tag);
		return ret;
	};
	return desc;
};
/**
`@dependentKeyCompat` is decorator that can be used on _native getters_ that
use tracked properties. It exposes the getter to Ember's classic computed
property and observer systems, so they can watch it for changes. It can be
used in both native and classic classes.

Native Example:

```js
import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';
import { computed, set } from '@ember/object';

class Person {
@tracked firstName;
@tracked lastName;

@dependentKeyCompat
get fullName() {
return `${this.firstName} ${this.lastName}`;
}
}

class Profile {
constructor(person) {
set(this, 'person', person);
}

@computed('person.fullName')
get helloMessage() {
return `Hello, ${this.person.fullName}!`;
}
}
```

In general, only properties which you _expect_ to be watched by older,
untracked clases should be marked as dependency compatible. The decorator is
meant as an interop layer for parts of Ember's older classic APIs, and should
not be applied to every possible getter/setter in classes. The number of
dependency compatible getters should be _minimized_ wherever possible. New
application code should not need to use `@dependentKeyCompat`, since it is
only for interoperation with older code.

@public
@method dependentKeyCompat
@for @ember/object/compat
@static
@param {PropertyDescriptor|undefined} desc A property descriptor containing
the getter and setter (when used in
classic classes)
@return {PropertyDecorator} property decorator instance
*/
function dependentKeyCompat(...args) {
	if (isElementDescriptor(args)) {
		let [target, key, desc] = args;
		return wrapGetterSetter(target, key, desc);
	} else {
		const desc = args[0];
		let decorator = function(target, key, _desc, _meta, isClassicDecorator) {
			return wrapGetterSetter(target, key, desc);
		};
		setClassicDecorator(decorator);
		return decorator;
	}
}
setClassicDecorator(dependentKeyCompat);
//#endregion
export { dependentKeyCompat as t };
