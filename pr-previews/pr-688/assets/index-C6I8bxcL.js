const globalId = `dt7948`;

var src = {};
var sanitize$1 = {};
Object.defineProperty(sanitize$1, "__esModule", {
  value: true
});
sanitize$1.sanitize = void 0;
function sanitize(identifier) {
  let cleaned = identifier.replace(new RegExp(`(?<!^)(?:${illegalChar.source})([a-z])`, "g"), (_m, letter) => letter.toUpperCase());
  cleaned = cleaned.replace(new RegExp(illegalChar.source, "g"), "");
  return cleaned;
}
sanitize$1.sanitize = sanitize;
const illegalChar = new RegExp("^[^a-zA-Z_$]|(?<=.)[^a-zA-Z_$0-9]");
Object.defineProperty(src, "__esModule", {
  value: true
});
var ImportUtil_1 = src.ImportUtil = void 0;
const sanitize_1 = sanitize$1;
class ImportUtil {
  constructor(babel, program) {
    this.babel = babel;
    this.program = program;
    this.t = babel.types;
  }
  // remove one imported binding. If this is the last thing imported from the
  // given moduleSpecifier, the whole statement will also be removed.
  removeImport(moduleSpecifier, exportedName) {
    for (let topLevelPath of this.program.get("body")) {
      if (!matchModule(topLevelPath, moduleSpecifier)) {
        continue;
      }
      let importSpecifierPath = topLevelPath.get("specifiers").find(specifierPath => matchSpecifier(specifierPath, exportedName));
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
  //
  // This method is trickier to use safely than our higher-level methods
  // (`insertAfter`, `insertBefore`, `replaceWith`, `mutate`) because after you
  // insert the identifier into the AST, it's up to you to ensure that babel's
  // scope system is aware of the new reference. The other methods do that for
  // you automatically.
  import(target, moduleSpecifier, exportedName, nameHint) {
    return this.unreferencedImport(target, moduleSpecifier, exportedName, desiredName(nameHint, exportedName, defaultNameHint(target)));
  }
  // Import the given value (if needed) and return an Identifier representing
  // it.
  unreferencedImport(target, moduleSpecifier, exportedName, preferredName) {
    var _a;
    let isNamespaceImport = exportedName === "*";
    let isDefaultImport = exportedName === "default";
    let isNamedImport = !isDefaultImport && !isNamespaceImport;
    let declaration = this.findImportFrom(moduleSpecifier);
    let hasNamespaceSpecifier = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find(s => s.type === "ImportNamespaceSpecifier");
    let hasNamedSpecifiers = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find(s => s.type === "ImportSpecifier");
    let cannotUseExistingDeclaration = hasNamedSpecifiers && isNamespaceImport || hasNamespaceSpecifier && isNamedImport || hasNamespaceSpecifier && isNamespaceImport;
    if (!cannotUseExistingDeclaration && declaration) {
      let specifier = declaration.get("specifiers").find(spec => matchSpecifier(spec, exportedName));
      if (specifier && ((_a = target.scope.getBinding(specifier.node.local.name)) === null || _a === void 0 ? void 0 : _a.kind) === "module") {
        return this.t.identifier(specifier.node.local.name);
      } else {
        return this.addSpecifier(target, declaration, exportedName, preferredName);
      }
    } else {
      let declaration2 = this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
      return this.addSpecifier(target, declaration2, exportedName, preferredName);
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
  mutate(fn, defaultNameHint2) {
    let symbols = /* @__PURE__ */new Map();
    const importer = {
      import: (moduleSpecifier, exportedName, nameHint) => {
        let identifier = this.t.identifier("__babel_import_util_placeholder__");
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
        let newIdentifier = this.unreferencedImport(path, hit.moduleSpecifier, hit.exportedName, desiredName(hit.nameHint, hit.exportedName, defaultNameHint2));
        path.replaceWith(newIdentifier);
        let binding = path.scope.getBinding(newIdentifier.name);
        if (!binding) {
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
    if (specifier.type === "ImportDefaultSpecifier") {
      declaration.node.specifiers.unshift(specifier);
      added = declaration.get(`specifiers.0`);
    } else {
      declaration.node.specifiers.push(specifier);
      added = declaration.get(`specifiers.${declaration.node.specifiers.length - 1}`);
    }
    declaration.scope.registerBinding("module", added);
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
    for (let path of this.program.get("body")) {
      if (path.isImportDeclaration() && path.node.source.value === moduleSpecifier && path.node.importKind !== "type") {
        return path;
      }
    }
    return void 0;
  }
  insertAfterExistingImports(statement) {
    let lastIndex;
    for (let [index, node] of this.program.node.body.entries()) {
      if (node.type === "ImportDeclaration") {
        lastIndex = index;
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
ImportUtil_1 = src.ImportUtil = ImportUtil;
function unusedNameLike(path, name2) {
  let candidate = name2;
  let counter = 0;
  while (path.scope.hasBinding(candidate)) {
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
function desiredName(nameHint, exportedName, defaultNameHint2) {
  if (nameHint) {
    return (0, sanitize_1.sanitize)(nameHint);
  }
  if (exportedName === "default" || exportedName === "*") {
    return defaultNameHint2 !== null && defaultNameHint2 !== void 0 ? defaultNameHint2 : "a";
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
    return void 0;
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
function matchModule(path, moduleSpecifier) {
  return path.isImportDeclaration() && path.get("source").node.value === moduleSpecifier;
}
function makeVisitor(babel) {
  const t = babel.types;
  return {
    Program(path, state) {
      state.currentClassBodies = [];
      state.currentObjectExpressions = [];
      state.optsWithDefaults = {
        runtime: "globals",
        runEarly: false,
        ...state.opts
      };
      state.util = new ImportUtil_1(babel, path);
      state.runtime = (i, fnName) => {
        const {
          runtime
        } = state.optsWithDefaults;
        if (runtime === "globals") {
          return t.memberExpression(t.identifier(globalId), t.identifier(fnName));
        } else {
          return i.import(runtime.import, fnName);
        }
      };
    },
    ClassBody: {
      enter(path, state) {
        state.currentClassBodies.unshift(path.node);
      },
      exit(path, state) {
        if (state.currentClassBodies[0] === path.node) {
          state.currentClassBodies.shift();
        }
      }
    },
    ClassExpression(path, state) {
      let decorators = path.get("decorators");
      if (Array.isArray(decorators) && decorators.length > 0) {
        state.util.replaceWith(path, i => {
          let call = t.callExpression(state.runtime(i, "c"), [path.node, t.arrayExpression(decorators.slice().reverse().map(d => d.node.expression))]);
          for (let decorator of decorators) {
            decorator.remove();
          }
          return call;
        });
      }
    },
    ClassDeclaration(path, state) {
      let decorators = path.get("decorators");
      if (Array.isArray(decorators) && decorators.length > 0) {
        const buildCall = i => {
          return t.callExpression(state.runtime(i, "c"), [t.classExpression(path.node.id, path.node.superClass, path.node.body, []
          // decorators removed here
          ), t.arrayExpression(decorators.slice().reverse().map(d => d.node.expression))]);
        };
        if (path.parentPath.isExportDefaultDeclaration()) {
          let id = path.node.id;
          if (id) {
            state.util.insertBefore(path.parentPath, i => t.variableDeclaration("const", [t.variableDeclarator(id, buildCall(i))]));
            path.parentPath.replaceWith(t.exportDefaultDeclaration(id));
          } else {
            state.util.replaceWith(path.parentPath, i => t.exportDefaultDeclaration(buildCall(i)));
          }
        } else if (path.parentPath.isExportNamedDeclaration()) {
          let id = path.node.id;
          if (!id) {
            throw new Error(`bug: expected a class name is required in this context`);
          }
          state.util.insertBefore(path.parentPath, i => t.variableDeclaration("const", [t.variableDeclarator(id, buildCall(i))]));
          path.parentPath.replaceWith(t.exportNamedDeclaration(null, [t.exportSpecifier(id, id)]));
        } else {
          let id = path.node.id;
          if (!id) {
            throw new Error(`bug: expected a class name is required in this context`);
          }
          state.util.replaceWith(path, i => t.variableDeclaration("const", [t.variableDeclarator(id, buildCall(i))]));
        }
      }
    },
    ClassProperty(path, state) {
      let decorators = path.get("decorators");
      if (Array.isArray(decorators) && decorators.length > 0) {
        let prototype;
        if (path.node.static) {
          prototype = t.thisExpression();
        } else {
          prototype = t.memberExpression(t.thisExpression(), t.identifier("prototype"));
        }
        let args = [prototype, valueForFieldKey(t, path.node.key), t.arrayExpression(decorators.slice().reverse().map(d => d.node.expression))];
        if (path.node.value) {
          args.push(t.functionExpression(null, [], t.blockStatement([t.returnStatement(path.node.value)])));
        }
        state.util.insertBefore(path, i => t.staticBlock([t.expressionStatement(t.callExpression(state.runtime(i, "g"), args))]));
        state.util.insertBefore(path, i => t.classPrivateProperty(t.privateName(t.identifier(unusedPrivateNameLike(state, propName(path.node.key)))), t.sequenceExpression([t.callExpression(state.runtime(i, "i"), [t.thisExpression(), valueForFieldKey(t, path.node.key)]), t.unaryExpression("void", t.numericLiteral(0), true)])));
        path.remove();
      }
    },
    ClassMethod(path, state) {
      let decorators = path.get("decorators");
      if (Array.isArray(decorators) && decorators.length > 0) {
        let prototype;
        if (path.node.static) {
          prototype = t.thisExpression();
        } else {
          prototype = t.memberExpression(t.thisExpression(), t.identifier("prototype"));
        }
        state.util.insertAfter(path, i => t.staticBlock([t.expressionStatement(t.callExpression(state.runtime(i, "n"), [prototype, valueForFieldKey(t, path.node.key), t.arrayExpression(decorators.slice().reverse().map(d => d.node.expression))]))]));
        for (let decorator of decorators) {
          decorator.remove();
        }
      }
    },
    ObjectExpression: {
      enter(path, state) {
        state.currentObjectExpressions.unshift({
          node: path.node,
          decorated: []
        });
      },
      exit(path, state) {
        var _a;
        if (((_a = state.currentObjectExpressions[0]) == null ? void 0 : _a.node) !== path.node) {
          return;
        }
        let {
          decorated
        } = state.currentObjectExpressions.shift();
        if (decorated.length > 0) {
          state.util.replaceWith(path, i => t.callExpression(state.runtime(i, "p"), [path.node, t.arrayExpression(decorated.map(([type, prop, decorators]) => t.arrayExpression([t.stringLiteral(type), prop, t.arrayExpression(decorators)])))]));
        }
      }
    },
    ObjectProperty(path, state) {
      let decorators = path.get("decorators");
      if (Array.isArray(decorators) && decorators.length > 0) {
        if (state.currentObjectExpressions.length === 0) {
          throw new Error(`bug in decorator-transforms: didn't expect to see ObjectProperty outside ObjectExpression`);
        }
        let prop = path.node.key;
        if (prop.type === "PrivateName") {
          throw new Error(`cannot decorate private field`);
        }
        state.currentObjectExpressions[0].decorated.push(["field", valueForFieldKey(t, prop), decorators.slice().reverse().map(d => d.node.expression)]);
        for (let decorator of decorators) {
          decorator.remove();
        }
      }
    },
    ObjectMethod(path, state) {
      let decorators = path.get("decorators");
      if (Array.isArray(decorators) && decorators.length > 0) {
        if (state.currentObjectExpressions.length === 0) {
          throw new Error(`bug in decorator-transforms: didn't expect to see ObjectMethod outside ObjectExpression`);
        }
        let prop = path.node.key;
        state.currentObjectExpressions[0].decorated.push(["method", valueForFieldKey(t, prop), decorators.slice().reverse().map(d => d.node.expression)]);
        for (let decorator of decorators) {
          decorator.remove();
        }
      }
    }
  };
}
function legacyDecoratorCompat(babel) {
  let visitor = makeVisitor(babel);
  return {
    // Enable decorator parser support directly via manipulateOptions instead
    // of depending on @babel/plugin-syntax-decorators. This keeps the plugin
    // working across both Babel 7 and 8 without a hard dependency on either.
    manipulateOptions(_opts, parserOpts) {
      parserOpts.plugins.push("decorators-legacy");
    },
    pre(file) {
      if (this.opts.runEarly) {
        babel.traverse(file.ast, makeVisitor(babel), file.scope, this);
        visitor = void 0;
      }
    },
    get visitor() {
      return visitor ?? {};
    }
  };
}
function unusedPrivateNameLike(state, name2) {
  let classBody = state.currentClassBodies[0];
  if (!classBody) {
    throw new Error(`bug: no current class body around our class field decorator`);
  }
  let usedNames = /* @__PURE__ */new Set();
  for (let element of classBody.body) {
    if ((element.type === "ClassPrivateProperty" || element.type === "ClassPrivateMethod" || element.type === "ClassAccessorProperty") && element.key.type === "PrivateName") {
      usedNames.add(element.key.id.name);
    }
  }
  let candidate = name2;
  while (usedNames.has(candidate)) {
    candidate = candidate + "_";
  }
  return candidate;
}
function propName(expr) {
  if (expr.type === "Identifier") {
    return expr.name;
  }
  if (expr.type === "BigIntLiteral" || expr.type === "NumericLiteral") {
    return `_${expr.value}`;
  }
  if (expr.type === "StringLiteral") {
    return "_" + expr.value.replace(/[^a-zA-Z]/g, "");
  }
  return "_";
}
function valueForFieldKey(t, expr) {
  if (expr.type === "Identifier") {
    return t.stringLiteral(expr.name);
  }
  return expr;
}

export { legacyDecoratorCompat as default };
