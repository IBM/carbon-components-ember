import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { n as assert, t as inspect } from "./inspect-DT5CkGp4.js";
import { n as setTesting, t as isTesting } from "./testing-Chw1oEEI.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/debug/lib/deprecate.js
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
var registerHandler$1 = () => {};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/debug/lib/warn.js
var registerHandler = () => {};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/debug/lib/capture-render-tree.js
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
	let domRenderer = app.lookup("renderer:-dom");
	if (!domRenderer) throw new Error(`BUG: owner is missing renderer`);
	return domRenderer.debugRenderTree.capture();
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/debug/index.js
var debug_exports = /* @__PURE__ */ __exportAll({
	_warnIfUsingStrippedFeatureFlags: () => _warnIfUsingStrippedFeatureFlags,
	assert: () => assert,
	captureRenderTree: () => captureRenderTree,
	debug: () => debug,
	debugFreeze: () => debugFreeze,
	debugSeal: () => debugSeal,
	deprecate: () => deprecate,
	deprecateFunc: () => deprecateFunc,
	getDebugFunction: () => getDebugFunction,
	info: () => info,
	inspect: () => inspect,
	isTesting: () => isTesting,
	registerDeprecationHandler: () => registerHandler$1,
	registerWarnHandler: () => registerHandler,
	runInDebug: () => runInDebug,
	setDebugFunction: () => setDebugFunction,
	setTesting: () => setTesting,
	warn: () => warn
});
var noop = () => {};
var info = noop;
var warn = noop;
var debug = noop;
var debugSeal = noop;
var debugFreeze = noop;
var runInDebug = noop;
var setDebugFunction = noop;
var getDebugFunction = noop;
var deprecateFunc = function() {
	return arguments[arguments.length - 1];
};
function deprecate(...args) {
	[...args];
}
var _warnIfUsingStrippedFeatureFlags;
//#endregion
export { debug_exports as a, getDebugFunction as c, setDebugFunction as d, warn as f, registerHandler$1 as h, debugSeal as i, info as l, registerHandler as m, debug as n, deprecate as o, captureRenderTree as p, debugFreeze as r, deprecateFunc as s, _warnIfUsingStrippedFeatureFlags as t, runInDebug as u };
