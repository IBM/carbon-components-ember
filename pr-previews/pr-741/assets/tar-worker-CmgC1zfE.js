(function () {
    'use strict';

    /**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: Apache-2.0
     */
    const proxyMarker = Symbol("Comlink.proxy");
    const createEndpoint = Symbol("Comlink.endpoint");
    const releaseProxy = Symbol("Comlink.releaseProxy");
    const finalizer = Symbol("Comlink.finalizer");
    const throwMarker = Symbol("Comlink.thrown");
    const isObject = (val) => (typeof val === "object" && val !== null) || typeof val === "function";
    /**
     * Internal transfer handle to handle objects marked to proxy.
     */
    const proxyTransferHandler = {
        canHandle: (val) => isObject(val) && val[proxyMarker],
        serialize(obj) {
            const { port1, port2 } = new MessageChannel();
            expose(obj, port1);
            return [port2, [port2]];
        },
        deserialize(port) {
            port.start();
            return wrap(port);
        },
    };
    /**
     * Internal transfer handler to handle thrown exceptions.
     */
    const throwTransferHandler = {
        canHandle: (value) => isObject(value) && throwMarker in value,
        serialize({ value }) {
            let serialized;
            if (value instanceof Error) {
                serialized = {
                    isError: true,
                    value: {
                        message: value.message,
                        name: value.name,
                        stack: value.stack,
                    },
                };
            }
            else {
                serialized = { isError: false, value };
            }
            return [serialized, []];
        },
        deserialize(serialized) {
            if (serialized.isError) {
                throw Object.assign(new Error(serialized.value.message), serialized.value);
            }
            throw serialized.value;
        },
    };
    /**
     * Allows customizing the serialization of certain values.
     */
    const transferHandlers = new Map([
        ["proxy", proxyTransferHandler],
        ["throw", throwTransferHandler],
    ]);
    function isAllowedOrigin(allowedOrigins, origin) {
        for (const allowedOrigin of allowedOrigins) {
            if (origin === allowedOrigin || allowedOrigin === "*") {
                return true;
            }
            if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
                return true;
            }
        }
        return false;
    }
    function expose(obj, ep = globalThis, allowedOrigins = ["*"]) {
        ep.addEventListener("message", function callback(ev) {
            if (!ev || !ev.data) {
                return;
            }
            if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
                console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
                return;
            }
            const { id, type, path } = Object.assign({ path: [] }, ev.data);
            const argumentList = (ev.data.argumentList || []).map(fromWireValue);
            let returnValue;
            try {
                const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
                const rawValue = path.reduce((obj, prop) => obj[prop], obj);
                switch (type) {
                    case "GET" /* MessageType.GET */:
                        {
                            returnValue = rawValue;
                        }
                        break;
                    case "SET" /* MessageType.SET */:
                        {
                            parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
                            returnValue = true;
                        }
                        break;
                    case "APPLY" /* MessageType.APPLY */:
                        {
                            returnValue = rawValue.apply(parent, argumentList);
                        }
                        break;
                    case "CONSTRUCT" /* MessageType.CONSTRUCT */:
                        {
                            const value = new rawValue(...argumentList);
                            returnValue = proxy(value);
                        }
                        break;
                    case "ENDPOINT" /* MessageType.ENDPOINT */:
                        {
                            const { port1, port2 } = new MessageChannel();
                            expose(obj, port2);
                            returnValue = transfer(port1, [port1]);
                        }
                        break;
                    case "RELEASE" /* MessageType.RELEASE */:
                        {
                            returnValue = undefined;
                        }
                        break;
                    default:
                        return;
                }
            }
            catch (value) {
                returnValue = { value, [throwMarker]: 0 };
            }
            Promise.resolve(returnValue)
                .catch((value) => {
                return { value, [throwMarker]: 0 };
            })
                .then((returnValue) => {
                const [wireValue, transferables] = toWireValue(returnValue);
                ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
                if (type === "RELEASE" /* MessageType.RELEASE */) {
                    // detach and deactive after sending release response above.
                    ep.removeEventListener("message", callback);
                    closeEndPoint(ep);
                    if (finalizer in obj && typeof obj[finalizer] === "function") {
                        obj[finalizer]();
                    }
                }
            })
                .catch((error) => {
                // Send Serialization Error To Caller
                const [wireValue, transferables] = toWireValue({
                    value: new TypeError("Unserializable return value"),
                    [throwMarker]: 0,
                });
                ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
            });
        });
        if (ep.start) {
            ep.start();
        }
    }
    function isMessagePort(endpoint) {
        return endpoint.constructor.name === "MessagePort";
    }
    function closeEndPoint(endpoint) {
        if (isMessagePort(endpoint))
            endpoint.close();
    }
    function wrap(ep, target) {
        const pendingListeners = new Map();
        ep.addEventListener("message", function handleMessage(ev) {
            const { data } = ev;
            if (!data || !data.id) {
                return;
            }
            const resolver = pendingListeners.get(data.id);
            if (!resolver) {
                return;
            }
            try {
                resolver(data);
            }
            finally {
                pendingListeners.delete(data.id);
            }
        });
        return createProxy(ep, pendingListeners, [], target);
    }
    function throwIfProxyReleased(isReleased) {
        if (isReleased) {
            throw new Error("Proxy has been released and is not useable");
        }
    }
    function releaseEndpoint(ep) {
        return requestResponseMessage(ep, new Map(), {
            type: "RELEASE" /* MessageType.RELEASE */,
        }).then(() => {
            closeEndPoint(ep);
        });
    }
    const proxyCounter = new WeakMap();
    const proxyFinalizers = "FinalizationRegistry" in globalThis &&
        new FinalizationRegistry((ep) => {
            const newCount = (proxyCounter.get(ep) || 0) - 1;
            proxyCounter.set(ep, newCount);
            if (newCount === 0) {
                releaseEndpoint(ep);
            }
        });
    function registerProxy(proxy, ep) {
        const newCount = (proxyCounter.get(ep) || 0) + 1;
        proxyCounter.set(ep, newCount);
        if (proxyFinalizers) {
            proxyFinalizers.register(proxy, ep, proxy);
        }
    }
    function unregisterProxy(proxy) {
        if (proxyFinalizers) {
            proxyFinalizers.unregister(proxy);
        }
    }
    function createProxy(ep, pendingListeners, path = [], target = function () { }) {
        let isProxyReleased = false;
        const proxy = new Proxy(target, {
            get(_target, prop) {
                throwIfProxyReleased(isProxyReleased);
                if (prop === releaseProxy) {
                    return () => {
                        unregisterProxy(proxy);
                        releaseEndpoint(ep);
                        pendingListeners.clear();
                        isProxyReleased = true;
                    };
                }
                if (prop === "then") {
                    if (path.length === 0) {
                        return { then: () => proxy };
                    }
                    const r = requestResponseMessage(ep, pendingListeners, {
                        type: "GET" /* MessageType.GET */,
                        path: path.map((p) => p.toString()),
                    }).then(fromWireValue);
                    return r.then.bind(r);
                }
                return createProxy(ep, pendingListeners, [...path, prop]);
            },
            set(_target, prop, rawValue) {
                throwIfProxyReleased(isProxyReleased);
                // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
                // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
                const [value, transferables] = toWireValue(rawValue);
                return requestResponseMessage(ep, pendingListeners, {
                    type: "SET" /* MessageType.SET */,
                    path: [...path, prop].map((p) => p.toString()),
                    value,
                }, transferables).then(fromWireValue);
            },
            apply(_target, _thisArg, rawArgumentList) {
                throwIfProxyReleased(isProxyReleased);
                const last = path[path.length - 1];
                if (last === createEndpoint) {
                    return requestResponseMessage(ep, pendingListeners, {
                        type: "ENDPOINT" /* MessageType.ENDPOINT */,
                    }).then(fromWireValue);
                }
                // We just pretend that `bind()` didn’t happen.
                if (last === "bind") {
                    return createProxy(ep, pendingListeners, path.slice(0, -1));
                }
                const [argumentList, transferables] = processArguments(rawArgumentList);
                return requestResponseMessage(ep, pendingListeners, {
                    type: "APPLY" /* MessageType.APPLY */,
                    path: path.map((p) => p.toString()),
                    argumentList,
                }, transferables).then(fromWireValue);
            },
            construct(_target, rawArgumentList) {
                throwIfProxyReleased(isProxyReleased);
                const [argumentList, transferables] = processArguments(rawArgumentList);
                return requestResponseMessage(ep, pendingListeners, {
                    type: "CONSTRUCT" /* MessageType.CONSTRUCT */,
                    path: path.map((p) => p.toString()),
                    argumentList,
                }, transferables).then(fromWireValue);
            },
        });
        registerProxy(proxy, ep);
        return proxy;
    }
    function myFlat(arr) {
        return Array.prototype.concat.apply([], arr);
    }
    function processArguments(argumentList) {
        const processed = argumentList.map(toWireValue);
        return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
    }
    const transferCache = new WeakMap();
    function transfer(obj, transfers) {
        transferCache.set(obj, transfers);
        return obj;
    }
    function proxy(obj) {
        return Object.assign(obj, { [proxyMarker]: true });
    }
    function toWireValue(value) {
        for (const [name, handler] of transferHandlers) {
            if (handler.canHandle(value)) {
                const [serializedValue, transferables] = handler.serialize(value);
                return [
                    {
                        type: "HANDLER" /* WireValueType.HANDLER */,
                        name,
                        value: serializedValue,
                    },
                    transferables,
                ];
            }
        }
        return [
            {
                type: "RAW" /* WireValueType.RAW */,
                value,
            },
            transferCache.get(value) || [],
        ];
    }
    function fromWireValue(value) {
        switch (value.type) {
            case "HANDLER" /* WireValueType.HANDLER */:
                return transferHandlers.get(value.name).deserialize(value.value);
            case "RAW" /* WireValueType.RAW */:
                return value.value;
        }
    }
    function requestResponseMessage(ep, pendingListeners, msg, transfers) {
        return new Promise((resolve) => {
            const id = generateUUID();
            pendingListeners.set(id, resolve);
            if (ep.start) {
                ep.start();
            }
            ep.postMessage(Object.assign({ id }, msg), transfers);
        });
    }
    function generateUUID() {
        return new Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
            .join("-");
    }

    const BLOCK_SIZE = 512;
    const FILE_TYPE = {
    	GZIP: "GZIP",
    	GZIP2: "GZIP2",
    	TAR: "TAR",
    	PLAIN: "PLAIN",
    };

    /**
     * @typedef FileDescription
     * @property {string} name - The name of the file.
     * @property {"file"|"directory"|number} type - The type of the file, either "file" or "directory".
     * @property {number} size - The size of the file in bytes.
     * @property {Uint8Array} data - The binary data of the file content.
     * @property {string} text - A getter to decode and return the file content as a UTF-8 string.
     * @property {FileAttrs} attrs - file attributes
     */

    /**
     * @typedef FileAttrs
     * @property {string} mode - The file permissions in octal format.
     * @property {number} uid - User ID of the file owner.
     * @property {number} gid - Group ID of the file owner.
     * @property {number} mtime - Last modification time in Unix time format.
     * @property {string} user - The username of the file owner.
     * @property {string} group - The group name of the file owner.
     */

    /**
     * Parses a tar file from binary data and returns an array of FileDescription objects.
     * @param {ArrayBuffer|Uint8Array} data - The binary data of the tar file.
     * @returns {Promise<FileDescription[]>} - An array of FileDescription objects representing the parsed files in the tar archive.
     */
    async function parseTar(data) {
    	let buffer = /** @type {Uint8Array} */ (data).buffer || /** @type {ArrayBuffer} */ (data);

    	const ftype = checkFileType(buffer);
    	if (ftype != FILE_TYPE.GZIP && ftype != FILE_TYPE.TAR) {
    		throw new Error("The file format should be tar.gz or tar");
    	}

    	if (ftype == FILE_TYPE.GZIP) {
    		// if the file is gzip we proceed to decompress the file and set that as the
    		// new buffer to be process
    		const stream = new ReadableStream({
    			start(controller) {
    				controller.enqueue(new Uint8Array(data));
    				controller.close();
    			},
    		}).pipeThrough(new DecompressionStream("gzip"));

    		buffer = await new Response(stream).arrayBuffer();
    		// TODO: we should again check the buffer type to make sure is a tar inside the gzip
    	}

    	/** @type {FileDescription[]} */
    	const files = [];
    	let offset = 0;

    	// TAR files consist of 512-byte blocks. Each file is preceded by a header block
    	// followed by data blocks. The archive ends with two consecutive null blocks.
    	while (offset < buffer.byteLength - BLOCK_SIZE) {
    		// File name (100 bytes, null-terminated string)
    		// In POSIX ustar format, this field stores the file name for short names
    		// or a prefix for long names
    		let name = readString(buffer, offset, 100);
    		if (name.length === 0) {
    			break;
    		}

    		// In case is a long name we need to added to the name
    		const prefix = readString(buffer, offset + 345, 155);
    		if (prefix) {
    			name = `${prefix}${name}`;
    		}

    		// File mode (8 bytes, octal number stored as ASCII)
    		// This represents the file permissions in octal format
    		const mode = readString(buffer, offset + 100, 8);

    		// File uid (8 bytes, octal number stored as ASCII)
    		// User ID of the file owner
    		const uid = Number.parseInt(readString(buffer, offset + 108, 8));

    		// File gid (8 bytes, octal number stored as ASCII)
    		// Group ID of the file owner
    		const gid = Number.parseInt(readString(buffer, offset + 116, 8));

    		// File size (12 bytes, octal number stored as ASCII)
    		// Size of the file in bytes
    		const size = readNumber(buffer, offset + 124, 12);

    		// File mtime (12 bytes, octal number stored as ASCII)
    		// Last modification time in Unix time format
    		const mtime = readNumber(buffer, offset + 136, 12);

    		// File type flag (1 byte)
    		// 0 or '\0': normal file
    		// 5: directory
    		// Other values represent special file types (e.g., symbolic links)
    		const _type = readNumber(buffer, offset + 156, 1);
    		const type = _type === 0 ? "file" : _type === 5 ? "directory" : _type;

    		// File owner username (32 bytes, null-terminated string)
    		// Present in POSIX ustar format
    		const user = readString(buffer, offset + 265, 32);

    		// File owner group name (32 bytes, null-terminated string)
    		// Present in POSIX ustar format
    		const group = readString(buffer, offset + 297, 32);

    		// Where the file content start in order to read the file data
    		const fileStart = offset + BLOCK_SIZE;

    		// File data
    		// For regular files, this contains the file contents
    		// For directories, this is empty (size should be 0)
    		const data = new Uint8Array(buffer, fileStart, size);

    		files.push({
    			name,
    			type,
    			size,
    			data,
    			get text() {
    				return new TextDecoder().decode(this.data);
    			},
    			attrs: {
    				mode,
    				uid,
    				gid,
    				mtime,
    				user,
    				group,
    			},
    		});

    		// Move to the next file
    		// The offset is increased by:
    		// 1. 512 bytes for the header
    		// 2. The file size rounded up to the nearest 512 bytes
    		offset += 512 + 512 * Math.trunc(size / 512);
    		if (size % 512) {
    			offset += 512;
    		}
    	}

    	return files;
    }

    /**
     * checkFileType function to check file type using a buffer
     * @param {ArrayBuffer|Uint8Array} buffer - The binary data of the file.
     * @returns {string} - The type of the file as defined in FILE_TYPE object.
     */
    function checkFileType(buffer) {
    	// Read the first 2 bytes (for gzip check)
    	let bytes = readBytes(buffer, 0, 2);
    	if (bufferToHex(bytes) === "1f8b") {
    		return FILE_TYPE.GZIP;
    	}

    	// Read the first 5 bytes (for bzip2 check)
    	bytes = readBytes(buffer, 0, 5);
    	if (bufferToHex(bytes) === "425a683931") {
    		return FILE_TYPE.GZIP2;
    	}

    	// Read 5 bytes starting at offset 257 (for tar check)
    	bytes = readBytes(buffer, 257, 5);
    	if (bufferToHex(bytes) === "7573746172") {
    		return FILE_TYPE.TAR;
    	}

    	return FILE_TYPE.PLAIN;
    }

    /**
     * Reads a null-terminated string from a buffer at a specified offset and size.
     * @param {ArrayBuffer|Uint8Array} buffer - The binary data of the buffer.
     * @param {number} offset - The starting offset in the buffer.
     * @param {number} size - The number of bytes to read.
     * @returns {string} - The string read from the buffer.
     */
    function readString(buffer, offset, size) {
    	const view = new Uint8Array(buffer, offset, size);
    	const i = view.indexOf(0);
    	const td = new TextDecoder();
    	return td.decode(view.slice(0, i));
    }

    /**
     * Reads an 8-bit number from a buffer at a specified offset and size.
     * @param {ArrayBuffer|Uint8Array} buffer - The binary data of the buffer.
     * @param {number} offset - The starting offset in the buffer.
     * @param {number} size - The number of bytes to read (must be 12 for mtime).
     * @returns {number} - The numeric value read from the buffer.
     */
    function readNumber(buffer, offset, size) {
    	const view = new Uint8Array(buffer, offset, size);
    	let str = "";
    	for (let i = 0; i < size; i++) {
    		str += String.fromCodePoint(view[i]);
    	}
    	return Number.parseInt(str, 8);
    }

    /**
     * Reads specific bytes from a buffer.
     * @param {ArrayBuffer|Uint8Array} buffer - The binary data of the buffer.
     * @param {number} start - The starting offset in the buffer.
     * @param {number} length - The number of bytes to read.
     * @returns {ArrayBuffer|Uint8Array} - A view into the Buffer containing the specified bytes.
     */
    function readBytes(buffer, start, length) {
    	return buffer.slice(start, start + length);
    }

    /**
     * Converts a buffer to a hex string representation.
     * @param {ArrayBuffer|Uint8Array} buffer - The binary data buffer.
     * @returns {string} - A hexadecimal string representing the buffer contents.
     */
    function bufferToHex(buffer) {
    	const uint8Array = new Uint8Array(buffer);
    	let hexString = "";

    	for (let i = 0; i < uint8Array.length; i++) {
    		hexString += uint8Array[i].toString(16).padStart(2, "0");
    	}

    	return hexString;
    }

    /**
     * @param {string} message
     * @param {unknown} test
     * @returns {asserts test}
     */
    function assert(message, test) {
      if (!test) {
        throw new Error(message);
      }
    }

    const secretKey = '__repl-sdk__compiler__';

    /**
     * @typedef {object} ResolveIdValue
     * @property {string} name
     * @property {string} version
     * @property {import('./types.ts').RequestAnswer} path
     *
     * @typedef {import('./request.js').Request} Request
     *
     * @typedef {typeof globalThis & { [secret]?: {
     *   requestCache?: Map<string, Request>,
     *   resolveId?: Map<string, ResolveIdValue>,
     *   tarballs?: Map<string, import('./types.ts').UntarredPackage>,
     *   resolves?: { [modulePath: string]: unknown },
     *   promiseCache?: Map<string, Promise<unknown>>,
     *   fileCache?: Map<string, { code: string, ext: string }>
     *   caches?: Caches
     * } }} ExtendedWindow
     */
    const secret = Symbol.for(secretKey);

    function getGlobal() {
      const global = /** @type {ExtendedWindow} */ (globalThis);

      return global;
    }

    assert(
      `There is already an instance of repl-sdk, and there can only be one. Make sure that your dependency graph is correct.`,
      !getGlobal()[secret]
    );

    class Caches {
      clear() {
        delete getGlobal()[secret];
      }

      /**
       * Cache of resolved modulePaths to their module "value"
       *
       * @type {{ [modulePath: string]: unknown }}
       */
      get resolves() {
        this.#root.resolves ||= {};

        return this.#root.resolves;
      }

      /**
       * Cache of untarred tarballs
       *
       * @type {Map<string, import('./types.ts').UntarredPackage>}
       */
      get tarballs() {
        this.#root.tarballs ||= new Map();

        return this.#root.tarballs;
      }

      /**
       * Cache of request resolutions
       *
       * @type {Map<string, ResolveIdValue>}
       */
      get resolveId() {
        this.#root.resolveId ||= new Map();

        return this.#root.resolveId;
      }

      /**
       * Cache of request Key to file content string
       *
       * @type {Map<string, { code: string, ext: string }>}
       */
      get fileCache() {
        this.#root.fileCache ||= new Map();

        return this.#root.fileCache;
      }

      /**
       * For any key, store a promise for resolving later
       *
       * @type {Map<string, Promise<unknown>>}
       */
      get promiseCache() {
        this.#root.promiseCache ||= new Map();

        return this.#root.promiseCache;
      }

      /**
       * @template Return
       * @type {(key: string, callback: () => Promise<any>) => Promise<any>}
       */
      cachedPromise(key, callback) {
        const existing = this.promiseCache.get(key);

        if (existing) {
          return /** @type {Promise<Return>} */ (existing);
        }

        const promise = callback();

        this.promiseCache.set(key, promise);

        return promise;
      }

      get requestCache() {
        this.#root.requestCache ||= new Map();

        return this.#root.requestCache;
      }

      get #root() {
        const global = getGlobal();

        global[secret] ||= {};
        global[secret].caches ||= this;

        return global[secret];
      }
    }

    const cache = new Caches();

    const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

    /**
     * @type {Map<string, unknown>} namp@version => manifest
     */
    const npmInfoCache = new Map();

    /**
     * @param {string} name
     * @param {string} version
     */
    async function getNPMInfo(name, version) {
      const key = `${name}@${version}`;

      assert(`Must pass valid npm-compatible package name`, packageNameRegex.test(name));

      const existing = npmInfoCache.get(key);

      if (existing) {
        return existing;
      }

      return cache.cachedPromise(`getNPMInfo:${key}`, async () => {
        assert(`Cannot get data from NPM without specifying the name of the package`, name);
        assert(`Version is required. It may be 'latest'`, version);

        const response = await fetch(`https://registry.npmjs.org/${name}`);
        const json = await response.json();

        npmInfoCache.set(key, json);

        return json;
      });
    }

    /**
     * @param {any} npmInfo
     * @param {string} requestedVersion
     */
    async function getTarUrl(npmInfo, requestedVersion) {
      const json = npmInfo;

      if (json.error) {
        throw new Error(json.error);
      }

      const tag =
        requestedVersion in json['dist-tags']
          ? json['dist-tags'][requestedVersion]
          : (requestedVersion ?? json['dist-tags'].latest);

      const requested = json.versions[tag];

      return requested.dist.tarball;
    }

    const obj = { getTar };

    expose(obj);

    /**
     * @param {string} name of the package
     * @param {string} requestedVersion version or tag to fetch the package at
     */
    async function getTar(name, requestedVersion) {
      const key = `${name}@${requestedVersion}`;
      const untarred = cache.tarballs.get(key);

      if (untarred) {
        return untarred;
      }

      const contents = await cache.cachedPromise(`getTar:${key}`, async () => {
        const json = await getNPMInfo(name, requestedVersion);
        const tgzUrl = await getTarUrl(json, requestedVersion);

        const response = await fetch(tgzUrl, {
          headers: {
            ACCEPT: 'application/octet-stream',
          },
        });

        return await untar(await response.arrayBuffer());
      });

      const manifest = JSON.parse(contents['package.json'].text);

      const info = /** @type {import('./types.ts').UntarredPackage}*/ ({ manifest, contents });

      cache.tarballs.set(key, info);

      return info;
    }

    /**
     * @param {ArrayBuffer} arrayBuffer
     */
    async function untar(arrayBuffer) {
      /**
       * @type {{ [name: string]: import('tarparser').FileDescription }}
       */
      const contents = {};

      for (const file of await parseTar(arrayBuffer)) {
        if (file.type === 'file') {
          contents[file.name.slice(8)] = file; // remove `package/` prefix
        }
      }

      return contents;
    }

})();
