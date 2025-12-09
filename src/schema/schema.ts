import z from "zod";

export const messageSchema = z.object({
  id: z.string(),
  sender: z.string().max(100),
  text: z.string().max(1000),
  token: z.string().optional(),
  timeStamp: z.number(),
  roomId: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
