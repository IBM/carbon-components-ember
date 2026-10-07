import type { TOC } from '@ember/component/template-only';

export interface TextAreaSkeletonSignature {
  Args: {
    hideLabel?: boolean;
  };
  Element: HTMLDivElement;
}

const TextAreaSkeleton: TOC<TextAreaSkeletonSignature> = <template>
  <div class="cds--form-item" ...attributes>
    {{#unless @hideLabel}}
      <span class="cds--label cds--skeleton"></span>
    {{/unless}}
    <div class="cds--skeleton cds--text-area"></div>
  </div>
</template>;

export default TextAreaSkeleton;
