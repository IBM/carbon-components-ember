import List from 'carbon-components-ember/components/list';
import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';
import { array } from '@ember/helper';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon List
    </h1>

    <DocsDemo as |demo|>
      <demo.example @name='list.hbs'>
        <List @loading={{true}}>
          Loading
        </List>

        <br />
        <br />

        <List @items={{array 'a' 'b' 'c'}} as |list|>
          <list.SearchInput />
          <list.Header @headers={{array '1' '2' '3'}} />
          <list.BodyRows as |row|>
            <row.Row>
              <list.Column>
                {{row.item}}
              </list.Column>
            </row.Row>
          </list.BodyRows>
          <list.Pagination />
        </List>
      </demo.example>
      <br />
      <br />
      <demo.snippet @name='list.hbs' />
    </DocsDemo>
  </template>
}

export default RouteTemplate(RouteComponent);
