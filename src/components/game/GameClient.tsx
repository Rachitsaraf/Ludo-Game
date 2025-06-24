"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import { LudoBoard } from './LudoBoard';
import { Pawn } from './Pawn';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dices, Minus, Plus } from 'lucide-react';
import type { Operator, Player, PlayerColor, PawnState } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { getPawnStyle, PLAYER_CONFIG } from '@/lib/board';
import { Confetti } from './Confetti';

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

const SAFE_TILE_INDICES = [0, 10, 13, 21, 26, 34, 39, 45];

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
  const [turnState, setTurnState] = useState<'rolling' | 'selecting' | 'moving' | 'game-over'>('rolling');
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveSteps, setMoveSteps] = useState<number | null>(null);
  const [selectedPawnId, setSelectedPawnId] = useState<number | null>(null);

  const { toast } = useToast();
  
  const currentPlayer = players[currentPlayerIndex];

  const nextTurn = useCallback(() => {
    const newWinner = players.find(p => p.pawns.every(pawn => pawn.position === 57));
    if (newWinner) {
        setWinner(newWinner);
        setTurnState('game-over');
        return;
    }

    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setTurnState('rolling');
    setDice(null);
    setMoveSteps(null);
    setSelectedPawnId(null);
  }, [players]);

  const isPawnMovable = useCallback((pawn: PawnState, steps: number): boolean => {
      if (pawn.position === 57) return false; // Already home
      if (pawn.position + steps > 57) return false; // Overshoots
      return true;
  }, []);

  const handleRollDice = () => {
    if (turnState !== 'rolling') return;
    
    const d1 = Math.floor(Math.random() * 6) + 1;
    const ops: Operator[] = ['+', '-', 'Max', 'Min'];
    const op: Operator = ops[Math.floor(Math.random() * ops.length)];
    const d3 = Math.floor(Math.random() * 6) + 1;
    setDice([d1, op, d3]);

    let result: number;
    switch (op) {
      case '+': result = d1 + d3; break;
      case '-': result = Math.abs(d1 - d3); break;
      case 'Max': result = Math.max(d1, d3); break;
      case 'Min': result = Math.min(d1, d3); break;
      default: result = 0;
    }
    
    if (result === 0) {
        toast({ title: "No move!", description: "Result is 0, skipping turn." });
        setTimeout(() => nextTurn(), 1000);
        return;
    }

    const movablePawns = currentPlayer.pawns.filter(p => isPawnMovable(p, result));

    if (movablePawns.length === 0) {
        toast({ title: "No valid moves!", description: `Cannot move ${result} steps. Skipping turn.` });
        setTimeout(() => nextTurn(), 1000);
        return;
    }
    
    if (movablePawns.length === 1) {
        toast({ title: "Dice Rolled!", description: `Auto-moving ${result} steps.` });
        setTurnState('moving');
        setTimeout(() => executeMove(result, movablePawns[0].id), 500);
    } else {
        setMoveSteps(result);
        setTurnState('selecting');
        toast({ title: "Select a Pawn", description: `Choose a pawn to move ${result} steps.` });
    }
  };

  const handlePawnClick = (pawn: PawnState) => {
    if (turnState !== 'selecting' || !moveSteps || !isPawnMovable(pawn, moveSteps)) return;
    
    setSelectedPawnId(pawn.id);
    setTurnState('moving');

    setTimeout(() => {
        executeMove(moveSteps, pawn.id);
    }, 300); // Short delay to show selection
  };

  const executeMove = useCallback((steps: number, pawnToMoveId: number) => {
    setPlayers(
      produce(draft => {
        const player = draft[currentPlayerIndex];
        const pawnToUpdate = player.pawns.find(p => p.id === pawnToMoveId)!;
        const playerConfig = PLAYER_CONFIG[player.id];
  
        if (pawnToUpdate.position === -1) {
            pawnToUpdate.position = steps - 1;
        } else {
           pawnToUpdate.position += steps;
        }
    
        if (pawnToUpdate.position > 57) {
          pawnToUpdate.position = 57; 
        }
        
        // Collision detection
        if (pawnToUpdate.position >= 0 && pawnToUpdate.position <= 50) {
            const targetPosOnBoard = (playerConfig.pathStart + pawnToUpdate.position) % 52;

            if (!SAFE_TILE_INDICES.includes(targetPosOnBoard)) {
                draft.forEach(other_player => {
                    if (other_player.id !== player.id) {
                        const otherPlayerConfig = PLAYER_CONFIG[other_player.id];
                        other_player.pawns.forEach(otherPawn => {
                            if (otherPawn.position >= 0 && otherPawn.position <= 50) {
                                const otherPawnGlobalPos = (otherPlayerConfig.pathStart + otherPawn.position) % 52;
                                if (otherPawnGlobalPos === targetPosOnBoard) {
                                    otherPawn.position = -1; // Send back to base
                                    toast({title: "Collision!", description: `A ${other_player.name} pawn was sent back to base!`})
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

  const getTurnMessage = () => {
    switch(turnState) {
        case 'rolling': return 'Roll Dice';
        case 'selecting': return 'Select a Pawn';
        case 'moving': return 'Moving...';
        case 'game-over': return 'Game Over!';
        default: return 'Roll Dice';
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 gap-6 w-full max-w-6xl mx-auto">
        {winner && <Confetti />}
        <div className="relative w-full max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] aspect-square">
            <LudoBoard />
            {players.map((player) =>
                player.pawns.map((pawn) => {
                    const isCurrentPlayerPawn = player.id === currentPlayer.id;
                    const canBeSelected = turnState === 'selecting' && isCurrentPlayerPawn && moveSteps !== null && isPawnMovable(pawn, moveSteps);
                    const isCurrentlySelected = pawn.id === selectedPawnId && isCurrentPlayerPawn;

                    return (
                        <div
                            key={`${player.id}-${pawn.id}`}
                            className="absolute transition-all duration-700 ease-in-out flex items-center justify-center"
                            style={getPawnStyle(player, pawn)}
                        >
                            <Pawn 
                                color={playerColors[player.id as PlayerColor]} 
                                isSelectable={canBeSelected}
                                isSelected={isCurrentlySelected}
                                onClick={() => handlePawnClick(pawn)}
                            />
                        </div>
                    );
                })
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
                            {getTurnMessage()}
                        </Button>
                    </>
                )}
            </Card>
        </div>
    </div>
  );
};
