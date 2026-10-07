import type { TOC } from '@ember/component/template-only';

export interface UIShellSideNavDetailsSignature {
  Element: HTMLDivElement;
  Args: {
    title: string;
  };
  Blocks: {
    default: [];
  };
}

const UIShellSideNavDetails: TOC<UIShellSideNavDetailsSignature> = <template>
  {{! Yielded into the side nav's list, so it sits in a list item. }}
  <li>
    <div class="cds--side-nav__details" ...attributes>
      <h2 class="cds--side-nav__title" title={{@title}}>
        {{@title}}
      </h2>
      {{yield}}
    </div>
  </li>
</template>;

export default UIShellSideNavDetails;
