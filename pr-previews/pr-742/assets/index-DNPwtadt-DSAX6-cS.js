import { g as getDefaultExportFromCjs } from './_commonjsHelpers-BAGoDD49-Asm8knJo.js';

function _mergeNamespaces$1(n, m) {
  m.forEach(function (e) {
    e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
      if (k !== 'default' && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  });
  return Object.freeze(n);
}
var src = {};
var sanitize = {};
var hasRequiredSanitize;
function requireSanitize() {
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
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  Object.defineProperty(src, "__esModule", {
    value: true
  });
  src.ImportUtil = void 0;
  const sanitize_1 = requireSanitize();
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
var srcExports = requireSrc();
var index = /*@__PURE__*/getDefaultExportFromCjs(srcExports);
var index$1 = /*#__PURE__*/_mergeNamespaces$1({
  __proto__: null,
  default: index
}, [srcExports]);

export { index$1 as i, srcExports as s };
