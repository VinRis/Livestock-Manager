
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useMemo } from "react";
import AddAnimalSheet from "./add-animal-sheet";
import AddCategorySheet from "./add-category-sheet";
import AddNewCategorySheet from "./add-new-category-sheet";
import EditCategorySheet from "./edit-category-sheet";


export type LivestockCategoryName = 'Cattle' | 'Sheep' | 'Goats' | 'Pigs' | 'Chickens' | string;

export type ManagementStyle = 'animal' | 'batch';

export type LivestockCategory = {
  name: LivestockCategoryName;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  animals: Livestock[];
  managementStyle: ManagementStyle;
};

export type CategoryDefinition = {
    name: LivestockCategoryName;
    icon: React.ComponentType<{ className?: string }>;
    managementStyle: ManagementStyle;
}

const initialCategories: CategoryDefinition[] = [
    { name: 'Cattle', icon: CowIcon, managementStyle: 'animal' },
    { name: 'Sheep', icon: SheepIcon, managementStyle: 'animal' },
    { name: 'Goats', icon: GoatIcon, managementStyle: 'animal' },
];

function LivestockCategoryList() {
  const [addAnimalSheetOpen, setAddAnimalSheetOpen] = useState(false);
  const [addCategorySheetOpen, setAddCategorySheetOpen] = useState(false);
  const [addNewCategorySheetOpen, setAddNewCategorySheetOpen] = useState(false);
  const [editCategorySheetOpen, setEditCategorySheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LivestockCategoryName>('Cattle');
  const [editingCategory, setEditingCategory] = useState<CategoryDefinition | null>(null);

  
  const [allCategories, setAllCategories] = useState<CategoryDefinition[]>(initialCategories);

  const handleAddCategory = (newCategoryName: string, managementStyle: ManagementStyle) => {
    if (newCategoryName && !allCategories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setAllCategories(prev => [...prev, { name: newCategoryName, icon: CowIcon, managementStyle: managementStyle }]); // Using CowIcon as default for new categories
    }
  };

  const handleDeleteCategory = (categoryName: LivestockCategoryName) => {
    setAllCategories(prev => prev.filter(c => c.name !== categoryName));
  };

  const handleEditClick = (category: CategoryDefinition) => {
    setEditingCategory(category);
    setEditCategorySheetOpen(true);
  }

  const handleUpdateCategory = (updatedCategory: CategoryDefinition) => {
    setAllCategories(prev => prev.map(c => c.name === updatedCategory.name ? updatedCategory : c));
    setEditingCategory(null);
  }
  
  const categories: LivestockCategory[] = useMemo(() => {
    return allCategories.map(cat => {
        const animals = livestockData.filter(animal => animal.category === cat.name);
        return {
          name: cat.name,
          icon: cat.icon,
          animals: animals,
          count: animals.length,
          managementStyle: cat.managementStyle
        }
    });
  }, [allCategories]);

  const handleAddClick = (category: LivestockCategory) => {
    setSelectedCategory(category.name);
    if (category.count === 0) {
        setAddCategorySheetOpen(true);
    } else {
        setAddAnimalSheetOpen(true);
    }
  }
  
  const existingCategoryNames = useMemo(() => allCategories.map(c => c.name), [allCategories]);

  return (
    <>
      <PageHeader title="Livestock Categories" description="Manage your herd by categories.">
         <AddNewCategorySheet 
            isOpen={addNewCategorySheetOpen} 
            onOpenChange={setAddNewCategorySheetOpen} 
            onAddCategory={handleAddCategory}
            existingCategories={existingCategoryNames}
          >
            <Button onClick={() => setAddNewCategorySheetOpen(true)}>
                <PlusCircle />
                Add Category
            </Button>
         </AddNewCategorySheet>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const categoryDefinition = allCategories.find(c => c.name === category.name)!;
            return (
            <Card key={category.name}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <category.icon className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          {category.count} {category.managementStyle === 'batch' ? (category.count === 1 ? 'Batch' : 'Batches') : (category.count === 1 ? 'Animal' : 'Animals')}
                        </CardDescription>
                     </div>
                  </div>
                </div>
                <AlertDialog>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddClick(category)}>
                              <PlusCircle className="mr-2 h-4 w-4"/>Add {category.managementStyle === 'batch' ? 'Batch' : 'Animal'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(categoryDefinition)}><Edit className="mr-2 h-4 w-4"/>Edit Category</DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4"/>Delete Category
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                      </DropdownMenuContent>
                  </DropdownMenu>
                   <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the 
                          <strong> {category.name}</strong> category. Any animals in this category will not be deleted but will need to be re-categorized.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.name)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardHeader>
              <CardContent>
                {category.count > 0 ? (
                    <>
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
                    </>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        <p>No {category.managementStyle === 'batch' ? 'batches' : 'animals'} in this category.</p>
                        <Button variant="secondary" className="mt-2" onClick={() => handleAddClick(category)}>
                             {category.managementStyle === 'batch' ? 'Add First Batch' : 'Add First Animal'}
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      </main>
      <AddAnimalSheet isOpen={addAnimalSheetOpen} onOpenChange={setAddAnimalSheetOpen} defaultCategory={selectedCategory as 'Cattle' | 'Sheep' | 'Goats'} >
        <div />
      </AddAnimalSheet>
      <AddCategorySheet
        isOpen={addCategorySheetOpen}
        onOpenChange={setAddCategorySheetOpen}
        category={selectedCategory as 'Cattle' | 'Sheep' | 'Goats' | 'Pigs' | 'Chickens'}
      >
        <div/>
      </AddCategorySheet>
       {editingCategory && (
        <EditCategorySheet
          isOpen={editCategorySheetOpen}
          onOpenChange={setEditCategorySheetOpen}
          category={editingCategory}
          onUpdateCategory={handleUpdateCategory}
        />
      )}
    </>
  );
}

function AnimalList({ category }: { category: string }) {
    const [isSheetOpen, setSheetOpen] = useState(false);

    const categoryName = category.charAt(0).toUpperCase() + category.slice(1) as LivestockCategoryName;
    const animals = livestockData.filter(animal => animal.category.toLowerCase() === category.toLowerCase());

    return (
        <>
            <PageHeader title={`${categoryName} List`} description={`All animals in the ${categoryName} category.`}>
                <Button variant="outline" asChild>
                    <Link href="/livestock"><ArrowLeft /> Back to Categories</Link>
                </Button>
                 <AddAnimalSheet isOpen={isSheetOpen} onOpenChange={setSheetOpen} defaultCategory={categoryName as 'Cattle' | 'Sheep' | 'Goats'}>
                    <Button>
                        <PlusCircle />
                        Add Animal
                    </Button>
                </AddAnimalSheet>
            </PageHeader>
            <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                     {animals.map(animal => (
                        <Card key={animal.id} className="overflow-hidden rounded-lg">
                           <Link href={`/livestock/${animal.id}`} className="block relative group">
                                <Image
                                    src={animal.imageUrl}
                                    alt={animal.name}
                                    width={400}
                                    height={250}
                                    className="object-cover w-full aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={animal.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="font-semibold text-lg text-white drop-shadow-md">{animal.name}</h3>
                                    <p className="text-sm text-white/80 drop-shadow-md">Tag ID: {animal.tagId}</p>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
                 {animals.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                            <h3 className="text-xl font-medium">No animals in this category yet.</h3>
                            <p className="text-muted-foreground">Get started by adding a new animal.</p>
                             <AddAnimalSheet isOpen={isSheetOpen} onOpenChange={setSheetOpen} defaultCategory={categoryName as 'Cattle' | 'Sheep' | 'Goats'}>
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
