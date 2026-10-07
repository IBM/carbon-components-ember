import type { TOC } from '@ember/component/template-only';

export interface SkeletonPlaceholderSignature {
  Element: HTMLDivElement;
}

const SkeletonPlaceholder: TOC<SkeletonPlaceholderSignature> = <template>
  <div class="cds--skeleton__placeholder" ...attributes></div>
</template>;

export default SkeletonPlaceholder;
