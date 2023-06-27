import Component from '@glimmer/component';
import { defaultArgs } from '../../decorators';
import styles from './styles.scoped.scss';
/** @documenter yuidoc */


type Args = {
  /**
   @argument loading
   @type boolean
   */
  loading?: boolean;
  /**
   @argument title
   @type String
   */
  title: string;
}

export interface CardComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 The CardComponent

 ```handlebars
 <Carbon::Card @onClick={{fn this.onclick}}> Card Text </Carbon::Card>
 ```
 @class CardComponent
 @public
 **/
export default class CardComponent extends Component<CardComponentSignature> {
  args: Args = defaultArgs(this, {
    loading: false,
    title: ''
  });

  <template>
      <div class="{{styles.card}} card" ...attributes>
        {{#if @title}}
          <div class="title">
            <strong style="padding-left: 20px">{{@title}}</strong>
          </div>
        {{/if}}
        {{#if @loading}}
          <div class="cds--skeleton cds--btn" style="width: 100%"></div>
        {{else}}
          {{yield}}
        {{/if}}
      </div>
  </template>
}
