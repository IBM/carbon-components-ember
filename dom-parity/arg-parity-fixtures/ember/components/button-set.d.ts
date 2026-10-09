import type Button from './button';

type WithBoundArgs<T, K extends string> = [T, K];

export interface ButtonSetSignature {
  Args: { stacked?: boolean };
  Blocks: { default: [Button: WithBoundArgs<typeof Button, 'set'>] };
}
export default class ButtonSet {}
