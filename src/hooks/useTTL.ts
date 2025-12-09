import client from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useTTL = () => {
  const { roomId } = useParams();

  return useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const { data } = await client.api.rooms.ttl.get({
        query: {
          roomId: roomId as string,
        },
      });
      return data;
    },
    staleTime: 0,
  });
};
