//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/engine/lib/engine-parent.js
/**
@module @ember/engine
*/
var ENGINE_PARENT = Symbol("ENGINE_PARENT");
/**
`getEngineParent` retrieves an engine instance's parent instance.

@method getEngineParent
@param {EngineInstance} engine An engine instance.
@return {EngineInstance} The parent engine instance.
@for @ember/engine
@static
@private
*/
function getEngineParent(engine) {
	return engine[ENGINE_PARENT];
}
/**
`setEngineParent` sets an engine instance's parent instance.

@method setEngineParent
@param {EngineInstance} engine An engine instance.
@param {EngineInstance} parent The parent engine instance.
@private
*/
function setEngineParent(engine, parent) {
	engine[ENGINE_PARENT] = parent;
}
//#endregion
export { getEngineParent as n, setEngineParent as r, ENGINE_PARENT as t };
