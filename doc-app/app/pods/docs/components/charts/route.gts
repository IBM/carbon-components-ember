import Demo from 'ember-cli-addon-docs/components/docs-demo';
import BarChart from 'carbon-components-ember/components/charts/bar';
import LineChart from 'carbon-components-ember/components/charts/line';
import PieChart from 'carbon-components-ember/components/charts/pie';
import { array } from '@ember/helper';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import ChartsController from 'doc-app/pods/docs/components/charts/controller.ts';

class RouteComponent extends RoutableComponent<ChartsController> {
  <template>
    <h1>
      Carbon Charts
    </h1>

    <h2>
      Bar Chart
    </h2>
    <Demo as |demo|>
      <demo.example @name='bar-chart.hbs'>
        {{!import BarChart from 'carbon-components-ember/components/charts/bar'}}

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
      </demo.example>
      <demo.snippet @name='bar-chart.hbs' />
    </Demo>

    <h2>
      Line Chart
    </h2>
    <Demo as |demo|>
      <demo.example @name='line-chart.hbs'>
        {{!import LineChart from 'carbon-components-ember/components/charts/line'}}

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
      </demo.example>
      <demo.snippet @name='line-chart.hbs' />
    </Demo>

    <h2>
      Pie Chart
    </h2>
    <Demo as |demo|>
      <demo.example @name='pie-chart.hbs'>
        {{!import PieChart from 'carbon-components-ember/components/charts/pie'}}

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
      </demo.example>
      <demo.snippet @name='pie-chart.hbs' />
    </Demo>

    <h2>
      Sinus Chart
    </h2>
    <Demo as |demo|>
      <demo.example @name='sin-line-chart.hbs'>
        {{!import LineChart from 'carbon-components-ember/components/charts/line'}}

        <LineChart
          style='height: 600px; width: 600px; display: inline-block'
          as |chart|
        >
          <chart.Axis @axis='left' @title='y' />
          <chart.Axis @axis='bottom' @title='x' @scaleType='time' />
          <chart.TabularData @group='sinus' @data={{@controller.sinus}} />
        </LineChart>
      </demo.example>
      <demo.snippet @name='sin-line-chart.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
