
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, MoreVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { livestockData, type Livestock } from "@/lib/data";
import { CowIcon, GoatIcon, SheepIcon } from "@/components/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type LivestockCategory = {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  animals: Livestock[];
};

export default function LivestockPage() {
  const categories = livestockData.reduce((acc, animal) => {
    let categoryName = "Cattle"; 
    let icon = CowIcon;

    if (['Merino'].includes(animal.breed)) {
      categoryName = 'Sheep';
      icon = SheepIcon;
    } else if (['Boer'].includes(animal.breed)) {
      categoryName = 'Goats';
      icon = GoatIcon;
    }
    
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, count: 0, icon: icon, animals: [] };
    }
    
    acc[categoryName].count++;
    acc[categoryName].animals.push(animal);
    
    return acc;
  }, {} as Record<string, LivestockCategory>);

  const livestockCategories = Object.values(categories);

  return (
    <>
      <PageHeader title="Livestock Categories" description="Manage your herd by categories.">
        <Button>
          <PlusCircle />
          Add Category
        </Button>
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
