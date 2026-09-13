import { cr as configure, cs as _backburner, ct as _rsvpErrorQueue, cu as on, cv as getDispatchOverride, cw as EventTarget, cx as Promise$1, cy as all, cz as allSettled, cA as asap, cB as async, cC as cast, cD as RSVP, cE as defer, cF as denodeify, cG as filter, cH as hash, cI as hashSettled, cJ as map, cK as off, cL as race, cM as reject, cN as resolve, cO as rethrow, g as get, cP as set, cQ as ASYNC_OBSERVERS, cR as ComputedDescriptor, cS as ComputedProperty, cT as DEBUG_INJECTION_FUNCTIONS, cU as Libraries, cV as NAMESPACES, cW as NAMESPACES_BY_ID, cX as PROPERTY_DID_CHANGE, cY as PROXY_CONTENT, cZ as SYNC_OBSERVERS, c_ as TrackedDescriptor, c$ as _getPath, d0 as _getProp, d1 as _setProp, d2 as activateObserver, d3 as addArrayObserver, d4 as addListener, d5 as addNamespace, d6 as addObserver, d7 as alias, d8 as arrayContentDidChange, d9 as arrayContentWillChange, da as autoComputed, db as beginPropertyChanges, dc as cached, dd as changeProperties, de as computed, df as createCache, dg as defineDecorator, dh as defineProperty, di as defineValue, dj as descriptorForDecorator, dk as descriptorForProperty, dl as endPropertyChanges, dm as expandProperties, dn as findNamespace, dp as findNamespaces, dq as flushAsyncObservers, q as getCachedValueFor, dr as getProperties, ds as getValue, dt as hasListeners, du as hasUnknownProperty, dv as inject, dw as isClassicDecorator, dx as isComputed, dy as isConst, dz as isElementDescriptor, dA as isSearchDisabled, dB as LIBRARIES, dC as makeComputedDecorator, dD as markObjectAsDirty, dE as nativeDescDecorator, dF as notifyPropertyChange, dG as objectAt, dH as on$1, dI as processAllNamespaces, dJ as processNamespace, dK as removeArrayObserver, dL as removeListener, dM as removeNamespace, dN as removeObserver, dO as replace, dP as replaceInNativeArray, dQ as revalidateObservers, dR as sendEvent, dS as setClassicDecorator, dT as setSearchDisabled, dU as setProperties, dV as setUnprocessedMixins, dW as tagForObject, dX as tagForProperty, n as tracked, dY as trySet, dZ as MutableArray, d_ as ENV, d$ as context, e0 as getENV, e1 as getLookup, e2 as global$1, e3 as setLookup, e4 as Meta, e5 as UNDEFINED, e6 as counters, e7 as meta, e8 as peekMeta, e9 as setMeta, ea as ActionHandler, eb as Comparable, ec as ContainerProxyMixin, ed as MutableEnumerable, ee as RSVP$1, ef as RegistryProxyMixin, eg as TargetActionSupport, eh as ProxyMixin, ei as contentFor, ej as Cache, ek as GUID_KEY, el as ROOT, em as canInvoke, en as checkHasSuper, eo as makeDictionary, ep as enumerableSymbol, eq as generateGuid, er as getDebugName$1, es as getName, v as guidFor, et as intern, eu as isInternalSymbol, ev as isObject, ew as isProxy, ex as lookupDescriptor, ey as observerListenerMetaFor, ez as setListeners, eA as setName, eB as setObservers, eC as setProxy, eD as setWithMandatorySetter, eE as setupMandatorySetter, eF as symbol, eG as teardownMandatorySetter, eH as toString, eI as uuid, eJ as wrap, eK as ActionSupport, eL as ComponentLookup, eM as CoreView, eN as EventDispatcher, eO as MUTABLE_CELL, eP as states, eQ as addChildView, eR as clearElementView, eS as clearViewElement, eT as constructStyleDeprecationMessage, eU as getChildViews, eV as getElementView, eW as getRootViews, eX as getViewBoundingClientRect, eY as getViewBounds, eZ as getViewClientRects, e_ as getViewElement, e$ as getViewId, f0 as isSimpleClick, f1 as setElementView, f2 as setViewElement, f3 as CustomComponentManager, f4 as CustomHelperManager, f5 as CustomModifierManager, f6 as capabilityFlagsFrom, f7 as componentCapabilities, f8 as getComponentTemplate, f9 as getCustomTagFor, fa as getInternalComponentManager, fb as getInternalHelperManager, fc as getInternalModifierManager, fd as hasCapability, fe as hasDestroyable, ff as hasInternalComponentManager, fg as hasInternalHelperManager, fh as hasInternalModifierManager, fi as hasValue, fj as helperCapabilities, fk as managerHasCapability, fl as modifierCapabilities, fm as setComponentManager, s as setComponentTemplate, fn as setCustomTagFor, fo as setHelperManager, fp as setInternalComponentManager, fq as setInternalHelperManager, fr as setInternalModifierManager, fs as setModifierManager, ft as FALSE_REFERENCE, fu as NULL_REFERENCE, fv as REFERENCE, fw as TRUE_REFERENCE, fx as UNDEFINED_REFERENCE, fy as childRefFor, fz as childRefFromParts, fA as createComputeRef, fB as createConstRef, fC as createDebugAliasRef, fD as createInvokableRef, fE as createIteratorItemRef, fF as createIteratorRef, fG as createPrimitiveRef, fH as createReadOnlyRef, fI as createUnboundRef, fJ as isConstRef, fK as isInvokableRef, fL as isUpdatableRef, fM as updateRef, fN as valueForRef } from './main-DD4_jcpP.js';
export { fO as Application, fP as ApplicationNamespace, fQ as Array, fR as ArrayProxy, fS as Component, fT as Controller, fU as Debug, fV as EmberDestroyable, fW as EmberObject, fX as EnumerableMutable, fY as GlimmerComponent, fZ as GlimmerRuntime, f_ as GlimmerValidator, f$ as Instrumentation, fW as Object, g0 as ObjectCore, g1 as ObjectEvented, g2 as ObjectObservable, g3 as ObjectPromiseProxyMixin, g4 as ObjectProxy, g5 as Owner, g6 as Runloop, g7 as Service, g8 as VERSION } from './main-DD4_jcpP.js';
export { i as ObjectInternals } from './internals-Bwpsweop.js';
export { i as GlimmerUtil } from './index-Bmh6O27p.js';

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
