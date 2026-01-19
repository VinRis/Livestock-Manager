
"use client";

import { useState, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ManagementStyle } from "./page";

interface AddNewCategorySheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddCategory: (categoryName: string, managementStyle: ManagementStyle) => void;
  existingCategories: string[];
}

const potentialCategories = ["Alpacas", "Cattle", "Chickens", "Dogs", "Donkeys", "Doves", "Ducks", "Goats", "Geese", "Guinea Fowl", "Horses", "Llamas", "Ostrich", "Pheasants", "Pigeons", "Pigs", "Quail", "Rabbits", "Sheep", "Turkeys"];

export default function AddNewCategorySheet({ children, isOpen, onOpenChange, onAddCategory, existingCategories }: AddNewCategorySheetProps) {
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState('');
  const [managementStyle, setManagementStyle] = useState<ManagementStyle>('animal');

  const availableCategories = useMemo(() => {
    return potentialCategories.filter(cat => !existingCategories.includes(cat));
  }, [existingCategories]);

  const handleSaveCategory = () => {
    if (!categoryName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a category to add.",
      });
      return;
    }

    onAddCategory(categoryName, managementStyle);

    toast({
      title: "Category Added",
      description: `The "${categoryName}" category has been created.`,
    });

    setCategoryName('');
    setManagementStyle('animal');
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Category</SheetTitle>
          <SheetDescription>
            Choose a new livestock category and how you'll manage them.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Select value={categoryName} onValueChange={setCategoryName}>
              <SelectTrigger id="category-name">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.length > 0 ? (
                  availableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">All available categories have been added.</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Management Style</Label>
            <RadioGroup value={managementStyle} onValueChange={(val) => setManagementStyle(val as ManagementStyle)} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="animal" id="animal-style" className="peer sr-only" />
                <Label htmlFor="animal-style" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Per Animal
                </Label>
              </div>
               <div>
                <RadioGroupItem value="batch" id="batch-style" className="peer sr-only" />
                <Label htmlFor="batch-style" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  In Batches
                </Label>
              </div>
            </RadioGroup>
             <p className="text-xs text-muted-foreground mt-2 px-1">
                Choose 'Per Animal' for detailed individual records, or 'In Batches' for managing groups like poultry.
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
