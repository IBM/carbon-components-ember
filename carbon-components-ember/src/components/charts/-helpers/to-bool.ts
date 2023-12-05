import { helper as buildHelper } from '@ember/component/helper';

export function tobool([string]: [string | boolean | undefined]): boolean {
  switch (string && string.toString().toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return string as any;
  }
}

export const helper = buildHelper(tobool);
export default helper;
