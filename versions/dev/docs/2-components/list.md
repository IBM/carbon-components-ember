<ThemeSwitcher />

# List

```gjs live preview
import { array } from '@ember/helper';
import { List } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <List @loading={{true}}>
        Loading
    </List>

    <br />
    <br />

    <List @items={{array 'a' 'b' 'c'}} as |list|>
        <list.SearchInput />
        <list.Header @headers={{array '#' 'item' 'name'}} />
        <list.BodyRows as |row|>
            <row.Row>
                <list.Column>
                    {{row.item}}
                </list.Column>
              <list.Column>
                item
              </list.Column>
              <list.Column>
                stock
              </list.Column>
            </row.Row>
        </list.BodyRows>
        <list.Pagination />
    </List>
</template>
```
## API Reference

<details>
<summary><h3>List</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/list' 
    @name='default' 
  />
</template>
```
</details>
