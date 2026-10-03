import { i as initializeDeferredDecorator, n as decorateFieldV2 } from "./runtime--fcdnjmJ-C97hxBku.js";
import { r as service } from "./service-BNgWMWpo.js";
import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { n as registerDestructor } from "./destroyable-Cwxqj0yK.js";
import { t as Component } from "./dist-DnJA6M4U.js";
import { d as hash } from "./helper-DTHs5pWM.js";
import { t as templateOnly } from "./template-only-CiCtiipS.js";
import { a as getIndexPage, c as selected, i as docsManager, o as isCollection, s as isIndex, t as isActive } from "./is-active-Bz8Kb9Wk-C5QR89Xe.js";
import { i as Scroller, t as TrackedArray } from "./dist-BNT8NjHv.js";
//#region ../node_modules/.pnpm/kolay@5.4.0_patch_hash=c432745d9087109821409f1d491318a457310b63751744494c3e21dae08833c6_4d04eecd5e870db7f330f9aa448cc00e/node_modules/kolay/dist/browser/components.js
var GroupNav = class extends Component {
	get #docs() {
		return docsManager();
	}
	static {
		decorateFieldV2(this.prototype, "router", [service]);
	}
	#router = (initializeDeferredDecorator(this, "router"), void 0);
	get homeName() {
		return this.args.homeName ?? "Home";
	}
	get rootURL() {
		return this.router.rootURL;
	}
	get groups() {
		return this.#docs.availableGroups.map((groupName) => {
			if (groupName === "root") return {
				text: this.homeName,
				value: "/"
			};
			return {
				text: groupName,
				value: groupName
			};
		});
	}
	isActive = (subPath) => {
		if (subPath === "/") return false;
		return this.#docs.selectedGroup === subPath;
	};
	get activeClass() {
		return this.args.activeClass ?? "active";
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[11,\"nav\"],[24,\"aria-label\",\"Groups\"],[17,1],[12],[1,\"\\n  \"],[10,\"ul\"],[12],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[30,0,[\"groups\"]]],null]],null],null,[[[1,\"      \"],[10,\"li\"],[12],[1,\"\\n        \"],[10,3],[15,6,[29,[[30,0,[\"rootURL\"]],[30,2,[\"value\"]]]]],[15,0,[52,[28,[30,0,[\"isActive\"]],[[30,2,[\"value\"]]],null],[30,0,[\"activeClass\"]]]],[12],[1,\"\\n\\n\"],[41,[48,[30,3]],[[[1,\"            \"],[18,3,[[30,2,[\"text\"]]]],[1,\"\\n\"]],[]],[[[1,\"            \"],[1,[30,2,[\"text\"]]],[1,\"\\n\"]],[]]],[1,\"\\n        \"],[13],[1,\"\\n      \"],[13],[1,\"\\n\"]],[2]],null],[1,\"  \"],[13],[1,\"\\n\"],[13]],[\"&attrs\",\"group\",\"&default\"],[\"each\",\"-track-array\",\"if\",\"has-block\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"isStrictMode": true
		}), this);
	}
};
var original = {
	log: console.log,
	warn: console.warn,
	error: console.error,
	debug: console.debug,
	info: console.info
};
var LEVELS = Object.keys(original);
var formatter = new Intl.DateTimeFormat("en-GB", {
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
	fractionalSecondDigits: 2
});
var format = (date) => formatter.format(date);
var LogList = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[8,[32,0],[[24,0,\"kolay__log-list__scroll\"]],null,[[\"default\"],[[[[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[30,2]],null]],null],null,[[[1,\"    \"],[10,0],[15,0,[29,[\"kolay__log-list__level \",[30,3,[\"level\"]]]]],[12],[1,\"\\n      \"],[10,1],[14,0,\"kolay__log-list__time\"],[12],[1,[28,[32,1],[[30,3,[\"timestamp\"]]],null]],[13],[1,\"\\n      \"],[10,1],[12],[1,[30,3,[\"message\"]]],[13],[1,\"\\n    \"],[13],[1,\"\\n    \"],[1,[28,[30,1,[\"scrollToBottom\"]],null,null]],[1,\"\\n\"]],[3]],null]],[1]]]]],[1,\"\\n\\n\"],[10,\"style\"],[12],[1,\"\\n  .kolay__log-list__scroll {\\n    position: relative;\\n    overflow: auto;\\n    max-height: 10rem;\\n    filter: invert(1);\\n    .kolay__log-list__level {\\n      display: flex;\\n      gap: 0.5rem;\\n    }\\n    .kolay__log-list__time {\\n      border-right: 1px solid;\\n      padding-right: 0.5rem;\\n    }\\n  }\\n\"],[13],[1,\"\\n\"]],[\"x\",\"@logs\",\"logEntry\"],[\"each\",\"-track-array\"]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({
		Scroller,
		format
	}),
	"isStrictMode": true
}), templateOnly(void 0, "components:LogList"));
var Logs = class extends Component {
	logs = new TrackedArray();
	constructor(...args) {
		super(...args);
		registerDestructor(this, () => LEVELS.forEach((level) => console[level] = original[level]));
		for (const level of LEVELS) console[level] = (...messageParts) => {
			original[level](...messageParts);
			(async () => {
				await Promise.resolve();
				this.logs.push({
					level,
					message: messageParts.join(" "),
					timestamp: /* @__PURE__ */ new Date()
				});
			})();
		};
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[10,0],[14,0,\"kolay__in-viewport__logs\"],[12],[1,\"\\n  \"],[8,[32,0],null,[[\"@logs\"],[[30,0,[\"logs\"]]]],null],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"style\"],[12],[1,\"\\n  .kolay__in-viewport__logs {\\n    position: fixed;\\n    bottom: 0;\\n    left: 0;\\n    right: 0;\\n    padding: 0.5rem;\\n    border: 1px solid gray;\\n    background: currentColor;\\n    filter: invert(1);\\n  }\\n\"],[13],[1,\"\\n\"]],[],[]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({ LogList }),
			"isStrictMode": true
		}), this);
	}
};
var Page = class extends Component {
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[41,[30,0,[\"selected\",\"hasError\"]],[[[1,\"  \"],[18,1,[[30,0,[\"selected\",\"error\"]]]],[1,\"\\n\"]],[]],null],[1,\"\\n\"],[41,[30,0,[\"selected\",\"isPending\"]],[[[1,\"  \"],[18,2,null],[1,\"\\n\"]],[]],null],[1,\"\\n\"],[41,[30,0,[\"selected\",\"prose\"]],[[[1,\"  \"],[18,3,[[30,0,[\"selected\",\"prose\"]]]],[1,\"\\n\"]],[]],null]],[\"&error\",\"&pending\",\"&success\"],[\"if\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"isStrictMode": true
		}), this);
	}
	get selected() {
		return selected();
	}
};
var PageNav = class extends Component {
	get docs() {
		return docsManager();
	}
	/**
	* Ember doesn't yet have a way to forward blocks,
	* so we have  to do this weird manualy forwarding ourselves
	*
	* This is extra annoying since Pages is a recursive component.
	*/
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[11,\"nav\"],[24,\"aria-label\",\"Selected Group\"],[17,1],[12],[1,\"\\n  \"],[8,[32,0],null,[[\"@item\"],[[30,0,[\"docs\",\"tree\"]]]],[[\"page\",\"collection\"],[[[[1,\"\\n\"],[41,[48,[30,4]],[[[1,\"        \"],[18,4,[[30,2]]],[1,\"\\n\"]],[]],[[[1,\"        \"],[8,[30,2,[\"Link\"]],null,null,[[\"default\"],[[[[1,\"\\n          \"],[1,[30,2,[\"page\",\"name\"]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n\"]],[]]],[1,\"    \"]],[2]],[[[1,\"\\n\"],[41,[48,[30,5]],[[[1,\"        \"],[18,5,[[30,3]]],[1,\"\\n\"]],[]],[[[41,[30,3,[\"index\"]],[[[1,\"          \"],[8,[30,3,[\"index\",\"Link\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[1,[30,3,[\"index\",\"page\",\"name\"]]],[1,\"\\n          \"]],[]]]]],[1,\"\\n\"]],[]],[[[1,\"          \"],[1,[30,3,[\"collection\",\"name\"]]],[1,\"\\n\"]],[]]]],[]]],[1,\"    \"]],[3]]]]],[1,\"\\n\"],[13]],[\"&attrs\",\"p\",\"c\",\"&page\",\"&collection\"],[\"if\",\"has-block\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"scope": () => ({ Pages }),
			"isStrictMode": true
		}), this);
	}
};
var not = (x) => !x;
var Pages = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[41,[28,[32,0],[[30,1]],null],[[[1,\"  \"],[10,\"ul\"],[12],[1,\"\\n\"],[42,[28,[31,2],[[28,[31,2],[[30,1,[\"pages\"]]],null]],null],null,[[[41,[28,[32,1],[[28,[32,2],[[30,2]],null]],null],[[[1,\"        \"],[10,\"li\"],[12],[1,\"\\n\"],[41,[28,[32,0],[[30,2]],null],[[[1,\"\\n\"],[44,[[28,[32,3],[[30,2]],null]],[[[41,[30,3],[[[1,\"                \"],[18,7,[[28,[32,4],null,[[\"collection\",\"index\"],[[30,2],[28,[32,4],null,[[\"page\",\"Link\"],[[30,3],[50,[32,5],0,null,[[\"item\",\"activeClass\"],[[30,3],[30,4]]]]]]]]]]]],[1,\"\\n\"]],[]],[[[1,\"                \"],[18,7,[[28,[32,4],null,[[\"collection\"],[[30,2]]]]]],[1,\"\\n\"]],[]]]],[3]]]],[]],null],[1,\"\\n          \"],[8,[32,6],null,[[\"@item\"],[[30,2]]],[[\"page\",\"collection\"],[[[[18,8,[[30,5]]]],[5]],[[[18,7,[[30,6]]]],[6]]]]],[1,\"\\n        \"],[13],[1,\"\\n\"]],[]],null]],[2]],null],[1,\"  \"],[13],[1,\"\\n\"]],[]],[[[1,\"  \"],[18,8,[[28,[32,4],null,[[\"page\",\"Link\"],[[30,1],[50,[32,5],0,null,[[\"item\",\"activeClass\"],[[30,1],[30,4]]]]]]]]],[1,\"\\n\"]],[]]]],[\"@item\",\"page\",\"indexPage\",\"@activeClass\",\"p\",\"c\",\"&collection\",\"&page\"],[\"if\",\"each\",\"-track-array\",\"let\",\"yield\",\"component\"]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({
		isCollection,
		not,
		isIndex,
		getIndexPage,
		hash,
		PageLink,
		Pages
	}),
	"isStrictMode": true
}), templateOnly(void 0, "components:Pages"));
var PageLink = class extends Component {
	static {
		decorateFieldV2(this.prototype, "router", [service]);
	}
	#router = (initializeDeferredDecorator(this, "router"), void 0);
	get activeClass() {
		return this.args.activeClass ?? "active";
	}
	get isActive() {
		return isActive(this.args.item, this.router.currentURL);
	}
	static {
		setComponentTemplate(templateFactory({
			"id": null,
			"block": "[[[11,3],[16,6,[30,1,[\"path\"]]],[16,0,[52,[30,0,[\"isActive\"]],[30,0,[\"activeClass\"]]]],[17,2],[12],[18,3,[[30,1],[30,0,[\"isActive\"]]]],[13]],[\"@item\",\"&attrs\",\"&default\"],[\"if\",\"yield\"]]",
			"moduleName": "(unknown template module)",
			"isStrictMode": true
		}), this);
	}
};
//#endregion
export { PageNav as i, Logs as n, Page as r, GroupNav as t };
