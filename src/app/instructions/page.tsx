import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const instructions = [
  {
    title: '1. Roll The Dice',
    content: 'On your turn, click the "Roll" button to roll three dice: two for numbers and one for a math operator.',
    illustration: '🎲',
  },
  {
    title: '2. Solve The Math',
    content: 'A math question will pop up based on your dice roll. Choose the correct answer to move your pawn!',
    illustration: '🧠',
  },
  {
    title: '3. Move Your Balloon',
    content: 'If you answer correctly, the result of the math problem is how many steps your balloon pawn can move.',
    illustration: '🎈',
  },
  {
    title: '4. Win The Game',
    content: 'Be the first player to get all four of your balloon pawns around the board and to the finish line!',
    illustration: '🏆',
  },
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center justify-center p-4 text-white">
       <div className="absolute top-4 left-4 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black transition-colors">
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </Link>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg mb-8 text-center">How to Play</h1>
      <div className="w-full max-w-md space-y-4">
        {instructions.map((item, index) => (
          <Card 
            key={index} 
            className="shadow-lg rounded-4xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 transition-all duration-300 hover:border-white/50 hover:scale-[1.02]"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="text-5xl sm:text-6xl drop-shadow-md">{item.illustration}</div>
              <CardTitle className="text-xl sm:text-2xl text-white font-bold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg text-white/80">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
