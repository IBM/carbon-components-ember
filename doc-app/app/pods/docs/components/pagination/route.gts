import Demo from 'ember-cli-addon-docs/components/docs-demo';
import set from 'carbon-components-ember/helpers/set';
import Pagination from 'carbon-components-ember/components/pagination';
import Checkbox from 'carbon-components-ember/components/checkbox';
import FormInput from 'carbon-components-ember/components/form-input';
import split from '@ascua/arrays/helpers/split';
import { fn } from '@ember/helper';
import not from 'ember-truth-helpers/helpers/not';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';
import PaginationController from './controller';

interface RoutableComponent {
  Args: {
    controller: PaginationController
  }
}

class RouteComponent extends Component<RoutableComponent> {
  <template>
    <h1>
      Carbon Pagination
    </h1>

    <Demo as |demo|>
      <demo.example @name='pagination.hbs'>
        {{!import Pagination from 'carbon-components-ember/components/pagination'}}
        <Pagination
          @disabled={{@controller.disabled}}
          @isLoading={{@controller.isLoading}}
          @length={{@controller.paginationLength}}
          @itemsPerPageOptions={{split ' ' @controller.itemsPerPageOptions}}
          @onPageChanged={{set @controller 'currentSlice'}}
          @state={{@controller.currentSlice}}
        />

        <label>
          currentSlice
        </label>
        page:
        {{@controller.currentSlice.page}}<br />
        start:
        {{@controller.currentSlice.start}}<br />
        end:
        {{@controller.currentSlice.end}}<br />
        <label>
          disabled
        </label>
        <Checkbox
          @checked={{@controller.disabled}}
          @onChange={{fn (set @controller 'disabled') (not @controller.disabled)}}
        />
        <label>
          isLoading
        </label>
        <Checkbox
          @checked={{@controller.isLoading}}
          @onChange={{fn (set @controller 'isLoading') (not @controller.isLoading)}}
        />
        <label>
          itemsPerPage
        </label>
        <FormInput @onChange={{fn (set @controller 'itemsPerPageOptions')}} />
        <label>
          paginationLength
        </label>
        <FormInput @onChange={{fn (set @controller 'paginationLength')}} />
      </demo.example>
      <demo.snippet @name='pagination.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);
