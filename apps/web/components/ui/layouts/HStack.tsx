import { cn } from '@/utils/cn';
import { ClassNameValue } from 'tailwind-merge';

export function HStack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) {
  return <div className={cn('flex flex-row', className)}>{children}</div>;
}
