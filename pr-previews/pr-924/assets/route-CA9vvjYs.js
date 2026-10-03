import { t as getOwner } from "./owner-Bxxa-eff.js";
import { J as makeDictionary, K as isProxy, M as computed, P as defineProperty, T as Container, U as get, w as intern } from "./core-D-L0f59Y.js";
import { a as flushAsyncObservers, i as addObserver } from "./observers-BmobpXAF-CkVUhhE-.js";
import { h as once } from "./runloop-Dk0Nzu3h.js";
import { i as lookupDescriptor, n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { i as descriptorForProperty } from "./decorator-9ikVwsjY-DzA4qI2N.js";
import { t as ActionHandler } from "./action_handler-nAULtqaN.js";
import { i as getProperties, r as setProperties } from "./observable-BDMGT456.js";
import { t as EmberObject } from "./object-X4rDdm09.js";
import { t as Evented } from "./evented-Cnj-zNta.js";
import { t as A } from "./array-CAt176If.js";
import { t as typeOf } from "./type-of-ClAdfYwH.js";
import { t as isTesting } from "./testing-Chw1oEEI.js";
import { t as dependentKeyCompat } from "./compat-dvnXU3Aj.js";
import { o as hasInternalComponentManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { n as decorateMethodV2 } from "./runtime-CYyqkz5q-BOdRhmsS-CexCIt7z.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/rsvp-aLN_pQtn.js
function callbacksFor(object) {
	let callbacks = object._promiseCallbacks;
	if (!callbacks) callbacks = object._promiseCallbacks = {};
	return callbacks;
}
/**
@class EventTarget
@for rsvp
@public
*/
var EventTarget = {
	/**
	`EventTarget.mixin` extends an object with EventTarget methods. For
	Example:
	```javascript
	import EventTarget from 'rsvp';
	let object = {};
	EventTarget.mixin(object);
	object.on('finished', function(event) {
	// handle event
	});
	object.trigger('finished', { detail: value });
	```
	`EventTarget.mixin` also works with prototypes:
	```javascript
	import EventTarget from 'rsvp';
	let Person = function() {};
	EventTarget.mixin(Person.prototype);
	let yehuda = new Person();
	let tom = new Person();
	yehuda.on('poke', function(event) {
	console.log('Yehuda says OW');
	});
	tom.on('poke', function(event) {
	console.log('Tom says OW');
	});
	yehuda.trigger('poke');
	tom.trigger('poke');
	```
	@method mixin
	@for rsvp
	@private
	@param {Object} object object to extend with EventTarget methods
	*/
	mixin(object) {
		object.on = this.on;
		object.off = this.off;
		object.trigger = this.trigger;
		object._promiseCallbacks = void 0;
		return object;
	},
	/**
	Registers a callback to be executed when `eventName` is triggered
	```javascript
	object.on('event', function(eventInfo){
	// handle the event
	});
	object.trigger('event');
	```
	@method on
	@for EventTarget
	@private
	@param {String} eventName name of the event to listen for
	@param {Function} callback function to be called when the event is triggered.
	*/
	on(eventName, callback) {
		if (typeof callback !== "function") throw new TypeError("Callback must be a function");
		let allCallbacks = callbacksFor(this);
		let callbacks = allCallbacks[eventName];
		if (!callbacks) callbacks = allCallbacks[eventName] = [];
		if (callbacks.indexOf(callback) === -1) callbacks.push(callback);
	},
	/**
	You can use `off` to stop firing a particular callback for an event:
	```javascript
	function doStuff() { // do stuff! }
	object.on('stuff', doStuff);
	object.trigger('stuff'); // doStuff will be called
	// Unregister ONLY the doStuff callback
	object.off('stuff', doStuff);
	object.trigger('stuff'); // doStuff will NOT be called
	```
	If you don't pass a `callback` argument to `off`, ALL callbacks for the
	event will not be executed when the event fires. For example:
	```javascript
	let callback1 = function(){};
	let callback2 = function(){};
	object.on('stuff', callback1);
	object.on('stuff', callback2);
	object.trigger('stuff'); // callback1 and callback2 will be executed.
	object.off('stuff');
	object.trigger('stuff'); // callback1 and callback2 will not be executed!
	```
	@method off
	@for rsvp
	@private
	@param {String} eventName event to stop listening to
	@param {Function} [callback] optional argument. If given, only the function
	given will be removed from the event's callback queue. If no `callback`
	argument is given, all callbacks will be removed from the event's callback
	queue.
	*/
	off(eventName, callback) {
		let allCallbacks = callbacksFor(this);
		if (!callback) {
			allCallbacks[eventName] = [];
			return;
		}
		let callbacks = allCallbacks[eventName];
		let index = callbacks.indexOf(callback);
		if (index !== -1) callbacks.splice(index, 1);
	},
	/**
	Use `trigger` to fire custom events. For example:
	```javascript
	object.on('foo', function(){
	console.log('foo event happened!');
	});
	object.trigger('foo');
	// 'foo event happened!' logged to the console
	```
	You can also pass a value as a second argument to `trigger` that will be
	passed as an argument to all event listeners for the event:
	```javascript
	object.on('foo', function(value){
	console.log(value.name);
	});
	object.trigger('foo', { name: 'bar' });
	// 'bar' logged to the console
	```
	@method trigger
	@for rsvp
	@private
	@param {String} eventName name of the event to be triggered
	@param {*} [options] optional value to be passed to any event handlers for
	the given `eventName`
	*/
	trigger(eventName, options, label) {
		let callbacks = callbacksFor(this)[eventName];
		if (callbacks) {
			let callback;
			for (let i = 0; i < callbacks.length; i++) {
				callback = callbacks[i];
				callback(options, label);
			}
		}
	}
};
var config = { instrument: false };
EventTarget["mixin"](config);
function configure(name, value) {
	if (arguments.length === 2) config[name] = value;
	else return config[name];
}
var queue$1 = [];
function scheduleFlush$1() {
	setTimeout(() => {
		for (let i = 0; i < queue$1.length; i++) {
			let entry = queue$1[i];
			let payload = entry.payload;
			payload.guid = payload.key + payload.id;
			payload.childGuid = payload.key + payload.childId;
			if (payload.error) payload.stack = payload.error.stack;
			config["trigger"](entry.name, entry.payload);
		}
		queue$1.length = 0;
	}, 50);
}
function instrument(eventName, promise, child) {
	if (1 === queue$1.push({
		name: eventName,
		payload: {
			key: promise._guidKey,
			id: promise._id,
			eventName,
			detail: promise._result,
			childId: child && child._id,
			label: promise._label,
			timeStamp: Date.now(),
			error: config["instrument-with-stack"] ? new Error(promise._label) : null
		}
	})) scheduleFlush$1();
}
/**
`Promise.resolve` returns a promise that will become resolved with the
passed `value`. It is shorthand for the following:

```javascript
import Promise from 'rsvp';

let promise = new Promise(function(resolve, reject){
resolve(1);
});

promise.then(function(value){
// value === 1
});
```

Instead of writing the above, your code now simply becomes the following:

```javascript
import Promise from 'rsvp';

let promise = RSVP.Promise.resolve(1);

promise.then(function(value){
// value === 1
});
```

@method resolve
@for Promise
@static
@param {*} object value that the returned promise will be resolved with
@param {String} [label] optional string for identifying the returned promise.
Useful for tooling.
@return {Promise} a promise that will become fulfilled with the given
`value`
*/
function resolve$2(object, label) {
	let Constructor = this;
	if (object && typeof object === "object" && object.constructor === Constructor) return object;
	let promise = new Constructor(noop, label);
	resolve$1(promise, object);
	return promise;
}
function withOwnPromise() {
	return /* @__PURE__ */ new TypeError("A promises callback cannot return that same promise.");
}
function objectOrFunction(x) {
	let type = typeof x;
	return x !== null && (type === "object" || type === "function");
}
function noop() {}
var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;
function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	try {
		then.call(value, fulfillmentHandler, rejectionHandler);
	} catch (e) {
		return e;
	}
}
function handleForeignThenable(promise, thenable, then) {
	config.async((promise) => {
		let sealed = false;
		let error = tryThen(then, thenable, (value) => {
			if (sealed) return;
			sealed = true;
			if (thenable === value) fulfill(promise, value);
			else resolve$1(promise, value);
		}, (reason) => {
			if (sealed) return;
			sealed = true;
			reject$2(promise, reason);
		}, "Settle: " + (promise._label || " unknown promise"));
		if (!sealed && error) {
			sealed = true;
			reject$2(promise, error);
		}
	}, promise);
}
function handleOwnThenable(promise, thenable) {
	if (thenable._state === FULFILLED) fulfill(promise, thenable._result);
	else if (thenable._state === REJECTED) {
		thenable._onError = null;
		reject$2(promise, thenable._result);
	} else subscribe(thenable, void 0, (value) => {
		if (thenable === value) fulfill(promise, value);
		else resolve$1(promise, value);
	}, (reason) => reject$2(promise, reason));
}
function handleMaybeThenable(promise, maybeThenable, then$1) {
	if (maybeThenable.constructor === promise.constructor && then$1 === then && promise.constructor.resolve === resolve$2) handleOwnThenable(promise, maybeThenable);
	else if (typeof then$1 === "function") handleForeignThenable(promise, maybeThenable, then$1);
	else fulfill(promise, maybeThenable);
}
function resolve$1(promise, value) {
	if (promise === value) fulfill(promise, value);
	else if (objectOrFunction(value)) {
		let then;
		try {
			then = value.then;
		} catch (error) {
			reject$2(promise, error);
			return;
		}
		handleMaybeThenable(promise, value, then);
	} else fulfill(promise, value);
}
function publishRejection(promise) {
	if (promise._onError) promise._onError(promise._result);
	publish(promise);
}
function fulfill(promise, value) {
	if (promise._state !== PENDING) return;
	promise._result = value;
	promise._state = FULFILLED;
	if (promise._subscribers.length === 0) {
		if (config.instrument) instrument("fulfilled", promise);
	} else config.async(publish, promise);
}
function reject$2(promise, reason) {
	if (promise._state !== PENDING) return;
	promise._state = REJECTED;
	promise._result = reason;
	config.async(publishRejection, promise);
}
function subscribe(parent, child, onFulfillment, onRejection) {
	let subscribers = parent._subscribers;
	let length = subscribers.length;
	parent._onError = null;
	subscribers[length] = child;
	subscribers[length + FULFILLED] = onFulfillment;
	subscribers[length + REJECTED] = onRejection;
	if (length === 0 && parent._state) config.async(publish, parent);
}
function publish(promise) {
	let subscribers = promise._subscribers;
	let settled = promise._state;
	if (config.instrument) instrument(settled === FULFILLED ? "fulfilled" : "rejected", promise);
	if (subscribers.length === 0) return;
	let child, callback, result = promise._result;
	for (let i = 0; i < subscribers.length; i += 3) {
		child = subscribers[i];
		callback = subscribers[i + settled];
		if (child) invokeCallback(settled, child, callback, result);
		else callback(result);
	}
	promise._subscribers.length = 0;
}
function invokeCallback(state, promise, callback, result) {
	let hasCallback = typeof callback === "function";
	let value, succeeded = true, error;
	if (hasCallback) try {
		value = callback(result);
	} catch (e) {
		succeeded = false;
		error = e;
	}
	else value = result;
	if (promise._state !== PENDING);
	else if (value === promise) reject$2(promise, withOwnPromise());
	else if (succeeded === false) reject$2(promise, error);
	else if (hasCallback) resolve$1(promise, value);
	else if (state === FULFILLED) fulfill(promise, value);
	else if (state === REJECTED) reject$2(promise, value);
}
function initializePromise(promise, resolver) {
	let resolved = false;
	try {
		resolver((value) => {
			if (resolved) return;
			resolved = true;
			resolve$1(promise, value);
		}, (reason) => {
			if (resolved) return;
			resolved = true;
			reject$2(promise, reason);
		});
	} catch (e) {
		reject$2(promise, e);
	}
}
function then(onFulfillment, onRejection, label) {
	let parent = this;
	let state = parent._state;
	if (state === FULFILLED && !onFulfillment || state === REJECTED && !onRejection) {
		config.instrument && instrument("chained", parent, parent);
		return parent;
	}
	parent._onError = null;
	let child = new parent.constructor(noop, label);
	let result = parent._result;
	config.instrument && instrument("chained", parent, child);
	if (state === PENDING) subscribe(parent, child, onFulfillment, onRejection);
	else {
		let callback = state === FULFILLED ? onFulfillment : onRejection;
		config.async(() => invokeCallback(state, child, callback, result));
	}
	return child;
}
var Enumerator = class {
	constructor(Constructor, input, abortOnReject, label) {
		this._instanceConstructor = Constructor;
		this.promise = new Constructor(noop, label);
		this._abortOnReject = abortOnReject;
		this._isUsingOwnPromise = Constructor === Promise$1;
		this._isUsingOwnResolve = Constructor.resolve === resolve$2;
		this._init(...arguments);
	}
	_init(Constructor, input) {
		let len = input.length || 0;
		this.length = len;
		this._remaining = len;
		this._result = new Array(len);
		this._enumerate(input);
	}
	_enumerate(input) {
		let length = this.length;
		let promise = this.promise;
		for (let i = 0; promise._state === PENDING && i < length; i++) this._eachEntry(input[i], i, true);
		this._checkFullfillment();
	}
	_checkFullfillment() {
		if (this._remaining === 0) {
			let result = this._result;
			fulfill(this.promise, result);
			this._result = null;
		}
	}
	_settleMaybeThenable(entry, i, firstPass) {
		let c = this._instanceConstructor;
		if (this._isUsingOwnResolve) {
			let then$1, error, succeeded = true;
			try {
				then$1 = entry.then;
			} catch (e) {
				succeeded = false;
				error = e;
			}
			if (then$1 === then && entry._state !== PENDING) {
				entry._onError = null;
				this._settledAt(entry._state, i, entry._result, firstPass);
			} else if (typeof then$1 !== "function") this._settledAt(FULFILLED, i, entry, firstPass);
			else if (this._isUsingOwnPromise) {
				let promise = new c(noop);
				if (succeeded === false) reject$2(promise, error);
				else {
					handleMaybeThenable(promise, entry, then$1);
					this._willSettleAt(promise, i, firstPass);
				}
			} else this._willSettleAt(new c((resolve) => resolve(entry)), i, firstPass);
		} else this._willSettleAt(c.resolve(entry), i, firstPass);
	}
	_eachEntry(entry, i, firstPass) {
		if (entry !== null && typeof entry === "object") this._settleMaybeThenable(entry, i, firstPass);
		else this._setResultAt(FULFILLED, i, entry, firstPass);
	}
	_settledAt(state, i, value, firstPass) {
		let promise = this.promise;
		if (promise._state === PENDING) {
			if (this._abortOnReject && state === REJECTED) reject$2(promise, value);
			else {
				this._setResultAt(state, i, value, firstPass);
				this._checkFullfillment();
			}
		}
	}
	_setResultAt(state, i, value, firstPass) {
		this._remaining--;
		this._result[i] = value;
	}
	_willSettleAt(promise, i, firstPass) {
		subscribe(promise, void 0, (value) => this._settledAt(FULFILLED, i, value, firstPass), (reason) => this._settledAt(REJECTED, i, reason, firstPass));
	}
};
function setSettledResult(state, i, value) {
	this._remaining--;
	if (state === FULFILLED) this._result[i] = {
		state: "fulfilled",
		value
	};
	else this._result[i] = {
		state: "rejected",
		reason: value
	};
}
/**
`Promise.all` accepts an array of promises, and returns a new promise which
is fulfilled with an array of fulfillment values for the passed promises, or
rejected with the reason of the first passed promise to be rejected. It casts all
elements of the passed iterable to promises as it runs this algorithm.

Example:

```javascript
import Promise, { resolve } from 'rsvp';

let promise1 = resolve(1);
let promise2 = resolve(2);
let promise3 = resolve(3);
let promises = [ promise1, promise2, promise3 ];

Promise.all(promises).then(function(array){
// The array here would be [ 1, 2, 3 ];
});
```

If any of the `promises` given to `RSVP.all` are rejected, the first promise
that is rejected will be given as an argument to the returned promises's
rejection handler. For example:

Example:

```javascript
import Promise, { resolve, reject } from 'rsvp';

let promise1 = resolve(1);
let promise2 = reject(new Error("2"));
let promise3 = reject(new Error("3"));
let promises = [ promise1, promise2, promise3 ];

Promise.all(promises).then(function(array){
// Code here never runs because there are rejected promises!
}, function(error) {
// error.message === "2"
});
```

@method all
@for Promise
@param {Array} entries array of promises
@param {String} [label] optional string for labeling the promise.
Useful for tooling.
@return {Promise} promise that is fulfilled when all `promises` have been
fulfilled, or rejected if any of them become rejected.
@static
*/
function all$1(entries, label) {
	if (!Array.isArray(entries)) return this.reject(/* @__PURE__ */ new TypeError("Promise.all must be called with an array"), label);
	return new Enumerator(this, entries, true, label).promise;
}
/**
`Promise.race` returns a new promise which is settled in the same way as the
first passed promise to settle.

Example:

```javascript
import Promise from 'rsvp';

let promise1 = new Promise(function(resolve, reject){
setTimeout(function(){
resolve('promise 1');
}, 200);
});

let promise2 = new Promise(function(resolve, reject){
setTimeout(function(){
resolve('promise 2');
}, 100);
});

Promise.race([promise1, promise2]).then(function(result){
// result === 'promise 2' because it was resolved before promise1
// was resolved.
});
```

`Promise.race` is deterministic in that only the state of the first
settled promise matters. For example, even if other promises given to the
`promises` array argument are resolved, but the first settled promise has
become rejected before the other promises became fulfilled, the returned
promise will become rejected:

```javascript
import Promise from 'rsvp';

let promise1 = new Promise(function(resolve, reject){
setTimeout(function(){
resolve('promise 1');
}, 200);
});

let promise2 = new Promise(function(resolve, reject){
setTimeout(function(){
reject(new Error('promise 2'));
}, 100);
});

Promise.race([promise1, promise2]).then(function(result){
// Code here never runs
}, function(reason){
// reason.message === 'promise 2' because promise 2 became rejected before
// promise 1 became fulfilled
});
```

An example real-world use case is implementing timeouts:

```javascript
import Promise from 'rsvp';

Promise.race([ajax('foo.json'), timeout(5000)])
```

@method race
@for Promise
@static
@param {Array} entries array of promises to observe
@param {String} [label] optional string for describing the promise returned.
Useful for tooling.
@return {Promise} a promise which settles in the same way as the first passed
promise to settle.
*/
function race$1(entries, label) {
	let Constructor = this;
	let promise = new Constructor(noop, label);
	if (!Array.isArray(entries)) {
		reject$2(promise, /* @__PURE__ */ new TypeError("Promise.race must be called with an array"));
		return promise;
	}
	for (let i = 0; promise._state === PENDING && i < entries.length; i++) subscribe(Constructor.resolve(entries[i]), void 0, (value) => resolve$1(promise, value), (reason) => reject$2(promise, reason));
	return promise;
}
/**
`Promise.reject` returns a promise rejected with the passed `reason`.
It is shorthand for the following:

```javascript
import Promise from 'rsvp';

let promise = new Promise(function(resolve, reject){
reject(new Error('WHOOPS'));
});

promise.then(function(value){
// Code here doesn't run because the promise is rejected!
}, function(reason){
// reason.message === 'WHOOPS'
});
```

Instead of writing the above, your code now simply becomes the following:

```javascript
import Promise from 'rsvp';

let promise = Promise.reject(new Error('WHOOPS'));

promise.then(function(value){
// Code here doesn't run because the promise is rejected!
}, function(reason){
// reason.message === 'WHOOPS'
});
```

@method reject
@for Promise
@static
@param {*} reason value that the returned promise will be rejected with.
@param {String} [label] optional string for identifying the returned promise.
Useful for tooling.
@return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason, label) {
	let promise = new this(noop, label);
	reject$2(promise, reason);
	return promise;
}
var guidKey = "rsvp_" + Date.now() + "-";
var counter = 0;
function needsResolver() {
	throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
}
function needsNew() {
	throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}
/**
Promise objects represent the eventual result of an asynchronous operation. The
primary way of interacting with a promise is through its `then` method, which
registers callbacks to receive either a promise’s eventual value or the reason
why the promise cannot be fulfilled.

Terminology
-----------

- `promise` is an object or function with a `then` method whose behavior conforms to this specification.
- `thenable` is an object or function that defines a `then` method.
- `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
- `exception` is a value that is thrown using the throw statement.
- `reason` is a value that indicates why a promise was rejected.
- `settled` the final resting state of a promise, fulfilled or rejected.

A promise can be in one of three states: pending, fulfilled, or rejected.

Promises that are fulfilled have a fulfillment value and are in the fulfilled
state.  Promises that are rejected have a rejection reason and are in the
rejected state.  A fulfillment value is never a thenable.

Promises can also be said to *resolve* a value.  If this value is also a
promise, then the original promise's settled state will match the value's
settled state.  So a promise that *resolves* a promise that rejects will
itself reject, and a promise that *resolves* a promise that fulfills will
itself fulfill.


Basic Usage:
------------

```js
let promise = new Promise(function(resolve, reject) {
// on success
resolve(value);

// on failure
reject(reason);
});

promise.then(function(value) {
// on fulfillment
}, function(reason) {
// on rejection
});
```

Advanced Usage:
---------------

Promises shine when abstracting away asynchronous interactions such as
`XMLHttpRequest`s.

```js
function getJSON(url) {
return new Promise(function(resolve, reject){
let xhr = new XMLHttpRequest();

xhr.open('GET', url);
xhr.onreadystatechange = handler;
xhr.responseType = 'json';
xhr.setRequestHeader('Accept', 'application/json');
xhr.send();

function handler() {
if (this.readyState === this.DONE) {
if (this.status === 200) {
resolve(this.response);
} else {
reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
}
}
};
});
}

getJSON('/posts.json').then(function(json) {
// on fulfillment
}, function(reason) {
// on rejection
});
```

Unlike callbacks, promises are great composable primitives.

```js
Promise.all([
getJSON('/posts'),
getJSON('/comments')
]).then(function(values){
values[0] // => postsJSON
values[1] // => commentsJSON

return values;
});
```

@class Promise
@public
@param {function} resolver
@param {String} [label] optional string for labeling the promise.
Useful for tooling.
@constructor
*/
var Promise$1 = class Promise {
	constructor(resolver, label) {
		this._id = counter++;
		this._label = label;
		this._state = void 0;
		this._result = void 0;
		this._subscribers = [];
		config.instrument && instrument("created", this);
		if (noop !== resolver) {
			typeof resolver !== "function" && needsResolver();
			this instanceof Promise ? initializePromise(this, resolver) : needsNew();
		}
	}
	_onError(reason) {
		config.after(() => {
			if (this._onError) config.trigger("error", reason, this._label);
		});
	}
	/**
	`catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	as the catch block of a try/catch statement.
	
	```js
	function findAuthor(){
	throw new Error('couldn\'t find that author');
	}
	
	// synchronous
	try {
	findAuthor();
	} catch(reason) {
	// something went wrong
	}
	
	// async with promises
	findAuthor().catch(function(reason){
	// something went wrong
	});
	```
	
	@method catch
	@param {Function} onRejection
	@param {String} [label] optional string for labeling the promise.
	Useful for tooling.
	@return {Promise}
	*/
	catch(onRejection, label) {
		return this.then(void 0, onRejection, label);
	}
	/**
	`finally` will be invoked regardless of the promise's fate just as native
	try/catch/finally behaves
	
	Synchronous example:
	
	```js
	findAuthor() {
	if (Math.random() > 0.5) {
	throw new Error();
	}
	return new Author();
	}
	
	try {
	return findAuthor(); // succeed or fail
	} catch(error) {
	return findOtherAuthor();
	} finally {
	// always runs
	// doesn't affect the return value
	}
	```
	
	Asynchronous example:
	
	```js
	findAuthor().catch(function(reason){
	return findOtherAuthor();
	}).finally(function(){
	// author was either found, or not
	});
	```
	
	@method finally
	@param {Function} callback
	@param {String} [label] optional string for labeling the promise.
	Useful for tooling.
	@return {Promise}
	*/
	finally(callback, label) {
		let promise = this;
		let constructor = promise.constructor;
		if (typeof callback === "function") return promise.then((value) => constructor.resolve(callback()).then(() => value), (reason) => constructor.resolve(callback()).then(() => {
			throw reason;
		}));
		return promise.then(callback, callback);
	}
};
Promise$1.cast = resolve$2;
Promise$1.all = all$1;
Promise$1.race = race$1;
Promise$1.resolve = resolve$2;
Promise$1.reject = reject$1;
Promise$1.prototype._guidKey = guidKey;
/**
The primary way of interacting with a promise is through its `then` method,
which registers callbacks to receive either a promise's eventual value or the
reason why the promise cannot be fulfilled.

```js
findUser().then(function(user){
// user is available
}, function(reason){
// user is unavailable, and you are given the reason why
});
```

Chaining
--------

The return value of `then` is itself a promise.  This second, 'downstream'
promise is resolved with the return value of the first promise's fulfillment
or rejection handler, or rejected if the handler throws an exception.

```js
findUser().then(function (user) {
return user.name;
}, function (reason) {
return 'default name';
}).then(function (userName) {
// If `findUser` fulfilled, `userName` will be the user's name, otherwise it
// will be `'default name'`
});

findUser().then(function (user) {
throw new Error('Found user, but still unhappy');
}, function (reason) {
throw new Error('`findUser` rejected and we\'re unhappy');
}).then(function (value) {
// never reached
}, function (reason) {
// if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
// If `findUser` rejected, `reason` will be '`findUser` rejected and we\'re unhappy'.
});
```
If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

```js
findUser().then(function (user) {
throw new PedagogicalException('Upstream error');
}).then(function (value) {
// never reached
}).then(function (value) {
// never reached
}, function (reason) {
// The `PedgagocialException` is propagated all the way down to here
});
```

Assimilation
------------

Sometimes the value you want to propagate to a downstream promise can only be
retrieved asynchronously. This can be achieved by returning a promise in the
fulfillment or rejection handler. The downstream promise will then be pending
until the returned promise is settled. This is called *assimilation*.

```js
findUser().then(function (user) {
return findCommentsByAuthor(user);
}).then(function (comments) {
// The user's comments are now available
});
```

If the assimliated promise rejects, then the downstream promise will also reject.

```js
findUser().then(function (user) {
return findCommentsByAuthor(user);
}).then(function (comments) {
// If `findCommentsByAuthor` fulfills, we'll have the value here
}, function (reason) {
// If `findCommentsByAuthor` rejects, we'll have the reason here
});
```

Simple Example
--------------

Synchronous Example

```javascript
let result;

try {
result = findResult();
// success
} catch(reason) {
// failure
}
```

Errback Example

```js
findResult(function(result, err){
if (err) {
// failure
} else {
// success
}
});
```

Promise Example;

```javascript
findResult().then(function(result){
// success
}, function(reason){
// failure
});
```

Advanced Example
--------------

Synchronous Example

```javascript
let author, books;

try {
author = findAuthor();
books  = findBooksByAuthor(author);
// success
} catch(reason) {
// failure
}
```

Errback Example

```js

function foundBooks(books) {

}

function failure(reason) {

}

findAuthor(function(author, err){
if (err) {
failure(err);
// failure
} else {
try {
findBoooksByAuthor(author, function(books, err) {
if (err) {
failure(err);
} else {
try {
foundBooks(books);
} catch(reason) {
failure(reason);
}
}
});
} catch(error) {
failure(err);
}
// success
}
});
```

Promise Example;

```javascript
findAuthor().
then(findBooksByAuthor).
then(function(books){
// found books
}).catch(function(reason){
// something went wrong
});
```

@method then
@param {Function} onFulfillment
@param {Function} onRejection
@param {String} [label] optional string for labeling the promise.
Useful for tooling.
@return {Promise}
*/
Promise$1.prototype.then = then;
function makeObject(_, argumentNames) {
	let obj = {};
	let length = _.length;
	let args = new Array(length);
	for (let x = 0; x < length; x++) args[x] = _[x];
	for (let i = 0; i < argumentNames.length; i++) {
		let name = argumentNames[i];
		obj[name] = args[i + 1];
	}
	return obj;
}
function arrayResult(_) {
	let length = _.length;
	let args = new Array(length - 1);
	for (let i = 1; i < length; i++) args[i - 1] = _[i];
	return args;
}
function wrapThenable(then, promise) {
	return { then(onFulFillment, onRejection) {
		return then.call(promise, onFulFillment, onRejection);
	} };
}
/**
`denodeify` takes a 'node-style' function and returns a function that
will return an `Promise`. You can use `denodeify` in Node.js or the
browser when you'd prefer to use promises over using callbacks. For example,
`denodeify` transforms the following:

```javascript
let fs = require('fs');

fs.readFile('myfile.txt', function(err, data){
if (err) return handleError(err);
handleData(data);
});
```

into:

```javascript
let fs = require('fs');
let readFile = denodeify(fs.readFile);

readFile('myfile.txt').then(handleData, handleError);
```

If the node function has multiple success parameters, then `denodeify`
just returns the first one:

```javascript
let request = denodeify(require('request'));

request('http://example.com').then(function(res) {
// ...
});
```

However, if you need all success parameters, setting `denodeify`'s
second parameter to `true` causes it to return all success parameters
as an array:

```javascript
let request = denodeify(require('request'), true);

request('http://example.com').then(function(result) {
// result[0] -> res
// result[1] -> body
});
```

Or if you pass it an array with names it returns the parameters as a hash:

```javascript
let request = denodeify(require('request'), ['res', 'body']);

request('http://example.com').then(function(result) {
// result.res
// result.body
});
```

Sometimes you need to retain the `this`:

```javascript
let app = require('express')();
let render = denodeify(app.render.bind(app));
```

The denodified function inherits from the original function. It works in all
environments, except IE 10 and below. Consequently all properties of the original
function are available to you. However, any properties you change on the
denodeified function won't be changed on the original function. Example:

```javascript
let request = denodeify(require('request')),
cookieJar = request.jar(); // <- Inheritance is used here

request('http://example.com', {jar: cookieJar}).then(function(res) {
// cookieJar.cookies holds now the cookies returned by example.com
});
```

Using `denodeify` makes it easier to compose asynchronous operations instead
of using callbacks. For example, instead of:

```javascript
let fs = require('fs');

fs.readFile('myfile.txt', function(err, data){
if (err) { ... } // Handle error
fs.writeFile('myfile2.txt', data, function(err){
if (err) { ... } // Handle error
console.log('done')
});
});
```

you can chain the operations together using `then` from the returned promise:

```javascript
let fs = require('fs');
let readFile = denodeify(fs.readFile);
let writeFile = denodeify(fs.writeFile);

readFile('myfile.txt').then(function(data){
return writeFile('myfile2.txt', data);
}).then(function(){
console.log('done')
}).catch(function(error){
// Handle error
});
```

@method denodeify
@public
@static
@for rsvp
@param {Function} nodeFunc a 'node-style' function that takes a callback as
its last argument. The callback expects an error to be passed as its first
argument (if an error occurred, otherwise null), and the value from the
operation as its second argument ('function(err, value){ }').
@param {Boolean|Array} [options] An optional paramter that if set
to `true` causes the promise to fulfill with the callback's success arguments
as an array. This is useful if the node function has multiple success
paramters. If you set this paramter to an array with names, the promise will
fulfill with a hash with these names as keys and the success parameters as
values.
@return {Function} a function that wraps `nodeFunc` to return a `Promise`
*/
function denodeify(nodeFunc, options) {
	let fn = function() {
		let l = arguments.length;
		let args = new Array(l + 1);
		let promiseInput = false;
		for (let i = 0; i < l; ++i) {
			let arg = arguments[i];
			if (!promiseInput) {
				if (arg !== null && typeof arg === "object") {
					if (arg.constructor === Promise$1) promiseInput = true;
					else try {
						promiseInput = arg.then;
					} catch (error) {
						let p = new Promise$1(noop);
						reject$2(p, error);
						return p;
					}
				} else promiseInput = false;
				if (promiseInput && promiseInput !== true) arg = wrapThenable(promiseInput, arg);
			}
			args[i] = arg;
		}
		let promise = new Promise$1(noop);
		args[l] = function(err, val) {
			if (err) reject$2(promise, err);
			else if (options === void 0) resolve$1(promise, val);
			else if (options === true) resolve$1(promise, arrayResult(arguments));
			else if (Array.isArray(options)) resolve$1(promise, makeObject(arguments, options));
			else resolve$1(promise, val);
		};
		if (promiseInput) return handlePromiseInput(promise, args, nodeFunc, this);
		else return handleValueInput(promise, args, nodeFunc, this);
	};
	fn.__proto__ = nodeFunc;
	return fn;
}
function handleValueInput(promise, args, nodeFunc, self) {
	try {
		nodeFunc.apply(self, args);
	} catch (error) {
		reject$2(promise, error);
	}
	return promise;
}
function handlePromiseInput(promise, args, nodeFunc, self) {
	return Promise$1.all(args).then((args) => handleValueInput(promise, args, nodeFunc, self));
}
/**
This is a convenient alias for `Promise.all`.

@method all
@public
@static
@for rsvp
@param {Array} array Array of promises.
@param {String} [label] An optional label. This is useful
for tooling.
*/
function all(array, label) {
	return Promise$1.all(array, label);
}
/**
@module rsvp
@public
**/
var AllSettled = class extends Enumerator {
	constructor(Constructor, entries, label) {
		super(Constructor, entries, false, label);
	}
};
AllSettled.prototype._setResultAt = setSettledResult;
/**
`RSVP.allSettled` is similar to `RSVP.all`, but instead of implementing
a fail-fast method, it waits until all the promises have returned and
shows you all the results. This is useful if you want to handle multiple
promises' failure states together as a set.
Returns a promise that is fulfilled when all the given promises have been
settled. The return promise is fulfilled with an array of the states of
the promises passed into the `promises` array argument.
Each state object will either indicate fulfillment or rejection, and
provide the corresponding value or reason. The states will take one of
the following formats:
```javascript
{ state: 'fulfilled', value: value }
or
{ state: 'rejected', reason: reason }
```
Example:
```javascript
let promise1 = RSVP.Promise.resolve(1);
let promise2 = RSVP.Promise.reject(new Error('2'));
let promise3 = RSVP.Promise.reject(new Error('3'));
let promises = [ promise1, promise2, promise3 ];
RSVP.allSettled(promises).then(function(array){
// array == [
//   { state: 'fulfilled', value: 1 },
//   { state: 'rejected', reason: Error },
//   { state: 'rejected', reason: Error }
// ]
// Note that for the second item, reason.message will be '2', and for the
// third item, reason.message will be '3'.
}, function(error) {
// Not run. (This block would only be called if allSettled had failed,
// for instance if passed an incorrect argument type.)
});
```
@method allSettled
@public
@static
@for rsvp
@param {Array} entries
@param {String} [label] - optional string that describes the promise.
Useful for tooling.
@return {Promise} promise that is fulfilled with an array of the settled
states of the constituent promises.
*/
function allSettled(entries, label) {
	if (!Array.isArray(entries)) return Promise$1.reject(/* @__PURE__ */ new TypeError("Promise.allSettled must be called with an array"), label);
	return new AllSettled(Promise$1, entries, label).promise;
}
/**
This is a convenient alias for `Promise.race`.

@method race
@public
@static
@for rsvp
@param {Array} array Array of promises.
@param {String} [label] An optional label. This is useful
for tooling.
*/
function race(array, label) {
	return Promise$1.race(array, label);
}
var PromiseHash = class extends Enumerator {
	constructor(Constructor, object, abortOnReject = true, label) {
		super(Constructor, object, abortOnReject, label);
	}
	_init(Constructor, object) {
		this._result = {};
		this._enumerate(object);
	}
	_enumerate(input) {
		let keys = Object.keys(input);
		let length = keys.length;
		let promise = this.promise;
		this._remaining = length;
		let key, val;
		for (let i = 0; promise._state === PENDING && i < length; i++) {
			key = keys[i];
			val = input[key];
			this._eachEntry(val, key, true);
		}
		this._checkFullfillment();
	}
};
/**
`hash` is similar to `all`, but takes an object instead of an array
for its `promises` argument.

Returns a promise that is fulfilled when all the given promises have been
fulfilled, or rejected if any of them become rejected. The returned promise
is fulfilled with a hash that has the same key names as the `promises` object
argument. If any of the values in the object are not promises, they will
simply be copied over to the fulfilled object.

Example:

```javascript
let promises = {
myPromise: resolve(1),
yourPromise: resolve(2),
theirPromise: resolve(3),
notAPromise: 4
};

hash(promises).then(function(hash){
// hash here is an object that looks like:
// {
//   myPromise: 1,
//   yourPromise: 2,
//   theirPromise: 3,
//   notAPromise: 4
// }
});
```

If any of the `promises` given to `hash` are rejected, the first promise
that is rejected will be given as the reason to the rejection handler.

Example:

```javascript
let promises = {
myPromise: resolve(1),
rejectedPromise: reject(new Error('rejectedPromise')),
anotherRejectedPromise: reject(new Error('anotherRejectedPromise')),
};

hash(promises).then(function(hash){
// Code here never runs because there are rejected promises!
}, function(reason) {
// reason.message === 'rejectedPromise'
});
```

An important note: `hash` is intended for plain JavaScript objects that
are just a set of keys and values. `hash` will NOT preserve prototype
chains.

Example:

```javascript
import { hash, resolve } from 'rsvp';
function MyConstructor(){
this.example = resolve('Example');
}

MyConstructor.prototype = {
protoProperty: resolve('Proto Property')
};

let myObject = new MyConstructor();

hash(myObject).then(function(hash){
// protoProperty will not be present, instead you will just have an
// object that looks like:
// {
//   example: 'Example'
// }
//
// hash.hasOwnProperty('protoProperty'); // false
// 'undefined' === typeof hash.protoProperty
});
```

@method hash
@public
@static
@for rsvp
@param {Object} object
@param {String} [label] optional string that describes the promise.
Useful for tooling.
@return {Promise} promise that is fulfilled when all properties of `promises`
have been fulfilled, or rejected if any of them become rejected.
*/
function hash(object, label) {
	return Promise$1.resolve(object, label).then(function(object) {
		if (object === null || typeof object !== "object") throw new TypeError("Promise.hash must be called with an object");
		return new PromiseHash(Promise$1, object, label).promise;
	});
}
var HashSettled = class extends PromiseHash {
	constructor(Constructor, object, label) {
		super(Constructor, object, false, label);
	}
};
HashSettled.prototype._setResultAt = setSettledResult;
/**
`hashSettled` is similar to `allSettled`, but takes an object
instead of an array for its `promises` argument.

Unlike `all` or `hash`, which implement a fail-fast method,
but like `allSettled`, `hashSettled` waits until all the
constituent promises have returned and then shows you all the results
with their states and values/reasons. This is useful if you want to
handle multiple promises' failure states together as a set.

Returns a promise that is fulfilled when all the given promises have been
settled, or rejected if the passed parameters are invalid.

The returned promise is fulfilled with a hash that has the same key names as
the `promises` object argument. If any of the values in the object are not
promises, they will be copied over to the fulfilled object and marked with state
'fulfilled'.

Example:

```javascript
import { hashSettled, resolve } from 'rsvp';

let promises = {
myPromise: resolve(1),
yourPromise: resolve(2),
theirPromise: resolve(3),
notAPromise: 4
};

hashSettled(promises).then(function(hash){
// hash here is an object that looks like:
// {
//   myPromise: { state: 'fulfilled', value: 1 },
//   yourPromise: { state: 'fulfilled', value: 2 },
//   theirPromise: { state: 'fulfilled', value: 3 },
//   notAPromise: { state: 'fulfilled', value: 4 }
// }
});
```

If any of the `promises` given to `hash` are rejected, the state will
be set to 'rejected' and the reason for rejection provided.

Example:

```javascript
import { hashSettled, reject, resolve } from 'rsvp';

let promises = {
myPromise: resolve(1),
rejectedPromise: reject(new Error('rejection')),
anotherRejectedPromise: reject(new Error('more rejection')),
};

hashSettled(promises).then(function(hash){
// hash here is an object that looks like:
// {
//   myPromise:              { state: 'fulfilled', value: 1 },
//   rejectedPromise:        { state: 'rejected', reason: Error },
//   anotherRejectedPromise: { state: 'rejected', reason: Error },
// }
// Note that for rejectedPromise, reason.message == 'rejection',
// and for anotherRejectedPromise, reason.message == 'more rejection'.
});
```

An important note: `hashSettled` is intended for plain JavaScript objects that
are just a set of keys and values. `hashSettled` will NOT preserve prototype
chains.

Example:

```javascript
import Promise, { hashSettled, resolve } from 'rsvp';

function MyConstructor(){
this.example = resolve('Example');
}

MyConstructor.prototype = {
protoProperty: Promise.resolve('Proto Property')
};

let myObject = new MyConstructor();

hashSettled(myObject).then(function(hash){
// protoProperty will not be present, instead you will just have an
// object that looks like:
// {
//   example: { state: 'fulfilled', value: 'Example' }
// }
//
// hash.hasOwnProperty('protoProperty'); // false
// 'undefined' === typeof hash.protoProperty
});
```

@method hashSettled
@public
@for rsvp
@param {Object} object
@param {String} [label] optional string that describes the promise.
Useful for tooling.
@return {Promise} promise that is fulfilled when when all properties of `promises`
have been settled.
@static
*/
function hashSettled(object, label) {
	return Promise$1.resolve(object, label).then(function(object) {
		if (object === null || typeof object !== "object") throw new TypeError("hashSettled must be called with an object");
		return new HashSettled(Promise$1, object, false, label).promise;
	});
}
/**
`rethrow` will rethrow an error on the next turn of the JavaScript event
loop in order to aid debugging.

Promises A+ specifies that any exceptions that occur with a promise must be
caught by the promises implementation and bubbled to the last handler. For
this reason, it is recommended that you always specify a second rejection
handler function to `then`. However, `rethrow` will throw the exception
outside of the promise, so it bubbles up to your console if in the browser,
or domain/cause uncaught exception in Node. `rethrow` will also throw the
error again so the error can be handled by the promise per the spec.

```javascript
import { rethrow } from 'rsvp';

function throws(){
throw new Error('Whoops!');
}

let promise = new Promise(function(resolve, reject){
throws();
});

promise.catch(rethrow).then(function(){
// Code here doesn't run because the promise became rejected due to an
// error!
}, function (err){
// handle the error here
});
```

The 'Whoops' error will be thrown on the next turn of the event loop
and you can watch for it in your console. You can also handle it using a
rejection handler given to `.then` or `.catch` on the returned promise.

@method rethrow
@public
@static
@for rsvp
@param {Error} reason reason the promise became rejected.
@throws Error
@static
*/
function rethrow(reason) {
	setTimeout(() => {
		throw reason;
	});
	throw reason;
}
/**
`defer` returns an object similar to jQuery's `$.Deferred`.
`defer` should be used when porting over code reliant on `$.Deferred`'s
interface. New code should use the `Promise` constructor instead.

The object returned from `defer` is a plain object with three properties:

* promise - an `Promise`.
* reject - a function that causes the `promise` property on this object to
become rejected
* resolve - a function that causes the `promise` property on this object to
become fulfilled.

Example:

```javascript
let deferred = defer();

deferred.resolve("Success!");

deferred.promise.then(function(value){
// value here is "Success!"
});
```

@method defer
@public
@static
@for rsvp
@param {String} [label] optional string for labeling the promise.
Useful for tooling.
@return {Object}
*/
function defer(label) {
	let deferred = {
		resolve: void 0,
		reject: void 0
	};
	deferred.promise = new Promise$1((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	}, label);
	return deferred;
}
var MapEnumerator = class extends Enumerator {
	constructor(Constructor, entries, mapFn, label) {
		super(Constructor, entries, true, label, mapFn);
	}
	_init(Constructor, input, bool, label, mapFn) {
		let len = input.length || 0;
		this.length = len;
		this._remaining = len;
		this._result = new Array(len);
		this._mapFn = mapFn;
		this._enumerate(input);
	}
	_setResultAt(state, i, value, firstPass) {
		if (firstPass) try {
			this._eachEntry(this._mapFn(value, i), i, false);
		} catch (error) {
			this._settledAt(REJECTED, i, error, false);
		}
		else {
			this._remaining--;
			this._result[i] = value;
		}
	}
};
/**
`map` is similar to JavaScript's native `map` method. `mapFn` is eagerly called
meaning that as soon as any promise resolves its value will be passed to `mapFn`.
`map` returns a promise that will become fulfilled with the result of running
`mapFn` on the values the promises become fulfilled with.

For example:

```javascript
import { map, resolve } from 'rsvp';

let promise1 = resolve(1);
let promise2 = resolve(2);
let promise3 = resolve(3);
let promises = [ promise1, promise2, promise3 ];

let mapFn = function(item){
return item + 1;
};

map(promises, mapFn).then(function(result){
// result is [ 2, 3, 4 ]
});
```

If any of the `promises` given to `map` are rejected, the first promise
that is rejected will be given as an argument to the returned promise's
rejection handler. For example:

```javascript
import { map, reject, resolve } from 'rsvp';

let promise1 = resolve(1);
let promise2 = reject(new Error('2'));
let promise3 = reject(new Error('3'));
let promises = [ promise1, promise2, promise3 ];

let mapFn = function(item){
return item + 1;
};

map(promises, mapFn).then(function(array){
// Code here never runs because there are rejected promises!
}, function(reason) {
// reason.message === '2'
});
```

`map` will also wait if a promise is returned from `mapFn`. For example,
say you want to get all comments from a set of blog posts, but you need
the blog posts first because they contain a url to those comments.

```javscript
import { map } from 'rsvp';

let mapFn = function(blogPost){
// getComments does some ajax and returns an Promise that is fulfilled
// with some comments data
return getComments(blogPost.comments_url);
};

// getBlogPosts does some ajax and returns an Promise that is fulfilled
// with some blog post data
map(getBlogPosts(), mapFn).then(function(comments){
// comments is the result of asking the server for the comments
// of all blog posts returned from getBlogPosts()
});
```

@method map
@public
@static
@for rsvp
@param {Array} promises
@param {Function} mapFn function to be called on each fulfilled promise.
@param {String} [label] optional string for labeling the promise.
Useful for tooling.
@return {Promise} promise that is fulfilled with the result of calling
`mapFn` on each fulfilled promise or value when they become fulfilled.
The promise will be rejected if any of the given `promises` become rejected.
*/
function map(promises, mapFn, label) {
	if (typeof mapFn !== "function") return Promise$1.reject(/* @__PURE__ */ new TypeError("map expects a function as a second argument"), label);
	return Promise$1.resolve(promises, label).then(function(promises) {
		if (!Array.isArray(promises)) throw new TypeError("map must be called with an array");
		return new MapEnumerator(Promise$1, promises, mapFn, label).promise;
	});
}
/**
This is a convenient alias for `Promise.resolve`.

@method resolve
@public
@static
@for rsvp
@param {*} value value that the returned promise will be resolved with
@param {String} [label] optional string for identifying the returned promise.
Useful for tooling.
@return {Promise} a promise that will become fulfilled with the given
`value`
*/
function resolve$3(value, label) {
	return Promise$1.resolve(value, label);
}
/**
This is a convenient alias for `Promise.reject`.

@method reject
@public
@static
@for rsvp
@param {*} reason value that the returned promise will be rejected with.
@param {String} [label] optional string for identifying the returned promise.
Useful for tooling.
@return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason, label) {
	return Promise$1.reject(reason, label);
}
var EMPTY_OBJECT = {};
var FilterEnumerator = class extends MapEnumerator {
	_checkFullfillment() {
		if (this._remaining === 0 && this._result !== null) {
			let result = this._result.filter((val) => val !== EMPTY_OBJECT);
			fulfill(this.promise, result);
			this._result = null;
		}
	}
	_setResultAt(state, i, value, firstPass) {
		if (firstPass) {
			this._result[i] = value;
			let val, succeeded = true;
			try {
				val = this._mapFn(value, i);
			} catch (error) {
				succeeded = false;
				this._settledAt(REJECTED, i, error, false);
			}
			if (succeeded) this._eachEntry(val, i, false);
		} else {
			this._remaining--;
			if (!value) this._result[i] = EMPTY_OBJECT;
		}
	}
};
/**
`filter` is similar to JavaScript's native `filter` method.
`filterFn` is eagerly called meaning that as soon as any promise
resolves its value will be passed to `filterFn`. `filter` returns
a promise that will become fulfilled with the result of running
`filterFn` on the values the promises become fulfilled with.

For example:

```javascript
import { filter, resolve } from 'rsvp';

let promise1 = resolve(1);
let promise2 = resolve(2);
let promise3 = resolve(3);

let promises = [promise1, promise2, promise3];

let filterFn = function(item){
return item > 1;
};

filter(promises, filterFn).then(function(result){
// result is [ 2, 3 ]
});
```

If any of the `promises` given to `filter` are rejected, the first promise
that is rejected will be given as an argument to the returned promise's
rejection handler. For example:

```javascript
import { filter, reject, resolve } from 'rsvp';

let promise1 = resolve(1);
let promise2 = reject(new Error('2'));
let promise3 = reject(new Error('3'));
let promises = [ promise1, promise2, promise3 ];

let filterFn = function(item){
return item > 1;
};

filter(promises, filterFn).then(function(array){
// Code here never runs because there are rejected promises!
}, function(reason) {
// reason.message === '2'
});
```

`filter` will also wait for any promises returned from `filterFn`.
For instance, you may want to fetch a list of users then return a subset
of those users based on some asynchronous operation:

```javascript
import { filter, resolve } from 'rsvp';

let alice = { name: 'alice' };
let bob   = { name: 'bob' };
let users = [ alice, bob ];

let promises = users.map(function(user){
return resolve(user);
});

let filterFn = function(user){
// Here, Alice has permissions to create a blog post, but Bob does not.
return getPrivilegesForUser(user).then(function(privs){
return privs.can_create_blog_post === true;
});
};
filter(promises, filterFn).then(function(users){
// true, because the server told us only Alice can create a blog post.
users.length === 1;
// false, because Alice is the only user present in `users`
users[0] === bob;
});
```

@method filter
@public
@static
@for rsvp
@param {Array} promises
@param {Function} filterFn - function to be called on each resolved value to
filter the final results.
@param {String} [label] optional string describing the promise. Useful for
tooling.
@return {Promise}
*/
function filter(promises, filterFn, label) {
	if (typeof filterFn !== "function") return Promise$1.reject(/* @__PURE__ */ new TypeError("filter expects function as a second argument"), label);
	return Promise$1.resolve(promises, label).then(function(promises) {
		if (!Array.isArray(promises)) throw new TypeError("filter must be called with an array");
		return new FilterEnumerator(Promise$1, promises, filterFn, label).promise;
	});
}
var len = 0;
var vertxNext;
function asap(callback, arg) {
	queue[len] = callback;
	queue[len + 1] = arg;
	len += 2;
	if (len === 2) scheduleFlush();
}
var browserWindow = typeof window !== "undefined" ? window : void 0;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === "undefined" && typeof process !== "undefined" && {}.toString.call(process) === "[object process]";
var isWorker = typeof Uint8ClampedArray !== "undefined" && typeof importScripts !== "undefined" && typeof MessageChannel !== "undefined";
function useNextTick() {
	let nextTick = process.nextTick;
	let version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
	if (Array.isArray(version) && version[1] === "0" && version[2] === "10") nextTick = setImmediate;
	return () => nextTick(flush);
}
function useVertxTimer() {
	if (typeof vertxNext !== "undefined") return function() {
		vertxNext(flush);
	};
	return useSetTimeout();
}
function useMutationObserver() {
	let iterations = 0;
	let observer = new BrowserMutationObserver(flush);
	let node = document.createTextNode("");
	observer.observe(node, { characterData: true });
	return () => node.data = iterations = ++iterations % 2;
}
function useMessageChannel() {
	let channel = new MessageChannel();
	channel.port1.onmessage = flush;
	return () => channel.port2.postMessage(0);
}
function useSetTimeout() {
	return () => setTimeout(flush, 1);
}
var queue = new Array(1e3);
function flush() {
	for (let i = 0; i < len; i += 2) {
		let callback = queue[i];
		let arg = queue[i + 1];
		callback(arg);
		queue[i] = void 0;
		queue[i + 1] = void 0;
	}
	len = 0;
}
function attemptVertex() {
	try {
		const vertx = Function("return this")().require("vertx");
		vertxNext = vertx.runOnLoop || vertx.runOnContext;
		return useVertxTimer();
	} catch (e) {
		return useSetTimeout();
	}
}
var scheduleFlush;
if (isNode) scheduleFlush = useNextTick();
else if (BrowserMutationObserver) scheduleFlush = useMutationObserver();
else if (isWorker) scheduleFlush = useMessageChannel();
else if (browserWindow === void 0 && typeof window.require === "function") scheduleFlush = attemptVertex();
else scheduleFlush = useSetTimeout();
config.async = asap;
config.after = (cb) => setTimeout(cb, 0);
var cast = resolve$3;
var async = (callback, arg) => config.async(callback, arg);
function on() {
	config.on(...arguments);
}
function off() {
	config.off(...arguments);
}
if (typeof window !== "undefined" && typeof window["__PROMISE_INSTRUMENTATION__"] === "object") {
	let callbacks = window["__PROMISE_INSTRUMENTATION__"];
	configure("instrument", true);
	for (let eventName in callbacks) if (callbacks.hasOwnProperty(eventName)) on(eventName, callbacks[eventName]);
}
var rsvp = {
	asap,
	cast,
	Promise: Promise$1,
	EventTarget,
	all,
	allSettled,
	race,
	hash,
	hashSettled,
	rethrow,
	defer,
	denodeify,
	configure,
	on,
	off,
	resolve: resolve$3,
	reject,
	map,
	async,
	filter
};
var RSVP = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ Object.defineProperty({
	__proto__: null,
	EventTarget,
	Promise: Promise$1,
	all,
	allSettled,
	asap,
	async,
	cast,
	configure,
	default: rsvp,
	defer,
	denodeify,
	filter,
	hash,
	hashSettled,
	map,
	off,
	on,
	race,
	reject,
	resolve: resolve$3,
	rethrow
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/container/index.js
var VALID_FULL_NAME_REGEXP = /^[^:]+:[^:]+$/;
/**
A registry used to store factory and option information keyed
by type.

A `Registry` stores the factory and option information needed by a
`Container` to instantiate and cache objects.

The API for `Registry` is still in flux and should not be considered stable.

@private
@class Registry
@since 1.11.0
*/
var Registry = class {
	_failSet;
	resolver;
	fallback;
	registrations;
	_normalizeCache;
	_options;
	_resolveCache;
	_typeOptions;
	constructor(options = {}) {
		this.fallback = options.fallback || null;
		this.resolver = options.resolver || null;
		this.registrations = makeDictionary(options.registrations || null);
		this._normalizeCache = makeDictionary(null);
		this._resolveCache = makeDictionary(null);
		this._failSet = /* @__PURE__ */ new Set();
		this._options = makeDictionary(null);
		this._typeOptions = makeDictionary(null);
	}
	/**
	A backup registry for resolving registrations when no matches can be found.
	@private
	@property fallback
	@type Registry
	*/
	/**
	An object that has a `resolve` method that resolves a name.
	@private
	@property resolver
	@type Resolver
	*/
	/**
	@private
	@property registrations
	@type InheritingDict
	*/
	/**
	@private
	@property _normalizeCache
	@type InheritingDict
	*/
	/**
	@private
	@property _resolveCache
	@type InheritingDict
	*/
	/**
	@private
	@property _options
	@type InheritingDict
	*/
	/**
	@private
	@property _typeOptions
	@type InheritingDict
	*/
	/**
	Creates a container based on this registry.
	@private
	@method container
	@param {Object} options
	@return {Container} created container
	*/
	container(options) {
		return new Container(this, options);
	}
	/**
	Registers a factory for later injection.
	Example:
	```javascript
	let registry = new Registry();
	registry.register('model:user', Person, {singleton: false });
	registry.register('fruit:favorite', Orange);
	registry.register('communication:main', Email, {singleton: false});
	```
	@private
	@method register
	@param {String} fullName
	@param {Function} factory
	@param {Object} options
	*/
	register(fullName, factory, options = {}) {
		let normalizedName = this.normalize(fullName);
		this._failSet.delete(normalizedName);
		this.registrations[normalizedName] = factory;
		this._options[normalizedName] = options;
	}
	/**
	Unregister a fullName
	```javascript
	let registry = new Registry();
	registry.register('model:user', User);
	registry.resolve('model:user').create() instanceof User //=> true
	registry.unregister('model:user')
	registry.resolve('model:user') === undefined //=> true
	```
	@private
	@method unregister
	@param {String} fullName
	*/
	unregister(fullName) {
		let normalizedName = this.normalize(fullName);
		delete this.registrations[normalizedName];
		delete this._resolveCache[normalizedName];
		delete this._options[normalizedName];
		this._failSet.delete(normalizedName);
	}
	/**
	Given a fullName return the corresponding factory.
	By default `resolve` will retrieve the factory from
	the registry.
	```javascript
	let registry = new Registry();
	registry.register('api:twitter', Twitter);
	registry.resolve('api:twitter') // => Twitter
	```
	Optionally the registry can be provided with a custom resolver.
	If provided, `resolve` will first provide the custom resolver
	the opportunity to resolve the fullName, otherwise it will fallback
	to the registry.
	```javascript
	let registry = new Registry();
	registry.resolver = function(fullName) {
	// lookup via the module system of choice
	};
	// the twitter factory is added to the module system
	registry.resolve('api:twitter') // => Twitter
	```
	@private
	@method resolve
	@param {String} fullName
	@return {Function} fullName's factory
	*/
	resolve(fullName) {
		let factory = resolve(this, this.normalize(fullName));
		if (factory === void 0 && this.fallback !== null) factory = this.fallback.resolve(fullName);
		return factory;
	}
	/**
	A hook that can be used to describe how the resolver will
	attempt to find the factory.
	For example, the default Ember `.describe` returns the full
	class name (including namespace) where Ember's resolver expects
	to find the `fullName`.
	@private
	@method describe
	@param {String} fullName
	@return {string} described fullName
	*/
	describe(fullName) {
		if (this.resolver !== null && this.resolver.lookupDescription) return this.resolver.lookupDescription(fullName);
		else if (this.fallback !== null) return this.fallback.describe(fullName);
		else return fullName;
	}
	/**
	A hook to enable custom fullName normalization behavior
	@private
	@method normalizeFullName
	@param {String} fullName
	@return {string} normalized fullName
	*/
	normalizeFullName(fullName) {
		if (this.resolver !== null && this.resolver.normalize) return this.resolver.normalize(fullName);
		else if (this.fallback !== null) return this.fallback.normalizeFullName(fullName);
		else return fullName;
	}
	/**
	Normalize a fullName based on the application's conventions
	@private
	@method normalize
	@param {String} fullName
	@return {string} normalized fullName
	*/
	normalize(fullName) {
		return this._normalizeCache[fullName] || (this._normalizeCache[fullName] = this.normalizeFullName(fullName));
	}
	/**
	@method makeToString
	@private
	@param {any} factory
	@param {string} fullName
	@return {function} toString function
	*/
	makeToString(factory, fullName) {
		if (this.resolver !== null && this.resolver.makeToString) return this.resolver.makeToString(factory, fullName);
		else if (this.fallback !== null) return this.fallback.makeToString(factory, fullName);
		else return typeof factory === "string" ? factory : factory.name ?? "(unknown class)";
	}
	/**
	Given a fullName check if the container is aware of its factory
	or singleton instance.
	@private
	@method has
	@param {String} fullName
	@param {Object} [options]
	@param {String} [options.source] the fullname of the request source (used for local lookups)
	@return {Boolean}
	*/
	has(fullName) {
		if (!this.isValidFullName(fullName)) return false;
		return has(this, this.normalize(fullName));
	}
	/**
	Allow registering options for all factories of a type.
	```javascript
	let registry = new Registry();
	let container = registry.container();
	// if all of type `connection` must not be singletons
	registry.optionsForType('connection', { singleton: false });
	registry.register('connection:twitter', TwitterConnection);
	registry.register('connection:facebook', FacebookConnection);
	let twitter = container.lookup('connection:twitter');
	let twitter2 = container.lookup('connection:twitter');
	twitter === twitter2; // => false
	let facebook = container.lookup('connection:facebook');
	let facebook2 = container.lookup('connection:facebook');
	facebook === facebook2; // => false
	```
	@private
	@method optionsForType
	@param {String} type
	@param {Object} options
	*/
	optionsForType(type, options) {
		this._typeOptions[type] = options;
	}
	getOptionsForType(type) {
		let optionsForType = this._typeOptions[type];
		if (optionsForType === void 0 && this.fallback !== null) optionsForType = this.fallback.getOptionsForType(type);
		return optionsForType;
	}
	/**
	@private
	@method options
	@param {String} fullName
	@param {Object} options
	*/
	options(fullName, options) {
		let normalizedName = this.normalize(fullName);
		this._options[normalizedName] = options;
	}
	getOptions(fullName) {
		let normalizedName = this.normalize(fullName);
		let options = this._options[normalizedName];
		if (options === void 0 && this.fallback !== null) options = this.fallback.getOptions(fullName);
		return options;
	}
	getOption(fullName, optionName) {
		let options = this._options[fullName];
		if (options !== void 0 && options[optionName] !== void 0) return options[optionName];
		let type = fullName.split(":")[0];
		options = this._typeOptions[type];
		if (options && options[optionName] !== void 0) return options[optionName];
		else if (this.fallback !== null) return this.fallback.getOption(fullName, optionName);
	}
	/**
	@private
	@method knownForType
	@param {String} type the type to iterate over
	*/
	knownForType(type) {
		let localKnown = makeDictionary(null);
		let registeredNames = Object.keys(this.registrations);
		for (let fullName of registeredNames) if (fullName.split(":")[0] === type) localKnown[fullName] = true;
		let fallbackKnown, resolverKnown;
		if (this.fallback !== null) fallbackKnown = this.fallback.knownForType(type);
		if (this.resolver !== null && this.resolver.knownForType) resolverKnown = this.resolver.knownForType(type);
		return Object.assign({}, fallbackKnown, localKnown, resolverKnown);
	}
	isValidFullName(fullName) {
		return VALID_FULL_NAME_REGEXP.test(fullName);
	}
};
function resolve(registry, _normalizedName) {
	let normalizedName = _normalizedName;
	let cached = registry._resolveCache[normalizedName];
	if (cached !== void 0) return cached;
	if (registry._failSet.has(normalizedName)) return;
	let resolved;
	if (registry.resolver) resolved = registry.resolver.resolve(normalizedName);
	if (resolved === void 0) resolved = registry.registrations[normalizedName];
	if (resolved === void 0) registry._failSet.add(normalizedName);
	else registry._resolveCache[normalizedName] = resolved;
	return resolved;
}
function has(registry, fullName) {
	return registry.resolve(fullName) !== void 0;
}
var privateNames = makeDictionary(null);
var privateSuffix = `${Math.random()}${Date.now()}`.replace(".", "");
function privatize([fullName]) {
	let name = privateNames[fullName];
	if (name) return name;
	let [type, rawName] = fullName.split(":");
	return privateNames[fullName] = intern(`${type}:${rawName}-${privateSuffix}`);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/unrecognized-url-error-xC654tCo.js
function buildTransitionAborted() {
	let error = /* @__PURE__ */ new Error("TransitionAborted");
	error.name = "TransitionAborted";
	error.code = "TRANSITION_ABORTED";
	return error;
}
function isTransitionAborted(maybeError) {
	return typeof maybeError === "object" && maybeError !== null && maybeError.code === "TRANSITION_ABORTED";
}
function isAbortable(maybeAbortable) {
	return typeof maybeAbortable === "object" && maybeAbortable !== null && typeof maybeAbortable.isAborted === "boolean";
}
function throwIfAborted(maybe) {
	if (isAbortable(maybe) && maybe.isAborted) throw buildTransitionAborted();
}
var slice = Array.prototype.slice;
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
Determines if an object is Promise by checking if it is "thenable".
**/
function isPromise(p) {
	return p !== null && typeof p === "object" && typeof p.then === "function";
}
function merge(hash, other) {
	for (let prop in other) if (hasOwnProperty.call(other, prop)) hash[prop] = other[prop];
}
/**
@private

Extracts query params from the end of an array
**/
function extractQueryParams(array) {
	let len = array && array.length, head, queryParams;
	if (len && len > 0) {
		let obj = array[len - 1];
		if (isQueryParamsContainer(obj)) {
			queryParams = obj.queryParams;
			head = slice.call(array, 0, len - 1);
			return [head, queryParams];
		}
	}
	return [array, null];
}
function isQueryParamsContainer(obj) {
	if (obj && typeof obj === "object") {
		let cast = obj;
		return "queryParams" in cast && Object.keys(cast.queryParams).every((k) => typeof k === "string");
	}
	return false;
}
/**
@private

Coerces query param properties and array elements into strings.
**/
function coerceQueryParamsToString(queryParams) {
	for (let key in queryParams) {
		let val = queryParams[key];
		if (typeof val === "number") queryParams[key] = String(val);
		else if (Array.isArray(val)) for (let i = 0, l = val.length; i < l; i++) val[i] = String(val[i]);
	}
}
/**
@private
*/
function log(router, ...args) {
	if (!router.log) return;
	if (args.length === 2) {
		let [sequence, msg] = args;
		router.log("Transition #" + sequence + ": " + msg);
	} else {
		let [msg] = args;
		router.log(msg);
	}
}
function isParam(object) {
	return typeof object === "string" || object instanceof String || typeof object === "number" || object instanceof Number;
}
function forEach(array, callback) {
	for (let i = 0, l = array.length; i < l && callback(array[i]) !== false; i++);
}
function getChangelist(oldObject, newObject) {
	let key;
	let results = {
		all: {},
		changed: {},
		removed: {}
	};
	merge(results.all, newObject);
	let didChange = false;
	coerceQueryParamsToString(oldObject);
	coerceQueryParamsToString(newObject);
	for (key in oldObject) if (hasOwnProperty.call(oldObject, key)) {
		if (!hasOwnProperty.call(newObject, key)) {
			didChange = true;
			results.removed[key] = oldObject[key];
		}
	}
	for (key in newObject) if (hasOwnProperty.call(newObject, key)) {
		let oldElement = oldObject[key];
		let newElement = newObject[key];
		if (isArray(oldElement) && isArray(newElement)) {
			if (oldElement.length !== newElement.length) {
				results.changed[key] = newObject[key];
				didChange = true;
			} else for (let i = 0, l = oldElement.length; i < l; i++) if (oldElement[i] !== newElement[i]) {
				results.changed[key] = newObject[key];
				didChange = true;
			}
		} else if (oldObject[key] !== newObject[key]) {
			results.changed[key] = newObject[key];
			didChange = true;
		}
	}
	return didChange ? results : void 0;
}
function isArray(obj) {
	return Array.isArray(obj);
}
function promiseLabel(label) {
	return "Router: " + label;
}
var STATE_SYMBOL = `__STATE__-2619860001345920-3322w3`;
var PARAMS_SYMBOL = `__PARAMS__-261986232992830203-23323`;
var QUERY_PARAMS_SYMBOL = `__QPS__-2619863929824844-32323`;
var REDIRECT_DESTINATION_SYMBOL = `__RDS__-2619863929824844-32323`;
/**
A Transition is a thenable (a promise-like object) that represents
an attempt to transition to another route. It can be aborted, either
explicitly via `abort` or by attempting another transition while a
previous one is still underway. An aborted transition can also
be `retry()`d later.

@class Transition
@constructor
@param {Object} router
@param {Object} intent
@param {Object} state
@param {Object} error
@private
*/
var Transition = class Transition {
	[STATE_SYMBOL];
	from = null;
	to = void 0;
	router;
	data;
	intent;
	resolvedModels;
	[QUERY_PARAMS_SYMBOL];
	promise;
	error;
	[PARAMS_SYMBOL];
	routeInfos;
	targetName;
	pivotHandler;
	sequence;
	isAborted = false;
	isActive = true;
	urlMethod = "update";
	resolveIndex = 0;
	queryParamsOnly = false;
	isTransition = true;
	isCausedByAbortingTransition = false;
	isCausedByInitialTransition = false;
	isCausedByAbortingReplaceTransition = false;
	_visibleQueryParams = {};
	isIntermediate = false;
	[REDIRECT_DESTINATION_SYMBOL];
	/**
	In non-production builds, this function will return the stack that this Transition was
	created within. In production builds, this function will not be present.
	@method debugCreationStack
	@return string
	*/
	/**
	In non-production builds, this function will return the stack that this Transition was
	aborted within (or `undefined` if the Transition has not been aborted yet). In production
	builds, this function will not be present.
	@method debugAbortStack
	@return string
	*/
	/**
	In non-production builds, this property references the Transition that _this_ Transition
	was derived from or `undefined` if this transition did not derive from another. In
	production builds, this property will not be present.
	@property debugPreviousTransition
	@type {Transition | undefined}
	*/
	constructor(router, intent, state, error = void 0, previousTransition = void 0) {
		this[STATE_SYMBOL] = state || router.state;
		this.intent = intent;
		this.router = router;
		this.data = intent && intent.data || {};
		this.resolvedModels = {};
		this[QUERY_PARAMS_SYMBOL] = {};
		this.promise = void 0;
		this.error = void 0;
		this[PARAMS_SYMBOL] = {};
		this.routeInfos = [];
		this.targetName = void 0;
		this.pivotHandler = void 0;
		this.sequence = -1;
		if (error) {
			this.promise = Promise$1.reject(error);
			this.error = error;
			return;
		}
		this.isCausedByAbortingTransition = Boolean(previousTransition);
		this.isCausedByInitialTransition = Boolean(previousTransition) && (previousTransition.isCausedByInitialTransition || previousTransition.sequence === 0);
		this.isCausedByAbortingReplaceTransition = Boolean(previousTransition) && previousTransition.urlMethod === "replace" && (!previousTransition.isCausedByAbortingTransition || previousTransition.isCausedByAbortingReplaceTransition);
		if (state) {
			this[PARAMS_SYMBOL] = state.params;
			this[QUERY_PARAMS_SYMBOL] = state.queryParams;
			this.routeInfos = state.routeInfos;
			let len = state.routeInfos.length;
			if (len) this.targetName = state.routeInfos[len - 1].name;
			for (let i = 0; i < len; ++i) {
				let handlerInfo = state.routeInfos[i];
				if (!handlerInfo.isResolved) break;
				this.pivotHandler = handlerInfo.route;
			}
			this.sequence = router.currentSequence++;
			this.promise = state.resolve(this).catch((result) => {
				throw this.router.transitionDidError(result, this);
			}, promiseLabel("Handle Abort"));
		} else {
			this.promise = Promise$1.resolve(this[STATE_SYMBOL]);
			this[PARAMS_SYMBOL] = {};
		}
	}
	/**
	The Transition's internal promise. Calling `.then` on this property
	is that same as calling `.then` on the Transition object itself, but
	this property is exposed for when you want to pass around a
	Transition's promise, but not the Transition object itself, since
	Transition object can be externally `abort`ed, while the promise
	cannot.
	@property promise
	@type {Object}
	@public
	*/
	/**
	Custom state can be stored on a Transition's `data` object.
	This can be useful for decorating a Transition within an earlier
	hook and shared with a later hook. Properties set on `data` will
	be copied to new transitions generated by calling `retry` on this
	transition.
	@property data
	@type {Object}
	@public
	*/
	/**
	A standard promise hook that resolves if the transition
	succeeds and rejects if it fails/redirects/aborts.
	Forwards to the internal `promise` property which you can
	use in situations where you want to pass around a thenable,
	but not the Transition itself.
	@method then
	@param {Function} onFulfilled
	@param {Function} onRejected
	@param {String} label optional string for labeling the promise.
	Useful for tooling.
	@return {Promise}
	@public
	*/
	then(onFulfilled, onRejected, label) {
		return this.promise.then(onFulfilled, onRejected, label);
	}
	/**
	Forwards to the internal `promise` property which you can
	use in situations where you want to pass around a thennable,
	but not the Transition itself.
	@method catch
	@param {Function} onRejection
	@param {String} label optional string for labeling the promise.
	Useful for tooling.
	@return {Promise}
	@public
	*/
	catch(onRejection, label) {
		return this.promise.catch(onRejection, label);
	}
	/**
	Forwards to the internal `promise` property which you can
	use in situations where you want to pass around a thenable,
	but not the Transition itself.
	@method finally
	@param {Function} callback
	@param {String} label optional string for labeling the promise.
	Useful for tooling.
	@return {Promise}
	@public
	*/
	finally(callback, label) {
		return this.promise.finally(callback, label);
	}
	/**
	Aborts the Transition. Note you can also implicitly abort a transition
	by initiating another transition while a previous one is underway.
	@method abort
	@return {Transition} this transition
	@public
	*/
	abort() {
		this.rollback();
		let transition = new Transition(this.router, void 0, void 0, void 0);
		transition.to = this.from;
		transition.from = this.from;
		transition.isAborted = true;
		this.router.routeWillChange(transition);
		this.router.routeDidChange(transition);
		return this;
	}
	rollback() {
		if (!this.isAborted) {
			log(this.router, this.sequence, this.targetName + ": transition was aborted");
			if (this.intent !== void 0 && this.intent !== null) this.intent.preTransitionState = this.router.state;
			this.isAborted = true;
			this.isActive = false;
			this.router.activeTransition = void 0;
		}
	}
	redirect(newTransition) {
		this[REDIRECT_DESTINATION_SYMBOL] = newTransition;
		this.rollback();
		this.router.routeWillChange(newTransition);
	}
	/**
	Retries a previously-aborted transition (making sure to abort the
	transition if it's still active). Returns a new transition that
	represents the new attempt to transition.
	@method retry
	@return {Transition} new transition
	@public
	*/
	retry() {
		this.abort();
		let newTransition = this.router.transitionByIntent(this.intent, false);
		if (this.urlMethod !== null) newTransition.method(this.urlMethod);
		return newTransition;
	}
	/**
	Sets the URL-changing method to be employed at the end of a
	successful transition. By default, a new Transition will just
	use `updateURL`, but passing 'replace' to this method will
	cause the URL to update using 'replaceWith' instead. Omitting
	a parameter will disable the URL change, allowing for transitions
	that don't update the URL at completion (this is also used for
	handleURL, since the URL has already changed before the
	transition took place).
	@method method
	@param {String} method the type of URL-changing method to use
	at the end of a transition. Accepted values are 'replace',
	falsy values, or any other non-falsy value (which is
	interpreted as an updateURL transition).
	@return {Transition} this transition
	@public
	*/
	method(method) {
		this.urlMethod = method;
		return this;
	}
	send(ignoreFailure = false, _name, err, transition, handler) {
		this.trigger(ignoreFailure, _name, err, transition, handler);
	}
	/**
	Fires an event on the current list of resolved/resolving
	handlers within this transition. Useful for firing events
	on route hierarchies that haven't fully been entered yet.
	Note: This method is also aliased as `send`
	@method trigger
	@param {Boolean} [ignoreFailure=false] a boolean specifying whether unhandled events throw an error
	@param {String} name the name of the event to fire
	@public
	*/
	trigger(ignoreFailure = false, name, ...args) {
		if (typeof ignoreFailure === "string") {
			name = ignoreFailure;
			ignoreFailure = false;
		}
		this.router.triggerEvent(this[STATE_SYMBOL].routeInfos.slice(0, this.resolveIndex + 1), ignoreFailure, name, args);
	}
	/**
	Transitions are aborted and their promises rejected
	when redirects occur; this method returns a promise
	that will follow any redirects that occur and fulfill
	with the value fulfilled by any redirecting transitions
	that occur.
	@method followRedirects
	@return {Promise} a promise that fulfills with the same
	value that the final redirecting transition fulfills with
	@public
	*/
	followRedirects() {
		return this.promise.catch((reason) => {
			if (this[REDIRECT_DESTINATION_SYMBOL]) return this[REDIRECT_DESTINATION_SYMBOL].followRedirects();
			return Promise$1.reject(reason);
		});
	}
	toString() {
		return "Transition (sequence " + this.sequence + ")";
	}
	/**
	@private
	*/
	log(message) {
		log(this.router, this.sequence, message);
	}
};
/**
@private

Logs and returns an instance of TransitionAborted.
*/
function logAbort(transition) {
	log(transition.router, transition.sequence, "detected abort.");
	return buildTransitionAborted();
}
function isTransition(obj) {
	return typeof obj === "object" && obj instanceof Transition && obj.isTransition;
}
function prepareResult(obj) {
	if (isTransition(obj)) return null;
	return obj;
}
var UnrecognizedURLError = function() {
	UnrecognizedURLError.prototype = Object.create(Error.prototype);
	UnrecognizedURLError.prototype.constructor = UnrecognizedURLError;
	function UnrecognizedURLError(message) {
		let error = Error.call(this, message);
		this.name = "UnrecognizedURLError";
		this.message = message || "UnrecognizedURL";
		if (Error.captureStackTrace) Error.captureStackTrace(this, UnrecognizedURLError);
		else this.stack = error.stack;
	}
	return UnrecognizedURLError;
}();
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/generate_controller.js
/**
@module @ember/routing
*/
/**
Generates a controller factory

@for Ember
@method generateControllerFactory
@private
*/
function generateControllerFactory(owner, controllerName) {
	let Factory = owner.factoryFor("controller:basic").class;
	Factory = class extends Factory {
		toString() {
			return `(generated ${controllerName} controller)`;
		}
	};
	let fullName = `controller:${controllerName}`;
	owner.register(fullName, Factory);
	return owner.factoryFor(fullName);
}
/**
Generates and instantiates a controller extending from `controller:basic`
if present, or `Controller` if not.

@for Ember
@method generateController
@private
@since 1.3.0
*/
function generateController(owner, controllerName) {
	generateControllerFactory(owner, controllerName);
	let fullName = `controller:${controllerName}`;
	return owner.lookup(fullName);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/utils.js
var ALL_PERIODS_REGEX = /\./g;
function extractRouteArgs(args) {
	args = args.slice();
	let possibleOptions = args[args.length - 1];
	let queryParams;
	if (isRouteOptions(possibleOptions)) {
		args.pop();
		queryParams = possibleOptions.queryParams;
	} else queryParams = {};
	let routeName;
	if (typeof args[0] === "string") routeName = args.shift();
	return {
		routeName,
		models: args,
		queryParams
	};
}
function getActiveTargetName(router) {
	let routeInfos = router.activeTransition ? router.activeTransition[STATE_SYMBOL].routeInfos : router.state.routeInfos;
	return routeInfos[routeInfos.length - 1].name;
}
function stashParamNames(router, routeInfos) {
	if (routeInfos["_namesStashed"]) return;
	let targetRouteName = routeInfos[routeInfos.length - 1].name;
	let recogHandlers = router._routerMicrolib.recognizer.handlersFor(targetRouteName);
	let dynamicParent;
	for (let i = 0; i < routeInfos.length; ++i) {
		let routeInfo = routeInfos[i];
		let names = recogHandlers[i].names;
		if (names.length) dynamicParent = routeInfo;
		routeInfo["_names"] = names;
		routeInfo.route._stashNames(routeInfo, dynamicParent);
	}
	routeInfos["_namesStashed"] = true;
}
function _calculateCacheValuePrefix(prefix, part) {
	let prefixParts = prefix.split(".");
	let currPrefix = "";
	for (let i = 0; i < prefixParts.length; i++) {
		let currPart = prefixParts.slice(0, i + 1).join(".");
		if (part.indexOf(currPart) !== 0) break;
		currPrefix = currPart;
	}
	return currPrefix;
}
function calculateCacheKey(prefix, parts = [], values) {
	let suffixes = "";
	for (let part of parts) {
		let cacheValuePrefix = _calculateCacheValuePrefix(prefix, part);
		let value;
		if (values) {
			if (cacheValuePrefix && cacheValuePrefix in values) {
				let partRemovedPrefix = part.indexOf(cacheValuePrefix) === 0 ? part.substring(cacheValuePrefix.length + 1) : part;
				value = get(values[cacheValuePrefix], partRemovedPrefix);
			} else value = get(values, part);
		}
		suffixes += `::${part}:${value}`;
	}
	return prefix + suffixes.replace(ALL_PERIODS_REGEX, "-");
}
function normalizeControllerQueryParams(queryParams) {
	let qpMap = {};
	for (let queryParam of queryParams) accumulateQueryParamDescriptors(queryParam, qpMap);
	return qpMap;
}
function accumulateQueryParamDescriptors(_desc, accum) {
	let desc = typeof _desc === "string" ? { [_desc]: { as: null } } : _desc;
	for (let key in desc) {
		if (!Object.prototype.hasOwnProperty.call(desc, key)) return;
		let _singleDesc = desc[key];
		let singleDesc = typeof _singleDesc === "string" ? { as: _singleDesc } : _singleDesc;
		accum[key] = {
			...accum[key] || {
				as: null,
				scope: "model"
			},
			...singleDesc
		};
	}
}
function resemblesURL(str) {
	return typeof str === "string" && (str === "" || str[0] === "/");
}
function prefixRouteNameArg(route, args) {
	let routeName;
	let owner = getOwner(route);
	let prefix = owner.mountPoint;
	if (owner.routable && typeof args[0] === "string") {
		routeName = args[0];
		if (resemblesURL(routeName)) throw new Error("Programmatic transitions by URL cannot be used within an Engine. Please use the route name instead.");
		else {
			routeName = `${prefix}.${routeName}`;
			args[0] = routeName;
		}
	}
	return args;
}
function shallowEqual(a, b) {
	let aCount = 0;
	let bCount = 0;
	for (let kA in a) if (Object.prototype.hasOwnProperty.call(a, kA)) {
		if (a[kA] !== b[kA]) return false;
		aCount++;
	}
	for (let kB in b) if (Object.prototype.hasOwnProperty.call(b, kB)) bCount++;
	return aCount === bCount;
}
function isRouteOptions(value) {
	if (value && typeof value === "object") {
		let qps = value.queryParams;
		if (qps && typeof qps === "object") return Object.keys(qps).every((k) => typeof k === "string");
	}
	return false;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/route.js
var RENDER = Symbol("render");
var RENDER_STATE = Symbol("render-state");
/**
@module @ember/routing/route
*/
/**
The `Route` class is used to define individual routes. Refer to
the [routing guide](https://guides.emberjs.com/release/routing/) for documentation.

@class Route
@extends EmberObject
@uses ActionHandler
@uses Evented
@since 1.0.0
@public
*/
var Route = class extends EmberObject.extend(ActionHandler, Evented) {
	static isRouteFactory = true;
	/** @internal */
	context = {};
	/** @internal */
	/** @internal */
	_bucketCache;
	/** @internal */
	_internalName;
	_names;
	_router;
	constructor(owner) {
		super(owner);
		if (owner) {
			let router = owner.lookup("router:main");
			let bucketCache = owner.lookup(privatize`-bucket-cache:main`);
			this._router = router;
			this._bucketCache = bucketCache;
			this._topLevelViewTemplate = owner.lookup("template:-outlet");
			this._environment = owner.lookup("-environment:main");
		}
	}
	/**
	A hook you can implement to convert the route's model into parameters
	for the URL.
	```app/router.js
	// ...
	Router.map(function() {
	this.route('post', { path: '/posts/:post_id' });
	});
	```
	```app/routes/post.js
	import Route from '@ember/routing/route';
	export default class PostRoute extends Route {
	model({ post_id }) {
	// the server returns `{ id: 12 }`
	return fetch(`/posts/${post_id}`;
	}
	serialize(model) {
	// this will make the URL `/posts/12`
	return { post_id: model.id };
	}
	}
	```
	The default `serialize` method will insert the model's `id` into the
	route's dynamic segment (in this case, `:post_id`) if the segment contains '_id'.
	If the route has multiple dynamic segments or does not contain '_id', `serialize`
	will return `getProperties(model, params)`
	This method is called when `transitionTo` is called with a context
	in order to populate the URL.
	@method serialize
	@param {Object} model the routes model
	@param {Array} params an Array of parameter names for the current
	route (in the example, `['post_id']`.
	@return {Object} the serialized parameters
	@since 1.0.0
	@public
	*/
	serialize(model, params) {
		if (params.length < 1 || !model) return;
		let object = {};
		if (params.length === 1) {
			let [name] = params;
			if (typeof model === "object" && name in model) object[name] = get(model, name);
			else if (/_id$/.test(name)) object[name] = get(model, "id");
			else if (isProxy(model)) object[name] = get(model, name);
		} else object = getProperties(model, params);
		return object;
	}
	/**
	Configuration hash for this route's queryParams. The possible
	configuration options and their defaults are as follows
	(assuming a query param whose controller property is `page`):
	```javascript
	queryParams = {
	page: {
	// By default, controller query param properties don't
	// cause a full transition when they are changed, but
	// rather only cause the URL to update. Setting
	// `refreshModel` to true will cause an "in-place"
	// transition to occur, whereby the model hooks for
	// this route (and any child routes) will re-fire, allowing
	// you to reload models (e.g., from the server) using the
	// updated query param values.
	refreshModel: false,
	// By default, changes to controller query param properties
	// cause the URL to update via `pushState`, which means an
	// item will be added to the browser's history, allowing
	// you to use the back button to restore the app to the
	// previous state before the query param property was changed.
	// Setting `replace` to true will use `replaceState` (or its
	// hash location equivalent), which causes no browser history
	// item to be added. This options name and default value are
	// the same as the `link-to` helper's `replace` option.
	replace: false,
	// By default, the query param URL key is the same name as
	// the controller property name. Use `as` to specify a
	// different URL key.
	as: 'page'
	}
	};
	```
	@property queryParams
	@for Route
	@type Object
	@since 1.6.0
	@public
	*/
	/**
	The name of the template to use by default when rendering this route's
	template.
	```app/routes/posts/list.js
	import Route from '@ember/routing/route';
	export default class PostsListRoute extends Route {
	templateName = 'posts/list';
	}
	```
	```app/routes/posts/index.js
	import PostsListRoute from '../posts/list';
	export default class PostsIndexRoute extends PostsListRoute {};
	```
	```app/routes/posts/archived.js
	import PostsListRoute from '../posts/list';
	export default class PostsArchivedRoute extends PostsListRoute {};
	```
	@property templateName
	@type String
	@default null
	@since 1.4.0
	@public
	*/
	/**
	The name of the controller to associate with this route.
	By default, Ember will lookup a route's controller that matches the name
	of the route (i.e. `posts.new`). However,
	if you would like to define a specific controller to use, you can do so
	using this property.
	This is useful in many ways, as the controller specified will be:
	* passed to the `setupController` method.
	* used as the controller for the template being rendered by the route.
	* returned from a call to `controllerFor` for the route.
	@property controllerName
	@type String
	@default null
	@since 1.4.0
	@public
	*/
	/**
	The controller associated with this route.
	Example
	```app/routes/form.js
	import Route from '@ember/routing/route';
	import { action } from '@ember/object';
	export default class FormRoute extends Route {
	@action
	willTransition(transition) {
	if (this.controller.get('userHasEnteredData') &&
	!confirm('Are you sure you want to abandon progress?')) {
	transition.abort();
	} else {
	// Bubble the `willTransition` action so that
	// parent routes can decide whether or not to abort.
	return true;
	}
	}
	}
	```
	@property controller
	@type Controller
	@since 1.6.0
	@public
	*/
	/**
	The name of the route, dot-delimited.
	For example, a route found at `app/routes/posts/post.js` will have
	a `routeName` of `posts.post`.
	@property routeName
	@for Route
	@type String
	@since 1.0.0
	@public
	*/
	/**
	The name of the route, dot-delimited, including the engine prefix
	if applicable.
	For example, a route found at `addon/routes/posts/post.js` within an
	engine named `admin` will have a `fullRouteName` of `admin.posts.post`.
	@property fullRouteName
	@for Route
	@type String
	@since 2.10.0
	@public
	*/
	/**
	Sets the name for this route, including a fully resolved name for routes
	inside engines.
	@private
	@method _setRouteName
	@param {String} name
	*/
	_setRouteName(name) {
		this.routeName = name;
		let owner = getOwner(this);
		this.fullRouteName = getEngineRouteName(owner, name);
	}
	/**
	@private
	@method _stashNames
	*/
	_stashNames(routeInfo, dynamicParent) {
		if (this._names) return;
		let names = this._names = routeInfo["_names"];
		if (!names.length) {
			routeInfo = dynamicParent;
			names = routeInfo && routeInfo["_names"] || [];
		}
		let qps = get(this, "_qp").qps;
		let namePaths = new Array(names.length);
		for (let a = 0; a < names.length; ++a) namePaths[a] = `${routeInfo.name}.${names[a]}`;
		for (let qp of qps) if (qp.scope === "model") qp.parts = namePaths;
	}
	/**
	@private
	@property _activeQPChanged
	*/
	_activeQPChanged(qp, value) {
		this._router._activeQPChanged(qp.scopedPropertyName, value);
	}
	/**
	@private
	@method _updatingQPChanged
	*/
	_updatingQPChanged(qp) {
		this._router._updatingQPChanged(qp.urlKey);
	}
	/**
	Returns a hash containing the parameters of an ancestor route.
	You may notice that `this.paramsFor` sometimes works when referring to a
	child route, but this behavior should not be relied upon as only ancestor
	routes are certain to be loaded in time.
	Example
	```app/router.js
	// ...
	Router.map(function() {
	this.route('member', { path: ':name' }, function() {
	this.route('interest', { path: ':interest' });
	});
	});
	```
	```app/routes/member.js
	import Route from '@ember/routing/route';
	export default class MemberRoute extends Route {
	queryParams = {
	memberQp: { refreshModel: true }
	}
	}
	```
	```app/routes/member/interest.js
	import Route from '@ember/routing/route';
	export default class MemberInterestRoute extends Route {
	queryParams = {
	interestQp: { refreshModel: true }
	}
	model() {
	return this.paramsFor('member');
	}
	}
	```
	If we visit `/turing/maths?memberQp=member&interestQp=interest` the model for
	the `member.interest` route is a hash with:
	* `name`: `turing`
	* `memberQp`: `member`
	@method paramsFor
	@param {String} name
	@return {Object} hash containing the parameters of the route `name`
	@since 1.4.0
	@public
	*/
	paramsFor(name) {
		let route = getOwner(this).lookup(`route:${name}`);
		if (route === void 0) return {};
		let transition = this._router._routerMicrolib.activeTransition;
		let state = transition ? transition[STATE_SYMBOL] : this._router._routerMicrolib.state;
		let fullName = route.fullRouteName;
		let params = { ...state.params[fullName] };
		let queryParams = getQueryParamsFor(route, state);
		return Object.entries(queryParams).reduce((params, [key, value]) => {
			params[key] = value;
			return params;
		}, params);
	}
	/**
	Serializes the query parameter key
	@method serializeQueryParamKey
	@param {String} controllerPropertyName
	@private
	*/
	serializeQueryParamKey(controllerPropertyName) {
		return controllerPropertyName;
	}
	/**
	Serializes value of the query parameter based on defaultValueType
	@method serializeQueryParam
	@param {Object} value
	@param {String} urlKey
	@param {String} defaultValueType
	@private
	*/
	serializeQueryParam(value, _urlKey, defaultValueType) {
		return this._router._serializeQueryParam(value, defaultValueType);
	}
	/**
	Deserializes value of the query parameter based on defaultValueType
	@method deserializeQueryParam
	@param {Object} value
	@param {String} urlKey
	@param {String} defaultValueType
	@private
	*/
	deserializeQueryParam(value, _urlKey, defaultValueType) {
		return this._router._deserializeQueryParam(value, defaultValueType);
	}
	/**
	@private
	@property _optionsForQueryParam
	*/
	_optionsForQueryParam(qp) {
		const queryParams = get(this, "queryParams");
		return get(queryParams, qp.urlKey) || get(queryParams, qp.prop) || queryParams[qp.urlKey] || queryParams[qp.prop] || {};
	}
	/**
	A hook you can use to reset controller values either when the model
	changes or the route is exiting.
	```app/routes/articles.js
	import Route from '@ember/routing/route';
	export default class ArticlesRoute extends Route {
	resetController(controller, isExiting, transition) {
	if (isExiting && transition.targetName !== 'error') {
	controller.set('page', 1);
	}
	}
	}
	```
	@method resetController
	@param {Controller} controller instance
	@param {Boolean} isExiting
	@param {Object} transition
	@since 1.7.0
	@public
	*/
	resetController(_controller, _isExiting, _transition) {
		return this;
	}
	/**
	@private
	@method exit
	*/
	exit(transition) {
		this.deactivate(transition);
		this.trigger("deactivate", transition);
		this.teardownViews();
	}
	/**
	@private
	@method _internalReset
	@since 3.6.0
	*/
	_internalReset(isExiting, transition) {
		let controller = this.controller;
		controller["_qpDelegate"] = get(this, "_qp").states.inactive;
		this.resetController(controller, isExiting, transition);
	}
	/**
	@private
	@method enter
	*/
	enter(transition) {
		this[RENDER_STATE] = void 0;
		this.activate(transition);
		this.trigger("activate", transition);
	}
	/**
	This event is triggered when the router enters the route. It is
	not executed when the model for the route changes.
	```app/routes/application.js
	import { on } from '@ember/object/evented';
	import Route from '@ember/routing/route';
	export default Route.extend({
	collectAnalytics: on('activate', function(){
	collectAnalytics();
	})
	});
	```
	@event activate
	@since 1.9.0
	@public
	*/
	/**
	This event is triggered when the router completely exits this
	route. It is not executed when the model for the route changes.
	```app/routes/index.js
	import { on } from '@ember/object/evented';
	import Route from '@ember/routing/route';
	export default Route.extend({
	trackPageLeaveAnalytics: on('deactivate', function(){
	trackPageLeaveAnalytics();
	})
	});
	```
	@event deactivate
	@since 1.9.0
	@public
	*/
	/**
	This hook is executed when the router completely exits this route. It is
	not executed when the model for the route changes.
	@method deactivate
	@param {Transition} transition
	@since 1.0.0
	@public
	*/
	deactivate(_transition) {}
	/**
	This hook is executed when the router enters the route. It is not executed
	when the model for the route changes.
	@method activate
	@param {Transition} transition
	@since 1.0.0
	@public
	*/
	activate(_transition) {}
	/**
	Perform a synchronous transition into another route without attempting
	to resolve promises, update the URL, or abort any currently active
	asynchronous transitions (i.e. regular transitions caused by
	`transitionTo` or URL changes).
	This method is handy for performing intermediate transitions on the
	way to a final destination route, and is called internally by the
	default implementations of the `error` and `loading` handlers.
	@method intermediateTransitionTo
	@param {String} name the name of the route
	@param {...Object} models the model(s) to be used while transitioning
	to the route.
	@since 1.2.0
	@public
	*/
	intermediateTransitionTo(...args) {
		let [name, ...preparedArgs] = prefixRouteNameArg(this, args);
		this._router.intermediateTransitionTo(name, ...preparedArgs);
	}
	/**
	Refresh the model on this route and any child routes, firing the
	`beforeModel`, `model`, and `afterModel` hooks in a similar fashion
	to how routes are entered when transitioning in from other route.
	The current route params (e.g. `article_id`) will be passed in
	to the respective model hooks, and if a different model is returned,
	`setupController` and associated route hooks will re-fire as well.
	An example usage of this method is re-querying the server for the
	latest information using the same parameters as when the route
	was first entered.
	Note that this will cause `model` hooks to fire even on routes
	that were provided a model object when the route was initially
	entered.
	@method refresh
	@return {Transition} the transition object associated with this
	attempted transition
	@since 1.4.0
	@public
	*/
	refresh() {
		return this._router._routerMicrolib.refresh(this);
	}
	/**
	This hook is the entry point for router.js
	@private
	@method setup
	*/
	setup(context, transition) {
		let controllerName = this.controllerName || this.routeName;
		let controller = this.controllerFor(controllerName, true) ?? this.generateController(controllerName);
		let queryParams = get(this, "_qp");
		if (!this.controller) {
			let propNames = queryParams.propertyNames;
			addQueryParamsObservers(controller, propNames);
			this.controller = controller;
		}
		controller._qpDelegate = queryParams.states.allowOverrides;
		if (transition) {
			stashParamNames(this._router, transition[STATE_SYMBOL].routeInfos);
			let cache = this._bucketCache;
			let params = transition[PARAMS_SYMBOL];
			queryParams.propertyNames.forEach((prop) => {
				let aQp = queryParams.map[prop];
				aQp.values = params;
				let cacheKey = calculateCacheKey(aQp.route.fullRouteName, aQp.parts, aQp.values);
				let value = cache.lookup(cacheKey, prop, aQp.undecoratedDefaultValue);
				set(controller, prop, value);
			});
			let qpValues = getQueryParamsFor(this, transition[STATE_SYMBOL]);
			setProperties(controller, qpValues);
		}
		this.setupController(controller, context, transition);
		if (this._environment.options.shouldRender) this[RENDER]();
		flushAsyncObservers(false);
	}
	_qpChanged(prop, value, qp) {
		if (!qp) return;
		let cache = this._bucketCache;
		let cacheKey = calculateCacheKey(qp.route.fullRouteName, qp.parts, qp.values);
		cache.stash(cacheKey, prop, value);
	}
	/**
	This hook is the first of the route entry validation hooks
	called when an attempt is made to transition into a route
	or one of its children. It is called before `model` and
	`afterModel`, and is appropriate for cases when:
	1) A decision can be made to redirect elsewhere without
	needing to resolve the model first.
	2) Any async operations need to occur first before the
	model is attempted to be resolved.
	This hook is provided the current `transition` attempt
	as a parameter, which can be used to `.abort()` the transition,
	save it for a later `.retry()`, or retrieve values set
	on it from a previous hook. You can also just call
	`router.transitionTo` to another route to implicitly
	abort the `transition`.
	You can return a promise from this hook to pause the
	transition until the promise resolves (or rejects). This could
	be useful, for instance, for retrieving async code from
	the server that is required to enter a route.
	@method beforeModel
	@param {Transition} transition
	@return {any | Promise<any>} if the value returned from this hook is
	a promise, the transition will pause until the transition
	resolves. Otherwise, non-promise return values are not
	utilized in any way.
	@since 1.0.0
	@public
	*/
	beforeModel(_transition) {}
	/**
	This hook is called after this route's model has resolved.
	It follows identical async/promise semantics to `beforeModel`
	but is provided the route's resolved model in addition to
	the `transition`, and is therefore suited to performing
	logic that can only take place after the model has already
	resolved.
	```app/routes/posts.js
	import Route from '@ember/routing/route';
	import { service } from '@ember/service';
	export default class PostsRoute extends Route {
	@service router;
	afterModel(posts, transition) {
	if (posts.get('length') === 1) {
	this.router.transitionTo('post.show', posts.get('firstObject'));
	}
	}
	}
	```
	Refer to documentation for `beforeModel` for a description
	of transition-pausing semantics when a promise is returned
	from this hook.
	@method afterModel
	@param {Object} resolvedModel the value returned from `model`,
	or its resolved value if it was a promise
	@param {Transition} transition
	@return {any | Promise<any>} if the value returned from this hook is
	a promise, the transition will pause until the transition
	resolves. Otherwise, non-promise return values are not
	utilized in any way.
	@since 1.0.0
	@public
	*/
	afterModel(_resolvedModel, _transition) {}
	/**
	A hook you can implement to optionally redirect to another route.
	Calling `this.router.transitionTo` from inside of the `redirect` hook will
	abort the current transition (into the route that has implemented `redirect`).
	`redirect` and `afterModel` behave very similarly and are
	called almost at the same time, but they have an important
	distinction when calling `this.router.transitionTo` to a child route
	of the current route. From `afterModel`, this new transition
	invalidates the current transition, causing `beforeModel`,
	`model`, and `afterModel` hooks to be called again. But the
	same transition started from `redirect` does _not_ invalidate
	the current transition. In other words, by the time the `redirect`
	hook has been called, both the resolved model and the attempted
	entry into this route are considered fully validated.
	@method redirect
	@param {Object} model the model for this route
	@param {Transition} transition the transition object associated with the current transition
	@since 1.0.0
	@public
	*/
	redirect(_model, _transition) {}
	/**
	Called when the context is changed by router.js.
	@private
	@method contextDidChange
	*/
	contextDidChange() {
		this.currentModel = this.context;
	}
	/**
	A hook you can implement to convert the URL into the model for
	this route.
	```app/router.js
	// ...
	Router.map(function() {
	this.route('post', { path: '/posts/:post_id' });
	});
	export default Router;
	```
	Note that for routes with dynamic segments, this hook is not always
	executed. If the route is entered through a transition (e.g. when
	using the `link-to` helper or the `transitionTo` method
	of routes), and a model context is already provided this hook
	is not called.
	A model context does not include a primitive string or number,
	which does cause the model hook to be called.
	Routes without dynamic segments will always execute the model hook.
	```javascript
	// no dynamic segment, model hook always called
	this.router.transitionTo('posts');
	// model passed in, so model hook not called
	thePost = store.findRecord('post', 1);
	this.router.transitionTo('post', thePost);
	// integer passed in, model hook is called
	this.router.transitionTo('post', 1);
	// model id passed in, model hook is called
	// useful for forcing the hook to execute
	thePost = store.findRecord('post', 1);
	this.router.transitionTo('post', thePost.id);
	```
	This hook follows the asynchronous/promise semantics
	described in the documentation for `beforeModel`. In particular,
	if a promise returned from `model` fails, the error will be
	handled by the `error` hook on `Route`.
	Note that the legacy behavior of automatically defining a model
	hook when a dynamic segment ending in `_id` is present is
	[deprecated](https://deprecations.emberjs.com/v5.x#toc_deprecate-implicit-route-model).
	You should explicitly define a model hook whenever any segments are
	present.
	Example
	```app/routes/post.js
	import Route from '@ember/routing/route';
	import { service } from '@ember/service';
	export default class PostRoute extends Route {
	@service store;
	model(params) {
	return this.store.findRecord('post', params.post_id);
	}
	}
	```
	@method model
	@param {Object} params the parameters extracted from the URL
	@param {Transition} transition
	@return {any | Promise<any>} the model for this route. If
	a promise is returned, the transition will pause until
	the promise resolves, and the resolved value of the promise
	will be used as the model for this route.
	@since 1.0.0
	@public
	*/
	model(params, transition) {
		let name, sawParams;
		let queryParams = get(this, "_qp").map;
		for (let prop in params) {
			if (prop === "queryParams" || queryParams && prop in queryParams) continue;
			let match = prop.match(/^(.*)_id$/);
			if (match !== null) name = match[1];
			sawParams = true;
		}
		if (!name) {
			if (sawParams) return Object.assign({}, params);
			else {
				if (transition.resolveIndex < 1) return;
				return transition[STATE_SYMBOL].routeInfos[transition.resolveIndex - 1].context;
			}
		}
	}
	/**
	@private
	@method deserialize
	@param {Object} params the parameters extracted from the URL
	@param {Transition} transition
	@return {any | Promise<any>} the model for this route.
	Router.js hook.
	*/
	deserialize(_params, transition) {
		return this.model(this._paramsFor(this.routeName, _params), transition);
	}
	/**
	A hook you can use to setup the controller for the current route.
	This method is called with the controller for the current route and the
	model supplied by the `model` hook.
	By default, the `setupController` hook sets the `model` property of
	the controller to the specified `model` when it is not `undefined`.
	If you implement the `setupController` hook in your Route, it will
	prevent this default behavior. If you want to preserve that behavior
	when implementing your `setupController` function, make sure to call
	`super`:
	```app/routes/photos.js
	import Route from '@ember/routing/route';
	import { service } from '@ember/service';
	export default class PhotosRoute extends Route {
	@service store;
	model() {
	return this.store.findAll('photo');
	}
	setupController(controller, model) {
	super.setupController(controller, model);
	this.controllerFor('application').set('showingPhotos', true);
	}
	}
	```
	The provided controller will be one resolved based on the name
	of this route.
	If no explicit controller is defined, Ember will automatically create one.
	As an example, consider the router:
	```app/router.js
	// ...
	Router.map(function() {
	this.route('post', { path: '/posts/:post_id' });
	});
	export default Router;
	```
	If you have defined a file for the post controller,
	the framework will use it.
	If it is not defined, a basic `Controller` instance would be used.
	Example Behavior of a basic Controller
	```app/routes/post.js
	import Route from '@ember/routing/route';
	export default class PostRoute extends Route {
	setupController(controller, model) {
	controller.set('model', model);
	}
	});
	```
	@method setupController
	@param {Controller} controller instance
	@param {Object} model
	@param {Transition} [transition]
	@since 1.0.0
	@public
	*/
	setupController(controller, context, _transition) {
		if (controller && context !== void 0) set(controller, "model", context);
	}
	/**
	Returns the controller of the current route, or a parent (or any ancestor)
	route in a route hierarchy.
	The controller instance must already have been created, either through entering the
	associated route or using `generateController`.
	```app/routes/post.js
	import Route from '@ember/routing/route';
	export default class PostRoute extends Route {
	setupController(controller, post) {
	super.setupController(controller, post);
	this.controllerFor('posts').set('currentPost', post);
	}
	}
	```
	@method controllerFor
	@param {String} name the name of the route or controller
	@return {Controller | undefined}
	@since 1.0.0
	@public
	*/
	controllerFor(name, _skipAssert = false) {
		let owner = getOwner(this);
		let route = owner.lookup(`route:${name}`);
		if (route && route.controllerName) name = route.controllerName;
		return owner.lookup(`controller:${name}`);
	}
	/**
	Generates a controller for a route.
	Example
	```app/routes/post.js
	import Route from '@ember/routing/route';
	export default class Post extends Route {
	setupController(controller, post) {
	super.setupController(controller, post);
	this.generateController('posts');
	}
	}
	```
	@method generateController
	@param {String} name the name of the controller
	@private
	*/
	generateController(name) {
		return generateController(getOwner(this), name);
	}
	/**
	Returns the resolved model of a parent (or any ancestor) route
	in a route hierarchy.  During a transition, all routes
	must resolve a model object, and if a route
	needs access to a parent route's model in order to
	resolve a model (or just reuse the model from a parent),
	it can call `this.modelFor(theNameOfParentRoute)` to
	retrieve it. If the ancestor route's model was a promise,
	its resolved result is returned.
	Example
	```app/router.js
	// ...
	Router.map(function() {
	this.route('post', { path: '/posts/:post_id' }, function() {
	this.route('comments');
	});
	});
	export default Router;
	```
	```app/routes/post/comments.js
	import Route from '@ember/routing/route';
	export default class PostCommentsRoute extends Route {
	model() {
	let post = this.modelFor('post');
	return post.comments;
	}
	}
	```
	@method modelFor
	@param {String} name the name of the route
	@return {Object} the model object
	@since 1.0.0
	@public
	*/
	modelFor(_name) {
		let name;
		let owner = getOwner(this);
		let transition = this._router && this._router._routerMicrolib ? this._router._routerMicrolib.activeTransition : void 0;
		if (owner.routable && transition !== void 0) name = getEngineRouteName(owner, _name);
		else name = _name;
		let route = owner.lookup(`route:${name}`);
		if (transition !== void 0 && transition !== null) {
			let modelLookupName = route && route.routeName || name;
			if (Object.prototype.hasOwnProperty.call(transition.resolvedModels, modelLookupName)) return transition.resolvedModels[modelLookupName];
		}
		return route?.currentModel;
	}
	[RENDER_STATE] = void 0;
	/**
	`this[RENDER]` is used to set up the rendering option for the outlet state.
	@method this[RENDER]
	@private
	*/
	[RENDER]() {
		this[RENDER_STATE] = buildRenderState(this);
		once(this._router, "_setOutlets");
	}
	willDestroy() {
		this.teardownViews();
	}
	/**
	@private
	@method teardownViews
	*/
	teardownViews() {
		if (this[RENDER_STATE]) {
			this[RENDER_STATE] = void 0;
			once(this._router, "_setOutlets");
		}
	}
	/**
	Allows you to produce custom metadata for the route.
	The return value of this method will be attached to
	its corresponding RouteInfoWithAttributes object.
	Example
	```app/routes/posts/index.js
	import Route from '@ember/routing/route';
	export default class PostsIndexRoute extends Route {
	buildRouteInfoMetadata() {
	return { title: 'Posts Page' }
	}
	}
	```
	```app/routes/application.js
	import Route from '@ember/routing/route';
	import { service } from '@ember/service';
	export default class ApplicationRoute extends Route {
	@service router
	constructor() {
	super(...arguments);
	this.router.on('routeDidChange', transition => {
	document.title = transition.to.metadata.title;
	// would update document's title to "Posts Page"
	});
	}
	}
	```
	@method buildRouteInfoMetadata
	@return any
	@since 3.10.0
	@public
	*/
	buildRouteInfoMetadata() {}
	_paramsFor(routeName, params) {
		if (this._router._routerMicrolib.activeTransition !== void 0) return this.paramsFor(routeName);
		return params;
	}
	/** @deprecated Manually define your own store, such as with `@service store` */
	get _store() {
		const owner = getOwner(this);
		this.routeName;
		return { find(name, value) {
			let modelClass = owner.factoryFor(`model:${name}`);
			if (!modelClass) return;
			modelClass = modelClass.class;
			return modelClass.find(value);
		} };
	}
	/**
	@private
	@property _qp
	*/
	static {
		decorateMethodV2(this.prototype, "_store", [computed]);
	}
	get _qp() {
		let combinedQueryParameterConfiguration = {};
		let controllerName = this.controllerName || this.routeName;
		let owner = getOwner(this);
		let controller = owner.lookup(`controller:${controllerName}`);
		let queryParameterConfiguraton = get(this, "queryParams");
		let hasRouterDefinedQueryParams = Object.keys(queryParameterConfiguraton).length > 0;
		if (controller) combinedQueryParameterConfiguration = mergeEachQueryParams(normalizeControllerQueryParams(get(controller, "queryParams") || []), queryParameterConfiguraton);
		else if (hasRouterDefinedQueryParams) {
			controller = generateController(owner, controllerName);
			combinedQueryParameterConfiguration = queryParameterConfiguraton;
		}
		let qps = [];
		let map = {};
		let propertyNames = [];
		for (let propName in combinedQueryParameterConfiguration) {
			if (!Object.prototype.hasOwnProperty.call(combinedQueryParameterConfiguration, propName)) continue;
			if (propName === "unknownProperty" || propName === "_super") continue;
			let desc = combinedQueryParameterConfiguration[propName];
			let scope = desc.scope || "model";
			let parts = void 0;
			if (scope === "controller") parts = [];
			let urlKey = desc.as || this.serializeQueryParamKey(propName);
			let defaultValue = get(controller, propName);
			defaultValue = copyDefaultValue(defaultValue);
			let type = desc.type || typeOf(defaultValue);
			let defaultValueSerialized = this.serializeQueryParam(defaultValue, urlKey, type);
			let scopedPropertyName = `${controllerName}:${propName}`;
			let qp = {
				undecoratedDefaultValue: get(controller, propName),
				defaultValue,
				serializedDefaultValue: defaultValueSerialized,
				serializedValue: defaultValueSerialized,
				type,
				urlKey,
				prop: propName,
				scopedPropertyName,
				controllerName,
				route: this,
				parts,
				values: null,
				scope
			};
			map[propName] = map[urlKey] = map[scopedPropertyName] = qp;
			qps.push(qp);
			propertyNames.push(propName);
		}
		return {
			qps,
			map,
			propertyNames,
			states: {
				inactive: (prop, value) => {
					let qp = map[prop];
					this._qpChanged(prop, value, qp);
				},
				active: (prop, value) => {
					let qp = map[prop];
					this._qpChanged(prop, value, qp);
					return this._activeQPChanged(qp, value);
				},
				allowOverrides: (prop, value) => {
					let qp = map[prop];
					this._qpChanged(prop, value, qp);
					return this._updatingQPChanged(qp);
				}
			}
		};
	}
	static {
		decorateMethodV2(this.prototype, "_qp", [computed]);
	}
};
function getRenderState(route) {
	return route[RENDER_STATE];
}
function buildRenderState(route) {
	let owner = getOwner(route);
	let name = route.routeName;
	let controller = owner.lookup(`controller:${route.controllerName || name}`);
	let model = route.currentModel;
	let templateFactoryOrComponent = owner.lookup(`template:${route.templateName || name}`);
	let template;
	if (templateFactoryOrComponent) {
		if (hasInternalComponentManager(templateFactoryOrComponent)) template = templateFactoryOrComponent;
		else template = templateFactoryOrComponent(owner);
	} else template = route._topLevelViewTemplate(owner);
	return {
		owner,
		name,
		controller,
		model,
		template
	};
}
function getFullQueryParams(router, state) {
	if (state.fullQueryParams) return state.fullQueryParams;
	let haveAllRouteInfosResolved = state.routeInfos.every((routeInfo) => routeInfo.route);
	let fullQueryParamsState = { ...state.queryParams };
	router._deserializeQueryParams(state.routeInfos, fullQueryParamsState);
	if (haveAllRouteInfosResolved) state.fullQueryParams = fullQueryParamsState;
	return fullQueryParamsState;
}
function getQueryParamsFor(route, state) {
	state.queryParamsFor = state.queryParamsFor || {};
	let name = route.fullRouteName;
	let existing = state.queryParamsFor[name];
	if (existing) return existing;
	let fullQueryParams = getFullQueryParams(route._router, state);
	let params = state.queryParamsFor[name] = {};
	let qps = get(route, "_qp").qps;
	for (let qp of qps) {
		let qpValueWasPassedIn = qp.prop in fullQueryParams;
		params[qp.prop] = qpValueWasPassedIn ? fullQueryParams[qp.prop] : copyDefaultValue(qp.defaultValue);
	}
	return params;
}
function copyDefaultValue(value) {
	if (Array.isArray(value)) return A(value.slice());
	return value;
}
function mergeEachQueryParams(controllerQP, routeQP) {
	let qps = {};
	let keysAlreadyMergedOrSkippable = {
		defaultValue: true,
		type: true,
		scope: true,
		as: true
	};
	for (let cqpName in controllerQP) {
		if (!Object.prototype.hasOwnProperty.call(controllerQP, cqpName)) continue;
		qps[cqpName] = {
			...controllerQP[cqpName],
			...routeQP[cqpName]
		};
		keysAlreadyMergedOrSkippable[cqpName] = true;
	}
	for (let rqpName in routeQP) {
		if (!Object.prototype.hasOwnProperty.call(routeQP, rqpName) || keysAlreadyMergedOrSkippable[rqpName]) continue;
		qps[rqpName] = {
			...routeQP[rqpName],
			...controllerQP[rqpName]
		};
	}
	return qps;
}
function addQueryParamsObservers(controller, propNames) {
	propNames.forEach((prop) => {
		if (descriptorForProperty(controller, prop) === void 0) {
			let desc = lookupDescriptor(controller, prop);
			if (desc !== null && (typeof desc.get === "function" || typeof desc.set === "function")) defineProperty(controller, prop, dependentKeyCompat({
				get: desc.get,
				set: desc.set
			}));
		}
		addObserver(controller, `${prop}.[]`, controller, controller._qpChanged, false);
	});
}
function getEngineRouteName(engine, routeName) {
	if (engine.routable) {
		let prefix = engine.mountPoint;
		if (routeName === "application") return prefix;
		else return `${prefix}.${routeName}`;
	}
	return routeName;
}
var defaultSerialize = Route.prototype.serialize;
function hasDefaultSerialize(route) {
	return route.serialize === defaultSerialize;
}
Route.reopen({
	mergedProperties: ["queryParams"],
	queryParams: {},
	templateName: null,
	controllerName: null,
	send(...args) {
		if (this._router && this._router._routerMicrolib || !isTesting()) this._router.send(...args);
		else {
			let name = args.shift();
			let action = this.actions[name];
			if (action) return action.apply(this, args);
		}
	},
	/**
	The controller associated with this route.
	Example
	```app/routes/form.js
	import Route from '@ember/routing/route';
	import { action } from '@ember/object';
	export default class FormRoute extends Route {
	@action
	willTransition(transition) {
	if (this.controller.get('userHasEnteredData') &&
	!confirm('Are you sure you want to abandon progress?')) {
	transition.abort();
	} else {
	// Bubble the `willTransition` action so that
	// parent routes can decide whether or not to abort.
	return true;
	}
	}
	}
	```
	@property controller
	@type Controller
	@since 1.6.0
	@public
	*/
	actions: {
		/**
		This action is called when one or more query params have changed. Bubbles.
		@method queryParamsDidChange
		@param changed {Object} Keys are names of query params that have changed.
		@param totalPresent {Object} Keys are names of query params that are currently set.
		@param removed {Object} Keys are names of query params that have been removed.
		@returns {boolean}
		@private
		*/
		queryParamsDidChange(changed, _totalPresent, removed) {
			let qpMap = get(this, "_qp").map;
			let totalChanged = Object.keys(changed).concat(Object.keys(removed));
			for (let change of totalChanged) {
				let qp = qpMap[change];
				if (qp) {
					let options = this._optionsForQueryParam(qp);
					if (get(options, "refreshModel") && this._router.currentState) {
						if (change in changed) {
							if (changed[change] === qp.serializedValue) continue;
						}
						this.refresh();
						break;
					}
				}
			}
			return true;
		},
		finalizeQueryParamChange(params, finalParams, transition) {
			if (this.fullRouteName !== "application") return true;
			if (!transition) return;
			let routeInfos = transition[STATE_SYMBOL].routeInfos;
			let router = this._router;
			let qpMeta = router._queryParamsFor(routeInfos);
			let changes = router._qpUpdates;
			let qpUpdated = false;
			let replaceUrl;
			stashParamNames(router, routeInfos);
			for (let qp of qpMeta.qps) {
				let route = qp.route;
				let controller = route.controller;
				let presentKey = qp.urlKey in params && qp.urlKey;
				let value;
				let svalue;
				if (changes.has(qp.urlKey)) {
					value = get(controller, qp.prop);
					svalue = route.serializeQueryParam(value, qp.urlKey, qp.type);
				} else if (presentKey) {
					svalue = params[presentKey];
					if (svalue !== void 0) value = route.deserializeQueryParam(svalue, qp.urlKey, qp.type);
				} else {
					svalue = qp.serializedDefaultValue;
					value = copyDefaultValue(qp.defaultValue);
				}
				controller._qpDelegate = get(route, "_qp").states.inactive;
				if (svalue !== qp.serializedValue) {
					if (transition.queryParamsOnly && replaceUrl !== false) {
						let options = route._optionsForQueryParam(qp);
						let replaceConfigValue = get(options, "replace");
						if (replaceConfigValue) replaceUrl = true;
						else if (replaceConfigValue === false) replaceUrl = false;
					}
					set(controller, qp.prop, value);
					qpUpdated = true;
				}
				qp.serializedValue = svalue;
				if (!(qp.serializedDefaultValue === svalue)) finalParams.push({
					value: svalue,
					visible: true,
					key: presentKey || qp.urlKey
				});
			}
			if (qpUpdated === true) flushAsyncObservers(false);
			if (replaceUrl) transition.method("replace");
			qpMeta.qps.forEach((qp) => {
				let routeQpMeta = get(qp.route, "_qp");
				let finalizedController = qp.route.controller;
				finalizedController["_qpDelegate"] = get(routeQpMeta, "states.active");
			});
			router._qpUpdates.clear();
		}
	}
});
//#endregion
export { rsvp as $, Registry as A, configure as B, isTransitionAborted as C, prepareResult as D, merge as E, all as F, hashSettled as G, denodeify as H, allSettled as I, on as J, map as K, asap as L, EventTarget as M, Promise$1 as N, promiseLabel as O, RSVP as P, rethrow as Q, async as R, isTransition as S, logAbort as T, filter as U, defer as V, hash as W, reject as X, race as Y, resolve$3 as Z, extractQueryParams as _, hasDefaultSerialize as a, isParam as b, getActiveTargetName as c, generateControllerFactory as d, PARAMS_SYMBOL as f, UnrecognizedURLError as g, Transition as h, getRenderState as i, privatize as j, throwIfAborted as k, resemblesURL as l, STATE_SYMBOL as m, defaultSerialize as n, calculateCacheKey as o, QUERY_PARAMS_SYMBOL as p, off as q, getFullQueryParams as r, extractRouteArgs as s, Route as t, shallowEqual as u, forEach as v, log as w, isPromise as x, getChangelist as y, cast as z };
