import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, d as helper, a4 as CarbonButton, j as fn, f as helper$1, t as templateOnly, Z as CarbonCheckbox, am as FormInput, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

function doSomething() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}
const repl_15 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
  {{#let (newObj) as |context|}}
      <Button
          @type='primary'
          @onClick={{fn (set context 'clicked') true}}
      >
          Primary Button
      </Button>
      <br>
      <br>
      <Button
          @type='primary'
          @ghost={{true}}
          @onClick={{fn (set context 'clicked') true}}
      >
          Ghost Button
      </Button>
      <br>
      <br>
      <Button
          @type='primary'
          @tertiary={{true}}
          @onClick={{fn (set context 'clicked') true}}
      >
          Tertiary Button
      </Button>
      <br>
      <br>
      <Button
          @type='secondary'
          @size='sm'
          @onClick={{fn (set context 'clicked') true}}
      >
          Secondary Small Button
      </Button>
      <br>
      <br>
      <Button @type='primary' @size='xl' @onClick={{doSomething}}>
          Button with loading indicator if onClick returns a promise
      </Button>
  {{/let}}
*/
{
  "id": "V/oUyuBz",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[44,[[28,[32,1],null,null]],[[[1,\"      \"],[8,[32,2],null,[[\"@type\",\"@onClick\"],[\"primary\",[28,[32,3],[[28,[32,4],[[30,1],\"clicked\"],null],true],null]]],[[\"default\"],[[[[1,\"\\n          Primary Button\\n      \"]],[]]]]],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[8,[32,2],null,[[\"@type\",\"@ghost\",\"@onClick\"],[\"primary\",true,[28,[32,3],[[28,[32,4],[[30,1],\"clicked\"],null],true],null]]],[[\"default\"],[[[[1,\"\\n          Ghost Button\\n      \"]],[]]]]],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[8,[32,2],null,[[\"@type\",\"@tertiary\",\"@onClick\"],[\"primary\",true,[28,[32,3],[[28,[32,4],[[30,1],\"clicked\"],null],true],null]]],[[\"default\"],[[[[1,\"\\n          Tertiary Button\\n      \"]],[]]]]],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[8,[32,2],null,[[\"@type\",\"@size\",\"@onClick\"],[\"secondary\",\"sm\",[28,[32,3],[[28,[32,4],[[30,1],\"clicked\"],null],true],null]]],[[\"default\"],[[[[1,\"\\n          Secondary Small Button\\n      \"]],[]]]]],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[8,[32,2],null,[[\"@type\",\"@size\",\"@onClick\"],[\"primary\",\"xl\",[32,5]]],[[\"default\"],[[[[1,\"\\n          Button with loading indicator if onClick returns a promise\\n      \"]],[]]]]],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, CarbonButton, fn, helper$1, doSomething],
  "isStrictMode": true
}), templateOnly(undefined, "button.gjs"));

const eq = (a, b) => a === b;
const not = x => !x;
const state = trackedObject();
const repl_16 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
  
  <Checkbox
      @checked={{eq state.type 'primary'}}
      @onChange={{fn (set state 'type') 'primary'}}
  >
      Primary
  </Checkbox>
  <Checkbox
      @checked={{eq state.type 'secondary'}}
      @onChange={{fn (set state 'type') 'secondary'}}
  >
      Secondary
  </Checkbox>
  <Checkbox
      @checked={{eq state.type 'danger'}}
      @onChange={{fn (set state 'type') 'danger'}}
  >
      Is Danger
  </Checkbox>
  <Checkbox
      @checked={{state.isSmall}}
      @onChange={{fn (set state 'isSmall') (not state.isSmall)}}
  >
      Is Small
  </Checkbox>
  <Checkbox
      @checked={{state.isTertiary}}
      @onChange={{fn
      (set state 'isTertiary')
      (not state.isTertiary)
  }}
  >
      Is Tertiary
  </Checkbox>
  <Checkbox
      @checked={{state.isDisabled}}
      @onChange={{fn
      (set state 'isDisabled')
      (not state.isDisabled)
  }}
  >
      Is Disabled
  </Checkbox>
  <label for='confirm-text'>
      Confirm Text
  </label>
  <Input
      id='confirm-text'
      {{! template-lint-disable }}
      @onChange={{fn (set state 'confirmText')}}
      @value={{state.confirmText}}
  />
  
      <Button
          @disabled={{state.isDisabled}}
          @type={{state.type}}
          @tertiary={{state.isTertiary}}
          @size={{if state.isSmall 'sm' 'md'}}
          @onClick={{fn (set state 'clicked') true}}
          @bubbles={{state.bubbles}}
          @confirmText={{state.confirmText}}
      >
          Button Text
      </Button>
*/
{
  "id": "0flvY4gP",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n  \\n  \"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[28,[32,2],[[32,3,[\"type\"]],\"primary\"],null],[28,[32,4],[[28,[32,5],[[32,3],\"type\"],null],\"primary\"],null]]],[[\"default\"],[[[[1,\"\\n      Primary\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[28,[32,2],[[32,3,[\"type\"]],\"secondary\"],null],[28,[32,4],[[28,[32,5],[[32,3],\"type\"],null],\"secondary\"],null]]],[[\"default\"],[[[[1,\"\\n      Secondary\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[28,[32,2],[[32,3,[\"type\"]],\"danger\"],null],[28,[32,4],[[28,[32,5],[[32,3],\"type\"],null],\"danger\"],null]]],[[\"default\"],[[[[1,\"\\n      Is Danger\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[32,3,[\"isSmall\"]],[28,[32,4],[[28,[32,5],[[32,3],\"isSmall\"],null],[28,[32,6],[[32,3,[\"isSmall\"]]],null]],null]]],[[\"default\"],[[[[1,\"\\n      Is Small\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[32,3,[\"isTertiary\"]],[28,[32,4],[[28,[32,5],[[32,3],\"isTertiary\"],null],[28,[32,6],[[32,3,[\"isTertiary\"]]],null]],null]]],[[\"default\"],[[[[1,\"\\n      Is Tertiary\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[32,3,[\"isDisabled\"]],[28,[32,4],[[28,[32,5],[[32,3],\"isDisabled\"],null],[28,[32,6],[[32,3,[\"isDisabled\"]]],null]],null]]],[[\"default\"],[[[[1,\"\\n      Is Disabled\\n  \"]],[]]]]],[1,\"\\n  \"],[10,\"label\"],[14,\"for\",\"confirm-text\"],[12],[1,\"\\n      Confirm Text\\n  \"],[13],[1,\"\\n  \"],[8,[32,7],[[24,1,\"confirm-text\"]],[[\"@onChange\",\"@value\"],[[28,[32,4],[[28,[32,5],[[32,3],\"confirmText\"],null]],null],[32,3,[\"confirmText\"]]]],null],[1,\"\\n  \\n      \"],[8,[32,8],null,[[\"@disabled\",\"@type\",\"@tertiary\",\"@size\",\"@onClick\",\"@bubbles\",\"@confirmText\"],[[32,3,[\"isDisabled\"]],[32,3,[\"type\"]],[32,3,[\"isTertiary\"]],[52,[32,3,[\"isSmall\"]],\"sm\",\"md\"],[28,[32,4],[[28,[32,5],[[32,3],\"clicked\"],null],true],null],[32,3,[\"bubbles\"]],[32,3,[\"confirmText\"]]]],[[\"default\"],[[[[1,\"\\n          Button Text\\n      \"]],[]]]]]],[],[\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonCheckbox, eq, state, fn, helper$1, not, FormInput, CarbonButton],
  "isStrictMode": true
}), templateOnly(undefined, "button.gjs"));

const repl_17 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/button' 
  @name='default' 
/>
*/
{
  "id": "yyl/2+CG",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/button\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "button.gjs"));

const button_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="button">Button</h1>
<ThemeSwitcher />
<carbon-shadow-demo id="repl_15" class="repl-sdk__demo"><div><repl_15></repl_15></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Button, Checkbox } from 'carbon-components-ember/components';
import { set, newObj } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { not, eq } from 'ember-truth-helpers';

function doSomething() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
    \{{#let (newObj) as |context|}}
        &#x3C;Button
            @type='primary'
            @onClick=\{{fn (set context 'clicked') true}}
        >
            Primary Button
        &#x3C;/Button>
        &#x3C;br>
        &#x3C;br>
        &#x3C;Button
            @type='primary'
            @ghost=\{{true}}
            @onClick=\{{fn (set context 'clicked') true}}
        >
            Ghost Button
        &#x3C;/Button>
        &#x3C;br>
        &#x3C;br>
        &#x3C;Button
            @type='primary'
            @tertiary=\{{true}}
            @onClick=\{{fn (set context 'clicked') true}}
        >
            Tertiary Button
        &#x3C;/Button>
        &#x3C;br>
        &#x3C;br>
        &#x3C;Button
            @type='secondary'
            @size='sm'
            @onClick=\{{fn (set context 'clicked') true}}
        >
            Secondary Small Button
        &#x3C;/Button>
        &#x3C;br>
        &#x3C;br>
        &#x3C;Button @type='primary' @size='xl' @onClick=\{{doSomething}}>
            Button with loading indicator if onClick returns a promise
        &#x3C;/Button>
    \{{/let}}
&#x3C;/template>
</code></pre></div>
<carbon-shadow-demo id="repl_16" class="repl-sdk__demo"><div><repl_16></repl_16></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">    import { ThemeSupport } from 'docs-support';
import { Checkbox, FormInput as Input, Button } from 'carbon-components-ember/components';
import { set } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';

const eq = (a, b) => a === b;
const not = (x) => !x;
const state = trackedObject();

&#x3C;template>

  &#x3C;ThemeSupport />
    
    &#x3C;Checkbox
        @checked=\{{eq state.type 'primary'}}
        @onChange=\{{fn (set state 'type') 'primary'}}
    >
        Primary
    &#x3C;/Checkbox>
    &#x3C;Checkbox
        @checked=\{{eq state.type 'secondary'}}
        @onChange=\{{fn (set state 'type') 'secondary'}}
    >
        Secondary
    &#x3C;/Checkbox>
    &#x3C;Checkbox
        @checked=\{{eq state.type 'danger'}}
        @onChange=\{{fn (set state 'type') 'danger'}}
    >
        Is Danger
    &#x3C;/Checkbox>
    &#x3C;Checkbox
        @checked=\{{state.isSmall}}
        @onChange=\{{fn (set state 'isSmall') (not state.isSmall)}}
    >
        Is Small
    &#x3C;/Checkbox>
    &#x3C;Checkbox
        @checked=\{{state.isTertiary}}
        @onChange=\{{fn
        (set state 'isTertiary')
        (not state.isTertiary)
    }}
    >
        Is Tertiary
    &#x3C;/Checkbox>
    &#x3C;Checkbox
        @checked=\{{state.isDisabled}}
        @onChange=\{{fn
        (set state 'isDisabled')
        (not state.isDisabled)
    }}
    >
        Is Disabled
    &#x3C;/Checkbox>
    &#x3C;label for='confirm-text'>
        Confirm Text
    &#x3C;/label>
    &#x3C;Input
        id='confirm-text'
        \{{! template-lint-disable }}
        @onChange=\{{fn (set state 'confirmText')}}
        @value=\{{state.confirmText}}
    />
    
        &#x3C;Button
            @disabled=\{{state.isDisabled}}
            @type=\{{state.type}}
            @tertiary=\{{state.isTertiary}}
            @size=\{{if state.isSmall 'sm' 'md'}}
            @onClick=\{{fn (set state 'clicked') true}}
            @bubbles=\{{state.bubbles}}
            @confirmText=\{{state.confirmText}}
        >
            Button Text
        &#x3C;/Button>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Button</h3></summary>
<div id="repl_17" class="repl-sdk__demo"><repl_17></repl_17></div>
</details>
*/
{
  "id": "698gRsoE",
  "block": "[[[10,\"h1\"],[14,1,\"button\"],[12],[1,\"Button\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_15\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Button, Checkbox } from 'carbon-components-ember/components';\\nimport { set, newObj } from 'carbon-components-ember/helpers';\\nimport { fn } from '@ember/helper';\\nimport { not, eq } from 'ember-truth-helpers';\\n\\nfunction doSomething() {\\n  return new Promise(resolve => setTimeout(resolve, 3000));\\n}\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n    \"],[1,\"{{#let (newObj) as |context|}}\\n        <Button\\n            @type='primary'\\n            @onClick=\"],[1,\"{{fn (set context 'clicked') true}}\\n        >\\n            Primary Button\\n        </Button>\\n        <br>\\n        <br>\\n        <Button\\n            @type='primary'\\n            @ghost=\"],[1,\"{{true}}\\n            @onClick=\"],[1,\"{{fn (set context 'clicked') true}}\\n        >\\n            Ghost Button\\n        </Button>\\n        <br>\\n        <br>\\n        <Button\\n            @type='primary'\\n            @tertiary=\"],[1,\"{{true}}\\n            @onClick=\"],[1,\"{{fn (set context 'clicked') true}}\\n        >\\n            Tertiary Button\\n        </Button>\\n        <br>\\n        <br>\\n        <Button\\n            @type='secondary'\\n            @size='sm'\\n            @onClick=\"],[1,\"{{fn (set context 'clicked') true}}\\n        >\\n            Secondary Small Button\\n        </Button>\\n        <br>\\n        <br>\\n        <Button @type='primary' @size='xl' @onClick=\"],[1,\"{{doSomething}}>\\n            Button with loading indicator if onClick returns a promise\\n        </Button>\\n    \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_16\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"    import { ThemeSupport } from 'docs-support';\\nimport { Checkbox, FormInput as Input, Button } from 'carbon-components-ember/components';\\nimport { set } from 'carbon-components-ember/helpers';\\nimport { fn } from '@ember/helper';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst eq = (a, b) => a === b;\\nconst not = (x) => !x;\\nconst state = trackedObject();\\n\\n<template>\\n\\n  <ThemeSupport />\\n    \\n    <Checkbox\\n        @checked=\"],[1,\"{{eq state.type 'primary'}}\\n        @onChange=\"],[1,\"{{fn (set state 'type') 'primary'}}\\n    >\\n        Primary\\n    </Checkbox>\\n    <Checkbox\\n        @checked=\"],[1,\"{{eq state.type 'secondary'}}\\n        @onChange=\"],[1,\"{{fn (set state 'type') 'secondary'}}\\n    >\\n        Secondary\\n    </Checkbox>\\n    <Checkbox\\n        @checked=\"],[1,\"{{eq state.type 'danger'}}\\n        @onChange=\"],[1,\"{{fn (set state 'type') 'danger'}}\\n    >\\n        Is Danger\\n    </Checkbox>\\n    <Checkbox\\n        @checked=\"],[1,\"{{state.isSmall}}\\n        @onChange=\"],[1,\"{{fn (set state 'isSmall') (not state.isSmall)}}\\n    >\\n        Is Small\\n    </Checkbox>\\n    <Checkbox\\n        @checked=\"],[1,\"{{state.isTertiary}}\\n        @onChange=\"],[1,\"{{fn\\n        (set state 'isTertiary')\\n        (not state.isTertiary)\\n    }}\\n    >\\n        Is Tertiary\\n    </Checkbox>\\n    <Checkbox\\n        @checked=\"],[1,\"{{state.isDisabled}}\\n        @onChange=\"],[1,\"{{fn\\n        (set state 'isDisabled')\\n        (not state.isDisabled)\\n    }}\\n    >\\n        Is Disabled\\n    </Checkbox>\\n    <label for='confirm-text'>\\n        Confirm Text\\n    </label>\\n    <Input\\n        id='confirm-text'\\n        \"],[1,\"{{! template-lint-disable }}\\n        @onChange=\"],[1,\"{{fn (set state 'confirmText')}}\\n        @value=\"],[1,\"{{state.confirmText}}\\n    />\\n    \\n        <Button\\n            @disabled=\"],[1,\"{{state.isDisabled}}\\n            @type=\"],[1,\"{{state.type}}\\n            @tertiary=\"],[1,\"{{state.isTertiary}}\\n            @size=\"],[1,\"{{if state.isSmall 'sm' 'md'}}\\n            @onClick=\"],[1,\"{{fn (set state 'clicked') true}}\\n            @bubbles=\"],[1,\"{{state.bubbles}}\\n            @confirmText=\"],[1,\"{{state.confirmText}}\\n        >\\n            Button Text\\n        </Button>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Button\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_17\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_15, repl_16, repl_17],
  "isStrictMode": true
}), templateOnly(undefined, "button.gjs"));

export { button_gjs as default };
