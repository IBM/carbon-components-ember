import { helper as buildHelper } from '@ember/component/helper';
import { set } from '@ember/object';

export function setHelper([obj, key, v]) {
  return function (val) {
    set(obj, key, v || val);
  };
}

export const helper = buildHelper(setHelper);
export default helper;
