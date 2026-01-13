
"use client"

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PlusCircle, MoreVertical, Trash2, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { livestockData, type Livestock } from "@/lib/data";
import { CowIcon, GoatIcon, SheepIcon } from "@/components/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import AddAnimalSheet from "./add-animal-sheet";
import AddCategorySheet from "./add-category-sheet";

type LivestockCategory = {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  animals: Livestock[];
  type: 'cattle' | 'sheep' | 'goats';
};

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years} years, ${months} months`;
}

function LivestockCategoryList() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  const categories = livestockData.reduce((acc, animal) => {
    let categoryName = "Cattle"; 
    let icon = CowIcon;
    let type: 'cattle' | 'sheep' | 'goats' = 'cattle';

    if (['Merino'].includes(animal.breed)) {
      categoryName = 'Sheep';
      icon = SheepIcon;
      type = 'sheep';
    } else if (['Boer'].includes(animal.breed)) {
      categoryName = 'Goats';
      icon = GoatIcon;
      type = 'goats';
    }
    
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, count: 0, icon: icon, animals: [], type: type };
    }
    
    acc[categoryName].count++;
    acc[categoryName].animals.push(animal);
    
    return acc;
  }, {} as Record<string, LivestockCategory>);

  const livestockCategories = Object.values(categories);

  return (
    <>
      <PageHeader title="Livestock Categories" description="Manage your herd by categories.">
         <AddCategorySheet isOpen={isSheetOpen} onOpenChange={setSheetOpen}>
          <Button>
            <PlusCircle />
            Add Category
          </Button>
        </AddCategorySheet>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {livestockCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <category.icon className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>{category.count} Animals</CardDescription>
                     </div>
                  </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    {category.animals.slice(0,5).map(animal => (
                         <Image
                            key={animal.id}
                            className="h-10 w-10 rounded-full border-2 border-card object-cover"
                            src={animal.imageUrl}
                            alt={animal.name}
                            width={40}
                            height={40}
                            data-ai-hint={animal.imageHint}
                        />
                    ))}
                    {category.count > 5 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                            +{category.count - 5}
                        </div>
                    )}
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href={`/livestock?category=${category.name.toLowerCase()}`}>View All</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

function AnimalList({ category }: { category: string }) {
    const [isSheetOpen, setSheetOpen] = useState(false);

    const getCategoryDetails = (categoryName: string) => {
        if (categoryName === 'sheep') return { name: 'Sheep', breeds: ['Merino'], type: 'sheep' as const };
        if (categoryName === 'goats') return { name: 'Goats', breeds: ['Boer'], type: 'goats' as const };
        return { name: 'Cattle', breeds: ['Holstein', 'Angus'], type: 'cattle' as const };
    }

    const { name: categoryName, breeds, type } = getCategoryDetails(category);
    const animals = livestockData.filter(animal => breeds.includes(animal.breed));

    return (
        <>
            <PageHeader title={`${categoryName} List`} description={`All animals in the ${categoryName} category.`}>
                <Button variant="outline" asChild>
                    <Link href="/livestock"><ArrowLeft /> Back to Categories</Link>
                </Button>
                 <AddAnimalSheet isOpen={isSheetOpen} onOpenChange={setSheetOpen} defaultType={type}>
                    <Button>
                        <PlusCircle />
                        Add Animal
                    </Button>
                </AddAnimalSheet>
            </PageHeader>
            <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {animals.map(animal => (
                        <Card key={animal.id} className="overflow-hidden">
                            <Link href={`/livestock/${animal.id}`} className="block">
                                <Image
                                    src={animal.imageUrl}
                                    alt={animal.name}
                                    width={400}
                                    height={250}
                                    className="object-cover w-full h-40"
                                    data-ai-hint={animal.imageHint}
                                />
                            </Link>
                            <CardContent className="p-4">
                                <Link href={`/livestock/${animal.id}`}>
                                    <h3 className="font-semibold text-lg hover:underline">{animal.name}</h3>
                                </Link>
                                <p className="text-sm text-muted-foreground">Tag ID: {animal.tagId}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge>{animal.breed}</Badge>
                                    <Badge variant="secondary">{animal.gender}</Badge>
                                    <Badge variant="outline">{calculateAge(animal.birthDate)}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 {animals.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                            <h3 className="text-xl font-medium">No animals in this category yet.</h3>
                            <p className="text-muted-foreground">Get started by adding a new animal.</p>
                             <AddAnimalSheet isOpen={isSheetOpen} onOpenChange={setSheetOpen} defaultType={type}>
                                <Button>
                                    <PlusCircle />
                                    Add Animal
                                </Button>
                            </AddAnimalSheet>
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    );
}

export default function LivestockPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  if (category) {
    return <AnimalList category={category} />;
  }
  
  return <LivestockCategoryList />;
}
