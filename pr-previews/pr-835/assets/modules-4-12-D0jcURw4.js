import { bN as configure, bO as _backburner, bP as _rsvpErrorQueue, bQ as on, bR as getDispatchOverride, bS as EventTarget, bT as Promise$1, bU as all, bV as allSettled, bW as asap, bX as async, bY as cast, bZ as RSVP, b_ as defer, b$ as denodeify, c0 as filter, c1 as hash, c2 as hashSettled, c3 as map, c4 as off, c5 as race, c6 as reject, c7 as resolve, c8 as rethrow, g as get, c9 as set, ca as ASYNC_OBSERVERS, cb as ComputedDescriptor, cc as ComputedProperty, cd as DEBUG_INJECTION_FUNCTIONS, ce as Libraries, cf as NAMESPACES, cg as NAMESPACES_BY_ID, ch as PROPERTY_DID_CHANGE, ci as PROXY_CONTENT, cj as SYNC_OBSERVERS, ck as TrackedDescriptor, cl as _getPath, cm as _getProp, cn as _setProp, co as activateObserver, cp as addArrayObserver, cq as addListener, cr as addNamespace, cs as addObserver, ct as alias, cu as arrayContentDidChange, cv as arrayContentWillChange, cw as autoComputed, cx as beginPropertyChanges, cy as cached, cz as changeProperties, cA as computed, cB as createCache, cC as defineDecorator, cD as defineProperty, cE as defineValue, cF as descriptorForDecorator, cG as descriptorForProperty, cH as endPropertyChanges, cI as expandProperties, cJ as findNamespace, cK as findNamespaces, cL as flushAsyncObservers, q as getCachedValueFor, cM as getProperties, cN as getValue, cO as hasListeners, cP as hasUnknownProperty, cQ as inject, cR as isClassicDecorator, cS as isComputed, cT as isConst, cU as isElementDescriptor, cV as isSearchDisabled, cW as LIBRARIES, cX as makeComputedDecorator, cY as markObjectAsDirty, cZ as nativeDescDecorator, c_ as notifyPropertyChange, c$ as objectAt, d0 as on$1, d1 as processAllNamespaces, d2 as processNamespace, d3 as removeArrayObserver, d4 as removeListener, d5 as removeNamespace, d6 as removeObserver, d7 as replace, d8 as replaceInNativeArray, d9 as revalidateObservers, da as sendEvent, db as setClassicDecorator, dc as setSearchDisabled, dd as setProperties, de as setUnprocessedMixins, df as tagForObject, dg as tagForProperty, n as tracked, dh as trySet, di as MutableArray, dj as ENV, dk as context, dl as getENV, dm as getLookup, dn as global$1, dp as setLookup, dq as Meta, dr as UNDEFINED, ds as counters, dt as meta, du as peekMeta, dv as setMeta, dw as ActionHandler, dx as Comparable, dy as ContainerProxyMixin, dz as MutableEnumerable, dA as RSVP$1, dB as RegistryProxyMixin, dC as TargetActionSupport, dD as ProxyMixin, dE as contentFor, dF as Cache, dG as GUID_KEY, dH as ROOT, dI as canInvoke, dJ as checkHasSuper, dK as makeDictionary, dL as enumerableSymbol, dM as generateGuid, dN as getDebugName$1, dO as getName, v as guidFor, dP as intern, dQ as isInternalSymbol, dR as isObject, dS as isProxy, dT as lookupDescriptor, dU as observerListenerMetaFor, dV as setListeners, dW as setName, dX as setObservers, dY as setProxy, dZ as setWithMandatorySetter, d_ as setupMandatorySetter, d$ as symbol, e0 as teardownMandatorySetter, e1 as toString, e2 as uuid, e3 as wrap, e4 as ActionSupport, e5 as ComponentLookup, e6 as CoreView, e7 as EventDispatcher, e8 as MUTABLE_CELL, e9 as states, ea as addChildView, eb as clearElementView, ec as clearViewElement, ed as constructStyleDeprecationMessage, ee as getChildViews, ef as getElementView, eg as getRootViews, eh as getViewBoundingClientRect, ei as getViewBounds, ej as getViewClientRects, ek as getViewElement, el as getViewId, em as isSimpleClick, en as setElementView, eo as setViewElement, ep as CustomComponentManager, eq as CustomHelperManager, er as CustomModifierManager, es as capabilityFlagsFrom, et as componentCapabilities, eu as getComponentTemplate, ev as getCustomTagFor, ew as getInternalComponentManager, ex as getInternalHelperManager, ey as getInternalModifierManager, ez as hasCapability, eA as hasDestroyable, eB as hasInternalComponentManager, eC as hasInternalHelperManager, eD as hasInternalModifierManager, eE as hasValue, eF as helperCapabilities, eG as managerHasCapability, eH as modifierCapabilities, eI as setComponentManager, s as setComponentTemplate, eJ as setCustomTagFor, eK as setHelperManager, eL as setInternalComponentManager, eM as setInternalHelperManager, eN as setInternalModifierManager, eO as setModifierManager, eP as FALSE_REFERENCE, eQ as NULL_REFERENCE, eR as REFERENCE, eS as TRUE_REFERENCE, eT as UNDEFINED_REFERENCE, eU as childRefFor, eV as childRefFromParts, eW as createComputeRef, eX as createConstRef, eY as createDebugAliasRef, eZ as createInvokableRef, e_ as createIteratorItemRef, e$ as createIteratorRef, f0 as createPrimitiveRef, f1 as createReadOnlyRef, f2 as createUnboundRef, f3 as isConstRef, f4 as isInvokableRef, f5 as isUpdatableRef, f6 as updateRef, f7 as valueForRef } from './main-DQVvX4Fm.js';
export { f8 as Application, f9 as ApplicationNamespace, fa as Array, fb as ArrayProxy, fc as Component, fd as Controller, fe as Debug, ff as EmberDestroyable, fg as EmberObject, fh as EnumerableMutable, fi as GlimmerComponent, fj as GlimmerRuntime, fk as GlimmerValidator, fl as Instrumentation, fg as Object, fm as ObjectCore, fn as ObjectEvented, fo as ObjectObservable, fp as ObjectPromiseProxyMixin, fq as ObjectProxy, fr as Owner, fs as Runloop, ft as Service, fu as VERSION } from './main-DQVvX4Fm.js';
export { i as ObjectInternals } from './internals-DEQ0fIyx.js';
export { i as GlimmerUtil } from './index-D7KvWh59.js';

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
