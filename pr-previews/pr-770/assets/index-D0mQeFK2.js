import { D as DeloserRestoreFocusEventName, d as dom, g as getTabsterOnElement, i as isDisplayNone, a as DeloserStrategies, T as TabsterMoveFocusEvent, R as RootAPI, b as TabsterPart, c as getElementUId, W as WeakHTMLElement, e as RestoreFocusOrders, f as DeloserFocusLostEvent, h as documentContains, M as MoverMoveFocusEventName, j as MoverMemorizedElementEventName, k as MoverKeys, l as isElementVerticallyVisibleInContainer, s as scrollIntoView, n as nativeFocus, m as matchesSelector, K as Keys, o as MoverDirections, p as MoverStateEvent, q as getDummyInputContainer, V as Visibilities, F as FocusedElementState, r as createElementTreeWalker, t as DummyInputManager, u as DummyInputManagerPriorities, v as disposeTabster, w as getTabster, x as createTabster } from './Tabster-ziHwev4V.js';
export { A as AsyncFocusSources, y as DeloserFocusLostEventName, z as FOCUSABLE_SELECTOR, B as MoverStateEventName, C as RootBlurEvent, E as RootBlurEventName, G as RootFocusEvent, H as RootFocusEventName, S as SysDummyInputsPositions, I as TABSTER_ATTRIBUTE_NAME, J as TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME, L as TabsterCustomEvent, N as TabsterFocusInEvent, O as TabsterFocusInEventName, P as TabsterFocusOutEvent, Q as TabsterFocusOutEventName, U as TabsterMoveFocusEventName, X as getTabsterAttribute, Y as mergeTabsterProps, Z as setTabsterAttribute } from './Tabster-ziHwev4V.js';

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const _containerHistoryLength = 10;
class DeloserItemBase {
}
class DeloserItem extends DeloserItemBase {
  uid;
  _tabster;
  _deloser;
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
    return Promise.resolve(this._deloser.resetFocus());
  }
}
class DeloserHistoryByRootBase {
  _tabster;
  _history = [];
  rootUId;
  constructor(tabster, rootUId) {
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
  _tabster;
  _history = [];
  constructor(tabster) {
    this._tabster = tabster;
  }
  dispose() {
    this._history = [];
  }
  process(element) {
    const ctx = RootAPI.getTabsterContext(this._tabster, element);
    const rootUId = ctx && ctx.root.uid;
    const deloser = DeloserAPI.getDeloser(this._tabster, element);
    if (!rootUId || !deloser) {
      return void 0;
    }
    const historyByRoot = this.make(rootUId, () => new DeloserHistoryByRoot(this._tabster, rootUId));
    if (!ctx || !ctx.modalizer || ctx.modalizer?.isActive()) {
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
  uid;
  strategy;
  _isActive = false;
  _history = [[]];
  _snapshotIndex = 0;
  _onDispose;
  constructor(tabster, element, onDispose, props) {
    super(tabster, element, props);
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
  isActive = () => {
    return this._isActive;
  };
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
  setSnapshot = (index) => {
    this._snapshotIndex = index;
    if (this._history.length > index + 1) {
      this._history.splice(index + 1, this._history.length - index - 1);
    }
    if (!this._history[index]) {
      this._history[index] = [];
    }
  };
  focusFirst = () => {
    const e = this._element.get();
    return !!e && this._tabster.focusedElement.focusFirst({
      container: e
    });
  };
  unshift(element) {
    let cur = this._history[this._snapshotIndex];
    cur = this._history[this._snapshotIndex] = cur.filter((we) => {
      const e = we.get();
      return e && e !== element;
    });
    cur.unshift(new WeakHTMLElement(element, buildSelector(element)));
    while (cur.length > _containerHistoryLength) {
      cur.pop();
    }
  }
  focusDefault = () => {
    const e = this._element.get();
    return !!e && this._tabster.focusedElement.focusDefault(e);
  };
  resetFocus = () => {
    const e = this._element.get();
    return !!e && this._tabster.focusedElement.resetFocus(e);
  };
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
  clearHistory = (preserveExisting) => {
    const element = this._element.get();
    if (!element) {
      this._history[this._snapshotIndex] = [];
      return;
    }
    this._history[this._snapshotIndex] = this._history[this._snapshotIndex].filter((we) => {
      const e = we.get();
      return e && preserveExisting ? dom.nodeContains(element, e) : false;
    });
  };
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
  _tabster;
  _win;
  /**
   * Tracks if focus is inside a deloser
   */
  _inDeloser = false;
  _curDeloser;
  _history;
  _restoreFocusTimer;
  _isRestoringFocus = false;
  _isPaused = false;
  _autoDeloser;
  _autoDeloserInstance;
  constructor(tabster, props) {
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
    const autoDeloser = props?.autoDeloser;
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
    const deloser = new Deloser(this._tabster, element, this._onDeloserDispose, props);
    if (dom.nodeContains(element, this._tabster.focusedElement.getFocusedElement() ?? null)) {
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
  _onRestoreFocus = (event) => {
    const target = event.composedPath()[0];
    if (target) {
      const available = DeloserAPI.getDeloser(this._tabster, target)?.findAvailable();
      if (available) {
        this._tabster.focusedElement.focus(available);
      }
      event.stopImmediatePropagation();
    }
  };
  _onFocus = (e) => {
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
  /**
   * Activates and sets the current deloser
   */
  _activate(deloser) {
    const curDeloser = this._curDeloser;
    if (curDeloser !== deloser) {
      this._inDeloser = true;
      curDeloser?.setActive(false);
      deloser.setActive(true);
      this._curDeloser = deloser;
    }
  }
  /**
   * Called when focus should no longer be in a deloser
   */
  _deactivate() {
    this._inDeloser = false;
    this._curDeloser?.setActive(false);
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
          if (el && (!curDeloserElement?.dispatchEvent(new TabsterMoveFocusEvent({
            by: "deloser",
            owner: curDeloserElement,
            next: el
          })) || this._tabster.focusedElement.focus(el))) {
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
        const body = element.ownerDocument?.body;
        if (body) {
          deloserAPI._autoDeloserInstance = new Deloser(tabster, body, tabster.deloser._onDeloserDispose, autoDeloserProps);
        }
      }
      return deloserAPI._autoDeloserInstance;
    }
    return void 0;
  }
  _onDeloserDispose = (deloser) => {
    this._history.removeDeloser(deloser);
    if (deloser.isActive()) {
      this._scheduleRestoreFocus();
    }
  };
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
/**
 * Creates a new deloser instance or returns an existing one
 * @param tabster Tabster instance
 * @param props Deloser props
 */
function getDeloser(tabster, props) {
  const tabsterCore = tabster.core;
  if (!tabsterCore.deloser) {
    const api = new DeloserAPI(tabsterCore, props);
    tabsterCore.deloser = api;
    tabsterCore.attrHandlers.set("deloser", (element, existingDeloser, newProps) => {
      if (existingDeloser) {
        existingDeloser.setProps(newProps);
        return existingDeloser;
      }
      return api.createDeloser(element, newProps);
    });
  }
  return tabsterCore.deloser;
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const _inputSelector = ["input", "textarea", "*[contenteditable]"].join(", ");
class MoverDummyManager extends DummyInputManager {
  _tabster;
  _getMemorized;
  constructor(element, tabster, getMemorized, sys) {
    super(tabster, element, DummyInputManagerPriorities.Mover, sys);
    this._tabster = tabster;
    this._getMemorized = getMemorized;
    this._setHandlers(this._onFocusDummyInput);
  }
  _onFocusDummyInput = (dummyInput) => {
    const container = this._element.get();
    const input = dummyInput.input;
    if (container && input) {
      const ctx = RootAPI.getTabsterContext(this._tabster, container);
      let toFocus;
      if (ctx) {
        toFocus = FocusedElementState.findNextTabbable(this._tabster, ctx, void 0, input, void 0, !dummyInput.isFirst, true)?.element;
      }
      const memorized = this._getMemorized()?.get();
      if (memorized && this._tabster.focusable.isFocusable(memorized)) {
        toFocus = memorized;
      }
      if (toFocus) {
        nativeFocus(toFocus);
      }
    }
  };
}
const _moverUpdateAdd = 1;
const _moverUpdateAttr = 2;
const _moverUpdateRemove = 3;
class Mover extends TabsterPart {
  _unobserve;
  _intersectionObserver;
  _setCurrentTimer;
  _current;
  _prevCurrent;
  _visible = {};
  _fullyVisible;
  _win;
  _onDispose;
  _allElements;
  _updateQueue;
  _updateTimer;
  visibilityTolerance;
  dummyManager;
  constructor(tabster, element, onDispose, props, sys) {
    super(tabster, element, props);
    this._win = tabster.getWindow;
    this.visibilityTolerance = props.visibilityTolerance ?? 0.8;
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
    this.dummyManager?.dispose();
    delete this.dummyManager;
  }
  setCurrent(element) {
    if (element) {
      this._current = new WeakHTMLElement(element);
    } else {
      this._current = void 0;
    }
    if ((this._props.trackState || this._props.visibilityAware) && !this._setCurrentTimer) {
      this._setCurrentTimer = this._win().setTimeout(() => {
        delete this._setCurrentTimer;
        const changed = [];
        if (this._current !== this._prevCurrent) {
          changed.push(this._current);
          changed.push(this._prevCurrent);
          this._prevCurrent = this._current;
        }
        for (const weak of changed) {
          const el = weak?.get();
          if (el && this._allElements?.get(el) === this) {
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
    return this._current?.get() || null;
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
    if (!FocusedElementState.isTabbing) {
      return state.currentCtx?.excludedFromMover ? NodeFilter.FILTER_REJECT : void 0;
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
        const current = this._current?.get();
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
            const id = getElementUId(this._win, el);
            const visibility = this._visible[id];
            return moverElement !== el && !!this._allElements?.get(el) && state.acceptCondition(el) && (visibility === Visibilities.Visible || visibility === Visibilities.PartiallyVisible && (visibilityAware === Visibilities.PartiallyVisible || !this._fullyVisible));
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
  _onIntersection = (entries) => {
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
      const current = allElements.get(element2);
      if (current && remove) {
        this._intersectionObserver?.unobserve(element2);
        allElements.delete(element2);
      }
      if (!current && !remove) {
        allElements.set(element2, this);
        this._intersectionObserver?.observe(element2);
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
        const groupperFirstFocusable = groupper?.getFirst(true);
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
  _tabster;
  _win;
  _movers;
  _ignoredInputTimer;
  _ignoredInputResolve;
  constructor(tabster, getWindow) {
    this._tabster = tabster;
    this._win = getWindow;
    this._movers = {};
    tabster.queueInit(this._init);
  }
  _init = () => {
    const win = this._win();
    win.addEventListener("keydown", this._onKeyDown, true);
    win.addEventListener(MoverMoveFocusEventName, this._onMoveFocus);
    win.addEventListener(MoverMemorizedElementEventName, this._onMemorizedElement);
    this._tabster.focusedElement.subscribe(this._onFocus);
  };
  dispose() {
    const win = this._win();
    this._tabster.focusedElement.unsubscribe(this._onFocus);
    this._ignoredInputResolve?.(false);
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
  _onMoverDispose = (mover) => {
    delete this._movers[mover.id];
  };
  _onFocus = (element) => {
    let currentFocusableElement = element;
    let deepestFocusableElement = element;
    for (let el = dom.getParentElement(element); el; el = dom.getParentElement(el)) {
      const mover = getTabsterOnElement(this._tabster, el)?.mover;
      if (mover) {
        mover.setCurrent(deepestFocusableElement);
        currentFocusableElement = void 0;
      }
      if (!currentFocusableElement && this._tabster.focusable.isFocusable(el)) {
        currentFocusableElement = deepestFocusableElement = el;
      }
    }
  };
  moveFocus(fromElement, key) {
    return this._moveFocus(fromElement, key);
  }
  _moveFocus(fromElement, key, relatedEvent) {
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
          if (getTabsterOnElement(tabster, el)?.groupper?.isActive(true)) {
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
            if (!focusable.isFocusable(el)) {
              return false;
            }
            const nextElementX1 = Math.ceil(el.getBoundingClientRect().left ?? 0);
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
            if (!focusable.isFocusable(el)) {
              return false;
            }
            const nextElementX1 = Math.ceil(el.getBoundingClientRect().left ?? 0);
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
  _onKeyDown = async (event) => {
    if (this._ignoredInputTimer) {
      this._win().clearTimeout(this._ignoredInputTimer);
      delete this._ignoredInputTimer;
    }
    this._ignoredInputResolve?.(false);
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
  _onMoveFocus = (e) => {
    const element = e.composedPath()[0];
    const key = e.detail?.key;
    if (element && key !== void 0 && !e.defaultPrevented) {
      this._moveFocus(element, key);
      e.stopImmediatePropagation();
    }
  };
  _onMemorizedElement = (e) => {
    const target = e.composedPath()[0];
    let memorizedElement = e.detail?.memorizedElement;
    if (target) {
      const ctx = RootAPI.getTabsterContext(this._tabster, target);
      const mover = ctx?.mover;
      if (mover) {
        if (memorizedElement && !dom.nodeContains(mover.getElement(), memorizedElement)) {
          memorizedElement = void 0;
        }
        mover.setCurrent(memorizedElement);
        e.stopImmediatePropagation();
      }
    }
  };
  async _isIgnoredInput(element, key) {
    if (element.getAttribute("aria-expanded") === "true" && (element.hasAttribute("aria-activedescendant") || element.getAttribute("role") === "combobox")) {
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
        asyncRet = new Promise((resolve) => {
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
            delete this._ignoredInputTimer;
            const {
              anchorNode,
              focusNode,
              anchorOffset,
              focusOffset
            } = dom.getSelection(element) || {};
            if (anchorNode !== prevAnchorNode || focusNode !== prevFocusNode || anchorOffset !== prevAnchorOffset || focusOffset !== prevFocusOffset) {
              this._ignoredInputResolve?.(false);
              return;
            }
            selectionStart = anchorOffset || 0;
            selectionEnd = focusOffset || 0;
            textLength = element.textContent?.length || 0;
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
            this._ignoredInputResolve?.(true);
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
/**
 * Creates a new mover instance or returns an existing one
 * @param tabster Tabster instance
 */
function getMover(tabster) {
  const tabsterCore = tabster.core;
  if (!tabsterCore.mover) {
    const api = new MoverAPI(tabsterCore, tabsterCore.getWindow);
    tabsterCore.mover = api;
    tabsterCore.attrHandlers.set("mover", (element, existingMover, newProps, _oldProps, sys) => {
      if (existingMover) {
        existingMover.setProps(newProps);
        return existingMover;
      }
      return api.createMover(element, newProps, sys);
    });
  }
  return tabsterCore.mover;
}

export { DeloserFocusLostEvent, DeloserRestoreFocusEventName, DeloserStrategies, MoverDirections, MoverKeys, MoverMemorizedElementEventName, MoverMoveFocusEventName, MoverStateEvent, RestoreFocusOrders, TabsterMoveFocusEvent, Visibilities, createTabster, disposeTabster, getDeloser, getDummyInputContainer, getMover, getTabster };
