import { af as configure, ag as _backburner, ah as _rsvpErrorQueue, ai as on, aj as getDispatchOverride, ak as EventTarget, al as Promise$1, am as all, an as allSettled, ao as asap, ap as async, aq as cast, ar as RSVP, as as defer, at as denodeify, au as filter, av as hash, aw as hashSettled, ax as map, ay as off, az as race, aA as reject, aB as resolve, aC as rethrow, g as get, aD as set, aE as ASYNC_OBSERVERS, aF as ComputedDescriptor, aG as ComputedProperty, aH as DEBUG_INJECTION_FUNCTIONS, aI as Libraries, aJ as NAMESPACES, aK as NAMESPACES_BY_ID, aL as PROPERTY_DID_CHANGE, aM as PROXY_CONTENT, aN as SYNC_OBSERVERS, aO as TrackedDescriptor, aP as _getPath, aQ as _getProp, aR as _setProp, aS as activateObserver, aT as addArrayObserver, aU as addListener, aV as addNamespace, aW as addObserver, aX as alias, aY as arrayContentDidChange, aZ as arrayContentWillChange, a_ as autoComputed, a$ as beginPropertyChanges, b0 as cached, b1 as changeProperties, b2 as computed, b3 as createCache, b4 as defineDecorator, b5 as defineProperty, b6 as defineValue, b7 as descriptorForDecorator, b8 as descriptorForProperty, b9 as endPropertyChanges, ba as expandProperties, bb as findNamespace, bc as findNamespaces, bd as flushAsyncObservers, q as getCachedValueFor, be as getProperties, bf as getValue, bg as hasListeners, bh as hasUnknownProperty, bi as inject, bj as isClassicDecorator, bk as isComputed, bl as isConst, bm as isElementDescriptor, bn as isSearchDisabled, bo as LIBRARIES, bp as makeComputedDecorator, bq as markObjectAsDirty, br as nativeDescDecorator, bs as notifyPropertyChange, bt as objectAt, bu as on$1, bv as processAllNamespaces, bw as processNamespace, bx as removeArrayObserver, by as removeListener, bz as removeNamespace, bA as removeObserver, bB as replace, bC as replaceInNativeArray, bD as revalidateObservers, bE as sendEvent, bF as setClassicDecorator, bG as setSearchDisabled, bH as setProperties, bI as setUnprocessedMixins, bJ as tagForObject, bK as tagForProperty, n as tracked, bL as trySet, bM as MutableArray, bN as ENV, bO as context, bP as getENV, bQ as getLookup, bR as global$1, bS as setLookup, bT as Meta, bU as UNDEFINED, bV as counters, bW as meta, bX as peekMeta, bY as setMeta, bZ as ActionHandler, b_ as Comparable, b$ as ContainerProxyMixin, c0 as MutableEnumerable, c1 as RSVP$1, c2 as RegistryProxyMixin, c3 as TargetActionSupport, c4 as ProxyMixin, c5 as contentFor, c6 as Cache, c7 as GUID_KEY, c8 as ROOT, c9 as canInvoke, ca as checkHasSuper, cb as makeDictionary, cc as enumerableSymbol, cd as generateGuid, ce as getDebugName$1, cf as getName, v as guidFor, cg as intern, ch as isInternalSymbol, ci as isObject, cj as isProxy, ck as lookupDescriptor, cl as observerListenerMetaFor, cm as setListeners, cn as setName, co as setObservers, cp as setProxy, cq as setWithMandatorySetter, cr as setupMandatorySetter, cs as symbol, ct as teardownMandatorySetter, cu as toString, cv as uuid, cw as wrap, cx as ActionSupport, cy as ComponentLookup, cz as CoreView, cA as EventDispatcher, cB as MUTABLE_CELL, cC as states, cD as addChildView, cE as clearElementView, cF as clearViewElement, cG as constructStyleDeprecationMessage, cH as getChildViews, cI as getElementView, cJ as getRootViews, cK as getViewBoundingClientRect, cL as getViewBounds, cM as getViewClientRects, cN as getViewElement, cO as getViewId, cP as isSimpleClick, cQ as setElementView, cR as setViewElement, cS as CustomComponentManager, cT as CustomHelperManager, cU as CustomModifierManager, cV as capabilityFlagsFrom, cW as componentCapabilities, cX as getComponentTemplate, cY as getCustomTagFor, cZ as getInternalComponentManager, c_ as getInternalHelperManager, c$ as getInternalModifierManager, d0 as hasCapability, d1 as hasDestroyable, d2 as hasInternalComponentManager, d3 as hasInternalHelperManager, d4 as hasInternalModifierManager, d5 as hasValue, d6 as helperCapabilities, d7 as managerHasCapability, d8 as modifierCapabilities, d9 as setComponentManager, s as setComponentTemplate, da as setCustomTagFor, db as setHelperManager, dc as setInternalComponentManager, dd as setInternalHelperManager, de as setInternalModifierManager, df as setModifierManager, dg as FALSE_REFERENCE, dh as NULL_REFERENCE, di as REFERENCE, dj as TRUE_REFERENCE, dk as UNDEFINED_REFERENCE, dl as childRefFor, dm as childRefFromParts, dn as createComputeRef, dp as createConstRef, dq as createDebugAliasRef, dr as createInvokableRef, ds as createIteratorItemRef, dt as createIteratorRef, du as createPrimitiveRef, dv as createReadOnlyRef, dw as createUnboundRef, dx as isConstRef, dy as isInvokableRef, dz as isUpdatableRef, dA as updateRef, dB as valueForRef } from './main-B9pK-aqg.js';
export { dC as Application, dD as ApplicationNamespace, dE as Array, dF as ArrayProxy, dG as Component, dH as Controller, dI as Debug, dJ as EmberDestroyable, dK as EmberObject, dL as EnumerableMutable, dM as GlimmerComponent, dN as GlimmerRuntime, dO as GlimmerValidator, dP as Instrumentation, dK as Object, dQ as ObjectCore, dR as ObjectEvented, dS as ObjectObservable, dT as ObjectPromiseProxyMixin, dU as ObjectProxy, dV as Owner, dW as Runloop, dX as Service, dY as VERSION } from './main-B9pK-aqg.js';
export { i as ObjectInternals } from './internals-DuAOYQ7u.js';
export { i as GlimmerUtil } from './index-zDpCnuUP.js';

configure('async', (callback, promise) => {
  _backburner.schedule('actions', null, callback, promise);
});
configure('after', cb => {
  _backburner.schedule(_rsvpErrorQueue, null, cb);
});
on('error', onerrorDefault);
function onerrorDefault(reason) {
  let error = errorFor(reason);
  if (error) {
    let overrideDispatch = getDispatchOverride();
    if (overrideDispatch) {
      overrideDispatch(error);
    } else {
      throw error;
    }
  }
}
function errorFor(reason) {
  if (!reason) return;
  let withErrorThrown = reason;
  if (withErrorThrown.errorThrown) {
    return unwrapErrorThrown(withErrorThrown);
  }
  let withName = reason;
  if (withName.name === 'UnrecognizedURLError') {
    return;
  }
  if (reason.name === 'TransitionAborted') {
    return;
  }
  return reason;
}
function unwrapErrorThrown(reason) {
  let error = reason.errorThrown;
  if (typeof error === 'string') {
    error = new Error(error);
  }
  Object.defineProperty(error, '__reason_with_error_thrown__', {
    value: reason,
    enumerable: false
  });
  return error;
}

const index$8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  EventTarget,
  Promise: Promise$1,
  all,
  allSettled,
  asap,
  async,
  cast,
  configure,
  default: RSVP,
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

const index$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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

const index$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ENV,
  context,
  getENV,
  getLookup,
  global: global$1,
  setLookup
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

const index$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ActionHandler,
  Comparable,
  ContainerProxyMixin,
  MutableEnumerable,
  RSVP: RSVP$1,
  RegistryProxyMixin,
  TargetActionSupport,
  _ProxyMixin: ProxyMixin,
  _contentFor: contentFor,
  onerrorDefault
}, Symbol.toStringTag, { value: 'Module' }));

const index$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Cache,
  GUID_KEY,
  ROOT,
  canInvoke,
  checkHasSuper,
  dictionary: makeDictionary,
  enumerableSymbol,
  generateGuid,
  getDebugName: getDebugName$1,
  getName,
  guidFor,
  intern,
  isInternalSymbol,
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
  symbol,
  teardownMandatorySetter,
  toString,
  uuid,
  wrap
}, Symbol.toStringTag, { value: 'Module' }));

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ActionSupport,
  ComponentLookup,
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
  FALSE_REFERENCE,
  NULL_REFERENCE,
  REFERENCE,
  TRUE_REFERENCE,
  UNDEFINED_REFERENCE,
  childRefFor,
  childRefFromParts,
  createComputeRef,
  createConstRef,
  createDebugAliasRef,
  createInvokableRef,
  createIteratorItemRef,
  createIteratorRef,
  createPrimitiveRef,
  createReadOnlyRef,
  createUnboundRef,
  isConstRef,
  isInvokableRef,
  isUpdatableRef,
  updateRef,
  valueForRef
}, Symbol.toStringTag, { value: 'Module' }));

export { mutable as ArrayMutable, index$1 as GlimmerManager, index as GlimmerReference, index$6 as InternalsEnvironment, index$5 as InternalsMeta, index$7 as InternalsMetal, index$4 as InternalsRuntime, index$3 as InternalsUtils, index$2 as InternalsViews, index$8 as RSVP };
