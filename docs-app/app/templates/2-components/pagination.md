<ThemeSwitcher />

# Pagination

```gjs live preview
import { Pagination, FormInput, Checkbox } from 'carbon-components-ember/components';
import { set } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({
    paginationLength: 100,
});

const split = (char, text) => text?.split(char);
const not = (x) => !x;

<template>
    <ThemeSupport />
    <Pagination
        @disabled={{context.disabled}}
        @isLoading={{context.isLoading}}
        @length={{context.paginationLength}}
        @itemsPerPageOptions={{split ' ' context.itemsPerPageOptions}}
        @onPageChanged={{set context 'currentSlice'}}
        @state={{context.currentSlice}}
    />

    <label>
        currentSlice
    </label>
    page:
    {{context.currentSlice.page}}<br />
    start:
    {{context.currentSlice.start}}<br />
    end:
    {{context.currentSlice.end}}<br />
    <Checkbox
        @label="disabled"
        @checked={{context.disabled}}
        @onChange={{fn
        (set context 'disabled')
        (not context.disabled)
    }}
    />
    <Checkbox
        @label="is loading"
        @checked={{context.isLoading}}
        @onChange={{fn
        (set context 'isLoading')
        (not context.isLoading)
    }}
    />
    <label>
        itemsPerPage
    </label>
    <FormInput @onChange={{fn (set context 'itemsPerPageOptions')}} />
    <label>
        paginationLength
    </label>
    <FormInput @onChange={{fn (set context 'paginationLength')}} />
</template>
```

## Customizing the navigation button text and tooltips

Use `@backwardText`/`@forwardText` to customize the accessible label and
tooltip content of the navigation buttons, and
`@backwardTextTooltipPosition`/`@forwardTextTooltipPosition` to control where
the tooltip is placed.

```gjs live preview
import { Pagination } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const noop = () => null;

<template>
    <ThemeSupport />
    <Pagination
        @length={{50}}
        @onPageChanged={{noop}}
        @backwardText='Prior page'
        @forwardText='Later page'
        @backwardTextTooltipPosition='bottom'
        @forwardTextTooltipPosition='bottom'
    />
</template>
```

## Custom page-selection control

Use `@renderPageSelect` to replace the default page-select control with a
custom component. It receives `@currentPage`, `@totalPages`,
`@currentPageSize`, `@pageSelectLabelText` and `@onSetPage`.

```gjs live preview
import { Pagination } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const noop = () => null;

const CustomPageSelect = <template>
    <span aria-label={{@pageSelectLabelText}}>
        Page
        <button type='button' {{on 'click' (fn @onSetPage 1)}}>1</button>
        of
        {{@totalPages}}
    </span>
</template>;

<template>
    <ThemeSupport />
    <Pagination
        @length={{100}}
        @onPageChanged={{noop}}
        @renderPageSelect={{CustomPageSelect}}
    />
</template>
```

## API Reference

<details>
<summary><h3>Pagination</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/pagination' 
    @name='default' 
  />
</template>
```
</details>
