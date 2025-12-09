"use client";
import { Send } from "lucide-react";
import { useRef, useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isPending?: boolean;
}

const MessageInput = ({ onSendMessage, isPending }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim() && !isPending) {
      handleSend();
    }
  };

  return (
    <div className="border-t border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={message}
              autoFocus
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              className="w-full bg-zinc-800/80 text-white placeholder-zinc-500 
                         px-5 py-3.5 rounded-2xl border border-zinc-700/50
                         focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              placeholder="Type a message..."
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim() || isPending}
            className="p-3.5 rounded-2xl bg-linear-to-br from-green-600 to-green-700
                       hover:from-green-500 hover:to-green-600
                       disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed
                       transition-all duration-200 text-white flex items-center justify-center
                       shadow-lg shadow-green-600/20 hover:shadow-green-600/30
                       disabled:shadow-none active:scale-95"
            aria-label="Send Message"
          >
            <Send size={20} className={isPending ? "animate-pulse" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
