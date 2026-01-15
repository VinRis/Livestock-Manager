
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Lightbulb, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { livestockData, categoriesData } from "@/lib/data";

import ProductionChart from "../production-chart";
import { ProfitSuggestions, ProfitSuggestionsSkeleton } from "../profit-suggestions";
import { LivestockReport, LivestockReportSkeleton } from "./livestock-report";

export default function CategoryAnalyticsPage({ params }: { params: { category: string } }) {
  const categoryName = params.category;
  const category = categoriesData.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  
  if (!category) {
    notFound();
  }
  
  const animalsInCategory = livestockData.filter(animal => animal.category.toLowerCase() === categoryName.toLowerCase());

  // Mock data for category-specific analytics
  const avgMilkYield = category.name === 'Cattle' ? '28.5 L/day' : (category.name === 'Goats' ? '3.5 L/day' : 'N/A');
  const breedingSuccessRate = category.name === 'Cattle' ? '85%' : '92%';
  const avgWeightGain = '1.2 kg/day';
  
  const showMilkYield = ['Cattle', 'Goats'].includes(category.name);

  return (
    <>
      <PageHeader title={`${category.name} Analytics`}>
        <Button variant="outline" asChild>
          <Link href="/analytics"><ArrowLeft /> Back to Analytics</Link>
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {showMilkYield && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Milk Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgMilkYield}</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Breeding Success</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breedingSuccessRate}</div>
              <p className="text-xs text-muted-foreground">This season</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Weight Gain</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWeightGain}</div>
              <p className="text-xs text-muted-foreground">Across all animals</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <CardTitle>Production Insights Report</CardTitle>
                    </div>
                    <CardDescription>AI-generated analysis of your {category.name} production.</CardDescription>
                </CardHeader>
                <CardContent>
                <Suspense fallback={<LivestockReportSkeleton />}>
                    <LivestockReport livestockType={category.name} />
                </Suspense>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <CardTitle>Profit & Wellness Opportunities</CardTitle>
                    </div>
                    <CardDescription>AI-generated suggestions based on your farm's data.</CardDescription>
                </CardHeader>
                <CardContent>
                <Suspense fallback={<ProfitSuggestionsSkeleton />}>
                    <ProfitSuggestions />
                </Suspense>
                </CardContent>
            </Card>
        </div>

        {category.name === 'Cattle' && (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Milk Production Trend</CardTitle>
                <CardDescription>Monthly average milk yield per cow.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductionChart />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
