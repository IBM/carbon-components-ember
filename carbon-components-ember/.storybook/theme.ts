// The Storybook UI theme, shared by the manager (sidebar, toolbar) and the
// docs pages. Like @carbon/react's Storybook, it follows the OS light/dark
// preference (what `create()` falls back to without a `base`) and uses IBM
// Plex.
import { create, getPreferredColorScheme } from 'storybook/theming';

export default create({
  base: getPreferredColorScheme(),
  fontBase: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
  fontCode:
    "'IBM Plex Mono', Menlo, 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace",

  // Storybook renders brandTitle as HTML: the logo next to the name.
  brandTitle: `<span style="display: inline-flex; align-items: center; gap: 0.375rem; white-space: nowrap; font-size: 0.875rem">
      <img src="images/ember-carbon-components.svg" alt="" width="24" height="24" />
      Carbon Components Ember
    </span>`,
  brandUrl: 'https://github.com/IBM/carbon-components-ember',
  brandTarget: '_blank',
});
