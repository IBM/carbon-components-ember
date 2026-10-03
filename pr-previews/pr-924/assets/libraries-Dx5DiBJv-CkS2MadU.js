import { t as VERSION } from "./version-dVdMCUiN.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/libraries-Dx5DiBJv.js
/**
@module ember
*/
/**
Helper class that allows you to register your library with Ember.

Singleton created at `Ember.libraries`.

@class Libraries
@constructor
@private
*/
var Libraries = class {
	_registry;
	_coreLibIndex;
	constructor() {
		this._registry = [];
		this._coreLibIndex = 0;
	}
	_getLibraryByName(name) {
		let libs = this._registry;
		for (let lib of libs) if (lib.name === name) return lib;
	}
	register(name, version, isCoreLibrary) {
		let index = this._registry.length;
		if (!this._getLibraryByName(name)) {
			if (isCoreLibrary) index = this._coreLibIndex++;
			this._registry.splice(index, 0, {
				name,
				version
			});
		}
	}
	registerCoreLibrary(name, version) {
		this.register(name, version, true);
	}
	deRegister(name) {
		let lib = this._getLibraryByName(name);
		let index;
		if (lib) {
			index = this._registry.indexOf(lib);
			this._registry.splice(index, 1);
		}
	}
};
var LIBRARIES = new Libraries();
LIBRARIES.registerCoreLibrary("Ember", VERSION);
//#endregion
export { Libraries as n, LIBRARIES as t };
