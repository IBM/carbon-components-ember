import { helper as buildHelper } from '@ember/component/helper';

export function onUpdate([fn, ...args]: [fn: () => void, ...args: any[]]) {
  fn();
}

export const helper = buildHelper(onUpdate);
export default helper;
