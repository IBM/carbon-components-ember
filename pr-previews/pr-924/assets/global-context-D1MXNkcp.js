//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/global-context/index.js
/**
* This package contains global context functions for Glimmer. These functions
* are set by the embedding environment and must be set before initial render.
*
* These functions should meet the following criteria:
*
* - Must be provided by the embedder, due to having framework specific
*   behaviors (e.g. interop with classic Ember behaviors that should not be
*   upstreamed) or to being out of scope for the VM (e.g. scheduling a
*   revalidation)
* - Never differ between render roots
* - Never change over time
*
*/
/**
* Interfaces
*
* TODO: Move these into @glimmer/interfaces, move @glimmer/interfaces to
* @glimmer/internal-interfaces.
*/
/**
* Schedules a VM revalidation.
*
* Note: this has a default value so that tags can warm themselves when first loaded.
*/
var scheduleRevalidate = () => {};
/**
* Schedules a destructor to run
*
* @param destroyable The destroyable being destroyed
* @param destructor The destructor being scheduled
*/
var scheduleDestroy;
/**
* Finalizes destruction
*
* @param finalizer finalizer function
*/
var scheduleDestroyed;
/**
* Hook to provide iterators for `{{each}}` loops
*
* @param value The value to create an iterator for
*/
var toIterator;
/**
* Hook to specify truthiness within Glimmer templates
*
* @param value The value to convert to a boolean
*/
var toBool;
/**
* Hook for specifying how Glimmer should access properties in cases where it
* needs to. For instance, accessing an object's values in templates.
*
* @param obj The object provided to get a value from
* @param path The path to get the value from
*/
var getProp;
/**
* Hook for specifying how Glimmer should update props in cases where it needs
* to. For instance, when updating a template reference (e.g. 2-way-binding)
*
* @param obj The object provided to get a value from
* @param prop The prop to set the value at
* @param value The value to set the value to
*/
var setProp;
/**
* Hook for specifying how Glimmer should access paths in cases where it needs
* to. For instance, the `key` value of `{{each}}` loops.
*
* @param obj The object provided to get a value from
* @param path The path to get the value from
*/
var getPath;
/**
* Hook for specifying how Glimmer should update paths in cases where it needs
* to. For instance, when updating a template reference (e.g. 2-way-binding)
*
* @param obj The object provided to get a value from
* @param path The path to get the value from
*/
var setPath;
function setGlobalContext(context) {
	scheduleRevalidate = context.scheduleRevalidate;
	scheduleDestroy = context.scheduleDestroy;
	scheduleDestroyed = context.scheduleDestroyed;
	toIterator = context.toIterator;
	toBool = context.toBool;
	getProp = context.getProp;
	setProp = context.setProp;
	getPath = context.getPath;
	setPath = context.setPath;
	context.warnIfStyleNotTrusted;
	context.assert;
	context.deprecate;
}
//#endregion
export { scheduleRevalidate as a, setProp as c, scheduleDestroyed as i, toBool as l, getProp as n, setGlobalContext as o, scheduleDestroy as r, setPath as s, getPath as t, toIterator as u };
