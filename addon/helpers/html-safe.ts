import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function htmlSafeHelper([str]: [str: string]) {
  return htmlSafe(str);
}

export default helper(htmlSafeHelper);
