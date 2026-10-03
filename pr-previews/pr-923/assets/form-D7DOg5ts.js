import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { t as on } from "./on-CkzM3EZT.js";
import { s as fn } from "./helper-DTHs5pWM.js";
import { t as templateOnly } from "./template-only-CiCtiipS.js";
import { t as dataFrom } from "./dist-DHnx960r.js";
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/components/form.js
var dataFromEvent = dataFrom;
var handleInput = (onChange, event, eventType = "input") => {
	onChange(dataFrom(event), eventType, event);
};
var handleSubmit = (onChange, event) => {
	event.preventDefault();
	handleInput(onChange, event, "submit");
};
var Form = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[11,\"form\"],[17,1],[4,[32,0],[\"input\",[28,[32,1],[[32,2],[30,2]],null]],null],[4,[32,0],[\"submit\",[28,[32,1],[[32,3],[30,2]],null]],null],[12],[1,\"\\n  \"],[18,3,null],[1,\"\\n\"],[13]],[\"&attrs\",\"@onChange\",\"&default\"],[\"yield\"]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({
		on,
		fn,
		handleInput,
		handleSubmit
	}),
	"isStrictMode": true
}), templateOnly(void 0, "form:Form"));
//#endregion
export { dataFromEvent as n, Form as t };
