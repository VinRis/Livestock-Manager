import { Lightbulb, TrendingUp, Users } from "lucide-react";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionChart from "./production-chart";
import { ProfitSuggestions, ProfitSuggestionsSkeleton } from "./profit-suggestions";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics & Reports" description="Insights into your farm's performance." />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Milk Yield</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.5 L/day</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Breeding Success</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Conception rate this season</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Weight Gain</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2 kg/day</div>
              <p className="text-xs text-muted-foreground">For finishing cattle</p>
            </CardContent>
          </Card>
        </div>
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
      </main>
    </>
  );
}
