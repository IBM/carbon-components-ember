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

function targetShadowHost(style: string) {
  return style?.replace?.(/:root /g, ':host ');
}

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
    <style type="text/css">
        {{targetShadowHost carbonStyle.default}}
        {{targetShadowHost this.carbonTheme}}
        {{targetShadowHost carbonChartsStyle.default}}
        {{targetShadowHost carbonCompoenntStyle.default}}
        {{targetShadowHost iconStyle.default}}
        {{targetShadowHost buttonStyle.default}}
        {{targetShadowHost paginationStyle.default}}
        {{targetShadowHost uiShellStyle.default}}
        {{targetShadowHost listStyle.default}}
    </style>
  </template>
}
