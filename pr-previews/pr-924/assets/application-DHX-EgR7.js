import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { r as setOwner$1, t as getOwner$1 } from "./owner-Bxxa-eff.js";
import { t as getOwner$2 } from "./owner-DvxyMhs3.js";
import { E as getFactoryFor, J as makeDictionary, P as defineProperty, S as guidFor, U as get, _ as setName, a as NAMESPACES, c as findNamespace, d as processAllNamespaces, f as processNamespace, g as getName, l as findNamespaces, o as NAMESPACES_BY_ID, p as removeNamespace, s as addNamespace } from "./core-D-L0f59Y.js";
import { i as hasDOM } from "./curly-brand-B_F79Dep-Cbz0KMC_.js";
import { t as inspect } from "./inspect-DT5CkGp4.js";
import { c as bind, f as join, g as run, h as once, v as schedule } from "./runloop-Dk0Nzu3h.js";
import { i as meta } from "./meta-B7F2ReUu.js";
import { c as isDestroying, i as destroy, r as associateDestroyableChild, s as isDestroyed } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, _ as consumeTag, i as CONSTANT_TAG, j as valueForTag, k as untrack, l as UPDATE_TAG, s as DIRTY_TAG, y as createTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor, r as tagMetaFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { i as getChainTagsForKey, r as finishLazyChains, t as CHAIN_PASS_THROUGH } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
import { a as expect, r as dict } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { S as valueForRef, c as UNDEFINED_REFERENCE, d as createComputeRef, f as createConstRef, u as childRefFromParts, x as updateRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { A as Registry, P as RSVP, d as generateControllerFactory, j as privatize, l as resemblesURL, s as extractRouteArgs, t as Route, u as shallowEqual } from "./route-CA9vvjYs.js";
import { n as EngineInstance, r as RegistryProxyMixin, t as ApplicationInstance } from "./instance-VyeWfvnG.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { n as ComputedDescriptor, r as descriptorForDecorator, s as makeComputedDecorator } from "./decorator-9ikVwsjY-DzA4qI2N.js";
import { n as dasherize$1, t as classify } from "./string-BUAsQ27l.js";
import { t as EmberObject } from "./object-X4rDdm09.js";
import { c as getElementView, m as getViewId, p as getViewElement } from "./internal-BQ7zHrqS-DuEQEItY.js";
import { t as Evented } from "./evented-Cnj-zNta.js";
import { t as typeOf } from "./type-of-ClAdfYwH.js";
import { t as Controller } from "./controller-eOxFZEDx.js";
import { n as capabilityFlagsFrom } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
import { o as hasInternalComponentManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { t as EmberRouter } from "./router-DRkYKusv.js";
import { r as initializeDeferredDecorator, t as decorateFieldV2 } from "./runtime-CYyqkz5q-BOdRhmsS-CexCIt7z.js";
import { t as Service } from "./service-BNgWMWpo.js";
import { a as assert } from "./object-utils-AijlD-JH-xdA72BiZ.js";
import { C as CursorImpl, S as ConcreteBounds, c as EMPTY_POSITIONAL, m as curry, o as EMPTY_ARGS, p as createCapturedArgs } from "./arguments-Carzx7C4-snfB_1Hj.js";
import { M as clientBuilder, O as NewTreeBuilder, g as inTransaction, i as errorLoopTransaction, k as RemoteBlock, n as ResolverImpl, t as BaseRenderer, y as renderMain } from "./index-B-2NDHmt-B5xkrs2f.js";
import { n as castToSimple, t as castToBrowser } from "./simple-cast-DCvJLSin-HQ2D6hQ-.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { t as _instrumentStart } from "./instrumentation-l8O8qirj.js";
import { a as ComponentStateBucket, d as unwrapTemplate, n as Textarea, o as CurlyComponentManager, r as BOUNDS, s as DIRTY_TAG$1, t as Input, u as initialRenderInstrumentDetails } from "./textarea-B-sssXGa-CtPv2q76.js";
import { t as internalHelper } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
import { t as LinkTo } from "./routing-DTahssKR.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/views/lib/system/event_dispatcher.js
/**
@module ember
*/
var ROOT_ELEMENT_CLASS = "ember-application";
/**
`EventDispatcher` handles delegating browser events to their
corresponding `Ember.Views.` For example, when you click on a view,
`EventDispatcher` ensures that that view's `mouseDown` method gets
called.

@class EventDispatcher
@namespace Ember
@private
@extends EmberObject
*/
var EventDispatcher = class extends EmberObject {
	/**
	The set of events names (and associated handler function names) to be setup
	and dispatched by the `EventDispatcher`. Modifications to this list can be done
	at setup time, generally via the `Application.customEvents` hash.
	To add new events to be listened to:
	```javascript
	import Application from '@ember/application';
	let App = Application.create({
	customEvents: {
	paste: 'paste'
	}
	});
	```
	To prevent default events from being listened to:
	```javascript
	import Application from '@ember/application';
	let App = Application.create({
	customEvents: {
	mouseenter: null,
	mouseleave: null
	}
	});
	```
	@property events
	@type Object
	@private
	*/
	events = {
		touchstart: "touchStart",
		touchmove: "touchMove",
		touchend: "touchEnd",
		touchcancel: "touchCancel",
		keydown: "keyDown",
		keyup: "keyUp",
		keypress: "keyPress",
		mousedown: "mouseDown",
		mouseup: "mouseUp",
		contextmenu: "contextMenu",
		click: "click",
		dblclick: "doubleClick",
		focusin: "focusIn",
		focusout: "focusOut",
		submit: "submit",
		input: "input",
		change: "change",
		dragstart: "dragStart",
		drag: "drag",
		dragenter: "dragEnter",
		dragleave: "dragLeave",
		dragover: "dragOver",
		drop: "drop",
		dragend: "dragEnd"
	};
	/**
	The root DOM element to which event listeners should be attached. Event
	listeners will be attached to the document unless this is overridden.
	Can be specified as a DOMElement or a selector string.
	The default body is a string since this may be evaluated before document.body
	exists in the DOM.
	@private
	@property rootElement
	@type DOMElement
	@default 'body'
	*/
	rootElement = "body";
	_eventHandlers = Object.create(null);
	_didSetup = false;
	finalEventNameMapping = null;
	_sanitizedRootElement = null;
	lazyEvents = /* @__PURE__ */ new Map();
	_reverseEventNameMapping = null;
	/**
	Sets up event listeners for standard browser events.
	This will be called after the browser sends a `DOMContentReady` event. By
	default, it will set up all of the listeners on the document body. If you
	would like to register the listeners on a different element, set the event
	dispatcher's `root` property.
	@private
	@method setup
	@param addedEvents {Object}
	*/
	setup(addedEvents, _rootElement) {
		let events = this.finalEventNameMapping = {
			...get(this, "events"),
			...addedEvents
		};
		this._reverseEventNameMapping = Object.keys(events).reduce((result, key) => {
			let eventName = events[key];
			return eventName ? {
				...result,
				[eventName]: key
			} : result;
		}, {});
		let lazyEvents = this.lazyEvents;
		if (_rootElement !== void 0 && _rootElement !== null) set(this, "rootElement", _rootElement);
		let specifiedRootElement = get(this, "rootElement");
		let rootElement = typeof specifiedRootElement !== "string" ? specifiedRootElement : document.querySelector(specifiedRootElement);
		rootElement.classList.add(ROOT_ELEMENT_CLASS);
		this._sanitizedRootElement = rootElement;
		for (let event in events) if (Object.prototype.hasOwnProperty.call(events, event)) lazyEvents.set(event, events[event] ?? null);
		this._didSetup = true;
	}
	/**
	Setup event listeners for the given browser event name
	@private
	@method setupHandlerForBrowserEvent
	@param event the name of the event in the browser
	*/
	setupHandlerForBrowserEvent(event) {
		this.setupHandler(this._sanitizedRootElement, event, this.finalEventNameMapping[event] ?? null);
	}
	/**
	Setup event listeners for the given Ember event name (camel case)
	@private
	@method setupHandlerForEmberEvent
	@param eventName
	*/
	setupHandlerForEmberEvent(eventName) {
		let event = this._reverseEventNameMapping?.[eventName];
		if (event) this.setupHandler(this._sanitizedRootElement, event, eventName);
	}
	/**
	Registers an event listener on the rootElement. If the given event is
	triggered, the provided event handler will be triggered on the target view.
	If the target view does not implement the event handler, or if the handler
	returns `false`, the parent view will be called. The event will continue to
	bubble to each successive parent view until it reaches the top.
	@private
	@method setupHandler
	@param {Element} rootElement
	@param {String} event the name of the event in the browser
	@param {String} eventName the name of the method to call on the view
	*/
	setupHandler(rootElement, event, eventName) {
		if (eventName === null || !this.lazyEvents.has(event)) return;
		let viewHandler = (target, event) => {
			let view = getElementView(target);
			let result = true;
			if (view) result = view.handleEvent(eventName, event);
			return result;
		};
		let handleEvent = this._eventHandlers[event] = (event) => {
			let target = event.target;
			do {
				if (getElementView(target)) {
					if (viewHandler(target, event) === false) {
						event.preventDefault();
						event.stopPropagation();
						break;
					} else if (event.cancelBubble === true) break;
				}
				target = target.parentNode;
			} while (target instanceof Element);
		};
		rootElement.addEventListener(event, handleEvent);
		this.lazyEvents.delete(event);
	}
	destroy() {
		if (this._didSetup === false) return;
		let rootElement = this._sanitizedRootElement;
		if (!rootElement) return;
		for (let event in this._eventHandlers) rootElement.removeEventListener(event, this._eventHandlers[event]);
		rootElement.classList.remove(ROOT_ELEMENT_CLASS);
		return this._super(...arguments);
	}
	toString() {
		return "(EventDispatcher)";
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/location-utils.js
/**
@private

Escapes any regular-expression metacharacters in `str` so it can be safely
interpolated into a `RegExp` and matched as a literal.

TODO: delete this in favor of `RegExp.escape` once our minimum supported
browsers all include it (https://caniuse.com/mdn-javascript_builtins_regexp_escape).
*/
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
@private

Returns the hash or empty string
*/
function getHash(location) {
	if (location.hash !== void 0) return location.hash.substring(0);
	return "";
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/hash-location.js
/**
@module @ember/routing/hash-location
*/
/**
`HashLocation` implements the location API using the browser's
hash. At present, it relies on a `hashchange` event existing in the
browser.

Using `HashLocation` results in URLs with a `#` (hash sign) separating the
server side URL portion of the URL from the portion that is used by Ember.

Example:

```app/router.js
Router.map(function() {
this.route('posts', function() {
this.route('new');
});
});

Router.reopen({
location: 'hash'
});
```

This will result in a posts.new url of `/#/posts/new`.

@class HashLocation
@extends EmberObject
@protected
*/
var HashLocation = class extends EmberObject {
	_hashchangeHandler;
	_location;
	init() {
		this.location = this._location ?? window.location;
		this._hashchangeHandler = void 0;
	}
	/**
	@private
	Returns normalized location.hash
	@since 1.5.1
	@method getHash
	*/
	getHash() {
		return getHash(this.location);
	}
	/**
	Returns the normalized URL, constructed from `location.hash`.
	e.g. `#/foo` => `/foo` as well as `#/foo#bar` => `/foo#bar`.
	By convention, hashed paths must begin with a forward slash, otherwise they
	are not treated as a path so we can distinguish intent.
	@private
	@method getURL
	*/
	getURL() {
		let originalPath = this.getHash().substring(1);
		let outPath = originalPath;
		if (outPath[0] !== "/") {
			outPath = "/";
			if (originalPath) outPath += `#${originalPath}`;
		}
		return outPath;
	}
	/**
	Set the `location.hash` and remembers what was set. This prevents
	`onUpdateURL` callbacks from triggering when the hash was set by
	`HashLocation`.
	@private
	@method setURL
	@param path {String}
	*/
	setURL(path) {
		this.location.hash = path;
		this.lastSetURL = path;
	}
	/**
	Uses location.replace to update the url without a page reload
	or history modification.
	@private
	@method replaceURL
	@param path {String}
	*/
	replaceURL(path) {
		this.location.replace(`#${path}`);
		this.lastSetURL = path;
	}
	lastSetURL = null;
	/**
	Register a callback to be invoked when the hash changes. These
	callbacks will execute when the user presses the back or forward
	button, but not after `setURL` is invoked.
	@private
	@method onUpdateURL
	@param callback {Function}
	*/
	onUpdateURL(callback) {
		this._removeEventListener();
		this._hashchangeHandler = bind(this, function(_event) {
			let path = this.getURL();
			if (this.lastSetURL === path) return;
			this.lastSetURL = null;
			callback(path);
		});
		window.addEventListener("hashchange", this._hashchangeHandler);
	}
	/**
	Given a URL, formats it to be placed into the page as part
	of an element's `href` attribute.
	@private
	@method formatURL
	@param url {String}
	*/
	formatURL(url) {
		return `#${url}`;
	}
	/**
	Cleans up the HashLocation event listener.
	@private
	@method willDestroy
	*/
	willDestroy() {
		this._removeEventListener();
	}
	_removeEventListener() {
		if (this._hashchangeHandler) window.removeEventListener("hashchange", this._hashchangeHandler);
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/history-location.js
/**
@module @ember/routing/history-location
*/
function _uuid() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		let r, v;
		r = Math.random() * 16 | 0;
		v = c === "x" ? r : r & 3 | 8;
		return v.toString(16);
	});
}
/**
HistoryLocation implements the location API using the browser's
history.pushState API.

Using `HistoryLocation` results in URLs that are indistinguishable from a
standard URL. This relies upon the browser's `history` API.

Example:

```app/router.js
Router.map(function() {
this.route('posts', function() {
this.route('new');
});
});

Router.reopen({
location: 'history'
});
```

This will result in a posts.new url of `/posts/new`.

Keep in mind that your server must serve the Ember app at all the routes you
define.

Using `HistoryLocation` will also result in location states being recorded by
the browser `history` API with the following schema:

```
window.history.state -> { path: '/', uuid: '3552e730-b4a6-46bd-b8bf-d8c3c1a97e0a' }
```

This allows each in-app location state to be tracked uniquely across history
state changes via the `uuid` field.

@class HistoryLocation
@extends EmberObject
@protected
*/
var HistoryLocation = class extends EmberObject {
	history;
	_popstateHandler;
	/**
	Will be pre-pended to path upon state change
	@property rootURL
	@default '/'
	@private
	*/
	rootURL = "/";
	/**
	@private
	Returns normalized location.hash
	@method getHash
	*/
	getHash() {
		return getHash(this.location);
	}
	init() {
		this._super(...arguments);
		let base = document.querySelector("base");
		let baseURL = "";
		if (base !== null && base.hasAttribute("href")) baseURL = base.getAttribute("href") ?? "";
		this.baseURL = baseURL;
		this.location = this.location ?? window.location;
		this._popstateHandler = void 0;
	}
	/**
	Used to set state on first call to setURL
	@private
	@method initState
	*/
	initState() {
		let history = this.history ?? window.history;
		this.history = history;
		let { state } = history;
		let path = this.formatURL(this.getURL());
		if (!state || state.path !== path) this.replaceState(path);
	}
	/**
	Returns the current `location.pathname` without `rootURL` or `baseURL`
	@private
	@method getURL
	@return url {String}
	*/
	getURL() {
		let { location, rootURL, baseURL } = this;
		let path = location.pathname;
		rootURL = rootURL.replace(/\/$/, "");
		baseURL = baseURL.replace(/\/$/, "");
		let url = path.replace(new RegExp(`^${escapeRegExp(baseURL)}(?=/|$)`), "").replace(new RegExp(`^${escapeRegExp(rootURL)}(?=/|$)`), "").replace(/\/\//g, "/");
		let search = location.search || "";
		url += search + this.getHash();
		return url;
	}
	/**
	Uses `history.pushState` to update the url without a page reload.
	@private
	@method setURL
	@param path {String}
	*/
	setURL(path) {
		let { state } = this.history;
		path = this.formatURL(path);
		if (!state || state.path !== path) this.pushState(path);
	}
	/**
	Uses `history.replaceState` to update the url without a page reload
	or history modification.
	@private
	@method replaceURL
	@param path {String}
	*/
	replaceURL(path) {
		let { state } = this.history;
		path = this.formatURL(path);
		if (!state || state.path !== path) this.replaceState(path);
	}
	/**
	Pushes a new state.
	@private
	@method pushState
	@param path {String}
	*/
	pushState(path) {
		let state = {
			path,
			uuid: _uuid()
		};
		this.history.pushState(state, "", path);
	}
	/**
	Replaces the current state.
	@private
	@method replaceState
	@param path {String}
	*/
	replaceState(path) {
		let state = {
			path,
			uuid: _uuid()
		};
		this.history.replaceState(state, "", path);
	}
	/**
	Register a callback to be invoked whenever the browser
	history changes, including using forward and back buttons.
	@private
	@method onUpdateURL
	@param callback {Function}
	*/
	onUpdateURL(callback) {
		this._removeEventListener();
		this._popstateHandler = () => {
			callback(this.getURL());
		};
		window.addEventListener("popstate", this._popstateHandler);
	}
	/**
	Formats url to be placed into href attribute.
	@private
	@method formatURL
	@param url {String}
	@return formatted url {String}
	*/
	formatURL(url) {
		let { rootURL, baseURL } = this;
		if (url !== "") {
			rootURL = rootURL.replace(/\/$/, "");
			baseURL = baseURL.replace(/\/$/, "");
		} else if (baseURL[0] === "/" && rootURL[0] === "/") baseURL = baseURL.replace(/\/$/, "");
		return baseURL + rootURL + url;
	}
	/**
	Cleans up the HistoryLocation event listener.
	@private
	@method willDestroy
	*/
	willDestroy() {
		this._removeEventListener();
	}
	_removeEventListener() {
		if (this._popstateHandler) window.removeEventListener("popstate", this._popstateHandler);
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/none-location.js
/**
@module @ember/routing/none-location
*/
/**
NoneLocation does not interact with the browser. It is useful for
testing, or when you need to manage state with your Router, but temporarily
don't want it to muck with the URL (for example when you embed your
application in a larger page).

Using `NoneLocation` causes Ember to not store the applications URL state
in the actual URL. This is generally used for testing purposes.

@class NoneLocation
@extends EmberObject
@protected
*/
var NoneLocation = class extends EmberObject {
	updateCallback;
	/**
	Will be pre-pended to path.
	@private
	@property rootURL
	@default '/'
	*/
	initState() {
		this._super(...arguments);
		let { rootURL } = this;
	}
	/**
	Returns the current path without `rootURL`.
	@private
	@method getURL
	@return {String} path
	*/
	getURL() {
		let { path, rootURL } = this;
		rootURL = rootURL.replace(/\/$/, "");
		return path.replace(new RegExp(`^${escapeRegExp(rootURL)}(?=/|$)`), "");
	}
	/**
	Set the path and remembers what was set. Using this method
	to change the path will not invoke the `updateURL` callback.
	@private
	@method setURL
	@param path {String}
	*/
	setURL(path) {
		this.path = path;
	}
	/**
	Register a callback to be invoked when the path changes. These
	callbacks will execute when the user presses the back or forward
	button, but not after `setURL` is invoked.
	@private
	@method onUpdateURL
	@param callback {Function}
	*/
	onUpdateURL(callback) {
		this.updateCallback = callback;
	}
	/**
	Sets the path and calls the `updateURL` callback.
	@private
	@method handleURL
	@param url {String}
	*/
	handleURL(url) {
		this.path = url;
		if (this.updateCallback) this.updateCallback(url);
	}
	/**
	Given a URL, formats it to be placed into the page as part
	of an element's `href` attribute.
	@private
	@method formatURL
	@param {String} url
	@return {String} url
	*/
	formatURL(url) {
		let { rootURL } = this;
		if (url !== "") rootURL = rootURL.replace(/\/$/, "");
		return rootURL + url;
	}
};
NoneLocation.reopen({
	path: "",
	rootURL: "/"
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/alias-IFzw6sv_.js
function alias(altKey) {
	return makeComputedDecorator(new AliasedProperty(altKey), AliasDecoratorImpl);
}
var AliasDecoratorImpl = class extends Function {
	readOnly() {
		descriptorForDecorator(this).readOnly();
		return this;
	}
	oneWay() {
		descriptorForDecorator(this).oneWay();
		return this;
	}
	meta(meta) {
		let prop = descriptorForDecorator(this);
		if (arguments.length === 0) return prop._meta || {};
		else prop._meta = meta;
	}
};
var AliasedProperty = class extends ComputedDescriptor {
	altKey;
	constructor(altKey) {
		super();
		this.altKey = altKey;
	}
	setup(obj, keyName, propertyDesc, meta) {
		super.setup(obj, keyName, propertyDesc, meta);
		CHAIN_PASS_THROUGH.add(this);
	}
	get(obj, keyName) {
		let ret;
		let meta$1 = meta(obj);
		let tagMeta = tagMetaFor(obj);
		let propertyTag = tagFor(obj, keyName, tagMeta);
		untrack(() => {
			ret = get(obj, this.altKey);
		});
		let lastRevision = meta$1.revisionFor(keyName);
		if (lastRevision === void 0 || !validateTag(propertyTag, lastRevision)) {
			UPDATE_TAG(propertyTag, getChainTagsForKey(obj, this.altKey, tagMeta, meta$1));
			meta$1.setRevisionFor(keyName, valueForTag(propertyTag));
			finishLazyChains(meta$1, keyName, ret);
		}
		consumeTag(propertyTag);
		return ret;
	}
	set(obj, _keyName, value) {
		return set(obj, this.altKey, value);
	}
	readOnly() {
		this.set = AliasedProperty_readOnlySet;
	}
	oneWay() {
		this.set = AliasedProperty_oneWaySet;
	}
};
function AliasedProperty_readOnlySet(obj, keyName) {
	throw new Error(`Cannot set read-only property '${keyName}' on object: ${inspect(obj)}`);
}
function AliasedProperty_oneWaySet(obj, keyName, value) {
	defineProperty(obj, keyName, null);
	return set(obj, keyName, value);
}
/**
This is a more semantically meaningful alias of the `oneWay` computed macro,
whose name is somewhat ambiguous as to which direction the data flows.

@method reads
@static
@for @ember/object/computed
@param {String} dependentKey
@return {ComputedProperty} computed property which creates a one way computed
property to the original value for property.
@public
*/
/**
Where `oneWay` computed macro provides oneWay bindings, the `readOnly`
computed macro provides a readOnly one way binding. Very often when using
the `oneWay` macro one does not also want changes to propagate back up, as
they will replace the value.

This prevents the reverse flow, and also throws an exception when it occurs.

Example:

```javascript
import { set } from '@ember/object';
import { readOnly } from '@ember/object/computed';

class User {
constructor(firstName, lastName) {
set(this, 'firstName', firstName);
set(this, 'lastName', lastName);
}

@readOnly('firstName') nickName;
});

let teddy = new User('Teddy', 'Zeenny');

teddy.nickName; // 'Teddy'

set(teddy, 'nickName', 'TeddyBear'); // throws Exception
// throw new EmberError('Cannot Set: nickName on: <User:ember27288>' );`

teddy.firstName; // 'Teddy'
```

@method readOnly
@static
@for @ember/object/computed
@param {String} dependentKey
@return {ComputedProperty} computed property which creates a one way computed
property to the original value for property.
@since 1.5.0
@public
*/
function readOnly(dependentKey) {
	return alias(dependentKey).readOnly();
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/router-service.js
/**
* @module @ember/routing/router-service
*/
var ROUTER = Symbol("ROUTER");
function cleanURL(url, rootURL) {
	if (rootURL === "/") return url;
	return url.substring(rootURL.length);
}
/**
The Router service is the public API that provides access to the router.

The immediate benefit of the Router service is that you can inject it into components,
giving them a friendly way to initiate transitions and ask questions about the current
global router state.

In this example, the Router service is injected into a component to initiate a transition
to a dedicated route:

```gjs {data-filename="app/components/example.gjs"}
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ExampleComponent extends Component {
@service router;

@action
next() {
this.router.transitionTo('other.route');
}
}
```

Like any service, it can also be injected into helpers, routes, etc.

@public
@extends Service
@class RouterService
*/
var RouterService = class extends Service.extend(Evented) {
	[ROUTER];
	get _router() {
		let router = this[ROUTER];
		if (router !== void 0) return router;
		let _router = getOwner$1(this).lookup("router:main");
		return this[ROUTER] = _router;
	}
	willDestroy() {
		super.willDestroy();
		this[ROUTER] = void 0;
	}
	/**
	Transition the application into another route. The route may
	be either a single route or route path:
	Calling `transitionTo` from the Router service will cause default query parameter values to be included in the URL.
	This behavior is different from calling `transitionTo` on a route or `transitionToRoute` on a controller.
	See the [Router Service RFC](https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md#query-parameter-semantics) for more info.
	In the following example we use the Router service to navigate to a route with a
	specific model from a Component in the first action, and in the second we trigger
	a query-params only transition.
	```gjs {data-filename="app/components/example.gjs"}
	import Component from '@glimmer/component';
	import { action } from '@ember/object';
	import { service } from '@ember/service';
	export default class extends Component {
	@service router;
	@action
	goToComments(post) {
	this.router.transitionTo('comments', post);
	}
	@action
	fetchMoreComments(latestComment) {
	this.router.transitionTo({
	queryParams: { commentsAfter: latestComment }
	});
	}
	}
	```
	@method transitionTo
	@param {String} [routeNameOrUrl] the name of the route or a URL
	@param {...Object} [models] the model(s) or identifier(s) to be used while
	transitioning to the route.
	@param {Object} [options] optional hash with a queryParams property
	containing a mapping of query parameters. May be supplied as the only
	parameter to trigger a query-parameter-only transition.
	@return {Transition} the transition object associated with this
	attempted transition
	@public
	*/
	transitionTo(...args) {
		if (resemblesURL(args[0])) return this._router._doURLTransition("transitionTo", args[0]);
		let { routeName, models, queryParams } = extractRouteArgs(args);
		return this._router._doTransition(routeName, models, queryParams, true);
	}
	/**
	Similar to `transitionTo`, but instead of adding the destination to the browser's URL history,
	it replaces the entry for the current route.
	When the user clicks the "back" button in the browser, there will be fewer steps.
	This is most commonly used to manage redirects in a way that does not cause confusing additions
	to the user's browsing history.
	Calling `replaceWith` from the Router service will cause default query parameter values to be included in the URL.
	This behavior is different from calling `replaceWith` on a route.
	See the [Router Service RFC](https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md#query-parameter-semantics) for more info.
	Usage example:
	```app/routes/application.js
	import Route from '@ember/routing/route';
	import { service } from '@ember/service';
	export default class extends Route {
	@service router;
	beforeModel() {
	if (!authorized()){
	this.router.replaceWith('unauthorized');
	}
	}
	});
	```
	@method replaceWith
	@param {String} routeNameOrUrl the name of the route or a URL of the desired destination
	@param {...Object} models the model(s) or identifier(s) to be used while
	transitioning to the route i.e. an object of params to pass to the destination route
	@param {Object} [options] optional hash with a queryParams property
	containing a mapping of query parameters
	@return {Transition} the transition object associated with this
	attempted transition
	@public
	*/
	replaceWith(...args) {
		return this.transitionTo(...args).method("replace");
	}
	/**
	Generate a URL based on the supplied route name and optionally a model. The
	URL is returned as a string that can be used for any purpose.
	In this example, the URL for the `author.books` route for a given author
	is copied to the clipboard.
	```gjs {data-filename="app/templates/application.gjs"}
	import CopyLink from '../components/copy-link';
	
	<template>
	<CopyLink @author={{hash id="tomster" name="Tomster"}} />
	</template>
	```
	```gjs {data-filename="app/components/copy-link.gjs"}
	import Component from '@glimmer/component';
	import { service } from '@ember/service';
	import { action } from '@ember/object';
	export default class CopyLinkComponent extends Component {
	@service router;
	@service clipboard;
	@action
	copyBooksURL() {
	if (this.author) {
	const url = this.router.urlFor('author.books', this.args.author);
	this.clipboard.set(url);
	// Clipboard now has /author/tomster/books
	}
	}
	}
	```
	Just like with `transitionTo` and `replaceWith`, `urlFor` can also handle
	query parameters.
	```gjs {data-filename="app/templates/application.gjs"}
	import CopyLink from '../components/copy-link';
	<template>
	<CopyLink @author={{hash id="tomster" name="Tomster"}} />
	</template>
	```
	```gjs {data-filename="app/components/copy-link.gjs"}
	import Component from '@glimmer/component';
	import { service } from '@ember/service';
	import { action } from '@ember/object';
	export default class CopyLinkComponent extends Component {
	@service router;
	@service clipboard;
	@action
	copyOnlyEmberBooksURL() {
	if (this.author) {
	const url = this.router.urlFor('author.books', this.author, {
	queryParams: { filter: 'emberjs' }
	});
	this.clipboard.set(url);
	// Clipboard now has /author/tomster/books?filter=emberjs
	}
	}
	}
	```
	@method urlFor
	@param {String} routeName the name of the route
	@param {...Object} models the model(s) for the route.
	@param {Object} [options] optional hash with a queryParams property
	containing a mapping of query parameters
	@return {String} the string representing the generated URL
	@public
	*/
	urlFor(routeName, ...args) {
		this._router.setupRouter();
		return this._router.generate(routeName, ...args);
	}
	/**
	Returns `true` if `routeName/models/queryParams` is the active route, where `models` and `queryParams` are optional.
	See [model](api/ember/release/classes/Route/methods/model?anchor=model) and
	[queryParams](/api/ember/3.7/classes/Route/properties/queryParams?anchor=queryParams) for more information about these arguments.
	In the following example, `isActive` will return `true` if the current route is `/posts`.
	```gjs {data-filename="app/components/posts.gjs"}
	import Component from '@glimmer/component';
	import { service } from '@ember/service';
	export default class extends Component {
	@service router;
	displayComments() {
	return this.router.isActive('posts');
	}
	});
	```
	The next example includes a dynamic segment, and will return `true` if the current route is `/posts/1`,
	assuming the post has an id of 1:
	```gjs {data-filename="app/components/posts.gjs"}
	import Component from '@glimmer/component';
	import { service } from '@ember/service';
	export default class extends Component {
	@service router;
	displayComments(post) {
	return this.router.isActive('posts', post.id);
	}
	});
	```
	Where `post.id` is the id of a specific post, which is represented in the route as /posts/[post.id].
	If `post.id` is equal to 1, then isActive will return true if the current route is /posts/1, and false if the route is anything else.
	@method isActive
	@param {String} routeName the name of the route
	@param {...Object} models the model(s) or identifier(s) to be used when determining the active route.
	@param {Object} [options] optional hash with a queryParams property
	containing a mapping of query parameters
	@return {boolean} true if the provided routeName/models/queryParams are active
	@public
	*/
	isActive(...args) {
		let { routeName, models, queryParams } = extractRouteArgs(args);
		this._router.setupRouter();
		let routerMicrolib = this._router._routerMicrolib;
		consumeTag(tagFor(this._router, "currentURL"));
		if (!routerMicrolib.isActiveIntent(routeName, models)) return false;
		if (Object.keys(queryParams).length > 0) {
			let targetRouteName = routeName;
			queryParams = Object.assign({}, queryParams);
			this._router._prepareQueryParams(targetRouteName, models, queryParams, true);
			let currentQueryParams = Object.assign({}, routerMicrolib.state.queryParams);
			this._router._prepareQueryParams(targetRouteName, models, currentQueryParams, true);
			return shallowEqual(queryParams, currentQueryParams);
		}
		return true;
	}
	/**
	Takes a string URL and returns a `RouteInfo` for the leafmost route represented
	by the URL. Returns `null` if the URL is not recognized. This method expects to
	receive the actual URL as seen by the browser including the app's `rootURL`.
	See [RouteInfo](/ember/release/classes/RouteInfo) for more info.
	In the following example `recognize` is used to verify if a path belongs to our
	application before transitioning to it.
	```js
	import Component from '@ember/component';
	import { service } from '@ember/service';
	export default class extends Component {
	@service router;
	path = '/';
	click() {
	if (this.router.recognize(this.path)) {
	this.router.transitionTo(this.path);
	}
	}
	}
	```
	@method recognize
	@param {String} url
	@return {RouteInfo | null}
	@public
	*/
	recognize(url) {
		this._router.setupRouter();
		let internalURL = cleanURL(url, this.rootURL);
		return this._router._routerMicrolib.recognize(internalURL);
	}
	/**
	Takes a string URL and returns a promise that resolves to a
	`RouteInfoWithAttributes` for the leafmost route represented by the URL.
	The promise rejects if the URL is not recognized or an unhandled exception
	is encountered. This method expects to receive the actual URL as seen by
	the browser including the app's `rootURL`.
	@method recognizeAndLoad
	@param {String} url
	@return {RouteInfo}
	@public
	*/
	recognizeAndLoad(url) {
		this._router.setupRouter();
		let internalURL = cleanURL(url, this.rootURL);
		return this._router._routerMicrolib.recognizeAndLoad(internalURL);
	}
	/**
	You can register a listener for events emitted by this service with `.on()`:
	```app/routes/contact-form.js
	import Route from '@ember/routing';
	import { service } from '@ember/service';
	export default class extends Route {
	@service router;
	activate() {
	this.router.on('routeWillChange', (transition) => {
	if (!transition.to.find(route => route.name === this.routeName)) {
	alert("Please save or cancel your changes.");
	transition.abort();
	}
	})
	}
	}
	```
	@method on
	@param {String} eventName
	@param {Function} callback
	@public
	*/
	/**
	You can unregister a listener for events emitted by this service with `.off()`:
	```app/routes/contact-form.js
	import Route from '@ember/routing';
	import { service } from '@ember/service';
	export default class ContactFormRoute extends Route {
	@service router;
	callback = (transition) => {
	if (!transition.to.find(route => route.name === this.routeName)) {
	alert('Please save or cancel your changes.');
	transition.abort();
	}
	};
	activate() {
	this.router.on('routeWillChange', this.callback);
	}
	deactivate() {
	this.router.off('routeWillChange', this.callback);
	}
	}
	```
	@method off
	@param {String} eventName
	@param {Function} callback
	@public
	*/
	/**
	The `routeWillChange` event is fired at the beginning of any
	attempted transition with a `Transition` object as the sole
	argument. This action can be used for aborting, redirecting,
	or decorating the transition from the currently active routes.
	A good example is preventing navigation when a form is
	half-filled out:
	```app/routes/contact-form.js
	import Route from '@ember/routing';
	import { service } from '@ember/service';
	export default class extends Route {
	@service router;
	activate() {
	this.router.on('routeWillChange', (transition) => {
	if (!transition.to.find(route => route.name === this.routeName)) {
	alert("Please save or cancel your changes.");
	transition.abort();
	}
	})
	}
	}
	```
	The `routeWillChange` event fires whenever a new route is chosen as the desired target of a transition. This includes `transitionTo`, `replaceWith`, all redirection for any reason including error handling, and abort. Aborting implies changing the desired target back to where you already were. Once a transition has completed, `routeDidChange` fires.
	@event routeWillChange
	@param {Transition} transition
	@public
	*/
	/**
	The `routeDidChange` event only fires once a transition has settled.
	This includes aborts and error substates. Like the `routeWillChange` event
	it receives a Transition as the sole argument.
	A good example is sending some analytics when the route has transitioned:
	```app/routes/contact-form.js
	import Route from '@ember/routing';
	import { service } from '@ember/service';
	export default class extends Route {
	@service router;
	activate() {
	this.router.on('routeDidChange', (transition) => {
	ga.send('pageView', {
	current: transition.to.name,
	from: transition.from.name
	});
	})
	}
	}
	```
	`routeDidChange` will be called after any `Route`'s
	[didTransition](/ember/release/classes/Route/events/didTransition?anchor=didTransition)
	action has been fired.
	The updates of properties
	[currentURL](/ember/release/classes/RouterService/properties/currentURL?anchor=currentURL),
	[currentRouteName](/ember/release/classes/RouterService/properties/currentURL?anchor=currentRouteName)
	and
	[currentRoute](/ember/release/classes/RouterService/properties/currentURL?anchor=currentRoute)
	are completed at the time `routeDidChange` is called.
	@event routeDidChange
	@param {Transition} transition
	@public
	*/
	/**
	* Refreshes all currently active routes, doing a full transition.
	* If a route name is provided and refers to a currently active route,
	* it will refresh only that route and its descendents.
	* Returns a promise that will be resolved once the refresh is complete.
	* All resetController, beforeModel, model, afterModel, redirect, and setupController
	* hooks will be called again. You will get new data from the model hook.
	*
	* @method refresh
	* @param {String} [routeName] the route to refresh (along with all child routes)
	* @return Transition
	* @public
	*/
	refresh(pivotRouteName) {
		if (!pivotRouteName) return this._router._routerMicrolib.refresh();
		let pivotRoute = getOwner$1(this).lookup(`route:${pivotRouteName}`);
		return this._router._routerMicrolib.refresh(pivotRoute);
	}
	/**
	Name of the current route.
	This property represents the logical name of the route,
	which is dot separated.
	For the following router:
	```app/router.js
	Router.map(function() {
	this.route('about');
	this.route('blog', function () {
	this.route('post', { path: ':post_id' });
	});
	});
	```
	It will return:
	* `index` when you visit `/`
	* `about` when you visit `/about`
	* `blog.index` when you visit `/blog`
	* `blog.post` when you visit `/blog/some-post-id`
	@property currentRouteName
	@type {String | null}
	@public
	*/
	static {
		decorateFieldV2(this.prototype, "currentRouteName", [readOnly("_router.currentRouteName")]);
	}
	#currentRouteName = (initializeDeferredDecorator(this, "currentRouteName"), void 0);
	static {
		decorateFieldV2(this.prototype, "currentURL", [readOnly("_router.currentURL")]);
	}
	#currentURL = (initializeDeferredDecorator(this, "currentURL"), void 0);
	/**
	Current URL for the application.
	This property represents the URL path for this route.
	For the following router:
	```app/router.js
	Router.map(function() {
	this.route('about');
	this.route('blog', function () {
	this.route('post', { path: ':post_id' });
	});
	});
	```
	It will return:
	* `/` when you visit `/`
	* `/about` when you visit `/about`
	* `/blog` when you visit `/blog`
	* `/blog/some-post-id` when you visit `/blog/some-post-id`
	@property currentURL
	@type String
	@public
	*/
	static {
		decorateFieldV2(this.prototype, "location", [readOnly("_router.location")]);
	}
	#location = (initializeDeferredDecorator(this, "location"), void 0);
	/**
	The `location` property returns what implementation of the `location` API
	your application is using, which determines what type of URL is being used.
	See [Location](/ember/release/classes/Location) for more information.
	To force a particular `location` API implementation to be used in your
	application you can set a location type on your `config/environment`.
	For example, to set the `history` type:
	```config/environment.js
	'use strict';
	module.exports = function(environment) {
	let ENV = {
	modulePrefix: 'router-service',
	environment,
	rootURL: '/',
	locationType: 'history',
	...
	}
	}
	```
	The following location types are available by default:
	`hash`, `history`, `none`.
	See [HashLocation](/ember/release/classes/HashLocation).
	See [HistoryLocation](/ember/release/classes/HistoryLocation).
	See [NoneLocation](/ember/release/classes/NoneLocation).
	@property location
	@default 'hash'
	@see {Location}
	@public
	*/
	static {
		decorateFieldV2(this.prototype, "rootURL", [readOnly("_router.rootURL")]);
	}
	#rootURL = (initializeDeferredDecorator(this, "rootURL"), void 0);
	/**
	The `rootURL` property represents the URL of the root of
	the application, '/' by default.
	This prefix is assumed on all routes defined on this app.
	If you change the `rootURL` in your environment configuration
	like so:
	```config/environment.js
	'use strict';
	module.exports = function(environment) {
	let ENV = {
	modulePrefix: 'router-service',
	environment,
	rootURL: '/my-root',
	…
	}
	]
	```
	This property will return `/my-root`.
	@property rootURL
	@default '/'
	@public
	*/
	static {
		decorateFieldV2(this.prototype, "currentRoute", [readOnly("_router.currentRoute")]);
	}
	#currentRoute = (initializeDeferredDecorator(this, "currentRoute"), void 0);
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/routing-service.js
/**
@module ember
*/
/**
The Routing service is used by LinkTo, and provides facilities for
the component/view layer to interact with the router.

This is a private service for internal usage only. For public usage,
refer to the `Router` service.

@private
@class RoutingService
*/
var RoutingService = class extends Service {
	[ROUTER];
	get router() {
		let router = this[ROUTER];
		if (router !== void 0) return router;
		let _router = getOwner$1(this).lookup("router:main");
		_router.setupRouter();
		return this[ROUTER] = _router;
	}
	hasRoute(routeName) {
		return this.router.hasRoute(routeName);
	}
	transitionTo(routeName, models, queryParams, shouldReplace) {
		let transition = this.router._doTransition(routeName, models, queryParams);
		if (shouldReplace) transition.method("replace");
		return transition;
	}
	normalizeQueryParams(routeName, models, queryParams) {
		this.router._prepareQueryParams(routeName, models, queryParams);
	}
	_generateURL(routeName, models, queryParams) {
		let visibleQueryParams = {};
		if (queryParams) {
			Object.assign(visibleQueryParams, queryParams);
			this.normalizeQueryParams(routeName, models, visibleQueryParams);
		}
		return this.router.generate(routeName, ...models, { queryParams: visibleQueryParams });
	}
	generateURL(routeName, models, queryParams) {
		if (this.router._initialTransitionStarted) return this._generateURL(routeName, models, queryParams);
		else try {
			return this._generateURL(routeName, models, queryParams);
		} catch (_e) {
			return;
		}
	}
	isActiveForRoute(contexts, queryParams, routeName, routerState) {
		let handlers = this.router._routerMicrolib.recognizer.handlersFor(routeName);
		let leafName = handlers[handlers.length - 1].handler;
		let maximumContexts = numberOfContextsAcceptedByHandler(routeName, handlers);
		if (contexts.length > maximumContexts) routeName = leafName;
		return routerState.isActiveIntent(routeName, contexts, queryParams);
	}
};
RoutingService.reopen({
	targetState: readOnly("router.targetState"),
	currentState: readOnly("router.currentState"),
	currentRouteName: readOnly("router.currentRouteName"),
	currentPath: readOnly("router.currentPath")
});
function numberOfContextsAcceptedByHandler(handlerName, handlerInfos) {
	let req = 0;
	for (let i = 0; i < handlerInfos.length; i++) {
		req += handlerInfos[i].names.length;
		if (handlerInfos[i].handler === handlerName) break;
	}
	return req;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/cache.js
/**
A two-tiered cache with support for fallback values when doing lookups.
Uses "buckets" and then "keys" to cache values.

@private
@class BucketCache
*/
var BucketCache = class {
	cache;
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
	}
	has(bucketKey) {
		return this.cache.has(bucketKey);
	}
	stash(bucketKey, key, value) {
		let bucket = this.cache.get(bucketKey);
		if (bucket === void 0) {
			bucket = /* @__PURE__ */ new Map();
			this.cache.set(bucketKey, bucket);
		}
		bucket.set(key, value);
	}
	lookup(bucketKey, prop, defaultValue) {
		if (!this.has(bucketKey)) return defaultValue;
		let bucket = this.cache.get(bucketKey);
		if (bucket.has(prop)) return bucket.get(prop);
		else return defaultValue;
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/outlet-DDxtxFLV.js
function instrumentationPayload(def) {
	return { object: `${def.name}:main` };
}
var CAPABILITIES$2 = {
	dynamicLayout: false,
	dynamicTag: false,
	prepareArgs: false,
	createArgs: false,
	attributeHook: false,
	elementHook: false,
	createCaller: false,
	dynamicScope: true,
	updateHook: false,
	createInstance: true,
	wrapped: false,
	willDestroy: false,
	hasSubOwner: false
};
var CAPABILITIES_MASK$1 = /*@__PURE__*/ capabilityFlagsFrom(CAPABILITIES$2);
var OutletComponentManager = class {
	create(_owner, definition, _args, env, dynamicScope) {
		let parentStateRef = dynamicScope.get("outletState");
		let currentStateRef = definition.ref;
		dynamicScope.set("outletState", currentStateRef);
		let state = { finalize: _instrumentStart("render.outlet", instrumentationPayload, definition) };
		if (env.debugRenderTree !== void 0) {
			let parentOwner = valueForRef(parentStateRef)?.render?.owner;
			let currentOwner = valueForRef(currentStateRef)?.render?.owner;
			if (parentOwner && parentOwner !== currentOwner) {
				let engineInstance = currentOwner;
				let { mountPoint } = engineInstance;
				if (mountPoint) state.engine = {
					mountPoint,
					instance: engineInstance
				};
			}
		}
		return state;
	}
	getDebugName({ name }) {
		return `{{outlet}} for ${name}`;
	}
	getDebugCustomRenderTree(_definition, state) {
		let nodes = [];
		nodes.push({
			bucket: state,
			type: "outlet",
			name: "main",
			args: EMPTY_ARGS,
			instance: void 0
		});
		if (state.engine) nodes.push({
			bucket: state.engine,
			type: "engine",
			name: state.engine.mountPoint,
			args: EMPTY_ARGS,
			instance: state.engine.instance
		});
		return nodes;
	}
	getCapabilities() {
		return CAPABILITIES$2;
	}
	getSelf() {
		return UNDEFINED_REFERENCE;
	}
	didCreate() {}
	didUpdate() {}
	didRenderLayout(state) {
		state.finalize();
	}
	didUpdateLayout() {}
	getDestroyable() {
		return null;
	}
};
var OUTLET_MANAGER = /*@__PURE__*/ new OutletComponentManager();
var OUTLET_COMPONENT_TEMPLATE = templateFactory({
	"id": null,
	"block": "[[[8,[30,1],null,[[\"@controller\",\"@model\"],[[30,2],[30,3]]],null]],[\"@Component\",\"@controller\",\"@model\"],[]]",
	"moduleName": "(unknown template module)",
	"isStrictMode": true
});
var OutletComponent = class {
	handle = -1;
	resolvedName = null;
	manager = OUTLET_MANAGER;
	capabilities = CAPABILITIES_MASK$1;
	compilable;
	constructor(owner, state) {
		this.state = state;
		this.compilable = unwrapTemplate(OUTLET_COMPONENT_TEMPLATE(owner)).asLayout();
	}
};
function createRootOutlet(outletView) {
	return new OutletComponent(outletView.owner, outletView.state);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/application/namespace.js
var namespace_exports = /* @__PURE__ */ __exportAll({ default: () => Namespace });
/**
@module @ember/application/namespace
*/
/**
A Namespace is an object usually used to contain other objects or methods
such as an application or framework. Create a namespace anytime you want
to define one of these new containers.

## Example Usage

```javascript
import Namespace from '@ember/application/namespace';
MyFramework = Namespace.create({
VERSION: '1.0.0'
});
```

@class Namespace
@extends EmberObject
@public
*/
var Namespace = class extends EmberObject {
	static NAMESPACES = NAMESPACES;
	static NAMESPACES_BY_ID = NAMESPACES_BY_ID;
	static processAll = processAllNamespaces;
	static byName = findNamespace;
	init(properties) {
		super.init(properties);
		addNamespace(this);
	}
	toString() {
		let existing_name = get(this, "name") || get(this, "modulePrefix");
		if (existing_name) return existing_name;
		findNamespaces();
		let name = getName(this);
		if (name === void 0) {
			name = guidFor(this);
			setName(this, name);
		}
		return name;
	}
	nameClasses() {
		processNamespace(this);
	}
	destroy() {
		removeNamespace(this);
		return super.destroy();
	}
};
Namespace.prototype.isNamespace = true;
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/dag-map/index.js
/**
* A topologically ordered map of key/value pairs with a simple API for adding constraints.
*
* Edges can forward reference keys that have not been added yet (the forward reference will
* map the key to undefined).
*/
var DAG = function() {
	function DAG() {
		this._vertices = new Vertices();
	}
	/**
	* Adds a key/value pair with dependencies on other key/value pairs.
	*
	* @public
	* @param key    The key of the vertex to be added.
	* @param value  The value of that vertex.
	* @param before A key or array of keys of the vertices that must
	*               be visited before this vertex.
	* @param after  An string or array of strings with the keys of the
	*               vertices that must be after this vertex is visited.
	*/
	DAG.prototype.add = function(key, value, before, after) {
		if (!key) throw new Error("argument `key` is required");
		var vertices = this._vertices;
		var v = vertices.add(key);
		v.val = value;
		if (before) {
			if (typeof before === "string") vertices.addEdge(v, vertices.add(before));
			else for (var i = 0; i < before.length; i++) vertices.addEdge(v, vertices.add(before[i]));
		}
		if (after) {
			if (typeof after === "string") vertices.addEdge(vertices.add(after), v);
			else for (var i = 0; i < after.length; i++) vertices.addEdge(vertices.add(after[i]), v);
		}
	};
	/**
	* @deprecated please use add.
	*/
	DAG.prototype.addEdges = function(key, value, before, after) {
		this.add(key, value, before, after);
	};
	/**
	* Visits key/value pairs in topological order.
	*
	* @public
	* @param callback The function to be invoked with each key/value.
	*/
	DAG.prototype.each = function(callback) {
		this._vertices.walk(callback);
	};
	/**
	* @deprecated please use each.
	*/
	DAG.prototype.topsort = function(callback) {
		this.each(callback);
	};
	return DAG;
}();
/** @private */
var Vertices = function() {
	function Vertices() {
		this.length = 0;
		this.stack = new IntStack();
		this.path = new IntStack();
		this.result = new IntStack();
	}
	Vertices.prototype.add = function(key) {
		if (!key) throw new Error("missing key");
		var l = this.length | 0;
		var vertex;
		for (var i = 0; i < l; i++) {
			vertex = this[i];
			if (vertex.key === key) return vertex;
		}
		this.length = l + 1;
		return this[l] = {
			idx: l,
			key,
			val: void 0,
			out: false,
			flag: false,
			length: 0
		};
	};
	Vertices.prototype.addEdge = function(v, w) {
		this.check(v, w.key);
		var l = w.length | 0;
		for (var i = 0; i < l; i++) if (w[i] === v.idx) return;
		w.length = l + 1;
		w[l] = v.idx;
		v.out = true;
	};
	Vertices.prototype.walk = function(cb) {
		this.reset();
		for (var i = 0; i < this.length; i++) {
			var vertex = this[i];
			if (vertex.out) continue;
			this.visit(vertex, "");
		}
		this.each(this.result, cb);
	};
	Vertices.prototype.check = function(v, w) {
		if (v.key === w) throw new Error("cycle detected: " + w + " <- " + w);
		if (v.length === 0) return;
		for (var i = 0; i < v.length; i++) if (this[v[i]].key === w) throw new Error("cycle detected: " + w + " <- " + v.key + " <- " + w);
		this.reset();
		this.visit(v, w);
		if (this.path.length > 0) {
			var msg_1 = "cycle detected: " + w;
			this.each(this.path, function(key) {
				msg_1 += " <- " + key;
			});
			throw new Error(msg_1);
		}
	};
	Vertices.prototype.reset = function() {
		this.stack.length = 0;
		this.path.length = 0;
		this.result.length = 0;
		for (var i = 0, l = this.length; i < l; i++) this[i].flag = false;
	};
	Vertices.prototype.visit = function(start, search) {
		var _a = this, stack = _a.stack, path = _a.path, result = _a.result;
		stack.push(start.idx);
		while (stack.length) {
			var index = stack.pop() | 0;
			if (index >= 0) {
				var vertex = this[index];
				if (vertex.flag) continue;
				vertex.flag = true;
				path.push(index);
				if (search === vertex.key) break;
				stack.push(~index);
				this.pushIncoming(vertex);
			} else {
				path.pop();
				result.push(~index);
			}
		}
	};
	Vertices.prototype.pushIncoming = function(incomming) {
		var stack = this.stack;
		for (var i = incomming.length - 1; i >= 0; i--) {
			var index = incomming[i];
			if (!this[index].flag) stack.push(index);
		}
	};
	Vertices.prototype.each = function(indices, cb) {
		for (var i = 0, l = indices.length; i < l; i++) {
			var vertex = this[indices[i]];
			cb(vertex.key, vertex.val);
		}
	};
	return Vertices;
}();
/** @private */
var IntStack = function() {
	function IntStack() {
		this.length = 0;
	}
	IntStack.prototype.push = function(n) {
		this[this.length++] = n | 0;
	};
	IntStack.prototype.pop = function() {
		return this[--this.length] | 0;
	};
	return IntStack;
}();
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/debug/container-debug-adapter.js
/**
@module @ember/debug/container-debug-adapter
*/
/**
The `ContainerDebugAdapter` helps the container and resolver interface
with tools that debug Ember such as the
[Ember Inspector](https://github.com/emberjs/ember-inspector)
for Chrome and Firefox.

This class can be extended by a custom resolver implementer
to override some of the methods with library-specific code.

The methods likely to be overridden are:

* `canCatalogEntriesByType`
* `catalogEntriesByType`

The adapter will need to be registered
in the application's container as `container-debug-adapter:main`.

Example:

```javascript
Application.initializer({
name: "containerDebugAdapter",

initialize(application) {
application.register('container-debug-adapter:main', require('app/container-debug-adapter'));
}
});
```

@class ContainerDebugAdapter
@extends EmberObject
@since 1.5.0
@public
*/
var ContainerDebugAdapter = class extends EmberObject {
	constructor(owner) {
		super(owner);
		this.resolver = getOwner$1(this).lookup("resolver-for-debugging:main");
	}
	/**
	The resolver instance of the application
	being debugged. This property will be injected
	on creation.
	@property resolver
	@public
	*/
	resolver;
	/**
	Returns true if it is possible to catalog a list of available
	classes in the resolver for a given type.
	@method canCatalogEntriesByType
	@param {String} type The type. e.g. "model", "controller", "route".
	@return {boolean} whether a list is available for this type.
	@public
	*/
	canCatalogEntriesByType(type) {
		if (type === "model" || type === "template") return false;
		return true;
	}
	/**
	Returns the available classes a given type.
	@method catalogEntriesByType
	@param {String} type The type. e.g. "model", "controller", "route".
	@return {Array} An array of strings.
	@public
	*/
	catalogEntriesByType(type) {
		let namespaces = Namespace.NAMESPACES;
		let types = [];
		let typeSuffixRegex = new RegExp(`${classify(type)}$`);
		namespaces.forEach((namespace) => {
			for (let key in namespace) {
				if (!Object.prototype.hasOwnProperty.call(namespace, key)) continue;
				if (typeSuffixRegex.test(key)) {
					let klass = namespace[key];
					if (typeOf(klass) === "class") types.push(dasherize$1(key.replace(typeSuffixRegex, "")));
				}
			}
		});
		return types;
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/rehydrate-builder-n_8RCUj9.js
var SERIALIZATION_FIRST_NODE_STRING = "%+b:0%";
function isSerializationFirstNode(node) {
	return node.nodeValue === SERIALIZATION_FIRST_NODE_STRING;
}
var RehydratingCursor = class extends CursorImpl {
	candidate = null;
	openBlockDepth;
	injectedOmittedNode = false;
	constructor(element, nextSibling, startingBlockDepth) {
		super(element, nextSibling);
		this.startingBlockDepth = startingBlockDepth;
		this.openBlockDepth = startingBlockDepth - 1;
	}
};
var RehydrateTree = class extends NewTreeBuilder {
	unmatchedAttributes = null;
	blockDepth = 0;
	startingBlockOffset;
	constructor(env, parentNode, nextSibling) {
		super(env, parentNode, nextSibling);
		if (nextSibling) throw new Error("Rehydration with nextSibling not supported");
		let node = this.currentCursor.element.firstChild;
		while (node !== null) {
			if (isOpenBlock(node)) break;
			node = node.nextSibling;
		}
		this.candidate = node;
		const startingBlockOffset = getBlockDepth(node);
		if (startingBlockOffset !== 0) {
			const newBlockDepth = startingBlockOffset - 1;
			const newCandidate = this.dom.createComment(`%+b:${newBlockDepth}%`);
			node.parentNode.insertBefore(newCandidate, this.candidate);
			let closingNode = node.nextSibling;
			while (closingNode !== null) {
				if (isCloseBlock(closingNode) && getBlockDepth(closingNode) === startingBlockOffset) break;
				closingNode = closingNode.nextSibling;
			}
			const newClosingBlock = this.dom.createComment(`%-b:${newBlockDepth}%`);
			node.parentNode.insertBefore(newClosingBlock, closingNode.nextSibling);
			this.candidate = newCandidate;
			this.startingBlockOffset = newBlockDepth;
		} else this.startingBlockOffset = 0;
	}
	get currentCursor() {
		return this.cursors.current;
	}
	get candidate() {
		if (this.currentCursor) return this.currentCursor.candidate;
		return null;
	}
	set candidate(node) {
		const currentCursor = this.currentCursor;
		currentCursor.candidate = node;
	}
	disableRehydration(nextSibling) {
		const currentCursor = this.currentCursor;
		currentCursor.candidate = null;
		currentCursor.nextSibling = nextSibling;
	}
	enableRehydration(candidate) {
		const currentCursor = this.currentCursor;
		currentCursor.candidate = candidate;
		currentCursor.nextSibling = null;
	}
	pushElement(element, nextSibling = null) {
		const cursor = new RehydratingCursor(element, nextSibling, this.blockDepth || 0);
		/**
		* <div>   <---------------  currentCursor.element
		*   <!--%+b:1%--> <-------  would have been removed during openBlock
		*   <div> <---------------  currentCursor.candidate -> cursor.element
		*     <!--%+b:2%--> <-----  currentCursor.candidate.firstChild -> cursor.candidate
		*     Foo
		*     <!--%-b:2%-->
		*   </div>
		*   <!--%-b:1%-->  <------  becomes currentCursor.candidate
		*/
		if (this.candidate !== null) {
			cursor.candidate = element.firstChild;
			this.candidate = element.nextSibling;
		}
		this.cursors.push(cursor);
	}
	clearMismatch(candidate) {
		let current = candidate;
		const currentCursor = this.currentCursor;
		if (currentCursor !== null) {
			const openBlockDepth = currentCursor.openBlockDepth;
			if (openBlockDepth >= currentCursor.startingBlockDepth) while (current) {
				if (isCloseBlock(current)) {
					if (openBlockDepth >= getBlockDepthWithOffset(current, this.startingBlockOffset)) break;
				}
				current = this.remove(current);
			}
			else while (current !== null) current = this.remove(current);
			this.disableRehydration(current);
		}
	}
	__openBlock() {
		const { currentCursor } = this;
		if (currentCursor === null) return;
		const blockDepth = this.blockDepth;
		this.blockDepth++;
		const { candidate } = currentCursor;
		if (candidate === null) return;
		const { tagName } = currentCursor.element;
		if (isOpenBlock(candidate) && getBlockDepthWithOffset(candidate, this.startingBlockOffset) === blockDepth) {
			this.candidate = this.remove(candidate);
			currentCursor.openBlockDepth = blockDepth;
		} else if (tagName !== "TITLE" && tagName !== "SCRIPT" && tagName !== "STYLE") this.clearMismatch(candidate);
	}
	__closeBlock() {
		const { currentCursor } = this;
		if (currentCursor === null) return;
		const openBlockDepth = currentCursor.openBlockDepth;
		this.blockDepth--;
		const { candidate } = currentCursor;
		let isRehydrating = false;
		if (candidate !== null) {
			isRehydrating = true;
			if (isCloseBlock(candidate) && getBlockDepthWithOffset(candidate, this.startingBlockOffset) === openBlockDepth) {
				const nextSibling = this.remove(candidate);
				this.candidate = nextSibling;
				currentCursor.openBlockDepth--;
			} else {
				this.clearMismatch(candidate);
				isRehydrating = false;
			}
		}
		if (!isRehydrating) {
			const nextSibling = currentCursor.nextSibling;
			if (nextSibling !== null && isCloseBlock(nextSibling) && getBlockDepthWithOffset(nextSibling, this.startingBlockOffset) === this.blockDepth) {
				const candidate = this.remove(nextSibling);
				this.enableRehydration(candidate);
				currentCursor.openBlockDepth--;
			}
		}
	}
	__appendNode(node) {
		const { candidate } = this;
		if (candidate) return candidate;
		else return super.__appendNode(node);
	}
	__appendHTML(html) {
		const candidateBounds = this.markerBounds();
		if (candidateBounds) {
			const first = candidateBounds.firstNode();
			const last = candidateBounds.lastNode();
			const newBounds = new ConcreteBounds(this.element, first.nextSibling, last.previousSibling);
			const possibleEmptyMarker = this.remove(first);
			this.remove(last);
			if (possibleEmptyMarker !== null && isEmpty(possibleEmptyMarker)) {
				this.candidate = this.remove(possibleEmptyMarker);
				if (this.candidate !== null) this.clearMismatch(this.candidate);
			}
			return newBounds;
		} else return super.__appendHTML(html);
	}
	remove(node) {
		const element = expect(node.parentNode);
		const next = node.nextSibling;
		element.removeChild(node);
		return next;
	}
	markerBounds() {
		const _candidate = this.candidate;
		if (_candidate && isMarker(_candidate)) {
			const first = _candidate;
			let last = expect(first.nextSibling);
			while (!isMarker(last)) last = expect(last.nextSibling);
			return new ConcreteBounds(this.element, first, last);
		} else return null;
	}
	__appendText(string) {
		const { candidate } = this;
		if (candidate) {
			if (isTextNode(candidate)) {
				if (candidate.nodeValue !== string) candidate.nodeValue = string;
				this.candidate = candidate.nextSibling;
				return candidate;
			} else if (isSeparator(candidate)) {
				this.candidate = this.remove(candidate);
				return this.__appendText(string);
			} else if (isEmpty(candidate) && string === "") {
				this.candidate = this.remove(candidate);
				return this.__appendText(string);
			} else {
				this.clearMismatch(candidate);
				return super.__appendText(string);
			}
		} else return super.__appendText(string);
	}
	__appendComment(string) {
		const _candidate = this.candidate;
		if (_candidate && isComment(_candidate)) {
			if (_candidate.nodeValue !== string) _candidate.nodeValue = string;
			this.candidate = _candidate.nextSibling;
			return _candidate;
		} else if (_candidate) this.clearMismatch(_candidate);
		return super.__appendComment(string);
	}
	__openElement(tag) {
		const _candidate = this.candidate;
		if (_candidate && isElement(_candidate) && isSameNodeType(_candidate, tag)) {
			this.unmatchedAttributes = [].slice.call(_candidate.attributes);
			return _candidate;
		} else if (_candidate) {
			if (isElement(_candidate) && _candidate.tagName === "TBODY") {
				this.pushElement(_candidate, null);
				this.currentCursor.injectedOmittedNode = true;
				return this.__openElement(tag);
			}
			this.clearMismatch(_candidate);
		}
		return super.__openElement(tag);
	}
	__setAttribute(name, value, namespace) {
		const unmatched = this.unmatchedAttributes;
		if (unmatched) {
			const attr = findByName(unmatched, name);
			if (attr) {
				if (attr.value !== value) attr.value = value;
				unmatched.splice(unmatched.indexOf(attr), 1);
				return;
			}
		}
		return super.__setAttribute(name, value, namespace);
	}
	__setProperty(name, value) {
		const unmatched = this.unmatchedAttributes;
		if (unmatched) {
			const attr = findByName(unmatched, name);
			if (attr) {
				if (attr.value !== value) attr.value = value;
				unmatched.splice(unmatched.indexOf(attr), 1);
				return;
			}
		}
		return super.__setProperty(name, value);
	}
	__flushElement(parent, constructing) {
		const { unmatchedAttributes: unmatched } = this;
		if (unmatched) {
			for (const attr of unmatched) this.constructing.removeAttribute(attr.name);
			this.unmatchedAttributes = null;
		} else super.__flushElement(parent, constructing);
	}
	willCloseElement() {
		const { candidate, currentCursor } = this;
		if (candidate !== null) this.clearMismatch(candidate);
		if (currentCursor && currentCursor.injectedOmittedNode) this.popElement();
		super.willCloseElement();
	}
	getMarker(element, guid) {
		const marker = element.querySelector(`script[glmr="${guid}"]`);
		if (marker) return castToSimple(marker);
		return null;
	}
	__pushRemoteElement(element, cursorId, insertBefore) {
		const marker = this.getMarker(castToBrowser(element), cursorId);
		assert(!marker || marker.parentNode === element);
		if (insertBefore === void 0) {
			while (element.firstChild !== null && element.firstChild !== marker) this.remove(element.firstChild);
			insertBefore = null;
		}
		const cursor = new RehydratingCursor(element, null, this.blockDepth);
		this.cursors.push(cursor);
		if (marker === null) this.disableRehydration(insertBefore);
		else this.candidate = this.remove(marker);
		const block = new RemoteBlock(element);
		return this.pushBlock(block, true);
	}
	didAppendBounds(bounds) {
		super.didAppendBounds(bounds);
		if (this.candidate) {
			const last = bounds.lastNode();
			this.candidate = last.nextSibling;
		}
		return bounds;
	}
};
function isTextNode(node) {
	return node.nodeType === 3;
}
function isComment(node) {
	return node.nodeType === 8;
}
function isOpenBlock(node) {
	return node.nodeType === 8 && node.nodeValue.lastIndexOf("%+b:", 0) === 0;
}
function isCloseBlock(node) {
	return node.nodeType === 8 && node.nodeValue.lastIndexOf("%-b:", 0) === 0;
}
function getBlockDepth(node) {
	return parseInt(node.nodeValue.slice(4), 10);
}
function getBlockDepthWithOffset(node, offset) {
	return getBlockDepth(node) - offset;
}
function isElement(node) {
	return node.nodeType === 1;
}
function isMarker(node) {
	return node.nodeType === 8 && node.nodeValue === "%glmr%";
}
function isSeparator(node) {
	return node.nodeType === 8 && node.nodeValue === "%|%";
}
function isEmpty(node) {
	return node.nodeType === 8 && node.nodeValue === "% %";
}
function isSameNodeType(candidate, tag) {
	if (candidate.namespaceURI === "http://www.w3.org/2000/svg") return candidate.tagName === tag;
	return candidate.tagName === tag.toUpperCase();
}
function findByName(array, name) {
	for (const attr of array) if (attr.name === name) return attr;
}
function rehydrationBuilder(env, cursor) {
	return RehydrateTree.forInitialRender(env, cursor);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/serialize-builder-CsG9WHVw.js
var TEXT_NODE = 3;
var NEEDS_EXTRA_CLOSE = /* @__PURE__ */ new WeakMap();
function currentNode(cursor) {
	let { element, nextSibling } = cursor;
	if (nextSibling === null) return element.lastChild;
	else return nextSibling.previousSibling;
}
var SerializeBuilder = class extends NewTreeBuilder {
	serializeBlockDepth = 0;
	__openBlock() {
		let { tagName } = this.element;
		if (tagName !== "TITLE" && tagName !== "SCRIPT" && tagName !== "STYLE") {
			let depth = this.serializeBlockDepth++;
			this.__appendComment(`%+b:${depth}%`);
		}
		super.__openBlock();
	}
	__closeBlock() {
		let { tagName } = this.element;
		super.__closeBlock();
		if (tagName !== "TITLE" && tagName !== "SCRIPT" && tagName !== "STYLE") {
			let depth = --this.serializeBlockDepth;
			this.__appendComment(`%-b:${depth}%`);
		}
	}
	__appendHTML(html) {
		let { tagName } = this.element;
		if (tagName === "TITLE" || tagName === "SCRIPT" || tagName === "STYLE") return super.__appendHTML(html);
		let first = this.__appendComment("%glmr%");
		if (tagName === "TABLE") {
			let openIndex = html.indexOf("<");
			if (openIndex > -1) {
				if (html.slice(openIndex + 1, openIndex + 3) === "tr") html = `<tbody>${html}</tbody>`;
			}
		}
		if (html === "") this.__appendComment("% %");
		else super.__appendHTML(html);
		let last = this.__appendComment("%glmr%");
		return new ConcreteBounds(this.element, first, last);
	}
	__appendText(string) {
		let { tagName } = this.element;
		let current = currentNode(this);
		if (tagName === "TITLE" || tagName === "SCRIPT" || tagName === "STYLE") return super.__appendText(string);
		else if (string === "") return this.__appendComment("% %");
		else if (current && current.nodeType === TEXT_NODE) this.__appendComment("%|%");
		return super.__appendText(string);
	}
	closeElement() {
		if (NEEDS_EXTRA_CLOSE.has(this.element)) {
			NEEDS_EXTRA_CLOSE.delete(this.element);
			super.closeElement();
		}
		return super.closeElement();
	}
	openElement(tag) {
		if (tag === "tr") {
			if (this.element.tagName !== "TBODY" && this.element.tagName !== "THEAD" && this.element.tagName !== "TFOOT") {
				this.openElement("tbody");
				NEEDS_EXTRA_CLOSE.set(this.constructing, true);
				this.flushElement(null);
			}
		}
		return super.openElement(tag);
	}
	pushRemoteElement(element, cursorId, insertBefore = null) {
		let { dom } = this;
		let script = dom.createElement("script");
		script.setAttribute("glmr", cursorId);
		dom.insertBefore(element, script, insertBefore);
		return super.pushRemoteElement(element, cursorId, insertBefore);
	}
};
function serializeBuilder(env, cursor) {
	return SerializeBuilder.forInitialRender(env, cursor);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/setup-registry-CRFWTdVC.js
var RootTemplate = templateFactory({
	"id": null,
	"block": "[[[46,[30,0],null,null,null]],[],[\"component\"]]",
	"moduleName": "packages/@ember/-internals/glimmer/lib/templates/root.hbs",
	"isStrictMode": true
});
var RootComponentManager = class extends CurlyComponentManager {
	component;
	constructor(component) {
		super();
		this.component = component;
	}
	create(_owner, _state, _args, { isInteractive }, dynamicScope) {
		let component = this.component;
		let finalizer = _instrumentStart("render.component", initialRenderInstrumentDetails, component);
		dynamicScope.view = component;
		let hasWrappedElement = component.tagName !== "";
		if (!hasWrappedElement) {
			if (isInteractive) component.trigger("willRender");
			component._transitionTo("hasElement");
			if (isInteractive) component.trigger("willInsertElement");
		}
		let bucket = new ComponentStateBucket(component, null, CONSTANT_TAG, finalizer, hasWrappedElement, isInteractive);
		consumeTag(component[DIRTY_TAG$1]);
		return bucket;
	}
};
var ROOT_CAPABILITIES = {
	dynamicLayout: true,
	dynamicTag: true,
	prepareArgs: false,
	createArgs: false,
	attributeHook: true,
	elementHook: true,
	createCaller: true,
	dynamicScope: true,
	updateHook: true,
	createInstance: true,
	wrapped: true,
	willDestroy: false,
	hasSubOwner: false
};
var RootComponentDefinition = class {
	handle = -1;
	resolvedName = "-top-level";
	state;
	manager;
	capabilities = capabilityFlagsFrom(ROOT_CAPABILITIES);
	compilable = null;
	constructor(component) {
		this.manager = new RootComponentManager(component);
		let factory = getFactoryFor(component);
		this.state = factory;
	}
};
var CAPABILITIES$1 = {
	dynamicLayout: true,
	dynamicTag: false,
	prepareArgs: false,
	createArgs: true,
	attributeHook: false,
	elementHook: false,
	createCaller: true,
	dynamicScope: true,
	updateHook: true,
	createInstance: true,
	wrapped: false,
	willDestroy: false,
	hasSubOwner: true
};
var MountManager = class {
	getDynamicLayout(state) {
		let templateFactory = state.engine.lookup("template:application");
		return unwrapTemplate(templateFactory(state.engine)).asLayout();
	}
	getCapabilities() {
		return CAPABILITIES$1;
	}
	getOwner(state) {
		return state.engine;
	}
	create(owner, { name }, args, env) {
		let engine = owner.buildChildEngineInstance(name);
		engine.boot();
		let controllerFactory = engine.factoryFor(`controller:application`) || generateControllerFactory(engine, "application");
		let controller;
		let self;
		let bucket;
		let modelRef;
		if (args.named.has("model")) modelRef = args.named.get("model");
		if (modelRef === void 0) {
			controller = controllerFactory.create();
			self = createConstRef(controller);
			bucket = {
				engine,
				controller,
				self,
				modelRef
			};
		} else {
			let model = valueForRef(modelRef);
			controller = controllerFactory.create({ model });
			self = createConstRef(controller);
			bucket = {
				engine,
				controller,
				self,
				modelRef
			};
		}
		if (env.debugRenderTree) associateDestroyableChild(engine, controller);
		return bucket;
	}
	getDebugName({ name }) {
		return name;
	}
	getDebugCustomRenderTree(definition, state, args) {
		return [{
			bucket: state.engine,
			instance: state.engine,
			type: "engine",
			name: definition.name,
			args
		}, {
			bucket: state.controller,
			instance: state.controller,
			type: "route-template",
			name: "application",
			args
		}];
	}
	getSelf({ self }) {
		return self;
	}
	getDestroyable(bucket) {
		return bucket.engine;
	}
	didCreate() {}
	didUpdate() {}
	didRenderLayout() {}
	didUpdateLayout() {}
	update(bucket) {
		let { controller, modelRef } = bucket;
		if (modelRef !== void 0) controller.set("model", valueForRef(modelRef));
	}
};
var MOUNT_MANAGER = /*@__PURE__*/ new MountManager();
var MountDefinition = class {
	handle = -1;
	state;
	manager = MOUNT_MANAGER;
	compilable = null;
	capabilities = capabilityFlagsFrom(CAPABILITIES$1);
	constructor(resolvedName) {
		this.resolvedName = resolvedName;
		this.state = { name: resolvedName };
	}
};
/**
@module @ember/helper
*/
/**
The `{{mount}}` helper lets you embed a routeless engine in a template.
Mounting an engine will cause an instance to be booted and its `application`
template to be rendered.

For example, the following template mounts the `ember-chat` engine:

```gjs {data-filename="app/templates/application.gjs"}
{{mount "ember-chat"}}
```

Additionally, you can also pass in a `model` argument that will be
set as the engines model. This can be an existing object:

```hbs
<div>
{{mount 'admin' model=userSettings}}
</div>
```

Or an inline `hash`, and you can even pass components:

```gjs
import SignInButton from '../components/sign-in-button';
<template>
<div>
<h1>Application template!</h1>
{{mount 'admin' model=(hash
title='Secret Admin'
signInButton=SignInButton
)}}
</div>
</template>
```

`mount` is built-in and does not need to be imported.

@method mount
@param {String} name Name of the engine to mount.
@param {Object} [model] Object that will be set as
the model of the engine.
@for Keywords
@static
@noimport
@public
*/
var mountHelper = /*@__PURE__*/ internalHelper((args, owner) => {
	let nameRef = args.positional[0];
	let captured;
	captured = createCapturedArgs(args.named, EMPTY_POSITIONAL);
	let lastName, lastDef;
	return createComputeRef(() => {
		let name = valueForRef(nameRef);
		if (typeof name === "string") {
			if (lastName === name) return lastDef;
			lastName = name;
			lastDef = curry(0, new MountDefinition(name), owner, captured, true);
			return lastDef;
		} else {
			lastDef = null;
			lastName = null;
			return null;
		}
	});
});
var CAPABILITIES = {
	dynamicLayout: false,
	dynamicTag: false,
	prepareArgs: false,
	createArgs: true,
	attributeHook: false,
	elementHook: false,
	createCaller: false,
	dynamicScope: false,
	updateHook: false,
	createInstance: true,
	wrapped: false,
	willDestroy: false,
	hasSubOwner: false
};
var CAPABILITIES_MASK = /*@__PURE__*/ capabilityFlagsFrom(CAPABILITIES);
var RouteTemplateManager = class {
	create(_owner, _definition, args) {
		let self = args.named.get("controller");
		return {
			self,
			controller: valueForRef(self)
		};
	}
	getSelf({ self }) {
		return self;
	}
	getDebugName({ name }) {
		return `route-template (${name})`;
	}
	getDebugCustomRenderTree({ name }, state, args) {
		return [{
			bucket: state,
			type: "route-template",
			name,
			args,
			instance: state.controller
		}];
	}
	getCapabilities() {
		return CAPABILITIES;
	}
	didRenderLayout() {}
	didUpdateLayout() {}
	didCreate() {}
	didUpdate() {}
	getDestroyable() {
		return null;
	}
};
var ROUTE_TEMPLATE_MANAGER = /*@__PURE__*/ new RouteTemplateManager();
/**
* This "upgrades" a route template into a invocable component. Conceptually
* it can be 1:1 for each unique `Template`, but it's also cheap to construct,
* so unless the stability is desirable for other reasons, it's probably not
* worth caching this.
*/
var RouteTemplate = class {
	handle = -1;
	resolvedName;
	state;
	manager = ROUTE_TEMPLATE_MANAGER;
	capabilities = CAPABILITIES_MASK;
	compilable;
	constructor(name, template) {
		let unwrapped = unwrapTemplate(template);
		this.resolvedName = name;
		this.state = { name };
		this.compilable = unwrapped.asLayout();
	}
};
function makeRouteTemplate(owner, name, template) {
	let routeTemplate = new RouteTemplate(name, template);
	return curry(0, routeTemplate, owner, null, true);
}
/**
@module @ember/helper
*/
/**
The `{{outlet}}` helper lets you specify where a child route will render in
your template. An important use of the `{{outlet}}` helper is in your
application's `application.gjs` file:

```gjs {data-filename="app/templates/application.gjs"}
import MyHeader from '../components/my-header';
import MyFooter from '../components/my-footer';

<template>
<MyHeader />

<div class="my-dynamic-content">
<!-- this content will change based on the current route, which depends on the current URL -->
{{outlet}}
</div>

<MyFooter />
</template>
```

See the [routing guide](https://guides.emberjs.com/release/routing/rendering-a-template/) for more
information on how your `route` interacts with the `{{outlet}}` helper.
Note: Your content __will not render__ if there isn't an `{{outlet}}` for it.

`outlet` is built-in and does not need to be imported. 

@method outlet
@for Keywords
@static
@noimport
@public
*/
var outletHelper = /*@__PURE__*/ internalHelper((_args, owner, scope) => {
	let outletRef = createComputeRef(() => {
		return valueForRef(scope.get("outletState"))?.outlets?.main;
	});
	let lastState = null;
	let outlet = null;
	return createComputeRef(() => {
		let outletState = valueForRef(outletRef);
		let state = stateFor(outletRef, outletState);
		if (!isStable(state, lastState)) {
			lastState = state;
			if (state !== null) {
				let outletOwner = outletState?.render?.owner ?? owner;
				let named = dict();
				let template = state.template;
				let component;
				if (hasInternalComponentManager(template)) component = template;
				else component = makeRouteTemplate(outletOwner, state.name, template);
				named["Component"] = createConstRef(component);
				named["controller"] = createConstRef(state.controller);
				let modelRef = childRefFromParts(outletRef, ["render", "model"]);
				let model = valueForRef(modelRef);
				let outletController = state.controller;
				named["model"] = createComputeRef(() => {
					if (lastState === state) {
						if (valueForRef(outletRef)?.render?.controller === outletController) model = valueForRef(modelRef);
					}
					return model;
				});
				let args = createCapturedArgs(named, EMPTY_POSITIONAL);
				outlet = curry(0, new OutletComponent(owner, state), outletOwner, args, true);
			} else outlet = null;
		}
		return outlet;
	});
});
function stateFor(ref, outlet) {
	if (outlet === void 0) return null;
	let render = outlet.render;
	if (render === void 0) return null;
	let template = render.template;
	if (template === void 0 || template === null) return null;
	return {
		ref,
		name: render.name,
		template,
		controller: render.controller
	};
}
function isStable(state, lastState) {
	if (state === null || lastState === null) return false;
	return state.template === lastState.template && state.controller === lastState.controller;
}
var ROUTER_KEYWORD_HELPERS = {
	"-mount": mountHelper,
	"-outlet": outletHelper
};
/**
* The resolver used by the classic application `Renderer`. It extends the
* shared `ResolverImpl` with the keywords that require the router and engine
* infrastructure (`{{outlet}}` and `{{mount}}`). Keeping these out of the
* base resolver means renderers that have no router (e.g. `renderComponent`)
* do not pull the outlet/engine machinery into the build.
*/
var RouterResolver = class extends ResolverImpl {
	lookupBuiltInHelper(name) {
		return ROUTER_KEYWORD_HELPERS[name] ?? super.lookupBuiltInHelper(name);
	}
	lookupHelper(name, owner) {
		return ROUTER_KEYWORD_HELPERS[name] ?? super.lookupHelper(name, owner);
	}
};
var TOP_LEVEL_NAME = "-top-level";
var OutletView = class OutletView {
	static extend(injections) {
		return class extends OutletView {
			static create(options) {
				if (options) return super.create(Object.assign({}, injections, options));
				else return super.create(injections);
			}
		};
	}
	static reopenClass(injections) {
		Object.assign(this, injections);
	}
	static create(options) {
		let { environment: _environment, application: namespace, template: templateFactory } = options;
		let owner = getOwner$1(options);
		let template = templateFactory(owner);
		return new OutletView(_environment, owner, template, namespace);
	}
	ref;
	state;
	constructor(_environment, owner, template, namespace) {
		this._environment = _environment;
		this.owner = owner;
		this.template = template;
		this.namespace = namespace;
		let outletStateTag = createTag();
		let outletState = {
			outlets: { main: void 0 },
			render: {
				owner,
				name: TOP_LEVEL_NAME,
				controller: void 0,
				model: void 0,
				template
			}
		};
		let ref = this.ref = createComputeRef(() => {
			consumeTag(outletStateTag);
			return outletState;
		}, (state) => {
			DIRTY_TAG(outletStateTag);
			outletState.outlets["main"] = state;
		});
		this.state = {
			ref,
			name: TOP_LEVEL_NAME,
			template,
			controller: void 0
		};
	}
	appendTo(selector) {
		let target;
		if (this._environment.hasDOM) target = typeof selector === "string" ? document.querySelector(selector) : selector;
		else target = selector;
		let renderer = this.owner.lookup("renderer:-dom");
		schedule("render", renderer, "appendOutletView", this, target);
	}
	rerender() {}
	setOutletState(state) {
		updateRef(this.ref, state);
	}
	destroy() {}
};
var DynamicScope = class DynamicScope {
	constructor(view, outletState) {
		this.view = view;
		this.outletState = outletState;
	}
	child() {
		return new DynamicScope(this.view, this.outletState);
	}
	get(key) {
		return this.outletState;
	}
	set(key, value) {
		this.outletState = value;
		return value;
	}
};
var ClassicRootState = class {
	type = "classic";
	id;
	result;
	destroyed;
	render;
	env;
	constructor(root, context, owner, template, self, parentElement, dynamicScope, builder) {
		this.root = root;
		this.id = root instanceof OutletView ? guidFor(root) : getViewId(root);
		this.result = void 0;
		this.destroyed = false;
		this.env = context.env;
		this.render = errorLoopTransaction(() => {
			let layout = unwrapTemplate(template).asLayout();
			let iterator = renderMain(context, owner, self, builder(context.env, {
				element: parentElement,
				nextSibling: null
			}), layout, dynamicScope);
			let result = this.result = iterator.sync();
			associateDestroyableChild(this, result);
			this.render = errorLoopTransaction(() => {
				if (isDestroying(result) || isDestroyed(result)) return;
				return result.rerender({ alwaysRevalidate: false });
			});
		});
	}
	isFor(possibleRoot) {
		return this.root === possibleRoot;
	}
	destroy() {
		let { result, env } = this;
		this.destroyed = true;
		this.root = null;
		this.result = void 0;
		this.render = void 0;
		if (result !== void 0) inTransaction(env, () => destroy(result));
	}
};
var Renderer = class extends BaseRenderer {
	_rootTemplate;
	_viewRegistry;
	static create(props) {
		let { _viewRegistry } = props;
		let owner = getOwner$1(props);
		let document = owner.lookup("service:-document");
		let env = owner.lookup("-environment:main");
		let rootTemplate = owner.lookup(privatize`template:-root`);
		let builder = owner.lookup("service:-dom-builder");
		return new this(owner, document, env, rootTemplate, _viewRegistry, builder);
	}
	constructor(owner, document, env, rootTemplate, viewRegistry, builder = clientBuilder, resolver = new RouterResolver()) {
		super(owner, env, document, resolver, builder);
		this._rootTemplate = rootTemplate(owner);
		this._viewRegistry = viewRegistry || owner.lookup("-view-registry:main");
	}
	appendOutletView(view, target) {
		let outlet = createRootOutlet(view);
		let { name, template } = view.state;
		let named = dict();
		named["Component"] = createConstRef(makeRouteTemplate(view.owner, name, template));
		named["controller"] = UNDEFINED_REFERENCE;
		named["model"] = UNDEFINED_REFERENCE;
		let args = createCapturedArgs(named, EMPTY_POSITIONAL);
		this._appendDefinition(view, curry(0, outlet, view.owner, args, true), target);
	}
	appendTo(view, target) {
		let definition = new RootComponentDefinition(view);
		this._appendDefinition(view, curry(0, definition, this.state.owner, null, true), target);
	}
	_appendDefinition(root, definition, target) {
		let self = createConstRef(definition);
		let dynamicScope = new DynamicScope(null, UNDEFINED_REFERENCE);
		let rootState = new ClassicRootState(root, this.state.context, this.state.owner, this._rootTemplate, self, target, dynamicScope, this.state.builder);
		this.state.renderRoot(rootState, this);
	}
	cleanupRootFor(component) {
		if (isDestroyed(this)) return;
		let roots = this.state.roots;
		let i = roots.length;
		while (i--) {
			let root = roots[i];
			if (root.type === "classic" && root.isFor(component)) {
				root.destroy();
				roots.splice(i, 1);
			}
		}
	}
	remove(view) {
		view._transitionTo("destroying");
		this.cleanupRootFor(view);
		if (this.state.isInteractive) view.trigger("didDestroyElement");
	}
	get _roots() {
		return this.state.debug.roots;
	}
	get _inRenderTransaction() {
		return this.state.debug.inRenderTransaction;
	}
	get _isInteractive() {
		return this.state.debug.isInteractive;
	}
	get _context() {
		return this.state.context;
	}
	register(view) {
		let id = getViewId(view);
		this._viewRegistry[id] = view;
	}
	unregister(view) {
		delete this._viewRegistry[getViewId(view)];
	}
	getElement(component) {
		if (this._isInteractive) return getViewElement(component);
		else throw new Error("Accessing `this.element` is not allowed in non-interactive environments (such as FastBoot).");
	}
	getBounds(component) {
		let bounds = component[BOUNDS];
		return {
			parentElement: bounds.parentElement(),
			firstNode: bounds.firstNode(),
			lastNode: bounds.lastNode()
		};
	}
};
var OutletTemplate = templateFactory({
	"id": null,
	"block": "[[[46,[28,[32,0],null,null],null,null,null]],[],[\"component\"]]",
	"moduleName": "packages/@ember/-internals/glimmer/lib/templates/outlet.hbs",
	"scope": () => ({ outletHelper }),
	"isStrictMode": true
});
function setupApplicationRegistry(registry) {
	registry.register("service:-dom-builder", { create(props) {
		switch (getOwner$1(props).lookup("-environment:main")._renderMode) {
			case "serialize": return serializeBuilder.bind(null);
			case "rehydrate": return rehydrationBuilder.bind(null);
			default: return clientBuilder.bind(null);
		}
	} });
	registry.register(privatize`template:-root`, RootTemplate);
	registry.register("renderer:-dom", Renderer);
}
function setupEngineRegistry(registry) {
	registry.optionsForType("template", { instantiate: false });
	registry.register("view:-outlet", OutletView);
	registry.register("template:-outlet", OutletTemplate);
	registry.optionsForType("helper", { instantiate: false });
	registry.register("component:input", Input);
	registry.register("component:link-to", LinkTo);
	registry.register("component:textarea", Textarea);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/engine/lib/strict-resolver.js
var StrictResolver = class StrictResolver {
	moduleBasedResolver = true;
	#modules = /* @__PURE__ */ new Map();
	original;
	static create({ namespace }) {
		return new StrictResolver(namespace.modules);
	}
	constructor(modules) {
		this.addModules(modules);
	}
	addModules(modules) {
		for (let [moduleName, module] of Object.entries(modules)) this.#modules.set(this.#normalizeModule(moduleName), module);
	}
	#normalizeModule(moduleName) {
		return moduleName.replace(fileExtension, "").replace(leadingDotSlash, "");
	}
	#plural(word) {
		if (word === "config") return word;
		return word + "s";
	}
	resolve(fullName) {
		let [type, name] = fullName.split(":");
		name = this.#normalizeName(type, name);
		for (let strategy of [
			this.#resolveSelf,
			this.#mainLookup,
			this.#defaultLookup,
			this.#nestedColocationLookup
		]) {
			let result = strategy.call(this, type, name);
			if (result) return this.#extractDefaultExport(result.hit);
		}
	}
	#extractDefaultExport(module) {
		if (module && module["default"]) module = module["default"];
		return module;
	}
	normalize(fullName) {
		let [type, name] = fullName.split(":");
		name = this.#normalizeName(type, name);
		return `${type}:${name}`;
	}
	#normalizeName(type, name) {
		if (type === "component" || type === "helper" || type === "modifier" || type === "template" && name.indexOf("components/") === 0) return name.replace(/_/g, "-");
		else return dasherize(name.replace(/\./g, "/"));
	}
	#resolveSelf(type, name) {
		if (type === "resolver" && name === "current") return { hit: { create: () => this } };
	}
	#mainLookup(type, name) {
		if (name === "main") {
			let module = this.#modules.get(type);
			if (module) return { hit: module };
		}
	}
	#defaultLookup(type, name) {
		let target = `${this.#plural(type)}/${name}`;
		let module = this.#modules.get(target);
		if (module) return { hit: module };
	}
	#nestedColocationLookup(type, name) {
		if (type !== "component") return void 0;
		let target = `${this.#plural(type)}/${name}/index`;
		let module = this.#modules.get(target);
		if (module) return { hit: module };
	}
};
var fileExtension = /\.\w{1,4}$/;
var leadingDotSlash = /^\.\//;
var camelCaseBoundary = /([a-z\d])([A-Z])/g;
var spacesAndUnderscores = /[ _]/g;
function dasherize(str) {
	return str.replace(camelCaseBoundary, "$1_$2").toLowerCase().replace(spacesAndUnderscores, "-");
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/engine/index.js
function props(obj) {
	let properties = [];
	for (let key in obj) properties.push(key);
	return properties;
}
/**
@module @ember/engine
*/
/**
The `Engine` class contains core functionality for both applications and
engines.

Each engine manages a registry that's used for dependency injection and
exposed through `RegistryProxy`.

Engines also manage initializers and instance initializers.

Engines can spawn `EngineInstance` instances via `buildInstance()`.

@class Engine
@extends Ember.Namespace
@uses RegistryProxyMixin
@public
*/
var Engine = class extends Namespace.extend(RegistryProxyMixin) {
	static initializers = Object.create(null);
	static instanceInitializers = Object.create(null);
	/**
	The goal of initializers should be to register dependencies and injections.
	This phase runs once. Because these initializers may load code, they are
	allowed to defer application readiness and advance it. If you need to access
	the container or store you should use an InstanceInitializer that will be run
	after all initializers and therefore after all code is loaded and the app is
	ready.
	Initializer receives an object which has the following attributes:
	`name`, `before`, `after`, `initialize`. The only required attribute is
	`initialize`, all others are optional.
	* `name` allows you to specify under which name the initializer is registered.
	This must be a unique name, as trying to register two initializers with the
	same name will result in an error.
	```app/initializer/named-initializer.js
	import { debug } from '@ember/debug';
	export function initialize() {
	debug('Running namedInitializer!');
	}
	export default {
	name: 'named-initializer',
	initialize
	};
	```
	* `before` and `after` are used to ensure that this initializer is ran prior
	or after the one identified by the value. This value can be a single string
	or an array of strings, referencing the `name` of other initializers.
	An example of ordering initializers, we create an initializer named `first`:
	```app/initializer/first.js
	import { debug } from '@ember/debug';
	export function initialize() {
	debug('First initializer!');
	}
	export default {
	name: 'first',
	initialize
	};
	```
	```bash
	// DEBUG: First initializer!
	```
	We add another initializer named `second`, specifying that it should run
	after the initializer named `first`:
	```app/initializer/second.js
	import { debug } from '@ember/debug';
	export function initialize() {
	debug('Second initializer!');
	}
	export default {
	name: 'second',
	after: 'first',
	initialize
	};
	```
	```
	// DEBUG: First initializer!
	// DEBUG: Second initializer!
	```
	Afterwards we add a further initializer named `pre`, this time specifying
	that it should run before the initializer named `first`:
	```app/initializer/pre.js
	import { debug } from '@ember/debug';
	export function initialize() {
	debug('Pre initializer!');
	}
	export default {
	name: 'pre',
	before: 'first',
	initialize
	};
	```
	```bash
	// DEBUG: Pre initializer!
	// DEBUG: First initializer!
	// DEBUG: Second initializer!
	```
	Finally we add an initializer named `post`, specifying it should run after
	both the `first` and the `second` initializers:
	```app/initializer/post.js
	import { debug } from '@ember/debug';
	export function initialize() {
	debug('Post initializer!');
	}
	export default {
	name: 'post',
	after: ['first', 'second'],
	initialize
	};
	```
	```bash
	// DEBUG: Pre initializer!
	// DEBUG: First initializer!
	// DEBUG: Second initializer!
	// DEBUG: Post initializer!
	```
	* `initialize` is a callback function that receives one argument,
	`application`, on which you can operate.
	Example of using `application` to register an adapter:
	```app/initializer/api-adapter.js
	import ApiAdapter from '../utils/api-adapter';
	export function initialize(application) {
	application.register('api-adapter:main', ApiAdapter);
	}
	export default {
	name: 'post',
	after: ['first', 'second'],
	initialize
	};
	```
	@method initializer
	@param initializer {Object}
	@public
	*/
	static initializer = buildInitializerMethod("initializers");
	/**
	Instance initializers run after all initializers have run. Because
	instance initializers run after the app is fully set up. We have access
	to the store, container, and other items. However, these initializers run
	after code has loaded and are not allowed to defer readiness.
	Instance initializer receives an object which has the following attributes:
	`name`, `before`, `after`, `initialize`. The only required attribute is
	`initialize`, all others are optional.
	* `name` allows you to specify under which name the instanceInitializer is
	registered. This must be a unique name, as trying to register two
	instanceInitializer with the same name will result in an error.
	```app/initializer/named-instance-initializer.js
	import { debug } from '@ember/debug';
	export function initialize() {
	debug('Running named-instance-initializer!');
	}
	export default {
	name: 'named-instance-initializer',
	initialize
	};
	```
	* `before` and `after` are used to ensure that this initializer is ran prior
	or after the one identified by the value. This value can be a single string
	or an array of strings, referencing the `name` of other initializers.
	* See Application.initializer for discussion on the usage of before
	and after.
	Example instanceInitializer to preload data into the store.
	```app/initializer/preload-data.js
	export function initialize(application) {
	var userConfig, userConfigEncoded, store;
	// We have a HTML escaped JSON representation of the user's basic
	// configuration generated server side and stored in the DOM of the main
	// index.html file. This allows the app to have access to a set of data
	// without making any additional remote calls. Good for basic data that is
	// needed for immediate rendering of the page. Keep in mind, this data,
	// like all local models and data can be manipulated by the user, so it
	// should not be relied upon for security or authorization.
	// Grab the encoded data from the meta tag
	userConfigEncoded = document.querySelector('head meta[name=app-user-config]').attr('content');
	// Unescape the text, then parse the resulting JSON into a real object
	userConfig = JSON.parse(unescape(userConfigEncoded));
	// Lookup the store
	store = application.lookup('service:store');
	// Push the encoded JSON into the store
	store.pushPayload(userConfig);
	}
	export default {
	name: 'named-instance-initializer',
	initialize
	};
	```
	@method instanceInitializer
	@param instanceInitializer
	@public
	*/
	static instanceInitializer = buildInitializerMethod("instanceInitializers");
	/**
	This creates a registry with the default Ember naming conventions.
	It also configures the registry:
	* registered views are created every time they are looked up (they are
	not singletons)
	* registered templates are not factories; the registered value is
	returned directly.
	* the router receives the application as its `namespace` property
	* all controllers receive the router as their `target` and `controllers`
	properties
	* all controllers receive the application as their `namespace` property
	* the application view receives the application controller as its
	`controller` property
	* the application view receives the application template as its
	`defaultTemplate` property
	@method buildRegistry
	@static
	@param {Application} namespace the application for which to
	build the registry
	@return {Ember.Registry} the built registry
	@private
	*/
	static buildRegistry(namespace) {
		let registry = new Registry({ resolver: resolverFor(namespace) });
		registry.set = set;
		registry.register("application:main", namespace, { instantiate: false });
		commonSetupRegistry$1(registry);
		setupEngineRegistry(registry);
		return registry;
	}
	/**
	Set this to provide an alternate class to `DefaultResolver`
	@property resolver
	@public
	*/
	Resolver = StrictResolver;
	/**
	Set this to opt-in to using a strict resolver that will only return the
	given set of ES modules. The names of the modules should all be relative to
	the root of the app and start with "./"
	@property modules
	@public
	*/
	init(properties) {
		super.init(properties);
		this.buildRegistry();
	}
	/**
	A private flag indicating whether an engine's initializers have run yet.
	@private
	@property _initializersRan
	*/
	_initializersRan = false;
	/**
	Ensure that initializers are run once, and only once, per engine.
	@private
	@method ensureInitializers
	*/
	ensureInitializers() {
		if (!this._initializersRan) {
			this.runInitializers();
			this._initializersRan = true;
		}
	}
	/**
	Create an EngineInstance for this engine.
	@public
	@method buildInstance
	@return {EngineInstance} the engine instance
	*/
	buildInstance(options = {}) {
		this.ensureInitializers();
		return EngineInstance.create({
			...options,
			base: this
		});
	}
	/**
	Build and configure the registry for the current engine.
	@private
	@method buildRegistry
	@return {Ember.Registry} the configured registry
	*/
	buildRegistry() {
		return this.__registry__ = this.constructor.buildRegistry(this);
	}
	/**
	@private
	@method initializer
	*/
	initializer(initializer) {
		this.constructor.initializer(initializer);
	}
	/**
	@private
	@method instanceInitializer
	*/
	instanceInitializer(initializer) {
		this.constructor.instanceInitializer(initializer);
	}
	/**
	@private
	@method runInitializers
	*/
	runInitializers() {
		this._runInitializer("initializers", (name, initializer) => {
			initializer.initialize(this);
		});
	}
	/**
	@private
	@since 1.12.0
	@method runInstanceInitializers
	*/
	runInstanceInitializers(instance) {
		this._runInitializer("instanceInitializers", (name, initializer) => {
			initializer.initialize(instance);
		});
	}
	_runInitializer(bucketName, cb) {
		let initializersByName = get(this.constructor, bucketName);
		let initializers = props(initializersByName);
		let graph = new DAG();
		let initializer;
		for (let name of initializers) {
			initializer = initializersByName[name];
			graph.add(initializer.name, initializer, initializer.before, initializer.after);
		}
		graph.topsort(cb);
	}
};
/**
This function defines the default lookup rules for container lookups:

* templates are looked up on `Ember.TEMPLATES`
* other names are looked up on the application after classifying the name.
For example, `controller:post` looks up `App.PostController` by default.
* if the default lookup fails, look for registered classes on the container

This allows the application to register default injections in the container
that could be overridden by the normal naming convention.

@private
@method resolverFor
@param {Ember.Enginer} namespace the namespace to look for classes
@return {*} the resolved value for a given lookup
*/
function resolverFor(namespace) {
	let ResolverClass = namespace.Resolver;
	let props = { namespace };
	return ResolverClass.create(props);
}
/** @internal */
function buildInitializerMethod(bucketName, humanName) {
	return function(initializer) {
		let superclass = this.superclass;
		if (superclass[bucketName] !== void 0 && superclass[bucketName] === this[bucketName]) {
			let attrs = { [bucketName]: Object.create(this[bucketName]) };
			this.reopenClass(attrs);
		}
		let initializers = this[bucketName];
		initializers[initializer.name] = initializer;
	};
}
function commonSetupRegistry$1(registry) {
	registry.optionsForType("component", { singleton: false });
	registry.optionsForType("view", { singleton: false });
	registry.register("controller:basic", Controller, { instantiate: false });
	registry.register("service:-routing", RoutingService);
	registry.register("resolver-for-debugging:main", registry.resolver, { instantiate: false });
	registry.register("container-debug-adapter:main", ContainerDebugAdapter);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/application/index.js
var application_exports = /* @__PURE__ */ __exportAll({
	default: () => Application,
	getOwner: () => getOwner,
	setOwner: () => setOwner
});
/**
@module @ember/application
*/
/**
* @deprecated Use `import { getOwner } from '@ember/owner';` instead.
*/
var getOwner = getOwner$2;
/**
* @deprecated Use `import { setOwner } from '@ember/owner';` instead.
*/
var setOwner = setOwner$1;
/**
An instance of `Application` is the starting point for every Ember
application. It instantiates, initializes and coordinates the
objects that make up your app.

Each Ember app has one and only one `Application` object. Although
Ember CLI creates this object implicitly, the `Application` class
is defined in the `app/app.js`. You can define a `ready` method on the
`Application` class, which will be run by Ember when the application is
initialized.

```app/app.js
export default class App extends Application {
ready() {
// your code here
}
}
```

Because `Application` ultimately inherits from `Ember.Namespace`, any classes
you create will have useful string representations when calling `toString()`.
See the `Ember.Namespace` documentation for more information.

While you can think of your `Application` as a container that holds the
other classes in your application, there are several other responsibilities
going on under-the-hood that you may want to understand. It is also important
to understand that an `Application` is different from an `ApplicationInstance`.
Refer to the Guides to understand the difference between these.

### Event Delegation

Ember uses a technique called _event delegation_. This allows the framework
to set up a global, shared event listener instead of requiring each view to
do it manually. For example, instead of each view registering its own
`mousedown` listener on its associated element, Ember sets up a `mousedown`
listener on the `body`.

If a `mousedown` event occurs, Ember will look at the target of the event and
start walking up the DOM node tree, finding corresponding views and invoking
their `mouseDown` method as it goes.

`Application` has a number of default events that it listens for, as
well as a mapping from lowercase events to camel-cased view method names. For
example, the `keypress` event causes the `keyPress` method on the view to be
called, the `dblclick` event causes `doubleClick` to be called, and so on.

If there is a bubbling browser event that Ember does not listen for by
default, you can specify custom events and their corresponding view method
names by setting the application's `customEvents` property:

```app/app.js
import Application from '@ember/application';

export default class App extends Application {
customEvents = {
// add support for the paste event
paste: 'paste'
}
}
```

To prevent Ember from setting up a listener for a default event,
specify the event name with a `null` value in the `customEvents`
property:

```app/app.js
import Application from '@ember/application';

export default class App extends Application {
customEvents = {
// prevent listeners for mouseenter/mouseleave events
mouseenter: null,
mouseleave: null
}
}
```

By default, the application sets up these event listeners on the document
body. However, in cases where you are embedding an Ember application inside
an existing page, you may want it to set up the listeners on an element
inside the body.

For example, if only events inside a DOM element with the ID of `ember-app`
should be delegated, set your application's `rootElement` property:

```app/app.js
import Application from '@ember/application';

export default class App extends Application {
rootElement = '#ember-app'
}
```

The `rootElement` can be either a DOM element or a CSS selector
string. Note that *views appended to the DOM outside the root element will
not receive events.* If you specify a custom root element, make sure you only
append views inside it!

To learn more about the events Ember components use, see

[components/handling-events](https://guides.emberjs.com/release/components/handling-events/#toc_event-names).

### Initializers

To add behavior to the Application's boot process, you can define initializers in
the `app/initializers` directory, or with `ember generate initializer` using Ember CLI.
These files should export a named `initialize` function which will receive the created `application`
object as its first argument.

```javascript
export function initialize(application) {
// application.inject('route', 'foo', 'service:foo');
}
```

Application initializers can be used for a variety of reasons including:

- setting up external libraries
- injecting dependencies
- setting up event listeners in embedded apps
- deferring the boot process using the `deferReadiness` and `advanceReadiness` APIs.

### Routing

In addition to creating your application's router, `Application` is
also responsible for telling the router when to start routing. Transitions
between routes can be logged with the `LOG_TRANSITIONS` flag, and more
detailed intra-transition logging can be logged with
the `LOG_TRANSITIONS_INTERNAL` flag:

```javascript
import Application from '@ember/application';

let App = Application.create({
LOG_TRANSITIONS: true, // basic logging of successful transitions
LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps
});
```

By default, the router will begin trying to translate the current URL into
application state once the browser emits the `DOMContentReady` event. If you
need to defer routing, you can call the application's `deferReadiness()`
method. Once routing can begin, call the `advanceReadiness()` method.

If there is any setup required before routing begins, you can implement a
`ready()` method on your app that will be invoked immediately before routing
begins.

@class Application
@extends Engine
@public
*/
var Application = class extends Engine {
	/**
	This creates a registry with the default Ember naming conventions.
	It also configures the registry:
	* registered views are created every time they are looked up (they are
	not singletons)
	* registered templates are not factories; the registered value is
	returned directly.
	* the router receives the application as its `namespace` property
	* all controllers receive the router as their `target` and `controllers`
	properties
	* all controllers receive the application as their `namespace` property
	* the application view receives the application controller as its
	`controller` property
	* the application view receives the application template as its
	`defaultTemplate` property
	@method buildRegistry
	@static
	@param {Application} namespace the application for which to
	build the registry
	@return {Ember.Registry} the built registry
	@private
	*/
	static buildRegistry(namespace) {
		let registry = super.buildRegistry(namespace);
		commonSetupRegistry(registry);
		setupApplicationRegistry(registry);
		return registry;
	}
	static initializer = buildInitializerMethod("initializers");
	static instanceInitializer = buildInitializerMethod("instanceInitializers");
	/**
	The root DOM element of the Application. This can be specified as an
	element or a [selector string](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors#reference_table_of_selectors).
	This is the element that will be passed to the Application's,
	`eventDispatcher`, which sets up the listeners for event delegation. Every
	view in your application should be a child of the element you specify here.
	@property rootElement
	@type DOMElement
	@default 'body'
	@public
	*/
	/**
	@property _document
	@type Document | null
	@default 'window.document'
	@private
	*/
	/**
	The `EventDispatcher` responsible for delegating events to this
	application's views.
	The event dispatcher is created by the application at initialization time
	and sets up event listeners on the DOM element described by the
	application's `rootElement` property.
	See the documentation for `EventDispatcher` for more information.
	@property eventDispatcher
	@type Ember.EventDispatcher
	@default null
	@public
	*/
	/**
	The DOM events for which the event dispatcher should listen.
	By default, the application's `Ember.EventDispatcher` listens
	for a set of standard DOM events, such as `mousedown` and
	`keyup`, and delegates them to your application's `Ember.View`
	instances.
	If you would like additional bubbling events to be delegated to your
	views, set your `Application`'s `customEvents` property
	to a hash containing the DOM event name as the key and the
	corresponding view method name as the value. Setting an event to
	a value of `null` will prevent a default event listener from being
	added for that event.
	To add new events to be listened to:
	```app/app.js
	import Application from '@ember/application';
	let App = Application.extend({
	customEvents: {
	// add support for the paste event
	paste: 'paste'
	}
	});
	```
	To prevent default events from being listened to:
	```app/app.js
	import Application from '@ember/application';
	let App = Application.extend({
	customEvents: {
	// remove support for mouseenter / mouseleave events
	mouseenter: null,
	mouseleave: null
	}
	});
	```
	@property customEvents
	@type Object
	@default null
	@public
	*/
	/**
	Whether the application should automatically start routing and render
	templates to the `rootElement` on DOM ready. While default by true,
	other environments such as FastBoot or a testing harness can set this
	property to `false` and control the precise timing and behavior of the boot
	process.
	@property autoboot
	@type Boolean
	@default true
	@private
	*/
	/**
	An array of application instances created by `buildInstance()`. Used
	internally to ensure that all instances get destroyed.
	@property _applicationInstances
	@type Array
	@private
	*/
	init(properties) {
		super.init(properties);
		this.rootElement ??= "body";
		this._document ??= null;
		this.eventDispatcher ??= null;
		this.customEvents ??= null;
		this.autoboot ??= true;
		this._document ??= hasDOM ? window.document : null;
		this._readinessDeferrals = 1;
		this._booted = false;
		this._applicationInstances = /* @__PURE__ */ new Set();
		this.autoboot = Boolean(this.autoboot);
		if (this.autoboot) {
			this.Router = (this.Router || EmberRouter).extend();
			this._buildDeprecatedInstance();
			this.waitForDOMReady();
		}
	}
	/**
	Create an ApplicationInstance for this application.
	@public
	@method buildInstance
	@return {ApplicationInstance} the application instance
	*/
	buildInstance(options = {}) {
		return ApplicationInstance.create({
			...options,
			base: this,
			application: this
		});
	}
	/**
	Start tracking an ApplicationInstance for this application.
	Used when the ApplicationInstance is created.
	@private
	@method _watchInstance
	*/
	_watchInstance(instance) {
		this._applicationInstances.add(instance);
	}
	/**
	Stop tracking an ApplicationInstance for this application.
	Used when the ApplicationInstance is about to be destroyed.
	@private
	@method _unwatchInstance
	*/
	_unwatchInstance(instance) {
		return this._applicationInstances.delete(instance);
	}
	Router;
	__deprecatedInstance__;
	__container__;
	_buildDeprecatedInstance() {
		let instance = this.buildInstance();
		this.__deprecatedInstance__ = instance;
		this.__container__ = instance.__container__;
	}
	/**
	Automatically kick-off the boot process for the application once the
	DOM has become ready.
	The initialization itself is scheduled on the actions queue which
	ensures that code-loading finishes before booting.
	If you are asynchronously loading code, you should call `deferReadiness()`
	to defer booting, and then call `advanceReadiness()` once all of your code
	has finished loading.
	@private
	@method waitForDOMReady
	*/
	waitForDOMReady() {
		const document = this._document;
		if (document === null || document.readyState !== "loading") schedule("actions", this, this.domReady);
		else {
			let callback = () => {
				document.removeEventListener("DOMContentLoaded", callback);
				run(this, this.domReady);
			};
			document.addEventListener("DOMContentLoaded", callback);
		}
	}
	/**
	This is the autoboot flow:
	1. Boot the app by calling `this.boot()`
	2. Create an instance (or use the `__deprecatedInstance__` in globals mode)
	3. Boot the instance by calling `instance.boot()`
	4. Invoke the `App.ready()` callback
	5. Kick-off routing on the instance
	Ideally, this is all we would need to do:
	```javascript
	_autoBoot() {
	this.boot().then(() => {
	let instance = this.__deprecatedInstance__;
	return instance.boot();
	}).then((instance) => {
	App.ready();
	instance.startRouting();
	});
	}
	```
	Unfortunately, we cannot actually write this because we need to participate
	in the "synchronous" boot process. While the code above would work fine on
	the initial boot (i.e. DOM ready), when `App.reset()` is called, we need to
	boot a new instance synchronously (see the documentation on `_bootSync()`
	for details).
	Because of this restriction, the actual logic of this method is located
	inside `didBecomeReady()`.
	@private
	@method domReady
	*/
	domReady() {
		if (this.isDestroying || this.isDestroyed) return;
		this._bootSync();
	}
	/**
	Use this to defer readiness until some condition is true.
	Example:
	```javascript
	import Application from '@ember/application';
	let App = Application.create();
	App.deferReadiness();
	fetch('/auth-token')
	.then(response => response.json())
	.then(data => {
	App.token = data.token;
	App.advanceReadiness();
	});
	```
	This allows you to perform asynchronous setup logic and defer
	booting your application until the setup has finished.
	However, if the setup requires a loading UI, it might be better
	to use the router for this purpose.
	@method deferReadiness
	@public
	*/
	deferReadiness() {
		this._readinessDeferrals++;
	}
	/**
	Call `advanceReadiness` after any asynchronous setup logic has completed.
	Each call to `deferReadiness` must be matched by a call to `advanceReadiness`
	or the application will never become ready and routing will not begin.
	@method advanceReadiness
	@see {Application#deferReadiness}
	@public
	*/
	advanceReadiness() {
		this._readinessDeferrals--;
		if (this._readinessDeferrals === 0) once(this, this.didBecomeReady);
	}
	_bootPromise = null;
	/**
	Initialize the application and return a promise that resolves with the `Application`
	object when the boot process is complete.
	Run any application initializers and run the application load hook. These hooks may
	choose to defer readiness. For example, an authentication hook might want to defer
	readiness until the auth token has been retrieved.
	By default, this method is called automatically on "DOM ready"; however, if autoboot
	is disabled, this is automatically called when the first application instance is
	created via `visit`.
	@public
	@method boot
	@return {Promise<Application,Error>}
	*/
	boot() {
		if (this._bootPromise) return this._bootPromise;
		try {
			this._bootSync();
		} catch (_) {}
		return this._bootPromise;
	}
	_bootResolver = null;
	/**
	Unfortunately, a lot of existing code assumes the booting process is
	"synchronous". Specifically, a lot of tests assumes the last call to
	`app.advanceReadiness()` or `app.reset()` will result in the app being
	fully-booted when the current runloop completes.
	We would like new code (like the `visit` API) to stop making this assumption,
	so we created the asynchronous version above that returns a promise. But until
	we have migrated all the code, we would have to expose this method for use
	*internally* in places where we need to boot an app "synchronously".
	@private
	*/
	_bootSync() {
		if (this._booted || this.isDestroying || this.isDestroyed) return;
		let defer = this._bootResolver = RSVP.defer();
		this._bootPromise = defer.promise;
		try {
			this.runInitializers();
			this.advanceReadiness();
		} catch (error) {
			defer.reject(error);
			throw error;
		}
	}
	/**
	Reset the application. This is typically used only in tests. It cleans up
	the application in the following order:
	1. Deactivate existing routes
	2. Destroy all objects in the container
	3. Create a new application container
	4. Re-route to the existing url
	Typical Example:
	```javascript
	import Application from '@ember/application';
	let App;
	run(function() {
	App = Application.create();
	});
	module('acceptance test', {
	setup: function() {
	App.reset();
	}
	});
	test('first test', function() {
	// App is freshly reset
	});
	test('second test', function() {
	// App is again freshly reset
	});
	```
	Advanced Example:
	Occasionally you may want to prevent the app from initializing during
	setup. This could enable extra configuration, or enable asserting prior
	to the app becoming ready.
	```javascript
	import Application from '@ember/application';
	let App;
	run(function() {
	App = Application.create();
	});
	module('acceptance test', {
	setup: function() {
	run(function() {
	App.reset();
	App.deferReadiness();
	});
	}
	});
	test('first test', function() {
	ok(true, 'something before app is initialized');
	run(function() {
	App.advanceReadiness();
	});
	ok(true, 'something after app is initialized');
	});
	```
	@method reset
	@public
	*/
	reset() {
		let instance = this.__deprecatedInstance__;
		this._readinessDeferrals = 1;
		this._bootPromise = null;
		this._bootResolver = null;
		this._booted = false;
		function handleReset() {
			run(instance, "destroy");
			this._buildDeprecatedInstance();
			schedule("actions", this, "_bootSync");
		}
		join(this, handleReset);
	}
	/**
	@private
	@method didBecomeReady
	*/
	didBecomeReady() {
		if (this.isDestroying || this.isDestroyed) return;
		try {
			if (this.autoboot) {
				let instance = this.__deprecatedInstance__;
				instance._bootSync();
				this.ready();
				instance.startRouting();
			}
			this._bootResolver.resolve(this);
			this._booted = true;
		} catch (error) {
			this._bootResolver.reject(error);
			throw error;
		}
	}
	/**
	Called when the Application has become ready, immediately before routing
	begins. The call will be delayed until the DOM has become ready.
	@event ready
	@public
	*/
	ready() {
		return this;
	}
	willDestroy() {
		super.willDestroy();
		if (this._applicationInstances.size) {
			this._applicationInstances.forEach((i) => i.destroy());
			this._applicationInstances.clear();
		}
	}
	/**
	Boot a new instance of `ApplicationInstance` for the current
	application and navigate it to the given `url`. Returns a `Promise` that
	resolves with the instance when the initial routing and rendering is
	complete, or rejects with any error that occurred during the boot process.
	When `autoboot` is disabled, calling `visit` would first cause the
	application to boot, which runs the application initializers.
	This method also takes a hash of boot-time configuration options for
	customizing the instance's behavior. See the documentation on
	`ApplicationInstance.BootOptions` for details.
	`ApplicationInstance.BootOptions` is an interface class that exists
	purely to document the available options; you do not need to construct it
	manually. Simply pass a regular JavaScript object containing of the
	desired options:
	```javascript
	MyApp.visit("/", { location: "none", rootElement: "#container" });
	```
	### Supported Scenarios
	While the `BootOptions` class exposes a large number of knobs, not all
	combinations of them are valid; certain incompatible combinations might
	result in unexpected behavior.
	For example, booting the instance in the full browser environment
	while specifying a foreign `document` object (e.g. `{ isBrowser: true,
	document: iframe.contentDocument }`) does not work correctly today,
	largely due to Ember's jQuery dependency.
	Currently, there are three officially supported scenarios/configurations.
	Usages outside of these scenarios are not guaranteed to work, but please
	feel free to file bug reports documenting your experience and any issues
	you encountered to help expand support.
	#### Browser Applications (Manual Boot)
	The setup is largely similar to how Ember works out-of-the-box. Normally,
	Ember will boot a default instance for your Application on "DOM ready".
	However, you can customize this behavior by disabling `autoboot`.
	For example, this allows you to render a miniture demo of your application
	into a specific area on your marketing website:
	```javascript
	import MyApp from 'my-app';
	$(function() {
	let App = MyApp.create({ autoboot: false });
	let options = {
	// Override the router's location adapter to prevent it from updating
	// the URL in the address bar
	location: 'none',
	// Override the default `rootElement` on the app to render into a
	// specific `div` on the page
	rootElement: '#demo'
	};
	// Start the app at the special demo URL
	App.visit('/demo', options);
	});
	```
	Or perhaps you might want to boot two instances of your app on the same
	page for a split-screen multiplayer experience:
	```javascript
	import MyApp from 'my-app';
	$(function() {
	let App = MyApp.create({ autoboot: false });
	let sessionId = MyApp.generateSessionID();
	let player1 = App.visit(`/matches/join?name=Player+1&session=${sessionId}`, { rootElement: '#left', location: 'none' });
	let player2 = App.visit(`/matches/join?name=Player+2&session=${sessionId}`, { rootElement: '#right', location: 'none' });
	Promise.all([player1, player2]).then(() => {
	// Both apps have completed the initial render
	$('#loading').fadeOut();
	});
	});
	```
	Do note that each app instance maintains their own registry/container, so
	they will run in complete isolation by default.
	#### Server-Side Rendering (also known as FastBoot)
	This setup allows you to run your Ember app in a server environment using
	Node.js and render its content into static HTML for SEO purposes.
	```javascript
	const HTMLSerializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
	function renderURL(url) {
	let dom = new SimpleDOM.Document();
	let rootElement = dom.body;
	let options = { isBrowser: false, document: dom, rootElement: rootElement };
	return MyApp.visit(options).then(instance => {
	try {
	return HTMLSerializer.serialize(rootElement.firstChild);
	} finally {
	instance.destroy();
	}
	});
	}
	```
	In this scenario, because Ember does not have access to a global `document`
	object in the Node.js environment, you must provide one explicitly. In practice,
	in the non-browser environment, the stand-in `document` object only needs to
	implement a limited subset of the full DOM API. The `SimpleDOM` library is known
	to work.
	Since there is no DOM access in the non-browser environment, you must also
	specify a DOM `Element` object in the same `document` for the `rootElement` option
	(as opposed to a selector string like `"body"`).
	See the documentation on the `isBrowser`, `document` and `rootElement` properties
	on `ApplicationInstance.BootOptions` for details.
	#### Server-Side Resource Discovery
	This setup allows you to run the routing layer of your Ember app in a server
	environment using Node.js and completely disable rendering. This allows you
	to simulate and discover the resources (i.e. AJAX requests) needed to fulfill
	a given request and eagerly "push" these resources to the client.
	```app/initializers/network-service.js
	import BrowserNetworkService from 'app/services/network/browser';
	import NodeNetworkService from 'app/services/network/node';
	// Inject a (hypothetical) service for abstracting all AJAX calls and use
	// the appropriate implementation on the client/server. This also allows the
	// server to log all the AJAX calls made during a particular request and use
	// that for resource-discovery purpose.
	export function initialize(application) {
	if (window) { // browser
	application.register('service:network', BrowserNetworkService);
	} else { // node
	application.register('service:network', NodeNetworkService);
	}
	};
	export default {
	name: 'network-service',
	initialize: initialize
	};
	```
	```app/routes/post.js
	import Route from '@ember/routing/route';
	import { service } from '@ember/service';
	// An example of how the (hypothetical) service is used in routes.
	export default class IndexRoute extends Route {
	@service network;
	model(params) {
	return this.network.fetch(`/api/posts/${params.post_id}.json`);
	}
	afterModel(post) {
	if (post.isExternalContent) {
	return this.network.fetch(`/api/external/?url=${post.externalURL}`);
	} else {
	return post;
	}
	}
	}
	```
	```javascript
	// Finally, put all the pieces together
	function discoverResourcesFor(url) {
	return MyApp.visit(url, { isBrowser: false, shouldRender: false }).then(instance => {
	let networkService = instance.lookup('service:network');
	return networkService.requests; // => { "/api/posts/123.json": "..." }
	});
	}
	```
	@public
	@method visit
	@param url {String} The initial URL to navigate to
	@param options {ApplicationInstance.BootOptions}
	@return {Promise<ApplicationInstance, Error>}
	*/
	visit(url, options) {
		return this.boot().then(() => {
			let instance = this.buildInstance();
			return instance.boot(options).then(() => instance.visit(url)).catch((error) => {
				run(instance, "destroy");
				throw error;
			});
		});
	}
};
function commonSetupRegistry(registry) {
	registry.register("router:main", EmberRouter);
	registry.register("-view-registry:main", { create() {
		return makeDictionary(null);
	} });
	registry.register("route:basic", Route);
	registry.register("event_dispatcher:main", EventDispatcher);
	registry.register("location:hash", HashLocation);
	registry.register("location:history", HistoryLocation);
	registry.register("location:none", NoneLocation);
	registry.register(privatize`-bucket-cache:main`, { create() {
		return new BucketCache();
	} });
	registry.register("service:router", RouterService);
}
//#endregion
export { OutletView as a, setupApplicationRegistry as c, SERIALIZATION_FIRST_NODE_STRING as d, isSerializationFirstNode as f, EventDispatcher as g, alias as h, setOwner as i, setupEngineRegistry as l, namespace_exports as m, application_exports as n, Renderer as o, rehydrationBuilder as p, getOwner as r, RootTemplate as s, Application as t, RehydrateTree as u };
