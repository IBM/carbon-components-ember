import { HelperLike } from '@glint/template';

type OrHelper<X,Y> = HelperLike<{
  Args: { Positional: [first: X, second: Y] };
  Return: X|Y|boolean;
}>

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ember-truth-helpers/helpers/or': OrHelper<unknown,unknown>
  }
}

