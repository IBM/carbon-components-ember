import Component from '@glimmer/component';

export interface SkeletonPlaceholderSignature {
  Element: HTMLDivElement;
}

export default class SkeletonPlaceholder extends Component<SkeletonPlaceholderSignature> {
  <template>
    <div class='cds--skeleton__placeholder' ...attributes></div>
  </template>
}
