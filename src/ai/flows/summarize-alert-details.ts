'use server';

/**
 * @fileOverview Summarizes alert details using AI to provide a concise overview of critical information.
 *
 * - summarizeAlertDetails - A function that takes alert details as input and returns a summarized text.
 * - SummarizeAlertDetailsInput - The input type for the summarizeAlertDetails function.
 * - SummarizeAlertDetailsOutput - The return type for the summarizeAlertDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAlertDetailsInputSchema = z.object({
  asset_ID: z.string().describe('The ID of the asset experiencing the alert.'),
  part_PN: z.string().describe('The part number associated with the alert.'),
  location_coords: z.string().describe('The location coordinates of the asset.'),
  estimated_failure_time: z.string().describe('The estimated failure time of the part.'),
  status: z.string().describe('The current status of the alert.'),
});
export type SummarizeAlertDetailsInput = z.infer<typeof SummarizeAlertDetailsInputSchema>;

const SummarizeAlertDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the alert details.'),
});
export type SummarizeAlertDetailsOutput = z.infer<typeof SummarizeAlertDetailsOutputSchema>;

export async function summarizeAlertDetails(input: SummarizeAlertDetailsInput): Promise<SummarizeAlertDetailsOutput> {
  return summarizeAlertDetailsFlow(input);
}

const summarizeAlertDetailsPrompt = ai.definePrompt({
  name: 'summarizeAlertDetailsPrompt',
  input: {schema: SummarizeAlertDetailsInputSchema},
  output: {schema: SummarizeAlertDetailsOutputSchema},
  prompt: `Summarize the following alert details, highlighting the critical information and potential impact. Be concise.

Asset ID: {{{asset_ID}}}
Part Number: {{{part_PN}}}
Location Coordinates: {{{location_coords}}}
Estimated Failure Time: {{{estimated_failure_time}}}
Status: {{{status}}}`,
});

const summarizeAlertDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeAlertDetailsFlow',
    inputSchema: SummarizeAlertDetailsInputSchema,
    outputSchema: SummarizeAlertDetailsOutputSchema,
  },
  async input => {
    const {output} = await summarizeAlertDetailsPrompt(input);
    return output!;
  }
);
