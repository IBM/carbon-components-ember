import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aV as FormGroup, am as TextInput, Y as RadioButtonGroup, a4 as CarbonButton, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_212 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<FormGroup @legendText='FormGroup Legend' style='max-width: 400px'>
  <TextInput @id='one' @labelText='First Name' />
  <br />
  <TextInput @id='two' @labelText='Last Name' />
  <br />
  <RadioButtonGroup
    @legendText='Radio button heading'
    @name='formgroup-default-radio-button-group'
    @defaultSelected='radio-1'
    as |Radio|
  >
    <Radio @labelText='Option 1' @value='radio-1' @id='radio-1' />
    <Radio @labelText='Option 2' @value='radio-2' @id='radio-2' />
    <Radio @labelText='Option 3' @value='radio-3' @id='radio-3' />
  </RadioButtonGroup>
  <br />
  <Button>Submit</Button>
</FormGroup>
*/
{
  "id": "PCpBtFEr",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],[[24,5,\"max-width: 400px\"]],[[\"@legendText\"],[\"FormGroup Legend\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\",\"@labelText\"],[\"one\",\"First Name\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,2],null,[[\"@id\",\"@labelText\"],[\"two\",\"Last Name\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,3],null,[[\"@legendText\",\"@name\",\"@defaultSelected\"],[\"Radio button heading\",\"formgroup-default-radio-button-group\",\"radio-1\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1],null,[[\"@labelText\",\"@value\",\"@id\"],[\"Option 1\",\"radio-1\",\"radio-1\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@labelText\",\"@value\",\"@id\"],[\"Option 2\",\"radio-2\",\"radio-2\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@labelText\",\"@value\",\"@id\"],[\"Option 3\",\"radio-3\",\"radio-3\"]],null],[1,\"\\n  \"]],[1]]]]],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,4],null,null,[[\"default\"],[[[[1,\"Submit\"]],[]]]]],[1,\"\\n\"]],[]]]]]],[\"Radio\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormGroup, TextInput, RadioButtonGroup, CarbonButton],
  "isStrictMode": true
}), templateOnly(undefined, "group.gjs"));

const repl_213 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<FormGroup @legendText='Disabled FormGroup' @disabled={{true}}>
  <TextInput @id='disabled-one' @labelText='First Name' />
</FormGroup>
*/
{
  "id": "3AX5WAa/",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@legendText\",\"@disabled\"],[\"Disabled FormGroup\",true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\",\"@labelText\"],[\"disabled-one\",\"First Name\"]],null],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormGroup, TextInput],
  "isStrictMode": true
}), templateOnly(undefined, "group.gjs"));

const repl_214 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<FormGroup
  @legendText='Invalid FormGroup'
  @invalid={{true}}
  @message={{true}}
  @messageText='A valid value is required'
>
  <TextInput @id='invalid-one' @labelText='First Name' @invalid={{true}} />
</FormGroup>
*/
{
  "id": "BOLcWJG4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@legendText\",\"@invalid\",\"@message\",\"@messageText\"],[\"Invalid FormGroup\",true,true,\"A valid value is required\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\",\"@labelText\",\"@invalid\"],[\"invalid-one\",\"First Name\",true]],null],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormGroup, TextInput],
  "isStrictMode": true
}), templateOnly(undefined, "group.gjs"));

const repl_215 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/form-group'
  @name='default'
/>
*/
{
  "id": "6dVUmbBE",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/form-group\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "group.gjs"));

const group_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="form-group">FormGroup</h1>
<p><code>FormGroup</code> renders a <code>&#x3C;fieldset></code> with a <code>&#x3C;legend></code>, used to group related
form controls together under a shared heading.</p>
<carbon-shadow-demo id="repl_212" class="repl-sdk__demo"><div><repl_212></repl_212></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormGroup, TextInput, RadioButtonGroup, RadioButton, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;FormGroup @legendText='FormGroup Legend' style='max-width: 400px'>
    &#x3C;TextInput @id='one' @labelText='First Name' />
    &#x3C;br />
    &#x3C;TextInput @id='two' @labelText='Last Name' />
    &#x3C;br />
    &#x3C;RadioButtonGroup
      @legendText='Radio button heading'
      @name='formgroup-default-radio-button-group'
      @defaultSelected='radio-1'
      as |Radio|
    >
      &#x3C;Radio @labelText='Option 1' @value='radio-1' @id='radio-1' />
      &#x3C;Radio @labelText='Option 2' @value='radio-2' @id='radio-2' />
      &#x3C;Radio @labelText='Option 3' @value='radio-3' @id='radio-3' />
    &#x3C;/RadioButtonGroup>
    &#x3C;br />
    &#x3C;Button>Submit&#x3C;/Button>
  &#x3C;/FormGroup>
&#x3C;/template>
</code></pre></div>
<h2 id="disabled">Disabled</h2>
<p>Passing <code>@disabled=\{{true}}</code> disables the <code>&#x3C;fieldset></code>, which disables every
form control nested inside of it.</p>
<carbon-shadow-demo id="repl_213" class="repl-sdk__demo"><div><repl_213></repl_213></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormGroup, TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;FormGroup @legendText='Disabled FormGroup' @disabled=\{{true}}>
    &#x3C;TextInput @id='disabled-one' @labelText='First Name' />
  &#x3C;/FormGroup>
&#x3C;/template>
</code></pre></div>
<h2 id="invalid-state-and-message">Invalid state and message</h2>
<p>Passing <code>@invalid=\{{true}}</code> marks the <code>&#x3C;fieldset></code> as invalid via
<code>data-invalid</code>. <code>@message=\{{true}}</code> renders <code>@messageText</code> below the group's
contents, commonly used to surface a validation message.</p>
<carbon-shadow-demo id="repl_214" class="repl-sdk__demo"><div><repl_214></repl_214></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormGroup, TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;FormGroup
    @legendText='Invalid FormGroup'
    @invalid=\{{true}}
    @message=\{{true}}
    @messageText='A valid value is required'
  >
    &#x3C;TextInput @id='invalid-one' @labelText='First Name' @invalid=\{{true}} />
  &#x3C;/FormGroup>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>FormGroup</h3></summary>
<div id="repl_215" class="repl-sdk__demo"><repl_215></repl_215></div>
</details>
*/
{
  "id": "67wvx1Y6",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"form-group\"],[12],[1,\"FormGroup\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"FormGroup\"],[13],[1,\" renders a \"],[10,\"code\"],[12],[1,\"<fieldset>\"],[13],[1,\" with a \"],[10,\"code\"],[12],[1,\"<legend>\"],[13],[1,\", used to group related\\nform controls together under a shared heading.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_212\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormGroup, TextInput, RadioButtonGroup, RadioButton, Button } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <FormGroup @legendText='FormGroup Legend' style='max-width: 400px'>\\n    <TextInput @id='one' @labelText='First Name' />\\n    <br />\\n    <TextInput @id='two' @labelText='Last Name' />\\n    <br />\\n    <RadioButtonGroup\\n      @legendText='Radio button heading'\\n      @name='formgroup-default-radio-button-group'\\n      @defaultSelected='radio-1'\\n      as |Radio|\\n    >\\n      <Radio @labelText='Option 1' @value='radio-1' @id='radio-1' />\\n      <Radio @labelText='Option 2' @value='radio-2' @id='radio-2' />\\n      <Radio @labelText='Option 3' @value='radio-3' @id='radio-3' />\\n    </RadioButtonGroup>\\n    <br />\\n    <Button>Submit</Button>\\n  </FormGroup>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"disabled\"],[12],[1,\"Disabled\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@disabled=\"],[1,\"{{true}}\"],[13],[1,\" disables the \"],[10,\"code\"],[12],[1,\"<fieldset>\"],[13],[1,\", which disables every\\nform control nested inside of it.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_213\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormGroup, TextInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <FormGroup @legendText='Disabled FormGroup' @disabled=\"],[1,\"{{true}}>\\n    <TextInput @id='disabled-one' @labelText='First Name' />\\n  </FormGroup>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"invalid-state-and-message\"],[12],[1,\"Invalid state and message\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@invalid=\"],[1,\"{{true}}\"],[13],[1,\" marks the \"],[10,\"code\"],[12],[1,\"<fieldset>\"],[13],[1,\" as invalid via\\n\"],[10,\"code\"],[12],[1,\"data-invalid\"],[13],[1,\". \"],[10,\"code\"],[12],[1,\"@message=\"],[1,\"{{true}}\"],[13],[1,\" renders \"],[10,\"code\"],[12],[1,\"@messageText\"],[13],[1,\" below the group's\\ncontents, commonly used to surface a validation message.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_214\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormGroup, TextInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <FormGroup\\n    @legendText='Invalid FormGroup'\\n    @invalid=\"],[1,\"{{true}}\\n    @message=\"],[1,\"{{true}}\\n    @messageText='A valid value is required'\\n  >\\n    <TextInput @id='invalid-one' @labelText='First Name' @invalid=\"],[1,\"{{true}} />\\n  </FormGroup>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"FormGroup\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_215\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_212, repl_213, repl_214, repl_215],
  "isStrictMode": true
}), templateOnly(undefined, "group.gjs"));

export { group_gjs as default };
