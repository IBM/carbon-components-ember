import Component from '@glimmer/component';

export interface Signature {
  Blocks: {
    default: [];
  };
}

export default class UiShellNavItem extends Component<Signature> {
  <template>
    <li>
      <a href='#' class='cds--header__menu-item' tabindex='0'>
        <span class='cds--text-truncate--end'>
          {{yield}}
        </span>
      </a>
    </li>
  </template>
}
