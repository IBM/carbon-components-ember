import pageTitle from 'ember-page-title/helpers/page-title';
import Route from 'ember-route-template';
import ThemeSupport from '../docs-support/theme-support.gts';
import { Shell } from '@universal-ember/docs-support';

export default Route(
  <template>
    <ThemeSupport />
    <Shell>
      {{pageTitle "carbon-components-ember"}}

      {{outlet}}
    </Shell>
  </template>
);
