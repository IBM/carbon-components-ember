import { g as getDefaultExportFromCjs, a as getAugmentedNamespace } from './_commonjsHelpers-BAGoDD49-Asm8knJo.js';

var define_process_env_default = {};
function _mergeNamespaces$1(n, m) {
  m.forEach(function(e) {
    e && typeof e !== "string" && !Array.isArray(e) && Object.keys(e).forEach(function(k) {
      if (k !== "default" && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  });
  return Object.freeze(n);
}
var src$1 = {};
function normalizeArray(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === ".") {
      parts.splice(i, 1);
    } else if (last === "..") {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift("..");
    }
  }
  return parts;
}
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};
function resolve() {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path2 = i >= 0 ? arguments[i] : "/";
    if (typeof path2 !== "string") {
      throw new TypeError("Arguments to path.resolve must be strings");
    } else if (!path2) {
      continue;
    }
    resolvedPath = path2 + "/" + resolvedPath;
    resolvedAbsolute = path2.charAt(0) === "/";
  }
  resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
    return !!p;
  }), !resolvedAbsolute).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
}
function normalize(path2) {
  var isPathAbsolute = isAbsolute(path2), trailingSlash = substr(path2, -1) === "/";
  path2 = normalizeArray(filter(path2.split("/"), function(p) {
    return !!p;
  }), !isPathAbsolute).join("/");
  if (!path2 && !isPathAbsolute) {
    path2 = ".";
  }
  if (path2 && trailingSlash) {
    path2 += "/";
  }
  return (isPathAbsolute ? "/" : "") + path2;
}
function isAbsolute(path2) {
  return path2.charAt(0) === "/";
}
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index2) {
    if (typeof p !== "string") {
      throw new TypeError("Arguments to path.join must be strings");
    }
    return p;
  }).join("/"));
}
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);
  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== "") break;
    }
    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== "") break;
    }
    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
}
var sep = "/";
var delimiter = ":";
function dirname(path2) {
  var result = splitPath(path2), root = result[0], dir = result[1];
  if (!root && !dir) {
    return ".";
  }
  if (dir) {
    dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
}
function basename(path2, ext) {
  var f = splitPath(path2)[2];
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}
function extname(path2) {
  return splitPath(path2)[3];
}
var path = {
  extname,
  basename,
  dirname,
  sep,
  delimiter,
  relative,
  join,
  isAbsolute,
  normalize,
  resolve
};
function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}
var substr = "ab".substr(-1) === "b" ? function(str, start, len) {
  return str.substr(start, len);
} : function(str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
var path$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  basename,
  default: path,
  delimiter,
  dirname,
  extname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve,
  sep
});
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(path$1);
var macros = {};
var builder = {};
var hasRequiredBuilder;
function requireBuilder() {
  if (hasRequiredBuilder) return builder;
  hasRequiredBuilder = 1;
  Object.defineProperty(builder, "__esModule", {
    value: true
  });
  class Builder {
    constructor(t, util, options) {
      this.t = t;
      this.module = options.module;
      this.global = options.global;
      this.assertPredicateIndex = options.assertPredicateIndex;
      this.isDebug = options.isDebug;
      this.util = util;
    }
    /**
     * Expands:
     *
     * assert($PREDICATE, $MESSAGE)
     *
     * into
     *
     * ($DEBUG && console.assert($PREDICATE, $MESSAGE));
     *
     * or
     *
     * ($DEBUG && assert($PREDICATE, $MESSAGE));
     *
     * or
     *
     * ($DEBUG && $GLOBAL_NS.assert($PREDICATE, $MESSAGE));
     */
    assert(path2) {
      let predicate;
      const index2 = this.assertPredicateIndex;
      if (index2 !== void 0) {
        predicate = (expression, args) => {
          return args[index2];
        };
      }
      this._createMacroExpression(path2, {
        predicate
      });
    }
    /**
     * Expands:
     *
     * warn($MESSAGE)
     *
     * into
     *
     * ($DEBUG && console.warn($MESSAGE));
     *
     * or
     *
     * ($DEBUG && warn($MESSAGE));
     *
     * or
     *
     * ($DEBUG && $GLOBAL_NS.warn($MESSAGE));
     */
    warn(path2) {
      this._createMacroExpression(path2);
    }
    /**
     * Expands:
     *
     * log($MESSAGE)
     *
     * into
     *
     * ($DEBUG && console.log($MESSAGE));
     *
     * or
     *
     * ($DEBUG && log($MESSAGE));
     *
     * or
     *
     * ($DEBUG && $GLOBAL_NS.log($MESSAGE));
     */
    log(path2) {
      this._createMacroExpression(path2);
    }
    _createMacroExpression(path2, options = {}) {
      let t = this.t;
      let expression = path2.node.expression;
      let callee = expression.callee;
      let args = expression.arguments;
      if (options.validate) {
        options.validate(expression, args);
      }
      let callExpression;
      if (this.module) {
        callExpression = expression;
      } else if (this.global) {
        callExpression = this._createGlobalExternalHelper(callee, args, this.global);
      } else if (options.buildConsoleAPI) {
        callExpression = options.buildConsoleAPI(expression, args);
      } else {
        callExpression = this._createConsoleAPI(options.consoleAPI || callee, args);
      }
      let prefixedIdentifiers = [];
      if (options.predicate) {
        let predicate = options.predicate(expression, args) || t.identifier("false");
        if (!this.t.isExpression(predicate)) {
          throw new Error(`bug: this doesn't support ${predicate.type}`);
        }
        let negatedPredicate = t.unaryExpression("!", t.parenthesizedExpression(predicate));
        prefixedIdentifiers.push(negatedPredicate);
      }
      let replacementPath = this._buildLogicalExpressions(prefixedIdentifiers, callExpression, this._debugExpression(path2));
      path2.replaceWith(replacementPath);
      path2.scope.crawl();
    }
    /**
     * Expands:
     *
     * deprecate($MESSAGE, $PREDICATE)
     *
     * or
     *
     * deprecate($MESSAGE, $PREDICATE, {
     *  $ID,
     *  $URL,
     *  $UNIL
     * });
     *
     * into
     *
     * ($DEBUG && $PREDICATE && console.warn($MESSAGE));
     *
     * or
     *
     * ($DEBUG && $PREDICATE && deprecate($MESSAGE, $PREDICATE, { $ID, $URL, $UNTIL }));
     *
     * or
     *
     * ($DEBUG && $PREDICATE && $GLOBAL_NS.deprecate($MESSAGE, $PREDICATE, { $ID, $URL, $UNTIL }));
     */
    deprecate(path2) {
      this._createMacroExpression(path2, {
        predicate: (expression, args) => args[1],
        buildConsoleAPI: (expression, args) => {
          let message = args[0];
          return this._createConsoleAPI(this.t.identifier("warn"), [message]);
        },
        validate: (expression, args) => {
          let meta = args[2];
          if (meta && this.t.isObjectExpression(meta) && meta.properties && !meta.properties.some((prop) => this.t.isObjectProperty(prop) && (this.t.isIdentifier(prop.key) && prop.key.name === "id" || this.t.isStringLiteral(prop.key) && prop.key.value === "id"))) {
            throw new ReferenceError(`deprecate's meta information requires an "id" field.`);
          }
        }
      });
    }
    _debugExpression(target) {
      if (typeof this.isDebug === "boolean") {
        return this.t.booleanLiteral(this.isDebug);
      } else {
        return this.t.callExpression(this.util.import(target, "@embroider/macros", "isDevelopingApp"), []);
      }
    }
    _createGlobalExternalHelper(identifier, args, ns) {
      let t = this.t;
      return t.callExpression(t.memberExpression(t.identifier(ns), identifier), args);
    }
    _createConsoleAPI(identifier, args) {
      let t = this.t;
      return t.callExpression(t.memberExpression(t.identifier("console"), identifier), args);
    }
    _buildLogicalExpressions(identifiers2, callExpression, debugIdentifier) {
      let t = this.t;
      identifiers2.unshift(debugIdentifier);
      identifiers2.push(callExpression);
      let logicalExpressions;
      for (let i = 0; i < identifiers2.length; i++) {
        let left = identifiers2[i];
        let right = identifiers2[i + 1];
        if (!logicalExpressions) {
          logicalExpressions = t.logicalExpression("&&", left, right);
        } else if (right) {
          logicalExpressions = t.logicalExpression("&&", logicalExpressions, right);
        }
      }
      return t.parenthesizedExpression(logicalExpressions);
    }
  }
  builder.default = Builder;
  return builder;
}
var babelTypeHelpers = {};
var hasRequiredBabelTypeHelpers;
function requireBabelTypeHelpers() {
  if (hasRequiredBabelTypeHelpers) return babelTypeHelpers;
  hasRequiredBabelTypeHelpers = 1;
  Object.defineProperty(babelTypeHelpers, "__esModule", {
    value: true
  });
  babelTypeHelpers.isCallStatementPath = babelTypeHelpers.isCallIdentifierExpression = babelTypeHelpers.name = void 0;
  function name(value) {
    if (value.type === "Identifier") {
      return value.name;
    } else {
      return value.value;
    }
  }
  babelTypeHelpers.name = name;
  function isCallIdentifierExpression(exp) {
    return exp.callee.type === "Identifier";
  }
  babelTypeHelpers.isCallIdentifierExpression = isCallIdentifierExpression;
  function isCallStatementPath(path2) {
    return path2.node.expression.type === "CallExpression" && isCallIdentifierExpression(path2.node.expression);
  }
  babelTypeHelpers.isCallStatementPath = isCallStatementPath;
  return babelTypeHelpers;
}
var hasRequiredMacros;
function requireMacros() {
  if (hasRequiredMacros) return macros;
  hasRequiredMacros = 1;
  var __importDefault = macros && macros.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };
  Object.defineProperty(macros, "__esModule", {
    value: true
  });
  const builder_1 = __importDefault(requireBuilder());
  const babel_type_helpers_1 = requireBabelTypeHelpers();
  const SUPPORTED_MACROS = ["assert", "deprecate", "warn", "log"];
  class Macros {
    constructor(babel, options, util) {
      this.localDebugBindings = [];
      this.debugHelpers = options.externalizeHelpers;
      this.builder = new builder_1.default(babel.types, util, {
        module: this.debugHelpers?.module,
        global: this.debugHelpers?.global,
        assertPredicateIndex: options.debugTools && options.debugTools.assertPredicateIndex,
        isDebug: options.debugTools.isDebug
      });
    }
    /**
     * Collects the import bindings for the debug tools.
     */
    collectDebugToolsSpecifiers(specifiers) {
      specifiers.forEach((specifier) => {
        if (specifier.node.type === "ImportSpecifier" && SUPPORTED_MACROS.indexOf((0, babel_type_helpers_1.name)(specifier.node.imported)) > -1) {
          this.localDebugBindings.push(specifier.get("local"));
        }
      });
    }
    /**
     * Expands the given expression, if it is simple CallExpression statement for the debug tools.
     */
    build(path2) {
      if (!(0, babel_type_helpers_1.isCallStatementPath)(path2)) {
        return;
      }
      if (this.localDebugBindings.some((b) => b.node.name === path2.node.expression.callee.name)) {
        let imported = (0, babel_type_helpers_1.name)(path2.scope.getBinding(path2.node.expression.callee.name).path.node.imported);
        this.builder[`${imported}`](path2);
      }
    }
    /**
     * Removes obsolete import bindings for the debug tools.
     */
    cleanImports() {
      if (!this.debugHelpers?.module) {
        if (this.localDebugBindings.length > 0) {
          let importPath = this.localDebugBindings[0].findParent((p) => p.isImportDeclaration());
          if (importPath === null) {
            return;
          }
          let specifiers = importPath.get("specifiers");
          if (specifiers.length === this.localDebugBindings.length) {
            this.localDebugBindings[0].parentPath.parentPath.remove();
          } else {
            this.localDebugBindings.forEach((binding) => binding.parentPath.remove());
          }
        }
      }
    }
  }
  macros.default = Macros;
  return macros;
}
var normalizeOptions = {};
var re = {
  exports: {}
};
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const SEMVER_SPEC_VERSION = "2.0.0";
  const MAX_LENGTH = 256;
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991;
  const MAX_SAFE_COMPONENT_LENGTH = 16;
  const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
  const RELEASE_TYPES = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
  constants = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
  return constants;
}
var debug_1;
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug_1;
  hasRequiredDebug = 1;
  const debug = typeof process === "object" && define_process_env_default && define_process_env_default.NODE_DEBUG && /\bsemver\b/i.test(define_process_env_default.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
  };
  debug_1 = debug;
  return debug_1;
}
var hasRequiredRe;
function requireRe() {
  if (hasRequiredRe) return re.exports;
  hasRequiredRe = 1;
  (function(module, exports$1) {
    const {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = requireConstants();
    const debug = requireDebug();
    exports$1 = module.exports = {};
    const re2 = exports$1.re = [];
    const safeRe = exports$1.safeRe = [];
    const src2 = exports$1.src = [];
    const safeSrc = exports$1.safeSrc = [];
    const t = exports$1.t = {};
    let R = 0;
    const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    const safeRegexReplacements = [["\\s", 1], ["\\d", MAX_LENGTH], [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]];
    const makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    const createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index2 = R++;
      debug(name, index2, value);
      t[name] = index2;
      src2[index2] = value;
      safeSrc[index2] = safe;
      re2[index2] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index2] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src2[t.NUMERICIDENTIFIER]})\\.(${src2[t.NUMERICIDENTIFIER]})\\.(${src2[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src2[t.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t.NUMERICIDENTIFIERLOOSE]})\\.(${src2[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src2[t.NONNUMERICIDENTIFIER]}|${src2[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src2[t.NONNUMERICIDENTIFIER]}|${src2[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src2[t.PRERELEASEIDENTIFIER]}(?:\\.${src2[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src2[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src2[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src2[t.BUILDIDENTIFIER]}(?:\\.${src2[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src2[t.MAINVERSION]}${src2[t.PRERELEASE]}?${src2[t.BUILD]}?`);
    createToken("FULL", `^${src2[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src2[t.MAINVERSIONLOOSE]}${src2[t.PRERELEASELOOSE]}?${src2[t.BUILD]}?`);
    createToken("LOOSE", `^${src2[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src2[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src2[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src2[t.XRANGEIDENTIFIER]})(?:\\.(${src2[t.XRANGEIDENTIFIER]})(?:\\.(${src2[t.XRANGEIDENTIFIER]})(?:${src2[t.PRERELEASE]})?${src2[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src2[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src2[t.XRANGEIDENTIFIERLOOSE]})(?:${src2[t.PRERELEASELOOSE]})?${src2[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src2[t.GTLT]}\\s*${src2[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src2[t.GTLT]}\\s*${src2[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src2[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src2[t.COERCEPLAIN] + `(?:${src2[t.PRERELEASE]})?(?:${src2[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src2[t.COERCE], true);
    createToken("COERCERTLFULL", src2[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src2[t.LONETILDE]}\\s+`, true);
    exports$1.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src2[t.LONETILDE]}${src2[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src2[t.LONETILDE]}${src2[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src2[t.LONECARET]}\\s+`, true);
    exports$1.caretTrimReplace = "$1^";
    createToken("CARET", `^${src2[t.LONECARET]}${src2[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src2[t.LONECARET]}${src2[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src2[t.GTLT]}\\s*(${src2[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src2[t.GTLT]}\\s*(${src2[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src2[t.GTLT]}\\s*(${src2[t.LOOSEPLAIN]}|${src2[t.XRANGEPLAIN]})`, true);
    exports$1.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src2[t.XRANGEPLAIN]})\\s+-\\s+(${src2[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src2[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src2[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(re, re.exports);
  return re.exports;
}
var parseOptions_1;
var hasRequiredParseOptions;
function requireParseOptions() {
  if (hasRequiredParseOptions) return parseOptions_1;
  hasRequiredParseOptions = 1;
  const looseOption = Object.freeze({
    loose: true
  });
  const emptyOpts = Object.freeze({});
  const parseOptions = (options) => {
    if (!options) {
      return emptyOpts;
    }
    if (typeof options !== "object") {
      return looseOption;
    }
    return options;
  };
  parseOptions_1 = parseOptions;
  return parseOptions_1;
}
var identifiers;
var hasRequiredIdentifiers;
function requireIdentifiers() {
  if (hasRequiredIdentifiers) return identifiers;
  hasRequiredIdentifiers = 1;
  const numeric = /^[0-9]+$/;
  const compareIdentifiers = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };
  const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
  identifiers = {
    compareIdentifiers,
    rcompareIdentifiers
  };
  return identifiers;
}
var semver$1;
var hasRequiredSemver$1;
function requireSemver$1() {
  if (hasRequiredSemver$1) return semver$1;
  hasRequiredSemver$1 = 1;
  const debug = requireDebug();
  const {
    MAX_LENGTH,
    MAX_SAFE_INTEGER
  } = requireConstants();
  const {
    safeRe: re2,
    t
  } = requireRe();
  const parseOptions = requireParseOptions();
  const {
    compareIdentifiers
  } = requireIdentifiers();
  class SemVer {
    constructor(version, options) {
      options = parseOptions(options);
      if (version instanceof SemVer) {
        if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
      }
      debug("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      const m = version.trim().match(options.loose ? re2[t.LOOSE] : re2[t.FULL]);
      if (!m) {
        throw new TypeError(`Invalid Version: ${version}`);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.major < other.major) {
        return -1;
      }
      if (this.major > other.major) {
        return 1;
      }
      if (this.minor < other.minor) {
        return -1;
      }
      if (this.minor > other.minor) {
        return 1;
      }
      if (this.patch < other.patch) {
        return -1;
      }
      if (this.patch > other.patch) {
        return 1;
      }
      return 0;
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      let i = 0;
      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        debug("prerelease compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      let i = 0;
      do {
        const a = this.build[i];
        const b = other.build[i];
        debug("build compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
      if (release.startsWith("pre")) {
        if (!identifier && identifierBase === false) {
          throw new Error("invalid increment argument: identifier is empty");
        }
        if (identifier) {
          const match = `-${identifier}`.match(this.options.loose ? re2[t.PRERELEASELOOSE] : re2[t.PRERELEASE]);
          if (!match || match[1] !== identifier) {
            throw new Error(`invalid identifier: ${identifier}`);
          }
        }
      }
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier, identifierBase);
          }
          this.inc("pre", identifier, identifierBase);
          break;
        case "release":
          if (this.prerelease.length === 0) {
            throw new Error(`version ${this.raw} is not a prerelease`);
          }
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const base = Number(identifierBase) ? 1 : 0;
          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${release}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  semver$1 = SemVer;
  return semver$1;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  const SemVer = requireSemver$1();
  const parse = (version, options, throwErrors = false) => {
    if (version instanceof SemVer) {
      return version;
    }
    try {
      return new SemVer(version, options);
    } catch (er) {
      if (!throwErrors) {
        return null;
      }
      throw er;
    }
  };
  parse_1 = parse;
  return parse_1;
}
var valid_1;
var hasRequiredValid$1;
function requireValid$1() {
  if (hasRequiredValid$1) return valid_1;
  hasRequiredValid$1 = 1;
  const parse = requireParse();
  const valid2 = (version, options) => {
    const v = parse(version, options);
    return v ? v.version : null;
  };
  valid_1 = valid2;
  return valid_1;
}
var clean_1;
var hasRequiredClean;
function requireClean() {
  if (hasRequiredClean) return clean_1;
  hasRequiredClean = 1;
  const parse = requireParse();
  const clean = (version, options) => {
    const s = parse(version.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
  };
  clean_1 = clean;
  return clean_1;
}
var inc_1;
var hasRequiredInc;
function requireInc() {
  if (hasRequiredInc) return inc_1;
  hasRequiredInc = 1;
  const SemVer = requireSemver$1();
  const inc = (version, release, options, identifier, identifierBase) => {
    if (typeof options === "string") {
      identifierBase = identifier;
      identifier = options;
      options = void 0;
    }
    try {
      return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
      return null;
    }
  };
  inc_1 = inc;
  return inc_1;
}
var diff_1;
var hasRequiredDiff;
function requireDiff() {
  if (hasRequiredDiff) return diff_1;
  hasRequiredDiff = 1;
  const parse = requireParse();
  const diff = (version1, version2) => {
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
      return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
      if (!lowVersion.patch && !lowVersion.minor) {
        return "major";
      }
      if (lowVersion.compareMain(highVersion) === 0) {
        if (lowVersion.minor && !lowVersion.patch) {
          return "minor";
        }
        return "patch";
      }
    }
    const prefix = highHasPre ? "pre" : "";
    if (v1.major !== v2.major) {
      return prefix + "major";
    }
    if (v1.minor !== v2.minor) {
      return prefix + "minor";
    }
    if (v1.patch !== v2.patch) {
      return prefix + "patch";
    }
    return "prerelease";
  };
  diff_1 = diff;
  return diff_1;
}
var major_1;
var hasRequiredMajor;
function requireMajor() {
  if (hasRequiredMajor) return major_1;
  hasRequiredMajor = 1;
  const SemVer = requireSemver$1();
  const major = (a, loose) => new SemVer(a, loose).major;
  major_1 = major;
  return major_1;
}
var minor_1;
var hasRequiredMinor;
function requireMinor() {
  if (hasRequiredMinor) return minor_1;
  hasRequiredMinor = 1;
  const SemVer = requireSemver$1();
  const minor = (a, loose) => new SemVer(a, loose).minor;
  minor_1 = minor;
  return minor_1;
}
var patch_1;
var hasRequiredPatch;
function requirePatch() {
  if (hasRequiredPatch) return patch_1;
  hasRequiredPatch = 1;
  const SemVer = requireSemver$1();
  const patch = (a, loose) => new SemVer(a, loose).patch;
  patch_1 = patch;
  return patch_1;
}
var prerelease_1;
var hasRequiredPrerelease;
function requirePrerelease() {
  if (hasRequiredPrerelease) return prerelease_1;
  hasRequiredPrerelease = 1;
  const parse = requireParse();
  const prerelease = (version, options) => {
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  };
  prerelease_1 = prerelease;
  return prerelease_1;
}
var compare_1;
var hasRequiredCompare;
function requireCompare() {
  if (hasRequiredCompare) return compare_1;
  hasRequiredCompare = 1;
  const SemVer = requireSemver$1();
  const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
  compare_1 = compare;
  return compare_1;
}
var rcompare_1;
var hasRequiredRcompare;
function requireRcompare() {
  if (hasRequiredRcompare) return rcompare_1;
  hasRequiredRcompare = 1;
  const compare = requireCompare();
  const rcompare = (a, b, loose) => compare(b, a, loose);
  rcompare_1 = rcompare;
  return rcompare_1;
}
var compareLoose_1;
var hasRequiredCompareLoose;
function requireCompareLoose() {
  if (hasRequiredCompareLoose) return compareLoose_1;
  hasRequiredCompareLoose = 1;
  const compare = requireCompare();
  const compareLoose = (a, b) => compare(a, b, true);
  compareLoose_1 = compareLoose;
  return compareLoose_1;
}
var compareBuild_1;
var hasRequiredCompareBuild;
function requireCompareBuild() {
  if (hasRequiredCompareBuild) return compareBuild_1;
  hasRequiredCompareBuild = 1;
  const SemVer = requireSemver$1();
  const compareBuild = (a, b, loose) => {
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  };
  compareBuild_1 = compareBuild;
  return compareBuild_1;
}
var sort_1;
var hasRequiredSort;
function requireSort() {
  if (hasRequiredSort) return sort_1;
  hasRequiredSort = 1;
  const compareBuild = requireCompareBuild();
  const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
  sort_1 = sort;
  return sort_1;
}
var rsort_1;
var hasRequiredRsort;
function requireRsort() {
  if (hasRequiredRsort) return rsort_1;
  hasRequiredRsort = 1;
  const compareBuild = requireCompareBuild();
  const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
  rsort_1 = rsort;
  return rsort_1;
}
var gt_1;
var hasRequiredGt;
function requireGt() {
  if (hasRequiredGt) return gt_1;
  hasRequiredGt = 1;
  const compare = requireCompare();
  const gt = (a, b, loose) => compare(a, b, loose) > 0;
  gt_1 = gt;
  return gt_1;
}
var lt_1;
var hasRequiredLt;
function requireLt() {
  if (hasRequiredLt) return lt_1;
  hasRequiredLt = 1;
  const compare = requireCompare();
  const lt = (a, b, loose) => compare(a, b, loose) < 0;
  lt_1 = lt;
  return lt_1;
}
var eq_1;
var hasRequiredEq;
function requireEq() {
  if (hasRequiredEq) return eq_1;
  hasRequiredEq = 1;
  const compare = requireCompare();
  const eq = (a, b, loose) => compare(a, b, loose) === 0;
  eq_1 = eq;
  return eq_1;
}
var neq_1;
var hasRequiredNeq;
function requireNeq() {
  if (hasRequiredNeq) return neq_1;
  hasRequiredNeq = 1;
  const compare = requireCompare();
  const neq = (a, b, loose) => compare(a, b, loose) !== 0;
  neq_1 = neq;
  return neq_1;
}
var gte_1;
var hasRequiredGte;
function requireGte() {
  if (hasRequiredGte) return gte_1;
  hasRequiredGte = 1;
  const compare = requireCompare();
  const gte = (a, b, loose) => compare(a, b, loose) >= 0;
  gte_1 = gte;
  return gte_1;
}
var lte_1;
var hasRequiredLte;
function requireLte() {
  if (hasRequiredLte) return lte_1;
  hasRequiredLte = 1;
  const compare = requireCompare();
  const lte = (a, b, loose) => compare(a, b, loose) <= 0;
  lte_1 = lte;
  return lte_1;
}
var cmp_1;
var hasRequiredCmp;
function requireCmp() {
  if (hasRequiredCmp) return cmp_1;
  hasRequiredCmp = 1;
  const eq = requireEq();
  const neq = requireNeq();
  const gt = requireGt();
  const gte = requireGte();
  const lt = requireLt();
  const lte = requireLte();
  const cmp = (a, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a === b;
      case "!==":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a !== b;
      case "":
      case "=":
      case "==":
        return eq(a, b, loose);
      case "!=":
        return neq(a, b, loose);
      case ">":
        return gt(a, b, loose);
      case ">=":
        return gte(a, b, loose);
      case "<":
        return lt(a, b, loose);
      case "<=":
        return lte(a, b, loose);
      default:
        throw new TypeError(`Invalid operator: ${op}`);
    }
  };
  cmp_1 = cmp;
  return cmp_1;
}
var coerce_1;
var hasRequiredCoerce;
function requireCoerce() {
  if (hasRequiredCoerce) return coerce_1;
  hasRequiredCoerce = 1;
  const SemVer = requireSemver$1();
  const parse = requireParse();
  const {
    safeRe: re2,
    t
  } = requireRe();
  const coerce = (version, options) => {
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version === "number") {
      version = String(version);
    }
    if (typeof version !== "string") {
      return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
      match = version.match(options.includePrerelease ? re2[t.COERCEFULL] : re2[t.COERCE]);
    } else {
      const coerceRtlRegex = options.includePrerelease ? re2[t.COERCERTLFULL] : re2[t.COERCERTL];
      let next;
      while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
      return null;
    }
    const major = match[2];
    const minor = match[3] || "0";
    const patch = match[4] || "0";
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
  };
  coerce_1 = coerce;
  return coerce_1;
}
var truncate_1;
var hasRequiredTruncate;
function requireTruncate() {
  if (hasRequiredTruncate) return truncate_1;
  hasRequiredTruncate = 1;
  const parse = requireParse();
  const constants2 = requireConstants();
  const SemVer = requireSemver$1();
  const truncate = (version, truncation, options) => {
    if (!constants2.RELEASE_TYPES.includes(truncation)) {
      return null;
    }
    const clonedVersion = cloneInputVersion(version, options);
    return clonedVersion && doTruncation(clonedVersion, truncation);
  };
  const cloneInputVersion = (version, options) => {
    const versionStringToParse = version instanceof SemVer ? version.version : version;
    return parse(versionStringToParse, options);
  };
  const doTruncation = (version, truncation) => {
    if (isPrerelease(truncation)) {
      return version.version;
    }
    version.prerelease = [];
    switch (truncation) {
      case "major":
        version.minor = 0;
        version.patch = 0;
        break;
      case "minor":
        version.patch = 0;
        break;
    }
    return version.format();
  };
  const isPrerelease = (type) => {
    return type.startsWith("pre");
  };
  truncate_1 = truncate;
  return truncate_1;
}
var lrucache;
var hasRequiredLrucache;
function requireLrucache() {
  if (hasRequiredLrucache) return lrucache;
  hasRequiredLrucache = 1;
  class LRUCache {
    constructor() {
      this.max = 1e3;
      this.map = /* @__PURE__ */ new Map();
    }
    get(key) {
      const value = this.map.get(key);
      if (value === void 0) {
        return void 0;
      } else {
        this.map.delete(key);
        this.map.set(key, value);
        return value;
      }
    }
    delete(key) {
      return this.map.delete(key);
    }
    set(key, value) {
      const deleted = this.delete(key);
      if (!deleted && value !== void 0) {
        if (this.map.size >= this.max) {
          const firstKey = this.map.keys().next().value;
          this.delete(firstKey);
        }
        this.map.set(key, value);
      }
      return this;
    }
  }
  lrucache = LRUCache;
  return lrucache;
}
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range {
    constructor(range2, options) {
      options = parseOptions(options);
      if (range2 instanceof Range) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      range2 = range2.replace(BUILDSTRIPRE, "");
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t.HYPHENRANGELOOSE] : re2[t.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug("hyphen replace", range2);
      range2 = range2.replace(re2[t.COMPARATORTRIM], comparatorTrimReplace);
      debug("comparator trim", range2);
      range2 = range2.replace(re2[t.TILDETRIM], tildeTrimReplace);
      debug("tilde trim", range2);
      range2 = range2.replace(re2[t.CARETTRIM], caretTrimReplace);
      debug("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t.COMPARATORLOOSE]);
        });
      }
      debug("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range;
  const LRU = requireLrucache();
  const cache = new LRU();
  const parseOptions = requireParseOptions();
  const Comparator = requireComparator();
  const debug = requireDebug();
  const SemVer = requireSemver$1();
  const {
    safeRe: re2,
    src: src2,
    t,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = requireRe();
  const {
    FLAG_INCLUDE_PRERELEASE,
    FLAG_LOOSE
  } = requireConstants();
  const BUILDSTRIPRE = new RegExp(src2[t.BUILD], "g");
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    comp = comp.replace(re2[t.BUILD], "");
    debug("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug("caret", comp);
    comp = replaceTildes(comp, options);
    debug("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug("xrange", comp);
    comp = replaceStars(comp, options);
    debug("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t.TILDELOOSE] : re2[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      debug("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug("caret", comp, options);
    const r = options.loose ? re2[t.CARETLOOSE] : re2[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t.XRANGELOOSE] : re2[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug("replaceStars", comp, options);
    return comp.trim().replace(re2[t.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set, version, options) => {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set.length; i++) {
        debug(set[i].semver);
        if (set[i].semver === Comparator.ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY = /* @__PURE__ */ Symbol("SemVer ANY");
  class Comparator {
    static get ANY() {
      return ANY;
    }
    constructor(comp, options) {
      options = parseOptions(options);
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t.COMPARATORLOOSE] : re2[t.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version) {
      debug("Comparator.test", version, this.options.loose);
      if (this.semver === ANY || version === ANY) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range(this.value, options).test(comp.semver);
      }
      options = parseOptions(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator;
  const parseOptions = requireParseOptions();
  const {
    safeRe: re2,
    t
  } = requireRe();
  const cmp = requireCmp();
  const debug = requireDebug();
  const SemVer = requireSemver$1();
  const Range = requireRange();
  return comparator;
}
var satisfies_1;
var hasRequiredSatisfies;
function requireSatisfies() {
  if (hasRequiredSatisfies) return satisfies_1;
  hasRequiredSatisfies = 1;
  const Range = requireRange();
  const satisfies = (version, range2, options) => {
    try {
      range2 = new Range(range2, options);
    } catch (er) {
      return false;
    }
    return range2.test(version);
  };
  satisfies_1 = satisfies;
  return satisfies_1;
}
var toComparators_1;
var hasRequiredToComparators;
function requireToComparators() {
  if (hasRequiredToComparators) return toComparators_1;
  hasRequiredToComparators = 1;
  const Range = requireRange();
  const toComparators = (range2, options) => new Range(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
  toComparators_1 = toComparators;
  return toComparators_1;
}
var maxSatisfying_1;
var hasRequiredMaxSatisfying;
function requireMaxSatisfying() {
  if (hasRequiredMaxSatisfying) return maxSatisfying_1;
  hasRequiredMaxSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const maxSatisfying = (versions, range2, options) => {
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!max || maxSV.compare(v) === -1) {
          max = v;
          maxSV = new SemVer(max, options);
        }
      }
    });
    return max;
  };
  maxSatisfying_1 = maxSatisfying;
  return maxSatisfying_1;
}
var minSatisfying_1;
var hasRequiredMinSatisfying;
function requireMinSatisfying() {
  if (hasRequiredMinSatisfying) return minSatisfying_1;
  hasRequiredMinSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const minSatisfying = (versions, range2, options) => {
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min;
  };
  minSatisfying_1 = minSatisfying;
  return minSatisfying_1;
}
var minVersion_1;
var hasRequiredMinVersion;
function requireMinVersion() {
  if (hasRequiredMinVersion) return minVersion_1;
  hasRequiredMinVersion = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const gt = requireGt();
  const minVersion = (range2, loose) => {
    range2 = new Range(range2, loose);
    let minver = new SemVer("0.0.0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = null;
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let setMin = null;
      comparators.forEach((comparator2) => {
        const compver = new SemVer(comparator2.semver.version);
        switch (comparator2.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          /* fallthrough */
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin)) {
              setMin = compver;
            }
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${comparator2.operator}`);
        }
      });
      if (setMin && (!minver || gt(minver, setMin))) {
        minver = setMin;
      }
    }
    if (minver && range2.test(minver)) {
      return minver;
    }
    return null;
  };
  minVersion_1 = minVersion;
  return minVersion_1;
}
var valid;
var hasRequiredValid;
function requireValid() {
  if (hasRequiredValid) return valid;
  hasRequiredValid = 1;
  const Range = requireRange();
  const validRange = (range2, options) => {
    try {
      return new Range(range2, options).range || "*";
    } catch (er) {
      return null;
    }
  };
  valid = validRange;
  return valid;
}
var outside_1;
var hasRequiredOutside;
function requireOutside() {
  if (hasRequiredOutside) return outside_1;
  hasRequiredOutside = 1;
  const SemVer = requireSemver$1();
  const Comparator = requireComparator();
  const {
    ANY
  } = Comparator;
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const gt = requireGt();
  const lt = requireLt();
  const lte = requireLte();
  const gte = requireGte();
  const outside = (version, range2, hilo, options) => {
    version = new SemVer(version, options);
    range2 = new Range(range2, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version, range2, options)) {
      return false;
    }
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let high = null;
      let low = null;
      comparators.forEach((comparator2) => {
        if (comparator2.semver === ANY) {
          comparator2 = new Comparator(">=0.0.0");
        }
        high = high || comparator2;
        low = low || comparator2;
        if (gtfn(comparator2.semver, high.semver, options)) {
          high = comparator2;
        } else if (ltfn(comparator2.semver, low.semver, options)) {
          low = comparator2;
        }
      });
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }
    return true;
  };
  outside_1 = outside;
  return outside_1;
}
var gtr_1;
var hasRequiredGtr;
function requireGtr() {
  if (hasRequiredGtr) return gtr_1;
  hasRequiredGtr = 1;
  const outside = requireOutside();
  const gtr = (version, range2, options) => outside(version, range2, ">", options);
  gtr_1 = gtr;
  return gtr_1;
}
var ltr_1;
var hasRequiredLtr;
function requireLtr() {
  if (hasRequiredLtr) return ltr_1;
  hasRequiredLtr = 1;
  const outside = requireOutside();
  const ltr = (version, range2, options) => outside(version, range2, "<", options);
  ltr_1 = ltr;
  return ltr_1;
}
var intersects_1;
var hasRequiredIntersects;
function requireIntersects() {
  if (hasRequiredIntersects) return intersects_1;
  hasRequiredIntersects = 1;
  const Range = requireRange();
  const intersects = (r1, r2, options) => {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
  };
  intersects_1 = intersects;
  return intersects_1;
}
var simplify;
var hasRequiredSimplify;
function requireSimplify() {
  if (hasRequiredSimplify) return simplify;
  hasRequiredSimplify = 1;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  simplify = (versions, range2, options) => {
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b) => compare(a, b, options));
    for (const version of v) {
      const included = satisfies(version, range2, options);
      if (included) {
        prev = version;
        if (!first) {
          first = version;
        }
      } else {
        if (prev) {
          set.push([first, prev]);
        }
        prev = null;
        first = null;
      }
    }
    if (first) {
      set.push([first, null]);
    }
    const ranges = [];
    for (const [min, max] of set) {
      if (min === max) {
        ranges.push(min);
      } else if (!max && min === v[0]) {
        ranges.push("*");
      } else if (!max) {
        ranges.push(`>=${min}`);
      } else if (min === v[0]) {
        ranges.push(`<=${max}`);
      } else {
        ranges.push(`${min} - ${max}`);
      }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range2.raw === "string" ? range2.raw : String(range2);
    return simplified.length < original.length ? simplified : range2;
  };
  return simplify;
}
var subset_1;
var hasRequiredSubset;
function requireSubset() {
  if (hasRequiredSubset) return subset_1;
  hasRequiredSubset = 1;
  const Range = requireRange();
  const Comparator = requireComparator();
  const {
    ANY
  } = Comparator;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  const subset = (sub, dom, options = {}) => {
    if (sub === dom) {
      return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set) {
      for (const simpleDom of dom.set) {
        const isSub = simpleSubset(simpleSub, simpleDom, options);
        sawNonNull = sawNonNull || isSub !== null;
        if (isSub) {
          continue OUTER;
        }
      }
      if (sawNonNull) {
        return false;
      }
    }
    return true;
  };
  const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
  const minimumVersion = [new Comparator(">=0.0.0")];
  const simpleSubset = (sub, dom, options) => {
    if (sub === dom) {
      return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
      if (dom.length === 1 && dom[0].semver === ANY) {
        return true;
      } else if (options.includePrerelease) {
        sub = minimumVersionWithPreRelease;
      } else {
        sub = minimumVersion;
      }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
      if (options.includePrerelease) {
        return true;
      } else {
        dom = minimumVersion;
      }
    }
    const eqSet = /* @__PURE__ */ new Set();
    let gt, lt;
    for (const c of sub) {
      if (c.operator === ">" || c.operator === ">=") {
        gt = higherGT(gt, c, options);
      } else if (c.operator === "<" || c.operator === "<=") {
        lt = lowerLT(lt, c, options);
      } else {
        eqSet.add(c.semver);
      }
    }
    if (eqSet.size > 1) {
      return null;
    }
    let gtltComp;
    if (gt && lt) {
      gtltComp = compare(gt.semver, lt.semver, options);
      if (gtltComp > 0) {
        return null;
      } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
        return null;
      }
    }
    for (const eq of eqSet) {
      if (gt && !satisfies(eq, String(gt), options)) {
        return null;
      }
      if (lt && !satisfies(eq, String(lt), options)) {
        return null;
      }
      for (const c of dom) {
        if (!satisfies(eq, String(c), options)) {
          return false;
        }
      }
      return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
      needDomLTPre = false;
    }
    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
      hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
      if (gt) {
        if (needDomGTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
            needDomGTPre = false;
          }
        }
        if (c.operator === ">" || c.operator === ">=") {
          higher = higherGT(gt, c, options);
          if (higher === c && higher !== gt) {
            return false;
          }
        } else if (gt.operator === ">=" && !c.test(gt.semver)) {
          return false;
        }
      }
      if (lt) {
        if (needDomLTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
            needDomLTPre = false;
          }
        }
        if (c.operator === "<" || c.operator === "<=") {
          lower = lowerLT(lt, c, options);
          if (lower === c && lower !== lt) {
            return false;
          }
        } else if (lt.operator === "<=" && !c.test(lt.semver)) {
          return false;
        }
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) {
        return false;
      }
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
      return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
      return false;
    }
    if (needDomGTPre || needDomLTPre) {
      return false;
    }
    return true;
  };
  const higherGT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
  };
  const lowerLT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
  };
  subset_1 = subset;
  return subset_1;
}
var semver;
var hasRequiredSemver;
function requireSemver() {
  if (hasRequiredSemver) return semver;
  hasRequiredSemver = 1;
  const internalRe = requireRe();
  const constants2 = requireConstants();
  const SemVer = requireSemver$1();
  const identifiers2 = requireIdentifiers();
  const parse = requireParse();
  const valid2 = requireValid$1();
  const clean = requireClean();
  const inc = requireInc();
  const diff = requireDiff();
  const major = requireMajor();
  const minor = requireMinor();
  const patch = requirePatch();
  const prerelease = requirePrerelease();
  const compare = requireCompare();
  const rcompare = requireRcompare();
  const compareLoose = requireCompareLoose();
  const compareBuild = requireCompareBuild();
  const sort = requireSort();
  const rsort = requireRsort();
  const gt = requireGt();
  const lt = requireLt();
  const eq = requireEq();
  const neq = requireNeq();
  const gte = requireGte();
  const lte = requireLte();
  const cmp = requireCmp();
  const coerce = requireCoerce();
  const truncate = requireTruncate();
  const Comparator = requireComparator();
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const toComparators = requireToComparators();
  const maxSatisfying = requireMaxSatisfying();
  const minSatisfying = requireMinSatisfying();
  const minVersion = requireMinVersion();
  const validRange = requireValid();
  const outside = requireOutside();
  const gtr = requireGtr();
  const ltr = requireLtr();
  const intersects = requireIntersects();
  const simplifyRange = requireSimplify();
  const subset = requireSubset();
  semver = {
    parse,
    valid: valid2,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    truncate,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants2.RELEASE_TYPES,
    compareIdentifiers: identifiers2.compareIdentifiers,
    rcompareIdentifiers: identifiers2.rcompareIdentifiers
  };
  return semver;
}
var hasRequiredNormalizeOptions;
function requireNormalizeOptions() {
  if (hasRequiredNormalizeOptions) return normalizeOptions;
  hasRequiredNormalizeOptions = 1;
  Object.defineProperty(normalizeOptions, "__esModule", {
    value: true
  });
  normalizeOptions.normalizeOptions = void 0;
  const semver_1 = requireSemver();
  function parseDebugTools(options) {
    let debugTools = options.debugTools || {
      isDebug: false,
      source: "",
      assertPredicateIndex: void 0
    };
    let isDebug = debugTools.isDebug;
    let debugToolsImport = debugTools.source;
    let assertPredicateIndex = debugTools.assertPredicateIndex;
    return {
      isDebug,
      debugToolsImport,
      assertPredicateIndex
    };
  }
  function evaluateFlagValue(options, name, flagName, flagValue) {
    let svelte = options.svelte;
    if (typeof flagValue === "string" && name) {
      if (svelte && svelte[name]) {
        return (0, semver_1.gt)(flagValue, svelte[name]);
      } else {
        return null;
      }
    } else if (typeof flagValue === "boolean" || flagValue === null) {
      return flagValue;
    } else if (flagValue === "@embroider/macros") {
      return flagValue;
    } else {
      throw new Error(`Invalid value specified (${flagValue}) for ${flagName} by ${name}`);
    }
  }
  function parseFlags(options) {
    let flagsProvided = options.flags || [];
    let combinedFlags = {};
    flagsProvided.forEach((flagsDefinition) => {
      let source = flagsDefinition.source;
      let flagsForSource = combinedFlags[source] = combinedFlags[source] || {};
      for (let flagName in flagsDefinition.flags) {
        let flagValue = flagsDefinition.flags[flagName];
        flagsForSource[flagName] = evaluateFlagValue(options, flagsDefinition.name, flagName, flagValue);
      }
    });
    return combinedFlags;
  }
  function normalizeOptions$1(options) {
    return {
      externalizeHelpers: options.externalizeHelpers,
      flags: parseFlags(options),
      debugTools: parseDebugTools(options)
    };
  }
  normalizeOptions.normalizeOptions = normalizeOptions$1;
  return normalizeOptions;
}
var src = {};
var hasRequiredSrc$1;
function requireSrc$1() {
  if (hasRequiredSrc$1) return src;
  hasRequiredSrc$1 = 1;
  Object.defineProperty(src, "__esModule", {
    value: true
  });
  src.ImportUtil = void 0;
  class ImportUtil {
    constructor(t, program) {
      this.t = t;
      this.program = program;
    }
    // remove one imported binding. If this is the last thing imported from the
    // given moduleSpecifier, the whole statement will also be removed.
    removeImport(moduleSpecifier, exportedName) {
      for (let topLevelPath of this.program.get("body")) {
        if (!matchModule(topLevelPath, moduleSpecifier)) {
          continue;
        }
        let importSpecifierPath = topLevelPath.get("specifiers").find((specifierPath) => matchSpecifier(specifierPath, exportedName));
        if (importSpecifierPath) {
          if (topLevelPath.node.specifiers.length === 1) {
            topLevelPath.remove();
          } else {
            importSpecifierPath.remove();
          }
        }
      }
    }
    // remove all imports from the given moduleSpecifier
    removeAllImports(moduleSpecifier) {
      for (let topLevelPath of this.program.get("body")) {
        if (matchModule(topLevelPath, moduleSpecifier)) {
          topLevelPath.remove();
        }
      }
    }
    // Import the given value (if needed) and return an Identifier representing
    // it.
    import(target, moduleSpecifier, exportedName, nameHint) {
      var _a;
      let isNamespaceImport = exportedName === "*";
      let isDefaultImport = exportedName === "default";
      let isNamedImport = !isDefaultImport && !isNamespaceImport;
      let declaration = this.findImportFrom(moduleSpecifier);
      let hasNamespaceSpecifier = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find((s) => s.type === "ImportNamespaceSpecifier");
      let hasNamedSpecifiers = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find((s) => s.type === "ImportSpecifier");
      let cannotUseExistingDeclaration = hasNamedSpecifiers && isNamespaceImport || hasNamespaceSpecifier && isNamedImport || hasNamespaceSpecifier && isNamespaceImport;
      if (!cannotUseExistingDeclaration && declaration) {
        let specifier = declaration.get("specifiers").find((spec) => matchSpecifier(spec, exportedName));
        if (specifier && ((_a = target.scope.getBinding(specifier.node.local.name)) === null || _a === void 0 ? void 0 : _a.kind) === "module") {
          return this.t.identifier(specifier.node.local.name);
        } else {
          return this.addSpecifier(target, declaration, exportedName, nameHint);
        }
      } else {
        let declaration2 = this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
        return this.addSpecifier(target, declaration2, exportedName, nameHint);
      }
    }
    importForSideEffect(moduleSpecifier) {
      let declaration = this.findImportFrom(moduleSpecifier);
      if (!declaration) {
        this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
      }
    }
    addSpecifier(target, declaration, exportedName, nameHint) {
      let local = this.t.identifier(unusedNameLike(target, desiredName(nameHint, exportedName, target)));
      let specifier = this.buildSpecifier(exportedName, local);
      if (specifier.type === "ImportDefaultSpecifier") {
        declaration.node.specifiers.unshift(specifier);
      } else {
        declaration.node.specifiers.push(specifier);
      }
      declaration.scope.registerBinding("module", declaration.get(`specifiers.${declaration.node.specifiers.length - 1}`));
      return local;
    }
    buildSpecifier(exportedName, localName) {
      switch (exportedName) {
        case "default":
          return this.t.importDefaultSpecifier(localName);
        case "*":
          return this.t.importNamespaceSpecifier(localName);
        default:
          return this.t.importSpecifier(localName, this.t.identifier(exportedName));
      }
    }
    findImportFrom(moduleSpecifier) {
      for (let path2 of this.program.get("body")) {
        if (path2.isImportDeclaration() && path2.node.source.value === moduleSpecifier && path2.node.importKind !== "type") {
          return path2;
        }
      }
      return void 0;
    }
    insertAfterExistingImports(statement) {
      let lastIndex;
      for (let [index2, node] of this.program.node.body.entries()) {
        if (node.type === "ImportDeclaration") {
          lastIndex = index2;
        }
      }
      if (lastIndex == null) {
        this.program.node.body.unshift(statement);
        return this.program.get("body.0");
      } else {
        this.program.node.body.splice(lastIndex + 1, 0, statement);
        return this.program.get(`body.${lastIndex + 1}`);
      }
    }
  }
  src.ImportUtil = ImportUtil;
  function unusedNameLike(path2, name2) {
    let candidate = name2;
    let counter = 0;
    while (path2.scope.hasBinding(candidate)) {
      candidate = `${name2}${counter++}`;
    }
    return candidate;
  }
  function name(node) {
    if (node.type === "StringLiteral") {
      return node.value;
    } else {
      return node.name;
    }
  }
  function desiredName(nameHint, exportedName, target) {
    if (nameHint) {
      let cleaned = nameHint.replace(/[^a-zA-Z_]([a-z])/g, (_m, letter) => letter.toUpperCase());
      cleaned = cleaned.replace(/[^a-zA-Z_]/g, "");
      return cleaned;
    }
    if (exportedName === "default" || exportedName === "*") {
      if (target.isIdentifier()) {
        return target.node.name;
      } else {
        return target.scope.generateUidIdentifierBasedOnNode(target.node).name;
      }
    } else {
      return exportedName;
    }
  }
  function matchSpecifier(spec, exportedName) {
    switch (exportedName) {
      case "default":
        return spec.isImportDefaultSpecifier();
      case "*":
        return spec.isImportNamespaceSpecifier();
      default:
        return spec.isImportSpecifier() && name(spec.node.imported) === exportedName;
    }
  }
  function matchModule(path2, moduleSpecifier) {
    return path2.isImportDeclaration() && path2.get("source").node.value === moduleSpecifier;
  }
  return src;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src$1;
  hasRequiredSrc = 1;
  var __importDefault = src$1 && src$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };
  Object.defineProperty(src$1, "__esModule", {
    value: true
  });
  const path_1 = __importDefault(require$$0);
  const macros_1 = __importDefault(requireMacros());
  const normalize_options_1 = requireNormalizeOptions();
  const babel_import_util_1 = requireSrc$1();
  function macros2(babel) {
    let t = babel.types;
    function buildIdentifier(value, name) {
      let replacement = t.booleanLiteral(value);
      t.addComment(replacement, "trailing", ` ${name} `);
      return replacement;
    }
    return {
      name: "babel-feature-flags-and-debug-macros",
      visitor: {
        ImportSpecifier(path2, state) {
          let importPath = path2.parent.source.value;
          let flagsForImport = state.opts.flags[importPath];
          if (flagsForImport) {
            let flagName = t.isIdentifier(path2.node.imported) ? path2.node.imported.name : path2.node.imported.value;
            let localBindingName = path2.node.local.name;
            if (!(flagName in flagsForImport)) {
              throw new Error(`Imported ${flagName} from ${importPath} which is not a supported flag.`);
            }
            let flagValue = flagsForImport[flagName];
            if (flagValue === null) {
              return;
            }
            let binding = path2.scope.getBinding(localBindingName);
            binding.referencePaths.forEach((p) => {
              if (flagValue === "@embroider/macros") {
                p.replaceWith(t.callExpression(state.util.import(p, "@embroider/macros", "isDevelopingApp"), []));
                p.scope.crawl();
              } else {
                p.replaceWith(buildIdentifier(flagValue, flagName));
              }
            });
            path2.remove();
            path2.scope.removeOwnBinding(localBindingName);
          }
        },
        ImportDeclaration: {
          exit(path2, state) {
            let importPath = path2.node.source.value;
            let flagsForImport = state.opts.flags[importPath];
            if (flagsForImport && path2.get("specifiers").length === 0) {
              path2.remove();
            }
          }
        },
        Program: {
          enter(path2, state) {
            state.opts = (0, normalize_options_1.normalizeOptions)(state.opts);
            state.util = new babel_import_util_1.ImportUtil(t, path2);
            this.macroBuilder = new macros_1.default(babel, state.opts, state.util);
            let body = path2.get("body");
            body.forEach((item) => {
              if (item.isImportDeclaration()) {
                let importPath = item.node.source.value;
                let debugToolsImport = state.opts.debugTools.debugToolsImport;
                if (debugToolsImport && debugToolsImport === importPath) {
                  if (!item.node.specifiers.length) {
                    item.remove();
                  } else {
                    this.macroBuilder.collectDebugToolsSpecifiers(item.get("specifiers"));
                  }
                }
              }
            });
          },
          exit() {
            this.macroBuilder.cleanImports();
          }
        },
        ExpressionStatement(path2) {
          this.macroBuilder.build(path2);
        }
      }
    };
  }
  src$1.default = macros2;
  macros2.baseDir = function() {
    return path_1.default.resolve(__dirname, "..", "..");
  };
  return src$1;
}
var babelPluginDebugMacros;
var hasRequiredBabelPluginDebugMacros;
function requireBabelPluginDebugMacros() {
  if (hasRequiredBabelPluginDebugMacros) return babelPluginDebugMacros;
  hasRequiredBabelPluginDebugMacros = 1;
  babelPluginDebugMacros = requireSrc().default;
  return babelPluginDebugMacros;
}
var babelPluginDebugMacrosExports = requireBabelPluginDebugMacros();
var index = /* @__PURE__ */ getDefaultExportFromCjs(babelPluginDebugMacrosExports);
var index$1 = /* @__PURE__ */ _mergeNamespaces$1({
  __proto__: null,
  default: index
}, [babelPluginDebugMacrosExports]);

export { index$1 as i };
