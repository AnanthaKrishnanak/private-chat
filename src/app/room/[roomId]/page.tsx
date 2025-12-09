"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import client from "@/lib/client";
import { useUserName } from "@/hooks/useUserName";
import MessageDisplay from "@/app/room/[roomId]/components/message-list";
import MessageInput from "@/app/room/[roomId]/components/message-input";

const Room = () => {
  const { roomId } = useParams();
  const { userName } = useUserName();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const { data } = await client.api.messages.get({
        query: {
          roomId: roomId as string,
        },
      });
      return data;
    },
    refetchInterval: 3000,
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (messageText: string) => {
      await client.api.messages.post(
        {
          sender: userName!,
          text: messageText,
        },
        {
          query: {
            roomId: roomId as string,
          },
        }
      );
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-zinc-900 to-black">
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h1 className="text-lg font-semibold text-white">Room #{roomId}</h1>
            <span className="text-sm text-zinc-500">
              {messages?.length || 0} messages
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6">
        <div className="max-w-4xl mx-auto">
          <MessageDisplay
            messages={messages || []}
            currentUserName={userName}
            isLoading={isLoading}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput onSendMessage={sendMessage} isPending={isPending} />
    </div>
  );
};

export default Room;
