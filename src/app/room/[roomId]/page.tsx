"use client";

import MessageInput from "@/app/room/[roomId]/components/message-input";
import MessageDisplay from "@/app/room/[roomId]/components/message-list";
import { useMessages } from "@/hooks/useMessages";
import { useUserName } from "@/hooks/useUserName";
import client from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { Message } from "@/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const Room = () => {
  const { roomId } = useParams();
  const { userName } = useUserName();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useMessages();

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

    onMutate: async (messageText: string) => {
      await queryClient.cancelQueries({ queryKey: ["messages", roomId] });

      const previousMessages =
        queryClient.getQueryData<Message[]>(["messages", roomId]) || [];

      const optimisticMessage: Message = {
        id: "temp-" + Date.now(),
        sender: userName!,
        text: messageText,
        timeStamp: new Date().getTime(),
        roomId: roomId as string,
      };

      queryClient.setQueryData(["messages", roomId], (old: any[] = []) => [
        ...old,
        optimisticMessage,
      ]);

      return { previousMessages };
    },

    onError: (_err, _newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", roomId],
          context.previousMessages
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", roomId] });
    },
  });

  useRealtime({
    channels: [roomId as string],
    events: ["chat.message", "chat.destroyRoom"],
    onData: (data) => {
      if (data.event === "chat.message") {
        queryClient.invalidateQueries({ queryKey: ["messages", roomId] });
      }

      if (data.event === "chat.destroyRoom") {
        replace("/?error=room-destroyed");
      }
    },
  });

  return (
    <>
      <MessageDisplay messages={messages ?? []} currentUser={userName!} />

      <MessageInput
        onSend={(text) => {
          if (!text.trim()) return;
          sendMessage(text);
        }}
      />
    </>
  );
};

export default Room;
