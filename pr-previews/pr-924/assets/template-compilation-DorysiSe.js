//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/template-compilation/index.js
var __emberTemplateCompiler;
var compileTemplate = (...args) => {
	if (!__emberTemplateCompiler) throw new Error("Attempted to call `compileTemplate` without first loading the runtime template compiler.");
	return __emberTemplateCompiler.compile(...args);
};
var precompileTemplate;
function __registerTemplateCompiler(c) {
	__emberTemplateCompiler = c;
}
//#endregion
export { __emberTemplateCompiler, __registerTemplateCompiler, compileTemplate, precompileTemplate };
