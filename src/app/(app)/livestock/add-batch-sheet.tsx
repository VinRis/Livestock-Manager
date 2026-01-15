
"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { livestockData, financialData } from "@/lib/data";
import { Combobox } from "@/components/ui/combobox";

interface AddBatchSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultCategory?: string;
}

const breedOptions: Record<string, { value: string; label: string }[]> = {
    Pigs: ["Duroc", "Hampshire", "Yorkshire"].map(b => ({ value: b, label: b })),
    Chickens: ["Leghorn", "Rhode Island Red", "Plymouth Rock"].map(b => ({ value: b, label: b })),
    Ducks: ["Pekin", "Mallard", "Rouen"].map(b => ({ value: b, label: b })),
    Rabbits: ["New Zealand White", "Californian"].map(b => ({ value: b, label: b })),
    Turkeys: ["Broad Breasted White", "Bourbon Red"].map(b => ({ value: b, label: b })),
    Fish: ["Tilapia", "Catfish", "Trout"].map(b => ({ value: b, label: b })),
};

export default function AddBatchSheet({ children, isOpen, onOpenChange, defaultCategory }: AddBatchSheetProps) {
  const { toast } = useToast();
  
  // Form State
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [animalCount, setAnimalCount] = useState('');
  const [totalCost, setTotalCost] = useState('');
  
  useEffect(() => {
    if (isOpen) {
        setName(defaultCategory ? `${defaultCategory} Batch - ${new Date().toLocaleDateString()}`: '');
        setBreed(breedOptions[defaultCategory as keyof typeof breedOptions]?.[0]?.value || '');
        setAcquisitionDate(new Date().toISOString().split('T')[0]);
        setAnimalCount('');
        setTotalCost('');
    }
  }, [isOpen, defaultCategory]);


  const handleSaveBatch = () => {
    if (!name || !breed || !defaultCategory || !animalCount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out Name, Breed, and Animal Count.",
      });
      return;
    }

    const count = parseInt(animalCount, 10);
    const cost = totalCost ? parseFloat(totalCost) : 0;

    // We can represent a batch as a single livestock item with a plural name
    // and store the count in the tagId or a custom field if we extend the type.
    // For now, let's use the name and tagId.
    const newBatch = {
      id: `batch-${Date.now()}`,
      name: `${name} (${count} animals)`,
      tagId: `batch-${count}`, // Store count in tagId
      birthDate: acquisitionDate, // Use birthDate for acquisition date
      gender: 'Female' as const, // Placeholder, not applicable for mixed batches
      breed,
      category: defaultCategory,
      status: 'Active' as const,
      imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
      imageHint: `${breed.toLowerCase()} group`,
      healthRecords: [],
      productionMetrics: [],
    };

    livestockData.push(newBatch);

    // Add a financial record for the cost of the batch
    if (cost > 0) {
      const newExpense: import('@/lib/data').FinancialRecord = {
        id: `fin-${Date.now()}`,
        type: 'Expense',
        category: 'Livestock Purchase',
        amount: cost,
        date: acquisitionDate,
        description: `Purchase of batch: ${name}`,
      };
      financialData.push(newExpense);
    }

    toast({
      title: "Batch Added",
      description: `${name} has been added to your records.`,
    });
    
    onOpenChange(false);
  };
  
  const currentBreedOptions = defaultCategory ? breedOptions[defaultCategory as keyof typeof breedOptions] || [] : [];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add a New Batch</SheetTitle>
          <SheetDescription>
            Enter the details for the new batch of {defaultCategory?.toLowerCase()}.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Batch Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Spring Chickens 2024" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Combobox
                    options={currentBreedOptions}
                    value={breed}
                    onChange={setBreed}
                    placeholder="Select or type breed..."
                    emptyMessage="No preset breeds for this category."
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                <Input id="acquisitionDate" type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="animal-count">Number of Animals</Label>
                <Input id="animal-count" type="number" value={animalCount} onChange={(e) => setAnimalCount(e.target.value)} placeholder="e.g., 50" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="total-cost">Total Cost (Optional)</Label>
                <Input id="total-cost" type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="e.g., 250.00" />
            </div>
          </div>

        </div>
        <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSaveBatch}>Save Batch</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
