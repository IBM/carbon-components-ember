import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, a4 as CarbonButton, j as fn, a5 as ConfirmDialogComponent, t as templateOnly, a6 as cell, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const context = cell('N/A');
const repl_20 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Button @onClick={{fn (mut context.current) ''}}>ask</Button>
{{#unless context.current}}
  <ConfirmDialog
    @type='info'
    @body='are you sure?'
    @onCancel={{fn (mut context.current) 'no'}}
    @onAccept={{fn (mut context.current) 'yes'}}
  />
{{/unless}}
  <br>
    answer: {{context.current}}
*/
{
  "id": "X1ampSCQ",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@onClick\"],[[28,[32,2],[[28,[31,0],[[32,3,[\"current\"]]],null],\"\"],null]]],[[\"default\"],[[[[1,\"ask\"]],[]]]]],[1,\"\\n\"],[41,[51,[32,3,[\"current\"]]],[[[1,\"  \"],[8,[32,4],null,[[\"@type\",\"@body\",\"@onCancel\",\"@onAccept\"],[\"info\",\"are you sure?\",[28,[32,2],[[28,[31,0],[[32,3,[\"current\"]]],null],\"no\"],null],[28,[32,2],[[28,[31,0],[[32,3,[\"current\"]]],null],\"yes\"],null]]],null],[1,\"\\n\"]],[]],null],[1,\"  \"],[10,\"br\"],[12],[13],[1,\"\\n    answer: \"],[1,[32,3,[\"current\"]]]],[],[\"mut\",\"unless\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonButton, fn, context, ConfirmDialogComponent],
  "isStrictMode": true
}), templateOnly(undefined, "confirm-dialog.gjs"));

const repl_21 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/dialogs/confirm' 
  @name='default' 
/>
*/
{
  "id": "5P8EOm7s",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/dialogs/confirm\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "confirm-dialog.gjs"));

const confirmDialog_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="confirm-dialog">Confirm Dialog</h1>
<carbon-shadow-demo id="repl_20" class="repl-sdk__demo"><div><repl_20></repl_20></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { cell } from 'ember-resources';
import { ConfirmDialog, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const context = cell('N/A');

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Button @onClick=\{{fn (mut context.current) ''}}>ask&#x3C;/Button>
    \{{#unless context.current}}
      &#x3C;ConfirmDialog
        @type='info'
        @body='are you sure?'
        @onCancel=\{{fn (mut context.current) 'no'}}
        @onAccept=\{{fn (mut context.current) 'yes'}}
      />
    \{{/unless}}
      &#x3C;br>
        answer: \{{context.current}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Confirm Dialog</h3></summary>
<div id="repl_21" class="repl-sdk__demo"><repl_21></repl_21></div>
</details>
*/
{
  "id": "LQshGqP7",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"confirm-dialog\"],[12],[1,\"Confirm Dialog\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_20\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { cell } from 'ember-resources';\\nimport { ConfirmDialog, Button } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst context = cell('N/A');\\n\\n<template>\\n    <ThemeSupport />\\n    <Button @onClick=\"],[1,\"{{fn (mut context.current) ''}}>ask</Button>\\n    \"],[1,\"{{#unless context.current}}\\n      <ConfirmDialog\\n        @type='info'\\n        @body='are you sure?'\\n        @onCancel=\"],[1,\"{{fn (mut context.current) 'no'}}\\n        @onAccept=\"],[1,\"{{fn (mut context.current) 'yes'}}\\n      />\\n    \"],[1,\"{{/unless}}\\n      <br>\\n        answer: \"],[1,\"{{context.current}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Confirm Dialog\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_21\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_20, repl_21],
  "isStrictMode": true
}), templateOnly(undefined, "confirm-dialog.gjs"));

export { confirmDialog_gjs as default };
