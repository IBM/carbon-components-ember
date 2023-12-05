import { helper as buildHelper } from '@ember/component/helper';

export function newObj(arr: never[], named: any = {}): any {
  return Object.assign({}, named);
}

export const helper = buildHelper(newObj);
export default helper;
