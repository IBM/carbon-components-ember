//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/test/index.js
var registerWaiter;
var unregisterWaiter;
var _impl;
var testingNotAvailableMessage = () => {
	throw new Error("Attempted to use test utilities, but `ember-testing` was not included");
};
registerWaiter = testingNotAvailableMessage;
unregisterWaiter = testingNotAvailableMessage;
function registerTestImplementation(impl) {
	let { Test } = impl;
	registerWaiter = Test.registerWaiter;
	unregisterWaiter = Test.unregisterWaiter;
	_impl = impl;
}
//#endregion
export { unregisterWaiter as i, registerTestImplementation as n, registerWaiter as r, _impl as t };
