import { i as initializeDeferredDecorator, n as decorateFieldV2, r as decorateMethodV2 } from "./runtime--fcdnjmJ-C97hxBku.js";
import { S as guidFor } from "./core-D-L0f59Y.js";
import { n as action } from "./object-X4rDdm09.js";
import { r as service } from "./service-BNgWMWpo.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { r as htmlSafe } from "./index-D-xTBV4B-DG7EnZE6.js";
import { t as on } from "./on-CkzM3EZT.js";
import { n as tracked } from "./tracked-DvOpYI0o-BARN4wIl.js";
import { t as Component } from "./dist-DnJA6M4U.js";
import { n as helper } from "./helper-D1xNZ1iZ.js";
import { n as helper$1, t as htmlSafe$1 } from "./html-safe-CoH5G2UU.js";
import { n as array } from "./helper-DTHs5pWM.js";
//#region ../carbon-components-ember/dist/utils/decorators.js
function defaultArgs(target, name, descriptor) {
	if (!descriptor) {
		const defaultArgs = name;
		const args = target.args;
		return new Proxy({}, { get(target, p) {
			if (p in args) return args[p];
			return defaultArgs[p];
		} });
	}
	const init = descriptor.initializer;
	descriptor.initializer = function() {
		const defaultArgs = init(this);
		const origArgs = this.args;
		return new Proxy({}, { get(target, p) {
			if (p in origArgs) return origArgs[p];
			return defaultArgs[p];
		} });
	};
	return descriptor;
}
//#endregion
//#region ../carbon-components-ember/dist/components/loading.js
var LoadingComponent = class extends Component {
	args = defaultArgs(this, {
		active: true,
		small: false,
		withOverlay: true,
		description: "loading",
		inline: false,
		classNames: "",
		iconDescription: "loading"
	});
	get defaultArgs() {
		return this.args;
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[41,[30,0,[\"defaultArgs\",\"inline\"]],[[[41,[30,0,[\"defaultArgs\",\"active\"]],[[[1,\"    \"],[11,0],[16,0,[29,[\"cds--inline-loading \",[30,0,[\"defaultArgs\",\"classNames\"]]]]],[24,\"aria-live\",\"assertive\"],[17,1],[12],[1,\"\\n      \"],[10,0],[14,0,\"cds--inline-loading__animation\"],[12],[1,\"\\n        \"],[10,0],[14,\"aria-atomic\",\"true\"],[14,\"aria-live\",\"assertive\"],[14,0,\"cds--loading cds--loading--small\"],[12],[1,\"\\n          \"],[10,\"svg\"],[14,0,\"cds--loading__svg\"],[14,\"viewBox\",\"0 0 100 100\"],[14,\"role\",\"img\"],[15,\"aria-label\",[30,0,[\"defaultArgs\",\"iconDescription\"]]],[12],[1,\"\\n            \"],[10,\"title\"],[12],[1,[30,0,[\"defaultArgs\",\"iconDescription\"]]],[13],[1,\"\\n            \"],[10,\"circle\"],[14,0,\"cds--loading__background\"],[14,\"cx\",\"50%\"],[14,\"cy\",\"50%\"],[14,\"r\",\"42\"],[12],[13],[1,\"\\n            \"],[10,\"circle\"],[14,0,\"cds--loading__stroke\"],[14,\"cx\",\"50%\"],[14,\"cy\",\"50%\"],[14,\"r\",\"42\"],[12],[13],[1,\"\\n          \"],[13],[1,\"\\n        \"],[13],[1,\"\\n      \"],[13],[1,\"\\n      \"],[10,0],[14,0,\"cds--inline-loading__text\"],[12],[1,\"\\n        \"],[1,[30,2]],[1,\"\\n      \"],[13],[1,\"\\n    \"],[13],[1,\"\\n\"]],[]],null]],[]],[[[41,[30,0,[\"defaultArgs\",\"withOverlay\"]],[[[1,\"  \"],[10,0],[15,0,[29,[\"cds--loading-overlay\\n      \",[52,[51,[30,0,[\"defaultArgs\",\"active\"]]],\"cds--loading-overlay--stop\"]]]],[12],[1,\"\\n    \"],[11,0],[24,\"aria-atomic\",\"true\"],[16,\"aria-live\",[52,[30,0,[\"defaultArgs\",\"active\"]],\"assertive\",\"off\"]],[16,0,[29,[\"cds--loading\\n        \",[52,[30,0,[\"defaultArgs\",\"small\"]],\"cds--loading--small\"],\"\\n        \",[52,[51,[30,0,[\"defaultArgs\",\"active\"]]],\"cds--loading--stop\"],\"\\n        \",[30,0,[\"defaultArgs\",\"classNames\"]]]]],[17,1],[12],[1,\"\\n      \"],[10,\"svg\"],[14,0,\"cds--loading__svg\"],[14,\"viewBox\",\"0 0 100 100\"],[14,\"role\",\"img\"],[15,\"aria-label\",[30,0,[\"defaultArgs\",\"description\"]]],[12],[1,\"\\n        \"],[10,\"title\"],[12],[1,[30,0,[\"defaultArgs\",\"description\"]]],[13],[1,\"\\n\"],[41,[30,0,[\"defaultArgs\",\"small\"]],[[[1,\"          \"],[10,\"circle\"],[14,0,\"cds--loading__background\"],[14,\"cx\",\"50%\"],[14,\"cy\",\"50%\"],[14,\"r\",\"42\"],[12],[13],[1,\"\\n\"]],[]],null],[1,\"        \"],[10,\"circle\"],[14,0,\"cds--loading__stroke\"],[14,\"cx\",\"50%\"],[14,\"cy\",\"50%\"],[15,\"r\",[52,[30,0,[\"defaultArgs\",\"small\"]],\"42\",\"44\"]],[12],[13],[1,\"\\n      \"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"],[13],[1,\"\\n\"]],[]],[[[1,\"  \"],[11,0],[24,\"aria-atomic\",\"true\"],[16,\"aria-live\",[52,[30,0,[\"defaultArgs\",\"active\"]],\"assertive\",\"off\"]],[16,0,[29,[\"cds--loading\\n      \",[52,[30,0,[\"defaultArgs\",\"small\"]],\"cds--loading--small\"],\"\\n      \",[52,[51,[30,0,[\"defaultArgs\",\"active\"]]],\"cds--loading--stop\"],\"\\n      \",[30,0,[\"defaultArgs\",\"classNames\"]]]]],[17,1],[12],[1,\"\\n    \"],[10,\"svg\"],[14,0,\"cds--loading__svg\"],[14,\"viewBox\",\"0 0 100 100\"],[14,\"role\",\"img\"],[15,\"aria-label\",[30,0,[\"defaultArgs\",\"description\"]]],[12],[1,\"\\n      \"],[10,\"title\"],[12],[1,[30,0,[\"defaultArgs\",\"description\"]]],[13],[1,\"\\n\"],[41,[30,0,[\"defaultArgs\",\"small\"]],[[[1,\"        \"],[10,\"circle\"],[14,0,\"cds--loading__background\"],[14,\"cx\",\"50%\"],[14,\"cy\",\"50%\"],[14,\"r\",\"42\"],[12],[13],[1,\"\\n\"]],[]],null],[1,\"      \"],[10,\"circle\"],[14,0,\"cds--loading__stroke\"],[14,\"cx\",\"50%\"],[14,\"cy\",\"50%\"],[15,\"r\",[52,[30,0,[\"defaultArgs\",\"small\"]],\"42\",\"44\"]],[12],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"],[13],[1,\"\\n\"]],[]]]],[]]]],[\"&attrs\",\"@description\"],[\"if\",\"unless\"]]",
			"moduleName": "(unknown template module)",
			"isStrictMode": true
		}), this);
	}
};
//#endregion
//#region ../carbon-components-ember/dist/components/icon/render-svg-part.js
var cache = /* @__PURE__ */ new Map();
function renderSvgPartFunc([svg], { class: classes, fill, size }) {
	if (!svg) return htmlSafe("");
	if (typeof svg !== "object") return svg;
	const base = `<svg focusable="false"
             preserveAspectRatio="xMidYMid meet"
             xmlns="http://www.w3.org/2000/svg"
             fill="${fill}"
             width="${size || svg.attrs.width}"
             height="${size || svg.attrs.height}"
             viewBox="${svg.attrs.viewBox}"
             aria-hidden="true"
             class="${classes.join(" ")}">`;
	let rest = "";
	if (cache.has(guidFor(svg) + size)) rest = cache.get(guidFor(svg) + size);
	else {
		rest = svg.content.map((svgPart) => {
			const attrs = Object.keys(svgPart.attrs).map((a) => `${a}="${svgPart.attrs[a]}"`).join(" ");
			return `<${svgPart.elem} ${attrs} />`;
		}).join("");
		cache.set(guidFor(svg) + size, rest);
	}
	const html = (base + rest + "</svg>").trim();
	return htmlSafe(html);
}
var renderSvgPart = helper(renderSvgPartFunc);
var iconIcon_module_default = {
	icon: "_icon_13t4y_1",
	"cds--icon--disabled": "_cds--icon--disabled_13t4y_5",
	"cds--icon--info": "_cds--icon--info_13t4y_9",
	"cds--icon--danger": "_cds--icon--danger_13t4y_15",
	loader: "_loader_13t4y_21",
	"cds--loading": "_cds--loading_13t4y_26"
};
//#endregion
//#region ../carbon-components-ember/dist/components/icon.js
var IconMap = {};
function registerIcon(name, icon) {
	IconMap[name] = icon;
}
var CarbonIcon = class extends Component {
	static positionalParams = ["icon"];
	static {
		decorateFieldV2(this.prototype, "dialogManager", [service("carbon.dialog-manager")]);
	}
	#dialogManager = (initializeDeferredDecorator(this, "dialogManager"), void 0);
	static {
		decorateFieldV2(this.prototype, "loading", [tracked], function() {
			return false;
		});
	}
	#loading = (initializeDeferredDecorator(this, "loading"), void 0);
	static {
		decorateFieldV2(this.prototype, "disabled", [tracked], function() {
			return false;
		});
	}
	#disabled = (initializeDeferredDecorator(this, "disabled"), void 0);
	get classes() {
		const classes = [];
		if (this.args.info) classes.push("cds--icon--info");
		if (this.args.danger) classes.push("cds--icon--danger");
		if (this.disabled) classes.push("cds--icon--disabled");
		return classes.join(" ");
	}
	get svg() {
		if (typeof this.args.icon === "string") return IconMap[this.args.icon];
		return this.args.icon;
	}
	onIconClick() {
		const run = () => {
			const promise = this.args.onClick && this.args.onClick();
			this.loading = true;
			this.disabled = true;
			if (promise && promise.then) {
				const finish = () => {
					this.loading = false;
					this.disabled = false;
				};
				promise.then(finish, finish);
			} else setTimeout(() => {
				if (this.isDestroyed) return;
				this.loading = false;
				this.disabled = false;
			}, 350);
		};
		if (this.args.danger) this.dialogManager.open(this.args.confirmDialog || "carbon-components-ember/components/dialogs/confirm.gts", {
			type: "danger",
			header: "Danger",
			body: this.args.confirmText || "Confirm this operation",
			onAccept: run
		});
		else run();
	}
	static {
		decorateMethodV2(this.prototype, "onIconClick", [action]);
	}
	styles = iconIcon_module_default;
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[41,[28,[32,0],[[30,1],[30,0,[\"loading\"]]],null],[[[1,\"  \"],[10,1],[14,5,\"display: inline-block;\"],[12],[1,\"\\n    \"],[8,[32,1],null,[[\"@classNames\",\"@small\",\"@inline\"],[[29,[[30,0,[\"styles\",\"icon\"]],\" \",[30,0,[\"classes\"]],\" loader\"]],true,true]],null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[]],[[[41,[30,2],[[[1,\"    \"],[11,\"button\"],[16,0,[29,[\"cds--btn cds--btn--sm cds--btn--ghost \",[30,3]]]],[16,5,[52,[30,4],[28,[32,2],[[30,4]],null]]],[24,4,\"button\"],[4,[32,3],[\"click\",[30,0,[\"onIconClick\"]]],null],[12],[1,\"\\n      \"],[1,[28,[32,4],[[30,0,[\"svg\"]]],[[\"class\",\"fill\",\"size\"],[[28,[32,5],[[28,[32,0],[[30,5],[30,0,[\"styles\",\"icon\"]]],null],[30,0,[\"classes\"]]],null],[28,[32,0],[[30,6],\"currentColor\"],null],[30,7]]]]],[1,\"\\n    \"],[13],[1,\"\\n\"]],[]],[[[1,\"    \"],[1,[28,[32,4],[[30,0,[\"svg\"]]],[[\"class\",\"fill\",\"size\"],[[28,[32,5],[[28,[32,0],[[30,5],[30,0,[\"styles\",\"icon\"]]],null],[30,0,[\"classes\"]]],null],[28,[32,0],[[30,6],\"currentColor\"],null],[30,7]]]]],[1,\"\\n\"]],[]]]],[]]]],[\"@loading\",\"@onClick\",\"@btnClass\",\"@btnStyle\",\"@svgClass\",\"@fill\",\"@size\"],[\"if\"]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({
				helper: helper$1,
				LoadingComponent,
				htmlSafe: htmlSafe$1,
				on,
				renderSvgPart,
				array
			}),
			"isStrictMode": true
		}), this);
	}
};
//#endregion
export { defaultArgs as i, registerIcon as n, LoadingComponent as r, CarbonIcon as t };
