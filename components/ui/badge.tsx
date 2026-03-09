import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
          success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
          destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          outline: 'border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300',
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
