import GlimmerComponent from '@glimmer/component';
import { fn } from '@ember/helper';

import { Select } from 'carbon-components-ember/components/index';
import * as carbonCompoenntStyle from 'carbon-components-ember/styles.scss?inline';
import { colorScheme } from 'ember-primitives/color-scheme';
import  { cell } from 'ember-resources';
import style10 from '../styles/carbon-gray-10.scss?inline';
import style90 from '../styles/carbon-gray-90.scss?inline';
import style100 from '../styles/carbon-gray-100.scss?inline';


export const currentCarbonTheme = cell(colorScheme.current === 'dark' ? 'g90' : 'white');

export function initCarbonThemeSync() {
  currentCarbonTheme.current = colorScheme.current === 'dark' ? 'g90' : 'white';
  colorScheme.on.update((colorScheme) => {
    currentCarbonTheme.set(colorScheme === 'dark' ? 'g90' : 'white');
  });
}

export default class ThemeSwitcher extends GlimmerComponent {

  themes = ['white', 'g10', 'g90', 'g100'];

  get currentTheme() {
    return currentCarbonTheme.current;
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

  setTheme = (theme: string) => {
    currentCarbonTheme.set(theme);
  }

  <template>
    <label style="float: right">
      Carbon Theme:
      <Select style="width: 200px" @selected={{currentCarbonTheme.current}} @options={{this.themes}} @multiple={{false}} @onSelect={{fn this.setTheme}} as |option|>
        {{option}}
      </Select>
    </label>
    <style>
      {{carbonCompoenntStyle.default}}
    </style>
    <div class="not-prose" id="ember-basic-dropdown-wormhole"></div>
  </template>
}
