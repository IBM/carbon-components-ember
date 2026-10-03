//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/flags-BZxHQ0yn.js
var InternalComponentCapabilities = {
	Empty: 0,
	dynamicLayout: 1,
	dynamicTag: 2,
	prepareArgs: 4,
	createArgs: 8,
	attributeHook: 16,
	elementHook: 32,
	dynamicScope: 64,
	createCaller: 128,
	updateHook: 256,
	createInstance: 512,
	wrapped: 1024,
	willDestroy: 2048,
	hasSubOwner: 4096
};
var MACHINE_MASK = 1024;
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/capabilities-BuVYh-vx.js
function buildCapabilities(capabilities) {
	return capabilities;
}
var EMPTY = InternalComponentCapabilities.Empty;
/**
* Converts a ComponentCapabilities object into a 32-bit integer representation.
*/
function capabilityFlagsFrom(capabilities) {
	return EMPTY | capability(capabilities, "dynamicLayout") | capability(capabilities, "dynamicTag") | capability(capabilities, "prepareArgs") | capability(capabilities, "createArgs") | capability(capabilities, "attributeHook") | capability(capabilities, "elementHook") | capability(capabilities, "dynamicScope") | capability(capabilities, "createCaller") | capability(capabilities, "updateHook") | capability(capabilities, "createInstance") | capability(capabilities, "wrapped") | capability(capabilities, "willDestroy") | capability(capabilities, "hasSubOwner");
}
function capability(capabilities, capability) {
	return capabilities[capability] ? InternalComponentCapabilities[capability] : EMPTY;
}
function managerHasCapability(_manager, capabilities, capability) {
	return !!(capabilities & capability);
}
function hasCapability(capabilities, capability) {
	return !!(capabilities & capability);
}
//#endregion
export { InternalComponentCapabilities as a, managerHasCapability as i, capabilityFlagsFrom as n, MACHINE_MASK as o, hasCapability as r, buildCapabilities as t };
