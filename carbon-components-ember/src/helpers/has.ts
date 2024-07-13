import { helper as buildHelper } from '@ember/component/helper';

export function has<T>([set, item]: [Set<T>, T]) {
  return set?.has(item);
}

export const helper = buildHelper(has);
export default helper;
