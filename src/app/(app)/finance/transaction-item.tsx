
"use client";

import React from 'react';
import { MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type FinancialRecord } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type TransactionItemProps = {
    record: FinancialRecord;
    currency: string;
    onEdit: (record: FinancialRecord) => void;
};

// Mobile Card Item wrapped in React.memo
export const TransactionCardItem = React.memo(({ record, currency, onEdit }: TransactionItemProps) => {
    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Card>
            <CardContent className="p-4 flex items-start gap-3">
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <span className="font-medium pr-2">{record.description}</span>
                        <span className={cn("font-medium whitespace-nowrap", record.type === 'Income' ? 'text-primary' : 'text-destructive')}>
                            {record.type === 'Income' ? '+' : '-'}{currency}{record.amount.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                        <Badge variant={record.type === 'Income' ? 'default' : 'destructive'} className="text-xs">{record.type}</Badge>
                        <span>{record.category}</span>
                    </div>
                    {isClient && <p className="text-xs text-muted-foreground">{format(new Date(record.date), 'P')}</p>}
                </div>
                <div className="flex-none -mt-2 -mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(record)}>
                                <Edit className="mr-2 h-4 w-4"/>Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
});
TransactionCardItem.displayName = 'TransactionCardItem';

// Desktop Table Row Item wrapped in React.memo
export const TransactionTableRowItem = React.memo(({ record, currency, onEdit }: TransactionItemProps) => {
    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    
    return (
        <TableRow>
            <TableCell>
                <div className="font-medium">{record.description}</div>
                {isClient && <p className="text-sm text-muted-foreground">{format(new Date(record.date), 'P')}</p>}
            </TableCell>
            <TableCell>
                <Badge variant={record.type === 'Income' ? 'default' : 'destructive'}>{record.type}</Badge>
            </TableCell>
            <TableCell>{record.category}</TableCell>
            <TableCell className={cn("text-right font-medium", record.type === 'Income' ? 'text-primary' : 'text-destructive')}>
                {record.type === 'Income' ? '+' : '-'}{currency}{record.amount.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onEdit(record)}>
                            <Edit className="mr-2 h-4 w-4"/>Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
});
TransactionTableRowItem.displayName = 'TransactionTableRowItem';
