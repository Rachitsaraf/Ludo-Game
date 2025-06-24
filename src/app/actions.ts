"use server";

import { generateMathQuestion, type MathQuestionInput } from "@/ai/flows/math-question-generation";

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function getMathQuestion(input: MathQuestionInput) {
  try {
    const result = await generateMathQuestion(input);
    
    // Create 3 other wrong options
    const options = new Set<number>([result.answer]);
    while (options.size < 4) {
      const wrongAnswer = result.answer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer !== result.answer && wrongAnswer >= 0) {
        options.add(wrongAnswer);
      }
    }
    
    return {
      question: result.question,
      answer: result.answer,
      options: shuffleArray(Array.from(options)),
    };
  } catch (error) {
    console.error("Error generating math question:", error);
    // Fallback in case AI fails
    let answer = 0;
    let question = "";
    const { dice1, operator, dice3 } = input;
    switch (operator) {
      case '+': answer = dice1 + dice3; question = `What is ${dice1} + ${dice3}?`; break;
      case '-': answer = dice1 - dice3; question = `What is ${dice1} - ${dice3}?`; break;
      case 'Max': answer = Math.max(dice1, dice3); question = `What is the bigger number between ${dice1} and ${dice3}?`; break;
      case 'Min': answer = Math.min(dice1, dice3); question = `What is the smaller number between ${dice1} and ${dice3}?`; break;
    }
     const options = new Set<number>([answer]);
    while (options.size < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer !== answer && wrongAnswer >= 0) {
        options.add(wrongAnswer);
      }
    }
    return { question, answer, options: shuffleArray(Array.from(options)) };
  }
}
