import Component from '@glimmer/component';

export interface Signature {
  Element: null;
  Blocks: {
    default: [];
  };
}

export default class TableToolbarContentComponent extends Component<Signature> {
  <template>
    <div class='cds--toolbar-content'>
      {{yield}}
    </div>
  </template>
}
