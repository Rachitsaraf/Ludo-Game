import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-background font-headline flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
            <ArrowLeft className="h-8 w-8" />
          </Button>
        </Link>
      </div>
      <h1 className="text-5xl font-bold text-primary-foreground mb-8 text-center">How to Play</h1>
      <div className="w-full max-w-md space-y-4">
        {instructions.map((item, index) => (
          <Card key={index} className="shadow-lg rounded-4xl bg-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="text-5xl">{item.illustration}</div>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="w-full max-w-md mt-8 shadow-lg rounded-4xl bg-white">
        <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                Made with <Heart className="text-destructive" fill="hsl(var(--destructive))" /> by
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg text-center text-muted-foreground tracking-wider">Vipul, Rachir, Dhiraj, & Poonam</p>
        </CardContent>
      </Card>
    </div>
  );
}
