import { S as guidFor, U as get, i as Mixin } from "./core-D-L0f59Y.js";
import { i as hasDOM } from "./curly-brand-B_F79Dep-Cbz0KMC_.js";
import { f as join, o as _rsvpErrorQueue, t as _backburner, v as schedule, x as getDispatchOverride } from "./runloop-Dk0Nzu3h.js";
import { A as Registry, B as configure, J as on, P as RSVP, j as privatize } from "./route-CA9vvjYs.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { t as EmberObject } from "./object-X4rDdm09.js";
import { n as getEngineParent, r as setEngineParent, t as ENGINE_PARENT } from "./engine-parent-DyfhzFhj.js";
import { o as renderSettled } from "./index-B-2NDHmt-B5xkrs2f.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/runtime/lib/ext/rsvp.js
configure("async", (callback, promise) => {
	_backburner.schedule("actions", null, callback, promise);
});
configure("after", (cb) => {
	_backburner.schedule(_rsvpErrorQueue, null, cb);
});
on("error", onerrorDefault);
function onerrorDefault(reason) {
	let error = errorFor(reason);
	if (error) {
		let overrideDispatch = getDispatchOverride();
		if (overrideDispatch) overrideDispatch(error);
		else throw error;
	}
}
function errorFor(reason) {
	if (!reason) return;
	let withErrorThrown = reason;
	if (withErrorThrown.errorThrown) return unwrapErrorThrown(withErrorThrown);
	if (reason.name === "UnrecognizedURLError") return;
	if (reason.name === "TransitionAborted") return;
	return reason;
}
function unwrapErrorThrown(reason) {
	let error = reason.errorThrown;
	if (typeof error === "string") error = new Error(error);
	Object.defineProperty(error, "__reason_with_error_thrown__", {
		value: reason,
		enumerable: false
	});
	return error;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/runtime/lib/mixins/container_proxy.js
/**
ContainerProxyMixin is used to provide public access to specific
container functionality.

@class ContainerProxyMixin
@extends ContainerProxy
@private
*/
var ContainerProxyMixin = Mixin.create({
	/**
	The container stores state.
	@private
	@property {Ember.Container} __container__
	*/
	__container__: null,
	ownerInjection() {
		return this.__container__.ownerInjection();
	},
	lookup(fullName, options) {
		return this.__container__.lookup(fullName, options);
	},
	destroy() {
		let container = this.__container__;
		if (container) join(() => {
			container.destroy();
			schedule("destroy", container, "finalizeDestroy");
		});
		this._super();
	},
	factoryFor(fullName) {
		return this.__container__.factoryFor(fullName);
	}
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/runtime/lib/mixins/registry_proxy.js
/**
@module ember
*/
/**
RegistryProxyMixin is used to provide public access to specific
registry functionality.

@class RegistryProxyMixin
@extends RegistryProxy
@private
*/
var RegistryProxyMixin = Mixin.create({
	__registry__: null,
	resolveRegistration(fullName) {
		return this.__registry__.resolve(fullName);
	},
	register: registryAlias("register"),
	unregister: registryAlias("unregister"),
	hasRegistration: registryAlias("has"),
	registeredOption: registryAlias("getOption"),
	registerOptions: registryAlias("options"),
	registeredOptions: registryAlias("getOptions"),
	registerOptionsForType: registryAlias("optionsForType"),
	registeredOptionsForType: registryAlias("getOptionsForType")
});
function registryAlias(name) {
	return function(...args) {
		return this.__registry__[name](...args);
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/engine/instance.js
/**
@module @ember/engine
*/
/**
The `EngineInstance` encapsulates all of the stateful aspects of a
running `Engine`.

@public
@class EngineInstance
@extends EmberObject
@uses RegistryProxyMixin
@uses ContainerProxyMixin
*/
var EngineInstance = class extends EmberObject.extend(RegistryProxyMixin, ContainerProxyMixin) {
	/**
	@private
	@method setupRegistry
	@param {Registry} registry
	@param {BootOptions} options
	*/
	static setupRegistry(_registry, _options) {}
	/**
	The base `Engine` for which this is an instance.
	@property {Engine} engine
	@private
	*/
	[ENGINE_PARENT];
	_booted = false;
	init(properties) {
		super.init(properties);
		guidFor(this);
		this.base ??= this.application;
		let registry = this.__registry__ = new Registry({ fallback: this.base.__registry__ });
		this.__container__ = registry.container({ owner: this });
		this._booted = false;
	}
	_bootPromise = null;
	/**
	Initialize the `EngineInstance` and return a promise that resolves
	with the instance itself when the boot process is complete.
	The primary task here is to run any registered instance initializers.
	See the documentation on `BootOptions` for the options it takes.
	@public
	@method boot
	@param options {Object}
	@return {Promise<EngineInstance,Error>}
	*/
	boot(options) {
		if (this._bootPromise) return this._bootPromise;
		this._bootPromise = new RSVP.Promise((resolve) => {
			resolve(this._bootSync(options));
		});
		return this._bootPromise;
	}
	/**
	Unfortunately, a lot of existing code assumes booting an instance is
	synchronous – specifically, a lot of tests assume the last call to
	`app.advanceReadiness()` or `app.reset()` will result in a new instance
	being fully-booted when the current runloop completes.
	We would like new code (like the `visit` API) to stop making this
	assumption, so we created the asynchronous version above that returns a
	promise. But until we have migrated all the code, we would have to expose
	this method for use *internally* in places where we need to boot an instance
	synchronously.
	@private
	*/
	_bootSync(options) {
		if (this._booted) return this;
		this.cloneParentDependencies();
		this.setupRegistry(options);
		this.base.runInstanceInitializers(this);
		this._booted = true;
		return this;
	}
	setupRegistry(options = this.__container__.lookup("-environment:main")) {
		this.constructor.setupRegistry(this.__registry__, options);
	}
	/**
	Unregister a factory.
	Overrides `RegistryProxy#unregister` in order to clear any cached instances
	of the unregistered factory.
	@public
	@method unregister
	@param {String} fullName
	*/
	unregister(fullName) {
		this.__container__.reset(fullName);
		this.__registry__.unregister(fullName);
	}
	/**
	Build a new `EngineInstance` that's a child of this instance.
	Engines must be registered by name with their parent engine
	(or application).
	@private
	@method buildChildEngineInstance
	@param name {String} the registered name of the engine.
	@param options {Object} options provided to the engine instance.
	@return {EngineInstance,Error}
	*/
	buildChildEngineInstance(name, options = {}) {
		let ChildEngine = this.lookup(`engine:${name}`);
		if (!ChildEngine) throw new Error(`You attempted to mount the engine '${name}', but it is not registered with its parent.`);
		let engineInstance = ChildEngine.buildInstance(options);
		setEngineParent(engineInstance, this);
		return engineInstance;
	}
	/**
	Clone dependencies shared between an engine instance and its parent.
	@private
	@method cloneParentDependencies
	*/
	cloneParentDependencies() {
		const parent = getEngineParent(this);
		["route:basic", "service:-routing"].forEach((key) => {
			let registration = parent.resolveRegistration(key);
			this.register(key, registration);
		});
		let env = parent.lookup("-environment:main");
		this.register("-environment:main", env, { instantiate: false });
		let singletons = [
			"router:main",
			privatize`-bucket-cache:main`,
			"-view-registry:main",
			`renderer:-dom`,
			"service:-document"
		];
		if (env["isInteractive"]) singletons.push("event_dispatcher:main");
		singletons.forEach((key) => {
			let singleton = parent.lookup(key);
			this.register(key, singleton, { instantiate: false });
		});
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/index-Cc8WmrB-.js
var window = hasDOM ? self : null;
var location = hasDOM ? self.location : null;
var history = hasDOM ? self.history : null;
var userAgent = hasDOM ? self.navigator.userAgent : "Lynx (textmode)";
var isChrome = hasDOM ? typeof chrome === "object" && !(typeof opera === "object") : false;
var isFirefox = hasDOM ? /Firefox|FxiOS/.test(userAgent) : false;
var environment = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ Object.defineProperty({
	__proto__: null,
	hasDOM,
	history,
	isChrome,
	isFirefox,
	location,
	userAgent,
	window
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/application/instance.js
/**
@module @ember/application
*/
/**
The `ApplicationInstance` encapsulates all of the stateful aspects of a
running `Application`.

At a high-level, we break application boot into two distinct phases:

* Definition time, where all of the classes, templates, and other
dependencies are loaded (typically in the browser).
* Run time, where we begin executing the application once everything
has loaded.

Definition time can be expensive and only needs to happen once since it is
an idempotent operation. For example, between test runs and FastBoot
requests, the application stays the same. It is only the state that we want
to reset.

That state is what the `ApplicationInstance` manages: it is responsible for
creating the container that contains all application state, and disposing of
it once the particular test run or FastBoot request has finished.

@public
@class ApplicationInstance
@extends EngineInstance
*/
var ApplicationInstance = class extends EngineInstance {
	/**
	The `Application` for which this is an instance.
	@property {Application} application
	@private
	*/
	/**
	The root DOM element of the Application as an element or a
	CSS selector.
	@private
	@property {String|DOMElement} rootElement
	*/
	rootElement = null;
	init(properties) {
		super.init(properties);
		this.application._watchInstance(this);
		this.register("-application-instance:main", this, { instantiate: false });
	}
	/**
	Overrides the base `EngineInstance._bootSync` method with concerns relevant
	to booting application (instead of engine) instances.
	This method should only contain synchronous boot concerns. Asynchronous
	boot concerns should eventually be moved to the `boot` method, which
	returns a promise.
	Until all boot code has been made asynchronous, we need to continue to
	expose this method for use *internally* in places where we need to boot an
	instance synchronously.
	@private
	*/
	_bootSync(options) {
		if (this._booted) return this;
		options = new _BootOptions(options);
		this.setupRegistry(options);
		if (options.rootElement) this.rootElement = options.rootElement;
		else this.rootElement = this.application.rootElement;
		if (options.location) set(this.router, "location", options.location);
		this.application.runInstanceInitializers(this);
		if (options.isInteractive) this.setupEventDispatcher();
		this._booted = true;
		return this;
	}
	setupRegistry(options) {
		this.constructor.setupRegistry(this.__registry__, options);
	}
	_router;
	get router() {
		if (!this._router) {
			let router = this.lookup("router:main");
			this._router = router;
		}
		return this._router;
	}
	/**
	This hook is called by the root-most Route (a.k.a. the ApplicationRoute)
	when it has finished creating the root View. By default, we simply take the
	view and append it to the `rootElement` specified on the Application.
	In cases like FastBoot and testing, we can override this hook and implement
	custom behavior, such as serializing to a string and sending over an HTTP
	socket rather than appending to DOM.
	@param view {Ember.View} the root-most view
	@deprecated
	@private
	*/
	didCreateRootView(view) {
		view.appendTo(this.rootElement);
	}
	/**
	Tells the router to start routing. The router will ask the location for the
	current URL of the page to determine the initial URL to start routing to.
	To start the app at a specific URL, call `handleURL` instead.
	@private
	*/
	startRouting() {
		this.router.startRouting();
	}
	/**
	Sets up the router, initializing the child router and configuring the
	location before routing begins.
	Because setup should only occur once, multiple calls to `setupRouter`
	beyond the first call have no effect.
	This is commonly used in order to confirm things that rely on the router
	are functioning properly from tests that are primarily rendering related.
	For example, from within [ember-qunit](https://github.com/emberjs/ember-qunit)'s
	`setupRenderingTest` calling `this.owner.setupRouter()` would allow that
	rendering test to confirm that any `<LinkTo></LinkTo>`'s that are rendered
	have the correct URL.
	@public
	*/
	setupRouter() {
		this.router.setupRouter();
	}
	/**
	Directs the router to route to a particular URL. This is useful in tests,
	for example, to tell the app to start at a particular URL.
	@param url {String} the URL the router should route to
	@private
	*/
	handleURL(url) {
		this.setupRouter();
		return this.router.handleURL(url);
	}
	/**
	@private
	*/
	setupEventDispatcher() {
		let dispatcher = this.lookup("event_dispatcher:main");
		let applicationCustomEvents = get(this.application, "customEvents");
		let instanceCustomEvents = get(this, "customEvents");
		let customEvents = Object.assign({}, applicationCustomEvents, instanceCustomEvents);
		dispatcher.setup(customEvents, this.rootElement);
		return dispatcher;
	}
	/**
	Returns the current URL of the app instance. This is useful when your
	app does not update the browsers URL bar (i.e. it uses the `'none'`
	location adapter).
	@public
	@return {String} the current URL
	*/
	getURL() {
		return this.router.url;
	}
	/**
	Navigate the instance to a particular URL. This is useful in tests, for
	example, or to tell the app to start at a particular URL. This method
	returns a promise that resolves with the app instance when the transition
	is complete, or rejects if the transition was aborted due to an error.
	@public
	@param url {String} the destination URL
	@return {Promise<ApplicationInstance>}
	*/
	visit(url) {
		this.setupRouter();
		let bootOptions = this.__container__.lookup("-environment:main");
		let router = this.router;
		let handleTransitionResolve = () => {
			if (!bootOptions.options.shouldRender) return this;
			else return renderSettled().then(() => this);
		};
		let handleTransitionReject = (error) => {
			if (error.error && error.error instanceof Error) throw error.error;
			else if (error.name === "TransitionAborted") throw new Error(error.message);
			else throw error;
		};
		let location = get(router, "location");
		location.setURL(url);
		return router.handleURL(location.getURL()).followRedirects().then(handleTransitionResolve, handleTransitionReject);
	}
	willDestroy() {
		super.willDestroy();
		this.application._unwatchInstance(this);
	}
	/**
	@private
	@method setupRegistry
	@param {Registry} registry
	@param {BootOptions} options
	*/
	static setupRegistry(registry, options = {}) {
		let coptions = options instanceof _BootOptions ? options : new _BootOptions(options);
		registry.register("-environment:main", coptions.toEnvironment(), { instantiate: false });
		registry.register("service:-document", coptions.document, { instantiate: false });
		super.setupRegistry(registry, coptions);
	}
};
/**
A list of boot-time configuration options for customizing the behavior of
an `ApplicationInstance`.

This is an interface class that exists purely to document the available
options; you do not need to construct it manually. Simply pass a regular
JavaScript object containing the desired options into methods that require
one of these options object:

```javascript
MyApp.visit("/", { location: "none", rootElement: "#container" });
```

Not all combinations of the supported options are valid. See the documentation
on `Application#visit` for the supported configurations.

Internal, experimental or otherwise unstable flags are marked as private.

@class BootOptions
@namespace ApplicationInstance
@public
*/
var _BootOptions = class {
	/**
	Interactive mode: whether we need to set up event delegation and invoke
	lifecycle callbacks on Components.
	@property isInteractive
	@type boolean
	@default auto-detected
	@private
	*/
	isInteractive;
	/**
	@property _renderMode
	@type string
	@default undefined
	@private
	*/
	_renderMode;
	/**
	Run in a full browser environment.
	When this flag is set to `false`, it will disable most browser-specific
	and interactive features. Specifically:
	* It does not use `jQuery` to append the root view; the `rootElement`
	(either specified as a subsequent option or on the application itself)
	must already be an `Element` in the given `document` (as opposed to a
	string selector).
	* It does not set up an `EventDispatcher`.
	* It does not run any `Component` lifecycle hooks (such as `didInsertElement`).
	* It sets the `location` option to `"none"`. (If you would like to use
	the location adapter specified in the app's router instead, you can also
	specify `{ location: null }` to specifically opt-out.)
	@property isBrowser
	@type boolean
	@default auto-detected
	@public
	*/
	isBrowser;
	/**
	If present, overrides the router's `location` property with this
	value. This is useful for environments where trying to modify the
	URL would be inappropriate.
	@property location
	@type string
	@default null
	@public
	*/
	location = null;
	/**
	Disable rendering completely.
	When this flag is set to `false`, it will disable the entire rendering
	pipeline. Essentially, this puts the app into "routing-only" mode. No
	templates will be rendered, and no Components will be created.
	@property shouldRender
	@type boolean
	@default true
	@public
	*/
	shouldRender;
	/**
	If present, render into the given `Document` object instead of the
	global `window.document` object.
	In practice, this is only useful in non-browser environment or in
	non-interactive mode, because Ember's `jQuery` dependency is
	implicitly bound to the current document, causing event delegation
	to not work properly when the app is rendered into a foreign
	document object (such as an iframe's `contentDocument`).
	In non-browser mode, this could be a "`Document`-like" object as
	Ember only interact with a small subset of the DOM API in non-
	interactive mode. While the exact requirements have not yet been
	formalized, the `SimpleDOM` library's implementation is known to
	work.
	@property document
	@type Document
	@default the global `document` object
	@public
	*/
	document;
	/**
	If present, overrides the application's `rootElement` property on
	the instance. This is useful for testing environment, where you
	might want to append the root view to a fixture area.
	In non-browser mode, because Ember does not have access to jQuery,
	this options must be specified as a DOM `Element` object instead of
	a selector string.
	See the documentation on `Application`'s `rootElement` for
	details.
	@property rootElement
	@type String|Element
	@default null
	@public
	*/
	rootElement;
	constructor(options = {}) {
		this.isInteractive = Boolean(hasDOM);
		this._renderMode = options._renderMode;
		if (options.isBrowser !== void 0) this.isBrowser = Boolean(options.isBrowser);
		else this.isBrowser = Boolean(hasDOM);
		if (!this.isBrowser) {
			this.isInteractive = false;
			this.location = "none";
		}
		if (options.shouldRender !== void 0) this.shouldRender = Boolean(options.shouldRender);
		else this.shouldRender = true;
		if (!this.shouldRender) this.isInteractive = false;
		if (options.document) this.document = options.document;
		else this.document = typeof document !== "undefined" ? document : null;
		if (options.rootElement) this.rootElement = options.rootElement;
		if (options.location !== void 0) this.location = options.location;
		if (options.isInteractive !== void 0) this.isInteractive = Boolean(options.isInteractive);
	}
	toEnvironment() {
		return {
			...environment,
			hasDOM: this.isBrowser,
			isInteractive: this.isInteractive,
			_renderMode: this._renderMode,
			options: this
		};
	}
};
//#endregion
export { onerrorDefault as a, ContainerProxyMixin as i, EngineInstance as n, RegistryProxyMixin as r, ApplicationInstance as t };
