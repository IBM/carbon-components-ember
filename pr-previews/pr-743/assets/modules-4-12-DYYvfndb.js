import { bG as configure, bH as _backburner, bI as _rsvpErrorQueue, bJ as on, bK as getDispatchOverride, bL as EventTarget, bM as Promise$1, bN as all, bO as allSettled, bP as asap, bQ as async, bR as cast, bS as RSVP, bT as defer, bU as denodeify, bV as filter, bW as hash, bX as hashSettled, bY as map, bZ as off, b_ as race, b$ as reject, c0 as resolve, c1 as rethrow, g as get, c2 as set, c3 as ASYNC_OBSERVERS, c4 as ComputedDescriptor, c5 as ComputedProperty, c6 as DEBUG_INJECTION_FUNCTIONS, c7 as Libraries, c8 as NAMESPACES, c9 as NAMESPACES_BY_ID, ca as PROPERTY_DID_CHANGE, cb as PROXY_CONTENT, cc as SYNC_OBSERVERS, cd as TrackedDescriptor, ce as _getPath, cf as _getProp, cg as _setProp, ch as activateObserver, ci as addArrayObserver, cj as addListener, ck as addNamespace, cl as addObserver, cm as alias, cn as arrayContentDidChange, co as arrayContentWillChange, cp as autoComputed, cq as beginPropertyChanges, cr as cached, cs as changeProperties, ct as computed, cu as createCache, cv as defineDecorator, cw as defineProperty, cx as defineValue, cy as descriptorForDecorator, cz as descriptorForProperty, cA as endPropertyChanges, cB as expandProperties, cC as findNamespace, cD as findNamespaces, cE as flushAsyncObservers, q as getCachedValueFor, cF as getProperties, cG as getValue, cH as hasListeners, cI as hasUnknownProperty, cJ as inject, cK as isClassicDecorator, cL as isComputed, cM as isConst, cN as isElementDescriptor, cO as isSearchDisabled, cP as LIBRARIES, cQ as makeComputedDecorator, cR as markObjectAsDirty, cS as nativeDescDecorator, cT as notifyPropertyChange, cU as objectAt, cV as on$1, cW as processAllNamespaces, cX as processNamespace, cY as removeArrayObserver, cZ as removeListener, c_ as removeNamespace, c$ as removeObserver, d0 as replace, d1 as replaceInNativeArray, d2 as revalidateObservers, d3 as sendEvent, d4 as setClassicDecorator, d5 as setSearchDisabled, d6 as setProperties, d7 as setUnprocessedMixins, d8 as tagForObject, d9 as tagForProperty, n as tracked, da as trySet, db as MutableArray, dc as ENV, dd as context, de as getENV, df as getLookup, dg as global$1, dh as setLookup, di as Meta, dj as UNDEFINED, dk as counters, dl as meta, dm as peekMeta, dn as setMeta, dp as ActionHandler, dq as Comparable, dr as ContainerProxyMixin, ds as MutableEnumerable, dt as RSVP$1, du as RegistryProxyMixin, dv as TargetActionSupport, dw as ProxyMixin, dx as contentFor, dy as Cache, dz as GUID_KEY, dA as ROOT, dB as canInvoke, dC as checkHasSuper, dD as makeDictionary, dE as enumerableSymbol, dF as generateGuid, dG as getDebugName$1, dH as getName, v as guidFor, dI as intern, dJ as isInternalSymbol, dK as isObject, dL as isProxy, dM as lookupDescriptor, dN as observerListenerMetaFor, dO as setListeners, dP as setName, dQ as setObservers, dR as setProxy, dS as setWithMandatorySetter, dT as setupMandatorySetter, dU as symbol, dV as teardownMandatorySetter, dW as toString, dX as uuid, dY as wrap, dZ as ActionSupport, d_ as ComponentLookup, d$ as CoreView, e0 as EventDispatcher, e1 as MUTABLE_CELL, e2 as states, e3 as addChildView, e4 as clearElementView, e5 as clearViewElement, e6 as constructStyleDeprecationMessage, e7 as getChildViews, e8 as getElementView, e9 as getRootViews, ea as getViewBoundingClientRect, eb as getViewBounds, ec as getViewClientRects, ed as getViewElement, ee as getViewId, ef as isSimpleClick, eg as setElementView, eh as setViewElement, ei as CustomComponentManager, ej as CustomHelperManager, ek as CustomModifierManager, el as capabilityFlagsFrom, em as componentCapabilities, en as getComponentTemplate, eo as getCustomTagFor, ep as getInternalComponentManager, eq as getInternalHelperManager, er as getInternalModifierManager, es as hasCapability, et as hasDestroyable, eu as hasInternalComponentManager, ev as hasInternalHelperManager, ew as hasInternalModifierManager, ex as hasValue, ey as helperCapabilities, ez as managerHasCapability, eA as modifierCapabilities, eB as setComponentManager, s as setComponentTemplate, eC as setCustomTagFor, eD as setHelperManager, eE as setInternalComponentManager, eF as setInternalHelperManager, eG as setInternalModifierManager, eH as setModifierManager, eI as FALSE_REFERENCE, eJ as NULL_REFERENCE, eK as REFERENCE, eL as TRUE_REFERENCE, eM as UNDEFINED_REFERENCE, eN as childRefFor, eO as childRefFromParts, eP as createComputeRef, eQ as createConstRef, eR as createDebugAliasRef, eS as createInvokableRef, eT as createIteratorItemRef, eU as createIteratorRef, eV as createPrimitiveRef, eW as createReadOnlyRef, eX as createUnboundRef, eY as isConstRef, eZ as isInvokableRef, e_ as isUpdatableRef, e$ as updateRef, f0 as valueForRef } from './main-BNcjraqC.js';
export { f1 as Application, f2 as ApplicationNamespace, f3 as Array, f4 as ArrayProxy, f5 as Component, f6 as Controller, f7 as Debug, f8 as EmberDestroyable, f9 as EmberObject, fa as EnumerableMutable, fb as GlimmerComponent, fc as GlimmerRuntime, fd as GlimmerValidator, fe as Instrumentation, f9 as Object, ff as ObjectCore, fg as ObjectEvented, fh as ObjectObservable, fi as ObjectPromiseProxyMixin, fj as ObjectProxy, fk as Owner, fl as Runloop, fm as Service, fn as VERSION } from './main-BNcjraqC.js';
export { i as ObjectInternals } from './internals-Guo-K-PC.js';
export { i as GlimmerUtil } from './index-AedK2z_V.js';

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
