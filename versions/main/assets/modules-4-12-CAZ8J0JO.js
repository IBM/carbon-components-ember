import { c1 as configure, c2 as _backburner, c3 as _rsvpErrorQueue, c4 as on, c5 as getDispatchOverride, c6 as EventTarget, c7 as Promise$1, c8 as all, c9 as allSettled, ca as asap, cb as async, cc as cast, cd as RSVP, ce as defer, cf as denodeify, cg as filter, ch as hash, ci as hashSettled, cj as map, ck as off, cl as race, cm as reject, cn as resolve, co as rethrow, g as get, cp as set, cq as ASYNC_OBSERVERS, cr as ComputedDescriptor, cs as ComputedProperty, ct as DEBUG_INJECTION_FUNCTIONS, cu as Libraries, cv as NAMESPACES, cw as NAMESPACES_BY_ID, cx as PROPERTY_DID_CHANGE, cy as PROXY_CONTENT, cz as SYNC_OBSERVERS, cA as TrackedDescriptor, cB as _getPath, cC as _getProp, cD as _setProp, cE as activateObserver, cF as addArrayObserver, cG as addListener, cH as addNamespace, cI as addObserver, cJ as alias, cK as arrayContentDidChange, cL as arrayContentWillChange, cM as autoComputed, cN as beginPropertyChanges, cO as cached, cP as changeProperties, cQ as computed, cR as createCache, cS as defineDecorator, cT as defineProperty, cU as defineValue, cV as descriptorForDecorator, cW as descriptorForProperty, cX as endPropertyChanges, cY as expandProperties, cZ as findNamespace, c_ as findNamespaces, c$ as flushAsyncObservers, q as getCachedValueFor, d0 as getProperties, d1 as getValue, d2 as hasListeners, d3 as hasUnknownProperty, d4 as inject, d5 as isClassicDecorator, d6 as isComputed, d7 as isConst, d8 as isElementDescriptor, d9 as isSearchDisabled, da as LIBRARIES, db as makeComputedDecorator, dc as markObjectAsDirty, dd as nativeDescDecorator, de as notifyPropertyChange, df as objectAt, dg as on$1, dh as processAllNamespaces, di as processNamespace, dj as removeArrayObserver, dk as removeListener, dl as removeNamespace, dm as removeObserver, dn as replace, dp as replaceInNativeArray, dq as revalidateObservers, dr as sendEvent, ds as setClassicDecorator, dt as setSearchDisabled, du as setProperties, dv as setUnprocessedMixins, dw as tagForObject, dx as tagForProperty, n as tracked, dy as trySet, dz as MutableArray, dA as ENV, dB as context, dC as getENV, dD as getLookup, dE as global$1, dF as setLookup, dG as Meta, dH as UNDEFINED, dI as counters, dJ as meta, dK as peekMeta, dL as setMeta, dM as ActionHandler, dN as Comparable, dO as ContainerProxyMixin, dP as MutableEnumerable, dQ as RSVP$1, dR as RegistryProxyMixin, dS as TargetActionSupport, dT as ProxyMixin, dU as contentFor, dV as Cache, dW as GUID_KEY, dX as ROOT, dY as canInvoke, dZ as checkHasSuper, d_ as makeDictionary, d$ as enumerableSymbol, e0 as generateGuid, e1 as getDebugName$1, e2 as getName, v as guidFor, e3 as intern, e4 as isInternalSymbol, e5 as isObject, e6 as isProxy, e7 as lookupDescriptor, e8 as observerListenerMetaFor, e9 as setListeners, ea as setName, eb as setObservers, ec as setProxy, ed as setWithMandatorySetter, ee as setupMandatorySetter, ef as symbol, eg as teardownMandatorySetter, eh as toString, ei as uuid, ej as wrap, ek as ActionSupport, el as ComponentLookup, em as CoreView, en as EventDispatcher, eo as MUTABLE_CELL, ep as states, eq as addChildView, er as clearElementView, es as clearViewElement, et as constructStyleDeprecationMessage, eu as getChildViews, ev as getElementView, ew as getRootViews, ex as getViewBoundingClientRect, ey as getViewBounds, ez as getViewClientRects, eA as getViewElement, eB as getViewId, eC as isSimpleClick, eD as setElementView, eE as setViewElement, eF as CustomComponentManager, eG as CustomHelperManager, eH as CustomModifierManager, eI as capabilityFlagsFrom, eJ as componentCapabilities, eK as getComponentTemplate, eL as getCustomTagFor, eM as getInternalComponentManager, eN as getInternalHelperManager, eO as getInternalModifierManager, eP as hasCapability, eQ as hasDestroyable, eR as hasInternalComponentManager, eS as hasInternalHelperManager, eT as hasInternalModifierManager, eU as hasValue, eV as helperCapabilities, eW as managerHasCapability, eX as modifierCapabilities, eY as setComponentManager, s as setComponentTemplate, eZ as setCustomTagFor, e_ as setHelperManager, e$ as setInternalComponentManager, f0 as setInternalHelperManager, f1 as setInternalModifierManager, f2 as setModifierManager, f3 as FALSE_REFERENCE, f4 as NULL_REFERENCE, f5 as REFERENCE, f6 as TRUE_REFERENCE, f7 as UNDEFINED_REFERENCE, f8 as childRefFor, f9 as childRefFromParts, fa as createComputeRef, fb as createConstRef, fc as createDebugAliasRef, fd as createInvokableRef, fe as createIteratorItemRef, ff as createIteratorRef, fg as createPrimitiveRef, fh as createReadOnlyRef, fi as createUnboundRef, fj as isConstRef, fk as isInvokableRef, fl as isUpdatableRef, fm as updateRef, fn as valueForRef } from './main-DDe1lsIY.js';
export { fo as Application, fp as ApplicationNamespace, fq as Array, fr as ArrayProxy, fs as Component, ft as Controller, fu as Debug, fv as EmberDestroyable, fw as EmberObject, fx as EnumerableMutable, fy as GlimmerComponent, fz as GlimmerRuntime, fA as GlimmerValidator, fB as Instrumentation, fw as Object, fC as ObjectCore, fD as ObjectEvented, fE as ObjectObservable, fF as ObjectPromiseProxyMixin, fG as ObjectProxy, fH as Owner, fI as Runloop, fJ as Service, fK as VERSION } from './main-DDe1lsIY.js';
export { i as ObjectInternals } from './internals-BOoxaWlN.js';
export { i as GlimmerUtil } from './index-Iag6R4W6.js';

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
