export const LudoBoard = ({ children }: { children: React.ReactNode }) => {
  const PathSquare = ({ className = "" }) => <div className={`border border-black/10 ${className}`}></div>;
  const HomePathSquare = ({ color }) => <div className={`bg-${color}-400 border border-black/20`}></div>;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[90vw] rounded-2xl bg-primary/20 p-1 shadow-lg sm:p-2 md:max-w-[500px] lg:max-w-[600px]">
      <div className="grid h-full w-full grid-cols-13 grid-rows-13">
        {/* Corners */}
        <div className="col-span-5 row-span-5 rounded-lg bg-red-400 p-2">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2 rounded-md bg-red-300 p-2">
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
          </div>
        </div>
        <div className="col-start-9 col-span-5 row-span-5 rounded-lg bg-blue-400 p-2">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2 rounded-md bg-blue-300 p-2">
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
          </div>
        </div>
        <div className="col-span-5 row-start-9 row-span-5 rounded-lg bg-green-400 p-2">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2 rounded-md bg-green-300 p-2">
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
          </div>
        </div>
        <div className="col-start-9 col-span-5 row-start-9 row-span-5 rounded-lg bg-yellow-400 p-2">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2 rounded-md bg-yellow-300 p-2">
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
            <div className="rounded-full bg-white/50"></div>
          </div>
        </div>

        {/* Center */}
        <div className="col-start-6 col-span-3 row-start-6 row-span-3 flex items-center justify-center">
            <div className="h-full w-full transform -rotate-45">
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                    <div className="bg-red-400"></div>
                    <div className="bg-blue-400"></div>
                     <div className="bg-green-400"></div>
                    <div className="bg-yellow-400"></div>
                </div>
            </div>
        </div>
        
        {/* Paths */}
        <div className="col-start-6 col-span-3 row-span-5 grid grid-cols-3 grid-rows-5">
            <PathSquare /><PathSquare className="bg-blue-300" /><PathSquare />
            <PathSquare /><HomePathSquare color="blue" /><PathSquare />
            <PathSquare /><HomePathSquare color="blue" /><PathSquare />
            <PathSquare /><HomePathSquare color="blue" /><PathSquare />
            <PathSquare /><HomePathSquare color="blue" /><PathSquare />
        </div>
        <div className="col-start-9 col-span-5 row-start-6 row-span-3 grid grid-cols-5 grid-rows-3">
            <PathSquare /><PathSquare /><PathSquare /><PathSquare /><PathSquare />
            <PathSquare className="bg-yellow-300" /><HomePathSquare color="yellow" /><HomePathSquare color="yellow" /><HomePathSquare color="yellow" /><HomePathSquare color="yellow" />
            <PathSquare /><PathSquare /><PathSquare /><PathSquare /><PathSquare />
        </div>
         <div className="col-start-6 col-span-3 row-start-9 row-span-5 grid grid-cols-3 grid-rows-5">
            <HomePathSquare color="red" /><HomePathSquare color="red" /><PathSquare />
            <HomePathSquare color="red" /><PathSquare /><PathSquare />
            <HomePathSquare color="red" /><PathSquare /><PathSquare />
            <PathSquare className="bg-red-300" /><PathSquare /><PathSquare />
            <PathSquare /><PathSquare /><PathSquare />
        </div>
         <div className="col-span-5 row-start-6 row-span-3 grid grid-cols-5 grid-rows-3">
            <HomePathSquare color="green" /><HomePathSquare color="green" /><HomePathSquare color="green" /><HomePathSquare color="green" /><PathSquare className="bg-green-300" />
            <PathSquare /><PathSquare /><PathSquare /><PathSquare /><PathSquare />
            <PathSquare /><PathSquare /><PathSquare /><PathSquare /><PathSquare />
        </div>
      </div>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
