import { t as isEmberArray } from "./-internals-CsfECqDC.js";
import { t as typeOf } from "./type-of-ClAdfYwH.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/array/lib/is-array.js
/**
@module @ember/array
*/
/**
Returns true if the passed object is an array or Array-like.

Objects are considered Array-like if any of the following are true:

- the object is a native Array
- the object has an objectAt property
- the object is an Object, and has a length property

Unlike `typeOf` this method returns true even if the passed object is
not formally an array but appears to be array-like (i.e. implements `Array`)

```javascript
import { isArray } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

isArray();                                      // false
isArray([]);                                    // true
isArray(ArrayProxy.create({ content: [] }));    // true
```

@method isArray
@static
@for @ember/array
@param {Object} obj The object to test
@return {Boolean} true if the passed object is an array or Array-like
@public
*/
function isArray(obj) {
	if (!obj || obj.setInterval) return false;
	if (Array.isArray(obj) || isEmberArray(obj)) return true;
	let type = typeOf(obj);
	if ("array" === type) return true;
	let length = obj.length;
	if (typeof length === "number" && length === length && "object" === type) return true;
	return false;
}
//#endregion
export { isArray as t };
