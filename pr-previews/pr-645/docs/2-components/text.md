# Text
<ThemeSwitcher />

`Text` renders content wrapped in an element with the appropriate `dir`
attribute set, so that bidirectional text (mixing left-to-right and
right-to-left scripts) is displayed and aligned correctly.

`TextDirection` sets a text direction for all of the content rendered inside
of it, which is useful for wrapping a subtree that should use a fixed or
auto-detected direction.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Text, TextDirection } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <p>
    <Text>Hello world</Text>
  </p>
  <p>
    <Text>لكن لا بد أن أوضح لك أن كل</Text>
  </p>

  <br />

  <TextDirection @dir='rtl'>
    <Text @as='p'>
      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
    </Text>
  </TextDirection>
</template>
```


## API Reference

<details>
<summary><h3>Text</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/text' 
    @name='default' 
  />
</template>
```
</details>

<details>
<summary><h3>TextDirection</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/text-direction' 
    @name='default' 
  />
</template>
```
</details>
