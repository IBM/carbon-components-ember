import Input from 'carbon-components-ember/components/form-input';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import set from 'carbon-components-ember/helpers/set';
import Checkbox from 'carbon-components-ember/components/checkbox';
import { fn } from '@ember/helper';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import CheckboxController from './controller.ts';

class RouteComponent extends RoutableComponent<CheckboxController> {
  <template>
    <h1>
      Carbon Checkbox
    </h1>

    <Demo as |demo|>
      <demo.example @name='checkbox.hbs'>
        {{!import Checkbox from 'carbon-components-ember/components/checkbox'}}

        <Checkbox
          @disabled={{true}}
          @checked={{true}}
          @onChange={{fn (set @controller 'checked')}}
          @label='disabled'
        />
        <Checkbox
          @disabled={{true}}
          @checked={{false}}
          @onChange={{fn (set @controller 'checked')}}
          @label='disabled and not checked'
        />
        <Checkbox
          @checked={{@controller.checked}}
          @onChange={{fn (set @controller 'checked')}}
        >
          Label in block
        </Checkbox>
        <p>
          checked:
          {{@controller.checked}}
        </p>
      </demo.example>
      <demo.snippet @name='checkbox.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
