import { helper as buildHelper } from '@ember/component/helper';

export function call([fn]) {
  fn && fn();
}

export const helper = buildHelper(call);
export default helper;
