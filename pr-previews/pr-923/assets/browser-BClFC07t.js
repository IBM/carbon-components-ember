import { t as getOwner } from "./owner-DvxyMhs3.js";
import "./modifier-B5bTsLNB-D75_lBIS.js";
import { i as docsManager } from "./is-active-Bz8Kb9Wk-C5QR89Xe.js";
//#region ../node_modules/.pnpm/kolay@5.4.0_patch_hash=c432745d9087109821409f1d491318a457310b63751744494c3e21dae08833c6_4d04eecd5e870db7f330f9aa448cc00e/node_modules/kolay/dist/browser/index.js
function addRoutes(context) {
	/**
	* We need a level of nesting for every `/` in the URL so that we don't over-refresh / render the whole page
	*/
	context.route("page", { path: "/*page" }, function() {});
}
/**
* Does our target destination exist? if not,
* redirect to the first page on the namespace
*
* For use with addRoutes(), which defines a "page" path matcher
*/
function handlePotentialIndexVisit(context, transition) {
	const docs = docsManager();
	if (transition.to?.localName !== "index") return;
	const groupName = String(transition.to.parent?.params?.page);
	if (!groupName) return;
	if (!docs.availableGroups.includes(groupName)) return;
	const first = docs.groupFor(groupName).list[0];
	if (!first) {
		console.warn(`Could not determine first page in group: ${groupName}`);
		return;
	}
	(getOwner(context)?.lookup("service:router")).transitionTo(first.appRelativePath);
}
//#endregion
export { handlePotentialIndexVisit as n, addRoutes as t };
