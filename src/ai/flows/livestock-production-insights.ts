'use server';
/**
 * @fileOverview An AI agent that generates reports on livestock production metrics and suggests improvements.
 *
 * - generateLivestockInsights - A function that generates livestock production insights.
 * - LivestockProductionInsightsInput - The input type for the generateLivestockInsights function.
 * - LivestockProductionInsightsOutput - The return type for the generateLivestockInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LivestockProductionInsightsInputSchema = z.object({
  livestockType: z.string().describe('The type of livestock, e.g., dairy cows, beef cattle, goats, sheep.'),
  productionMetrics: z.string().describe('Key production metrics data, including milk yield, weight gain, breeding success rates, etc.'),
  farmManagementPractices: z.string().describe('Description of current farm management practices, including feeding strategies, health protocols, and breeding programs.'),
});
export type LivestockProductionInsightsInput = z.infer<typeof LivestockProductionInsightsInputSchema>;

const LivestockProductionInsightsOutputSchema = z.object({
  reportTitle: z.string().describe('The title of the livestock production insights report.'),
  executiveSummary: z.string().describe('A brief summary of the key findings and recommendations.'),
  trendAnalysis: z.string().describe('An analysis of trends in livestock production metrics over time.'),
  recommendations: z.array(z.string()).describe('A list of specific recommendations for improving livestock management practices and production efficiency.'),
  profitOpportunities: z.array(z.string()).describe('A list of identified opportunities to increase profitability through improved livestock management.'),
  animalWellnessSuggestions: z.array(z.string()).describe('A list of suggestions for enhancing animal wellness and health.'),
});
export type LivestockProductionInsightsOutput = z.infer<typeof LivestockProductionInsightsOutputSchema>;

export async function generateLivestockInsights(input: LivestockProductionInsightsInput): Promise<LivestockProductionInsightsOutput> {
  return livestockProductionInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'livestockProductionInsightsPrompt',
  input: {schema: LivestockProductionInsightsInputSchema},
  output: {schema: LivestockProductionInsightsOutputSchema},
  prompt: `You are an expert agricultural consultant specializing in livestock management. Analyze the provided data and generate a report with actionable insights.

Livestock Type: {{{livestockType}}}
Production Metrics: {{{productionMetrics}}}
Farm Management Practices: {{{farmManagementPractices}}}

Instructions: Based on the livestock type, production metrics, and farm management practices, generate a comprehensive report that includes the following sections:

1.  Report Title: A concise title summarizing the report's focus.
2.  Executive Summary: A brief overview of the key findings and recommendations.
3.  Trend Analysis: Analyze the trends in livestock production metrics over time and identify any significant patterns or anomalies. This should be a single paragraph.
4.  Recommendations: Provide specific, actionable recommendations for improving livestock management practices and production efficiency. This should be an array of strings.
5.  Profit Opportunities: Identify opportunities to increase profitability through improved livestock management. This should be an array of strings.
6.  Animal Wellness Suggestions: Provide suggestions for enhancing animal wellness and health. This should be an array of strings.

Ensure the report is clear, concise, and provides practical guidance for livestock keepers to make informed decisions. For any sections that are arrays of strings, make each string a distinct point.

Output the result in JSON format.
`,
});

const livestockProductionInsightsFlow = ai.defineFlow(
  {
    name: 'livestockProductionInsightsFlow',
    inputSchema: LivestockProductionInsightsInputSchema,
    outputSchema: LivestockProductionInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
