
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type FinancialRecord } from "@/lib/data";
import { useCurrency } from "@/contexts/currency-context";
import { useToast } from "@/hooks/use-toast";
import { TransactionCardItem, TransactionTableRowItem } from '../transaction-item';
import { useIsMobile } from '@/hooks/use-mobile';
import { saveDataToLocalStorage } from '@/lib/storage';

const ITEMS_PER_PAGE = 25;

export default function AllTransactionsPage() {
  const { currency } = useCurrency();
  const { toast } = useToast();
  const router = useRouter();
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination Calculations
  const totalPages = Math.ceil(financials.length / ITEMS_PER_PAGE);
  const paginatedFinancials = financials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleEditClick = useCallback((transaction: FinancialRecord) => {
    router.push(`/finance/all/${transaction.id}`);
  }, [router]);
  

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
      return noTransactions;
    }

    if (paginatedFinancials.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                No transactions on this page.
                <Button variant="link" onClick={() => setCurrentPage(1)}>Go to first page</Button>
            </div>
        );
    }

    if (isMobile) {
      return (
        <div className="space-y-3">
          {paginatedFinancials.map(record => (
              <TransactionCardItem
                key={`mobile-${record.id}`}
                record={record}
                currency={currency}
                onEdit={handleEditClick}
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
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFinancials.map(record => (
              <TransactionTableRowItem
                key={record.id}
                record={record}
                currency={currency}
                onEdit={handleEditClick}
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
            </div>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
          {totalPages > 1 && (
            <CardFooter>
                <div className="flex items-center justify-between w-full">
                    <div className="text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                    </div>
                </div>
            </CardFooter>
          )}
        </Card>
      </main>
    </>
  );
}
