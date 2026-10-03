import { l as registerDestructor } from "./destroyable-BW6N5j2P.js";
import { b as createUpdatableTag } from "./cache-CofLhaS4-CWmaBWeq.js";
import { S as valueForRef } from "./args-proxy-CCoFtYLS-kXP-sF3L.js";
import { p as setInternalModifierManager } from "./api-DlJKfm_f-6K6h1LXZ.js";
import { f as check } from "./arguments-Carzx7C4-snfB_1Hj.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/on-B-5KCq9L.js
var OnModifierState = class {
	tag = createUpdatableTag();
	element;
	args;
	listener = null;
	constructor(element, args) {
		this.element = element;
		this.args = args;
		registerDestructor(this, () => {
			let { element, listener } = this;
			if (listener) {
				let { eventName, callback, options } = listener;
				removeEventListener(element, eventName, callback, options);
			}
		});
	}
	updateListener() {
		let { element, args, listener } = this;
		let arg0 = args.positional[0];
		let eventName = check(arg0 ? valueForRef(arg0) : void 0);
		let arg1 = args.positional[1];
		let userProvidedCallback = check(arg1 ? valueForRef(arg1) : void 0);
		let once = void 0;
		let passive = void 0;
		let capture = void 0;
		{
			let { once: _once, passive: _passive, capture: _capture } = args.named;
			if (_once) once = valueForRef(_once);
			if (_passive) passive = valueForRef(_passive);
			if (_capture) capture = valueForRef(_capture);
		}
		let shouldUpdate = false;
		if (listener === null) shouldUpdate = true;
		else shouldUpdate = eventName !== listener.eventName || userProvidedCallback !== listener.userProvidedCallback || once !== listener.once || passive !== listener.passive || capture !== listener.capture;
		let options = void 0;
		if (shouldUpdate) {
			if (once !== void 0 || passive !== void 0 || capture !== void 0) options = {
				once,
				passive,
				capture
			};
		}
		if (shouldUpdate) {
			let callback = userProvidedCallback;
			this.listener = {
				eventName,
				callback,
				userProvidedCallback,
				once,
				passive,
				capture,
				options
			};
			if (listener) removeEventListener(element, listener.eventName, listener.callback, listener.options);
			addEventListener(element, eventName, callback, options);
		}
	}
};
var adds = 0;
var removes = 0;
function removeEventListener(element, eventName, callback, options) {
	removes++;
	element.removeEventListener(eventName, callback, options);
}
function addEventListener(element, eventName, callback, options) {
	adds++;
	element.addEventListener(eventName, callback, options);
}
/**
@module @ember/helper
*/
/**
The `{{on}}` modifier lets you easily add event listeners (it uses
[EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
internally).

For example, if you'd like to run a function on your component when a `<button>`
in the components template is clicked you might do something like:

```gjs {data-filename="app/components/like-post.gjs"}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LikePost extends Component {
@action
saveLike() {
// someone likes your post!
// better send a request off to your server...
}

<template>
<button {{on 'click' this.saveLike}}>Like this post!</button>
</template>
}
```

### Arguments

`{{on}}` accepts two positional arguments, and a few named arguments.

The positional arguments are:

- `event` -- the name to use when calling `addEventListener`
- `callback` -- the function to be passed to `addEventListener`

The named arguments are:

- capture -- a `true` value indicates that events of this type will be dispatched
to the registered listener before being dispatched to any EventTarget beneath it
in the DOM tree.
- once -- indicates that the listener should be invoked at most once after being
added. If true, the listener would be automatically removed when invoked.
- passive -- if `true`, indicates that the function specified by listener will never
call preventDefault(). If a passive listener does call preventDefault(), the user
agent will do nothing other than generate a console warning. See
[Improving scrolling performance with passive listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners)
to learn more.

The callback function passed to `{{on}}` will receive any arguments that are passed
to the event handler. Most commonly this would be the `event` itself.

If you would like to pass additional arguments to the function you should use
the `{{fn}}` helper.

For example, in our example case above if you'd like to pass in the post that
was being liked when the button is clicked you could do something like:

```hbs
<button {{on 'click' (fn this.saveLike @post)}}>Like this post!</button>
```

In this case, the `saveLike` function will receive two arguments: the click event
and the value of `@post`.

### Function Context

In the example above, we used `@action` to ensure that `likePost` is
properly bound to the `LikePost` Component, but let's explore what happens if we
left out `@action`:

```gjs {data-filename="app/components/like-post.gjs"}
import Component from '@glimmer/component';

export default class LikePost extends Component {
saveLike() {
// ...snip...
}
}
```

In this example, when the button is clicked `saveLike` will be invoked,
it will **not** have access to the component instance. In other
words, it will have no `this` context, so please make sure your functions
are bound (via `@action` or other means) before passing into `on`!

The `on` modifier is a keyword and does not need to be imported.

@method on
@static
@for Keywords
@noimport
@public
@since 3.11.0
*/
var OnModifierManager = class {
	getDebugName() {
		return "on";
	}
	getDebugInstance() {
		return null;
	}
	get counters() {
		return {
			adds,
			removes
		};
	}
	create(_owner, element, _state, args) {
		return new OnModifierState(element, args);
	}
	getTag({ tag }) {
		return tag;
	}
	install(state) {
		state.updateListener();
	}
	update(state) {
		state.updateListener();
	}
	getDestroyable(state) {
		return state;
	}
};
var on = setInternalModifierManager(new OnModifierManager(), {});
//#endregion
export { on as t };
