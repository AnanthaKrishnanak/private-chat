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
    <>
      <MessageDisplay messages={messages ?? []} currentUser={userName!} />
      <MessageInput
        onSend={(text) => {
          sendMessage(text);
        }}
      />
    </>
  );
};

export default Room;
