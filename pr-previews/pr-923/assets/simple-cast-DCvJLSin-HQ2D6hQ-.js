//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/simple-cast-DCvJLSin.js
function castToSimple(node) {
	if (isDocument(node)) return node;
	else if (isSimpleElement(node)) return node;
	else return node;
}
function castToBrowser(node, sugaryCheck) {
	return node;
}
var ELEMENT_NODE = 1;
var DOCUMENT_NODE = 9;
function isDocument(node) {
	return node.nodeType === DOCUMENT_NODE;
}
function isSimpleElement(node) {
	return node?.nodeType === ELEMENT_NODE;
}
//#endregion
export { castToSimple as n, castToBrowser as t };
