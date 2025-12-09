import { messageSchema } from "@/schema";
import { Realtime, InferRealtimeEvents } from "@upstash/realtime";
import z from "zod";
import { redis } from "./redis";

const schema = {
  chat: {
    message: messageSchema,
    destroyRoom: z.object({
      isDeleted: z.literal(true),
    }),
  },
};

export const realtime = new Realtime({
  schema,
  redis,
});
export type RealtimeEvents = InferRealtimeEvents<typeof schema>;
