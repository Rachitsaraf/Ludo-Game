import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Settings, HelpCircle, Play } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-headline flex flex-col items-center justify-center p-4">
      <Image
        src="https://placehold.co/1080x1920/A7D9ED/F0F8FF"
        alt="Cartoon background"
        fill
        className="object-cover opacity-30"
        data-ai-hint="cartoon landscape"
      />
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
          <Music className="h-6 w-6" />
        </Button>
      </div>

      <div className="z-10 text-center flex flex-col items-center gap-8">
        <h1 className="text-7xl font-bold text-primary-foreground drop-shadow-lg" style={{ WebkitTextStroke: '3px hsl(var(--primary))' }}>
          Ludo Learn & Play
        </h1>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Link href="/game" passHref>
            <Button size="lg" className="w-full h-16 text-2xl rounded-4xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Play className="mr-2 h-8 w-8" />
              Start Game
            </Button>
          </Link>
          <Link href="/instructions" passHref>
            <Button size="lg" variant="secondary" className="w-full h-16 text-2xl rounded-4xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <HelpCircle className="mr-2 h-8 w-8" />
              Instructions
            </Button>
          </Link>
          <Link href="/settings" passHref>
            <Button size="lg" variant="secondary" className="w-full h-16 text-2xl rounded-4xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Settings className="mr-2 h-8 w-8" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-center text-primary-foreground/50 z-10">
        <p className="font-bold text-lg">Koushiki Innovision</p>
      </div>
    </div>
  );
}
