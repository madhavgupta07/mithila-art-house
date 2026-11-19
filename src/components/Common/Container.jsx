import { cn } from '../../lib/utils';

export default function Container({ className, children, as: Tag = 'div', ...props }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12', className)} {...props}>
      {children}
    </Tag>
  );
}
