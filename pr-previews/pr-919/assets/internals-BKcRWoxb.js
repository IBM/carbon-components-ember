import { X as peekMeta, Y as guidFor } from './main-B8rrDxlx.js';

function getCachedValueFor(obj, key) {
  let meta = peekMeta(obj);
  if (meta) {
    return meta.valueFor(key);
  } else {
    return undefined;
  }
}

const internals = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  cacheFor: getCachedValueFor,
  guidFor
}, Symbol.toStringTag, { value: 'Module' }));

export { getCachedValueFor as g, internals as i };
