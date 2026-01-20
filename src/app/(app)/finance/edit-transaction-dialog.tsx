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
  const [formData, setFormData] = useState<FinancialRecord | null>(null);

  useEffect(() => {
    // Initialize form data when a transaction is passed in
    setFormData(transaction);
  }, [transaction]);

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };
  
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset form data on close
      setFormData(null);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        {formData && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date.split('T')[0]} onChange={(e) => setFormData(prev => prev ? {...prev, date: e.target.value} : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description} onChange={(e) => setFormData(prev => prev ? {...prev, description: e.target.value} : null)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => prev ? {...prev, category: value} : null)}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {(formData.type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData(prev => prev ? {...prev, amount: parseFloat(e.target.value) || 0} : null)} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleDialogChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
