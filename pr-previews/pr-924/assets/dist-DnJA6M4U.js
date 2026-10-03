import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { r as setOwner } from "./owner-Bxxa-eff.js";
import { v as schedule } from "./runloop-Dk0Nzu3h.js";
import { i as destroy } from "./destroyable-BW6N5j2P.js";
import { r as setComponentManager } from "./component-DaFSbo98.js";
import { r as componentCapabilities } from "./api-B_poQGXS-T6hxwnfy.js";
//#region ../node_modules/.pnpm/@glimmer+component@2.1.1_supports-color@8.1.1/node_modules/@glimmer/component/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({ default: () => Component });
var DESTROYING = /* @__PURE__ */ new WeakMap();
var DESTROYED = /* @__PURE__ */ new WeakMap();
function setDestroying(component) {
	DESTROYING.set(component, true);
}
function setDestroyed(component) {
	DESTROYED.set(component, true);
}
/**
* This provides us a way to have a "fallback" which represents an empty object,
* without the downsides of how TS treats `{}`. Specifically: this will
* correctly leverage "excess property checking" so that, given a component
* which has no named args, if someone invokes it with any named args, they will
* get a type error.
*
* @internal This is exported so declaration emit works (if it were not emitted,
*   declarations which fall back to it would not work). It is *not* intended for
*   public usage, and the specific mechanics it uses may change at any time.
*   The location of this export *is* part of the public API, because moving it
*   will break existing declarations, but is not legal for end users to import
*   themselves, so ***DO NOT RELY ON IT***.
*/
/** Given a signature `S`, get back the `Args` type. */
/**
* Given any allowed shorthand form of a signature, desugars it to its full
* expanded type.
*
* @internal This is only exported so we can avoid duplicating it in
*   [Glint](https://github.com/typed-ember/glint) or other such tooling. It is
*   *not* intended for public usage, and the specific mechanics it uses may
*   change at any time. Although the signature produced by is part of Glimmer's
*   public API the existence and mechanics of this specific symbol are *not*,
*   so ***DO NOT RELY ON IT***.
*/
/**
* @internal we use this type for convenience internally; inference means users
*   should not normally need to name it
*/
/**
* The `Component` class defines an encapsulated UI element that is rendered to
* the DOM. A component is made up of a template and, optionally, this component
* object.
*
* ## Defining a Component
*
* To define a component, subclass `Component` and add your own properties,
* methods and lifecycle hooks:
*
* ```ts
* import Component from '@glimmer/component';
*
* export default class extends Component {
* }
* ```
*
* ## Lifecycle Hooks
*
* Lifecycle hooks allow you to respond to changes to a component, such as when
* it gets created, rendered, updated or destroyed. To add a lifecycle hook to a
* component, implement the hook as a method on your component subclass.
*
* For example, to be notified when Glimmer has rendered your component so you
* can attach a legacy jQuery plugin, implement the `didInsertElement()` method:
*
* ```ts
* import Component from '@glimmer/component';
*
* export default class extends Component {
*   didInsertElement() {
*     $(this.element).pickadate();
*   }
* }
* ```
*
* ## Data for Templates
*
* `Component`s have two different kinds of data, or state, that can be
* displayed in templates:
*
* 1. Arguments
* 2. Properties
*
* Arguments are data that is passed in to a component from its parent
* component. For example, if I have a `UserGreeting` component, I can pass it
* a name and greeting to use:
*
* ```hbs
* <UserGreeting @name="Ricardo" @greeting="Olá" />
* ```
*
* Inside my `UserGreeting` template, I can access the `@name` and `@greeting`
* arguments that I've been given:
*
* ```hbs
* {{@greeting}}, {{@name}}!
* ```
*
* Arguments are also available inside my component:
*
* ```ts
* console.log(this.args.greeting); // prints "Olá"
* ```
*
* Properties, on the other hand, are internal to the component and declared in
* the class. You can use properties to store data that you want to show in the
* template, or pass to another component as an argument.
*
* ```ts
* import Component from '@glimmer/component';
*
* export default class extends Component {
*   user = {
*     name: 'Robbie'
*   }
* }
* ```
*
* In the above example, we've defined a component with a `user` property that
* contains an object with its own `name` property.
*
* We can render that property in our template:
*
* ```hbs
* Hello, {{user.name}}!
* ```
*
* We can also take that property and pass it as an argument to the
* `UserGreeting` component we defined above:
*
* ```hbs
* <UserGreeting @greeting="Hello" @name={{user.name}} />
* ```
*
* ## Arguments vs. Properties
*
* Remember, arguments are data that was given to your component by its parent
* component, and properties are data your component has defined for itself.
*
* You can tell the difference between arguments and properties in templates
* because arguments always start with an `@` sign (think "A is for arguments"):
*
* ```hbs
* {{@firstName}}
* ```
*
* We know that `@firstName` came from the parent component, not the current
* component, because it starts with `@` and is therefore an argument.
*
* On the other hand, if we see:
*
* ```hbs
* {{name}}
* ```
*
* We know that `name` is a property on the component. If we want to know where
* the data is coming from, we can go look at our component class to find out.
*
* Inside the component itself, arguments always show up inside the component's
* `args` property. For example, if `{{@firstName}}` is `Tom` in the template,
* inside the component `this.args.firstName` would also be `Tom`.
*/
var GlimmerComponent = class {
	/**
	* Constructs a new component and assigns itself the passed properties. You
	* should not construct new components yourself. Instead, Glimmer will
	* instantiate new components automatically as it renders.
	*
	* @param owner
	* @param args
	*/
	constructor(owner, args) {
		this.args = args;
		DESTROYING.set(this, false);
		DESTROYED.set(this, false);
	}
	/**
	* Named arguments passed to the component from its parent component.
	* They can be accessed in JavaScript via `this.args.argumentName` and in the template via `@argumentName`.
	*
	* Say you have the following component, which will have two `args`, `firstName` and `lastName`:
	*
	* ```hbs
	* <my-component @firstName="Arthur" @lastName="Dent" />
	* ```
	*
	* If you needed to calculate `fullName` by combining both of them, you would do:
	*
	* ```ts
	* didInsertElement() {
	*   console.log(`Hi, my full name is ${this.args.firstName} ${this.args.lastName}`);
	* }
	* ```
	*
	* While in the template you could do:
	*
	* ```hbs
	* <p>Welcome, {{@firstName}} {{@lastName}}!</p>
	* ```
	*/
	args;
	get isDestroying() {
		return DESTROYING.get(this) || false;
	}
	get isDestroyed() {
		return DESTROYED.get(this) || false;
	}
	/**
	* Called before the component has been removed from the DOM.
	*/
	willDestroy() {}
};
var BaseComponentManager = class {
	owner;
	constructor(owner) {
		this.owner = owner;
	}
	createComponent(ComponentClass, args) {
		return new ComponentClass(this.owner, args.named);
	}
	getContext(component) {
		return component;
	}
};
var CAPABILITIES = componentCapabilities("3.13", {
	destructor: true,
	asyncLifecycleCallbacks: false,
	updateHook: false
});
function scheduledDestroyComponent(component) {
	if (component.isDestroyed) return;
	destroy(component);
	setDestroyed(component);
}
/**
* This component manager runs in Ember.js environments and extends the base component manager to:
*
* 1. Properly destroy the component's associated `meta` data structure
* 2. Schedule destruction using Ember's runloop
*/
var EmberGlimmerComponentManager = class extends BaseComponentManager {
	capabilities = CAPABILITIES;
	destroyComponent(component) {
		if (component.isDestroying) return;
		setDestroying(component);
		schedule("actions", component, component.willDestroy);
		schedule("destroy", this, scheduledDestroyComponent, component);
	}
};
/**
A component is a reusable UI element that consists of a `.hbs` template and an
optional JavaScript class that defines its behavior. For example, someone
might make a `button` in the template and handle the click behavior in the
JavaScript file that shares the same name as the template.

Components are broken down into two categories:

- Components _without_ JavaScript, that are based only on a template. These
are called Template-only or TO components.
- Components _with_ JavaScript, which consist of a template and a backing
class.

Ember ships with two types of JavaScript classes for components:

1. Glimmer components, imported from `@glimmer/component`, which are the
default components for Ember Octane (3.15) and more recent editions.
2. Classic components, imported from `@ember/component`, which were the
default for older editions of Ember (pre 3.15).

Below is the documentation for Template-only and Glimmer components. If you
are looking for the API documentation for Classic components, it is
[available here](/ember/release/classes/Component). The source code for
Glimmer components can be found in [`@glimmer/component`](https://github.com/glimmerjs/glimmer.js/tree/master/packages/%40glimmer/component).

## Defining a Template-only Component

The simplest way to create a component is to create a template file in
`app/templates/components`. For example, if you name a template
`app/templates/components/person-profile.hbs`:

```app/templates/components/person-profile.hbs
<h1>{{@person.name}}</h1>
<img src={{@person.avatar}}>
<p class='signature'>{{@person.signature}}</p>
```

You will be able to use `<PersonProfile />` to invoke this component elsewhere
in your application:

```app/templates/application.hbs
<PersonProfile @person={{this.currentUser}} />
```

Note that component names are capitalized here in order to distinguish them
from regular HTML elements, but they are dasherized in the file system.

While the angle bracket invocation form is generally preferred, it is also
possible to invoke the same component with the `{{person-profile}}` syntax:

```app/templates/application.hbs
{{person-profile person=this.currentUser}}
```

Note that with this syntax, you use dashes in the component name and
arguments are passed without the `@` sign.

In both cases, Ember will render the content of the component template we
created above. The end result will be something like this:

```html
<h1>Tomster</h1>
<img src="https://emberjs.com/tomster.jpg">
<p class='signature'>Out of office this week</p>
```

## File System Nesting

Components can be nested inside sub-folders for logical groupping. For
example, if we placed our template in
`app/templates/components/person/short-profile.hbs`, we can invoke it as
`<Person::ShortProfile />`:

```app/templates/application.hbs
<Person::ShortProfile @person={{this.currentUser}} />
```

Or equivalently, `{{person/short-profile}}`:

```app/templates/application.hbs
{{person/short-profile person=this.currentUser}}
```

## Using Blocks

You can use `yield` inside a template to include the **contents** of any block
attached to the component. For instance, if we added a `{{yield}}` to our
component like so:

```app/templates/components/person-profile.hbs
<h1>{{@person.name}}</h1>
{{yield}}
```

We could then invoke it like this:

```handlebars
<PersonProfile @person={{this.currentUser}}>
<p>Admin mode</p>
</PersonProfile>
```

or with curly syntax like this:

```handlebars
{{#person-profile person=this.currentUser}}
<p>Admin mode</p>
{{/person-profile}}
```

And the content passed in between the brackets of the component would be
rendered in the same place as the `{{yield}}` within it, replacing it.

Blocks are executed in their original context, meaning they have access to the
scope and any in-scope variables where they were defined.

### Passing parameters to blocks

You can also pass positional parameters to `{{yield}}`, which are then made
available in the block:

```app/templates/components/person-profile.hbs
<h1>{{@person.name}}</h1>
{{yield @person.signature}}
```

We can then use this value in the block like so:

```handlebars
<PersonProfile @person={{this.currentUser}} as |signature|>
{{signature}}
</PersonProfile>
```

### Passing multiple blocks

You can pass multiple blocks to a component by giving them names, and
specifying which block you are yielding to with `{{yield}}`. For instance, if
we wanted to add a way for users to customize the title of our
`<PersonProfile>` component, we could add a named block inside of the header:

```app/templates/components/person-profile.hbs
<h1>{{yield to="title"}}</h1>
{{yield}}
```

This component could then be invoked like so:

```handlebars
<PersonProfile @person={{this.currentUser}}>
<:title>{{this.currentUser.name}}</:title>
<:default>{{this.currentUser.signature}}</:default>
</PersonProfile>
```

When passing named blocks, you must name every block, including the `default`
block, which is the block that is defined if you do not pass a `to` parameter
to `{{yield}}`. Whenever you invoke a component without passing explicitly
named blocks, the passed block is considered the `default` block.

### Passing parameters to named blocks

You can also pass parameters to named blocks:

```app/templates/components/person-profile.hbs
<h1>{{yield @person.name to="title"}}</h1>
{{yield @person.signature}}
```

These parameters can then be used like so:

```handlebars
<PersonProfile @person={{this.currentUser}}>
<:title as |name|>{{name}}</:title>
<:default as |signature|>{{signature}}</:default>
</PersonProfile>
```

### Checking to see if a block exists

You can also check to see if a block exists using the `(has-block)` keyword,
and conditionally use it, or provide a default template instead.

```app/templates/components/person-profile.hbs
<h1>
{{#if (has-block "title")}}
{{yield @person.name to="title"}}
{{else}}
{{@person.name}}
{{/if}}
</h1>

{{#if (has-block)}}
{{yield @person.signature}}
{{else}}
{{@person.signature}}
{{/if}}
```

With this template, we can then optionally pass in one block, both blocks, or
none at all:

```handlebars
{{! passing both blocks }}
<PersonProfile @person={{this.currentUser}}>
<:title as |name|>{{name}}</:title>
<:default as |signature|>{{signature}}</:default>
</PersonProfile>

{{! passing just the title block }}
<PersonProfile @person={{this.currentUser}}>
<:title as |name|>{{name}}</:title>
</PersonProfile>

{{! passing just the default block }}
<PersonProfile @person={{this.currentUser}} as |signature|>
{{signature}}
</PersonProfile>

{{! not passing any blocks }}
<PersonProfile @person={{this.currentUser}}/>
```

### Checking to see if a block has parameters

We can also check if a block receives parameters using the `(has-block-params)`
keyword, and conditionally yield different values if so.

```app/templates/components/person-profile.hbs
{{#if (has-block-params)}}
{{yield @person.signature}}
{{else}}
{{yield}}
{{/if}}
```

## Customizing Components With JavaScript

To add JavaScript to a component, create a JavaScript file in the same
location as the template file, with the same name, and export a subclass
of `Component` as the default value. For example, to add Javascript to the
`PersonProfile` component which we defined above, we would create
`app/components/person-profile.js` and export our class as the default, like
so:

```app/components/person-profile.js
import Component from '@glimmer/component';

export default class PersonProfileComponent extends Component {
get displayName() {
let { title, firstName, lastName } = this.args.person;

if (title) {
return `${title} ${lastName}`;
} else {
return `${firstName} ${lastName}`;
}
})
}
```

You can add your own properties, methods, and lifecycle hooks to this
subclass to customize its behavior, and you can reference the instance of the
class in your template using `{{this}}`. For instance, we could access the
`displayName` property of our `PersonProfile` component instance in the
template like this:

```app/templates/components/person-profile.hbs
<h1>{{this.displayName}}</h1>
{{yield}}
```

## `constructor`

params: `owner` object and `args` object

Constructs a new component and assigns itself the passed properties. The
constructor is run whenever a new instance of the component is created, and
can be used to setup the initial state of the component.

```javascript
import Component from '@glimmer/component';

export default class SomeComponent extends Component {
constructor(owner, args) {
super(owner, args);

if (this.args.displayMode === 'list') {
this.items = [];
}
}
}
```

Service injections and arguments are available in the constructor.

```javascript
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SomeComponent extends Component {
@service myAnimations;

constructor(owner, args) {
super(owner, args);

if (this.args.fadeIn === true) {
this.myAnimations.register(this, 'fade-in');
}
}
}
```

## `willDestroy`

`willDestroy` is called after the component has been removed from the DOM, but
before the component is fully destroyed. This lifecycle hook can be used to
cleanup the component and any related state.

```javascript
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SomeComponent extends Component {
@service myAnimations;

willDestroy() {
super.willDestroy();

this.myAnimations.unregister(this);
}
}
```

## `args`

The `args` property of Glimmer components is an object that contains the
_arguments_ that are passed to the component. For instance, the
following component usage:

```handlebars
<SomeComponent @fadeIn={{true}} />
```

Would result in the following `args` object to be passed to the component:

```javascript
{ fadeIn: true }
```

`args` can be accessed at any point in the component lifecycle, including
`constructor` and `willDestroy`. They are also automatically marked as tracked
properties, and they can be depended on as computed property dependencies:

```javascript
import Component from '@glimmer/component';
import { computed } from '@ember/object';

export default class SomeComponent extends Component {

@computed('args.someValue')
get computedGetter() {
// updates whenever args.someValue updates
return this.args.someValue;
}

get standardGetter() {
// updates whenever args.anotherValue updates (Ember 3.13+)
return this.args.anotherValue;
}
}
```

## `isDestroying`

A boolean flag to tell if the component is in the process of destroying. This is set to
true before `willDestroy` is called.

## `isDestroyed`
A boolean to tell if the component has been fully destroyed. This is set to true
after `willDestroy` is called.

@module @glimmer/component
@public
*/
var Component = class extends GlimmerComponent {
	constructor(owner, args) {
		super(owner, args);
		setOwner(this, owner);
	}
};
setComponentManager((owner) => {
	return new EmberGlimmerComponentManager(owner);
}, Component);
//#endregion
export { dist_exports as n, Component as t };
