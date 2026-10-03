//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown/utils.js
/**
* @param {string} lang
*/
function isNotMarkdownLike(lang) {
	return lang !== "md" && lang !== "gmd" && lang !== "mdx";
}
/**
* @param {string} meta
*/
function isPreview(meta) {
	if (!meta) return false;
	return meta.includes("preview");
}
/**
* @param {string} meta
*/
function isBelow(meta) {
	if (!meta) return false;
	return meta.includes("below");
}
/**
* @param {Pick<import('../../types').PublicMethods, 'getAllowedFormats' | 'getFlavorsFor' | 'optionsFor'>} api
*/
function buildCodeFenceMetaUtils(api) {
	const allowedFormats = api.getAllowedFormats().filter(isNotMarkdownLike);
	/**
	* @param {string} lang
	* @param {string | undefined} [ flavor ]
	*/
	function needsLive(lang, flavor) {
		if (!allowedFormats.includes(lang)) return false;
		return api.optionsFor(lang, flavor).needsLiveMeta ?? true;
	}
	/**
	* @param {string} meta
	* @param {string} lang
	*/
	function getFlavorFromMeta(meta, lang) {
		const flavors = api.getFlavorsFor(lang);
		return meta?.trim().split(" ").find((metum) => flavors.includes(metum));
	}
	/**
	* @param {string} meta
	* @param {string} lang
	*/
	function isLive(meta, lang) {
		if (!needsLive(lang, getFlavorFromMeta(meta, lang))) return true;
		if (!meta) return false;
		return meta.includes("live");
	}
	return {
		isPreview,
		isBelow,
		isLive,
		needsLive,
		allowedFormats,
		getFlavorFromMeta
	};
}
//#endregion
export { buildCodeFenceMetaUtils as t };
