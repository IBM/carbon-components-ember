import { g as getDefaultExportFromCjs } from './_commonjsHelpers-BFTU3MAI.js';

function _mergeNamespaces(n, m) {
    for (var i = 0; i < m.length; i++) {
        const e = m[i];
        if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
            if (k !== 'default' && !(k in n)) {
                const d = Object.getOwnPropertyDescriptor(e, k);
                if (d) {
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: () => e[k]
                    });
                }
            }
        } }
    }
    return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

var plugin$2 = {};

var src = {};

var sanitize = {};

var hasRequiredSanitize;

function requireSanitize () {
	if (hasRequiredSanitize) return sanitize;
	hasRequiredSanitize = 1;

	// make a name into a valid javascript identifier, as pleasantly as possible.
	Object.defineProperty(sanitize, "__esModule", {
	  value: true
	});
	sanitize.sanitize = void 0;
	function sanitize$1(identifier) {
	  // first we opportunistically do camelization when an illegal character is not
	  // the first character and is followed by a lowercase letter, in an effort to
	  // aid readability of the output.
	  let cleaned = identifier.replace(new RegExp(`(?<!^)(?:${illegalChar.source})([a-z])`, 'g'), (_m, letter) => letter.toUpperCase());
	  // then we unliterally strip all remaining illegal characters.
	  cleaned = cleaned.replace(new RegExp(illegalChar.source, 'g'), '');
	  return cleaned;
	}
	sanitize.sanitize = sanitize$1;
	const illegalChar = /^[^a-zA-Z_$]|(?<=.)[^a-zA-Z_$0-9]/;
	return sanitize;
}

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src;
	hasRequiredSrc = 1;

	Object.defineProperty(src, "__esModule", {
	  value: true
	});
	src.ImportUtil = void 0;
	const sanitize_1 = /*@__PURE__*/ requireSanitize();
	class ImportUtil {
	  constructor(babel, program) {
	    this.babel = babel;
	    this.program = program;
	    this.t = babel.types;
	  }
	  // remove one imported binding. If this is the last thing imported from the
	  // given moduleSpecifier, the whole statement will also be removed.
	  removeImport(moduleSpecifier, exportedName) {
	    for (let topLevelPath of this.program.get('body')) {
	      if (!matchModule(topLevelPath, moduleSpecifier)) {
	        continue;
	      }
	      let importSpecifierPath = topLevelPath.get('specifiers').find(specifierPath => matchSpecifier(specifierPath, exportedName));
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
	    for (let topLevelPath of this.program.get('body')) {
	      if (matchModule(topLevelPath, moduleSpecifier)) {
	        topLevelPath.remove();
	      }
	    }
	  }
	  // Import the given value (if needed) and return an Identifier representing
	  // it.
	  //
	  // This method is trickier to use safely than our higher-level methods
	  // (`insertAfter`, `insertBefore`, `replaceWith`, `mutate`) because after you
	  // insert the identifier into the AST, it's up to you to ensure that babel's
	  // scope system is aware of the new reference. The other methods do that for
	  // you automatically.
	  import(
	  // the spot at which you will insert the Identifier we return to you
	  target,
	  // the path to the module you're importing from
	  moduleSpecifier,
	  // the name you're importing from that module. Use "default" for the default
	  // export. Use "*" for the namespace.
	  exportedName,
	  // Optional hint for helping us pick a name for the imported binding
	  nameHint) {
	    return this.unreferencedImport(target, moduleSpecifier, exportedName, desiredName(nameHint, exportedName, defaultNameHint(target)));
	  }
	  // Import the given value (if needed) and return an Identifier representing
	  // it.
	  unreferencedImport(
	  // the spot at which you will insert the Identifier we return to you
	  target,
	  // the path to the module you're importing from
	  moduleSpecifier,
	  // the name you're importing from that module. Use "default" for the default
	  // export. Use "*" for the namespace.
	  exportedName,
	  // the preferred name you want, if we neeed to create a new binding. You
	  // might get something similar instead, to avoid collisions.
	  preferredName) {
	    var _a;
	    let isNamespaceImport = exportedName === '*';
	    let isDefaultImport = exportedName === 'default';
	    let isNamedImport = !isDefaultImport && !isNamespaceImport;
	    let declaration = this.findImportFrom(moduleSpecifier);
	    let hasNamespaceSpecifier = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find(s => s.type === 'ImportNamespaceSpecifier');
	    let hasNamedSpecifiers = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find(s => s.type === 'ImportSpecifier');
	    /**
	     * the file has a preexisting non-namespace import and a transform tries to add a namespace import, so they don't get combined
	     * the file has a preexisting namespace import and a transform tries to add a non-namespace import, so they don't get combined
	     * the file has a preexisting namespace import and a transform tries to add a namespace import, so they don't get combined
	     */
	    let cannotUseExistingDeclaration = hasNamedSpecifiers && isNamespaceImport || hasNamespaceSpecifier && isNamedImport || hasNamespaceSpecifier && isNamespaceImport;
	    if (!cannotUseExistingDeclaration && declaration) {
	      let specifier = declaration.get('specifiers').find(spec => matchSpecifier(spec, exportedName));
	      if (specifier && ((_a = target.scope.getBinding(specifier.node.local.name)) === null || _a === void 0 ? void 0 : _a.kind) === 'module') {
	        return this.t.identifier(specifier.node.local.name);
	      } else {
	        return this.addSpecifier(target, declaration, exportedName, preferredName);
	      }
	    } else {
	      let declaration = this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
	      return this.addSpecifier(target, declaration, exportedName, preferredName);
	    }
	  }
	  importForSideEffect(moduleSpecifier) {
	    let declaration = this.findImportFrom(moduleSpecifier);
	    if (!declaration) {
	      this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
	    }
	  }
	  replaceWith(target, fn) {
	    return this.mutate(i => {
	      target.replaceWith(fn(i));
	      // the return value of replaceWith is not a reliable way to get the
	      // updated path, at least in the case where the user replaced an
	      // expression with a statement. Instead we will rely on the fact that path
	      // replacement also mutates its argument, so `target` now points at the
	      // newly replaced path.
	      return target;
	    }, defaultNameHint(target));
	  }
	  insertAfter(target, fn) {
	    return this.mutate(i => target.insertAfter(fn(i))[0], defaultNameHint(target));
	  }
	  insertBefore(target, fn) {
	    return this.mutate(i => target.insertBefore(fn(i))[0], defaultNameHint(target));
	  }
	  // Low-level method for when you don't want to use our higher-level methods
	  // (replaceWith, insertBefore, insertAfter)
	  mutate(fn, defaultNameHint) {
	    let symbols = new Map();
	    const importer = {
	      import: (moduleSpecifier, exportedName, nameHint) => {
	        let identifier = this.t.identifier('__babel_import_util_placeholder__');
	        symbols.set(identifier, {
	          moduleSpecifier,
	          exportedName,
	          nameHint
	        });
	        return identifier;
	      }
	    };
	    const updateReference = path => {
	      if (!path.isIdentifier()) {
	        return;
	      }
	      let hit = symbols.get(path.node);
	      if (hit) {
	        let newIdentifier = this.unreferencedImport(path, hit.moduleSpecifier, hit.exportedName, desiredName(hit.nameHint, hit.exportedName, defaultNameHint));
	        path.replaceWith(newIdentifier);
	        let binding = path.scope.getBinding(newIdentifier.name);
	        if (!binding) {
	          // we create the binding at the point where we add the import, so this
	          // would indicate broken behavior
	          throw new Error(`bug: this is supposed to never happen`);
	        }
	        binding.reference(path);
	      }
	    };
	    let result = fn(importer);
	    updateReference(result);
	    this.babel.traverse(result.node, {
	      ReferencedIdentifier: path => {
	        updateReference(path);
	      }
	    }, result.scope, {}, result);
	    return result;
	  }
	  addSpecifier(target, declaration, exportedName, preferredName) {
	    let local = this.t.identifier(unusedNameLike(target, preferredName));
	    let specifier = this.buildSpecifier(exportedName, local);
	    let added;
	    if (specifier.type === 'ImportDefaultSpecifier') {
	      declaration.node.specifiers.unshift(specifier);
	      added = declaration.get(`specifiers.0`);
	    } else {
	      declaration.node.specifiers.push(specifier);
	      added = declaration.get(`specifiers.${declaration.node.specifiers.length - 1}`);
	    }
	    declaration.scope.registerBinding('module', added);
	    return local;
	  }
	  buildSpecifier(exportedName, localName) {
	    switch (exportedName) {
	      case 'default':
	        return this.t.importDefaultSpecifier(localName);
	      case '*':
	        return this.t.importNamespaceSpecifier(localName);
	      default:
	        return this.t.importSpecifier(localName, this.t.identifier(exportedName));
	    }
	  }
	  findImportFrom(moduleSpecifier) {
	    for (let path of this.program.get('body')) {
	      if (path.isImportDeclaration() && path.node.source.value === moduleSpecifier && path.node.importKind !== 'type') {
	        return path;
	      }
	    }
	    return undefined;
	  }
	  insertAfterExistingImports(statement) {
	    let lastIndex;
	    for (let [index, node] of this.program.node.body.entries()) {
	      if (node.type === 'ImportDeclaration') {
	        lastIndex = index;
	      }
	    }
	    if (lastIndex == null) {
	      // we are intentionally not using babel's container-aware methods, because
	      // while in theory it's nice that they schedule other plugins to run on
	      // our nodes, in practice those nodes might get mutated or removed by some
	      // other plugin in the intervening time causing failures.
	      this.program.node.body.unshift(statement);
	      return this.program.get('body.0');
	    } else {
	      this.program.node.body.splice(lastIndex + 1, 0, statement);
	      return this.program.get(`body.${lastIndex + 1}`);
	    }
	  }
	}
	src.ImportUtil = ImportUtil;
	function unusedNameLike(path, name) {
	  let candidate = name;
	  let counter = 0;
	  while (path.scope.hasBinding(candidate)) {
	    candidate = `${name}${counter++}`;
	  }
	  return candidate;
	}
	function name(node) {
	  if (node.type === 'StringLiteral') {
	    return node.value;
	  } else {
	    return node.name;
	  }
	}
	function desiredName(nameHint, exportedName, defaultNameHint) {
	  if (nameHint) {
	    return (0, sanitize_1.sanitize)(nameHint);
	  }
	  if (exportedName === 'default' || exportedName === '*') {
	    return defaultNameHint !== null && defaultNameHint !== void 0 ? defaultNameHint : 'a';
	  } else {
	    return exportedName;
	  }
	}
	function defaultNameHint(target) {
	  if (target === null || target === void 0 ? void 0 : target.isIdentifier()) {
	    return target.node.name;
	  } else if (target) {
	    return target.scope.generateUidIdentifierBasedOnNode(target.node).name;
	  } else {
	    return undefined;
	  }
	}
	function matchSpecifier(spec, exportedName) {
	  switch (exportedName) {
	    case 'default':
	      return spec.isImportDefaultSpecifier();
	    case '*':
	      return spec.isImportNamespaceSpecifier();
	    default:
	      return spec.isImportSpecifier() && name(spec.node.imported) === exportedName;
	  }
	}
	function matchModule(path, moduleSpecifier) {
	  return path.isImportDeclaration() && path.get('source').node.value === moduleSpecifier;
	}
	return src;
}

var expressionParser = {};

var scopeLocals = {};

var hbsUtils = {};

var hasRequiredHbsUtils;

function requireHbsUtils () {
	if (hasRequiredHbsUtils) return hbsUtils;
	hasRequiredHbsUtils = 1;

	Object.defineProperty(hbsUtils, "__esModule", {
	  value: true
	});
	hbsUtils.astNodeHasBinding = astNodeHasBinding;
	function astNodeHasBinding(target, name) {
	  var _a;
	  let cursor = target;
	  while (cursor) {
	    let parentNode = (_a = cursor.parent) === null || _a === void 0 ? void 0 : _a.node;
	    if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'ElementNode' && parentNode.blockParams.includes(name) &&
	    // an ElementNode's block params are valid only within its children
	    parentNode.children.includes(cursor.node)) {
	      return true;
	    }
	    if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) === 'Block' && parentNode.blockParams.includes(name) &&
	    // a Block's blockParams are valid only within its body
	    parentNode.body.includes(cursor.node)) {
	      return true;
	    }
	    cursor = cursor.parent;
	  }
	  return false;
	}
	return hbsUtils;
}

var readOnlyArray = {};

var hasRequiredReadOnlyArray;

function requireReadOnlyArray () {
	if (hasRequiredReadOnlyArray) return readOnlyArray;
	hasRequiredReadOnlyArray = 1;

	Object.defineProperty(readOnlyArray, "__esModule", {
	  value: true
	});
	readOnlyArray.readOnlyArray = readOnlyArray$1;
	const mutationMethods = ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];
	function readOnlyArray$1(array, message = 'Forbidden array mutation') {
	  return new Proxy(array, {
	    get(target, prop) {
	      if (typeof prop === 'string' && mutationMethods.includes(prop)) {
	        return () => {
	          throw new Error(message);
	        };
	      }
	      return Reflect.get(target, prop);
	    },
	    set(_target, _prop) {
	      throw new Error(message);
	    },
	    deleteProperty() {
	      throw new Error(message);
	    }
	  });
	}
	return readOnlyArray;
}

var hasRequiredScopeLocals;

function requireScopeLocals () {
	if (hasRequiredScopeLocals) return scopeLocals;
	hasRequiredScopeLocals = 1;
	(function (exports) {

		/*
		  This class exists because:
		   - before template compilation starts, we need to pass a `locals` array to
		     ember-template-compiler
		   - the JSUtils API can mutate the scope during template compilation
		   - those scope mutations need to update both the original `locals` array and
		     our own name mapping, keeping them in sync.
		*/
		var __classPrivateFieldSet = scopeLocals && scopeLocals.__classPrivateFieldSet || function (receiver, state, value, kind, f) {
		  if (kind === "m") throw new TypeError("Private method is not writable");
		  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
		};
		var __classPrivateFieldGet = scopeLocals && scopeLocals.__classPrivateFieldGet || function (receiver, state, kind, f) {
		  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
		};
		var _ScopeLocals_instances, _ScopeLocals_mapping, _ScopeLocals_locals, _ScopeLocals_params, _ScopeLocals_isInJsScope;
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.ScopeLocals = exports.ALLOWED_GLOBALS = void 0;
		const hbs_utils_1 = /*@__PURE__*/ requireHbsUtils();
		const read_only_array_1 = /*@__PURE__*/ requireReadOnlyArray();
		/**
		 * RFC: https://github.com/emberjs/rfcs/pull/1070
		 *
		 * Criteria for inclusion in this list:
		 *
		 *   Any of:
		 *     - begins with an uppercase letter
		 *     - guaranteed to never be added to glimmer as a keyword (e.g.: globalThis)
		 *
		 *   And:
		 *     - must not need new to invoke
		 *     - must not require lifetime management (e.g.: setTimeout)
		 *     - must not be a single-word lower-case API, because of potential collision with future new HTML elements
		 *     - if the API is a function, the return value should not be a promise
		 *     - must be one one of these lists:
		 *        - https://tc39.es/ecma262/#sec-global-object
		 *        - https://tc39.es/ecma262/#sec-function-properties-of-the-global-object
		 *        - https://html.spec.whatwg.org/multipage/nav-history-apis.html#window
		 *        - https://html.spec.whatwg.org/multipage/indices.html#all-interfaces
		 *        - https://html.spec.whatwg.org/multipage/webappapis.html
		 */
		exports.ALLOWED_GLOBALS = new Set([
		// ////////////////
		// namespaces
		// ////////////////
		//   TC39
		'globalThis', 'Atomics', 'JSON', 'Math', 'Reflect',
		//   WHATWG
		'localStorage', 'sessionStorage',
		// ////////////////
		// functions / utilities
		// ////////////////
		//   TC39
		'isNaN', 'isFinite', 'parseInt', 'parseFloat', 'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
		//   WHATWG
		'postMessage', 'structuredClone',
		// ////////////////
		// new-less Constructors (still functions)
		// ////////////////
		//   TC39
		'Array',
		// different behavior from (array)
		'BigInt', 'Boolean', 'Date', 'Number', 'Object',
		// different behavior from (hash)
		'String',
		// ////////////////
		// Values
		// ////////////////
		//   TC39
		'Infinity', 'NaN',
		//   WHATWG
		'isSecureContext']);
		class ScopeLocals {
		  constructor(params) {
		    _ScopeLocals_instances.add(this);
		    _ScopeLocals_mapping.set(this, {});
		    _ScopeLocals_locals.set(this, []);
		    _ScopeLocals_params.set(this, void 0);
		    __classPrivateFieldSet(this, _ScopeLocals_params, params, "f");
		  }
		  get locals() {
		    return (0, read_only_array_1.readOnlyArray)(__classPrivateFieldGet(this, _ScopeLocals_locals, "f"), 'The only supported way to manipulate locals is via the jsutils API\nhttps://github.com/emberjs/babel-plugin-ember-template-compilation#jsutils-manipulating-javascript-from-within-ast-transforms');
		  }
		  has(key) {
		    return key in __classPrivateFieldGet(this, _ScopeLocals_mapping, "f");
		  }
		  get(key) {
		    return __classPrivateFieldGet(this, _ScopeLocals_mapping, "f")[key];
		  }
		  isEmpty() {
		    return __classPrivateFieldGet(this, _ScopeLocals_locals, "f").length === 0;
		  }
		  entries() {
		    return Object.entries(__classPrivateFieldGet(this, _ScopeLocals_mapping, "f"));
		  }
		  add(hbsName, jsName) {
		    __classPrivateFieldGet(this, _ScopeLocals_mapping, "f")[hbsName] = jsName !== null && jsName !== void 0 ? jsName : hbsName;
		    if (!__classPrivateFieldGet(this, _ScopeLocals_locals, "f").includes(hbsName)) {
		      __classPrivateFieldGet(this, _ScopeLocals_locals, "f").push(hbsName);
		    }
		  }
		  // this AST transform discovers all possible upvars in HBS that refer to valid
		  // bindings in JS, and then depending on the mode adjusts our actual scope bag
		  // contents.
		  crawl() {
		    return _env => {
		      let seen;
		      return {
		        name: 'scope-locals-crawl',
		        visitor: {
		          Template: {
		            enter: () => {
		              seen = new Set();
		            },
		            exit: (_node, _path) => {
		              if (__classPrivateFieldGet(this, _ScopeLocals_params, "f").mode === 'implicit') {
		                // all hbs upvars that have matching JS bindings go into the
		                // scope
		                for (let name of seen) {
		                  if (name === 'this') {
		                    if (__classPrivateFieldGet(this, _ScopeLocals_params, "f").mayUseLexicalThis) {
		                      this.add(name);
		                    }
		                  } else if (__classPrivateFieldGet(this, _ScopeLocals_instances, "m", _ScopeLocals_isInJsScope).call(this, name, __classPrivateFieldGet(this, _ScopeLocals_params, "f").jsPath)) {
		                    this.add(name);
		                  }
		                }
		              } else {
		                // in explicit form, we might prune back the preexising scope in
		                // the case where another AST transform has eliminated the use
		                // of the original binding. But we don't add anything new. The
		                // only way for new bindings to be introduced into scope is for
		                // another AST transform to explicitly call the jsutils, which
		                // calls our `add`.
		                for (let name of Object.keys(__classPrivateFieldGet(this, _ScopeLocals_mapping, "f"))) {
		                  if (!seen.has(name)) {
		                    __classPrivateFieldGet(this, _ScopeLocals_locals, "f").splice(__classPrivateFieldGet(this, _ScopeLocals_locals, "f").indexOf(name), 1);
		                    delete __classPrivateFieldGet(this, _ScopeLocals_mapping, "f")[name];
		                  }
		                }
		              }
		            }
		          },
		          PathExpression: (node, path) => {
		            switch (node.head.type) {
		              case 'ThisHead':
		                if (!(0, hbs_utils_1.astNodeHasBinding)(path, 'this')) {
		                  seen.add('this');
		                }
		                break;
		              case 'VarHead':
		                {
		                  const name = node.head.name;
		                  if (!(0, hbs_utils_1.astNodeHasBinding)(path, name)) {
		                    seen.add(name);
		                  }
		                }
		            }
		          },
		          ElementNode: (node, path) => {
		            const name = node.tag.split('.')[0];
		            if (!(0, hbs_utils_1.astNodeHasBinding)(path, name)) {
		              seen.add(name);
		            }
		          }
		        }
		      };
		    };
		  }
		}
		exports.ScopeLocals = ScopeLocals;
		_ScopeLocals_mapping = new WeakMap(), _ScopeLocals_locals = new WeakMap(), _ScopeLocals_params = new WeakMap(), _ScopeLocals_instances = new WeakSet(), _ScopeLocals_isInJsScope = function _ScopeLocals_isInJsScope(hbsName, jsPath) {
		  var _a;
		  let jsName = (_a = __classPrivateFieldGet(this, _ScopeLocals_mapping, "f")[hbsName]) !== null && _a !== void 0 ? _a : hbsName;
		  return exports.ALLOWED_GLOBALS.has(jsName) || jsPath.scope.getBinding(jsName);
		}; 
	} (scopeLocals));
	return scopeLocals;
}

var hasRequiredExpressionParser;

function requireExpressionParser () {
	if (hasRequiredExpressionParser) return expressionParser;
	hasRequiredExpressionParser = 1;

	Object.defineProperty(expressionParser, "__esModule", {
	  value: true
	});
	expressionParser.ExpressionParser = void 0;
	const scope_locals_1 = /*@__PURE__*/ requireScopeLocals();
	class ExpressionParser {
	  constructor(babel) {
	    this.babel = babel;
	  }
	  parseExpression(invokedName, path) {
	    switch (path.node.type) {
	      case 'ObjectExpression':
	        return this.parseObjectExpression(invokedName, path);
	      case 'ArrayExpression':
	        {
	          return this.parseArrayExpression(invokedName, path);
	        }
	      case 'StringLiteral':
	      case 'BooleanLiteral':
	      case 'NumericLiteral':
	        return path.node.value;
	      default:
	        throw path.buildCodeFrameError(`${invokedName} can only accept static options but you passed ${JSON.stringify(path.node)}`);
	    }
	  }
	  parseArrayExpression(invokedName, path) {
	    return path.get('elements').map(element => {
	      if (element.isSpreadElement()) {
	        throw element.buildCodeFrameError(`spread element is not allowed here`);
	      } else if (element.isExpression()) {
	        return this.parseExpression(invokedName, element);
	      }
	      return null;
	    });
	  }
	  parseScope(invokedName, path) {
	    let body = undefined;
	    if (path.node.type === 'ObjectMethod') {
	      body = path.node.body;
	    } else {
	      let {
	        value
	      } = path.node;
	      if (this.t.isObjectExpression(value)) {
	        throw path.buildCodeFrameError(`Passing an object as the \`scope\` property to inline templates is no longer supported. Please pass a function that returns an object expression instead.`);
	      }
	      if (this.t.isFunctionExpression(value) || this.t.isArrowFunctionExpression(value)) {
	        body = value.body;
	      }
	    }
	    let objExpression = undefined;
	    if ((body === null || body === void 0 ? void 0 : body.type) === 'ObjectExpression') {
	      objExpression = body;
	    } else if ((body === null || body === void 0 ? void 0 : body.type) === 'BlockStatement') {
	      // SAFETY: We know that the body is a ReturnStatement because we're checking inside
	      let returnStatements = body.body.filter(statement => statement.type === 'ReturnStatement');
	      if (returnStatements.length !== 1) {
	        throw new Error('Scope functions must have a single return statement which returns an object expression containing references to in-scope values');
	      }
	      objExpression = returnStatements[0].argument;
	    }
	    if ((objExpression === null || objExpression === void 0 ? void 0 : objExpression.type) !== 'ObjectExpression') {
	      throw path.buildCodeFrameError(`Scope objects for \`${invokedName}\` must be an object expression containing only references to in-scope values, or a function that returns an object expression containing only references to in-scope values`);
	    }
	    return objExpression.properties.reduce((res, prop) => {
	      if (this.t.isSpreadElement(prop)) {
	        throw path.buildCodeFrameError(`Scope objects for \`${invokedName}\` may not contain spread elements`);
	      }
	      if (this.t.isObjectMethod(prop)) {
	        throw path.buildCodeFrameError(`Scope objects for \`${invokedName}\` may not contain methods`);
	      }
	      let {
	        key,
	        value
	      } = prop;
	      if (!this.t.isStringLiteral(key) && !this.t.isIdentifier(key)) {
	        throw path.buildCodeFrameError(`Scope objects for \`${invokedName}\` may only contain static property names`);
	      }
	      let propName = name(key);
	      switch (value.type) {
	        case 'Identifier':
	          res.add(propName, value.name);
	          break;
	        case 'ThisExpression':
	          res.add(propName, 'this');
	          break;
	        default:
	          throw path.buildCodeFrameError(`Scope objects for \`${invokedName}\` may only contain direct references to in-scope values, e.g. { ${propName} } or { ${propName}: ${propName} }. Found ${value.type}`);
	      }
	      return res;
	    }, new scope_locals_1.ScopeLocals({
	      mode: 'explicit'
	    }));
	  }
	  parseEval(invokedName, path) {
	    let body;
	    if (path.isObjectMethod()) {
	      body = path.get('body');
	    } else if (path.isObjectProperty()) {
	      let value = path.get('value');
	      if (value.isFunctionExpression()) {
	        body = value.get('body');
	      } else {
	        throw path.buildCodeFrameError(`unsupported syntax for \`eval\` parameter to \`${invokedName}\`. It must be an object method or a function.`);
	      }
	    } else {
	      throw path.buildCodeFrameError(`unsupported syntax for \`eval\` parameter to \`${invokedName}\`. It must be an object method or a function.`);
	    }
	    let returnStatements = body.get('body').filter(statement => statement.isReturnStatement());
	    if (returnStatements.length !== 1) {
	      throw body.buildCodeFrameError('eval function must have a single return statement');
	    }
	    let returnExpression = returnStatements[0].get('argument');
	    if (!returnExpression.isCallExpression()) {
	      throw returnStatements[0].buildCodeFrameError('eval function must return `eval(arguments[0])`. Found non-CallExpression.');
	    }
	    let callee = returnExpression.get('callee');
	    if (!callee.isIdentifier() || callee.node.name !== 'eval') {
	      throw returnExpression.buildCodeFrameError('eval function must return `eval(arguments[0])`. Found callee is not eval.');
	    }
	    let args = returnExpression.get('arguments');
	    if (args.length !== 1) {
	      throw returnExpression.buildCodeFrameError('eval function must return `eval(arguments[0])`. Found incorrect number of arguments.');
	    }
	    let arg = args[0];
	    if (!arg.isMemberExpression()) {
	      throw arg.buildCodeFrameError('eval function must return `eval(arguments[0])`. Found argument is non-MemberExpression.');
	    }
	    let obj = arg.get('object');
	    if (!obj.isIdentifier() || obj.node.name !== 'arguments') {
	      throw obj.buildCodeFrameError('eval function must return `eval(arguments[0])`. Found wrong argument to eval.');
	    }
	    let prop = arg.get('property');
	    if (!prop.isNumericLiteral() || prop.node.value !== 0) {
	      throw prop.buildCodeFrameError('eval function must return `eval(arguments[0])`. Found wrong property.');
	    }
	    return {
	      isEval: true
	    };
	  }
	  parseObjectExpression(invokedName, path, shouldParseScope = false, shouldSupportRFC931 = false) {
	    let result = {};
	    path.get('properties').forEach(property => {
	      let {
	        node
	      } = property;
	      if (this.t.isSpreadElement(node)) {
	        throw property.buildCodeFrameError(`${invokedName} does not allow spread element`);
	      }
	      if (node.computed) {
	        throw property.buildCodeFrameError(`${invokedName} can only accept static property names`);
	      }
	      let {
	        key
	      } = node;
	      if (!this.t.isIdentifier(key) && !this.t.isStringLiteral(key)) {
	        throw property.buildCodeFrameError(`${invokedName} can only accept static property names`);
	      }
	      let propertyName = name(key);
	      if (shouldParseScope && propertyName === 'scope') {
	        result.scope = this.parseScope(invokedName, property);
	      } else if (shouldSupportRFC931 && propertyName === 'eval') {
	        result.eval = this.parseEval(invokedName, property);
	      } else if (shouldSupportRFC931 && propertyName === 'component') {
	        result.component = property.get('value');
	      } else {
	        if (this.t.isObjectMethod(node)) {
	          throw property.buildCodeFrameError(`${invokedName} does not accept a method for ${propertyName}`);
	        }
	        let valuePath = property.get('value');
	        if (!valuePath.isExpression()) {
	          throw valuePath.buildCodeFrameError(`must be an expression`);
	        }
	        result[propertyName] = this.parseExpression(invokedName, valuePath);
	      }
	    });
	    return result;
	  }
	  get t() {
	    return this.babel.types;
	  }
	}
	expressionParser.ExpressionParser = ExpressionParser;
	function name(node) {
	  if (node.type === 'StringLiteral') {
	    return node.value;
	  } else {
	    return node.name;
	  }
	}
	return expressionParser;
}

var jsUtils = {};

var hasRequiredJsUtils;

function requireJsUtils () {
	if (hasRequiredJsUtils) return jsUtils;
	hasRequiredJsUtils = 1;

	var __classPrivateFieldSet = jsUtils && jsUtils.__classPrivateFieldSet || function (receiver, state, value, kind, f) {
	  if (kind === "m") throw new TypeError("Private method is not writable");
	  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var __classPrivateFieldGet = jsUtils && jsUtils.__classPrivateFieldGet || function (receiver, state, kind, f) {
	  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _JSUtils_instances, _JSUtils_babel, _JSUtils_state, _JSUtils_template, _JSUtils_addedBinding, _JSUtils_importer, _JSUtils_emitStatement, _JSUtils_parseExpression, _ExpressionContext_importer, _ExpressionContext_target;
	Object.defineProperty(jsUtils, "__esModule", {
	  value: true
	});
	jsUtils.JSUtils = void 0;
	const hbs_utils_1 = /*@__PURE__*/ requireHbsUtils();
	// This exists to give AST plugins a controlled interface for influencing the
	// surrounding Javascript scope
	class JSUtils {
	  constructor(babel, state, template, addedBinding, importer) {
	    _JSUtils_instances.add(this);
	    _JSUtils_babel.set(this, void 0);
	    _JSUtils_state.set(this, void 0);
	    _JSUtils_template.set(this, void 0);
	    _JSUtils_addedBinding.set(this, void 0);
	    _JSUtils_importer.set(this, void 0);
	    __classPrivateFieldSet(this, _JSUtils_babel, babel, "f");
	    __classPrivateFieldSet(this, _JSUtils_state, state, "f");
	    __classPrivateFieldSet(this, _JSUtils_template, template, "f");
	    __classPrivateFieldSet(this, _JSUtils_addedBinding, addedBinding, "f");
	    __classPrivateFieldSet(this, _JSUtils_importer, importer, "f");
	    if (!__classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath) {
	      let target;
	      for (let statement of __classPrivateFieldGet(this, _JSUtils_state, "f").program.get('body')) {
	        if (!statement.isImportDeclaration()) {
	          break;
	        }
	        target = statement;
	      }
	      if (target) {
	        __classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath = target;
	      }
	    }
	  }
	  /**
	   * Create a new binding that you can use in your template, initialized with
	   * the given Javascript expression.
	   *
	   * @param { Expression } expression A javascript expression whose value will
	   * initialize your new binding. See docs on the Expression type for details.
	   * @param target The location within your template where the binding will be
	   * used. This matters so we can avoid naming collisions.
	   * @param opts.nameHint Optionally, provide a descriptive name for your new
	   * binding. We will mangle this name as needed to avoid collisions, but
	   * picking a good name here can aid in debugging.
	   *
	   * @return The name you can use in your template to access the binding.
	   */
	  bindExpression(expression, target, opts) {
	    var _a;
	    let name = unusedNameLike((_a = opts === null || opts === void 0 ? void 0 : opts.nameHint) !== null && _a !== void 0 ? _a : 'a', candidate => __classPrivateFieldGet(this, _JSUtils_template, "f").scope.hasBinding(candidate) || (0, hbs_utils_1.astNodeHasBinding)(target, candidate));
	    let t = __classPrivateFieldGet(this, _JSUtils_babel, "f").types;
	    let declaration = __classPrivateFieldGet(this, _JSUtils_instances, "m", _JSUtils_emitStatement).call(this, t.variableDeclaration('let', [t.variableDeclarator(t.identifier(name), __classPrivateFieldGet(this, _JSUtils_instances, "m", _JSUtils_parseExpression).call(this, __classPrivateFieldGet(this, _JSUtils_state, "f").program, expression))]));
	    declaration.scope.registerBinding('let', declaration.get('declarations.0'));
	    __classPrivateFieldGet(this, _JSUtils_addedBinding, "f").call(this, name);
	    return name;
	  }
	  /**
	   * Gain access to an imported value within your template.
	   *
	   * @param moduleSpecifier The path to import from.
	   * @param exportedName The named export you wish to access, or "default" for
	   * the default export, or "*" for the namespace export.
	   * @param target The location within your template where the binding will be
	   * used. This matters so we can avoid naming collisions.
	   * @param opts.nameHint Optionally, provide a descriptive name for your new
	   * binding. We will mangle this name as needed to avoid collisions, but
	   * picking a good name here can aid in debugging.
	   *
	   * @return The name you can use in your template to access the imported value.
	   */
	  bindImport(moduleSpecifier, exportedName, target, opts) {
	    // This will discover or create the local name for accessing the given import.
	    let importedIdentifier = __classPrivateFieldGet(this, _JSUtils_importer, "f").import(__classPrivateFieldGet(this, _JSUtils_template, "f"), moduleSpecifier, exportedName, opts === null || opts === void 0 ? void 0 : opts.nameHint);
	    // Simple base case: the JS name that's available is also unused at our spot
	    // in HBS, so just use it.
	    if (!(0, hbs_utils_1.astNodeHasBinding)(target, importedIdentifier.name)) {
	      __classPrivateFieldGet(this, _JSUtils_addedBinding, "f").call(this, importedIdentifier.name);
	      return importedIdentifier.name;
	    }
	    // The importedIdentifier that we have in Javascript is not usable within
	    // our HBS because it's shadowed by a block param. So we will introduce a
	    // second name via a variable declaration.
	    //
	    // The reason we don't force the import itself to have this name is that
	    // we might be re-using an existing import, and we don't want to go
	    // rewriting all of its callsites that are unrelated to us.
	    let identifier = unusedNameLike(importedIdentifier.name, candidate => __classPrivateFieldGet(this, _JSUtils_template, "f").scope.hasBinding(candidate) || (0, hbs_utils_1.astNodeHasBinding)(target, candidate));
	    let t = __classPrivateFieldGet(this, _JSUtils_babel, "f").types;
	    let declaration = __classPrivateFieldGet(this, _JSUtils_instances, "m", _JSUtils_emitStatement).call(this, t.variableDeclaration('let', [t.variableDeclarator(t.identifier(identifier), importedIdentifier)]));
	    declaration.scope.registerBinding('let', declaration.get('declarations.0'));
	    __classPrivateFieldGet(this, _JSUtils_addedBinding, "f").call(this, identifier);
	    return identifier;
	  }
	  /**
	   * Add an import statement purely for side effect.
	   *
	   * @param moduleSpecifier the module to import
	   */
	  importForSideEffect(moduleSpecifier) {
	    __classPrivateFieldGet(this, _JSUtils_importer, "f").importForSideEffect(moduleSpecifier);
	  }
	  /**
	   * Emit a javascript expresison for side-effect. This only accepts
	   * expressions, not statements, because you should not introduce new bindings.
	   * To introduce a binding see bindExpression or bindImport instead.
	   *
	   * @param { Expression } expression A javascript expression whose value will
	   * initialize your new binding. See docs on the Expression type below for
	   * details.
	   */
	  emitExpression(expression) {
	    let t = __classPrivateFieldGet(this, _JSUtils_babel, "f").types;
	    __classPrivateFieldGet(this, _JSUtils_instances, "m", _JSUtils_emitStatement).call(this, t.expressionStatement(__classPrivateFieldGet(this, _JSUtils_instances, "m", _JSUtils_parseExpression).call(this, __classPrivateFieldGet(this, _JSUtils_state, "f").program, expression)));
	  }
	}
	jsUtils.JSUtils = JSUtils;
	_JSUtils_babel = new WeakMap(), _JSUtils_state = new WeakMap(), _JSUtils_template = new WeakMap(), _JSUtils_addedBinding = new WeakMap(), _JSUtils_importer = new WeakMap(), _JSUtils_instances = new WeakSet(), _JSUtils_emitStatement = function _JSUtils_emitStatement(statement) {
	  if (__classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath) {
	    __classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath = __classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath.insertAfter(statement)[0];
	  } else {
	    __classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath = __classPrivateFieldGet(this, _JSUtils_state, "f").program.unshiftContainer('body', statement)[0];
	  }
	  return __classPrivateFieldGet(this, _JSUtils_state, "f").lastInsertedPath;
	}, _JSUtils_parseExpression = function _JSUtils_parseExpression(target, expression) {
	  let expressionString;
	  if (typeof expression === 'string') {
	    expressionString = expression;
	  } else {
	    expressionString = expression(new ExpressionContext(__classPrivateFieldGet(this, _JSUtils_importer, "f"), target));
	  }
	  let parsed = __classPrivateFieldGet(this, _JSUtils_babel, "f").parse(expressionString);
	  if (!parsed) {
	    throw new Error(`JSUtils.bindExpression could not understand the expression: ${expressionString}`);
	  }
	  let statements = body(parsed);
	  if (statements.length !== 1) {
	    throw new Error(`JSUtils.bindExpression expected to find exactly one expression but found ${statements.length} in: ${expressionString}`);
	  }
	  let statement = statements[0];
	  if (statement.type !== 'ExpressionStatement') {
	    throw new Error(`JSUtils.bindExpression expected to find an expression but found ${statement.type} in: ${expressionString}`);
	  }
	  return statement.expression;
	};
	function unusedNameLike(desiredName, isUsed) {
	  let candidate = desiredName;
	  let counter = 0;
	  while (isUsed(candidate)) {
	    candidate = `${desiredName}${counter++}`;
	  }
	  return candidate;
	}
	function body(node) {
	  if (node.type === 'File') {
	    return node.program.body;
	  } else {
	    return node.body;
	  }
	}
	/**
	 * Allows you to construct an expression that relies on imported values.
	 */
	class ExpressionContext {
	  constructor(importer, target) {
	    _ExpressionContext_importer.set(this, void 0);
	    _ExpressionContext_target.set(this, void 0);
	    __classPrivateFieldSet(this, _ExpressionContext_importer, importer, "f");
	    __classPrivateFieldSet(this, _ExpressionContext_target, target, "f");
	  }
	  /**
	   * Find or create a local binding for the given import.
	   *
	   * @param moduleSpecifier The path to import from.
	   * @param exportedName The named export you wish to access, or "default" for
	   * the default export, or "*" for the namespace export.
	   * @param nameHint Optionally, provide a descriptive name for your new
	   * binding. We will mangle this name as needed to avoid collisions, but
	   * picking a good name here can aid in debugging.
	      * @return the local identifier for the imported value
	   */
	  import(moduleSpecifier, exportedName, nameHint) {
	    // this method in babel-import-util is the lower-level one that doesn't try
	    // to create valid references for us. It's our responsibility to do so. But
	    // that's OK here, because we have the same responsibility for every
	    // scope-bag identifier, not just the imported ones, and it will be easier
	    // to handle them all at once.
	    return __classPrivateFieldGet(this, _ExpressionContext_importer, "f").import(__classPrivateFieldGet(this, _ExpressionContext_target, "f"), moduleSpecifier, exportedName, nameHint).name;
	  }
	}
	_ExpressionContext_importer = new WeakMap(), _ExpressionContext_target = new WeakMap();
	return jsUtils;
}

var dev = {};

var hasRequiredDev;

function requireDev () {
	if (hasRequiredDev) return dev;
	hasRequiredDev = 1;

	const Char = {
	    NBSP: 0xa0,
	    QUOT: 0x22,
	    LT: 0x3c,
	    GT: 0x3e,
	    AMP: 0x26
	};
	// \x26 is ampersand, \xa0 is non-breaking space
	const ATTR_VALUE_REGEX_TEST = /["\x26\xa0]/u;
	const ATTR_VALUE_REGEX_REPLACE = new RegExp(ATTR_VALUE_REGEX_TEST.source, 'gu');
	const TEXT_REGEX_TEST = /[&<>\xa0]/u;
	const TEXT_REGEX_REPLACE = new RegExp(TEXT_REGEX_TEST.source, 'gu');
	function attrValueReplacer(char) {
	    switch(char.charCodeAt(0)){
	        case Char.NBSP:
	            return '&nbsp;';
	        case Char.QUOT:
	            return '&quot;';
	        case Char.AMP:
	            return '&amp;';
	        default:
	            return char;
	    }
	}
	function textReplacer(char) {
	    switch(char.charCodeAt(0)){
	        case Char.NBSP:
	            return '&nbsp;';
	        case Char.AMP:
	            return '&amp;';
	        case Char.LT:
	            return '&lt;';
	        case Char.GT:
	            return '&gt;';
	        default:
	            return char;
	    }
	}
	function escapeAttrValue(attrValue) {
	    if (ATTR_VALUE_REGEX_TEST.test(attrValue)) {
	        return attrValue.replace(ATTR_VALUE_REGEX_REPLACE, attrValueReplacer);
	    }
	    return attrValue;
	}
	function escapeText(text) {
	    if (TEXT_REGEX_TEST.test(text)) {
	        return text.replace(TEXT_REGEX_REPLACE, textReplacer);
	    }
	    return text;
	}
	function sortByLoc(a, b) {
	    // If either is invisible, don't try to order them
	    if (a.loc.isInvisible || b.loc.isInvisible) {
	        return 0;
	    }
	    if (a.loc.startPosition.line < b.loc.startPosition.line) {
	        return -1;
	    }
	    if (a.loc.startPosition.line === b.loc.startPosition.line && a.loc.startPosition.column < b.loc.startPosition.column) {
	        return -1;
	    }
	    if (a.loc.startPosition.line === b.loc.startPosition.line && a.loc.startPosition.column === b.loc.startPosition.column) {
	        return 0;
	    }
	    return 1;
	}

	const voidMap = new Set([
	    'area',
	    'base',
	    'br',
	    'col',
	    'command',
	    'embed',
	    'hr',
	    'img',
	    'input',
	    'keygen',
	    'link',
	    'meta',
	    'param',
	    'source',
	    'track',
	    'wbr'
	]);
	function getVoidTags() {
	    return [
	        ...voidMap
	    ];
	}
	const NON_WHITESPACE = /^\S/u;
	/**
	 * Examples when true:
	 *  - link
	 *  - liNK
	 *
	 * Examples when false:
	 *  - Link (component)
	 */ function isVoidTag(tag) {
	    return voidMap.has(tag.toLowerCase()) && tag[0]?.toLowerCase() === tag[0];
	}
	class Printer {
	    constructor(options){
	        this.buffer = '';
	        this.options = options;
	    }
	    /*
	    This is used by _all_ methods on this Printer class that add to `this.buffer`,
	    it allows consumers of the printer to use alternate string representations for
	    a given node.

	    The primary use case for this are things like source -> source codemod utilities.
	    For example, ember-template-recast attempts to always preserve the original string
	    formatting in each AST node if no modifications are made to it.
	  */ handledByOverride(node, ensureLeadingWhitespace = false) {
	        if (this.options.override !== undefined) {
	            let result = this.options.override(node, this.options);
	            if (typeof result === 'string') {
	                if (ensureLeadingWhitespace && NON_WHITESPACE.test(result)) {
	                    result = ` ${result}`;
	                }
	                this.buffer += result;
	                return true;
	            }
	        }
	        return false;
	    }
	    Node(node) {
	        switch(node.type){
	            case 'MustacheStatement':
	            case 'BlockStatement':
	            case 'MustacheCommentStatement':
	            case 'CommentStatement':
	            case 'TextNode':
	            case 'ElementNode':
	            case 'AttrNode':
	            case 'Block':
	            case 'Template':
	                return this.TopLevelStatement(node);
	            case 'StringLiteral':
	            case 'BooleanLiteral':
	            case 'NumberLiteral':
	            case 'UndefinedLiteral':
	            case 'NullLiteral':
	            case 'PathExpression':
	            case 'SubExpression':
	                return this.Expression(node);
	            case 'ConcatStatement':
	                // should have an AttrNode parent
	                return this.ConcatStatement(node);
	            case 'Hash':
	                return this.Hash(node);
	            case 'HashPair':
	                return this.HashPair(node);
	            case 'ElementModifierStatement':
	                return this.ElementModifierStatement(node);
	        }
	    }
	    Expression(expression) {
	        switch(expression.type){
	            case 'StringLiteral':
	            case 'BooleanLiteral':
	            case 'NumberLiteral':
	            case 'UndefinedLiteral':
	            case 'NullLiteral':
	                return this.Literal(expression);
	            case 'PathExpression':
	                return this.PathExpression(expression);
	            case 'SubExpression':
	                return this.SubExpression(expression);
	        }
	    }
	    Literal(literal) {
	        switch(literal.type){
	            case 'StringLiteral':
	                return this.StringLiteral(literal);
	            case 'BooleanLiteral':
	                return this.BooleanLiteral(literal);
	            case 'NumberLiteral':
	                return this.NumberLiteral(literal);
	            case 'UndefinedLiteral':
	                return this.UndefinedLiteral(literal);
	            case 'NullLiteral':
	                return this.NullLiteral(literal);
	        }
	    }
	    TopLevelStatement(statement) {
	        switch(statement.type){
	            case 'MustacheStatement':
	                return this.MustacheStatement(statement);
	            case 'BlockStatement':
	                return this.BlockStatement(statement);
	            case 'MustacheCommentStatement':
	                return this.MustacheCommentStatement(statement);
	            case 'CommentStatement':
	                return this.CommentStatement(statement);
	            case 'TextNode':
	                return this.TextNode(statement);
	            case 'ElementNode':
	                return this.ElementNode(statement);
	            case 'Block':
	                return this.Block(statement);
	            case 'Template':
	                return this.Template(statement);
	            case 'AttrNode':
	                // should have element
	                return this.AttrNode(statement);
	        }
	    }
	    Template(template) {
	        this.TopLevelStatements(template.body);
	    }
	    Block(block) {
	        /*
	      When processing a template like:

	      ```hbs
	      {{#if whatever}}
	        whatever
	      {{else if somethingElse}}
	        something else
	      {{else}}
	        fallback
	      {{/if}}
	      ```

	      The AST still _effectively_ looks like:

	      ```hbs
	      {{#if whatever}}
	        whatever
	      {{else}}{{#if somethingElse}}
	        something else
	      {{else}}
	        fallback
	      {{/if}}{{/if}}
	      ```

	      The only way we can tell if that is the case is by checking for
	      `block.chained`, but unfortunately when the actual statements are
	      processed the `block.body[0]` node (which will always be a
	      `BlockStatement`) has no clue that its ancestor `Block` node was
	      chained.

	      This "forwards" the `chained` setting so that we can check
	      it later when processing the `BlockStatement`.
	    */ if (block.chained) {
	            let firstChild = block.body[0];
	            firstChild.chained = true;
	        }
	        if (this.handledByOverride(block)) {
	            return;
	        }
	        this.TopLevelStatements(block.body);
	    }
	    TopLevelStatements(statements) {
	        statements.forEach((statement)=>this.TopLevelStatement(statement));
	    }
	    ElementNode(el) {
	        if (this.handledByOverride(el)) {
	            return;
	        }
	        this.OpenElementNode(el);
	        this.TopLevelStatements(el.children);
	        this.CloseElementNode(el);
	    }
	    OpenElementNode(el) {
	        this.buffer += `<${el.tag}`;
	        const parts = [
	            ...el.attributes,
	            ...el.modifiers,
	            ...el.comments
	        ].sort(sortByLoc);
	        for (const part of parts){
	            this.buffer += ' ';
	            switch(part.type){
	                case 'AttrNode':
	                    this.AttrNode(part);
	                    break;
	                case 'ElementModifierStatement':
	                    this.ElementModifierStatement(part);
	                    break;
	                case 'MustacheCommentStatement':
	                    this.MustacheCommentStatement(part);
	                    break;
	            }
	        }
	        if (el.blockParams.length) {
	            this.BlockParams(el.blockParams);
	        }
	        if (el.selfClosing) {
	            this.buffer += ' /';
	        }
	        this.buffer += '>';
	    }
	    CloseElementNode(el) {
	        if (el.selfClosing || isVoidTag(el.tag)) {
	            return;
	        }
	        this.buffer += `</${el.tag}>`;
	    }
	    AttrNode(attr) {
	        if (this.handledByOverride(attr)) {
	            return;
	        }
	        let { name, value } = attr;
	        this.buffer += name;
	        const isAttribute = !name.startsWith('@');
	        const shouldElideValue = isAttribute && value.type == 'TextNode' && value.chars.length === 0;
	        if (!shouldElideValue) {
	            this.buffer += '=';
	            this.AttrNodeValue(value);
	        }
	    }
	    AttrNodeValue(value) {
	        if (value.type === 'TextNode') {
	            let quote = '"';
	            if (this.options.entityEncoding === 'raw') {
	                if (value.chars.includes('"') && !value.chars.includes("'")) {
	                    quote = "'";
	                }
	            }
	            this.buffer += quote;
	            this.TextNode(value, quote);
	            this.buffer += quote;
	        } else {
	            this.Node(value);
	        }
	    }
	    TextNode(text, isInAttr) {
	        if (this.handledByOverride(text)) {
	            return;
	        }
	        if (this.options.entityEncoding === 'raw') {
	            if (isInAttr && text.chars.includes(isInAttr)) {
	                this.buffer += escapeAttrValue(text.chars);
	            } else {
	                this.buffer += text.chars;
	            }
	        } else if (isInAttr) {
	            this.buffer += escapeAttrValue(text.chars);
	        } else {
	            this.buffer += escapeText(text.chars);
	        }
	    }
	    MustacheStatement(mustache) {
	        if (this.handledByOverride(mustache)) {
	            return;
	        }
	        this.buffer += mustache.trusting ? '{{{' : '{{';
	        if (mustache.strip.open) {
	            this.buffer += '~';
	        }
	        this.Expression(mustache.path);
	        this.Params(mustache.params);
	        this.Hash(mustache.hash);
	        if (mustache.strip.close) {
	            this.buffer += '~';
	        }
	        this.buffer += mustache.trusting ? '}}}' : '}}';
	    }
	    BlockStatement(block) {
	        if (this.handledByOverride(block)) {
	            return;
	        }
	        if (block.chained) {
	            this.buffer += block.inverseStrip.open ? '{{~' : '{{';
	            this.buffer += 'else ';
	        } else {
	            this.buffer += block.openStrip.open ? '{{~#' : '{{#';
	        }
	        this.Expression(block.path);
	        this.Params(block.params);
	        this.Hash(block.hash);
	        if (block.program.blockParams.length) {
	            this.BlockParams(block.program.blockParams);
	        }
	        if (block.chained) {
	            this.buffer += block.inverseStrip.close ? '~}}' : '}}';
	        } else {
	            this.buffer += block.openStrip.close ? '~}}' : '}}';
	        }
	        this.Block(block.program);
	        if (block.inverse) {
	            if (!block.inverse.chained) {
	                this.buffer += block.inverseStrip.open ? '{{~' : '{{';
	                this.buffer += 'else';
	                this.buffer += block.inverseStrip.close ? '~}}' : '}}';
	            }
	            this.Block(block.inverse);
	        }
	        if (!block.chained) {
	            this.buffer += block.closeStrip.open ? '{{~/' : '{{/';
	            this.Expression(block.path);
	            this.buffer += block.closeStrip.close ? '~}}' : '}}';
	        }
	    }
	    BlockParams(blockParams) {
	        this.buffer += ` as |${blockParams.join(' ')}|`;
	    }
	    ConcatStatement(concat) {
	        if (this.handledByOverride(concat)) {
	            return;
	        }
	        this.buffer += '"';
	        concat.parts.forEach((part)=>{
	            if (part.type === 'TextNode') {
	                this.TextNode(part, '"');
	            } else {
	                this.Node(part);
	            }
	        });
	        this.buffer += '"';
	    }
	    MustacheCommentStatement(comment) {
	        if (this.handledByOverride(comment)) {
	            return;
	        }
	        this.buffer += `{{!--${comment.value}--}}`;
	    }
	    ElementModifierStatement(mod) {
	        if (this.handledByOverride(mod)) {
	            return;
	        }
	        this.buffer += '{{';
	        this.Expression(mod.path);
	        this.Params(mod.params);
	        this.Hash(mod.hash);
	        this.buffer += '}}';
	    }
	    CommentStatement(comment) {
	        if (this.handledByOverride(comment)) {
	            return;
	        }
	        this.buffer += `<!--${comment.value}-->`;
	    }
	    PathExpression(path) {
	        if (this.handledByOverride(path)) {
	            return;
	        }
	        this.buffer += path.original;
	    }
	    SubExpression(sexp) {
	        if (this.handledByOverride(sexp)) {
	            return;
	        }
	        this.buffer += '(';
	        this.Expression(sexp.path);
	        this.Params(sexp.params);
	        this.Hash(sexp.hash);
	        this.buffer += ')';
	    }
	    Params(params) {
	        // TODO: implement a top level Params AST node (just like the Hash object)
	        // so that this can also be overridden
	        if (params.length) {
	            params.forEach((param)=>{
	                this.buffer += ' ';
	                this.Expression(param);
	            });
	        }
	    }
	    Hash(hash) {
	        if (this.handledByOverride(hash, true)) {
	            return;
	        }
	        hash.pairs.forEach((pair)=>{
	            this.buffer += ' ';
	            this.HashPair(pair);
	        });
	    }
	    HashPair(pair) {
	        if (this.handledByOverride(pair)) {
	            return;
	        }
	        this.buffer += pair.key;
	        this.buffer += '=';
	        this.Node(pair.value);
	    }
	    StringLiteral(str) {
	        if (this.handledByOverride(str)) {
	            return;
	        }
	        this.buffer += JSON.stringify(str.value);
	    }
	    BooleanLiteral(bool) {
	        if (this.handledByOverride(bool)) {
	            return;
	        }
	        this.buffer += String(bool.value);
	    }
	    NumberLiteral(number) {
	        if (this.handledByOverride(number)) {
	            return;
	        }
	        this.buffer += String(number.value);
	    }
	    UndefinedLiteral(node) {
	        if (this.handledByOverride(node)) {
	            return;
	        }
	        this.buffer += 'undefined';
	    }
	    NullLiteral(node) {
	        if (this.handledByOverride(node)) {
	            return;
	        }
	        this.buffer += 'null';
	    }
	    print(node) {
	        let { options } = this;
	        if (options.override) {
	            let result = options.override(node, options);
	            if (result !== undefined) {
	                return result;
	            }
	        }
	        this.buffer = '';
	        this.Node(node);
	        return this.buffer;
	    }
	}

	function build(ast, options = {
	    entityEncoding: 'transformed'
	}) {
	    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- JS users
	    if (!ast) {
	        return '';
	    }
	    let printer = new Printer(options);
	    return printer.print(ast);
	}

	function isKeyword(word, type) {
	    if (word in KEYWORDS_TYPES) {
	        if (type === undefined) {
	            return true;
	        } else {
	            let types = KEYWORDS_TYPES[word];
	            // This seems like a TypeScript bug – it inferred types as never[]?
	            return types.includes(type);
	        }
	    } else {
	        return false;
	    }
	}
	/**
	 * This includes the full list of keywords currently in use in the template
	 * language, and where their valid usages are.
	 */ const KEYWORDS_TYPES = {
	    action: [
	        'Call',
	        'Modifier'
	    ],
	    component: [
	        'Call',
	        'Append',
	        'Block'
	    ],
	    debugger: [
	        'Append'
	    ],
	    'each-in': [
	        'Block'
	    ],
	    each: [
	        'Block'
	    ],
	    'has-block-params': [
	        'Call',
	        'Append'
	    ],
	    'has-block': [
	        'Call',
	        'Append'
	    ],
	    helper: [
	        'Call',
	        'Append'
	    ],
	    if: [
	        'Call',
	        'Append',
	        'Block'
	    ],
	    'in-element': [
	        'Block'
	    ],
	    let: [
	        'Block'
	    ],
	    log: [
	        'Call',
	        'Append'
	    ],
	    modifier: [
	        'Call',
	        'Modifier'
	    ],
	    mount: [
	        'Append'
	    ],
	    mut: [
	        'Call',
	        'Append'
	    ],
	    outlet: [
	        'Append'
	    ],
	    readonly: [
	        'Call',
	        'Append'
	    ],
	    unbound: [
	        'Call',
	        'Append'
	    ],
	    unless: [
	        'Call',
	        'Append',
	        'Block'
	    ],
	    yield: [
	        'Append'
	    ]
	};

	// import Logger from './logger';
	function assert(test, msg) {
	}

	function unwrap(val) {
	    return val;
	}
	function expect(val, message) {
	    return val;
	}

	function isPresentArray(list) {
	    return list ? list.length > 0 : false;
	}
	function asPresentArray(list, message = `unexpected empty list`) {
	    return list;
	}
	function getLast(list) {
	    return list.length === 0 ? undefined : list[list.length - 1];
	}
	function getFirst(list) {
	    return list.length === 0 ? undefined : list[0];
	}

	function dict() {
	    return Object.create(null);
	}

	const assign = Object.assign;

	/**
	 * This constant exists to make it easier to differentiate normal logs from
	 * errant console.logs. LOGGER can be used outside of LOCAL_TRACE_LOGGING checks,
	 * and is meant to be used in the rare situation where a console.* call is
	 * actually appropriate.
	 */ const LOGGER = console;
	function assertNever(value, desc = 'unexpected unreachable branch') {
	    LOGGER.log('unreachable', value);
	    LOGGER.log(`${desc} :: ${JSON.stringify(value)} (${value})`);
	    throw new Error(`code reached unreachable`);
	}

	var errorProps = [
	    'description',
	    'fileName',
	    'lineNumber',
	    'endLineNumber',
	    'message',
	    'name',
	    'number',
	    'stack'
	];
	function Exception(message, node) {
	    var loc = node && node.loc, line, endLineNumber, column, endColumn;
	    if (loc) {
	        line = loc.start.line;
	        endLineNumber = loc.end.line;
	        column = loc.start.column;
	        endColumn = loc.end.column;
	        message += ' - ' + line + ':' + column;
	    }
	    var tmp = Error.prototype.constructor.call(this, message);
	    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	    for(var idx = 0; idx < errorProps.length; idx++){
	        this[errorProps[idx]] = tmp[errorProps[idx]];
	    }
	    /* istanbul ignore else */ if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, Exception);
	    }
	    try {
	        if (loc) {
	            this.lineNumber = line;
	            this.endLineNumber = endLineNumber;
	            // Work around issue under safari where we can't directly set the column value
	            /* istanbul ignore next */ if (Object.defineProperty) {
	                Object.defineProperty(this, 'column', {
	                    value: column,
	                    enumerable: true
	                });
	                Object.defineProperty(this, 'endColumn', {
	                    value: endColumn,
	                    enumerable: true
	                });
	            } else {
	                this.column = column;
	                this.endColumn = endColumn;
	            }
	        }
	    } catch (nop) {
	    /* Ignore if the browser is very particular */ }
	}
	Exception.prototype = new Error();

	function Visitor() {
	    this.parents = [];
	}
	Visitor.prototype = {
	    constructor: Visitor,
	    mutating: false,
	    // Visits a given value. If mutating, will replace the value if necessary.
	    acceptKey: function(node, name) {
	        var value = this.accept(node[name]);
	        if (this.mutating) {
	            // Hacky sanity check: This may have a few false positives for type for the helper
	            // methods but will generally do the right thing without a lot of overhead.
	            if (value && !Visitor.prototype[value.type]) {
	                throw new Exception('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
	            }
	            node[name] = value;
	        }
	    },
	    // Performs an accept operation with added sanity check to ensure
	    // required keys are not removed.
	    acceptRequired: function(node, name) {
	        this.acceptKey(node, name);
	        if (!node[name]) {
	            throw new Exception(node.type + ' requires ' + name);
	        }
	    },
	    // Traverses a given array. If mutating, empty respnses will be removed
	    // for child elements.
	    acceptArray: function(array) {
	        for(var i = 0, l = array.length; i < l; i++){
	            this.acceptKey(array, i);
	            if (!array[i]) {
	                array.splice(i, 1);
	                i--;
	                l--;
	            }
	        }
	    },
	    accept: function(object) {
	        if (!object) {
	            return;
	        }
	        /* istanbul ignore next: Sanity code */ if (!this[object.type]) {
	            throw new Exception('Unknown type: ' + object.type, object);
	        }
	        if (this.current) {
	            this.parents.unshift(this.current);
	        }
	        this.current = object;
	        var ret = this[object.type](object);
	        this.current = this.parents.shift();
	        if (!this.mutating || ret) {
	            return ret;
	        } else if (ret !== false) {
	            return object;
	        }
	    },
	    Program: function(program) {
	        this.acceptArray(program.body);
	    },
	    MustacheStatement: visitSubExpression,
	    Decorator: visitSubExpression,
	    BlockStatement: visitBlock,
	    DecoratorBlock: visitBlock,
	    PartialStatement: visitPartial,
	    PartialBlockStatement: function(partial) {
	        visitPartial.call(this, partial);
	        this.acceptKey(partial, 'program');
	    },
	    ContentStatement: function() {},
	    CommentStatement: function() {},
	    SubExpression: visitSubExpression,
	    PathExpression: function() {},
	    StringLiteral: function() {},
	    NumberLiteral: function() {},
	    BooleanLiteral: function() {},
	    UndefinedLiteral: function() {},
	    NullLiteral: function() {},
	    Hash: function(hash) {
	        this.acceptArray(hash.pairs);
	    },
	    HashPair: function(pair) {
	        this.acceptRequired(pair, 'value');
	    }
	};
	function visitSubExpression(mustache) {
	    this.acceptRequired(mustache, 'path');
	    this.acceptArray(mustache.params);
	    this.acceptKey(mustache, 'hash');
	}
	function visitBlock(block) {
	    visitSubExpression.call(this, block);
	    this.acceptKey(block, 'program');
	    this.acceptKey(block, 'inverse');
	}
	function visitPartial(partial) {
	    this.acceptRequired(partial, 'name');
	    this.acceptArray(partial.params);
	    this.acceptKey(partial, 'hash');
	}

	function WhitespaceControl(options) {
	    if (options === void 0) {
	        options = {};
	    }
	    this.options = options;
	}
	WhitespaceControl.prototype = new Visitor();
	WhitespaceControl.prototype.Program = function(program) {
	    var doStandalone = !this.options.ignoreStandalone;
	    var isRoot = !this.isRootSeen;
	    this.isRootSeen = true;
	    var body = program.body;
	    for(var i = 0, l = body.length; i < l; i++){
	        var current = body[i], strip = this.accept(current);
	        if (!strip) {
	            continue;
	        }
	        var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot), _isNextWhitespace = isNextWhitespace(body, i, isRoot), openStandalone = strip.openStandalone && _isPrevWhitespace, closeStandalone = strip.closeStandalone && _isNextWhitespace, inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
	        if (strip.close) {
	            omitRight(body, i, true);
	        }
	        if (strip.open) {
	            omitLeft(body, i, true);
	        }
	        if (doStandalone && inlineStandalone) {
	            omitRight(body, i);
	            if (omitLeft(body, i)) {
	                // If we are on a standalone node, save the indent info for partials
	                if (current.type === 'PartialStatement') {
	                    // Pull out the whitespace from the final line
	                    current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
	                }
	            }
	        }
	        if (doStandalone && openStandalone) {
	            omitRight((current.program || current.inverse).body);
	            // Strip out the previous content node if it's whitespace only
	            omitLeft(body, i);
	        }
	        if (doStandalone && closeStandalone) {
	            // Always strip the next node
	            omitRight(body, i);
	            omitLeft((current.inverse || current.program).body);
	        }
	    }
	    return program;
	};
	WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function(block) {
	    this.accept(block.program);
	    this.accept(block.inverse);
	    // Find the inverse program that is involed with whitespace stripping.
	    var program = block.program || block.inverse, inverse = block.program && block.inverse, firstInverse = inverse, lastInverse = inverse;
	    if (inverse && inverse.chained) {
	        firstInverse = inverse.body[0].program;
	        // Walk the inverse chain to find the last inverse that is actually in the chain.
	        while(lastInverse.chained){
	            lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
	        }
	    }
	    var strip = {
	        open: block.openStrip.open,
	        close: block.closeStrip.close,
	        // Determine the standalone candiacy. Basically flag our content as being possibly standalone
	        // so our parent can determine if we actually are standalone
	        openStandalone: isNextWhitespace(program.body),
	        closeStandalone: isPrevWhitespace((firstInverse || program).body)
	    };
	    if (block.openStrip.close) {
	        omitRight(program.body, null, true);
	    }
	    if (inverse) {
	        var inverseStrip = block.inverseStrip;
	        if (inverseStrip.open) {
	            omitLeft(program.body, null, true);
	        }
	        if (inverseStrip.close) {
	            omitRight(firstInverse.body, null, true);
	        }
	        if (block.closeStrip.open) {
	            omitLeft(lastInverse.body, null, true);
	        }
	        // Find standalone else statments
	        if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
	            omitLeft(program.body);
	            omitRight(firstInverse.body);
	        }
	    } else if (block.closeStrip.open) {
	        omitLeft(program.body, null, true);
	    }
	    return strip;
	};
	WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function(mustache) {
	    return mustache.strip;
	};
	WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function(node) {
	    /* istanbul ignore next */ var strip = node.strip || {};
	    return {
	        inlineStandalone: true,
	        open: strip.open,
	        close: strip.close
	    };
	};
	function isPrevWhitespace(body, i, isRoot) {
	    if (i === undefined) {
	        i = body.length;
	    }
	    // Nodes that end with newlines are considered whitespace (but are special
	    // cased for strip operations)
	    var prev = body[i - 1], sibling = body[i - 2];
	    if (!prev) {
	        return isRoot;
	    }
	    if (prev.type === 'ContentStatement') {
	        return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
	    }
	}
	function isNextWhitespace(body, i, isRoot) {
	    if (i === undefined) {
	        i = -1;
	    }
	    var next = body[i + 1], sibling = body[i + 2];
	    if (!next) {
	        return isRoot;
	    }
	    if (next.type === 'ContentStatement') {
	        return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
	    }
	}
	// Marks the node to the right of the position as omitted.
	// I.e. {{foo}}' ' will mark the ' ' node as omitted.
	//
	// If i is undefined, then the first child will be marked as such.
	//
	// If multiple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitRight(body, i, multiple) {
	    var current = body[i == null ? 0 : i + 1];
	    if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
	        return;
	    }
	    var original = current.value;
	    current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
	    current.rightStripped = current.value !== original;
	}
	// Marks the node to the left of the position as omitted.
	// I.e. ' '{{foo}} will mark the ' ' node as omitted.
	//
	// If i is undefined then the last child will be marked as such.
	//
	// If multiple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitLeft(body, i, multiple) {
	    var current = body[i == null ? body.length - 1 : i - 1];
	    if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
	        return;
	    }
	    // We omit the last node if it's whitespace only and not preceded by a non-content node.
	    var original = current.value;
	    current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
	    current.leftStripped = current.value !== original;
	    return current.leftStripped;
	}

	/* parser generated by jison 0.4.18 */ /*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/ var parser = function() {
	    var o = function(k, v, o, l) {
	        for(o = o || {}, l = k.length; l--; o[k[l]] = v);
	        return o;
	    }, $V0 = [
	        2,
	        44
	    ], $V1 = [
	        1,
	        20
	    ], $V2 = [
	        5,
	        14,
	        15,
	        19,
	        29,
	        34,
	        39,
	        44,
	        47,
	        48,
	        52,
	        56,
	        60
	    ], $V3 = [
	        1,
	        35
	    ], $V4 = [
	        1,
	        38
	    ], $V5 = [
	        1,
	        30
	    ], $V6 = [
	        1,
	        31
	    ], $V7 = [
	        1,
	        32
	    ], $V8 = [
	        1,
	        33
	    ], $V9 = [
	        1,
	        34
	    ], $Va = [
	        1,
	        37
	    ], $Vb = [
	        14,
	        15,
	        19,
	        29,
	        34,
	        39,
	        44,
	        47,
	        48,
	        52,
	        56,
	        60
	    ], $Vc = [
	        14,
	        15,
	        19,
	        29,
	        34,
	        44,
	        47,
	        48,
	        52,
	        56,
	        60
	    ], $Vd = [
	        15,
	        18
	    ], $Ve = [
	        14,
	        15,
	        19,
	        29,
	        34,
	        47,
	        48,
	        52,
	        56,
	        60
	    ], $Vf = [
	        33,
	        64,
	        71,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84
	    ], $Vg = [
	        23,
	        33,
	        55,
	        64,
	        67,
	        71,
	        74,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84
	    ], $Vh = [
	        1,
	        51
	    ], $Vi = [
	        23,
	        33,
	        55,
	        64,
	        67,
	        71,
	        74,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84,
	        86
	    ], $Vj = [
	        2,
	        43
	    ], $Vk = [
	        55,
	        64,
	        71,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84
	    ], $Vl = [
	        1,
	        58
	    ], $Vm = [
	        1,
	        59
	    ], $Vn = [
	        1,
	        66
	    ], $Vo = [
	        33,
	        64,
	        71,
	        74,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84
	    ], $Vp = [
	        23,
	        64,
	        71,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84
	    ], $Vq = [
	        1,
	        76
	    ], $Vr = [
	        64,
	        67,
	        71,
	        79,
	        80,
	        81,
	        82,
	        83,
	        84
	    ], $Vs = [
	        33,
	        74
	    ], $Vt = [
	        23,
	        33,
	        55,
	        67,
	        71,
	        74
	    ], $Vu = [
	        1,
	        106
	    ], $Vv = [
	        1,
	        118
	    ], $Vw = [
	        71,
	        76
	    ];
	    var parser = {
	        trace: function trace() {},
	        yy: {},
	        symbols_: {
	            "error": 2,
	            "root": 3,
	            "program": 4,
	            "EOF": 5,
	            "program_repetition0": 6,
	            "statement": 7,
	            "mustache": 8,
	            "block": 9,
	            "rawBlock": 10,
	            "partial": 11,
	            "partialBlock": 12,
	            "content": 13,
	            "COMMENT": 14,
	            "CONTENT": 15,
	            "openRawBlock": 16,
	            "rawBlock_repetition0": 17,
	            "END_RAW_BLOCK": 18,
	            "OPEN_RAW_BLOCK": 19,
	            "helperName": 20,
	            "openRawBlock_repetition0": 21,
	            "openRawBlock_option0": 22,
	            "CLOSE_RAW_BLOCK": 23,
	            "openBlock": 24,
	            "block_option0": 25,
	            "closeBlock": 26,
	            "openInverse": 27,
	            "block_option1": 28,
	            "OPEN_BLOCK": 29,
	            "openBlock_repetition0": 30,
	            "openBlock_option0": 31,
	            "openBlock_option1": 32,
	            "CLOSE": 33,
	            "OPEN_INVERSE": 34,
	            "openInverse_repetition0": 35,
	            "openInverse_option0": 36,
	            "openInverse_option1": 37,
	            "openInverseChain": 38,
	            "OPEN_INVERSE_CHAIN": 39,
	            "openInverseChain_repetition0": 40,
	            "openInverseChain_option0": 41,
	            "openInverseChain_option1": 42,
	            "inverseAndProgram": 43,
	            "INVERSE": 44,
	            "inverseChain": 45,
	            "inverseChain_option0": 46,
	            "OPEN_ENDBLOCK": 47,
	            "OPEN": 48,
	            "expr": 49,
	            "mustache_repetition0": 50,
	            "mustache_option0": 51,
	            "OPEN_UNESCAPED": 52,
	            "mustache_repetition1": 53,
	            "mustache_option1": 54,
	            "CLOSE_UNESCAPED": 55,
	            "OPEN_PARTIAL": 56,
	            "partial_repetition0": 57,
	            "partial_option0": 58,
	            "openPartialBlock": 59,
	            "OPEN_PARTIAL_BLOCK": 60,
	            "openPartialBlock_repetition0": 61,
	            "openPartialBlock_option0": 62,
	            "sexpr": 63,
	            "OPEN_SEXPR": 64,
	            "sexpr_repetition0": 65,
	            "sexpr_option0": 66,
	            "CLOSE_SEXPR": 67,
	            "hash": 68,
	            "hash_repetition_plus0": 69,
	            "hashSegment": 70,
	            "ID": 71,
	            "EQUALS": 72,
	            "blockParams": 73,
	            "OPEN_BLOCK_PARAMS": 74,
	            "blockParams_repetition_plus0": 75,
	            "CLOSE_BLOCK_PARAMS": 76,
	            "path": 77,
	            "dataName": 78,
	            "STRING": 79,
	            "NUMBER": 80,
	            "BOOLEAN": 81,
	            "UNDEFINED": 82,
	            "NULL": 83,
	            "DATA": 84,
	            "pathSegments": 85,
	            "SEP": 86,
	            "$accept": 0,
	            "$end": 1
	        },
	        terminals_: {
	            2: "error",
	            5: "EOF",
	            14: "COMMENT",
	            15: "CONTENT",
	            18: "END_RAW_BLOCK",
	            19: "OPEN_RAW_BLOCK",
	            23: "CLOSE_RAW_BLOCK",
	            29: "OPEN_BLOCK",
	            33: "CLOSE",
	            34: "OPEN_INVERSE",
	            39: "OPEN_INVERSE_CHAIN",
	            44: "INVERSE",
	            47: "OPEN_ENDBLOCK",
	            48: "OPEN",
	            52: "OPEN_UNESCAPED",
	            55: "CLOSE_UNESCAPED",
	            56: "OPEN_PARTIAL",
	            60: "OPEN_PARTIAL_BLOCK",
	            64: "OPEN_SEXPR",
	            67: "CLOSE_SEXPR",
	            71: "ID",
	            72: "EQUALS",
	            74: "OPEN_BLOCK_PARAMS",
	            76: "CLOSE_BLOCK_PARAMS",
	            79: "STRING",
	            80: "NUMBER",
	            81: "BOOLEAN",
	            82: "UNDEFINED",
	            83: "NULL",
	            84: "DATA",
	            86: "SEP"
	        },
	        productions_: [
	            0,
	            [
	                3,
	                2
	            ],
	            [
	                4,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                7,
	                1
	            ],
	            [
	                13,
	                1
	            ],
	            [
	                10,
	                3
	            ],
	            [
	                16,
	                5
	            ],
	            [
	                9,
	                4
	            ],
	            [
	                9,
	                4
	            ],
	            [
	                24,
	                6
	            ],
	            [
	                27,
	                6
	            ],
	            [
	                38,
	                6
	            ],
	            [
	                43,
	                2
	            ],
	            [
	                45,
	                3
	            ],
	            [
	                45,
	                1
	            ],
	            [
	                26,
	                3
	            ],
	            [
	                8,
	                5
	            ],
	            [
	                8,
	                5
	            ],
	            [
	                11,
	                5
	            ],
	            [
	                12,
	                3
	            ],
	            [
	                59,
	                5
	            ],
	            [
	                49,
	                1
	            ],
	            [
	                49,
	                1
	            ],
	            [
	                63,
	                5
	            ],
	            [
	                68,
	                1
	            ],
	            [
	                70,
	                3
	            ],
	            [
	                73,
	                3
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                20,
	                1
	            ],
	            [
	                78,
	                2
	            ],
	            [
	                77,
	                1
	            ],
	            [
	                85,
	                3
	            ],
	            [
	                85,
	                1
	            ],
	            [
	                6,
	                0
	            ],
	            [
	                6,
	                2
	            ],
	            [
	                17,
	                0
	            ],
	            [
	                17,
	                2
	            ],
	            [
	                21,
	                0
	            ],
	            [
	                21,
	                2
	            ],
	            [
	                22,
	                0
	            ],
	            [
	                22,
	                1
	            ],
	            [
	                25,
	                0
	            ],
	            [
	                25,
	                1
	            ],
	            [
	                28,
	                0
	            ],
	            [
	                28,
	                1
	            ],
	            [
	                30,
	                0
	            ],
	            [
	                30,
	                2
	            ],
	            [
	                31,
	                0
	            ],
	            [
	                31,
	                1
	            ],
	            [
	                32,
	                0
	            ],
	            [
	                32,
	                1
	            ],
	            [
	                35,
	                0
	            ],
	            [
	                35,
	                2
	            ],
	            [
	                36,
	                0
	            ],
	            [
	                36,
	                1
	            ],
	            [
	                37,
	                0
	            ],
	            [
	                37,
	                1
	            ],
	            [
	                40,
	                0
	            ],
	            [
	                40,
	                2
	            ],
	            [
	                41,
	                0
	            ],
	            [
	                41,
	                1
	            ],
	            [
	                42,
	                0
	            ],
	            [
	                42,
	                1
	            ],
	            [
	                46,
	                0
	            ],
	            [
	                46,
	                1
	            ],
	            [
	                50,
	                0
	            ],
	            [
	                50,
	                2
	            ],
	            [
	                51,
	                0
	            ],
	            [
	                51,
	                1
	            ],
	            [
	                53,
	                0
	            ],
	            [
	                53,
	                2
	            ],
	            [
	                54,
	                0
	            ],
	            [
	                54,
	                1
	            ],
	            [
	                57,
	                0
	            ],
	            [
	                57,
	                2
	            ],
	            [
	                58,
	                0
	            ],
	            [
	                58,
	                1
	            ],
	            [
	                61,
	                0
	            ],
	            [
	                61,
	                2
	            ],
	            [
	                62,
	                0
	            ],
	            [
	                62,
	                1
	            ],
	            [
	                65,
	                0
	            ],
	            [
	                65,
	                2
	            ],
	            [
	                66,
	                0
	            ],
	            [
	                66,
	                1
	            ],
	            [
	                69,
	                1
	            ],
	            [
	                69,
	                2
	            ],
	            [
	                75,
	                1
	            ],
	            [
	                75,
	                2
	            ]
	        ],
	        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */ , $$ /* vstack */ , _$ /* lstack */ ) {
	            /* this == yyval */ var $0 = $$.length - 1;
	            switch(yystate){
	                case 1:
	                    return $$[$0 - 1];
	                case 2:
	                    this.$ = yy.prepareProgram($$[$0]);
	                    break;
	                case 3:
	                case 4:
	                case 5:
	                case 6:
	                case 7:
	                case 8:
	                case 20:
	                case 27:
	                case 28:
	                case 33:
	                case 34:
	                    this.$ = $$[$0];
	                    break;
	                case 9:
	                    this.$ = {
	                        type: 'CommentStatement',
	                        value: yy.stripComment($$[$0]),
	                        strip: yy.stripFlags($$[$0], $$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 10:
	                    this.$ = {
	                        type: 'ContentStatement',
	                        original: $$[$0],
	                        value: $$[$0],
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 11:
	                    this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 12:
	                    this.$ = {
	                        path: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1]
	                    };
	                    break;
	                case 13:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
	                    break;
	                case 14:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
	                    break;
	                case 15:
	                    this.$ = {
	                        open: $$[$0 - 5],
	                        path: $$[$0 - 4],
	                        params: $$[$0 - 3],
	                        hash: $$[$0 - 2],
	                        blockParams: $$[$0 - 1],
	                        strip: yy.stripFlags($$[$0 - 5], $$[$0])
	                    };
	                    break;
	                case 16:
	                case 17:
	                    this.$ = {
	                        path: $$[$0 - 4],
	                        params: $$[$0 - 3],
	                        hash: $$[$0 - 2],
	                        blockParams: $$[$0 - 1],
	                        strip: yy.stripFlags($$[$0 - 5], $$[$0])
	                    };
	                    break;
	                case 18:
	                    this.$ = {
	                        strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]),
	                        program: $$[$0]
	                    };
	                    break;
	                case 19:
	                    var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$), program = yy.prepareProgram([
	                        inverse
	                    ], $$[$0 - 1].loc);
	                    program.chained = true;
	                    this.$ = {
	                        strip: $$[$0 - 2].strip,
	                        program: program,
	                        chain: true
	                    };
	                    break;
	                case 21:
	                    this.$ = {
	                        path: $$[$0 - 1],
	                        strip: yy.stripFlags($$[$0 - 2], $$[$0])
	                    };
	                    break;
	                case 22:
	                case 23:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 24:
	                    this.$ = {
	                        type: 'PartialStatement',
	                        name: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        indent: '',
	                        strip: yy.stripFlags($$[$0 - 4], $$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 25:
	                    this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 26:
	                    this.$ = {
	                        path: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        strip: yy.stripFlags($$[$0 - 4], $$[$0])
	                    };
	                    break;
	                case 29:
	                    this.$ = {
	                        type: 'SubExpression',
	                        path: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 30:
	                    this.$ = {
	                        type: 'Hash',
	                        pairs: $$[$0],
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 31:
	                    this.$ = {
	                        type: 'HashPair',
	                        key: yy.id($$[$0 - 2]),
	                        value: $$[$0],
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 32:
	                    this.$ = yy.id($$[$0 - 1]);
	                    break;
	                case 35:
	                    this.$ = {
	                        type: 'StringLiteral',
	                        value: $$[$0],
	                        original: $$[$0],
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 36:
	                    this.$ = {
	                        type: 'NumberLiteral',
	                        value: Number($$[$0]),
	                        original: Number($$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 37:
	                    this.$ = {
	                        type: 'BooleanLiteral',
	                        value: $$[$0] === 'true',
	                        original: $$[$0] === 'true',
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 38:
	                    this.$ = {
	                        type: 'UndefinedLiteral',
	                        original: undefined,
	                        value: undefined,
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 39:
	                    this.$ = {
	                        type: 'NullLiteral',
	                        original: null,
	                        value: null,
	                        loc: yy.locInfo(this._$)
	                    };
	                    break;
	                case 40:
	                    this.$ = yy.preparePath(true, $$[$0], this._$);
	                    break;
	                case 41:
	                    this.$ = yy.preparePath(false, $$[$0], this._$);
	                    break;
	                case 42:
	                    $$[$0 - 2].push({
	                        part: yy.id($$[$0]),
	                        original: $$[$0],
	                        separator: $$[$0 - 1]
	                    });
	                    this.$ = $$[$0 - 2];
	                    break;
	                case 43:
	                    this.$ = [
	                        {
	                            part: yy.id($$[$0]),
	                            original: $$[$0]
	                        }
	                    ];
	                    break;
	                case 44:
	                case 46:
	                case 48:
	                case 56:
	                case 62:
	                case 68:
	                case 76:
	                case 80:
	                case 84:
	                case 88:
	                case 92:
	                    this.$ = [];
	                    break;
	                case 45:
	                case 47:
	                case 49:
	                case 57:
	                case 63:
	                case 69:
	                case 77:
	                case 81:
	                case 85:
	                case 89:
	                case 93:
	                case 97:
	                case 99:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 96:
	                case 98:
	                    this.$ = [
	                        $$[$0]
	                    ];
	                    break;
	            }
	        },
	        table: [
	            o([
	                5,
	                14,
	                15,
	                19,
	                29,
	                34,
	                48,
	                52,
	                56,
	                60
	            ], $V0, {
	                3: 1,
	                4: 2,
	                6: 3
	            }),
	            {
	                1: [
	                    3
	                ]
	            },
	            {
	                5: [
	                    1,
	                    4
	                ]
	            },
	            o([
	                5,
	                39,
	                44,
	                47
	            ], [
	                2,
	                2
	            ], {
	                7: 5,
	                8: 6,
	                9: 7,
	                10: 8,
	                11: 9,
	                12: 10,
	                13: 11,
	                24: 15,
	                27: 16,
	                16: 17,
	                59: 19,
	                14: [
	                    1,
	                    12
	                ],
	                15: $V1,
	                19: [
	                    1,
	                    23
	                ],
	                29: [
	                    1,
	                    21
	                ],
	                34: [
	                    1,
	                    22
	                ],
	                48: [
	                    1,
	                    13
	                ],
	                52: [
	                    1,
	                    14
	                ],
	                56: [
	                    1,
	                    18
	                ],
	                60: [
	                    1,
	                    24
	                ]
	            }),
	            {
	                1: [
	                    2,
	                    1
	                ]
	            },
	            o($V2, [
	                2,
	                45
	            ]),
	            o($V2, [
	                2,
	                3
	            ]),
	            o($V2, [
	                2,
	                4
	            ]),
	            o($V2, [
	                2,
	                5
	            ]),
	            o($V2, [
	                2,
	                6
	            ]),
	            o($V2, [
	                2,
	                7
	            ]),
	            o($V2, [
	                2,
	                8
	            ]),
	            o($V2, [
	                2,
	                9
	            ]),
	            {
	                20: 26,
	                49: 25,
	                63: 27,
	                64: $V3,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                20: 26,
	                49: 39,
	                63: 27,
	                64: $V3,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Vb, $V0, {
	                6: 3,
	                4: 40
	            }),
	            o($Vc, $V0, {
	                6: 3,
	                4: 41
	            }),
	            o($Vd, [
	                2,
	                46
	            ], {
	                17: 42
	            }),
	            {
	                20: 26,
	                49: 43,
	                63: 27,
	                64: $V3,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Ve, $V0, {
	                6: 3,
	                4: 44
	            }),
	            o([
	                5,
	                14,
	                15,
	                18,
	                19,
	                29,
	                34,
	                39,
	                44,
	                47,
	                48,
	                52,
	                56,
	                60
	            ], [
	                2,
	                10
	            ]),
	            {
	                20: 45,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                20: 46,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                20: 47,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                20: 26,
	                49: 48,
	                63: 27,
	                64: $V3,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Vf, [
	                2,
	                76
	            ], {
	                50: 49
	            }),
	            o($Vg, [
	                2,
	                27
	            ]),
	            o($Vg, [
	                2,
	                28
	            ]),
	            o($Vg, [
	                2,
	                33
	            ]),
	            o($Vg, [
	                2,
	                34
	            ]),
	            o($Vg, [
	                2,
	                35
	            ]),
	            o($Vg, [
	                2,
	                36
	            ]),
	            o($Vg, [
	                2,
	                37
	            ]),
	            o($Vg, [
	                2,
	                38
	            ]),
	            o($Vg, [
	                2,
	                39
	            ]),
	            {
	                20: 26,
	                49: 50,
	                63: 27,
	                64: $V3,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Vg, [
	                2,
	                41
	            ], {
	                86: $Vh
	            }),
	            {
	                71: $V4,
	                85: 52
	            },
	            o($Vi, $Vj),
	            o($Vk, [
	                2,
	                80
	            ], {
	                53: 53
	            }),
	            {
	                25: 54,
	                38: 56,
	                39: $Vl,
	                43: 57,
	                44: $Vm,
	                45: 55,
	                47: [
	                    2,
	                    52
	                ]
	            },
	            {
	                28: 60,
	                43: 61,
	                44: $Vm,
	                47: [
	                    2,
	                    54
	                ]
	            },
	            {
	                13: 63,
	                15: $V1,
	                18: [
	                    1,
	                    62
	                ]
	            },
	            o($Vf, [
	                2,
	                84
	            ], {
	                57: 64
	            }),
	            {
	                26: 65,
	                47: $Vn
	            },
	            o($Vo, [
	                2,
	                56
	            ], {
	                30: 67
	            }),
	            o($Vo, [
	                2,
	                62
	            ], {
	                35: 68
	            }),
	            o($Vp, [
	                2,
	                48
	            ], {
	                21: 69
	            }),
	            o($Vf, [
	                2,
	                88
	            ], {
	                61: 70
	            }),
	            {
	                20: 26,
	                33: [
	                    2,
	                    78
	                ],
	                49: 72,
	                51: 71,
	                63: 27,
	                64: $V3,
	                68: 73,
	                69: 74,
	                70: 75,
	                71: $Vq,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Vr, [
	                2,
	                92
	            ], {
	                65: 77
	            }),
	            {
	                71: [
	                    1,
	                    78
	                ]
	            },
	            o($Vg, [
	                2,
	                40
	            ], {
	                86: $Vh
	            }),
	            {
	                20: 26,
	                49: 80,
	                54: 79,
	                55: [
	                    2,
	                    82
	                ],
	                63: 27,
	                64: $V3,
	                68: 81,
	                69: 74,
	                70: 75,
	                71: $Vq,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                26: 82,
	                47: $Vn
	            },
	            {
	                47: [
	                    2,
	                    53
	                ]
	            },
	            o($Vb, $V0, {
	                6: 3,
	                4: 83
	            }),
	            {
	                47: [
	                    2,
	                    20
	                ]
	            },
	            {
	                20: 84,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Ve, $V0, {
	                6: 3,
	                4: 85
	            }),
	            {
	                26: 86,
	                47: $Vn
	            },
	            {
	                47: [
	                    2,
	                    55
	                ]
	            },
	            o($V2, [
	                2,
	                11
	            ]),
	            o($Vd, [
	                2,
	                47
	            ]),
	            {
	                20: 26,
	                33: [
	                    2,
	                    86
	                ],
	                49: 88,
	                58: 87,
	                63: 27,
	                64: $V3,
	                68: 89,
	                69: 74,
	                70: 75,
	                71: $Vq,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($V2, [
	                2,
	                25
	            ]),
	            {
	                20: 90,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Vs, [
	                2,
	                58
	            ], {
	                20: 26,
	                63: 27,
	                77: 28,
	                78: 29,
	                85: 36,
	                69: 74,
	                70: 75,
	                31: 91,
	                49: 92,
	                68: 93,
	                64: $V3,
	                71: $Vq,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va
	            }),
	            o($Vs, [
	                2,
	                64
	            ], {
	                20: 26,
	                63: 27,
	                77: 28,
	                78: 29,
	                85: 36,
	                69: 74,
	                70: 75,
	                36: 94,
	                49: 95,
	                68: 96,
	                64: $V3,
	                71: $Vq,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va
	            }),
	            {
	                20: 26,
	                22: 97,
	                23: [
	                    2,
	                    50
	                ],
	                49: 98,
	                63: 27,
	                64: $V3,
	                68: 99,
	                69: 74,
	                70: 75,
	                71: $Vq,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                20: 26,
	                33: [
	                    2,
	                    90
	                ],
	                49: 101,
	                62: 100,
	                63: 27,
	                64: $V3,
	                68: 102,
	                69: 74,
	                70: 75,
	                71: $Vq,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                33: [
	                    1,
	                    103
	                ]
	            },
	            o($Vf, [
	                2,
	                77
	            ]),
	            {
	                33: [
	                    2,
	                    79
	                ]
	            },
	            o([
	                23,
	                33,
	                55,
	                67,
	                74
	            ], [
	                2,
	                30
	            ], {
	                70: 104,
	                71: [
	                    1,
	                    105
	                ]
	            }),
	            o($Vt, [
	                2,
	                96
	            ]),
	            o($Vi, $Vj, {
	                72: $Vu
	            }),
	            {
	                20: 26,
	                49: 108,
	                63: 27,
	                64: $V3,
	                66: 107,
	                67: [
	                    2,
	                    94
	                ],
	                68: 109,
	                69: 74,
	                70: 75,
	                71: $Vq,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            o($Vi, [
	                2,
	                42
	            ]),
	            {
	                55: [
	                    1,
	                    110
	                ]
	            },
	            o($Vk, [
	                2,
	                81
	            ]),
	            {
	                55: [
	                    2,
	                    83
	                ]
	            },
	            o($V2, [
	                2,
	                13
	            ]),
	            {
	                38: 56,
	                39: $Vl,
	                43: 57,
	                44: $Vm,
	                45: 112,
	                46: 111,
	                47: [
	                    2,
	                    74
	                ]
	            },
	            o($Vo, [
	                2,
	                68
	            ], {
	                40: 113
	            }),
	            {
	                47: [
	                    2,
	                    18
	                ]
	            },
	            o($V2, [
	                2,
	                14
	            ]),
	            {
	                33: [
	                    1,
	                    114
	                ]
	            },
	            o($Vf, [
	                2,
	                85
	            ]),
	            {
	                33: [
	                    2,
	                    87
	                ]
	            },
	            {
	                33: [
	                    1,
	                    115
	                ]
	            },
	            {
	                32: 116,
	                33: [
	                    2,
	                    60
	                ],
	                73: 117,
	                74: $Vv
	            },
	            o($Vo, [
	                2,
	                57
	            ]),
	            o($Vs, [
	                2,
	                59
	            ]),
	            {
	                33: [
	                    2,
	                    66
	                ],
	                37: 119,
	                73: 120,
	                74: $Vv
	            },
	            o($Vo, [
	                2,
	                63
	            ]),
	            o($Vs, [
	                2,
	                65
	            ]),
	            {
	                23: [
	                    1,
	                    121
	                ]
	            },
	            o($Vp, [
	                2,
	                49
	            ]),
	            {
	                23: [
	                    2,
	                    51
	                ]
	            },
	            {
	                33: [
	                    1,
	                    122
	                ]
	            },
	            o($Vf, [
	                2,
	                89
	            ]),
	            {
	                33: [
	                    2,
	                    91
	                ]
	            },
	            o($V2, [
	                2,
	                22
	            ]),
	            o($Vt, [
	                2,
	                97
	            ]),
	            {
	                72: $Vu
	            },
	            {
	                20: 26,
	                49: 123,
	                63: 27,
	                64: $V3,
	                71: $V4,
	                77: 28,
	                78: 29,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va,
	                85: 36
	            },
	            {
	                67: [
	                    1,
	                    124
	                ]
	            },
	            o($Vr, [
	                2,
	                93
	            ]),
	            {
	                67: [
	                    2,
	                    95
	                ]
	            },
	            o($V2, [
	                2,
	                23
	            ]),
	            {
	                47: [
	                    2,
	                    19
	                ]
	            },
	            {
	                47: [
	                    2,
	                    75
	                ]
	            },
	            o($Vs, [
	                2,
	                70
	            ], {
	                20: 26,
	                63: 27,
	                77: 28,
	                78: 29,
	                85: 36,
	                69: 74,
	                70: 75,
	                41: 125,
	                49: 126,
	                68: 127,
	                64: $V3,
	                71: $Vq,
	                79: $V5,
	                80: $V6,
	                81: $V7,
	                82: $V8,
	                83: $V9,
	                84: $Va
	            }),
	            o($V2, [
	                2,
	                24
	            ]),
	            o($V2, [
	                2,
	                21
	            ]),
	            {
	                33: [
	                    1,
	                    128
	                ]
	            },
	            {
	                33: [
	                    2,
	                    61
	                ]
	            },
	            {
	                71: [
	                    1,
	                    130
	                ],
	                75: 129
	            },
	            {
	                33: [
	                    1,
	                    131
	                ]
	            },
	            {
	                33: [
	                    2,
	                    67
	                ]
	            },
	            o($Vd, [
	                2,
	                12
	            ]),
	            o($Ve, [
	                2,
	                26
	            ]),
	            o($Vt, [
	                2,
	                31
	            ]),
	            o($Vg, [
	                2,
	                29
	            ]),
	            {
	                33: [
	                    2,
	                    72
	                ],
	                42: 132,
	                73: 133,
	                74: $Vv
	            },
	            o($Vo, [
	                2,
	                69
	            ]),
	            o($Vs, [
	                2,
	                71
	            ]),
	            o($Vb, [
	                2,
	                15
	            ]),
	            {
	                71: [
	                    1,
	                    135
	                ],
	                76: [
	                    1,
	                    134
	                ]
	            },
	            o($Vw, [
	                2,
	                98
	            ]),
	            o($Vc, [
	                2,
	                16
	            ]),
	            {
	                33: [
	                    1,
	                    136
	                ]
	            },
	            {
	                33: [
	                    2,
	                    73
	                ]
	            },
	            {
	                33: [
	                    2,
	                    32
	                ]
	            },
	            o($Vw, [
	                2,
	                99
	            ]),
	            o($Vb, [
	                2,
	                17
	            ])
	        ],
	        defaultActions: {
	            4: [
	                2,
	                1
	            ],
	            55: [
	                2,
	                53
	            ],
	            57: [
	                2,
	                20
	            ],
	            61: [
	                2,
	                55
	            ],
	            73: [
	                2,
	                79
	            ],
	            81: [
	                2,
	                83
	            ],
	            85: [
	                2,
	                18
	            ],
	            89: [
	                2,
	                87
	            ],
	            99: [
	                2,
	                51
	            ],
	            102: [
	                2,
	                91
	            ],
	            109: [
	                2,
	                95
	            ],
	            111: [
	                2,
	                19
	            ],
	            112: [
	                2,
	                75
	            ],
	            117: [
	                2,
	                61
	            ],
	            120: [
	                2,
	                67
	            ],
	            133: [
	                2,
	                73
	            ],
	            134: [
	                2,
	                32
	            ]
	        },
	        parseError: function parseError(str, hash) {
	            if (hash.recoverable) {
	                this.trace(str);
	            } else {
	                var error = new Error(str);
	                error.hash = hash;
	                throw error;
	            }
	        },
	        parse: function parse(input) {
	            var self = this, stack = [
	                0
	            ], vstack = [
	                null
	            ], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
	            var args = lstack.slice.call(arguments, 1);
	            var lexer = Object.create(this.lexer);
	            var sharedState = {
	                yy: {}
	            };
	            for(var k in this.yy){
	                if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	                    sharedState.yy[k] = this.yy[k];
	                }
	            }
	            lexer.setInput(input, sharedState.yy);
	            sharedState.yy.lexer = lexer;
	            sharedState.yy.parser = this;
	            if (typeof lexer.yylloc == 'undefined') {
	                lexer.yylloc = {};
	            }
	            var yyloc = lexer.yylloc;
	            lstack.push(yyloc);
	            var ranges = lexer.options && lexer.options.ranges;
	            if (typeof sharedState.yy.parseError === 'function') {
	                this.parseError = sharedState.yy.parseError;
	            } else {
	                this.parseError = Object.getPrototypeOf(this).parseError;
	            }
	            var lex = function() {
	                var token;
	                token = lexer.lex() || EOF;
	                if (typeof token !== 'number') {
	                    token = self.symbols_[token] || token;
	                }
	                return token;
	            };
	            var symbol, state, action, r, yyval = {}, p, len, newState, expected;
	            while(true){
	                state = stack[stack.length - 1];
	                if (this.defaultActions[state]) {
	                    action = this.defaultActions[state];
	                } else {
	                    if (symbol === null || typeof symbol == 'undefined') {
	                        symbol = lex();
	                    }
	                    action = table[state] && table[state][symbol];
	                }
	                if (typeof action === 'undefined' || !action.length || !action[0]) {
	                    var errStr = '';
	                    expected = [];
	                    for(p in table[state]){
	                        if (this.terminals_[p] && p > TERROR) {
	                            expected.push('\'' + this.terminals_[p] + '\'');
	                        }
	                    }
	                    if (lexer.showPosition) {
	                        errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                    } else {
	                        errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                    }
	                    this.parseError(errStr, {
	                        text: lexer.match,
	                        token: this.terminals_[symbol] || symbol,
	                        line: lexer.yylineno,
	                        loc: yyloc,
	                        expected: expected
	                    });
	                }
	                if (action[0] instanceof Array && action.length > 1) {
	                    throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	                }
	                switch(action[0]){
	                    case 1:
	                        stack.push(symbol);
	                        vstack.push(lexer.yytext);
	                        lstack.push(lexer.yylloc);
	                        stack.push(action[1]);
	                        symbol = null;
	                        {
	                            yyleng = lexer.yyleng;
	                            yytext = lexer.yytext;
	                            yylineno = lexer.yylineno;
	                            yyloc = lexer.yylloc;
	                        }
	                        break;
	                    case 2:
	                        len = this.productions_[action[1]][1];
	                        yyval.$ = vstack[vstack.length - len];
	                        yyval._$ = {
	                            first_line: lstack[lstack.length - (len || 1)].first_line,
	                            last_line: lstack[lstack.length - 1].last_line,
	                            first_column: lstack[lstack.length - (len || 1)].first_column,
	                            last_column: lstack[lstack.length - 1].last_column
	                        };
	                        if (ranges) {
	                            yyval._$.range = [
	                                lstack[lstack.length - (len || 1)].range[0],
	                                lstack[lstack.length - 1].range[1]
	                            ];
	                        }
	                        r = this.performAction.apply(yyval, [
	                            yytext,
	                            yyleng,
	                            yylineno,
	                            sharedState.yy,
	                            action[1],
	                            vstack,
	                            lstack
	                        ].concat(args));
	                        if (typeof r !== 'undefined') {
	                            return r;
	                        }
	                        if (len) {
	                            stack = stack.slice(0, -1 * len * 2);
	                            vstack = vstack.slice(0, -1 * len);
	                            lstack = lstack.slice(0, -1 * len);
	                        }
	                        stack.push(this.productions_[action[1]][0]);
	                        vstack.push(yyval.$);
	                        lstack.push(yyval._$);
	                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	                        stack.push(newState);
	                        break;
	                    case 3:
	                        return true;
	                }
	            }
	            return true;
	        }
	    };
	    /* generated by jison-lex 0.3.4 */ var lexer = function() {
	        var lexer = {
	            EOF: 1,
	            parseError: function parseError(str, hash) {
	                if (this.yy.parser) {
	                    this.yy.parser.parseError(str, hash);
	                } else {
	                    throw new Error(str);
	                }
	            },
	            // resets the lexer, sets new input
	            setInput: function(input, yy) {
	                this.yy = yy || this.yy || {};
	                this._input = input;
	                this._more = this._backtrack = this.done = false;
	                this.yylineno = this.yyleng = 0;
	                this.yytext = this.matched = this.match = '';
	                this.conditionStack = [
	                    'INITIAL'
	                ];
	                this.yylloc = {
	                    first_line: 1,
	                    first_column: 0,
	                    last_line: 1,
	                    last_column: 0
	                };
	                if (this.options.ranges) {
	                    this.yylloc.range = [
	                        0,
	                        0
	                    ];
	                }
	                this.offset = 0;
	                return this;
	            },
	            // consumes and returns one char from the input
	            input: function() {
	                var ch = this._input[0];
	                this.yytext += ch;
	                this.yyleng++;
	                this.offset++;
	                this.match += ch;
	                this.matched += ch;
	                var lines = ch.match(/(?:\r\n?|\n).*/g);
	                if (lines) {
	                    this.yylineno++;
	                    this.yylloc.last_line++;
	                } else {
	                    this.yylloc.last_column++;
	                }
	                if (this.options.ranges) {
	                    this.yylloc.range[1]++;
	                }
	                this._input = this._input.slice(1);
	                return ch;
	            },
	            // unshifts one char (or a string) into the input
	            unput: function(ch) {
	                var len = ch.length;
	                var lines = ch.split(/(?:\r\n?|\n)/g);
	                this._input = ch + this._input;
	                this.yytext = this.yytext.substr(0, this.yytext.length - len);
	                //this.yyleng -= len;
	                this.offset -= len;
	                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	                this.match = this.match.substr(0, this.match.length - 1);
	                this.matched = this.matched.substr(0, this.matched.length - 1);
	                if (lines.length - 1) {
	                    this.yylineno -= lines.length - 1;
	                }
	                var r = this.yylloc.range;
	                this.yylloc = {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.yylineno + 1,
	                    first_column: this.yylloc.first_column,
	                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
	                };
	                if (this.options.ranges) {
	                    this.yylloc.range = [
	                        r[0],
	                        r[0] + this.yyleng - len
	                    ];
	                }
	                this.yyleng = this.yytext.length;
	                return this;
	            },
	            // When called from action, caches matched text and appends it on next action
	            more: function() {
	                this._more = true;
	                return this;
	            },
	            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	            reject: function() {
	                if (this.options.backtrack_lexer) {
	                    this._backtrack = true;
	                } else {
	                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                        text: "",
	                        token: null,
	                        line: this.yylineno
	                    });
	                }
	                return this;
	            },
	            // retain first n characters of the match
	            less: function(n) {
	                this.unput(this.match.slice(n));
	            },
	            // displays already matched input, i.e. for error messages
	            pastInput: function() {
	                var past = this.matched.substr(0, this.matched.length - this.match.length);
	                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
	            },
	            // displays upcoming input, i.e. for error messages
	            upcomingInput: function() {
	                var next = this.match;
	                if (next.length < 20) {
	                    next += this._input.substr(0, 20 - next.length);
	                }
	                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	            },
	            // displays the character position where the lexing error occurred, i.e. for error messages
	            showPosition: function() {
	                var pre = this.pastInput();
	                var c = new Array(pre.length + 1).join("-");
	                return pre + this.upcomingInput() + "\n" + c + "^";
	            },
	            // test the lexed token: return FALSE when not a match, otherwise return token
	            test_match: function(match, indexed_rule) {
	                var token, lines, backup;
	                if (this.options.backtrack_lexer) {
	                    // save context
	                    backup = {
	                        yylineno: this.yylineno,
	                        yylloc: {
	                            first_line: this.yylloc.first_line,
	                            last_line: this.last_line,
	                            first_column: this.yylloc.first_column,
	                            last_column: this.yylloc.last_column
	                        },
	                        yytext: this.yytext,
	                        match: this.match,
	                        matches: this.matches,
	                        matched: this.matched,
	                        yyleng: this.yyleng,
	                        offset: this.offset,
	                        _more: this._more,
	                        _input: this._input,
	                        yy: this.yy,
	                        conditionStack: this.conditionStack.slice(0),
	                        done: this.done
	                    };
	                    if (this.options.ranges) {
	                        backup.yylloc.range = this.yylloc.range.slice(0);
	                    }
	                }
	                lines = match[0].match(/(?:\r\n?|\n).*/g);
	                if (lines) {
	                    this.yylineno += lines.length;
	                }
	                this.yylloc = {
	                    first_line: this.yylloc.last_line,
	                    last_line: this.yylineno + 1,
	                    first_column: this.yylloc.last_column,
	                    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
	                };
	                this.yytext += match[0];
	                this.match += match[0];
	                this.matches = match;
	                this.yyleng = this.yytext.length;
	                if (this.options.ranges) {
	                    this.yylloc.range = [
	                        this.offset,
	                        this.offset += this.yyleng
	                    ];
	                }
	                this._more = false;
	                this._backtrack = false;
	                this._input = this._input.slice(match[0].length);
	                this.matched += match[0];
	                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	                if (this.done && this._input) {
	                    this.done = false;
	                }
	                if (token) {
	                    return token;
	                } else if (this._backtrack) {
	                    // recover context
	                    for(var k in backup){
	                        this[k] = backup[k];
	                    }
	                    return false; // rule action called reject() implying the next rule should be tested instead.
	                }
	                return false;
	            },
	            // return next match in input
	            next: function() {
	                if (this.done) {
	                    return this.EOF;
	                }
	                if (!this._input) {
	                    this.done = true;
	                }
	                var token, match, tempMatch, index;
	                if (!this._more) {
	                    this.yytext = '';
	                    this.match = '';
	                }
	                var rules = this._currentRules();
	                for(var i = 0; i < rules.length; i++){
	                    tempMatch = this._input.match(this.rules[rules[i]]);
	                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                        match = tempMatch;
	                        index = i;
	                        if (this.options.backtrack_lexer) {
	                            token = this.test_match(tempMatch, rules[i]);
	                            if (token !== false) {
	                                return token;
	                            } else if (this._backtrack) {
	                                match = false;
	                                continue; // rule action called reject() implying a rule MISmatch.
	                            } else {
	                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                                return false;
	                            }
	                        } else if (!this.options.flex) {
	                            break;
	                        }
	                    }
	                }
	                if (match) {
	                    token = this.test_match(match, rules[index]);
	                    if (token !== false) {
	                        return token;
	                    }
	                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                    return false;
	                }
	                if (this._input === "") {
	                    return this.EOF;
	                } else {
	                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                        text: "",
	                        token: null,
	                        line: this.yylineno
	                    });
	                }
	            },
	            // return next match that has a token
	            lex: function lex() {
	                var r = this.next();
	                if (r) {
	                    return r;
	                } else {
	                    return this.lex();
	                }
	            },
	            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	            begin: function begin(condition) {
	                this.conditionStack.push(condition);
	            },
	            // pop the previously active lexer condition state off the condition stack
	            popState: function popState() {
	                var n = this.conditionStack.length - 1;
	                if (n > 0) {
	                    return this.conditionStack.pop();
	                } else {
	                    return this.conditionStack[0];
	                }
	            },
	            // produce the lexer rule set which is active for the currently active lexer condition state
	            _currentRules: function _currentRules() {
	                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	                } else {
	                    return this.conditions["INITIAL"].rules;
	                }
	            },
	            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	            topState: function topState(n) {
	                n = this.conditionStack.length - 1 - Math.abs(n || 0);
	                if (n >= 0) {
	                    return this.conditionStack[n];
	                } else {
	                    return "INITIAL";
	                }
	            },
	            // alias for begin(condition)
	            pushState: function pushState(condition) {
	                this.begin(condition);
	            },
	            // return the number of states currently on the stack
	            stateStackSize: function stateStackSize() {
	                return this.conditionStack.length;
	            },
	            options: {},
	            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
	                function strip(start, end) {
	                    return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
	                }
	                switch($avoiding_name_collisions){
	                    case 0:
	                        if (yy_.yytext.slice(-2) === "\\\\") {
	                            strip(0, 1);
	                            this.begin("mu");
	                        } else if (yy_.yytext.slice(-1) === "\\") {
	                            strip(0, 1);
	                            this.begin("emu");
	                        } else {
	                            this.begin("mu");
	                        }
	                        if (yy_.yytext) return 15;
	                        break;
	                    case 1:
	                        return 15;
	                    case 2:
	                        this.popState();
	                        return 15;
	                    case 3:
	                        this.begin('raw');
	                        return 15;
	                    case 4:
	                        this.popState();
	                        // Should be using `this.topState()` below, but it currently
	                        // returns the second top instead of the first top. Opened an
	                        // issue about it at https://github.com/zaach/jison/issues/291
	                        if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
	                            return 15;
	                        } else {
	                            strip(5, 9);
	                            return 18;
	                        }
	                    case 5:
	                        return 15;
	                    case 6:
	                        this.popState();
	                        return 14;
	                    case 7:
	                        return 64;
	                    case 8:
	                        return 67;
	                    case 9:
	                        return 19;
	                    case 10:
	                        this.popState();
	                        this.begin('raw');
	                        return 23;
	                    case 11:
	                        return 56;
	                    case 12:
	                        return 60;
	                    case 13:
	                        return 29;
	                    case 14:
	                        return 47;
	                    case 15:
	                        this.popState();
	                        return 44;
	                    case 16:
	                        this.popState();
	                        return 44;
	                    case 17:
	                        return 34;
	                    case 18:
	                        return 39;
	                    case 19:
	                        return 52;
	                    case 20:
	                        return 48;
	                    case 21:
	                        this.unput(yy_.yytext);
	                        this.popState();
	                        this.begin('com');
	                        break;
	                    case 22:
	                        this.popState();
	                        return 14;
	                    case 23:
	                        return 48;
	                    case 24:
	                        return 72;
	                    case 25:
	                        return 71;
	                    case 26:
	                        return 71;
	                    case 27:
	                        return 86;
	                    case 28:
	                        break;
	                    case 29:
	                        this.popState();
	                        return 55;
	                    case 30:
	                        this.popState();
	                        return 33;
	                    case 31:
	                        yy_.yytext = strip(1, 2).replace(/\\"/g, '"');
	                        return 79;
	                    case 32:
	                        yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
	                        return 79;
	                    case 33:
	                        return 84;
	                    case 34:
	                        return 81;
	                    case 35:
	                        return 81;
	                    case 36:
	                        return 82;
	                    case 37:
	                        return 83;
	                    case 38:
	                        return 80;
	                    case 39:
	                        return 74;
	                    case 40:
	                        return 76;
	                    case 41:
	                        return 71;
	                    case 42:
	                        yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');
	                        return 71;
	                    case 43:
	                        return 'INVALID';
	                    case 44:
	                        return 5;
	                }
	            },
	            rules: [
	                /^(?:[^\x00]*?(?=(\{\{)))/,
	                /^(?:[^\x00]+)/,
	                /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,
	                /^(?:\{\{\{\{(?=[^/]))/,
	                /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,
	                /^(?:[^\x00]+?(?=(\{\{\{\{)))/,
	                /^(?:[\s\S]*?--(~)?\}\})/,
	                /^(?:\()/,
	                /^(?:\))/,
	                /^(?:\{\{\{\{)/,
	                /^(?:\}\}\}\})/,
	                /^(?:\{\{(~)?>)/,
	                /^(?:\{\{(~)?#>)/,
	                /^(?:\{\{(~)?#\*?)/,
	                /^(?:\{\{(~)?\/)/,
	                /^(?:\{\{(~)?\^\s*(~)?\}\})/,
	                /^(?:\{\{(~)?\s*else\s*(~)?\}\})/,
	                /^(?:\{\{(~)?\^)/,
	                /^(?:\{\{(~)?\s*else\b)/,
	                /^(?:\{\{(~)?\{)/,
	                /^(?:\{\{(~)?&)/,
	                /^(?:\{\{(~)?!--)/,
	                /^(?:\{\{(~)?![\s\S]*?\}\})/,
	                /^(?:\{\{(~)?\*?)/,
	                /^(?:=)/,
	                /^(?:\.\.)/,
	                /^(?:\.(?=([=~}\s\/.)|])))/,
	                /^(?:[\/.])/,
	                /^(?:\s+)/,
	                /^(?:\}(~)?\}\})/,
	                /^(?:(~)?\}\})/,
	                /^(?:"(\\["]|[^"])*")/,
	                /^(?:'(\\[']|[^'])*')/,
	                /^(?:@)/,
	                /^(?:true(?=([~}\s)])))/,
	                /^(?:false(?=([~}\s)])))/,
	                /^(?:undefined(?=([~}\s)])))/,
	                /^(?:null(?=([~}\s)])))/,
	                /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,
	                /^(?:as\s+\|)/,
	                /^(?:\|)/,
	                /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,
	                /^(?:\[(\\\]|[^\]])*\])/,
	                /^(?:.)/,
	                /^(?:$)/
	            ],
	            conditions: {
	                "mu": {
	                    "rules": [
	                        7,
	                        8,
	                        9,
	                        10,
	                        11,
	                        12,
	                        13,
	                        14,
	                        15,
	                        16,
	                        17,
	                        18,
	                        19,
	                        20,
	                        21,
	                        22,
	                        23,
	                        24,
	                        25,
	                        26,
	                        27,
	                        28,
	                        29,
	                        30,
	                        31,
	                        32,
	                        33,
	                        34,
	                        35,
	                        36,
	                        37,
	                        38,
	                        39,
	                        40,
	                        41,
	                        42,
	                        43,
	                        44
	                    ],
	                    "inclusive": false
	                },
	                "emu": {
	                    "rules": [
	                        2
	                    ],
	                    "inclusive": false
	                },
	                "com": {
	                    "rules": [
	                        6
	                    ],
	                    "inclusive": false
	                },
	                "raw": {
	                    "rules": [
	                        3,
	                        4,
	                        5
	                    ],
	                    "inclusive": false
	                },
	                "INITIAL": {
	                    "rules": [
	                        0,
	                        1,
	                        44
	                    ],
	                    "inclusive": true
	                }
	            }
	        };
	        return lexer;
	    }();
	    parser.lexer = lexer;
	    function Parser() {
	        this.yy = {};
	    }
	    Parser.prototype = parser;
	    parser.Parser = Parser;
	    return new Parser;
	}();

	function PrintVisitor() {
	    this.padding = 0;
	}
	PrintVisitor.prototype = new Visitor();
	PrintVisitor.prototype.pad = function(string) {
	    var out = '';
	    for(var i = 0, l = this.padding; i < l; i++){
	        out += '  ';
	    }
	    out += string + '\n';
	    return out;
	};
	PrintVisitor.prototype.Program = function(program) {
	    var out = '', body = program.body, i, l;
	    if (program.blockParams) {
	        var blockParams = 'BLOCK PARAMS: [';
	        for(i = 0, l = program.blockParams.length; i < l; i++){
	            blockParams += ' ' + program.blockParams[i];
	        }
	        blockParams += ' ]';
	        out += this.pad(blockParams);
	    }
	    for(i = 0, l = body.length; i < l; i++){
	        out += this.accept(body[i]);
	    }
	    this.padding--;
	    return out;
	};
	PrintVisitor.prototype.MustacheStatement = function(mustache) {
	    return this.pad('{{ ' + this.SubExpression(mustache) + ' }}');
	};
	PrintVisitor.prototype.Decorator = function(mustache) {
	    return this.pad('{{ DIRECTIVE ' + this.SubExpression(mustache) + ' }}');
	};
	PrintVisitor.prototype.BlockStatement = PrintVisitor.prototype.DecoratorBlock = function(block) {
	    var out = '';
	    out += this.pad((block.type === 'DecoratorBlock' ? 'DIRECTIVE ' : '') + 'BLOCK:');
	    this.padding++;
	    out += this.pad(this.SubExpression(block));
	    if (block.program) {
	        out += this.pad('PROGRAM:');
	        this.padding++;
	        out += this.accept(block.program);
	        this.padding--;
	    }
	    if (block.inverse) {
	        if (block.program) {
	            this.padding++;
	        }
	        out += this.pad('{{^}}');
	        this.padding++;
	        out += this.accept(block.inverse);
	        this.padding--;
	        if (block.program) {
	            this.padding--;
	        }
	    }
	    this.padding--;
	    return out;
	};
	PrintVisitor.prototype.PartialStatement = function(partial) {
	    var content = 'PARTIAL:' + partial.name.original;
	    if (partial.params[0]) {
	        content += ' ' + this.accept(partial.params[0]);
	    }
	    if (partial.hash) {
	        content += ' ' + this.accept(partial.hash);
	    }
	    return this.pad('{{> ' + content + ' }}');
	};
	PrintVisitor.prototype.PartialBlockStatement = function(partial) {
	    var content = 'PARTIAL BLOCK:' + partial.name.original;
	    if (partial.params[0]) {
	        content += ' ' + this.accept(partial.params[0]);
	    }
	    if (partial.hash) {
	        content += ' ' + this.accept(partial.hash);
	    }
	    content += ' ' + this.pad('PROGRAM:');
	    this.padding++;
	    content += this.accept(partial.program);
	    this.padding--;
	    return this.pad('{{> ' + content + ' }}');
	};
	PrintVisitor.prototype.ContentStatement = function(content) {
	    return this.pad("CONTENT[ '" + content.value + "' ]");
	};
	PrintVisitor.prototype.CommentStatement = function(comment) {
	    return this.pad("{{! '" + comment.value + "' }}");
	};
	PrintVisitor.prototype.SubExpression = function(sexpr) {
	    var params = sexpr.params, paramStrings = [], hash;
	    for(var i = 0, l = params.length; i < l; i++){
	        paramStrings.push(this.accept(params[i]));
	    }
	    params = '[' + paramStrings.join(', ') + ']';
	    hash = sexpr.hash ? ' ' + this.accept(sexpr.hash) : '';
	    return this.accept(sexpr.path) + ' ' + params + hash;
	};
	PrintVisitor.prototype.PathExpression = function(id) {
	    var path = id.parts.join('/');
	    return (id.data ? '@' : '') + 'PATH:' + path;
	};
	PrintVisitor.prototype.StringLiteral = function(string) {
	    return '"' + string.value + '"';
	};
	PrintVisitor.prototype.NumberLiteral = function(number) {
	    return 'NUMBER{' + number.value + '}';
	};
	PrintVisitor.prototype.BooleanLiteral = function(bool) {
	    return 'BOOLEAN{' + bool.value + '}';
	};
	PrintVisitor.prototype.UndefinedLiteral = function() {
	    return 'UNDEFINED';
	};
	PrintVisitor.prototype.NullLiteral = function() {
	    return 'NULL';
	};
	PrintVisitor.prototype.Hash = function(hash) {
	    var pairs = hash.pairs, joinedPairs = [];
	    for(var i = 0, l = pairs.length; i < l; i++){
	        joinedPairs.push(this.accept(pairs[i]));
	    }
	    return 'HASH{' + joinedPairs.join(', ') + '}';
	};
	PrintVisitor.prototype.HashPair = function(pair) {
	    return pair.key + '=' + this.accept(pair.value);
	}; /* eslint-enable new-cap */

	function validateClose(open, close) {
	    close = close.path ? close.path.original : close;
	    if (open.path.original !== close) {
	        var errorNode = {
	            loc: open.path.loc
	        };
	        throw new Exception(open.path.original + " doesn't match " + close, errorNode);
	    }
	}
	function SourceLocation(source, locInfo) {
	    this.source = source;
	    this.start = {
	        line: locInfo.first_line,
	        column: locInfo.first_column
	    };
	    this.end = {
	        line: locInfo.last_line,
	        column: locInfo.last_column
	    };
	}
	function id(token) {
	    if (/^\[.*\]$/.test(token)) {
	        return token.substring(1, token.length - 1);
	    } else {
	        return token;
	    }
	}
	function stripFlags(open, close) {
	    return {
	        open: open.charAt(2) === '~',
	        close: close.charAt(close.length - 3) === '~'
	    };
	}
	function stripComment(comment) {
	    return comment.replace(/^\{\{~?!-?-?/, '').replace(/-?-?~?\}\}$/, '');
	}
	function preparePath(data, parts, loc) {
	    loc = this.locInfo(loc);
	    var original = data ? '@' : '', dig = [], depth = 0;
	    for(var i = 0, l = parts.length; i < l; i++){
	        var part = parts[i].part, // If we have [] syntax then we do not treat path references as operators,
	        // i.e. foo.[this] resolves to approximately context.foo['this']
	        isLiteral = parts[i].original !== part;
	        original += (parts[i].separator || '') + part;
	        if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
	            if (dig.length > 0) {
	                throw new Exception('Invalid path: ' + original, {
	                    loc: loc
	                });
	            } else if (part === '..') {
	                depth++;
	            }
	        } else {
	            dig.push(part);
	        }
	    }
	    return {
	        type: 'PathExpression',
	        data: data,
	        depth: depth,
	        parts: dig,
	        original: original,
	        loc: loc
	    };
	}
	function prepareMustache(path, params, hash, open, strip, locInfo) {
	    // Must use charAt to support IE pre-10
	    var escapeFlag = open.charAt(3) || open.charAt(2), escaped = escapeFlag !== '{' && escapeFlag !== '&';
	    var decorator = /\*/.test(open);
	    return {
	        type: decorator ? 'Decorator' : 'MustacheStatement',
	        path: path,
	        params: params,
	        hash: hash,
	        escaped: escaped,
	        strip: strip,
	        loc: this.locInfo(locInfo)
	    };
	}
	function prepareRawBlock(openRawBlock, contents, close, locInfo) {
	    validateClose(openRawBlock, close);
	    locInfo = this.locInfo(locInfo);
	    var program = {
	        type: 'Program',
	        body: contents,
	        strip: {},
	        loc: locInfo
	    };
	    return {
	        type: 'BlockStatement',
	        path: openRawBlock.path,
	        params: openRawBlock.params,
	        hash: openRawBlock.hash,
	        program: program,
	        openStrip: {},
	        inverseStrip: {},
	        closeStrip: {},
	        loc: locInfo
	    };
	}
	function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
	    if (close && close.path) {
	        validateClose(openBlock, close);
	    }
	    var decorator = /\*/.test(openBlock.open);
	    program.blockParams = openBlock.blockParams;
	    var inverse, inverseStrip;
	    if (inverseAndProgram) {
	        if (decorator) {
	            throw new Exception('Unexpected inverse block on decorator', inverseAndProgram);
	        }
	        if (inverseAndProgram.chain) {
	            inverseAndProgram.program.body[0].closeStrip = close.strip;
	        }
	        inverseStrip = inverseAndProgram.strip;
	        inverse = inverseAndProgram.program;
	    }
	    if (inverted) {
	        inverted = inverse;
	        inverse = program;
	        program = inverted;
	    }
	    return {
	        type: decorator ? 'DecoratorBlock' : 'BlockStatement',
	        path: openBlock.path,
	        params: openBlock.params,
	        hash: openBlock.hash,
	        program: program,
	        inverse: inverse,
	        openStrip: openBlock.strip,
	        inverseStrip: inverseStrip,
	        closeStrip: close && close.strip,
	        loc: this.locInfo(locInfo)
	    };
	}
	function prepareProgram(statements, loc) {
	    if (!loc && statements.length) {
	        var firstLoc = statements[0].loc, lastLoc = statements[statements.length - 1].loc;
	        /* istanbul ignore else */ if (firstLoc && lastLoc) {
	            loc = {
	                source: firstLoc.source,
	                start: {
	                    line: firstLoc.start.line,
	                    column: firstLoc.start.column
	                },
	                end: {
	                    line: lastLoc.end.line,
	                    column: lastLoc.end.column
	                }
	            };
	        }
	    }
	    return {
	        type: 'Program',
	        body: statements,
	        strip: {},
	        loc: loc
	    };
	}
	function preparePartialBlock(open, program, close, locInfo) {
	    validateClose(open, close);
	    return {
	        type: 'PartialBlockStatement',
	        name: open.path,
	        params: open.params,
	        hash: open.hash,
	        program: program,
	        openStrip: open.strip,
	        closeStrip: close && close.strip,
	        loc: this.locInfo(locInfo)
	    };
	}

	var Helpers = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  SourceLocation: SourceLocation,
	  id: id,
	  prepareBlock: prepareBlock,
	  prepareMustache: prepareMustache,
	  preparePartialBlock: preparePartialBlock,
	  preparePath: preparePath,
	  prepareProgram: prepareProgram,
	  prepareRawBlock: prepareRawBlock,
	  stripComment: stripComment,
	  stripFlags: stripFlags
	});

	var baseHelpers = {};
	for(var helper in Helpers){
	    if (Object.prototype.hasOwnProperty.call(Helpers, helper)) {
	        baseHelpers[helper] = Helpers[helper];
	    }
	}
	function parseWithoutProcessing(input, options) {
	    // Just return if an already-compiled AST was passed in.
	    if (input.type === 'Program') {
	        return input;
	    }
	    parser.yy = baseHelpers;
	    // Altering the shared object here, but this is ok as parser is a sync operation
	    parser.yy.locInfo = function(locInfo) {
	        return new SourceLocation(options && options.srcName, locInfo);
	    };
	    var ast = parser.parse(input);
	    return ast;
	}
	function parse(input, options) {
	    var ast = parseWithoutProcessing(input, options);
	    var strip = new WhitespaceControl(options);
	    return strip.accept(ast);
	}

	/**
	 * generated from https://raw.githubusercontent.com/w3c/html/26b5126f96f736f796b9e29718138919dd513744/entities.json
	 * do not edit
	 */ var namedCharRefs = {
	    Aacute: "Á",
	    aacute: "á",
	    Abreve: "Ă",
	    abreve: "ă",
	    ac: "∾",
	    acd: "∿",
	    acE: "∾̳",
	    Acirc: "Â",
	    acirc: "â",
	    acute: "´",
	    Acy: "А",
	    acy: "а",
	    AElig: "Æ",
	    aelig: "æ",
	    af: "\u2061",
	    Afr: "𝔄",
	    afr: "𝔞",
	    Agrave: "À",
	    agrave: "à",
	    alefsym: "ℵ",
	    aleph: "ℵ",
	    Alpha: "Α",
	    alpha: "α",
	    Amacr: "Ā",
	    amacr: "ā",
	    amalg: "⨿",
	    amp: "&",
	    AMP: "&",
	    andand: "⩕",
	    And: "⩓",
	    and: "∧",
	    andd: "⩜",
	    andslope: "⩘",
	    andv: "⩚",
	    ang: "∠",
	    ange: "⦤",
	    angle: "∠",
	    angmsdaa: "⦨",
	    angmsdab: "⦩",
	    angmsdac: "⦪",
	    angmsdad: "⦫",
	    angmsdae: "⦬",
	    angmsdaf: "⦭",
	    angmsdag: "⦮",
	    angmsdah: "⦯",
	    angmsd: "∡",
	    angrt: "∟",
	    angrtvb: "⊾",
	    angrtvbd: "⦝",
	    angsph: "∢",
	    angst: "Å",
	    angzarr: "⍼",
	    Aogon: "Ą",
	    aogon: "ą",
	    Aopf: "𝔸",
	    aopf: "𝕒",
	    apacir: "⩯",
	    ap: "≈",
	    apE: "⩰",
	    ape: "≊",
	    apid: "≋",
	    apos: "'",
	    ApplyFunction: "\u2061",
	    approx: "≈",
	    approxeq: "≊",
	    Aring: "Å",
	    aring: "å",
	    Ascr: "𝒜",
	    ascr: "𝒶",
	    Assign: "≔",
	    ast: "*",
	    asymp: "≈",
	    asympeq: "≍",
	    Atilde: "Ã",
	    atilde: "ã",
	    Auml: "Ä",
	    auml: "ä",
	    awconint: "∳",
	    awint: "⨑",
	    backcong: "≌",
	    backepsilon: "϶",
	    backprime: "‵",
	    backsim: "∽",
	    backsimeq: "⋍",
	    Backslash: "∖",
	    Barv: "⫧",
	    barvee: "⊽",
	    barwed: "⌅",
	    Barwed: "⌆",
	    barwedge: "⌅",
	    bbrk: "⎵",
	    bbrktbrk: "⎶",
	    bcong: "≌",
	    Bcy: "Б",
	    bcy: "б",
	    bdquo: "„",
	    becaus: "∵",
	    because: "∵",
	    Because: "∵",
	    bemptyv: "⦰",
	    bepsi: "϶",
	    bernou: "ℬ",
	    Bernoullis: "ℬ",
	    Beta: "Β",
	    beta: "β",
	    beth: "ℶ",
	    between: "≬",
	    Bfr: "𝔅",
	    bfr: "𝔟",
	    bigcap: "⋂",
	    bigcirc: "◯",
	    bigcup: "⋃",
	    bigodot: "⨀",
	    bigoplus: "⨁",
	    bigotimes: "⨂",
	    bigsqcup: "⨆",
	    bigstar: "★",
	    bigtriangledown: "▽",
	    bigtriangleup: "△",
	    biguplus: "⨄",
	    bigvee: "⋁",
	    bigwedge: "⋀",
	    bkarow: "⤍",
	    blacklozenge: "⧫",
	    blacksquare: "▪",
	    blacktriangle: "▴",
	    blacktriangledown: "▾",
	    blacktriangleleft: "◂",
	    blacktriangleright: "▸",
	    blank: "␣",
	    blk12: "▒",
	    blk14: "░",
	    blk34: "▓",
	    block: "█",
	    bne: "=⃥",
	    bnequiv: "≡⃥",
	    bNot: "⫭",
	    bnot: "⌐",
	    Bopf: "𝔹",
	    bopf: "𝕓",
	    bot: "⊥",
	    bottom: "⊥",
	    bowtie: "⋈",
	    boxbox: "⧉",
	    boxdl: "┐",
	    boxdL: "╕",
	    boxDl: "╖",
	    boxDL: "╗",
	    boxdr: "┌",
	    boxdR: "╒",
	    boxDr: "╓",
	    boxDR: "╔",
	    boxh: "─",
	    boxH: "═",
	    boxhd: "┬",
	    boxHd: "╤",
	    boxhD: "╥",
	    boxHD: "╦",
	    boxhu: "┴",
	    boxHu: "╧",
	    boxhU: "╨",
	    boxHU: "╩",
	    boxminus: "⊟",
	    boxplus: "⊞",
	    boxtimes: "⊠",
	    boxul: "┘",
	    boxuL: "╛",
	    boxUl: "╜",
	    boxUL: "╝",
	    boxur: "└",
	    boxuR: "╘",
	    boxUr: "╙",
	    boxUR: "╚",
	    boxv: "│",
	    boxV: "║",
	    boxvh: "┼",
	    boxvH: "╪",
	    boxVh: "╫",
	    boxVH: "╬",
	    boxvl: "┤",
	    boxvL: "╡",
	    boxVl: "╢",
	    boxVL: "╣",
	    boxvr: "├",
	    boxvR: "╞",
	    boxVr: "╟",
	    boxVR: "╠",
	    bprime: "‵",
	    breve: "˘",
	    Breve: "˘",
	    brvbar: "¦",
	    bscr: "𝒷",
	    Bscr: "ℬ",
	    bsemi: "⁏",
	    bsim: "∽",
	    bsime: "⋍",
	    bsolb: "⧅",
	    bsol: "\\",
	    bsolhsub: "⟈",
	    bull: "•",
	    bullet: "•",
	    bump: "≎",
	    bumpE: "⪮",
	    bumpe: "≏",
	    Bumpeq: "≎",
	    bumpeq: "≏",
	    Cacute: "Ć",
	    cacute: "ć",
	    capand: "⩄",
	    capbrcup: "⩉",
	    capcap: "⩋",
	    cap: "∩",
	    Cap: "⋒",
	    capcup: "⩇",
	    capdot: "⩀",
	    CapitalDifferentialD: "ⅅ",
	    caps: "∩︀",
	    caret: "⁁",
	    caron: "ˇ",
	    Cayleys: "ℭ",
	    ccaps: "⩍",
	    Ccaron: "Č",
	    ccaron: "č",
	    Ccedil: "Ç",
	    ccedil: "ç",
	    Ccirc: "Ĉ",
	    ccirc: "ĉ",
	    Cconint: "∰",
	    ccups: "⩌",
	    ccupssm: "⩐",
	    Cdot: "Ċ",
	    cdot: "ċ",
	    cedil: "¸",
	    Cedilla: "¸",
	    cemptyv: "⦲",
	    cent: "¢",
	    centerdot: "·",
	    CenterDot: "·",
	    cfr: "𝔠",
	    Cfr: "ℭ",
	    CHcy: "Ч",
	    chcy: "ч",
	    check: "✓",
	    checkmark: "✓",
	    Chi: "Χ",
	    chi: "χ",
	    circ: "ˆ",
	    circeq: "≗",
	    circlearrowleft: "↺",
	    circlearrowright: "↻",
	    circledast: "⊛",
	    circledcirc: "⊚",
	    circleddash: "⊝",
	    CircleDot: "⊙",
	    circledR: "®",
	    circledS: "Ⓢ",
	    CircleMinus: "⊖",
	    CirclePlus: "⊕",
	    CircleTimes: "⊗",
	    cir: "○",
	    cirE: "⧃",
	    cire: "≗",
	    cirfnint: "⨐",
	    cirmid: "⫯",
	    cirscir: "⧂",
	    ClockwiseContourIntegral: "∲",
	    CloseCurlyDoubleQuote: "”",
	    CloseCurlyQuote: "’",
	    clubs: "♣",
	    clubsuit: "♣",
	    colon: ":",
	    Colon: "∷",
	    Colone: "⩴",
	    colone: "≔",
	    coloneq: "≔",
	    comma: ",",
	    commat: "@",
	    comp: "∁",
	    compfn: "∘",
	    complement: "∁",
	    complexes: "ℂ",
	    cong: "≅",
	    congdot: "⩭",
	    Congruent: "≡",
	    conint: "∮",
	    Conint: "∯",
	    ContourIntegral: "∮",
	    copf: "𝕔",
	    Copf: "ℂ",
	    coprod: "∐",
	    Coproduct: "∐",
	    copy: "©",
	    COPY: "©",
	    copysr: "℗",
	    CounterClockwiseContourIntegral: "∳",
	    crarr: "↵",
	    cross: "✗",
	    Cross: "⨯",
	    Cscr: "𝒞",
	    cscr: "𝒸",
	    csub: "⫏",
	    csube: "⫑",
	    csup: "⫐",
	    csupe: "⫒",
	    ctdot: "⋯",
	    cudarrl: "⤸",
	    cudarrr: "⤵",
	    cuepr: "⋞",
	    cuesc: "⋟",
	    cularr: "↶",
	    cularrp: "⤽",
	    cupbrcap: "⩈",
	    cupcap: "⩆",
	    CupCap: "≍",
	    cup: "∪",
	    Cup: "⋓",
	    cupcup: "⩊",
	    cupdot: "⊍",
	    cupor: "⩅",
	    cups: "∪︀",
	    curarr: "↷",
	    curarrm: "⤼",
	    curlyeqprec: "⋞",
	    curlyeqsucc: "⋟",
	    curlyvee: "⋎",
	    curlywedge: "⋏",
	    curren: "¤",
	    curvearrowleft: "↶",
	    curvearrowright: "↷",
	    cuvee: "⋎",
	    cuwed: "⋏",
	    cwconint: "∲",
	    cwint: "∱",
	    cylcty: "⌭",
	    dagger: "†",
	    Dagger: "‡",
	    daleth: "ℸ",
	    darr: "↓",
	    Darr: "↡",
	    dArr: "⇓",
	    dash: "‐",
	    Dashv: "⫤",
	    dashv: "⊣",
	    dbkarow: "⤏",
	    dblac: "˝",
	    Dcaron: "Ď",
	    dcaron: "ď",
	    Dcy: "Д",
	    dcy: "д",
	    ddagger: "‡",
	    ddarr: "⇊",
	    DD: "ⅅ",
	    dd: "ⅆ",
	    DDotrahd: "⤑",
	    ddotseq: "⩷",
	    deg: "°",
	    Del: "∇",
	    Delta: "Δ",
	    delta: "δ",
	    demptyv: "⦱",
	    dfisht: "⥿",
	    Dfr: "𝔇",
	    dfr: "𝔡",
	    dHar: "⥥",
	    dharl: "⇃",
	    dharr: "⇂",
	    DiacriticalAcute: "´",
	    DiacriticalDot: "˙",
	    DiacriticalDoubleAcute: "˝",
	    DiacriticalGrave: "`",
	    DiacriticalTilde: "˜",
	    diam: "⋄",
	    diamond: "⋄",
	    Diamond: "⋄",
	    diamondsuit: "♦",
	    diams: "♦",
	    die: "¨",
	    DifferentialD: "ⅆ",
	    digamma: "ϝ",
	    disin: "⋲",
	    div: "÷",
	    divide: "÷",
	    divideontimes: "⋇",
	    divonx: "⋇",
	    DJcy: "Ђ",
	    djcy: "ђ",
	    dlcorn: "⌞",
	    dlcrop: "⌍",
	    dollar: "$",
	    Dopf: "𝔻",
	    dopf: "𝕕",
	    Dot: "¨",
	    dot: "˙",
	    DotDot: "⃜",
	    doteq: "≐",
	    doteqdot: "≑",
	    DotEqual: "≐",
	    dotminus: "∸",
	    dotplus: "∔",
	    dotsquare: "⊡",
	    doublebarwedge: "⌆",
	    DoubleContourIntegral: "∯",
	    DoubleDot: "¨",
	    DoubleDownArrow: "⇓",
	    DoubleLeftArrow: "⇐",
	    DoubleLeftRightArrow: "⇔",
	    DoubleLeftTee: "⫤",
	    DoubleLongLeftArrow: "⟸",
	    DoubleLongLeftRightArrow: "⟺",
	    DoubleLongRightArrow: "⟹",
	    DoubleRightArrow: "⇒",
	    DoubleRightTee: "⊨",
	    DoubleUpArrow: "⇑",
	    DoubleUpDownArrow: "⇕",
	    DoubleVerticalBar: "∥",
	    DownArrowBar: "⤓",
	    downarrow: "↓",
	    DownArrow: "↓",
	    Downarrow: "⇓",
	    DownArrowUpArrow: "⇵",
	    DownBreve: "̑",
	    downdownarrows: "⇊",
	    downharpoonleft: "⇃",
	    downharpoonright: "⇂",
	    DownLeftRightVector: "⥐",
	    DownLeftTeeVector: "⥞",
	    DownLeftVectorBar: "⥖",
	    DownLeftVector: "↽",
	    DownRightTeeVector: "⥟",
	    DownRightVectorBar: "⥗",
	    DownRightVector: "⇁",
	    DownTeeArrow: "↧",
	    DownTee: "⊤",
	    drbkarow: "⤐",
	    drcorn: "⌟",
	    drcrop: "⌌",
	    Dscr: "𝒟",
	    dscr: "𝒹",
	    DScy: "Ѕ",
	    dscy: "ѕ",
	    dsol: "⧶",
	    Dstrok: "Đ",
	    dstrok: "đ",
	    dtdot: "⋱",
	    dtri: "▿",
	    dtrif: "▾",
	    duarr: "⇵",
	    duhar: "⥯",
	    dwangle: "⦦",
	    DZcy: "Џ",
	    dzcy: "џ",
	    dzigrarr: "⟿",
	    Eacute: "É",
	    eacute: "é",
	    easter: "⩮",
	    Ecaron: "Ě",
	    ecaron: "ě",
	    Ecirc: "Ê",
	    ecirc: "ê",
	    ecir: "≖",
	    ecolon: "≕",
	    Ecy: "Э",
	    ecy: "э",
	    eDDot: "⩷",
	    Edot: "Ė",
	    edot: "ė",
	    eDot: "≑",
	    ee: "ⅇ",
	    efDot: "≒",
	    Efr: "𝔈",
	    efr: "𝔢",
	    eg: "⪚",
	    Egrave: "È",
	    egrave: "è",
	    egs: "⪖",
	    egsdot: "⪘",
	    el: "⪙",
	    Element: "∈",
	    elinters: "⏧",
	    ell: "ℓ",
	    els: "⪕",
	    elsdot: "⪗",
	    Emacr: "Ē",
	    emacr: "ē",
	    empty: "∅",
	    emptyset: "∅",
	    EmptySmallSquare: "◻",
	    emptyv: "∅",
	    EmptyVerySmallSquare: "▫",
	    emsp13: " ",
	    emsp14: " ",
	    emsp: " ",
	    ENG: "Ŋ",
	    eng: "ŋ",
	    ensp: " ",
	    Eogon: "Ę",
	    eogon: "ę",
	    Eopf: "𝔼",
	    eopf: "𝕖",
	    epar: "⋕",
	    eparsl: "⧣",
	    eplus: "⩱",
	    epsi: "ε",
	    Epsilon: "Ε",
	    epsilon: "ε",
	    epsiv: "ϵ",
	    eqcirc: "≖",
	    eqcolon: "≕",
	    eqsim: "≂",
	    eqslantgtr: "⪖",
	    eqslantless: "⪕",
	    Equal: "⩵",
	    equals: "=",
	    EqualTilde: "≂",
	    equest: "≟",
	    Equilibrium: "⇌",
	    equiv: "≡",
	    equivDD: "⩸",
	    eqvparsl: "⧥",
	    erarr: "⥱",
	    erDot: "≓",
	    escr: "ℯ",
	    Escr: "ℰ",
	    esdot: "≐",
	    Esim: "⩳",
	    esim: "≂",
	    Eta: "Η",
	    eta: "η",
	    ETH: "Ð",
	    eth: "ð",
	    Euml: "Ë",
	    euml: "ë",
	    euro: "€",
	    excl: "!",
	    exist: "∃",
	    Exists: "∃",
	    expectation: "ℰ",
	    exponentiale: "ⅇ",
	    ExponentialE: "ⅇ",
	    fallingdotseq: "≒",
	    Fcy: "Ф",
	    fcy: "ф",
	    female: "♀",
	    ffilig: "ﬃ",
	    fflig: "ﬀ",
	    ffllig: "ﬄ",
	    Ffr: "𝔉",
	    ffr: "𝔣",
	    filig: "ﬁ",
	    FilledSmallSquare: "◼",
	    FilledVerySmallSquare: "▪",
	    fjlig: "fj",
	    flat: "♭",
	    fllig: "ﬂ",
	    fltns: "▱",
	    fnof: "ƒ",
	    Fopf: "𝔽",
	    fopf: "𝕗",
	    forall: "∀",
	    ForAll: "∀",
	    fork: "⋔",
	    forkv: "⫙",
	    Fouriertrf: "ℱ",
	    fpartint: "⨍",
	    frac12: "½",
	    frac13: "⅓",
	    frac14: "¼",
	    frac15: "⅕",
	    frac16: "⅙",
	    frac18: "⅛",
	    frac23: "⅔",
	    frac25: "⅖",
	    frac34: "¾",
	    frac35: "⅗",
	    frac38: "⅜",
	    frac45: "⅘",
	    frac56: "⅚",
	    frac58: "⅝",
	    frac78: "⅞",
	    frasl: "⁄",
	    frown: "⌢",
	    fscr: "𝒻",
	    Fscr: "ℱ",
	    gacute: "ǵ",
	    Gamma: "Γ",
	    gamma: "γ",
	    Gammad: "Ϝ",
	    gammad: "ϝ",
	    gap: "⪆",
	    Gbreve: "Ğ",
	    gbreve: "ğ",
	    Gcedil: "Ģ",
	    Gcirc: "Ĝ",
	    gcirc: "ĝ",
	    Gcy: "Г",
	    gcy: "г",
	    Gdot: "Ġ",
	    gdot: "ġ",
	    ge: "≥",
	    gE: "≧",
	    gEl: "⪌",
	    gel: "⋛",
	    geq: "≥",
	    geqq: "≧",
	    geqslant: "⩾",
	    gescc: "⪩",
	    ges: "⩾",
	    gesdot: "⪀",
	    gesdoto: "⪂",
	    gesdotol: "⪄",
	    gesl: "⋛︀",
	    gesles: "⪔",
	    Gfr: "𝔊",
	    gfr: "𝔤",
	    gg: "≫",
	    Gg: "⋙",
	    ggg: "⋙",
	    gimel: "ℷ",
	    GJcy: "Ѓ",
	    gjcy: "ѓ",
	    gla: "⪥",
	    gl: "≷",
	    glE: "⪒",
	    glj: "⪤",
	    gnap: "⪊",
	    gnapprox: "⪊",
	    gne: "⪈",
	    gnE: "≩",
	    gneq: "⪈",
	    gneqq: "≩",
	    gnsim: "⋧",
	    Gopf: "𝔾",
	    gopf: "𝕘",
	    grave: "`",
	    GreaterEqual: "≥",
	    GreaterEqualLess: "⋛",
	    GreaterFullEqual: "≧",
	    GreaterGreater: "⪢",
	    GreaterLess: "≷",
	    GreaterSlantEqual: "⩾",
	    GreaterTilde: "≳",
	    Gscr: "𝒢",
	    gscr: "ℊ",
	    gsim: "≳",
	    gsime: "⪎",
	    gsiml: "⪐",
	    gtcc: "⪧",
	    gtcir: "⩺",
	    gt: ">",
	    GT: ">",
	    Gt: "≫",
	    gtdot: "⋗",
	    gtlPar: "⦕",
	    gtquest: "⩼",
	    gtrapprox: "⪆",
	    gtrarr: "⥸",
	    gtrdot: "⋗",
	    gtreqless: "⋛",
	    gtreqqless: "⪌",
	    gtrless: "≷",
	    gtrsim: "≳",
	    gvertneqq: "≩︀",
	    gvnE: "≩︀",
	    Hacek: "ˇ",
	    hairsp: " ",
	    half: "½",
	    hamilt: "ℋ",
	    HARDcy: "Ъ",
	    hardcy: "ъ",
	    harrcir: "⥈",
	    harr: "↔",
	    hArr: "⇔",
	    harrw: "↭",
	    Hat: "^",
	    hbar: "ℏ",
	    Hcirc: "Ĥ",
	    hcirc: "ĥ",
	    hearts: "♥",
	    heartsuit: "♥",
	    hellip: "…",
	    hercon: "⊹",
	    hfr: "𝔥",
	    Hfr: "ℌ",
	    HilbertSpace: "ℋ",
	    hksearow: "⤥",
	    hkswarow: "⤦",
	    hoarr: "⇿",
	    homtht: "∻",
	    hookleftarrow: "↩",
	    hookrightarrow: "↪",
	    hopf: "𝕙",
	    Hopf: "ℍ",
	    horbar: "―",
	    HorizontalLine: "─",
	    hscr: "𝒽",
	    Hscr: "ℋ",
	    hslash: "ℏ",
	    Hstrok: "Ħ",
	    hstrok: "ħ",
	    HumpDownHump: "≎",
	    HumpEqual: "≏",
	    hybull: "⁃",
	    hyphen: "‐",
	    Iacute: "Í",
	    iacute: "í",
	    ic: "\u2063",
	    Icirc: "Î",
	    icirc: "î",
	    Icy: "И",
	    icy: "и",
	    Idot: "İ",
	    IEcy: "Е",
	    iecy: "е",
	    iexcl: "¡",
	    iff: "⇔",
	    ifr: "𝔦",
	    Ifr: "ℑ",
	    Igrave: "Ì",
	    igrave: "ì",
	    ii: "ⅈ",
	    iiiint: "⨌",
	    iiint: "∭",
	    iinfin: "⧜",
	    iiota: "℩",
	    IJlig: "Ĳ",
	    ijlig: "ĳ",
	    Imacr: "Ī",
	    imacr: "ī",
	    image: "ℑ",
	    ImaginaryI: "ⅈ",
	    imagline: "ℐ",
	    imagpart: "ℑ",
	    imath: "ı",
	    Im: "ℑ",
	    imof: "⊷",
	    imped: "Ƶ",
	    Implies: "⇒",
	    incare: "℅",
	    in: "∈",
	    infin: "∞",
	    infintie: "⧝",
	    inodot: "ı",
	    intcal: "⊺",
	    int: "∫",
	    Int: "∬",
	    integers: "ℤ",
	    Integral: "∫",
	    intercal: "⊺",
	    Intersection: "⋂",
	    intlarhk: "⨗",
	    intprod: "⨼",
	    InvisibleComma: "\u2063",
	    InvisibleTimes: "\u2062",
	    IOcy: "Ё",
	    iocy: "ё",
	    Iogon: "Į",
	    iogon: "į",
	    Iopf: "𝕀",
	    iopf: "𝕚",
	    Iota: "Ι",
	    iota: "ι",
	    iprod: "⨼",
	    iquest: "¿",
	    iscr: "𝒾",
	    Iscr: "ℐ",
	    isin: "∈",
	    isindot: "⋵",
	    isinE: "⋹",
	    isins: "⋴",
	    isinsv: "⋳",
	    isinv: "∈",
	    it: "\u2062",
	    Itilde: "Ĩ",
	    itilde: "ĩ",
	    Iukcy: "І",
	    iukcy: "і",
	    Iuml: "Ï",
	    iuml: "ï",
	    Jcirc: "Ĵ",
	    jcirc: "ĵ",
	    Jcy: "Й",
	    jcy: "й",
	    Jfr: "𝔍",
	    jfr: "𝔧",
	    jmath: "ȷ",
	    Jopf: "𝕁",
	    jopf: "𝕛",
	    Jscr: "𝒥",
	    jscr: "𝒿",
	    Jsercy: "Ј",
	    jsercy: "ј",
	    Jukcy: "Є",
	    jukcy: "є",
	    Kappa: "Κ",
	    kappa: "κ",
	    kappav: "ϰ",
	    Kcedil: "Ķ",
	    kcedil: "ķ",
	    Kcy: "К",
	    kcy: "к",
	    Kfr: "𝔎",
	    kfr: "𝔨",
	    kgreen: "ĸ",
	    KHcy: "Х",
	    khcy: "х",
	    KJcy: "Ќ",
	    kjcy: "ќ",
	    Kopf: "𝕂",
	    kopf: "𝕜",
	    Kscr: "𝒦",
	    kscr: "𝓀",
	    lAarr: "⇚",
	    Lacute: "Ĺ",
	    lacute: "ĺ",
	    laemptyv: "⦴",
	    lagran: "ℒ",
	    Lambda: "Λ",
	    lambda: "λ",
	    lang: "⟨",
	    Lang: "⟪",
	    langd: "⦑",
	    langle: "⟨",
	    lap: "⪅",
	    Laplacetrf: "ℒ",
	    laquo: "«",
	    larrb: "⇤",
	    larrbfs: "⤟",
	    larr: "←",
	    Larr: "↞",
	    lArr: "⇐",
	    larrfs: "⤝",
	    larrhk: "↩",
	    larrlp: "↫",
	    larrpl: "⤹",
	    larrsim: "⥳",
	    larrtl: "↢",
	    latail: "⤙",
	    lAtail: "⤛",
	    lat: "⪫",
	    late: "⪭",
	    lates: "⪭︀",
	    lbarr: "⤌",
	    lBarr: "⤎",
	    lbbrk: "❲",
	    lbrace: "{",
	    lbrack: "[",
	    lbrke: "⦋",
	    lbrksld: "⦏",
	    lbrkslu: "⦍",
	    Lcaron: "Ľ",
	    lcaron: "ľ",
	    Lcedil: "Ļ",
	    lcedil: "ļ",
	    lceil: "⌈",
	    lcub: "{",
	    Lcy: "Л",
	    lcy: "л",
	    ldca: "⤶",
	    ldquo: "“",
	    ldquor: "„",
	    ldrdhar: "⥧",
	    ldrushar: "⥋",
	    ldsh: "↲",
	    le: "≤",
	    lE: "≦",
	    LeftAngleBracket: "⟨",
	    LeftArrowBar: "⇤",
	    leftarrow: "←",
	    LeftArrow: "←",
	    Leftarrow: "⇐",
	    LeftArrowRightArrow: "⇆",
	    leftarrowtail: "↢",
	    LeftCeiling: "⌈",
	    LeftDoubleBracket: "⟦",
	    LeftDownTeeVector: "⥡",
	    LeftDownVectorBar: "⥙",
	    LeftDownVector: "⇃",
	    LeftFloor: "⌊",
	    leftharpoondown: "↽",
	    leftharpoonup: "↼",
	    leftleftarrows: "⇇",
	    leftrightarrow: "↔",
	    LeftRightArrow: "↔",
	    Leftrightarrow: "⇔",
	    leftrightarrows: "⇆",
	    leftrightharpoons: "⇋",
	    leftrightsquigarrow: "↭",
	    LeftRightVector: "⥎",
	    LeftTeeArrow: "↤",
	    LeftTee: "⊣",
	    LeftTeeVector: "⥚",
	    leftthreetimes: "⋋",
	    LeftTriangleBar: "⧏",
	    LeftTriangle: "⊲",
	    LeftTriangleEqual: "⊴",
	    LeftUpDownVector: "⥑",
	    LeftUpTeeVector: "⥠",
	    LeftUpVectorBar: "⥘",
	    LeftUpVector: "↿",
	    LeftVectorBar: "⥒",
	    LeftVector: "↼",
	    lEg: "⪋",
	    leg: "⋚",
	    leq: "≤",
	    leqq: "≦",
	    leqslant: "⩽",
	    lescc: "⪨",
	    les: "⩽",
	    lesdot: "⩿",
	    lesdoto: "⪁",
	    lesdotor: "⪃",
	    lesg: "⋚︀",
	    lesges: "⪓",
	    lessapprox: "⪅",
	    lessdot: "⋖",
	    lesseqgtr: "⋚",
	    lesseqqgtr: "⪋",
	    LessEqualGreater: "⋚",
	    LessFullEqual: "≦",
	    LessGreater: "≶",
	    lessgtr: "≶",
	    LessLess: "⪡",
	    lesssim: "≲",
	    LessSlantEqual: "⩽",
	    LessTilde: "≲",
	    lfisht: "⥼",
	    lfloor: "⌊",
	    Lfr: "𝔏",
	    lfr: "𝔩",
	    lg: "≶",
	    lgE: "⪑",
	    lHar: "⥢",
	    lhard: "↽",
	    lharu: "↼",
	    lharul: "⥪",
	    lhblk: "▄",
	    LJcy: "Љ",
	    ljcy: "љ",
	    llarr: "⇇",
	    ll: "≪",
	    Ll: "⋘",
	    llcorner: "⌞",
	    Lleftarrow: "⇚",
	    llhard: "⥫",
	    lltri: "◺",
	    Lmidot: "Ŀ",
	    lmidot: "ŀ",
	    lmoustache: "⎰",
	    lmoust: "⎰",
	    lnap: "⪉",
	    lnapprox: "⪉",
	    lne: "⪇",
	    lnE: "≨",
	    lneq: "⪇",
	    lneqq: "≨",
	    lnsim: "⋦",
	    loang: "⟬",
	    loarr: "⇽",
	    lobrk: "⟦",
	    longleftarrow: "⟵",
	    LongLeftArrow: "⟵",
	    Longleftarrow: "⟸",
	    longleftrightarrow: "⟷",
	    LongLeftRightArrow: "⟷",
	    Longleftrightarrow: "⟺",
	    longmapsto: "⟼",
	    longrightarrow: "⟶",
	    LongRightArrow: "⟶",
	    Longrightarrow: "⟹",
	    looparrowleft: "↫",
	    looparrowright: "↬",
	    lopar: "⦅",
	    Lopf: "𝕃",
	    lopf: "𝕝",
	    loplus: "⨭",
	    lotimes: "⨴",
	    lowast: "∗",
	    lowbar: "_",
	    LowerLeftArrow: "↙",
	    LowerRightArrow: "↘",
	    loz: "◊",
	    lozenge: "◊",
	    lozf: "⧫",
	    lpar: "(",
	    lparlt: "⦓",
	    lrarr: "⇆",
	    lrcorner: "⌟",
	    lrhar: "⇋",
	    lrhard: "⥭",
	    lrm: "\u200e",
	    lrtri: "⊿",
	    lsaquo: "‹",
	    lscr: "𝓁",
	    Lscr: "ℒ",
	    lsh: "↰",
	    Lsh: "↰",
	    lsim: "≲",
	    lsime: "⪍",
	    lsimg: "⪏",
	    lsqb: "[",
	    lsquo: "‘",
	    lsquor: "‚",
	    Lstrok: "Ł",
	    lstrok: "ł",
	    ltcc: "⪦",
	    ltcir: "⩹",
	    lt: "<",
	    LT: "<",
	    Lt: "≪",
	    ltdot: "⋖",
	    lthree: "⋋",
	    ltimes: "⋉",
	    ltlarr: "⥶",
	    ltquest: "⩻",
	    ltri: "◃",
	    ltrie: "⊴",
	    ltrif: "◂",
	    ltrPar: "⦖",
	    lurdshar: "⥊",
	    luruhar: "⥦",
	    lvertneqq: "≨︀",
	    lvnE: "≨︀",
	    macr: "¯",
	    male: "♂",
	    malt: "✠",
	    maltese: "✠",
	    Map: "⤅",
	    map: "↦",
	    mapsto: "↦",
	    mapstodown: "↧",
	    mapstoleft: "↤",
	    mapstoup: "↥",
	    marker: "▮",
	    mcomma: "⨩",
	    Mcy: "М",
	    mcy: "м",
	    mdash: "—",
	    mDDot: "∺",
	    measuredangle: "∡",
	    MediumSpace: " ",
	    Mellintrf: "ℳ",
	    Mfr: "𝔐",
	    mfr: "𝔪",
	    mho: "℧",
	    micro: "µ",
	    midast: "*",
	    midcir: "⫰",
	    mid: "∣",
	    middot: "·",
	    minusb: "⊟",
	    minus: "−",
	    minusd: "∸",
	    minusdu: "⨪",
	    MinusPlus: "∓",
	    mlcp: "⫛",
	    mldr: "…",
	    mnplus: "∓",
	    models: "⊧",
	    Mopf: "𝕄",
	    mopf: "𝕞",
	    mp: "∓",
	    mscr: "𝓂",
	    Mscr: "ℳ",
	    mstpos: "∾",
	    Mu: "Μ",
	    mu: "μ",
	    multimap: "⊸",
	    mumap: "⊸",
	    nabla: "∇",
	    Nacute: "Ń",
	    nacute: "ń",
	    nang: "∠⃒",
	    nap: "≉",
	    napE: "⩰̸",
	    napid: "≋̸",
	    napos: "ŉ",
	    napprox: "≉",
	    natural: "♮",
	    naturals: "ℕ",
	    natur: "♮",
	    nbsp: " ",
	    nbump: "≎̸",
	    nbumpe: "≏̸",
	    ncap: "⩃",
	    Ncaron: "Ň",
	    ncaron: "ň",
	    Ncedil: "Ņ",
	    ncedil: "ņ",
	    ncong: "≇",
	    ncongdot: "⩭̸",
	    ncup: "⩂",
	    Ncy: "Н",
	    ncy: "н",
	    ndash: "–",
	    nearhk: "⤤",
	    nearr: "↗",
	    neArr: "⇗",
	    nearrow: "↗",
	    ne: "≠",
	    nedot: "≐̸",
	    NegativeMediumSpace: "​",
	    NegativeThickSpace: "​",
	    NegativeThinSpace: "​",
	    NegativeVeryThinSpace: "​",
	    nequiv: "≢",
	    nesear: "⤨",
	    nesim: "≂̸",
	    NestedGreaterGreater: "≫",
	    NestedLessLess: "≪",
	    NewLine: "\u000a",
	    nexist: "∄",
	    nexists: "∄",
	    Nfr: "𝔑",
	    nfr: "𝔫",
	    ngE: "≧̸",
	    nge: "≱",
	    ngeq: "≱",
	    ngeqq: "≧̸",
	    ngeqslant: "⩾̸",
	    nges: "⩾̸",
	    nGg: "⋙̸",
	    ngsim: "≵",
	    nGt: "≫⃒",
	    ngt: "≯",
	    ngtr: "≯",
	    nGtv: "≫̸",
	    nharr: "↮",
	    nhArr: "⇎",
	    nhpar: "⫲",
	    ni: "∋",
	    nis: "⋼",
	    nisd: "⋺",
	    niv: "∋",
	    NJcy: "Њ",
	    njcy: "њ",
	    nlarr: "↚",
	    nlArr: "⇍",
	    nldr: "‥",
	    nlE: "≦̸",
	    nle: "≰",
	    nleftarrow: "↚",
	    nLeftarrow: "⇍",
	    nleftrightarrow: "↮",
	    nLeftrightarrow: "⇎",
	    nleq: "≰",
	    nleqq: "≦̸",
	    nleqslant: "⩽̸",
	    nles: "⩽̸",
	    nless: "≮",
	    nLl: "⋘̸",
	    nlsim: "≴",
	    nLt: "≪⃒",
	    nlt: "≮",
	    nltri: "⋪",
	    nltrie: "⋬",
	    nLtv: "≪̸",
	    nmid: "∤",
	    NoBreak: "\u2060",
	    NonBreakingSpace: " ",
	    nopf: "𝕟",
	    Nopf: "ℕ",
	    Not: "⫬",
	    not: "¬",
	    NotCongruent: "≢",
	    NotCupCap: "≭",
	    NotDoubleVerticalBar: "∦",
	    NotElement: "∉",
	    NotEqual: "≠",
	    NotEqualTilde: "≂̸",
	    NotExists: "∄",
	    NotGreater: "≯",
	    NotGreaterEqual: "≱",
	    NotGreaterFullEqual: "≧̸",
	    NotGreaterGreater: "≫̸",
	    NotGreaterLess: "≹",
	    NotGreaterSlantEqual: "⩾̸",
	    NotGreaterTilde: "≵",
	    NotHumpDownHump: "≎̸",
	    NotHumpEqual: "≏̸",
	    notin: "∉",
	    notindot: "⋵̸",
	    notinE: "⋹̸",
	    notinva: "∉",
	    notinvb: "⋷",
	    notinvc: "⋶",
	    NotLeftTriangleBar: "⧏̸",
	    NotLeftTriangle: "⋪",
	    NotLeftTriangleEqual: "⋬",
	    NotLess: "≮",
	    NotLessEqual: "≰",
	    NotLessGreater: "≸",
	    NotLessLess: "≪̸",
	    NotLessSlantEqual: "⩽̸",
	    NotLessTilde: "≴",
	    NotNestedGreaterGreater: "⪢̸",
	    NotNestedLessLess: "⪡̸",
	    notni: "∌",
	    notniva: "∌",
	    notnivb: "⋾",
	    notnivc: "⋽",
	    NotPrecedes: "⊀",
	    NotPrecedesEqual: "⪯̸",
	    NotPrecedesSlantEqual: "⋠",
	    NotReverseElement: "∌",
	    NotRightTriangleBar: "⧐̸",
	    NotRightTriangle: "⋫",
	    NotRightTriangleEqual: "⋭",
	    NotSquareSubset: "⊏̸",
	    NotSquareSubsetEqual: "⋢",
	    NotSquareSuperset: "⊐̸",
	    NotSquareSupersetEqual: "⋣",
	    NotSubset: "⊂⃒",
	    NotSubsetEqual: "⊈",
	    NotSucceeds: "⊁",
	    NotSucceedsEqual: "⪰̸",
	    NotSucceedsSlantEqual: "⋡",
	    NotSucceedsTilde: "≿̸",
	    NotSuperset: "⊃⃒",
	    NotSupersetEqual: "⊉",
	    NotTilde: "≁",
	    NotTildeEqual: "≄",
	    NotTildeFullEqual: "≇",
	    NotTildeTilde: "≉",
	    NotVerticalBar: "∤",
	    nparallel: "∦",
	    npar: "∦",
	    nparsl: "⫽⃥",
	    npart: "∂̸",
	    npolint: "⨔",
	    npr: "⊀",
	    nprcue: "⋠",
	    nprec: "⊀",
	    npreceq: "⪯̸",
	    npre: "⪯̸",
	    nrarrc: "⤳̸",
	    nrarr: "↛",
	    nrArr: "⇏",
	    nrarrw: "↝̸",
	    nrightarrow: "↛",
	    nRightarrow: "⇏",
	    nrtri: "⋫",
	    nrtrie: "⋭",
	    nsc: "⊁",
	    nsccue: "⋡",
	    nsce: "⪰̸",
	    Nscr: "𝒩",
	    nscr: "𝓃",
	    nshortmid: "∤",
	    nshortparallel: "∦",
	    nsim: "≁",
	    nsime: "≄",
	    nsimeq: "≄",
	    nsmid: "∤",
	    nspar: "∦",
	    nsqsube: "⋢",
	    nsqsupe: "⋣",
	    nsub: "⊄",
	    nsubE: "⫅̸",
	    nsube: "⊈",
	    nsubset: "⊂⃒",
	    nsubseteq: "⊈",
	    nsubseteqq: "⫅̸",
	    nsucc: "⊁",
	    nsucceq: "⪰̸",
	    nsup: "⊅",
	    nsupE: "⫆̸",
	    nsupe: "⊉",
	    nsupset: "⊃⃒",
	    nsupseteq: "⊉",
	    nsupseteqq: "⫆̸",
	    ntgl: "≹",
	    Ntilde: "Ñ",
	    ntilde: "ñ",
	    ntlg: "≸",
	    ntriangleleft: "⋪",
	    ntrianglelefteq: "⋬",
	    ntriangleright: "⋫",
	    ntrianglerighteq: "⋭",
	    Nu: "Ν",
	    nu: "ν",
	    num: "#",
	    numero: "№",
	    numsp: " ",
	    nvap: "≍⃒",
	    nvdash: "⊬",
	    nvDash: "⊭",
	    nVdash: "⊮",
	    nVDash: "⊯",
	    nvge: "≥⃒",
	    nvgt: ">⃒",
	    nvHarr: "⤄",
	    nvinfin: "⧞",
	    nvlArr: "⤂",
	    nvle: "≤⃒",
	    nvlt: "<⃒",
	    nvltrie: "⊴⃒",
	    nvrArr: "⤃",
	    nvrtrie: "⊵⃒",
	    nvsim: "∼⃒",
	    nwarhk: "⤣",
	    nwarr: "↖",
	    nwArr: "⇖",
	    nwarrow: "↖",
	    nwnear: "⤧",
	    Oacute: "Ó",
	    oacute: "ó",
	    oast: "⊛",
	    Ocirc: "Ô",
	    ocirc: "ô",
	    ocir: "⊚",
	    Ocy: "О",
	    ocy: "о",
	    odash: "⊝",
	    Odblac: "Ő",
	    odblac: "ő",
	    odiv: "⨸",
	    odot: "⊙",
	    odsold: "⦼",
	    OElig: "Œ",
	    oelig: "œ",
	    ofcir: "⦿",
	    Ofr: "𝔒",
	    ofr: "𝔬",
	    ogon: "˛",
	    Ograve: "Ò",
	    ograve: "ò",
	    ogt: "⧁",
	    ohbar: "⦵",
	    ohm: "Ω",
	    oint: "∮",
	    olarr: "↺",
	    olcir: "⦾",
	    olcross: "⦻",
	    oline: "‾",
	    olt: "⧀",
	    Omacr: "Ō",
	    omacr: "ō",
	    Omega: "Ω",
	    omega: "ω",
	    Omicron: "Ο",
	    omicron: "ο",
	    omid: "⦶",
	    ominus: "⊖",
	    Oopf: "𝕆",
	    oopf: "𝕠",
	    opar: "⦷",
	    OpenCurlyDoubleQuote: "“",
	    OpenCurlyQuote: "‘",
	    operp: "⦹",
	    oplus: "⊕",
	    orarr: "↻",
	    Or: "⩔",
	    or: "∨",
	    ord: "⩝",
	    order: "ℴ",
	    orderof: "ℴ",
	    ordf: "ª",
	    ordm: "º",
	    origof: "⊶",
	    oror: "⩖",
	    orslope: "⩗",
	    orv: "⩛",
	    oS: "Ⓢ",
	    Oscr: "𝒪",
	    oscr: "ℴ",
	    Oslash: "Ø",
	    oslash: "ø",
	    osol: "⊘",
	    Otilde: "Õ",
	    otilde: "õ",
	    otimesas: "⨶",
	    Otimes: "⨷",
	    otimes: "⊗",
	    Ouml: "Ö",
	    ouml: "ö",
	    ovbar: "⌽",
	    OverBar: "‾",
	    OverBrace: "⏞",
	    OverBracket: "⎴",
	    OverParenthesis: "⏜",
	    para: "¶",
	    parallel: "∥",
	    par: "∥",
	    parsim: "⫳",
	    parsl: "⫽",
	    part: "∂",
	    PartialD: "∂",
	    Pcy: "П",
	    pcy: "п",
	    percnt: "%",
	    period: ".",
	    permil: "‰",
	    perp: "⊥",
	    pertenk: "‱",
	    Pfr: "𝔓",
	    pfr: "𝔭",
	    Phi: "Φ",
	    phi: "φ",
	    phiv: "ϕ",
	    phmmat: "ℳ",
	    phone: "☎",
	    Pi: "Π",
	    pi: "π",
	    pitchfork: "⋔",
	    piv: "ϖ",
	    planck: "ℏ",
	    planckh: "ℎ",
	    plankv: "ℏ",
	    plusacir: "⨣",
	    plusb: "⊞",
	    pluscir: "⨢",
	    plus: "+",
	    plusdo: "∔",
	    plusdu: "⨥",
	    pluse: "⩲",
	    PlusMinus: "±",
	    plusmn: "±",
	    plussim: "⨦",
	    plustwo: "⨧",
	    pm: "±",
	    Poincareplane: "ℌ",
	    pointint: "⨕",
	    popf: "𝕡",
	    Popf: "ℙ",
	    pound: "£",
	    prap: "⪷",
	    Pr: "⪻",
	    pr: "≺",
	    prcue: "≼",
	    precapprox: "⪷",
	    prec: "≺",
	    preccurlyeq: "≼",
	    Precedes: "≺",
	    PrecedesEqual: "⪯",
	    PrecedesSlantEqual: "≼",
	    PrecedesTilde: "≾",
	    preceq: "⪯",
	    precnapprox: "⪹",
	    precneqq: "⪵",
	    precnsim: "⋨",
	    pre: "⪯",
	    prE: "⪳",
	    precsim: "≾",
	    prime: "′",
	    Prime: "″",
	    primes: "ℙ",
	    prnap: "⪹",
	    prnE: "⪵",
	    prnsim: "⋨",
	    prod: "∏",
	    Product: "∏",
	    profalar: "⌮",
	    profline: "⌒",
	    profsurf: "⌓",
	    prop: "∝",
	    Proportional: "∝",
	    Proportion: "∷",
	    propto: "∝",
	    prsim: "≾",
	    prurel: "⊰",
	    Pscr: "𝒫",
	    pscr: "𝓅",
	    Psi: "Ψ",
	    psi: "ψ",
	    puncsp: " ",
	    Qfr: "𝔔",
	    qfr: "𝔮",
	    qint: "⨌",
	    qopf: "𝕢",
	    Qopf: "ℚ",
	    qprime: "⁗",
	    Qscr: "𝒬",
	    qscr: "𝓆",
	    quaternions: "ℍ",
	    quatint: "⨖",
	    quest: "?",
	    questeq: "≟",
	    quot: "\"",
	    QUOT: "\"",
	    rAarr: "⇛",
	    race: "∽̱",
	    Racute: "Ŕ",
	    racute: "ŕ",
	    radic: "√",
	    raemptyv: "⦳",
	    rang: "⟩",
	    Rang: "⟫",
	    rangd: "⦒",
	    range: "⦥",
	    rangle: "⟩",
	    raquo: "»",
	    rarrap: "⥵",
	    rarrb: "⇥",
	    rarrbfs: "⤠",
	    rarrc: "⤳",
	    rarr: "→",
	    Rarr: "↠",
	    rArr: "⇒",
	    rarrfs: "⤞",
	    rarrhk: "↪",
	    rarrlp: "↬",
	    rarrpl: "⥅",
	    rarrsim: "⥴",
	    Rarrtl: "⤖",
	    rarrtl: "↣",
	    rarrw: "↝",
	    ratail: "⤚",
	    rAtail: "⤜",
	    ratio: "∶",
	    rationals: "ℚ",
	    rbarr: "⤍",
	    rBarr: "⤏",
	    RBarr: "⤐",
	    rbbrk: "❳",
	    rbrace: "}",
	    rbrack: "]",
	    rbrke: "⦌",
	    rbrksld: "⦎",
	    rbrkslu: "⦐",
	    Rcaron: "Ř",
	    rcaron: "ř",
	    Rcedil: "Ŗ",
	    rcedil: "ŗ",
	    rceil: "⌉",
	    rcub: "}",
	    Rcy: "Р",
	    rcy: "р",
	    rdca: "⤷",
	    rdldhar: "⥩",
	    rdquo: "”",
	    rdquor: "”",
	    rdsh: "↳",
	    real: "ℜ",
	    realine: "ℛ",
	    realpart: "ℜ",
	    reals: "ℝ",
	    Re: "ℜ",
	    rect: "▭",
	    reg: "®",
	    REG: "®",
	    ReverseElement: "∋",
	    ReverseEquilibrium: "⇋",
	    ReverseUpEquilibrium: "⥯",
	    rfisht: "⥽",
	    rfloor: "⌋",
	    rfr: "𝔯",
	    Rfr: "ℜ",
	    rHar: "⥤",
	    rhard: "⇁",
	    rharu: "⇀",
	    rharul: "⥬",
	    Rho: "Ρ",
	    rho: "ρ",
	    rhov: "ϱ",
	    RightAngleBracket: "⟩",
	    RightArrowBar: "⇥",
	    rightarrow: "→",
	    RightArrow: "→",
	    Rightarrow: "⇒",
	    RightArrowLeftArrow: "⇄",
	    rightarrowtail: "↣",
	    RightCeiling: "⌉",
	    RightDoubleBracket: "⟧",
	    RightDownTeeVector: "⥝",
	    RightDownVectorBar: "⥕",
	    RightDownVector: "⇂",
	    RightFloor: "⌋",
	    rightharpoondown: "⇁",
	    rightharpoonup: "⇀",
	    rightleftarrows: "⇄",
	    rightleftharpoons: "⇌",
	    rightrightarrows: "⇉",
	    rightsquigarrow: "↝",
	    RightTeeArrow: "↦",
	    RightTee: "⊢",
	    RightTeeVector: "⥛",
	    rightthreetimes: "⋌",
	    RightTriangleBar: "⧐",
	    RightTriangle: "⊳",
	    RightTriangleEqual: "⊵",
	    RightUpDownVector: "⥏",
	    RightUpTeeVector: "⥜",
	    RightUpVectorBar: "⥔",
	    RightUpVector: "↾",
	    RightVectorBar: "⥓",
	    RightVector: "⇀",
	    ring: "˚",
	    risingdotseq: "≓",
	    rlarr: "⇄",
	    rlhar: "⇌",
	    rlm: "\u200f",
	    rmoustache: "⎱",
	    rmoust: "⎱",
	    rnmid: "⫮",
	    roang: "⟭",
	    roarr: "⇾",
	    robrk: "⟧",
	    ropar: "⦆",
	    ropf: "𝕣",
	    Ropf: "ℝ",
	    roplus: "⨮",
	    rotimes: "⨵",
	    RoundImplies: "⥰",
	    rpar: ")",
	    rpargt: "⦔",
	    rppolint: "⨒",
	    rrarr: "⇉",
	    Rrightarrow: "⇛",
	    rsaquo: "›",
	    rscr: "𝓇",
	    Rscr: "ℛ",
	    rsh: "↱",
	    Rsh: "↱",
	    rsqb: "]",
	    rsquo: "’",
	    rsquor: "’",
	    rthree: "⋌",
	    rtimes: "⋊",
	    rtri: "▹",
	    rtrie: "⊵",
	    rtrif: "▸",
	    rtriltri: "⧎",
	    RuleDelayed: "⧴",
	    ruluhar: "⥨",
	    rx: "℞",
	    Sacute: "Ś",
	    sacute: "ś",
	    sbquo: "‚",
	    scap: "⪸",
	    Scaron: "Š",
	    scaron: "š",
	    Sc: "⪼",
	    sc: "≻",
	    sccue: "≽",
	    sce: "⪰",
	    scE: "⪴",
	    Scedil: "Ş",
	    scedil: "ş",
	    Scirc: "Ŝ",
	    scirc: "ŝ",
	    scnap: "⪺",
	    scnE: "⪶",
	    scnsim: "⋩",
	    scpolint: "⨓",
	    scsim: "≿",
	    Scy: "С",
	    scy: "с",
	    sdotb: "⊡",
	    sdot: "⋅",
	    sdote: "⩦",
	    searhk: "⤥",
	    searr: "↘",
	    seArr: "⇘",
	    searrow: "↘",
	    sect: "§",
	    semi: ";",
	    seswar: "⤩",
	    setminus: "∖",
	    setmn: "∖",
	    sext: "✶",
	    Sfr: "𝔖",
	    sfr: "𝔰",
	    sfrown: "⌢",
	    sharp: "♯",
	    SHCHcy: "Щ",
	    shchcy: "щ",
	    SHcy: "Ш",
	    shcy: "ш",
	    ShortDownArrow: "↓",
	    ShortLeftArrow: "←",
	    shortmid: "∣",
	    shortparallel: "∥",
	    ShortRightArrow: "→",
	    ShortUpArrow: "↑",
	    shy: "\u00ad",
	    Sigma: "Σ",
	    sigma: "σ",
	    sigmaf: "ς",
	    sigmav: "ς",
	    sim: "∼",
	    simdot: "⩪",
	    sime: "≃",
	    simeq: "≃",
	    simg: "⪞",
	    simgE: "⪠",
	    siml: "⪝",
	    simlE: "⪟",
	    simne: "≆",
	    simplus: "⨤",
	    simrarr: "⥲",
	    slarr: "←",
	    SmallCircle: "∘",
	    smallsetminus: "∖",
	    smashp: "⨳",
	    smeparsl: "⧤",
	    smid: "∣",
	    smile: "⌣",
	    smt: "⪪",
	    smte: "⪬",
	    smtes: "⪬︀",
	    SOFTcy: "Ь",
	    softcy: "ь",
	    solbar: "⌿",
	    solb: "⧄",
	    sol: "/",
	    Sopf: "𝕊",
	    sopf: "𝕤",
	    spades: "♠",
	    spadesuit: "♠",
	    spar: "∥",
	    sqcap: "⊓",
	    sqcaps: "⊓︀",
	    sqcup: "⊔",
	    sqcups: "⊔︀",
	    Sqrt: "√",
	    sqsub: "⊏",
	    sqsube: "⊑",
	    sqsubset: "⊏",
	    sqsubseteq: "⊑",
	    sqsup: "⊐",
	    sqsupe: "⊒",
	    sqsupset: "⊐",
	    sqsupseteq: "⊒",
	    square: "□",
	    Square: "□",
	    SquareIntersection: "⊓",
	    SquareSubset: "⊏",
	    SquareSubsetEqual: "⊑",
	    SquareSuperset: "⊐",
	    SquareSupersetEqual: "⊒",
	    SquareUnion: "⊔",
	    squarf: "▪",
	    squ: "□",
	    squf: "▪",
	    srarr: "→",
	    Sscr: "𝒮",
	    sscr: "𝓈",
	    ssetmn: "∖",
	    ssmile: "⌣",
	    sstarf: "⋆",
	    Star: "⋆",
	    star: "☆",
	    starf: "★",
	    straightepsilon: "ϵ",
	    straightphi: "ϕ",
	    strns: "¯",
	    sub: "⊂",
	    Sub: "⋐",
	    subdot: "⪽",
	    subE: "⫅",
	    sube: "⊆",
	    subedot: "⫃",
	    submult: "⫁",
	    subnE: "⫋",
	    subne: "⊊",
	    subplus: "⪿",
	    subrarr: "⥹",
	    subset: "⊂",
	    Subset: "⋐",
	    subseteq: "⊆",
	    subseteqq: "⫅",
	    SubsetEqual: "⊆",
	    subsetneq: "⊊",
	    subsetneqq: "⫋",
	    subsim: "⫇",
	    subsub: "⫕",
	    subsup: "⫓",
	    succapprox: "⪸",
	    succ: "≻",
	    succcurlyeq: "≽",
	    Succeeds: "≻",
	    SucceedsEqual: "⪰",
	    SucceedsSlantEqual: "≽",
	    SucceedsTilde: "≿",
	    succeq: "⪰",
	    succnapprox: "⪺",
	    succneqq: "⪶",
	    succnsim: "⋩",
	    succsim: "≿",
	    SuchThat: "∋",
	    sum: "∑",
	    Sum: "∑",
	    sung: "♪",
	    sup1: "¹",
	    sup2: "²",
	    sup3: "³",
	    sup: "⊃",
	    Sup: "⋑",
	    supdot: "⪾",
	    supdsub: "⫘",
	    supE: "⫆",
	    supe: "⊇",
	    supedot: "⫄",
	    Superset: "⊃",
	    SupersetEqual: "⊇",
	    suphsol: "⟉",
	    suphsub: "⫗",
	    suplarr: "⥻",
	    supmult: "⫂",
	    supnE: "⫌",
	    supne: "⊋",
	    supplus: "⫀",
	    supset: "⊃",
	    Supset: "⋑",
	    supseteq: "⊇",
	    supseteqq: "⫆",
	    supsetneq: "⊋",
	    supsetneqq: "⫌",
	    supsim: "⫈",
	    supsub: "⫔",
	    supsup: "⫖",
	    swarhk: "⤦",
	    swarr: "↙",
	    swArr: "⇙",
	    swarrow: "↙",
	    swnwar: "⤪",
	    szlig: "ß",
	    Tab: "\u0009",
	    target: "⌖",
	    Tau: "Τ",
	    tau: "τ",
	    tbrk: "⎴",
	    Tcaron: "Ť",
	    tcaron: "ť",
	    Tcedil: "Ţ",
	    tcedil: "ţ",
	    Tcy: "Т",
	    tcy: "т",
	    tdot: "⃛",
	    telrec: "⌕",
	    Tfr: "𝔗",
	    tfr: "𝔱",
	    there4: "∴",
	    therefore: "∴",
	    Therefore: "∴",
	    Theta: "Θ",
	    theta: "θ",
	    thetasym: "ϑ",
	    thetav: "ϑ",
	    thickapprox: "≈",
	    thicksim: "∼",
	    ThickSpace: "  ",
	    ThinSpace: " ",
	    thinsp: " ",
	    thkap: "≈",
	    thksim: "∼",
	    THORN: "Þ",
	    thorn: "þ",
	    tilde: "˜",
	    Tilde: "∼",
	    TildeEqual: "≃",
	    TildeFullEqual: "≅",
	    TildeTilde: "≈",
	    timesbar: "⨱",
	    timesb: "⊠",
	    times: "×",
	    timesd: "⨰",
	    tint: "∭",
	    toea: "⤨",
	    topbot: "⌶",
	    topcir: "⫱",
	    top: "⊤",
	    Topf: "𝕋",
	    topf: "𝕥",
	    topfork: "⫚",
	    tosa: "⤩",
	    tprime: "‴",
	    trade: "™",
	    TRADE: "™",
	    triangle: "▵",
	    triangledown: "▿",
	    triangleleft: "◃",
	    trianglelefteq: "⊴",
	    triangleq: "≜",
	    triangleright: "▹",
	    trianglerighteq: "⊵",
	    tridot: "◬",
	    trie: "≜",
	    triminus: "⨺",
	    TripleDot: "⃛",
	    triplus: "⨹",
	    trisb: "⧍",
	    tritime: "⨻",
	    trpezium: "⏢",
	    Tscr: "𝒯",
	    tscr: "𝓉",
	    TScy: "Ц",
	    tscy: "ц",
	    TSHcy: "Ћ",
	    tshcy: "ћ",
	    Tstrok: "Ŧ",
	    tstrok: "ŧ",
	    twixt: "≬",
	    twoheadleftarrow: "↞",
	    twoheadrightarrow: "↠",
	    Uacute: "Ú",
	    uacute: "ú",
	    uarr: "↑",
	    Uarr: "↟",
	    uArr: "⇑",
	    Uarrocir: "⥉",
	    Ubrcy: "Ў",
	    ubrcy: "ў",
	    Ubreve: "Ŭ",
	    ubreve: "ŭ",
	    Ucirc: "Û",
	    ucirc: "û",
	    Ucy: "У",
	    ucy: "у",
	    udarr: "⇅",
	    Udblac: "Ű",
	    udblac: "ű",
	    udhar: "⥮",
	    ufisht: "⥾",
	    Ufr: "𝔘",
	    ufr: "𝔲",
	    Ugrave: "Ù",
	    ugrave: "ù",
	    uHar: "⥣",
	    uharl: "↿",
	    uharr: "↾",
	    uhblk: "▀",
	    ulcorn: "⌜",
	    ulcorner: "⌜",
	    ulcrop: "⌏",
	    ultri: "◸",
	    Umacr: "Ū",
	    umacr: "ū",
	    uml: "¨",
	    UnderBar: "_",
	    UnderBrace: "⏟",
	    UnderBracket: "⎵",
	    UnderParenthesis: "⏝",
	    Union: "⋃",
	    UnionPlus: "⊎",
	    Uogon: "Ų",
	    uogon: "ų",
	    Uopf: "𝕌",
	    uopf: "𝕦",
	    UpArrowBar: "⤒",
	    uparrow: "↑",
	    UpArrow: "↑",
	    Uparrow: "⇑",
	    UpArrowDownArrow: "⇅",
	    updownarrow: "↕",
	    UpDownArrow: "↕",
	    Updownarrow: "⇕",
	    UpEquilibrium: "⥮",
	    upharpoonleft: "↿",
	    upharpoonright: "↾",
	    uplus: "⊎",
	    UpperLeftArrow: "↖",
	    UpperRightArrow: "↗",
	    upsi: "υ",
	    Upsi: "ϒ",
	    upsih: "ϒ",
	    Upsilon: "Υ",
	    upsilon: "υ",
	    UpTeeArrow: "↥",
	    UpTee: "⊥",
	    upuparrows: "⇈",
	    urcorn: "⌝",
	    urcorner: "⌝",
	    urcrop: "⌎",
	    Uring: "Ů",
	    uring: "ů",
	    urtri: "◹",
	    Uscr: "𝒰",
	    uscr: "𝓊",
	    utdot: "⋰",
	    Utilde: "Ũ",
	    utilde: "ũ",
	    utri: "▵",
	    utrif: "▴",
	    uuarr: "⇈",
	    Uuml: "Ü",
	    uuml: "ü",
	    uwangle: "⦧",
	    vangrt: "⦜",
	    varepsilon: "ϵ",
	    varkappa: "ϰ",
	    varnothing: "∅",
	    varphi: "ϕ",
	    varpi: "ϖ",
	    varpropto: "∝",
	    varr: "↕",
	    vArr: "⇕",
	    varrho: "ϱ",
	    varsigma: "ς",
	    varsubsetneq: "⊊︀",
	    varsubsetneqq: "⫋︀",
	    varsupsetneq: "⊋︀",
	    varsupsetneqq: "⫌︀",
	    vartheta: "ϑ",
	    vartriangleleft: "⊲",
	    vartriangleright: "⊳",
	    vBar: "⫨",
	    Vbar: "⫫",
	    vBarv: "⫩",
	    Vcy: "В",
	    vcy: "в",
	    vdash: "⊢",
	    vDash: "⊨",
	    Vdash: "⊩",
	    VDash: "⊫",
	    Vdashl: "⫦",
	    veebar: "⊻",
	    vee: "∨",
	    Vee: "⋁",
	    veeeq: "≚",
	    vellip: "⋮",
	    verbar: "|",
	    Verbar: "‖",
	    vert: "|",
	    Vert: "‖",
	    VerticalBar: "∣",
	    VerticalLine: "|",
	    VerticalSeparator: "❘",
	    VerticalTilde: "≀",
	    VeryThinSpace: " ",
	    Vfr: "𝔙",
	    vfr: "𝔳",
	    vltri: "⊲",
	    vnsub: "⊂⃒",
	    vnsup: "⊃⃒",
	    Vopf: "𝕍",
	    vopf: "𝕧",
	    vprop: "∝",
	    vrtri: "⊳",
	    Vscr: "𝒱",
	    vscr: "𝓋",
	    vsubnE: "⫋︀",
	    vsubne: "⊊︀",
	    vsupnE: "⫌︀",
	    vsupne: "⊋︀",
	    Vvdash: "⊪",
	    vzigzag: "⦚",
	    Wcirc: "Ŵ",
	    wcirc: "ŵ",
	    wedbar: "⩟",
	    wedge: "∧",
	    Wedge: "⋀",
	    wedgeq: "≙",
	    weierp: "℘",
	    Wfr: "𝔚",
	    wfr: "𝔴",
	    Wopf: "𝕎",
	    wopf: "𝕨",
	    wp: "℘",
	    wr: "≀",
	    wreath: "≀",
	    Wscr: "𝒲",
	    wscr: "𝓌",
	    xcap: "⋂",
	    xcirc: "◯",
	    xcup: "⋃",
	    xdtri: "▽",
	    Xfr: "𝔛",
	    xfr: "𝔵",
	    xharr: "⟷",
	    xhArr: "⟺",
	    Xi: "Ξ",
	    xi: "ξ",
	    xlarr: "⟵",
	    xlArr: "⟸",
	    xmap: "⟼",
	    xnis: "⋻",
	    xodot: "⨀",
	    Xopf: "𝕏",
	    xopf: "𝕩",
	    xoplus: "⨁",
	    xotime: "⨂",
	    xrarr: "⟶",
	    xrArr: "⟹",
	    Xscr: "𝒳",
	    xscr: "𝓍",
	    xsqcup: "⨆",
	    xuplus: "⨄",
	    xutri: "△",
	    xvee: "⋁",
	    xwedge: "⋀",
	    Yacute: "Ý",
	    yacute: "ý",
	    YAcy: "Я",
	    yacy: "я",
	    Ycirc: "Ŷ",
	    ycirc: "ŷ",
	    Ycy: "Ы",
	    ycy: "ы",
	    yen: "¥",
	    Yfr: "𝔜",
	    yfr: "𝔶",
	    YIcy: "Ї",
	    yicy: "ї",
	    Yopf: "𝕐",
	    yopf: "𝕪",
	    Yscr: "𝒴",
	    yscr: "𝓎",
	    YUcy: "Ю",
	    yucy: "ю",
	    yuml: "ÿ",
	    Yuml: "Ÿ",
	    Zacute: "Ź",
	    zacute: "ź",
	    Zcaron: "Ž",
	    zcaron: "ž",
	    Zcy: "З",
	    zcy: "з",
	    Zdot: "Ż",
	    zdot: "ż",
	    zeetrf: "ℨ",
	    ZeroWidthSpace: "​",
	    Zeta: "Ζ",
	    zeta: "ζ",
	    zfr: "𝔷",
	    Zfr: "ℨ",
	    ZHcy: "Ж",
	    zhcy: "ж",
	    zigrarr: "⇝",
	    zopf: "𝕫",
	    Zopf: "ℤ",
	    Zscr: "𝒵",
	    zscr: "𝓏",
	    zwj: "\u200d",
	    zwnj: "\u200c"
	};
	var HEXCHARCODE = /^#[xX]([A-Fa-f0-9]+)$/;
	var CHARCODE = /^#([0-9]+)$/;
	var NAMED = /^([A-Za-z0-9]+)$/;
	var EntityParser = /** @class */ function() {
	    function EntityParser(named) {
	        this.named = named;
	    }
	    EntityParser.prototype.parse = function(entity) {
	        if (!entity) {
	            return;
	        }
	        var matches = entity.match(HEXCHARCODE);
	        if (matches) {
	            return String.fromCharCode(parseInt(matches[1], 16));
	        }
	        matches = entity.match(CHARCODE);
	        if (matches) {
	            return String.fromCharCode(parseInt(matches[1], 10));
	        }
	        matches = entity.match(NAMED);
	        if (matches) {
	            return this.named[matches[1]];
	        }
	    };
	    return EntityParser;
	}();
	var WSP = /[\t\n\f ]/;
	var ALPHA = /[A-Za-z]/;
	var CRLF = /\r\n?/g;
	function isSpace$1(char) {
	    return WSP.test(char);
	}
	function isAlpha(char) {
	    return ALPHA.test(char);
	}
	function preprocessInput(input) {
	    return input.replace(CRLF, '\n');
	}
	var EventedTokenizer = /** @class */ function() {
	    function EventedTokenizer(delegate, entityParser, mode) {
	        if (mode === void 0) {
	            mode = 'precompile';
	        }
	        this.delegate = delegate;
	        this.entityParser = entityParser;
	        this.mode = mode;
	        this.state = "beforeData" /* beforeData */ ;
	        this.line = -1;
	        this.column = -1;
	        this.input = '';
	        this.index = -1;
	        this.tagNameBuffer = '';
	        this.states = {
	            beforeData: function() {
	                var char = this.peek();
	                if (char === '<' && !this.isIgnoredEndTag()) {
	                    this.transitionTo("tagOpen" /* tagOpen */ );
	                    this.markTagStart();
	                    this.consume();
	                } else {
	                    if (this.mode === 'precompile' && char === '\n') {
	                        var tag = this.tagNameBuffer.toLowerCase();
	                        if (tag === 'pre' || tag === 'textarea') {
	                            this.consume();
	                        }
	                    }
	                    this.transitionTo("data" /* data */ );
	                    this.delegate.beginData();
	                }
	            },
	            data: function() {
	                var char = this.peek();
	                var tag = this.tagNameBuffer;
	                if (char === '<' && !this.isIgnoredEndTag()) {
	                    this.delegate.finishData();
	                    this.transitionTo("tagOpen" /* tagOpen */ );
	                    this.markTagStart();
	                    this.consume();
	                } else if (char === '&' && tag !== 'script' && tag !== 'style') {
	                    this.consume();
	                    this.delegate.appendToData(this.consumeCharRef() || '&');
	                } else {
	                    this.consume();
	                    this.delegate.appendToData(char);
	                }
	            },
	            tagOpen: function() {
	                var char = this.consume();
	                if (char === '!') {
	                    this.transitionTo("markupDeclarationOpen" /* markupDeclarationOpen */ );
	                } else if (char === '/') {
	                    this.transitionTo("endTagOpen" /* endTagOpen */ );
	                } else if (char === '@' || char === ':' || isAlpha(char)) {
	                    this.transitionTo("tagName" /* tagName */ );
	                    this.tagNameBuffer = '';
	                    this.delegate.beginStartTag();
	                    this.appendToTagName(char);
	                }
	            },
	            markupDeclarationOpen: function() {
	                var char = this.consume();
	                if (char === '-' && this.peek() === '-') {
	                    this.consume();
	                    this.transitionTo("commentStart" /* commentStart */ );
	                    this.delegate.beginComment();
	                } else {
	                    var maybeDoctype = char.toUpperCase() + this.input.substring(this.index, this.index + 6).toUpperCase();
	                    if (maybeDoctype === 'DOCTYPE') {
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.transitionTo("doctype" /* doctype */ );
	                        if (this.delegate.beginDoctype) this.delegate.beginDoctype();
	                    }
	                }
	            },
	            doctype: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    this.transitionTo("beforeDoctypeName" /* beforeDoctypeName */ );
	                }
	            },
	            beforeDoctypeName: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    return;
	                } else {
	                    this.transitionTo("doctypeName" /* doctypeName */ );
	                    if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
	                }
	            },
	            doctypeName: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    this.transitionTo("afterDoctypeName" /* afterDoctypeName */ );
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
	                }
	            },
	            afterDoctypeName: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    return;
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    var nextSixChars = char.toUpperCase() + this.input.substring(this.index, this.index + 5).toUpperCase();
	                    var isPublic = nextSixChars.toUpperCase() === 'PUBLIC';
	                    var isSystem = nextSixChars.toUpperCase() === 'SYSTEM';
	                    if (isPublic || isSystem) {
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                        this.consume();
	                    }
	                    if (isPublic) {
	                        this.transitionTo("afterDoctypePublicKeyword" /* afterDoctypePublicKeyword */ );
	                    } else if (isSystem) {
	                        this.transitionTo("afterDoctypeSystemKeyword" /* afterDoctypeSystemKeyword */ );
	                    }
	                }
	            },
	            afterDoctypePublicKeyword: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.transitionTo("beforeDoctypePublicIdentifier" /* beforeDoctypePublicIdentifier */ );
	                    this.consume();
	                } else if (char === '"') {
	                    this.transitionTo("doctypePublicIdentifierDoubleQuoted" /* doctypePublicIdentifierDoubleQuoted */ );
	                    this.consume();
	                } else if (char === "'") {
	                    this.transitionTo("doctypePublicIdentifierSingleQuoted" /* doctypePublicIdentifierSingleQuoted */ );
	                    this.consume();
	                } else if (char === '>') {
	                    this.consume();
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                }
	            },
	            doctypePublicIdentifierDoubleQuoted: function() {
	                var char = this.consume();
	                if (char === '"') {
	                    this.transitionTo("afterDoctypePublicIdentifier" /* afterDoctypePublicIdentifier */ );
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
	                }
	            },
	            doctypePublicIdentifierSingleQuoted: function() {
	                var char = this.consume();
	                if (char === "'") {
	                    this.transitionTo("afterDoctypePublicIdentifier" /* afterDoctypePublicIdentifier */ );
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
	                }
	            },
	            afterDoctypePublicIdentifier: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    this.transitionTo("betweenDoctypePublicAndSystemIdentifiers" /* betweenDoctypePublicAndSystemIdentifiers */ );
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else if (char === '"') {
	                    this.transitionTo("doctypeSystemIdentifierDoubleQuoted" /* doctypeSystemIdentifierDoubleQuoted */ );
	                } else if (char === "'") {
	                    this.transitionTo("doctypeSystemIdentifierSingleQuoted" /* doctypeSystemIdentifierSingleQuoted */ );
	                }
	            },
	            betweenDoctypePublicAndSystemIdentifiers: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    return;
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else if (char === '"') {
	                    this.transitionTo("doctypeSystemIdentifierDoubleQuoted" /* doctypeSystemIdentifierDoubleQuoted */ );
	                } else if (char === "'") {
	                    this.transitionTo("doctypeSystemIdentifierSingleQuoted" /* doctypeSystemIdentifierSingleQuoted */ );
	                }
	            },
	            doctypeSystemIdentifierDoubleQuoted: function() {
	                var char = this.consume();
	                if (char === '"') {
	                    this.transitionTo("afterDoctypeSystemIdentifier" /* afterDoctypeSystemIdentifier */ );
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
	                }
	            },
	            doctypeSystemIdentifierSingleQuoted: function() {
	                var char = this.consume();
	                if (char === "'") {
	                    this.transitionTo("afterDoctypeSystemIdentifier" /* afterDoctypeSystemIdentifier */ );
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
	                }
	            },
	            afterDoctypeSystemIdentifier: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    return;
	                } else if (char === '>') {
	                    if (this.delegate.endDoctype) this.delegate.endDoctype();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                }
	            },
	            commentStart: function() {
	                var char = this.consume();
	                if (char === '-') {
	                    this.transitionTo("commentStartDash" /* commentStartDash */ );
	                } else if (char === '>') {
	                    this.delegate.finishComment();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.delegate.appendToCommentData(char);
	                    this.transitionTo("comment" /* comment */ );
	                }
	            },
	            commentStartDash: function() {
	                var char = this.consume();
	                if (char === '-') {
	                    this.transitionTo("commentEnd" /* commentEnd */ );
	                } else if (char === '>') {
	                    this.delegate.finishComment();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.delegate.appendToCommentData('-');
	                    this.transitionTo("comment" /* comment */ );
	                }
	            },
	            comment: function() {
	                var char = this.consume();
	                if (char === '-') {
	                    this.transitionTo("commentEndDash" /* commentEndDash */ );
	                } else {
	                    this.delegate.appendToCommentData(char);
	                }
	            },
	            commentEndDash: function() {
	                var char = this.consume();
	                if (char === '-') {
	                    this.transitionTo("commentEnd" /* commentEnd */ );
	                } else {
	                    this.delegate.appendToCommentData('-' + char);
	                    this.transitionTo("comment" /* comment */ );
	                }
	            },
	            commentEnd: function() {
	                var char = this.consume();
	                if (char === '>') {
	                    this.delegate.finishComment();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.delegate.appendToCommentData('--' + char);
	                    this.transitionTo("comment" /* comment */ );
	                }
	            },
	            tagName: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    this.transitionTo("beforeAttributeName" /* beforeAttributeName */ );
	                } else if (char === '/') {
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                } else if (char === '>') {
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.appendToTagName(char);
	                }
	            },
	            endTagName: function() {
	                var char = this.consume();
	                if (isSpace$1(char)) {
	                    this.transitionTo("beforeAttributeName" /* beforeAttributeName */ );
	                    this.tagNameBuffer = '';
	                } else if (char === '/') {
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                    this.tagNameBuffer = '';
	                } else if (char === '>') {
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                    this.tagNameBuffer = '';
	                } else {
	                    this.appendToTagName(char);
	                }
	            },
	            beforeAttributeName: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.consume();
	                    return;
	                } else if (char === '/') {
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                    this.consume();
	                } else if (char === '>') {
	                    this.consume();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else if (char === '=') {
	                    this.delegate.reportSyntaxError('attribute name cannot start with equals sign');
	                    this.transitionTo("attributeName" /* attributeName */ );
	                    this.delegate.beginAttribute();
	                    this.consume();
	                    this.delegate.appendToAttributeName(char);
	                } else {
	                    this.transitionTo("attributeName" /* attributeName */ );
	                    this.delegate.beginAttribute();
	                }
	            },
	            attributeName: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.transitionTo("afterAttributeName" /* afterAttributeName */ );
	                    this.consume();
	                } else if (char === '/') {
	                    this.delegate.beginAttributeValue(false);
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                } else if (char === '=') {
	                    this.transitionTo("beforeAttributeValue" /* beforeAttributeValue */ );
	                    this.consume();
	                } else if (char === '>') {
	                    this.delegate.beginAttributeValue(false);
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else if (char === '"' || char === "'" || char === '<') {
	                    this.delegate.reportSyntaxError(char + ' is not a valid character within attribute names');
	                    this.consume();
	                    this.delegate.appendToAttributeName(char);
	                } else {
	                    this.consume();
	                    this.delegate.appendToAttributeName(char);
	                }
	            },
	            afterAttributeName: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.consume();
	                    return;
	                } else if (char === '/') {
	                    this.delegate.beginAttributeValue(false);
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                } else if (char === '=') {
	                    this.consume();
	                    this.transitionTo("beforeAttributeValue" /* beforeAttributeValue */ );
	                } else if (char === '>') {
	                    this.delegate.beginAttributeValue(false);
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.delegate.beginAttributeValue(false);
	                    this.delegate.finishAttributeValue();
	                    this.transitionTo("attributeName" /* attributeName */ );
	                    this.delegate.beginAttribute();
	                    this.consume();
	                    this.delegate.appendToAttributeName(char);
	                }
	            },
	            beforeAttributeValue: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.consume();
	                } else if (char === '"') {
	                    this.transitionTo("attributeValueDoubleQuoted" /* attributeValueDoubleQuoted */ );
	                    this.delegate.beginAttributeValue(true);
	                    this.consume();
	                } else if (char === "'") {
	                    this.transitionTo("attributeValueSingleQuoted" /* attributeValueSingleQuoted */ );
	                    this.delegate.beginAttributeValue(true);
	                    this.consume();
	                } else if (char === '>') {
	                    this.delegate.beginAttributeValue(false);
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.transitionTo("attributeValueUnquoted" /* attributeValueUnquoted */ );
	                    this.delegate.beginAttributeValue(false);
	                    this.consume();
	                    this.delegate.appendToAttributeValue(char);
	                }
	            },
	            attributeValueDoubleQuoted: function() {
	                var char = this.consume();
	                if (char === '"') {
	                    this.delegate.finishAttributeValue();
	                    this.transitionTo("afterAttributeValueQuoted" /* afterAttributeValueQuoted */ );
	                } else if (char === '&') {
	                    this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
	                } else {
	                    this.delegate.appendToAttributeValue(char);
	                }
	            },
	            attributeValueSingleQuoted: function() {
	                var char = this.consume();
	                if (char === "'") {
	                    this.delegate.finishAttributeValue();
	                    this.transitionTo("afterAttributeValueQuoted" /* afterAttributeValueQuoted */ );
	                } else if (char === '&') {
	                    this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
	                } else {
	                    this.delegate.appendToAttributeValue(char);
	                }
	            },
	            attributeValueUnquoted: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.transitionTo("beforeAttributeName" /* beforeAttributeName */ );
	                } else if (char === '/') {
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                } else if (char === '&') {
	                    this.consume();
	                    this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
	                } else if (char === '>') {
	                    this.delegate.finishAttributeValue();
	                    this.consume();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.consume();
	                    this.delegate.appendToAttributeValue(char);
	                }
	            },
	            afterAttributeValueQuoted: function() {
	                var char = this.peek();
	                if (isSpace$1(char)) {
	                    this.consume();
	                    this.transitionTo("beforeAttributeName" /* beforeAttributeName */ );
	                } else if (char === '/') {
	                    this.consume();
	                    this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */ );
	                } else if (char === '>') {
	                    this.consume();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.transitionTo("beforeAttributeName" /* beforeAttributeName */ );
	                }
	            },
	            selfClosingStartTag: function() {
	                var char = this.peek();
	                if (char === '>') {
	                    this.consume();
	                    this.delegate.markTagAsSelfClosing();
	                    this.delegate.finishTag();
	                    this.transitionTo("beforeData" /* beforeData */ );
	                } else {
	                    this.transitionTo("beforeAttributeName" /* beforeAttributeName */ );
	                }
	            },
	            endTagOpen: function() {
	                var char = this.consume();
	                if (char === '@' || char === ':' || isAlpha(char)) {
	                    this.transitionTo("endTagName" /* endTagName */ );
	                    this.tagNameBuffer = '';
	                    this.delegate.beginEndTag();
	                    this.appendToTagName(char);
	                }
	            }
	        };
	        this.reset();
	    }
	    EventedTokenizer.prototype.reset = function() {
	        this.transitionTo("beforeData" /* beforeData */ );
	        this.input = '';
	        this.tagNameBuffer = '';
	        this.index = 0;
	        this.line = 1;
	        this.column = 0;
	        this.delegate.reset();
	    };
	    EventedTokenizer.prototype.transitionTo = function(state) {
	        this.state = state;
	    };
	    EventedTokenizer.prototype.tokenize = function(input) {
	        this.reset();
	        this.tokenizePart(input);
	        this.tokenizeEOF();
	    };
	    EventedTokenizer.prototype.tokenizePart = function(input) {
	        this.input += preprocessInput(input);
	        while(this.index < this.input.length){
	            var handler = this.states[this.state];
	            if (handler !== undefined) {
	                handler.call(this);
	            } else {
	                throw new Error("unhandled state " + this.state);
	            }
	        }
	    };
	    EventedTokenizer.prototype.tokenizeEOF = function() {
	        this.flushData();
	    };
	    EventedTokenizer.prototype.flushData = function() {
	        if (this.state === 'data') {
	            this.delegate.finishData();
	            this.transitionTo("beforeData" /* beforeData */ );
	        }
	    };
	    EventedTokenizer.prototype.peek = function() {
	        return this.input.charAt(this.index);
	    };
	    EventedTokenizer.prototype.consume = function() {
	        var char = this.peek();
	        this.index++;
	        if (char === '\n') {
	            this.line++;
	            this.column = 0;
	        } else {
	            this.column++;
	        }
	        return char;
	    };
	    EventedTokenizer.prototype.consumeCharRef = function() {
	        var endIndex = this.input.indexOf(';', this.index);
	        if (endIndex === -1) {
	            return;
	        }
	        var entity = this.input.slice(this.index, endIndex);
	        var chars = this.entityParser.parse(entity);
	        if (chars) {
	            var count = entity.length;
	            // consume the entity chars
	            while(count){
	                this.consume();
	                count--;
	            }
	            // consume the `;`
	            this.consume();
	            return chars;
	        }
	    };
	    EventedTokenizer.prototype.markTagStart = function() {
	        this.delegate.tagOpen();
	    };
	    EventedTokenizer.prototype.appendToTagName = function(char) {
	        this.tagNameBuffer += char;
	        this.delegate.appendToTagName(char);
	    };
	    EventedTokenizer.prototype.isIgnoredEndTag = function() {
	        var tag = this.tagNameBuffer;
	        return tag === 'title' && this.input.substring(this.index, this.index + 8) !== '</title>' || tag === 'style' && this.input.substring(this.index, this.index + 8) !== '</style>' || tag === 'script' && this.input.substring(this.index, this.index + 9) !== '</script>';
	    };
	    return EventedTokenizer;
	}();

	const UNKNOWN_POSITION = Object.freeze({
	    line: 1,
	    column: 0
	});
	const SYNTHETIC_LOCATION = Object.freeze({
	    source: '(synthetic)',
	    start: UNKNOWN_POSITION,
	    end: UNKNOWN_POSITION
	});
	const NON_EXISTENT_LOCATION = Object.freeze({
	    source: '(nonexistent)',
	    start: UNKNOWN_POSITION,
	    end: UNKNOWN_POSITION
	});
	const BROKEN_LOCATION = Object.freeze({
	    source: '(broken)',
	    start: UNKNOWN_POSITION,
	    end: UNKNOWN_POSITION
	});

	/**
	 * We have already computed the character position of this offset or span.
	 */ const CHAR_OFFSET_KIND = 'CharPosition';
	const HBS_POSITION_KIND = 'HbsPosition';
	const INTERNAL_SYNTHETIC_KIND = 'InternalsSynthetic';
	const NON_EXISTENT_KIND = 'NonExistent';
	const BROKEN_KIND = 'Broken';
	function isInvisible(kind) {
	    return kind !== CHAR_OFFSET_KIND && kind !== HBS_POSITION_KIND;
	}

	/**
	 * This file implements the DSL used by span and offset in places where they need to exhaustively
	 * consider all combinations of states (Handlebars offsets, character offsets and invisible/broken
	 * offsets).
	 *
	 * It's probably overkill, but it makes the code that uses it clear. It could be refactored or
	 * removed.
	 */ const MatchAny = 'MATCH_ANY';
	const IsInvisible = 'IS_INVISIBLE';
	class WhenList {
	    constructor(whens){
	        this._whens = whens;
	    }
	    first(kind) {
	        for (const when of this._whens){
	            const value = when.match(kind);
	            if (isPresentArray(value)) {
	                return value[0];
	            }
	        }
	        return null;
	    }
	}
	class When {
	    get(pattern, or) {
	        let value = this._map.get(pattern);
	        if (value) {
	            return value;
	        }
	        value = or();
	        this._map.set(pattern, value);
	        return value;
	    }
	    add(pattern, out) {
	        this._map.set(pattern, out);
	    }
	    match(kind) {
	        const pattern = patternFor(kind);
	        const out = [];
	        const exact = this._map.get(pattern);
	        const fallback = this._map.get(MatchAny);
	        if (exact) {
	            out.push(exact);
	        }
	        if (fallback) {
	            out.push(fallback);
	        }
	        return out;
	    }
	    constructor(){
	        this._map = new Map();
	    }
	}
	function match(callback) {
	    return callback(new Matcher()).validate();
	}
	class Matcher {
	    /**
	   * You didn't exhaustively match all possibilities.
	   */ validate() {
	        return (left, right)=>this.matchFor(left.kind, right.kind)(left, right);
	    }
	    matchFor(left, right) {
	        const nesteds = this._whens.match(left);
	        const callback = new WhenList(nesteds).first(right);
	        return callback;
	    }
	    when(left, right, // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    callback) {
	        this._whens.get(left, ()=>new When()).add(right, callback);
	        return this;
	    }
	    constructor(){
	        this._whens = new When();
	    }
	}
	function patternFor(kind) {
	    switch(kind){
	        case BROKEN_KIND:
	        case INTERNAL_SYNTHETIC_KIND:
	        case NON_EXISTENT_KIND:
	            return IsInvisible;
	        default:
	            return kind;
	    }
	}

	class SourceSlice {
	    static synthetic(chars) {
	        let offsets = SourceSpan.synthetic(chars);
	        return new SourceSlice({
	            loc: offsets,
	            chars: chars
	        });
	    }
	    static load(source, slice) {
	        return new SourceSlice({
	            loc: SourceSpan.load(source, slice[1]),
	            chars: slice[0]
	        });
	    }
	    constructor(options){
	        this.loc = options.loc;
	        this.chars = options.chars;
	    }
	    getString() {
	        return this.chars;
	    }
	    serialize() {
	        return [
	            this.chars,
	            this.loc.serialize()
	        ];
	    }
	}

	/**
	 * A `SourceSpan` object represents a span of characters inside of a template source.
	 *
	 * There are three kinds of `SourceSpan` objects:
	 *
	 * - `ConcreteSourceSpan`, which contains byte offsets
	 * - `LazySourceSpan`, which contains `SourceLocation`s from the Handlebars AST, which can be
	 *   converted to byte offsets on demand.
	 * - `InvisibleSourceSpan`, which represent source strings that aren't present in the source,
	 *   because:
	 *     - they were created synthetically
	 *     - their location is nonsensical (the span is broken)
	 *     - they represent nothing in the source (this currently happens only when a bug in the
	 *       upstream Handlebars parser fails to assign a location to empty blocks)
	 *
	 * At a high level, all `SourceSpan` objects provide:
	 *
	 * - byte offsets
	 * - source in column and line format
	 *
	 * And you can do these operations on `SourceSpan`s:
	 *
	 * - collapse it to a `SourceSpan` representing its starting or ending position
	 * - slice out some characters, optionally skipping some characters at the beginning or end
	 * - create a new `SourceSpan` with a different starting or ending offset
	 *
	 * All SourceSpan objects implement `SourceLocation`, for compatibility. All SourceSpan
	 * objects have a `toJSON` that emits `SourceLocation`, also for compatibility.
	 *
	 * For compatibility, subclasses of `AbstractSourceSpan` must implement `locDidUpdate`, which
	 * happens when an AST plugin attempts to modify the `start` or `end` of a span directly.
	 *
	 * The goal is to avoid creating any problems for use-cases like AST Explorer.
	 */ class SourceSpan {
	    static get NON_EXISTENT() {
	        return new InvisibleSpan(NON_EXISTENT_KIND, NON_EXISTENT_LOCATION).wrap();
	    }
	    static load(source, serialized) {
	        if (typeof serialized === 'number') {
	            return SourceSpan.forCharPositions(source, serialized, serialized);
	        } else if (typeof serialized === 'string') {
	            return SourceSpan.synthetic(serialized);
	        } else if (Array.isArray(serialized)) {
	            return SourceSpan.forCharPositions(source, serialized[0], serialized[1]);
	        } else if (serialized === NON_EXISTENT_KIND) {
	            return SourceSpan.NON_EXISTENT;
	        } else if (serialized === BROKEN_KIND) {
	            return SourceSpan.broken(BROKEN_LOCATION);
	        }
	        assertNever(serialized);
	    }
	    static forHbsLoc(source, loc) {
	        const start = new HbsPosition(source, loc.start);
	        const end = new HbsPosition(source, loc.end);
	        return new HbsSpan(source, {
	            start,
	            end
	        }, loc).wrap();
	    }
	    static forCharPositions(source, startPos, endPos) {
	        const start = new CharPosition(source, startPos);
	        const end = new CharPosition(source, endPos);
	        return new CharPositionSpan(source, {
	            start,
	            end
	        }).wrap();
	    }
	    static synthetic(chars) {
	        return new InvisibleSpan(INTERNAL_SYNTHETIC_KIND, NON_EXISTENT_LOCATION, chars).wrap();
	    }
	    static broken(pos = BROKEN_LOCATION) {
	        return new InvisibleSpan(BROKEN_KIND, pos).wrap();
	    }
	    constructor(data){
	        this.data = data;
	        this.isInvisible = isInvisible(data.kind);
	    }
	    getStart() {
	        return this.data.getStart().wrap();
	    }
	    getEnd() {
	        return this.data.getEnd().wrap();
	    }
	    get loc() {
	        const span = this.data.toHbsSpan();
	        return span === null ? BROKEN_LOCATION : span.toHbsLoc();
	    }
	    get module() {
	        return this.data.getModule();
	    }
	    /**
	   * Get the starting `SourcePosition` for this `SourceSpan`, lazily computing it if needed.
	   */ get startPosition() {
	        return this.loc.start;
	    }
	    /**
	   * Get the ending `SourcePosition` for this `SourceSpan`, lazily computing it if needed.
	   */ get endPosition() {
	        return this.loc.end;
	    }
	    /**
	   * Support converting ASTv1 nodes into a serialized format using JSON.stringify.
	   */ toJSON() {
	        return this.loc;
	    }
	    /**
	   * Create a new span with the current span's end and a new beginning.
	   */ withStart(other) {
	        return span(other.data, this.data.getEnd());
	    }
	    /**
	   * Create a new span with the current span's beginning and a new ending.
	   */ withEnd(other) {
	        return span(this.data.getStart(), other.data);
	    }
	    asString() {
	        return this.data.asString();
	    }
	    /**
	   * Convert this `SourceSpan` into a `SourceSlice`.
	   */ toSlice(expected) {
	        const chars = this.data.asString();
	        assert(expected === undefined || expected === chars, `unexpectedly found ${JSON.stringify(chars)} when slicing source, ` + `but expected ${JSON.stringify(expected)}`);
	        return new SourceSlice({
	            loc: this,
	            chars: expected || chars
	        });
	    }
	    /**
	   * For compatibility with SourceLocation in AST plugins
	   *
	   * @deprecated use startPosition instead
	   */ get start() {
	        return this.loc.start;
	    }
	    /**
	   * For compatibility with SourceLocation in AST plugins
	   *
	   * @deprecated use withStart instead
	   */ set start(position) {
	        this.data.locDidUpdate({
	            start: position
	        });
	    }
	    /**
	   * For compatibility with SourceLocation in AST plugins
	   *
	   * @deprecated use endPosition instead
	   */ get end() {
	        return this.loc.end;
	    }
	    /**
	   * For compatibility with SourceLocation in AST plugins
	   *
	   * @deprecated use withEnd instead
	   */ set end(position) {
	        this.data.locDidUpdate({
	            end: position
	        });
	    }
	    /**
	   * For compatibility with SourceLocation in AST plugins
	   *
	   * @deprecated use module instead
	   */ get source() {
	        return this.module;
	    }
	    collapse(where) {
	        switch(where){
	            case 'start':
	                return this.getStart().collapsed();
	            case 'end':
	                return this.getEnd().collapsed();
	        }
	    }
	    extend(other) {
	        return span(this.data.getStart(), other.data.getEnd());
	    }
	    serialize() {
	        return this.data.serialize();
	    }
	    slice({ skipStart = 0, skipEnd = 0 }) {
	        return span(this.getStart().move(skipStart).data, this.getEnd().move(-skipEnd).data);
	    }
	    sliceStartChars({ skipStart = 0, chars }) {
	        return span(this.getStart().move(skipStart).data, this.getStart().move(skipStart + chars).data);
	    }
	    sliceEndChars({ skipEnd = 0, chars }) {
	        return span(this.getEnd().move(skipEnd - chars).data, this.getStart().move(-skipEnd).data);
	    }
	}
	class CharPositionSpan {
	    #locPosSpan;
	    constructor(source, charPositions){
	        this.source = source;
	        this.charPositions = charPositions;
	        this.kind = CHAR_OFFSET_KIND;
	        this.#locPosSpan = null;
	    }
	    wrap() {
	        return new SourceSpan(this);
	    }
	    asString() {
	        return this.source.slice(this.charPositions.start.charPos, this.charPositions.end.charPos);
	    }
	    getModule() {
	        return this.source.module;
	    }
	    getStart() {
	        return this.charPositions.start;
	    }
	    getEnd() {
	        return this.charPositions.end;
	    }
	    locDidUpdate() {
	    }
	    toHbsSpan() {
	        let locPosSpan = this.#locPosSpan;
	        if (locPosSpan === null) {
	            const start = this.charPositions.start.toHbsPos();
	            const end = this.charPositions.end.toHbsPos();
	            if (start === null || end === null) {
	                locPosSpan = this.#locPosSpan = BROKEN;
	            } else {
	                locPosSpan = this.#locPosSpan = new HbsSpan(this.source, {
	                    start,
	                    end
	                });
	            }
	        }
	        return locPosSpan === BROKEN ? null : locPosSpan;
	    }
	    serialize() {
	        const { start: { charPos: start }, end: { charPos: end } } = this.charPositions;
	        if (start === end) {
	            return start;
	        } else {
	            return [
	                start,
	                end
	            ];
	        }
	    }
	    toCharPosSpan() {
	        return this;
	    }
	}
	class HbsSpan {
	    #charPosSpan;
	    // the source location from Handlebars + AST Plugins -- could be wrong
	    #providedHbsLoc;
	    constructor(source, hbsPositions, providedHbsLoc = null){
	        this.source = source;
	        this.hbsPositions = hbsPositions;
	        this.kind = HBS_POSITION_KIND;
	        this.#charPosSpan = null;
	        this.#providedHbsLoc = providedHbsLoc;
	    }
	    serialize() {
	        const charPos = this.toCharPosSpan();
	        return charPos === null ? BROKEN_KIND : charPos.wrap().serialize();
	    }
	    wrap() {
	        return new SourceSpan(this);
	    }
	    updateProvided(pos, edge) {
	        if (this.#providedHbsLoc) {
	            this.#providedHbsLoc[edge] = pos;
	        }
	        // invalidate computed character offsets
	        this.#charPosSpan = null;
	        this.#providedHbsLoc = {
	            start: pos,
	            end: pos
	        };
	    }
	    locDidUpdate({ start, end }) {
	        if (start !== undefined) {
	            this.updateProvided(start, 'start');
	            this.hbsPositions.start = new HbsPosition(this.source, start, null);
	        }
	        if (end !== undefined) {
	            this.updateProvided(end, 'end');
	            this.hbsPositions.end = new HbsPosition(this.source, end, null);
	        }
	    }
	    asString() {
	        const span = this.toCharPosSpan();
	        return span === null ? '' : span.asString();
	    }
	    getModule() {
	        return this.source.module;
	    }
	    getStart() {
	        return this.hbsPositions.start;
	    }
	    getEnd() {
	        return this.hbsPositions.end;
	    }
	    toHbsLoc() {
	        return {
	            start: this.hbsPositions.start.hbsPos,
	            end: this.hbsPositions.end.hbsPos
	        };
	    }
	    toHbsSpan() {
	        return this;
	    }
	    toCharPosSpan() {
	        let charPosSpan = this.#charPosSpan;
	        if (charPosSpan === null) {
	            const start = this.hbsPositions.start.toCharPos();
	            const end = this.hbsPositions.end.toCharPos();
	            if (start && end) {
	                charPosSpan = this.#charPosSpan = new CharPositionSpan(this.source, {
	                    start,
	                    end
	                });
	            } else {
	                charPosSpan = this.#charPosSpan = BROKEN;
	                return null;
	            }
	        }
	        return charPosSpan === BROKEN ? null : charPosSpan;
	    }
	}
	class InvisibleSpan {
	    constructor(kind, // whatever was provided, possibly broken
	    loc, // if the span represents a synthetic string
	    string = null){
	        this.kind = kind;
	        this.loc = loc;
	        this.string = string;
	    }
	    serialize() {
	        switch(this.kind){
	            case BROKEN_KIND:
	            case NON_EXISTENT_KIND:
	                return this.kind;
	            case INTERNAL_SYNTHETIC_KIND:
	                return this.string || '';
	        }
	    }
	    wrap() {
	        return new SourceSpan(this);
	    }
	    asString() {
	        return this.string || '';
	    }
	    locDidUpdate({ start, end }) {
	        if (start !== undefined) {
	            this.loc.start = start;
	        }
	        if (end !== undefined) {
	            this.loc.end = end;
	        }
	    }
	    getModule() {
	        // TODO: Make this reflect the actual module this span originated from
	        return 'an unknown module';
	    }
	    getStart() {
	        return new InvisiblePosition(this.kind, this.loc.start);
	    }
	    getEnd() {
	        return new InvisiblePosition(this.kind, this.loc.end);
	    }
	    toCharPosSpan() {
	        return this;
	    }
	    toHbsSpan() {
	        return null;
	    }
	    toHbsLoc() {
	        return BROKEN_LOCATION;
	    }
	}
	const span = match((m)=>m.when(HBS_POSITION_KIND, HBS_POSITION_KIND, (left, right)=>new HbsSpan(left.source, {
	            start: left,
	            end: right
	        }).wrap()).when(CHAR_OFFSET_KIND, CHAR_OFFSET_KIND, (left, right)=>new CharPositionSpan(left.source, {
	            start: left,
	            end: right
	        }).wrap()).when(CHAR_OFFSET_KIND, HBS_POSITION_KIND, (left, right)=>{
	        const rightCharPos = right.toCharPos();
	        if (rightCharPos === null) {
	            return new InvisibleSpan(BROKEN_KIND, BROKEN_LOCATION).wrap();
	        } else {
	            return span(left, rightCharPos);
	        }
	    }).when(HBS_POSITION_KIND, CHAR_OFFSET_KIND, (left, right)=>{
	        const leftCharPos = left.toCharPos();
	        if (leftCharPos === null) {
	            return new InvisibleSpan(BROKEN_KIND, BROKEN_LOCATION).wrap();
	        } else {
	            return span(leftCharPos, right);
	        }
	    }).when(IsInvisible, MatchAny, (left)=>new InvisibleSpan(left.kind, BROKEN_LOCATION).wrap()).when(MatchAny, IsInvisible, (_, right)=>new InvisibleSpan(right.kind, BROKEN_LOCATION).wrap()));

	/**
	 * Used to indicate that an attempt to convert a `SourcePosition` to a character offset failed. It
	 * is separate from `null` so that `null` can be used to indicate that the computation wasn't yet
	 * attempted (and therefore to cache the failure)
	 */ const BROKEN = 'BROKEN';
	/**
	 * A `SourceOffset` represents a single position in the source.
	 *
	 * There are three kinds of backing data for `SourceOffset` objects:
	 *
	 * - `CharPosition`, which contains a character offset into the raw source string
	 * - `HbsPosition`, which contains a `SourcePosition` from the Handlebars AST, which can be
	 *   converted to a `CharPosition` on demand.
	 * - `InvisiblePosition`, which represents a position not in source (@see {InvisiblePosition})
	 */ class SourceOffset {
	    /**
	   * Create a `SourceOffset` from a Handlebars `SourcePosition`. It's stored as-is, and converted
	   * into a character offset on demand, which avoids unnecessarily computing the offset of every
	   * `SourceLocation`, but also means that broken `SourcePosition`s are not always detected.
	   */ static forHbsPos(source, pos) {
	        return new HbsPosition(source, pos, null).wrap();
	    }
	    /**
	   * Create a `SourceOffset` that corresponds to a broken `SourcePosition`. This means that the
	   * calling code determined (or knows) that the `SourceLocation` doesn't correspond correctly to
	   * any part of the source.
	   */ static broken(pos = UNKNOWN_POSITION) {
	        return new InvisiblePosition(BROKEN_KIND, pos).wrap();
	    }
	    constructor(data){
	        this.data = data;
	    }
	    /**
	   * Get the character offset for this `SourceOffset`, if possible.
	   */ get offset() {
	        const charPos = this.data.toCharPos();
	        return charPos === null ? null : charPos.offset;
	    }
	    /**
	   * Compare this offset with another one.
	   *
	   * If both offsets are `HbsPosition`s, they're equivalent as long as their lines and columns are
	   * the same. This avoids computing offsets unnecessarily.
	   *
	   * Otherwise, two `SourceOffset`s are equivalent if their successfully computed character offsets
	   * are the same.
	   */ eql(right) {
	        return eql(this.data, right.data);
	    }
	    /**
	   * Create a span that starts from this source offset and ends with another source offset. Avoid
	   * computing character offsets if both `SourceOffset`s are still lazy.
	   */ until(other) {
	        return span(this.data, other.data);
	    }
	    /**
	   * Create a `SourceOffset` by moving the character position represented by this source offset
	   * forward or backward (if `by` is negative), if possible.
	   *
	   * If this `SourceOffset` can't compute a valid character offset, `move` returns a broken offset.
	   *
	   * If the resulting character offset is less than 0 or greater than the size of the source, `move`
	   * returns a broken offset.
	   */ move(by) {
	        const charPos = this.data.toCharPos();
	        if (charPos === null) {
	            return SourceOffset.broken();
	        } else {
	            const result = charPos.offset + by;
	            if (charPos.source.validate(result)) {
	                return new CharPosition(charPos.source, result).wrap();
	            } else {
	                return SourceOffset.broken();
	            }
	        }
	    }
	    /**
	   * Create a new `SourceSpan` that represents a collapsed range at this source offset. Avoid
	   * computing the character offset if it has not already been computed.
	   */ collapsed() {
	        return span(this.data, this.data);
	    }
	    /**
	   * Convert this `SourceOffset` into a Handlebars {@see SourcePosition} for compatibility with
	   * existing plugins.
	   */ toJSON() {
	        return this.data.toJSON();
	    }
	}
	class CharPosition {
	    constructor(source, charPos){
	        this.source = source;
	        this.charPos = charPos;
	        this.kind = CHAR_OFFSET_KIND;
	        this./** Computed from char offset */ _locPos = null;
	    }
	    /**
	   * This is already a `CharPosition`.
	   *
	   * {@see HbsPosition} for the alternative.
	   */ toCharPos() {
	        return this;
	    }
	    /**
	   * Produce a Handlebars {@see SourcePosition} for this `CharPosition`. If this `CharPosition` was
	   * computed using {@see SourceOffset#move}, this will compute the `SourcePosition` for the offset.
	   */ toJSON() {
	        const hbs = this.toHbsPos();
	        return hbs === null ? UNKNOWN_POSITION : hbs.toJSON();
	    }
	    wrap() {
	        return new SourceOffset(this);
	    }
	    /**
	   * A `CharPosition` always has an offset it can produce without any additional computation.
	   */ get offset() {
	        return this.charPos;
	    }
	    /**
	   * Convert the current character offset to an `HbsPosition`, if it was not already computed. Once
	   * a `CharPosition` has computed its `HbsPosition`, it will not need to do compute it again, and
	   * the same `CharPosition` is retained when used as one of the ends of a `SourceSpan`, so
	   * computing the `HbsPosition` should be a one-time operation.
	   */ toHbsPos() {
	        let locPos = this._locPos;
	        if (locPos === null) {
	            const hbsPos = this.source.hbsPosFor(this.charPos);
	            if (hbsPos === null) {
	                this._locPos = locPos = BROKEN;
	            } else {
	                this._locPos = locPos = new HbsPosition(this.source, hbsPos, this.charPos);
	            }
	        }
	        return locPos === BROKEN ? null : locPos;
	    }
	}
	class HbsPosition {
	    constructor(source, hbsPos, charPos = null){
	        this.source = source;
	        this.hbsPos = hbsPos;
	        this.kind = HBS_POSITION_KIND;
	        this._charPos = charPos === null ? null : new CharPosition(source, charPos);
	    }
	    /**
	   * Lazily compute the character offset from the {@see SourcePosition}. Once an `HbsPosition` has
	   * computed its `CharPosition`, it will not need to do compute it again, and the same
	   * `HbsPosition` is retained when used as one of the ends of a `SourceSpan`, so computing the
	   * `CharPosition` should be a one-time operation.
	   */ toCharPos() {
	        let charPos = this._charPos;
	        if (charPos === null) {
	            const charPosNumber = this.source.charPosFor(this.hbsPos);
	            if (charPosNumber === null) {
	                this._charPos = charPos = BROKEN;
	            } else {
	                this._charPos = charPos = new CharPosition(this.source, charPosNumber);
	            }
	        }
	        return charPos === BROKEN ? null : charPos;
	    }
	    /**
	   * Return the {@see SourcePosition} that this `HbsPosition` was instantiated with. This operation
	   * does not need to compute anything.
	   */ toJSON() {
	        return this.hbsPos;
	    }
	    wrap() {
	        return new SourceOffset(this);
	    }
	    /**
	   * This is already an `HbsPosition`.
	   *
	   * {@see CharPosition} for the alternative.
	   */ toHbsPos() {
	        return this;
	    }
	}
	class InvisiblePosition {
	    constructor(kind, // whatever was provided, possibly broken
	    pos){
	        this.kind = kind;
	        this.pos = pos;
	    }
	    /**
	   * A broken position cannot be turned into a {@see CharacterPosition}.
	   */ toCharPos() {
	        return null;
	    }
	    /**
	   * The serialization of an `InvisiblePosition is whatever Handlebars {@see SourcePosition} was
	   * originally identified as broken, non-existent or synthetic.
	   *
	   * If an `InvisiblePosition` never had an source offset at all, this method returns
	   * {@see UNKNOWN_POSITION} for compatibility.
	   */ toJSON() {
	        return this.pos;
	    }
	    wrap() {
	        return new SourceOffset(this);
	    }
	    get offset() {
	        return null;
	    }
	}
	/**
	 * Compare two {@see AnyPosition} and determine whether they are equal.
	 *
	 * @see {SourceOffset#eql}
	 */ const eql = match((m)=>m.when(HBS_POSITION_KIND, HBS_POSITION_KIND, ({ hbsPos: left }, { hbsPos: right })=>left.column === right.column && left.line === right.line).when(CHAR_OFFSET_KIND, CHAR_OFFSET_KIND, ({ charPos: left }, { charPos: right })=>left === right).when(CHAR_OFFSET_KIND, HBS_POSITION_KIND, ({ offset: left }, right)=>left === right.toCharPos()?.offset).when(HBS_POSITION_KIND, CHAR_OFFSET_KIND, (left, { offset: right })=>left.toCharPos()?.offset === right).when(MatchAny, MatchAny, ()=>false));

	class Source {
	    static from(source, options = {}) {
	        return new Source(source, options.meta?.moduleName);
	    }
	    constructor(source, module = 'an unknown module'){
	        this.source = source;
	        this.module = module;
	    }
	    /**
	   * Validate that the character offset represents a position in the source string.
	   */ validate(offset) {
	        return offset >= 0 && offset <= this.source.length;
	    }
	    slice(start, end) {
	        return this.source.slice(start, end);
	    }
	    offsetFor(line, column) {
	        return SourceOffset.forHbsPos(this, {
	            line,
	            column
	        });
	    }
	    spanFor({ start, end }) {
	        return SourceSpan.forHbsLoc(this, {
	            start: {
	                line: start.line,
	                column: start.column
	            },
	            end: {
	                line: end.line,
	                column: end.column
	            }
	        });
	    }
	    hbsPosFor(offset) {
	        let seenLines = 0;
	        let seenChars = 0;
	        if (offset > this.source.length) {
	            return null;
	        }
	        while(true){
	            let nextLine = this.source.indexOf('\n', seenChars);
	            if (offset <= nextLine || nextLine === -1) {
	                return {
	                    line: seenLines + 1,
	                    column: offset - seenChars
	                };
	            } else {
	                seenLines += 1;
	                seenChars = nextLine + 1;
	            }
	        }
	    }
	    charPosFor(position) {
	        let { line, column } = position;
	        let sourceString = this.source;
	        let sourceLength = sourceString.length;
	        let seenLines = 0;
	        let seenChars = 0;
	        while(seenChars < sourceLength){
	            let nextLine = this.source.indexOf('\n', seenChars);
	            if (nextLine === -1) nextLine = this.source.length;
	            if (seenLines === line - 1) {
	                if (seenChars + column > nextLine) return nextLine;
	                return seenChars + column;
	            } else if (nextLine === -1) {
	                return 0;
	            } else {
	                seenLines += 1;
	                seenChars = nextLine + 1;
	            }
	        }
	        return sourceLength;
	    }
	}

	class SpanList {
	    static range(span, fallback = SourceSpan.NON_EXISTENT) {
	        return new SpanList(span.map(loc)).getRangeOffset(fallback);
	    }
	    constructor(span = []){
	        this._span = span;
	    }
	    add(offset) {
	        this._span.push(offset);
	    }
	    getRangeOffset(fallback) {
	        if (isPresentArray(this._span)) {
	            let first = getFirst(this._span);
	            let last = getLast(this._span);
	            return first.extend(last);
	        } else {
	            return fallback;
	        }
	    }
	}
	function loc(span) {
	    if (Array.isArray(span)) {
	        let first = getFirst(span);
	        let last = getLast(span);
	        return loc(first).extend(loc(last));
	    } else if (span instanceof SourceSpan) {
	        return span;
	    } else {
	        return span.loc;
	    }
	}
	function hasSpan(span) {
	    if (Array.isArray(span) && span.length === 0) {
	        return false;
	    }
	    return true;
	}
	function maybeLoc(location, fallback) {
	    if (hasSpan(location)) {
	        return loc(location);
	    } else {
	        return fallback;
	    }
	}

	var api$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  NON_EXISTENT_LOCATION: NON_EXISTENT_LOCATION,
	  SYNTHETIC_LOCATION: SYNTHETIC_LOCATION,
	  Source: Source,
	  SourceOffset: SourceOffset,
	  SourceSlice: SourceSlice,
	  SourceSpan: SourceSpan,
	  SpanList: SpanList,
	  UNKNOWN_POSITION: UNKNOWN_POSITION,
	  hasSpan: hasSpan,
	  loc: loc,
	  maybeLoc: maybeLoc
	});

	function generateSyntaxError(message, location) {
	    let { module, loc } = location;
	    let { line, column } = loc.start;
	    let code = location.asString();
	    let quotedCode = code ? `\n\n|\n|  ${code.split('\n').join('\n|  ')}\n|\n\n` : '';
	    let error = new Error(`${message}: ${quotedCode}(error occurred in '${module}' @ line ${line} : column ${column})`);
	    error.name = 'SyntaxError';
	    error.location = location;
	    error.code = code;
	    return error;
	}

	// ensure stays in sync with typing
	// ParentNode and ChildKey types are derived from VisitorKeysMap
	const visitorKeys = {
	    Template: [
	        'body'
	    ],
	    Block: [
	        'body'
	    ],
	    MustacheStatement: [
	        'path',
	        'params',
	        'hash'
	    ],
	    BlockStatement: [
	        'path',
	        'params',
	        'hash',
	        'program',
	        'inverse'
	    ],
	    ElementModifierStatement: [
	        'path',
	        'params',
	        'hash'
	    ],
	    CommentStatement: [],
	    MustacheCommentStatement: [],
	    ElementNode: [
	        'attributes',
	        'modifiers',
	        'children',
	        'comments'
	    ],
	    AttrNode: [
	        'value'
	    ],
	    TextNode: [],
	    ConcatStatement: [
	        'parts'
	    ],
	    SubExpression: [
	        'path',
	        'params',
	        'hash'
	    ],
	    PathExpression: [],
	    StringLiteral: [],
	    BooleanLiteral: [],
	    NumberLiteral: [],
	    NullLiteral: [],
	    UndefinedLiteral: [],
	    Hash: [
	        'pairs'
	    ],
	    HashPair: [
	        'value'
	    ]
	};

	const TraversalError = function() {
	    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	    TraversalError.prototype = Object.create(Error.prototype);
	    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	    TraversalError.prototype.constructor = TraversalError;
	    function TraversalError(message, node, parent, key) {
	        let error = Error.call(this, message);
	        this.key = key;
	        this.message = message;
	        this.node = node;
	        this.parent = parent;
	        if (error.stack) {
	            this.stack = error.stack;
	        }
	    }
	    return TraversalError;
	}();
	function cannotRemoveNode(node, parent, key) {
	    return new TraversalError('Cannot remove a node unless it is part of an array', node, parent, key);
	}
	function cannotReplaceNode(node, parent, key) {
	    return new TraversalError('Cannot replace a node with multiple nodes unless it is part of an array', node, parent, key);
	}
	function cannotReplaceOrRemoveInKeyHandlerYet(node, key) {
	    return new TraversalError('Replacing and removing in key handlers is not yet supported.', node, null, key);
	}

	class WalkerPath {
	    constructor(node, parent = null, parentKey = null){
	        this.node = node;
	        this.parent = parent;
	        this.parentKey = parentKey;
	    }
	    get parentNode() {
	        return this.parent ? this.parent.node : null;
	    }
	    parents() {
	        return {
	            [Symbol.iterator]: ()=>{
	                return new PathParentsIterator(this);
	            }
	        };
	    }
	}
	class PathParentsIterator {
	    constructor(path){
	        this.path = path;
	    }
	    next() {
	        if (this.path.parent) {
	            this.path = this.path.parent;
	            return {
	                done: false,
	                value: this.path
	            };
	        } else {
	            return {
	                done: true,
	                value: null
	            };
	        }
	    }
	}

	function getEnterFunction(handler) {
	    if (typeof handler === 'function') {
	        return handler;
	    } else {
	        return handler.enter;
	    }
	}
	function getExitFunction(handler) {
	    if (typeof handler === 'function') {
	        return undefined;
	    } else {
	        return handler.exit;
	    }
	}
	function getKeyHandler(handler, key) {
	    let keyVisitor = typeof handler !== 'function' ? handler.keys : undefined;
	    if (keyVisitor === undefined) return;
	    let keyHandler = keyVisitor[key];
	    if (keyHandler !== undefined) {
	        return keyHandler;
	    }
	    return keyVisitor.All;
	}
	function getNodeHandler(visitor, nodeType) {
	    // eslint-disable-next-line @typescript-eslint/no-deprecated
	    if (visitor.Program) {
	        if (nodeType === 'Template' && !visitor.Template || nodeType === 'Block' && !visitor.Block) {
	            // eslint-disable-next-line @typescript-eslint/no-deprecated
	            return visitor.Program;
	        }
	    }
	    let handler = visitor[nodeType];
	    if (handler !== undefined) {
	        return handler;
	    }
	    return visitor.All;
	}
	function visitNode(visitor, path) {
	    let { node, parent, parentKey } = path;
	    let handler = getNodeHandler(visitor, node.type);
	    let enter;
	    let exit;
	    if (handler !== undefined) {
	        enter = getEnterFunction(handler);
	        exit = getExitFunction(handler);
	    }
	    let result;
	    if (enter !== undefined) {
	        result = enter(node, path);
	    }
	    if (result !== undefined && result !== null) {
	        if (JSON.stringify(node) === JSON.stringify(result)) {
	            result = undefined;
	        } else if (Array.isArray(result)) {
	            visitArray(visitor, result, parent, parentKey);
	            return result;
	        } else {
	            let path = new WalkerPath(result, parent, parentKey);
	            return visitNode(visitor, path) || result;
	        }
	    }
	    if (result === undefined) {
	        let keys = visitorKeys[node.type];
	        for(let i = 0; i < keys.length; i++){
	            let key = keys[i];
	            // we know if it has child keys we can widen to a ParentNode
	            visitKey(visitor, handler, path, key);
	        }
	        if (exit !== undefined) {
	            result = exit(node, path);
	        }
	    }
	    return result;
	}
	function get(node, key) {
	    return node[key];
	}
	function set(node, key, value) {
	    node[key] = value;
	}
	function visitKey(visitor, handler, path, key) {
	    let { node } = path;
	    let value = get(node, key);
	    if (!value) {
	        return;
	    }
	    let keyEnter;
	    let keyExit;
	    if (handler !== undefined) {
	        let keyHandler = getKeyHandler(handler, key);
	        if (keyHandler !== undefined) {
	            keyEnter = getEnterFunction(keyHandler);
	            keyExit = getExitFunction(keyHandler);
	        }
	    }
	    if (keyEnter !== undefined) {
	        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- JS API
	        if (keyEnter(node, key) !== undefined) {
	            throw cannotReplaceOrRemoveInKeyHandlerYet(node, key);
	        }
	    }
	    if (Array.isArray(value)) {
	        visitArray(visitor, value, path, key);
	    } else {
	        let keyPath = new WalkerPath(value, path, key);
	        let result = visitNode(visitor, keyPath);
	        if (result !== undefined) {
	            // TODO: dynamically check the results by having a table of
	            // expected node types in value space, not just type space
	            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	            assignKey(node, key, value, result);
	        }
	    }
	    if (keyExit !== undefined) {
	        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- JS API
	        if (keyExit(node, key) !== undefined) {
	            throw cannotReplaceOrRemoveInKeyHandlerYet(node, key);
	        }
	    }
	}
	function visitArray(visitor, array, parent, parentKey) {
	    for(let i = 0; i < array.length; i++){
	        let node = unwrap(array[i]);
	        let path = new WalkerPath(node, parent, parentKey);
	        let result = visitNode(visitor, path);
	        if (result !== undefined) {
	            i += spliceArray(array, i, result) - 1;
	        }
	    }
	}
	function assignKey(node, key, value, result) {
	    if (result === null) {
	        throw cannotRemoveNode(value, node, key);
	    } else if (Array.isArray(result)) {
	        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	        if (result.length === 1) {
	            set(node, key, result[0]);
	        } else {
	            if (result.length === 0) {
	                throw cannotRemoveNode(value, node, key);
	            } else {
	                throw cannotReplaceNode(value, node, key);
	            }
	        }
	    } else {
	        set(node, key, result);
	    }
	}
	function spliceArray(array, index, result) {
	    if (result === null) {
	        array.splice(index, 1);
	        return 0;
	    } else if (Array.isArray(result)) {
	        array.splice(index, 1, ...result);
	        return result.length;
	    } else {
	        array.splice(index, 1, result);
	        return 1;
	    }
	}
	function traverse(node, visitor) {
	    let path = new WalkerPath(node);
	    visitNode(visitor, path);
	}

	class Walker {
	    constructor(order){
	        this.order = order;
	        this.stack = [];
	    }
	    visit(node, visitor) {
	        if (!node) {
	            return;
	        }
	        this.stack.push(node);
	        if (this.order === 'post') {
	            this.children(node, visitor);
	            visitor(node, this);
	        } else {
	            visitor(node, this);
	            this.children(node, visitor);
	        }
	        this.stack.pop();
	    }
	    children(node, callback) {
	        switch(node.type){
	            case 'Block':
	            case 'Template':
	                walkBody(this, node.body, callback);
	                return;
	            case 'ElementNode':
	                walkBody(this, node.children, callback);
	                return;
	            case 'BlockStatement':
	                this.visit(node.program, callback);
	                this.visit(node.inverse || null, callback);
	                return;
	            default:
	                return;
	        }
	    }
	}
	function walkBody(walker, body, callback) {
	    for (const child of body){
	        walker.visit(child, callback);
	    }
	}

	function childrenFor(node) {
	    switch(node.type){
	        case 'Block':
	        case 'Template':
	            return node.body;
	        case 'ElementNode':
	            return node.children;
	    }
	}
	function appendChild(parent, node) {
	    childrenFor(parent).push(node);
	}
	function isHBSLiteral(path) {
	    return path.type === 'StringLiteral' || path.type === 'BooleanLiteral' || path.type === 'NumberLiteral' || path.type === 'NullLiteral' || path.type === 'UndefinedLiteral';
	}
	function printLiteral(literal) {
	    if (literal.type === 'UndefinedLiteral') {
	        return 'undefined';
	    } else {
	        return JSON.stringify(literal.value);
	    }
	}
	function isUpperCase(tag) {
	    return tag[0] === tag[0]?.toUpperCase() && tag[0] !== tag[0]?.toLowerCase();
	}
	function isLowerCase(tag) {
	    return tag[0] === tag[0]?.toLowerCase() && tag[0] !== tag[0]?.toUpperCase();
	}

	let _SOURCE;
	function SOURCE() {
	    if (!_SOURCE) {
	        _SOURCE = new Source('', '(synthetic)');
	    }
	    return _SOURCE;
	}
	function buildMustache(path, params = [], hash = buildHash([]), trusting = false, loc, strip) {
	    return b.mustache({
	        path: buildPath(path),
	        params,
	        hash,
	        trusting,
	        strip,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildBlock(path, params, hash, _defaultBlock, _elseBlock = null, loc, openStrip, inverseStrip, closeStrip) {
	    let defaultBlock;
	    let elseBlock = null;
	    if (_defaultBlock.type === 'Template') {
	        defaultBlock = b.blockItself({
	            params: buildBlockParams(_defaultBlock.blockParams),
	            body: _defaultBlock.body,
	            loc: _defaultBlock.loc
	        });
	    } else {
	        defaultBlock = _defaultBlock;
	    }
	    if (_elseBlock?.type === 'Template') {
	        elseBlock = b.blockItself({
	            params: [],
	            body: _elseBlock.body,
	            loc: _elseBlock.loc
	        });
	    } else {
	        elseBlock = _elseBlock;
	    }
	    return b.block({
	        path: buildPath(path),
	        params: params || [],
	        hash: hash || buildHash([]),
	        defaultBlock,
	        elseBlock,
	        loc: buildLoc(loc || null),
	        openStrip,
	        inverseStrip,
	        closeStrip
	    });
	}
	function buildElementModifier(path, params, hash, loc) {
	    return b.elementModifier({
	        path: buildPath(path),
	        params: params || [],
	        hash: hash || buildHash([]),
	        loc: buildLoc(loc || null)
	    });
	}
	function buildComment(value, loc) {
	    return b.comment({
	        value: value,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildMustacheComment(value, loc) {
	    return b.mustacheComment({
	        value: value,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildConcat(parts, loc) {
	    if (!isPresentArray(parts)) {
	        throw new Error(`b.concat requires at least one part`);
	    }
	    return b.concat({
	        parts,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildElement(tag, options = {}) {
	    let { attrs, blockParams, modifiers, comments, children, openTag, closeTag: _closeTag, loc } = options;
	    // this is used for backwards compat, prior to `selfClosing` being part of the ElementNode AST
	    let path;
	    let selfClosing;
	    if (typeof tag === 'string') {
	        if (tag.endsWith('/')) {
	            path = buildPath(tag.slice(0, -1));
	            selfClosing = true;
	        } else {
	            path = buildPath(tag);
	        }
	    } else if ('type' in tag) {
	        path = tag;
	    } else if ('path' in tag) {
	        path = tag.path;
	        selfClosing = tag.selfClosing;
	    } else {
	        path = buildPath(tag.name);
	        selfClosing = tag.selfClosing;
	    }
	    let params = blockParams?.map((param)=>{
	        if (typeof param === 'string') {
	            return buildVar(param);
	        } else {
	            return param;
	        }
	    });
	    let closeTag = null;
	    if (_closeTag) {
	        closeTag = buildLoc(_closeTag);
	    } else if (_closeTag === undefined) {
	        closeTag = selfClosing || isVoidTag(path.original) ? null : buildLoc(null);
	    }
	    return b.element({
	        path,
	        selfClosing: selfClosing || false,
	        attributes: attrs || [],
	        params: params || [],
	        modifiers: modifiers || [],
	        comments: comments || [],
	        children: children || [],
	        openTag: buildLoc(openTag || null),
	        closeTag,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildAttr(name, value, loc) {
	    return b.attr({
	        name: name,
	        value: value,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildText(chars = '', loc) {
	    return b.text({
	        chars,
	        loc: buildLoc(loc || null)
	    });
	}
	// Expressions
	function buildSexpr(path, params = [], hash = buildHash([]), loc) {
	    return b.sexpr({
	        path: buildPath(path),
	        params,
	        hash,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildHead(original, loc) {
	    let [head, ...tail] = asPresentArray(original.split('.'));
	    let headNode = b.head({
	        original: head,
	        loc: buildLoc(loc || null)
	    });
	    return b.path({
	        head: headNode,
	        tail,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildThis(loc) {
	    return b.this({
	        loc: buildLoc(loc || null)
	    });
	}
	function buildAtName(name, loc) {
	    return b.atName({
	        name,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildVar(name, loc) {
	    return b.var({
	        name,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildHeadFromString(original, loc) {
	    return b.head({
	        original,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildCleanPath(head, tail = [], loc) {
	    return b.path({
	        head,
	        tail,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildPath(path, loc) {
	    let span = buildLoc(loc || null);
	    if (typeof path !== 'string') {
	        if ('type' in path) {
	            return path;
	        } else {
	            assert(path.head.indexOf('.') === -1);
	            let { head, tail } = path;
	            return b.path({
	                head: b.head({
	                    original: head,
	                    loc: span.sliceStartChars({
	                        chars: head.length
	                    })
	                }),
	                tail,
	                loc: buildLoc(loc || null)
	            });
	        }
	    }
	    let { head, tail } = buildHead(path, span);
	    return b.path({
	        head,
	        tail,
	        loc: span
	    });
	}
	function buildLiteral(type, value, loc) {
	    return b.literal({
	        type,
	        value,
	        loc: buildLoc(loc || null)
	    });
	}
	// Miscellaneous
	function buildHash(pairs = [], loc) {
	    return b.hash({
	        pairs,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildPair(key, value, loc) {
	    return b.pair({
	        key,
	        value,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildProgram(body, blockParams, loc) {
	    if (blockParams && blockParams.length) {
	        return buildBlockItself(body, blockParams, false, loc);
	    } else {
	        return buildTemplate(body, [], loc);
	    }
	}
	function buildBlockParams(params) {
	    return params.map((p)=>typeof p === 'string' ? b.var({
	            name: p,
	            loc: SourceSpan.synthetic(p)
	        }) : p);
	}
	function buildBlockItself(body = [], params = [], chained = false, loc) {
	    return b.blockItself({
	        body,
	        params: buildBlockParams(params),
	        chained,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildTemplate(body = [], blockParams = [], loc) {
	    return b.template({
	        body,
	        blockParams,
	        loc: buildLoc(loc || null)
	    });
	}
	function buildPosition(line, column) {
	    return b.pos({
	        line,
	        column
	    });
	}
	function buildLoc(...args) {
	    if (args.length === 1) {
	        let loc = args[0];
	        if (loc && typeof loc === 'object') {
	            return SourceSpan.forHbsLoc(SOURCE(), loc);
	        } else {
	            return SourceSpan.forHbsLoc(SOURCE(), SYNTHETIC_LOCATION);
	        }
	    } else {
	        let [startLine, startColumn, endLine, endColumn, _source] = args;
	        let source = _source ? new Source('', _source) : SOURCE();
	        return SourceSpan.forHbsLoc(source, {
	            start: {
	                line: startLine,
	                column: startColumn
	            },
	            end: {
	                line: endLine || startLine,
	                column: endColumn || startColumn
	            }
	        });
	    }
	}
	var publicBuilder = {
	    mustache: buildMustache,
	    block: buildBlock,
	    comment: buildComment,
	    mustacheComment: buildMustacheComment,
	    element: buildElement,
	    elementModifier: buildElementModifier,
	    attr: buildAttr,
	    text: buildText,
	    sexpr: buildSexpr,
	    concat: buildConcat,
	    hash: buildHash,
	    pair: buildPair,
	    literal: buildLiteral,
	    program: buildProgram,
	    blockItself: buildBlockItself,
	    template: buildTemplate,
	    loc: buildLoc,
	    pos: buildPosition,
	    path: buildPath,
	    fullPath: buildCleanPath,
	    head: buildHeadFromString,
	    at: buildAtName,
	    var: buildVar,
	    this: buildThis,
	    string: literal('StringLiteral'),
	    boolean: literal('BooleanLiteral'),
	    number: literal('NumberLiteral'),
	    undefined () {
	        return buildLiteral('UndefinedLiteral', undefined);
	    },
	    null () {
	        return buildLiteral('NullLiteral', null);
	    }
	};
	function literal(type) {
	    return function(value, loc) {
	        return buildLiteral(type, value, loc);
	    };
	}

	function buildLegacyMustache({ path, params, hash, trusting, strip, loc }) {
	    const node = {
	        type: 'MustacheStatement',
	        path,
	        params,
	        hash,
	        trusting,
	        strip,
	        loc
	    };
	    Object.defineProperty(node, 'escaped', {
	        enumerable: false,
	        get () {
	            return !this.trusting;
	        },
	        set (value1) {
	            this.trusting = !value1;
	        }
	    });
	    return node;
	}
	function buildLegacyPath({ head, tail, loc }) {
	    const node = {
	        type: 'PathExpression',
	        head,
	        tail,
	        get original () {
	            return [
	                this.head.original,
	                ...this.tail
	            ].join('.');
	        },
	        set original (value){
	            let [head, ...tail] = asPresentArray(value.split('.'));
	            this.head = publicBuilder.head(head, this.head.loc);
	            this.tail = tail;
	        },
	        loc
	    };
	    Object.defineProperty(node, 'parts', {
	        enumerable: false,
	        get () {
	            let parts = asPresentArray(this.original.split('.'));
	            if (parts[0] === 'this') {
	                // parts does not include `this`
	                parts.shift();
	            } else if (parts[0].startsWith('@')) {
	                // parts does not include leading `@`
	                parts[0] = parts[0].slice(1);
	            }
	            return Object.freeze(parts);
	        },
	        set (values) {
	            let parts = [
	                ...values
	            ];
	            // you are not supposed to already have `this` or `@` in the parts, but since this is
	            // deprecated anyway, we will infer what you meant and allow it
	            if (parts[0] !== 'this' && !parts[0]?.startsWith('@')) {
	                if (this.head.type === 'ThisHead') {
	                    parts.unshift('this');
	                } else if (this.head.type === 'AtHead') {
	                    parts[0] = `@${parts[0]}`;
	                }
	            }
	            this.original = parts.join('.');
	        }
	    });
	    Object.defineProperty(node, 'this', {
	        enumerable: false,
	        get () {
	            return this.head.type === 'ThisHead';
	        }
	    });
	    Object.defineProperty(node, 'data', {
	        enumerable: false,
	        get () {
	            return this.head.type === 'AtHead';
	        }
	    });
	    return node;
	}
	function buildLegacyLiteral({ type, value: value1, loc }) {
	    const node = {
	        type,
	        value: value1,
	        loc
	    };
	    Object.defineProperty(node, 'original', {
	        enumerable: false,
	        get () {
	            return this.value;
	        },
	        set (value1) {
	            this.value = value1;
	        }
	    });
	    return node;
	}

	const DEFAULT_STRIP = {
	    close: false,
	    open: false
	};
	/**
	 * The Parser Builder differentiates from the public builder API by:
	 *
	 * 1. Offering fewer different ways to instantiate nodes
	 * 2. Mandating source locations
	 */ class Builders {
	    pos({ line, column }) {
	        return {
	            line,
	            column
	        };
	    }
	    blockItself({ body, params: params1, chained = false, loc }) {
	        return {
	            type: 'Block',
	            body,
	            params: params1,
	            get blockParams () {
	                return this.params.map((p)=>p.name);
	            },
	            set blockParams (params){
	                this.params = params.map((name1)=>{
	                    return b.var({
	                        name: name1,
	                        loc: SourceSpan.synthetic(name1)
	                    });
	                });
	            },
	            chained,
	            loc
	        };
	    }
	    template({ body, blockParams, loc }) {
	        return {
	            type: 'Template',
	            body,
	            blockParams,
	            loc
	        };
	    }
	    mustache({ path, params: params1, hash, trusting, loc, strip = DEFAULT_STRIP }) {
	        return buildLegacyMustache({
	            path,
	            params: params1,
	            hash,
	            trusting,
	            strip,
	            loc
	        });
	    }
	    block({ path, params: params1, hash, defaultBlock, elseBlock = null, loc, openStrip = DEFAULT_STRIP, inverseStrip = DEFAULT_STRIP, closeStrip = DEFAULT_STRIP }) {
	        return {
	            type: 'BlockStatement',
	            path: path,
	            params: params1,
	            hash,
	            program: defaultBlock,
	            inverse: elseBlock,
	            loc,
	            openStrip,
	            inverseStrip,
	            closeStrip
	        };
	    }
	    comment({ value: value1, loc }) {
	        return {
	            type: 'CommentStatement',
	            value: value1,
	            loc
	        };
	    }
	    mustacheComment({ value: value1, loc }) {
	        return {
	            type: 'MustacheCommentStatement',
	            value: value1,
	            loc
	        };
	    }
	    concat({ parts, loc }) {
	        return {
	            type: 'ConcatStatement',
	            parts,
	            loc
	        };
	    }
	    element({ path, selfClosing: selfClosing1, attributes, modifiers, params: params1, comments, children, openTag, closeTag, loc }) {
	        let _selfClosing = selfClosing1;
	        return {
	            type: 'ElementNode',
	            path,
	            attributes,
	            modifiers,
	            params: params1,
	            comments,
	            children,
	            openTag,
	            closeTag,
	            loc,
	            get tag () {
	                return this.path.original;
	            },
	            set tag (name){
	                this.path.original = name;
	            },
	            get blockParams () {
	                return this.params.map((p)=>p.name);
	            },
	            set blockParams (params){
	                this.params = params.map((name1)=>{
	                    return b.var({
	                        name: name1,
	                        loc: SourceSpan.synthetic(name1)
	                    });
	                });
	            },
	            get selfClosing () {
	                return _selfClosing;
	            },
	            set selfClosing (selfClosing){
	                _selfClosing = selfClosing;
	                if (selfClosing) {
	                    this.closeTag = null;
	                } else {
	                    this.closeTag = SourceSpan.synthetic(`</${this.tag}>`);
	                }
	            }
	        };
	    }
	    elementModifier({ path, params: params1, hash, loc }) {
	        return {
	            type: 'ElementModifierStatement',
	            path,
	            params: params1,
	            hash,
	            loc
	        };
	    }
	    attr({ name: name1, value: value1, loc }) {
	        return {
	            type: 'AttrNode',
	            name: name1,
	            value: value1,
	            loc
	        };
	    }
	    text({ chars, loc }) {
	        return {
	            type: 'TextNode',
	            chars,
	            loc
	        };
	    }
	    sexpr({ path, params: params1, hash, loc }) {
	        return {
	            type: 'SubExpression',
	            path,
	            params: params1,
	            hash,
	            loc
	        };
	    }
	    path({ head, tail, loc }) {
	        return buildLegacyPath({
	            head,
	            tail,
	            loc
	        });
	    }
	    head({ original, loc }) {
	        if (original === 'this') {
	            return this.this({
	                loc
	            });
	        }
	        if (original[0] === '@') {
	            return this.atName({
	                name: original,
	                loc
	            });
	        } else {
	            return this.var({
	                name: original,
	                loc
	            });
	        }
	    }
	    this({ loc }) {
	        return {
	            type: 'ThisHead',
	            get original () {
	                return 'this';
	            },
	            loc
	        };
	    }
	    atName({ name: name1, loc }) {
	        let _name = '';
	        const node = {
	            type: 'AtHead',
	            get name () {
	                return _name;
	            },
	            set name (value){
	                assert(value.indexOf('.') === -1);
	                _name = value;
	            },
	            get original () {
	                return this.name;
	            },
	            set original (value){
	                this.name = value;
	            },
	            loc
	        };
	        // trigger the assertions
	        node.name = name1;
	        return node;
	    }
	    var({ name: name1, loc }) {
	        let _name = '';
	        const node = {
	            type: 'VarHead',
	            get name () {
	                return _name;
	            },
	            set name (value){
	                assert(value.indexOf('.') === -1);
	                _name = value;
	            },
	            get original () {
	                return this.name;
	            },
	            set original (value){
	                this.name = value;
	            },
	            loc
	        };
	        // trigger the assertions
	        node.name = name1;
	        return node;
	    }
	    hash({ pairs, loc }) {
	        return {
	            type: 'Hash',
	            pairs,
	            loc
	        };
	    }
	    pair({ key, value: value1, loc }) {
	        return {
	            type: 'HashPair',
	            key,
	            value: value1,
	            loc
	        };
	    }
	    literal({ type, value: value1, loc }) {
	        return buildLegacyLiteral({
	            type,
	            value: value1,
	            loc
	        });
	    }
	}
	const b = new Builders();

	class Parser {
	    constructor(source, entityParser = new EntityParser(namedCharRefs), mode = 'precompile'){
	        this.elementStack = [];
	        this.currentAttribute = null;
	        this.currentNode = null;
	        this.source = source;
	        this.lines = source.source.split(/\r\n?|\n/u);
	        this.tokenizer = new EventedTokenizer(this, entityParser, mode);
	    }
	    offset() {
	        let { line, column } = this.tokenizer;
	        return this.source.offsetFor(line, column);
	    }
	    pos({ line, column }) {
	        return this.source.offsetFor(line, column);
	    }
	    finish(node) {
	        return assign({}, node, {
	            loc: node.start.until(this.offset())
	        });
	    // node.loc = node.loc.withEnd(end);
	    }
	    get currentAttr() {
	        return expect(this.currentAttribute);
	    }
	    get currentTag() {
	        let node = this.currentNode;
	        return node;
	    }
	    get currentStartTag() {
	        let node = this.currentNode;
	        return node;
	    }
	    get currentEndTag() {
	        let node = this.currentNode;
	        return node;
	    }
	    get currentComment() {
	        let node = this.currentNode;
	        return node;
	    }
	    get currentData() {
	        let node = this.currentNode;
	        return node;
	    }
	    acceptNode(node) {
	        return this[node.type](node);
	    }
	    currentElement() {
	        return getLast(asPresentArray(this.elementStack));
	    }
	    sourceForNode(node, endNode) {
	        let firstLine = node.loc.start.line - 1;
	        let currentLine = firstLine - 1;
	        let firstColumn = node.loc.start.column;
	        let string = [];
	        let line;
	        let lastLine;
	        let lastColumn;
	        if (endNode) {
	            lastLine = endNode.loc.end.line - 1;
	            lastColumn = endNode.loc.end.column;
	        } else {
	            lastLine = node.loc.end.line - 1;
	            lastColumn = node.loc.end.column;
	        }
	        while(currentLine < lastLine){
	            currentLine++;
	            line = unwrap(this.lines[currentLine]);
	            if (currentLine === firstLine) {
	                if (firstLine === lastLine) {
	                    string.push(line.slice(firstColumn, lastColumn));
	                } else {
	                    string.push(line.slice(firstColumn));
	                }
	            } else if (currentLine === lastLine) {
	                string.push(line.slice(0, lastColumn));
	            } else {
	                string.push(line);
	            }
	        }
	        return string.join('\n');
	    }
	}

	const BEFORE_ATTRIBUTE_NAME = 'beforeAttributeName';
	const ATTRIBUTE_VALUE_UNQUOTED = 'attributeValueUnquoted';
	class HandlebarsNodeVisitors extends Parser {
	    parse(program, blockParams) {
	        let node = b.template({
	            body: [],
	            blockParams,
	            loc: this.source.spanFor(program.loc)
	        });
	        let template = this.parseProgram(node, program);
	        // TODO: we really need to verify that the tokenizer is in an acceptable
	        // state when we are "done" parsing. For example, right now, `<foo` parses
	        // into `Template { body: [] }` which is obviously incorrect
	        this.pendingError?.eof(template.loc.getEnd());
	        return template;
	    }
	    Program(program, blockParams) {
	        let node = b.blockItself({
	            body: [],
	            params: blockParams,
	            chained: program.chained,
	            loc: this.source.spanFor(program.loc)
	        });
	        return this.parseProgram(node, program);
	    }
	    parseProgram(node, program) {
	        if (program.body.length === 0) {
	            return node;
	        }
	        let poppedNode;
	        try {
	            this.elementStack.push(node);
	            for (let child of program.body){
	                this.acceptNode(child);
	            }
	        } finally{
	            poppedNode = this.elementStack.pop();
	        }
	        // Ensure that that the element stack is balanced properly.
	        if (node !== poppedNode) {
	            if (poppedNode?.type === 'ElementNode') {
	                throw generateSyntaxError(`Unclosed element \`${poppedNode.tag}\``, poppedNode.loc);
	            }
	        }
	        return node;
	    }
	    BlockStatement(block) {
	        if (this.tokenizer.state === 'comment') {
	            this.appendToCommentData(this.sourceForNode(block));
	            return;
	        }
	        if (this.tokenizer.state !== 'data' && this.tokenizer.state !== 'beforeData') {
	            throw generateSyntaxError('A block may only be used inside an HTML element or another block.', this.source.spanFor(block.loc));
	        }
	        const { path, params, hash } = acceptCallNodes(this, block);
	        const loc = this.source.spanFor(block.loc);
	        // Backfill block params loc for the default block
	        let blockParams = [];
	        let repairedBlock;
	        if (block.program.blockParams?.length) {
	            // Start from right after the hash
	            let span = hash.loc.collapse('end');
	            // Extend till the beginning of the block
	            if (block.program.loc) {
	                span = span.withEnd(this.source.spanFor(block.program.loc).getStart());
	            } else if (block.program.body[0]) {
	                span = span.withEnd(this.source.spanFor(block.program.body[0].loc).getStart());
	            } else {
	                // ...or if all else fail, use the end of the block statement
	                // this can only happen if the block statement is empty anyway
	                span = span.withEnd(loc.getEnd());
	            }
	            repairedBlock = repairBlock(this.source, block, span);
	            // Now we have a span for something like this:
	            //
	            //   {{#foo bar baz=bat as |wow wat|}}
	            //                     ~~~~~~~~~~~~~~~
	            //
	            // Or, if we are unlucky:
	            //
	            // {{#foo bar baz=bat as |wow wat|}}{{/foo}}
	            //                   ~~~~~~~~~~~~~~~~~~~~~~~
	            //
	            // Either way, within this span, there should be exactly two pipes
	            // fencing our block params, neatly whitespace separated and with
	            // legal identifiers only
	            const content = span.asString();
	            let skipStart = content.indexOf('|') + 1;
	            const limit = content.indexOf('|', skipStart);
	            for (const name of block.program.blockParams){
	                let nameStart;
	                let loc;
	                if (skipStart >= limit) {
	                    nameStart = -1;
	                } else {
	                    nameStart = content.indexOf(name, skipStart);
	                }
	                if (nameStart === -1 || nameStart + name.length > limit) {
	                    skipStart = limit;
	                    loc = this.source.spanFor(NON_EXISTENT_LOCATION);
	                } else {
	                    skipStart = nameStart;
	                    loc = span.sliceStartChars({
	                        skipStart,
	                        chars: name.length
	                    });
	                    skipStart += name.length;
	                }
	                blockParams.push(b.var({
	                    name,
	                    loc
	                }));
	            }
	        } else {
	            repairedBlock = repairBlock(this.source, block, loc);
	        }
	        const program = this.Program(repairedBlock.program, blockParams);
	        const inverse = repairedBlock.inverse ? this.Program(repairedBlock.inverse, []) : null;
	        const node = b.block({
	            path,
	            params,
	            hash,
	            defaultBlock: program,
	            elseBlock: inverse,
	            loc: this.source.spanFor(block.loc),
	            openStrip: block.openStrip,
	            inverseStrip: block.inverseStrip,
	            closeStrip: block.closeStrip
	        });
	        const parentProgram = this.currentElement();
	        appendChild(parentProgram, node);
	    }
	    MustacheStatement(rawMustache) {
	        this.pendingError?.mustache(this.source.spanFor(rawMustache.loc));
	        const { tokenizer } = this;
	        if (tokenizer.state === 'comment') {
	            this.appendToCommentData(this.sourceForNode(rawMustache));
	            return;
	        }
	        let mustache;
	        const { escaped, loc, strip } = rawMustache;
	        if ('original' in rawMustache.path && rawMustache.path.original === '...attributes') {
	            throw generateSyntaxError('Illegal use of ...attributes', this.source.spanFor(rawMustache.loc));
	        }
	        if (isHBSLiteral(rawMustache.path)) {
	            mustache = b.mustache({
	                path: this.acceptNode(rawMustache.path),
	                params: [],
	                hash: b.hash({
	                    pairs: [],
	                    loc: this.source.spanFor(rawMustache.path.loc).collapse('end')
	                }),
	                trusting: !escaped,
	                loc: this.source.spanFor(loc),
	                strip
	            });
	        } else {
	            const { path, params, hash } = acceptCallNodes(this, rawMustache);
	            mustache = b.mustache({
	                path,
	                params,
	                hash,
	                trusting: !escaped,
	                loc: this.source.spanFor(loc),
	                strip
	            });
	        }
	        switch(tokenizer.state){
	            // Tag helpers
	            case 'tagOpen':
	            case 'tagName':
	                throw generateSyntaxError(`Cannot use mustaches in an elements tagname`, mustache.loc);
	            case 'beforeAttributeName':
	                addElementModifier(this.currentStartTag, mustache);
	                break;
	            case 'attributeName':
	            case 'afterAttributeName':
	                this.beginAttributeValue(false);
	                this.finishAttributeValue();
	                addElementModifier(this.currentStartTag, mustache);
	                tokenizer.transitionTo(BEFORE_ATTRIBUTE_NAME);
	                break;
	            case 'afterAttributeValueQuoted':
	                addElementModifier(this.currentStartTag, mustache);
	                tokenizer.transitionTo(BEFORE_ATTRIBUTE_NAME);
	                break;
	            // Attribute values
	            case 'beforeAttributeValue':
	                this.beginAttributeValue(false);
	                this.appendDynamicAttributeValuePart(mustache);
	                tokenizer.transitionTo(ATTRIBUTE_VALUE_UNQUOTED);
	                break;
	            case 'attributeValueDoubleQuoted':
	            case 'attributeValueSingleQuoted':
	            case 'attributeValueUnquoted':
	                this.appendDynamicAttributeValuePart(mustache);
	                break;
	            // TODO: Only append child when the tokenizer state makes
	            // sense to do so, otherwise throw an error.
	            default:
	                appendChild(this.currentElement(), mustache);
	        }
	        return mustache;
	    }
	    appendDynamicAttributeValuePart(part) {
	        this.finalizeTextPart();
	        const attr = this.currentAttr;
	        attr.isDynamic = true;
	        attr.parts.push(part);
	    }
	    finalizeTextPart() {
	        const attr = this.currentAttr;
	        const text = attr.currentPart;
	        if (text !== null) {
	            this.currentAttr.parts.push(text);
	            this.startTextPart();
	        }
	    }
	    startTextPart() {
	        this.currentAttr.currentPart = null;
	    }
	    ContentStatement(content) {
	        updateTokenizerLocation(this.tokenizer, content);
	        this.tokenizer.tokenizePart(content.value);
	        this.tokenizer.flushData();
	    }
	    CommentStatement(rawComment) {
	        const { tokenizer } = this;
	        if (tokenizer.state === 'comment') {
	            this.appendToCommentData(this.sourceForNode(rawComment));
	            return null;
	        }
	        const { value, loc } = rawComment;
	        const comment = b.mustacheComment({
	            value,
	            loc: this.source.spanFor(loc)
	        });
	        switch(tokenizer.state){
	            case 'beforeAttributeName':
	            case 'afterAttributeName':
	                this.currentStartTag.comments.push(comment);
	                break;
	            case 'beforeData':
	            case 'data':
	                appendChild(this.currentElement(), comment);
	                break;
	            default:
	                throw generateSyntaxError(`Using a Handlebars comment when in the \`${tokenizer['state']}\` state is not supported`, this.source.spanFor(rawComment.loc));
	        }
	        return comment;
	    }
	    PartialStatement(partial) {
	        throw generateSyntaxError(`Handlebars partials are not supported`, this.source.spanFor(partial.loc));
	    }
	    PartialBlockStatement(partialBlock) {
	        throw generateSyntaxError(`Handlebars partial blocks are not supported`, this.source.spanFor(partialBlock.loc));
	    }
	    Decorator(decorator) {
	        throw generateSyntaxError(`Handlebars decorators are not supported`, this.source.spanFor(decorator.loc));
	    }
	    DecoratorBlock(decoratorBlock) {
	        throw generateSyntaxError(`Handlebars decorator blocks are not supported`, this.source.spanFor(decoratorBlock.loc));
	    }
	    SubExpression(sexpr) {
	        const { path, params, hash } = acceptCallNodes(this, sexpr);
	        return b.sexpr({
	            path,
	            params,
	            hash,
	            loc: this.source.spanFor(sexpr.loc)
	        });
	    }
	    PathExpression(path) {
	        const { original } = path;
	        let parts;
	        if (original.indexOf('/') !== -1) {
	            if (original.slice(0, 2) === './') {
	                throw generateSyntaxError(`Using "./" is not supported in Glimmer and unnecessary`, this.source.spanFor(path.loc));
	            }
	            if (original.slice(0, 3) === '../') {
	                throw generateSyntaxError(`Changing context using "../" is not supported in Glimmer`, this.source.spanFor(path.loc));
	            }
	            if (original.indexOf('.') !== -1) {
	                throw generateSyntaxError(`Mixing '.' and '/' in paths is not supported in Glimmer; use only '.' to separate property paths`, this.source.spanFor(path.loc));
	            }
	            parts = [
	                path.parts.join('/')
	            ];
	        } else if (original === '.') {
	            throw generateSyntaxError(`'.' is not a supported path in Glimmer; check for a path with a trailing '.'`, this.source.spanFor(path.loc));
	        } else {
	            parts = path.parts;
	        }
	        let thisHead = false;
	        // This is to fix a bug in the Handlebars AST where the path expressions in
	        // `{{this.foo}}` (and similarly `{{foo-bar this.foo named=this.foo}}` etc)
	        // are simply turned into `{{foo}}`. The fix is to push it back onto the
	        // parts array and let the runtime see the difference. However, we cannot
	        // simply use the string `this` as it means literally the property called
	        // "this" in the current context (it can be expressed in the syntax as
	        // `{{[this]}}`, where the square bracket are generally for this kind of
	        // escaping – such as `{{foo.["bar.baz"]}}` would mean lookup a property
	        // named literally "bar.baz" on `this.foo`). By convention, we use `null`
	        // for this purpose.
	        if (/^this(?:\..+)?$/u.test(original)) {
	            thisHead = true;
	        }
	        let pathHead;
	        if (thisHead) {
	            pathHead = b.this({
	                loc: this.source.spanFor({
	                    start: path.loc.start,
	                    end: {
	                        line: path.loc.start.line,
	                        column: path.loc.start.column + 4
	                    }
	                })
	            });
	        } else if (path.data) {
	            const head = parts.shift();
	            if (head === undefined) {
	                throw generateSyntaxError(`Attempted to parse a path expression, but it was not valid. Paths beginning with @ must start with a-z.`, this.source.spanFor(path.loc));
	            }
	            pathHead = b.atName({
	                name: `@${head}`,
	                loc: this.source.spanFor({
	                    start: path.loc.start,
	                    end: {
	                        line: path.loc.start.line,
	                        column: path.loc.start.column + head.length + 1
	                    }
	                })
	            });
	        } else {
	            const head = parts.shift();
	            if (head === undefined) {
	                throw generateSyntaxError(`Attempted to parse a path expression, but it was not valid. Paths must start with a-z or A-Z.`, this.source.spanFor(path.loc));
	            }
	            pathHead = b.var({
	                name: head,
	                loc: this.source.spanFor({
	                    start: path.loc.start,
	                    end: {
	                        line: path.loc.start.line,
	                        column: path.loc.start.column + head.length
	                    }
	                })
	            });
	        }
	        return b.path({
	            head: pathHead,
	            tail: parts,
	            loc: this.source.spanFor(path.loc)
	        });
	    }
	    Hash(hash) {
	        const pairs = hash.pairs.map((pair)=>b.pair({
	                key: pair.key,
	                value: this.acceptNode(pair.value),
	                loc: this.source.spanFor(pair.loc)
	            }));
	        return b.hash({
	            pairs,
	            loc: this.source.spanFor(hash.loc)
	        });
	    }
	    StringLiteral(string) {
	        return b.literal({
	            type: 'StringLiteral',
	            value: string.value,
	            loc: this.source.spanFor(string.loc)
	        });
	    }
	    BooleanLiteral(boolean) {
	        return b.literal({
	            type: 'BooleanLiteral',
	            value: boolean.value,
	            loc: this.source.spanFor(boolean.loc)
	        });
	    }
	    NumberLiteral(number) {
	        return b.literal({
	            type: 'NumberLiteral',
	            value: number.value,
	            loc: this.source.spanFor(number.loc)
	        });
	    }
	    UndefinedLiteral(undef) {
	        return b.literal({
	            type: 'UndefinedLiteral',
	            value: undefined,
	            loc: this.source.spanFor(undef.loc)
	        });
	    }
	    NullLiteral(nul) {
	        return b.literal({
	            type: 'NullLiteral',
	            value: null,
	            loc: this.source.spanFor(nul.loc)
	        });
	    }
	    constructor(...args){
	        super(...args), // Because we interleave the HTML and HBS parsing, sometimes the HTML
	        // tokenizer can run out of tokens when we switch into {{...}} or reached
	        // EOF. There are positions where neither of these are expected, and it would
	        // like to generate an error, but there is no span to attach the error to.
	        // This allows the HTML tokenization to stash an error message and the next
	        // mustache visitor will attach the message to the appropriate span and throw
	        // the error.
	        this.pendingError = null;
	    }
	}
	function calculateRightStrippedOffsets(original, value) {
	    if (value === '') {
	        // if it is empty, just return the count of newlines
	        // in original
	        return {
	            lines: original.split('\n').length - 1,
	            columns: 0
	        };
	    }
	    // otherwise, return the number of newlines prior to
	    // `value`
	    const [difference] = original.split(value);
	    const lines = difference.split(/\n/u);
	    const lineCount = lines.length - 1;
	    return {
	        lines: lineCount,
	        columns: unwrap(lines[lineCount]).length
	    };
	}
	function updateTokenizerLocation(tokenizer, content) {
	    let line = content.loc.start.line;
	    let column = content.loc.start.column;
	    const offsets = calculateRightStrippedOffsets(content.original, content.value);
	    line = line + offsets.lines;
	    if (offsets.lines) {
	        column = offsets.columns;
	    } else {
	        column = column + offsets.columns;
	    }
	    tokenizer.line = line;
	    tokenizer.column = column;
	}
	function acceptCallNodes(compiler, node) {
	    let path;
	    switch(node.path.type){
	        case 'PathExpression':
	            path = compiler.PathExpression(node.path);
	            break;
	        case 'SubExpression':
	            path = compiler.SubExpression(node.path);
	            break;
	        case 'StringLiteral':
	        case 'UndefinedLiteral':
	        case 'NullLiteral':
	        case 'NumberLiteral':
	        case 'BooleanLiteral':
	            {
	                let value;
	                if (node.path.type === 'BooleanLiteral') {
	                    value = node.path.original.toString();
	                } else if (node.path.type === 'StringLiteral') {
	                    value = `"${node.path.original}"`;
	                } else if (node.path.type === 'NullLiteral') {
	                    value = 'null';
	                } else if (node.path.type === 'NumberLiteral') {
	                    value = node.path.value.toString();
	                } else {
	                    value = 'undefined';
	                }
	                throw generateSyntaxError(`${node.path.type} "${node.path.type === 'StringLiteral' ? node.path.original : value}" cannot be called as a sub-expression, replace (${value}) with ${value}`, compiler.source.spanFor(node.path.loc));
	            }
	    }
	    const params = node.params.map((e)=>compiler.acceptNode(e));
	    // if there is no hash, position it as a collapsed node immediately after the last param (or the
	    // path, if there are also no params)
	    const end = isPresentArray(params) ? getLast(params).loc : path.loc;
	    const hash = node.hash ? compiler.Hash(node.hash) : b.hash({
	        pairs: [],
	        loc: compiler.source.spanFor(end).collapse('end')
	    });
	    return {
	        path,
	        params,
	        hash
	    };
	}
	function addElementModifier(element, mustache) {
	    const { path, params, hash, loc } = mustache;
	    if (isHBSLiteral(path)) {
	        const modifier = `{{${printLiteral(path)}}}`;
	        const tag = `<${element.name} ... ${modifier} ...`;
	        throw generateSyntaxError(`In ${tag}, ${modifier} is not a valid modifier`, mustache.loc);
	    }
	    const modifier = b.elementModifier({
	        path,
	        params,
	        hash,
	        loc
	    });
	    element.modifiers.push(modifier);
	}
	function repairBlock(source, block, fallbackStart) {
	    // Extend till the beginning of the block
	    if (!block.program.loc) {
	        const start = block.program.body.at(0);
	        const end = block.program.body.at(-1);
	        if (start && end) {
	            block.program.loc = {
	                ...start.loc,
	                end: end.loc.end
	            };
	        } else {
	            const loc = source.spanFor(block.loc);
	            block.program.loc = fallbackStart.withEnd(loc.getEnd());
	        }
	    }
	    let endProgram = source.spanFor(block.program.loc).getEnd();
	    if (block.inverse && !block.inverse.loc) {
	        block.inverse.loc = endProgram.collapsed();
	    }
	    return block;
	}

	// vendored from simple-html-tokenizer because it's unexported
	function isSpace(char) {
	    return /[\t\n\f ]/u.test(char);
	}
	class TokenizerEventHandlers extends HandlebarsNodeVisitors {
	    reset() {
	        this.currentNode = null;
	    }
	    // Comment
	    beginComment() {
	        this.currentNode = {
	            type: 'CommentStatement',
	            value: '',
	            start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
	        };
	    }
	    appendToCommentData(char) {
	        this.currentComment.value += char;
	    }
	    finishComment() {
	        appendChild(this.currentElement(), b.comment(this.finish(this.currentComment)));
	    }
	    // Data
	    beginData() {
	        this.currentNode = {
	            type: 'TextNode',
	            chars: '',
	            start: this.offset()
	        };
	    }
	    appendToData(char) {
	        this.currentData.chars += char;
	    }
	    finishData() {
	        appendChild(this.currentElement(), b.text(this.finish(this.currentData)));
	    }
	    // Tags - basic
	    tagOpen() {
	        this.tagOpenLine = this.tokenizer.line;
	        this.tagOpenColumn = this.tokenizer.column;
	    }
	    beginStartTag() {
	        this.currentNode = {
	            type: 'StartTag',
	            name: '',
	            nameStart: null,
	            nameEnd: null,
	            attributes: [],
	            modifiers: [],
	            comments: [],
	            params: [],
	            selfClosing: false,
	            start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
	        };
	    }
	    beginEndTag() {
	        this.currentNode = {
	            type: 'EndTag',
	            name: '',
	            start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
	        };
	    }
	    finishTag() {
	        let tag = this.finish(this.currentTag);
	        if (tag.type === 'StartTag') {
	            this.finishStartTag();
	            if (tag.name === ':') {
	                throw generateSyntaxError('Invalid named block named detected, you may have created a named block without a name, or you may have began your name with a number. Named blocks must have names that are at least one character long, and begin with a lower case letter', this.source.spanFor({
	                    start: this.currentTag.start.toJSON(),
	                    end: this.offset().toJSON()
	                }));
	            }
	            if (voidMap.has(tag.name) || tag.selfClosing) {
	                this.finishEndTag(true);
	            }
	        } else {
	            this.finishEndTag(false);
	        }
	    }
	    finishStartTag() {
	        let { name, nameStart, nameEnd } = this.currentStartTag;
	        let nameLoc = nameStart.until(nameEnd);
	        let [head, ...tail] = asPresentArray(name.split('.'));
	        let path = b.path({
	            head: b.head({
	                original: head,
	                loc: nameLoc.sliceStartChars({
	                    chars: head.length
	                })
	            }),
	            tail,
	            loc: nameLoc
	        });
	        let { attributes, modifiers, comments, params, selfClosing, loc } = this.finish(this.currentStartTag);
	        let element = b.element({
	            path,
	            selfClosing,
	            attributes,
	            modifiers,
	            comments,
	            params,
	            children: [],
	            openTag: loc,
	            closeTag: selfClosing ? null : SourceSpan.broken(),
	            loc
	        });
	        this.elementStack.push(element);
	    }
	    finishEndTag(isVoid) {
	        let { start: closeTagStart } = this.currentTag;
	        let tag = this.finish(this.currentTag);
	        let element = this.elementStack.pop();
	        this.validateEndTag(tag, element, isVoid);
	        let parent = this.currentElement();
	        if (isVoid) {
	            element.closeTag = null;
	        } else if (element.selfClosing) ; else {
	            element.closeTag = closeTagStart.until(this.offset());
	        }
	        element.loc = element.loc.withEnd(this.offset());
	        appendChild(parent, b.element(element));
	    }
	    markTagAsSelfClosing() {
	        let tag = this.currentTag;
	        if (tag.type === 'StartTag') {
	            tag.selfClosing = true;
	        } else {
	            throw generateSyntaxError(`Invalid end tag: closing tag must not be self-closing`, this.source.spanFor({
	                start: tag.start.toJSON(),
	                end: this.offset().toJSON()
	            }));
	        }
	    }
	    // Tags - name
	    appendToTagName(char) {
	        let tag = this.currentTag;
	        tag.name += char;
	        if (tag.type === 'StartTag') {
	            let offset = this.offset();
	            if (tag.nameStart === null) {
	                // Note that the tokenizer already consumed the token here
	                tag.nameStart = offset.move(-1);
	            }
	            tag.nameEnd = offset;
	        }
	    }
	    // Tags - attributes
	    beginAttribute() {
	        let offset = this.offset();
	        this.currentAttribute = {
	            name: '',
	            parts: [],
	            currentPart: null,
	            isQuoted: false,
	            isDynamic: false,
	            start: offset,
	            valueSpan: offset.collapsed()
	        };
	    }
	    appendToAttributeName(char) {
	        this.currentAttr.name += char;
	        // The block params parsing code can actually handle peek=non-space just
	        // fine, but this check was added as an optimization, as there is a little
	        // bit of setup overhead for the parsing logic just to immediately bail
	        if (this.currentAttr.name === 'as') {
	            this.parsePossibleBlockParams();
	        }
	    }
	    beginAttributeValue(isQuoted) {
	        this.currentAttr.isQuoted = isQuoted;
	        this.startTextPart();
	        this.currentAttr.valueSpan = this.offset().collapsed();
	    }
	    appendToAttributeValue(char) {
	        let parts = this.currentAttr.parts;
	        let lastPart = parts[parts.length - 1];
	        let current = this.currentAttr.currentPart;
	        if (current) {
	            current.chars += char;
	            // update end location for each added char
	            current.loc = current.loc.withEnd(this.offset());
	        } else {
	            // initially assume the text node is a single char
	            let loc = this.offset();
	            // the tokenizer line/column have already been advanced, correct location info
	            if (char === '\n') {
	                loc = lastPart ? lastPart.loc.getEnd() : this.currentAttr.valueSpan.getStart();
	            } else {
	                loc = loc.move(-1);
	            }
	            this.currentAttr.currentPart = b.text({
	                chars: char,
	                loc: loc.collapsed()
	            });
	        }
	    }
	    finishAttributeValue() {
	        this.finalizeTextPart();
	        let tag = this.currentTag;
	        let tokenizerPos = this.offset();
	        if (tag.type === 'EndTag') {
	            throw generateSyntaxError(`Invalid end tag: closing tag must not have attributes`, this.source.spanFor({
	                start: tag.start.toJSON(),
	                end: tokenizerPos.toJSON()
	            }));
	        }
	        let { name, parts, start, isQuoted, isDynamic, valueSpan } = this.currentAttr;
	        // Just trying to be helpful with `<Hello |foo|>` rather than letting it through as an attribute
	        if (name.startsWith('|') && parts.length === 0 && !isQuoted && !isDynamic) {
	            throw generateSyntaxError('Invalid block parameters syntax: block parameters must be preceded by the `as` keyword', start.until(start.move(name.length)));
	        }
	        let value = this.assembleAttributeValue(parts, isQuoted, isDynamic, start.until(tokenizerPos));
	        value.loc = valueSpan.withEnd(tokenizerPos);
	        let attribute = b.attr({
	            name,
	            value,
	            loc: start.until(tokenizerPos)
	        });
	        this.currentStartTag.attributes.push(attribute);
	    }
	    parsePossibleBlockParams() {
	        // const enums that we can't use directly
	        const BEFORE_ATTRIBUTE_NAME = 'beforeAttributeName';
	        const AFTER_ATTRIBUTE_NAME = 'afterAttributeName';
	        // Regex to validate the identifier for block parameters.
	        // Based on the ID validation regex in Handlebars.
	        const ID_INVERSE_PATTERN = /[!"#%&'()*+./;<=>@[\\\]^`{|}~]/u;
	        const element = this.currentStartTag;
	        const as = this.currentAttr;
	        let state = {
	            state: 'PossibleAs'
	        };
	        const handlers = {
	            PossibleAs: (next)=>{
	                if (isSpace(next)) {
	                    // " as ..."
	                    state = {
	                        state: 'BeforeStartPipe'
	                    };
	                    this.tokenizer.transitionTo(AFTER_ATTRIBUTE_NAME);
	                    this.tokenizer.consume();
	                } else if (next === '|') {
	                    // " as|..."
	                    // Following Handlebars and require a space between "as" and the pipe
	                    throw generateSyntaxError(`Invalid block parameters syntax: expecting at least one space character between "as" and "|"`, as.start.until(this.offset().move(1)));
	                } else {
	                    // " as{{...", " async...", " as=...", " as>...", " as/>..."
	                    // Don't consume, let the normal tokenizer code handle the next steps
	                    state = {
	                        state: 'Done'
	                    };
	                }
	            },
	            BeforeStartPipe: (next)=>{
	                if (isSpace(next)) {
	                    this.tokenizer.consume();
	                } else if (next === '|') {
	                    state = {
	                        state: 'BeforeBlockParamName'
	                    };
	                    this.tokenizer.transitionTo(BEFORE_ATTRIBUTE_NAME);
	                    this.tokenizer.consume();
	                } else {
	                    // " as {{...", " as bs...", " as =...", " as ...", " as/>..."
	                    // Don't consume, let the normal tokenizer code handle the next steps
	                    state = {
	                        state: 'Done'
	                    };
	                }
	            },
	            BeforeBlockParamName: (next)=>{
	                if (isSpace(next)) {
	                    this.tokenizer.consume();
	                } else if (next === '') {
	                    // The HTML tokenizer ran out of characters, so we are either
	                    // encountering mustache or <EOF>
	                    state = {
	                        state: 'Done'
	                    };
	                    this.pendingError = {
	                        mustache (loc) {
	                            throw generateSyntaxError(`Invalid block parameters syntax: mustaches cannot be used inside parameters list`, loc);
	                        },
	                        eof (loc) {
	                            throw generateSyntaxError(`Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list`, as.start.until(loc));
	                        }
	                    };
	                } else if (next === '|') {
	                    if (element.params.length === 0) {
	                        // Following Handlebars and treat empty block params a syntax error
	                        throw generateSyntaxError(`Invalid block parameters syntax: empty parameters list, expecting at least one identifier`, as.start.until(this.offset().move(1)));
	                    } else {
	                        state = {
	                            state: 'AfterEndPipe'
	                        };
	                        this.tokenizer.consume();
	                    }
	                } else if (next === '>' || next === '/') {
	                    throw generateSyntaxError(`Invalid block parameters syntax: incomplete parameters list, expecting "|" but the tag was closed prematurely`, as.start.until(this.offset().move(1)));
	                } else {
	                    // slurp up anything else into the name, validate later
	                    state = {
	                        state: 'BlockParamName',
	                        name: next,
	                        start: this.offset()
	                    };
	                    this.tokenizer.consume();
	                }
	            },
	            BlockParamName: (next)=>{
	                if (next === '') {
	                    // The HTML tokenizer ran out of characters, so we are either
	                    // encountering mustache or <EOF>, HBS side will attach the error
	                    // to the next span
	                    state = {
	                        state: 'Done'
	                    };
	                    this.pendingError = {
	                        mustache (loc) {
	                            throw generateSyntaxError(`Invalid block parameters syntax: mustaches cannot be used inside parameters list`, loc);
	                        },
	                        eof (loc) {
	                            throw generateSyntaxError(`Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list`, as.start.until(loc));
	                        }
	                    };
	                } else if (next === '|' || isSpace(next)) {
	                    let loc = state.start.until(this.offset());
	                    if (state.name === 'this' || ID_INVERSE_PATTERN.test(state.name)) {
	                        throw generateSyntaxError(`Invalid block parameters syntax: invalid identifier name \`${state.name}\``, loc);
	                    }
	                    element.params.push(b.var({
	                        name: state.name,
	                        loc
	                    }));
	                    state = next === '|' ? {
	                        state: 'AfterEndPipe'
	                    } : {
	                        state: 'BeforeBlockParamName'
	                    };
	                    this.tokenizer.consume();
	                } else if (next === '>' || next === '/') {
	                    throw generateSyntaxError(`Invalid block parameters syntax: expecting "|" but the tag was closed prematurely`, as.start.until(this.offset().move(1)));
	                } else {
	                    // slurp up anything else into the name, validate later
	                    state.name += next;
	                    this.tokenizer.consume();
	                }
	            },
	            AfterEndPipe: (next)=>{
	                if (isSpace(next)) {
	                    this.tokenizer.consume();
	                } else if (next === '') {
	                    // The HTML tokenizer ran out of characters, so we are either
	                    // encountering mustache or <EOF>, HBS side will attach the error
	                    // to the next span
	                    state = {
	                        state: 'Done'
	                    };
	                    this.pendingError = {
	                        mustache (loc) {
	                            throw generateSyntaxError(`Invalid block parameters syntax: modifiers cannot follow parameters list`, loc);
	                        },
	                        eof (loc) {
	                            throw generateSyntaxError(`Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list`, as.start.until(loc));
	                        }
	                    };
	                } else if (next === '>' || next === '/') {
	                    // Don't consume, let the normal tokenizer code handle the next steps
	                    state = {
	                        state: 'Done'
	                    };
	                } else {
	                    // Slurp up the next "token" for the error span
	                    state = {
	                        state: 'Error',
	                        message: 'Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list',
	                        start: this.offset()
	                    };
	                    this.tokenizer.consume();
	                }
	            },
	            Error: (next)=>{
	                if (next === '' || next === '/' || next === '>' || isSpace(next)) {
	                    throw generateSyntaxError(state.message, state.start.until(this.offset()));
	                } else {
	                    // Slurp up the next "token" for the error span
	                    this.tokenizer.consume();
	                }
	            },
	            Done: ()=>{
	            }
	        };
	        let next;
	        do {
	            next = this.tokenizer.peek();
	            handlers[state.state](next);
	        }while (state.state !== 'Done' && next !== '')
	    }
	    reportSyntaxError(message) {
	        throw generateSyntaxError(message, this.offset().collapsed());
	    }
	    assembleConcatenatedValue(parts) {
	        let first = getFirst(parts);
	        let last = getLast(parts);
	        return b.concat({
	            parts,
	            loc: this.source.spanFor(first.loc).extend(this.source.spanFor(last.loc))
	        });
	    }
	    validateEndTag(tag, element, selfClosing) {
	        if (voidMap.has(tag.name) && !selfClosing) {
	            // EngTag is also called by StartTag for void and self-closing tags (i.e.
	            // <input> or <br />, so we need to check for that here. Otherwise, we would
	            // throw an error for those cases.
	            throw generateSyntaxError(`<${tag.name}> elements do not need end tags. You should remove it`, tag.loc);
	        } else if (element.type !== 'ElementNode') {
	            throw generateSyntaxError(`Closing tag </${tag.name}> without an open tag`, tag.loc);
	        } else if (element.tag !== tag.name) {
	            throw generateSyntaxError(`Closing tag </${tag.name}> did not match last open tag <${element.tag}> (on line ${element.loc.startPosition.line})`, tag.loc);
	        }
	    }
	    assembleAttributeValue(parts, isQuoted, isDynamic, span) {
	        if (isDynamic) {
	            if (isQuoted) {
	                return this.assembleConcatenatedValue(parts);
	            } else {
	                const [head, a] = parts;
	                if (a === undefined || a.type === 'TextNode' && a.chars === '/') {
	                    return head;
	                } else {
	                    throw generateSyntaxError(`An unquoted attribute value must be a string or a mustache, ` + `preceded by whitespace or a '=' character, and ` + `followed by whitespace, a '>' character, or '/>'`, span);
	                }
	            }
	        } else if (isPresentArray(parts)) {
	            return parts[0];
	        } else {
	            return b.text({
	                chars: '',
	                loc: span
	            });
	        }
	    }
	    constructor(...args){
	        super(...args), this.tagOpenLine = 0, this.tagOpenColumn = 0;
	    }
	}
	const syntax = {
	    parse: preprocess,
	    builders: publicBuilder,
	    print: build,
	    traverse,
	    Walker
	};
	class CodemodEntityParser extends EntityParser {
	    // match upstream types, but never match an entity
	    constructor(){
	        super({});
	    }
	    parse() {
	        return undefined;
	    }
	}
	function preprocess(input, options = {}) {
	    let mode = options.mode || 'precompile';
	    let source;
	    let ast;
	    if (typeof input === 'string') {
	        source = new Source(input, options.meta?.moduleName);
	        if (mode === 'codemod') {
	            ast = parseWithoutProcessing(input, options.parseOptions);
	        } else {
	            ast = parse(input, options.parseOptions);
	        }
	    } else if (input instanceof Source) {
	        source = input;
	        if (mode === 'codemod') {
	            ast = parseWithoutProcessing(input.source, options.parseOptions);
	        } else {
	            ast = parse(input.source, options.parseOptions);
	        }
	    } else {
	        source = new Source('', options.meta?.moduleName);
	        ast = input;
	    }
	    let entityParser = undefined;
	    if (mode === 'codemod') {
	        entityParser = new CodemodEntityParser();
	    }
	    let offsets = SourceSpan.forCharPositions(source, 0, source.source.length);
	    ast.loc = {
	        source: '(program)',
	        start: offsets.startPosition,
	        end: offsets.endPosition
	    };
	    let template = new TokenizerEventHandlers(source, entityParser, mode).parse(ast, options.locals ?? []);
	    if (options.plugins?.ast) {
	        for (const transform of options.plugins.ast){
	            let env = assign({}, options, {
	                syntax
	            }, {
	                plugins: undefined
	            });
	            let pluginResult = transform(env);
	            traverse(template, pluginResult.visitor);
	        }
	    }
	    return template;
	}

	/**
	 * Gets the correct Token from the Node based on it's type
	 */ function getPathName(node, scopedTokens, options) {
	    if (node.type === 'PathExpression') {
	        if (node.head.type === 'AtHead' || node.head.type === 'ThisHead') {
	            return;
	        }
	        const possbleToken = node.head.name;
	        if (scopedTokens.indexOf(possbleToken) === -1) {
	            return possbleToken;
	        }
	    } else if (node.type === 'ElementNode') {
	        const { tag } = node;
	        const char = tag.charAt(0);
	        if (char === ':' || char === '@') {
	            return;
	        }
	        if (!options.includeHtmlElements && tag.indexOf('.') === -1 && tag.toLowerCase() === tag) {
	            return;
	        }
	        // eslint-disable-next-line @typescript-eslint/no-deprecated -- @fixme
	        if (tag.substr(0, 5) === 'this.') {
	            return;
	        }
	        // the tag may be from a yielded object
	        // example:
	        //   <x.button>
	        // An ElementNode does not parse the "tag" in to a PathExpression
	        // so we have to split on `.`, just like how `this` presence is checked.
	        if (tag.includes('.')) {
	            let [potentialLocal] = tag.split('.');
	            if (scopedTokens.includes(potentialLocal)) return;
	        }
	        if (scopedTokens.includes(tag)) return;
	        return tag;
	    }
	}
	/**
	 * Adds tokens to the tokensSet based on their node.type
	 */ function addTokens(tokensSet, node, scopedTokens, options) {
	    const maybePathName = getPathName(node, scopedTokens, options);
	    if (maybePathName !== undefined && maybePathName[0] !== '@') {
	        const maybeFirstPathSegment = maybePathName.split('.')[0];
	        if (maybeFirstPathSegment && !scopedTokens.includes(maybeFirstPathSegment)) {
	            tokensSet.add(maybeFirstPathSegment);
	        }
	    }
	}
	/**
	 * Parses and traverses a given handlebars html template to extract all template locals
	 * referenced that could possible come from the parent scope. Can exclude known keywords
	 * optionally.
	 */ function getTemplateLocals(html, options = {
	    includeHtmlElements: false,
	    includeKeywords: false
	}) {
	    const ast = preprocess(html);
	    const tokensSet = new Set();
	    const scopedTokens = [];
	    traverse(ast, {
	        Block: {
	            enter ({ blockParams }) {
	                blockParams.forEach((param)=>{
	                    scopedTokens.push(param);
	                });
	            },
	            exit ({ blockParams }) {
	                blockParams.forEach(()=>{
	                    scopedTokens.pop();
	                });
	            }
	        },
	        ElementNode: {
	            enter (node) {
	                node.blockParams.forEach((param)=>{
	                    scopedTokens.push(param);
	                });
	                addTokens(tokensSet, node, scopedTokens, options);
	            },
	            exit ({ blockParams }) {
	                blockParams.forEach(()=>{
	                    scopedTokens.pop();
	                });
	            }
	        },
	        PathExpression (node) {
	            addTokens(tokensSet, node, scopedTokens, options);
	        }
	    });
	    let tokens = [];
	    tokensSet.forEach((s)=>tokens.push(s));
	    if (!options.includeKeywords) {
	        tokens = tokens.filter((token)=>!isKeyword(token));
	    }
	    return tokens;
	}

	const opcodes = {
	    GetStrictKeyword: 31,
	    GetFreeAsComponentOrHelperHead: 35,
	    GetFreeAsHelperHead: 37,
	    GetFreeAsModifierHead: 38,
	    GetFreeAsComponentHead: 39};

	function node(name) {
	    if (name !== undefined) {
	        const type = name;
	        return {
	            fields () {
	                return class {
	                    constructor(fields){
	                        this.type = type;
	                        assign(this, fields);
	                    }
	                };
	            }
	        };
	    } else {
	        return {
	            fields () {
	                return class {
	                    constructor(fields){
	                        assign(this, fields);
	                    }
	                };
	            }
	        };
	    }
	}

	/**
	 * Corresponds to syntaxes with positional and named arguments:
	 *
	 * - SubExpression
	 * - Invoking Append
	 * - Invoking attributes
	 * - InvokeBlock
	 *
	 * If `Args` is empty, the `SourceOffsets` for this node should be the collapsed position
	 * immediately after the parent call node's `callee`.
	 */ class Args extends node().fields() {
	    static empty(loc) {
	        return new Args({
	            loc,
	            positional: PositionalArguments.empty(loc),
	            named: NamedArguments.empty(loc)
	        });
	    }
	    static named(named) {
	        return new Args({
	            loc: named.loc,
	            positional: PositionalArguments.empty(named.loc.collapse('end')),
	            named
	        });
	    }
	    nth(offset) {
	        return this.positional.nth(offset);
	    }
	    get(name) {
	        return this.named.get(name);
	    }
	    isEmpty() {
	        return this.positional.isEmpty() && this.named.isEmpty();
	    }
	}
	/**
	 * Corresponds to positional arguments.
	 *
	 * If `PositionalArguments` is empty, the `SourceOffsets` for this node should be the collapsed
	 * position immediately after the parent call node's `callee`.
	 */ class PositionalArguments extends node().fields() {
	    static empty(loc) {
	        return new PositionalArguments({
	            loc,
	            exprs: []
	        });
	    }
	    get size() {
	        return this.exprs.length;
	    }
	    nth(offset) {
	        return this.exprs[offset] || null;
	    }
	    isEmpty() {
	        return this.exprs.length === 0;
	    }
	}
	/**
	 * Corresponds to named arguments.
	 *
	 * If `PositionalArguments` and `NamedArguments` are empty, the `SourceOffsets` for this node should
	 * be the same as the `Args` node that contains this node.
	 *
	 * If `PositionalArguments` is not empty but `NamedArguments` is empty, the `SourceOffsets` for this
	 * node should be the collapsed position immediately after the last positional argument.
	 */ class NamedArguments extends node().fields() {
	    static empty(loc) {
	        return new NamedArguments({
	            loc,
	            entries: []
	        });
	    }
	    get size() {
	        return this.entries.length;
	    }
	    get(name) {
	        let entry = this.entries.filter((e)=>e.name.chars === name)[0];
	        return entry ? entry.value : null;
	    }
	    isEmpty() {
	        return this.entries.length === 0;
	    }
	}
	/**
	 * Corresponds to a single named argument.
	 *
	 * ```hbs
	 * x=<expr>
	 * ```
	 */ class NamedArgument {
	    constructor(options){
	        this.loc = options.name.loc.extend(options.value.loc);
	        this.name = options.name;
	        this.value = options.value;
	    }
	}

	/**
	 * `HtmlAttr` nodes are valid HTML attributes, with or without a value.
	 *
	 * Exceptions:
	 *
	 * - `...attributes` is `SplatAttr`
	 * - `@x=<value>` is `ComponentArg`
	 */ class HtmlAttr extends node('HtmlAttr').fields() {
	}
	class SplatAttr extends node('SplatAttr').fields() {
	}
	/**
	 * Corresponds to an argument passed by a component (`@x=<value>`)
	 */ class ComponentArg extends node().fields() {
	    /**
	   * Convert the component argument into a named argument node
	   */ toNamedArgument() {
	        return new NamedArgument({
	            name: this.name,
	            value: this.value
	        });
	    }
	}
	/**
	 * An `ElementModifier` is just a normal call node in modifier position.
	 */ class ElementModifier extends node('ElementModifier').fields() {
	}

	class GlimmerComment extends node('GlimmerComment').fields() {
	}
	class HtmlText extends node('HtmlText').fields() {
	}
	class HtmlComment extends node('HtmlComment').fields() {
	}
	class AppendContent extends node('AppendContent').fields() {
	    get callee() {
	        if (this.value.type === 'Call') {
	            return this.value.callee;
	        } else {
	            return this.value;
	        }
	    }
	    get args() {
	        if (this.value.type === 'Call') {
	            return this.value.args;
	        } else {
	            return Args.empty(this.value.loc.collapse('end'));
	        }
	    }
	}
	class InvokeBlock extends node('InvokeBlock').fields() {
	}
	/**
	 * Corresponds to a component invocation. When the content of a component invocation contains no
	 * named blocks, `blocks` contains a single named block named `"default"`. When a component
	 * invocation is self-closing, `blocks` is empty.
	 */ class InvokeComponent extends node('InvokeComponent').fields() {
	    get args() {
	        let entries = this.componentArgs.map((a)=>a.toNamedArgument());
	        return Args.named(new NamedArguments({
	            loc: SpanList.range(entries, this.callee.loc.collapse('end')),
	            entries
	        }));
	    }
	}
	/**
	 * Corresponds to a simple HTML element. The AST allows component arguments and modifiers to support
	 * future extensions.
	 */ class SimpleElement extends node('SimpleElement').fields() {
	    get args() {
	        let entries = this.componentArgs.map((a)=>a.toNamedArgument());
	        return Args.named(new NamedArguments({
	            loc: SpanList.range(entries, this.tag.loc.collapse('end')),
	            entries
	        }));
	    }
	}

	/**
	 * Corresponds to a Handlebars literal.
	 *
	 * @see {LiteralValue}
	 */ class LiteralExpression extends node('Literal').fields() {
	    toSlice() {
	        return new SourceSlice({
	            loc: this.loc,
	            chars: this.value
	        });
	    }
	}
	/**
	 * Returns true if an input {@see ExpressionNode} is a literal.
	 */ function isLiteral$1(node, kind) {
	    if (node.type === 'Literal') {
	        if (kind === undefined) {
	            return true;
	        } else if (kind === 'null') {
	            return node.value === null;
	        } else {
	            return typeof node.value === kind;
	        }
	    } else {
	        return false;
	    }
	}
	/**
	 * Corresponds to a path in expression position.
	 *
	 * ```hbs
	 * this
	 * this.x
	 * @x
	 * @x.y
	 * x
	 * x.y
	 * ```
	 */ class PathExpression extends node('Path').fields() {
	}
	/**
	 * Corresponds to a known strict-mode keyword. It behaves similarly to a
	 * PathExpression with a FreeVarReference, but implies StrictResolution and
	 * is guaranteed to not have a tail, since `{{outlet.foo}}` would have been
	 * illegal.
	 */ class KeywordExpression extends node('Keyword').fields() {
	}
	/**
	 * Corresponds to a parenthesized call expression.
	 *
	 * ```hbs
	 * (x)
	 * (x.y)
	 * (x y)
	 * (x.y z)
	 * ```
	 */ class CallExpression extends node('Call').fields() {
	}
	/**
	 * Corresponds to an interpolation in attribute value position.
	 *
	 * ```hbs
	 * <a href="{{url}}.html"
	 * ```
	 */ class InterpolateExpression extends node('Interpolate').fields() {
	}

	/**
	 * Corresponds to an entire template.
	 */ class Template extends node().fields() {
	}
	/**
	 * Represents a block. In principle this could be merged with `NamedBlock`, because all cases
	 * involving blocks have at least a notional name.
	 */ class Block extends node().fields() {
	}
	/**
	 * Corresponds to a collection of named blocks.
	 */ class NamedBlocks extends node().fields() {
	    get(name) {
	        return this.blocks.filter((block)=>block.name.chars === name)[0] || null;
	    }
	}
	/**
	 * Corresponds to a single named block. This is used for anonymous named blocks (`default` and
	 * `else`).
	 */ class NamedBlock extends node().fields() {
	    get args() {
	        let entries = this.componentArgs.map((a)=>a.toNamedArgument());
	        return Args.named(new NamedArguments({
	            loc: SpanList.range(entries, this.name.loc.collapse('end')),
	            entries
	        }));
	    }
	}

	/**
	 * Corresponds to `this` at the head of an expression.
	 */ class ThisReference extends node('This').fields() {
	}
	/**
	 * Corresponds to `@<ident>` at the beginning of an expression.
	 */ class ArgReference extends node('Arg').fields() {
	}
	/**
	 * Corresponds to `<ident>` at the beginning of an expression, when `<ident>` is in the current
	 * block's scope.
	 */ class LocalVarReference extends node('Local').fields() {
	}
	/**
	 * Corresponds to `<ident>` at the beginning of an expression, when `<ident>` is *not* in the
	 * current block's scope.
	 *
	 * The `resolution: FreeVarResolution` field describes how to resolve the free variable.
	 *
	 * Note: In strict mode, it must always be a variable that is in a concrete JavaScript scope that
	 * the template will be installed into.
	 */ class FreeVarReference extends node('Free').fields() {
	}

	/// FreeVarNamespace ///
	const HELPER_VAR_NS = 'Helper';
	const MODIFIER_VAR_NS = 'Modifier';
	const COMPONENT_VAR_NS = 'Component';

	/**
	 * Strict resolution is used:
	 *
	 * 1. in a strict mode template
	 * 2. in an local variable invocation with dot paths
	 */ const STRICT_RESOLUTION = {
	    resolution: ()=>opcodes.GetStrictKeyword,
	    serialize: ()=>'Strict',
	    isAngleBracket: false
	};
	const HTML_RESOLUTION = {
	    ...STRICT_RESOLUTION,
	    isAngleBracket: true
	};
	function isStrictResolution(value) {
	    return value === STRICT_RESOLUTION;
	}
	/**
	 * A `LooseModeResolution` includes one or more namespaces to resolve the variable in
	 *
	 * In practice, there are a limited number of possible combinations of these degrees of freedom,
	 * and they are captured by the `Namespaces` union below.
	 */ class LooseModeResolution {
	    /**
	   * Namespaced resolution is used in an unambiguous syntax position:
	   *
	   * 1. `(sexp)` (namespace: `Helper`)
	   * 2. `{{#block}}` (namespace: `Component`)
	   * 3. `<a {{modifier}}>` (namespace: `Modifier`)
	   * 4. `<Component />` (namespace: `Component`)
	   */ static namespaced(namespace, isAngleBracket = false) {
	        return new LooseModeResolution([
	            namespace
	        ], isAngleBracket);
	    }
	    /**
	   * Append resolution is used when the variable should be resolved in both the `component` and
	   * `helper` namespaces.
	   *
	   * ```hbs
	   * {{x}}
	   * ```
	   *
	   * ```hbs
	   * {{x y}}
	   * ```
	   *
	   * ^ In either case, `x` should be resolved in the `component` and `helper` namespaces.
	   */ static append() {
	        return new LooseModeResolution([
	            COMPONENT_VAR_NS,
	            HELPER_VAR_NS
	        ]);
	    }
	    /**
	   * Trusting append resolution is used when the variable should be resolved only in the
	   * `helper` namespaces.
	   *
	   * ```hbs
	   * {{{x}}}
	   * ```
	   *
	   * ```hbs
	   * {{{x y}}}
	   * ```
	   *
	   * ^ In either case, `x` should be resolved in the `helper` namespace.
	   */ static trustingAppend() {
	        return this.namespaced(HELPER_VAR_NS);
	    }
	    constructor(namespaces, isAngleBracket = false){
	        this.namespaces = namespaces;
	        this.isAngleBracket = isAngleBracket;
	    }
	    resolution() {
	        if (this.namespaces.length === 1) {
	            switch(this.namespaces[0]){
	                case HELPER_VAR_NS:
	                    return opcodes.GetFreeAsHelperHead;
	                case MODIFIER_VAR_NS:
	                    return opcodes.GetFreeAsModifierHead;
	                case COMPONENT_VAR_NS:
	                    return opcodes.GetFreeAsComponentHead;
	            }
	        } else {
	            return opcodes.GetFreeAsComponentOrHelperHead;
	        }
	    }
	    serialize() {
	        if (this.namespaces.length === 1) {
	            return this.namespaces[0];
	        } else {
	            return 'ComponentOrHelper';
	        }
	    }
	}
	const HELPER_NAMESPACE = HELPER_VAR_NS;
	const MODIFIER_NAMESPACE = MODIFIER_VAR_NS;
	const COMPONENT_NAMESPACE = COMPONENT_VAR_NS;
	function loadResolution(resolution) {
	    if (resolution === 'Strict') {
	        return STRICT_RESOLUTION;
	    } else if (resolution === 'ComponentOrHelper') {
	        return LooseModeResolution.append();
	    } else {
	        return LooseModeResolution.namespaced(resolution);
	    }
	}

	var api = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  AppendContent: AppendContent,
	  ArgReference: ArgReference,
	  Args: Args,
	  Block: Block,
	  COMPONENT_NAMESPACE: COMPONENT_NAMESPACE,
	  CallExpression: CallExpression,
	  ComponentArg: ComponentArg,
	  ElementModifier: ElementModifier,
	  FreeVarReference: FreeVarReference,
	  GlimmerComment: GlimmerComment,
	  HELPER_NAMESPACE: HELPER_NAMESPACE,
	  HTML_RESOLUTION: HTML_RESOLUTION,
	  HtmlAttr: HtmlAttr,
	  HtmlComment: HtmlComment,
	  HtmlText: HtmlText,
	  InterpolateExpression: InterpolateExpression,
	  InvokeBlock: InvokeBlock,
	  InvokeComponent: InvokeComponent,
	  KeywordExpression: KeywordExpression,
	  LiteralExpression: LiteralExpression,
	  LocalVarReference: LocalVarReference,
	  LooseModeResolution: LooseModeResolution,
	  MODIFIER_NAMESPACE: MODIFIER_NAMESPACE,
	  NamedArgument: NamedArgument,
	  NamedArguments: NamedArguments,
	  NamedBlock: NamedBlock,
	  NamedBlocks: NamedBlocks,
	  PathExpression: PathExpression,
	  PositionalArguments: PositionalArguments,
	  STRICT_RESOLUTION: STRICT_RESOLUTION,
	  SimpleElement: SimpleElement,
	  SplatAttr: SplatAttr,
	  Template: Template,
	  ThisReference: ThisReference,
	  isLiteral: isLiteral$1,
	  isStrictResolution: isStrictResolution,
	  loadResolution: loadResolution,
	  node: node
	});

	class SymbolTable {
	    static top(locals, keywords, options) {
	        return new ProgramSymbolTable(locals, keywords, options);
	    }
	    child(locals) {
	        let symbols = locals.map((name)=>this.allocate(name));
	        return new BlockSymbolTable(this, locals, symbols);
	    }
	}
	class ProgramSymbolTable extends SymbolTable {
	    constructor(templateLocals, keywords, options){
	        super(), this.templateLocals = templateLocals, this.keywords = keywords, this.options = options, this.symbols = [], this.upvars = [], this.size = 1, this.named = dict(), this.blocks = dict(), this.usedTemplateLocals = [];
	    }
	    root() {
	        return this;
	    }
	    hasLexical(name) {
	        return this.options.lexicalScope(name);
	    }
	    hasKeyword(name) {
	        return this.keywords.includes(name);
	    }
	    getKeyword(name) {
	        return this.allocateFree(name, STRICT_RESOLUTION);
	    }
	    getUsedTemplateLocals() {
	        return this.usedTemplateLocals;
	    }
	    has(name) {
	        return this.templateLocals.includes(name);
	    }
	    get(name) {
	        let index = this.usedTemplateLocals.indexOf(name);
	        if (index !== -1) {
	            return [
	                index,
	                true
	            ];
	        }
	        index = this.usedTemplateLocals.length;
	        this.usedTemplateLocals.push(name);
	        return [
	            index,
	            true
	        ];
	    }
	    getLocalsMap() {
	        return dict();
	    }
	    getDebugInfo() {
	        return [
	            this.getLocalsMap(),
	            this.named
	        ];
	    }
	    allocateFree(name, resolution) {
	        // If the name in question is an uppercase (i.e. angle-bracket) component invocation, run
	        // the optional `customizeComponentName` function provided to the precompiler.
	        if (resolution.resolution() === opcodes.GetFreeAsComponentHead && resolution.isAngleBracket) {
	            name = this.options.customizeComponentName(name);
	        }
	        let index = this.upvars.indexOf(name);
	        if (index !== -1) {
	            return index;
	        }
	        index = this.upvars.length;
	        this.upvars.push(name);
	        return index;
	    }
	    allocateNamed(name) {
	        let named = this.named[name];
	        if (!named) {
	            named = this.named[name] = this.allocate(name);
	        }
	        return named;
	    }
	    allocateBlock(name) {
	        if (name === 'inverse') {
	            name = 'else';
	        }
	        let block = this.blocks[name];
	        if (!block) {
	            block = this.blocks[name] = this.allocate(`&${name}`);
	        }
	        return block;
	    }
	    allocate(identifier) {
	        this.symbols.push(identifier);
	        return this.size++;
	    }
	}
	class BlockSymbolTable extends SymbolTable {
	    constructor(parent, symbols, slots){
	        super(), this.parent = parent, this.symbols = symbols, this.slots = slots;
	    }
	    root() {
	        return this.parent.root();
	    }
	    get locals() {
	        return this.symbols;
	    }
	    hasLexical(name) {
	        return this.parent.hasLexical(name);
	    }
	    getKeyword(name) {
	        return this.parent.getKeyword(name);
	    }
	    hasKeyword(name) {
	        return this.parent.hasKeyword(name);
	    }
	    has(name) {
	        return this.symbols.indexOf(name) !== -1 || this.parent.has(name);
	    }
	    get(name) {
	        let local = this.#get(name);
	        return local ? [
	            local,
	            false
	        ] : this.parent.get(name);
	    }
	    #get(name) {
	        let slot = this.symbols.indexOf(name);
	        return slot === -1 ? null : unwrap(this.slots[slot]);
	    }
	    getLocalsMap() {
	        let dict = this.parent.getLocalsMap();
	        this.symbols.forEach((symbol)=>dict[symbol] = this.get(symbol)[0]);
	        return dict;
	    }
	    getDebugInfo() {
	        const locals = this.getLocalsMap();
	        const root = this.root();
	        const named = root.named;
	        return [
	            {
	                ...locals,
	                ...named
	            },
	            Object.fromEntries(root.upvars.map((s, i)=>[
	                    s,
	                    i
	                ]))
	        ];
	    }
	    allocateFree(name, resolution) {
	        return this.parent.allocateFree(name, resolution);
	    }
	    allocateNamed(name) {
	        return this.parent.allocateNamed(name);
	    }
	    allocateBlock(name) {
	        return this.parent.allocateBlock(name);
	    }
	    allocate(identifier) {
	        return this.parent.allocate(identifier);
	    }
	}

	class Builder {
	    // TEMPLATE //
	    template(symbols, body, loc) {
	        return new Template({
	            table: symbols,
	            body,
	            loc
	        });
	    }
	    // INTERNAL (these nodes cannot be reached when doing general-purpose visiting) //
	    block(symbols, body, loc) {
	        return new Block({
	            scope: symbols,
	            body,
	            loc
	        });
	    }
	    namedBlock(name, block, loc) {
	        return new NamedBlock({
	            name,
	            block,
	            attrs: [],
	            componentArgs: [],
	            modifiers: [],
	            loc
	        });
	    }
	    simpleNamedBlock(name, block, loc) {
	        return new BuildElement({
	            selfClosing: false,
	            attrs: [],
	            componentArgs: [],
	            modifiers: [],
	            comments: []
	        }).named(name, block, loc);
	    }
	    slice(chars, loc) {
	        return new SourceSlice({
	            loc,
	            chars
	        });
	    }
	    args(positional, named, loc) {
	        return new Args({
	            loc,
	            positional,
	            named
	        });
	    }
	    positional(exprs, loc) {
	        return new PositionalArguments({
	            loc,
	            exprs
	        });
	    }
	    namedArgument(key, value) {
	        return new NamedArgument({
	            name: key,
	            value
	        });
	    }
	    named(entries, loc) {
	        return new NamedArguments({
	            loc,
	            entries
	        });
	    }
	    attr({ name, value, trusting }, loc) {
	        return new HtmlAttr({
	            loc,
	            name,
	            value,
	            trusting
	        });
	    }
	    splatAttr(symbol, loc) {
	        return new SplatAttr({
	            symbol,
	            loc
	        });
	    }
	    arg({ name, value, trusting }, loc) {
	        return new ComponentArg({
	            name,
	            value,
	            trusting,
	            loc
	        });
	    }
	    // EXPRESSIONS //
	    path(head, tail, loc) {
	        return new PathExpression({
	            loc,
	            ref: head,
	            tail
	        });
	    }
	    keyword(name, symbol, loc) {
	        return new KeywordExpression({
	            loc,
	            name,
	            symbol
	        });
	    }
	    self(loc) {
	        return new ThisReference({
	            loc
	        });
	    }
	    at(name, symbol, loc) {
	        return new ArgReference({
	            loc,
	            name: new SourceSlice({
	                loc,
	                chars: name
	            }),
	            symbol
	        });
	    }
	    freeVar({ name, context, symbol, loc }) {
	        return new FreeVarReference({
	            name,
	            resolution: context,
	            symbol,
	            loc
	        });
	    }
	    localVar(name, symbol, isTemplateLocal, loc) {
	        return new LocalVarReference({
	            loc,
	            name,
	            isTemplateLocal,
	            symbol
	        });
	    }
	    sexp(parts, loc) {
	        return new CallExpression({
	            loc,
	            callee: parts.callee,
	            args: parts.args
	        });
	    }
	    interpolate(parts, loc) {
	        return new InterpolateExpression({
	            loc,
	            parts
	        });
	    }
	    literal(value, loc) {
	        return new LiteralExpression({
	            loc,
	            value
	        });
	    }
	    // STATEMENTS //
	    append({ table, trusting, value }, loc) {
	        return new AppendContent({
	            table,
	            trusting,
	            value,
	            loc
	        });
	    }
	    modifier({ callee, args }, loc) {
	        return new ElementModifier({
	            loc,
	            callee,
	            args
	        });
	    }
	    namedBlocks(blocks, loc) {
	        return new NamedBlocks({
	            loc,
	            blocks
	        });
	    }
	    blockStatement({ program, inverse = null, ...call }, loc) {
	        let blocksLoc = program.loc;
	        let blocks = [
	            this.namedBlock(SourceSlice.synthetic('default'), program, program.loc)
	        ];
	        if (inverse) {
	            blocksLoc = blocksLoc.extend(inverse.loc);
	            blocks.push(this.namedBlock(SourceSlice.synthetic('else'), inverse, inverse.loc));
	        }
	        return new InvokeBlock({
	            loc,
	            blocks: this.namedBlocks(blocks, blocksLoc),
	            callee: call.callee,
	            args: call.args
	        });
	    }
	    element(options) {
	        return new BuildElement(options);
	    }
	}
	class BuildElement {
	    constructor(base){
	        this.base = base;
	        this.builder = new Builder();
	    }
	    simple(tag, body, loc) {
	        return new SimpleElement(assign({
	            tag,
	            body,
	            componentArgs: [],
	            loc
	        }, this.base));
	    }
	    named(name, block, loc) {
	        return new NamedBlock(assign({
	            name,
	            block,
	            componentArgs: [],
	            loc
	        }, this.base));
	    }
	    selfClosingComponent(callee, loc) {
	        return new InvokeComponent(assign({
	            loc,
	            callee,
	            // point the empty named blocks at the `/` self-closing tag
	            blocks: new NamedBlocks({
	                blocks: [],
	                loc: loc.sliceEndChars({
	                    skipEnd: 1,
	                    chars: 1
	                })
	            })
	        }, this.base));
	    }
	    componentWithDefaultBlock(callee, children, symbols, loc) {
	        let block = this.builder.block(symbols, children, loc);
	        let namedBlock = this.builder.namedBlock(SourceSlice.synthetic('default'), block, loc); // BUILDER.simpleNamedBlock('default', children, symbols, loc);
	        return new InvokeComponent(assign({
	            loc,
	            callee,
	            blocks: this.builder.namedBlocks([
	                namedBlock
	            ], namedBlock.loc)
	        }, this.base));
	    }
	    componentWithNamedBlocks(callee, blocks, loc) {
	        return new InvokeComponent(assign({
	            loc,
	            callee,
	            blocks: this.builder.namedBlocks(blocks, SpanList.range(blocks))
	        }, this.base));
	    }
	}

	function SexpSyntaxContext(node) {
	    if (isSimpleCallee(node)) {
	        return LooseModeResolution.namespaced(HELPER_NAMESPACE);
	    } else {
	        return null;
	    }
	}
	function ModifierSyntaxContext(node) {
	    if (isSimpleCallee(node)) {
	        return LooseModeResolution.namespaced(MODIFIER_NAMESPACE);
	    } else {
	        return null;
	    }
	}
	function BlockSyntaxContext(node) {
	    if (isSimpleCallee(node)) {
	        return LooseModeResolution.namespaced(COMPONENT_NAMESPACE);
	    } else {
	        return null;
	    }
	}
	function ComponentSyntaxContext(node) {
	    if (isSimplePath(node)) {
	        return LooseModeResolution.namespaced(COMPONENT_NAMESPACE, true);
	    } else {
	        return null;
	    }
	}
	/**
	 * This corresponds to attribute curlies (<Foo bar={{...}}>).
	 * In strict mode, this also corresponds to arg curlies.
	 */ function AttrValueSyntaxContext(node) {
	    if (isSimpleCallee(node)) {
	        return LooseModeResolution.namespaced(HELPER_NAMESPACE);
	    } else {
	        return null;
	    }
	}
	/**
	 * This corresponds to append positions text curlies.
	 */ function AppendSyntaxContext(node) {
	    let isSimple = isSimpleCallee(node);
	    let trusting = node.trusting;
	    if (isSimple) {
	        return trusting ? LooseModeResolution.trustingAppend() : LooseModeResolution.append();
	    } else {
	        return null;
	    }
	}
	// UTILITIES
	/**
	 * A call node has a simple callee if its head is:
	 *
	 * - a `PathExpression`
	 * - the `PathExpression`'s head is a `VarHead`
	 * - it has no tail
	 *
	 * Simple heads:
	 *
	 * ```
	 * {{x}}
	 * {{x y}}
	 * ```
	 *
	 * Not simple heads:
	 *
	 * ```
	 * {{x.y}}
	 * {{x.y z}}
	 * {{@x}}
	 * {{@x a}}
	 * {{this}}
	 * {{this a}}
	 * ```
	 */ function isSimpleCallee(node) {
	    return isSimplePath(node.path);
	}
	function isSimplePath(node) {
	    if (node.type === 'PathExpression' && node.head.type === 'VarHead') {
	        return node.tail.length === 0;
	    } else {
	        return false;
	    }
	}

	function normalize(source, options = {
	    lexicalScope: ()=>false
	}) {
	    let ast = preprocess(source, options);
	    let normalizeOptions = {
	        strictMode: false,
	        ...options,
	        locals: ast.blockParams,
	        keywords: options.keywords ?? []
	    };
	    let top = SymbolTable.top(normalizeOptions.locals, normalizeOptions.keywords, {
	        customizeComponentName: options.customizeComponentName ?? ((name)=>name),
	        lexicalScope: options.lexicalScope
	    });
	    let block = new BlockContext(source, normalizeOptions, top);
	    let normalizer = new StatementNormalizer(block);
	    let astV2 = new TemplateChildren(block.loc(ast.loc), ast.body.map((b)=>normalizer.normalize(b)), block).assertTemplate(top);
	    let locals = top.getUsedTemplateLocals();
	    return [
	        astV2,
	        locals
	    ];
	}
	/**
	 * A `BlockContext` represents the block that a particular AST node is contained inside of.
	 *
	 * `BlockContext` is aware of template-wide options (such as strict mode), as well as the bindings
	 * that are in-scope within that block.
	 *
	 * Concretely, it has the `PrecompileOptions` and current `SymbolTable`, and provides
	 * facilities for working with those options.
	 *
	 * `BlockContext` is stateless.
	 */ class BlockContext {
	    constructor(source, options, table){
	        this.source = source;
	        this.options = options;
	        this.table = table;
	        this.builder = new Builder();
	    }
	    get strict() {
	        return this.options.strictMode || false;
	    }
	    loc(loc) {
	        return this.source.spanFor(loc);
	    }
	    resolutionFor(node, resolution) {
	        if (this.strict) {
	            return {
	                result: STRICT_RESOLUTION
	            };
	        }
	        if (this.isFreeVar(node)) {
	            let r = resolution(node);
	            if (r === null) {
	                return {
	                    result: 'error',
	                    path: printPath(node),
	                    head: printHead(node)
	                };
	            }
	            return {
	                result: r
	            };
	        } else {
	            return {
	                result: STRICT_RESOLUTION
	            };
	        }
	    }
	    isLexicalVar(variable) {
	        return this.table.hasLexical(variable);
	    }
	    isKeyword(name) {
	        return this.strict && !this.table.hasLexical(name) && this.table.hasKeyword(name);
	    }
	    isFreeVar(callee) {
	        if (callee.type === 'PathExpression') {
	            if (callee.head.type !== 'VarHead') {
	                return false;
	            }
	            return !this.table.has(callee.head.name);
	        } else if (callee.path.type === 'PathExpression') {
	            return this.isFreeVar(callee.path);
	        } else {
	            return false;
	        }
	    }
	    hasBinding(name) {
	        return this.table.has(name) || this.table.hasLexical(name);
	    }
	    child(blockParams) {
	        return new BlockContext(this.source, this.options, this.table.child(blockParams));
	    }
	    customizeComponentName(input) {
	        if (this.options.customizeComponentName) {
	            return this.options.customizeComponentName(input);
	        } else {
	            return input;
	        }
	    }
	}
	/**
	 * An `ExpressionNormalizer` normalizes expressions within a block.
	 *
	 * `ExpressionNormalizer` is stateless.
	 */ class ExpressionNormalizer {
	    constructor(block){
	        this.block = block;
	    }
	    normalize(expr, resolution) {
	        switch(expr.type){
	            case 'NullLiteral':
	            case 'BooleanLiteral':
	            case 'NumberLiteral':
	            case 'StringLiteral':
	            case 'UndefinedLiteral':
	                return this.block.builder.literal(expr.value, this.block.loc(expr.loc));
	            case 'PathExpression':
	                return this.path(expr, resolution);
	            case 'SubExpression':
	                {
	                    // expr.path used to incorrectly have the type ASTv1.Expression
	                    if (isLiteral(expr.path)) {
	                        assertIllegalLiteral(expr.path, expr.loc);
	                    }
	                    let resolution = this.block.resolutionFor(expr, SexpSyntaxContext);
	                    if (resolution.result === 'error') {
	                        throw generateSyntaxError(`You attempted to invoke a path (\`${resolution.path}\`) but ${resolution.head} was not in scope`, expr.loc);
	                    }
	                    return this.block.builder.sexp(this.callParts(expr, resolution.result), this.block.loc(expr.loc));
	                }
	        }
	    }
	    path(expr, resolution) {
	        let loc = this.block.loc(expr.loc);
	        if (expr.head.type === 'VarHead' && expr.tail.length === 0 && this.block.isKeyword(expr.head.name)) {
	            return this.block.builder.keyword(expr.head.name, this.block.table.getKeyword(expr.head.name), loc);
	        }
	        let headOffsets = this.block.loc(expr.head.loc);
	        let tail = [];
	        // start with the head
	        let offset = headOffsets;
	        for (let part of expr.tail){
	            offset = offset.sliceStartChars({
	                chars: part.length,
	                skipStart: 1
	            });
	            tail.push(new SourceSlice({
	                loc: offset,
	                chars: part
	            }));
	        }
	        return this.block.builder.path(this.ref(expr.head, resolution), tail, loc);
	    }
	    /**
	   * The `callParts` method takes ASTv1.CallParts as well as a syntax context and normalizes
	   * it to an ASTv2 CallParts.
	   */ callParts(parts, context) {
	        let { path, params, hash, loc } = parts;
	        let callee = this.normalize(path, context);
	        let paramList = params.map((p)=>this.normalize(p, STRICT_RESOLUTION));
	        let paramLoc = SpanList.range(paramList, callee.loc.collapse('end'));
	        let namedLoc = this.block.loc(hash.loc);
	        let argsLoc = SpanList.range([
	            paramLoc,
	            namedLoc
	        ]);
	        let positional = this.block.builder.positional(params.map((p)=>this.normalize(p, STRICT_RESOLUTION)), paramLoc);
	        let named = this.block.builder.named(hash.pairs.map((p)=>this.namedArgument(p)), this.block.loc(hash.loc));
	        switch(callee.type){
	            case 'Literal':
	                throw generateSyntaxError(`Invalid invocation of a literal value (\`${callee.value}\`)`, loc);
	            // This really shouldn't be possible, something has gone pretty wrong
	            case 'Interpolate':
	                throw generateSyntaxError(`Invalid invocation of a interpolated string`, loc);
	        }
	        return {
	            callee,
	            args: this.block.builder.args(positional, named, argsLoc)
	        };
	    }
	    namedArgument(pair) {
	        let offsets = this.block.loc(pair.loc);
	        let keyOffsets = offsets.sliceStartChars({
	            chars: pair.key.length
	        });
	        return this.block.builder.namedArgument(new SourceSlice({
	            chars: pair.key,
	            loc: keyOffsets
	        }), this.normalize(pair.value, STRICT_RESOLUTION));
	    }
	    /**
	   * The `ref` method normalizes an `ASTv1.PathHead` into an `ASTv2.VariableReference`.
	   * This method is extremely important, because it is responsible for normalizing free
	   * variables into an an ASTv2.PathHead *with appropriate context*.
	   *
	   * The syntax context is originally determined by the syntactic position that this `PathHead`
	   * came from, and is ultimately attached to the `ASTv2.VariableReference` here. In ASTv2,
	   * the `VariableReference` node bears full responsibility for loose mode rules that control
	   * the behavior of free variables.
	   */ ref(head, resolution) {
	        let { block } = this;
	        let { builder, table } = block;
	        let offsets = block.loc(head.loc);
	        switch(head.type){
	            case 'ThisHead':
	                if (block.hasBinding('this')) {
	                    let [symbol, isRoot] = table.get('this');
	                    return block.builder.localVar('this', symbol, isRoot, offsets);
	                }
	                return builder.self(offsets);
	            case 'AtHead':
	                {
	                    let symbol = table.allocateNamed(head.name);
	                    return builder.at(head.name, symbol, offsets);
	                }
	            case 'VarHead':
	                {
	                    if (block.hasBinding(head.name)) {
	                        let [symbol, isRoot] = table.get(head.name);
	                        return block.builder.localVar(head.name, symbol, isRoot, offsets);
	                    } else {
	                        let context = block.strict ? STRICT_RESOLUTION : resolution;
	                        let symbol = block.table.allocateFree(head.name, context);
	                        return block.builder.freeVar({
	                            name: head.name,
	                            context,
	                            symbol,
	                            loc: offsets
	                        });
	                    }
	                }
	        }
	    }
	}
	/**
	 * `TemplateNormalizer` normalizes top-level ASTv1 statements to ASTv2.
	 */ class StatementNormalizer {
	    constructor(block){
	        this.block = block;
	    }
	    normalize(node) {
	        switch(node.type){
	            case 'BlockStatement':
	                return this.BlockStatement(node);
	            case 'ElementNode':
	                return new ElementNormalizer(this.block).ElementNode(node);
	            case 'MustacheStatement':
	                return this.MustacheStatement(node);
	            // These are the same in ASTv2
	            case 'MustacheCommentStatement':
	                return this.MustacheCommentStatement(node);
	            case 'CommentStatement':
	                {
	                    let loc = this.block.loc(node.loc);
	                    return new HtmlComment({
	                        loc,
	                        text: loc.slice({
	                            skipStart: 4,
	                            skipEnd: 3
	                        }).toSlice(node.value)
	                    });
	                }
	            case 'TextNode':
	                return new HtmlText({
	                    loc: this.block.loc(node.loc),
	                    chars: node.chars
	                });
	        }
	    }
	    MustacheCommentStatement(node) {
	        let loc = this.block.loc(node.loc);
	        // If someone cares for these cases to have the right loc, feel free to attempt:
	        // {{!}} {{~!}} {{!~}} {{~!~}}
	        // {{!-}} {{~!-}} {{!-~}} {{~!-~}}
	        // {{!--}} {{~!--}} {{!--~}} {{~!--~}}
	        // {{!---}} {{~!---}} {{!---~}} {{~!---~}}
	        // {{!----}} {{~!----}} {{!----~}} {{~!----~}}
	        if (node.value === '') {
	            return new GlimmerComment({
	                loc,
	                text: SourceSlice.synthetic('')
	            });
	        }
	        let source = loc.asString();
	        let span = loc;
	        if (node.value.startsWith('-')) {
	            span = span.sliceStartChars({
	                skipStart: source.startsWith('{{~') ? 6 : 5,
	                chars: node.value.length
	            });
	        } else if (node.value.endsWith('-')) {
	            const skipEnd = source.endsWith('~}}') ? 5 : 4;
	            const skipStart = source.length - node.value.length - skipEnd;
	            span = span.slice({
	                skipStart,
	                skipEnd
	            });
	        } else {
	            span = span.sliceStartChars({
	                skipStart: source.lastIndexOf(node.value),
	                chars: node.value.length
	            });
	        }
	        return new GlimmerComment({
	            loc,
	            text: span.toSlice(node.value)
	        });
	    }
	    /**
	   * Normalizes an ASTv1.MustacheStatement to an ASTv2.AppendStatement
	   */ MustacheStatement(mustache) {
	        let { path, params, hash, trusting } = mustache;
	        let loc = this.block.loc(mustache.loc);
	        let value;
	        if (isLiteral(path)) {
	            if (params.length === 0 && hash.pairs.length === 0) {
	                value = this.expr.normalize(path);
	            } else {
	                assertIllegalLiteral(path, loc);
	            }
	        } else {
	            let resolution = this.block.resolutionFor(mustache, AppendSyntaxContext);
	            if (resolution.result === 'error') {
	                throw generateSyntaxError(`You attempted to render a path (\`{{${resolution.path}}}\`), but ${resolution.head} was not in scope`, loc);
	            }
	            // Normalize the call parts in AppendSyntaxContext
	            let callParts = this.expr.callParts({
	                path,
	                params,
	                hash,
	                loc
	            }, resolution.result);
	            value = callParts.args.isEmpty() ? callParts.callee : this.block.builder.sexp(callParts, loc);
	        }
	        return this.block.builder.append({
	            table: this.block.table,
	            trusting,
	            value
	        }, loc);
	    }
	    /**
	   * Normalizes a ASTv1.BlockStatement to an ASTv2.BlockStatement
	   */ BlockStatement(block) {
	        let { program, inverse } = block;
	        let loc = this.block.loc(block.loc);
	        // block.path used to incorrectly have the type ASTv1.Expression
	        if (isLiteral(block.path)) {
	            assertIllegalLiteral(block.path, loc);
	        }
	        let resolution = this.block.resolutionFor(block, BlockSyntaxContext);
	        if (resolution.result === 'error') {
	            throw generateSyntaxError(`You attempted to invoke a path (\`{{#${resolution.path}}}\`) but ${resolution.head} was not in scope`, loc);
	        }
	        let callParts = this.expr.callParts(block, resolution.result);
	        return this.block.builder.blockStatement(assign({
	            symbols: this.block.table,
	            program: this.Block(program),
	            inverse: inverse ? this.Block(inverse) : null
	        }, callParts), loc);
	    }
	    Block({ body, loc, blockParams }) {
	        let child = this.block.child(blockParams);
	        let normalizer = new StatementNormalizer(child);
	        return new BlockChildren(this.block.loc(loc), body.map((b)=>normalizer.normalize(b)), this.block).assertBlock(child.table);
	    }
	    get expr() {
	        return new ExpressionNormalizer(this.block);
	    }
	}
	class ElementNormalizer {
	    constructor(ctx){
	        this.ctx = ctx;
	    }
	    /**
	   * Normalizes an ASTv1.ElementNode to:
	   *
	   * - ASTv2.NamedBlock if the tag name begins with `:`
	   * - ASTv2.Component if the tag name matches the component heuristics
	   * - ASTv2.SimpleElement if the tag name doesn't match the component heuristics
	   *
	   * A tag name represents a component if:
	   *
	   * - it begins with `@`
	   * - it is exactly `this` or begins with `this.`
	   * - the part before the first `.` is a reference to an in-scope variable binding
	   * - it begins with an uppercase character
	   */ ElementNode(element) {
	        let { tag, selfClosing, comments } = element;
	        let loc = this.ctx.loc(element.loc);
	        let [tagHead, ...rest] = asPresentArray(tag.split('.'));
	        // the head, attributes and modifiers are in the current scope
	        let path = this.classifyTag(tagHead, rest, element.loc);
	        let attrs = element.attributes.filter((a)=>a.name[0] !== '@').map((a)=>this.attr(a));
	        let args = element.attributes.filter((a)=>a.name[0] === '@').map((a)=>this.arg(a));
	        let modifiers = element.modifiers.map((m)=>this.modifier(m));
	        // the element's block params are in scope for the children
	        let child = this.ctx.child(element.blockParams);
	        let normalizer = new StatementNormalizer(child);
	        let childNodes = element.children.map((s)=>normalizer.normalize(s));
	        let el = this.ctx.builder.element({
	            selfClosing,
	            attrs,
	            componentArgs: args,
	            modifiers,
	            comments: comments.map((c)=>new StatementNormalizer(this.ctx).MustacheCommentStatement(c))
	        });
	        let children = new ElementChildren(el, loc, childNodes, this.ctx);
	        let offsets = this.ctx.loc(element.loc);
	        let tagOffsets = offsets.sliceStartChars({
	            chars: tag.length,
	            skipStart: 1
	        });
	        if (path === 'ElementHead') {
	            if (tag[0] === ':') {
	                return children.assertNamedBlock(tagOffsets.slice({
	                    skipStart: 1
	                }).toSlice(tag.slice(1)), child.table);
	            } else {
	                return children.assertElement(tagOffsets.toSlice(tag), element.blockParams.length > 0);
	            }
	        }
	        if (element.selfClosing) {
	            return el.selfClosingComponent(path, loc);
	        } else {
	            let blocks = children.assertComponent(tag, child.table, element.blockParams.length > 0);
	            return el.componentWithNamedBlocks(path, blocks, loc);
	        }
	    }
	    modifier(m) {
	        // modifier.path used to incorrectly have the type ASTv1.Expression
	        if (isLiteral(m.path)) {
	            assertIllegalLiteral(m.path, m.loc);
	        }
	        let resolution = this.ctx.resolutionFor(m, ModifierSyntaxContext);
	        if (resolution.result === 'error') {
	            throw generateSyntaxError(`You attempted to invoke a path (\`{{${resolution.path}}}\`) as a modifier, but ${resolution.head} was not in scope`, m.loc);
	        }
	        let callParts = this.expr.callParts(m, resolution.result);
	        return this.ctx.builder.modifier(callParts, this.ctx.loc(m.loc));
	    }
	    /**
	   * This method handles attribute values that are curlies, as well as curlies nested inside of
	   * interpolations:
	   *
	   * ```hbs
	   * <a href={{url}} />
	   * <a href="{{url}}.html" />
	   * ```
	   */ mustacheAttr(mustache) {
	        let { path, params, hash, loc } = mustache;
	        if (isLiteral(path)) {
	            if (params.length === 0 && hash.pairs.length === 0) {
	                return this.expr.normalize(path);
	            } else {
	                assertIllegalLiteral(path, loc);
	            }
	        }
	        // Normalize the call parts in AttrValueSyntaxContext
	        let resolution = this.ctx.resolutionFor(mustache, AttrValueSyntaxContext);
	        if (resolution.result === 'error') {
	            throw generateSyntaxError(`You attempted to render a path (\`{{${resolution.path}}}\`), but ${resolution.head} was not in scope`, mustache.loc);
	        }
	        let sexp = this.ctx.builder.sexp(this.expr.callParts(mustache, resolution.result), this.ctx.loc(mustache.loc));
	        // If there are no params or hash, just return the function part as its own expression
	        if (sexp.args.isEmpty()) {
	            return sexp.callee;
	        } else {
	            return sexp;
	        }
	    }
	    /**
	   * attrPart is the narrowed down list of valid attribute values that are also
	   * allowed as a concat part (you can't nest concats).
	   */ attrPart(part) {
	        switch(part.type){
	            case 'MustacheStatement':
	                return {
	                    expr: this.mustacheAttr(part),
	                    trusting: part.trusting
	                };
	            case 'TextNode':
	                return {
	                    expr: this.ctx.builder.literal(part.chars, this.ctx.loc(part.loc)),
	                    trusting: true
	                };
	        }
	    }
	    attrValue(part) {
	        switch(part.type){
	            case 'ConcatStatement':
	                {
	                    let parts = part.parts.map((p)=>this.attrPart(p).expr);
	                    return {
	                        expr: this.ctx.builder.interpolate(parts, this.ctx.loc(part.loc)),
	                        trusting: false
	                    };
	                }
	            default:
	                return this.attrPart(part);
	        }
	    }
	    attr(m) {
	        if (m.name === '...attributes') {
	            return this.ctx.builder.splatAttr(this.ctx.table.allocateBlock('attrs'), this.ctx.loc(m.loc));
	        }
	        let offsets = this.ctx.loc(m.loc);
	        let nameSlice = offsets.sliceStartChars({
	            chars: m.name.length
	        }).toSlice(m.name);
	        let value = this.attrValue(m.value);
	        return this.ctx.builder.attr({
	            name: nameSlice,
	            value: value.expr,
	            trusting: value.trusting
	        }, offsets);
	    }
	    // An arg curly <Foo @bar={{...}} /> is the same as an attribute curly for
	    // our purposes, except that in loose mode <Foo @bar={{baz}} /> is an error:
	    checkArgCall(arg) {
	        let { value } = arg;
	        if (value.type !== 'MustacheStatement') {
	            return;
	        }
	        if (value.params.length !== 0 || value.hash.pairs.length !== 0) {
	            return;
	        }
	        let { path } = value;
	        if (path.type !== 'PathExpression') {
	            return;
	        }
	        if (path.tail.length > 0) {
	            return;
	        }
	        let resolution = this.ctx.resolutionFor(path, ()=>{
	            // We deliberately don't want this to resolve anything. The purpose of
	            // calling `resolutionFor` here is to check for strict mode, in-scope
	            // local variables, etc.
	            return null;
	        });
	        if (resolution.result === 'error' && resolution.path !== 'has-block') {
	            throw generateSyntaxError(`You attempted to pass a path as argument (\`${arg.name}={{${resolution.path}}}\`) but ${resolution.head} was not in scope. Try:\n` + `* \`${arg.name}={{this.${resolution.path}}}\` if this is meant to be a property lookup, or\n` + `* \`${arg.name}={{(${resolution.path})}}\` if this is meant to invoke the resolved helper, or\n` + `* \`${arg.name}={{helper "${resolution.path}"}}\` if this is meant to pass the resolved helper by value`, arg.loc);
	        }
	    }
	    arg(arg) {
	        this.checkArgCall(arg);
	        let offsets = this.ctx.loc(arg.loc);
	        let nameSlice = offsets.sliceStartChars({
	            chars: arg.name.length
	        }).toSlice(arg.name);
	        let value = this.attrValue(arg.value);
	        return this.ctx.builder.arg({
	            name: nameSlice,
	            value: value.expr,
	            trusting: value.trusting
	        }, offsets);
	    }
	    /**
	   * This function classifies the head of an ASTv1.Element into an ASTv2.PathHead (if the
	   * element is a component) or `'ElementHead'` (if the element is a simple element).
	   *
	   * Rules:
	   *
	   * 1. If the variable is an `@arg`, return an `AtHead`
	   * 2. If the variable is `this`, return a `ThisHead`
	   * 3. If the variable is in the current scope:
	   *   a. If the scope is the root scope, then return a Free `LocalVarHead`
	   *   b. Else, return a standard `LocalVarHead`
	   * 4. If the tag name is a path and the variable is not in the current scope, Syntax Error
	   * 5. If the variable is uppercase return a FreeVar(ResolveAsComponentHead)
	   * 6. Otherwise, return `'ElementHead'`
	   */ classifyTag(variable, tail, loc) {
	        let uppercase = isUpperCase(variable);
	        let inScope = variable[0] === '@' || variable === 'this' || this.ctx.hasBinding(variable);
	        if (this.ctx.strict && !inScope) {
	            if (uppercase) {
	                throw generateSyntaxError(`Attempted to invoke a component that was not in scope in a strict mode template, \`<${variable}>\`. If you wanted to create an element with that name, convert it to lowercase - \`<${variable.toLowerCase()}>\``, loc);
	            }
	            // In strict mode, values are always elements unless they are in scope
	            return 'ElementHead';
	        }
	        // Since the parser handed us the HTML element name as a string, we need
	        // to convert it into an ASTv1 path so it can be processed using the
	        // expression normalizer.
	        let isComponent = inScope || uppercase;
	        let variableLoc = loc.sliceStartChars({
	            skipStart: 1,
	            chars: variable.length
	        });
	        let tailLength = tail.reduce((accum, part)=>accum + 1 + part.length, 0);
	        let pathEnd = variableLoc.getEnd().move(tailLength);
	        let pathLoc = variableLoc.withEnd(pathEnd);
	        if (isComponent) {
	            let path = b.path({
	                head: b.head({
	                    original: variable,
	                    loc: variableLoc
	                }),
	                tail,
	                loc: pathLoc
	            });
	            let resolution = this.ctx.isLexicalVar(variable) ? {
	                result: STRICT_RESOLUTION
	            } : this.ctx.resolutionFor(path, ComponentSyntaxContext);
	            if (resolution.result === 'error') {
	                throw generateSyntaxError(`You attempted to invoke a path (\`<${resolution.path}>\`) but ${resolution.head} was not in scope`, loc);
	            }
	            return new ExpressionNormalizer(this.ctx).normalize(path, resolution.result);
	        } else {
	            this.ctx.table.allocateFree(variable, STRICT_RESOLUTION);
	        }
	        // If the tag name wasn't a valid component but contained a `.`, it's
	        // a syntax error.
	        if (tail.length > 0) {
	            throw generateSyntaxError(`You used ${variable}.${tail.join('.')} as a tag name, but ${variable} is not in scope`, loc);
	        }
	        return 'ElementHead';
	    }
	    get expr() {
	        return new ExpressionNormalizer(this.ctx);
	    }
	}
	class Children {
	    constructor(loc, children, block){
	        this.loc = loc;
	        this.children = children;
	        this.block = block;
	        this.namedBlocks = children.filter((c)=>c instanceof NamedBlock);
	        this.hasSemanticContent = Boolean(children.filter((c)=>{
	            if (c instanceof NamedBlock) {
	                return false;
	            }
	            switch(c.type){
	                case 'GlimmerComment':
	                case 'HtmlComment':
	                    return false;
	                case 'HtmlText':
	                    return !/^\s*$/u.test(c.chars);
	                default:
	                    return true;
	            }
	        }).length);
	        this.nonBlockChildren = children.filter((c)=>!(c instanceof NamedBlock));
	    }
	}
	class TemplateChildren extends Children {
	    assertTemplate(table) {
	        if (isPresentArray(this.namedBlocks)) {
	            throw generateSyntaxError(`Unexpected named block at the top-level of a template`, this.loc);
	        }
	        return this.block.builder.template(table, this.nonBlockChildren, this.block.loc(this.loc));
	    }
	}
	class BlockChildren extends Children {
	    assertBlock(table) {
	        if (isPresentArray(this.namedBlocks)) {
	            throw generateSyntaxError(`Unexpected named block nested in a normal block`, this.loc);
	        }
	        return this.block.builder.block(table, this.nonBlockChildren, this.loc);
	    }
	}
	class ElementChildren extends Children {
	    constructor(el, loc, children, block){
	        super(loc, children, block), this.el = el;
	    }
	    assertNamedBlock(name, table) {
	        if (this.el.base.selfClosing) {
	            throw generateSyntaxError(`<:${name.chars}/> is not a valid named block: named blocks cannot be self-closing`, this.loc);
	        }
	        if (isPresentArray(this.namedBlocks)) {
	            throw generateSyntaxError(`Unexpected named block inside <:${name.chars}> named block: named blocks cannot contain nested named blocks`, this.loc);
	        }
	        if (!isLowerCase(name.chars)) {
	            throw generateSyntaxError(`<:${name.chars}> is not a valid named block, and named blocks must begin with a lowercase letter`, this.loc);
	        }
	        if (this.el.base.attrs.length > 0 || this.el.base.componentArgs.length > 0 || this.el.base.modifiers.length > 0) {
	            throw generateSyntaxError(`named block <:${name.chars}> cannot have attributes, arguments, or modifiers`, this.loc);
	        }
	        let offsets = SpanList.range(this.nonBlockChildren, this.loc);
	        return this.block.builder.namedBlock(name, this.block.builder.block(table, this.nonBlockChildren, offsets), this.loc);
	    }
	    assertElement(name, hasBlockParams) {
	        if (hasBlockParams) {
	            throw generateSyntaxError(`Unexpected block params in <${name.chars}>: simple elements cannot have block params`, this.loc);
	        }
	        if (isPresentArray(this.namedBlocks)) {
	            let names = this.namedBlocks.map((b)=>b.name);
	            if (names.length === 1) {
	                throw generateSyntaxError(`Unexpected named block <:foo> inside <${name.chars}> HTML element`, this.loc);
	            } else {
	                let printedNames = names.map((n)=>`<:${n.chars}>`).join(', ');
	                throw generateSyntaxError(`Unexpected named blocks inside <${name.chars}> HTML element (${printedNames})`, this.loc);
	            }
	        }
	        return this.el.simple(name, this.nonBlockChildren, this.loc);
	    }
	    assertComponent(name, table, hasBlockParams) {
	        if (isPresentArray(this.namedBlocks) && this.hasSemanticContent) {
	            throw generateSyntaxError(`Unexpected content inside <${name}> component invocation: when using named blocks, the tag cannot contain other content`, this.loc);
	        }
	        if (isPresentArray(this.namedBlocks)) {
	            if (hasBlockParams) {
	                throw generateSyntaxError(`Unexpected block params list on <${name}> component invocation: when passing named blocks, the invocation tag cannot take block params`, this.loc);
	            }
	            let seenNames = new Set();
	            for (let block of this.namedBlocks){
	                let name = block.name.chars;
	                if (seenNames.has(name)) {
	                    throw generateSyntaxError(`Component had two named blocks with the same name, \`<:${name}>\`. Only one block with a given name may be passed`, this.loc);
	                }
	                if (name === 'inverse' && seenNames.has('else') || name === 'else' && seenNames.has('inverse')) {
	                    throw generateSyntaxError(`Component has both <:else> and <:inverse> block. <:inverse> is an alias for <:else>`, this.loc);
	                }
	                seenNames.add(name);
	            }
	            return this.namedBlocks;
	        } else {
	            return [
	                this.block.builder.namedBlock(SourceSlice.synthetic('default'), this.block.builder.block(table, this.nonBlockChildren, this.loc), this.loc)
	            ];
	        }
	    }
	}
	function isLiteral(node) {
	    switch(node.type){
	        case 'StringLiteral':
	        case 'BooleanLiteral':
	        case 'NumberLiteral':
	        case 'UndefinedLiteral':
	        case 'NullLiteral':
	            return true;
	        default:
	            return false;
	    }
	}
	function assertIllegalLiteral(node, loc) {
	    let value = node.type === 'StringLiteral' ? JSON.stringify(node.value) : String(node.value);
	    throw generateSyntaxError(`Unexpected literal \`${value}\``, loc);
	}
	function printPath(node) {
	    if (node.type !== 'PathExpression' && node.path.type === 'PathExpression') {
	        return printPath(node.path);
	    } else {
	        return new Printer({
	            entityEncoding: 'raw'
	        }).print(node);
	    }
	}
	function printHead(node) {
	    if (node.type === 'PathExpression') {
	        return node.head.original;
	    } else if (node.path.type === 'PathExpression') {
	        return printHead(node.path);
	    } else {
	        return new Printer({
	            entityEncoding: 'raw'
	        }).print(node);
	    }
	}

	dev.ASTv2 = api;
	dev.BlockSymbolTable = BlockSymbolTable;
	dev.KEYWORDS_TYPES = KEYWORDS_TYPES;
	dev.Path = Walker;
	dev.ProgramSymbolTable = ProgramSymbolTable;
	dev.SourceSlice = SourceSlice;
	dev.SpanList = SpanList;
	dev.SymbolTable = SymbolTable;
	dev.Walker = Walker;
	dev.WalkerPath = WalkerPath;
	dev.builders = publicBuilder;
	dev.cannotRemoveNode = cannotRemoveNode;
	dev.cannotReplaceNode = cannotReplaceNode;
	dev.generateSyntaxError = generateSyntaxError;
	dev.getTemplateLocals = getTemplateLocals;
	dev.getVoidTags = getVoidTags;
	dev.hasSpan = hasSpan;
	dev.isKeyword = isKeyword;
	dev.isVoidTag = isVoidTag;
	dev.loc = loc;
	dev.maybeLoc = maybeLoc;
	dev.node = node;
	dev.normalize = normalize;
	dev.preprocess = preprocess;
	dev.print = build;
	dev.sortByLoc = sortByLoc;
	dev.src = api$1;
	dev.traverse = traverse;
	dev.visitorKeys = visitorKeys;
	
	return dev;
}

var publicTypes = {};

var hasRequiredPublicTypes;

function requirePublicTypes () {
	if (hasRequiredPublicTypes) return publicTypes;
	hasRequiredPublicTypes = 1;

	Object.defineProperty(publicTypes, "__esModule", {
	  value: true
	});
	return publicTypes;
}

var hasRequiredPlugin;

function requirePlugin () {
	if (hasRequiredPlugin) return plugin$2;
	hasRequiredPlugin = 1;
	(function (exports) {

		var __createBinding = plugin$2 && plugin$2.__createBinding || (Object.create ? function (o, m, k, k2) {
		  if (k2 === undefined) k2 = k;
		  var desc = Object.getOwnPropertyDescriptor(m, k);
		  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		    desc = {
		      enumerable: true,
		      get: function () {
		        return m[k];
		      }
		    };
		  }
		  Object.defineProperty(o, k2, desc);
		} : function (o, m, k, k2) {
		  if (k2 === undefined) k2 = k;
		  o[k2] = m[k];
		});
		var __exportStar = plugin$2 && plugin$2.__exportStar || function (m, exports) {
		  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.makePlugin = makePlugin;
		const babel_import_util_1 = /*@__PURE__*/ requireSrc();
		const expression_parser_1 = /*@__PURE__*/ requireExpressionParser();
		const js_utils_1 = /*@__PURE__*/ requireJsUtils();
		const scope_locals_1 = /*@__PURE__*/ requireScopeLocals();
		const syntax_1 = /*@__PURE__*/ requireDev();
		__exportStar(/*@__PURE__*/ requirePublicTypes(), exports);
		const INLINE_PRECOMPILE_MODULES = [{
		  moduleName: 'ember-cli-htmlbars',
		  export: 'hbs',
		  allowTemplateLiteral: true
		}, {
		  moduleName: 'ember-cli-htmlbars-inline-precompile',
		  export: 'default',
		  allowTemplateLiteral: true
		}, {
		  moduleName: 'htmlbars-inline-precompile',
		  export: 'default',
		  allowTemplateLiteral: true
		}, {
		  moduleName: '@ember/template-compilation',
		  export: 'precompileTemplate',
		  enableScope: true
		}, {
		  moduleName: '@ember/template-compiler',
		  export: 'template',
		  enableScope: true,
		  rfc931Support: 'polyfilled'
		}];
		function normalizeOpts(options) {
		  var _a;
		  if (((_a = options.targetFormat) !== null && _a !== void 0 ? _a : 'wire') === 'wire') {
		    let {
		      compiler
		    } = options;
		    if (!compiler) {
		      throw new Error(`when targetFormat==="wire" you must set the compiler or compilerPath option`);
		    }
		    return Object.assign(Object.assign({
		      outputModuleOverrides: {},
		      enableLegacyModules: [],
		      transforms: []
		    }, options), {
		      targetFormat: 'wire',
		      compiler
		    });
		  } else {
		    return Object.assign(Object.assign({
		      outputModuleOverrides: {},
		      enableLegacyModules: [],
		      transforms: []
		    }, options), {
		      targetFormat: 'hbs'
		    });
		  }
		}
		function makePlugin(loadOptions) {
		  return function htmlbarsInlinePrecompile(babel) {
		    const plugin = {
		      visitor: {
		        Program: {
		          enter(path, state) {
		            state.normalizedOpts = normalizeOpts(loadOptions(state.opts));
		            state.templateFactory = templateFactoryConfig(state.normalizedOpts);
		            state.util = new babel_import_util_1.ImportUtil(babel, path);
		            state.program = path;
		            state.recursionGuard = new Set();
		          },
		          exit(_path, state) {
		            if (state.normalizedOpts.targetFormat === 'wire') {
		              for (let {
		                moduleName,
		                export: exportName
		              } of configuredModules(state)) {
		                state.util.removeImport(moduleName, exportName);
		              }
		            }
		          }
		        },
		        TaggedTemplateExpression(path, state) {
		          let tagPath = path.get('tag');
		          if (!tagPath.isIdentifier()) {
		            return;
		          }
		          let config = referencesInlineCompiler(tagPath, state);
		          if (!config) {
		            return;
		          }
		          if (!config.allowTemplateLiteral) {
		            throw path.buildCodeFrameError(`Attempted to use \`${tagPath.node.name}\` as a template tag, but it can only be called as a function with a string passed to it: ${tagPath.node.name}('content here')`);
		          }
		          if (path.node.quasi.expressions.length) {
		            throw path.buildCodeFrameError('placeholders inside a tagged template string are not supported');
		          }
		          let template = path.node.quasi.quasis.map(quasi => quasi.value.cooked).join('');
		          if (state.normalizedOpts.targetFormat === 'wire') {
		            insertCompiledTemplate(babel, state, state.normalizedOpts, template, path, {}, config, undefined);
		          } else {
		            insertTransformedTemplate(babel, state, template, path, {}, config, undefined);
		          }
		        },
		        CallExpression(path, state) {
		          let calleePath = path.get('callee');
		          if (!calleePath.isIdentifier()) {
		            return;
		          }
		          let config = referencesInlineCompiler(calleePath, state);
		          if (!config) {
		            return;
		          }
		          if (state.recursionGuard.has(path.node)) {
		            return;
		          }
		          if (path.get('arguments').length > 2) {
		            throw path.buildCodeFrameError(`${calleePath.node.name} can only be invoked with 2 arguments: the template string and any static options`);
		          }
		          let [firstArg, secondArg] = path.get('arguments');
		          let template;
		          switch (firstArg === null || firstArg === void 0 ? void 0 : firstArg.node.type) {
		            case 'StringLiteral':
		              template = firstArg.node.value;
		              break;
		            case 'TemplateLiteral':
		              if (firstArg.node.expressions.length) {
		                throw path.buildCodeFrameError('placeholders inside a template string are not supported');
		              } else {
		                template = firstArg.node.quasis.map(quasi => quasi.value.cooked).join('');
		              }
		              break;
		            case 'TaggedTemplateExpression':
		              throw path.buildCodeFrameError(`tagged template strings inside ${calleePath.node.name} are not supported`);
		            default:
		              throw path.buildCodeFrameError(`${calleePath.node.name} should be invoked with at least a single argument (the template string)`);
		          }
		          let userTypedOptions;
		          let backingClass;
		          if (!secondArg) {
		            userTypedOptions = {};
		          } else {
		            if (!secondArg.isObjectExpression()) {
		              throw path.buildCodeFrameError(`${calleePath.node.name} can only be invoked with 2 arguments: the template string, and any static options`);
		            }
		            userTypedOptions = new expression_parser_1.ExpressionParser(babel).parseObjectExpression(calleePath.node.name, secondArg, config.enableScope, Boolean(config.rfc931Support));
		            if (config.rfc931Support && userTypedOptions.component) {
		              backingClass = userTypedOptions.component;
		            }
		          }
		          if (state.normalizedOpts.targetFormat === 'wire') {
		            insertCompiledTemplate(babel, state, state.normalizedOpts, template, path, userTypedOptions, config, backingClass);
		          } else {
		            insertTransformedTemplate(babel, state, template, path, userTypedOptions, config, backingClass);
		          }
		        }
		      }
		    };
		    return {
		      pre(file) {
		        // run our processing in pre so that imports for gts
		        // are kept for other plugins.
		        babel.traverse(file.ast, plugin.visitor, file.scope, this);
		      },
		      visitor: {}
		    };
		  };
		}
		function* configuredModules(state) {
		  for (let moduleConfig of INLINE_PRECOMPILE_MODULES) {
		    if (moduleConfig.moduleName !== '@ember/template-compilation' && moduleConfig.moduleName !== '@ember/template-compiler' && !state.normalizedOpts.enableLegacyModules.includes(moduleConfig.moduleName)) {
		      continue;
		    }
		    yield moduleConfig;
		  }
		}
		function referencesInlineCompiler(path, state) {
		  for (let moduleConfig of configuredModules(state)) {
		    if (path.referencesImport(moduleConfig.moduleName, moduleConfig.export)) {
		      return moduleConfig;
		    }
		  }
		  return undefined;
		}
		function runtimeErrorIIFE(babel, replacements) {
		  let statement = babel.template(`(function() {\n  throw new Error('ERROR_MESSAGE');\n})();`)(replacements);
		  return statement.expression;
		}
		function buildScopeLocals(userTypedOptions, formatOptions, target, mayUseLexicalThis) {
		  if (formatOptions.rfc931Support && userTypedOptions.eval) {
		    return new scope_locals_1.ScopeLocals({
		      mode: 'implicit',
		      jsPath: target,
		      mayUseLexicalThis
		    });
		  } else if (userTypedOptions.scope) {
		    return userTypedOptions.scope;
		  } else {
		    return new scope_locals_1.ScopeLocals({
		      mode: 'explicit'
		    });
		  }
		}
		function buildPrecompileOptions(babel, target, state, template, userTypedOptions, config, scope) {
		  let jsutils = new js_utils_1.JSUtils(babel, state, target, scope.add.bind(scope), state.util);
		  let meta = Object.assign({
		    jsutils
		  }, userTypedOptions === null || userTypedOptions === void 0 ? void 0 : userTypedOptions.meta);
		  let output = {
		    contents: template,
		    // we've extended meta to add jsutils, but the types in @glimmer/syntax
		    // don't account for extension
		    meta: meta,
		    // TODO: embroider's template-compiler allows this to be overriden to get
		    // backward-compatible module names that don't match the real name of the
		    // on-disk file. What's our plan for migrating people away from that?
		    moduleName: state.filename,
		    // This is here so it's *always* the real filename. Historically, there is
		    // also `moduleName` but that did not match the real on-disk filename, it
		    // was the notional runtime module name from classic ember builds.
		    filename: state.filename,
		    plugins: {
		      // the cast is needed here only because our meta is extended. That is,
		      // these plugins can access meta.jsutils.
		      ast: [...state.normalizedOpts.transforms, scope.crawl()]
		    }
		  };
		  for (let [key, value] of Object.entries(userTypedOptions)) {
		    if (key !== 'scope') {
		      // `scope` in the user-facing API becomes `locals` in the low-level
		      // ember-template-compiler API
		      output[key] = value;
		    }
		  }
		  output.locals = scope.locals;
		  if (config.rfc931Support) {
		    output.strictMode = true;
		  }
		  return output;
		}
		function remapAndBindIdentifiers(target, babel, scopeLocals) {
		  target.traverse({
		    Identifier(path) {
		      var _a;
		      if (scopeLocals.has(path.node.name) && path.node.name !== scopeLocals.get(path.node.name)) {
		        // this identifier has different names in hbs vs js, so we need to
		        // replace the hbs name in the template compiler output with the js
		        // name
		        path.replaceWith(babel.types.identifier(scopeLocals.get(path.node.name)));
		      }
		      // this is where we tell babel's scope system about the new reference we
		      // just introduced. @babel/plugin-transform-typescript in particular
		      // cares a lot about those references being present.
		      (_a = path.scope.getBinding(path.node.name)) === null || _a === void 0 ? void 0 : _a.reference(path);
		    }
		  });
		}
		function insertCompiledTemplate(babel, state, opts, template, target, userTypedOptions, config, backingClass) {
		  let t = babel.types;
		  let scopeLocals = buildScopeLocals(userTypedOptions, config, target, !backingClass);
		  let options = buildPrecompileOptions(babel, target, state, template, userTypedOptions, config, scopeLocals);
		  let precompileResultString;
		  // insertRuntimeErrors is legacy and not supported by the newer rfc931 form
		  if (options.insertRuntimeErrors && !config.rfc931Support) {
		    try {
		      precompileResultString = opts.compiler.precompile(template, options);
		    } catch (error) {
		      target.replaceWith(runtimeErrorIIFE(babel, {
		        ERROR_MESSAGE: error.message
		      }));
		      return;
		    }
		  } else {
		    precompileResultString = opts.compiler.precompile(template, options);
		  }
		  let templateExpression = babel.template.expression.ast(precompileResultString);
		  t.addComment(templateExpression, 'leading', `\n  ${template.replace(/\*\//g, '*\\/')}\n`, /* line comment? */false);
		  state.util.replaceWith(target, i => {
		    var _a;
		    let templateFactoryIdentifier = i.import(state.templateFactory.moduleName, state.templateFactory.exportName);
		    let expression = t.callExpression(templateFactoryIdentifier, [templateExpression]);
		    if (config.rfc931Support) {
		      expression = t.callExpression(i.import('@ember/component', 'setComponentTemplate'), [expression, (_a = backingClass === null || backingClass === void 0 ? void 0 : backingClass.node) !== null && _a !== void 0 ? _a : t.callExpression(i.import('@ember/component/template-only', 'default', 'templateOnly'), [])]);
		    }
		    return expression;
		  });
		  remapAndBindIdentifiers(target, babel, scopeLocals);
		}
		function insertTransformedTemplate(babel, state, template, target, userTypedOptions, formatOptions, backingClass) {
		  let t = babel.types;
		  let scopeLocals = buildScopeLocals(userTypedOptions, formatOptions, target, !backingClass);
		  let options = buildPrecompileOptions(babel, target, state, template, userTypedOptions, formatOptions, scopeLocals);
		  let ast = (0, syntax_1.preprocess)(template, Object.assign(Object.assign({}, options), {
		    mode: 'codemod'
		  }));
		  let transformed = (0, syntax_1.print)(ast, {
		    entityEncoding: 'raw'
		  });
		  if (target.isCallExpression()) {
		    updateCallForm(target, transformed, formatOptions, scopeLocals, state, babel, backingClass);
		  } else {
		    updateBacktickForm(scopeLocals, state, target, t, transformed, babel);
		  }
		}
		function updateBacktickForm(scopeLocals, state, target, t, transformed, babel) {
		  if (scopeLocals.isEmpty()) {
		    // simple case: just replace the string literal part with the transformed
		    // template contents
		    target.get('quasi').get('quasis.0').replaceWith(t.templateElement({
		      raw: transformed
		    }));
		    return;
		  }
		  // need to add scope, so need to replace the backticks form with a call
		  // expression to precompileTemplate
		  maybePruneImport(state.util, target.get('tag'));
		  let newCall = state.util.replaceWith(target, i => t.callExpression(precompileTemplate(i), [t.stringLiteral(transformed)]));
		  updateScope(babel, newCall, scopeLocals);
		}
		function updateCallForm(target, transformed, formatOptions, scopeLocals, state, babel, backingClass) {
		  // first the simple part: replacing the string literal with the actual body of
		  // the rewritten template
		  target.get('arguments.0').replaceWith(babel.types.stringLiteral(transformed));
		  if (!formatOptions.enableScope && !scopeLocals.isEmpty()) {
		    // an AST transform added lexically scoped values to a template that
		    // wasn't already in a form that supports them, so convert form.
		    maybePruneImport(state.util, target.get('callee'));
		    state.util.replaceWith(target.get('callee'), i => precompileTemplate(i));
		  }
		  if (formatOptions.rfc931Support === 'polyfilled') {
		    maybePruneImport(state.util, target.get('callee'));
		    state.util.replaceWith(target.get('callee'), i => precompileTemplate(i));
		    convertStrictMode(babel, target);
		    removeEvalAndScope(target);
		    target.node.arguments = target.node.arguments.slice(0, 2);
		    state.recursionGuard.add(target.node);
		    state.util.replaceWith(target, i => {
		      var _a;
		      return babel.types.callExpression(i.import('@ember/component', 'setComponentTemplate'), [target.node, (_a = backingClass === null || backingClass === void 0 ? void 0 : backingClass.node) !== null && _a !== void 0 ? _a : babel.types.callExpression(i.import('@ember/component/template-only', 'default', 'templateOnly'), [])]);
		    });
		    // we just wrapped the target callExpression in the call to
		    // setComponentTemplate. Adjust `target` back to point at the
		    // precompileTemplate call for the final updateScope below.
		    //
		    target = target.get('arguments.0');
		  }
		  // We deliberately do updateScope at the end so that when it updates
		  // references, those references will point to the accurate paths in the
		  // final AST.
		  updateScope(babel, target, scopeLocals);
		}
		function templateFactoryConfig(opts) {
		  var _a;
		  let moduleName = '@ember/template-factory';
		  let exportName = 'createTemplateFactory';
		  let overrides = (_a = opts.outputModuleOverrides[moduleName]) === null || _a === void 0 ? void 0 : _a[exportName];
		  return overrides ? {
		    exportName: overrides[0],
		    moduleName: overrides[1]
		  } : {
		    exportName,
		    moduleName
		  };
		}
		function buildScope(babel, locals) {
		  let t = babel.types;
		  return t.arrowFunctionExpression([], t.objectExpression(locals.entries().map(([name, identifier]) => t.objectProperty(t.identifier(name), t.identifier(identifier), false, name !== 'this'))));
		}
		// this is responsible both for adjusting the AST for our scope argument *and*
		// ensuring that babel's scope system will see that these new identifiers
		// reference their bindings. @babel/plugin-transform-typescript in particular
		// cares an awful lot about whether an import has valid non-type references, so
		// these newly introducd references need to be valid.
		function updateScope(babel, target, locals) {
		  let t = babel.types;
		  let secondArg = target.get('arguments.1');
		  if (secondArg) {
		    let scope = secondArg.get('properties').find(p => {
		      let key = p.get('key');
		      return key.isIdentifier() && key.node.name === 'scope';
		    });
		    if (scope) {
		      if (locals.isEmpty()) {
		        scope.remove();
		      } else {
		        scope.set('value', buildScope(babel, locals));
		        // funny-looking naming here, but it actually makes sense because we're
		        // connecting the glimmer scope system with the babel scope system.
		        scope.scope.crawl();
		      }
		    } else if (!locals.isEmpty()) {
		      secondArg.pushContainer('properties', t.objectProperty(t.identifier('scope'), buildScope(babel, locals)));
		      secondArg.get(`properties.${secondArg.node.properties.length - 1}`).scope.crawl();
		    }
		  } else if (!locals.isEmpty()) {
		    target.pushContainer('arguments', t.objectExpression([t.objectProperty(t.identifier('scope'), buildScope(babel, locals))]));
		    target.get('arguments.1').scope.crawl();
		  }
		}
		function removeEvalAndScope(target) {
		  let secondArg = target.get('arguments.1');
		  if (secondArg) {
		    let evalProp = secondArg.get('properties').find(p => {
		      let key = p.get('key');
		      return key.isIdentifier() && key.node.name === 'eval';
		    });
		    if (evalProp) {
		      evalProp.remove();
		    }
		    let componentProp = secondArg.get('properties').find(p => {
		      let key = p.get('key');
		      return key.isIdentifier() && key.node.name === 'component';
		    });
		    if (componentProp) {
		      componentProp.remove();
		    }
		  }
		}
		// Given a call to template(), convert its "strict" argument into
		// precompileTemplate's "strictMode" argument. They differ in name and default
		// value.
		function convertStrictMode(babel, target) {
		  let t = babel.types;
		  let secondArg = target.get('arguments.1');
		  if (secondArg) {
		    let strict = secondArg.get('properties').find(p => {
		      let key = p.get('key');
		      return key.isIdentifier() && key.node.name === 'strict';
		    });
		    if (strict) {
		      strict.set('key', t.identifier('strictMode'));
		    } else {
		      secondArg.pushContainer('properties', t.objectProperty(t.identifier('strictMode'), t.booleanLiteral(true)));
		    }
		  } else {
		    target.pushContainer('arguments', t.objectExpression([t.objectProperty(t.identifier('strictMode'), t.booleanLiteral(true))]));
		  }
		}
		function maybePruneImport(util, identifier) {
		  if (!identifier.isIdentifier()) {
		    return;
		  }
		  let binding = identifier.scope.getBinding(identifier.node.name);
		  if (!binding) {
		    return;
		  }
		  let found = binding.referencePaths.find(path => path.node === identifier.node);
		  if (!found) {
		    return;
		  }
		  binding.referencePaths.splice(binding.referencePaths.indexOf(found), 1);
		  binding.references--;
		  if (binding.references === 0) {
		    let specifier = binding.path;
		    if (specifier.isImportSpecifier()) {
		      let declaration = specifier.parentPath;
		      util.removeImport(declaration.node.source.value, name(specifier.node.imported));
		    }
		  }
		}
		function precompileTemplate(i) {
		  return i.import('@ember/template-compilation', 'precompileTemplate');
		}
		function name(node) {
		  if (node.type === 'StringLiteral') {
		    return node.value;
		  } else {
		    return node.name;
		  }
		}
		exports.default = makePlugin(options => options); 
	} (plugin$2));
	return plugin$2;
}

var pluginExports = /*@__PURE__*/ requirePlugin();
const plugin = /*@__PURE__*/getDefaultExportFromCjs(pluginExports);

const plugin$1 = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    default: plugin
}, [pluginExports]);

export { plugin$1 as p };
