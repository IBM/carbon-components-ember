import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { i as deprecateUntil, n as inject$1, r as DEPRECATIONS } from "./injected_property-DqQ0XV7k-KjJunt8I.js";
import { t as FrameworkObject } from "./-internals-KZ2Tqoux.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/service/index.js
var service_exports = /* @__PURE__ */ __exportAll({
	default: () => Service,
	inject: () => inject,
	service: () => service
});
/**
@module @ember/service
@public
*/
/**
@method inject
@static
@since 1.10.0
@for @ember/service
@param {String} name (optional) name of the service to inject, defaults to
the property's name
@return {ComputedDecorator} injection decorator instance
@public
@deprecated Please import `service` instead.
*/
function inject(...args) {
	deprecateUntil("Importing `inject` from `@ember/service` is deprecated. Please import `service` instead.", DEPRECATIONS.DEPRECATE_IMPORT_INJECT);
	return inject$1("service", ...args);
}
/**
Creates a property that lazily looks up a service in the container. There are
no restrictions as to what objects a service can be injected into.

Example:

```app/routes/application.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
@service('auth') authManager;

model() {
return this.authManager.findCurrentUser();
}
}
```

Classic Class Example:

```app/routes/application.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
@service('auth') authManager;

model() {
return this.authManager.findCurrentUser();
}
}
```

This example will create an `authManager` property on the application route
that looks up the `auth` service in the container, making it easily accessible
in the `model` hook.

@method service
@static
@since 4.1.0
@for @ember/service
@param {String} name (optional) name of the service to inject, defaults to
the property's name
@return {ComputedDecorator} injection decorator instance
@public
*/
function service(...args) {
	return inject$1("service", ...args);
}
/**
@class Service
@extends EmberObject
@since 1.10.0
@public
*/
var Service = class extends FrameworkObject {
	static isServiceFactory = true;
};
//#endregion
export { service_exports as i, inject as n, service as r, Service as t };
