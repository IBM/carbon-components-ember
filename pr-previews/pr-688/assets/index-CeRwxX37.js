import { T as TrackedWeakMap, a as TrackedMap } from './map-BaH_SFtH.js';
import { t as tracked$1, T as TrackedArray, a as TrackedWeakSet, b as TrackedSet, c as TrackedObject } from './main-ChsN7yJb.js';

function tracked(obj, key, desc) {
  if (key !== undefined && desc !== undefined) {
    return tracked$1(obj, key, desc);
  }
  if (Array.isArray(obj)) {
    return new TrackedArray(obj);
  }
  switch (obj) {
    case Object:
      return new TrackedObject();
    case Array:
      return new TrackedArray();
    case Map:
      return new TrackedMap();
    case WeakMap:
      return new TrackedWeakMap();
    case Set:
      return new TrackedSet();
    case WeakSet:
      return new TrackedWeakSet();
  }
  if (obj instanceof Map) {
    return new TrackedMap(obj);
  } else if (obj instanceof WeakMap) {
    return new TrackedWeakMap();
  } else if (obj instanceof Set) {
    return new TrackedSet(obj);
  } else if (obj instanceof WeakSet) {
    return new TrackedWeakSet();
  } else {
    return new TrackedObject(obj);
  }
}

export { TrackedArray, TrackedMap, TrackedObject, TrackedSet, TrackedWeakMap, TrackedWeakSet, tracked };
