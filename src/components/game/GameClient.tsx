
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { produce } from 'immer';
import { LudoBoard } from './LudoBoard';
import { Pawn } from './Pawn';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dices, Minus, Plus, HelpCircle, User, Bot } from 'lucide-react';
import type { Operator, Player, PlayerColor, PawnState } from '@/lib/types';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getPawnStyle, PLAYER_CONFIG } from '@/lib/board';
import { Confetti } from './Confetti';
import { CHARACTER_DATA, CHARACTER_HINTS } from '@/lib/characters';
import Image from 'next/image';
import { useSound } from '@/hooks/use-sound';

const playerColors = {
  red: '#f87171',    // red-400
  green: '#4ade80',  // green-400
  blue: '#60a5fa',   // blue-400
  yellow: '#facc15', // yellow-400
};

const SAFE_TILE_INDICES = [0, 8, 15, 23, 30, 38, 45, 53];


const DieFace = ({ value }: { value: number }) => {
  const Dot = () => <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full" />;

  const faceClasses = "w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-lg p-2 bg-white shadow-inner flex";
  const justifyContentClasses = {
    1: 'justify-center items-center',
    2: 'justify-between',
    3: 'justify-between',
    4: 'justify-between',
    5: 'justify-between',
    6: 'justify-between',
  };

  return (
    <div className={`${faceClasses} ${justifyContentClasses[value as keyof typeof justifyContentClasses]}`}>
        {value === 1 && <Dot />}
        {value === 2 && <><div className="self-start"><Dot /></div><div className="self-end"><Dot /></div></>}
        {value === 3 && <><div className="self-start"><Dot /></div><div className="self-center"><Dot /></div><div className="self-end"><Dot /></div></>}
        {value === 4 && <><div className="flex flex-col justify-between"><Dot /><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /></div></>}
        {value === 5 && <><div className="flex flex-col justify-between"><Dot /><Dot /></div><div className="flex flex-col justify-center"><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /></div></>}
        {value === 6 && <><div className="flex flex-col justify-between"><Dot /><Dot /><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /><Dot /></div></>}
    </div>
  );
};

const DicePlaceholder = () => (
    <div className="text-3xl border-2 rounded-lg p-2 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-200">
      <Dices size={32} />
    </div>
);

const OperatorIcon = ({op}: {op: Operator}) => {
    const icons = { '+': <Plus size={28}/>, '-': <Minus size={28}/>, 'Max': 'Max', 'Min': 'Min'};
    return <div className="text-2xl sm:text-3xl font-bold border-2 rounded-lg p-2 bg-white shadow-inner w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">{icons[op]}</div>
}

const OperatorPlaceholder = () => (
    <div className="text-3xl border-2 rounded-lg p-2 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-200">
      <HelpCircle size={32} />
    </div>
);

export const GameClient = ({ humanColors }: { humanColors: PlayerColor[] }) => {
  const initialPlayers = useMemo(() => {
    const allColors: PlayerColor[] = ['red', 'green', 'blue', 'yellow'];
    return allColors.map(color => ({
        id: color,
        name: CHARACTER_DATA[color].name,
        pawns: Array.from({ length: 4 }, (_, i) => ({ id: i + 1, position: -1 })),
        isBot: !humanColors.includes(color),
        characterName: CHARACTER_DATA[color].name,
        characterImage: CHARACTER_DATA[color].image,
    }));
  }, [humanColors]);

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, Operator, number] | null>(null);
  const [turnState, setTurnState] = useState<'rolling' | 'selecting' | 'moving' | 'game-over'>('rolling');
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveSteps, setMoveSteps] = useState<number | null>(null);
  const [selectedPawnId, setSelectedPawnId] = useState<number | null>(null);
  const { playSound } = useSound();
  const [turnMessage, setTurnMessage] = useState<string | null>(null);
  
  const [animationState, setAnimationState] = useState<{
    pawnId: number;
    playerIndex: number;
    path: number[];
    totalSteps: number;
  } | null>(null);

  const currentPlayer = players[currentPlayerIndex];

  const nextTurn = useCallback((updatedPlayers: Player[] = players) => {
    const newWinner = updatedPlayers.find(p => p.pawns.every(pawn => pawn.position === 66));
    if (newWinner) {
        setWinner(newWinner);
        setTurnState('game-over');
        playSound('win');
        return;
    }

    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setTurnState('rolling');
    setDice(null);
    setMoveSteps(null);
    setSelectedPawnId(null);
    setTurnMessage(null);
  }, [players, playSound]);

  const isPawnMovable = useCallback((pawn: PawnState, steps: number): boolean => {
      if (pawn.position === 66) return false;

      if (pawn.position === -1) {
        return steps === 6;
      }

      if (pawn.position + steps > 66) return false;
      return true;
  }, []);

  const executeMove = useCallback((steps: number, pawnToMoveId: number) => {
    const player = players[currentPlayerIndex];
    const pawn = player.pawns.find(p => p.id === pawnToMoveId)!;
    const startPos = pawn.position;
    const path: number[] = [];

    if (startPos === -1 && steps === 6) {
        path.push(0);
    } else {
        for (let i = 1; i <= steps; i++) {
            const nextPos = startPos + i;
            if (nextPos > 66) break; 
            path.push(nextPos);
        }
    }
    
    if (path.length > 0) {
        setTurnState('moving');
        setAnimationState({
            pawnId: pawnToMoveId,
            playerIndex: currentPlayerIndex,
            path: path,
            totalSteps: path.length,
        });
    } else {
        nextTurn();
    }
  }, [players, currentPlayerIndex, nextTurn]);

  useEffect(() => {
    if (turnState !== 'moving' || !animationState) return;
    let animationTimeout: NodeJS.Timeout;

    if (animationState.path.length === 0) {
        const nextPlayersState = produce(players, draft => {
            const movedPlayer = draft[animationState.playerIndex];
            const movedPawn = movedPlayer.pawns.find(p => p.id === animationState.pawnId)!;
            const finalPosition = movedPawn.position;

            // Collision logic
            if (finalPosition >= 0 && finalPosition < 60) {
                const playerConfig = PLAYER_CONFIG[movedPlayer.id];
                const targetPosOnBoard = (playerConfig.pathStart + finalPosition) % 60;
                if (!SAFE_TILE_INDICES.includes(targetPosOnBoard)) {
                    draft.forEach(otherPlayer => {
                        if (otherPlayer.id !== movedPlayer.id) {
                            const otherPlayerConfig = PLAYER_CONFIG[otherPlayer.id];
                            otherPlayer.pawns.forEach(otherPawn => {
                                if (otherPawn.position >= 0 && otherPawn.position < 60) {
                                    const otherPawnGlobalPos = (otherPlayerConfig.pathStart + otherPawn.position) % 60;
                                    if (otherPawnGlobalPos === targetPosOnBoard) {
                                        otherPawn.position = -1;
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
        
        animationTimeout = setTimeout(() => {
            setPlayers(nextPlayersState);
            setAnimationState(null);
            nextTurn(nextPlayersState);
        }, 300);
    } else {
        animationTimeout = setTimeout(() => {
            playSound('move');
            setPlayers(produce(draft => {
                const player = draft[animationState.playerIndex];
                const pawn = player.pawns.find(p => p.id === animationState.pawnId)!;
                if (pawn.position === -1 && animationState.path[0] === 0) {
                  pawn.position = 0;
                } else {
                  pawn.position = animationState.path[0];
                }
            }));

            setAnimationState(produce(draft => {
                if (draft) {
                    draft.path.shift();
                }
            }));
        }, 300); // Delay between steps
    }

    return () => clearTimeout(animationTimeout);
  }, [turnState, animationState, players, nextTurn, playSound]);

  const performRoll = useCallback((): number => {
    playSound('dice');
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
    return result;
  }, [playSound]);

  const handleRollDice = () => {
    if (turnState !== 'rolling' || currentPlayer.isBot) return;
    
    const result = performRoll();
    setTurnMessage(`You rolled for ${result} steps!`);
    
    if (result === 0) {
        setTurnMessage("No move! Result is 0, skipping turn.");
        setTimeout(() => nextTurn(), 1200);
        return;
    }

    const movablePawns = currentPlayer.pawns.filter(p => isPawnMovable(p, result));
    
    if (movablePawns.length === 0) {
        setTurnMessage(`No valid moves! Cannot move ${result} steps. Skipping turn.`);
        setTimeout(() => nextTurn(), 1200);
        return;
    }
    
    setMoveSteps(result);
    setTurnState('selecting');
  };

  const handlePawnClick = (pawn: PawnState) => {
    if (turnState !== 'selecting' || currentPlayer.isBot || !moveSteps || !isPawnMovable(pawn, moveSteps)) return;
    
    playSound('click');
    setSelectedPawnId(pawn.id);
    executeMove(moveSteps, pawn.id);
  };

  const handleBotTurn = useCallback(() => {
    if (turnState !== 'rolling' || !currentPlayer.isBot) return;

    setTurnMessage(`${currentPlayer.characterName} is thinking...`);
    
    setTimeout(() => {
      const result = performRoll();
      setTurnMessage(`${currentPlayer.characterName} (Bot) rolled for ${result} steps`);

      if (result === 0) {
          setTimeout(() => nextTurn(), 1200);
          return;
      }

      const movablePawns = currentPlayer.pawns.filter(p => isPawnMovable(p, result));

      if (movablePawns.length === 0) {
          setTimeout(() => nextTurn(), 1200);
          return;
      }

      let pawnToMove: PawnState | null = null;
      const pawnsInBase = movablePawns.filter(p => p.position === -1);
      
      if (result === 6 && pawnsInBase.length > 0) {
          pawnToMove = pawnsInBase[0];
      } else {
          const pawnsOnBoard = movablePawns.filter(p => p.position !== -1).sort((a, b) => b.position - a.position);
          pawnToMove = pawnsOnBoard[0] || null;
      }
      
      if (pawnToMove) {
        setMoveSteps(result);
        setTimeout(() => {
            executeMove(result, pawnToMove!.id);
        }, 800);
      } else {
          setTimeout(() => nextTurn(), 1200);
      }
    }, 1500);
  }, [turnState, currentPlayer, isPawnMovable, nextTurn, performRoll, executeMove]);

  useEffect(() => {
    if (turnState === 'rolling' && currentPlayer.isBot && !winner) {
      const timer = setTimeout(() => {
        handleBotTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turnState, currentPlayer, winner, handleBotTurn]);

  const getTurnStatusMessage = () => {
    switch(turnState) {
        case 'rolling': return currentPlayer.isBot ? 'Bot is Rolling...' : 'Roll Your Dice!';
        case 'selecting': return 'Select a Pawn to Move';
        case 'moving': return 'Moving...';
        case 'game-over': return 'Game Over!';
        default: return 'Roll Dice';
    }
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center p-2 sm:p-4 gap-4 sm:gap-6 w-full max-w-7xl mx-auto">
        <div className="absolute top-4 left-4 z-10">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black">
                    <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
            </Link>
        </div>
        
        {winner && <Confetti />}
        <div className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-xl aspect-square">
            <LudoBoard />
            {players.map((player) =>
                player.pawns.map((pawn) => {
                    const isCurrentPlayerPawn = player.id === currentPlayer.id;
                    const canBeSelected = turnState === 'selecting' && isCurrentPlayerPawn && !currentPlayer.isBot && moveSteps !== null && isPawnMovable(pawn, moveSteps);
                    const isCurrentlySelected = pawn.id === selectedPawnId && isCurrentPlayerPawn;

                    return (
                        <div
                            key={`${player.id}-${pawn.id}`}
                            className="absolute transition-all duration-300 ease-in-out flex items-center justify-center"
                            style={getPawnStyle(player, pawn)}
                        >
                            <Pawn 
                                color={playerColors[player.id as PlayerColor]} 
                                isSelectable={canBeSelected}
                                isSelected={isCurrentlySelected}
                                onClick={() => handlePawnClick(pawn)}
                                characterImage={player.characterImage}
                                data-ai-hint={CHARACTER_HINTS[player.id]}
                            />
                        </div>
                    );
                })
            )}
        </div>
        
        <div className="w-full md:w-auto flex flex-col items-center gap-4">
            <Card className="p-4 rounded-4xl shadow-lg w-full max-w-xs flex flex-col items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20">
                 <div className="w-full text-center p-2 rounded-lg" style={{ backgroundColor: playerColors[currentPlayer.id] }}>
                    <h2 className="text-xl font-bold text-white">
                        {winner ? `${winner.characterName} Wins!` : `${currentPlayer.characterName}'s Turn`}
                    </h2>
                    <p className="text-sm text-white/90">{getTurnStatusMessage()}</p>
                 </div>
                {winner ? (
                    <div className="text-center text-white flex-grow flex flex-col justify-center items-center h-[180px]">
                        <p className="text-4xl">🏆</p>
                        <p className="text-muted-foreground mt-2">Congratulations!</p>
                         <Link href="/" passHref>
                           <Button className="mt-4">Play Again</Button>
                         </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="flex items-center justify-center gap-2 sm:gap-4">
                                {dice ? <DieFace value={dice[0]} /> : <DicePlaceholder />}
                                {dice ? <OperatorIcon op={dice[1]} /> : <OperatorPlaceholder />}
                                {dice ? <DieFace value={dice[2]} /> : <DicePlaceholder />}
                            </div>
                        </div>
                        
                        <Button onClick={handleRollDice} disabled={turnState !== 'rolling' || currentPlayer.isBot} className="w-full h-14 sm:h-16 text-xl sm:text-2xl rounded-3xl shadow-lg">
                            <Dices className="mr-2 h-6 w-6 sm:h-8 sm:h-8" />
                            Roll Dice
                        </Button>
                        <div className="h-6 mt-1 text-center text-white font-semibold">
                          {turnMessage && <p className="animate-in fade-in-0">{turnMessage}</p>}
                        </div>
                    </>
                )}
            </Card>
        </div>
    </div>
  );
};
