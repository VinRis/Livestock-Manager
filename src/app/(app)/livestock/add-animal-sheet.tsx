
"use client";

import { useState, useRef } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { livestockData, updateLivestock } from "@/lib/data";

interface AddAnimalSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultType?: 'cattle' | 'sheep' | 'goats';
}

const breedOptions = {
    cattle: ['Holstein', 'Angus'],
    sheep: ['Merino'],
    goats: ['Boer'],
};

export default function AddAnimalSheet({ children, isOpen, onOpenChange, defaultType }: AddAnimalSheetProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [breed, setBreed] = useState(defaultType ? breedOptions[defaultType][0] : '');
  const [type, setType] = useState(defaultType || '');

  const handleSaveAnimal = () => {
    if (!name || !tagId || !birthDate || !gender || !breed) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to add a new animal.",
      });
      return;
    }

    const newAnimal = {
      id: `ll-${Date.now()}`,
      name,
      tagId,
      birthDate,
      gender: gender as 'Male' | 'Female',
      breed,
      status: 'Active' as const,
      imageUrl: 'https://picsum.photos/seed/new/600/400',
      imageHint: 'animal',
      healthRecords: [],
      productionMetrics: [],
    };

    livestockData.push(newAnimal);

    toast({
      title: "Animal Added",
      description: `${name} has been added to your herd.`,
    });

    // Reset form
    setName('');
    setTagId('');
    setBirthDate(new Date().toISOString().split('T')[0]);
    setGender('');
    setBreed('');
    setType('');
    onOpenChange(false);
  };
  
  const handleTypeChange = (value: 'cattle' | 'sheep' | 'goats') => {
      setType(value);
      setBreed(breedOptions[value][0] || '');
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add a New Animal</SheetTitle>
          <SheetDescription>
            Enter the details for the new animal to add it to your records.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Daisy" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagId">Tag ID</Label>
            <Input id="tagId" value={tagId} onChange={(e) => setTagId(e.target.value)} placeholder="e.g., LL-006" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="animal-type">Animal Type</Label>
                <Select value={type} onValueChange={handleTypeChange} disabled={!!defaultType}>
                    <SelectTrigger id="animal-type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cattle">Cattle</SelectItem>
                        <SelectItem value="sheep">Sheep</SelectItem>
                        <SelectItem value="goats">Goats</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Select value={breed} onValueChange={setBreed} disabled={!type}>
                    <SelectTrigger id="breed">
                        <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                        {type && breedOptions[type as 'cattle' | 'sheep' | 'goats'].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={(value) => setGender(value as 'Male' | 'Female' | '')}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
           </div>
        </div>
        <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSaveAnimal}>Save Animal</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
