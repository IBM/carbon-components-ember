import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { A as beginPropertyChanges, I as endPropertyChanges, U as get, i as Mixin, j as changeProperties, z as notifyPropertyChange } from "./core-D-L0f59Y.js";
import { i as addObserver, p as hasListeners, s as removeObserver } from "./observers-BmobpXAF-CkVUhhE-.js";
import { a as peekMeta } from "./meta-B7F2ReUu.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/get_properties-CkJ_mhLz.js
/**
@module @ember/object
*/
/**
To get multiple properties at once, call `getProperties`
with an object followed by a list of strings or an array:

```javascript
import { getProperties } from '@ember/object';

getProperties(record, 'firstName', 'lastName', 'zipCode');
// { firstName: 'John', lastName: 'Doe', zipCode: '10011' }
```

is equivalent to:

```javascript
import { getProperties } from '@ember/object';

getProperties(record, ['firstName', 'lastName', 'zipCode']);
// { firstName: 'John', lastName: 'Doe', zipCode: '10011' }
```

@method getProperties
@static
@for @ember/object
@param {Object} obj
@param {String...|Array} list of keys to get
@return {Object}
@public
*/
function getProperties(obj, keys) {
	let ret = {};
	let propertyNames;
	let i = 1;
	if (arguments.length === 2 && Array.isArray(keys)) {
		i = 0;
		propertyNames = arguments[1];
	} else propertyNames = Array.from(arguments);
	for (; i < propertyNames.length; i++) {
		let name = propertyNames[i];
		ret[name] = get(obj, name);
	}
	return ret;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/set_properties-DYiBfzdk.js
/**
@module @ember/object
*/
/**
Set a list of properties on an object. These properties are set inside
a single `beginPropertyChanges` and `endPropertyChanges` batch, so
observers will be buffered.

```javascript
import EmberObject from '@ember/object';
let anObject = EmberObject.create();

anObject.setProperties({
firstName: 'Stanley',
lastName: 'Stuart',
age: 21
});
```

@method setProperties
@static
@for @ember/object
@param obj
@param {Object} properties
@return properties
@public
*/
function setProperties(obj, properties) {
	if (properties === null || typeof properties !== "object") return properties;
	changeProperties(() => {
		let props = Object.keys(properties);
		for (let propertyName of props) set(obj, propertyName, properties[propertyName]);
	});
	return properties;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/observable.js
var observable_exports = /* @__PURE__ */ __exportAll({ default: () => Observable });
/**
@module @ember/object/observable
*/
/**
## Overview

This mixin provides properties and property observing functionality, core
features of the Ember object model.

Properties and observers allow one object to observe changes to a
property on another object. This is one of the fundamental ways that
models, controllers and views communicate with each other in an Ember
application.

Any object that has this mixin applied can be used in observer
operations. That includes `EmberObject` and most objects you will
interact with as you write your Ember application.

Note that you will not generally apply this mixin to classes yourself,
but you will use the features provided by this module frequently, so it
is important to understand how to use it.

## Using `get()` and `set()`

Because of Ember's support for bindings and observers, you will always
access properties using the get method, and set properties using the
set method. This allows the observing objects to be notified and
computed properties to be handled properly.

More documentation about `get` and `set` are below.

## Observing Property Changes

You typically observe property changes simply by using the `observer`
function in classes that you write.

For example:

```javascript
import { observer } from '@ember/object';
import EmberObject from '@ember/object';

EmberObject.extend({
valueObserver: observer('value', function(sender, key, value, rev) {
// Executes whenever the "value" property changes
// See the addObserver method for more information about the callback arguments
})
});
```

Although this is the most common way to add an observer, this capability
is actually built into the `EmberObject` class on top of two methods
defined in this mixin: `addObserver` and `removeObserver`. You can use
these two methods to add and remove observers yourself if you need to
do so at runtime.

To add an observer for a property, call:

```javascript
object.addObserver('propertyKey', targetObject, targetAction)
```

This will call the `targetAction` method on the `targetObject` whenever
the value of the `propertyKey` changes.

Note that if `propertyKey` is a computed property, the observer will be
called when any of the property dependencies are changed, even if the
resulting value of the computed property is unchanged. This is necessary
because computed properties are not computed until `get` is called.

@class Observable
@public
*/
var Observable = Mixin.create({
	get(keyName) {
		return get(this, keyName);
	},
	getProperties(...args) {
		return getProperties(this, ...args);
	},
	set(keyName, value) {
		return set(this, keyName, value);
	},
	setProperties(hash) {
		return setProperties(this, hash);
	},
	/**
	Begins a grouping of property changes.
	You can use this method to group property changes so that notifications
	will not be sent until the changes are finished. If you plan to make a
	large number of changes to an object at one time, you should call this
	method at the beginning of the changes to begin deferring change
	notifications. When you are done making changes, call
	`endPropertyChanges()` to deliver the deferred change notifications and end
	deferring.
	@method beginPropertyChanges
	@return {Observable}
	@private
	*/
	beginPropertyChanges() {
		beginPropertyChanges();
		return this;
	},
	/**
	Ends a grouping of property changes.
	You can use this method to group property changes so that notifications
	will not be sent until the changes are finished. If you plan to make a
	large number of changes to an object at one time, you should call
	`beginPropertyChanges()` at the beginning of the changes to defer change
	notifications. When you are done making changes, call this method to
	deliver the deferred change notifications and end deferring.
	@method endPropertyChanges
	@return {Observable}
	@private
	*/
	endPropertyChanges() {
		endPropertyChanges();
		return this;
	},
	notifyPropertyChange(keyName) {
		notifyPropertyChange(this, keyName);
		return this;
	},
	addObserver(key, target, method, sync) {
		addObserver(this, key, target, method, sync);
		return this;
	},
	removeObserver(key, target, method, sync) {
		removeObserver(this, key, target, method, sync);
		return this;
	},
	/**
	Returns `true` if the object currently has observers registered for a
	particular key. You can use this method to potentially defer performing
	an expensive action until someone begins observing a particular property
	on the object.
	@method hasObserverFor
	@param {String} key Key to check
	@return {Boolean}
	@private
	*/
	hasObserverFor(key) {
		return hasListeners(this, `${key}:change`);
	},
	incrementProperty(keyName, increment = 1) {
		return set(this, keyName, (parseFloat(get(this, keyName)) || 0) + increment);
	},
	decrementProperty(keyName, decrement = 1) {
		return set(this, keyName, (get(this, keyName) || 0) - decrement);
	},
	toggleProperty(keyName) {
		return set(this, keyName, !get(this, keyName));
	},
	cacheFor(keyName) {
		let meta = peekMeta(this);
		return meta !== null ? meta.valueFor(keyName) : void 0;
	}
});
//#endregion
export { getProperties as i, observable_exports as n, setProperties as r, Observable as t };
