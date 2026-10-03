import { U as get } from "./core-D-L0f59Y.js";
import { n as registerDestructor, r as unregisterDestructor } from "./destroyable-Cwxqj0yK.js";
import { t as Helper } from "./helper-D1xNZ1iZ.js";
import "./html-safe-CoH5G2UU.js";
import "./get-fn-CG48TaTQ.js";
//#region ../carbon-components-ember/dist/helpers/generic.js
var GenericHelper = class extends Helper {
	updateCallback;
	teardownCallback;
	compute(positional, named) {
		const firstTime = !this.updateCallback;
		this.updateCallback = named.update;
		if (named.teardown) {
			if (this.teardownCallback) unregisterDestructor(this, this.teardownCallback);
			this.teardownCallback = named.teardown;
			if (this.teardownCallback) registerDestructor(this, this.teardownCallback);
		}
		if (this.updateCallback && !firstTime) this.updateCallback();
		if (firstTime && named.create) named.create();
		positional.forEach((v, i) => get(positional, i));
		return positional;
	}
};
//#endregion
export { GenericHelper as t };
