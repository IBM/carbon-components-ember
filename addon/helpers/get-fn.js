import { helper as buildHelper } from '@ember/component/helper';

export function getFn([obj, prop]) {
  const fn = obj[prop];
  return fn && fn.bind(obj);
}

export const helper = buildHelper(getFn);
export default helper;
