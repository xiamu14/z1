import { cn } from '@/utils/cn';
import { ClassNameValue } from 'tailwind-merge';

export function Center({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {children}
    </div>
  );
}
