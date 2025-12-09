import client from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useMessages = () => {
  const { roomId } = useParams();

  return useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const { data } = await client.api.messages.get({
        query: {
          roomId: roomId as string,
        },
      });
      return data ?? [];
    },
    refetchInterval: 2000,
  });
};
