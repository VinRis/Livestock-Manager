
"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ManagementStyle } from "./page";
import type { CategoryDefinition } from "@/lib/data";

interface EditCategorySheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category: CategoryDefinition;
  onUpdateCategory: (category: CategoryDefinition) => void;
}

export default function EditCategorySheet({
  isOpen,
  onOpenChange,
  category,
  onUpdateCategory,
}: EditCategorySheetProps) {
  const { toast } = useToast();
  const [managementStyle, setManagementStyle] = useState<ManagementStyle>(category.managementStyle);

  useEffect(() => {
    if (isOpen) {
      setManagementStyle(category.managementStyle);
    }
  }, [isOpen, category]);

  const handleSaveChanges = () => {
    onUpdateCategory({ ...category, managementStyle });
    toast({
      title: "Category Updated",
      description: `The management style for "${category.name}" has been changed.`,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category: {category.name}</SheetTitle>
          <SheetDescription>
            Update the management style for this category.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label>Management Style</Label>
            <RadioGroup
              value={managementStyle}
              onValueChange={(val) => setManagementStyle(val as ManagementStyle)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="animal" id="edit-animal-style" className="peer sr-only" />
                <Label
                  htmlFor="edit-animal-style"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Per Animal
                </Label>
              </div>
              <div>
                <RadioGroupItem value="batch" id="edit-batch-style" className="peer sr-only" />
                <Label
                  htmlFor="edit-batch-style"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
