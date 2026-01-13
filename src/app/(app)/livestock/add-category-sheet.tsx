
"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { livestockData } from "@/lib/data";

interface AddCategorySheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const allPossibleCategories = [
    "Cattle", "Goats", "Sheep", "Chickens", "Ducks", "Pigs", "Guinea fowl", "Ostrich", "Dogs", "Rabbits"
];

export default function AddCategorySheet({ children, isOpen, onOpenChange }: AddCategorySheetProps) {
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState('');
  const [breeds, setBreeds] = useState('');

  const existingCategories = livestockData.reduce((acc, animal) => {
    let category = "Cattle";
    if (['Merino'].includes(animal.breed)) category = 'Sheep';
    else if (['Boer'].includes(animal.breed)) category = 'Goats';
    acc.add(category);
    return acc;
  }, new Set<string>());

  const availableCategories = allPossibleCategories.filter(cat => !existingCategories.has(cat));

  const handleSaveCategory = () => {
    if (!categoryName || !breeds) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a category and enter at least one breed.",
      });
      return;
    }

    // In a real app, you'd save this to your database.
    // This would likely involve creating a new category entity and associating breeds with it.
    // For now, we'll just show a success message as the data structure doesn't support new categories without animals.
    console.log({
      name: categoryName,
      breeds: breeds.split(',').map(b => b.trim()),
    });

    toast({
      title: "Category Added",
      description: `The "${categoryName}" category has been conceptually added. Add an animal of this breed to see it in the list.`,
    });

    // Reset form
    setCategoryName('');
    setBreeds('');
    
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add a New Livestock Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your animals.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Select value={categoryName} onValueChange={setCategoryName}>
                <SelectTrigger id="category-name">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="breeds">Breeds</Label>
            <Input 
              id="breeds" 
              value={breeds} 
              onChange={(e) => setBreeds(e.target.value)} 
              placeholder="e.g., Holstein, Jersey" 
            />
            <p className="text-xs text-muted-foreground">
              Enter a comma-separated list of breeds for this category.
            </p>
          </div>
        </div>
        <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save Category</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
