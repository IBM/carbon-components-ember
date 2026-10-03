import { u as helperCapabilities } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { i as hash$1, n as array$1, r as fn$1 } from "./internal-helper-Bz1lpDXr-T37SvdBi.js";
import { i as get$1, n as uniqueId$1, r as concat$1 } from "./unique-id-BJb1p8EG-CAigDLyj.js";
import { o as setHelperManager$1 } from "./api-B_poQGXS-T6hxwnfy.js";
import { t as invokeHelper$1 } from "./invoke-B-r9UQVH-CCn0H4Ib.js";
import { a as lt$1, c as not$1, i as gte$1, l as or$1, n as eq$1, o as lte$1, r as gt$1, s as neq$1, t as and$1 } from "./not-DOTpWiG3-B7e-Fzd-.js";
import { t as element$1 } from "./element-BmBjPjkQ-BAO3lLtw.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/helper/index.js
/**
@module @ember/helper
*/
/**
`capabilities` returns a capabilities configuration which can be used to modify
the behavior of the manager. Manager capabilities _must_ be provided using the
`capabilities` function, as the underlying implementation can change over time.

The first argument to capabilities is a version string, which is the version of
Ember that the capabilities were defined in. Ember can add new versions at any
time, and these may have entirely different behaviors, but it will not remove
old versions until the next major version.

```js
capabilities('3.23');
```

The second argument is an object of capabilities and boolean values indicating
whether they are enabled or disabled.

```js
capabilities('3.23', {
hasValue: true,
hasDestructor: true,
});
```

If no value is specified, then the default value will be used.

### `3.23` capabilities

#### `hasDestroyable`

- Default value: false

Determines if the helper has a destroyable to include in the destructor
hierarchy. If enabled, the `getDestroyable` hook will be called, and its result
will be associated with the destroyable parent block.

#### `hasValue`

- Default value: false

Determines if the helper has a value which can be used externally. The helper's
`getValue` hook will be run whenever the value of the helper is accessed if this
capability is enabled.

@method capabilities
@static
@for @ember/helper
@param {String} managerApiVersion The version of capabilities that are being used
@param options The capabilities values
@return {Capabilities} The capabilities object instance
@since 3.23.0
@public
*/
var capabilities = helperCapabilities;
/**
Sets the helper manager for an object or function.

```js
setHelperManager((owner) => new ClassHelperManager(owner), Helper)
```

When a value is used as a helper in a template, the helper manager is looked up
on the object by walking up its prototype chain and finding the first helper
manager. This manager then receives the value and can create and manage an
instance of a helper from it. This provides a layer of indirection that allows
users to design high-level helper APIs, without Ember needing to worry about the
details. High-level APIs can be experimented with and iterated on while the
core of Ember helpers remains stable, and new APIs can be introduced gradually
over time to existing code bases.

`setHelperManager` receives two arguments:

1. A factory function, which receives the `owner` and returns an instance of a
helper manager.
2. A helper definition, which is the object or function to associate the factory function with.

The first time the object is looked up, the factory function will be called to
create the helper manager. It will be cached, and in subsequent lookups the
cached helper manager will be used instead.

Only one helper manager is guaranteed to exist per `owner` and per usage of
`setHelperManager`, so many helpers will end up using the same instance of the
helper manager. As such, you should only store state that is related to the
manager itself. If you want to store state specific to a particular helper
definition, you should assign a unique helper manager to that helper. In
general, most managers should either be stateless, or only have the `owner` they
were created with as state.

Helper managers must fulfill the following interface (This example uses
[TypeScript interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
for precision, you do not need to write helper managers using TypeScript):

```ts
interface HelperManager<HelperStateBucket> {
capabilities: HelperCapabilities;

createHelper(definition: HelperDefinition, args: TemplateArgs): HelperStateBucket;

getValue?(bucket: HelperStateBucket): unknown;

runEffect?(bucket: HelperStateBucket): void;

getDestroyable?(bucket: HelperStateBucket): object;
}
```

The capabilities property _must_ be provided using the `capabilities()` function
imported from the same module as `setHelperManager`:

```js
import { capabilities } from '@ember/helper';

class MyHelperManager {
capabilities = capabilities('3.21.0', { hasValue: true });

// ...snip...
}
```

Below is a description of each of the methods on the interface and their
functions.

#### `createHelper`

`createHelper` is a required hook on the HelperManager interface. The hook is
passed the definition of the helper that is currently being created, and is
expected to return a _state bucket_. This state bucket is what represents the
current state of the helper, and will be passed to the other lifecycle hooks at
appropriate times. It is not necessarily related to the definition of the
helper itself - for instance, you could return an object _containing_ an
instance of the helper:

```js
class MyManager {
createHelper(Definition, args) {
return {
instance: new Definition(args);
};
}
}
```

This allows the manager to store metadata that it doesn't want to expose to the
user.

This hook is _not_ autotracked - changes to tracked values used within this hook
will _not_ result in a call to any of the other lifecycle hooks. This is because
it is unclear what should happen if it invalidates, and rather than make a
decision at this point, the initial API is aiming to allow as much expressivity
as possible. This could change in the future with changes to capabilities and
their behaviors.

If users do want to autotrack some values used during construction, they can
either create the instance of the helper in `runEffect` or `getValue`, or they
can use the `cache` API to autotrack the `createHelper` hook themselves. This
provides maximum flexibility and expressiveness to manager authors.

This hook has the following timing semantics:

**Always**
- called as discovered during DOM construction
- called in definition order in the template

#### `getValue`

`getValue` is an optional hook that should return the value of the helper. This
is the value that is returned from the helper and passed into the template.

This hook is called when the value is requested from the helper (e.g. when the
template is rendering and the helper value is needed). The hook is autotracked,
and will rerun whenever any tracked values used inside of it are updated.
Otherwise it does not rerun.

> Note: This means that arguments which are not _consumed_ within the hook will
> not trigger updates.

This hook is only called for helpers with the `hasValue` capability enabled.
This hook has the following timing semantics:

**Always**
- called the first time the helper value is requested
- called after autotracked state has changed

**Never**
- called if the `hasValue` capability is disabled

#### `runEffect`

`runEffect` is an optional hook that should run the effect that the helper is
applying, setting it up or updating it.

This hook is scheduled to be called some time after render and prior to paint.
There is not a guaranteed, 1-to-1 relationship between a render pass and this
hook firing. For instance, multiple render passes could occur, and the hook may
only trigger once. It may also never trigger if it was dirtied in one render
pass and then destroyed in the next.

The hook is autotracked, and will rerun whenever any tracked values used inside
of it are updated. Otherwise it does not rerun.

The hook is also run during a time period where state mutations are _disabled_
in Ember. Any tracked state mutation will throw an error during this time,
including changes to tracked properties, changes made using `set`, updates
to computed properties, etc. This is meant to prevent infinite rerenders and
other antipatterns.

This hook is only called for helpers with the `hasScheduledEffect` capability
enabled. This hook is also not called in SSR currently, though this could be
added as a capability in the future. It has the following timing semantics:

**Always**
- called after the helper was first created, if the helper has not been
destroyed since creation
- called after autotracked state has changed, if the helper has not been
destroyed during render

**Never**
- called if the `hasScheduledEffect` capability is disabled
- called in SSR

#### `getDestroyable`

`getDestroyable` is an optional hook that users can use to register a
destroyable object for the helper. This destroyable will be registered to the
containing block or template parent, and will be destroyed when it is destroyed.
See the [Destroyables RFC](https://github.com/emberjs/rfcs/blob/master/text/0580-destroyables.md)
for more details.

`getDestroyable` is only called if the `hasDestroyable` capability is enabled.

This hook has the following timing semantics:

**Always**
- called immediately after the `createHelper` hook is called

**Never**
- called if the `hasDestroyable` capability is disabled

@method setHelperManager
@for @ember/helper
@static
@param {Function} factory A factory function which receives an optional owner, and returns a helper manager
@param {object} definition The definition to associate the manager factory with
@return {object} The definition passed into setHelperManager
@since 3.23.0
@public
*/
var setHelperManager = setHelperManager$1;
/**
The `invokeHelper` function can be used to create a helper instance in
JavaScript.

To access a helper's value you have to use `getValue` from
`@glimmer/tracking/primitives/cache`.

```gjs {data-filename="app/components/data-loader.js"}
import Component from '@glimmer/component';
import { getValue } from '@glimmer/tracking/primitives/cache';
import Helper from '@ember/component/helper';
import { invokeHelper } from '@ember/helper';

class PlusOne extends Helper {
compute([number]) {
return number + 1;
}
}

export default class PlusOneComponent extends Component {
plusOne = invokeHelper(this, PlusOne, () => {
return {
positional: [this.args.number],
};
});

get value() {
return getValue(this.plusOne);
}
}

<template>
{{this.value}}
</template>
```

It receives three arguments:

* `context`: The parent context of the helper. When the parent is torn down and
removed, the helper will be as well.
* `definition`: The definition of the helper.
* `computeArgs`: An optional function that produces the arguments to the helper.
The function receives the parent context as an argument, and must return an
object with a `positional` property that is an array and/or a `named`
property that is an object.

And it returns a Cache instance that contains the most recent value of the
helper. You can access the helper using `getValue()` like any other cache. The
cache is also destroyable, and using the `destroy()` function on it will cause
the helper to be torn down.

Note that using `getValue()` on helpers that have scheduled effects will not
trigger the effect early. Effects will continue to run at their scheduled time.

@method invokeHelper
@for @ember/helper
@static
@param {object} context The parent context of the helper
@param {object} definition The helper definition
@param {Function} computeArgs An optional function that produces args
@returns
@since 3.23.0
@public
*/
var invokeHelper = invokeHelper$1;
/**
* Using the `{{hash}}` helper, you can pass objects directly from the template
* as an argument to your components.
*
* ```gjs
* <template>
*   {{#each-in (hash givenName='Jen' familyName='Weber') as |key value|}}
*     <p>{{key}}: {{value}}</p>
*   {{/each-in}}
* </template>
* ```
*
*
* Note that the hash is an empty object with no prototype chain, therefore
* common methods like `toString` are not available in the resulting hash.
* If you need to use such a method, you can use the `call` or `apply`
* approach:
*
* ```js
* function toString(obj) {
*   return Object.prototype.toString.apply(obj);
* }
* ```
* The `hash` helper is available as a keyword and does not need to be imported.
*
* @method hash
* @public
* @static
* @for Keywords
* @noimport
* @param {Object} options
* @return {Object} Hash
* @since 2.3.0
*/
var hash = hash$1;
/**
* Using the `{{array}}` helper, you can pass arrays directly from the template
* as an argument to your components.
*
* ```gjs
* <template>
*   <ul>
*   {{#each (array 'Tom Dale' 'Yehuda Katz' @anotherPerson) as |person|}}
*     <li>{{person}}</li>
*   {{/each}}
*   </ul>
* </template>
* ```
*
* The `array` helper is available as a keyword and does not need to be imported.
*
* @method array
* @public
* @static
* @for Keywords
* @noimport
* @param {Array} options
* @return {Array} Array
* @since 3.8.0
*/
var array = array$1;
/**
* The `{{concat}}` helper Concatenates the given arguments into a string.
*
* Example:
*
```gjs
import { concat } from '@ember/helper';

<template>
{{yield (concat firstName " " lastName)}}

{{! would yield name="<first name value> <last name value>" to the component}}
</template>
```

or for angle bracket invocation, you actually don't need concat at all:

```handlebars
<SomeComponent @name="{{firstName}} {{lastName}}" />
```
*
* @method concat
* @for @ember/helper
* @exampleimport import { concat } from '@ember/helper';
* @public
* @static
* @since 1.13.0
*/
var concat = concat$1;
/**
* The `{{get}}` helper makes it easy to dynamically look up a property on an
* object or an element in an array. The second argument to `{{get}}` can be a
* string or a number, depending on the object being accessed.
*
* To access a property on an object with a string key:
*
* ```gjs
* import { get } from '@ember/helper';
*
* <template>
*   {{get @someObject "objectKey"}}
* </template>
* ```
*
* To access the first element in an array:
*
* ```gjs
* import { get } from '@ember/helper';
*
* <template>
*   {{get @someArray 0}}
* </template>
* ```
*
* To access a property on an object with a dynamic key:
*
* ```gjs
* import { get } from '@ember/helper';
*
* <template>
*   {{get @address @field}}
* </template>
* ```
*
* This will display the result of `@foo.item1` when `index` is `1`, and
* `this.foo.item2` when `index` is `2`, etc.
*
* @method get
* @for @ember/helper
* @since 2.1.0
* @exampleimport import { get } from '@ember/helper';
* @public
* @static
*/
var get = get$1;
/**
* `{{fn}}` is a helper that receives a function and some arguments, and returns
* a new function that combines. This allows you to pass parameters along to
* functions in your templates:
*
* ```gjs
* function showAlert(message) {
*   alert(`The message is: '${message}'`);
* }
*
* <template>
*   <button type="button" {{on "click" (fn showAlert "Hello!")}}>
*     Click me!
*   </button>
* </template>
* ```
*
* For example, if you have an `each` helper looping over a number of items, you
* may need to pass a function that expects to receive the item as an argument
* to a component invoked within the loop. Here's how you could use the `fn`
* helper to pass both the function and its arguments together:
*
* ```gjs {data-filename="app/components/items-listing.gjs"}
* <template>
*   {{#each @items as |item|}}
*     <DisplayItem @item=item @select={{fn this.handleSelected item}} />
*   {{/each}}
* </template>
* ```
*
* ```gjs {data-filename="app/components/items-list.gjs"}
* import Component from '@glimmer/component';
* import { action } from '@ember/object';
*
* export default class ItemsList extends Component {
*   @action
*   handleSelected(item) {
*     // ...snip...
*   }
* }
* ```
*
* In this case the `DisplayItem` component will receive a normal function
* that it can invoke. When it invokes the function, the `handleSelected`
* function will receive the `item` and any arguments passed, thanks to the
* `fn` helper.
*
* Let's take a look at what that means in a couple circumstances:
*
* - When invoked as `this.args.select()` the `handleSelected` function will
* receive the `item` from the loop as its first and only argument.
* - When invoked as `this.args.select('foo')` the `handleSelected` function
* will receive the `item` from the loop as its first argument and the
* string `'foo'` as its second argument.
*
* See also [partial application](https://en.wikipedia.org/wiki/Partial_application).
*
* The `fn` helper is available as a keyword and does not need to be imported.
*
* @method fn
* @for Keywords
* @noimport
* @public
* @since 3.11.0
* @static
*/
var fn = fn$1;
/**
* The `{{gt}}` helper returns `true` if the first argument is greater than
* the second argument.
*
* ```gjs
* <template>
*   {{if (gt @score 100) "High score!" "Keep trying"}}
* </template>
* ```
*
* The `gt` helper is available as a keyword and does not need to be imported.
*
* @method gt
* @param {number} left
* @param {number} right
* @return {boolean}
* @noimport
* @for Keywords
* @since 7.1.0
* @static
* @public
*/
var gt = gt$1;
/**
* The `{{gte}}` helper returns `true` if the first argument is greater than
* or equal to the second argument.
*
* ```gjs
* <template>
*   {{if (gte @age 18) "Adult" "Minor"}}
* </template>
* ```
*
* The `gte` helper is available as a keyword and does not need to be imported.
*
* @method gte
* @param {number} left
* @param {number} right
* @return {boolean}
* @noimport
* @for Keywords
* @since 7.1.0
* @static
* @public
*/
var gte = gte$1;
/**
* The `{{lt}}` helper returns `true` if the first argument is less than
* the second argument.
*
* ```gjs
* <template>
*   {{if (lt @temperature 0) "Freezing" "Above zero"}}
* </template>
* ```
*
* The `lt` helper is available as a keyword and does not need to be imported.
*
* @method lt
* @param {number} left
* @param {number} right
* @return {boolean}
* @noimport
* @for Keywords
* @since 7.1.0
* @static
* @public
*/
var lt = lt$1;
/**
* The `{{lte}}` helper returns `true` if the first argument is less than
* or equal to the second argument.
*
* ```gjs
* <template>
*   {{if (lte @count 0) "Empty" "Has items"}}
* </template>
* ```
*
* The `lte` helper is available as a keyword and does not need to be imported.
*
* @method lte
* @param {number} left
* @param {number} right
* @return {boolean}
* @noimport
* @for Keywords
* @since 7.1.0
* @static
* @public
*/
var lte = lte$1;
/**
* The `element` helper lets you dynamically set the tag name of an element.
*
* ```gjs
* <template>
*   {{#let (element @tagName) as |Tag|}}
*     <Tag class="my-element">Hello</Tag>
*   {{/let}}
* </template>
* ```
*
* When `@tagName` is `"h1"`, this renders `<h1 class="my-element">Hello</h1>`.
* When `@tagName` is an empty string, the block content is rendered without a
* wrapping element. When `@tagName` is `null` or `undefined`, nothing is rendered.
*
* The `element` helper is available as a keyword and does not need to be imported.
*
* @method element
* @param {string} tagName
* @noimport
* @for Keywords
* @since 7.1.0
* @static
* @public
*/
var element = element$1;
/**
* Use the {{uniqueId}} helper to generate a unique ID string suitable for use as
* an ID attribute in the DOM.
*
* Each invocation of {{uniqueId}} will return a new, unique ID string.
* You can use the `let` helper to create an ID that can be reused within a template.
*
* ```gjs
* import { uniqueId } from '@ember/helper';
*
* <template>
*   {{#let (uniqueId) as |emailId|}}
*     <label for={{emailId}}>Email address</label>
*     <input id={{emailId}} type="email" />
*   {{/let}}
* </template>
* ```
*
* @method uniqueId
* @for @ember/helper
* @public
* @static
* @exampleimport import { uniqueId } from '@ember/helper';
* @since 4.4.0
*/
var uniqueId = uniqueId$1;
/**
* The `{{eq}}` helper returns `true` if its two arguments are strictly equal
* (`===`). Takes exactly two arguments.
*
* ```gjs
* <template>
*   {{if (eq @status "active") "Active" "Inactive"}}
* </template>
* ```
*
* The `eq` helper is available as a keyword and does not need to be imported.
*
* @method eq
* @param {unknown} left
* @param {unknown} right
* @return {boolean}
* @noimport
* @for Keywords
* @static
* @since 7.1.0
* @public
*/
var eq = eq$1;
/**
* The `{{neq}}` helper returns `true` if its two arguments are strictly
* not equal (`!==`). Takes exactly two arguments.
*
* ```gjs
* <template>
*   {{if (neq @status "active") "Not active" "Active"}}
* </template>
* ```
*
* The `neq` helper is available as a keyword and does not need to be imported.
*
* @method neq
* @param {unknown} left
* @param {unknown} right
* @return {boolean}
* @for Keywords
* @noimport
* @static
* @since 7.1.0
* @public
*/
var neq = neq$1;
/**
* The `{{and}}` helper evaluates arguments left to right, returning the first
* falsy value (using Handlebars truthiness) or the right-most value if all
* are truthy. Requires at least two arguments.
*
* ```gjs
* <template>
*   {{if (and @isAdmin @isLoggedIn) "Welcome, admin!" "Access denied"}}
* </template>
* ```
*
* The `and` helper is available as a keyword and does not need to be imported.
*
* @method and
* @param {unknown} args Two or more values to evaluate
* @return {unknown} The first falsy value or the last value
* @noimport
* @for Keywords
* @static
* @since 7.1.0
* @public
*/
var and = and$1;
/**
* The `{{or}}` helper evaluates arguments left to right, returning the first
* truthy value (using Handlebars truthiness) or the right-most value if all
* are falsy. Requires at least two arguments.
*
* ```gjs
* <template>
*   {{if (or @hasAccess @isAdmin) "Welcome!" "No access"}}
* </template>
* ```
*
* In strict-mode (gjs/gts) templates, `or` is available as a keyword and
* does not need to be imported.
*
* @method or
* @param {unknown} args Two or more values to evaluate
* @return {unknown} The first truthy value or the last value
* @noimport
* @for Keywords
* @static
* @since 7.1.0
* @public
*/
var or = or$1;
/**
* The `{{not}}` helper returns the logical negation of its argument using
* Handlebars truthiness. Takes exactly one argument.
*
* ```gjs
* <template>
*   {{if (not @isDisabled) "Enabled" "Disabled"}}
* </template>
* ```
*
* In strict-mode (gjs/gts) templates, `not` is available as a keyword and
* does not need to be imported.
*
* @method not
* @param {unknown} value The value to negate
* @return {boolean}
* @for Keywords
* @noimport
* @static
* @since 7.1.0
* @public
*/
var not = not$1;
//#endregion
export { or as _, element as a, get as c, hash as d, invokeHelper as f, not as g, neq as h, concat as i, gt as l, lte as m, array as n, eq as o, lt as p, capabilities as r, fn as s, and as t, gte as u, setHelperManager as v, uniqueId as y };
