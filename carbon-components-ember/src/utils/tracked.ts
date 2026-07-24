import { tracked } from '@glimmer/tracking';


export class TrackedPromise {
  @tracked value: any;
  promise?: Promise<any>;
  load: () => Promise<any>;
  getValue() {
    if (!this.promise) {
      this.promise = this.load();
      this.promise.then(
        (v) => {
          this.value = v;
        },
        (error) => {
          // A rejected `load()` (e.g. a transient dynamic-import/chunk-load
          // failure) previously left `value` stuck at `undefined` forever,
          // since `promise` was already set and `getValue()` would never
          // call `load()` again. Clearing it here lets the next `getValue()`
          // call (triggered by any later re-render) retry instead of
          // silently and permanently hiding whatever depended on this value
          // (e.g. an icon that never appears).
          this.promise = undefined;
          console.error('TrackedPromise: load() rejected', error);
        },
      );
    }
    return this.value;
  }

  constructor(load: () => Promise<any>) {
    this.load = load;
  }
}
