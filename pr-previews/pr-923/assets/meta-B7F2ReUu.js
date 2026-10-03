//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/meta/lib/meta.js
var objectPrototype = Object.prototype;
var counters;
/**
@module ember
*/
var UNDEFINED = Symbol("undefined");
var ListenerKind = /*#__PURE__*/ function(ListenerKind) {
	ListenerKind[ListenerKind["ADD"] = 0] = "ADD";
	ListenerKind[ListenerKind["ONCE"] = 1] = "ONCE";
	ListenerKind[ListenerKind["REMOVE"] = 2] = "REMOVE";
	return ListenerKind;
}(ListenerKind || {});
var currentListenerVersion = 1;
var Meta = class {
	/** @internal */
	_descriptors;
	/** @internal */
	_mixins;
	/** @internal */
	_isInit;
	/** @internal */
	_lazyChains;
	/** @internal */
	_values;
	/** @internal */
	_revisions;
	/** @internal */
	source;
	/** @internal */
	proto;
	/** @internal */
	_parent;
	/** @internal */
	_listeners;
	/** @internal */
	_listenersVersion = 1;
	/** @internal */
	_inheritedEnd = -1;
	/** @internal */
	_flattenedVersion = 0;
	/** @internal */
	constructor(obj) {
		this._parent = void 0;
		this._descriptors = void 0;
		this._mixins = void 0;
		this._lazyChains = void 0;
		this._values = void 0;
		this._revisions = void 0;
		this._isInit = false;
		this.source = obj;
		this.proto = obj.constructor === void 0 ? void 0 : obj.constructor.prototype;
		this._listeners = void 0;
	}
	/** @internal */
	get parent() {
		let parent = this._parent;
		if (parent === void 0) {
			let proto = getPrototypeOf(this.source);
			this._parent = parent = proto === null || proto === objectPrototype ? null : meta(proto);
		}
		return parent;
	}
	setInitializing() {
		this._isInit = true;
	}
	/** @internal */
	unsetInitializing() {
		this._isInit = false;
	}
	/** @internal */
	isInitializing() {
		return this._isInit;
	}
	/** @internal */
	isPrototypeMeta(obj) {
		return this.proto === this.source && this.source === obj;
	}
	/** @internal */
	_getOrCreateOwnMap(key) {
		return this[key] || (this[key] = Object.create(null));
	}
	/** @internal */
	_getOrCreateOwnSet(key) {
		return this[key] || (this[key] = /* @__PURE__ */ new Set());
	}
	/** @internal */
	_findInheritedMap(key, subkey) {
		let pointer = this;
		while (pointer !== null) {
			let map = pointer[key];
			if (map !== void 0) {
				let value = map.get(subkey);
				if (value !== void 0) return value;
			}
			pointer = pointer.parent;
		}
	}
	/** @internal */
	_hasInInheritedSet(key, value) {
		let pointer = this;
		while (pointer !== null) {
			let set = pointer[key];
			if (set !== void 0 && set.has(value)) return true;
			pointer = pointer.parent;
		}
		return false;
	}
	/** @internal */
	valueFor(key) {
		let values = this._values;
		return values !== void 0 ? values[key] : void 0;
	}
	/** @internal */
	setValueFor(key, value) {
		let values = this._getOrCreateOwnMap("_values");
		values[key] = value;
	}
	/** @internal */
	revisionFor(key) {
		let revisions = this._revisions;
		return revisions !== void 0 ? revisions[key] : void 0;
	}
	/** @internal */
	setRevisionFor(key, revision) {
		let revisions = this._getOrCreateOwnMap("_revisions");
		revisions[key] = revision;
	}
	/** @internal */
	writableLazyChainsFor(key) {
		let lazyChains = this._getOrCreateOwnMap("_lazyChains");
		let chains = lazyChains[key];
		if (chains === void 0) chains = lazyChains[key] = [];
		return chains;
	}
	/** @internal */
	readableLazyChainsFor(key) {
		let lazyChains = this._lazyChains;
		if (lazyChains !== void 0) return lazyChains[key];
	}
	/** @internal */
	addMixin(mixin) {
		this._getOrCreateOwnSet("_mixins").add(mixin);
	}
	/** @internal */
	hasMixin(mixin) {
		return this._hasInInheritedSet("_mixins", mixin);
	}
	/** @internal */
	forEachMixins(fn) {
		let pointer = this;
		let seen;
		while (pointer !== null) {
			let set = pointer._mixins;
			if (set !== void 0) {
				seen = seen === void 0 ? /* @__PURE__ */ new Set() : seen;
				set.forEach((mixin) => {
					if (!seen.has(mixin)) {
						seen.add(mixin);
						fn(mixin);
					}
				});
			}
			pointer = pointer.parent;
		}
	}
	/** @internal */
	writeDescriptors(subkey, value) {
		(this._descriptors || (this._descriptors = /* @__PURE__ */ new Map())).set(subkey, value);
	}
	/** @internal */
	peekDescriptors(subkey) {
		let possibleDesc = this._findInheritedMap("_descriptors", subkey);
		return possibleDesc === UNDEFINED ? void 0 : possibleDesc;
	}
	/** @internal */
	removeDescriptors(subkey) {
		this.writeDescriptors(subkey, UNDEFINED);
	}
	/** @internal */
	forEachDescriptors(fn) {
		let pointer = this;
		let seen;
		while (pointer !== null) {
			let map = pointer._descriptors;
			if (map !== void 0) {
				seen = seen === void 0 ? /* @__PURE__ */ new Set() : seen;
				map.forEach((value, key) => {
					if (!seen.has(key)) {
						seen.add(key);
						if (value !== UNDEFINED) fn(key, value);
					}
				});
			}
			pointer = pointer.parent;
		}
	}
	/** @internal */
	addToListeners(eventName, target, method, once, sync) {
		this.pushListener(eventName, target, method, once ? ListenerKind.ONCE : ListenerKind.ADD, sync);
	}
	/** @internal */
	removeFromListeners(eventName, target, method) {
		this.pushListener(eventName, target, method, ListenerKind.REMOVE);
	}
	pushListener(event, target, method, kind, sync = false) {
		let listeners = this.writableListeners();
		let i = indexOfListener(listeners, event, target, method);
		if (i !== -1 && i < this._inheritedEnd) {
			listeners.splice(i, 1);
			this._inheritedEnd--;
			i = -1;
		}
		if (i === -1) listeners.push({
			event,
			target,
			method,
			kind,
			sync
		});
		else {
			let listener = listeners[i];
			if (kind === ListenerKind.REMOVE && listener.kind !== ListenerKind.REMOVE) listeners.splice(i, 1);
			else {
				listener.kind = kind;
				listener.sync = sync;
			}
		}
	}
	writableListeners() {
		if (this._flattenedVersion === currentListenerVersion && (this.source === this.proto || this._inheritedEnd === -1)) currentListenerVersion++;
		if (this._inheritedEnd === -1) {
			this._inheritedEnd = 0;
			this._listeners = [];
		}
		return this._listeners;
	}
	/**
	Flattening is based on a global revision counter. If the revision has
	bumped it means that somewhere in a class inheritance chain something has
	changed, so we need to reflatten everything. This can only happen if:
	1. A meta has been flattened (listener has been called)
	2. The meta is a prototype meta with children who have inherited its
	listeners
	3. A new listener is subsequently added to the meta (e.g. via `.reopen()`)
	This is a very rare occurrence, so while the counter is global it shouldn't
	be updated very often in practice.
	*/
	flattenedListeners() {
		if (this._flattenedVersion < currentListenerVersion) {
			let parent = this.parent;
			if (parent !== null) {
				let parentListeners = parent.flattenedListeners();
				if (parentListeners !== void 0) {
					if (this._listeners === void 0) this._listeners = parentListeners;
					else {
						let listeners = this._listeners;
						if (this._inheritedEnd > 0) {
							listeners.splice(0, this._inheritedEnd);
							this._inheritedEnd = 0;
						}
						for (let listener of parentListeners) if (indexOfListener(listeners, listener.event, listener.target, listener.method) === -1) {
							listeners.unshift(listener);
							this._inheritedEnd++;
						}
					}
				}
			}
			this._flattenedVersion = currentListenerVersion;
		}
		return this._listeners;
	}
	/** @internal */
	matchingListeners(eventName) {
		let listeners = this.flattenedListeners();
		let result;
		if (listeners !== void 0) {
			for (let listener of listeners) if (listener.event === eventName && (listener.kind === ListenerKind.ADD || listener.kind === ListenerKind.ONCE)) {
				if (result === void 0) result = [];
				result.push(listener.target, listener.method, listener.kind === ListenerKind.ONCE);
			}
		}
		return result;
	}
	/** @internal */
	observerEvents() {
		let listeners = this.flattenedListeners();
		let result;
		if (listeners !== void 0) {
			for (let listener of listeners) if ((listener.kind === ListenerKind.ADD || listener.kind === ListenerKind.ONCE) && listener.event.indexOf(":change") !== -1) {
				if (result === void 0) result = [];
				result.push(listener);
			}
		}
		return result;
	}
};
var getPrototypeOf = Object.getPrototypeOf;
var metaStore = /* @__PURE__ */ new WeakMap();
function setMeta(obj, meta) {
	metaStore.set(obj, meta);
}
function peekMeta(obj) {
	let meta = metaStore.get(obj);
	if (meta !== void 0) return meta;
	let pointer = getPrototypeOf(obj);
	while (pointer !== null) {
		meta = metaStore.get(pointer);
		if (meta !== void 0) {
			if (meta.proto !== pointer) meta.proto = pointer;
			return meta;
		}
		pointer = getPrototypeOf(pointer);
	}
	return null;
}
/**
Retrieves the meta hash for an object. If `writable` is true ensures the
hash is writable for this object as well.

The meta object contains information about computed property descriptors as
well as any watched properties and other information. You generally will
not access this information directly but instead work with higher level
methods that manipulate this hash indirectly.

@method meta
@for Ember
@private

@param {Object} obj The object to retrieve meta for
@param {Boolean} [writable=true] Pass `false` if you do not intend to modify
the meta hash, allowing the method to avoid making an unnecessary copy.
@return {Object} the meta hash for an object
*/
var meta = function meta(obj) {
	let maybeMeta = peekMeta(obj);
	if (maybeMeta !== null && maybeMeta.source === obj) return maybeMeta;
	let newMeta = new Meta(obj);
	setMeta(obj, newMeta);
	return newMeta;
};
function indexOfListener(listeners, event, target, method) {
	for (let i = listeners.length - 1; i >= 0; i--) {
		let listener = listeners[i];
		if (listener.event === event && listener.target === target && listener.method === method) return i;
	}
	return -1;
}
//#endregion
export { peekMeta as a, meta as i, UNDEFINED as n, setMeta as o, counters as r, Meta as t };
