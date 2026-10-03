import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { t as Component } from "./dist-DnJA6M4U.js";
import { t as templateOnly } from "./template-only-CiCtiipS.js";
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/components/shadowed.js
var getStyles = () => [...document.querySelectorAll("link")].map((link) => link.href);
/**
* style + native @import
* is the only robust way to load styles in a shadowroot.
*
* link is only valid in the head element.
*/
var Styles = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[10,\"style\"],[12],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[28,[32,0],null,null]],null]],null],null,[[[1,\"\\n    @import \\\"\"],[1,[30,1]],[1,\"\\\";\\n\\n\"]],[1]],null],[13]],[\"styleHref\"],[\"each\",\"-track-array\"]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({ getStyles }),
	"isStrictMode": true
}), templateOnly(void 0, "shadowed:Styles"));
/**
* Render content in a shadow dom, attached to a div.
*
* Uses the [shadow DOM][mdn-shadow-dom] API.
*
* [mdn-shadow-dom]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
*
* This is useful when you want to render content that escapes your app's styles.
*/
var Shadowed = class extends Component {
	shadow;
	host;
	/**
	* ember-source 5.6 broke the ability to in-element
	* natively into a shadowroot.
	*
	* We have two or three more dives than we should have here.
	*
	*
	* See these ember-source bugs:
	* - https://github.com/emberjs/ember.js/issues/20643
	* - https://github.com/emberjs/ember.js/issues/20642
	* - https://github.com/emberjs/ember.js/issues/20641
	*
	* Ideally, shadowdom should be built in.
	* Couple paths forward:
	*  - (as the overall template tag)
	*     <template shadowrootmode="open">
	*     </template>
	*
	*  - Build a component into the framework that does the above ^
	*  - add additional parsing in content-tag to allow
	*    nested <template>
	*
	*/
	constructor(owner, args) {
		super(owner, args);
		const element = document.createElement("div");
		const shadowRoot = element.attachShadow({ mode: "open" });
		const div = document.createElement("div");
		shadowRoot.appendChild(div);
		this.host = element;
		this.shadow = div;
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[11,0],[17,1],[12],[1,[30,0,[\"host\"]]],[13],[1,\"\\n\\n\"],[40,[[[1,\"\\n\"],[41,[30,2],[[[1,\"    \"],[8,[32,0],null,null,null],[1,\"\\n\"]],[]],null],[1,\"\\n  \"],[18,3,null],[1,\"\\n\\n\"]],[]],\"%cursor:0%\",[28,[31,1],[[30,0,[\"shadow\"]]],null]]],[\"&attrs\",\"@includeStyles\",\"&default\"],[\"in-element\",\"-in-el-null\",\"if\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({ Styles }),
			"isStrictMode": true
		}), this);
	}
};
//#endregion
export { Shadowed as t };
