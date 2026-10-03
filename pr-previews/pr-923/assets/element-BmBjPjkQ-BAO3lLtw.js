import { S as valueForRef, a as NULL_REFERENCE, d as createComputeRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { d as setInternalComponentManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { t as internalHelper } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/element-BmBjPjkQ.js
/**
@module @ember/helper
*/
var ELEMENT_CAPABILITIES = {
	createInstance: true,
	wrapped: true
};
var ElementComponentManager = class {
	getCapabilities() {
		return ELEMENT_CAPABILITIES;
	}
	getDebugName(state) {
		return `(element "${state.tagName}")`;
	}
	getSelf() {
		return NULL_REFERENCE;
	}
	getDestroyable() {
		return null;
	}
	didCreateElement() {}
	create(_owner, state) {
		return state.tagName || null;
	}
	getTagName(state) {
		return state;
	}
	didRenderLayout() {}
	didUpdateLayout() {}
	didCreate() {}
	didUpdate() {}
};
var ELEMENT_COMPONENT_MANAGER = new ElementComponentManager();
var ElementComponentDefinition = class {
	constructor(tagName) {
		this.tagName = tagName;
	}
	toString() {
		return `(element "${this.tagName}")`;
	}
};
setInternalComponentManager(ELEMENT_COMPONENT_MANAGER, ElementComponentDefinition.prototype);
var ELEMENT_DEFINITIONS = /* @__PURE__ */ new Map();
function getElementDefinition(tagName) {
	let definition = ELEMENT_DEFINITIONS.get(tagName);
	if (definition === void 0) {
		definition = new ElementComponentDefinition(tagName);
		ELEMENT_DEFINITIONS.set(tagName, definition);
	}
	return definition;
}
var element = internalHelper(({ positional, named }) => {
	return createComputeRef(() => {
		return getElementDefinition(valueForRef(positional[0]));
	}, null, "element");
});
//#endregion
export { element as t };
