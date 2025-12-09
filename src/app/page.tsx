"use client";

import ErrorDisplay from "@/components/error-display";
import { useUserName } from "@/hooks/useUserName";
import client from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function IdentityCard() {
  const { userName } = useUserName();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      setError(null);
      const { data } = await client.api.rooms.create.post();
      return data;
    },
    onSuccess: (data) => {
      if (data?.roomId) {
        router.push(`/room/${data.roomId}`);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
      <div className="mb-6">
        <h2 className="text-neutral-300 text-sm uppercase tracking-wider">
          Your Identity
        </h2>

        <p className="mt-2 font-mono text-lg text-neutral-100 bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 select-none">
          {userName}
        </p>
      </div>

      <button
        className="w-full py-3 mt-3 bg-white text-black font-semibold tracking-wide uppercase rounded-none 
                     hover:bg-neutral-200 transition-all"
        onClick={() => createRoom()}
      >
        Create Secure Room
      </button>

      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
    </div>
  );
}

const errorMap: Record<string, { title: string; description: string }> = {
  "room-destroyed": {
    title: "Room Destroyed",
    description: "The room has been destroyed",
  },
  "room-not-found": {
    title: "Room Not Found",
    description: "The room does not exist",
  },
  "room-full": {
    title: "Room Full",
    description: "The room is full. Create a new room",
  },
  "room-expired": {
    title: "Room Expired",
    description: "The room has expired. Create a new room",
  },
};
export default function Home() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMetaData = error && errorMap[error];

  return (
    <main className="flex min-h-screen flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        {errorMetaData && (
          <ErrorDisplay
            title={errorMetaData.title}
            description={errorMetaData.description}
          />
        )}
        <div className="border-zinc-800">
          <IdentityCard />
        </div>
      </div>
    </main>
  );
}
