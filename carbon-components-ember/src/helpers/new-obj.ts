/**
 * Copies the named arguments into a new object on every recompute. Unlike
 * the built-in `hash`, whose keys are read lazily, this reads every value
 * eagerly, so a helper that receives the object re-runs when any of them
 * changes.
 */
export default function newObj<T extends object>(named: T): T {
  return { ...named };
}
