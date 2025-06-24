'use server';

/**
 * @fileOverview Generates math questions based on the dice roll.
 *
 * - generateMathQuestion - A function that generates math questions.
 * - MathQuestionInput - The input type for the generateMathQuestion function.
 * - MathQuestionOutput - The return type for the generateMathQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MathQuestionInputSchema = z.object({
  dice1: z.number().describe('The value of the first die (1-6).'),
  operator: z
    .enum(['+', '-', 'Max', 'Min'])
    .describe('The operator from the second die.'),
  dice3: z.number().describe('The value of the third die (1-6).'),
});
export type MathQuestionInput = z.infer<typeof MathQuestionInputSchema>;

const MathQuestionOutputSchema = z.object({
  question: z.string().describe('The math question to display to the user.'),
  answer: z.number().describe('The correct answer to the math question.'),
});
export type MathQuestionOutput = z.infer<typeof MathQuestionOutputSchema>;

export async function generateMathQuestion(
  input: MathQuestionInput
): Promise<MathQuestionOutput> {
  return generateMathQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mathQuestionPrompt',
  input: {schema: MathQuestionInputSchema},
  output: {schema: MathQuestionOutputSchema},
  prompt: `You are a math question generator for a Ludo game.
  You will be given three inputs: dice1, operator, and dice3.
  Your job is to formulate a math question based on these inputs.
  The question should be appropriate for young children.
  If the operator is "Max", the question should be "What is the maximum of dice1 and dice3?".
  If the operator is "Min", the question should be "What is the minimum of dice1 and dice3?".
  Otherwise, use the operator to combine dice1 and dice3 to form the question.

  Dice 1: {{{dice1}}}
  Operator: {{{operator}}}
  Dice 3: {{{dice3}}}

  The question you generate should be in the "question" field, and the answer in the "answer" field. Adhere to the schema.
  {
    "question": "What is 3 + 5?",
    "answer": 8
  }
  `,
});

const generateMathQuestionFlow = ai.defineFlow(
  {
    name: 'generateMathQuestionFlow',
    inputSchema: MathQuestionInputSchema,
    outputSchema: MathQuestionOutputSchema,
  },
  async input => {
    let answer: number;
    switch (input.operator) {
      case '+':
        answer = input.dice1 + input.dice3;
        break;
      case '-':
        answer = input.dice1 - input.dice3;
        break;
      case 'Max':
        answer = Math.max(input.dice1, input.dice3);
        break;
      case 'Min':
        answer = Math.min(input.dice1, input.dice3);
        break;
      default:
        throw new Error(`Invalid operator: ${input.operator}`);
    }

    const {output} = await prompt({...input});

    return {
      question: output?.question ?? `What is ${input.dice1} ${input.operator} ${input.dice3}?`,
      answer: output?.answer ?? answer,
    };
  }
);
