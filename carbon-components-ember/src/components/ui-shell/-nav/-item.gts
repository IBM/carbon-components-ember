import type { TOC } from '@ember/component/template-only';

export interface Signature {
  Blocks: {
    default: [];
  };
}

const UIShellNavItem: TOC<Signature> = <template>
  <li>
    <a href="#" class="cds--header__menu-item" tabindex="0">
      <span class="cds--text-truncate--end">
        {{yield}}
      </span>
    </a>
  </li>
</template>;

export default UIShellNavItem;
