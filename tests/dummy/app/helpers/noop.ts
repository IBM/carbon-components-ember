import { helper as buildHelper } from '@ember/component/helper';

export function noop() {
  return () => {};
}

export const helper = buildHelper(noop);
export default helper;
