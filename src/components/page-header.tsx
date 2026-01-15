
import * as React from 'react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-30 bg-background/75 pb-4 backdrop-blur-md", className)}>
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight font-headline">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {children && <div className="flex flex-shrink-0 items-center gap-2">{children}</div>}
        </div>
    </header>
  );
}
