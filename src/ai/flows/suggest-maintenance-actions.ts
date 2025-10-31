'use server';

/**
 * @fileOverview AI-powered suggestions for maintenance actions based on alert details.
 *
 * - suggestMaintenanceActions - A function that provides maintenance suggestions.
 * - SuggestMaintenanceActionsInput - The input type for the suggestMaintenanceActions function.
 * - SuggestMaintenanceActionsOutput - The return type for the suggestMaintenanceActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMaintenanceActionsInputSchema = z.object({
  asset_ID: z.string().describe('The ID of the asset experiencing the issue.'),
  part_PN: z.string().describe('The part number of the failing part.'),
  location_coords: z.string().describe('The GPS coordinates of the asset location.'),
  estimated_failure_time: z
    .string()
    .describe('The estimated time of failure in ISO format (e.g., 2024-01-01T00:00:00Z).'),
});
export type SuggestMaintenanceActionsInput = z.infer<typeof SuggestMaintenanceActionsInputSchema>;

const SuggestMaintenanceActionsOutputSchema = z.object({
  suggestedActions: z
    .array(z.string())
    .describe('A list of suggested maintenance actions to address the alert.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested actions, providing context and justification.'),
});
export type SuggestMaintenanceActionsOutput = z.infer<typeof SuggestMaintenanceActionsOutputSchema>;

export async function suggestMaintenanceActions(
  input: SuggestMaintenanceActionsInput
): Promise<SuggestMaintenanceActionsOutput> {
  return suggestMaintenanceActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMaintenanceActionsPrompt',
  input: {schema: SuggestMaintenanceActionsInputSchema},
  output: {schema: SuggestMaintenanceActionsOutputSchema},
  prompt: `You are an expert maintenance engineer providing guidance based on incoming critical alerts.

  Based on the following alert details, suggest a list of initial troubleshooting steps and potential solutions. Explain your reasoning for each suggestion.

  Asset ID: {{{asset_ID}}}
  Part Number: {{{part_PN}}}
  Location Coordinates: {{{location_coords}}}
  Estimated Failure Time: {{{estimated_failure_time}}}

  Format your response as a JSON object with 'suggestedActions' (an array of strings) and 'reasoning' (a string explaining the suggestions).
  `,
});

const suggestMaintenanceActionsFlow = ai.defineFlow(
  {
    name: 'suggestMaintenanceActionsFlow',
    inputSchema: SuggestMaintenanceActionsInputSchema,
    outputSchema: SuggestMaintenanceActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
