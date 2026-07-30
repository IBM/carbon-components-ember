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

## TileGroup

Use `TileGroup` together with `RadioTile` to build a group of tiles where
only one tile can be selected at a time.

```gjs live preview
import { TileGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const context = new TrackedObject();

const updateSelected = (value) => {
  context.selected = value;
}

<template>
    <ThemeSupport />
    <br />
    <TileGroup @name="tile-group" @legend="Choose one" @defaultSelected="standard" @onChange={{updateSelected}} as |Tile|>
        <Tile @value="standard">Option 1</Tile>
        <Tile @value="all">Option 2</Tile>
        <Tile @value="custom">Option 3</Tile>
    </TileGroup>
    <br/>
    selected: {{context.selected}}
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

<details>
<summary><h3>RadioTile</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/radio-tile'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>TileGroup</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/tile/tile-group'
    @name='default'
  />
</template>
```
</details>
