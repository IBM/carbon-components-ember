import { bL as configure, bM as _backburner, bN as _rsvpErrorQueue, bO as on, bP as getDispatchOverride, bQ as EventTarget, bR as Promise$1, bS as all, bT as allSettled, bU as asap, bV as async, bW as cast, bX as RSVP, bY as defer, bZ as denodeify, b_ as filter, b$ as hash, c0 as hashSettled, c1 as map, c2 as off, c3 as race, c4 as reject, c5 as resolve, c6 as rethrow, g as get, c7 as set, c8 as ASYNC_OBSERVERS, c9 as ComputedDescriptor, ca as ComputedProperty, cb as DEBUG_INJECTION_FUNCTIONS, cc as Libraries, cd as NAMESPACES, ce as NAMESPACES_BY_ID, cf as PROPERTY_DID_CHANGE, cg as PROXY_CONTENT, ch as SYNC_OBSERVERS, ci as TrackedDescriptor, cj as _getPath, ck as _getProp, cl as _setProp, cm as activateObserver, cn as addArrayObserver, co as addListener, cp as addNamespace, cq as addObserver, cr as alias, cs as arrayContentDidChange, ct as arrayContentWillChange, cu as autoComputed, cv as beginPropertyChanges, cw as cached, cx as changeProperties, cy as computed, cz as createCache, cA as defineDecorator, cB as defineProperty, cC as defineValue, cD as descriptorForDecorator, cE as descriptorForProperty, cF as endPropertyChanges, cG as expandProperties, cH as findNamespace, cI as findNamespaces, cJ as flushAsyncObservers, q as getCachedValueFor, cK as getProperties, cL as getValue, cM as hasListeners, cN as hasUnknownProperty, cO as inject, cP as isClassicDecorator, cQ as isComputed, cR as isConst, cS as isElementDescriptor, cT as isSearchDisabled, cU as LIBRARIES, cV as makeComputedDecorator, cW as markObjectAsDirty, cX as nativeDescDecorator, cY as notifyPropertyChange, cZ as objectAt, c_ as on$1, c$ as processAllNamespaces, d0 as processNamespace, d1 as removeArrayObserver, d2 as removeListener, d3 as removeNamespace, d4 as removeObserver, d5 as replace, d6 as replaceInNativeArray, d7 as revalidateObservers, d8 as sendEvent, d9 as setClassicDecorator, da as setSearchDisabled, db as setProperties, dc as setUnprocessedMixins, dd as tagForObject, de as tagForProperty, n as tracked, df as trySet, dg as MutableArray, dh as ENV, di as context, dj as getENV, dk as getLookup, dl as global$1, dm as setLookup, dn as Meta, dp as UNDEFINED, dq as counters, dr as meta, ds as peekMeta, dt as setMeta, du as ActionHandler, dv as Comparable, dw as ContainerProxyMixin, dx as MutableEnumerable, dy as RSVP$1, dz as RegistryProxyMixin, dA as TargetActionSupport, dB as ProxyMixin, dC as contentFor, dD as Cache, dE as GUID_KEY, dF as ROOT, dG as canInvoke, dH as checkHasSuper, dI as makeDictionary, dJ as enumerableSymbol, dK as generateGuid, dL as getDebugName$1, dM as getName, v as guidFor, dN as intern, dO as isInternalSymbol, dP as isObject, dQ as isProxy, dR as lookupDescriptor, dS as observerListenerMetaFor, dT as setListeners, dU as setName, dV as setObservers, dW as setProxy, dX as setWithMandatorySetter, dY as setupMandatorySetter, dZ as symbol, d_ as teardownMandatorySetter, d$ as toString, e0 as uuid, e1 as wrap, e2 as ActionSupport, e3 as ComponentLookup, e4 as CoreView, e5 as EventDispatcher, e6 as MUTABLE_CELL, e7 as states, e8 as addChildView, e9 as clearElementView, ea as clearViewElement, eb as constructStyleDeprecationMessage, ec as getChildViews, ed as getElementView, ee as getRootViews, ef as getViewBoundingClientRect, eg as getViewBounds, eh as getViewClientRects, ei as getViewElement, ej as getViewId, ek as isSimpleClick, el as setElementView, em as setViewElement, en as CustomComponentManager, eo as CustomHelperManager, ep as CustomModifierManager, eq as capabilityFlagsFrom, er as componentCapabilities, es as getComponentTemplate, et as getCustomTagFor, eu as getInternalComponentManager, ev as getInternalHelperManager, ew as getInternalModifierManager, ex as hasCapability, ey as hasDestroyable, ez as hasInternalComponentManager, eA as hasInternalHelperManager, eB as hasInternalModifierManager, eC as hasValue, eD as helperCapabilities, eE as managerHasCapability, eF as modifierCapabilities, eG as setComponentManager, s as setComponentTemplate, eH as setCustomTagFor, eI as setHelperManager, eJ as setInternalComponentManager, eK as setInternalHelperManager, eL as setInternalModifierManager, eM as setModifierManager, eN as FALSE_REFERENCE, eO as NULL_REFERENCE, eP as REFERENCE, eQ as TRUE_REFERENCE, eR as UNDEFINED_REFERENCE, eS as childRefFor, eT as childRefFromParts, eU as createComputeRef, eV as createConstRef, eW as createDebugAliasRef, eX as createInvokableRef, eY as createIteratorItemRef, eZ as createIteratorRef, e_ as createPrimitiveRef, e$ as createReadOnlyRef, f0 as createUnboundRef, f1 as isConstRef, f2 as isInvokableRef, f3 as isUpdatableRef, f4 as updateRef, f5 as valueForRef } from './main-CMjP2Z9f.js';
export { f6 as Application, f7 as ApplicationNamespace, f8 as Array, f9 as ArrayProxy, fa as Component, fb as Controller, fc as Debug, fd as EmberDestroyable, fe as EmberObject, ff as EnumerableMutable, fg as GlimmerComponent, fh as GlimmerRuntime, fi as GlimmerValidator, fj as Instrumentation, fe as Object, fk as ObjectCore, fl as ObjectEvented, fm as ObjectObservable, fn as ObjectPromiseProxyMixin, fo as ObjectProxy, fp as Owner, fq as Runloop, fr as Service, fs as VERSION } from './main-CMjP2Z9f.js';
export { i as ObjectInternals } from './internals-SkfLHpgU.js';
export { i as GlimmerUtil } from './index-BpNLdxdl.js';

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
