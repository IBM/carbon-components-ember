import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { t as getOwner } from "./owner-Bxxa-eff.js";
import { M as computed, U as get, i as Mixin } from "./core-D-L0f59Y.js";
import { n as inject$1 } from "./injected_property-DqQ0XV7k-KjJunt8I.js";
import { t as ActionHandler } from "./action_handler-nAULtqaN.js";
import { t as FrameworkObject } from "./-internals-KZ2Tqoux.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/controller/index.js
var controller_exports = /* @__PURE__ */ __exportAll({
	ControllerMixin: () => ControllerMixin,
	default: () => Controller,
	inject: () => inject
});
var MODEL = Symbol("MODEL");
/**
@module @ember/controller
*/
/**
@class ControllerMixin
@namespace Ember
@uses Ember.ActionHandler
@private
*/
var ControllerMixin = Mixin.create(ActionHandler, {
	isController: true,
	concatenatedProperties: ["queryParams"],
	target: null,
	store: null,
	init() {
		this._super(...arguments);
		let owner = getOwner(this);
		if (owner) {
			this.namespace = owner.lookup("application:main");
			this.target = owner.lookup("router:main");
		}
	},
	model: computed({
		get() {
			return this[MODEL];
		},
		set(_key, value) {
			return this[MODEL] = value;
		}
	}),
	queryParams: null,
	/**
	This property is updated to various different callback functions depending on
	the current "state" of the backing route. It is used by
	`Controller.prototype._qpChanged`.
	The methods backing each state can be found in the `Route.prototype._qp` computed
	property return value (the `.states` property). The current values are listed here for
	the sanity of future travelers:
	* `inactive` - This state is used when this controller instance is not part of the active
	route hierarchy. Set in `Route.prototype._reset` (a `router.js` microlib hook) and
	`Route.prototype.actions.finalizeQueryParamChange`.
	* `active` - This state is used when this controller instance is part of the active
	route hierarchy. Set in `Route.prototype.actions.finalizeQueryParamChange`.
	* `allowOverrides` - This state is used in `Route.prototype.setup` (`route.js` microlib hook).
	@method _qpDelegate
	@private
	*/
	_qpDelegate: null,
	/**
	During `Route#setup` observers are created to invoke this method
	when any of the query params declared in `Controller#queryParams` property
	are changed.
	When invoked this method uses the currently active query param update delegate
	(see `Controller.prototype._qpDelegate` for details) and invokes it with
	the QP key/value being changed.
	@method _qpChanged
	@private
	*/
	_qpChanged(controller, _prop) {
		let dotIndex = _prop.indexOf(".[]");
		let prop = dotIndex === -1 ? _prop : _prop.slice(0, dotIndex);
		let delegate = controller._qpDelegate;
		delegate(prop, get(controller, prop));
	}
});
/**
@class Controller
@extends EmberObject
@uses Ember.ControllerMixin
@public
*/
var Controller = class extends FrameworkObject.extend(ControllerMixin) {};
/**
Creates a property that lazily looks up another controller in the container.
Can only be used when defining another controller.

Example:

```app/controllers/post.js
import Controller, {
inject as controller
} from '@ember/controller';

export default class PostController extends Controller {
@controller posts;
}
```

Classic Class Example:

```app/controllers/post.js
import Controller, {
inject as controller
} from '@ember/controller';

export default Controller.extend({
posts: controller()
});
```

This example will create a `posts` property on the `post` controller that
looks up the `posts` controller in the container, making it easy to reference
other controllers.

@method inject
@static
@for @ember/controller
@since 1.10.0
@param {String} name (optional) name of the controller to inject, defaults to
the property's name
@return {ComputedDecorator} injection decorator instance
@public
*/
function inject(...args) {
	return inject$1("controller", ...args);
}
//#endregion
export { inject as i, ControllerMixin as n, controller_exports as r, Controller as t };
