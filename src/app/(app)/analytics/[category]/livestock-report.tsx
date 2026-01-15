
import { generateLivestockInsights } from '@/ai/flows/livestock-production-insights';
import { livestockData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

async function fetchLivestockReport(livestockType: string) {
  const productionMetrics = livestockData
    .filter(animal => animal.category === livestockType)
    .map(animal => ({
      id: animal.id,
      name: animal.name,
      metrics: animal.productionMetrics,
  }));
  
  const farmManagementPractices = "Standard feeding and health protocols. Rotational grazing employed. Breeding program uses a mix of natural and AI methods.";

  const input = {
    livestockType,
    productionMetrics: JSON.stringify(productionMetrics),
    farmManagementPractices,
  };

  try {
    const result = await generateLivestockInsights(input);
    return result;
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}

export async function LivestockReport({ livestockType }: { livestockType: string}) {
  const report = await fetchLivestockReport(livestockType);

  if (!report) {
     return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to generate the AI report. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 text-sm">
        <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>{report.reportTitle}</AlertTitle>
            <AlertDescription>
                {report.executiveSummary}
            </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
            <h4 className="font-semibold text-primary">Trend Analysis</h4>
            <p className="text-muted-foreground">{report.trendAnalysis}</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold text-primary">Recommendations</h4>
            <p className="text-muted-foreground">{report.recommendations}</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold text-primary">Profit Opportunities</h4>
            <p className="text-muted-foreground">{report.profitOpportunities}</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold text-primary">Animal Wellness Suggestions</h4>
            <p className="text-muted-foreground">{report.animalWellnessSuggestions}</p>
        </div>
    </div>
  );
}

export function LivestockReportSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
             <div className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
             <div className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
             <div className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}