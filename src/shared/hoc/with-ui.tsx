import { useUI } from '@/entities/ui';
import { ComponentType, memo, useMemo } from 'react';

export function withUI<T extends object>(
  WrappedComponent: ComponentType<T>,
  name: string,
): ComponentType<T> {
  const MemoizedComponent = memo(WrappedComponent);

  return function WithUIComponent(props: T) {
    const { isOpen, name: activeName } = useUI();

    const shouldRender = useMemo(
      () => activeName === name && isOpen,
      [activeName, isOpen],
    );

    if (!shouldRender) return null;

    return <MemoizedComponent {...props} />;
  };
}
