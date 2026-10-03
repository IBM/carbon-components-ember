//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Consts.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var TABSTER_ATTRIBUTE_NAME = "data-tabster";
var TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME = "data-tabster-dummy";
var FOCUSABLE_SELECTOR = `:is(${[
	"a[href]",
	"button",
	"input",
	"select",
	"textarea",
	"*[tabindex]",
	"*[contenteditable]",
	"details > summary",
	"audio[controls]",
	"video[controls]"
].join(", ")}):not(:disabled)`;
var AsyncFocusSources = {
	EscapeGroupper: 1,
	Restorer: 2,
	Deloser: 3
};
var RestoreFocusOrders = {
	History: 0,
	DeloserDefault: 1,
	RootDefault: 2,
	DeloserFirst: 3,
	RootFirst: 4
};
var DeloserStrategies = {
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
var Visibilities = {
	Invisible: 0,
	PartiallyVisible: 1,
	Visible: 2
};
var MoverDirections = {
	Both: 0,
	Vertical: 1,
	Horizontal: 2,
	Grid: 3,
	GridLinear: 4
};
var MoverKeys = {
	ArrowUp: 1,
	ArrowDown: 2,
	ArrowLeft: 3,
	ArrowRight: 4,
	PageUp: 5,
	PageDown: 6,
	Home: 7,
	End: 8
};
var SysDummyInputsPositions = {
	Auto: 0,
	Inside: 1,
	Outside: 2
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Instance.js
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
		if (newAttrValue !== entry?.attr?.string) try {
			const newValue = JSON.parse(newAttrValue);
			if (typeof newValue !== "object") throw new Error(`Value is not a JSON object, got '${newAttrValue}'.`);
			newAttr = {
				string: newAttrValue,
				object: newValue
			};
		} catch (e) {}
		else return;
	} else if (!entry) return;
	if (!entry) entry = tabster.storageEntry(element, true);
	if (!entry.tabster) entry.tabster = {};
	const tabsterOnElement = entry.tabster || {};
	const oldTabsterProps = entry.attr?.object || {};
	const newTabsterProps = newAttr?.object || {};
	for (const key of Object.keys(oldTabsterProps)) if (!newTabsterProps[key]) {
		if (key === "root") {
			const root = tabsterOnElement[key];
			if (root) tabster.root.onRoot(root, true);
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
				if (tabster.observedElement) tabster.observedElement.onObservedElementUpdate(element);
				break;
			case "focusable":
			case "outline":
			case "uncontrolled":
			case "sys": delete tabsterOnElement[key];
		}
	}
	for (const key of Object.keys(newTabsterProps)) {
		const sys = newTabsterProps.sys;
		switch (key) {
			case "root":
				if (tabsterOnElement.root) tabsterOnElement.root.setProps(newTabsterProps.root);
				else tabsterOnElement.root = tabster.root.createRoot(element, newTabsterProps.root, sys);
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
				if (tabster.outline) tabsterOnElement.outline = newTabsterProps.outline;
				break;
			case "sys":
				tabsterOnElement.sys = newTabsterProps.sys;
				break;
			default: {
				const handler = tabster.attrHandlers.get(key);
				if (handler) tabsterOnElement[key] = handler(element, tabsterOnElement[key], newTabsterProps[key], oldTabsterProps?.[key], sys);
			}
		}
	}
	if (newAttr) entry.attr = newAttr;
	else {
		if (Object.keys(tabsterOnElement).length === 0) {
			delete entry.tabster;
			delete entry.attr;
		}
		tabster.storageEntry(element, false);
	}
}
//#endregion
//#region ../node_modules/.pnpm/keyborg@2.14.1/node_modules/keyborg/dist/index.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var addEventListener = (target, type, handler) => {
	target.addEventListener(type, handler, true);
};
var removeEventListener = (target, type, handler) => {
	target.removeEventListener(type, handler, true);
};
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var KEYBORG_FOCUSIN = "keyborg:focusin";
var KEYBORG_FOCUSOUT = "keyborg:focusout";
var FOCUS_IN_HANDLER = 0;
var FOCUS_OUT_HANDLER = 1;
var SHADOW_TARGETS = 2;
var LAST_FOCUSED_PROGRAMMATICALLY = 3;
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
var _canOverrideNativeFocus = false;
/**
* Guarantees that the native `focus` will be used
*/
function nativeFocus(element) {
	const focus = element.focus;
	if (focus.__keyborgNativeFocus) focus.__keyborgNativeFocus.call(element);
	else element.focus();
}
/**
* Overrides the native `focus` and setups the keyborg focus event
*/
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
			detail: { originalEvent: e }
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
			/**
			* https://bugs.chromium.org/p/chromium/issues/detail?id=1512028
			* focusin events don't bubble up through an open shadow root once focus is inside
			* once focus moves into a shadow root - we drop the same focusin handler there
			* keyborg's custom event will still bubble up since it is composed
			* event handlers should be cleaned up once focus leaves the shadow root.
			*
			* When a focusin event is dispatched from a shadow root, its target is the shadow root parent.
			* Each shadow root encounter requires a new capture listener.
			* Why capture? - we want to follow the focus event in order or descending nested shadow roots
			* When there are no more shadow root targets - dispatch the keyborg:focusin event
			*
			* 1. no focus event
			* > document - capture listener ✅
			*   > shadow root 1
			*     > shadow root 2
			*       > shadow root 3
			*         > focused element
			*
			* 2. focus event received by document listener
			* > document - capture listener ✅ (focus event here)
			*   > shadow root 1 - capture listener ✅
			*     > shadow root 2
			*       > shadow root 3
			*         > focused element
			*
			* 3. focus event received by root l1 listener
			* > document - capture listener ✅
			*   > shadow root 1 - capture listener ✅ (focus event here)
			*     > shadow root 2 - capture listener ✅
			*       > shadow root 3
			*         > focused element
			*
			* 4. focus event received by root l2 listener
			* > document - capture listener ✅
			*   > shadow root 1 - capture listener ✅
			*     > shadow root 2 - capture listener ✅ (focus event here)
			*       > shadow root 3 - capture listener ✅
			*         > focused element
			*
			* 5. focus event received by root l3 listener, no more shadow root targets
			* > document - capture listener ✅
			*   > shadow root 1 - capture listener ✅
			*     > shadow root 2 - capture listener ✅
			*       > shadow root 3 - capture listener ✅ (focus event here)
			*         > focused element ✅ (no shadow root - dispatch keyborg event)
			*/
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
	const data = [
		focusInHandler,
		focusOutHandler,
		shadowTargets
	];
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
/**
* Removes keyborg event listeners and custom focus override
* @param win The window that stores keyborg focus events
*/
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
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var _dismissTimeout = 500;
var _lastId = 0;
function createKeyborgCore(targetWindow, props) {
	let currentTargetWindow = targetWindow;
	let isNavigating = false;
	let isMouseOrTouchUsedTimer;
	let dismissTimer;
	let triggerKeys;
	let dismissKeys;
	if (props) {
		if (props.triggerKeys?.length) triggerKeys = new Set(props.triggerKeys);
		if (props.dismissKeys?.length) dismissKeys = new Set(props.dismissKeys);
	}
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
		const isTriggerKey = !triggerKeys || triggerKeys.has(e.keyCode);
		const isEditable = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
		return isTriggerKey && !isEditable;
	};
	const shouldDismiss = (e) => {
		return !!dismissKeys?.has(e.keyCode);
	};
	const scheduleDismiss = () => {
		const targetWindow = currentTargetWindow;
		if (!targetWindow) return;
		if (dismissTimer) {
			targetWindow.clearTimeout(dismissTimer);
			dismissTimer = void 0;
		}
		const previousActiveElement = targetWindow.document.activeElement;
		dismissTimer = targetWindow.setTimeout(() => {
			dismissTimer = void 0;
			const currentActiveElement = targetWindow.document.activeElement;
			if (previousActiveElement && currentActiveElement && previousActiveElement === currentActiveElement) setNavigating(false);
		}, _dismissTimeout);
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
		if (isNavigating) {
			if (shouldDismiss(e)) scheduleDismiss();
		} else if (shouldTrigger(e)) setNavigating(true);
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
		if (dismissTimer) {
			currentTargetWindow.clearTimeout(dismissTimer);
			dismissTimer = void 0;
		}
		disposeFocusEvent(currentTargetWindow);
		const targetDocument = currentTargetWindow.document;
		removeEventListener(targetDocument, KEYBORG_FOCUSIN, onFocusIn);
		removeEventListener(targetDocument, "mousedown", onMouseDown);
		removeEventListener(currentTargetWindow, "keydown", onKeyDown);
		removeEventListener(targetDocument, "touchstart", onMouseOrTouch);
		removeEventListener(targetDocument, "touchend", onMouseOrTouch);
		removeEventListener(targetDocument, "touchcancel", onMouseOrTouch);
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
	else core = createKeyborgCore(kwin, props);
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
		refs: { [id]: instance }
	};
	return instance;
}
function disposeKeyborg(instance) {
	instance.dispose();
}
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Events.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
/**
* Events sent by Tabster.
*/
var TabsterFocusInEventName = "tabster:focusin";
var TabsterFocusOutEventName = "tabster:focusout";
var TabsterMoveFocusEventName = "tabster:movefocus";
/**
* Events sent by Deloser.
*/
var DeloserFocusLostEventName = "tabster:deloser:focus-lost";
/**
* Events to be sent to Deloser by the application.
*/
var DeloserRestoreFocusEventName = "tabster:deloser:restore-focus";
/**
* Events sent by Mover.
*/
var MoverStateEventName = "tabster:mover:state";
/**
* Events to be sent to Mover by the application.
*/
var MoverMoveFocusEventName = "tabster:mover:movefocus";
var MoverMemorizedElementEventName = "tabster:mover:memorized-element";
/**
* Events sent by Root.
*/
var RootFocusEventName = "tabster:root:focus";
var RootBlurEventName = "tabster:root:blur";
var CustomEvent_ = typeof CustomEvent !== "undefined" ? CustomEvent : function() {};
var TabsterCustomEvent = class extends CustomEvent_ {
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
};
var TabsterFocusInEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(TabsterFocusInEventName, detail);
	}
};
var TabsterFocusOutEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(TabsterFocusOutEventName, detail);
	}
};
var TabsterMoveFocusEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(TabsterMoveFocusEventName, detail);
	}
};
var MoverStateEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(MoverStateEventName, detail);
	}
};
var DeloserFocusLostEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(DeloserFocusLostEventName, detail);
	}
};
var RootFocusEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(RootFocusEventName, detail);
	}
};
var RootBlurEvent = class extends TabsterCustomEvent {
	constructor(detail) {
		super(RootBlurEventName, detail);
	}
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/DOMAPI.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var _createMutationObserver = (callback) => new MutationObserver(callback);
var _createTreeWalker = (doc, root, whatToShow, filter) => doc.createTreeWalker(root, whatToShow, filter);
var _getParentNode = (node) => node ? node.parentNode : null;
var _getParentElement = (element) => element ? element.parentElement : null;
var _nodeContains = (parent, child) => !!(child && parent?.contains(child));
var _getActiveElement = (doc) => doc.activeElement;
var _querySelector = (element, selector) => element.querySelector(selector);
var _querySelectorAll = (element, selector) => Array.prototype.slice.call(element.querySelectorAll(selector), 0);
var _getElementById = (doc, id) => doc.getElementById(id);
var _getFirstChild = (node) => node?.firstChild || null;
var _getLastChild = (node) => node?.lastChild || null;
var _getNextSibling = (node) => node?.nextSibling || null;
var _getPreviousSibling = (node) => node?.previousSibling || null;
var _getFirstElementChild = (element) => element?.firstElementChild || null;
var _getLastElementChild = (element) => element?.lastElementChild || null;
var _getNextElementSibling = (element) => element?.nextElementSibling || null;
var _getPreviousElementSibling = (element) => element?.previousElementSibling || null;
var _appendChild = (parent, child) => parent.appendChild(child);
var _insertBefore = (parent, child, referenceChild) => parent.insertBefore(child, referenceChild);
var _getSelection = (ref) => ref.ownerDocument?.getSelection() || null;
var _getElementsByName = (referenceElement, name) => referenceElement.ownerDocument.getElementsByName(name);
var dom = {
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
	for (const key of Object.keys(domapi)) dom[key] = domapi[key];
}
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Utils.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var _uidCounter = 0;
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
		if (ctx.containerBoundingRectCacheTimer) win.clearTimeout(ctx.containerBoundingRectCacheTimer);
		delete win.__tabsterInstanceContext;
	}
}
function hasSubFocusable(element) {
	return !!element.querySelector(FOCUSABLE_SELECTOR);
}
var WeakHTMLElement = class {
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
			if (!element) delete this._ref;
		}
		return element;
	}
	getData() {
		return this._data;
	}
};
function createElementTreeWalker(doc, root, acceptNode) {
	if (root.nodeType !== Node.ELEMENT_NODE) return;
	return dom.createTreeWalker(doc, root, NodeFilter.SHOW_ELEMENT, { acceptNode });
}
function getBoundingRect(getWindow, element) {
	let cacheId = element.__tabsterCacheId;
	const context = getInstanceContext(getWindow);
	const cached = cacheId ? context.containerBoundingRectCache[cacheId] : void 0;
	if (cached) return cached.rect;
	const scrollingElement = element.ownerDocument && element.ownerDocument.documentElement;
	if (!scrollingElement) return new DOMRect();
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
	if (!context.containerBoundingRectCacheTimer) context.containerBoundingRectCacheTimer = window.setTimeout(() => {
		context.containerBoundingRectCacheTimer = void 0;
		for (const cId of Object.keys(context.containerBoundingRectCache)) delete context.containerBoundingRectCache[cId].element.__tabsterCacheId;
		context.containerBoundingRectCache = {};
	}, 50);
	return rect;
}
function isElementVerticallyVisibleInContainer(getWindow, element, tolerance) {
	const container = getScrollableContainer(element);
	if (!container) return false;
	const containerRect = getBoundingRect(getWindow, container);
	const elementRect = element.getBoundingClientRect();
	const intersectionTolerance = elementRect.height * (1 - tolerance);
	const totalIntersection = Math.max(0, containerRect.top - elementRect.top) + Math.max(0, elementRect.bottom - containerRect.bottom);
	return totalIntersection === 0 || totalIntersection <= intersectionTolerance;
}
function scrollIntoView(getWindow, element, alignToTop) {
	const container = getScrollableContainer(element);
	if (container) {
		const containerRect = getBoundingRect(getWindow, container);
		const elementRect = element.getBoundingClientRect();
		if (alignToTop) container.scrollTop += elementRect.top - containerRect.top;
		else container.scrollTop += elementRect.bottom - containerRect.bottom;
	}
}
function getScrollableContainer(element) {
	const doc = element.ownerDocument;
	if (doc) {
		for (let el = dom.getParentElement(element); el; el = dom.getParentElement(el)) if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) return el;
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
	const rnd = /* @__PURE__ */ new Uint32Array(4);
	wnd.crypto.getRandomValues(rnd);
	const srnd = [];
	for (let i = 0; i < rnd.length; i++) srnd.push(rnd[i].toString(36));
	srnd.push("|");
	srnd.push((++_uidCounter).toString(36));
	srnd.push("|");
	srnd.push(Date.now().toString(36));
	return srnd.join("");
}
function getElementUId(getWindow, element) {
	const context = getInstanceContext(getWindow);
	let uid = element.__tabsterElementUID;
	if (!uid) uid = element.__tabsterElementUID = getUId(getWindow());
	if (!context.elementByUId[uid] && documentContains(element.ownerDocument, element)) context.elementByUId[uid] = new WeakHTMLElement(element);
	return uid;
}
function clearElementCache(getWindow, parent) {
	const context = getInstanceContext(getWindow);
	for (const key of Object.keys(context.elementByUId)) {
		const wel = context.elementByUId[key];
		const el = wel && wel.get();
		if (el && parent) {
			if (!dom.nodeContains(parent, el)) continue;
		}
		delete context.elementByUId[key];
	}
}
function documentContains(doc, element) {
	return dom.nodeContains(doc?.body, element);
}
function matchesSelector(element, selector) {
	return typeof element.matches === "function" && element.matches(selector);
}
var _lastTabsterPartId = 0;
var TabsterPart = class {
	_tabster;
	_element;
	_props;
	id;
	constructor(tabster, element, props) {
		this._tabster = tabster;
		this._element = new WeakHTMLElement(element);
		this._props = { ...props };
		this.id = "i" + ++_lastTabsterPartId;
	}
	getElement() {
		return this._element.get();
	}
	getProps() {
		return this._props;
	}
	setProps(props) {
		this._props = { ...props };
	}
};
function getLastChild(container) {
	let lastChild = null;
	for (let i = dom.getLastElementChild(container); i; i = dom.getLastElementChild(i)) lastChild = i;
	return lastChild || void 0;
}
function isDisplayNone(element) {
	const elementDocument = element.ownerDocument;
	const computedStyle = elementDocument.defaultView?.getComputedStyle(element);
	if (element.offsetParent === null && elementDocument.body !== element && computedStyle?.position !== "fixed") return true;
	if (computedStyle?.visibility === "hidden") return true;
	if (computedStyle?.position === "fixed") {
		if (computedStyle.display === "none") return true;
		if (element.parentElement?.offsetParent === null && elementDocument.body !== element.parentElement) return true;
	}
	return false;
}
function isRadio(element) {
	return element.tagName === "INPUT" && !!element.name && element.type === "radio";
}
function getRadioButtonGroup(element) {
	if (!isRadio(element)) return;
	const name = element.name;
	let radioButtons = Array.from(dom.getElementsByName(element, name));
	let checked;
	radioButtons = radioButtons.filter((el) => {
		if (isRadio(el)) {
			if (el.checked) checked = el;
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
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/DummyInput.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var _updateDummyInputsTimeout = 100;
/**
* Dummy HTML elements that are used as focus sentinels for the DOM enclosed within them
*/
var DummyInput = class {
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
		if (this._clearDisposeTimeout) this._clearDisposeTimeout();
		const input = this.input;
		if (!input) return;
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
			if (target) nativeFocus(target);
			return;
		}
		const input = this.input;
		if (this.onFocusIn && input) {
			const relatedTarget = e.relatedTarget;
			this.onFocusIn(this, this._isBackward(true, input, relatedTarget), relatedTarget);
		}
	};
	_focusOut = (e) => {
		if (this._fixedTarget) return;
		this.useDefaultAction = false;
		const input = this.input;
		if (this.onFocusOut && input) {
			const relatedTarget = e.relatedTarget;
			this.onFocusOut(this, this._isBackward(false, input, relatedTarget), relatedTarget);
		}
	};
};
var DummyInputManagerPriorities = {
	Root: 1,
	Modalizer: 2,
	Mover: 3,
	Groupper: 4
};
var DummyInputManager = class {
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
		const input = new DummyInput(tabster.getWindow, true, {
			isPhantom: true,
			isFirst: true
		}).input;
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
					if (dummyFor === element) insertBefore = moveOutOfElement && isBackward || !moveOutOfElement && !isBackward ? potentialDummy : dom.getNextElementSibling(potentialDummy);
					else dummyFor = null;
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
		const input = new DummyInput(tabster.getWindow, true, {
			isPhantom: true,
			isFirst: true
		}, void 0, new WeakHTMLElement(targetElement)).input;
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
			if (dummyParent) dom.insertBefore(dummyParent, input, insertBefore);
		}
	}
};
var DummyInputObserver = class {
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
		if (this._dummyElements.length === 0) delete this.domChanged;
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
		if (this._changedParents.has(parent)) return;
		this._changedParents.add(parent);
		if (this._updateDummyInputsTimer) return;
		this._updateDummyInputsTimer = this._win?.().setTimeout(() => {
			delete this._updateDummyInputsTimer;
			for (const ref of this._dummyElements) {
				const dummyElement = ref.get();
				if (dummyElement) {
					const callback = this._dummyCallbacks.get(dummyElement);
					if (callback) {
						const dummyParent = dom.getParentNode(dummyElement);
						if (!dummyParent || this._changedParents.has(dummyParent)) callback();
					}
				}
			}
			this._changedParents = /* @__PURE__ */ new WeakSet();
		}, _updateDummyInputsTimeout);
	};
	updatePositions(compute) {
		if (!this._win) return;
		this._updateQueue.add(compute);
		this._lastUpdateQueueTime = Date.now();
		this._scheduledUpdatePositions();
	}
	_scheduledUpdatePositions() {
		if (this._updateTimer) return;
		this._updateTimer = this._win?.().setTimeout(() => {
			delete this._updateTimer;
			if (this._lastUpdateQueueTime + _updateDummyInputsTimeout <= Date.now()) {
				const scrollTopLeftCache = /* @__PURE__ */ new Map();
				const setTopLeftCallbacks = [];
				for (const compute of this._updateQueue) setTopLeftCallbacks.push(compute(scrollTopLeftCache));
				this._updateQueue.clear();
				for (const setTopLeft of setTopLeftCallbacks) setTopLeft();
				scrollTopLeftCache.clear();
			} else this._scheduledUpdatePositions();
		}, _updateDummyInputsTimeout);
	}
};
/**
* Parent class that encapsulates the behaviour of dummy inputs (focus sentinels)
*/
var DummyInputManagerCore = class {
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
		if (!el) throw new Error("No element");
		this._tabster = tabster;
		this._getWindow = tabster.getWindow;
		this._callForDefaultAction = callForDefaultAction;
		const instance = el.__tabsterDummy;
		(instance || this)._wrappers.push({
			manager,
			priority,
			tabbable: true
		});
		if (instance) return instance;
		el.__tabsterDummy = this;
		const forcedDummyPosition = sys?.dummyInputsPosition;
		const tagName = el.tagName;
		this._isOutside = !forcedDummyPosition ? (outsideByDefault || tagName === "UL" || tagName === "OL" || tagName === "TABLE") && !(tagName === "LI" || tagName === "TD" || tagName === "TH") : forcedDummyPosition === SysDummyInputsPositions.Outside;
		this._firstDummy = new DummyInput(this._getWindow, this._isOutside, { isFirst: true }, element);
		this._lastDummy = new DummyInput(this._getWindow, this._isOutside, { isFirst: false }, element);
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
		if ((this._wrappers = this._wrappers.filter((w) => w.manager !== manager && !force)).length === 0) {
			delete (this._element?.get()).__tabsterDummy;
			for (const el of this._transformElements) el.removeEventListener("scroll", this._addTransformOffsets);
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
		if (wrapper && (!dummyInput.useDefaultAction || this._callForDefaultAction)) wrapper.manager.getHandler(isIn)?.(dummyInput, isBackward, relatedTarget);
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
				if (toFocus) nativeFocus(toFocus);
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
					if (!first.isOutside && this._tabster.focusable.isFocusable(element, true, true, true)) toFocus = element;
					else {
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
				}))) nativeFocus(toFocus);
			}
		}
	};
	setTabbable = (manager, tabbable) => {
		for (const w of this._wrappers) if (w.manager === manager) {
			w.tabbable = tabbable;
			break;
		}
		const wrapper = this._getCurrent();
		if (wrapper) {
			const tabIndex = wrapper.tabbable ? 0 : -1;
			let input = this._firstDummy?.input;
			if (input) input.tabIndex = tabIndex;
			input = this._lastDummy?.input;
			if (input) input.tabIndex = tabIndex;
		}
	};
	_getCurrent() {
		this._wrappers.sort((a, b) => {
			if (a.tabbable !== b.tabbable) return a.tabbable ? -1 : 1;
			return a.priority - b.priority;
		});
		return this._wrappers[0];
	}
	/**
	* Adds dummy inputs as the first and last child of the given element
	* Called each time the children under the element is mutated
	*/
	_addDummyInputs = () => {
		if (this._addTimer) return;
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
		if (!element || !firstDummyInput || !lastDummyInput) return;
		if (this._isOutside) {
			const elementParent = dom.getParentNode(element);
			if (elementParent) {
				const nextSibling = dom.getNextSibling(element);
				if (nextSibling !== lastDummyInput) dom.insertBefore(elementParent, lastDummyInput, nextSibling);
				if (dom.getPreviousElementSibling(element) !== firstDummyInput) dom.insertBefore(elementParent, firstDummyInput, element);
			}
		} else {
			if (dom.getLastElementChild(element) !== lastDummyInput) dom.appendChild(element, lastDummyInput);
			const firstElementChild = dom.getFirstElementChild(element);
			if (firstElementChild && firstElementChild !== firstDummyInput && firstElementChild.parentNode) dom.insertBefore(firstElementChild.parentNode, firstDummyInput, firstElementChild);
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
				if (transform && transform !== "none") scrollTopLeft = {
					scrollTop: element.scrollTop,
					scrollLeft: element.scrollLeft
				};
				scrollTopLeftCache.set(element, scrollTopLeft || null);
			}
			if (scrollTopLeft) {
				newTransformElements.add(element);
				if (!transformElements.has(element)) element.addEventListener("scroll", this._addTransformOffsets);
				scrollTop += scrollTopLeft.scrollTop;
				scrollLeft += scrollTopLeft.scrollLeft;
			}
		}
		for (const el of transformElements) if (!newTransformElements.has(el)) el.removeEventListener("scroll", this._addTransformOffsets);
		this._transformElements = newTransformElements;
		return () => {
			this._firstDummy?.setTopLeft(scrollTop, scrollLeft);
			this._lastDummy?.setTopLeft(scrollTop, scrollLeft);
		};
	};
};
function getDummyInputContainer(element) {
	return element?.__tabsterDummyContainer?.get() || null;
}
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/AttributeHelpers.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
function getTabsterAttribute(props, plain) {
	const attr = JSON.stringify(props);
	if (plain === true) return attr;
	return { [TABSTER_ATTRIBUTE_NAME]: attr };
}
/**
* Updates Tabster props object with new props.
* @param element an element to set data-tabster attribute on.
* @param props current Tabster props to update.
* @param newProps new Tabster props to add.
*  When the value of a property in newProps is undefined, the property
*  will be removed from the attribute.
*/
function mergeTabsterProps(props, newProps) {
	for (const key of Object.keys(newProps)) {
		const value = newProps[key];
		if (value) props[key] = value;
		else delete props[key];
	}
}
/**
* Sets or updates Tabster attribute of the element.
* @param element an element to set data-tabster attribute on.
* @param newProps new Tabster props to set.
* @param update if true, newProps will be merged with the existing props.
*  When true and the value of a property in newProps is undefined, the property
*  will be removed from the attribute.
*/
function setTabsterAttribute(element, newProps, update) {
	let props;
	if (update) {
		const attr = element.getAttribute(TABSTER_ATTRIBUTE_NAME);
		if (attr) try {
			props = JSON.parse(attr);
		} catch (e) {}
	}
	if (!props) props = {};
	mergeTabsterProps(props, newProps);
	if (Object.keys(props).length > 0) element.setAttribute(TABSTER_ATTRIBUTE_NAME, getTabsterAttribute(props, true));
	else element.removeAttribute(TABSTER_ATTRIBUTE_NAME);
}
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Root.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var RootDummyManager = class extends DummyInputManager {
	_tabster;
	_setFocused;
	constructor(tabster, element, setFocused, sys) {
		super(tabster, element, DummyInputManagerPriorities.Root, sys, void 0, true);
		this._setHandlers(this._onDummyInputFocus);
		this._tabster = tabster;
		this._setFocused = setFocused;
	}
	_onDummyInputFocus = (dummyInput) => {
		if (dummyInput.useDefaultAction) this._setFocused(false);
		else {
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
};
var Root = class extends TabsterPart {
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
		if (tabster.controlTab || tabster.rootDummyInputs) this.addDummyInputs();
		const doc = win().document;
		doc.addEventListener(KEYBORG_FOCUSIN, this._onFocusIn);
		doc.addEventListener(KEYBORG_FOCUSOUT, this._onFocusOut);
		this._add();
	}
	addDummyInputs() {
		if (!this._dummyManager) this._dummyManager = new RootDummyManager(this._tabster, this._element, this._setFocused, this._sys);
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
		if (dummyManager) dummyManager.moveOutWithDefaultAction(isBackward, relatedEvent);
		else {
			const el = this.getElement();
			if (el) RootDummyManager.moveWithPhantomDummy(this._tabster, el, true, isBackward, relatedEvent);
		}
	}
	_setFocused = (hasFocused) => {
		if (this._setFocusedTimer) {
			this._tabster.getWindow().clearTimeout(this._setFocusedTimer);
			delete this._setFocusedTimer;
		}
		if (this._isFocused === hasFocused) return;
		const element = this._element.get();
		if (element) {
			if (hasFocused) {
				this._isFocused = true;
				this._dummyManager?.setTabbable(false);
				element.dispatchEvent(new RootFocusEvent({ element }));
			} else this._setFocusedTimer = this._tabster.getWindow().setTimeout(() => {
				delete this._setFocusedTimer;
				this._isFocused = false;
				this._dummyManager?.setTabbable(true);
				element.dispatchEvent(new RootBlurEvent({ element }));
			}, 0);
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
	_add() {}
	_remove() {}
};
var RootAPI = class {
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
			if (this._autoRoot) this._autoRootCreate();
		});
	}
	_autoRootCreate = () => {
		const doc = this._win().document;
		const body = doc.body;
		if (body) {
			this._autoRootUnwait(doc);
			const props = this._autoRoot;
			if (props) {
				setTabsterAttribute(body, { root: props }, true);
				updateTabsterByAttribute(this._tabster, body);
				return getTabsterOnElement(this._tabster, body)?.root;
			}
		} else if (!this._autoRootWaiting) {
			this._autoRootWaiting = true;
			doc.addEventListener("readystatechange", this._autoRootCreate);
		}
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
		if (this._forceDummy) newRoot.addDummyInputs();
		return newRoot;
	}
	addDummyInputs() {
		this._forceDummy = true;
		const roots = this._roots;
		for (const id of Object.keys(roots)) roots[id].addDummyInputs();
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
		if (!element.ownerDocument) return;
		const { checkRtl, referenceElement } = options;
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
				if (dir) dirRightToLeft = dir.toLowerCase() === "rtl";
			}
			if (!tabsterOnElement) {
				curElement = getParent(curElement);
				continue;
			}
			const tagName = curElement.tagName;
			if ((tabsterOnElement.uncontrolled || tagName === "IFRAME" || tagName === "WEBVIEW") && tabster.focusable.isVisible(curElement)) uncontrolled = curElement;
			if (!mover && tabsterOnElement.focusable?.excludeFromMover && !groupper) excludedFromMover = true;
			const curModalizer = tabsterOnElement.modalizer;
			const curGroupper = tabsterOnElement.groupper;
			const curMover = tabsterOnElement.mover;
			if (!modalizer && curModalizer) modalizer = curModalizer;
			if (!groupper && curGroupper && (!modalizer || curModalizer)) {
				if (modalizer) {
					if (!curGroupper.isActive() && curGroupper.getProps().tabbability && modalizer.userId !== tabster.modalizer?.activeId) {
						modalizer = void 0;
						groupper = curGroupper;
					}
					modalizerInGroupper = curGroupper;
				} else groupper = curGroupper;
			}
			if (!mover && curMover && (!modalizer || curModalizer) && (!curGroupper || curElement !== element) && curElement.contains(element)) {
				mover = curMover;
				groupperBeforeMover = !!groupper && groupper !== curGroupper;
			}
			if (tabsterOnElement.root) root = tabsterOnElement.root;
			if (tabsterOnElement.focusable?.ignoreKeydown) Object.assign(ignoreKeydown, tabsterOnElement.focusable.ignoreKeydown);
			curElement = getParent(curElement);
		}
		if (!root) {
			const rootAPI = tabster.root;
			if (rootAPI._autoRoot) {
				if (element.ownerDocument?.body) root = rootAPI._autoRootCreate();
			}
		}
		if (groupper && !mover) groupperBeforeMover = true;
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
			if (root) return root;
		}
	}
	onRoot(root, removed) {
		if (removed) delete this.rootById[root.uid];
		else this.rootById[root.uid] = root;
	}
	_onRootDispose = (root) => {
		delete this._roots[root.id];
	};
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Focusable.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var FocusableAPI = class {
	_tabster;
	constructor(tabster) {
		this._tabster = tabster;
	}
	dispose() {}
	getProps(element) {
		const tabsterOnElement = getTabsterOnElement(this._tabster, element);
		return tabsterOnElement && tabsterOnElement.focusable || {};
	}
	isFocusable(el, includeProgrammaticallyFocusable, noVisibleCheck, noAccessibleCheck) {
		if (matchesSelector(el, FOCUSABLE_SELECTOR) && (includeProgrammaticallyFocusable || el.tabIndex !== -1)) return (noVisibleCheck || this.isVisible(el)) && (noAccessibleCheck || this.isAccessible(el));
		return false;
	}
	isVisible(el) {
		if (!el.ownerDocument || el.nodeType !== Node.ELEMENT_NODE) return false;
		if (isDisplayNone(el)) return false;
		const rect = el.ownerDocument.body.getBoundingClientRect();
		if (rect.width === 0 && rect.height === 0) return false;
		return true;
	}
	isAccessible(el) {
		for (let e = el; e; e = dom.getParentElement(e)) {
			const tabsterOnElement = getTabsterOnElement(this._tabster, e);
			if (this._isHidden(e)) return false;
			if (!tabsterOnElement?.focusable?.ignoreAriaDisabled && this._isDisabled(e)) return false;
		}
		return true;
	}
	_isDisabled(el) {
		return el.hasAttribute("disabled");
	}
	_isHidden(el) {
		const attrVal = el.getAttribute("aria-hidden");
		if (attrVal && attrVal.toLowerCase() === "true") {
			if (!this._tabster.modalizer?.isAugmented(el)) return true;
		}
		return false;
	}
	findFirst(options, out) {
		return this.findElement({ ...options }, out);
	}
	findLast(options, out) {
		return this.findElement({
			isBackward: true,
			...options
		}, out);
	}
	findNext(options, out) {
		return this.findElement({ ...options }, out);
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
		const { container, currentElement = null, includeProgrammaticallyFocusable, useActiveModalizer, ignoreAccessibility, modalizerId, isBackward, onElement } = options;
		if (!out) out = {};
		const elements = [];
		let { acceptCondition } = options;
		const hasCustomCondition = !!acceptCondition;
		if (!container) return null;
		if (!acceptCondition) acceptCondition = (el) => this.isFocusable(el, includeProgrammaticallyFocusable, false, ignoreAccessibility);
		const acceptElementState = {
			container,
			modalizerUserId: modalizerId === void 0 && useActiveModalizer ? this._tabster.modalizer?.activeId : modalizerId || RootAPI.getTabsterContext(this._tabster, container)?.modalizer?.userId,
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
		if (!walker) return null;
		const prepareForNextElement = (shouldContinueIfNotFound) => {
			const foundElement = acceptElementState.foundElement ?? acceptElementState.foundBackward;
			if (foundElement) elements.push(foundElement);
			if (isFindAll) {
				if (foundElement) {
					acceptElementState.found = false;
					delete acceptElementState.foundElement;
					delete acceptElementState.foundBackward;
					delete acceptElementState.fromCtx;
					acceptElementState.from = foundElement;
					if (onElement && !onElement(foundElement)) return false;
				}
				return !!(foundElement || shouldContinueIfNotFound);
			} else {
				if (foundElement && out) out.uncontrolled = RootAPI.getTabsterContext(this._tabster, foundElement)?.uncontrolled;
				return !!(shouldContinueIfNotFound && !foundElement);
			}
		};
		if (!currentElement) out.outOfDOMOrder = true;
		if (currentElement && dom.nodeContains(container, currentElement)) walker.currentNode = currentElement;
		else if (isBackward) {
			const lastChild = getLastChild(container);
			if (!lastChild) return null;
			if (this._acceptElement(lastChild, acceptElementState) === NodeFilter.FILTER_ACCEPT && !prepareForNextElement(true)) {
				if (acceptElementState.skippedFocusable) out.outOfDOMOrder = true;
				return elements;
			}
			walker.currentNode = lastChild;
		}
		do
			if (isBackward) walker.previousNode();
			else walker.nextNode();
		while (prepareForNextElement());
		if (acceptElementState.skippedFocusable) out.outOfDOMOrder = true;
		return elements.length ? elements : null;
	}
	_acceptElement(element, state) {
		if (state.found) return NodeFilter.FILTER_ACCEPT;
		const foundBackward = state.foundBackward;
		if (foundBackward && (element === foundBackward || !dom.nodeContains(foundBackward, element))) {
			state.found = true;
			state.foundElement = foundBackward;
			return NodeFilter.FILTER_ACCEPT;
		}
		const container = state.container;
		if (element === container) return NodeFilter.FILTER_SKIP;
		if (!dom.nodeContains(container, element)) return NodeFilter.FILTER_REJECT;
		if (getDummyInputContainer(element)) return NodeFilter.FILTER_REJECT;
		if (dom.nodeContains(state.rejectElementsFrom, element)) return NodeFilter.FILTER_REJECT;
		const ctx = state.currentCtx = RootAPI.getTabsterContext(this._tabster, element);
		if (!ctx) return NodeFilter.FILTER_SKIP;
		if (shouldIgnoreFocus(element)) {
			if (this.isFocusable(element, void 0, true, true)) state.skippedFocusable = true;
			return NodeFilter.FILTER_SKIP;
		}
		if (!state.hasCustomCondition && (element.tagName === "IFRAME" || element.tagName === "WEBVIEW")) {
			if (this.isVisible(element) && ctx.modalizer?.userId === this._tabster.modalizer?.activeId) {
				state.found = true;
				state.rejectElementsFrom = state.foundElement = element;
				return NodeFilter.FILTER_ACCEPT;
			} else return NodeFilter.FILTER_REJECT;
		}
		if (!state.ignoreAccessibility && !this.isAccessible(element)) {
			if (this.isFocusable(element, false, true, true)) state.skippedFocusable = true;
			return NodeFilter.FILTER_REJECT;
		}
		let result;
		let fromCtx = state.fromCtx;
		if (!fromCtx) fromCtx = state.fromCtx = RootAPI.getTabsterContext(this._tabster, state.from);
		const fromMover = fromCtx?.mover;
		let groupper = ctx.groupper;
		let mover = ctx.mover;
		result = this._tabster.modalizer?.acceptElement(element, state);
		if (result !== void 0) state.skippedFocusable = true;
		if (result === void 0 && (groupper || mover || fromMover)) {
			const groupperElement = groupper?.getElement();
			const fromMoverElement = fromMover?.getElement();
			let moverElement = mover?.getElement();
			if (moverElement && dom.nodeContains(fromMoverElement, moverElement) && dom.nodeContains(container, fromMoverElement) && (!groupperElement || !mover || dom.nodeContains(fromMoverElement, groupperElement))) {
				mover = fromMover;
				moverElement = fromMoverElement;
			}
			if (groupperElement) {
				if (groupperElement === container || !dom.nodeContains(container, groupperElement)) groupper = void 0;
				else if (!dom.nodeContains(groupperElement, element)) return NodeFilter.FILTER_REJECT;
			}
			if (moverElement) {
				if (!dom.nodeContains(container, moverElement)) mover = void 0;
				else if (!dom.nodeContains(moverElement, element)) return NodeFilter.FILTER_REJECT;
			}
			if (groupper && mover) {
				if (moverElement && groupperElement && !dom.nodeContains(groupperElement, moverElement)) mover = void 0;
				else groupper = void 0;
			}
			if (groupper) result = groupper.acceptElement(element, state);
			if (mover) result = mover.acceptElement(element, state);
		}
		if (result === void 0) {
			result = state.acceptCondition(element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
			if (result === NodeFilter.FILTER_SKIP && this.isFocusable(element, false, true, true)) state.skippedFocusable = true;
		}
		if (result === NodeFilter.FILTER_ACCEPT && !state.found) {
			if (!state.isFindAll && isRadio(element) && !element.checked) {
				const radioGroupName = element.name;
				let radioGroup = state.cachedRadioGroups[radioGroupName];
				if (!radioGroup) {
					radioGroup = getRadioButtonGroup(element);
					if (radioGroup) state.cachedRadioGroups[radioGroupName] = radioGroup;
				}
				if (radioGroup?.checked && radioGroup.checked !== element) return NodeFilter.FILTER_SKIP;
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
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Keys.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var Keys = {
	Tab: "Tab",
	Enter: "Enter",
	Escape: "Escape",
	Space: " ",
	PageUp: "PageUp",
	PageDown: "PageDown",
	End: "End",
	Home: "Home",
	ArrowLeft: "ArrowLeft",
	ArrowUp: "ArrowUp",
	ArrowRight: "ArrowRight",
	ArrowDown: "ArrowDown"
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/State/Subscribable.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var Subscribable = class {
	_val;
	_callbacks = [];
	dispose() {
		this._callbacks = [];
		delete this._val;
	}
	subscribe(callback) {
		const callbacks = this._callbacks;
		if (callbacks.indexOf(callback) < 0) callbacks.push(callback);
	}
	subscribeFirst(callback) {
		const callbacks = this._callbacks;
		const index = callbacks.indexOf(callback);
		if (index >= 0) callbacks.splice(index, 1);
		callbacks.unshift(callback);
	}
	unsubscribe(callback) {
		const index = this._callbacks.indexOf(callback);
		if (index >= 0) this._callbacks.splice(index, 1);
	}
	setVal(val, detail) {
		if (this._val === val) return;
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
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/State/FocusedElement.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
function getUncontrolledCompletelyContainer(tabster, element) {
	const getParent = tabster.getParent;
	let el = element;
	do {
		const uncontrolledOnElement = getTabsterOnElement(tabster, el)?.uncontrolled;
		if (uncontrolledOnElement && tabster.uncontrolled.isUncontrolledCompletely(el, !!uncontrolledOnElement.completely)) return el;
		el = getParent(el);
	} while (el);
}
var AsyncFocusIntentPriorityBySource = {
	[AsyncFocusSources.Restorer]: 0,
	[AsyncFocusSources.Deloser]: 1,
	[AsyncFocusSources.EscapeGroupper]: 2
};
var FocusedElementState = class FocusedElementState extends Subscribable {
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
		doc.addEventListener(KEYBORG_FOCUSIN, this._onFocusIn, true);
		doc.addEventListener(KEYBORG_FOCUSOUT, this._onFocusOut, true);
		win.addEventListener("keydown", this._onKeyDown, true);
		const activeElement = dom.getActiveElement(doc);
		if (activeElement && activeElement !== doc.body) this._setFocusedElement(activeElement);
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
		if (el && dom.nodeContains(parent, el)) delete FocusedElementState._lastResetElement;
		el = instance._nextVal?.element?.get();
		if (el && dom.nodeContains(parent, el)) delete instance._nextVal;
		wel = instance._lastVal;
		el = wel && wel.get();
		if (el && dom.nodeContains(parent, el)) delete instance._lastVal;
	}
	getFocusedElement() {
		return this.getVal();
	}
	getLastFocusedElement() {
		let el = this._lastVal?.get();
		if (!el || el && !documentContains(el.ownerDocument, el)) this._lastVal = el = void 0;
		return el;
	}
	focus(element, noFocusedProgrammaticallyFlag, noAccessibleCheck, preventScroll) {
		if (!this._tabster.focusable.isFocusable(element, noFocusedProgrammaticallyFlag, false, noAccessibleCheck)) return false;
		element.focus({ preventScroll });
		return true;
	}
	focusDefault(container) {
		const el = this._tabster.focusable.findDefault({ container });
		if (el) {
			this._tabster.focusedElement.focus(el);
			return true;
		}
		return false;
	}
	getFirstOrLastTabbable(isFirst, props) {
		const { container, ignoreAccessibility } = props;
		let toFocus;
		if (container) {
			const ctx = RootAPI.getTabsterContext(this._tabster, container);
			if (ctx) toFocus = FocusedElementState.findNextTabbable(this._tabster, ctx, container, void 0, void 0, !isFirst, ignoreAccessibility)?.element;
		}
		if (toFocus && !dom.nodeContains(container, toFocus)) toFocus = void 0;
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
		if (!this._tabster.focusable.isVisible(container)) return false;
		if (!this._tabster.focusable.isFocusable(container, true, true, true)) {
			const prevTabIndex = container.getAttribute("tabindex");
			const prevAriaHidden = container.getAttribute("aria-hidden");
			container.tabIndex = -1;
			container.setAttribute("aria-hidden", "true");
			FocusedElementState._lastResetElement = new WeakHTMLElement(container);
			this.focus(container, true, true);
			this._setOrRemoveAttribute(container, "tabindex", prevTabIndex);
			this._setOrRemoveAttribute(container, "aria-hidden", prevAriaHidden);
		} else this.focus(container);
		return true;
	}
	requestAsyncFocus(source, callback, delay) {
		const win = this._tabster.getWindow();
		const currentAsyncFocus = this._asyncFocus;
		if (currentAsyncFocus) {
			if (AsyncFocusIntentPriorityBySource[source] > AsyncFocusIntentPriorityBySource[currentAsyncFocus.source]) return;
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
		if (asyncFocus?.source === source) {
			this._tabster.getWindow().clearTimeout(asyncFocus.timeout);
			this._asyncFocus = void 0;
		}
	}
	_setOrRemoveAttribute(element, name, value) {
		if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
	}
	_setFocusedElement(element, relatedTarget, isFocusedProgrammatically) {
		if (this._tabster._noop) return;
		const detail = { relatedTarget };
		if (element) {
			const lastResetElement = FocusedElementState._lastResetElement?.get();
			FocusedElementState._lastResetElement = void 0;
			if (lastResetElement === element || shouldIgnoreFocus(element)) return;
			detail.isFocusedProgrammatically = isFocusedProgrammatically;
			const modalizerId = RootAPI.getTabsterContext(this._tabster, element)?.modalizer?.userId;
			if (modalizerId) detail.modalizerId = modalizerId;
		}
		const nextVal = this._nextVal = {
			element: element ? new WeakHTMLElement(element) : void 0,
			detail
		};
		if (element && element !== this._val) this._validateFocusedElement(element);
		if (this._nextVal === nextVal) this.setVal(element, detail);
		this._nextVal = void 0;
	}
	setVal(val, detail) {
		super.setVal(val, detail);
		if (val) this._lastVal = new WeakHTMLElement(val);
	}
	_onFocusIn = (e) => {
		const target = e.composedPath()[0];
		if (target) this._setFocusedElement(target, e.detail.relatedTarget, e.detail.isFocusedProgrammatically);
	};
	_onFocusOut = (e) => {
		this._setFocusedElement(void 0, e.detail?.originalEvent.relatedTarget);
	};
	static findNextTabbable(tabster, ctx, container, currentElement, referenceElement, isBackward, ignoreAccessibility) {
		const actualContainer = container || ctx.root.getElement();
		if (!actualContainer) return null;
		let next = null;
		const isTabbingTimer = FocusedElementState._isTabbingTimer;
		const win = tabster.getWindow();
		if (isTabbingTimer) win.clearTimeout(isTabbingTimer);
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
			if (currentElement && !next?.element) {
				const parentElement = what !== modalizer && dom.getParentElement(what.getElement());
				if (parentElement) {
					const parentCtx = RootAPI.getTabsterContext(tabster, currentElement, { referenceElement: parentElement });
					if (parentCtx) {
						const currentScopeElement = what.getElement();
						const newCurrent = isBackward ? currentScopeElement : currentScopeElement && getLastChild(currentScopeElement) || currentScopeElement;
						if (newCurrent) {
							next = FocusedElementState.findNextTabbable(tabster, parentCtx, container, newCurrent, parentElement, isBackward, ignoreAccessibility);
							if (next) next.outOfDOMOrder = true;
						}
					}
				}
			}
		};
		if (groupper && mover) callFindNext(ctx.groupperBeforeMover ? groupper : mover);
		else if (groupper) callFindNext(groupper);
		else if (mover) callFindNext(mover);
		else if (modalizer) callFindNext(modalizer);
		else {
			const findProps = {
				container: actualContainer,
				currentElement,
				referenceElement,
				ignoreAccessibility,
				useActiveModalizer: true
			};
			const findPropsOut = {};
			next = {
				element: tabster.focusable[isBackward ? "findPrev" : "findNext"](findProps, findPropsOut),
				outOfDOMOrder: findPropsOut.outOfDOMOrder,
				uncontrolled: findPropsOut.uncontrolled
			};
		}
		return next;
	}
	_validateFocusedElement = (element) => {};
	_onKeyDown = (event) => {
		if (event.key !== Keys.Tab || event.ctrlKey) return;
		const currentElement = this.getVal();
		if (!currentElement || !currentElement.ownerDocument || currentElement.contentEditable === "true") return;
		const tabster = this._tabster;
		const controlTab = tabster.controlTab;
		const ctx = RootAPI.getTabsterContext(tabster, currentElement);
		if (!ctx || ctx.ignoreKeydown(event)) return;
		const isBackward = event.shiftKey;
		const next = FocusedElementState.findNextTabbable(tabster, ctx, void 0, currentElement, void 0, isBackward, true);
		const rootElement = ctx.root.getElement();
		if (!rootElement) return;
		const nextElement = next?.element;
		const uncontrolledCompletelyContainer = getUncontrolledCompletelyContainer(tabster, currentElement);
		if (nextElement) {
			const nextUncontrolled = next.uncontrolled;
			if (ctx.uncontrolled || dom.nodeContains(nextUncontrolled, currentElement)) {
				if (!next.outOfDOMOrder && nextUncontrolled === ctx.uncontrolled || uncontrolledCompletelyContainer && !dom.nodeContains(uncontrolledCompletelyContainer, nextElement)) return;
				DummyInputManager.addPhantomDummyWithTarget(tabster, currentElement, isBackward, nextElement);
				return;
			}
			if (nextUncontrolled && tabster.focusable.isVisible(nextUncontrolled) || nextElement.tagName === "IFRAME" && tabster.focusable.isVisible(nextElement)) {
				if (rootElement.dispatchEvent(new TabsterMoveFocusEvent({
					by: "root",
					owner: rootElement,
					next: nextElement,
					relatedEvent: event
				}))) DummyInputManager.moveWithPhantomDummy(tabster, nextUncontrolled ?? nextElement, false, isBackward, event);
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
		} else if (!uncontrolledCompletelyContainer && rootElement.dispatchEvent(new TabsterMoveFocusEvent({
			by: "root",
			owner: rootElement,
			next: null,
			relatedEvent: event
		}))) ctx.root.moveOutWithDefaultAction(isBackward, event);
	};
	_onChanged = (element, detail) => {
		if (element) element.dispatchEvent(new TabsterFocusInEvent(detail));
		else {
			const last = this._lastVal?.get();
			if (last) {
				const d = { ...detail };
				const modalizerId = RootAPI.getTabsterContext(this._tabster, last)?.modalizer?.userId;
				if (modalizerId) d.modalizerId = modalizerId;
				last.dispatchEvent(new TabsterFocusOutEvent(d));
			}
		}
	};
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/State/KeyboardNavigation.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var KeyboardNavigationState = class extends Subscribable {
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
	_onChange = (isNavigatingWithKeyboard) => {
		this.setVal(isNavigatingWithKeyboard, void 0);
	};
	setNavigatingWithKeyboard(isNavigatingWithKeyboard) {
		this._keyborg?.setVal(isNavigatingWithKeyboard);
	}
	isNavigatingWithKeyboard() {
		return !!this._keyborg?.isNavigatingWithKeyboard();
	}
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/MutationEvent.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
function observeMutations(doc, tabster, updateTabsterByAttribute, syncState) {
	if (typeof MutationObserver === "undefined") return () => {};
	const getWindow = tabster.getWindow;
	let elementByUId;
	const onMutation = (mutations) => {
		const removedNodes = /* @__PURE__ */ new Set();
		for (const mutation of mutations) {
			const target = mutation.target;
			const removed = mutation.removedNodes;
			const added = mutation.addedNodes;
			if (mutation.type === "attributes") {
				if (mutation.attributeName === "data-tabster") {
					if (!removedNodes.has(target)) updateTabsterByAttribute(tabster, target);
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
		if (!elementByUId) elementByUId = getInstanceContext(getWindow).elementByUId;
		processNode(node, removed);
		const walker = createElementTreeWalker(doc, node, (element) => {
			return processNode(element, removed);
		});
		if (walker) while (walker.nextNode());
	}
	function processNode(element, removed) {
		if (!element.getAttribute) return NodeFilter.FILTER_SKIP;
		const uid = element.__tabsterElementUID;
		if (uid && elementByUId) {
			if (removed) delete elementByUId[uid];
			else elementByUId[uid] ??= new WeakHTMLElement(element);
		}
		if (getTabsterOnElement(tabster, element) || element.hasAttribute("data-tabster")) updateTabsterByAttribute(tabster, element, removed);
		return NodeFilter.FILTER_SKIP;
	}
	const observer = dom.createMutationObserver(onMutation);
	if (syncState) updateTabsterElements(getWindow().document.body);
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
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Uncontrolled.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
/**
* Allows default or user focus behaviour on the DOM subtree
* i.e. Tabster will not control focus events within an uncontrolled area
*/
var UncontrolledAPI = class {
	_isUncontrolledCompletely;
	constructor(isUncontrolledCompletely) {
		this._isUncontrolledCompletely = isUncontrolledCompletely;
	}
	isUncontrolledCompletely(element, completely) {
		const isUncontrolledCompletely = this._isUncontrolledCompletely?.(element, completely);
		return isUncontrolledCompletely === void 0 ? completely : isUncontrolledCompletely;
	}
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Deloser.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var _containerHistoryLength = 10;
var DeloserItemBase = class {};
var DeloserItem = class extends DeloserItemBase {
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
			}))) return null;
			return this._tabster.focusedElement.focus(available);
		}
		return false;
	}
	async resetFocus() {
		return Promise.resolve(this._deloser.resetFocus());
	}
};
var DeloserHistoryByRootBase = class {
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
};
var DeloserHistoryByRoot = class extends DeloserHistoryByRootBase {
	unshiftToDeloser(deloser, element) {
		let item;
		for (let i = 0; i < this._history.length; i++) if (this._history[i].belongsTo(deloser)) {
			item = this._history[i];
			this._history.splice(i, 1);
			break;
		}
		if (!item) item = new DeloserItem(this._tabster, deloser);
		item.unshift(element);
		this._history.unshift(item);
		this._history.splice(_containerHistoryLength, this._history.length - _containerHistoryLength);
	}
	async focusAvailable(from) {
		let skip = !!from;
		for (const i of this._history) {
			if (from && i.belongsTo(from)) skip = false;
			if (!skip) {
				const result = await i.focusAvailable();
				if (result || result === null) return result;
			}
		}
		return false;
	}
	async resetFocus(from) {
		let skip = !!from;
		const resetQueue = {};
		for (const i of this._history) {
			if (from && i.belongsTo(from)) skip = false;
			if (!skip && !resetQueue[i.uid]) resetQueue[i.uid] = i;
		}
		for (const id of Object.keys(resetQueue)) if (await resetQueue[id].resetFocus()) return true;
		return false;
	}
};
var DeloserHistory = class {
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
		if (!rootUId || !deloser) return;
		const historyByRoot = this.make(rootUId, () => new DeloserHistoryByRoot(this._tabster, rootUId));
		if (!ctx || !ctx.modalizer || ctx.modalizer?.isActive()) historyByRoot.unshiftToDeloser(deloser, element);
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
		if (!historyByRoot) historyByRoot = createInstance();
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
			if (from && h.hasDeloser(from)) skip = false;
			if (!skip) {
				const result = await h.focusAvailable(from);
				if (result || result === null) return result;
			}
		}
		return false;
	}
	async resetFocus(from) {
		let skip = !!from;
		for (const h of this._history) {
			if (from && h.hasDeloser(from)) skip = false;
			if (!skip && await h.resetFocus(from)) return true;
		}
		return false;
	}
};
function buildElementSelector(element, withClass, withIndex) {
	const selector = [];
	const escapeRegExp = /(:|\.|\[|\]|,|=|@)/g;
	const escapeReplaceValue = "\\$1";
	const elementId = element.getAttribute("id");
	if (elementId) selector.push("#" + elementId.replace(escapeRegExp, escapeReplaceValue));
	if (withClass !== false && element.className) element.className.split(" ").forEach((cls) => {
		cls = cls.trim();
		if (cls) selector.push("." + cls.replace(escapeRegExp, escapeReplaceValue));
	});
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
	if (!documentContains(element.ownerDocument, element)) return;
	const selector = [buildElementSelector(element)];
	let node = dom.getParentNode(element);
	while (node && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const isBody = node.tagName === "BODY";
			selector.unshift(buildElementSelector(node, false, !isBody));
			if (isBody) break;
		}
		node = dom.getParentNode(node);
	}
	return selector.join(" ");
}
var Deloser = class extends TabsterPart {
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
		if (this._history.length > index + 1) this._history.splice(index + 1, this._history.length - index - 1);
		if (!this._history[index]) this._history[index] = [];
	};
	focusFirst = () => {
		const e = this._element.get();
		return !!e && this._tabster.focusedElement.focusFirst({ container: e });
	};
	unshift(element) {
		let cur = this._history[this._snapshotIndex];
		cur = this._history[this._snapshotIndex] = cur.filter((we) => {
			const e = we.get();
			return e && e !== element;
		});
		cur.unshift(new WeakHTMLElement(element, buildSelector(element)));
		while (cur.length > _containerHistoryLength) cur.pop();
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
		if (!element || !this._tabster.focusable.isVisible(element)) return null;
		let restoreFocusOrder = this._props.restoreFocusOrder;
		let available = null;
		const ctx = RootAPI.getTabsterContext(this._tabster, element);
		if (!ctx) return null;
		const root = ctx.root;
		const rootElement = root.getElement();
		if (!rootElement) return null;
		if (restoreFocusOrder === void 0) restoreFocusOrder = root.getProps().restoreFocusOrder;
		if (restoreFocusOrder === RestoreFocusOrders.RootDefault) available = this._tabster.focusable.findDefault({ container: rootElement });
		if (!available && restoreFocusOrder === RestoreFocusOrders.RootFirst) available = this._findFirst(rootElement);
		if (available) return available;
		const availableInHistory = this._findInHistory();
		if (availableInHistory && restoreFocusOrder === RestoreFocusOrders.History) return availableInHistory;
		const availableDefault = this._tabster.focusable.findDefault({ container: element });
		if (availableDefault && restoreFocusOrder === RestoreFocusOrders.DeloserDefault) return availableDefault;
		const availableFirst = this._findFirst(element);
		if (availableFirst && restoreFocusOrder === RestoreFocusOrders.DeloserFirst) return availableFirst;
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
				if (this._tabster.focusable.isFocusable(e)) return e;
			} else if (!this._props.noSelectorCheck) {
				const selector = we.getData();
				if (selector && element) {
					let els;
					try {
						els = dom.querySelectorAll(element.ownerDocument, selector);
					} catch (e) {
						continue;
					}
					for (let i = 0; i < els.length; i++) {
						const el = els[i];
						if (el && this._tabster.focusable.isFocusable(el)) return el;
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
			if (first) return first;
		}
		return null;
	}
	_remove() {}
};
var DeloserAPI = class DeloserAPI {
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
			if (activeElement && activeElement !== doc.body) this._onFocus(activeElement);
		});
		const autoDeloser = props?.autoDeloser;
		if (autoDeloser) this._autoDeloser = autoDeloser;
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
		if (dom.nodeContains(element, this._tabster.focusedElement.getFocusedElement() ?? null)) this._activate(deloser);
		return deloser;
	}
	getActions(element) {
		for (let e = element; e; e = dom.getParentElement(e)) {
			const tabsterOnElement = getTabsterOnElement(this._tabster, e);
			if (tabsterOnElement && tabsterOnElement.deloser) return tabsterOnElement.deloser.getActions();
		}
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
		if (restore) this._scheduleRestoreFocus();
	}
	_onRestoreFocus = (event) => {
		const target = event.composedPath()[0];
		if (target) {
			const available = DeloserAPI.getDeloser(this._tabster, target)?.findAvailable();
			if (available) this._tabster.focusedElement.focus(available);
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
		if (deloser) this._activate(deloser);
		else this._deactivate();
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
		if (this._isPaused || this._isRestoringFocus) return;
		const restoreFocus = async () => {
			this._restoreFocusTimer = void 0;
			const lastFocused = this._tabster.focusedElement.getLastFocusedElement();
			if (!force && (this._isRestoringFocus || !this._inDeloser || lastFocused && !isDisplayNone(lastFocused))) return;
			const curDeloser = this._curDeloser;
			let isManual = false;
			if (curDeloser) {
				if (lastFocused && curDeloser.customFocusLostHandler(lastFocused)) return;
				if (curDeloser.strategy === DeloserStrategies.Manual) isManual = true;
				else {
					const curDeloserElement = curDeloser.getElement();
					const el = curDeloser.findAvailable();
					if (el && (!curDeloserElement?.dispatchEvent(new TabsterMoveFocusEvent({
						by: "deloser",
						owner: curDeloserElement,
						next: el
					})) || this._tabster.focusedElement.focus(el))) return;
				}
			}
			this._deactivate();
			if (isManual) return;
			this._isRestoringFocus = true;
			if (await this._history.focusAvailable(null) === false) await this._history.resetFocus(null);
			this._isRestoringFocus = false;
		};
		if (force) restoreFocus();
		else this._restoreFocusTimer = this._win().setTimeout(restoreFocus, 100);
	}
	static getDeloser(tabster, element) {
		let root;
		for (let e = element; e; e = dom.getParentElement(e)) {
			const tabsterOnElement = getTabsterOnElement(tabster, e);
			if (tabsterOnElement) {
				if (!root) root = tabsterOnElement.root;
				const deloser = tabsterOnElement.deloser;
				if (deloser) return deloser;
			}
		}
		const deloserAPI = tabster.deloser && tabster.deloser;
		if (deloserAPI) {
			if (deloserAPI._autoDeloserInstance) return deloserAPI._autoDeloserInstance;
			const autoDeloserProps = deloserAPI._autoDeloser;
			if (root && !deloserAPI._autoDeloserInstance && autoDeloserProps) {
				const body = element.ownerDocument?.body;
				if (body) deloserAPI._autoDeloserInstance = new Deloser(tabster, body, tabster.deloser._onDeloserDispose, autoDeloserProps);
			}
			return deloserAPI._autoDeloserInstance;
		}
	}
	_onDeloserDispose = (deloser) => {
		this._history.removeDeloser(deloser);
		if (deloser.isActive()) this._scheduleRestoreFocus();
	};
	static getHistory(instance) {
		return instance._history;
	}
	static forceRestoreFocus(instance) {
		instance._scheduleRestoreFocus(true);
	}
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/get/getDeloser.js
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
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Mover.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var _inputSelector = [
	"input",
	"textarea",
	"*[contenteditable]"
].join(", ");
var MoverDummyManager = class extends DummyInputManager {
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
			if (ctx) toFocus = FocusedElementState.findNextTabbable(this._tabster, ctx, void 0, input, void 0, !dummyInput.isFirst, true)?.element;
			const memorized = this._getMemorized()?.get();
			if (memorized && this._tabster.focusable.isFocusable(memorized)) toFocus = memorized;
			if (toFocus) nativeFocus(toFocus);
		}
	};
};
var _moverUpdateAdd = 1;
var _moverUpdateAttr = 2;
var _moverUpdateRemove = 3;
var Mover = class extends TabsterPart {
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
		this.visibilityTolerance = props.visibilityTolerance ?? .8;
		if (this._props.trackState || this._props.visibilityAware) {
			this._intersectionObserver = new IntersectionObserver(this._onIntersection, { threshold: [
				0,
				.25,
				.5,
				.75,
				1
			] });
			this._observeState();
		}
		this._onDispose = onDispose;
		const getMemorized = () => props.memorizeCurrent ? this._current : void 0;
		if (!tabster.controlTab) this.dummyManager = new MoverDummyManager(this._element, tabster, getMemorized, sys);
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
		if (element) this._current = new WeakHTMLElement(element);
		else this._current = void 0;
		if ((this._props.trackState || this._props.visibilityAware) && !this._setCurrentTimer) this._setCurrentTimer = this._win().setTimeout(() => {
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
						if (state) el.dispatchEvent(new MoverStateEvent(state));
					}
				}
			}
		});
	}
	getCurrent() {
		return this._current?.get() || null;
	}
	findNextTabbable(currentElement, referenceElement, isBackward, ignoreAccessibility) {
		const container = this.getElement();
		const currentIsDummy = container && getDummyInputContainer(currentElement) === container;
		if (!container) return null;
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
		if (!FocusedElementState.isTabbing) return state.currentCtx?.excludedFromMover ? NodeFilter.FILTER_REJECT : void 0;
		const { memorizeCurrent, visibilityAware, hasDefault = true } = this._props;
		const moverElement = this.getElement();
		if (moverElement && (memorizeCurrent || visibilityAware || hasDefault) && (!dom.nodeContains(moverElement, state.from) || getDummyInputContainer(state.from) === moverElement)) {
			let found;
			if (memorizeCurrent) {
				const current = this._current?.get();
				if (current && state.acceptCondition(current)) found = current;
			}
			if (!found && hasDefault) found = this._tabster.focusable.findDefault({
				container: moverElement,
				useActiveModalizer: true
			});
			if (!found && visibilityAware) found = this._tabster.focusable.findElement({
				container: moverElement,
				useActiveModalizer: true,
				isBackward: state.isBackward,
				acceptCondition: (el) => {
					const id = getElementUId(this._win, el);
					const visibility = this._visible[id];
					return moverElement !== el && !!this._allElements?.get(el) && state.acceptCondition(el) && (visibility === Visibilities.Visible || visibility === Visibilities.PartiallyVisible && (visibilityAware === Visibilities.PartiallyVisible || !this._fullyVisible));
				}
			});
			if (found) {
				state.found = true;
				state.foundElement = found;
				state.rejectElementsFrom = moverElement;
				state.skippedFocusable = true;
				return NodeFilter.FILTER_ACCEPT;
			}
		}
	}
	_onIntersection = (entries) => {
		for (const entry of entries) {
			const el = entry.target;
			const id = getElementUId(this._win, el);
			let newVisibility;
			let fullyVisible = this._fullyVisible;
			if (entry.intersectionRatio >= .25) {
				newVisibility = entry.intersectionRatio >= .75 ? Visibilities.Visible : Visibilities.PartiallyVisible;
				if (newVisibility === Visibilities.Visible) fullyVisible = id;
			} else newVisibility = Visibilities.Invisible;
			if (this._visible[id] !== newVisibility) {
				if (newVisibility === void 0) {
					delete this._visible[id];
					if (fullyVisible === id) delete this._fullyVisible;
				} else {
					this._visible[id] = newVisibility;
					this._fullyVisible = fullyVisible;
				}
				const state = this.getState(el);
				if (state) el.dispatchEvent(new MoverStateEvent(state));
			}
		}
	};
	_observeState() {
		const element = this.getElement();
		if (this._unobserve || !element || typeof MutationObserver === "undefined") return;
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
					if (mutation.attributeName === "tabindex") updateQueue.push({
						element: target,
						type: _moverUpdateAttr
					});
				} else {
					for (let i = 0; i < removed.length; i++) updateQueue.push({
						element: removed[i],
						type: _moverUpdateRemove
					});
					for (let i = 0; i < added.length; i++) updateQueue.push({
						element: added[i],
						type: _moverUpdateAdd
					});
				}
			}
			requestUpdate();
		});
		const setElement = (element, remove) => {
			const current = allElements.get(element);
			if (current && remove) {
				this._intersectionObserver?.unobserve(element);
				allElements.delete(element);
			}
			if (!current && !remove) {
				allElements.set(element, this);
				this._intersectionObserver?.observe(element);
			}
		};
		const updateElement = (element) => {
			const isFocusable = tabsterFocusable.isFocusable(element);
			if (allElements.get(element)) {
				if (!isFocusable) setElement(element, true);
			} else if (isFocusable) setElement(element);
		};
		const addNewElements = (element) => {
			const { mover } = getMoverGroupper(element);
			if (mover && mover !== this) {
				if (mover.getElement() === element && tabsterFocusable.isFocusable(element)) setElement(element);
				else return;
			}
			const walker = createElementTreeWalker(win.document, element, (node) => {
				const { mover, groupper } = getMoverGroupper(node);
				if (mover && mover !== this) return NodeFilter.FILTER_REJECT;
				const groupperFirstFocusable = groupper?.getFirst(true);
				if (groupper && groupper.getElement() !== node && groupperFirstFocusable && groupperFirstFocusable !== node) return NodeFilter.FILTER_REJECT;
				if (tabsterFocusable.isFocusable(node)) setElement(node);
				return NodeFilter.FILTER_SKIP;
			});
			if (walker) {
				walker.currentNode = element;
				while (walker.nextNode());
			}
		};
		const removeWalk = (element) => {
			if (allElements.get(element)) setElement(element, true);
			for (let el = dom.getFirstElementChild(element); el; el = dom.getNextElementSibling(el)) removeWalk(el);
		};
		const requestUpdate = () => {
			if (!this._updateTimer && updateQueue.length) this._updateTimer = win.setTimeout(() => {
				delete this._updateTimer;
				for (const { element, type } of updateQueue) switch (type) {
					case _moverUpdateAttr:
						updateElement(element);
						break;
					case _moverUpdateAdd:
						addNewElements(element);
						break;
					case _moverUpdateRemove: removeWalk(element);
				}
				updateQueue = this._updateQueue = [];
			}, 0);
		};
		const getMoverGroupper = (element) => {
			const ret = {};
			for (let el = element; el; el = dom.getParentElement(el)) {
				const toe = getTabsterOnElement(this._tabster, el);
				if (toe) {
					if (toe.groupper && !ret.groupper) ret.groupper = toe.groupper;
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
			return {
				isCurrent: this._current ? this._current.get() === element : void 0,
				visibility
			};
		}
	}
};
/**
* Calculates distance between two rectangles.
*
* @param ax1 first rectangle left
* @param ay1 first rectangle top
* @param ax2 first rectangle right
* @param ay2 first rectangle bottom
* @param bx1 second rectangle left
* @param by1 second rectangle top
* @param bx2 second rectangle right
* @param by2 second rectangle bottom
* @returns number, shortest distance between the rectangles.
*/
function getDistance(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
	const xDistance = ax2 < bx1 ? bx1 - ax2 : bx2 < ax1 ? ax1 - bx2 : 0;
	const yDistance = ay2 < by1 ? by1 - ay2 : by2 < ay1 ? ay1 - by2 : 0;
	return xDistance === 0 ? yDistance : yDistance === 0 ? xDistance : Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}
var MoverAPI = class {
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
			if (!currentFocusableElement && this._tabster.focusable.isFocusable(el)) currentFocusableElement = deepestFocusableElement = el;
		}
	};
	moveFocus(fromElement, key) {
		return this._moveFocus(fromElement, key);
	}
	_moveFocus(fromElement, key, relatedEvent) {
		const tabster = this._tabster;
		const ctx = RootAPI.getTabsterContext(tabster, fromElement, { checkRtl: true });
		if (!ctx || !ctx.mover || ctx.excludedFromMover || relatedEvent && ctx.ignoreKeydown(relatedEvent)) return null;
		const mover = ctx.mover;
		const container = mover.getElement();
		if (ctx.groupperBeforeMover) {
			const groupper = ctx.groupper;
			if (groupper && !groupper.isActive(true)) {
				for (let el = dom.getParentElement(groupper.getElement()); el && el !== container; el = dom.getParentElement(el)) if (getTabsterOnElement(tabster, el)?.groupper?.isActive(true)) return null;
			} else return null;
		}
		if (!container) return null;
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
			if (key === MoverKeys.ArrowRight) key = MoverKeys.ArrowLeft;
			else if (key === MoverKeys.ArrowLeft) key = MoverKeys.ArrowRight;
		}
		if (key === MoverKeys.ArrowDown && isVertical || key === MoverKeys.ArrowRight && (isHorizontal || isGrid)) {
			next = focusable.findNext({
				currentElement: fromElement,
				container,
				useActiveModalizer: true
			});
			if (next && isGrid) {
				const nextElementX1 = Math.ceil(next.getBoundingClientRect().left);
				if (!isGridLinear && focusedElementX2 > nextElementX1) next = void 0;
			} else if (!next && isCyclic) next = focusable.findFirst({
				container,
				useActiveModalizer: true
			});
		} else if (key === MoverKeys.ArrowUp && isVertical || key === MoverKeys.ArrowLeft && (isHorizontal || isGrid)) {
			next = focusable.findPrev({
				currentElement: fromElement,
				container,
				useActiveModalizer: true
			});
			if (next && isGrid) {
				const nextElementX2 = Math.floor(next.getBoundingClientRect().right);
				if (!isGridLinear && nextElementX2 > focusedElementX1) next = void 0;
			} else if (!next && isCyclic) next = focusable.findLast({
				container,
				useActiveModalizer: true
			});
		} else if (key === MoverKeys.Home) {
			if (isGrid) focusable.findElement({
				container,
				currentElement: fromElement,
				useActiveModalizer: true,
				isBackward: true,
				acceptCondition: (el) => {
					if (!focusable.isFocusable(el)) return false;
					const nextElementX1 = Math.ceil(el.getBoundingClientRect().left ?? 0);
					if (el !== fromElement && focusedElementX1 <= nextElementX1) return true;
					next = el;
					return false;
				}
			});
			else next = focusable.findFirst({
				container,
				useActiveModalizer: true
			});
		} else if (key === MoverKeys.End) {
			if (isGrid) focusable.findElement({
				container,
				currentElement: fromElement,
				useActiveModalizer: true,
				acceptCondition: (el) => {
					if (!focusable.isFocusable(el)) return false;
					const nextElementX1 = Math.ceil(el.getBoundingClientRect().left ?? 0);
					if (el !== fromElement && focusedElementX1 >= nextElementX1) return true;
					next = el;
					return false;
				}
			});
			else next = focusable.findLast({
				container,
				useActiveModalizer: true
			});
		} else if (key === MoverKeys.PageUp) {
			focusable.findElement({
				currentElement: fromElement,
				container,
				useActiveModalizer: true,
				isBackward: true,
				acceptCondition: (el) => {
					if (!focusable.isFocusable(el)) return false;
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
						if (!focusable.isFocusable(el)) return false;
						const nextElementX1 = Math.ceil(el.getBoundingClientRect().left);
						if (focusedElementX1 < nextElementX1 || firstColumnX1 >= nextElementX1) return true;
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
					if (!focusable.isFocusable(el)) return false;
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
						if (!focusable.isFocusable(el)) return false;
						const nextElementX1 = Math.ceil(el.getBoundingClientRect().left);
						if (focusedElementX1 > nextElementX1 || lastColumnX1 <= nextElementX1) return true;
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
					if (isBackward && ay1 < by2 || !isBackward && ay2 > by1) return true;
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
					} else if (lastIntersection > 0) return false;
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
			if (scrollIntoViewArg !== void 0) scrollIntoView(this._win, next, scrollIntoViewArg);
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
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
		const key = event.key;
		let moverKey;
		if (key === Keys.ArrowDown) moverKey = MoverKeys.ArrowDown;
		else if (key === Keys.ArrowRight) moverKey = MoverKeys.ArrowRight;
		else if (key === Keys.ArrowUp) moverKey = MoverKeys.ArrowUp;
		else if (key === Keys.ArrowLeft) moverKey = MoverKeys.ArrowLeft;
		else if (key === Keys.PageDown) moverKey = MoverKeys.PageDown;
		else if (key === Keys.PageUp) moverKey = MoverKeys.PageUp;
		else if (key === Keys.Home) moverKey = MoverKeys.Home;
		else if (key === Keys.End) moverKey = MoverKeys.End;
		if (!moverKey) return;
		const focused = this._tabster.focusedElement.getFocusedElement();
		if (!focused || await this._isIgnoredInput(focused, key)) return;
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
			const mover = RootAPI.getTabsterContext(this._tabster, target)?.mover;
			if (mover) {
				if (memorizedElement && !dom.nodeContains(mover.getElement(), memorizedElement)) memorizedElement = void 0;
				mover.setCurrent(memorizedElement);
				e.stopImmediatePropagation();
			}
		}
	};
	async _isIgnoredInput(element, key) {
		if (element.getAttribute("aria-expanded") === "true" && (element.hasAttribute("aria-activedescendant") || element.getAttribute("role") === "combobox")) return true;
		if (matchesSelector(element, _inputSelector)) {
			let selectionStart = 0;
			let selectionEnd = 0;
			let textLength = 0;
			let asyncRet;
			if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
				const type = element.type;
				textLength = (element.value || "").length;
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
							} else textLength = 0;
						}
					}
				} else {
					const selStart = element.selectionStart;
					if (selStart === null) return type === "hidden";
					selectionStart = selStart || 0;
					selectionEnd = element.selectionEnd || 0;
				}
			} else if (element.contentEditable === "true") asyncRet = new Promise((resolve) => {
				this._ignoredInputResolve = (value) => {
					delete this._ignoredInputResolve;
					resolve(value);
				};
				const win = this._win();
				if (this._ignoredInputTimer) win.clearTimeout(this._ignoredInputTimer);
				const { anchorNode: prevAnchorNode, focusNode: prevFocusNode, anchorOffset: prevAnchorOffset, focusOffset: prevFocusOffset } = dom.getSelection(element) || {};
				this._ignoredInputTimer = win.setTimeout(() => {
					delete this._ignoredInputTimer;
					const { anchorNode, focusNode, anchorOffset, focusOffset } = dom.getSelection(element) || {};
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
									if (node === anchorNode) anchorFound = true;
									else if (node === focusNode) return true;
									const nodeText = node.textContent;
									if (nodeText && !dom.getFirstChild(node)) {
										const len = nodeText.length;
										if (anchorFound) {
											if (focusNode !== anchorNode) selectionEnd += len;
										} else {
											selectionStart += len;
											selectionEnd += len;
										}
									}
									let stop = false;
									for (let e = dom.getFirstChild(node); e && !stop; e = e.nextSibling) stop = addOffsets(e);
									return stop;
								};
								addOffsets(element);
							}
						}
					}
					this._ignoredInputResolve?.(true);
				}, 0);
			});
			if (asyncRet && !await asyncRet) return true;
			if (selectionStart !== selectionEnd) return true;
			if (selectionStart > 0 && (key === Keys.ArrowLeft || key === Keys.ArrowUp || key === Keys.Home)) return true;
			if (selectionStart < textLength && (key === Keys.ArrowRight || key === Keys.ArrowDown || key === Keys.End)) return true;
		}
		return false;
	}
};
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/get/getMover.js
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
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/Tabster.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var Tabster = class {
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
};
/**
* Extends Window to include an internal Tabster instance.
*/
var TabsterCore = class {
	_storage;
	_unobserve;
	_win;
	_forgetMemorizedTimer;
	_forgetMemorizedElements = [];
	_wrappers = /* @__PURE__ */ new Set();
	_initTimer;
	_initQueue = [];
	_version = "8.8.0";
	_noop = false;
	controlTab;
	rootDummyInputs;
	attrHandlers = /* @__PURE__ */ new Map();
	keyboardNavigation;
	focusedElement;
	focusable;
	root;
	uncontrolled;
	internal;
	_dummyObserver;
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
		this._storage = /* @__PURE__ */ new WeakMap();
		this._win = win;
		const getWindow = this.getWindow;
		if (props?.DOMAPI) setDOMAPI({ ...props.DOMAPI });
		this.keyboardNavigation = new KeyboardNavigationState(getWindow);
		this.focusedElement = new FocusedElementState(this, getWindow);
		this.focusable = new FocusableAPI(this);
		this.root = new RootAPI(this, props?.autoRoot);
		this.uncontrolled = new UncontrolledAPI(props?.checkUncontrolledCompletely || props?.checkUncontrolledTrappingFocus);
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
			resumeObserver: (syncState) => {
				if (!this._unobserve) {
					const doc = getWindow().document;
					this._unobserve = observeMutations(doc, this, updateTabsterByAttribute, syncState);
				}
			}
		};
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
		if (!props) return;
		this.getParent = props.getParent ?? this.getParent;
	}
	createTabster(noRefCount, props) {
		const wrapper = new Tabster(this);
		if (!noRefCount) this._wrappers.add(wrapper);
		this._mergeProps(props);
		return wrapper;
	}
	disposeTabster(wrapper, allInstances) {
		if (allInstances) this._wrappers.clear();
		else this._wrappers.delete(wrapper);
		if (this._wrappers.size === 0) this.dispose();
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
		this.attrHandlers.clear();
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
			if (addremove === false && Object.keys(entry).length === 0) storage.delete(element);
		} else if (addremove === true) {
			entry = {};
			storage.set(element, entry);
		}
		return entry;
	}
	getWindow = () => {
		if (!this._win) throw new Error("Using disposed Tabster.");
		return this._win;
	};
	forceCleanup() {
		if (!this._win) return;
		this._forgetMemorizedElements.push(this._win.document.body);
		if (this._forgetMemorizedTimer) return;
		this._forgetMemorizedTimer = this._win.setTimeout(() => {
			delete this._forgetMemorizedTimer;
			for (let el = this._forgetMemorizedElements.shift(); el; el = this._forgetMemorizedElements.shift()) {
				clearElementCache(this.getWindow, el);
				FocusedElementState.forgetMemorized(this.focusedElement, el);
			}
		}, 0);
	}
	queueInit(callback) {
		if (!this._win) return;
		this._initQueue.push(callback);
		if (!this._initTimer) this._initTimer = this._win?.setTimeout(() => {
			delete this._initTimer;
			this.drainInitQueue();
		}, 0);
	}
	drainInitQueue() {
		if (!this._win) return;
		const queue = this._initQueue;
		this._initQueue = [];
		queue.forEach((callback) => callback());
	}
};
/**
* Creates an instance of Tabster, returns the current window instance if it already exists.
*/
function createTabster(win, props) {
	let tabster = getCurrentTabster(win);
	if (tabster) return tabster.createTabster(false, props);
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
//#endregion
//#region ../node_modules/.pnpm/tabster@8.8.0/node_modules/tabster/dist/esm/index.js
/*!
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
//#endregion
export { FOCUSABLE_SELECTOR as A, TabsterFocusInEventName as C, TabsterMoveFocusEventName as D, TabsterMoveFocusEvent as E, TABSTER_ATTRIBUTE_NAME as F, TABSTER_DUMMY_INPUT_ATTRIBUTE_NAME as I, Visibilities as L, MoverKeys as M, RestoreFocusOrders as N, AsyncFocusSources as O, SysDummyInputsPositions as P, TabsterFocusInEvent as S, TabsterFocusOutEventName as T, RootBlurEvent as _, getDeloser as a, RootFocusEventName as b, setTabsterAttribute as c, DeloserFocusLostEventName as d, DeloserRestoreFocusEventName as f, MoverStateEventName as g, MoverStateEvent as h, getMover as i, MoverDirections as j, DeloserStrategies as k, getDummyInputContainer as l, MoverMoveFocusEventName as m, disposeTabster as n, getTabsterAttribute as o, MoverMemorizedElementEventName as p, getTabster as r, mergeTabsterProps as s, createTabster as t, DeloserFocusLostEvent as u, RootBlurEventName as v, TabsterFocusOutEvent as w, TabsterCustomEvent as x, RootFocusEvent as y };
