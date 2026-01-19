'use client';

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { categoriesData as initialCategoriesData, livestockData as initialLivestockData, type CategoryDefinition, type Livestock } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CowIcon, GoatIcon, SheepIcon } from "@/components/icons";
import { ArrowRight, PlusCircle } from "lucide-react";
import type { ManagementStyle } from "../livestock/page";
import { Button } from "@/components/ui/button";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  CowIcon,
  SheepIcon,
  GoatIcon,
};

export type LivestockCategoryReport = {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  managementStyle: ManagementStyle;
};

export default function AnalyticsPage() {
    const [livestock, setLivestock] = useState<Livestock[]>([]);
    const [categories, setCategories] = useState<CategoryDefinition[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const storedLivestock = window.localStorage.getItem('livestockData');
            const storedCategories = window.localStorage.getItem('categoriesData');
            setLivestock(storedLivestock ? JSON.parse(storedLivestock) : initialLivestockData);
            setCategories(storedCategories ? JSON.parse(storedCategories) : initialCategoriesData);
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            setLivestock(initialLivestockData);
            setCategories(initialCategoriesData);
        }
    }, []);

    const categoryReports: LivestockCategoryReport[] = useMemo(() => {
        if (!isClient) return [];
        return categories.map(cat => {
            const animals = livestock.filter(animal => animal.category === cat.name);
            const IconComponent = iconMap[cat.icon] || CowIcon;
            return {
              name: cat.name,
              icon: IconComponent,
              count: animals.length,
              managementStyle: cat.managementStyle
            }
        });
    }, [livestock, categories, isClient]);

  if (!isClient) {
      return null;
  }

  return (
    <>
      <PageHeader title="Analytics & Reports" />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        {categoryReports.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryReports.map((category) => (
                <Link key={category.name} href={`/analytics/${category.name.toLowerCase()}`} className="group">
                    <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div className="flex items-center gap-4">
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
                         <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-primary group-hover:underline">View detailed report</p>
                    </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
        ) : (
            <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <h3 className="text-xl font-medium">No Analytics to Display</h3>
                    <p className="text-muted-foreground">Add livestock categories and animals to see your reports.</p>
                    <Button asChild>
                        <Link href="/livestock">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Go to Livestock
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )}
      </main>
    </>
  );
}
