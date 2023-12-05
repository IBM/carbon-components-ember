import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import Select from 'carbon-components-ember/components/select';
import Tag from 'carbon-components-ember/components/tag';
import join from 'ember-composable-helpers/helpers/join';
import { fn } from '@ember/helper';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import type SelectController from './controller';


class RouteComponent extends RoutableComponent<SelectController> {
  <template>
    <h1>
      Carbon Select
    </h1>

    <DocsDemo as |demo|>
      <demo.example @name='select.hbs'>
        <Select
          @onSelect={{fn (mut @controller.selected)}}
          @selected={{@controller.selected}}
          @options={{@controller.options}}
          @multiple={{false}}
          as |item|
        >
          {{item}}
        </Select>
        <Tag @type='blue'>
          {{@controller.selected}}
        </Tag>

        <Select
          @selected={{@controller.selectedMultiple}}
          @options={{@controller.options}}
          @multiple={{true}}
          @onSelect={{fn (mut @controller.selectedMultiple)}}
        />
        <Tag @type='blue'>
          {{join @controller.selectedMultiple}}
        </Tag>
      </demo.example>
      <demo.snippet @name='select.hbs' />
      <demo.snippet @name='select.js' />
    </DocsDemo>
  </template>
}

export default RouteTemplate(RouteComponent);
