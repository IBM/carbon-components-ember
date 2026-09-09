import { bR as configure, bS as _backburner, bT as _rsvpErrorQueue, bU as on, bV as getDispatchOverride, bW as EventTarget, bX as Promise$1, bY as all, bZ as allSettled, b_ as asap, b$ as async, c0 as cast, c1 as RSVP, c2 as defer, c3 as denodeify, c4 as filter, c5 as hash, c6 as hashSettled, c7 as map, c8 as off, c9 as race, ca as reject, cb as resolve, cc as rethrow, g as get, cd as set, ce as ASYNC_OBSERVERS, cf as ComputedDescriptor, cg as ComputedProperty, ch as DEBUG_INJECTION_FUNCTIONS, ci as Libraries, cj as NAMESPACES, ck as NAMESPACES_BY_ID, cl as PROPERTY_DID_CHANGE, cm as PROXY_CONTENT, cn as SYNC_OBSERVERS, co as TrackedDescriptor, cp as _getPath, cq as _getProp, cr as _setProp, cs as activateObserver, ct as addArrayObserver, cu as addListener, cv as addNamespace, cw as addObserver, cx as alias, cy as arrayContentDidChange, cz as arrayContentWillChange, cA as autoComputed, cB as beginPropertyChanges, cC as cached, cD as changeProperties, cE as computed, cF as createCache, cG as defineDecorator, cH as defineProperty, cI as defineValue, cJ as descriptorForDecorator, cK as descriptorForProperty, cL as endPropertyChanges, cM as expandProperties, cN as findNamespace, cO as findNamespaces, cP as flushAsyncObservers, q as getCachedValueFor, cQ as getProperties, cR as getValue, cS as hasListeners, cT as hasUnknownProperty, cU as inject, cV as isClassicDecorator, cW as isComputed, cX as isConst, cY as isElementDescriptor, cZ as isSearchDisabled, c_ as LIBRARIES, c$ as makeComputedDecorator, d0 as markObjectAsDirty, d1 as nativeDescDecorator, d2 as notifyPropertyChange, d3 as objectAt, d4 as on$1, d5 as processAllNamespaces, d6 as processNamespace, d7 as removeArrayObserver, d8 as removeListener, d9 as removeNamespace, da as removeObserver, db as replace, dc as replaceInNativeArray, dd as revalidateObservers, de as sendEvent, df as setClassicDecorator, dg as setSearchDisabled, dh as setProperties, di as setUnprocessedMixins, dj as tagForObject, dk as tagForProperty, n as tracked, dl as trySet, dm as MutableArray, dn as ENV, dp as context, dq as getENV, dr as getLookup, ds as global$1, dt as setLookup, du as Meta, dv as UNDEFINED, dw as counters, dx as meta, dy as peekMeta, dz as setMeta, dA as ActionHandler, dB as Comparable, dC as ContainerProxyMixin, dD as MutableEnumerable, dE as RSVP$1, dF as RegistryProxyMixin, dG as TargetActionSupport, dH as ProxyMixin, dI as contentFor, dJ as Cache, dK as GUID_KEY, dL as ROOT, dM as canInvoke, dN as checkHasSuper, dO as makeDictionary, dP as enumerableSymbol, dQ as generateGuid, dR as getDebugName$1, dS as getName, v as guidFor, dT as intern, dU as isInternalSymbol, dV as isObject, dW as isProxy, dX as lookupDescriptor, dY as observerListenerMetaFor, dZ as setListeners, d_ as setName, d$ as setObservers, e0 as setProxy, e1 as setWithMandatorySetter, e2 as setupMandatorySetter, e3 as symbol, e4 as teardownMandatorySetter, e5 as toString, e6 as uuid, e7 as wrap, e8 as ActionSupport, e9 as ComponentLookup, ea as CoreView, eb as EventDispatcher, ec as MUTABLE_CELL, ed as states, ee as addChildView, ef as clearElementView, eg as clearViewElement, eh as constructStyleDeprecationMessage, ei as getChildViews, ej as getElementView, ek as getRootViews, el as getViewBoundingClientRect, em as getViewBounds, en as getViewClientRects, eo as getViewElement, ep as getViewId, eq as isSimpleClick, er as setElementView, es as setViewElement, et as CustomComponentManager, eu as CustomHelperManager, ev as CustomModifierManager, ew as capabilityFlagsFrom, ex as componentCapabilities, ey as getComponentTemplate, ez as getCustomTagFor, eA as getInternalComponentManager, eB as getInternalHelperManager, eC as getInternalModifierManager, eD as hasCapability, eE as hasDestroyable, eF as hasInternalComponentManager, eG as hasInternalHelperManager, eH as hasInternalModifierManager, eI as hasValue, eJ as helperCapabilities, eK as managerHasCapability, eL as modifierCapabilities, eM as setComponentManager, s as setComponentTemplate, eN as setCustomTagFor, eO as setHelperManager, eP as setInternalComponentManager, eQ as setInternalHelperManager, eR as setInternalModifierManager, eS as setModifierManager, eT as FALSE_REFERENCE, eU as NULL_REFERENCE, eV as REFERENCE, eW as TRUE_REFERENCE, eX as UNDEFINED_REFERENCE, eY as childRefFor, eZ as childRefFromParts, e_ as createComputeRef, e$ as createConstRef, f0 as createDebugAliasRef, f1 as createInvokableRef, f2 as createIteratorItemRef, f3 as createIteratorRef, f4 as createPrimitiveRef, f5 as createReadOnlyRef, f6 as createUnboundRef, f7 as isConstRef, f8 as isInvokableRef, f9 as isUpdatableRef, fa as updateRef, fb as valueForRef } from './main-phNfil3q.js';
export { fc as Application, fd as ApplicationNamespace, fe as Array, ff as ArrayProxy, fg as Component, fh as Controller, fi as Debug, fj as EmberDestroyable, fk as EmberObject, fl as EnumerableMutable, fm as GlimmerComponent, fn as GlimmerRuntime, fo as GlimmerValidator, fp as Instrumentation, fk as Object, fq as ObjectCore, fr as ObjectEvented, fs as ObjectObservable, ft as ObjectPromiseProxyMixin, fu as ObjectProxy, fv as Owner, fw as Runloop, fx as Service, fy as VERSION } from './main-phNfil3q.js';
export { i as ObjectInternals } from './internals-BxUJ-l9b.js';
export { i as GlimmerUtil } from './index-38hHo-qv.js';

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
