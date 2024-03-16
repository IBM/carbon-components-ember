import Tag from 'carbon-components-ember/components/tag';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import castToAny from 'doc-app/helpers/cast-to-any';
import RouteTemplate from 'ember-route-template/route';
import Component from '@glimmer/component';
import { array } from '@ember/helper';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Tag
    </h1>

    <Demo as |demo|>
      <demo.example @name='tag.hbs'>
        {{!import Tag from 'carbon-components-ember/components/tag'}}

        {{#each
          (array
            'red'
            'magenta'
            'purple'
            'blue'
            'cyan'
            'teal'
            'green'
            'gray'
            'cool-gray'
            'warm-gray'
          )
          as |type|
        }}
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
