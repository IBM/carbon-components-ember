let wasm;
const cachedTextDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true
}) : {
  decode: () => {
    throw Error('TextDecoder not available');
  }
};
if (typeof TextDecoder !== 'undefined') {
  cachedTextDecoder.decode();
}
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`;
  }
  if (type == 'string') {
    return `"${val}"`;
  }
  if (type == 'symbol') {
    const description = val.description;
    if (description == null) {
      return 'Symbol';
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == 'function') {
    const name = val.name;
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`;
    } else {
      return 'Function';
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = '[';
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i]);
    }
    debug += ']';
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')';
    } catch (_) {
      return 'Object';
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}
let WASM_VECTOR_LEN = 0;
const cachedTextEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : {
  encode: () => {
    throw Error('TextEncoder not available');
  }
};
const encodeString = typeof cachedTextEncoder.encodeInto === 'function' ? function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function (arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
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
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function notDefined(what) {
  return () => {
    throw new Error(`${what} is not defined`);
  };
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_2.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_2.set(idx, obj);
  return idx;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
const CodeMapPairFinalization = typeof FinalizationRegistry === 'undefined' ? {
  register: () => {},
  unregister: () => {}
} : new FinalizationRegistry(ptr => wasm.__wbg_codemappair_free(ptr >>> 0, 1));
class CodeMapPair {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
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
   * @param {string} arg0
   */
  set code(arg0) {
    const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_codemappair_code(this.__wbg_ptr, ptr0, len0);
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
  set map(arg0) {
    const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_codemappair_map(this.__wbg_ptr, ptr0, len0);
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
    this.__wbg_ptr = ret >>> 0;
    CodeMapPairFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
}
const PreprocessorFinalization = typeof FinalizationRegistry === 'undefined' ? {
  register: () => {},
  unregister: () => {}
} : new FinalizationRegistry(ptr => wasm.__wbg_preprocessor_free(ptr >>> 0, 1));
class Preprocessor {
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
    this.__wbg_ptr = ret >>> 0;
    PreprocessorFinalization.register(this, this.__wbg_ptr, this);
    return this;
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
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return CodeMapPair.__wrap(ret[0]);
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
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
}
async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get('Content-Type') != 'application/wasm') {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return {
        instance,
        module
      };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  };
  imports.wbg.__wbg_String_d7c955520b66a733 = function (arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_Error_58015c683709e145 = typeof Error == 'function' ? Error : notDefined('Error');
  imports.wbg.__wbg_Boolean_ef3e29efb4629824 = typeof Boolean == 'function' ? Boolean : notDefined('Boolean');
  imports.wbg.__wbg_parse_181a91d066d1f7fe = typeof JSON.parse == 'function' ? JSON.parse : notDefined('JSON.parse');
  imports.wbg.__wbindgen_is_object = function (arg0) {
    const val = arg0;
    const ret = typeof val === 'object' && val !== null;
    return ret;
  };
  imports.wbg.__wbg_crypto_c48a774b022d20ac = function (arg0) {
    const ret = arg0.crypto;
    return ret;
  };
  imports.wbg.__wbg_process_298734cf255a885d = function (arg0) {
    const ret = arg0.process;
    return ret;
  };
  imports.wbg.__wbg_versions_e2e78e134e3e5d01 = function (arg0) {
    const ret = arg0.versions;
    return ret;
  };
  imports.wbg.__wbg_node_1cd7a5d853dbea79 = function (arg0) {
    const ret = arg0.node;
    return ret;
  };
  imports.wbg.__wbindgen_is_string = function (arg0) {
    const ret = typeof arg0 === 'string';
    return ret;
  };
  imports.wbg.__wbg_require_8f08ceecec0f4fee = function () {
    return handleError(function () {
      const ret = module.require;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_msCrypto_bcb970640f50a1e8 = function (arg0) {
    const ret = arg0.msCrypto;
    return ret;
  };
  imports.wbg.__wbg_randomFillSync_dc1e9a60c158336d = function () {
    return handleError(function (arg0, arg1) {
      arg0.randomFillSync(arg1);
    }, arguments);
  };
  imports.wbg.__wbg_getRandomValues_37fa2ca9e4e07fab = function () {
    return handleError(function (arg0, arg1) {
      arg0.getRandomValues(arg1);
    }, arguments);
  };
  imports.wbg.__wbindgen_is_function = function (arg0) {
    const ret = typeof arg0 === 'function';
    return ret;
  };
  imports.wbg.__wbg_self_1ff1d729e9aae938 = function () {
    return handleError(function () {
      const ret = self.self;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_window_5f4faef6c12b79ec = function () {
    return handleError(function () {
      const ret = window.window;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_globalThis_1d39714405582d3c = function () {
    return handleError(function () {
      const ret = globalThis.globalThis;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_global_651f05c6a0944d1c = function () {
    return handleError(function () {
      const ret = global.global;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    const ret = arg0 === undefined;
    return ret;
  };
  imports.wbg.__wbg_newnoargs_581967eacc0e2604 = function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_call_cb65541d95d71282 = function () {
    return handleError(function (arg0, arg1) {
      const ret = arg0.call(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_call_01734de55d61e11d = function () {
    return handleError(function (arg0, arg1, arg2) {
      const ret = arg0.call(arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_get_97b561fb56f034b5 = function () {
    return handleError(function (arg0, arg1) {
      const ret = Reflect.get(arg0, arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_set_092e06b0f9d71865 = function () {
    return handleError(function (arg0, arg1, arg2) {
      const ret = Reflect.set(arg0, arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_buffer_085ec1f694018c4f = function (arg0) {
    const ret = arg0.buffer;
    return ret;
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_6da8e527659b86aa = function (arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_new_8125e318e6245eed = function (arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  };
  imports.wbg.__wbg_newwithlength_e5d69174d6984cd7 = function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_subarray_13db269f57aa838d = function (arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_set_5cf90238115182c3 = function (arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  };
  imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_memory = function () {
    const ret = wasm.memory;
    return ret;
  };
  imports.wbg.__wbindgen_init_externref_table = function () {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  };
  return imports;
}
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm;
  if (typeof module_or_path !== 'undefined') {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({
        module_or_path
      } = module_or_path);
    } else {
      console.warn('using deprecated parameters for the initialization function; pass a single object instead');
    }
  }
  if (typeof module_or_path === 'undefined') {
    module_or_path = new URL("/carbon-components-ember/versions/dev/assets/content_tag_bg-Cz3YKHEz.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === 'string' || typeof Request === 'function' && module_or_path instanceof Request || typeof URL === 'function' && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const {
    instance,
    module
  } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}

await __wbg_init();

export { Preprocessor };
