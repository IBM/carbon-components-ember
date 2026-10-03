import { t as typeOf } from "./type-of-ClAdfYwH.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/utils/lib/compare.js
var TYPE_ORDER = {
	undefined: 0,
	null: 1,
	boolean: 2,
	number: 3,
	string: 4,
	array: 5,
	object: 6,
	instance: 7,
	function: 8,
	class: 9,
	date: 10,
	regexp: 11,
	filelist: 12,
	error: 13
};
function spaceship(a, b) {
	return Math.sign(a - b);
}
/**
@module @ember/utils
*/
/**
Compares two javascript values and returns:

- -1 if the first is smaller than the second,
- 0 if both are equal,
- 1 if the first is greater than the second.

```javascript
import { compare } from '@ember/utils';

compare('hello', 'hello');  // 0
compare('abc', 'dfg');      // -1
compare(2, 1);              // 1
```

If the types of the two objects are different precedence occurs in the
following order, with types earlier in the list considered `<` types
later in the list:

- undefined
- null
- boolean
- number
- string
- array
- object
- instance
- function
- class
- date

```javascript
import { compare } from '@ember/utils';

compare('hello', 50);       // 1
compare(50, 'hello');       // -1
```

@method compare
@for @ember/utils
@static
@param {Object} v First value to compare
@param {Object} w Second value to compare
@return {Number} -1 if v < w, 0 if v = w and 1 if v > w.
@public
*/
function compare(v, w) {
	if (v === w) return 0;
	let type1 = typeOf(v);
	let type2 = typeOf(w);
	if (type1 === "instance" && isComparable(v) && v.constructor.compare) return v.constructor.compare(v, w);
	if (type2 === "instance" && isComparable(w) && w.constructor.compare) return w.constructor.compare(w, v) * -1;
	let res = spaceship(TYPE_ORDER[type1], TYPE_ORDER[type2]);
	if (res !== 0) return res;
	switch (type1) {
		case "boolean": return spaceship(Number(v), Number(w));
		case "number": return spaceship(v, w);
		case "string": return spaceship(v.localeCompare(w), 0);
		case "array": {
			let vLen = v.length;
			let wLen = w.length;
			let len = Math.min(vLen, wLen);
			for (let i = 0; i < len; i++) {
				let r = compare(v[i], w[i]);
				if (r !== 0) return r;
			}
			return spaceship(vLen, wLen);
		}
		case "instance":
			if (isComparable(v) && v.compare) return v.compare(v, w);
			return 0;
		case "date": return spaceship(v.getTime(), w.getTime());
		default: return 0;
	}
}
function isComparable(value) {
	if (typeof value !== "object" || value === null) return false;
	let maybeComparable = value;
	return typeof maybeComparable.constructor?.compare === "function" || typeof maybeComparable.compare === "function";
}
//#endregion
export { compare as t };
