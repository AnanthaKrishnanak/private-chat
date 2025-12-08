"use client";

import { useUserName } from "@/hooks/useUserName";

function IdentityCard() {
  const { userName } = useUserName();

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
      <div className="mb-6">
        <h2 className="text-neutral-300 text-sm uppercase tracking-wider">
          Your Identity
        </h2>

        <p className="mt-2 font-mono text-lg text-neutral-100 bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 select-none">
          {userName}
        </p>
      </div>

      <button
        className="w-full py-3 mt-3 bg-white text-black font-semibold tracking-wide uppercase rounded-none 
                     hover:bg-neutral-200 transition-all"
      >
        Create Secure Room
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="border-zinc-800">
          <IdentityCard />
        </div>
      </div>
    </main>
  );
}
