<ThemeSwitcher />

# Data Table

Data tables are used to organize and display data efficiently. 
The data table component allows for customization with additional functionality, as needed by your product’s users.

```gjs live preview
import { array, hash } from '@ember/helper';
import { DataTable } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
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
</template>
```


<details open><summary>state</summary>
The state of the table could be registerd on the controller to resume to
the same state. E.g. when clicking on a list item and then go back

```gjs live preview
import { array, hash, fn } from '@ember/helper';
import { cell } from 'ember-resources';
import { DataTable, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const state = cell();

<template>
    <ThemeSupport />
    {{#let
        (array (hash name='a' b='c') (hash name='John' b='asd'))
    as |items|
    }}
        <DataTable
            @title='Table title'
            @registerState={{fn (mut state.current)}}
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
            @state={{state.current}}
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
</template>
```

</details>


## API Reference

<details>
<summary><h3>Data Table</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/data-table' 
    @name='default' 
  />
</template>
```
</details>
