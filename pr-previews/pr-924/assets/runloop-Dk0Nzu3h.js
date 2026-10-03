import { n as __exportAll } from "./rolldown-runtime-DC62tzP2.js";
import { a as flushAsyncObservers } from "./observers-BmobpXAF-CkVUhhE-.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/error-handling/index.js
var onerror;
var onErrorTarget = { get onerror() {
	return onerror;
} };
function getOnerror() {
	return onerror;
}
function setOnerror(handler) {
	onerror = handler;
}
var dispatchOverride = null;
function getDispatchOverride() {
	return dispatchOverride;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/backburner.js/index.js
var SET_TIMEOUT = setTimeout;
var NOOP = () => {};
function buildNext(flush) {
	if (typeof Promise === "function") {
		const autorunPromise = Promise.resolve();
		return () => autorunPromise.then(flush);
	} else if (typeof MutationObserver === "function") {
		let iterations = 0;
		let observer = new MutationObserver(flush);
		let node = document.createTextNode("");
		observer.observe(node, { characterData: true });
		return () => {
			iterations = ++iterations % 2;
			node.data = "" + iterations;
			return iterations;
		};
	} else return () => SET_TIMEOUT(flush, 0);
}
function buildPlatform(flush) {
	let clearNext = NOOP;
	return {
		setTimeout(fn, ms) {
			return setTimeout(fn, ms);
		},
		clearTimeout(timerId) {
			return clearTimeout(timerId);
		},
		now() {
			return Date.now();
		},
		next: buildNext(flush),
		clearNext
	};
}
var NUMBER = /\d+/;
var TIMERS_OFFSET = 6;
function isCoercableNumber(suspect) {
	let type = typeof suspect;
	return type === "number" && suspect === suspect || type === "string" && NUMBER.test(suspect);
}
function getOnError(options) {
	return options.onError || options.onErrorTarget && options.onErrorTarget[options.onErrorMethod];
}
function findItem(target, method, collection) {
	let index = -1;
	for (let i = 0, l = collection.length; i < l; i += 4) if (collection[i] === target && collection[i + 1] === method) {
		index = i;
		break;
	}
	return index;
}
function findTimerItem(target, method, collection) {
	let index = -1;
	for (let i = 2, l = collection.length; i < l; i += 6) if (collection[i] === target && collection[i + 1] === method) {
		index = i - 2;
		break;
	}
	return index;
}
function getQueueItems(items, queueItemLength, queueItemPositionOffset = 0) {
	let queueItems = [];
	for (let i = 0; i < items.length; i += queueItemLength) {
		let maybeError = items[i + 3 + queueItemPositionOffset];
		let queueItem = {
			target: items[i + 0 + queueItemPositionOffset],
			method: items[i + 1 + queueItemPositionOffset],
			args: items[i + 2 + queueItemPositionOffset],
			stack: maybeError !== void 0 && "stack" in maybeError ? maybeError.stack : ""
		};
		queueItems.push(queueItem);
	}
	return queueItems;
}
function binarySearch(time, timers) {
	let start = 0;
	let end = timers.length - TIMERS_OFFSET;
	let middle;
	let l;
	while (start < end) {
		l = (end - start) / TIMERS_OFFSET;
		middle = start + l - l % TIMERS_OFFSET;
		if (time >= timers[middle]) start = middle + TIMERS_OFFSET;
		else end = middle;
	}
	return time >= timers[start] ? start + TIMERS_OFFSET : start;
}
var QUEUE_ITEM_LENGTH = 4;
var Queue = class {
	constructor(name, options = {}, globalOptions = {}) {
		this._queueBeingFlushed = [];
		this.targetQueues = /* @__PURE__ */ new Map();
		this.index = 0;
		this._queue = [];
		this.name = name;
		this.options = options;
		this.globalOptions = globalOptions;
	}
	stackFor(index) {
		if (index < this._queue.length) {
			let entry = this._queue[index * 3 + QUEUE_ITEM_LENGTH];
			if (entry) return entry.stack;
			else return null;
		}
	}
	flush(sync) {
		let { before, after } = this.options;
		let target;
		let method;
		let args;
		let errorRecordedForStack;
		this.targetQueues.clear();
		if (this._queueBeingFlushed.length === 0) {
			this._queueBeingFlushed = this._queue;
			this._queue = [];
		}
		if (before !== void 0) before();
		let invoke;
		let queueItems = this._queueBeingFlushed;
		if (queueItems.length > 0) {
			let onError = getOnError(this.globalOptions);
			invoke = onError ? this.invokeWithOnError : this.invoke;
			for (let i = this.index; i < queueItems.length; i += QUEUE_ITEM_LENGTH) {
				this.index += QUEUE_ITEM_LENGTH;
				method = queueItems[i + 1];
				if (method !== null) {
					target = queueItems[i];
					args = queueItems[i + 2];
					errorRecordedForStack = queueItems[i + 3];
					invoke(target, method, args, onError, errorRecordedForStack);
				}
				if (this.index !== this._queueBeingFlushed.length && this.globalOptions.mustYield && this.globalOptions.mustYield()) return 1;
			}
		}
		if (after !== void 0) after();
		this._queueBeingFlushed.length = 0;
		this.index = 0;
		if (sync !== false && this._queue.length > 0) this.flush(true);
	}
	hasWork() {
		return this._queueBeingFlushed.length > 0 || this._queue.length > 0;
	}
	cancel({ target, method }) {
		let queue = this._queue;
		let targetQueueMap = this.targetQueues.get(target);
		if (targetQueueMap !== void 0) targetQueueMap.delete(method);
		let index = findItem(target, method, queue);
		if (index > -1) {
			queue[index + 1] = null;
			return true;
		}
		queue = this._queueBeingFlushed;
		index = findItem(target, method, queue);
		if (index > -1) {
			queue[index + 1] = null;
			return true;
		}
		return false;
	}
	push(target, method, args, stack) {
		this._queue.push(target, method, args, stack);
		return {
			queue: this,
			target,
			method
		};
	}
	pushUnique(target, method, args, stack) {
		let localQueueMap = this.targetQueues.get(target);
		if (localQueueMap === void 0) {
			localQueueMap = /* @__PURE__ */ new Map();
			this.targetQueues.set(target, localQueueMap);
		}
		let index = localQueueMap.get(method);
		if (index === void 0) {
			let queueIndex = this._queue.push(target, method, args, stack) - QUEUE_ITEM_LENGTH;
			localQueueMap.set(method, queueIndex);
		} else {
			let queue = this._queue;
			queue[index + 2] = args;
			queue[index + 3] = stack;
		}
		return {
			queue: this,
			target,
			method
		};
	}
	_getDebugInfo(debugEnabled) {
		if (debugEnabled) return getQueueItems(this._queue, QUEUE_ITEM_LENGTH);
	}
	invoke(target, method, args) {
		if (args === void 0) method.call(target);
		else method.apply(target, args);
	}
	invokeWithOnError(target, method, args, onError, errorRecordedForStack) {
		try {
			if (args === void 0) method.call(target);
			else method.apply(target, args);
		} catch (error) {
			onError(error, errorRecordedForStack);
		}
	}
};
var DeferredActionQueues = class {
	constructor(queueNames = [], options) {
		this.queues = {};
		this.queueNameIndex = 0;
		this.queueNames = queueNames;
		queueNames.reduce(function(queues, queueName) {
			queues[queueName] = new Queue(queueName, options[queueName], options);
			return queues;
		}, this.queues);
	}
	/**
	* @method schedule
	* @param {String} queueName
	* @param {Any} target
	* @param {Any} method
	* @param {Any} args
	* @param {Boolean} onceFlag
	* @param {Any} stack
	* @return queue
	*/
	schedule(queueName, target, method, args, onceFlag, stack) {
		let queue = this.queues[queueName];
		if (queue === void 0) throw new Error(`You attempted to schedule an action in a queue (${queueName}) that doesn\'t exist`);
		if (method === void 0 || method === null) throw new Error(`You attempted to schedule an action in a queue (${queueName}) for a method that doesn\'t exist`);
		this.queueNameIndex = 0;
		if (onceFlag) return queue.pushUnique(target, method, args, stack);
		else return queue.push(target, method, args, stack);
	}
	/**
	* DeferredActionQueues.flush() calls Queue.flush()
	*
	* @method flush
	* @param {Boolean} fromAutorun
	*/
	flush(fromAutorun = false) {
		let queue;
		let queueName;
		let numberOfQueues = this.queueNames.length;
		while (this.queueNameIndex < numberOfQueues) {
			queueName = this.queueNames[this.queueNameIndex];
			queue = this.queues[queueName];
			if (queue.hasWork() === false) {
				this.queueNameIndex++;
				if (fromAutorun && this.queueNameIndex < numberOfQueues) return 1;
			} else if (queue.flush(false) === 1) return 1;
		}
	}
	/**
	* Returns debug information for the current queues.
	*
	* @method _getDebugInfo
	* @param {Boolean} debugEnabled
	* @returns {IDebugInfo | undefined}
	*/
	_getDebugInfo(debugEnabled) {
		if (debugEnabled) {
			let debugInfo = {};
			let queue;
			let queueName;
			let numberOfQueues = this.queueNames.length;
			let i = 0;
			while (i < numberOfQueues) {
				queueName = this.queueNames[i];
				queue = this.queues[queueName];
				debugInfo[queueName] = queue._getDebugInfo(debugEnabled);
				i++;
			}
			return debugInfo;
		}
	}
};
function iteratorDrain(fn) {
	let iterator = fn();
	let result = iterator.next();
	while (result.done === false) {
		result.value();
		result = iterator.next();
	}
}
var noop = function() {};
var DISABLE_SCHEDULE = Object.freeze([]);
function parseArgs() {
	let length = arguments.length;
	let args;
	let method;
	let target;
	if (length === 0);
	else if (length === 1) {
		target = null;
		method = arguments[0];
	} else {
		let argsIndex = 2;
		let methodOrTarget = arguments[0];
		let methodOrArgs = arguments[1];
		let type = typeof methodOrArgs;
		if (type === "function") {
			target = methodOrTarget;
			method = methodOrArgs;
		} else if (methodOrTarget !== null && type === "string" && methodOrArgs in methodOrTarget) {
			target = methodOrTarget;
			method = target[methodOrArgs];
		} else if (typeof methodOrTarget === "function") {
			argsIndex = 1;
			target = null;
			method = methodOrTarget;
		}
		if (length > argsIndex) {
			let len = length - argsIndex;
			args = new Array(len);
			for (let i = 0; i < len; i++) args[i] = arguments[i + argsIndex];
		}
	}
	return [
		target,
		method,
		args
	];
}
function parseTimerArgs() {
	let [target, method, args] = parseArgs(...arguments);
	let wait = 0;
	let length = args !== void 0 ? args.length : 0;
	if (length > 0) {
		let last = args[length - 1];
		if (isCoercableNumber(last)) wait = parseInt(args.pop(), 10);
	}
	return [
		target,
		method,
		args,
		wait
	];
}
function parseDebounceArgs() {
	let target;
	let method;
	let isImmediate;
	let args;
	let wait;
	if (arguments.length === 2) {
		method = arguments[0];
		wait = arguments[1];
		target = null;
	} else {
		[target, method, args] = parseArgs(...arguments);
		if (args === void 0) wait = 0;
		else {
			wait = args.pop();
			if (!isCoercableNumber(wait)) {
				isImmediate = wait === true;
				wait = args.pop();
			}
		}
	}
	wait = parseInt(wait, 10);
	return [
		target,
		method,
		args,
		wait,
		isImmediate
	];
}
var UUID = 0;
var beginCount = 0;
var endCount = 0;
var beginEventCount = 0;
var endEventCount = 0;
var runCount = 0;
var joinCount = 0;
var deferCount = 0;
var scheduleCount = 0;
var scheduleIterableCount = 0;
var deferOnceCount = 0;
var scheduleOnceCount = 0;
var setTimeoutCount = 0;
var laterCount = 0;
var throttleCount = 0;
var debounceCount = 0;
var cancelTimersCount = 0;
var cancelCount = 0;
var autorunsCreatedCount = 0;
var autorunsCompletedCount = 0;
var deferredActionQueuesCreatedCount = 0;
var nestedDeferredActionQueuesCreated = 0;
var Backburner = class {
	constructor(queueNames, options) {
		this.DEBUG = false;
		this.currentInstance = null;
		this.instanceStack = [];
		this._eventCallbacks = {
			end: [],
			begin: []
		};
		this._timerTimeoutId = null;
		this._timers = [];
		this._autorun = false;
		this._autorunStack = null;
		this.queueNames = queueNames;
		this.options = options || {};
		if (typeof this.options.defaultQueue === "string") this._defaultQueue = this.options.defaultQueue;
		else this._defaultQueue = this.queueNames[0];
		this._onBegin = this.options.onBegin || noop;
		this._onEnd = this.options.onEnd || noop;
		this._boundRunExpiredTimers = this._runExpiredTimers.bind(this);
		this._boundAutorunEnd = () => {
			autorunsCompletedCount++;
			if (this._autorun === false) return;
			this._autorun = false;
			this._autorunStack = null;
			this._end(true);
		};
		let builder = this.options._buildPlatform || buildPlatform;
		this._platform = builder(this._boundAutorunEnd);
	}
	get counters() {
		return {
			begin: beginCount,
			end: endCount,
			events: {
				begin: beginEventCount,
				end: endEventCount
			},
			autoruns: {
				created: autorunsCreatedCount,
				completed: autorunsCompletedCount
			},
			run: runCount,
			join: joinCount,
			defer: deferCount,
			schedule: scheduleCount,
			scheduleIterable: scheduleIterableCount,
			deferOnce: deferOnceCount,
			scheduleOnce: scheduleOnceCount,
			setTimeout: setTimeoutCount,
			later: laterCount,
			throttle: throttleCount,
			debounce: debounceCount,
			cancelTimers: cancelTimersCount,
			cancel: cancelCount,
			loops: {
				total: deferredActionQueuesCreatedCount,
				nested: nestedDeferredActionQueuesCreated
			}
		};
	}
	get defaultQueue() {
		return this._defaultQueue;
	}
	begin() {
		beginCount++;
		let options = this.options;
		let previousInstance = this.currentInstance;
		let current;
		if (this._autorun !== false) {
			current = previousInstance;
			this._cancelAutorun();
		} else {
			if (previousInstance !== null) {
				nestedDeferredActionQueuesCreated++;
				this.instanceStack.push(previousInstance);
			}
			deferredActionQueuesCreatedCount++;
			current = this.currentInstance = new DeferredActionQueues(this.queueNames, options);
			beginEventCount++;
			this._trigger("begin", current, previousInstance);
		}
		this._onBegin(current, previousInstance);
		return current;
	}
	end() {
		endCount++;
		this._end(false);
	}
	on(eventName, callback) {
		if (typeof callback !== "function") throw new TypeError(`Callback must be a function`);
		let callbacks = this._eventCallbacks[eventName];
		if (callbacks !== void 0) callbacks.push(callback);
		else throw new TypeError(`Cannot on() event ${eventName} because it does not exist`);
	}
	off(eventName, callback) {
		let callbacks = this._eventCallbacks[eventName];
		if (!eventName || callbacks === void 0) throw new TypeError(`Cannot off() event ${eventName} because it does not exist`);
		let callbackFound = false;
		if (callback) {
			for (let i = 0; i < callbacks.length; i++) if (callbacks[i] === callback) {
				callbackFound = true;
				callbacks.splice(i, 1);
				i--;
			}
		}
		if (!callbackFound) throw new TypeError(`Cannot off() callback that does not exist`);
	}
	run() {
		runCount++;
		let [target, method, args] = parseArgs(...arguments);
		return this._run(target, method, args);
	}
	join() {
		joinCount++;
		let [target, method, args] = parseArgs(...arguments);
		return this._join(target, method, args);
	}
	/**
	* @deprecated please use schedule instead.
	*/
	defer(queueName, target, method, ...args) {
		deferCount++;
		return this.schedule(queueName, target, method, ...args);
	}
	schedule(queueName, ..._args) {
		scheduleCount++;
		let [target, method, args] = parseArgs(..._args);
		let stack = this.DEBUG ? /* @__PURE__ */ new Error() : void 0;
		return this._ensureInstance().schedule(queueName, target, method, args, false, stack);
	}
	scheduleIterable(queueName, iterable) {
		scheduleIterableCount++;
		let stack = this.DEBUG ? /* @__PURE__ */ new Error() : void 0;
		return this._ensureInstance().schedule(queueName, null, iteratorDrain, [iterable], false, stack);
	}
	/**
	* @deprecated please use scheduleOnce instead.
	*/
	deferOnce(queueName, target, method, ...args) {
		deferOnceCount++;
		return this.scheduleOnce(queueName, target, method, ...args);
	}
	scheduleOnce(queueName, ..._args) {
		scheduleOnceCount++;
		let [target, method, args] = parseArgs(..._args);
		let stack = this.DEBUG ? /* @__PURE__ */ new Error() : void 0;
		return this._ensureInstance().schedule(queueName, target, method, args, true, stack);
	}
	setTimeout() {
		setTimeoutCount++;
		return this.later(...arguments);
	}
	later() {
		laterCount++;
		let [target, method, args, wait] = parseTimerArgs(...arguments);
		return this._later(target, method, args, wait);
	}
	throttle() {
		throttleCount++;
		let [target, method, args, wait, isImmediate = true] = parseDebounceArgs(...arguments);
		let index = findTimerItem(target, method, this._timers);
		let timerId;
		if (index === -1) {
			timerId = this._later(target, method, isImmediate ? DISABLE_SCHEDULE : args, wait);
			if (isImmediate) this._join(target, method, args);
		} else {
			timerId = this._timers[index + 1];
			let argIndex = index + 4;
			if (this._timers[argIndex] !== DISABLE_SCHEDULE) this._timers[argIndex] = args;
		}
		return timerId;
	}
	debounce() {
		debounceCount++;
		let [target, method, args, wait, isImmediate = false] = parseDebounceArgs(...arguments);
		let _timers = this._timers;
		let index = findTimerItem(target, method, _timers);
		let timerId;
		if (index === -1) {
			timerId = this._later(target, method, isImmediate ? DISABLE_SCHEDULE : args, wait);
			if (isImmediate) this._join(target, method, args);
		} else {
			let executeAt = this._platform.now() + wait;
			let argIndex = index + 4;
			if (_timers[argIndex] === DISABLE_SCHEDULE) args = DISABLE_SCHEDULE;
			timerId = _timers[index + 1];
			let i = binarySearch(executeAt, _timers);
			if (index + TIMERS_OFFSET === i) {
				_timers[index] = executeAt;
				_timers[argIndex] = args;
			} else {
				let stack = this._timers[index + 5];
				this._timers.splice(i, 0, executeAt, timerId, target, method, args, stack);
				this._timers.splice(index, TIMERS_OFFSET);
			}
			if (index === 0) this._reinstallTimerTimeout();
		}
		return timerId;
	}
	cancelTimers() {
		cancelTimersCount++;
		this._clearTimerTimeout();
		this._timers = [];
		this._cancelAutorun();
	}
	hasTimers() {
		return this._timers.length > 0 || this._autorun;
	}
	cancel(timer) {
		cancelCount++;
		if (timer === null || timer === void 0) return false;
		let timerType = typeof timer;
		if (timerType === "number") return this._cancelLaterTimer(timer);
		else if (timerType === "object" && timer.queue && timer.method) return timer.queue.cancel(timer);
		return false;
	}
	ensureInstance() {
		this._ensureInstance();
	}
	/**
	* Returns debug information related to the current instance of Backburner
	*
	* @method getDebugInfo
	* @returns {Object | undefined} Will return and Object containing debug information if
	* the DEBUG flag is set to true on the current instance of Backburner, else undefined.
	*/
	getDebugInfo() {
		if (this.DEBUG) return {
			autorun: this._autorunStack,
			counters: this.counters,
			timers: getQueueItems(this._timers, TIMERS_OFFSET, 2),
			instanceStack: [this.currentInstance, ...this.instanceStack].map((deferredActionQueue) => deferredActionQueue && deferredActionQueue._getDebugInfo(this.DEBUG))
		};
	}
	_end(fromAutorun) {
		let currentInstance = this.currentInstance;
		let nextInstance = null;
		if (currentInstance === null) throw new Error(`end called without begin`);
		let finallyAlreadyCalled = false;
		let result;
		try {
			result = currentInstance.flush(fromAutorun);
		} finally {
			if (!finallyAlreadyCalled) {
				finallyAlreadyCalled = true;
				if (result === 1) {
					const plannedNextQueue = this.queueNames[currentInstance.queueNameIndex];
					this._scheduleAutorun(plannedNextQueue);
				} else {
					this.currentInstance = null;
					if (this.instanceStack.length > 0) {
						nextInstance = this.instanceStack.pop();
						this.currentInstance = nextInstance;
					}
					this._trigger("end", currentInstance, nextInstance);
					this._onEnd(currentInstance, nextInstance);
				}
			}
		}
	}
	_join(target, method, args) {
		if (this.currentInstance === null) return this._run(target, method, args);
		if (target === void 0 && args === void 0) return method();
		else return method.apply(target, args);
	}
	_run(target, method, args) {
		let onError = getOnError(this.options);
		this.begin();
		if (onError) try {
			return method.apply(target, args);
		} catch (error) {
			onError(error);
		} finally {
			this.end();
		}
		else try {
			return method.apply(target, args);
		} finally {
			this.end();
		}
	}
	_cancelAutorun() {
		if (this._autorun) {
			this._platform.clearNext();
			this._autorun = false;
			this._autorunStack = null;
		}
	}
	_later(target, method, args, wait) {
		let stack = this.DEBUG ? /* @__PURE__ */ new Error() : void 0;
		let executeAt = this._platform.now() + wait;
		let id = UUID++;
		if (this._timers.length === 0) {
			this._timers.push(executeAt, id, target, method, args, stack);
			this._installTimerTimeout();
		} else {
			let i = binarySearch(executeAt, this._timers);
			this._timers.splice(i, 0, executeAt, id, target, method, args, stack);
			this._reinstallTimerTimeout();
		}
		return id;
	}
	_cancelLaterTimer(timer) {
		for (let i = 1; i < this._timers.length; i += TIMERS_OFFSET) if (this._timers[i] === timer) {
			this._timers.splice(i - 1, TIMERS_OFFSET);
			if (i === 1) this._reinstallTimerTimeout();
			return true;
		}
		return false;
	}
	/**
	Trigger an event. Supports up to two arguments. Designed around
	triggering transition events from one run loop instance to the
	next, which requires an argument for the  instance and then
	an argument for the next instance.
	@private
	@method _trigger
	@param {String} eventName
	@param {any} arg1
	@param {any} arg2
	*/
	_trigger(eventName, arg1, arg2) {
		let callbacks = this._eventCallbacks[eventName];
		if (callbacks !== void 0) for (let i = 0; i < callbacks.length; i++) callbacks[i](arg1, arg2);
	}
	_runExpiredTimers() {
		this._timerTimeoutId = null;
		if (this._timers.length > 0) {
			this.begin();
			this._scheduleExpiredTimers();
			this.end();
		}
	}
	_scheduleExpiredTimers() {
		let timers = this._timers;
		let i = 0;
		let l = timers.length;
		let defaultQueue = this._defaultQueue;
		let n = this._platform.now();
		for (; i < l; i += TIMERS_OFFSET) {
			if (timers[i] > n) break;
			let args = timers[i + 4];
			if (args !== DISABLE_SCHEDULE) {
				let target = timers[i + 2];
				let method = timers[i + 3];
				let stack = timers[i + 5];
				this.currentInstance.schedule(defaultQueue, target, method, args, false, stack);
			}
		}
		timers.splice(0, i);
		this._installTimerTimeout();
	}
	_reinstallTimerTimeout() {
		this._clearTimerTimeout();
		this._installTimerTimeout();
	}
	_clearTimerTimeout() {
		if (this._timerTimeoutId === null) return;
		this._platform.clearTimeout(this._timerTimeoutId);
		this._timerTimeoutId = null;
	}
	_installTimerTimeout() {
		if (this._timers.length === 0) return;
		let minExpiresAt = this._timers[0];
		let n = this._platform.now();
		let wait = Math.max(0, minExpiresAt - n);
		this._timerTimeoutId = this._platform.setTimeout(this._boundRunExpiredTimers, wait);
	}
	_ensureInstance() {
		let currentInstance = this.currentInstance;
		if (currentInstance === null) {
			this._autorunStack = this.DEBUG ? /* @__PURE__ */ new Error() : void 0;
			currentInstance = this.begin();
			this._scheduleAutorun(this.queueNames[0]);
		}
		return currentInstance;
	}
	_scheduleAutorun(plannedNextQueue) {
		autorunsCreatedCount++;
		const next = this._platform.next;
		const flush = this.options.flush;
		if (flush) flush(plannedNextQueue, next);
		else next();
		this._autorun = true;
	}
};
Backburner.Queue = Queue;
Backburner.buildPlatform = buildPlatform;
Backburner.buildNext = buildNext;
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/runloop/index.js
var runloop_exports = /* @__PURE__ */ __exportAll({
	_backburner: () => _backburner,
	_cancelTimers: () => _cancelTimers,
	_getCurrentRunLoop: () => _getCurrentRunLoop,
	_hasScheduledTimers: () => _hasScheduledTimers,
	_queues: () => _queues,
	_rsvpErrorQueue: () => _rsvpErrorQueue,
	begin: () => begin,
	bind: () => bind,
	cancel: () => cancel,
	debounce: () => debounce,
	end: () => end,
	join: () => join,
	later: () => later,
	next: () => next,
	once: () => once,
	run: () => run,
	schedule: () => schedule,
	scheduleOnce: () => scheduleOnce,
	throttle: () => throttle
});
var currentRunLoop = null;
function _getCurrentRunLoop() {
	return currentRunLoop;
}
function onBegin(current) {
	currentRunLoop = current;
}
function onEnd(_current, next) {
	currentRunLoop = next;
	flushAsyncObservers(schedule);
}
function flush(queueName, next) {
	if (queueName === "render" || queueName === _rsvpErrorQueue) flushAsyncObservers(schedule);
	next();
}
var _rsvpErrorQueue = `${Math.random()}${Date.now()}`.replace(".", "");
/**
Array of named queues. This array determines the order in which queues
are flushed at the end of the RunLoop. You can define your own queues by
simply adding the queue name to this array. Normally you should not need
to inspect or modify this property.

@property queues
@type Array
@default ['actions', 'destroy']
@private
*/
var _queues = [
	"actions",
	"routerTransitions",
	"render",
	"afterRender",
	"destroy",
	_rsvpErrorQueue
];
/**
* @internal
* @private
*/
var _backburner = new Backburner(_queues, {
	defaultQueue: "actions",
	onBegin,
	onEnd,
	onErrorTarget,
	onErrorMethod: "onerror",
	flush
});
/**
@module @ember/runloop
*/
/**
Runs the passed target and method inside of a RunLoop, ensuring any
deferred actions including bindings and views updates are flushed at the
end.

Normally you should not need to invoke this method yourself. However if
you are implementing raw event handlers when interfacing with other
libraries or plugins, you should probably wrap all of your code inside this
call.

```javascript
import { run } from '@ember/runloop';

run(function() {
// code to be executed within a RunLoop
});
```
@method run
@for @ember/runloop
@static
@param {Object} [target] target of method to call
@param {Function|String} method Method to invoke.
May be a function or a string. If you pass a string
then it will be looked up on the passed target.
@param {Object} [args*] Any additional arguments you wish to pass to the method.
@return {Object} return value from invoking the passed function.
@public
*/
function run(...args) {
	return _backburner.run(...args);
}
/**
If no run-loop is present, it creates a new one. If a run loop is
present it will queue itself to run on the existing run-loops action
queue.

Please note: This is not for normal usage, and should be used sparingly.

If invoked when not within a run loop:

```javascript
import { join } from '@ember/runloop';

join(function() {
// creates a new run-loop
});
```

Alternatively, if called within an existing run loop:

```javascript
import { run, join } from '@ember/runloop';

run(function() {
// creates a new run-loop

join(function() {
// joins with the existing run-loop, and queues for invocation on
// the existing run-loops action queue.
});
});
```

@method join
@static
@for @ember/runloop
@param {Object} [target] target of method to call
@param {Function|String} method Method to invoke.
May be a function or a string. If you pass a string
then it will be looked up on the passed target.
@param {Object} [args*] Any additional arguments you wish to pass to the method.
@return {Object} Return value from invoking the passed function. Please note,
when called within an existing loop, no return value is possible.
@public
*/
function join(methodOrTarget, methodOrArg, ...additionalArgs) {
	return _backburner.join(methodOrTarget, methodOrArg, ...additionalArgs);
}
/**
Allows you to specify which context to call the specified function in while
adding the execution of that function to the Ember run loop. This ability
makes this method a great way to asynchronously integrate third-party libraries
into your Ember application.

`bind` takes two main arguments, the desired context and the function to
invoke in that context. Any additional arguments will be supplied as arguments
to the function that is passed in.

Let's use the creation of a TinyMCE component as an example. Currently,
TinyMCE provides a setup configuration option we can use to do some processing
after the TinyMCE instance is initialized but before it is actually rendered.
We can use that setup option to do some additional setup for our component.
The component itself could look something like the following:

```app/components/rich-text-editor.js
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { bind } from '@ember/runloop';

export default Component.extend({
initializeTinyMCE: on('didInsertElement', function() {
tinymce.init({
selector: '#' + this.$().prop('id'),
setup: bind(this, this.setupEditor)
});
}),

didInsertElement() {
tinymce.init({
selector: '#' + this.$().prop('id'),
setup: bind(this, this.setupEditor)
});
}

setupEditor(editor) {
this.set('editor', editor);

editor.on('change', function() {
console.log('content changed!');
});
}
});
```

In this example, we use `bind` to bind the setupEditor method to the
context of the RichTextEditor component and to have the invocation of that
method be safely handled and executed by the Ember run loop.

@method bind
@static
@for @ember/runloop
@param {Object} [target] target of method to call
@param {Function|String} method Method to invoke.
May be a function or a string. If you pass a string
then it will be looked up on the passed target.
@param {Object} [args*] Any additional arguments you wish to pass to the method.
@return {Function} returns a new function that will always have a particular context
@since 1.4.0
@public
*/
function bind(...curried) {
	return (...args) => join(...curried.concat(args));
}
/**
Begins a new RunLoop. Any deferred actions invoked after the begin will
be buffered until you invoke a matching call to `end()`. This is
a lower-level way to use a RunLoop instead of using `run()`.

```javascript
import { begin, end } from '@ember/runloop';

begin();
// code to be executed within a RunLoop
end();
```

@method begin
@static
@for @ember/runloop
@return {void}
@public
*/
function begin() {
	_backburner.begin();
}
/**
Ends a RunLoop. This must be called sometime after you call
`begin()` to flush any deferred actions. This is a lower-level way
to use a RunLoop instead of using `run()`.

```javascript
import { begin, end } from '@ember/runloop';

begin();
// code to be executed within a RunLoop
end();
```

@method end
@static
@for @ember/runloop
@return {void}
@public
*/
function end() {
	_backburner.end();
}
/**
Adds the passed target/method and any optional arguments to the named
queue to be executed at the end of the RunLoop. If you have not already
started a RunLoop when calling this method one will be started for you
automatically.

At the end of a RunLoop, any methods scheduled in this way will be invoked.
Methods will be invoked in an order matching the named queues defined in
the `queues` property.

```javascript
import { schedule } from '@ember/runloop';

schedule('afterRender', this, function() {
// this will be executed in the 'afterRender' queue
console.log('scheduled on afterRender queue');
});

schedule('actions', this, function() {
// this will be executed in the 'actions' queue
console.log('scheduled on actions queue');
});

// Note the functions will be run in order based on the run queues order.
// Output would be:
//   scheduled on actions queue
//   scheduled on afterRender queue
```

@method schedule
@static
@for @ember/runloop
@param {String} queue The name of the queue to schedule against. Default queues is 'actions'
@param {Object} [target] target object to use as the context when invoking a method.
@param {String|Function} method The method to invoke. If you pass a string it
will be resolved on the target object at the time the scheduled item is
invoked allowing you to change the target function.
@param {Object} [arguments*] Optional arguments to be passed to the queued method.
@return {*} Timer information for use in canceling, see `cancel`.
@public
*/
function schedule(...args) {
	return _backburner.schedule(...args);
}
function _hasScheduledTimers() {
	return _backburner.hasTimers();
}
function _cancelTimers() {
	_backburner.cancelTimers();
}
/**
Invokes the passed target/method and optional arguments after a specified
period of time. The last parameter of this method must always be a number
of milliseconds.

You should use this method whenever you need to run some action after a
period of time instead of using `setTimeout()`. This method will ensure that
items that expire during the same script execution cycle all execute
together, which is often more efficient than using a real setTimeout.

```javascript
import { later } from '@ember/runloop';

later(myContext, function() {
// code here will execute within a RunLoop in about 500ms with this == myContext
}, 500);
```

@method later
@static
@for @ember/runloop
@param {Object} [target] target of method to invoke
@param {Function|String} method The method to invoke.
If you pass a string it will be resolved on the
target at the time the method is invoked.
@param {Object} [args*] Optional arguments to pass to the timeout.
@param {Number} wait Number of milliseconds to wait.
@return {*} Timer information for use in canceling, see `cancel`.
@public
*/
function later(...args) {
	return _backburner.later(...args);
}
/**
Schedule a function to run one time during the current RunLoop. This is equivalent
to calling `scheduleOnce` with the "actions" queue.

@method once
@static
@for @ember/runloop
@param {Object} [target] The target of the method to invoke.
@param {Function|String} method The method to invoke.
If you pass a string it will be resolved on the
target at the time the method is invoked.
@param {Object} [args*] Optional arguments to pass to the timeout.
@return {Object} Timer information for use in canceling, see `cancel`.
@public
*/
function once(...args) {
	return _backburner.scheduleOnce("actions", ...args);
}
/**
Schedules a function to run one time in a given queue of the current RunLoop.
Calling this method with the same queue/target/method combination will have
no effect (past the initial call).

Note that although you can pass optional arguments these will not be
considered when looking for duplicates. New arguments will replace previous
calls.

```javascript
import { run, scheduleOnce } from '@ember/runloop';

function sayHi() {
console.log('hi');
}

run(function() {
scheduleOnce('afterRender', myContext, sayHi);
scheduleOnce('afterRender', myContext, sayHi);
// sayHi will only be executed once, in the afterRender queue of the RunLoop
});
```

Also note that for `scheduleOnce` to prevent additional calls, you need to
pass the same function instance. The following case works as expected:

```javascript
function log() {
console.log('Logging only once');
}

function scheduleIt() {
scheduleOnce('actions', myContext, log);
}

scheduleIt();
scheduleIt();
```

But this other case will schedule the function multiple times:

```javascript
import { scheduleOnce } from '@ember/runloop';

function scheduleIt() {
scheduleOnce('actions', myContext, function() {
console.log('Closure');
});
}

scheduleIt();
scheduleIt();

// "Closure" will print twice, even though we're using `scheduleOnce`,
// because the function we pass to it won't match the
// previously scheduled operation.
```

Available queues, and their order, can be found at `queues`

@method scheduleOnce
@static
@for @ember/runloop
@param {String} [queue] The name of the queue to schedule against. Default queues is 'actions'.
@param {Object} [target] The target of the method to invoke.
@param {Function|String} method The method to invoke.
If you pass a string it will be resolved on the
target at the time the method is invoked.
@param {Object} [args*] Optional arguments to pass to the timeout.
@return {Object} Timer information for use in canceling, see `cancel`.
@public
*/
function scheduleOnce(...args) {
	return _backburner.scheduleOnce(...args);
}
/**
Schedules an item to run from within a separate run loop, after
control has been returned to the system. This is equivalent to calling
`later` with a wait time of 1ms.

```javascript
import { next } from '@ember/runloop';

next(myContext, function() {
// code to be executed in the next run loop,
// which will be scheduled after the current one
});
```

Multiple operations scheduled with `next` will coalesce
into the same later run loop, along with any other operations
scheduled by `later` that expire right around the same
time that `next` operations will fire.

Note that there are often alternatives to using `next`.
For instance, if you'd like to schedule an operation to happen
after all DOM element operations have completed within the current
run loop, you can make use of the `afterRender` run loop queue (added
by the `ember-views` package, along with the preceding `render` queue
where all the DOM element operations happen).

Example:

```app/components/my-component.js
import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';

export default class MyComponent extends Component {
didInsertElement() {
super.didInsertElement();
scheduleOnce('afterRender', this, 'processChildElements');
},

processChildElements() {
// ... do something with component's child component
// elements after they've finished rendering, which
// can't be done within this component's
// `didInsertElement` hook because that gets run
// before the child elements have been added to the DOM.
}
}
```

One benefit of the above approach compared to using `next` is
that you will be able to perform DOM/CSS operations before unprocessed
elements are rendered to the screen, which may prevent flickering or
other artifacts caused by delaying processing until after rendering.

The other major benefit to the above approach is that `next`
introduces an element of non-determinism, which can make things much
harder to test, due to its reliance on `setTimeout`; it's much harder
to guarantee the order of scheduled operations when they are scheduled
outside of the current run loop, i.e. with `next`.

@method next
@static
@for @ember/runloop
@param {Object} [target] target of method to invoke
@param {Function|String} method The method to invoke.
If you pass a string it will be resolved on the
target at the time the method is invoked.
@param {Object} [args*] Optional arguments to pass to the timeout.
@return {Object} Timer information for use in canceling, see `cancel`.
@public
*/
function next(...args) {
	return _backburner.later(...args, 1);
}
/**
Cancels a scheduled item. Must be a value returned by `later()`,
`once()`, `scheduleOnce()`, `next()`, `debounce()`, or
`throttle()`.

```javascript
import {
next,
cancel,
later,
scheduleOnce,
once,
throttle,
debounce
} from '@ember/runloop';

let runNext = next(myContext, function() {
// will not be executed
});

cancel(runNext);

let runLater = later(myContext, function() {
// will not be executed
}, 500);

cancel(runLater);

let runScheduleOnce = scheduleOnce('afterRender', myContext, function() {
// will not be executed
});

cancel(runScheduleOnce);

let runOnce = once(myContext, function() {
// will not be executed
});

cancel(runOnce);

let throttle = throttle(myContext, function() {
// will not be executed
}, 1, false);

cancel(throttle);

let debounce = debounce(myContext, function() {
// will not be executed
}, 1);

cancel(debounce);

let debounceImmediate = debounce(myContext, function() {
// will be executed since we passed in true (immediate)
}, 100, true);

// the 100ms delay until this method can be called again will be canceled
cancel(debounceImmediate);
```

@method cancel
@static
@for @ember/runloop
@param {Object} [timer] Timer object to cancel
@return {Boolean} true if canceled or false/undefined if it wasn't found
@public
*/
function cancel(timer) {
	return _backburner.cancel(timer);
}
/**
Delay calling the target method until the debounce period has elapsed
with no additional debounce calls. If `debounce` is called again before
the specified time has elapsed, the timer is reset and the entire period
must pass again before the target method is called.

This method should be used when an event may be called multiple times
but the action should only be called once when the event is done firing.
A common example is for scroll events where you only want updates to
happen once scrolling has ceased.

```javascript
import { debounce } from '@ember/runloop';

function whoRan() {
console.log(this.name + ' ran.');
}

let myContext = { name: 'debounce' };

debounce(myContext, whoRan, 150);

// less than 150ms passes
debounce(myContext, whoRan, 150);

// 150ms passes
// whoRan is invoked with context myContext
// console logs 'debounce ran.' one time.
```

Immediate allows you to run the function immediately, but debounce
other calls for this function until the wait time has elapsed. If
`debounce` is called again before the specified time has elapsed,
the timer is reset and the entire period must pass again before
the method can be called again.

```javascript
import { debounce } from '@ember/runloop';

function whoRan() {
console.log(this.name + ' ran.');
}

let myContext = { name: 'debounce' };

debounce(myContext, whoRan, 150, true);

// console logs 'debounce ran.' one time immediately.
// 100ms passes
debounce(myContext, whoRan, 150, true);

// 150ms passes and nothing else is logged to the console and
// the debouncee is no longer being watched
debounce(myContext, whoRan, 150, true);

// console logs 'debounce ran.' one time immediately.
// 150ms passes and nothing else is logged to the console and
// the debouncee is no longer being watched
```

@method debounce
@static
@for @ember/runloop
@param {Object} [target] target of method to invoke
@param {Function|String} method The method to invoke.
May be a function or a string. If you pass a string
then it will be looked up on the passed target.
@param {Object} [args*] Optional arguments to pass to the timeout.
@param {Number} wait Number of milliseconds to wait.
@param {Boolean} immediate Trigger the function on the leading instead
of the trailing edge of the wait interval. Defaults to false.
@return {Array} Timer information for use in canceling, see `cancel`.
@public
*/
function debounce(...args) {
	return _backburner.debounce(...args);
}
/**
Ensure that the target method is never called more frequently than
the specified spacing period. The target method is called immediately.

```javascript
import { throttle } from '@ember/runloop';

function whoRan() {
console.log(this.name + ' ran.');
}

let myContext = { name: 'throttle' };

throttle(myContext, whoRan, 150);
// whoRan is invoked with context myContext
// console logs 'throttle ran.'

// 50ms passes
throttle(myContext, whoRan, 150);

// 50ms passes
throttle(myContext, whoRan, 150);

// 150ms passes
throttle(myContext, whoRan, 150);
// whoRan is invoked with context myContext
// console logs 'throttle ran.'
```

@method throttle
@static
@for @ember/runloop
@param {Object} [target] target of method to invoke
@param {Function|String} method The method to invoke.
May be a function or a string. If you pass a string
then it will be looked up on the passed target.
@param {Object} [args*] Optional arguments to pass to the timeout.
@param {Number} spacing Number of milliseconds to space out requests.
@param {Boolean} immediate Trigger the function on the leading instead
of the trailing edge of the wait interval. Defaults to true.
@return {Array} Timer information for use in canceling, see `cancel`.
@public
*/
function throttle(...args) {
	return _backburner.throttle(...args);
}
//#endregion
export { setOnerror as C, getOnerror as S, runloop_exports as _, _queues as a, throttle as b, bind as c, end as d, join as f, run as g, once as h, _hasScheduledTimers as i, cancel as l, next as m, _cancelTimers as n, _rsvpErrorQueue as o, later as p, _getCurrentRunLoop as r, begin as s, _backburner as t, debounce as u, schedule as v, getDispatchOverride as x, scheduleOnce as y };
