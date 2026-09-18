import { cI as configure, cJ as _backburner, cK as _rsvpErrorQueue, cL as on, cM as getDispatchOverride, cN as EventTarget, cO as Promise$1, cP as all, cQ as allSettled, cR as asap, cS as async, cT as cast, cU as RSVP, cV as defer, cW as denodeify, cX as filter, cY as hash, cZ as hashSettled, c_ as map, c$ as off, d0 as race, d1 as reject, d2 as resolve, d3 as rethrow, g as get, d4 as set, d5 as ASYNC_OBSERVERS, d6 as ComputedDescriptor, d7 as ComputedProperty, d8 as DEBUG_INJECTION_FUNCTIONS, d9 as Libraries, da as NAMESPACES, db as NAMESPACES_BY_ID, dc as PROPERTY_DID_CHANGE, dd as PROXY_CONTENT, de as SYNC_OBSERVERS, df as TrackedDescriptor, dg as _getPath, dh as _getProp, di as _setProp, dj as activateObserver, dk as addArrayObserver, dl as addListener, dm as addNamespace, dn as addObserver, dp as alias, dq as arrayContentDidChange, dr as arrayContentWillChange, ds as autoComputed, dt as beginPropertyChanges, du as cached, dv as changeProperties, dw as computed, dx as createCache, dy as defineDecorator, dz as defineProperty, dA as defineValue, dB as descriptorForDecorator, dC as descriptorForProperty, dD as endPropertyChanges, dE as expandProperties, dF as findNamespace, dG as findNamespaces, dH as flushAsyncObservers, q as getCachedValueFor, dI as getProperties, dJ as getValue, dK as hasListeners, dL as hasUnknownProperty, dM as inject, dN as isClassicDecorator, dO as isComputed, dP as isConst, dQ as isElementDescriptor, dR as isSearchDisabled, dS as LIBRARIES, dT as makeComputedDecorator, dU as markObjectAsDirty, dV as nativeDescDecorator, dW as notifyPropertyChange, dX as objectAt, dY as on$1, dZ as processAllNamespaces, d_ as processNamespace, d$ as removeArrayObserver, e0 as removeListener, e1 as removeNamespace, e2 as removeObserver, e3 as replace, e4 as replaceInNativeArray, e5 as revalidateObservers, e6 as sendEvent, e7 as setClassicDecorator, e8 as setSearchDisabled, e9 as setProperties, ea as setUnprocessedMixins, eb as tagForObject, ec as tagForProperty, n as tracked, ed as trySet, ee as MutableArray, ef as ENV, eg as context, eh as getENV, ei as getLookup, ej as global$1, ek as setLookup, el as Meta, em as UNDEFINED, en as counters, eo as meta, ep as peekMeta, eq as setMeta, er as ActionHandler, es as Comparable, et as ContainerProxyMixin, eu as MutableEnumerable, ev as RSVP$1, ew as RegistryProxyMixin, ex as TargetActionSupport, ey as ProxyMixin, ez as contentFor, eA as Cache, eB as GUID_KEY, eC as ROOT, eD as canInvoke, eE as checkHasSuper, eF as makeDictionary, eG as enumerableSymbol, eH as generateGuid, eI as getDebugName$1, eJ as getName, v as guidFor, eK as intern, eL as isInternalSymbol, eM as isObject, eN as isProxy, eO as lookupDescriptor, eP as observerListenerMetaFor, eQ as setListeners, eR as setName, eS as setObservers, eT as setProxy, eU as setWithMandatorySetter, eV as setupMandatorySetter, eW as symbol, eX as teardownMandatorySetter, eY as toString, eZ as uuid, e_ as wrap, e$ as ActionSupport, f0 as ComponentLookup, f1 as CoreView, f2 as EventDispatcher, f3 as MUTABLE_CELL, f4 as states, f5 as addChildView, f6 as clearElementView, f7 as clearViewElement, f8 as constructStyleDeprecationMessage, f9 as getChildViews, fa as getElementView, fb as getRootViews, fc as getViewBoundingClientRect, fd as getViewBounds, fe as getViewClientRects, ff as getViewElement, fg as getViewId, fh as isSimpleClick, fi as setElementView, fj as setViewElement, fk as CustomComponentManager, fl as CustomHelperManager, fm as CustomModifierManager, fn as capabilityFlagsFrom, fo as componentCapabilities, fp as getComponentTemplate, fq as getCustomTagFor, fr as getInternalComponentManager, fs as getInternalHelperManager, ft as getInternalModifierManager, fu as hasCapability, fv as hasDestroyable, fw as hasInternalComponentManager, fx as hasInternalHelperManager, fy as hasInternalModifierManager, fz as hasValue, fA as helperCapabilities, fB as managerHasCapability, fC as modifierCapabilities, fD as setComponentManager, s as setComponentTemplate, fE as setCustomTagFor, fF as setHelperManager, fG as setInternalComponentManager, fH as setInternalHelperManager, fI as setInternalModifierManager, fJ as setModifierManager, fK as FALSE_REFERENCE, fL as NULL_REFERENCE, fM as REFERENCE, fN as TRUE_REFERENCE, fO as UNDEFINED_REFERENCE, fP as childRefFor, fQ as childRefFromParts, fR as createComputeRef, fS as createConstRef, fT as createDebugAliasRef, fU as createInvokableRef, fV as createIteratorItemRef, fW as createIteratorRef, fX as createPrimitiveRef, fY as createReadOnlyRef, fZ as createUnboundRef, f_ as isConstRef, f$ as isInvokableRef, g0 as isUpdatableRef, g1 as updateRef, g2 as valueForRef } from './main-DmwxfoXg.js';
export { g3 as Application, g4 as ApplicationNamespace, g5 as Array, g6 as ArrayProxy, g7 as Component, g8 as Controller, g9 as Debug, ga as EmberDestroyable, gb as EmberObject, gc as EnumerableMutable, gd as GlimmerComponent, ge as GlimmerRuntime, gf as GlimmerValidator, gg as Instrumentation, gb as Object, gh as ObjectCore, gi as ObjectEvented, gj as ObjectObservable, gk as ObjectPromiseProxyMixin, gl as ObjectProxy, gm as Owner, gn as Runloop, go as Service, gp as VERSION } from './main-DmwxfoXg.js';
export { i as ObjectInternals } from './internals-Bvbh4pW_.js';
export { i as GlimmerUtil } from './index-BmS_mZ_-.js';

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
