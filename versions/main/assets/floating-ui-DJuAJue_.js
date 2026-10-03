import { av as modifier, aW as autoUpdate, aX as computePosition, aY as offset, aZ as flip, a_ as shift, a$ as hide, a9 as GlimmerComponent, a3 as decorateFieldV2, a4 as initializeDeferredDecorator, s as setComponentTemplate, i as templateFactory, am as hash, aq as tracked } from './main-8-quYJqh.js';

function exposeMetadata() {
  return {
    name: 'metadata',
    fn: data => {
      // https://floating-ui.com/docs/middleware#always-return-an-object
      return {
        data
      };
    }
  };
}

/**
 * A modifier to apply to the _floating_ element.
 * This is what will anchor to the reference element.
 *
 * Example
 * ```gjs
 * import { anchorTo } from 'ember-primitives/floating-ui';
 *
 * <template>
 *   <button id="my-button"> ... </button>
 *   <menu {{anchorTo "#my-button"}}> ... </menu>
 * </template>
 * ```
 */
const anchorTo = modifier((floatingElement, [_referenceElement], {
  strategy = 'fixed',
  offsetOptions = 0,
  placement = 'bottom',
  flipOptions,
  shiftOptions,
  middleware = [],
  setData
}) => {
  const referenceElement = typeof _referenceElement === 'string' ? document.querySelector(_referenceElement) : _referenceElement;
  Object.assign(floatingElement.style, {
    position: strategy,
    top: '0',
    left: '0'
  });
  const update = async () => {
    const {
      middlewareData,
      x,
      y
    } = await computePosition(referenceElement, floatingElement, {
      middleware: [offset(offsetOptions), flip(flipOptions), shift(shiftOptions), ...middleware, hide({
        strategy: 'referenceHidden'
      }), hide({
        strategy: 'escaped'
      }), exposeMetadata()],
      placement,
      strategy
    });
    const referenceHidden = middlewareData.hide?.referenceHidden;
    Object.assign(floatingElement.style, {
      top: `${y}px`,
      left: `${x}px`,
      margin: 0,
      visibility: referenceHidden ? 'hidden' : 'visible'
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void setData?.(middlewareData['metadata']);
  };
  void update();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const cleanup = autoUpdate(referenceElement, floatingElement, update);

  /**
   * in the function-modifier manager, teardown of the previous modifier
   * occurs before setup of the next
   * https://github.com/ember-modifier/ember-modifier/blob/main/ember-modifier/src/-private/function-based/modifier-manager.ts#L58
   */
  return cleanup;
});

const ref = modifier((element, positional) => {
  const fn = positional[0];
  fn(element);
});
/**
 * A component that provides no DOM and yields two modifiers for creating
 * creating floating uis, such as menus, popovers, tooltips, etc.
 * This component currently uses [Floating UI](https://floating-ui.com/)
 * but will be switching to [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) when that lands.
 *
 * Example usage:
 * ```gjs
 * import { FloatingUI } from 'ember-primitives/floating-ui';
 *
 * <template>
 *   <FloatingUI as |reference floating|>
 *     <button {{reference}}> ... </button>
 *     <menu {{floating}}> ... </menu>
 *   </FloatingUI>
 * </template>
 * ```
 */
class FloatingUI extends GlimmerComponent {
  static {
    decorateFieldV2(this.prototype, "reference", [tracked], function () {
      return undefined;
    });
  }
  #reference = (initializeDeferredDecorator(this, "reference"), void 0);
  static {
    decorateFieldV2(this.prototype, "data", [tracked], function () {
      return undefined;
    });
  }
  #data = (initializeDeferredDecorator(this, "data"), void 0);
  setData = data => this.data = data;
  setReference = element => {
    this.reference = element;
  };
  static {
    setComponentTemplate(templateFactory(
    /*
      
        {{#let (modifier anchorTo flipOptions=@flipOptions hideOptions=@hideOptions middleware=@middleware offsetOptions=@offsetOptions placement=@placement shiftOptions=@shiftOptions strategy=@strategy setData=this.setData) as |prewiredAnchorTo|}}
          {{#let (if this.reference (modifier prewiredAnchorTo this.reference)) as |floating|}}
            {{!-- @glint-nocheck -- Excessively deep, possibly infinite --}}
            {{yield (modifier ref this.setReference) floating (hash setReference=this.setReference data=this.data)}}
          {{/let}}
        {{/let}}
      
    */
    {
      "id": "2uGUGfqO",
      "block": "[[[1,\"\\n\"],[44,[[50,[32,0],2,null,[[\"flipOptions\",\"hideOptions\",\"middleware\",\"offsetOptions\",\"placement\",\"shiftOptions\",\"strategy\",\"setData\"],[[30,1],[30,2],[30,3],[30,4],[30,5],[30,6],[30,7],[30,0,[\"setData\"]]]]]],[[[44,[[52,[30,0,[\"reference\"]],[50,[30,8],2,[[30,0,[\"reference\"]]],null]]],[[[1,\"        \"],[18,10,[[50,[32,1],2,[[30,0,[\"setReference\"]]],null],[30,9],[28,[32,2],null,[[\"setReference\",\"data\"],[[30,0,[\"setReference\"]],[30,0,[\"data\"]]]]]]],[1,\"\\n\"]],[9]]]],[8]]],[1,\"  \"]],[\"@flipOptions\",\"@hideOptions\",\"@middleware\",\"@offsetOptions\",\"@placement\",\"@shiftOptions\",\"@strategy\",\"prewiredAnchorTo\",\"floating\",\"&default\"],[\"let\",\"modifier\",\"if\",\"yield\"]]",
      "moduleName": "/home/runner/work/carbon-components-ember/carbon-components-ember/node_modules/.pnpm/ember-primitives@0.32.0_@babel+core@7.27.1_@ember+test-helpers@5.2.2_@babel+core@7.27.1_7990e9342f4fe33db91473de0e3769eb/node_modules/ember-primitives/dist/floating-ui/component.js",
      "scope": () => [anchorTo, ref, hash],
      "isStrictMode": true
    }), this);
  }
}

export { FloatingUI, anchorTo };
