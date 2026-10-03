import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { n as tracked } from "./tracked-DvOpYI0o-BARN4wIl.js";
import { t as Component } from "./dist-DnJA6M4U.js";
import { d as hash } from "./helper-DTHs5pWM.js";
import { n as modifier } from "./dist-RcuypXjO.js";
import { a as hide, i as flip, n as autoUpdate, o as offset, r as computePosition, s as shift } from "./floating-ui.dom-LzRfwFuR.js";
import { r as initializeDeferredDecorator, t as decorateFieldV2 } from "./runtime-CYyqkz5q-DsZnSQsN.js";
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/component-BXy_iafw.js
function exposeMetadata() {
	return {
		name: "metadata",
		fn: (data) => {
			return { data };
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
var anchorTo = modifier((floatingElement, [_referenceElement], { strategy = "fixed", offsetOptions = 0, placement = "bottom", flipOptions, shiftOptions, middleware = [], setData }) => {
	const referenceElement = typeof _referenceElement === "string" ? document.querySelector(_referenceElement) : _referenceElement;
	Object.assign(floatingElement.style, {
		position: strategy,
		top: "0",
		left: "0"
	});
	const update = async () => {
		const { middlewareData, x, y } = await computePosition(referenceElement, floatingElement, {
			middleware: [
				offset(offsetOptions),
				flip(flipOptions),
				shift(shiftOptions),
				...middleware,
				hide({ strategy: "referenceHidden" }),
				hide({ strategy: "escaped" }),
				exposeMetadata()
			],
			placement,
			strategy
		});
		const referenceHidden = middlewareData.hide?.referenceHidden;
		Object.assign(floatingElement.style, {
			top: `${y}px`,
			left: `${x}px`,
			margin: 0,
			visibility: referenceHidden ? "hidden" : "visible"
		});
		setData?.(middlewareData["metadata"]);
	};
	update();
	/**
	* in the function-modifier manager, teardown of the previous modifier
	* occurs before setup of the next
	* https://github.com/ember-modifier/ember-modifier/blob/main/ember-modifier/src/-private/function-based/modifier-manager.ts#L58
	*/
	return autoUpdate(referenceElement, floatingElement, update);
});
var ref = modifier((element, positional) => {
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
var FloatingUI = class extends Component {
	static {
		decorateFieldV2(this.prototype, "reference", [tracked], function() {});
	}
	#reference = (initializeDeferredDecorator(this, "reference"), void 0);
	static {
		decorateFieldV2(this.prototype, "data", [tracked], function() {});
	}
	#data = (initializeDeferredDecorator(this, "data"), void 0);
	setData = (data) => this.data = data;
	setReference = (element) => {
		this.reference = element;
	};
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[44,[[50,[32,0],2,null,[[\"flipOptions\",\"hideOptions\",\"middleware\",\"offsetOptions\",\"placement\",\"shiftOptions\",\"strategy\",\"setData\"],[[30,1],[30,2],[30,3],[30,4],[30,5],[30,6],[30,7],[30,0,[\"setData\"]]]]]],[[[44,[[52,[30,0,[\"reference\"]],[50,[30,8],2,[[30,0,[\"reference\"]]],null]]],[[[1,\"    \"],[18,10,[[50,[32,1],2,[[30,0,[\"setReference\"]]],null],[30,9],[28,[32,2],null,[[\"setReference\",\"data\"],[[30,0,[\"setReference\"]],[30,0,[\"data\"]]]]]]],[1,\"\\n\"]],[9]]]],[8]]]],[\"@flipOptions\",\"@hideOptions\",\"@middleware\",\"@offsetOptions\",\"@placement\",\"@shiftOptions\",\"@strategy\",\"prewiredAnchorTo\",\"floating\",\"&default\"],[\"let\",\"modifier\",\"if\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({
				anchorTo,
				ref,
				hash
			}),
			"isStrictMode": true
		}), this);
	}
};
//#endregion
export { anchorTo as n, FloatingUI as t };
