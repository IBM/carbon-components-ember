export interface ButtonSignature {
  Args: {
    kind?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'xl';
    type?: 'primary' | 'danger';
    disabled?: boolean;
    onClick?: () => void;
    loading?: boolean;
    isExpressive?: string;
    set?: object;
  };
  Blocks: { default: []; labelText: [] };
}
export default class Button {}
