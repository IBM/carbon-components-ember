import { a0 as trackedMap, a1 as trackedWeakMap, a2 as esCompat } from './main-C2KSrfgt.js';

const mapConfig = {
  equals: () => false,
  description: 'TrackedMap from tracked-built-ins'
};
const weakMapConfig = {
  equals: () => false,
  description: 'TrackedWeakMap from tracked-built-ins'
};
let TrackedMap$1 = class TrackedMap {
  constructor(existing) {
    const reactive = trackedMap(existing, mapConfig);
    return new Proxy(reactive, {
      get(target, prop) {
        const value = Reflect.get(target, prop, target);
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },
      getPrototypeOf() {
        return TrackedMap.prototype;
      }
    });
  }
};
let TrackedWeakMap$1 = class TrackedWeakMap {
  constructor(values) {
    const reactive = trackedWeakMap(values, weakMapConfig);
    return new Proxy(reactive, {
      get(target, prop) {
        const value = Reflect.get(target, prop, target);
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },
      getPrototypeOf() {
        return TrackedWeakMap.prototype;
      }
    });
  }
};

// Ensure instanceof works correctly
Object.setPrototypeOf(TrackedMap$1.prototype, Map.prototype);
Object.setPrototypeOf(TrackedWeakMap$1.prototype, WeakMap.prototype);

const _importSync20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  TrackedMap: TrackedMap$1,
  TrackedWeakMap: TrackedWeakMap$1
}, Symbol.toStringTag, { value: 'Module' }));

let TrackedMap;
let TrackedWeakMap;

/**
 * https://rfcs.emberjs.com/id/1068-tracked-collections
 */
{
  const module = esCompat(_importSync20);
  TrackedMap = module.TrackedMap;
  TrackedWeakMap = module.TrackedWeakMap;
}

export { TrackedWeakMap as T, TrackedMap as a };
