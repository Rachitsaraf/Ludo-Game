"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { LudoBoard } from './LudoBoard';
import { Pawn } from './Pawn';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dices, Minus, Plus } from 'lucide-react';
import type { Operator } from '@/lib/types';
import { getMathQuestion } from '@/app/actions';
import { MathQuestionModal } from './MathQuestionModal';
import { Confetti } from './Confetti';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const playerColors = {
  red: '#f87171',
  green: '#4ade80',
  blue: '#60a5fa',
  yellow: '#facc15',
};

const initialPlayers = [
  { id: 'red', name: 'Red', color: playerColors.red, pawns: [{id: 1, pos: -1}, {id: 2, pos: -1}, {id: 3, pos: -1}, {id: 4, pos: -1}] },
  { id: 'blue', name: 'Blue', color: playerColors.blue, pawns: [{id: 1, pos: -1}, {id: 2, pos: -1}, {id: 3, pos: -1}, {id: 4, pos: -1}] },
  { id: 'green', name: 'Green', color: playerColors.green, pawns: [{id: 1, pos: -1}, {id: 2, pos: -1}, {id: 3, pos: -1}, {id: 4, pos: -1}] },
  { id: 'yellow', name: 'Yellow', color: playerColors.yellow, pawns: [{id: 1, pos: -1}, {id: 2, pos: -1}, {id: 3, pos: -1}, {id: 4, pos: -1}] },
];

const DiceIcon = ({value}: {value: number}) => {
    return <div className="text-3xl border-2 rounded-lg p-2 bg-white shadow-inner w-16 h-16 flex items-center justify-center font-bold">{value}</div>;
}

const OperatorIcon = ({op}: {op: Operator}) => {
    const icons = { '+': <Plus size={32}/>, '-': <Minus size={32}/>, 'Max': 'Max', 'Min': 'Min'};
    return <div className="text-3xl font-bold border-2 rounded-lg p-2 bg-white shadow-inner w-16 h-16 flex items-center justify-center">{icons[op]}</div>
}

export const GameClient = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, Operator, number] | null>(null);
  const [question, setQuestion] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [turnState, setTurnState] = useState<'rolling' | 'answering' | 'moving' | 'game-over'>('rolling');
  const [stepsToMove, setStepsToMove] = useState(0);
  const { toast } = useToast();
  
  const currentPlayer = players[currentPlayerIndex];

  const handleRollDice = async () => {
    if (turnState !== 'rolling') return;
    
    setTurnState('answering');
    const d1 = Math.floor(Math.random() * 6) + 1;
    const ops: Operator[] = ['+', '-', 'Max', 'Min'];
    const op: Operator = ops[Math.floor(Math.random() * ops.length)];
    const d3 = Math.floor(Math.random() * 6) + 1;
    setDice([d1, op, d3]);

    toast({ title: "Dice Rolled!", description: `You rolled ${d1}, ${op}, ${d3}. Answer the question!`});
    
    const questionData = await getMathQuestion({ dice1: d1, operator: op, dice3: d3 });
    setQuestion(questionData);
  };

  const nextTurn = useCallback(() => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setTurnState('rolling');
    setDice(null);
    setQuestion(null);
  }, [players.length]);

  const handleAnswer = (isCorrect: boolean, answer: number) => {
    setQuestion(null);
    if (isCorrect) {
      toast({ title: "Correct!", description: `You can move ${answer} steps.`, variant: 'default' });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setStepsToMove(answer);
      setTurnState('moving');
      // For simplicity, automatically move the first available pawn
      setTimeout(() => {
          toast({ title: `${currentPlayer.name} moved ${answer} steps!`})
          nextTurn();
      }, 2000);
    } else {
      toast({ title: "Oops!", description: "Wrong answer. Try again next turn!", variant: 'destructive' });
      setTimeout(() => nextTurn(), 1000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-headline flex flex-col items-center justify-between p-2 pt-16 md:p-4 md:pt-20 gap-4">
        <div className="absolute top-4 left-4 z-20">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
            </Link>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <Card className="p-2 px-4 rounded-2xl shadow-lg" style={{backgroundColor: currentPlayer.color}}>
            <h2 className="text-lg font-bold text-white text-center">{`${currentPlayer.name}'s Turn`}</h2>
          </Card>
        </div>
        
        <LudoBoard>
            <div className="absolute top-[10%] left-[10%]"><Pawn color={playerColors.red} /></div>
            <div className="absolute top-[10%] left-[25%]"><Pawn color={playerColors.red} /></div>
            <div className="absolute top-[25%] left-[10%]"><Pawn color={playerColors.red} /></div>
            <div className="absolute top-[25%] left-[25%]"><Pawn color={playerColors.red} /></div>

            <div className="absolute top-[10%] right-[10%]"><Pawn color={playerColors.blue} /></div>
            <div className="absolute top-[10%] right-[25%]"><Pawn color={playerColors.blue} /></div>
            <div className="absolute top-[25%] right-[10%]"><Pawn color={playerColors.blue} /></div>
            <div className="absolute top-[25%] right-[25%]"><Pawn color={playerColors.blue} /></div>
            
            <div className="absolute bottom-[10%] left-[10%]"><Pawn color={playerColors.green} /></div>
            <div className="absolute bottom-[10%] left-[25%]"><Pawn color={playerColors.green} /></div>
            <div className="absolute bottom-[25%] left-[10%]"><Pawn color={playerColors.green} /></div>
            <div className="absolute bottom-[25%] left-[25%]"><Pawn color={playerColors.green} /></div>

            <div className="absolute bottom-[10%] right-[10%]"><Pawn color={playerColors.yellow} /></div>
            <div className="absolute bottom-[10%] right-[25%]"><Pawn color={playerColors.yellow} /></div>
            <div className="absolute bottom-[25%] right-[10%]"><Pawn color={playerColors.yellow} /></div>
            <div className="absolute bottom-[25%] right-[25%]"><Pawn color={playerColors.yellow} /></div>
        </LudoBoard>

        <Card className="w-full max-w-md p-4 rounded-4xl shadow-lg flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
                {dice ? <DiceIcon value={dice[0]} /> : <div className="text-3xl border-2 rounded-lg p-2 w-16 h-16 flex items-center justify-center bg-gray-200">?</div>}
                {dice ? <OperatorIcon op={dice[1]} /> : <div className="text-3xl border-2 rounded-lg p-2 w-16 h-16 flex items-center justify-center bg-gray-200">?</div>}
                {dice ? <DiceIcon value={dice[2]} /> : <div className="text-3xl border-2 rounded-lg p-2 w-16 h-16 flex items-center justify-center bg-gray-200">?</div>}
            </div>
            
            <Button onClick={handleRollDice} disabled={turnState !== 'rolling'} className="w-full h-16 text-2xl rounded-3xl shadow-lg">
                <Dices className="mr-2 h-8 w-8" />
                {turnState === 'rolling' ? 'Roll Dice' : 'Waiting...'}
            </Button>
        </Card>

        {question && (
            <MathQuestionModal
                questionData={question}
                onAnswer={handleAnswer}
            />
        )}
        {showConfetti && <Confetti />}
    </div>
  );
};
