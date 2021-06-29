import React, { ElementType, FC, ReactNode, forwardRef } from 'react';
import cls from 'classnames';
import { NoSsr } from '../NoSsr';
import './index.less';

export interface ContainerProps {
  children: ReactNode;
  fixed?: boolean;
  maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false;
  disableGutters?: boolean;
  className?: string;
  component?: ElementType;
  ssr?: boolean;
}

export const Container: FC<ContainerProps> = forwardRef(function Container(inProps, ref) {
  const props = inProps;
  const {
    className,
    component: Component = 'div',
    disableGutters = false,
    fixed = false,
    maxWidth = 'lg',
    ssr = false,
    ...other
  } = props;
  const comp = <Component className={cls('container', fixed ? 'fixed' : '', className)} {...other} ref={ref} />;
  return ssr ? comp : <NoSsr>{comp}</NoSsr>;
});

export default Container;
