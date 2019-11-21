import { helper as buildHelper } from '@ember/component/helper';

export function set([obj, key, v]) {
  return function (val) {
    obj[key] = v || val;
  };
}

export const helper = buildHelper(set);
export default helper;
