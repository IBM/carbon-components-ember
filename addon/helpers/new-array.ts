import { helper as buildHelper } from '@ember/component/helper';

export function newArray([a]) {
  return new Array(a.length);
}

export const helper = buildHelper(newArray);
export default helper;
