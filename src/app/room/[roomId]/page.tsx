"use client";

import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { useRef, useState } from "react";

const Room = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Send message:", message);
    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Room {roomId}</h1>
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
        <div className="flex items-center gap-3">
          <input
            value={message}
            autoFocus
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && message.trim() && handleSend()
            }
            className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 
                       px-4 py-3 rounded-xl border border-zinc-700 
                       focus:outline-none focus:ring-2 focus:ring-green-600/40"
            placeholder="Type a message..."
          />

          <button
            onClick={handleSend}
            className="p-3 rounded-xl bg-green-600 hover:bg-green-500 transition 
                       text-white flex items-center justify-center"
            aria-label="Send Message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
