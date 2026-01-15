
import * as React from 'react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-30 bg-background/75 pb-2 pt-3 backdrop-blur-md sm:pb-3 sm:pt-4", className)}>
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex-1">
                <h1 className="text-xl font-bold tracking-tight font-headline sm:text-2xl">{title}</h1>
            </div>
            {children && <div className="flex flex-shrink-0 items-center gap-2">{children}</div>}
        </div>
    </header>
  );
}
