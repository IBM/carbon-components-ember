import { Z as isBlank } from './main-B8rrDxlx.js';
export { $ as compare, a0 as isEmpty, a1 as typeOf } from './main-B8rrDxlx.js';
export { i as isEqual } from './is-equal-B1TBpw9u.js';

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
  return obj === null || obj === undefined;
}

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

export { isBlank, isNone, isPresent };
