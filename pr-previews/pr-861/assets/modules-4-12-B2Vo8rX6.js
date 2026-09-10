import { c2 as configure, c3 as _backburner, c4 as _rsvpErrorQueue, c5 as on, c6 as getDispatchOverride, c7 as EventTarget, c8 as Promise$1, c9 as all, ca as allSettled, cb as asap, cc as async, cd as cast, ce as RSVP, cf as defer, cg as denodeify, ch as filter, ci as hash, cj as hashSettled, ck as map, cl as off, cm as race, cn as reject, co as resolve, cp as rethrow, g as get, cq as set, cr as ASYNC_OBSERVERS, cs as ComputedDescriptor, ct as ComputedProperty, cu as DEBUG_INJECTION_FUNCTIONS, cv as Libraries, cw as NAMESPACES, cx as NAMESPACES_BY_ID, cy as PROPERTY_DID_CHANGE, cz as PROXY_CONTENT, cA as SYNC_OBSERVERS, cB as TrackedDescriptor, cC as _getPath, cD as _getProp, cE as _setProp, cF as activateObserver, cG as addArrayObserver, cH as addListener, cI as addNamespace, cJ as addObserver, cK as alias, cL as arrayContentDidChange, cM as arrayContentWillChange, cN as autoComputed, cO as beginPropertyChanges, cP as cached, cQ as changeProperties, cR as computed, cS as createCache, cT as defineDecorator, cU as defineProperty, cV as defineValue, cW as descriptorForDecorator, cX as descriptorForProperty, cY as endPropertyChanges, cZ as expandProperties, c_ as findNamespace, c$ as findNamespaces, d0 as flushAsyncObservers, q as getCachedValueFor, d1 as getProperties, d2 as getValue, d3 as hasListeners, d4 as hasUnknownProperty, d5 as inject, d6 as isClassicDecorator, d7 as isComputed, d8 as isConst, d9 as isElementDescriptor, da as isSearchDisabled, db as LIBRARIES, dc as makeComputedDecorator, dd as markObjectAsDirty, de as nativeDescDecorator, df as notifyPropertyChange, dg as objectAt, dh as on$1, di as processAllNamespaces, dj as processNamespace, dk as removeArrayObserver, dl as removeListener, dm as removeNamespace, dn as removeObserver, dp as replace, dq as replaceInNativeArray, dr as revalidateObservers, ds as sendEvent, dt as setClassicDecorator, du as setSearchDisabled, dv as setProperties, dw as setUnprocessedMixins, dx as tagForObject, dy as tagForProperty, n as tracked, dz as trySet, dA as MutableArray, dB as ENV, dC as context, dD as getENV, dE as getLookup, dF as global$1, dG as setLookup, dH as Meta, dI as UNDEFINED, dJ as counters, dK as meta, dL as peekMeta, dM as setMeta, dN as ActionHandler, dO as Comparable, dP as ContainerProxyMixin, dQ as MutableEnumerable, dR as RSVP$1, dS as RegistryProxyMixin, dT as TargetActionSupport, dU as ProxyMixin, dV as contentFor, dW as Cache, dX as GUID_KEY, dY as ROOT, dZ as canInvoke, d_ as checkHasSuper, d$ as makeDictionary, e0 as enumerableSymbol, e1 as generateGuid, e2 as getDebugName$1, e3 as getName, v as guidFor, e4 as intern, e5 as isInternalSymbol, e6 as isObject, e7 as isProxy, e8 as lookupDescriptor, e9 as observerListenerMetaFor, ea as setListeners, eb as setName, ec as setObservers, ed as setProxy, ee as setWithMandatorySetter, ef as setupMandatorySetter, eg as symbol, eh as teardownMandatorySetter, ei as toString, ej as uuid, ek as wrap, el as ActionSupport, em as ComponentLookup, en as CoreView, eo as EventDispatcher, ep as MUTABLE_CELL, eq as states, er as addChildView, es as clearElementView, et as clearViewElement, eu as constructStyleDeprecationMessage, ev as getChildViews, ew as getElementView, ex as getRootViews, ey as getViewBoundingClientRect, ez as getViewBounds, eA as getViewClientRects, eB as getViewElement, eC as getViewId, eD as isSimpleClick, eE as setElementView, eF as setViewElement, eG as CustomComponentManager, eH as CustomHelperManager, eI as CustomModifierManager, eJ as capabilityFlagsFrom, eK as componentCapabilities, eL as getComponentTemplate, eM as getCustomTagFor, eN as getInternalComponentManager, eO as getInternalHelperManager, eP as getInternalModifierManager, eQ as hasCapability, eR as hasDestroyable, eS as hasInternalComponentManager, eT as hasInternalHelperManager, eU as hasInternalModifierManager, eV as hasValue, eW as helperCapabilities, eX as managerHasCapability, eY as modifierCapabilities, eZ as setComponentManager, s as setComponentTemplate, e_ as setCustomTagFor, e$ as setHelperManager, f0 as setInternalComponentManager, f1 as setInternalHelperManager, f2 as setInternalModifierManager, f3 as setModifierManager, f4 as FALSE_REFERENCE, f5 as NULL_REFERENCE, f6 as REFERENCE, f7 as TRUE_REFERENCE, f8 as UNDEFINED_REFERENCE, f9 as childRefFor, fa as childRefFromParts, fb as createComputeRef, fc as createConstRef, fd as createDebugAliasRef, fe as createInvokableRef, ff as createIteratorItemRef, fg as createIteratorRef, fh as createPrimitiveRef, fi as createReadOnlyRef, fj as createUnboundRef, fk as isConstRef, fl as isInvokableRef, fm as isUpdatableRef, fn as updateRef, fo as valueForRef } from './main-C29ju28T.js';
export { fp as Application, fq as ApplicationNamespace, fr as Array, fs as ArrayProxy, ft as Component, fu as Controller, fv as Debug, fw as EmberDestroyable, fx as EmberObject, fy as EnumerableMutable, fz as GlimmerComponent, fA as GlimmerRuntime, fB as GlimmerValidator, fC as Instrumentation, fx as Object, fD as ObjectCore, fE as ObjectEvented, fF as ObjectObservable, fG as ObjectPromiseProxyMixin, fH as ObjectProxy, fI as Owner, fJ as Runloop, fK as Service, fL as VERSION } from './main-C29ju28T.js';
export { i as ObjectInternals } from './internals-B-i5K4Di.js';
export { i as GlimmerUtil } from './index-jmweOkne.js';

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
