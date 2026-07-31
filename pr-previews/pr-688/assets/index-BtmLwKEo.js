import { d$ as trackedMap, e0 as trackedWeakMap, e1 as esCompat, g as get, e2 as decorateFieldV2, n as tracked, e3 as initializeDeferredDecorator, e4 as Component, s as setComponentTemplate, i as templateFactory, e5 as hash, l as decorateFieldV2$1, m as initializeDeferredDecorator$1, t as templateOnly, o as on, w as waitForPromise, k as resource, e6 as associateDestroyableChild, e7 as isDestroyed, e8 as isDestroying, p as resourceFactory, e9 as cell, ea as ElementHelper, eb as modifier, r as registerDestructor, ec as decorateMethodV2, ed as buildWaiter, aS as cached, ee as link, ef as ExternalLink, v as guidFor, eg as Popover, j as fn, eh as TrackedSet, ei as isElement, ej as assert, ek as schedule, el as uniqueId, em as Provide, en as Consume, eo as htmlSafe } from './main-BBIjcnFw.js';
export { ep as Scroller, eq as Shadowed, er as Switch, es as service } from './main-BBIjcnFw.js';
export { Form } from './form-Bx8fB-aJ.js';
import { Z as setTabsterAttribute, X as getTabsterAttribute, w as getTabster, o as MoverDirections } from './Tabster-ziHwev4V.js';
import './index-dGgzbTWI.js';

const mapConfig = {
  equals: () => false,
  description: 'TrackedMap from tracked-built-ins'
};
const weakMapConfig = {
  equals: () => false,
  description: 'TrackedWeakMap from tracked-built-ins'
};
let TrackedMap$1 = class TrackedMap {
  constructor(existing) {
    const reactive = trackedMap(existing, mapConfig);
    return new Proxy(reactive, {
      get(target, prop) {
        const value = Reflect.get(target, prop, target);
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },
      getPrototypeOf() {
        return TrackedMap.prototype;
      }
    });
  }
};
class TrackedWeakMap {
  constructor(values) {
    const reactive = trackedWeakMap(values, weakMapConfig);
    return new Proxy(reactive, {
      get(target, prop) {
        const value = Reflect.get(target, prop, target);
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },
      getPrototypeOf() {
        return TrackedWeakMap.prototype;
      }
    });
  }
}

// Ensure instanceof works correctly
Object.setPrototypeOf(TrackedMap$1.prototype, Map.prototype);
Object.setPrototypeOf(TrackedWeakMap.prototype, WeakMap.prototype);

const _importSync20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  TrackedMap: TrackedMap$1,
  TrackedWeakMap
}, Symbol.toStringTag, { value: 'Module' }));

let TrackedMap;

/**
 * https://rfcs.emberjs.com/id/1068-tracked-collections
 */
{
  const module = esCompat(_importSync20);
  TrackedMap = module.TrackedMap;
}

class Meta {
  prevRemote;
  peek;
  static {
    decorateFieldV2(this.prototype, "value", [tracked]);
  }
  #value = (initializeDeferredDecorator(this, "value"), void 0);
}
function getOrCreateMeta(instance, metas, initializer) {
  let meta = metas.get(instance);
  if (meta === undefined) {
    meta = new Meta();
    metas.set(instance, meta);
    meta.value = meta.peek = initializer;
  }
  return meta;
}
function localCopy(memo, initializer, comparator = (a, b) => a === b) {
  let metas = new WeakMap();
  return (/* prototype, key, desc */
  ) => {
    let memoFn = obj => get(obj, memo);
    return {
      get() {
        let meta = getOrCreateMeta(this, metas, initializer);
        let {
          prevRemote
        } = meta;
        let incomingValue = memoFn(this);
        if (!comparator(prevRemote, incomingValue)) {
          // If the incoming value is not the same as the previous incoming value,
          // update the local value to match the new incoming value, and update
          // the previous incoming value.
          meta.value = meta.prevRemote = incomingValue;
        }
        return meta.value;
      },
      set(value) {
        if (!metas.has(this)) {
          let meta = getOrCreateMeta(this, metas, initializer);
          meta.prevRemote = memoFn(this);
          meta.value = value;
          return;
        }
        getOrCreateMeta(this, metas, initializer).value = value;
      }
    };
  };
}

class AccordionContent extends Component {
  static {
    setComponentTemplate(templateFactory(
    /*
      <div role="region" id={{@value}} data-state={{getDataState @isExpanded}} hidden={{this.isHidden}} data-disabled={{@disabled}} ...attributes>
      {{yield}}
    </div>
    */
    {
      "id": "n72vmwDx",
      "block": "[[[11,0],[24,\"role\",\"region\"],[16,1,[30,1]],[16,\"data-state\",[28,[32,0],[[30,2]],null]],[16,\"hidden\",[30,0,[\"isHidden\"]]],[16,\"data-disabled\",[30,3]],[17,4],[12],[1,\"\\n  \"],[18,5,null],[1,\"\\n\"],[13]],[\"@value\",\"@isExpanded\",\"@disabled\",\"&attrs\",\"&default\"],[\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [getDataState],
      "isStrictMode": true
    }), this);
  }
  get isHidden() {
    return !this.args.isExpanded;
  }
}
const AccordionTrigger = setComponentTemplate(templateFactory(
/*
  <button type="button" aria-controls={{@value}} aria-expanded={{@isExpanded}} data-state={{getDataState @isExpanded}} data-disabled={{@disabled}} aria-disabled={{if @disabled "true" "false"}} {{on "click" @toggleItem}} ...attributes>
  {{yield}}
</button>
*/
{
  "id": "ee95DtJE",
  "block": "[[[11,\"button\"],[24,4,\"button\"],[16,\"aria-controls\",[30,1]],[16,\"aria-expanded\",[30,2]],[16,\"data-state\",[28,[32,0],[[30,2]],null]],[16,\"data-disabled\",[30,3]],[16,\"aria-disabled\",[52,[30,3],\"true\",\"false\"]],[17,4],[4,[32,1],[\"click\",[30,5]],null],[12],[1,\"\\n  \"],[18,6,null],[1,\"\\n\"],[13]],[\"@value\",\"@isExpanded\",\"@disabled\",\"&attrs\",\"@toggleItem\",\"&default\"],[\"if\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [getDataState, on],
  "isStrictMode": true
}), templateOnly(undefined, "accordion:AccordionTrigger"));
const AccordionHeader = setComponentTemplate(templateFactory(
/*
  <div role="heading" aria-level="3" data-state={{getDataState @isExpanded}} data-disabled={{@disabled}} ...attributes>
  {{yield (hash Trigger=(component Trigger value=@value isExpanded=@isExpanded disabled=@disabled toggleItem=@toggleItem))}}
</div>
*/
{
  "id": "+jXJYORP",
  "block": "[[[11,0],[24,\"role\",\"heading\"],[24,\"aria-level\",\"3\"],[16,\"data-state\",[28,[32,0],[[30,1]],null]],[16,\"data-disabled\",[30,2]],[17,3],[12],[1,\"\\n  \"],[18,6,[[28,[32,1],null,[[\"Trigger\"],[[50,[32,2],0,null,[[\"value\",\"isExpanded\",\"disabled\",\"toggleItem\"],[[30,4],[30,1],[30,2],[30,5]]]]]]]]],[1,\"\\n\"],[13]],[\"@isExpanded\",\"@disabled\",\"&attrs\",\"@value\",\"@toggleItem\",\"&default\"],[\"yield\",\"component\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [getDataState, hash, AccordionTrigger],
  "isStrictMode": true
}), templateOnly(undefined, "accordion:AccordionHeader"));
function getDataState(isExpanded) {
  return isExpanded ? "open" : "closed";
}
class AccordionItem extends Component {
  static {
    setComponentTemplate(templateFactory(
    /*
      <div data-state={{getDataState this.isExpanded}} data-disabled={{@disabled}} ...attributes>
      {{yield (hash isExpanded=this.isExpanded Header=(component Header value=@value isExpanded=this.isExpanded disabled=@disabled toggleItem=this.toggleItem) Content=(component Content value=@value isExpanded=this.isExpanded disabled=@disabled))}}
    </div>
    */
    {
      "id": "Ys5P8jX1",
      "block": "[[[11,0],[16,\"data-state\",[28,[32,0],[[30,0,[\"isExpanded\"]]],null]],[16,\"data-disabled\",[30,1]],[17,2],[12],[1,\"\\n  \"],[18,4,[[28,[32,1],null,[[\"isExpanded\",\"Header\",\"Content\"],[[30,0,[\"isExpanded\"]],[50,[32,2],0,null,[[\"value\",\"isExpanded\",\"disabled\",\"toggleItem\"],[[30,3],[30,0,[\"isExpanded\"]],[30,1],[30,0,[\"toggleItem\"]]]]],[50,[32,3],0,null,[[\"value\",\"isExpanded\",\"disabled\"],[[30,3],[30,0,[\"isExpanded\"]],[30,1]]]]]]]]],[1,\"\\n\"],[13]],[\"@disabled\",\"&attrs\",\"@value\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [getDataState, hash, AccordionHeader, AccordionContent],
      "isStrictMode": true
    }), this);
  }
  get isExpanded() {
    if (Array.isArray(this.args.selectedValue)) {
      return this.args.selectedValue.includes(this.args.value);
    }
    return this.args.selectedValue === this.args.value;
  }
  toggleItem = () => {
    if (this.args.disabled) return;
    this.args.toggleItem(this.args.value);
  };
}
class Accordion extends Component {
  static {
    setComponentTemplate(templateFactory(
    /*
      <div data-disabled={{@disabled}} ...attributes>
      {{yield (hash Item=(component AccordionItem selectedValue=this.selectedValue toggleItem=this.toggleItem disabled=@disabled))}}
    </div>
    */
    {
      "id": "skEOo7z0",
      "block": "[[[11,0],[16,\"data-disabled\",[30,1]],[17,2],[12],[1,\"\\n  \"],[18,3,[[28,[32,0],null,[[\"Item\"],[[50,[32,1],0,null,[[\"selectedValue\",\"toggleItem\",\"disabled\"],[[30,0,[\"selectedValue\"]],[30,0,[\"toggleItem\"]],[30,1]]]]]]]]],[1,\"\\n\"],[13]],[\"@disabled\",\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [hash, AccordionItem],
      "isStrictMode": true
    }), this);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  static {
    decorateFieldV2$1(this.prototype, "_internallyManagedValue", [localCopy("args.defaultValue")]);
  }
  #_internallyManagedValue = (initializeDeferredDecorator$1(this, "_internallyManagedValue"), void 0);
  get selectedValue() {
    return this.args.value ?? this._internallyManagedValue;
  }
  toggleItem = value => {
    if (this.args.disabled) {
      return;
    }
    if (this.args.type === "single") {
      this.toggleItemSingle(value);
    } else if (this.args.type === "multiple") {
      this.toggleItemMultiple(value);
    }
  };
  toggleItemSingle = value => {
    if (value === this.selectedValue && !this.args.collapsible) {
      return;
    }
    const newValue = value === this.selectedValue ? undefined : value;
    if (this.args.onValueChange) {
      this.args.onValueChange(newValue);
    } else {
      this._internallyManagedValue = newValue;
    }
  };
  toggleItemMultiple = value => {
    const currentValues = this.selectedValue ?? [];
    const indexOfValue = currentValues.indexOf(value);
    let newValue;
    if (indexOfValue === -1) {
      newValue = [...currentValues, value];
    } else {
      newValue = [...currentValues.slice(0, indexOfValue), ...currentValues.slice(indexOfValue + 1)];
    }
    if (this.args.onValueChange) {
      this.args.onValueChange(newValue);
    } else {
      this._internallyManagedValue = newValue;
    }
  };
}

const promiseCache = new WeakMap();
const REASON_FUNCTION_EXCEPTION = `Passed function threw an exception`;
const REASON_PROMISE_REJECTION = `Promise rejected while waiting to resolve`;
class StateImpl {
  static {
    decorateFieldV2$1(this.prototype, "_isLoading", [tracked]);
  }
  #_isLoading = (initializeDeferredDecorator$1(this, "_isLoading"), void 0);
  /**
   * @private
   */
  static {
    decorateFieldV2$1(this.prototype, "_error", [tracked]);
  }
  #_error = (initializeDeferredDecorator$1(this, "_error"), void 0);
  /**
   * @private
   */
  static {
    decorateFieldV2$1(this.prototype, "_resolved", [tracked]);
  }
  #_resolved = (initializeDeferredDecorator$1(this, "_resolved"), void 0);
  /**
   * @private
   */
  #initial;
  constructor(fn, initial) {
    this.#initial = initial;
    try {
      var maybePromise = isThennable(fn) ? fn : isFunction(fn) ? fn() : fn;
    } catch (e) {
      this.#initial = {
        isLoading: false,
        error: {
          reason: REASON_FUNCTION_EXCEPTION,
          original: e
        }
      };
      return;
    }
    if (typeof maybePromise === 'object' && maybePromise !== null && 'then' in maybePromise) {
      waitForPromise(maybePromise.then(value => this._resolved = value).catch(error => this._error = {
        reason: REASON_PROMISE_REJECTION,
        original: error
      }).finally(() => this._isLoading = false));
      return;
    }
    this.#initial = {
      isLoading: false,
      error: null,
      resolved: maybePromise
    };
  }
  get isLoading() {
    return this._isLoading ?? this.#initial?.isLoading ?? false;
  }
  get error() {
    return this._error ?? this.#initial?.error ?? null;
  }
  get resolved() {
    return this._resolved ?? this.#initial?.resolved;
  }
  toJSON() {
    return {
      isLoading: this.isLoading,
      error: this.error,
      resolved: this.resolved
    };
  }
}
/**
 * Returns a reactive state for a given value, function, promise, or function that returns a promise.
 *
 * Also caches the result for the given value, so `getPromiseState` will become synchronous if the passed value
 * has already been resolved.
 *
 * Normally when trying to derive async state, you'll first need to invoke a function to get the promise from that function's return value.
 * With `getPromiseState`, a passed function will be invoked for you, so you can skip that step.
 *
 * @example
 * We can use `getPromiseState` to dynamically load and render a component
 *
 * ```gjs
 * import { getPromiseState } from 'reactiveweb/get-promise-state';
 *
 * let state = getPromiseState(() => import('./some-module/component'));
 *
 * <template>
 *   {{#if state.isLoading}}
 *     ... pending ...
 *   {{else if state.error}}
 *     oh no!
 *   {{else if state.resolved}}
 *     <state.resolved />
 *   {{/if}}
 * </template>
 * ```
 *
 * @example
 * `getPromiseState` can also be used in a class without `@cached`, because it maintains its own cache.
 * ```gjs
 * import Component from '@glimmer/component';
 * import { getPromiseState } from 'reactiveweb/get-promise-state';
 *
 * async function readFromSomewhere() { // implementation omitted for brevity
 * }
 *
 * export default class Demo extends Component {
 *   // doesn't matter how many times state is accessed, you get a stable state
 *   get state() {
 *     return getPromiseState(readFromSomewhere);
 *   }
 *
 *   <template>
 *     {{#if this.state.resolved}}
 *        ...
 *     {{/if}}
 *   </template>
 * }
 * ```
 *
 * @example
 * A reactively constructed function will also be used and have its result cached between uses
 *
 * ```gjs
 * import Component from '@glimmer/component';
 * import { getPromiseState } from 'reactiveweb/get-promise-state';
 *
 * async function readFromSomewhere() { // implementation omitted for brevity
 * }
 *
 * export default class Demo extends Component {
 *   // Note: the @cached is important here because we don't want repeat accesses
 *   //       to cause doAsync to be called again unless @id changes
 *   @cached
 *   get promise() {
 *     return this.doAsync(this.args.id);
 *   }
 *
 *   get state() {
 *     return getPromiseState(this.promise);
 *   }
 *
 *   <template>
 *     {{#if this.state.resolved}}
 *        ...
 *     {{/if}}
 *   </template>
 * }
 * ```
 *
 * NOTE: This `getPromiseState` is not a replacement for [WarpDrive](https://docs.warp-drive.io/)'s [getRequestState](https://www.npmjs.com/package/@warp-drive/ember#getrequeststate)
 *       namely, the `getPromiseState` in this library (reactiveweb) does not support futures, cancellation, or anything else specific to warp-drive.
 *
 *
 * --------------

_comparison of pure capability_

| . | reactiveweb | @warpdrive/ember |
| - | ----------- | ---------------- |
| use in module state[^module-state] | ✅ | ✅ |
| use in a getter[^cached-getter] | ✅ | ✅ |
| usable in template | ✅ | ✅  |
| immediate has resolved value for resolved promise | ✅  | ✅  |
| test waiter integration | ✅ | ✅ |
| allows non-promises (forgiving inputs) | ✅ | ❌ |
| can be used without build | ✅ | ❌[^warp-drive-no-build] |
| allows prepopulation of result cache by 3rd party | ❌ | ✅ |
| discriminated states (helpful for TS) | ❌[^needs-work] | ✅ |
| align with [allSettled's return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#return_value) | ❌[^needs-work] | ✅ |

[^warp-drive-no-build]: the warp-drive team is interested in this work, and wants to make REPLs and CDNs easier as well


All in all, they are very similar. The primary use case I had for creating my own is that I wanted dynamic module loading (with import) to be one line (shown in the first example).

reactiveweb's `getPromiseState` is made primarily for my needs in my own projects, and I don't intend to say anything negative about `@warp-drive`s `getPromiseState` -- I actually took a lot of code from it! it's a good tool.

These projects of slightly different goals, so some additional information:

_from the perspective of reactiveweb's_ set of goals:

| . | reactiveweb | @warpdrive/ember |
| - | ----------- | ---------------- |
| invokes a passed function automatically | ✅ | ❌ |
| simple state return[^state-compare] | ⚠️[^needs-work] | ⚠️ [^warp-drive-pending-deprecations] |

[^warp-drive-pending-deprecations]: has pending deprecations, otherwise ✅
[^needs-work]: This is fixable, and probably with little effort, just needs doing

_from the perspective of @warp-drive/core's set of goals_

| . | reactiveweb | @warpdrive/core |
| - | ----------- | ---------------- |
| has a simple API surface | ❌ [^invokes-functions] | ✅ |
| no dependencies | ❌ [^ember-resources] | ⚠️[^warp-drive-no-dependencies] |


[^invokes-functions]: `@warp-drive/core` strives for API simplicity, which means few (if any) overloads on its utilities.
[^warp-drive-no-dependencies]: Does not directly depend on any dependencies, but requires an integration into reactivity (which is technically true for `reactiveweb` as well)


[^module-state]: `getPromiseState(promise);`
[^cached-getter]: requires a stable reference to a promise. getter itself does not need to be cached.
[^no-dependencies]: warp-drive requires a macros config that isn't compatible with "non-config" projects (it's mostly how they generate macros to not gracefully have some behavior if you don't set up their required babel config -- which affects REPL environments (this is solveable via pushing the responsibility to configure babel to the REPLer)). Also, the warp-drive team says this is on their radar, and the'll address it eventually / soon.
[^ember-resources]: reactiveweb (as a whole) does depend on on ember-resources, but ember-resources itself has no dependencies (for real), and is a very tiny use of a helper manager. Additionally, `getPromiseState` does not depend on `ember-resources`.
[^wd-aliases]: warp-drive provides _many_ aliases for states, as well as support some extended promise behavior which is not built in to the platform (Futures, etc). This is still good for convenience and compatibility.
[^state-compare]: in reactiveweb: [State](https://reactive.nullvoxpopuli.com/interfaces/get-promise-state.State.html), and then in `@warp-drive/*`: the [`PromiseState`](https://warp-drive.io/api/@warp-drive/ember/type-aliases/PromiseState) is made of 3 sub types: [PendingPromise](https://warp-drive.io/api/@warp-drive/core/reactive/interfaces/PendingPromise), [ResolvedPromise](https://warp-drive.io/api/@warp-drive/core/reactive/interfaces/ResolvedPromise), and [RejectedPromise](https://warp-drive.io/api/@warp-drive/core/reactive/interfaces/RejectedPromise). Over time, these will align slightly with [allSettled's return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#return_value).
 *
 */
function getPromiseState(fn) {
  if (typeof fn !== 'function' && !isThennable(fn)) {
    return {
      isLoading: false,
      error: null,
      resolved: fn,
      toJSON() {
        return {
          isLoading: false,
          error: null,
          resolved: fn
        };
      }
    };
  }
  const existing = promiseCache.get(fn);
  if (existing) return existing;
  const state = new StateImpl(fn, {
    isLoading: true
  });
  promiseCache.set(fn, state);
  return state;
}
function isThennable(x) {
  if (typeof x !== 'object') return false;
  if (!x) return false;
  return 'then' in x;
}

/**
 * This exists because when you guard with typeof x === function normally in TS,
 * you just get `& Function` added to your type, which isn't exactly the narrowing I want.
 *
 * This can result in "Value & Function" has no call signatures....
 * which is kinda ridiculous.
 */
function isFunction(x) {
  return typeof x === 'function';
}

function trackedFunction(...args) {
  if (args.length === 1) {
    return classUsable(...args);
  }
  if (args.length === 2) {
    return directTrackedFunction(...args);
  }
}
const START = Symbol.for('__reactiveweb_trackedFunction__START__');
function classUsable(fn) {
  const state = new State(fn);
  const destroyable = resource(() => {
    state[START]();
    return state;
  });
  associateDestroyableChild(destroyable, state);
  return destroyable;
}
function directTrackedFunction(context, fn) {
  const state = new State(fn);
  const destroyable = resource(context, () => {
    state[START]();
    return state;
  });
  associateDestroyableChild(destroyable, state);
  return destroyable;
}

/**
 * State container that represents the asynchrony of a `trackedFunction`
 */
class State {
  static {
    decorateFieldV2$1(this.prototype, "promise", [tracked]);
  }
  #promise = (initializeDeferredDecorator$1(this, "promise"), void 0);
  static {
    decorateFieldV2$1(this.prototype, "caughtError", [tracked]);
  }
  #caughtError = (initializeDeferredDecorator$1(this, "caughtError"), void 0);
  /**
   * ember-async-data doesn't catch errors,
   * so we can't rely on it to protect us from "leaky errors"
   * during rendering.
   *
   * See also: https://github.com/qunitjs/qunit/issues/1736
   */
  #fn;
  constructor(fn) {
    this.#fn = fn;
  }
  get #state() {
    return getPromiseState(this.promise);
  }
  get state() {
    if (this.#state.isLoading) {
      return 'PENDING';
    }
    if (this.#state.resolved) {
      return 'RESOLVED';
    }
    if (this.#state.error) {
      return 'REJECTED';
    }
    return 'UNSTARTED';
  }

  /**
   * Initially true, and remains true
   * until the underlying promise resolves or rejects.
   */
  get isPending() {
    return this.#state.isLoading ?? false;
  }

  /**
   * Alias for `isResolved || isRejected`
   */
  get isFinished() {
    return this.isResolved || this.isRejected;
  }

  /**
   * Alias for `isFinished`
   * which is in turn an alias for `isResolved || isRejected`
   */
  get isSettled() {
    return this.isFinished;
  }

  /**
   * Alias for `isPending`
   */
  get isLoading() {
    return this.isPending;
  }

  /**
   * When true, the function passed to `trackedFunction` has resolved
   */
  get isResolved() {
    return Boolean(this.#state.resolved);
  }

  /**
   * Alias for `isRejected`
   */
  get isError() {
    return this.isRejected;
  }

  /**
   * When true, the function passed to `trackedFunction` has errored
   */
  get isRejected() {
    return Boolean(this.#state.error ?? this.caughtError ?? false);
  }

  /**
   * this.data may not exist yet.
   *
   * Additionally, prior iterations of TrackedAsyncData did
   * not allow the accessing of data before
   * .state === 'RESOLVED'  (isResolved).
   *
   * From a correctness standpoint, this is perfectly reasonable,
   * as it forces folks to handle the states involved with async functions.
   *
   * The original version of `trackedFunction` did not use TrackedAsyncData,
   * and did not have these strictnesses upon property access, leaving folks
   * to be as correct or as fast/prototype-y as they wished.
   *
   * For now, `trackedFunction` will retain that flexibility.
   */
  get value() {
    return this.#state.resolved ?? null;
  }

  /**
   * When the function passed to `trackedFunction` throws an error,
   * that error will be the value returned by this property
   */
  get error() {
    if (this.state === 'UNSTARTED' && this.caughtError) {
      return this.caughtError;
    }
    if (this.state !== 'REJECTED') {
      return null;
    }
    if (this.caughtError) {
      return this.caughtError;
    }
    return this.#state.error ?? null;
  }
  async [START]() {
    try {
      const promise = this._dangerousRetry({
        isRetrying: false
      });
      await waitForPromise(promise);
    } catch (e) {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.caughtError = e;
    }
  }

  /**
   * Will re-invoke the function passed to `trackedFunction`
   * this will also re-set some properties on the `State` instance.
   * This is the same `State` instance as before, as the `State` instance
   * is tied to the `fn` passed to `trackedFunction`
   *
   * `error` or `resolvedValue` will remain as they were previously
   * until this promise resolves, and then they'll be updated to the new values.
   */
  retry = async () => {
    try {
      /**
       * This function has two places where it can error:
       * - immediately when inovking `fn` (where auto-tracking occurs)
       * - after an await, "eventually"
       */
      const promise = this._dangerousRetry({
        isRetrying: true
      });
      await waitForPromise(promise);
    } catch (e) {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.caughtError = e;
    }
  };
  _dangerousRetry = async ({
    isRetrying
  }) => {
    if (isDestroyed(this) || isDestroying(this)) return;

    // We need to invoke this before going async so that tracked properties are consumed (entangled with) synchronously
    this.promise = this.#fn({
      isRetrying
    });

    // TrackedAsyncData interacts with tracked data during instantiation.
    // We don't want this internal state to entangle with `trackedFunction`
    // so that *only* the tracked data in `fn` can be entangled.
    await Promise.resolve();
    if (isDestroyed(this) || isDestroying(this)) return;

    /**
     * Before we await to start a new request, let's clear our error.
     * This is detached from the tracking frame (via the above await),
     * se the UI can update accordingly, without causing us to refetch
     */
    this.caughtError = null;
    /**
     * This looks weird, but we need to cerate the state cache if it doesn't exist already as well as prevent JIT from removing this l ine.
     */
    await this.#state.resolved;
    return this.promise;
  };
}

/**
 * Reactively load an Image with access to loading / error state.
 *
 * Usage in a component
 * ```js
 * import { ReactiveImage } from 'reactiveweb/image';
 * <template>
 *   {{#let (ReactiveImage 'https://path.to.image') as |state|}}
 *      {{#if imgState.isResolved}}
 *        <img src={{imgState.value}}>
 *      {{/if}}
 *   {{/let}}
 * </template>
 * ```
 *
 * Usage in a class
 * ```js
 * import { use } from 'ember-resources';
 * import { ReactiveImage } from 'reactiveweb/image';
 *
 * class Demo {
 *   @use imageState = ReactiveImage('https://path.to.image');
 * }
 * ```
 *
 * Reactive usage in a class
 * ```js
 * import { tracked } from '@glimmer/tracking';
 * import { use } from 'ember-resources';
 * import { ReactiveImage } from 'reactiveweb/image';
 *
 * class Demo {
 *   @tracked url = '...';
 *   @use imageState = ReactiveImage(() => this.url);
 * }
 * ```
 */
const ReactiveImage = resourceFactory(maybeUrl => {
  return resource(({
    use
  }) => {
    const readonlyReactive = use(trackedFunction(async () => {
      /**
       * NOTE: Image#onerror is a global error.
       *       So in testing, the error escapes the confines
       *       of this promise handler (trackedFunction)
       *
       * We need to "swallow the rejection" and re-throw
       * by wrapping in an extra promise.
       */
      const image = new window.Image();
      const url = typeof maybeUrl === 'function' ? maybeUrl() : maybeUrl;
      function loadImage() {
        /**
         * Note tha lack of reject callback.
         * This is what allows us to capture "global errors"
         * thrown by image.onerror
         *
         * Additionally, the global error does not have a stack trace.
         * And we want to provide a stack trace for easier debugging.
         *
         */
        return new Promise(resolve => {
          image.onload = resolve;

          /**
           * The error passed to onerror doesn't look that useful.
           *  But we'll log it just in case.
           *
           */
          image.onerror = error => {
            console.error(`Image failed to load at ${url}`, error);

            /**
             * If we use real reject, we cause an un-catchable error
             */
            resolve('soft-rejected');
          };
          image.src = url;
        });
      }
      return await loadImage();
    }));

    /**
     * Here we both forward the state of trackedFunction
     * as well as re-define how we want to determine what isError, value, and isResolved
     * mean.
     *
     * This is because trackedFunction does not capture errors.
     * I believe it _should_ though, so this may be a bug.
     *
     * If it ends up being a bug in trackedFunction,
     * then we can delete all this, and only do:
     *
     * return () => readonlyReactive.current;
     */
    const isError = () => readonlyReactive.current.value === 'soft-rejected';
    return {
      get isError() {
        return isError();
      },
      get value() {
        if (isError()) return null;
        return readonlyReactive.current.value;
      },
      get isResolved() {
        if (isError()) return false;
        return readonlyReactive.current.isResolved;
      },
      get isLoading() {
        return readonlyReactive.current.isLoading;
      }
    };
  });
});

/**
 * Reactively wait for a time.
 * uses setTimeout and cleans up if the caller is cleaned up.
 *
 * Usage in a template
 * ```hbs
 * {{#let (WaitUntil 500) as |delayFinished|}}
 *    {{#if delayFinished}}
 *
 *      text displayed after 500ms
 *
 *    {{/if}}
 * {{/let}}
 * ```
 */
const WaitUntil = resourceFactory(maybeDelayMs => {
  return resource(({
    on
  }) => {
    const delayMs = typeof maybeDelayMs === 'function' ? maybeDelayMs() : maybeDelayMs;

    // If we don't have a delay, we can start with
    // immediately saying "we're done waiting"
    const initialValue = delayMs ? false : true;
    const delayFinished = cell(initialValue);
    if (delayMs) {
      const timer = setTimeout(() => delayFinished.current = true, delayMs);
      on.cleanup(() => clearTimeout(timer));
    }

    // Collapse the state that Cell provides to just a boolean
    return () => delayFinished.current;
  });
});

const Fallback = setComponentTemplate(templateFactory(
/*
  {{#unless @isLoaded}}
  {{#let (WaitUntil @delayMs) as |delayFinished|}}
    {{#if delayFinished}}
      {{yield}}
    {{/if}}
  {{/let}}
{{/unless}}
*/
{
  "id": "8F26Kw9P",
  "block": "[[[41,[51,[30,1]],[[[44,[[28,[32,0],[[30,2]],null]],[[[41,[30,3],[[[1,\"      \"],[18,4,null],[1,\"\\n\"]],[]],null]],[3]]]],[]],null]],[\"@isLoaded\",\"@delayMs\",\"delayFinished\",\"&default\"],[\"unless\",\"let\",\"if\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [WaitUntil],
  "isStrictMode": true
}), templateOnly(undefined, "avatar:Fallback"));
const Image = setComponentTemplate(templateFactory(
/*
  {{#if @isLoaded}}
  <img alt="__missing__" ...attributes src={{@src}} />
{{/if}}
*/
{
  "id": "SzU63PLq",
  "block": "[[[41,[30,1],[[[1,\"  \"],[11,\"img\"],[24,\"alt\",\"__missing__\"],[17,2],[16,\"src\",[30,3]],[12],[13],[1,\"\\n\"]],[]],null]],[\"@isLoaded\",\"&attrs\",\"@src\"],[\"if\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "avatar:Image"));
const Avatar = setComponentTemplate(templateFactory(
/*
  {{#let (ReactiveImage @src) as |imgState|}}
  <span data-prim-avatar ...attributes data-loading={{imgState.isLoading}} data-error={{imgState.isError}}>
    {{yield (hash Image=(component Image src=@src isLoaded=imgState.isResolved) Fallback=(component Fallback isLoaded=imgState.isResolved) isLoading=imgState.isLoading isError=imgState.isError)}}
  </span>
{{/let}}
*/
{
  "id": "kqPEiEv+",
  "block": "[[[44,[[28,[32,0],[[30,1]],null]],[[[1,\"  \"],[11,1],[24,\"data-prim-avatar\",\"\"],[17,3],[16,\"data-loading\",[30,2,[\"isLoading\"]]],[16,\"data-error\",[30,2,[\"isError\"]]],[12],[1,\"\\n    \"],[18,4,[[28,[32,1],null,[[\"Image\",\"Fallback\",\"isLoading\",\"isError\"],[[50,[32,2],0,null,[[\"src\",\"isLoaded\"],[[30,1],[30,2,[\"isResolved\"]]]]],[50,[32,3],0,null,[[\"isLoaded\"],[[30,2,[\"isResolved\"]]]]],[30,2,[\"isLoading\"]],[30,2,[\"isError\"]]]]]]],[1,\"\\n  \"],[13],[1,\"\\n\"]],[2]]]],[\"@src\",\"imgState\",\"&attrs\",\"&default\"],[\"let\",\"yield\",\"component\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ReactiveImage, hash, Image, Fallback],
  "isStrictMode": true
}), templateOnly(undefined, "avatar:Avatar"));

function normalizeTagName(tagName) {
  return tagName.trim().toLowerCase();
}
function getElementTag(tagName) {
  if (tagName) return tagName;
  return "hr";
}
function roleFor(tagName, decorative) {
  if (decorative) return undefined;
  // <hr> already has implicit role="separator".
  if (normalizeTagName(tagName) === "hr") return undefined;
  return "separator";
}
function ariaHiddenFor(decorative) {
  return decorative ? "true" : undefined;
}
function ariaOrientationFor(orientation, decorative) {
  if (decorative) return undefined;
  // `separator` has an implicit aria-orientation of horizontal.
  // Only specify when authors opt in (e.g. vertical separators).
  return orientation;
}
function shouldYield(decorative, tagName) {
  // `<hr>` is a void element and must not have children.
  if (normalizeTagName(tagName) === "hr") return false;
  // Content inside a `separator` is presentational to AT; only yield for decorative
  // separators so consumers don't accidentally rely on it for semantics.
  return Boolean(decorative);
}
/**
 * A separator component that follows the ARIA `separator` role guidance.
 *
 * By default, this component renders a semantic separator (`<hr>`). When using a
 * non-`hr` tag via `@as`, it adds `role="separator"`.
 *
 * For purely decorative separators (e.g. breadcrumb slashes), set `@decorative={{true}}`
 * to apply `aria-hidden="true"`.
 *
 * For example:
 *
 * ```gjs live preview
 * import { Separator } from 'ember-primitives';
 *
 * <template>
 *   <nav>
 *     <ol style="display: flex; gap: 0.5rem; list-style: none; padding: 0;">
 *       <li><a href="/">Home</a></li>
 *       <Separator @as="li" @decorative={{true}}>/</Separator>
 *       <li><a href="/docs">Docs</a></li>
 *       <Separator @as="li" @decorative={{true}}>/</Separator>
 *       <li>Current</li>
 *     </ol>
 *   </nav>
 * </template>
 * ```
 */
const Separator$1 = setComponentTemplate(templateFactory(
/*
  {{#let (getElementTag @as) as |tagName|}}
  {{#let (element tagName) as |El|}}
    <El aria-hidden={{ariaHiddenFor @decorative}} role={{roleFor tagName @decorative}} aria-orientation={{ariaOrientationFor @orientation @decorative}} ...attributes>
      {{#if (shouldYield @decorative tagName)}}
        {{yield}}
      {{/if}}
    </El>
  {{/let}}
{{/let}}
*/
{
  "id": "gMbtX6+D",
  "block": "[[[44,[[28,[32,0],[[30,1]],null]],[[[44,[[28,[32,1],[[30,2]],null]],[[[1,\"    \"],[8,[30,3],[[16,\"aria-hidden\",[28,[32,2],[[30,4]],null]],[16,\"role\",[28,[32,3],[[30,2],[30,4]],null]],[16,\"aria-orientation\",[28,[32,4],[[30,5],[30,4]],null]],[17,6]],null,[[\"default\"],[[[[1,\"\\n\"],[41,[28,[32,5],[[30,4],[30,2]],null],[[[1,\"        \"],[18,7,null],[1,\"\\n\"]],[]],null],[1,\"    \"]],[]]]]],[1,\"\\n\"]],[3]]]],[2]]]],[\"@as\",\"tagName\",\"El\",\"@decorative\",\"@orientation\",\"&attrs\",\"&default\"],[\"let\",\"if\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [getElementTag, ElementHelper, ariaHiddenFor, roleFor, ariaOrientationFor, shouldYield],
  "isStrictMode": true
}), templateOnly(undefined, "separator:Separator"));

const Breadcrumb = setComponentTemplate(templateFactory(
/*
  <nav aria-label={{if @label @label "Breadcrumb"}} ...attributes>
  <ol>
    {{yield (hash Separator=(component Separator as="li" decorative=true))}}
  </ol>
</nav>
*/
{
  "id": "9YlYc/Fb",
  "block": "[[[11,\"nav\"],[16,\"aria-label\",[52,[30,1],[30,1],\"Breadcrumb\"]],[17,2],[12],[1,\"\\n  \"],[10,\"ol\"],[12],[1,\"\\n    \"],[18,3,[[28,[32,0],null,[[\"Separator\"],[[50,[32,1],0,null,[[\"as\",\"decorative\"],[\"li\",true]]]]]]]],[1,\"\\n  \"],[13],[1,\"\\n\"],[13]],[\"@label\",\"&attrs\",\"&default\"],[\"if\",\"yield\",\"component\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [hash, Separator$1],
  "isStrictMode": true
}), templateOnly(undefined, "breadcrumb:Breadcrumb"));

const DialogElement = setComponentTemplate(templateFactory(
/*
  <dialog ...attributes open={{@open}} {{on "close" @onClose}} {{@register}}>
  {{yield}}
</dialog>
*/
{
  "id": "3Zxl8D7f",
  "block": "[[[11,\"dialog\"],[17,1],[16,\"open\",[30,2]],[4,[32,0],[\"close\",[30,3]],null],[4,[30,4],null,null],[12],[1,\"\\n  \"],[18,5,null],[1,\"\\n\"],[13]],[\"&attrs\",\"@open\",\"@onClose\",\"@register\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on],
  "isStrictMode": true
}), templateOnly(undefined, "dialog:DialogElement"));
class ModalDialog extends Component {
  static {
    setComponentTemplate(templateFactory(
    /*
      {{yield (hash isOpen=this.isOpen open=this.open close=this.close focusOnClose=this.refocus Dialog=(component DialogElement open=@open onClose=this.handleClose register=this.register))}}
    */
    {
      "id": "pRnXPF1c",
      "block": "[[[18,2,[[28,[32,0],null,[[\"isOpen\",\"open\",\"close\",\"focusOnClose\",\"Dialog\"],[[30,0,[\"isOpen\"]],[30,0,[\"open\"]],[30,0,[\"close\"]],[30,0,[\"refocus\"]],[50,[32,1],0,null,[[\"open\",\"onClose\",\"register\"],[[30,1],[30,0,[\"handleClose\"]],[30,0,[\"register\"]]]]]]]]]]],[\"@open\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [hash, DialogElement],
      "isStrictMode": true
    }), this);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  static {
    decorateFieldV2$1(this.prototype, "_isOpen", [localCopy("args.open")]);
  }
  #_isOpen = (initializeDeferredDecorator$1(this, "_isOpen"), void 0);
  get isOpen() {
    /**
    * Always fallback to false (closed)
    */
    return this._isOpen ?? false;
  }
  set isOpen(val) {
    this._isOpen = val;
  }
  #lastIsOpen = false;
  refocus = modifier(element => {
    if (!this.isOpen && this.#lastIsOpen) {
      element.focus();
    }
    this.#lastIsOpen = this.isOpen;
  });
  static {
    decorateFieldV2$1(this.prototype, "dialogElement", [tracked]);
  }
  #dialogElement = (initializeDeferredDecorator$1(this, "dialogElement"), void 0);
  register = modifier(element => {
    /**
    * This is very sad.
    *
    * But we need the element to be 'root state'
    * so that when we read things like "isOpen",
    * when the dialog is finally rendered, all the
    * downstream properties render.
    *
    * This has to be an async / delayed a bit, so that
    * the tracking frame can exit, and we don't infinite loop
    */
    void (async () => {
      await Promise.resolve();
      this.dialogElement = element;
    })();
  });
  /**
  * Closes the dialog -- this will throw an error in development if the dialog element was not rendered
  */
  close = () => {
    /**
    * If the element is already closed, don't run all this again
    */
    if (!this.dialogElement.hasAttribute("open")) {
      return;
    }
    /**
    * removes the `open` attribute
    * handleClose will be called because the dialog has bound the `close` event.
    */
    this.dialogElement.close();
  };
  /**
  * @internal
  *
  * handles the <dialog> element's native close behavior.
  * listened to via addEventListener('close', ...);
  */
  handleClose = () => {
    this.isOpen = false;
    this.args.onClose?.(this.dialogElement.returnValue);
    // the return value ends up staying... which is annoying
    this.dialogElement.returnValue = "";
  };
  /**
  * Opens the dialog -- this will throw an error in development if the dialog element was not rendered
  */
  open = () => {
    /**
    * If the element is already open, don't run all this again
    */
    if (this.dialogElement.hasAttribute("open")) {
      return;
    }
    /**
    * adds the `open` attribute
    */
    this.dialogElement.showModal();
    this.isOpen = true;
  };
}
const Dialog = ModalDialog;

const DrawerElement = setComponentTemplate(templateFactory(
/*
  <dialog ...attributes open={{@open}} {{on "close" @onClose}} {{@register}}>
  {{yield}}
</dialog>
*/
{
  "id": "3Zxl8D7f",
  "block": "[[[11,\"dialog\"],[17,1],[16,\"open\",[30,2]],[4,[32,0],[\"close\",[30,3]],null],[4,[30,4],null,null],[12],[1,\"\\n  \"],[18,5,null],[1,\"\\n\"],[13]],[\"&attrs\",\"@open\",\"@onClose\",\"@register\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on],
  "isStrictMode": true
}), templateOnly(undefined, "drawer:DrawerElement"));
class DrawerDialog extends Component {
  static {
    setComponentTemplate(templateFactory(
    /*
      {{yield (hash isOpen=this.isOpen open=this.open close=this.close focusOnClose=this.refocus Drawer=(component DrawerElement open=@open onClose=this.handleClose register=this.register))}}
    */
    {
      "id": "DkrnXB5n",
      "block": "[[[18,2,[[28,[32,0],null,[[\"isOpen\",\"open\",\"close\",\"focusOnClose\",\"Drawer\"],[[30,0,[\"isOpen\"]],[30,0,[\"open\"]],[30,0,[\"close\"]],[30,0,[\"refocus\"]],[50,[32,1],0,null,[[\"open\",\"onClose\",\"register\"],[[30,1],[30,0,[\"handleClose\"]],[30,0,[\"register\"]]]]]]]]]]],[\"@open\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [hash, DrawerElement],
      "isStrictMode": true
    }), this);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  static {
    decorateFieldV2$1(this.prototype, "_isOpen", [localCopy("args.open")]);
  }
  #_isOpen = (initializeDeferredDecorator$1(this, "_isOpen"), void 0);
  get isOpen() {
    /**
    * Always fallback to false (closed)
    */
    return this._isOpen ?? false;
  }
  set isOpen(val) {
    this._isOpen = val;
  }
  #lastIsOpen = false;
  refocus = modifier(element => {
    if (!this.isOpen && this.#lastIsOpen) {
      element.focus();
    }
    this.#lastIsOpen = this.isOpen;
  });
  static {
    decorateFieldV2$1(this.prototype, "drawerElement", [tracked]);
  }
  #drawerElement = (initializeDeferredDecorator$1(this, "drawerElement"), void 0);
  register = modifier(element => {
    /**
    * This is very sad.
    *
    * But we need the element to be 'root state'
    * so that when we read things like "isOpen",
    * when the drawer is finally rendered, all the
    * downstream properties render.
    *
    * This has to be an async / delayed a bit, so that
    * the tracking frame can exit, and we don't infinite loop
    */
    void (async () => {
      await Promise.resolve();
      this.drawerElement = element;
    })();
  });
  /**
  * Closes the drawer -- this will throw an error in development if the drawer element was not rendered
  */
  close = () => {
    /**
    * If the element is already closed, don't run all this again
    */
    if (!this.drawerElement.hasAttribute("open")) {
      return;
    }
    /**
    * removes the `open` attribute
    * handleClose will be called because the drawer has bound the `close` event.
    */
    this.drawerElement.close();
  };
  /**
  * @internal
  *
  * handles the <dialog> element's native close behavior.
  * listened to via addEventListener('close', ...);
  */
  handleClose = () => {
    this.isOpen = false;
    this.args.onClose?.(this.drawerElement.returnValue);
    // the return value ends up staying... which is annoying
    this.drawerElement.returnValue = "";
  };
  /**
  * Opens the drawer -- this will throw an error in development if the drawer element was not rendered
  */
  open = () => {
    /**
    * If the element is already open, don't run all this again
    */
    if (this.drawerElement.hasAttribute("open")) {
      return;
    }
    /**
    * adds the `open` attribute
    */
    this.drawerElement.showModal();
    this.isOpen = true;
  };
}
const Drawer = DrawerDialog;

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_INITIAL = "sync";
const waiter$3 = buildWaiter("ember-primitives:incremental-each");
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
// Safari has `requestIdleCallback` behind a flag, effectively absent
// for end users. Fall back to `setTimeout(cb, 0)` — Safari users get
// the chunking benefit (one batch per task) without the idle-priority
// hint that other browsers honor.
const ric = typeof requestIdleCallback === "function" ? requestIdleCallback : cb => setTimeout(() => cb({
  timeRemaining: () => 0,
  didTimeout: true
}), 0);
/**
 * A drop-in replacement for `{{#each}}` that renders a large collection
 * a batch at a time on each animation frame, instead of all at once.
 *
 * Every item ends up in the DOM, so browser find (Ctrl+F / Cmd+F), anchor
 * links, screen readers, print, and SEO all work against the full list.
 * Yielding the main thread between batches keeps the page responsive while
 * the rest of the list is filling in.
 *
 * By default the first batch lands synchronously, so the user sees content
 * on the very first paint. Pass `@initial="lazy"` to defer the first batch
 * to an animation frame as well.
 *
 * Intended for non-scrollable containers, or anywhere a virtual/windowed
 * list does not apply (variable item heights, lists that grow the page,
 * surfaces that need every row indexable).
 *
 * Do not nest one `<IncrementalEach>` inside another. Each level adds an
 * animation-frame delay before its content paints; nesting compounds those
 * delays, so inner rows appear to flicker in with missing sub-content.
 * If you have nested loops, only the outermost one should be
 * `<IncrementalEach>`; leave deeper loops as plain `{{#each}}`.
 *
 * @example
 * ```gjs
 * import { IncrementalEach } from 'ember-primitives';
 *
 * <template>
 *   <ul>
 *     <IncrementalEach @items={{this.rows}} @batchSize={{100}} as |row index|>
 *       <li>{{index}}: {{row.label}}</li>
 *     </IncrementalEach>
 *   </ul>
 * </template>
 * ```
 */
class IncrementalEach extends Component {
  #count = cell(0);
  #itemsRef = null;
  #waiterToken = null;
  #doneFor = null;
  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, () => this.#endWaiter());
  }
  // Reset progress and (re)open the test-waiter when `@items` identity
  // changes, so a swap restarts at the first batch, `@onDone` can fire
  // again for the new collection, and `await settled()` knows to wait
  // until `checkDone` closes the waiter. Mutating from a getter is safe
  // here because the writes happen before any consumer reads them in
  // the same render pass.
  /* eslint-disable ember/no-side-effects */
  get #items() {
    const items = this.args.items;
    if (items !== this.#itemsRef) {
      this.#itemsRef = items;
      this.#count.current = 0;
      this.#endWaiter();
      if (items.length > 0) {
        this.#waiterToken = waiter$3.beginAsync();
      }
    }
    return items;
  }
  /* eslint-enable ember/no-side-effects */ // `"sync"` keeps bucket 0 visible at count=0 (`i = 0 >= 0`); `"lazy"`
  // starts one step behind so even bucket 0 needs a tick.
  get #start() {
    return this.#initial === "sync" ? 0 : -1;
  }
  get i() {
    return this.#start + this.#count.current;
  }
  get bucketed() {
    const size = this.#batchSize;
    return chunk(this.#items, size).map((items, b) => {
      const start = b * size;
      return {
        isReady: () => this.i >= b,
        items: items.map((value, j) => ({
          value,
          index: start + j
        }))
      };
    });
  }
  static {
    decorateMethodV2(this.prototype, "bucketed", [cached]);
  }
  get #batchSize() {
    const requested = this.args.batchSize ?? DEFAULT_BATCH_SIZE;
    return requested;
  }
  get #initial() {
    const requested = this.args.initial ?? DEFAULT_INITIAL;
    return requested;
  }
  // `#items` is read before `#count` so the count-reset inside `#items`
  // (on `@items` swap) lands before this read of count this render —
  // otherwise tracked-value backtracking asserts.
  tick = () => {
    if (this.#items.length > this.#count.current) {
      ric(() => this.#count.current++, {
        timeout: 10
      });
    }
  };
  checkDone = () => {
    const bucketed = this.bucketed;
    if (this.#doneFor === bucketed) return;
    if (this.i < bucketed.length - 1) return;
    this.#doneFor = bucketed;
    queueMicrotask(() => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.args.onDone?.();
      this.#endWaiter();
    });
  };
  #endWaiter() {
    if (this.#waiterToken) waiter$3.endAsync(this.#waiterToken);
  }
  static {
    setComponentTemplate(templateFactory(
    /*
      {{(this.tick)}}{{#each this.bucketed as |bucket|}}{{#if (bucket.isReady)}}{{#each bucket.items as |entry|}}{{yield entry.value entry.index}}{{/each}}{{(this.checkDone)}}{{/if}}{{/each}}
    */
    {
      "id": "MMDOkIUr",
      "block": "[[[1,[28,[30,0,[\"tick\"]],null,null]],[42,[28,[31,1],[[28,[31,1],[[30,0,[\"bucketed\"]]],null]],null],null,[[[41,[28,[30,1,[\"isReady\"]],null,null],[[[42,[28,[31,1],[[28,[31,1],[[30,1,[\"items\"]]],null]],null],null,[[[18,3,[[30,2,[\"value\"]],[30,2,[\"index\"]]]]],[2]],null],[1,[28,[30,0,[\"checkDone\"]],null,null]]],[]],null]],[1]],null]],[\"bucket\",\"entry\",\"&default\"],[\"each\",\"-track-array\",\"if\",\"yield\"]]",
      "moduleName": "(unknown template module)",
      "isStrictMode": true
    }), this);
  }
}

const isLast = (collection, index) => index === collection.length - 1;
const isNotLast = (collection, index) => !isLast(collection, index);
const isMac = navigator.userAgent.indexOf("Mac OS") >= 0;
function split(str) {
  const keys = str.split("+").map(x => x.trim());
  return keys;
}
function getKeys(keys, mac) {
  const normalKeys = Array.isArray(keys) ? keys : split(keys);
  if (!mac) {
    return normalKeys;
  }
  const normalMac = Array.isArray(mac) ? mac : split(mac);
  return isMac ? normalMac : normalKeys;
}
const KeyCombo = setComponentTemplate(templateFactory(
/*
  <span class="ember-primitives__key-combination" ...attributes>
  {{#let (getKeys @keys @mac) as |keys|}}
    {{#each keys as |key i|}}
      <Key>{{key}}</Key>
      {{#if (isNotLast keys i)}}
        <span class="ember-primitives__key-combination__separator">+</span>
      {{/if}}
    {{/each}}
  {{/let}}
</span>
*/
{
  "id": "eoQciGG2",
  "block": "[[[11,1],[24,0,\"ember-primitives__key-combination\"],[17,1],[12],[1,\"\\n\"],[44,[[28,[32,0],[[30,2],[30,3]],null]],[[[42,[28,[31,2],[[28,[31,2],[[30,4]],null]],null],null,[[[1,\"      \"],[8,[32,1],null,null,[[\"default\"],[[[[1,[30,5]]],[]]]]],[1,\"\\n\"],[41,[28,[32,2],[[30,4],[30,6]],null],[[[1,\"        \"],[10,1],[14,0,\"ember-primitives__key-combination__separator\"],[12],[1,\"+\"],[13],[1,\"\\n\"]],[]],null]],[5,6]],null]],[4]]],[13]],[\"&attrs\",\"@keys\",\"@mac\",\"keys\",\"key\",\"i\"],[\"let\",\"each\",\"-track-array\",\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [getKeys, Key, isNotLast],
  "isStrictMode": true
}), templateOnly(undefined, "keys:KeyCombo"));
const Key = setComponentTemplate(templateFactory(
/*
  <kbd class="ember-primitives__key" ...attributes>{{yield}}</kbd>
*/
{
  "id": "hIZSV5xL",
  "block": "[[[11,\"kbd\"],[24,0,\"ember-primitives__key\"],[17,1],[12],[18,2,null],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "keys:Key"));

const StickyFooter = setComponentTemplate(templateFactory(
/*
  <div class="ember-primitives__sticky-footer__wrapper" ...attributes>
  <div class="ember-primitives__sticky-footer__container">
    <div class="ember-primitives__sticky-footer__content">
      {{yield to="content"}}
    </div>
    <div class="ember-primitives__sticky-footer__footer">
      {{yield to="footer"}}
    </div>
  </div>
</div>
*/
{
  "id": "2Bm30Brl",
  "block": "[[[11,0],[24,0,\"ember-primitives__sticky-footer__wrapper\"],[17,1],[12],[1,\"\\n  \"],[10,0],[14,0,\"ember-primitives__sticky-footer__container\"],[12],[1,\"\\n    \"],[10,0],[14,0,\"ember-primitives__sticky-footer__content\"],[12],[1,\"\\n      \"],[18,2,null],[1,\"\\n    \"],[13],[1,\"\\n    \"],[10,0],[14,0,\"ember-primitives__sticky-footer__footer\"],[12],[1,\"\\n      \"],[18,3,null],[1,\"\\n    \"],[13],[1,\"\\n  \"],[13],[1,\"\\n\"],[13]],[\"&attrs\",\"&content\",\"&footer\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "sticky-footer:StickyFooter"));

const Link = setComponentTemplate(templateFactory(
/*
  {{#let (link @href includeActiveQueryParams=@includeActiveQueryParams activeOnSubPaths=@activeOnSubPaths) as |l|}}
  {{#if l.isExternal}}
    <ExternalLink href={{@href}} ...attributes>
      {{yield (hash isExternal=true isActive=false)}}
    </ExternalLink>
  {{else}}
    <a data-active={{l.isActive}} href={{if @href @href "##missing##"}} {{on "click" l.handleClick}} ...attributes>
      {{yield (hash isExternal=false isActive=l.isActive)}}
    </a>
  {{/if}}
{{/let}}
*/
{
  "id": "gxCwI6fr",
  "block": "[[[44,[[28,[32,0],[[30,1]],[[\"includeActiveQueryParams\",\"activeOnSubPaths\"],[[30,2],[30,3]]]]],[[[41,[30,4,[\"isExternal\"]],[[[1,\"    \"],[8,[32,1],[[16,6,[30,1]],[17,5]],null,[[\"default\"],[[[[1,\"\\n      \"],[18,6,[[28,[32,2],null,[[\"isExternal\",\"isActive\"],[true,false]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[]],[[[1,\"    \"],[11,3],[16,\"data-active\",[30,4,[\"isActive\"]]],[16,6,[52,[30,1],[30,1],\"##missing##\"]],[17,5],[4,[32,3],[\"click\",[30,4,[\"handleClick\"]]],null],[12],[1,\"\\n      \"],[18,6,[[28,[32,2],null,[[\"isExternal\",\"isActive\"],[false,[30,4,[\"isActive\"]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n\"]],[]]]],[4]]]],[\"@href\",\"@includeActiveQueryParams\",\"@activeOnSubPaths\",\"l\",\"&attrs\",\"&default\"],[\"let\",\"if\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [link, ExternalLink, hash, on],
  "isStrictMode": true
}), templateOnly(undefined, "link:Link"));

const TABSTER_CONFIG_CONTENT = getTabsterAttribute({
  mover: {
    direction: MoverDirections.Both,
    cyclic: true
  },
  deloser: {}
});
const TABSTER_CONFIG_TRIGGER = {
  deloser: {}
};
const Separator = setComponentTemplate(templateFactory(
/*
  <div role="separator" ...attributes>
  {{yield}}
</div>
*/
{
  "id": "p79sEwoE",
  "block": "[[[11,0],[24,\"role\",\"separator\"],[17,1],[12],[1,\"\\n  \"],[18,2,null],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "menu:Separator"));
/**
 * We focus items on `pointerMove` to achieve the following:
 *
 * - Mouse over an item (it focuses)
 * - Leave mouse where it is and use keyboard to focus a different item
 * - Wiggle mouse without it leaving previously focused item
 * - Previously focused item should re-focus
 *
 * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
 * wiggles. This is to match native menu implementation.
 */
function focusOnHover(e) {
  const item = e.currentTarget;
  if (item instanceof HTMLElement) {
    item?.focus();
  }
}
const Item = setComponentTemplate(templateFactory(
/*
  {{!-- @glint-expect-error --}}
{{#let (if @onSelect (modifier on "click" @onSelect)) as |maybeClick|}}
  <button type="button" role="menuitem" {{!-- @glint-expect-error --}} {{maybeClick}} {{on "click" @toggle}} {{on "pointermove" focusOnHover}} ...attributes>
    {{yield}}
  </button>
{{/let}}
*/
{
  "id": "2q8wpLC7",
  "block": "[[[44,[[52,[30,1],[50,[32,0],2,[\"click\",[30,1]],null]]],[[[1,\"  \"],[11,\"button\"],[24,4,\"button\"],[24,\"role\",\"menuitem\"],[17,3],[4,[30,2],null,null],[4,[32,0],[\"click\",[30,4]],null],[4,[32,0],[\"pointermove\",[32,1]],null],[12],[1,\"\\n    \"],[18,5,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[2]]]],[\"@onSelect\",\"maybeClick\",\"&attrs\",\"@toggle\",\"&default\"],[\"let\",\"if\",\"modifier\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on, focusOnHover],
  "isStrictMode": true
}), templateOnly(undefined, "menu:Item"));
const LinkItem = setComponentTemplate(templateFactory(
/*
  <Link role="menuitem" @href={{@href}} @includeActiveQueryParams={{@includeActiveQueryParams}} @activeOnSubPaths={{@activeOnSubPaths}} {{on "click" @toggle}} {{on "pointermove" focusOnHover}} ...attributes>
  {{yield}}
</Link>
*/
{
  "id": "WXd/XzYl",
  "block": "[[[8,[32,0],[[24,\"role\",\"menuitem\"],[17,1],[4,[32,1],[\"click\",[30,5]],null],[4,[32,1],[\"pointermove\",[32,2]],null]],[[\"@href\",\"@includeActiveQueryParams\",\"@activeOnSubPaths\"],[[30,2],[30,3],[30,4]]],[[\"default\"],[[[[1,\"\\n  \"],[18,6,null],[1,\"\\n\"]],[]]]]]],[\"&attrs\",\"@href\",\"@includeActiveQueryParams\",\"@activeOnSubPaths\",\"@toggle\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [Link, on, focusOnHover],
  "isStrictMode": true
}), templateOnly(undefined, "menu:LinkItem"));
const installContent = modifier((element, _, {
  isOpen,
  triggerElement
}) => {
  // Focus first focusable element when the popover opens.
  // The toggle event fires natively after showPopover() completes.
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/toggle_event
  function onToggle(e) {
    if (e.newState !== "open") return;
    const tabster = getTabster(window);
    const firstFocusable = tabster?.focusable.findFirst({
      container: element
    });
    firstFocusable?.focus();
  }
  element.addEventListener("toggle", onToggle);
  // listen for "outside" clicks
  function onDocumentClick(e) {
    if (isOpen.current && e.target && !element.contains(e.target) && !triggerElement.current?.contains(e.target)) {
      isOpen.current = false;
    }
  }
  // listen for the escape key
  function onDocumentKeydown(e) {
    if (isOpen.current && e.key === "Escape") {
      isOpen.current = false;
    }
  }
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onDocumentKeydown);
  return () => {
    element.removeEventListener("toggle", onToggle);
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onDocumentKeydown);
  };
});
const Content = setComponentTemplate(templateFactory(
/*
  {{#if @isOpen.current}}
  <@PopoverContent id={{@contentId}} role="menu" data-tabster={{TABSTER_CONFIG_CONTENT}} tabindex="0" {{installContent isOpen=@isOpen triggerElement=@triggerElement}} ...attributes>
    {{yield (hash Item=(component Item toggle=@isOpen.toggle) LinkItem=(component LinkItem toggle=@isOpen.toggle) Separator=Separator)}}
  </@PopoverContent>
{{/if}}
*/
{
  "id": "gpAUBVR9",
  "block": "[[[41,[30,1,[\"current\"]],[[[1,\"  \"],[8,[30,2],[[16,1,[30,3]],[24,\"role\",\"menu\"],[16,\"data-tabster\",[32,0]],[24,\"tabindex\",\"0\"],[17,4],[4,[32,1],null,[[\"isOpen\",\"triggerElement\"],[[30,1],[30,5]]]]],null,[[\"default\"],[[[[1,\"\\n    \"],[18,6,[[28,[32,2],null,[[\"Item\",\"LinkItem\",\"Separator\"],[[50,[32,3],0,null,[[\"toggle\"],[[30,1,[\"toggle\"]]]]],[50,[32,4],0,null,[[\"toggle\"],[[30,1,[\"toggle\"]]]]],[32,5]]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]],null]],[\"@isOpen\",\"@PopoverContent\",\"@contentId\",\"&attrs\",\"@triggerElement\",\"&default\"],[\"if\",\"yield\",\"component\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [TABSTER_CONFIG_CONTENT, installContent, hash, Item, LinkItem, Separator],
  "isStrictMode": true
}), templateOnly(undefined, "menu:Content"));
const trigger = modifier((element, _, {
  triggerElement,
  isOpen,
  contentId,
  setReference,
  stopPropagation,
  preventDefault
}) => {
  element.setAttribute("aria-haspopup", "menu");
  if (isOpen.current) {
    element.setAttribute("aria-controls", contentId);
    element.setAttribute("aria-expanded", "true");
  } else {
    element.removeAttribute("aria-controls");
    element.setAttribute("aria-expanded", "false");
  }
  setTabsterAttribute(element, TABSTER_CONFIG_TRIGGER);
  const onTriggerClick = event => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (preventDefault) {
      event.preventDefault();
    }
    isOpen.toggle();
  };
  element.addEventListener("click", onTriggerClick);
  triggerElement.current = element;
  setReference(element);
  return () => {
    element.removeEventListener("click", onTriggerClick);
  };
});
const Trigger = setComponentTemplate(templateFactory(
/*
  <button type="button" {{@triggerModifier stopPropagation=@stopPropagation preventDefault=@preventDefault}} ...attributes>
  {{yield}}
</button>
*/
{
  "id": "YTW6bE0i",
  "block": "[[[11,\"button\"],[24,4,\"button\"],[17,1],[4,[30,2],null,[[\"stopPropagation\",\"preventDefault\"],[[30,3],[30,4]]]],[12],[1,\"\\n  \"],[18,5,null],[1,\"\\n\"],[13]],[\"&attrs\",\"@triggerModifier\",\"@stopPropagation\",\"@preventDefault\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "menu:Trigger"));
const IsOpen = () => cell(false);
const TriggerElement = () => cell();
class Menu extends Component {
  contentId = guidFor(this);
  static {
    setComponentTemplate(templateFactory(
    /*
      {{#let (IsOpen) (TriggerElement) as |isOpen triggerEl|}}
      <Popover @flipOptions={{@flipOptions}} @middleware={{@middleware}} @offsetOptions={{@offsetOptions}} @placement={{@placement}} @shiftOptions={{@shiftOptions}} @strategy={{@strategy}} as |p|>
        {{#let (modifier trigger triggerElement=triggerEl isOpen=isOpen contentId=this.contentId setReference=p.setReference) as |triggerModifier|}}
          {{yield (hash trigger=triggerModifier Trigger=(component Trigger triggerModifier=triggerModifier) Content=(component Content PopoverContent=p.Content isOpen=isOpen triggerElement=triggerEl contentId=this.contentId) arrow=p.arrow isOpen=isOpen.current)}}
        {{/let}}
      </Popover>
    {{/let}}
    */
    {
      "id": "rgyIl21+",
      "block": "[[[44,[[28,[32,0],null,null],[28,[32,1],null,null]],[[[1,\"  \"],[8,[32,2],null,[[\"@flipOptions\",\"@middleware\",\"@offsetOptions\",\"@placement\",\"@shiftOptions\",\"@strategy\"],[[30,3],[30,4],[30,5],[30,6],[30,7],[30,8]]],[[\"default\"],[[[[1,\"\\n\"],[44,[[50,[32,3],2,null,[[\"triggerElement\",\"isOpen\",\"contentId\",\"setReference\"],[[30,2],[30,1],[30,0,[\"contentId\"]],[30,9,[\"setReference\"]]]]]],[[[1,\"      \"],[18,11,[[28,[32,4],null,[[\"trigger\",\"Trigger\",\"Content\",\"arrow\",\"isOpen\"],[[30,10],[50,[32,5],0,null,[[\"triggerModifier\"],[[30,10]]]],[50,[32,6],0,null,[[\"PopoverContent\",\"isOpen\",\"triggerElement\",\"contentId\"],[[30,9,[\"Content\"]],[30,1],[30,2],[30,0,[\"contentId\"]]]]],[30,9,[\"arrow\"]],[30,1,[\"current\"]]]]]]],[1,\"\\n\"]],[10]]],[1,\"  \"]],[9]]]]],[1,\"\\n\"]],[1,2]]]],[\"isOpen\",\"triggerEl\",\"@flipOptions\",\"@middleware\",\"@offsetOptions\",\"@placement\",\"@shiftOptions\",\"@strategy\",\"p\",\"triggerModifier\",\"&default\"],[\"let\",\"modifier\",\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [IsOpen, TriggerElement, Popover, trigger, hash, Trigger, Content],
      "isStrictMode": true
    }), this);
  }
}

function getInputs(current) {
  const fieldset = current.closest('fieldset');
  return [...fieldset.querySelectorAll('input')];
}
function nextInput(current) {
  const inputs = getInputs(current);
  const currentIndex = inputs.indexOf(current);
  return inputs[currentIndex + 1];
}
function selectAll(event) {
  const target = event.target;
  target.select();
}
function handlePaste(event) {
  const target = event.target;
  const clipboardData = event.clipboardData;
  // But because of the UX we're implementing,
  // we want to split the pasted value across
  // multiple text fields
  event.preventDefault();
  const value = clipboardData.getData('Text');
  const digits = value;
  let i = 0;
  let currElement = target;
  while (currElement) {
    currElement.value = digits[i++] || '';
    const next = nextInput(currElement);
    if (next instanceof HTMLInputElement) {
      currElement = next;
    } else {
      break;
    }
  }

  // We want to select the first field again
  // so that if someone holds paste, or
  // pastes again, they get the same result.
  target.select();
}
function handleNavigation(event) {
  switch (event.key) {
    case 'Backspace':
      return handleBackspace(event);
    case 'ArrowLeft':
      return focusLeft(event);
    case 'ArrowRight':
      return focusRight(event);
  }
}
function focusLeft(event) {
  const target = event.target;
  const input = previousInput(target);
  input?.focus();
  requestAnimationFrame(() => {
    input?.select();
  });
}
function focusRight(event) {
  const target = event.target;
  const input = nextInput(target);
  input?.focus();
  requestAnimationFrame(() => {
    input?.select();
  });
}
const syntheticEvent = new InputEvent('input');
function handleBackspace(event) {
  if (event.key !== 'Backspace') return;

  /**
   * We have to prevent default because we
   * - want to clear the whole field
   * - have the focus behavior keep up with the key-repeat
   *   speed of the user's computer
   */
  event.preventDefault();
  const target = event.target;
  if (target && 'value' in target) {
    if (target.value === '') {
      focusLeft({
        target
      });
    } else {
      target.value = '';
    }
  }
  target?.dispatchEvent(syntheticEvent);
}
function previousInput(current) {
  const inputs = getInputs(current);
  const currentIndex = inputs.indexOf(current);
  return inputs[currentIndex - 1];
}
const autoAdvance = event => {
  const value = event.target.value;
  if (value.length === 0) return;
  if (value.length > 0) {
    if ('data' in event && event.data && typeof event.data === 'string') {
      event.target.value = event.data;
    }
    return focusRight(event);
  }
};
function getCollectiveValue(elementTarget, length) {
  if (!elementTarget) return;
  let parent;

  // TODO: should this logic be extracted?
  //       why is getting the target element within a shadow root hard?
  if (!(elementTarget instanceof HTMLInputElement)) {
    if (elementTarget.shadowRoot) {
      parent = elementTarget.shadowRoot;
    } else {
      parent = elementTarget.closest('fieldset');
    }
  } else {
    parent = elementTarget.closest('fieldset');
  }
  const elements = parent.querySelectorAll('input');
  let value = '';
  for (const element of elements) {
    value += element.value;
  }
  return value;
}
const DEFAULT_LENGTH = 6;
function labelFor(inputIndex, labelFn) {
  if (labelFn) {
    return labelFn(inputIndex);
  }
  return `Please enter OTP character ${inputIndex + 1}`;
}
const waiter$1 = buildWaiter("ember-primitives:OTPInput:handleChange");
const Fields = setComponentTemplate(templateFactory(
/*
  {{#each @fields as |_field i|}}
  <label>
    <span class="ember-primitives__sr-only">{{labelFor i @labelFn}}</span>
    <input name="code{{i}}" type="text" inputmode="numeric" autocomplete="off" ...attributes {{on "click" selectAll}} {{on "paste" handlePaste}} {{on "input" autoAdvance}} {{on "input" @handleChange}} {{on "keydown" handleNavigation}} />
  </label>
{{/each}}
*/
{
  "id": "jL2osucA",
  "block": "[[[42,[28,[31,1],[[28,[31,1],[[30,1]],null]],null],null,[[[1,\"  \"],[10,\"label\"],[12],[1,\"\\n    \"],[10,1],[14,0,\"ember-primitives__sr-only\"],[12],[1,[28,[32,0],[[30,3],[30,4]],null]],[13],[1,\"\\n    \"],[11,\"input\"],[16,3,[29,[\"code\",[30,3]]]],[24,4,\"text\"],[24,\"inputmode\",\"numeric\"],[24,\"autocomplete\",\"off\"],[17,5],[4,[32,1],[\"click\",[32,2]],null],[4,[32,1],[\"paste\",[32,3]],null],[4,[32,1],[\"input\",[32,4]],null],[4,[32,1],[\"input\",[30,6]],null],[4,[32,1],[\"keydown\",[32,5]],null],[12],[13],[1,\"\\n  \"],[13],[1,\"\\n\"]],[2,3]],null]],[\"@fields\",\"_field\",\"i\",\"@labelFn\",\"&attrs\",\"@handleChange\"],[\"each\",\"-track-array\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [labelFor, on, selectAll, handlePaste, autoAdvance, handleNavigation],
  "isStrictMode": true
}), templateOnly(undefined, "otp-H5a4B4yu:Fields"));
class OTPInput extends Component {
  /**
  * This is debounced, because we bind to each input,
  * but only want to emit one change event if someone pastes
  * multiple characters
  */
  handleChange = event => {
    if (!this.args.onChange) return;
    if (!this.#token) {
      this.#token = waiter$1.beginAsync();
    }
    if (this.#frame) {
      cancelAnimationFrame(this.#frame);
    }
    // We  use requestAnimationFrame to be friendly to rendering.
    // We don't know if onChange is going to want to cause paints
    // (it's also how we debounce, under the assumption that "paste" behavior
    //  would be fast enough to be quicker than individual frames
    //   (see logic in autoAdvance)
    //  )
    this.#frame = requestAnimationFrame(() => {
      waiter$1.endAsync(this.#token);
      if (isDestroyed(this) || isDestroying(this)) return;
      if (!this.args.onChange) return;
      const value = getCollectiveValue(event.target);
      if (value === undefined) {
        return;
      }
      this.args.onChange({
        code: value,
        complete: value.length === this.length
      }, event);
    });
  };
  #token;
  #frame;
  get length() {
    return this.args.length ?? DEFAULT_LENGTH;
  }
  get fields() {
    // We only need to iterate a number of times,
    // so we don't care about the actual value or
    // referential integrity here
    return new Array(this.length);
  }
  static {
    setComponentTemplate(templateFactory(
    /*
      <fieldset ...attributes>
      {{#let (component Fields fields=this.fields handleChange=this.handleChange labelFn=@labelFn) as |CurriedFields|}}
        {{#if (has-block)}}
          {{yield CurriedFields}}
        {{else}}
          <CurriedFields />
        {{/if}}
      {{/let}}
    
      <style>
        .ember-primitives__sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      </style>
    </fieldset>
    */
    {
      "id": "UGTYZBBC",
      "block": "[[[11,\"fieldset\"],[17,1],[12],[1,\"\\n\"],[44,[[50,[32,0],0,null,[[\"fields\",\"handleChange\",\"labelFn\"],[[30,0,[\"fields\"]],[30,0,[\"handleChange\"]],[30,2]]]]],[[[41,[48,[30,4]],[[[1,\"      \"],[18,4,[[30,3]]],[1,\"\\n\"]],[]],[[[1,\"      \"],[8,[30,3],null,null,null],[1,\"\\n\"]],[]]]],[3]]],[1,\"\\n  \"],[10,\"style\"],[12],[1,\"\\n    .ember-primitives__sr-only {\\n      position: absolute;\\n      width: 1px;\\n      height: 1px;\\n      padding: 0;\\n      margin: -1px;\\n      overflow: hidden;\\n      clip: rect(0, 0, 0, 0);\\n      white-space: nowrap;\\n      border-width: 0;\\n    }\\n  \"],[13],[1,\"\\n\"],[13]],[\"&attrs\",\"@labelFn\",\"CurriedFields\",\"&default\"],[\"let\",\"component\",\"if\",\"has-block\",\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [Fields],
      "isStrictMode": true
    }), this);
  }
}
const reset = event => {
  const form = event.target.closest("form");
  form.reset();
};
const Submit = setComponentTemplate(templateFactory(
/*
  <button type="submit" ...attributes>Submit</button>
*/
{
  "id": "ZW+ge1Ad",
  "block": "[[[11,\"button\"],[24,4,\"submit\"],[17,1],[12],[1,\"Submit\"],[13]],[\"&attrs\"],[]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "otp-H5a4B4yu:Submit"));
const Reset = setComponentTemplate(templateFactory(
/*
  <button type="button" {{on "click" reset}} ...attributes>{{yield}}</button>
*/
{
  "id": "JdKZMx6B",
  "block": "[[[11,\"button\"],[24,4,\"button\"],[17,1],[4,[32,0],[\"click\",[32,1]],null],[12],[18,2,null],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on, reset],
  "isStrictMode": true
}), templateOnly(undefined, "otp-H5a4B4yu:Reset"));
const waiter$2 = buildWaiter("ember-primitives:OTP:handleAutoSubmitAttempt");
const handleFormSubmit = (submit, event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  let code = "";
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("code")) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
      code += value;
    }
  }
  submit({
    code
  });
};
function handleChange(autoSubmit, data, event) {
  if (!autoSubmit) return;
  if (!data.complete) return;
  const form = event.target.closest("form");
  const token = waiter$2.beginAsync();
  const finished = () => {
    waiter$2.endAsync(token);
    form.removeEventListener("submit", finished);
  };
  form.addEventListener("submit", finished);
  // NOTE: when calling .submit() the submit event handlers are not run
  form.requestSubmit();
}
const OTP = setComponentTemplate(templateFactory(
/*
  <form {{on "submit" (fn handleFormSubmit @onSubmit)}} ...attributes>
  {{yield (hash Input=(component OTPInput length=@length onChange=(if @autoSubmit (fn handleChange @autoSubmit))) Submit=Submit Reset=Reset)}}
</form>
*/
{
  "id": "+4VcAqZr",
  "block": "[[[11,\"form\"],[17,1],[4,[32,0],[\"submit\",[28,[32,1],[[32,2],[30,2]],null]],null],[12],[1,\"\\n  \"],[18,5,[[28,[32,3],null,[[\"Input\",\"Submit\",\"Reset\"],[[50,[32,4],0,null,[[\"length\",\"onChange\"],[[30,3],[52,[30,4],[28,[32,1],[[32,5],[30,4]],null]]]]],[32,6],[32,7]]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"@onSubmit\",\"@length\",\"@autoSubmit\",\"&default\"],[\"yield\",\"component\",\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on, fn, handleFormSubmit, hash, OTPInput, handleChange, Submit, Reset],
  "isStrictMode": true
}), templateOnly(undefined, "otp-H5a4B4yu:OTP"));

const cache = new TrackedMap();
const TARGETS = Object.freeze({
  popover: "ember-primitives__portal-targets__popover",
  tooltip: "ember-primitives__portal-targets__tooltip",
  modal: "ember-primitives__portal-targets__modal"
});
function findNearestTarget(origin, name) {
  let element = null;
  let parent = origin.parentNode;
  const manuallyRegisteredSet = cache.get(name);
  const manuallyRegistered = manuallyRegisteredSet?.size ? [...manuallyRegisteredSet] : null;
  /**
  * For use with <PortalTarget @name="hi" />
  */
  function findRegistered(host) {
    return manuallyRegistered?.find(element => {
      if (host.contains(element)) {
        return element;
      }
    });
  }
  const selector = Object.values(TARGETS).includes(name) ? `[data-portal-name=${name}]` : name;
  /**
  * Default portals / non-registered -- here we match a query selector instead of an element
  */
  function findDefault(host) {
    return host.querySelector(selector);
  }
  const finder = manuallyRegistered ? findRegistered : findDefault;
  /**
  * Crawl up the ancestry looking for our portal target
  */
  while (!element && parent) {
    element = finder(parent);
    if (element) break;
    parent = parent.parentNode;
  }
  if (name.startsWith("ember-primitives")) ;
  return element ?? undefined;
}
const register = modifier((element, [name]) => {
  void (async () => {
    // Bad TypeScript lint.
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await 0;
    let existing = cache.get(name);
    if (!existing) {
      existing = new TrackedSet();
      cache.set(name, existing);
    }
    existing.add(element);
  })();
  return () => {
    cache.delete(name);
  };
});
const PortalTargets = setComponentTemplate(templateFactory(
/*
  <div data-portal-name={{TARGETS.popover}}></div>
<div data-portal-name={{TARGETS.tooltip}}></div>
<div data-portal-name={{TARGETS.modal}}></div>
*/
{
  "id": "xrDNQK1c",
  "block": "[[[10,0],[15,\"data-portal-name\",[32,0,[\"popover\"]]],[12],[13],[1,\"\\n\"],[10,0],[15,\"data-portal-name\",[32,0,[\"tooltip\"]]],[12],[13],[1,\"\\n\"],[10,0],[15,\"data-portal-name\",[32,0,[\"modal\"]]],[12],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [TARGETS],
  "isStrictMode": true
}), templateOnly(undefined, "portal-targets:PortalTargets"));
/**
 * For manually registering a PortalTarget for use with Portal
 */
setComponentTemplate(templateFactory(
/*
  <div {{register @name}} ...attributes></div>
*/
{
  "id": "UJrztp0u",
  "block": "[[[11,0],[17,1],[4,[32,0],[[30,2]],null],[12],[13]],[\"&attrs\",\"@name\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [register],
  "isStrictMode": true
}), templateOnly(undefined, "portal-targets:PortalTarget"));

function wormhole(query) {
  if (isElement(query)) {
    return query;
  }
  let found = document.getElementById(query);
  found ??= document.querySelector(query);
  return found;
}
const anchor = modifier((element, [to, update]) => {
  const found = findNearestTarget(element, to);
  update(found);
});
const ElementValue = () => cell();
const waiter = buildWaiter("ember-primitives:portal");
function wormholeCompat(selector) {
  const target = wormhole(selector);
  if (target) return target;
  return resource(() => {
    const target = cell();
    const token = waiter.beginAsync();
    // eslint-disable-next-line ember/no-runloop
    schedule("afterRender", () => {
      const result = wormhole(selector);
      waiter.endAsync(token);
      target.current = result;
    });
    return () => target.current;
  });
}
resourceFactory(wormholeCompat);
const Portal = setComponentTemplate(templateFactory(
/*
  {{#if (isElement @to)}}
  <ToElement @to={{@to}} @append={{@append}}>
    {{yield}}
  </ToElement>
{{else if @wormhole}}
  {{#let (wormholeCompat @wormhole) as |target|}}
    {{#if target}}
      {{#in-element target insertBefore=null}}
        {{yield}}
      {{/in-element}}
    {{/if}}
  {{/let}}
{{else if @to}}
  <Nestable @to={{@to}} @append={{@append}}>
    {{yield}}
  </Nestable>
{{else}}
  {{assert "either @to or @wormhole is required. Received neither"}}
{{/if}}
*/
{
  "id": "SZ92wo5w",
  "block": "[[[41,[28,[32,0],[[30,1]],null],[[[1,\"  \"],[8,[32,1],null,[[\"@to\",\"@append\"],[[30,1],[30,2]]],[[\"default\"],[[[[1,\"\\n    \"],[18,5,null],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]],[[[41,[30,3],[[[44,[[28,[32,2],[[30,3]],null]],[[[41,[30,4],[[[40,[[[1,\"        \"],[18,5,null],[1,\"\\n\"]],[]],\"%cursor:0%\",[28,[31,4],[[30,4]],null],null]],[]],null]],[4]]]],[]],[[[41,[30,1],[[[1,\"  \"],[8,[32,3],null,[[\"@to\",\"@append\"],[[30,1],[30,2]]],[[\"default\"],[[[[1,\"\\n    \"],[18,5,null],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]],[[[1,\"  \"],[1,[28,[32,4],[\"either @to or @wormhole is required. Received neither\"],null]],[1,\"\\n\"]],[]]]],[]]]],[]]]],[\"@to\",\"@append\",\"@wormhole\",\"target\",\"&default\"],[\"if\",\"yield\",\"let\",\"in-element\",\"-in-el-null\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [isElement, ToElement, wormholeCompat, Nestable, assert],
  "isStrictMode": true
}), templateOnly(undefined, "portal:Portal"));
const ToElement = setComponentTemplate(templateFactory(
/*
  {{#if @append}}
  {{#in-element @to insertBefore=null}}
    {{yield}}
  {{/in-element}}
{{else}}
  {{#in-element @to}}
    {{yield}}
  {{/in-element}}
{{/if}}
*/
{
  "id": "B91RTs+P",
  "block": "[[[41,[30,1],[[[40,[[[1,\"    \"],[18,3,null],[1,\"\\n\"]],[]],\"%cursor:0%\",[28,[31,2],[[30,2]],null],null]],[]],[[[40,[[[1,\"    \"],[18,3,null],[1,\"\\n\"]],[]],\"%cursor:1%\",[28,[31,2],[[30,2]],null]]],[]]]],[\"@append\",\"@to\",\"&default\"],[\"if\",\"in-element\",\"-in-el-null\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "portal:ToElement"));
const Nestable = setComponentTemplate(templateFactory(
/*
  {{#let (ElementValue) as |target|}}
  {{!-- This div is always going to be empty,
        because it'll either find the portal and render content elsewhere,
        it it won't find the portal and won't render anything.
    --}}
  {{!-- template-lint-disable no-inline-styles --}}
  <div style="display:contents;" {{anchor @to target.set}}>
    {{#if target.current}}
      {{#if @append}}
        {{#in-element target.current insertBefore=null}}
          {{yield}}
        {{/in-element}}
      {{else}}
        {{#in-element target.current}}
          {{yield}}
        {{/in-element}}
      {{/if}}
    {{/if}}
  </div>
{{/let}}
*/
{
  "id": "hPlBbfcP",
  "block": "[[[44,[[28,[32,0],null,null]],[[[1,\"  \"],[11,0],[24,5,\"display:contents;\"],[4,[32,1],[[30,2],[30,1,[\"set\"]]],null],[12],[1,\"\\n\"],[41,[30,1,[\"current\"]],[[[41,[30,3],[[[40,[[[1,\"          \"],[18,4,null],[1,\"\\n\"]],[]],\"%cursor:0%\",[28,[31,3],[[30,1,[\"current\"]]],null],null]],[]],[[[40,[[[1,\"          \"],[18,4,null],[1,\"\\n\"]],[]],\"%cursor:1%\",[28,[31,3],[[30,1,[\"current\"]]],null]]],[]]]],[]],null],[1,\"  \"],[13],[1,\"\\n\"]],[1]]]],[\"target\",\"@to\",\"@append\",\"&default\"],[\"let\",\"if\",\"in-element\",\"-in-el-null\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ElementValue, anchor],
  "isStrictMode": true
}), templateOnly(undefined, "portal:Nestable"));

const DEFAULT_MAX$2 = 100;
/**
 * Non-negative, non-NaN, non-Infinite, positive, rational
 */
function isValidProgressNumber(value) {
  if (typeof value !== "number") return false;
  if (!Number.isFinite(value)) return false;
  return value >= 0;
}
function progressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function getMax(userMax) {
  return isValidProgressNumber(userMax) ? userMax : DEFAULT_MAX$2;
}
function getValue(userValue, maxValue) {
  const max = getMax(maxValue);
  if (!isValidProgressNumber(userValue)) {
    return 0;
  }
  if (userValue > max) {
    return max;
  }
  return userValue;
}
function getValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
const Indicator = setComponentTemplate(templateFactory(
/*
  <div ...attributes data-max={{@max}} data-value={{@value}} data-state={{progressState @value @max}} data-percent={{@percent}}>
  {{yield}}
</div>
*/
{
  "id": "h+sbSzbe",
  "block": "[[[11,0],[17,1],[16,\"data-max\",[30,2]],[16,\"data-value\",[30,3]],[16,\"data-state\",[28,[32,0],[[30,3],[30,2]],null]],[16,\"data-percent\",[30,4]],[12],[1,\"\\n  \"],[18,5,null],[1,\"\\n\"],[13]],[\"&attrs\",\"@max\",\"@value\",\"@percent\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [progressState],
  "isStrictMode": true
}), templateOnly(undefined, "progress:Indicator"));
class Progress extends Component {
  get max() {
    return getMax(this.args.max);
  }
  get value() {
    return getValue(this.args.value, this.max);
  }
  get valueLabel() {
    return getValueLabel(this.value, this.max);
  }
  get decimal() {
    return this.value / this.max;
  }
  get percent() {
    return Math.round(this.decimal * 100 * 100) / 100;
  }
  static {
    setComponentTemplate(templateFactory(
    /*
      <div ...attributes aria-valuemax={{this.max}} aria-valuemin="0" aria-valuenow={{this.value}} aria-valuetext={{this.valueLabel}} role="progressbar" data-value={{this.value}} data-state={{progressState this.value this.max}} data-max={{this.max}} data-min="0" data-percent={{this.percent}}>
    
      {{yield (hash Indicator=(component Indicator value=this.value max=this.max percent=this.percent) value=this.value percent=this.percent decimal=this.decimal)}}
    </div>
    */
    {
      "id": "vzjbJUDo",
      "block": "[[[11,0],[17,1],[16,\"aria-valuemax\",[30,0,[\"max\"]]],[24,\"aria-valuemin\",\"0\"],[16,\"aria-valuenow\",[30,0,[\"value\"]]],[16,\"aria-valuetext\",[30,0,[\"valueLabel\"]]],[24,\"role\",\"progressbar\"],[16,\"data-value\",[30,0,[\"value\"]]],[16,\"data-state\",[28,[32,0],[[30,0,[\"value\"]],[30,0,[\"max\"]]],null]],[16,\"data-max\",[30,0,[\"max\"]]],[24,\"data-min\",\"0\"],[16,\"data-percent\",[30,0,[\"percent\"]]],[12],[1,\"\\n\\n  \"],[18,2,[[28,[32,1],null,[[\"Indicator\",\"value\",\"percent\",\"decimal\"],[[50,[32,2],0,null,[[\"value\",\"max\",\"percent\"],[[30,0,[\"value\"]],[30,0,[\"max\"]],[30,0,[\"percent\"]]]]],[30,0,[\"value\"]],[30,0,[\"percent\"]],[30,0,[\"decimal\"]]]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [progressState, hash, Indicator],
      "isStrictMode": true
    }), this);
  }
}

const RatingRange = setComponentTemplate(templateFactory(
/*
  <input ...attributes name={{@name}} type="range" max={{@max}} value={{@value}} {{on "change" @handleChange}} />
*/
{
  "id": "i+ehCPfR",
  "block": "[[[11,\"input\"],[17,1],[16,3,[30,2]],[24,4,\"range\"],[16,\"max\",[30,3]],[16,2,[30,4]],[4,[32,0],[\"change\",[30,5]],null],[12],[13]],[\"&attrs\",\"@name\",\"@max\",\"@value\",\"@handleChange\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on],
  "isStrictMode": true
}), templateOnly(undefined, "rating-BrIiwDLw:RatingRange"));
function isString(x) {
  return typeof x === 'string';
}
function lte(a, b) {
  return a <= b;
}
const Stars = setComponentTemplate(templateFactory(
/*
  <div class="ember-primitives__rating__items">
  {{#each @stars as |star|}}
    {{#let (uniqueId) as |id|}}
      <span class="ember-primitives__rating__item" data-number={{star}} data-selected={{lte star @currentValue}} data-readonly={{@isReadonly}}>
        <label for="input-{{id}}">
          <span visually-hidden>{{star}} star</span>
          {{#if @icon}}
            <span aria-hidden="true">
              {{#if (isString @icon)}}
                {{@icon}}
              {{else}}
                <@icon @value={{star}} @isSelected={{lte star @currentValue}} @readonly={{@isReadonly}} />
              {{/if}}
            </span>
          {{/if}}
        </label>

        <input id="input-{{id}}" type="radio" name={{@name}} value={{star}} readonly={{@isReadonly}} checked={{Object.is star @currentValue}} />
      </span>
    {{/let}}
  {{/each}}
</div>
*/
{
  "id": "LMHKMj4V",
  "block": "[[[10,0],[14,0,\"ember-primitives__rating__items\"],[12],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[30,1]],null]],null],null,[[[44,[[28,[32,0],null,null]],[[[1,\"      \"],[10,1],[14,0,\"ember-primitives__rating__item\"],[15,\"data-number\",[30,2]],[15,\"data-selected\",[28,[32,1],[[30,2],[30,4]],null]],[15,\"data-readonly\",[30,5]],[12],[1,\"\\n        \"],[10,\"label\"],[15,\"for\",[29,[\"input-\",[30,3]]]],[12],[1,\"\\n          \"],[10,1],[14,\"visually-hidden\",\"\"],[12],[1,[30,2]],[1,\" star\"],[13],[1,\"\\n\"],[41,[30,6],[[[1,\"            \"],[10,1],[14,\"aria-hidden\",\"true\"],[12],[1,\"\\n\"],[41,[28,[32,2],[[30,6]],null],[[[1,\"                \"],[1,[30,6]],[1,\"\\n\"]],[]],[[[1,\"                \"],[8,[30,6],null,[[\"@value\",\"@isSelected\",\"@readonly\"],[[30,2],[28,[32,1],[[30,2],[30,4]],null],[30,5]]],null],[1,\"\\n\"]],[]]],[1,\"            \"],[13],[1,\"\\n\"]],[]],null],[1,\"        \"],[13],[1,\"\\n\\n        \"],[10,\"input\"],[15,1,[29,[\"input-\",[30,3]]]],[15,3,[30,7]],[15,2,[30,2]],[15,\"readonly\",[30,5]],[15,\"checked\",[28,[32,3,[\"is\"]],[[30,2],[30,4]],null]],[14,4,\"radio\"],[12],[13],[1,\"\\n      \"],[13],[1,\"\\n\"]],[3]]]],[2]],null],[13]],[\"@stars\",\"star\",\"id\",\"@currentValue\",\"@isReadonly\",\"@icon\",\"@name\"],[\"each\",\"-track-array\",\"let\",\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [uniqueId, lte, isString, Object],
  "isStrictMode": true
}), templateOnly(undefined, "rating-BrIiwDLw:Stars"));
class RatingState extends Component {
  static {
    decorateFieldV2$1(this.prototype, "_value", [localCopy("args.value")]);
  }
  #_value = (initializeDeferredDecorator$1(this, "_value"), void 0); // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  get value() {
    return this._value ?? 0;
  }
  get step() {
    return this.args.step ?? 1;
  }
  get max() {
    return this.args.max ?? 5;
  }
  get stars() {
    const result = [];
    // 0 is "none selected"
    let current = 0;
    current += this.step;
    while (current <= this.max) {
      result.push(current);
      current += this.step;
    }
    return result;
  }
  static {
    decorateMethodV2(this.prototype, "stars", [cached]);
  }
  setRating = value => {
    if (this.args.readonly) {
      return;
    }
    if (value === this._value) {
      this._value = 0;
    } else {
      this._value = value;
    }
    this.args.onChange?.(value);
  };
  setFromString = value => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      // something went wrong.
      // Since we're using event delegation,
      // this could be from an unrelated input
      return;
    }
    this.setRating(num);
  };
  /**
  * Click events are captured by
  * - radio changes (mouse and keyboard)
  *   - but only range clicks
  */
  handleClick = event => {
    // Since we're doing event delegation on a click, we want to make sure
    // we don't do anything on other elements
    const isValid = event.target instanceof HTMLInputElement && event.target.name === this.args.name && event.target.type === "radio";
    if (!isValid) return;
    const selected = event.target?.value;
    this.setFromString(selected);
  };
  /**
  * Only attached to a range element, if present.
  * Range elements don't fire click events on keyboard usage, like radios do
  */
  handleChange = event => {
    const isValid = event.target !== null && "value" in event.target;
    if (!isValid) return;
    this.setFromString(event.target.value);
  };
  static {
    setComponentTemplate(templateFactory(
    /*
      {{yield (hash stars=this.stars total=this.stars.length handleClick=this.handleClick handleChange=this.handleChange setRating=this.setRating value=this.value step=this.step) (hash total=this.stars.length value=this.value)}}
    */
    {
      "id": "WJldQGGg",
      "block": "[[[18,1,[[28,[32,0],null,[[\"stars\",\"total\",\"handleClick\",\"handleChange\",\"setRating\",\"value\",\"step\"],[[30,0,[\"stars\"]],[30,0,[\"stars\",\"length\"]],[30,0,[\"handleClick\"]],[30,0,[\"handleChange\"]],[30,0,[\"setRating\"]],[30,0,[\"value\"]],[30,0,[\"step\"]]]]],[28,[32,0],null,[[\"total\",\"value\"],[[30,0,[\"stars\",\"length\"]],[30,0,[\"value\"]]]]]]]],[\"&default\"],[\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [hash],
      "isStrictMode": true
    }), this);
  }
}
class Rating extends Component {
  name = `rating-${uniqueId()}`;
  get icon() {
    return this.args.icon ?? "★";
  }
  get isInteractive() {
    return this.args.interactive ?? true;
  }
  get isChangeable() {
    const readonly = this.args.readonly ?? false;
    return !readonly && this.isInteractive;
  }
  get isReadonly() {
    return !this.isChangeable;
  }
  get needsDescription() {
    return !this.isInteractive;
  }
  static {
    setComponentTemplate(templateFactory(
    /*
      <RatingState @max={{@max}} @step={{@step}} @value={{@value}} @name={{this.name}} @readonly={{this.isReadonly}} @onChange={{@onChange}} as |r publicState|>
      <fieldset class="ember-primitives__rating" data-total={{r.total}} data-value={{r.value}} data-readonly={{this.isReadonly}} {{!-- We use event delegation, this isn't a primary interactive -- we're capturing events from inputs --}} {{!-- template-lint-disable no-invalid-interactive --}} {{on "click" r.handleClick}} ...attributes>
        {{#let (component Stars stars=r.stars icon=this.icon isReadonly=this.isReadonly name=this.name total=r.total currentValue=r.value) as |RatingStars|}}
    
          {{#if (has-block)}}
            {{yield (hash max=r.total total=r.total value=r.value name=this.name isReadonly=this.isReadonly isChangeable=this.isChangeable Stars=RatingStars Range=(component RatingRange step=r.step max=r.total value=r.value name=this.name handleChange=r.handleChange))}}
          {{else}}
            {{#if this.needsDescription}}
              {{#if (has-block "label")}}
                {{yield publicState to="label"}}
              {{else}}
                <span visually-hidden class="ember-primitives__rating__label">Rated
                  {{r.value}}
                  out of
                  {{r.total}}</span>
              {{/if}}
            {{else}}
              {{#if (has-block "label")}}
                <legend>
                  {{yield publicState to="label"}}
                </legend>
              {{/if}}
            {{/if}}
    
            <RatingStars />
          {{/if}}
        {{/let}}
    
      </fieldset>
    </RatingState>
    */
    {
      "id": "DtSjwNml",
      "block": "[[[8,[32,0],null,[[\"@max\",\"@step\",\"@value\",\"@name\",\"@readonly\",\"@onChange\"],[[30,1],[30,2],[30,3],[30,0,[\"name\"]],[30,0,[\"isReadonly\"]],[30,4]]],[[\"default\"],[[[[1,\"\\n  \"],[11,\"fieldset\"],[24,0,\"ember-primitives__rating\"],[16,\"data-total\",[30,5,[\"total\"]]],[16,\"data-value\",[30,5,[\"value\"]]],[16,\"data-readonly\",[30,0,[\"isReadonly\"]]],[17,7],[4,[32,1],[\"click\",[30,5,[\"handleClick\"]]],null],[12],[1,\"\\n\"],[44,[[50,[32,2],0,null,[[\"stars\",\"icon\",\"isReadonly\",\"name\",\"total\",\"currentValue\"],[[30,5,[\"stars\"]],[30,0,[\"icon\"]],[30,0,[\"isReadonly\"]],[30,0,[\"name\"]],[30,5,[\"total\"]],[30,5,[\"value\"]]]]]],[[[1,\"\\n\"],[41,[48,[30,9]],[[[1,\"        \"],[18,9,[[28,[32,3],null,[[\"max\",\"total\",\"value\",\"name\",\"isReadonly\",\"isChangeable\",\"Stars\",\"Range\"],[[30,5,[\"total\"]],[30,5,[\"total\"]],[30,5,[\"value\"]],[30,0,[\"name\"]],[30,0,[\"isReadonly\"]],[30,0,[\"isChangeable\"]],[30,8],[50,[32,4],0,null,[[\"step\",\"max\",\"value\",\"name\",\"handleChange\"],[[30,5,[\"step\"]],[30,5,[\"total\"]],[30,5,[\"value\"]],[30,0,[\"name\"]],[30,5,[\"handleChange\"]]]]]]]]]],[1,\"\\n\"]],[]],[[[41,[30,0,[\"needsDescription\"]],[[[41,[48,[30,10]],[[[1,\"            \"],[18,10,[[30,6]]],[1,\"\\n\"]],[]],[[[1,\"            \"],[10,1],[14,\"visually-hidden\",\"\"],[14,0,\"ember-primitives__rating__label\"],[12],[1,\"Rated\\n              \"],[1,[30,5,[\"value\"]]],[1,\"\\n              out of\\n              \"],[1,[30,5,[\"total\"]]],[13],[1,\"\\n\"]],[]]]],[]],[[[41,[48,[30,10]],[[[1,\"            \"],[10,\"legend\"],[12],[1,\"\\n              \"],[18,10,[[30,6]]],[1,\"\\n            \"],[13],[1,\"\\n\"]],[]],null]],[]]],[1,\"\\n        \"],[8,[30,8],null,null,null],[1,\"\\n\"]],[]]]],[8]]],[1,\"\\n  \"],[13],[1,\"\\n\"]],[5,6]]]]]],[\"@max\",\"@step\",\"@value\",\"@onChange\",\"r\",\"publicState\",\"&attrs\",\"RatingStars\",\"&default\",\"&label\"],[\"let\",\"component\",\"if\",\"has-block\",\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [RatingState, on, Stars, hash, RatingRange],
      "isStrictMode": true
    }), this);
  }
}

const GROUP_SELECTOR = '.ember-primitives__resizable';
const PANEL_CLASS = 'ember-primitives__resizable__panel';
const HANDLE_CLASS = 'ember-primitives__resizable__handle';
const MEMBER_SELECTOR = `.${PANEL_CLASS}, .${HANDLE_CLASS}`;
const DEFAULT_MIN$1 = 0;
const DEFAULT_MAX$1 = 100;

/**
 * How far (in %) one keyboard arrow press moves a handle.
 * Holding Shift moves in coarser increments.
 */
const KEYBOARD_STEP = 1;
const KEYBOARD_STEP_COARSE = 10;
function clamp$1(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function numberAttribute(element, name) {
  const raw = element.getAttribute(name);
  if (raw === null) return undefined;
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : undefined;
}

/**
 * Panels declare their constraints in the DOM (via data attributes),
 * so the group can discover everything it needs with queries --
 * no registration required.
 */
function minSizeOf(panel) {
  return numberAttribute(panel, 'data-min-size') ?? DEFAULT_MIN$1;
}
function maxSizeOf(panel) {
  return numberAttribute(panel, 'data-max-size') ?? DEFAULT_MAX$1;
}
function requestedSizeOf(panel) {
  return numberAttribute(panel, 'data-size');
}
function isCollapsible(panel) {
  return panel.hasAttribute('data-collapsible');
}
function sameMembers(a, b) {
  return a.length === b.length && a.every((element, index) => element === b[index]);
}
function precedes(a, b) {
  return Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}

/**
 * The `data-collapsed` attribute is the source of truth for collapse
 * state (it is also the styling hook consumers use).
 */
function isCollapsed(panel) {
  return isCollapsible(panel) && panel.hasAttribute('data-collapsed');
}
function setCollapsed(panel, collapsed) {
  if (collapsed === panel.hasAttribute('data-collapsed')) return;
  if (collapsed) {
    panel.setAttribute('data-collapsed', '');
  } else {
    panel.removeAttribute('data-collapsed');
  }
}

/**
 * The panels immediately before and after the given handle element,
 * in document order.
 */
function neighborsOf(handleElement, panels) {
  let prev = null;
  let next = null;
  for (const panel of panels) {
    const position = handleElement.compareDocumentPosition(panel);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      prev = panel;
    } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      next = panel;
      break;
    }
  }
  return [prev, next];
}

/**
 * Sizes are floats that get re-derived (measurement, normalization),
 * so "unchanged" means within a small tolerance.
 */
function isSameSize(existing, size) {
  return existing !== undefined && Math.abs(existing - size) < 0.0001;
}

/**
 * Pixel measurements round to device pixels, so re-measuring a layout
 * yields values that differ from the stored ones by sub-pixel noise.
 * Only differences beyond this (in %) count as real drift worth
 * adopting -- re-encoding identical pixels as slightly different
 * percentages would dirty every panel for no visual change.
 */
const MEASUREMENT_TOLERANCE = 0.25;

/**
 * Skips the write when the attribute already has the desired value,
 * so unchanged elements are left untouched.
 */
function setAttribute(element, name, value) {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}
class GroupState {
  element = null;
  #options;
  #drag = null;

  /**
   * Current size (%) per panel element.
   * The DOM is the source of truth for membership; this only remembers
   * sizes across relayouts.
   */
  #sizes = new Map();

  /**
   * The size (%) a collapsible panel had before it was collapsed,
   * so that expanding restores it.
   */
  #previousSizes = new WeakMap();

  /**
   * Membership as of the last layout, so mutation batches that don't
   * change membership (e.g. content changes inside a panel, or churn
   * within a nested group) can be ignored.
   */
  #knownPanels = [];
  #knownHandles = [];

  /**
   * The percentage that a flex-grow of 1 represents in this group.
   *
   * Panels without an inline style render at the CSS default
   * (`flex: 1 1 0px`), so an all-equal group needs no styles at all --
   * mounting one writes nothing. The unit is fixed the first time a
   * panel actually diverges, and from then on grow values are written
   * relative to it, so panels whose share doesn't change keep their
   * (possibly absent) style untouched.
   */
  #unit = null;
  constructor(options) {
    this.#options = options;
  }
  get orientation() {
    return this.#options.orientation() ?? 'horizontal';
  }
  get #isHorizontal() {
    return this.orientation === 'horizontal';
  }

  /**
   * This group's panels, in document order.
   * Panels of nested groups belong to their own group, not this one.
   */
  get panels() {
    return this.#members().panels;
  }
  get handles() {
    return this.#members().handles;
  }
  #members() {
    const panels = [];
    const handles = [];
    const element = this.element;
    if (!element) return {
      panels,
      handles
    };
    for (const member of element.querySelectorAll(MEMBER_SELECTOR)) {
      if (member.closest(GROUP_SELECTOR) !== element) continue;
      (member.classList.contains(PANEL_CLASS) ? panels : handles).push(member);
    }
    return {
      panels,
      handles
    };
  }
  get sizes() {
    return this.panels.map(panel => this.#sizes.get(panel) ?? 0);
  }

  /**
   * One MutationObserver for every group on the page. Each record is
   * routed to the group that owns it (the nearest group ancestor), so
   * churn inside a nested group never even pings its ancestors.
   */
  static #observed = new Map();
  static #observer = null;
  static #observerOptions = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-orientation'],
    // to distinguish real changes from same-value writes (see below)
    attributeOldValue: true
  };
  static #handleMutations(mutations) {
    /**
     * true = the group's own data-orientation changed,
     * false = something in its subtree changed (membership check needed)
     */
    const affected = new Map();
    for (const mutation of mutations) {
      const target = mutation.target;
      if (!(target instanceof Element)) continue;
      if (mutation.type === 'attributes') {
        const group = GroupState.#observed.get(target);

        /**
         * setAttribute queues a record even when the value is
         * unchanged (renderers do rewrite attributes with the same
         * value); only actual changes warrant a relayout.
         */
        const changed = mutation.attributeName && mutation.oldValue !== target.getAttribute(mutation.attributeName);
        if (group && changed) affected.set(group, true);
        continue;
      }
      const groupElement = target.closest(GROUP_SELECTOR);
      const group = groupElement && GroupState.#observed.get(groupElement);
      if (group && !affected.has(group)) affected.set(group, false);
    }
    for (const [group, orientationChanged] of affected) {
      const members = group.#members();
      if (orientationChanged || group.#membershipChanged(members)) group.#layout(members);
    }
  }
  static #observe(element, group) {
    GroupState.#observed.set(element, group);
    GroupState.#observer ??= new MutationObserver(mutations => GroupState.#handleMutations(mutations));
    GroupState.#observer.observe(element, GroupState.#observerOptions);
  }
  static #unobserve(element) {
    GroupState.#observed.delete(element);
    const observer = GroupState.#observer;
    if (!observer) return;

    /**
     * MutationObserver has no per-target unobserve; disconnect and
     * re-observe the remaining groups (rare -- teardown only).
     */
    observer.disconnect();
    if (GroupState.#observed.size === 0) {
      GroupState.#observer = null;
      return;
    }
    for (const remaining of GroupState.#observed.keys()) {
      observer.observe(remaining, GroupState.#observerOptions);
    }
  }

  /**
   * Called (via modifier) when the group element is inserted.
   * Watches for panels being added/removed (and the orientation
   * changing) and performs the initial layout.
   */
  attach = element => {
    this.element = element;
    GroupState.#observe(element, this);
    this.#layout();
    return () => {
      GroupState.#unobserve(element);
      this.element = null;
    };
  };
  #membershipChanged(members) {
    return !sameMembers(members.panels, this.#knownPanels) || !sameMembers(members.handles, this.#knownHandles);
  }

  /**
   * Panels that already have a size (or request one via `data-size`)
   * keep it; new panels take a share of the remaining space; everything
   * is normalized to 100.
   */
  #layout(members = this.#members()) {
    const {
      panels,
      handles
    } = members;
    if (this.#drag) this.#drag.members = members;
    this.#knownPanels = panels;
    this.#knownHandles = handles;
    if (panels.length === 0) return;
    let changed = false;

    // forget sizes of panels that left the DOM
    const current = new Set(panels);
    for (const known of this.#sizes.keys()) {
      if (!current.has(known)) {
        this.#sizes.delete(known);
        changed = true;
      }
    }

    // scratch space for the math below; #sizes itself is only
    // touched at the end, and only where values actually changed
    const computed = new Map();
    const unspecified = [];
    let specifiedTotal = 0;
    for (const panel of panels) {
      const preferred = this.#sizes.get(panel) ?? requestedSizeOf(panel);
      if (preferred === undefined) {
        unspecified.push(panel);
        continue;
      }
      const size = isCollapsed(panel) ? preferred : clamp$1(preferred, minSizeOf(panel), maxSizeOf(panel));
      computed.set(panel, size);
      specifiedTotal += size;
    }
    if (unspecified.length > 0) {
      /**
       * Panels without a size share the remaining space.
       * When there is none left (e.g. a panel was added to an
       * already-full group), each takes an equal 1/n share and the
       * existing panels scale down to make room -- like a new window
       * opening in a tiling window manager.
       */
      const remaining = 100 - specifiedTotal;
      let share = remaining / unspecified.length;
      if (remaining < 1) {
        share = 100 / panels.length;
        if (specifiedTotal > 0) {
          const scale = Math.max(100 - share * unspecified.length, 0) / specifiedTotal;
          for (const [panel, size] of computed) {
            computed.set(panel, size * scale);
          }
        }
      }
      for (const panel of unspecified) {
        computed.set(panel, clamp$1(share, minSizeOf(panel), maxSizeOf(panel)));
      }
    }

    // normalize to 100
    let total = 0;
    for (const size of computed.values()) total += size;
    if (total > 0 && Math.abs(total - 100) > 0.01) {
      for (const [panel, size] of computed) {
        computed.set(panel, size / total * 100);
      }
    }

    /**
     * Commit minimally: keep the #sizes map, update only entries whose
     * value actually changed (with a small tolerance, so float dust
     * from re-normalizing doesn't count as a change).
     */
    const changedPanels = [];
    for (const [panel, size] of computed) {
      if (!isSameSize(this.#sizes.get(panel), size)) {
        this.#sizes.set(panel, size);
        changedPanels.push(panel);
        changed = true;
      }
    }
    this.#apply(changedPanels, members);
    if (changed) this.#notify(panels);
  }

  /**
   * Writes the layout back to the DOM: flex sizing for exactly the
   * candidate panels whose rendered share would actually change, plus
   * the handles' ARIA attributes (which are guarded per-attribute).
   * (`data-collapsed` is managed at the explicit collapse/expand
   * points, not derived from sizes -- rendered pixel sizes include
   * borders/padding, so a collapsed panel rarely measures exactly 0.)
   */
  #apply(candidates, members) {
    /**
     * With no unit fixed yet, nothing has ever been written, so every
     * panel renders at the CSS default -- an equal 1/n share.
     */
    const unit = this.#unit ?? 100 / members.panels.length;
    for (const panel of candidates) {
      const size = this.#sizes.get(panel);
      if (size === undefined) continue;
      const inlineGrow = panel.style.flexGrow;
      const impliedPercent = (inlineGrow === '' ? 1 : parseFloat(inlineGrow)) * unit;
      if (isSameSize(impliedPercent, size)) continue;
      this.#unit ??= unit;
      panel.style.flex = `${size / unit} 1 0px`;
    }
    this.#syncHandles(members);
  }

  /**
   * Per the window-splitter pattern, each handle describes the panel
   * immediately before it. (A splitter between two side-by-side panes
   * is oriented *vertically*, and vice-versa.)
   */
  #syncHandles(members) {
    const {
      panels,
      handles
    } = members;
    const ariaOrientation = this.#isHorizontal ? 'vertical' : 'horizontal';
    let index = 0;
    for (const handle of handles) {
      let following = panels[index];
      while (following && precedes(following, handle)) {
        index++;
        following = panels[index];
      }
      const prev = panels[index - 1];
      setAttribute(handle, 'aria-orientation', ariaOrientation);
      if (!prev) continue;

      // Panels render their own (component-owned, incrementing) id
      if (prev.id) setAttribute(handle, 'aria-controls', prev.id);
      setAttribute(handle, 'aria-valuemin', `${minSizeOf(prev)}`);
      setAttribute(handle, 'aria-valuemax', `${maxSizeOf(prev)}`);
      setAttribute(handle, 'aria-valuenow', `${Math.round(this.#sizes.get(prev) ?? 0)}`);
    }
  }
  #notify(panels) {
    this.#options.onLayoutChange()?.(panels.map(panel => this.#sizes.get(panel) ?? 0));
  }

  /**
   * Re-derive percentage sizes from actual rendered pixels.
   * Corrects any drift (e.g. from CSS min-sizes) before an interaction.
   */
  #syncSizesFromDOM(panels, measured) {
    // collapsed panels are 0 even though their borders/padding measure larger
    const px = panels.map((panel, index) => isCollapsed(panel) ? 0 : measured?.[index] ?? this.#pixelSizeOf(panel));
    const total = px.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return;
    panels.forEach((panel, index) => {
      const size = (px[index] ?? 0) / total * 100;
      const existing = this.#sizes.get(panel);
      if (existing === undefined || Math.abs(existing - size) > MEASUREMENT_TOLERANCE) {
        this.#sizes.set(panel, size);
      }
    });
  }
  #pixelSizeOf(panel) {
    const box = panel.getBoundingClientRect();
    return this.#isHorizontal ? box.width : box.height;
  }

  /**
   * Moves the boundary between the two panels by `requestedDelta` (%),
   * respecting both panels' min/max constraints.
   */
  #applyDelta(prev, next, basePrevSize, baseNextSize, requestedDelta, members) {
    const total = basePrevSize + baseNextSize;
    const prevMin = minSizeOf(prev);
    const prevMax = maxSizeOf(prev);
    const prevCollapsible = isCollapsible(prev);
    let target = basePrevSize + requestedDelta;
    if (prevCollapsible && target < prevMin) {
      /**
       * Collapsible panels snap: below half the minimum they close
       * entirely; between half and the minimum they hold at the minimum.
       * (This also keeps a collapsed panel closed when its handle is
       * dragged further in the closing direction.)
       */
      target = target < prevMin / 2 ? 0 : prevMin;
    } else {
      target = clamp$1(target, prevMin, prevMax);
    }

    /**
     * The neighbor absorbs whatever the target panel gives or takes,
     * so its constraints bound the target too.
     */
    const nextMin = total - maxSizeOf(next);
    const nextMax = total - minSizeOf(next);
    if (nextMin > nextMax) return;
    target = clamp$1(target, nextMin, nextMax);

    // both panels' constraints cannot be satisfied at once
    if (!prevCollapsible && (target < prevMin || target > prevMax)) return;

    /**
     * Nothing to do when the clamped result matches the current sizes
     * (e.g. every pointermove past a min/max limit).
     */
    if (isSameSize(this.#sizes.get(prev), target) && isSameSize(this.#sizes.get(next), total - target)) {
      return;
    }
    if (prevCollapsible) {
      if (target === 0 && !isCollapsed(prev)) {
        this.#previousSizes.set(prev, basePrevSize);
      }
      setCollapsed(prev, target === 0);
    }
    this.#sizes.set(prev, target);
    this.#sizes.set(next, total - target);
    this.#apply([prev, next], members);
    this.#notify(members.panels);
  }
  startDrag(handleElement, event) {
    if (event.button !== 0) return;
    if (this.#drag) return;
    const members = this.#members();
    const [prev, next] = neighborsOf(handleElement, members.panels);
    if (!prev || !next) return;
    const measured = members.panels.map(panel => this.#pixelSizeOf(panel));
    this.#syncSizesFromDOM(members.panels, measured);
    const move = moveEvent => this.#dragMove(moveEvent);
    const end = endEvent => this.#endDrag(handleElement, endEvent);
    this.#drag = {
      prev,
      next,
      startPrevSize: this.#sizes.get(prev) ?? 0,
      startNextSize: this.#sizes.get(next) ?? 0,
      startCoordinate: this.#isHorizontal ? event.clientX : event.clientY,
      totalPx: measured.reduce((sum, value) => sum + value, 0),
      members,
      move,
      end
    };
    try {
      /**
       * Retargets all subsequent pointer events to the handle,
       * even when the pointer is over an iframe.
       */
      handleElement.setPointerCapture(event.pointerId);
    } catch {
      // synthetic events (tests) may not have an active pointer
    }
    handleElement.addEventListener('pointermove', move);
    handleElement.addEventListener('pointerup', end);
    handleElement.addEventListener('pointercancel', end);
    handleElement.setAttribute('data-resizing', '');
    document.body.style.cursor = this.#isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }
  #dragMove(event) {
    const drag = this.#drag;
    if (!drag) return;
    if (drag.totalPx <= 0) return;
    const coordinate = this.#isHorizontal ? event.clientX : event.clientY;
    const deltaPercent = (coordinate - drag.startCoordinate) / drag.totalPx * 100;
    this.#applyDelta(drag.prev, drag.next, drag.startPrevSize, drag.startNextSize, deltaPercent, drag.members);
  }
  #endDrag(handleElement, event) {
    const drag = this.#drag;
    if (!drag) return;
    this.#drag = null;
    try {
      handleElement.releasePointerCapture(event.pointerId);
    } catch {
      // may not have been captured (tests)
    }
    handleElement.removeEventListener('pointermove', drag.move);
    handleElement.removeEventListener('pointerup', drag.end);
    handleElement.removeEventListener('pointercancel', drag.end);
    handleElement.removeAttribute('data-resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  /**
   * Keyboard support for the WAI-ARIA window-splitter pattern.
   */
  handleKeyDown(handleElement, event) {
    const members = this.#members();
    const [prev, next] = neighborsOf(handleElement, members.panels);
    if (!prev || !next) return;
    if (event.key === 'Enter') {
      this.#toggleCollapse(prev, next, members);
      return;
    }
    const step = event.shiftKey ? KEYBOARD_STEP_COARSE : KEYBOARD_STEP;
    const isHorizontal = this.#isHorizontal;
    let toDelta = null;
    switch (event.key) {
      case 'ArrowLeft':
        if (isHorizontal) toDelta = () => -step;
        break;
      case 'ArrowRight':
        if (isHorizontal) toDelta = () => step;
        break;
      case 'ArrowUp':
        if (!isHorizontal) toDelta = () => -step;
        break;
      case 'ArrowDown':
        if (!isHorizontal) toDelta = () => step;
        break;
      case 'Home':
        toDelta = prevSize => minSizeOf(prev) - prevSize;
        break;
      case 'End':
        toDelta = prevSize => maxSizeOf(prev) - prevSize;
        break;
    }
    if (!toDelta) return;
    event.preventDefault();
    this.#syncSizesFromDOM(members.panels);
    const prevSize = this.#sizes.get(prev) ?? 0;
    this.#applyDelta(prev, next, prevSize, this.#sizes.get(next) ?? 0, toDelta(prevSize), members);
  }

  /**
   * Collapses (or restores) the panel before the handle,
   * giving the space to (or taking it from) the panel after it.
   *
   * Only does anything when the preceding panel is `@collapsible`.
   */
  #toggleCollapse(prev, next, members) {
    if (!isCollapsible(prev)) return;
    this.#syncSizesFromDOM(members.panels);
    const prevSize = this.#sizes.get(prev) ?? 0;
    const nextSize = this.#sizes.get(next) ?? 0;
    if (isCollapsed(prev)) {
      const preferred = this.#previousSizes.get(prev) ?? requestedSizeOf(prev) ?? Math.max(minSizeOf(prev), 10);
      const available = nextSize - minSizeOf(next);
      const restored = Math.min(preferred, available);
      if (restored <= 0) return;
      setCollapsed(prev, false);
      this.#sizes.set(prev, restored);
      this.#sizes.set(next, nextSize - restored);
    } else {
      this.#previousSizes.set(prev, prevSize);
      setCollapsed(prev, true);
      this.#sizes.set(prev, 0);
      this.#sizes.set(next, nextSize + prevSize);
    }
    this.#apply([prev, next], members);
    this.#notify(members.panels);
  }
}

/**
 * A resizable region within a `<Resizable>` group.
 *
 * Panels declare their constraints as data attributes, so the group
 * discovers them with DOM queries -- there is no registration, and a
 * Panel may contain another `<Resizable>` to nest layouts.
 */
let panelId = 0;
function nextPanelId() {
  return `ember-primitives__resizable__panel--${panelId++}`;
}
const Panel = setComponentTemplate(templateFactory(
/*
  <div class="ember-primitives__resizable__panel" data-min-size={{@minSize}} data-max-size={{@maxSize}} data-size={{@size}} data-collapsible={{if @collapsible "true"}} ...attributes {{!-- after ...attributes: the id is component-owned (the handles'
      aria-controls depends on it being present and unique) --}} id={{(nextPanelId)}}>
  {{yield}}
</div>
*/
{
  "id": "jOwSkSW+",
  "block": "[[[11,0],[24,0,\"ember-primitives__resizable__panel\"],[16,\"data-min-size\",[30,1]],[16,\"data-max-size\",[30,2]],[16,\"data-size\",[30,3]],[16,\"data-collapsible\",[52,[30,4],\"true\"]],[17,5],[16,1,[28,[32,0],null,null]],[12],[1,\"\\n  \"],[18,6,null],[1,\"\\n\"],[13]],[\"@minSize\",\"@maxSize\",\"@size\",\"@collapsible\",\"&attrs\",\"&default\"],[\"if\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [nextPanelId],
  "isStrictMode": true
}), templateOnly(undefined, "resizable:Panel"));
function onPointerDown(state) {
  return event => state.startDrag(event.currentTarget, event);
}
function onKeyDown(state) {
  return event => state.handleKeyDown(event.currentTarget, event);
}
/**
 * The draggable (and keyboard-operable) divider between two Panels.
 *
 * Follows the WAI-ARIA window-splitter pattern, and controls the Panel
 * immediately before it. Finds its group via DOM context, so it must be
 * rendered inside a `<Resizable>`.
 *
 * Give each handle an accessible name (e.g. `aria-label="Resize sidebar"`).
 */
const Handle = setComponentTemplate(templateFactory(
/*
  <Consume @key={{GroupState}} as |ctx|>
  <div class="ember-primitives__resizable__handle" role="separator" tabindex="0" data-orientation={{ctx.data.orientation}} {{on "pointerdown" (onPointerDown ctx.data)}} {{on "keydown" (onKeyDown ctx.data)}} ...attributes>
    {{yield}}
  </div>
</Consume>
*/
{
  "id": "hi5KXd5Y",
  "block": "[[[8,[32,0],null,[[\"@key\"],[[32,1]]],[[\"default\"],[[[[1,\"\\n  \"],[11,0],[24,0,\"ember-primitives__resizable__handle\"],[24,\"role\",\"separator\"],[24,\"tabindex\",\"0\"],[16,\"data-orientation\",[30,1,[\"data\",\"orientation\"]]],[17,2],[4,[32,2],[\"pointerdown\",[28,[32,3],[[30,1,[\"data\"]]],null]],null],[4,[32,2],[\"keydown\",[28,[32,4],[[30,1,[\"data\"]]],null]],null],[12],[1,\"\\n    \"],[18,3,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[1]]]]]],[\"ctx\",\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [Consume, GroupState, on, onPointerDown, onKeyDown],
  "isStrictMode": true
}), templateOnly(undefined, "resizable:Handle"));
/**
 * A group of resizable panels, separated by draggable handles.
 *
 * Render `<Panel>` and `<Handle>` components inside -- they are their
 * own imports, and find the group via DOM context / DOM queries.
 *
 * Groups can be nested (a `<Resizable>` inside a Panel) to build
 * tree-shaped tiling layouts, i3 / tmux style.
 */
class Resizable extends Component {
  state = new GroupState({
    orientation: () => this.args.orientation,
    onLayoutChange: () => this.args.onLayoutChange
  });
  attach = modifier(element => this.state.attach(element));
  static {
    setComponentTemplate(templateFactory(
    /*
      <div class="ember-primitives__resizable" data-orientation={{this.state.orientation}} {{this.attach}} ...attributes>
      <Provide @data={{this.state}} @key={{GroupState}}>
        {{yield}}
      </Provide>
    </div>
    */
    {
      "id": "SKwx2S+j",
      "block": "[[[11,0],[24,0,\"ember-primitives__resizable\"],[16,\"data-orientation\",[30,0,[\"state\",\"orientation\"]]],[17,1],[4,[30,0,[\"attach\"]],null,null],[12],[1,\"\\n  \"],[8,[32,0],null,[[\"@data\",\"@key\"],[[30,0,[\"state\"]],[32,1]]],[[\"default\"],[[[[1,\"\\n    \"],[18,2,null],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [Provide, GroupState],
      "isStrictMode": true
    }), this);
  }
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function roundToStep(value, step) {
  if (!Number.isFinite(step) || step <= 0) return value;
  return Math.round(value / step) * step;
}
function getPercentage(value, min, max) {
  const range = max - min;
  if (!Number.isFinite(range) || range === 0) return 0;
  return (value - min) / range * 100;
}
function normalizeTickValues(values) {
  const uniques = new Set();
  for (const value of values) {
    if (Number.isFinite(value)) uniques.add(value);
  }
  return Array.from(uniques).sort((a, b) => a - b);
}
function findNearestIndex(values, target) {
  if (values.length === 0) return 0;
  const first = values[0];
  if (first === undefined) return 0;
  let nearestIndex = 0;
  let nearestDistance = Math.abs(first - target);
  for (let index = 1; index < values.length; index++) {
    const candidate = values[index];
    if (candidate === undefined) continue;
    const distance = Math.abs(candidate - target);
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  }
  return nearestIndex;
}
class ThumbState {
  #slider;
  constructor(slider, index) {
    this.index = index;
    this.#slider = slider;
  }
  get value() {
    return this.#slider.values[this.index] ?? this.#slider.min;
  }
  get inputValue() {
    const ticks = this.#slider.tickValues;
    if (!ticks) return this.value;
    return clamp(findNearestIndex(ticks, this.value), 0, Math.max(0, ticks.length - 1));
  }
  get percent() {
    return this.#slider.thumbPercents[this.index] ?? 0;
  }
  get active() {
    return this.#slider.activeThumbIndex === this.index;
  }
  get positionStyle() {
    return this.#slider.thumbPositionStyle(this.percent);
  }
}
class SliderStore {
  #thumbStates = [];
  #getArgs;
  static {
    decorateFieldV2$1(this.prototype, "activeThumbIndex", [tracked], function () {
      return null;
    });
  }
  #activeThumbIndex = (initializeDeferredDecorator$1(this, "activeThumbIndex"), void 0);
  constructor(getArgs) {
    this.#getArgs = getArgs;
    const args = this.#getArgs();
    const initialCount = Array.isArray(args.value) ? Math.max(1, args.value.length) : 1;
    this.#thumbStates = Array.from({
      length: initialCount
    }, (_, index) => new ThumbState(this, index));
  }
  get #args() {
    return this.#getArgs();
  }
  get min() {
    return this.#args.min ?? DEFAULT_MIN;
  }
  get max() {
    return this.#args.max ?? DEFAULT_MAX;
  }
  get step() {
    return typeof this.#args.step === 'number' ? this.#args.step : DEFAULT_STEP;
  }
  get tickValues() {
    const fromStep = Array.isArray(this.#args.step) ? this.#args.step : undefined;
    const raw = fromStep;
    if (!raw) return null;
    const normalized = normalizeTickValues(raw);
    return normalized.length === 0 ? null : normalized;
  }
  get orientation() {
    return this.#args.orientation ?? 'horizontal';
  }
  get disabled() {
    return this.#args.disabled ?? false;
  }
  get internalMin() {
    const ticks = this.tickValues;
    if (ticks) return 0;
    return this.min;
  }
  get internalMax() {
    const ticks = this.tickValues;
    if (ticks) return Math.max(0, ticks.length - 1);
    return this.max;
  }
  get internalStep() {
    const ticks = this.tickValues;
    if (ticks) return 1;
    return this.step;
  }
  get internalValues() {
    const ticks = this.tickValues;
    const normalized = Array.isArray(this.#args.value) ? this.#args.value.length === 0 ? [ticks?.[0] ?? this.min] : this.#args.value : [this.#args.value ?? ticks?.[0] ?? this.min];
    if (ticks) {
      return normalized.map(v => {
        const index = findNearestIndex(ticks, v);
        return clamp(index, this.internalMin, this.internalMax);
      });
    }
    return normalized.map(v => clamp(roundToStep(v, this.step), this.min, this.max));
  }
  outputValuesFromInternal(internalValues) {
    const ticks = this.tickValues;
    if (!ticks) return internalValues;
    return internalValues.map(internal => {
      const index = clamp(Math.round(internal), 0, ticks.length - 1);
      return ticks[index] ?? ticks[0] ?? this.min;
    });
  }
  get values() {
    return this.outputValuesFromInternal(this.internalValues);
  }
  get thumbs() {
    this.#ensureThumbCount(this.internalValues.length);
    return this.#thumbStates;
  }
  get thumbPercents() {
    return this.internalValues.map(value => getPercentage(value, this.internalMin, this.internalMax));
  }
  get isMulti() {
    return this.internalValues.length > 1;
  }
  thumbPositionStyle = percent => {
    const property = this.orientation === 'horizontal' ? 'left' : 'bottom';
    return htmlSafe(`${property}: ${percent}%`);
  };
  get rangeStyle() {
    const internalValues = this.internalValues;

    // For a single-thumb slider, the "range" should fill from the start to the
    // thumb. For multi-thumb, it fills between the min/max thumbs.
    const internalRangeMin = internalValues.length <= 1 ? this.internalMin : Math.min(...internalValues);
    const internalRangeMax = internalValues[0] === undefined ? this.internalMin : Math.max(...internalValues);
    const startPercent = getPercentage(internalRangeMin, this.internalMin, this.internalMax);
    const endPercent = getPercentage(internalRangeMax, this.internalMin, this.internalMax);
    if (this.orientation === 'horizontal') {
      return htmlSafe(`left: ${startPercent}%; right: ${100 - endPercent}%`);
    } else {
      return htmlSafe(`bottom: ${startPercent}%; top: ${100 - endPercent}%`);
    }
  }
  updateValue = newValues => {
    if (this.#args.onValueChange) {
      this.#args.onValueChange(this.coerceOutput(newValues));
    }
  };
  commitValue = newValues => {
    if (this.#args.onValueCommit) {
      this.#args.onValueCommit(this.coerceOutput(newValues));
    }
  };
  coerceOutput(values) {
    if (Array.isArray(this.#args.value)) return values;
    return values[0] ?? this.min;
  }
  #ensureThumbCount(count) {
    if (count === this.#thumbStates.length) return;
    if (count < this.#thumbStates.length) {
      this.#thumbStates = this.#thumbStates.slice(0, count);
      return;
    }
    const startIndex = this.#thumbStates.length;
    for (let index = startIndex; index < count; index++) {
      this.#thumbStates.push(new ThumbState(this, index));
    }
  }
  #applyThumbInternalValue(index, rawValue) {
    const nextValues = [...this.internalValues];
    const stepped = clamp(roundToStep(rawValue, this.internalStep), this.internalMin, this.internalMax);
    let constrained = stepped;
    if (nextValues.length > 1) {
      const prev = nextValues[index - 1];
      const next = nextValues[index + 1];
      if (prev !== undefined) constrained = Math.max(constrained, prev);
      if (next !== undefined) constrained = Math.min(constrained, next);
    }
    nextValues[index] = constrained;
    return nextValues;
  }
  handleThumbInput = (index, value) => {
    if (this.disabled) return;
    const internalValues = this.#applyThumbInternalValue(index, value);
    const newValues = this.outputValuesFromInternal(internalValues);
    this.updateValue(newValues);
  };
  handleThumbChange = (index, value) => {
    if (this.disabled) return;
    const internalValues = this.#applyThumbInternalValue(index, value);
    const newValues = this.outputValuesFromInternal(internalValues);
    this.updateValue(newValues);
    this.commitValue(newValues);
  };
  handleThumbActivate = index => {
    this.activeThumbIndex = index;
  };
  defaultThumbLabel = index => {
    const count = this.internalValues.length;
    if (count <= 1) return 'Value';
    if (count === 2) return index === 0 ? 'Minimum' : 'Maximum';
    return `Value ${index + 1}`;
  };
}

const Track = setComponentTemplate(templateFactory(
/*
  <span ...attributes class="ember-primitives__slider__track">
  {{yield}}
</span>
*/
{
  "id": "PD8O6UTf",
  "block": "[[[11,1],[17,1],[24,0,\"ember-primitives__slider__track\"],[12],[1,\"\\n  \"],[18,2,null],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "slider:Track"));
const Range = setComponentTemplate(templateFactory(
/*
  <span ...attributes class="ember-primitives__slider__range" style={{@rangeStyle}} />
*/
{
  "id": "xLJjK8jE",
  "block": "[[[11,1],[17,1],[24,0,\"ember-primitives__slider__range\"],[16,5,[30,2]],[12],[13]],[\"&attrs\",\"@rangeStyle\"],[]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "slider:Range"));
class ThumbComponent extends Component {
  get index() {
    return this.args.thumb?.index ?? this.args.index ?? 0;
  }
  get value() {
    // When using tick values, the `input` needs the internal index.
    return this.args.thumb?.inputValue ?? this.args.value ?? this.args.store.internalMin;
  }
  get isActive() {
    return this.args.store.activeThumbIndex === this.index;
  }
  get positionStyle() {
    const percent = this.args.thumb?.percent ?? this.args.store.thumbPercents[this.index] ?? 0;
    return this.args.store.thumbPositionStyle(percent);
  }
  readValue(event) {
    // In docs live previews the component may run in an iframe/shadow realm,
    // where `instanceof HTMLInputElement` is not reliable. `currentTarget` is
    // the element the handler is attached to.
    const el = event.currentTarget;
    const raw = el?.value;
    const parsed = raw === undefined ? NaN : Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : this.value;
  }
  onInput = event => {
    this.args.store.handleThumbActivate(this.index);
    this.args.store.handleThumbInput(this.index, this.readValue(event));
  };
  onChange = event => {
    this.args.store.handleThumbActivate(this.index);
    this.args.store.handleThumbChange(this.index, this.readValue(event));
  };
  onPointerUp = () => {
    this.args.store.handleThumbActivate(this.index);
  };
  onGotPointerCapture = () => {
    this.args.store.handleThumbActivate(this.index);
  };
  onFocus = () => {
    this.args.store.handleThumbActivate(this.index);
  };
  static {
    setComponentTemplate(templateFactory(
    /*
      <input ...attributes class="ember-primitives__slider__thumb-input" type="range" min={{@store.internalMin}} max={{@store.internalMax}} step={{@store.internalStep}} value={{this.value}} disabled={{@store.disabled}} data-active={{if this.isActive ""}} {{on "gotpointercapture" this.onGotPointerCapture}} {{on "pointerup" this.onPointerUp}} {{on "focus" this.onFocus}} {{on "input" this.onInput}} {{on "change" this.onChange}} />
    <span class="ember-primitives__slider__thumb" style={{this.positionStyle}} data-active={{if this.isActive ""}} data-disabled={{if @store.disabled ""}} aria-hidden="true">{{yield}}</span>
    */
    {
      "id": "fQHvsujW",
      "block": "[[[11,\"input\"],[17,1],[24,0,\"ember-primitives__slider__thumb-input\"],[24,4,\"range\"],[16,\"min\",[30,2,[\"internalMin\"]]],[16,\"max\",[30,2,[\"internalMax\"]]],[16,\"step\",[30,2,[\"internalStep\"]]],[16,2,[30,0,[\"value\"]]],[16,\"disabled\",[30,2,[\"disabled\"]]],[16,\"data-active\",[52,[30,0,[\"isActive\"]],\"\"]],[4,[32,0],[\"gotpointercapture\",[30,0,[\"onGotPointerCapture\"]]],null],[4,[32,0],[\"pointerup\",[30,0,[\"onPointerUp\"]]],null],[4,[32,0],[\"focus\",[30,0,[\"onFocus\"]]],null],[4,[32,0],[\"input\",[30,0,[\"onInput\"]]],null],[4,[32,0],[\"change\",[30,0,[\"onChange\"]]],null],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"ember-primitives__slider__thumb\"],[15,5,[30,0,[\"positionStyle\"]]],[15,\"data-active\",[52,[30,0,[\"isActive\"]],\"\"]],[15,\"data-disabled\",[52,[30,2,[\"disabled\"]],\"\"]],[14,\"aria-hidden\",\"true\"],[12],[18,3,null],[13]],[\"&attrs\",\"@store\",\"&default\"],[\"if\",\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [on],
      "isStrictMode": true
    }), this);
  }
}
class Slider extends Component {
  store;
  constructor(owner, args) {
    super(owner, args);
    this.store = new SliderStore(() => this.args);
  }
  static {
    setComponentTemplate(templateFactory(
    /*
      <span ...attributes class="ember-primitives__slider" data-orientation={{this.store.orientation}} data-disabled={{if this.store.disabled ""}} data-multi={{if this.store.isMulti ""}}>
      {{#if (has-block)}}
        {{yield (hash Track=Track Range=(component Range rangeStyle=this.store.rangeStyle) Thumb=(component ThumbComponent store=this.store) values=this.store.values tickValues=this.store.tickValues thumbs=this.store.thumbs min=this.store.min max=this.store.max step=this.store.step)}}
      {{else}}
        <Track>
          <Range @rangeStyle={{this.store.rangeStyle}} />
    
          {{#each this.store.thumbs as |thumb|}}
            <ThumbComponent @store={{this.store}} @thumb={{thumb}} aria-label={{this.store.defaultThumbLabel thumb.index}} />
          {{/each}}
        </Track>
      {{/if}}
    </span>
    */
    {
      "id": "RsxtkNRD",
      "block": "[[[11,1],[17,1],[24,0,\"ember-primitives__slider\"],[16,\"data-orientation\",[30,0,[\"store\",\"orientation\"]]],[16,\"data-disabled\",[52,[30,0,[\"store\",\"disabled\"]],\"\"]],[16,\"data-multi\",[52,[30,0,[\"store\",\"isMulti\"]],\"\"]],[12],[1,\"\\n\"],[41,[48,[30,3]],[[[1,\"    \"],[18,3,[[28,[32,0],null,[[\"Track\",\"Range\",\"Thumb\",\"values\",\"tickValues\",\"thumbs\",\"min\",\"max\",\"step\"],[[32,1],[50,[32,2],0,null,[[\"rangeStyle\"],[[30,0,[\"store\",\"rangeStyle\"]]]]],[50,[32,3],0,null,[[\"store\"],[[30,0,[\"store\"]]]]],[30,0,[\"store\",\"values\"]],[30,0,[\"store\",\"tickValues\"]],[30,0,[\"store\",\"thumbs\"]],[30,0,[\"store\",\"min\"]],[30,0,[\"store\",\"max\"]],[30,0,[\"store\",\"step\"]]]]]]],[1,\"\\n\"]],[]],[[[1,\"    \"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n      \"],[8,[32,2],null,[[\"@rangeStyle\"],[[30,0,[\"store\",\"rangeStyle\"]]]],null],[1,\"\\n\\n\"],[42,[28,[31,5],[[28,[31,5],[[30,0,[\"store\",\"thumbs\"]]],null]],null],null,[[[1,\"        \"],[8,[32,3],[[16,\"aria-label\",[28,[30,0,[\"store\",\"defaultThumbLabel\"]],[[30,2,[\"index\"]]],null]]],[[\"@store\",\"@thumb\"],[[30,0,[\"store\"]],[30,2]]],null],[1,\"\\n\"]],[2]],null],[1,\"    \"]],[]]]]],[1,\"\\n\"]],[]]],[13]],[\"&attrs\",\"thumb\",\"&default\"],[\"if\",\"has-block\",\"yield\",\"component\",\"each\",\"-track-array\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [hash, Track, Range, ThumbComponent],
      "isStrictMode": true
    }), this);
  }
}

function toggleWithFallback(uncontrolledToggle, controlledToggle, ...args) {
  if (controlledToggle) {
    return controlledToggle(...args);
  }
  uncontrolledToggle?.(...args);
}

// import Component from '@glimmer/component';

function isPressed(pressed, value, isPressed) {
  if (!value) return Boolean(pressed);
  if (!isPressed) return Boolean(pressed);
  return isPressed(value);
}
const Toggle = setComponentTemplate(templateFactory(
/*
  {{#let (cell (isPressed @pressed @value @isPressed)) as |pressed|}}
  <button type="button" aria-pressed="{{pressed.current}}" {{on "click" (fn toggleWithFallback pressed.toggle @onChange @value)}} ...attributes>
    {{yield pressed.current}}
  </button>
{{/let}}
*/
{
  "id": "eEQG5D0O",
  "block": "[[[44,[[28,[32,0],[[28,[32,1],[[30,1],[30,2],[30,3]],null]],null]],[[[1,\"  \"],[11,\"button\"],[24,4,\"button\"],[16,\"aria-pressed\",[29,[[30,4,[\"current\"]]]]],[17,5],[4,[32,2],[\"click\",[28,[32,3],[[32,4],[30,4,[\"toggle\"]],[30,6],[30,2]],null]],null],[12],[1,\"\\n    \"],[18,7,[[30,4,[\"current\"]]]],[1,\"\\n  \"],[13],[1,\"\\n\"]],[4]]]],[\"@pressed\",\"@value\",\"@isPressed\",\"pressed\",\"&attrs\",\"@onChange\",\"&default\"],[\"let\",\"yield\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [cell, isPressed, on, fn, toggleWithFallback],
  "isStrictMode": true
}), templateOnly(undefined, "toggle:Toggle"));

const TABSTER_CONFIG = getTabsterAttribute({
  mover: {
    direction: MoverDirections.Both,
    cyclic: true
  }
});
function isMulti(x) {
  return x === "multi";
}
class ToggleGroup extends Component {
  // See: https://github.com/typed-ember/glint/issues/715
  static {
    setComponentTemplate(templateFactory(
    /*
      {{#if (isMulti this.args.type)}}
      <MultiToggleGroup @value={{this.args.value}} @onChange={{this.args.onChange}} ...attributes as |x|>
        {{yield x}}
      </MultiToggleGroup>
    {{else}}
      <SingleToggleGroup @value={{this.args.value}} @onChange={{this.args.onChange}} ...attributes as |x|>
        {{yield x}}
      </SingleToggleGroup>
    {{/if}}
    */
    {
      "id": "9f0alVwV",
      "block": "[[[41,[28,[32,0],[[30,0,[\"args\",\"type\"]]],null],[[[1,\"  \"],[8,[32,1],[[17,1]],[[\"@value\",\"@onChange\"],[[30,0,[\"args\",\"value\"]],[30,0,[\"args\",\"onChange\"]]]],[[\"default\"],[[[[1,\"\\n    \"],[18,4,[[30,2]]],[1,\"\\n  \"]],[2]]]]],[1,\"\\n\"]],[]],[[[1,\"  \"],[8,[32,2],[[17,1]],[[\"@value\",\"@onChange\"],[[30,0,[\"args\",\"value\"]],[30,0,[\"args\",\"onChange\"]]]],[[\"default\"],[[[[1,\"\\n    \"],[18,4,[[30,3]]],[1,\"\\n  \"]],[3]]]]],[1,\"\\n\"]],[]]]],[\"&attrs\",\"x\",\"x\",\"&default\"],[\"if\",\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [isMulti, MultiToggleGroup, SingleToggleGroup],
      "isStrictMode": true
    }), this);
  }
}
class SingleToggleGroup extends Component {
  static {
    decorateFieldV2$1(this.prototype, "activePressed", [localCopy("args.value")]);
  }
  #activePressed = (initializeDeferredDecorator$1(this, "activePressed"), void 0); // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  handleToggle = value => {
    if (this.activePressed === value) {
      this.activePressed = undefined;
      return;
    }
    this.activePressed = value;
    this.args.onChange?.(this.activePressed);
  };
  isPressed = value => value === this.activePressed;
  static {
    setComponentTemplate(templateFactory(
    /*
      <div data-tabster={{TABSTER_CONFIG}} ...attributes>
      {{yield (hash Item=(component Toggle onChange=this.handleToggle isPressed=this.isPressed))}}
    </div>
    */
    {
      "id": "fbpCuyi4",
      "block": "[[[11,0],[16,\"data-tabster\",[32,0]],[17,1],[12],[1,\"\\n  \"],[18,2,[[28,[32,1],null,[[\"Item\"],[[50,[32,2],0,null,[[\"onChange\",\"isPressed\"],[[30,0,[\"handleToggle\"]],[30,0,[\"isPressed\"]]]]]]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [TABSTER_CONFIG, hash, Toggle],
      "isStrictMode": true
    }), this);
  }
}
class MultiToggleGroup extends Component {
  /**
  * Normalizes @value to a Set
  * and makes sure that even if the input Set is reactive,
  * we don't mistakenly dirty it.
  */
  get activePressed() {
    const value = this.args.value;
    if (!value) {
      return new TrackedSet();
    }
    if (Array.isArray(value)) {
      return new TrackedSet(value);
    }
    if (value instanceof Set) {
      return new TrackedSet(value);
    }
    return new TrackedSet([value]);
  }
  static {
    decorateMethodV2(this.prototype, "activePressed", [cached]);
  }
  handleToggle = value => {
    if (this.activePressed.has(value)) {
      this.activePressed.delete(value);
    } else {
      this.activePressed.add(value);
    }
    this.args.onChange?.(new Set(this.activePressed.values()));
  };
  isPressed = value => this.activePressed.has(value);
  static {
    setComponentTemplate(templateFactory(
    /*
      <div data-tabster={{TABSTER_CONFIG}} ...attributes>
      {{yield (hash Item=(component Toggle onChange=this.handleToggle isPressed=this.isPressed))}}
    </div>
    */
    {
      "id": "fbpCuyi4",
      "block": "[[[11,0],[16,\"data-tabster\",[32,0]],[17,1],[12],[1,\"\\n  \"],[18,2,[[28,[32,1],null,[[\"Item\"],[[50,[32,2],0,null,[[\"onChange\",\"isPressed\"],[[30,0,[\"handleToggle\"]],[30,0,[\"isPressed\"]]]]]]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [TABSTER_CONFIG, hash, Toggle],
      "isStrictMode": true
    }), this);
  }
}

const VisuallyHidden = setComponentTemplate(templateFactory(
/*
  <span class="ember-primitives__visually-hidden" ...attributes>{{yield}}</span>
*/
{
  "id": "qwpL++bd",
  "block": "[[[11,1],[24,0,\"ember-primitives__visually-hidden\"],[17,1],[12],[18,2,null],[13]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "visually-hidden:VisuallyHidden"));

const testWaiter = buildWaiter("ember-primitive:zoetrope-waiter");
const DEFAULT_GAP = 8;
const DEFAULT_OFFSET = 0;
class Zoetrope extends Component {
  static {
    decorateFieldV2$1(this.prototype, "scrollerElement", [tracked], function () {
      return null;
    });
  }
  #scrollerElement = (initializeDeferredDecorator$1(this, "scrollerElement"), void 0);
  static {
    decorateFieldV2$1(this.prototype, "currentlyScrolled", [tracked], function () {
      return 0;
    });
  }
  #currentlyScrolled = (initializeDeferredDecorator$1(this, "currentlyScrolled"), void 0);
  static {
    decorateFieldV2$1(this.prototype, "scrollWidth", [tracked], function () {
      return 0;
    });
  }
  #scrollWidth = (initializeDeferredDecorator$1(this, "scrollWidth"), void 0);
  static {
    decorateFieldV2$1(this.prototype, "offsetWidth", [tracked], function () {
      return 0;
    });
  }
  #offsetWidth = (initializeDeferredDecorator$1(this, "offsetWidth"), void 0);
  setCSSVariables = modifier((element, _, {
    gap,
    offset
  }) => {
    if (gap) element.style.setProperty("--zoetrope-gap", `${gap}px`);
    if (offset) element.style.setProperty("--zoetrope-offset", `${offset}px`);
  });
  scrollerWaiter = testWaiter.beginAsync();
  noScrollWaiter = () => {
    testWaiter.endAsync(this.scrollerWaiter);
  };
  configureScroller = modifier(element => {
    this.scrollerElement = element;
    this.currentlyScrolled = element.scrollLeft;
    const zoetropeResizeObserver = new ResizeObserver(() => {
      this.scrollWidth = element.scrollWidth;
      this.offsetWidth = element.offsetWidth;
    });
    zoetropeResizeObserver.observe(element);
    element.addEventListener("scroll", this.scrollListener, {
      passive: true
    });
    element.addEventListener("keydown", this.tabListener);
    requestAnimationFrame(() => {
      testWaiter.endAsync(this.scrollerWaiter);
    });
    return () => {
      element.removeEventListener("scroll", this.scrollListener);
      element.removeEventListener("keydown", this.tabListener);
      zoetropeResizeObserver.unobserve(element);
    };
  });
  tabListener = event => {
    const target = event.target;
    const {
      key,
      shiftKey
    } = event;
    if (!this.scrollerElement || this.scrollerElement === target) {
      return;
    }
    if (key !== "Tab") {
      return;
    }
    const nextElement = target.nextElementSibling;
    const previousElement = target.previousElementSibling;
    if (!shiftKey && !nextElement || shiftKey && !previousElement) {
      return;
    }
    event.preventDefault();
    let newTarget = null;
    if (shiftKey) {
      newTarget = previousElement;
    } else {
      newTarget = nextElement;
    }
    if (!newTarget) {
      return;
    }
    newTarget?.focus({
      preventScroll: true
    });
    const rect = getRelativeBoundingClientRect(newTarget, this.scrollerElement);
    this.scrollerElement?.scrollBy({
      left: rect.left,
      behavior: this.scrollBehavior
    });
  };
  scrollListener = () => {
    this.currentlyScrolled = this.scrollerElement?.scrollLeft || 0;
  };
  get offset() {
    return this.args.offset ?? DEFAULT_OFFSET;
  }
  get gap() {
    return this.args.gap ?? DEFAULT_GAP;
  }
  get canScroll() {
    return this.scrollWidth > this.offsetWidth + this.offset;
  }
  get cannotScrollLeft() {
    return this.currentlyScrolled <= this.offset;
  }
  get cannotScrollRight() {
    return this.scrollWidth - this.offsetWidth - this.offset < this.currentlyScrolled;
  }
  get scrollBehavior() {
    return this.args.scrollBehavior || "smooth";
  }
  scrollLeft = () => {
    if (!(this.scrollerElement instanceof HTMLElement)) {
      return;
    }
    const {
      firstChild
    } = this.findOverflowingElement();
    if (!firstChild) {
      return;
    }
    const children = [...this.scrollerElement.children];
    const firstChildIndex = children.indexOf(firstChild);
    let targetElement = firstChild;
    let accumalatedWidth = 0;
    for (let i = firstChildIndex; i >= 0; i--) {
      const child = children[i];
      if (!(child instanceof HTMLElement)) {
        continue;
      }
      accumalatedWidth += child.offsetWidth + this.gap;
      if (accumalatedWidth >= this.offsetWidth) {
        break;
      }
      targetElement = child;
    }
    const rect = getRelativeBoundingClientRect(targetElement, this.scrollerElement);
    this.scrollerElement.scrollBy({
      left: rect.left,
      behavior: this.scrollBehavior
    });
    void waitForPromise(new Promise(requestAnimationFrame));
  };
  scrollRight = () => {
    if (!(this.scrollerElement instanceof HTMLElement)) {
      return;
    }
    const {
      activeSlide,
      lastChild
    } = this.findOverflowingElement();
    if (!lastChild) {
      return;
    }
    let rect = getRelativeBoundingClientRect(lastChild, this.scrollerElement);
    // If the card is larger than the container then skip to the next card
    if (rect.width > this.offsetWidth && activeSlide === lastChild) {
      const children = [...this.scrollerElement.children];
      const lastChildIndex = children.indexOf(lastChild);
      const targetElement = children[lastChildIndex + 1];
      if (!targetElement) {
        return;
      }
      rect = getRelativeBoundingClientRect(targetElement, this.scrollerElement);
    }
    this.scrollerElement?.scrollBy({
      left: rect.left,
      behavior: this.scrollBehavior
    });
    void waitForPromise(new Promise(requestAnimationFrame));
  };
  findOverflowingElement() {
    const returnObj = {
      firstChild: undefined,
      lastChild: undefined,
      activeSlide: undefined
    };
    if (!this.scrollerElement) {
      return returnObj;
    }
    const parentElement = this.scrollerElement.parentElement;
    if (!parentElement) {
      return returnObj;
    }
    const containerRect = getRelativeBoundingClientRect(this.scrollerElement, parentElement);
    const children = [...this.scrollerElement.children];
    // Find the first child that is overflowing the left edge of the container
    // and the last child that is overflowing the right edge of the container
    for (const child of children) {
      const rect = getRelativeBoundingClientRect(child, this.scrollerElement);
      if (rect.right + this.gap >= containerRect.left && !returnObj.firstChild) {
        returnObj.firstChild = child;
      }
      if (rect.left >= this.offset && !returnObj.activeSlide) {
        returnObj.activeSlide = child;
      }
      if (rect.right >= containerRect.width && !returnObj.lastChild) {
        returnObj.lastChild = child;
        break;
      }
    }
    if (!returnObj.firstChild) {
      returnObj.firstChild = children[0];
    }
    if (!returnObj.lastChild) {
      returnObj.lastChild = children[children.length - 1];
    }
    return returnObj;
  }
  static {
    setComponentTemplate(templateFactory(
    /*
      <section class="ember-primitives__zoetrope" {{this.setCSSVariables gap=this.gap offset=this.offset}} ...attributes>
      {{#if (has-block "header")}}
        <div class="ember-primitives__zoetrope__header">
          {{yield to="header"}}
        </div>
      {{/if}}
    
      {{#if (has-block "controls")}}
        {{yield (hash cannotScrollLeft=this.cannotScrollLeft cannotScrollRight=this.cannotScrollRight canScroll=this.canScroll scrollLeft=this.scrollLeft scrollRight=this.scrollRight) to="controls"}}
      {{else}}
        {{#if this.canScroll}}
          <div class="ember-primitives__zoetrope__controls">
            <button type="button" {{on "click" this.scrollLeft}} disabled={{this.cannotScrollLeft}}>Left</button>
    
            <button type="button" {{on "click" this.scrollRight}} disabled={{this.cannotScrollRight}}>Right</button>
          </div>
        {{/if}}
      {{/if}}
      {{#if (has-block "content")}}
        <div class="ember-primitives__zoetrope__scroller" {{this.configureScroller}}>
          {{yield to="content"}}
        </div>
      {{else}}
        {{(this.noScrollWaiter)}}
      {{/if}}
    </section>
    */
    {
      "id": "AONsqAWP",
      "block": "[[[11,\"section\"],[24,0,\"ember-primitives__zoetrope\"],[17,1],[4,[30,0,[\"setCSSVariables\"]],null,[[\"gap\",\"offset\"],[[30,0,[\"gap\"]],[30,0,[\"offset\"]]]]],[12],[1,\"\\n\"],[41,[48,[30,2]],[[[1,\"    \"],[10,0],[14,0,\"ember-primitives__zoetrope__header\"],[12],[1,\"\\n      \"],[18,2,null],[1,\"\\n    \"],[13],[1,\"\\n\"]],[]],null],[1,\"\\n\"],[41,[48,[30,3]],[[[1,\"    \"],[18,3,[[28,[32,0],null,[[\"cannotScrollLeft\",\"cannotScrollRight\",\"canScroll\",\"scrollLeft\",\"scrollRight\"],[[30,0,[\"cannotScrollLeft\"]],[30,0,[\"cannotScrollRight\"]],[30,0,[\"canScroll\"]],[30,0,[\"scrollLeft\"]],[30,0,[\"scrollRight\"]]]]]]],[1,\"\\n\"]],[]],[[[41,[30,0,[\"canScroll\"]],[[[1,\"      \"],[10,0],[14,0,\"ember-primitives__zoetrope__controls\"],[12],[1,\"\\n        \"],[11,\"button\"],[16,\"disabled\",[30,0,[\"cannotScrollLeft\"]]],[24,4,\"button\"],[4,[32,1],[\"click\",[30,0,[\"scrollLeft\"]]],null],[12],[1,\"Left\"],[13],[1,\"\\n\\n        \"],[11,\"button\"],[16,\"disabled\",[30,0,[\"cannotScrollRight\"]]],[24,4,\"button\"],[4,[32,1],[\"click\",[30,0,[\"scrollRight\"]]],null],[12],[1,\"Right\"],[13],[1,\"\\n      \"],[13],[1,\"\\n\"]],[]],null]],[]]],[41,[48,[30,4]],[[[1,\"    \"],[11,0],[24,0,\"ember-primitives__zoetrope__scroller\"],[4,[30,0,[\"configureScroller\"]],null,null],[12],[1,\"\\n      \"],[18,4,null],[1,\"\\n    \"],[13],[1,\"\\n\"]],[]],[[[1,\"    \"],[1,[28,[30,0,[\"noScrollWaiter\"]],null,null]],[1,\"\\n\"]],[]]],[13]],[\"&attrs\",\"&header\",\"&controls\",\"&content\"],[\"if\",\"has-block\",\"yield\"]]",
      "moduleName": "(unknown template module)",
      "scope": () => [hash, on],
      "isStrictMode": true
    }), this);
  }
}
function getRelativeBoundingClientRect(childElement, parentElement) {
  if (!childElement || !parentElement) {
    throw new Error("Both childElement and parentElement must be provided");
  }
  // Get the bounding rect of the child and parent elements
  const childRect = childElement.getBoundingClientRect();
  const parentRect = parentElement.getBoundingClientRect();
  // Get computed styles of the parent element
  const parentStyles = window.getComputedStyle(parentElement);
  // Extract and parse parent's padding, and border, for all sides
  const parentPaddingTop = parseFloat(parentStyles.paddingTop);
  const parentPaddingLeft = parseFloat(parentStyles.paddingLeft);
  const parentBorderTopWidth = parseFloat(parentStyles.borderTopWidth);
  const parentBorderLeftWidth = parseFloat(parentStyles.borderLeftWidth);
  // Calculate child's position relative to parent's content area (including padding and borders)
  return {
    width: childRect.width,
    height: childRect.height,
    top: childRect.top - parentRect.top - parentBorderTopWidth - parentPaddingTop,
    left: childRect.left - parentRect.left - parentBorderLeftWidth - parentPaddingLeft,
    bottom: childRect.top - parentRect.top - parentBorderTopWidth - parentPaddingTop + childRect.height,
    right: childRect.left - parentRect.left - parentBorderLeftWidth - parentPaddingLeft + childRect.width
  };
}

export { Accordion, Avatar, Breadcrumb, Dialog, Drawer, ExternalLink, IncrementalEach, Key, KeyCombo, Link, Menu, Dialog as Modal, OTP, OTPInput, TARGETS as PORTALS, Popover, Portal, PortalTargets, Progress, Rating, Resizable, Handle as ResizableHandle, Panel as ResizablePanel, Separator$1 as Separator, Slider, StickyFooter, Toggle, ToggleGroup, VisuallyHidden, Zoetrope, link };
