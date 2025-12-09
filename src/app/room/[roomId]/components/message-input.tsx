"use client";

import { ArrowUp, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function MessageInput({
  onSend,
}: {
  onSend: (t: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <footer className="flex-none bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 p-4 md:p-6 pb-8">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
          <ArrowRight className="w-5 h-5" />
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Type a secure message..."
          className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-lg placeholder-zinc-600 pl-12 pr-14 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 shadow-lg"
        />

        <button
          onClick={handleSubmit}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg transition-all group"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-3 text-center">
        <p className="text-xs text-zinc-600">
          Messages are end-to-end encrypted and self-destruct after session
          expiry.
        </p>
      </div>
    </footer>
  );
}
