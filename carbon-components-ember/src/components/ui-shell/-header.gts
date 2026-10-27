import Close from '../icons/close.ts';
import Menu from '../icons/menu.ts';
import UIShellHeaderGlobalAction from './-header/-global-action.gts';
import UIShellHeaderPanel from './-header/-panel.gts';
import RouterLink from '../-private/router-link.gts';
import type { RouteArgs } from '../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellHeaderSignature {
  Element: HTMLElement;
  Args: RouteArgs & {
    title: string;
    subtitle: string;
    /**
     * The URL the name links to, as Carbon React's HeaderName `href`.
     * `@route` links it to one of the app's routes.
     */
    href?: string;
    open?: boolean;
    onToggle?: (value: boolean) => void;
  };
  Blocks: {
    header: [];
    headerGlobal: [UIShellHeaderGlobalAction: typeof UIShellHeaderGlobalAction];
    headerPanel: [UIShellHeaderPanel: typeof UIShellHeaderPanel];
  };
}

const UIShellHeader: TOC<UIShellHeaderSignature> = <template>
  <header aria-label="IBM Platform Name" class="cds--header" ...attributes>
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
    <RouterLink
      @href={{@href}}
      @route={{@route}}
      @models={{@models}}
      @query={{@query}}
      @activeClass=""
      class="cds--header__name"
    >
      <span class="cds--header__name--prefix">
        {{@title}}
        <small>
          {{@subtitle}}
        </small>
      </span>
    </RouterLink>
    {{yield to="header"}}
    <div class="cds--header__global">
      {{yield UIShellHeaderGlobalAction to="headerGlobal"}}
    </div>
    {{yield UIShellHeaderPanel to="headerPanel"}}
  </header>
</template>;

export default UIShellHeader;
