import Component from '@glimmer/component';

export interface SkeletonIconSignature {
  Element: HTMLDivElement;
}

export default class SkeletonIcon extends Component<SkeletonIconSignature> {
  <template>
    <div class='cds--icon--skeleton' ...attributes></div>
  </template>
}
