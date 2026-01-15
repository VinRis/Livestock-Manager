
import { getProfitOptimizationSuggestions } from '@/ai/flows/profit-optimization-suggestions';
import { financialData, livestockData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

async function fetchSuggestions() {
  const productionMetrics = livestockData.map(animal => ({
    id: animal.id,
    breed: animal.breed,
    metrics: animal.productionMetrics,
  }));

  const input = {
    financialData: JSON.stringify(financialData),
    livestockProductionMetrics: JSON.stringify(productionMetrics),
  };

  try {
    const result = await getProfitOptimizationSuggestions(input);
    // Split suggestions by number, then clean up the text.
    return result.suggestions
      .split(/\d+\.\s+/) // Split by "1. ", "2. ", etc.
      .map(s => s.trim())
      .filter(s => s.length > 0);
  } catch (error) {
    console.error("AI Error:", error);
    return ["Failed to load AI suggestions. Please try again later."];
  }
}

export async function ProfitSuggestions() {
  const suggestions = await fetchSuggestions();

  const parsedSuggestions = suggestions.map(line => {
    // The first part of the suggestion is the title, the rest is the description
    const cleanedLine = line.replace(/[\*]/g, '').trim();
    const parts = cleanedLine.split(/ by | to /);
    if (parts.length > 1) {
      return { 
        title: parts[0].trim(), 
        description: parts.slice(1).join(' to ').trim() 
      };
    }
    // Fallback for suggestions that don't fit the pattern
    return { title: "AI Suggestion", description: cleanedLine };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {parsedSuggestions.map((suggestion, index) => (
        <div key={index} className="rounded-lg border bg-card p-4 transition-all hover:shadow-lg">
            <h4 className="font-semibold text-primary">{suggestion.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
        </div>
      ))}
    </div>
  );
}

export function ProfitSuggestionsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                 <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    );
}
