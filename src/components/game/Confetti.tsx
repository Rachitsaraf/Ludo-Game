"use client";
import React, { useEffect, useState, useMemo } from 'react';

export const Confetti = () => {
    const [pieces, setPieces] = useState<any[]>([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            rotation: Math.random() * 360,
            size: Math.random() * 10 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 1
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {pieces.map(p => (
                <div
                    key={p.id}
                    className="absolute"
                    style={{
                        left: `${p.x}vw`,
                        top: `${p.y}vh`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes fall {
                    to {
                        transform: translateY(120vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};
