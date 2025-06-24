import React from "react";

export const LudoBoard = () => {
  const PathSquare = ({ className = "" }) => <div className={`border border-black/10 rounded-sm ${className}`}></div>;
  const HomeBaseSquare = ({ className = "" }) => <div className={`flex items-center justify-center rounded-full bg-white/50 ${className}`}></div>;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[90vw] rounded-2xl bg-primary/20 p-1 shadow-lg sm:p-2 md:max-w-[500px] lg:max-w-[600px]">
      <div className="grid h-full w-full grid-cols-15 grid-rows-15">
        {/* Red Home */}
        <div className="col-span-6 row-span-6 bg-red-400 p-2 rounded-tl-lg">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 p-2 rounded-md bg-red-300">
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
          </div>
        </div>

        {/* Blue Home */}
        <div className="col-start-10 col-span-6 row-span-6 bg-blue-400 p-2 rounded-tr-lg">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 p-2 rounded-md bg-blue-300">
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
          </div>
        </div>

        {/* Green Home */}
        <div className="col-span-6 row-start-10 row-span-6 bg-green-400 p-2 rounded-bl-lg">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 p-2 rounded-md bg-green-300">
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
          </div>
        </div>

        {/* Yellow Home */}
        <div className="col-start-10 col-span-6 row-start-10 row-span-6 bg-yellow-400 p-2 rounded-br-lg">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 p-2 rounded-md bg-yellow-300">
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
            <HomeBaseSquare />
          </div>
        </div>

        {/* Center Triangle */}
        <div className="col-start-7 col-span-3 row-start-7 row-span-3 flex items-center justify-center">
          <div className="h-full w-full transform " style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <div className="w-full h-full bg-red-500"></div>
          </div>
           <div className="h-full w-full transform -rotate-90" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <div className="w-full h-full bg-blue-500"></div>
          </div>
           <div className="h-full w-full transform rotate-90" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <div className="w-full h-full bg-green-500"></div>
          </div>
            <div className="h-full w-full transform rotate-180" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <div className="w-full h-full bg-yellow-500"></div>
          </div>
        </div>

        {/* Paths */}
        <div className="col-start-7 col-span-3 row-start-1 row-span-6 grid grid-cols-3">
            {[...Array(6)].map((_, i) => <React.Fragment key={i}><PathSquare /><PathSquare className={i > 0 ? 'bg-blue-500' : ''} /><PathSquare /></React.Fragment>)}
        </div>
        <div className="col-start-9 col-span-6 row-start-7 row-span-3 grid grid-rows-3">
             {[...Array(6)].map((_, i) => <React.Fragment key={i}><PathSquare /><PathSquare className={i < 5 ? 'bg-yellow-500' : ''} /><PathSquare /></React.Fragment>)}
        </div>
        <div className="col-start-7 col-span-3 row-start-9 row-span-6 grid grid-cols-3">
             {[...Array(6)].map((_, i) => <React.Fragment key={i}><PathSquare /><PathSquare className={i < 5 ? 'bg-green-500' : ''} /><PathSquare /></React.Fragment>)}
        </div>
        <div className="col-start-1 col-span-6 row-start-7 row-span-3 grid grid-rows-3">
             {[...Array(6)].map((_, i) => <React.Fragment key={i}><PathSquare /><PathSquare className={i > 0 ? 'bg-red-500' : ''} /><PathSquare /></React.Fragment>)}
        </div>
        
        {/* Main Path squares */}
        <div className="col-start-7 col-span-1 row-span-6"><PathSquare className="bg-red-300" /></div>
        <div className="col-start-1 col-span-6 row-start-7 row-span-1"><PathSquare /></div>
        <div className="col-start-8 col-span-1 row-span-6"><PathSquare /></div>
        <div className="col-start-1 col-span-6 row-start-8 row-span-1"><PathSquare /></div>

        <div className="col-start-9 col-span-1 row-span-6"><PathSquare className="bg-blue-300"/></div>
        <div className="col-start-9 col-span-6 row-start-7 row-span-1"><PathSquare/></div>
        <div className="col-start-8 col-span-1 row-start-9 row-span-6"><PathSquare/></div>
        <div className="col-start-9 col-span-6 row-start-8 row-span-1"><PathSquare className="bg-yellow-300"/></div>
        
        <div className="col-start-7 col-span-1 row-start-9 row-span-6"><PathSquare/></div>
        <div className="col-start-1 col-span-6 row-start-9 row-span-1"><PathSquare className="bg-green-300"/></div>
      </div>
    </div>
  );
};
