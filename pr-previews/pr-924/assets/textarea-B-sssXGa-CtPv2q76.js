import { r as setOwner, t as getOwner } from "./owner-Bxxa-eff.js";
import { S as guidFor, U as get } from "./core-D-L0f59Y.js";
import { i as hasDOM, t as CURLY_MANAGER_BRAND } from "./curly-brand-B_F79Dep-Cbz0KMC_.js";
import { l as registerDestructor } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, S as endUntrackFrame, _ as consumeTag, j as valueForTag, m as beginUntrackFrame, p as beginTrackFrame, x as endTrackFrame } from "./cache-CofLhaS4-CWmaBWeq.js";
import { S as valueForRef, b as isUpdatableRef, d as createComputeRef, f as createConstRef, h as createPrimitiveRef, l as childRefFor, u as childRefFromParts, v as isConstRef, x as updateRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { n as dasherize } from "./string-BUAsQ27l.js";
import { n as action } from "./object-X4rDdm09.js";
import { _ as setViewElement, a as clearViewElement, g as setElementView, i as clearElementView, n as opaquify, p as getViewElement, r as addChildView, t as InternalComponent } from "./internal-BQ7zHrqS-DuEQEItY.js";
import { n as decorateMethodV2, r as initializeDeferredDecorator, t as decorateFieldV2 } from "./runtime-CYyqkz5q-BOdRhmsS-CexCIt7z.js";
import { o as EMPTY_ARRAY } from "./object-utils-AijlD-JH-xdA72BiZ.js";
import { b as reifyPositional } from "./arguments-Carzx7C4-snfB_1Hj.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { t as _instrumentStart } from "./instrumentation-l8O8qirj.js";
import { t as on } from "./on-CkzM3EZT.js";
import { n as tracked } from "./tracked-DvOpYI0o-BARN4wIl.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/views/lib/compat/attrs.js
var MUTABLE_CELL = Symbol("MUTABLE_CELL");
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/curly-xbTtts9R.js
/**
* @deprecated
*/
function unwrapTemplate(template) {
	if (template.result === "error") throw new Error(`Compile Error: ${template.problem} @ ${template.span.start}..${template.span.end}`);
	return template;
}
function isTemplateFactory(template) {
	return typeof template === "function";
}
function referenceForParts(rootRef, parts) {
	if (parts[0] === "attrs") {
		parts.shift();
		if (parts.length === 1) return childRefFor(rootRef, parts[0]);
	}
	return childRefFromParts(rootRef, parts);
}
function parseAttributeBinding(microsyntax) {
	let colonIndex = microsyntax.indexOf(":");
	if (colonIndex === -1) return [
		microsyntax,
		microsyntax,
		true
	];
	else return [
		microsyntax.substring(0, colonIndex),
		microsyntax.substring(colonIndex + 1),
		false
	];
}
function installAttributeBinding(component, rootRef, parsed, operations) {
	let [prop, attribute, isSimple] = parsed;
	if (attribute === "id") {
		let elementId = get(component, prop);
		if (elementId === void 0 || elementId === null) elementId = component.elementId;
		let elementIdRef = createPrimitiveRef(elementId);
		operations.setAttribute("id", elementIdRef, true, null);
		return;
	}
	let reference = prop.indexOf(".") > -1 ? referenceForParts(rootRef, prop.split(".")) : childRefFor(rootRef, prop);
	operations.setAttribute(attribute, reference, false, null);
}
function createClassNameBindingRef(rootRef, microsyntax, operations) {
	let [prop, truthy, falsy] = microsyntax.split(":");
	if (prop === "") operations.setAttribute("class", createPrimitiveRef(truthy), true, null);
	else {
		let isPath = prop.indexOf(".") > -1;
		let parts = isPath ? prop.split(".") : [];
		let value = isPath ? referenceForParts(rootRef, parts) : childRefFor(rootRef, prop);
		let ref;
		if (truthy === void 0) ref = createSimpleClassNameBindingRef(value, isPath ? parts[parts.length - 1] : prop);
		else ref = createColonClassNameBindingRef(value, truthy, falsy);
		operations.setAttribute("class", ref, false, null);
	}
}
function createSimpleClassNameBindingRef(inner, path) {
	let dasherizedPath;
	return createComputeRef(() => {
		let value = valueForRef(inner);
		if (value === true) return dasherizedPath || (dasherizedPath = dasherize(path));
		else if (value || value === 0) return String(value);
		else return null;
	});
}
function createColonClassNameBindingRef(inner, truthy, falsy) {
	return createComputeRef(() => {
		return valueForRef(inner) ? truthy : falsy;
	});
}
function NOOP() {}
/**
@module ember
*/
/**
Represents the internal state of the component.

@class ComponentStateBucket
@private
*/
var ComponentStateBucket = class {
	classRef = null;
	rootRef;
	argsRevision;
	constructor(component, args, argsTag, finalizer, hasWrappedElement, isInteractive) {
		this.component = component;
		this.args = args;
		this.argsTag = argsTag;
		this.finalizer = finalizer;
		this.hasWrappedElement = hasWrappedElement;
		this.isInteractive = isInteractive;
		this.classRef = null;
		this.argsRevision = args === null ? 0 : valueForTag(argsTag);
		this.rootRef = createConstRef(component);
		registerDestructor(this, () => this.willDestroy(), true);
		registerDestructor(this, () => this.component.destroy());
	}
	willDestroy() {
		let { component, isInteractive } = this;
		if (isInteractive) {
			beginUntrackFrame();
			component.trigger("willDestroyElement");
			component.trigger("willClearRender");
			endUntrackFrame();
			let element = getViewElement(component);
			if (element) {
				clearElementView(element);
				clearViewElement(component);
			}
		}
		component.renderer.unregister(component);
	}
	finalize() {
		let { finalizer } = this;
		finalizer();
		this.finalizer = NOOP;
	}
};
function processComponentArgs(namedArgs) {
	let attrs = Object.create(null);
	let props = Object.create(null);
	for (let name in namedArgs) {
		let ref = namedArgs[name];
		let value = valueForRef(ref);
		if (isUpdatableRef(ref)) attrs[name] = new MutableCell(ref, value);
		else attrs[name] = value;
		props[name] = value;
	}
	props.attrs = attrs;
	return props;
}
var REF = Symbol("REF");
var MutableCell = class {
	value;
	[MUTABLE_CELL];
	[REF];
	constructor(ref, value) {
		this[MUTABLE_CELL] = true;
		this[REF] = ref;
		this.value = value;
	}
	update(val) {
		updateRef(this[REF], val);
	}
};
var COMPONENT_ARGS_MAP = /* @__PURE__ */ new WeakMap();
function getComponentCapturedArgs(component) {
	return COMPONENT_ARGS_MAP.get(component);
}
var DIRTY_TAG = Symbol("DIRTY_TAG");
var IS_DISPATCHING_ATTRS = Symbol("IS_DISPATCHING_ATTRS");
var BOUNDS = Symbol("BOUNDS");
var EMBER_VIEW_REF = createPrimitiveRef("ember-view");
function aliasIdToElementId(args, props) {
	if (args.named.has("id")) props.elementId = props.id;
}
function applyAttributeBindings(attributeBindings, component, rootRef, operations) {
	let seen = [];
	let i = attributeBindings.length - 1;
	while (i !== -1) {
		let binding = attributeBindings[i];
		let parsed = parseAttributeBinding(binding);
		let attribute = parsed[1];
		if (seen.indexOf(attribute) === -1) {
			seen.push(attribute);
			installAttributeBinding(component, rootRef, parsed, operations);
		}
		i--;
	}
	if (seen.indexOf("id") === -1) {
		let id = component.elementId ? component.elementId : guidFor(component);
		operations.setAttribute("id", createPrimitiveRef(id), false, null);
	}
}
var CurlyComponentManager = class {
	[CURLY_MANAGER_BRAND] = true;
	templateFor(component) {
		let { layout, layoutName } = component;
		let owner = getOwner(component);
		let factory;
		if (layout === void 0) {
			if (layoutName !== void 0) factory = owner.lookup(`template:${layoutName}`);
			else return null;
		} else if (isTemplateFactory(layout)) factory = layout;
		else return null;
		return unwrapTemplate(factory(owner)).asWrappedLayout();
	}
	getDynamicLayout(bucket) {
		return this.templateFor(bucket.component);
	}
	getTagName(state) {
		let { component, hasWrappedElement } = state;
		if (!hasWrappedElement) return null;
		return component && component.tagName || "div";
	}
	getCapabilities() {
		return CURLY_CAPABILITIES;
	}
	prepareArgs(ComponentClass, args) {
		if (args.named.has("__ARGS__")) {
			let { __ARGS__, ...rest } = args.named.capture();
			let __args__ = valueForRef(__ARGS__);
			return {
				positional: __args__.positional,
				named: {
					...rest,
					...__args__.named
				}
			};
		}
		const { positionalParams } = ComponentClass.class ?? ComponentClass;
		if (positionalParams === void 0 || positionalParams === null || args.positional.length === 0) return null;
		let named;
		if (typeof positionalParams === "string") {
			let captured = args.positional.capture();
			named = { [positionalParams]: createComputeRef(() => reifyPositional(captured)) };
			Object.assign(named, args.named.capture());
		} else if (Array.isArray(positionalParams) && positionalParams.length > 0) {
			const count = Math.min(positionalParams.length, args.positional.length);
			named = {};
			Object.assign(named, args.named.capture());
			for (let i = 0; i < count; i++) {
				let name = positionalParams[i];
				named[name] = args.positional.at(i);
			}
		} else return null;
		return {
			positional: EMPTY_ARRAY,
			named
		};
	}
	create(owner, ComponentClass, args, { isInteractive }, dynamicScope, callerSelfRef) {
		let parentView = dynamicScope.view;
		let capturedArgs = args.named.capture();
		beginTrackFrame();
		let props = processComponentArgs(capturedArgs);
		let argsTag = endTrackFrame();
		aliasIdToElementId(args, props);
		props.parentView = parentView;
		props._target = valueForRef(callerSelfRef);
		setOwner(props, owner);
		beginUntrackFrame();
		let component = ComponentClass.create(props);
		COMPONENT_ARGS_MAP.set(component, capturedArgs);
		let finalizer = _instrumentStart("render.component", initialRenderInstrumentDetails, component);
		dynamicScope.view = component;
		if (parentView !== null && parentView !== void 0) addChildView(parentView, component);
		component.trigger("didReceiveAttrs");
		let hasWrappedElement = component.tagName !== "";
		if (!hasWrappedElement) {
			if (isInteractive) component.trigger("willRender");
			component._transitionTo("hasElement");
			if (isInteractive) component.trigger("willInsertElement");
		}
		let bucket = new ComponentStateBucket(component, capturedArgs, argsTag, finalizer, hasWrappedElement, isInteractive);
		if (args.named.has("class")) bucket.classRef = args.named.get("class");
		if (isInteractive && hasWrappedElement) component.trigger("willRender");
		endUntrackFrame();
		consumeTag(bucket.argsTag);
		consumeTag(component[DIRTY_TAG]);
		return bucket;
	}
	getDebugName(definition) {
		return definition.fullName || definition.normalizedName || definition.class?.name || definition.name;
	}
	getSelf({ rootRef }) {
		return rootRef;
	}
	didCreateElement({ component, classRef, isInteractive, rootRef }, element, operations) {
		setViewElement(component, element);
		setElementView(element, component);
		let { attributeBindings, classNames, classNameBindings } = component;
		if (attributeBindings && attributeBindings.length) applyAttributeBindings(attributeBindings, component, rootRef, operations);
		else {
			let id = component.elementId ? component.elementId : guidFor(component);
			operations.setAttribute("id", createPrimitiveRef(id), false, null);
		}
		if (classRef) {
			const ref = createSimpleClassNameBindingRef(classRef);
			operations.setAttribute("class", ref, false, null);
		}
		if (classNames && classNames.length) classNames.forEach((name) => {
			operations.setAttribute("class", createPrimitiveRef(name), false, null);
		});
		if (classNameBindings && classNameBindings.length) classNameBindings.forEach((binding) => {
			createClassNameBindingRef(rootRef, binding, operations);
		});
		operations.setAttribute("class", EMBER_VIEW_REF, false, null);
		if ("ariaRole" in component) operations.setAttribute("role", childRefFor(rootRef, "ariaRole"), false, null);
		component._transitionTo("hasElement");
		if (isInteractive) {
			beginUntrackFrame();
			component.trigger("willInsertElement");
			endUntrackFrame();
		}
	}
	didRenderLayout(bucket, bounds) {
		bucket.component[BOUNDS] = bounds;
		bucket.finalize();
	}
	didCreate({ component, isInteractive }) {
		if (isInteractive) {
			component._transitionTo("inDOM");
			component.trigger("didInsertElement");
			component.trigger("didRender");
		}
	}
	update(bucket) {
		let { component, args, argsTag, argsRevision, isInteractive } = bucket;
		bucket.finalizer = _instrumentStart("render.component", rerenderInstrumentDetails, component);
		beginUntrackFrame();
		if (args !== null && !validateTag(argsTag, argsRevision)) {
			beginTrackFrame();
			let props = processComponentArgs(args);
			argsTag = bucket.argsTag = endTrackFrame();
			bucket.argsRevision = valueForTag(argsTag);
			component[IS_DISPATCHING_ATTRS] = true;
			component.setProperties(props);
			component[IS_DISPATCHING_ATTRS] = false;
			component.trigger("didUpdateAttrs");
			component.trigger("didReceiveAttrs");
		}
		if (isInteractive) {
			component.trigger("willUpdate");
			component.trigger("willRender");
		}
		endUntrackFrame();
		consumeTag(argsTag);
		consumeTag(component[DIRTY_TAG]);
	}
	didUpdateLayout(bucket) {
		bucket.finalize();
	}
	didUpdate({ component, isInteractive }) {
		if (isInteractive) {
			component.trigger("didUpdate");
			component.trigger("didRender");
		}
	}
	getDestroyable(bucket) {
		return bucket;
	}
};
function initialRenderInstrumentDetails(component) {
	return component.instrumentDetails({ initialRender: true });
}
function rerenderInstrumentDetails(component) {
	return component.instrumentDetails({ initialRender: false });
}
var CURLY_CAPABILITIES = {
	dynamicLayout: true,
	dynamicTag: true,
	prepareArgs: true,
	createArgs: true,
	attributeHook: true,
	elementHook: true,
	createCaller: true,
	dynamicScope: true,
	updateHook: true,
	createInstance: true,
	wrapped: true,
	willDestroy: true,
	hasSubOwner: false
};
var CURLY_COMPONENT_MANAGER = /*@__PURE__*/ new CurlyComponentManager();
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/textarea-B-sssXGa.js
var InputTemplate = templateFactory({
	"id": null,
	"block": "[[[11,\"input\"],[16,1,[30,0,[\"id\"]]],[16,0,[30,0,[\"class\"]]],[17,1],[16,4,[30,0,[\"type\"]]],[16,\"checked\",[30,0,[\"checked\"]]],[16,2,[30,0,[\"value\"]]],[4,[32,0],[\"change\",[30,0,[\"change\"]]],null],[4,[32,0],[\"input\",[30,0,[\"input\"]]],null],[4,[32,0],[\"keyup\",[30,0,[\"keyUp\"]]],null],[4,[32,0],[\"paste\",[30,0,[\"valueDidChange\"]]],null],[4,[32,0],[\"cut\",[30,0,[\"valueDidChange\"]]],null],[12],[13]],[\"&attrs\"],[]]",
	"moduleName": "packages/@ember/-internals/glimmer/lib/templates/input.hbs",
	"scope": () => ({ on }),
	"isStrictMode": true
});
var UNINITIALIZED = Object.freeze({});
function elementForEvent(event) {
	return event.target;
}
function valueForEvent(event) {
	return elementForEvent(event).value;
}
function devirtualize(callback) {
	return (event) => callback(valueForEvent(event), event);
}
function valueFrom(reference) {
	if (reference === void 0) return new LocalValue(void 0);
	else if (isConstRef(reference)) return new LocalValue(valueForRef(reference));
	else if (isUpdatableRef(reference)) return new UpstreamValue(reference);
	else return new ForkedValue(reference);
}
var LocalValue = class {
	static {
		decorateFieldV2(this.prototype, "value", [tracked]);
	}
	#value = (initializeDeferredDecorator(this, "value"), void 0);
	constructor(value) {
		this.value = value;
	}
	get() {
		return this.value;
	}
	set(value) {
		this.value = value;
	}
};
var UpstreamValue = class {
	constructor(reference) {
		this.reference = reference;
	}
	get() {
		return valueForRef(this.reference);
	}
	set(value) {
		updateRef(this.reference, value);
	}
};
var ForkedValue = class {
	local;
	upstream;
	lastUpstreamValue = UNINITIALIZED;
	constructor(reference) {
		this.upstream = new UpstreamValue(reference);
	}
	get() {
		let upstreamValue = this.upstream.get();
		if (upstreamValue !== this.lastUpstreamValue) {
			this.lastUpstreamValue = upstreamValue;
			this.local = new LocalValue(upstreamValue);
		}
		return this.local.get();
	}
	set(value) {
		this.local.set(value);
	}
};
var AbstractInput = class extends InternalComponent {
	validateArguments() {
		super.validateArguments();
	}
	_value = valueFrom(this.args.named["value"]);
	get value() {
		return this._value.get();
	}
	set value(value) {
		this._value.set(value);
	}
	valueDidChange(event) {
		this.value = valueForEvent(event);
	}
	/**
	* The `change` and `input` actions need to be overridden in the `Input`
	* subclass. Unfortunately, some ember-source builds currently uses babel
	* loose mode to transpile its classes. Having the `@action` decorator on the
	* super class creates a getter on the prototype, and when the subclass
	* overrides the method, the loose mode transpilation would emit something
	* like `Subclass.prototype['change'] = function change() { ... }`, which
	* fails because `prototype['change']` is getter-only/readonly. The correct
	* solution is to use `Object.defineProperty(prototype, 'change', ...)` but
	* that requires disabling loose mode. For now, the workaround is to add the
	* decorator only on the subclass. This is more of a configuration issue on
	* our own builds and doesn't really affect apps.
	*/
	static {
		decorateMethodV2(this.prototype, "valueDidChange", [action]);
	}
	change(event) {
		this.valueDidChange(event);
	}
	input(event) {
		this.valueDidChange(event);
	}
	keyUp(event) {
		switch (event.key) {
			case "Enter":
				this.listenerFor("enter")(event);
				this.listenerFor("insert-newline")(event);
				break;
			case "Escape": this.listenerFor("escape-press")(event);
		}
	}
	static {
		decorateMethodV2(this.prototype, "keyUp", [action]);
	}
	listenerFor(name) {
		let listener = super.listenerFor(name);
		if (this.isVirtualEventListener(name, listener)) return devirtualize(listener);
		else return listener;
	}
	isVirtualEventListener(name, _listener) {
		return [
			"enter",
			"insert-newline",
			"escape-press"
		].indexOf(name) !== -1;
	}
};
/**
@module @ember/component
*/
var isValidInputType;
if (hasDOM) {
	const INPUT_TYPES = Object.create(null);
	const INPUT_ELEMENT = document.createElement("input");
	INPUT_TYPES[""] = false;
	INPUT_TYPES["text"] = true;
	INPUT_TYPES["checkbox"] = true;
	isValidInputType = (type) => {
		let isValid = INPUT_TYPES[type];
		if (isValid === void 0) {
			try {
				INPUT_ELEMENT.type = type;
				isValid = INPUT_ELEMENT.type === type;
			} catch (_e) {
				isValid = false;
			} finally {
				INPUT_ELEMENT.type = "text";
			}
			INPUT_TYPES[type] = isValid;
		}
		return isValid;
	};
} else isValidInputType = (type) => type !== "";
/**
The `Input` component lets you create an HTML `<input>` element.

```gjs
import { Input } from '@ember/component';

<template>
<Input @value="987" />
</template>
```

creates an `<input>` element with `type="text"` and value set to 987.

### Text field

If no `type` argument is specified, a default of type 'text' is used.

```handlebars
Search:
<Input @value={{this.searchWord}} />
```

In this example, the initial value in the `<input>` will be set to the value of
`this.searchWord`. If the user changes the text, the value of `this.searchWord` will also be
updated.

### Actions

The `Input` component takes a number of arguments with callbacks that are invoked in response to
user events.

* `enter`
* `insert-newline`
* `escape-press`
* `focus-in`
* `focus-out`
* `key-down`
* `key-press`
* `key-up`

These callbacks are passed to `Input` like this:

```handlebars
<Input @value={{this.searchWord}} @enter={{this.query}} />
```

Starting with Ember Octane, we recommend using the `{{on}}` modifier to call actions
on specific events, such as the input event.

```handlebars
<label for="input-name">Name:</label>
<Input
@id="input-name"
@value={{this.name}}
{{on "input" this.validateName}}
/>
```

The event name (e.g. `focusout`, `input`, `keydown`) always follows the casing
that the HTML standard uses.

### `<input>` HTML Attributes to Avoid

In most cases, if you want to pass an attribute to the underlying HTML `<input>` element, you
can pass the attribute directly, just like any other Ember component.

```handlebars
<Input @type="text" size="10" />
```

In this example, the `size` attribute will be applied to the underlying `<input>` element in the
outputted HTML.

However, there are a few attributes where you **must** use the `@` version.

* `@type`: This argument is used to control which Ember component is used under the hood
* `@value`: The `@value` argument installs a two-way binding onto the element. If you wanted a
one-way binding, use `<input>` with the `value` property and the `input` event instead.
* `@checked` (for checkboxes): like `@value`, the `@checked` argument installs a two-way binding
onto the element. If you wanted a one-way binding, use `<input type="checkbox">` with
`checked` and the `input` event instead.

### Checkbox

To create an `<input type="checkbox">`:

```handlebars
Emberize Everything:
<Input @type="checkbox" @checked={{this.isEmberized}} name="isEmberized" />
```

This will bind the checked state of this checkbox to the value of `isEmberized` -- if either one
changes, it will be reflected in the other.

@method Input
@for @ember/component
@static
@param {Hash} options
@public
*/
var _Input = class extends AbstractInput {
	static toString() {
		return "Input";
	}
	/**
	* The HTML class attribute.
	*/
	get class() {
		if (this.isCheckbox) return "ember-checkbox ember-view";
		else return "ember-text-field ember-view";
	}
	/**
	* The HTML type attribute.
	*/
	get type() {
		let type = this.named("type");
		if (type === null || type === void 0) return "text";
		return isValidInputType(type) ? type : "text";
	}
	get isCheckbox() {
		return this.named("type") === "checkbox";
	}
	_checked = valueFrom(this.args.named["checked"]);
	get checked() {
		if (this.isCheckbox) return this._checked.get();
		else return;
	}
	set checked(checked) {
		this._checked.set(checked);
	}
	change(event) {
		if (this.isCheckbox) this.checkedDidChange(event);
		else super.change(event);
	}
	static {
		decorateMethodV2(this.prototype, "change", [action]);
	}
	input(event) {
		if (!this.isCheckbox) super.input(event);
	}
	static {
		decorateMethodV2(this.prototype, "input", [action]);
	}
	checkedDidChange(event) {
		let element = event.target;
		this.checked = element.checked;
	}
	static {
		decorateMethodV2(this.prototype, "checkedDidChange", [action]);
	}
	isSupportedArgument(name) {
		return [
			"type",
			"value",
			"checked",
			"enter",
			"insert-newline",
			"escape-press"
		].indexOf(name) !== -1 || super.isSupportedArgument(name);
	}
};
var Input = opaquify(_Input, InputTemplate);
var TextareaTemplate = templateFactory({
	"id": null,
	"block": "[[[11,\"textarea\"],[16,1,[30,0,[\"id\"]]],[16,0,[30,0,[\"class\"]]],[17,1],[16,2,[30,0,[\"value\"]]],[4,[32,0],[\"change\",[30,0,[\"change\"]]],null],[4,[32,0],[\"input\",[30,0,[\"input\"]]],null],[4,[32,0],[\"keyup\",[30,0,[\"keyUp\"]]],null],[4,[32,0],[\"paste\",[30,0,[\"valueDidChange\"]]],null],[4,[32,0],[\"cut\",[30,0,[\"valueDidChange\"]]],null],[12],[13]],[\"&attrs\"],[]]",
	"moduleName": "packages/@ember/-internals/glimmer/lib/templates/textarea.hbs",
	"scope": () => ({ on }),
	"isStrictMode": true
});
/**
@module @ember/component
*/
var _Textarea = class extends AbstractInput {
	static toString() {
		return "Textarea";
	}
	get class() {
		return "ember-text-area ember-view";
	}
	change(event) {
		super.change(event);
	}
	static {
		decorateMethodV2(this.prototype, "change", [action]);
	}
	input(event) {
		super.input(event);
	}
	static {
		decorateMethodV2(this.prototype, "input", [action]);
	}
	isSupportedArgument(name) {
		return [
			"type",
			"value",
			"enter",
			"insert-newline",
			"escape-press"
		].indexOf(name) !== -1 || super.isSupportedArgument(name);
	}
};
var Textarea = opaquify(_Textarea, TextareaTemplate);
//#endregion
export { ComponentStateBucket as a, IS_DISPATCHING_ATTRS as c, unwrapTemplate as d, MUTABLE_CELL as f, CURLY_COMPONENT_MANAGER as i, getComponentCapturedArgs as l, Textarea as n, CurlyComponentManager as o, BOUNDS as r, DIRTY_TAG as s, Input as t, initialRenderInstrumentDetails as u };
