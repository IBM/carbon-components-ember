import { d3 as EventTarget, d4 as Promise$1, d5 as all, d6 as allSettled, d7 as asap, d8 as async, d9 as cast, da as configure, db as rsvp, dc as defer, dd as denodeify, de as filter, df as hash, dg as hashSettled, dh as map, di as off, dj as on, dk as race, dl as reject, dm as resolve, dn as rethrow, g as get, dp as set, dq as ASYNC_OBSERVERS, dr as ComputedDescriptor, ds as ComputedProperty, dt as DEBUG_INJECTION_FUNCTIONS, du as Libraries, dv as NAMESPACES, dw as NAMESPACES_BY_ID, dx as PROPERTY_DID_CHANGE, dy as PROXY_CONTENT, dz as SYNC_OBSERVERS, dA as TrackedDescriptor, dB as _getPath, dC as _getProp, dD as _setProp, dE as activateObserver, dF as addArrayObserver, dG as addListener, dH as addNamespace, dI as addObserver, dJ as alias, dK as arrayContentDidChange, dL as arrayContentWillChange, dM as autoComputed, dN as beginPropertyChanges, dO as cached, dP as changeProperties, dQ as computed, dR as createCache, dS as defineDecorator, dT as defineProperty, dU as defineValue, dV as descriptorForDecorator, dW as descriptorForProperty, dX as endPropertyChanges, dY as expandProperties, dZ as findNamespace, d_ as findNamespaces, d$ as flushAsyncObservers, e0 as getProperties, e1 as getValue, e2 as hasListeners, e3 as hasUnknownProperty, e4 as inject, e5 as isClassicDecorator, e6 as isComputed, e7 as isConst, e8 as isElementDescriptor, e9 as isSearchDisabled, ea as LIBRARIES, eb as makeComputedDecorator, ec as markObjectAsDirty, ed as nativeDescDecorator, ee as notifyPropertyChange, ef as objectAt, eg as on$1, eh as processAllNamespaces, ei as processNamespace, ej as removeArrayObserver, ek as removeListener, el as removeNamespace, em as removeObserver, en as replace, eo as replaceInNativeArray, ep as revalidateObservers, eq as sendEvent, er as setClassicDecorator, es as setSearchDisabled, et as setProperties, eu as setUnprocessedMixins, ev as tagForObject, ew as tagForProperty, n as tracked, ex as trySet, ey as MutableArray, ez as EmberObject, eA as setCustomTagFor, eB as validateTag, eC as tagFor, eD as valueForTag, eE as isObject, eF as combine, eG as consumeTag, eH as Meta, eI as UNDEFINED, eJ as counters, eK as meta, X as peekMeta, eL as setMeta, eM as Mixin, eN as deprecateUntil, eO as DEPRECATIONS, eP as ActionHandler, eQ as ContainerProxyMixin, eR as MutableEnumerable, eS as RSVP, eT as RegistryProxyMixin, eU as TargetActionSupport, eV as ProxyMixin, eW as contentFor, eX as onerrorDefault, R as Cache, eY as GUID_KEY, eZ as ROOT, e_ as checkHasSuper, e$ as makeDictionary, f0 as generateGuid, f1 as getDebugName, f2 as getName, Y as guidFor, f3 as intern, f4 as isProxy, f5 as lookupDescriptor, f6 as observerListenerMetaFor, f7 as setListeners, f8 as setName, f9 as setObservers, fa as setProxy, fb as uuid, fc as wrap, fd as ActionSupport, fe as CoreView, ff as EventDispatcher, fg as MUTABLE_CELL, fh as states, fi as addChildView, fj as clearElementView, fk as clearViewElement, fl as constructStyleDeprecationMessage, fm as getChildViews, fn as getElementView, fo as getRootViews, fp as getViewBoundingClientRect, fq as getViewBounds, fr as getViewClientRects, fs as getViewElement, ft as getViewId, fu as isSimpleClick, fv as setElementView, fw as setViewElement, fx as FrameworkObject, fy as CustomComponentManager, fz as CustomHelperManager, fA as CustomModifierManager, fB as capabilityFlagsFrom, fC as componentCapabilities, fD as getComponentTemplate, fE as getCustomTagFor, fF as getInternalComponentManager, fG as getInternalHelperManager, fH as getInternalModifierManager, fI as hasCapability, fJ as hasDestroyable, fK as hasInternalComponentManager, fL as hasInternalHelperManager, fM as hasInternalModifierManager, fN as hasValue, fO as helperCapabilities, fP as managerHasCapability, fQ as modifierCapabilities, fR as setComponentManager, s as setComponentTemplate, fS as setHelperManager, fT as setInternalComponentManager, fU as setInternalHelperManager, fV as setInternalModifierManager, fW as setModifierManager, fX as ConcreteBounds, fY as CurriedValue, fZ as CursorImpl, f_ as DOMChanges, f$ as DOMTreeConstruction, g0 as DynamicAttribute, g1 as DynamicScopeImpl, g2 as EMPTY_ARGS, g3 as EMPTY_NAMED, g4 as EMPTY_POSITIONAL, g5 as EnvironmentImpl, g6 as DOMChangesImpl, g7 as LowLevelVM, g8 as NewTreeBuilder, g9 as RehydrateTree, ga as RemoteBlock, gb as ResettableBlockImpl, gc as SERIALIZATION_FIRST_NODE_STRING, gd as ScopeImpl, ge as SimpleDynamicAttribute, gf as TEMPLATE_ONLY_COMPONENT_MANAGER, gg as TemplateOnlyComponentDefinition, gh as TemplateOnlyComponentManager, gi as UpdatingVM, bF as and, bI as array, gj as clear, gk as clientBuilder, gl as concat, gm as createCapturedArgs, gn as curry, go as destroy, gp as dynamicAttribute, bH as eq, bE as fn, gq as get$1, bB as gt, bA as gte, bD as hash$1, gr as inTransaction, gs as invokeHelper, gt as isDestroyed, gu as isDestroying, gv as isSerializationFirstNode, gw as isWhitespace, bz as lt, by as lte, bC as neq, gx as normalizeProperty, bx as not, gy as on$2, bw as or, gz as registerDestructor, gA as rehydrationBuilder, gB as reifyArgs, gC as reifyNamed, gD as reifyPositional, gE as renderComponent, gF as renderMain, gG as renderSync, gH as resetDebuggerCallback, gI as runtimeOptions, gJ as setDebuggerCallback, gK as templateOnlyComponent } from './main-B8rrDxlx.js';
export { gL as Application, gM as ApplicationNamespace, gN as Array, gO as Component, gP as Controller, gQ as EmberDestroyable, gR as EmberObject, gS as EnumerableMutable, gT as GlimmerComponent, gU as GlimmerReference, gV as GlimmerValidator, gW as Instrumentation, gX as InternalsEnvironment, gR as Object, gY as ObjectCore, gZ as ObjectEvented, g_ as ObjectObservable, g$ as Owner, h0 as Runloop, h1 as Service, h2 as VERSION } from './main-B8rrDxlx.js';
export { i as Debug } from './index-D_87CeaA.js';
import { g as getCachedValueFor } from './internals-BKcRWoxb.js';
export { i as ObjectInternals } from './internals-BKcRWoxb.js';
export { i as GlimmerUtil } from './index-CRaCx-JV.js';

const index$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  EventTarget,
  Promise: Promise$1,
  all,
  allSettled,
  asap,
  async,
  cast,
  configure,
  default: rsvp,
  defer,
  denodeify,
  filter,
  hash,
  hashSettled,
  map,
  off,
  on,
  race,
  reject,
  resolve,
  rethrow
}, Symbol.toStringTag, { value: 'Module' }));

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
const EACH_PROXIES = new WeakMap();
function eachProxyArrayWillChange(array, idx, removedCnt, addedCnt) {
  let eachProxy = EACH_PROXIES.get(array);
  if (eachProxy !== undefined) {
    eachProxy.arrayWillChange(array, idx, removedCnt, addedCnt);
  }
}
function eachProxyArrayDidChange(array, idx, removedCnt, addedCnt) {
  let eachProxy = EACH_PROXIES.get(array);
  if (eachProxy !== undefined) {
    eachProxy.arrayDidChange(array, idx, removedCnt, addedCnt);
  }
}

const index$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ASYNC_OBSERVERS,
  ComputedDescriptor,
  ComputedProperty,
  DEBUG_INJECTION_FUNCTIONS,
  Libraries,
  NAMESPACES,
  NAMESPACES_BY_ID,
  PROPERTY_DID_CHANGE,
  PROXY_CONTENT,
  SYNC_OBSERVERS,
  TrackedDescriptor,
  _getPath,
  _getProp,
  _setProp,
  activateObserver,
  addArrayObserver,
  addListener,
  addNamespace,
  addObserver,
  alias,
  arrayContentDidChange,
  arrayContentWillChange,
  autoComputed,
  beginPropertyChanges,
  cached,
  changeProperties,
  computed,
  createCache,
  defineDecorator,
  defineProperty,
  defineValue,
  deprecateProperty,
  descriptorForDecorator,
  descriptorForProperty,
  eachProxyArrayDidChange,
  eachProxyArrayWillChange,
  endPropertyChanges,
  expandProperties,
  findNamespace,
  findNamespaces,
  flushAsyncObservers,
  get,
  getCachedValueFor,
  getProperties,
  getValue,
  hasListeners,
  hasUnknownProperty,
  inject,
  isClassicDecorator,
  isComputed,
  isConst,
  isElementDescriptor,
  isNamespaceSearchDisabled: isSearchDisabled,
  libraries: LIBRARIES,
  makeComputedDecorator,
  markObjectAsDirty,
  nativeDescDecorator,
  notifyPropertyChange,
  objectAt,
  on: on$1,
  processAllNamespaces,
  processNamespace,
  removeArrayObserver,
  removeListener,
  removeNamespace,
  removeObserver,
  replace,
  replaceInNativeArray,
  revalidateObservers,
  sendEvent,
  set,
  setClassicDecorator,
  setNamespaceSearchDisabled: setSearchDisabled,
  setProperties,
  setUnprocessedMixins,
  tagForObject,
  tagForProperty,
  tracked,
  trySet
}, Symbol.toStringTag, { value: 'Module' }));

const mutable = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: MutableArray
}, Symbol.toStringTag, { value: 'Module' }));

/**
@module @ember/array/proxy
*/

const ARRAY_OBSERVER_MAPPING = {
  willChange: '_arrangedContentArrayWillChange',
  didChange: '_arrangedContentArrayDidChange'
};
function customTagForArrayProxy(proxy, key) {
  if (key === '[]') {
    proxy._revalidate();
    return proxy._arrTag;
  } else if (key === 'length') {
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

class ArrayProxy extends EmberObject {
  /*
    `this._objectsDirtyIndex` determines which indexes in the `this._objects`
    cache are dirty.
     If `this._objectsDirtyIndex === -1` then no indexes are dirty.
    Otherwise, an index `i` is dirty if `i >= this._objectsDirtyIndex`.
     Calling `objectAt` with a dirty index will cause the `this._objects`
    cache to be recomputed.
  */
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
    let arrangedContent = get(this, 'arrangedContent');
    return objectAt(arrangedContent, idx);
  }

  // See additional docs for `replace` from `MutableArray`:
  // https://api.emberjs.com/ember/release/classes/MutableArray/methods/replace?anchor=replace
  replace(idx, amt, objects) {
    this.replaceContent(idx, amt, objects);
  }
  replaceContent(idx, amt, objects) {
    let content = get(this, 'content');
    replace(content, idx, amt, objects);
  }

  // Overriding objectAt is not supported.
  objectAt(idx) {
    this._revalidate();
    if (this._objects === null) {
      this._objects = [];
    }
    if (this._objectsDirtyIndex !== -1 && idx >= this._objectsDirtyIndex) {
      let arrangedContent = get(this, 'arrangedContent');
      if (arrangedContent) {
        let length = this._objects.length = get(arrangedContent, 'length');
        for (let i = this._objectsDirtyIndex; i < length; i++) {
          // SAFETY: This is expected to only ever return an instance of T. In other words, there should
          // be no gaps in the array. Unfortunately, we can't actually assert for it since T could include
          // any types, including null or undefined.
          this._objects[i] = this.objectAtContent(i);
        }
      } else {
        this._objects.length = 0;
      }
      this._objectsDirtyIndex = -1;
    }
    return this._objects[idx];
  }

  // Overriding length is not supported.
  get length() {
    this._revalidate();
    if (this._lengthDirty) {
      let arrangedContent = get(this, 'arrangedContent');
      this._length = arrangedContent ? get(arrangedContent, 'length') : 0;
      this._lengthDirty = false;
    }
    consumeTag(this._lengthTag);
    return this._length;
  }
  set length(value) {
    let length = this.length;
    let removedCount = length - value;
    let added;
    if (removedCount === 0) {
      return;
    } else if (removedCount < 0) {
      added = new Array(-removedCount);
      removedCount = 0;
    }
    let content = get(this, 'content');
    if (content) {
      replace(content, value, removedCount, added);
      this._invalidate();
    }
  }
  _updateArrangedContentArray(arrangedContent) {
    let oldLength = this._objects === null ? 0 : this._objects.length;
    let newLength = arrangedContent ? get(arrangedContent, 'length') : 0;
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
    if (this._arrangedContent) {
      removeArrayObserver(this._arrangedContent, this, ARRAY_OBSERVER_MAPPING);
    }
  }
  _arrangedContentArrayWillChange() {}
  _arrangedContentArrayDidChange(_proxy, idx, removedCnt, addedCnt) {
    arrayContentWillChange(this, idx, removedCnt, addedCnt);
    let dirtyIndex = idx;
    if (dirtyIndex < 0) {
      let length = get(this._arrangedContent, 'length');
      dirtyIndex += length + removedCnt - addedCnt;
    }
    if (this._objectsDirtyIndex === -1 || this._objectsDirtyIndex > dirtyIndex) {
      this._objectsDirtyIndex = dirtyIndex;
    }
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
      let arrangedContent = this.get('arrangedContent');
      if (this._arrangedContentTag === null) {
        // This is the first time the proxy has been setup, only add the observer
        // don't trigger any events
        this._addArrangedContentArrayObserver(arrangedContent);
      } else {
        this._arrangedContentIsUpdating = true;
        this._updateArrangedContentArray(arrangedContent);
        this._arrangedContentIsUpdating = false;
      }
      let arrangedContentTag = this._arrangedContentTag = tagFor(this, 'arrangedContent');
      this._arrangedContentRevision = valueForTag(this._arrangedContentTag);
      if (isObject(arrangedContent)) {
        this._lengthTag = combine([arrangedContentTag, tagForProperty(arrangedContent, 'length')]);
        this._arrTag = combine([arrangedContentTag, tagForProperty(arrangedContent, '[]')]);
      } else {
        this._lengthTag = this._arrTag = arrangedContentTag;
      }
    }
  }
}
ArrayProxy.reopen(MutableArray, {
  arrangedContent: alias('content')
});

const proxy$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: ArrayProxy
}, Symbol.toStringTag, { value: 'Module' }));

const index$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Meta,
  UNDEFINED,
  counters,
  meta,
  peekMeta,
  setMeta
}, Symbol.toStringTag, { value: 'Module' }));

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

const Comparable = Mixin.create({
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
    deprecateUntil('The `Comparable` mixin is deprecated. Implement a `compare` method directly on your class instead.', DEPRECATIONS.DEPRECATE_COMPARABLE_MIXIN);
  },
  compare: null
});

const index$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ActionHandler,
  Comparable,
  ContainerProxyMixin,
  MutableEnumerable,
  RSVP,
  RegistryProxyMixin,
  TargetActionSupport,
  _ProxyMixin: ProxyMixin,
  _contentFor: contentFor,
  onerrorDefault
}, Symbol.toStringTag, { value: 'Module' }));

const objectToString = Object.prototype.toString;
function isNone(obj) {
  return obj === null || obj === undefined;
}

/*
 A `toString` util function that supports objects without a `toString`
 method, e.g. an object created with `Object.create(null)`.
*/
function toString(obj) {
  if (typeof obj === 'string') {
    return obj;
  }
  if (null === obj) return 'null';
  if (undefined === obj) return 'undefined';
  if (Array.isArray(obj)) {
    // Reimplement Array.prototype.join according to spec (22.1.3.13)
    // Changing ToString(element) with this safe version of ToString.
    let r = '';
    for (let k = 0; k < obj.length; k++) {
      if (k > 0) {
        r += ',';
      }
      if (!isNone(obj[k])) {
        r += toString(obj[k]);
      }
    }
    return r;
  }
  if (typeof obj.toString === 'function') {
    return obj.toString();
  }
  return objectToString.call(obj);
}
let setupMandatorySetter;
let teardownMandatorySetter;
let setWithMandatorySetter;

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
  return obj != null && typeof obj[methodName] === 'function';
}

const index$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Cache,
  GUID_KEY,
  ROOT,
  canInvoke,
  checkHasSuper,
  dictionary: makeDictionary,
  generateGuid,
  getDebugName,
  getName,
  guidFor,
  intern,
  isObject,
  isProxy,
  lookupDescriptor,
  observerListenerMetaFor,
  setListeners,
  setName,
  setObservers,
  setProxy,
  setWithMandatorySetter,
  setupMandatorySetter,
  teardownMandatorySetter,
  toString,
  uuid,
  wrap
}, Symbol.toStringTag, { value: 'Module' }));

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ActionSupport,
  CoreView,
  EventDispatcher,
  MUTABLE_CELL,
  ViewStates: states,
  addChildView,
  clearElementView,
  clearViewElement,
  constructStyleDeprecationMessage,
  getChildViews,
  getElementView,
  getRootViews,
  getViewBoundingClientRect,
  getViewBounds,
  getViewClientRects,
  getViewElement,
  getViewId,
  isSimpleClick,
  setElementView,
  setViewElement
}, Symbol.toStringTag, { value: 'Module' }));

/**
  @module @ember/object/promise-proxy-mixin
*/

function tap(proxy, promise) {
  setProperties(proxy, {
    isFulfilled: false,
    isRejected: false
  });
  return promise.then(value => {
    if (!proxy.isDestroyed && !proxy.isDestroying) {
      setProperties(proxy, {
        content: value,
        isFulfilled: true
      });
    }
    return value;
  }, reason => {
    if (!proxy.isDestroyed && !proxy.isDestroying) {
      setProperties(proxy, {
        reason,
        isRejected: true
      });
    }
    throw reason;
  }, 'Ember: PromiseProxy');
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

const PromiseProxyMixin = Mixin.create({
  reason: null,
  isPending: computed('isSettled', function () {
    return !get(this, 'isSettled');
  }).readOnly(),
  isSettled: computed('isRejected', 'isFulfilled', function () {
    return get(this, 'isRejected') || get(this, 'isFulfilled');
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
  then: promiseAlias('then'),
  catch: promiseAlias('catch'),
  finally: promiseAlias('finally')
});
function promiseAlias(name) {
  return function (...args) {
    let promise = get(this, 'promise');

    // We need this cast because `Parameters` is deferred so that it is not
    // possible for TS to see it will always produce the right type. However,
    // since `AnyFn` has a rest type, it is allowed. See discussion on [this
    // issue](https://github.com/microsoft/TypeScript/issues/47615).
    return promise[name](...args);
  };
}

const promiseProxyMixin = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: PromiseProxyMixin
}, Symbol.toStringTag, { value: 'Module' }));

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ObjectProxy extends FrameworkObject {}
ObjectProxy.PrototypeMixin.reopen(ProxyMixin);

const proxy = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: ObjectProxy
}, Symbol.toStringTag, { value: 'Module' }));

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  CustomComponentManager,
  CustomHelperManager,
  CustomModifierManager,
  capabilityFlagsFrom,
  componentCapabilities,
  getComponentTemplate,
  getCustomTagFor,
  getInternalComponentManager,
  getInternalHelperManager,
  getInternalModifierManager,
  hasCapability,
  hasDestroyable,
  hasInternalComponentManager,
  hasInternalHelperManager,
  hasInternalModifierManager,
  hasValue,
  helperCapabilities,
  managerHasCapability,
  modifierCapabilities,
  setComponentManager,
  setComponentTemplate,
  setCustomTagFor,
  setHelperManager,
  setInternalComponentManager,
  setInternalHelperManager,
  setInternalModifierManager,
  setModifierManager
}, Symbol.toStringTag, { value: 'Module' }));

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ConcreteBounds,
  CurriedValue,
  CursorImpl,
  DOMChanges,
  DOMTreeConstruction,
  DynamicAttribute,
  DynamicScopeImpl,
  EMPTY_ARGS,
  EMPTY_NAMED,
  EMPTY_POSITIONAL,
  EnvironmentImpl,
  IDOMChanges: DOMChangesImpl,
  LowLevelVM,
  NewTreeBuilder,
  RehydrateTree,
  RemoteBlock,
  ResettableBlockImpl,
  SERIALIZATION_FIRST_NODE_STRING,
  ScopeImpl,
  SimpleDynamicAttribute,
  TEMPLATE_ONLY_COMPONENT_MANAGER,
  TemplateOnlyComponent: TemplateOnlyComponentDefinition,
  TemplateOnlyComponentManager,
  UpdatingVM,
  and,
  array,
  clear,
  clientBuilder,
  concat,
  createCapturedArgs,
  curry,
  destroy,
  dynamicAttribute,
  eq,
  fn,
  get: get$1,
  gt,
  gte,
  hash: hash$1,
  inTransaction,
  invokeHelper,
  isDestroyed,
  isDestroying,
  isSerializationFirstNode,
  isWhitespace,
  lt,
  lte,
  neq,
  normalizeProperty,
  not,
  on: on$2,
  or,
  registerDestructor,
  rehydrationBuilder,
  reifyArgs,
  reifyNamed,
  reifyPositional,
  renderComponent,
  renderMain,
  renderSync,
  resetDebuggerCallback,
  runtimeOptions,
  setDebuggerCallback,
  templateOnlyComponent
}, Symbol.toStringTag, { value: 'Module' }));

export { mutable as ArrayMutable, proxy$1 as ArrayProxy, index$1 as GlimmerManager, index as GlimmerRuntime, index$5 as InternalsMeta, index$6 as InternalsMetal, index$4 as InternalsRuntime, index$3 as InternalsUtils, index$2 as InternalsViews, promiseProxyMixin as ObjectPromiseProxyMixin, proxy as ObjectProxy, index$7 as RSVP };
