import { helper as buildHelper } from '@ember/component/helper';

export function assign([obj], params) {
  Object.assign(obj, params);
}

export const helper = buildHelper(assign);
export default helper;
