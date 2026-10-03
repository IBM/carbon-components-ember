//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/index-D-xTBV4B.js
/**
@module @ember/template
*/
/**
A wrapper around a string that has been marked as "trusted". **When
rendered in HTML, Ember will not perform any escaping.**

Note:

1. This does not *make* the string safe; it means that some code in your
application has *marked* it as trusted using the `trustHTML()` function.

2. The only public API for getting a `TrustedHTML` is calling `trustHTML()`. It
is *not* user-constructible.

If a string contains user inputs or other untrusted data, you must sanitize
the string before using the `trustHTML` method. Otherwise your code is
vulnerable to [Cross-Site Scripting][xss]. There are many open source
sanitization libraries to choose from, both for front end and server-side
sanitization.

[xss]: https://owasp.org/www-community/attacks/DOM_Based_XSS

```javascript
import { trustHTML } from '@ember/template';

let someTrustedOrSanitizedString = "<div>Hello!</div>"

trustHTML(someTrustedorSanitizedString);
```

@for @ember/template
@class TrustedHTML
@since 6.7.0
@public
*/
var TrustedHTML = class {
	__string;
	constructor(string) {
		this.__string = string;
	}
	/**
	Get the string back to use as a string.
	@public
	@method toString
	@returns {String} The string marked as trusted
	*/
	toString() {
		return `${this.__string}`;
	}
	/**
	Get the wrapped string as HTML to use without escaping.
	@public
	@method toHTML
	@returns {String} the trusted string, without any escaping applied
	*/
	toHTML() {
		return this.toString();
	}
};
/**
A wrapper around a string that has been marked as safe ("trusted"). **When
rendered in HTML, Ember will not perform any escaping.**

Note:

1. This does not *make* the string safe; it means that some code in your
application has *marked* it as safe using the `htmlSafe()` function.

2. The only public API for getting a `SafeString` is calling `htmlSafe()`. It
is *not* user-constructible.

If a string contains user inputs or other untrusted data, you must sanitize
the string before using the `htmlSafe` method. Otherwise your code is
vulnerable to [Cross-Site Scripting][xss]. There are many open source
sanitization libraries to choose from, both for front end and server-side
sanitization.

[xss]: https://owasp.org/www-community/attacks/DOM_Based_XSS

```javascript
import { htmlSafe } from '@ember/template';

let someTrustedOrSanitizedString = "<div>Hello!</div>"

htmlSafe(someTrustedorSanitizedString);
```

@for @ember/template
@class SafeString
@since 4.12.0
@public
*/
var SafeString = TrustedHTML;
/**
Use this method to indicate that a string should be rendered as HTML
when the string is used in a template. To say this another way,
strings marked with `htmlSafe` will not be HTML escaped.

A word of warning -   The `htmlSafe` method does not make the string safe;
it only tells the framework to treat the string as if it is safe to render
as HTML. If a string contains user inputs or other untrusted
data, you must sanitize the string before using the `htmlSafe` method.
Otherwise your code is vulnerable to
[Cross-Site Scripting](https://owasp.org/www-community/attacks/DOM_Based_XSS).
There are many open source sanitization libraries to choose from,
both for front end and server-side sanitization.

```javascript
import { htmlSafe } from '@ember/template';

const someTrustedOrSanitizedString = "<div>Hello!</div>"

htmlSafe(someTrustedorSanitizedString)
```

@method htmlSafe
@for @ember/template
@param str {String} The string to treat as trusted.
@static
@return {SafeString} A string that will not be HTML escaped by Handlebars.
@public
*/
var htmlSafe = trustHTML;
/**
Use this method to indicate that a string should be rendered as HTML
without escaping when the string is used in a template. To say this another way,
strings marked with `trustHTML` will not be HTML escaped.

A word of warning -   The `trustHTML` method does not make the string safe;
it only tells the framework to treat the string as if it is safe to render
as HTML - that we trust its contents to be safe. If a string contains user inputs or other untrusted
data, you must sanitize the string before using the `trustHTML` method.
Otherwise your code is vulnerable to
[Cross-Site Scripting](https://owasp.org/www-community/attacks/DOM_Based_XSS).
There are many open source sanitization libraries to choose from,
both for front end and server-side sanitization.

```glimmer-js
import { trustHTML } from '@ember/template';

const someTrustedOrSanitizedString = "<div>Hello!</div>"

<template>
{{trustHTML someTrustedOrSanitizedString}}
</template>
```

@method trustHTML
@for @ember/template
@param str {String} The string to treat as trusted.
@static
@return {TrustedHTML} A string that will not be HTML escaped by Handlebars.
@public
*/
function trustHTML(str) {
	if (str === null || str === void 0) str = "";
	else if (typeof str !== "string") str = String(str);
	return new TrustedHTML(str);
}
/**
Detects if a string was decorated using `htmlSafe`.

```javascript
import { htmlSafe, isHTMLSafe } from '@ember/template';

let plainString = 'plain string';
let safeString = htmlSafe('<div>someValue</div>');

isHTMLSafe(plainString); // false
isHTMLSafe(safeString);  // true
```

@method isHTMLSafe
@for @ember/template
@static
@return {Boolean} `true` if the string was decorated with `htmlSafe`, `false` otherwise.
@public
*/
var isHTMLSafe = isTrustedHTML;
/**
Detects if a string was decorated using `trustHTML`.

```javascript
import { trustHTML, isTrustedHTML } from '@ember/template';

let plainString = 'plain string';
let safeString = trustHTML('<div>someValue</div>');

isTrustedHTML(plainString); // false
isTrustedHTML(safeString);  // true
```

@method isTrustedHTML
@for @ember/template
@static
@return {Boolean} `true` if the string was decorated with `htmlSafe`, `false` otherwise.
@public
*/
function isTrustedHTML(str) {
	return str !== null && typeof str === "object" && typeof str.toHTML === "function";
}
//#endregion
export { isTrustedHTML as a, isHTMLSafe as i, TrustedHTML as n, trustHTML as o, htmlSafe as r, SafeString as t };
