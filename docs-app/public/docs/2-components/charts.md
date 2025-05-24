# Charts

<ThemeSwitcher />



<details open><summary><h3>Bar Chart</h3></summary>


```gjs live preview
import { ThemeSupport } from 'docs-support';
import { BarChart } from 'carbon-components-ember/components';
import { array } from '@ember/helper';

<template>
    <ThemeSupport />
    <BarChart
        style='height: 600px; width: 600px; display: inline-block'
        as |chart|
    >
        <chart.Axis
            @axis='left'
            @title='2018 Annual Sales'
            @primary={{true}}
        />
        <chart.Axis
            @axis='bottom'
            @title='Figures'
            @secondary={{true}}
            @scaleType='labels'
        />
        <chart.TabularData
            @group='Name'
            @keys={{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}
            @values={{array 65000 29123 35213 51213 16932}}
        />
    </BarChart>
</template>
```
</details>

## API Reference

<details>
<summary><h3>Bar Chart</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/charts/bar' 
    @name='default' 
  />
</template>
```
</details>


<details open><summary><h3>Line Chart</h3></summary>

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { LineChart } from 'carbon-components-ember/components';
import { array } from '@ember/helper';

<template>
  <ThemeSupport />
  <LineChart
    style='height: 600px; width: 600px; display: inline-block'
    as |chart|
  >
    <chart.Axis
      @axis='left'
      @title='2018 Annual Sales'
      @primary={{true}}
    />
    <chart.Axis
      @axis='bottom'
      @title='Figures'
      @secondary={{true}}
      @scaleType='labels'
    />
    <chart.TabularData
      @group='Name'
      @keys={{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}
      @values={{array 65000 29123 35213 51213 16932}}
    />
  </LineChart>
</template>
```
</details>


<details open><summary>Pie Chart</summary>

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { PieChart } from 'carbon-components-ember/components';
import { array } from '@ember/helper';
<template>
    <ThemeSupport />
    <PieChart
          style='height: 600px; width: 600px; display: inline-block'
          as |chart|
        >
          <chart.Axis @axis='left' @title='2018 Annual Sales' />
          <chart.Axis @axis='bottom' @title='Figures' @scaleType='labels' />
          <chart.TabularData @group='Quantity' @values={{array 65000}} />
          <chart.TabularData @group='Leads' @values={{array 29123}} />
          <chart.TabularData @group='Sold' @values={{array 35213}} />
          <chart.TabularData @group='Restocking' @values={{array 51213}} />
          <chart.TabularData @group='Misc' @values={{array 16932}} />
    </PieChart>
</template>
```
</details>
