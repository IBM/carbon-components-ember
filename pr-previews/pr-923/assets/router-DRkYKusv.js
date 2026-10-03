import { t as getOwner } from "./owner-DvxyMhs3.js";
import { M as computed, U as get } from "./core-D-L0f59Y.js";
import { g as run, h as once, l as cancel, y as scheduleOnce } from "./runloop-Dk0Nzu3h.js";
import { C as isTransitionAborted, D as prepareResult, E as merge, N as Promise$1, O as promiseLabel, S as isTransition, T as logAbort, _ as extractQueryParams, a as hasDefaultSerialize, b as isParam, c as getActiveTargetName, f as PARAMS_SYMBOL, g as UnrecognizedURLError, h as Transition, i as getRenderState, j as privatize, k as throwIfAborted, l as resemblesURL, m as STATE_SYMBOL, n as defaultSerialize, o as calculateCacheKey, p as QUERY_PARAMS_SYMBOL, r as getFullQueryParams, s as extractRouteArgs, u as shallowEqual, v as forEach, w as log, x as isPromise, y as getChangelist } from "./route-CA9vvjYs.js";
import { n as set } from "./property_set-BmAQ0MGK-CHPdMmpA.js";
import { t as EmberObject } from "./object-X4rDdm09.js";
import { t as Evented } from "./evented-Cnj-zNta.js";
import { t as A } from "./array-CAt176If.js";
import { t as typeOf } from "./type-of-ClAdfYwH.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/route-recognizer/index.js
var createObject = Object.create;
function createMap() {
	var map = createObject(null);
	map["__"] = void 0;
	delete map["__"];
	return map;
}
var Target = function Target(path, matcher, delegate) {
	this.path = path;
	this.matcher = matcher;
	this.delegate = delegate;
};
Target.prototype.to = function to(target, callback) {
	var delegate = this.delegate;
	if (delegate && delegate.willAddRoute) target = delegate.willAddRoute(this.matcher.target, target);
	this.matcher.add(this.path, target);
	if (callback) {
		if (callback.length === 0) throw new Error("You must have an argument in the function passed to `to`");
		this.matcher.addChild(this.path, target, callback, this.delegate);
	}
};
var Matcher = function Matcher(target) {
	this.routes = createMap();
	this.children = createMap();
	this.target = target;
};
Matcher.prototype.add = function add(path, target) {
	this.routes[path] = target;
};
Matcher.prototype.addChild = function addChild(path, target, callback, delegate) {
	var matcher = new Matcher(target);
	this.children[path] = matcher;
	var match = generateMatch(path, matcher, delegate);
	if (delegate && delegate.contextEntered) delegate.contextEntered(target, match);
	callback(match);
};
function generateMatch(startingPath, matcher, delegate) {
	function match(path, callback) {
		var fullPath = startingPath + path;
		if (callback) callback(generateMatch(fullPath, matcher, delegate));
		else return new Target(fullPath, matcher, delegate);
	}
	return match;
}
function addRoute(routeArray, path, handler) {
	var len = 0;
	for (var i = 0; i < routeArray.length; i++) len += routeArray[i].path.length;
	path = path.substr(len);
	var route = {
		path,
		handler
	};
	routeArray.push(route);
}
function eachRoute(baseRoute, matcher, callback, binding) {
	var routes = matcher.routes;
	var paths = Object.keys(routes);
	for (var i = 0; i < paths.length; i++) {
		var path = paths[i];
		var routeArray = baseRoute.slice();
		addRoute(routeArray, path, routes[path]);
		var nested = matcher.children[path];
		if (nested) eachRoute(routeArray, nested, callback, binding);
		else callback.call(binding, routeArray);
	}
}
var map = function(callback, addRouteCallback) {
	var matcher = new Matcher();
	callback(generateMatch("", matcher, this.delegate));
	eachRoute([], matcher, function(routes) {
		if (addRouteCallback) addRouteCallback(this, routes);
		else this.add(routes);
	}, this);
};
function normalizePath(path) {
	return path.split("/").map(normalizeSegment).join("/");
}
var SEGMENT_RESERVED_CHARS = /%|\//g;
function normalizeSegment(segment) {
	if (segment.length < 3 || segment.indexOf("%") === -1) return segment;
	return decodeURIComponent(segment).replace(SEGMENT_RESERVED_CHARS, encodeURIComponent);
}
var PATH_SEGMENT_ENCODINGS = /%(?:2(?:4|6|B|C)|3(?:B|D|A)|40)/g;
function encodePathSegment(str) {
	return encodeURIComponent(str).replace(PATH_SEGMENT_ENCODINGS, decodeURIComponent);
}
var escapeRegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
var isArray = Array.isArray;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function getParam(params, key) {
	if (typeof params !== "object" || params === null) throw new Error("You must pass an object as the second argument to `generate`.");
	if (!hasOwnProperty.call(params, key)) throw new Error("You must provide param `" + key + "` to `generate`.");
	var value = params[key];
	var str = typeof value === "string" ? value : "" + value;
	if (str.length === 0) throw new Error("You must provide a param `" + key + "`.");
	return str;
}
var eachChar = [];
eachChar[0] = function(segment, currentState) {
	var state = currentState;
	var value = segment.value;
	for (var i = 0; i < value.length; i++) {
		var ch = value.charCodeAt(i);
		state = state.put(ch, false, false);
	}
	return state;
};
eachChar[1] = function(_, currentState) {
	return currentState.put(47, true, true);
};
eachChar[2] = function(_, currentState) {
	return currentState.put(-1, false, true);
};
eachChar[4] = function(_, currentState) {
	return currentState;
};
var regex = [];
regex[0] = function(segment) {
	return segment.value.replace(escapeRegex, "\\$1");
};
regex[1] = function() {
	return "([^/]+)";
};
regex[2] = function() {
	return "(.+)";
};
regex[4] = function() {
	return "";
};
var generate = [];
generate[0] = function(segment) {
	return segment.value;
};
generate[1] = function(segment, params) {
	var value = getParam(params, segment.value);
	if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) return encodePathSegment(value);
	else return value;
};
generate[2] = function(segment, params) {
	return getParam(params, segment.value);
};
generate[4] = function() {
	return "";
};
var EmptyObject = Object.freeze({});
var EmptyArray = Object.freeze([]);
function parse(segments, route, types) {
	if (route.length > 0 && route.charCodeAt(0) === 47) route = route.substr(1);
	var parts = route.split("/");
	var names = void 0;
	var shouldDecodes = void 0;
	for (var i = 0; i < parts.length; i++) {
		var part = parts[i];
		var flags = 0;
		var type = 0;
		if (part === "") type = 4;
		else if (part.charCodeAt(0) === 58) type = 1;
		else if (part.charCodeAt(0) === 42) type = 2;
		else type = 0;
		flags = 2 << type;
		if (flags & 12) {
			part = part.slice(1);
			names = names || [];
			names.push(part);
			shouldDecodes = shouldDecodes || [];
			shouldDecodes.push((flags & 4) !== 0);
		}
		if (flags & 14) types[type]++;
		segments.push({
			type,
			value: normalizeSegment(part)
		});
	}
	return {
		names: names || EmptyArray,
		shouldDecodes: shouldDecodes || EmptyArray
	};
}
function isEqualCharSpec(spec, char, negate) {
	return spec.char === char && spec.negate === negate;
}
var State = function State(states, id, char, negate, repeat) {
	this.states = states;
	this.id = id;
	this.char = char;
	this.negate = negate;
	this.nextStates = repeat ? id : null;
	this.pattern = "";
	this._regex = void 0;
	this.handlers = void 0;
	this.types = void 0;
};
State.prototype.regex = function regex$1() {
	if (!this._regex) this._regex = new RegExp(this.pattern);
	return this._regex;
};
State.prototype.get = function get(char, negate) {
	var this$1$1 = this;
	var nextStates = this.nextStates;
	if (nextStates === null) return;
	if (isArray(nextStates)) for (var i = 0; i < nextStates.length; i++) {
		var child = this$1$1.states[nextStates[i]];
		if (isEqualCharSpec(child, char, negate)) return child;
	}
	else {
		var child$1 = this.states[nextStates];
		if (isEqualCharSpec(child$1, char, negate)) return child$1;
	}
};
State.prototype.put = function put(char, negate, repeat) {
	var state;
	if (state = this.get(char, negate)) return state;
	var states = this.states;
	state = new State(states, states.length, char, negate, repeat);
	states[states.length] = state;
	if (this.nextStates == null) this.nextStates = state.id;
	else if (isArray(this.nextStates)) this.nextStates.push(state.id);
	else this.nextStates = [this.nextStates, state.id];
	return state;
};
State.prototype.match = function match(ch) {
	var this$1$1 = this;
	var nextStates = this.nextStates;
	if (!nextStates) return [];
	var returned = [];
	if (isArray(nextStates)) for (var i = 0; i < nextStates.length; i++) {
		var child = this$1$1.states[nextStates[i]];
		if (isMatch(child, ch)) returned.push(child);
	}
	else {
		var child$1 = this.states[nextStates];
		if (isMatch(child$1, ch)) returned.push(child$1);
	}
	return returned;
};
function isMatch(spec, char) {
	return spec.negate ? spec.char !== char && spec.char !== -1 : spec.char === char || spec.char === -1;
}
function sortSolutions(states) {
	return states.sort(function(a, b) {
		var ref = a.types || [
			0,
			0,
			0
		];
		var astatics = ref[0];
		var adynamics = ref[1];
		var astars = ref[2];
		var ref$1 = b.types || [
			0,
			0,
			0
		];
		var bstatics = ref$1[0];
		var bdynamics = ref$1[1];
		var bstars = ref$1[2];
		if (astars !== bstars) return astars - bstars;
		if (astars) {
			if (astatics !== bstatics) return bstatics - astatics;
			if (adynamics !== bdynamics) return bdynamics - adynamics;
		}
		if (adynamics !== bdynamics) return adynamics - bdynamics;
		if (astatics !== bstatics) return bstatics - astatics;
		return 0;
	});
}
function recognizeChar(states, ch) {
	var nextStates = [];
	for (var i = 0, l = states.length; i < l; i++) {
		var state = states[i];
		nextStates = nextStates.concat(state.match(ch));
	}
	return nextStates;
}
var RecognizeResults = function RecognizeResults(queryParams) {
	this.length = 0;
	this.queryParams = queryParams || {};
};
RecognizeResults.prototype.splice = Array.prototype.splice;
RecognizeResults.prototype.slice = Array.prototype.slice;
RecognizeResults.prototype.push = Array.prototype.push;
function findHandler(state, originalPath, queryParams) {
	var handlers = state.handlers;
	var regex = state.regex();
	if (!regex || !handlers) throw new Error("state not initialized");
	var captures = originalPath.match(regex);
	var currentCapture = 1;
	var result = new RecognizeResults(queryParams);
	result.length = handlers.length;
	for (var i = 0; i < handlers.length; i++) {
		var handler = handlers[i];
		var names = handler.names;
		var shouldDecodes = handler.shouldDecodes;
		var params = EmptyObject;
		var isDynamic = false;
		if (names !== EmptyArray && shouldDecodes !== EmptyArray) for (var j = 0; j < names.length; j++) {
			isDynamic = true;
			var name = names[j];
			var capture = captures && captures[currentCapture++];
			if (params === EmptyObject) params = {};
			if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS && shouldDecodes[j]) params[name] = capture && decodeURIComponent(capture);
			else params[name] = capture;
		}
		result[i] = {
			handler: handler.handler,
			params,
			isDynamic
		};
	}
	return result;
}
function decodeQueryParamPart(part) {
	part = part.replace(/\+/gm, "%20");
	var result;
	try {
		result = decodeURIComponent(part);
	} catch (error) {
		result = "";
	}
	return result;
}
var RouteRecognizer = function RouteRecognizer() {
	this.names = createMap();
	var states = [];
	var state = new State(states, 0, -1, true, false);
	states[0] = state;
	this.states = states;
	this.rootState = state;
};
RouteRecognizer.prototype.add = function add(routes, options) {
	var currentState = this.rootState;
	var pattern = "^";
	var types = [
		0,
		0,
		0
	];
	var handlers = new Array(routes.length);
	var allSegments = [];
	var isEmpty = true;
	var j = 0;
	for (var i = 0; i < routes.length; i++) {
		var route = routes[i];
		var ref = parse(allSegments, route.path, types);
		var names = ref.names;
		var shouldDecodes = ref.shouldDecodes;
		for (; j < allSegments.length; j++) {
			var segment = allSegments[j];
			if (segment.type === 4) continue;
			isEmpty = false;
			currentState = currentState.put(47, false, false);
			pattern += "/";
			currentState = eachChar[segment.type](segment, currentState);
			pattern += regex[segment.type](segment);
		}
		handlers[i] = {
			handler: route.handler,
			names,
			shouldDecodes
		};
	}
	if (isEmpty) {
		currentState = currentState.put(47, false, false);
		pattern += "/";
	}
	currentState.handlers = handlers;
	currentState.pattern = pattern + "$";
	currentState.types = types;
	var name;
	if (typeof options === "object" && options !== null && options.as) name = options.as;
	if (name) this.names[name] = {
		segments: allSegments,
		handlers
	};
};
RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
	var route = this.names[name];
	if (!route) throw new Error("There is no route named " + name);
	var result = new Array(route.handlers.length);
	for (var i = 0; i < route.handlers.length; i++) {
		var handler = route.handlers[i];
		result[i] = handler;
	}
	return result;
};
RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
	return !!this.names[name];
};
RouteRecognizer.prototype.generate = function generate$1(name, params) {
	var route = this.names[name];
	var output = "";
	if (!route) throw new Error("There is no route named " + name);
	var segments = route.segments;
	for (var i = 0; i < segments.length; i++) {
		var segment = segments[i];
		if (segment.type === 4) continue;
		output += "/";
		output += generate[segment.type](segment, params);
	}
	if (output.charAt(0) !== "/") output = "/" + output;
	if (params && params.queryParams) output += this.generateQueryString(params.queryParams);
	return output;
};
RouteRecognizer.prototype.generateQueryString = function generateQueryString(params) {
	var pairs = [];
	var keys = Object.keys(params);
	keys.sort();
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var value = params[key];
		if (value == null) continue;
		var pair = encodeURIComponent(key);
		if (isArray(value)) for (var j = 0; j < value.length; j++) {
			var arrayPair = key + "[]=" + encodeURIComponent(value[j]);
			pairs.push(arrayPair);
		}
		else {
			pair += "=" + encodeURIComponent(value);
			pairs.push(pair);
		}
	}
	if (pairs.length === 0) return "";
	return "?" + pairs.join("&");
};
RouteRecognizer.prototype.parseQueryString = function parseQueryString(queryString) {
	var pairs = queryString.split("&");
	var queryParams = {};
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split("="), key = decodeQueryParamPart(pair[0]), keyLength = key.length, isArray = false, value = void 0;
		if (pair.length === 1) value = "true";
		else {
			if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
				isArray = true;
				key = key.slice(0, keyLength - 2);
				if (!queryParams[key]) queryParams[key] = [];
			}
			value = pair[1] ? decodeQueryParamPart(pair[1]) : "";
		}
		if (isArray) queryParams[key].push(value);
		else queryParams[key] = value;
	}
	return queryParams;
};
RouteRecognizer.prototype.recognize = function recognize(path) {
	var results;
	var states = [this.rootState];
	var queryParams = {};
	var isSlashDropped = false;
	var hashStart = path.indexOf("#");
	if (hashStart !== -1) path = path.substr(0, hashStart);
	var queryStart = path.indexOf("?");
	if (queryStart !== -1) {
		var queryString = path.substr(queryStart + 1, path.length);
		path = path.substr(0, queryStart);
		queryParams = this.parseQueryString(queryString);
	}
	if (path.charAt(0) !== "/") path = "/" + path;
	var originalPath = path;
	if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) path = normalizePath(path);
	else {
		path = decodeURI(path);
		originalPath = decodeURI(originalPath);
	}
	var pathLen = path.length;
	if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
		path = path.substr(0, pathLen - 1);
		originalPath = originalPath.substr(0, originalPath.length - 1);
		isSlashDropped = true;
	}
	for (var i = 0; i < path.length; i++) {
		states = recognizeChar(states, path.charCodeAt(i));
		if (!states.length) break;
	}
	var solutions = [];
	for (var i$1 = 0; i$1 < states.length; i$1++) if (states[i$1].handlers) solutions.push(states[i$1]);
	states = sortSolutions(solutions);
	var state = solutions[0];
	if (state && state.handlers) {
		if (isSlashDropped && state.pattern && state.pattern.slice(-5) === "(.+)$") originalPath = originalPath + "/";
		results = findHandler(state, originalPath, queryParams);
	}
	return results;
};
RouteRecognizer.VERSION = "0.3.4";
RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
RouteRecognizer.Normalizer = {
	normalizeSegment,
	normalizePath,
	encodePathSegment
};
RouteRecognizer.prototype.map = map;
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/dsl.js
var uuid = 0;
function isCallback(value) {
	return typeof value === "function";
}
var DSLImpl = class DSLImpl {
	parent;
	matches;
	enableLoadingSubstates;
	explicitIndex = false;
	options;
	constructor(name = null, options) {
		this.parent = name;
		this.enableLoadingSubstates = Boolean(options && options.enableLoadingSubstates);
		this.matches = [];
		this.options = options;
	}
	route(name, _options, _callback) {
		let options;
		let callback = null;
		let dummyErrorRoute = `/_unused_dummy_error_path_route_${name}/:error`;
		if (isCallback(_options)) {
			options = {};
			callback = _options;
		} else if (isCallback(_callback)) {
			options = _options;
			callback = _callback;
		} else options = _options || {};
		if (this.enableLoadingSubstates) {
			createRoute(this, `${name}_loading`, { resetNamespace: options.resetNamespace });
			createRoute(this, `${name}_error`, {
				resetNamespace: options.resetNamespace,
				path: dummyErrorRoute
			});
		}
		if (callback) {
			let fullName = getFullName(this, name, options.resetNamespace);
			let dsl = new DSLImpl(fullName, this.options);
			createRoute(dsl, "loading");
			createRoute(dsl, "error", { path: dummyErrorRoute });
			callback.call(dsl);
			createRoute(this, name, options, dsl.generate());
		} else createRoute(this, name, options);
	}
	push(url, name, callback, serialize) {
		let parts = name.split(".");
		if (this.options.engineInfo) {
			let localFullName = name.slice(this.options.engineInfo.fullName.length + 1);
			let routeInfo = Object.assign({ localFullName }, this.options.engineInfo);
			if (serialize) routeInfo.serializeMethod = serialize;
			this.options.addRouteForEngine(name, routeInfo);
		} else if (serialize) throw new Error(`Defining a route serializer on route '${name}' outside an Engine is not allowed.`);
		if (url === "" || url === "/" || parts[parts.length - 1] === "index") this.explicitIndex = true;
		this.matches.push(url, name, callback);
	}
	generate() {
		let dslMatches = this.matches;
		if (!this.explicitIndex) this.route("index", { path: "/" });
		return (match) => {
			for (let i = 0; i < dslMatches.length; i += 3) match(dslMatches[i]).to(dslMatches[i + 1], dslMatches[i + 2]);
		};
	}
	mount(_name, options = {}) {
		let engineRouteMap = this.options.resolveRouteMap(_name);
		let name = _name;
		if (options.as) name = options.as;
		let fullName = getFullName(this, name, options.resetNamespace);
		let engineInfo = {
			name: _name,
			instanceId: uuid++,
			mountPoint: fullName,
			fullName
		};
		let path = options.path;
		if (typeof path !== "string") path = `/${name}`;
		let callback;
		let dummyErrorRoute = `/_unused_dummy_error_path_route_${name}/:error`;
		if (engineRouteMap) {
			let shouldResetEngineInfo = false;
			let oldEngineInfo = this.options.engineInfo;
			if (oldEngineInfo) {
				shouldResetEngineInfo = true;
				this.options.engineInfo = engineInfo;
			}
			let optionsForChild = Object.assign({ engineInfo }, this.options);
			let childDSL = new DSLImpl(fullName, optionsForChild);
			createRoute(childDSL, "loading");
			createRoute(childDSL, "error", { path: dummyErrorRoute });
			engineRouteMap.class.call(childDSL);
			callback = childDSL.generate();
			if (shouldResetEngineInfo) this.options.engineInfo = oldEngineInfo;
		}
		let routeInfo = Object.assign({ localFullName: "application" }, engineInfo);
		if (this.enableLoadingSubstates) {
			let substateName = `${name}_loading`;
			let localFullName = `application_loading`;
			let routeInfo = Object.assign({ localFullName }, engineInfo);
			createRoute(this, substateName, { resetNamespace: options.resetNamespace });
			this.options.addRouteForEngine(substateName, routeInfo);
			substateName = `${name}_error`;
			localFullName = `application_error`;
			routeInfo = Object.assign({ localFullName }, engineInfo);
			createRoute(this, substateName, {
				resetNamespace: options.resetNamespace,
				path: dummyErrorRoute
			});
			this.options.addRouteForEngine(substateName, routeInfo);
		}
		this.options.addRouteForEngine(fullName, routeInfo);
		this.push(path, fullName, callback);
	}
};
function canNest(dsl) {
	return dsl.parent !== "application";
}
function getFullName(dsl, name, resetNamespace) {
	if (canNest(dsl) && resetNamespace !== true) return `${dsl.parent}.${name}`;
	else return name;
}
function createRoute(dsl, name, options = {}, callback) {
	let fullName = getFullName(dsl, name, options.resetNamespace);
	if (typeof options.path !== "string") options.path = `/${name}`;
	dsl.push(options.path, fullName, callback, options.serialize);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/lib/router_state.js
var RouterState = class {
	router;
	emberRouter;
	routerJsState;
	constructor(emberRouter, router, routerJsState) {
		this.emberRouter = emberRouter;
		this.router = router;
		this.routerJsState = routerJsState;
	}
	isActiveIntent(routeName, models, queryParams) {
		let state = this.routerJsState;
		if (!this.router.isActiveIntent(routeName, models, void 0, state)) return false;
		if (queryParams !== void 0 && Object.keys(queryParams).length > 0) {
			let visibleQueryParams = Object.assign({}, queryParams);
			this.emberRouter._prepareQueryParams(routeName, models, visibleQueryParams);
			return shallowEqual(visibleQueryParams, state.queryParams);
		}
		return true;
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/router_js/index.js
var ROUTE_INFOS = /* @__PURE__ */ new WeakMap();
function toReadOnlyRouteInfo(routeInfos, queryParams = {}, options = {
	includeAttributes: false,
	localizeMapUpdates: false
}) {
	const LOCAL_ROUTE_INFOS = /* @__PURE__ */ new WeakMap();
	return routeInfos.map((info, i) => {
		let { name, params, paramNames, context, route } = info;
		let key = info;
		if (ROUTE_INFOS.has(key) && options.includeAttributes) {
			let routeInfo = ROUTE_INFOS.get(key);
			routeInfo = attachMetadata(route, routeInfo);
			let routeInfoWithAttribute = createRouteInfoWithAttributes(routeInfo, context);
			LOCAL_ROUTE_INFOS.set(key, routeInfo);
			if (!options.localizeMapUpdates) ROUTE_INFOS.set(key, routeInfoWithAttribute);
			return routeInfoWithAttribute;
		}
		const routeInfosRef = options.localizeMapUpdates ? LOCAL_ROUTE_INFOS : ROUTE_INFOS;
		let routeInfo = {
			find(predicate, thisArg) {
				let publicInfo;
				let arr = [];
				if (predicate.length === 3) arr = routeInfos.map((info) => routeInfosRef.get(info));
				for (let i = 0; routeInfos.length > i; i++) {
					publicInfo = routeInfosRef.get(routeInfos[i]);
					if (predicate.call(thisArg, publicInfo, i, arr)) return publicInfo;
				}
			},
			get name() {
				return name;
			},
			get paramNames() {
				return paramNames;
			},
			get metadata() {
				return buildRouteInfoMetadata(info.route);
			},
			get parent() {
				let parent = routeInfos[i - 1];
				if (parent === void 0) return null;
				return routeInfosRef.get(parent);
			},
			get child() {
				let child = routeInfos[i + 1];
				if (child === void 0) return null;
				return routeInfosRef.get(child);
			},
			get localName() {
				let parts = this.name.split(".");
				return parts[parts.length - 1];
			},
			get params() {
				return params;
			},
			get queryParams() {
				return queryParams;
			}
		};
		if (options.includeAttributes) routeInfo = createRouteInfoWithAttributes(routeInfo, context);
		LOCAL_ROUTE_INFOS.set(info, routeInfo);
		if (!options.localizeMapUpdates) ROUTE_INFOS.set(info, routeInfo);
		return routeInfo;
	});
}
function createRouteInfoWithAttributes(routeInfo, context) {
	let attributes = { get attributes() {
		return context;
	} };
	if (!Object.isExtensible(routeInfo) || routeInfo.hasOwnProperty("attributes")) return Object.freeze(Object.assign({}, routeInfo, attributes));
	return Object.assign(routeInfo, attributes);
}
function buildRouteInfoMetadata(route) {
	if (route !== void 0 && route !== null && route.buildRouteInfoMetadata !== void 0) return route.buildRouteInfoMetadata();
	return null;
}
function attachMetadata(route, routeInfo) {
	let metadata = { get metadata() {
		return buildRouteInfoMetadata(route);
	} };
	if (!Object.isExtensible(routeInfo) || routeInfo.hasOwnProperty("metadata")) return Object.freeze(Object.assign({}, routeInfo, metadata));
	return Object.assign(routeInfo, metadata);
}
var InternalRouteInfo = class {
	_routePromise = void 0;
	_route = null;
	router;
	params = {};
	isResolved = false;
	constructor(router, name, paramNames, route) {
		this.name = name;
		this.paramNames = paramNames;
		this.router = router;
		if (route) this._processRoute(route);
	}
	getModel(_transition) {
		return Promise$1.resolve(this.context);
	}
	serialize(_context) {
		return this.params || {};
	}
	resolve(transition) {
		return Promise$1.resolve(this.routePromise).then((route) => {
			throwIfAborted(transition);
			return route;
		}).then(() => this.runBeforeModelHook(transition)).then(() => throwIfAborted(transition)).then(() => this.getModel(transition)).then((resolvedModel) => {
			throwIfAborted(transition);
			return resolvedModel;
		}).then((resolvedModel) => this.runAfterModelHook(transition, resolvedModel)).then((resolvedModel) => this.becomeResolved(transition, resolvedModel));
	}
	becomeResolved(transition, resolvedContext) {
		let params = this.serialize(resolvedContext);
		if (transition) {
			this.stashResolvedModel(transition, resolvedContext);
			transition[PARAMS_SYMBOL] = transition[PARAMS_SYMBOL] || {};
			transition[PARAMS_SYMBOL][this.name] = params;
		}
		let context;
		let contextsMatch = resolvedContext === this.context;
		if ("context" in this || !contextsMatch) context = resolvedContext;
		let cached = ROUTE_INFOS.get(this);
		let resolved = new ResolvedRouteInfo(this.router, this.name, this.paramNames, params, this.route, context);
		if (cached !== void 0) ROUTE_INFOS.set(resolved, cached);
		return resolved;
	}
	shouldSupersede(routeInfo) {
		if (!routeInfo) return true;
		let contextsMatch = routeInfo.context === this.context;
		return routeInfo.name !== this.name || "context" in this && !contextsMatch || this.hasOwnProperty("params") && !paramsMatch(this.params, routeInfo.params);
	}
	get route() {
		if (this._route !== null) return this._route;
		return this.fetchRoute();
	}
	set route(route) {
		this._route = route;
	}
	get routePromise() {
		if (this._routePromise) return this._routePromise;
		this.fetchRoute();
		return this._routePromise;
	}
	set routePromise(routePromise) {
		this._routePromise = routePromise;
	}
	log(transition, message) {
		if (transition.log) transition.log(this.name + ": " + message);
	}
	updateRoute(route) {
		route._internalName = this.name;
		return this.route = route;
	}
	runBeforeModelHook(transition) {
		if (transition.trigger) transition.trigger(true, "willResolveModel", transition, this.route);
		let result;
		if (this.route) {
			if (this.route.beforeModel !== void 0) result = this.route.beforeModel(transition);
		}
		if (isTransition(result)) result = null;
		return Promise$1.resolve(result);
	}
	runAfterModelHook(transition, resolvedModel) {
		let name = this.name;
		this.stashResolvedModel(transition, resolvedModel);
		let result;
		if (this.route !== void 0) {
			if (this.route.afterModel !== void 0) result = this.route.afterModel(resolvedModel, transition);
		}
		result = prepareResult(result);
		return Promise$1.resolve(result).then(() => {
			return transition.resolvedModels[name];
		});
	}
	stashResolvedModel(transition, resolvedModel) {
		transition.resolvedModels = transition.resolvedModels || {};
		transition.resolvedModels[this.name] = resolvedModel;
	}
	fetchRoute() {
		let route = this.router.getRoute(this.name);
		return this._processRoute(route);
	}
	_processRoute(route) {
		this.routePromise = Promise$1.resolve(route);
		if (isPromise(route)) {
			this.routePromise = this.routePromise.then((r) => {
				return this.updateRoute(r);
			});
			this.route = void 0;
			return;
		} else if (route) return this.updateRoute(route);
	}
};
var ResolvedRouteInfo = class extends InternalRouteInfo {
	isResolved;
	context;
	constructor(router, name, paramNames, params, route, context) {
		super(router, name, paramNames, route);
		this.params = params;
		this.isResolved = true;
		this.context = context;
	}
	resolve(transition) {
		if (transition && transition.resolvedModels) transition.resolvedModels[this.name] = this.context;
		return Promise$1.resolve(this);
	}
};
var UnresolvedRouteInfoByParam = class extends InternalRouteInfo {
	params = {};
	constructor(router, name, paramNames, params, route) {
		super(router, name, paramNames, route);
		if (params) this.params = params;
	}
	getModel(transition) {
		let fullParams = this.params;
		if (transition && transition[QUERY_PARAMS_SYMBOL]) {
			fullParams = {};
			merge(fullParams, this.params);
			fullParams["queryParams"] = transition[QUERY_PARAMS_SYMBOL];
		}
		let route = this.route;
		let result;
		if (route.deserialize) result = route.deserialize(fullParams, transition);
		else if (route.model) result = route.model(fullParams, transition);
		if (result && isTransition(result)) result = void 0;
		return Promise$1.resolve(result);
	}
};
var UnresolvedRouteInfoByObject = class extends InternalRouteInfo {
	serializer;
	constructor(router, name, paramNames, context) {
		super(router, name, paramNames);
		this.context = context;
		this.serializer = this.router.getSerializer(name);
	}
	getModel(transition) {
		if (this.router.log !== void 0) this.router.log(this.name + ": resolving provided model");
		return super.getModel(transition);
	}
	/**
	@private
	Serializes a route using its custom `serialize` method or
	by a default that looks up the expected property name from
	the dynamic segment.
	@param {Object} model the model to be serialized for this route
	*/
	serialize(model) {
		let { paramNames, context } = this;
		if (!model) model = context;
		let object = {};
		if (isParam(model)) {
			object[paramNames[0]] = model;
			return object;
		}
		if (this.serializer) return this.serializer.call(null, model, paramNames);
		else if (this.route !== void 0) {
			if (this.route.serialize) return this.route.serialize(model, paramNames);
		}
		if (paramNames.length !== 1) return;
		let name = paramNames[0];
		if (/_id$/.test(name)) object[name] = model.id;
		else object[name] = model;
		return object;
	}
};
function paramsMatch(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	for (let k in a) if (a.hasOwnProperty(k) && a[k] !== b[k]) return false;
	return true;
}
var TransitionIntent = class {
	data;
	router;
	constructor(router, data = {}) {
		this.router = router;
		this.data = data;
	}
	preTransitionState;
};
function handleError(currentState, transition, error) {
	let routeInfos = currentState.routeInfos;
	let errorHandlerIndex = transition.resolveIndex >= routeInfos.length ? routeInfos.length - 1 : transition.resolveIndex;
	let wasAborted = transition.isAborted;
	throw new TransitionError(error, currentState.routeInfos[errorHandlerIndex].route, wasAborted, currentState);
}
function resolveOneRouteInfo(currentState, transition) {
	if (transition.resolveIndex === currentState.routeInfos.length) return;
	let routeInfo = currentState.routeInfos[transition.resolveIndex];
	let callback = proceed.bind(null, currentState, transition);
	return routeInfo.resolve(transition).then(callback, null, currentState.promiseLabel("Proceed"));
}
function proceed(currentState, transition, resolvedRouteInfo) {
	let wasAlreadyResolved = currentState.routeInfos[transition.resolveIndex].isResolved;
	currentState.routeInfos[transition.resolveIndex++] = resolvedRouteInfo;
	if (!wasAlreadyResolved) {
		let { route } = resolvedRouteInfo;
		if (route !== void 0) {
			if (route.redirect) route.redirect(resolvedRouteInfo.context, transition);
		}
	}
	throwIfAborted(transition);
	return resolveOneRouteInfo(currentState, transition);
}
var TransitionState = class {
	routeInfos = [];
	queryParams = {};
	params = {};
	promiseLabel(label) {
		let targetName = "";
		forEach(this.routeInfos, function(routeInfo) {
			if (targetName !== "") targetName += ".";
			targetName += routeInfo.name;
			return true;
		});
		return promiseLabel("'" + targetName + "': " + label);
	}
	resolve(transition) {
		let params = this.params;
		forEach(this.routeInfos, (routeInfo) => {
			params[routeInfo.name] = routeInfo.params || {};
			return true;
		});
		transition.resolveIndex = 0;
		let callback = resolveOneRouteInfo.bind(null, this, transition);
		let errorHandler = handleError.bind(null, this, transition);
		return Promise$1.resolve(null, this.promiseLabel("Start transition")).then(callback, null, this.promiseLabel("Resolve route")).catch(errorHandler, this.promiseLabel("Handle error")).then(() => this);
	}
};
var TransitionError = class {
	constructor(error, route, wasAborted, state) {
		this.error = error;
		this.route = route;
		this.wasAborted = wasAborted;
		this.state = state;
	}
};
var NamedTransitionIntent = class extends TransitionIntent {
	name;
	pivotHandler;
	contexts;
	queryParams;
	preTransitionState = void 0;
	constructor(router, name, pivotHandler, contexts = [], queryParams = {}, data) {
		super(router, data);
		this.name = name;
		this.pivotHandler = pivotHandler;
		this.contexts = contexts;
		this.queryParams = queryParams;
	}
	applyToState(oldState, isIntermediate) {
		let handlers = this.router.recognizer.handlersFor(this.name);
		let targetRouteName = handlers[handlers.length - 1].handler;
		return this.applyToHandlers(oldState, handlers, targetRouteName, isIntermediate, false);
	}
	applyToHandlers(oldState, parsedHandlers, targetRouteName, isIntermediate, checkingIfActive) {
		let i, len;
		let newState = new TransitionState();
		let objects = this.contexts.slice(0);
		let invalidateIndex = parsedHandlers.length;
		if (this.pivotHandler) {
			for (i = 0, len = parsedHandlers.length; i < len; ++i) if (parsedHandlers[i].handler === this.pivotHandler._internalName) {
				invalidateIndex = i;
				break;
			}
		}
		for (i = parsedHandlers.length - 1; i >= 0; --i) {
			let result = parsedHandlers[i];
			let name = result.handler;
			let oldHandlerInfo = oldState.routeInfos[i];
			let newHandlerInfo = null;
			if (result.names.length > 0) {
				if (i >= invalidateIndex) newHandlerInfo = this.createParamHandlerInfo(name, result.names, objects, oldHandlerInfo);
				else newHandlerInfo = this.getHandlerInfoForDynamicSegment(name, result.names, objects, oldHandlerInfo, targetRouteName, i);
			} else newHandlerInfo = this.createParamHandlerInfo(name, result.names, objects, oldHandlerInfo);
			if (checkingIfActive) {
				newHandlerInfo = newHandlerInfo.becomeResolved(null, newHandlerInfo.context);
				let oldContext = oldHandlerInfo && oldHandlerInfo.context;
				if (result.names.length > 0 && oldHandlerInfo.context !== void 0 && newHandlerInfo.context === oldContext) newHandlerInfo.params = oldHandlerInfo && oldHandlerInfo.params;
				newHandlerInfo.context = oldContext;
			}
			let handlerToUse = oldHandlerInfo;
			if (i >= invalidateIndex || newHandlerInfo.shouldSupersede(oldHandlerInfo)) {
				invalidateIndex = Math.min(i, invalidateIndex);
				handlerToUse = newHandlerInfo;
			}
			if (isIntermediate && !checkingIfActive) handlerToUse = handlerToUse.becomeResolved(null, handlerToUse.context);
			newState.routeInfos.unshift(handlerToUse);
		}
		if (objects.length > 0) throw new Error("More context objects were passed than there are dynamic segments for the route: " + targetRouteName);
		if (!isIntermediate) this.invalidateChildren(newState.routeInfos, invalidateIndex);
		merge(newState.queryParams, this.queryParams || {});
		if (isIntermediate && oldState.queryParams) merge(newState.queryParams, oldState.queryParams);
		return newState;
	}
	invalidateChildren(handlerInfos, invalidateIndex) {
		for (let i = invalidateIndex, l = handlerInfos.length; i < l; ++i) if (handlerInfos[i].isResolved) {
			let { name, params, route, paramNames } = handlerInfos[i];
			handlerInfos[i] = new UnresolvedRouteInfoByParam(this.router, name, paramNames, params, route);
		}
	}
	getHandlerInfoForDynamicSegment(name, names, objects, oldHandlerInfo, _targetRouteName, i) {
		let objectToUse;
		if (objects.length > 0) {
			objectToUse = objects[objects.length - 1];
			if (isParam(objectToUse)) return this.createParamHandlerInfo(name, names, objects, oldHandlerInfo);
			else objects.pop();
		} else if (oldHandlerInfo && oldHandlerInfo.name === name) return oldHandlerInfo;
		else if (this.preTransitionState) objectToUse = this.preTransitionState.routeInfos[i]?.context;
		else return oldHandlerInfo;
		return new UnresolvedRouteInfoByObject(this.router, name, names, objectToUse);
	}
	createParamHandlerInfo(name, names, objects, oldHandlerInfo) {
		let params = {};
		let numNames = names.length;
		let missingParams = [];
		while (numNames--) {
			let oldParams = oldHandlerInfo && name === oldHandlerInfo.name && oldHandlerInfo.params || {};
			let peek = objects[objects.length - 1];
			let paramName = names[numNames];
			if (isParam(peek)) params[paramName] = String(objects.pop());
			else if (oldParams.hasOwnProperty(paramName)) params[paramName] = oldParams[paramName];
			else missingParams.push(paramName);
		}
		if (missingParams.length > 0) throw new Error(`You didn't provide enough string/numeric parameters to satisfy all of the dynamic segments for route ${name}. Missing params: ${missingParams}`);
		return new UnresolvedRouteInfoByParam(this.router, name, names, params);
	}
};
var URLTransitionIntent = class extends TransitionIntent {
	preTransitionState;
	url;
	constructor(router, url, data) {
		super(router, data);
		this.url = url;
		this.preTransitionState = void 0;
	}
	applyToState(oldState) {
		let newState = new TransitionState();
		let results = this.router.recognizer.recognize(this.url), i, len;
		if (!results) throw new UnrecognizedURLError(this.url);
		let statesDiffer = false;
		let _url = this.url;
		function checkHandlerAccessibility(handler) {
			if (handler && handler.inaccessibleByURL) throw new UnrecognizedURLError(_url);
			return handler;
		}
		for (i = 0, len = results.length; i < len; ++i) {
			let result = results[i];
			let name = result.handler;
			let paramNames = [];
			if (this.router.recognizer.hasRoute(name)) paramNames = this.router.recognizer.handlersFor(name)[i].names;
			let newRouteInfo = new UnresolvedRouteInfoByParam(this.router, name, paramNames, result.params);
			let route = newRouteInfo.route;
			if (route) checkHandlerAccessibility(route);
			else newRouteInfo.routePromise = newRouteInfo.routePromise.then(checkHandlerAccessibility);
			let oldRouteInfo = oldState.routeInfos[i];
			if (statesDiffer || newRouteInfo.shouldSupersede(oldRouteInfo)) {
				statesDiffer = true;
				newState.routeInfos[i] = newRouteInfo;
			} else newState.routeInfos[i] = oldRouteInfo;
		}
		merge(newState.queryParams, results.queryParams);
		return newState;
	}
};
var Router = class {
	_lastQueryParams = {};
	log;
	state = void 0;
	oldState = void 0;
	activeTransition = void 0;
	currentRouteInfos = void 0;
	_changedQueryParams = void 0;
	currentSequence = 0;
	recognizer;
	constructor(logger) {
		this.log = logger;
		this.recognizer = new RouteRecognizer();
		this.reset();
	}
	/**
	The main entry point into the router. The API is essentially
	the same as the `map` method in `route-recognizer`.
	This method extracts the String handler at the last `.to()`
	call and uses it as the name of the whole route.
	@param {Function} callback
	*/
	map(callback) {
		this.recognizer.map(callback, function(recognizer, routes) {
			for (let i = routes.length - 1, proceed = true; i >= 0 && proceed; --i) {
				let route = routes[i];
				let handler = route.handler;
				recognizer.add(routes, { as: handler });
				proceed = route.path === "/" || route.path === "" || handler.slice(-6) === ".index";
			}
		});
	}
	hasRoute(route) {
		return this.recognizer.hasRoute(route);
	}
	queryParamsTransition(changelist, wasTransitioning, oldState, newState) {
		this.fireQueryParamDidChange(newState, changelist);
		if (!wasTransitioning && this.activeTransition) return this.activeTransition;
		else {
			let newTransition = new Transition(this, void 0, void 0);
			newTransition.queryParamsOnly = true;
			oldState.queryParams = this.finalizeQueryParamChange(newState.routeInfos, newState.queryParams, newTransition);
			newTransition[QUERY_PARAMS_SYMBOL] = newState.queryParams;
			this.toReadOnlyInfos(newTransition, newState);
			this.routeWillChange(newTransition);
			newTransition.promise = newTransition.promise.then((result) => {
				if (!newTransition.isAborted) {
					this._updateURL(newTransition, oldState);
					this.didTransition(this.currentRouteInfos);
					this.toInfos(newTransition, newState.routeInfos, true);
					this.routeDidChange(newTransition);
				}
				return result;
			}, null, promiseLabel("Transition complete"));
			return newTransition;
		}
	}
	transitionByIntent(intent, isIntermediate) {
		try {
			return this.getTransitionByIntent(intent, isIntermediate);
		} catch (e) {
			return new Transition(this, intent, void 0, e, void 0);
		}
	}
	recognize(url) {
		let intent = new URLTransitionIntent(this, url);
		let newState = this.generateNewState(intent);
		if (newState === null) return newState;
		let readonlyInfos = toReadOnlyRouteInfo(newState.routeInfos, newState.queryParams, {
			includeAttributes: false,
			localizeMapUpdates: true
		});
		return readonlyInfos[readonlyInfos.length - 1];
	}
	recognizeAndLoad(url) {
		let intent = new URLTransitionIntent(this, url);
		let newState = this.generateNewState(intent);
		if (newState === null) return Promise$1.reject(`URL ${url} was not recognized`);
		let newTransition = new Transition(this, intent, newState, void 0);
		return newTransition.then(() => {
			let routeInfosWithAttributes = toReadOnlyRouteInfo(newState.routeInfos, newTransition[QUERY_PARAMS_SYMBOL], {
				includeAttributes: true,
				localizeMapUpdates: false
			});
			return routeInfosWithAttributes[routeInfosWithAttributes.length - 1];
		});
	}
	generateNewState(intent) {
		try {
			return intent.applyToState(this.state, false);
		} catch (_e) {
			return null;
		}
	}
	getTransitionByIntent(intent, isIntermediate) {
		let wasTransitioning = Boolean(this.activeTransition);
		let oldState = wasTransitioning ? this.activeTransition[STATE_SYMBOL] : this.state;
		let newTransition;
		let newState = intent.applyToState(oldState, isIntermediate);
		let queryParamChangelist = getChangelist(oldState.queryParams, newState.queryParams);
		if (routeInfosEqual(newState.routeInfos, oldState.routeInfos)) {
			if (queryParamChangelist) {
				if (!wasTransitioning) {
					let newTransition = this.queryParamsTransition(queryParamChangelist, wasTransitioning, oldState, newState);
					newTransition.queryParamsOnly = true;
					return newTransition;
				}
			} else return this.activeTransition || new Transition(this, void 0, void 0);
		}
		if (isIntermediate) {
			let transition = new Transition(this, void 0, newState);
			transition.isIntermediate = true;
			this.toReadOnlyInfos(transition, newState);
			this.setupContexts(newState, transition);
			this.routeWillChange(transition);
			return this.activeTransition;
		}
		newTransition = new Transition(this, intent, newState, void 0, this.activeTransition);
		if (routeInfosSameExceptQueryParams(newState.routeInfos, oldState.routeInfos)) newTransition.queryParamsOnly = true;
		this.toReadOnlyInfos(newTransition, newState);
		if (this.activeTransition) this.activeTransition.redirect(newTransition);
		this.activeTransition = newTransition;
		newTransition.promise = newTransition.promise.then((result) => {
			return this.finalizeTransition(newTransition, result);
		}, null, promiseLabel("Settle transition promise when transition is finalized"));
		if (!wasTransitioning) this.notifyExistingHandlers(newState, newTransition);
		this.fireQueryParamDidChange(newState, queryParamChangelist);
		return newTransition;
	}
	/**
	@private
	Begins and returns a Transition based on the provided
	arguments. Accepts arguments in the form of both URL
	transitions and named transitions.
	@param {Router} router
	@param {Array[Object]} args arguments passed to transitionTo,
	replaceWith, or handleURL
	*/
	doTransition(name, modelsArray = [], isIntermediate = false) {
		let lastArg = modelsArray[modelsArray.length - 1];
		let queryParams = {};
		if (lastArg && Object.prototype.hasOwnProperty.call(lastArg, "queryParams")) queryParams = modelsArray.pop().queryParams;
		let intent;
		if (name === void 0) {
			log(this, "Updating query params");
			let { routeInfos } = this.state;
			intent = new NamedTransitionIntent(this, routeInfos[routeInfos.length - 1].name, void 0, [], queryParams);
		} else if (name.charAt(0) === "/") {
			log(this, "Attempting URL transition to " + name);
			intent = new URLTransitionIntent(this, name);
		} else {
			log(this, "Attempting transition to " + name);
			intent = new NamedTransitionIntent(this, name, void 0, modelsArray, queryParams);
		}
		return this.transitionByIntent(intent, isIntermediate);
	}
	/**
	@private
	Updates the URL (if necessary) and calls `setupContexts`
	to update the router's array of `currentRouteInfos`.
	*/
	finalizeTransition(transition, newState) {
		try {
			log(transition.router, transition.sequence, "Resolved all models on destination route; finalizing transition.");
			let routeInfos = newState.routeInfos;
			this.setupContexts(newState, transition);
			if (transition.isAborted) {
				this.state.routeInfos = this.currentRouteInfos;
				return Promise$1.reject(logAbort(transition));
			}
			this._updateURL(transition, newState);
			transition.isActive = false;
			this.activeTransition = void 0;
			this.triggerEvent(this.currentRouteInfos, true, "didTransition", []);
			this.didTransition(this.currentRouteInfos);
			this.toInfos(transition, newState.routeInfos, true);
			this.routeDidChange(transition);
			log(this, transition.sequence, "TRANSITION COMPLETE.");
			return routeInfos[routeInfos.length - 1].route;
		} catch (e) {
			if (!isTransitionAborted(e)) {
				let infos = transition[STATE_SYMBOL].routeInfos;
				transition.trigger(true, "error", e, transition, infos[infos.length - 1].route);
				transition.abort();
			}
			throw e;
		}
	}
	/**
	@private
	Takes an Array of `RouteInfo`s, figures out which ones are
	exiting, entering, or changing contexts, and calls the
	proper route hooks.
	For example, consider the following tree of routes. Each route is
	followed by the URL segment it handles.
	```
	|~index ("/")
	| |~posts ("/posts")
	| | |-showPost ("/:id")
	| | |-newPost ("/new")
	| | |-editPost ("/edit")
	| |~about ("/about/:id")
	```
	Consider the following transitions:
	1. A URL transition to `/posts/1`.
	1. Triggers the `*model` callbacks on the
	`index`, `posts`, and `showPost` routes
	2. Triggers the `enter` callback on the same
	3. Triggers the `setup` callback on the same
	2. A direct transition to `newPost`
	1. Triggers the `exit` callback on `showPost`
	2. Triggers the `enter` callback on `newPost`
	3. Triggers the `setup` callback on `newPost`
	3. A direct transition to `about` with a specified
	context object
	1. Triggers the `exit` callback on `newPost`
	and `posts`
	2. Triggers the `serialize` callback on `about`
	3. Triggers the `enter` callback on `about`
	4. Triggers the `setup` callback on `about`
	@param {Router} transition
	@param {TransitionState} newState
	*/
	setupContexts(newState, transition) {
		let partition = this.partitionRoutes(this.state, newState);
		let i, l, route;
		for (i = 0, l = partition.exited.length; i < l; i++) {
			route = partition.exited[i].route;
			delete route.context;
			if (route !== void 0) {
				if (route._internalReset !== void 0) route._internalReset(true, transition);
				if (route.exit !== void 0) route.exit(transition);
			}
		}
		let oldState = this.oldState = this.state;
		this.state = newState;
		let currentRouteInfos = this.currentRouteInfos = partition.unchanged.slice();
		try {
			for (i = 0, l = partition.reset.length; i < l; i++) {
				route = partition.reset[i].route;
				if (route !== void 0) {
					if (route._internalReset !== void 0) route._internalReset(false, transition);
				}
			}
			for (i = 0, l = partition.updatedContext.length; i < l; i++) this.routeEnteredOrUpdated(currentRouteInfos, partition.updatedContext[i], false, transition);
			for (i = 0, l = partition.entered.length; i < l; i++) this.routeEnteredOrUpdated(currentRouteInfos, partition.entered[i], true, transition);
		} catch (e) {
			this.state = oldState;
			this.currentRouteInfos = oldState.routeInfos;
			throw e;
		}
		this.state.queryParams = this.finalizeQueryParamChange(currentRouteInfos, newState.queryParams, transition);
	}
	/**
	@private
	Fires queryParamsDidChange event
	*/
	fireQueryParamDidChange(newState, queryParamChangelist) {
		if (queryParamChangelist) {
			this._changedQueryParams = queryParamChangelist.all;
			this.triggerEvent(newState.routeInfos, true, "queryParamsDidChange", [
				queryParamChangelist.changed,
				queryParamChangelist.all,
				queryParamChangelist.removed
			]);
			this._changedQueryParams = void 0;
		}
	}
	/**
	@private
	Helper method used by setupContexts. Handles errors or redirects
	that may happen in enter/setup.
	*/
	routeEnteredOrUpdated(currentRouteInfos, routeInfo, enter, transition) {
		let route = routeInfo.route, context = routeInfo.context;
		function _routeEnteredOrUpdated(route) {
			if (enter) {
				if (route.enter !== void 0) route.enter(transition);
			}
			throwIfAborted(transition);
			route.context = context;
			if (route.contextDidChange !== void 0) route.contextDidChange();
			if (route.setup !== void 0) route.setup(context, transition);
			throwIfAborted(transition);
			currentRouteInfos.push(routeInfo);
			return route;
		}
		if (route === void 0) routeInfo.routePromise = routeInfo.routePromise.then(_routeEnteredOrUpdated);
		else _routeEnteredOrUpdated(route);
		return true;
	}
	/**
	@private
	This function is called when transitioning from one URL to
	another to determine which routes are no longer active,
	which routes are newly active, and which routes remain
	active but have their context changed.
	Take a list of old routes and new routes and partition
	them into four buckets:
	* unchanged: the route was active in both the old and
	new URL, and its context remains the same
	* updated context: the route was active in both the
	old and new URL, but its context changed. The route's
	`setup` method, if any, will be called with the new
	context.
	* exited: the route was active in the old URL, but is
	no longer active.
	* entered: the route was not active in the old URL, but
	is now active.
	The PartitionedRoutes structure has four fields:
	* `updatedContext`: a list of `RouteInfo` objects that
	represent routes that remain active but have a changed
	context
	* `entered`: a list of `RouteInfo` objects that represent
	routes that are newly active
	* `exited`: a list of `RouteInfo` objects that are no
	longer active.
	* `unchanged`: a list of `RouteInfo` objects that remain active.
	@param {Array[InternalRouteInfo]} oldRoutes a list of the route
	information for the previous URL (or `[]` if this is the
	first handled transition)
	@param {Array[InternalRouteInfo]} newRoutes a list of the route
	information for the new URL
	@return {Partition}
	*/
	partitionRoutes(oldState, newState) {
		let oldRouteInfos = oldState.routeInfos;
		let newRouteInfos = newState.routeInfos;
		let routes = {
			updatedContext: [],
			exited: [],
			entered: [],
			unchanged: [],
			reset: []
		};
		let routeChanged, contextChanged = false, i, l;
		for (i = 0, l = newRouteInfos.length; i < l; i++) {
			let oldRouteInfo = oldRouteInfos[i], newRouteInfo = newRouteInfos[i];
			if (!oldRouteInfo || oldRouteInfo.route !== newRouteInfo.route) routeChanged = true;
			if (routeChanged) {
				routes.entered.push(newRouteInfo);
				if (oldRouteInfo) routes.exited.unshift(oldRouteInfo);
			} else if (contextChanged || oldRouteInfo.context !== newRouteInfo.context) {
				contextChanged = true;
				routes.updatedContext.push(newRouteInfo);
			} else routes.unchanged.push(oldRouteInfo);
		}
		for (i = newRouteInfos.length, l = oldRouteInfos.length; i < l; i++) routes.exited.unshift(oldRouteInfos[i]);
		routes.reset = routes.updatedContext.slice();
		routes.reset.reverse();
		return routes;
	}
	_updateURL(transition, state) {
		let urlMethod = transition.urlMethod;
		if (!urlMethod) return;
		let { routeInfos } = state;
		let { name: routeName } = routeInfos[routeInfos.length - 1];
		let params = {};
		for (let i = routeInfos.length - 1; i >= 0; --i) {
			let routeInfo = routeInfos[i];
			merge(params, routeInfo.params);
			if (routeInfo.route.inaccessibleByURL) urlMethod = null;
		}
		if (urlMethod) {
			params["queryParams"] = transition._visibleQueryParams || state.queryParams;
			let url = this.recognizer.generate(routeName, params);
			let initial = transition.isCausedByInitialTransition;
			let replaceAndNotAborting = urlMethod === "replace" && !transition.isCausedByAbortingTransition;
			let isQueryParamsRefreshTransition = transition.queryParamsOnly && urlMethod === "replace";
			let replacingReplace = urlMethod === "replace" && transition.isCausedByAbortingReplaceTransition;
			if (initial || replaceAndNotAborting || isQueryParamsRefreshTransition || replacingReplace) this.replaceURL(url);
			else this.updateURL(url);
		}
	}
	finalizeQueryParamChange(resolvedHandlers, newQueryParams, transition) {
		for (let k in newQueryParams) if (newQueryParams.hasOwnProperty(k) && newQueryParams[k] === null) delete newQueryParams[k];
		let finalQueryParamsArray = [];
		this.triggerEvent(resolvedHandlers, true, "finalizeQueryParamChange", [
			newQueryParams,
			finalQueryParamsArray,
			transition
		]);
		if (transition) transition._visibleQueryParams = {};
		let finalQueryParams = {};
		for (let i = 0, len = finalQueryParamsArray.length; i < len; ++i) {
			let qp = finalQueryParamsArray[i];
			finalQueryParams[qp.key] = qp.value;
			if (transition && qp.visible !== false) transition._visibleQueryParams[qp.key] = qp.value;
		}
		return finalQueryParams;
	}
	toReadOnlyInfos(newTransition, newState) {
		let oldRouteInfos = this.state.routeInfos;
		this.fromInfos(newTransition, oldRouteInfos);
		this.toInfos(newTransition, newState.routeInfos);
		this._lastQueryParams = newState.queryParams;
	}
	fromInfos(newTransition, oldRouteInfos) {
		if (newTransition !== void 0 && oldRouteInfos.length > 0) {
			let fromInfos = toReadOnlyRouteInfo(oldRouteInfos, Object.assign({}, this._lastQueryParams), {
				includeAttributes: true,
				localizeMapUpdates: false
			});
			newTransition.from = fromInfos[fromInfos.length - 1] || null;
		}
	}
	toInfos(newTransition, newRouteInfos, includeAttributes = false) {
		if (newTransition !== void 0 && newRouteInfos.length > 0) {
			let toInfos = toReadOnlyRouteInfo(newRouteInfos, Object.assign({}, newTransition[QUERY_PARAMS_SYMBOL]), {
				includeAttributes,
				localizeMapUpdates: false
			});
			newTransition.to = toInfos[toInfos.length - 1] || null;
		}
	}
	notifyExistingHandlers(newState, newTransition) {
		let oldRouteInfos = this.state.routeInfos, i, oldRouteInfoLen, oldHandler, newRouteInfo;
		oldRouteInfoLen = oldRouteInfos.length;
		for (i = 0; i < oldRouteInfoLen; i++) {
			oldHandler = oldRouteInfos[i];
			newRouteInfo = newState.routeInfos[i];
			if (!newRouteInfo || oldHandler.name !== newRouteInfo.name) break;
			if (!newRouteInfo.isResolved);
		}
		this.triggerEvent(oldRouteInfos, true, "willTransition", [newTransition]);
		this.routeWillChange(newTransition);
		this.willTransition(oldRouteInfos, newState.routeInfos, newTransition);
	}
	/**
	Clears the current and target route routes and triggers exit
	on each of them starting at the leaf and traversing up through
	its ancestors.
	*/
	reset() {
		if (this.state) forEach(this.state.routeInfos.slice().reverse(), function(routeInfo) {
			let route = routeInfo.route;
			if (route !== void 0) {
				if (route.exit !== void 0) route.exit();
			}
			return true;
		});
		this.oldState = void 0;
		this.state = new TransitionState();
		this.currentRouteInfos = void 0;
	}
	/**
	let handler = routeInfo.handler;
	The entry point for handling a change to the URL (usually
	via the back and forward button).
	Returns an Array of handlers and the parameters associated
	with those parameters.
	@param {String} url a URL to process
	@return {Array} an Array of `[handler, parameter]` tuples
	*/
	handleURL(url) {
		if (url.charAt(0) !== "/") url = "/" + url;
		return this.doTransition(url).method(null);
	}
	/**
	Transition into the specified named route.
	If necessary, trigger the exit callback on any routes
	that are no longer represented by the target route.
	@param {String} name the name of the route
	*/
	transitionTo(name, ...contexts) {
		if (typeof name === "object") {
			contexts.push(name);
			return this.doTransition(void 0, contexts, false);
		}
		return this.doTransition(name, contexts);
	}
	intermediateTransitionTo(name, ...args) {
		return this.doTransition(name, args, true);
	}
	refresh(pivotRoute) {
		let previousTransition = this.activeTransition;
		let state = previousTransition ? previousTransition[STATE_SYMBOL] : this.state;
		let routeInfos = state.routeInfos;
		if (pivotRoute === void 0) pivotRoute = routeInfos[0].route;
		log(this, "Starting a refresh transition");
		let name = routeInfos[routeInfos.length - 1].name;
		let intent = new NamedTransitionIntent(this, name, pivotRoute, [], this._changedQueryParams || state.queryParams);
		let newTransition = this.transitionByIntent(intent, false);
		if (previousTransition && previousTransition.urlMethod === "replace") newTransition.method(previousTransition.urlMethod);
		return newTransition;
	}
	/**
	Identical to `transitionTo` except that the current URL will be replaced
	if possible.
	This method is intended primarily for use with `replaceState`.
	@param {String} name the name of the route
	*/
	replaceWith(name) {
		return this.doTransition(name).method("replace");
	}
	/**
	Take a named route and context objects and generate a
	URL.
	@param {String} name the name of the route to generate
	a URL for
	@param {...Object} objects a list of objects to serialize
	@return {String} a URL
	*/
	generate(routeName, ...args) {
		let partitionedArgs = extractQueryParams(args), suppliedParams = partitionedArgs[0], queryParams = partitionedArgs[1];
		let state = new NamedTransitionIntent(this, routeName, void 0, suppliedParams).applyToState(this.state, false);
		let params = {};
		for (let i = 0, len = state.routeInfos.length; i < len; ++i) {
			let routeParams = state.routeInfos[i].serialize();
			merge(params, routeParams);
		}
		params.queryParams = queryParams;
		return this.recognizer.generate(routeName, params);
	}
	applyIntent(routeName, contexts) {
		let intent = new NamedTransitionIntent(this, routeName, void 0, contexts);
		let state = this.activeTransition && this.activeTransition[STATE_SYMBOL] || this.state;
		return intent.applyToState(state, false);
	}
	isActiveIntent(routeName, contexts, queryParams, _state) {
		let state = _state || this.state, targetRouteInfos = state.routeInfos, routeInfo, len;
		if (!targetRouteInfos.length) return false;
		let targetHandler = targetRouteInfos[targetRouteInfos.length - 1].name;
		let recognizerHandlers = this.recognizer.handlersFor(targetHandler);
		let index = 0;
		for (len = recognizerHandlers.length; index < len; ++index) {
			routeInfo = targetRouteInfos[index];
			if (routeInfo.name === routeName) break;
		}
		if (index === recognizerHandlers.length) return false;
		let testState = new TransitionState();
		testState.routeInfos = targetRouteInfos.slice(0, index + 1);
		recognizerHandlers = recognizerHandlers.slice(0, index + 1);
		let routesEqual = routeInfosEqual(new NamedTransitionIntent(this, targetHandler, void 0, contexts).applyToHandlers(testState, recognizerHandlers, targetHandler, true, true).routeInfos, testState.routeInfos);
		if (!queryParams || !routesEqual) return routesEqual;
		let activeQPsOnNewHandler = {};
		merge(activeQPsOnNewHandler, queryParams);
		let activeQueryParams = state.queryParams;
		for (let key in activeQueryParams) if (activeQueryParams.hasOwnProperty(key) && activeQPsOnNewHandler.hasOwnProperty(key)) activeQPsOnNewHandler[key] = activeQueryParams[key];
		return routesEqual && !getChangelist(activeQPsOnNewHandler, queryParams);
	}
	isActive(routeName, ...args) {
		let [contexts, queryParams] = extractQueryParams(args);
		return this.isActiveIntent(routeName, contexts, queryParams);
	}
	trigger(name, ...args) {
		this.triggerEvent(this.currentRouteInfos, false, name, args);
	}
};
function routeInfosEqual(routeInfos, otherRouteInfos) {
	if (routeInfos.length !== otherRouteInfos.length) return false;
	for (let i = 0, len = routeInfos.length; i < len; ++i) if (routeInfos[i] !== otherRouteInfos[i]) return false;
	return true;
}
function routeInfosSameExceptQueryParams(routeInfos, otherRouteInfos) {
	if (routeInfos.length !== otherRouteInfos.length) return false;
	for (let i = 0, len = routeInfos.length; i < len; ++i) {
		if (routeInfos[i].name !== otherRouteInfos[i].name) return false;
		if (!paramsEqual(routeInfos[i].params, otherRouteInfos[i].params)) return false;
	}
	return true;
}
function paramsEqual(params, otherParams) {
	if (params === otherParams) return true;
	if (!params || !otherParams) return false;
	let keys = Object.keys(params);
	let otherKeys = Object.keys(otherParams);
	if (keys.length !== otherKeys.length) return false;
	for (let i = 0, len = keys.length; i < len; ++i) {
		let key = keys[i];
		if (params[key] !== otherParams[key]) return false;
	}
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/routing/router.js
/**
@module @ember/routing/router
*/
function defaultDidTransition(infos) {
	updatePaths(this);
	this._cancelSlowTransitionTimer();
	this.notifyPropertyChange("url");
	this.set("currentState", this.targetState);
}
function defaultWillTransition(oldInfos, newInfos) {}
function K() {
	return this;
}
var { slice } = Array.prototype;
/**
The `EmberRouter` class manages the application state and URLs. Refer to
the [routing guide](https://guides.emberjs.com/release/routing/) for documentation.

@class EmberRouter
@extends EmberObject
@uses Evented
@public
*/
var EmberRouter = class extends EmberObject.extend(Evented) {
	/**
	Represents the URL of the root of the application, often '/'. This prefix is
	assumed on all routes defined on this router.
	@property rootURL
	@default '/'
	@public
	*/
	/**
	The `location` property determines the type of URL's that your
	application will use.
	The following location types are currently available:
	* `history` - use the browser's history API to make the URLs look just like any standard URL
	* `hash` - use `#` to separate the server part of the URL from the Ember part: `/blog/#/posts/new`
	* `none` - do not store the Ember URL in the actual browser URL (mainly used for testing)
	* `auto` - use the best option based on browser capabilities: `history` if possible, then `hash` if possible, otherwise `none`
	This value is defaulted to `history` by the `locationType` setting of `/config/environment.js`
	@property location
	@default 'hash'
	@see {Location}
	@public
	*/
	_routerMicrolib;
	_didSetupRouter = false;
	_initialTransitionStarted = false;
	currentURL = null;
	currentRouteName = null;
	currentPath = null;
	currentRoute = null;
	_qpCache = Object.create(null);
	_qpUpdates = /* @__PURE__ */ new Set();
	_queuedQPChanges = {};
	_bucketCache;
	_toplevelView = null;
	_handledErrors = /* @__PURE__ */ new Set();
	_engineInstances = Object.create(null);
	_engineInfoByRoute = Object.create(null);
	_routerService;
	_slowTransitionTimer = null;
	namespace;
	static dslCallbacks;
	/**
	The `Router.map` function allows you to define mappings from URLs to routes
	in your application. These mappings are defined within the
	supplied callback function using `this.route`.
	The first parameter is the name of the route which is used by default as the
	path name as well.
	The second parameter is the optional options hash. Available options are:
	* `path`: allows you to provide your own path as well as mark dynamic
	segments.
	* `resetNamespace`: false by default; when nesting routes, ember will
	combine the route names to form the fully-qualified route name, which is
	used with `{{link-to}}` or manually transitioning to routes. Setting
	`resetNamespace: true` will cause the route not to inherit from its
	parent route's names. This is handy for preventing extremely long route names.
	Keep in mind that the actual URL path behavior is still retained.
	The third parameter is a function, which can be used to nest routes.
	Nested routes, by default, will have the parent route tree's route name and
	path prepended to it's own.
	```app/router.js
	Router.map(function(){
	this.route('post', { path: '/post/:post_id' }, function() {
	this.route('edit');
	this.route('comments', { resetNamespace: true }, function() {
	this.route('new');
	});
	});
	});
	```
	@method map
	@param callback
	@public
	*/
	static map(callback) {
		if (!this.dslCallbacks) {
			this.dslCallbacks = [];
			this.reopenClass({ dslCallbacks: this.dslCallbacks });
		}
		this.dslCallbacks.push(callback);
		return this;
	}
	static _routePath(routeInfos) {
		let path = [];
		function intersectionMatches(a1, a2) {
			for (let i = 0; i < a1.length; ++i) if (a1[i] !== a2[i]) return false;
			return true;
		}
		let name, nameParts, oldNameParts;
		for (let i = 1; i < routeInfos.length; i++) {
			name = routeInfos[i].name;
			nameParts = name.split(".");
			oldNameParts = slice.call(path);
			while (oldNameParts.length) {
				if (intersectionMatches(oldNameParts, nameParts)) break;
				oldNameParts.shift();
			}
			path.push(...nameParts.slice(oldNameParts.length));
		}
		return path.join(".");
	}
	constructor(owner) {
		super(owner);
		this._resetQueuedQueryParameterChanges();
		this.namespace = owner.lookup("application:main");
		let bucketCache = owner.lookup(privatize`-bucket-cache:main`);
		this._bucketCache = bucketCache;
		let routerService = owner.lookup("service:router");
		this._routerService = routerService;
	}
	_initRouterJs() {
		let location = get(this, "location");
		let router = this;
		const owner = getOwner(this);
		let seen = Object.create(null);
		class PrivateRouter extends Router {
			getRoute(name) {
				let routeName = name;
				let routeOwner = owner;
				let engineInfo = router._engineInfoByRoute[routeName];
				if (engineInfo) {
					routeOwner = router._getEngineInstance(engineInfo);
					routeName = engineInfo.localFullName;
				}
				let fullRouteName = `route:${routeName}`;
				let route = routeOwner.lookup(fullRouteName);
				if (seen[name]) return route;
				seen[name] = true;
				if (!route) {
					let DefaultRoute = routeOwner.factoryFor("route:basic").class;
					routeOwner.register(fullRouteName, class extends DefaultRoute {});
					route = routeOwner.lookup(fullRouteName);
				}
				route._setRouteName(routeName);
				if (engineInfo && !hasDefaultSerialize(route)) throw new Error("Defining a custom serialize method on an Engine route is not supported.");
				return route;
			}
			getSerializer(name) {
				let engineInfo = router._engineInfoByRoute[name];
				if (!engineInfo) return;
				return engineInfo.serializeMethod || defaultSerialize;
			}
			updateURL(path) {
				once(() => {
					location.setURL(path);
					set(router, "currentURL", path);
				});
			}
			didTransition(infos) {
				router.didTransition(infos);
			}
			willTransition(oldInfos, newInfos) {
				router.willTransition(oldInfos, newInfos);
			}
			triggerEvent(routeInfos, ignoreFailure, name, args) {
				return triggerEvent.bind(router)(routeInfos, ignoreFailure, name, args);
			}
			routeWillChange(transition) {
				router.trigger("routeWillChange", transition);
				router._routerService.trigger("routeWillChange", transition);
				if (transition.isIntermediate) router.set("currentRoute", transition.to);
			}
			routeDidChange(transition) {
				router.set("currentRoute", transition.to);
				once(() => {
					router.trigger("routeDidChange", transition);
					router._routerService.trigger("routeDidChange", transition);
				});
			}
			transitionDidError(error, transition) {
				if (error.wasAborted || transition.isAborted) return logAbort(transition);
				else {
					transition.trigger(false, "error", error.error, transition, error.route);
					if (router._isErrorHandled(error.error)) {
						transition.rollback();
						this.routeDidChange(transition);
						return error.error;
					} else {
						transition.abort();
						return error.error;
					}
				}
			}
			replaceURL(url) {
				if (location.replaceURL) {
					let doReplaceURL = () => {
						location.replaceURL(url);
						set(router, "currentURL", url);
					};
					once(doReplaceURL);
				} else this.updateURL(url);
			}
		}
		let routerMicrolib = this._routerMicrolib = new PrivateRouter();
		let dslCallbacks = this.constructor.dslCallbacks || [K];
		let dsl = this._buildDSL();
		dsl.route("application", {
			path: "/",
			resetNamespace: true,
			overrideNameAssertion: true
		}, function() {
			for (let i = 0; i < dslCallbacks.length; i++) dslCallbacks[i].call(this);
		});
		routerMicrolib.map(dsl.generate());
	}
	_buildDSL() {
		let enableLoadingSubstates = this._hasModuleBasedResolver();
		let router = this;
		const owner = getOwner(this);
		return new DSLImpl(null, {
			enableLoadingSubstates,
			resolveRouteMap(name) {
				return owner.factoryFor(`route-map:${name}`);
			},
			addRouteForEngine(name, engineInfo) {
				if (!router._engineInfoByRoute[name]) router._engineInfoByRoute[name] = engineInfo;
			}
		});
	}
	_resetQueuedQueryParameterChanges() {
		this._queuedQPChanges = {};
	}
	_hasModuleBasedResolver() {
		let owner = getOwner(this);
		let resolver = get(owner, "application.__registry__.resolver.moduleBasedResolver");
		return Boolean(resolver);
	}
	/**
	Initializes the current router instance and sets up the change handling
	event listeners used by the instances `location` implementation.
	A property named `initialURL` will be used to determine the initial URL.
	If no value is found `/` will be used.
	@method startRouting
	@private
	*/
	startRouting() {
		if (this.setupRouter()) {
			let initialURL = get(this, "initialURL");
			if (initialURL === void 0) initialURL = get(this, "location").getURL();
			let initialTransition = this.handleURL(initialURL);
			if (initialTransition && initialTransition.error) throw initialTransition.error;
		}
	}
	setupRouter() {
		if (this._didSetupRouter) return false;
		this._didSetupRouter = true;
		this._setupLocation();
		let location = get(this, "location");
		if (get(location, "cancelRouterSetup")) return false;
		this._initRouterJs();
		location.onUpdateURL((url) => {
			this.handleURL(url);
		});
		return true;
	}
	_setOutlets() {
		if (this.isDestroying || this.isDestroyed) return;
		let routeInfos = this._routerMicrolib.currentRouteInfos;
		if (!routeInfos) return;
		let root = null;
		let parent = null;
		for (let routeInfo of routeInfos) {
			let route = routeInfo.route;
			let render = getRenderState(route);
			if (render) {
				let state = {
					render,
					outlets: { main: void 0 }
				};
				if (parent) parent.outlets.main = state;
				else root = state;
				parent = state;
			} else break;
		}
		if (root === null) return;
		if (!this._toplevelView) {
			let owner = getOwner(this);
			let OutletView = owner.factoryFor("view:-outlet");
			let application = owner.lookup("application:main");
			let environment = owner.lookup("-environment:main");
			let template = owner.lookup("template:-outlet");
			this._toplevelView = OutletView.create({
				environment,
				template,
				application
			});
			this._toplevelView.setOutletState(root);
			owner.lookup("-application-instance:main").didCreateRootView(this._toplevelView);
		} else this._toplevelView.setOutletState(root);
	}
	handleURL(url) {
		let _url = url.split(/#(.+)?/)[0];
		return this._doURLTransition("handleURL", _url);
	}
	_doURLTransition(routerJsMethod, url) {
		this._initialTransitionStarted = true;
		let transition = this._routerMicrolib[routerJsMethod](url || "/");
		didBeginTransition(transition, this);
		return transition;
	}
	/**
	Transition the application into another route. The route may
	be either a single route or route path:
	@method transitionTo
	@param {String} [name] the name of the route or a URL
	@param {...Object} models the model(s) or identifier(s) to be used while
	transitioning to the route.
	@param {Object} [options] optional hash with a queryParams property
	containing a mapping of query parameters
	@return {Transition} the transition object associated with this
	attempted transition
	@public
	*/
	transitionTo(...args) {
		if (resemblesURL(args[0])) return this._doURLTransition("transitionTo", args[0]);
		let { routeName, models, queryParams } = extractRouteArgs(args);
		return this._doTransition(routeName, models, queryParams);
	}
	intermediateTransitionTo(name, ...args) {
		this._routerMicrolib.intermediateTransitionTo(name, ...args);
		updatePaths(this);
	}
	/**
	Similar to `transitionTo`, but instead of adding the destination to the browser's URL history,
	it replaces the entry for the current route.
	When the user clicks the "back" button in the browser, there will be fewer steps.
	This is most commonly used to manage redirects in a way that does not cause confusing additions
	to the user's browsing history.
	@method replaceWith
	@param {String} [name] the name of the route or a URL
	@param {...Object} models the model(s) or identifier(s) to be used while
	transitioning to the route.
	@param {Object} [options] optional hash with a queryParams property
	containing a mapping of query parameters
	@return {Transition} the transition object associated with this
	attempted transition
	@public
	*/
	replaceWith(...args) {
		return this.transitionTo(...args).method("replace");
	}
	generate(name, ...args) {
		let url = this._routerMicrolib.generate(name, ...args);
		return this.location.formatURL(url);
	}
	/**
	Determines if the supplied route is currently active.
	@method isActive
	@param routeName
	@return {Boolean}
	@private
	*/
	isActive(routeName) {
		return this._routerMicrolib.isActive(routeName);
	}
	/**
	An alternative form of `isActive` that doesn't require
	manual concatenation of the arguments into a single
	array.
	@method isActiveIntent
	@param routeName
	@param models
	@param queryParams
	@return {Boolean}
	@private
	@since 1.7.0
	*/
	isActiveIntent(routeName, models, queryParams) {
		return this.currentState.isActiveIntent(routeName, models, queryParams);
	}
	send(name, ...args) {
		this._routerMicrolib.trigger(name, ...args);
	}
	/**
	Does this router instance have the given route.
	@method hasRoute
	@return {Boolean}
	@private
	*/
	hasRoute(route) {
		return this._routerMicrolib.hasRoute(route);
	}
	/**
	Resets the state of the router by clearing the current route
	handlers and deactivating them.
	@private
	@method reset
	*/
	reset() {
		this._didSetupRouter = false;
		this._initialTransitionStarted = false;
		if (this._routerMicrolib) this._routerMicrolib.reset();
	}
	willDestroy() {
		if (this._toplevelView) {
			this._toplevelView.destroy();
			this._toplevelView = null;
		}
		super.willDestroy();
		this.reset();
		let instances = this._engineInstances;
		for (let name in instances) {
			let instanceMap = instances[name];
			for (let id in instanceMap) {
				let instance = instanceMap[id];
				run(instance, "destroy");
			}
		}
	}
	_activeQPChanged(queryParameterName, newValue) {
		this._queuedQPChanges[queryParameterName] = newValue;
		once(this, this._fireQueryParamTransition);
	}
	_updatingQPChanged(queryParameterName) {
		this._qpUpdates.add(queryParameterName);
	}
	_fireQueryParamTransition() {
		this.transitionTo({ queryParams: this._queuedQPChanges });
		this._resetQueuedQueryParameterChanges();
	}
	_setupLocation() {
		let location = this.location;
		let rootURL = this.rootURL;
		let owner = getOwner(this);
		if ("string" === typeof location) {
			let resolvedLocation = owner.lookup(`location:${location}`);
			location = set(this, "location", resolvedLocation);
		}
		if (location !== null && typeof location === "object") {
			if (rootURL) set(location, "rootURL", rootURL);
			if (typeof location.initState === "function") location.initState();
		}
	}
	/**
	Serializes the given query params according to their QP meta information.
	@private
	@method _serializeQueryParams
	@param {Arrray<RouteInfo>} routeInfos
	@param {Object} queryParams
	@return {Void}
	*/
	_serializeQueryParams(routeInfos, queryParams) {
		forEachQueryParam(this, routeInfos, queryParams, (key, value, qp) => {
			if (qp) {
				delete queryParams[key];
				queryParams[qp.urlKey] = qp.route.serializeQueryParam(value, qp.urlKey, qp.type);
			} else if (value === void 0) return;
			else queryParams[key] = this._serializeQueryParam(value, typeOf(value));
		});
	}
	/**
	Serializes the value of a query parameter based on a type
	@private
	@method _serializeQueryParam
	@param {Object} value
	@param {String} type
	*/
	_serializeQueryParam(value, type) {
		if (value === null || value === void 0) return value;
		else if (type === "array") return JSON.stringify(value);
		return `${value}`;
	}
	/**
	Deserializes the given query params according to their QP meta information.
	@private
	@method _deserializeQueryParams
	@param {Array<RouteInfo>} routeInfos
	@param {Object} queryParams
	@return {Void}
	*/
	_deserializeQueryParams(routeInfos, queryParams) {
		forEachQueryParam(this, routeInfos, queryParams, (key, value, qp) => {
			if (qp) {
				delete queryParams[key];
				queryParams[qp.prop] = qp.route.deserializeQueryParam(value, qp.urlKey, qp.type);
			}
		});
	}
	/**
	Deserializes the value of a query parameter based on a default type
	@private
	@method _deserializeQueryParam
	@param {Object} value
	@param {String} defaultType
	*/
	_deserializeQueryParam(value, defaultType) {
		if (value === null || value === void 0) return value;
		else if (defaultType === "boolean") return value === "true";
		else if (defaultType === "number") return Number(value).valueOf();
		else if (defaultType === "array") return A(JSON.parse(value));
		return value;
	}
	/**
	Removes (prunes) any query params with default values from the given QP
	object. Default values are determined from the QP meta information per key.
	@private
	@method _pruneDefaultQueryParamValues
	@param {Array<RouteInfo>} routeInfos
	@param {Object} queryParams
	@return {Void}
	*/
	_pruneDefaultQueryParamValues(routeInfos, queryParams) {
		let qps = this._queryParamsFor(routeInfos);
		for (let key in queryParams) {
			let qp = qps.map[key];
			if (qp && qp.serializedDefaultValue === queryParams[key]) delete queryParams[key];
		}
	}
	_doTransition(_targetRouteName, models, _queryParams, _fromRouterService) {
		let targetRouteName = _targetRouteName || getActiveTargetName(this._routerMicrolib);
		this._initialTransitionStarted = true;
		let queryParams = {};
		this._processActiveTransitionQueryParams(targetRouteName, models, queryParams, _queryParams);
		Object.assign(queryParams, _queryParams);
		this._prepareQueryParams(targetRouteName, models, queryParams, Boolean(_fromRouterService));
		let transition = this._routerMicrolib.transitionTo(targetRouteName, ...models, { queryParams });
		didBeginTransition(transition, this);
		return transition;
	}
	_processActiveTransitionQueryParams(targetRouteName, models, queryParams, _queryParams) {
		if (!this._routerMicrolib.activeTransition) return;
		let unchangedQPs = {};
		let qpUpdates = this._qpUpdates;
		let params = getFullQueryParams(this, this._routerMicrolib.activeTransition[STATE_SYMBOL]);
		for (let key in params) if (!qpUpdates.has(key)) unchangedQPs[key] = params[key];
		this._fullyScopeQueryParams(targetRouteName, models, _queryParams);
		this._fullyScopeQueryParams(targetRouteName, models, unchangedQPs);
		Object.assign(queryParams, unchangedQPs);
	}
	/**
	Prepares the query params for a URL or Transition. Restores any undefined QP
	keys/values, serializes all values, and then prunes any default values.
	@private
	@method _prepareQueryParams
	@param {String} targetRouteName
	@param {Array<Object>} models
	@param {Object} queryParams
	@param {boolean} keepDefaultQueryParamValues
	@return {Void}
	*/
	_prepareQueryParams(targetRouteName, models, queryParams, _fromRouterService) {
		let state = calculatePostTransitionState(this, targetRouteName, models);
		this._hydrateUnsuppliedQueryParams(state, queryParams, Boolean(_fromRouterService));
		this._serializeQueryParams(state.routeInfos, queryParams);
		if (!_fromRouterService) this._pruneDefaultQueryParamValues(state.routeInfos, queryParams);
	}
	/**
	Returns the meta information for the query params of a given route. This
	will be overridden to allow support for lazy routes.
	@private
	@method _getQPMeta
	@param {RouteInfo} routeInfo
	@return {Object}
	*/
	_getQPMeta(routeInfo) {
		let route = routeInfo.route;
		return route && get(route, "_qp");
	}
	/**
	Returns a merged query params meta object for a given set of routeInfos.
	Useful for knowing what query params are available for a given route hierarchy.
	@private
	@method _queryParamsFor
	@param {Array<RouteInfo>} routeInfos
	@return {Object}
	*/
	_queryParamsFor(routeInfos) {
		let leafRouteName = routeInfos[routeInfos.length - 1].name;
		let cached = this._qpCache[leafRouteName];
		if (cached !== void 0) return cached;
		let shouldCache = true;
		let map = {};
		let qps = [];
		let qpMeta;
		for (let routeInfo of routeInfos) {
			qpMeta = this._getQPMeta(routeInfo);
			if (!qpMeta) {
				shouldCache = false;
				continue;
			}
			for (let qp of qpMeta.qps) qps.push(qp);
			Object.assign(map, qpMeta.map);
		}
		let finalQPMeta = {
			qps,
			map
		};
		if (shouldCache) this._qpCache[leafRouteName] = finalQPMeta;
		return finalQPMeta;
	}
	/**
	Maps all query param keys to their fully scoped property name of the form
	`controllerName:propName`.
	@private
	@method _fullyScopeQueryParams
	@param {String} leafRouteName
	@param {Array<Object>} contexts
	@param {Object} queryParams
	@return {Void}
	*/
	_fullyScopeQueryParams(leafRouteName, contexts, queryParams) {
		let routeInfos = calculatePostTransitionState(this, leafRouteName, contexts).routeInfos;
		let qpMeta;
		for (let routeInfo of routeInfos) {
			qpMeta = this._getQPMeta(routeInfo);
			if (!qpMeta) continue;
			for (let qp of qpMeta.qps) {
				let presentProp = qp.prop in queryParams && qp.prop || qp.scopedPropertyName in queryParams && qp.scopedPropertyName || qp.urlKey in queryParams && qp.urlKey;
				if (presentProp) {
					if (presentProp !== qp.scopedPropertyName) {
						queryParams[qp.scopedPropertyName] = queryParams[presentProp];
						delete queryParams[presentProp];
					}
				}
			}
		}
	}
	/**
	Hydrates (adds/restores) any query params that have pre-existing values into
	the given queryParams hash. This is what allows query params to be "sticky"
	and restore their last known values for their scope.
	@private
	@method _hydrateUnsuppliedQueryParams
	@param {TransitionState} state
	@param {Object} queryParams
	@return {Void}
	*/
	_hydrateUnsuppliedQueryParams(state, queryParams, _fromRouterService) {
		let routeInfos = state.routeInfos;
		let appCache = this._bucketCache;
		let qpMeta;
		let qp;
		let presentProp;
		for (let routeInfo of routeInfos) {
			qpMeta = this._getQPMeta(routeInfo);
			if (!qpMeta) continue;
			for (let j = 0, qpLen = qpMeta.qps.length; j < qpLen; ++j) {
				qp = qpMeta.qps[j];
				presentProp = qp.prop in queryParams && qp.prop || qp.scopedPropertyName in queryParams && qp.scopedPropertyName || qp.urlKey in queryParams && qp.urlKey;
				if (presentProp) {
					if (presentProp !== qp.scopedPropertyName) {
						queryParams[qp.scopedPropertyName] = queryParams[presentProp];
						delete queryParams[presentProp];
					}
				} else {
					let cacheKey = calculateCacheKey(qp.route.fullRouteName, qp.parts, state.params);
					queryParams[qp.scopedPropertyName] = appCache.lookup(cacheKey, qp.prop, qp.defaultValue);
				}
			}
		}
	}
	_scheduleLoadingEvent(transition, originRoute) {
		this._cancelSlowTransitionTimer();
		this._slowTransitionTimer = scheduleOnce("routerTransitions", this, this._handleSlowTransition, transition, originRoute);
	}
	currentState = null;
	targetState = null;
	_handleSlowTransition(transition, originRoute) {
		if (!this._routerMicrolib.activeTransition) return;
		let targetState = new RouterState(this, this._routerMicrolib, this._routerMicrolib.activeTransition[STATE_SYMBOL]);
		this.set("targetState", targetState);
		transition.trigger(true, "loading", transition, originRoute);
	}
	_cancelSlowTransitionTimer() {
		if (this._slowTransitionTimer) cancel(this._slowTransitionTimer);
		this._slowTransitionTimer = null;
	}
	_markErrorAsHandled(error) {
		this._handledErrors.add(error);
	}
	_isErrorHandled(error) {
		return this._handledErrors.has(error);
	}
	_clearHandledError(error) {
		this._handledErrors.delete(error);
	}
	_getEngineInstance({ name, instanceId, mountPoint }) {
		let engineInstances = this._engineInstances;
		let namedInstances = engineInstances[name];
		if (!namedInstances) {
			namedInstances = Object.create(null);
			engineInstances[name] = namedInstances;
		}
		let engineInstance = namedInstances[instanceId];
		if (!engineInstance) {
			engineInstance = getOwner(this).buildChildEngineInstance(name, {
				routable: true,
				mountPoint
			});
			engineInstance.boot();
			namedInstances[instanceId] = engineInstance;
		}
		return engineInstance;
	}
};
function forEachRouteAbove(routeInfos, callback) {
	for (let i = routeInfos.length - 1; i >= 0; --i) {
		let routeInfo = routeInfos[i];
		let route = routeInfo.route;
		if (route === void 0) continue;
		if (callback(route, routeInfo) !== true) return;
	}
}
var defaultActionHandlers = {
	willResolveModel(_routeInfos, transition, originRoute) {
		this._scheduleLoadingEvent(transition, originRoute);
	},
	error(routeInfos, error, transition) {
		let router = this;
		let routeInfoWithError = routeInfos[routeInfos.length - 1];
		forEachRouteAbove(routeInfos, (route, routeInfo) => {
			if (routeInfo !== routeInfoWithError) {
				let errorRouteName = findRouteStateName(route, "error");
				if (errorRouteName) {
					router._markErrorAsHandled(error);
					router.intermediateTransitionTo(errorRouteName, error);
					return false;
				}
			}
			let errorSubstateName = findRouteSubstateName(route, "error");
			if (errorSubstateName) {
				router._markErrorAsHandled(error);
				router.intermediateTransitionTo(errorSubstateName, error);
				return false;
			}
			return true;
		});
		logError(error, `Error while processing route: ${transition.targetName}`);
	},
	loading(routeInfos, transition) {
		let router = this;
		let routeInfoWithSlowLoading = routeInfos[routeInfos.length - 1];
		forEachRouteAbove(routeInfos, (route, routeInfo) => {
			if (routeInfo !== routeInfoWithSlowLoading) {
				let loadingRouteName = findRouteStateName(route, "loading");
				if (loadingRouteName) {
					router.intermediateTransitionTo(loadingRouteName);
					return false;
				}
			}
			let loadingSubstateName = findRouteSubstateName(route, "loading");
			if (loadingSubstateName) {
				router.intermediateTransitionTo(loadingSubstateName);
				return false;
			}
			return transition.pivotHandler !== route;
		});
	}
};
function logError(_error, initialMessage) {
	let errorArgs = [];
	let error;
	if (_error && typeof _error === "object" && typeof _error.errorThrown === "object") error = _error.errorThrown;
	else error = _error;
	if (initialMessage) errorArgs.push(initialMessage);
	if (error) {
		if (error.message) errorArgs.push(error.message);
		if (error.stack) errorArgs.push(error.stack);
		if (typeof error === "string") errorArgs.push(error);
	}
	console.error(...errorArgs);
}
/**
Finds the name of the substate route if it exists for the given route. A
substate route is of the form `route_state`, such as `foo_loading`.

@private
@param {Route} route
@param {String} state
@return {String}
*/
function findRouteSubstateName(route, state) {
	let owner = getOwner(route);
	let { routeName, fullRouteName, _router: router } = route;
	let substateName = `${routeName}_${state}`;
	let substateNameFull = `${fullRouteName}_${state}`;
	return routeHasBeenDefined(owner, router, substateName, substateNameFull) ? substateNameFull : "";
}
/**
Finds the name of the state route if it exists for the given route. A state
route is of the form `route.state`, such as `foo.loading`. Properly Handles
`application` named routes.

@private
@param {Route} route
@param {String} state
@return {String}
*/
function findRouteStateName(route, state) {
	let owner = getOwner(route);
	let { routeName, fullRouteName, _router: router } = route;
	let stateName = routeName === "application" ? state : `${routeName}.${state}`;
	let stateNameFull = fullRouteName === "application" ? state : `${fullRouteName}.${state}`;
	return routeHasBeenDefined(owner, router, stateName, stateNameFull) ? stateNameFull : "";
}
/**
Determines whether or not a route has been defined by checking that the route
is in the Router's map and the owner has a registration for that route.

@private
@param {Owner} owner
@param {Router} router
@param {String} localName
@param {String} fullName
@return {Boolean}
*/
function routeHasBeenDefined(owner, router, localName, fullName) {
	let routerHasRoute = router.hasRoute(fullName);
	let ownerHasRoute = owner.factoryFor(`template:${localName}`) || owner.factoryFor(`route:${localName}`);
	return routerHasRoute && ownerHasRoute;
}
function triggerEvent(routeInfos, ignoreFailure, name, args) {
	if (!routeInfos) {
		if (ignoreFailure) return;
		throw new Error(`Can't trigger action '${name}' because your app hasn't finished transitioning into its first route. To trigger an action on destination routes during a transition, you can call \`.send()\` on the \`Transition\` object passed to the \`model/beforeModel/afterModel\` hooks.`);
	}
	let eventWasHandled = false;
	let routeInfo, handler, actionHandler;
	for (let i = routeInfos.length - 1; i >= 0; i--) {
		routeInfo = routeInfos[i];
		handler = routeInfo.route;
		actionHandler = handler && handler.actions && handler.actions[name];
		if (actionHandler) {
			if (actionHandler.apply(handler, args) === true) eventWasHandled = true;
			else {
				if (name === "error") handler._router._markErrorAsHandled(args[0]);
				return;
			}
		}
	}
	let defaultHandler = defaultActionHandlers[name];
	if (defaultHandler) {
		defaultHandler.call(this, routeInfos, ...args);
		return;
	}
	if (!eventWasHandled && !ignoreFailure) throw new Error(`Nothing handled the action '${name}'. If you did handle the action, this error can be caused by returning true from an action handler in a controller, causing the action to bubble.`);
}
function calculatePostTransitionState(emberRouter, leafRouteName, contexts) {
	let state = emberRouter._routerMicrolib.applyIntent(leafRouteName, contexts);
	let { routeInfos, params } = state;
	for (let routeInfo of routeInfos) if (!routeInfo.isResolved) params[routeInfo.name] = routeInfo.serialize(routeInfo.context);
	else params[routeInfo.name] = routeInfo.params;
	return state;
}
function updatePaths(router) {
	let infos = router._routerMicrolib.currentRouteInfos;
	if (infos.length === 0) return;
	let path = EmberRouter._routePath(infos);
	let currentRouteName = infos[infos.length - 1].name;
	let currentURL = router.location.getURL();
	set(router, "currentPath", path);
	set(router, "currentRouteName", currentRouteName);
	set(router, "currentURL", currentURL);
}
function didBeginTransition(transition, router) {
	let routerState = new RouterState(router, router._routerMicrolib, transition[STATE_SYMBOL]);
	if (!router.currentState) router.set("currentState", routerState);
	router.set("targetState", routerState);
	transition.promise = transition.catch((error) => {
		if (router._isErrorHandled(error)) router._clearHandledError(error);
		else throw error;
	}, "Transition Error");
}
function forEachQueryParam(router, routeInfos, queryParams, callback) {
	let qpCache = router._queryParamsFor(routeInfos);
	for (let key in queryParams) {
		if (!Object.prototype.hasOwnProperty.call(queryParams, key)) continue;
		let value = queryParams[key];
		let qp = qpCache.map[key];
		callback(key, value, qp);
	}
}
EmberRouter.reopen({
	didTransition: defaultDidTransition,
	willTransition: defaultWillTransition,
	rootURL: "/",
	location: "hash",
	url: computed(function() {
		let location = get(this, "location");
		if (typeof location === "string") return;
		return location.getURL();
	})
});
//#endregion
export { triggerEvent as n, EmberRouter as t };
