import { cH as configure, cI as _backburner, cJ as _rsvpErrorQueue, cK as on, cL as getDispatchOverride, cM as EventTarget, cN as Promise$1, cO as all, cP as allSettled, cQ as asap, cR as async, cS as cast, cT as RSVP, cU as defer, cV as denodeify, cW as filter, cX as hash, cY as hashSettled, cZ as map, c_ as off, c$ as race, d0 as reject, d1 as resolve, d2 as rethrow, g as get, d3 as set, d4 as ASYNC_OBSERVERS, d5 as ComputedDescriptor, d6 as ComputedProperty, d7 as DEBUG_INJECTION_FUNCTIONS, d8 as Libraries, d9 as NAMESPACES, da as NAMESPACES_BY_ID, db as PROPERTY_DID_CHANGE, dc as PROXY_CONTENT, dd as SYNC_OBSERVERS, de as TrackedDescriptor, df as _getPath, dg as _getProp, dh as _setProp, di as activateObserver, dj as addArrayObserver, dk as addListener, dl as addNamespace, dm as addObserver, dn as alias, dp as arrayContentDidChange, dq as arrayContentWillChange, dr as autoComputed, ds as beginPropertyChanges, dt as cached, du as changeProperties, dv as computed, dw as createCache, dx as defineDecorator, dy as defineProperty, dz as defineValue, dA as descriptorForDecorator, dB as descriptorForProperty, dC as endPropertyChanges, dD as expandProperties, dE as findNamespace, dF as findNamespaces, dG as flushAsyncObservers, q as getCachedValueFor, dH as getProperties, dI as getValue, dJ as hasListeners, dK as hasUnknownProperty, dL as inject, dM as isClassicDecorator, dN as isComputed, dO as isConst, dP as isElementDescriptor, dQ as isSearchDisabled, dR as LIBRARIES, dS as makeComputedDecorator, dT as markObjectAsDirty, dU as nativeDescDecorator, dV as notifyPropertyChange, dW as objectAt, dX as on$1, dY as processAllNamespaces, dZ as processNamespace, d_ as removeArrayObserver, d$ as removeListener, e0 as removeNamespace, e1 as removeObserver, e2 as replace, e3 as replaceInNativeArray, e4 as revalidateObservers, e5 as sendEvent, e6 as setClassicDecorator, e7 as setSearchDisabled, e8 as setProperties, e9 as setUnprocessedMixins, ea as tagForObject, eb as tagForProperty, n as tracked, ec as trySet, ed as MutableArray, ee as ENV, ef as context, eg as getENV, eh as getLookup, ei as global$1, ej as setLookup, ek as Meta, el as UNDEFINED, em as counters, en as meta, eo as peekMeta, ep as setMeta, eq as ActionHandler, er as Comparable, es as ContainerProxyMixin, et as MutableEnumerable, eu as RSVP$1, ev as RegistryProxyMixin, ew as TargetActionSupport, ex as ProxyMixin, ey as contentFor, ez as Cache, eA as GUID_KEY, eB as ROOT, eC as canInvoke, eD as checkHasSuper, eE as makeDictionary, eF as enumerableSymbol, eG as generateGuid, eH as getDebugName$1, eI as getName, v as guidFor, eJ as intern, eK as isInternalSymbol, eL as isObject, eM as isProxy, eN as lookupDescriptor, eO as observerListenerMetaFor, eP as setListeners, eQ as setName, eR as setObservers, eS as setProxy, eT as setWithMandatorySetter, eU as setupMandatorySetter, eV as symbol, eW as teardownMandatorySetter, eX as toString, eY as uuid, eZ as wrap, e_ as ActionSupport, e$ as ComponentLookup, f0 as CoreView, f1 as EventDispatcher, f2 as MUTABLE_CELL, f3 as states, f4 as addChildView, f5 as clearElementView, f6 as clearViewElement, f7 as constructStyleDeprecationMessage, f8 as getChildViews, f9 as getElementView, fa as getRootViews, fb as getViewBoundingClientRect, fc as getViewBounds, fd as getViewClientRects, fe as getViewElement, ff as getViewId, fg as isSimpleClick, fh as setElementView, fi as setViewElement, fj as CustomComponentManager, fk as CustomHelperManager, fl as CustomModifierManager, fm as capabilityFlagsFrom, fn as componentCapabilities, fo as getComponentTemplate, fp as getCustomTagFor, fq as getInternalComponentManager, fr as getInternalHelperManager, fs as getInternalModifierManager, ft as hasCapability, fu as hasDestroyable, fv as hasInternalComponentManager, fw as hasInternalHelperManager, fx as hasInternalModifierManager, fy as hasValue, fz as helperCapabilities, fA as managerHasCapability, fB as modifierCapabilities, fC as setComponentManager, s as setComponentTemplate, fD as setCustomTagFor, fE as setHelperManager, fF as setInternalComponentManager, fG as setInternalHelperManager, fH as setInternalModifierManager, fI as setModifierManager, fJ as FALSE_REFERENCE, fK as NULL_REFERENCE, fL as REFERENCE, fM as TRUE_REFERENCE, fN as UNDEFINED_REFERENCE, fO as childRefFor, fP as childRefFromParts, fQ as createComputeRef, fR as createConstRef, fS as createDebugAliasRef, fT as createInvokableRef, fU as createIteratorItemRef, fV as createIteratorRef, fW as createPrimitiveRef, fX as createReadOnlyRef, fY as createUnboundRef, fZ as isConstRef, f_ as isInvokableRef, f$ as isUpdatableRef, g0 as updateRef, g1 as valueForRef } from './main-Bzuz0_Jc.js';
export { g2 as Application, g3 as ApplicationNamespace, g4 as Array, g5 as ArrayProxy, g6 as Component, g7 as Controller, g8 as Debug, g9 as EmberDestroyable, ga as EmberObject, gb as EnumerableMutable, gc as GlimmerComponent, gd as GlimmerRuntime, ge as GlimmerValidator, gf as Instrumentation, ga as Object, gg as ObjectCore, gh as ObjectEvented, gi as ObjectObservable, gj as ObjectPromiseProxyMixin, gk as ObjectProxy, gl as Owner, gm as Runloop, gn as Service, go as VERSION } from './main-Bzuz0_Jc.js';
export { i as ObjectInternals } from './internals-MljKUntC.js';
export { i as GlimmerUtil } from './index-DzUYxnqf.js';

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
