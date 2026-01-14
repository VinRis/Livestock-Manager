
"use client"

import { DollarSign, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { financialData } from "@/lib/data";
import { cn } from "@/lib/utils";
import FinanceChart from "./finance-chart";
import { useCurrency } from "@/contexts/currency-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FinancePage() {
  const { currency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [transactionType, setTransactionType] = useState<'Income' | 'Expense' | null>(null);

  const totalIncome = financialData.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financialData.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const recentTransactions = financialData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentFinancials = financialData.filter(r => new Date(r.date) > last30Days);
  const recentIncome = recentFinancials.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const recentExpense = recentFinancials.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const recentNet = recentIncome - recentExpense;

  const handleTypeSelect = (type: 'Income' | 'Expense') => {
    setTransactionType(type);
    setStep(2);
  };
  
  const resetModal = () => {
    setStep(1);
    setTransactionType(null);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetModal();
    }
    setOpen(isOpen);
  };

  const incomeCategories = ["Milk Sales", "Livestock Sale", "Wool Sales"];
  const expenseCategories = ["Feed", "Vet Services", "Utilities", "Maintenance"];

  return (
    <>
      <PageHeader title="Financials" description="Track income, expenses, and profitability.">
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Add Transaction
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
                            <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" placeholder="e.g., Sale of 2000L milk" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select>
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
                            <Input id="amount" type="number" placeholder="0.00" />
                        </div>
                    </div>
                )}
                 <DialogFooter>
                    {step === 2 && (
                        <>
                            <Button variant="outline" onClick={resetModal}>Back</Button>
                            <Button onClick={() => onOpenChange(false)}>Save Transaction</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Income</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency}{totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time income</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency}{totalExpense.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All-time expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", netProfit >= 0 ? 'text-primary' : 'text-destructive')}>
                  {currency}{netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">All-time net profit</p>
              </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Dialog>
            <DialogTrigger asChild>
                <Card className="lg:col-span-4 cursor-pointer hover:bg-accent">
                    <CardHeader>
                    <CardTitle>Income vs. Expenses</CardTitle>
                    <CardDescription>View your monthly financial performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-primary mb-4">Click to view graph</p>
                        <div className="space-y-2 text-sm">
                            <h4 className="font-semibold text-muted-foreground">Last 30 Days</h4>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><TrendingUp className="text-primary"/>Income</span>
                                <span className="font-semibold">{currency}{recentIncome.toLocaleString()}</span>
                            </div>
                             <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><TrendingDown className="text-destructive"/>Expense</span>
                                <span className="font-semibold">{currency}{recentExpense.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2 mt-2">
                                <span className="font-bold">Net</span>
                                <span className={cn("font-bold", recentNet >= 0 ? "text-primary" : "text-destructive")}>{currency}{recentNet.toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Income vs. Expenses</DialogTitle>
                    <DialogDescription>Monthly financial performance.</DialogDescription>
                </DialogHeader>
                <div className="h-[400px] w-full pt-4">
                    <FinanceChart />
                </div>
            </DialogContent>
          </Dialog>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your 5 most recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
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
                        <div className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()}</div>
                      </TableCell>
                       <TableCell>{record.category}</TableCell>
                      <TableCell className={cn("text-right", record.type === 'Income' ? 'text-primary' : 'text-destructive')}>
                        {record.type === 'Income' ? '+' : '-'}{currency}{record.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
