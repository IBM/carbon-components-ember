import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { A as beginPropertyChanges, I as endPropertyChanges, M as computed, U as get, i as Mixin, r as makeArray, z as notifyPropertyChange } from "./core-D-L0f59Y.js";
import { f as addListener, g as sendEvent, h as removeListener } from "./observers-BmobpXAF-CkVUhhE-.js";
import { a as peekMeta } from "./meta-B7F2ReUu.js";
import { s as objectAt } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
import { n as setEmberArray, t as isEmberArray } from "./-internals-CsfECqDC.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { t as Observable } from "./observable-BDMGT456.js";
import { t as compare } from "./compare-D24n5qO4.js";
import { t as isArray } from "./is-array-DKkHuyBq.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/array-CnXdmzOG.js
function arrayContentWillChange(array, startIdx, removeAmt, addAmt) {
	if (startIdx === void 0) {
		startIdx = 0;
		removeAmt = addAmt = -1;
	} else {
		if (removeAmt === void 0) removeAmt = -1;
		if (addAmt === void 0) addAmt = -1;
	}
	sendEvent(array, "@array:before", [
		array,
		startIdx,
		removeAmt,
		addAmt
	]);
	return array;
}
function arrayContentDidChange(array, startIdx, removeAmt, addAmt, notify = true) {
	if (startIdx === void 0) {
		startIdx = 0;
		removeAmt = addAmt = -1;
	} else {
		if (removeAmt === void 0) removeAmt = -1;
		if (addAmt === void 0) addAmt = -1;
	}
	let meta = peekMeta(array);
	if (notify) {
		if (addAmt < 0 || removeAmt < 0 || addAmt - removeAmt !== 0) notifyPropertyChange(array, "length", meta);
		notifyPropertyChange(array, "[]", meta);
	}
	sendEvent(array, "@array:change", [
		array,
		startIdx,
		removeAmt,
		addAmt
	]);
	if (meta !== null) {
		let length = array.length;
		let addedAmount = addAmt === -1 ? 0 : addAmt;
		let removedAmount = removeAmt === -1 ? 0 : removeAmt;
		let previousLength = length - (addedAmount - removedAmount);
		let normalStartIdx = startIdx < 0 ? previousLength + startIdx : startIdx;
		if (meta.revisionFor("firstObject") !== void 0 && normalStartIdx === 0) notifyPropertyChange(array, "firstObject", meta);
		if (meta.revisionFor("lastObject") !== void 0) {
			if (previousLength - 1 < normalStartIdx + removedAmount) notifyPropertyChange(array, "lastObject", meta);
		}
	}
	return array;
}
var EMPTY_ARRAY$1 = Object.freeze([]);
function isMutableArray(obj) {
	return obj != null && typeof obj.replace === "function";
}
function replace(array, start, deleteCount, items = EMPTY_ARRAY$1) {
	if (isMutableArray(array)) array.replace(start, deleteCount, items);
	else replaceInNativeArray(array, start, deleteCount, items);
}
var CHUNK_SIZE = 6e4;
function replaceInNativeArray(array, start, deleteCount, items) {
	arrayContentWillChange(array, start, deleteCount, items.length);
	if (items.length <= CHUNK_SIZE) array.splice(start, deleteCount, ...items);
	else {
		array.splice(start, deleteCount);
		for (let i = 0; i < items.length; i += CHUNK_SIZE) {
			let chunk = items.slice(i, i + CHUNK_SIZE);
			array.splice(start + i, 0, ...chunk);
		}
	}
	arrayContentDidChange(array, start, deleteCount, items.length);
}
function arrayObserversHelper(obj, target, opts, operation) {
	let { willChange, didChange } = opts;
	operation(obj, "@array:before", target, willChange);
	operation(obj, "@array:change", target, didChange);
	obj._revalidate?.();
	return obj;
}
function addArrayObserver(array, target, opts) {
	return arrayObserversHelper(array, target, opts, addListener);
}
function removeArrayObserver(array, target, opts) {
	return arrayObserversHelper(array, target, opts, removeListener);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/enumerable/index.js
/**
@module @ember/enumerable
@private
*/
/**
The methods in this mixin have been moved to [MutableArray](/ember/release/classes/MutableArray). This mixin has
been intentionally preserved to avoid breaking Enumerable.detect checks
until the community migrates away from them.

@class Enumerable
@private
*/
var Enumerable = Mixin.create();
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/enumerable/mutable.js
var mutable_exports = /* @__PURE__ */ __exportAll({ default: () => MutableEnumerable });
/**
@module ember
*/
/**
The methods in this mixin have been moved to MutableArray. This mixin has
been intentionally preserved to avoid breaking MutableEnumerable.detect
checks until the community migrates away from them.

@class MutableEnumerable
@namespace Ember
@uses Enumerable
@private
*/
var MutableEnumerable = Mixin.create(Enumerable);
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/array/index.js
var array_exports = /* @__PURE__ */ __exportAll({
	A: () => A,
	MutableArray: () => MutableArray,
	NativeArray: () => NativeArray,
	default: () => EmberArray,
	isArray: () => isArray,
	makeArray: () => makeArray,
	removeAt: () => removeAt,
	uniqBy: () => uniqBy
});
/**
@module @ember/array
*/
var EMPTY_ARRAY = Object.freeze([]);
var identityFunction = (item) => item;
function uniqBy(array, keyOrFunc = identityFunction) {
	let ret = A();
	let seen = /* @__PURE__ */ new Set();
	let getter = typeof keyOrFunc === "function" ? keyOrFunc : (item) => get(item, keyOrFunc);
	array.forEach((item) => {
		let val = getter(item);
		if (!seen.has(val)) {
			seen.add(val);
			ret.push(item);
		}
	});
	return ret;
}
function iter(...args) {
	let valueProvided = args.length === 2;
	let [key, value] = args;
	return valueProvided ? (item) => value === get(item, key) : (item) => Boolean(get(item, key));
}
function findIndex(array, predicate, startAt) {
	let len = array.length;
	for (let index = startAt; index < len; index++) if (predicate(objectAt(array, index), index, array)) return index;
	return -1;
}
function find(array, callback, target = null) {
	let index = findIndex(array, callback.bind(target), 0);
	return index === -1 ? void 0 : objectAt(array, index);
}
function any(array, callback, target = null) {
	return findIndex(array, callback.bind(target), 0) !== -1;
}
function every(array, callback, target = null) {
	let cb = callback.bind(target);
	let predicate = (item, index, array) => !cb(item, index, array);
	return findIndex(array, predicate, 0) === -1;
}
function indexOf(array, val, startAt = 0, withNaNCheck) {
	let len = array.length;
	if (startAt < 0) startAt += len;
	return findIndex(array, withNaNCheck && val !== val ? (item) => item !== item : (item) => item === val, startAt);
}
function removeAt(array, index, len) {
	replace(array, index, len ?? 1, EMPTY_ARRAY);
	return array;
}
function insertAt(array, index, item) {
	replace(array, index, 0, [item]);
	return item;
}
function nonEnumerableComputed(callback) {
	let property = computed(callback);
	property.enumerable = false;
	return property;
}
function mapBy(key) {
	return this.map((next) => get(next, key));
}
/**
This mixin implements Observer-friendly Array-like behavior. It is not a
concrete implementation, but it can be used up by other classes that want
to appear like arrays.

For example, ArrayProxy is a concrete class that can be instantiated to
implement array-like behavior. This class uses the Array Mixin by way of
the MutableArray mixin, which allows observable changes to be made to the
underlying array.

This mixin defines methods specifically for collections that provide
index-ordered access to their contents. When you are designing code that
needs to accept any kind of Array-like object, you should use these methods
instead of Array primitives because these will properly notify observers of
changes to the array.

Although these methods are efficient, they do add a layer of indirection to
your application so it is a good idea to use them only when you need the
flexibility of using both true JavaScript arrays and "virtual" arrays such
as controllers and collections.

You can use the methods defined in this module to access and modify array
contents in an observable-friendly way. You can also be notified whenever
the membership of an array changes by using `.observes('myArray.[]')`.

To support `EmberArray` in your own class, you must override two
primitives to use it: `length()` and `objectAt()`.

@class EmberArray
@uses Enumerable
@since Ember 0.9.0
@public
*/
var EmberArray = Mixin.create(Enumerable, {
	init() {
		this._super(...arguments);
		setEmberArray(this);
	},
	objectsAt(indexes) {
		return indexes.map((idx) => objectAt(this, idx));
	},
	"[]": nonEnumerableComputed({
		get() {
			return this;
		},
		set(_key, value) {
			this.replace(0, this.length, value);
			return this;
		}
	}),
	firstObject: nonEnumerableComputed(function() {
		return objectAt(this, 0);
	}).readOnly(),
	lastObject: nonEnumerableComputed(function() {
		return objectAt(this, this.length - 1);
	}).readOnly(),
	slice(beginIndex = 0, endIndex) {
		let ret = A();
		let length = this.length;
		if (beginIndex < 0) beginIndex = length + beginIndex;
		let validatedEndIndex;
		if (endIndex === void 0 || endIndex > length) validatedEndIndex = length;
		else if (endIndex < 0) validatedEndIndex = length + endIndex;
		else validatedEndIndex = endIndex;
		while (beginIndex < validatedEndIndex) ret[ret.length] = objectAt(this, beginIndex++);
		return ret;
	},
	indexOf(object, startAt) {
		return indexOf(this, object, startAt, false);
	},
	lastIndexOf(object, startAt) {
		let len = this.length;
		if (startAt === void 0 || startAt >= len) startAt = len - 1;
		if (startAt < 0) startAt += len;
		for (let idx = startAt; idx >= 0; idx--) if (objectAt(this, idx) === object) return idx;
		return -1;
	},
	forEach(callback, target = null) {
		let length = this.length;
		for (let index = 0; index < length; index++) {
			let item = this.objectAt(index);
			callback.call(target, item, index, this);
		}
		return this;
	},
	getEach: mapBy,
	setEach(key, value) {
		return this.forEach((item) => set(item, key, value));
	},
	map(callback, target = null) {
		let ret = A();
		this.forEach((x, idx, i) => ret[idx] = callback.call(target, x, idx, i));
		return ret;
	},
	mapBy,
	filter(callback, target = null) {
		let ret = A();
		this.forEach((x, idx, i) => {
			if (callback.call(target, x, idx, i)) ret.push(x);
		});
		return ret;
	},
	reject(callback, target = null) {
		return this.filter(function() {
			return !callback.apply(target, arguments);
		});
	},
	filterBy() {
		return this.filter(iter(...arguments));
	},
	rejectBy() {
		return this.reject(iter(...arguments));
	},
	find(callback, target = null) {
		return find(this, callback, target);
	},
	findBy() {
		let callback = iter(...arguments);
		return find(this, callback);
	},
	every(callback, target = null) {
		return every(this, callback, target);
	},
	isEvery() {
		let callback = iter(...arguments);
		return every(this, callback);
	},
	any(callback, target = null) {
		return any(this, callback, target);
	},
	isAny() {
		let callback = iter(...arguments);
		return any(this, callback);
	},
	reduce(callback, initialValue) {
		let hasInitialValue = arguments.length > 1;
		let ret = initialValue;
		let startIndex = 0;
		if (!hasInitialValue) {
			if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
			ret = this.objectAt(0);
			startIndex = 1;
		}
		for (let i = startIndex; i < this.length; i++) {
			let item = this.objectAt(i);
			ret = callback(ret, item, i, this);
		}
		return ret;
	},
	invoke(methodName, ...args) {
		let ret = A();
		this.forEach((item) => ret.push(item[methodName]?.(...args)));
		return ret;
	},
	toArray() {
		return this.map((item) => item);
	},
	compact() {
		return this.filter((value) => value != null);
	},
	includes(object, startAt) {
		return indexOf(this, object, startAt, true) !== -1;
	},
	sortBy() {
		let sortKeys = arguments;
		return this.toArray().sort((a, b) => {
			for (let i = 0; i < sortKeys.length; i++) {
				let key = sortKeys[i];
				let propA = get(a, key);
				let propB = get(b, key);
				let compareValue = compare(propA, propB);
				if (compareValue) return compareValue;
			}
			return 0;
		});
	},
	uniq() {
		return uniqBy(this);
	},
	uniqBy(key) {
		return uniqBy(this, key);
	},
	without(value) {
		if (!this.includes(value)) return this;
		let predicate = value === value ? (item) => item !== value : (item) => item === item;
		return this.filter(predicate);
	}
});
/**
This mixin defines the API for modifying array-like objects. These methods
can be applied only to a collection that keeps its items in an ordered set.
It builds upon the Array mixin and adds methods to modify the array.
One concrete implementations of this class include ArrayProxy.

It is important to use the methods in this class to modify arrays so that
changes are observable. This allows the binding system in Ember to function
correctly.


Note that an Array can change even if it does not implement this mixin.
For example, one might implement a SparseArray that cannot be directly
modified, but if its underlying enumerable changes, it will change also.

@class MutableArray
@uses EmberArray
@uses MutableEnumerable
@public
*/
var MutableArray = Mixin.create(EmberArray, MutableEnumerable, {
	clear() {
		let len = this.length;
		if (len === 0) return this;
		this.replace(0, len, EMPTY_ARRAY);
		return this;
	},
	insertAt(idx, object) {
		insertAt(this, idx, object);
		return this;
	},
	removeAt(start, len) {
		return removeAt(this, start, len);
	},
	pushObject(obj) {
		return insertAt(this, this.length, obj);
	},
	pushObjects(objects) {
		this.replace(this.length, 0, objects);
		return this;
	},
	popObject() {
		let len = this.length;
		if (len === 0) return null;
		let ret = objectAt(this, len - 1);
		this.removeAt(len - 1, 1);
		return ret;
	},
	shiftObject() {
		if (this.length === 0) return null;
		let ret = objectAt(this, 0);
		this.removeAt(0);
		return ret;
	},
	unshiftObject(obj) {
		return insertAt(this, 0, obj);
	},
	unshiftObjects(objects) {
		this.replace(0, 0, objects);
		return this;
	},
	reverseObjects() {
		let len = this.length;
		if (len === 0) return this;
		let objects = this.toArray().reverse();
		this.replace(0, len, objects);
		return this;
	},
	setObjects(objects) {
		if (objects.length === 0) return this.clear();
		let len = this.length;
		this.replace(0, len, objects);
		return this;
	},
	removeObject(obj) {
		let loc = this.length || 0;
		while (--loc >= 0) if (objectAt(this, loc) === obj) this.removeAt(loc);
		return this;
	},
	removeObjects(objects) {
		beginPropertyChanges();
		for (let i = objects.length - 1; i >= 0; i--) this.removeObject(objects[i]);
		endPropertyChanges();
		return this;
	},
	addObject(obj) {
		if (!this.includes(obj)) this.pushObject(obj);
		return this;
	},
	addObjects(objects) {
		beginPropertyChanges();
		objects.forEach((obj) => this.addObject(obj));
		endPropertyChanges();
		return this;
	}
});
/**
Creates an `NativeArray` from an Array-like object.
Does not modify the original object's contents.

This exists primarily for historic reasons and should not be used
in new code. Prefer native [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
or [trackedArray](/ember/release/functions/@ember%2Freactive%2Fcollections/trackedArray).

Example

```app/components/my-component.js
import Component from '@ember/component';
import { A } from '@ember/array';

export default Component.extend({
tagName: 'ul',
classNames: ['pagination'],

init() {
this._super(...arguments);

if (!this.get('content')) {
this.set('content', A());
this.set('otherContent', A([1,2,3]));
}
}
});
```

@method A
@static
@for @ember/array
@return {Ember.NativeArray}
@public
*/
/**
@module ember
*/
/**
* The final definition of NativeArray removes all native methods. This is the list of removed methods
* when run in Chrome 106.
*/
/**
* These additional items must be redefined since `Omit` causes methods that return `this` to return the
* type at the time of the Omit.
*/
/**
The NativeArray mixin contains the properties needed to make the native
Array support MutableArray and all of its dependent APIs.

@class Ember.NativeArray
@uses MutableArray
@uses Observable
@public
*/
var NativeArray = Mixin.create(MutableArray, Observable, {
	objectAt(idx) {
		return this[idx];
	},
	replace(start, deleteCount, items = EMPTY_ARRAY) {
		replaceInNativeArray(this, start, deleteCount, items);
		return this;
	}
});
var ignore = ["length"];
NativeArray.keys().forEach((methodName) => {
	if (Array.prototype[methodName]) ignore.push(methodName);
});
NativeArray = NativeArray.without(...ignore);
var A = function(arr) {
	if (isEmberArray(arr)) return arr;
	else return NativeArray.apply(arr ?? []);
};
//#endregion
export { array_exports as a, MutableEnumerable as c, arrayContentDidChange as d, arrayContentWillChange as f, replaceInNativeArray as h, NativeArray as i, mutable_exports as l, replace as m, EmberArray as n, removeAt as o, removeArrayObserver as p, MutableArray as r, uniqBy as s, A as t, addArrayObserver as u };
