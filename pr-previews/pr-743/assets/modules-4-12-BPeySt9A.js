import { bm as configure, bn as _backburner, bo as _rsvpErrorQueue, bp as on, bq as getDispatchOverride, br as EventTarget, bs as Promise$1, bt as all, bu as allSettled, bv as asap, bw as async, bx as cast, by as RSVP, bz as defer, bA as denodeify, bB as filter, bC as hash, bD as hashSettled, bE as map, bF as off, bG as race, bH as reject, bI as resolve, bJ as rethrow, g as get, bK as set, bL as ASYNC_OBSERVERS, bM as ComputedDescriptor, bN as ComputedProperty, bO as DEBUG_INJECTION_FUNCTIONS, bP as Libraries, bQ as NAMESPACES, bR as NAMESPACES_BY_ID, bS as PROPERTY_DID_CHANGE, bT as PROXY_CONTENT, bU as SYNC_OBSERVERS, bV as TrackedDescriptor, bW as _getPath, bX as _getProp, bY as _setProp, bZ as activateObserver, b_ as addArrayObserver, b$ as addListener, c0 as addNamespace, c1 as addObserver, c2 as alias, c3 as arrayContentDidChange, c4 as arrayContentWillChange, c5 as autoComputed, c6 as beginPropertyChanges, c7 as cached, c8 as changeProperties, c9 as computed, ca as createCache, cb as defineDecorator, cc as defineProperty, cd as defineValue, ce as descriptorForDecorator, cf as descriptorForProperty, cg as endPropertyChanges, ch as expandProperties, ci as findNamespace, cj as findNamespaces, ck as flushAsyncObservers, q as getCachedValueFor, cl as getProperties, cm as getValue, cn as hasListeners, co as hasUnknownProperty, cp as inject, cq as isClassicDecorator, cr as isComputed, cs as isConst, ct as isElementDescriptor, cu as isSearchDisabled, cv as LIBRARIES, cw as makeComputedDecorator, cx as markObjectAsDirty, cy as nativeDescDecorator, cz as notifyPropertyChange, cA as objectAt, cB as on$1, cC as processAllNamespaces, cD as processNamespace, cE as removeArrayObserver, cF as removeListener, cG as removeNamespace, cH as removeObserver, cI as replace, cJ as replaceInNativeArray, cK as revalidateObservers, cL as sendEvent, cM as setClassicDecorator, cN as setSearchDisabled, cO as setProperties, cP as setUnprocessedMixins, cQ as tagForObject, cR as tagForProperty, n as tracked, cS as trySet, cT as MutableArray, cU as ENV, cV as context, cW as getENV, cX as getLookup, cY as global$1, cZ as setLookup, c_ as Meta, c$ as UNDEFINED, d0 as counters, d1 as meta, d2 as peekMeta, d3 as setMeta, d4 as ActionHandler, d5 as Comparable, d6 as ContainerProxyMixin, d7 as MutableEnumerable, d8 as RSVP$1, d9 as RegistryProxyMixin, da as TargetActionSupport, db as ProxyMixin, dc as contentFor, dd as Cache, de as GUID_KEY, df as ROOT, dg as canInvoke, dh as checkHasSuper, di as makeDictionary, dj as enumerableSymbol, dk as generateGuid, dl as getDebugName$1, dm as getName, v as guidFor, dn as intern, dp as isInternalSymbol, dq as isObject, dr as isProxy, ds as lookupDescriptor, dt as observerListenerMetaFor, du as setListeners, dv as setName, dw as setObservers, dx as setProxy, dy as setWithMandatorySetter, dz as setupMandatorySetter, dA as symbol, dB as teardownMandatorySetter, dC as toString, dD as uuid, dE as wrap, dF as ActionSupport, dG as ComponentLookup, dH as CoreView, dI as EventDispatcher, dJ as MUTABLE_CELL, dK as states, dL as addChildView, dM as clearElementView, dN as clearViewElement, dO as constructStyleDeprecationMessage, dP as getChildViews, dQ as getElementView, dR as getRootViews, dS as getViewBoundingClientRect, dT as getViewBounds, dU as getViewClientRects, dV as getViewElement, dW as getViewId, dX as isSimpleClick, dY as setElementView, dZ as setViewElement, d_ as CustomComponentManager, d$ as CustomHelperManager, e0 as CustomModifierManager, e1 as capabilityFlagsFrom, e2 as componentCapabilities, e3 as getComponentTemplate, e4 as getCustomTagFor, e5 as getInternalComponentManager, e6 as getInternalHelperManager, e7 as getInternalModifierManager, e8 as hasCapability, e9 as hasDestroyable, ea as hasInternalComponentManager, eb as hasInternalHelperManager, ec as hasInternalModifierManager, ed as hasValue, ee as helperCapabilities, ef as managerHasCapability, eg as modifierCapabilities, eh as setComponentManager, s as setComponentTemplate, ei as setCustomTagFor, ej as setHelperManager, ek as setInternalComponentManager, el as setInternalHelperManager, em as setInternalModifierManager, en as setModifierManager, eo as FALSE_REFERENCE, ep as NULL_REFERENCE, eq as REFERENCE, er as TRUE_REFERENCE, es as UNDEFINED_REFERENCE, et as childRefFor, eu as childRefFromParts, ev as createComputeRef, ew as createConstRef, ex as createDebugAliasRef, ey as createInvokableRef, ez as createIteratorItemRef, eA as createIteratorRef, eB as createPrimitiveRef, eC as createReadOnlyRef, eD as createUnboundRef, eE as isConstRef, eF as isInvokableRef, eG as isUpdatableRef, eH as updateRef, eI as valueForRef } from './main-Dx0IVUHb.js';
export { eJ as Application, eK as ApplicationNamespace, eL as Array, eM as ArrayProxy, eN as Component, eO as Controller, eP as Debug, eQ as EmberDestroyable, eR as EmberObject, eS as EnumerableMutable, eT as GlimmerComponent, eU as GlimmerRuntime, eV as GlimmerValidator, eW as Instrumentation, eR as Object, eX as ObjectCore, eY as ObjectEvented, eZ as ObjectObservable, e_ as ObjectPromiseProxyMixin, e$ as ObjectProxy, f0 as Owner, f1 as Runloop, f2 as Service, f3 as VERSION } from './main-Dx0IVUHb.js';
export { i as ObjectInternals } from './internals-fEY-7-KN.js';
export { i as GlimmerUtil } from './index-LmQCiZTx.js';

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
