import Component from '@glimmer/component';

export type Args = {
  hideLabel?: boolean;
  twoHandles?: boolean;
};

export interface SliderSkeletonSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class SliderSkeleton extends Component<SliderSkeletonSignature> {
  <template>
    <div class='cds--form-item' ...attributes>
      {{#unless @hideLabel}}
        <span class='cds--label cds--skeleton'></span>
      {{/unless}}
      <div
        class='cds--slider-container cds--skeleton
          {{if @twoHandles "cds--slider-container--two-handles"}}'
      >
        <span class='cds--slider__range-label'></span>
        <div class='cds--slider'>
          <div class='cds--slider__track'></div>
          <div class='cds--slider__filled-track'></div>
          <div
            class='cds--slider__thumb-wrapper
              {{if @twoHandles "cds--slider__thumb-wrapper--lower"}}'
          >
            <div
              class='cds--slider__thumb {{if @twoHandles "cds--slider__thumb--lower"}}'
            ></div>
          </div>
          {{#if @twoHandles}}
            <div class='cds--slider__thumb-wrapper cds--slider__thumb-wrapper--upper'>
              <div class='cds--slider__thumb cds--slider__thumb--upper'></div>
            </div>
          {{/if}}
        </div>
        <span class='cds--slider__range-label'></span>
      </div>
    </div>
  </template>
}
