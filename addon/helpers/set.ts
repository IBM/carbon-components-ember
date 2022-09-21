import { helper as buildHelper } from '@ember/component/helper';
import { set, get } from '@ember/object';

export function setHelper([obj, key, path]): (val: any) => void {
  return function (val) {
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
