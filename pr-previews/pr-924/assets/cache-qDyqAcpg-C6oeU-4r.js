//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/cache-qDyqAcpg.js
var Cache = class {
	size = 0;
	misses = 0;
	hits = 0;
	constructor(limit, func, store = /* @__PURE__ */ new Map()) {
		this.limit = limit;
		this.func = func;
		this.store = store;
	}
	get(key) {
		if (this.store.has(key)) {
			this.hits++;
			return this.store.get(key);
		} else {
			this.misses++;
			return this.set(key, this.func(key));
		}
	}
	set(key, value) {
		if (this.limit > this.size) {
			this.size++;
			this.store.set(key, value);
		}
		return value;
	}
	purge() {
		this.store.clear();
		this.size = 0;
		this.hits = 0;
		this.misses = 0;
	}
};
//#endregion
export { Cache as t };
