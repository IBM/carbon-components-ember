import { r as setOwner, t as getOwner } from "./owner-Bxxa-eff.js";
import { S as guidFor } from "./core-D-L0f59Y.js";
import { n as assert } from "./inspect-DT5CkGp4.js";
import { k as untrack } from "./cache-CofLhaS4-CWmaBWeq.js";
import { S as valueForRef, f as createConstRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { d as setInternalComponentManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/views/lib/system/utils.js
/**
@module ember
*/
function isSimpleClick(event) {
	if (!(event instanceof MouseEvent)) return false;
	let modifier = event.shiftKey || event.metaKey || event.altKey || event.ctrlKey;
	let secondaryClick = event.button !== 0;
	return !modifier && !secondaryClick;
}
function constructStyleDeprecationMessage(affectedStyle) {
	return "Binding style attributes may introduce cross-site scripting vulnerabilities; please ensure that values being bound are properly escaped. For more information, including how to disable this warning, see https://deprecations.emberjs.com/v1.x/#toc_binding-style-attributes. Style affected: \"" + affectedStyle + "\"";
}
/**
@private
@method getRootViews
@param {Object} owner
*/
function getRootViews(owner) {
	let registry = owner.lookup("-view-registry:main");
	let rootViews = [];
	Object.keys(registry).forEach((id) => {
		let view = registry[id];
		if (view.parentView === null) rootViews.push(view);
	});
	return rootViews;
}
/**
@private
@method getViewId
@param {Ember.View} view
*/
function getViewId(view) {
	if (view.tagName !== "" && view.elementId) return view.elementId;
	else return guidFor(view);
}
var ELEMENT_VIEW = /* @__PURE__ */ new WeakMap();
var VIEW_ELEMENT = /* @__PURE__ */ new WeakMap();
function getElementView(element) {
	return ELEMENT_VIEW.get(element) || null;
}
/**
@private
@method getViewElement
@param {Ember.View} view
*/
function getViewElement(view) {
	return VIEW_ELEMENT.get(view) || null;
}
function setElementView(element, view) {
	ELEMENT_VIEW.set(element, view);
}
function setViewElement(view, element) {
	VIEW_ELEMENT.set(view, element);
}
function clearElementView(element) {
	ELEMENT_VIEW.delete(element);
}
function clearViewElement(view) {
	VIEW_ELEMENT.delete(view);
}
var CHILD_VIEW_IDS = /* @__PURE__ */ new WeakMap();
/**
@private
@method getChildViews
@param {Ember.View} view
*/
function getChildViews(view) {
	return collectChildViews(view, getOwner(view).lookup("-view-registry:main"));
}
function initChildViews(view) {
	let childViews = /* @__PURE__ */ new Set();
	CHILD_VIEW_IDS.set(view, childViews);
	return childViews;
}
function addChildView(parent, child) {
	let childViews = CHILD_VIEW_IDS.get(parent);
	if (childViews === void 0) childViews = initChildViews(parent);
	childViews.add(getViewId(child));
}
function collectChildViews(view, registry) {
	let views = [];
	let childViews = CHILD_VIEW_IDS.get(view);
	if (childViews !== void 0) childViews.forEach((id) => {
		let view = registry[id];
		if (view && !view.isDestroying && !view.isDestroyed) views.push(view);
	});
	return views;
}
/**
@private
@method getViewBounds
@param {Ember.View} view
*/
function getViewBounds(view) {
	return view.renderer.getBounds(view);
}
/**
@private
@method getViewRange
@param {Ember.View} view
*/
function getViewRange(view) {
	let bounds = getViewBounds(view);
	let range = document.createRange();
	range.setStartBefore(bounds.firstNode);
	range.setEndAfter(bounds.lastNode);
	return range;
}
/**
`getViewClientRects` provides information about the position of the border
box edges of a view relative to the viewport.

It is only intended to be used by development tools like the Ember Inspector.

@private
@method getViewClientRects
@param {Ember.View} view
*/
function getViewClientRects(view) {
	return getViewRange(view).getClientRects();
}
/**
`getViewBoundingClientRect` provides information about the position of the
bounding border box edges of a view relative to the viewport.

It is only intended to be used by development tools like the Ember Inspector.

@private
@method getViewBoundingClientRect
@param {Ember.View} view
*/
function getViewBoundingClientRect(view) {
	return getViewRange(view).getBoundingClientRect();
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/internal-BQ7zHrqS.js
function NOOP() {}
var InternalComponent = class {
	static toString() {
		return "internal component";
	}
	constructor(owner, args, caller) {
		this.owner = owner;
		this.args = args;
		this.caller = caller;
		setOwner(this, owner);
	}
	/**
	* The default HTML id attribute. We don't really _need_ one, this is just
	* added for compatibility as it's hard to tell if people rely on it being
	* present, and it doens't really hurt.
	*
	* However, don't rely on this internally, like passing it to `getElementId`.
	* This can be (and often is) overriden by passing an `id` attribute on the
	* invocation, which shadows this default id via `...attributes`.
	*/
	get id() {
		return guidFor(this);
	}
	/**
	* The default HTML class attribute. Similar to the above, we don't _need_
	* them, they are just added for compatibility as it's similarly hard to tell
	* if people rely on it in their CSS etc, and it doens't really hurt.
	*/
	get class() {
		return "ember-view";
	}
	validateArguments() {
		for (let name of Object.keys(this.args.named)) if (!this.isSupportedArgument(name)) this.onUnsupportedArgument(name);
	}
	named(name) {
		let ref = this.args.named[name];
		return ref ? valueForRef(ref) : void 0;
	}
	positional(index) {
		let ref = this.args.positional[index];
		return ref ? valueForRef(ref) : void 0;
	}
	listenerFor(name) {
		let listener = this.named(name);
		if (listener) return listener;
		else return NOOP;
	}
	isSupportedArgument(_name) {
		return false;
	}
	onUnsupportedArgument(_name) {}
	toString() {
		return `<${this.constructor}:${guidFor(this)}>`;
	}
};
var OPAQUE_CONSTRUCTOR_MAP = /* @__PURE__ */ new WeakMap();
function opaquify(constructor, template) {
	let opaque = {
		create() {
			throw assert("Use constructor instead of create");
		},
		toString() {
			return constructor.toString();
		}
	};
	OPAQUE_CONSTRUCTOR_MAP.set(opaque, constructor);
	setInternalComponentManager(INTERNAL_COMPONENT_MANAGER, opaque);
	setComponentTemplate(template, opaque);
	return opaque;
}
function deopaquify(opaque) {
	return OPAQUE_CONSTRUCTOR_MAP.get(opaque);
}
var CAPABILITIES = {
	dynamicLayout: false,
	dynamicTag: false,
	prepareArgs: false,
	createArgs: true,
	attributeHook: false,
	elementHook: false,
	createCaller: true,
	dynamicScope: false,
	updateHook: false,
	createInstance: true,
	wrapped: false,
	willDestroy: false,
	hasSubOwner: false
};
var InternalManager = class {
	getCapabilities() {
		return CAPABILITIES;
	}
	create(owner, definition, args, _env, _dynamicScope, caller) {
		let instance = new (deopaquify(definition))(owner, args.capture(), valueForRef(caller));
		untrack(instance["validateArguments"].bind(instance));
		return instance;
	}
	didCreate() {}
	didUpdate() {}
	didRenderLayout() {}
	didUpdateLayout() {}
	getDebugName(definition) {
		return definition.toString();
	}
	getSelf(instance) {
		return createConstRef(instance);
	}
	getDestroyable(instance) {
		return instance;
	}
};
var INTERNAL_COMPONENT_MANAGER = new InternalManager();
//#endregion
export { setViewElement as _, clearViewElement as a, getElementView as c, getViewBounds as d, getViewClientRects as f, setElementView as g, isSimpleClick as h, clearElementView as i, getRootViews as l, getViewId as m, opaquify as n, constructStyleDeprecationMessage as o, getViewElement as p, addChildView as r, getChildViews as s, InternalComponent as t, getViewBoundingClientRect as u };
