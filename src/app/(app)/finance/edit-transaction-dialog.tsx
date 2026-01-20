
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type FinancialRecord } from "@/lib/data";

interface EditTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transaction: FinancialRecord | null;
  onSave: (updatedTransaction: FinancialRecord) => void;
}

const incomeCategories = ["Milk Sales", "Livestock Sale", "Wool Sales", "Other"];
const expenseCategories = ["Feed", "Vet Services", "Utilities", "Maintenance", "Livestock Purchase", "Other"];

export function EditTransactionDialog({ isOpen, onOpenChange, transaction, onSave }: EditTransactionDialogProps) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | string>('');

  useEffect(() => {
    if (transaction) {
      setDate(transaction.date.split('T')[0]);
      setDescription(transaction.description);
      setCategory(transaction.category);
      setAmount(transaction.amount);
    } else {
        // Reset when dialog is closed or there's no transaction
        setDate('');
        setDescription('');
        setCategory('');
        setAmount('');
    }
  }, [transaction]);

  const handleSave = () => {
    if (transaction) {
      const updatedTransaction: FinancialRecord = {
        ...transaction,
        date,
        description,
        category,
        amount: typeof amount === 'string' ? parseFloat(amount) : amount,
      };
      onSave(updatedTransaction);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        {transaction && (
          <div className="grid gap-4 py-4">
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
                        {(transaction.type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
