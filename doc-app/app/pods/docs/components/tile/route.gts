import Demo from 'ember-cli-addon-docs/components/docs-demo';
import Tile from 'carbon-components-ember/components/tile';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Tile
    </h1>

    <Demo as |demo|>
      <demo.example @name='tile.hbs'>
        {{!import Tile from 'carbon-components-ember/components/tile'}}

        <Tile>
          <:content>
            Some Content
          </:content>
        </Tile>

        <br />

        <Tile @expandable={{true}}>
          <:above>
            Title
            <p>
              Some Content
            </p>
          </:above>
          <:below>
            test
            <div style='height: 150px;'>test height</div>
            footer
          </:below>
        </Tile>

        <Tile @clickable={{true}}>
          <:above>
            Title
          </:above>
          <:content>
            Some clickable Content
          </:content>
          <:below>
            footer
          </:below>
        </Tile>
      </demo.example>
      <demo.snippet @name='tile.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
