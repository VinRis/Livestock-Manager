
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type FinancialRecord } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const incomeCategories = ["Milk Sales", "Livestock Sale", "Wool Sales", "Other"];
const expenseCategories = ["Feed", "Vet Services", "Utilities", "Maintenance", "Livestock Purchase", "Other"];

export default function EditTransactionPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const transactionId = params.id as string;

    const [transaction, setTransaction] = useState<FinancialRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!transactionId) return;
        try {
            const stored = window.localStorage.getItem('financialData');
            const financials: FinancialRecord[] = stored ? JSON.parse(stored) : [];
            const foundTransaction = financials.find(t => t.id === transactionId);
            if (foundTransaction) {
                // Ensure date is in 'YYYY-MM-DD' format for the input
                setTransaction({ ...foundTransaction, date: foundTransaction.date.split('T')[0] });
            }
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "Could not load transaction data." });
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, toast]);

    const handleSave = () => {
        if (!transaction) return;

        try {
            const stored = window.localStorage.getItem('financialData');
            const financials: FinancialRecord[] = stored ? JSON.parse(stored) : [];
            const updatedFinancials = financials.map(t =>
                t.id === transaction.id ? { ...transaction, date: new Date(transaction.date).toISOString() } : t
            );
            window.localStorage.setItem('financialData', JSON.stringify(updatedFinancials));

            toast({ title: "Transaction Updated", description: "Your changes have been saved." });
            router.push('/finance/all');
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "Could not save your changes." });
        }
    };
    
    if (isLoading) {
        return (
            <>
                <PageHeader title="Edit Transaction" />
                <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Loading transaction details...</p>
                        </CardContent>
                    </Card>
                </main>
            </>
        )
    }

    if (!transaction) {
        return (
            <>
                <PageHeader title="Transaction Not Found" />
                <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Error</CardTitle>
                            <CardDescription>Could not find the transaction you are looking for.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/finance/all">Back to All Transactions</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </>
        )
    }

    return (
        <>
            <PageHeader title="Edit Transaction">
                <Button variant="outline" asChild>
                    <Link href="/finance/all">
                        <ArrowLeft />
                        Cancel
                    </Link>
                </Button>
            </PageHeader>
            <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Editing Transaction</CardTitle>
                        <CardDescription>Update the details and click save.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" type="date" value={transaction.date} onChange={(e) => setTransaction(t => t ? { ...t, date: e.target.value } : null)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input id="description" value={transaction.description} onChange={(e) => setTransaction(t => t ? { ...t, description: e.target.value } : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={transaction.category} onValueChange={(value) => setTransaction(t => t ? { ...t, category: value } : null)}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(transaction.type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" value={transaction.amount} onChange={(e) => setTransaction(t => t ? { ...t, amount: parseFloat(e.target.value) || 0 } : null)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSave} className="w-full">Save Changes</Button>
                    </CardFooter>
                </Card>
            </main>
        </>
    );
}
