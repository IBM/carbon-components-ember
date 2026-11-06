/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const TABSTER_ATTRIBUTE_NAME = "data-tabster";
const TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME = "data-tabster-dummy";
const FOCUSABLE_SELECTOR = `:is(${["a[href]", "button", "input", "select", "textarea", "*[tabindex]", "*[contenteditable]", "details > summary", "audio[controls]", "video[controls]"].join(", ")}):not(:disabled)`;
const AsyncFocusSources = {
  EscapeGroupper: 1,
  Restorer: 2,
  Deloser: 3
};
const RestoreFocusOrders = {
  History: 0,
  DeloserDefault: 1,
  RootDefault: 2,
  DeloserFirst: 3,
  RootFirst: 4
};
const DeloserStrategies = {
  /**
   * If the focus is lost, the focus will be restored automatically using all available focus history.
   * This is the default strategy.
   */
  Auto: 0,
  /**
   * If the focus is lost from this Deloser instance, the focus will not be restored automatically.
   * The application might listen to the event and restore the focus manually.
   * But if it is lost from another Deloser instance, the history of this Deloser could be used finding
   * the element to focus.
   */
  Manual: 1
};
const Visibilities = {
  Invisible: 0,
  PartiallyVisible: 1,
  Visible: 2
};
const MoverDirections = {
  Both: 0,
  // Default, both left/up keys move to the previous, right/down move to the next.
  Vertical: 1,
  // Only up/down arrows move to the next/previous.
  Horizontal: 2,
  // Only left/right arrows move to the next/previous.
  Grid: 3,
  // Two-dimentional movement depending on the visual placement.
  GridLinear: 4 // Two-dimentional movement depending on the visual placement. Allows linear movement.
};
const MoverKeys = {
  ArrowUp: 1,
  ArrowDown: 2,
  ArrowLeft: 3,
  ArrowRight: 4,
  PageUp: 5,
  PageDown: 6,
  Home: 7,
  End: 8
};
const SysDummyInputsPositions = {
  // Tabster will always place dummy inputs inside the container.
  Outside: 2 // Tabster will always place dummy inputs outside of the container.
};

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function getTabsterOnElement(tabster, element) {
  return tabster.storageEntry(element)?.tabster;
}
function updateTabsterByAttribute(tabster, element, dispose) {
  const newAttrValue = dispose || tabster._noop ? void 0 : element.getAttribute(TABSTER_ATTRIBUTE_NAME);
  let entry = tabster.storageEntry(element);
  let newAttr;
  if (newAttrValue) {
    if (newAttrValue !== entry?.attr?.string) {
      try {
        const newValue = JSON.parse(newAttrValue);
        if (typeof newValue !== "object") {
          throw new Error(`Value is not a JSON object, got '${newAttrValue}'.`);
        }
        newAttr = {
          string: newAttrValue,
          object: newValue
        };
      } catch (e) {
      }
    } else {
      return;
    }
  } else if (!entry) {
    return;
  }
  if (!entry) {
    entry = tabster.storageEntry(element, true);
  }
  if (!entry.tabster) {
    entry.tabster = {};
  }
  const tabsterOnElement = entry.tabster || {};
  const oldTabsterProps = entry.attr?.object || {};
  const newTabsterProps = newAttr?.object || {};
  for (const key of Object.keys(oldTabsterProps)) {
    if (!newTabsterProps[key]) {
      if (key === "root") {
        const root = tabsterOnElement[key];
        if (root) {
          tabster.root.onRoot(root, true);
        }
      }
      switch (key) {
        case "deloser":
        case "root":
        case "groupper":
        case "modalizer":
        case "restorer":
        case "mover":
          const part = tabsterOnElement[key];
          if (part) {
            part.dispose();
            delete tabsterOnElement[key];
          }
          break;
        case "observed":
          delete tabsterOnElement[key];
          if (tabster.observedElement) {
            tabster.observedElement.onObservedElementUpdate(element);
          }
          break;
        case "focusable":
        case "outline":
        case "uncontrolled":
        case "sys":
          delete tabsterOnElement[key];
          break;
      }
    }
  }
  for (const key of Object.keys(newTabsterProps)) {
    const sys = newTabsterProps.sys;
    switch (key) {
      case "root":
        if (tabsterOnElement.root) {
          tabsterOnElement.root.setProps(newTabsterProps.root);
        } else {
          tabsterOnElement.root = tabster.root.createRoot(element, newTabsterProps.root, sys);
        }
        tabster.root.onRoot(tabsterOnElement.root);
        break;
      case "focusable":
        tabsterOnElement.focusable = newTabsterProps.focusable;
        break;
      case "observed":
        if (tabster.observedElement) {
          tabsterOnElement.observed = newTabsterProps.observed;
          tabster.observedElement.onObservedElementUpdate(element);
        }
        break;
      case "uncontrolled":
        tabsterOnElement.uncontrolled = newTabsterProps.uncontrolled;
        break;
      case "outline":
        if (tabster.outline) {
          tabsterOnElement.outline = newTabsterProps.outline;
        }
        break;
      case "sys":
        tabsterOnElement.sys = newTabsterProps.sys;
        break;
      default: {
        const handler = tabster.attrHandlers.get(key);
        if (handler) {
          tabsterOnElement[key] = handler(element, tabsterOnElement[key], newTabsterProps[key], oldTabsterProps?.[key], sys);
        }
      }
    }
  }
  if (newAttr) {
    entry.attr = newAttr;
  } else {
    if (Object.keys(tabsterOnElement).length === 0) {
      delete entry.tabster;
      delete entry.attr;
    }
    tabster.storageEntry(element, false);
  }
}

/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
const addEventListener = (target, type, handler) => {
  target.addEventListener(type, handler, true);
};
const removeEventListener = (target, type, handler) => {
  target.removeEventListener(type, handler, true);
};
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
const KEYBORG_FOCUSIN = "keyborg:focusin";
const KEYBORG_FOCUSOUT = "keyborg:focusout";
const FOCUS_IN_HANDLER = 0;
const FOCUS_OUT_HANDLER = 1;
const SHADOW_TARGETS = 2;
const LAST_FOCUSED_PROGRAMMATICALLY = 3;
function canOverrideNativeFocus(win) {
  const HTMLElement = win.HTMLElement;
  const origFocus = HTMLElement.prototype.focus;
  let isCustomFocusCalled = false;
  HTMLElement.prototype.focus = function focus() {
    isCustomFocusCalled = true;
  };
  win.document.createElement("button").focus();
  HTMLElement.prototype.focus = origFocus;
  return isCustomFocusCalled;
}
let _canOverrideNativeFocus = false;
function nativeFocus(element) {
  const focus = element.focus;
  if (focus.__keyborgNativeFocus) focus.__keyborgNativeFocus.call(element);
  else element.focus();
}
function setupFocusEvent(win) {
  const kwin = win;
  const doc = kwin.document;
  const proto = kwin.HTMLElement.prototype;
  if (!_canOverrideNativeFocus) _canOverrideNativeFocus = canOverrideNativeFocus(kwin);
  const origFocus = proto.focus;
  if (origFocus.__keyborgNativeFocus) return;
  proto.focus = focus;
  const shadowTargets = /* @__PURE__ */ new Set();
  const focusOutHandler = (e) => {
    const target = e.target;
    if (!target) return;
    const event = new CustomEvent(KEYBORG_FOCUSOUT, {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: {
        originalEvent: e
      }
    });
    target.dispatchEvent(event);
  };
  const focusInHandler = (e) => {
    const target = e.target;
    if (!target) return;
    let node = e.composedPath()[0];
    const currentShadows = /* @__PURE__ */ new Set();
    while (node) if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      currentShadows.add(node);
      node = node.host;
    } else node = node.parentNode;
    for (const shadowRootWeakRef of shadowTargets) {
      const shadowRoot = shadowRootWeakRef.deref();
      if (!shadowRoot || !currentShadows.has(shadowRoot)) {
        shadowTargets.delete(shadowRootWeakRef);
        if (shadowRoot) {
          removeEventListener(shadowRoot, "focusin", focusInHandler);
          removeEventListener(shadowRoot, "focusout", focusOutHandler);
        }
      }
    }
    onFocusIn(target, e.relatedTarget || void 0);
  };
  const onFocusIn = (target, relatedTarget, originalEvent) => {
    const shadowRoot = target.shadowRoot;
    if (shadowRoot) {
      for (const shadowRootWeakRef of shadowTargets) if (shadowRootWeakRef.deref() === shadowRoot) return;
      addEventListener(shadowRoot, "focusin", focusInHandler);
      addEventListener(shadowRoot, "focusout", focusOutHandler);
      shadowTargets.add(new WeakRef(shadowRoot));
      return;
    }
    const details = {
      relatedTarget,
      originalEvent
    };
    const event = new CustomEvent(KEYBORG_FOCUSIN, {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: details
    });
    event.details = details;
    if (_canOverrideNativeFocus || data[LAST_FOCUSED_PROGRAMMATICALLY]) {
      details.isFocusedProgrammatically = target === data[LAST_FOCUSED_PROGRAMMATICALLY]?.deref();
      data[LAST_FOCUSED_PROGRAMMATICALLY] = void 0;
    }
    target.dispatchEvent(event);
  };
  const data = [focusInHandler, focusOutHandler, shadowTargets];
  kwin.__keyborgData = data;
  addEventListener(doc, "focusin", focusInHandler);
  addEventListener(doc, "focusout", focusOutHandler);
  function focus() {
    const d = kwin.__keyborgData;
    if (d) d[LAST_FOCUSED_PROGRAMMATICALLY] = new WeakRef(this);
    return origFocus.apply(this, arguments);
  }
  let activeElement = doc.activeElement;
  while (activeElement && activeElement.shadowRoot) {
    onFocusIn(activeElement);
    activeElement = activeElement.shadowRoot.activeElement;
  }
  focus.__keyborgNativeFocus = origFocus;
}
function disposeFocusEvent(win) {
  const kwin = win;
  const proto = kwin.HTMLElement.prototype;
  const origFocus = proto.focus.__keyborgNativeFocus;
  const data = kwin.__keyborgData;
  if (data) {
    const doc = kwin.document;
    removeEventListener(doc, "focusin", data[FOCUS_IN_HANDLER]);
    removeEventListener(doc, "focusout", data[FOCUS_OUT_HANDLER]);
    for (const shadowRootWeakRef of data[SHADOW_TARGETS]) {
      const shadowRoot = shadowRootWeakRef.deref();
      if (shadowRoot) {
        removeEventListener(shadowRoot, "focusin", data[FOCUS_IN_HANDLER]);
        removeEventListener(shadowRoot, "focusout", data[FOCUS_OUT_HANDLER]);
      }
    }
    data[SHADOW_TARGETS].clear();
    delete kwin.__keyborgData;
  }
  if (origFocus) proto.focus = origFocus;
}
let _lastId = 0;
function createKeyborgCore(targetWindow, props) {
  let currentTargetWindow = targetWindow;
  let isNavigating = false;
  let isMouseOrTouchUsedTimer;
  const broadcast = () => {
    const refs = currentTargetWindow?.__keyborg?.refs;
    if (refs) for (const id of Object.keys(refs)) refs[id]._cb.forEach((cb) => cb(isNavigating));
  };
  const setNavigating = (val) => {
    if (isNavigating !== val) {
      isNavigating = val;
      broadcast();
    }
  };
  const shouldTrigger = (e) => {
    if (e.key === "Tab") return true;
    const active = currentTargetWindow?.document.activeElement;
    const isEditable = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
    return !isEditable;
  };
  const onFocusIn = (e) => {
    if (isMouseOrTouchUsedTimer) return;
    if (isNavigating) return;
    const details = e.detail;
    if (!details.relatedTarget) return;
    if (details.isFocusedProgrammatically || details.isFocusedProgrammatically === void 0) return;
    setNavigating(true);
  };
  const onMouseOrTouch = () => {
    if (currentTargetWindow) {
      if (isMouseOrTouchUsedTimer) currentTargetWindow.clearTimeout(isMouseOrTouchUsedTimer);
      isMouseOrTouchUsedTimer = currentTargetWindow.setTimeout(() => {
        isMouseOrTouchUsedTimer = void 0;
      }, 1e3);
    }
    setNavigating(false);
  };
  const onMouseDown = (e) => {
    if (e.buttons === 0 || e.clientX === 0 && e.clientY === 0 && e.screenX === 0 && e.screenY === 0) return;
    onMouseOrTouch();
  };
  const onKeyDown = (e) => {
    if (isNavigating) ; else if (shouldTrigger(e)) setNavigating(true);
  };
  const targetDocument = targetWindow.document;
  addEventListener(targetDocument, KEYBORG_FOCUSIN, onFocusIn);
  addEventListener(targetDocument, "mousedown", onMouseDown);
  addEventListener(targetWindow, "keydown", onKeyDown);
  addEventListener(targetDocument, "touchstart", onMouseOrTouch);
  addEventListener(targetDocument, "touchend", onMouseOrTouch);
  addEventListener(targetDocument, "touchcancel", onMouseOrTouch);
  setupFocusEvent(targetWindow);
  const dispose = () => {
    if (!currentTargetWindow) return;
    if (isMouseOrTouchUsedTimer) {
      currentTargetWindow.clearTimeout(isMouseOrTouchUsedTimer);
      isMouseOrTouchUsedTimer = void 0;
    }
    disposeFocusEvent(currentTargetWindow);
    const targetDocument2 = currentTargetWindow.document;
    removeEventListener(targetDocument2, KEYBORG_FOCUSIN, onFocusIn);
    removeEventListener(targetDocument2, "mousedown", onMouseDown);
    removeEventListener(currentTargetWindow, "keydown", onKeyDown);
    removeEventListener(targetDocument2, "touchstart", onMouseOrTouch);
    removeEventListener(targetDocument2, "touchend", onMouseOrTouch);
    removeEventListener(targetDocument2, "touchcancel", onMouseOrTouch);
    currentTargetWindow = void 0;
  };
  return {
    dispose,
    get isNavigatingWithKeyboard() {
      return isNavigating;
    },
    set isNavigatingWithKeyboard(val) {
      setNavigating(val);
    }
  };
}
function createKeyborg(win, props) {
  const kwin = win;
  const id = "k" + ++_lastId;
  let localWin = kwin;
  let core;
  const callbacks = [];
  const existing = kwin.__keyborg;
  if (existing) core = existing.core;
  else core = createKeyborgCore(kwin);
  const instance = {
    isNavigatingWithKeyboard() {
      return !!core?.isNavigatingWithKeyboard;
    },
    subscribe(callback) {
      callbacks.push(callback);
    },
    unsubscribe(callback) {
      const index = callbacks.indexOf(callback);
      if (index >= 0) callbacks.splice(index, 1);
    },
    setVal(val) {
      if (core) core.isNavigatingWithKeyboard = val;
    },
    _cb: callbacks,
    dispose() {
      const wkb = localWin?.__keyborg;
      if (wkb?.refs[id]) {
        delete wkb.refs[id];
        if (Object.keys(wkb.refs).length === 0) {
          wkb.core.dispose();
          delete localWin.__keyborg;
        }
      }
      callbacks.length = 0;
      core = void 0;
      localWin = void 0;
    }
  };
  if (existing) existing.refs[id] = instance;
  else kwin.__keyborg = {
    core,
    refs: {
      [id]: instance
    }
  };
  return instance;
}
function disposeKeyborg(instance) {
  instance.dispose();
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Events sent by Tabster.
 */
const TabsterFocusInEventName = "tabster:focusin";
const TabsterFocusOutEventName = "tabster:focusout";
// Event is dispatched when Tabster wants to move focus as the result of
// handling keyboard event. This allows to preventDefault() if you want to have
// some custom logic.
const TabsterMoveFocusEventName = "tabster:movefocus";
/**
 * Events sent by Deloser.
 */
const DeloserFocusLostEventName = "tabster:deloser:focus-lost";
/**
 * Events to be sent to Deloser by the application.
 */
const DeloserRestoreFocusEventName = "tabster:deloser:restore-focus";
/**
 * Events sent by Mover.
 */
const MoverStateEventName = "tabster:mover:state";
/**
 * Events to be sent to Mover by the application.
 */
// Event that can be dispatched by the application to programmatically move
// focus inside Mover.
const MoverMoveFocusEventName = "tabster:mover:movefocus";
// Event that can be dispatched by the application to forget or modify
// memorized element in Mover with memorizeCurrent property.
const MoverMemorizedElementEventName = "tabster:mover:memorized-element";
/**
 * Events sent by Root.
 */
const RootFocusEventName = "tabster:root:focus";
const RootBlurEventName = "tabster:root:blur";
// Node.js environments do not have CustomEvent and it is needed for the events to be
// evaluated. It doesn't matter if it works or not in Node.js environment.
// So, we just need to make sure that it doesn't throw undefined reference.
const CustomEvent_ = typeof CustomEvent !== "undefined" ? CustomEvent : function () {
  /* no-op */
};
class TabsterCustomEvent extends CustomEvent_ {
  /**
   * @deprecated use `detail`.
   */
  details;
  constructor(type, detail) {
    super(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail
    });
    this.details = detail;
  }
}
class TabsterFocusInEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(TabsterFocusInEventName, detail);
  }
}
class TabsterFocusOutEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(TabsterFocusOutEventName, detail);
  }
}
class TabsterMoveFocusEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(TabsterMoveFocusEventName, detail);
  }
}
class MoverStateEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(MoverStateEventName, detail);
  }
}
class DeloserFocusLostEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(DeloserFocusLostEventName, detail);
  }
}
class RootFocusEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(RootFocusEventName, detail);
  }
}
class RootBlurEvent extends TabsterCustomEvent {
  constructor(detail) {
    super(RootBlurEventName, detail);
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const _createMutationObserver = callback => new MutationObserver(callback);
const _createTreeWalker = (doc, root, whatToShow, filter) => doc.createTreeWalker(root, whatToShow, filter);
const _getParentNode = node => node ? node.parentNode : null;
const _getParentElement = element => element ? element.parentElement : null;
const _nodeContains = (parent, child) => !!(child && parent?.contains(child));
const _getActiveElement = doc => doc.activeElement;
const _querySelector = (element, selector) => element.querySelector(selector);
const _querySelectorAll = (element, selector) => Array.prototype.slice.call(element.querySelectorAll(selector), 0);
const _getElementById = (doc, id) => doc.getElementById(id);
const _getFirstChild = node => node?.firstChild || null;
const _getLastChild = node => node?.lastChild || null;
const _getNextSibling = node => node?.nextSibling || null;
const _getPreviousSibling = node => node?.previousSibling || null;
const _getFirstElementChild = element => element?.firstElementChild || null;
const _getLastElementChild = element => element?.lastElementChild || null;
const _getNextElementSibling = element => element?.nextElementSibling || null;
const _getPreviousElementSibling = element => element?.previousElementSibling || null;
const _appendChild = (parent, child) => parent.appendChild(child);
const _insertBefore = (parent, child, referenceChild) => parent.insertBefore(child, referenceChild);
const _getSelection = ref => ref.ownerDocument?.getSelection() || null;
const _getElementsByName = (referenceElement, name) => referenceElement.ownerDocument.getElementsByName(name);
const dom = {
  createMutationObserver: _createMutationObserver,
  createTreeWalker: _createTreeWalker,
  getParentNode: _getParentNode,
  getParentElement: _getParentElement,
  nodeContains: _nodeContains,
  getActiveElement: _getActiveElement,
  querySelector: _querySelector,
  querySelectorAll: _querySelectorAll,
  getElementById: _getElementById,
  getFirstChild: _getFirstChild,
  getLastChild: _getLastChild,
  getNextSibling: _getNextSibling,
  getPreviousSibling: _getPreviousSibling,
  getFirstElementChild: _getFirstElementChild,
  getLastElementChild: _getLastElementChild,
  getNextElementSibling: _getNextElementSibling,
  getPreviousElementSibling: _getPreviousElementSibling,
  appendChild: _appendChild,
  insertBefore: _insertBefore,
  getSelection: _getSelection,
  getElementsByName: _getElementsByName
};
function setDOMAPI(domapi) {
  for (const key of Object.keys(domapi)) {
    dom[key] = domapi[key];
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
let _uidCounter = 0;
function getInstanceContext(getWindow) {
  const win = getWindow();
  let ctx = win.__tabsterInstanceContext;
  if (!ctx) {
    ctx = {
      elementByUId: {},
      containerBoundingRectCache: {},
      lastContainerBoundingRectCacheId: 0
    };
    win.__tabsterInstanceContext = ctx;
  }
  return ctx;
}
function disposeInstanceContext(win) {
  const ctx = win.__tabsterInstanceContext;
  if (ctx) {
    ctx.elementByUId = {};
    ctx.containerBoundingRectCache = {};
    if (ctx.containerBoundingRectCacheTimer) {
      win.clearTimeout(ctx.containerBoundingRectCacheTimer);
    }
    delete win.__tabsterInstanceContext;
  }
}
function hasSubFocusable(element) {
  return !!element.querySelector(FOCUSABLE_SELECTOR);
}
class WeakHTMLElement {
  _ref;
  _data;
  constructor(element, data) {
    this._ref = new WeakRef(element);
    this._data = data;
  }
  get() {
    const ref = this._ref;
    let element;
    if (ref) {
      element = ref.deref();
      if (!element) {
        delete this._ref;
      }
    }
    return element;
  }
  getData() {
    return this._data;
  }
}
function createElementTreeWalker(doc, root, acceptNode) {
  if (root.nodeType !== Node.ELEMENT_NODE) {
    return undefined;
  }
  return dom.createTreeWalker(doc, root, NodeFilter.SHOW_ELEMENT, {
    acceptNode
  });
}
function getBoundingRect(getWindow, element) {
  let cacheId = element.__tabsterCacheId;
  const context = getInstanceContext(getWindow);
  const cached = cacheId ? context.containerBoundingRectCache[cacheId] : undefined;
  if (cached) {
    return cached.rect;
  }
  const scrollingElement = element.ownerDocument && element.ownerDocument.documentElement;
  if (!scrollingElement) {
    return new DOMRect();
  }
  // A bounding rect of the top-level element contains the whole page regardless of the
  // scrollbar. So, we improvise a little and limiting the final result...
  let left = 0;
  let top = 0;
  let right = scrollingElement.clientWidth;
  let bottom = scrollingElement.clientHeight;
  if (element !== scrollingElement) {
    const r = element.getBoundingClientRect();
    left = Math.max(left, r.left);
    top = Math.max(top, r.top);
    right = Math.min(right, r.right);
    bottom = Math.min(bottom, r.bottom);
  }
  const rect = new DOMRect(left < right ? left : -1, top < bottom ? top : -1, left < right ? right - left : 0, top < bottom ? bottom - top : 0);
  if (!cacheId) {
    cacheId = "r-" + ++context.lastContainerBoundingRectCacheId;
    element.__tabsterCacheId = cacheId;
  }
  context.containerBoundingRectCache[cacheId] = {
    rect,
    element
  };
  if (!context.containerBoundingRectCacheTimer) {
    context.containerBoundingRectCacheTimer = window.setTimeout(() => {
      context.containerBoundingRectCacheTimer = undefined;
      for (const cId of Object.keys(context.containerBoundingRectCache)) {
        delete context.containerBoundingRectCache[cId].element.__tabsterCacheId;
      }
      context.containerBoundingRectCache = {};
    }, 50);
  }
  return rect;
}
function isElementVerticallyVisibleInContainer(getWindow, element, tolerance) {
  const container = getScrollableContainer(element);
  if (!container) {
    return false;
  }
  const containerRect = getBoundingRect(getWindow, container);
  const elementRect = element.getBoundingClientRect();
  const intersectionTolerance = elementRect.height * (1 - tolerance);
  const topIntersection = Math.max(0, containerRect.top - elementRect.top);
  const bottomIntersection = Math.max(0, elementRect.bottom - containerRect.bottom);
  const totalIntersection = topIntersection + bottomIntersection;
  return totalIntersection === 0 || totalIntersection <= intersectionTolerance;
}
function scrollIntoView(getWindow, element, alignToTop) {
  // Built-in DOM's scrollIntoView() is cool, but when we have nested containers,
  // it scrolls all of them, not just the deepest one. So, trying to work it around.
  const container = getScrollableContainer(element);
  if (container) {
    const containerRect = getBoundingRect(getWindow, container);
    const elementRect = element.getBoundingClientRect();
    if (alignToTop) {
      container.scrollTop += elementRect.top - containerRect.top;
    } else {
      container.scrollTop += elementRect.bottom - containerRect.bottom;
    }
  }
}
function getScrollableContainer(element) {
  const doc = element.ownerDocument;
  if (doc) {
    for (let el = dom.getParentElement(element); el; el = dom.getParentElement(el)) {
      if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
        return el;
      }
    }
    return doc.documentElement;
  }
  return null;
}
function makeFocusIgnored(element) {
  element.__shouldIgnoreFocus = true;
}
function shouldIgnoreFocus(element) {
  return !!element.__shouldIgnoreFocus;
}
function getUId(wnd) {
  const rnd = new Uint32Array(4);
  wnd.crypto.getRandomValues(rnd);
  const srnd = [];
  for (let i = 0; i < rnd.length; i++) {
    srnd.push(rnd[i].toString(36));
  }
  srnd.push("|");
  srnd.push((++_uidCounter).toString(36));
  srnd.push("|");
  srnd.push(Date.now().toString(36));
  return srnd.join("");
}
function getElementUId(getWindow, element) {
  const context = getInstanceContext(getWindow);
  let uid = element.__tabsterElementUID;
  if (!uid) {
    uid = element.__tabsterElementUID = getUId(getWindow());
  }
  if (!context.elementByUId[uid] && documentContains(element.ownerDocument, element)) {
    context.elementByUId[uid] = new WeakHTMLElement(element);
  }
  return uid;
}
function clearElementCache(getWindow, parent) {
  const context = getInstanceContext(getWindow);
  for (const key of Object.keys(context.elementByUId)) {
    const wel = context.elementByUId[key];
    const el = wel && wel.get();
    if (el && parent) {
      if (!dom.nodeContains(parent, el)) {
        continue;
      }
    }
    delete context.elementByUId[key];
  }
}
// Uses `dom.nodeContains` so the shadow-DOM / iframe abstraction can override it.
function documentContains(doc, element) {
  return dom.nodeContains(doc?.body, element);
}
function matchesSelector(element, selector) {
  return typeof element.matches === "function" && element.matches(selector);
}
let _lastTabsterPartId = 0;
class TabsterPart {
  _tabster;
  _element;
  _props;
  id;
  constructor(tabster, element, props) {
    this._tabster = tabster;
    this._element = new WeakHTMLElement(element);
    this._props = {
      ...props
    };
    this.id = "i" + ++_lastTabsterPartId;
  }
  getElement() {
    return this._element.get();
  }
  getProps() {
    return this._props;
  }
  setProps(props) {
    this._props = {
      ...props
    };
  }
}
function getLastChild(container) {
  let lastChild = null;
  for (let i = dom.getLastElementChild(container); i; i = dom.getLastElementChild(i)) {
    lastChild = i;
  }
  return lastChild || undefined;
}
function isDisplayNone(element) {
  const elementDocument = element.ownerDocument;
  const computedStyle = elementDocument.defaultView?.getComputedStyle(element);
  // offsetParent is null for elements with display:none, display:fixed and for <body>.
  if (element.offsetParent === null && elementDocument.body !== element && computedStyle?.position !== "fixed") {
    return true;
  }
  // For our purposes of looking for focusable elements, visibility:hidden has the same
  // effect as display:none.
  if (computedStyle?.visibility === "hidden") {
    return true;
  }
  // if an element has display: fixed, we need to check if it is also hidden with CSS,
  // or within a parent hidden with CSS
  if (computedStyle?.position === "fixed") {
    if (computedStyle.display === "none") {
      return true;
    }
    if (element.parentElement?.offsetParent === null && elementDocument.body !== element.parentElement) {
      return true;
    }
  }
  return false;
}
function isRadio(element) {
  return element.tagName === "INPUT" && !!element.name && element.type === "radio";
}
function getRadioButtonGroup(element) {
  if (!isRadio(element)) {
    return;
  }
  const name = element.name;
  let radioButtons = Array.from(dom.getElementsByName(element, name));
  let checked;
  radioButtons = radioButtons.filter(el => {
    if (isRadio(el)) {
      if (el.checked) {
        checked = el;
      }
      return true;
    }
    return false;
  });
  return {
    name,
    buttons: new Set(radioButtons),
    checked
  };
}
/**
 * If the passed element is Tabster dummy input, returns the container element this dummy input belongs to.
 * @param element Element to check for being dummy input.
 * @returns Dummy input container element (if the passed element is a dummy input) or null.
 */

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const _updateDummyInputsTimeout = 100;
class DummyInput {
  _isPhantom;
  _fixedTarget;
  _disposeTimer;
  _clearDisposeTimeout;
  input;
  useDefaultAction;
  isFirst;
  isOutside;
  /** Called when the input is focused */
  onFocusIn;
  /** Called when the input is blurred */
  onFocusOut;
  constructor(getWindow, isOutside, props, element, fixedTarget) {
    const win = getWindow();
    const input = win.document.createElement("i");
    input.tabIndex = 0;
    input.setAttribute("role", "none");
    input.setAttribute(TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME, "");
    input.setAttribute("aria-hidden", "true");
    const style = input.style;
    style.position = "fixed";
    style.width = style.height = "1px";
    style.opacity = "0.001";
    style.zIndex = "-1";
    style.setProperty("content-visibility", "hidden");
    makeFocusIgnored(input);
    this.input = input;
    this.isFirst = props.isFirst;
    this.isOutside = isOutside;
    this._isPhantom = props.isPhantom ?? false;
    this._fixedTarget = fixedTarget;
    input.addEventListener("focusin", this._focusIn);
    input.addEventListener("focusout", this._focusOut);
    input.__tabsterDummyContainer = element;
    if (this._isPhantom) {
      this._disposeTimer = win.setTimeout(() => {
        delete this._disposeTimer;
        this.dispose();
      }, 0);
      this._clearDisposeTimeout = () => {
        if (this._disposeTimer) {
          win.clearTimeout(this._disposeTimer);
          delete this._disposeTimer;
        }
        delete this._clearDisposeTimeout;
      };
    }
  }
  dispose() {
    if (this._clearDisposeTimeout) {
      this._clearDisposeTimeout();
    }
    const input = this.input;
    if (!input) {
      return;
    }
    delete this._fixedTarget;
    delete this.onFocusIn;
    delete this.onFocusOut;
    delete this.input;
    input.removeEventListener("focusin", this._focusIn);
    input.removeEventListener("focusout", this._focusOut);
    delete input.__tabsterDummyContainer;
    dom.getParentNode(input)?.removeChild(input);
  }
  setTopLeft(top, left) {
    const style = this.input?.style;
    if (style) {
      style.top = `${top}px`;
      style.left = `${left}px`;
    }
  }
  _isBackward(isIn, current, previous) {
    return isIn && !previous ? !this.isFirst : !!(previous && current.compareDocumentPosition(previous) & Node.DOCUMENT_POSITION_FOLLOWING);
  }
  _focusIn = (e) => {
    if (this._fixedTarget) {
      const target = this._fixedTarget.get();
      if (target) {
        nativeFocus(target);
      }
      return;
    }
    const input = this.input;
    if (this.onFocusIn && input) {
      const relatedTarget = e.relatedTarget;
      this.onFocusIn(this, this._isBackward(true, input, relatedTarget), relatedTarget);
    }
  };
  _focusOut = (e) => {
    if (this._fixedTarget) {
      return;
    }
    this.useDefaultAction = false;
    const input = this.input;
    if (this.onFocusOut && input) {
      const relatedTarget = e.relatedTarget;
      this.onFocusOut(this, this._isBackward(false, input, relatedTarget), relatedTarget);
    }
  };
}
const DummyInputManagerPriorities = {
  Root: 1,
  Mover: 3};
class DummyInputManager {
  _instance;
  _onFocusIn;
  _onFocusOut;
  _element;
  constructor(tabster, element, priority, sys, outsideByDefault, callForDefaultAction) {
    this._element = element;
    this._instance = new DummyInputManagerCore(tabster, element, this, priority, sys, outsideByDefault, callForDefaultAction);
  }
  _setHandlers(onFocusIn, onFocusOut) {
    this._onFocusIn = onFocusIn;
    this._onFocusOut = onFocusOut;
  }
  moveOut(backwards) {
    this._instance?.moveOut(backwards);
  }
  moveOutWithDefaultAction(backwards, relatedEvent) {
    this._instance?.moveOutWithDefaultAction(backwards, relatedEvent);
  }
  getHandler(isIn) {
    return isIn ? this._onFocusIn : this._onFocusOut;
  }
  setTabbable(tabbable) {
    this._instance?.setTabbable(this, tabbable);
  }
  dispose() {
    if (this._instance) {
      this._instance.dispose(this);
      delete this._instance;
    }
    delete this._onFocusIn;
    delete this._onFocusOut;
  }
  static moveWithPhantomDummy(tabster, element, moveOutOfElement, isBackward, relatedEvent) {
    const dummy = new DummyInput(tabster.getWindow, true, {
      isPhantom: true,
      isFirst: true
    });
    const input = dummy.input;
    if (input) {
      let parent;
      let insertBefore;
      if (element.tagName === "BODY") {
        parent = element;
        insertBefore = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? dom.getFirstElementChild(element) : null;
      } else {
        if (moveOutOfElement && (!isBackward || isBackward && !tabster.focusable.isFocusable(element, false, true, true))) {
          parent = element;
          insertBefore = isBackward ? element.firstElementChild : null;
        } else {
          parent = dom.getParentElement(element);
          insertBefore = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? element : dom.getNextElementSibling(element);
        }
        let potentialDummy;
        let dummyFor;
        do {
          potentialDummy = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? dom.getPreviousElementSibling(insertBefore) : insertBefore;
          dummyFor = getDummyInputContainer(potentialDummy);
          if (dummyFor === element) {
            insertBefore = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? potentialDummy : dom.getNextElementSibling(potentialDummy);
          } else {
            dummyFor = null;
          }
        } while (dummyFor);
      }
      if (parent?.dispatchEvent(new TabsterMoveFocusEvent({
        by: "root",
        owner: parent,
        next: null,
        relatedEvent
      }))) {
        dom.insertBefore(parent, input, insertBefore);
        nativeFocus(input);
      }
    }
  }
  static addPhantomDummyWithTarget(tabster, sourceElement, isBackward, targetElement) {
    const dummy = new DummyInput(tabster.getWindow, true, {
      isPhantom: true,
      isFirst: true
    }, void 0, new WeakHTMLElement(targetElement));
    const input = dummy.input;
    if (input) {
      let dummyParent;
      let insertBefore;
      if (hasSubFocusable(sourceElement) && !isBackward) {
        dummyParent = sourceElement;
        insertBefore = dom.getFirstElementChild(sourceElement);
      } else {
        dummyParent = dom.getParentElement(sourceElement);
        insertBefore = isBackward ? sourceElement : dom.getNextElementSibling(sourceElement);
      }
      if (dummyParent) {
        dom.insertBefore(dummyParent, input, insertBefore);
      }
    }
  }
}
class DummyInputObserver {
  _win;
  _updateQueue = /* @__PURE__ */ new Set();
  _updateTimer;
  _lastUpdateQueueTime = 0;
  _changedParents = /* @__PURE__ */ new WeakSet();
  _updateDummyInputsTimer;
  _dummyElements = [];
  _dummyCallbacks = /* @__PURE__ */ new WeakMap();
  constructor(win) {
    this._win = win;
  }
  add(dummy, callback) {
    if (!this._dummyCallbacks.has(dummy) && this._win) {
      this._dummyElements.push(new WeakHTMLElement(dummy));
      this._dummyCallbacks.set(dummy, callback);
      this.domChanged = this._domChanged;
    }
  }
  remove(dummy) {
    this._dummyElements = this._dummyElements.filter((ref) => {
      const element = ref.get();
      return element && element !== dummy;
    });
    this._dummyCallbacks.delete(dummy);
    if (this._dummyElements.length === 0) {
      delete this.domChanged;
    }
  }
  dispose() {
    const win = this._win?.();
    if (this._updateTimer) {
      win?.clearTimeout(this._updateTimer);
      delete this._updateTimer;
    }
    if (this._updateDummyInputsTimer) {
      win?.clearTimeout(this._updateDummyInputsTimer);
      delete this._updateDummyInputsTimer;
    }
    this._changedParents = /* @__PURE__ */ new WeakSet();
    this._dummyCallbacks = /* @__PURE__ */ new WeakMap();
    this._dummyElements = [];
    this._updateQueue.clear();
    delete this.domChanged;
    delete this._win;
  }
  _domChanged = (parent) => {
    if (this._changedParents.has(parent)) {
      return;
    }
    this._changedParents.add(parent);
    if (this._updateDummyInputsTimer) {
      return;
    }
    this._updateDummyInputsTimer = this._win?.().setTimeout(() => {
      delete this._updateDummyInputsTimer;
      for (const ref of this._dummyElements) {
        const dummyElement = ref.get();
        if (dummyElement) {
          const callback = this._dummyCallbacks.get(dummyElement);
          if (callback) {
            const dummyParent = dom.getParentNode(dummyElement);
            if (!dummyParent || this._changedParents.has(dummyParent)) {
              callback();
            }
          }
        }
      }
      this._changedParents = /* @__PURE__ */ new WeakSet();
    }, _updateDummyInputsTimeout);
  };
  updatePositions(compute) {
    if (!this._win) {
      return;
    }
    this._updateQueue.add(compute);
    this._lastUpdateQueueTime = Date.now();
    this._scheduledUpdatePositions();
  }
  _scheduledUpdatePositions() {
    if (this._updateTimer) {
      return;
    }
    this._updateTimer = this._win?.().setTimeout(() => {
      delete this._updateTimer;
      if (this._lastUpdateQueueTime + _updateDummyInputsTimeout <= Date.now()) {
        const scrollTopLeftCache = /* @__PURE__ */ new Map();
        const setTopLeftCallbacks = [];
        for (const compute of this._updateQueue) {
          setTopLeftCallbacks.push(compute(scrollTopLeftCache));
        }
        this._updateQueue.clear();
        for (const setTopLeft of setTopLeftCallbacks) {
          setTopLeft();
        }
        scrollTopLeftCache.clear();
      } else {
        this._scheduledUpdatePositions();
      }
    }, _updateDummyInputsTimeout);
  }
}
class DummyInputManagerCore {
  _tabster;
  _addTimer;
  _getWindow;
  _wrappers = [];
  _element;
  _isOutside = false;
  _firstDummy;
  _lastDummy;
  _transformElements = /* @__PURE__ */ new Set();
  _callForDefaultAction;
  constructor(tabster, element, manager, priority, sys, outsideByDefault, callForDefaultAction) {
    const el = element.get();
    if (!el) {
      throw new Error("No element");
    }
    this._tabster = tabster;
    this._getWindow = tabster.getWindow;
    this._callForDefaultAction = callForDefaultAction;
    const instance = el.__tabsterDummy;
    (instance || this)._wrappers.push({
      manager,
      priority,
      tabbable: true
    });
    if (instance) {
      return instance;
    }
    el.__tabsterDummy = this;
    const forcedDummyPosition = sys?.dummyInputsPosition;
    const tagName = el.tagName;
    this._isOutside = !forcedDummyPosition ? (outsideByDefault || tagName === "UL" || tagName === "OL" || tagName === "TABLE") && !(tagName === "LI" || tagName === "TD" || tagName === "TH") : forcedDummyPosition === SysDummyInputsPositions.Outside;
    this._firstDummy = new DummyInput(this._getWindow, this._isOutside, {
      isFirst: true
    }, element);
    this._lastDummy = new DummyInput(this._getWindow, this._isOutside, {
      isFirst: false
    }, element);
    const dummyElement = this._firstDummy.input;
    dummyElement && tabster._dummyObserver.add(dummyElement, this._addDummyInputs);
    this._firstDummy.onFocusIn = this._onFocusIn;
    this._firstDummy.onFocusOut = this._onFocusOut;
    this._lastDummy.onFocusIn = this._onFocusIn;
    this._lastDummy.onFocusOut = this._onFocusOut;
    this._element = element;
    this._addDummyInputs();
  }
  dispose(manager, force) {
    const wrappers = this._wrappers = this._wrappers.filter((w) => w.manager !== manager && !force);
    if (wrappers.length === 0) {
      delete (this._element?.get()).__tabsterDummy;
      for (const el of this._transformElements) {
        el.removeEventListener("scroll", this._addTransformOffsets);
      }
      this._transformElements.clear();
      const win = this._getWindow();
      if (this._addTimer) {
        win.clearTimeout(this._addTimer);
        delete this._addTimer;
      }
      const dummyElement = this._firstDummy?.input;
      dummyElement && this._tabster._dummyObserver.remove(dummyElement);
      this._firstDummy?.dispose();
      this._lastDummy?.dispose();
    }
  }
  _onFocus(isIn, dummyInput, isBackward, relatedTarget) {
    const wrapper = this._getCurrent();
    if (wrapper && (!dummyInput.useDefaultAction || this._callForDefaultAction)) {
      wrapper.manager.getHandler(isIn)?.(dummyInput, isBackward, relatedTarget);
    }
  }
  _onFocusIn = (dummyInput, isBackward, relatedTarget) => {
    this._onFocus(true, dummyInput, isBackward, relatedTarget);
  };
  _onFocusOut = (dummyInput, isBackward, relatedTarget) => {
    this._onFocus(false, dummyInput, isBackward, relatedTarget);
  };
  moveOut = (backwards) => {
    const first = this._firstDummy;
    const last = this._lastDummy;
    if (first && last) {
      this._ensurePosition();
      const firstInput = first.input;
      const lastInput = last.input;
      const element = this._element?.get();
      if (firstInput && lastInput && element) {
        let toFocus;
        if (backwards) {
          firstInput.tabIndex = 0;
          toFocus = firstInput;
        } else {
          lastInput.tabIndex = 0;
          toFocus = lastInput;
        }
        if (toFocus) {
          nativeFocus(toFocus);
        }
      }
    }
  };
  /**
   * Prepares to move focus out of the given element by focusing
   * one of the dummy inputs and setting the `useDefaultAction` flag
   * @param backwards focus moving to an element behind the given element
   */
  moveOutWithDefaultAction = (backwards, relatedEvent) => {
    const first = this._firstDummy;
    const last = this._lastDummy;
    if (first && last) {
      this._ensurePosition();
      const firstInput = first.input;
      const lastInput = last.input;
      const element = this._element?.get();
      if (firstInput && lastInput && element) {
        let toFocus;
        if (backwards) {
          if (!first.isOutside && this._tabster.focusable.isFocusable(element, true, true, true)) {
            toFocus = element;
          } else {
            first.useDefaultAction = true;
            firstInput.tabIndex = 0;
            toFocus = firstInput;
          }
        } else {
          last.useDefaultAction = true;
          lastInput.tabIndex = 0;
          toFocus = lastInput;
        }
        if (toFocus && element.dispatchEvent(new TabsterMoveFocusEvent({
          by: "root",
          owner: element,
          next: null,
          relatedEvent
        }))) {
          nativeFocus(toFocus);
        }
      }
    }
  };
  setTabbable = (manager, tabbable) => {
    for (const w of this._wrappers) {
      if (w.manager === manager) {
        w.tabbable = tabbable;
        break;
      }
    }
    const wrapper = this._getCurrent();
    if (wrapper) {
      const tabIndex = wrapper.tabbable ? 0 : -1;
      let input = this._firstDummy?.input;
      if (input) {
        input.tabIndex = tabIndex;
      }
      input = this._lastDummy?.input;
      if (input) {
        input.tabIndex = tabIndex;
      }
    }
  };
  _getCurrent() {
    this._wrappers.sort((a, b) => {
      if (a.tabbable !== b.tabbable) {
        return a.tabbable ? -1 : 1;
      }
      return a.priority - b.priority;
    });
    return this._wrappers[0];
  }
  /**
   * Adds dummy inputs as the first and last child of the given element
   * Called each time the children under the element is mutated
   */
  _addDummyInputs = () => {
    if (this._addTimer) {
      return;
    }
    this._addTimer = this._getWindow().setTimeout(() => {
      delete this._addTimer;
      this._ensurePosition();
      this._addTransformOffsets();
    }, 0);
  };
  _ensurePosition() {
    const element = this._element?.get();
    const firstDummyInput = this._firstDummy?.input;
    const lastDummyInput = this._lastDummy?.input;
    if (!element || !firstDummyInput || !lastDummyInput) {
      return;
    }
    if (this._isOutside) {
      const elementParent = dom.getParentNode(element);
      if (elementParent) {
        const nextSibling = dom.getNextSibling(element);
        if (nextSibling !== lastDummyInput) {
          dom.insertBefore(elementParent, lastDummyInput, nextSibling);
        }
        if (dom.getPreviousElementSibling(element) !== firstDummyInput) {
          dom.insertBefore(elementParent, firstDummyInput, element);
        }
      }
    } else {
      if (dom.getLastElementChild(element) !== lastDummyInput) {
        dom.appendChild(element, lastDummyInput);
      }
      const firstElementChild = dom.getFirstElementChild(element);
      if (firstElementChild && firstElementChild !== firstDummyInput && firstElementChild.parentNode) {
        dom.insertBefore(firstElementChild.parentNode, firstDummyInput, firstElementChild);
      }
    }
  }
  _addTransformOffsets = () => {
    this._tabster._dummyObserver.updatePositions(this._computeTransformOffsets);
  };
  _computeTransformOffsets = (scrollTopLeftCache) => {
    const from = this._firstDummy?.input || this._lastDummy?.input;
    const transformElements = this._transformElements;
    const newTransformElements = /* @__PURE__ */ new Set();
    let scrollTop = 0;
    let scrollLeft = 0;
    const win = this._getWindow();
    for (let element = from; element && element.nodeType === Node.ELEMENT_NODE; element = dom.getParentElement(element)) {
      let scrollTopLeft = scrollTopLeftCache.get(element);
      if (scrollTopLeft === void 0) {
        const transform = win.getComputedStyle(element).transform;
        if (transform && transform !== "none") {
          scrollTopLeft = {
            scrollTop: element.scrollTop,
            scrollLeft: element.scrollLeft
          };
        }
        scrollTopLeftCache.set(element, scrollTopLeft || null);
      }
      if (scrollTopLeft) {
        newTransformElements.add(element);
        if (!transformElements.has(element)) {
          element.addEventListener("scroll", this._addTransformOffsets);
        }
        scrollTop += scrollTopLeft.scrollTop;
        scrollLeft += scrollTopLeft.scrollLeft;
      }
    }
    for (const el of transformElements) {
      if (!newTransformElements.has(el)) {
        el.removeEventListener("scroll", this._addTransformOffsets);
      }
    }
    this._transformElements = newTransformElements;
    return () => {
      this._firstDummy?.setTopLeft(scrollTop, scrollLeft);
      this._lastDummy?.setTopLeft(scrollTop, scrollLeft);
    };
  };
}
function getDummyInputContainer(element) {
  return element?.__tabsterDummyContainer?.get() || null;
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function getTabsterAttribute(props, plain) {
  const attr = JSON.stringify(props);
  {
    return attr;
  }
}
function mergeTabsterProps(props, newProps) {
  for (const key of Object.keys(newProps)) {
    const value = newProps[key];
    if (value) {
      props[key] = value;
    } else {
      delete props[key];
    }
  }
}
function setTabsterAttribute(element, newProps, update) {
  let props;
  if (update) {
    const attr = element.getAttribute(TABSTER_ATTRIBUTE_NAME);
    if (attr) {
      try {
        props = JSON.parse(attr);
      } catch (e) {
      }
    }
  }
  if (!props) {
    props = {};
  }
  mergeTabsterProps(props, newProps);
  if (Object.keys(props).length > 0) {
    element.setAttribute(TABSTER_ATTRIBUTE_NAME, getTabsterAttribute(props));
  } else {
    element.removeAttribute(TABSTER_ATTRIBUTE_NAME);
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class RootDummyManager extends DummyInputManager {
  _tabster;
  _setFocused;
  constructor(tabster, element, setFocused, sys) {
    super(tabster, element, DummyInputManagerPriorities.Root, sys, void 0, true);
    this._setHandlers(this._onDummyInputFocus);
    this._tabster = tabster;
    this._setFocused = setFocused;
  }
  _onDummyInputFocus = (dummyInput) => {
    if (dummyInput.useDefaultAction) {
      this._setFocused(false);
    } else {
      this._tabster.keyboardNavigation.setNavigatingWithKeyboard(true);
      const element = this._element.get();
      if (element) {
        this._setFocused(true);
        const toFocus = this._tabster.focusedElement.getFirstOrLastTabbable(dummyInput.isFirst, {
          container: element,
          ignoreAccessibility: true
        });
        if (toFocus) {
          nativeFocus(toFocus);
          return;
        }
      }
      dummyInput.input?.blur();
    }
  };
}
class Root extends TabsterPart {
  uid;
  _dummyManager;
  _sys;
  _isFocused = false;
  _setFocusedTimer;
  _onDispose;
  constructor(tabster, element, onDispose, props, sys) {
    super(tabster, element, props);
    this._onDispose = onDispose;
    const win = tabster.getWindow;
    this.uid = getElementUId(win, element);
    this._sys = sys;
    if (tabster.controlTab || tabster.rootDummyInputs) {
      this.addDummyInputs();
    }
    const w = win();
    const doc = w.document;
    doc.addEventListener(KEYBORG_FOCUSIN, this._onFocusIn);
    doc.addEventListener(KEYBORG_FOCUSOUT, this._onFocusOut);
    this._add();
  }
  addDummyInputs() {
    if (!this._dummyManager) {
      this._dummyManager = new RootDummyManager(this._tabster, this._element, this._setFocused, this._sys);
    }
  }
  dispose() {
    this._onDispose(this);
    const win = this._tabster.getWindow();
    const doc = win.document;
    doc.removeEventListener(KEYBORG_FOCUSIN, this._onFocusIn);
    doc.removeEventListener(KEYBORG_FOCUSOUT, this._onFocusOut);
    if (this._setFocusedTimer) {
      win.clearTimeout(this._setFocusedTimer);
      delete this._setFocusedTimer;
    }
    this._dummyManager?.dispose();
    this._remove();
  }
  moveOutWithDefaultAction(isBackward, relatedEvent) {
    const dummyManager = this._dummyManager;
    if (dummyManager) {
      dummyManager.moveOutWithDefaultAction(isBackward, relatedEvent);
    } else {
      const el = this.getElement();
      if (el) {
        RootDummyManager.moveWithPhantomDummy(this._tabster, el, true, isBackward, relatedEvent);
      }
    }
  }
  _setFocused = (hasFocused) => {
    if (this._setFocusedTimer) {
      this._tabster.getWindow().clearTimeout(this._setFocusedTimer);
      delete this._setFocusedTimer;
    }
    if (this._isFocused === hasFocused) {
      return;
    }
    const element = this._element.get();
    if (element) {
      if (hasFocused) {
        this._isFocused = true;
        this._dummyManager?.setTabbable(false);
        element.dispatchEvent(new RootFocusEvent({
          element
        }));
      } else {
        this._setFocusedTimer = this._tabster.getWindow().setTimeout(() => {
          delete this._setFocusedTimer;
          this._isFocused = false;
          this._dummyManager?.setTabbable(true);
          element.dispatchEvent(new RootBlurEvent({
            element
          }));
        }, 0);
      }
    }
  };
  _onFocusIn = (event) => {
    const getParent = this._tabster.getParent;
    const rootElement = this._element.get();
    let curElement = event.composedPath()[0];
    do {
      if (curElement === rootElement) {
        this._setFocused(true);
        return;
      }
      curElement = curElement && getParent(curElement);
    } while (curElement);
  };
  _onFocusOut = () => {
    this._setFocused(false);
  };
  _add() {
  }
  _remove() {
  }
}
class RootAPI {
  _tabster;
  _win;
  _autoRoot;
  _autoRootWaiting = false;
  _roots = {};
  _forceDummy = false;
  rootById = {};
  constructor(tabster, autoRoot) {
    this._tabster = tabster;
    this._win = tabster.getWindow;
    this._autoRoot = autoRoot;
    tabster.queueInit(() => {
      if (this._autoRoot) {
        this._autoRootCreate();
      }
    });
  }
  _autoRootCreate = () => {
    const doc = this._win().document;
    const body = doc.body;
    if (body) {
      this._autoRootUnwait(doc);
      const props = this._autoRoot;
      if (props) {
        setTabsterAttribute(body, {
          root: props
        }, true);
        updateTabsterByAttribute(this._tabster, body);
        return getTabsterOnElement(this._tabster, body)?.root;
      }
    } else if (!this._autoRootWaiting) {
      this._autoRootWaiting = true;
      doc.addEventListener("readystatechange", this._autoRootCreate);
    }
    return void 0;
  };
  _autoRootUnwait(doc) {
    doc.removeEventListener("readystatechange", this._autoRootCreate);
    this._autoRootWaiting = false;
  }
  dispose() {
    const win = this._win();
    this._autoRootUnwait(win.document);
    delete this._autoRoot;
    Object.keys(this._roots).forEach((rootId) => {
      if (this._roots[rootId]) {
        this._roots[rootId].dispose();
        delete this._roots[rootId];
      }
    });
    this.rootById = {};
  }
  createRoot(element, props, sys) {
    const newRoot = new Root(this._tabster, element, this._onRootDispose, props, sys);
    this._roots[newRoot.id] = newRoot;
    if (this._forceDummy) {
      newRoot.addDummyInputs();
    }
    return newRoot;
  }
  addDummyInputs() {
    this._forceDummy = true;
    const roots = this._roots;
    for (const id of Object.keys(roots)) {
      roots[id].addDummyInputs();
    }
  }
  static getRootByUId(getWindow, id) {
    const tabster = getWindow().__tabsterInstance;
    return tabster && tabster.root.rootById[id];
  }
  /**
   * Fetches the tabster context for an element walking up its ancestors
   *
   * @param tabster Tabster instance
   * @param element The element the tabster context should represent
   * @param options Additional options
   * @returns undefined if the element is not a child of a tabster root, otherwise all applicable tabster behaviours and configurations
   */
  static getTabsterContext(tabster, element, options = {}) {
    if (!element.ownerDocument) {
      return void 0;
    }
    const {
      checkRtl,
      referenceElement
    } = options;
    const getParent = tabster.getParent;
    tabster.drainInitQueue();
    let root;
    let modalizer;
    let groupper;
    let mover;
    let excludedFromMover = false;
    let groupperBeforeMover;
    let modalizerInGroupper;
    let dirRightToLeft;
    let uncontrolled;
    let curElement = referenceElement || element;
    const ignoreKeydown = {};
    while (curElement && (!root || checkRtl)) {
      const tabsterOnElement = getTabsterOnElement(tabster, curElement);
      if (checkRtl && dirRightToLeft === void 0) {
        const dir = curElement.dir;
        if (dir) {
          dirRightToLeft = dir.toLowerCase() === "rtl";
        }
      }
      if (!tabsterOnElement) {
        curElement = getParent(curElement);
        continue;
      }
      const tagName = curElement.tagName;
      if ((tabsterOnElement.uncontrolled || tagName === "IFRAME" || tagName === "WEBVIEW") && tabster.focusable.isVisible(curElement)) {
        uncontrolled = curElement;
      }
      if (!mover && tabsterOnElement.focusable?.excludeFromMover && !groupper) {
        excludedFromMover = true;
      }
      const curModalizer = tabsterOnElement.modalizer;
      const curGroupper = tabsterOnElement.groupper;
      const curMover = tabsterOnElement.mover;
      if (!modalizer && curModalizer) {
        modalizer = curModalizer;
      }
      if (!groupper && curGroupper && (!modalizer || curModalizer)) {
        if (modalizer) {
          if (!curGroupper.isActive() && curGroupper.getProps().tabbability && modalizer.userId !== tabster.modalizer?.activeId) {
            modalizer = void 0;
            groupper = curGroupper;
          }
          modalizerInGroupper = curGroupper;
        } else {
          groupper = curGroupper;
        }
      }
      if (!mover && curMover && (!modalizer || curModalizer) && (!curGroupper || curElement !== element) && curElement.contains(element)) {
        mover = curMover;
        groupperBeforeMover = !!groupper && groupper !== curGroupper;
      }
      if (tabsterOnElement.root) {
        root = tabsterOnElement.root;
      }
      if (tabsterOnElement.focusable?.ignoreKeydown) {
        Object.assign(ignoreKeydown, tabsterOnElement.focusable.ignoreKeydown);
      }
      curElement = getParent(curElement);
    }
    if (!root) {
      const rootAPI = tabster.root;
      const autoRoot = rootAPI._autoRoot;
      if (autoRoot) {
        if (element.ownerDocument?.body) {
          root = rootAPI._autoRootCreate();
        }
      }
    }
    if (groupper && !mover) {
      groupperBeforeMover = true;
    }
    const shouldIgnoreKeydown = (event) => !!ignoreKeydown[event.key];
    return root ? {
      root,
      modalizer,
      groupper,
      mover,
      groupperBeforeMover,
      modalizerInGroupper,
      rtl: checkRtl ? !!dirRightToLeft : void 0,
      uncontrolled,
      excludedFromMover,
      ignoreKeydown: shouldIgnoreKeydown
    } : void 0;
  }
  static getRoot(tabster, element) {
    const getParent = tabster.getParent;
    for (let el = element; el; el = getParent(el)) {
      const root = getTabsterOnElement(tabster, el)?.root;
      if (root) {
        return root;
      }
    }
    return void 0;
  }
  onRoot(root, removed) {
    if (removed) {
      delete this.rootById[root.uid];
    } else {
      this.rootById[root.uid] = root;
    }
  }
  _onRootDispose = (root) => {
    delete this._roots[root.id];
  };
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class FocusableAPI {
  _tabster;
  constructor(tabster) {
    this._tabster = tabster;
  }
  dispose() {
    /**/
  }
  getProps(element) {
    const tabsterOnElement = getTabsterOnElement(this._tabster, element);
    return tabsterOnElement && tabsterOnElement.focusable || {};
  }
  isFocusable(el, includeProgrammaticallyFocusable, noVisibleCheck, noAccessibleCheck) {
    if (matchesSelector(el, FOCUSABLE_SELECTOR) && (includeProgrammaticallyFocusable || el.tabIndex !== -1)) {
      return (noVisibleCheck || this.isVisible(el)) && (noAccessibleCheck || this.isAccessible(el));
    }
    return false;
  }
  isVisible(el) {
    if (!el.ownerDocument || el.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    if (isDisplayNone(el)) {
      return false;
    }
    const rect = el.ownerDocument.body.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      // This might happen, for example, if our <body> is in hidden <iframe>.
      return false;
    }
    return true;
  }
  isAccessible(el) {
    for (let e = el; e; e = dom.getParentElement(e)) {
      const tabsterOnElement = getTabsterOnElement(this._tabster, e);
      if (this._isHidden(e)) {
        return false;
      }
      const ignoreDisabled = tabsterOnElement?.focusable?.ignoreAriaDisabled;
      if (!ignoreDisabled && this._isDisabled(e)) {
        return false;
      }
    }
    return true;
  }
  _isDisabled(el) {
    return el.hasAttribute("disabled");
  }
  _isHidden(el) {
    const attrVal = el.getAttribute("aria-hidden");
    if (attrVal && attrVal.toLowerCase() === "true") {
      if (!this._tabster.modalizer?.isAugmented(el)) {
        return true;
      }
    }
    return false;
  }
  findFirst(options, out) {
    return this.findElement({
      ...options
    }, out);
  }
  findLast(options, out) {
    return this.findElement({
      isBackward: true,
      ...options
    }, out);
  }
  findNext(options, out) {
    return this.findElement({
      ...options
    }, out);
  }
  findPrev(options, out) {
    return this.findElement({
      ...options,
      isBackward: true
    }, out);
  }
  findDefault(options, out) {
    return this.findElement({
      ...options,
      acceptCondition: el => this.isFocusable(el, options.includeProgrammaticallyFocusable) && !!this.getProps(el).isDefault
    }, out) || null;
  }
  findAll(options) {
    return this._findElements(true, options) || [];
  }
  findElement(options, out) {
    const found = this._findElements(false, options, out);
    return found ? found[0] : found;
  }
  _findElements(isFindAll, options, out) {
    const {
      container,
      currentElement = null,
      includeProgrammaticallyFocusable,
      useActiveModalizer,
      ignoreAccessibility,
      modalizerId,
      isBackward,
      onElement
    } = options;
    if (!out) {
      out = {};
    }
    const elements = [];
    let {
      acceptCondition
    } = options;
    const hasCustomCondition = !!acceptCondition;
    if (!container) {
      return null;
    }
    if (!acceptCondition) {
      acceptCondition = el => this.isFocusable(el, includeProgrammaticallyFocusable, false, ignoreAccessibility);
    }
    const acceptElementState = {
      container,
      modalizerUserId: modalizerId === undefined && useActiveModalizer ? this._tabster.modalizer?.activeId : modalizerId || RootAPI.getTabsterContext(this._tabster, container)?.modalizer?.userId,
      from: currentElement || container,
      isBackward,
      isFindAll,
      acceptCondition,
      hasCustomCondition,
      includeProgrammaticallyFocusable,
      ignoreAccessibility,
      cachedGrouppers: {},
      cachedRadioGroups: {}
    };
    const walker = createElementTreeWalker(container.ownerDocument, container, node => this._acceptElement(node, acceptElementState));
    if (!walker) {
      return null;
    }
    const prepareForNextElement = shouldContinueIfNotFound => {
      const foundElement = acceptElementState.foundElement ?? acceptElementState.foundBackward;
      if (foundElement) {
        elements.push(foundElement);
      }
      if (isFindAll) {
        if (foundElement) {
          acceptElementState.found = false;
          delete acceptElementState.foundElement;
          delete acceptElementState.foundBackward;
          delete acceptElementState.fromCtx;
          acceptElementState.from = foundElement;
          if (onElement && !onElement(foundElement)) {
            return false;
          }
        }
        return !!(foundElement || shouldContinueIfNotFound);
      } else {
        if (foundElement && out) {
          out.uncontrolled = RootAPI.getTabsterContext(this._tabster, foundElement)?.uncontrolled;
        }
        return !!(shouldContinueIfNotFound && !foundElement);
      }
    };
    if (!currentElement) {
      out.outOfDOMOrder = true;
    }
    if (currentElement && dom.nodeContains(container, currentElement)) {
      walker.currentNode = currentElement;
    } else if (isBackward) {
      const lastChild = getLastChild(container);
      if (!lastChild) {
        return null;
      }
      if (this._acceptElement(lastChild, acceptElementState) === NodeFilter.FILTER_ACCEPT && !prepareForNextElement(true)) {
        if (acceptElementState.skippedFocusable) {
          out.outOfDOMOrder = true;
        }
        return elements;
      }
      walker.currentNode = lastChild;
    }
    do {
      if (isBackward) {
        walker.previousNode();
      } else {
        walker.nextNode();
      }
    } while (prepareForNextElement());
    if (acceptElementState.skippedFocusable) {
      out.outOfDOMOrder = true;
    }
    return elements.length ? elements : null;
  }
  _acceptElement(element, state) {
    if (state.found) {
      return NodeFilter.FILTER_ACCEPT;
    }
    const foundBackward = state.foundBackward;
    if (foundBackward && (element === foundBackward || !dom.nodeContains(foundBackward, element))) {
      state.found = true;
      state.foundElement = foundBackward;
      return NodeFilter.FILTER_ACCEPT;
    }
    const container = state.container;
    if (element === container) {
      return NodeFilter.FILTER_SKIP;
    }
    if (!dom.nodeContains(container, element)) {
      return NodeFilter.FILTER_REJECT;
    }
    if (getDummyInputContainer(element)) {
      return NodeFilter.FILTER_REJECT;
    }
    if (dom.nodeContains(state.rejectElementsFrom, element)) {
      return NodeFilter.FILTER_REJECT;
    }
    const ctx = state.currentCtx = RootAPI.getTabsterContext(this._tabster, element);
    // Tabster is opt in, if it is not managed, don't try and get do anything special
    if (!ctx) {
      return NodeFilter.FILTER_SKIP;
    }
    if (shouldIgnoreFocus(element)) {
      if (this.isFocusable(element, undefined, true, true)) {
        state.skippedFocusable = true;
      }
      return NodeFilter.FILTER_SKIP;
    }
    // We assume iframes are focusable because native tab behaviour would tab inside.
    // But we do it only during the standard search when there is no custom accept
    // element condition.
    if (!state.hasCustomCondition && (element.tagName === "IFRAME" || element.tagName === "WEBVIEW")) {
      if (this.isVisible(element) && ctx.modalizer?.userId === this._tabster.modalizer?.activeId) {
        state.found = true;
        state.rejectElementsFrom = state.foundElement = element;
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_REJECT;
      }
    }
    if (!state.ignoreAccessibility && !this.isAccessible(element)) {
      if (this.isFocusable(element, false, true, true)) {
        state.skippedFocusable = true;
      }
      return NodeFilter.FILTER_REJECT;
    }
    let result;
    let fromCtx = state.fromCtx;
    if (!fromCtx) {
      fromCtx = state.fromCtx = RootAPI.getTabsterContext(this._tabster, state.from);
    }
    const fromMover = fromCtx?.mover;
    let groupper = ctx.groupper;
    let mover = ctx.mover;
    result = this._tabster.modalizer?.acceptElement(element, state);
    if (result !== undefined) {
      state.skippedFocusable = true;
    }
    if (result === undefined && (groupper || mover || fromMover)) {
      const groupperElement = groupper?.getElement();
      const fromMoverElement = fromMover?.getElement();
      let moverElement = mover?.getElement();
      if (moverElement && dom.nodeContains(fromMoverElement, moverElement) && dom.nodeContains(container, fromMoverElement) && (!groupperElement || !mover || dom.nodeContains(fromMoverElement, groupperElement))) {
        mover = fromMover;
        moverElement = fromMoverElement;
      }
      if (groupperElement) {
        if (groupperElement === container || !dom.nodeContains(container, groupperElement)) {
          groupper = undefined;
        } else if (!dom.nodeContains(groupperElement, element)) {
          // _acceptElement() callback is called during the tree walking.
          // Given the potentiality of virtual parents (driven by the custom getParent() function),
          // we need to make sure that the groupper from the current element's context is not,
          // portaling us out of the DOM order.
          return NodeFilter.FILTER_REJECT;
        }
      }
      if (moverElement) {
        if (!dom.nodeContains(container, moverElement)) {
          mover = undefined;
        } else if (!dom.nodeContains(moverElement, element)) {
          // _acceptElement() callback is called during the tree walking.
          // Given the potentiality of virtual parents (driven by the custom getParent() function),
          // we need to make sure that the mover from the current element's context is not,
          // portaling us out of the DOM order.
          return NodeFilter.FILTER_REJECT;
        }
      }
      if (groupper && mover) {
        if (moverElement && groupperElement && !dom.nodeContains(groupperElement, moverElement)) {
          mover = undefined;
        } else {
          groupper = undefined;
        }
      }
      if (groupper) {
        result = groupper.acceptElement(element, state);
      }
      if (mover) {
        result = mover.acceptElement(element, state);
      }
    }
    if (result === undefined) {
      result = state.acceptCondition(element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      if (result === NodeFilter.FILTER_SKIP && this.isFocusable(element, false, true, true)) {
        state.skippedFocusable = true;
      }
    }
    if (result === NodeFilter.FILTER_ACCEPT && !state.found) {
      if (!state.isFindAll && isRadio(element) && !element.checked) {
        // We need to mimic the browser's behaviour to skip unchecked radio buttons.
        const radioGroupName = element.name;
        let radioGroup = state.cachedRadioGroups[radioGroupName];
        if (!radioGroup) {
          radioGroup = getRadioButtonGroup(element);
          if (radioGroup) {
            state.cachedRadioGroups[radioGroupName] = radioGroup;
          }
        }
        if (radioGroup?.checked && radioGroup.checked !== element) {
          // Currently found element is a radio button in a group that has another radio button checked.
          return NodeFilter.FILTER_SKIP;
        }
      }
      if (state.isBackward) {
        // When TreeWalker goes backwards, it visits the container first,
        // then it goes inside. So, if the container is accepted, we remember it,
        // but allowing the TreeWalker to check inside.
        state.foundBackward = element;
        result = NodeFilter.FILTER_SKIP;
      } else {
        state.found = true;
        state.foundElement = element;
      }
    }
    return result;
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const Keys = {
  Tab: "Tab",
  PageUp: "PageUp",
  PageDown: "PageDown",
  End: "End",
  Home: "Home",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  ArrowDown: "ArrowDown"
};

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class Subscribable {
  _val;
  _callbacks = [];
  dispose() {
    this._callbacks = [];
    delete this._val;
  }
  subscribe(callback) {
    const callbacks = this._callbacks;
    const index = callbacks.indexOf(callback);
    if (index < 0) {
      callbacks.push(callback);
    }
  }
  subscribeFirst(callback) {
    const callbacks = this._callbacks;
    const index = callbacks.indexOf(callback);
    if (index >= 0) {
      callbacks.splice(index, 1);
    }
    callbacks.unshift(callback);
  }
  unsubscribe(callback) {
    const index = this._callbacks.indexOf(callback);
    if (index >= 0) {
      this._callbacks.splice(index, 1);
    }
  }
  setVal(val, detail) {
    if (this._val === val) {
      return;
    }
    this._val = val;
    this._callCallbacks(val, detail);
  }
  getVal() {
    return this._val;
  }
  trigger(val, detail) {
    this._callCallbacks(val, detail);
  }
  _callCallbacks(val, detail) {
    this._callbacks.forEach(callback => callback(val, detail));
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function getUncontrolledCompletelyContainer(tabster, element) {
  const getParent = tabster.getParent;
  let el = element;
  do {
    const uncontrolledOnElement = getTabsterOnElement(tabster, el)?.uncontrolled;
    if (uncontrolledOnElement && tabster.uncontrolled.isUncontrolledCompletely(el, !!uncontrolledOnElement.completely)) {
      return el;
    }
    el = getParent(el);
  } while (el);
  return undefined;
}
const AsyncFocusIntentPriorityBySource = {
  [AsyncFocusSources.Restorer]: 0,
  [AsyncFocusSources.Deloser]: 1,
  [AsyncFocusSources.EscapeGroupper]: 2
};
class FocusedElementState extends Subscribable {
  static _lastResetElement;
  static _isTabbingTimer;
  static isTabbing = false;
  _tabster;
  _win;
  _nextVal;
  _lastVal;
  _asyncFocus;
  constructor(tabster, getWindow) {
    super();
    this._tabster = tabster;
    this._win = getWindow;
    tabster.queueInit(this._init);
  }
  _init = () => {
    const win = this._win();
    const doc = win.document;
    // Add these event listeners as capture - we want Tabster to run before user event handlers
    doc.addEventListener(KEYBORG_FOCUSIN, this._onFocusIn, true);
    doc.addEventListener(KEYBORG_FOCUSOUT, this._onFocusOut, true);
    win.addEventListener("keydown", this._onKeyDown, true);
    const activeElement = dom.getActiveElement(doc);
    if (activeElement && activeElement !== doc.body) {
      this._setFocusedElement(activeElement);
    }
    this.subscribe(this._onChanged);
  };
  dispose() {
    super.dispose();
    const win = this._win();
    const doc = win.document;
    doc.removeEventListener(KEYBORG_FOCUSIN, this._onFocusIn, true);
    doc.removeEventListener(KEYBORG_FOCUSOUT, this._onFocusOut, true);
    win.removeEventListener("keydown", this._onKeyDown, true);
    this.unsubscribe(this._onChanged);
    const asyncFocus = this._asyncFocus;
    if (asyncFocus) {
      win.clearTimeout(asyncFocus.timeout);
      delete this._asyncFocus;
    }
    delete FocusedElementState._lastResetElement;
    delete this._nextVal;
    delete this._lastVal;
  }
  static forgetMemorized(instance, parent) {
    let wel = FocusedElementState._lastResetElement;
    let el = wel && wel.get();
    if (el && dom.nodeContains(parent, el)) {
      delete FocusedElementState._lastResetElement;
    }
    el = instance._nextVal?.element?.get();
    if (el && dom.nodeContains(parent, el)) {
      delete instance._nextVal;
    }
    wel = instance._lastVal;
    el = wel && wel.get();
    if (el && dom.nodeContains(parent, el)) {
      delete instance._lastVal;
    }
  }
  getFocusedElement() {
    return this.getVal();
  }
  getLastFocusedElement() {
    let el = this._lastVal?.get();
    if (!el || el && !documentContains(el.ownerDocument, el)) {
      this._lastVal = el = undefined;
    }
    return el;
  }
  focus(element, noFocusedProgrammaticallyFlag, noAccessibleCheck, preventScroll) {
    if (!this._tabster.focusable.isFocusable(element, noFocusedProgrammaticallyFlag, false, noAccessibleCheck)) {
      return false;
    }
    element.focus({
      preventScroll
    });
    return true;
  }
  focusDefault(container) {
    const el = this._tabster.focusable.findDefault({
      container
    });
    if (el) {
      this._tabster.focusedElement.focus(el);
      return true;
    }
    return false;
  }
  getFirstOrLastTabbable(isFirst, props) {
    const {
      container,
      ignoreAccessibility
    } = props;
    let toFocus;
    if (container) {
      const ctx = RootAPI.getTabsterContext(this._tabster, container);
      if (ctx) {
        toFocus = FocusedElementState.findNextTabbable(this._tabster, ctx, container, undefined, undefined, !isFirst, ignoreAccessibility)?.element;
      }
    }
    if (toFocus && !dom.nodeContains(container, toFocus)) {
      toFocus = undefined;
    }
    return toFocus || undefined;
  }
  _focusFirstOrLast(isFirst, props) {
    const toFocus = this.getFirstOrLastTabbable(isFirst, props);
    if (toFocus) {
      this.focus(toFocus, false, true);
      return true;
    }
    return false;
  }
  focusFirst(props) {
    return this._focusFirstOrLast(true, props);
  }
  focusLast(props) {
    return this._focusFirstOrLast(false, props);
  }
  resetFocus(container) {
    if (!this._tabster.focusable.isVisible(container)) {
      return false;
    }
    if (!this._tabster.focusable.isFocusable(container, true, true, true)) {
      const prevTabIndex = container.getAttribute("tabindex");
      const prevAriaHidden = container.getAttribute("aria-hidden");
      container.tabIndex = -1;
      container.setAttribute("aria-hidden", "true");
      FocusedElementState._lastResetElement = new WeakHTMLElement(container);
      this.focus(container, true, true);
      this._setOrRemoveAttribute(container, "tabindex", prevTabIndex);
      this._setOrRemoveAttribute(container, "aria-hidden", prevAriaHidden);
    } else {
      this.focus(container);
    }
    return true;
  }
  requestAsyncFocus(source, callback, delay) {
    const win = this._tabster.getWindow();
    const currentAsyncFocus = this._asyncFocus;
    if (currentAsyncFocus) {
      if (AsyncFocusIntentPriorityBySource[source] > AsyncFocusIntentPriorityBySource[currentAsyncFocus.source]) {
        // Previously registered intent has higher priority.
        return;
      }
      // New intent has higher priority.
      win.clearTimeout(currentAsyncFocus.timeout);
    }
    this._asyncFocus = {
      source,
      callback,
      timeout: win.setTimeout(() => {
        this._asyncFocus = undefined;
        callback();
      }, delay)
    };
  }
  cancelAsyncFocus(source) {
    const asyncFocus = this._asyncFocus;
    if (asyncFocus?.source === source) {
      this._tabster.getWindow().clearTimeout(asyncFocus.timeout);
      this._asyncFocus = undefined;
    }
  }
  _setOrRemoveAttribute(element, name, value) {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
  }
  _setFocusedElement(element, relatedTarget, isFocusedProgrammatically) {
    if (this._tabster._noop) {
      return;
    }
    const detail = {
      relatedTarget
    };
    if (element) {
      const lastResetElement = FocusedElementState._lastResetElement?.get();
      FocusedElementState._lastResetElement = undefined;
      if (lastResetElement === element || shouldIgnoreFocus(element)) {
        return;
      }
      detail.isFocusedProgrammatically = isFocusedProgrammatically;
      const ctx = RootAPI.getTabsterContext(this._tabster, element);
      const modalizerId = ctx?.modalizer?.userId;
      if (modalizerId) {
        detail.modalizerId = modalizerId;
      }
    }
    const nextVal = this._nextVal = {
      element: element ? new WeakHTMLElement(element) : undefined,
      detail
    };
    if (element && element !== this._val) {
      this._validateFocusedElement(element);
    }
    // _validateFocusedElement() might cause the refocus which will trigger
    // another call to this function. Making sure that the value is correct.
    if (this._nextVal === nextVal) {
      this.setVal(element, detail);
    }
    this._nextVal = undefined;
  }
  setVal(val, detail) {
    super.setVal(val, detail);
    if (val) {
      this._lastVal = new WeakHTMLElement(val);
    }
  }
  _onFocusIn = e => {
    const target = e.composedPath()[0];
    if (target) {
      this._setFocusedElement(target, e.detail.relatedTarget, e.detail.isFocusedProgrammatically);
    }
  };
  _onFocusOut = e => {
    this._setFocusedElement(undefined, e.detail?.originalEvent.relatedTarget);
  };
  static findNextTabbable(tabster, ctx, container, currentElement, referenceElement, isBackward, ignoreAccessibility) {
    const actualContainer = container || ctx.root.getElement();
    if (!actualContainer) {
      return null;
    }
    let next = null;
    const isTabbingTimer = FocusedElementState._isTabbingTimer;
    const win = tabster.getWindow();
    if (isTabbingTimer) {
      win.clearTimeout(isTabbingTimer);
    }
    FocusedElementState.isTabbing = true;
    FocusedElementState._isTabbingTimer = win.setTimeout(() => {
      delete FocusedElementState._isTabbingTimer;
      FocusedElementState.isTabbing = false;
    }, 0);
    const modalizer = ctx.modalizer;
    const groupper = ctx.groupper;
    const mover = ctx.mover;
    const callFindNext = what => {
      next = what.findNextTabbable(currentElement, referenceElement, isBackward, ignoreAccessibility);
      if (currentElement && !next?.element) {
        const parentElement = what !== modalizer && dom.getParentElement(what.getElement());
        if (parentElement) {
          const parentCtx = RootAPI.getTabsterContext(tabster, currentElement, {
            referenceElement: parentElement
          });
          if (parentCtx) {
            const currentScopeElement = what.getElement();
            const newCurrent = isBackward ? currentScopeElement : currentScopeElement && getLastChild(currentScopeElement) || currentScopeElement;
            if (newCurrent) {
              next = FocusedElementState.findNextTabbable(tabster, parentCtx, container, newCurrent, parentElement, isBackward, ignoreAccessibility);
              if (next) {
                next.outOfDOMOrder = true;
              }
            }
          }
        }
      }
    };
    if (groupper && mover) {
      callFindNext(ctx.groupperBeforeMover ? groupper : mover);
    } else if (groupper) {
      callFindNext(groupper);
    } else if (mover) {
      callFindNext(mover);
    } else if (modalizer) {
      callFindNext(modalizer);
    } else {
      const findProps = {
        container: actualContainer,
        currentElement,
        referenceElement,
        ignoreAccessibility,
        useActiveModalizer: true
      };
      const findPropsOut = {};
      const nextElement = tabster.focusable[isBackward ? "findPrev" : "findNext"](findProps, findPropsOut);
      next = {
        element: nextElement,
        outOfDOMOrder: findPropsOut.outOfDOMOrder,
        uncontrolled: findPropsOut.uncontrolled
      };
    }
    return next;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _validateFocusedElement = element => {
    // TODO: Make sure this is not needed anymore and write tests.
  };
  _onKeyDown = event => {
    if (event.key !== Keys.Tab || event.ctrlKey) {
      return;
    }
    const currentElement = this.getVal();
    if (!currentElement || !currentElement.ownerDocument || currentElement.contentEditable === "true") {
      return;
    }
    const tabster = this._tabster;
    const controlTab = tabster.controlTab;
    const ctx = RootAPI.getTabsterContext(tabster, currentElement);
    if (!ctx || ctx.ignoreKeydown(event)) {
      return;
    }
    const isBackward = event.shiftKey;
    const next = FocusedElementState.findNextTabbable(tabster, ctx, undefined, currentElement, undefined, isBackward, true);
    const rootElement = ctx.root.getElement();
    if (!rootElement) {
      return;
    }
    const nextElement = next?.element;
    const uncontrolledCompletelyContainer = getUncontrolledCompletelyContainer(tabster, currentElement);
    if (nextElement) {
      const nextUncontrolled = next.uncontrolled;
      if (ctx.uncontrolled || dom.nodeContains(nextUncontrolled, currentElement)) {
        if (!next.outOfDOMOrder && nextUncontrolled === ctx.uncontrolled || uncontrolledCompletelyContainer && !dom.nodeContains(uncontrolledCompletelyContainer, nextElement)) {
          // Nothing to do, everything will be done by the browser or something
          // that controls the uncontrolled area.
          return;
        }
        // We are in uncontrolled area. We allow whatever controls it to move
        // focus, but we add a phantom dummy to make sure the focus is moved
        // to the correct place if the uncontrolled area allows default action.
        // We only need that in the controlled mode, because in uncontrolled
        // mode we have dummy inputs around everything that redirects focus.
        DummyInputManager.addPhantomDummyWithTarget(tabster, currentElement, isBackward, nextElement);
        return;
      }
      if (nextUncontrolled && tabster.focusable.isVisible(nextUncontrolled) || nextElement.tagName === "IFRAME" && tabster.focusable.isVisible(nextElement)) {
        // For iframes and uncontrolled areas we always want to use default action to
        // move focus into.
        if (rootElement.dispatchEvent(new TabsterMoveFocusEvent({
          by: "root",
          owner: rootElement,
          next: nextElement,
          relatedEvent: event
        }))) {
          DummyInputManager.moveWithPhantomDummy(tabster, nextUncontrolled ?? nextElement, false, isBackward, event);
        }
        return;
      }
      if (controlTab || next?.outOfDOMOrder) {
        if (rootElement.dispatchEvent(new TabsterMoveFocusEvent({
          by: "root",
          owner: rootElement,
          next: nextElement,
          relatedEvent: event
        }))) {
          event.preventDefault();
          event.stopImmediatePropagation();
          nativeFocus(nextElement);
        }
      }
    } else {
      if (!uncontrolledCompletelyContainer && rootElement.dispatchEvent(new TabsterMoveFocusEvent({
        by: "root",
        owner: rootElement,
        next: null,
        relatedEvent: event
      }))) {
        ctx.root.moveOutWithDefaultAction(isBackward, event);
      }
    }
  };
  _onChanged = (element, detail) => {
    if (element) {
      element.dispatchEvent(new TabsterFocusInEvent(detail));
    } else {
      const last = this._lastVal?.get();
      if (last) {
        const d = {
          ...detail
        };
        const lastCtx = RootAPI.getTabsterContext(this._tabster, last);
        const modalizerId = lastCtx?.modalizer?.userId;
        if (modalizerId) {
          d.modalizerId = modalizerId;
        }
        last.dispatchEvent(new TabsterFocusOutEvent(d));
      }
    }
  };
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class KeyboardNavigationState extends Subscribable {
  _keyborg;
  constructor(getWindow) {
    super();
    this._keyborg = createKeyborg(getWindow());
    this._keyborg.subscribe(this._onChange);
  }
  dispose() {
    super.dispose();
    if (this._keyborg) {
      this._keyborg.unsubscribe(this._onChange);
      disposeKeyborg(this._keyborg);
      delete this._keyborg;
    }
  }
  _onChange = isNavigatingWithKeyboard => {
    this.setVal(isNavigatingWithKeyboard, undefined);
  };
  setNavigatingWithKeyboard(isNavigatingWithKeyboard) {
    this._keyborg?.setVal(isNavigatingWithKeyboard);
  }
  isNavigatingWithKeyboard() {
    return !!this._keyborg?.isNavigatingWithKeyboard();
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function observeMutations(doc, tabster, updateTabsterByAttribute, syncState) {
  if (typeof MutationObserver === "undefined") {
    return () => {
      /* Noop */
    };
  }
  const getWindow = tabster.getWindow;
  let elementByUId;
  const onMutation = mutations => {
    const removedNodes = new Set();
    for (const mutation of mutations) {
      const target = mutation.target;
      const removed = mutation.removedNodes;
      const added = mutation.addedNodes;
      if (mutation.type === "attributes") {
        if (mutation.attributeName === TABSTER_ATTRIBUTE_NAME) {
          // removedNodes helps to make sure we are not recreating things
          // for the removed elements.
          // For some reason, if we do removeChild() and setAttribute() on the
          // removed child in the same tick, both the child removal and the attribute
          // change will be present in the mutation records. And the attribute change
          // will follow the child removal.
          // So, we remember the removed nodes and ignore attribute changes for them.
          if (!removedNodes.has(target)) {
            updateTabsterByAttribute(tabster, target);
          }
        }
      } else {
        for (let i = 0; i < removed.length; i++) {
          const removedNode = removed[i];
          removedNodes.add(removedNode);
          updateTabsterElements(removedNode, true);
          tabster._dummyObserver.domChanged?.(target);
        }
        for (let i = 0; i < added.length; i++) {
          updateTabsterElements(added[i]);
          tabster._dummyObserver.domChanged?.(target);
        }
      }
    }
    removedNodes.clear();
    tabster.modalizer?.hiddenUpdate();
  };
  function updateTabsterElements(node, removed) {
    if (!elementByUId) {
      elementByUId = getInstanceContext(getWindow).elementByUId;
    }
    processNode(node, removed);
    const walker = createElementTreeWalker(doc, node, element => {
      return processNode(element, removed);
    });
    if (walker) {
      while (walker.nextNode()) {
        /* Iterating for the sake of calling processNode() callback. */
      }
    }
  }
  function processNode(element, removed) {
    if (!element.getAttribute) {
      // It might actually be a text node.
      return NodeFilter.FILTER_SKIP;
    }
    const uid = element.__tabsterElementUID;
    if (uid && elementByUId) {
      if (removed) {
        delete elementByUId[uid];
      } else {
        elementByUId[uid] ??= new WeakHTMLElement(element);
      }
    }
    if (getTabsterOnElement(tabster, element) || element.hasAttribute(TABSTER_ATTRIBUTE_NAME)) {
      updateTabsterByAttribute(tabster, element, removed);
    }
    return NodeFilter.FILTER_SKIP;
  }
  const observer = dom.createMutationObserver(onMutation);
  if (syncState) {
    updateTabsterElements(getWindow().document.body);
  }
  observer.observe(doc, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [TABSTER_ATTRIBUTE_NAME]
  });
  return () => {
    observer.disconnect();
  };
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Allows default or user focus behaviour on the DOM subtree
 * i.e. Tabster will not control focus events within an uncontrolled area
 */
class UncontrolledAPI {
  _isUncontrolledCompletely;
  constructor(isUncontrolledCompletely) {
    this._isUncontrolledCompletely = isUncontrolledCompletely;
  }
  isUncontrolledCompletely(element, completely) {
    const isUncontrolledCompletely = this._isUncontrolledCompletely?.(element, completely);
    // If isUncontrolledCompletely callback is not defined or returns undefined, then the default
    // behaviour is to return the uncontrolled.completely value from the element.
    return isUncontrolledCompletely === undefined ? completely : isUncontrolledCompletely;
  }
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class Tabster {
  keyboardNavigation;
  focusedElement;
  focusable;
  root;
  uncontrolled;
  core;
  constructor(tabster) {
    this.keyboardNavigation = tabster.keyboardNavigation;
    this.focusedElement = tabster.focusedElement;
    this.focusable = tabster.focusable;
    this.root = tabster.root;
    this.uncontrolled = tabster.uncontrolled;
    this.core = tabster;
  }
}
/**
 * Extends Window to include an internal Tabster instance.
 */
class TabsterCore {
  _storage;
  _unobserve;
  _win;
  _forgetMemorizedTimer;
  _forgetMemorizedElements = [];
  _wrappers = new Set();
  _initTimer;
  _initQueue = [];
  _version = "8.8.0";
  _noop = false;
  controlTab;
  rootDummyInputs;
  // Variance gap: per-key handler types are contravariant in their
  // parameters, so a fully-typed Map<K, TabsterAttrHandler<K>> can't unify
  // them. Cast a plain Map to the typed view; the override on `set` keeps
  // registration type-safe per key, while `get` falls back to the Map's
  // value type (the type-erased shape).
  attrHandlers = new Map();
  // Core APIs
  keyboardNavigation;
  focusedElement;
  focusable;
  root;
  uncontrolled;
  internal;
  _dummyObserver;
  // Extended APIs
  groupper;
  mover;
  outline;
  deloser;
  modalizer;
  observedElement;
  crossOrigin;
  restorer;
  getParent;
  constructor(win, props) {
    this._storage = new WeakMap();
    this._win = win;
    const getWindow = this.getWindow;
    if (props?.DOMAPI) {
      setDOMAPI({
        ...props.DOMAPI
      });
    }
    this.keyboardNavigation = new KeyboardNavigationState(getWindow);
    this.focusedElement = new FocusedElementState(this, getWindow);
    this.focusable = new FocusableAPI(this);
    this.root = new RootAPI(this, props?.autoRoot);
    this.uncontrolled = new UncontrolledAPI(
    // TODO: Remove checkUncontrolledTrappingFocus in the next major version.
    props?.checkUncontrolledCompletely || props?.checkUncontrolledTrappingFocus);
    this.controlTab = props?.controlTab ?? true;
    this.rootDummyInputs = !!props?.rootDummyInputs;
    this._dummyObserver = new DummyInputObserver(getWindow);
    this.getParent = props?.getParent ?? dom.getParentNode;
    this.internal = {
      stopObserver: () => {
        if (this._unobserve) {
          this._unobserve();
          delete this._unobserve;
        }
      },
      resumeObserver: syncState => {
        if (!this._unobserve) {
          const doc = getWindow().document;
          this._unobserve = observeMutations(doc, this, updateTabsterByAttribute, syncState);
        }
      }
    };
    // Gives a tick to the host app to initialize other tabster
    // APIs before tabster starts observing attributes.
    this.queueInit(() => {
      this.internal.resumeObserver(true);
    });
  }
  /**
   * Merges external props with the current props. Not all
   * props can/should be mergeable, so let's add more as we move on.
   * @param props Tabster props
   */
  _mergeProps(props) {
    if (!props) {
      return;
    }
    this.getParent = props.getParent ?? this.getParent;
  }
  createTabster(noRefCount, props) {
    const wrapper = new Tabster(this);
    if (!noRefCount) {
      this._wrappers.add(wrapper);
    }
    this._mergeProps(props);
    return wrapper;
  }
  disposeTabster(wrapper, allInstances) {
    if (allInstances) {
      this._wrappers.clear();
    } else {
      this._wrappers.delete(wrapper);
    }
    if (this._wrappers.size === 0) {
      this.dispose();
    }
  }
  dispose() {
    this.internal.stopObserver();
    const win = this._win;
    win?.clearTimeout(this._initTimer);
    delete this._initTimer;
    this._initQueue = [];
    this._forgetMemorizedElements = [];
    if (win && this._forgetMemorizedTimer) {
      win.clearTimeout(this._forgetMemorizedTimer);
      delete this._forgetMemorizedTimer;
    }
    this.outline?.dispose();
    this.crossOrigin?.dispose();
    this.deloser?.dispose();
    this.groupper?.dispose();
    this.mover?.dispose();
    this.modalizer?.dispose();
    this.observedElement?.dispose();
    this.restorer?.dispose();
    this.keyboardNavigation.dispose();
    this.focusable.dispose();
    this.focusedElement.dispose();
    this.root.dispose();
    this._dummyObserver.dispose();
    // Drop handler closures — they capture the API instances we just
    // disposed, and any post-dispose updateTabsterByAttribute call would
    // otherwise dispatch to those zombies.
    this.attrHandlers.clear();
    clearElementCache(this.getWindow);
    this._storage = new WeakMap();
    this._wrappers.clear();
    if (win) {
      disposeInstanceContext(win);
      delete win.__tabsterInstance;
      delete this._win;
    }
  }
  storageEntry(element, addremove) {
    const storage = this._storage;
    let entry = storage.get(element);
    if (entry) {
      if (addremove === false && Object.keys(entry).length === 0) {
        storage.delete(element);
      }
    } else if (addremove === true) {
      entry = {};
      storage.set(element, entry);
    }
    return entry;
  }
  getWindow = () => {
    if (!this._win) {
      throw new Error("Using disposed Tabster.");
    }
    return this._win;
  };
  forceCleanup() {
    if (!this._win) {
      return;
    }
    this._forgetMemorizedElements.push(this._win.document.body);
    if (this._forgetMemorizedTimer) {
      return;
    }
    this._forgetMemorizedTimer = this._win.setTimeout(() => {
      delete this._forgetMemorizedTimer;
      for (let el = this._forgetMemorizedElements.shift(); el; el = this._forgetMemorizedElements.shift()) {
        clearElementCache(this.getWindow, el);
        FocusedElementState.forgetMemorized(this.focusedElement, el);
      }
    }, 0);
  }
  queueInit(callback) {
    if (!this._win) {
      return;
    }
    this._initQueue.push(callback);
    if (!this._initTimer) {
      this._initTimer = this._win?.setTimeout(() => {
        delete this._initTimer;
        this.drainInitQueue();
      }, 0);
    }
  }
  drainInitQueue() {
    if (!this._win) {
      return;
    }
    const queue = this._initQueue;
    // Resetting the queue before calling the callbacks to avoid recursion.
    this._initQueue = [];
    queue.forEach(callback => callback());
  }
}
/**
 * Creates an instance of Tabster, returns the current window instance if it already exists.
 */
function createTabster(win, props) {
  let tabster = getCurrentTabster(win);
  if (tabster) {
    return tabster.createTabster(false, props);
  }
  tabster = new TabsterCore(win, props);
  win.__tabsterInstance = tabster;
  return tabster.createTabster();
}
/**
 * Returns an instance of Tabster if it was created before or null.
 */
function getTabster(win) {
  const tabster = getCurrentTabster(win);
  return tabster ? tabster.createTabster(true) : null;
}
function disposeTabster(tabster, allInstances) {
  tabster.core.disposeTabster(tabster, allInstances);
}
/**
 * Returns an instance of Tabster if it already exists on the window .
 * @param win window instance that could contain an Tabster instance.
 */
function getCurrentTabster(win) {
  return win.__tabsterInstance;
}

export { AsyncFocusSources as A, MoverStateEventName as B, RootBlurEvent as C, DeloserRestoreFocusEventName as D, RootBlurEventName as E, FocusedElementState as F, RootFocusEvent as G, RootFocusEventName as H, TABSTER_ATTRIBUTE_NAME as I, TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME as J, Keys as K, TabsterCustomEvent as L, MoverMoveFocusEventName as M, TabsterFocusInEvent as N, TabsterFocusInEventName as O, TabsterFocusOutEvent as P, TabsterFocusOutEventName as Q, RootAPI as R, SysDummyInputsPositions as S, TabsterMoveFocusEvent as T, TabsterMoveFocusEventName as U, Visibilities as V, WeakHTMLElement as W, getTabsterAttribute as X, mergeTabsterProps as Y, setTabsterAttribute as Z, DeloserStrategies as a, TabsterPart as b, getElementUId as c, dom as d, RestoreFocusOrders as e, DeloserFocusLostEvent as f, getTabsterOnElement as g, documentContains as h, isDisplayNone as i, MoverMemorizedElementEventName as j, MoverKeys as k, isElementVerticallyVisibleInContainer as l, matchesSelector as m, nativeFocus as n, MoverDirections as o, MoverStateEvent as p, getDummyInputContainer as q, createElementTreeWalker as r, scrollIntoView as s, DummyInputManager as t, DummyInputManagerPriorities as u, disposeTabster as v, getTabster as w, createTabster as x, DeloserFocusLostEventName as y, FOCUSABLE_SELECTOR as z };
