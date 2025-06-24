"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const MathQuestionModal = ({ questionData, onAnswer }: { questionData: any, onAnswer: (correct: boolean, answer: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const handleSelect = (option: number) => {
    if (selected !== null) return;
    
    setSelected(option);
    if (option !== questionData.answer) {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        onAnswer(false, 0);
      }, 1200);
    } else {
      setTimeout(() => {
        onAnswer(true, questionData.answer);
      }, 800)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md rounded-4xl shadow-2xl text-center transform transition-transform ${isWrong ? 'animate-shake' : 'animate-confetti-pop'}`}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{questionData.question}</CardTitle>
          <CardDescription className="text-lg">Select the correct answer!</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 p-6">
          {questionData.options.map((option: number, i: number) => (
            <Button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`h-24 text-4xl rounded-3xl shadow-lg transition-all duration-300 ${
                selected !== null && option === questionData.answer ? 'bg-green-500 hover:bg-green-600' : ''
              } ${
                selected === option && option !== questionData.answer ? 'bg-destructive hover:bg-destructive/90' : ''
              }`}
            >
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
