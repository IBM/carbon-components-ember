import { helper as buildHelper } from '@ember/component/helper';

type Obj = { [k: string | symbol]: any };

export function getFn<T extends Obj, X extends keyof T>([obj, prop]: [
  obj: T,
  prop: X,
]): T[X] {
  const fn = obj[prop];
  return fn && fn.bind(obj);
}

export const helper = buildHelper(getFn);
export default helper;
