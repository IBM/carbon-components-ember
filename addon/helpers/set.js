import { helper as buildHelper } from '@ember/component/helper';
import { set, get } from '@ember/object';

export function setHelper([obj, key, path]) {
  return function (val) {
    set(obj, key, path ? get(val, path) : val);
  };
}

export const helper = buildHelper(setHelper);
export default helper;
