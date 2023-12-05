import { helper as buildHelper } from '@ember/component/helper';

export function _default([something, otherwise]: [any, any]) {
  return something !== undefined ? something : otherwise;
}

export const helper = buildHelper(_default);
export default helper;
