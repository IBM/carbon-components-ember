import { helper as buildHelper } from '@ember/component/helper';
import { set, get } from '@ember/object';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple'

export function setHelper<T, K extends keyof T>([obj, key, path]: [obj: T, key: K, path?: string]): (val: any) => void {
  return function(val) {
    set(obj, key, path ? get(val, path) : val);
  };
}

export const helper = buildHelper(setHelper);
export default helper;


declare module '@glint/environment-ember-loose/registry' {
export default interface Registry {
    'carbon-components-ember/helpers/set': typeof helper;
    'set': typeof helper;
  }
}

new PowerSelectMultiple().args.renderInPlace
