
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import { LudoBoard } from './LudoBoard';
import { Pawn } from './Pawn';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dices, Minus, Plus } from 'lucide-react';
import type { Operator, Player, PlayerColor, PawnState } from '@/lib/types';
import { getMathQuestion } from '@/app/actions';
import { MathQuestionModal } from './MathQuestionModal';
import { Confetti } from './Confetti';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { getPawnStyle, PLAYER_CONFIG } from '@/lib/board';

const playerColors = {
  red: '#f87171',    // red-400
  green: '#4ade80',  // green-400
  blue: '#60a5fa',   // blue-400
  yellow: '#facc15', // yellow-400
};

const initialPlayers: Player[] = [
  { id: 'red', name: 'Red', pawns: [
    { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }, { id: 4, position: -1 }
  ]},
  { id: 'green', name: 'Green', pawns: [
    { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }, { id: 4, position: -1 }
  ]},
  { id: 'blue', name: 'Blue', pawns: [
    { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }, { id: 4, position: -1 }
  ]},
  { id: 'yellow', name: 'Yellow', pawns: [
    { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }, { id: 4, position: -1 }
  ]},
];

const DiceIcon = ({value}: {value: number}) => {
    return <div className="text-3xl border-2 rounded-lg p-2 bg-white shadow-inner w-16 h-16 flex items-center justify-center font-bold">{value}</div>;
}

const OperatorIcon = ({op}: {op: Operator}) => {
    const icons = { '+': <Plus size={32}/>, '-': <Minus size={32}/>, 'Max': 'Max', 'Min': 'Min'};
    return <div className="text-3xl font-bold border-2 rounded-lg p-2 bg-white shadow-inner w-16 h-16 flex items-center justify-center">{icons[op]}</div>
}

export const GameClient = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, Operator, number] | null>(null);
  const [question, setQuestion] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [turnState, setTurnState] = useState<'rolling' | 'answering' | 'moving' | 'game-over'>('rolling');
  const [winner, setWinner] = useState<Player | null>(null);
  
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
    const newWinner = players.find(p => p.pawns.every(pawn => pawn.position === 57));
    if (newWinner) {
        setWinner(newWinner);
        setTurnState('game-over');
        setShowConfetti(true);
        return;
    }

    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setTurnState('rolling');
    setDice(null);
    setQuestion(null);
  }, [players]);

  const executeMove = useCallback((steps: number) => {
    setPlayers(
      produce(draft => {
        const player = draft[currentPlayerIndex];
        const { pawns } = player;
        const playerConfig = PLAYER_CONFIG[player.id];
  
        let movablePawns = pawns.filter(p => {
            if (p.position === 57) return false; // Already finished
            if (p.position === -1) return true; // Can always leave base
            if (p.position + steps > 57) return false; // Cannot overshoot the end
            return true;
        });

        // Simple AI: move the pawn that is furthest along the path
        movablePawns.sort((a, b) => b.position - a.position);
  
        let pawnToMove = movablePawns[0];
  
        if (!pawnToMove) {
          toast({ title: "No valid moves!", description: "Skipping turn." });
          nextTurn();
          return;
        }

        const pawnToUpdate = player.pawns.find(p => p.id === pawnToMove!.id)!;
  
        if (pawnToUpdate.position === -1) {
            // position is 0-indexed, so a roll of 1 lands on tile 0.
            pawnToUpdate.position = steps - 1; 
        } else {
           pawnToUpdate.position += steps;
        }
    
        if (pawnToUpdate.position > 57) {
          pawnToUpdate.position = 57; 
        }
        
        // Collision detection
        if (pawnToUpdate.position >= 0 && pawnToUpdate.position <= 51 && !playerConfig.safeTiles.includes(pawnToUpdate.position)) {
            const targetPos = (playerConfig.pathStart + pawnToUpdate.position) % 52;

            draft.forEach(other_player => {
                if (other_player.id !== player.id) {
                    const otherPlayerConfig = PLAYER_CONFIG[other_player.id];
                    other_player.pawns.forEach(otherPawn => {
                        if (otherPawn.position >= 0 && otherPawn.position <= 51) {
                            const otherPawnGlobalPos = (otherPlayerConfig.pathStart + otherPawn.position) % 52;
                            if (otherPawnGlobalPos === targetPos) {
                                otherPawn.position = -1; // Send back to base
                                toast({title: "Collision!", description: `A ${other_player.name} pawn was sent back to base!`})
                            }
                        }
                    });
                }
            });
        }
        toast({ title: `${player.name} moved ${steps} steps!`})
      })
    );
    setTimeout(() => nextTurn(), 500);
  }, [currentPlayerIndex, nextTurn, toast]);


  const handleAnswer = (isCorrect: boolean, answer: number) => {
    setQuestion(null);
    if (isCorrect) {
      toast({ title: "Correct!", description: `You can move ${answer} steps.`, variant: 'default' });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      executeMove(answer);
    } else {
      toast({ title: "Oops!", description: "Wrong answer. Try again next turn!", variant: 'destructive' });
      setTimeout(() => nextTurn(), 1000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 gap-6 w-full max-w-6xl mx-auto">
        <div className="relative w-full max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] aspect-square">
            <LudoBoard />
            {players.map((player) =>
                player.pawns.map((pawn) => (
                    <div
                        key={`${player.id}-${pawn.id}`}
                        className="absolute transition-all duration-500 ease-in-out flex items-center justify-center"
                        style={getPawnStyle(player, pawn)}
                    >
                        <Pawn color={playerColors[player.id as PlayerColor]} />
                    </div>
                ))
            )}
             <div className="absolute top-4 left-4 z-20">
                <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
            </div>
        </div>
        
        <div className="w-full md:w-auto flex flex-col items-center gap-4">
            <Card className="p-2 px-4 rounded-2xl shadow-lg" style={{backgroundColor: playerColors[currentPlayer.id as PlayerColor]}}>
                <h2 className="text-xl font-bold text-white text-center">{turnState !== 'game-over' ? `${currentPlayer.name}'s Turn` : `Game Over!`}</h2>
            </Card>

            <Card className="w-full max-w-xs p-4 rounded-4xl shadow-lg flex flex-col items-center gap-4">
                {winner ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold" style={{color: playerColors[winner.id as PlayerColor]}}>{winner.name} Wins!</h2>
                        <p className="text-muted-foreground">Congratulations!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-center gap-4">
                            {dice ? <DiceIcon value={dice[0]} /> : <div className="text-3xl border-2 rounded-lg p-2 w-16 h-16 flex items-center justify-center bg-gray-200">?</div>}
                            {dice ? <OperatorIcon op={dice[1]} /> : <div className="text-3xl border-2 rounded-lg p-2 w-16 h-16 flex items-center justify-center bg-gray-200">?</div>}
                            {dice ? <DiceIcon value={dice[2]} /> : <div className="text-3xl border-2 rounded-lg p-2 w-16 h-16 flex items-center justify-center bg-gray-200">?</div>}
                        </div>
                        
                        <Button onClick={handleRollDice} disabled={turnState !== 'rolling'} className="w-full h-16 text-2xl rounded-3xl shadow-lg">
                            <Dices className="mr-2 h-8 w-8" />
                            {turnState === 'rolling' ? 'Roll Dice' : 'Waiting...'}
                        </Button>
                    </>
                )}
            </Card>
        </div>

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
