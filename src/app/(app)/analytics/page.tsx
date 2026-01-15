
'use client';

import Link from "next/link";
import { useMemo, useReducer } from "react";
import { categoriesData, livestockData } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CowIcon, GoatIcon, SheepIcon } from "@/components/icons";
import { ArrowRight } from "lucide-react";
import type { ManagementStyle } from "../livestock/page";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  CowIcon,
  SheepIcon,
  GoatIcon,
};

export type LivestockCategory = {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  managementStyle: ManagementStyle;
};

export default function AnalyticsPage() {
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const categories: LivestockCategory[] = useMemo(() => {
        return categoriesData.map(cat => {
            const animals = livestockData.filter(animal => animal.category === cat.name);
            const IconComponent = iconMap[cat.icon] || CowIcon;
            return {
              name: cat.name,
              icon: IconComponent,
              count: animals.length,
              managementStyle: cat.managementStyle
            }
        });
    }, [categoriesData, _]);

  return (
    <>
      <PageHeader title="Analytics & Reports" description="Select a category to view detailed insights." />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
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
      </main>
    </>
  );
}
