//#region ../node_modules/.pnpm/ember-repl@8.2.1_patch_hash=fe673d0ba2bd96ef9071c579df638fc0daec82586ee2a1519528d4d06c4_fcfc7daea1b703089ee567ee30902d79/node_modules/ember-repl/dist/_commonjsHelpers-BAGoDD49.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
	if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
	var f = n.default;
	if (typeof f == "function") {
		var a = function a() {
			var isInstance = false;
			try {
				isInstance = this instanceof a;
			} catch {}
			if (isInstance) return Reflect.construct(f, arguments, this.constructor);
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
	} else a = {};
	Object.defineProperty(a, "__esModule", { value: true });
	Object.keys(n).forEach(function(k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function() {
				return n[k];
			}
		});
	});
	return a;
}
//#endregion
export { getAugmentedNamespace as n, getDefaultExportFromCjs as r, commonjsGlobal as t };
