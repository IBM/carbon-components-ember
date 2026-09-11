import { cc as configure, cd as _backburner, ce as _rsvpErrorQueue, cf as on, cg as getDispatchOverride, ch as EventTarget, ci as Promise$1, cj as all, ck as allSettled, cl as asap, cm as async, cn as cast, co as RSVP, cp as defer, cq as denodeify, cr as filter, cs as hash, ct as hashSettled, cu as map, cv as off, cw as race, cx as reject, cy as resolve, cz as rethrow, g as get, cA as set, cB as ASYNC_OBSERVERS, cC as ComputedDescriptor, cD as ComputedProperty, cE as DEBUG_INJECTION_FUNCTIONS, cF as Libraries, cG as NAMESPACES, cH as NAMESPACES_BY_ID, cI as PROPERTY_DID_CHANGE, cJ as PROXY_CONTENT, cK as SYNC_OBSERVERS, cL as TrackedDescriptor, cM as _getPath, cN as _getProp, cO as _setProp, cP as activateObserver, cQ as addArrayObserver, cR as addListener, cS as addNamespace, cT as addObserver, cU as alias, cV as arrayContentDidChange, cW as arrayContentWillChange, cX as autoComputed, cY as beginPropertyChanges, cZ as cached, c_ as changeProperties, c$ as computed, d0 as createCache, d1 as defineDecorator, d2 as defineProperty, d3 as defineValue, d4 as descriptorForDecorator, d5 as descriptorForProperty, d6 as endPropertyChanges, d7 as expandProperties, d8 as findNamespace, d9 as findNamespaces, da as flushAsyncObservers, q as getCachedValueFor, db as getProperties, dc as getValue, dd as hasListeners, de as hasUnknownProperty, df as inject, dg as isClassicDecorator, dh as isComputed, di as isConst, dj as isElementDescriptor, dk as isSearchDisabled, dl as LIBRARIES, dm as makeComputedDecorator, dn as markObjectAsDirty, dp as nativeDescDecorator, dq as notifyPropertyChange, dr as objectAt, ds as on$1, dt as processAllNamespaces, du as processNamespace, dv as removeArrayObserver, dw as removeListener, dx as removeNamespace, dy as removeObserver, dz as replace, dA as replaceInNativeArray, dB as revalidateObservers, dC as sendEvent, dD as setClassicDecorator, dE as setSearchDisabled, dF as setProperties, dG as setUnprocessedMixins, dH as tagForObject, dI as tagForProperty, n as tracked, dJ as trySet, dK as MutableArray, dL as ENV, dM as context, dN as getENV, dO as getLookup, dP as global$1, dQ as setLookup, dR as Meta, dS as UNDEFINED, dT as counters, dU as meta, dV as peekMeta, dW as setMeta, dX as ActionHandler, dY as Comparable, dZ as ContainerProxyMixin, d_ as MutableEnumerable, d$ as RSVP$1, e0 as RegistryProxyMixin, e1 as TargetActionSupport, e2 as ProxyMixin, e3 as contentFor, e4 as Cache, e5 as GUID_KEY, e6 as ROOT, e7 as canInvoke, e8 as checkHasSuper, e9 as makeDictionary, ea as enumerableSymbol, eb as generateGuid, ec as getDebugName$1, ed as getName, v as guidFor, ee as intern, ef as isInternalSymbol, eg as isObject, eh as isProxy, ei as lookupDescriptor, ej as observerListenerMetaFor, ek as setListeners, el as setName, em as setObservers, en as setProxy, eo as setWithMandatorySetter, ep as setupMandatorySetter, eq as symbol, er as teardownMandatorySetter, es as toString, et as uuid, eu as wrap, ev as ActionSupport, ew as ComponentLookup, ex as CoreView, ey as EventDispatcher, ez as MUTABLE_CELL, eA as states, eB as addChildView, eC as clearElementView, eD as clearViewElement, eE as constructStyleDeprecationMessage, eF as getChildViews, eG as getElementView, eH as getRootViews, eI as getViewBoundingClientRect, eJ as getViewBounds, eK as getViewClientRects, eL as getViewElement, eM as getViewId, eN as isSimpleClick, eO as setElementView, eP as setViewElement, eQ as CustomComponentManager, eR as CustomHelperManager, eS as CustomModifierManager, eT as capabilityFlagsFrom, eU as componentCapabilities, eV as getComponentTemplate, eW as getCustomTagFor, eX as getInternalComponentManager, eY as getInternalHelperManager, eZ as getInternalModifierManager, e_ as hasCapability, e$ as hasDestroyable, f0 as hasInternalComponentManager, f1 as hasInternalHelperManager, f2 as hasInternalModifierManager, f3 as hasValue, f4 as helperCapabilities, f5 as managerHasCapability, f6 as modifierCapabilities, f7 as setComponentManager, s as setComponentTemplate, f8 as setCustomTagFor, f9 as setHelperManager, fa as setInternalComponentManager, fb as setInternalHelperManager, fc as setInternalModifierManager, fd as setModifierManager, fe as FALSE_REFERENCE, ff as NULL_REFERENCE, fg as REFERENCE, fh as TRUE_REFERENCE, fi as UNDEFINED_REFERENCE, fj as childRefFor, fk as childRefFromParts, fl as createComputeRef, fm as createConstRef, fn as createDebugAliasRef, fo as createInvokableRef, fp as createIteratorItemRef, fq as createIteratorRef, fr as createPrimitiveRef, fs as createReadOnlyRef, ft as createUnboundRef, fu as isConstRef, fv as isInvokableRef, fw as isUpdatableRef, fx as updateRef, fy as valueForRef } from './main-D5h3ux0H.js';
export { fz as Application, fA as ApplicationNamespace, fB as Array, fC as ArrayProxy, fD as Component, fE as Controller, fF as Debug, fG as EmberDestroyable, fH as EmberObject, fI as EnumerableMutable, fJ as GlimmerComponent, fK as GlimmerRuntime, fL as GlimmerValidator, fM as Instrumentation, fH as Object, fN as ObjectCore, fO as ObjectEvented, fP as ObjectObservable, fQ as ObjectPromiseProxyMixin, fR as ObjectProxy, fS as Owner, fT as Runloop, fU as Service, fV as VERSION } from './main-D5h3ux0H.js';
export { i as ObjectInternals } from './internals-BunPXqVU.js';
export { i as GlimmerUtil } from './index-2kb-iYH6.js';

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
