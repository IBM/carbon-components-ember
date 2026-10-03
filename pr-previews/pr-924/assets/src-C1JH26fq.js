const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dist-nUxiaYGK.js","assets/dist-CI_ns6W5.js","assets/w3c-keyname-DnKnFkWh.js","assets/dist-Y6qztM3-.js","assets/dist-64d5f6xD.js","assets/dist-4SiNbISa.js","assets/dist-hV_7N_fa.js","assets/dist-DxdNDvBQ.js","assets/dist-BH_PiiMj.js","assets/gjs-BNZ-tgcQ.js","assets/owner-1H-HTYNq.js","assets/dist-5pBHpTTt.js","assets/hbs-CsZqRUci.js","assets/utils-Clr1WYqO.js","assets/dist-8U6DtkEC.js","assets/preload-helper-59eyuSrX.js","assets/dist-DdVK9HtZ.js","assets/dist-BrSDMwWK.js","assets/gmd-DrAbdOt2.js","assets/utils-C33Y2U-y.js","assets/dist-C7tNeUlX.js","assets/parse-CoyB29YC.js","assets/rolldown-runtime-DC62tzP2.js","assets/lib-DMOxHVHU.js","assets/dist-CFfuNyTO.js","assets/lib-TsAjK6QO.js","assets/dist-JfpQSojm.js","assets/dist-DJ-PmwKQ.js","assets/dist-BUdaYsOe.js","assets/dist-D7CMNeiO.js","assets/codemirror-B6HkAdne.js","assets/dist-Z-lgxSeg.js","assets/es-module-shims-CVclpFi8.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./preload-helper-59eyuSrX.js";
import { a as nextId, c as unzippedPrefix, i as isRecord, n as errorMessage, o as prefix_tgz, r as fakeDomain, t as assert$2 } from "./utils-Clr1WYqO.js";
import { t as buildCodeFenceMetaUtils } from "./utils-C33Y2U-y.js";
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/types/standard.js
var types = {
	"application/andrew-inset": ["ez"],
	"application/appinstaller": ["appinstaller"],
	"application/applixware": ["aw"],
	"application/appx": ["appx"],
	"application/appxbundle": ["appxbundle"],
	"application/atom+xml": ["atom"],
	"application/atomcat+xml": ["atomcat"],
	"application/atomdeleted+xml": ["atomdeleted"],
	"application/atomsvc+xml": ["atomsvc"],
	"application/atsc-dwd+xml": ["dwd"],
	"application/atsc-held+xml": ["held"],
	"application/atsc-rsat+xml": ["rsat"],
	"application/automationml-aml+xml": ["aml"],
	"application/automationml-amlx+zip": ["amlx"],
	"application/bdoc": ["bdoc"],
	"application/calendar+xml": ["xcs"],
	"application/ccxml+xml": ["ccxml"],
	"application/cdfx+xml": ["cdfx"],
	"application/cdmi-capability": ["cdmia"],
	"application/cdmi-container": ["cdmic"],
	"application/cdmi-domain": ["cdmid"],
	"application/cdmi-object": ["cdmio"],
	"application/cdmi-queue": ["cdmiq"],
	"application/cpl+xml": ["cpl"],
	"application/cu-seeme": ["cu"],
	"application/cwl": ["cwl"],
	"application/dash+xml": ["mpd"],
	"application/dash-patch+xml": ["mpp"],
	"application/davmount+xml": ["davmount"],
	"application/dicom": ["dcm"],
	"application/docbook+xml": ["dbk"],
	"application/dssc+der": ["dssc"],
	"application/dssc+xml": ["xdssc"],
	"application/ecmascript": ["ecma"],
	"application/emma+xml": ["emma"],
	"application/emotionml+xml": ["emotionml"],
	"application/epub+zip": ["epub"],
	"application/exi": ["exi"],
	"application/express": ["exp"],
	"application/fdf": ["fdf"],
	"application/fdt+xml": ["fdt"],
	"application/font-tdpfr": ["pfr"],
	"application/geo+json": ["geojson"],
	"application/gml+xml": ["gml"],
	"application/gpx+xml": ["gpx"],
	"application/gxf": ["gxf"],
	"application/gzip": ["gz"],
	"application/hjson": ["hjson"],
	"application/hyperstudio": ["stk"],
	"application/inkml+xml": ["ink", "inkml"],
	"application/ipfix": ["ipfix"],
	"application/its+xml": ["its"],
	"application/java-archive": [
		"jar",
		"war",
		"ear"
	],
	"application/java-serialized-object": ["ser"],
	"application/java-vm": ["class"],
	"application/javascript": ["*js"],
	"application/json": ["json", "map"],
	"application/json5": ["json5"],
	"application/jsonml+json": ["jsonml"],
	"application/ld+json": ["jsonld"],
	"application/lgr+xml": ["lgr"],
	"application/lost+xml": ["lostxml"],
	"application/mac-binhex40": ["hqx"],
	"application/mac-compactpro": ["cpt"],
	"application/mads+xml": ["mads"],
	"application/manifest+json": ["webmanifest"],
	"application/marc": ["mrc"],
	"application/marcxml+xml": ["mrcx"],
	"application/mathematica": [
		"ma",
		"nb",
		"mb"
	],
	"application/mathml+xml": ["mathml"],
	"application/mbox": ["mbox"],
	"application/media-policy-dataset+xml": ["mpf"],
	"application/mediaservercontrol+xml": ["mscml"],
	"application/metalink+xml": ["metalink"],
	"application/metalink4+xml": ["meta4"],
	"application/mets+xml": ["mets"],
	"application/mmt-aei+xml": ["maei"],
	"application/mmt-usd+xml": ["musd"],
	"application/mods+xml": ["mods"],
	"application/mp21": ["m21", "mp21"],
	"application/mp4": [
		"*mp4",
		"*mpg4",
		"mp4s",
		"m4p"
	],
	"application/msix": ["msix"],
	"application/msixbundle": ["msixbundle"],
	"application/msword": ["doc", "dot"],
	"application/mxf": ["mxf"],
	"application/n-quads": ["nq"],
	"application/n-triples": ["nt"],
	"application/node": ["cjs"],
	"application/octet-stream": [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	],
	"application/oda": ["oda"],
	"application/oebps-package+xml": ["opf"],
	"application/ogg": ["ogx"],
	"application/omdoc+xml": ["omdoc"],
	"application/onenote": [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg",
		"one",
		"onea"
	],
	"application/oxps": ["oxps"],
	"application/p2p-overlay+xml": ["relo"],
	"application/patch-ops-error+xml": ["xer"],
	"application/pdf": ["pdf"],
	"application/pgp-encrypted": ["pgp"],
	"application/pgp-keys": ["asc"],
	"application/pgp-signature": ["sig", "*asc"],
	"application/pics-rules": ["prf"],
	"application/pkcs10": ["p10"],
	"application/pkcs7-mime": ["p7m", "p7c"],
	"application/pkcs7-signature": ["p7s"],
	"application/pkcs8": ["p8"],
	"application/pkix-attr-cert": ["ac"],
	"application/pkix-cert": ["cer"],
	"application/pkix-crl": ["crl"],
	"application/pkix-pkipath": ["pkipath"],
	"application/pkixcmp": ["pki"],
	"application/pls+xml": ["pls"],
	"application/postscript": [
		"ai",
		"eps",
		"ps"
	],
	"application/provenance+xml": ["provx"],
	"application/pskc+xml": ["pskcxml"],
	"application/raml+yaml": ["raml"],
	"application/rdf+xml": ["rdf", "owl"],
	"application/reginfo+xml": ["rif"],
	"application/relax-ng-compact-syntax": ["rnc"],
	"application/resource-lists+xml": ["rl"],
	"application/resource-lists-diff+xml": ["rld"],
	"application/rls-services+xml": ["rs"],
	"application/route-apd+xml": ["rapd"],
	"application/route-s-tsid+xml": ["sls"],
	"application/route-usd+xml": ["rusd"],
	"application/rpki-ghostbusters": ["gbr"],
	"application/rpki-manifest": ["mft"],
	"application/rpki-roa": ["roa"],
	"application/rsd+xml": ["rsd"],
	"application/rss+xml": ["rss"],
	"application/rtf": ["rtf"],
	"application/sbml+xml": ["sbml"],
	"application/scvp-cv-request": ["scq"],
	"application/scvp-cv-response": ["scs"],
	"application/scvp-vp-request": ["spq"],
	"application/scvp-vp-response": ["spp"],
	"application/sdp": ["sdp"],
	"application/senml+xml": ["senmlx"],
	"application/sensml+xml": ["sensmlx"],
	"application/set-payment-initiation": ["setpay"],
	"application/set-registration-initiation": ["setreg"],
	"application/shf+xml": ["shf"],
	"application/sieve": ["siv", "sieve"],
	"application/smil+xml": ["smi", "smil"],
	"application/sparql-query": ["rq"],
	"application/sparql-results+xml": ["srx"],
	"application/sql": ["sql"],
	"application/srgs": ["gram"],
	"application/srgs+xml": ["grxml"],
	"application/sru+xml": ["sru"],
	"application/ssdl+xml": ["ssdl"],
	"application/ssml+xml": ["ssml"],
	"application/swid+xml": ["swidtag"],
	"application/tei+xml": ["tei", "teicorpus"],
	"application/thraud+xml": ["tfi"],
	"application/timestamped-data": ["tsd"],
	"application/toml": ["toml"],
	"application/trig": ["trig"],
	"application/ttml+xml": ["ttml"],
	"application/ubjson": ["ubj"],
	"application/urc-ressheet+xml": ["rsheet"],
	"application/urc-targetdesc+xml": ["td"],
	"application/voicexml+xml": ["vxml"],
	"application/wasm": ["wasm"],
	"application/watcherinfo+xml": ["wif"],
	"application/widget": ["wgt"],
	"application/winhlp": ["hlp"],
	"application/wsdl+xml": ["wsdl"],
	"application/wspolicy+xml": ["wspolicy"],
	"application/xaml+xml": ["xaml"],
	"application/xcap-att+xml": ["xav"],
	"application/xcap-caps+xml": ["xca"],
	"application/xcap-diff+xml": ["xdf"],
	"application/xcap-el+xml": ["xel"],
	"application/xcap-ns+xml": ["xns"],
	"application/xenc+xml": ["xenc"],
	"application/xfdf": ["xfdf"],
	"application/xhtml+xml": ["xhtml", "xht"],
	"application/xliff+xml": ["xlf"],
	"application/xml": [
		"xml",
		"xsl",
		"xsd",
		"rng"
	],
	"application/xml-dtd": ["dtd"],
	"application/xop+xml": ["xop"],
	"application/xproc+xml": ["xpl"],
	"application/xslt+xml": ["*xsl", "xslt"],
	"application/xspf+xml": ["xspf"],
	"application/xv+xml": [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	],
	"application/yang": ["yang"],
	"application/yin+xml": ["yin"],
	"application/zip": ["zip"],
	"application/zip+dotlottie": ["lottie"],
	"audio/3gpp": ["*3gpp"],
	"audio/aac": ["adts", "aac"],
	"audio/adpcm": ["adp"],
	"audio/amr": ["amr"],
	"audio/basic": ["au", "snd"],
	"audio/midi": [
		"mid",
		"midi",
		"kar",
		"rmi"
	],
	"audio/mobile-xmf": ["mxmf"],
	"audio/mp3": ["*mp3"],
	"audio/mp4": [
		"m4a",
		"mp4a",
		"m4b"
	],
	"audio/mpeg": [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	],
	"audio/ogg": [
		"oga",
		"ogg",
		"spx",
		"opus"
	],
	"audio/s3m": ["s3m"],
	"audio/silk": ["sil"],
	"audio/wav": ["wav"],
	"audio/wave": ["*wav"],
	"audio/webm": ["weba"],
	"audio/xm": ["xm"],
	"font/collection": ["ttc"],
	"font/otf": ["otf"],
	"font/ttf": ["ttf"],
	"font/woff": ["woff"],
	"font/woff2": ["woff2"],
	"image/aces": ["exr"],
	"image/apng": ["apng"],
	"image/avci": ["avci"],
	"image/avcs": ["avcs"],
	"image/avif": ["avif"],
	"image/bmp": ["bmp", "dib"],
	"image/cgm": ["cgm"],
	"image/dicom-rle": ["drle"],
	"image/dpx": ["dpx"],
	"image/emf": ["emf"],
	"image/fits": ["fits"],
	"image/g3fax": ["g3"],
	"image/gif": ["gif"],
	"image/heic": ["heic"],
	"image/heic-sequence": ["heics"],
	"image/heif": ["heif"],
	"image/heif-sequence": ["heifs"],
	"image/hej2k": ["hej2"],
	"image/ief": ["ief"],
	"image/jaii": ["jaii"],
	"image/jais": ["jais"],
	"image/jls": ["jls"],
	"image/jp2": ["jp2", "jpg2"],
	"image/jpeg": [
		"jpg",
		"jpeg",
		"jpe"
	],
	"image/jph": ["jph"],
	"image/jphc": ["jhc"],
	"image/jpm": ["jpm", "jpgm"],
	"image/jpx": ["jpx", "jpf"],
	"image/jxl": ["jxl"],
	"image/jxr": ["jxr"],
	"image/jxra": ["jxra"],
	"image/jxrs": ["jxrs"],
	"image/jxs": ["jxs"],
	"image/jxsc": ["jxsc"],
	"image/jxsi": ["jxsi"],
	"image/jxss": ["jxss"],
	"image/ktx": ["ktx"],
	"image/ktx2": ["ktx2"],
	"image/pjpeg": ["jfif"],
	"image/png": ["png"],
	"image/sgi": ["sgi"],
	"image/svg+xml": ["svg", "svgz"],
	"image/t38": ["t38"],
	"image/tiff": ["tif", "tiff"],
	"image/tiff-fx": ["tfx"],
	"image/webp": ["webp"],
	"image/wmf": ["wmf"],
	"message/disposition-notification": ["disposition-notification"],
	"message/global": ["u8msg"],
	"message/global-delivery-status": ["u8dsn"],
	"message/global-disposition-notification": ["u8mdn"],
	"message/global-headers": ["u8hdr"],
	"message/rfc822": [
		"eml",
		"mime",
		"mht",
		"mhtml"
	],
	"model/3mf": ["3mf"],
	"model/gltf+json": ["gltf"],
	"model/gltf-binary": ["glb"],
	"model/iges": ["igs", "iges"],
	"model/jt": ["jt"],
	"model/mesh": [
		"msh",
		"mesh",
		"silo"
	],
	"model/mtl": ["mtl"],
	"model/obj": ["obj"],
	"model/prc": ["prc"],
	"model/step": [
		"step",
		"stp",
		"stpnc",
		"p21",
		"210"
	],
	"model/step+xml": ["stpx"],
	"model/step+zip": ["stpz"],
	"model/step-xml+zip": ["stpxz"],
	"model/stl": ["stl"],
	"model/u3d": ["u3d"],
	"model/vrml": ["wrl", "vrml"],
	"model/x3d+binary": ["*x3db", "x3dbz"],
	"model/x3d+fastinfoset": ["x3db"],
	"model/x3d+vrml": ["*x3dv", "x3dvz"],
	"model/x3d+xml": ["x3d", "x3dz"],
	"model/x3d-vrml": ["x3dv"],
	"text/cache-manifest": ["appcache", "manifest"],
	"text/calendar": ["ics", "ifb"],
	"text/coffeescript": ["coffee", "litcoffee"],
	"text/css": ["css"],
	"text/csv": ["csv"],
	"text/html": [
		"html",
		"htm",
		"shtml"
	],
	"text/jade": ["jade"],
	"text/javascript": ["js", "mjs"],
	"text/jsx": ["jsx"],
	"text/less": ["less"],
	"text/markdown": ["md", "markdown"],
	"text/mathml": ["mml"],
	"text/mdx": ["mdx"],
	"text/n3": ["n3"],
	"text/plain": [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	],
	"text/richtext": ["rtx"],
	"text/rtf": ["*rtf"],
	"text/sgml": ["sgml", "sgm"],
	"text/shex": ["shex"],
	"text/slim": ["slim", "slm"],
	"text/spdx": ["spdx"],
	"text/stylus": ["stylus", "styl"],
	"text/tab-separated-values": ["tsv"],
	"text/troff": [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	],
	"text/turtle": ["ttl"],
	"text/uri-list": [
		"uri",
		"uris",
		"urls"
	],
	"text/vcard": ["vcard"],
	"text/vtt": ["vtt"],
	"text/wgsl": ["wgsl"],
	"text/xml": ["*xml"],
	"text/yaml": ["yaml", "yml"],
	"video/3gpp": ["3gp", "3gpp"],
	"video/3gpp2": ["3g2"],
	"video/h261": ["h261"],
	"video/h263": ["h263"],
	"video/h264": ["h264"],
	"video/iso.segment": ["m4s"],
	"video/jpeg": ["jpgv"],
	"video/jpm": ["*jpm", "*jpgm"],
	"video/mj2": ["mj2", "mjp2"],
	"video/mp2t": [
		"ts",
		"m2t",
		"m2ts",
		"mts"
	],
	"video/mp4": [
		"mp4",
		"mp4v",
		"mpg4"
	],
	"video/mpeg": [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	],
	"video/ogg": ["ogv"],
	"video/quicktime": ["qt", "mov"],
	"video/webm": ["webm"]
};
Object.freeze(types);
//#endregion
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/Mime.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Mime_extensionToType;
var _Mime_typeToExtension;
var _Mime_typeToExtensions;
var Mime = class {
	constructor(...args) {
		_Mime_extensionToType.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtension.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtensions.set(this, /* @__PURE__ */ new Map());
		for (const arg of args) this.define(arg);
	}
	define(typeMap, force = false) {
		for (let [type, extensions] of Object.entries(typeMap)) {
			type = type.toLowerCase();
			extensions = extensions.map((ext) => ext.toLowerCase());
			if (!__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").has(type)) __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").set(type, /* @__PURE__ */ new Set());
			const allExtensions = __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type);
			let first = true;
			for (let extension of extensions) {
				const starred = extension.startsWith("*");
				extension = starred ? extension.slice(1) : extension;
				allExtensions?.add(extension);
				if (first) __classPrivateFieldGet(this, _Mime_typeToExtension, "f").set(type, extension);
				first = false;
				if (starred) continue;
				const currentType = __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(extension);
				if (currentType && currentType != type && !force) throw new Error(`"${type} -> ${extension}" conflicts with "${currentType} -> ${extension}". Pass \`force=true\` to override this definition.`);
				__classPrivateFieldGet(this, _Mime_extensionToType, "f").set(extension, type);
			}
		}
		return this;
	}
	getType(path) {
		if (typeof path !== "string") return null;
		const last = path.replace(/^.*[/\\]/s, "").toLowerCase();
		const ext = last.replace(/^.*\./s, "").toLowerCase();
		const hasPath = last.length < path.length;
		if (!(ext.length < last.length - 1) && hasPath) return null;
		return __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(ext) ?? null;
	}
	getExtension(type) {
		if (typeof type !== "string") return null;
		type = type?.split?.(";")[0];
		return (type && __classPrivateFieldGet(this, _Mime_typeToExtension, "f").get(type.trim().toLowerCase())) ?? null;
	}
	getAllExtensions(type) {
		if (typeof type !== "string") return null;
		return __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type.toLowerCase()) ?? null;
	}
	_freeze() {
		this.define = () => {
			throw new Error("define() not allowed for built-in Mime objects. See https://github.com/broofa/mime/blob/main/README.md#custom-mime-instances");
		};
		Object.freeze(this);
		for (const extensions of __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").values()) Object.freeze(extensions);
		return this;
	}
	_getTestState() {
		return {
			types: __classPrivateFieldGet(this, _Mime_extensionToType, "f"),
			extensions: __classPrivateFieldGet(this, _Mime_typeToExtension, "f")
		};
	}
};
_Mime_extensionToType = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtension = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtensions = /* @__PURE__ */ new WeakMap();
//#endregion
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/index_lite.js
var index_lite_default = new Mime(types)._freeze();
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/cache.js
var secretKey = "__repl-sdk__compiler__";
/**
* @typedef {object} ResolveIdValue
* @property {string} name
* @property {string} version
* @property {import('./types.ts').RequestAnswer} path
*
* @typedef {import('./request.js').Request} Request
*
* @typedef {typeof globalThis & { [secret]?: {
*   requestCache?: Map<string, Request>,
*   resolveId?: Map<string, ResolveIdValue>,
*   tarballs?: Map<string, import('./types.ts').UntarredPackage>,
*   resolves?: { [modulePath: string]: unknown },
*   promiseCache?: Map<string, Promise<unknown>>,
*   fileCache?: Map<string, { code: string, ext: string }>
*   caches?: Caches
* } }} ExtendedWindow
*/
var secret = Symbol.for(secretKey);
function getGlobal() {
	return globalThis;
}
assert$2(`There is already an instance of repl-sdk, and there can only be one. Make sure that your dependency graph is correct.`, !getGlobal()[secret]);
var Caches = class {
	clear() {
		delete getGlobal()[secret];
	}
	/**
	* Cache of resolved modulePaths to their module "value"
	*
	* @type {{ [modulePath: string]: unknown }}
	*/
	get resolves() {
		this.#root.resolves ||= {};
		return this.#root.resolves;
	}
	/**
	* Cache of untarred tarballs
	*
	* @type {Map<string, import('./types.ts').UntarredPackage>}
	*/
	get tarballs() {
		this.#root.tarballs ||= /* @__PURE__ */ new Map();
		return this.#root.tarballs;
	}
	/**
	* Cache of request resolutions
	*
	* @type {Map<string, ResolveIdValue>}
	*/
	get resolveId() {
		this.#root.resolveId ||= /* @__PURE__ */ new Map();
		return this.#root.resolveId;
	}
	/**
	* Cache of request Key to file content string
	*
	* @type {Map<string, { code: string, ext: string }>}
	*/
	get fileCache() {
		this.#root.fileCache ||= /* @__PURE__ */ new Map();
		return this.#root.fileCache;
	}
	/**
	* For any key, store a promise for resolving later
	*
	* @type {Map<string, Promise<unknown>>}
	*/
	get promiseCache() {
		this.#root.promiseCache ||= /* @__PURE__ */ new Map();
		return this.#root.promiseCache;
	}
	/**
	* @template Return
	* @type {(key: string, callback: () => Promise<any>) => Promise<any>}
	*/
	cachedPromise(key, callback) {
		const existing = this.promiseCache.get(key);
		if (existing) return existing;
		const promise = callback();
		this.promiseCache.set(key, promise);
		return promise;
	}
	get requestCache() {
		this.#root.requestCache ||= /* @__PURE__ */ new Map();
		return this.#root.requestCache;
	}
	get #root() {
		const global = getGlobal();
		global[secret] ||= {};
		global[secret].caches ||= this;
		return global[secret];
	}
};
var cache = new Caches();
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/ember.js
/**
* @typedef {import('../types.ts').CompilerConfig} CompilerConfig
*/
/**
* Other `@ember` (and `@glimmer`) packages are bundled in ember-source,
* and typecilaly use a build plugin to resolve from `@ember/*` imports.
*/
var externalPackages = [
	"@ember/test-helpers",
	"@ember/string",
	"@ember/test-waiters",
	"@ember/render-modifiers",
	"@glimmer/component"
];
/**
* @param {string} id
* @returns {string | undefined | (() => Record<string, unknown>)}
*/
function resolve$2(id) {
	if (id === "@ember/template-compiler/runtime") return `https://esm.sh/*ember-source/dist/packages/@ember/template-compiler/runtime.js`;
	if (externalPackages.some((name) => id.startsWith(name))) return `https://esm.sh/*${id}`;
	if (id.startsWith("@ember")) return `https://esm.sh/*ember-source/dist/packages/${id}`;
	if (id.startsWith("@glimmer")) return `https://esm.sh/*ember-source/dist/dependencies/${id}.js`;
	if (id.startsWith("@embroider/macros")) return () => ({
		/**
		* @param {unknown} x
		*/
		macroCondition: (x) => Boolean(x),
		dependencySatisfies: () => true,
		isDevelopingApp: () => true,
		getGlobalConfig: () => ({ WarpDrive: {
			debug: false,
			env: {
				DEBUG: false,
				TESTING: false,
				PRODUCTION: true
			},
			activeLogging: false,
			compatWith: "99.0",
			features: {},
			deprecations: {},
			polyfillUUID: false,
			includeDataAdapter: false
		} })
	});
}
/**
Example:

Uncaught (in promise) Error: Assertion Failed: You attempted to update `count` on `Demo`, but it had already been used previously in the same computation.  Attempting to update a value after using it in a computation can cause logical errors, infinite revalidation bugs, and performance issues, and is not supported.

`count` was first used:

- While rendering:
{{outlet}} for -top-level
-top-level
{{outlet}} for application
Demo
this.foos.value
this.foos

Stack trace for the update:
*
* @param {PromiseRejectionEvent} e
* @param {(message: string) => void} handle
*/
function onUnhandled(e, handle) {
	if (!e.reason?.message) return;
	let reason = errorMessage(e.reason);
	if (reason.includes("Stack trace for the update:")) reason += " (see console)";
	handle(reason);
}
/**
* @type {CompilerConfig}
*/
var gjs = {
	resolve: resolve$2,
	onUnhandled,
	codemirror: { lang: async () => {
		const { gjs } = await __vitePreload(async () => {
			const { gjs } = await import("./dist-nUxiaYGK.js");
			return { gjs };
		}, __vite__mapDeps([0,1,2,3,4,5,6,7,8]));
		return gjs();
	} },
	compiler: async (...args) => {
		return (await __vitePreload(() => import("./gjs-BNZ-tgcQ.js"), __vite__mapDeps([9,10]))).compiler(...args);
	}
};
/**
* @type {CompilerConfig}
*/
var hbs = {
	resolve: resolve$2,
	onUnhandled,
	codemirror: { lang: async () => {
		const { glimmer } = await __vitePreload(async () => {
			const { glimmer } = await import("./dist-5pBHpTTt.js");
			return { glimmer };
		}, __vite__mapDeps([11,6,1,2,3,7,8,4,5]));
		return glimmer();
	} },
	compiler: async (...args) => {
		return (await __vitePreload(() => import("./hbs-CsZqRUci.js"), __vite__mapDeps([12,13,10]))).compiler(...args);
	}
};
/**
* @type {CompilerConfig}
*/
var gmd = {
	resolve: resolve$2,
	onUnhandled,
	codemirror: {
		lang: async () => {
			const { glimdown } = await __vitePreload(async () => {
				const { glimdown } = await import("./dist-8U6DtkEC.js");
				return { glimdown };
			}, __vite__mapDeps([14,15,1,2,16,17,5,7,3,8,4]));
			return glimdown();
		},
		support: async () => {
			const { gjs } = await __vitePreload(async () => {
				const { gjs } = await import("./dist-nUxiaYGK.js");
				return { gjs };
			}, __vite__mapDeps([0,1,2,3,4,5,6,7,8]));
			return [gjs().support];
		}
	},
	compiler: async (...args) => {
		return (await __vitePreload(() => import("./gmd-DrAbdOt2.js"), __vite__mapDeps([18,15,13,19]))).compiler(...args);
	}
};
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/js.js
/**
* @type {import('../types.ts').CompilerConfig}
*/
var js = {
	codemirror: { lang: async () => {
		const { javascript } = await __vitePreload(async () => {
			const { javascript } = await import("./dist-C7tNeUlX.js");
			return { javascript };
		}, __vite__mapDeps([20,4,1,2,5,3]));
		return javascript();
	} },
	compiler: async (config, api) => {
		return {
			compile: async (text, options) => {
				return text;
			},
			render: async (element, fun, extra, compiler) => {
				assert$2(`js document must have a function for a default export. Instead received: ${typeof fun}`, typeof fun === "function");
				await fun(element);
				compiler.announce("info", "Done");
			}
		};
	}
};
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/markdown.js
/**
* @typedef {import('unified').Plugin} Plugin
*/
/**
* @param {unknown} [ options ]
* @returns {{ remarkPlugins: Plugin[], rehypePlugins: Plugin[] }}
*/
function filterOptions(options) {
	if (!isRecord(options)) return {
		remarkPlugins: [],
		rehypePlugins: []
	};
	return {
		remarkPlugins: /** @type {Plugin[]}*/ options?.remarkPlugins || [],
		rehypePlugins: /** @type {Plugin[]}*/ options?.rehypePlugins || []
	};
}
/**
* @type {import('../types.ts').CompilerConfig}
*/
var md = {
	codemirror: { lang: async () => {
		const { glimdown } = await __vitePreload(async () => {
			const { glimdown } = await import("./dist-8U6DtkEC.js");
			return { glimdown };
		}, __vite__mapDeps([14,15,1,2,16,17,5,7,3,8,4]));
		/**
		* pre-configured markdown with GFM, and a few other extensions
		*/
		return glimdown();
	} },
	compiler: async (config, api) => {
		const { isLive, isPreview, needsLive, allowedFormats, isBelow, getFlavorFromMeta } = buildCodeFenceMetaUtils(api);
		const userOptions = filterOptions(
			/** @type {Record<string, unknown>} */
			config.userOptions?.md || config
		);
		const { parseMarkdown } = await __vitePreload(async () => {
			const { parseMarkdown } = await import("./parse-CoyB29YC.js");
			return { parseMarkdown };
		}, __vite__mapDeps([21,22,13,23,24,25]));
		/**
		* @type {import('../types.ts').Compiler}
		*/
		return {
			compile: async (text, options) => {
				const compileOptions = filterOptions(options);
				const result = await parseMarkdown(text, {
					remarkPlugins: [...userOptions.remarkPlugins, ...compileOptions.remarkPlugins],
					rehypePlugins: [...userOptions.rehypePlugins, ...compileOptions.rehypePlugins],
					isLive,
					isPreview,
					isBelow,
					needsLive,
					ALLOWED_FORMATS: allowedFormats,
					getFlavorFromMeta
				});
				return {
					compiled: `export default \`${result.text.replace(/`/g, "\\`")}\``,
					...result
				};
			},
			render: async (element, compiled, extra, compiler) => {
				element.innerHTML = compiled;
				/**
				* @type {(() => void)[]}
				*/
				const destroyables = [];
				await Promise.all(
					/** @type {unknown[]} */
					extra.codeBlocks.map(async (info) => {
						/** @type {Record<string, unknown>} */
						const infoObj = info;
						if (!api.canCompile(
							/** @type {string} */
							infoObj.format,
							/** @type {string} */
							infoObj.flavor
						)) return;
						const flavor = infoObj.flavor;
						const subRender = await compiler.compile(
							/** @type {string} */
							infoObj.format,
							/** @type {string} */
							infoObj.code,
							{
								...compiler.optionsFor(
									/** @type {string} */
									infoObj.format,
									flavor
								),
								flavor
							}
						);
						const selector = `#${/** @type {string} */ infoObj.placeholderId}`;
						const target = element.querySelector(selector);
						assert$2(`Could not find placeholder / target element (using selector: \`${selector}\`). Could not render ${/** @type {string} */ infoObj.format} block.`, target);
						destroyables.push(subRender.destroy);
						target.appendChild(subRender.element);
					})
				);
				compiler.announce("info", "Done");
				return () => {
					for (const subDestroy of destroyables) subDestroy();
				};
			}
		};
	}
};
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/specifier.js
/**
* Parses
*   @scope/pkgName
*   pkgName
*   @scope/pkgName@version
*   pkgName@version
*   @scope/pkgName@version/path
*   pkgName@version/path
*
* @param {string} specifier
* @returns {{ name: string, version: string | undefined, path: string }}
*/
function parseSpecifier(specifier) {
	let name = "";
	let version = "";
	let path = ".";
	const chars = specifier.split("");
	const hasScope = chars[0] === "@";
	let isVersion = false;
	let isPath = false;
	let finishedName = false;
	let slashCount = 0;
	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		if (char === "@" && i > 0) {
			finishedName = true;
			isVersion = true;
			continue;
		} else if (char === "/") {
			slashCount++;
			if (hasScope) {
				if (slashCount > 1) finishedName = true;
			} else finishedName = true;
			if (finishedName) isPath = true;
		}
		if (isVersion && char === "/") {
			isVersion = false;
			isPath = true;
		}
		if (isVersion) version += char;
		else if (isPath) path += char;
		else name += char;
	}
	return {
		name,
		version: version || void 0,
		path
	};
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/cdn.js
/**
* @param {string} importPath
* @returns {[string, string]}
*/
function splitSubPath(importPath) {
	const parsed = parseSpecifier(importPath);
	return [parsed.name, parsed.path === "." ? "" : parsed.path];
}
/**
* Generate an import URL for esm.sh
*
* @param {Record<string, string>} versions
* @param {string} importPath
*/
function esmSh(versions, importPath, allExternal = false) {
	const [name, subPath] = splitSubPath(importPath);
	const version = versions[name];
	const subPathExport = subPath.length === 0 || subPath.startsWith("/") ? subPath : `/${subPath}`;
	const externals = allExternal ? "*" : "";
	return version ? `https://esm.sh/${externals}${name}@${version}${subPathExport}` : `https://esm.sh/${externals}${name}${subPathExport}`;
}
var esmsh = {
	/**
	* @param {Record<string, string>} versions
	* @param {string} importPath
	*/
	async import(versions, importPath) {
		const url = esmSh(versions, importPath);
		return await __vitePreload(() => import(
			/* @vite-ignore */
			url
), []);
	},
	/**
	* @param {Record<string, string>} versions
	* @param {string[]} deps the names of deps to pull from esm.sh
	*/
	async importAll(versions, deps = []) {
		return await Promise.all(deps.map((dep) => {
			return esmsh.import(versions, dep);
		}));
	}
};
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers.js
/**
* @type {import('./types').Options['formats']}
*/
var compilers = {
	hbs: { 
	/**
	* ember has historically used a subset of HBS, and then built its own features on top of.
	*
	* It is not "handlebars", but does share a lot of similarities.
	* (and these continue in ember's new gjs and gts formats)
	*
	*/
ember: hbs },
	/**
	* Markdown, but every code fense can be a live "Island"
	* if `live` is in the codefence's meta tag and the compiler
	* is registered here, or by the user of repl-sdk.
	*/
	md,
	/**
	* Glimmer-flavored Markdown.
	*
	* Like the markdow renderer, but the resulting HTML
	* is a Glimmer Component, rather than just plain HTML.
	*
	* https://emberjs.com
	* https://repl.nullvoxpopuli.com
	* https://kolay.nullvoxpopuli.com
	* https://tutorial.glimdown.com
	* https://limber.glimdown.com
	*/
	gmd,
	/**
	* Glimmer-Flavored JavaScript
	*
	* https://emberjs.com
	*/
	gjs,
	/**
	* TODO:
	* Glimmer-flavored TypeScript
	*
	* https://emberjs.com
	*/
	/**
	* Just vanilla JS.
	*/
	js,
	/**
	* JSX is too overloaded to treat one way.
	* We need to split this, and then make folks choose which one to use
	* - jsx-react
	* - jsx-vue
	* - jsx-solid
	* - (etc)
	*
	* This means that as a generic compiler, we can't just have jsx support.
	* And in markdown, we'll need to support choosing which flavor of jsx
	* via meta tags on the codefences.
	*
	* For example:
	* ```jsx solid
	* export default <></>;
	* ```
	*
	* or
	* ```jsx react
	* export default <></>;
	* ```
	*/
	jsx: { 
	/**
	* https://react.dev/
	*/
react: {
		codemirror: { lang: async () => {
			const { javascript } = await __vitePreload(async () => {
				const { javascript } = await import("./dist-C7tNeUlX.js");
				return { javascript };
			}, __vite__mapDeps([20,4,1,2,5,3]));
			return javascript({ jsx: true });
		} },
		resolve: (id) => {
			/**
			* NOTE: react still only publishes CJS to NPM
			*/
			switch (id) {
				case "react": return `https://esm.sh/react@19.2.3/es2022/react.development.mjs`;
				case "react/jsx-dev-runtime": return `https://esm.sh/react@19.2.3/es2022/jsx-dev-runtime.development.mjs`;
				case "react/jsx-runtime": return `https://esm.sh/react@19.2.3/es2022/jsx-runtime.mjs`;
				case "react-dom/client": return `https://esm.sh/react-dom@19.2.3/es2022/client.development.mjs`;
				case "@babel/standalone": return `https://esm.sh/@babel/standalone`;
			}
		},
		compiler: async (config, api) => {
			const [reactDom, babel] = await api.tryResolveAll(["react-dom/client", "@babel/standalone"]);
			const { createRoot } = reactDom;
			return {
				async compile(text) {
					return babel.transform(text, {
						filename: `repl.js`,
						presets: [[babel.availablePresets.react, {
							/**
							* The production automatic runtime (jsx/jsxs from
							* 'react/jsx-runtime') works under both dev- and
							* production-built hosts.
							*
							* The default (development) transform emits jsxDEV from
							* 'react/jsx-dev-runtime', which a production build of react
							* deliberately exports as undefined — every compiled demo
							* then throws "_jsxDEV is not a function" at evaluation.
							*/
							runtime: "automatic",
							development: false
						}]]
					}).code;
				},
				async render(element, component) {
					const root = createRoot(element);
					await new Promise((resolve) => requestAnimationFrame(resolve));
					root.render(component);
					await new Promise((resolve) => requestAnimationFrame(resolve));
					return () => root.unmount();
				}
			};
		}
	} },
	/**
	* https://mermaid.js.org/
	*/
	mermaid: {
		needsLiveMeta: false,
		codemirror: { lang: async () => {
			const { mermaid } = await __vitePreload(async () => {
				const { mermaid } = await import("./dist-JfpQSojm.js");
				return { mermaid };
			}, __vite__mapDeps([26,27,1,2,3]));
			return mermaid();
		} },
		compiler: async (config, api) => {
			const versions = config.versions;
			const { default: mermaid } = await api.tryResolve("mermaid", () => {
				return esmsh.import(versions, "mermaid");
			});
			let id = 0;
			return {
				compile: async (text) => {
					return `export default \`${text}\`;`;
				},
				render: async (element, text, _, compiler) => {
					const { svg } = await mermaid.render("graphDiv" + id++, text);
					element.innerHTML = svg;
					compiler.announce("info", "Done");
				}
			};
		}
	},
	/**
	* https://svelte.dev/
	*/
	svelte: {
		codemirror: { lang: async () => {
			const { svelte } = await __vitePreload(async () => {
				const { svelte } = await import("./dist-BUdaYsOe.js");
				return { svelte };
			}, __vite__mapDeps([28,1,2,3,7,8,4,5]));
			return svelte();
		} },
		/**
		* Default config, known to work with how the compiler and render functions are configured.
		*/
		resolve: (id) => {
			if (["svelte"].some((x) => id.startsWith(x))) return esmSh({ svelte: "5.35.7" }, id, false) + "?dev&target=esnext&keep-names";
			if ([
				"zimmerframe",
				"locate-character",
				"acorn",
				"clsx",
				"magic-string",
				"@ampproject/remapping",
				"@jridgewell/sourcemap-codec",
				"axobject-query",
				"esrap",
				"is-reference",
				"aria-query",
				"@sveltejs/acorn-typescript"
			].some((x) => id.startsWith(x))) return esmSh({}, id, false);
		},
		compiler: async (config, api) => {
			const [svelte, compiler] = await api.tryResolveAll(["svelte", "svelte/compiler"]);
			return {
				compile: async (text, options) => {
					/**
					* source: https://github.com/sveltejs/svelte/blob/26e328689950b390189c6da31c32283d217df4b4/packages/svelte/src/compiler/index.js#L22
					*
					* Usages:
					* https://github.com/sveltejs/svelte/blob/main/playgrounds/sandbox/run.js#L75
					*/
					const output = await compiler.compile(text, {
						generate: "client",
						fragments: "html",
						filename: "repl-sdk.svelte",
						dev: true,
						runes: true
					});
					return {
						compiled: output.js.code,
						css: output.css?.code
					};
				},
				render: async (element, component, { css }) => {
					const div = document.createElement("div");
					if (css) {
						const style = document.createElement("style");
						style.innerHTML = css;
						element.appendChild(style);
					}
					element.appendChild(div);
					await new Promise((resolve) => requestAnimationFrame(resolve));
					const instance = svelte.mount(component, {
						target: element,
						props: {}
					});
					api.announce("info", "Done");
					return () => svelte.unmount(instance);
				}
			};
		}
	},
	/**
	* https://vuejs.org/
	*/
	vue: {
		codemirror: { lang: async () => {
			const { vue } = await __vitePreload(async () => {
				const { vue } = await import("./dist-D7CMNeiO.js");
				return { vue };
			}, __vite__mapDeps([29,1,2,3,7,8,4,5]));
			return vue();
		} },
		/**
		* Default config, known to work with how the compiler and render functions are configured.
		*/
		resolve: (id) => {
			switch (id) {
				case "vue": return `https://cdn.jsdelivr.net/npm/vue@3.5.16/+esm`;
				case "@vue/repl": return `https://cdn.jsdelivr.net/npm/@vue/repl@4.5.1/+esm`;
			}
		},
		compiler: async (config, api) => {
			const [{ createApp }, { compileFile, useStore }] = await api.tryResolveAll(["vue", "@vue/repl"]);
			const store = useStore();
			return {
				compile: async (text, options) => {
					const output = {
						js: "",
						css: "",
						ssr: ""
					};
					await compileFile(store, {
						code: text,
						filename: options.fileName,
						language: "vue",
						compiled: output
					});
					return {
						compiled: output.js,
						css: output.css
					};
				},
				render: async (element, component, { css }, compiler) => {
					const div = document.createElement("div");
					const style = document.createElement("style");
					style.innerHTML = css;
					element.appendChild(div);
					element.appendChild(style);
					const app = createApp(component);
					app.mount(div);
					compiler.announce("info", "Done");
					return () => app.unmount();
				}
			};
		}
	}
};
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/es-module-shim.js
/**
* es-module-shim can only be initialized once.
* it freezes its caches and options passed to it.
*
* So... here we are. Making stuff dynamic so we can have es-module-shims
* deal with the "most recent" intance of the compiler
* (since the compiler holds state,
*  and our tests share all globals as they run in the same browser window).
*/
/**
* @type {{
*   resolve: (id: string, parentUrl: string, parentResolve: (id: string, parentUrl: string) => string) => string
*   fetch: (id: string, options: RequestInit) => Promise<Response>
* }}
*/
var STABLE_REFERENCE = {
	resolve: () => {
		throw new Error(`'resolve' not implemented in STABLE_REFERENCE. Has the Compiler been set up correctly?`);
	},
	fetch: async () => {
		throw new Error(`'fetch' not implemented in STABLE_REFERENCE. Has the Compiler been set up correctly?`);
	}
};
globalThis.esmsInitOptions = {
	shimMode: true,
	revokeBlobURLs: true,
	mapOverrides: true,
	/**
	* @param {string} id
	* @param {string} parentUrl
	* @param {(id: string, parentUrl: string) => string} resolve
	* @returns {string}
	*/
	resolve: (id, parentUrl, resolve) => STABLE_REFERENCE.resolve(id, parentUrl, resolve),
	/**
	* @param {string} url
	* @param {RequestInit} options
	* @returns {Promise<Response>}
	*/
	fetch: (url, options) => STABLE_REFERENCE.fetch(url, options)
};
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/request.js
var requestId = 1;
function requestKey() {
	return `repl-request-${requestId++}`;
}
/**
* @param {{ to: string, from?: string }} options
* @returns {string} the URL of the request
*/
function getTarRequestId({ to, from }) {
	const request = Request.of({
		to,
		from
	});
	const key = requestKey();
	cache.requestCache.set(key, request);
	return `${unzippedPrefix}/${key}`;
}
var Request = class Request {
	static get #idCache() {
		return cache.requestCache;
	}
	/**
	* @param {{ to: string, from?: string }} toFrom
	*/
	static of({ to, from }) {
		const isRoot = to.match(/^[A-Za-z@]/);
		const fromId = from?.replace(unzippedPrefix + "/", "");
		return Request.fromSpecifier(isRoot ? to : `${to}?from=${fromId}`);
	}
	/**
	* @param {string} id
	*/
	static fromRequestId(id) {
		const request = Request.#idCache.get(id);
		assert$2(`Could not find request from id:${id}`, request);
		return request;
	}
	/**
	* @param {string} specifier
	*/
	static fromSpecifier(specifier) {
		return new Request(specifier);
	}
	/** @type {string} */
	#to;
	/** @type {Request | undefined} */
	#from;
	/**
	* @private
	* @param {string} specifier
	*/
	constructor(specifier) {
		const [full, query] = specifier.replace(unzippedPrefix, "").split("?");
		this.original = specifier;
		assert$2(`Invalid specifier: ${specifier}`, full);
		if (full.startsWith(".") || full.startsWith("#")) {
			if (!query) throw new Error(`Missing query, ?from for specifier: ${specifier}. From is required for relative and subpath-imports.`);
		}
		/**
		* This will either be '.' or have the leading ./
		*/
		this.#to = full;
		if (query) {
			const fromQp = new URLSearchParams(query).get("from");
			assert$2(`Missing query, ?from for specifier: ${specifier}`, fromQp);
			const from = Request.fromRequestId(fromQp);
			this.#from = from;
			this.name = from.name;
			this.version = from.version;
		} else {
			const { name, version = "latest", path } = parseSpecifier(full);
			this.name = name;
			this.version = version.replace(/\.+$/, "");
			this.#to = path;
		}
	}
	get to() {
		return this.#to;
	}
	get from() {
		return this.#from;
	}
	get key() {
		return `__name__/${this.name}[AT:V]${this.version}/__to__/${this.to}`;
	}
};
//#endregion
//#region ../node_modules/.pnpm/comlink@4.4.2/node_modules/comlink/dist/esm/comlink.mjs
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/
var proxyMarker = Symbol("Comlink.proxy");
var createEndpoint = Symbol("Comlink.endpoint");
var releaseProxy = Symbol("Comlink.releaseProxy");
var finalizer = Symbol("Comlink.finalizer");
var throwMarker = Symbol("Comlink.thrown");
var isObject = (val) => typeof val === "object" && val !== null || typeof val === "function";
/**
* Allows customizing the serialization of certain values.
*/
var transferHandlers = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (val) => isObject(val) && val[proxyMarker],
	serialize(obj) {
		const { port1, port2 } = new MessageChannel();
		expose(obj, port1);
		return [port2, [port2]];
	},
	deserialize(port) {
		port.start();
		return wrap(port);
	}
}], ["throw", {
	canHandle: (value) => isObject(value) && throwMarker in value,
	serialize({ value }) {
		let serialized;
		if (value instanceof Error) serialized = {
			isError: true,
			value: {
				message: value.message,
				name: value.name,
				stack: value.stack
			}
		};
		else serialized = {
			isError: false,
			value
		};
		return [serialized, []];
	},
	deserialize(serialized) {
		if (serialized.isError) throw Object.assign(new Error(serialized.value.message), serialized.value);
		throw serialized.value;
	}
}]]);
function isAllowedOrigin(allowedOrigins, origin) {
	for (const allowedOrigin of allowedOrigins) {
		if (origin === allowedOrigin || allowedOrigin === "*") return true;
		if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) return true;
	}
	return false;
}
function expose(obj, ep = globalThis, allowedOrigins = ["*"]) {
	ep.addEventListener("message", function callback(ev) {
		if (!ev || !ev.data) return;
		if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
			console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
			return;
		}
		const { id, type, path } = Object.assign({ path: [] }, ev.data);
		const argumentList = (ev.data.argumentList || []).map(fromWireValue);
		let returnValue;
		try {
			const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
			const rawValue = path.reduce((obj, prop) => obj[prop], obj);
			switch (type) {
				case "GET":
					returnValue = rawValue;
					break;
				case "SET":
					parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
					returnValue = true;
					break;
				case "APPLY":
					returnValue = rawValue.apply(parent, argumentList);
					break;
				case "CONSTRUCT":
					returnValue = proxy(new rawValue(...argumentList));
					break;
				case "ENDPOINT":
					{
						const { port1, port2 } = new MessageChannel();
						expose(obj, port2);
						returnValue = transfer(port1, [port1]);
					}
					break;
				case "RELEASE":
					returnValue = void 0;
					break;
				default: return;
			}
		} catch (value) {
			returnValue = {
				value,
				[throwMarker]: 0
			};
		}
		Promise.resolve(returnValue).catch((value) => {
			return {
				value,
				[throwMarker]: 0
			};
		}).then((returnValue) => {
			const [wireValue, transferables] = toWireValue(returnValue);
			ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
			if (type === "RELEASE") {
				ep.removeEventListener("message", callback);
				closeEndPoint(ep);
				if (finalizer in obj && typeof obj[finalizer] === "function") obj[finalizer]();
			}
		}).catch((error) => {
			const [wireValue, transferables] = toWireValue({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[throwMarker]: 0
			});
			ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
		});
	});
	if (ep.start) ep.start();
}
function isMessagePort(endpoint) {
	return endpoint.constructor.name === "MessagePort";
}
function closeEndPoint(endpoint) {
	if (isMessagePort(endpoint)) endpoint.close();
}
function wrap(ep, target) {
	const pendingListeners = /* @__PURE__ */ new Map();
	ep.addEventListener("message", function handleMessage(ev) {
		const { data } = ev;
		if (!data || !data.id) return;
		const resolver = pendingListeners.get(data.id);
		if (!resolver) return;
		try {
			resolver(data);
		} finally {
			pendingListeners.delete(data.id);
		}
	});
	return createProxy(ep, pendingListeners, [], target);
}
function throwIfProxyReleased(isReleased) {
	if (isReleased) throw new Error("Proxy has been released and is not useable");
}
function releaseEndpoint(ep) {
	return requestResponseMessage(ep, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		closeEndPoint(ep);
	});
}
var proxyCounter = /* @__PURE__ */ new WeakMap();
var proxyFinalizers = "FinalizationRegistry" in globalThis && new FinalizationRegistry((ep) => {
	const newCount = (proxyCounter.get(ep) || 0) - 1;
	proxyCounter.set(ep, newCount);
	if (newCount === 0) releaseEndpoint(ep);
});
function registerProxy(proxy, ep) {
	const newCount = (proxyCounter.get(ep) || 0) + 1;
	proxyCounter.set(ep, newCount);
	if (proxyFinalizers) proxyFinalizers.register(proxy, ep, proxy);
}
function unregisterProxy(proxy) {
	if (proxyFinalizers) proxyFinalizers.unregister(proxy);
}
function createProxy(ep, pendingListeners, path = [], target = function() {}) {
	let isProxyReleased = false;
	const proxy = new Proxy(target, {
		get(_target, prop) {
			throwIfProxyReleased(isProxyReleased);
			if (prop === releaseProxy) return () => {
				unregisterProxy(proxy);
				releaseEndpoint(ep);
				pendingListeners.clear();
				isProxyReleased = true;
			};
			if (prop === "then") {
				if (path.length === 0) return { then: () => proxy };
				const r = requestResponseMessage(ep, pendingListeners, {
					type: "GET",
					path: path.map((p) => p.toString())
				}).then(fromWireValue);
				return r.then.bind(r);
			}
			return createProxy(ep, pendingListeners, [...path, prop]);
		},
		set(_target, prop, rawValue) {
			throwIfProxyReleased(isProxyReleased);
			const [value, transferables] = toWireValue(rawValue);
			return requestResponseMessage(ep, pendingListeners, {
				type: "SET",
				path: [...path, prop].map((p) => p.toString()),
				value
			}, transferables).then(fromWireValue);
		},
		apply(_target, _thisArg, rawArgumentList) {
			throwIfProxyReleased(isProxyReleased);
			const last = path[path.length - 1];
			if (last === createEndpoint) return requestResponseMessage(ep, pendingListeners, { type: "ENDPOINT" }).then(fromWireValue);
			if (last === "bind") return createProxy(ep, pendingListeners, path.slice(0, -1));
			const [argumentList, transferables] = processArguments(rawArgumentList);
			return requestResponseMessage(ep, pendingListeners, {
				type: "APPLY",
				path: path.map((p) => p.toString()),
				argumentList
			}, transferables).then(fromWireValue);
		},
		construct(_target, rawArgumentList) {
			throwIfProxyReleased(isProxyReleased);
			const [argumentList, transferables] = processArguments(rawArgumentList);
			return requestResponseMessage(ep, pendingListeners, {
				type: "CONSTRUCT",
				path: path.map((p) => p.toString()),
				argumentList
			}, transferables).then(fromWireValue);
		}
	});
	registerProxy(proxy, ep);
	return proxy;
}
function myFlat(arr) {
	return Array.prototype.concat.apply([], arr);
}
function processArguments(argumentList) {
	const processed = argumentList.map(toWireValue);
	return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}
var transferCache = /* @__PURE__ */ new WeakMap();
function transfer(obj, transfers) {
	transferCache.set(obj, transfers);
	return obj;
}
function proxy(obj) {
	return Object.assign(obj, { [proxyMarker]: true });
}
function toWireValue(value) {
	for (const [name, handler] of transferHandlers) if (handler.canHandle(value)) {
		const [serializedValue, transferables] = handler.serialize(value);
		return [{
			type: "HANDLER",
			name,
			value: serializedValue
		}, transferables];
	}
	return [{
		type: "RAW",
		value
	}, transferCache.get(value) || []];
}
function fromWireValue(value) {
	switch (value.type) {
		case "HANDLER": return transferHandlers.get(value.name).deserialize(value.value);
		case "RAW": return value.value;
	}
}
function requestResponseMessage(ep, pendingListeners, msg, transfers) {
	return new Promise((resolve) => {
		const id = generateUUID();
		pendingListeners.set(id, resolve);
		if (ep.start) ep.start();
		ep.postMessage(Object.assign({ id }, msg), transfers);
	});
}
function generateUUID() {
	return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
//#endregion
//#region ../node_modules/.pnpm/resolve.exports@2.0.3/node_modules/resolve.exports/dist/index.mjs
function e(e, n, r) {
	throw new Error(r ? `No known conditions for "${n}" specifier in "${e}" package` : `Missing "${n}" specifier in "${e}" package`);
}
function n(n, i, o, f) {
	let s, u, l = r(n, o), c = function(e) {
		let n = /* @__PURE__ */ new Set(["default", ...e.conditions || []]);
		return e.unsafe || n.add(e.require ? "require" : "import"), e.unsafe || n.add(e.browser ? "browser" : "node"), n;
	}(f || {}), a = i[l];
	if (void 0 === a) {
		let e, n, r, t;
		for (t in i) n && t.length < n.length || ("/" === t[t.length - 1] && l.startsWith(t) ? (u = l.substring(t.length), n = t) : t.length > 1 && (r = t.indexOf("*", 1), ~r && (e = RegExp("^" + t.substring(0, r) + "(.*)" + t.substring(1 + r) + "$").exec(l), e && e[1] && (u = e[1], n = t))));
		a = i[n];
	}
	return a || e(n, l), s = t(a, c), s || e(n, l, 1), u && function(e, n) {
		let r, t = 0, i = e.length, o = /[*]/g, f = /[/]$/;
		for (; t < i; t++) e[t] = o.test(r = e[t]) ? r.replace(o, n) : f.test(r) ? r + n : r;
	}(s, u), s;
}
function r(e, n, r) {
	if (e === n || "." === n) return ".";
	let t = e + "/", i = t.length, o = n.slice(0, i) === t, f = o ? n.slice(i) : n;
	return "#" === f[0] ? f : o || !r ? "./" === f.slice(0, 2) ? f : "./" + f : f;
}
function t(e, n, r) {
	if (e) {
		if ("string" == typeof e) return r && r.add(e), [e];
		let i, o;
		if (Array.isArray(e)) {
			for (o = r || /* @__PURE__ */ new Set(), i = 0; i < e.length; i++) t(e[i], n, o);
			if (!r && o.size) return [...o];
		} else for (i in e) if (n.has(i)) return t(e[i], n, r);
	}
}
function o(e, r, t) {
	let i, o = e.exports;
	if (o) {
		if ("string" == typeof o) o = { ".": o };
		else for (i in o) {
			"." !== i[0] && (o = { ".": o });
			break;
		}
		return n(e.name, o, r || ".", t);
	}
}
//#endregion
//#region ../node_modules/.pnpm/pattern-key-compare@2.0.0/node_modules/pattern-key-compare/esm/index.js
/**
* Implementation of `PATTERN_KEY_COMPARE`
*
* @see https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
*/
function patternKeyCompare(a, b) {
	const aPatternIndex = a.indexOf("*");
	const bPatternIndex = b.indexOf("*");
	assert$1(aPatternIndex !== -1, `'${a}' does not contain '*'`);
	assert$1(bPatternIndex !== -1, `'${b}' does not contain '*'`);
	assert$1(a.lastIndexOf("*") === aPatternIndex, `'${a}' has more than one '*'`);
	assert$1(b.lastIndexOf("*") === bPatternIndex, `'${b}' has more than one '*'`);
	const baseLenA = aPatternIndex + 1;
	const baseLenB = bPatternIndex + 1;
	if (baseLenA > baseLenB) return -1;
	if (baseLenB > baseLenA) return 1;
	if (a.length > b.length) return -1;
	if (b.length > a.length) return 1;
	return 0;
}
function assert$1(condition, message) {
	if (!condition) throw new Error(message);
}
//#endregion
//#region ../node_modules/.pnpm/resolve.imports@2.0.3/node_modules/resolve.imports/esm/errors.js
var ERR_INVALID_MODULE_SPECIFIER = createErrorType(`ERR_INVALID_MODULE_SPECIFIER`, (request, reason, base = void 0) => `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ``}`, TypeError);
var ERR_PACKAGE_IMPORT_NOT_DEFINED = createErrorType("ERR_PACKAGE_IMPORT_NOT_DEFINED", (specifier, packagePath, base) => `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath}${packagePath.endsWith("/") ? "" : "/"}package.json` : ""}${base ? ` imported from ${base}` : ``}`, TypeError);
function createErrorType(code, messageCreator, errorType) {
	return class extends errorType {
		constructor(...args) {
			super(messageCreator(...args));
			this.code = code;
			this.name = `${errorType.name} [${code}]`;
		}
	};
}
function assert(condition, message) {
	if (!condition) throw new Error(message);
}
//#endregion
//#region ../node_modules/.pnpm/resolve.imports@2.0.3/node_modules/resolve.imports/esm/index.js
/**
* Resolve an import specifier based on the `imports` field in `package.json`.
*
* @param manifest of package.json
* @param specifier import specifier
* @return resolved specifier or undefined if not found
* @see https://nodejs.org/api/packages.html#subpath-imports
*/
function resolve$1(manifest, specifier, options) {
	assert(specifier.startsWith("#"), "import specifier must start with #");
	if (specifier === "#" || specifier === "#/") throw new ERR_INVALID_MODULE_SPECIFIER(specifier, `is not a valid internal imports specifier name`, manifest.base);
	if (manifest.content.imports) {
		const conditions = new Set(options?.conditions ?? []);
		const matched = manifest.content.imports[specifier];
		if (matched) return noRecursive(resolvePackagePattern(matched, conditions));
		const expansionKeys = getExpensionKeys(Object.keys(manifest.content.imports));
		for (const key of expansionKeys) {
			const [prefix, suffix] = key.split("*");
			if (specifier.startsWith(prefix)) {
				const replacer = resolvePackagePattern(manifest.content.imports[key], conditions);
				if (replacer) return noRecursive(replacePattern(replacer));
			}
			function replacePattern(replacer) {
				const toKeep = suffix ? specifier.slice(prefix.length, -suffix.length) : specifier.slice(prefix.length);
				return replacer.replace(/\*/g, toKeep);
			}
		}
	}
	throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(specifier, manifest.path, manifest.base);
}
function resolvePackagePattern(map, conditions) {
	if (typeof map === "string") return map;
	if (Array.isArray(map)) {
		for (const item of map) {
			const result = resolvePackagePattern(item, conditions);
			if (result) return result;
		}
		return;
	}
	for (const key of Object.keys(map)) if (conditions.has(key)) return resolvePackagePattern(map[key], conditions);
	return map.default;
}
function noRecursive(value) {
	assert(!value?.startsWith("#"), "recursive imports are not allowed");
	return value;
}
function getExpensionKeys(keys) {
	return keys.filter((k) => k.indexOf("*") >= 0).sort(patternKeyCompare);
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/resolve.js
/**
* @typedef {import('./request.js').Request} Request
*/
/**
* If a package wanted, they could provide a special export condition
* targeting REPLs.
*
* This format should still be ESM.
* CJS is not supported in browsers, and I won't support CJS in this REPL.
*/
var CONDITIONS = [
	"repl",
	"module",
	"browser",
	"import",
	"default",
	"development"
];
/**
* @type {Map<string, import('./types.ts').RequestAnswer>} specifier => filePath in the tgz
*/
var resolveCache = /* @__PURE__ */ new Map();
var AT = "___AT___";
var fakeProtocol = "repl://";
/**
*
* @param {*} start packageName or packageName with file
* @param {*} target file to resolve within the packageName
* @returns
*/
function resolvePath(start, target) {
	/**
	* How to make the whole package name look like one segment for URL
	*/
	const base = start.replace(/^@([^/]+)\/([^/]+)/, `${AT}$1___$2`);
	/**
	* href omits the protocol
	* (which is what we want)
	*/
	return new URL(target, fakeProtocol + fakeDomain + base).href.replace(fakeProtocol + fakeDomain, "").replace(AT, "@").replace("___", "/").replace(/^\//, "./");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function resolve(untarred, request) {
	let answer = void 0;
	const key = request.key;
	if (resolveCache.has(key)) return resolveCache.get(key);
	answer ||= fromImports(untarred, request, answer);
	answer ||= fromInternalImport(untarred, request, answer);
	answer ||= fromExportsString(untarred, request, answer);
	answer ||= fromExports(untarred, request, answer);
	answer ||= fromModule(untarred, request, answer);
	answer ||= fromBrowser(untarred, request, answer);
	answer ||= fromMain(untarred, request, answer);
	answer ||= fromIndex(untarred, request, answer);
	answer ||= fromFallback(untarred, request, answer);
	if (answer) resolveCache.set(key, answer);
	return answer;
}
/**
* These are likely all private imports
*
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromInternalImport(untarred, request, answer) {
	if (answer) return answer;
	if (!request.from) return answer;
	const fromSpecifier = request.from;
	const answerFrom = resolve(untarred, fromSpecifier);
	if (!answerFrom) {
		printError(untarred, fromSpecifier, answer);
		return;
	}
	const result = checkFile(untarred, resolvePath(fromSpecifier.name + "/" + answerFrom.inTarFile, request.to).replace(new RegExp(`^${fromSpecifier.name}/`), ""));
	if (result) return createAnswer(result, request, "internalImport");
	printError(untarred, request, answer);
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromExports(untarred, request, answer) {
	if (answer) return answer;
	if (!(typeof untarred.manifest.exports === "object")) return answer;
	const found = o(untarred.manifest, request.to, { conditions: CONDITIONS })?.map((f) => checkFile(untarred, f)).find(Boolean);
	if (found) return createAnswer(found, request, "exports");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromImports(untarred, request, answer) {
	if (answer) return answer;
	if (!request.to.startsWith("#")) return answer;
	if (!(typeof untarred.manifest.imports === "object")) return answer;
	const found = resolve$1({ content: untarred.manifest }, request.to, { conditions: CONDITIONS });
	if (found) return createAnswer(found.replace(/^\.\//, ""), request, "imports");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromExportsString(untarred, request, answer) {
	if (answer) return answer;
	if (!hasExports(untarred)) return answer;
	return checkLegacyEntry(untarred, request, "exports");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromModule(untarred, request, answer) {
	if (answer) return answer;
	if (hasExports(untarred)) return answer;
	return checkLegacyEntry(untarred, request, "module");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromBrowser(untarred, request, answer) {
	if (answer) return answer;
	if (hasExports(untarred)) return answer;
	return checkLegacyEntry(untarred, request, "browser");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromMain(untarred, request, answer) {
	if (answer) return answer;
	if (hasExports(untarred)) return answer;
	return checkLegacyEntry(untarred, request, "main");
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {string} entryName
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function checkLegacyEntry(untarred, request, entryName) {
	if (request.to !== ".") return;
	const filePath = untarred.manifest[entryName];
	if (!filePath || typeof filePath !== "string") return;
	const result = checkFile(untarred, filePath);
	if (result) return createAnswer(result, request, entryName);
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromIndex(untarred, request, answer) {
	if (answer) return answer;
	if (hasExports(untarred)) return answer;
	if (request.to === ".") {
		if (untarred.contents["index.js"]) return {
			inTarFile: "index.js",
			ext: "js",
			from: "index"
		};
	}
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | import('./types.ts').RequestAnswer} the in-tar path
*/
function fromFallback(untarred, request, answer) {
	if (answer) return answer;
	const result = checkFile(untarred, request.to);
	if (result) return createAnswer(result, request, "fallback");
}
/**
*
* @param {import('./types.ts').UntarredPackage} untarred
* @param {string | undefined} filePath
* @returns {string | undefined} the variant
*/
function checkFile(untarred, filePath) {
	if (!filePath) return;
	for (const prefix of ["", "pkg/"]) {
		const path = prefix + filePath;
		const dotless = prefix + filePath.replace(/^\.\//, "");
		if (untarred.contents[path]) return path;
		if (untarred.contents[dotless]) return dotless;
	}
}
/**
* @param {string} filePath
*/
function extName(filePath) {
	return filePath.split(".").pop();
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
*/
function hasExports(untarred) {
	return Boolean(untarred.manifest.exports);
}
/**
* @param {string} forFile
* @param {Request} request
* @param {string} fromMethod
*/
function createAnswer(forFile, request, fromMethod) {
	const ext = extName(forFile);
	assert$2(`All files must have an extension. This file (in ${request.name}) did not have an extension: ${forFile}`, ext);
	return {
		inTarFile: forFile,
		ext,
		from: fromMethod
	};
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {Request} request
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @throws {Error}
*/
function printError(untarred, request, answer) {
	const { name, exports, main, module, browser } = untarred.manifest;
	console.group(`${name} file info`);
	console.info(`${name} has these files: `, Object.keys(untarred.contents));
	console.info(`We searched for '${request.original}'`);
	console.info(`from: `, {
		exports,
		main,
		module,
		browser
	});
	console.info(`And found: `, answer);
	console.info(`The request was: `, request);
	console.groupEnd();
	debugger;
	throw new Error(`Could not find file for ${request.original}`);
}
var com = wrap(new Worker(new URL(
	/* @vite-ignore */
	"/carbon-components-ember/pr-previews/pr-924/assets/tar-worker-o9N7Cb6d.js",
	"" + import.meta.url
), {
	name: "Tar & NPM Downloader Worker",
	type: "module"
}));
/**
* @param {string} url request URL
* @returns {Promise<undefined | { code: string, ext: string }>}
*/
async function getFromTarball(url) {
	const key = url.replace(unzippedPrefix + "/", "");
	const request = cache.requestCache.get(key);
	assert$2(`Missing request for ${url}`, request);
	if (cache.fileCache.has(key)) return cache.fileCache.get(key);
	const data = await cache.cachedPromise(key, async () => {
		const answer = resolve(await com.getTar(request.name, request.version), request);
		if (!answer) throw new Error(`Could not find file for ${request.original}`);
		return {
			answer,
			name: request.name,
			version: request.version
		};
	});
	const result = getFile(await com.getTar(request.name, request.version), key, data.answer);
	assert$2(`Missing file for ${url}`, result);
	cache.fileCache.set(key, result);
	return result;
}
/**
* @param {import('./types.ts').UntarredPackage} untarred
* @param {string} key
* @param {undefined | import('./types.ts').RequestAnswer} answer
* @returns {undefined | { code: string, ext: string }}
*/
function getFile(untarred, key, answer) {
	const request = Request.fromRequestId(key);
	if (!answer) {
		printError(untarred, request, answer);
		return;
	}
	const { inTarFile, ext } = answer;
	const code = untarred.contents[inTarFile]?.text;
	if (!code) {
		printError(untarred, request, answer);
		return;
	}
	return {
		code,
		ext
	};
}
//#endregion
//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/index.js
/**
* @typedef {import("./types.ts").Options} Options
* @typedef {import('./types.ts').CompilerConfig} CompilerConfig
*/
assert$2(`There is no document. repl-sdk is meant to be ran in a browser`, globalThis.document);
var defaultFormats = Object.keys(compilers);
var defaults = { formats: compilers };
var Compiler = class {
	/** @type {Options} */
	#options;
	/**
	* Options may be passed to the compiler to add to its behavior.
	* @param {Partial<Options>} options
	*/
	constructor(options = defaults) {
		this.#options = Object.assign({}, defaults, options);
		STABLE_REFERENCE.resolve = this.#resolve;
		STABLE_REFERENCE.fetch = this.#fetch;
		window.addEventListener("unhandledrejection", this.#handleUnhandledRejection);
	}
	/**
	*
	* @param {HTMLElement} element
	* @param {any} options
	*/
	async createEditor(element, { text, format, handleUpdate, extensions }) {
		return cache.cachedPromise("codemirror", async () => {
			const { buildCodemirror } = await __vitePreload(async () => {
				const { buildCodemirror } = await import("./codemirror-B6HkAdne.js");
				return { buildCodemirror };
			}, __vite__mapDeps([30,1,2,31,5,17,7,3,8,4,27]));
			return buildCodemirror({
				element,
				text,
				format,
				extensions,
				handleUpdate,
				getLang: async (format) => {
					const [lang, flavor] = format.split("|");
					assert$2(`Could not determine 'lang' from format: ${format}`, lang);
					const loadLang = this.#resolveFormat(lang, flavor).codemirror?.lang;
					assert$2(`The compiler for '${format}' is missing its configuration for 'codemirror.lang'`, loadLang);
					return await loadLang();
				},
				getSupport: async (format) => {
					const [lang, flavor] = format.split("|");
					assert$2(`Could not determine 'lang' from format: ${format}`, lang);
					const loadSupport = this.#resolveFormat(lang, flavor).codemirror.support;
					return await loadSupport?.();
				}
			});
		});
	}
	/**
	* @param {PromiseRejectionEvent} e
	*/
	#handleUnhandledRejection = (e) => {
		let handled = false;
		for (const onUnhandled of this.#compilerOnUnhandled) {
			onUnhandled(e, (message) => {
				this.#announce("error", message);
				handled = true;
			});
			if (handled) break;
		}
		if (handled) return;
		this.#announce("error", errorMessage(e.reason));
	};
	/**
	* Order of preference
	* 1. manually resolved (from the caller)
	* 2. specified in the compiler config (to use CDN)
	* 3. download tarball from npm
	*    or resolve from already downloaded tarball
	*
	* NOTE: when we return a new URL, we want to collapse the parentURI
	*       so that we don't get compound query params in nested requests.
	*
	* @param {string} id
	* @param {string} parentUrl
	* @param {(id: string, parentUrl: string) => string} resolve
	* @returns {string}
	*/
	#resolve = (id, parentUrl, resolve) => {
		/**
		* We have to strip the query params because our manual resolving
		* doesn't use them -- but CDNs do
		*/
		const vanilla = deCDN(id);
		this.#announce("info", `Loading ${vanilla}`);
		this.#log("[resolve]", id, "from", parentUrl);
		if (this.#options.resolve?.[vanilla]) {
			this.#log(`[resolve] ${vanilla} found in manually specified resolver`);
			return `manual:${vanilla}`;
		}
		for (const compilerResolve of this.#compilerResolvers) {
			const result = compilerResolve(vanilla);
			if (result) {
				this.#log(`[resolve] ${vanilla} found in compiler config at ${result}.`);
				if (typeof result === "function") return `configured:${vanilla}`;
				return result;
			}
		}
		if (parentUrl.startsWith("file:///tgz.repl.sdk/") && (id.startsWith(".") || id.startsWith("#"))) return getTarRequestId({
			to: id,
			from: parentUrl
		});
		if (id.startsWith("https://")) return resolve(id, parentUrl);
		if (id.startsWith("blob:")) return resolve(id, parentUrl);
		if (id.startsWith(".")) return resolve(id, parentUrl);
		if (parentUrl.startsWith("https://") && parentUrl !== location.href) return resolve(id, parentUrl);
		if (parentUrl.startsWith("https://") && parentUrl.startsWith("/")) return resolve(id, parentUrl);
		if (id.startsWith("node:")) {
			this.#log(`Is known node module: ${id}. Grabbing polyfill`);
			if (id === "node:process") return prefix_tgz(`process`);
			if (id === "node:buffer") return prefix_tgz(`buffer`);
			if (id === "node:events") return prefix_tgz(`events`);
			if (id === "node:path") return prefix_tgz(`path-browser`);
			if (id === "node:util") return prefix_tgz(`util-browser`);
			if (id === "node:crypto") return prefix_tgz(`crypto-browserify`);
			if (id === "node:stream") return prefix_tgz(`stream-browserify`);
			if (id === "node:fs") return prefix_tgz(`browserify-fs`);
		}
		this.#log(`[resolve] ${id} not found, deferring to npmjs.com's provided tarball`);
		return getTarRequestId({
			to: id,
			from: parentUrl
		});
	};
	/**
	* @param {string} url
	* @param {RequestInit} options
	* @returns {Promise<Response>}
	*/
	#fetch = async (url, options) => {
		const mimeType = index_lite_default.getType(url) ?? "application/javascript";
		this.#log(`[fetch] attempting to fetch: ${url}. Assuming ${mimeType}`);
		if (url.startsWith("manual:")) {
			const name = url.replace(/^manual:/, "");
			this.#log("[fetch] resolved url in manually specified resolver", url);
			const result = await this.#resolveManually(name);
			assert$2(`Failed to resolve ${name}`, result);
			const blobContent = `const mod = window[Symbol.for('${secretKey}')].resolves?.['${name}'];\n\n\nif (!mod) { throw new Error('Could not resolve \`${name}\`. Does the module exist? ( checked ${url} )') }\n\n${Object.keys(result).map((exportName) => {
				if (exportName === "default") return `export default mod.default ?? mod;`;
				return `export const ${exportName} = mod.${exportName};`;
			}).join("\n")}
            `;
			const blob = new Blob(Array.from(blobContent), { type: mimeType });
			this.#log(`[fetch] returning blob mapping to manually resolved import for ${name}`);
			this.#announce("info", `Loaded ${name}`);
			return new Response(blob);
		}
		if (url.startsWith("configured:")) {
			const name = url.replace(/^configured:/, "");
			this.#log("[fetch] resolved url in a preconfigured (in the compiler config) specified resolver", url);
			let result;
			/**
			* Unlike the manual resolver, these are just functions per
			* id, they represent a way to get a module
			*/
			for (const compilerResolve of this.#compilerResolvers) {
				const fn = compilerResolve(name);
				if (fn) {
					this.#log(`[fetch] ${name} found in compiler config at ${result}.`);
					result = await fn();
				}
			}
			assert$2(`Failed to resolve ${name}`, result);
			cache.resolves[name] = result;
			const blobContent = `const mod = window[Symbol.for('${secretKey}')].resolves?.['${name}'];\n\n\nif (!mod) { throw new Error('Could not resolve \`${name}\`. Does the module exist? ( checked ${url} )') }\n\n${Object.keys(result).map((exportName) => {
				if (exportName === "default") return `export default mod.default ?? mod;`;
				return `export const ${exportName} = mod.${exportName};`;
			}).join("\n")}
            `;
			const blob = new Blob(Array.from(blobContent), { type: mimeType });
			this.#log(`[fetch] returning blob mapping to configured resolved import for ${name}`);
			this.#announce("info", `Loaded ${name}`);
			return new Response(blob);
		}
		if (url.startsWith("file:///tgz.repl.sdk/unzipped")) {
			this.#log("[fetch] resolved url via tgz resolver", url, options);
			const tarInfo = await getFromTarball(url);
			assert$2(`Could not find file for ${url}`, tarInfo);
			const { code, ext } = tarInfo;
			/**
			* We don't know if this code is completely ready to run in the browser yet, so we might need to run in through the compiler again
			*/
			const file = await this.#postProcess(code, ext);
			const type = index_lite_default.getType(ext);
			return new Response(new Blob([file], { type: type ?? "application/javascript" }));
		}
		if (url.startsWith("https://")) return fetch(url, options);
		this.#log("[fetch] fetching url", url, options);
		const response = await fetch(url, options);
		if (!response.ok) return response;
		const source = await response.text();
		this.#announce("info", `Loaded ${url}`);
		return new Response(new Blob([source], { type: "application/javascript" }));
	};
	/**
	* NOTE: this does not resolve compilers that are not loaded yet.
	* So there would be a bit of a race condition here if different compilers
	* were to have incompatible post-processing handlers.
	*
	* @param {string} text
	* @param {string} ext
	*/
	async #postProcess(text, ext) {
		let code = text;
		for (const compiler of this.#compilers) if (compiler.handlers?.[ext]) code = await compiler.handlers[ext](code);
		return code;
	}
	/**
	* @param {string} format
	* @param {string} text
	* @param {{ fileName?: string, flavor?: string, args?: Record<string, unknown>, [key: string]: unknown }} [ options ]
	* @returns {Promise<{ element: HTMLElement, destroy: () => void }>}
	*/
	async compile(format, text, options = {}) {
		this.#announce("info", `Compiling ${format}`);
		try {
			return await this.#compile(format, text, options);
		} catch (e) {
			this.#announce("error", errorMessage(e));
			this.#error(e);
			throw e;
		}
	}
	/**
	* @param {string} format
	* @param {string} text
	* @param {{ fileName?: string, flavor?: string, [key: string]: unknown }} [ options ]
	* @returns {Promise<{ element: HTMLElement, destroy: () => void }>}
	*/
	async #compile(format, text, options) {
		this.#log("[compile] idempotently installing es-module-shim");
		await __vitePreload(() => import("./es-module-shims-CVclpFi8.js"), __vite__mapDeps([32,15]));
		const opts = { ...options };
		opts.fileName ||= `dynamic.${format}`;
		this.#log("[compile] compiling");
		const compiler = await this.#getCompiler(format, opts.flavor);
		const compiled = await compiler.compile(text, opts);
		let compiledText = "export default \"failed to compile\"";
		let extras = { compiled: "" };
		if (typeof compiled === "string") {
			compiledText = compiled;
			extras = { compiled: compiledText };
		} else if (typeof compiled.compiled === "string") {
			const { compiled: text } = compiled;
			compiledText = text;
			extras = compiled;
		} else {
			/**
			* the compiler didn't return text, so we can skip import shimming
			*/
			let value = compiled;
			if ("compiled" in compiled) {
				value = compiled.compiled;
				extras = compiled;
			}
			return this.#render(compiler, value, {
				...extras,
				compiled: value,
				...opts.args ? { args: opts.args } : {}
			});
		}
		const { default: defaultExport } = await shimmedImport(
			/* @vite-ignore */
			textToBlobUrl(compiledText)
		);
		this.#log("[compile] preparing to render", defaultExport, extras);
		return this.#render(compiler, defaultExport, {
			...extras,
			...opts.args ? { args: opts.args } : {}
		});
	}
	#compilerCache = /* @__PURE__ */ new WeakMap();
	#compilers = /* @__PURE__ */ new Set();
	#compilerResolvers = /* @__PURE__ */ new Set();
	/**
	* @type {Set<(e: PromiseRejectionEvent, handle: (message: string) => void) => void>}
	*/
	#compilerOnUnhandled = /* @__PURE__ */ new Set();
	/**
	* @param {string} format
	* @param {string | undefined} flavor
	*/
	async #getCompiler(format, flavor) {
		const config = this.#resolveFormat(format, flavor);
		if (this.#compilerCache.has(config)) return this.#compilerCache.get(config);
		if (config.resolve) this.#compilerResolvers.add(config.resolve);
		if (config.onUnhandled) this.#compilerOnUnhandled.add(config.onUnhandled);
		const options = this.optionsFor(format, flavor);
		const compiler = await config.compiler(options, this.#nestedPublicAPI);
		this.#compilerCache.set(config, compiler);
		this.#compilers.add(compiler);
		return compiler;
	}
	/**
	* @param {string} format
	* @param {string | undefined} flavor
	* @returns {import('./types').CompilerConfig}
	*/
	#resolveFormat(format, flavor) {
		let config = this.#options.formats[format];
		assert$2(`${format} is not a configured format / extension. The currently configured formats are ${Object.keys(this.#options.formats).join(", ")}`, config);
		if (flavor && flavor in config) config = config[flavor];
		assert$2(`The config for ${format}${flavor ? ` (using flavor ${flavor})` : ""} is missing the 'compiler' function. It had keys: ${Object.keys(
			/** @type {any} */
			config
		)}. If this is a language with multiple flavors, make sure you specify the flavor.`, "compiler" in config);
		return config;
	}
	/**
	* @param {string} format
	* @param {string | undefined} flavor
	* @returns {{ [key: string]: unknown }}
	*/
	#resolveUserOptions(format, flavor) {
		let config = this.#options.options?.[format];
		if (!config) return {};
		if (flavor && flavor in config) config = config[flavor];
		return config ?? {};
	}
	/**
	* @param {import('./types.ts').Compiler} compiler
	* @param {string} whatToRender
	* @param {{ compiled: string } & Record<string, unknown>} extras
	* @returns {Promise<{ element: HTMLElement, destroy: () => void }>}
	*/
	async #render(compiler, whatToRender, extras) {
		this.#announce("info", "Rendering");
		const div = this.#createDiv();
		assert$2(`Cannot render falsey values. Did compilation succeed?`, whatToRender);
		const destroy = await compiler.render(div, whatToRender, extras, this.#nestedPublicAPI);
		await new Promise((resolve) => requestAnimationFrame(resolve));
		return {
			element: div,
			destroy: () => {
				if (destroy) return destroy();
			}
		};
	}
	/**
	* @param {string} format
	* @param {string | undefined} flavor
	*/
	optionsFor = (format, flavor) => {
		const { needsLiveMeta } = this.#resolveFormat(format, flavor);
		return {
			needsLiveMeta: needsLiveMeta ?? true,
			versions: this.#options.versions ?? {},
			...this.#resolveUserOptions(format, flavor) ?? {}
		};
	};
	static clearCache() {
		cache.clear();
	}
	/**
	* @param {string} name
	* @param {(name?: string) => Promise<undefined | object>} [fallback]
	* @returns {Promise<undefined | object>}
	*/
	#resolveManually = async (name, fallback) => {
		const existing = cache.resolves[name];
		if (existing) {
			this.#log("[#resolveManually]", name, "already resolved");
			return existing;
		}
		let result = await this.#options.resolve?.[name];
		if (!result) this.#log(`[#resolveManually] Could not resolve ${name}`);
		if (typeof result === "function") {
			if (!result) this.#log(`[#resolveManually] Value for ${name} is a function. Invoking.`);
			result = await result();
		}
		/**
		* Compiler-implementation-provided fallback takes precidence over
		* going through the shimmedImport / tgz / npm fallback.
		*/
		if (fallback) result = await fallback(name);
		cache.resolves[name] ||= await result;
		return result;
	};
	/**
	* @type {import('./types.ts').PublicMethods}
	*/
	#nestedPublicAPI = {
		/**
		* @param {'error' | 'info'} type
		* @param {string} message
		* @returns {void}
		*/
		announce: (type, message) => this.#announce(type, message),
		/**
		* @param {string} name
		* @param {(name?: string) => Promise<object | undefined>} [fallback]
		* @returns {Promise<object | undefined>}
		*/
		tryResolve: async (name, fallback) => {
			const existing = await this.#resolveManually(name, fallback);
			if (existing) {
				this.#log(name, "already resolved");
				return existing;
			}
			return await shimmedImport(name);
		},
		/**
		* @param {string[]} names
		* @param {(name?: string) => Promise<unknown>} [fallback]
		* @returns {Promise<unknown[]>}
		*/
		tryResolveAll: async (names, fallback) => {
			const results = await Promise.all(names.map((name) => {
				return this.#nestedPublicAPI.tryResolve(name);
			}));
			if (fallback) {
				/** @type {Record<string, Promise<unknown>>} */
				const morePromises = {};
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					const name = names[i];
					if (!result) {
						this.#warn(`Could not load ${name}. Trying fallback.`);
						morePromises[i] = fallback(name);
					}
				}
				await Promise.all(Object.values(morePromises));
				for (let i = 0; i < results.length; i++) {
					let result = results[i];
					if (!result && morePromises[i]) result = morePromises[i];
				}
			}
			return results;
		},
		/**
		* @param {Parameters<Compiler['compile']>} args
		*/
		compile: (...args) => this.compile(...args),
		/**
		* @param {Parameters<Compiler['optionsFor']>} args
		*/
		optionsFor: (...args) => this.optionsFor(...args),
		canCompile: (format, flavor) => {
			let config = this.#options.formats[format];
			if (!config) return {
				result: false,
				reason: `${format} is not a configured format / extension. The currently configured formats are ${Object.keys(this.#options.formats).join(", ")}`
			};
			if (flavor && flavor in config) config = config[flavor];
			if (!config) return {
				result: false,
				reason: `${format} for ${flavor} is not a configured format / extension. The currently configured formats are ${Object.keys(this.#options.formats).join(", ")}`
			};
			if ("compiler" in config) return { result: true };
			return {
				result: false,
				reason: `The config for ${format}${flavor ? ` (using flavor ${flavor})` : ""} is missing the 'compiler' function. It had keys: ${Object.keys(config)}. If this is a language with multiple flavors, make sure you specify the flavor.`
			};
		},
		getCompiler: (format, flavor) => this.#getCompiler(format, flavor),
		getAllowedFormats: () => Object.keys(this.#options.formats),
		getFlavorsFor: (format) => {
			const config = this.#options.formats[format];
			if (!config) return [];
			if (typeof config === "function") return [];
			if (typeof config === "object") return Object.keys(config);
			return [];
		}
	};
	#createDiv() {
		const div = document.createElement("div");
		div.setAttribute("data-repl-output", "");
		div.id = nextId();
		return div;
	}
	/**
	* @param {'error' | 'info'} type
	* @param {string} message
	*/
	#announce(type, message) {
		if (!this.#options?.on?.log) return;
		this.#options.on.log(type, message);
	}
	/**
	* @param {Parameters<typeof console.debug>} args
	*/
	#log(...args) {
		if (this.#options.logging) console.debug(...args);
	}
	/**
	* @param {Parameters<typeof console.warn>} args
	*/
	#warn(...args) {
		if (this.#options.logging) console.warn(...args);
	}
	/**
	* @param {Parameters<typeof console.error>} args
	*/
	#error(...args) {
		if (this.#options.logging) console.error(...args);
	}
	/**
	* @param {string} message
	*/
	announceError(message) {
		this.#announce("error", message);
	}
};
/**
* @param {string} text
*/
function textToBlobUrl(text) {
	const blob = new Blob([text], { type: "text/javascript" });
	return URL.createObjectURL(blob);
}
/**
* This should have happened at the beginning of the compile function.
* If this error is ever thrown, something goofy has happened, and it would be very unexpected.

* @param {...any[]} args
*/
function shimmedImport(...args) {
	if (!globalThis.importShim) throw new Error(`Could not find importShim. Has the REPL been set up correctly?`);
	return globalThis.importShim(
		/* @vite-ignore */
		...args
	);
}
/**
* CDNs will pre-process every file to make sure every import goes through them.
* We don't want this.
*
* @param {string} id
* @returns {string}
*/
function deCDN(id) {
	return id.split("?")[0];
}
//#endregion
export { defaultFormats as n, defaults as r, Compiler as t };
