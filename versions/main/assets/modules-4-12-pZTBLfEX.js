import { cG as configure, cH as _backburner, cI as _rsvpErrorQueue, cJ as on, cK as getDispatchOverride, cL as EventTarget, cM as Promise$1, cN as all, cO as allSettled, cP as asap, cQ as async, cR as cast, cS as RSVP, cT as defer, cU as denodeify, cV as filter, cW as hash, cX as hashSettled, cY as map, cZ as off, c_ as race, c$ as reject, d0 as resolve, d1 as rethrow, g as get, d2 as set, d3 as ASYNC_OBSERVERS, d4 as ComputedDescriptor, d5 as ComputedProperty, d6 as DEBUG_INJECTION_FUNCTIONS, d7 as Libraries, d8 as NAMESPACES, d9 as NAMESPACES_BY_ID, da as PROPERTY_DID_CHANGE, db as PROXY_CONTENT, dc as SYNC_OBSERVERS, dd as TrackedDescriptor, de as _getPath, df as _getProp, dg as _setProp, dh as activateObserver, di as addArrayObserver, dj as addListener, dk as addNamespace, dl as addObserver, dm as alias, dn as arrayContentDidChange, dp as arrayContentWillChange, dq as autoComputed, dr as beginPropertyChanges, ds as cached, dt as changeProperties, du as computed, dv as createCache, dw as defineDecorator, dx as defineProperty, dy as defineValue, dz as descriptorForDecorator, dA as descriptorForProperty, dB as endPropertyChanges, dC as expandProperties, dD as findNamespace, dE as findNamespaces, dF as flushAsyncObservers, q as getCachedValueFor, dG as getProperties, dH as getValue, dI as hasListeners, dJ as hasUnknownProperty, dK as inject, dL as isClassicDecorator, dM as isComputed, dN as isConst, dO as isElementDescriptor, dP as isSearchDisabled, dQ as LIBRARIES, dR as makeComputedDecorator, dS as markObjectAsDirty, dT as nativeDescDecorator, dU as notifyPropertyChange, dV as objectAt, dW as on$1, dX as processAllNamespaces, dY as processNamespace, dZ as removeArrayObserver, d_ as removeListener, d$ as removeNamespace, e0 as removeObserver, e1 as replace, e2 as replaceInNativeArray, e3 as revalidateObservers, e4 as sendEvent, e5 as setClassicDecorator, e6 as setSearchDisabled, e7 as setProperties, e8 as setUnprocessedMixins, e9 as tagForObject, ea as tagForProperty, n as tracked, eb as trySet, ec as MutableArray, ed as ENV, ee as context, ef as getENV, eg as getLookup, eh as global$1, ei as setLookup, ej as Meta, ek as UNDEFINED, el as counters, em as meta, en as peekMeta, eo as setMeta, ep as ActionHandler, eq as Comparable, er as ContainerProxyMixin, es as MutableEnumerable, et as RSVP$1, eu as RegistryProxyMixin, ev as TargetActionSupport, ew as ProxyMixin, ex as contentFor, ey as Cache, ez as GUID_KEY, eA as ROOT, eB as canInvoke, eC as checkHasSuper, eD as makeDictionary, eE as enumerableSymbol, eF as generateGuid, eG as getDebugName$1, eH as getName, v as guidFor, eI as intern, eJ as isInternalSymbol, eK as isObject, eL as isProxy, eM as lookupDescriptor, eN as observerListenerMetaFor, eO as setListeners, eP as setName, eQ as setObservers, eR as setProxy, eS as setWithMandatorySetter, eT as setupMandatorySetter, eU as symbol, eV as teardownMandatorySetter, eW as toString, eX as uuid, eY as wrap, eZ as ActionSupport, e_ as ComponentLookup, e$ as CoreView, f0 as EventDispatcher, f1 as MUTABLE_CELL, f2 as states, f3 as addChildView, f4 as clearElementView, f5 as clearViewElement, f6 as constructStyleDeprecationMessage, f7 as getChildViews, f8 as getElementView, f9 as getRootViews, fa as getViewBoundingClientRect, fb as getViewBounds, fc as getViewClientRects, fd as getViewElement, fe as getViewId, ff as isSimpleClick, fg as setElementView, fh as setViewElement, fi as CustomComponentManager, fj as CustomHelperManager, fk as CustomModifierManager, fl as capabilityFlagsFrom, fm as componentCapabilities, fn as getComponentTemplate, fo as getCustomTagFor, fp as getInternalComponentManager, fq as getInternalHelperManager, fr as getInternalModifierManager, fs as hasCapability, ft as hasDestroyable, fu as hasInternalComponentManager, fv as hasInternalHelperManager, fw as hasInternalModifierManager, fx as hasValue, fy as helperCapabilities, fz as managerHasCapability, fA as modifierCapabilities, fB as setComponentManager, s as setComponentTemplate, fC as setCustomTagFor, fD as setHelperManager, fE as setInternalComponentManager, fF as setInternalHelperManager, fG as setInternalModifierManager, fH as setModifierManager, fI as FALSE_REFERENCE, fJ as NULL_REFERENCE, fK as REFERENCE, fL as TRUE_REFERENCE, fM as UNDEFINED_REFERENCE, fN as childRefFor, fO as childRefFromParts, fP as createComputeRef, fQ as createConstRef, fR as createDebugAliasRef, fS as createInvokableRef, fT as createIteratorItemRef, fU as createIteratorRef, fV as createPrimitiveRef, fW as createReadOnlyRef, fX as createUnboundRef, fY as isConstRef, fZ as isInvokableRef, f_ as isUpdatableRef, f$ as updateRef, g0 as valueForRef } from './main-D8I16Byr.js';
export { g1 as Application, g2 as ApplicationNamespace, g3 as Array, g4 as ArrayProxy, g5 as Component, g6 as Controller, g7 as Debug, g8 as EmberDestroyable, g9 as EmberObject, ga as EnumerableMutable, gb as GlimmerComponent, gc as GlimmerRuntime, gd as GlimmerValidator, ge as Instrumentation, g9 as Object, gf as ObjectCore, gg as ObjectEvented, gh as ObjectObservable, gi as ObjectPromiseProxyMixin, gj as ObjectProxy, gk as Owner, gl as Runloop, gm as Service, gn as VERSION } from './main-D8I16Byr.js';
export { i as ObjectInternals } from './internals-Cf1imC3e.js';
export { i as GlimmerUtil } from './index-Cak3C8ur.js';

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
