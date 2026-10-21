import Component from '@glimmer/component';
import type { TrustedHTML } from '@ember/template';
import Loading from '../components/loading.gts';
import renderSvgPart from '../components/icon/render-svg-part.ts';
import './icon.scss';

/** An icon descriptor from `@carbon/icons` (e.g. `@carbon/icons/es/add/16`). */
export type IconType = {
  name: string;
  elem: string;
  attrs: Record<string, string | number>;
  content: {
    elem: string;
    attrs: Record<string, string | number>;
  }[];
  size: number;
};

const IconMap: Record<string, IconType> = {};

export function registerIcon(name: string, icon: IconType) {
  IconMap[name] = icon;
}

export interface IconSignature {
  Args: {
    /**
     * Indicates if the icon is in loading state
     */
    loading?: boolean;
    /**
     * Indicates if the icon is informative
     */
    info?: boolean;
    /**
     * Use this icon to display
     */
    icon?: string | IconType;

    /**
     * Use this icon svg to display,
     * marked as trusted with `trustHTML()`
     */
    iconSvg?: TrustedHTML;
    /**
     * Size of icon
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    size?: 16 | 20 | 24 | 32 | number | string;
    /**
     * Classes for the `<svg>`, as `@carbon/icons-react`'s `className`.
     */
    svgClass?: string;
    fill?: string;
    /**
     * Text for an SVG `<title>` element inside the icon, making it accessible
     * to screen readers. Matches `@carbon/icons-react`'s `children` pattern
     * (callers pass `<title>{description}</title>` as children). An empty string
     * renders an empty `<title></title>`, matching React's behaviour when a
     * description prop is present but empty.
     */
    title?: string;
    /**
     * Labels the icon for assistive technology, making it an image
     * (`role="img"`) rather than decorative.
     */
    ariaLabel?: string;
  };
}

export default class Icon extends Component<IconSignature> {
  get classes() {
    const classes: string[] = [];
    if (this.args.info) classes.push('cds--icon--info');
    return classes.join(' ');
  }

  get svg() {
    if (typeof this.args.icon === 'string') {
      return IconMap[this.args.icon];
    }
    return this.args.icon;
  }

  // eslint-disable-next-line ember/template-require-splattributes -- the svg comes from a helper; use @svgClass
  <template>
    {{#if @loading}}
      <span class="cds--ember-icon__loading">
        <Loading
          @small={{true}}
          @withOverlay={{false}}
          class={{this.classes}}
        />
      </span>
    {{else}}
      {{renderSvgPart
        this.svg
        class=(array @svgClass this.classes)
        fill=(or @fill "currentColor")
        size=@size
        title=@title
        ariaLabel=@ariaLabel
      }}
    {{/if}}
  </template>
}
