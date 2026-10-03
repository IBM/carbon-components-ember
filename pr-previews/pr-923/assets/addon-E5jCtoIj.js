//#region ../node_modules/.pnpm/ember-resolver@13.2.0/node_modules/ember-resolver/addon/string/cache.js
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
//#endregion
//#region ../node_modules/.pnpm/ember-resolver@13.2.0/node_modules/ember-resolver/addon/string/index.js
var STRING_DASHERIZE_REGEXP = /[ _]/g;
var STRING_DASHERIZE_CACHE = new Cache(1e3, (key) => decamelize(key).replace(STRING_DASHERIZE_REGEXP, "-"));
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
var STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
var DECAMELIZE_CACHE = new Cache(1e3, (str) => str.replace(STRING_DECAMELIZE_REGEXP, "$1_$2").toLowerCase());
/**
Converts a camelized string into all lower case separated by underscores.

```javascript
import { decamelize } from '@ember/string';

decamelize('innerHTML');          // 'inner_html'
decamelize('action_name');        // 'action_name'
decamelize('css-class-name');     // 'css-class-name'
decamelize('my favorite items');  // 'my favorite items'
```

@method decamelize
@param {String} str The string to decamelize.
@return {String} the decamelized string.
@public
*/
function decamelize(str) {
	return DECAMELIZE_CACHE.get(str);
}
/**
Replaces underscores, spaces, or camelCase with dashes.

```javascript
import { dasherize } from '@ember/string';

dasherize('innerHTML');                // 'inner-html'
dasherize('action_name');              // 'action-name'
dasherize('css-class-name');           // 'css-class-name'
dasherize('my favorite items');        // 'my-favorite-items'
dasherize('privateDocs/ownerInvoice';  // 'private-docs/owner-invoice'
```

@method dasherize
@param {String} str The string to dasherize.
@return {String} the dasherized string.
@public
*/
function dasherize(str) {
	return STRING_DASHERIZE_CACHE.get(str);
}
/**
Returns the UpperCamelCase form of a string.

```javascript
import { classify } from '@ember/string';

classify('innerHTML');                   // 'InnerHTML'
classify('action_name');                 // 'ActionName'
classify('css-class-name');              // 'CssClassName'
classify('my favorite items');           // 'MyFavoriteItems'
classify('private-docs/owner-invoice');  // 'PrivateDocs/OwnerInvoice'
```

@method classify
@param {String} str the string to classify
@return {String} the classified string
@public
*/
function classify(str) {
	return CLASSIFY_CACHE.get(str);
}
/**
More general than decamelize. Returns the lower\_case\_and\_underscored
form of a string.

```javascript
import { underscore } from '@ember/string';

underscore('innerHTML');                 // 'inner_html'
underscore('action_name');               // 'action_name'
underscore('css-class-name');            // 'css_class_name'
underscore('my favorite items');         // 'my_favorite_items'
underscore('privateDocs/ownerInvoice');  // 'private_docs/owner_invoice'
```

@method underscore
@param {String} str The string to underscore.
@return {String} the underscored string.
@public
*/
function underscore(str) {
	return UNDERSCORE_CACHE.get(str);
}
//#endregion
//#region ../node_modules/.pnpm/ember-resolver@13.2.0/node_modules/ember-resolver/addon/utils/class-factory.js
function classFactory(klass) {
	return { create(injections) {
		if (typeof klass.extend === "function") return klass.extend(injections);
		else return klass;
	} };
}
//#endregion
//#region ../node_modules/.pnpm/ember-resolver@13.2.0/node_modules/ember-resolver/addon/index.js
var ModuleRegistry = class {
	constructor(entries) {
		this._entries = entries || globalThis.requirejs.entries;
	}
	moduleNames() {
		return Object.keys(this._entries);
	}
	has(moduleName) {
		return moduleName in this._entries;
	}
	get(...args) {
		return globalThis.require(...args);
	}
};
/**
* This module defines a subclass of Ember.DefaultResolver that adds two
* important features:
*
*  1) The resolver makes the container aware of es6 modules via the AMD
*     output. The loader's _moduleEntries is consulted so that classes can be
*     resolved directly via the module loader, without needing a manual
*     `import`.
*  2) is able to provide injections to classes that implement `extend`
*     (as is typical with Ember).
*/
var Resolver = class {
	static moduleBasedResolver = true;
	moduleBasedResolver = true;
	_deprecatedPodModulePrefix = false;
	_normalizeCache = Object.create(null);
	static create(props) {
		return new this(props);
	}
	/**
	A listing of functions to test for moduleName's based on the provided
	`parsedName`. This allows easy customization of additional module based
	lookup patterns.
	@property moduleNameLookupPatterns
	@returns {Ember.Array}
	*/
	moduleNameLookupPatterns = [
		this.podBasedModuleName,
		this.podBasedComponentsInSubdir,
		this.mainModuleName,
		this.defaultModuleName,
		this.nestedColocationComponentModuleName
	];
	static withModules(explicitModules) {
		return class extends this {
			static explicitModules = explicitModules;
		};
	}
	constructor(props) {
		Object.assign(this, props);
		if (!this._moduleRegistry) {
			let explicitModules = this.constructor.explicitModules;
			if (explicitModules) this._moduleRegistry = {
				moduleNames() {
					return Object.keys(explicitModules);
				},
				has(name) {
					return Boolean(explicitModules[name]);
				},
				get(name) {
					return explicitModules[name];
				},
				addModules(modules) {
					explicitModules = Object.assign({}, explicitModules, modules);
				}
			};
			else {
				if (typeof globalThis.requirejs.entries === "undefined") globalThis.requirejs.entries = globalThis.requirejs._eak_seen;
				this._moduleRegistry = new ModuleRegistry();
			}
		}
		this.pluralizedTypes = this.pluralizedTypes || Object.create(null);
		if (!this.pluralizedTypes.config) this.pluralizedTypes.config = "config";
	}
	makeToString(factory, fullName) {
		return "" + this.namespace.modulePrefix + "@" + fullName + ":";
	}
	shouldWrapInClassFactory() {
		return false;
	}
	parseName(fullName) {
		if (fullName.parsedName === true) return fullName;
		let prefix, type, name;
		let fullNameParts = fullName.split("@");
		if (fullNameParts.length === 3) {
			if (fullNameParts[0].length === 0) {
				prefix = `@${fullNameParts[1]}`;
				let prefixParts = fullNameParts[2].split(":");
				type = prefixParts[0];
				name = prefixParts[1];
			} else {
				prefix = `@${fullNameParts[1]}`;
				type = fullNameParts[0].slice(0, -1);
				name = fullNameParts[2];
			}
			if (type === "template:components") {
				name = `components/${name}`;
				type = "template";
			}
		} else if (fullNameParts.length === 2) {
			let prefixParts = fullNameParts[0].split(":");
			if (prefixParts.length === 2) {
				if (prefixParts[1].length === 0) {
					type = prefixParts[0];
					name = `@${fullNameParts[1]}`;
				} else {
					prefix = prefixParts[1];
					type = prefixParts[0];
					name = fullNameParts[1];
				}
			} else {
				let nameParts = fullNameParts[1].split(":");
				prefix = fullNameParts[0];
				type = nameParts[0];
				name = nameParts[1];
			}
			if (type === "template" && prefix.lastIndexOf("components/", 0) === 0) {
				name = `components/${name}`;
				prefix = prefix.slice(11);
			}
		} else {
			fullNameParts = fullName.split(":");
			type = fullNameParts[0];
			name = fullNameParts[1];
		}
		let fullNameWithoutType = name;
		let root = this.namespace;
		return {
			parsedName: true,
			fullName,
			prefix: prefix || this.prefix({ type }),
			type,
			fullNameWithoutType,
			name,
			root,
			resolveMethodName: "resolve" + classify(type)
		};
	}
	resolveOther(parsedName) {
		assert("`modulePrefix` must be defined", this.namespace.modulePrefix);
		let normalizedModuleName = this.findModuleName(parsedName);
		if (normalizedModuleName) {
			let defaultExport = this._extractDefaultExport(normalizedModuleName, parsedName);
			if (defaultExport === void 0) throw new Error(` Expected to find: '${parsedName.fullName}' within '${normalizedModuleName}' but got 'undefined'. Did you forget to 'export default' within '${normalizedModuleName}'?`);
			if (this.shouldWrapInClassFactory(defaultExport, parsedName)) defaultExport = classFactory(defaultExport);
			return defaultExport;
		}
	}
	normalize(fullName) {
		return this._normalizeCache[fullName] || (this._normalizeCache[fullName] = this._normalize(fullName));
	}
	resolve(fullName) {
		if (fullName === "resolver:current") return { create: () => this };
		let parsedName = this.parseName(fullName);
		let resolveMethodName = parsedName.resolveMethodName;
		let resolved;
		if (typeof this[resolveMethodName] === "function") resolved = this[resolveMethodName](parsedName);
		if (resolved == null) resolved = this.resolveOther(parsedName);
		return resolved;
	}
	addModules(modules) {
		if (!this._moduleRegistry.addModules) throw new Error(`addModules is only supported when your Resolver has been configured to use static modules via Resolver.withModules()`);
		this._moduleRegistry.addModules(modules);
	}
	_normalize(fullName) {
		let split = fullName.split(":");
		if (split.length > 1) {
			let type = split[0];
			if (type === "component" || type === "helper" || type === "modifier" || type === "template" && split[1].indexOf("components/") === 0) return type + ":" + split[1].replace(/_/g, "-");
			else return type + ":" + dasherize(split[1].replace(/\./g, "/"));
		} else return fullName;
	}
	pluralize(type) {
		return this.pluralizedTypes[type] || (this.pluralizedTypes[type] = type + "s");
	}
	podBasedLookupWithPrefix(podPrefix, parsedName) {
		let fullNameWithoutType = parsedName.fullNameWithoutType;
		if (parsedName.type === "template") fullNameWithoutType = fullNameWithoutType.replace(/^components\//, "");
		return podPrefix + "/" + fullNameWithoutType + "/" + parsedName.type;
	}
	podBasedModuleName(parsedName) {
		let podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
		return this.podBasedLookupWithPrefix(podPrefix, parsedName);
	}
	podBasedComponentsInSubdir(parsedName) {
		let podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
		podPrefix = podPrefix + "/components";
		if (parsedName.type === "component" || /^components/.test(parsedName.fullNameWithoutType)) return this.podBasedLookupWithPrefix(podPrefix, parsedName);
	}
	resolveEngine(parsedName) {
		let engineModule = parsedName.fullNameWithoutType + "/engine";
		if (this._moduleRegistry.has(engineModule)) return this._extractDefaultExport(engineModule);
	}
	resolveRouteMap(parsedName) {
		let engineName = parsedName.fullNameWithoutType;
		let engineRoutesModule = engineName + "/routes";
		if (this._moduleRegistry.has(engineRoutesModule)) {
			let routeMap = this._extractDefaultExport(engineRoutesModule);
			assert(`The route map for ${engineName} should be wrapped by 'buildRoutes' before exporting.`, routeMap.isRouteMap);
			return routeMap;
		}
	}
	resolveTemplate(parsedName) {
		return this.resolveOther(parsedName);
	}
	mainModuleName(parsedName) {
		if (parsedName.fullNameWithoutType === "main") return parsedName.prefix + "/" + parsedName.type;
	}
	defaultModuleName(parsedName) {
		return parsedName.prefix + "/" + this.pluralize(parsedName.type) + "/" + parsedName.fullNameWithoutType;
	}
	nestedColocationComponentModuleName(parsedName) {
		if (parsedName.type === "component") return parsedName.prefix + "/" + this.pluralize(parsedName.type) + "/" + parsedName.fullNameWithoutType + "/index";
	}
	prefix(parsedName) {
		let tmpPrefix = this.namespace.modulePrefix;
		if (this.namespace[parsedName.type + "Prefix"]) tmpPrefix = this.namespace[parsedName.type + "Prefix"];
		return tmpPrefix;
	}
	findModuleName(parsedName) {
		let moduleNameLookupPatterns = this.moduleNameLookupPatterns;
		let moduleName;
		for (let index = 0, length = moduleNameLookupPatterns.length; index < length; index++) {
			let tmpModuleName = moduleNameLookupPatterns[index].call(this, parsedName);
			if (tmpModuleName) tmpModuleName = this.chooseModuleName(tmpModuleName);
			if (tmpModuleName && this._moduleRegistry.has(tmpModuleName)) moduleName = tmpModuleName;
			if (moduleName) return moduleName;
		}
	}
	chooseModuleName(moduleName) {
		let underscoredModuleName = underscore(moduleName);
		if (moduleName !== underscoredModuleName && this._moduleRegistry.has(moduleName) && this._moduleRegistry.has(underscoredModuleName)) throw new TypeError(`Ambiguous module names: '${moduleName}' and '${underscoredModuleName}'`);
		if (this._moduleRegistry.has(moduleName)) return moduleName;
		else if (this._moduleRegistry.has(underscoredModuleName)) return underscoredModuleName;
	}
	knownForType(type) {
		let moduleKeys = this._moduleRegistry.moduleNames();
		let items = Object.create(null);
		for (let index = 0, length = moduleKeys.length; index < length; index++) {
			let moduleName = moduleKeys[index];
			let fullname = this.translateToContainerFullname(type, moduleName);
			if (fullname) items[fullname] = true;
		}
		return items;
	}
	translateToContainerFullname(type, moduleName) {
		let prefix = this.prefix({ type });
		let podPrefix = prefix + "/";
		let podSuffix = "/" + type;
		let start = moduleName.indexOf(podPrefix);
		let end = moduleName.indexOf(podSuffix);
		if (start === 0 && end === moduleName.length - podSuffix.length && moduleName.length > podPrefix.length + podSuffix.length) return type + ":" + moduleName.slice(start + podPrefix.length, end);
		let pluralizedType = this.pluralize(type);
		let nonPodPrefix = prefix + "/" + pluralizedType + "/";
		if (moduleName.indexOf(nonPodPrefix) === 0 && moduleName.length > nonPodPrefix.length) return type + ":" + moduleName.slice(nonPodPrefix.length);
	}
	_extractDefaultExport(normalizedModuleName) {
		let module = this._moduleRegistry.get(normalizedModuleName, null, null, true);
		if (module && module["default"]) module = module["default"];
		return module;
	}
};
function assert(message, check) {
	if (!check) throw new Error(message);
}
//#endregion
export { Resolver as n, ModuleRegistry as t };
