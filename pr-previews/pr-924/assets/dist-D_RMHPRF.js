//#region ../node_modules/.pnpm/@ember+string@4.0.1/node_modules/@ember/string/dist/index.js
var Cache = class {
	constructor(limit, func, store) {
		this.limit = limit;
		this.func = func;
		this.store = store;
		this.size = 0;
		this.misses = 0;
		this.hits = 0;
		this.store = store || /* @__PURE__ */ new Map();
	}
	get(key) {
		let value = this.store.get(key);
		if (this.store.has(key)) {
			this.hits++;
			return this.store.get(key);
		} else {
			this.misses++;
			value = this.set(key, this.func(key));
		}
		return value;
	}
	set(key, value) {
		if (this.limit > this.size) {
			this.size++;
			this.store.set(key, value);
		}
		return value;
	}
	purge() {
		this.store.clear();
		this.size = 0;
		this.hits = 0;
		this.misses = 0;
	}
};
var STRINGS = {};
function setStrings(strings) {
	STRINGS = strings;
}
function getStrings() {
	return STRINGS;
}
function getString(name) {
	return STRINGS[name];
}
var STRING_DASHERIZE_REGEXP = /[ _]/g;
var STRING_DASHERIZE_CACHE = new Cache(1e3, (key) => decamelize(key).replace(STRING_DASHERIZE_REGEXP, "-"));
var STRING_CAMELIZE_REGEXP_1 = /(\-|\_|\.|\s)+(.)?/g;
var STRING_CAMELIZE_REGEXP_2 = /(^|\/)([A-Z])/g;
var CAMELIZE_CACHE = new Cache(1e3, (key) => key.replace(STRING_CAMELIZE_REGEXP_1, (_match, _separator, chr) => chr ? chr.toUpperCase() : "").replace(STRING_CAMELIZE_REGEXP_2, (match) => match.toLowerCase()));
var STRING_CLASSIFY_REGEXP_1 = /^(\-|_)+(.)?/;
var STRING_CLASSIFY_REGEXP_2 = /(.)(\-|\_|\.|\s)+(.)?/g;
var STRING_CLASSIFY_REGEXP_3 = /(^|\/|\.)([a-z])/g;
var CLASSIFY_CACHE = new Cache(1e3, (str) => {
	const replace1 = (_match, _separator, chr) => chr ? `_${chr.toUpperCase()}` : "";
	const replace2 = (_match, initialChar, _separator, chr) => initialChar + (chr ? chr.toUpperCase() : "");
	const parts = str.split("/");
	for (let i = 0; i < parts.length; i++) parts[i] = parts[i].replace(STRING_CLASSIFY_REGEXP_1, replace1).replace(STRING_CLASSIFY_REGEXP_2, replace2);
	return parts.join("/").replace(STRING_CLASSIFY_REGEXP_3, (match) => match.toUpperCase());
});
var STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
var STRING_UNDERSCORE_REGEXP_2 = /\-|\s+/g;
var UNDERSCORE_CACHE = new Cache(1e3, (str) => str.replace(STRING_UNDERSCORE_REGEXP_1, "$1_$2").replace(STRING_UNDERSCORE_REGEXP_2, "_").toLowerCase());
var STRING_CAPITALIZE_REGEXP = /(^|\/)([a-z\u00C0-\u024F])/g;
var CAPITALIZE_CACHE = new Cache(1e3, (str) => str.replace(STRING_CAPITALIZE_REGEXP, (match) => match.toUpperCase()));
var STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
var DECAMELIZE_CACHE = new Cache(1e3, (str) => str.replace(STRING_DECAMELIZE_REGEXP, "$1_$2").toLowerCase());
function w(str) {
	return str.split(/\s+/);
}
function decamelize(str) {
	return DECAMELIZE_CACHE.get(str);
}
function dasherize(str) {
	return STRING_DASHERIZE_CACHE.get(str);
}
function camelize(str) {
	return CAMELIZE_CACHE.get(str);
}
function classify(str) {
	return CLASSIFY_CACHE.get(str);
}
function underscore(str) {
	return UNDERSCORE_CACHE.get(str);
}
function capitalize(str) {
	return CAPITALIZE_CACHE.get(str);
}
//#endregion
export { camelize, capitalize, classify, dasherize, decamelize, getString, getStrings, setStrings, underscore, w };
