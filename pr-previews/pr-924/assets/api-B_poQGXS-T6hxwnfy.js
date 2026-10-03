import { l as registerDestructor } from "./destroyable-BW6N5j2P.js";
import { b as createUpdatableTag, k as untrack } from "./cache-CofLhaS4-CWmaBWeq.js";
import { f as createConstRef, t as argsProxyFor } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { t as buildCapabilities } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
import { d as setInternalComponentManager, f as setInternalHelperManager, p as setInternalModifierManager, t as CustomHelperManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { t as castToBrowser } from "./simple-cast-DCvJLSin-HQ2D6hQ-.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/api-B_poQGXS.js
var CAPABILITIES = {
	dynamicLayout: false,
	dynamicTag: false,
	prepareArgs: false,
	createArgs: true,
	attributeHook: false,
	elementHook: false,
	createCaller: false,
	dynamicScope: true,
	updateHook: true,
	createInstance: true,
	wrapped: false,
	willDestroy: false,
	hasSubOwner: false
};
function componentCapabilities(managerAPI, options = {}) {
	let updateHook = Boolean(options.updateHook);
	return buildCapabilities({
		asyncLifeCycleCallbacks: Boolean(options.asyncLifecycleCallbacks),
		destructor: Boolean(options.destructor),
		updateHook
	});
}
function hasAsyncLifeCycleCallbacks(delegate) {
	return delegate.capabilities.asyncLifeCycleCallbacks;
}
function hasUpdateHook(delegate) {
	return delegate.capabilities.updateHook;
}
function hasAsyncUpdateHook(delegate) {
	return hasAsyncLifeCycleCallbacks(delegate) && hasUpdateHook(delegate);
}
function hasDestructors(delegate) {
	return delegate.capabilities.destructor;
}
/**
The CustomComponentManager allows addons to provide custom component
implementations that integrate seamlessly into Ember. This is accomplished
through a delegate, registered with the custom component manager, which
implements a set of hooks that determine component behavior.

To create a custom component manager, instantiate a new CustomComponentManager
class and pass the delegate as the first argument:

```js
let manager = new CustomComponentManager({
// ...delegate implementation...
});
```

## Delegate Hooks

Throughout the lifecycle of a component, the component manager will invoke
delegate hooks that are responsible for surfacing those lifecycle changes to
the end developer.

* `create()` - invoked when a new instance of a component should be created
* `update()` - invoked when the arguments passed to a component change
* `getContext()` - returns the object that should be
*/
var CustomComponentManager = class {
	componentManagerDelegates = /* @__PURE__ */ new WeakMap();
	constructor(factory) {
		this.factory = factory;
	}
	getDelegateFor(owner) {
		let { componentManagerDelegates } = this;
		let delegate = componentManagerDelegates.get(owner);
		if (delegate === void 0) {
			let { factory } = this;
			delegate = factory(owner);
			componentManagerDelegates.set(owner, delegate);
		}
		return delegate;
	}
	create(owner, definition, vmArgs) {
		let delegate = this.getDelegateFor(owner);
		let args = argsProxyFor(vmArgs.capture());
		return new CustomComponentState(delegate.createComponent(definition, args), delegate, args);
	}
	getDebugName(definition) {
		return typeof definition === "function" ? definition.name : definition.toString();
	}
	update(bucket) {
		let { delegate } = bucket;
		if (hasUpdateHook(delegate)) {
			let { component, args } = bucket;
			delegate.updateComponent(component, args);
		}
	}
	didCreate({ component, delegate }) {
		if (hasAsyncLifeCycleCallbacks(delegate)) delegate.didCreateComponent(component);
	}
	didUpdate({ component, delegate }) {
		if (hasAsyncUpdateHook(delegate)) delegate.didUpdateComponent(component);
	}
	didRenderLayout() {}
	didUpdateLayout() {}
	getSelf({ component, delegate }) {
		return createConstRef(delegate.getContext(component));
	}
	getDestroyable(bucket) {
		const { delegate } = bucket;
		if (hasDestructors(delegate)) {
			const { component } = bucket;
			registerDestructor(bucket, () => delegate.destroyComponent(component));
			return bucket;
		}
		return null;
	}
	getCapabilities() {
		return CAPABILITIES;
	}
};
/**
* Stores internal state about a component instance after it's been created.
*/
var CustomComponentState = class {
	constructor(component, delegate, args) {
		this.component = component;
		this.delegate = delegate;
		this.args = args;
	}
};
function modifierCapabilities(managerAPI, optionalFeatures = {}) {
	return buildCapabilities({ disableAutoTracking: Boolean(optionalFeatures.disableAutoTracking) });
}
/**
The CustomModifierManager allows addons to provide custom modifier
implementations that integrate seamlessly into Ember. This is accomplished
through a delegate, registered with the custom modifier manager, which
implements a set of hooks that determine modifier behavior.
To create a custom modifier manager, instantiate a new CustomModifierManager
class and pass the delegate as the first argument:

```js
let manager = new CustomModifierManager({
// ...delegate implementation...
});
```

## Delegate Hooks

Throughout the lifecycle of a modifier, the modifier manager will invoke
delegate hooks that are responsible for surfacing those lifecycle changes to
the end developer.
* `createModifier()` - invoked when a new instance of a modifier should be created
* `installModifier()` - invoked when the modifier is installed on the element
* `updateModifier()` - invoked when the arguments passed to a modifier change
* `destroyModifier()` - invoked when the modifier is about to be destroyed
*/
var CustomModifierManager = class {
	componentManagerDelegates = /* @__PURE__ */ new WeakMap();
	constructor(factory) {
		this.factory = factory;
	}
	getDelegateFor(owner) {
		let { componentManagerDelegates } = this;
		let delegate = componentManagerDelegates.get(owner);
		if (delegate === void 0) {
			let { factory } = this;
			delegate = factory(owner);
			componentManagerDelegates.set(owner, delegate);
		}
		return delegate;
	}
	create(owner, element, definition, capturedArgs) {
		let delegate = this.getDelegateFor(owner);
		let args = argsProxyFor(capturedArgs);
		let instance = delegate.createModifier(definition, args);
		let tag = createUpdatableTag();
		let state;
		state = {
			tag,
			element,
			delegate,
			args,
			modifier: instance
		};
		registerDestructor(state, () => delegate.destroyModifier(instance, args));
		return state;
	}
	getDebugName(definition) {
		if (typeof definition === "function") return definition.name || definition.toString();
		else return "<unknown>";
	}
	getDebugInstance({ modifier }) {
		return modifier;
	}
	getTag({ tag }) {
		return tag;
	}
	install({ element, args, modifier, delegate }) {
		let { capabilities } = delegate;
		if (capabilities.disableAutoTracking) untrack(() => delegate.installModifier(modifier, castToBrowser(element, "ELEMENT"), args));
		else delegate.installModifier(modifier, castToBrowser(element), args);
	}
	update({ args, modifier, delegate }) {
		let { capabilities } = delegate;
		if (capabilities.disableAutoTracking) untrack(() => delegate.updateModifier(modifier, args));
		else delegate.updateModifier(modifier, args);
	}
	getDestroyable(state) {
		return state;
	}
};
function setComponentManager(factory, obj) {
	return setInternalComponentManager(new CustomComponentManager(factory), obj);
}
function setModifierManager(factory, obj) {
	return setInternalModifierManager(new CustomModifierManager(factory), obj);
}
function setHelperManager(factory, obj) {
	return setInternalHelperManager(new CustomHelperManager(factory), obj);
}
//#endregion
export { setComponentManager as a, modifierCapabilities as i, CustomModifierManager as n, setHelperManager as o, componentCapabilities as r, setModifierManager as s, CustomComponentManager as t };
