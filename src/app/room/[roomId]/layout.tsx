"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/cn";

function formatTimeRemaining(timeRemaining: number) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams();
  const [copied, setCopied] = useState(false);
  const timeRemaining = 10;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="h-screen flex flex-col max-h-screen overflow-hidden">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <h3 className="text-xs text-zinc-500">ROOM ID:</h3>

            <div className="flex items-center gap-2">
              <p className="text-green-500">{roomId}</p>

              <button
                onClick={handleCopy}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Copy room URL"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">
              SELF- DESTRUCT:
            </span>
            <span
              className={cn(
                "text-sm font-bold flex items-center gap-2",
                timeRemaining !== null && timeRemaining < 60
                  ? "text-red-500"
                  : "text-amber-500"
              )}
            >
              {timeRemaining ? formatTimeRemaining(timeRemaining) : "--:--:--"}
            </span>
          </div>
        </div>
        <button className="text-zinc-400 bg-zinc-800 hover:text-white  hover:bg-red-700 px-3 py-1.5 transition-all uppercase ">
          Destroy Now
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </main>
  );
}

export default Layout;
