import Component from '@glimmer/component';

export interface TextAreaSkeletonSignature {
  Args: {
    hideLabel?: boolean;
  };
  Element: HTMLDivElement;
}

export default class TextAreaSkeleton extends Component<TextAreaSkeletonSignature> {
  <template>
    <div class='cds--form-item' ...attributes>
      {{#unless @hideLabel}}
        <span class='cds--label cds--skeleton'></span>
      {{/unless}}
      <div class='cds--skeleton cds--text-area'></div>
    </div>
  </template>
}
