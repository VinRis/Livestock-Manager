"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { type FinancialRecord } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditTransactionDialog } from './edit-transaction-dialog';

const ClientFormattedDate = ({ date, className }: { date: string, className?: string }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString());
  }, [date]);

  if (!formattedDate) {
    return null;
  }

  return <p className={cn("text-sm text-muted-foreground", className)}>{formattedDate}</p>;
};


export default function AllTransactionsPage() {
  const { currency } = useCurrency();
  const { toast } = useToast();
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // Dialog states
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isBatchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  
  // State for editing/deleting
  const [activeTransaction, setActiveTransaction] = useState<FinancialRecord | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
        const stored = window.localStorage.getItem('financialData');
        const loaded: FinancialRecord[] = stored ? JSON.parse(stored) : [];
        setFinancials(loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (e) {
        console.error(e);
        setFinancials([]);
    }
  }, []);

  useEffect(() => {
      if (isClient) {
          window.localStorage.setItem('financialData', JSON.stringify(financials));
      }
  }, [financials, isClient]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedRows(financials.map(t => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleEditClick = (transaction: FinancialRecord) => {
    setActiveTransaction(transaction);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = (transaction: FinancialRecord) => {
    setActiveTransaction(transaction);
    setDeleteDialogOpen(true);
  }

  const handleUpdateTransaction = (updatedTransaction: FinancialRecord) => {
    if (!updatedTransaction) return;

    setFinancials(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    toast({ title: "Transaction Updated", description: "Your transaction details have been saved." });
    setEditDialogOpen(false);
    setActiveTransaction(null);
  };

  const handleConfirmDelete = () => {
    if (!activeTransaction) return;
    
    setFinancials(prev => prev.filter(t => t.id !== activeTransaction.id));
    toast({ variant: "destructive", title: "Transaction Deleted", description: "The transaction has been removed." });
    setDeleteDialogOpen(false);
    setActiveTransaction(null);
  };
  
  const handleConfirmBatchDelete = () => {
    setFinancials(prev => prev.filter(t => !selectedRows.includes(t.id)));
    toast({ variant: "destructive", title: `${selectedRows.length} Transactions Deleted`, description: "The selected transactions have been removed." });
    setBatchDeleteDialogOpen(false);
    setSelectedRows([]);
  }

  const onEditDialogChange = (isOpen: boolean) => {
      if (!isOpen) {
          setActiveTransaction(null);
      }
      setEditDialogOpen(isOpen);
  }


  if (!isClient) {
    return null; // Or a skeleton loader
  }

  return (
    <>
      <PageHeader title="All Transactions">
        <Button variant="outline" asChild>
            <Link href="/finance">
                <ArrowLeft />
                Back to Finance
            </Link>
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                {selectedRows.length > 0 && (
                    <Button variant="destructive" onClick={() => setBatchDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete ({selectedRows.length})
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
              {financials.length > 0 ? financials.map(record => (
                  <Card key={`mobile-${record.id}`} className={cn(selectedRows.includes(record.id) && "border-primary bg-accent/50")}>
                      <CardContent className="p-4 flex items-start gap-3">
                          <div className="flex-none mt-1">
                              <Checkbox
                                  checked={selectedRows.includes(record.id)}
                                  onCheckedChange={(checked) => handleSelectRow(record.id, !!checked)}
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
                                      <DropdownMenuItem onSelect={() => handleEditClick(record)}>
                                          <Edit className="mr-2 h-4 w-4"/>Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onSelect={() => handleDeleteClick(record)} className="text-destructive">
                                          <Trash2 className="mr-2 h-4 w-4"/>Delete
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                      </CardContent>
                  </Card>
              )) : (
                  <div className="text-center text-muted-foreground py-8">
                      No transactions found.
                  </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedRows.length === financials.length && financials.length > 0 ? true : (selectedRows.length > 0 ? 'indeterminate' : false)}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financials.length > 0 ? financials.map(record => (
                    <TableRow key={record.id} data-state={selectedRows.includes(record.id) ? "selected" : ""}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRows.includes(record.id)}
                          onCheckedChange={(checked) => handleSelectRow(record.id, !!checked)}
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
                                <DropdownMenuItem onSelect={() => handleEditClick(record)}>
                                    <Edit className="mr-2 h-4 w-4"/>Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDeleteClick(record)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <EditTransactionDialog
        isOpen={isEditDialogOpen}
        onOpenChange={onEditDialogChange}
        transaction={activeTransaction}
        onSave={handleUpdateTransaction}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Delete Confirmation Dialog */}
      <AlertDialog open={isBatchDeleteDialogOpen} onOpenChange={setBatchDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {selectedRows.length} selected transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBatchDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
