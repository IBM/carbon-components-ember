import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { C as ENV } from "./observers-BmobpXAF-CkVUhhE-.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/instrumentation/index.js
var instrumentation_exports = /* @__PURE__ */ __exportAll({
	_instrumentStart: () => _instrumentStart,
	flaggedInstrument: () => flaggedInstrument,
	instrument: () => instrument,
	reset: () => reset,
	subscribe: () => subscribe,
	subscribers: () => subscribers,
	unsubscribe: () => unsubscribe
});
/**
@module @ember/instrumentation
@private
*/
/**
The purpose of the Ember Instrumentation module is
to provide efficient, general-purpose instrumentation
for Ember.

Subscribe to a listener by using `subscribe`:

```javascript
import { subscribe } from '@ember/instrumentation';

subscribe("render", {
before(name, timestamp, payload) {

},

after(name, timestamp, payload) {

}
});
```

If you return a value from the `before` callback, that same
value will be passed as a fourth parameter to the `after`
callback.

Instrument a block of code by using `instrument`:

```javascript
import { instrument } from '@ember/instrumentation';

instrument("render.handlebars", payload, function() {
// rendering logic
}, binding);
```

Event names passed to `instrument` are namespaced
by periods, from more general to more specific. Subscribers
can listen for events by whatever level of granularity they
are interested in.

In the above example, the event is `render.handlebars`,
and the subscriber listened for all events beginning with
`render`. It would receive callbacks for events named
`render`, `render.handlebars`, `render.container`, or
even `render.handlebars.layout`.

@class Instrumentation
@static
@private
*/
var subscribers = [];
var cache = {};
function populateListeners(name) {
	let listeners = [];
	for (let subscriber of subscribers) if (subscriber.regex.test(name)) listeners.push(subscriber.object);
	cache[name] = listeners;
	return listeners;
}
var time = () => performance.now();
function isCallback(value) {
	return typeof value === "function";
}
/**
Notifies event's subscribers, calls `before` and `after` hooks.

@method instrument
@for @ember/instrumentation
@static
@param {String} [name] Namespaced event name.
@param {Object} payload
@param {Function} callback Function that you're instrumenting.
@param {Object} binding Context that instrument function is called with.
@private
*/
function instrument(name, p1, p2, p3) {
	let _payload;
	let callback;
	let binding;
	if (arguments.length <= 3 && isCallback(p1)) {
		callback = p1;
		binding = p2;
	} else {
		_payload = p1;
		callback = p2;
		binding = p3;
	}
	if (subscribers.length === 0) return callback.call(binding);
	let payload = _payload || {};
	let finalizer = _instrumentStart(name, () => payload);
	if (finalizer === NOOP) return callback.call(binding);
	else return withFinalizer(callback, finalizer, payload, binding);
}
function flaggedInstrument(_name, _payload, callback) {
	return callback();
}
function withFinalizer(callback, finalizer, payload, binding) {
	try {
		return callback.call(binding);
	} catch (e) {
		payload.exception = e;
		throw e;
	} finally {
		finalizer();
	}
}
function NOOP() {}
function _instrumentStart(name, payloadFunc, payloadArg) {
	if (subscribers.length === 0) return NOOP;
	let listeners = cache[name];
	if (!listeners) listeners = populateListeners(name);
	if (listeners.length === 0) return NOOP;
	let payload = payloadFunc(payloadArg);
	let STRUCTURED_PROFILE = ENV.STRUCTURED_PROFILE;
	let timeName;
	if (STRUCTURED_PROFILE) {
		timeName = `${name}: ${payload.object}`;
		console.time(timeName);
	}
	let beforeValues = [];
	let timestamp = time();
	for (let listener of listeners) beforeValues.push(listener.before(name, timestamp, payload));
	const constListeners = listeners;
	return function _instrumentEnd() {
		let timestamp = time();
		for (let i = 0; i < constListeners.length; i++) {
			let listener = constListeners[i];
			if (typeof listener.after === "function") listener.after(name, timestamp, payload, beforeValues[i]);
		}
		if (STRUCTURED_PROFILE) console.timeEnd(timeName);
	};
}
/**
Subscribes to a particular event or instrumented block of code.

@method subscribe
@for @ember/instrumentation
@static

@param {String} [pattern] Namespaced event name.
@param {Object} [object] Before and After hooks.

@return {Subscriber}
@private
*/
function subscribe(pattern, object) {
	let paths = pattern.split(".");
	let regexes = [];
	for (let path of paths) if (path === "*") regexes.push("[^\\.]*");
	else regexes.push(path);
	let regex = regexes.join("\\.");
	regex = `${regex}(\\..*)?`;
	let subscriber = {
		pattern,
		regex: new RegExp(`^${regex}$`),
		object
	};
	subscribers.push(subscriber);
	cache = {};
	return subscriber;
}
/**
Unsubscribes from a particular event or instrumented block of code.

@method unsubscribe
@for @ember/instrumentation
@static

@param {Object} [subscriber]
@private
*/
function unsubscribe(subscriber) {
	let index = 0;
	for (let i = 0; i < subscribers.length; i++) if (subscribers[i] === subscriber) index = i;
	subscribers.splice(index, 1);
	cache = {};
}
/**
Resets `Instrumentation` by flushing list of subscribers.

@method reset
@for @ember/instrumentation
@static
@private
*/
function reset() {
	subscribers.length = 0;
	cache = {};
}
//#endregion
export { flaggedInstrument as n, instrumentation_exports as r, _instrumentStart as t };
