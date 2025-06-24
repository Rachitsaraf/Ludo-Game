import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, HelpCircle, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-600 to-fuchsia-600 font-headline flex flex-col items-center justify-between p-6 text-center text-white">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
         <Image
            src="https://placehold.co/1080x1920.png"
            alt="Vibrant magenta and purple gradient with glowing stars and sparkles"
            fill
            className="object-cover opacity-20"
            data-ai-hint="glowing stars sparkles bokeh"
        />
      </div>
      
      {/* Spacer to push content down from top */}
      <div />

      <div className="z-10 flex flex-col items-center gap-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          Ludo Learn & Play
        </h1>
        <div className="relative z-10 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
          <Image
              src="https://placehold.co/300x300.png"
              alt="Classic Ludo board"
              width={250}
              height={250}
              className="object-contain drop-shadow-2xl"
              data-ai-hint="ludo board"
          />
          <Image
              src="https://placehold.co/100x100.png"
              alt="Floating white 3D die"
              width={80}
              height={80}
              className="absolute -top-5 -left-5 object-contain transform -rotate-12 drop-shadow-2xl"
              data-ai-hint="white die"
          />
          <Image
              src="https://placehold.co/100x100.png"
              alt="Floating blue 3D die"
              width={80}
              height={80}
              className="absolute -top-2 right-0 object-contain transform rotate-12 drop-shadow-2xl"
              data-ai-hint="blue die"
          />
        </div>
      </div>
      
      <div className="z-10 flex flex-col items-center gap-4 w-full max-w-xs sm:max-w-sm">
        <Link href="/game" passHref className="w-full">
          <Button size="lg" className="w-full h-16 text-2xl rounded-full shadow-2xl bg-white text-fuchsia-600 hover:bg-white/90 transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <Play className="mr-3 h-8 w-8" />
            Start Game
          </Button>
        </Link>
        <Link href="/instructions" passHref className="w-full">
          <Button size="lg" variant="secondary" className="w-full h-14 text-xl rounded-full shadow-lg bg-white/20 backdrop-blur-sm border-white/40 border hover:bg-white/30 transform hover:scale-105 transition-transform duration-200">
            <HelpCircle className="mr-2 h-6 w-6" />
            Instructions
          </Button>
        </Link>
        <Link href="/settings" passHref className="w-full">
          <Button size="lg" variant="secondary" className="w-full h-14 text-xl rounded-full shadow-lg bg-white/20 backdrop-blur-sm border-white/40 border hover:bg-white/30 transform hover:scale-105 transition-transform duration-200">
            <Settings className="mr-2 h-6 w-6" />
            Settings
          </Button>
        </Link>
      </div>

      <div className="z-10 text-center">
        <Image
          src="https://placehold.co/280x70.png"
          alt="Koushiki Innovision Logo"
          width={180}
          height={45}
          className="object-contain mx-auto"
          data-ai-hint="company logo"
        />
        <p className="text-xs mt-2 text-white/80 italic max-w-xs">"Where industry and academia blend to create a unique diagonal!"</p>
      </div>
    </div>
  );
}
