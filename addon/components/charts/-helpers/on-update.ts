import { helper as buildHelper } from '@ember/component/helper';

export function onUpdate([...args]) {
  const fn = args.slice(-1)[0];
  fn();
}

export const helper = buildHelper(onUpdate);
export default helper;
