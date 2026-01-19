
"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, HeartPulse, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { livestockData as initialLivestockData, categoriesData as initialCategoriesData, type Livestock, type CategoryDefinition } from "@/lib/data";
import { generatePdfReport } from "@/lib/reports";
import { useToast } from "@/hooks/use-toast";

import ProductionChart from "../production-chart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, totalMonths: years * 12 + months };
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function CategoryAnalyticsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [livestockData, setLivestockData] = useState<Livestock[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryDefinition[]>([]);
  const [isClient, setIsClient] = useState(false);

  const categoryName = params.category as string;

  useEffect(() => {
    setIsClient(true);
    try {
      const storedLivestock = window.localStorage.getItem('livestockData');
      const storedCategories = window.localStorage.getItem('categoriesData');
      setLivestockData(storedLivestock ? JSON.parse(storedLivestock) : initialLivestockData);
      setCategoriesData(storedCategories ? JSON.parse(storedCategories) : initialCategoriesData);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setLivestockData(initialLivestockData);
      setCategoriesData(initialCategoriesData);
    }
  }, []);

  const {
    category,
    totalAnimals,
    avgAgeText,
    genderDistribution,
    productionData,
    avgProduction,
    totalHealthRecords,
  } = useMemo(() => {
    if (!isClient || livestockData.length === 0 && categoriesData.length === 0) {
      return { 
        category: null, 
        totalAnimals: 0, 
        avgAgeText: 'N/A',
        genderDistribution: [],
        productionData: [],
        avgProduction: 'N/A',
        totalHealthRecords: 0
      };
    }

    const categoryInfo = categoriesData.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (!categoryInfo) return { category: null, totalAnimals: 0, avgAgeText: 'N/A', genderDistribution: [], productionData: [], avgProduction: 'N/A', totalHealthRecords: 0 };
    
    const animals = livestockData.filter(animal => animal.category.toLowerCase() === categoryName.toLowerCase());

    const totalAnimals = animals.length;
    
    const totalMonths = animals.reduce((acc, animal) => acc + calculateAge(animal.birthDate).totalMonths, 0);
    const avgTotalMonths = totalAnimals > 0 ? totalMonths / totalAnimals : 0;
    const avgYears = Math.floor(avgTotalMonths / 12);
    const avgMonths = Math.round(avgTotalMonths % 12);
    const avgAgeText = totalAnimals > 0 ? `${avgYears}y ${avgMonths}m` : 'N/A';

    const males = animals.filter(a => a.gender === 'Male').length;
    const females = animals.filter(a => a.gender === 'Female').length;
    const genderDistribution = [
        { name: 'Male', value: males },
        { name: 'Female', value: females },
    ].filter(g => g.value > 0);

    const productionMetrics = animals.flatMap(a => a.productionMetrics);
    
    // Aggregate production data for chart (e.g., Milk for Cattle)
    const productionType = categoryInfo.name === 'Cattle' ? 'Milk' : (categoryInfo.name === 'Chickens' ? 'Eggs' : null);
    let chartData: { month: string; value: number }[] = [];
    let avgProductionValue = 'N/A';
    
    if (productionType) {
        const monthlyProduction: Record<string, number> = {};
        let totalProduction = 0;
        let productionCount = 0;
        
        productionMetrics.filter(m => m.type === productionType).forEach(m => {
            const date = new Date(m.date);
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            const value = parseFloat(m.value) || 0;

            if (!monthlyProduction[month]) monthlyProduction[month] = 0;
            monthlyProduction[month] += value;
            totalProduction += value;
            productionCount++;
        });

        chartData = Object.entries(monthlyProduction).map(([month, value]) => ({ month, value })).reverse();
        
        if (productionCount > 0) {
            const unit = productionType === 'Milk' ? 'L' : 'eggs';
            avgProductionValue = `${(totalProduction / productionCount).toFixed(1)} ${unit}/record`;
        }
    }
    
    const totalHealthRecords = animals.reduce((sum, a) => sum + a.healthRecords.length, 0);

    return {
      category: categoryInfo,
      totalAnimals,
      avgAgeText,
      genderDistribution,
      productionData: chartData,
      avgProduction: avgProductionValue,
      totalHealthRecords,
    };
  }, [categoryName, isClient, livestockData, categoriesData]);
  
  if (!isClient) {
      return null; // or a loading spinner
  }

  if (!category) {
    return notFound();
  }
  
  const handleDownload = async () => {
    toast({
      title: 'Generating Report...',
      description: `Your PDF report for ${category.name} is being created.`,
    });

    try {
      await generatePdfReport(category.name);
      toast({
        title: 'Download Ready!',
        description: `Your ${category.name} report has been downloaded.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your report.',
      });
      console.error("Report generation error:", error);
    }
  };
  
  const showProduction = ['Cattle', 'Goats', 'Sheep', 'Chickens', 'Pigs'].includes(category.name);
  const productionLabel = category.name === 'Cattle' ? 'Avg. Milk Yield' : 'Avg. Production';
  
  return (
    <>
      <PageHeader title={`${category.name} Analytics`}>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/analytics"><ArrowLeft /> Back</Link>
          </Button>
          <Button onClick={handleDownload} disabled={totalAnimals === 0}><Download /> PDF Report</Button>
        </div>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        
        {totalAnimals === 0 ? (
           <Card>
                <CardHeader>
                    <CardTitle>No Data Available</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">There are no animals in the "{category.name}" category to analyze.</p>
                    <Button asChild className="mt-4">
                        <Link href={`/livestock?category=${category.name.toLowerCase()}`}>Add First Animal</Link>
                    </Button>
                </CardContent>
           </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnimals}</div>
                  <p className="text-xs text-muted-foreground">in this category</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Age</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgAgeText}</div>
                  <p className="text-xs text-muted-foreground">average age of herd</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                  <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalHealthRecords}</div>
                  <p className="text-xs text-muted-foreground">total health events logged</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Production Trend</CardTitle>
                  <CardDescription>Monthly production volume for the entire category.</CardDescription>
                </CardHeader>
                <CardContent>
                  {productionData.length > 0 ? (
                    <ProductionChart data={productionData} dataKey="value" />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-center text-muted-foreground">
                        <p>No production data to display for this category.<br />Add production metrics to your animals to see a trend.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    {genderDistribution.length > 0 ? (
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={genderDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                              {genderDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        No gender data recorded.
                      </div>
                    )}
                  </CardContent>
                </Card>
                {showProduction && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{productionLabel}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{avgProduction}</div>
                      <p className="text-xs text-muted-foreground">based on recorded metrics</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
