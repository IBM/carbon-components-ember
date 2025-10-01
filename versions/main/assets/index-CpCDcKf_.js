import { g as get, aq as tracked, a9 as GlimmerComponent, s as setComponentTemplate, i as templateFactory, am as hash, t as templateOnly, o as on, a3 as decorateFieldV2, a4 as initializeDeferredDecorator, ar as resourceFactory, as as resource, at as trackedFunction, au as cell, av as modifier, aw as link, ax as ExternalLink, ay as assert, az as arrow, aA as ElementHelper, aB as guidFor, aC as buildWaiter, aD as isDestroyed, aE as isDestroying, j as fn, aF as uniqueId, a6 as decorateMethodV2, aG as cached, aH as toggleWithFallback, aI as TrackedSet, aJ as waitForPromise } from './main-BfgFUvon.js';
export { aK as Scroller, aL as Shadowed, aM as Switch, aN as service } from './main-BfgFUvon.js';
export { Form } from './form-BenVKnI0.js';
import { setTabsterAttribute, getTabsterAttribute, getTabster, MoverDirections } from './tabster.esm-D5kvNlf-.js';
import { FloatingUI } from './floating-ui-BoJZRz5b.js';
import './index-dGgzbTWI.js';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
var _class, _descriptor;
let Meta = (_class = class Meta {
  constructor() {
    _defineProperty(this, "prevRemote", void 0);
    _defineProperty(this, "peek", void 0);
    _initializerDefineProperty(this, "value", _descriptor, this);
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, "value", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
function getOrCreateMeta(instance, metas, initializer) {
  let meta = metas.get(instance);
  if (meta === undefined) {
    meta = new Meta();
    metas.set(instance, meta);
    meta.value = meta.peek = initializer;
  }
  return meta;
}
function localCopy(memo, initializer) {
  let metas = new WeakMap();
  return () => {
    let memoFn = obj => get(obj, memo);
    return {
      get() {
        let meta = getOrCreateMeta(this, metas, initializer);
        let {
          prevRemote
        } = meta;
        let incomingValue = memoFn(this);
        if (prevRemote !== incomingValue) {
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

class AccordionContent extends GlimmerComponent {
  static {
    setComponentTemplate(templateFactory(
    /*
      
        <div role="region" id={{@value}} data-state={{getDataState @isExpanded}} hidden={{this.isHidden}} data-disabled={{@disabled}} ...attributes>
          {{yield}}
        </div>
      
    */
    {
      "id": "R3Cq927e",
      "block": "[[[1,\"\\n    \"],[11,0],[24,\"role\",\"region\"],[16,1,[30,1]],[16,\"data-state\",[28,[32,0],[[30,2]],null]],[16,\"hidden\",[30,0,[\"isHidden\"]]],[16,\"data-disabled\",[30,3]],[17,4],[12],[1,\"\\n      \"],[18,5,null],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"@value\",\"@isExpanded\",\"@disabled\",\"&attrs\",\"&default\"],[\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/item-D6pwWzMs.js",
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
  "id": "Nnzcvrwv",
  "block": "[[[1,\"\\n  \"],[11,\"button\"],[24,4,\"button\"],[16,\"aria-controls\",[30,1]],[16,\"aria-expanded\",[30,2]],[16,\"data-state\",[28,[32,0],[[30,2]],null]],[16,\"data-disabled\",[30,3]],[16,\"aria-disabled\",[52,[30,3],\"true\",\"false\"]],[17,4],[4,[32,1],[\"click\",[30,5]],null],[12],[1,\"\\n    \"],[18,6,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"@value\",\"@isExpanded\",\"@disabled\",\"&attrs\",\"@toggleItem\",\"&default\"],[\"if\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/item-D6pwWzMs.js",
  "scope": () => [getDataState, on],
  "isStrictMode": true
}), templateOnly(undefined, "item-D6pwWzMs:AccordionTrigger"));
const AccordionHeader = setComponentTemplate(templateFactory(
/*
  
  <div role="heading" aria-level="3" data-state={{getDataState @isExpanded}} data-disabled={{@disabled}} ...attributes>
    {{yield (hash Trigger=(component Trigger value=@value isExpanded=@isExpanded disabled=@disabled toggleItem=@toggleItem))}}
  </div>

*/
{
  "id": "gqX2tFGq",
  "block": "[[[1,\"\\n  \"],[11,0],[24,\"role\",\"heading\"],[24,\"aria-level\",\"3\"],[16,\"data-state\",[28,[32,0],[[30,1]],null]],[16,\"data-disabled\",[30,2]],[17,3],[12],[1,\"\\n    \"],[18,6,[[28,[32,1],null,[[\"Trigger\"],[[50,[32,2],0,null,[[\"value\",\"isExpanded\",\"disabled\",\"toggleItem\"],[[30,4],[30,1],[30,2],[30,5]]]]]]]]],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"@isExpanded\",\"@disabled\",\"&attrs\",\"@value\",\"@toggleItem\",\"&default\"],[\"yield\",\"component\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/item-D6pwWzMs.js",
  "scope": () => [getDataState, hash, AccordionTrigger],
  "isStrictMode": true
}), templateOnly(undefined, "item-D6pwWzMs:AccordionHeader"));
function getDataState(isExpanded) {
  return isExpanded ? "open" : "closed";
}
class AccordionItem extends GlimmerComponent {
  static {
    setComponentTemplate(templateFactory(
    /*
      
        <div data-state={{getDataState this.isExpanded}} data-disabled={{@disabled}} ...attributes>
          {{yield (hash isExpanded=this.isExpanded Header=(component Header value=@value isExpanded=this.isExpanded disabled=@disabled toggleItem=this.toggleItem) Content=(component Content value=@value isExpanded=this.isExpanded disabled=@disabled))}}
        </div>
      
    */
    {
      "id": "Ixnsp0o0",
      "block": "[[[1,\"\\n    \"],[11,0],[16,\"data-state\",[28,[32,0],[[30,0,[\"isExpanded\"]]],null]],[16,\"data-disabled\",[30,1]],[17,2],[12],[1,\"\\n      \"],[18,4,[[28,[32,1],null,[[\"isExpanded\",\"Header\",\"Content\"],[[30,0,[\"isExpanded\"]],[50,[32,2],0,null,[[\"value\",\"isExpanded\",\"disabled\",\"toggleItem\"],[[30,3],[30,0,[\"isExpanded\"]],[30,1],[30,0,[\"toggleItem\"]]]]],[50,[32,3],0,null,[[\"value\",\"isExpanded\",\"disabled\"],[[30,3],[30,0,[\"isExpanded\"]],[30,1]]]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"@disabled\",\"&attrs\",\"@value\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/item-D6pwWzMs.js",
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

class Accordion extends GlimmerComponent {
  static {
    setComponentTemplate(templateFactory(
    /*
      
        <div data-disabled={{@disabled}} ...attributes>
          {{yield (hash Item=(component AccordionItem selectedValue=this.selectedValue toggleItem=this.toggleItem disabled=@disabled))}}
        </div>
      
    */
    {
      "id": "skyVbH40",
      "block": "[[[1,\"\\n    \"],[11,0],[16,\"data-disabled\",[30,1]],[17,2],[12],[1,\"\\n      \"],[18,3,[[28,[32,0],null,[[\"Item\"],[[50,[32,1],0,null,[[\"selectedValue\",\"toggleItem\",\"disabled\"],[[30,0,[\"selectedValue\"]],[30,0,[\"toggleItem\"]],[30,1]]]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"@disabled\",\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/accordion.js",
      "scope": () => [hash, AccordionItem],
      "isStrictMode": true
    }), this);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  static {
    decorateFieldV2(this.prototype, "_internallyManagedValue", [localCopy("args.defaultValue")]);
  }
  #_internallyManagedValue = (initializeDeferredDecorator(this, "_internallyManagedValue"), void 0);
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
  "id": "uW8uE8YT",
  "block": "[[[1,\"\\n\"],[41,[51,[30,1]],[[[44,[[28,[32,0],[[30,2]],null]],[[[41,[30,3],[[[1,\"        \"],[18,4,null],[1,\"\\n\"]],[]],null]],[3]]]],[]],null]],[\"@isLoaded\",\"@delayMs\",\"delayFinished\",\"&default\"],[\"unless\",\"let\",\"if\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/avatar.js",
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
  "id": "V04hlwRj",
  "block": "[[[1,\"\\n\"],[41,[30,1],[[[1,\"    \"],[11,\"img\"],[24,\"alt\",\"__missing__\"],[17,2],[16,\"src\",[30,3]],[12],[13],[1,\"\\n\"]],[]],null]],[\"@isLoaded\",\"&attrs\",\"@src\"],[\"if\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/avatar.js",
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
  "id": "IrVohE+F",
  "block": "[[[1,\"\\n\"],[44,[[28,[32,0],[[30,1]],null]],[[[1,\"    \"],[11,1],[24,\"data-prim-avatar\",\"\"],[17,3],[16,\"data-loading\",[30,2,[\"isLoading\"]]],[16,\"data-error\",[30,2,[\"isError\"]]],[12],[1,\"\\n      \"],[18,4,[[28,[32,1],null,[[\"Image\",\"Fallback\",\"isLoading\",\"isError\"],[[50,[32,2],0,null,[[\"src\",\"isLoaded\"],[[30,1],[30,2,[\"isResolved\"]]]]],[50,[32,3],0,null,[[\"isLoaded\"],[[30,2,[\"isResolved\"]]]]],[30,2,[\"isLoading\"]],[30,2,[\"isError\"]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n\"]],[2]]]],[\"@src\",\"imgState\",\"&attrs\",\"&default\"],[\"let\",\"yield\",\"component\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/avatar.js",
  "scope": () => [ReactiveImage, hash, Image, Fallback],
  "isStrictMode": true
}), templateOnly(undefined, "avatar:Avatar"));

const DialogElement = setComponentTemplate(templateFactory(
/*
  
  <dialog ...attributes open={{@open}} {{on "close" @onClose}} {{@register}}>
    {{yield}}
  </dialog>

*/
{
  "id": "o2NpTgvD",
  "block": "[[[1,\"\\n  \"],[11,\"dialog\"],[17,1],[16,\"open\",[30,2]],[4,[32,0],[\"close\",[30,3]],null],[4,[30,4],null,null],[12],[1,\"\\n    \"],[18,5,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"@open\",\"@onClose\",\"@register\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/dialog.js",
  "scope": () => [on],
  "isStrictMode": true
}), templateOnly(undefined, "dialog:DialogElement"));
class ModalDialog extends GlimmerComponent {
  static {
    setComponentTemplate(templateFactory(
    /*
      
        {{yield (hash isOpen=this.isOpen open=this.open close=this.close focusOnClose=this.refocus Dialog=(component DialogElement open=@open onClose=this.handleClose register=this.register))}}
      
    */
    {
      "id": "UkthCK2H",
      "block": "[[[1,\"\\n    \"],[18,2,[[28,[32,0],null,[[\"isOpen\",\"open\",\"close\",\"focusOnClose\",\"Dialog\"],[[30,0,[\"isOpen\"]],[30,0,[\"open\"]],[30,0,[\"close\"]],[30,0,[\"refocus\"]],[50,[32,1],0,null,[[\"open\",\"onClose\",\"register\"],[[30,1],[30,0,[\"handleClose\"]],[30,0,[\"register\"]]]]]]]]]],[1,\"\\n  \"]],[\"@open\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/dialog.js",
      "scope": () => [hash, DialogElement],
      "isStrictMode": true
    }), this);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  static {
    decorateFieldV2(this.prototype, "_isOpen", [localCopy("args.open")]);
  }
  #_isOpen = (initializeDeferredDecorator(this, "_isOpen"), void 0);
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
    decorateFieldV2(this.prototype, "dialogElement", [tracked]);
  }
  #dialogElement = (initializeDeferredDecorator(this, "dialogElement"), void 0);
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
  "id": "P1dQ84W3",
  "block": "[[[1,\"\\n  \"],[11,1],[24,0,\"ember-primitives__key-combination\"],[17,1],[12],[1,\"\\n\"],[44,[[28,[32,0],[[30,2],[30,3]],null]],[[[42,[28,[31,2],[[28,[31,2],[[30,4]],null]],null],null,[[[1,\"        \"],[8,[32,1],null,null,[[\"default\"],[[[[1,[30,5]]],[]]]]],[1,\"\\n\"],[41,[28,[32,2],[[30,4],[30,6]],null],[[[1,\"          \"],[10,1],[14,0,\"ember-primitives__key-combination__separator\"],[12],[1,\"+\"],[13],[1,\"\\n\"]],[]],null]],[5,6]],null]],[4]]],[1,\"  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"@keys\",\"@mac\",\"keys\",\"key\",\"i\"],[\"let\",\"each\",\"-track-array\",\"if\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/keys.js",
  "scope": () => [getKeys, Key, isNotLast],
  "isStrictMode": true
}), templateOnly(undefined, "keys:KeyCombo"));
const Key = setComponentTemplate(templateFactory(
/*
  
  <kbd class="ember-primitives__key" ...attributes>{{yield}}</kbd>

*/
{
  "id": "lL+ipB1G",
  "block": "[[[1,\"\\n  \"],[11,\"kbd\"],[24,0,\"ember-primitives__key\"],[17,1],[12],[18,2,null],[13],[1,\"\\n\"]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/keys.js",
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
  "id": "+64QW9xY",
  "block": "[[[1,\"\\n  \"],[11,0],[24,0,\"ember-primitives__sticky-footer__wrapper\"],[17,1],[12],[1,\"\\n    \"],[10,0],[14,0,\"ember-primitives__sticky-footer__container\"],[12],[1,\"\\n      \"],[10,0],[14,0,\"ember-primitives__sticky-footer__content\"],[12],[1,\"\\n        \"],[18,2,null],[1,\"\\n      \"],[13],[1,\"\\n      \"],[10,0],[14,0,\"ember-primitives__sticky-footer__footer\"],[12],[1,\"\\n        \"],[18,3,null],[1,\"\\n      \"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"&content\",\"&footer\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/layout/sticky-footer.js",
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
  "id": "tIQ7Lzhl",
  "block": "[[[1,\"\\n\"],[44,[[28,[32,0],[[30,1]],[[\"includeActiveQueryParams\",\"activeOnSubPaths\"],[[30,2],[30,3]]]]],[[[41,[30,4,[\"isExternal\"]],[[[1,\"      \"],[8,[32,1],[[16,6,[30,1]],[17,5]],null,[[\"default\"],[[[[1,\"\\n        \"],[18,6,[[28,[32,2],null,[[\"isExternal\",\"isActive\"],[true,false]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n\"]],[]],[[[1,\"      \"],[11,3],[16,\"data-active\",[30,4,[\"isActive\"]]],[16,6,[52,[30,1],[30,1],\"##missing##\"]],[17,5],[4,[32,3],[\"click\",[30,4,[\"handleClick\"]]],null],[12],[1,\"\\n        \"],[18,6,[[28,[32,2],null,[[\"isExternal\",\"isActive\"],[false,[30,4,[\"isActive\"]]]]]]],[1,\"\\n      \"],[13],[1,\"\\n\"]],[]]]],[4]]]],[\"@href\",\"@includeActiveQueryParams\",\"@activeOnSubPaths\",\"l\",\"&attrs\",\"&default\"],[\"let\",\"if\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/link.js",
  "scope": () => [link, ExternalLink, hash, on],
  "isStrictMode": true
}), templateOnly(undefined, "link:Link"));

const TARGETS = Object.freeze({
  popover: "ember-primitives__portal-targets__popover",
  tooltip: "ember-primitives__portal-targets__tooltip",
  modal: "ember-primitives__portal-targets__modal"
});
function findNearestTarget(origin, name) {
  let element = null;
  let parent = origin.parentNode;
  while (!element && parent) {
    element = parent.querySelector(`[data-portal-name=${name}]`);
    if (element) break;
    parent = parent.parentNode;
  }
  (!(element) && assert(`Could not find element by the given name: \`${name}\`.` + ` The known names are ` + `${Object.values(TARGETS).join(", ")} ` + `-- but any name will work as long as it is set to the \`data-portal-name\` attribute. ` + `Double check that the element you're wanting to portal to is rendered. ` + `The element passed to \`findNearestTarget\` is stored on \`window.prime0\` ` + `You can debug in your browser's console via ` + `\`document.querySelector('[data-portal-name="${name}"]')\``));
  return element;
}
const PortalTargets = setComponentTemplate(templateFactory(
/*
  
  <div data-portal-name={{TARGETS.popover}}></div>
  <div data-portal-name={{TARGETS.tooltip}}></div>
  <div data-portal-name={{TARGETS.modal}}></div>

*/
{
  "id": "4bNRMTvt",
  "block": "[[[1,\"\\n  \"],[10,0],[15,\"data-portal-name\",[32,0,[\"popover\"]]],[12],[13],[1,\"\\n  \"],[10,0],[15,\"data-portal-name\",[32,0,[\"tooltip\"]]],[12],[13],[1,\"\\n  \"],[10,0],[15,\"data-portal-name\",[32,0,[\"modal\"]]],[12],[13],[1,\"\\n\"]],[],[]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/portal-targets.js",
  "scope": () => [TARGETS],
  "isStrictMode": true
}), templateOnly(undefined, "portal-targets:PortalTargets"));

const anchor = modifier((element, [to, update]) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const found = findNearestTarget(element, to);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  update(found);
});
const ElementValue = () => cell();
const Portal = setComponentTemplate(templateFactory(
/*
  
  {{#let (ElementValue) as |target|}}
    {{!-- This div is always going to be empty,
          because it'll either find the portal and render content elsewhere,
          it it won't find the portal and won't render anything.
    --}}
    {{!-- template-lint-disable no-inline-styles --}}
    <div style="display:contents;" {{anchor @to target.set}}>
      {{#if target.current}}
        {{#in-element target.current}}
          {{yield}}
        {{/in-element}}
      {{/if}}
    </div>
  {{/let}}

*/
{
  "id": "orbZTFIk",
  "block": "[[[1,\"\\n\"],[44,[[28,[32,0],null,null]],[[[1,\"    \"],[11,0],[24,5,\"display:contents;\"],[4,[32,1],[[30,2],[30,1,[\"set\"]]],null],[12],[1,\"\\n\"],[41,[30,1,[\"current\"]],[[[40,[[[1,\"          \"],[18,3,null],[1,\"\\n\"]],[]],\"%cursor:0%\",[28,[31,3],[[30,1,[\"current\"]]],null]]],[]],null],[1,\"    \"],[13],[1,\"\\n\"]],[1]]]],[\"target\",\"@to\",\"&default\"],[\"let\",\"if\",\"in-element\",\"-in-el-null\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/portal.js",
  "scope": () => [ElementValue, anchor],
  "isStrictMode": true
}), templateOnly(undefined, "portal:Portal"));

function getElementTag(tagName) {
  return tagName || "div";
}
/**
 * Allows lazy evaluation of the portal target (do nothing until rendered)
 * This is useful because the algorithm for finding the portal target isn't cheap.
 */
const Content$1 = setComponentTemplate(templateFactory(
/*
  
  {{#let (element (getElementTag @as)) as |El|}}
    {{#if @inline}}
      {{!-- @glint-ignore
            https://github.com/tildeio/ember-element-helper/issues/91
            https://github.com/typed-ember/glint/issues/610
      --}}
      <El {{@floating}} ...attributes>
        {{yield}}
      </El>
    {{else}}
      <Portal @to={{TARGETS.popover}}>
        {{!-- @glint-ignore
              https://github.com/tildeio/ember-element-helper/issues/91
              https://github.com/typed-ember/glint/issues/610
        --}}
        <El {{@floating}} ...attributes>
          {{yield}}
        </El>
      </Portal>
    {{/if}}
  {{/let}}

*/
{
  "id": "GQ6pViu5",
  "block": "[[[1,\"\\n\"],[44,[[28,[32,0],[[28,[32,1],[[30,1]],null]],null]],[[[41,[30,3],[[[1,\"      \"],[8,[30,2],[[17,4],[4,[30,5],null,null]],null,[[\"default\"],[[[[1,\"\\n        \"],[18,6,null],[1,\"\\n      \"]],[]]]]],[1,\"\\n\"]],[]],[[[1,\"      \"],[8,[32,2],null,[[\"@to\"],[[32,3,[\"popover\"]]]],[[\"default\"],[[[[1,\"\\n\"],[1,\"        \"],[8,[30,2],[[17,4],[4,[30,5],null,null]],null,[[\"default\"],[[[[1,\"\\n          \"],[18,6,null],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n\"]],[]]]],[2]]]],[\"@as\",\"El\",\"@inline\",\"&attrs\",\"@floating\",\"&default\"],[\"let\",\"if\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/popover.js",
  "scope": () => [ElementHelper, getElementTag, Portal, TARGETS],
  "isStrictMode": true
}), templateOnly(undefined, "popover:Content"));
const arrowSides = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
const attachArrow = modifier((element, _, named) => {
  if (element === named.arrowElement.current) {
    if (!named.data) return;
    if (!named.data.middlewareData) return;
    const {
      arrow
    } = named.data.middlewareData;
    const {
      placement
    } = named.data;
    if (!arrow) return;
    if (!placement) return;
    const {
      x: arrowX,
      y: arrowY
    } = arrow;
    const otherSide = placement.split("-")[0];
    const staticSide = arrowSides[otherSide];
    Object.assign(named.arrowElement.current.style, {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-4px"
    });
    return;
  }
  void (async () => {
    await Promise.resolve();
    named.arrowElement.set(element);
  })();
});
const ArrowElement = () => cell();
function maybeAddArrow(middleware, element) {
  const result = [...(middleware || [])];
  if (element) {
    result.push(arrow({
      element
    }));
  }
  return result;
}
function flipOptions(options) {
  return {
    elementContext: "reference",
    ...options
  };
}
const Popover = setComponentTemplate(templateFactory(
/*
  
  {{#let (ArrowElement) as |arrowElement|}}
    <FloatingUI @placement={{@placement}} @strategy={{@strategy}} @middleware={{maybeAddArrow @middleware arrowElement.current}} @flipOptions={{flipOptions @flipOptions}} @shiftOptions={{@shiftOptions}} @offsetOptions={{@offsetOptions}} as |reference floating extra|>
      {{#let (modifier attachArrow arrowElement=arrowElement data=extra.data) as |arrow|}}
        {{yield (hash reference=reference setReference=extra.setReference Content=(component Content floating=floating inline=@inline) data=extra.data arrow=arrow)}}
      {{/let}}
    </FloatingUI>
  {{/let}}

*/
{
  "id": "IDuBk/2k",
  "block": "[[[1,\"\\n\"],[44,[[28,[32,0],null,null]],[[[1,\"    \"],[8,[32,1],null,[[\"@placement\",\"@strategy\",\"@middleware\",\"@flipOptions\",\"@shiftOptions\",\"@offsetOptions\"],[[30,2],[30,3],[28,[32,2],[[30,4],[30,1,[\"current\"]]],null],[28,[32,3],[[30,5]],null],[30,6],[30,7]]],[[\"default\"],[[[[1,\"\\n\"],[44,[[50,[32,4],2,null,[[\"arrowElement\",\"data\"],[[30,1],[30,10,[\"data\"]]]]]],[[[1,\"        \"],[18,13,[[28,[32,5],null,[[\"reference\",\"setReference\",\"Content\",\"data\",\"arrow\"],[[30,8],[30,10,[\"setReference\"]],[50,[32,6],0,null,[[\"floating\",\"inline\"],[[30,9],[30,12]]]],[30,10,[\"data\"]],[30,11]]]]]],[1,\"\\n\"]],[11]]],[1,\"    \"]],[8,9,10]]]]],[1,\"\\n\"]],[1]]]],[\"arrowElement\",\"@placement\",\"@strategy\",\"@middleware\",\"@flipOptions\",\"@shiftOptions\",\"@offsetOptions\",\"reference\",\"floating\",\"extra\",\"arrow\",\"@inline\",\"&default\"],[\"let\",\"modifier\",\"yield\",\"component\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/popover.js",
  "scope": () => [ArrowElement, FloatingUI, maybeAddArrow, flipOptions, attachArrow, hash, Content$1],
  "isStrictMode": true
}), templateOnly(undefined, "popover:Popover"));

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
  "id": "0n7d/vmE",
  "block": "[[[1,\"\\n  \"],[11,0],[24,\"role\",\"separator\"],[17,1],[12],[1,\"\\n    \"],[18,2,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/menu.js",
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
    <button type="button" role="menuitem" {{!-- @glint-expect-error --}} {{maybeClick}} {{on "pointermove" focusOnHover}} ...attributes>
      {{yield}}
    </button>
  {{/let}}

*/
{
  "id": "bUlfKybQ",
  "block": "[[[1,\"\\n\"],[44,[[52,[30,1],[50,[32,0],2,[\"click\",[30,1]],null]]],[[[1,\"    \"],[11,\"button\"],[24,4,\"button\"],[24,\"role\",\"menuitem\"],[17,3],[4,[30,2],null,null],[4,[32,0],[\"pointermove\",[32,1]],null],[12],[1,\"\\n      \"],[18,4,null],[1,\"\\n    \"],[13],[1,\"\\n\"]],[2]]]],[\"@onSelect\",\"maybeClick\",\"&attrs\",\"&default\"],[\"let\",\"if\",\"modifier\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/menu.js",
  "scope": () => [on, focusOnHover],
  "isStrictMode": true
}), templateOnly(undefined, "menu:Item"));
const installContent = modifier((element, _, {
  isOpen,
  triggerElement
}) => {
  // focus first focusable element on the content
  const tabster = getTabster(window);
  const firstFocusable = tabster?.focusable.findFirst({
    container: element
  });
  firstFocusable?.focus();
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
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onDocumentKeydown);
  };
});
const Content = setComponentTemplate(templateFactory(
/*
  
  {{#if @isOpen.current}}
    <@PopoverContent id={{@contentId}} role="menu" data-tabster={{TABSTER_CONFIG_CONTENT}} tabindex="0" {{installContent isOpen=@isOpen triggerElement=@triggerElement}} {{on "click" @isOpen.toggle}} ...attributes>
      {{yield (hash Item=Item Separator=Separator)}}
    </@PopoverContent>
  {{/if}}

*/
{
  "id": "daUGtjBO",
  "block": "[[[1,\"\\n\"],[41,[30,1,[\"current\"]],[[[1,\"    \"],[8,[30,2],[[16,1,[30,3]],[24,\"role\",\"menu\"],[16,\"data-tabster\",[32,0]],[24,\"tabindex\",\"0\"],[17,4],[4,[32,1],null,[[\"isOpen\",\"triggerElement\"],[[30,1],[30,5]]]],[4,[32,2],[\"click\",[30,1,[\"toggle\"]]],null]],null,[[\"default\"],[[[[1,\"\\n      \"],[18,6,[[28,[32,3],null,[[\"Item\",\"Separator\"],[[32,4],[32,5]]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[]],null]],[\"@isOpen\",\"@PopoverContent\",\"@contentId\",\"&attrs\",\"@triggerElement\",\"&default\"],[\"if\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/menu.js",
  "scope": () => [TABSTER_CONFIG_CONTENT, installContent, on, hash, Item, Separator],
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  "id": "N9NK3M/M",
  "block": "[[[1,\"\\n  \"],[11,\"button\"],[24,4,\"button\"],[17,1],[4,[30,2],null,[[\"stopPropagation\",\"preventDefault\"],[[30,3],[30,4]]]],[12],[1,\"\\n    \"],[18,5,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"@triggerModifier\",\"@stopPropagation\",\"@preventDefault\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/menu.js",
  "isStrictMode": true
}), templateOnly(undefined, "menu:Trigger"));
const IsOpen = () => cell(false);
const TriggerElement = () => cell();
class Menu extends GlimmerComponent {
  contentId = guidFor(this);
  static {
    setComponentTemplate(templateFactory(
    /*
      
        {{#let (IsOpen) (TriggerElement) as |isOpen triggerEl|}}
          <Popover @flipOptions={{@flipOptions}} @middleware={{@middleware}} @offsetOptions={{@offsetOptions}} @placement={{@placement}} @shiftOptions={{@shiftOptions}} @strategy={{@strategy}} @inline={{@inline}} as |p|>
            {{#let (modifier trigger triggerElement=triggerEl isOpen=isOpen contentId=this.contentId setReference=p.setReference) as |triggerModifier|}}
              {{yield (hash trigger=triggerModifier Trigger=(component Trigger triggerModifier=triggerModifier) Content=(component Content PopoverContent=p.Content isOpen=isOpen triggerElement=triggerEl contentId=this.contentId) arrow=p.arrow isOpen=isOpen.current)}}
            {{/let}}
          </Popover>
        {{/let}}
      
    */
    {
      "id": "fEYKcNHa",
      "block": "[[[1,\"\\n\"],[44,[[28,[32,0],null,null],[28,[32,1],null,null]],[[[1,\"      \"],[8,[32,2],null,[[\"@flipOptions\",\"@middleware\",\"@offsetOptions\",\"@placement\",\"@shiftOptions\",\"@strategy\",\"@inline\"],[[30,3],[30,4],[30,5],[30,6],[30,7],[30,8],[30,9]]],[[\"default\"],[[[[1,\"\\n\"],[44,[[50,[32,3],2,null,[[\"triggerElement\",\"isOpen\",\"contentId\",\"setReference\"],[[30,2],[30,1],[30,0,[\"contentId\"]],[30,10,[\"setReference\"]]]]]],[[[1,\"          \"],[18,12,[[28,[32,4],null,[[\"trigger\",\"Trigger\",\"Content\",\"arrow\",\"isOpen\"],[[30,11],[50,[32,5],0,null,[[\"triggerModifier\"],[[30,11]]]],[50,[32,6],0,null,[[\"PopoverContent\",\"isOpen\",\"triggerElement\",\"contentId\"],[[30,10,[\"Content\"]],[30,1],[30,2],[30,0,[\"contentId\"]]]]],[30,10,[\"arrow\"]],[30,1,[\"current\"]]]]]]],[1,\"\\n\"]],[11]]],[1,\"      \"]],[10]]]]],[1,\"\\n\"]],[1,2]]],[1,\"  \"]],[\"isOpen\",\"triggerEl\",\"@flipOptions\",\"@middleware\",\"@offsetOptions\",\"@placement\",\"@shiftOptions\",\"@strategy\",\"@inline\",\"p\",\"triggerModifier\",\"&default\"],[\"let\",\"modifier\",\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/menu.js",
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
  "id": "cQ/6g8C3",
  "block": "[[[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[30,1]],null]],null],null,[[[1,\"    \"],[10,\"label\"],[12],[1,\"\\n      \"],[10,1],[14,0,\"ember-primitives__sr-only\"],[12],[1,[28,[32,0],[[30,3],[30,4]],null]],[13],[1,\"\\n      \"],[11,\"input\"],[16,3,[29,[\"code\",[30,3]]]],[24,4,\"text\"],[24,\"inputmode\",\"numeric\"],[24,\"autocomplete\",\"off\"],[17,5],[4,[32,1],[\"click\",[32,2]],null],[4,[32,1],[\"paste\",[32,3]],null],[4,[32,1],[\"input\",[32,4]],null],[4,[32,1],[\"input\",[30,6]],null],[4,[32,1],[\"keydown\",[32,5]],null],[12],[13],[1,\"\\n    \"],[13],[1,\"\\n\"]],[2,3]],null]],[\"@fields\",\"_field\",\"i\",\"@labelFn\",\"&attrs\",\"@handleChange\"],[\"each\",\"-track-array\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/one-time-password/input.js",
  "scope": () => [labelFor, on, selectAll, handlePaste, autoAdvance, handleNavigation],
  "isStrictMode": true
}), templateOnly(undefined, "input:Fields"));
class OTPInput extends GlimmerComponent {
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
      "id": "vyKcjrfK",
      "block": "[[[1,\"\\n    \"],[11,\"fieldset\"],[17,1],[12],[1,\"\\n\"],[44,[[50,[32,0],0,null,[[\"fields\",\"handleChange\",\"labelFn\"],[[30,0,[\"fields\"]],[30,0,[\"handleChange\"]],[30,2]]]]],[[[41,[48,[30,4]],[[[1,\"          \"],[18,4,[[30,3]]],[1,\"\\n\"]],[]],[[[1,\"          \"],[8,[30,3],null,null,null],[1,\"\\n\"]],[]]]],[3]]],[1,\"\\n      \"],[10,\"style\"],[12],[1,\"\\n        .ember-primitives__sr-only {\\n          position: absolute;\\n          width: 1px;\\n          height: 1px;\\n          padding: 0;\\n          margin: -1px;\\n          overflow: hidden;\\n          clip: rect(0, 0, 0, 0);\\n          white-space: nowrap;\\n          border-width: 0;\\n        }\\n      \"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"&attrs\",\"@labelFn\",\"CurriedFields\",\"&default\"],[\"let\",\"component\",\"if\",\"has-block\",\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/one-time-password/input.js",
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
  "id": "Qzwz/o0j",
  "block": "[[[1,\"\\n  \"],[11,\"button\"],[24,4,\"submit\"],[17,1],[12],[1,\"Submit\"],[13],[1,\"\\n\"]],[\"&attrs\"],[]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/one-time-password/buttons.js",
  "isStrictMode": true
}), templateOnly(undefined, "buttons:Submit"));
const Reset = setComponentTemplate(templateFactory(
/*
  
  <button type="button" {{on "click" reset}} ...attributes>{{yield}}</button>

*/
{
  "id": "xNpM/zrl",
  "block": "[[[1,\"\\n  \"],[11,\"button\"],[24,4,\"button\"],[17,1],[4,[32,0],[\"click\",[32,1]],null],[12],[18,2,null],[13],[1,\"\\n\"]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/one-time-password/buttons.js",
  "scope": () => [on, reset],
  "isStrictMode": true
}), templateOnly(undefined, "buttons:Reset"));

const waiter = buildWaiter("ember-primitives:OTP:handleAutoSubmitAttempt");
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
  const token = waiter.beginAsync();
  const finished = () => {
    waiter.endAsync(token);
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
  "id": "cW/mffnB",
  "block": "[[[1,\"\\n  \"],[11,\"form\"],[17,1],[4,[32,0],[\"submit\",[28,[32,1],[[32,2],[30,2]],null]],null],[12],[1,\"\\n    \"],[18,5,[[28,[32,3],null,[[\"Input\",\"Submit\",\"Reset\"],[[50,[32,4],0,null,[[\"length\",\"onChange\"],[[30,3],[52,[30,4],[28,[32,1],[[32,5],[30,4]],null]]]]],[32,6],[32,7]]]]]],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"@onSubmit\",\"@length\",\"@autoSubmit\",\"&default\"],[\"yield\",\"component\",\"if\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/one-time-password/otp.js",
  "scope": () => [on, fn, handleFormSubmit, hash, OTPInput, handleChange, Submit, Reset],
  "isStrictMode": true
}), templateOnly(undefined, "otp:OTP"));

const DEFAULT_MAX = 100;
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
  return isValidProgressNumber(userMax) ? userMax : DEFAULT_MAX;
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
  "id": "8b2DB8pA",
  "block": "[[[1,\"\\n  \"],[11,0],[17,1],[16,\"data-max\",[30,2]],[16,\"data-value\",[30,3]],[16,\"data-state\",[28,[32,0],[[30,3],[30,2]],null]],[16,\"data-percent\",[30,4]],[12],[1,\"\\n    \"],[18,5,null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[\"&attrs\",\"@max\",\"@value\",\"@percent\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/progress.js",
  "scope": () => [progressState],
  "isStrictMode": true
}), templateOnly(undefined, "progress:Indicator"));
class Progress extends GlimmerComponent {
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
      "id": "nYaohqAY",
      "block": "[[[1,\"\\n    \"],[11,0],[17,1],[16,\"aria-valuemax\",[30,0,[\"max\"]]],[24,\"aria-valuemin\",\"0\"],[16,\"aria-valuenow\",[30,0,[\"value\"]]],[16,\"aria-valuetext\",[30,0,[\"valueLabel\"]]],[24,\"role\",\"progressbar\"],[16,\"data-value\",[30,0,[\"value\"]]],[16,\"data-state\",[28,[32,0],[[30,0,[\"value\"]],[30,0,[\"max\"]]],null]],[16,\"data-max\",[30,0,[\"max\"]]],[24,\"data-min\",\"0\"],[16,\"data-percent\",[30,0,[\"percent\"]]],[12],[1,\"\\n\\n      \"],[18,2,[[28,[32,1],null,[[\"Indicator\",\"value\",\"percent\",\"decimal\"],[[50,[32,2],0,null,[[\"value\",\"max\",\"percent\"],[[30,0,[\"value\"]],[30,0,[\"max\"]],[30,0,[\"percent\"]]]]],[30,0,[\"value\"]],[30,0,[\"percent\"]],[30,0,[\"decimal\"]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/progress.js",
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
  "id": "RFJHhVWM",
  "block": "[[[1,\"\\n  \"],[11,\"input\"],[17,1],[16,3,[30,2]],[24,4,\"range\"],[16,\"max\",[30,3]],[16,2,[30,4]],[4,[32,0],[\"change\",[30,5]],null],[12],[13],[1,\"\\n\"]],[\"&attrs\",\"@name\",\"@max\",\"@value\",\"@handleChange\"],[]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/rating/range.js",
  "scope": () => [on],
  "isStrictMode": true
}), templateOnly(undefined, "range:RatingRange"));

function isString(x) {
  return typeof x === 'string';
}
function lte(a, b) {
  return a <= b;
}
function percentSelected(a, b) {
  const diff = b + 1 - a;
  if (diff < 0) return 0;
  if (diff > 1) return 100;
  if (a === b) return 100;
  const percent = diff * 100;
  return percent;
}

const Stars = setComponentTemplate(templateFactory(
/*
  
  <div class="ember-primitives__rating__items">
    {{#each @stars as |star|}}
      {{#let (uniqueId) as |id|}}
        <span class="ember-primitives__rating__item" data-number={{star}} data-percent-selected={{percentSelected star @currentValue}} data-selected={{lte star @currentValue}} data-readonly={{@isReadonly}}>
          <label for="input-{{id}}">
            <span visually-hidden>{{star}} star</span>
            <span aria-hidden="true">
              {{#if (isString @icon)}}
                {{@icon}}
              {{else}}
                <@icon @value={{star}} @isSelected={{lte star @currentValue}} @percentSelected={{percentSelected star @currentValue}} @readonly={{@isReadonly}} />
              {{/if}}
            </span>
          </label>

          <input id="input-{{id}}" type="radio" name={{@name}} value={{star}} readonly={{@isReadonly}} checked={{lte star @currentValue}} />
        </span>
      {{/let}}
    {{/each}}
  </div>

*/
{
  "id": "pIqv+kaw",
  "block": "[[[1,\"\\n  \"],[10,0],[14,0,\"ember-primitives__rating__items\"],[12],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[30,1]],null]],null],null,[[[44,[[28,[32,0],null,null]],[[[1,\"        \"],[10,1],[14,0,\"ember-primitives__rating__item\"],[15,\"data-number\",[30,2]],[15,\"data-percent-selected\",[28,[32,1],[[30,2],[30,4]],null]],[15,\"data-selected\",[28,[32,2],[[30,2],[30,4]],null]],[15,\"data-readonly\",[30,5]],[12],[1,\"\\n          \"],[10,\"label\"],[15,\"for\",[29,[\"input-\",[30,3]]]],[12],[1,\"\\n            \"],[10,1],[14,\"visually-hidden\",\"\"],[12],[1,[30,2]],[1,\" star\"],[13],[1,\"\\n            \"],[10,1],[14,\"aria-hidden\",\"true\"],[12],[1,\"\\n\"],[41,[28,[32,3],[[30,6]],null],[[[1,\"                \"],[1,[30,6]],[1,\"\\n\"]],[]],[[[1,\"                \"],[8,[30,6],null,[[\"@value\",\"@isSelected\",\"@percentSelected\",\"@readonly\"],[[30,2],[28,[32,2],[[30,2],[30,4]],null],[28,[32,1],[[30,2],[30,4]],null],[30,5]]],null],[1,\"\\n\"]],[]]],[1,\"            \"],[13],[1,\"\\n          \"],[13],[1,\"\\n\\n          \"],[10,\"input\"],[15,1,[29,[\"input-\",[30,3]]]],[15,3,[30,7]],[15,2,[30,2]],[15,\"readonly\",[30,5]],[15,\"checked\",[28,[32,2],[[30,2],[30,4]],null]],[14,4,\"radio\"],[12],[13],[1,\"\\n        \"],[13],[1,\"\\n\"]],[3]]]],[2]],null],[1,\"  \"],[13],[1,\"\\n\"]],[\"@stars\",\"star\",\"id\",\"@currentValue\",\"@isReadonly\",\"@icon\",\"@name\"],[\"each\",\"-track-array\",\"let\",\"if\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/rating/stars.js",
  "scope": () => [uniqueId, percentSelected, lte, isString],
  "isStrictMode": true
}), templateOnly(undefined, "stars:Stars"));

class RatingState extends GlimmerComponent {
  static {
    decorateFieldV2(this.prototype, "_value", [localCopy("args.value")]);
  }
  #_value = (initializeDeferredDecorator(this, "_value"), void 0); // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  get value() {
    return this._value ?? 0;
  }
  get stars() {
    return Array.from({
      length: this.args.max ?? 5
    }, (_, index) => index + 1);
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
      
        {{yield (hash stars=this.stars total=this.stars.length handleClick=this.handleClick handleChange=this.handleChange setRating=this.setRating value=this.value) (hash total=this.stars.length value=this.value)}}
      
    */
    {
      "id": "6ZT32VPI",
      "block": "[[[1,\"\\n    \"],[18,1,[[28,[32,0],null,[[\"stars\",\"total\",\"handleClick\",\"handleChange\",\"setRating\",\"value\"],[[30,0,[\"stars\"]],[30,0,[\"stars\",\"length\"]],[30,0,[\"handleClick\"]],[30,0,[\"handleChange\"]],[30,0,[\"setRating\"]],[30,0,[\"value\"]]]]],[28,[32,0],null,[[\"total\",\"value\"],[[30,0,[\"stars\",\"length\"]],[30,0,[\"value\"]]]]]]],[1,\"\\n  \"]],[\"&default\"],[\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/rating/state.js",
      "scope": () => [hash],
      "isStrictMode": true
    }), this);
  }
}

class Rating extends GlimmerComponent {
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
      
        <RatingState @max={{@max}} @value={{@value}} @name={{this.name}} @readonly={{this.isReadonly}} @onChange={{@onChange}} as |r publicState|>
          <fieldset class="ember-primitives__rating" data-total={{r.total}} data-value={{r.value}} data-readonly={{this.isReadonly}} {{!-- We use event delegation, this isn't a primary interactive -- we're capturing events from inputs --}} {{!-- template-lint-disable no-invalid-interactive --}} {{on "click" r.handleClick}} ...attributes>
            {{#let (component Stars stars=r.stars icon=this.icon isReadonly=this.isReadonly name=this.name total=r.total currentValue=r.value) as |RatingStars|}}
    
              {{#if (has-block)}}
                {{yield (hash max=r.total total=r.total value=r.value name=this.name isReadonly=this.isReadonly isChangeable=this.isChangeable Stars=RatingStars Range=(component RatingRange max=r.total value=r.value name=this.name handleChange=r.handleChange))}}
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
      "id": "SlUnZJcf",
      "block": "[[[1,\"\\n    \"],[8,[32,0],null,[[\"@max\",\"@value\",\"@name\",\"@readonly\",\"@onChange\"],[[30,1],[30,2],[30,0,[\"name\"]],[30,0,[\"isReadonly\"]],[30,3]]],[[\"default\"],[[[[1,\"\\n      \"],[11,\"fieldset\"],[24,0,\"ember-primitives__rating\"],[16,\"data-total\",[30,4,[\"total\"]]],[16,\"data-value\",[30,4,[\"value\"]]],[16,\"data-readonly\",[30,0,[\"isReadonly\"]]],[17,6],[4,[32,1],[\"click\",[30,4,[\"handleClick\"]]],null],[12],[1,\"\\n\"],[44,[[50,[32,2],0,null,[[\"stars\",\"icon\",\"isReadonly\",\"name\",\"total\",\"currentValue\"],[[30,4,[\"stars\"]],[30,0,[\"icon\"]],[30,0,[\"isReadonly\"]],[30,0,[\"name\"]],[30,4,[\"total\"]],[30,4,[\"value\"]]]]]],[[[1,\"\\n\"],[41,[48,[30,8]],[[[1,\"            \"],[18,8,[[28,[32,3],null,[[\"max\",\"total\",\"value\",\"name\",\"isReadonly\",\"isChangeable\",\"Stars\",\"Range\"],[[30,4,[\"total\"]],[30,4,[\"total\"]],[30,4,[\"value\"]],[30,0,[\"name\"]],[30,0,[\"isReadonly\"]],[30,0,[\"isChangeable\"]],[30,7],[50,[32,4],0,null,[[\"max\",\"value\",\"name\",\"handleChange\"],[[30,4,[\"total\"]],[30,4,[\"value\"]],[30,0,[\"name\"]],[30,4,[\"handleChange\"]]]]]]]]]],[1,\"\\n\"]],[]],[[[41,[30,0,[\"needsDescription\"]],[[[41,[48,[30,9]],[[[1,\"                \"],[18,9,[[30,5]]],[1,\"\\n\"]],[]],[[[1,\"                \"],[10,1],[14,\"visually-hidden\",\"\"],[14,0,\"ember-primitives__rating__label\"],[12],[1,\"Rated\\n                  \"],[1,[30,4,[\"value\"]]],[1,\"\\n                  out of\\n                  \"],[1,[30,4,[\"total\"]]],[13],[1,\"\\n\"]],[]]]],[]],[[[41,[48,[30,9]],[[[1,\"                \"],[10,\"legend\"],[12],[1,\"\\n                  \"],[18,9,[[30,5]]],[1,\"\\n                \"],[13],[1,\"\\n\"]],[]],null]],[]]],[1,\"\\n            \"],[8,[30,7],null,null,null],[1,\"\\n\"]],[]]]],[7]]],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[4,5]]]]],[1,\"\\n  \"]],[\"@max\",\"@value\",\"@onChange\",\"r\",\"publicState\",\"&attrs\",\"RatingStars\",\"&default\",\"&label\"],[\"let\",\"component\",\"if\",\"has-block\",\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/rating/index.js",
      "scope": () => [RatingState, on, Stars, hash, RatingRange],
      "isStrictMode": true
    }), this);
  }
}

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
  "id": "nhDEHdBf",
  "block": "[[[1,\"\\n\"],[44,[[28,[32,0],[[28,[32,1],[[30,1],[30,2],[30,3]],null]],null]],[[[1,\"    \"],[11,\"button\"],[24,4,\"button\"],[16,\"aria-pressed\",[29,[[30,4,[\"current\"]]]]],[17,5],[4,[32,2],[\"click\",[28,[32,3],[[32,4],[30,4,[\"toggle\"]],[30,6],[30,2]],null]],null],[12],[1,\"\\n      \"],[18,7,[[30,4,[\"current\"]]]],[1,\"\\n    \"],[13],[1,\"\\n\"]],[4]]]],[\"@pressed\",\"@value\",\"@isPressed\",\"pressed\",\"&attrs\",\"@onChange\",\"&default\"],[\"let\",\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/toggle.js",
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
class ToggleGroup extends GlimmerComponent {
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
      "id": "w+7xPjlX",
      "block": "[[[1,\"\\n\"],[41,[28,[32,0],[[30,0,[\"args\",\"type\"]]],null],[[[1,\"      \"],[8,[32,1],[[17,1]],[[\"@value\",\"@onChange\"],[[30,0,[\"args\",\"value\"]],[30,0,[\"args\",\"onChange\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[18,4,[[30,2]]],[1,\"\\n      \"]],[2]]]]],[1,\"\\n\"]],[]],[[[1,\"      \"],[8,[32,2],[[17,1]],[[\"@value\",\"@onChange\"],[[30,0,[\"args\",\"value\"]],[30,0,[\"args\",\"onChange\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[18,4,[[30,3]]],[1,\"\\n      \"]],[3]]]]],[1,\"\\n\"]],[]]],[1,\"  \"]],[\"&attrs\",\"x\",\"x\",\"&default\"],[\"if\",\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/toggle-group.js",
      "scope": () => [isMulti, MultiToggleGroup, SingleToggleGroup],
      "isStrictMode": true
    }), this);
  }
}
class SingleToggleGroup extends GlimmerComponent {
  static {
    decorateFieldV2(this.prototype, "activePressed", [localCopy("args.value")]);
  }
  #activePressed = (initializeDeferredDecorator(this, "activePressed"), void 0); // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      "id": "FNT5ggEb",
      "block": "[[[1,\"\\n    \"],[11,0],[16,\"data-tabster\",[32,0]],[17,1],[12],[1,\"\\n      \"],[18,2,[[28,[32,1],null,[[\"Item\"],[[50,[32,2],0,null,[[\"onChange\",\"isPressed\"],[[30,0,[\"handleToggle\"]],[30,0,[\"isPressed\"]]]]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/toggle-group.js",
      "scope": () => [TABSTER_CONFIG, hash, Toggle],
      "isStrictMode": true
    }), this);
  }
}
class MultiToggleGroup extends GlimmerComponent {
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
      "id": "FNT5ggEb",
      "block": "[[[1,\"\\n    \"],[11,0],[16,\"data-tabster\",[32,0]],[17,1],[12],[1,\"\\n      \"],[18,2,[[28,[32,1],null,[[\"Item\"],[[50,[32,2],0,null,[[\"onChange\",\"isPressed\"],[[30,0,[\"handleToggle\"]],[30,0,[\"isPressed\"]]]]]]]]]],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[\"&attrs\",\"&default\"],[\"yield\",\"component\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/toggle-group.js",
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
  "id": "s0OwhyJX",
  "block": "[[[1,\"\\n  \"],[11,1],[24,0,\"ember-primitives__visually-hidden\"],[17,1],[12],[18,2,null],[13],[1,\"\\n\"]],[\"&attrs\",\"&default\"],[\"yield\"]]",
  "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/visually-hidden.js",
  "isStrictMode": true
}), templateOnly(undefined, "visually-hidden:VisuallyHidden"));

const testWaiter = buildWaiter("ember-primitive:zoetrope-waiter");
const DEFAULT_GAP = 8;
const DEFAULT_OFFSET = 0;
class Zoetrope extends GlimmerComponent {
  static {
    decorateFieldV2(this.prototype, "scrollerElement", [tracked], function () {
      return null;
    });
  }
  #scrollerElement = (initializeDeferredDecorator(this, "scrollerElement"), void 0);
  static {
    decorateFieldV2(this.prototype, "currentlyScrolled", [tracked], function () {
      return 0;
    });
  }
  #currentlyScrolled = (initializeDeferredDecorator(this, "currentlyScrolled"), void 0);
  static {
    decorateFieldV2(this.prototype, "scrollWidth", [tracked], function () {
      return 0;
    });
  }
  #scrollWidth = (initializeDeferredDecorator(this, "scrollWidth"), void 0);
  static {
    decorateFieldV2(this.prototype, "offsetWidth", [tracked], function () {
      return 0;
    });
  }
  #offsetWidth = (initializeDeferredDecorator(this, "offsetWidth"), void 0);
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
      "id": "nSxJHSar",
      "block": "[[[1,\"\\n    \"],[11,\"section\"],[24,0,\"ember-primitives__zoetrope\"],[17,1],[4,[30,0,[\"setCSSVariables\"]],null,[[\"gap\",\"offset\"],[[30,0,[\"gap\"]],[30,0,[\"offset\"]]]]],[12],[1,\"\\n\"],[41,[48,[30,2]],[[[1,\"        \"],[10,0],[14,0,\"ember-primitives__zoetrope__header\"],[12],[1,\"\\n          \"],[18,2,null],[1,\"\\n        \"],[13],[1,\"\\n\"]],[]],null],[1,\"\\n\"],[41,[48,[30,3]],[[[1,\"        \"],[18,3,[[28,[32,0],null,[[\"cannotScrollLeft\",\"cannotScrollRight\",\"canScroll\",\"scrollLeft\",\"scrollRight\"],[[30,0,[\"cannotScrollLeft\"]],[30,0,[\"cannotScrollRight\"]],[30,0,[\"canScroll\"]],[30,0,[\"scrollLeft\"]],[30,0,[\"scrollRight\"]]]]]]],[1,\"\\n\"]],[]],[[[41,[30,0,[\"canScroll\"]],[[[1,\"          \"],[10,0],[14,0,\"ember-primitives__zoetrope__controls\"],[12],[1,\"\\n            \"],[11,\"button\"],[16,\"disabled\",[30,0,[\"cannotScrollLeft\"]]],[24,4,\"button\"],[4,[32,1],[\"click\",[30,0,[\"scrollLeft\"]]],null],[12],[1,\"Left\"],[13],[1,\"\\n\\n            \"],[11,\"button\"],[16,\"disabled\",[30,0,[\"cannotScrollRight\"]]],[24,4,\"button\"],[4,[32,1],[\"click\",[30,0,[\"scrollRight\"]]],null],[12],[1,\"Right\"],[13],[1,\"\\n          \"],[13],[1,\"\\n\"]],[]],null]],[]]],[41,[48,[30,4]],[[[1,\"        \"],[11,0],[24,0,\"ember-primitives__zoetrope__scroller\"],[4,[30,0,[\"configureScroller\"]],null,null],[12],[1,\"\\n          \"],[18,4,null],[1,\"\\n        \"],[13],[1,\"\\n\"]],[]],[[[1,\"        \"],[1,[28,[30,0,[\"noScrollWaiter\"]],null,null]],[1,\"\\n\"]],[]]],[1,\"    \"],[13],[1,\"\\n  \"]],[\"&attrs\",\"&header\",\"&controls\",\"&content\"],[\"if\",\"has-block\",\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/components/zoetrope/index.js",
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

export { Accordion, Avatar, Dialog, ExternalLink, Key, KeyCombo, Link, Menu, Dialog as Modal, OTP, OTPInput, TARGETS as PORTALS, Popover, Portal, PortalTargets, Progress, Rating, StickyFooter, Toggle, ToggleGroup, VisuallyHidden, Zoetrope, link };
