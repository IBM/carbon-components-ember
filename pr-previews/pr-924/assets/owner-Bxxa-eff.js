import { n as getOwner$1, r as setOwner$1 } from "./owner-In3G7kPJ.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/owner/index.js
/**
@module @ember/owner
*/
/**
The name for a factory consists of a namespace and the name of a specific type
within that namespace, like `'service:session'`.

**Note:** `FullName` is *not* a class, just a contract for strings used in the
DI system. It is currently documented as a class only due to limits in our
documentation infrastructure.

@for @ember/owner
@class FullName
@public
*/
/**
A type registry for the DI system, which other participants in the DI system
can register themselves into with declaration merging. The contract for this
type is that its keys are the `Type` from a `FullName`, and each value for a
`Type` is another registry whose keys are the `Name` from a `FullName`. The
mechanic for providing a registry is [declaration merging][handbook].

[handbook]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html

For example, Ember's `@ember/service` module includes this set of definitions:

```ts
export default class Service extends EmberObject {}

// For concrete singleton classes to be merged into.
interface Registry extends Record<string, Service> {}

declare module '@ember/owner' {
service: Registry;
}
```

Declarations of services can then include the registry:

```ts
import Service from '@ember/service';

export default class Session extends Service {
login(username: string, password: string) {
// ...
}
}

declare module '@ember/service' {
interface Registry {
session: Session;
}
}
```

Then users of the `Owner` API will be able to do things like this with strong
type safety guarantees:

```ts
getOwner(this)?.lookup('service:session').login("hello", "1234abcd");
```

@for @ember/owner
@private
*/
/**
@private
*/
/**
The common interface for the ability to `register()` an item, shared by the
`Owner` and `RegistryProxy` interfaces.

@for @ember/owner
@class BasicRegistry
@private
*/
/**
The common interface for the ability to `lookup()` or get the `factoryFor` an
item, shared by the `Owner` and `ContainerProxy` interfaces.

@for @ember/owner
@class BasicContainer
@private
*/
/**
Framework objects in an Ember application (components, services, routes,
etc.) are created via a factory and dependency injection system. Each of
these objects is the responsibility of an "owner", which handles its
instantiation and manages its lifetime.

An `Owner` is not a class you construct; it is one the framework constructs
for you. The normal way to get access to the relevant `Owner` is using the
`getOwner` function.

@for @ember/owner
@uses BasicRegistry
@uses BasicContainer
@class Owner
@since 4.10.0
@public
*/
/**
* Interface representing the options for registering an item as a factory.
*
* @for @ember/owner
* @class RegisterOptions
* @public
*/
/**
Registered factories are instantiated by having create called on them.
Additionally they are singletons by default, so each time they are looked up
they return the same instance.

However, that behavior can be modified with the `instantiate` and `singleton`
options to the `Owner.register()` method.

@for @ember/owner
@class Factory
@since 4.10.0
@public
*/
/**
The interface representing a manager which can be used for introspection of
the factory's class or for the creation of factory instances with initial
properties. The manager is an object with the following properties:

- `class` - The registered or resolved class.
- `create` - A function that will create an instance of the class with any
dependencies injected.

**Note:** `FactoryManager` is *not* user-constructible; the only legal way
to get a `FactoryManager` is via `Owner.factoryFor`.

@for @ember/owner
@class FactoryManager
@extends Factory
@public
*/
/**
* A record mapping all known items of a given type: if the item is known it
* will be `true`; otherwise it will be `false` or `undefined`.
*/
/**
A `Resolver` is the mechanism responsible for looking up code in your
application and converting its naming conventions into the actual classes,
functions, and templates that Ember needs to resolve its dependencies, for
example, what template to render for a given route. It is a system that helps
the app resolve the lookup of JavaScript modules agnostic of what kind of
module system is used, which can be AMD, CommonJS or just plain globals. It
is used to lookup routes, models, components, templates, or anything that is
used in your Ember app.

This interface is not a concrete class; instead, it represents the contract a
custom resolver must implement. Most apps never need to think about this: in
the default blueprint, this is supplied by the `ember-resolver` package.

@for @ember/owner
@class Resolver
@since 4.10.0
@public
*/
/**
The internal representation of a `Factory`, for the extra detail available for
private use internally than we expose to consumers.

@for @ember/owner
@class InternalFactory
@private
*/
/**
@private
@method isFactory
@param {Object} obj
@return {Boolean}
@static
*/
function isFactory(obj) {
	return obj != null && typeof obj.create === "function";
}
function getOwner(object) {
	return getOwner$1(object);
}
/**
`setOwner` forces a new owner on a given object instance. This is primarily
useful in some testing cases.

@method setOwner
@static
@for @ember/owner
@param {Object} object An object instance.
@param {Owner} object The new owner object of the object instance.
@since 2.3.0
@public
*/
function setOwner(object, owner) {
	setOwner$1(object, owner);
}
//#endregion
export { isFactory as n, setOwner as r, getOwner as t };
