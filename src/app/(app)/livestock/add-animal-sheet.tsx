
"use client";

import { useState, useRef, useEffect } from "react";
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
  const [breed, setBreed] = useState('');
  const [type, setType] = useState<'cattle' | 'sheep' | 'goats' | ''>('');
  const [sireId, setSireId] = useState('unknown');
  const [damId, setDamId] = useState('unknown');
  
  useEffect(() => {
    if (defaultType) {
        setType(defaultType);
        if (breedOptions[defaultType]?.length > 0) {
          setBreed(breedOptions[defaultType][0]);
        } else {
          setBreed('');
        }
    } else {
        setType('');
        setBreed('');
    }
  }, [defaultType, isOpen]); // Reset when sheet is opened/closed or type changes


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
      sireId: sireId && sireId !== 'unknown' ? sireId : undefined,
      damId: damId && damId !== 'unknown' ? damId : undefined,
      status: 'Active' as const,
      imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
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
    setSireId('unknown');
    setDamId('unknown');
    
    // Don't reset type/breed if it's defaulted
    if (!defaultType) {
        setType('');
        setBreed('');
    }
    
    onOpenChange(false);
  };
  
  const handleTypeChange = (value: 'cattle' | 'sheep' | 'goats') => {
      setType(value);
      setBreed(breedOptions[value]?.[0] || '');
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
                <Select value={breed} onValueChange={setBreed}>
                    <SelectTrigger id="breed">
                        <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                        {type && breedOptions[type as 'cattle' | 'sheep' | 'goats']?.map(b => (
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
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="sireId">Sire (Father)</Label>
                    <Select value={sireId} onValueChange={setSireId}>
                        <SelectTrigger id="sireId">
                            <SelectValue placeholder="Select Sire" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unknown">Unknown</SelectItem>
                            {livestockData.filter(a => a.gender === 'Male').map(male => (
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
                            {livestockData.filter(a => a.gender === 'Female').map(female => (
                                <SelectItem key={female.id} value={female.id}>{female.name} ({female.tagId})</SelectItem>
                            ))}
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

    