import GlimmerComponent from '@glimmer/component';

import * as carbonCompoenntStyle from 'carbon-components-ember/styles.scss?inline';
import * as carbonStyle from '@carbon/styles/css/styles.min.css?inline';
import * as carbonChartsStyle from '@carbon/charts/styles.css?inline';

import style10 from '../styles/carbon-gray-10.scss?inline';
import style90 from '../styles/carbon-gray-90.scss?inline';
import style100 from '../styles/carbon-gray-100.scss?inline';
import { currentCarbonTheme } from './theme-switcher';




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
    <style>
        {{this.carbonTheme}}
    </style>
    <style>
        {{carbonStyle.default}}
        {{carbonChartsStyle.default}}
        {{carbonCompoenntStyle.default}}
    </style>
  </template>
}
