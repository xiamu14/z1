import { cn } from '@/utils/cn';
import { CSSProperties } from 'react';
import { ClassNameValue } from 'tailwind-merge';

export function Box({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
  style?: CSSProperties;
}) {
  return (
    <div className={cn('flex flex-col', className)} style={style}>
      {children}
    </div>
  );
}
