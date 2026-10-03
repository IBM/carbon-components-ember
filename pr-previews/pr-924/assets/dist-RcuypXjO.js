import { i as destroy } from "./destroyable-BW6N5j2P.js";
import { i as setOwner } from "./application-DHX-EgR7.js";
import { i as modifierCapabilities } from "./api-B_poQGXS-T6hxwnfy.js";
import { t as setModifierManager } from "./modifier-Dw68-clr.js";
//#region ../node_modules/.pnpm/ember-modifier@4.3.0_@babel+core@7.29.7_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-modifier/dist/index.js
/**
* The state bucket used throughout the life-cycle of the modifier. Basically a
* state *machine*, where the framework calls us with the version we hand back
* to it at each phase. The two states are the two `extends` versions of this
* below.
*
* @internal
*/
/**
* The `State` after calling `createModifier`, and therefore the state available
* at the start of `InstallModifier`.
* @internal
*/
/**
* The `State` after calling `installModifier`, and therefore the state
* available in all `updateModifier` calls and in `destroyModifier`.
* @internal
*/
function installElement$1(state, element) {
	const installedState = state;
	installedState.element = element;
	return installedState;
}
var ClassBasedModifierManager = class {
	capabilities = modifierCapabilities("3.22");
	constructor(owner) {
		this.owner = owner;
	}
	createModifier(modifierClass, args) {
		return {
			instance: new modifierClass(this.owner, args),
			element: null
		};
	}
	installModifier(createdState, element, args) {
		installElement$1(createdState, element).instance.modify(element, args.positional, args.named);
	}
	updateModifier(state, args) {
		state.instance.modify(state.element, args.positional, args.named);
	}
	destroyModifier({ instance }) {
		destroy(instance);
	}
};
/**
* A base class for modifiers which need more capabilities than function-based
* modifiers. Useful if, for example:
*
* 1. You need to inject services and access them
* 2. You need fine-grained control of updates, either for performance or
*    convenience reasons, and don't want to teardown the state of your modifier
*    every time only to set it up again.
* 3. You need to store some local state within your modifier.
*
* The lifecycle hooks of class modifiers are tracked. When they run, they any
* values they access will be added to the modifier, and the modifier will
* update if any of those values change.
*/
var ClassBasedModifier = class {
	/**
	*
	* @param owner An instance of an Owner (for service injection etc.).
	* @param args The positional and named arguments passed to the modifier.
	*/
	constructor(owner, args) {
		setOwner(this, owner);
	}
	/**
	* Called when the modifier is installed and any time any tracked state used
	* in the modifier changes.
	*
	* If you need to do first-time-only setup, create a class field representing
	* the initialization state and check it when running the hook. That is also
	* where and when you should use `registerDestructor` for any teardown you
	* need to do. For example:
	*
	* ```js
	* function disconnect(instance) {
	*  instance.observer?.disconnect();
	* }
	*
	* class IntersectionObserver extends Modifier {
	*   observer;
	*
	*   constructor(owner, args) {
	*     super(owner, args);
	*     registerDestructor(this, disconnect);
	*   }
	*
	*   modify(element, callback, options) {
	*     disconnect(this);
	*
	*     this.observer = new IntersectionObserver(callback, options);
	*     this.observer.observe(element);
	*   }
	* }
	* ```
	*
	* @param element The element to which the modifier is applied.
	* @param positional The positional arguments to the modifier.
	* @param named The named arguments to the modifier.
	*/
	modify(element, positional, named) {}
};
setModifierManager((owner) => new ClassBasedModifierManager(owner), ClassBasedModifier);
function installElement(state, element) {
	const installedState = state;
	installedState.element = element;
	return installedState;
}
var FunctionBasedModifierManager = class {
	capabilities = modifierCapabilities("3.22");
	createModifier(instance) {
		return {
			element: null,
			instance
		};
	}
	installModifier(createdState, element, args) {
		const state = installElement(createdState, element);
		const { positional, named } = args;
		const teardown = createdState.instance(element, positional, named);
		if (typeof teardown === "function") state.teardown = teardown;
	}
	updateModifier(state, args) {
		if (typeof state.teardown === "function") state.teardown();
		const teardown = state.instance(state.element, args.positional, args.named);
		if (typeof teardown === "function") state.teardown = teardown;
	}
	destroyModifier(state) {
		if (typeof state.teardown === "function") state.teardown();
	}
	getDebugName(state) {
		return state.instance.toString();
	}
	getDebugInstance(state) {
		return state;
	}
};
var MANAGER = new FunctionBasedModifierManager();
/**
* The (optional) return type for a modifier which needs to perform some kind of
* cleanup or teardown -- for example, removing an event listener from an
* element besides the one passed into the modifier.
*/
/**
* An API for writing simple modifiers.
*
* This function runs the first time when the element the modifier was applied
* to is inserted into the DOM, and it *autotracks* while running. Any values
* that it accesses will be tracked, including any of its arguments that it
* accesses, and if any of them changes, the function will run again.
*
* **Note:** this will *not* automatically rerun because an argument changes. It
* will only rerun if it is *using* that argument (the same as with auto-tracked
* state in general).
*
* The modifier can also optionally return a *destructor*. The destructor
* function will be run just before the next update, and when the element is
* being removed entirely. It should generally clean up the changes that the
* modifier made in the first place.
*
* @param fn The function which defines the modifier.
*/
/**
* An API for writing simple modifiers.
*
* This function runs the first time when the element the modifier was applied
* to is inserted into the DOM, and it *autotracks* while running. Any values
* that it accesses will be tracked, including any of its arguments that it
* accesses, and if any of them changes, the function will run again.
*
* **Note:** this will *not* automatically rerun because an argument changes. It
* will only rerun if it is *using* that argument (the same as with auto-tracked
* state in general).
*
* The modifier can also optionally return a *destructor*. The destructor
* function will be run just before the next update, and when the element is
* being removed entirely. It should generally clean up the changes that the
* modifier made in the first place.
*
* @param fn The function which defines the modifier.
*/
function modifier(fn, options) {
	fn.toString = () => options?.name || fn.name;
	return setModifierManager(() => MANAGER, fn);
}
//#endregion
export { modifier as n, ClassBasedModifier as t };
