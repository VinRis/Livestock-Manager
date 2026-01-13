'use server';

/**
 * @fileOverview An AI agent to suggest opportunities for increasing profit and animal wellness.
 *
 * - getProfitOptimizationSuggestions - A function that returns profit optimization suggestions.
 * - ProfitOptimizationSuggestionsInput - The input type for the getProfitOptimizationSuggestions function.
 * - ProfitOptimizationSuggestionsOutput - The return type for the getProfitOptimizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfitOptimizationSuggestionsInputSchema = z.object({
  financialData: z
    .string()
    .describe('Financial data related to livestock keeping.'),
  livestockProductionMetrics: z
    .string()
    .describe('Livestock production metrics like milk yield, weight gain, and breeding success.'),
});
export type ProfitOptimizationSuggestionsInput = z.infer<
  typeof ProfitOptimizationSuggestionsInputSchema
>;

const ProfitOptimizationSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of suggestions for increasing profit and animal wellness.'),
});
export type ProfitOptimizationSuggestionsOutput = z.infer<
  typeof ProfitOptimizationSuggestionsOutputSchema
>;

export async function getProfitOptimizationSuggestions(
  input: ProfitOptimizationSuggestionsInput
): Promise<ProfitOptimizationSuggestionsOutput> {
  return profitOptimizationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profitOptimizationSuggestionsPrompt',
  input: {schema: ProfitOptimizationSuggestionsInputSchema},
  output: {schema: ProfitOptimizationSuggestionsOutputSchema},
  prompt: `You are an expert in livestock management and financial analysis. Based on the provided financial data and livestock production metrics, suggest opportunities for increasing profit and animal wellness. Be concise and specific in your suggestions.

Financial Data: {{{financialData}}}
Livestock Production Metrics: {{{livestockProductionMetrics}}}`,
});

const profitOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'profitOptimizationSuggestionsFlow',
    inputSchema: ProfitOptimizationSuggestionsInputSchema,
    outputSchema: ProfitOptimizationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
