import { U as get, W as hasUnknownProperty } from "./core-D-L0f59Y.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/utils/lib/is_empty.js
/**
@module @ember/utils
*/
/**
Verifies that a value is `null` or `undefined`, an empty string, or an empty
array.

Constrains the rules on `isNone` by returning true for empty strings and
empty arrays.

If the value is an object with a `size` property of type number, it is used
to check emptiness.

```javascript
isEmpty(null);             // true
isEmpty(undefined);        // true
isEmpty('');               // true
isEmpty([]);               // true
isEmpty({ size: 0});       // true
isEmpty({});               // false
isEmpty('Adam Hawkins');   // false
isEmpty([0,1,2]);          // false
isEmpty('\n\t');           // false
isEmpty('  ');             // false
isEmpty({ size: 1 })       // false
isEmpty({ size: () => 0 }) // false
```

@method isEmpty
@static
@for @ember/utils
@param {Object} obj Value to test
@return {Boolean}
@public
*/
function isEmpty(obj) {
	if (obj === null || obj === void 0) return true;
	if (!hasUnknownProperty(obj) && typeof obj.size === "number") return !obj.size;
	if (typeof obj === "object") {
		let size = get(obj, "size");
		if (typeof size === "number") return !size;
		let length = get(obj, "length");
		if (typeof length === "number") return !length;
	}
	if (typeof obj.length === "number" && typeof obj !== "function") return !obj.length;
	return false;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/utils/lib/is_none.js
/**
@module @ember/utils
*/
/**
Returns true if the passed value is null or undefined. This avoids errors
from JSLint complaining about use of ==, which can be technically
confusing.

```javascript
isNone(null);          // true
isNone(undefined);     // true
isNone('');            // false
isNone([]);            // false
isNone(function() {}); // false
```

@method isNone
@static
@for @ember/utils
@param {Object} obj Value to test
@return {Boolean}
@public
*/
function isNone(obj) {
	return obj === null || obj === void 0;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/utils/lib/is_blank.js
/**
@module @ember/utils
*/
/**
A value is blank if it is empty or a whitespace string.

```javascript
import { isBlank } from '@ember/utils';

isBlank(null);            // true
isBlank(undefined);       // true
isBlank('');              // true
isBlank([]);              // true
isBlank('\n\t');          // true
isBlank('  ');            // true
isBlank({});              // false
isBlank('\n\t Hello');    // false
isBlank('Hello world');   // false
isBlank([1,2,3]);         // false
```

@method isBlank
@static
@for @ember/utils
@param {Object} obj Value to test
@return {Boolean}
@since 1.5.0
@public
*/
function isBlank(obj) {
	return isEmpty(obj) || typeof obj === "string" && /\S/.test(obj) === false;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/utils/lib/is_present.js
/**
@module @ember/utils
*/
/**
A value is present if it not `isBlank`.

```javascript
isPresent(null);            // false
isPresent(undefined);       // false
isPresent('');              // false
isPresent('  ');            // false
isPresent('\n\t');          // false
isPresent([]);              // false
isPresent({ length: 0 });   // false
isPresent(false);           // true
isPresent(true);            // true
isPresent('string');        // true
isPresent(0);               // true
isPresent(function() {});   // true
isPresent({});              // true
isPresent('\n\t Hello');    // true
isPresent([1, 2, 3]);       // true
```

@method isPresent
@static
@for @ember/utils
@param {Object} obj Value to test
@return {Boolean}
@since 1.8.0
@public
*/
function isPresent(obj) {
	return !isBlank(obj);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/utils/lib/is-equal.js
/**
@module @ember/utils
*/
/**
Compares two objects, returning true if they are equal.

```javascript
import { isEqual } from '@ember/utils';

isEqual('hello', 'hello');                   // true
isEqual(1, 2);                               // false
```

`isEqual` is a more specific comparison than a triple equal comparison.
It will call the `isEqual` instance method on the objects being
compared, allowing finer control over when objects should be considered
equal to each other.

```javascript
import { isEqual } from '@ember/utils';
import EmberObject from '@ember/object';

class Person extends EmberObject {
isEqual(other: Person) { return this.ssn == other.ssn; }
}

let personA = Person.create({name: 'Muhammad Ali', ssn: '123-45-6789'});
let personB = Person.create({name: 'Cassius Clay', ssn: '123-45-6789'});

isEqual(personA, personB); // true
```

Due to the expense of array comparisons, collections will never be equal to
each other even if each of their items are equal to each other.

```javascript
import { isEqual } from '@ember/utils';

isEqual([4, 2], [4, 2]);                     // false
```

@method isEqual
@for @ember/utils
@static
@param {Object} a first object to compare
@param {Object} b second object to compare
@return {Boolean}
@public
*/
function isEqual(a, b) {
	if (a && typeof a.isEqual === "function") return a.isEqual(b);
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
	return a === b;
}
//#endregion
export { isEmpty as a, isNone as i, isPresent as n, isBlank as r, isEqual as t };
