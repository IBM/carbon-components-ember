var _canUseWeakRef = typeof WeakRef !== "undefined";
var WeakRefInstance = class {
  constructor(instance) {
    if (_canUseWeakRef && typeof instance === "object") {
      this._weakRef = new WeakRef(instance);
    } else {
      this._instance = instance;
    }
  }
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef/deref}
   */
  deref() {
    var _a, _b;
    let instance;
    if (this._weakRef) {
      instance = (_a = this._weakRef) == null ? void 0 : _a.deref();
      if (!instance) {
        delete this._weakRef;
      }
    } else {
      instance = this._instance;
      if ((_b = instance == null ? void 0 : instance.isDisposed) == null ? void 0 : _b.call(instance)) {
        delete this._instance;
      }
    }
    return instance;
  }
};
var KEYBORG_FOCUSIN = "keyborg:focusin";
var KEYBORG_FOCUSOUT = "keyborg:focusout";
function canOverrideNativeFocus(win) {
  const HTMLElement = win.HTMLElement;
  const origFocus = HTMLElement.prototype.focus;
  let isCustomFocusCalled = false;
  HTMLElement.prototype.focus = function focus() {
    isCustomFocusCalled = true;
  };
  const btn = win.document.createElement("button");
  btn.focus();
  HTMLElement.prototype.focus = origFocus;
  return isCustomFocusCalled;
}
var _canOverrideNativeFocus = false;
function nativeFocus(element) {
  const focus = element.focus;
  if (focus.__keyborgNativeFocus) {
    focus.__keyborgNativeFocus.call(element);
  } else {
    element.focus();
  }
}
function setupFocusEvent(win) {
  const kwin = win;
  if (!_canOverrideNativeFocus) {
    _canOverrideNativeFocus = canOverrideNativeFocus(kwin);
  }
  const origFocus = kwin.HTMLElement.prototype.focus;
  if (origFocus.__keyborgNativeFocus) {
    return;
  }
  kwin.HTMLElement.prototype.focus = focus;
  const shadowTargets = /* @__PURE__ */ new Set();
  const focusOutHandler = (e) => {
    const target = e.target;
    if (!target) {
      return;
    }
    const event = new CustomEvent(KEYBORG_FOCUSOUT, {
      cancelable: true,
      bubbles: true,
      // Allows the event to bubble past an open shadow root
      composed: true,
      detail: {
        originalEvent: e
      }
    });
    target.dispatchEvent(event);
  };
  const focusInHandler = (e) => {
    const target = e.target;
    if (!target) {
      return;
    }
    let node = e.composedPath()[0];
    const currentShadows = /* @__PURE__ */ new Set();
    while (node) {
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        currentShadows.add(node);
        node = node.host;
      } else {
        node = node.parentNode;
      }
    }
    for (const shadowRootWeakRef of shadowTargets) {
      const shadowRoot = shadowRootWeakRef.deref();
      if (!shadowRoot || !currentShadows.has(shadowRoot)) {
        shadowTargets.delete(shadowRootWeakRef);
        if (shadowRoot) {
          shadowRoot.removeEventListener("focusin", focusInHandler, true);
          shadowRoot.removeEventListener("focusout", focusOutHandler, true);
        }
      }
    }
    onFocusIn(target, e.relatedTarget || void 0);
  };
  const onFocusIn = (target, relatedTarget, originalEvent) => {
    var _a;
    const shadowRoot = target.shadowRoot;
    if (shadowRoot) {
      for (const shadowRootWeakRef of shadowTargets) {
        if (shadowRootWeakRef.deref() === shadowRoot) {
          return;
        }
      }
      shadowRoot.addEventListener("focusin", focusInHandler, true);
      shadowRoot.addEventListener("focusout", focusOutHandler, true);
      shadowTargets.add(new WeakRefInstance(shadowRoot));
      return;
    }
    const details = {
      relatedTarget,
      originalEvent
    };
    const event = new CustomEvent(KEYBORG_FOCUSIN, {
      cancelable: true,
      bubbles: true,
      // Allows the event to bubble past an open shadow root
      composed: true,
      detail: details
    });
    event.details = details;
    if (_canOverrideNativeFocus || data.lastFocusedProgrammatically) {
      details.isFocusedProgrammatically = target === ((_a = data.lastFocusedProgrammatically) == null ? void 0 : _a.deref());
      data.lastFocusedProgrammatically = void 0;
    }
    target.dispatchEvent(event);
  };
  const data = kwin.__keyborgData = {
    focusInHandler,
    focusOutHandler,
    shadowTargets
  };
  kwin.document.addEventListener("focusin", kwin.__keyborgData.focusInHandler, true);
  kwin.document.addEventListener("focusout", kwin.__keyborgData.focusOutHandler, true);
  function focus() {
    const keyborgNativeFocusEvent = kwin.__keyborgData;
    if (keyborgNativeFocusEvent) {
      keyborgNativeFocusEvent.lastFocusedProgrammatically = new WeakRefInstance(this);
    }
    return origFocus.apply(this, arguments);
  }
  let activeElement = kwin.document.activeElement;
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
  const keyborgNativeFocusEvent = kwin.__keyborgData;
  if (keyborgNativeFocusEvent) {
    kwin.document.removeEventListener("focusin", keyborgNativeFocusEvent.focusInHandler, true);
    kwin.document.removeEventListener("focusout", keyborgNativeFocusEvent.focusOutHandler, true);
    for (const shadowRootWeakRef of keyborgNativeFocusEvent.shadowTargets) {
      const shadowRoot = shadowRootWeakRef.deref();
      if (shadowRoot) {
        shadowRoot.removeEventListener("focusin", keyborgNativeFocusEvent.focusInHandler, true);
        shadowRoot.removeEventListener("focusout", keyborgNativeFocusEvent.focusOutHandler, true);
      }
    }
    keyborgNativeFocusEvent.shadowTargets.clear();
    delete kwin.__keyborgData;
  }
  if (origFocus) {
    proto.focus = origFocus;
  }
}
var _dismissTimeout = 500;
var _lastId = 0;
var KeyborgCore = class {
  constructor(win, props) {
    this._isNavigatingWithKeyboard_DO_NOT_USE = false;
    this._onFocusIn = (e) => {
      if (this._isMouseOrTouchUsedTimer) {
        return;
      }
      if (this.isNavigatingWithKeyboard) {
        return;
      }
      const details = e.detail;
      if (!details.relatedTarget) {
        return;
      }
      if (details.isFocusedProgrammatically || details.isFocusedProgrammatically === void 0) {
        return;
      }
      this.isNavigatingWithKeyboard = true;
    };
    this._onMouseDown = (e) => {
      if (e.buttons === 0 || e.clientX === 0 && e.clientY === 0 && e.screenX === 0 && e.screenY === 0) {
        return;
      }
      this._onMouseOrTouch();
    };
    this._onMouseOrTouch = () => {
      const win2 = this._win;
      if (win2) {
        if (this._isMouseOrTouchUsedTimer) {
          win2.clearTimeout(this._isMouseOrTouchUsedTimer);
        }
        this._isMouseOrTouchUsedTimer = win2.setTimeout(() => {
          delete this._isMouseOrTouchUsedTimer;
        }, 1e3);
      }
      this.isNavigatingWithKeyboard = false;
    };
    this._onKeyDown = (e) => {
      const isNavigatingWithKeyboard = this.isNavigatingWithKeyboard;
      if (isNavigatingWithKeyboard) {
        if (this._shouldDismissKeyboardNavigation(e)) {
          this._scheduleDismiss();
        }
      } else {
        if (this._shouldTriggerKeyboardNavigation(e)) {
          this.isNavigatingWithKeyboard = true;
        }
      }
    };
    this.id = "c" + ++_lastId;
    this._win = win;
    const doc = win.document;
    if (props) {
      const triggerKeys = props.triggerKeys;
      const dismissKeys = props.dismissKeys;
      if (triggerKeys == null ? void 0 : triggerKeys.length) {
        this._triggerKeys = new Set(triggerKeys);
      }
      if (dismissKeys == null ? void 0 : dismissKeys.length) {
        this._dismissKeys = new Set(dismissKeys);
      }
    }
    doc.addEventListener(KEYBORG_FOCUSIN, this._onFocusIn, true);
    doc.addEventListener("mousedown", this._onMouseDown, true);
    win.addEventListener("keydown", this._onKeyDown, true);
    doc.addEventListener("touchstart", this._onMouseOrTouch, true);
    doc.addEventListener("touchend", this._onMouseOrTouch, true);
    doc.addEventListener("touchcancel", this._onMouseOrTouch, true);
    setupFocusEvent(win);
  }
  get isNavigatingWithKeyboard() {
    return this._isNavigatingWithKeyboard_DO_NOT_USE;
  }
  set isNavigatingWithKeyboard(val) {
    if (this._isNavigatingWithKeyboard_DO_NOT_USE !== val) {
      this._isNavigatingWithKeyboard_DO_NOT_USE = val;
      this.update();
    }
  }
  dispose() {
    const win = this._win;
    if (win) {
      if (this._isMouseOrTouchUsedTimer) {
        win.clearTimeout(this._isMouseOrTouchUsedTimer);
        this._isMouseOrTouchUsedTimer = void 0;
      }
      if (this._dismissTimer) {
        win.clearTimeout(this._dismissTimer);
        this._dismissTimer = void 0;
      }
      disposeFocusEvent(win);
      const doc = win.document;
      doc.removeEventListener(KEYBORG_FOCUSIN, this._onFocusIn, true);
      doc.removeEventListener("mousedown", this._onMouseDown, true);
      win.removeEventListener("keydown", this._onKeyDown, true);
      doc.removeEventListener("touchstart", this._onMouseOrTouch, true);
      doc.removeEventListener("touchend", this._onMouseOrTouch, true);
      doc.removeEventListener("touchcancel", this._onMouseOrTouch, true);
      delete this._win;
    }
  }
  isDisposed() {
    return !!this._win;
  }
  /**
   * Updates all keyborg instances with the keyboard navigation state
   */
  update() {
    var _a, _b;
    const keyborgs = (_b = (_a = this._win) == null ? void 0 : _a.__keyborg) == null ? void 0 : _b.refs;
    if (keyborgs) {
      for (const id of Object.keys(keyborgs)) {
        Keyborg.update(keyborgs[id], this.isNavigatingWithKeyboard);
      }
    }
  }
  /**
   * @returns whether the keyboard event should trigger keyboard navigation mode
   */
  _shouldTriggerKeyboardNavigation(e) {
    var _a;
    if (e.key === "Tab") {
      return true;
    }
    const activeElement = (_a = this._win) == null ? void 0 : _a.document.activeElement;
    const isTriggerKey = !this._triggerKeys || this._triggerKeys.has(e.keyCode);
    const isEditable = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable);
    return isTriggerKey && !isEditable;
  }
  /**
   * @returns whether the keyboard event should dismiss keyboard navigation mode
   */
  _shouldDismissKeyboardNavigation(e) {
    var _a;
    return (_a = this._dismissKeys) == null ? void 0 : _a.has(e.keyCode);
  }
  _scheduleDismiss() {
    const win = this._win;
    if (win) {
      if (this._dismissTimer) {
        win.clearTimeout(this._dismissTimer);
        this._dismissTimer = void 0;
      }
      const was = win.document.activeElement;
      this._dismissTimer = win.setTimeout(() => {
        this._dismissTimer = void 0;
        const cur = win.document.activeElement;
        if (was && cur && was === cur) {
          this.isNavigatingWithKeyboard = false;
        }
      }, _dismissTimeout);
    }
  }
};
var Keyborg = class _Keyborg {
  constructor(win, props) {
    this._cb = [];
    this._id = "k" + ++_lastId;
    this._win = win;
    const current = win.__keyborg;
    if (current) {
      this._core = current.core;
      current.refs[this._id] = this;
    } else {
      this._core = new KeyborgCore(win, props);
      win.__keyborg = {
        core: this._core,
        refs: {
          [this._id]: this
        }
      };
    }
  }
  static create(win, props) {
    return new _Keyborg(win, props);
  }
  static dispose(instance) {
    instance.dispose();
  }
  /**
   * Updates all subscribed callbacks with the keyboard navigation state
   */
  static update(instance, isNavigatingWithKeyboard) {
    instance._cb.forEach((callback) => callback(isNavigatingWithKeyboard));
  }
  dispose() {
    var _a;
    const current = (_a = this._win) == null ? void 0 : _a.__keyborg;
    if (current == null ? void 0 : current.refs[this._id]) {
      delete current.refs[this._id];
      if (Object.keys(current.refs).length === 0) {
        current.core.dispose();
        delete this._win.__keyborg;
      }
    }
    this._cb = [];
    delete this._core;
    delete this._win;
  }
  /**
   * @returns Whether the user is navigating with keyboard
   */
  isNavigatingWithKeyboard() {
    var _a;
    return !!((_a = this._core) == null ? void 0 : _a.isNavigatingWithKeyboard);
  }
  /**
   * @param callback - Called when the keyboard navigation state changes
   */
  subscribe(callback) {
    this._cb.push(callback);
  }
  /**
   * @param callback - Registered with subscribe
   */
  unsubscribe(callback) {
    const index = this._cb.indexOf(callback);
    if (index >= 0) {
      this._cb.splice(index, 1);
    }
  }
  /**
   * Manually set the keyboard navigtion state
   */
  setVal(isNavigatingWithKeyboard) {
    if (this._core) {
      this._core.isNavigatingWithKeyboard = isNavigatingWithKeyboard;
    }
  }
};
function createKeyborg(win, props) {
  return Keyborg.create(win, props);
}
function disposeKeyborg(instance) {
  Keyborg.dispose(instance);
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const TABSTER_ATTRIBUTE_NAME = "data-tabster";
const TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME = "data-tabster-dummy";
const FOCUSABLE_SELECTOR = /* @__PURE__ */ ["a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", "*[tabindex]", "*[contenteditable]", "details > summary", "audio[controls]", "video[controls]"].join(", ");
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
  GridLinear: 4
  // Two-dimentional movement depending on the visual placement. Allows linear movement.
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
  Outside: 2
  // Tabster will always place dummy inputs outside of the container.
};
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function getTabsterOnElement(tabster, element) {
  var _a;
  return (_a = tabster.storageEntry(element)) === null || _a === void 0 ? void 0 : _a.tabster;
}
function updateTabsterByAttribute(tabster, element, dispose) {
  var _a, _b;
  const newAttrValue = dispose || tabster._noop ? void 0 : element.getAttribute(TABSTER_ATTRIBUTE_NAME);
  let entry = tabster.storageEntry(element);
  let newAttr;
  if (newAttrValue) {
    if (newAttrValue !== ((_a = entry === null || entry === void 0 ? void 0 : entry.attr) === null || _a === void 0 ? void 0 : _a.string)) {
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
  const oldTabsterProps = ((_b = entry.attr) === null || _b === void 0 ? void 0 : _b.object) || {};
  const newTabsterProps = (newAttr === null || newAttr === void 0 ? void 0 : newAttr.object) || {};
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
      case "deloser":
        if (tabsterOnElement.deloser) {
          tabsterOnElement.deloser.setProps(newTabsterProps.deloser);
        } else {
          if (tabster.deloser) {
            tabsterOnElement.deloser = tabster.deloser.createDeloser(element, newTabsterProps.deloser);
          }
        }
        break;
      case "root":
        if (tabsterOnElement.root) {
          tabsterOnElement.root.setProps(newTabsterProps.root);
        } else {
          tabsterOnElement.root = tabster.root.createRoot(element, newTabsterProps.root, sys);
        }
        tabster.root.onRoot(tabsterOnElement.root);
        break;
      case "modalizer":
        if (tabsterOnElement.modalizer) {
          tabsterOnElement.modalizer.setProps(newTabsterProps.modalizer);
        } else {
          if (tabster.modalizer) {
            tabsterOnElement.modalizer = tabster.modalizer.createModalizer(element, newTabsterProps.modalizer, sys);
          }
        }
        break;
      case "restorer":
        if (tabsterOnElement.restorer) {
          tabsterOnElement.restorer.setProps(newTabsterProps.restorer);
        } else {
          if (tabster.restorer) {
            if (newTabsterProps.restorer) {
              tabsterOnElement.restorer = tabster.restorer.createRestorer(element, newTabsterProps.restorer);
            }
          }
        }
        break;
      case "focusable":
        tabsterOnElement.focusable = newTabsterProps.focusable;
        break;
      case "groupper":
        if (tabsterOnElement.groupper) {
          tabsterOnElement.groupper.setProps(newTabsterProps.groupper);
        } else {
          if (tabster.groupper) {
            tabsterOnElement.groupper = tabster.groupper.createGroupper(element, newTabsterProps.groupper, sys);
          }
        }
        break;
      case "mover":
        if (tabsterOnElement.mover) {
          tabsterOnElement.mover.setProps(newTabsterProps.mover);
        } else {
          if (tabster.mover) {
            tabsterOnElement.mover = tabster.mover.createMover(element, newTabsterProps.mover, sys);
          }
        }
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
      default:
        console.error(`Unknown key '${key}' in data-tabster attribute value.`);
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
const TabsterFocusInEventName = "tabster:focusin";
const TabsterFocusOutEventName = "tabster:focusout";
const TabsterMoveFocusEventName = "tabster:movefocus";
const DeloserFocusLostEventName = "tabster:deloser:focus-lost";
const DeloserRestoreFocusEventName = "tabster:deloser:restore-focus";
const MoverStateEventName = "tabster:mover:state";
const MoverMoveFocusEventName = "tabster:mover:movefocus";
const MoverMemorizedElementEventName = "tabster:mover:memorized-element";
const RootFocusEventName = "tabster:root:focus";
const RootBlurEventName = "tabster:root:blur";
const CustomEvent_ = typeof CustomEvent !== "undefined" ? CustomEvent : function() {
};
class TabsterCustomEvent extends CustomEvent_ {
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
const _createMutationObserver = (callback) => new MutationObserver(callback);
const _createTreeWalker = (doc, root, whatToShow, filter) => doc.createTreeWalker(root, whatToShow, filter);
const _getParentNode = (node) => node ? node.parentNode : null;
const _getParentElement = (element) => element ? element.parentElement : null;
const _nodeContains = (parent, child) => !!(child && (parent === null || parent === void 0 ? void 0 : parent.contains(child)));
const _getActiveElement = (doc) => doc.activeElement;
const _querySelector = (element, selector) => element.querySelector(selector);
const _querySelectorAll = (element, selector) => Array.prototype.slice.call(element.querySelectorAll(selector), 0);
const _getElementById = (doc, id) => doc.getElementById(id);
const _getFirstChild = (node) => (node === null || node === void 0 ? void 0 : node.firstChild) || null;
const _getLastChild = (node) => (node === null || node === void 0 ? void 0 : node.lastChild) || null;
const _getNextSibling = (node) => (node === null || node === void 0 ? void 0 : node.nextSibling) || null;
const _getPreviousSibling = (node) => (node === null || node === void 0 ? void 0 : node.previousSibling) || null;
const _getFirstElementChild = (element) => (element === null || element === void 0 ? void 0 : element.firstElementChild) || null;
const _getLastElementChild = (element) => (element === null || element === void 0 ? void 0 : element.lastElementChild) || null;
const _getNextElementSibling = (element) => (element === null || element === void 0 ? void 0 : element.nextElementSibling) || null;
const _getPreviousElementSibling = (element) => (element === null || element === void 0 ? void 0 : element.previousElementSibling) || null;
const _appendChild = (parent, child) => parent.appendChild(child);
const _insertBefore = (parent, child, referenceChild) => parent.insertBefore(child, referenceChild);
const _getSelection = (ref) => {
  var _a;
  return ((_a = ref.ownerDocument) === null || _a === void 0 ? void 0 : _a.getSelection()) || null;
};
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
let _isBrokenIE11;
const _DOMRect = typeof DOMRect !== "undefined" ? DOMRect : class {
  constructor(x, y, width, height) {
    this.left = x || 0;
    this.top = y || 0;
    this.right = (x || 0) + (width || 0);
    this.bottom = (y || 0) + (height || 0);
  }
};
let _uidCounter = 0;
try {
  document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
  _isBrokenIE11 = false;
} catch (e) {
  _isBrokenIE11 = true;
}
const _updateDummyInputsTimeout = 100;
function getInstanceContext(getWindow) {
  const win = getWindow();
  let ctx = win.__tabsterInstanceContext;
  if (!ctx) {
    ctx = {
      elementByUId: {},
      basics: {
        Promise: win.Promise || void 0,
        WeakRef: win.WeakRef || void 0
      },
      containerBoundingRectCache: {},
      lastContainerBoundingRectCacheId: 0,
      fakeWeakRefs: [],
      fakeWeakRefsStarted: false
    };
    win.__tabsterInstanceContext = ctx;
  }
  return ctx;
}
function disposeInstanceContext(win) {
  const ctx = win.__tabsterInstanceContext;
  if (ctx) {
    ctx.elementByUId = {};
    delete ctx.WeakRef;
    ctx.containerBoundingRectCache = {};
    if (ctx.containerBoundingRectCacheTimer) {
      win.clearTimeout(ctx.containerBoundingRectCacheTimer);
    }
    if (ctx.fakeWeakRefsTimer) {
      win.clearTimeout(ctx.fakeWeakRefsTimer);
    }
    ctx.fakeWeakRefs = [];
    delete win.__tabsterInstanceContext;
  }
}
function createWeakMap(win) {
  const ctx = win.__tabsterInstanceContext;
  return new ((ctx === null || ctx === void 0 ? void 0 : ctx.basics.WeakMap) || WeakMap)();
}
function hasSubFocusable(element) {
  return !!element.querySelector(FOCUSABLE_SELECTOR);
}
class FakeWeakRef {
  constructor(target) {
    this._target = target;
  }
  deref() {
    return this._target;
  }
  static cleanup(fwr, forceRemove) {
    if (!fwr._target) {
      return true;
    }
    if (forceRemove || !documentContains(fwr._target.ownerDocument, fwr._target)) {
      delete fwr._target;
      return true;
    }
    return false;
  }
}
class WeakHTMLElement {
  constructor(getWindow, element, data) {
    const context = getInstanceContext(getWindow);
    let ref;
    if (context.WeakRef) {
      ref = new context.WeakRef(element);
    } else {
      ref = new FakeWeakRef(element);
      context.fakeWeakRefs.push(ref);
    }
    this._ref = ref;
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
function cleanupFakeWeakRefs(getWindow, forceRemove) {
  const context = getInstanceContext(getWindow);
  context.fakeWeakRefs = context.fakeWeakRefs.filter((e) => !FakeWeakRef.cleanup(e, forceRemove));
}
function startFakeWeakRefsCleanup(getWindow) {
  const context = getInstanceContext(getWindow);
  if (!context.fakeWeakRefsStarted) {
    context.fakeWeakRefsStarted = true;
    context.WeakRef = getWeakRef(context);
  }
  if (!context.fakeWeakRefsTimer) {
    context.fakeWeakRefsTimer = getWindow().setTimeout(() => {
      context.fakeWeakRefsTimer = void 0;
      cleanupFakeWeakRefs(getWindow);
      startFakeWeakRefsCleanup(getWindow);
    }, 2 * 60 * 1e3);
  }
}
function stopFakeWeakRefsCleanupAndClearStorage(getWindow) {
  const context = getInstanceContext(getWindow);
  context.fakeWeakRefsStarted = false;
  if (context.fakeWeakRefsTimer) {
    getWindow().clearTimeout(context.fakeWeakRefsTimer);
    context.fakeWeakRefsTimer = void 0;
    context.fakeWeakRefs = [];
  }
}
function createElementTreeWalker(doc, root, acceptNode) {
  if (root.nodeType !== Node.ELEMENT_NODE) {
    return void 0;
  }
  const filter = _isBrokenIE11 ? acceptNode : {
    acceptNode
  };
  return dom.createTreeWalker(
    doc,
    root,
    NodeFilter.SHOW_ELEMENT,
    filter,
    // @ts-ignore: We still don't want to completely break IE11, so, entityReferenceExpansion argument is not optional.
    false
    /* Last argument is not optional for IE11! */
  );
}
function getBoundingRect(getWindow, element) {
  let cacheId = element.__tabsterCacheId;
  const context = getInstanceContext(getWindow);
  const cached = cacheId ? context.containerBoundingRectCache[cacheId] : void 0;
  if (cached) {
    return cached.rect;
  }
  const scrollingElement = element.ownerDocument && element.ownerDocument.documentElement;
  if (!scrollingElement) {
    return new _DOMRect();
  }
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
  const rect = new _DOMRect(left < right ? left : -1, top < bottom ? top : -1, left < right ? right - left : 0, top < bottom ? bottom - top : 0);
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
      context.containerBoundingRectCacheTimer = void 0;
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
  if (wnd.crypto && wnd.crypto.getRandomValues) {
    wnd.crypto.getRandomValues(rnd);
  } else if (wnd.msCrypto && wnd.msCrypto.getRandomValues) {
    wnd.msCrypto.getRandomValues(rnd);
  } else {
    for (let i = 0; i < rnd.length; i++) {
      rnd[i] = 4294967295 * Math.random();
    }
  }
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
    context.elementByUId[uid] = new WeakHTMLElement(getWindow, element);
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
function documentContains(doc, element) {
  return dom.nodeContains(doc === null || doc === void 0 ? void 0 : doc.body, element);
}
function matchesSelector(element, selector) {
  const matches = element.matches || element.matchesSelector || element.msMatchesSelector || element.webkitMatchesSelector;
  return matches && matches.call(element, selector);
}
function getPromise(getWindow) {
  const context = getInstanceContext(getWindow);
  if (context.basics.Promise) {
    return context.basics.Promise;
  }
  throw new Error("No Promise defined.");
}
function getWeakRef(context) {
  return context.basics.WeakRef;
}
let _lastTabsterPartId = 0;
class TabsterPart {
  constructor(tabster, element, props) {
    const getWindow = tabster.getWindow;
    this._tabster = tabster;
    this._element = new WeakHTMLElement(getWindow, element);
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
class DummyInput {
  constructor(getWindow, isOutside, props, element, fixedTarget) {
    var _a;
    this._focusIn = (e) => {
      if (this._fixedTarget) {
        const target = this._fixedTarget.get();
        if (target) {
          nativeFocus(target);
        }
        return;
      }
      const input2 = this.input;
      if (this.onFocusIn && input2) {
        const relatedTarget = e.relatedTarget;
        this.onFocusIn(this, this._isBackward(true, input2, relatedTarget), relatedTarget);
      }
    };
    this._focusOut = (e) => {
      if (this._fixedTarget) {
        return;
      }
      this.useDefaultAction = false;
      const input2 = this.input;
      if (this.onFocusOut && input2) {
        const relatedTarget = e.relatedTarget;
        this.onFocusOut(this, this._isBackward(false, input2, relatedTarget), relatedTarget);
      }
    };
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
    this._isPhantom = (_a = props.isPhantom) !== null && _a !== void 0 ? _a : false;
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
    var _a;
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
    (_a = dom.getParentNode(input)) === null || _a === void 0 ? void 0 : _a.removeChild(input);
  }
  setTopLeft(top, left) {
    var _a;
    const style = (_a = this.input) === null || _a === void 0 ? void 0 : _a.style;
    if (style) {
      style.top = `${top}px`;
      style.left = `${left}px`;
    }
  }
  _isBackward(isIn, current, previous) {
    return isIn && !previous ? !this.isFirst : !!(previous && current.compareDocumentPosition(previous) & Node.DOCUMENT_POSITION_FOLLOWING);
  }
}
const DummyInputManagerPriorities = {
  Root: 1,
  Mover: 3};
class DummyInputManager {
  constructor(tabster, element, priority, sys, outsideByDefault, callForDefaultAction) {
    this._element = element;
    this._instance = new DummyInputManagerCore(tabster, element, this, priority, sys, outsideByDefault, callForDefaultAction);
  }
  _setHandlers(onFocusIn, onFocusOut) {
    this._onFocusIn = onFocusIn;
    this._onFocusOut = onFocusOut;
  }
  moveOut(backwards) {
    var _a;
    (_a = this._instance) === null || _a === void 0 ? void 0 : _a.moveOut(backwards);
  }
  moveOutWithDefaultAction(backwards, relatedEvent) {
    var _a;
    (_a = this._instance) === null || _a === void 0 ? void 0 : _a.moveOutWithDefaultAction(backwards, relatedEvent);
  }
  getHandler(isIn) {
    return isIn ? this._onFocusIn : this._onFocusOut;
  }
  setTabbable(tabbable) {
    var _a;
    (_a = this._instance) === null || _a === void 0 ? void 0 : _a.setTabbable(this, tabbable);
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
      let insertBefore2;
      if (element.tagName === "BODY") {
        parent = element;
        insertBefore2 = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? dom.getFirstElementChild(element) : null;
      } else {
        if (moveOutOfElement && (!isBackward || isBackward && !tabster.focusable.isFocusable(element, false, true, true))) {
          parent = element;
          insertBefore2 = isBackward ? element.firstElementChild : null;
        } else {
          parent = dom.getParentElement(element);
          insertBefore2 = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? element : dom.getNextElementSibling(element);
        }
        let potentialDummy;
        let dummyFor;
        do {
          potentialDummy = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? dom.getPreviousElementSibling(insertBefore2) : insertBefore2;
          dummyFor = getDummyInputContainer(potentialDummy);
          if (dummyFor === element) {
            insertBefore2 = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? potentialDummy : dom.getNextElementSibling(potentialDummy);
          } else {
            dummyFor = null;
          }
        } while (dummyFor);
      }
      if (parent === null || parent === void 0 ? void 0 : parent.dispatchEvent(new TabsterMoveFocusEvent({
        by: "root",
        owner: parent,
        next: null,
        relatedEvent
      }))) {
        dom.insertBefore(parent, input, insertBefore2);
        nativeFocus(input);
      }
    }
  }
  static addPhantomDummyWithTarget(tabster, sourceElement, isBackward, targetElement) {
    const dummy = new DummyInput(tabster.getWindow, true, {
      isPhantom: true,
      isFirst: true
    }, void 0, new WeakHTMLElement(tabster.getWindow, targetElement));
    const input = dummy.input;
    if (input) {
      let dummyParent;
      let insertBefore2;
      if (hasSubFocusable(sourceElement) && !isBackward) {
        dummyParent = sourceElement;
        insertBefore2 = dom.getFirstElementChild(sourceElement);
      } else {
        dummyParent = dom.getParentElement(sourceElement);
        insertBefore2 = isBackward ? sourceElement : dom.getNextElementSibling(sourceElement);
      }
      if (dummyParent) {
        dom.insertBefore(dummyParent, input, insertBefore2);
      }
    }
  }
}
class DummyInputObserver {
  constructor(win) {
    this._updateQueue = /* @__PURE__ */ new Set();
    this._lastUpdateQueueTime = 0;
    this._changedParents = /* @__PURE__ */ new WeakSet();
    this._dummyElements = [];
    this._dummyCallbacks = /* @__PURE__ */ new WeakMap();
    this._domChanged = (parent) => {
      var _a;
      if (this._changedParents.has(parent)) {
        return;
      }
      this._changedParents.add(parent);
      if (this._updateDummyInputsTimer) {
        return;
      }
      this._updateDummyInputsTimer = (_a = this._win) === null || _a === void 0 ? void 0 : _a.call(this).setTimeout(() => {
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
    this._win = win;
  }
  add(dummy, callback) {
    if (!this._dummyCallbacks.has(dummy) && this._win) {
      this._dummyElements.push(new WeakHTMLElement(this._win, dummy));
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
    var _a;
    const win = (_a = this._win) === null || _a === void 0 ? void 0 : _a.call(this);
    if (this._updateTimer) {
      win === null || win === void 0 ? void 0 : win.clearTimeout(this._updateTimer);
      delete this._updateTimer;
    }
    if (this._updateDummyInputsTimer) {
      win === null || win === void 0 ? void 0 : win.clearTimeout(this._updateDummyInputsTimer);
      delete this._updateDummyInputsTimer;
    }
    this._changedParents = /* @__PURE__ */ new WeakSet();
    this._dummyCallbacks = /* @__PURE__ */ new WeakMap();
    this._dummyElements = [];
    this._updateQueue.clear();
    delete this.domChanged;
    delete this._win;
  }
  updatePositions(compute) {
    if (!this._win) {
      return;
    }
    this._updateQueue.add(compute);
    this._lastUpdateQueueTime = Date.now();
    this._scheduledUpdatePositions();
  }
  _scheduledUpdatePositions() {
    var _a;
    if (this._updateTimer) {
      return;
    }
    this._updateTimer = (_a = this._win) === null || _a === void 0 ? void 0 : _a.call(this).setTimeout(() => {
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
  constructor(tabster, element, manager, priority, sys, outsideByDefault, callForDefaultAction) {
    this._wrappers = [];
    this._isOutside = false;
    this._transformElements = /* @__PURE__ */ new Set();
    this._onFocusIn = (dummyInput, isBackward, relatedTarget) => {
      this._onFocus(true, dummyInput, isBackward, relatedTarget);
    };
    this._onFocusOut = (dummyInput, isBackward, relatedTarget) => {
      this._onFocus(false, dummyInput, isBackward, relatedTarget);
    };
    this.moveOut = (backwards) => {
      var _a;
      const first = this._firstDummy;
      const last = this._lastDummy;
      if (first && last) {
        this._ensurePosition();
        const firstInput = first.input;
        const lastInput = last.input;
        const element2 = (_a = this._element) === null || _a === void 0 ? void 0 : _a.get();
        if (firstInput && lastInput && element2) {
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
    this.moveOutWithDefaultAction = (backwards, relatedEvent) => {
      var _a;
      const first = this._firstDummy;
      const last = this._lastDummy;
      if (first && last) {
        this._ensurePosition();
        const firstInput = first.input;
        const lastInput = last.input;
        const element2 = (_a = this._element) === null || _a === void 0 ? void 0 : _a.get();
        if (firstInput && lastInput && element2) {
          let toFocus;
          if (backwards) {
            if (!first.isOutside && this._tabster.focusable.isFocusable(element2, true, true, true)) {
              toFocus = element2;
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
          if (toFocus && element2.dispatchEvent(new TabsterMoveFocusEvent({
            by: "root",
            owner: element2,
            next: null,
            relatedEvent
          }))) {
            nativeFocus(toFocus);
          }
        }
      }
    };
    this.setTabbable = (manager2, tabbable) => {
      var _a, _b;
      for (const w of this._wrappers) {
        if (w.manager === manager2) {
          w.tabbable = tabbable;
          break;
        }
      }
      const wrapper = this._getCurrent();
      if (wrapper) {
        const tabIndex = wrapper.tabbable ? 0 : -1;
        let input = (_a = this._firstDummy) === null || _a === void 0 ? void 0 : _a.input;
        if (input) {
          input.tabIndex = tabIndex;
        }
        input = (_b = this._lastDummy) === null || _b === void 0 ? void 0 : _b.input;
        if (input) {
          input.tabIndex = tabIndex;
        }
      }
    };
    this._addDummyInputs = () => {
      if (this._addTimer) {
        return;
      }
      this._addTimer = this._getWindow().setTimeout(() => {
        delete this._addTimer;
        this._ensurePosition();
        this._addTransformOffsets();
      }, 0);
    };
    this._addTransformOffsets = () => {
      this._tabster._dummyObserver.updatePositions(this._computeTransformOffsets);
    };
    this._computeTransformOffsets = (scrollTopLeftCache) => {
      var _a, _b;
      const from = ((_a = this._firstDummy) === null || _a === void 0 ? void 0 : _a.input) || ((_b = this._lastDummy) === null || _b === void 0 ? void 0 : _b.input);
      const transformElements = this._transformElements;
      const newTransformElements = /* @__PURE__ */ new Set();
      let scrollTop = 0;
      let scrollLeft = 0;
      const win = this._getWindow();
      for (let element2 = from; element2 && element2.nodeType === Node.ELEMENT_NODE; element2 = dom.getParentElement(element2)) {
        let scrollTopLeft = scrollTopLeftCache.get(element2);
        if (scrollTopLeft === void 0) {
          const transform = win.getComputedStyle(element2).transform;
          if (transform && transform !== "none") {
            scrollTopLeft = {
              scrollTop: element2.scrollTop,
              scrollLeft: element2.scrollLeft
            };
          }
          scrollTopLeftCache.set(element2, scrollTopLeft || null);
        }
        if (scrollTopLeft) {
          newTransformElements.add(element2);
          if (!transformElements.has(element2)) {
            element2.addEventListener("scroll", this._addTransformOffsets);
          }
          scrollTop += scrollTopLeft.scrollTop;
          scrollLeft += scrollTopLeft.scrollLeft;
        }
      }
      for (const el2 of transformElements) {
        if (!newTransformElements.has(el2)) {
          el2.removeEventListener("scroll", this._addTransformOffsets);
        }
      }
      this._transformElements = newTransformElements;
      return () => {
        var _a2, _b2;
        (_a2 = this._firstDummy) === null || _a2 === void 0 ? void 0 : _a2.setTopLeft(scrollTop, scrollLeft);
        (_b2 = this._lastDummy) === null || _b2 === void 0 ? void 0 : _b2.setTopLeft(scrollTop, scrollLeft);
      };
    };
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
    const forcedDummyPosition = sys === null || sys === void 0 ? void 0 : sys.dummyInputsPosition;
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
    var _a, _b, _c, _d;
    const wrappers = this._wrappers = this._wrappers.filter((w) => w.manager !== manager && !force);
    if (wrappers.length === 0) {
      delete ((_a = this._element) === null || _a === void 0 ? void 0 : _a.get()).__tabsterDummy;
      for (const el of this._transformElements) {
        el.removeEventListener("scroll", this._addTransformOffsets);
      }
      this._transformElements.clear();
      const win = this._getWindow();
      if (this._addTimer) {
        win.clearTimeout(this._addTimer);
        delete this._addTimer;
      }
      const dummyElement = (_b = this._firstDummy) === null || _b === void 0 ? void 0 : _b.input;
      dummyElement && this._tabster._dummyObserver.remove(dummyElement);
      (_c = this._firstDummy) === null || _c === void 0 ? void 0 : _c.dispose();
      (_d = this._lastDummy) === null || _d === void 0 ? void 0 : _d.dispose();
    }
  }
  _onFocus(isIn, dummyInput, isBackward, relatedTarget) {
    var _a;
    const wrapper = this._getCurrent();
    if (wrapper && (!dummyInput.useDefaultAction || this._callForDefaultAction)) {
      (_a = wrapper.manager.getHandler(isIn)) === null || _a === void 0 ? void 0 : _a(dummyInput, isBackward, relatedTarget);
    }
  }
  _getCurrent() {
    this._wrappers.sort((a, b) => {
      if (a.tabbable !== b.tabbable) {
        return a.tabbable ? -1 : 1;
      }
      return a.priority - b.priority;
    });
    return this._wrappers[0];
  }
  _ensurePosition() {
    var _a, _b, _c;
    const element = (_a = this._element) === null || _a === void 0 ? void 0 : _a.get();
    const firstDummyInput = (_b = this._firstDummy) === null || _b === void 0 ? void 0 : _b.input;
    const lastDummyInput = (_c = this._lastDummy) === null || _c === void 0 ? void 0 : _c.input;
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
}
function getLastChild$2(container) {
  let lastChild = null;
  for (let i = dom.getLastElementChild(container); i; i = dom.getLastElementChild(i)) {
    lastChild = i;
  }
  return lastChild || void 0;
}
function isDisplayNone(element) {
  var _a, _b;
  const elementDocument = element.ownerDocument;
  const computedStyle = (_a = elementDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(element);
  if (element.offsetParent === null && elementDocument.body !== element && (computedStyle === null || computedStyle === void 0 ? void 0 : computedStyle.position) !== "fixed") {
    return true;
  }
  if ((computedStyle === null || computedStyle === void 0 ? void 0 : computedStyle.visibility) === "hidden") {
    return true;
  }
  if ((computedStyle === null || computedStyle === void 0 ? void 0 : computedStyle.position) === "fixed") {
    if (computedStyle.display === "none") {
      return true;
    }
    if (((_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.offsetParent) === null && elementDocument.body !== element.parentElement) {
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
  radioButtons = radioButtons.filter((el) => {
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
function getDummyInputContainer(element) {
  var _a;
  return ((_a = element === null || element === void 0 ? void 0 : element.__tabsterDummyContainer) === null || _a === void 0 ? void 0 : _a.get()) || null;
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
class RootDummyManager extends DummyInputManager {
  constructor(tabster, element, setFocused, sys) {
    super(tabster, element, DummyInputManagerPriorities.Root, sys, void 0, true);
    this._onDummyInputFocus = (dummyInput) => {
      var _a;
      if (dummyInput.useDefaultAction) {
        this._setFocused(false);
      } else {
        this._tabster.keyboardNavigation.setNavigatingWithKeyboard(true);
        const element2 = this._element.get();
        if (element2) {
          this._setFocused(true);
          const toFocus = this._tabster.focusedElement.getFirstOrLastTabbable(dummyInput.isFirst, {
            container: element2,
            ignoreAccessibility: true
          });
          if (toFocus) {
            nativeFocus(toFocus);
            return;
          }
        }
        (_a = dummyInput.input) === null || _a === void 0 ? void 0 : _a.blur();
      }
    };
    this._setHandlers(this._onDummyInputFocus);
    this._tabster = tabster;
    this._setFocused = setFocused;
  }
}
class Root extends TabsterPart {
  constructor(tabster, element, onDispose, props, sys) {
    super(tabster, element, props);
    this._isFocused = false;
    this._setFocused = (hasFocused) => {
      var _a;
      if (this._setFocusedTimer) {
        this._tabster.getWindow().clearTimeout(this._setFocusedTimer);
        delete this._setFocusedTimer;
      }
      if (this._isFocused === hasFocused) {
        return;
      }
      const element2 = this._element.get();
      if (element2) {
        if (hasFocused) {
          this._isFocused = true;
          (_a = this._dummyManager) === null || _a === void 0 ? void 0 : _a.setTabbable(false);
          element2.dispatchEvent(new RootFocusEvent({
            element: element2
          }));
        } else {
          this._setFocusedTimer = this._tabster.getWindow().setTimeout(() => {
            var _a2;
            delete this._setFocusedTimer;
            this._isFocused = false;
            (_a2 = this._dummyManager) === null || _a2 === void 0 ? void 0 : _a2.setTabbable(true);
            element2.dispatchEvent(new RootBlurEvent({
              element: element2
            }));
          }, 0);
        }
      }
    };
    this._onFocusIn = (event) => {
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
    this._onFocusOut = () => {
      this._setFocused(false);
    };
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
    var _a;
    this._onDispose(this);
    const win = this._tabster.getWindow();
    const doc = win.document;
    doc.removeEventListener(KEYBORG_FOCUSIN, this._onFocusIn);
    doc.removeEventListener(KEYBORG_FOCUSOUT, this._onFocusOut);
    if (this._setFocusedTimer) {
      win.clearTimeout(this._setFocusedTimer);
      delete this._setFocusedTimer;
    }
    (_a = this._dummyManager) === null || _a === void 0 ? void 0 : _a.dispose();
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
  _add() {
  }
  _remove() {
  }
}
class RootAPI {
  constructor(tabster, autoRoot) {
    this._autoRootWaiting = false;
    this._roots = {};
    this._forceDummy = false;
    this.rootById = {};
    this._autoRootCreate = () => {
      var _a;
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
          return (_a = getTabsterOnElement(this._tabster, body)) === null || _a === void 0 ? void 0 : _a.root;
        }
      } else if (!this._autoRootWaiting) {
        this._autoRootWaiting = true;
        doc.addEventListener("readystatechange", this._autoRootCreate);
      }
      return void 0;
    };
    this._onRootDispose = (root) => {
      delete this._roots[root.id];
    };
    this._tabster = tabster;
    this._win = tabster.getWindow;
    this._autoRoot = autoRoot;
    tabster.queueInit(() => {
      if (this._autoRoot) {
        this._autoRootCreate();
      }
    });
  }
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
  static getTabsterContext(tabster, element, options) {
    if (options === void 0) {
      options = {};
    }
    var _a, _b, _c, _d;
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
      if (!mover && ((_a = tabsterOnElement.focusable) === null || _a === void 0 ? void 0 : _a.excludeFromMover) && !groupper) {
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
          if (!curGroupper.isActive() && curGroupper.getProps().tabbability && modalizer.userId !== ((_b = tabster.modalizer) === null || _b === void 0 ? void 0 : _b.activeId)) {
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
      if ((_c = tabsterOnElement.focusable) === null || _c === void 0 ? void 0 : _c.ignoreKeydown) {
        Object.assign(ignoreKeydown, tabsterOnElement.focusable.ignoreKeydown);
      }
      curElement = getParent(curElement);
    }
    if (!root) {
      const rootAPI = tabster.root;
      const autoRoot = rootAPI._autoRoot;
      if (autoRoot) {
        if ((_d = element.ownerDocument) === null || _d === void 0 ? void 0 : _d.body) {
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
    var _a;
    const getParent = tabster.getParent;
    for (let el = element; el; el = getParent(el)) {
      const root = (_a = getTabsterOnElement(tabster, el)) === null || _a === void 0 ? void 0 : _a.root;
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
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const _containerHistoryLength = 10;
class DeloserItemBase {
}
class DeloserItem extends DeloserItemBase {
  constructor(tabster, deloser) {
    super();
    this.uid = deloser.uid;
    this._tabster = tabster;
    this._deloser = deloser;
  }
  belongsTo(deloser) {
    return deloser === this._deloser;
  }
  unshift(element) {
    this._deloser.unshift(element);
  }
  async focusAvailable() {
    const available = this._deloser.findAvailable();
    const deloserElement = this._deloser.getElement();
    if (available && deloserElement) {
      if (!deloserElement.dispatchEvent(new TabsterMoveFocusEvent({
        by: "deloser",
        owner: deloserElement,
        next: available
      }))) {
        return null;
      }
      return this._tabster.focusedElement.focus(available);
    }
    return false;
  }
  async resetFocus() {
    const getWindow = this._tabster.getWindow;
    return getPromise(getWindow).resolve(this._deloser.resetFocus());
  }
}
class DeloserHistoryByRootBase {
  constructor(tabster, rootUId) {
    this._history = [];
    this._tabster = tabster;
    this.rootUId = rootUId;
  }
  getLength() {
    return this._history.length;
  }
  removeDeloser(deloser) {
    this._history = this._history.filter((c) => !c.belongsTo(deloser));
  }
  hasDeloser(deloser) {
    return this._history.some((d) => d.belongsTo(deloser));
  }
}
class DeloserHistoryByRoot extends DeloserHistoryByRootBase {
  unshiftToDeloser(deloser, element) {
    let item;
    for (let i = 0; i < this._history.length; i++) {
      if (this._history[i].belongsTo(deloser)) {
        item = this._history[i];
        this._history.splice(i, 1);
        break;
      }
    }
    if (!item) {
      item = new DeloserItem(this._tabster, deloser);
    }
    item.unshift(element);
    this._history.unshift(item);
    this._history.splice(_containerHistoryLength, this._history.length - _containerHistoryLength);
  }
  async focusAvailable(from) {
    let skip = !!from;
    for (const i of this._history) {
      if (from && i.belongsTo(from)) {
        skip = false;
      }
      if (!skip) {
        const result = await i.focusAvailable();
        if (result || result === null) {
          return result;
        }
      }
    }
    return false;
  }
  async resetFocus(from) {
    let skip = !!from;
    const resetQueue = {};
    for (const i of this._history) {
      if (from && i.belongsTo(from)) {
        skip = false;
      }
      if (!skip && !resetQueue[i.uid]) {
        resetQueue[i.uid] = i;
      }
    }
    for (const id of Object.keys(resetQueue)) {
      if (await resetQueue[id].resetFocus()) {
        return true;
      }
    }
    return false;
  }
}
class DeloserHistory {
  constructor(tabster) {
    this._history = [];
    this._tabster = tabster;
  }
  dispose() {
    this._history = [];
  }
  process(element) {
    var _a;
    const ctx = RootAPI.getTabsterContext(this._tabster, element);
    const rootUId = ctx && ctx.root.uid;
    const deloser = DeloserAPI.getDeloser(this._tabster, element);
    if (!rootUId || !deloser) {
      return void 0;
    }
    const historyByRoot = this.make(rootUId, () => new DeloserHistoryByRoot(this._tabster, rootUId));
    if (!ctx || !ctx.modalizer || ((_a = ctx.modalizer) === null || _a === void 0 ? void 0 : _a.isActive())) {
      historyByRoot.unshiftToDeloser(deloser, element);
    }
    return deloser;
  }
  make(rootUId, createInstance) {
    let historyByRoot;
    for (let i = 0; i < this._history.length; i++) {
      const hbr = this._history[i];
      if (hbr.rootUId === rootUId) {
        historyByRoot = hbr;
        this._history.splice(i, 1);
        break;
      }
    }
    if (!historyByRoot) {
      historyByRoot = createInstance();
    }
    this._history.unshift(historyByRoot);
    this._history.splice(_containerHistoryLength, this._history.length - _containerHistoryLength);
    return historyByRoot;
  }
  removeDeloser(deloser) {
    this._history.forEach((i) => {
      i.removeDeloser(deloser);
    });
    this._history = this._history.filter((i) => i.getLength() > 0);
  }
  async focusAvailable(from) {
    let skip = !!from;
    for (const h of this._history) {
      if (from && h.hasDeloser(from)) {
        skip = false;
      }
      if (!skip) {
        const result = await h.focusAvailable(from);
        if (result || result === null) {
          return result;
        }
      }
    }
    return false;
  }
  async resetFocus(from) {
    let skip = !!from;
    for (const h of this._history) {
      if (from && h.hasDeloser(from)) {
        skip = false;
      }
      if (!skip && await h.resetFocus(from)) {
        return true;
      }
    }
    return false;
  }
}
function buildElementSelector(element, withClass, withIndex) {
  const selector = [];
  const escapeRegExp = /(:|\.|\[|\]|,|=|@)/g;
  const escapeReplaceValue = "\\$1";
  const elementId = element.getAttribute("id");
  if (elementId) {
    selector.push("#" + elementId.replace(escapeRegExp, escapeReplaceValue));
  }
  if (withClass !== false && element.className) {
    element.className.split(" ").forEach((cls) => {
      cls = cls.trim();
      if (cls) {
        selector.push("." + cls.replace(escapeRegExp, escapeReplaceValue));
      }
    });
  }
  let index = 0;
  let el;
  if (withIndex !== false && selector.length === 0) {
    el = element;
    while (el) {
      index++;
      el = el.previousElementSibling;
    }
    selector.unshift(":nth-child(" + index + ")");
  }
  selector.unshift(element.tagName.toLowerCase());
  return selector.join("");
}
function buildSelector(element) {
  if (!documentContains(element.ownerDocument, element)) {
    return void 0;
  }
  const selector = [buildElementSelector(element)];
  let node = dom.getParentNode(element);
  while (node && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const isBody = node.tagName === "BODY";
      selector.unshift(buildElementSelector(node, false, !isBody));
      if (isBody) {
        break;
      }
    }
    node = dom.getParentNode(node);
  }
  return selector.join(" ");
}
class Deloser extends TabsterPart {
  constructor(tabster, element, onDispose, props) {
    super(tabster, element, props);
    this._isActive = false;
    this._history = [[]];
    this._snapshotIndex = 0;
    this.isActive = () => {
      return this._isActive;
    };
    this.setSnapshot = (index) => {
      this._snapshotIndex = index;
      if (this._history.length > index + 1) {
        this._history.splice(index + 1, this._history.length - index - 1);
      }
      if (!this._history[index]) {
        this._history[index] = [];
      }
    };
    this.focusFirst = () => {
      const e = this._element.get();
      return !!e && this._tabster.focusedElement.focusFirst({
        container: e
      });
    };
    this.focusDefault = () => {
      const e = this._element.get();
      return !!e && this._tabster.focusedElement.focusDefault(e);
    };
    this.resetFocus = () => {
      const e = this._element.get();
      return !!e && this._tabster.focusedElement.resetFocus(e);
    };
    this.clearHistory = (preserveExisting) => {
      const element2 = this._element.get();
      if (!element2) {
        this._history[this._snapshotIndex] = [];
        return;
      }
      this._history[this._snapshotIndex] = this._history[this._snapshotIndex].filter((we) => {
        const e = we.get();
        return e && preserveExisting ? dom.nodeContains(element2, e) : false;
      });
    };
    this.uid = getElementUId(tabster.getWindow, element);
    this.strategy = props.strategy || DeloserStrategies.Auto;
    this._onDispose = onDispose;
  }
  dispose() {
    this._remove();
    this._onDispose(this);
    this._isActive = false;
    this._snapshotIndex = 0;
    this._props = {};
    this._history = [];
  }
  setActive(active) {
    this._isActive = active;
  }
  getActions() {
    return {
      focusDefault: this.focusDefault,
      focusFirst: this.focusFirst,
      resetFocus: this.resetFocus,
      clearHistory: this.clearHistory,
      setSnapshot: this.setSnapshot,
      isActive: this.isActive
    };
  }
  unshift(element) {
    let cur = this._history[this._snapshotIndex];
    cur = this._history[this._snapshotIndex] = cur.filter((we) => {
      const e = we.get();
      return e && e !== element;
    });
    cur.unshift(new WeakHTMLElement(this._tabster.getWindow, element, buildSelector(element)));
    while (cur.length > _containerHistoryLength) {
      cur.pop();
    }
  }
  findAvailable() {
    const element = this._element.get();
    if (!element || !this._tabster.focusable.isVisible(element)) {
      return null;
    }
    let restoreFocusOrder = this._props.restoreFocusOrder;
    let available = null;
    const ctx = RootAPI.getTabsterContext(this._tabster, element);
    if (!ctx) {
      return null;
    }
    const root = ctx.root;
    const rootElement = root.getElement();
    if (!rootElement) {
      return null;
    }
    if (restoreFocusOrder === void 0) {
      restoreFocusOrder = root.getProps().restoreFocusOrder;
    }
    if (restoreFocusOrder === RestoreFocusOrders.RootDefault) {
      available = this._tabster.focusable.findDefault({
        container: rootElement
      });
    }
    if (!available && restoreFocusOrder === RestoreFocusOrders.RootFirst) {
      available = this._findFirst(rootElement);
    }
    if (available) {
      return available;
    }
    const availableInHistory = this._findInHistory();
    if (availableInHistory && restoreFocusOrder === RestoreFocusOrders.History) {
      return availableInHistory;
    }
    const availableDefault = this._tabster.focusable.findDefault({
      container: element
    });
    if (availableDefault && restoreFocusOrder === RestoreFocusOrders.DeloserDefault) {
      return availableDefault;
    }
    const availableFirst = this._findFirst(element);
    if (availableFirst && restoreFocusOrder === RestoreFocusOrders.DeloserFirst) {
      return availableFirst;
    }
    return availableDefault || availableInHistory || availableFirst || null;
  }
  customFocusLostHandler(element) {
    return element.dispatchEvent(new DeloserFocusLostEvent(this.getActions()));
  }
  _findInHistory() {
    const cur = this._history[this._snapshotIndex].slice(0);
    this.clearHistory(true);
    for (let i = 0; i < cur.length; i++) {
      const we = cur[i];
      const e = we.get();
      const element = this._element.get();
      if (e && element && dom.nodeContains(element, e)) {
        if (this._tabster.focusable.isFocusable(e)) {
          return e;
        }
      } else if (!this._props.noSelectorCheck) {
        const selector = we.getData();
        if (selector && element) {
          let els;
          try {
            els = dom.querySelectorAll(element.ownerDocument, selector);
          } catch (e2) {
            continue;
          }
          for (let i2 = 0; i2 < els.length; i2++) {
            const el = els[i2];
            if (el && this._tabster.focusable.isFocusable(el)) {
              return el;
            }
          }
        }
      }
    }
    return null;
  }
  _findFirst(element) {
    if (this._tabster.keyboardNavigation.isNavigatingWithKeyboard()) {
      const first = this._tabster.focusable.findFirst({
        container: element,
        useActiveModalizer: true
      });
      if (first) {
        return first;
      }
    }
    return null;
  }
  _remove() {
  }
}
class DeloserAPI {
  constructor(tabster, props) {
    this._inDeloser = false;
    this._isRestoringFocus = false;
    this._isPaused = false;
    this._onRestoreFocus = (event) => {
      var _a;
      const target = event.composedPath()[0];
      if (target) {
        const available = (_a = DeloserAPI.getDeloser(this._tabster, target)) === null || _a === void 0 ? void 0 : _a.findAvailable();
        if (available) {
          this._tabster.focusedElement.focus(available);
        }
        event.stopImmediatePropagation();
      }
    };
    this._onFocus = (e) => {
      if (this._restoreFocusTimer) {
        this._win().clearTimeout(this._restoreFocusTimer);
        this._restoreFocusTimer = void 0;
      }
      if (!e) {
        this._scheduleRestoreFocus();
        return;
      }
      const deloser = this._history.process(e);
      if (deloser) {
        this._activate(deloser);
      } else {
        this._deactivate();
      }
    };
    this._onDeloserDispose = (deloser) => {
      this._history.removeDeloser(deloser);
      if (deloser.isActive()) {
        this._scheduleRestoreFocus();
      }
    };
    this._tabster = tabster;
    this._win = tabster.getWindow;
    this._history = new DeloserHistory(tabster);
    tabster.queueInit(() => {
      this._tabster.focusedElement.subscribe(this._onFocus);
      const doc = this._win().document;
      doc.addEventListener(DeloserRestoreFocusEventName, this._onRestoreFocus);
      const activeElement = dom.getActiveElement(doc);
      if (activeElement && activeElement !== doc.body) {
        this._onFocus(activeElement);
      }
    });
    const autoDeloser = props === null || props === void 0 ? void 0 : props.autoDeloser;
    if (autoDeloser) {
      this._autoDeloser = autoDeloser;
    }
  }
  dispose() {
    const win = this._win();
    if (this._restoreFocusTimer) {
      win.clearTimeout(this._restoreFocusTimer);
      this._restoreFocusTimer = void 0;
    }
    if (this._autoDeloserInstance) {
      this._autoDeloserInstance.dispose();
      delete this._autoDeloserInstance;
      delete this._autoDeloser;
    }
    this._tabster.focusedElement.unsubscribe(this._onFocus);
    win.document.removeEventListener(DeloserRestoreFocusEventName, this._onRestoreFocus);
    this._history.dispose();
    delete this._curDeloser;
  }
  createDeloser(element, props) {
    var _a;
    const deloser = new Deloser(this._tabster, element, this._onDeloserDispose, props);
    if (dom.nodeContains(element, (_a = this._tabster.focusedElement.getFocusedElement()) !== null && _a !== void 0 ? _a : null)) {
      this._activate(deloser);
    }
    return deloser;
  }
  getActions(element) {
    for (let e = element; e; e = dom.getParentElement(e)) {
      const tabsterOnElement = getTabsterOnElement(this._tabster, e);
      if (tabsterOnElement && tabsterOnElement.deloser) {
        return tabsterOnElement.deloser.getActions();
      }
    }
    return void 0;
  }
  pause() {
    this._isPaused = true;
    if (this._restoreFocusTimer) {
      this._win().clearTimeout(this._restoreFocusTimer);
      this._restoreFocusTimer = void 0;
    }
  }
  resume(restore) {
    this._isPaused = false;
    if (restore) {
      this._scheduleRestoreFocus();
    }
  }
  /**
   * Activates and sets the current deloser
   */
  _activate(deloser) {
    const curDeloser = this._curDeloser;
    if (curDeloser !== deloser) {
      this._inDeloser = true;
      curDeloser === null || curDeloser === void 0 ? void 0 : curDeloser.setActive(false);
      deloser.setActive(true);
      this._curDeloser = deloser;
    }
  }
  /**
   * Called when focus should no longer be in a deloser
   */
  _deactivate() {
    var _a;
    this._inDeloser = false;
    (_a = this._curDeloser) === null || _a === void 0 ? void 0 : _a.setActive(false);
    this._curDeloser = void 0;
  }
  _scheduleRestoreFocus(force) {
    if (this._isPaused || this._isRestoringFocus) {
      return;
    }
    const restoreFocus = async () => {
      this._restoreFocusTimer = void 0;
      const lastFocused = this._tabster.focusedElement.getLastFocusedElement();
      if (!force && (this._isRestoringFocus || !this._inDeloser || lastFocused && !isDisplayNone(lastFocused))) {
        return;
      }
      const curDeloser = this._curDeloser;
      let isManual = false;
      if (curDeloser) {
        if (lastFocused && curDeloser.customFocusLostHandler(lastFocused)) {
          return;
        }
        if (curDeloser.strategy === DeloserStrategies.Manual) {
          isManual = true;
        } else {
          const curDeloserElement = curDeloser.getElement();
          const el = curDeloser.findAvailable();
          if (el && (!(curDeloserElement === null || curDeloserElement === void 0 ? void 0 : curDeloserElement.dispatchEvent(new TabsterMoveFocusEvent({
            by: "deloser",
            owner: curDeloserElement,
            next: el
          }))) || this._tabster.focusedElement.focus(el))) {
            return;
          }
        }
      }
      this._deactivate();
      if (isManual) {
        return;
      }
      this._isRestoringFocus = true;
      if (await this._history.focusAvailable(null) === false) {
        await this._history.resetFocus(null);
      }
      this._isRestoringFocus = false;
    };
    if (force) {
      restoreFocus();
    } else {
      this._restoreFocusTimer = this._win().setTimeout(restoreFocus, 100);
    }
  }
  static getDeloser(tabster, element) {
    var _a;
    let root;
    for (let e = element; e; e = dom.getParentElement(e)) {
      const tabsterOnElement = getTabsterOnElement(tabster, e);
      if (tabsterOnElement) {
        if (!root) {
          root = tabsterOnElement.root;
        }
        const deloser = tabsterOnElement.deloser;
        if (deloser) {
          return deloser;
        }
      }
    }
    const deloserAPI = tabster.deloser && tabster.deloser;
    if (deloserAPI) {
      if (deloserAPI._autoDeloserInstance) {
        return deloserAPI._autoDeloserInstance;
      }
      const autoDeloserProps = deloserAPI._autoDeloser;
      if (root && !deloserAPI._autoDeloserInstance && autoDeloserProps) {
        const body = (_a = element.ownerDocument) === null || _a === void 0 ? void 0 : _a.body;
        if (body) {
          deloserAPI._autoDeloserInstance = new Deloser(tabster, body, tabster.deloser._onDeloserDispose, autoDeloserProps);
        }
      }
      return deloserAPI._autoDeloserInstance;
    }
    return void 0;
  }
  static getHistory(instance) {
    return instance._history;
  }
  static forceRestoreFocus(instance) {
    instance._scheduleRestoreFocus(true);
  }
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class Subscribable {
  constructor() {
    this._callbacks = [];
  }
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
    this._callbacks.forEach((callback) => callback(val, detail));
  }
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class FocusableAPI {
  constructor(tabster) {
    this._tabster = tabster;
  }
  dispose() {
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
      return false;
    }
    return true;
  }
  isAccessible(el) {
    var _a;
    for (let e = el; e; e = dom.getParentElement(e)) {
      const tabsterOnElement = getTabsterOnElement(this._tabster, e);
      if (this._isHidden(e)) {
        return false;
      }
      const ignoreDisabled = (_a = tabsterOnElement === null || tabsterOnElement === void 0 ? void 0 : tabsterOnElement.focusable) === null || _a === void 0 ? void 0 : _a.ignoreAriaDisabled;
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
    var _a;
    const attrVal = el.getAttribute("aria-hidden");
    if (attrVal && attrVal.toLowerCase() === "true") {
      if (!((_a = this._tabster.modalizer) === null || _a === void 0 ? void 0 : _a.isAugmented(el))) {
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
      acceptCondition: (el) => this.isFocusable(el, options.includeProgrammaticallyFocusable) && !!this.getProps(el).isDefault
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
    var _a, _b, _c;
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
      acceptCondition = (el) => this.isFocusable(el, includeProgrammaticallyFocusable, false, ignoreAccessibility);
    }
    const acceptElementState = {
      container,
      modalizerUserId: modalizerId === void 0 && useActiveModalizer ? (_a = this._tabster.modalizer) === null || _a === void 0 ? void 0 : _a.activeId : modalizerId || ((_c = (_b = RootAPI.getTabsterContext(this._tabster, container)) === null || _b === void 0 ? void 0 : _b.modalizer) === null || _c === void 0 ? void 0 : _c.userId),
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
    const walker = createElementTreeWalker(container.ownerDocument, container, (node) => this._acceptElement(node, acceptElementState));
    if (!walker) {
      return null;
    }
    const prepareForNextElement = (shouldContinueIfNotFound) => {
      var _a2, _b2;
      const foundElement = (_a2 = acceptElementState.foundElement) !== null && _a2 !== void 0 ? _a2 : acceptElementState.foundBackward;
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
          out.uncontrolled = (_b2 = RootAPI.getTabsterContext(this._tabster, foundElement)) === null || _b2 === void 0 ? void 0 : _b2.uncontrolled;
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
      const lastChild = getLastChild$2(container);
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
    var _a, _b, _c;
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
    if (!ctx) {
      return NodeFilter.FILTER_SKIP;
    }
    if (shouldIgnoreFocus(element)) {
      if (this.isFocusable(element, void 0, true, true)) {
        state.skippedFocusable = true;
      }
      return NodeFilter.FILTER_SKIP;
    }
    if (!state.hasCustomCondition && (element.tagName === "IFRAME" || element.tagName === "WEBVIEW")) {
      if (this.isVisible(element) && ((_a = ctx.modalizer) === null || _a === void 0 ? void 0 : _a.userId) === ((_b = this._tabster.modalizer) === null || _b === void 0 ? void 0 : _b.activeId)) {
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
    const fromMover = fromCtx === null || fromCtx === void 0 ? void 0 : fromCtx.mover;
    let groupper = ctx.groupper;
    let mover = ctx.mover;
    result = (_c = this._tabster.modalizer) === null || _c === void 0 ? void 0 : _c.acceptElement(element, state);
    if (result !== void 0) {
      state.skippedFocusable = true;
    }
    if (result === void 0 && (groupper || mover || fromMover)) {
      const groupperElement = groupper === null || groupper === void 0 ? void 0 : groupper.getElement();
      const fromMoverElement = fromMover === null || fromMover === void 0 ? void 0 : fromMover.getElement();
      let moverElement = mover === null || mover === void 0 ? void 0 : mover.getElement();
      if (moverElement && dom.nodeContains(fromMoverElement, moverElement) && dom.nodeContains(container, fromMoverElement) && (!groupperElement || !mover || dom.nodeContains(fromMoverElement, groupperElement))) {
        mover = fromMover;
        moverElement = fromMoverElement;
      }
      if (groupperElement) {
        if (groupperElement === container || !dom.nodeContains(container, groupperElement)) {
          groupper = void 0;
        } else if (!dom.nodeContains(groupperElement, element)) {
          return NodeFilter.FILTER_REJECT;
        }
      }
      if (moverElement) {
        if (!dom.nodeContains(container, moverElement)) {
          mover = void 0;
        } else if (!dom.nodeContains(moverElement, element)) {
          return NodeFilter.FILTER_REJECT;
        }
      }
      if (groupper && mover) {
        if (moverElement && groupperElement && !dom.nodeContains(groupperElement, moverElement)) {
          mover = void 0;
        } else {
          groupper = void 0;
        }
      }
      if (groupper) {
        result = groupper.acceptElement(element, state);
      }
      if (mover) {
        result = mover.acceptElement(element, state);
      }
    }
    if (result === void 0) {
      result = state.acceptCondition(element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      if (result === NodeFilter.FILTER_SKIP && this.isFocusable(element, false, true, true)) {
        state.skippedFocusable = true;
      }
    }
    if (result === NodeFilter.FILTER_ACCEPT && !state.found) {
      if (!state.isFindAll && isRadio(element) && !element.checked) {
        const radioGroupName = element.name;
        let radioGroup = state.cachedRadioGroups[radioGroupName];
        if (!radioGroup) {
          radioGroup = getRadioButtonGroup(element);
          if (radioGroup) {
            state.cachedRadioGroups[radioGroupName] = radioGroup;
          }
        }
        if ((radioGroup === null || radioGroup === void 0 ? void 0 : radioGroup.checked) && radioGroup.checked !== element) {
          return NodeFilter.FILTER_SKIP;
        }
      }
      if (state.isBackward) {
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
function getUncontrolledCompletelyContainer(tabster, element) {
  var _a;
  const getParent = tabster.getParent;
  let el = element;
  do {
    const uncontrolledOnElement = (_a = getTabsterOnElement(tabster, el)) === null || _a === void 0 ? void 0 : _a.uncontrolled;
    if (uncontrolledOnElement && tabster.uncontrolled.isUncontrolledCompletely(el, !!uncontrolledOnElement.completely)) {
      return el;
    }
    el = getParent(el);
  } while (el);
  return void 0;
}
const AsyncFocusIntentPriorityBySource = {
  [AsyncFocusSources.Restorer]: 0,
  [AsyncFocusSources.Deloser]: 1,
  [AsyncFocusSources.EscapeGroupper]: 2
};
class FocusedElementState extends Subscribable {
  constructor(tabster, getWindow) {
    super();
    this._init = () => {
      const win = this._win();
      const doc = win.document;
      doc.addEventListener(KEYBORG_FOCUSIN, this._onFocusIn, true);
      doc.addEventListener(KEYBORG_FOCUSOUT, this._onFocusOut, true);
      win.addEventListener("keydown", this._onKeyDown, true);
      const activeElement = dom.getActiveElement(doc);
      if (activeElement && activeElement !== doc.body) {
        this._setFocusedElement(activeElement);
      }
      this.subscribe(this._onChanged);
    };
    this._onFocusIn = (e) => {
      const target = e.composedPath()[0];
      if (target) {
        this._setFocusedElement(target, e.detail.relatedTarget, e.detail.isFocusedProgrammatically);
      }
    };
    this._onFocusOut = (e) => {
      var _a;
      this._setFocusedElement(void 0, (_a = e.detail) === null || _a === void 0 ? void 0 : _a.originalEvent.relatedTarget);
    };
    this._validateFocusedElement = (element) => {
    };
    this._onKeyDown = (event) => {
      if (event.key !== Keys.Tab || event.ctrlKey) {
        return;
      }
      const currentElement = this.getVal();
      if (!currentElement || !currentElement.ownerDocument || currentElement.contentEditable === "true") {
        return;
      }
      const tabster2 = this._tabster;
      const controlTab = tabster2.controlTab;
      const ctx = RootAPI.getTabsterContext(tabster2, currentElement);
      if (!ctx || ctx.ignoreKeydown(event)) {
        return;
      }
      const isBackward = event.shiftKey;
      const next = FocusedElementState.findNextTabbable(tabster2, ctx, void 0, currentElement, void 0, isBackward, true);
      const rootElement = ctx.root.getElement();
      if (!rootElement) {
        return;
      }
      const nextElement = next === null || next === void 0 ? void 0 : next.element;
      const uncontrolledCompletelyContainer = getUncontrolledCompletelyContainer(tabster2, currentElement);
      if (nextElement) {
        const nextUncontrolled = next.uncontrolled;
        if (ctx.uncontrolled || dom.nodeContains(nextUncontrolled, currentElement)) {
          if (!next.outOfDOMOrder && nextUncontrolled === ctx.uncontrolled || uncontrolledCompletelyContainer && !dom.nodeContains(uncontrolledCompletelyContainer, nextElement)) {
            return;
          }
          DummyInputManager.addPhantomDummyWithTarget(tabster2, currentElement, isBackward, nextElement);
          return;
        }
        if (nextUncontrolled && tabster2.focusable.isVisible(nextUncontrolled) || nextElement.tagName === "IFRAME" && tabster2.focusable.isVisible(nextElement)) {
          if (rootElement.dispatchEvent(new TabsterMoveFocusEvent({
            by: "root",
            owner: rootElement,
            next: nextElement,
            relatedEvent: event
          }))) {
            DummyInputManager.moveWithPhantomDummy(tabster2, nextUncontrolled !== null && nextUncontrolled !== void 0 ? nextUncontrolled : nextElement, false, isBackward, event);
          }
          return;
        }
        if (controlTab || (next === null || next === void 0 ? void 0 : next.outOfDOMOrder)) {
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
    this._onChanged = (element, detail) => {
      var _a, _b;
      if (element) {
        element.dispatchEvent(new TabsterFocusInEvent(detail));
      } else {
        const last = (_a = this._lastVal) === null || _a === void 0 ? void 0 : _a.get();
        if (last) {
          const d = {
            ...detail
          };
          const lastCtx = RootAPI.getTabsterContext(this._tabster, last);
          const modalizerId = (_b = lastCtx === null || lastCtx === void 0 ? void 0 : lastCtx.modalizer) === null || _b === void 0 ? void 0 : _b.userId;
          if (modalizerId) {
            d.modalizerId = modalizerId;
          }
          last.dispatchEvent(new TabsterFocusOutEvent(d));
        }
      }
    };
    this._tabster = tabster;
    this._win = getWindow;
    tabster.queueInit(this._init);
  }
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
    var _a, _b;
    let wel = FocusedElementState._lastResetElement;
    let el = wel && wel.get();
    if (el && dom.nodeContains(parent, el)) {
      delete FocusedElementState._lastResetElement;
    }
    el = (_b = (_a = instance._nextVal) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.get();
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
    var _a;
    let el = (_a = this._lastVal) === null || _a === void 0 ? void 0 : _a.get();
    if (!el || el && !documentContains(el.ownerDocument, el)) {
      this._lastVal = el = void 0;
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
    var _a;
    const {
      container,
      ignoreAccessibility
    } = props;
    let toFocus;
    if (container) {
      const ctx = RootAPI.getTabsterContext(this._tabster, container);
      if (ctx) {
        toFocus = (_a = FocusedElementState.findNextTabbable(this._tabster, ctx, container, void 0, void 0, !isFirst, ignoreAccessibility)) === null || _a === void 0 ? void 0 : _a.element;
      }
    }
    if (toFocus && !dom.nodeContains(container, toFocus)) {
      toFocus = void 0;
    }
    return toFocus || void 0;
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
      FocusedElementState._lastResetElement = new WeakHTMLElement(this._win, container);
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
        return;
      }
      win.clearTimeout(currentAsyncFocus.timeout);
    }
    this._asyncFocus = {
      source,
      callback,
      timeout: win.setTimeout(() => {
        this._asyncFocus = void 0;
        callback();
      }, delay)
    };
  }
  cancelAsyncFocus(source) {
    const asyncFocus = this._asyncFocus;
    if ((asyncFocus === null || asyncFocus === void 0 ? void 0 : asyncFocus.source) === source) {
      this._tabster.getWindow().clearTimeout(asyncFocus.timeout);
      this._asyncFocus = void 0;
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
    var _a, _b;
    if (this._tabster._noop) {
      return;
    }
    const detail = {
      relatedTarget
    };
    if (element) {
      const lastResetElement = (_a = FocusedElementState._lastResetElement) === null || _a === void 0 ? void 0 : _a.get();
      FocusedElementState._lastResetElement = void 0;
      if (lastResetElement === element || shouldIgnoreFocus(element)) {
        return;
      }
      detail.isFocusedProgrammatically = isFocusedProgrammatically;
      const ctx = RootAPI.getTabsterContext(this._tabster, element);
      const modalizerId = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.modalizer) === null || _b === void 0 ? void 0 : _b.userId;
      if (modalizerId) {
        detail.modalizerId = modalizerId;
      }
    }
    const nextVal = this._nextVal = {
      element: element ? new WeakHTMLElement(this._win, element) : void 0,
      detail
    };
    if (element && element !== this._val) {
      this._validateFocusedElement(element);
    }
    if (this._nextVal === nextVal) {
      this.setVal(element, detail);
    }
    this._nextVal = void 0;
  }
  setVal(val, detail) {
    super.setVal(val, detail);
    if (val) {
      this._lastVal = new WeakHTMLElement(this._win, val);
    }
  }
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
    const callFindNext = (what) => {
      next = what.findNextTabbable(currentElement, referenceElement, isBackward, ignoreAccessibility);
      if (currentElement && !(next === null || next === void 0 ? void 0 : next.element)) {
        const parentElement = what !== modalizer && dom.getParentElement(what.getElement());
        if (parentElement) {
          const parentCtx = RootAPI.getTabsterContext(tabster, currentElement, {
            referenceElement: parentElement
          });
          if (parentCtx) {
            const currentScopeElement = what.getElement();
            const newCurrent = isBackward ? currentScopeElement : currentScopeElement && getLastChild$2(currentScopeElement) || currentScopeElement;
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
}
FocusedElementState.isTabbing = false;
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class KeyboardNavigationState extends Subscribable {
  constructor(getWindow) {
    super();
    this._onChange = (isNavigatingWithKeyboard) => {
      this.setVal(isNavigatingWithKeyboard, void 0);
    };
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
  setNavigatingWithKeyboard(isNavigatingWithKeyboard) {
    var _a;
    (_a = this._keyborg) === null || _a === void 0 ? void 0 : _a.setVal(isNavigatingWithKeyboard);
  }
  isNavigatingWithKeyboard() {
    var _a;
    return !!((_a = this._keyborg) === null || _a === void 0 ? void 0 : _a.isNavigatingWithKeyboard());
  }
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const _inputSelector = /* @__PURE__ */ ["input", "textarea", "*[contenteditable]"].join(", ");
class MoverDummyManager extends DummyInputManager {
  constructor(element, tabster, getMemorized, sys) {
    super(tabster, element, DummyInputManagerPriorities.Mover, sys);
    this._onFocusDummyInput = (dummyInput) => {
      var _a, _b;
      const container = this._element.get();
      const input = dummyInput.input;
      if (container && input) {
        const ctx = RootAPI.getTabsterContext(this._tabster, container);
        let toFocus;
        if (ctx) {
          toFocus = (_a = FocusedElementState.findNextTabbable(this._tabster, ctx, void 0, input, void 0, !dummyInput.isFirst, true)) === null || _a === void 0 ? void 0 : _a.element;
        }
        const memorized = (_b = this._getMemorized()) === null || _b === void 0 ? void 0 : _b.get();
        if (memorized && this._tabster.focusable.isFocusable(memorized)) {
          toFocus = memorized;
        }
        if (toFocus) {
          nativeFocus(toFocus);
        }
      }
    };
    this._tabster = tabster;
    this._getMemorized = getMemorized;
    this._setHandlers(this._onFocusDummyInput);
  }
}
const _moverUpdateAdd = 1;
const _moverUpdateAttr = 2;
const _moverUpdateRemove = 3;
class Mover extends TabsterPart {
  constructor(tabster, element, onDispose, props, sys) {
    var _a;
    super(tabster, element, props);
    this._visible = {};
    this._onIntersection = (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const id = getElementUId(this._win, el);
        let newVisibility;
        let fullyVisible = this._fullyVisible;
        if (entry.intersectionRatio >= 0.25) {
          newVisibility = entry.intersectionRatio >= 0.75 ? Visibilities.Visible : Visibilities.PartiallyVisible;
          if (newVisibility === Visibilities.Visible) {
            fullyVisible = id;
          }
        } else {
          newVisibility = Visibilities.Invisible;
        }
        if (this._visible[id] !== newVisibility) {
          if (newVisibility === void 0) {
            delete this._visible[id];
            if (fullyVisible === id) {
              delete this._fullyVisible;
            }
          } else {
            this._visible[id] = newVisibility;
            this._fullyVisible = fullyVisible;
          }
          const state = this.getState(el);
          if (state) {
            el.dispatchEvent(new MoverStateEvent(state));
          }
        }
      }
    };
    this._win = tabster.getWindow;
    this.visibilityTolerance = (_a = props.visibilityTolerance) !== null && _a !== void 0 ? _a : 0.8;
    if (this._props.trackState || this._props.visibilityAware) {
      this._intersectionObserver = new IntersectionObserver(this._onIntersection, {
        threshold: [0, 0.25, 0.5, 0.75, 1]
      });
      this._observeState();
    }
    this._onDispose = onDispose;
    const getMemorized = () => props.memorizeCurrent ? this._current : void 0;
    if (!tabster.controlTab) {
      this.dummyManager = new MoverDummyManager(this._element, tabster, getMemorized, sys);
    }
  }
  dispose() {
    var _a;
    this._onDispose(this);
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      delete this._intersectionObserver;
    }
    delete this._current;
    delete this._fullyVisible;
    delete this._allElements;
    delete this._updateQueue;
    if (this._unobserve) {
      this._unobserve();
      delete this._unobserve;
    }
    const win = this._win();
    if (this._setCurrentTimer) {
      win.clearTimeout(this._setCurrentTimer);
      delete this._setCurrentTimer;
    }
    if (this._updateTimer) {
      win.clearTimeout(this._updateTimer);
      delete this._updateTimer;
    }
    (_a = this.dummyManager) === null || _a === void 0 ? void 0 : _a.dispose();
    delete this.dummyManager;
  }
  setCurrent(element) {
    if (element) {
      this._current = new WeakHTMLElement(this._win, element);
    } else {
      this._current = void 0;
    }
    if ((this._props.trackState || this._props.visibilityAware) && !this._setCurrentTimer) {
      this._setCurrentTimer = this._win().setTimeout(() => {
        var _a;
        delete this._setCurrentTimer;
        const changed = [];
        if (this._current !== this._prevCurrent) {
          changed.push(this._current);
          changed.push(this._prevCurrent);
          this._prevCurrent = this._current;
        }
        for (const weak of changed) {
          const el = weak === null || weak === void 0 ? void 0 : weak.get();
          if (el && ((_a = this._allElements) === null || _a === void 0 ? void 0 : _a.get(el)) === this) {
            const props = this._props;
            if (el && (props.visibilityAware !== void 0 || props.trackState)) {
              const state = this.getState(el);
              if (state) {
                el.dispatchEvent(new MoverStateEvent(state));
              }
            }
          }
        }
      });
    }
  }
  getCurrent() {
    var _a;
    return ((_a = this._current) === null || _a === void 0 ? void 0 : _a.get()) || null;
  }
  findNextTabbable(currentElement, referenceElement, isBackward, ignoreAccessibility) {
    const container = this.getElement();
    const currentIsDummy = container && getDummyInputContainer(currentElement) === container;
    if (!container) {
      return null;
    }
    let next = null;
    let outOfDOMOrder = false;
    let uncontrolled;
    if (this._props.tabbable || currentIsDummy || currentElement && !dom.nodeContains(container, currentElement)) {
      const findProps = {
        currentElement,
        referenceElement,
        container,
        ignoreAccessibility,
        useActiveModalizer: true
      };
      const findPropsOut = {};
      next = this._tabster.focusable[isBackward ? "findPrev" : "findNext"](findProps, findPropsOut);
      outOfDOMOrder = !!findPropsOut.outOfDOMOrder;
      uncontrolled = findPropsOut.uncontrolled;
    }
    return {
      element: next,
      uncontrolled,
      outOfDOMOrder
    };
  }
  acceptElement(element, state) {
    var _a, _b;
    if (!FocusedElementState.isTabbing) {
      return ((_a = state.currentCtx) === null || _a === void 0 ? void 0 : _a.excludedFromMover) ? NodeFilter.FILTER_REJECT : void 0;
    }
    const {
      memorizeCurrent,
      visibilityAware,
      hasDefault = true
    } = this._props;
    const moverElement = this.getElement();
    if (moverElement && (memorizeCurrent || visibilityAware || hasDefault) && (!dom.nodeContains(moverElement, state.from) || getDummyInputContainer(state.from) === moverElement)) {
      let found;
      if (memorizeCurrent) {
        const current = (_b = this._current) === null || _b === void 0 ? void 0 : _b.get();
        if (current && state.acceptCondition(current)) {
          found = current;
        }
      }
      if (!found && hasDefault) {
        found = this._tabster.focusable.findDefault({
          container: moverElement,
          useActiveModalizer: true
        });
      }
      if (!found && visibilityAware) {
        found = this._tabster.focusable.findElement({
          container: moverElement,
          useActiveModalizer: true,
          isBackward: state.isBackward,
          acceptCondition: (el) => {
            var _a2;
            const id = getElementUId(this._win, el);
            const visibility = this._visible[id];
            return moverElement !== el && !!((_a2 = this._allElements) === null || _a2 === void 0 ? void 0 : _a2.get(el)) && state.acceptCondition(el) && (visibility === Visibilities.Visible || visibility === Visibilities.PartiallyVisible && (visibilityAware === Visibilities.PartiallyVisible || !this._fullyVisible));
          }
        });
      }
      if (found) {
        state.found = true;
        state.foundElement = found;
        state.rejectElementsFrom = moverElement;
        state.skippedFocusable = true;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
    return void 0;
  }
  _observeState() {
    const element = this.getElement();
    if (this._unobserve || !element || typeof MutationObserver === "undefined") {
      return;
    }
    const win = this._win();
    const allElements = this._allElements = /* @__PURE__ */ new WeakMap();
    const tabsterFocusable = this._tabster.focusable;
    let updateQueue = this._updateQueue = [];
    const observer = dom.createMutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target;
        const removed = mutation.removedNodes;
        const added = mutation.addedNodes;
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "tabindex") {
            updateQueue.push({
              element: target,
              type: _moverUpdateAttr
            });
          }
        } else {
          for (let i = 0; i < removed.length; i++) {
            updateQueue.push({
              element: removed[i],
              type: _moverUpdateRemove
            });
          }
          for (let i = 0; i < added.length; i++) {
            updateQueue.push({
              element: added[i],
              type: _moverUpdateAdd
            });
          }
        }
      }
      requestUpdate();
    });
    const setElement = (element2, remove) => {
      var _a, _b;
      const current = allElements.get(element2);
      if (current && remove) {
        (_a = this._intersectionObserver) === null || _a === void 0 ? void 0 : _a.unobserve(element2);
        allElements.delete(element2);
      }
      if (!current && !remove) {
        allElements.set(element2, this);
        (_b = this._intersectionObserver) === null || _b === void 0 ? void 0 : _b.observe(element2);
      }
    };
    const updateElement = (element2) => {
      const isFocusable = tabsterFocusable.isFocusable(element2);
      const current = allElements.get(element2);
      if (current) {
        if (!isFocusable) {
          setElement(element2, true);
        }
      } else {
        if (isFocusable) {
          setElement(element2);
        }
      }
    };
    const addNewElements = (element2) => {
      const {
        mover
      } = getMoverGroupper(element2);
      if (mover && mover !== this) {
        if (mover.getElement() === element2 && tabsterFocusable.isFocusable(element2)) {
          setElement(element2);
        } else {
          return;
        }
      }
      const walker = createElementTreeWalker(win.document, element2, (node) => {
        const {
          mover: mover2,
          groupper
        } = getMoverGroupper(node);
        if (mover2 && mover2 !== this) {
          return NodeFilter.FILTER_REJECT;
        }
        const groupperFirstFocusable = groupper === null || groupper === void 0 ? void 0 : groupper.getFirst(true);
        if (groupper && groupper.getElement() !== node && groupperFirstFocusable && groupperFirstFocusable !== node) {
          return NodeFilter.FILTER_REJECT;
        }
        if (tabsterFocusable.isFocusable(node)) {
          setElement(node);
        }
        return NodeFilter.FILTER_SKIP;
      });
      if (walker) {
        walker.currentNode = element2;
        while (walker.nextNode()) {
        }
      }
    };
    const removeWalk = (element2) => {
      const current = allElements.get(element2);
      if (current) {
        setElement(element2, true);
      }
      for (let el = dom.getFirstElementChild(element2); el; el = dom.getNextElementSibling(el)) {
        removeWalk(el);
      }
    };
    const requestUpdate = () => {
      if (!this._updateTimer && updateQueue.length) {
        this._updateTimer = win.setTimeout(() => {
          delete this._updateTimer;
          for (const {
            element: element2,
            type
          } of updateQueue) {
            switch (type) {
              case _moverUpdateAttr:
                updateElement(element2);
                break;
              case _moverUpdateAdd:
                addNewElements(element2);
                break;
              case _moverUpdateRemove:
                removeWalk(element2);
                break;
            }
          }
          updateQueue = this._updateQueue = [];
        }, 0);
      }
    };
    const getMoverGroupper = (element2) => {
      const ret = {};
      for (let el = element2; el; el = dom.getParentElement(el)) {
        const toe = getTabsterOnElement(this._tabster, el);
        if (toe) {
          if (toe.groupper && !ret.groupper) {
            ret.groupper = toe.groupper;
          }
          if (toe.mover) {
            ret.mover = toe.mover;
            break;
          }
        }
      }
      return ret;
    };
    updateQueue.push({
      element,
      type: _moverUpdateAdd
    });
    requestUpdate();
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["tabindex"]
    });
    this._unobserve = () => {
      observer.disconnect();
    };
  }
  getState(element) {
    const id = getElementUId(this._win, element);
    if (id in this._visible) {
      const visibility = this._visible[id] || Visibilities.Invisible;
      const isCurrent = this._current ? this._current.get() === element : void 0;
      return {
        isCurrent,
        visibility
      };
    }
    return void 0;
  }
}
function getDistance(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  const xDistance = ax2 < bx1 ? bx1 - ax2 : bx2 < ax1 ? ax1 - bx2 : 0;
  const yDistance = ay2 < by1 ? by1 - ay2 : by2 < ay1 ? ay1 - by2 : 0;
  return xDistance === 0 ? yDistance : yDistance === 0 ? xDistance : Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}
class MoverAPI {
  constructor(tabster, getWindow) {
    this._init = () => {
      const win = this._win();
      win.addEventListener("keydown", this._onKeyDown, true);
      win.addEventListener(MoverMoveFocusEventName, this._onMoveFocus);
      win.addEventListener(MoverMemorizedElementEventName, this._onMemorizedElement);
      this._tabster.focusedElement.subscribe(this._onFocus);
    };
    this._onMoverDispose = (mover) => {
      delete this._movers[mover.id];
    };
    this._onFocus = (element) => {
      var _a;
      let currentFocusableElement = element;
      let deepestFocusableElement = element;
      for (let el = dom.getParentElement(element); el; el = dom.getParentElement(el)) {
        const mover = (_a = getTabsterOnElement(this._tabster, el)) === null || _a === void 0 ? void 0 : _a.mover;
        if (mover) {
          mover.setCurrent(deepestFocusableElement);
          currentFocusableElement = void 0;
        }
        if (!currentFocusableElement && this._tabster.focusable.isFocusable(el)) {
          currentFocusableElement = deepestFocusableElement = el;
        }
      }
    };
    this._onKeyDown = async (event) => {
      var _a;
      if (this._ignoredInputTimer) {
        this._win().clearTimeout(this._ignoredInputTimer);
        delete this._ignoredInputTimer;
      }
      (_a = this._ignoredInputResolve) === null || _a === void 0 ? void 0 : _a.call(this, false);
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
        return;
      }
      const key = event.key;
      let moverKey;
      if (key === Keys.ArrowDown) {
        moverKey = MoverKeys.ArrowDown;
      } else if (key === Keys.ArrowRight) {
        moverKey = MoverKeys.ArrowRight;
      } else if (key === Keys.ArrowUp) {
        moverKey = MoverKeys.ArrowUp;
      } else if (key === Keys.ArrowLeft) {
        moverKey = MoverKeys.ArrowLeft;
      } else if (key === Keys.PageDown) {
        moverKey = MoverKeys.PageDown;
      } else if (key === Keys.PageUp) {
        moverKey = MoverKeys.PageUp;
      } else if (key === Keys.Home) {
        moverKey = MoverKeys.Home;
      } else if (key === Keys.End) {
        moverKey = MoverKeys.End;
      }
      if (!moverKey) {
        return;
      }
      const focused = this._tabster.focusedElement.getFocusedElement();
      if (!focused || await this._isIgnoredInput(focused, key)) {
        return;
      }
      this._moveFocus(focused, moverKey, event);
    };
    this._onMoveFocus = (e) => {
      var _a;
      const element = e.composedPath()[0];
      const key = (_a = e.detail) === null || _a === void 0 ? void 0 : _a.key;
      if (element && key !== void 0 && !e.defaultPrevented) {
        this._moveFocus(element, key);
        e.stopImmediatePropagation();
      }
    };
    this._onMemorizedElement = (e) => {
      var _a;
      const target = e.composedPath()[0];
      let memorizedElement = (_a = e.detail) === null || _a === void 0 ? void 0 : _a.memorizedElement;
      if (target) {
        const ctx = RootAPI.getTabsterContext(this._tabster, target);
        const mover = ctx === null || ctx === void 0 ? void 0 : ctx.mover;
        if (mover) {
          if (memorizedElement && !dom.nodeContains(mover.getElement(), memorizedElement)) {
            memorizedElement = void 0;
          }
          mover.setCurrent(memorizedElement);
          e.stopImmediatePropagation();
        }
      }
    };
    this._tabster = tabster;
    this._win = getWindow;
    this._movers = {};
    tabster.queueInit(this._init);
  }
  dispose() {
    var _a;
    const win = this._win();
    this._tabster.focusedElement.unsubscribe(this._onFocus);
    (_a = this._ignoredInputResolve) === null || _a === void 0 ? void 0 : _a.call(this, false);
    if (this._ignoredInputTimer) {
      win.clearTimeout(this._ignoredInputTimer);
      delete this._ignoredInputTimer;
    }
    win.removeEventListener("keydown", this._onKeyDown, true);
    win.removeEventListener(MoverMoveFocusEventName, this._onMoveFocus);
    win.removeEventListener(MoverMemorizedElementEventName, this._onMemorizedElement);
    Object.keys(this._movers).forEach((moverId) => {
      if (this._movers[moverId]) {
        this._movers[moverId].dispose();
        delete this._movers[moverId];
      }
    });
  }
  createMover(element, props, sys) {
    const newMover = new Mover(this._tabster, element, this._onMoverDispose, props, sys);
    this._movers[newMover.id] = newMover;
    return newMover;
  }
  moveFocus(fromElement, key) {
    return this._moveFocus(fromElement, key);
  }
  _moveFocus(fromElement, key, relatedEvent) {
    var _a, _b;
    const tabster = this._tabster;
    const ctx = RootAPI.getTabsterContext(tabster, fromElement, {
      checkRtl: true
    });
    if (!ctx || !ctx.mover || ctx.excludedFromMover || relatedEvent && ctx.ignoreKeydown(relatedEvent)) {
      return null;
    }
    const mover = ctx.mover;
    const container = mover.getElement();
    if (ctx.groupperBeforeMover) {
      const groupper = ctx.groupper;
      if (groupper && !groupper.isActive(true)) {
        for (let el = dom.getParentElement(groupper.getElement()); el && el !== container; el = dom.getParentElement(el)) {
          if ((_b = (_a = getTabsterOnElement(tabster, el)) === null || _a === void 0 ? void 0 : _a.groupper) === null || _b === void 0 ? void 0 : _b.isActive(true)) {
            return null;
          }
        }
      } else {
        return null;
      }
    }
    if (!container) {
      return null;
    }
    const focusable = tabster.focusable;
    const moverProps = mover.getProps();
    const direction = moverProps.direction || MoverDirections.Both;
    const isBoth = direction === MoverDirections.Both;
    const isVertical = isBoth || direction === MoverDirections.Vertical;
    const isHorizontal = isBoth || direction === MoverDirections.Horizontal;
    const isGridLinear = direction === MoverDirections.GridLinear;
    const isGrid = isGridLinear || direction === MoverDirections.Grid;
    const isCyclic = moverProps.cyclic;
    let next;
    let scrollIntoViewArg;
    let focusedElementRect;
    let focusedElementX1 = 0;
    let focusedElementX2 = 0;
    if (isGrid) {
      focusedElementRect = fromElement.getBoundingClientRect();
      focusedElementX1 = Math.ceil(focusedElementRect.left);
      focusedElementX2 = Math.floor(focusedElementRect.right);
    }
    if (ctx.rtl) {
      if (key === MoverKeys.ArrowRight) {
        key = MoverKeys.ArrowLeft;
      } else if (key === MoverKeys.ArrowLeft) {
        key = MoverKeys.ArrowRight;
      }
    }
    if (key === MoverKeys.ArrowDown && isVertical || key === MoverKeys.ArrowRight && (isHorizontal || isGrid)) {
      next = focusable.findNext({
        currentElement: fromElement,
        container,
        useActiveModalizer: true
      });
      if (next && isGrid) {
        const nextElementX1 = Math.ceil(next.getBoundingClientRect().left);
        if (!isGridLinear && focusedElementX2 > nextElementX1) {
          next = void 0;
        }
      } else if (!next && isCyclic) {
        next = focusable.findFirst({
          container,
          useActiveModalizer: true
        });
      }
    } else if (key === MoverKeys.ArrowUp && isVertical || key === MoverKeys.ArrowLeft && (isHorizontal || isGrid)) {
      next = focusable.findPrev({
        currentElement: fromElement,
        container,
        useActiveModalizer: true
      });
      if (next && isGrid) {
        const nextElementX2 = Math.floor(next.getBoundingClientRect().right);
        if (!isGridLinear && nextElementX2 > focusedElementX1) {
          next = void 0;
        }
      } else if (!next && isCyclic) {
        next = focusable.findLast({
          container,
          useActiveModalizer: true
        });
      }
    } else if (key === MoverKeys.Home) {
      if (isGrid) {
        focusable.findElement({
          container,
          currentElement: fromElement,
          useActiveModalizer: true,
          isBackward: true,
          acceptCondition: (el) => {
            var _a2;
            if (!focusable.isFocusable(el)) {
              return false;
            }
            const nextElementX1 = Math.ceil((_a2 = el.getBoundingClientRect().left) !== null && _a2 !== void 0 ? _a2 : 0);
            if (el !== fromElement && focusedElementX1 <= nextElementX1) {
              return true;
            }
            next = el;
            return false;
          }
        });
      } else {
        next = focusable.findFirst({
          container,
          useActiveModalizer: true
        });
      }
    } else if (key === MoverKeys.End) {
      if (isGrid) {
        focusable.findElement({
          container,
          currentElement: fromElement,
          useActiveModalizer: true,
          acceptCondition: (el) => {
            var _a2;
            if (!focusable.isFocusable(el)) {
              return false;
            }
            const nextElementX1 = Math.ceil((_a2 = el.getBoundingClientRect().left) !== null && _a2 !== void 0 ? _a2 : 0);
            if (el !== fromElement && focusedElementX1 >= nextElementX1) {
              return true;
            }
            next = el;
            return false;
          }
        });
      } else {
        next = focusable.findLast({
          container,
          useActiveModalizer: true
        });
      }
    } else if (key === MoverKeys.PageUp) {
      focusable.findElement({
        currentElement: fromElement,
        container,
        useActiveModalizer: true,
        isBackward: true,
        acceptCondition: (el) => {
          if (!focusable.isFocusable(el)) {
            return false;
          }
          if (isElementVerticallyVisibleInContainer(this._win, el, mover.visibilityTolerance)) {
            next = el;
            return false;
          }
          return true;
        }
      });
      if (isGrid && next) {
        const firstColumnX1 = Math.ceil(next.getBoundingClientRect().left);
        focusable.findElement({
          currentElement: next,
          container,
          useActiveModalizer: true,
          acceptCondition: (el) => {
            if (!focusable.isFocusable(el)) {
              return false;
            }
            const nextElementX1 = Math.ceil(el.getBoundingClientRect().left);
            if (focusedElementX1 < nextElementX1 || firstColumnX1 >= nextElementX1) {
              return true;
            }
            next = el;
            return false;
          }
        });
      }
      scrollIntoViewArg = false;
    } else if (key === MoverKeys.PageDown) {
      focusable.findElement({
        currentElement: fromElement,
        container,
        useActiveModalizer: true,
        acceptCondition: (el) => {
          if (!focusable.isFocusable(el)) {
            return false;
          }
          if (isElementVerticallyVisibleInContainer(this._win, el, mover.visibilityTolerance)) {
            next = el;
            return false;
          }
          return true;
        }
      });
      if (isGrid && next) {
        const lastColumnX1 = Math.ceil(next.getBoundingClientRect().left);
        focusable.findElement({
          currentElement: next,
          container,
          useActiveModalizer: true,
          isBackward: true,
          acceptCondition: (el) => {
            if (!focusable.isFocusable(el)) {
              return false;
            }
            const nextElementX1 = Math.ceil(el.getBoundingClientRect().left);
            if (focusedElementX1 > nextElementX1 || lastColumnX1 <= nextElementX1) {
              return true;
            }
            next = el;
            return false;
          }
        });
      }
      scrollIntoViewArg = true;
    } else if (isGrid) {
      const isBackward = key === MoverKeys.ArrowUp;
      const ax1 = focusedElementX1;
      const ay1 = Math.ceil(focusedElementRect.top);
      const ax2 = focusedElementX2;
      const ay2 = Math.floor(focusedElementRect.bottom);
      let targetElement;
      let lastDistance;
      let lastIntersection = 0;
      focusable.findAll({
        container,
        currentElement: fromElement,
        isBackward,
        onElement: (el) => {
          const rect = el.getBoundingClientRect();
          const bx1 = Math.ceil(rect.left);
          const by1 = Math.ceil(rect.top);
          const bx2 = Math.floor(rect.right);
          const by2 = Math.floor(rect.bottom);
          if (isBackward && ay1 < by2 || !isBackward && ay2 > by1) {
            return true;
          }
          const xIntersectionWidth = Math.ceil(Math.min(ax2, bx2)) - Math.floor(Math.max(ax1, bx1));
          const minWidth = Math.ceil(Math.min(ax2 - ax1, bx2 - bx1));
          if (xIntersectionWidth > 0 && minWidth >= xIntersectionWidth) {
            const intersection = xIntersectionWidth / minWidth;
            if (intersection > lastIntersection) {
              targetElement = el;
              lastIntersection = intersection;
            }
          } else if (lastIntersection === 0) {
            const distance = getDistance(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);
            if (lastDistance === void 0 || distance < lastDistance) {
              lastDistance = distance;
              targetElement = el;
            }
          } else if (lastIntersection > 0) {
            return false;
          }
          return true;
        }
      });
      next = targetElement;
    }
    if (next && (!relatedEvent || relatedEvent && container.dispatchEvent(new TabsterMoveFocusEvent({
      by: "mover",
      owner: container,
      next,
      relatedEvent
    })))) {
      if (scrollIntoViewArg !== void 0) {
        scrollIntoView(this._win, next, scrollIntoViewArg);
      }
      if (relatedEvent) {
        relatedEvent.preventDefault();
        relatedEvent.stopImmediatePropagation();
      }
      nativeFocus(next);
      return next;
    }
    return null;
  }
  async _isIgnoredInput(element, key) {
    if (element.getAttribute("aria-expanded") === "true" && element.hasAttribute("aria-activedescendant")) {
      return true;
    }
    if (matchesSelector(element, _inputSelector)) {
      let selectionStart = 0;
      let selectionEnd = 0;
      let textLength = 0;
      let asyncRet;
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        const type = element.type;
        const value = element.value;
        textLength = (value || "").length;
        if (type === "email" || type === "number") {
          if (textLength) {
            const selection = dom.getSelection(element);
            if (selection) {
              const initialLength = selection.toString().length;
              const isBackward = key === Keys.ArrowLeft || key === Keys.ArrowUp;
              selection.modify("extend", isBackward ? "backward" : "forward", "character");
              if (initialLength !== selection.toString().length) {
                selection.modify("extend", isBackward ? "forward" : "backward", "character");
                return true;
              } else {
                textLength = 0;
              }
            }
          }
        } else {
          const selStart = element.selectionStart;
          if (selStart === null) {
            return type === "hidden";
          }
          selectionStart = selStart || 0;
          selectionEnd = element.selectionEnd || 0;
        }
      } else if (element.contentEditable === "true") {
        asyncRet = new (getPromise(this._win))((resolve) => {
          this._ignoredInputResolve = (value) => {
            delete this._ignoredInputResolve;
            resolve(value);
          };
          const win = this._win();
          if (this._ignoredInputTimer) {
            win.clearTimeout(this._ignoredInputTimer);
          }
          const {
            anchorNode: prevAnchorNode,
            focusNode: prevFocusNode,
            anchorOffset: prevAnchorOffset,
            focusOffset: prevFocusOffset
          } = dom.getSelection(element) || {};
          this._ignoredInputTimer = win.setTimeout(() => {
            var _a, _b, _c;
            delete this._ignoredInputTimer;
            const {
              anchorNode,
              focusNode,
              anchorOffset,
              focusOffset
            } = dom.getSelection(element) || {};
            if (anchorNode !== prevAnchorNode || focusNode !== prevFocusNode || anchorOffset !== prevAnchorOffset || focusOffset !== prevFocusOffset) {
              (_a = this._ignoredInputResolve) === null || _a === void 0 ? void 0 : _a.call(this, false);
              return;
            }
            selectionStart = anchorOffset || 0;
            selectionEnd = focusOffset || 0;
            textLength = ((_b = element.textContent) === null || _b === void 0 ? void 0 : _b.length) || 0;
            if (anchorNode && focusNode) {
              if (dom.nodeContains(element, anchorNode) && dom.nodeContains(element, focusNode)) {
                if (anchorNode !== element) {
                  let anchorFound = false;
                  const addOffsets = (node) => {
                    if (node === anchorNode) {
                      anchorFound = true;
                    } else if (node === focusNode) {
                      return true;
                    }
                    const nodeText = node.textContent;
                    if (nodeText && !dom.getFirstChild(node)) {
                      const len = nodeText.length;
                      if (anchorFound) {
                        if (focusNode !== anchorNode) {
                          selectionEnd += len;
                        }
                      } else {
                        selectionStart += len;
                        selectionEnd += len;
                      }
                    }
                    let stop = false;
                    for (let e = dom.getFirstChild(node); e && !stop; e = e.nextSibling) {
                      stop = addOffsets(e);
                    }
                    return stop;
                  };
                  addOffsets(element);
                }
              }
            }
            (_c = this._ignoredInputResolve) === null || _c === void 0 ? void 0 : _c.call(this, true);
          }, 0);
        });
      }
      if (asyncRet && !await asyncRet) {
        return true;
      }
      if (selectionStart !== selectionEnd) {
        return true;
      }
      if (selectionStart > 0 && (key === Keys.ArrowLeft || key === Keys.ArrowUp || key === Keys.Home)) {
        return true;
      }
      if (selectionStart < textLength && (key === Keys.ArrowRight || key === Keys.ArrowDown || key === Keys.End)) {
        return true;
      }
    }
    return false;
  }
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function observeMutations(doc, tabster, updateTabsterByAttribute2, syncState) {
  if (typeof MutationObserver === "undefined") {
    return () => {
    };
  }
  const getWindow = tabster.getWindow;
  let elementByUId;
  const onMutation = (mutations) => {
    var _a, _b, _c, _d, _e;
    const removedNodes = /* @__PURE__ */ new Set();
    for (const mutation of mutations) {
      const target = mutation.target;
      const removed = mutation.removedNodes;
      const added = mutation.addedNodes;
      if (mutation.type === "attributes") {
        if (mutation.attributeName === TABSTER_ATTRIBUTE_NAME) {
          if (!removedNodes.has(target)) {
            updateTabsterByAttribute2(tabster, target);
          }
        }
      } else {
        for (let i = 0; i < removed.length; i++) {
          const removedNode = removed[i];
          removedNodes.add(removedNode);
          updateTabsterElements(removedNode, true);
          (_b = (_a = tabster._dummyObserver).domChanged) === null || _b === void 0 ? void 0 : _b.call(_a, target);
        }
        for (let i = 0; i < added.length; i++) {
          updateTabsterElements(added[i]);
          (_d = (_c = tabster._dummyObserver).domChanged) === null || _d === void 0 ? void 0 : _d.call(_c, target);
        }
      }
    }
    removedNodes.clear();
    (_e = tabster.modalizer) === null || _e === void 0 ? void 0 : _e.hiddenUpdate();
  };
  function updateTabsterElements(node, removed) {
    if (!elementByUId) {
      elementByUId = getInstanceContext(getWindow).elementByUId;
    }
    processNode(node, removed);
    const walker = createElementTreeWalker(doc, node, (element) => {
      return processNode(element, removed);
    });
    if (walker) {
      while (walker.nextNode()) {
      }
    }
  }
  function processNode(element, removed) {
    var _a;
    if (!element.getAttribute) {
      return NodeFilter.FILTER_SKIP;
    }
    const uid = element.__tabsterElementUID;
    if (uid && elementByUId) {
      if (removed) {
        delete elementByUId[uid];
      } else {
        (_a = elementByUId[uid]) !== null && _a !== void 0 ? _a : elementByUId[uid] = new WeakHTMLElement(getWindow, element);
      }
    }
    if (getTabsterOnElement(tabster, element) || element.hasAttribute(TABSTER_ATTRIBUTE_NAME)) {
      updateTabsterByAttribute2(tabster, element, removed);
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
class UncontrolledAPI {
  constructor(isUncontrolledCompletely) {
    this._isUncontrolledCompletely = isUncontrolledCompletely;
  }
  isUncontrolledCompletely(element, completely) {
    var _a;
    const isUncontrolledCompletely = (_a = this._isUncontrolledCompletely) === null || _a === void 0 ? void 0 : _a.call(this, element, completely);
    return isUncontrolledCompletely === void 0 ? completely : isUncontrolledCompletely;
  }
}
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class Tabster {
  constructor(tabster) {
    this.keyboardNavigation = tabster.keyboardNavigation;
    this.focusedElement = tabster.focusedElement;
    this.focusable = tabster.focusable;
    this.root = tabster.root;
    this.uncontrolled = tabster.uncontrolled;
    this.core = tabster;
  }
}
class TabsterCore {
  constructor(win, props) {
    var _a, _b;
    this._forgetMemorizedElements = [];
    this._wrappers = /* @__PURE__ */ new Set();
    this._initQueue = [];
    this._version = "8.5.5";
    this._noop = false;
    this.getWindow = () => {
      if (!this._win) {
        throw new Error("Using disposed Tabster.");
      }
      return this._win;
    };
    this._storage = createWeakMap(win);
    this._win = win;
    const getWindow = this.getWindow;
    if (props === null || props === void 0 ? void 0 : props.DOMAPI) {
      setDOMAPI({
        ...props.DOMAPI
      });
    }
    this.keyboardNavigation = new KeyboardNavigationState(getWindow);
    this.focusedElement = new FocusedElementState(this, getWindow);
    this.focusable = new FocusableAPI(this);
    this.root = new RootAPI(this, props === null || props === void 0 ? void 0 : props.autoRoot);
    this.uncontrolled = new UncontrolledAPI(
      // TODO: Remove checkUncontrolledTrappingFocus in the next major version.
      (props === null || props === void 0 ? void 0 : props.checkUncontrolledCompletely) || (props === null || props === void 0 ? void 0 : props.checkUncontrolledTrappingFocus)
    );
    this.controlTab = (_a = props === null || props === void 0 ? void 0 : props.controlTab) !== null && _a !== void 0 ? _a : true;
    this.rootDummyInputs = !!(props === null || props === void 0 ? void 0 : props.rootDummyInputs);
    this._dummyObserver = new DummyInputObserver(getWindow);
    this.getParent = (_b = props === null || props === void 0 ? void 0 : props.getParent) !== null && _b !== void 0 ? _b : dom.getParentNode;
    this.internal = {
      stopObserver: () => {
        if (this._unobserve) {
          this._unobserve();
          delete this._unobserve;
        }
      },
      resumeObserver: (syncState) => {
        if (!this._unobserve) {
          const doc = getWindow().document;
          this._unobserve = observeMutations(doc, this, updateTabsterByAttribute, syncState);
        }
      }
    };
    startFakeWeakRefsCleanup(getWindow);
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
    var _a;
    if (!props) {
      return;
    }
    this.getParent = (_a = props.getParent) !== null && _a !== void 0 ? _a : this.getParent;
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this.internal.stopObserver();
    const win = this._win;
    win === null || win === void 0 ? void 0 : win.clearTimeout(this._initTimer);
    delete this._initTimer;
    this._initQueue = [];
    this._forgetMemorizedElements = [];
    if (win && this._forgetMemorizedTimer) {
      win.clearTimeout(this._forgetMemorizedTimer);
      delete this._forgetMemorizedTimer;
    }
    (_a = this.outline) === null || _a === void 0 ? void 0 : _a.dispose();
    (_b = this.crossOrigin) === null || _b === void 0 ? void 0 : _b.dispose();
    (_c = this.deloser) === null || _c === void 0 ? void 0 : _c.dispose();
    (_d = this.groupper) === null || _d === void 0 ? void 0 : _d.dispose();
    (_e = this.mover) === null || _e === void 0 ? void 0 : _e.dispose();
    (_f = this.modalizer) === null || _f === void 0 ? void 0 : _f.dispose();
    (_g = this.observedElement) === null || _g === void 0 ? void 0 : _g.dispose();
    (_h = this.restorer) === null || _h === void 0 ? void 0 : _h.dispose();
    this.keyboardNavigation.dispose();
    this.focusable.dispose();
    this.focusedElement.dispose();
    this.root.dispose();
    this._dummyObserver.dispose();
    stopFakeWeakRefsCleanupAndClearStorage(this.getWindow);
    clearElementCache(this.getWindow);
    this._storage = /* @__PURE__ */ new WeakMap();
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
    cleanupFakeWeakRefs(this.getWindow, true);
  }
  queueInit(callback) {
    var _a;
    if (!this._win) {
      return;
    }
    this._initQueue.push(callback);
    if (!this._initTimer) {
      this._initTimer = (_a = this._win) === null || _a === void 0 ? void 0 : _a.setTimeout(() => {
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
    this._initQueue = [];
    queue.forEach((callback) => callback());
  }
}
function createTabster(win, props) {
  let tabster = getCurrentTabster(win);
  if (tabster) {
    return tabster.createTabster(false, props);
  }
  tabster = new TabsterCore(win, props);
  win.__tabsterInstance = tabster;
  return tabster.createTabster();
}
function getTabster(win) {
  const tabster = getCurrentTabster(win);
  return tabster ? tabster.createTabster(true) : null;
}
function getMover(tabster) {
  const tabsterCore = tabster.core;
  if (!tabsterCore.mover) {
    tabsterCore.mover = new MoverAPI(tabsterCore, tabsterCore.getWindow);
  }
  return tabsterCore.mover;
}
function getDeloser(tabster, props) {
  const tabsterCore = tabster.core;
  if (!tabsterCore.deloser) {
    tabsterCore.deloser = new DeloserAPI(tabsterCore, props);
  }
  return tabsterCore.deloser;
}
function disposeTabster(tabster, allInstances) {
  tabster.core.disposeTabster(tabster, allInstances);
}
function getCurrentTabster(win) {
  return win.__tabsterInstance;
}

export { AsyncFocusSources, DeloserFocusLostEvent, DeloserFocusLostEventName, DeloserRestoreFocusEventName, DeloserStrategies, FOCUSABLE_SELECTOR, MoverDirections, MoverKeys, MoverMemorizedElementEventName, MoverMoveFocusEventName, MoverStateEvent, MoverStateEventName, RestoreFocusOrders, RootBlurEvent, RootBlurEventName, RootFocusEvent, RootFocusEventName, SysDummyInputsPositions, TABSTER_ATTRIBUTE_NAME, TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME, TabsterCustomEvent, TabsterFocusInEvent, TabsterFocusInEventName, TabsterFocusOutEvent, TabsterFocusOutEventName, TabsterMoveFocusEvent, TabsterMoveFocusEventName, Visibilities, createTabster, disposeTabster, getDeloser, getDummyInputContainer, getMover, getTabster, getTabsterAttribute, mergeTabsterProps, setTabsterAttribute };
