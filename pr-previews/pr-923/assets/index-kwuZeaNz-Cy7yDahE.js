import { a as expect, f as unwrap, r as dict, t as StackImpl, u as isPresentArray } from "./collections-GpG8lT2g-C7dMd8aS.js";
import { a as InternalComponentCapabilities, o as MACHINE_MASK, r as hasCapability } from "./capabilities-BuVYh-vx-DjVIGaJt.js";
import { a as encodeImmediate, i as encodeHandle, s as isSmallInt } from "./syscall-ops-CkPT1Kfx-C_CJ523J.js";
import { a as assert, c as EMPTY_STRING_ARRAY, f as reverse, o as EMPTY_ARRAY, t as assign, u as enumerate } from "./object-utils-AijlD-JH-xdA72BiZ.js";
import { t as opcodes } from "./opcodes-DDajoGhq-DNWK19V4.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/vm-ops-ImHv0Wtg.js
function isMachineOp(value) {
	return value >= 0 && value <= 15;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/vm/index.js
var ContentType = {
	Component: 0,
	Helper: 1,
	String: 2,
	Empty: 3,
	SafeString: 4,
	Fragment: 5,
	Node: 6,
	Other: 8
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@glimmer/encoder/index.js
var InstructionEncoderImpl = class {
	constructor(buffer) {
		this.buffer = buffer;
	}
	size = 0;
	encode(type, machine, ...args) {
		if (type > 255) throw new Error(`Opcode type over 8-bits. Got ${type}.`);
		let first = type | machine | arguments.length - 2 << 8;
		this.buffer.push(first);
		for (const op of args) this.buffer.push(op);
		this.size = this.buffer.length;
	}
	patch(position, target) {
		if (this.buffer[position + 1] === -1) this.buffer[position + 1] = target;
		else throw new Error("Trying to patch operand in populated slot instead of a reserved slot.");
	}
};
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/index-kwuZeaNz.js
function isGetLikeTuple(opcode) {
	return Array.isArray(opcode) && opcode.length === 2;
}
function makeResolutionTypeVerifier(typeToVerify) {
	return (opcode) => {
		if (!isGetLikeTuple(opcode)) return false;
		let type = opcode[0];
		return type === opcodes.GetStrictKeyword || type === opcodes.GetLexicalSymbol || type === typeToVerify;
	};
}
var isGetFreeComponent = makeResolutionTypeVerifier(opcodes.GetFreeAsComponentHead);
var isGetFreeModifier = makeResolutionTypeVerifier(opcodes.GetFreeAsModifierHead);
var isGetFreeHelper = makeResolutionTypeVerifier(opcodes.GetFreeAsHelperHead);
var isGetFreeComponentOrHelper = makeResolutionTypeVerifier(opcodes.GetFreeAsComponentOrHelperHead);
function assertResolverInvariants(meta) {
	return meta;
}
/**
* <Foo/>
* <Foo></Foo>
* <Foo @arg={{true}} />
*/
function resolveComponent(resolver, constants, meta, [, expr, then]) {
	assert(isGetFreeComponent(expr));
	if (expr[0] === opcodes.GetLexicalSymbol) {
		let { scopeValues, owner, symbols: { lexical } } = meta;
		let definition = expect(scopeValues)[expr[1]];
		then(constants.component(definition, expect(owner), false, lexical?.at(expr[1])));
	} else {
		let { symbols: { upvars }, owner } = assertResolverInvariants(meta);
		let name = unwrap(upvars[expr[1]]);
		let definition = resolver?.lookupComponent?.(name, owner) ?? null;
		then(constants.resolvedComponent(definition, name));
	}
}
/**
* (helper)
* (helper arg)
*/
function resolveHelper(resolver, constants, meta, [, expr, then]) {
	assert(isGetFreeHelper(expr));
	let type = expr[0];
	if (type === opcodes.GetLexicalSymbol) {
		let { scopeValues } = meta;
		let definition = expect(scopeValues)[expr[1]];
		then(constants.helper(definition));
	} else if (type === opcodes.GetStrictKeyword) then(lookupBuiltInHelper(expr, resolver, meta, constants));
	else {
		let { symbols: { upvars }, owner } = assertResolverInvariants(meta);
		let name = unwrap(upvars[expr[1]]);
		let helper = resolver?.lookupHelper?.(name, owner) ?? null;
		then(constants.helper(helper, name));
	}
}
/**
* <div {{modifier}}/>
* <div {{modifier arg}}/>
* <Foo {{modifier}}/>
*/
function resolveModifier(resolver, constants, meta, [, expr, then]) {
	assert(isGetFreeModifier(expr));
	let type = expr[0];
	if (type === opcodes.GetLexicalSymbol) {
		let { scopeValues, symbols: { lexical } } = meta;
		let definition = expect(scopeValues)[expr[1]];
		then(constants.modifier(definition, lexical?.at(expr[1]) ?? void 0));
	} else if (type === opcodes.GetStrictKeyword) {
		let { symbols: { upvars } } = assertResolverInvariants(meta);
		let name = unwrap(upvars[expr[1]]);
		let modifier = resolver?.lookupBuiltInModifier?.(name) ?? null;
		then(constants.modifier(modifier, name));
	} else {
		let { symbols: { upvars }, owner } = assertResolverInvariants(meta);
		let name = unwrap(upvars[expr[1]]);
		let modifier = resolver?.lookupModifier?.(name, owner) ?? null;
		then(constants.modifier(modifier));
	}
}
/**
* {{component-or-helper arg}}
*/
function resolveComponentOrHelper(resolver, constants, meta, [, expr, { ifComponent, ifHelper }]) {
	assert(isGetFreeComponentOrHelper(expr));
	let type = expr[0];
	if (type === opcodes.GetLexicalSymbol) {
		let { scopeValues, owner, symbols: { lexical } } = meta;
		let definition = expect(scopeValues)[expr[1]];
		let component = constants.component(definition, expect(owner), true, lexical?.at(expr[1]));
		if (component !== null) {
			ifComponent(component);
			return;
		}
		let helper = constants.helper(definition, null, true);
		ifHelper(expect(helper));
	} else if (type === opcodes.GetStrictKeyword) ifHelper(lookupBuiltInHelper(expr, resolver, meta, constants));
	else {
		let { symbols: { upvars }, owner } = assertResolverInvariants(meta);
		let name = unwrap(upvars[expr[1]]);
		let definition = resolver?.lookupComponent?.(name, owner) ?? null;
		if (definition !== null) ifComponent(constants.resolvedComponent(definition, name));
		else {
			let helper = resolver?.lookupHelper?.(name, owner) ?? null;
			ifHelper(constants.helper(helper, name));
		}
	}
}
/**
* {{maybeHelperOrComponent}}
*/
function resolveOptionalComponentOrHelper(resolver, constants, meta, [, expr, { ifComponent, ifHelper, ifValue }]) {
	assert(isGetFreeComponentOrHelper(expr));
	let type = expr[0];
	if (type === opcodes.GetLexicalSymbol) {
		let { scopeValues, owner, symbols: { lexical } } = meta;
		let definition = expect(scopeValues)[expr[1]];
		if (typeof definition !== "function" && (typeof definition !== "object" || definition === null)) {
			ifValue(constants.value(definition));
			return;
		}
		let component = constants.component(definition, expect(owner), true, lexical?.at(expr[1]));
		if (component !== null) {
			ifComponent(component);
			return;
		}
		let helper = constants.helper(definition, null, true);
		if (helper !== null) {
			ifHelper(helper);
			return;
		}
		ifValue(constants.value(definition));
	} else if (type === opcodes.GetStrictKeyword) ifHelper(lookupBuiltInHelper(expr, resolver, meta, constants));
	else {
		let { symbols: { upvars }, owner } = assertResolverInvariants(meta);
		let name = unwrap(upvars[expr[1]]);
		let definition = resolver?.lookupComponent?.(name, owner) ?? null;
		if (definition !== null) {
			ifComponent(constants.resolvedComponent(definition, name));
			return;
		}
		let helper = resolver?.lookupHelper?.(name, owner) ?? null;
		if (helper !== null) ifHelper(constants.helper(helper, name));
	}
}
function lookupBuiltInHelper(expr, resolver, meta, constants, type) {
	let { symbols: { upvars } } = assertResolverInvariants(meta);
	let name = unwrap(upvars[expr[1]]);
	let helper = resolver?.lookupBuiltInHelper?.(name) ?? null;
	return constants.helper(helper, name);
}
var HighLevelResolutionOpcodes = {
	Modifier: 1003,
	Component: 1004,
	Helper: 1005,
	ComponentOrHelper: 1007,
	OptionalComponentOrHelper: 1008,
	Local: 1010,
	TemplateLocal: 1011
};
var HighLevelBuilderOpcodes = {
	Label: 1e3,
	StartLabels: 1001,
	StopLabels: 1002,
	Start: 1e3
};
var HighLevelOperands = {
	Label: 1,
	IsStrictMode: 2,
	DebugSymbols: 3,
	Block: 4,
	StdLib: 5,
	NonSmallInt: 6,
	SymbolTable: 7,
	Layout: 8
};
function labelOperand(value) {
	return {
		type: HighLevelOperands.Label,
		value
	};
}
function debugSymbolsOperand(locals, upvars, lexical) {
	return {
		type: HighLevelOperands.DebugSymbols,
		value: {
			locals,
			upvars,
			lexical
		}
	};
}
function isStrictMode() {
	return {
		type: HighLevelOperands.IsStrictMode,
		value: void 0
	};
}
function blockOperand(value) {
	return {
		type: HighLevelOperands.Block,
		value
	};
}
function stdlibOperand(value) {
	return {
		type: HighLevelOperands.StdLib,
		value
	};
}
function nonSmallIntOperand(value) {
	return {
		type: HighLevelOperands.NonSmallInt,
		value
	};
}
function symbolTableOperand(value) {
	return {
		type: HighLevelOperands.SymbolTable,
		value
	};
}
function layoutOperand(value) {
	return {
		type: HighLevelOperands.Layout,
		value
	};
}
var Labels = class {
	labels = dict();
	targets = [];
	label(name, index) {
		this.labels[name] = index;
	}
	target(at, target) {
		this.targets.push({
			at,
			target
		});
	}
	patch(heap) {
		let { targets, labels } = this;
		for (const { at, target } of targets) {
			let address = labels[target] - at;
			assert(heap.getbyaddr(at) === -1);
			heap.setbyaddr(at, address);
		}
	}
};
function encodeOp(encoder, context, meta, op) {
	let { program: { constants }, resolver } = context;
	if (isBuilderOpcode(op[0])) {
		let [type, ...operands] = op;
		encoder.push(constants, type, ...operands);
	} else switch (op[0]) {
		case HighLevelBuilderOpcodes.Label: return encoder.label(op[1]);
		case HighLevelBuilderOpcodes.StartLabels: return encoder.startLabels();
		case HighLevelBuilderOpcodes.StopLabels: return encoder.stopLabels();
		case HighLevelResolutionOpcodes.Component: return resolveComponent(resolver, constants, meta, op);
		case HighLevelResolutionOpcodes.Modifier: return resolveModifier(resolver, constants, meta, op);
		case HighLevelResolutionOpcodes.Helper: return resolveHelper(resolver, constants, meta, op);
		case HighLevelResolutionOpcodes.ComponentOrHelper: return resolveComponentOrHelper(resolver, constants, meta, op);
		case HighLevelResolutionOpcodes.OptionalComponentOrHelper: return resolveOptionalComponentOrHelper(resolver, constants, meta, op);
		case HighLevelResolutionOpcodes.Local: {
			let [, freeVar, andThen] = op;
			let name = expect(meta.symbols.upvars)[freeVar];
			andThen(name, meta.moduleName);
			break;
		}
		case HighLevelResolutionOpcodes.TemplateLocal: {
			let [, valueIndex, then] = op;
			let value = expect(meta.scopeValues)[valueIndex];
			then(constants.value(value));
			break;
		}
		default: throw new Error(`Unexpected high level opcode ${op[0]}`);
	}
}
var EncoderImpl = class {
	labelsStack = new StackImpl();
	encoder = new InstructionEncoderImpl([]);
	errors = [];
	handle;
	constructor(heap, meta, stdlib) {
		this.heap = heap;
		this.meta = meta;
		this.stdlib = stdlib;
		this.handle = heap.malloc();
	}
	error(error) {
		this.encoder.encode(30, 0);
		this.errors.push(error);
	}
	commit(size) {
		let handle = this.handle;
		this.heap.pushMachine(5);
		this.heap.finishMalloc(handle, size);
		if (isPresentArray(this.errors)) return {
			errors: this.errors,
			handle
		};
		else return handle;
	}
	push(constants, type, ...args) {
		let { heap } = this;
		let first = type | (isMachineOp(type) ? MACHINE_MASK : 0) | args.length << 8;
		heap.pushRaw(first);
		for (let i = 0; i < args.length; i++) {
			let op = args[i];
			heap.pushRaw(this.operand(constants, op));
		}
	}
	operand(constants, operand) {
		if (typeof operand === "number") return operand;
		if (typeof operand === "object" && operand !== null) {
			if (Array.isArray(operand)) return encodeHandle(constants.array(operand));
			else switch (operand.type) {
				case HighLevelOperands.Label:
					this.currentLabels.target(this.heap.offset, operand.value);
					return -1;
				case HighLevelOperands.IsStrictMode: return encodeHandle(constants.value(this.meta.isStrictMode));
				case HighLevelOperands.DebugSymbols: return encodeHandle(constants.value(operand.value));
				case HighLevelOperands.Block: return encodeHandle(constants.value(compilableBlock(operand.value, this.meta)));
				case HighLevelOperands.StdLib: return expect(this.stdlib)[operand.value];
				case HighLevelOperands.NonSmallInt:
				case HighLevelOperands.SymbolTable:
				case HighLevelOperands.Layout: return constants.value(operand.value);
			}
		}
		return encodeHandle(constants.value(operand));
	}
	get currentLabels() {
		return expect(this.labelsStack.current);
	}
	label(name) {
		this.currentLabels.label(name, this.heap.offset + 1);
	}
	startLabels() {
		this.labelsStack.push(new Labels());
	}
	stopLabels() {
		expect(this.labelsStack.pop()).patch(this.heap);
	}
};
function isBuilderOpcode(op) {
	return op < HighLevelBuilderOpcodes.Start;
}
function templateCompilationContext(evaluation, meta) {
	return {
		evaluation,
		encoder: new EncoderImpl(evaluation.program.heap, meta, evaluation.stdlib),
		meta
	};
}
var Compilers = class {
	names = {};
	funcs = [];
	add(name, func) {
		this.names[name] = this.funcs.push(func) - 1;
	}
	compile(op, sexp) {
		let name = sexp[0];
		let index = unwrap(this.names[name]);
		let func = this.funcs[index];
		assert(func, `expected an implementation for ${sexp[0]}`);
		func(op, sexp);
	}
};
var EXPRESSIONS = new Compilers();
EXPRESSIONS.add(opcodes.Concat, (op, [, parts]) => {
	for (let part of parts) expr(op, part);
	op(27, parts.length);
});
EXPRESSIONS.add(opcodes.Call, (op, [, expression, positional, named]) => {
	if (isGetFreeHelper(expression)) op(HighLevelResolutionOpcodes.Helper, expression, (handle) => {
		Call(op, handle, positional, named);
	});
	else {
		expr(op, expression);
		CallDynamic(op, positional, named);
	}
});
EXPRESSIONS.add(opcodes.Curry, (op, [, expr, type, positional, named]) => {
	Curry(op, type, expr, positional, named);
});
EXPRESSIONS.add(opcodes.GetSymbol, (op, [, sym, path]) => {
	op(21, sym);
	withPath(op, path);
});
EXPRESSIONS.add(opcodes.GetLexicalSymbol, (op, [, sym, path]) => {
	op(HighLevelResolutionOpcodes.TemplateLocal, sym, (handle) => {
		op(29, handle);
		withPath(op, path);
	});
});
EXPRESSIONS.add(opcodes.GetStrictKeyword, (op, expr) => {
	op(HighLevelResolutionOpcodes.Local, expr[1], (_name) => {
		op(HighLevelResolutionOpcodes.Helper, expr, (handle) => {
			Call(op, handle, null, null);
		});
	});
});
EXPRESSIONS.add(opcodes.GetFreeAsHelperHead, (op, expr) => {
	op(HighLevelResolutionOpcodes.Local, expr[1], (_name) => {
		op(HighLevelResolutionOpcodes.Helper, expr, (handle) => {
			Call(op, handle, null, null);
		});
	});
});
function withPath(op, path) {
	if (path === void 0 || path.length === 0) return;
	for (let i = 0; i < path.length; i++) op(22, path[i]);
}
EXPRESSIONS.add(opcodes.Undefined, (op) => PushPrimitiveReference(op, void 0));
EXPRESSIONS.add(opcodes.HasBlock, (op, [, block]) => {
	expr(op, block);
	op(25);
});
EXPRESSIONS.add(opcodes.HasBlockParams, (op, [, block]) => {
	expr(op, block);
	op(24);
	op(61);
	op(26);
});
EXPRESSIONS.add(opcodes.IfInline, (op, [, condition, truthy, falsy]) => {
	expr(op, falsy);
	expr(op, truthy);
	expr(op, condition);
	op(109);
});
EXPRESSIONS.add(opcodes.Not, (op, [, value]) => {
	expr(op, value);
	op(110);
});
EXPRESSIONS.add(opcodes.GetDynamicVar, (op, [, expression]) => {
	expr(op, expression);
	op(111);
});
EXPRESSIONS.add(opcodes.Log, (op, [, positional]) => {
	op(0);
	SimpleArgs(op, positional, null, false);
	op(112);
	op(1);
	op(36, 8);
});
function expr(op, expression) {
	if (Array.isArray(expression)) EXPRESSIONS.compile(op, expression);
	else {
		PushPrimitive(op, expression);
		op(31);
	}
}
/**
* Push a reference onto the stack corresponding to a statically known primitive
* @param value A JavaScript primitive (undefined, null, boolean, number or string)
*/
function PushPrimitiveReference(op, value) {
	PushPrimitive(op, value);
	op(31);
}
/**
* Push an encoded representation of a JavaScript primitive on the stack
*
* @param value A JavaScript primitive (undefined, null, boolean, number or string)
*/
function PushPrimitive(op, primitive) {
	let p = primitive;
	if (typeof p === "number") p = isSmallInt(p) ? encodeImmediate(p) : nonSmallIntOperand(p);
	op(30, p);
}
/**
* Invoke a foreign function (a "helper") based on a statically known handle
*
* @param op The op creation function
* @param handle A handle
* @param positional An optional list of expressions to compile
* @param named An optional list of named arguments (name + expression) to compile
*/
function Call(op, handle, positional, named) {
	op(0);
	SimpleArgs(op, positional, named, false);
	op(16, handle);
	op(1);
	op(36, 8);
}
/**
* Invoke a foreign function (a "helper") based on a dynamically loaded definition
*
* @param op The op creation function
* @param positional An optional list of expressions to compile
* @param named An optional list of named arguments (name + expression) to compile
*/
function CallDynamic(op, positional, named, append) {
	op(0);
	SimpleArgs(op, positional, named, false);
	op(33, 2, 1);
	op(107);
	if (append) {
		op(36, 8);
		append();
		op(1);
		op(34, 1);
	} else {
		op(1);
		op(34, 1);
		op(36, 8);
	}
}
/**
* Evaluate statements in the context of new dynamic scope entries. Move entries from the
* stack into named entries in the dynamic scope, then evaluate the statements, then pop
* the dynamic scope
*
* @param names a list of dynamic scope names
* @param block a function that returns a list of statements to evaluate
*/
function DynamicScope(op, names, block) {
	op(59);
	op(58, names);
	block();
	op(60);
}
function Curry(op, type, definition, positional, named) {
	op(0);
	SimpleArgs(op, positional, named, false);
	op(86);
	expr(op, definition);
	op(77, type, isStrictMode());
	op(1);
	op(36, 8);
}
/**
* Yield to a block located at a particular symbol location.
*
* @param to the symbol containing the block to yield to
* @param params optional block parameters to yield to the block
*/
function YieldBlock(op, to, positional) {
	SimpleArgs(op, positional, null, true);
	op(23, to);
	op(24);
	op(61);
	op(64);
	op(40);
	op(1);
}
/**
* Push an (optional) yieldable block onto the stack. The yieldable block must be known
* statically at compile time.
*
* @param block An optional Compilable block
*/
function PushYieldableBlock(op, block) {
	PushSymbolTable(op, block && block[1]);
	op(62);
	PushCompilable(op, block);
}
/**
* Invoke a block that is known statically at compile time.
*
* @param block a Compilable block
*/
function InvokeStaticBlock(op, block) {
	op(0);
	PushCompilable(op, block);
	op(61);
	op(2);
	op(1);
}
/**
* Invoke a static block, preserving some number of stack entries for use in
* updating.
*
* @param block A compilable block
* @param callerCount A number of stack entries to preserve
*/
function InvokeStaticBlockWithStack(op, block, callerCount) {
	let parameters = block[1];
	let calleeCount = parameters.length;
	let count = Math.min(callerCount, calleeCount);
	if (count === 0) {
		InvokeStaticBlock(op, block);
		return;
	}
	op(0);
	if (count) {
		op(39);
		for (let i = 0; i < count; i++) {
			op(33, 2, callerCount - i);
			op(19, parameters[i]);
		}
	}
	PushCompilable(op, block);
	op(61);
	op(2);
	if (count) op(40);
	op(1);
}
function PushSymbolTable(op, parameters) {
	if (parameters !== null) op(63, symbolTableOperand({ parameters }));
	else PushPrimitive(op, null);
}
function PushCompilable(op, _block) {
	if (_block === null) PushPrimitive(op, null);
	else op(28, blockOperand(_block));
}
/**
* Compile arguments, pushing an Arguments object onto the stack.
*
* @param args.params
* @param args.hash
* @param args.blocks
* @param args.atNames
*/
function CompileArgs(op, positional, named, blocks, atNames) {
	let blockNames = blocks.names;
	for (const name of blockNames) PushYieldableBlock(op, blocks.get(name));
	let flags = CompilePositional(op, positional) << 4;
	if (atNames) flags |= 8;
	if (blocks.hasAny) flags |= 7;
	let names = EMPTY_ARRAY;
	if (named) {
		names = named[0];
		let val = named[1];
		for (let i = 0; i < val.length; i++) expr(op, val[i]);
	}
	op(82, names, blockNames, flags);
}
function SimpleArgs(op, positional, named, atNames) {
	if (positional === null && named === null) {
		op(83);
		return;
	}
	let flags = CompilePositional(op, positional) << 4;
	if (atNames) flags |= 8;
	let names = EMPTY_STRING_ARRAY;
	if (named) {
		names = named[0];
		let val = named[1];
		for (let i = 0; i < val.length; i++) expr(op, val[i]);
	}
	op(82, names, EMPTY_STRING_ARRAY, flags);
}
/**
* Compile an optional list of positional arguments, which pushes each argument
* onto the stack and returns the number of parameters compiled
*
* @param positional an optional list of positional arguments
*/
function CompilePositional(op, positional) {
	if (positional === null) return 0;
	for (let i = 0; i < positional.length; i++) expr(op, positional[i]);
	return positional.length;
}
function meta(layout) {
	let [, locals, upvars] = layout.block;
	let scopeRecord = layout.scope?.() ?? null;
	return {
		symbols: {
			locals,
			upvars,
			lexical: scopeRecord ? Object.keys(scopeRecord) : void 0
		},
		scopeValues: scopeRecord ? Object.values(scopeRecord) : null,
		isStrictMode: layout.isStrictMode,
		moduleName: layout.moduleName,
		owner: layout.owner,
		size: locals.length
	};
}
var NamedBlocksImpl = class NamedBlocksImpl {
	names;
	constructor(blocks) {
		this.blocks = blocks;
		this.names = blocks ? Object.keys(blocks) : [];
	}
	get(name) {
		if (!this.blocks) return null;
		return this.blocks[name] || null;
	}
	has(name) {
		let { blocks } = this;
		return blocks !== null && name in blocks;
	}
	with(name, block) {
		let { blocks } = this;
		if (blocks) return new NamedBlocksImpl(assign({}, blocks, { [name]: block }));
		else return new NamedBlocksImpl({ [name]: block });
	}
	get hasAny() {
		return this.blocks !== null;
	}
};
var EMPTY_BLOCKS = new NamedBlocksImpl(null);
function namedBlocks(blocks) {
	if (blocks === null) return EMPTY_BLOCKS;
	let out = dict();
	let [keys, values] = blocks;
	for (const [i, key] of enumerate(keys)) out[key] = unwrap(values[i]);
	return new NamedBlocksImpl(out);
}
function SwitchCases(op, bootstrap, matcher) {
	let clauses = [];
	let count = 0;
	function when(match, callback) {
		clauses.push({
			match,
			callback,
			label: `CLAUSE${count++}`
		});
	}
	matcher(when);
	op(69, 1);
	bootstrap();
	op(HighLevelBuilderOpcodes.StartLabels);
	for (let clause of clauses.slice(0, -1)) op(67, labelOperand(clause.label), clause.match);
	for (let i = clauses.length - 1; i >= 0; i--) {
		let clause = unwrap(clauses[i]);
		op(HighLevelBuilderOpcodes.Label, clause.label);
		op(34, 1);
		clause.callback();
		if (i !== 0) op(4, labelOperand("END"));
	}
	op(HighLevelBuilderOpcodes.Label, "END");
	op(HighLevelBuilderOpcodes.StopLabels);
	op(70);
}
/**
* A convenience for pushing some arguments on the stack and
* running some code if the code needs to be re-executed during
* updating execution if some of the arguments have changed.
*
* # Initial Execution
*
* The `args` function should push zero or more arguments onto
* the stack and return the number of arguments pushed.
*
* The `body` function provides the instructions to execute both
* during initial execution and during updating execution.
*
* Internally, this function starts by pushing a new frame, so
* that the body can return and sets the return point ($ra) to
* the ENDINITIAL label.
*
* It then executes the `args` function, which adds instructions
* responsible for pushing the arguments for the block to the
* stack. These arguments will be restored to the stack before
* updating execution.
*
* Next, it adds the Enter opcode, which marks the current position
* in the DOM, and remembers the current $pc (the next instruction)
* as the first instruction to execute during updating execution.
*
* Next, it runs `body`, which adds the opcodes that should
* execute both during initial execution and during updating execution.
* If the `body` wishes to finish early, it should Jump to the
* `FINALLY` label.
*
* Next, it adds the FINALLY label, followed by:
*
* - the Exit opcode, which finalizes the marked DOM started by the
*   Enter opcode.
* - the Return opcode, which returns to the current return point
*   ($ra).
*
* Finally, it adds the ENDINITIAL label followed by the PopFrame
* instruction, which restores $fp, $sp and $ra.
*
* # Updating Execution
*
* Updating execution for this `replayable` occurs if the `body` added an
* assertion, via one of the `JumpUnless`, `JumpEq` or `AssertSame` opcodes.
*
* If, during updating executon, the assertion fails, the initial VM is
* restored, and the stored arguments are pushed onto the stack. The DOM
* between the starting and ending markers is cleared, and the VM's cursor
* is set to the area just cleared.
*
* The return point ($ra) is set to -1, the exit instruction.
*
* Finally, the $pc is set to to the instruction saved off by the
* Enter opcode during initial execution, and execution proceeds as
* usual.
*
* The only difference is that when a `Return` instruction is
* encountered, the program jumps to -1 rather than the END label,
* and the PopFrame opcode is not needed.
*/
function Replayable(op, args, body) {
	op(HighLevelBuilderOpcodes.StartLabels);
	op(0);
	op(6, labelOperand("ENDINITIAL"));
	op(69, args());
	body();
	op(HighLevelBuilderOpcodes.Label, "FINALLY");
	op(70);
	op(5);
	op(HighLevelBuilderOpcodes.Label, "ENDINITIAL");
	op(1);
	op(HighLevelBuilderOpcodes.StopLabels);
}
/**
* A specialized version of the `replayable` convenience that allows the
* caller to provide different code based upon whether the item at
* the top of the stack is true or false.
*
* As in `replayable`, the `ifTrue` and `ifFalse` code can invoke `return`.
*
* During the initial execution, a `return` will continue execution
* in the cleanup code, which finalizes the current DOM block and pops
* the current frame.
*
* During the updating execution, a `return` will exit the updating
* routine, as it can reuse the DOM block and is always only a single
* frame deep.
*/
function ReplayableIf(op, args, ifTrue, ifFalse) {
	return Replayable(op, args, () => {
		op(66, labelOperand("ELSE"));
		ifTrue();
		op(4, labelOperand("FINALLY"));
		op(HighLevelBuilderOpcodes.Label, "ELSE");
		if (ifFalse !== void 0) ifFalse();
	});
}
var ATTRS_BLOCK = "&attrs";
function InvokeComponent(op, component, _elementBlock, positional, named, _blocks) {
	let { compilable, capabilities, handle } = component;
	let elementBlock = _elementBlock ? [_elementBlock, []] : null;
	let blocks = namedBlocks(_blocks);
	if (compilable) {
		op(78, handle);
		InvokeStaticComponent(op, {
			capabilities,
			layout: compilable,
			elementBlock,
			positional,
			named,
			blocks
		});
	} else {
		op(78, handle);
		InvokeNonStaticComponent(op, {
			capabilities,
			elementBlock,
			positional,
			named,
			atNames: true,
			blocks
		});
	}
}
function InvokeDynamicComponent(op, definition, _elementBlock, positional, named, _blocks, atNames, curried) {
	let elementBlock = _elementBlock ? [_elementBlock, []] : null;
	let blocks = namedBlocks(_blocks);
	Replayable(op, () => {
		expr(op, definition);
		op(33, 3, 0);
		return 2;
	}, () => {
		op(66, labelOperand("ELSE"));
		if (curried) op(81);
		else op(80, isStrictMode());
		op(79);
		InvokeNonStaticComponent(op, {
			capabilities: true,
			elementBlock,
			positional,
			named,
			atNames,
			blocks
		});
		op(HighLevelBuilderOpcodes.Label, "ELSE");
	});
}
function InvokeStaticComponent(op, { capabilities, layout, elementBlock, positional, named, blocks }) {
	let { symbolTable } = layout;
	if (hasCapability(capabilities, InternalComponentCapabilities.prepareArgs)) {
		InvokeNonStaticComponent(op, {
			capabilities,
			elementBlock,
			positional,
			named,
			atNames: true,
			blocks,
			layout
		});
		return;
	}
	op(36, 4);
	op(33, 3, 1);
	op(35, 4);
	op(0);
	let { symbols } = symbolTable;
	let blockSymbols = [];
	let argSymbols = [];
	let argNames = [];
	let blockNames = blocks.names;
	if (elementBlock !== null) {
		let symbol = symbols.indexOf(ATTRS_BLOCK);
		if (symbol !== -1) {
			PushYieldableBlock(op, elementBlock);
			blockSymbols.push(symbol);
		}
	}
	for (const name of blockNames) {
		let symbol = symbols.indexOf(`&${name}`);
		if (symbol !== -1) {
			PushYieldableBlock(op, blocks.get(name));
			blockSymbols.push(symbol);
		}
	}
	if (hasCapability(capabilities, InternalComponentCapabilities.createArgs)) {
		let flags = CompilePositional(op, positional) << 4;
		flags |= 8;
		let names = EMPTY_STRING_ARRAY;
		if (named !== null) {
			names = named[0];
			let val = named[1];
			for (let i = 0; i < val.length; i++) {
				let symbol = symbols.indexOf(unwrap(names[i]));
				expr(op, val[i]);
				argSymbols.push(symbol);
			}
		}
		op(82, names, EMPTY_STRING_ARRAY, flags);
		argSymbols.push(-1);
	} else if (named !== null) {
		let names = named[0];
		let val = named[1];
		for (let i = 0; i < val.length; i++) {
			let name = unwrap(names[i]);
			let symbol = symbols.indexOf(name);
			if (symbol !== -1) {
				expr(op, val[i]);
				argSymbols.push(symbol);
				argNames.push(name);
			}
		}
	}
	op(97, 4);
	if (hasCapability(capabilities, InternalComponentCapabilities.dynamicScope)) op(59);
	if (hasCapability(capabilities, InternalComponentCapabilities.createInstance)) op(87, blocks.has("default") | 0);
	op(88, 4);
	if (hasCapability(capabilities, InternalComponentCapabilities.createArgs)) op(90, 4);
	else op(90, 4, argNames);
	op(37, symbols.length + 1, Object.keys(blocks).length > 0 ? 1 : 0);
	op(19, 0);
	for (const symbol of reverse(argSymbols)) if (symbol === -1) op(34, 1);
	else op(19, symbol + 1);
	if (positional !== null) op(34, positional.length);
	for (const symbol of reverse(blockSymbols)) op(20, symbol + 1);
	op(28, layoutOperand(layout));
	op(61);
	op(2);
	op(100, 4);
	op(1);
	op(40);
	if (hasCapability(capabilities, InternalComponentCapabilities.dynamicScope)) op(60);
	op(98);
	op(35, 4);
}
function InvokeNonStaticComponent(op, { capabilities, elementBlock, positional, named, atNames, blocks: namedBlocks, layout }) {
	let bindableBlocks = Boolean(namedBlocks);
	let bindableAtNames = capabilities === true || hasCapability(capabilities, InternalComponentCapabilities.prepareArgs) || named?.[0].length !== 0;
	let blocks = namedBlocks.with("attrs", elementBlock);
	op(36, 4);
	op(33, 3, 1);
	op(35, 4);
	op(0);
	CompileArgs(op, positional, named, blocks, atNames);
	op(85, 4);
	invokePreparedComponent(op, blocks.has("default"), bindableBlocks, bindableAtNames, () => {
		if (layout) {
			op(63, symbolTableOperand(layout.symbolTable));
			op(28, layoutOperand(layout));
			op(61);
		} else op(92, 4);
		op(95, 4);
	});
	op(35, 4);
}
function WrappedComponent(op, layout, attrsBlockNumber) {
	op(HighLevelBuilderOpcodes.StartLabels);
	WithSavedRegister(op, 5, () => {
		op(91, 4);
		op(31);
		op(33, 3, 0);
	});
	op(66, labelOperand("BODY"));
	op(36, 5);
	op(89);
	op(49);
	op(99, 4);
	YieldBlock(op, attrsBlockNumber, null);
	op(54);
	op(HighLevelBuilderOpcodes.Label, "BODY");
	InvokeStaticBlock(op, [layout.block[0], []]);
	op(36, 5);
	op(66, labelOperand("END"));
	op(55);
	op(HighLevelBuilderOpcodes.Label, "END");
	op(35, 5);
	op(HighLevelBuilderOpcodes.StopLabels);
}
function invokePreparedComponent(op, hasBlock, bindableBlocks, bindableAtNames, populateLayout = null) {
	op(97, 4);
	op(59);
	op(87, hasBlock | 0);
	if (populateLayout) populateLayout();
	op(88, 4);
	op(90, 4);
	op(38, 4);
	op(19, 0);
	if (bindableAtNames) op(17, 4);
	if (bindableBlocks) op(18, 4);
	op(34, 1);
	op(96, 4);
	op(100, 4);
	op(1);
	op(40);
	op(60);
	op(98);
}
function InvokeBareComponent(op) {
	op(36, 4);
	op(33, 3, 1);
	op(35, 4);
	op(0);
	op(83);
	op(85, 4);
	invokePreparedComponent(op, false, false, true, () => {
		op(92, 4);
		op(95, 4);
	});
	op(35, 4);
}
function WithSavedRegister(op, register, block) {
	op(36, register);
	block();
	op(35, register);
}
var STATEMENTS = new Compilers();
var INFLATE_ATTR_TABLE = [
	"class",
	"id",
	"value",
	"name",
	"type",
	"style",
	"href"
];
var INFLATE_TAG_TABLE = [
	"div",
	"span",
	"p",
	"a"
];
function inflateTagName(tagName) {
	return typeof tagName === "string" ? tagName : INFLATE_TAG_TABLE[tagName];
}
function inflateAttrName(attrName) {
	return typeof attrName === "string" ? attrName : INFLATE_ATTR_TABLE[attrName];
}
STATEMENTS.add(opcodes.Comment, (op, sexp) => op(42, sexp[1]));
STATEMENTS.add(opcodes.CloseElement, (op) => op(55));
STATEMENTS.add(opcodes.FlushElement, (op) => op(54));
STATEMENTS.add(opcodes.Modifier, (op, [, expression, positional, named]) => {
	if (isGetFreeModifier(expression)) op(HighLevelResolutionOpcodes.Modifier, expression, (handle) => {
		op(0);
		SimpleArgs(op, positional, named, false);
		op(57, handle);
		op(1);
	});
	else {
		expr(op, expression);
		op(0);
		SimpleArgs(op, positional, named, false);
		op(33, 2, 1);
		op(108);
		op(1);
	}
});
STATEMENTS.add(opcodes.StaticAttr, (op, [, name, value, namespace]) => {
	op(51, inflateAttrName(name), value, namespace ?? null);
});
STATEMENTS.add(opcodes.StaticComponentAttr, (op, [, name, value, namespace]) => {
	op(105, inflateAttrName(name), value, namespace ?? null);
});
STATEMENTS.add(opcodes.DynamicAttr, (op, [, name, value, namespace]) => {
	expr(op, value);
	op(52, inflateAttrName(name), false, namespace ?? null);
});
STATEMENTS.add(opcodes.TrustingDynamicAttr, (op, [, name, value, namespace]) => {
	expr(op, value);
	op(52, inflateAttrName(name), true, namespace ?? null);
});
STATEMENTS.add(opcodes.ComponentAttr, (op, [, name, value, namespace]) => {
	expr(op, value);
	op(53, inflateAttrName(name), false, namespace ?? null);
});
STATEMENTS.add(opcodes.TrustingComponentAttr, (op, [, name, value, namespace]) => {
	expr(op, value);
	op(53, inflateAttrName(name), true, namespace ?? null);
});
STATEMENTS.add(opcodes.OpenElement, (op, [, tag]) => {
	op(48, inflateTagName(tag));
});
STATEMENTS.add(opcodes.OpenElementWithSplat, (op, [, tag]) => {
	op(89);
	op(48, inflateTagName(tag));
});
STATEMENTS.add(opcodes.Component, (op, [, expr, elementBlock, named, blocks]) => {
	if (isGetFreeComponent(expr)) op(HighLevelResolutionOpcodes.Component, expr, (component) => {
		InvokeComponent(op, component, elementBlock, null, named, blocks);
	});
	else InvokeDynamicComponent(op, expr, elementBlock, null, named, blocks, true, true);
});
STATEMENTS.add(opcodes.Yield, (op, [, to, params]) => YieldBlock(op, to, params));
STATEMENTS.add(opcodes.AttrSplat, (op, [, to]) => YieldBlock(op, to, null));
STATEMENTS.add(opcodes.Debugger, (op, [, locals, upvars, lexical]) => {
	op(103, debugSymbolsOperand(locals, upvars, lexical));
});
STATEMENTS.add(opcodes.Append, (op, [, value]) => {
	if (!Array.isArray(value)) op(41, value === null || value === void 0 ? "" : String(value));
	else if (isGetFreeComponentOrHelper(value)) op(HighLevelResolutionOpcodes.OptionalComponentOrHelper, value, {
		ifComponent(component) {
			InvokeComponent(op, component, null, null, null, null);
		},
		ifHelper(handle) {
			op(0);
			Call(op, handle, null, null);
			op(3, stdlibOperand("cautious-non-dynamic-append"));
			op(1);
		},
		ifValue(handle) {
			op(0);
			op(29, handle);
			op(3, stdlibOperand("cautious-non-dynamic-append"));
			op(1);
		}
	});
	else if (value[0] === opcodes.Call) {
		let [, expression, positional, named] = value;
		if (isGetFreeComponentOrHelper(expression)) op(HighLevelResolutionOpcodes.ComponentOrHelper, expression, {
			ifComponent(component) {
				InvokeComponent(op, component, null, positional, hashToArgs(named), null);
			},
			ifHelper(handle) {
				op(0);
				Call(op, handle, positional, named);
				op(3, stdlibOperand("cautious-non-dynamic-append"));
				op(1);
			}
		});
		else SwitchCases(op, () => {
			expr(op, expression);
			op(106);
		}, (when) => {
			when(ContentType.Component, () => {
				op(68);
				op(81);
				op(79);
				InvokeNonStaticComponent(op, {
					capabilities: true,
					elementBlock: null,
					positional,
					named,
					atNames: false,
					blocks: namedBlocks(null)
				});
			});
			when(ContentType.Helper, () => {
				CallDynamic(op, positional, named, () => {
					op(3, stdlibOperand("cautious-non-dynamic-append"));
				});
			});
		});
	} else {
		op(0);
		expr(op, value);
		op(3, stdlibOperand("cautious-append"));
		op(1);
	}
});
STATEMENTS.add(opcodes.TrustingAppend, (op, [, value]) => {
	if (!Array.isArray(value)) op(41, value === null || value === void 0 ? "" : String(value));
	else {
		op(0);
		expr(op, value);
		op(3, stdlibOperand("trusting-append"));
		op(1);
	}
});
STATEMENTS.add(opcodes.Block, (op, [, expr, positional, named, blocks]) => {
	if (isGetFreeComponent(expr)) op(HighLevelResolutionOpcodes.Component, expr, (component) => {
		InvokeComponent(op, component, null, positional, hashToArgs(named), blocks);
	});
	else InvokeDynamicComponent(op, expr, null, positional, named, blocks, false, false);
});
STATEMENTS.add(opcodes.InElement, (op, [, block, guid, destination, insertBefore]) => {
	ReplayableIf(op, () => {
		expr(op, guid);
		if (insertBefore === void 0) PushPrimitiveReference(op, void 0);
		else expr(op, insertBefore);
		expr(op, destination);
		op(33, 3, 0);
		return 4;
	}, () => {
		op(50);
		InvokeStaticBlock(op, block);
		op(56);
	});
});
STATEMENTS.add(opcodes.If, (op, [, condition, block, inverse]) => ReplayableIf(op, () => {
	expr(op, condition);
	op(71);
	return 1;
}, () => {
	InvokeStaticBlock(op, block);
}, inverse ? () => {
	InvokeStaticBlock(op, inverse);
} : void 0));
STATEMENTS.add(opcodes.Each, (op, [, value, key, block, inverse]) => Replayable(op, () => {
	if (key) expr(op, key);
	else PushPrimitiveReference(op, null);
	expr(op, value);
	return 2;
}, () => {
	op(72, labelOperand("BODY"), labelOperand("ELSE"));
	op(0);
	op(33, 2, 1);
	op(6, labelOperand("ITER"));
	op(HighLevelBuilderOpcodes.Label, "ITER");
	op(74, labelOperand("BREAK"));
	op(HighLevelBuilderOpcodes.Label, "BODY");
	InvokeStaticBlockWithStack(op, block, 2);
	op(34, 2);
	op(4, labelOperand("FINALLY"));
	op(HighLevelBuilderOpcodes.Label, "BREAK");
	op(1);
	op(73);
	op(4, labelOperand("FINALLY"));
	op(HighLevelBuilderOpcodes.Label, "ELSE");
	if (inverse) InvokeStaticBlock(op, inverse);
}));
STATEMENTS.add(opcodes.Let, (op, [, positional, block]) => {
	InvokeStaticBlockWithStack(op, block, CompilePositional(op, positional));
});
STATEMENTS.add(opcodes.WithDynamicVars, (op, [, named, block]) => {
	if (named) {
		let [names, expressions] = named;
		CompilePositional(op, expressions);
		DynamicScope(op, names, () => {
			InvokeStaticBlock(op, block);
		});
	} else InvokeStaticBlock(op, block);
});
STATEMENTS.add(opcodes.InvokeComponent, (op, [, expr, positional, named, blocks]) => {
	if (isGetFreeComponent(expr)) op(HighLevelResolutionOpcodes.Component, expr, (component) => {
		InvokeComponent(op, component, null, positional, hashToArgs(named), blocks);
	});
	else InvokeDynamicComponent(op, expr, null, positional, named, blocks, false, false);
});
function hashToArgs(hash) {
	if (hash === null) return null;
	return [hash[0].map((key) => `@${key}`), hash[1]];
}
var PLACEHOLDER_HANDLE = -1;
var CompilableTemplateImpl = class {
	static {}
	compiled = /* @__PURE__ */ new WeakMap();
	constructor(statements, meta, symbolTable, moduleName = "plain block") {
		this.statements = statements;
		this.meta = meta;
		this.symbolTable = symbolTable;
		this.moduleName = moduleName;
	}
	compile(context) {
		return maybeCompile(this, context);
	}
};
function compilable(layout, moduleName) {
	let [statements, symbols] = layout.block;
	return new CompilableTemplateImpl(statements, meta(layout), { symbols }, moduleName);
}
function maybeCompile(compilable, context) {
	if (compilable.compiled.has(context)) return compilable.compiled.get(context);
	compilable.compiled.set(context, PLACEHOLDER_HANDLE);
	let { statements, meta } = compilable;
	let result = compileStatements(statements, meta, context);
	compilable.compiled.set(context, result);
	return result;
}
function compileStatements(statements, meta, syntaxContext) {
	let sCompiler = STATEMENTS;
	let context = templateCompilationContext(syntaxContext, meta);
	let { encoder, evaluation } = context;
	function pushOp(...op) {
		encodeOp(encoder, evaluation, meta, op);
	}
	for (const statement of statements) sCompiler.compile(pushOp, statement);
	return context.encoder.commit(meta.size);
}
function compilableBlock(block, containing) {
	return new CompilableTemplateImpl(block[0], containing, { parameters: block[1] || EMPTY_ARRAY });
}
var WrappedBuilder = class {
	symbolTable;
	compiled = null;
	attrsBlockNumber;
	meta;
	constructor(layout, moduleName) {
		this.layout = layout;
		this.moduleName = moduleName;
		let { block } = layout;
		let [, symbols] = block;
		symbols = symbols.slice();
		let attrsBlockIndex = symbols.indexOf(ATTRS_BLOCK);
		if (attrsBlockIndex === -1) this.attrsBlockNumber = symbols.push(ATTRS_BLOCK);
		else this.attrsBlockNumber = attrsBlockIndex + 1;
		this.symbolTable = { symbols };
		this.meta = meta(layout);
	}
	compile(syntax) {
		if (this.compiled !== null) return this.compiled;
		let m = meta(this.layout);
		let context = templateCompilationContext(syntax, m);
		let { encoder, evaluation } = context;
		function pushOp(...op) {
			encodeOp(encoder, evaluation, m, op);
		}
		WrappedComponent(pushOp, this.layout, this.attrsBlockNumber);
		let handle = context.encoder.commit(m.size);
		if (typeof handle !== "number") return handle;
		this.compiled = handle;
		return handle;
	}
};
var clientId = 0;
var templateCacheCounters = {
	cacheHit: 0,
	cacheMiss: 0
};
/**
* Wraps a template js in a template module to change it into a factory
* that handles lazy parsing the template and to create per env singletons
* of the template.
*/
function templateFactory({ id: templateId, moduleName, block, scope, isStrictMode }) {
	let id = templateId || `client-${clientId++}`;
	let parsedBlock;
	let ownerlessTemplate = null;
	let templateCache = /* @__PURE__ */ new WeakMap();
	let factory = (owner) => {
		if (parsedBlock === void 0) parsedBlock = JSON.parse(block);
		if (owner === void 0) {
			if (ownerlessTemplate === null) {
				templateCacheCounters.cacheMiss++;
				ownerlessTemplate = new TemplateImpl({
					id,
					block: parsedBlock,
					moduleName,
					owner: null,
					scope,
					isStrictMode
				});
			} else templateCacheCounters.cacheHit++;
			return ownerlessTemplate;
		}
		let result = templateCache.get(owner);
		if (result === void 0) {
			templateCacheCounters.cacheMiss++;
			result = new TemplateImpl({
				id,
				block: parsedBlock,
				moduleName,
				owner,
				scope,
				isStrictMode
			});
			templateCache.set(owner, result);
		} else templateCacheCounters.cacheHit++;
		return result;
	};
	factory.__id = id;
	factory.__meta = { moduleName };
	return factory;
}
var TemplateImpl = class {
	result = "ok";
	layout = null;
	wrappedLayout = null;
	constructor(parsedLayout) {
		this.parsedLayout = parsedLayout;
	}
	get moduleName() {
		return this.parsedLayout.moduleName;
	}
	get id() {
		return this.parsedLayout.id;
	}
	get referrer() {
		return {
			moduleName: this.parsedLayout.moduleName,
			owner: this.parsedLayout.owner
		};
	}
	asLayout() {
		if (this.layout) return this.layout;
		return this.layout = compilable(assign({}, this.parsedLayout), this.moduleName);
	}
	asWrappedLayout() {
		if (this.wrappedLayout) return this.wrappedLayout;
		return this.wrappedLayout = new WrappedBuilder(assign({}, this.parsedLayout), this.moduleName);
	}
};
//#endregion
export { encodeOp as a, templateFactory as c, SwitchCases as i, ContentType as l, EncoderImpl as n, invokePreparedComponent as o, InvokeBareComponent as r, templateCacheCounters as s, CallDynamic as t };
