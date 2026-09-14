import { ct as configure, cu as _backburner, cv as _rsvpErrorQueue, cw as on, cx as getDispatchOverride, cy as EventTarget, cz as Promise$1, cA as all, cB as allSettled, cC as asap, cD as async, cE as cast, cF as RSVP, cG as defer, cH as denodeify, cI as filter, cJ as hash, cK as hashSettled, cL as map, cM as off, cN as race, cO as reject, cP as resolve, cQ as rethrow, g as get, cR as set, cS as ASYNC_OBSERVERS, cT as ComputedDescriptor, cU as ComputedProperty, cV as DEBUG_INJECTION_FUNCTIONS, cW as Libraries, cX as NAMESPACES, cY as NAMESPACES_BY_ID, cZ as PROPERTY_DID_CHANGE, c_ as PROXY_CONTENT, c$ as SYNC_OBSERVERS, d0 as TrackedDescriptor, d1 as _getPath, d2 as _getProp, d3 as _setProp, d4 as activateObserver, d5 as addArrayObserver, d6 as addListener, d7 as addNamespace, d8 as addObserver, d9 as alias, da as arrayContentDidChange, db as arrayContentWillChange, dc as autoComputed, dd as beginPropertyChanges, de as cached, df as changeProperties, dg as computed, dh as createCache, di as defineDecorator, dj as defineProperty, dk as defineValue, dl as descriptorForDecorator, dm as descriptorForProperty, dn as endPropertyChanges, dp as expandProperties, dq as findNamespace, dr as findNamespaces, ds as flushAsyncObservers, q as getCachedValueFor, dt as getProperties, du as getValue, dv as hasListeners, dw as hasUnknownProperty, dx as inject, dy as isClassicDecorator, dz as isComputed, dA as isConst, dB as isElementDescriptor, dC as isSearchDisabled, dD as LIBRARIES, dE as makeComputedDecorator, dF as markObjectAsDirty, dG as nativeDescDecorator, dH as notifyPropertyChange, dI as objectAt, dJ as on$1, dK as processAllNamespaces, dL as processNamespace, dM as removeArrayObserver, dN as removeListener, dO as removeNamespace, dP as removeObserver, dQ as replace, dR as replaceInNativeArray, dS as revalidateObservers, dT as sendEvent, dU as setClassicDecorator, dV as setSearchDisabled, dW as setProperties, dX as setUnprocessedMixins, dY as tagForObject, dZ as tagForProperty, n as tracked, d_ as trySet, d$ as MutableArray, e0 as ENV, e1 as context, e2 as getENV, e3 as getLookup, e4 as global$1, e5 as setLookup, e6 as Meta, e7 as UNDEFINED, e8 as counters, e9 as meta, ea as peekMeta, eb as setMeta, ec as ActionHandler, ed as Comparable, ee as ContainerProxyMixin, ef as MutableEnumerable, eg as RSVP$1, eh as RegistryProxyMixin, ei as TargetActionSupport, ej as ProxyMixin, ek as contentFor, el as Cache, em as GUID_KEY, en as ROOT, eo as canInvoke, ep as checkHasSuper, eq as makeDictionary, er as enumerableSymbol, es as generateGuid, et as getDebugName$1, eu as getName, v as guidFor, ev as intern, ew as isInternalSymbol, ex as isObject, ey as isProxy, ez as lookupDescriptor, eA as observerListenerMetaFor, eB as setListeners, eC as setName, eD as setObservers, eE as setProxy, eF as setWithMandatorySetter, eG as setupMandatorySetter, eH as symbol, eI as teardownMandatorySetter, eJ as toString, eK as uuid, eL as wrap, eM as ActionSupport, eN as ComponentLookup, eO as CoreView, eP as EventDispatcher, eQ as MUTABLE_CELL, eR as states, eS as addChildView, eT as clearElementView, eU as clearViewElement, eV as constructStyleDeprecationMessage, eW as getChildViews, eX as getElementView, eY as getRootViews, eZ as getViewBoundingClientRect, e_ as getViewBounds, e$ as getViewClientRects, f0 as getViewElement, f1 as getViewId, f2 as isSimpleClick, f3 as setElementView, f4 as setViewElement, f5 as CustomComponentManager, f6 as CustomHelperManager, f7 as CustomModifierManager, f8 as capabilityFlagsFrom, f9 as componentCapabilities, fa as getComponentTemplate, fb as getCustomTagFor, fc as getInternalComponentManager, fd as getInternalHelperManager, fe as getInternalModifierManager, ff as hasCapability, fg as hasDestroyable, fh as hasInternalComponentManager, fi as hasInternalHelperManager, fj as hasInternalModifierManager, fk as hasValue, fl as helperCapabilities, fm as managerHasCapability, fn as modifierCapabilities, fo as setComponentManager, s as setComponentTemplate, fp as setCustomTagFor, fq as setHelperManager, fr as setInternalComponentManager, fs as setInternalHelperManager, ft as setInternalModifierManager, fu as setModifierManager, fv as FALSE_REFERENCE, fw as NULL_REFERENCE, fx as REFERENCE, fy as TRUE_REFERENCE, fz as UNDEFINED_REFERENCE, fA as childRefFor, fB as childRefFromParts, fC as createComputeRef, fD as createConstRef, fE as createDebugAliasRef, fF as createInvokableRef, fG as createIteratorItemRef, fH as createIteratorRef, fI as createPrimitiveRef, fJ as createReadOnlyRef, fK as createUnboundRef, fL as isConstRef, fM as isInvokableRef, fN as isUpdatableRef, fO as updateRef, fP as valueForRef } from './main-BT1poVBG.js';
export { fQ as Application, fR as ApplicationNamespace, fS as Array, fT as ArrayProxy, fU as Component, fV as Controller, fW as Debug, fX as EmberDestroyable, fY as EmberObject, fZ as EnumerableMutable, f_ as GlimmerComponent, f$ as GlimmerRuntime, g0 as GlimmerValidator, g1 as Instrumentation, fY as Object, g2 as ObjectCore, g3 as ObjectEvented, g4 as ObjectObservable, g5 as ObjectPromiseProxyMixin, g6 as ObjectProxy, g7 as Owner, g8 as Runloop, g9 as Service, ga as VERSION } from './main-BT1poVBG.js';
export { i as ObjectInternals } from './internals-B0six5Nx.js';
export { i as GlimmerUtil } from './index-BZP7cvXW.js';

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
