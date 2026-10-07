import type Icon from '../../icon.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderGlobalActionSignature {
  Element: HTMLButtonElement;
  Args: {
    'aria-label': string;
    icon: typeof Icon;
    onClick: () => void;
  };
}

const UIShellHeaderGlobalAction: TOC<UIShellHeaderGlobalActionSignature> =
  <template>
    <button
      aria-label={{@aria-label}}
      title={{@aria-label}}
      class="cds--header__action cds--btn cds--btn--icon-only"
      type="button"
      {{on "click" @onClick}}
      ...attributes
    >
      <@icon @size={{20}} />
    </button>
  </template>;

export default UIShellHeaderGlobalAction;
