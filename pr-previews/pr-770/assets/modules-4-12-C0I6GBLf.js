import { bU as configure, bV as _backburner, bW as _rsvpErrorQueue, bX as on, bY as getDispatchOverride, bZ as EventTarget, b_ as Promise$1, b$ as all, c0 as allSettled, c1 as asap, c2 as async, c3 as cast, c4 as RSVP, c5 as defer, c6 as denodeify, c7 as filter, c8 as hash, c9 as hashSettled, ca as map, cb as off, cc as race, cd as reject, ce as resolve, cf as rethrow, g as get, cg as set, ch as ASYNC_OBSERVERS, ci as ComputedDescriptor, cj as ComputedProperty, ck as DEBUG_INJECTION_FUNCTIONS, cl as Libraries, cm as NAMESPACES, cn as NAMESPACES_BY_ID, co as PROPERTY_DID_CHANGE, cp as PROXY_CONTENT, cq as SYNC_OBSERVERS, cr as TrackedDescriptor, cs as _getPath, ct as _getProp, cu as _setProp, cv as activateObserver, cw as addArrayObserver, cx as addListener, cy as addNamespace, cz as addObserver, cA as alias, cB as arrayContentDidChange, cC as arrayContentWillChange, cD as autoComputed, cE as beginPropertyChanges, cF as cached, cG as changeProperties, cH as computed, cI as createCache, cJ as defineDecorator, cK as defineProperty, cL as defineValue, cM as descriptorForDecorator, cN as descriptorForProperty, cO as endPropertyChanges, cP as expandProperties, cQ as findNamespace, cR as findNamespaces, cS as flushAsyncObservers, q as getCachedValueFor, cT as getProperties, cU as getValue, cV as hasListeners, cW as hasUnknownProperty, cX as inject, cY as isClassicDecorator, cZ as isComputed, c_ as isConst, c$ as isElementDescriptor, d0 as isSearchDisabled, d1 as LIBRARIES, d2 as makeComputedDecorator, d3 as markObjectAsDirty, d4 as nativeDescDecorator, d5 as notifyPropertyChange, d6 as objectAt, d7 as on$1, d8 as processAllNamespaces, d9 as processNamespace, da as removeArrayObserver, db as removeListener, dc as removeNamespace, dd as removeObserver, de as replace, df as replaceInNativeArray, dg as revalidateObservers, dh as sendEvent, di as setClassicDecorator, dj as setSearchDisabled, dk as setProperties, dl as setUnprocessedMixins, dm as tagForObject, dn as tagForProperty, n as tracked, dp as trySet, dq as MutableArray, dr as ENV, ds as context, dt as getENV, du as getLookup, dv as global$1, dw as setLookup, dx as Meta, dy as UNDEFINED, dz as counters, dA as meta, dB as peekMeta, dC as setMeta, dD as ActionHandler, dE as Comparable, dF as ContainerProxyMixin, dG as MutableEnumerable, dH as RSVP$1, dI as RegistryProxyMixin, dJ as TargetActionSupport, dK as ProxyMixin, dL as contentFor, dM as Cache, dN as GUID_KEY, dO as ROOT, dP as canInvoke, dQ as checkHasSuper, dR as makeDictionary, dS as enumerableSymbol, dT as generateGuid, dU as getDebugName$1, dV as getName, v as guidFor, dW as intern, dX as isInternalSymbol, dY as isObject, dZ as isProxy, d_ as lookupDescriptor, d$ as observerListenerMetaFor, e0 as setListeners, e1 as setName, e2 as setObservers, e3 as setProxy, e4 as setWithMandatorySetter, e5 as setupMandatorySetter, e6 as symbol, e7 as teardownMandatorySetter, e8 as toString, e9 as uuid, ea as wrap, eb as ActionSupport, ec as ComponentLookup, ed as CoreView, ee as EventDispatcher, ef as MUTABLE_CELL, eg as states, eh as addChildView, ei as clearElementView, ej as clearViewElement, ek as constructStyleDeprecationMessage, el as getChildViews, em as getElementView, en as getRootViews, eo as getViewBoundingClientRect, ep as getViewBounds, eq as getViewClientRects, er as getViewElement, es as getViewId, et as isSimpleClick, eu as setElementView, ev as setViewElement, ew as CustomComponentManager, ex as CustomHelperManager, ey as CustomModifierManager, ez as capabilityFlagsFrom, eA as componentCapabilities, eB as getComponentTemplate, eC as getCustomTagFor, eD as getInternalComponentManager, eE as getInternalHelperManager, eF as getInternalModifierManager, eG as hasCapability, eH as hasDestroyable, eI as hasInternalComponentManager, eJ as hasInternalHelperManager, eK as hasInternalModifierManager, eL as hasValue, eM as helperCapabilities, eN as managerHasCapability, eO as modifierCapabilities, eP as setComponentManager, s as setComponentTemplate, eQ as setCustomTagFor, eR as setHelperManager, eS as setInternalComponentManager, eT as setInternalHelperManager, eU as setInternalModifierManager, eV as setModifierManager, eW as FALSE_REFERENCE, eX as NULL_REFERENCE, eY as REFERENCE, eZ as TRUE_REFERENCE, e_ as UNDEFINED_REFERENCE, e$ as childRefFor, f0 as childRefFromParts, f1 as createComputeRef, f2 as createConstRef, f3 as createDebugAliasRef, f4 as createInvokableRef, f5 as createIteratorItemRef, f6 as createIteratorRef, f7 as createPrimitiveRef, f8 as createReadOnlyRef, f9 as createUnboundRef, fa as isConstRef, fb as isInvokableRef, fc as isUpdatableRef, fd as updateRef, fe as valueForRef } from './main-D0_NGsmE.js';
export { ff as Application, fg as ApplicationNamespace, fh as Array, fi as ArrayProxy, fj as Component, fk as Controller, fl as Debug, fm as EmberDestroyable, fn as EmberObject, fo as EnumerableMutable, fp as GlimmerComponent, fq as GlimmerRuntime, fr as GlimmerValidator, fs as Instrumentation, fn as Object, ft as ObjectCore, fu as ObjectEvented, fv as ObjectObservable, fw as ObjectPromiseProxyMixin, fx as ObjectProxy, fy as Owner, fz as Runloop, fA as Service, fB as VERSION } from './main-D0_NGsmE.js';
export { i as ObjectInternals } from './internals-DSot2Jtl.js';
export { i as GlimmerUtil } from './index-D0_ol3tQ.js';

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
