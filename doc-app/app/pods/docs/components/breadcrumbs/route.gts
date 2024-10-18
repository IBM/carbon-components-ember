import Demo from 'ember-cli-addon-docs/components/docs-demo';
import { array } from '@ember/helper';
import RouteTemplate from 'ember-routable-component';
import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs';
export default RouteTemplate(
  <template>
    <h1>
      Carbon Breadcrumbs
    </h1>

    <Demo as |demo|>
      <demo.example @name='breadcrumbs-simple.hbs'>
        {{!import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs'}}

        <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current='b' />
      </demo.example>
      <demo.snippet @name='breadcrumbs-simple.hbs' />
    </Demo>
  </template>,
);
