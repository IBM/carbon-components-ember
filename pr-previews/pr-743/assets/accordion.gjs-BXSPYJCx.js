import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, d as helper, Y as RadioButtonGroup, j as fn, f as helper$1, Z as CarbonCheckbox, $ as Accordion, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const repl_1 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
  {{#let (newObj) as |context|}}
      <RadioButtonGroup @onChange={{fn (set context 'align')}}>
          <:heading>
              orientation
          </:heading>
          <:default as |Radio|>
              <Radio @value='start'>
                  start
              </Radio>
              <Radio @defaultChecked={{true}} @value='end'>
                  end
              </Radio>
          </:default>
      </RadioButtonGroup>
      <br />
      <Checkbox
          @name='disabled'
          @label='disabled'
          @checked={{context.disabled}}
          @onChange={{fn (set context 'disabled')}}
      />
      <Checkbox
          @name='open'
          @label='open'
          @checked={{context.open}}
          @onChange={{fn (set context 'open')}}
      />
      <br />

      <Accordion
          @align={{context.align}}
          @disabled={{context.disabled}}
          @open={{context.open}}
          as |Item|
      >
          <Item @title='Title 1'>
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion. Accordions work
              especially well on mobile interfaces or whenever vertical space is
              at a premium.
          </Item>
          <Item @title='Title 2'>
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion. Accordions work
              especially well on mobile interfaces or whenever vertical space is
              at a premium.
          </Item>
          <Item @title='Title 3'>
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion. Accordions work
              especially well on mobile interfaces or whenever vertical space is
              at a premium.
          </Item>
      </Accordion>
  {{/let}}
*/
{
  "id": "V9zfJ/8P",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[44,[[28,[32,1],null,null]],[[[1,\"      \"],[8,[32,2],null,[[\"@onChange\"],[[28,[32,3],[[28,[32,4],[[30,1],\"align\"],null]],null]]],[[\"heading\",\"default\"],[[[[1,\"\\n              orientation\\n          \"]],[]],[[[1,\"\\n              \"],[8,[30,2],null,[[\"@value\"],[\"start\"]],[[\"default\"],[[[[1,\"\\n                  start\\n              \"]],[]]]]],[1,\"\\n              \"],[8,[30,2],null,[[\"@defaultChecked\",\"@value\"],[true,\"end\"]],[[\"default\"],[[[[1,\"\\n                  end\\n              \"]],[]]]]],[1,\"\\n          \"]],[2]]]]],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n      \"],[8,[32,5],null,[[\"@name\",\"@label\",\"@checked\",\"@onChange\"],[\"disabled\",\"disabled\",[30,1,[\"disabled\"]],[28,[32,3],[[28,[32,4],[[30,1],\"disabled\"],null]],null]]],null],[1,\"\\n      \"],[8,[32,5],null,[[\"@name\",\"@label\",\"@checked\",\"@onChange\"],[\"open\",\"open\",[30,1,[\"open\"]],[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null]],null]]],null],[1,\"\\n      \"],[10,\"br\"],[12],[13],[1,\"\\n\\n      \"],[8,[32,6],null,[[\"@align\",\"@disabled\",\"@open\"],[[30,1,[\"align\"]],[30,1,[\"disabled\"]],[30,1,[\"open\"]]]],[[\"default\"],[[[[1,\"\\n          \"],[8,[30,3],null,[[\"@title\"],[\"Title 1\"]],[[\"default\"],[[[[1,\"\\n              The accordion component delivers large amounts of content in a\\n              small space through progressive disclosure. The user gets key\\n              details about the underlying content and can choose to expand that\\n              content within the constraints of the accordion. Accordions work\\n              especially well on mobile interfaces or whenever vertical space is\\n              at a premium.\\n          \"]],[]]]]],[1,\"\\n          \"],[8,[30,3],null,[[\"@title\"],[\"Title 2\"]],[[\"default\"],[[[[1,\"\\n              The accordion component delivers large amounts of content in a\\n              small space through progressive disclosure. The user gets key\\n              details about the underlying content and can choose to expand that\\n              content within the constraints of the accordion. Accordions work\\n              especially well on mobile interfaces or whenever vertical space is\\n              at a premium.\\n          \"]],[]]]]],[1,\"\\n          \"],[8,[30,3],null,[[\"@title\"],[\"Title 3\"]],[[\"default\"],[[[[1,\"\\n              The accordion component delivers large amounts of content in a\\n              small space through progressive disclosure. The user gets key\\n              details about the underlying content and can choose to expand that\\n              content within the constraints of the accordion. Accordions work\\n              especially well on mobile interfaces or whenever vertical space is\\n              at a premium.\\n          \"]],[]]]]],[1,\"\\n      \"]],[3]]]]],[1,\"\\n\"]],[1]]]],[\"context\",\"Radio\",\"Item\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, RadioButtonGroup, fn, helper$1, CarbonCheckbox, Accordion],
  "isStrictMode": true
}), templateOnly(undefined, "accordion.gjs"));

const repl_2 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/accordion' 
  @name='default' 
/>
*/
{
  "id": "tJwii6OJ",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/accordion\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "accordion.gjs"));

const accordion_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="accordion">Accordion</h1>
<p>An accordion component is an element that organizes content into collapsible sections, enabling users to expand or collapse them for efficient information presentation and navigation.</p>
<carbon-shadow-demo id="repl_1" class="repl-sdk__demo"><div><repl_1></repl_1></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { Accordion, Checkbox, RadioButtonGroup } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

const eq = (a, b) => a === b;

&#x3C;template>
  &#x3C;ThemeSupport />
    \{{#let (newObj) as |context|}}
        &#x3C;RadioButtonGroup @onChange=\{{fn (set context 'align')}}>
            &#x3C;:heading>
                orientation
            &#x3C;/:heading>
            &#x3C;:default as |Radio|>
                &#x3C;Radio @value='start'>
                    start
                &#x3C;/Radio>
                &#x3C;Radio @defaultChecked=\{{true}} @value='end'>
                    end
                &#x3C;/Radio>
            &#x3C;/:default>
        &#x3C;/RadioButtonGroup>
        &#x3C;br />
        &#x3C;Checkbox
            @name='disabled'
            @label='disabled'
            @checked=\{{context.disabled}}
            @onChange=\{{fn (set context 'disabled')}}
        />
        &#x3C;Checkbox
            @name='open'
            @label='open'
            @checked=\{{context.open}}
            @onChange=\{{fn (set context 'open')}}
        />
        &#x3C;br />

        &#x3C;Accordion
            @align=\{{context.align}}
            @disabled=\{{context.disabled}}
            @open=\{{context.open}}
            as |Item|
        >
            &#x3C;Item @title='Title 1'>
                The accordion component delivers large amounts of content in a
                small space through progressive disclosure. The user gets key
                details about the underlying content and can choose to expand that
                content within the constraints of the accordion. Accordions work
                especially well on mobile interfaces or whenever vertical space is
                at a premium.
            &#x3C;/Item>
            &#x3C;Item @title='Title 2'>
                The accordion component delivers large amounts of content in a
                small space through progressive disclosure. The user gets key
                details about the underlying content and can choose to expand that
                content within the constraints of the accordion. Accordions work
                especially well on mobile interfaces or whenever vertical space is
                at a premium.
            &#x3C;/Item>
            &#x3C;Item @title='Title 3'>
                The accordion component delivers large amounts of content in a
                small space through progressive disclosure. The user gets key
                details about the underlying content and can choose to expand that
                content within the constraints of the accordion. Accordions work
                especially well on mobile interfaces or whenever vertical space is
                at a premium.
            &#x3C;/Item>
        &#x3C;/Accordion>
    \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Accordion</h3></summary>
<div id="repl_2" class="repl-sdk__demo"><repl_2></repl_2></div>
</details>
*/
{
  "id": "QDEGCe4n",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"accordion\"],[12],[1,\"Accordion\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"An accordion component is an element that organizes content into collapsible sections, enabling users to expand or collapse them for efficient information presentation and navigation.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_1\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { Accordion, Checkbox, RadioButtonGroup } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst eq = (a, b) => a === b;\\n\\n<template>\\n  <ThemeSupport />\\n    \"],[1,\"{{#let (newObj) as |context|}}\\n        <RadioButtonGroup @onChange=\"],[1,\"{{fn (set context 'align')}}>\\n            <:heading>\\n                orientation\\n            </:heading>\\n            <:default as |Radio|>\\n                <Radio @value='start'>\\n                    start\\n                </Radio>\\n                <Radio @defaultChecked=\"],[1,\"{{true}} @value='end'>\\n                    end\\n                </Radio>\\n            </:default>\\n        </RadioButtonGroup>\\n        <br />\\n        <Checkbox\\n            @name='disabled'\\n            @label='disabled'\\n            @checked=\"],[1,\"{{context.disabled}}\\n            @onChange=\"],[1,\"{{fn (set context 'disabled')}}\\n        />\\n        <Checkbox\\n            @name='open'\\n            @label='open'\\n            @checked=\"],[1,\"{{context.open}}\\n            @onChange=\"],[1,\"{{fn (set context 'open')}}\\n        />\\n        <br />\\n\\n        <Accordion\\n            @align=\"],[1,\"{{context.align}}\\n            @disabled=\"],[1,\"{{context.disabled}}\\n            @open=\"],[1,\"{{context.open}}\\n            as |Item|\\n        >\\n            <Item @title='Title 1'>\\n                The accordion component delivers large amounts of content in a\\n                small space through progressive disclosure. The user gets key\\n                details about the underlying content and can choose to expand that\\n                content within the constraints of the accordion. Accordions work\\n                especially well on mobile interfaces or whenever vertical space is\\n                at a premium.\\n            </Item>\\n            <Item @title='Title 2'>\\n                The accordion component delivers large amounts of content in a\\n                small space through progressive disclosure. The user gets key\\n                details about the underlying content and can choose to expand that\\n                content within the constraints of the accordion. Accordions work\\n                especially well on mobile interfaces or whenever vertical space is\\n                at a premium.\\n            </Item>\\n            <Item @title='Title 3'>\\n                The accordion component delivers large amounts of content in a\\n                small space through progressive disclosure. The user gets key\\n                details about the underlying content and can choose to expand that\\n                content within the constraints of the accordion. Accordions work\\n                especially well on mobile interfaces or whenever vertical space is\\n                at a premium.\\n            </Item>\\n        </Accordion>\\n    \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Accordion\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_2\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_1, repl_2],
  "isStrictMode": true
}), templateOnly(undefined, "accordion.gjs"));

export { accordion_gjs as default };
