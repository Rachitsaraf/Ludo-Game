import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, HelpCircle, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center justify-around p-6 text-center text-white">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
         <Image
            src="https://placehold.co/1080x1920.png"
            alt="Vibrant cosmic background with glowing stars and sparkles"
            fill
            className="object-cover opacity-30"
            data-ai-hint="cosmic stars sparkles"
        />
      </div>

      <div className="z-10 flex flex-col items-center gap-4">
        <h1 className="font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          <span className="block text-7xl sm:text-8xl bg-gradient-to-b from-yellow-400 to-amber-500 bg-clip-text text-transparent" style={{ WebkitTextStroke: '2px #c2331a' }}>
            Ludo
          </span>
          <span className="block text-4xl sm:text-5xl bg-gradient-to-b from-yellow-300 to-amber-400 bg-clip-text text-transparent" style={{ WebkitTextStroke: '1px #c2331a' }}>
            Learn & Play
          </span>
        </h1>
      </div>
      
      <div className="z-10 flex flex-col items-center gap-4 w-full max-w-xs">
        <Link href="/game" passHref className="w-full">
          <Button size="lg" className="w-full h-14 sm:h-16 text-xl sm:text-2xl rounded-2xl shadow-2xl bg-purple-600 hover:bg-purple-700 border-2 border-purple-400/50 transform hover:scale-105 transition-transform duration-300 ease-in-out">
            Start Game
          </Button>
        </Link>
        <Link href="/instructions" passHref className="w-full">
          <Button size="lg" className="w-full h-14 sm:h-16 text-xl sm:text-2xl rounded-2xl shadow-xl bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-yellow-300/50 transform hover:scale-105 transition-transform duration-200">
            Instructions
          </Button>
        </Link>
        <Link href="/settings" passHref className="w-full">
          <Button size="lg" className="w-full h-14 sm:h-16 text-xl sm:text-2xl rounded-2xl shadow-xl bg-blue-600 hover:bg-blue-700 border-2 border-blue-400/50 transform hover:scale-105 transition-transform duration-200">
            Settings
          </Button>
        </Link>
      </div>

      <div className="z-10 text-center pb-2">
        <Image
          src="https://placehold.co/750x200.png"
          alt="Koushiki Innovision Logo with tagline"
          width={280}
          height={70}
          className="object-contain mx-auto"
          data-ai-hint="company logo tagline"
        />
      </div>
    </div>
  );
}
