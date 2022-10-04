import { helper as buildHelper } from '@ember/component/helper';

export function run(...args) {
  return;
}

export const helper = buildHelper(run);
export default helper;
