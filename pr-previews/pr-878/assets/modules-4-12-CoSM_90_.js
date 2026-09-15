import { cs as configure, ct as _backburner, cu as _rsvpErrorQueue, cv as on, cw as getDispatchOverride, cx as EventTarget, cy as Promise$1, cz as all, cA as allSettled, cB as asap, cC as async, cD as cast, cE as RSVP, cF as defer, cG as denodeify, cH as filter, cI as hash, cJ as hashSettled, cK as map, cL as off, cM as race, cN as reject, cO as resolve, cP as rethrow, g as get, cQ as set, cR as ASYNC_OBSERVERS, cS as ComputedDescriptor, cT as ComputedProperty, cU as DEBUG_INJECTION_FUNCTIONS, cV as Libraries, cW as NAMESPACES, cX as NAMESPACES_BY_ID, cY as PROPERTY_DID_CHANGE, cZ as PROXY_CONTENT, c_ as SYNC_OBSERVERS, c$ as TrackedDescriptor, d0 as _getPath, d1 as _getProp, d2 as _setProp, d3 as activateObserver, d4 as addArrayObserver, d5 as addListener, d6 as addNamespace, d7 as addObserver, d8 as alias, d9 as arrayContentDidChange, da as arrayContentWillChange, db as autoComputed, dc as beginPropertyChanges, dd as cached, de as changeProperties, df as computed, dg as createCache, dh as defineDecorator, di as defineProperty, dj as defineValue, dk as descriptorForDecorator, dl as descriptorForProperty, dm as endPropertyChanges, dn as expandProperties, dp as findNamespace, dq as findNamespaces, dr as flushAsyncObservers, q as getCachedValueFor, ds as getProperties, dt as getValue, du as hasListeners, dv as hasUnknownProperty, dw as inject, dx as isClassicDecorator, dy as isComputed, dz as isConst, dA as isElementDescriptor, dB as isSearchDisabled, dC as LIBRARIES, dD as makeComputedDecorator, dE as markObjectAsDirty, dF as nativeDescDecorator, dG as notifyPropertyChange, dH as objectAt, dI as on$1, dJ as processAllNamespaces, dK as processNamespace, dL as removeArrayObserver, dM as removeListener, dN as removeNamespace, dO as removeObserver, dP as replace, dQ as replaceInNativeArray, dR as revalidateObservers, dS as sendEvent, dT as setClassicDecorator, dU as setSearchDisabled, dV as setProperties, dW as setUnprocessedMixins, dX as tagForObject, dY as tagForProperty, n as tracked, dZ as trySet, d_ as MutableArray, d$ as ENV, e0 as context, e1 as getENV, e2 as getLookup, e3 as global$1, e4 as setLookup, e5 as Meta, e6 as UNDEFINED, e7 as counters, e8 as meta, e9 as peekMeta, ea as setMeta, eb as ActionHandler, ec as Comparable, ed as ContainerProxyMixin, ee as MutableEnumerable, ef as RSVP$1, eg as RegistryProxyMixin, eh as TargetActionSupport, ei as ProxyMixin, ej as contentFor, ek as Cache, el as GUID_KEY, em as ROOT, en as canInvoke, eo as checkHasSuper, ep as makeDictionary, eq as enumerableSymbol, er as generateGuid, es as getDebugName$1, et as getName, v as guidFor, eu as intern, ev as isInternalSymbol, ew as isObject, ex as isProxy, ey as lookupDescriptor, ez as observerListenerMetaFor, eA as setListeners, eB as setName, eC as setObservers, eD as setProxy, eE as setWithMandatorySetter, eF as setupMandatorySetter, eG as symbol, eH as teardownMandatorySetter, eI as toString, eJ as uuid, eK as wrap, eL as ActionSupport, eM as ComponentLookup, eN as CoreView, eO as EventDispatcher, eP as MUTABLE_CELL, eQ as states, eR as addChildView, eS as clearElementView, eT as clearViewElement, eU as constructStyleDeprecationMessage, eV as getChildViews, eW as getElementView, eX as getRootViews, eY as getViewBoundingClientRect, eZ as getViewBounds, e_ as getViewClientRects, e$ as getViewElement, f0 as getViewId, f1 as isSimpleClick, f2 as setElementView, f3 as setViewElement, f4 as CustomComponentManager, f5 as CustomHelperManager, f6 as CustomModifierManager, f7 as capabilityFlagsFrom, f8 as componentCapabilities, f9 as getComponentTemplate, fa as getCustomTagFor, fb as getInternalComponentManager, fc as getInternalHelperManager, fd as getInternalModifierManager, fe as hasCapability, ff as hasDestroyable, fg as hasInternalComponentManager, fh as hasInternalHelperManager, fi as hasInternalModifierManager, fj as hasValue, fk as helperCapabilities, fl as managerHasCapability, fm as modifierCapabilities, fn as setComponentManager, s as setComponentTemplate, fo as setCustomTagFor, fp as setHelperManager, fq as setInternalComponentManager, fr as setInternalHelperManager, fs as setInternalModifierManager, ft as setModifierManager, fu as FALSE_REFERENCE, fv as NULL_REFERENCE, fw as REFERENCE, fx as TRUE_REFERENCE, fy as UNDEFINED_REFERENCE, fz as childRefFor, fA as childRefFromParts, fB as createComputeRef, fC as createConstRef, fD as createDebugAliasRef, fE as createInvokableRef, fF as createIteratorItemRef, fG as createIteratorRef, fH as createPrimitiveRef, fI as createReadOnlyRef, fJ as createUnboundRef, fK as isConstRef, fL as isInvokableRef, fM as isUpdatableRef, fN as updateRef, fO as valueForRef } from './main-f2pqWeg8.js';
export { fP as Application, fQ as ApplicationNamespace, fR as Array, fS as ArrayProxy, fT as Component, fU as Controller, fV as Debug, fW as EmberDestroyable, fX as EmberObject, fY as EnumerableMutable, fZ as GlimmerComponent, f_ as GlimmerRuntime, f$ as GlimmerValidator, g0 as Instrumentation, fX as Object, g1 as ObjectCore, g2 as ObjectEvented, g3 as ObjectObservable, g4 as ObjectPromiseProxyMixin, g5 as ObjectProxy, g6 as Owner, g7 as Runloop, g8 as Service, g9 as VERSION } from './main-f2pqWeg8.js';
export { i as ObjectInternals } from './internals-CNgrT2Tw.js';
export { i as GlimmerUtil } from './index-CCtWWKxE.js';

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
