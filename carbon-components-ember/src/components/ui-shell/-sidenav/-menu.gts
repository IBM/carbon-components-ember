import { default as Icon } from '../../../components/icon.gts';
import { default as newObj } from '../../../helpers/new-obj.ts';
import { on } from '@ember/modifier';
import { get, concat, fn } from '@ember/helper';
import { default as or } from 'ember-truth-helpers/helpers/or';
import Component from '@glimmer/component';
import { type IconNames } from '../../icon';
import SubMenuComponent from './-sub-menu.gts';

export type SubMenu = {
  icon: IconNames;
  title: string;
};

export interface Signature {
  Args: {
    transitionTo: () => void;
    hidden?: boolean;
    open?: boolean;
    isCurrent: boolean;
    icon: IconNames;
    title: string;
    submenus: SubMenu[];
  };
  Element: null;
  Blocks: {
    default: [typeof SubMenuComponent];
  };
}

export default class NavMenuComponent extends Component<Signature> {
  <template>
    {{#if @submenus}}
      {{#let (newObj) as |obj|}}
        <li
          class='cds--side-nav__item {{if @icon "cds--side-nav__item--icon"}}'
        >
          <button
            class='cds--side-nav__submenu'
            aria-haspopup='true'
            aria-expanded='{{or @open (get obj (concat @title "-expanded"))}}'
            type='button'
            {{on 'click' (fn (toggle (concat @title '-expanded') obj))}}
          >
            {{#if @icon}}
              <div class='cds--side-nav__icon'>
                <Icon @icon='{{@icon}}' />
              </div>
            {{/if}}
            <span class='cds--side-nav__submenu-title'>
              {{@title}}
            </span>
            <div
              class='cds--side-nav__icon cds--side-nav__icon--small cds--side-nav__submenu-chevron'
            >
              <Icon @icon='chevron--down' />
            </div>
          </button>
          {{#if (or @open (get obj (concat @title '-expanded')))}}
            <ul
              role='menu'
              class='cds--side-nav__menu'
              style='    max-height: 93.75rem; visibility: inherit;'
            >
              {{yield SubMenuComponent}}
            </ul>
          {{/if}}
        </li>
      {{/let}}
    {{else}}
      {{#unless @hidden}}
        <li class='cds--side-nav__item'>
          {{! template-lint-disable require-presentational-children }}
          <a
            href='#'
            class='cds--side-nav__link'
            aria-current='{{if @isCurrent "page"}}'
            role='button'
            {{on 'click' @transitionTo}}
          >
            {{#if @icon}}
              <div class='cds--side-nav__icon cds--side-nav__icon--small'>
                <Icon @icon='{{@icon}}' />
              </div>
            {{/if}}
            <span class='cds--side-nav__link-text'>
              {{@title}}
            </span>
          </a>
        </li>
      {{/unless}}
    {{/if}}
  </template>
}

function toggle(key: any, obj: any): any {
  obj[key] = !obj[key];
}
