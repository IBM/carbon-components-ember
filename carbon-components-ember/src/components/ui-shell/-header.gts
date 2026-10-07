import { Close, Menu } from '../../icons.ts';
import UIShellHeaderGlobalAction from './-header/-global-action.gts';
import UIShellHeaderPanel from './-header/-panel.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderSignature {
  Args: {
    title: string;
    subtitle: string;
    open?: boolean;
    onToggle?: (value: boolean) => void;
  };
  Blocks: {
    header: [];
    headerGlobal: [typeof UIShellHeaderGlobalAction];
    headerPanel: [typeof UIShellHeaderPanel];
  };
}

const UIShellHeader: TOC<UIShellHeaderSignature> = <template>
  <header aria-label="IBM Platform Name" class="cds--header">
    <a class="cds--skip-to-content" href="#main-content" tabindex="0">
      Skip to main content
    </a>
    {{#if @onToggle}}
      <button
        aria-label="Open menu"
        class="cds--header__action cds--header__menu-trigger cds--header__menu-toggle
          {{if @open '' 'cds--header__menu-toggle'}}"
        title="Open menu"
        type="button"
        {{on "click" (fn @onToggle (not @open))}}
      >
        {{#if @open}}
          <Close @size={{20}} />
        {{else}}
          <Menu @size={{20}} />
        {{/if}}
      </button>
    {{/if}}
    <a class="cds--header__name" href="#">
      <span class="cds--header__name--prefix">
        {{@title}}
        <small>
          {{@subtitle}}
        </small>
      </span>
    </a>
    {{yield to="header"}}
    <div class="cds--header__global">
      {{yield UIShellHeaderGlobalAction to="headerGlobal"}}
    </div>
    {{yield UIShellHeaderPanel to="headerPanel"}}
  </header>
</template>;

export default UIShellHeader;
