"use client";

import { Message } from "@/schema";

export default function MessageList({
  messages,
  currentUser,
}: {
  messages: Message[];
  currentUser: string;
}) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth pb-8 ">
      <div className="flex justify-center">
        <span className="text-xs text-zinc-600 bg-zinc-900/50 px-3 py-1 rounded-full border border-white/5">
          Today
        </span>
      </div>

      {messages.map((msg) => {
        const outgoing = msg.sender === currentUser;

        const time = new Date(msg.timeStamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={msg.id}
            className={`flex flex-col  gap-1 max-w-5xl mx-auto  ${
              outgoing ? "self-end items-end" : ""
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-1 ${
                outgoing ? "pr-1" : "pl-1"
              }`}
            >
              {outgoing ? (
                <>
                  <span className="text-sm text-zinc-500">You</span>
                  <div className="w-5 h-5 rounded-full bg-linear-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] text-white font-mono">
                    Y
                  </div>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-mono">
                    A
                  </div>
                  <span className="text-sm text-zinc-500">{msg.sender}</span>
                </>
              )}
            </div>

            <div
              className={`flex flex-col gap-2 items-${
                outgoing ? "end" : "start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-2xl shadow-sm max-w-[90%] md:max-w-xl relative group 
                  ${
                    outgoing
                      ? "bg-emerald-600 text-white rounded-tr-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm"
                  }`}
              >
                <p className="text-lg font-light leading-relaxed">{msg.text}</p>

                <span
                  className={`absolute bottom-2 text-xs text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity
                    ${outgoing ? "-left-12" : "-right-12"}
                  `}
                >
                  {time}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
