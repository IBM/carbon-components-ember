import { et as Version, eu as Application, ev as Registry, ew as ApplicationInstance, ex as EmberObject, bU as RegistryProxyMixin, bR as ContainerProxyMixin, ey as _getCurrentRunLoop, ez as run$1, bT as RSVP$1, eA as setDispatchOverride, a6 as _backburner, eB as getPendingWaiterState, eC as hasPendingWaiters, eD as setOnerror, eE as setTesting, eF as setOwner, at as set, bx as setProperties, g as get, b4 as getProperties, eG as getOnerror, eH as destroy, cP as getInternalComponentManager, cq as EventDispatcher, i as templateFactory, eI as DOMTreeConstruction, eJ as ConcreteBounds, eK as Component, eL as DOMChanges, H as Helper, eM as Input, eN as LinkTo, eO as OutletView, eP as Renderer, eQ as RootTemplate, eR as SafeString, eS as Textarea, eT as TrustedHTML, eU as _resetRenderers, cM as componentCapabilities, eV as getTemplate, eW as getTemplates, eX as hasTemplate, eY as helper$1, eo as htmlSafe, eZ as isHTMLSafe, e_ as isSerializationFirstNode, e$ as isTrustedHTML, c_ as modifierCapabilities, f0 as renderComponent, f1 as renderSettled$2, f2 as setComponentManager, f3 as setTemplate, f4 as setTemplates, f5 as setupApplicationRegistry, f6 as setupEngineRegistry, f7 as templateCacheCounters, f8 as trustHTML, f9 as uniqueId$1, e1 as esCompat, fa as isTesting } from './main-CcL4ky4Z.js';

let __resolver__;

/**
  Stores the provided resolver instance so that tests being ran can resolve
  objects in the same way as a normal application.

  Used by `setupContext` and `setupRenderingContext` as a fallback when `setApplication` was _not_ used.

  @public
  @param {Ember.Resolver} resolver the resolver to be used for testing
*/
function setResolver(resolver) {
  __resolver__ = resolver;
}

/**
  Retrieve the resolver instance stored by `setResolver`.

  @public
  @returns {Ember.Resolver} the previously stored resolver
*/
function getResolver() {
  return __resolver__;
}

let __application__;

/**
  Stores the provided application instance so that tests being ran will be aware of the application under test.

  - Required by `setupApplicationContext` method.
  - Used by `setupContext` and `setupRenderingContext` when present.

  @public
  @param {Ember.Application} application the application that will be tested
*/
function setApplication(application) {
  __application__ = application;
  if (!getResolver()) {
    const Resolver = application.Resolver;
    const resolver = Resolver.create({
      namespace: application
    });
    setResolver(resolver);
  }
}

/**
  Retrieve the application instance stored by `setApplication`.

  @public
  @returns {Ember.Application} the previously stored application instance under test
*/
function getApplication() {
  return __application__;
}

// @ts-ignore

/**
  Checks if the currently running Ember version is greater than or equal to the
  specified major and minor version numbers.

  @private
  @param {number} major the major version number to compare
  @param {number} minor the minor version number to compare
  @returns {boolean} true if the Ember version is >= MAJOR.MINOR specified, false otherwise
*/
function hasEmberVersion(major, minor) {
  const numbers = Version.split('-')[0]?.split('.');
  if (!numbers || !numbers[0] || !numbers[1]) {
    throw new Error('`Ember.VERSION` is not set.');
  }
  const actualMajor = parseInt(numbers[0], 10);
  const actualMinor = parseInt(numbers[1], 10);
  return actualMajor > major || actualMajor === major && actualMinor >= minor;
}

/**
 * Adds methods that are normally only on registry to the container. This is largely to support the legacy APIs
 * that are not using `owner` (but are still using `this.container`).
 *
 * @private
 * @param {Object} container  the container to modify
 */
function exposeRegistryMethodsWithoutDeprecations(container) {
  const methods = ['register', 'unregister', 'resolve', 'normalize', 'typeInjection', 'injection', 'factoryInjection', 'factoryTypeInjection', 'has', 'options', 'optionsForType'];
  for (let i = 0, l = methods.length; i < l; i++) {
    const methodName = methods[i];
    if (methodName && methodName in container) {
      const knownMethod = methodName;
      container[knownMethod] = function (...args) {
        return container._registry[knownMethod](...args);
      };
    }
  }
}

// NOTE: this is the same as what `EngineInstance`/`ApplicationInstance`
// implement, and is thus a superset of the `InternalOwner` contract from Ember
// itself.

const Owner = EmberObject.extend(RegistryProxyMixin, ContainerProxyMixin, {
  _emberTestHelpersMockOwner: true,
  /* eslint-disable valid-jsdoc */
  /**
   * Unregister a factory and its instance.
   *
   * Overrides `RegistryProxy#unregister` in order to clear any cached instances
   * of the unregistered factory.
   *
   * @param {string} fullName Name of the factory to unregister.
   *
   * @see {@link https://github.com/emberjs/ember.js/pull/12680}
   * @see {@link https://github.com/emberjs/ember.js/blob/v4.5.0-alpha.5/packages/%40ember/engine/instance.ts#L152-L167}
   */
  /* eslint-enable valid-jsdoc */
  unregister(fullName) {
    // SAFETY: this is always present, but only the stable type definitions from
    // Ember actually preserve it, since it is private API.
    this['__container__'].reset(fullName);

    // We overwrote this method from RegistryProxyMixin.
    // SAFETY: this is always present, but only the stable type definitions from
    // Ember actually preserve it, since it is private API.
    this['__registry__'].unregister(fullName);
  }
});

/**
 * @private
 * @param {Object} resolver the resolver to use with the registry
 * @returns {Object} owner, container, registry
 */
function buildRegistry(resolver) {
  const namespace = new Application();
  // @ts-ignore: this is actually the correcct type, but there was a typo in
  // Ember's docs for many years which meant that there was a matching problem
  // in the types for Ember's definition of `Engine`. Once we require at least
  // Ember 5.1 (in some future breaking change), this ts-ignore can be removed.
  namespace.Resolver = {
    create() {
      return resolver;
    }
  };

  // @ts-ignore: this is private API.
  const fallbackRegistry = Application.buildRegistry(namespace);
  const registry = new Registry({
    fallback: fallbackRegistry
  });

  // @ts-ignore: this is private API.
  ApplicationInstance.setupRegistry(registry);

  // these properties are set on the fallback registry by `buildRegistry`
  // and on the primary registry within the ApplicationInstance constructor
  // but we need to manually recreate them since ApplicationInstance's are not
  // exposed externally
  // @ts-ignore: this is private API.
  registry.normalizeFullName = fallbackRegistry.normalizeFullName;
  // @ts-ignore: this is private API.
  registry.makeToString = fallbackRegistry.makeToString;
  // @ts-ignore: this is private API.
  registry.describe = fallbackRegistry.describe;
  const owner = Owner.create({
    // @ts-ignore -- we do not have type safety for `Object.extend` so the type
    // of `Owner` here is just `EmberObject`, but we *do* constrain it to allow
    // only types from the actual class, so these fields are not accepted.
    // However, we can see that they are valid, based on the definition of
    // `Owner` above given that it fulfills the `InternalOwner` contract and
    // also extends it just as `EngineInstance` does internally.
    //
    // NOTE: we use an `ignore` directive rather than `expect-error` because in
    // *some* versions of the types, we *do* have (at least some of) this
    // safety, and maximal backwards compatibility means we have to account for
    // that.
    __registry__: registry,
    __container__: null
  });

  // @ts-ignore: this is private API.
  const container = registry.container({
    owner: owner
  });
  // @ts-ignore: this is private API.
  owner.__container__ = container;
  exposeRegistryMethodsWithoutDeprecations(container);
  return {
    registry,
    container,
    owner
  };
}

/**
  Creates an "owner" (an object that either _is_ or duck-types like an
  `Ember.ApplicationInstance`) from the provided options.

  If `options.application` is present (e.g. setup by an earlier call to
  `setApplication`) an `Ember.ApplicationInstance` is built via
  `application.buildInstance()`.

  If `options.application` is not present, we fall back to using
  `options.resolver` instead (setup via `setResolver`). This creates a mock
  "owner" by using a custom created combination of `Ember.Registry`,
  `Ember.Container`, `Ember._ContainerProxyMixin`, and
  `Ember._RegistryProxyMixin`.

  @private
  @param {Ember.Application} [application] the Ember.Application to build an instance from
  @param {Ember.Resolver} [resolver] the resolver to use to back a "mock owner"
  @returns {Promise<Ember.ApplicationInstance>} a promise resolving to the generated "owner"
*/
function buildOwner(application, resolver) {
  if (application) {
    // @ts-ignore: this type is correct and will check against Ember 4.12 or 5.1
    // or later. However, the first round of preview types in Ember 4.8 does not
    // include the `visit` API (it was missing for many years!) and therefore
    // there is no way to make this assignable accross all supported versions.
    return application.boot().then(app => app.buildInstance().boot());
  }
  if (!resolver) {
    throw new Error('You must set up the ember-test-helpers environment with either `setResolver` or `setApplication` before running any tests.');
  }
  const {
    owner
  } = buildRegistry(resolver);
  return Promise.resolve(owner);
}

function run(fn) {
  if (!_getCurrentRunLoop()) {
    return run$1(fn);
  } else {
    return fn();
  }
}

let lastPromise = null;
class TestPromise extends RSVP$1.Promise {
  constructor(executor, label) {
    super(executor, label);
    lastPromise = this;
  }
  then(onFulfilled, onRejected, label) {
    let normalizedOnFulfilled = typeof onFulfilled === 'function' ? result => isolate(onFulfilled, result) : undefined;
    return super.then(normalizedOnFulfilled, onRejected, label);
  }
}

/**
  This returns a thenable tailored for testing.  It catches failed
  `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception`
  callback in the last chained then.

  This method should be returned by async helpers such as `wait`.

  @public
  @for Ember.Test
  @method promise
  @param {Function} resolver The function used to resolve the promise.
  @param {String} label An optional string for identifying the promise.
*/
function promise(resolver, label) {
  let fullLabel = `Ember.Test.promise: ${label || '<Unknown Promise>'}`;
  return new TestPromise(resolver, fullLabel);
}

/**
  Replacement for `Ember.RSVP.resolve`
  The only difference is this uses
  an instance of `Ember.Test.Promise`

  @public
  @for Ember.Test
  @method resolve
  @param {Mixed} The value to resolve
  @since 1.2.0
*/
function resolve(result, label) {
  return TestPromise.resolve(result, label);
}

// This method isolates nested async methods
// so that they don't conflict with other last promises.
//
// 1. Set `Ember.Test.lastPromise` to null
// 2. Invoke method
// 3. Return the last promise created during method
function isolate(onFulfilled, result) {
  // Reset lastPromise for nested helpers
  lastPromise = null;
  let value = onFulfilled(result);
  let promise = lastPromise;
  lastPromise = null;

  // If the method returned a promise
  // return that promise. If not,
  // return the last async helper's promise
  if (value && value instanceof TestPromise || !promise) {
    return value;
  } else {
    return run(() => resolve(promise).then(() => value));
  }
}

const helpers = {};
/**
 @module @ember/test
*/

/**
  `registerHelper` is used to register a test helper that will be injected
  when `App.injectTestHelpers` is called.

  The helper method will always be called with the current Application as
  the first parameter.

  For example:

  ```javascript
  import { registerHelper } from '@ember/test';
  import { run } from '@ember/runloop';

  registerHelper('boot', function(app) {
    run(app, app.advanceReadiness);
  });
  ```

  This helper can later be called without arguments because it will be
  called with `app` as the first parameter.

  ```javascript
  import Application from '@ember/application';

  App = Application.create();
  App.injectTestHelpers();
  boot();
  ```

  @public
  @for @ember/test
  @static
  @method registerHelper
  @param {String} name The name of the helper method to add.
  @param {Function} helperMethod
  @param options {Object}
*/
function registerHelper(name, helperMethod) {
  helpers[name] = {
    method: helperMethod,
    meta: {
      wait: false
    }
  };
}

/**
  `registerAsyncHelper` is used to register an async test helper that will be injected
  when `App.injectTestHelpers` is called.

  The helper method will always be called with the current Application as
  the first parameter.

  For example:

  ```javascript
  import { registerAsyncHelper } from '@ember/test';
  import { run } from '@ember/runloop';

  registerAsyncHelper('boot', function(app) {
    run(app, app.advanceReadiness);
  });
  ```

  The advantage of an async helper is that it will not run
  until the last async helper has completed.  All async helpers
  after it will wait for it complete before running.


  For example:

  ```javascript
  import { registerAsyncHelper } from '@ember/test';

  registerAsyncHelper('deletePost', function(app, postId) {
    click('.delete-' + postId);
  });

  // ... in your test
  visit('/post/2');
  deletePost(2);
  visit('/post/3');
  deletePost(3);
  ```

  @public
  @for @ember/test
  @method registerAsyncHelper
  @param {String} name The name of the helper method to add.
  @param {Function} helperMethod
  @since 1.2.0
*/
function registerAsyncHelper(name, helperMethod) {
  helpers[name] = {
    method: helperMethod,
    meta: {
      wait: true
    }
  };
}

/**
  Remove a previously added helper method.

  Example:

  ```javascript
  import { unregisterHelper } from '@ember/test';

  unregisterHelper('wait');
  ```

  @public
  @method unregisterHelper
  @static
  @for @ember/test
  @param {String} name The helper to remove.
*/
function unregisterHelper(name) {
  delete helpers[name];
  // SAFETY: This isn't necessarily a safe thing to do, but in terms of the immediate types here
  // it won't error.
  delete TestPromise.prototype[name];
}

/**
  Used to register callbacks to be fired whenever `App.injectTestHelpers`
  is called.

  The callback will receive the current application as an argument.

  Example:

  ```javascript
  import $ from 'jquery';

  Ember.Test.onInjectHelpers(function() {
    $(document).ajaxSend(function() {
      Test.pendingRequests++;
    });

    $(document).ajaxComplete(function() {
      Test.pendingRequests--;
    });
  });
  ```

  @public
  @for Ember.Test
  @method onInjectHelpers
  @param {Function} callback The function to be called.
*/
function onInjectHelpers(callback) {
}

/**
 @module @ember/test
*/
const contexts = [];
const callbacks = [];

/**
   This allows ember-testing to play nicely with other asynchronous
   events, such as an application that is waiting for a CSS3
   transition or an IndexDB transaction. The waiter runs periodically
   after each async helper (i.e. `click`, `andThen`, `visit`, etc) has executed,
   until the returning result is truthy. After the waiters finish, the next async helper
   is executed and the process repeats.

   For example:

   ```javascript
   import { registerWaiter } from '@ember/test';

   registerWaiter(function() {
     return myPendingTransactions() === 0;
   });
   ```
   The `context` argument allows you to optionally specify the `this`
   with which your callback will be invoked.

   For example:

   ```javascript
   import { registerWaiter } from '@ember/test';

   registerWaiter(MyDB, MyDB.hasPendingTransactions);
   ```

   @public
   @for @ember/test
   @static
   @method registerWaiter
   @param {Object} context (optional)
   @param {Function} callback
   @since 1.2.0
*/

function registerWaiter(
// Formatting makes a pretty big difference in how readable this is.
// prettier-ignore
...args) {
  let checkedCallback;
  let checkedContext;
  if (args.length === 1) {
    checkedContext = null;
    checkedCallback = args[0];
  } else {
    checkedContext = args[0];
    checkedCallback = args[1];
  }
  if (indexOf(checkedContext, checkedCallback) > -1) {
    return;
  }
  contexts.push(checkedContext);
  callbacks.push(checkedCallback);
}

/**
   `unregisterWaiter` is used to unregister a callback that was
   registered with `registerWaiter`.

   @public
   @for @ember/test
   @static
   @method unregisterWaiter
   @param {Object} context (optional)
   @param {Function} callback
   @since 1.2.0
*/
function unregisterWaiter(context, callback) {
  if (!callbacks.length) {
    return;
  }
  if (arguments.length === 1) {
    callback = context;
    context = null;
  }
  let i = indexOf(context, callback);
  if (i === -1) {
    return;
  }
  contexts.splice(i, 1);
  callbacks.splice(i, 1);
}

/**
  Iterates through each registered test waiter, and invokes
  its callback. If any waiter returns false, this method will return
  true indicating that the waiters have not settled yet.

  This is generally used internally from the acceptance/integration test
  infrastructure.

  @public
  @for @ember/test
  @static
  @method checkWaiters
*/
function checkWaiters$1() {
  if (!callbacks.length) {
    return false;
  }
  for (let i = 0; i < callbacks.length; i++) {
    let context = contexts[i];
    let callback = callbacks[i];
    // SAFETY: The loop ensures that this exists
    if (!callback.call(context)) {
      return true;
    }
  }
  return false;
}
function indexOf(context, callback) {
  for (let i = 0; i < callbacks.length; i++) {
    if (callbacks[i] === callback && contexts[i] === context) {
      return i;
    }
  }
  return -1;
}

let adapter;
function getAdapter() {
  return adapter;
}
function setAdapter(value) {
  adapter = value;
  if (value && typeof value.exception === 'function') {
    setDispatchOverride(adapterDispatch);
  } else {
    setDispatchOverride(null);
  }
}
function adapterDispatch(error) {
  adapter.exception(error);

  // @ts-expect-error Normally unreachable
  console.error(error.stack); // eslint-disable-line no-console
}

/**
  @module ember
*/

/**
  This is a container for an assortment of testing related functionality:

  * Choose your default test adapter (for your framework of choice).
  * Register/Unregister additional test helpers.
  * Setup callbacks to be fired when the test helpers are injected into
    your application.

  @class Test
  @namespace Ember
  @public
*/
const Test = {
  /**
    Hash containing all known test helpers.
     @property _helpers
    @private
    @since 1.7.0
  */
  _helpers: helpers,
  registerHelper,
  registerAsyncHelper,
  unregisterHelper,
  onInjectHelpers,
  Promise: TestPromise,
  promise,
  resolve,
  registerWaiter,
  unregisterWaiter,
  checkWaiters: checkWaiters$1
};

/**
 Used to allow ember-testing to communicate with a specific testing
 framework.

 You can manually set it before calling `App.setupForTesting()`.

 Example:

 ```javascript
 Ember.Test.adapter = MyCustomAdapter.create()
 ```

 If you do not set it, ember-testing will default to `Ember.Test.QUnitAdapter`.

 @public
 @for Ember.Test
 @property adapter
 @type {Class} The adapter to be used.
 @default Ember.Test.QUnitAdapter
*/
Object.defineProperty(Test, 'adapter', {
  get: getAdapter,
  set: setAdapter
});

// eslint-disable-next-line require-jsdoc
function isElement(target) {
  return target !== null && typeof target === 'object' && Reflect.get(target, 'nodeType') === Node.ELEMENT_NODE;
}

// eslint-disable-next-line require-jsdoc
function isWindow(target) {
  return target instanceof Window;
}

// eslint-disable-next-line require-jsdoc
function isDocument(target) {
  return target !== null && typeof target === 'object' && Reflect.get(target, 'nodeType') === Node.DOCUMENT_NODE;
}

// eslint-disable-next-line require-jsdoc
function isContentEditable(element) {
  return 'isContentEditable' in element && element.isContentEditable;
}

const FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
/**
  @private
  @param {Element} element the element to check
  @returns {boolean} `true` when the element is a form control, `false` otherwise
*/
function isFormControl(element) {
  return !isWindow(element) && !isDocument(element) && FORM_CONTROL_TAGS.indexOf(element.tagName) > -1 && element.type !== 'hidden';
}

/* globals Promise */

const nextTick = cb => Promise.resolve().then(cb);
const futureTick = setTimeout;

/**
 Returns whether the passed in string consists only of numeric characters.

 @private
 @param {string} n input string
 @returns {boolean} whether the input string consists only of numeric characters
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(Number(n));
}

/**
  Checks if an element is considered visible by the focus area spec.

  @private
  @param {Element} element the element to check
  @returns {boolean} `true` when the element is visible, `false` otherwise
*/
function isVisible(element) {
  const styles = window.getComputedStyle(element);
  return styles.display !== 'none' && styles.visibility !== 'hidden';
}

/**
  Checks if an element is disabled.

  @private
  @param {Element} element the element to check
  @returns {boolean} `true` when the element is disabled, `false` otherwise
*/
function isDisabled(element) {
  if (isFormControl(element)) {
    return element.disabled;
  }
  return false;
}

const TIMEOUTS = [0, 1, 2, 5, 7];
const MAX_TIMEOUT = 10;
/**
  Wait for the provided callback to return a truthy value.

  This does not leverage `settled()`, and as such can be used to manage async
  while _not_ settled (e.g. "loading" or "pending" states).

  @public
  @param {Function} callback the callback to use for testing when waiting should stop
  @param {Object} [options] options used to override defaults
  @param {number} [options.timeout=1000] the maximum amount of time to wait
  @param {string} [options.timeoutMessage='waitUntil timed out'] the message to use in the reject on timeout
  @returns {Promise} resolves with the callback value when it returns a truthy value

  @example
  <caption>
    Waiting until a selected element displays text:
  </caption>
  await waitUntil(function() {
    return find('.my-selector').textContent.includes('something')
  }, { timeout: 2000 })
*/
function waitUntil(callback, options = {}) {
  const timeout = 'timeout' in options ? options.timeout : 1000;
  const timeoutMessage = 'timeoutMessage' in options ? options.timeoutMessage : 'waitUntil timed out';

  // creating this error eagerly so it has the proper invocation stack
  const waitUntilTimedOut = new Error(timeoutMessage);
  return new Promise(function (resolve, reject) {
    let time = 0;

    // eslint-disable-next-line require-jsdoc
    function scheduleCheck(timeoutsIndex) {
      const knownTimeout = TIMEOUTS[timeoutsIndex];
      const interval = knownTimeout === undefined ? MAX_TIMEOUT : knownTimeout;
      futureTick(function () {
        time += interval;
        let value;
        try {
          value = callback();
        } catch (error) {
          reject(error);
          return;
        }
        if (value) {
          resolve(value);
        } else if (time < timeout) {
          scheduleCheck(timeoutsIndex + 1);
        } else {
          reject(waitUntilTimedOut);
          return;
        }
      }, interval);
    }
    scheduleCheck(0);
  });
}

/* globals global */

var global$1 = (() => {
  if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
    // @ts-ignore -- global does not exist
  } else if (typeof global !== 'undefined') {
    // @ts-ignore -- global does not exist
    return global;
  } else {
    return Function('return this')();
  }
})();

class TestMetadata {
  testName;
  setupTypes;
  usedHelpers;
  constructor() {
    this.setupTypes = [];
    this.usedHelpers = [];
  }
  get isRendering() {
    return this.setupTypes.indexOf('setupRenderingContext') > -1 && this.usedHelpers.indexOf('render') > -1;
  }
  get isApplication() {
    return this.setupTypes.indexOf('setupApplicationContext') > -1;
  }
}

// Only export the type side of the item: this way the only way (it is legal) to
// construct it is here, but users can still reference the type.

const TEST_METADATA = new WeakMap();

/**
 * Gets the test metadata associated with the provided test context. Will create
 * a new test metadata object if one does not exist.
 *
 * @param {BaseContext} context the context to use
 * @returns {TestMetadata} the test metadata for the provided context
 */
function getTestMetadata(context) {
  if (!TEST_METADATA.has(context)) {
    TEST_METADATA.set(context, new TestMetadata());
  }
  return TEST_METADATA.get(context);
}

/**
 *
 * detect if a value appears to be a promise
 *
 * @private
 * @param {any} [maybePromise] the value being considered to be a promise
 * @return {boolean} true if the value appears to be a promise, or false otherwise
 */
function isPromise(maybePromise) {
  return maybePromise !== null && (typeof maybePromise === 'object' || typeof maybePromise === 'function') && typeof maybePromise.then === 'function';
}

const DEPRECATIONS = new WeakMap();

/**
 *
 * Provides the list of deprecation failures associated with a given base context;
 *
 * @private
 * @param {BaseContext} [context] the test context
 * @return {Array<DeprecationFailure>} the Deprecation Failures associated with the corresponding BaseContext;
 */
function getDeprecationsForContext(context) {
  if (!context) {
    throw new TypeError(`[@ember/test-helpers] could not get deprecations for an invalid test context: '${context}'`);
  }
  let deprecations = DEPRECATIONS.get(context);
  if (!Array.isArray(deprecations)) {
    deprecations = [];
    DEPRECATIONS.set(context, deprecations);
  }
  return deprecations;
}

/**
 *
 * Provides the list of deprecation failures associated with a given base
 * context which occur while a callback is executed. This callback can be
 * synchronous, or it can be an async function.
 *
 * @private
 * @param {BaseContext} [context] the test context
 * @param {Function} [callback] The callback that when executed will have its DeprecationFailure recorded
 * @return {Array<DeprecationFailure>} The Deprecation Failures associated with the corresponding baseContext which occurred while the CallbackFunction was executed
 */
function getDeprecationsDuringCallbackForContext(context, callback) {
  if (!context) {
    throw new TypeError(`[@ember/test-helpers] could not get deprecations for an invalid test context: '${context}'`);
  }
  const deprecations = getDeprecationsForContext(context);
  const previousLength = deprecations.length;
  const result = callback();
  if (isPromise(result)) {
    return Promise.resolve(result).then(() => {
      return deprecations.slice(previousLength); // only return deprecations created as a result of the callback
    });
  } else {
    return deprecations.slice(previousLength); // only return deprecations created as a result of the callback
  }
}

// This provides (when the environment supports) queryParam support for deprecations:
// * squelch deprecations by name via: `/tests/index.html?disabledDeprecations=this-property-fallback,some-other-thing`
// * enable a debuggger when a deprecation by a specific name is encountered via: `/tests/index.html?debugDeprecations=some-other-thing` when the
if (typeof URLSearchParams !== 'undefined') {
  const queryParams = new URLSearchParams(document.location.search.substring(1));
  queryParams.get('disabledDeprecations');
  queryParams.get('debugDeprecations');
}

// the WARNINGS data structure which is used to weakly associated warnings with
// the test context their occurred within
const WARNINGS = new WeakMap();

/**
 *
 * Provides the list of warnings associated with a given base context;
 *
 * @private
 * @param {BaseContext} [context] the test context
 * @return {Array<Warning>} the warnings associated with the corresponding BaseContext;
 */
function getWarningsForContext(context) {
  if (!context) {
    throw new TypeError(`[@ember/test-helpers] could not get warnings for an invalid test context: '${context}'`);
  }
  let warnings = WARNINGS.get(context);
  if (!Array.isArray(warnings)) {
    warnings = [];
    WARNINGS.set(context, warnings);
  }
  return warnings;
}

/**
 *
 * Provides the list of warnings associated with a given test context which
 * occurred only while a the provided callback is executed. This callback can be
 * synchronous, or it can be an async function.
 *
 * @private
 * @param {BaseContext} [context] the test context
 * @param {Function} [callback] The callback that when executed will have its warnings recorded
 * @return {Array<Warning>} The warnings associated with the corresponding baseContext which occurred while the CallbackFunction was executed
 */
function getWarningsDuringCallbackForContext(context, callback) {
  if (!context) {
    throw new TypeError(`[@ember/test-helpers] could not get warnings for an invalid test context: '${context}'`);
  }
  const warnings = getWarningsForContext(context);
  const previousLength = warnings.length;
  const result = callback();
  if (isPromise(result)) {
    return Promise.resolve(result).then(() => {
      return warnings.slice(previousLength); // only return warnings created as a result of the callback
    });
  } else {
    return warnings.slice(previousLength); // only return warnings created as a result of the callback
  }
}

// This provides (when the environment supports) queryParam support for warnings:
// * squelch warnings by name via: `/tests/index.html?disabledWarnings=this-property-fallback,some-other-thing`
// * enable a debuggger when a warning by a specific name is encountered via: `/tests/index.html?debugWarnings=some-other-thing` when the
if (typeof URLSearchParams !== 'undefined') {
  const queryParams = new URLSearchParams(document.location.search.substring(1));
  queryParams.get('disabledWarnings');
  queryParams.get('debugWarnings');
}

const registeredHooks = new Map();

/**
 * @private
 * @param {string} helperName The name of the test helper in which to run the hook.
 * @param {string} label A label to help identify the hook.
 * @returns {string} The compound key for the helper.
 */
function getHelperKey(helperName, label) {
  return `${helperName}:${label}`;
}

/**
 * Registers a function to be run during the invocation of a test helper.
 *
 * @param {string} helperName The name of the test helper in which to run the hook.
 *                            Test helper names include `blur`, `click`, `doubleClick`, `fillIn`,
 *                            `fireEvent`, `focus`, `render`, `scrollTo`, `select`, `tab`, `tap`, `triggerEvent`,
 *                            `triggerKeyEvent`, `typeIn`, and `visit`.
 * @param {string} label A label to help identify the hook. Built-in labels include `start`, `end`,
 *                       and `targetFound`, the former designating either the start or end of
 *                       the helper invocation.
 * @param {Function} hook The hook function to run when the test helper is invoked.
 * @returns {HookUnregister} An object containing an `unregister` function that unregisters
 *                           the specific hook initially registered to the helper.
 * @example
 * <caption>
 *   Registering a hook for the `end` point of the `click` test helper invocation
 * </caption>
 *
 * const hook = registerHook('click', 'end', () => {
 *   console.log('Running `click:end` test helper hook');
 * });
 *
 * // Unregister the hook at some later point in time
 * hook.unregister();
 */
function registerHook(helperName, label, hook) {
  const helperKey = getHelperKey(helperName, label);
  let hooksForHelper = registeredHooks.get(helperKey);
  if (hooksForHelper === undefined) {
    hooksForHelper = new Set();
    registeredHooks.set(helperKey, hooksForHelper);
  }
  hooksForHelper.add(hook);
  return {
    unregister() {
      hooksForHelper.delete(hook);
    }
  };
}

/**
 * Runs all hooks registered for a specific test helper.
 *
 * @param {string} helperName The name of the test helper in which to run the hook.
 *                            Test helper names include `blur`, `click`, `doubleClick`, `fillIn`,
 *                            `fireEvent`, `focus`, `render`, `scrollTo`, `select`, `tab`, `tap`, `triggerEvent`,
 *                            `triggerKeyEvent`, `typeIn`, and `visit`.
 * @param {string} label A label to help identify the hook. Built-in labels include `start`, `end`,
 *                       and `targetFound`, the former designating either the start or end of
 *                       the helper invocation.
 * @param {unknown[]} args Any arguments originally passed to the test helper.
 * @returns {Promise<void>} A promise representing the serial invocation of the hooks.
 */
function runHooks(helperName, label, ...args) {
  const hooks = registeredHooks.get(getHelperKey(helperName, label)) || new Set();
  const promises = [];
  hooks.forEach(hook => {
    const hookResult = hook(...args);
    promises.push(hookResult);
  });
  return Promise.all(promises).then(() => {});
}

const debugInfoHelpers = new Set();

/**
 * Registers a custom debug info helper to augment the output for test isolation validation.
 *
 * @public
 * @param {DebugInfoHelper} debugHelper a custom debug info helper
 * @example
 *
 * import { registerDebugInfoHelper } from '@ember/test-helpers';
 *
 * registerDebugInfoHelper({
 *   name: 'Date override detection',
 *   log() {
 *     if (dateIsOverridden()) {
 *       console.log(this.name);
 *       console.log('The date object has been overridden');
 *     }
 *   }
 * })
 */
function registerDebugInfoHelper(debugHelper) {
  debugInfoHelpers.add(debugHelper);
}

// @ts-ignore: this is private API. This import will work Ember 5.1+ since it
// "provides" this public API, but does not for earlier versions. As a result,
// this type will be `any`.
const PENDING_AJAX_REQUESTS = 'Pending AJAX requests';
const PENDING_TEST_WAITERS = 'Pending test waiters';
const SCHEDULED_ASYNC = 'Scheduled async';
const SCHEDULED_AUTORUN = 'Scheduled autorun';

/**
 * The base functionality which may be present on the `SettledState` interface
 * in the `settled` module (**not** the one in this module).
 */

/**
 * Determines if the `getDebugInfo` method is available in the
 * running verison of backburner.
 *
 * @returns {boolean} True if `getDebugInfo` is present in backburner, otherwise false.
 */
function backburnerDebugInfoAvailable() {
  return typeof _backburner.getDebugInfo === 'function';
}

/**
 * Retrieves debug information from backburner's current deferred actions queue (runloop instance).
 * If the `getDebugInfo` method isn't available, it returns `null`.
 *
 * @public
 * @returns {MaybeDebugInfo | null} Backburner debugInfo or, if the getDebugInfo method is not present, null
 */
function getDebugInfo() {
  return _backburner.DEBUG === true && backburnerDebugInfoAvailable() ? _backburner.getDebugInfo() : null;
}

/**
 * Encapsulates debug information for an individual test. Aggregates information
 * from:
 * - info provided by getSettledState
 *    - hasPendingTimers
 *    - hasRunLoop
 *    - hasPendingWaiters
 *    - hasPendingRequests
 * - info provided by backburner's getDebugInfo method (timers, schedules, and stack trace info)
 *
 */
class TestDebugInfo {
  _settledState;
  _debugInfo;
  _summaryInfo = undefined;
  constructor(settledState, debugInfo = getDebugInfo()) {
    this._settledState = settledState;
    this._debugInfo = debugInfo;
  }
  get summary() {
    if (!this._summaryInfo) {
      this._summaryInfo = {
        ...this._settledState
      };
      if (this._debugInfo) {
        this._summaryInfo.autorunStackTrace = this._debugInfo.autorun && this._debugInfo.autorun.stack;
        this._summaryInfo.pendingTimersCount = this._debugInfo.timers.length;
        this._summaryInfo.hasPendingTimers = this._settledState.hasPendingTimers && this._summaryInfo.pendingTimersCount > 0;
        this._summaryInfo.pendingTimersStackTraces = this._debugInfo.timers.map(timer => timer.stack);
        this._summaryInfo.pendingScheduledQueueItemCount = this._debugInfo.instanceStack.filter(isNotNullable).reduce((total, item) => {
          Object.values(item).forEach(queueItems => {
            // SAFETY: this cast is required for versions of Ember which do
            // not supply a correct definition of these types. It should
            // also be compatible with the version where Ember *does* supply
            // the types correctly.
            total += queueItems?.length ?? 0;
          });
          return total;
        }, 0);
        this._summaryInfo.pendingScheduledQueueItemStackTraces = this._debugInfo.instanceStack.filter(isNotNullable).reduce((stacks, deferredActionQueues) => {
          Object.values(deferredActionQueues).forEach(queueItems => {
            // SAFETY: this cast is required for versions of Ember which do
            // not supply a correct definition of these types. It should
            // also be compatible with the version where Ember *does* supply
            // the types correctly.
            queueItems?.forEach(queueItem => queueItem.stack && stacks.push(queueItem.stack));
          });
          return stacks;
        }, []);
      }
      if (this._summaryInfo.hasPendingTestWaiters) {
        this._summaryInfo.pendingTestWaiterInfo = getPendingWaiterState();
      }
    }
    return this._summaryInfo;
  }
  toConsole(_console = console) {
    const summary = this.summary;
    if (summary.hasPendingRequests) {
      _console.log(PENDING_AJAX_REQUESTS);
    }
    if (summary.hasPendingLegacyWaiters) {
      _console.log(PENDING_TEST_WAITERS);
    }
    if (summary.hasPendingTestWaiters) {
      if (!summary.hasPendingLegacyWaiters) {
        _console.log(PENDING_TEST_WAITERS);
      }
      Object.keys(summary.pendingTestWaiterInfo.waiters).forEach(waiterName => {
        const waiterDebugInfo = summary.pendingTestWaiterInfo.waiters[waiterName];
        if (Array.isArray(waiterDebugInfo)) {
          _console.group(waiterName);
          waiterDebugInfo.forEach(debugInfo => {
            _console.log(`${debugInfo.label ? debugInfo.label : 'stack'}: ${debugInfo.stack}`);
          });
          _console.groupEnd();
        } else {
          _console.log(waiterName);
        }
      });
    }
    if (summary.hasPendingTimers || summary.pendingScheduledQueueItemCount > 0) {
      _console.group(SCHEDULED_ASYNC);
      summary.pendingTimersStackTraces.forEach(timerStack => {
        _console.log(timerStack);
      });
      summary.pendingScheduledQueueItemStackTraces.forEach(scheduleQueueItemStack => {
        _console.log(scheduleQueueItemStack);
      });
      _console.groupEnd();
    }
    if (summary.hasRunLoop && summary.pendingTimersCount === 0 && summary.pendingScheduledQueueItemCount === 0) {
      _console.log(SCHEDULED_AUTORUN);
      if (summary.autorunStackTrace) {
        _console.log(summary.autorunStackTrace);
      }
    }
    debugInfoHelpers.forEach(helper => {
      helper.log();
    });
  }
  _formatCount(title, count) {
    return `${title}: ${count}`;
  }
}

// eslint-disable-next-line require-jsdoc, @typescript-eslint/no-empty-object-type
function isNotNullable(value) {
  return value != null;
}

const CAN_USE_ROUTER_EVENTS = hasEmberVersion(3, 6);
let routerTransitionsPending = null;
const ROUTER = new WeakMap();
const HAS_SETUP_ROUTER = new WeakMap();

// eslint-disable-next-line require-jsdoc
function isApplicationTestContext(context) {
  return isTestContext(context);
}

/**
  Determines if we have any pending router transitions (used to determine `settled` state)

  @public
  @returns {(boolean|null)} if there are pending transitions
*/
function hasPendingTransitions() {
  if (CAN_USE_ROUTER_EVENTS) {
    return routerTransitionsPending;
  }
  const context = getContext();

  // there is no current context, we cannot check
  if (context === undefined) {
    return null;
  }
  const router = ROUTER.get(context);
  if (router === undefined) {
    // if there is no router (e.g. no `visit` calls made yet), we cannot
    // check for pending transitions but this is explicitly not an error
    // condition
    return null;
  }
  const routerMicrolib = router._routerMicrolib || router.router;
  if (routerMicrolib === undefined) {
    return null;
  }
  return !!routerMicrolib.activeTransition;
}

/**
  Setup the current router instance with settledness tracking. Generally speaking this
  is done automatically (during a `visit('/some-url')` invocation), but under some
  circumstances (e.g. a non-application test where you manually call `this.owner.setupRouter()`)
  you may want to call it yourself.

  @public
 */
function setupRouterSettlednessTracking() {
  const context = getContext();
  if (context === undefined || !isTestContext(context)) {
    throw new Error('Cannot setupRouterSettlednessTracking outside of a test context');
  }

  // avoid setting up many times for the same context
  if (HAS_SETUP_ROUTER.get(context)) {
    return;
  }
  HAS_SETUP_ROUTER.set(context, true);
  const {
    owner
  } = context;
  let router;
  if (CAN_USE_ROUTER_EVENTS) {
    // SAFETY: unfortunately we cannot `assert` here at present because the
    // class is not exported, only the type, since it is not designed to be
    // sub-classed. The most we can do at present is assert that it at least
    // *exists* and assume that if it does exist, it is bound correctly.
    const routerService = owner.lookup('service:router');
    router = routerService;

    // track pending transitions via the public routeWillChange / routeDidChange APIs
    // routeWillChange can fire many times and is only useful to know when we have _started_
    // transitioning, we can then use routeDidChange to signal that the transition has settled
    router.on('routeWillChange', () => routerTransitionsPending = true);
    router.on('routeDidChange', () => routerTransitionsPending = false);
  } else {
    // SAFETY: similarly, this cast cannot be made safer because on the versions
    // where we fall into this path, this is *also* not an exported class.
    const mainRouter = owner.lookup('router:main');
    router = mainRouter;
    ROUTER.set(context, router);
  }

  // hook into teardown to reset local settledness state
  const ORIGINAL_WILL_DESTROY = router.willDestroy;
  router.willDestroy = function () {
    routerTransitionsPending = null;
    return ORIGINAL_WILL_DESTROY.call(this);
  };
}

/**
  Navigate the application to the provided URL.

  @public
  @param {string} url The URL to visit (e.g. `/posts`)
  @param {object} options app boot options
  @returns {Promise<void>} resolves when settled

  @example
  <caption>
    Visiting the route for post 1.
  </caption>
  await visit('/posts/1');

  @example
  <caption>
    Visiting the route for post 1 while also providing the `rootElement` app boot option.
  </caption>
  await visit('/', { rootElement: '#container' });
*/
function visit(url, options) {
  const context = getContext();
  if (!context || !isApplicationTestContext(context)) {
    throw new Error('Cannot call `visit` without having first called `setupApplicationContext`.');
  }
  const {
    owner
  } = context;
  const testMetadata = getTestMetadata(context);
  testMetadata.usedHelpers.push('visit');
  return Promise.resolve().then(() => {
    return runHooks('visit', 'start', url, options);
  }).then(() => {
    const visitResult = owner.visit(url, options);
    setupRouterSettlednessTracking();
    return visitResult;
  }).then(() => {
    context.element = document.querySelector('#ember-testing');
  }).then(settled).then(() => {
    return runHooks('visit', 'end', url, options);
  });
}

/**
  @public
  @returns {string} the currently active route name
*/
function currentRouteName() {
  const context = getContext();
  if (!context || !isApplicationTestContext(context)) {
    throw new Error('Cannot call `currentRouteName` without having first called `setupApplicationContext`.');
  }
  const router = context.owner.lookup('router:main');
  const currentRouteName = router.currentRouteName;
  return currentRouteName;
}
const HAS_CURRENT_URL_ON_ROUTER = hasEmberVersion(2, 13);

/**
  @public
  @returns {string} the applications current url
*/
function currentURL() {
  const context = getContext();
  if (!context || !isApplicationTestContext(context)) {
    throw new Error('Cannot call `currentURL` without having first called `setupApplicationContext`.');
  }
  const router = context.owner.lookup('router:main');
  if (HAS_CURRENT_URL_ON_ROUTER) {
    const routerCurrentURL = router.currentURL;

    // SAFETY: this path is a lie for the sake of the public-facing types. The
    // framework itself sees this path, but users never do. A user who calls the
    // API without calling `visit()` will see an `UnrecognizedURLError`, rather
    // than getting back `null`.
    if (routerCurrentURL === null) {
      return routerCurrentURL;
    }
    return routerCurrentURL;
  } else {
    // SAFETY: this is *positively ancient* and should probably be removed at
    // some point; old routers which don't have `currentURL` *should* have a
    // `location` with `getURL()` per the docs for 2.12.
    return router.location.getURL();
  }
}

/**
  Used by test framework addons to setup the provided context for working with
  an application (e.g. routing).

  `setupContext` must have been run on the provided context prior to calling
  `setupApplicationContext`.

  Sets up the basic framework used by application tests.

  @public
  @param {Object} context the context to setup
  @returns {Promise<void>} resolves when the context is set up
*/
function setupApplicationContext(context) {
  const testMetadata = getTestMetadata(context);
  testMetadata.setupTypes.push('setupApplicationContext');
  return Promise.resolve();
}

// @ts-ignore: this is private API. This import will work Ember 5.1+ since it
// "provides" this public API, but does not for earlier versions. As a result,
// this type will be `any`.
let requests;
const checkWaiters = Test.checkWaiters;

/**
  @private
  @returns {number} the count of pending requests
*/
function pendingRequests() {
  return requests !== undefined ? requests.length : 0;
}

/**
  @private
  @param {Event} event (unused)
  @param {XMLHTTPRequest} xhr the XHR that has initiated a request
*/
function incrementAjaxPendingRequests(event, xhr) {
  requests.push(xhr);
}

/**
  @private
  @param {Event} event (unused)
  @param {XMLHTTPRequest} xhr the XHR that has initiated a request
*/
function decrementAjaxPendingRequests(event, xhr) {
  // In most Ember versions to date (current version is 2.16) RSVP promises are
  // configured to flush in the actions queue of the Ember run loop, however it
  // is possible that in the future this changes to use "true" micro-task
  // queues.
  //
  // The entire point here, is that _whenever_ promises are resolved will be
  // before the next run of the JS event loop. Then in the next event loop this
  // counter will decrement. In the specific case of AJAX, this means that any
  // promises chained off of `$.ajax` will properly have their `.then` called
  // _before_ this is decremented (and testing continues)
  nextTick(() => {
    for (let i = 0; i < requests.length; i++) {
      if (xhr === requests[i]) {
        requests.splice(i, 1);
      }
    }
  });
}

/**
  Clears listeners that were previously setup for `ajaxSend` and `ajaxComplete`.

  @private
*/
function _teardownAJAXHooks() {
  // jQuery will not invoke `ajaxComplete` if
  //    1. `transport.send` throws synchronously and
  //    2. it has an `error` option which also throws synchronously

  // We can no longer handle any remaining requests
  requests = [];
  if (typeof globalThis.jQuery === 'undefined') {
    return;
  }
  globalThis.jQuery(document).off('ajaxSend', incrementAjaxPendingRequests);
  globalThis.jQuery(document).off('ajaxComplete', decrementAjaxPendingRequests);
}

/**
  Sets up listeners for `ajaxSend` and `ajaxComplete`.

  @private
*/
function _setupAJAXHooks() {
  requests = [];
  if (typeof globalThis.jQuery === 'undefined') {
    return;
  }
  globalThis.jQuery(document).on('ajaxSend', incrementAjaxPendingRequests);
  globalThis.jQuery(document).on('ajaxComplete', decrementAjaxPendingRequests);
}
/**
  Check various settledness metrics, and return an object with the following properties:

  - `hasRunLoop` - Checks if a run-loop has been started. If it has, this will
    be `true` otherwise it will be `false`.
  - `hasPendingTimers` - Checks if there are scheduled timers in the run-loop.
    These pending timers are primarily registered by `Ember.run.schedule`. If
    there are pending timers, this will be `true`, otherwise `false`.
  - `hasPendingWaiters` - Checks if any registered test waiters are still
    pending (e.g. the waiter returns `true`). If there are pending waiters,
    this will be `true`, otherwise `false`.
  - `hasPendingRequests` - Checks if there are pending AJAX requests (based on
    `ajaxSend` / `ajaxComplete` events triggered by `jQuery.ajax`). If there
    are pending requests, this will be `true`, otherwise `false`.
  - `hasPendingTransitions` - Checks if there are pending route transitions. If the
    router has not been instantiated / setup for the test yet this will return `null`,
    if there are pending transitions, this will be `true`, otherwise `false`.
  - `pendingRequestCount` - The count of pending AJAX requests.
  - `debugInfo` - Debug information that's combined with info return from backburner's
    getDebugInfo method.
  - `isRenderPending` - Checks if there are any pending render operations. This will be true as long
    as there are tracked values in the template that have not been rerendered yet.

  @public
  @returns {Object} object with properties for each of the metrics used to determine settledness
*/
function getSettledState() {
  const hasPendingTimers = _backburner.hasTimers();
  const hasRunLoop = Boolean(_backburner.currentInstance);
  const hasPendingLegacyWaiters = checkWaiters();
  const hasPendingTestWaiters = hasPendingWaiters();
  const pendingRequestCount = pendingRequests();
  const hasPendingRequests = pendingRequestCount > 0;
  // TODO: Ideally we'd have a function in Ember itself that can synchronously identify whether
  // or not there are any pending render operations, but this will have to suffice for now
  const isRenderPending = !!hasRunLoop;
  return {
    hasPendingTimers,
    hasRunLoop,
    hasPendingWaiters: hasPendingLegacyWaiters || hasPendingTestWaiters,
    hasPendingRequests,
    hasPendingTransitions: hasPendingTransitions(),
    isRenderPending,
    pendingRequestCount,
    debugInfo: new TestDebugInfo({
      hasPendingTimers,
      hasRunLoop,
      hasPendingLegacyWaiters,
      hasPendingTestWaiters,
      hasPendingRequests,
      isRenderPending
    })
  };
}

/**
  Checks various settledness metrics (via `getSettledState()`) to determine if things are settled or not.

  Settled generally means that there are no pending timers, no pending waiters,
  no pending AJAX requests, and no current run loop. However, new settledness
  metrics may be added and used as they become available.

  @public
  @returns {boolean} `true` if settled, `false` otherwise
*/
function isSettled() {
  const {
    hasPendingTimers,
    hasRunLoop,
    hasPendingRequests,
    hasPendingWaiters,
    hasPendingTransitions,
    isRenderPending
  } = getSettledState();
  if (hasPendingTimers || hasRunLoop || hasPendingRequests || hasPendingWaiters || hasPendingTransitions || isRenderPending) {
    return false;
  }
  return true;
}

/**
  Returns a promise that resolves when in a settled state (see `isSettled` for
  a definition of "settled state").

  @public
  @returns {Promise<void>} resolves when settled
*/
function settled() {
  return waitUntil(isSettled, {
    timeout: Infinity
  }).then(() => {});
}
const cachedOnerror = new Map();

/**
 * Sets the `Ember.onerror` function for tests. This value is intended to be reset after
 * each test to ensure correct test isolation. To reset, you should simply call `setupOnerror`
 * without an `onError` argument.
 *
 * @public
 * @param {Function} onError the onError function to be set on Ember.onerror
 *
 * @example <caption>Example implementation for `ember-qunit` or `ember-mocha`</caption>
 *
 * import { setupOnerror } from '@ember/test-helpers';
 *
 * test('Ember.onerror is stubbed properly', function(assert) {
 *   setupOnerror(function(err) {
 *     assert.ok(err);
 *   });
 * });
 */
function setupOnerror(onError) {
  const context = getContext();
  if (!context) {
    throw new Error('Must setup test context before calling setupOnerror');
  }
  if (!cachedOnerror.has(context)) {
    throw new Error('_cacheOriginalOnerror must be called before setupOnerror. Normally, this will happen as part of your test harness.');
  }
  if (typeof onError !== 'function') {
    onError = cachedOnerror.get(context);
  }
  setOnerror(onError);
}

/**
 * Resets `Ember.onerror` to the value it originally was at the start of the test run.
 * If there is no context or cached value this is a no-op.
 *
 * @public
 *
 * @example
 *
 * import { resetOnerror } from '@ember/test-helpers';
 *
 * QUnit.testDone(function() {
 *   resetOnerror();
 * })
 */
function resetOnerror() {
  const context = getContext();
  if (context && cachedOnerror.has(context)) {
    setOnerror(cachedOnerror.get(context));
  }
}

/**
 * Caches the current value of Ember.onerror. When `setupOnerror` is called without a value
 * or when `resetOnerror` is called the value will be set to what was cached here.
 *
 * @private
 * @param {BaseContext} context the text context
 */
function _prepareOnerror(context) {
  if (cachedOnerror.has(context)) {
    throw new Error('_prepareOnerror should only be called once per-context');
  }

  // SAFETY: getOnerror doesn't have correct types
  cachedOnerror.set(context, getOnerror());
}

/**
 * Removes the cached value of Ember.onerror.
 *
 * @private
 * @param {BaseContext} context the text context
 */
function _cleanupOnerror(context) {
  resetOnerror();
  cachedOnerror.delete(context);
}

/**
 * The public API for the test context, which test authors can depend on being
 * available.
 *
 * Note: this is *not* user-constructible; it becomes available by calling
 * `setupContext()` with a base context object.
 */

// eslint-disable-next-line require-jsdoc
function isTestContext(context) {
  const maybeContext = context;
  return typeof maybeContext['pauseTest'] === 'function' && typeof maybeContext['resumeTest'] === 'function';
}

/**
  @private
  @param {Object} it the global object to test
  @returns {Boolean} it exists
*/
function check(it) {
  // Math is known to exist as a global in every environment.
  return it && it.Math === Math && it;
}
const globalObject = check(typeof globalThis == 'object' && globalThis) || check(typeof window === 'object' && window) || check(typeof self === 'object' && self) ||
// @ts-ignore -- global does not exist
check(typeof global$1 === 'object' && global$1);

/**
  Stores the provided context as the "global testing context".

  Generally setup automatically by `setupContext`.

  @public
  @param {Object} context the context to use
*/
function setContext(context) {
  globalObject.__test_context__ = context;
}

/**
  Retrieve the "global testing context" as stored by `setContext`.

  @public
  @returns {Object} the previously stored testing context
*/
function getContext() {
  return globalObject.__test_context__;
}

/**
  Clear the "global testing context".

  Generally invoked from `teardownContext`.

  @public
*/
function unsetContext() {
  globalObject.__test_context__ = undefined;
}

/**
 * Returns a promise to be used to pauses the current test (due to being
 * returned from the test itself).  This is useful for debugging while testing
 * or for test-driving.  It allows you to inspect the state of your application
 * at any point.
 *
 * The test framework wrapper (e.g. `ember-qunit` or `ember-mocha`) should
 * ensure that when `pauseTest()` is used, any framework specific test timeouts
 * are disabled.
 *
 * @public
 * @returns {Promise<void>} resolves _only_ when `resumeTest()` is invoked
 * @example <caption>Usage via ember-qunit</caption>
 *
 * import { setupRenderingTest } from 'ember-qunit';
 * import { render, click, pauseTest } from '@ember/test-helpers';
 *
 *
 * module('awesome-sauce', function(hooks) {
 *   setupRenderingTest(hooks);
 *
 *   test('does something awesome', async function(assert) {
 *     await render(hbs`{{awesome-sauce}}`);
 *
 *     // added here to visualize / interact with the DOM prior
 *     // to the interaction below
 *     await pauseTest();
 *
 *     click('.some-selector');
 *
 *     assert.equal(this.element.textContent, 'this sauce is awesome!');
 *   });
 * });
 */
function pauseTest() {
  const context = getContext();
  if (!context || !isTestContext(context)) {
    throw new Error('Cannot call `pauseTest` without having first called `setupTest` or `setupRenderingTest`.');
  }
  return context.pauseTest();
}

/**
  Resumes a test previously paused by `await pauseTest()`.

  @public
*/
function resumeTest() {
  const context = getContext();
  if (!context || !isTestContext(context)) {
    throw new Error('Cannot call `resumeTest` without having first called `setupTest` or `setupRenderingTest`.');
  }
  context.resumeTest();
}

/**
 * Returns deprecations which have occurred so far for a the current test context
 *
 * @public
 * @returns {Array<DeprecationFailure>} An array of deprecation messages
 * @example <caption>Usage via ember-qunit</caption>
 *
 * import { getDeprecations } from '@ember/test-helpers';
 *
 * module('awesome-sauce', function(hooks) {
 *   setupRenderingTest(hooks);
 *
 *   test('does something awesome', function(assert) {
       const deprecations = getDeprecations() // => returns deprecations which have occurred so far in this test
 *   });
 * });
 */
function getDeprecations() {
  const context = getContext();
  if (!context) {
    throw new Error('[@ember/test-helpers] could not get deprecations if no test context is currently active');
  }
  return getDeprecationsForContext(context);
}
/**
 * Returns deprecations which have occurred so far for a the current test context
 *
 * @public
 * @param {Function} [callback] The callback that when executed will have its DeprecationFailure recorded
 * @returns {Array<DeprecationFailure> | Promise<Array<DeprecationFailure>>} An array of deprecation messages
 * @example <caption>Usage via ember-qunit</caption>
 *
 * import { getDeprecationsDuringCallback } from '@ember/test-helpers';
 *
 * module('awesome-sauce', function(hooks) {
 *   setupRenderingTest(hooks);
 *
 *   test('does something awesome', function(assert) {
 *     const deprecations = getDeprecationsDuringCallback(() => {
 *       // code that might emit some deprecations
 *
 *     }); // => returns deprecations which occurred while the callback was invoked
 *   });
 *
 *
 *   test('does something awesome', async function(assert) {
 *     const deprecations = await getDeprecationsDuringCallback(async () => {
 *       // awaited code that might emit some deprecations
 *     }); // => returns deprecations which occurred while the callback was invoked
 *   });
 * });
 */
function getDeprecationsDuringCallback(callback) {
  const context = getContext();
  if (!context) {
    throw new Error('[@ember/test-helpers] could not get deprecations if no test context is currently active');
  }
  return getDeprecationsDuringCallbackForContext(context, callback);
}

/**
 * Returns warnings which have occurred so far for a the current test context
 *
 * @public
 * @returns {Array<Warning>} An array of warnings
 * @example <caption>Usage via ember-qunit</caption>
 *
 * import { getWarnings } from '@ember/test-helpers';
 *
 * module('awesome-sauce', function(hooks) {
 *   setupRenderingTest(hooks);
 *
 *   test('does something awesome', function(assert) {
       const warnings = getWarnings() // => returns warnings which have occurred so far in this test
 *   });
 * });
 */
function getWarnings() {
  const context = getContext();
  if (!context) {
    throw new Error('[@ember/test-helpers] could not get warnings if no test context is currently active');
  }
  return getWarningsForContext(context);
}
/**
 * Returns warnings which have occurred so far for a the current test context
 *
 * @public
 * @param {Function} [callback] The callback that when executed will have its warnings recorded
 * @returns {Array<Warning> | Promise<Array<Warning>>} An array of warnings information
 * @example <caption>Usage via ember-qunit</caption>
 *
 * import { getWarningsDuringCallback } from '@ember/test-helpers';
 * import { warn } from '@ember/debug';
 *
 * module('awesome-sauce', function(hooks) {
 *   setupRenderingTest(hooks);
 *
 *   test('does something awesome', function(assert) {
 *     const warnings = getWarningsDuringCallback(() => {
 *     warn('some warning');
 *
 *     }); // => returns warnings which occurred while the callback was invoked
 *   });
 *
 *   test('does something awesome', async function(assert) {
 *     warn('some warning');
 *
 *     const warnings = await getWarningsDuringCallback(async () => {
 *       warn('some other warning');
 *     }); // => returns warnings which occurred while the callback was invoked
 *   });
 * });
 */
function getWarningsDuringCallback(callback) {
  const context = getContext();
  if (!context) {
    throw new Error('[@ember/test-helpers] could not get warnings if no test context is currently active');
  }
  return getWarningsDuringCallbackForContext(context, callback);
}

/**
  Used by test framework addons to setup the provided context for testing.

  Responsible for:

  - sets the "global testing context" to the provided context (`setContext`)
  - create an owner object and set it on the provided context (e.g. `this.owner`)
  - setup `this.set`, `this.setProperties`, `this.get`, and `this.getProperties` to the provided context
  - setting up AJAX listeners
  - setting up `pauseTest` (also available as `this.pauseTest()`) and `resumeTest` helpers

  @public
  @param {Object} base the context to setup
  @param {Object} [options] options used to override defaults
  @param {Resolver} [options.resolver] a resolver to use for customizing normal resolution
  @returns {Promise<Object>} resolves with the context that was setup
*/
function setupContext(base, options = {}) {
  const context = base;

  // SAFETY: this is intimate API *designed* for us to override.
  setTesting(true);
  setContext(context);
  const testMetadata = getTestMetadata(context);
  testMetadata.setupTypes.push('setupContext');
  _backburner.DEBUG = true;
  _prepareOnerror(context);
  return Promise.resolve().then(() => {
    const application = getApplication();
    if (application) {
      return application.boot().then(() => {});
    }
    return;
  }).then(() => {
    const {
      resolver
    } = options;

    // This handles precedence, specifying a specific option of
    // resolver always trumps whatever is auto-detected, then we fallback to
    // the suite-wide registrations
    //
    // At some later time this can be extended to support specifying a custom
    // engine or application...
    if (resolver) {
      return buildOwner(null, resolver);
    }
    return buildOwner(getApplication(), getResolver());
  }).then(owner => {
    Object.defineProperty(context, 'owner', {
      configurable: true,
      enumerable: true,
      value: owner,
      writable: false
    });
    setOwner(context, owner);
    Object.defineProperty(context, 'set', {
      configurable: true,
      enumerable: true,
      // SAFETY: in all of these `defineProperty` calls, we can't actually guarantee any safety w.r.t. the corresponding field's type in `TestContext`
      value(key, value) {
        const ret = run$1(function () {
          return set(context, key, value);
        });
        return ret;
      },
      writable: false
    });
    Object.defineProperty(context, 'setProperties', {
      configurable: true,
      enumerable: true,
      // SAFETY: in all of these `defineProperty` calls, we can't actually guarantee any safety w.r.t. the corresponding field's type in `TestContext`
      value(hash) {
        const ret = run$1(function () {
          return setProperties(context, hash);
        });
        return ret;
      },
      writable: false
    });
    Object.defineProperty(context, 'get', {
      configurable: true,
      enumerable: true,
      value(key) {
        return get(context, key);
      },
      writable: false
    });
    Object.defineProperty(context, 'getProperties', {
      configurable: true,
      enumerable: true,
      // SAFETY: in all of these `defineProperty` calls, we can't actually guarantee any safety w.r.t. the corresponding field's type in `TestContext`
      value(...args) {
        return getProperties(context, args);
      },
      writable: false
    });
    let resume;
    context['resumeTest'] = function resumeTest() {
      resume();
      global$1.resumeTest = resume = undefined;
    };
    context['pauseTest'] = function pauseTest() {
      console.info('Testing paused. Use `resumeTest()` to continue.'); // eslint-disable-line no-console

      return new Promise(resolve => {
        resume = resolve;
        global$1.resumeTest = resumeTest;
      });
    };
    _setupAJAXHooks();
    return context;
  });
}

/**
  Used by test framework addons to tear down the provided context after testing is completed.

  Responsible for:

  - un-setting the "global testing context" (`unsetContext`)
  - destroy the contexts owner object
  - remove AJAX listeners

  @public
  @param {Object} context the context to setup
  @param {Object} [options] options used to override defaults
  @param {boolean} [options.waitForSettled=true] should the teardown wait for `settled()`ness
  @returns {Promise<void>} resolves when settled
*/
function teardownContext(context, {
  waitForSettled = true
} = {}) {
  return Promise.resolve().then(() => {
    _cleanupOnerror(context);
    _teardownAJAXHooks();
    setTesting(false);
    unsetContext();
    destroy(context.owner);
  }).finally(() => {
    if (waitForSettled) {
      return settled();
    }
    return;
  });
}

/**
  Get the root element of the application under test (usually `#ember-testing`)

  @public
  @returns {Element} the root element

  @example
  <caption>
    Getting the root element of the application and checking that it is equal
    to the element with id 'ember-testing'.
  </caption>
  assert.equal(getRootElement(), document.querySelector('#ember-testing'));
*/
function getRootElement() {
  const context = getContext();
  if (!context || !isTestContext(context) || !context.owner) {
    throw new Error('Must setup rendering context before attempting to interact with elements.');
  }
  const owner = context.owner;
  let rootElement;
  // When the host app uses `setApplication` (instead of `setResolver`) the owner has
  // a `rootElement` set on it with the element or id to be used
  if (owner && owner._emberTestHelpersMockOwner === undefined) {
    rootElement = owner.rootElement;
  } else {
    rootElement = '#ember-testing';
  }
  if (rootElement instanceof Window) {
    rootElement = rootElement.document;
  }
  if (isElement(rootElement) || isDocument(rootElement)) {
    return rootElement;
  } else if (typeof rootElement === 'string') {
    const _rootElement = document.querySelector(rootElement);
    if (_rootElement) {
      return _rootElement;
    }
    throw new Error(`Application.rootElement (${rootElement}) not found`);
  } else {
    throw new Error('Application.rootElement must be an element or a selector string');
  }
}

// @ts-ignore: types for this API is not consistently available (via transitive
// deps) and we do not currently want to make it an explicit dependency. It
// does, however, consistently work at runtime. :sigh:

/**
 * We should ultimately get a new API from @glimmer/runtime that provides this functionality
 * (see https://github.com/emberjs/rfcs/pull/785 for more info).
 * @private
 * @param {Object} maybeComponent The thing you think might be a component
 * @returns {boolean} True if it's a component, false if not
 */
function isComponent(maybeComponent) {
  return !!getInternalComponentManager(maybeComponent);
}

const OUTLET_TEMPLATE = templateFactory(
/*
  {{outlet}}
*/
{
  "id": "h2kewOAG",
  "block": "[[[46,[28,[37,1],null,null],null,null,null]],[],[\"component\",\"-outlet\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": false
});
const EMPTY_TEMPLATE = templateFactory(
/*
  
*/
{
  "id": "TDZemDvp",
  "block": "[[],[],[]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": false
});
const INVOKE_PROVIDED_COMPONENT = templateFactory(
/*
  <this.ProvidedComponent />
*/
{
  "id": "jtkKGEls",
  "block": "[[[8,[30,0,[\"ProvidedComponent\"]],null,null,null]],[],[]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": false
});
const hasCalledSetupRenderingContext = Symbol();
//  Isolates the notion of transforming a TextContext into a RenderingTestContext.
// eslint-disable-next-line require-jsdoc
function prepare(context) {
  context[hasCalledSetupRenderingContext] = true;
  return context;
}

// eslint-disable-next-line require-jsdoc
function isRenderingTestContext(context) {
  return isTestContext(context) && hasCalledSetupRenderingContext in context;
}

/**
  @private
  @param {Ember.ApplicationInstance} owner the current owner instance
  @param {string} templateFullName the fill template name
  @returns {Template} the template representing `templateFullName`
*/
function lookupTemplate(owner, templateFullName) {
  const template = owner.lookup(templateFullName);
  if (typeof template === 'function') return template(owner);
  return template;
}

/**
  @private
  @param {Ember.ApplicationInstance} owner the current owner instance
  @returns {Template} a template representing {{outlet}}
*/
function lookupOutletTemplate(owner) {
  let OutletTemplate = lookupTemplate(owner, 'template:-outlet');
  if (!OutletTemplate) {
    owner.register('template:-outlet', OUTLET_TEMPLATE);
    OutletTemplate = lookupTemplate(owner, 'template:-outlet');
  }
  return OutletTemplate;
}
let templateId = 0;
/**
  Renders the provided template and appends it to the DOM.

  @public
  @param {Template|Component} templateFactoryOrComponent the component (or template) to render
  @param {RenderOptions} options options hash containing engine owner ({ owner: engineOwner })
  @returns {Promise<void>} resolves when settled

  @example
  <caption>
    Render a div element with the class 'container'.
  </caption>
  await render(hbs`<div class="container"></div>`);
*/
function render(templateFactoryOrComponent, options) {
  let context = getContext();
  if (!templateFactoryOrComponent) {
    throw new Error('you must pass a template to `render()`');
  }
  return Promise.resolve().then(() => runHooks('render', 'start')).then(() => {
    if (!context || !isRenderingTestContext(context)) {
      throw new Error('Cannot call `render` without having first called `setupRenderingContext`.');
    }
    const {
      owner
    } = context;
    const testMetadata = getTestMetadata(context);
    testMetadata.usedHelpers.push('render');

    // SAFETY: this is all wildly unsafe, because it is all using private API.
    // At some point we should define a path forward for this kind of internal
    // API. For now, just flagging it as *NOT* being safe!
    const toplevelView = owner.lookup('-top-level-view:main');
    const OutletTemplate = lookupOutletTemplate(owner);
    const ownerToRenderFrom = options?.owner || owner;
    if (isComponent(templateFactoryOrComponent)) {
      context = {
        ProvidedComponent: templateFactoryOrComponent
      };
      templateFactoryOrComponent = INVOKE_PROVIDED_COMPONENT;
    }
    templateId += 1;
    const templateFullName = `template:-undertest-${templateId}`;
    ownerToRenderFrom.register(templateFullName, templateFactoryOrComponent);
    const template = lookupTemplate(ownerToRenderFrom, templateFullName);
    const outletState = {
      render: {
        owner,
        // always use the host app owner for application outlet
        into: undefined,
        outlet: 'main',
        name: 'application',
        controller: undefined,
        ViewClass: undefined,
        template: OutletTemplate
      },
      outlets: {
        main: {
          render: {
            owner: ownerToRenderFrom,
            // the actual owner to be used for any lookups
            into: undefined,
            outlet: 'main',
            name: 'index',
            controller: context,
            ViewClass: undefined,
            template,
            outlets: {}
          },
          outlets: {}
        }
      }
    };
    toplevelView.setOutletState(outletState);

    // returning settled here because the actual rendering does not happen until
    // the renderer detects it is dirty (which happens on backburner's end
    // hook), see the following implementation details:
    //
    // * [view:outlet](https://github.com/emberjs/ember.js/blob/f94a4b6aef5b41b96ef2e481f35e07608df01440/packages/ember-glimmer/lib/views/outlet.js#L129-L145) manually dirties its own tag upon `setOutletState`
    // * [backburner's custom end hook](https://github.com/emberjs/ember.js/blob/f94a4b6aef5b41b96ef2e481f35e07608df01440/packages/ember-glimmer/lib/renderer.js#L145-L159) detects that the current revision of the root is no longer the latest, and triggers a new rendering transaction
    return settled();
  }).then(() => runHooks('render', 'end'));
}

/**
  Clears any templates previously rendered. This is commonly used for
  confirming behavior that is triggered by teardown (e.g.
  `willDestroyElement`).

  @public
  @returns {Promise<void>} resolves when settled
*/
function clearRender() {
  const context = getContext();
  if (!context || !isRenderingTestContext(context)) {
    throw new Error('Cannot call `clearRender` without having first called `setupRenderingContext`.');
  }
  return render(EMPTY_TEMPLATE);
}

/**
  Used by test framework addons to setup the provided context for rendering.

  `setupContext` must have been ran on the provided context
  prior to calling `setupRenderingContext`.

  Responsible for:

  - Setup the basic framework used for rendering by the
    `render` helper.
  - Ensuring the event dispatcher is properly setup.
  - Setting `this.element` to the root element of the testing
    container (things rendered via `render` will go _into_ this
    element).

  @public
  @param {TestContext} context the context to setup for rendering
  @returns {Promise<RenderingTestContext>} resolves with the context that was setup

  @example
  <caption>
    Rendering out a paragraph element containing the content 'hello', and then clearing that content via clearRender.
  </caption>

  await render(hbs`<p>Hello!</p>`);
  assert.equal(this.element.textContent, 'Hello!', 'has rendered content');
  await clearRender();
  assert.equal(this.element.textContent, '', 'has rendered content');
*/
function setupRenderingContext(context) {
  const testMetadata = getTestMetadata(context);
  testMetadata.setupTypes.push('setupRenderingContext');
  const renderingContext = prepare(context);
  return Promise.resolve().then(() => {
    const {
      owner
    } = renderingContext;

    // When the host app uses `setApplication` (instead of `setResolver`) the event dispatcher has
    // already been setup via `applicationInstance.boot()` in `./build-owner`. If using
    // `setResolver` (instead of `setApplication`) a "mock owner" is created by extending
    // `Ember._ContainerProxyMixin` and `Ember._RegistryProxyMixin` in this scenario we need to
    // manually start the event dispatcher.
    if (owner._emberTestHelpersMockOwner) {
      const dispatcher = owner.lookup('event_dispatcher:main') || EventDispatcher.create();
      dispatcher.setup({}, '#ember-testing');
    }
    const OutletView = owner.factoryFor ? owner.factoryFor('view:-outlet') : owner._lookupFactory('view:-outlet');
    const environment = owner.lookup('-environment:main');
    const template = owner.lookup('template:-outlet');
    const toplevelView = OutletView.create({
      template,
      environment
    });
    owner.register('-top-level-view:main', {
      create() {
        return toplevelView;
      }
    });

    // initially render a simple empty template
    return render(EMPTY_TEMPLATE).then(() => {
      run$1(toplevelView, 'appendTo', getRootElement());
      return settled();
    });
  }).then(() => {
    Object.defineProperty(renderingContext, 'element', {
      configurable: true,
      enumerable: true,
      // In older Ember versions (2.4) the element itself is not stable,
      // and therefore we cannot update the `this.element` until after the
      // rendering is completed
      value: getRootElement(),
      writable: false
    });
    return renderingContext;
  });
}

const EMPTY_ATTRS = [];
function indexOfAttribute(attributes, namespaceURI, localName) {
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr.namespaceURI === namespaceURI && attr.localName === localName) {
      return i;
    }
  }
  return -1;
}
function adjustAttrName(namespaceURI, localName) {
  return namespaceURI === "http://www.w3.org/1999/xhtml" /* HTML */ ? localName.toLowerCase() : localName;
}
function getAttribute(attributes, namespaceURI, localName) {
  const index = indexOfAttribute(attributes, namespaceURI, localName);
  return index === -1 ? null : attributes[index].value;
}
function removeAttribute(attributes, namespaceURI, localName) {
  const index = indexOfAttribute(attributes, namespaceURI, localName);
  if (index !== -1) {
    attributes.splice(index, 1);
  }
}
// https://dom.spec.whatwg.org/#dom-element-setattributens
function setAttribute(element, namespaceURI, prefix, localName, value) {
  if (typeof value !== 'string') {
    value = '' + value;
  }
  let {
    attributes
  } = element;
  if (attributes === EMPTY_ATTRS) {
    attributes = element.attributes = [];
  } else {
    const index = indexOfAttribute(attributes, namespaceURI, localName);
    if (index !== -1) {
      attributes[index].value = value;
      return;
    }
  }
  attributes.push({
    localName,
    name: prefix === null ? localName : prefix + ':' + localName,
    namespaceURI,
    prefix,
    specified: true,
    value
  });
}
class ChildNodes {
  constructor(node) {
    this.node = node;
    this.stale = true;
    this._length = 0;
  }
  get length() {
    if (this.stale) {
      this.stale = false;
      let len = 0;
      let child = this.node.firstChild;
      for (; child !== null; len++) {
        this[len] = child;
        child = child.nextSibling;
      }
      const oldLen = this._length;
      this._length = len;
      for (; len < oldLen; len++) {
        delete this[len];
      }
    }
    return this._length;
  }
  item(index) {
    return index < this.length ? this[index] : null;
  }
}
function cloneNode(node, deep) {
  const clone = nodeFrom(node);
  if (deep) {
    let child = node.firstChild;
    let nextChild = child;
    while (child !== null) {
      nextChild = child.nextSibling;
      clone.appendChild(child.cloneNode(true));
      child = nextChild;
    }
  }
  return clone;
}
function nodeFrom(node) {
  let namespaceURI;
  if (node.nodeType === 1 /* ELEMENT_NODE */) {
    namespaceURI = node.namespaceURI;
  }
  const clone = new SimpleNodeImpl(node.ownerDocument, node.nodeType, node.nodeName, node.nodeValue, namespaceURI);
  if (node.nodeType === 1 /* ELEMENT_NODE */) {
    clone.attributes = copyAttrs(node.attributes);
  }
  return clone;
}
function copyAttrs(attrs) {
  if (attrs === EMPTY_ATTRS) {
    return EMPTY_ATTRS;
  }
  const copy = [];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    copy.push({
      localName: attr.localName,
      name: attr.name,
      namespaceURI: attr.namespaceURI,
      prefix: attr.prefix,
      specified: true,
      value: attr.value
    });
  }
  return copy;
}
function insertBefore(parentNode, newChild, refChild) {
  invalidate(parentNode);
  insertBetween(parentNode, newChild, refChild === null ? parentNode.lastChild : refChild.previousSibling, refChild);
}
function removeChild(parentNode, oldChild) {
  invalidate(parentNode);
  removeBetween(parentNode, oldChild, oldChild.previousSibling, oldChild.nextSibling);
}
function invalidate(parentNode) {
  const childNodes = parentNode._childNodes;
  if (childNodes !== undefined) {
    childNodes.stale = true;
  }
}
function insertBetween(parentNode, newChild, previousSibling, nextSibling) {
  if (newChild.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
    insertFragment(newChild, parentNode, previousSibling, nextSibling);
    return;
  }
  if (newChild.parentNode !== null) {
    removeChild(newChild.parentNode, newChild);
  }
  newChild.parentNode = parentNode;
  newChild.previousSibling = previousSibling;
  newChild.nextSibling = nextSibling;
  if (previousSibling === null) {
    parentNode.firstChild = newChild;
  } else {
    previousSibling.nextSibling = newChild;
  }
  if (nextSibling === null) {
    parentNode.lastChild = newChild;
  } else {
    nextSibling.previousSibling = newChild;
  }
}
function removeBetween(parentNode, oldChild, previousSibling, nextSibling) {
  oldChild.parentNode = null;
  oldChild.previousSibling = null;
  oldChild.nextSibling = null;
  if (previousSibling === null) {
    parentNode.firstChild = nextSibling;
  } else {
    previousSibling.nextSibling = nextSibling;
  }
  if (nextSibling === null) {
    parentNode.lastChild = previousSibling;
  } else {
    nextSibling.previousSibling = previousSibling;
  }
}
function insertFragment(fragment, parentNode, previousSibling, nextSibling) {
  const firstChild = fragment.firstChild;
  if (firstChild === null) {
    return;
  }
  fragment.firstChild = null;
  fragment.lastChild = null;
  let lastChild = firstChild;
  let newChild = firstChild;
  firstChild.previousSibling = previousSibling;
  if (previousSibling === null) {
    parentNode.firstChild = firstChild;
  } else {
    previousSibling.nextSibling = firstChild;
  }
  while (newChild !== null) {
    newChild.parentNode = parentNode;
    lastChild = newChild;
    newChild = newChild.nextSibling;
  }
  lastChild.nextSibling = nextSibling;
  if (nextSibling === null) {
    parentNode.lastChild = lastChild;
  } else {
    nextSibling.previousSibling = lastChild;
  }
}
function parseQualifiedName(qualifiedName) {
  let localName = qualifiedName;
  let prefix = null;
  const i = qualifiedName.indexOf(':');
  if (i !== -1) {
    prefix = qualifiedName.slice(0, i);
    localName = qualifiedName.slice(i + 1);
  }
  return [prefix, localName];
}
class SimpleNodeImpl {
  constructor(ownerDocument, nodeType, nodeName, nodeValue, namespaceURI) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
    this.namespaceURI = namespaceURI;
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this.firstChild = null;
    this.lastChild = null;
    this.attributes = EMPTY_ATTRS;
    /**
     * @internal
     */
    this._childNodes = undefined;
  }
  get tagName() {
    return this.nodeName;
  }
  get childNodes() {
    let children = this._childNodes;
    if (children === undefined) {
      children = this._childNodes = new ChildNodes(this);
    }
    return children;
  }
  cloneNode(deep) {
    return cloneNode(this, deep === true);
  }
  appendChild(newChild) {
    insertBefore(this, newChild, null);
    return newChild;
  }
  insertBefore(newChild, refChild) {
    insertBefore(this, newChild, refChild);
    return newChild;
  }
  removeChild(oldChild) {
    removeChild(this, oldChild);
    return oldChild;
  }
  insertAdjacentHTML(position, html) {
    const raw = new SimpleNodeImpl(this.ownerDocument, -1 /* RAW_NODE */, '#raw', html, void 0);
    let parentNode;
    let nextSibling;
    switch (position) {
      case 'beforebegin':
        parentNode = this.parentNode;
        nextSibling = this;
        break;
      case 'afterbegin':
        parentNode = this;
        nextSibling = this.firstChild;
        break;
      case 'beforeend':
        parentNode = this;
        nextSibling = null;
        break;
      case 'afterend':
        parentNode = this.parentNode;
        nextSibling = this.nextSibling;
        break;
      default:
        throw new Error('invalid position');
    }
    if (parentNode === null) {
      throw new Error(`${position} requires a parentNode`);
    }
    insertBefore(parentNode, raw, nextSibling);
  }
  getAttribute(name) {
    const localName = adjustAttrName(this.namespaceURI, name);
    return getAttribute(this.attributes, null, localName);
  }
  getAttributeNS(namespaceURI, localName) {
    return getAttribute(this.attributes, namespaceURI, localName);
  }
  setAttribute(name, value) {
    const localName = adjustAttrName(this.namespaceURI, name);
    setAttribute(this, null, null, localName, value);
  }
  setAttributeNS(namespaceURI, qualifiedName, value) {
    const [prefix, localName] = parseQualifiedName(qualifiedName);
    setAttribute(this, namespaceURI, prefix, localName, value);
  }
  removeAttribute(name) {
    const localName = adjustAttrName(this.namespaceURI, name);
    removeAttribute(this.attributes, null, localName);
  }
  removeAttributeNS(namespaceURI, localName) {
    removeAttribute(this.attributes, namespaceURI, localName);
  }
  get doctype() {
    return this.firstChild;
  }
  get documentElement() {
    return this.lastChild;
  }
  get head() {
    return this.documentElement.firstChild;
  }
  get body() {
    return this.documentElement.lastChild;
  }
  createElement(name) {
    return new SimpleNodeImpl(this, 1 /* ELEMENT_NODE */, name.toUpperCase(), null, "http://www.w3.org/1999/xhtml" /* HTML */);
  }
  createElementNS(namespace, qualifiedName) {
    // Node name is case-preserving in XML contexts, but returns canonical uppercase form in HTML contexts
    // https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-104682815
    const nodeName = namespace === "http://www.w3.org/1999/xhtml" /* HTML */ ? qualifiedName.toUpperCase() : qualifiedName;
    // we don't care to parse the qualified name because we only support HTML documents
    // which don't support prefixed elements
    return new SimpleNodeImpl(this, 1 /* ELEMENT_NODE */, nodeName, null, namespace);
  }
  createTextNode(text) {
    return new SimpleNodeImpl(this, 3 /* TEXT_NODE */, '#text', text, void 0);
  }
  createComment(text) {
    return new SimpleNodeImpl(this, 8 /* COMMENT_NODE */, '#comment', text, void 0);
  }
  /**
   * Backwards compat
   * @deprecated
   */
  createRawHTMLSection(text) {
    return new SimpleNodeImpl(this, -1 /* RAW_NODE */, '#raw', text, void 0);
  }
  createDocumentFragment() {
    return new SimpleNodeImpl(this, 11 /* DOCUMENT_FRAGMENT_NODE */, '#document-fragment', null, void 0);
  }
}
function createHTMLDocument() {
  // dom.d.ts types ownerDocument as Document but for a document ownerDocument is null
  const document = new SimpleNodeImpl(null, 9 /* DOCUMENT_NODE */, '#document', null, "http://www.w3.org/1999/xhtml" /* HTML */);
  const doctype = new SimpleNodeImpl(document, 10 /* DOCUMENT_TYPE_NODE */, 'html', null, "http://www.w3.org/1999/xhtml" /* HTML */);
  const html = new SimpleNodeImpl(document, 1 /* ELEMENT_NODE */, 'HTML', null, "http://www.w3.org/1999/xhtml" /* HTML */);
  const head = new SimpleNodeImpl(document, 1 /* ELEMENT_NODE */, 'HEAD', null, "http://www.w3.org/1999/xhtml" /* HTML */);
  const body = new SimpleNodeImpl(document, 1 /* ELEMENT_NODE */, 'BODY', null, "http://www.w3.org/1999/xhtml" /* HTML */);
  html.appendChild(head);
  html.appendChild(body);
  document.appendChild(doctype);
  document.appendChild(html);
  return document;
}

class NodeDOMTreeConstruction extends DOMTreeConstruction {
  // Hides property on base class
  constructor(doc) {
    super(doc || createHTMLDocument());
  }

  // override to prevent usage of `this.document` until after the constructor
  setupUselessElement() {}
  insertHTMLBefore(parent, reference, html) {
    // eslint-disable-next-line @typescript-eslint/no-deprecated, @typescript-eslint/no-non-null-assertion
    let raw = this.document.createRawHTMLSection(html);
    parent.insertBefore(raw, reference);
    return new ConcreteBounds(parent, raw, raw);
  }

  // override to avoid SVG detection/work when in node (this is not needed in SSR)
  createElement(tag) {
    return this.document.createElement(tag);
  }

  // override to avoid namespace shenanigans when in node (this is not needed in SSR)
  setAttribute(element, name, value) {
    element.setAttribute(name, value);
  }
}

const _importSync20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Component,
  DOMChanges,
  DOMTreeConstruction,
  Helper,
  Input,
  LinkTo,
  NodeDOMTreeConstruction,
  OutletView,
  Renderer,
  RootTemplate,
  SafeString,
  Textarea,
  TrustedHTML,
  _resetRenderers,
  componentCapabilities,
  getTemplate,
  getTemplates,
  hasTemplate,
  helper: helper$1,
  htmlSafe,
  isHTMLSafe,
  isSerializationFirstNode,
  isTrustedHTML,
  modifierCapabilities,
  renderComponent,
  renderSettled: renderSettled$2,
  setComponentManager,
  setTemplate,
  setTemplates,
  setupApplicationRegistry,
  setupEngineRegistry,
  template: templateFactory,
  templateCacheCounters,
  trustHTML,
  uniqueId: uniqueId$1
}, Symbol.toStringTag, { value: 'Module' }));

let renderSettled;
{
  //@ts-ignore
  renderSettled = esCompat(_importSync20).renderSettled;
}
var renderSettled$1 = renderSettled;

/**
  Returns a promise which will resolve when rendering has completed. In
  this context, rendering is completed when all auto-tracked state that is
  consumed in the template (including any tracked state in models, services,
  etc.  that are then used in a template) has been updated in the DOM.

  For example, in a test you might want to update some tracked state and
  then run some assertions after rendering has completed. You _could_ use
  `await settled()` in that location, but in some contexts you don't want to
  wait for full settledness (which includes test waiters, pending AJAX/fetch,
  run loops, etc) but instead only want to know when that updated value has
  been rendered in the DOM. **THAT** is what `await rerender()` is _perfect_
  for.
  @public
  @returns {Promise<void>} a promise which fulfills when rendering has completed
*/
function rerender() {
  return renderSettled$1();
}

// Private API
const VALID = Object.freeze({
  isValid: true,
  message: null
});
const INVALID = Object.freeze({
  isValid: false,
  message: 'error handler should have re-thrown the provided error'
});

/**
 * Validate the provided error handler to confirm that it properly re-throws
 * errors when `Ember.testing` is true.
 *
 * This is intended to be used by test framework hosts (or other libraries) to
 * ensure that `Ember.onerror` is properly configured. Without a check like
 * this, `Ember.onerror` could _easily_ swallow all errors and make it _seem_
 * like everything is just fine (and have green tests) when in reality
 * everything is on fire...
 *
 * @public
 * @param {Function} [callback=Ember.onerror] the callback to validate
 * @returns {Object} object with `isValid` and `message`
 *
 * @example <caption>Example implementation for `ember-qunit`</caption>
 *
 * import { validateErrorHandler } from '@ember/test-helpers';
 *
 * test('Ember.onerror is functioning properly', function(assert) {
 *   let result = validateErrorHandler();
 *   assert.ok(result.isValid, result.message);
 * });
 */
function validateErrorHandler(callback = getOnerror()) {
  if (callback === undefined || callback === null) {
    return VALID;
  }
  const error = new Error('Error handler validation error!');
  const originalEmberTesting = isTesting();
  setTesting(true);
  try {
    callback(error);
  } catch (e) {
    if (e === error) {
      return VALID;
    }
  } finally {
    setTesting(originalEmberTesting);
  }
  return INVALID;
}

const IS_DESCRIPTOR = '__dom_element_descriptor_is_descriptor__';

/**
 * Determine if the argument is an {@link IDOMElementDescriptor}.
 *
 * This does not check if the argument is registered, just that it's type is
 * {@link IDOMElementDescriptor}.
 */
function isDescriptor(target) {
  return Boolean(typeof target === 'object' && target && IS_DESCRIPTOR in target);
}

/**
 * Get the registry instance.
 *
 * We store it on the window to ensure that if some dependency/hoisting horkage
 * results in the presence of multiple copies of this library, they are all
 * using the same registry.
 *
 * @returns the registry
 */
function getRegistry() {
  const win = window;
  win.domElementDescriptorsRegistry = win.domElementDescriptorsRegistry || new WeakMap();
  return win.domElementDescriptorsRegistry;
}
/**
 * Look up registered descriptor data
 *
 * @param descriptor the descriptor
 * @returns the descriptor's data, or null if none is set
 */
function lookupDescriptorData(descriptor) {
  return getRegistry().get(descriptor) || null;
}

/**
 * Given a descriptor or descriptor data, get the single/first element it would
 * match.
 *
 * This is analogous to `querySelector()`, and is meant to be used by DOM helper
 * libraries to resolve the targets of single-element operations.
 *
 * @param target the descriptor or descriptor data
 * @returns the resolved DOM element, or null if no element matched
 */
function resolveDOMElement(target) {
  let data = isDescriptor(target) ? lookupDescriptorData(target) : target;
  if (!data) {
    return null;
  }
  if (data.element !== undefined) {
    return data.element;
  } else {
    for (let element of data.elements || []) {
      return element;
    }
    return null;
  }
}
/**
 * Given a descriptor or descriptor data, get the elements it would match.
 *
 * This is analogous to `querySelectorAll()`, and is meant to be used by DOM
 * helper libraries to resolve the targets of multi-element operations.
 *
 * @param target the descriptor or descriptor data
 * @returns the resolved DOM elements (possibly none)
 */
function resolveDOMElements(target) {
  let data = isDescriptor(target) ? lookupDescriptorData(target) : target;
  if (!data) {
    return [];
  }
  if (data.elements) {
    return Array.from(data.elements);
  } else {
    let element = data.element;
    return element ? [element] : [];
  }
}

/**
  Used internally by the DOM interaction helpers to find one element.

  @private
  @param {string|Element} target the element or selector to retrieve
  @returns {Element} the target or selector
*/
function getElement(target) {
  if (typeof target === 'string') {
    const rootElement = getRootElement();
    return rootElement.querySelector(target);
  } else if (isElement(target) || isDocument(target)) {
    return target;
  } else if (target instanceof Window) {
    return target.document;
  } else {
    const descriptorData = lookupDescriptorData(target);
    if (descriptorData) {
      return resolveDOMElement(descriptorData);
    } else {
      throw new Error('Must use an element, selector string, or DOM element descriptor');
    }
  }
}

/**
  Used internally by the DOM interaction helpers to find either window or an element.

  @private
  @param {string|Element} target the window, an element or selector to retrieve
  @returns {Element|Window} the target or selector
*/
function getWindowOrElement(target) {
  if (isWindow(target)) {
    return target;
  }
  return getElement(target);
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

// eslint-disable-next-line require-jsdoc
function tuple(...args) {
  return args;
}

/**
 * Logs a debug message to the console if the `testHelperLogging` query
 * parameter is set.
 *
 * @private
 * @param {string} helperName Name of the helper
 * @param {string|Element} target The target element or selector
 */
function log(helperName, target, ...args) {
  if (loggingEnabled()) {
    // eslint-disable-next-line no-console
    console.log(`${helperName}(${[elementToString(target), ...args.filter(Boolean)].join(', ')})`);
  }
}

/**
 * Returns whether the test helper logging is enabled or not via the
 * `testHelperLogging` query parameter.
 *
 * @private
 * @returns {boolean} true if enabled
 */
function loggingEnabled() {
  return typeof location !== 'undefined' && location.search.indexOf('testHelperLogging') !== -1;
}

/**
 * This generates a human-readable description to a DOM element.
 *
 * @private
 * @param {*} el The element that should be described
 * @returns {string} A human-readable description
 */
function elementToString(el) {
  let desc;
  if (el instanceof NodeList) {
    if (el.length === 0) {
      return 'empty NodeList';
    }
    desc = Array.prototype.slice.call(el, 0, 5).map(elementToString).join(', ');
    return el.length > 5 ? `${desc}... (+${el.length - 5} more)` : desc;
  }
  if (!(el instanceof HTMLElement || el instanceof SVGElement)) {
    return String(el);
  }
  desc = el.tagName.toLowerCase();
  if (el.id) {
    desc += `#${el.id}`;
  }
  if (el.className && !(el.className instanceof SVGAnimatedString)) {
    desc += `.${String(el.className).replace(/\s+/g, '.')}`;
  }
  Array.prototype.forEach.call(el.attributes, function (attr) {
    if (attr.name !== 'class' && attr.name !== 'id') {
      desc += `[${attr.name}${attr.value ? `="${attr.value}"]` : ']'}`;
    }
  });
  return desc;
}

registerHook('fireEvent', 'start', target => {
  log('fireEvent', target);
});

// eslint-disable-next-line require-jsdoc
const MOUSE_EVENT_CONSTRUCTOR = (() => {
  try {
    new MouseEvent('test');
    return true;
  } catch {
    return false;
  }
})();
const DEFAULT_EVENT_OPTIONS = {
  bubbles: true,
  cancelable: true
};
const KEYBOARD_EVENT_TYPES = tuple('keydown', 'keypress', 'keyup');
// eslint-disable-next-line require-jsdoc
function isKeyboardEventType(eventType) {
  return KEYBOARD_EVENT_TYPES.indexOf(eventType) > -1;
}
const MOUSE_EVENT_TYPES = tuple('click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover');
// eslint-disable-next-line require-jsdoc
function isMouseEventType(eventType) {
  return MOUSE_EVENT_TYPES.indexOf(eventType) > -1;
}
const FILE_SELECTION_EVENT_TYPES = tuple('change');
// eslint-disable-next-line require-jsdoc
function isFileSelectionEventType(eventType) {
  return FILE_SELECTION_EVENT_TYPES.indexOf(eventType) > -1;
}

// eslint-disable-next-line require-jsdoc
function isFileSelectionInput(element) {
  return element.files;
}
/**
  Internal helper used to build and dispatch events throughout the other DOM helpers.

  @private
  @param {Element} element the element to dispatch the event to
  @param {string} eventType the type of event
  @param {Object} [options] additional properties to be set on the event
  @returns {Event} the event that was dispatched
*/
function fireEvent(element, eventType, options = {}) {
  return Promise.resolve().then(() => runHooks('fireEvent', 'start', element)).then(() => runHooks(`fireEvent:${eventType}`, 'start', element)).then(() => {
    if (!element) {
      throw new Error('Must pass an element to `fireEvent`');
    }
    let event;
    if (isKeyboardEventType(eventType)) {
      event = _buildKeyboardEvent(eventType, options);
    } else if (isMouseEventType(eventType)) {
      let rect;
      if (element instanceof Window && element.document.documentElement) {
        rect = element.document.documentElement.getBoundingClientRect();
      } else if (isDocument(element)) {
        rect = element.documentElement.getBoundingClientRect();
      } else if (isElement(element)) {
        rect = element.getBoundingClientRect();
      } else {
        return;
      }
      const x = rect.left + 1;
      const y = rect.top + 1;
      const simulatedCoordinates = {
        screenX: x + 5,
        // Those numbers don't really mean anything.
        screenY: y + 95,
        // They're just to make the screenX/Y be different of clientX/Y..
        clientX: x,
        clientY: y,
        ...options
      };
      event = buildMouseEvent(eventType, simulatedCoordinates);
    } else if (isFileSelectionEventType(eventType) && isFileSelectionInput(element)) {
      event = buildFileEvent(eventType, element, options);
    } else {
      event = buildBasicEvent(eventType, options);
    }
    element.dispatchEvent(event);
    return event;
  }).then(event => runHooks(`fireEvent:${eventType}`, 'end', element).then(() => event)).then(event => runHooks('fireEvent', 'end', element).then(() => event));
}

// eslint-disable-next-line require-jsdoc
function buildBasicEvent(type, options = {}) {
  const event = document.createEvent('Events');
  const bubbles = options.bubbles !== undefined ? options.bubbles : true;
  const cancelable = options.cancelable !== undefined ? options.cancelable : true;
  delete options.bubbles;
  delete options.cancelable;

  // bubbles and cancelable are readonly, so they can be
  // set when initializing event
  event.initEvent(type, bubbles, cancelable);
  for (const prop in options) {
    event[prop] = options[prop];
  }
  return event;
}

// eslint-disable-next-line require-jsdoc
function buildMouseEvent(type, options = {}) {
  let event;
  const eventOpts = {
    view: window,
    ...DEFAULT_EVENT_OPTIONS,
    ...options
  };
  if (MOUSE_EVENT_CONSTRUCTOR) {
    event = new MouseEvent(type, eventOpts);
  } else {
    try {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent(type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
    } catch {
      event = buildBasicEvent(type, options);
    }
  }
  return event;
}

// @private
// eslint-disable-next-line require-jsdoc
function _buildKeyboardEvent(type, options = {}) {
  const eventOpts = {
    ...DEFAULT_EVENT_OPTIONS,
    ...options
  };
  let event;
  let eventMethodName;
  try {
    event = new KeyboardEvent(type, eventOpts);

    // Property definitions are required for B/C for keyboard event usage
    // If this properties are not defined, when listening for key events
    // keyCode/which will be 0. Also, keyCode and which now are string
    // and if app compare it with === with integer key definitions,
    // there will be a fail.
    //
    // https://w3c.github.io/uievents/#interface-keyboardevent
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
    Object.defineProperty(event, 'keyCode', {
      get() {
        return parseInt(eventOpts.keyCode);
      }
    });
    Object.defineProperty(event, 'which', {
      get() {
        return parseInt(eventOpts.which);
      }
    });
    return event;
  } catch {
    // left intentionally blank
  }
  try {
    event = document.createEvent('KeyboardEvents');
    eventMethodName = 'initKeyboardEvent';
  } catch {
    // left intentionally blank
  }
  if (!event) {
    try {
      event = document.createEvent('KeyEvents');
      eventMethodName = 'initKeyEvent';
    } catch {
      // left intentionally blank
    }
  }
  if (event && eventMethodName) {
    event[eventMethodName](type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
  } else {
    event = buildBasicEvent(type, options);
  }
  return event;
}

// eslint-disable-next-line require-jsdoc
function buildFileEvent(type, element, options = {}) {
  const event = buildBasicEvent(type);
  const files = options.files;
  if (Array.isArray(options)) {
    throw new Error('Please pass an object with a files array to `triggerEvent` instead of passing the `options` param as an array to.');
  }
  if (Array.isArray(files)) {
    Object.defineProperty(files, 'item', {
      value(index) {
        return typeof index === 'number' ? this[index] : null;
      },
      configurable: true
    });
    Object.defineProperty(element, 'files', {
      value: files,
      configurable: true
    });
    const elementProto = Object.getPrototypeOf(element);
    const valueProp = Object.getOwnPropertyDescriptor(elementProto, 'value');
    Object.defineProperty(element, 'value', {
      configurable: true,
      get() {
        return valueProp.get.call(element);
      },
      set(value) {
        valueProp.set.call(element, value);

        // We are sure that the value is empty here.
        // For a non-empty value the original setter must raise an exception.
        Object.defineProperty(element, 'files', {
          configurable: true,
          value: []
        });
      }
    });
  }
  Object.defineProperty(event, 'target', {
    value: element
  });
  return event;
}

// For reference:
// https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute
const FOCUSABLE_TAGS = ['A', 'SUMMARY'];
// eslint-disable-next-line require-jsdoc
function isFocusableElement(element) {
  return FOCUSABLE_TAGS.indexOf(element.tagName) > -1;
}

/**
  @private
  @param {Element} element the element to check
  @returns {boolean} `true` when the element is focusable, `false` otherwise
*/
function isFocusable(element) {
  if (isWindow(element)) {
    return false;
  }
  if (isDocument(element)) {
    return false;
  }
  if (isFormControl(element)) {
    return !element.disabled;
  }
  if (isContentEditable(element) || isFocusableElement(element)) {
    return true;
  }
  return element.hasAttribute('tabindex');
}

/**
  Used internally by the DOM interaction helpers to get a description of a
  target for debug/error messaging.

  @private
  @param {Target} target the target
  @returns {string} a description of the target
*/
function getDescription(target) {
  const data = isDescriptor(target) ? lookupDescriptorData(target) : null;
  if (data) {
    return data.description || '<unknown descriptor>';
  } else {
    return `${target}`;
  }
}

registerHook('blur', 'start', target => {
  log('blur', target);
});

/**
  @private
  @param {Element} element the element to trigger events on
  @param {Element} relatedTarget the element that is focused after blur
  @return {Promise<Event | void>} resolves when settled
*/
function __blur__(element, relatedTarget = null) {
  if (!isFocusable(element)) {
    throw new Error(`${element} is not focusable`);
  }
  const browserIsNotFocused = document.hasFocus && !document.hasFocus();
  const needsCustomEventOptions = relatedTarget !== null;
  if (!needsCustomEventOptions) {
    // makes `document.activeElement` be `body`.
    // If the browser is focused, it also fires a blur event
    element.blur();
  }

  // Chrome/Firefox does not trigger the `blur` event if the window
  // does not have focus. If the document does not have focus then
  // fire `blur` event via native event.
  const options = {
    relatedTarget
  };
  return browserIsNotFocused || needsCustomEventOptions ? Promise.resolve().then(() => fireEvent(element, 'blur', {
    bubbles: false,
    ...options
  })).then(() => fireEvent(element, 'focusout', options)) : Promise.resolve();
}

/**
  Unfocus the specified target.

  Sends a number of events intending to simulate a "real" user unfocusing an
  element.

  The following events are triggered (in order):

  - `blur`
  - `focusout`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle unfocusing a given element.

  @public
  @param {string|Element|IDOMElementDescriptor} [target=document.activeElement] the element, selector, or descriptor to unfocus
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Emulating blurring an input using `blur`
  </caption>

  blur('input');
*/
function blur(target = document.activeElement) {
  return Promise.resolve().then(() => runHooks('blur', 'start', target)).then(() => {
    const element = getElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`blur('${description}')\`.`);
    }
    return __blur__(element).then(() => settled());
  }).then(() => runHooks('blur', 'end', target));
}

registerHook('focus', 'start', target => {
  log('focus', target);
});
/**
   Get the closest focusable ancestor of a given element (or the element itself
   if it's focusable)

   @private
   @param {Element} element the element to trigger events on
   @returns {HTMLElement|SVGElement|null} the focusable element/ancestor or null
   if there is none
 */
function getClosestFocusable(element) {
  if (isDocument(element)) {
    return null;
  }
  let maybeFocusable = element;
  while (maybeFocusable && !isFocusable(maybeFocusable)) {
    maybeFocusable = maybeFocusable.parentElement;
  }
  return maybeFocusable;
}

/**
  @private
  @param {Element} element the element to trigger events on
  @return {Promise<FocusRecord | Event | void>} resolves when settled
*/
function __focus__(element) {
  return Promise.resolve().then(() => {
    const focusTarget = getClosestFocusable(element);
    const previousFocusedElement = document.activeElement && document.activeElement !== focusTarget && isFocusable(document.activeElement) ? document.activeElement : null;

    // fire __blur__ manually with the null relatedTarget when the target is not focusable
    // and there was a previously focused element
    return !focusTarget && previousFocusedElement ? __blur__(previousFocusedElement, null).then(() => Promise.resolve({
      focusTarget,
      previousFocusedElement
    })) : Promise.resolve({
      focusTarget,
      previousFocusedElement
    });
  }).then(({
    focusTarget,
    previousFocusedElement
  }) => {
    if (!focusTarget) {
      throw new Error('There was a previously focused element');
    }
    const browserIsNotFocused = !document?.hasFocus();

    // fire __blur__ manually with the correct relatedTarget when the browser is not
    // already in focus and there was a previously focused element
    return previousFocusedElement && browserIsNotFocused ? __blur__(previousFocusedElement, focusTarget).then(() => Promise.resolve({
      focusTarget
    })) : Promise.resolve({
      focusTarget
    });
  }).then(({
    focusTarget
  }) => {
    // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event
    focusTarget.focus();

    // Firefox does not trigger the `focusin` event if the window
    // does not have focus. If the document does not have focus then
    // fire `focusin` event as well.
    const browserIsFocused = document?.hasFocus();
    return browserIsFocused ? Promise.resolve() :
    // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
    Promise.resolve().then(() => fireEvent(focusTarget, 'focus', {
      bubbles: false
    })).then(() => fireEvent(focusTarget, 'focusin')).then(() => settled());
  }).catch(() => {});
}

/**
  Focus the specified target.

  Sends a number of events intending to simulate a "real" user focusing an
  element.

  The following events are triggered (in order):

  - `focus`
  - `focusin`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle focusing a given element.

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to focus
  @return {Promise<void>} resolves when the application is settled

  @example
  <caption>
    Emulating focusing an input using `focus`
  </caption>

  focus('input');
*/
function focus(target) {
  return Promise.resolve().then(() => runHooks('focus', 'start', target)).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `focus`.');
    }
    const element = getElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`focus('${description}')\`.`);
    }
    if (!isFocusable(element)) {
      throw new Error(`${element} is not focusable`);
    }
    return __focus__(element).then(settled);
  }).then(() => runHooks('focus', 'end', target));
}

const PRIMARY_BUTTON = 1;
const MAIN_BUTTON_PRESSED = 0;
registerHook('click', 'start', target => {
  log('click', target);
});

/**
 * Represent a particular mouse button being clicked.
 * See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons for available options.
 */
const DEFAULT_CLICK_OPTIONS = {
  buttons: PRIMARY_BUTTON,
  button: MAIN_BUTTON_PRESSED
};

/**
  @private
  @param {Element} element the element to click on
  @param {MouseEventInit} options the options to be merged into the mouse events
  @return {Promise<Event | void>} resolves when settled
*/
function __click__(element, options) {
  return Promise.resolve().then(() => fireEvent(element, 'mousedown', options)).then(mouseDownEvent => !isWindow(element) && !mouseDownEvent?.defaultPrevented ? __focus__(element) : Promise.resolve()).then(() => fireEvent(element, 'mouseup', options)).then(() => fireEvent(element, 'click', options));
}

/**
  Clicks on the specified target.

  Sends a number of events intending to simulate a "real" user clicking on an
  element.

  For non-focusable elements the following events are triggered (in order):

  - `mousedown`
  - `mouseup`
  - `click`

  For focusable (e.g. form control) elements the following events are triggered
  (in order):

  - `mousedown`
  - `focus`
  - `focusin`
  - `mouseup`
  - `click`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle clicking a given element.

  Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).
  You can use this to specify modifier keys as well.

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to click on
  @param {MouseEventInit} _options the options to be merged into the mouse events.
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Emulating clicking a button using `click`
  </caption>
  click('button');

  @example
  <caption>
    Emulating clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
  </caption>

  click('button', { shiftKey: true });
*/
function click(target, _options = {}) {
  const options = {
    ...DEFAULT_CLICK_OPTIONS,
    ..._options
  };
  return Promise.resolve().then(() => runHooks('click', 'start', target, _options)).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `click`.');
    }
    const element = getWindowOrElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`click('${description}')\`.`);
    }
    if (isFormControl(element) && element.disabled) {
      throw new Error(`Can not \`click\` disabled ${element}`);
    }
    return __click__(element, options).then(settled);
  }).then(() => runHooks('click', 'end', target, _options));
}

registerHook('doubleClick', 'start', target => {
  log('doubleClick', target);
});

/**
  @private
  @param {Element} element the element to double-click on
  @param {MouseEventInit} options the options to be merged into the mouse events
  @returns {Promise<Event | void>} resolves when settled
*/
function __doubleClick__(element, options) {
  return Promise.resolve().then(() => fireEvent(element, 'mousedown', options)).then(mouseDownEvent => {
    return !isWindow(element) && !mouseDownEvent?.defaultPrevented ? __focus__(element) : Promise.resolve();
  }).then(() => fireEvent(element, 'mouseup', options)).then(() => fireEvent(element, 'click', options)).then(() => fireEvent(element, 'mousedown', options)).then(() => fireEvent(element, 'mouseup', options)).then(() => fireEvent(element, 'click', options)).then(() => fireEvent(element, 'dblclick', options));
}

/**
  Double-clicks on the specified target.

  Sends a number of events intending to simulate a "real" user clicking on an
  element.

  For non-focusable elements the following events are triggered (in order):

  - `mousedown`
  - `mouseup`
  - `click`
  - `mousedown`
  - `mouseup`
  - `click`
  - `dblclick`

  For focusable (e.g. form control) elements the following events are triggered
  (in order):

  - `mousedown`
  - `focus`
  - `focusin`
  - `mouseup`
  - `click`
  - `mousedown`
  - `mouseup`
  - `click`
  - `dblclick`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle clicking a given element.

  Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to double-click on
  @param {MouseEventInit} _options the options to be merged into the mouse events
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Emulating double clicking a button using `doubleClick`
  </caption>

  doubleClick('button');

  @example
  <caption>
    Emulating double clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
  </caption>

  doubleClick('button', { shiftKey: true });
*/
function doubleClick(target, _options = {}) {
  const options = {
    ...DEFAULT_CLICK_OPTIONS,
    ..._options
  };
  return Promise.resolve().then(() => runHooks('doubleClick', 'start', target, _options)).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `doubleClick`.');
    }
    const element = getWindowOrElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`doubleClick('${description}')\`.`);
    }
    if (isFormControl(element) && element.disabled) {
      throw new Error(`Can not \`doubleClick\` disabled ${element}`);
    }
    return __doubleClick__(element, options).then(settled);
  }).then(() => runHooks('doubleClick', 'end', target, _options));
}

const SUPPORTS_INERT = 'inert' in Element.prototype;
const FALLBACK_ELEMENTS = ['CANVAS', 'VIDEO', 'PICTURE'];
registerHook('tab', 'start', target => {
  log('tab', target);
});

/**
  Gets the active element of a document. IE11 may return null instead of the body as
  other user-agents does when there isn’t an active element.
  @private
  @param {Document} ownerDocument the element to check
  @returns {HTMLElement} the active element of the document
*/
function getActiveElement(ownerDocument) {
  return ownerDocument.activeElement || ownerDocument.body;
}
/**
  Compiles a list of nodes that can be focused. Walks the tree, discards hidden elements and a few edge cases. To calculate the right.
  @private
  @param {Element} root the root element to start traversing on
  @returns {Array} list of focusable nodes
*/
function compileFocusAreas(root = document.body) {
  const {
    ownerDocument
  } = root;
  if (!ownerDocument) {
    throw new Error('Element must be in the DOM');
  }
  const activeElement = getActiveElement(ownerDocument);
  const treeWalker = ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      // Only visible nodes can be focused, with, at least, one exception; the "area" element.
      // reference: https://html.spec.whatwg.org/multipage/interaction.html#data-model
      if (node.tagName !== 'AREA' && isVisible(node) === false) {
        return NodeFilter.FILTER_REJECT;
      }

      // Reject any fallback elements. Fallback elements’s children are only rendered if the UA
      // doesn’t support the element. We make an assumption that they are always supported, we
      // could consider feature detecting every node type, or making it configurable.
      const parentNode = node.parentNode;
      if (parentNode && FALLBACK_ELEMENTS.indexOf(parentNode.tagName) !== -1) {
        return NodeFilter.FILTER_REJECT;
      }

      // Rejects inert containers, if the user agent supports the feature (or if a polyfill is installed.)
      if (SUPPORTS_INERT && node.inert) {
        return NodeFilter.FILTER_REJECT;
      }
      if (isDisabled(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      // Always accept the 'activeElement' of the document, as it might fail the next check, elements with tabindex="-1"
      // can be focused programmatically, we'll therefor ensure the current active element is in the list.
      if (node === activeElement) {
        return NodeFilter.FILTER_ACCEPT;
      }

      // UA parses the tabindex attribute and applies its default values, If the tabIndex is non negative, the UA can
      // focus it.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  let node;
  const elements = [];
  while (node = treeWalker.nextNode()) {
    elements.push(node);
  }
  return elements;
}

/**
  Sort elements by their tab indices.
  As older browsers doesn't necessarily implement stabile sort, we'll have to
  manually compare with the index in the original array.
  @private
  @param {Array<HTMLElement>} elements to sort
  @returns {Array<HTMLElement>} list of sorted focusable nodes by their tab index
*/
function sortElementsByTabIndices(elements) {
  return elements.map((element, index) => {
    return {
      index,
      element
    };
  }).sort((a, b) => {
    if (a.element.tabIndex === b.element.tabIndex) {
      return a.index - b.index;
    } else if (a.element.tabIndex === 0 || b.element.tabIndex === 0) {
      return b.element.tabIndex - a.element.tabIndex;
    }
    return a.element.tabIndex - b.element.tabIndex;
  }).map(entity => entity.element);
}

/**
  @private
  @param {Element} root The root element or node to start traversing on.
  @param {HTMLElement} activeElement The element to find the next and previous focus areas of
  @returns {object} The next and previous focus areas of the active element
 */
function findNextResponders(root, activeElement) {
  const focusAreas = compileFocusAreas(root);
  const sortedFocusAreas = sortElementsByTabIndices(focusAreas);
  const elements = activeElement.tabIndex === -1 ? focusAreas : sortedFocusAreas;
  const index = elements.indexOf(activeElement);
  if (index === -1) {
    return {
      next: sortedFocusAreas[0],
      previous: sortedFocusAreas[sortedFocusAreas.length - 1]
    };
  }
  return {
    next: elements[index + 1],
    previous: elements[index - 1]
  };
}

/**
  Emulates the user pressing the tab button.

  Sends a number of events intending to simulate a "real" user pressing tab on their
  keyboard.

  @public
  @param {Object} [options] optional tab behaviors
  @param {boolean} [options.backwards=false] indicates if the the user navigates backwards
  @param {boolean} [options.unRestrainTabIndex=false] indicates if tabbing should throw an error when tabindex is greater than 0
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Emulating pressing the `TAB` key
  </caption>
  tab();

  @example
  <caption>
    Emulating pressing the `SHIFT`+`TAB` key combination
  </caption>
  tab({ backwards: true });
*/
function triggerTab({
  backwards = false,
  unRestrainTabIndex = false
} = {}) {
  return Promise.resolve().then(() => {
    return triggerResponderChange(backwards, unRestrainTabIndex);
  }).then(() => {
    return settled();
  });
}

/**
  @private
  @param {boolean} backwards when `true` it selects the previous focus area
  @param {boolean} unRestrainTabIndex when `true`, will not throw an error if tabindex > 0 is encountered
  @returns {Promise<void>} resolves when all events are fired
 */
function triggerResponderChange(backwards, unRestrainTabIndex) {
  const root = getRootElement();
  let ownerDocument;
  let rootElement;
  if (isDocument(root)) {
    rootElement = root.body;
    ownerDocument = root;
  } else {
    rootElement = root;
    ownerDocument = root.ownerDocument;
  }
  const keyboardEventOptions = {
    keyCode: 9,
    which: 9,
    key: 'Tab',
    code: 'Tab',
    shiftKey: backwards
  };
  const debugData = {
    keyboardEventOptions,
    ownerDocument,
    rootElement
  };
  return Promise.resolve().then(() => runHooks('tab', 'start', debugData)).then(() => getActiveElement(ownerDocument)).then(activeElement => runHooks('tab', 'targetFound', activeElement).then(() => activeElement)).then(activeElement => {
    const event = _buildKeyboardEvent('keydown', keyboardEventOptions);
    const defaultNotPrevented = activeElement.dispatchEvent(event);
    if (defaultNotPrevented) {
      // Query the active element again, as it might change during event phase
      activeElement = getActiveElement(ownerDocument);
      const target = findNextResponders(rootElement, activeElement);
      if (target) {
        if (backwards && target.previous) {
          return __focus__(target.previous);
        } else if (!backwards && target.next) {
          return __focus__(target.next);
        } else {
          return __blur__(activeElement);
        }
      }
    }
    return Promise.resolve();
  }).then(() => {
    const activeElement = getActiveElement(ownerDocument);
    return fireEvent(activeElement, 'keyup', keyboardEventOptions).then(() => activeElement);
  }).then(activeElement => {
    if (!unRestrainTabIndex && activeElement.tabIndex > 0) {
      throw new Error(`tabindex of greater than 0 is not allowed. Found tabindex=${activeElement.tabIndex}`);
    }
  }).then(() => runHooks('tab', 'end', debugData));
}

registerHook('tap', 'start', target => {
  log('tap', target);
});

/**
  Taps on the specified target.

  Sends a number of events intending to simulate a "real" user tapping on an
  element.

  For non-focusable elements the following events are triggered (in order):

  - `touchstart`
  - `touchend`
  - `mousedown`
  - `mouseup`
  - `click`

  For focusable (e.g. form control) elements the following events are triggered
  (in order):

  - `touchstart`
  - `touchend`
  - `mousedown`
  - `focus`
  - `focusin`
  - `mouseup`
  - `click`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle tapping on a given element.

  Use the `options` hash to change the parameters of the tap events.

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to tap on
  @param {Object} options the options to be merged into the touch events
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Emulating tapping a button using `tap`
  </caption>

  tap('button');
*/
function tap(target, options = {}) {
  return Promise.resolve().then(() => {
    return runHooks('tap', 'start', target, options);
  }).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `tap`.');
    }
    const element = getElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`tap('${description}')\`.`);
    }
    if (isFormControl(element) && element.disabled) {
      throw new Error(`Can not \`tap\` disabled ${element}`);
    }
    return fireEvent(element, 'touchstart', options).then(touchstartEv => fireEvent(element, 'touchend', options).then(touchendEv => [touchstartEv, touchendEv])).then(([touchstartEv, touchendEv]) => !touchstartEv.defaultPrevented && !touchendEv.defaultPrevented ? __click__(element, options) : Promise.resolve()).then(settled);
  }).then(() => {
    return runHooks('tap', 'end', target, options);
  });
}

registerHook('triggerEvent', 'start', (target, eventType) => {
  log('triggerEvent', target, eventType);
});

/**
 * Triggers an event on the specified target.
 *
 * @public
 * @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to trigger the event on
 * @param {string} eventType the type of event to trigger
 * @param {Object} options additional properties to be set on the event
 * @param {boolean} force if true, will bypass availability checks (false by default)
 * @return {Promise<void>} resolves when the application is settled
 *
 * @example
 * <caption>
 * Using `triggerEvent` to upload a file
 *
 * When using `triggerEvent` to upload a file the `eventType` must be `change` and you must pass the
 * `options` param as an object with a key `files` containing an array of
 * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
 * </caption>
 *
 * triggerEvent(
 *   'input.fileUpload',
 *   'change',
 *   { files: [new Blob(['Ember Rules!'])] }
 * );
 *
 *
 * @example
 * <caption>
 * Using `triggerEvent` to upload a dropped file
 *
 * When using `triggerEvent` to handle a dropped (via drag-and-drop) file, the `eventType` must be `drop`. Assuming your `drop` event handler uses the [DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer),
 * you must pass the `options` param as an object with a key of `dataTransfer`. The `options.dataTransfer`     object should have a `files` key, containing an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
 * </caption>
 *
 * triggerEvent(
 *   '[data-test-drop-zone]',
 *   'drop',
 *   {
 *     dataTransfer: {
 *       files: [new File(['Ember Rules!'], 'ember-rules.txt')]
 *     }
 *   }
 * )
 */
function triggerEvent(target, eventType, options, force = false) {
  return Promise.resolve().then(() => {
    return runHooks('triggerEvent', 'start', target, eventType, options);
  }).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `triggerEvent`.');
    }
    if (!eventType) {
      throw new Error(`Must provide an \`eventType\` to \`triggerEvent\``);
    }
    const element = getWindowOrElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`triggerEvent('${description}', ...)\`.`);
    }
    if (!force && isFormControl(element) && element.disabled) {
      throw new Error(`Can not \`triggerEvent\` on disabled ${element}`);
    }
    return fireEvent(element, eventType, options).then(settled);
  }).then(() => {
    return runHooks('triggerEvent', 'end', target, eventType, options);
  });
}

registerHook('triggerKeyEvent', 'start', (target, eventType, key) => {
  log('triggerKeyEvent', target, eventType, key);
});
const DEFAULT_MODIFIERS = Object.freeze({
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false
});

// This is not a comprehensive list, but it is better than nothing.
const keyFromKeyCode = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'Meta',
  93: 'Meta',
  // There is two keys that map to meta,
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  219: '[',
  220: '\\',
  221: ']',
  222: "'"
};
const keyFromKeyCodeWithShift = {
  48: ')',
  49: '!',
  50: '@',
  51: '#',
  52: '$',
  53: '%',
  54: '^',
  55: '&',
  56: '*',
  57: '(',
  186: ':',
  187: '+',
  188: '<',
  189: '_',
  190: '>',
  191: '?',
  219: '{',
  220: '|',
  221: '}',
  222: '"'
};

/**
  Calculates the value of KeyboardEvent#key given a keycode and the modifiers.
  Note that this works if the key is pressed in combination with the shift key, but it cannot
  detect if caps lock is enabled.
  @param {number} keycode The keycode of the event.
  @param {object} modifiers The modifiers of the event.
  @returns {string} The key string for the event.
 */
function keyFromKeyCodeAndModifiers(keycode, modifiers) {
  if (keycode > 64 && keycode < 91) {
    if (modifiers.shiftKey) {
      return String.fromCharCode(keycode);
    } else {
      return String.fromCharCode(keycode).toLocaleLowerCase();
    }
  }
  return modifiers.shiftKey && keyFromKeyCodeWithShift[keycode] || keyFromKeyCode[keycode];
}

/**
 * Infers the keycode from the given key
 * @param {string} key The KeyboardEvent#key string
 * @returns {number} The keycode for the given key
 */
function keyCodeFromKey(key) {
  const keys = Object.keys(keyFromKeyCode);
  const keyCode = keys.find(keyCode => keyFromKeyCode[Number(keyCode)] === key) || keys.find(keyCode => keyFromKeyCode[Number(keyCode)] === key.toLowerCase());
  return keyCode !== undefined ? parseInt(keyCode) : undefined;
}

/**
  @private
  @param {Element | Document} element the element to trigger the key event on
  @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
  @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
  @param {Object} [modifiers] the state of various modifier keys
  @return {Promise<Event>} resolves when settled
 */
function __triggerKeyEvent__(element, eventType, key, modifiers = DEFAULT_MODIFIERS) {
  return Promise.resolve().then(() => {
    let props;
    if (typeof key === 'number') {
      props = {
        keyCode: key,
        which: key,
        key: keyFromKeyCodeAndModifiers(key, modifiers),
        ...modifiers
      };
    } else if (typeof key === 'string' && key.length !== 0) {
      const firstCharacter = key[0];
      if (!firstCharacter || firstCharacter !== firstCharacter.toUpperCase()) {
        throw new Error(`Must provide a \`key\` to \`triggerKeyEvent\` that starts with an uppercase character but you passed \`${key}\`.`);
      }
      if (isNumeric(key) && key.length > 1) {
        throw new Error(`Must provide a numeric \`keyCode\` to \`triggerKeyEvent\` but you passed \`${key}\` as a string.`);
      }
      const keyCode = keyCodeFromKey(key);
      props = {
        keyCode,
        which: keyCode,
        key,
        ...modifiers
      };
    } else {
      throw new Error(`Must provide a \`key\` or \`keyCode\` to \`triggerKeyEvent\``);
    }
    return fireEvent(element, eventType, props);
  });
}

/**
  Triggers a keyboard event of given type in the target element.
  It also requires the developer to provide either a string with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
  or the numeric [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) of the pressed key.
  Optionally the user can also provide a POJO with extra modifiers for the event.

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to trigger the event on
  @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
  @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
  @param {Object} [modifiers] the state of various modifier keys
  @param {boolean} [modifiers.ctrlKey=false] if true the generated event will indicate the control key was pressed during the key event
  @param {boolean} [modifiers.altKey=false] if true the generated event will indicate the alt key was pressed during the key event
  @param {boolean} [modifiers.shiftKey=false] if true the generated event will indicate the shift key was pressed during the key event
  @param {boolean} [modifiers.metaKey=false] if true the generated event will indicate the meta key was pressed during the key event
  @return {Promise<void>} resolves when the application is settled unless awaitSettled is false

  @example
  <caption>
    Emulating pressing the `ENTER` key on a button using `triggerKeyEvent`
  </caption>
  triggerKeyEvent('button', 'keydown', 'Enter');
*/
function triggerKeyEvent(target, eventType, key, modifiers = DEFAULT_MODIFIERS) {
  return Promise.resolve().then(() => {
    return runHooks('triggerKeyEvent', 'start', target, eventType, key);
  }).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `triggerKeyEvent`.');
    }
    const element = getElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`triggerKeyEvent('${description}')\`.`);
    }
    if (!eventType) {
      throw new Error(`Must provide an \`eventType\` to \`triggerKeyEvent\``);
    }
    if (!isKeyboardEventType(eventType)) {
      const validEventTypes = KEYBOARD_EVENT_TYPES.join(', ');
      throw new Error(`Must provide an \`eventType\` of ${validEventTypes} to \`triggerKeyEvent\` but you passed \`${eventType}\`.`);
    }
    if (isFormControl(element) && element.disabled) {
      throw new Error(`Can not \`triggerKeyEvent\` on disabled ${element}`);
    }
    return __triggerKeyEvent__(element, eventType, key, modifiers).then(settled);
  }).then(() => runHooks('triggerKeyEvent', 'end', target, eventType, key));
}

// ref: https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
const constrainedInputTypes = ['text', 'search', 'url', 'tel', 'email', 'password'];

/**
  @private
  @param {Element} element - the element to check
  @returns {boolean} `true` when the element should constrain input by the maxlength attribute, `false` otherwise
*/
function isMaxLengthConstrained(element) {
  return !!Number(element.getAttribute('maxlength')) && (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement && constrainedInputTypes.indexOf(element.type) > -1);
}

/**
 * @private
 * @param {Element} element - the element to check
 * @param {string} text - the text being added to element
 * @param {string} testHelper - the test helper context the guard is called from (for Error message)
 * @throws if `element` has `maxlength` & `value` exceeds `maxlength`
 */
function guardForMaxlength(element, text, testHelper) {
  const maxlength = element.getAttribute('maxlength');
  if (isMaxLengthConstrained(element) && maxlength && text && text.length > Number(maxlength)) {
    throw new Error(`Can not \`${testHelper}\` with text: '${text}' that exceeds maxlength: '${maxlength}'.`);
  }
}

registerHook('fillIn', 'start', (target, text) => {
  log('fillIn', target, text);
});

/**
  Fill the provided text into the `value` property (or set `.innerHTML` when
  the target is a content editable element) then trigger `change` and `input`
  events on the specified target.

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to enter text into
  @param {string} text the text to fill into the target element
  @return {Promise<void>} resolves when the application is settled

  @example
  <caption>
    Emulating filling an input with text using `fillIn`
  </caption>

  fillIn('input', 'hello world');
*/
function fillIn(target, text) {
  return Promise.resolve().then(() => runHooks('fillIn', 'start', target, text)).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `fillIn`.');
    }
    const element = getElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`fillIn('${description}')\`.`);
    }
    if (typeof text === 'undefined' || text === null) {
      throw new Error('Must provide `text` when calling `fillIn`.');
    }
    if (isFormControl(element)) {
      if (element.disabled) {
        throw new Error(`Can not \`fillIn\` disabled '${getDescription(target)}'.`);
      }
      if ('readOnly' in element && element.readOnly) {
        throw new Error(`Can not \`fillIn\` readonly '${getDescription(target)}'.`);
      }
      guardForMaxlength(element, text, 'fillIn');
      return __focus__(element).then(() => {
        element.value = text;
        return element;
      });
    } else if (isContentEditable(element)) {
      return __focus__(element).then(() => {
        element.innerHTML = text;
        return element;
      });
    } else {
      throw new Error('`fillIn` is only usable on form controls or contenteditable elements.');
    }
  }).then(element => fireEvent(element, 'input').then(() => fireEvent(element, 'change')).then(settled)).then(() => runHooks('fillIn', 'end', target, text));
}

/**
  @private
  @param {Element} element the element to check
  @returns {boolean} `true` when the element is a select element, `false` otherwise
*/
function isSelectElement(element) {
  return !isDocument(element) && element.tagName === 'SELECT';
}

// eslint-disable-next-line require-jsdoc
function errorMessage$1(message, target) {
  const description = getDescription(target);
  return `${message} when calling \`select('${description}')\`.`;
}

/**
  Set the `selected` property true for the provided option the target is a
  select element (or set the select property true for multiple options if the
  multiple attribute is set true on the HTMLSelectElement) then trigger
  `change` and `input` events on the specified target.

  @public
  @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor for the select element
  @param {string|string[]} options the value/values of the items to select
  @param {boolean} keepPreviouslySelected a flag keep any existing selections
  @return {Promise<void>} resolves when the application is settled

  @example
  <caption>
    Emulating selecting an option or multiple options using `select`
  </caption>

  select('select', 'apple');

  select('select', ['apple', 'orange']);

  select('select', ['apple', 'orange'], true);
*/
function select(target, options, keepPreviouslySelected = false) {
  return Promise.resolve().then(() => runHooks('select', 'start', target, options, keepPreviouslySelected)).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `select`.');
    }
    if (typeof options === 'undefined' || options === null) {
      throw new Error('Must provide an `option` or `options` to select when calling `select`.');
    }
    const element = getElement(target);
    if (!element) {
      throw new Error(errorMessage$1('Element not found', target));
    }
    if (!isSelectElement(element)) {
      throw new Error(errorMessage$1('Element is not a HTMLSelectElement', target));
    }
    if (element.disabled) {
      throw new Error(errorMessage$1('Element is disabled', target));
    }
    options = Array.isArray(options) ? options : [options];
    if (!element.multiple && options.length > 1) {
      throw new Error(errorMessage$1('HTMLSelectElement `multiple` attribute is set to `false` but multiple options were passed', target));
    }
    return __focus__(element).then(() => element);
  }).then(element => {
    for (let i = 0; i < element.options.length; i++) {
      const elementOption = element.options.item(i);
      if (elementOption) {
        if (options.indexOf(elementOption.value) > -1) {
          elementOption.selected = true;
        } else if (!keepPreviouslySelected) {
          elementOption.selected = false;
        }
      }
    }
    return fireEvent(element, 'input').then(() => fireEvent(element, 'change')).then(settled);
  }).then(() => runHooks('select', 'end', target, options, keepPreviouslySelected));
}

/**
  Used internally by the DOM interaction helpers to find multiple elements.

  @private
  @param {string} target the selector to retrieve
  @returns {NodeList} the matched elements
*/
function getElements(target) {
  if (typeof target === 'string') {
    const rootElement = getRootElement();
    return rootElement.querySelectorAll(target);
  } else {
    const descriptorData = lookupDescriptorData(target);
    if (descriptorData) {
      return resolveDOMElements(descriptorData);
    } else {
      throw new Error('Must use a selector string or DOM element descriptor');
    }
  }
}

/**
  Used to wait for a particular selector to appear in the DOM. Due to the fact
  that it does not wait for general settledness, this is quite useful for testing
  interim DOM states (e.g. loading states, pending promises, etc).

  @param {string|IDOMElementDescriptor} target the selector or DOM element descriptor to wait for
  @param {Object} [options] the options to be used
  @param {number} [options.timeout=1000] the time to wait (in ms) for a match
  @param {number} [options.count=null] the number of elements that should match the provided selector (null means one or more)
  @return {Promise<Element|Element[]>} resolves when the element(s) appear on the page

  @example
  <caption>
    Waiting until a selector is rendered:
  </caption>
  await waitFor('.my-selector', { timeout: 2000 })
*/
function waitFor(target, options = {}) {
  return Promise.resolve().then(() => {
    if (typeof target !== 'string' && !lookupDescriptorData(target)) {
      throw new Error('Must pass a selector or DOM element descriptor to `waitFor`.');
    }
    const {
      timeout = 1000,
      count = null
    } = options;
    let {
      timeoutMessage
    } = options;
    if (!timeoutMessage) {
      const description = getDescription(target);
      timeoutMessage = `waitFor timed out waiting for selector "${description}"`;
    }
    let callback;
    if (count !== null) {
      callback = () => {
        const elements = Array.from(getElements(target));
        if (elements.length === count) {
          return elements;
        }
        return;
      };
    } else {
      callback = () => getElement(target);
    }
    return waitUntil(callback, {
      timeout,
      timeoutMessage
    });
  });
}

// Derived from `querySelector` types.

/**
  Find the first element matched by the given selector. Equivalent to calling
  `querySelector()` on the test root element.

  @public
  @param {string} selector the selector to search for
  @return {Element | null} matched element or null

  @example
  <caption>
    Finding the first element with id 'foo'
  </caption>
  find('#foo');
*/
function find(selector) {
  if (!selector) {
    throw new Error('Must pass a selector to `find`.');
  }
  if (arguments.length > 1) {
    throw new Error('The `find` test helper only takes a single argument.');
  }
  return getElement(selector);
}

// Derived, with modification, from the types for `querySelectorAll`. These
// would simply be defined as a tweaked re-export as `querySelector` is, but it
// is non-trivial (to say the least!) to preserve overloads like this while also
// changing the return type (from `NodeListOf` to `Array`).

/**
  Find all elements matched by the given selector. Similar to calling
  `querySelectorAll()` on the test root element, but returns an array instead
  of a `NodeList`.

  @public
  @param {string} selector the selector to search for
  @return {Array} array of matched elements

  @example
  <caption>
    Find all of the elements matching '.my-selector'.
  </caption>
  findAll('.my-selector');
*/
function findAll(selector) {
  if (!selector) {
    throw new Error('Must pass a selector to `findAll`.');
  }
  if (arguments.length > 1) {
    throw new Error('The `findAll` test helper only takes a single argument.');
  }
  return Array.from(getElements(selector));
}

registerHook('typeIn', 'start', (target, text) => {
  log('typeIn', target, text);
});

/**
 * Mimics character by character entry into the target `input` or `textarea` element.
 *
 * Allows for simulation of slow entry by passing an optional millisecond delay
 * between key events.

 * The major difference between `typeIn` and `fillIn` is that `typeIn` triggers
 * keyboard events as well as `input` and `change`.
 * Typically this looks like `focus` -> `focusin` -> `keydown` -> `keypress` -> `keyup` -> `input` -> `change`
 * per character of the passed text (this may vary on some browsers).
 *
 * @public
 * @param {string|Element|IDOMElementDescriptor} target the element, selector, or descriptor to enter text into
 * @param {string} text the test to fill the element with
 * @param {Object} options {delay: x} (default 50) number of milliseconds to wait per keypress
 * @return {Promise<void>} resolves when the application is settled
 *
 * @example
 * <caption>
 *   Emulating typing in an input using `typeIn`
 * </caption>
 *
 * typeIn('input', 'hello world');
 */
function typeIn(target, text, options = {}) {
  return Promise.resolve().then(() => {
    return runHooks('typeIn', 'start', target, text, options);
  }).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `typeIn`.');
    }
    const element = getElement(target);
    if (!element) {
      const description = getDescription(target);
      throw new Error(`Element not found when calling \`typeIn('${description}')\``);
    }
    if (isDocument(element) || !isFormControl(element) && !isContentEditable(element)) {
      throw new Error('`typeIn` is only usable on form controls or contenteditable elements.');
    }
    if (typeof text === 'undefined' || text === null) {
      throw new Error('Must provide `text` when calling `typeIn`.');
    }
    if (isFormControl(element)) {
      if (element.disabled) {
        throw new Error(`Can not \`typeIn\` disabled '${getDescription(target)}'.`);
      }
      if ('readOnly' in element && element.readOnly) {
        throw new Error(`Can not \`typeIn\` readonly '${getDescription(target)}'.`);
      }
    }
    const {
      delay = 50
    } = options;
    return __focus__(element).then(() => fillOut(element, text, delay)).then(() => fireEvent(element, 'change')).then(settled).then(() => runHooks('typeIn', 'end', target, text, options));
  });
}

// eslint-disable-next-line require-jsdoc
function fillOut(element, text, delay) {
  const inputFunctions = text.split('').map(character => keyEntry(element, character));
  return inputFunctions.reduce((currentPromise, func) => {
    return currentPromise.then(() => delayedExecute(delay)).then(func);
  }, Promise.resolve());
}

// eslint-disable-next-line require-jsdoc
function keyEntry(element, character) {
  const shiftKey = character === character.toUpperCase() && character !== character.toLowerCase();
  const options = {
    shiftKey
  };
  const characterKey = character.toUpperCase();
  return function () {
    return Promise.resolve().then(() => __triggerKeyEvent__(element, 'keydown', characterKey, options)).then(() => __triggerKeyEvent__(element, 'keypress', characterKey, options)).then(() => {
      if (isFormControl(element)) {
        const newValue = element.value + character;
        guardForMaxlength(element, newValue, 'typeIn');
        element.value = newValue;
      } else {
        const newValue = element.innerHTML + character;
        element.innerHTML = newValue;
      }
      return fireEvent(element, 'input');
    }).then(() => __triggerKeyEvent__(element, 'keyup', characterKey, options));
  };
}

// eslint-disable-next-line require-jsdoc
function delayedExecute(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// eslint-disable-next-line require-jsdoc
function errorMessage(message, target) {
  const description = getDescription(target);
  return `${message} when calling \`scrollTo('${description}')\`.`;
}

/**
  Scrolls DOM element, selector, or descriptor to the given coordinates.
  @public
  @param {string|HTMLElement|IDOMElementDescriptor} target the element, selector, or descriptor to trigger scroll on
  @param {Number} x x-coordinate
  @param {Number} y y-coordinate
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Scroll DOM element to specific coordinates
  </caption>

  scrollTo('#my-long-div', 0, 0); // scroll to top
  scrollTo('#my-long-div', 0, 100); // scroll down
*/
function scrollTo(target, x, y) {
  return Promise.resolve().then(() => runHooks('scrollTo', 'start', target)).then(() => {
    if (!target) {
      throw new Error('Must pass an element, selector, or descriptor to `scrollTo`.');
    }
    if (x === undefined || y === undefined) {
      throw new Error('Must pass both x and y coordinates to `scrollTo`.');
    }
    const element = getElement(target);
    if (!element) {
      throw new Error(errorMessage('Element not found', target));
    }
    if (!isElement(element)) {
      let nodeType;
      if (isDocument(element)) {
        nodeType = 'Document';
      } else {
        // This is an error check for non-typescript callers passing in the
        // wrong type for `target`, so we have to cast `element` (which is
        // `never` inside this block) to something that will allow us to
        // access `nodeType`.
        const notElement = element;
        nodeType = notElement.nodeType;
      }
      throw new Error(errorMessage(`"target" must be an element, but was a ${nodeType}`, target));
    }
    element.scrollTop = y;
    element.scrollLeft = x;
    return fireEvent(element, 'scroll').then(settled);
  }).then(() => runHooks('scrollTo', 'end', target));
}

/**
  Used to wait for a particular selector to receive focus. Useful for verifying
  keyboard navigation handling and default focus behaviour, without having to
  think about timing issues.

  @param {string|IDOMElementDescriptor} target the selector or DOM element descriptor to wait receiving focus
  @param {Object} [options] the options to be used
  @param {number} [options.timeout=1000] the time to wait (in ms) for a match
  @param {string} [options.timeoutMessage='waitForFocus timed out waiting for selector'] the message to use in the reject on timeout
  @return {Promise<Element>} resolves when the element received focus

  @example
  <caption>
    Waiting until a selector receive focus:
  </caption>
  await waitForFocus('.my-selector', { timeout: 2000 })
*/
function waitForFocus(target, options = {}) {
  return Promise.resolve().then(() => {
    if (typeof target !== 'string' && !lookupDescriptorData(target)) {
      throw new Error('Must pass a selector or DOM element descriptor to `waitFor`.');
    }
    const {
      timeout = 1000
    } = options;
    let {
      timeoutMessage
    } = options;
    if (!timeoutMessage) {
      const description = getDescription(target);
      timeoutMessage = `waitForFocus timed out waiting for selector "${description}"`;
    }
    return waitUntil(() => {
      const element = getElement(target);
      if (element && element === document.activeElement) {
        return document.activeElement;
      }
    }, {
      timeout,
      timeoutMessage
    });
  });
}

export { blur, clearRender, click, currentRouteName, currentURL, doubleClick, fillIn, find, findAll, focus, getApplication, getContext, getDebugInfo, getDeprecations, getDeprecationsDuringCallback, getResolver, getRootElement, getSettledState, getTestMetadata, getWarnings, getWarningsDuringCallback, hasEmberVersion, isSettled, pauseTest, registerDebugInfoHelper, registerHook, render, rerender, resetOnerror, resumeTest, runHooks, scrollTo, select, setApplication, setContext, setResolver, settled, setupApplicationContext, setupContext, setupOnerror, setupRenderingContext, triggerTab as tab, tap, teardownContext, triggerEvent, triggerKeyEvent, typeIn, unsetContext, validateErrorHandler, visit, waitFor, waitForFocus, waitUntil };
