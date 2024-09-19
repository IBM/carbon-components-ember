import Tag, { TagInterface } from 'carbon-components-ember/components/tag';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import castToAny from '/app/helpers/cast-to-any';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';
import { array } from '@ember/helper';

class RouteComponent extends Component {
  types = [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
  ] as TagInterface['Args']['type'][];

  <template>
    <h1>
      Carbon Tag
    </h1>

    <Demo as |demo|>
      <demo.example @name='tag.hbs'>
        {{!import Tag from 'carbon-components-ember/components/tag'}}

        {{#each this.types as |type|}}
          <Tag @type={{type}}>
            {{type}}
          </Tag>
          <Tag @type={{castToAny type}}>
            {{type}}
          </Tag>
        {{/each}}
      </demo.example>
      <demo.snippet @name='tag.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
