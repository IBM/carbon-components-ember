import { helper as buildHelper } from '@ember/component/helper';

export function bind([fromObj, toObj, fromProp, toProp]) {
  Object.defineProperty(toObj, toProp, {
    get() {
      return fromObj[fromProp];
    }
  })
}

export const helper = buildHelper(bind);
export default helper;
