//#region ../node_modules/.pnpm/content-tag@4.2.0/node_modules/content-tag/pkg/standalone/content_tag.js
var CodeMapPair = class CodeMapPair {
	static __wrap(ptr) {
		const obj = Object.create(CodeMapPair.prototype);
		obj.__wbg_ptr = ptr;
		CodeMapPairFinalization.register(obj, obj.__wbg_ptr, obj);
		return obj;
	}
	__destroy_into_raw() {
		const ptr = this.__wbg_ptr;
		this.__wbg_ptr = 0;
		CodeMapPairFinalization.unregister(this);
		return ptr;
	}
	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_codemappair_free(ptr, 0);
	}
	/**
	* @param {string} code
	* @param {string} map
	*/
	constructor(code, map) {
		const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		const ptr1 = passStringToWasm0(map, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len1 = WASM_VECTOR_LEN;
		const ret = wasm.codemappair_new(ptr0, len0, ptr1, len1);
		this.__wbg_ptr = ret;
		CodeMapPairFinalization.register(this, this.__wbg_ptr, this);
		return this;
	}
	/**
	* @returns {string}
	*/
	get code() {
		let deferred1_0;
		let deferred1_1;
		try {
			const ret = wasm.__wbg_get_codemappair_code(this.__wbg_ptr);
			deferred1_0 = ret[0];
			deferred1_1 = ret[1];
			return getStringFromWasm0(ret[0], ret[1]);
		} finally {
			wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
		}
	}
	/**
	* @returns {string}
	*/
	get map() {
		let deferred1_0;
		let deferred1_1;
		try {
			const ret = wasm.__wbg_get_codemappair_map(this.__wbg_ptr);
			deferred1_0 = ret[0];
			deferred1_1 = ret[1];
			return getStringFromWasm0(ret[0], ret[1]);
		} finally {
			wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
		}
	}
	/**
	* @param {string} arg0
	*/
	set code(arg0) {
		const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		wasm.__wbg_set_codemappair_code(this.__wbg_ptr, ptr0, len0);
	}
	/**
	* @param {string} arg0
	*/
	set map(arg0) {
		const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		wasm.__wbg_set_codemappair_map(this.__wbg_ptr, ptr0, len0);
	}
};
if (Symbol.dispose) CodeMapPair.prototype[Symbol.dispose] = CodeMapPair.prototype.free;
var Preprocessor = class {
	__destroy_into_raw() {
		const ptr = this.__wbg_ptr;
		this.__wbg_ptr = 0;
		PreprocessorFinalization.unregister(this);
		return ptr;
	}
	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_preprocessor_free(ptr, 0);
	}
	constructor() {
		const ret = wasm.preprocessor_new();
		this.__wbg_ptr = ret;
		PreprocessorFinalization.register(this, this.__wbg_ptr, this);
		return this;
	}
	/**
	* @param {string} src
	* @param {any} options
	* @returns {any}
	*/
	parse(src, options) {
		const ptr0 = passStringToWasm0(src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		const ret = wasm.preprocessor_parse(this.__wbg_ptr, ptr0, len0, options);
		if (ret[2]) throw takeFromExternrefTable0(ret[1]);
		return takeFromExternrefTable0(ret[0]);
	}
	/**
	* @param {string} src
	* @param {any} options
	* @returns {CodeMapPair}
	*/
	process(src, options) {
		const ptr0 = passStringToWasm0(src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
		const len0 = WASM_VECTOR_LEN;
		const ret = wasm.preprocessor_process(this.__wbg_ptr, ptr0, len0, options);
		if (ret[2]) throw takeFromExternrefTable0(ret[1]);
		return CodeMapPair.__wrap(ret[0]);
	}
};
if (Symbol.dispose) Preprocessor.prototype[Symbol.dispose] = Preprocessor.prototype.free;
function __wbg_get_imports() {
	return {
		__proto__: null,
		"./content_tag_bg.js": {
			__proto__: null,
			__wbg_Boolean_56701fbb0ba40957: function(arg0) {
				return Boolean(arg0);
			},
			__wbg_Error_1793cae569d55d52: function(arg0) {
				return Error(arg0);
			},
			__wbg_String_f656b08aa2423725: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(String(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_debug_string_edece8177ad01481: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(debugString(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_throw_9c31b086c2b26051: function(arg0, arg1) {
				throw new Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg_get_dcf82ab8aad1a593: function() {
				return handleError(function(arg0, arg1) {
					return Reflect.get(arg0, arg1);
				}, arguments);
			},
			__wbg_parse_48d3dd02aeaf9065: function(arg0) {
				return JSON.parse(arg0);
			},
			__wbg_set_a0e911be3da02782: function() {
				return handleError(function(arg0, arg1, arg2) {
					return Reflect.set(arg0, arg1, arg2);
				}, arguments);
			},
			__wbindgen_cast_0000000000000001: function(arg0, arg1) {
				return getStringFromWasm0(arg0, arg1);
			},
			__wbindgen_init_externref_table: function() {
				const table = wasm.__wbindgen_externrefs;
				const offset = table.grow(4);
				table.set(0, void 0);
				table.set(offset + 0, void 0);
				table.set(offset + 1, null);
				table.set(offset + 2, true);
				table.set(offset + 3, false);
			}
		}
	};
}
var CodeMapPairFinalization = typeof FinalizationRegistry === "undefined" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((ptr) => wasm.__wbg_codemappair_free(ptr, 1));
var PreprocessorFinalization = typeof FinalizationRegistry === "undefined" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((ptr) => wasm.__wbg_preprocessor_free(ptr, 1));
function addToExternrefTable0(obj) {
	const idx = wasm.__externref_table_alloc();
	wasm.__wbindgen_externrefs.set(idx, obj);
	return idx;
}
function debugString(val) {
	const type = typeof val;
	if (type == "number" || type == "boolean" || val == null) return `${val}`;
	if (type == "string") return `"${val}"`;
	if (type == "symbol") {
		const description = val.description;
		if (description == null) return "Symbol";
		else return `Symbol(${description})`;
	}
	if (type == "function") {
		const name = val.name;
		if (typeof name == "string" && name.length > 0) return `Function(${name})`;
		else return "Function";
	}
	if (Array.isArray(val)) {
		const length = val.length;
		let debug = "[";
		if (length > 0) debug += debugString(val[0]);
		for (let i = 1; i < length; i++) debug += ", " + debugString(val[i]);
		debug += "]";
		return debug;
	}
	const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
	let className;
	if (builtInMatches && builtInMatches.length > 1) className = builtInMatches[1];
	else return toString.call(val);
	if (className == "Object") try {
		return "Object(" + JSON.stringify(val) + ")";
	} catch (_) {
		return "Object";
	}
	if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
	return className;
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
	if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
	return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
	return decodeText(ptr >>> 0, len);
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
	if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
	return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
	try {
		return f.apply(this, args);
	} catch (e) {
		const idx = addToExternrefTable0(e);
		wasm.__wbindgen_exn_store(idx);
	}
}
function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === void 0) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length, 1) >>> 0;
		getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}
	let len = arg.length;
	let ptr = malloc(len, 1) >>> 0;
	const mem = getUint8ArrayMemory0();
	let offset = 0;
	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 127) break;
		mem[ptr + offset] = code;
	}
	if (offset !== len) {
		if (offset !== 0) arg = arg.slice(offset);
		ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
		const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
		const ret = cachedTextEncoder.encodeInto(arg, view);
		offset += ret.written;
		ptr = realloc(ptr, len, offset, 1) >>> 0;
	}
	WASM_VECTOR_LEN = offset;
	return ptr;
}
function takeFromExternrefTable0(idx) {
	const value = wasm.__wbindgen_externrefs.get(idx);
	wasm.__externref_table_dealloc(idx);
	return value;
}
var cachedTextDecoder = new TextDecoder("utf-8", {
	ignoreBOM: true,
	fatal: true
});
cachedTextDecoder.decode();
var MAX_SAFARI_DECODE_BYTES = 2146435072;
var numBytesDecoded = 0;
function decodeText(ptr, len) {
	numBytesDecoded += len;
	if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
		cachedTextDecoder = new TextDecoder("utf-8", {
			ignoreBOM: true,
			fatal: true
		});
		cachedTextDecoder.decode();
		numBytesDecoded = len;
	}
	return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedTextEncoder = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder)) cachedTextEncoder.encodeInto = function(arg, view) {
	const buf = cachedTextEncoder.encode(arg);
	view.set(buf);
	return {
		read: arg.length,
		written: buf.length
	};
};
var WASM_VECTOR_LEN = 0;
var wasm;
function __wbg_finalize_init(instance, module) {
	wasm = instance.exports;
	cachedDataViewMemory0 = null;
	cachedUint8ArrayMemory0 = null;
	wasm.__wbindgen_start();
	return wasm;
}
async function __wbg_load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") try {
			return await WebAssembly.instantiateStreaming(module, imports);
		} catch (e) {
			if (module.ok && expectedResponseType(module.type) && module.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
			else throw e;
		}
		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);
		if (instance instanceof WebAssembly.Instance) return {
			instance,
			module
		};
		else return instance;
	}
	function expectedResponseType(type) {
		switch (type) {
			case "basic":
			case "cors":
			case "default": return true;
		}
		return false;
	}
}
async function __wbg_init(module_or_path) {
	if (wasm !== void 0) return wasm;
	if (module_or_path !== void 0) {
		if (Object.getPrototypeOf(module_or_path) === Object.prototype) ({module_or_path} = module_or_path);
		else console.warn("using deprecated parameters for the initialization function; pass a single object instead");
	}
	if (module_or_path === void 0) module_or_path = new URL("/carbon-components-ember/pr-previews/pr-924/assets/content_tag_bg-DddKJ9_C.wasm", "" + import.meta.url);
	const imports = __wbg_get_imports();
	if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) module_or_path = fetch(module_or_path);
	const { instance, module } = await __wbg_load(await module_or_path, imports);
	return __wbg_finalize_init(instance, module);
}
//#endregion
//#region ../node_modules/.pnpm/content-tag@4.2.0/node_modules/content-tag/pkg/standalone.js
await __wbg_init();
//#endregion
export { Preprocessor };
