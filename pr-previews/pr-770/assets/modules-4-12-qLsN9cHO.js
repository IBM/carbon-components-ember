import { bM as configure, bN as _backburner, bO as _rsvpErrorQueue, bP as on, bQ as getDispatchOverride, bR as EventTarget, bS as Promise$1, bT as all, bU as allSettled, bV as asap, bW as async, bX as cast, bY as RSVP, bZ as defer, b_ as denodeify, b$ as filter, c0 as hash, c1 as hashSettled, c2 as map, c3 as off, c4 as race, c5 as reject, c6 as resolve, c7 as rethrow, g as get, c8 as set, c9 as ASYNC_OBSERVERS, ca as ComputedDescriptor, cb as ComputedProperty, cc as DEBUG_INJECTION_FUNCTIONS, cd as Libraries, ce as NAMESPACES, cf as NAMESPACES_BY_ID, cg as PROPERTY_DID_CHANGE, ch as PROXY_CONTENT, ci as SYNC_OBSERVERS, cj as TrackedDescriptor, ck as _getPath, cl as _getProp, cm as _setProp, cn as activateObserver, co as addArrayObserver, cp as addListener, cq as addNamespace, cr as addObserver, cs as alias, ct as arrayContentDidChange, cu as arrayContentWillChange, cv as autoComputed, cw as beginPropertyChanges, cx as cached, cy as changeProperties, cz as computed, cA as createCache, cB as defineDecorator, cC as defineProperty, cD as defineValue, cE as descriptorForDecorator, cF as descriptorForProperty, cG as endPropertyChanges, cH as expandProperties, cI as findNamespace, cJ as findNamespaces, cK as flushAsyncObservers, q as getCachedValueFor, cL as getProperties, cM as getValue, cN as hasListeners, cO as hasUnknownProperty, cP as inject, cQ as isClassicDecorator, cR as isComputed, cS as isConst, cT as isElementDescriptor, cU as isSearchDisabled, cV as LIBRARIES, cW as makeComputedDecorator, cX as markObjectAsDirty, cY as nativeDescDecorator, cZ as notifyPropertyChange, c_ as objectAt, c$ as on$1, d0 as processAllNamespaces, d1 as processNamespace, d2 as removeArrayObserver, d3 as removeListener, d4 as removeNamespace, d5 as removeObserver, d6 as replace, d7 as replaceInNativeArray, d8 as revalidateObservers, d9 as sendEvent, da as setClassicDecorator, db as setSearchDisabled, dc as setProperties, dd as setUnprocessedMixins, de as tagForObject, df as tagForProperty, n as tracked, dg as trySet, dh as MutableArray, di as ENV, dj as context, dk as getENV, dl as getLookup, dm as global$1, dn as setLookup, dp as Meta, dq as UNDEFINED, dr as counters, ds as meta, dt as peekMeta, du as setMeta, dv as ActionHandler, dw as Comparable, dx as ContainerProxyMixin, dy as MutableEnumerable, dz as RSVP$1, dA as RegistryProxyMixin, dB as TargetActionSupport, dC as ProxyMixin, dD as contentFor, dE as Cache, dF as GUID_KEY, dG as ROOT, dH as canInvoke, dI as checkHasSuper, dJ as makeDictionary, dK as enumerableSymbol, dL as generateGuid, dM as getDebugName$1, dN as getName, v as guidFor, dO as intern, dP as isInternalSymbol, dQ as isObject, dR as isProxy, dS as lookupDescriptor, dT as observerListenerMetaFor, dU as setListeners, dV as setName, dW as setObservers, dX as setProxy, dY as setWithMandatorySetter, dZ as setupMandatorySetter, d_ as symbol, d$ as teardownMandatorySetter, e0 as toString, e1 as uuid, e2 as wrap, e3 as ActionSupport, e4 as ComponentLookup, e5 as CoreView, e6 as EventDispatcher, e7 as MUTABLE_CELL, e8 as states, e9 as addChildView, ea as clearElementView, eb as clearViewElement, ec as constructStyleDeprecationMessage, ed as getChildViews, ee as getElementView, ef as getRootViews, eg as getViewBoundingClientRect, eh as getViewBounds, ei as getViewClientRects, ej as getViewElement, ek as getViewId, el as isSimpleClick, em as setElementView, en as setViewElement, eo as CustomComponentManager, ep as CustomHelperManager, eq as CustomModifierManager, er as capabilityFlagsFrom, es as componentCapabilities, et as getComponentTemplate, eu as getCustomTagFor, ev as getInternalComponentManager, ew as getInternalHelperManager, ex as getInternalModifierManager, ey as hasCapability, ez as hasDestroyable, eA as hasInternalComponentManager, eB as hasInternalHelperManager, eC as hasInternalModifierManager, eD as hasValue, eE as helperCapabilities, eF as managerHasCapability, eG as modifierCapabilities, eH as setComponentManager, s as setComponentTemplate, eI as setCustomTagFor, eJ as setHelperManager, eK as setInternalComponentManager, eL as setInternalHelperManager, eM as setInternalModifierManager, eN as setModifierManager, eO as FALSE_REFERENCE, eP as NULL_REFERENCE, eQ as REFERENCE, eR as TRUE_REFERENCE, eS as UNDEFINED_REFERENCE, eT as childRefFor, eU as childRefFromParts, eV as createComputeRef, eW as createConstRef, eX as createDebugAliasRef, eY as createInvokableRef, eZ as createIteratorItemRef, e_ as createIteratorRef, e$ as createPrimitiveRef, f0 as createReadOnlyRef, f1 as createUnboundRef, f2 as isConstRef, f3 as isInvokableRef, f4 as isUpdatableRef, f5 as updateRef, f6 as valueForRef } from './main-DZin9OFc.js';
export { f7 as Application, f8 as ApplicationNamespace, f9 as Array, fa as ArrayProxy, fb as Component, fc as Controller, fd as Debug, fe as EmberDestroyable, ff as EmberObject, fg as EnumerableMutable, fh as GlimmerComponent, fi as GlimmerRuntime, fj as GlimmerValidator, fk as Instrumentation, ff as Object, fl as ObjectCore, fm as ObjectEvented, fn as ObjectObservable, fo as ObjectPromiseProxyMixin, fp as ObjectProxy, fq as Owner, fr as Runloop, fs as Service, ft as VERSION } from './main-DZin9OFc.js';
export { i as ObjectInternals } from './internals-yD0R9IfA.js';
export { i as GlimmerUtil } from './index-CUgJZFVB.js';

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
