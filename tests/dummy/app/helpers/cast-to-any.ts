import { helper as buildHelper } from '@ember/component/helper';

export function castToAny([arg]: [v: any]): any {
  return arg as any;
}

export const helper = buildHelper(castToAny);
export default helper;
