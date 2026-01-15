
import { generateLivestockInsights } from '@/ai/flows/livestock-production-insights';
import { livestockData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Lightbulb, TrendingUp, DollarSign, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  const InsightSection = ({ title, icon: Icon, content }: { title: string, icon: React.ElementType, content: string | string[] }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">{title}</h4>
        </div>
        {Array.isArray(content) ? (
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                {content.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        ) : (
             <p className="text-sm text-muted-foreground">{content}</p>
        )}
    </div>
  );

  return (
    <div className="space-y-6">
        <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>{report.reportTitle}</AlertTitle>
            <AlertDescription>
                {report.executiveSummary}
            </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
            <InsightSection title="Trend Analysis" icon={TrendingUp} content={report.trendAnalysis} />
            <InsightSection title="Recommendations" icon={Lightbulb} content={report.recommendations} />
            <InsightSection title="Profit Opportunities" icon={DollarSign} content={report.profitOpportunities} />
            <InsightSection title="Animal Wellness" icon={Heart} content={report.animalWellnessSuggestions} />
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
