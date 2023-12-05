import Demo from 'ember-cli-addon-docs/components/docs-demo';
import ProgressBar from 'carbon-components-ember/components/progress-bar';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon ProgressBar
    </h1>

    <Demo as |demo|>
      <demo.example @name='progress-bar.hbs'>
        {{!import Tile from 'carbon-components-ember/components/tile'}}

        <ProgressBar />
        <ProgressBar @status='error' @size='big' />
        <ProgressBar @status='indeterminate' />
        <ProgressBar @status='finished' @size='small' />

        <ProgressBar @value={{30}} @status='active' />
        <ProgressBar
          @label='indented'
          @value={{50}}
          @type='indented'
          @status='active'
        />
        <ProgressBar @label='inline' @value={{50}} @type='inline' />
      </demo.example>
      <demo.snippet @name='progress-bar.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
