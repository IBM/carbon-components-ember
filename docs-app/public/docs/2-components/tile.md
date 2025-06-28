<ThemeSwitcher />

# Tile

```gjs live preview
import { Tile } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';


<template>
    <ThemeSupport />
    <br>
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

    <br />

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
</template>
```

## API Reference

<details>
<summary><h3>Tile</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/tile' 
    @name='default' 
  />
</template>
```
</details>
