// Hand-written stand-ins for @carbon/react's types, for arg-parity.test.mjs.
// Layer, Tooltip and Tag copy the shapes of Carbon's real types that need
// special handling; the real comparison reads the pinned @carbon/react.
import type {
  ButtonHTMLAttributes,
  ChangeEvent,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FC,
  ForwardRefExoticComponent,
  JSX,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefAttributes,
  RefObject,
} from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  hasIconOnly?: boolean;
  isExpressive?: boolean;
  labelText?: ReactNode;
  containerRef?: RefObject<HTMLDivElement | null>;
  'aria-label'?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (
    event: ChangeEvent<HTMLButtonElement>,
    data: { value: string },
  ) => void;
  onExpand?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** @deprecated */
  light?: boolean;
  children?: ReactNode;
}
export declare const Button: FC<ButtonProps>;

export interface ButtonSetProps {
  stacked?: boolean;
  children?: ReactNode;
}
export declare const ButtonSet: FC<ButtonSetProps>;

// As in @carbon/react's internal/PolymorphicProps.
type AsProp<C extends ElementType> = { as?: C };
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);
type PolymorphicComponentProp<
  C extends ElementType,
  Props = Record<string, never>,
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
type PolymorphicComponentPropWithRef<
  C extends ElementType,
  Props = Record<string, never>,
> = PolymorphicComponentProp<C, Props> & {
  ref?: ComponentPropsWithRef<C>['ref'];
};

// TypeScript loses Layer's own props over every element type.
export interface LayerBaseProps {
  level?: 0 | 1 | 2;
  withBackground?: boolean;
}
export type LayerProps<T extends ElementType> = PolymorphicComponentPropWithRef<
  T,
  LayerBaseProps
>;
export declare const Layer: ForwardRefExoticComponent<
  Omit<LayerProps<ElementType<any, keyof JSX.IntrinsicElements>>, 'ref'> &
    RefAttributes<unknown>
>;

// Tooltip renders a Popover by default, and passes it Popover's props.
export interface PopoverBaseProps {
  autoAlign?: boolean;
  open?: boolean;
}
export type PopoverProps<E extends ElementType> =
  PolymorphicComponentPropWithRef<E, PopoverBaseProps>;
export declare const Popover: <E extends ElementType = 'span'>(
  props: PopoverProps<E>,
) => ReactElement;

export interface TooltipBaseProps {
  label?: string;
}
export type TooltipProps<T extends ElementType> =
  PolymorphicComponentPropWithRef<T, TooltipBaseProps>;
export declare const Tooltip: <T extends ElementType = typeof Popover>(
  props: TooltipProps<T>,
) => ReactElement;

// Tag also takes the props of DismissibleTag, a separate component.
export interface TagBaseProps {
  type?: 'red' | 'blue';
  title?: string;
  size?: 'sm' | 'md';
}
interface DismissibleTagBaseProps {
  text?: string;
  onDismiss?: () => void;
}
export declare const Tag: (
  props: TagBaseProps | DismissibleTagBaseProps,
) => ReactElement;
