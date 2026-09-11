import { ca as configure, cb as _backburner, cc as _rsvpErrorQueue, cd as on, ce as getDispatchOverride, cf as EventTarget, cg as Promise$1, ch as all, ci as allSettled, cj as asap, ck as async, cl as cast, cm as RSVP, cn as defer, co as denodeify, cp as filter, cq as hash, cr as hashSettled, cs as map, ct as off, cu as race, cv as reject, cw as resolve, cx as rethrow, g as get, cy as set, cz as ASYNC_OBSERVERS, cA as ComputedDescriptor, cB as ComputedProperty, cC as DEBUG_INJECTION_FUNCTIONS, cD as Libraries, cE as NAMESPACES, cF as NAMESPACES_BY_ID, cG as PROPERTY_DID_CHANGE, cH as PROXY_CONTENT, cI as SYNC_OBSERVERS, cJ as TrackedDescriptor, cK as _getPath, cL as _getProp, cM as _setProp, cN as activateObserver, cO as addArrayObserver, cP as addListener, cQ as addNamespace, cR as addObserver, cS as alias, cT as arrayContentDidChange, cU as arrayContentWillChange, cV as autoComputed, cW as beginPropertyChanges, cX as cached, cY as changeProperties, cZ as computed, c_ as createCache, c$ as defineDecorator, d0 as defineProperty, d1 as defineValue, d2 as descriptorForDecorator, d3 as descriptorForProperty, d4 as endPropertyChanges, d5 as expandProperties, d6 as findNamespace, d7 as findNamespaces, d8 as flushAsyncObservers, q as getCachedValueFor, d9 as getProperties, da as getValue, db as hasListeners, dc as hasUnknownProperty, dd as inject, de as isClassicDecorator, df as isComputed, dg as isConst, dh as isElementDescriptor, di as isSearchDisabled, dj as LIBRARIES, dk as makeComputedDecorator, dl as markObjectAsDirty, dm as nativeDescDecorator, dn as notifyPropertyChange, dp as objectAt, dq as on$1, dr as processAllNamespaces, ds as processNamespace, dt as removeArrayObserver, du as removeListener, dv as removeNamespace, dw as removeObserver, dx as replace, dy as replaceInNativeArray, dz as revalidateObservers, dA as sendEvent, dB as setClassicDecorator, dC as setSearchDisabled, dD as setProperties, dE as setUnprocessedMixins, dF as tagForObject, dG as tagForProperty, n as tracked, dH as trySet, dI as MutableArray, dJ as ENV, dK as context, dL as getENV, dM as getLookup, dN as global$1, dO as setLookup, dP as Meta, dQ as UNDEFINED, dR as counters, dS as meta, dT as peekMeta, dU as setMeta, dV as ActionHandler, dW as Comparable, dX as ContainerProxyMixin, dY as MutableEnumerable, dZ as RSVP$1, d_ as RegistryProxyMixin, d$ as TargetActionSupport, e0 as ProxyMixin, e1 as contentFor, e2 as Cache, e3 as GUID_KEY, e4 as ROOT, e5 as canInvoke, e6 as checkHasSuper, e7 as makeDictionary, e8 as enumerableSymbol, e9 as generateGuid, ea as getDebugName$1, eb as getName, v as guidFor, ec as intern, ed as isInternalSymbol, ee as isObject, ef as isProxy, eg as lookupDescriptor, eh as observerListenerMetaFor, ei as setListeners, ej as setName, ek as setObservers, el as setProxy, em as setWithMandatorySetter, en as setupMandatorySetter, eo as symbol, ep as teardownMandatorySetter, eq as toString, er as uuid, es as wrap, et as ActionSupport, eu as ComponentLookup, ev as CoreView, ew as EventDispatcher, ex as MUTABLE_CELL, ey as states, ez as addChildView, eA as clearElementView, eB as clearViewElement, eC as constructStyleDeprecationMessage, eD as getChildViews, eE as getElementView, eF as getRootViews, eG as getViewBoundingClientRect, eH as getViewBounds, eI as getViewClientRects, eJ as getViewElement, eK as getViewId, eL as isSimpleClick, eM as setElementView, eN as setViewElement, eO as CustomComponentManager, eP as CustomHelperManager, eQ as CustomModifierManager, eR as capabilityFlagsFrom, eS as componentCapabilities, eT as getComponentTemplate, eU as getCustomTagFor, eV as getInternalComponentManager, eW as getInternalHelperManager, eX as getInternalModifierManager, eY as hasCapability, eZ as hasDestroyable, e_ as hasInternalComponentManager, e$ as hasInternalHelperManager, f0 as hasInternalModifierManager, f1 as hasValue, f2 as helperCapabilities, f3 as managerHasCapability, f4 as modifierCapabilities, f5 as setComponentManager, s as setComponentTemplate, f6 as setCustomTagFor, f7 as setHelperManager, f8 as setInternalComponentManager, f9 as setInternalHelperManager, fa as setInternalModifierManager, fb as setModifierManager, fc as FALSE_REFERENCE, fd as NULL_REFERENCE, fe as REFERENCE, ff as TRUE_REFERENCE, fg as UNDEFINED_REFERENCE, fh as childRefFor, fi as childRefFromParts, fj as createComputeRef, fk as createConstRef, fl as createDebugAliasRef, fm as createInvokableRef, fn as createIteratorItemRef, fo as createIteratorRef, fp as createPrimitiveRef, fq as createReadOnlyRef, fr as createUnboundRef, fs as isConstRef, ft as isInvokableRef, fu as isUpdatableRef, fv as updateRef, fw as valueForRef } from './main-C6BPec2A.js';
export { fx as Application, fy as ApplicationNamespace, fz as Array, fA as ArrayProxy, fB as Component, fC as Controller, fD as Debug, fE as EmberDestroyable, fF as EmberObject, fG as EnumerableMutable, fH as GlimmerComponent, fI as GlimmerRuntime, fJ as GlimmerValidator, fK as Instrumentation, fF as Object, fL as ObjectCore, fM as ObjectEvented, fN as ObjectObservable, fO as ObjectPromiseProxyMixin, fP as ObjectProxy, fQ as Owner, fR as Runloop, fS as Service, fT as VERSION } from './main-C6BPec2A.js';
export { i as ObjectInternals } from './internals-CVo8wjhq.js';
export { i as GlimmerUtil } from './index-BllXbNNX.js';

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
