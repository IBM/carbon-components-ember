import Component from '@glimmer/component';
import { defaultArgs } from '../../decorators';
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
}
