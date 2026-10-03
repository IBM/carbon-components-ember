const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dist-5pBHpTTt.js","assets/dist-hV_7N_fa.js","assets/dist-CI_ns6W5.js","assets/w3c-keyname-DnKnFkWh.js","assets/dist-Y6qztM3-.js","assets/dist-DxdNDvBQ.js","assets/dist-BH_PiiMj.js","assets/dist-64d5f6xD.js","assets/dist-4SiNbISa.js","assets/dist-nUxiaYGK.js","assets/dist-D7CMNeiO.js","assets/dist-BUdaYsOe.js","assets/dist-C7tNeUlX.js","assets/dist-JfpQSojm.js","assets/dist-DJ-PmwKQ.js","assets/dist-CTgoxbQK.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./preload-helper-59eyuSrX.js";
import { C as indentNodeProp, D as languageDataProp, a as LanguageDescription, i as Language, p as defineLanguageFacet, y as foldNodeProp } from "./dist-CI_ns6W5.js";
import { t as languages } from "./dist-DdVK9HtZ.js";
import { a as markdown, d as Subscript, f as Superscript, l as Emoji, m as parser, p as Table, u as GFM } from "./dist-BrSDMwWK.js";
//#region ../node_modules/.pnpm/codemirror-lang-glimdown@2.0.4_@codemirror+autocomplete@6.20.3_@codemirror+lang-css@6.3_fd96656a7cc0010de16bdffe36ac46ea/node_modules/codemirror-lang-glimdown/dist/index.js
var data = defineLanguageFacet({ block: [{
	open: "{{!",
	close: "}}"
}, {
	open: "{{!--",
	close: "--}}"
}] });
var commonmark = parser.configure({ props: [
	foldNodeProp.add((type) => {
		if (!type.is("Block") || type.is("Document")) return void 0;
		return (tree, state) => ({
			from: state.doc.lineAt(tree.from).to,
			to: tree.to
		});
	}),
	indentNodeProp.add({ Document: () => null }),
	languageDataProp.add({ Document: data })
] });
function markdownLang(parser) {
	return new Language(data, parser);
}
var extendedMarkdown = commonmark.configure([
	GFM,
	Subscript,
	Superscript,
	Emoji,
	Table
]);
var codeLanguages = [
	...languages,
	LanguageDescription.of({
		name: "glimmer",
		alias: [
			"hbs",
			"glimmer",
			"ember",
			"handlebars"
		],
		extensions: ["hbs"],
		async load() {
			const { glimmer } = await __vitePreload(async () => {
				const { glimmer } = await import("./dist-5pBHpTTt.js");
				return { glimmer };
			}, __vite__mapDeps([0,1,2,3,4,5,6,7,8]));
			return glimmer();
		}
	}),
	LanguageDescription.of({
		name: "glimmer-js",
		alias: [
			"gjs",
			"glimmer-js",
			"javascript.glimmer"
		],
		extensions: ["gjs"],
		async load() {
			const { gjs } = await __vitePreload(async () => {
				const { gjs } = await import("./dist-nUxiaYGK.js");
				return { gjs };
			}, __vite__mapDeps([9,2,3,4,7,8,1,5,6]));
			return gjs();
		}
	}),
	LanguageDescription.of({
		name: "glimmer-ts",
		alias: [
			"gts",
			"glimmer-ts",
			"typescript.glimmer"
		],
		extensions: ["gts"],
		async load() {
			const { gts } = await __vitePreload(async () => {
				const { gts } = await import("./dist-nUxiaYGK.js");
				return { gts };
			}, __vite__mapDeps([9,2,3,4,7,8,1,5,6]));
			return gts();
		}
	}),
	LanguageDescription.of({
		name: "vue",
		extensions: ["vue"],
		async load() {
			const { vue } = await __vitePreload(async () => {
				const { vue } = await import("./dist-D7CMNeiO.js");
				return { vue };
			}, __vite__mapDeps([10,2,3,4,5,6,7,8]));
			return vue();
		}
	}),
	LanguageDescription.of({
		name: "svelte",
		extensions: ["svelte"],
		async load() {
			const { svelte } = await __vitePreload(async () => {
				const { svelte } = await import("./dist-BUdaYsOe.js");
				return { svelte };
			}, __vite__mapDeps([11,2,3,4,5,6,7,8]));
			return svelte();
		}
	}),
	LanguageDescription.of({
		name: "javascript",
		extensions: ["javascript"],
		async load() {
			const { javascript } = await __vitePreload(async () => {
				const { javascript } = await import("./dist-C7tNeUlX.js");
				return { javascript };
			}, __vite__mapDeps([12,7,2,3,8,4]));
			return javascript();
		}
	}),
	LanguageDescription.of({
		name: "javascript-jsx",
		extensions: ["jsx", "react"],
		async load() {
			const { javascript } = await __vitePreload(async () => {
				const { javascript } = await import("./dist-C7tNeUlX.js");
				return { javascript };
			}, __vite__mapDeps([12,7,2,3,8,4]));
			return javascript({ jsx: true });
		}
	}),
	LanguageDescription.of({
		name: "mermaid",
		extensions: ["mermaid"],
		async load() {
			const { mermaid } = await __vitePreload(async () => {
				const { mermaid } = await import("./dist-JfpQSojm.js");
				return { mermaid };
			}, __vite__mapDeps([13,14,2,3,4]));
			return mermaid();
		}
	}),
	LanguageDescription.of({
		name: "yaml",
		extensions: ["yaml", "yml"],
		async load() {
			const { yaml } = await __vitePreload(async () => {
				const { yaml } = await import("./dist-CTgoxbQK.js");
				return { yaml };
			}, __vite__mapDeps([15,2,3,4]));
			return yaml();
		}
	})
];
function glimdown() {
	return markdown({
		base: markdownLang(extendedMarkdown),
		codeLanguages
	});
}
//#endregion
export { glimdown };
