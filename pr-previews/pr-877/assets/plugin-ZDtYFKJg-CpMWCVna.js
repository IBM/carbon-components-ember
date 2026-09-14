import { s as srcExports } from './index-DNPwtadt-DSAX6-cS.js';
import './_commonjsHelpers-BAGoDD49-Asm8knJo.js';

function astNodeHasBinding(target, name) {
  let cursor = target;
  while (cursor) {
    let parentNode = cursor.parent?.node;
    if (parentNode?.type === 'ElementNode' && parentNode.blockParams.includes(name) &&
    // an ElementNode's block params are valid only within its children
    parentNode.children.includes(cursor.node)) {
      return true;
    }
    if (parentNode?.type === 'Block' && parentNode.blockParams.includes(name) &&
    // a Block's blockParams are valid only within its body
    parentNode.body.includes(cursor.node)) {
      return true;
    }
    cursor = cursor.parent;
  }
  return false;
}
const mutationMethods = ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];
function readOnlyArray(array, message = 'Forbidden array mutation') {
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

/*
  This class exists because:
   - before template compilation starts, we need to pass a `locals` array to
     ember-template-compiler
   - the JSUtils API can mutate the scope during template compilation
   - those scope mutations need to update both the original `locals` array and
     our own name mapping, keeping them in sync.
*/
var __classPrivateFieldSet$1 = function (receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet$1 = function (receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ScopeLocals_instances, _ScopeLocals_mapping, _ScopeLocals_locals, _ScopeLocals_params, _ScopeLocals_isInJsScope;
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
const ALLOWED_GLOBALS = new Set([
// ////////////////
// namespaces
// ////////////////
//   TC39
'globalThis', 'Atomics', 'JSON', 'Math', 'Reflect',
//   WHATWG
'localStorage', 'sessionStorage', 'URL',
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
    __classPrivateFieldSet$1(this, _ScopeLocals_params, params, "f");
  }
  get locals() {
    return readOnlyArray(__classPrivateFieldGet$1(this, _ScopeLocals_locals, "f"), 'The only supported way to manipulate locals is via the jsutils API\nhttps://github.com/emberjs/babel-plugin-ember-template-compilation#jsutils-manipulating-javascript-from-within-ast-transforms');
  }
  has(key) {
    return key in __classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f");
  }
  get(key) {
    return __classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f")[key];
  }
  isEmpty() {
    return __classPrivateFieldGet$1(this, _ScopeLocals_locals, "f").length === 0;
  }
  entries() {
    return Object.entries(__classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f"));
  }
  add(hbsName, jsName) {
    __classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f")[hbsName] = jsName ?? hbsName;
    if (!__classPrivateFieldGet$1(this, _ScopeLocals_locals, "f").includes(hbsName)) {
      __classPrivateFieldGet$1(this, _ScopeLocals_locals, "f").push(hbsName);
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
              if (__classPrivateFieldGet$1(this, _ScopeLocals_params, "f").mode === 'implicit') {
                // all hbs upvars that have matching JS bindings go into the
                // scope
                for (let name of seen) {
                  if (name === 'this') {
                    if (__classPrivateFieldGet$1(this, _ScopeLocals_params, "f").mayUseLexicalThis) {
                      this.add(name);
                    }
                  } else if (__classPrivateFieldGet$1(this, _ScopeLocals_instances, "m", _ScopeLocals_isInJsScope).call(this, name, __classPrivateFieldGet$1(this, _ScopeLocals_params, "f").jsPath)) {
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
                for (let name of Object.keys(__classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f"))) {
                  if (!seen.has(name)) {
                    __classPrivateFieldGet$1(this, _ScopeLocals_locals, "f").splice(__classPrivateFieldGet$1(this, _ScopeLocals_locals, "f").indexOf(name), 1);
                    delete __classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f")[name];
                  }
                }
              }
            }
          },
          PathExpression: (node, path) => {
            switch (node.head.type) {
              case 'ThisHead':
                if (!astNodeHasBinding(path, 'this')) {
                  seen.add('this');
                }
                break;
              case 'VarHead':
                {
                  const name = node.head.name;
                  if (!astNodeHasBinding(path, name)) {
                    seen.add(name);
                  }
                }
            }
          },
          ElementNode: (node, path) => {
            const name = node.tag.split('.')[0];
            if (!astNodeHasBinding(path, name)) {
              seen.add(name);
            }
          }
        }
      };
    };
  }
}
_ScopeLocals_mapping = new WeakMap(), _ScopeLocals_locals = new WeakMap(), _ScopeLocals_params = new WeakMap(), _ScopeLocals_instances = new WeakSet(), _ScopeLocals_isInJsScope = function _ScopeLocals_isInJsScope(hbsName, jsPath) {
  let jsName = __classPrivateFieldGet$1(this, _ScopeLocals_mapping, "f")[hbsName] ?? hbsName;
  return ALLOWED_GLOBALS.has(jsName) || jsPath.scope.getBinding(jsName);
};
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
    if (body?.type === 'ObjectExpression') {
      objExpression = body;
    } else if (body?.type === 'BlockStatement') {
      // SAFETY: We know that the body is a ReturnStatement because we're checking inside
      let returnStatements = body.body.filter(statement => statement.type === 'ReturnStatement');
      if (returnStatements.length !== 1) {
        throw new Error('Scope functions must have a single return statement which returns an object expression containing references to in-scope values');
      }
      objExpression = returnStatements[0].argument;
    }
    if (objExpression?.type !== 'ObjectExpression') {
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
      let propName = name$1(key);
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
    }, new ScopeLocals({
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
      let propertyName = name$1(key);
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
function name$1(node) {
  if (node.type === 'StringLiteral') {
    return node.value;
  } else {
    return node.name;
  }
}
var __classPrivateFieldSet = function (receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function (receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JSUtils_instances, _JSUtils_babel, _JSUtils_state, _JSUtils_template, _JSUtils_addedBinding, _JSUtils_importer, _JSUtils_emitStatement, _JSUtils_parseExpression, _ExpressionContext_importer, _ExpressionContext_target;
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
    let name = unusedNameLike(opts?.nameHint ?? 'a', candidate => __classPrivateFieldGet(this, _JSUtils_template, "f").scope.hasBinding(candidate) || astNodeHasBinding(target, candidate));
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
    let importedIdentifier = __classPrivateFieldGet(this, _JSUtils_importer, "f").import(__classPrivateFieldGet(this, _JSUtils_template, "f"), moduleSpecifier, exportedName, opts?.nameHint);
    // Simple base case: the JS name that's available is also unused at our spot
    // in HBS, so just use it.
    if (!astNodeHasBinding(target, importedIdentifier.name)) {
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
    let identifier = unusedNameLike(importedIdentifier.name, candidate => __classPrivateFieldGet(this, _JSUtils_template, "f").scope.hasBinding(candidate) || astNodeHasBinding(target, candidate));
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
  return __classPrivateFieldGet(this, _JSUtils_babel, "f").template.expression.ast(expressionString);
};
function unusedNameLike(desiredName, isUsed) {
  let candidate = desiredName;
  let counter = 0;
  while (isUsed(candidate)) {
    candidate = `${desiredName}${counter++}`;
  }
  return candidate;
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
const x = Object.assign;
const E$1 = console;
function A$1(t, n = "unexpected unreachable branch") {
  throw E$1.log("unreachable", t), E$1.log(`${n} :: ${JSON.stringify(t)} (${t})`), new Error("code reached unreachable");
}
var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];
function Exception(message, node) {
  var loc = node && node.loc,
    line,
    endLineNumber,
    column,
    endColumn;
  if (loc) {
    line = loc.start.line;
    endLineNumber = loc.end.line;
    column = loc.start.column;
    endColumn = loc.end.column;
    message += ' - ' + line + ':' + column;
  }
  var tmp = Error.prototype.constructor.call(this, message);
  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }
  try {
    if (loc) {
      this.lineNumber = line;
      this.endLineNumber = endLineNumber;
      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
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
    /* Ignore if the browser is very particular */
  }
}
Exception.prototype = new Error();
function Visitor() {
  this.parents = [];
}
Visitor.prototype = {
  constructor: Visitor,
  mutating: false,
  // Visits a given value. If mutating, will replace the value if necessary.
  acceptKey: function (node, name) {
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
  acceptRequired: function (node, name) {
    this.acceptKey(node, name);
    if (!node[name]) {
      throw new Exception(node.type + ' requires ' + name);
    }
  },
  // Traverses a given array. If mutating, empty responses will be removed
  // for child elements.
  acceptArray: function (array) {
    for (var i = 0, l = array.length; i < l; i++) {
      this.acceptKey(array, i);
      if (!array[i]) {
        array.splice(i, 1);
        i--;
        l--;
      }
    }
  },
  accept: function (object) {
    if (!object) {
      return;
    }
    /* istanbul ignore next: Sanity code */
    if (!this[object.type]) {
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
  Program: function (program) {
    this.acceptArray(program.body);
  },
  MustacheStatement: visitSubExpression,
  Decorator: visitSubExpression,
  BlockStatement: visitBlock,
  DecoratorBlock: visitBlock,
  PartialStatement: visitPartial,
  PartialBlockStatement: function (partial) {
    visitPartial.call(this, partial);
    this.acceptKey(partial, 'program');
  },
  ContentStatement: function /* content */ () {},
  CommentStatement: function /* comment */ () {},
  SubExpression: visitSubExpression,
  PathExpression: function /* path */ () {},
  StringLiteral: function /* string */ () {},
  NumberLiteral: function /* number */ () {},
  BooleanLiteral: function /* bool */ () {},
  UndefinedLiteral: function /* literal */ () {},
  NullLiteral: function /* literal */ () {},
  Hash: function (hash) {
    this.acceptArray(hash.pairs);
  },
  HashPair: function (pair) {
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
WhitespaceControl.prototype.Program = function (program) {
  var doStandalone = !this.options.ignoreStandalone;
  var isRoot = !this.isRootSeen;
  this.isRootSeen = true;
  var body = program.body;
  for (var i = 0, l = body.length; i < l; i++) {
    var current = body[i],
      strip = this.accept(current);
    if (!strip) {
      continue;
    }
    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
      _isNextWhitespace = isNextWhitespace(body, i, isRoot),
      openStandalone = strip.openStandalone && _isPrevWhitespace,
      closeStandalone = strip.closeStandalone && _isNextWhitespace,
      inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
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
WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
  this.accept(block.program);
  this.accept(block.inverse);
  // Find the inverse program that is involved with whitespace stripping.
  var program = block.program || block.inverse,
    inverse = block.program && block.inverse,
    firstInverse = inverse,
    lastInverse = inverse;
  if (inverse && inverse.chained) {
    firstInverse = inverse.body[0].program;
    // Walk the inverse chain to find the last inverse that is actually in the chain.
    while (lastInverse.chained) {
      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
    }
  }
  var strip = {
    open: block.openStrip.open,
    close: block.closeStrip.close,
    // Determine the standalone candidacy. Basically flag our content as being possibly standalone
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
    // Find standalone else statements
    if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
      omitLeft(program.body);
      omitRight(firstInverse.body);
    }
  } else if (block.closeStrip.open) {
    omitLeft(program.body, null, true);
  }
  return strip;
};
WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
  return mustache.strip;
};
WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
  /* istanbul ignore next */
  var strip = node.strip || {};
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
  var prev = body[i - 1],
    sibling = body[i - 2];
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
  var next = body[i + 1],
    sibling = body[i + 2];
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

/* parser generated by jison 0.4.18 */
/*
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
*/
var parser = function () {
  var o = function (k, v, o, l) {
      for (o = o || {}, l = k.length; l--; o[k[l]] = v);
      return o;
    },
    $V0 = [2, 52],
    $V1 = [1, 20],
    $V2 = [5, 14, 15, 19, 29, 34, 39, 44, 47, 48, 53, 57, 61],
    $V3 = [1, 44],
    $V4 = [1, 40],
    $V5 = [1, 43],
    $V6 = [1, 33],
    $V7 = [1, 34],
    $V8 = [1, 35],
    $V9 = [1, 36],
    $Va = [1, 37],
    $Vb = [1, 42],
    $Vc = [1, 46],
    $Vd = [14, 15, 19, 29, 34, 39, 44, 47, 48, 53, 57, 61],
    $Ve = [14, 15, 19, 29, 34, 44, 47, 48, 53, 57, 61],
    $Vf = [15, 18],
    $Vg = [14, 15, 19, 29, 34, 47, 48, 53, 57, 61],
    $Vh = [33, 67, 73, 75, 84, 85, 86, 87, 88, 89],
    $Vi = [23, 33, 56, 67, 68, 73, 75, 77, 79, 84, 85, 86, 87, 88, 89],
    $Vj = [1, 62],
    $Vk = [1, 63],
    $Vl = [23, 33, 56, 68, 73, 79],
    $Vm = [23, 33, 56, 67, 68, 73, 75, 77, 79, 84, 85, 86, 87, 88, 89, 92, 93],
    $Vn = [2, 51],
    $Vo = [1, 64],
    $Vp = [67, 73, 75, 77, 84, 85, 86, 87, 88, 89],
    $Vq = [56, 67, 73, 75, 84, 85, 86, 87, 88, 89],
    $Vr = [1, 75],
    $Vs = [1, 76],
    $Vt = [1, 83],
    $Vu = [33, 67, 73, 75, 79, 84, 85, 86, 87, 88, 89],
    $Vv = [23, 67, 73, 75, 84, 85, 86, 87, 88, 89],
    $Vw = [67, 68, 73, 75, 84, 85, 86, 87, 88, 89],
    $Vx = [33, 79],
    $Vy = [1, 134],
    $Vz = [73, 81];
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
      "hash": 49,
      "expr": 50,
      "mustache_repetition0": 51,
      "mustache_option0": 52,
      "OPEN_UNESCAPED": 53,
      "mustache_repetition1": 54,
      "mustache_option1": 55,
      "CLOSE_UNESCAPED": 56,
      "OPEN_PARTIAL": 57,
      "partial_repetition0": 58,
      "partial_option0": 59,
      "openPartialBlock": 60,
      "OPEN_PARTIAL_BLOCK": 61,
      "openPartialBlock_repetition0": 62,
      "openPartialBlock_option0": 63,
      "exprHead": 64,
      "arrayLiteral": 65,
      "sexpr": 66,
      "OPEN_SEXPR": 67,
      "CLOSE_SEXPR": 68,
      "sexpr_repetition0": 69,
      "sexpr_option0": 70,
      "hash_repetition_plus0": 71,
      "hashSegment": 72,
      "ID": 73,
      "EQUALS": 74,
      "OPEN_ARRAY": 75,
      "arrayLiteral_repetition0": 76,
      "CLOSE_ARRAY": 77,
      "blockParams": 78,
      "OPEN_BLOCK_PARAMS": 79,
      "blockParams_repetition_plus0": 80,
      "CLOSE_BLOCK_PARAMS": 81,
      "path": 82,
      "dataName": 83,
      "STRING": 84,
      "NUMBER": 85,
      "BOOLEAN": 86,
      "UNDEFINED": 87,
      "NULL": 88,
      "DATA": 89,
      "pathSegments": 90,
      "sep": 91,
      "SEP": 92,
      "PRIVATE_SEP": 93,
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
      53: "OPEN_UNESCAPED",
      56: "CLOSE_UNESCAPED",
      57: "OPEN_PARTIAL",
      61: "OPEN_PARTIAL_BLOCK",
      67: "OPEN_SEXPR",
      68: "CLOSE_SEXPR",
      73: "ID",
      74: "EQUALS",
      75: "OPEN_ARRAY",
      77: "CLOSE_ARRAY",
      79: "OPEN_BLOCK_PARAMS",
      81: "CLOSE_BLOCK_PARAMS",
      84: "STRING",
      85: "NUMBER",
      86: "BOOLEAN",
      87: "UNDEFINED",
      88: "NULL",
      89: "DATA",
      92: "SEP",
      93: "PRIVATE_SEP"
    },
    productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 3], [8, 5], [8, 5], [11, 5], [12, 3], [60, 5], [50, 1], [50, 1], [64, 1], [64, 1], [66, 3], [66, 5], [49, 1], [72, 3], [65, 3], [78, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [83, 2], [91, 1], [91, 1], [82, 3], [82, 1], [90, 3], [90, 1], [6, 0], [6, 2], [17, 0], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [51, 0], [51, 2], [52, 0], [52, 1], [54, 0], [54, 2], [55, 0], [55, 1], [58, 0], [58, 2], [59, 0], [59, 1], [62, 0], [62, 2], [63, 0], [63, 1], [69, 0], [69, 2], [70, 0], [70, 1], [71, 1], [71, 2], [76, 0], [76, 2], [80, 1], [80, 2]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
      /* this == yyval */
      var $0 = $$.length - 1;
      switch (yystate) {
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
        case 28:
        case 29:
        case 30:
        case 31:
        case 38:
        case 39:
        case 46:
        case 47:
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
          var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
            program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
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
          this.$ = yy.prepareMustache(yy.syntax.hash($$[$0 - 1], yy.locInfo(this._$), {
            yy: yy,
            syntax: 'expr'
          }), [], undefined, $$[$0 - 2], yy.stripFlags($$[$0 - 2], $$[$0]), this._$);
          break;
        case 23:
        case 24:
          this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
          break;
        case 25:
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
        case 26:
          this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
          break;
        case 27:
          this.$ = {
            path: $$[$0 - 3],
            params: $$[$0 - 2],
            hash: $$[$0 - 1],
            strip: yy.stripFlags($$[$0 - 4], $$[$0])
          };
          break;
        case 32:
          this.$ = yy.syntax.hash($$[$0 - 1], yy.locInfo(this._$), {
            yy: yy,
            syntax: 'expr'
          });
          break;
        case 33:
          this.$ = {
            type: 'SubExpression',
            path: $$[$0 - 3],
            params: $$[$0 - 2],
            hash: $$[$0 - 1],
            loc: yy.locInfo(this._$)
          };
          break;
        case 34:
          this.$ = {
            type: 'Hash',
            pairs: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 35:
          this.$ = {
            type: 'HashPair',
            key: yy.id($$[$0 - 2]),
            value: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 36:
          this.$ = yy.syntax.square($$[$0 - 1], yy.locInfo(this._$), {
            yy: yy,
            syntax: 'expr'
          });
          break;
        case 37:
          this.$ = yy.id($$[$0 - 1]);
          break;
        case 40:
          this.$ = {
            type: 'StringLiteral',
            value: $$[$0],
            original: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 41:
          this.$ = {
            type: 'NumberLiteral',
            value: Number($$[$0]),
            original: Number($$[$0]),
            loc: yy.locInfo(this._$)
          };
          break;
        case 42:
          this.$ = {
            type: 'BooleanLiteral',
            value: $$[$0] === 'true',
            original: $$[$0] === 'true',
            loc: yy.locInfo(this._$)
          };
          break;
        case 43:
          this.$ = {
            type: 'UndefinedLiteral',
            original: undefined,
            value: undefined,
            loc: yy.locInfo(this._$)
          };
          break;
        case 44:
          this.$ = {
            type: 'NullLiteral',
            original: null,
            value: null,
            loc: yy.locInfo(this._$)
          };
          break;
        case 45:
          this.$ = yy.preparePath(true, false, $$[$0], this._$);
          break;
        case 48:
          this.$ = yy.preparePath(false, $$[$0 - 2], $$[$0], this._$);
          break;
        case 49:
          this.$ = yy.preparePath(false, false, $$[$0], this._$);
          break;
        case 50:
          $$[$0 - 2].push({
            part: yy.id($$[$0]),
            original: $$[$0],
            separator: $$[$0 - 1]
          });
          this.$ = $$[$0 - 2];
          break;
        case 51:
          this.$ = [{
            part: yy.id($$[$0]),
            original: $$[$0]
          }];
          break;
        case 52:
        case 54:
        case 56:
        case 64:
        case 70:
        case 76:
        case 84:
        case 88:
        case 92:
        case 96:
        case 100:
        case 106:
          this.$ = [];
          break;
        case 53:
        case 55:
        case 57:
        case 65:
        case 71:
        case 77:
        case 85:
        case 89:
        case 93:
        case 97:
        case 101:
        case 105:
        case 107:
        case 109:
          $$[$0 - 1].push($$[$0]);
          break;
        case 104:
        case 108:
          this.$ = [$$[$0]];
          break;
      }
    },
    table: [o([5, 14, 15, 19, 29, 34, 48, 53, 57, 61], $V0, {
      3: 1,
      4: 2,
      6: 3
    }), {
      1: [3]
    }, {
      5: [1, 4]
    }, o([5, 39, 44, 47], [2, 2], {
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
      60: 19,
      14: [1, 12],
      15: $V1,
      19: [1, 23],
      29: [1, 21],
      34: [1, 22],
      48: [1, 13],
      53: [1, 14],
      57: [1, 18],
      61: [1, 24]
    }), {
      1: [2, 1]
    }, o($V2, [2, 53]), o($V2, [2, 3]), o($V2, [2, 4]), o($V2, [2, 5]), o($V2, [2, 6]), o($V2, [2, 7]), o($V2, [2, 8]), o($V2, [2, 9]), {
      20: 28,
      49: 25,
      50: 26,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      20: 28,
      50: 45,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($Vd, $V0, {
      6: 3,
      4: 47
    }), o($Ve, $V0, {
      6: 3,
      4: 48
    }), o($Vf, [2, 54], {
      17: 49
    }), {
      20: 28,
      50: 50,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($Vg, $V0, {
      6: 3,
      4: 51
    }), o([5, 14, 15, 18, 19, 29, 34, 39, 44, 47, 48, 53, 57, 61], [2, 10]), {
      20: 52,
      64: 53,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      20: 54,
      64: 53,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      20: 55,
      64: 53,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      20: 28,
      50: 56,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      33: [1, 57]
    }, o($Vh, [2, 84], {
      51: 58
    }), o([23, 33, 56, 68, 79], [2, 34], {
      72: 59,
      73: [1, 60]
    }), o($Vi, [2, 28]), o($Vi, [2, 29], {
      91: 61,
      92: $Vj,
      93: $Vk
    }), o($Vl, [2, 104]), o($Vi, [2, 38]), o($Vi, [2, 39]), o($Vi, [2, 40]), o($Vi, [2, 41]), o($Vi, [2, 42]), o($Vi, [2, 43]), o($Vi, [2, 44]), o($Vm, [2, 30]), o($Vm, [2, 31]), o([23, 33, 56, 67, 68, 73, 75, 79, 84, 85, 86, 87, 88, 89, 92, 93], $Vn, {
      74: $Vo
    }), o($Vi, [2, 49], {
      91: 65,
      92: $Vj,
      93: $Vk
    }), {
      73: $Vc,
      90: 66
    }, o($Vp, [2, 106], {
      76: 67
    }), {
      20: 28,
      49: 68,
      50: 69,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($Vq, [2, 88], {
      54: 70
    }), o($Vm, $Vn), {
      25: 71,
      38: 73,
      39: $Vr,
      43: 74,
      44: $Vs,
      45: 72,
      47: [2, 60]
    }, {
      28: 77,
      43: 78,
      44: $Vs,
      47: [2, 62]
    }, {
      13: 80,
      15: $V1,
      18: [1, 79]
    }, o($Vh, [2, 92], {
      58: 81
    }), {
      26: 82,
      47: $Vt
    }, o($Vu, [2, 64], {
      30: 84
    }), {
      91: 61,
      92: $Vj,
      93: $Vk
    }, o($Vu, [2, 70], {
      35: 85
    }), o($Vv, [2, 56], {
      21: 86
    }), o($Vh, [2, 96], {
      62: 87
    }), o($V2, [2, 22]), {
      20: 28,
      33: [2, 86],
      49: 90,
      50: 89,
      52: 88,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($Vl, [2, 105]), {
      74: $Vo
    }, {
      73: $Vc,
      90: 91
    }, {
      73: [2, 46]
    }, {
      73: [2, 47]
    }, {
      20: 28,
      50: 92,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      73: [1, 93]
    }, o($Vi, [2, 45], {
      91: 65,
      92: $Vj,
      93: $Vk
    }), {
      20: 28,
      50: 95,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      77: [1, 94],
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      68: [1, 96]
    }, o($Vw, [2, 100], {
      69: 97
    }), {
      20: 28,
      49: 100,
      50: 99,
      55: 98,
      56: [2, 90],
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      26: 101,
      47: $Vt
    }, {
      47: [2, 61]
    }, o($Vd, $V0, {
      6: 3,
      4: 102
    }), {
      47: [2, 20]
    }, {
      20: 103,
      64: 53,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($Vg, $V0, {
      6: 3,
      4: 104
    }), {
      26: 105,
      47: $Vt
    }, {
      47: [2, 63]
    }, o($V2, [2, 11]), o($Vf, [2, 55]), {
      20: 28,
      33: [2, 94],
      49: 108,
      50: 107,
      59: 106,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($V2, [2, 26]), {
      20: 109,
      64: 53,
      65: 38,
      66: 39,
      67: $V3,
      73: $Vc,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, o($Vx, [2, 66], {
      71: 27,
      20: 28,
      64: 29,
      72: 30,
      82: 31,
      83: 32,
      65: 38,
      66: 39,
      90: 41,
      31: 110,
      50: 111,
      49: 112,
      67: $V3,
      73: $V4,
      75: $V5,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb
    }), o($Vx, [2, 72], {
      71: 27,
      20: 28,
      64: 29,
      72: 30,
      82: 31,
      83: 32,
      65: 38,
      66: 39,
      90: 41,
      36: 113,
      50: 114,
      49: 115,
      67: $V3,
      73: $V4,
      75: $V5,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb
    }), {
      20: 28,
      22: 116,
      23: [2, 58],
      49: 118,
      50: 117,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      20: 28,
      33: [2, 98],
      49: 121,
      50: 120,
      63: 119,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      33: [1, 122]
    }, o($Vh, [2, 85]), {
      33: [2, 87]
    }, o($Vi, [2, 48], {
      91: 65,
      92: $Vj,
      93: $Vk
    }), o($Vl, [2, 35]), o($Vm, [2, 50]), o($Vm, [2, 36]), o($Vp, [2, 107]), o($Vm, [2, 32]), {
      20: 28,
      49: 125,
      50: 124,
      64: 29,
      65: 38,
      66: 39,
      67: $V3,
      68: [2, 102],
      70: 123,
      71: 27,
      72: 30,
      73: $V4,
      75: $V5,
      82: 31,
      83: 32,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb,
      90: 41
    }, {
      56: [1, 126]
    }, o($Vq, [2, 89]), {
      56: [2, 91]
    }, o($V2, [2, 13]), {
      38: 73,
      39: $Vr,
      43: 74,
      44: $Vs,
      45: 128,
      46: 127,
      47: [2, 82]
    }, o($Vu, [2, 76], {
      40: 129
    }), {
      47: [2, 18]
    }, o($V2, [2, 14]), {
      33: [1, 130]
    }, o($Vh, [2, 93]), {
      33: [2, 95]
    }, {
      33: [1, 131]
    }, {
      32: 132,
      33: [2, 68],
      78: 133,
      79: $Vy
    }, o($Vu, [2, 65]), o($Vx, [2, 67]), {
      33: [2, 74],
      37: 135,
      78: 136,
      79: $Vy
    }, o($Vu, [2, 71]), o($Vx, [2, 73]), {
      23: [1, 137]
    }, o($Vv, [2, 57]), {
      23: [2, 59]
    }, {
      33: [1, 138]
    }, o($Vh, [2, 97]), {
      33: [2, 99]
    }, o($V2, [2, 23]), {
      68: [1, 139]
    }, o($Vw, [2, 101]), {
      68: [2, 103]
    }, o($V2, [2, 24]), {
      47: [2, 19]
    }, {
      47: [2, 83]
    }, o($Vx, [2, 78], {
      71: 27,
      20: 28,
      64: 29,
      72: 30,
      82: 31,
      83: 32,
      65: 38,
      66: 39,
      90: 41,
      41: 140,
      50: 141,
      49: 142,
      67: $V3,
      73: $V4,
      75: $V5,
      84: $V6,
      85: $V7,
      86: $V8,
      87: $V9,
      88: $Va,
      89: $Vb
    }), o($V2, [2, 25]), o($V2, [2, 21]), {
      33: [1, 143]
    }, {
      33: [2, 69]
    }, {
      73: [1, 145],
      80: 144
    }, {
      33: [1, 146]
    }, {
      33: [2, 75]
    }, o($Vf, [2, 12]), o($Vg, [2, 27]), o($Vm, [2, 33]), {
      33: [2, 80],
      42: 147,
      78: 148,
      79: $Vy
    }, o($Vu, [2, 77]), o($Vx, [2, 79]), o($Vd, [2, 15]), {
      73: [1, 150],
      81: [1, 149]
    }, o($Vz, [2, 108]), o($Ve, [2, 16]), {
      33: [1, 151]
    }, {
      33: [2, 81]
    }, {
      33: [2, 37]
    }, o($Vz, [2, 109]), o($Vd, [2, 17])],
    defaultActions: {
      4: [2, 1],
      62: [2, 46],
      63: [2, 47],
      72: [2, 61],
      74: [2, 20],
      78: [2, 63],
      90: [2, 87],
      100: [2, 91],
      104: [2, 18],
      108: [2, 95],
      118: [2, 59],
      121: [2, 99],
      125: [2, 103],
      127: [2, 19],
      128: [2, 83],
      133: [2, 69],
      136: [2, 75],
      148: [2, 81],
      149: [2, 37]
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
      var self = this,
        stack = [0],
        vstack = [null],
        lstack = [],
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        TERROR = 2,
        EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer = Object.create(this.lexer);
      var sharedState = {
        yy: {}
      };
      for (var k in this.yy) {
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
      var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        if (typeof token !== 'number') {
          token = self.symbols_[token] || token;
        }
        return token;
      };
      var symbol,
        state,
        action,
        r,
        yyval = {},
        p,
        len,
        newState,
        expected;
      while (true) {
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
          for (p in table[state]) {
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
        switch (action[0]) {
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
              yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
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
  /* generated by jison-lex 0.3.4 */
  var lexer = function () {
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
      setInput: function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function () {
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
      unput: function (ch) {
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
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function () {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function () {
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
      less: function (n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function () {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function (match, indexed_rule) {
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
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
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
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
      },
      // return next match in input
      next: function () {
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
        for (var i = 0; i < rules.length; i++) {
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
        switch ($avoiding_name_collisions) {
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
            return 67;
          case 8:
            return 68;
          case 9:
            if (yy.syntax.square === 'string') {
              this.unput(yy_.yytext);
              // escaped literal
              this.begin('escl');
            } else {
              return 75;
            }
            break;
          case 10:
            return 77;
          case 11:
            return 19;
          case 12:
            this.popState();
            this.begin('raw');
            return 23;
          case 13:
            return 57;
          case 14:
            return 61;
          case 15:
            return 29;
          case 16:
            return 47;
          case 17:
            this.popState();
            return 44;
          case 18:
            this.popState();
            return 44;
          case 19:
            return 34;
          case 20:
            return 39;
          case 21:
            return 53;
          case 22:
            return 48;
          case 23:
            this.unput(yy_.yytext);
            this.popState();
            this.begin('com');
            break;
          case 24:
            this.popState();
            return 14;
          case 25:
            return 48;
          case 26:
            return 74;
          case 27:
            return 73;
          case 28:
            return 73;
          case 29:
            return 93;
          case 30:
            return 92;
          case 31:
            // ignore whitespace
            break;
          case 32:
            this.popState();
            return 56;
          case 33:
            this.popState();
            return 33;
          case 34:
            yy_.yytext = strip(1, 2).replace(/\\"/g, '"');
            return 84;
          case 35:
            yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
            return 84;
          case 36:
            return 89;
          case 37:
            return 86;
          case 38:
            return 86;
          case 39:
            return 87;
          case 40:
            return 88;
          case 41:
            return 85;
          case 42:
            return 79;
          case 43:
            return 81;
          case 44:
            return 73;
          case 45:
            yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');
            this.popState();
            return 73;
          case 46:
            return 'INVALID';
          case 47:
            return 5;
        }
      },
      rules: [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]+?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\[)/, /^(?:\])/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)\]|])))/, /^(?:\.#)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)\]])))/, /^(?:false(?=([~}\s)\]])))/, /^(?:undefined(?=([~}\s)\]])))/, /^(?:null(?=([~}\s)\]])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)\]])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)\]|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/],
      conditions: {
        "mu": {
          "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47],
          "inclusive": false
        },
        "emu": {
          "rules": [2],
          "inclusive": false
        },
        "com": {
          "rules": [6],
          "inclusive": false
        },
        "raw": {
          "rules": [3, 4, 5],
          "inclusive": false
        },
        "escl": {
          "rules": [45],
          "inclusive": false
        },
        "INITIAL": {
          "rules": [0, 1, 47],
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
  return new Parser();
}();
var __spreadArray$1 = function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
function PrintVisitor() {
  this.padding = 0;
}
PrintVisitor.prototype = new Visitor();
PrintVisitor.prototype.pad = function (string) {
  var out = '';
  for (var i = 0, l = this.padding; i < l; i++) {
    out += '  ';
  }
  out += string + '\n';
  return out;
};
PrintVisitor.prototype.Program = function (program) {
  var out = '',
    body = program.body,
    i,
    l;
  if (program.blockParams) {
    var blockParams = 'BLOCK PARAMS: [';
    for (i = 0, l = program.blockParams.length; i < l; i++) {
      blockParams += ' ' + program.blockParams[i];
    }
    blockParams += ' ]';
    out += this.pad(blockParams);
  }
  for (i = 0, l = body.length; i < l; i++) {
    out += this.accept(body[i]);
  }
  this.padding--;
  return out;
};
PrintVisitor.prototype.MustacheStatement = function (mustache) {
  if (mustache.params.length > 0 || mustache.hash) {
    return this.pad('{{ ' + this.callBody(mustache) + ' }}');
  } else {
    return this.pad('{{ ' + this.accept(mustache.path) + ' }}');
  }
};
PrintVisitor.prototype.Decorator = function (mustache) {
  return this.pad('{{ DIRECTIVE ' + this.callBody(mustache) + ' }}');
};
PrintVisitor.prototype.BlockStatement = PrintVisitor.prototype.DecoratorBlock = function (block) {
  var out = '';
  out += this.pad((block.type === 'DecoratorBlock' ? 'DIRECTIVE ' : '') + 'BLOCK:');
  this.padding++;
  out += this.pad(this.callBody(block));
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
PrintVisitor.prototype.PartialStatement = function (partial) {
  var content = 'PARTIAL:' + partial.name.original;
  if (partial.params[0]) {
    content += ' ' + this.accept(partial.params[0]);
  }
  if (partial.hash) {
    content += ' ' + this.accept(partial.hash);
  }
  return this.pad('{{> ' + content + ' }}');
};
PrintVisitor.prototype.PartialBlockStatement = function (partial) {
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
PrintVisitor.prototype.ContentStatement = function (content) {
  return this.pad("CONTENT[ '" + content.value + "' ]");
};
PrintVisitor.prototype.CommentStatement = function (comment) {
  return this.pad("{{! '" + comment.value + "' }}");
};
PrintVisitor.prototype.SubExpression = function (sexpr) {
  return "(".concat(this.callBody(sexpr), ")");
};
PrintVisitor.prototype.callBody = function (callExpr) {
  var params = callExpr.params,
    paramStrings = [],
    hash;
  for (var i = 0, l = params.length; i < l; i++) {
    paramStrings.push(this.accept(params[i]));
  }
  params = paramStrings.length === 0 ? '' : ' [' + paramStrings.join(', ') + ']';
  hash = callExpr.hash ? ' ' + this.accept(callExpr.hash) : '';
  return this.accept(callExpr.path) + params + hash;
};
PrintVisitor.prototype.PathExpression = function (id) {
  var head = typeof id.head === 'string' ? id.head : "[".concat(this.accept(id.head), "]");
  var path = __spreadArray$1([head], id.tail, true).join('/');
  return 'p%' + prefix(id) + path;
};
function prefix(path) {
  if (path.data) {
    return '@';
  } else if (path.this) {
    return 'this.';
  } else {
    return '';
  }
}
PrintVisitor.prototype.StringLiteral = function (string) {
  return '"' + string.value + '"';
};
PrintVisitor.prototype.NumberLiteral = function (number) {
  return 'n%' + number.value;
};
PrintVisitor.prototype.BooleanLiteral = function (bool) {
  return 'b%' + bool.value;
};
PrintVisitor.prototype.UndefinedLiteral = function () {
  return 'UNDEFINED';
};
PrintVisitor.prototype.NullLiteral = function () {
  return 'NULL';
};
PrintVisitor.prototype.ArrayLiteral = function (array) {
  var _this = this;
  return "Array[".concat(array.items.map(function (item) {
    return _this.accept(item);
  }).join(', '), "]");
};
PrintVisitor.prototype.HashLiteral = function (hash) {
  return "Hash{".concat(this.hashPairs(hash), "}");
};
PrintVisitor.prototype.Hash = function (hash) {
  return "HASH{".concat(this.hashPairs(hash), "}");
};
PrintVisitor.prototype.hashPairs = function (hash) {
  var pairs = hash.pairs,
    joinedPairs = [];
  for (var i = 0, l = pairs.length; i < l; i++) {
    joinedPairs.push(this.HashPair(pairs[i]));
  }
  return joinedPairs.join(' ');
};
PrintVisitor.prototype.HashPair = function (pair) {
  return pair.key + '=' + this.accept(pair.value);
};
/* eslint-enable new-cap */

var __spreadArray = function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
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
function preparePath(data, sexpr, parts, loc) {
  loc = this.locInfo(loc);
  var original;
  if (data) {
    original = '@';
  } else if (sexpr) {
    original = sexpr.original + '.';
  } else {
    original = '';
  }
  var tail = [];
  var depth = 0;
  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i].part;
    // If we have [] syntax then we do not treat path references as operators,
    // i.e. foo.[this] resolves to approximately context.foo['this']
    var isLiteral = parts[i].original !== part;
    var separator = parts[i].separator;
    var partPrefix = separator === '.#' ? '#' : '';
    original += (separator || '') + part;
    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
      if (tail.length > 0) {
        throw new Exception('Invalid path: ' + original, {
          loc: loc
        });
      } else if (part === '..') {
        depth++;
      }
    } else {
      tail.push("".concat(partPrefix).concat(part));
    }
  }
  var head = sexpr || tail.shift();
  return {
    type: 'PathExpression',
    this: original.startsWith('this.'),
    data: data,
    depth: depth,
    head: head,
    tail: tail,
    parts: head ? __spreadArray([head], tail, true) : tail,
    original: original,
    loc: loc
  };
}
function prepareMustache(path, params, hash, open, strip, locInfo) {
  // Must use charAt to support IE pre-10
  var escapeFlag = open.charAt(3) || open.charAt(2),
    escaped = escapeFlag !== '{' && escapeFlag !== '&';
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
    var firstLoc = statements[0].loc,
      lastLoc = statements[statements.length - 1].loc;
    /* istanbul ignore else */
    if (firstLoc && lastLoc) {
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
for (var helper in Helpers) {
  if (Object.prototype.hasOwnProperty.call(Helpers, helper)) {
    baseHelpers[helper] = Helpers[helper];
  }
}
function parseWithoutProcessing(input, options) {
  var _a, _b, _c;
  // Just return if an already-compiled AST was passed in.
  if (input.type === 'Program') {
    return input;
  }
  parser.yy = baseHelpers;
  // Altering the shared object here, but this is ok as parser is a sync operation
  parser.yy.locInfo = function (locInfo) {
    return new SourceLocation(options && options.srcName, locInfo);
  };
  var squareSyntax;
  if (typeof ((_a = options === null || options === void 0 ? void 0 : options.syntax) === null || _a === void 0 ? void 0 : _a.square) === 'function') {
    squareSyntax = options.syntax.square;
  } else if (((_b = options === null || options === void 0 ? void 0 : options.syntax) === null || _b === void 0 ? void 0 : _b.square) === 'node') {
    squareSyntax = arrayLiteralNode;
  } else {
    squareSyntax = 'string';
  }
  var hashSyntax;
  if (typeof ((_c = options === null || options === void 0 ? void 0 : options.syntax) === null || _c === void 0 ? void 0 : _c.hash) === 'function') {
    hashSyntax = options.syntax.hash;
  } else {
    hashSyntax = hashLiteralNode;
  }
  parser.yy.syntax = {
    square: squareSyntax,
    hash: hashSyntax
  };
  return parser.parse(input);
}
function arrayLiteralNode(array, loc) {
  return {
    type: 'ArrayLiteral',
    items: array,
    loc: loc
  };
}
function hashLiteralNode(hash, loc) {
  return {
    type: 'HashLiteral',
    pairs: hash.pairs,
    loc: loc
  };
}
function parse(input, options) {
  var ast = parseWithoutProcessing(input, options);
  var strip = new WhitespaceControl(options);
  return strip.accept(ast);
}

/**
 * generated from https://raw.githubusercontent.com/w3c/html/26b5126f96f736f796b9e29718138919dd513744/entities.json
 * do not edit
 */
var namedCharRefs = {
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
var EntityParser = /** @class */function () {
  function EntityParser(named) {
    this.named = named;
  }
  EntityParser.prototype.parse = function (entity) {
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
function isSpace(char) {
  return WSP.test(char);
}
function isAlpha(char) {
  return ALPHA.test(char);
}
function preprocessInput(input) {
  return input.replace(CRLF, '\n');
}
var EventedTokenizer = /** @class */function () {
  function EventedTokenizer(delegate, entityParser, mode) {
    if (mode === void 0) {
      mode = 'precompile';
    }
    this.delegate = delegate;
    this.entityParser = entityParser;
    this.mode = mode;
    this.state = "beforeData" /* beforeData */;
    this.line = -1;
    this.column = -1;
    this.input = '';
    this.index = -1;
    this.tagNameBuffer = '';
    this.states = {
      beforeData: function () {
        var char = this.peek();
        if (char === '<' && !this.isIgnoredEndTag()) {
          this.transitionTo("tagOpen" /* tagOpen */);
          this.markTagStart();
          this.consume();
        } else {
          if (this.mode === 'precompile' && char === '\n') {
            var tag = this.tagNameBuffer.toLowerCase();
            if (tag === 'pre' || tag === 'textarea') {
              this.consume();
            }
          }
          this.transitionTo("data" /* data */);
          this.delegate.beginData();
        }
      },
      data: function () {
        var char = this.peek();
        var tag = this.tagNameBuffer;
        if (char === '<' && !this.isIgnoredEndTag()) {
          this.delegate.finishData();
          this.transitionTo("tagOpen" /* tagOpen */);
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
      tagOpen: function () {
        var char = this.consume();
        if (char === '!') {
          this.transitionTo("markupDeclarationOpen" /* markupDeclarationOpen */);
        } else if (char === '/') {
          this.transitionTo("endTagOpen" /* endTagOpen */);
        } else if (char === '@' || char === ':' || isAlpha(char)) {
          this.transitionTo("tagName" /* tagName */);
          this.tagNameBuffer = '';
          this.delegate.beginStartTag();
          this.appendToTagName(char);
        }
      },
      markupDeclarationOpen: function () {
        var char = this.consume();
        if (char === '-' && this.peek() === '-') {
          this.consume();
          this.transitionTo("commentStart" /* commentStart */);
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
            this.transitionTo("doctype" /* doctype */);
            if (this.delegate.beginDoctype) this.delegate.beginDoctype();
          }
        }
      },
      doctype: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("beforeDoctypeName" /* beforeDoctypeName */);
        }
      },
      beforeDoctypeName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else {
          this.transitionTo("doctypeName" /* doctypeName */);
          if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
        }
      },
      doctypeName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("afterDoctypeName" /* afterDoctypeName */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
        }
      },
      afterDoctypeName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
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
            this.transitionTo("afterDoctypePublicKeyword" /* afterDoctypePublicKeyword */);
          } else if (isSystem) {
            this.transitionTo("afterDoctypeSystemKeyword" /* afterDoctypeSystemKeyword */);
          }
        }
      },
      afterDoctypePublicKeyword: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.transitionTo("beforeDoctypePublicIdentifier" /* beforeDoctypePublicIdentifier */);
          this.consume();
        } else if (char === '"') {
          this.transitionTo("doctypePublicIdentifierDoubleQuoted" /* doctypePublicIdentifierDoubleQuoted */);
          this.consume();
        } else if (char === "'") {
          this.transitionTo("doctypePublicIdentifierSingleQuoted" /* doctypePublicIdentifierSingleQuoted */);
          this.consume();
        } else if (char === '>') {
          this.consume();
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        }
      },
      doctypePublicIdentifierDoubleQuoted: function () {
        var char = this.consume();
        if (char === '"') {
          this.transitionTo("afterDoctypePublicIdentifier" /* afterDoctypePublicIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
        }
      },
      doctypePublicIdentifierSingleQuoted: function () {
        var char = this.consume();
        if (char === "'") {
          this.transitionTo("afterDoctypePublicIdentifier" /* afterDoctypePublicIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
        }
      },
      afterDoctypePublicIdentifier: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("betweenDoctypePublicAndSystemIdentifiers" /* betweenDoctypePublicAndSystemIdentifiers */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '"') {
          this.transitionTo("doctypeSystemIdentifierDoubleQuoted" /* doctypeSystemIdentifierDoubleQuoted */);
        } else if (char === "'") {
          this.transitionTo("doctypeSystemIdentifierSingleQuoted" /* doctypeSystemIdentifierSingleQuoted */);
        }
      },
      betweenDoctypePublicAndSystemIdentifiers: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '"') {
          this.transitionTo("doctypeSystemIdentifierDoubleQuoted" /* doctypeSystemIdentifierDoubleQuoted */);
        } else if (char === "'") {
          this.transitionTo("doctypeSystemIdentifierSingleQuoted" /* doctypeSystemIdentifierSingleQuoted */);
        }
      },
      doctypeSystemIdentifierDoubleQuoted: function () {
        var char = this.consume();
        if (char === '"') {
          this.transitionTo("afterDoctypeSystemIdentifier" /* afterDoctypeSystemIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
        }
      },
      doctypeSystemIdentifierSingleQuoted: function () {
        var char = this.consume();
        if (char === "'") {
          this.transitionTo("afterDoctypeSystemIdentifier" /* afterDoctypeSystemIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
        }
      },
      afterDoctypeSystemIdentifier: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        }
      },
      commentStart: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentStartDash" /* commentStartDash */);
        } else if (char === '>') {
          this.delegate.finishComment();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.appendToCommentData(char);
          this.transitionTo("comment" /* comment */);
        }
      },
      commentStartDash: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentEnd" /* commentEnd */);
        } else if (char === '>') {
          this.delegate.finishComment();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.appendToCommentData('-');
          this.transitionTo("comment" /* comment */);
        }
      },
      comment: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentEndDash" /* commentEndDash */);
        } else {
          this.delegate.appendToCommentData(char);
        }
      },
      commentEndDash: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentEnd" /* commentEnd */);
        } else {
          this.delegate.appendToCommentData('-' + char);
          this.transitionTo("comment" /* comment */);
        }
      },
      commentEnd: function () {
        var char = this.consume();
        if (char === '>') {
          this.delegate.finishComment();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.appendToCommentData('--' + char);
          this.transitionTo("comment" /* comment */);
        }
      },
      tagName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        } else if (char === '/') {
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '>') {
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.appendToTagName(char);
        }
      },
      endTagName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
          this.tagNameBuffer = '';
        } else if (char === '/') {
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
          this.tagNameBuffer = '';
        } else if (char === '>') {
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
          this.tagNameBuffer = '';
        } else {
          this.appendToTagName(char);
        }
      },
      beforeAttributeName: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
          return;
        } else if (char === '/') {
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
          this.consume();
        } else if (char === '>') {
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '=') {
          this.delegate.reportSyntaxError('attribute name cannot start with equals sign');
          this.transitionTo("attributeName" /* attributeName */);
          this.delegate.beginAttribute();
          this.consume();
          this.delegate.appendToAttributeName(char);
        } else {
          this.transitionTo("attributeName" /* attributeName */);
          this.delegate.beginAttribute();
        }
      },
      attributeName: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.transitionTo("afterAttributeName" /* afterAttributeName */);
          this.consume();
        } else if (char === '/') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '=') {
          this.transitionTo("beforeAttributeValue" /* beforeAttributeValue */);
          this.consume();
        } else if (char === '>') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '"' || char === "'" || char === '<') {
          this.delegate.reportSyntaxError(char + ' is not a valid character within attribute names');
          this.consume();
          this.delegate.appendToAttributeName(char);
        } else {
          this.consume();
          this.delegate.appendToAttributeName(char);
        }
      },
      afterAttributeName: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
          return;
        } else if (char === '/') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '=') {
          this.consume();
          this.transitionTo("beforeAttributeValue" /* beforeAttributeValue */);
        } else if (char === '>') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.transitionTo("attributeName" /* attributeName */);
          this.delegate.beginAttribute();
          this.consume();
          this.delegate.appendToAttributeName(char);
        }
      },
      beforeAttributeValue: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
        } else if (char === '"') {
          this.transitionTo("attributeValueDoubleQuoted" /* attributeValueDoubleQuoted */);
          this.delegate.beginAttributeValue(true);
          this.consume();
        } else if (char === "'") {
          this.transitionTo("attributeValueSingleQuoted" /* attributeValueSingleQuoted */);
          this.delegate.beginAttributeValue(true);
          this.consume();
        } else if (char === '>') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.transitionTo("attributeValueUnquoted" /* attributeValueUnquoted */);
          this.delegate.beginAttributeValue(false);
          this.consume();
          this.delegate.appendToAttributeValue(char);
        }
      },
      attributeValueDoubleQuoted: function () {
        var char = this.consume();
        if (char === '"') {
          this.delegate.finishAttributeValue();
          this.transitionTo("afterAttributeValueQuoted" /* afterAttributeValueQuoted */);
        } else if (char === '&') {
          this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },
      attributeValueSingleQuoted: function () {
        var char = this.consume();
        if (char === "'") {
          this.delegate.finishAttributeValue();
          this.transitionTo("afterAttributeValueQuoted" /* afterAttributeValueQuoted */);
        } else if (char === '&') {
          this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },
      attributeValueUnquoted: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        } else if (char === '/') {
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '&') {
          this.consume();
          this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
        } else if (char === '>') {
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.consume();
          this.delegate.appendToAttributeValue(char);
        }
      },
      afterAttributeValueQuoted: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        } else if (char === '/') {
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '>') {
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        }
      },
      selfClosingStartTag: function () {
        var char = this.peek();
        if (char === '>') {
          this.consume();
          this.delegate.markTagAsSelfClosing();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        }
      },
      endTagOpen: function () {
        var char = this.consume();
        if (char === '@' || char === ':' || isAlpha(char)) {
          this.transitionTo("endTagName" /* endTagName */);
          this.tagNameBuffer = '';
          this.delegate.beginEndTag();
          this.appendToTagName(char);
        }
      }
    };
    this.reset();
  }
  EventedTokenizer.prototype.reset = function () {
    this.transitionTo("beforeData" /* beforeData */);
    this.input = '';
    this.tagNameBuffer = '';
    this.index = 0;
    this.line = 1;
    this.column = 0;
    this.delegate.reset();
  };
  EventedTokenizer.prototype.transitionTo = function (state) {
    this.state = state;
  };
  EventedTokenizer.prototype.tokenize = function (input) {
    this.reset();
    this.tokenizePart(input);
    this.tokenizeEOF();
  };
  EventedTokenizer.prototype.tokenizePart = function (input) {
    this.input += preprocessInput(input);
    while (this.index < this.input.length) {
      var handler = this.states[this.state];
      if (handler !== undefined) {
        handler.call(this);
      } else {
        throw new Error("unhandled state " + this.state);
      }
    }
  };
  EventedTokenizer.prototype.tokenizeEOF = function () {
    this.flushData();
  };
  EventedTokenizer.prototype.flushData = function () {
    if (this.state === 'data') {
      this.delegate.finishData();
      this.transitionTo("beforeData" /* beforeData */);
    }
  };
  EventedTokenizer.prototype.peek = function () {
    return this.input.charAt(this.index);
  };
  EventedTokenizer.prototype.consume = function () {
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
  EventedTokenizer.prototype.consumeCharRef = function () {
    var endIndex = this.input.indexOf(';', this.index);
    if (endIndex === -1) {
      return;
    }
    var entity = this.input.slice(this.index, endIndex);
    var chars = this.entityParser.parse(entity);
    if (chars) {
      var count = entity.length;
      // consume the entity chars
      while (count) {
        this.consume();
        count--;
      }
      // consume the `;`
      this.consume();
      return chars;
    }
  };
  EventedTokenizer.prototype.markTagStart = function () {
    this.delegate.tagOpen();
  };
  EventedTokenizer.prototype.appendToTagName = function (char) {
    this.tagNameBuffer += char;
    this.delegate.appendToTagName(char);
  };
  EventedTokenizer.prototype.isIgnoredEndTag = function () {
    var tag = this.tagNameBuffer;
    return tag === 'title' && this.input.substring(this.index, this.index + 8) !== '</title>' || tag === 'style' && this.input.substring(this.index, this.index + 8) !== '</style>' || tag === 'script' && this.input.substring(this.index, this.index + 9) !== '</script>';
  };
  return EventedTokenizer;
}();
const c = /["\x26\xa0]/u,
  h = new RegExp(c.source, "gu"),
  u = /[&<>\xa0]/u,
  p = new RegExp(u.source, "gu");
function d(t) {
  switch (t.charCodeAt(0)) {
    case 160:
      return "&nbsp;";
    case 34:
      return "&quot;";
    case 38:
      return "&amp;";
    default:
      return t;
  }
}
function m(t) {
  switch (t.charCodeAt(0)) {
    case 160:
      return "&nbsp;";
    case 38:
      return "&amp;";
    case 60:
      return "&lt;";
    case 62:
      return "&gt;";
    default:
      return t;
  }
}
function f(t) {
  return c.test(t) ? t.replace(h, d) : t;
}
function g(t, e) {
  return t.loc.isInvisible || e.loc.isInvisible ? 0 : t.loc.startPosition.line < e.loc.startPosition.line || t.loc.startPosition.line === e.loc.startPosition.line && t.loc.startPosition.column < e.loc.startPosition.column ? -1 : t.loc.startPosition.line === e.loc.startPosition.line && t.loc.startPosition.column === e.loc.startPosition.column ? 0 : 1;
}
const b = new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
const w = /^\S/u;
function y(t) {
  return b.has(t.toLowerCase()) && t[0]?.toLowerCase() === t[0];
}
class v {
  constructor(t) {
    this.buffer = "", this.options = t;
  }
  handledByOverride(t, e = false) {
    if (void 0 !== this.options.override) {
      let s = this.options.override(t, this.options);
      if ("string" == typeof s) return e && w.test(s) && (s = ` ${s}`), this.buffer += s, true;
    }
    return false;
  }
  Node(t) {
    switch (t.type) {
      case "MustacheStatement":
      case "BlockStatement":
      case "MustacheCommentStatement":
      case "CommentStatement":
      case "TextNode":
      case "ElementNode":
      case "AttrNode":
      case "Block":
      case "Template":
        return this.TopLevelStatement(t);
      case "StringLiteral":
      case "BooleanLiteral":
      case "NumberLiteral":
      case "UndefinedLiteral":
      case "NullLiteral":
      case "PathExpression":
      case "SubExpression":
        return this.Expression(t);
      case "ConcatStatement":
        return this.ConcatStatement(t);
      case "Hash":
        return this.Hash(t);
      case "HashPair":
        return this.HashPair(t);
      case "ElementModifierStatement":
        return this.ElementModifierStatement(t);
    }
  }
  Expression(t) {
    switch (t.type) {
      case "StringLiteral":
      case "BooleanLiteral":
      case "NumberLiteral":
      case "UndefinedLiteral":
      case "NullLiteral":
        return this.Literal(t);
      case "PathExpression":
        return this.PathExpression(t);
      case "SubExpression":
        return this.SubExpression(t);
    }
  }
  Literal(t) {
    switch (t.type) {
      case "StringLiteral":
        return this.StringLiteral(t);
      case "BooleanLiteral":
        return this.BooleanLiteral(t);
      case "NumberLiteral":
        return this.NumberLiteral(t);
      case "UndefinedLiteral":
        return this.UndefinedLiteral(t);
      case "NullLiteral":
        return this.NullLiteral(t);
    }
  }
  TopLevelStatement(t) {
    switch (t.type) {
      case "MustacheStatement":
        return this.MustacheStatement(t);
      case "BlockStatement":
        return this.BlockStatement(t);
      case "MustacheCommentStatement":
        return this.MustacheCommentStatement(t);
      case "CommentStatement":
        return this.CommentStatement(t);
      case "TextNode":
        return this.TextNode(t);
      case "ElementNode":
        return this.ElementNode(t);
      case "Block":
        return this.Block(t);
      case "Template":
        return this.Template(t);
      case "AttrNode":
        return this.AttrNode(t);
    }
  }
  Template(t) {
    this.TopLevelStatements(t.body);
  }
  Block(t) {
    t.chained && (t.body[0].chained = true), this.handledByOverride(t) || this.TopLevelStatements(t.body);
  }
  TopLevelStatements(t) {
    t.forEach(t => this.TopLevelStatement(t));
  }
  ElementNode(t) {
    this.handledByOverride(t) || (this.OpenElementNode(t), this.TopLevelStatements(t.children), this.CloseElementNode(t));
  }
  OpenElementNode(t) {
    this.buffer += `<${t.tag}`;
    const e = [...t.attributes, ...t.modifiers, ...t.comments].sort(g);
    for (const t of e) switch (this.buffer += " ", t.type) {
      case "AttrNode":
        this.AttrNode(t);
        break;
      case "ElementModifierStatement":
        this.ElementModifierStatement(t);
        break;
      case "MustacheCommentStatement":
        this.MustacheCommentStatement(t);
    }
    t.blockParams.length && this.BlockParams(t.blockParams), t.selfClosing && (this.buffer += " /"), this.buffer += ">";
  }
  CloseElementNode(t) {
    t.selfClosing || y(t.tag) || (this.buffer += `</${t.tag}>`);
  }
  AttrNode(t) {
    if (this.handledByOverride(t)) return;
    let {
      name: e,
      value: s
    } = t;
    this.buffer += e, !e.startsWith("@") && "TextNode" == s.type && 0 === s.chars.length || (this.buffer += "=", this.AttrNodeValue(s));
  }
  AttrNodeValue(t) {
    if ("TextNode" === t.type) {
      let e = '"';
      "raw" === this.options.entityEncoding && t.chars.includes('"') && !t.chars.includes("'") && (e = "'"), this.buffer += e, this.TextNode(t, e), this.buffer += e;
    } else this.Node(t);
  }
  TextNode(t, e) {
    this.handledByOverride(t) || ("raw" === this.options.entityEncoding ? e && t.chars.includes(e) ? this.buffer += f(t.chars) : this.buffer += t.chars : this.buffer += e ? f(t.chars) : function (t) {
      return u.test(t) ? t.replace(p, m) : t;
    }(t.chars));
  }
  MustacheStatement(t) {
    this.handledByOverride(t) || (this.buffer += t.trusting ? "{{{" : "{{", t.strip.open && (this.buffer += "~"), this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), t.strip.close && (this.buffer += "~"), this.buffer += t.trusting ? "}}}" : "}}");
  }
  BlockStatement(t) {
    this.handledByOverride(t) || (t.chained ? (this.buffer += t.inverseStrip.open ? "{{~" : "{{", this.buffer += "else ") : this.buffer += t.openStrip.open ? "{{~#" : "{{#", this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), t.program.blockParams.length && this.BlockParams(t.program.blockParams), t.chained ? this.buffer += t.inverseStrip.close ? "~}}" : "}}" : this.buffer += t.openStrip.close ? "~}}" : "}}", this.Block(t.program), t.inverse && (t.inverse.chained || (this.buffer += t.inverseStrip.open ? "{{~" : "{{", this.buffer += "else", this.buffer += t.inverseStrip.close ? "~}}" : "}}"), this.Block(t.inverse)), t.chained || (this.buffer += t.closeStrip.open ? "{{~/" : "{{/", this.Expression(t.path), this.buffer += t.closeStrip.close ? "~}}" : "}}"));
  }
  BlockParams(t) {
    this.buffer += ` as |${t.join(" ")}|`;
  }
  ConcatStatement(t) {
    this.handledByOverride(t) || (this.buffer += '"', t.parts.forEach(t => {
      "TextNode" === t.type ? this.TextNode(t, '"') : this.Node(t);
    }), this.buffer += '"');
  }
  MustacheCommentStatement(t) {
    this.handledByOverride(t) || (this.buffer += `{{!--${t.value}--}}`);
  }
  ElementModifierStatement(t) {
    this.handledByOverride(t) || (this.buffer += "{{", this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), this.buffer += "}}");
  }
  CommentStatement(t) {
    this.handledByOverride(t) || (this.buffer += `\x3c!--${t.value}--\x3e`);
  }
  PathExpression(t) {
    this.handledByOverride(t) || (this.buffer += t.original);
  }
  SubExpression(t) {
    this.handledByOverride(t) || (this.buffer += "(", this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), this.buffer += ")");
  }
  Params(t) {
    t.length && t.forEach(t => {
      this.buffer += " ", this.Expression(t);
    });
  }
  Hash(t) {
    this.handledByOverride(t, true) || t.pairs.forEach(t => {
      this.buffer += " ", this.HashPair(t);
    });
  }
  HashPair(t) {
    this.handledByOverride(t) || (this.buffer += t.key, this.buffer += "=", this.Node(t.value));
  }
  StringLiteral(t) {
    this.handledByOverride(t) || (this.buffer += JSON.stringify(t.value));
  }
  BooleanLiteral(t) {
    this.handledByOverride(t) || (this.buffer += String(t.value));
  }
  NumberLiteral(t) {
    this.handledByOverride(t) || (this.buffer += String(t.value));
  }
  UndefinedLiteral(t) {
    this.handledByOverride(t) || (this.buffer += "undefined");
  }
  NullLiteral(t) {
    this.handledByOverride(t) || (this.buffer += "null");
  }
  print(t) {
    let {
      options: e
    } = this;
    if (e.override) {
      let s = e.override(t, e);
      if (void 0 !== s) return s;
    }
    return this.buffer = "", this.Node(t), this.buffer;
  }
}
function S(t, e = {
  entityEncoding: "transformed"
}) {
  return t ? new v(e).print(t) : "";
}
function E(t) {
  return !!t && t.length > 0;
}
function N(t) {
  return 0 === t.length ? void 0 : t[t.length - 1];
}
function C(t) {
  return 0 === t.length ? void 0 : t[0];
}
const A = Object.freeze({
    line: 1,
    column: 0
  }),
  T = Object.freeze({
    source: "(synthetic)",
    start: A,
    end: A
  }),
  L = Object.freeze({
    source: "(nonexistent)",
    start: A,
    end: A
  }),
  B = Object.freeze({
    source: "(broken)",
    start: A,
    end: A
  }),
  O = "CharPosition",
  H = "HbsPosition",
  F = "InternalsSynthetic",
  $ = "NonExistent",
  z = "Broken",
  M = "MATCH_ANY",
  I = "IS_INVISIBLE";
class _ {
  constructor(t) {
    this._whens = t;
  }
  first(t) {
    for (const e of this._whens) {
      const s = e.match(t);
      if (E(s)) return s[0];
    }
    return null;
  }
}
class V {
  get(t, e) {
    let s = this._map.get(t);
    return s || (s = e(), this._map.set(t, s), s);
  }
  add(t, e) {
    this._map.set(t, e);
  }
  match(t) {
    const e = function (t) {
        switch (t) {
          case z:
          case F:
          case $:
            return I;
          default:
            return t;
        }
      }(t),
      s = [],
      r = this._map.get(e),
      n = this._map.get(M);
    return r && s.push(r), n && s.push(n), s;
  }
  constructor() {
    this._map = new Map();
  }
}
function U(t) {
  return t(new D()).validate();
}
class D {
  validate() {
    return (t, e) => this.matchFor(t.kind, e.kind)(t, e);
  }
  matchFor(t, e) {
    const s = this._whens.match(t);
    return new _(s).first(e);
  }
  when(t, e, s) {
    return this._whens.get(t, () => new V()).add(e, s), this;
  }
  constructor() {
    this._whens = new V();
  }
}
class j {
  static synthetic(t) {
    let e = J.synthetic(t);
    return new j({
      loc: e,
      chars: t
    });
  }
  static load(t, e) {
    return new j({
      loc: J.load(t, e[1]),
      chars: e[0]
    });
  }
  constructor(t) {
    this.loc = t.loc, this.chars = t.chars;
  }
  getString() {
    return this.chars;
  }
  serialize() {
    return [this.chars, this.loc.serialize()];
  }
}
class J {
  static get NON_EXISTENT() {
    return new W($, L).wrap();
  }
  static load(e, s) {
    return "number" == typeof s ? J.forCharPositions(e, s, s) : "string" == typeof s ? J.synthetic(s) : Array.isArray(s) ? J.forCharPositions(e, s[0], s[1]) : s === $ ? J.NON_EXISTENT : s === z ? J.broken(B) : void A$1(s);
  }
  static forHbsLoc(t, e) {
    const s = new X(t, e.start),
      r = new X(t, e.end);
    return new R(t, {
      start: s,
      end: r
    }, e).wrap();
  }
  static forCharPositions(t, e, s) {
    const r = new Q(t, e),
      n = new Q(t, s);
    return new K(t, {
      start: r,
      end: n
    }).wrap();
  }
  static synthetic(t) {
    return new W(F, L, t).wrap();
  }
  static broken(t = B) {
    return new W(z, t).wrap();
  }
  constructor(t) {
    var e;
    this.data = t, this.isInvisible = (e = t.kind) !== O && e !== H;
  }
  getStart() {
    return this.data.getStart().wrap();
  }
  getEnd() {
    return this.data.getEnd().wrap();
  }
  get loc() {
    const t = this.data.toHbsSpan();
    return null === t ? B : t.toHbsLoc();
  }
  get module() {
    return this.data.getModule();
  }
  get startPosition() {
    return this.loc.start;
  }
  get endPosition() {
    return this.loc.end;
  }
  toJSON() {
    return this.loc;
  }
  withStart(t) {
    return G(t.data, this.data.getEnd());
  }
  withEnd(t) {
    return G(this.data.getStart(), t.data);
  }
  asString() {
    return this.data.asString();
  }
  toSlice(t) {
    const e = this.data.asString();
    return JSON.stringify(e), JSON.stringify(t), new j({
      loc: this,
      chars: t || e
    });
  }
  get start() {
    return this.loc.start;
  }
  set start(t) {
    this.data.locDidUpdate({
      start: t
    });
  }
  get end() {
    return this.loc.end;
  }
  set end(t) {
    this.data.locDidUpdate({
      end: t
    });
  }
  get source() {
    return this.module;
  }
  collapse(t) {
    switch (t) {
      case "start":
        return this.getStart().collapsed();
      case "end":
        return this.getEnd().collapsed();
    }
  }
  extend(t) {
    return G(this.data.getStart(), t.data.getEnd());
  }
  serialize() {
    return this.data.serialize();
  }
  slice({
    skipStart: t = 0,
    skipEnd: e = 0
  }) {
    return G(this.getStart().move(t).data, this.getEnd().move(-e).data);
  }
  sliceStartChars({
    skipStart: t = 0,
    chars: e
  }) {
    return G(this.getStart().move(t).data, this.getStart().move(t + e).data);
  }
  sliceEndChars({
    skipEnd: t = 0,
    chars: e
  }) {
    return G(this.getEnd().move(t - e).data, this.getStart().move(-t).data);
  }
}
class K {
  #t;
  constructor(t, e) {
    this.source = t, this.charPositions = e, this.kind = O, this.#t = null;
  }
  wrap() {
    return new J(this);
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
  locDidUpdate() {}
  toHbsSpan() {
    let t = this.#t;
    if (null === t) {
      const e = this.charPositions.start.toHbsPos(),
        s = this.charPositions.end.toHbsPos();
      t = this.#t = null === e || null === s ? Y : new R(this.source, {
        start: e,
        end: s
      });
    }
    return t === Y ? null : t;
  }
  serialize() {
    const {
      start: {
        charPos: t
      },
      end: {
        charPos: e
      }
    } = this.charPositions;
    return t === e ? t : [t, e];
  }
  toCharPosSpan() {
    return this;
  }
}
class R {
  #e;
  #s;
  constructor(t, e, s = null) {
    this.source = t, this.hbsPositions = e, this.kind = H, this.#e = null, this.#s = s;
  }
  serialize() {
    const t = this.toCharPosSpan();
    return null === t ? z : t.wrap().serialize();
  }
  wrap() {
    return new J(this);
  }
  updateProvided(t, e) {
    this.#s && (this.#s[e] = t), this.#e = null, this.#s = {
      start: t,
      end: t
    };
  }
  locDidUpdate({
    start: t,
    end: e
  }) {
    void 0 !== t && (this.updateProvided(t, "start"), this.hbsPositions.start = new X(this.source, t, null)), void 0 !== e && (this.updateProvided(e, "end"), this.hbsPositions.end = new X(this.source, e, null));
  }
  asString() {
    const t = this.toCharPosSpan();
    return null === t ? "" : t.asString();
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
    let t = this.#e;
    if (null === t) {
      const e = this.hbsPositions.start.toCharPos(),
        s = this.hbsPositions.end.toCharPos();
      if (!e || !s) return t = this.#e = Y, null;
      t = this.#e = new K(this.source, {
        start: e,
        end: s
      });
    }
    return t === Y ? null : t;
  }
}
class W {
  constructor(t, e, s = null) {
    this.kind = t, this.loc = e, this.string = s;
  }
  serialize() {
    switch (this.kind) {
      case z:
      case $:
        return this.kind;
      case F:
        return this.string || "";
    }
  }
  wrap() {
    return new J(this);
  }
  asString() {
    return this.string || "";
  }
  locDidUpdate({
    start: t,
    end: e
  }) {
    void 0 !== t && (this.loc.start = t), void 0 !== e && (this.loc.end = e);
  }
  getModule() {
    return "an unknown module";
  }
  getStart() {
    return new Z(this.kind, this.loc.start);
  }
  getEnd() {
    return new Z(this.kind, this.loc.end);
  }
  toCharPosSpan() {
    return this;
  }
  toHbsSpan() {
    return null;
  }
  toHbsLoc() {
    return B;
  }
}
const G = U(t => t.when(H, H, (t, e) => new R(t.source, {
    start: t,
    end: e
  }).wrap()).when(O, O, (t, e) => new K(t.source, {
    start: t,
    end: e
  }).wrap()).when(O, H, (t, e) => {
    const s = e.toCharPos();
    return null === s ? new W(z, B).wrap() : G(t, s);
  }).when(H, O, (t, e) => {
    const s = t.toCharPos();
    return null === s ? new W(z, B).wrap() : G(s, e);
  }).when(I, M, t => new W(t.kind, B).wrap()).when(M, I, (t, e) => new W(e.kind, B).wrap())),
  Y = "BROKEN";
class q {
  static forHbsPos(t, e) {
    return new X(t, e, null).wrap();
  }
  static broken(t = A) {
    return new Z(z, t).wrap();
  }
  constructor(t) {
    this.data = t;
  }
  get offset() {
    const t = this.data.toCharPos();
    return null === t ? null : t.offset;
  }
  eql(t) {
    return tt(this.data, t.data);
  }
  until(t) {
    return G(this.data, t.data);
  }
  move(t) {
    const e = this.data.toCharPos();
    if (null === e) return q.broken();
    {
      const s = e.offset + t;
      return e.source.validate(s) ? new Q(e.source, s).wrap() : q.broken();
    }
  }
  collapsed() {
    return G(this.data, this.data);
  }
  toJSON() {
    return this.data.toJSON();
  }
}
class Q {
  constructor(t, e) {
    this.source = t, this.charPos = e, this.kind = O, this._locPos = null;
  }
  toCharPos() {
    return this;
  }
  toJSON() {
    const t = this.toHbsPos();
    return null === t ? A : t.toJSON();
  }
  wrap() {
    return new q(this);
  }
  get offset() {
    return this.charPos;
  }
  toHbsPos() {
    let t = this._locPos;
    if (null === t) {
      const e = this.source.hbsPosFor(this.charPos);
      this._locPos = t = null === e ? Y : new X(this.source, e, this.charPos);
    }
    return t === Y ? null : t;
  }
}
class X {
  constructor(t, e, s = null) {
    this.source = t, this.hbsPos = e, this.kind = H, this._charPos = null === s ? null : new Q(t, s);
  }
  toCharPos() {
    let t = this._charPos;
    if (null === t) {
      const e = this.source.charPosFor(this.hbsPos);
      this._charPos = t = null === e ? Y : new Q(this.source, e);
    }
    return t === Y ? null : t;
  }
  toJSON() {
    return this.hbsPos;
  }
  wrap() {
    return new q(this);
  }
  toHbsPos() {
    return this;
  }
}
class Z {
  constructor(t, e) {
    this.kind = t, this.pos = e;
  }
  toCharPos() {
    return null;
  }
  toJSON() {
    return this.pos;
  }
  wrap() {
    return new q(this);
  }
  get offset() {
    return null;
  }
}
const tt = U(t => t.when(H, H, ({
  hbsPos: t
}, {
  hbsPos: e
}) => t.column === e.column && t.line === e.line).when(O, O, ({
  charPos: t
}, {
  charPos: e
}) => t === e).when(O, H, ({
  offset: t
}, e) => t === e.toCharPos()?.offset).when(H, O, (t, {
  offset: e
}) => t.toCharPos()?.offset === e).when(M, M, () => false));
class et {
  static from(t, e = {}) {
    return new et(t, e.meta?.moduleName);
  }
  constructor(t, e = "an unknown module") {
    this.source = t, this.module = e;
  }
  validate(t) {
    return t >= 0 && t <= this.source.length;
  }
  slice(t, e) {
    return this.source.slice(t, e);
  }
  offsetFor(t, e) {
    return q.forHbsPos(this, {
      line: t,
      column: e
    });
  }
  spanFor({
    start: t,
    end: e
  }) {
    return J.forHbsLoc(this, {
      start: {
        line: t.line,
        column: t.column
      },
      end: {
        line: e.line,
        column: e.column
      }
    });
  }
  hbsPosFor(t) {
    let e = 0,
      s = 0;
    if (t > this.source.length) return null;
    for (;;) {
      let r = this.source.indexOf("\n", s);
      if (t <= r || -1 === r) return {
        line: e + 1,
        column: t - s
      };
      e += 1, s = r + 1;
    }
  }
  charPosFor(t) {
    let {
        line: e,
        column: s
      } = t,
      r = this.source.length,
      n = 0,
      a = 0;
    for (; a < r;) {
      let t = this.source.indexOf("\n", a);
      if (-1 === t && (t = this.source.length), n === e - 1) return a + s > t ? t : a + s;
      if (-1 === t) return 0;
      n += 1, a = t + 1;
    }
    return r;
  }
}
class st {
  static range(t, e = J.NON_EXISTENT) {
    return new st(t.map(rt)).getRangeOffset(e);
  }
  constructor(t = []) {
    this._span = t;
  }
  add(t) {
    this._span.push(t);
  }
  getRangeOffset(t) {
    if (E(this._span)) {
      let t = C(this._span),
        e = N(this._span);
      return t.extend(e);
    }
    return t;
  }
}
function rt(t) {
  if (Array.isArray(t)) {
    let e = C(t),
      s = N(t);
    return rt(e).extend(rt(s));
  }
  return t instanceof J ? t : t.loc;
}
function ot(t, e) {
  let {
      module: s,
      loc: r
    } = e,
    {
      line: n,
      column: a
    } = r.start,
    i = e.asString(),
    o = i ? `\n\n|\n|  ${i.split("\n").join("\n|  ")}\n|\n\n` : "",
    l = new Error(`${t}: ${o}(error occurred in '${s}' @ line ${n} : column ${a})`);
  return l.name = "SyntaxError", l.location = e, l.code = i, l;
}
const lt = {
    Template: ["body"],
    Block: ["body"],
    MustacheStatement: ["path", "params", "hash"],
    BlockStatement: ["path", "params", "hash", "program", "inverse"],
    ElementModifierStatement: ["path", "params", "hash"],
    CommentStatement: [],
    MustacheCommentStatement: [],
    ElementNode: ["attributes", "modifiers", "children", "comments"],
    AttrNode: ["value"],
    TextNode: [],
    ConcatStatement: ["parts"],
    SubExpression: ["path", "params", "hash"],
    PathExpression: [],
    StringLiteral: [],
    BooleanLiteral: [],
    NumberLiteral: [],
    NullLiteral: [],
    UndefinedLiteral: [],
    Hash: ["pairs"],
    HashPair: ["value"]
  },
  ct = function () {
    function t(t, e, s, r) {
      let n = Error.call(this, t);
      this.key = r, this.message = t, this.node = e, this.parent = s, n.stack && (this.stack = n.stack);
    }
    return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
  }();
function ht(t, e, s) {
  return new ct("Cannot remove a node unless it is part of an array", t, e, s);
}
function ut(t, e, s) {
  return new ct("Cannot replace a node with multiple nodes unless it is part of an array", t, e, s);
}
function pt(t, e) {
  return new ct("Replacing and removing in key handlers is not yet supported.", t, null, e);
}
class dt {
  constructor(t, e = null, s = null) {
    this.node = t, this.parent = e, this.parentKey = s;
  }
  get parentNode() {
    return this.parent ? this.parent.node : null;
  }
  parents() {
    return {
      [Symbol.iterator]: () => new mt(this)
    };
  }
}
class mt {
  constructor(t) {
    this.path = t;
  }
  next() {
    return this.path.parent ? (this.path = this.path.parent, {
      done: false,
      value: this.path
    }) : {
      done: true,
      value: null
    };
  }
}
function ft(t) {
  return "function" == typeof t ? t : t.enter;
}
function gt(t) {
  return "function" == typeof t ? void 0 : t.exit;
}
function bt(t, e) {
  let s,
    r,
    n,
    {
      node: a,
      parent: i,
      parentKey: o
    } = e,
    l = function (t, e) {
      if (t.Program && ("Template" === e && !t.Template || "Block" === e && !t.Block)) return t.Program;
      let s = t[e];
      return void 0 !== s ? s : t.All;
    }(t, a.type);
  if (void 0 !== l && (s = ft(l), r = gt(l)), void 0 !== s && (n = s(a, e)), null != n) {
    if (JSON.stringify(a) !== JSON.stringify(n)) return Array.isArray(n) ? (yt(t, n, i, o), n) : bt(t, new dt(n, i, o)) || n;
    n = void 0;
  }
  if (void 0 === n) {
    let s = lt[a.type];
    for (let r = 0; r < s.length; r++) wt(t, l, e, s[r]);
    void 0 !== r && (n = r(a, e));
  }
  return n;
}
function kt(t, e, s) {
  t[e] = s;
}
function wt(t, e, s, r) {
  let n,
    a,
    {
      node: i
    } = s,
    o = function (t, e) {
      return t[e];
    }(i, r);
  if (o) {
    if (void 0 !== e) {
      let t = function (t, e) {
        let s = "function" != typeof t ? t.keys : void 0;
        if (void 0 === s) return;
        let r = s[e];
        return void 0 !== r ? r : s.All;
      }(e, r);
      void 0 !== t && (n = ft(t), a = gt(t));
    }
    if (void 0 !== n && void 0 !== n(i, r)) throw pt(i, r);
    if (Array.isArray(o)) yt(t, o, s, r);else {
      let e = bt(t, new dt(o, s, r));
      void 0 !== e && function (t, e, s, r) {
        if (null === r) throw ht(s, t, e);
        if (Array.isArray(r)) {
          if (1 !== r.length) throw 0 === r.length ? ht(s, t, e) : ut(s, t, e);
          kt(t, e, r[0]);
        } else kt(t, e, r);
      }(i, r, o, e);
    }
    if (void 0 !== a && void 0 !== a(i, r)) throw pt(i, r);
  }
}
function yt(t, e, s, r) {
  for (let n = 0; n < e.length; n++) {
    let a = e[n],
      i = bt(t, new dt(a, s, r));
    void 0 !== i && (n += vt(e, n, i) - 1);
  }
}
function vt(t, e, s) {
  return null === s ? (t.splice(e, 1), 0) : Array.isArray(s) ? (t.splice(e, 1, ...s), s.length) : (t.splice(e, 1, s), 1);
}
function St(t, e) {
  bt(e, new dt(t));
}
class xt {
  constructor(t) {
    this.order = t, this.stack = [];
  }
  visit(t, e) {
    t && (this.stack.push(t), "post" === this.order ? (this.children(t, e), e(t, this)) : (e(t, this), this.children(t, e)), this.stack.pop());
  }
  children(t, e) {
    switch (t.type) {
      case "Block":
      case "Template":
        return void Pt(this, t.body, e);
      case "ElementNode":
        return void Pt(this, t.children, e);
      case "BlockStatement":
        return this.visit(t.program, e), void this.visit(t.inverse || null, e);
      default:
        return;
    }
  }
}
function Pt(t, e, s) {
  for (const r of e) t.visit(r, s);
}
function Et(t, e) {
  (function (t) {
    switch (t.type) {
      case "Block":
      case "Template":
        return t.body;
      case "ElementNode":
        return t.children;
    }
  })(t).push(e);
}
function Nt(t) {
  return "StringLiteral" === t.type || "BooleanLiteral" === t.type || "NumberLiteral" === t.type || "NullLiteral" === t.type || "UndefinedLiteral" === t.type;
}
let Ct;
function At() {
  return Ct || (Ct = new et("", "(synthetic)")), Ct;
}
function Tt(t, e) {
  return Vt.var({
    name: t,
    loc: zt(e || null)
  });
}
function Lt(t, e) {
  let s = zt(e || null);
  if ("string" != typeof t) {
    if ("type" in t) return t;
    {
      t.head.indexOf(".");
      let {
        head: r,
        tail: n
      } = t;
      return Vt.path({
        head: Vt.head({
          original: r,
          loc: s.sliceStartChars({
            chars: r.length
          })
        }),
        tail: n,
        loc: zt(e || null)
      });
    }
  }
  let {
    head: r,
    tail: n
  } = function (t, e) {
    let [s, ...r] = t.split("."),
      n = Vt.head({
        original: s,
        loc: zt(e || null)
      });
    return Vt.path({
      head: n,
      tail: r,
      loc: zt(e || null)
    });
  }(t, s);
  return Vt.path({
    head: r,
    tail: n,
    loc: s
  });
}
function Bt(t, e, s) {
  return Vt.literal({
    type: t,
    value: e,
    loc: zt(s || null)
  });
}
function Ot(t = [], e) {
  return Vt.hash({
    pairs: t,
    loc: zt(e || null)
  });
}
function Ht(t) {
  return t.map(t => "string" == typeof t ? Vt.var({
    name: t,
    loc: J.synthetic(t)
  }) : t);
}
function Ft(t = [], e = [], s = false, r) {
  return Vt.blockItself({
    body: t,
    params: Ht(e),
    chained: s,
    loc: zt(r || null)
  });
}
function $t(t = [], e = [], s) {
  return Vt.template({
    body: t,
    blockParams: e,
    loc: zt(s || null)
  });
}
function zt(...t) {
  if (1 === t.length) {
    let e = t[0];
    return e && "object" == typeof e ? J.forHbsLoc(At(), e) : J.forHbsLoc(At(), T);
  }
  {
    let [e, s, r, n, a] = t,
      i = a ? new et("", a) : At();
    return J.forHbsLoc(i, {
      start: {
        line: e,
        column: s
      },
      end: {
        line: r || e,
        column: n || s
      }
    });
  }
}
var Mt = {
  mustache: function (t, e = [], s = Ot([]), r = false, n, a) {
    return Vt.mustache({
      path: Lt(t),
      params: e,
      hash: s,
      trusting: r,
      strip: a,
      loc: zt(n || null)
    });
  },
  block: function (t, e, s, r, n = null, a, i, o, l) {
    let c,
      h = null;
    return c = "Template" === r.type ? Vt.blockItself({
      params: Ht(r.blockParams),
      body: r.body,
      loc: r.loc
    }) : r, "Template" === n?.type ? (h = Vt.blockItself({
      params: [],
      body: n.body,
      loc: n.loc
    })) : h = n, Vt.block({
      path: Lt(t),
      params: e || [],
      hash: s || Ot([]),
      defaultBlock: c,
      elseBlock: h,
      loc: zt(a || null),
      openStrip: i,
      inverseStrip: o,
      closeStrip: l
    });
  },
  comment: function (t, e) {
    return Vt.comment({
      value: t,
      loc: zt(e || null)
    });
  },
  mustacheComment: function (t, e) {
    return Vt.mustacheComment({
      value: t,
      loc: zt(e || null)
    });
  },
  element: function (t, e = {}) {
    let s,
      r,
      {
        attrs: n,
        blockParams: a,
        modifiers: i,
        comments: o,
        children: l,
        openTag: c,
        closeTag: h,
        loc: u
      } = e;
    "string" == typeof t ? t.endsWith("/") ? (s = Lt(t.slice(0, -1)), r = true) : s = Lt(t) : "type" in t ? (s = t) : "path" in t ? (s = t.path, r = t.selfClosing) : (s = Lt(t.name), r = t.selfClosing);
    let p = a?.map(t => "string" == typeof t ? Tt(t) : t),
      d = null;
    return h ? d = zt(h) : void 0 === h && (d = r || y(s.original) ? null : zt(null)), Vt.element({
      path: s,
      selfClosing: r || false,
      attributes: n || [],
      params: p || [],
      modifiers: i || [],
      comments: o || [],
      children: l || [],
      openTag: zt(c || null),
      closeTag: d,
      loc: zt(u || null)
    });
  },
  elementModifier: function (t, e, s, r) {
    return Vt.elementModifier({
      path: Lt(t),
      params: e || [],
      hash: s || Ot([]),
      loc: zt(r || null)
    });
  },
  attr: function (t, e, s) {
    return Vt.attr({
      name: t,
      value: e,
      loc: zt(s || null)
    });
  },
  text: function (t = "", e) {
    return Vt.text({
      chars: t,
      loc: zt(e || null)
    });
  },
  sexpr: function (t, e = [], s = Ot([]), r) {
    return Vt.sexpr({
      path: Lt(t),
      params: e,
      hash: s,
      loc: zt(r || null)
    });
  },
  concat: function (t, e) {
    if (!E(t)) throw new Error("b.concat requires at least one part");
    return Vt.concat({
      parts: t,
      loc: zt(e || null)
    });
  },
  hash: Ot,
  pair: function (t, e, s) {
    return Vt.pair({
      key: t,
      value: e,
      loc: zt(s || null)
    });
  },
  literal: Bt,
  program: function (t, e, s) {
    return e && e.length ? Ft(t, e, false, s) : $t(t, [], s);
  },
  blockItself: Ft,
  template: $t,
  loc: zt,
  pos: function (t, e) {
    return Vt.pos({
      line: t,
      column: e
    });
  },
  path: Lt,
  fullPath: function (t, e = [], s) {
    return Vt.path({
      head: t,
      tail: e,
      loc: zt(s || null)
    });
  },
  head: function (t, e) {
    return Vt.head({
      original: t,
      loc: zt(e || null)
    });
  },
  at: function (t, e) {
    return Vt.atName({
      name: t,
      loc: zt(e || null)
    });
  },
  var: Tt,
  this: function (t) {
    return Vt.this({
      loc: zt(t || null)
    });
  },
  string: It("StringLiteral"),
  boolean: It("BooleanLiteral"),
  number: It("NumberLiteral"),
  undefined: () => Bt("UndefinedLiteral", void 0),
  null: () => Bt("NullLiteral", null)
};
function It(t) {
  return function (e, s) {
    return Bt(t, e, s);
  };
}
const _t = {
    close: false,
    open: false
  },
  Vt = new class {
    pos({
      line: t,
      column: e
    }) {
      return {
        line: t,
        column: e
      };
    }
    blockItself({
      body: t,
      params: e,
      chained: s = false,
      loc: r
    }) {
      return {
        type: "Block",
        body: t,
        params: e,
        get blockParams() {
          return this.params.map(t => t.name);
        },
        set blockParams(t) {
          this.params = t.map(t => Vt.var({
            name: t,
            loc: J.synthetic(t)
          }));
        },
        chained: s,
        loc: r
      };
    }
    template({
      body: t,
      blockParams: e,
      loc: s
    }) {
      return {
        type: "Template",
        body: t,
        blockParams: e,
        loc: s
      };
    }
    mustache({
      path: t,
      params: e,
      hash: s,
      trusting: r,
      loc: n,
      strip: a = _t
    }) {
      return function ({
        path: t,
        params: e,
        hash: s,
        trusting: r,
        strip: n,
        loc: a
      }) {
        const i = {
          type: "MustacheStatement",
          path: t,
          params: e,
          hash: s,
          trusting: r,
          strip: n,
          loc: a
        };
        return Object.defineProperty(i, "escaped", {
          enumerable: false,
          get() {
            return !this.trusting;
          },
          set(t) {
            this.trusting = !t;
          }
        }), i;
      }({
        path: t,
        params: e,
        hash: s,
        trusting: r,
        strip: a,
        loc: n
      });
    }
    block({
      path: t,
      params: e,
      hash: s,
      defaultBlock: r,
      elseBlock: n = null,
      loc: a,
      openStrip: i = _t,
      inverseStrip: o = _t,
      closeStrip: l = _t
    }) {
      return {
        type: "BlockStatement",
        path: t,
        params: e,
        hash: s,
        program: r,
        inverse: n,
        loc: a,
        openStrip: i,
        inverseStrip: o,
        closeStrip: l
      };
    }
    comment({
      value: t,
      loc: e
    }) {
      return {
        type: "CommentStatement",
        value: t,
        loc: e
      };
    }
    mustacheComment({
      value: t,
      loc: e
    }) {
      return {
        type: "MustacheCommentStatement",
        value: t,
        loc: e
      };
    }
    concat({
      parts: t,
      loc: e
    }) {
      return {
        type: "ConcatStatement",
        parts: t,
        loc: e
      };
    }
    element({
      path: t,
      selfClosing: e,
      attributes: s,
      modifiers: r,
      params: n,
      comments: a,
      children: i,
      openTag: o,
      closeTag: l,
      loc: c
    }) {
      let h = e;
      return {
        type: "ElementNode",
        path: t,
        attributes: s,
        modifiers: r,
        params: n,
        comments: a,
        children: i,
        openTag: o,
        closeTag: l,
        loc: c,
        get tag() {
          return this.path.original;
        },
        set tag(t) {
          this.path.original = t;
        },
        get blockParams() {
          return this.params.map(t => t.name);
        },
        set blockParams(t) {
          this.params = t.map(t => Vt.var({
            name: t,
            loc: J.synthetic(t)
          }));
        },
        get selfClosing() {
          return h;
        },
        set selfClosing(t) {
          h = t, this.closeTag = t ? null : J.synthetic(`</${this.tag}>`);
        }
      };
    }
    elementModifier({
      path: t,
      params: e,
      hash: s,
      loc: r
    }) {
      return {
        type: "ElementModifierStatement",
        path: t,
        params: e,
        hash: s,
        loc: r
      };
    }
    attr({
      name: t,
      value: e,
      loc: s
    }) {
      return {
        type: "AttrNode",
        name: t,
        value: e,
        loc: s
      };
    }
    text({
      chars: t,
      loc: e
    }) {
      return {
        type: "TextNode",
        chars: t,
        loc: e
      };
    }
    sexpr({
      path: t,
      params: e,
      hash: s,
      loc: r
    }) {
      return {
        type: "SubExpression",
        path: t,
        params: e,
        hash: s,
        loc: r
      };
    }
    path({
      head: t,
      tail: e,
      loc: s
    }) {
      return function ({
        head: t,
        tail: e,
        loc: s
      }) {
        const r = {
          type: "PathExpression",
          head: t,
          tail: e,
          get original() {
            return [this.head.original, ...this.tail].join(".");
          },
          set original(t) {
            let [e, ...s] = t.split(".");
            this.head = Mt.head(e, this.head.loc), this.tail = s;
          },
          loc: s
        };
        return Object.defineProperty(r, "parts", {
          enumerable: false,
          get() {
            let t = this.original.split(".");
            return "this" === t[0] ? t.shift() : t[0].startsWith("@") && (t[0] = t[0].slice(1)), Object.freeze(t);
          },
          set(t) {
            let e = [...t];
            "this" === e[0] || e[0]?.startsWith("@") || ("ThisHead" === this.head.type ? e.unshift("this") : "AtHead" === this.head.type && (e[0] = `@${e[0]}`)), this.original = e.join(".");
          }
        }), Object.defineProperty(r, "this", {
          enumerable: false,
          get() {
            return "ThisHead" === this.head.type;
          }
        }), Object.defineProperty(r, "data", {
          enumerable: false,
          get() {
            return "AtHead" === this.head.type;
          }
        }), r;
      }({
        head: t,
        tail: e,
        loc: s
      });
    }
    head({
      original: t,
      loc: e
    }) {
      return "this" === t ? this.this({
        loc: e
      }) : "@" === t[0] ? this.atName({
        name: t,
        loc: e
      }) : this.var({
        name: t,
        loc: e
      });
    }
    this({
      loc: t
    }) {
      return {
        type: "ThisHead",
        get original() {
          return "this";
        },
        loc: t
      };
    }
    atName({
      name: t,
      loc: e
    }) {
      let s = "";
      const r = {
        type: "AtHead",
        get name() {
          return s;
        },
        set name(t) {
          t.indexOf("."), s = t;
        },
        get original() {
          return this.name;
        },
        set original(t) {
          this.name = t;
        },
        loc: e
      };
      return r.name = t, r;
    }
    var({
      name: t,
      loc: e
    }) {
      let s = "";
      const r = {
        type: "VarHead",
        get name() {
          return s;
        },
        set name(t) {
          t.indexOf("."), s = t;
        },
        get original() {
          return this.name;
        },
        set original(t) {
          this.name = t;
        },
        loc: e
      };
      return r.name = t, r;
    }
    hash({
      pairs: t,
      loc: e
    }) {
      return {
        type: "Hash",
        pairs: t,
        loc: e
      };
    }
    pair({
      key: t,
      value: e,
      loc: s
    }) {
      return {
        type: "HashPair",
        key: t,
        value: e,
        loc: s
      };
    }
    literal({
      type: t,
      value: e,
      loc: s
    }) {
      return function ({
        type: t,
        value: e,
        loc: s
      }) {
        const r = {
          type: t,
          value: e,
          loc: s
        };
        return Object.defineProperty(r, "original", {
          enumerable: false,
          get() {
            return this.value;
          },
          set(t) {
            this.value = t;
          }
        }), r;
      }({
        type: t,
        value: e,
        loc: s
      });
    }
  }();
class Ut {
  constructor(t, e = new EntityParser(namedCharRefs), s = "precompile") {
    this.elementStack = [], this.currentAttribute = null, this.currentNode = null, this.source = t, this.lines = t.source.split(/\r\n?|\n/u), this.tokenizer = new EventedTokenizer(this, e, s);
  }
  offset() {
    let {
      line: t,
      column: e
    } = this.tokenizer;
    return this.source.offsetFor(t, e);
  }
  pos({
    line: t,
    column: e
  }) {
    return this.source.offsetFor(t, e);
  }
  finish(t) {
    return x({}, t, {
      loc: t.start.until(this.offset())
    });
  }
  get currentAttr() {
    return this.currentAttribute;
  }
  get currentTag() {
    let t = this.currentNode;
    return t;
  }
  get currentStartTag() {
    let t = this.currentNode;
    return t;
  }
  get currentEndTag() {
    let t = this.currentNode;
    return t;
  }
  get currentComment() {
    let t = this.currentNode;
    return t;
  }
  get currentData() {
    let t = this.currentNode;
    return t;
  }
  acceptNode(t) {
    return this[t.type](t);
  }
  currentElement() {
    return N(this.elementStack);
  }
  sourceForNode(t, e) {
    let s,
      r,
      n,
      a = t.loc.start.line - 1,
      i = a - 1,
      o = t.loc.start.column,
      l = [];
    for (e ? (r = e.loc.end.line - 1, n = e.loc.end.column) : (r = t.loc.end.line - 1, n = t.loc.end.column); i < r;) i++, s = this.lines[i], i === a ? a === r ? l.push(s.slice(o, n)) : l.push(s.slice(o)) : i === r ? l.push(s.slice(0, n)) : l.push(s);
    return l.join("\n");
  }
}
const Dt = "beforeAttributeName";
class jt extends Ut {
  parse(t, e) {
    let s = Vt.template({
        body: [],
        blockParams: e,
        loc: this.source.spanFor(t.loc)
      }),
      r = this.parseProgram(s, t);
    return this.pendingError?.eof(r.loc.getEnd()), r;
  }
  Program(t, e) {
    let s = Vt.blockItself({
      body: [],
      params: e,
      chained: t.chained,
      loc: this.source.spanFor(t.loc)
    });
    return this.parseProgram(s, t);
  }
  parseProgram(t, e) {
    if (0 === e.body.length) return t;
    let s;
    try {
      this.elementStack.push(t);
      for (let t of e.body) this.acceptNode(t);
    } finally {
      s = this.elementStack.pop();
    }
    if (t !== s) {
      if ("ElementNode" === s?.type) throw ot(`Unclosed element \`${s.tag}\``, s.loc);
    }
    return t;
  }
  BlockStatement(t) {
    if ("comment" === this.tokenizer.state) return void this.appendToCommentData(this.sourceForNode(t));
    if ("data" !== this.tokenizer.state && "beforeData" !== this.tokenizer.state) throw ot("A block may only be used inside an HTML element or another block.", this.source.spanFor(t.loc));
    const {
        path: e,
        params: s,
        hash: r
      } = Jt(this, t),
      n = this.source.spanFor(t.loc);
    let a,
      i = [];
    if (t.program.blockParams?.length) {
      let e = r.loc.collapse("end");
      e = t.program.loc ? e.withEnd(this.source.spanFor(t.program.loc).getStart()) : t.program.body[0] ? e.withEnd(this.source.spanFor(t.program.body[0].loc).getStart()) : e.withEnd(n.getEnd()), a = Rt(this.source, t, e);
      const s = e.asString();
      let o = s.indexOf("|") + 1;
      const l = s.indexOf("|", o);
      for (const r of t.program.blockParams) {
        let t, n;
        t = o >= l ? -1 : s.indexOf(r, o), -1 === t || t + r.length > l ? (o = l, n = this.source.spanFor(L)) : (o = t, n = e.sliceStartChars({
          skipStart: o,
          chars: r.length
        }), o += r.length), i.push(Vt.var({
          name: r,
          loc: n
        }));
      }
    } else a = Rt(this.source, t, n);
    const o = this.Program(a.program, i),
      l = a.inverse ? this.Program(a.inverse, []) : null,
      c = Vt.block({
        path: e,
        params: s,
        hash: r,
        defaultBlock: o,
        elseBlock: l,
        loc: this.source.spanFor(t.loc),
        openStrip: t.openStrip,
        inverseStrip: t.inverseStrip,
        closeStrip: t.closeStrip
      });
    Et(this.currentElement(), c);
  }
  MustacheStatement(t) {
    this.pendingError?.mustache(this.source.spanFor(t.loc));
    const {
      tokenizer: e
    } = this;
    if ("comment" === e.state) return void this.appendToCommentData(this.sourceForNode(t));
    let s;
    const {
      escaped: r,
      loc: n,
      strip: a
    } = t;
    if ("original" in t.path && "...attributes" === t.path.original) throw ot("Illegal use of ...attributes", this.source.spanFor(t.loc));
    if (Nt(t.path)) s = Vt.mustache({
      path: this.acceptNode(t.path),
      params: [],
      hash: Vt.hash({
        pairs: [],
        loc: this.source.spanFor(t.path.loc).collapse("end")
      }),
      trusting: !r,
      loc: this.source.spanFor(n),
      strip: a
    });else {
      const {
        path: e,
        params: i,
        hash: o
      } = Jt(this, t);
      s = Vt.mustache({
        path: e,
        params: i,
        hash: o,
        trusting: !r,
        loc: this.source.spanFor(n),
        strip: a
      });
    }
    switch (e.state) {
      case "tagOpen":
      case "tagName":
        throw ot("Cannot use mustaches in an elements tagname", s.loc);
      case "beforeAttributeName":
        Kt(this.currentStartTag, s);
        break;
      case "attributeName":
      case "afterAttributeName":
        this.beginAttributeValue(false), this.finishAttributeValue(), Kt(this.currentStartTag, s), e.transitionTo(Dt);
        break;
      case "afterAttributeValueQuoted":
        Kt(this.currentStartTag, s), e.transitionTo(Dt);
        break;
      case "beforeAttributeValue":
        this.beginAttributeValue(false), this.appendDynamicAttributeValuePart(s), e.transitionTo("attributeValueUnquoted");
        break;
      case "attributeValueDoubleQuoted":
      case "attributeValueSingleQuoted":
      case "attributeValueUnquoted":
        this.appendDynamicAttributeValuePart(s);
        break;
      default:
        Et(this.currentElement(), s);
    }
    return s;
  }
  appendDynamicAttributeValuePart(t) {
    this.finalizeTextPart();
    const e = this.currentAttr;
    e.isDynamic = true, e.parts.push(t);
  }
  finalizeTextPart() {
    const t = this.currentAttr.currentPart;
    null !== t && (this.currentAttr.parts.push(t), this.startTextPart());
  }
  startTextPart() {
    this.currentAttr.currentPart = null;
  }
  ContentStatement(t) {
    !function (t, e) {
      let s = e.loc.start.line,
        r = e.loc.start.column;
      const n = function (t, e) {
        if ("" === e) return {
          lines: t.split("\n").length - 1,
          columns: 0
        };
        const [s] = t.split(e),
          r = s.split(/\n/u),
          n = r.length - 1;
        return {
          lines: n,
          columns: r[n].length
        };
      }(e.original, e.value);
      s += n.lines, n.lines ? r = n.columns : r += n.columns, t.line = s, t.column = r;
    }(this.tokenizer, t), this.tokenizer.tokenizePart(t.value), this.tokenizer.flushData();
  }
  CommentStatement(t) {
    const {
      tokenizer: e
    } = this;
    if ("comment" === e.state) return this.appendToCommentData(this.sourceForNode(t)), null;
    const {
        value: s,
        loc: r
      } = t,
      n = Vt.mustacheComment({
        value: s,
        loc: this.source.spanFor(r)
      });
    switch (e.state) {
      case "beforeAttributeName":
      case "afterAttributeName":
        this.currentStartTag.comments.push(n);
        break;
      case "beforeData":
      case "data":
        Et(this.currentElement(), n);
        break;
      default:
        throw ot(`Using a Handlebars comment when in the \`${e.state}\` state is not supported`, this.source.spanFor(t.loc));
    }
    return n;
  }
  PartialStatement(t) {
    throw ot("Handlebars partials are not supported", this.source.spanFor(t.loc));
  }
  PartialBlockStatement(t) {
    throw ot("Handlebars partial blocks are not supported", this.source.spanFor(t.loc));
  }
  Decorator(t) {
    throw ot("Handlebars decorators are not supported", this.source.spanFor(t.loc));
  }
  DecoratorBlock(t) {
    throw ot("Handlebars decorator blocks are not supported", this.source.spanFor(t.loc));
  }
  SubExpression(t) {
    const {
      path: e,
      params: s,
      hash: r
    } = Jt(this, t);
    return Vt.sexpr({
      path: e,
      params: s,
      hash: r,
      loc: this.source.spanFor(t.loc)
    });
  }
  PathExpression(t) {
    const {
      original: e
    } = t;
    let s;
    if (-1 !== e.indexOf("/")) {
      if ("./" === e.slice(0, 2)) throw ot('Using "./" is not supported in Glimmer and unnecessary', this.source.spanFor(t.loc));
      if ("../" === e.slice(0, 3)) throw ot('Changing context using "../" is not supported in Glimmer', this.source.spanFor(t.loc));
      if (-1 !== e.indexOf(".")) throw ot("Mixing '.' and '/' in paths is not supported in Glimmer; use only '.' to separate property paths", this.source.spanFor(t.loc));
      s = [t.parts.join("/")];
    } else {
      if ("." === e) throw ot("'.' is not a supported path in Glimmer; check for a path with a trailing '.'", this.source.spanFor(t.loc));
      s = t.parts;
    }
    let r,
      n = false;
    if (/^this(?:\..+)?$/u.test(e) && (n = true), n) r = Vt.this({
      loc: this.source.spanFor({
        start: t.loc.start,
        end: {
          line: t.loc.start.line,
          column: t.loc.start.column + 4
        }
      })
    });else if (t.data) {
      const e = s.shift();
      if (void 0 === e) throw ot("Attempted to parse a path expression, but it was not valid. Paths beginning with @ must start with a-z.", this.source.spanFor(t.loc));
      r = Vt.atName({
        name: `@${e}`,
        loc: this.source.spanFor({
          start: t.loc.start,
          end: {
            line: t.loc.start.line,
            column: t.loc.start.column + e.length + 1
          }
        })
      });
    } else {
      const e = s.shift();
      if (void 0 === e) throw ot("Attempted to parse a path expression, but it was not valid. Paths must start with a-z or A-Z.", this.source.spanFor(t.loc));
      r = Vt.var({
        name: e,
        loc: this.source.spanFor({
          start: t.loc.start,
          end: {
            line: t.loc.start.line,
            column: t.loc.start.column + e.length
          }
        })
      });
    }
    return Vt.path({
      head: r,
      tail: s,
      loc: this.source.spanFor(t.loc)
    });
  }
  Hash(t) {
    const e = t.pairs.map(t => Vt.pair({
      key: t.key,
      value: this.acceptNode(t.value),
      loc: this.source.spanFor(t.loc)
    }));
    return Vt.hash({
      pairs: e,
      loc: this.source.spanFor(t.loc)
    });
  }
  StringLiteral(t) {
    return Vt.literal({
      type: "StringLiteral",
      value: t.value,
      loc: this.source.spanFor(t.loc)
    });
  }
  BooleanLiteral(t) {
    return Vt.literal({
      type: "BooleanLiteral",
      value: t.value,
      loc: this.source.spanFor(t.loc)
    });
  }
  NumberLiteral(t) {
    return Vt.literal({
      type: "NumberLiteral",
      value: t.value,
      loc: this.source.spanFor(t.loc)
    });
  }
  UndefinedLiteral(t) {
    return Vt.literal({
      type: "UndefinedLiteral",
      value: void 0,
      loc: this.source.spanFor(t.loc)
    });
  }
  NullLiteral(t) {
    return Vt.literal({
      type: "NullLiteral",
      value: null,
      loc: this.source.spanFor(t.loc)
    });
  }
  constructor(...t) {
    super(...t), this.pendingError = null;
  }
}
function Jt(t, e) {
  let s;
  switch (e.path.type) {
    case "PathExpression":
      s = t.PathExpression(e.path);
      break;
    case "SubExpression":
      s = t.SubExpression(e.path);
      break;
    case "StringLiteral":
    case "UndefinedLiteral":
    case "NullLiteral":
    case "NumberLiteral":
    case "BooleanLiteral":
      {
        let s;
        throw s = "BooleanLiteral" === e.path.type ? e.path.original.toString() : "StringLiteral" === e.path.type ? `"${e.path.original}"` : "NullLiteral" === e.path.type ? "null" : "NumberLiteral" === e.path.type ? e.path.value.toString() : "undefined", ot(`${e.path.type} "${"StringLiteral" === e.path.type ? e.path.original : s}" cannot be called as a sub-expression, replace (${s}) with ${s}`, t.source.spanFor(e.path.loc));
      }
  }
  const r = e.params.map(e => t.acceptNode(e)),
    n = E(r) ? N(r).loc : s.loc;
  return {
    path: s,
    params: r,
    hash: e.hash ? t.Hash(e.hash) : Vt.hash({
      pairs: [],
      loc: t.source.spanFor(n).collapse("end")
    })
  };
}
function Kt(t, e) {
  const {
    path: s,
    params: r,
    hash: n,
    loc: a
  } = e;
  if (Nt(s)) {
    const r = `{{${function (t) {
      return "UndefinedLiteral" === t.type ? "undefined" : JSON.stringify(t.value);
    }(s)}}}`;
    throw ot(`In <${t.name} ... ${r} ..., ${r} is not a valid modifier`, e.loc);
  }
  const i = Vt.elementModifier({
    path: s,
    params: r,
    hash: n,
    loc: a
  });
  t.modifiers.push(i);
}
function Rt(t, e, s) {
  if (!e.program.loc) {
    const r = e.program.body.at(0),
      n = e.program.body.at(-1);
    if (r && n) e.program.loc = {
      ...r.loc,
      end: n.loc.end
    };else {
      const r = t.spanFor(e.loc);
      e.program.loc = s.withEnd(r.getEnd());
    }
  }
  let r = t.spanFor(e.program.loc).getEnd();
  return e.inverse && !e.inverse.loc && (e.inverse.loc = r.collapsed()), e;
}
function Wt(t) {
  return /[\t\n\f ]/u.test(t);
}
class Gt extends jt {
  reset() {
    this.currentNode = null;
  }
  beginComment() {
    this.currentNode = {
      type: "CommentStatement",
      value: "",
      start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
    };
  }
  appendToCommentData(t) {
    this.currentComment.value += t;
  }
  finishComment() {
    Et(this.currentElement(), Vt.comment(this.finish(this.currentComment)));
  }
  beginData() {
    this.currentNode = {
      type: "TextNode",
      chars: "",
      start: this.offset()
    };
  }
  appendToData(t) {
    this.currentData.chars += t;
  }
  finishData() {
    Et(this.currentElement(), Vt.text(this.finish(this.currentData)));
  }
  tagOpen() {
    this.tagOpenLine = this.tokenizer.line, this.tagOpenColumn = this.tokenizer.column;
  }
  beginStartTag() {
    this.currentNode = {
      type: "StartTag",
      name: "",
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
      type: "EndTag",
      name: "",
      start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
    };
  }
  finishTag() {
    let t = this.finish(this.currentTag);
    if ("StartTag" === t.type) {
      if (this.finishStartTag(), ":" === t.name) throw ot("Invalid named block named detected, you may have created a named block without a name, or you may have began your name with a number. Named blocks must have names that are at least one character long, and begin with a lower case letter", this.source.spanFor({
        start: this.currentTag.start.toJSON(),
        end: this.offset().toJSON()
      }));
      (b.has(t.name) || t.selfClosing) && this.finishEndTag(true);
    } else this.finishEndTag(false);
  }
  finishStartTag() {
    let {
        name: t,
        nameStart: e,
        nameEnd: s
      } = this.currentStartTag,
      r = e.until(s),
      [n, ...a] = t.split("."),
      i = Vt.path({
        head: Vt.head({
          original: n,
          loc: r.sliceStartChars({
            chars: n.length
          })
        }),
        tail: a,
        loc: r
      }),
      {
        attributes: o,
        modifiers: l,
        comments: c,
        params: h,
        selfClosing: u,
        loc: p
      } = this.finish(this.currentStartTag),
      d = Vt.element({
        path: i,
        selfClosing: u,
        attributes: o,
        modifiers: l,
        comments: c,
        params: h,
        children: [],
        openTag: p,
        closeTag: u ? null : J.broken(),
        loc: p
      });
    this.elementStack.push(d);
  }
  finishEndTag(t) {
    let {
        start: e
      } = this.currentTag,
      s = this.finish(this.currentTag),
      r = this.elementStack.pop();
    this.validateEndTag(s, r, t);
    let n = this.currentElement();
    t ? r.closeTag = null : r.selfClosing ? r.closeTag : r.closeTag = e.until(this.offset()), r.loc = r.loc.withEnd(this.offset()), Et(n, Vt.element(r));
  }
  markTagAsSelfClosing() {
    let t = this.currentTag;
    if ("StartTag" !== t.type) throw ot("Invalid end tag: closing tag must not be self-closing", this.source.spanFor({
      start: t.start.toJSON(),
      end: this.offset().toJSON()
    }));
    t.selfClosing = true;
  }
  appendToTagName(t) {
    let e = this.currentTag;
    if (e.name += t, "StartTag" === e.type) {
      let t = this.offset();
      null === e.nameStart && (e.nameStart = t.move(-1)), e.nameEnd = t;
    }
  }
  beginAttribute() {
    let t = this.offset();
    this.currentAttribute = {
      name: "",
      parts: [],
      currentPart: null,
      isQuoted: false,
      isDynamic: false,
      start: t,
      valueSpan: t.collapsed()
    };
  }
  appendToAttributeName(t) {
    this.currentAttr.name += t, "as" === this.currentAttr.name && this.parsePossibleBlockParams();
  }
  beginAttributeValue(t) {
    this.currentAttr.isQuoted = t, this.startTextPart(), this.currentAttr.valueSpan = this.offset().collapsed();
  }
  appendToAttributeValue(t) {
    let e = this.currentAttr.parts,
      s = e[e.length - 1],
      r = this.currentAttr.currentPart;
    if (r) r.chars += t, r.loc = r.loc.withEnd(this.offset());else {
      let e = this.offset();
      e = "\n" === t ? s ? s.loc.getEnd() : this.currentAttr.valueSpan.getStart() : e.move(-1), this.currentAttr.currentPart = Vt.text({
        chars: t,
        loc: e.collapsed()
      });
    }
  }
  finishAttributeValue() {
    this.finalizeTextPart();
    let t = this.currentTag,
      e = this.offset();
    if ("EndTag" === t.type) throw ot("Invalid end tag: closing tag must not have attributes", this.source.spanFor({
      start: t.start.toJSON(),
      end: e.toJSON()
    }));
    let {
      name: s,
      parts: r,
      start: n,
      isQuoted: a,
      isDynamic: i,
      valueSpan: o
    } = this.currentAttr;
    if (s.startsWith("|") && 0 === r.length && !a && !i) throw ot("Invalid block parameters syntax: block parameters must be preceded by the `as` keyword", n.until(n.move(s.length)));
    let l = this.assembleAttributeValue(r, a, i, n.until(e));
    l.loc = o.withEnd(e);
    let c = Vt.attr({
      name: s,
      value: l,
      loc: n.until(e)
    });
    this.currentStartTag.attributes.push(c);
  }
  parsePossibleBlockParams() {
    const t = /[!"#%&'()*+./;<=>@[\\\]^`{|}~]/u;
    const e = this.currentStartTag,
      s = this.currentAttr;
    let r = {
      state: "PossibleAs"
    };
    const n = {
      PossibleAs: t => {
        if (Wt(t)) r = {
          state: "BeforeStartPipe"
        }, this.tokenizer.transitionTo("afterAttributeName"), this.tokenizer.consume();else {
          if ("|" === t) throw ot('Invalid block parameters syntax: expecting at least one space character between "as" and "|"', s.start.until(this.offset().move(1)));
          r = {
            state: "Done"
          };
        }
      },
      BeforeStartPipe: t => {
        Wt(t) ? this.tokenizer.consume() : "|" === t ? (r = {
          state: "BeforeBlockParamName"
        }, this.tokenizer.transitionTo("beforeAttributeName"), this.tokenizer.consume()) : r = {
          state: "Done"
        };
      },
      BeforeBlockParamName: t => {
        if (Wt(t)) this.tokenizer.consume();else if ("" === t) r = {
          state: "Done"
        }, this.pendingError = {
          mustache(t) {
            throw ot("Invalid block parameters syntax: mustaches cannot be used inside parameters list", t);
          },
          eof(t) {
            throw ot('Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list', s.start.until(t));
          }
        };else if ("|" === t) {
          if (0 === e.params.length) throw ot("Invalid block parameters syntax: empty parameters list, expecting at least one identifier", s.start.until(this.offset().move(1)));
          r = {
            state: "AfterEndPipe"
          }, this.tokenizer.consume();
        } else {
          if (">" === t || "/" === t) throw ot('Invalid block parameters syntax: incomplete parameters list, expecting "|" but the tag was closed prematurely', s.start.until(this.offset().move(1)));
          r = {
            state: "BlockParamName",
            name: t,
            start: this.offset()
          }, this.tokenizer.consume();
        }
      },
      BlockParamName: n => {
        if ("" === n) r = {
          state: "Done"
        }, this.pendingError = {
          mustache(t) {
            throw ot("Invalid block parameters syntax: mustaches cannot be used inside parameters list", t);
          },
          eof(t) {
            throw ot('Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list', s.start.until(t));
          }
        };else if ("|" === n || Wt(n)) {
          let s = r.start.until(this.offset());
          if ("this" === r.name || t.test(r.name)) throw ot(`Invalid block parameters syntax: invalid identifier name \`${r.name}\``, s);
          e.params.push(Vt.var({
            name: r.name,
            loc: s
          })), r = "|" === n ? {
            state: "AfterEndPipe"
          } : {
            state: "BeforeBlockParamName"
          }, this.tokenizer.consume();
        } else {
          if (">" === n || "/" === n) throw ot('Invalid block parameters syntax: expecting "|" but the tag was closed prematurely', s.start.until(this.offset().move(1)));
          r.name += n, this.tokenizer.consume();
        }
      },
      AfterEndPipe: t => {
        Wt(t) ? this.tokenizer.consume() : "" === t ? (r = {
          state: "Done"
        }, this.pendingError = {
          mustache(t) {
            throw ot("Invalid block parameters syntax: modifiers cannot follow parameters list", t);
          },
          eof(t) {
            throw ot('Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list', s.start.until(t));
          }
        }) : ">" === t || "/" === t ? r = {
          state: "Done"
        } : (r = {
          state: "Error",
          message: 'Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list',
          start: this.offset()
        }, this.tokenizer.consume());
      },
      Error: t => {
        if ("" === t || "/" === t || ">" === t || Wt(t)) throw ot(r.message, r.start.until(this.offset()));
        this.tokenizer.consume();
      },
      Done: () => {}
    };
    let a;
    do {
      a = this.tokenizer.peek(), n[r.state](a);
    } while ("Done" !== r.state && "" !== a);
  }
  reportSyntaxError(t) {
    throw ot(t, this.offset().collapsed());
  }
  assembleConcatenatedValue(t) {
    let e = C(t),
      s = N(t);
    return Vt.concat({
      parts: t,
      loc: this.source.spanFor(e.loc).extend(this.source.spanFor(s.loc))
    });
  }
  validateEndTag(t, e, s) {
    if (b.has(t.name) && !s) throw ot(`<${t.name}> elements do not need end tags. You should remove it`, t.loc);
    if ("ElementNode" !== e.type) throw ot(`Closing tag </${t.name}> without an open tag`, t.loc);
    if (e.tag !== t.name) throw ot(`Closing tag </${t.name}> did not match last open tag <${e.tag}> (on line ${e.loc.startPosition.line})`, t.loc);
  }
  assembleAttributeValue(t, e, s, r) {
    if (s) {
      if (e) return this.assembleConcatenatedValue(t);
      {
        const [e, s] = t;
        if (void 0 === s || "TextNode" === s.type && "/" === s.chars) return e;
        throw ot("An unquoted attribute value must be a string or a mustache, preceded by whitespace or a '=' character, and followed by whitespace, a '>' character, or '/>'", r);
      }
    }
    return E(t) ? t[0] : Vt.text({
      chars: "",
      loc: r
    });
  }
  constructor(...t) {
    super(...t), this.tagOpenLine = 0, this.tagOpenColumn = 0;
  }
}
const Yt = {
  parse: Qt,
  builders: Mt,
  print: S,
  traverse: St,
  Walker: xt
};
class qt extends EntityParser {
  constructor() {
    super({});
  }
  parse() {}
}
function Qt(t, s = {}) {
  let a,
    i,
    o,
    l = s.mode || "precompile";
  "string" == typeof t ? (a = new et(t, s.meta?.moduleName), i = "codemod" === l ? parseWithoutProcessing(t, s.parseOptions) : parse(t, s.parseOptions)) : t instanceof et ? (a = t, i = "codemod" === l ? parseWithoutProcessing(t.source, s.parseOptions) : parse(t.source, s.parseOptions)) : (a = new et("", s.meta?.moduleName), i = t), "codemod" === l && (o = new qt());
  let c = J.forCharPositions(a, 0, a.source.length);
  i.loc = {
    source: "(program)",
    start: c.startPosition,
    end: c.endPosition
  };
  let h = new Gt(a, o, l).parse(i, s.locals ?? []);
  if (s.plugins?.ast) for (const t of s.plugins.ast) St(h, t(x({}, s, {
    syntax: Yt
  }, {
    plugins: void 0
  })).visitor);
  return h;
}
function te(t) {
  if (void 0 !== t) {
    const s = t;
    return {
      fields: () => class {
        constructor(t) {
          this.type = s, x(this, t);
        }
      }
    };
  }
  return {
    fields: () => class {
      constructor(t) {
        x(this, t);
      }
    }
  };
}
class ee extends te().fields() {
  static empty(t) {
    return new ee({
      loc: t,
      positional: se.empty(t),
      named: re.empty(t)
    });
  }
  static named(t) {
    return new ee({
      loc: t.loc,
      positional: se.empty(t.loc.collapse("end")),
      named: t
    });
  }
  nth(t) {
    return this.positional.nth(t);
  }
  get(t) {
    return this.named.get(t);
  }
  isEmpty() {
    return this.positional.isEmpty() && this.named.isEmpty();
  }
}
class se extends te().fields() {
  static empty(t) {
    return new se({
      loc: t,
      exprs: []
    });
  }
  get size() {
    return this.exprs.length;
  }
  nth(t) {
    return this.exprs[t] || null;
  }
  isEmpty() {
    return 0 === this.exprs.length;
  }
}
class re extends te().fields() {
  static empty(t) {
    return new re({
      loc: t,
      entries: []
    });
  }
  get size() {
    return this.entries.length;
  }
  get(t) {
    let e = this.entries.filter(e => e.name.chars === t)[0];
    return e ? e.value : null;
  }
  isEmpty() {
    return 0 === this.entries.length;
  }
}
class ne {
  constructor(t) {
    this.loc = t.name.loc.extend(t.value.loc), this.name = t.name, this.value = t.value;
  }
}
class ae extends te("HtmlAttr").fields() {}
class ie extends te("SplatAttr").fields() {}
class oe extends te().fields() {
  toNamedArgument() {
    return new ne({
      name: this.name,
      value: this.value
    });
  }
}
class le extends te("ElementModifier").fields() {}
class ce extends te("GlimmerComment").fields() {}
class he extends te("HtmlText").fields() {}
class ue extends te("HtmlComment").fields() {}
class pe extends te("AppendContent").fields() {
  get callee() {
    return "Call" === this.value.type ? this.value.callee : this.value;
  }
  get args() {
    return "Call" === this.value.type ? this.value.args : ee.empty(this.value.loc.collapse("end"));
  }
}
class de extends te("InvokeBlock").fields() {}
class me extends te("InvokeComponent").fields() {
  get args() {
    let t = this.componentArgs.map(t => t.toNamedArgument());
    return ee.named(new re({
      loc: st.range(t, this.callee.loc.collapse("end")),
      entries: t
    }));
  }
}
class fe extends te("SimpleElement").fields() {
  get args() {
    let t = this.componentArgs.map(t => t.toNamedArgument());
    return ee.named(new re({
      loc: st.range(t, this.tag.loc.collapse("end")),
      entries: t
    }));
  }
}
class ge extends te("Literal").fields() {
  toSlice() {
    return new j({
      loc: this.loc,
      chars: this.value
    });
  }
}
class be extends te("Path").fields() {}
class ke extends te("Keyword").fields() {}
class we extends te("Call").fields() {}
class ye extends te("Interpolate").fields() {}
class ve extends te().fields() {}
class Se extends te().fields() {}
class xe extends te().fields() {
  get(t) {
    return this.blocks.filter(e => e.name.chars === t)[0] || null;
  }
}
class Pe extends te().fields() {
  get args() {
    let t = this.componentArgs.map(t => t.toNamedArgument());
    return ee.named(new re({
      loc: st.range(t, this.name.loc.collapse("end")),
      entries: t
    }));
  }
}
class Ee extends te("This").fields() {}
class Ne extends te("Arg").fields() {}
class Ce extends te("Local").fields() {}
class Ae extends te("Free").fields() {}
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
  if ((options.targetFormat ?? 'wire') === 'wire') {
    let {
      compiler
    } = options;
    if (!compiler) {
      throw new Error(`when targetFormat==="wire" you must provide the ember template compiler`);
    }
    return {
      outputModuleOverrides: {},
      enableLegacyModules: [],
      transforms: [],
      ...options,
      targetFormat: 'wire',
      compiler
    };
  } else {
    return {
      outputModuleOverrides: {},
      enableLegacyModules: [],
      transforms: [],
      ...options,
      targetFormat: 'hbs'
    };
  }
}
function makePlugin(loadOptions) {
  return async function htmlbarsInlinePrecompile(babel, opts) {
    let normalizedOpts = normalizeOpts(await loadOptions(opts));
    const plugin = {
      visitor: {
        Program: {
          enter(path, state) {
            state.templateFactory = templateFactoryConfig(normalizedOpts);
            state.util = new srcExports.ImportUtil(babel, path);
            state.program = path;
            state.recursionGuard = new Set();
          },
          exit(_path, state) {
            if (normalizedOpts.targetFormat === 'wire') {
              for (let {
                moduleName,
                export: exportName
              } of configuredModules(normalizedOpts)) {
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
          let config = referencesInlineCompiler(tagPath, normalizedOpts);
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
          if (normalizedOpts.targetFormat === 'wire') {
            insertCompiledTemplate(babel, state, normalizedOpts, template, path, {}, config, undefined);
          } else {
            insertTransformedTemplate(babel, state, normalizedOpts, template, path, {}, config, undefined);
          }
        },
        CallExpression(path, state) {
          let calleePath = path.get('callee');
          if (!calleePath.isIdentifier()) {
            return;
          }
          let config = referencesInlineCompiler(calleePath, normalizedOpts);
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
          switch (firstArg?.node.type) {
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
            userTypedOptions = new ExpressionParser(babel).parseObjectExpression(calleePath.node.name, secondArg, config.enableScope, Boolean(config.rfc931Support));
            if (config.rfc931Support && userTypedOptions.component) {
              backingClass = userTypedOptions.component;
            }
          }
          if (normalizedOpts.targetFormat === 'wire') {
            insertCompiledTemplate(babel, state, normalizedOpts, template, path, userTypedOptions, config, backingClass);
          } else {
            insertTransformedTemplate(babel, state, normalizedOpts, template, path, userTypedOptions, config, backingClass);
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
function* configuredModules(normalizedOpts) {
  for (let moduleConfig of INLINE_PRECOMPILE_MODULES) {
    if (moduleConfig.moduleName !== '@ember/template-compilation' && moduleConfig.moduleName !== '@ember/template-compiler' && !normalizedOpts.enableLegacyModules.includes(moduleConfig.moduleName)) {
      continue;
    }
    yield moduleConfig;
  }
}
function referencesInlineCompiler(path, normalizedOpts) {
  for (let moduleConfig of configuredModules(normalizedOpts)) {
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
    return new ScopeLocals({
      mode: 'implicit',
      jsPath: target,
      mayUseLexicalThis
    });
  } else if (userTypedOptions.scope) {
    return userTypedOptions.scope;
  } else {
    return new ScopeLocals({
      mode: 'explicit'
    });
  }
}
function buildPrecompileOptions(babel, target, state, normalizedOpts, template, userTypedOptions, config, scope) {
  let jsutils = new JSUtils(babel, state, target, scope.add.bind(scope), state.util);
  let meta = Object.assign({
    jsutils
  }, userTypedOptions?.meta);
  let output = {
    contents: template,
    // we've extended meta to add jsutils, but the types in @glimmer/syntax
    // don't account for extension
    meta: meta,
    // This is here so it's *always* the real filename.
    filename: state.filename,
    plugins: {
      // the cast is needed here only because our meta is extended. That is,
      // these plugins can access meta.jsutils.
      ast: [...normalizedOpts.transforms, scope.crawl()]
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
      if (scopeLocals.has(path.node.name) && path.node.name !== scopeLocals.get(path.node.name)) {
        // this identifier has different names in hbs vs js, so we need to
        // replace the hbs name in the template compiler output with the js
        // name
        path.replaceWith(babel.types.identifier(scopeLocals.get(path.node.name)));
      }
      // this is where we tell babel's scope system about the new reference we
      // just introduced. @babel/plugin-transform-typescript in particular
      // cares a lot about those references being present.
      path.scope.getBinding(path.node.name)?.reference(path);
    }
  });
}
function insertCompiledTemplate(babel, state, opts, template, target, userTypedOptions, config, backingClass) {
  let t = babel.types;
  let scopeLocals = buildScopeLocals(userTypedOptions, config, target, !backingClass);
  let options = buildPrecompileOptions(babel, target, state, opts, template, userTypedOptions, config, scopeLocals);
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
    let templateFactoryIdentifier = i.import(state.templateFactory.moduleName, state.templateFactory.exportName);
    let expression = t.callExpression(templateFactoryIdentifier, [templateExpression]);
    if (config.rfc931Support) {
      expression = t.callExpression(i.import('@ember/component', 'setComponentTemplate'), [expression, backingClass?.node ?? t.callExpression(i.import('@ember/component/template-only', 'default', 'templateOnly'), [])]);
    }
    return expression;
  });
  remapAndBindIdentifiers(target, babel, scopeLocals);
}
function insertTransformedTemplate(babel, state, normalizedOpts, template, target, userTypedOptions, formatOptions, backingClass) {
  let t = babel.types;
  let scopeLocals = buildScopeLocals(userTypedOptions, formatOptions, target, !backingClass);
  let options = buildPrecompileOptions(babel, target, state, normalizedOpts, template, userTypedOptions, formatOptions, scopeLocals);
  let ast = Qt(template, {
    ...options,
    mode: 'codemod'
  });
  let transformed = S(ast, {
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
    state.util.replaceWith(target, i => babel.types.callExpression(i.import('@ember/component', 'setComponentTemplate'), [target.node, backingClass?.node ?? babel.types.callExpression(i.import('@ember/component/template-only', 'default', 'templateOnly'), [])]));
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
  let moduleName = '@ember/template-factory';
  let exportName = 'createTemplateFactory';
  let overrides = opts.outputModuleOverrides[moduleName]?.[exportName];
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
var plugin = makePlugin(async options => options);

export { plugin as default, makePlugin };
