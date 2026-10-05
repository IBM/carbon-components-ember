import './site-tools.ts';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    // Storybook renders brandTitle as HTML: the logo next to the name.
    brandTitle: `<span style="display: inline-flex; align-items: center; gap: 0.375rem; white-space: nowrap; font-size: 0.875rem">
      <img src="images/ember-carbon-components.svg" alt="" width="24" height="24" />
      Carbon Components Ember
    </span>`,
    brandUrl: 'https://github.com/IBM/carbon-components-ember',
    brandTarget: '_blank',
  }),
});
