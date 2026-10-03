import { r as setOwner } from "./owner-Bxxa-eff.js";
import { f as join } from "./runloop-Dk0Nzu3h.js";
import { _ as consumeTag, s as DIRTY_TAG, y as createTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { t as FrameworkObject } from "./-internals-KZ2Tqoux.js";
import { u as helperCapabilities } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { t as IS_CLASSIC_HELPER } from "./helper-brand-C9_8vvOf-C_B2ufRK.js";
import { o as setHelperManager } from "./api-B_poQGXS-T6hxwnfy.js";
import { t as getDebugName } from "./get-debug-name-BDxIL2Y1-co96XrjY.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/component/helper.js
/**
@module @ember/component
*/
var RECOMPUTE_TAG = Symbol("RECOMPUTE_TAG");
/**
Ember Helpers are functions that can compute values, and are used in templates.
For example, this code calls a helper named `format-currency`:

```gjs {data-filename="app/templates/application.gjs"}
import Cost from '../components/cost';

<template>
<Cost @cents={{230}} />
</template>
```

```gjs {data-filename="app/components/cost.gjs"}
import formatCurrency from '../helpers/format-currency';

<template>
<div>{{formatCurrency @cents currency="$"}}</div>
</template>
```

Additionally a helper can be called as a nested helper.
In this example, we show the formatted currency value if the `showMoney`
named argument is truthy.

```gjs
import formatCurrency from '../helpers/format-currency';

<template>
{{if @showMoney (formatCurrency @cents currency="$")}}
</template>
```

Helpers defined using a class must provide a `compute` function. For example:

```app/helpers/format-currency.js
import Helper from '@ember/component/helper';

export default class extends Helper {
compute([cents], { currency }) {
return `${currency}${cents * 0.01}`;
}
}
```

Each time the input to a helper changes, the `compute` function will be
called again.

As instances, these helpers also have access to the container and will accept
injected dependencies.

Additionally, class helpers can call `recompute` to force a new computation.

@class Helper
@extends CoreObject
@public
@since 1.13.0
*/
var Helper = class extends FrameworkObject {
	static isHelperFactory = true;
	static [IS_CLASSIC_HELPER] = true;
	/** @deprecated */
	static helper = helper;
	init(properties) {
		super.init(properties);
		this[RECOMPUTE_TAG] = createTag();
	}
	/**
	On a class-based helper, it may be useful to force a recomputation of that
	helpers value. This is akin to `rerender` on a component.
	In most cases, `recompute` is not needed because accessing tracked
	properties in `compute` will automatically re-run the helper when
	those properties change. Use `recompute` only when you need to
	trigger a recomputation imperatively, for example in response to an
	external event:
	```app/helpers/current-time.js
	import Helper from '@ember/component/helper';
	export default class CurrentTimeHelper extends Helper {
	interval = null;
	compute() {
	return new Date().toLocaleTimeString();
	}
	constructor() {
	super(...arguments);
	this.interval = setInterval(() => this.recompute(), 1000);
	}
	willDestroy() {
	super.willDestroy();
	clearInterval(this.interval);
	}
	}
	```
	@method recompute
	@public
	@since 1.13.0
	*/
	recompute() {
		join(() => DIRTY_TAG(this[RECOMPUTE_TAG]));
	}
};
var ClassicHelperManager = class {
	capabilities = helperCapabilities("3.23", {
		hasValue: true,
		hasDestroyable: true
	});
	ownerInjection;
	constructor(owner) {
		let ownerInjection = {};
		setOwner(ownerInjection, owner);
		this.ownerInjection = ownerInjection;
	}
	createHelper(definition, args) {
		return {
			instance: isFactoryManager(definition) ? definition.create() : definition.create(this.ownerInjection),
			args
		};
	}
	getDestroyable({ instance }) {
		return instance;
	}
	getValue({ instance, args }) {
		let { positional, named } = args;
		let ret = instance.compute(positional, named);
		consumeTag(instance[RECOMPUTE_TAG]);
		return ret;
	}
	getDebugName(definition) {
		return getDebugName((definition.class || definition)["prototype"]);
	}
};
function isFactoryManager(obj) {
	return obj != null && "class" in obj;
}
setHelperManager((owner) => {
	return new ClassicHelperManager(owner);
}, Helper);
var Wrapper = class {
	isHelperFactory = true;
	constructor(compute) {
		this.compute = compute;
	}
	create() {
		return { compute: this.compute };
	}
};
var SimpleClassicHelperManager = class {
	capabilities = helperCapabilities("3.23", { hasValue: true });
	createHelper(definition, args) {
		return () => definition.compute.call(null, args.positional, args.named);
	}
	getValue(fn) {
		return fn();
	}
	getDebugName(definition) {
		return getDebugName(definition.compute);
	}
};
var SIMPLE_CLASSIC_HELPER_MANAGER = new SimpleClassicHelperManager();
setHelperManager(() => SIMPLE_CLASSIC_HELPER_MANAGER, Wrapper.prototype);
/**
* The type of a function-based helper.
*
* @note This is *not* user-constructible: it is exported only so that the type
*   returned by the `helper` function can be named (and indeed can be exported
*   like `export default helper(...)` safely).
*/
/**
In many cases it is not necessary to use the full `Helper` class.
The `helper` method create pure-function helpers without instances.
For example:

```app/helpers/format-currency.js
import { helper } from '@ember/component/helper';

export default helper(function([cents], {currency}) {
return `${currency}${cents * 0.01}`;
});
```

@static
@param {Function} helper The helper function
@method helper
@for @ember/component/helper
@public
@since 1.13.0
*/
function helper(helperFn) {
	return new Wrapper(helperFn);
}
//#endregion
export { helper as n, Helper as t };
