import { helper as buildHelper } from '@ember/component/helper';

export function has([set, item]) {
  return set.has(item);
}

export const helper = buildHelper(has);
export default helper;
