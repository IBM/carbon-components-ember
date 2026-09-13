import { cf as configure, cg as _backburner, ch as _rsvpErrorQueue, ci as on, cj as getDispatchOverride, ck as EventTarget, cl as Promise$1, cm as all, cn as allSettled, co as asap, cp as async, cq as cast, cr as RSVP, cs as defer, ct as denodeify, cu as filter, cv as hash, cw as hashSettled, cx as map, cy as off, cz as race, cA as reject, cB as resolve, cC as rethrow, g as get, cD as set, cE as ASYNC_OBSERVERS, cF as ComputedDescriptor, cG as ComputedProperty, cH as DEBUG_INJECTION_FUNCTIONS, cI as Libraries, cJ as NAMESPACES, cK as NAMESPACES_BY_ID, cL as PROPERTY_DID_CHANGE, cM as PROXY_CONTENT, cN as SYNC_OBSERVERS, cO as TrackedDescriptor, cP as _getPath, cQ as _getProp, cR as _setProp, cS as activateObserver, cT as addArrayObserver, cU as addListener, cV as addNamespace, cW as addObserver, cX as alias, cY as arrayContentDidChange, cZ as arrayContentWillChange, c_ as autoComputed, c$ as beginPropertyChanges, d0 as cached, d1 as changeProperties, d2 as computed, d3 as createCache, d4 as defineDecorator, d5 as defineProperty, d6 as defineValue, d7 as descriptorForDecorator, d8 as descriptorForProperty, d9 as endPropertyChanges, da as expandProperties, db as findNamespace, dc as findNamespaces, dd as flushAsyncObservers, q as getCachedValueFor, de as getProperties, df as getValue, dg as hasListeners, dh as hasUnknownProperty, di as inject, dj as isClassicDecorator, dk as isComputed, dl as isConst, dm as isElementDescriptor, dn as isSearchDisabled, dp as LIBRARIES, dq as makeComputedDecorator, dr as markObjectAsDirty, ds as nativeDescDecorator, dt as notifyPropertyChange, du as objectAt, dv as on$1, dw as processAllNamespaces, dx as processNamespace, dy as removeArrayObserver, dz as removeListener, dA as removeNamespace, dB as removeObserver, dC as replace, dD as replaceInNativeArray, dE as revalidateObservers, dF as sendEvent, dG as setClassicDecorator, dH as setSearchDisabled, dI as setProperties, dJ as setUnprocessedMixins, dK as tagForObject, dL as tagForProperty, n as tracked, dM as trySet, dN as MutableArray, dO as ENV, dP as context, dQ as getENV, dR as getLookup, dS as global$1, dT as setLookup, dU as Meta, dV as UNDEFINED, dW as counters, dX as meta, dY as peekMeta, dZ as setMeta, d_ as ActionHandler, d$ as Comparable, e0 as ContainerProxyMixin, e1 as MutableEnumerable, e2 as RSVP$1, e3 as RegistryProxyMixin, e4 as TargetActionSupport, e5 as ProxyMixin, e6 as contentFor, e7 as Cache, e8 as GUID_KEY, e9 as ROOT, ea as canInvoke, eb as checkHasSuper, ec as makeDictionary, ed as enumerableSymbol, ee as generateGuid, ef as getDebugName$1, eg as getName, v as guidFor, eh as intern, ei as isInternalSymbol, ej as isObject, ek as isProxy, el as lookupDescriptor, em as observerListenerMetaFor, en as setListeners, eo as setName, ep as setObservers, eq as setProxy, er as setWithMandatorySetter, es as setupMandatorySetter, et as symbol, eu as teardownMandatorySetter, ev as toString, ew as uuid, ex as wrap, ey as ActionSupport, ez as ComponentLookup, eA as CoreView, eB as EventDispatcher, eC as MUTABLE_CELL, eD as states, eE as addChildView, eF as clearElementView, eG as clearViewElement, eH as constructStyleDeprecationMessage, eI as getChildViews, eJ as getElementView, eK as getRootViews, eL as getViewBoundingClientRect, eM as getViewBounds, eN as getViewClientRects, eO as getViewElement, eP as getViewId, eQ as isSimpleClick, eR as setElementView, eS as setViewElement, eT as CustomComponentManager, eU as CustomHelperManager, eV as CustomModifierManager, eW as capabilityFlagsFrom, eX as componentCapabilities, eY as getComponentTemplate, eZ as getCustomTagFor, e_ as getInternalComponentManager, e$ as getInternalHelperManager, f0 as getInternalModifierManager, f1 as hasCapability, f2 as hasDestroyable, f3 as hasInternalComponentManager, f4 as hasInternalHelperManager, f5 as hasInternalModifierManager, f6 as hasValue, f7 as helperCapabilities, f8 as managerHasCapability, f9 as modifierCapabilities, fa as setComponentManager, s as setComponentTemplate, fb as setCustomTagFor, fc as setHelperManager, fd as setInternalComponentManager, fe as setInternalHelperManager, ff as setInternalModifierManager, fg as setModifierManager, fh as FALSE_REFERENCE, fi as NULL_REFERENCE, fj as REFERENCE, fk as TRUE_REFERENCE, fl as UNDEFINED_REFERENCE, fm as childRefFor, fn as childRefFromParts, fo as createComputeRef, fp as createConstRef, fq as createDebugAliasRef, fr as createInvokableRef, fs as createIteratorItemRef, ft as createIteratorRef, fu as createPrimitiveRef, fv as createReadOnlyRef, fw as createUnboundRef, fx as isConstRef, fy as isInvokableRef, fz as isUpdatableRef, fA as updateRef, fB as valueForRef } from './main-DFVRdCgW.js';
export { fC as Application, fD as ApplicationNamespace, fE as Array, fF as ArrayProxy, fG as Component, fH as Controller, fI as Debug, fJ as EmberDestroyable, fK as EmberObject, fL as EnumerableMutable, fM as GlimmerComponent, fN as GlimmerRuntime, fO as GlimmerValidator, fP as Instrumentation, fK as Object, fQ as ObjectCore, fR as ObjectEvented, fS as ObjectObservable, fT as ObjectPromiseProxyMixin, fU as ObjectProxy, fV as Owner, fW as Runloop, fX as Service, fY as VERSION } from './main-DFVRdCgW.js';
export { i as ObjectInternals } from './internals-DHBZj8Gc.js';
export { i as GlimmerUtil } from './index-DVbDoIrL.js';

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
