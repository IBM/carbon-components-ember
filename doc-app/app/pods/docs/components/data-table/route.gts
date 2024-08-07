import Input from 'carbon-components-ember/components/form-input';
import Button from 'carbon-components-ember/components/button';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import set from 'carbon-components-ember/helpers/set';
import DataTable from 'carbon-components-ember/components/data-table';
import { array, fn, hash } from '@ember/helper';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import Component from '@glimmer/component';
import DataTableController from 'doc-app/pods/docs/components/data-table/controller.ts';

class RouteComponent extends RoutableComponent<DataTableController> {
  <template>
    <h1>
      Carbon Data Table
    </h1>

    <Demo as |demo|>
      <demo.example @name='data-table.hbs'>
        {{!import DataTable from 'carbon-components-ember/components/data-table'}}

        <DataTable
          @title='Table title'
          @items={{array (hash name='a' b='c') (hash name='John' b='asd')}}
          as |table|
        >
          <table.Toolbar as |toolbar|>
            <toolbar.Content>
              <table.SearchInput @expandable={{true}} />
            </toolbar.Content>
          </table.Toolbar>
          <table.Table>
            <table.Header
              @headers={{array (hash label='Name') (hash label='details') null}}
            />
            <table.EachBodyRows as |row|>
              <row.Row>
                <table.Column>
                  {{row.item.name}}
                </table.Column>
                <table.Column>
                  {{row.item.b}}
                </table.Column>
                <table.Menu as |Item|>
                  <Item>
                    Edit
                  </Item>
                </table.Menu>
              </row.Row>
            </table.EachBodyRows>
          </table.Table>
          <table.Pagination />
        </DataTable>
      </demo.example>
      <demo.snippet @name='data-table.hbs' />
    </Demo>

    <Demo as |demo|>
      The state of the table could be registerd on the controller to resume to
      the same state. E.g. when clicking on a list item and then go back
      <demo.example @name='data-table-2.hbs'>
        {{#let
          (array (hash name='a' b='c') (hash name='John' b='asd'))
          as |items|
        }}
          <DataTable
            @title='Table title'
            @registerState={{fn (mut @controller.state)}}
            @items={{items}}
            as |table|
          >
            <table.Toolbar as |toolbar|>
              <toolbar.Content>
                <table.SearchInput />
              </toolbar.Content>
              <toolbar.Actions>
                <Button @type='primary'>
                  Save
                </Button>
              </toolbar.Actions>
            </table.Toolbar>
            <table.Table>
              <table.Header
                @isCheckable={{true}}
                @headers={{array
                  (hash label='Name')
                  (hash label='details')
                  null
                }}
              />
              <table.EachBodyRows as |row|>
                <row.Row @item={{row.item}}>
                  <table.Column>
                    {{row.item.name}}
                  </table.Column>
                  <table.Column>
                    {{row.item.b}}
                  </table.Column>
                  <table.Menu as |Item|>
                    <Item>
                      Edit
                    </Item>
                  </table.Menu>
                </row.Row>
              </table.EachBodyRows>
            </table.Table>
            <table.Pagination />
          </DataTable>

          <DataTable
            @state={{@controller.state}}
            @title='Table Copy'
            @items={{items}}
            as |table|
          >
            <table.Toolbar as |toolbar|>
              <toolbar.Content>
                <table.SearchInput />
              </toolbar.Content>
              <toolbar.Actions>
                <Button @type='primary'>
                  Save
                </Button>
              </toolbar.Actions>
            </table.Toolbar>
            <table.Table>
              <table.Header
                @isCheckable={{true}}
                @headers={{array
                  (hash label='Name')
                  (hash label='details')
                  null
                }}
              />
              <table.EachBodyRows as |row|>
                <row.Row @item={{row.item}}>
                  <table.Column>
                    {{row.item.name}}
                  </table.Column>
                  <table.Column>
                    {{row.item.b}}
                  </table.Column>
                  <table.Menu as |Item|>
                    <Item>
                      Edit
                    </Item>
                  </table.Menu>
                </row.Row>
              </table.EachBodyRows>
            </table.Table>
            <table.Pagination />
          </DataTable>
        {{/let}}
      </demo.example>
      <demo.snippet @name='data-table-2.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
