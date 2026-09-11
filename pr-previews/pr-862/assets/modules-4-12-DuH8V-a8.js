import { cb as configure, cc as _backburner, cd as _rsvpErrorQueue, ce as on, cf as getDispatchOverride, cg as EventTarget, ch as Promise$1, ci as all, cj as allSettled, ck as asap, cl as async, cm as cast, cn as RSVP, co as defer, cp as denodeify, cq as filter, cr as hash, cs as hashSettled, ct as map, cu as off, cv as race, cw as reject, cx as resolve, cy as rethrow, g as get, cz as set, cA as ASYNC_OBSERVERS, cB as ComputedDescriptor, cC as ComputedProperty, cD as DEBUG_INJECTION_FUNCTIONS, cE as Libraries, cF as NAMESPACES, cG as NAMESPACES_BY_ID, cH as PROPERTY_DID_CHANGE, cI as PROXY_CONTENT, cJ as SYNC_OBSERVERS, cK as TrackedDescriptor, cL as _getPath, cM as _getProp, cN as _setProp, cO as activateObserver, cP as addArrayObserver, cQ as addListener, cR as addNamespace, cS as addObserver, cT as alias, cU as arrayContentDidChange, cV as arrayContentWillChange, cW as autoComputed, cX as beginPropertyChanges, cY as cached, cZ as changeProperties, c_ as computed, c$ as createCache, d0 as defineDecorator, d1 as defineProperty, d2 as defineValue, d3 as descriptorForDecorator, d4 as descriptorForProperty, d5 as endPropertyChanges, d6 as expandProperties, d7 as findNamespace, d8 as findNamespaces, d9 as flushAsyncObservers, q as getCachedValueFor, da as getProperties, db as getValue, dc as hasListeners, dd as hasUnknownProperty, de as inject, df as isClassicDecorator, dg as isComputed, dh as isConst, di as isElementDescriptor, dj as isSearchDisabled, dk as LIBRARIES, dl as makeComputedDecorator, dm as markObjectAsDirty, dn as nativeDescDecorator, dp as notifyPropertyChange, dq as objectAt, dr as on$1, ds as processAllNamespaces, dt as processNamespace, du as removeArrayObserver, dv as removeListener, dw as removeNamespace, dx as removeObserver, dy as replace, dz as replaceInNativeArray, dA as revalidateObservers, dB as sendEvent, dC as setClassicDecorator, dD as setSearchDisabled, dE as setProperties, dF as setUnprocessedMixins, dG as tagForObject, dH as tagForProperty, n as tracked, dI as trySet, dJ as MutableArray, dK as ENV, dL as context, dM as getENV, dN as getLookup, dO as global$1, dP as setLookup, dQ as Meta, dR as UNDEFINED, dS as counters, dT as meta, dU as peekMeta, dV as setMeta, dW as ActionHandler, dX as Comparable, dY as ContainerProxyMixin, dZ as MutableEnumerable, d_ as RSVP$1, d$ as RegistryProxyMixin, e0 as TargetActionSupport, e1 as ProxyMixin, e2 as contentFor, e3 as Cache, e4 as GUID_KEY, e5 as ROOT, e6 as canInvoke, e7 as checkHasSuper, e8 as makeDictionary, e9 as enumerableSymbol, ea as generateGuid, eb as getDebugName$1, ec as getName, v as guidFor, ed as intern, ee as isInternalSymbol, ef as isObject, eg as isProxy, eh as lookupDescriptor, ei as observerListenerMetaFor, ej as setListeners, ek as setName, el as setObservers, em as setProxy, en as setWithMandatorySetter, eo as setupMandatorySetter, ep as symbol, eq as teardownMandatorySetter, er as toString, es as uuid, et as wrap, eu as ActionSupport, ev as ComponentLookup, ew as CoreView, ex as EventDispatcher, ey as MUTABLE_CELL, ez as states, eA as addChildView, eB as clearElementView, eC as clearViewElement, eD as constructStyleDeprecationMessage, eE as getChildViews, eF as getElementView, eG as getRootViews, eH as getViewBoundingClientRect, eI as getViewBounds, eJ as getViewClientRects, eK as getViewElement, eL as getViewId, eM as isSimpleClick, eN as setElementView, eO as setViewElement, eP as CustomComponentManager, eQ as CustomHelperManager, eR as CustomModifierManager, eS as capabilityFlagsFrom, eT as componentCapabilities, eU as getComponentTemplate, eV as getCustomTagFor, eW as getInternalComponentManager, eX as getInternalHelperManager, eY as getInternalModifierManager, eZ as hasCapability, e_ as hasDestroyable, e$ as hasInternalComponentManager, f0 as hasInternalHelperManager, f1 as hasInternalModifierManager, f2 as hasValue, f3 as helperCapabilities, f4 as managerHasCapability, f5 as modifierCapabilities, f6 as setComponentManager, s as setComponentTemplate, f7 as setCustomTagFor, f8 as setHelperManager, f9 as setInternalComponentManager, fa as setInternalHelperManager, fb as setInternalModifierManager, fc as setModifierManager, fd as FALSE_REFERENCE, fe as NULL_REFERENCE, ff as REFERENCE, fg as TRUE_REFERENCE, fh as UNDEFINED_REFERENCE, fi as childRefFor, fj as childRefFromParts, fk as createComputeRef, fl as createConstRef, fm as createDebugAliasRef, fn as createInvokableRef, fo as createIteratorItemRef, fp as createIteratorRef, fq as createPrimitiveRef, fr as createReadOnlyRef, fs as createUnboundRef, ft as isConstRef, fu as isInvokableRef, fv as isUpdatableRef, fw as updateRef, fx as valueForRef } from './main-CfGJEi9V.js';
export { fy as Application, fz as ApplicationNamespace, fA as Array, fB as ArrayProxy, fC as Component, fD as Controller, fE as Debug, fF as EmberDestroyable, fG as EmberObject, fH as EnumerableMutable, fI as GlimmerComponent, fJ as GlimmerRuntime, fK as GlimmerValidator, fL as Instrumentation, fG as Object, fM as ObjectCore, fN as ObjectEvented, fO as ObjectObservable, fP as ObjectPromiseProxyMixin, fQ as ObjectProxy, fR as Owner, fS as Runloop, fT as Service, fU as VERSION } from './main-CfGJEi9V.js';
export { i as ObjectInternals } from './internals-B7ED-ezU.js';
export { i as GlimmerUtil } from './index-DAJXmlLx.js';

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
