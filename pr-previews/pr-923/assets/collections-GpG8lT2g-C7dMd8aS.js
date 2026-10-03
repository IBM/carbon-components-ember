//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/collections-GpG8lT2g.js
function unwrap(val) {
	return val;
}
function expect(val, message) {
	return val;
}
function exhausted(value) {}
function isPresentArray(list) {
	return list ? list.length > 0 : false;
}
function asPresentArray(list, message = `unexpected empty list`) {
	return list;
}
function getLast(list) {
	return list.length === 0 ? void 0 : list[list.length - 1];
}
function getFirst(list) {
	return list.length === 0 ? void 0 : list[0];
}
function mapPresentArray(list, mapper) {
	if (list === null) return null;
	let out = [];
	for (let item of list) out.push(mapper(item));
	return out;
}
function dict() {
	return Object.create(null);
}
function isDict(u) {
	return u !== null && u !== void 0;
}
function isIndexable(u) {
	return typeof u === "function" || typeof u === "object" && u !== null;
}
var StackImpl = class {
	stack;
	current = null;
	constructor(values = []) {
		this.stack = values;
	}
	get size() {
		return this.stack.length;
	}
	push(item) {
		this.current = item;
		this.stack.push(item);
	}
	pop() {
		let item = this.stack.pop();
		this.current = getLast(this.stack) ?? null;
		return item === void 0 ? null : item;
	}
	nth(from) {
		let len = this.stack.length;
		return len < from ? null : unwrap(this.stack[len - from]);
	}
	isEmpty() {
		return this.stack.length === 0;
	}
	snapshot() {
		return [...this.stack];
	}
	toArray() {
		return this.stack;
	}
};
//#endregion
export { expect as a, isDict as c, mapPresentArray as d, unwrap as f, exhausted as i, isIndexable as l, asPresentArray as n, getFirst as o, dict as r, getLast as s, StackImpl as t, isPresentArray as u };
