"use client";

import ErrorDisplay from "@/components/error-display";
import { useUserName } from "@/hooks/useUserName";
import client from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import { EncryptedText } from "@/components/ui/encrypted-text";
import Image from "next/image";

function IdentityCard() {
  const { userName } = useUserName();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      setError(null);
      const { data } = await client.api.rooms.create.post();
      return data;
    },
    onSuccess: (data) => {
      if (data?.roomId) {
        router.replace(`/room/${data.roomId}`);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  return (
    <div className="w-full max-w-lg p-8 rounded-2xl bg-neutral-900 shadow-xl">
      <div className="flex justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          width="64"
          height="64"
        >
          <path
            fill="#10b981"
            d="M24,9v12.855c0,.794-.435,1.52-1.135,1.894-.318,.17-.666,.254-1.013,.254-.417,0-.832-.121-1.192-.361l-2.922-1.642h-6.738c-2.386,0-4.381-1.683-4.876-3.923l-2.849,1.6c-.318,.214-.708,.325-1.108,.325-.349,0-.706-.084-1.031-.258-.7-.375-1.135-1.1-1.135-1.894V6C0,3.243,2.243,1,5,1h1c.552,0,1,.448,1,1s-.448,1-1,1h-1c-1.654,0-3,1.346-3,3v11.85c0,.022,0,.089,.078,.13s.133,.005,.151-.007l3.281-1.845c.15-.084,.318-.128,.49-.128H14.354c.732,0,1.436-.266,1.983-.75,.416-.366,1.046-.325,1.412,.087,.366,.414,.326,1.046-.087,1.412-.914,.807-2.088,1.25-3.308,1.25h-6.17c.414,1.161,1.514,2,2.816,2h7c.172,0,.341,.044,.491,.128l3.215,1.81c.083,.052,.138,.088,.216,.047,.078-.042,.078-.108,.078-.13V9c0-1.37-.925-2.564-2.25-2.906-.535-.138-.856-.683-.719-1.218s.68-.856,1.218-.719c2.208,.569,3.75,2.56,3.75,4.842Zm-11.5,1.5c.828,0,1.5-.672,1.5-1.5s-.672-1.5-1.5-1.5-1.5,.672-1.5,1.5,.672,1.5,1.5,1.5Zm-3.497-6.151c0-.006-.003-.01-.003-.016v-.833c0-1.93,1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5v.833c0,.006-.003,.01-.003,.016,1.18,.563,2.003,1.758,2.003,3.151v3c0,1.93-1.57,3.5-3.5,3.5h-4c-1.93,0-3.5-1.57-3.5-3.5v-3c0-1.392,.823-2.587,2.003-3.151Zm1.997-.849v.5h3v-.5c0-.827-.673-1.5-1.5-1.5s-1.5,.673-1.5,1.5Zm-2,7c0,.827,.673,1.5,1.5,1.5h4c.827,0,1.5-.673,1.5-1.5v-3c0-.827-.673-1.5-1.5-1.5h-4c-.827,0-1.5,.673-1.5,1.5v3Z"
          />
        </svg>
      </div>

      <div className="mb-6">
        <h2 className="text-neutral-300 text-sm uppercase tracking-wider">
          Your Identity
        </h2>

        <p className="mt-2 font-mono text-lg text-neutral-100 bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 select-none text-nowrap">
          <EncryptedText
            text={userName ?? "Loading..."}
            encryptedClassName="text-neutral-500"
            revealedClassName="dark:text-white text-black"
            revealDelayMs={50}
          />
        </p>
      </div>

      <button
        className="w-full flex items-center gap-2 justify-center bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs tracking-widest py-4 rounded-lg transition-all duration-200 uppercase hover:shadow-lg hover:shadow-zinc-100/10 active:scale-[0.98] cursor-pointer"
        onClick={() => !isPending && createRoom()}
        disabled={isPending}
      >
        Create Secure Room
        {isPending && <Loader className="animate-spin h-4 w-4" />}
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
