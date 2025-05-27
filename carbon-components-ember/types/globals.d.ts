declare module '*.scss';

declare global {
  // Prevents ESLint from "fixing" this via its auto-fix to turn it into a type
  // alias (e.g. after running any Ember CLI generator)
  import { MutableArray } from '@ember/array';

  type Array<T> = MutableArray<T>
  // interface Function extends Ember.FunctionPrototypeExtensions {}
}
