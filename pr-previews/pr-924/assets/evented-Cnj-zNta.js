import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { i as Mixin } from "./core-D-L0f59Y.js";
import { f as addListener, g as sendEvent, h as removeListener, m as on, p as hasListeners } from "./observers-BmobpXAF-CkVUhhE-.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/object/evented.js
var evented_exports = /* @__PURE__ */ __exportAll({
	default: () => Evented,
	on: () => on
});
/**
@module @ember/object/evented
*/
/**
This mixin allows for Ember objects to subscribe to and emit events.

```app/utils/person.js
import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';

export default class Person extends EmberObject.extend(Evented) {
greet() {
// ...
this.trigger('greet');
}
}
```

```javascript
var person = Person.create();

person.on('greet', function() {
console.log('Our person has greeted');
});

person.greet();

// outputs: 'Our person has greeted'
```

You can also chain multiple event subscriptions:

```javascript
person.on('greet', function() {
console.log('Our person has greeted');
}).one('greet', function() {
console.log('Offer one-time special');
}).off('event', this, forgetThis);
```

@class Evented
@public
*/
var Evented = Mixin.create({
	on(name, target, method) {
		addListener(this, name, target, method);
		return this;
	},
	one(name, target, method) {
		addListener(this, name, target, method, true);
		return this;
	},
	trigger(name, ...args) {
		sendEvent(this, name, args);
	},
	off(name, target, method) {
		removeListener(this, name, target, method);
		return this;
	},
	has(name) {
		return hasListeners(this, name);
	}
});
//#endregion
export { evented_exports as n, Evented as t };
