
"use client";

import React from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type FinancialRecord } from '@/lib/data';
import { cn } from '@/lib/utils';

// This component is now memoized and uses a client-side check to avoid hydration issues without causing extra re-renders for the whole list.
const ClientFormattedDate = React.memo(({ date, className }: { date: string; className?: string }) => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {isClient ? new Date(date).toLocaleDateString() : <>&nbsp;</>}
    </p>
  );
});
ClientFormattedDate.displayName = 'ClientFormattedDate';

type TransactionItemProps = {
    record: FinancialRecord;
    isSelected: boolean;
    currency: string;
    onSelectRow: (id: string, checked: boolean) => void;
    onEdit: (record: FinancialRecord) => void;
    onDelete: (record: FinancialRecord) => void;
};

// Mobile Card Item wrapped in React.memo
export const TransactionCardItem = React.memo(({ record, isSelected, currency, onSelectRow, onEdit, onDelete }: TransactionItemProps) => {
    return (
        <Card className={cn(isSelected && "border-primary bg-accent/50")}>
            <CardContent className="p-4 flex items-start gap-3">
                <div className="flex-none mt-1">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectRow(record.id, !!checked)}
                        id={`mobile-checkbox-${record.id}`}
                    />
                </div>
                <label htmlFor={`mobile-checkbox-${record.id}`} className="flex-1 space-y-1">
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
                    <ClientFormattedDate date={record.date} className="!text-xs" />
                </label>
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
                            <DropdownMenuItem onSelect={() => onDelete(record)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>Delete
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
export const TransactionTableRowItem = React.memo(({ record, isSelected, currency, onSelectRow, onEdit, onDelete }: TransactionItemProps) => {
    return (
        <TableRow data-state={isSelected ? "selected" : ""}>
            <TableCell>
                <Checkbox 
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectRow(record.id, !!checked)}
                />
            </TableCell>
            <TableCell>
                <div className="font-medium">{record.description}</div>
                <ClientFormattedDate date={record.date} />
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
                        <DropdownMenuItem onSelect={() => onDelete(record)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/>Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
});
TransactionTableRowItem.displayName = 'TransactionTableRowItem';
