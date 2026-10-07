import type { TOC } from '@ember/component/template-only';

export interface SkeletonIconSignature {
  Element: HTMLDivElement;
}

const SkeletonIcon: TOC<SkeletonIconSignature> = <template>
  <div class="cds--icon--skeleton" ...attributes></div>
</template>;

export default SkeletonIcon;
