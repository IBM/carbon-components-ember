import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { t as OWNER } from "./owner-In3G7kPJ.js";
import { r as setOwner, t as getOwner } from "./owner-Bxxa-eff.js";
import { C as ENV, S as wrap, _ as ROOT, c as resumeObserverDeactivation, d as suspendedObserverDeactivation, f as addListener, g as sendEvent, h as removeListener, i as addObserver, l as revalidateObservers, o as flushSyncObservers, r as activateObserver, s as removeObserver, u as setObserverSuspended, w as getENV, y as observerListenerMetaFor } from "./observers-BmobpXAF-CkVUhhE-.js";
import { t as inspect } from "./inspect-DT5CkGp4.js";
import { a as peekMeta, i as meta } from "./meta-B7F2ReUu.js";
import { c as isDestroying, i as destroy, l as registerDestructor, s as isDestroyed } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, E as isTracking, O as track, _ as consumeTag, j as valueForTag, k as untrack, l as UPDATE_TAG } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, r as tagMetaFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { a as getChainTagsForKeys, o as markObjectAsDirty, r as finishLazyChains, u as isObject } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
import { t as isEmberArray } from "./-internals-CsfECqDC.js";
import { t as Cache } from "./cache-qDyqAcpg-C6oeU-4r.js";
import { a as isClassicDecorator, c as nativeDescDecorator, i as descriptorForProperty, n as ComputedDescriptor, o as isElementDescriptor, r as descriptorForDecorator, s as makeComputedDecorator } from "./decorator-9ikVwsjY-DzA4qI2N.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/dictionary-gc5gpyOG.js
function makeDictionary(parent) {
	let dict = Object.create(parent);
	dict["_dict"] = null;
	delete dict["_dict"];
	return dict;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/is_proxy-Bzg0d4m4.js
var PROXIES = /* @__PURE__ */ new WeakSet();
function isProxy(value) {
	if (isObject(value)) return PROXIES.has(value);
	return false;
}
function setProxy(object) {
	if (isObject(object)) PROXIES.add(object);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/property_get-DuDs6rLg.js
var firstDotIndexCache = new Cache(1e3, (key) => key.indexOf("."));
function isPath(path) {
	return typeof path === "string" && firstDotIndexCache.get(path) !== -1;
}
/**
@module @ember/object
*/
var PROXY_CONTENT = Symbol("PROXY_CONTENT");
function hasUnknownProperty(val) {
	return typeof val === "object" && val !== null && typeof val.unknownProperty === "function";
}
/**
Gets the value of a property on an object. If the property is computed,
the function will be invoked. If the property is not defined but the
object implements the `unknownProperty` method then that will be invoked.

```javascript
import { get } from '@ember/object';
get(obj, "name");
```

You only need to use this method to retrieve properties if the property
might not be defined on the object and you want to respect the
`unknownProperty` handler. Otherwise you can access the property directly.

Note that if the object itself is `undefined`, this method will throw
an error.

@method get
@for @ember/object
@static
@param {Object} obj The object to retrieve from.
@param {String} keyName The property key to retrieve
@return {Object} the property value or `null`.
@public
*/
function get(obj, keyName) {
	return isPath(keyName) ? _getPath(obj, keyName) : _getProp(obj, keyName);
}
function _getProp(obj, keyName) {
	if (obj == null) return;
	let value;
	if (typeof obj === "object" || typeof obj === "function") {
		value = obj[keyName];
		if (value === void 0 && typeof obj === "object" && !(keyName in obj) && hasUnknownProperty(obj)) value = obj.unknownProperty(keyName);
		if (isTracking()) {
			consumeTag(tagFor(obj, keyName));
			if (Array.isArray(value) || isEmberArray(value)) consumeTag(tagFor(value, "[]"));
		}
	} else value = obj[keyName];
	return value;
}
function _getPath(obj, path, forSet) {
	let parts = typeof path === "string" ? path.split(".") : path;
	for (let part of parts) {
		if (obj === void 0 || obj === null || obj.isDestroyed) return;
		if (forSet && (part === "__proto__" || part === "constructor" || part === "prototype")) return;
		obj = _getProp(obj, part);
	}
	return obj;
}
_getProp("foo", "a");
_getProp("foo", 1);
_getProp({}, "a");
_getProp({}, 1);
_getProp({ unknownProperty() {} }, "a");
_getProp({ unknownProperty() {} }, 1);
get({}, "foo");
get({}, "foo.bar");
var fakeProxy = {};
setProxy(fakeProxy);
track(() => _getProp({}, "a"));
track(() => _getProp({}, 1));
track(() => _getProp({ a: [] }, "a"));
track(() => _getProp({ a: fakeProxy }, "a"));
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/computed-BNdMwGhH.js
/**
@module @ember/object
*/
var END_WITH_EACH_REGEX = /\.@each$/;
/**
Expands `pattern`, invoking `callback` for each expansion.

The only pattern supported is brace-expansion, anything else will be passed
once to `callback` directly.

Example

```js
import { expandProperties } from '@ember/object/computed';

function echo(arg){ console.log(arg); }

expandProperties('foo.bar', echo);              //=> 'foo.bar'
expandProperties('{foo,bar}', echo);            //=> 'foo', 'bar'
expandProperties('foo.{bar,baz}', echo);        //=> 'foo.bar', 'foo.baz'
expandProperties('{foo,bar}.baz', echo);        //=> 'foo.baz', 'bar.baz'
expandProperties('foo.{bar,baz}.[]', echo)      //=> 'foo.bar.[]', 'foo.baz.[]'
expandProperties('{foo,bar}.{spam,eggs}', echo) //=> 'foo.spam', 'foo.eggs', 'bar.spam', 'bar.eggs'
expandProperties('{foo}.bar.{baz}')             //=> 'foo.bar.baz'
```

@method expandProperties
@static
@for @ember/object/computed
@public
@param {String} pattern The property pattern to expand.
@param {Function} callback The callback to invoke.  It is invoked once per
expansion, and is passed the expansion.
*/
function expandProperties(pattern, callback) {
	let start = pattern.indexOf("{");
	if (start < 0) callback(pattern.replace(END_WITH_EACH_REGEX, ".[]"));
	else dive("", pattern, start, callback);
}
function dive(prefix, pattern, start, callback) {
	let end = pattern.indexOf("}"), i = 0, newStart, arrayLength;
	let tempArr = pattern.substring(start + 1, end).split(",");
	let after = pattern.substring(end + 1);
	prefix = prefix + pattern.substring(0, start);
	arrayLength = tempArr.length;
	while (i < arrayLength) {
		newStart = after.indexOf("{");
		if (newStart < 0) callback((prefix + tempArr[i++] + after).replace(END_WITH_EACH_REGEX, ".[]"));
		else dive(prefix + tempArr[i++], after, newStart, callback);
	}
}
/**
@module @ember/object
*/
/**
NOTE: This is a low-level method used by other parts of the API. You almost
never want to call this method directly. Instead you should use
`mixin()` to define new properties.

Defines a property on an object. This method works much like the ES5
`Object.defineProperty()` method except that it can also accept computed
properties and other special descriptors.

Normally this method takes only three parameters. However if you pass an
instance of `Descriptor` as the third param then you can pass an
optional value as the fourth parameter. This is often more efficient than
creating new descriptor hashes for each property.

## Examples

```javascript
import { defineProperty, computed } from '@ember/object';

// ES5 compatible mode
defineProperty(contact, 'firstName', {
writable: true,
configurable: false,
enumerable: true,
value: 'Charles'
});

// define a simple property
defineProperty(contact, 'lastName', undefined, 'Jolley');

// define a computed property
defineProperty(contact, 'fullName', computed('firstName', 'lastName', function() {
return this.firstName+' '+this.lastName;
}));
```

@public
@method defineProperty
@static
@for @ember/object
@param {Object} obj the object to define this property on. This may be a prototype.
@param {String} keyName the name of the property
@param {Descriptor} [desc] an instance of `Descriptor` (typically a
computed property) or an ES5 descriptor.
You must provide this or `data` but not both.
@param {*} [data] something other than a descriptor, that will
become the explicit value of this property.
*/
function defineProperty(obj, keyName, desc, data, _meta) {
	let meta$1 = _meta === void 0 ? meta(obj) : _meta;
	let previousDesc = descriptorForProperty(obj, keyName, meta$1);
	let wasDescriptor = previousDesc !== void 0;
	if (wasDescriptor) previousDesc.teardown(obj, keyName, meta$1);
	if (isClassicDecorator(desc)) defineDecorator(obj, keyName, desc, meta$1);
	else if (desc === null || desc === void 0) defineValue(obj, keyName, data, wasDescriptor, true);
	else Object.defineProperty(obj, keyName, desc);
	if (!meta$1.isPrototypeMeta(obj)) revalidateObservers(obj);
}
function defineDecorator(obj, keyName, desc, meta) {
	let propertyDesc = desc(obj, keyName, void 0, meta, true);
	Object.defineProperty(obj, keyName, propertyDesc);
	return desc;
}
function defineValue(obj, keyName, value, wasDescriptor, enumerable = true) {
	if (wasDescriptor === true || enumerable === false) Object.defineProperty(obj, keyName, {
		configurable: true,
		enumerable,
		writable: true,
		value
	});
	else obj[keyName] = value;
	return value;
}
/**
@module ember
@private
*/
var PROPERTY_DID_CHANGE = Symbol("PROPERTY_DID_CHANGE");
var deferred = 0;
/**
This function is called just after an object property has changed.
It will notify any observers and clear caches among other things.

Normally you will not need to call this method directly but if for some
reason you can't directly watch a property you can invoke this method
manually.

@method notifyPropertyChange
@for @ember/object
@param {Object} obj The object with the property that will change
@param {String} keyName The property key (or path) that will change.
@param {Meta} [_meta] The objects meta.
@param {unknown} [value] The new value to set for the property
@return {void}
@since 3.1.0
@public
*/
function notifyPropertyChange(obj, keyName, _meta, value) {
	let meta = _meta === void 0 ? peekMeta(obj) : _meta;
	if (meta !== null && (meta.isInitializing() || meta.isPrototypeMeta(obj))) return;
	markObjectAsDirty(obj, keyName);
	if (deferred <= 0) flushSyncObservers();
	if (PROPERTY_DID_CHANGE in obj) {
		if (arguments.length === 4) obj[PROPERTY_DID_CHANGE](keyName, value);
		else obj[PROPERTY_DID_CHANGE](keyName);
	}
}
/**
@method beginPropertyChanges
@chainable
@private
*/
function beginPropertyChanges() {
	deferred++;
	suspendedObserverDeactivation();
}
/**
@method endPropertyChanges
@private
*/
function endPropertyChanges() {
	deferred--;
	if (deferred <= 0) {
		flushSyncObservers();
		resumeObserverDeactivation();
	}
}
/**
Make a series of property changes together in an
exception-safe way.

```javascript
Ember.changeProperties(function() {
obj1.set('foo', mayBlowUpWhenSet);
obj2.set('bar', baz);
});
```

@method changeProperties
@param {Function} callback
@private
*/
function changeProperties(callback) {
	beginPropertyChanges();
	try {
		callback();
	} finally {
		endPropertyChanges();
	}
}
function noop() {}
/**
`@computed` is a decorator that turns a JavaScript getter and setter into a
computed property, which is a _cached, trackable value_. By default the getter
will only be called once and the result will be cached. You can specify
various properties that your computed property depends on. This will force the
cached result to be cleared if the dependencies are modified, and lazily recomputed the next time something asks for it.

In the following example we decorate a getter - `fullName` -  by calling
`computed` with the property dependencies (`firstName` and `lastName`) as
arguments. The `fullName` getter will be called once (regardless of how many
times it is accessed) as long as its dependencies do not change. Once
`firstName` or `lastName` are updated any future calls to `fullName` will
incorporate the new values, and any watchers of the value such as templates
will be updated:

```javascript
import { computed, set } from '@ember/object';

class Person {
constructor(firstName, lastName) {
set(this, 'firstName', firstName);
set(this, 'lastName', lastName);
}

@computed('firstName', 'lastName')
get fullName() {
return `${this.firstName} ${this.lastName}`;
}
});

let tom = new Person('Tom', 'Dale');

tom.fullName; // 'Tom Dale'
```

You can also provide a setter, which will be used when updating the computed
property. Ember's `set` function must be used to update the property
since it will also notify observers of the property:

```javascript
import { computed, set } from '@ember/object';

class Person {
constructor(firstName, lastName) {
set(this, 'firstName', firstName);
set(this, 'lastName', lastName);
}

@computed('firstName', 'lastName')
get fullName() {
return `${this.firstName} ${this.lastName}`;
}

set fullName(value) {
let [firstName, lastName] = value.split(' ');

set(this, 'firstName', firstName);
set(this, 'lastName', lastName);
}
});

let person = new Person();

set(person, 'fullName', 'Peter Wagenet');
person.firstName; // 'Peter'
person.lastName;  // 'Wagenet'
```

You can also pass a getter function or object with `get` and `set` functions
as the last argument to the computed decorator. This allows you to define
computed property _macros_:

```js
import { computed } from '@ember/object';

function join(...keys) {
return computed(...keys, function() {
return keys.map(key => this[key]).join(' ');
});
}

class Person {
@join('firstName', 'lastName')
fullName;
}
```

Note that when defined this way, getters and setters receive the _key_ of the
property they are decorating as the first argument. Setters receive the value
they are setting to as the second argument instead. Additionally, setters must
_return_ the value that should be cached:

```javascript
import { computed, set } from '@ember/object';

function fullNameMacro(firstNameKey, lastNameKey) {
return computed(firstNameKey, lastNameKey, {
get() {
return `${this[firstNameKey]} ${this[lastNameKey]}`;
}

set(key, value) {
let [firstName, lastName] = value.split(' ');

set(this, firstNameKey, firstName);
set(this, lastNameKey, lastName);

return value;
}
});
}

class Person {
constructor(firstName, lastName) {
set(this, 'firstName', firstName);
set(this, 'lastName', lastName);
}

@fullNameMacro('firstName', 'lastName') fullName;
});

let person = new Person();

set(person, 'fullName', 'Peter Wagenet');
person.firstName; // 'Peter'
person.lastName;  // 'Wagenet'
```

Computed properties can also be used in classic classes. To do this, we
provide the getter and setter as the last argument like we would for a macro,
and we assign it to a property on the class definition. This is an _anonymous_
computed macro:

```javascript
import EmberObject, { computed, set } from '@ember/object';

let Person = EmberObject.extend({
// these will be supplied by `create`
firstName: null,
lastName: null,

fullName: computed('firstName', 'lastName', {
get() {
return `${this.firstName} ${this.lastName}`;
}

set(key, value) {
let [firstName, lastName] = value.split(' ');

set(this, 'firstName', firstName);
set(this, 'lastName', lastName);

return value;
}
})
});

let tom = Person.create({
firstName: 'Tom',
lastName: 'Dale'
});

tom.get('fullName') // 'Tom Dale'
```

You can overwrite computed property without setters with a normal property (no
longer computed) that won't change if dependencies change. You can also mark
computed property as `.readOnly()` and block all attempts to set it.

```javascript
import { computed, set } from '@ember/object';

class Person {
constructor(firstName, lastName) {
set(this, 'firstName', firstName);
set(this, 'lastName', lastName);
}

@computed('firstName', 'lastName').readOnly()
get fullName() {
return `${this.firstName} ${this.lastName}`;
}
});

let person = new Person();
person.set('fullName', 'Peter Wagenet'); // Uncaught Error: Cannot set read-only property "fullName" on object: <(...):emberXXX>
```

Additional resources:
- [Decorators RFC](https://github.com/emberjs/rfcs/blob/master/text/0408-decorators.md)
- [New CP syntax RFC](https://github.com/emberjs/rfcs/blob/master/text/0011-improved-cp-syntax.md)
- [New computed syntax explained in "Ember 1.12 released" ](https://emberjs.com/blog/2015/05/13/ember-1-12-released.html#toc_new-computed-syntax)

@class ComputedProperty
@public
*/
var ComputedProperty = class extends ComputedDescriptor {
	_readOnly = false;
	_hasConfig = false;
	_getter = void 0;
	_setter = void 0;
	constructor(args) {
		super();
		let maybeConfig = args[args.length - 1];
		if (typeof maybeConfig === "function" || maybeConfig !== null && typeof maybeConfig === "object") {
			this._hasConfig = true;
			let config = args.pop();
			if (typeof config === "function") this._getter = config;
			else {
				const objectConfig = config;
				this._getter = objectConfig.get || noop;
				this._setter = objectConfig.set;
			}
		}
		if (args.length > 0) this._property(...args);
	}
	setup(obj, keyName, propertyDesc, meta) {
		super.setup(obj, keyName, propertyDesc, meta);
		if (this._hasConfig === false) {
			let { get, set } = propertyDesc;
			if (get !== void 0) this._getter = get;
			if (set !== void 0) this._setter = function setterWrapper(_key, value) {
				let ret = set.call(this, value);
				if (get !== void 0) return typeof ret === "undefined" ? get.call(this) : ret;
				return ret;
			};
		}
	}
	_property(...passedArgs) {
		let args = [];
		function addArg(property) {
			args.push(property);
		}
		for (let arg of passedArgs) expandProperties(arg, addArg);
		this._dependentKeys = args;
	}
	get(obj, keyName) {
		let meta$1 = meta(obj);
		let tagMeta = tagMetaFor(obj);
		let propertyTag = tagFor(obj, keyName, tagMeta);
		let ret;
		let revision = meta$1.revisionFor(keyName);
		if (revision !== void 0 && validateTag(propertyTag, revision)) ret = meta$1.valueFor(keyName);
		else {
			let { _getter, _dependentKeys } = this;
			untrack(() => {
				ret = _getter.call(obj, keyName);
			});
			if (_dependentKeys !== void 0) UPDATE_TAG(propertyTag, getChainTagsForKeys(obj, _dependentKeys, tagMeta, meta$1));
			meta$1.setValueFor(keyName, ret);
			meta$1.setRevisionFor(keyName, valueForTag(propertyTag));
			finishLazyChains(meta$1, keyName, ret);
		}
		consumeTag(propertyTag);
		if (Array.isArray(ret)) consumeTag(tagFor(ret, "[]"));
		return ret;
	}
	set(obj, keyName, value) {
		if (this._readOnly) this._throwReadOnlyError(obj, keyName);
		let meta$1 = meta(obj);
		if (meta$1.isInitializing() && this._dependentKeys !== void 0 && this._dependentKeys.length > 0 && typeof obj[PROPERTY_DID_CHANGE] === "function" && obj.isComponent) addObserver(obj, keyName, () => {
			obj[PROPERTY_DID_CHANGE](keyName);
		}, void 0, true);
		let ret;
		try {
			beginPropertyChanges();
			ret = this._set(obj, keyName, value, meta$1);
			finishLazyChains(meta$1, keyName, ret);
			let tagMeta = tagMetaFor(obj);
			let propertyTag = tagFor(obj, keyName, tagMeta);
			let { _dependentKeys } = this;
			if (_dependentKeys !== void 0) UPDATE_TAG(propertyTag, getChainTagsForKeys(obj, _dependentKeys, tagMeta, meta$1));
			meta$1.setRevisionFor(keyName, valueForTag(propertyTag));
		} finally {
			endPropertyChanges();
		}
		return ret;
	}
	_throwReadOnlyError(obj, keyName) {
		throw new Error(`Cannot set read-only property "${keyName}" on object: ${inspect(obj)}`);
	}
	_set(obj, keyName, value, meta) {
		let hadCachedValue = meta.revisionFor(keyName) !== void 0;
		let cachedValue = meta.valueFor(keyName);
		let ret;
		let { _setter } = this;
		setObserverSuspended(obj, keyName, true);
		try {
			ret = _setter.call(obj, keyName, value, cachedValue);
		} finally {
			setObserverSuspended(obj, keyName, false);
		}
		if (hadCachedValue && cachedValue === ret) return ret;
		meta.setValueFor(keyName, ret);
		notifyPropertyChange(obj, keyName, meta, value);
		return ret;
	}
	teardown(obj, keyName, meta) {
		if (meta.revisionFor(keyName) !== void 0) {
			meta.setRevisionFor(keyName, void 0);
			meta.setValueFor(keyName, void 0);
		}
		super.teardown(obj, keyName, meta);
	}
};
var AutoComputedProperty = class extends ComputedProperty {
	get(obj, keyName) {
		let meta$1 = meta(obj);
		let tagMeta = tagMetaFor(obj);
		let propertyTag = tagFor(obj, keyName, tagMeta);
		let ret;
		let revision = meta$1.revisionFor(keyName);
		if (revision !== void 0 && validateTag(propertyTag, revision)) ret = meta$1.valueFor(keyName);
		else {
			let { _getter } = this;
			let tag = track(() => {
				ret = _getter.call(obj, keyName);
			});
			UPDATE_TAG(propertyTag, tag);
			meta$1.setValueFor(keyName, ret);
			meta$1.setRevisionFor(keyName, valueForTag(propertyTag));
			finishLazyChains(meta$1, keyName, ret);
		}
		consumeTag(propertyTag);
		if (Array.isArray(ret)) consumeTag(tagFor(ret, "[]", tagMeta));
		return ret;
	}
};
var ComputedDecoratorImpl = class extends Function {
	/**
	Call on a computed property to set it into read-only mode. When in this
	mode the computed property will throw an error when set.
	Example:
	```javascript
	import { computed, set } from '@ember/object';
	class Person {
	@computed().readOnly()
	get guid() {
	return 'guid-guid-guid';
	}
	}
	let person = new Person();
	set(person, 'guid', 'new-guid'); // will throw an exception
	```
	Classic Class Example:
	```javascript
	import EmberObject, { computed } from '@ember/object';
	let Person = EmberObject.extend({
	guid: computed(function() {
	return 'guid-guid-guid';
	}).readOnly()
	});
	let person = Person.create();
	person.set('guid', 'new-guid'); // will throw an exception
	```
	@method readOnly
	@return {ComputedProperty} this
	@chainable
	@public
	*/
	readOnly() {
		let desc = descriptorForDecorator(this);
		desc._readOnly = true;
		return this;
	}
	/**
	In some cases, you may want to annotate computed properties with additional
	metadata about how they function or what values they operate on. For example,
	computed property functions may close over variables that are then no longer
	available for introspection. You can pass a hash of these values to a
	computed property.
	Example:
	```javascript
	import { computed } from '@ember/object';
	import Person from 'my-app/utils/person';
	class Store {
	@computed().meta({ type: Person })
	get person() {
	let personId = this.personId;
	return Person.create({ id: personId });
	}
	}
	```
	Classic Class Example:
	```javascript
	import { computed } from '@ember/object';
	import Person from 'my-app/utils/person';
	const Store = EmberObject.extend({
	person: computed(function() {
	let personId = this.get('personId');
	return Person.create({ id: personId });
	}).meta({ type: Person })
	});
	```
	The hash that you pass to the `meta()` function will be saved on the
	computed property descriptor under the `_meta` key. Ember runtime
	exposes a public API for retrieving these values from classes,
	via the `metaForProperty()` function.
	@method meta
	@param {Object} meta
	@chainable
	@public
	*/
	meta(meta) {
		let prop = descriptorForDecorator(this);
		if (arguments.length === 0) return prop._meta || {};
		else {
			prop._meta = meta;
			return this;
		}
	}
	/** @internal */
	get _getter() {
		return descriptorForDecorator(this)._getter;
	}
	/** @internal */
	set enumerable(value) {
		descriptorForDecorator(this).enumerable = value;
	}
};
/**
This helper returns a new property descriptor that wraps the passed
computed property function. You can use this helper to define properties with
native decorator syntax, mixins, or via `defineProperty()`.

Example:

```js
import { computed, set } from '@ember/object';

class Person {
constructor() {
this.firstName = 'Betty';
this.lastName = 'Jones';
},

@computed('firstName', 'lastName')
get fullName() {
return `${this.firstName} ${this.lastName}`;
}
}

let client = new Person();

client.fullName; // 'Betty Jones'

set(client, 'lastName', 'Fuller');
client.fullName; // 'Betty Fuller'
```

Classic Class Example:

```js
import EmberObject, { computed } from '@ember/object';

let Person = EmberObject.extend({
init() {
this._super(...arguments);

this.firstName = 'Betty';
this.lastName = 'Jones';
},

fullName: computed('firstName', 'lastName', function() {
return `${this.get('firstName')} ${this.get('lastName')}`;
})
});

let client = Person.create();

client.get('fullName'); // 'Betty Jones'

client.set('lastName', 'Fuller');
client.get('fullName'); // 'Betty Fuller'
```

You can also provide a setter, either directly on the class using native class
syntax, or by passing a hash with `get` and `set` functions.

Example:

```js
import { computed, set } from '@ember/object';

class Person {
constructor() {
this.firstName = 'Betty';
this.lastName = 'Jones';
},

@computed('firstName', 'lastName')
get fullName() {
return `${this.firstName} ${this.lastName}`;
}

set fullName(value) {
let [firstName, lastName] = value.split(/\s+/);

set(this, 'firstName', firstName);
set(this, 'lastName', lastName);

return value;
}
}

let client = new Person();

client.fullName; // 'Betty Jones'

set(client, 'lastName', 'Fuller');
client.fullName; // 'Betty Fuller'
```

Classic Class Example:

```js
import EmberObject, { computed } from '@ember/object';

let Person = EmberObject.extend({
init() {
this._super(...arguments);

this.firstName = 'Betty';
this.lastName = 'Jones';
},

fullName: computed('firstName', 'lastName', {
get(key) {
return `${this.get('firstName')} ${this.get('lastName')}`;
},
set(key, value) {
let [firstName, lastName] = value.split(/\s+/);
this.setProperties({ firstName, lastName });
return value;
}
})
});

let client = Person.create();
client.get('firstName'); // 'Betty'

client.set('fullName', 'Carroll Fuller');
client.get('firstName'); // 'Carroll'
```

When passed as an argument, the `set` function should accept two parameters,
`key` and `value`. The value returned from `set` will be the new value of the
property.

_Note: This is the preferred way to define computed properties when writing third-party
libraries that depend on or use Ember, since there is no guarantee that the user
will have [prototype Extensions](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/) enabled._

@method computed
@for @ember/object
@static
@param {String} [dependentKeys*] Optional dependent keys that trigger this computed property.
@param {Function} func The computed property function.
@return {ComputedDecorator} property decorator instance
@public
*/
function computed(...args) {
	if (isElementDescriptor(args)) return makeComputedDecorator(new ComputedProperty([]), ComputedDecoratorImpl)(args[0], args[1], args[2]);
	return makeComputedDecorator(new ComputedProperty(args), ComputedDecoratorImpl);
}
function autoComputed(...config) {
	return makeComputedDecorator(new AutoComputedProperty(config), ComputedDecoratorImpl);
}
/**
Allows checking if a given property on an object is a computed property. For the most part,
this doesn't matter (you would normally just access the property directly and use its value),
but for some tooling specific scenarios (e.g. the ember-inspector) it is important to
differentiate if a property is a computed property or a "normal" property.

This will work on either a class's prototype or an instance itself.

@static
@method isComputed
@for @ember/debug
@private
*/
function isComputed(obj, key) {
	return Boolean(descriptorForProperty(obj, key));
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/container-BYOnjnwz.js
/**
A container used to instantiate and cache objects.

Every `Container` must be associated with a `Registry`, which is referenced
to determine the factory and options that should be used to instantiate
objects.

The public API for `Container` is still in flux and should not be considered
stable.

@private
@class Container
*/
var Container = class {
	static _leakTracking;
	owner;
	registry;
	cache;
	factoryManagerCache;
	validationCache;
	isDestroyed;
	isDestroying;
	constructor(registry, options = {}) {
		this.registry = registry;
		this.owner = options.owner || null;
		this.cache = makeDictionary(options.cache || null);
		this.factoryManagerCache = makeDictionary(options.factoryManagerCache || null);
		this.isDestroyed = false;
		this.isDestroying = false;
	}
	/**
	@private
	@property registry
	@type Registry
	@since 1.11.0
	*/
	/**
	@private
	@property cache
	@type InheritingDict
	*/
	/**
	@private
	@property validationCache
	@type InheritingDict
	*/
	/**
	Given a fullName return a corresponding instance.
	The default behavior is for lookup to return a singleton instance.
	The singleton is scoped to the container, allowing multiple containers
	to all have their own locally scoped singletons.
	```javascript
	let registry = new Registry();
	let container = registry.container();
	registry.register('api:twitter', Twitter);
	let twitter = container.lookup('api:twitter');
	twitter instanceof Twitter; // => true
	// by default the container will return singletons
	let twitter2 = container.lookup('api:twitter');
	twitter2 instanceof Twitter; // => true
	twitter === twitter2; //=> true
	```
	If singletons are not wanted, an optional flag can be provided at lookup.
	```javascript
	let registry = new Registry();
	let container = registry.container();
	registry.register('api:twitter', Twitter);
	let twitter = container.lookup('api:twitter', { singleton: false });
	let twitter2 = container.lookup('api:twitter', { singleton: false });
	twitter === twitter2; //=> false
	```
	@private
	@method lookup
	@param {String} fullName
	@param {RegisterOptions} [options]
	@return {any}
	*/
	lookup(fullName, options) {
		if (this.isDestroyed) throw new Error(`Cannot call \`.lookup('${fullName}')\` after the owner has been destroyed`);
		return lookup(this, this.registry.normalize(fullName), options);
	}
	/**
	A depth first traversal, destroying the container, its descendant containers and all
	their managed objects.
	@private
	@method destroy
	*/
	destroy() {
		this.isDestroying = true;
		destroyDestroyables(this);
	}
	finalizeDestroy() {
		resetCache(this);
		this.isDestroyed = true;
	}
	/**
	Clear either the entire cache or just the cache for a particular key.
	@private
	@method reset
	@param {String} fullName optional key to reset; if missing, resets everything
	*/
	reset(fullName) {
		if (this.isDestroyed) return;
		if (fullName === void 0) {
			destroyDestroyables(this);
			resetCache(this);
		} else resetMember(this, this.registry.normalize(fullName));
	}
	/**
	Returns an object that can be used to provide an owner to a
	manually created instance.
	@private
	@method ownerInjection
	@returns { Object }
	*/
	ownerInjection() {
		let injection = {};
		setOwner(injection, this.owner);
		return injection;
	}
	/**
	Given a fullName, return the corresponding factory. The consumer of the factory
	is responsible for the destruction of any factory instances, as there is no
	way for the container to ensure instances are destroyed when it itself is
	destroyed.
	@public
	@method factoryFor
	@param {String} fullName
	@return {any}
	*/
	factoryFor(fullName) {
		if (this.isDestroyed) throw new Error(`Cannot call \`.factoryFor('${fullName}')\` after the owner has been destroyed`);
		let normalizedName = this.registry.normalize(fullName);
		return factoryFor(this, normalizedName, fullName);
	}
};
function isSingleton(container, fullName) {
	return container.registry.getOption(fullName, "singleton") !== false;
}
function isInstantiatable(container, fullName) {
	return container.registry.getOption(fullName, "instantiate") !== false;
}
function lookup(container, fullName, options = {}) {
	let normalizedName = fullName;
	if (options.singleton === true || options.singleton === void 0 && isSingleton(container, fullName)) {
		let cached = container.cache[normalizedName];
		if (cached !== void 0) return cached;
	}
	return instantiateFactory(container, normalizedName, fullName, options);
}
function factoryFor(container, normalizedName, fullName) {
	let cached = container.factoryManagerCache[normalizedName];
	if (cached !== void 0) return cached;
	let factory = container.registry.resolve(normalizedName);
	if (factory === void 0) return;
	let manager = new InternalFactoryManager(container, factory, fullName, normalizedName);
	container.factoryManagerCache[normalizedName] = manager;
	return manager;
}
function isSingletonClass(container, fullName, { instantiate, singleton }) {
	return singleton !== false && !instantiate && isSingleton(container, fullName) && !isInstantiatable(container, fullName);
}
function isSingletonInstance(container, fullName, { instantiate, singleton }) {
	return singleton !== false && instantiate !== false && (singleton === true || isSingleton(container, fullName)) && isInstantiatable(container, fullName);
}
function isFactoryClass(container, fullname, { instantiate, singleton }) {
	return instantiate === false && (singleton === false || !isSingleton(container, fullname)) && !isInstantiatable(container, fullname);
}
function isFactoryInstance(container, fullName, { instantiate, singleton }) {
	return instantiate !== false && (singleton === false || !isSingleton(container, fullName)) && isInstantiatable(container, fullName);
}
function instantiateFactory(container, normalizedName, fullName, options) {
	let factoryManager = factoryFor(container, normalizedName, fullName);
	if (factoryManager === void 0) return;
	if (isSingletonInstance(container, fullName, options)) {
		let instance = container.cache[normalizedName] = factoryManager.create();
		if (container.isDestroying) {
			if (typeof instance.destroy === "function") instance.destroy();
		}
		return instance;
	}
	if (isFactoryInstance(container, fullName, options)) return factoryManager.create();
	if (isSingletonClass(container, fullName, options) || isFactoryClass(container, fullName, options)) return factoryManager.class;
	throw new Error("Could not create factory");
}
function destroyDestroyables(container) {
	let cache = container.cache;
	let keys = Object.keys(cache);
	for (let key of keys) {
		let value = cache[key];
		if (value.destroy) value.destroy();
	}
}
function resetCache(container) {
	container.cache = makeDictionary(null);
	container.factoryManagerCache = makeDictionary(null);
}
function resetMember(container, fullName) {
	let member = container.cache[fullName];
	delete container.factoryManagerCache[fullName];
	if (member) {
		delete container.cache[fullName];
		if (member.destroy) member.destroy();
	}
}
var INIT_FACTORY = Symbol("INIT_FACTORY");
function getFactoryFor(obj) {
	return obj[INIT_FACTORY];
}
function setFactoryFor(obj, factory) {
	obj[INIT_FACTORY] = factory;
}
var InternalFactoryManager = class {
	container;
	owner;
	class;
	fullName;
	normalizedName;
	madeToString;
	injections;
	constructor(container, factory, fullName, normalizedName) {
		this.container = container;
		this.owner = container.owner;
		this.class = factory;
		this.fullName = fullName;
		this.normalizedName = normalizedName;
		this.madeToString = void 0;
		this.injections = void 0;
	}
	toString() {
		if (this.madeToString === void 0) this.madeToString = this.container.registry.makeToString(this.class, this.fullName);
		return this.madeToString;
	}
	create(options) {
		let { container } = this;
		if (container.isDestroyed) throw new Error(`Cannot create new instances after the owner has been destroyed (you attempted to create ${this.fullName})`);
		let props = options ? { ...options } : {};
		setOwner(props, container.owner);
		setFactoryFor(props, this);
		return this.class.create(props);
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/intern-zquhAEIg.js
/**
Strongly hint runtimes to intern the provided string.

When do I need to use this function?

For the most part, never. Pre-mature optimization is bad, and often the
runtime does exactly what you need it to, and more often the trade-off isn't
worth it.

Why?

Runtimes store strings in at least 2 different representations:
Ropes and Symbols (interned strings). The Rope provides a memory efficient
data-structure for strings created from concatenation or some other string
manipulation like splitting.

Unfortunately checking equality of different ropes can be quite costly as
runtimes must resort to clever string comparison algorithms. These
algorithms typically cost in proportion to the length of the string.
Luckily, this is where the Symbols (interned strings) shine. As Symbols are
unique by their string content, equality checks can be done by pointer
comparison.

How do I know if my string is a rope or symbol?

Typically (warning general sweeping statement, but truthy in runtimes at
present) static strings created as part of the JS source are interned.
Strings often used for comparisons can be interned at runtime if some
criteria are met.  One of these criteria can be the size of the entire rope.
For example, in chrome 38 a rope longer then 12 characters will not
intern, nor will segments of that rope.

Some numbers: http://jsperf.com/eval-vs-keys/8

Known Trick™

@private
@return {String} interned version of the provided string
*/
function intern(str) {
	let obj = Object.create(null);
	obj[str] = 1;
	for (let key in obj) if (key === str) return key;
	return str;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/guid-Cbq2sNV_.js
/**
@module @ember/object
*/
/**
@private
@return {Number} the uuid
*/
var _uuid = 0;
/**
Generates a universally unique identifier. This method
is used internally by Ember for assisting with
the generation of GUID's and other unique identifiers.

@public
@return {Number} [description]
*/
function uuid() {
	return ++_uuid;
}
/**
Prefix used for guids through out Ember.
@private
@property GUID_PREFIX
@for Ember
@type String
@final
*/
var GUID_PREFIX = "ember";
var OBJECT_GUIDS = /* @__PURE__ */ new WeakMap();
var NON_OBJECT_GUIDS = /* @__PURE__ */ new Map();
/**
A unique key used to assign guids and other private metadata to objects.
If you inspect an object in your browser debugger you will often see these.
They can be safely ignored.

On browsers that support it, these properties are added with enumeration
disabled so they won't show up when you iterate over your properties.

@private
@property GUID_KEY
@for Ember
@type String
@final
*/
var GUID_KEY = intern(`__ember${Date.now()}`);
/**
Generates a new guid, optionally saving the guid to the object that you
pass in. You will rarely need to use this method. Instead you should
call `guidFor(obj)`, which return an existing guid if available.

@private
@method generateGuid
@static
@for @ember/object/internals
@param {Object} [obj] Object the guid will be used for. If passed in, the guid will
be saved on the object and reused whenever you pass the same object
again.

If no object is passed, just generate a new guid.
@param {String} [prefix] Prefix to place in front of the guid. Useful when you want to
separate the guid into separate namespaces.
@return {String} the guid
*/
function generateGuid(obj, prefix = GUID_PREFIX) {
	let guid = prefix + uuid().toString();
	if (isObject(obj)) OBJECT_GUIDS.set(obj, guid);
	return guid;
}
/**
Returns a unique id for the object. If the object does not yet have a guid,
one will be assigned to it. You can call this on any object,
`EmberObject`-based or not.

You can also use this method on DOM Element objects.

@public
@static
@method guidFor
@for @ember/object/internals
@param {Object} obj any object, string, number, Element, or primitive
@return {String} the unique guid for this instance.
*/
function guidFor(value) {
	let guid;
	if (isObject(value)) {
		guid = OBJECT_GUIDS.get(value);
		if (guid === void 0) {
			guid = `${GUID_PREFIX}${uuid()}`;
			OBJECT_GUIDS.set(value, guid);
		}
	} else {
		guid = NON_OBJECT_GUIDS.get(value);
		if (guid === void 0) {
			let type = typeof value;
			if (type === "string") guid = `st${uuid()}`;
			else if (type === "number") guid = `nu${uuid()}`;
			else if (type === "symbol") guid = `sy${uuid()}`;
			else guid = `(${value})`;
			NON_OBJECT_GUIDS.set(value, guid);
		}
	}
	return guid;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/environment/index.js
var environment_exports = /* @__PURE__ */ __exportAll({
	ENV: () => ENV,
	context: () => context,
	getENV: () => getENV,
	getLookup: () => getLookup,
	setLookup: () => setLookup
});
var global = globalThis;
var Ember = global["Ember"];
var context = Ember === void 0 ? {
	imports: global,
	exports: global,
	lookup: global
} : {
	imports: Ember.imports || global,
	exports: Ember.exports || global,
	lookup: Ember.lookup || global
};
function getLookup() {
	return context.lookup;
}
function setLookup(value) {
	context.lookup = value;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/name-Clp4Vsod.js
var NAMES = /* @__PURE__ */ new WeakMap();
function setName(obj, name) {
	if (isObject(obj)) NAMES.set(obj, name);
}
function getName(obj) {
	return NAMES.get(obj);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/namespace_search-BfvzEQzN.js
var hasOwnProperty = Object.prototype.hasOwnProperty;
var searchDisabled = false;
var flags = {
	_set: 0,
	_unprocessedNamespaces: false,
	get unprocessedNamespaces() {
		return this._unprocessedNamespaces;
	},
	set unprocessedNamespaces(v) {
		this._set++;
		this._unprocessedNamespaces = v;
	}
};
var unprocessedMixins = false;
var NAMESPACES = [];
var NAMESPACES_BY_ID = Object.create(null);
function addNamespace(namespace) {
	flags.unprocessedNamespaces = true;
	NAMESPACES.push(namespace);
}
function removeNamespace(namespace) {
	let name = getName(namespace);
	delete NAMESPACES_BY_ID[name];
	NAMESPACES.splice(NAMESPACES.indexOf(namespace), 1);
	if (name in context.lookup && namespace === context.lookup[name]) context.lookup[name] = void 0;
}
function findNamespaces() {
	if (!flags.unprocessedNamespaces) return;
	let lookup = context.lookup;
	let keys = Object.keys(lookup);
	for (let key of keys) {
		if (!isUppercase(key.charCodeAt(0))) continue;
		let obj = tryIsNamespace(lookup, key);
		if (obj) setName(obj, key);
	}
}
function findNamespace(name) {
	if (!searchDisabled) processAllNamespaces();
	return NAMESPACES_BY_ID[name];
}
function processNamespace(namespace) {
	_processNamespace([namespace.toString()], namespace, /* @__PURE__ */ new Set());
}
function processAllNamespaces() {
	let unprocessedNamespaces = flags.unprocessedNamespaces;
	if (unprocessedNamespaces) {
		findNamespaces();
		flags.unprocessedNamespaces = false;
	}
	if (unprocessedNamespaces || unprocessedMixins) {
		let namespaces = NAMESPACES;
		for (let namespace of namespaces) processNamespace(namespace);
		unprocessedMixins = false;
	}
}
function isSearchDisabled() {
	return searchDisabled;
}
function setSearchDisabled(flag) {
	searchDisabled = Boolean(flag);
}
function setUnprocessedMixins() {
	unprocessedMixins = true;
}
function _processNamespace(paths, root, seen) {
	let idx = paths.length;
	let id = paths.join(".");
	NAMESPACES_BY_ID[id] = root;
	setName(root, id);
	for (let key in root) {
		if (!hasOwnProperty.call(root, key)) continue;
		let obj = root[key];
		paths[idx] = key;
		if (obj && getName(obj) === void 0) setName(obj, paths.join("."));
		else if (obj && isNamespace(obj)) {
			if (seen.has(obj)) continue;
			seen.add(obj);
			_processNamespace(paths, obj, seen);
		}
	}
	paths.length = idx;
}
function isNamespace(obj) {
	return obj != null && typeof obj === "object" && obj.isNamespace;
}
function isUppercase(code) {
	return code >= 65 && code <= 90;
}
function tryIsNamespace(lookup, prop) {
	try {
		let obj = lookup[prop];
		return (obj !== null && typeof obj === "object" || typeof obj === "function") && obj.isNamespace && obj;
	} catch (_e) {}
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/mixin.js
/**
@module @ember/object/mixin
*/
var a_concat = Array.prototype.concat;
function extractAccessors(properties) {
	if (properties !== void 0) for (let key of Object.keys(properties)) {
		let desc = Object.getOwnPropertyDescriptor(properties, key);
		if (desc.get !== void 0 || desc.set !== void 0) Object.defineProperty(properties, key, { value: nativeDescDecorator(desc) });
	}
	return properties;
}
function concatenatedMixinProperties(concatProp, props, values, base) {
	let concats = values[concatProp] || base[concatProp];
	if (props[concatProp]) concats = concats ? a_concat.call(concats, props[concatProp]) : props[concatProp];
	return concats;
}
function giveDecoratorSuper(key, decorator, property, descs) {
	if (property === true) return decorator;
	let originalGetter = property._getter;
	if (originalGetter === void 0) return decorator;
	let superDesc = descs[key];
	let superProperty = typeof superDesc === "function" ? descriptorForDecorator(superDesc) : superDesc;
	if (superProperty === void 0 || superProperty === true) return decorator;
	let superGetter = superProperty._getter;
	if (superGetter === void 0) return decorator;
	let get = wrap(originalGetter, superGetter);
	let set;
	let originalSetter = property._setter;
	let superSetter = superProperty._setter;
	if (superSetter !== void 0) {
		if (originalSetter !== void 0) set = wrap(originalSetter, superSetter);
		else set = superSetter;
	} else set = originalSetter;
	if (get !== originalGetter || set !== originalSetter) {
		let newProperty = new ComputedProperty([...property._dependentKeys || [], {
			get,
			set
		}]);
		newProperty._readOnly = property._readOnly;
		newProperty._meta = property._meta;
		newProperty.enumerable = property.enumerable;
		return makeComputedDecorator(newProperty, ComputedProperty);
	}
	return decorator;
}
function giveMethodSuper(key, method, values, descs) {
	if (descs[key] !== void 0) return method;
	let superMethod = values[key];
	if (typeof superMethod === "function") return wrap(method, superMethod);
	return method;
}
function simpleMakeArray(value) {
	if (!value) return [];
	else if (!Array.isArray(value)) return [value];
	else return value;
}
function applyConcatenatedProperties(key, value, values) {
	let baseValue = values[key];
	return simpleMakeArray(baseValue).concat(simpleMakeArray(value));
}
function applyMergedProperties(key, value, values) {
	let baseValue = values[key];
	if (!baseValue) return value;
	let newBase = Object.assign({}, baseValue);
	let hasFunction = false;
	let props = Object.keys(value);
	for (let prop of props) {
		let propValue = value[prop];
		if (typeof propValue === "function") {
			hasFunction = true;
			newBase[prop] = giveMethodSuper(prop, propValue, baseValue, {});
		} else newBase[prop] = propValue;
	}
	if (hasFunction) newBase._super = ROOT;
	return newBase;
}
function mergeMixins(mixins, meta, descs, values, base, keys, keysWithSuper) {
	let currentMixin;
	for (let i = 0; i < mixins.length; i++) {
		currentMixin = mixins[i];
		if (MIXINS.has(currentMixin)) {
			if (meta.hasMixin(currentMixin)) continue;
			meta.addMixin(currentMixin);
			let { properties, mixins } = currentMixin;
			if (properties !== void 0) mergeProps(meta, properties, descs, values, base, keys, keysWithSuper);
			else if (mixins !== void 0) {
				mergeMixins(mixins, meta, descs, values, base, keys, keysWithSuper);
				if (currentMixin instanceof Mixin && currentMixin._without !== void 0) currentMixin._without.forEach((keyName) => {
					let index = keys.indexOf(keyName);
					if (index !== -1) keys.splice(index, 1);
				});
			}
		} else mergeProps(meta, currentMixin, descs, values, base, keys, keysWithSuper);
	}
}
function mergeProps(meta, props, descs, values, base, keys, keysWithSuper) {
	let concats = concatenatedMixinProperties("concatenatedProperties", props, values, base);
	let mergings = concatenatedMixinProperties("mergedProperties", props, values, base);
	let propKeys = Object.keys(props);
	for (let key of propKeys) {
		let value = props[key];
		if (value === void 0) continue;
		if (keys.indexOf(key) === -1) {
			keys.push(key);
			let desc = meta.peekDescriptors(key);
			if (desc === void 0) {
				if (!isClassicDecorator(value)) {
					let prev = values[key] = base[key];
					if (typeof prev === "function") updateObserversAndListeners(base, key, prev, false);
				}
			} else {
				descs[key] = desc;
				keysWithSuper.push(key);
				desc.teardown(base, key, meta);
			}
		}
		let isFunction = typeof value === "function";
		if (isFunction) {
			let desc = descriptorForDecorator(value);
			if (desc !== void 0) {
				descs[key] = giveDecoratorSuper(key, value, desc, descs);
				values[key] = void 0;
				continue;
			}
		}
		if (concats && concats.indexOf(key) >= 0 || key === "concatenatedProperties" || key === "mergedProperties") value = applyConcatenatedProperties(key, value, values);
		else if (mergings && mergings.indexOf(key) > -1) value = applyMergedProperties(key, value, values);
		else if (isFunction) value = giveMethodSuper(key, value, values, descs);
		values[key] = value;
		descs[key] = void 0;
	}
}
function updateObserversAndListeners(obj, key, fn, add) {
	let meta = observerListenerMetaFor(fn);
	if (meta === void 0) return;
	let { observers, listeners } = meta;
	if (observers !== void 0) {
		let updateObserver = add ? addObserver : removeObserver;
		for (let path of observers.paths) updateObserver(obj, path, null, key, observers.sync);
	}
	if (listeners !== void 0) {
		let updateListener = add ? addListener : removeListener;
		for (let listener of listeners) updateListener(obj, listener, null, key);
	}
}
function applyMixin(obj, mixins, _hideKeys = false) {
	let descs = Object.create(null);
	let values = Object.create(null);
	let meta$1 = meta(obj);
	let keys = [];
	let keysWithSuper = [];
	obj._super = ROOT;
	mergeMixins(mixins, meta$1, descs, values, obj, keys, keysWithSuper);
	for (let key of keys) {
		let value = values[key];
		let desc = descs[key];
		if (value !== void 0) {
			if (typeof value === "function") updateObserversAndListeners(obj, key, value, true);
			defineValue(obj, key, value, keysWithSuper.indexOf(key) !== -1, !_hideKeys);
		} else if (desc !== void 0) defineDecorator(obj, key, desc, meta$1);
	}
	if (!meta$1.isPrototypeMeta(obj)) revalidateObservers(obj);
	return obj;
}
var MIXINS = /* @__PURE__ */ new WeakSet();
/**
The `Mixin` class allows you to create mixins, whose properties can be
added to other classes. For instance,

```javascript
import Mixin from '@ember/object/mixin';

const EditableMixin = Mixin.create({
edit() {
console.log('starting to edit');
this.set('isEditing', true);
},
isEditing: false
});
```

```javascript
import EmberObject from '@ember/object';
import EditableMixin from '../mixins/editable';

// Mix mixins into classes by passing them as the first arguments to
// `.extend.`
class Comment extends EmberObject.extend(EditableMixin) {
post = null
}

let comment = Comment.create({
post: somePost
});

comment.edit(); // outputs 'starting to edit'
```

Note that Mixins are created with `Mixin.create`, not
`Mixin.extend`.

Note that mixins extend a constructor's prototype so arrays and object literals
defined as properties will be shared amongst objects that implement the mixin.
If you want to define a property in a mixin that is not shared, you can define
it either as a computed property or have it be created on initialization of the object.

```javascript
// filters array will be shared amongst any object implementing mixin
import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';

const FilterableMixin = Mixin.create({
filters: A()
});
```

```javascript
import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';
import { computed } from '@ember/object';

// filters will be a separate array for every object implementing the mixin
const FilterableMixin = Mixin.create({
filters: computed(function() {
return A();
})
});
```

```javascript
import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';

// filters will be created as a separate array during the object's initialization
const Filterable = Mixin.create({
filters: null,

init() {
this._super(...arguments);
this.set("filters", A());
}
});
```

@class Mixin
@public
*/
var Mixin = class Mixin {
	/** @internal */
	/** @internal */
	mixins;
	/** @internal */
	properties;
	/** @internal */
	ownerConstructor;
	/** @internal */
	_without;
	/** @internal */
	constructor(mixins, properties) {
		MIXINS.add(this);
		this.properties = extractAccessors(properties);
		this.mixins = buildMixinsArray(mixins);
		this.ownerConstructor = void 0;
		this._without = void 0;
	}
	/**
	@method create
	@for @ember/object/mixin
	@static
	@param arguments*
	@public
	*/
	static create(...args) {
		setUnprocessedMixins();
		return new this(args, void 0);
	}
	/** @internal */
	static mixins(obj) {
		let meta = peekMeta(obj);
		let ret = [];
		if (meta === null) return ret;
		meta.forEachMixins((currentMixin) => {
			if (!currentMixin.properties) ret.push(currentMixin);
		});
		return ret;
	}
	/**
	@method reopen
	@param arguments*
	@private
	@internal
	*/
	reopen(...args) {
		if (args.length === 0) return this;
		if (this.properties) {
			let currentMixin = new Mixin(void 0, this.properties);
			this.properties = void 0;
			this.mixins = [currentMixin];
		} else if (!this.mixins) this.mixins = [];
		this.mixins = this.mixins.concat(buildMixinsArray(args));
		return this;
	}
	/**
	@method apply
	@param obj
	@return applied object
	@private
	@internal
	*/
	apply(obj, _hideKeys = false) {
		return applyMixin(obj, [this], _hideKeys);
	}
	/** @internal */
	applyPartial(obj) {
		return applyMixin(obj, [this]);
	}
	/**
	@method detect
	@param obj
	@return {Boolean}
	@private
	@internal
	*/
	detect(obj) {
		if (typeof obj !== "object" || obj === null) return false;
		if (MIXINS.has(obj)) return _detect(obj, this);
		let meta = peekMeta(obj);
		if (meta === null) return false;
		return meta.hasMixin(this);
	}
	/** @internal */
	without(...args) {
		let ret = new Mixin([this]);
		ret._without = args;
		return ret;
	}
	/** @internal */
	keys() {
		return _keys(this);
	}
	/** @internal */
	toString() {
		return "(unknown mixin)";
	}
};
function buildMixinsArray(mixins) {
	let length = mixins && mixins.length || 0;
	let m = void 0;
	if (length > 0) {
		m = new Array(length);
		for (let i = 0; i < length; i++) {
			let x = mixins[i];
			if (MIXINS.has(x)) m[i] = x;
			else m[i] = new Mixin(void 0, x);
		}
	}
	return m;
}
function _detect(curMixin, targetMixin, seen = /* @__PURE__ */ new Set()) {
	if (seen.has(curMixin)) return false;
	seen.add(curMixin);
	if (curMixin === targetMixin) return true;
	let mixins = curMixin.mixins;
	if (mixins) return mixins.some((mixin) => _detect(mixin, targetMixin, seen));
	return false;
}
function _keys(mixin, ret = /* @__PURE__ */ new Set(), seen = /* @__PURE__ */ new Set()) {
	if (seen.has(mixin)) return;
	seen.add(mixin);
	if (mixin.properties) {
		let props = Object.keys(mixin.properties);
		for (let prop of props) ret.add(prop);
	} else if (mixin.mixins) mixin.mixins.forEach((x) => _keys(x, ret, seen));
	return ret;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/array/lib/make-array.js
var { isArray } = Array;
/**
@module @ember/array
*/
/**
Forces the passed object to be part of an array. If the object is already
an array, it will return the object. Otherwise, it will add the object to
an array. If object is `null` or `undefined`, it will return an empty array.

```javascript
import { makeArray } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

makeArray();            // []
makeArray(null);        // []
makeArray(undefined);   // []
makeArray('lindsay');   // ['lindsay']
makeArray([1, 2, 42]);  // [1, 2, 42]

let proxy = ArrayProxy.create({ content: [] });

makeArray(proxy) === proxy;  // false
```

@method makeArray
@static
@for @ember/array
@param {Object} obj the object
@return {Array}
@private
*/
function makeArray(obj) {
	if (obj === null || obj === void 0) return [];
	return isArray(obj) ? obj : [obj];
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/core.js
var core_exports = /* @__PURE__ */ __exportAll({ default: () => CoreObject });
/**
@module @ember/object/core
*/
function hasSetUnknownProperty(val) {
	return typeof val === "object" && val !== null && typeof val.setUnknownProperty === "function";
}
function hasToStringExtension(val) {
	return typeof val === "object" && val !== null && typeof val.toStringExtension === "function";
}
var reopen = Mixin.prototype.reopen;
var wasApplied = /* @__PURE__ */ new WeakSet();
var prototypeMixinMap = /* @__PURE__ */ new WeakMap();
var destroyCalled = /* @__PURE__ */ new Set();
function ensureDestroyCalled(instance) {
	if (!destroyCalled.has(instance)) instance.destroy();
}
function initialize(obj, properties) {
	let m = meta(obj);
	if (properties !== void 0) {
		let concatenatedProperties = obj.concatenatedProperties;
		let mergedProperties = obj.mergedProperties;
		let keyNames = Object.keys(properties);
		for (let keyName of keyNames) {
			let value = properties[keyName];
			let possibleDesc = descriptorForProperty(obj, keyName, m);
			let isDescriptor = possibleDesc !== void 0;
			if (!isDescriptor) {
				if (concatenatedProperties !== void 0 && concatenatedProperties.length > 0 && concatenatedProperties.includes(keyName)) {
					let baseValue = obj[keyName];
					if (baseValue) value = makeArray(baseValue).concat(value);
					else value = makeArray(value);
				}
				if (mergedProperties !== void 0 && mergedProperties.length > 0 && mergedProperties.includes(keyName)) {
					let baseValue = obj[keyName];
					value = Object.assign({}, baseValue, value);
				}
			}
			if (isDescriptor) possibleDesc.set(obj, keyName, value);
			else if (hasSetUnknownProperty(obj) && !(keyName in obj)) obj.setUnknownProperty(keyName, value);
			else obj[keyName] = value;
		}
	}
	obj.init(properties);
	m.unsetInitializing();
	let observerEvents = m.observerEvents();
	if (observerEvents !== void 0) for (let i = 0; i < observerEvents.length; i++) activateObserver(obj, observerEvents[i].event, observerEvents[i].sync);
	sendEvent(obj, "init", void 0, void 0, m);
}
/**
`CoreObject` is the base class for all Ember constructs. It establishes a
class system based on Ember's Mixin system, and provides the basis for the
Ember Object Model. `CoreObject` should generally not be used directly,
instead you should use `EmberObject`.

## Usage

You can define a class by extending from `CoreObject` using the `extend`
method:

```js
const Person = CoreObject.extend({
name: 'Tomster',
});
```

For detailed usage, see the [Object Model](https://guides.emberjs.com/release/object-model/)
section of the guides.

## Usage with Native Classes

Native JavaScript `class` syntax can be used to extend from any `CoreObject`
based class:

```js
class Person extends CoreObject {
init() {
super.init(...arguments);
this.name = 'Tomster';
}
}
```

Some notes about `class` usage:

* `new` syntax is not currently supported with classes that extend from
`EmberObject` or `CoreObject`. You must continue to use the `create` method
when making new instances of classes, even if they are defined using native
class syntax. If you want to use `new` syntax, consider creating classes
which do _not_ extend from `EmberObject` or `CoreObject`. Ember features,
such as computed properties and decorators, will still work with base-less
classes.
* Instead of using `this._super()`, you must use standard `super` syntax in
native classes. See the [MDN docs on classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Super_class_calls_with_super)
for more details.
* Native classes support using [constructors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Constructor)
to set up newly-created instances. Ember uses these to, among other things,
support features that need to retrieve other entities by name, like Service
injection and `getOwner`. To ensure your custom instance setup logic takes
place after this important work is done, avoid using the `constructor` in
favor of `init`.
* Properties passed to `create` will be available on the instance by the time
`init` runs, so any code that requires these values should work at that
time.
* Using native classes, and switching back to the old Ember Object model is
fully supported.

@class CoreObject
@public
*/
var CoreObject = class {
	/** @internal */
	[OWNER];
	constructor(owner) {
		this[OWNER] = owner;
		this.constructor.proto();
		let self;
		self = this;
		const destroyable = self;
		registerDestructor(self, ensureDestroyCalled, true);
		registerDestructor(self, () => destroyable.willDestroy());
		meta(self).setInitializing();
	}
	reopen(...args) {
		applyMixin(this, args);
		return this;
	}
	/**
	An overridable method called when objects are instantiated. By default,
	does nothing unless it is overridden during class definition.
	Example:
	```javascript
	import EmberObject from '@ember/object';
	const Person = EmberObject.extend({
	init() {
	alert(`Name is ${this.get('name')}`);
	}
	});
	let steve = Person.create({
	name: 'Steve'
	});
	// alerts 'Name is Steve'.
	```
	NOTE: If you do override `init` for a framework class like `Component`
	from `@ember/component`, be sure to call `this._super(...arguments)`
	in your `init` declaration!
	If you don't, Ember may not have an opportunity to
	do important setup work, and you'll see strange behavior in your
	application.
	@method init
	@public
	*/
	init(_properties) {}
	/**
	Defines the properties that will be concatenated from the superclass
	(instead of overridden).
	By default, when you extend an Ember class a property defined in
	the subclass overrides a property with the same name that is defined
	in the superclass. However, there are some cases where it is preferable
	to build up a property's value by combining the superclass' property
	value with the subclass' value. An example of this in use within Ember
	is the `classNames` property of `Component` from `@ember/component`.
	Here is some sample code showing the difference between a concatenated
	property and a normal one:
	```javascript
	import EmberObject from '@ember/object';
	const Bar = EmberObject.extend({
	// Configure which properties to concatenate
	concatenatedProperties: ['concatenatedProperty'],
	someNonConcatenatedProperty: ['bar'],
	concatenatedProperty: ['bar']
	});
	const FooBar = Bar.extend({
	someNonConcatenatedProperty: ['foo'],
	concatenatedProperty: ['foo']
	});
	let fooBar = FooBar.create();
	fooBar.get('someNonConcatenatedProperty'); // ['foo']
	fooBar.get('concatenatedProperty'); // ['bar', 'foo']
	```
	This behavior extends to object creation as well. Continuing the
	above example:
	```javascript
	let fooBar = FooBar.create({
	someNonConcatenatedProperty: ['baz'],
	concatenatedProperty: ['baz']
	})
	fooBar.get('someNonConcatenatedProperty'); // ['baz']
	fooBar.get('concatenatedProperty'); // ['bar', 'foo', 'baz']
	```
	Adding a single property that is not an array will just add it in the array:
	```javascript
	let fooBar = FooBar.create({
	concatenatedProperty: 'baz'
	})
	view.get('concatenatedProperty'); // ['bar', 'foo', 'baz']
	```
	Using the `concatenatedProperties` property, we can tell Ember to mix the
	content of the properties.
	In `Component` the `classNames`, `classNameBindings` and
	`attributeBindings` properties are concatenated.
	This feature is available for you to use throughout the Ember object model,
	although typical app developers are likely to use it infrequently. Since
	it changes expectations about behavior of properties, you should properly
	document its usage in each individual concatenated property (to not
	mislead your users to think they can override the property in a subclass).
	@property concatenatedProperties
	@type Array
	@default null
	@public
	*/
	/**
	Defines the properties that will be merged from the superclass
	(instead of overridden).
	By default, when you extend an Ember class a property defined in
	the subclass overrides a property with the same name that is defined
	in the superclass. However, there are some cases where it is preferable
	to build up a property's value by merging the superclass property value
	with the subclass property's value. An example of this in use within Ember
	is the `queryParams` property of routes.
	Here is some sample code showing the difference between a merged
	property and a normal one:
	```javascript
	import EmberObject from '@ember/object';
	const Bar = EmberObject.extend({
	// Configure which properties are to be merged
	mergedProperties: ['mergedProperty'],
	someNonMergedProperty: {
	nonMerged: 'superclass value of nonMerged'
	},
	mergedProperty: {
	page: { replace: false },
	limit: { replace: true }
	}
	});
	const FooBar = Bar.extend({
	someNonMergedProperty: {
	completelyNonMerged: 'subclass value of nonMerged'
	},
	mergedProperty: {
	limit: { replace: false }
	}
	});
	let fooBar = FooBar.create();
	fooBar.get('someNonMergedProperty');
	// => { completelyNonMerged: 'subclass value of nonMerged' }
	//
	// Note the entire object, including the nonMerged property of
	// the superclass object, has been replaced
	fooBar.get('mergedProperty');
	// => {
	//   page: {replace: false},
	//   limit: {replace: false}
	// }
	//
	// Note the page remains from the superclass, and the
	// `limit` property's value of `false` has been merged from
	// the subclass.
	```
	This behavior is not available during object `create` calls. It is only
	available at `extend` time.
	In `Route` the `queryParams` property is merged.
	This feature is available for you to use throughout the Ember object model,
	although typical app developers are likely to use it infrequently. Since
	it changes expectations about behavior of properties, you should properly
	document its usage in each individual merged property (to not
	mislead your users to think they can override the property in a subclass).
	@property mergedProperties
	@type Array
	@default null
	@public
	*/
	/**
	Destroyed object property flag.
	if this property is `true` the observers and bindings were already
	removed by the effect of calling the `destroy()` method.
	@property isDestroyed
	@default false
	@public
	*/
	get isDestroyed() {
		return isDestroyed(this);
	}
	set isDestroyed(_value) {}
	/**
	Destruction scheduled flag. The `destroy()` method has been called.
	The object stays intact until the end of the run loop at which point
	the `isDestroyed` flag is set.
	@property isDestroying
	@default false
	@public
	*/
	get isDestroying() {
		return isDestroying(this);
	}
	set isDestroying(_value) {}
	/**
	Destroys an object by setting the `isDestroyed` flag and removing its
	metadata, which effectively destroys observers and bindings.
	If you try to set a property on a destroyed object, an exception will be
	raised.
	Note that destruction is scheduled for the end of the run loop and does not
	happen immediately.  It will set an isDestroying flag immediately.
	@method destroy
	@return {EmberObject} receiver
	@public
	*/
	destroy() {
		destroyCalled.add(this);
		try {
			destroy(this);
		} finally {
			destroyCalled.delete(this);
		}
		return this;
	}
	/**
	Override to implement teardown.
	@method willDestroy
	@public
	*/
	willDestroy() {}
	/**
	Returns a string representation which attempts to provide more information
	than Javascript's `toString` typically does, in a generic way for all Ember
	objects.
	```javascript
	import EmberObject from '@ember/object';
	const Person = EmberObject.extend();
	person = Person.create();
	person.toString(); //=> "<Person:ember1024>"
	```
	If the object's class is not defined on an Ember namespace, it will
	indicate it is a subclass of the registered superclass:
	```javascript
	const Student = Person.extend();
	let student = Student.create();
	student.toString(); //=> "<(subclass of Person):ember1025>"
	```
	If the method `toStringExtension` is defined, its return value will be
	included in the output.
	```javascript
	const Teacher = Person.extend({
	toStringExtension() {
	return this.get('fullName');
	}
	});
	teacher = Teacher.create();
	teacher.toString(); //=> "<Teacher:ember1026:Tom Dale>"
	```
	@method toString
	@return {String} string representation
	@public
	*/
	toString() {
		let extension = hasToStringExtension(this) ? `:${this.toStringExtension()}` : "";
		return `<${getFactoryFor(this) || "(unknown)"}:${guidFor(this)}${extension}>`;
	}
	/**
	Creates a new subclass.
	```javascript
	import EmberObject from '@ember/object';
	const Person = EmberObject.extend({
	say(thing) {
	alert(thing);
	}
	});
	```
	This defines a new subclass of EmberObject: `Person`. It contains one method: `say()`.
	You can also create a subclass from any existing class by calling its `extend()` method.
	For example, you might want to create a subclass of Ember's built-in `Component` class:
	```javascript
	import Component from '@ember/component';
	const PersonComponent = Component.extend({
	tagName: 'li',
	classNameBindings: ['isAdministrator']
	});
	```
	When defining a subclass, you can override methods but still access the
	implementation of your parent class by calling the special `_super()` method:
	```javascript
	import EmberObject from '@ember/object';
	const Person = EmberObject.extend({
	say(thing) {
	let name = this.get('name');
	alert(`${name} says: ${thing}`);
	}
	});
	const Soldier = Person.extend({
	say(thing) {
	this._super(`${thing}, sir!`);
	},
	march(numberOfHours) {
	alert(`${this.get('name')} marches for ${numberOfHours} hours.`);
	}
	});
	let yehuda = Soldier.create({
	name: 'Yehuda Katz'
	});
	yehuda.say('Yes');  // alerts "Yehuda Katz says: Yes, sir!"
	```
	The `create()` on line #17 creates an *instance* of the `Soldier` class.
	The `extend()` on line #8 creates a *subclass* of `Person`. Any instance
	of the `Person` class will *not* have the `march()` method.
	You can also pass `Mixin` classes to add additional properties to the subclass.
	```javascript
	import EmberObject from '@ember/object';
	import Mixin from '@ember/object/mixin';
	const Person = EmberObject.extend({
	say(thing) {
	alert(`${this.get('name')} says: ${thing}`);
	}
	});
	const SingingMixin = Mixin.create({
	sing(thing) {
	alert(`${this.get('name')} sings: la la la ${thing}`);
	}
	});
	const BroadwayStar = Person.extend(SingingMixin, {
	dance() {
	alert(`${this.get('name')} dances: tap tap tap tap `);
	}
	});
	```
	The `BroadwayStar` class contains three methods: `say()`, `sing()`, and `dance()`.
	@method extend
	@static
	@for @ember/object
	@param {Mixin} [mixins]* One or more Mixin classes
	@param {Object} [arguments]* Object containing values to use within the new class
	@public
	*/
	static extend(...mixins) {
		let Class = class extends this {};
		reopen.apply(Class.PrototypeMixin, mixins);
		return Class;
	}
	/**
	Creates an instance of a class. Accepts either no arguments, or an object
	containing values to initialize the newly instantiated object with.
	```javascript
	import EmberObject from '@ember/object';
	const Person = EmberObject.extend({
	helloWorld() {
	alert(`Hi, my name is ${this.get('name')}`);
	}
	});
	let tom = Person.create({
	name: 'Tom Dale'
	});
	tom.helloWorld(); // alerts "Hi, my name is Tom Dale".
	```
	`create` will call the `init` function if defined during
	`AnyObject.extend`
	If no arguments are passed to `create`, it will not set values to the new
	instance during initialization:
	```javascript
	let noName = Person.create();
	noName.helloWorld(); // alerts undefined
	```
	NOTE: For performance reasons, you cannot declare methods or computed
	properties during `create`. You should instead declare methods and computed
	properties when using `extend`.
	@method create
	@for @ember/object
	@static
	@param [arguments]*
	@public
	*/
	static create(...args) {
		let props = args[0];
		let instance;
		if (props !== void 0) {
			instance = new this(getOwner(props));
			let factory = getFactoryFor(props);
			setFactoryFor(instance, factory);
		} else instance = new this();
		if (args.length <= 1) initialize(instance, props);
		else initialize(instance, flattenProps.apply(this, args));
		return instance;
	}
	/**
	Augments a constructor's prototype with additional
	properties and functions:
	```javascript
	import EmberObject from '@ember/object';
	const MyObject = EmberObject.extend({
	name: 'an object'
	});
	o = MyObject.create();
	o.get('name'); // 'an object'
	MyObject.reopen({
	say(msg) {
	console.log(msg);
	}
	});
	o2 = MyObject.create();
	o2.say('hello'); // logs "hello"
	o.say('goodbye'); // logs "goodbye"
	```
	To add functions and properties to the constructor itself,
	see `reopenClass`
	@method reopen
	@for @ember/object
	@static
	@public
	*/
	static reopen(...args) {
		this.willReopen();
		reopen.apply(this.PrototypeMixin, args);
		return this;
	}
	static willReopen() {
		let p = this.prototype;
		if (wasApplied.has(p)) {
			wasApplied.delete(p);
			if (prototypeMixinMap.has(this)) prototypeMixinMap.set(this, Mixin.create(this.PrototypeMixin));
		}
	}
	/**
	Augments a constructor's own properties and functions:
	```javascript
	import EmberObject from '@ember/object';
	const MyObject = EmberObject.extend({
	name: 'an object'
	});
	MyObject.reopenClass({
	canBuild: false
	});
	MyObject.canBuild; // false
	o = MyObject.create();
	```
	In other words, this creates static properties and functions for the class.
	These are only available on the class and not on any instance of that class.
	```javascript
	import EmberObject from '@ember/object';
	const Person = EmberObject.extend({
	name: '',
	sayHello() {
	alert(`Hello. My name is ${this.get('name')}`);
	}
	});
	Person.reopenClass({
	species: 'Homo sapiens',
	createPerson(name) {
	return Person.create({ name });
	}
	});
	let tom = Person.create({
	name: 'Tom Dale'
	});
	let yehuda = Person.createPerson('Yehuda Katz');
	tom.sayHello(); // "Hello. My name is Tom Dale"
	yehuda.sayHello(); // "Hello. My name is Yehuda Katz"
	alert(Person.species); // "Homo sapiens"
	```
	Note that `species` and `createPerson` are *not* valid on the `tom` and `yehuda`
	variables. They are only valid on `Person`.
	To add functions and properties to instances of
	a constructor by extending the constructor's prototype
	see `reopen`
	@method reopenClass
	@for @ember/object
	@static
	@public
	*/
	static reopenClass(...mixins) {
		applyMixin(this, mixins);
		return this;
	}
	static detect(obj) {
		if ("function" !== typeof obj) return false;
		while (obj) {
			if (obj === this) return true;
			obj = obj.superclass;
		}
		return false;
	}
	static detectInstance(obj) {
		return obj instanceof this;
	}
	/**
	In some cases, you may want to annotate computed properties with additional
	metadata about how they function or what values they operate on. For
	example, computed property functions may close over variables that are then
	no longer available for introspection.
	You can pass a hash of these values to a computed property like this:
	```javascript
	import { computed } from '@ember/object';
	person: computed(function() {
	let personId = this.get('personId');
	return Person.create({ id: personId });
	}).meta({ type: Person })
	```
	Once you've done this, you can retrieve the values saved to the computed
	property from your class like this:
	```javascript
	MyClass.metaForProperty('person');
	```
	This will return the original hash that was passed to `meta()`.
	@static
	@method metaForProperty
	@param key {String} property name
	@private
	*/
	static metaForProperty(key) {
		let proto = this.proto();
		return descriptorForProperty(proto, key)._meta || {};
	}
	/**
	Iterate over each computed property for the class, passing its name
	and any associated metadata (see `metaForProperty`) to the callback.
	@static
	@method eachComputedProperty
	@param {Function} callback
	@param {Object} binding
	@private
	*/
	static eachComputedProperty(callback, binding = this) {
		this.proto();
		let empty = {};
		meta(this.prototype).forEachDescriptors((name, descriptor) => {
			if (descriptor.enumerable) {
				let meta = descriptor._meta || empty;
				callback.call(binding, name, meta);
			}
		});
	}
	static get PrototypeMixin() {
		let prototypeMixin = prototypeMixinMap.get(this);
		if (prototypeMixin === void 0) {
			prototypeMixin = Mixin.create();
			prototypeMixin.ownerConstructor = this;
			prototypeMixinMap.set(this, prototypeMixin);
		}
		return prototypeMixin;
	}
	static get superclass() {
		let c = Object.getPrototypeOf(this);
		return c !== Function.prototype ? c : void 0;
	}
	static proto() {
		let p = this.prototype;
		if (!wasApplied.has(p)) {
			wasApplied.add(p);
			let parent = this.superclass;
			if (parent) parent.proto();
			if (prototypeMixinMap.has(this)) this.PrototypeMixin.apply(p);
		}
		return p;
	}
	static toString() {
		return `<${getFactoryFor(this) || "(unknown)"}:constructor>`;
	}
	static isClass = true;
	static isMethod = false;
	static _onLookup;
	static _lazyInjections;
};
function flattenProps(...props) {
	let initProperties = {};
	for (let properties of props) {
		let keyNames = Object.keys(properties);
		for (let j = 0, k = keyNames.length; j < k; j++) {
			let keyName = keyNames[j];
			initProperties[keyName] = properties[keyName];
		}
	}
	return initProperties;
}
//#endregion
export { beginPropertyChanges as A, PROXY_CONTENT as B, uuid as C, ComputedProperty as D, getFactoryFor as E, defineValue as F, isPath as G, _getProp as H, endPropertyChanges as I, makeDictionary as J, isProxy as K, expandProperties as L, computed as M, defineDecorator as N, PROPERTY_DID_CHANGE as O, defineProperty as P, isComputed as R, guidFor as S, Container as T, get as U, _getPath as V, hasUnknownProperty as W, setName as _, NAMESPACES as a, GUID_KEY as b, findNamespace as c, processAllNamespaces as d, processNamespace as f, getName as g, setUnprocessedMixins as h, Mixin as i, changeProperties as j, autoComputed as k, findNamespaces as l, setSearchDisabled as m, core_exports as n, NAMESPACES_BY_ID as o, removeNamespace as p, setProxy as q, makeArray as r, addNamespace as s, CoreObject as t, isSearchDisabled as u, context as v, intern as w, generateGuid as x, environment_exports as y, notifyPropertyChange as z };
