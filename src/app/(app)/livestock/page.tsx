
"use client"

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PlusCircle, MoreVertical, Trash2, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { livestockData as initialLivestockData, categoriesData as initialCategoriesData, type CategoryDefinition, type Livestock } from "@/lib/data";
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
} from "@/components/ui/alert-dialog";
import { useState, useMemo, useReducer } from "react";
import AddAnimalSheet from "./add-animal-sheet";
import AddCategorySheet from "./add-category-sheet";
import AddNewCategorySheet from "./add-new-category-sheet";
import EditCategorySheet from "./edit-category-sheet";
import AddBatchSheet from "./add-batch-sheet";


export type LivestockCategoryName = string;

export type ManagementStyle = 'animal' | 'batch';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  CowIcon,
  SheepIcon,
  GoatIcon,
};

export type LivestockCategory = {
  name: LivestockCategoryName;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  animals: import("@/lib/data").Livestock[];
  managementStyle: ManagementStyle;
};


function LivestockCategoryList({
  livestockData,
  categoriesData,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddAnimal,
  onAddBatch,
}: {
  livestockData: Livestock[];
  categoriesData: CategoryDefinition[];
  onAddCategory: (newCategoryName: string, managementStyle: ManagementStyle) => void;
  onUpdateCategory: (updatedCategory: CategoryDefinition) => void;
  onDeleteCategory: (categoryName: LivestockCategoryName) => void;
  onAddAnimal: (animal: Livestock) => void;
  onAddBatch: (batch: Livestock) => void;
}) {
  const [addAnimalSheetOpen, setAddAnimalSheetOpen] = useState(false);
  const [addBatchSheetOpen, setAddBatchSheetOpen] = useState(false);
  const [addCategorySheetOpen, setAddCategorySheetOpen] = useState(false);
  const [addNewCategorySheetOpen, setAddNewCategorySheetOpen] = useState(false);
  const [editCategorySheetOpen, setEditCategorySheetOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LivestockCategoryName>('Cattle');
  const [editingCategory, setEditingCategory] = useState<CategoryDefinition | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<LivestockCategoryName | null>(null);
  
  const handleDeleteRequest = (categoryName: LivestockCategoryName) => {
    setTimeout(() => {
        setDeletingCategory(categoryName);
        setDeleteConfirmationOpen(true);
    }, 0);
  };
  
  const handleConfirmDelete = () => {
    if(!deletingCategory) return;
    onDeleteCategory(deletingCategory);
    setDeleteConfirmationOpen(false);
    setDeletingCategory(null);
  };

  const handleEditClick = (category: CategoryDefinition) => {
    setTimeout(() => {
        setEditingCategory(category);
        setEditCategorySheetOpen(true);
    }, 0);
  }
  
  const categories: LivestockCategory[] = useMemo(() => {
    return categoriesData.map(cat => {
        const animals = livestockData.filter(animal => animal.category === cat.name);
        const IconComponent = iconMap[cat.icon] || CowIcon;
        return {
          name: cat.name,
          icon: IconComponent,
          animals: animals,
          count: animals.length,
          managementStyle: cat.managementStyle
        }
    });
  }, [livestockData, categoriesData]);

  const handleAddClick = (category: LivestockCategory) => {
    setSelectedCategory(category.name);
    if (category.managementStyle === 'batch') {
        setAddBatchSheetOpen(true);
    } else if (category.count === 0) {
        setAddCategorySheetOpen(true);
    } else {
        setAddAnimalSheetOpen(true);
    }
  }
  
  const existingCategoryNames = useMemo(() => categoriesData.map(c => c.name), [categoriesData]);

  return (
    <>
      <PageHeader title="Livestock Categories" />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const categoryDefinition = categoriesData.find(c => c.name === category.name)!;
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
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleAddClick(category)}>
                              <PlusCircle className="mr-2 h-4 w-4"/>Add {category.managementStyle === 'batch' ? 'Batch' : 'Animal'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleEditClick(categoryDefinition)}><Edit className="mr-2 h-4 w-4"/>Edit Category</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDeleteRequest(category.name)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/>Delete Category
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
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
      
      <AddAnimalSheet 
          isOpen={addAnimalSheetOpen} 
          onOpenChange={setAddAnimalSheetOpen} 
          defaultCategory={selectedCategory}
          onAddAnimal={onAddAnimal} 
          livestockData={livestockData}
      >
          <div/>
      </AddAnimalSheet>
      
      <AddBatchSheet 
          isOpen={addBatchSheetOpen} 
          onOpenChange={setAddBatchSheetOpen}
          defaultCategory={selectedCategory}
          onAddBatch={onAddBatch}
      >
          <div/>
      </AddBatchSheet>

      <AddNewCategorySheet 
        isOpen={addNewCategorySheetOpen} 
        onOpenChange={setAddNewCategorySheetOpen} 
        onAddCategory={onAddCategory}
        existingCategories={existingCategoryNames}
      >
        <Button className="absolute bottom-20 right-4 h-14 w-14 rounded-full shadow-lg sm:bottom-20">
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Add Category</span>
        </Button>
      </AddNewCategorySheet>

       <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the 
                        <strong> {deletingCategory}</strong> category. Any animals in this category will not be deleted but will need to be re-categorized.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingCategory(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      <AddCategorySheet
        isOpen={addCategorySheetOpen}
        onOpenChange={setAddCategorySheetOpen}
        category={selectedCategory as 'Cattle' | 'Sheep' | 'Goats' | 'Pigs' | 'Chickens'}
        onAddAnimal={onAddAnimal}
        livestockData={livestockData}
      >
        <div/>
      </AddCategorySheet>
       {editingCategory && (
        <EditCategorySheet
          isOpen={editCategorySheetOpen}
          onOpenChange={setEditCategorySheetOpen}
          category={editingCategory}
          onUpdateCategory={onUpdateCategory}
        />
      )}
    </>
  );
}

function AnimalList({ 
    category,
    livestockData,
    categoriesData,
    onAddAnimal,
    onAddBatch,
}: { 
    category: string, 
    livestockData: Livestock[],
    categoriesData: CategoryDefinition[],
    onAddAnimal: (animal: Livestock) => void,
    onAddBatch: (batch: Livestock) => void,
}) {
    const [isSheetOpen, setSheetOpen] = useState(false);

    const animals = useMemo(() => {
        return livestockData.filter(animal => animal.category.toLowerCase() === category.toLowerCase());
    }, [category, livestockData]);

    const categoryDef = categoriesData.find(c => c.name.toLowerCase() === category.toLowerCase());

    if (!categoryDef) {
        return <div>Category not found</div>
    }

    const onSheetOpenChange = (isOpen: boolean) => {
        setSheetOpen(isOpen);
    }

    const categoryName = categoryDef.name as LivestockCategoryName;
    const AddSheetComponent = categoryDef.managementStyle === 'batch' ? AddBatchSheet : AddAnimalSheet;
    const onAdd = categoryDef.managementStyle === 'batch' ? onAddBatch : onAddAnimal;

    return (
        <>
            <PageHeader title={`${categoryName} List`}>
                <Button variant="outline" asChild>
                    <Link href="/livestock"><ArrowLeft /> Back to Categories</Link>
                </Button>
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
                            <h3 className="text-xl font-medium">No {categoryDef.managementStyle === 'batch' ? 'batches' : 'animals'} in this category yet.</h3>
                            <p className="text-muted-foreground">Get started by adding a new one.</p>
                             <AddSheetComponent 
                                isOpen={isSheetOpen} 
                                onOpenChange={onSheetOpenChange} 
                                defaultCategory={categoryName}
                                onAddAnimal={onAddAnimal}
                                onAddBatch={onAddBatch}
                                livestockData={livestockData}
                            >
                                <Button onClick={() => setSheetOpen(true)}>
                                    <PlusCircle />
                                    Add {categoryDef.managementStyle === 'batch' ? 'Batch' : 'Animal'}
                                </Button>
                            </AddSheetComponent>
                        </CardContent>
                    </Card>
                )}
            </main>
             <AddSheetComponent 
                isOpen={isSheetOpen} 
                onOpenChange={onSheetOpenChange} 
                defaultCategory={categoryName} 
                onAddAnimal={onAddAnimal} 
                onAddBatch={onAddBatch}
                livestockData={livestockData}
             >
                <Button className="absolute bottom-20 right-4 h-14 w-14 rounded-full shadow-lg sm:bottom-20">
                    <PlusCircle className="h-6 w-6" />
                    <span className="sr-only">Add {categoryDef.managementStyle === 'batch' ? 'Batch' : 'Animal'}</span>
                </Button>
            </AddSheetComponent>
        </>
    );
}

export default function LivestockPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [livestock, setLivestock] = useState<Livestock[]>(initialLivestockData);
  const [categories, setCategories] = useState<CategoryDefinition[]>(initialCategoriesData);

  const handleAddAnimal = (animal: Livestock) => {
    setLivestock(prev => [...prev, animal]);
  };
  
  const handleAddBatch = (batch: Livestock) => {
    setLivestock(prev => [...prev, batch]);
  };

  const handleAddCategory = (newCategoryName: string, managementStyle: ManagementStyle) => {
    if (newCategoryName && !categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      const newCategory = { name: newCategoryName, icon: 'CowIcon', managementStyle: managementStyle };
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryName: LivestockCategoryName) => {
    setCategories(prev => prev.filter(c => c.name !== categoryName));
  };

  const handleUpdateCategory = (updatedCategory: CategoryDefinition) => {
    setCategories(prev => prev.map(c => c.name === updatedCategory.name ? updatedCategory : c));
  };

  if (category) {
    return <AnimalList 
        category={category} 
        livestockData={livestock} 
        categoriesData={categories}
        onAddAnimal={handleAddAnimal} 
        onAddBatch={handleAddBatch} 
    />;
  }
  
  return <LivestockCategoryList 
    livestockData={livestock}
    categoriesData={categories}
    onAddCategory={handleAddCategory}
    onUpdateCategory={handleUpdateCategory}
    onDeleteCategory={handleDeleteCategory}
    onAddAnimal={handleAddAnimal}
    onAddBatch={handleAddBatch}
  />;
}

    