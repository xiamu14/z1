import { cn } from '@/utils/cn';
import { ClassNameValue } from 'tailwind-merge';

type DivProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};
export function Center({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}
