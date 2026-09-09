import { bP as configure, bQ as _backburner, bR as _rsvpErrorQueue, bS as on, bT as getDispatchOverride, bU as EventTarget, bV as Promise$1, bW as all, bX as allSettled, bY as asap, bZ as async, b_ as cast, b$ as RSVP, c0 as defer, c1 as denodeify, c2 as filter, c3 as hash, c4 as hashSettled, c5 as map, c6 as off, c7 as race, c8 as reject, c9 as resolve, ca as rethrow, g as get, cb as set, cc as ASYNC_OBSERVERS, cd as ComputedDescriptor, ce as ComputedProperty, cf as DEBUG_INJECTION_FUNCTIONS, cg as Libraries, ch as NAMESPACES, ci as NAMESPACES_BY_ID, cj as PROPERTY_DID_CHANGE, ck as PROXY_CONTENT, cl as SYNC_OBSERVERS, cm as TrackedDescriptor, cn as _getPath, co as _getProp, cp as _setProp, cq as activateObserver, cr as addArrayObserver, cs as addListener, ct as addNamespace, cu as addObserver, cv as alias, cw as arrayContentDidChange, cx as arrayContentWillChange, cy as autoComputed, cz as beginPropertyChanges, cA as cached, cB as changeProperties, cC as computed, cD as createCache, cE as defineDecorator, cF as defineProperty, cG as defineValue, cH as descriptorForDecorator, cI as descriptorForProperty, cJ as endPropertyChanges, cK as expandProperties, cL as findNamespace, cM as findNamespaces, cN as flushAsyncObservers, q as getCachedValueFor, cO as getProperties, cP as getValue, cQ as hasListeners, cR as hasUnknownProperty, cS as inject, cT as isClassicDecorator, cU as isComputed, cV as isConst, cW as isElementDescriptor, cX as isSearchDisabled, cY as LIBRARIES, cZ as makeComputedDecorator, c_ as markObjectAsDirty, c$ as nativeDescDecorator, d0 as notifyPropertyChange, d1 as objectAt, d2 as on$1, d3 as processAllNamespaces, d4 as processNamespace, d5 as removeArrayObserver, d6 as removeListener, d7 as removeNamespace, d8 as removeObserver, d9 as replace, da as replaceInNativeArray, db as revalidateObservers, dc as sendEvent, dd as setClassicDecorator, de as setSearchDisabled, df as setProperties, dg as setUnprocessedMixins, dh as tagForObject, di as tagForProperty, n as tracked, dj as trySet, dk as MutableArray, dl as ENV, dm as context, dn as getENV, dp as getLookup, dq as global$1, dr as setLookup, ds as Meta, dt as UNDEFINED, du as counters, dv as meta, dw as peekMeta, dx as setMeta, dy as ActionHandler, dz as Comparable, dA as ContainerProxyMixin, dB as MutableEnumerable, dC as RSVP$1, dD as RegistryProxyMixin, dE as TargetActionSupport, dF as ProxyMixin, dG as contentFor, dH as Cache, dI as GUID_KEY, dJ as ROOT, dK as canInvoke, dL as checkHasSuper, dM as makeDictionary, dN as enumerableSymbol, dO as generateGuid, dP as getDebugName$1, dQ as getName, v as guidFor, dR as intern, dS as isInternalSymbol, dT as isObject, dU as isProxy, dV as lookupDescriptor, dW as observerListenerMetaFor, dX as setListeners, dY as setName, dZ as setObservers, d_ as setProxy, d$ as setWithMandatorySetter, e0 as setupMandatorySetter, e1 as symbol, e2 as teardownMandatorySetter, e3 as toString, e4 as uuid, e5 as wrap, e6 as ActionSupport, e7 as ComponentLookup, e8 as CoreView, e9 as EventDispatcher, ea as MUTABLE_CELL, eb as states, ec as addChildView, ed as clearElementView, ee as clearViewElement, ef as constructStyleDeprecationMessage, eg as getChildViews, eh as getElementView, ei as getRootViews, ej as getViewBoundingClientRect, ek as getViewBounds, el as getViewClientRects, em as getViewElement, en as getViewId, eo as isSimpleClick, ep as setElementView, eq as setViewElement, er as CustomComponentManager, es as CustomHelperManager, et as CustomModifierManager, eu as capabilityFlagsFrom, ev as componentCapabilities, ew as getComponentTemplate, ex as getCustomTagFor, ey as getInternalComponentManager, ez as getInternalHelperManager, eA as getInternalModifierManager, eB as hasCapability, eC as hasDestroyable, eD as hasInternalComponentManager, eE as hasInternalHelperManager, eF as hasInternalModifierManager, eG as hasValue, eH as helperCapabilities, eI as managerHasCapability, eJ as modifierCapabilities, eK as setComponentManager, s as setComponentTemplate, eL as setCustomTagFor, eM as setHelperManager, eN as setInternalComponentManager, eO as setInternalHelperManager, eP as setInternalModifierManager, eQ as setModifierManager, eR as FALSE_REFERENCE, eS as NULL_REFERENCE, eT as REFERENCE, eU as TRUE_REFERENCE, eV as UNDEFINED_REFERENCE, eW as childRefFor, eX as childRefFromParts, eY as createComputeRef, eZ as createConstRef, e_ as createDebugAliasRef, e$ as createInvokableRef, f0 as createIteratorItemRef, f1 as createIteratorRef, f2 as createPrimitiveRef, f3 as createReadOnlyRef, f4 as createUnboundRef, f5 as isConstRef, f6 as isInvokableRef, f7 as isUpdatableRef, f8 as updateRef, f9 as valueForRef } from './main-BPyDZzmB.js';
export { fa as Application, fb as ApplicationNamespace, fc as Array, fd as ArrayProxy, fe as Component, ff as Controller, fg as Debug, fh as EmberDestroyable, fi as EmberObject, fj as EnumerableMutable, fk as GlimmerComponent, fl as GlimmerRuntime, fm as GlimmerValidator, fn as Instrumentation, fi as Object, fo as ObjectCore, fp as ObjectEvented, fq as ObjectObservable, fr as ObjectPromiseProxyMixin, fs as ObjectProxy, ft as Owner, fu as Runloop, fv as Service, fw as VERSION } from './main-BPyDZzmB.js';
export { i as ObjectInternals } from './internals-CN1If5Xj.js';
export { i as GlimmerUtil } from './index-DZA-sQjA.js';

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
