import { helper as buildHelper } from '@ember/component/helper';

export function orHelper([...args]) {
  return args.find(a => !!a);
}

export const helper = buildHelper(orHelper);
export default helper;
