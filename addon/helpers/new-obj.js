import { helper as buildHelper } from '@ember/component/helper';

export function newObj() {
  return {};
}

export const helper = buildHelper(newObj);
export default helper;
