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
  red: '#ef4444',    // bg-red-500
  green: '#22c55e',  // bg-green-500
  blue: '#3b82f6',   // bg-blue-500
  yellow: '#f59e0b', // bg-yellow-500
};

const initialPawns: PawnState[] = [
  { id: 1, position: -1 },
  { id: 2, position: -1 },
  { id: 3, position: -1 },
  { id: 4, position: -1 },
];

const initialPlayers: Player[] = [
  { id: 'red', name: 'Red', color: playerColors.red, pawns: JSON.parse(JSON.stringify(initialPawns)) },
  { id: 'green', name: 'Green', color: playerColors.green, pawns: JSON.parse(JSON.stringify(initialPawns)) },
  { id: 'blue', name: 'Blue', color: playerColors.blue, pawns: JSON.parse(JSON.stringify(initialPawns)) },
  { id: 'yellow', name: 'Yellow', color: playerColors.yellow, pawns: JSON.parse(JSON.stringify(initialPawns)) },
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

        // A pawn can only leave base if the roll is a 6. In our game, the number of steps is the answer.
        const canLeaveBase = steps === 6;

        let movablePawns = pawns.filter(p => {
            if (p.position === -1) return canLeaveBase; // Can move from base only on 6
            if (p.position === 57) return false; // Cannot move finished pawns
            return p.position + steps <= 57; // Can move if it doesn't overshoot
        });

        // Prefer moving pawns already on the board
        let pawnToMove = movablePawns.find(p => p.position >= 0);
        if (!pawnToMove) {
            pawnToMove = movablePawns.find(p => p.position === -1);
        }

        if (!pawnToMove) {
          toast({ title: "No valid moves!", description: "Skipping turn." });
          nextTurn();
          return;
        }

        if (pawnToMove.position === -1 && canLeaveBase) {
          pawnToMove.position = 0; // Moves to start
        } else {
          pawnToMove.position += steps;
        }
  
        if (pawnToMove.position > 56) {
          pawnToMove.position = 57; // Finished
        } 
        
        // Collision detection
        if (pawnToMove.position < 51) { // Only check for collisions on the main path
            const { path, safeTiles } = PLAYER_CONFIG[player.id];
            const targetPos = path[pawnToMove.position];

            if (!safeTiles.includes(targetPos)) {
                draft.forEach(p_other => {
                    if (p_other.id !== player.id) {
                        const otherPlayerConfig = PLAYER_CONFIG[p_other.id];
                        p_other.pawns.forEach(otherPawn => {
                            if (otherPawn.position >= 0 && otherPawn.position < 51) {
                                const otherPawnGlobalPos = otherPlayerConfig.path[otherPawn.position];
                                if (otherPawnGlobalPos === targetPos) {
                                    otherPawn.position = -1; // Send back to base
                                    toast({title: "Collision!", description: `A ${p_other.name} pawn was sent back to base!`})
                                }
                            }
                        });
                    }
                });
            }
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
            <h2 className="text-lg font-bold text-white text-center">{turnState !== 'game-over' ? `${currentPlayer.name}'s Turn` : `Game Over!`}</h2>
          </Card>
        </div>
        
        <div className="relative w-full max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] aspect-square">
            <LudoBoard />
            {players.map((player) =>
                player.pawns.map((pawn) => (
                    <div
                        key={`${player.id}-${pawn.id}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={getPawnStyle(player, pawn)}
                    >
                        <Pawn color={player.color} />
                    </div>
                ))
            )}
        </div>

        <Card className="w-full max-w-md p-4 rounded-4xl shadow-lg flex flex-col items-center gap-4">
            {winner ? (
                <div className="text-center">
                    <h2 className="text-3xl font-bold" style={{color: winner.color}}>{winner.name} Wins!</h2>
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
