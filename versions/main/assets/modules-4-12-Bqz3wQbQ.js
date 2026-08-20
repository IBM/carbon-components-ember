import { bK as configure, bL as _backburner, bM as _rsvpErrorQueue, bN as on, bO as getDispatchOverride, bP as EventTarget, bQ as Promise$1, bR as all, bS as allSettled, bT as asap, bU as async, bV as cast, bW as RSVP, bX as defer, bY as denodeify, bZ as filter, b_ as hash, b$ as hashSettled, c0 as map, c1 as off, c2 as race, c3 as reject, c4 as resolve, c5 as rethrow, g as get, c6 as set, c7 as ASYNC_OBSERVERS, c8 as ComputedDescriptor, c9 as ComputedProperty, ca as DEBUG_INJECTION_FUNCTIONS, cb as Libraries, cc as NAMESPACES, cd as NAMESPACES_BY_ID, ce as PROPERTY_DID_CHANGE, cf as PROXY_CONTENT, cg as SYNC_OBSERVERS, ch as TrackedDescriptor, ci as _getPath, cj as _getProp, ck as _setProp, cl as activateObserver, cm as addArrayObserver, cn as addListener, co as addNamespace, cp as addObserver, cq as alias, cr as arrayContentDidChange, cs as arrayContentWillChange, ct as autoComputed, cu as beginPropertyChanges, cv as cached, cw as changeProperties, cx as computed, cy as createCache, cz as defineDecorator, cA as defineProperty, cB as defineValue, cC as descriptorForDecorator, cD as descriptorForProperty, cE as endPropertyChanges, cF as expandProperties, cG as findNamespace, cH as findNamespaces, cI as flushAsyncObservers, q as getCachedValueFor, cJ as getProperties, cK as getValue, cL as hasListeners, cM as hasUnknownProperty, cN as inject, cO as isClassicDecorator, cP as isComputed, cQ as isConst, cR as isElementDescriptor, cS as isSearchDisabled, cT as LIBRARIES, cU as makeComputedDecorator, cV as markObjectAsDirty, cW as nativeDescDecorator, cX as notifyPropertyChange, cY as objectAt, cZ as on$1, c_ as processAllNamespaces, c$ as processNamespace, d0 as removeArrayObserver, d1 as removeListener, d2 as removeNamespace, d3 as removeObserver, d4 as replace, d5 as replaceInNativeArray, d6 as revalidateObservers, d7 as sendEvent, d8 as setClassicDecorator, d9 as setSearchDisabled, da as setProperties, db as setUnprocessedMixins, dc as tagForObject, dd as tagForProperty, n as tracked, de as trySet, df as MutableArray, dg as ENV, dh as context, di as getENV, dj as getLookup, dk as global$1, dl as setLookup, dm as Meta, dn as UNDEFINED, dp as counters, dq as meta, dr as peekMeta, ds as setMeta, dt as ActionHandler, du as Comparable, dv as ContainerProxyMixin, dw as MutableEnumerable, dx as RSVP$1, dy as RegistryProxyMixin, dz as TargetActionSupport, dA as ProxyMixin, dB as contentFor, dC as Cache, dD as GUID_KEY, dE as ROOT, dF as canInvoke, dG as checkHasSuper, dH as makeDictionary, dI as enumerableSymbol, dJ as generateGuid, dK as getDebugName$1, dL as getName, v as guidFor, dM as intern, dN as isInternalSymbol, dO as isObject, dP as isProxy, dQ as lookupDescriptor, dR as observerListenerMetaFor, dS as setListeners, dT as setName, dU as setObservers, dV as setProxy, dW as setWithMandatorySetter, dX as setupMandatorySetter, dY as symbol, dZ as teardownMandatorySetter, d_ as toString, d$ as uuid, e0 as wrap, e1 as ActionSupport, e2 as ComponentLookup, e3 as CoreView, e4 as EventDispatcher, e5 as MUTABLE_CELL, e6 as states, e7 as addChildView, e8 as clearElementView, e9 as clearViewElement, ea as constructStyleDeprecationMessage, eb as getChildViews, ec as getElementView, ed as getRootViews, ee as getViewBoundingClientRect, ef as getViewBounds, eg as getViewClientRects, eh as getViewElement, ei as getViewId, ej as isSimpleClick, ek as setElementView, el as setViewElement, em as CustomComponentManager, en as CustomHelperManager, eo as CustomModifierManager, ep as capabilityFlagsFrom, eq as componentCapabilities, er as getComponentTemplate, es as getCustomTagFor, et as getInternalComponentManager, eu as getInternalHelperManager, ev as getInternalModifierManager, ew as hasCapability, ex as hasDestroyable, ey as hasInternalComponentManager, ez as hasInternalHelperManager, eA as hasInternalModifierManager, eB as hasValue, eC as helperCapabilities, eD as managerHasCapability, eE as modifierCapabilities, eF as setComponentManager, s as setComponentTemplate, eG as setCustomTagFor, eH as setHelperManager, eI as setInternalComponentManager, eJ as setInternalHelperManager, eK as setInternalModifierManager, eL as setModifierManager, eM as FALSE_REFERENCE, eN as NULL_REFERENCE, eO as REFERENCE, eP as TRUE_REFERENCE, eQ as UNDEFINED_REFERENCE, eR as childRefFor, eS as childRefFromParts, eT as createComputeRef, eU as createConstRef, eV as createDebugAliasRef, eW as createInvokableRef, eX as createIteratorItemRef, eY as createIteratorRef, eZ as createPrimitiveRef, e_ as createReadOnlyRef, e$ as createUnboundRef, f0 as isConstRef, f1 as isInvokableRef, f2 as isUpdatableRef, f3 as updateRef, f4 as valueForRef } from './main-8FxBwsJT.js';
export { f5 as Application, f6 as ApplicationNamespace, f7 as Array, f8 as ArrayProxy, f9 as Component, fa as Controller, fb as Debug, fc as EmberDestroyable, fd as EmberObject, fe as EnumerableMutable, ff as GlimmerComponent, fg as GlimmerRuntime, fh as GlimmerValidator, fi as Instrumentation, fd as Object, fj as ObjectCore, fk as ObjectEvented, fl as ObjectObservable, fm as ObjectPromiseProxyMixin, fn as ObjectProxy, fo as Owner, fp as Runloop, fq as Service, fr as VERSION } from './main-8FxBwsJT.js';
export { i as ObjectInternals } from './internals-CFeynPKv.js';
export { i as GlimmerUtil } from './index-DWdk6U70.js';

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
