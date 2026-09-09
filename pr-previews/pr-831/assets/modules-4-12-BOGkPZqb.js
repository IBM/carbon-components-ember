import { bS as configure, bT as _backburner, bU as _rsvpErrorQueue, bV as on, bW as getDispatchOverride, bX as EventTarget, bY as Promise$1, bZ as all, b_ as allSettled, b$ as asap, c0 as async, c1 as cast, c2 as RSVP, c3 as defer, c4 as denodeify, c5 as filter, c6 as hash, c7 as hashSettled, c8 as map, c9 as off, ca as race, cb as reject, cc as resolve, cd as rethrow, g as get, ce as set, cf as ASYNC_OBSERVERS, cg as ComputedDescriptor, ch as ComputedProperty, ci as DEBUG_INJECTION_FUNCTIONS, cj as Libraries, ck as NAMESPACES, cl as NAMESPACES_BY_ID, cm as PROPERTY_DID_CHANGE, cn as PROXY_CONTENT, co as SYNC_OBSERVERS, cp as TrackedDescriptor, cq as _getPath, cr as _getProp, cs as _setProp, ct as activateObserver, cu as addArrayObserver, cv as addListener, cw as addNamespace, cx as addObserver, cy as alias, cz as arrayContentDidChange, cA as arrayContentWillChange, cB as autoComputed, cC as beginPropertyChanges, cD as cached, cE as changeProperties, cF as computed, cG as createCache, cH as defineDecorator, cI as defineProperty, cJ as defineValue, cK as descriptorForDecorator, cL as descriptorForProperty, cM as endPropertyChanges, cN as expandProperties, cO as findNamespace, cP as findNamespaces, cQ as flushAsyncObservers, q as getCachedValueFor, cR as getProperties, cS as getValue, cT as hasListeners, cU as hasUnknownProperty, cV as inject, cW as isClassicDecorator, cX as isComputed, cY as isConst, cZ as isElementDescriptor, c_ as isSearchDisabled, c$ as LIBRARIES, d0 as makeComputedDecorator, d1 as markObjectAsDirty, d2 as nativeDescDecorator, d3 as notifyPropertyChange, d4 as objectAt, d5 as on$1, d6 as processAllNamespaces, d7 as processNamespace, d8 as removeArrayObserver, d9 as removeListener, da as removeNamespace, db as removeObserver, dc as replace, dd as replaceInNativeArray, de as revalidateObservers, df as sendEvent, dg as setClassicDecorator, dh as setSearchDisabled, di as setProperties, dj as setUnprocessedMixins, dk as tagForObject, dl as tagForProperty, n as tracked, dm as trySet, dn as MutableArray, dp as ENV, dq as context, dr as getENV, ds as getLookup, dt as global$1, du as setLookup, dv as Meta, dw as UNDEFINED, dx as counters, dy as meta, dz as peekMeta, dA as setMeta, dB as ActionHandler, dC as Comparable, dD as ContainerProxyMixin, dE as MutableEnumerable, dF as RSVP$1, dG as RegistryProxyMixin, dH as TargetActionSupport, dI as ProxyMixin, dJ as contentFor, dK as Cache, dL as GUID_KEY, dM as ROOT, dN as canInvoke, dO as checkHasSuper, dP as makeDictionary, dQ as enumerableSymbol, dR as generateGuid, dS as getDebugName$1, dT as getName, v as guidFor, dU as intern, dV as isInternalSymbol, dW as isObject, dX as isProxy, dY as lookupDescriptor, dZ as observerListenerMetaFor, d_ as setListeners, d$ as setName, e0 as setObservers, e1 as setProxy, e2 as setWithMandatorySetter, e3 as setupMandatorySetter, e4 as symbol, e5 as teardownMandatorySetter, e6 as toString, e7 as uuid, e8 as wrap, e9 as ActionSupport, ea as ComponentLookup, eb as CoreView, ec as EventDispatcher, ed as MUTABLE_CELL, ee as states, ef as addChildView, eg as clearElementView, eh as clearViewElement, ei as constructStyleDeprecationMessage, ej as getChildViews, ek as getElementView, el as getRootViews, em as getViewBoundingClientRect, en as getViewBounds, eo as getViewClientRects, ep as getViewElement, eq as getViewId, er as isSimpleClick, es as setElementView, et as setViewElement, eu as CustomComponentManager, ev as CustomHelperManager, ew as CustomModifierManager, ex as capabilityFlagsFrom, ey as componentCapabilities, ez as getComponentTemplate, eA as getCustomTagFor, eB as getInternalComponentManager, eC as getInternalHelperManager, eD as getInternalModifierManager, eE as hasCapability, eF as hasDestroyable, eG as hasInternalComponentManager, eH as hasInternalHelperManager, eI as hasInternalModifierManager, eJ as hasValue, eK as helperCapabilities, eL as managerHasCapability, eM as modifierCapabilities, eN as setComponentManager, s as setComponentTemplate, eO as setCustomTagFor, eP as setHelperManager, eQ as setInternalComponentManager, eR as setInternalHelperManager, eS as setInternalModifierManager, eT as setModifierManager, eU as FALSE_REFERENCE, eV as NULL_REFERENCE, eW as REFERENCE, eX as TRUE_REFERENCE, eY as UNDEFINED_REFERENCE, eZ as childRefFor, e_ as childRefFromParts, e$ as createComputeRef, f0 as createConstRef, f1 as createDebugAliasRef, f2 as createInvokableRef, f3 as createIteratorItemRef, f4 as createIteratorRef, f5 as createPrimitiveRef, f6 as createReadOnlyRef, f7 as createUnboundRef, f8 as isConstRef, f9 as isInvokableRef, fa as isUpdatableRef, fb as updateRef, fc as valueForRef } from './main-CaHpSJQI.js';
export { fd as Application, fe as ApplicationNamespace, ff as Array, fg as ArrayProxy, fh as Component, fi as Controller, fj as Debug, fk as EmberDestroyable, fl as EmberObject, fm as EnumerableMutable, fn as GlimmerComponent, fo as GlimmerRuntime, fp as GlimmerValidator, fq as Instrumentation, fl as Object, fr as ObjectCore, fs as ObjectEvented, ft as ObjectObservable, fu as ObjectPromiseProxyMixin, fv as ObjectProxy, fw as Owner, fx as Runloop, fy as Service, fz as VERSION } from './main-CaHpSJQI.js';
export { i as ObjectInternals } from './internals-Ta-nvcW3.js';
export { i as GlimmerUtil } from './index-CTpzlRwH.js';

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
