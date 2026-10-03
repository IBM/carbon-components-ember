import { G as isPath, V as _getPath, z as notifyPropertyChange } from "./core-D-L0f59Y.js";
import { t as COMPUTED_SETTERS } from "./decorator-9ikVwsjY-DzA4qI2N.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/lookup-descriptor-CwcVgaLv.js
function lookupDescriptor(obj, keyName) {
	let current = obj;
	do {
		let descriptor = Object.getOwnPropertyDescriptor(current, keyName);
		if (descriptor !== void 0) return descriptor;
		current = Object.getPrototypeOf(current);
	} while (current !== null);
	return null;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/property_set-BmAQ0MGK.js
/**
@module @ember/object
*/
/**
Sets the value of a property on an object, respecting computed properties
and notifying observers and other listeners of the change.
If the specified property is not defined on the object and the object
implements the `setUnknownProperty` method, then instead of setting the
value of the property on the object, its `setUnknownProperty` handler
will be invoked with the two parameters `keyName` and `value`.

```javascript
import { set } from '@ember/object';
set(obj, "name", value);
```

@method set
@static
@for @ember/object
@param {Object} obj The object to modify.
@param {String} keyName The property key to set
@param {Object} value The value to set
@return {Object} the passed value.
@public
*/
function set(obj, keyName, value, tolerant) {
	if (obj.isDestroyed) return value;
	return isPath(keyName) ? _setPath(obj, keyName, value, tolerant) : _setProp(obj, keyName, value);
}
function _setProp(obj, keyName, value) {
	let descriptor = lookupDescriptor(obj, keyName);
	if (descriptor !== null && COMPUTED_SETTERS.has(descriptor.set)) {
		obj[keyName] = value;
		return value;
	}
	let currentValue;
	currentValue = obj[keyName];
	if (currentValue === void 0 && "object" === typeof obj && !(keyName in obj) && typeof obj.setUnknownProperty === "function") obj.setUnknownProperty(keyName, value);
	else {
		obj[keyName] = value;
		if (currentValue !== value) notifyPropertyChange(obj, keyName);
	}
	return value;
}
function _setPath(root, path, value, tolerant) {
	let parts = path.split(".");
	let keyName = parts.pop();
	let newRoot = _getPath(root, parts, true);
	if (newRoot !== null && newRoot !== void 0) return set(newRoot, keyName, value);
	else if (!tolerant) throw new Error(`Property set failed: object in path "${parts.join(".")}" could not be found.`);
}
/**
Error-tolerant form of `set`. Will not blow up if any part of the
chain is `undefined`, `null`, or destroyed.

This is primarily used when syncing bindings, which may try to update after
an object has been destroyed.

```javascript
import { trySet } from '@ember/object';

let obj = { name: "Zoey" };
trySet(obj, "contacts.twitter", "@emberjs");
```

@method trySet
@static
@for @ember/object
@param {Object} root The object to modify.
@param {String} path The property path to set
@param {Object} value The value to set
@public
*/
function trySet(root, path, value) {
	return set(root, path, value, true);
}
//#endregion
export { lookupDescriptor as i, set as n, trySet as r, _setProp as t };
