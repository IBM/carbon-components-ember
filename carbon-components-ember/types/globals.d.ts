declare module '*.scss';

declare global {
  // Prevents ESLint from "fixing" this via its auto-fix to turn it into a type
  // alias (e.g. after running any Ember CLI generator)
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  import { MutableArray } from '@ember/array';
  interface Array<T> extends MutableArray<T> {}
  // interface Function extends Ember.FunctionPrototypeExtensions {}
}
