
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

interface AddCategorySheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function AddCategorySheet({ children, isOpen, onOpenChange }: AddCategorySheetProps) {
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState('');
  const [breeds, setBreeds] = useState('');

  const handleSaveCategory = () => {
    if (!categoryName || !breeds) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to add a new category.",
      });
      return;
    }

    // In a real app, you'd save this to your database.
    // For now, we'll just show a success message.
    console.log({
      name: categoryName,
      breeds: breeds.split(',').map(b => b.trim()),
    });

    toast({
      title: "Category Added",
      description: `The "${categoryName}" category has been added.`,
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
            <Input 
              id="category-name" 
              value={categoryName} 
              onChange={(e) => setCategoryName(e.target.value)} 
              placeholder="e.g., Dairy Cattle" 
            />
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
