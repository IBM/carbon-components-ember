//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/owner/index.js
var OWNER = Symbol("OWNER");
/**
Framework objects in a Glimmer application may receive an owner object.
Glimmer is unopinionated about this owner, but will forward it through its
internal resolution system, and through its managers if it is provided.
*/
function getOwner(object) {
	return object[OWNER];
}
/**
`setOwner` set's an object's owner
*/
function setOwner(object, owner) {
	object[OWNER] = owner;
}
//#endregion
export { getOwner as n, setOwner as r, OWNER as t };
