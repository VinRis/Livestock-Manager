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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categoriesData, type Livestock } from "@/lib/data";
import { Combobox } from "@/components/ui/combobox";

interface AddAnimalSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultCategory?: 'Cattle' | 'Sheep' | 'Goats' | string;
  onAddAnimal: (animal: Livestock) => void;
  livestockData: Livestock[];
}

const breedOptions = {
    Cattle: ["Ayrshire", "Brown Swiss", "Guernsey", "Holstein", "Jersey", "Angus", "Hereford", "Shorthorn", "Simmental", "Charolais", "Brahman"].map(b => ({ value: b, label: b })),
    Sheep: ["Merino", "Rambouillet", "Dorset", "Hampshire", "Suffolk", "Shropshire"].map(b => ({ value: b, label: b })),
    Goats: ["Boer", "Nubian", "Alpine", "LaMancha", "Saanen", "Toggenburg"].map(b => ({ value: b, label: b })),
    Pigs: ["Duroc", "Hampshire", "Yorkshire"].map(b => ({ value: b, label: b })),
    Chickens: ["Leghorn", "Rhode Island Red", "Plymouth Rock"].map(b => ({ value: b, label: b })),
};

export default function AddAnimalSheet({ children, isOpen, onOpenChange, defaultCategory, onAddAnimal, livestockData }: AddAnimalSheetProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [breed, setBreed] = useState('');
  const [category, setCategory] = useState<'Cattle' | 'Sheep' | 'Goats' | string | ''>('');
  const [sireId, setSireId] = useState('unknown');
  const [damId, setDamId] = useState('unknown');
  
  useEffect(() => {
    if (defaultCategory) {
        setCategory(defaultCategory);
    }
    // Always clear breed when sheet opens or category changes
    if (isOpen) {
        setBreed('');
    }
  }, [defaultCategory, isOpen]);


  const handleSaveAnimal = () => {
    if (!name || !tagId || !birthDate || !gender || !breed || !category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to add a new animal.",
      });
      return;
    }

    const newAnimal: Livestock = {
      id: `ll-${Date.now()}`,
      name,
      tagId,
      birthDate,
      gender: gender as 'Male' | 'Female',
      breed,
      category: category,
      sireId: sireId && sireId !== 'unknown' ? sireId : undefined,
      damId: damId && damId !== 'unknown' ? damId : undefined,
      status: 'Active' as const,
      imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
      imageHint: 'animal',
      healthRecords: [],
      productionMetrics: [],
    };

    onAddAnimal(newAnimal);

    toast({
      title: "Animal Added",
      description: `${name} has been added to your herd.`,
    });

    // Reset form
    setName('');
    setTagId('');
    setBirthDate(new Date().toISOString().split('T')[0]);
    setGender('');
    setSireId('unknown');
    setDamId('unknown');
    setBreed('');
    
    // Don't reset type if it's defaulted
    if (!defaultCategory) {
        setCategory('');
    }
    
    onOpenChange(false);
  };
  
  const handleCategoryChange = (value: string) => {
      setCategory(value);
      setBreed('');
  }

  const currentBreedOptions = category ? breedOptions[category as keyof typeof breedOptions] || [] : [];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Add a New Animal</SheetTitle>
          <SheetDescription>
            Enter the details for the new animal to add it to your records.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 p-6 overflow-y-auto">
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
                <Label htmlFor="animal-type">Animal Category</Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="animal-type">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categoriesData.map(cat => (
                           <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Combobox
                    options={currentBreedOptions}
                    value={breed}
                    onChange={setBreed}
                    placeholder="Select or type breed..."
                    emptyMessage="No preset breeds found."
                />
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
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="sireId">Sire (Father)</Label>
                    <Select value={sireId} onValueChange={setSireId}>
                        <SelectTrigger id="sireId">
                            <SelectValue placeholder="Select Sire" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unknown">Unknown</SelectItem>
                            {livestockData && livestockData.filter(a => a.gender === 'Male').map(male => (
                                <SelectItem key={male.id} value={male.id}>{male.name} ({male.tagId})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="damId">Dam (Mother)</Label>
                    <Select value={damId} onValueChange={setDamId}>
                        <SelectTrigger id="damId">
                            <SelectValue placeholder="Select Dam" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unknown">Unknown</SelectItem>
                            {livestockData && livestockData.filter(a => a.gender === 'Female').map(female => (
                                <SelectItem key={female.id} value={female.id}>{female.name} ({female.tagId})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
           </div>
        </div>
        <SheetFooter className="p-6 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSaveAnimal}>Save Animal</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
