import { ac as configure, ad as _backburner, ae as _rsvpErrorQueue, af as on, ag as getDispatchOverride, ah as EventTarget, ai as Promise$1, aj as all, ak as allSettled, al as asap, am as async, an as cast, ao as RSVP, ap as defer, aq as denodeify, ar as filter, as as hash, at as hashSettled, au as map, av as off, aw as race, ax as reject, ay as resolve, az as rethrow, g as get, aA as set, aB as ASYNC_OBSERVERS, aC as ComputedDescriptor, aD as ComputedProperty, aE as DEBUG_INJECTION_FUNCTIONS, aF as Libraries, aG as NAMESPACES, aH as NAMESPACES_BY_ID, aI as PROPERTY_DID_CHANGE, aJ as PROXY_CONTENT, aK as SYNC_OBSERVERS, aL as TrackedDescriptor, aM as _getPath, aN as _getProp, aO as _setProp, aP as activateObserver, aQ as addArrayObserver, aR as addListener, aS as addNamespace, aT as addObserver, aU as alias, aV as arrayContentDidChange, aW as arrayContentWillChange, aX as autoComputed, aY as beginPropertyChanges, aZ as cached, a_ as changeProperties, a$ as computed, b0 as createCache, b1 as defineDecorator, b2 as defineProperty, b3 as defineValue, b4 as descriptorForDecorator, b5 as descriptorForProperty, b6 as endPropertyChanges, b7 as expandProperties, b8 as findNamespace, b9 as findNamespaces, ba as flushAsyncObservers, y as getCachedValueFor, bb as getProperties, bc as getValue, bd as hasListeners, be as hasUnknownProperty, bf as inject, bg as isClassicDecorator, bh as isComputed, bi as isConst, bj as isElementDescriptor, bk as isSearchDisabled, bl as LIBRARIES, bm as makeComputedDecorator, bn as markObjectAsDirty, bo as nativeDescDecorator, bp as notifyPropertyChange, bq as objectAt, br as on$1, bs as processAllNamespaces, bt as processNamespace, bu as removeArrayObserver, bv as removeListener, bw as removeNamespace, bx as removeObserver, by as replace, bz as replaceInNativeArray, bA as revalidateObservers, bB as sendEvent, bC as setClassicDecorator, bD as setSearchDisabled, bE as setProperties, bF as setUnprocessedMixins, bG as tagForObject, bH as tagForProperty, t as tracked, bI as trySet, bJ as MutableArray, bK as ENV, bL as context, bM as getENV, bN as getLookup, bO as global$1, bP as setLookup, bQ as Meta, bR as UNDEFINED, bS as counters, bT as meta, bU as peekMeta, bV as setMeta, bW as ActionHandler, bX as Comparable, bY as ContainerProxyMixin, bZ as MutableEnumerable, b_ as RSVP$1, b$ as RegistryProxyMixin, c0 as TargetActionSupport, c1 as ProxyMixin, c2 as contentFor, c3 as Cache, c4 as GUID_KEY, c5 as ROOT, c6 as canInvoke, c7 as checkHasSuper, c8 as makeDictionary, c9 as enumerableSymbol, ca as generateGuid, cb as getDebugName$1, cc as getName, z as guidFor, cd as intern, ce as isInternalSymbol, cf as isObject, cg as isProxy, ch as lookupDescriptor, ci as observerListenerMetaFor, cj as setListeners, ck as setName, cl as setObservers, cm as setProxy, cn as setWithMandatorySetter, co as setupMandatorySetter, cp as symbol, cq as teardownMandatorySetter, cr as toString, cs as uuid, ct as wrap, cu as ActionSupport, cv as ComponentLookup, cw as CoreView, cx as EventDispatcher, cy as MUTABLE_CELL, cz as states, cA as addChildView, cB as clearElementView, cC as clearViewElement, cD as constructStyleDeprecationMessage, cE as getChildViews, cF as getElementView, cG as getRootViews, cH as getViewBoundingClientRect, cI as getViewBounds, cJ as getViewClientRects, cK as getViewElement, cL as getViewId, cM as isSimpleClick, cN as setElementView, cO as setViewElement, cP as CustomComponentManager, cQ as CustomHelperManager, cR as CustomModifierManager, cS as capabilityFlagsFrom, cT as componentCapabilities, cU as getComponentTemplate, cV as getCustomTagFor, cW as getInternalComponentManager, cX as getInternalHelperManager, cY as getInternalModifierManager, cZ as hasCapability, c_ as hasDestroyable, c$ as hasInternalComponentManager, d0 as hasInternalHelperManager, d1 as hasInternalModifierManager, d2 as hasValue, d3 as helperCapabilities, d4 as managerHasCapability, d5 as modifierCapabilities, d6 as setComponentManager, s as setComponentTemplate, d7 as setCustomTagFor, d8 as setHelperManager, d9 as setInternalComponentManager, da as setInternalHelperManager, db as setInternalModifierManager, dc as setModifierManager, dd as FALSE_REFERENCE, de as NULL_REFERENCE, df as REFERENCE, dg as TRUE_REFERENCE, dh as UNDEFINED_REFERENCE, di as childRefFor, dj as childRefFromParts, dk as createComputeRef, dl as createConstRef, dm as createDebugAliasRef, dn as createInvokableRef, dp as createIteratorItemRef, dq as createIteratorRef, dr as createPrimitiveRef, ds as createReadOnlyRef, dt as createUnboundRef, du as isConstRef, dv as isInvokableRef, dw as isUpdatableRef, dx as updateRef, dy as valueForRef } from './main-ChsN7yJb.js';
export { dz as Application, dA as ApplicationNamespace, dB as Array, dC as ArrayProxy, dD as Component, dE as Controller, dF as Debug, dG as EmberDestroyable, dH as EmberObject, dI as EnumerableMutable, dJ as GlimmerComponent, dK as GlimmerRuntime, dL as GlimmerValidator, dM as Instrumentation, dH as Object, dN as ObjectCore, dO as ObjectEvented, dP as ObjectObservable, dQ as ObjectPromiseProxyMixin, dR as ObjectProxy, dS as Owner, dT as Runloop, dU as Service, dV as VERSION } from './main-ChsN7yJb.js';
export { i as ObjectInternals } from './internals-CYvXEnc9.js';
export { i as GlimmerUtil } from './index-DwvbtW9I.js';

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
