import { helper as buildHelper } from '@ember/component/helper';

export function onUpdate([fn, ...args]: [
  fn: (...args: any) => any,
  ...args: any[],
]) {
  fn(...args);
}

export const helper = buildHelper(onUpdate);
export default helper;
