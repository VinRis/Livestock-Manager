
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddAnimalSheet from "./add-animal-sheet";
import { Livestock } from "@/lib/data";

interface AddCategorySheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category: 'Cattle' | 'Sheep' | 'Goats' | 'Pigs' | 'Chickens';
  onAddAnimal: (animal: Livestock) => void;
  livestockData: Livestock[];
}

export default function AddCategorySheet({ children, isOpen, onOpenChange, category, onAddAnimal, livestockData }: AddCategorySheetProps) {
    const [addAnimalSheetOpen, setAddAnimalSheetOpen] = useState(false);

    const handleOpenAddAnimal = () => {
        onOpenChange(false); // Close current sheet
        setAddAnimalSheetOpen(true); // Open add animal sheet
    }

  return (
    <>
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="max-h-[100vh] overflow-y-auto">
                <SheetHeader>
                <SheetTitle>Add to {category}</SheetTitle>
                <SheetDescription>
                    There are no animals in the "{category}" category yet. Add your first one to get started.
                </SheetDescription>
                </SheetHeader>
                <div className="py-8 flex justify-center">
                    <Button onClick={handleOpenAddAnimal}>Add First Animal</Button>
                </div>
            </SheetContent>
        </Sheet>

        <AddAnimalSheet 
            isOpen={addAnimalSheetOpen}
            onOpenChange={setAddAnimalSheetOpen}
            defaultCategory={category}
            onAddAnimal={onAddAnimal}
            livestockData={livestockData}
        >
            <div />
        </AddAnimalSheet>
    </>
  );
}
