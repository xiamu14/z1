import { cn } from '@/utils/cn';
import { ClassNameValue } from 'tailwind-merge';

export function VStack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) {
  return <div className={cn('flex flex-col', className)}>{children}</div>;
}
