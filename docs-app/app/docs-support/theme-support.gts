import GlimmerComponent from '@glimmer/component';
import * as all from 'carbon-components-ember/components/index';
import * as carbonCompoenntStyle from 'carbon-components-ember/styles.scss?inline';
import * as iconStyle from 'carbon-components-ember/components/icon_CarbonIcon.module.scss?inline';
import * as buttonStyle from 'carbon-components-ember/components/button_CarbonButton.module.scss?inline';
import * as listStyle from 'carbon-components-ember/components/list_ListComponent.module.scss?inline';
import * as paginationStyle from 'carbon-components-ember/components/pagination_CarbonPagination.module.scss?inline';
import * as uiShellStyle from 'carbon-components-ember/components/ui-shell/-sidenavSidenav.module.scss?inline';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonChartsStyle from '@carbon/charts/styles.css?inline';

import style10 from '../styles/carbon-gray-10.scss?inline';
import style90 from '../styles/carbon-gray-90.scss?inline';
import style100 from '../styles/carbon-gray-100.scss?inline';
import { currentCarbonTheme } from './theme-switcher';

console.log(all);

export default class ThemeSwitcher extends GlimmerComponent {

  get currentTheme() {
    return currentCarbonTheme.current as unknown as string;
  }

  get carbonTheme() {
    switch (this.currentTheme) {
      case 'g10':
        return style10 as unknown as string;
      case 'g90':
        return style90 as unknown as string;
      case 'g100':
        return style100 as unknown as string;
    }

    return '';
  }

  <template>
    {{! Older ember-repl versions wrapped every live demo in a `<Shadowed>`
      shadow-DOM host, and this component's styles targeted that host via a
      `:root` -> `:host` rewrite. ember-repl 8.x dropped that automatic
      wrapping, so demos rendered in the light DOM -- `:host` never matched
      anything, and these Carbon theme tokens silently never applied, leaving
      demo text and backgrounds unstyled (most visible as unreadable text
      once the page's own dark-mode styles started applying, see the
      accordion/checkbox reports). `rehype-shadow-demo.ts` +
      `shadow-demo-element.ts` have since restored shadow-DOM wrapping (the
      `no-shadow` markdown flag opts a fence out again), but this component's
      styles stay as plain `:root` rules rather than switching back to
      `:host`: CSS custom properties inherit through the shadow boundary, so
      `:root`-defined tokens are visible to shadow-wrapped demos too, while
      staying simpler than duplicating the block for both wrapped and
      `no-shadow` (light-DOM) demos. This is safe globally since nothing
      outside `.cds--*` demo markup reads these custom properties. }}
    <style type="text/css">
        {{carbonStyle.default}}
        {{this.carbonTheme}}
        {{carbonChartsStyle.default}}
        {{carbonCompoenntStyle.default}}
        {{iconStyle.default}}
        {{buttonStyle.default}}
        {{paginationStyle.default}}
        {{uiShellStyle.default}}
        {{listStyle.default}}
    </style>
  </template>
}
