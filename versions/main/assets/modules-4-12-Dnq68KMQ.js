import { bT as configure, bU as _backburner, bV as _rsvpErrorQueue, bW as on, bX as getDispatchOverride, bY as EventTarget, bZ as Promise$1, b_ as all, b$ as allSettled, c0 as asap, c1 as async, c2 as cast, c3 as RSVP, c4 as defer, c5 as denodeify, c6 as filter, c7 as hash, c8 as hashSettled, c9 as map, ca as off, cb as race, cc as reject, cd as resolve, ce as rethrow, g as get, cf as set, cg as ASYNC_OBSERVERS, ch as ComputedDescriptor, ci as ComputedProperty, cj as DEBUG_INJECTION_FUNCTIONS, ck as Libraries, cl as NAMESPACES, cm as NAMESPACES_BY_ID, cn as PROPERTY_DID_CHANGE, co as PROXY_CONTENT, cp as SYNC_OBSERVERS, cq as TrackedDescriptor, cr as _getPath, cs as _getProp, ct as _setProp, cu as activateObserver, cv as addArrayObserver, cw as addListener, cx as addNamespace, cy as addObserver, cz as alias, cA as arrayContentDidChange, cB as arrayContentWillChange, cC as autoComputed, cD as beginPropertyChanges, cE as cached, cF as changeProperties, cG as computed, cH as createCache, cI as defineDecorator, cJ as defineProperty, cK as defineValue, cL as descriptorForDecorator, cM as descriptorForProperty, cN as endPropertyChanges, cO as expandProperties, cP as findNamespace, cQ as findNamespaces, cR as flushAsyncObservers, q as getCachedValueFor, cS as getProperties, cT as getValue, cU as hasListeners, cV as hasUnknownProperty, cW as inject, cX as isClassicDecorator, cY as isComputed, cZ as isConst, c_ as isElementDescriptor, c$ as isSearchDisabled, d0 as LIBRARIES, d1 as makeComputedDecorator, d2 as markObjectAsDirty, d3 as nativeDescDecorator, d4 as notifyPropertyChange, d5 as objectAt, d6 as on$1, d7 as processAllNamespaces, d8 as processNamespace, d9 as removeArrayObserver, da as removeListener, db as removeNamespace, dc as removeObserver, dd as replace, de as replaceInNativeArray, df as revalidateObservers, dg as sendEvent, dh as setClassicDecorator, di as setSearchDisabled, dj as setProperties, dk as setUnprocessedMixins, dl as tagForObject, dm as tagForProperty, n as tracked, dn as trySet, dp as MutableArray, dq as ENV, dr as context, ds as getENV, dt as getLookup, du as global$1, dv as setLookup, dw as Meta, dx as UNDEFINED, dy as counters, dz as meta, dA as peekMeta, dB as setMeta, dC as ActionHandler, dD as Comparable, dE as ContainerProxyMixin, dF as MutableEnumerable, dG as RSVP$1, dH as RegistryProxyMixin, dI as TargetActionSupport, dJ as ProxyMixin, dK as contentFor, dL as Cache, dM as GUID_KEY, dN as ROOT, dO as canInvoke, dP as checkHasSuper, dQ as makeDictionary, dR as enumerableSymbol, dS as generateGuid, dT as getDebugName$1, dU as getName, v as guidFor, dV as intern, dW as isInternalSymbol, dX as isObject, dY as isProxy, dZ as lookupDescriptor, d_ as observerListenerMetaFor, d$ as setListeners, e0 as setName, e1 as setObservers, e2 as setProxy, e3 as setWithMandatorySetter, e4 as setupMandatorySetter, e5 as symbol, e6 as teardownMandatorySetter, e7 as toString, e8 as uuid, e9 as wrap, ea as ActionSupport, eb as ComponentLookup, ec as CoreView, ed as EventDispatcher, ee as MUTABLE_CELL, ef as states, eg as addChildView, eh as clearElementView, ei as clearViewElement, ej as constructStyleDeprecationMessage, ek as getChildViews, el as getElementView, em as getRootViews, en as getViewBoundingClientRect, eo as getViewBounds, ep as getViewClientRects, eq as getViewElement, er as getViewId, es as isSimpleClick, et as setElementView, eu as setViewElement, ev as CustomComponentManager, ew as CustomHelperManager, ex as CustomModifierManager, ey as capabilityFlagsFrom, ez as componentCapabilities, eA as getComponentTemplate, eB as getCustomTagFor, eC as getInternalComponentManager, eD as getInternalHelperManager, eE as getInternalModifierManager, eF as hasCapability, eG as hasDestroyable, eH as hasInternalComponentManager, eI as hasInternalHelperManager, eJ as hasInternalModifierManager, eK as hasValue, eL as helperCapabilities, eM as managerHasCapability, eN as modifierCapabilities, eO as setComponentManager, s as setComponentTemplate, eP as setCustomTagFor, eQ as setHelperManager, eR as setInternalComponentManager, eS as setInternalHelperManager, eT as setInternalModifierManager, eU as setModifierManager, eV as FALSE_REFERENCE, eW as NULL_REFERENCE, eX as REFERENCE, eY as TRUE_REFERENCE, eZ as UNDEFINED_REFERENCE, e_ as childRefFor, e$ as childRefFromParts, f0 as createComputeRef, f1 as createConstRef, f2 as createDebugAliasRef, f3 as createInvokableRef, f4 as createIteratorItemRef, f5 as createIteratorRef, f6 as createPrimitiveRef, f7 as createReadOnlyRef, f8 as createUnboundRef, f9 as isConstRef, fa as isInvokableRef, fb as isUpdatableRef, fc as updateRef, fd as valueForRef } from './main-DcER6PXK.js';
export { fe as Application, ff as ApplicationNamespace, fg as Array, fh as ArrayProxy, fi as Component, fj as Controller, fk as Debug, fl as EmberDestroyable, fm as EmberObject, fn as EnumerableMutable, fo as GlimmerComponent, fp as GlimmerRuntime, fq as GlimmerValidator, fr as Instrumentation, fm as Object, fs as ObjectCore, ft as ObjectEvented, fu as ObjectObservable, fv as ObjectPromiseProxyMixin, fw as ObjectProxy, fx as Owner, fy as Runloop, fz as Service, fA as VERSION } from './main-DcER6PXK.js';
export { i as ObjectInternals } from './internals-CQtuPabJ.js';
export { i as GlimmerUtil } from './index-Csnoj8HH.js';

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
