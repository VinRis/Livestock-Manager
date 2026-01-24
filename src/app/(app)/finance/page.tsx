
"use client"

import { DollarSign, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import React, { useState, useMemo, useEffect } from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { financialData as initialFinancialData, FinancialRecord } from "@/lib/data";
import { cn } from "@/lib/utils";
import FinanceChart from "./finance-chart";
import { useCurrency } from "@/contexts/currency-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FinancePage() {
  const { currency } = useCurrency();
  const { toast } = useToast();
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form state
  const [transactionType, setTransactionType] = useState<'Income' | 'Expense' | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setIsClient(true);
    try {
        const stored = window.localStorage.getItem('financialData');
        const loaded = stored ? JSON.parse(stored) : initialFinancialData;
        setFinancials(loaded);
    } catch (e) {
        console.error(e);
        setFinancials(initialFinancialData);
    }
  }, []);

  const totalIncome = financials.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financials.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const recentTransactions = financials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentFinancials = financials.filter(r => new Date(r.date) > last30Days);
  const recentIncome = recentFinancials.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const recentExpense = recentFinancials.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const recentNet = recentIncome - recentExpense;

  const topExpenses = useMemo(() => {
    const expenseByCategory = recentFinancials
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<string, number>);

    const totalRecentExpenseValue = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalRecentExpenseValue > 0 ? (amount / totalRecentExpenseValue) * 100 : 0,
      }));
  }, [recentFinancials]);

  const handleTypeSelect = (type: 'Income' | 'Expense') => {
    setTransactionType(type);
    setStep(2);
  };
  
  const resetModal = () => {
    setStep(1);
    setTransactionType(null);
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setCategory('');
    setAmount('');
  };

  const handleSaveTransaction = () => {
      if (!transactionType || !date || !description || !category || !amount) {
          toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Please fill out all fields for the transaction.",
          });
          return;
      }
      
      const newTransaction: FinancialRecord = {
          id: `fin-${Date.now()}`,
          type: transactionType,
          date,
          description,
          category,
          amount: parseFloat(amount),
      };

      const updatedFinancials = [newTransaction, ...financials];
      setFinancials(updatedFinancials);

      setTimeout(() => {
        window.localStorage.setItem('financialData', JSON.stringify(updatedFinancials));
      }, 0);

      toast({
          title: "Transaction Saved",
          description: "Your new transaction has been recorded.",
      });

      onOpenChange(false);
  }

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetModal();
    }
    setOpen(isOpen);
  };

  const incomeCategories = ["Milk Sales", "Livestock Sale", "Wool Sales", "Other"];
  const expenseCategories = ["Feed", "Vet Services", "Utilities", "Maintenance", "Livestock Purchase", "Other"];

  return (
    <>
      <PageHeader title="Financials" />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="col-span-1 sm:order-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-xl font-bold", netProfit >= 0 ? 'text-primary' : 'text-destructive')}>
                  {currency}{netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">All-time net profit</p>
              </CardContent>
            </Card>
            <Card className="sm:order-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Income</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">{currency}{totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time income</p>
              </CardContent>
            </Card>
            <Card className="sm:order-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-destructive">{currency}{totalExpense.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time expenses</p>
              </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Dialog>
              <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-accent">
                      <CardHeader>
                        <CardTitle>Income vs. Expenses</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <p className="text-sm text-primary">Click to view graph</p>
                          <div className="space-y-2 text-sm">
                              <h4 className="font-semibold text-muted-foreground">Last 30 Days Summary</h4>
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="flex items-center gap-2"><TrendingUp className="text-primary"/>Income</span>
                                  <span className="font-semibold text-primary text-right">{currency}{recentIncome.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="flex items-center gap-2"><TrendingDown className="text-destructive"/>Expense</span>
                                  <span className="font-semibold text-destructive text-right">{currency}{recentExpense.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between border-t pt-2 mt-2 gap-2 flex-wrap">
                                  <span className="font-bold">Net</span>
                                  <span className={cn("font-bold text-right", recentNet >= 0 ? "text-primary" : "text-destructive")}>{currency}{recentNet.toLocaleString()}</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                  <DialogHeader>
                      <DialogTitle>Income vs. Expenses</DialogTitle>
                  </DialogHeader>
                  <div className="h-[400px] w-full pt-4 overflow-x-auto">
                      <FinanceChart data={financials} />
                  </div>
              </DialogContent>
            </Dialog>

            {topExpenses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Expenses (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="space-y-3">
                              {topExpenses.map((expense) => (
                                <div key={expense.category} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-medium">{expense.category}</span>
                                    <span>{currency}{expense.amount.toLocaleString()}</span>
                                  </div>
                                  <Progress value={expense.percentage} className="h-2" />
                                </div>
                              ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

          </div>
          

          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/finance/all">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No transactions recorded yet.</div>
              ) : isMobile ? (
                  <div className="space-y-3">
                      {recentTransactions.map(record => (
                          <div key={record.id} className="p-3 rounded-md border flex justify-between items-start gap-2">
                              <div className="flex-1 space-y-1">
                                  <p className="font-medium break-words">{record.description}</p>
                                  <p className="text-sm text-muted-foreground">{record.category}</p>
                                  {isClient && <p className="text-sm text-muted-foreground">{format(new Date(record.date), 'P')}</p>}
                              </div>
                              <div className={cn("pl-2 text-right font-semibold", record.type === 'Income' ? 'text-primary' : 'text-destructive')}>
                                  {record.type === 'Income' ? '+' : '-'}{currency}{record.amount.toLocaleString()}
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{record.description}</div>
                           {isClient && <p className="text-sm text-muted-foreground">{format(new Date(record.date), 'P')}</p>}
                        </TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell className={cn("text-right", record.type === 'Income' ? 'text-primary' : 'text-destructive')}>
                          {record.type === 'Income' ? '+' : '-'}{currency}{record.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

       <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg sm:bottom-20">
                    <PlusCircle className="h-6 w-6" />
                    <span className="sr-only">Add Transaction</span>
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={resetModal}>
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                        {step === 1 ? "Select the type of transaction you want to add." : `Add a new ${transactionType} record.`}
                    </DialogDescription>
                </DialogHeader>
                {step === 1 ? (
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button variant="outline" size="lg" onClick={() => handleTypeSelect('Income')}>
                            <div className="flex flex-col items-center gap-2">
                                <DollarSign className="h-8 w-8 text-primary"/>
                                <span>Income</span>
                            </div>
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => handleTypeSelect('Expense')}>
                            <div className="flex flex-col items-center gap-2">
                               <DollarSign className="h-8 w-8 text-destructive"/>
                                <span>Expense</span>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" placeholder="e.g., Sale of 2000L milk" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(transactionType === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                    </div>
                )}
                 <DialogFooter>
                    {step === 2 && (
                        <>
                            <Button variant="outline" onClick={resetModal}>Back</Button>
                            <Button onClick={handleSaveTransaction}>Save Transaction</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

    
