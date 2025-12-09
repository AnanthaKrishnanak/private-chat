"use client";

import Timer from "@/components/timer";
import { useMessages } from "@/hooks/useMessages";
import { useTTL } from "@/hooks/useTTL";
import { Check, Copy, Lock, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import DestroyRoom from "./components/destroy";

function Layout({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams();
  const [copied, setCopied] = useState(false);

  const { data: messages = [], isLoading: isMessagesLoading } = useMessages();
  const { data: ttl, isLoading: isTTLLoading } = useTTL();

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
    <main className="bg-zinc-950 text-zinc-200 h-screen flex flex-col overflow-hidden">
      <header className="flex-none border-b border-white/5 bg-zinc-950/50 backdrop-blur-md z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="text-xs font-medium uppercase">Room ID</span>
              <Lock className="w-3 h-3" />
            </div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <span className="font-mono text-emerald-400 text-lg">
                {roomId}
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              ) : (
                <Copy
                  className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors"
                  onClick={handleCopy}
                />
              )}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center">
            <span className="text-xs font-medium text-zinc-500 uppercase mb-1">
              Auto-Destruct
            </span>
            <Timer />
          </div>
          <DestroyRoom />
        </div>

        <div className="flex items-center justify-between px-6 py-2 bg-zinc-900/30 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-zinc-400">
              Encrypted connection established
            </span>
            <span className="text-zinc-700 mx-2">•</span>
            <span className="text-sm text-zinc-500">
              {messages.length} messages
            </span>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}

export default Layout;
