import { helper as buildHelper } from '@ember/component/helper';

export function tobool([string]) {
  switch (string && string.toString().toLowerCase().trim()) {
    case 'true': case 'yes': case '1': return true;
    case 'false': case 'no': case '0': case null: return false;
    default: return string;
}
}

export const helper = buildHelper(tobool);
export default helper;
