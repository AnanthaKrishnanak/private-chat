"use client";

import MessageInput from "@/app/room/[roomId]/components/message-input";
import MessageDisplay from "@/app/room/[roomId]/components/message-list";
import { useMessages } from "@/hooks/useMessages";
import { useUserName } from "@/hooks/useUserName";
import client from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const Room = () => {
  const { roomId } = useParams();
  const { userName } = useUserName();
  const { replace } = useRouter();

  const { data: messages, isLoading, refetch } = useMessages();
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

  useRealtime({
    channels: [roomId as string],
    events: ["chat.message", "chat.destroyRoom"],
    onData: (data) => {
      if (data.event === "chat.message") {
        refetch();
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
          sendMessage(text);
        }}
      />
    </>
  );
};

export default Room;
