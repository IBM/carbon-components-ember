import { helper as buildHelper } from '@ember/component/helper';
import { set, get } from '@ember/object';

export function setHelper<T, K extends keyof T>([obj, key, path]: [
  obj: T,
  key: K,
  path?: string
]): (val: any) => void {
  return function(val) {
    set(obj, key, path ? get(val, path) : val);
  };
}

export const helper = buildHelper(setHelper);
export default helper;


