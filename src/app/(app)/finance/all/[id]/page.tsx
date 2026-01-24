
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
import { saveDataToLocalStorage } from "@/lib/storage";

const incomeCategories = ["Milk Sales", "Livestock Sale", "Wool Sales", "Other"];
const expenseCategories = ["Feed", "Vet Services", "Utilities", "Maintenance", "Livestock Purchase", "Other"];

export default function EditTransactionPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const transactionId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [originalTransaction, setOriginalTransaction] = useState<FinancialRecord | null>(null);
    
    // State for each form field
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState<number|string>('');
    const [type, setType] = useState<'Income' | 'Expense'>('Expense');

    useEffect(() => {
        if (!transactionId) return;
        try {
            const stored = window.localStorage.getItem('financialData');
            const financials: FinancialRecord[] = stored ? JSON.parse(stored) : [];
            const foundTransaction = financials.find(t => t.id === transactionId);
            
            if (foundTransaction) {
                setOriginalTransaction(foundTransaction);
                setDate(foundTransaction.date.split('T')[0]);
                setDescription(foundTransaction.description);
                setCategory(foundTransaction.category);
                setAmount(foundTransaction.amount);
                setType(foundTransaction.type);
            }
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "Could not load transaction data." });
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, toast]);

    const handleSave = () => {
        if (!originalTransaction) return;

        let financials: FinancialRecord[] = [];
        try {
            const stored = window.localStorage.getItem('financialData');
            financials = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "Could not load existing transactions." });
            return;
        }

        const updatedTransaction: FinancialRecord = {
            ...originalTransaction,
            date: new Date(date).toISOString(),
            description,
            category,
            amount: parseFloat(String(amount)) || 0,
        };

        const updatedFinancials = financials.map(t =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        );
        saveDataToLocalStorage('financialData', updatedFinancials);

        toast({ title: "Transaction Updated", description: "Your changes have been saved." });
        router.push('/finance/all');
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

    if (!originalTransaction) {
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
                          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
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
