import { c0 as configure, c1 as _backburner, c2 as _rsvpErrorQueue, c3 as on, c4 as getDispatchOverride, c5 as EventTarget, c6 as Promise$1, c7 as all, c8 as allSettled, c9 as asap, ca as async, cb as cast, cc as RSVP, cd as defer, ce as denodeify, cf as filter, cg as hash, ch as hashSettled, ci as map, cj as off, ck as race, cl as reject, cm as resolve, cn as rethrow, g as get, co as set, cp as ASYNC_OBSERVERS, cq as ComputedDescriptor, cr as ComputedProperty, cs as DEBUG_INJECTION_FUNCTIONS, ct as Libraries, cu as NAMESPACES, cv as NAMESPACES_BY_ID, cw as PROPERTY_DID_CHANGE, cx as PROXY_CONTENT, cy as SYNC_OBSERVERS, cz as TrackedDescriptor, cA as _getPath, cB as _getProp, cC as _setProp, cD as activateObserver, cE as addArrayObserver, cF as addListener, cG as addNamespace, cH as addObserver, cI as alias, cJ as arrayContentDidChange, cK as arrayContentWillChange, cL as autoComputed, cM as beginPropertyChanges, cN as cached, cO as changeProperties, cP as computed, cQ as createCache, cR as defineDecorator, cS as defineProperty, cT as defineValue, cU as descriptorForDecorator, cV as descriptorForProperty, cW as endPropertyChanges, cX as expandProperties, cY as findNamespace, cZ as findNamespaces, c_ as flushAsyncObservers, q as getCachedValueFor, c$ as getProperties, d0 as getValue, d1 as hasListeners, d2 as hasUnknownProperty, d3 as inject, d4 as isClassicDecorator, d5 as isComputed, d6 as isConst, d7 as isElementDescriptor, d8 as isSearchDisabled, d9 as LIBRARIES, da as makeComputedDecorator, db as markObjectAsDirty, dc as nativeDescDecorator, dd as notifyPropertyChange, de as objectAt, df as on$1, dg as processAllNamespaces, dh as processNamespace, di as removeArrayObserver, dj as removeListener, dk as removeNamespace, dl as removeObserver, dm as replace, dn as replaceInNativeArray, dp as revalidateObservers, dq as sendEvent, dr as setClassicDecorator, ds as setSearchDisabled, dt as setProperties, du as setUnprocessedMixins, dv as tagForObject, dw as tagForProperty, n as tracked, dx as trySet, dy as MutableArray, dz as ENV, dA as context, dB as getENV, dC as getLookup, dD as global$1, dE as setLookup, dF as Meta, dG as UNDEFINED, dH as counters, dI as meta, dJ as peekMeta, dK as setMeta, dL as ActionHandler, dM as Comparable, dN as ContainerProxyMixin, dO as MutableEnumerable, dP as RSVP$1, dQ as RegistryProxyMixin, dR as TargetActionSupport, dS as ProxyMixin, dT as contentFor, dU as Cache, dV as GUID_KEY, dW as ROOT, dX as canInvoke, dY as checkHasSuper, dZ as makeDictionary, d_ as enumerableSymbol, d$ as generateGuid, e0 as getDebugName$1, e1 as getName, v as guidFor, e2 as intern, e3 as isInternalSymbol, e4 as isObject, e5 as isProxy, e6 as lookupDescriptor, e7 as observerListenerMetaFor, e8 as setListeners, e9 as setName, ea as setObservers, eb as setProxy, ec as setWithMandatorySetter, ed as setupMandatorySetter, ee as symbol, ef as teardownMandatorySetter, eg as toString, eh as uuid, ei as wrap, ej as ActionSupport, ek as ComponentLookup, el as CoreView, em as EventDispatcher, en as MUTABLE_CELL, eo as states, ep as addChildView, eq as clearElementView, er as clearViewElement, es as constructStyleDeprecationMessage, et as getChildViews, eu as getElementView, ev as getRootViews, ew as getViewBoundingClientRect, ex as getViewBounds, ey as getViewClientRects, ez as getViewElement, eA as getViewId, eB as isSimpleClick, eC as setElementView, eD as setViewElement, eE as CustomComponentManager, eF as CustomHelperManager, eG as CustomModifierManager, eH as capabilityFlagsFrom, eI as componentCapabilities, eJ as getComponentTemplate, eK as getCustomTagFor, eL as getInternalComponentManager, eM as getInternalHelperManager, eN as getInternalModifierManager, eO as hasCapability, eP as hasDestroyable, eQ as hasInternalComponentManager, eR as hasInternalHelperManager, eS as hasInternalModifierManager, eT as hasValue, eU as helperCapabilities, eV as managerHasCapability, eW as modifierCapabilities, eX as setComponentManager, s as setComponentTemplate, eY as setCustomTagFor, eZ as setHelperManager, e_ as setInternalComponentManager, e$ as setInternalHelperManager, f0 as setInternalModifierManager, f1 as setModifierManager, f2 as FALSE_REFERENCE, f3 as NULL_REFERENCE, f4 as REFERENCE, f5 as TRUE_REFERENCE, f6 as UNDEFINED_REFERENCE, f7 as childRefFor, f8 as childRefFromParts, f9 as createComputeRef, fa as createConstRef, fb as createDebugAliasRef, fc as createInvokableRef, fd as createIteratorItemRef, fe as createIteratorRef, ff as createPrimitiveRef, fg as createReadOnlyRef, fh as createUnboundRef, fi as isConstRef, fj as isInvokableRef, fk as isUpdatableRef, fl as updateRef, fm as valueForRef } from './main-C8pf3y0a.js';
export { fn as Application, fo as ApplicationNamespace, fp as Array, fq as ArrayProxy, fr as Component, fs as Controller, ft as Debug, fu as EmberDestroyable, fv as EmberObject, fw as EnumerableMutable, fx as GlimmerComponent, fy as GlimmerRuntime, fz as GlimmerValidator, fA as Instrumentation, fv as Object, fB as ObjectCore, fC as ObjectEvented, fD as ObjectObservable, fE as ObjectPromiseProxyMixin, fF as ObjectProxy, fG as Owner, fH as Runloop, fI as Service, fJ as VERSION } from './main-C8pf3y0a.js';
export { i as ObjectInternals } from './internals-B6B2xrkO.js';
export { i as GlimmerUtil } from './index-C6Aah-_N.js';

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
