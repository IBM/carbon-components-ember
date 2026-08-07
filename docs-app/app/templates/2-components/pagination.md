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

<details><summary>sizes</summary>
Pagination supports `xs`, `sm`, `md` and `lg` sizes via the `@size` argument.

```gjs live preview
import { Pagination } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <Pagination @size='xs' @length={{100}} @onPageChanged={{() => {}}} />
    <Pagination @size='sm' @length={{100}} @onPageChanged={{() => {}}} />
    <Pagination @size='md' @length={{100}} @onPageChanged={{() => {}}} />
    <Pagination @size='lg' @length={{100}} @onPageChanged={{() => {}}} />
</template>
```

</details>

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
