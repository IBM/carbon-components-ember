import { cF as configure, cG as _backburner, cH as _rsvpErrorQueue, cI as on, cJ as getDispatchOverride, cK as EventTarget, cL as Promise$1, cM as all, cN as allSettled, cO as asap, cP as async, cQ as cast, cR as RSVP, cS as defer, cT as denodeify, cU as filter, cV as hash, cW as hashSettled, cX as map, cY as off, cZ as race, c_ as reject, c$ as resolve, d0 as rethrow, g as get, d1 as set, d2 as ASYNC_OBSERVERS, d3 as ComputedDescriptor, d4 as ComputedProperty, d5 as DEBUG_INJECTION_FUNCTIONS, d6 as Libraries, d7 as NAMESPACES, d8 as NAMESPACES_BY_ID, d9 as PROPERTY_DID_CHANGE, da as PROXY_CONTENT, db as SYNC_OBSERVERS, dc as TrackedDescriptor, dd as _getPath, de as _getProp, df as _setProp, dg as activateObserver, dh as addArrayObserver, di as addListener, dj as addNamespace, dk as addObserver, dl as alias, dm as arrayContentDidChange, dn as arrayContentWillChange, dp as autoComputed, dq as beginPropertyChanges, dr as cached, ds as changeProperties, dt as computed, du as createCache, dv as defineDecorator, dw as defineProperty, dx as defineValue, dy as descriptorForDecorator, dz as descriptorForProperty, dA as endPropertyChanges, dB as expandProperties, dC as findNamespace, dD as findNamespaces, dE as flushAsyncObservers, q as getCachedValueFor, dF as getProperties, dG as getValue, dH as hasListeners, dI as hasUnknownProperty, dJ as inject, dK as isClassicDecorator, dL as isComputed, dM as isConst, dN as isElementDescriptor, dO as isSearchDisabled, dP as LIBRARIES, dQ as makeComputedDecorator, dR as markObjectAsDirty, dS as nativeDescDecorator, dT as notifyPropertyChange, dU as objectAt, dV as on$1, dW as processAllNamespaces, dX as processNamespace, dY as removeArrayObserver, dZ as removeListener, d_ as removeNamespace, d$ as removeObserver, e0 as replace, e1 as replaceInNativeArray, e2 as revalidateObservers, e3 as sendEvent, e4 as setClassicDecorator, e5 as setSearchDisabled, e6 as setProperties, e7 as setUnprocessedMixins, e8 as tagForObject, e9 as tagForProperty, n as tracked, ea as trySet, eb as MutableArray, ec as ENV, ed as context, ee as getENV, ef as getLookup, eg as global$1, eh as setLookup, ei as Meta, ej as UNDEFINED, ek as counters, el as meta, em as peekMeta, en as setMeta, eo as ActionHandler, ep as Comparable, eq as ContainerProxyMixin, er as MutableEnumerable, es as RSVP$1, et as RegistryProxyMixin, eu as TargetActionSupport, ev as ProxyMixin, ew as contentFor, ex as Cache, ey as GUID_KEY, ez as ROOT, eA as canInvoke, eB as checkHasSuper, eC as makeDictionary, eD as enumerableSymbol, eE as generateGuid, eF as getDebugName$1, eG as getName, v as guidFor, eH as intern, eI as isInternalSymbol, eJ as isObject, eK as isProxy, eL as lookupDescriptor, eM as observerListenerMetaFor, eN as setListeners, eO as setName, eP as setObservers, eQ as setProxy, eR as setWithMandatorySetter, eS as setupMandatorySetter, eT as symbol, eU as teardownMandatorySetter, eV as toString, eW as uuid, eX as wrap, eY as ActionSupport, eZ as ComponentLookup, e_ as CoreView, e$ as EventDispatcher, f0 as MUTABLE_CELL, f1 as states, f2 as addChildView, f3 as clearElementView, f4 as clearViewElement, f5 as constructStyleDeprecationMessage, f6 as getChildViews, f7 as getElementView, f8 as getRootViews, f9 as getViewBoundingClientRect, fa as getViewBounds, fb as getViewClientRects, fc as getViewElement, fd as getViewId, fe as isSimpleClick, ff as setElementView, fg as setViewElement, fh as CustomComponentManager, fi as CustomHelperManager, fj as CustomModifierManager, fk as capabilityFlagsFrom, fl as componentCapabilities, fm as getComponentTemplate, fn as getCustomTagFor, fo as getInternalComponentManager, fp as getInternalHelperManager, fq as getInternalModifierManager, fr as hasCapability, fs as hasDestroyable, ft as hasInternalComponentManager, fu as hasInternalHelperManager, fv as hasInternalModifierManager, fw as hasValue, fx as helperCapabilities, fy as managerHasCapability, fz as modifierCapabilities, fA as setComponentManager, s as setComponentTemplate, fB as setCustomTagFor, fC as setHelperManager, fD as setInternalComponentManager, fE as setInternalHelperManager, fF as setInternalModifierManager, fG as setModifierManager, fH as FALSE_REFERENCE, fI as NULL_REFERENCE, fJ as REFERENCE, fK as TRUE_REFERENCE, fL as UNDEFINED_REFERENCE, fM as childRefFor, fN as childRefFromParts, fO as createComputeRef, fP as createConstRef, fQ as createDebugAliasRef, fR as createInvokableRef, fS as createIteratorItemRef, fT as createIteratorRef, fU as createPrimitiveRef, fV as createReadOnlyRef, fW as createUnboundRef, fX as isConstRef, fY as isInvokableRef, fZ as isUpdatableRef, f_ as updateRef, f$ as valueForRef } from './main-BwkyfBLK.js';
export { g0 as Application, g1 as ApplicationNamespace, g2 as Array, g3 as ArrayProxy, g4 as Component, g5 as Controller, g6 as Debug, g7 as EmberDestroyable, g8 as EmberObject, g9 as EnumerableMutable, ga as GlimmerComponent, gb as GlimmerRuntime, gc as GlimmerValidator, gd as Instrumentation, g8 as Object, ge as ObjectCore, gf as ObjectEvented, gg as ObjectObservable, gh as ObjectPromiseProxyMixin, gi as ObjectProxy, gj as Owner, gk as Runloop, gl as Service, gm as VERSION } from './main-BwkyfBLK.js';
export { i as ObjectInternals } from './internals-DdOXc1sb.js';
export { i as GlimmerUtil } from './index-BLa0-Y3H.js';

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
