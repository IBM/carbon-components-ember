import { r as getDefaultExportFromCjs } from "./_commonjsHelpers-BAGoDD49-_I2bqOP0.js";
//#region ../node_modules/.pnpm/ember-repl@8.2.1_patch_hash=fe673d0ba2bd96ef9071c579df638fc0daec82586ee2a1519528d4d06c4_fcfc7daea1b703089ee567ee30902d79/node_modules/ember-repl/dist/index-DNPwtadt.js
function _mergeNamespaces(n, m) {
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
var src = {};
var sanitize = {};
var hasRequiredSanitize;
function requireSanitize() {
	if (hasRequiredSanitize) return sanitize;
	hasRequiredSanitize = 1;
	Object.defineProperty(sanitize, "__esModule", { value: true });
	sanitize.sanitize = void 0;
	function sanitize$1(identifier) {
		let cleaned = identifier.replace(new RegExp(`(?<!^)(?:${illegalChar.source})([a-z])`, "g"), (_m, letter) => letter.toUpperCase());
		cleaned = cleaned.replace(new RegExp(illegalChar.source, "g"), "");
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
	Object.defineProperty(src, "__esModule", { value: true });
	src.ImportUtil = void 0;
	const sanitize_1 = requireSanitize();
	class ImportUtil {
		constructor(babel, program) {
			this.babel = babel;
			this.program = program;
			this.t = babel.types;
		}
		removeImport(moduleSpecifier, exportedName) {
			for (let topLevelPath of this.program.get("body")) {
				if (!matchModule(topLevelPath, moduleSpecifier)) continue;
				let importSpecifierPath = topLevelPath.get("specifiers").find((specifierPath) => matchSpecifier(specifierPath, exportedName));
				if (importSpecifierPath) {
					if (topLevelPath.node.specifiers.length === 1) topLevelPath.remove();
					else importSpecifierPath.remove();
				}
			}
		}
		removeAllImports(moduleSpecifier) {
			for (let topLevelPath of this.program.get("body")) if (matchModule(topLevelPath, moduleSpecifier)) topLevelPath.remove();
		}
		import(target, moduleSpecifier, exportedName, nameHint) {
			return this.unreferencedImport(target, moduleSpecifier, exportedName, desiredName(nameHint, exportedName, defaultNameHint(target)));
		}
		unreferencedImport(target, moduleSpecifier, exportedName, preferredName) {
			var _a;
			let isNamespaceImport = exportedName === "*";
			let isNamedImport = !(exportedName === "default") && !isNamespaceImport;
			let declaration = this.findImportFrom(moduleSpecifier);
			let hasNamespaceSpecifier = declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find((s) => s.type === "ImportNamespaceSpecifier");
			if (!((declaration === null || declaration === void 0 ? void 0 : declaration.node.specifiers.find((s) => s.type === "ImportSpecifier")) && isNamespaceImport || hasNamespaceSpecifier && isNamedImport || hasNamespaceSpecifier && isNamespaceImport) && declaration) {
				let specifier = declaration.get("specifiers").find((spec) => matchSpecifier(spec, exportedName));
				if (specifier && ((_a = target.scope.getBinding(specifier.node.local.name)) === null || _a === void 0 ? void 0 : _a.kind) === "module") return this.t.identifier(specifier.node.local.name);
				else return this.addSpecifier(target, declaration, exportedName, preferredName);
			} else {
				let declaration = this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
				return this.addSpecifier(target, declaration, exportedName, preferredName);
			}
		}
		importForSideEffect(moduleSpecifier) {
			if (!this.findImportFrom(moduleSpecifier)) this.insertAfterExistingImports(this.t.importDeclaration([], this.t.stringLiteral(moduleSpecifier)));
		}
		replaceWith(target, fn) {
			return this.mutate((i) => {
				target.replaceWith(fn(i));
				return target;
			}, defaultNameHint(target));
		}
		insertAfter(target, fn) {
			return this.mutate((i) => target.insertAfter(fn(i))[0], defaultNameHint(target));
		}
		insertBefore(target, fn) {
			return this.mutate((i) => target.insertBefore(fn(i))[0], defaultNameHint(target));
		}
		mutate(fn, defaultNameHint) {
			let symbols = /* @__PURE__ */ new Map();
			const importer = { import: (moduleSpecifier, exportedName, nameHint) => {
				let identifier = this.t.identifier("__babel_import_util_placeholder__");
				symbols.set(identifier, {
					moduleSpecifier,
					exportedName,
					nameHint
				});
				return identifier;
			} };
			const updateReference = (path) => {
				if (!path.isIdentifier()) return;
				let hit = symbols.get(path.node);
				if (hit) {
					let newIdentifier = this.unreferencedImport(path, hit.moduleSpecifier, hit.exportedName, desiredName(hit.nameHint, hit.exportedName, defaultNameHint));
					path.replaceWith(newIdentifier);
					let binding = path.scope.getBinding(newIdentifier.name);
					if (!binding) throw new Error(`bug: this is supposed to never happen`);
					binding.reference(path);
				}
			};
			let result = fn(importer);
			updateReference(result);
			this.babel.traverse(result.node, { ReferencedIdentifier: (path) => {
				updateReference(path);
			} }, result.scope, {}, result);
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
				case "default": return this.t.importDefaultSpecifier(localName);
				case "*": return this.t.importNamespaceSpecifier(localName);
				default: return this.t.importSpecifier(localName, this.t.identifier(exportedName));
			}
		}
		findImportFrom(moduleSpecifier) {
			for (let path of this.program.get("body")) if (path.isImportDeclaration() && path.node.source.value === moduleSpecifier && path.node.importKind !== "type") return path;
		}
		insertAfterExistingImports(statement) {
			let lastIndex;
			for (let [index, node] of this.program.node.body.entries()) if (node.type === "ImportDeclaration") lastIndex = index;
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
	function unusedNameLike(path, name) {
		let candidate = name;
		let counter = 0;
		while (path.scope.hasBinding(candidate)) candidate = `${name}${counter++}`;
		return candidate;
	}
	function name(node) {
		if (node.type === "StringLiteral") return node.value;
		else return node.name;
	}
	function desiredName(nameHint, exportedName, defaultNameHint) {
		if (nameHint) return (0, sanitize_1.sanitize)(nameHint);
		if (exportedName === "default" || exportedName === "*") return defaultNameHint !== null && defaultNameHint !== void 0 ? defaultNameHint : "a";
		else return exportedName;
	}
	function defaultNameHint(target) {
		if (target === null || target === void 0 ? void 0 : target.isIdentifier()) return target.node.name;
		else if (target) return target.scope.generateUidIdentifierBasedOnNode(target.node).name;
		else return;
	}
	function matchSpecifier(spec, exportedName) {
		switch (exportedName) {
			case "default": return spec.isImportDefaultSpecifier();
			case "*": return spec.isImportNamespaceSpecifier();
			default: return spec.isImportSpecifier() && name(spec.node.imported) === exportedName;
		}
	}
	function matchModule(path, moduleSpecifier) {
		return path.isImportDeclaration() && path.get("source").node.value === moduleSpecifier;
	}
	return src;
}
var srcExports = requireSrc();
var index$1 = /*#__PURE__*/ _mergeNamespaces({
	__proto__: null,
	default: /* @__PURE__ */ getDefaultExportFromCjs(srcExports)
}, [srcExports]);
//#endregion
export { srcExports as n, index$1 as t };
