<ThemeSwitcher />

# StructuredList

Structured Lists group content that is similar or related, such as terms
or definitions. Compose a list from `SL.Head`, `SL.Body`, `SL.Row`, and
`SL.Cell` yielded by `StructuredList`.

```gjs live preview
import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <StructuredList as |SL|>
        <SL.Head>
            <SL.Row @head={{true}}>
                <SL.Cell @head={{true}}>ColumnA</SL.Cell>
                <SL.Cell @head={{true}}>ColumnB</SL.Cell>
                <SL.Cell @head={{true}}>ColumnC</SL.Cell>
            </SL.Row>
        </SL.Head>
        <SL.Body>
            <SL.Row>
                <SL.Cell @noWrap={{true}}>Row 1</SL.Cell>
                <SL.Cell>Row 1</SL.Cell>
                <SL.Cell>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc dui magna, finibus id tortor sed, aliquet bibendum
                    augue.
                </SL.Cell>
            </SL.Row>
            <SL.Row>
                <SL.Cell @noWrap={{true}}>Row 2</SL.Cell>
                <SL.Cell>Row 2</SL.Cell>
                <SL.Cell>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc dui magna, finibus id tortor sed, aliquet bibendum
                    augue.
                </SL.Cell>
            </SL.Row>
        </SL.Body>
    </StructuredList>
</template>
```

## Selection

Passing `@selection={{true}}` turns each row into a radio-style selectable
item. Give each `SL.Row` a stable `@id` and render the row-bound `Row`
input component (yielded from `SL.Row`) to make it selectable; clicking
anywhere in the row, or the input itself, selects it.

```gjs live preview
import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <StructuredList @selection={{true}} @selectedInitialRow="row-1" as |SL|>
        <SL.Head>
            <SL.Row @head={{true}}>
                <SL.Cell @head={{true}}>ColumnA</SL.Cell>
                <SL.Cell @head={{true}}>ColumnB</SL.Cell>
            </SL.Row>
        </SL.Head>
        <SL.Body>
            <SL.Row @id="row-1" as |Row|>
                <Row @name="structured-list-demo" />
                <SL.Cell>Row 1</SL.Cell>
                <SL.Cell>Option 1</SL.Cell>
            </SL.Row>
            <SL.Row @id="row-2" as |Row|>
                <Row @name="structured-list-demo" />
                <SL.Cell>Row 2</SL.Cell>
                <SL.Cell>Option 2</SL.Cell>
            </SL.Row>
        </SL.Body>
    </StructuredList>
</template>
```

## Condensed

```gjs live preview
import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <StructuredList @isCondensed={{true}} as |SL|>
        <SL.Head>
            <SL.Row @head={{true}}>
                <SL.Cell @head={{true}}>ColumnA</SL.Cell>
                <SL.Cell @head={{true}}>ColumnB</SL.Cell>
            </SL.Row>
        </SL.Head>
        <SL.Body>
            <SL.Row>
                <SL.Cell>Row 1</SL.Cell>
                <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
        </SL.Body>
    </StructuredList>
</template>
```

## Flush

`@isFlush` removes the left/right padding on the outer columns. It has no
effect when `@selection` is enabled.

```gjs live preview
import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <StructuredList @isFlush={{true}} as |SL|>
        <SL.Head>
            <SL.Row @head={{true}}>
                <SL.Cell @head={{true}}>ColumnA</SL.Cell>
                <SL.Cell @head={{true}}>ColumnB</SL.Cell>
            </SL.Row>
        </SL.Head>
        <SL.Body>
            <SL.Row>
                <SL.Cell>Row 1</SL.Cell>
                <SL.Cell>Row 1</SL.Cell>
            </SL.Row>
        </SL.Body>
    </StructuredList>
</template>
```

## API Reference

<details>
<summary><h3>StructuredList</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/structured-list' 
    @name='default' 
  />
</template>
```
</details>
