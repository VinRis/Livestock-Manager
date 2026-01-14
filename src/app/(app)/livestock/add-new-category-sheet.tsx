
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

interface AddNewCategorySheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddCategory: (categoryName: string) => void;
}

export default function AddNewCategorySheet({ children, isOpen, onOpenChange, onAddCategory }: AddNewCategorySheetProps) {
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState('');

  const handleSaveCategory = () => {
    if (!categoryName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a name for the new category.",
      });
      return;
    }

    onAddCategory(categoryName);

    toast({
      title: "Category Added",
      description: `The "${categoryName}" category has been created.`,
    });

    setCategoryName('');
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
            Enter a name for the new livestock category (e.g., Pigs, Chickens).
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input 
              id="category-name" 
              value={categoryName} 
              onChange={(e) => setCategoryName(e.target.value)} 
              placeholder="e.g., Pigs" 
            />
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
