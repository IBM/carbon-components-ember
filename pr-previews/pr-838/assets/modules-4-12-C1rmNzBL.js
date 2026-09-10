import { b$ as configure, c0 as _backburner, c1 as _rsvpErrorQueue, c2 as on, c3 as getDispatchOverride, c4 as EventTarget, c5 as Promise$1, c6 as all, c7 as allSettled, c8 as asap, c9 as async, ca as cast, cb as RSVP, cc as defer, cd as denodeify, ce as filter, cf as hash, cg as hashSettled, ch as map, ci as off, cj as race, ck as reject, cl as resolve, cm as rethrow, g as get, cn as set, co as ASYNC_OBSERVERS, cp as ComputedDescriptor, cq as ComputedProperty, cr as DEBUG_INJECTION_FUNCTIONS, cs as Libraries, ct as NAMESPACES, cu as NAMESPACES_BY_ID, cv as PROPERTY_DID_CHANGE, cw as PROXY_CONTENT, cx as SYNC_OBSERVERS, cy as TrackedDescriptor, cz as _getPath, cA as _getProp, cB as _setProp, cC as activateObserver, cD as addArrayObserver, cE as addListener, cF as addNamespace, cG as addObserver, cH as alias, cI as arrayContentDidChange, cJ as arrayContentWillChange, cK as autoComputed, cL as beginPropertyChanges, cM as cached, cN as changeProperties, cO as computed, cP as createCache, cQ as defineDecorator, cR as defineProperty, cS as defineValue, cT as descriptorForDecorator, cU as descriptorForProperty, cV as endPropertyChanges, cW as expandProperties, cX as findNamespace, cY as findNamespaces, cZ as flushAsyncObservers, q as getCachedValueFor, c_ as getProperties, c$ as getValue, d0 as hasListeners, d1 as hasUnknownProperty, d2 as inject, d3 as isClassicDecorator, d4 as isComputed, d5 as isConst, d6 as isElementDescriptor, d7 as isSearchDisabled, d8 as LIBRARIES, d9 as makeComputedDecorator, da as markObjectAsDirty, db as nativeDescDecorator, dc as notifyPropertyChange, dd as objectAt, de as on$1, df as processAllNamespaces, dg as processNamespace, dh as removeArrayObserver, di as removeListener, dj as removeNamespace, dk as removeObserver, dl as replace, dm as replaceInNativeArray, dn as revalidateObservers, dp as sendEvent, dq as setClassicDecorator, dr as setSearchDisabled, ds as setProperties, dt as setUnprocessedMixins, du as tagForObject, dv as tagForProperty, n as tracked, dw as trySet, dx as MutableArray, dy as ENV, dz as context, dA as getENV, dB as getLookup, dC as global$1, dD as setLookup, dE as Meta, dF as UNDEFINED, dG as counters, dH as meta, dI as peekMeta, dJ as setMeta, dK as ActionHandler, dL as Comparable, dM as ContainerProxyMixin, dN as MutableEnumerable, dO as RSVP$1, dP as RegistryProxyMixin, dQ as TargetActionSupport, dR as ProxyMixin, dS as contentFor, dT as Cache, dU as GUID_KEY, dV as ROOT, dW as canInvoke, dX as checkHasSuper, dY as makeDictionary, dZ as enumerableSymbol, d_ as generateGuid, d$ as getDebugName$1, e0 as getName, v as guidFor, e1 as intern, e2 as isInternalSymbol, e3 as isObject, e4 as isProxy, e5 as lookupDescriptor, e6 as observerListenerMetaFor, e7 as setListeners, e8 as setName, e9 as setObservers, ea as setProxy, eb as setWithMandatorySetter, ec as setupMandatorySetter, ed as symbol, ee as teardownMandatorySetter, ef as toString, eg as uuid, eh as wrap, ei as ActionSupport, ej as ComponentLookup, ek as CoreView, el as EventDispatcher, em as MUTABLE_CELL, en as states, eo as addChildView, ep as clearElementView, eq as clearViewElement, er as constructStyleDeprecationMessage, es as getChildViews, et as getElementView, eu as getRootViews, ev as getViewBoundingClientRect, ew as getViewBounds, ex as getViewClientRects, ey as getViewElement, ez as getViewId, eA as isSimpleClick, eB as setElementView, eC as setViewElement, eD as CustomComponentManager, eE as CustomHelperManager, eF as CustomModifierManager, eG as capabilityFlagsFrom, eH as componentCapabilities, eI as getComponentTemplate, eJ as getCustomTagFor, eK as getInternalComponentManager, eL as getInternalHelperManager, eM as getInternalModifierManager, eN as hasCapability, eO as hasDestroyable, eP as hasInternalComponentManager, eQ as hasInternalHelperManager, eR as hasInternalModifierManager, eS as hasValue, eT as helperCapabilities, eU as managerHasCapability, eV as modifierCapabilities, eW as setComponentManager, s as setComponentTemplate, eX as setCustomTagFor, eY as setHelperManager, eZ as setInternalComponentManager, e_ as setInternalHelperManager, e$ as setInternalModifierManager, f0 as setModifierManager, f1 as FALSE_REFERENCE, f2 as NULL_REFERENCE, f3 as REFERENCE, f4 as TRUE_REFERENCE, f5 as UNDEFINED_REFERENCE, f6 as childRefFor, f7 as childRefFromParts, f8 as createComputeRef, f9 as createConstRef, fa as createDebugAliasRef, fb as createInvokableRef, fc as createIteratorItemRef, fd as createIteratorRef, fe as createPrimitiveRef, ff as createReadOnlyRef, fg as createUnboundRef, fh as isConstRef, fi as isInvokableRef, fj as isUpdatableRef, fk as updateRef, fl as valueForRef } from './main-CJcmd6qW.js';
export { fm as Application, fn as ApplicationNamespace, fo as Array, fp as ArrayProxy, fq as Component, fr as Controller, fs as Debug, ft as EmberDestroyable, fu as EmberObject, fv as EnumerableMutable, fw as GlimmerComponent, fx as GlimmerRuntime, fy as GlimmerValidator, fz as Instrumentation, fu as Object, fA as ObjectCore, fB as ObjectEvented, fC as ObjectObservable, fD as ObjectPromiseProxyMixin, fE as ObjectProxy, fF as Owner, fG as Runloop, fH as Service, fI as VERSION } from './main-CJcmd6qW.js';
export { i as ObjectInternals } from './internals-BQEWGdXw.js';
export { i as GlimmerUtil } from './index-CgKBCf0v.js';

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
