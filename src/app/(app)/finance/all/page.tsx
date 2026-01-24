
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { type FinancialRecord } from "@/lib/data";
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
import { TransactionCardItem, TransactionTableRowItem } from '../transaction-item';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AllTransactionsPage() {
  const { currency } = useCurrency();
  const { toast } = useToast();
  const router = useRouter();
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // Dialog states
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isBatchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  
  // State for editing/deleting
  const [activeTransaction, setActiveTransaction] = useState<FinancialRecord | null>(null);

  const isMobile = useIsMobile();

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

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedRows(financials.map(t => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  }, []);

  const handleEditClick = useCallback((transaction: FinancialRecord) => {
    router.push(`/finance/all/${transaction.id}`);
  }, [router]);
  
  const handleDeleteClick = useCallback((transaction: FinancialRecord) => {
    setActiveTransaction(transaction);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = () => {
    if (!activeTransaction) return;
    
    const updatedFinancials = financials.filter(t => t.id !== activeTransaction.id);
    setFinancials(updatedFinancials);
    setTimeout(() => {
      window.localStorage.setItem('financialData', JSON.stringify(updatedFinancials));
    }, 0);

    toast({ variant: "destructive", title: "Transaction Deleted", description: "The transaction has been removed." });
    setDeleteDialogOpen(false);
    setActiveTransaction(null);
  };
  
  const handleConfirmBatchDelete = () => {
    const updatedFinancials = financials.filter(t => !selectedRows.includes(t.id));
    setFinancials(updatedFinancials);
    setTimeout(() => {
      window.localStorage.setItem('financialData', JSON.stringify(updatedFinancials));
    }, 0);

    toast({ variant: "destructive", title: `${selectedRows.length} Transactions Deleted`, description: "The selected transactions have been removed." });
    setBatchDeleteDialogOpen(false);
    setSelectedRows([]);
  }

  if (!isClient) {
    return null; // Or a skeleton loader
  }

  const renderContent = () => {
    const noTransactions = (
      <div className="text-center text-muted-foreground py-8">
        No transactions found.
      </div>
    );

    if (financials.length === 0) {
      if (isMobile) return noTransactions;
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    }

    if (isMobile) {
      return (
        <div className="space-y-3">
          {financials.map(record => (
              <TransactionCardItem
                key={`mobile-${record.id}`}
                record={record}
                isSelected={selectedRows.includes(record.id)}
                currency={currency}
                onSelectRow={handleSelectRow}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-md border">
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
            {financials.map(record => (
              <TransactionTableRowItem
                key={record.id}
                record={record}
                isSelected={selectedRows.includes(record.id)}
                currency={currency}
                onSelectRow={handleSelectRow}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
            {renderContent()}
          </CardContent>
        </Card>
      </main>

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
