import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { default as not } from 'ember-truth-helpers/helpers/not';
import { ChevronRight } from '../../../icons.ts';

export interface UIShellSideNavFooterSignature {
  Element: HTMLButtonElement;
  Args: {
    open?: boolean;
    onToggle: (value: boolean) => void;
  };
}

export default class UIShellSideNavFooter extends Component<UIShellSideNavFooterSignature> {
  <template>
    <button
      aria-label={{if @open 'Collapse' 'Expand'}}
      class='cds--side-nav__footer'
      type='button'
      {{on 'click' (fn @onToggle (not @open))}}
      ...attributes
    >
      <div
        class='cds--side-nav__icon cds--side-nav__icon--sm cds--side-nav__toggle
          {{if @open "cds--side-nav__icon--expanded"}}'
      >
        <ChevronRight />
      </div>
    </button>
  </template>
}
