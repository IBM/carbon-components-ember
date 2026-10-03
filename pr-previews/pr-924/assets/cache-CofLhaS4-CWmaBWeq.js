import { a as scheduleRevalidate } from "./global-context-D1MXNkcp.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/cache-CofLhaS4.js
function unwrap(val) {
	if (val === null || val === void 0) throw new Error(`Expected value to be present`);
	return val;
}
var CONSTANT = 0;
var INITIAL = 1;
var VOLATILE = NaN;
var $REVISION = 1;
function bump() {
	$REVISION++;
}
var DIRYTABLE_TAG_ID = 0;
var UPDATABLE_TAG_ID = 1;
var COMBINATOR_TAG_ID = 2;
var CONSTANT_TAG_ID = 3;
var COMPUTE = Symbol("TAG_COMPUTE");
/**
* `value` receives a tag and returns an opaque Revision based on that tag. This
* snapshot can then later be passed to `validate` with the same tag to
* determine if the tag has changed at all since the time that `value` was
* called.
*
* @param tag
*/
function valueForTag(tag) {
	return tag[COMPUTE]();
}
/**
* `validate` receives a tag and a snapshot from a previous call to `value` with
* the same tag, and determines if the tag is still valid compared to the
* snapshot. If the tag's state has changed at all since then, `validate` will
* return false, otherwise it will return true. This is used to determine if a
* calculation related to the tags should be rerun.
*
* @param tag
* @param snapshot
*/
function validateTag(tag, snapshot) {
	return snapshot >= tag[COMPUTE]();
}
var TYPE = Symbol("TAG_TYPE");
var ALLOW_CYCLES;
var MonomorphicTagImpl = class MonomorphicTagImpl {
	static combine(tags) {
		switch (tags.length) {
			case 0: return CONSTANT_TAG;
			case 1: return tags[0];
			default: {
				let tag = new MonomorphicTagImpl(COMBINATOR_TAG_ID);
				tag.subtag = tags;
				return tag;
			}
		}
	}
	revision = 1;
	lastChecked = 1;
	lastValue = 1;
	isUpdating = false;
	subtag = null;
	subtagBufferCache = null;
	constructor(type) {
		this[TYPE] = type;
	}
	[COMPUTE]() {
		let { lastChecked } = this;
		if (this.isUpdating) this.lastChecked = ++$REVISION;
		else if (lastChecked !== $REVISION) {
			this.isUpdating = true;
			this.lastChecked = $REVISION;
			try {
				let { subtag, revision } = this;
				if (subtag !== null) {
					if (Array.isArray(subtag)) for (const tag of subtag) {
						let value = tag[COMPUTE]();
						revision = Math.max(value, revision);
					}
					else {
						let subtagValue = subtag[COMPUTE]();
						if (subtagValue === this.subtagBufferCache) revision = Math.max(revision, this.lastValue);
						else {
							this.subtagBufferCache = null;
							revision = Math.max(revision, subtagValue);
						}
					}
				}
				this.lastValue = revision;
			} finally {
				this.isUpdating = false;
			}
		}
		return this.lastValue;
	}
	static updateTag(_tag, _subtag) {
		let tag = _tag;
		let subtag = _subtag;
		if (subtag === CONSTANT_TAG) tag.subtag = null;
		else {
			tag.subtagBufferCache = subtag[COMPUTE]();
			tag.subtag = subtag;
		}
	}
	static dirtyTag(tag, disableConsumptionAssertion) {
		tag.revision = ++$REVISION;
		scheduleRevalidate();
	}
};
var DIRTY_TAG = MonomorphicTagImpl.dirtyTag;
var UPDATE_TAG = MonomorphicTagImpl.updateTag;
function createTag() {
	return new MonomorphicTagImpl(DIRYTABLE_TAG_ID);
}
function createUpdatableTag() {
	return new MonomorphicTagImpl(UPDATABLE_TAG_ID);
}
var CONSTANT_TAG = new MonomorphicTagImpl(CONSTANT_TAG_ID);
function isConstTag(tag) {
	return tag === CONSTANT_TAG;
}
var VOLATILE_TAG_ID = 100;
var VolatileTag = class {
	[TYPE] = VOLATILE_TAG_ID;
	[COMPUTE]() {
		return VOLATILE;
	}
};
var VOLATILE_TAG = new VolatileTag();
var CURRENT_TAG_ID = 101;
var CurrentTag = class {
	[TYPE] = CURRENT_TAG_ID;
	[COMPUTE]() {
		return $REVISION;
	}
};
var CURRENT_TAG = new CurrentTag();
var combine = MonomorphicTagImpl.combine;
var tag1 = createUpdatableTag();
var tag2 = createUpdatableTag();
var tag3 = createUpdatableTag();
valueForTag(tag1);
DIRTY_TAG(tag1);
valueForTag(tag1);
UPDATE_TAG(tag1, combine([tag2, tag3]));
valueForTag(tag1);
DIRTY_TAG(tag2);
valueForTag(tag1);
DIRTY_TAG(tag3);
valueForTag(tag1);
UPDATE_TAG(tag1, tag3);
valueForTag(tag1);
DIRTY_TAG(tag3);
valueForTag(tag1);
/**
* An object that that tracks @tracked properties that were consumed.
*/
var Tracker = class {
	tags = /* @__PURE__ */ new Set();
	last = null;
	add(tag) {
		if (tag === CONSTANT_TAG) return;
		this.tags.add(tag);
		this.last = tag;
	}
	combine() {
		let { tags } = this;
		if (tags.size === 0) return CONSTANT_TAG;
		else if (tags.size === 1) return this.last;
		else return combine(Array.from(this.tags));
	}
};
/**
* Whenever a tracked computed property is entered, the current tracker is
* saved off and a new tracker is replaced.
*
* Any tracked properties consumed are added to the current tracker.
*
* When a tracked computed property is exited, the tracker's tags are
* combined and added to the parent tracker.
*
* The consequence is that each tracked computed property has a tag
* that corresponds to the tracked properties consumed inside of
* itself, including child tracked computed properties.
*/
var CURRENT_TRACKER = null;
var OPEN_TRACK_FRAMES = [];
function beginTrackFrame(debuggingContext) {
	OPEN_TRACK_FRAMES.push(CURRENT_TRACKER);
	CURRENT_TRACKER = new Tracker();
}
function endTrackFrame() {
	let current = CURRENT_TRACKER;
	CURRENT_TRACKER = OPEN_TRACK_FRAMES.pop() || null;
	return unwrap(current).combine();
}
function beginUntrackFrame() {
	OPEN_TRACK_FRAMES.push(CURRENT_TRACKER);
	CURRENT_TRACKER = null;
}
function endUntrackFrame() {
	CURRENT_TRACKER = OPEN_TRACK_FRAMES.pop() || null;
}
function resetTracking() {
	while (OPEN_TRACK_FRAMES.length > 0) OPEN_TRACK_FRAMES.pop();
	CURRENT_TRACKER = null;
}
function isTracking() {
	return CURRENT_TRACKER !== null;
}
function consumeTag(tag) {
	if (CURRENT_TRACKER !== null) CURRENT_TRACKER.add(tag);
}
var FN = Symbol("FN");
var LAST_VALUE = Symbol("LAST_VALUE");
var TAG = Symbol("TAG");
var SNAPSHOT = Symbol("SNAPSHOT");
function createCache(fn, debuggingLabel) {
	return {
		[FN]: fn,
		[LAST_VALUE]: void 0,
		[TAG]: void 0,
		[SNAPSHOT]: -1
	};
}
function getValue(cache) {
	let fn = cache[FN];
	let tag = cache[TAG];
	let snapshot = cache[SNAPSHOT];
	if (tag === void 0 || !validateTag(tag, snapshot)) {
		beginTrackFrame();
		try {
			cache[LAST_VALUE] = fn();
		} finally {
			tag = endTrackFrame();
			cache[TAG] = tag;
			cache[SNAPSHOT] = valueForTag(tag);
			consumeTag(tag);
		}
	} else consumeTag(tag);
	return cache[LAST_VALUE];
}
function isConst(cache) {
	let tag = cache[TAG];
	return isConstTag(tag);
}
function track(block, debugLabel) {
	beginTrackFrame();
	let tag;
	try {
		block();
	} finally {
		tag = endTrackFrame();
	}
	return tag;
}
function untrack(callback) {
	beginUntrackFrame();
	try {
		return callback();
	} finally {
		endUntrackFrame();
	}
}
//#endregion
export { validateTag as A, getValue as C, resetTracking as D, isTracking as E, track as O, endUntrackFrame as S, isConstTag as T, consumeTag as _, CURRENT_TAG as a, createUpdatableTag as b, INITIAL as c, VOLATILE_TAG as d, VolatileTag as f, combine as g, bump as h, CONSTANT_TAG as i, valueForTag as j, untrack as k, UPDATE_TAG as l, beginUntrackFrame as m, COMPUTE as n, CurrentTag as o, beginTrackFrame as p, CONSTANT as r, DIRTY_TAG as s, ALLOW_CYCLES as t, VOLATILE as u, createCache as v, isConst as w, endTrackFrame as x, createTag as y };
