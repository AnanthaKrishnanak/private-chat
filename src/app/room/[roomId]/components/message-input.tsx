"use client";

import { ArrowUp, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

const messageSchema = z
  .string()
  .min(1, { message: "Message is required" })
  .max(1000, { message: "Maximum 1000 characters allowed" });

export default function MessageInput({
  onSend,
}: {
  onSend: (t: string) => void;
}) {
  const [text, setText] = useState("");

  const validation = useMemo(() => messageSchema.safeParse(text), [text]);

  const isValid = validation.success;

  const handleSubmit = () => {
    if (!isValid) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <footer className="flex-none bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 p-4 md:p-6 pb-8">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
          <ChevronRight className="w-5 h-5 animate-pulse" />
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type a secure message..."
          aria-invalid={!isValid}
          aria-describedby="message-error message-counter"
          className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-lg placeholder-zinc-600 pl-12 pr-14 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 shadow-lg"
        />

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          aria-disabled={!isValid}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg shadow-lg transition-all group
            ${
              !isValid
                ? "bg-zinc-700 cursor-not-allowed text-zinc-400"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }
          `}
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-2 pr-2 flex justify-end items-center">
        <p id="message-counter" className="text-xs text-zinc-500">
          {text.length}/1000
        </p>
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
