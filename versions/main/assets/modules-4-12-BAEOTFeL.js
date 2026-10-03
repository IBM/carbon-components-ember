import { a5 as configure, a6 as _backburner, a7 as _rsvpErrorQueue, a8 as on, a9 as getDispatchOverride, aa as EventTarget, ab as Promise$1, ac as all, ad as allSettled, ae as asap, af as async, ag as cast, ah as RSVP, ai as defer, aj as denodeify, ak as filter, al as hash, am as hashSettled, an as map, ao as off, ap as race, aq as reject, ar as resolve, as as rethrow, g as get, at as set, au as ASYNC_OBSERVERS, av as ComputedDescriptor, aw as ComputedProperty, ax as DEBUG_INJECTION_FUNCTIONS, ay as Libraries, az as NAMESPACES, aA as NAMESPACES_BY_ID, aB as PROPERTY_DID_CHANGE, aC as PROXY_CONTENT, aD as SYNC_OBSERVERS, aE as TrackedDescriptor, aF as _getPath, aG as _getProp, aH as _setProp, aI as activateObserver, aJ as addArrayObserver, aK as addListener, aL as addNamespace, aM as addObserver, aN as alias, aO as arrayContentDidChange, aP as arrayContentWillChange, aQ as autoComputed, aR as beginPropertyChanges, aS as cached, aT as changeProperties, aU as computed, aV as createCache, aW as defineDecorator, aX as defineProperty, aY as defineValue, aZ as descriptorForDecorator, a_ as descriptorForProperty, a$ as endPropertyChanges, b0 as expandProperties, b1 as findNamespace, b2 as findNamespaces, b3 as flushAsyncObservers, q as getCachedValueFor, b4 as getProperties, b5 as getValue, b6 as hasListeners, b7 as hasUnknownProperty, b8 as inject, b9 as isClassicDecorator, ba as isComputed, bb as isConst, bc as isElementDescriptor, bd as isSearchDisabled, be as LIBRARIES, bf as makeComputedDecorator, bg as markObjectAsDirty, bh as nativeDescDecorator, bi as notifyPropertyChange, bj as objectAt, bk as on$1, bl as processAllNamespaces, bm as processNamespace, bn as removeArrayObserver, bo as removeListener, bp as removeNamespace, bq as removeObserver, br as replace, bs as replaceInNativeArray, bt as revalidateObservers, bu as sendEvent, bv as setClassicDecorator, bw as setSearchDisabled, bx as setProperties, by as setUnprocessedMixins, bz as tagForObject, bA as tagForProperty, n as tracked, bB as trySet, bC as MutableArray, bD as ENV, bE as context, bF as getENV, bG as getLookup, bH as global$1, bI as setLookup, bJ as Meta, bK as UNDEFINED, bL as counters, bM as meta, bN as peekMeta, bO as setMeta, bP as ActionHandler, bQ as Comparable, bR as ContainerProxyMixin, bS as MutableEnumerable, bT as RSVP$1, bU as RegistryProxyMixin, bV as TargetActionSupport, bW as ProxyMixin, bX as contentFor, bY as Cache, bZ as GUID_KEY, b_ as ROOT, b$ as canInvoke, c0 as checkHasSuper, c1 as makeDictionary, c2 as enumerableSymbol, c3 as generateGuid, c4 as getDebugName$1, c5 as getName, v as guidFor, c6 as intern, c7 as isInternalSymbol, c8 as isObject, c9 as isProxy, ca as lookupDescriptor, cb as observerListenerMetaFor, cc as setListeners, cd as setName, ce as setObservers, cf as setProxy, cg as setWithMandatorySetter, ch as setupMandatorySetter, ci as symbol, cj as teardownMandatorySetter, ck as toString, cl as uuid, cm as wrap, cn as ActionSupport, co as ComponentLookup, cp as CoreView, cq as EventDispatcher, cr as MUTABLE_CELL, cs as states, ct as addChildView, cu as clearElementView, cv as clearViewElement, cw as constructStyleDeprecationMessage, cx as getChildViews, cy as getElementView, cz as getRootViews, cA as getViewBoundingClientRect, cB as getViewBounds, cC as getViewClientRects, cD as getViewElement, cE as getViewId, cF as isSimpleClick, cG as setElementView, cH as setViewElement, cI as CustomComponentManager, cJ as CustomHelperManager, cK as CustomModifierManager, cL as capabilityFlagsFrom, cM as componentCapabilities, cN as getComponentTemplate, cO as getCustomTagFor, cP as getInternalComponentManager, cQ as getInternalHelperManager, cR as getInternalModifierManager, cS as hasCapability, cT as hasDestroyable, cU as hasInternalComponentManager, cV as hasInternalHelperManager, cW as hasInternalModifierManager, cX as hasValue, cY as helperCapabilities, cZ as managerHasCapability, c_ as modifierCapabilities, c$ as setComponentManager, s as setComponentTemplate, d0 as setCustomTagFor, d1 as setHelperManager, d2 as setInternalComponentManager, d3 as setInternalHelperManager, d4 as setInternalModifierManager, d5 as setModifierManager, d6 as FALSE_REFERENCE, d7 as NULL_REFERENCE, d8 as REFERENCE, d9 as TRUE_REFERENCE, da as UNDEFINED_REFERENCE, db as childRefFor, dc as childRefFromParts, dd as createComputeRef, de as createConstRef, df as createDebugAliasRef, dg as createInvokableRef, dh as createIteratorItemRef, di as createIteratorRef, dj as createPrimitiveRef, dk as createReadOnlyRef, dl as createUnboundRef, dm as isConstRef, dn as isInvokableRef, dp as isUpdatableRef, dq as updateRef, dr as valueForRef } from './main-tIU61IBE.js';
export { ds as Application, dt as ApplicationNamespace, du as Array, dv as ArrayProxy, dw as Component, dx as Controller, dy as Debug, dz as EmberDestroyable, dA as EmberObject, dB as EnumerableMutable, dC as GlimmerComponent, dD as GlimmerRuntime, dE as GlimmerValidator, dF as Instrumentation, dA as Object, dG as ObjectCore, dH as ObjectEvented, dI as ObjectObservable, dJ as ObjectPromiseProxyMixin, dK as ObjectProxy, dL as Owner, dM as Runloop, dN as Service, dO as VERSION } from './main-tIU61IBE.js';
export { i as ObjectInternals } from './internals-CoQbY-r5.js';
export { i as GlimmerUtil } from './index-DbEfLMc1.js';

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
