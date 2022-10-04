import { helper as buildHelper } from '@ember/component/helper';

export function newArray() {
  const arr = new Array();
  const obj = {} as unknown as Array<any>;
  Object.getOwnPropertyNames(Array.prototype).forEach((prop) => {
    const val = arr[prop];
    if (typeof val === 'function') {
      obj[prop] = val.bind(arr)
    }
  });
  return obj;
}

export const helper = buildHelper(newArray);
export default helper;
