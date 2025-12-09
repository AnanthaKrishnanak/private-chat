import client from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const DestroyRoom = () => {
  const { replace } = useRouter();
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await client.api.rooms.delete(null, {
        query: {
          roomId: roomId as string,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
      replace("/?error=room-destroyed");
    },
  });
  return (
    <button
      disabled={isPending}
      onClick={() => mutate()}
      className="group flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
    >
      <span className="text-sm">DESTROY</span>
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

export default DestroyRoom;
