import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, fg as Grid, fh as GridRow, fi as GridColumn, t as templateOnly, au as hash, fj as GridSettings, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const Box$4 = setComponentTemplate(templateFactory(
/*
  <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
  {{yield}}
</div>
*/
{
  "id": "XFLQQLhU",
  "block": "[[[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Box"));
const repl_26 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid>
  <GridRow>
    <GridColumn><Box>Column 1</Box></GridColumn>
    <GridColumn><Box>Column 2</Box></GridColumn>
    <GridColumn><Box>Column 3</Box></GridColumn>
    <GridColumn><Box>Column 4</Box></GridColumn>
  </GridRow>
</Grid>

<br />
<br />

<Grid>
  <GridRow>
    <GridColumn @sm={{2}} @md={{4}} @lg={{6}}>
      <Box>Span 2 of 4 / 4 of 8 / 6 of 16</Box>
    </GridColumn>
    <GridColumn @sm={{2}} @md={{4}} @lg={{10}}>
      <Box>Span 2 of 4 / 4 of 8 / 10 of 16</Box>
    </GridColumn>
  </GridRow>
</Grid>
*/
{
  "id": "t3/WoK6m",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n    \"],[8,[32,3],null,null,[[\"default\"],[[[[8,[32,4],null,null,[[\"default\"],[[[[1,\"Column 1\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[32,3],null,null,[[\"default\"],[[[[8,[32,4],null,null,[[\"default\"],[[[[1,\"Column 2\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[32,3],null,null,[[\"default\"],[[[[8,[32,4],null,null,[[\"default\"],[[[[1,\"Column 3\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[32,3],null,null,[[\"default\"],[[[[8,[32,4],null,null,[[\"default\"],[[[[1,\"Column 4\"]],[]]]]]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n    \"],[8,[32,3],null,[[\"@sm\",\"@md\",\"@lg\"],[2,4,6]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,4],null,null,[[\"default\"],[[[[1,\"Span 2 of 4 / 4 of 8 / 6 of 16\"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[32,3],null,[[\"@sm\",\"@md\",\"@lg\"],[2,4,10]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,4],null,null,[[\"default\"],[[[[1,\"Span 2 of 4 / 4 of 8 / 10 of 16\"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid, GridRow, GridColumn, Box$4],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const Box$3 = setComponentTemplate(templateFactory(
/*
  <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
  {{yield}}
</div>
*/
{
  "id": "XFLQQLhU",
  "block": "[[[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Box"));
const Frame$3 = setComponentTemplate(templateFactory(
/*
  <div style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
  {{yield}}
</div>
*/
{
  "id": "17WfNt0+",
  "block": "[[[10,0],[14,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Frame"));
const repl_27 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Frame>
  <Grid @mode="css-grid" as |g|>
    <g.Column @sm={{4}}><Box>Column 1</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 2</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 3</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 4</Box></g.Column>
  </Grid>
</Frame>
*/
{
  "id": "1qJZxhhU",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 1\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 2\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 3\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 4\"]],[]]]]]],[]]]]],[1,\"\\n  \"]],[1]]]]],[1,\"\\n\"]],[]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Frame$3, Grid, Box$3],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const Box$2 = setComponentTemplate(templateFactory(
/*
  <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
  {{yield}}
</div>
*/
{
  "id": "XFLQQLhU",
  "block": "[[[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Box"));
const Frame$2 = setComponentTemplate(templateFactory(
/*
  <div style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
  {{yield}}
</div>
*/
{
  "id": "17WfNt0+",
  "block": "[[[10,0],[14,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Frame"));
const repl_28 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Frame>
  <Grid @mode="css-grid" @narrow={{true}} as |g|>
    <g.Column @sm={{4}}><Box>Column 1</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 2</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 3</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 4</Box></g.Column>
  </Grid>
</Frame>
*/
{
  "id": "5beRv/jy",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@mode\",\"@narrow\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 1\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 2\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 3\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 4\"]],[]]]]]],[]]]]],[1,\"\\n  \"]],[1]]]]],[1,\"\\n\"]],[]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Frame$2, Grid, Box$2],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const Box$1 = setComponentTemplate(templateFactory(
/*
  <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
  {{yield}}
</div>
*/
{
  "id": "XFLQQLhU",
  "block": "[[[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Box"));
const Frame$1 = setComponentTemplate(templateFactory(
/*
  <div style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
  {{yield}}
</div>
*/
{
  "id": "17WfNt0+",
  "block": "[[[10,0],[14,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Frame"));
const repl_29 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Frame>
  <Grid @mode="css-grid" @condensed={{true}} as |g|>
    <g.Column @sm={{4}}><Box>Column 1</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 2</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 3</Box></g.Column>
    <g.Column @sm={{4}}><Box>Column 4</Box></g.Column>
  </Grid>
</Frame>
*/
{
  "id": "j/PyTOKg",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@mode\",\"@condensed\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 1\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 2\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 3\"]],[]]]]]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column 4\"]],[]]]]]],[]]]]],[1,\"\\n  \"]],[1]]]]],[1,\"\\n\"]],[]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Frame$1, Grid, Box$1],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_30 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" @fullWidth={{true}} as |g|>
  <g.Column @sm={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 1</div>
  </g.Column>
  <g.Column @sm={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 2</div>
  </g.Column>
  <g.Column @sm={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 3</div>
  </g.Column>
  <g.Column @sm={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 4</div>
  </g.Column>
</Grid>
*/
{
  "id": "9dwqy7t2",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\",\"@fullWidth\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 1\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 2\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 3\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 4\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_31 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" @withRowGap={{true}} as |g|>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">1</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">3</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">4</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">5</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">6</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">7</div>
  </g.Column>
  <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">8</div>
  </g.Column>
</Grid>
*/
{
  "id": "Er78RMPi",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\",\"@withRowGap\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"1\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"2\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"3\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"4\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"5\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"6\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"7\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"8\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_32 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" as |g|>
  <g.Column @sm={{2}} @md={{4}} @lg={{6}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Small: Span 2 of 4</p>
      <p>Medium: Span 4 of 8</p>
      <p>Large: Span 6 of 16</p>
    </div>
  </g.Column>
  <g.Column @sm={{2}} @md={{2}} @lg={{3}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Small: Span 2 of 4</p>
      <p>Medium: Span 2 of 8</p>
      <p>Large: Span 3 of 16</p>
    </div>
  </g.Column>
  <g.Column @sm={{0}} @md={{2}} @lg={{3}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Small: Span 0 of 4</p>
      <p>Medium: Span 2 of 8</p>
      <p>Large: Span 3 of 16</p>
    </div>
  </g.Column>
  <g.Column @sm={{0}} @md={{0}} @lg={{4}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Small: Span 0 of 4</p>
      <p>Medium: Span 0 of 8</p>
      <p>Large: Span 4 of 16</p>
    </div>
  </g.Column>
  <g.Column @sm="25%" @md="50%" @lg="75%">
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Small: Span 25%</p>
      <p>Medium: Span 50%</p>
      <p>Large: Span 75%</p>
    </div>
  </g.Column>
</Grid>
*/
{
  "id": "olbsFnTo",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[2,4,6]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Small: Span 2 of 4\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Medium: Span 4 of 8\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 6 of 16\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[2,2,3]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Small: Span 2 of 4\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Medium: Span 2 of 8\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 3 of 16\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[0,2,3]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Small: Span 0 of 4\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Medium: Span 2 of 8\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 3 of 16\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[0,0,4]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Small: Span 0 of 4\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Medium: Span 0 of 8\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 4 of 16\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[\"25%\",\"50%\",\"75%\"]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Small: Span 25%\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Medium: Span 50%\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 75%\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_33 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" as |g|>
  <g.Column
    @sm={{hash span=1 offset=3}}
    @md={{hash span=2 offset=6}}
    @lg={{hash span=4 offset=12}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">offset</div>
  </g.Column>
  <g.Column
    @sm={{hash span=2 offset=2}}
    @md={{hash span=4 offset=4}}
    @lg={{hash span=8 offset=8}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">offset</div>
  </g.Column>
  <g.Column
    @sm={{hash span=3 offset=1}}
    @md={{hash span=6 offset=2}}
    @lg={{hash span=12 offset=4}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">offset</div>
  </g.Column>
  <g.Column @sm={{hash span=4}} @md={{hash span=8}} @lg={{hash span=16}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">no offset</div>
  </g.Column>
  <g.Column
    @sm={{hash span="25%" offset=1}}
    @md={{hash span="50%" offset=2}}
    @lg={{hash span="75%" offset=4}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">percentage span</div>
  </g.Column>
</Grid>
*/
{
  "id": "3cBIUYXi",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\",\"offset\"],[1,3]]],[28,[32,2],null,[[\"span\",\"offset\"],[2,6]]],[28,[32,2],null,[[\"span\",\"offset\"],[4,12]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"offset\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\",\"offset\"],[2,2]]],[28,[32,2],null,[[\"span\",\"offset\"],[4,4]]],[28,[32,2],null,[[\"span\",\"offset\"],[8,8]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"offset\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\",\"offset\"],[3,1]]],[28,[32,2],null,[[\"span\",\"offset\"],[6,2]]],[28,[32,2],null,[[\"span\",\"offset\"],[12,4]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"offset\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\"],[4]]],[28,[32,2],null,[[\"span\"],[8]]],[28,[32,2],null,[[\"span\"],[16]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"no offset\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\",\"offset\"],[\"25%\",1]]],[28,[32,2],null,[[\"span\",\"offset\"],[\"50%\",2]]],[28,[32,2],null,[[\"span\",\"offset\"],[\"75%\",4]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"percentage span\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid, hash],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_34 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" as |g|>
  <g.Column
    @sm={{hash span=1 start=4}}
    @md={{hash span=2 start=7}}
    @lg={{hash span=4 start=13}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">span, start</div>
  </g.Column>
  <g.Column
    @sm={{hash span=2 end=5}}
    @md={{hash span=4 end=9}}
    @lg={{hash span=8 end=17}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">span, end</div>
  </g.Column>
  <g.Column
    @sm={{hash start=1 end=4}}
    @md={{hash start=3 end=9}}
    @lg={{hash start=5 end=17}}
  >
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">start, end</div>
  </g.Column>
</Grid>
*/
{
  "id": "B/krbg7/",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\",\"start\"],[1,4]]],[28,[32,2],null,[[\"span\",\"start\"],[2,7]]],[28,[32,2],null,[[\"span\",\"start\"],[4,13]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"span, start\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"span\",\"end\"],[2,5]]],[28,[32,2],null,[[\"span\",\"end\"],[4,9]]],[28,[32,2],null,[[\"span\",\"end\"],[8,17]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"span, end\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[[28,[32,2],null,[[\"start\",\"end\"],[1,4]]],[28,[32,2],null,[[\"start\",\"end\"],[3,9]]],[28,[32,2],null,[[\"start\",\"end\"],[5,17]]]]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"start, end\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid, hash],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_35 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" as |g|>
  <g.Column @sm={{2}} @md={{4}} @lg={{3}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Small: Span 2 of 4</p>
      <p>Medium: Span 4 of 8</p>
      <p>Large: Span 3 of 16</p>
    </div>
  </g.Column>
  <g.Column @sm={{2}} @md={{4}} @lg={{10}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Large: Span 10 of 16, containing a subgrid:</p>
    </div>
    <g.Grid as |sub|>
      <sub.Column @sm={{1}} @md={{1}} @lg={{2}}>
        <div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2 of 10</div>
      </sub.Column>
      <sub.Column @sm={{1}} @md={{1}} @lg={{2}}>
        <div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2 of 10</div>
      </sub.Column>
      <sub.Column @sm={{0}} @md={{1}} @lg={{2}}>
        <div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2 of 10</div>
      </sub.Column>
      <sub.Column @sm={{0}} @md={{1}} @lg={{4}}>
        <div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">4 of 10</div>
      </sub.Column>
    </g.Grid>
  </g.Column>
  <g.Column @sm={{0}} @md={{0}} @lg={{3}}>
    <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
      <p>Large: Span 3 of 16</p>
    </div>
  </g.Column>
</Grid>
*/
{
  "id": "3OGE6+h2",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[2,4,3]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Small: Span 2 of 4\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Medium: Span 4 of 8\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 3 of 16\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[2,4,10]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 10 of 16, containing a subgrid:\"],[13],[1,\"\\n    \"],[13],[1,\"\\n    \"],[8,[30,1,[\"Grid\"]],null,null,[[\"default\"],[[[[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[1,1,2]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"2 of 10\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[1,1,2]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"2 of 10\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[0,1,2]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"2 of 10\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[0,1,4]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"4 of 10\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[0,0,3]],[[\"default\"],[[[[1,\"\\n    \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"\\n      \"],[10,2],[12],[1,\"Large: Span 3 of 16\"],[13],[1,\"\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\",\"sub\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_36 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<h5>Wide</h5>
<Grid @mode="css-grid" as |g|>
  <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
    <g.Grid as |sub|>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">wide</div>
      </sub.Column>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">wide</div>
      </sub.Column>
    </g.Grid>
  </g.Column>
</Grid>

<h5>Narrow</h5>
<Grid @mode="css-grid" @narrow={{true}} as |g|>
  <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
    <g.Grid @narrow={{true}} as |sub|>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">narrow</div>
      </sub.Column>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">narrow</div>
      </sub.Column>
    </g.Grid>
  </g.Column>
</Grid>

<h5>Condensed</h5>
<Grid @mode="css-grid" @condensed={{true}} as |g|>
  <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
    <g.Grid @condensed={{true}} as |sub|>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">condensed</div>
      </sub.Column>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">condensed</div>
      </sub.Column>
    </g.Grid>
  </g.Column>
</Grid>
*/
{
  "id": "S4cYZcv1",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"h5\"],[12],[1,\"Wide\"],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,8,16]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Grid\"]],null,null,[[\"default\"],[[[[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"wide\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"wide\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]],[1,\"\\n\\n\"],[10,\"h5\"],[12],[1,\"Narrow\"],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\",\"@narrow\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,3,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,8,16]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,3,[\"Grid\"]],null,[[\"@narrow\"],[true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,4,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"narrow\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,4,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"narrow\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[4]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[3]]]]],[1,\"\\n\\n\"],[10,\"h5\"],[12],[1,\"Condensed\"],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\",\"@condensed\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,5,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,8,16]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,5,[\"Grid\"]],null,[[\"@condensed\"],[true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,6,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"condensed\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,6,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"condensed\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[6]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[5]]]]]],[\"g\",\"sub\",\"g\",\"sub\",\"g\",\"sub\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_37 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" @withRowGap={{true}} as |g|>
  <g.Column @sm={{4}} @md={{8}} @lg={{16}}>
    <g.Grid @withRowGap={{true}} as |sub|>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">1</div>
      </sub.Column>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2</div>
      </sub.Column>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">3</div>
      </sub.Column>
      <sub.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">4</div>
      </sub.Column>
    </g.Grid>
  </g.Column>
</Grid>
*/
{
  "id": "EtKwcSPc",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\",\"@withRowGap\"],[\"css-grid\",true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,8,16]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Grid\"]],null,[[\"@withRowGap\"],[true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"1\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"2\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"3\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,8]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"4\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\",\"sub\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_38 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Grid @mode="css-grid" as |g|>
  <g.Column @span={{8}}>
    <g.Grid @narrow={{true}} as |sub|>
      <sub.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
        <sub.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text</sub.ColumnHang>
      </sub.Column>
      <sub.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
        <sub.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text</sub.ColumnHang>
      </sub.Column>
      <sub.Column @span={{4}}>
        <sub.Grid @condensed={{true}} as |inner|>
          <inner.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
            <inner.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text</inner.ColumnHang>
          </inner.Column>
          <inner.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
            <inner.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text</inner.ColumnHang>
          </inner.Column>
        </sub.Grid>
      </sub.Column>
    </g.Grid>
  </g.Column>
</Grid>
*/
{
  "id": "X5k1NgVF",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Column\"]],null,[[\"@span\"],[8]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Grid\"]],null,[[\"@narrow\"],[true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,2,[\"Column\"]],[[24,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"]],null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"ColumnHang\"]],[[24,5,\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\"]],null,[[\"default\"],[[[[1,\"Text\"]],[]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],[[24,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"]],null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"ColumnHang\"]],[[24,5,\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\"]],null,[[\"default\"],[[[[1,\"Text\"]],[]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n      \"],[8,[30,2,[\"Column\"]],null,[[\"@span\"],[4]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"Grid\"]],null,[[\"@condensed\"],[true]],[[\"default\"],[[[[1,\"\\n          \"],[8,[30,3,[\"Column\"]],[[24,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"]],null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3,[\"ColumnHang\"]],[[24,5,\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\"]],null,[[\"default\"],[[[[1,\"Text\"]],[]]]]],[1,\"\\n          \"]],[]]]]],[1,\"\\n          \"],[8,[30,3,[\"Column\"]],[[24,5,\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\"]],null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3,[\"ColumnHang\"]],[[24,5,\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\"]],null,[[\"default\"],[[[[1,\"Text\"]],[]]]]],[1,\"\\n          \"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\",\"sub\",\"inner\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Grid],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const Box = setComponentTemplate(templateFactory(
/*
  <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
  {{yield}}
</div>
*/
{
  "id": "XFLQQLhU",
  "block": "[[[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Box"));
const Frame = setComponentTemplate(templateFactory(
/*
  <div style="width: 110rem; outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px; overflow-x: auto;">
  {{yield}}
</div>
*/
{
  "id": "2DT88Y73",
  "block": "[[[10,0],[14,5,\"width: 110rem; outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px; overflow-x: auto;\"],[12],[1,\"\\n  \"],[18,1,null],[1,\"\\n\"],[13]],[\"&default\"],[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs:Frame"));
const repl_39 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<h5>start</h5>
<Frame>
  <Grid @mode="css-grid" @align="start" as |g|>
    <g.Column @sm={{4}}><Box>Column</Box></g.Column>
  </Grid>
</Frame>
<br />
<h5>end</h5>
<Frame>
  <Grid @mode="css-grid" @align="end" as |g|>
    <g.Column @sm={{4}}><Box>Column</Box></g.Column>
  </Grid>
</Frame>
*/
{
  "id": "uycZI5Ue",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"h5\"],[12],[1,\"start\"],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@mode\",\"@align\"],[\"css-grid\",\"start\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column\"]],[]]]]]],[]]]]],[1,\"\\n  \"]],[1]]]]],[1,\"\\n\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"h5\"],[12],[1,\"end\"],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@mode\",\"@align\"],[\"css-grid\",\"end\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2,[\"Column\"]],null,[[\"@sm\"],[4]],[[\"default\"],[[[[8,[32,3],null,null,[[\"default\"],[[[[1,\"Column\"]],[]]]]]],[]]]]],[1,\"\\n  \"]],[2]]]]],[1,\"\\n\"]],[]]]]]],[\"g\",\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Frame, Grid, Box],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_40 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<GridSettings @mode="css-grid" as |g|>
  <g.Grid>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 1</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 2</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 3</div>
    </g.Column>
    <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
      <div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 4</div>
    </g.Column>
  </g.Grid>
</GridSettings>
*/
{
  "id": "i/51NQOW",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@mode\"],[\"css-grid\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Grid\"]],null,null,[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n      \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 1\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n      \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 2\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n      \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 3\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Column\"]],null,[[\"@sm\",\"@md\",\"@lg\"],[4,4,4]],[[\"default\"],[[[[1,\"\\n      \"],[10,0],[14,5,\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\"],[12],[1,\"Column 4\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"g\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, GridSettings],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_41 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/grid'
  @name='default'
/>
*/
{
  "id": "O3dGHQAl",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/grid\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_42 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/grid/row'
  @name='default'
/>
*/
{
  "id": "VAQUUq8T",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/grid/row\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_43 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/grid/column'
  @name='default'
/>
*/
{
  "id": "WRWVTxv9",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/grid/column\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_44 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/grid/column-hang'
  @name='default'
/>
*/
{
  "id": "McRCjTZq",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/grid/column-hang\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const repl_45 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/grid/settings'
  @name='default'
/>
*/
{
  "id": "8VHZXvO1",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/grid/settings\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

const grid_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="grid">Grid</h1>
<ThemeSwitcher />
<p>The 2x Grid is a flexible, 16-column grid system that can be used to build
custom layouts. Carbon ships two layout engines for it, and <code>Grid</code> renders
either one:</p>
<ul>
<li><strong>Flexbox grid</strong> (the default, <code>@mode="flexbox"</code>) — a <code>Grid</code> renders one
or more <code>GridRow</code>s, and each <code>GridRow</code> renders one or more <code>GridColumn</code>s.</li>
<li><strong>CSS Grid</strong> (<code>@mode="css-grid"</code>) — there are no rows; columns are
direct children of the <code>Grid</code>. This mode additionally supports subgrids,
percentage spans, and explicit <code>start</code>/<code>end</code> placement.</li>
</ul>
<p><code>Grid</code> yields <code>Grid</code>, <code>Column</code>, <code>Row</code> and <code>ColumnHang</code> components that are
already bound to the surrounding grid's mode, so the mode is only picked once.</p>
<h2 id="flexbox-grid">Flexbox grid</h2>
<carbon-shadow-demo id="repl_26" class="repl-sdk__demo"><div><repl_26></repl_26></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid, GridRow, GridColumn } from 'carbon-components-ember/components';

const Box = &#x3C;template>
  &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid>
    &#x3C;GridRow>
      &#x3C;GridColumn>&#x3C;Box>Column 1&#x3C;/Box>&#x3C;/GridColumn>
      &#x3C;GridColumn>&#x3C;Box>Column 2&#x3C;/Box>&#x3C;/GridColumn>
      &#x3C;GridColumn>&#x3C;Box>Column 3&#x3C;/Box>&#x3C;/GridColumn>
      &#x3C;GridColumn>&#x3C;Box>Column 4&#x3C;/Box>&#x3C;/GridColumn>
    &#x3C;/GridRow>
  &#x3C;/Grid>

  &#x3C;br />
  &#x3C;br />

  &#x3C;Grid>
    &#x3C;GridRow>
      &#x3C;GridColumn @sm=\{{2}} @md=\{{4}} @lg=\{{6}}>
        &#x3C;Box>Span 2 of 4 / 4 of 8 / 6 of 16&#x3C;/Box>
      &#x3C;/GridColumn>
      &#x3C;GridColumn @sm=\{{2}} @md=\{{4}} @lg=\{{10}}>
        &#x3C;Box>Span 2 of 4 / 4 of 8 / 10 of 16&#x3C;/Box>
      &#x3C;/GridColumn>
    &#x3C;/GridRow>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<p><code>FlexGrid</code> is available as an explicit, always-flexbox alias of <code>Grid</code>, for
parity with Carbon React.</p>
<h3 id="column-span-shorthand">Column span shorthand</h3>
<p><code>GridColumn</code> accepts a value for each breakpoint (<code>sm</code>, <code>md</code>, <code>lg</code>, <code>xlg</code>,
<code>max</code>):</p>
<ul>
<li><code>true</code> — the column takes up an equal share of the remaining space</li>
<li>a <code>number</code> — the column spans that many columns</li>
<li>an object like <code>\{{hash span=4 offset=2}}</code> — the column spans <code>span</code>
columns and is offset by <code>offset</code> columns</li>
</ul>
<p>In <code>css-grid</code> mode a column additionally accepts a percentage (<code>'25%'</code>,
<code>'50%'</code>, <code>'75%'</code>, <code>'100%'</code>) and <code>start</code>/<code>end</code> grid lines.</p>
<h2 id="css-grid">CSS Grid</h2>
<p>Pass <code>@mode="css-grid"</code> and render the yielded <code>Column</code> directly — the
CSS Grid has no row element.</p>
<carbon-shadow-demo id="repl_27" class="repl-sdk__demo"><div><repl_27></repl_27></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';

const Box = &#x3C;template>
  &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;
const Frame = &#x3C;template>
  &#x3C;div style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Frame>
    &#x3C;Grid @mode="css-grid" as |g|>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 1&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 2&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 3&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 4&#x3C;/Box>&#x3C;/g.Column>
    &#x3C;/Grid>
  &#x3C;/Frame>
&#x3C;/template>
</code></pre></div>
<h3 id="narrow">Narrow</h3>
<p>The container hangs 16px into the gutter, which is useful for typographic
alignment with and without containers. The dashed outline below marks the
true edge of the grid, so it's easy to see that narrow halves the gutter
between columns and lets the first/last column touch the edge, compared to
the default grid above.</p>
<carbon-shadow-demo id="repl_28" class="repl-sdk__demo"><div><repl_28></repl_28></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';

const Box = &#x3C;template>
  &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;
const Frame = &#x3C;template>
  &#x3C;div style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Frame>
    &#x3C;Grid @mode="css-grid" @narrow=\{{true}} as |g|>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 1&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 2&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 3&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 4&#x3C;/Box>&#x3C;/g.Column>
    &#x3C;/Grid>
  &#x3C;/Frame>
&#x3C;/template>
</code></pre></div>
<h3 id="condensed">Condensed</h3>
<p>Collapses the gutter to 1px, which is useful for fluid layouts. Compare the
near-touching columns below to the wide gutter in the default grid, and the
still-visible gutter of the narrow grid above.</p>
<carbon-shadow-demo id="repl_29" class="repl-sdk__demo"><div><repl_29></repl_29></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';

const Box = &#x3C;template>
  &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;
const Frame = &#x3C;template>
  &#x3C;div style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Frame>
    &#x3C;Grid @mode="css-grid" @condensed=\{{true}} as |g|>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 1&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 2&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 3&#x3C;/Box>&#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column 4&#x3C;/Box>&#x3C;/g.Column>
    &#x3C;/Grid>
  &#x3C;/Frame>
&#x3C;/template>
</code></pre></div>
<h3 id="full-width">Full width</h3>
<p>Removes the default max width that the grid sets.</p>
<carbon-shadow-demo id="repl_30" class="repl-sdk__demo"><div><repl_30></repl_30></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" @fullWidth=\{{true}} as |g|>
    &#x3C;g.Column @sm=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 1&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 2&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 3&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 4&#x3C;/div>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="with-row-gap">With row gap</h3>
<p>Adds a row gap to the grid that matches the current gutter size, so columns
that wrap onto a new row get consistent vertical spacing.</p>
<carbon-shadow-demo id="repl_31" class="repl-sdk__demo"><div><repl_31></repl_31></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" @withRowGap=\{{true}} as |g|>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">1&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">3&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">4&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">5&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">6&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">7&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">8&#x3C;/div>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="responsive">Responsive</h3>
<p>Each breakpoint can span a different number of columns, or a percentage of the
grid. A span of <code>0</code> hides the column at that breakpoint.</p>
<carbon-shadow-demo id="repl_32" class="repl-sdk__demo"><div><repl_32></repl_32></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" as |g|>
    &#x3C;g.Column @sm=\{{2}} @md=\{{4}} @lg=\{{6}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Small: Span 2 of 4&#x3C;/p>
        &#x3C;p>Medium: Span 4 of 8&#x3C;/p>
        &#x3C;p>Large: Span 6 of 16&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{2}} @md=\{{2}} @lg=\{{3}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Small: Span 2 of 4&#x3C;/p>
        &#x3C;p>Medium: Span 2 of 8&#x3C;/p>
        &#x3C;p>Large: Span 3 of 16&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{0}} @md=\{{2}} @lg=\{{3}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Small: Span 0 of 4&#x3C;/p>
        &#x3C;p>Medium: Span 2 of 8&#x3C;/p>
        &#x3C;p>Large: Span 3 of 16&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{0}} @md=\{{0}} @lg=\{{4}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Small: Span 0 of 4&#x3C;/p>
        &#x3C;p>Medium: Span 0 of 8&#x3C;/p>
        &#x3C;p>Large: Span 4 of 16&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm="25%" @md="50%" @lg="75%">
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Small: Span 25%&#x3C;/p>
        &#x3C;p>Medium: Span 50%&#x3C;/p>
        &#x3C;p>Large: Span 75%&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="offset">Offset</h3>
<p>Pass an object with <code>span</code> and <code>offset</code> to push a column to the right.</p>
<carbon-shadow-demo id="repl_33" class="repl-sdk__demo"><div><repl_33></repl_33></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { hash } from '@ember/helper';
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" as |g|>
    &#x3C;g.Column
      @sm=\{{hash span=1 offset=3}}
      @md=\{{hash span=2 offset=6}}
      @lg=\{{hash span=4 offset=12}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">offset&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column
      @sm=\{{hash span=2 offset=2}}
      @md=\{{hash span=4 offset=4}}
      @lg=\{{hash span=8 offset=8}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">offset&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column
      @sm=\{{hash span=3 offset=1}}
      @md=\{{hash span=6 offset=2}}
      @lg=\{{hash span=12 offset=4}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">offset&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{hash span=4}} @md=\{{hash span=8}} @lg=\{{hash span=16}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">no offset&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column
      @sm=\{{hash span="25%" offset=1}}
      @md=\{{hash span="50%" offset=2}}
      @lg=\{{hash span="75%" offset=4}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">percentage span&#x3C;/div>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="start-and-end">Start and end</h3>
<p>Instead of an offset, a column can be placed on explicit grid lines with
<code>start</code> and <code>end</code>.</p>
<carbon-shadow-demo id="repl_34" class="repl-sdk__demo"><div><repl_34></repl_34></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { hash } from '@ember/helper';
import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" as |g|>
    &#x3C;g.Column
      @sm=\{{hash span=1 start=4}}
      @md=\{{hash span=2 start=7}}
      @lg=\{{hash span=4 start=13}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">span, start&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column
      @sm=\{{hash span=2 end=5}}
      @md=\{{hash span=4 end=9}}
      @lg=\{{hash span=8 end=17}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">span, end&#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column
      @sm=\{{hash start=1 end=4}}
      @md=\{{hash start=3 end=9}}
      @lg=\{{hash start=5 end=17}}
    >
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">start, end&#x3C;/div>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="subgrid">Subgrid</h3>
<p>A <code>Grid</code> nested inside a CSS Grid renders as a subgrid, inheriting the column
tracks of its parent instead of starting a new grid.</p>
<carbon-shadow-demo id="repl_35" class="repl-sdk__demo"><div><repl_35></repl_35></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" as |g|>
    &#x3C;g.Column @sm=\{{2}} @md=\{{4}} @lg=\{{3}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Small: Span 2 of 4&#x3C;/p>
        &#x3C;p>Medium: Span 4 of 8&#x3C;/p>
        &#x3C;p>Large: Span 3 of 16&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{2}} @md=\{{4}} @lg=\{{10}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Large: Span 10 of 16, containing a subgrid:&#x3C;/p>
      &#x3C;/div>
      &#x3C;g.Grid as |sub|>
        &#x3C;sub.Column @sm=\{{1}} @md=\{{1}} @lg=\{{2}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2 of 10&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{1}} @md=\{{1}} @lg=\{{2}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2 of 10&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{0}} @md=\{{1}} @lg=\{{2}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2 of 10&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{0}} @md=\{{1}} @lg=\{{4}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">4 of 10&#x3C;/div>
        &#x3C;/sub.Column>
      &#x3C;/g.Grid>
    &#x3C;/g.Column>
    &#x3C;g.Column @sm=\{{0}} @md=\{{0}} @lg=\{{3}}>
      &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">
        &#x3C;p>Large: Span 3 of 16&#x3C;/p>
      &#x3C;/div>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<p>A subgrid picks up its own gutter mode from <code>@narrow</code> / <code>@condensed</code>, so wide,
narrow and condensed subgrids can be mixed on the same page.</p>
<carbon-shadow-demo id="repl_36" class="repl-sdk__demo"><div><repl_36></repl_36></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;h5>Wide&#x3C;/h5>
  &#x3C;Grid @mode="css-grid" as |g|>
    &#x3C;g.Column @sm=\{{4}} @md=\{{8}} @lg=\{{16}}>
      &#x3C;g.Grid as |sub|>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">wide&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">wide&#x3C;/div>
        &#x3C;/sub.Column>
      &#x3C;/g.Grid>
    &#x3C;/g.Column>
  &#x3C;/Grid>

  &#x3C;h5>Narrow&#x3C;/h5>
  &#x3C;Grid @mode="css-grid" @narrow=\{{true}} as |g|>
    &#x3C;g.Column @sm=\{{4}} @md=\{{8}} @lg=\{{16}}>
      &#x3C;g.Grid @narrow=\{{true}} as |sub|>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">narrow&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">narrow&#x3C;/div>
        &#x3C;/sub.Column>
      &#x3C;/g.Grid>
    &#x3C;/g.Column>
  &#x3C;/Grid>

  &#x3C;h5>Condensed&#x3C;/h5>
  &#x3C;Grid @mode="css-grid" @condensed=\{{true}} as |g|>
    &#x3C;g.Column @sm=\{{4}} @md=\{{8}} @lg=\{{16}}>
      &#x3C;g.Grid @condensed=\{{true}} as |sub|>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">condensed&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">condensed&#x3C;/div>
        &#x3C;/sub.Column>
      &#x3C;/g.Grid>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="subgrid-with-row-gap">Subgrid with row gap</h3>
<p><code>@withRowGap</code> works on subgrids too.</p>
<carbon-shadow-demo id="repl_37" class="repl-sdk__demo"><div><repl_37></repl_37></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" @withRowGap=\{{true}} as |g|>
    &#x3C;g.Column @sm=\{{4}} @md=\{{8}} @lg=\{{16}}>
      &#x3C;g.Grid @withRowGap=\{{true}} as |sub|>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">1&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">2&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">3&#x3C;/div>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @sm=\{{4}} @md=\{{4}} @lg=\{{8}}>
          &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">4&#x3C;/div>
        &#x3C;/sub.Column>
      &#x3C;/g.Grid>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="mixed-gutter-modes">Mixed gutter modes</h3>
<p><code>ColumnHang</code> renders content that hangs into the gutter, so text stays aligned
across grids that use different gutter modes.</p>
<p>The dashed outline below marks each column's true boundary, so the shaded
"Text" hang is visibly offset from it — by half a gutter in the narrow
subgrid, and by nearly a full gutter in the condensed one.</p>
<carbon-shadow-demo id="repl_38" class="repl-sdk__demo"><div><repl_38></repl_38></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Grid @mode="css-grid" as |g|>
    &#x3C;g.Column @span=\{{8}}>
      &#x3C;g.Grid @narrow=\{{true}} as |sub|>
        &#x3C;sub.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
          &#x3C;sub.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text&#x3C;/sub.ColumnHang>
        &#x3C;/sub.Column>
        &#x3C;sub.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
          &#x3C;sub.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text&#x3C;/sub.ColumnHang>
        &#x3C;/sub.Column>
        &#x3C;sub.Column @span=\{{4}}>
          &#x3C;sub.Grid @condensed=\{{true}} as |inner|>
            &#x3C;inner.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
              &#x3C;inner.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text&#x3C;/inner.ColumnHang>
            &#x3C;/inner.Column>
            &#x3C;inner.Column style="outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;">
              &#x3C;inner.ColumnHang style="display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);">Text&#x3C;/inner.ColumnHang>
            &#x3C;/inner.Column>
          &#x3C;/sub.Grid>
        &#x3C;/sub.Column>
      &#x3C;/g.Grid>
    &#x3C;/g.Column>
  &#x3C;/Grid>
&#x3C;/template>
</code></pre></div>
<h3 id="alignment">Alignment</h3>
<p><code>@align</code> positions the grid within its container. It defaults to <code>center</code> and
only applies in <code>css-grid</code> mode.</p>
<p><code>@align</code> only has room to move the grid once its container is wider than the
grid's own max width, so the examples below are placed in an artificially
wide, dashed-outline container that's wider than the grid itself.</p>
<carbon-shadow-demo id="repl_39" class="repl-sdk__demo"><div><repl_39></repl_39></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Grid } from 'carbon-components-ember/components';

const Box = &#x3C;template>
  &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;
const Frame = &#x3C;template>
  &#x3C;div style="width: 110rem; outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px; overflow-x: auto;">
    \{{yield}}
  &#x3C;/div>
&#x3C;/template>;

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;h5>start&#x3C;/h5>
  &#x3C;Frame>
    &#x3C;Grid @mode="css-grid" @align="start" as |g|>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column&#x3C;/Box>&#x3C;/g.Column>
    &#x3C;/Grid>
  &#x3C;/Frame>
  &#x3C;br />
  &#x3C;h5>end&#x3C;/h5>
  &#x3C;Frame>
    &#x3C;Grid @mode="css-grid" @align="end" as |g|>
      &#x3C;g.Column @sm=\{{4}}>&#x3C;Box>Column&#x3C;/Box>&#x3C;/g.Column>
    &#x3C;/Grid>
  &#x3C;/Frame>
&#x3C;/template>
</code></pre></div>
<h3 id="grid-settings">GridSettings</h3>
<p><code>GridSettings</code> renders no markup of its own. It yields <code>Grid</code>, <code>Column</code>, <code>Row</code>
and <code>ColumnHang</code> already bound to a mode, which is handy when a whole section
of an app should share one grid mode. Passing <code>@subgrid=\{{true}}</code> makes the
yielded <code>Grid</code> render as a subgrid of a surrounding CSS Grid.</p>
<carbon-shadow-demo id="repl_40" class="repl-sdk__demo"><div><repl_40></repl_40></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { GridSettings } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;GridSettings @mode="css-grid" as |g|>
    &#x3C;g.Grid>
      &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
        &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 1&#x3C;/div>
      &#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
        &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 2&#x3C;/div>
      &#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
        &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 3&#x3C;/div>
      &#x3C;/g.Column>
      &#x3C;g.Column @sm=\{{4}} @md=\{{4}} @lg=\{{4}}>
        &#x3C;div style="padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)">Column 4&#x3C;/div>
      &#x3C;/g.Column>
    &#x3C;/g.Grid>
  &#x3C;/GridSettings>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Grid</h3></summary>
<div id="repl_41" class="repl-sdk__demo"><repl_41></repl_41></div>
</details>
<details>
<summary><h3>GridRow</h3></summary>
<div id="repl_42" class="repl-sdk__demo"><repl_42></repl_42></div>
</details>
<details>
<summary><h3>GridColumn</h3></summary>
<div id="repl_43" class="repl-sdk__demo"><repl_43></repl_43></div>
</details>
<details>
<summary><h3>GridColumnHang</h3></summary>
<div id="repl_44" class="repl-sdk__demo"><repl_44></repl_44></div>
</details>
<details>
<summary><h3>GridSettings</h3></summary>
<div id="repl_45" class="repl-sdk__demo"><repl_45></repl_45></div>
</details>
*/
{
  "id": "zAg1VcKb",
  "block": "[[[10,\"h1\"],[14,1,\"grid\"],[12],[1,\"Grid\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"The 2x Grid is a flexible, 16-column grid system that can be used to build\\ncustom layouts. Carbon ships two layout engines for it, and \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\" renders\\neither one:\"],[13],[1,\"\\n\"],[10,\"ul\"],[12],[1,\"\\n\"],[10,\"li\"],[12],[10,\"strong\"],[12],[1,\"Flexbox grid\"],[13],[1,\" (the default, \"],[10,\"code\"],[12],[1,\"@mode=\\\"flexbox\\\"\"],[13],[1,\") — a \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\" renders one\\nor more \"],[10,\"code\"],[12],[1,\"GridRow\"],[13],[1,\"s, and each \"],[10,\"code\"],[12],[1,\"GridRow\"],[13],[1,\" renders one or more \"],[10,\"code\"],[12],[1,\"GridColumn\"],[13],[1,\"s.\"],[13],[1,\"\\n\"],[10,\"li\"],[12],[10,\"strong\"],[12],[1,\"CSS Grid\"],[13],[1,\" (\"],[10,\"code\"],[12],[1,\"@mode=\\\"css-grid\\\"\"],[13],[1,\") — there are no rows; columns are\\ndirect children of the \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\". This mode additionally supports subgrids,\\npercentage spans, and explicit \"],[10,\"code\"],[12],[1,\"start\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"end\"],[13],[1,\" placement.\"],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\" yields \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"Column\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"Row\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"ColumnHang\"],[13],[1,\" components that are\\nalready bound to the surrounding grid's mode, so the mode is only picked once.\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"flexbox-grid\"],[12],[1,\"Flexbox grid\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_26\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid, GridRow, GridColumn } from 'carbon-components-ember/components';\\n\\nconst Box = <template>\\n  <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid>\\n    <GridRow>\\n      <GridColumn><Box>Column 1</Box></GridColumn>\\n      <GridColumn><Box>Column 2</Box></GridColumn>\\n      <GridColumn><Box>Column 3</Box></GridColumn>\\n      <GridColumn><Box>Column 4</Box></GridColumn>\\n    </GridRow>\\n  </Grid>\\n\\n  <br />\\n  <br />\\n\\n  <Grid>\\n    <GridRow>\\n      <GridColumn @sm=\"],[1,\"{{2}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{6}}>\\n        <Box>Span 2 of 4 / 4 of 8 / 6 of 16</Box>\\n      </GridColumn>\\n      <GridColumn @sm=\"],[1,\"{{2}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{10}}>\\n        <Box>Span 2 of 4 / 4 of 8 / 10 of 16</Box>\\n      </GridColumn>\\n    </GridRow>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"FlexGrid\"],[13],[1,\" is available as an explicit, always-flexbox alias of \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\", for\\nparity with Carbon React.\"],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"column-span-shorthand\"],[12],[1,\"Column span shorthand\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"GridColumn\"],[13],[1,\" accepts a value for each breakpoint (\"],[10,\"code\"],[12],[1,\"sm\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"md\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"lg\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"xlg\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"max\"],[13],[1,\"):\"],[13],[1,\"\\n\"],[10,\"ul\"],[12],[1,\"\\n\"],[10,\"li\"],[12],[10,\"code\"],[12],[1,\"true\"],[13],[1,\" — the column takes up an equal share of the remaining space\"],[13],[1,\"\\n\"],[10,\"li\"],[12],[1,\"a \"],[10,\"code\"],[12],[1,\"number\"],[13],[1,\" — the column spans that many columns\"],[13],[1,\"\\n\"],[10,\"li\"],[12],[1,\"an object like \"],[10,\"code\"],[12],[1,\"{{hash span=4 offset=2}}\"],[13],[1,\" — the column spans \"],[10,\"code\"],[12],[1,\"span\"],[13],[1,\"\\ncolumns and is offset by \"],[10,\"code\"],[12],[1,\"offset\"],[13],[1,\" columns\"],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"In \"],[10,\"code\"],[12],[1,\"css-grid\"],[13],[1,\" mode a column additionally accepts a percentage (\"],[10,\"code\"],[12],[1,\"'25%'\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"'50%'\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"'75%'\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"'100%'\"],[13],[1,\") and \"],[10,\"code\"],[12],[1,\"start\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"end\"],[13],[1,\" grid lines.\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"css-grid\"],[12],[1,\"CSS Grid\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Pass \"],[10,\"code\"],[12],[1,\"@mode=\\\"css-grid\\\"\"],[13],[1,\" and render the yielded \"],[10,\"code\"],[12],[1,\"Column\"],[13],[1,\" directly — the\\nCSS Grid has no row element.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_27\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n\\nconst Box = <template>\\n  <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\nconst Frame = <template>\\n  <div style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Frame>\\n    <Grid @mode=\\\"css-grid\\\" as |g|>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 1</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 2</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 3</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 4</Box></g.Column>\\n    </Grid>\\n  </Frame>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"narrow\"],[12],[1,\"Narrow\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The container hangs 16px into the gutter, which is useful for typographic\\nalignment with and without containers. The dashed outline below marks the\\ntrue edge of the grid, so it's easy to see that narrow halves the gutter\\nbetween columns and lets the first/last column touch the edge, compared to\\nthe default grid above.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_28\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n\\nconst Box = <template>\\n  <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\nconst Frame = <template>\\n  <div style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Frame>\\n    <Grid @mode=\\\"css-grid\\\" @narrow=\"],[1,\"{{true}} as |g|>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 1</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 2</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 3</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 4</Box></g.Column>\\n    </Grid>\\n  </Frame>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"condensed\"],[12],[1,\"Condensed\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Collapses the gutter to 1px, which is useful for fluid layouts. Compare the\\nnear-touching columns below to the wide gutter in the default grid, and the\\nstill-visible gutter of the narrow grid above.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_29\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n\\nconst Box = <template>\\n  <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\nconst Frame = <template>\\n  <div style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Frame>\\n    <Grid @mode=\\\"css-grid\\\" @condensed=\"],[1,\"{{true}} as |g|>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 1</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 2</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 3</Box></g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column 4</Box></g.Column>\\n    </Grid>\\n  </Frame>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"full-width\"],[12],[1,\"Full width\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Removes the default max width that the grid sets.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_30\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" @fullWidth=\"],[1,\"{{true}} as |g|>\\n    <g.Column @sm=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 1</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 2</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 3</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 4</div>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"with-row-gap\"],[12],[1,\"With row gap\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Adds a row gap to the grid that matches the current gutter size, so columns\\nthat wrap onto a new row get consistent vertical spacing.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_31\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" @withRowGap=\"],[1,\"{{true}} as |g|>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">1</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">2</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">3</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">4</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">5</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">6</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">7</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">8</div>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"responsive\"],[12],[1,\"Responsive\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Each breakpoint can span a different number of columns, or a percentage of the\\ngrid. A span of \"],[10,\"code\"],[12],[1,\"0\"],[13],[1,\" hides the column at that breakpoint.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_32\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,7],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" as |g|>\\n    <g.Column @sm=\"],[1,\"{{2}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{6}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Small: Span 2 of 4</p>\\n        <p>Medium: Span 4 of 8</p>\\n        <p>Large: Span 6 of 16</p>\\n      </div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{2}} @md=\"],[1,\"{{2}} @lg=\"],[1,\"{{3}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Small: Span 2 of 4</p>\\n        <p>Medium: Span 2 of 8</p>\\n        <p>Large: Span 3 of 16</p>\\n      </div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{0}} @md=\"],[1,\"{{2}} @lg=\"],[1,\"{{3}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Small: Span 0 of 4</p>\\n        <p>Medium: Span 2 of 8</p>\\n        <p>Large: Span 3 of 16</p>\\n      </div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{0}} @md=\"],[1,\"{{0}} @lg=\"],[1,\"{{4}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Small: Span 0 of 4</p>\\n        <p>Medium: Span 0 of 8</p>\\n        <p>Large: Span 4 of 16</p>\\n      </div>\\n    </g.Column>\\n    <g.Column @sm=\\\"25%\\\" @md=\\\"50%\\\" @lg=\\\"75%\\\">\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Small: Span 25%</p>\\n        <p>Medium: Span 50%</p>\\n        <p>Large: Span 75%</p>\\n      </div>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"offset\"],[12],[1,\"Offset\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Pass an object with \"],[10,\"code\"],[12],[1,\"span\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"offset\"],[13],[1,\" to push a column to the right.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_33\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,8],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { hash } from '@ember/helper';\\nimport { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" as |g|>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash span=1 offset=3}}\\n      @md=\"],[1,\"{{hash span=2 offset=6}}\\n      @lg=\"],[1,\"{{hash span=4 offset=12}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">offset</div>\\n    </g.Column>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash span=2 offset=2}}\\n      @md=\"],[1,\"{{hash span=4 offset=4}}\\n      @lg=\"],[1,\"{{hash span=8 offset=8}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">offset</div>\\n    </g.Column>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash span=3 offset=1}}\\n      @md=\"],[1,\"{{hash span=6 offset=2}}\\n      @lg=\"],[1,\"{{hash span=12 offset=4}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">offset</div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{hash span=4}} @md=\"],[1,\"{{hash span=8}} @lg=\"],[1,\"{{hash span=16}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">no offset</div>\\n    </g.Column>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash span=\\\"25%\\\" offset=1}}\\n      @md=\"],[1,\"{{hash span=\\\"50%\\\" offset=2}}\\n      @lg=\"],[1,\"{{hash span=\\\"75%\\\" offset=4}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">percentage span</div>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"start-and-end\"],[12],[1,\"Start and end\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Instead of an offset, a column can be placed on explicit grid lines with\\n\"],[10,\"code\"],[12],[1,\"start\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"end\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_34\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,9],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { hash } from '@ember/helper';\\nimport { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" as |g|>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash span=1 start=4}}\\n      @md=\"],[1,\"{{hash span=2 start=7}}\\n      @lg=\"],[1,\"{{hash span=4 start=13}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">span, start</div>\\n    </g.Column>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash span=2 end=5}}\\n      @md=\"],[1,\"{{hash span=4 end=9}}\\n      @lg=\"],[1,\"{{hash span=8 end=17}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">span, end</div>\\n    </g.Column>\\n    <g.Column\\n      @sm=\"],[1,\"{{hash start=1 end=4}}\\n      @md=\"],[1,\"{{hash start=3 end=9}}\\n      @lg=\"],[1,\"{{hash start=5 end=17}}\\n    >\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">start, end</div>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"subgrid\"],[12],[1,\"Subgrid\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"A \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\" nested inside a CSS Grid renders as a subgrid, inheriting the column\\ntracks of its parent instead of starting a new grid.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_35\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,10],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" as |g|>\\n    <g.Column @sm=\"],[1,\"{{2}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{3}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Small: Span 2 of 4</p>\\n        <p>Medium: Span 4 of 8</p>\\n        <p>Large: Span 3 of 16</p>\\n      </div>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{2}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{10}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Large: Span 10 of 16, containing a subgrid:</p>\\n      </div>\\n      <g.Grid as |sub|>\\n        <sub.Column @sm=\"],[1,\"{{1}} @md=\"],[1,\"{{1}} @lg=\"],[1,\"{{2}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">2 of 10</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{1}} @md=\"],[1,\"{{1}} @lg=\"],[1,\"{{2}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">2 of 10</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{0}} @md=\"],[1,\"{{1}} @lg=\"],[1,\"{{2}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">2 of 10</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{0}} @md=\"],[1,\"{{1}} @lg=\"],[1,\"{{4}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-02); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">4 of 10</div>\\n        </sub.Column>\\n      </g.Grid>\\n    </g.Column>\\n    <g.Column @sm=\"],[1,\"{{0}} @md=\"],[1,\"{{0}} @lg=\"],[1,\"{{3}}>\\n      <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">\\n        <p>Large: Span 3 of 16</p>\\n      </div>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,2],[12],[1,\"A subgrid picks up its own gutter mode from \"],[10,\"code\"],[12],[1,\"@narrow\"],[13],[1,\" / \"],[10,\"code\"],[12],[1,\"@condensed\"],[13],[1,\", so wide,\\nnarrow and condensed subgrids can be mixed on the same page.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_36\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,11],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <h5>Wide</h5>\\n  <Grid @mode=\\\"css-grid\\\" as |g|>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{8}} @lg=\"],[1,\"{{16}}>\\n      <g.Grid as |sub|>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">wide</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">wide</div>\\n        </sub.Column>\\n      </g.Grid>\\n    </g.Column>\\n  </Grid>\\n\\n  <h5>Narrow</h5>\\n  <Grid @mode=\\\"css-grid\\\" @narrow=\"],[1,\"{{true}} as |g|>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{8}} @lg=\"],[1,\"{{16}}>\\n      <g.Grid @narrow=\"],[1,\"{{true}} as |sub|>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">narrow</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">narrow</div>\\n        </sub.Column>\\n      </g.Grid>\\n    </g.Column>\\n  </Grid>\\n\\n  <h5>Condensed</h5>\\n  <Grid @mode=\\\"css-grid\\\" @condensed=\"],[1,\"{{true}} as |g|>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{8}} @lg=\"],[1,\"{{16}}>\\n      <g.Grid @condensed=\"],[1,\"{{true}} as |sub|>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">condensed</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">condensed</div>\\n        </sub.Column>\\n      </g.Grid>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"subgrid-with-row-gap\"],[12],[1,\"Subgrid with row gap\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@withRowGap\"],[13],[1,\" works on subgrids too.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_37\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,12],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" @withRowGap=\"],[1,\"{{true}} as |g|>\\n    <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{8}} @lg=\"],[1,\"{{16}}>\\n      <g.Grid @withRowGap=\"],[1,\"{{true}} as |sub|>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">1</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">2</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">3</div>\\n        </sub.Column>\\n        <sub.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{8}}>\\n          <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">4</div>\\n        </sub.Column>\\n      </g.Grid>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"mixed-gutter-modes\"],[12],[1,\"Mixed gutter modes\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"ColumnHang\"],[13],[1,\" renders content that hangs into the gutter, so text stays aligned\\nacross grids that use different gutter modes.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The dashed outline below marks each column's true boundary, so the shaded\\n\\\"Text\\\" hang is visibly offset from it — by half a gutter in the narrow\\nsubgrid, and by nearly a full gutter in the condensed one.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_38\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,13],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Grid @mode=\\\"css-grid\\\" as |g|>\\n    <g.Column @span=\"],[1,\"{{8}}>\\n      <g.Grid @narrow=\"],[1,\"{{true}} as |sub|>\\n        <sub.Column style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n          <sub.ColumnHang style=\\\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\\\">Text</sub.ColumnHang>\\n        </sub.Column>\\n        <sub.Column style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n          <sub.ColumnHang style=\\\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\\\">Text</sub.ColumnHang>\\n        </sub.Column>\\n        <sub.Column @span=\"],[1,\"{{4}}>\\n          <sub.Grid @condensed=\"],[1,\"{{true}} as |inner|>\\n            <inner.Column style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n              <inner.ColumnHang style=\\\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\\\">Text</inner.ColumnHang>\\n            </inner.Column>\\n            <inner.Column style=\\\"outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px;\\\">\\n              <inner.ColumnHang style=\\\"display: inline-block; padding: .25rem .5rem; background: var(--cds-layer-01);\\\">Text</inner.ColumnHang>\\n            </inner.Column>\\n          </sub.Grid>\\n        </sub.Column>\\n      </g.Grid>\\n    </g.Column>\\n  </Grid>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"alignment\"],[12],[1,\"Alignment\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@align\"],[13],[1,\" positions the grid within its container. It defaults to \"],[10,\"code\"],[12],[1,\"center\"],[13],[1,\" and\\nonly applies in \"],[10,\"code\"],[12],[1,\"css-grid\"],[13],[1,\" mode.\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@align\"],[13],[1,\" only has room to move the grid once its container is wider than the\\ngrid's own max width, so the examples below are placed in an artificially\\nwide, dashed-outline container that's wider than the grid itself.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_39\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,14],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Grid } from 'carbon-components-ember/components';\\n\\nconst Box = <template>\\n  <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0); text-align: center;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\nconst Frame = <template>\\n  <div style=\\\"width: 110rem; outline: 1px dashed var(--cds-border-strong-01, #8d8d8d); outline-offset: -1px; overflow-x: auto;\\\">\\n    \"],[1,\"{{yield}}\\n  </div>\\n</template>;\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <h5>start</h5>\\n  <Frame>\\n    <Grid @mode=\\\"css-grid\\\" @align=\\\"start\\\" as |g|>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column</Box></g.Column>\\n    </Grid>\\n  </Frame>\\n  <br />\\n  <h5>end</h5>\\n  <Frame>\\n    <Grid @mode=\\\"css-grid\\\" @align=\\\"end\\\" as |g|>\\n      <g.Column @sm=\"],[1,\"{{4}}><Box>Column</Box></g.Column>\\n    </Grid>\\n  </Frame>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h3\"],[14,1,\"grid-settings\"],[12],[1,\"GridSettings\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"GridSettings\"],[13],[1,\" renders no markup of its own. It yields \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"Column\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"Row\"],[13],[1,\"\\nand \"],[10,\"code\"],[12],[1,\"ColumnHang\"],[13],[1,\" already bound to a mode, which is handy when a whole section\\nof an app should share one grid mode. Passing \"],[10,\"code\"],[12],[1,\"@subgrid=\"],[1,\"{{true}}\"],[13],[1,\" makes the\\nyielded \"],[10,\"code\"],[12],[1,\"Grid\"],[13],[1,\" render as a subgrid of a surrounding CSS Grid.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_40\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,15],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { GridSettings } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <GridSettings @mode=\\\"css-grid\\\" as |g|>\\n    <g.Grid>\\n      <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n        <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 1</div>\\n      </g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n        <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 2</div>\\n      </g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n        <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 3</div>\\n      </g.Column>\\n      <g.Column @sm=\"],[1,\"{{4}} @md=\"],[1,\"{{4}} @lg=\"],[1,\"{{4}}>\\n        <div style=\\\"padding: .5rem; background: var(--cds-layer-01); border: 1px solid var(--cds-border-subtle-01, #e0e0e0)\\\">Column 4</div>\\n      </g.Column>\\n    </g.Grid>\\n  </GridSettings>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Grid\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_41\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,16],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"GridRow\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_42\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,17],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"GridColumn\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_43\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,18],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"GridColumnHang\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_44\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,19],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"GridSettings\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_45\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,20],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_26, repl_27, repl_28, repl_29, repl_30, repl_31, repl_32, repl_33, repl_34, repl_35, repl_36, repl_37, repl_38, repl_39, repl_40, repl_41, repl_42, repl_43, repl_44, repl_45],
  "isStrictMode": true
}), templateOnly(undefined, "grid.gjs"));

export { grid_gjs as default };
