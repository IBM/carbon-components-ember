import { bs as assert, bt as inspect, bu as isTesting, bv as setTesting } from './main-B8rrDxlx.js';

// This is a "global", but instead of declaring it as `declare global`, which
// will expose it to all other modules, declare it *locally* (and don't export
// it) so that it has the desired "private global" semantics -- however odd that
// particular notion is.

/**
 @module @ember/debug
 @public
*/
/**
  Allows for runtime registration of handler functions that override the default deprecation behavior.
  Deprecations are invoked by calls to [@ember/debug/deprecate](/ember/release/classes/@ember%2Fdebug/methods/deprecate?anchor=deprecate).
  The following example demonstrates its usage by registering a handler that throws an error if the
  message contains the word "should", otherwise defers to the default handler.

  ```javascript
  import { registerDeprecationHandler } from '@ember/debug';

  registerDeprecationHandler((message, options, next) => {
    if (message.indexOf('should') !== -1) {
      throw new Error(`Deprecation message with should: ${message}`);
    } else {
      // defer to whatever handler was registered before this one
      next(message, options);
    }
  });
  ```

  The handler function takes the following arguments:

  <ul>
    <li> <code>message</code> - The message received from the deprecation call.</li>
    <li> <code>options</code> - An object passed in with the deprecation call containing additional information including:</li>
      <ul>
        <li> <code>id</code> - An id of the deprecation in the form of <code>package-name.specific-deprecation</code>.</li>
        <li> <code>until</code> - The Ember version number the feature and deprecation will be removed in.</li>
      </ul>
    <li> <code>next</code> - A function that calls into the previously registered handler.</li>
  </ul>

  @public
  @static
  @method registerDeprecationHandler
  @for @ember/debug
  @param handler {Function} A function to handle deprecation calls.
  @since 2.1.0
*/
let registerHandler$1 = () => {};
let deprecate$1 = () => {};

let registerHandler = () => {};

/**
  @module @ember/debug
*/
/**
  Ember Inspector calls this function to capture the current render tree.

  In production mode, this requires turning on `ENV._DEBUG_RENDER_TREE`
  before loading Ember.

  @private
  @static
  @method captureRenderTree
  @for @ember/debug
  @param app {ApplicationInstance} An `ApplicationInstance`.
  @since 3.14.0
*/
function captureRenderTree(app) {
  let domRenderer = app.lookup('renderer:-dom');
  if (!domRenderer) {
    throw new Error(`BUG: owner is missing renderer`);
  }
  // SAFETY: Ideally we'd assert here but that causes awkward circular requires since this is also in @ember/debug.
  // This is only for debug stuff so not very risky.
  let renderer = domRenderer;
  return renderer.debugRenderTree.capture();
}

// These are the default production build versions:
const noop = () => {};

// SAFETY: these casts are just straight-up lies, but the point is that they do
// not do anything in production builds.
let info = noop;
let warn = noop;
let debug = noop;
let debugSeal = noop;
let debugFreeze = noop;
let runInDebug = noop;
let setDebugFunction = noop;
let getDebugFunction = noop;
let deprecateFunc = function () {
  return arguments[arguments.length - 1];
};
function deprecate(...args) {
  return deprecate$1(...args);
}
let _warnIfUsingStrippedFeatureFlags;

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _warnIfUsingStrippedFeatureFlags,
  assert,
  captureRenderTree,
  debug,
  debugFreeze,
  debugSeal,
  deprecate,
  deprecateFunc,
  getDebugFunction,
  info,
  inspect,
  isTesting,
  registerDeprecationHandler: registerHandler$1,
  registerWarnHandler: registerHandler,
  runInDebug,
  setDebugFunction,
  setTesting,
  warn
}, Symbol.toStringTag, { value: 'Module' }));

export { index as i };
