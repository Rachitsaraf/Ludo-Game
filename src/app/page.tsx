import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Settings, HelpCircle, Play } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-headline flex flex-col items-center justify-between p-8 text-center">
      <Image
        src="https://placehold.co/1080x1920.png"
        alt="Colorful Ludo board background"
        fill
        className="object-cover opacity-20"
        data-ai-hint="ludo board game"
      />
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/50 backdrop-blur-sm">
          <Music className="h-6 w-6" />
        </Button>
      </div>

      <div className="z-10 mt-16 sm:mt-24">
        <div className="inline-block bg-white/60 p-4 rounded-4xl shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary-foreground drop-shadow-lg" style={{ WebkitTextStroke: '2px hsl(var(--primary))' }}>
            Ludo Learn & Play
          </h1>
        </div>
      </div>
      
      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-xs sm:max-w-sm">
        <Link href="/game" passHref className="w-full">
          <Button size="lg" className="w-full h-24 text-4xl rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <Play className="mr-4 h-12 w-12" />
            PLAY
          </Button>
        </Link>
        <div className="flex gap-4 w-full">
          <Link href="/instructions" passHref className="flex-1">
            <Button size="lg" variant="secondary" className="w-full h-16 text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
              <HelpCircle className="mr-2 h-7 w-7" />
              How to Play
            </Button>
          </Link>
          <Link href="/settings" passHref className="flex-1">
            <Button size="lg" variant="secondary" className="w-full h-16 text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Settings className="mr-2 h-7 w-7" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="z-10">
        <Image
          src="https://placehold.co/400x100.png"
          alt="Koushiki Innovision Logo"
          width={280}
          height={70}
          className="object-contain"
          data-ai-hint="company logo"
        />
      </div>
    </div>
  );
}
