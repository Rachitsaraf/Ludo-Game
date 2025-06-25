import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gamepad2, Trophy, Star, Dice5, Plus, Minus, Maximize, Minimize } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const instructions = [
  {
    title: '1. Roll The Dice',
    content: 'On your turn, click the "Roll" button to roll two number dice and one math operator die.',
    illustration: '🎲',
  },
  {
    title: '2. Get Your Steps',
    content: 'Your dice roll creates a math problem. The result of the problem is the number of steps you get to move!',
    illustration: '🧮',
  },
  {
    title: '3. Move Your Balloon',
    content: 'Select one of your playable balloon pawns to move it forward by the calculated number of steps.',
    illustration: '🎈',
  },
  {
    title: '4. Win The Game',
    content: 'Be the first player to get all four of your balloon pawns around the board and to the finish line!',
    illustration: '🏆',
  },
];

// Component for decorative floating icons
const FloatingIcon = ({ icon: Icon, className, duration = 10, delay = 0 }: { icon: React.ElementType, className: string, duration?: number, delay?: number }) => {
    return (
        <div className={`absolute text-amber-400/10 animate-bounce-slow ${className}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            <Icon className="w-full h-full" />
        </div>
    );
};


export default function InstructionsPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 font-headline flex flex-col items-center justify-center p-4 text-white">
      {/* Background floating icons */}
      <FloatingIcon icon={Dice5} className="w-12 h-12 top-[15%] left-[10%] rotate-12" duration={8} />
      <FloatingIcon icon={Gamepad2} className="w-10 h-10 top-[70%] left-[20%] -rotate-12" duration={12} delay={1} />
      <FloatingIcon icon={Star} className="w-14 h-14 top-[20%] right-[15%] rotate-6" duration={10} delay={0.5} />
      <FloatingIcon icon={Trophy} className="w-12 h-12 bottom-[10%] right-[12%] -rotate-6" duration={9} delay={1.5} />
      <FloatingIcon icon={Plus} className="w-8 h-8 top-[5%] right-[30%] rotate-2" duration={11} />
      <FloatingIcon icon={Minus} className="w-9 h-9 bottom-[15%] left-[35%] -rotate-10" duration={13} delay={0.8} />
      <FloatingIcon icon={Maximize} className="w-10 h-10 top-[40%] left-[5%] rotate-10" duration={10} delay={1.2} />
      <FloatingIcon icon={Minimize} className="w-11 h-11 bottom-[30%] right-[8%]" duration={9} delay={0.3} />

      <div className="absolute top-4 left-4 z-20">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black transition-colors">
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </Link>
      </div>

      <div className="z-10 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg mb-8 text-center animate-title-drop">
          How to Play
        </h1>
        <div className="w-full max-w-md space-y-4">
          {instructions.map((item, index) => (
             <div key={index} className="animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out" style={{ animationFillMode: 'forwards', animationDelay: `${200 + index * 150}ms` }}>
                <Card 
                  className="shadow-2xl rounded-4xl bg-white/20 dark:bg-black/20 backdrop-blur-md border-2 border-white/30 transition-all duration-300 hover:border-white/50 hover:scale-[1.02]"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="text-5xl sm:text-6xl drop-shadow-md animate-bounce-soft">{item.illustration}</div>
                    <CardTitle className="text-xl sm:text-2xl text-white font-bold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base sm:text-lg text-white/80">{item.content}</p>
                  </CardContent>
                </Card>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
