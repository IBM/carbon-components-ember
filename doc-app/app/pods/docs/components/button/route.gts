import Checkbox from 'carbon-components-ember/components/checkbox';
import Button from 'carbon-components-ember/components/button';
import Input from 'carbon-components-ember/components/form-input';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import set from 'carbon-components-ember/helpers/set';
import not from 'ember-truth-helpers/helpers/not';
import eq from 'ember-truth-helpers/helpers/eq';
import { fn } from '@ember/helper';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';
import ButtonController from './controller';


interface RoutableComponent {
  Args: {
    controller: ButtonController
  }
}


class RouteComponent extends Component<RoutableComponent> {
  <template>
    <h1>
      Carbon Button
    </h1>

    <Demo as |demo|>
      {{!-- // BEGIN-SNIPPET button-simple3.hbs --}}
      <demo.example @name='button-simple.hbs'>
        {{!import Button from 'carbon-components-ember/components/button'}}

        <Button @type='primary' @onClick={{fn (set @controller 'clicked') true}}>
          Primary Button
        </Button>
        <Button
          @type='primary'
          @ghost={{true}}
          @onClick={{fn (set @controller 'clicked') true}}
        >
          Ghost Button
        </Button>
        <Button
          @type='primary'
          @tertiary={{true}}
          @onClick={{fn (set @controller 'clicked') true}}
        >
          Tertiary Button
        </Button>
        <Button
          @type='secondary'
          @size='sm'
          @onClick={{fn (set @controller 'clicked') true}}
        >
          Secondary Small Button
        </Button>
        <Button @type='primary' @size='xl' @onClick={{@controller.doSomething}}>
          Button with loading indicator if onClick returns a promise
        </Button>
      </demo.example>
      <demo.snippet @name='button-simple3.hbs' />
      <demo.snippet @name='button.js' />
    </Demo>
    {{!-- // END-SNIPPET --}}

    <Demo as |demo|>
      <Checkbox
        @checked={{eq @controller.type 'primary'}}
        @onChange={{fn (set @controller 'type') 'primary'}}
      >
        Primary
      </Checkbox>
      <Checkbox
        @checked={{eq @controller.type 'secondary'}}
        @onChange={{fn (set @controller 'type') 'secondary'}}
      >
        Secondary
      </Checkbox>
      <Checkbox
        @checked={{eq @controller.type 'danger'}}
        @onChange={{fn (set @controller 'type') 'danger'}}
      >
        Is Danger
      </Checkbox>
      <Checkbox
        @checked={{@controller.isSmall}}
        @onChange={{fn (set @controller 'isSmall') (not @controller.isSmall)}}
      >
        Is Small
      </Checkbox>
      <Checkbox
        @checked={{@controller.isTertiary}}
        @onChange={{fn (set @controller 'isTertiary') (not @controller.isTertiary)}}
      >
        Is Tertiary
      </Checkbox>
      <Checkbox
        @checked={{@controller.isDisabled}}
        @onChange={{fn (set @controller 'isDisabled') (not @controller.isDisabled)}}
      >
        Is Disabled
      </Checkbox>
      <label for='confirm-text'>
        Confirm Text
      </label>
      <Input
        id='confirm-text'
        {{! template-lint-disable }}
        @onChange={{fn (set @controller 'confirmText')}}
        @value={{@controller.confirmText}}
      />

      <demo.example @name='button-all.hbs'>
        <Button
          @disabled={{@controller.isDisabled}}
          @type={{@controller.type}}
          @tertiary={{@controller.isTertiary}}
          @size='sm'
          @onClick={{fn (set @controller 'clicked') true}}
          @bubbles={{@controller.bubbles}}
          @confirmText={{@controller.confirmText}}
        >
          Button Text
        </Button>
      </demo.example>
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
