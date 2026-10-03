import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { n as owner_exports } from "./owner-DvxyMhs3.js";
import { A as beginPropertyChanges, B as PROXY_CONTENT, C as uuid, D as ComputedProperty, F as defineValue, H as _getProp, I as endPropertyChanges, J as makeDictionary, K as isProxy, L as expandProperties, M as computed, N as defineDecorator, O as PROPERTY_DID_CHANGE, P as defineProperty, R as isComputed, S as guidFor, U as get, V as _getPath, W as hasUnknownProperty, _ as setName, a as NAMESPACES, b as GUID_KEY, c as findNamespace, d as processAllNamespaces, f as processNamespace, g as getName, h as setUnprocessedMixins, i as Mixin, j as changeProperties, k as autoComputed, l as findNamespaces, m as setSearchDisabled, n as core_exports, o as NAMESPACES_BY_ID, p as removeNamespace, q as setProxy, s as addNamespace, u as isSearchDisabled, w as intern, x as generateGuid, y as environment_exports, z as notifyPropertyChange } from "./core-D-L0f59Y.js";
import { S as wrap, _ as ROOT, a as flushAsyncObservers, b as setListeners, f as addListener, g as sendEvent, h as removeListener, i as addObserver, l as revalidateObservers, m as on, n as SYNC_OBSERVERS, p as hasListeners, r as activateObserver, s as removeObserver, t as ASYNC_OBSERVERS, v as checkHasSuper, x as setObservers, y as observerListenerMetaFor } from "./observers-BmobpXAF-CkVUhhE-.js";
import { r as normalizeProperty } from "./curly-brand-B_F79Dep-Cbz0KMC_.js";
import { _ as runloop_exports } from "./runloop-Dk0Nzu3h.js";
import { a as peekMeta, i as meta, n as UNDEFINED, o as setMeta, r as counters, t as Meta } from "./meta-B7F2ReUu.js";
import { c as isDestroying, i as destroy, l as registerDestructor, s as isDestroyed } from "./destroyable-BW6N5j2P.js";
import { A as validateTag, C as getValue, _ as consumeTag, g as combine, j as valueForTag, v as createCache, w as isConst } from "./cache-CofLhaS4-CWmaBWeq.js";
import { n as tagFor } from "./meta-BJtIZDir-Dn71zgvo.js";
import { c as tagForObject, l as tagForProperty, o as markObjectAsDirty, s as objectAt, u as isObject } from "./chain-tags-B2J7DsxO-BnIvSRoO.js";
import { n as getCustomTagFor, r as setCustomTagFor } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { n as version_exports } from "./version-dVdMCUiN.js";
import { t as Cache } from "./cache-qDyqAcpg-C6oeU-4r.js";
import { n as Libraries, t as LIBRARIES } from "./libraries-Dx5DiBJv-CkS2MadU.js";
import { $ as rsvp, B as configure, F as all, G as hashSettled, H as denodeify, I as allSettled, J as on$1, K as map, L as asap, M as EventTarget, N as Promise$1, P as RSVP, Q as rethrow, R as async, U as filter, V as defer, W as hash, X as reject, Y as race, Z as resolve, q as off, z as cast } from "./route-CA9vvjYs.js";
import { a as onerrorDefault, i as ContainerProxyMixin, r as RegistryProxyMixin } from "./instance-VyeWfvnG.js";
import { i as lookupDescriptor, n as set, r as trySet, t as _setProp } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { a as isClassicDecorator, c as nativeDescDecorator, i as descriptorForProperty, l as setClassicDecorator, n as ComputedDescriptor, o as isElementDescriptor, r as descriptorForDecorator, s as makeComputedDecorator } from "./decorator-9ikVwsjY-DzA4qI2N.js";
import { i as deprecateUntil, n as inject, r as DEPRECATIONS, t as DEBUG_INJECTION_FUNCTIONS } from "./injected_property-DqQ0XV7k-KjJunt8I.js";
import { t as ActionHandler } from "./action_handler-nAULtqaN.js";
import { i as getProperties, n as observable_exports, r as setProperties } from "./observable-BDMGT456.js";
import { r as object_exports, t as EmberObject } from "./object-X4rDdm09.js";
import { _ as setViewElement, a as clearViewElement, c as getElementView, d as getViewBounds, f as getViewClientRects, g as setElementView, h as isSimpleClick, i as clearElementView, l as getRootViews, m as getViewId, o as constructStyleDeprecationMessage, p as getViewElement, r as addChildView, s as getChildViews, u as getViewBoundingClientRect } from "./internal-BQ7zHrqS-DuEQEItY.js";
import { d as SERIALIZATION_FIRST_NODE_STRING, f as isSerializationFirstNode, g as EventDispatcher, h as alias, m as namespace_exports, n as application_exports, p as rehydrationBuilder, u as RehydrateTree } from "./application-DHX-EgR7.js";
import { n as evented_exports } from "./evented-Cnj-zNta.js";
import { a as array_exports, c as MutableEnumerable, d as arrayContentDidChange, f as arrayContentWillChange, h as replaceInNativeArray, l as mutable_exports$1, m as replace, p as removeArrayObserver, r as MutableArray, u as addArrayObserver } from "./array-CAt176If.js";
import { n as getCachedValueFor, t as internals_exports } from "./internals-stdH4aMb.js";
import { t as FrameworkObject } from "./-internals-KZ2Tqoux.js";
import { r as controller_exports } from "./controller-eOxFZEDx.js";
import { i as managerHasCapability, n as capabilityFlagsFrom, r as hasCapability } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
import { a as hasDestroyable, c as hasInternalModifierManager, d as setInternalComponentManager, f as setInternalHelperManager, i as getInternalModifierManager, l as hasValue, n as getInternalComponentManager, o as hasInternalComponentManager, p as setInternalModifierManager, r as getInternalHelperManager, s as hasInternalHelperManager, t as CustomHelperManager, u as helperCapabilities } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { i as service_exports } from "./service-BNgWMWpo.js";
import { C as CursorImpl, S as ConcreteBounds, b as reifyPositional, c as EMPTY_POSITIONAL, i as CurriedValue, m as curry, o as EMPTY_ARGS, p as createCapturedArgs, s as EMPTY_NAMED, v as reifyArgs, w as clear, y as reifyNamed } from "./arguments-Carzx7C4-snfB_1Hj.js";
import { A as ResettableBlockImpl, C as setDebuggerCallback, E as DynamicAttribute, M as clientBuilder, N as dynamicAttribute, O as NewTreeBuilder, S as runtimeOptions, T as DOMTreeConstruction, _ as isWhitespace, b as renderSync, c as contentFor, d as DynamicScopeImpl, f as EnvironmentImpl, g as inTransaction, h as UpdatingVM, j as SimpleDynamicAttribute, k as RemoteBlock, l as DOMChanges, m as ScopeImpl, p as LowLevelVM, s as ProxyMixin, u as DOMChangesImpl, v as renderComponent, w as reference_exports, x as resetDebuggerCallback, y as renderMain } from "./index-B-2NDHmt-B5xkrs2f.js";
import { r as instrumentation_exports } from "./instrumentation-l8O8qirj.js";
import { f as MUTABLE_CELL } from "./textarea-B-sssXGa-CtPv2q76.js";
import { i as hash$1, n as array, r as fn } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
import { i as get$1, r as concat } from "./unique-id-BJb1p8EG-CAigDLyj.js";
import { t as on$2 } from "./on-B-5KCq9L-Cm8Anmha.js";
import { i as templateOnlyComponent, n as TemplateOnlyComponentDefinition, r as TemplateOnlyComponentManager, t as TEMPLATE_ONLY_COMPONENT_MANAGER } from "./template-only-DKNcKM5b-AnYZzp1D.js";
import { n as setComponentTemplate, t as getComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { n as tracked, t as TrackedDescriptor } from "./tracked-DvOpYI0o-BARN4wIl.js";
import { a as states, i as CoreView, n as component_exports, o as ActionSupport, s as TargetActionSupport } from "./component-DaFSbo98.js";
import { a as setComponentManager, i as modifierCapabilities, n as CustomModifierManager, o as setHelperManager, r as componentCapabilities, s as setModifierManager, t as CustomComponentManager } from "./api-B_poQGXS-T6hxwnfy.js";
import { t as destroyable_exports } from "./destroyable-Cwxqj0yK.js";
import { n as dist_exports } from "./dist-DnJA6M4U.js";
import { t as cached } from "./tracking-C-5Pptoz.js";
import { t as getDebugName } from "./get-debug-name-BDxIL2Y1-co96XrjY.js";
import { t as invokeHelper } from "./invoke-B-r9UQVH-CCn0H4Ib.js";
import { a as lt, c as not, i as gte, l as or, n as eq, o as lte, r as gt, s as neq, t as and } from "./not-DOTpWiG3-B7e-Fzd-.js";
import { a as debug_exports } from "./debug-BySZ7lXL.js";
import { n as validator_exports } from "./validator-blLXCJdd.js";
import { n as util_exports } from "./util-j8TMoaH1.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/rsvp/index.js
var rsvp_exports = /* @__PURE__ */ __exportAll({
	EventTarget: () => EventTarget,
	Promise: () => Promise$1,
	all: () => all,
	allSettled: () => allSettled,
	asap: () => asap,
	async: () => async,
	cast: () => cast,
	configure: () => configure,
	default: () => rsvp,
	defer: () => defer,
	denodeify: () => denodeify,
	filter: () => filter,
	hash: () => hash,
	hashSettled: () => hashSettled,
	map: () => map,
	off: () => off,
	on: () => on$1,
	race: () => race,
	reject: () => reject,
	resolve: () => resolve,
	rethrow: () => rethrow
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/metal/index.js
var metal_exports = /* @__PURE__ */ __exportAll({
	ASYNC_OBSERVERS: () => ASYNC_OBSERVERS,
	ComputedDescriptor: () => ComputedDescriptor,
	ComputedProperty: () => ComputedProperty,
	DEBUG_INJECTION_FUNCTIONS: () => DEBUG_INJECTION_FUNCTIONS,
	Libraries: () => Libraries,
	NAMESPACES: () => NAMESPACES,
	NAMESPACES_BY_ID: () => NAMESPACES_BY_ID,
	PROPERTY_DID_CHANGE: () => PROPERTY_DID_CHANGE,
	PROXY_CONTENT: () => PROXY_CONTENT,
	SYNC_OBSERVERS: () => SYNC_OBSERVERS,
	TrackedDescriptor: () => TrackedDescriptor,
	_getPath: () => _getPath,
	_getProp: () => _getProp,
	_setProp: () => _setProp,
	activateObserver: () => activateObserver,
	addArrayObserver: () => addArrayObserver,
	addListener: () => addListener,
	addNamespace: () => addNamespace,
	addObserver: () => addObserver,
	alias: () => alias,
	arrayContentDidChange: () => arrayContentDidChange,
	arrayContentWillChange: () => arrayContentWillChange,
	autoComputed: () => autoComputed,
	beginPropertyChanges: () => beginPropertyChanges,
	cached: () => cached,
	changeProperties: () => changeProperties,
	computed: () => computed,
	createCache: () => createCache,
	defineDecorator: () => defineDecorator,
	defineProperty: () => defineProperty,
	defineValue: () => defineValue,
	deprecateProperty: () => deprecateProperty,
	descriptorForDecorator: () => descriptorForDecorator,
	descriptorForProperty: () => descriptorForProperty,
	eachProxyArrayDidChange: () => eachProxyArrayDidChange,
	eachProxyArrayWillChange: () => eachProxyArrayWillChange,
	endPropertyChanges: () => endPropertyChanges,
	expandProperties: () => expandProperties,
	findNamespace: () => findNamespace,
	findNamespaces: () => findNamespaces,
	flushAsyncObservers: () => flushAsyncObservers,
	get: () => get,
	getCachedValueFor: () => getCachedValueFor,
	getProperties: () => getProperties,
	getValue: () => getValue,
	hasListeners: () => hasListeners,
	hasUnknownProperty: () => hasUnknownProperty,
	inject: () => inject,
	isClassicDecorator: () => isClassicDecorator,
	isComputed: () => isComputed,
	isConst: () => isConst,
	isElementDescriptor: () => isElementDescriptor,
	isNamespaceSearchDisabled: () => isSearchDisabled,
	libraries: () => LIBRARIES,
	makeComputedDecorator: () => makeComputedDecorator,
	markObjectAsDirty: () => markObjectAsDirty,
	nativeDescDecorator: () => nativeDescDecorator,
	notifyPropertyChange: () => notifyPropertyChange,
	objectAt: () => objectAt,
	on: () => on,
	processAllNamespaces: () => processAllNamespaces,
	processNamespace: () => processNamespace,
	removeArrayObserver: () => removeArrayObserver,
	removeListener: () => removeListener,
	removeNamespace: () => removeNamespace,
	removeObserver: () => removeObserver,
	replace: () => replace,
	replaceInNativeArray: () => replaceInNativeArray,
	revalidateObservers: () => revalidateObservers,
	sendEvent: () => sendEvent,
	set: () => set,
	setClassicDecorator: () => setClassicDecorator,
	setNamespaceSearchDisabled: () => setSearchDisabled,
	setProperties: () => setProperties,
	setUnprocessedMixins: () => setUnprocessedMixins,
	tagForObject: () => tagForObject,
	tagForProperty: () => tagForProperty,
	tracked: () => tracked,
	trySet: () => trySet
});
/**
@module ember
*/
/**
Used internally to allow changing properties in a backwards compatible way, and print a helpful
deprecation warning.

@method deprecateProperty
@param {Object} object The object to add the deprecated property to.
@param {String} deprecatedKey The property to add (and print deprecation warnings upon accessing).
@param {String} newKey The property that will be aliased.
@private
@since 1.7.0
*/
function deprecateProperty(object, deprecatedKey, newKey, options) {
	Object.defineProperty(object, deprecatedKey, {
		configurable: true,
		enumerable: false,
		set(value) {
			set(this, newKey, value);
		},
		get() {
			return get(this, newKey);
		}
	});
}
var EACH_PROXIES = /* @__PURE__ */ new WeakMap();
function eachProxyArrayWillChange(array, idx, removedCnt, addedCnt) {
	let eachProxy = EACH_PROXIES.get(array);
	if (eachProxy !== void 0) eachProxy.arrayWillChange(array, idx, removedCnt, addedCnt);
}
function eachProxyArrayDidChange(array, idx, removedCnt, addedCnt) {
	let eachProxy = EACH_PROXIES.get(array);
	if (eachProxy !== void 0) eachProxy.arrayDidChange(array, idx, removedCnt, addedCnt);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/runtime/lib/mixins/comparable.js
/**
@module ember
*/
/**
Implements some standard methods for comparing objects. Add this mixin to
any class you create that can compare its instances.

You should implement the `compare()` method.

@class Comparable
@namespace Ember
@since Ember 0.9
@private
*/
var Comparable = Mixin.create({
	/**
	__Required.__ You must implement this method to apply this mixin.
	Override to return the result of the comparison of the two parameters. The
	compare method should return:
	- `-1` if `a < b`
	- `0` if `a == b`
	- `1` if `a > b`
	Default implementation raises an exception.
	@method compare
	@param a {Object} the first object to compare
	@param b {Object} the second object to compare
	@return {Number} the result of the comparison
	@private
	*/
	init() {
		this._super(...arguments);
		deprecateUntil("The `Comparable` mixin is deprecated. Implement a `compare` method directly on your class instead.", DEPRECATIONS.DEPRECATE_COMPARABLE_MIXIN);
	},
	compare: null
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/runtime/index.js
var runtime_exports$1 = /* @__PURE__ */ __exportAll({
	ActionHandler: () => ActionHandler,
	Comparable: () => Comparable,
	ContainerProxyMixin: () => ContainerProxyMixin,
	MutableEnumerable: () => MutableEnumerable,
	RSVP: () => RSVP,
	RegistryProxyMixin: () => RegistryProxyMixin,
	TargetActionSupport: () => TargetActionSupport,
	_ProxyMixin: () => ProxyMixin,
	_contentFor: () => contentFor,
	onerrorDefault: () => onerrorDefault
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/views/index.js
var views_exports = /* @__PURE__ */ __exportAll({
	ActionSupport: () => ActionSupport,
	CoreView: () => CoreView,
	EventDispatcher: () => EventDispatcher,
	MUTABLE_CELL: () => MUTABLE_CELL,
	ViewStates: () => states,
	addChildView: () => addChildView,
	clearElementView: () => clearElementView,
	clearViewElement: () => clearViewElement,
	constructStyleDeprecationMessage: () => constructStyleDeprecationMessage,
	getChildViews: () => getChildViews,
	getElementView: () => getElementView,
	getRootViews: () => getRootViews,
	getViewBoundingClientRect: () => getViewBoundingClientRect,
	getViewBounds: () => getViewBounds,
	getViewClientRects: () => getViewClientRects,
	getViewElement: () => getViewElement,
	getViewId: () => getViewId,
	isSimpleClick: () => isSimpleClick,
	setElementView: () => setElementView,
	setViewElement: () => setViewElement
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/manager/index.js
var manager_exports = /* @__PURE__ */ __exportAll({
	CustomComponentManager: () => CustomComponentManager,
	CustomHelperManager: () => CustomHelperManager,
	CustomModifierManager: () => CustomModifierManager,
	capabilityFlagsFrom: () => capabilityFlagsFrom,
	componentCapabilities: () => componentCapabilities,
	getComponentTemplate: () => getComponentTemplate,
	getCustomTagFor: () => getCustomTagFor,
	getInternalComponentManager: () => getInternalComponentManager,
	getInternalHelperManager: () => getInternalHelperManager,
	getInternalModifierManager: () => getInternalModifierManager,
	hasCapability: () => hasCapability,
	hasDestroyable: () => hasDestroyable,
	hasInternalComponentManager: () => hasInternalComponentManager,
	hasInternalHelperManager: () => hasInternalHelperManager,
	hasInternalModifierManager: () => hasInternalModifierManager,
	hasValue: () => hasValue,
	helperCapabilities: () => helperCapabilities,
	managerHasCapability: () => managerHasCapability,
	modifierCapabilities: () => modifierCapabilities,
	setComponentManager: () => setComponentManager,
	setComponentTemplate: () => setComponentTemplate,
	setCustomTagFor: () => setCustomTagFor,
	setHelperManager: () => setHelperManager,
	setInternalComponentManager: () => setInternalComponentManager,
	setInternalHelperManager: () => setInternalHelperManager,
	setInternalModifierManager: () => setInternalModifierManager,
	setModifierManager: () => setModifierManager
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/array/mutable.js
var mutable_exports = /* @__PURE__ */ __exportAll({ default: () => MutableArray });
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/array/proxy.js
var proxy_exports = /* @__PURE__ */ __exportAll({ default: () => ArrayProxy });
/**
@module @ember/array/proxy
*/
var ARRAY_OBSERVER_MAPPING = {
	willChange: "_arrangedContentArrayWillChange",
	didChange: "_arrangedContentArrayDidChange"
};
function customTagForArrayProxy(proxy, key) {
	if (key === "[]") {
		proxy._revalidate();
		return proxy._arrTag;
	} else if (key === "length") {
		proxy._revalidate();
		return proxy._lengthTag;
	}
	return tagFor(proxy, key);
}
/**
An ArrayProxy wraps any other object that implements `Array` and/or
`MutableArray,` forwarding all requests. This makes it very useful for
a number of binding use cases or other cases where being able to swap
out the underlying array is useful.

A simple example of usage:

```javascript
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

let pets = ['dog', 'cat', 'fish'];
let ap = ArrayProxy.create({ content: A(pets) });

ap.get('firstObject');                        // 'dog'
ap.set('content', ['amoeba', 'paramecium']);
ap.get('firstObject');                        // 'amoeba'
```

This class can also be useful as a layer to transform the contents of
an array, as they are accessed. This can be done by overriding
`objectAtContent`:

```javascript
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

let pets = ['dog', 'cat', 'fish'];
let ap = ArrayProxy.create({
content: A(pets),
objectAtContent: function(idx) {
return this.get('content').objectAt(idx).toUpperCase();
}
});

ap.get('firstObject'); // . 'DOG'
```

When overriding this class, it is important to place the call to
`_super` *after* setting `content` so the internal observers have
a chance to fire properly:

```javascript
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

export default ArrayProxy.extend({
init() {
this.set('content', A(['dog', 'cat', 'fish']));
this._super(...arguments);
}
});
```

@class ArrayProxy
@extends EmberObject
@uses MutableArray
@public
*/
var ArrayProxy = class extends EmberObject {
	/** @internal */
	_objectsDirtyIndex = 0;
	/** @internal */
	_objects = null;
	/** @internal */
	_lengthDirty = true;
	/** @internal */
	_length = 0;
	/** @internal */
	_arrangedContent = null;
	/** @internal */
	_arrangedContentIsUpdating = false;
	/** @internal */
	_arrangedContentTag = null;
	/** @internal */
	_arrangedContentRevision = null;
	/** @internal */
	_lengthTag = null;
	/** @internal */
	_arrTag = null;
	init(props) {
		super.init(props);
		setCustomTagFor(this, customTagForArrayProxy);
	}
	[PROPERTY_DID_CHANGE]() {
		this._revalidate();
	}
	willDestroy() {
		this._removeArrangedContentArrayObserver();
	}
	objectAtContent(idx) {
		let arrangedContent = get(this, "arrangedContent");
		return objectAt(arrangedContent, idx);
	}
	replace(idx, amt, objects) {
		this.replaceContent(idx, amt, objects);
	}
	replaceContent(idx, amt, objects) {
		let content = get(this, "content");
		replace(content, idx, amt, objects);
	}
	objectAt(idx) {
		this._revalidate();
		if (this._objects === null) this._objects = [];
		if (this._objectsDirtyIndex !== -1 && idx >= this._objectsDirtyIndex) {
			let arrangedContent = get(this, "arrangedContent");
			if (arrangedContent) {
				let length = this._objects.length = get(arrangedContent, "length");
				for (let i = this._objectsDirtyIndex; i < length; i++) this._objects[i] = this.objectAtContent(i);
			} else this._objects.length = 0;
			this._objectsDirtyIndex = -1;
		}
		return this._objects[idx];
	}
	get length() {
		this._revalidate();
		if (this._lengthDirty) {
			let arrangedContent = get(this, "arrangedContent");
			this._length = arrangedContent ? get(arrangedContent, "length") : 0;
			this._lengthDirty = false;
		}
		consumeTag(this._lengthTag);
		return this._length;
	}
	set length(value) {
		let removedCount = this.length - value;
		let added;
		if (removedCount === 0) return;
		else if (removedCount < 0) {
			added = new Array(-removedCount);
			removedCount = 0;
		}
		let content = get(this, "content");
		if (content) {
			replace(content, value, removedCount, added);
			this._invalidate();
		}
	}
	_updateArrangedContentArray(arrangedContent) {
		let oldLength = this._objects === null ? 0 : this._objects.length;
		let newLength = arrangedContent ? get(arrangedContent, "length") : 0;
		this._removeArrangedContentArrayObserver();
		arrayContentWillChange(this, 0, oldLength, newLength);
		this._invalidate();
		arrayContentDidChange(this, 0, oldLength, newLength, false);
		this._addArrangedContentArrayObserver(arrangedContent);
	}
	_addArrangedContentArrayObserver(arrangedContent) {
		if (arrangedContent && !arrangedContent.isDestroyed) {
			addArrayObserver(arrangedContent, this, ARRAY_OBSERVER_MAPPING);
			this._arrangedContent = arrangedContent;
		}
	}
	_removeArrangedContentArrayObserver() {
		if (this._arrangedContent) removeArrayObserver(this._arrangedContent, this, ARRAY_OBSERVER_MAPPING);
	}
	_arrangedContentArrayWillChange() {}
	_arrangedContentArrayDidChange(_proxy, idx, removedCnt, addedCnt) {
		arrayContentWillChange(this, idx, removedCnt, addedCnt);
		let dirtyIndex = idx;
		if (dirtyIndex < 0) {
			let length = get(this._arrangedContent, "length");
			dirtyIndex += length + removedCnt - addedCnt;
		}
		if (this._objectsDirtyIndex === -1 || this._objectsDirtyIndex > dirtyIndex) this._objectsDirtyIndex = dirtyIndex;
		this._lengthDirty = true;
		arrayContentDidChange(this, idx, removedCnt, addedCnt, false);
	}
	_invalidate() {
		this._objectsDirtyIndex = 0;
		this._lengthDirty = true;
	}
	_revalidate() {
		if (this._arrangedContentIsUpdating === true) return;
		if (this._arrangedContentTag === null || !validateTag(this._arrangedContentTag, this._arrangedContentRevision)) {
			let arrangedContent = this.get("arrangedContent");
			if (this._arrangedContentTag === null) this._addArrangedContentArrayObserver(arrangedContent);
			else {
				this._arrangedContentIsUpdating = true;
				this._updateArrangedContentArray(arrangedContent);
				this._arrangedContentIsUpdating = false;
			}
			let arrangedContentTag = this._arrangedContentTag = tagFor(this, "arrangedContent");
			this._arrangedContentRevision = valueForTag(this._arrangedContentTag);
			if (isObject(arrangedContent)) {
				this._lengthTag = combine([arrangedContentTag, tagForProperty(arrangedContent, "length")]);
				this._arrTag = combine([arrangedContentTag, tagForProperty(arrangedContent, "[]")]);
			} else this._lengthTag = this._arrTag = arrangedContentTag;
		}
	}
};
ArrayProxy.reopen(MutableArray, { arrangedContent: alias("content") });
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/meta/index.js
var meta_exports = /* @__PURE__ */ __exportAll({
	Meta: () => Meta,
	UNDEFINED: () => UNDEFINED,
	counters: () => counters,
	meta: () => meta,
	peekMeta: () => peekMeta,
	setMeta: () => setMeta
});
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/utils/index.js
var utils_exports = /* @__PURE__ */ __exportAll({
	Cache: () => Cache,
	GUID_KEY: () => GUID_KEY,
	ROOT: () => ROOT,
	canInvoke: () => canInvoke,
	checkHasSuper: () => checkHasSuper,
	dictionary: () => makeDictionary,
	generateGuid: () => generateGuid,
	getDebugName: () => getDebugName,
	getName: () => getName,
	guidFor: () => guidFor,
	intern: () => intern,
	isObject: () => isObject,
	isProxy: () => isProxy,
	lookupDescriptor: () => lookupDescriptor,
	observerListenerMetaFor: () => observerListenerMetaFor,
	setListeners: () => setListeners,
	setName: () => setName,
	setObservers: () => setObservers,
	setProxy: () => setProxy,
	setWithMandatorySetter: () => setWithMandatorySetter,
	setupMandatorySetter: () => setupMandatorySetter,
	teardownMandatorySetter: () => teardownMandatorySetter,
	toString: () => toString,
	uuid: () => uuid,
	wrap: () => wrap
});
var objectToString = Object.prototype.toString;
function isNone(obj) {
	return obj === null || obj === void 0;
}
function toString(obj) {
	if (typeof obj === "string") return obj;
	if (null === obj) return "null";
	if (void 0 === obj) return "undefined";
	if (Array.isArray(obj)) {
		let r = "";
		for (let k = 0; k < obj.length; k++) {
			if (k > 0) r += ",";
			if (!isNone(obj[k])) r += toString(obj[k]);
		}
		return r;
	}
	if (typeof obj.toString === "function") return obj.toString();
	return objectToString.call(obj);
}
var setupMandatorySetter;
var teardownMandatorySetter;
var setWithMandatorySetter;
/**
Checks to see if the `methodName` exists on the `obj`.

```javascript
let foo = { bar: function() { return 'bar'; }, baz: null };

Ember.canInvoke(foo, 'bar'); // true
Ember.canInvoke(foo, 'baz'); // false
Ember.canInvoke(foo, 'bat'); // false
```

@method canInvoke
@for Ember
@param {Object} obj The object to check for the method
@param {String} methodName The method name to check for
@return {Boolean}
@private
*/
function canInvoke(obj, methodName) {
	return obj != null && typeof obj[methodName] === "function";
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/promise-proxy-mixin.js
var promise_proxy_mixin_exports = /* @__PURE__ */ __exportAll({ default: () => PromiseProxyMixin });
/**
@module @ember/object/promise-proxy-mixin
*/
function tap(proxy, promise) {
	setProperties(proxy, {
		isFulfilled: false,
		isRejected: false
	});
	return promise.then((value) => {
		if (!proxy.isDestroyed && !proxy.isDestroying) setProperties(proxy, {
			content: value,
			isFulfilled: true
		});
		return value;
	}, (reason) => {
		if (!proxy.isDestroyed && !proxy.isDestroying) setProperties(proxy, {
			reason,
			isRejected: true
		});
		throw reason;
	}, "Ember: PromiseProxy");
}
/**
A low level mixin making ObjectProxy promise-aware.

```javascript
import { resolve } from 'rsvp';
import $ from 'jquery';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let proxy = ObjectPromiseProxy.create({
promise: resolve($.getJSON('/some/remote/data.json'))
});

proxy.then(function(json){
// the json
}, function(reason) {
// the reason why you have no json
});
```

the proxy has bindable attributes which
track the promises life cycle

```javascript
proxy.get('isPending')   //=> true
proxy.get('isSettled')  //=> false
proxy.get('isRejected')  //=> false
proxy.get('isFulfilled') //=> false
```

When the $.getJSON completes, and the promise is fulfilled
with json, the life cycle attributes will update accordingly.
Note that $.getJSON doesn't return an ECMA specified promise,
it is useful to wrap this with an `RSVP.resolve` so that it behaves
as a spec compliant promise.

```javascript
proxy.get('isPending')   //=> false
proxy.get('isSettled')   //=> true
proxy.get('isRejected')  //=> false
proxy.get('isFulfilled') //=> true
```

As the proxy is an ObjectProxy, and the json now its content,
all the json properties will be available directly from the proxy.

```javascript
// Assuming the following json:
{
firstName: 'Stefan',
lastName: 'Penner'
}

// both properties will accessible on the proxy
proxy.get('firstName') //=> 'Stefan'
proxy.get('lastName')  //=> 'Penner'
```

@class PromiseProxyMixin
@public
*/
var PromiseProxyMixin = Mixin.create({
	reason: null,
	isPending: computed("isSettled", function() {
		return !get(this, "isSettled");
	}).readOnly(),
	isSettled: computed("isRejected", "isFulfilled", function() {
		return get(this, "isRejected") || get(this, "isFulfilled");
	}).readOnly(),
	isRejected: false,
	isFulfilled: false,
	promise: computed({
		get() {
			throw new Error("PromiseProxy's promise must be set");
		},
		set(_key, promise) {
			return tap(this, promise);
		}
	}),
	then: promiseAlias("then"),
	catch: promiseAlias("catch"),
	finally: promiseAlias("finally")
});
function promiseAlias(name) {
	return function(...args) {
		return get(this, "promise")[name](...args);
	};
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/proxy.js
var proxy_exports$1 = /* @__PURE__ */ __exportAll({ default: () => ObjectProxy });
/**
@module @ember/object/proxy
*/
/**
`ObjectProxy` forwards all properties not defined by the proxy itself
to a proxied `content` object.

```javascript
import EmberObject from '@ember/object';
import ObjectProxy from '@ember/object/proxy';

let exampleObject = EmberObject.create({
name: 'Foo'
});

let exampleProxy = ObjectProxy.create({
content: exampleObject
});

// Access and change existing properties
exampleProxy.get('name');          // 'Foo'
exampleProxy.set('name', 'Bar');
exampleObject.get('name');         // 'Bar'

// Create new 'description' property on `exampleObject`
exampleProxy.set('description', 'Foo is a whizboo baz');
exampleObject.get('description');  // 'Foo is a whizboo baz'
```

While `content` is unset, setting a property to be delegated will throw an
Error.

```javascript
import ObjectProxy from '@ember/object/proxy';

let exampleProxy = ObjectProxy.create({
content: null,
flag: null
});
exampleProxy.set('flag', true);
exampleProxy.get('flag');         // true
exampleProxy.get('foo');          // undefined
exampleProxy.set('foo', 'data');  // throws Error
```

Delegated properties can be bound to and will change when content is updated.

Computed properties on the proxy itself can depend on delegated properties.

```javascript
import { computed } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';

class ProxyWithComputedProperty extends ObjectProxy {
@computed('firstName', 'lastName')
get fullName() {
var firstName = this.get('firstName'),
lastName = this.get('lastName');
if (firstName && lastName) {
return firstName + ' ' + lastName;
}
return firstName || lastName;
}
}

let exampleProxy = ProxyWithComputedProperty.create();

exampleProxy.get('fullName');  // undefined
exampleProxy.set('content', {
firstName: 'Tom', lastName: 'Dale'
}); // triggers property change for fullName on proxy

exampleProxy.get('fullName');  // 'Tom Dale'
```

@class ObjectProxy
@extends EmberObject
@uses Ember.ProxyMixin
@public
*/
var ObjectProxy = class extends FrameworkObject {};
ObjectProxy.PrototypeMixin.reopen(ProxyMixin);
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/runtime/index.js
var runtime_exports = /* @__PURE__ */ __exportAll({
	ConcreteBounds: () => ConcreteBounds,
	CurriedValue: () => CurriedValue,
	CursorImpl: () => CursorImpl,
	DOMChanges: () => DOMChanges,
	DOMTreeConstruction: () => DOMTreeConstruction,
	DynamicAttribute: () => DynamicAttribute,
	DynamicScopeImpl: () => DynamicScopeImpl,
	EMPTY_ARGS: () => EMPTY_ARGS,
	EMPTY_NAMED: () => EMPTY_NAMED,
	EMPTY_POSITIONAL: () => EMPTY_POSITIONAL,
	EnvironmentImpl: () => EnvironmentImpl,
	IDOMChanges: () => DOMChangesImpl,
	LowLevelVM: () => LowLevelVM,
	NewTreeBuilder: () => NewTreeBuilder,
	RehydrateTree: () => RehydrateTree,
	RemoteBlock: () => RemoteBlock,
	ResettableBlockImpl: () => ResettableBlockImpl,
	SERIALIZATION_FIRST_NODE_STRING: () => SERIALIZATION_FIRST_NODE_STRING,
	ScopeImpl: () => ScopeImpl,
	SimpleDynamicAttribute: () => SimpleDynamicAttribute,
	TEMPLATE_ONLY_COMPONENT_MANAGER: () => TEMPLATE_ONLY_COMPONENT_MANAGER,
	TemplateOnlyComponent: () => TemplateOnlyComponentDefinition,
	TemplateOnlyComponentManager: () => TemplateOnlyComponentManager,
	UpdatingVM: () => UpdatingVM,
	and: () => and,
	array: () => array,
	clear: () => clear,
	clientBuilder: () => clientBuilder,
	concat: () => concat,
	createCapturedArgs: () => createCapturedArgs,
	curry: () => curry,
	destroy: () => destroy,
	dynamicAttribute: () => dynamicAttribute,
	eq: () => eq,
	fn: () => fn,
	get: () => get$1,
	gt: () => gt,
	gte: () => gte,
	hash: () => hash$1,
	inTransaction: () => inTransaction,
	invokeHelper: () => invokeHelper,
	isDestroyed: () => isDestroyed,
	isDestroying: () => isDestroying,
	isSerializationFirstNode: () => isSerializationFirstNode,
	isWhitespace: () => isWhitespace,
	lt: () => lt,
	lte: () => lte,
	neq: () => neq,
	normalizeProperty: () => normalizeProperty,
	not: () => not,
	on: () => on$2,
	or: () => or,
	registerDestructor: () => registerDestructor,
	rehydrationBuilder: () => rehydrationBuilder,
	reifyArgs: () => reifyArgs,
	reifyNamed: () => reifyNamed,
	reifyPositional: () => reifyPositional,
	renderComponent: () => renderComponent,
	renderMain: () => renderMain,
	renderSync: () => renderSync,
	resetDebuggerCallback: () => resetDebuggerCallback,
	runtimeOptions: () => runtimeOptions,
	setDebuggerCallback: () => setDebuggerCallback,
	templateOnlyComponent: () => templateOnlyComponent
});
//#endregion
export { application_exports as Application, namespace_exports as ApplicationNamespace, array_exports as Array, mutable_exports as ArrayMutable, proxy_exports as ArrayProxy, component_exports as Component, controller_exports as Controller, debug_exports as Debug, destroyable_exports as EmberDestroyable, object_exports as EmberObject, object_exports as Object, mutable_exports$1 as EnumerableMutable, dist_exports as GlimmerComponent, manager_exports as GlimmerManager, reference_exports as GlimmerReference, runtime_exports as GlimmerRuntime, util_exports as GlimmerUtil, validator_exports as GlimmerValidator, instrumentation_exports as Instrumentation, environment_exports as InternalsEnvironment, meta_exports as InternalsMeta, metal_exports as InternalsMetal, runtime_exports$1 as InternalsRuntime, utils_exports as InternalsUtils, views_exports as InternalsViews, core_exports as ObjectCore, evented_exports as ObjectEvented, internals_exports as ObjectInternals, observable_exports as ObjectObservable, promise_proxy_mixin_exports as ObjectPromiseProxyMixin, proxy_exports$1 as ObjectProxy, owner_exports as Owner, rsvp_exports as RSVP, runloop_exports as Runloop, service_exports as Service, version_exports as VERSION };
